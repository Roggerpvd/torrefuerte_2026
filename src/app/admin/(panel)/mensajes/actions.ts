"use server";

import { revalidatePath } from "next/cache";
import { exigirSesion } from "@/lib/auth/session";
import * as db from "@/db/admin-queries";

function revalidarPaginas() {
  revalidatePath("/admin/mensajes");
  revalidatePath("/admin"); // el contador de no leídos vive en el encabezado y el resumen
}

export async function marcarMensajeAction(formData: FormData): Promise<void> {
  await exigirSesion();
  const id = Number(formData.get("id"));
  const leido = formData.get("leido") === "true";
  if (!Number.isInteger(id)) return;
  await db.marcarMensaje(id, leido);
  revalidarPaginas();
}

export async function eliminarMensajeAction(formData: FormData): Promise<void> {
  await exigirSesion();
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;
  await db.eliminarMensaje(id);
  revalidarPaginas();
}
