"use server";

import { z } from "zod";
import { exigirSesion } from "@/lib/auth/session";
import { obtenerUsuarioAdminPorEmail, actualizarPasswordUsuario } from "@/db/admin-queries";
import { hashPassword, verifyPassword } from "@/lib/auth/password";

export type EstadoCuenta = { error: string } | { ok: true } | null;

const cambiarPasswordSchema = z
  .object({
    actual: z.string().min(1, "Ingresa tu contraseña actual"),
    nueva: z.string().min(8, "La nueva contraseña debe tener al menos 8 caracteres"),
    confirmar: z.string().min(1, "Confirma la nueva contraseña"),
  })
  .refine((datos) => datos.nueva === datos.confirmar, {
    message: "Las contraseñas nuevas no coinciden",
    path: ["confirmar"],
  });

export async function cambiarPasswordAction(
  _estadoPrevio: EstadoCuenta,
  formData: FormData
): Promise<EstadoCuenta> {
  const sesion = await exigirSesion();

  const resultado = cambiarPasswordSchema.safeParse({
    actual: formData.get("actual"),
    nueva: formData.get("nueva"),
    confirmar: formData.get("confirmar"),
  });
  if (!resultado.success) {
    return { error: resultado.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const usuario = await obtenerUsuarioAdminPorEmail(sesion.email);
  if (!usuario) return { error: "No se encontró el usuario." };

  const passwordValido = await verifyPassword(resultado.data.actual, usuario.passwordHash);
  if (!passwordValido) return { error: "La contraseña actual no es correcta." };

  const nuevoHash = await hashPassword(resultado.data.nueva);
  await actualizarPasswordUsuario(usuario.id, nuevoHash);

  return { ok: true };
}
