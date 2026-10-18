"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { obtenerUsuarioAdminPorEmail, registrarAcceso } from "@/db/admin-queries";
import { verifyPassword } from "@/lib/auth/password";
import { iniciarSesion } from "@/lib/auth/session";

const loginSchema = z.object({
  email: z.string().trim().min(1, "Ingresa tu correo").email("Correo inválido"),
  password: z.string().min(1, "Ingresa tu contraseña"),
});

export type EstadoLogin = { error: string } | null;

export async function loginAction(
  _estadoPrevio: EstadoLogin,
  formData: FormData
): Promise<EstadoLogin> {
  const resultado = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!resultado.success) {
    return { error: resultado.error.issues[0]?.message ?? "Datos inválidos." };
  }

  const { email, password } = resultado.data;

  // Mensaje genérico en ambos casos (correo inexistente o contraseña
  // incorrecta) para no revelar qué correos existen en el sistema.
  const credencialesInvalidas = { error: "Correo o contraseña incorrectos." };

  const usuario = await obtenerUsuarioAdminPorEmail(email);
  if (!usuario) return credencialesInvalidas;

  const passwordValido = await verifyPassword(password, usuario.passwordHash);
  if (!passwordValido) return credencialesInvalidas;

  await iniciarSesion({ usuarioId: usuario.id, email: usuario.email });
  await registrarAcceso(usuario.id);

  redirect("/admin");
}
