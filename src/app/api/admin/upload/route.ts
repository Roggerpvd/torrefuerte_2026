/**
 * Sube una imagen de proyecto a Vercel Blob y devuelve su URL pública.
 * Protegido: solo responde si hay una sesión de administrador válida
 * (ver src/lib/auth/session.ts). El formulario del panel llama a esta
 * ruta antes de guardar el proyecto, y guarda la URL que devuelve en
 * proyecto_imagenes (ver src/db/admin-queries.ts, agregarImagenProyecto).
 */
import { put } from "@vercel/blob";
import { obtenerSesion } from "@/lib/auth/session";

const TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const TAMANO_MAXIMO_BYTES = 10 * 1024 * 1024; // 10 MB

export async function POST(request: Request) {
  const sesion = await obtenerSesion();
  if (!sesion) {
    return Response.json({ ok: false, error: "No autorizado." }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return Response.json(
      {
        ok: false,
        error:
          "Falta configurar el almacén de imágenes (BLOB_READ_WRITE_TOKEN). Revisa .env.local o, en producción, conecta un Vercel Blob Store al proyecto.",
      },
      { status: 500 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json(
      { ok: false, error: "No se pudo leer el archivo enviado." },
      { status: 400 }
    );
  }

  const archivo = formData.get("archivo");
  if (!(archivo instanceof File)) {
    return Response.json({ ok: false, error: "Falta el archivo." }, { status: 400 });
  }

  if (!TIPOS_PERMITIDOS.includes(archivo.type)) {
    return Response.json(
      { ok: false, error: "Formato no permitido. Usa JPG, PNG, WEBP o AVIF." },
      { status: 400 }
    );
  }

  if (archivo.size > TAMANO_MAXIMO_BYTES) {
    return Response.json(
      { ok: false, error: "La imagen pesa demasiado (máximo 10 MB)." },
      { status: 400 }
    );
  }

  try {
    const extension = archivo.name.split(".").pop() || "jpg";
    const nombreArchivo = `proyectos/${crypto.randomUUID()}.${extension}`;

    const resultado = await put(nombreArchivo, archivo, {
      access: "public",
      addRandomSuffix: false,
    });

    return Response.json({ ok: true, url: resultado.url });
  } catch (error) {
    console.error("Error al subir la imagen a Vercel Blob:", error);
    return Response.json(
      { ok: false, error: "No se pudo subir la imagen. Intenta de nuevo." },
      { status: 500 }
    );
  }
}
