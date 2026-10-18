"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { del } from "@vercel/blob";
import { z } from "zod";
import { exigirSesion } from "@/lib/auth/session";
import * as db from "@/db/admin-queries";
import { mensajeErrorAmigable } from "@/lib/db-errors";

export type EstadoProyecto = { error: string } | { ok: true } | null;

function revalidarPaginas(id?: number) {
  revalidatePath("/admin/proyectos");
  if (id) revalidatePath(`/admin/proyectos/${id}`);
  revalidatePath("/"); // el portafolio de la página pública usa este contenido
}

/** Borra una imagen de Vercel Blob sin tumbar la acción si falla (el registro en BD ya se borró). */
async function borrarBlobSeguro(url: string) {
  try {
    await del(url);
  } catch (error) {
    console.error("No se pudo borrar la imagen de Vercel Blob:", url, error);
  }
}

const proyectoSchema = z.object({
  titulo: z.string().trim().min(2, "El título debe tener al menos 2 caracteres").max(150),
  categoriaId: z.coerce.number().int("Elige una categoría."),
  anio: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? null : v),
    z.coerce.number().int().min(1900, "Año inválido.").max(2100, "Año inválido.").nullable()
  ),
  descripcion: z.string().trim().min(10, "La descripción debe tener al menos 10 caracteres").max(4000),
  publicado: z.coerce.boolean(),
});

function leerDatosProyecto(formData: FormData) {
  return proyectoSchema.safeParse({
    titulo: formData.get("titulo"),
    categoriaId: formData.get("categoriaId"),
    anio: formData.get("anio") ?? "",
    descripcion: formData.get("descripcion"),
    publicado: formData.get("publicado") === "on",
  });
}

export async function crearProyectoAction(
  _estadoPrevio: EstadoProyecto,
  formData: FormData
): Promise<EstadoProyecto> {
  await exigirSesion();
  const resultado = leerDatosProyecto(formData);
  if (!resultado.success) {
    return { error: resultado.error.issues[0]?.message ?? "Datos inválidos." };
  }

  let id: number;
  try {
    id = await db.crearProyecto(resultado.data);
  } catch (error) {
    return { error: mensajeErrorAmigable(error, "No se pudo crear el proyecto.") };
  }

  revalidarPaginas(id);
  redirect(`/admin/proyectos/${id}?creado=1`);
}

export async function actualizarProyectoAction(
  _estadoPrevio: EstadoProyecto,
  formData: FormData
): Promise<EstadoProyecto> {
  await exigirSesion();
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return { error: "Falta el identificador." };

  const resultado = leerDatosProyecto(formData);
  if (!resultado.success) {
    return { error: resultado.error.issues[0]?.message ?? "Datos inválidos." };
  }

  try {
    await db.actualizarProyecto(id, resultado.data);
    revalidarPaginas(id);
    return { ok: true };
  } catch (error) {
    return { error: mensajeErrorAmigable(error, "No se pudo guardar el proyecto.") };
  }
}

export async function eliminarProyectoAction(
  _estadoPrevio: EstadoProyecto,
  formData: FormData
): Promise<EstadoProyecto> {
  await exigirSesion();
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return { error: "Falta el identificador." };

  let urls: string[];
  try {
    urls = await db.eliminarProyecto(id);
  } catch (error) {
    return { error: mensajeErrorAmigable(error, "No se pudo eliminar el proyecto.") };
  }

  await Promise.all(urls.map(borrarBlobSeguro));
  revalidatePath("/admin/proyectos");
  revalidatePath("/");
  redirect("/admin/proyectos");
}

export async function alternarPublicadoAction(
  _estadoPrevio: EstadoProyecto,
  formData: FormData
): Promise<EstadoProyecto> {
  await exigirSesion();
  const id = Number(formData.get("id"));
  const publicado = formData.get("publicado") === "1";
  if (!Number.isInteger(id)) return { error: "Falta el identificador." };

  try {
    await db.alternarPublicadoProyecto(id, publicado);
    revalidarPaginas(id);
    return { ok: true };
  } catch (error) {
    return { error: mensajeErrorAmigable(error, "No se pudo actualizar.") };
  }
}

// ───────────────────────── Imágenes ─────────────────────────

const imagenSchema = z.object({
  url: z.string().trim().url("URL de imagen inválida."),
  altTexto: z.string().trim().max(150).optional(),
});

export async function agregarImagenAction(
  _estadoPrevio: EstadoProyecto,
  formData: FormData
): Promise<EstadoProyecto> {
  await exigirSesion();
  const proyectoId = Number(formData.get("proyectoId"));
  const resultado = imagenSchema.safeParse({
    url: formData.get("url"),
    altTexto: formData.get("altTexto") ?? undefined,
  });
  if (!Number.isInteger(proyectoId) || !resultado.success) {
    return {
      error: resultado.success ? "Falta el identificador del proyecto." : resultado.error.issues[0]?.message ?? "Datos inválidos.",
    };
  }

  try {
    await db.agregarImagenProyecto(proyectoId, {
      url: resultado.data.url,
      altTexto: resultado.data.altTexto?.length ? resultado.data.altTexto : null,
    });
    revalidarPaginas(proyectoId);
    return { ok: true };
  } catch (error) {
    return { error: mensajeErrorAmigable(error, "No se pudo guardar la imagen.") };
  }
}

export async function eliminarImagenAction(
  _estadoPrevio: EstadoProyecto,
  formData: FormData
): Promise<EstadoProyecto> {
  await exigirSesion();
  const imagenId = Number(formData.get("imagenId"));
  const proyectoId = Number(formData.get("proyectoId"));
  if (!Number.isInteger(imagenId)) return { error: "Falta el identificador." };

  try {
    const url = await db.eliminarImagenProyecto(imagenId);
    if (url) await borrarBlobSeguro(url);
    revalidarPaginas(proyectoId);
    return { ok: true };
  } catch (error) {
    return { error: mensajeErrorAmigable(error, "No se pudo eliminar la imagen.") };
  }
}

export async function actualizarAltTextoAction(
  _estadoPrevio: EstadoProyecto,
  formData: FormData
): Promise<EstadoProyecto> {
  await exigirSesion();
  const imagenId = Number(formData.get("imagenId"));
  const proyectoId = Number(formData.get("proyectoId"));
  const altTexto = String(formData.get("altTexto") ?? "");
  if (!Number.isInteger(imagenId)) return { error: "Falta el identificador." };

  try {
    await db.actualizarAltTextoImagen(imagenId, altTexto);
    revalidarPaginas(proyectoId);
    return { ok: true };
  } catch (error) {
    return { error: mensajeErrorAmigable(error, "No se pudo guardar el texto alternativo.") };
  }
}

export async function moverImagenAction(
  _estadoPrevio: EstadoProyecto,
  formData: FormData
): Promise<EstadoProyecto> {
  await exigirSesion();
  const proyectoId = Number(formData.get("proyectoId"));
  const imagenId = Number(formData.get("imagenId"));
  const direccion = formData.get("direccion");
  if (
    !Number.isInteger(proyectoId) ||
    !Number.isInteger(imagenId) ||
    (direccion !== "arriba" && direccion !== "abajo")
  ) {
    return { error: "Datos inválidos." };
  }

  try {
    await db.moverImagenProyecto(proyectoId, imagenId, direccion);
    revalidarPaginas(proyectoId);
    return { ok: true };
  } catch (error) {
    return { error: mensajeErrorAmigable(error, "No se pudo mover la imagen.") };
  }
}
