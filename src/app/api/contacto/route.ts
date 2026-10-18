import { count, eq, gt, and } from "drizzle-orm";
import { db } from "@/db";
import { mensajesContacto, servicios, categorias } from "@/db/schema";
import { contactoSchema } from "@/lib/validation/contacto";

// Límite de envíos por correo en la ventana de tiempo, para frenar
// abuso sin necesitar un servicio externo de rate limiting.
const VENTANA_MINUTOS = 10;
const MAX_MENSAJES_POR_VENTANA = 3;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { ok: false, error: "El cuerpo de la solicitud no es JSON válido." },
      { status: 400 }
    );
  }

  const resultado = contactoSchema.safeParse(body);
  if (!resultado.success) {
    const primerError = resultado.error.issues[0]?.message ?? "Datos inválidos.";
    return Response.json({ ok: false, error: primerError }, { status: 400 });
  }

  const {
    nombre,
    email,
    telefono,
    servicioId,
    categoriaId,
    ubicacion,
    metrajeM2,
    plazoDeseado,
    presupuestoReferencial,
    mensaje,
    sitio_web,
  } = resultado.data;

  // Honeypot: si este campo invisible viene relleno, es casi seguro un bot.
  // Respondemos como si todo hubiera salido bien, pero no guardamos nada,
  // para no revelarle al bot que fue detectado.
  if (sitio_web && sitio_web.trim().length > 0) {
    return Response.json({ ok: true });
  }

  try {
    const desde = new Date(Date.now() - VENTANA_MINUTOS * 60 * 1000);
    const [{ total }] = await db
      .select({ total: count() })
      .from(mensajesContacto)
      .where(
        and(
          eq(mensajesContacto.email, email),
          gt(mensajesContacto.creadoEn, desde)
        )
      );

    if (total >= MAX_MENSAJES_POR_VENTANA) {
      return Response.json(
        {
          ok: false,
          error:
            "Ya enviaste varios mensajes en los últimos minutos. Intenta de nuevo más tarde.",
        },
        { status: 429 }
      );
    }

    await db.insert(mensajesContacto).values({
      nombre,
      email,
      telefono,
      servicioId: servicioId ?? null,
      categoriaId: categoriaId ?? null,
      ubicacion: ubicacion && ubicacion.trim().length > 0 ? ubicacion.trim() : null,
      metrajeM2: metrajeM2 ?? null,
      plazoDeseado: plazoDeseado ?? null,
      presupuestoReferencial: presupuestoReferencial ?? null,
      mensaje,
    });

    // Se resuelven los nombres (no solo los id) para que el aviso por
    // correo sirva de cotización preliminar sin tener que abrir el panel.
    const [servicioNombre, categoriaNombre] = await Promise.all([
      resolverNombreServicio(servicioId),
      resolverNombreCategoria(categoriaId),
    ]);

    // El aviso por correo es opcional: si no hay credenciales de Resend
    // configuradas, el mensaje igual queda guardado en la base de datos
    // y se puede leer desde el panel de administración (Paso 7).
    await enviarNotificacionSiEstaConfigurada({
      nombre,
      email,
      telefono,
      servicioNombre,
      categoriaNombre,
      ubicacion: ubicacion && ubicacion.trim().length > 0 ? ubicacion.trim() : null,
      metrajeM2: metrajeM2 ?? null,
      plazoDeseado: plazoDeseado ?? null,
      presupuestoReferencial: presupuestoReferencial ?? null,
      mensaje,
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Error al guardar el mensaje de contacto:", error);
    return Response.json(
      { ok: false, error: "No se pudo enviar el mensaje. Intenta de nuevo." },
      { status: 500 }
    );
  }
}

/** Busca el título de un servicio por id; null si no vino o no existe. */
async function resolverNombreServicio(id: number | null | undefined): Promise<string | null> {
  if (!id) return null;
  const [fila] = await db
    .select({ nombre: servicios.titulo })
    .from(servicios)
    .where(eq(servicios.id, id))
    .limit(1);
  return fila?.nombre ?? null;
}

/** Busca el nombre de una categoría por id; null si no vino o no existe. */
async function resolverNombreCategoria(id: number | null | undefined): Promise<string | null> {
  if (!id) return null;
  const [fila] = await db
    .select({ nombre: categorias.nombre })
    .from(categorias)
    .where(eq(categorias.id, id))
    .limit(1);
  return fila?.nombre ?? null;
}

async function enviarNotificacionSiEstaConfigurada(datos: {
  nombre: string;
  email: string;
  telefono: string;
  servicioNombre: string | null;
  categoriaNombre: string | null;
  ubicacion: string | null;
  metrajeM2: number | null;
  plazoDeseado: string | null;
  presupuestoReferencial: string | null;
  mensaje: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const destinatario = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !destinatario) return;

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: "Torre Fuerte <onboarding@resend.dev>",
      to: destinatario,
      replyTo: datos.email,
      subject: `Nuevo mensaje de contacto: ${datos.nombre}`,
      text: [
        `Nombre: ${datos.nombre}`,
        `Correo: ${datos.email}`,
        `Celular: ${datos.telefono}`,
        `Servicio de interés: ${datos.servicioNombre ?? "No especificado"}`,
        `Categoría de interés: ${datos.categoriaNombre ?? "No especificada"}`,
        `Ubicación del proyecto: ${datos.ubicacion ?? "No especificada"}`,
        `Metraje aproximado: ${datos.metrajeM2 ? `${datos.metrajeM2} m²` : "No especificado"}`,
        `Plazo deseado: ${datos.plazoDeseado ?? "No especificado"}`,
        `Presupuesto referencial: ${datos.presupuestoReferencial ?? "No especificado"}`,
        "",
        datos.mensaje,
      ].join("\n"),
    });
  } catch (error) {
    // El envío de correo es un extra: si falla, no debe afectar la
    // respuesta al usuario ni impedir que el mensaje quede guardado.
    console.error("No se pudo enviar la notificación por correo:", error);
  }
}
