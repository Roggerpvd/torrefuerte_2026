"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { exigirSesion } from "@/lib/auth/session";
import * as db from "@/db/admin-queries";
import { slugify } from "@/lib/slugify";
import { mensajeErrorAmigable } from "@/lib/db-errors";

const datosSchema = z.object({
  nombre: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres").max(60),
});

export type EstadoCategoria = { error: string } | { ok: true } | null;

function revalidarPaginas() {
  revalidatePath("/admin/categorias");
  revalidatePath("/"); // la sección de portafolio muestra las categorías
}

export async function crearCategoriaAction(
  _estadoPrevio: EstadoCategoria,
  formData: FormData
): Promise<EstadoCategoria> {
  await exigirSesion();
  const resultado = datosSchema.safeParse({ nombre: formData.get("nombre") });
  if (!resultado.success) {
    return { error: resultado.error.issues[0]?.message ?? "Datos inválidos." };
  }

  try {
    await db.crearCategoria({
      nombre: resultado.data.nombre,
      slug: slugify(resultado.data.nombre),
    });
    revalidarPaginas();
    return { ok: true };
  } catch (error) {
    return { error: mensajeErrorAmigable(error, "No se pudo crear la categoría.") };
  }
}

export async function actualizarCategoriaAction(
  _estadoPrevio: EstadoCategoria,
  formData: FormData
): Promise<EstadoCategoria> {
  await exigirSesion();
  const id = Number(formData.get("id"));
  const resultado = datosSchema.safeParse({ nombre: formData.get("nombre") });
  if (!Number.isInteger(id) || !resultado.success) {
    return { error: resultado.success ? "Falta el identificador." : resultado.error.issues[0]?.message ?? "Datos inválidos." };
  }

  try {
    await db.actualizarCategoria(id, {
      nombre: resultado.data.nombre,
      slug: slugify(resultado.data.nombre),
    });
    revalidarPaginas();
    return { ok: true };
  } catch (error) {
    return { error: mensajeErrorAmigable(error, "No se pudo actualizar la categoría.") };
  }
}

export async function eliminarCategoriaAction(
  _estadoPrevio: EstadoCategoria,
  formData: FormData
): Promise<EstadoCategoria> {
  await exigirSesion();
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return { error: "Falta el identificador." };

  try {
    await db.eliminarCategoria(id);
    revalidarPaginas();
    return { ok: true };
  } catch (error) {
    return { error: mensajeErrorAmigable(error, "No se pudo eliminar la categoría.") };
  }
}
