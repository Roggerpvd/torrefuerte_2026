"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { exigirSesion } from "@/lib/auth/session";
import * as db from "@/db/admin-queries";
import { mensajeErrorAmigable } from "@/lib/db-errors";

export type EstadoServicio = { error: string } | { ok: true } | null;

function revalidarPaginas() {
  revalidatePath("/admin/servicios");
  revalidatePath("/"); // la sección de servicios se arma con este contenido
}

const servicioSchema = z.object({
  titulo: z.string().trim().min(2, "El título debe tener al menos 2 caracteres").max(60),
});

export async function crearServicioAction(
  _estadoPrevio: EstadoServicio,
  formData: FormData
): Promise<EstadoServicio> {
  await exigirSesion();
  const resultado = servicioSchema.safeParse({ titulo: formData.get("titulo") });
  if (!resultado.success) {
    return { error: resultado.error.issues[0]?.message ?? "Datos inválidos." };
  }
  try {
    await db.crearServicio({ titulo: resultado.data.titulo, icono: null });
    revalidarPaginas();
    return { ok: true };
  } catch (error) {
    return { error: mensajeErrorAmigable(error, "No se pudo crear el servicio.") };
  }
}

export async function actualizarServicioAction(
  _estadoPrevio: EstadoServicio,
  formData: FormData
): Promise<EstadoServicio> {
  await exigirSesion();
  const id = Number(formData.get("id"));
  const resultado = servicioSchema.safeParse({ titulo: formData.get("titulo") });
  if (!Number.isInteger(id) || !resultado.success) {
    return { error: resultado.success ? "Falta el identificador." : resultado.error.issues[0]?.message ?? "Datos inválidos." };
  }
  try {
    await db.actualizarServicio(id, { titulo: resultado.data.titulo, icono: null });
    revalidarPaginas();
    return { ok: true };
  } catch (error) {
    return { error: mensajeErrorAmigable(error, "No se pudo actualizar el servicio.") };
  }
}

export async function eliminarServicioAction(
  _estadoPrevio: EstadoServicio,
  formData: FormData
): Promise<EstadoServicio> {
  await exigirSesion();
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return { error: "Falta el identificador." };
  try {
    await db.eliminarServicio(id);
    revalidarPaginas();
    return { ok: true };
  } catch (error) {
    return { error: mensajeErrorAmigable(error, "No se pudo eliminar el servicio.") };
  }
}

const itemSchema = z.object({
  texto: z.string().trim().min(2, "Debe tener al menos 2 caracteres").max(150),
});

export async function agregarItemAction(
  _estadoPrevio: EstadoServicio,
  formData: FormData
): Promise<EstadoServicio> {
  await exigirSesion();
  const servicioId = Number(formData.get("servicioId"));
  const resultado = itemSchema.safeParse({ texto: formData.get("texto") });
  if (!Number.isInteger(servicioId) || !resultado.success) {
    return { error: resultado.success ? "Falta el identificador." : resultado.error.issues[0]?.message ?? "Datos inválidos." };
  }
  try {
    await db.agregarItemServicio(servicioId, resultado.data.texto);
    revalidarPaginas();
    return { ok: true };
  } catch (error) {
    return { error: mensajeErrorAmigable(error, "No se pudo agregar el ítem.") };
  }
}

export async function actualizarItemAction(
  _estadoPrevio: EstadoServicio,
  formData: FormData
): Promise<EstadoServicio> {
  await exigirSesion();
  const id = Number(formData.get("id"));
  const resultado = itemSchema.safeParse({ texto: formData.get("texto") });
  if (!Number.isInteger(id) || !resultado.success) {
    return { error: resultado.success ? "Falta el identificador." : resultado.error.issues[0]?.message ?? "Datos inválidos." };
  }
  try {
    await db.actualizarItemServicio(id, resultado.data.texto);
    revalidarPaginas();
    return { ok: true };
  } catch (error) {
    return { error: mensajeErrorAmigable(error, "No se pudo actualizar el ítem.") };
  }
}

export async function eliminarItemAction(
  _estadoPrevio: EstadoServicio,
  formData: FormData
): Promise<EstadoServicio> {
  await exigirSesion();
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return { error: "Falta el identificador." };
  try {
    await db.eliminarItemServicio(id);
    revalidarPaginas();
    return { ok: true };
  } catch (error) {
    return { error: mensajeErrorAmigable(error, "No se pudo eliminar el ítem.") };
  }
}
