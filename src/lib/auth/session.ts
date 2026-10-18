/**
 * Sesión del panel de administración, en una cookie httpOnly (ver
 * src/lib/auth/token.ts para la firma/verificación del token en sí).
 * Estas funciones usan cookies() de next/headers, así que solo se pueden
 * llamar desde Server Components, Server Actions o Route Handlers -- no
 * desde el proxy, que las importa por separado desde token.ts.
 */
import "server-only";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  COOKIE_SESION,
  DURACION_SESION_MS,
  crearTokenSesion,
  verificarTokenSesion,
  type SesionPayload,
} from "./token";

export type { SesionPayload };

/** Crea la sesión y la guarda como cookie httpOnly. Se llama desde el login. */
export async function iniciarSesion(datos: Omit<SesionPayload, "expira">) {
  const token = crearTokenSesion(datos);
  const almacen = await cookies();
  almacen.set(COOKIE_SESION, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DURACION_SESION_MS / 1000,
  });
}

/** Borra la cookie de sesión. Se llama desde el logout. */
export async function cerrarSesion() {
  const almacen = await cookies();
  almacen.delete(COOKIE_SESION);
}

/**
 * Lee y valida la sesión actual desde la cookie. Es la verificación
 * "fuerte": se usa en cada Server Action y Server Component del panel,
 * no solo en el proxy (que solo hace una comprobación optimista sobre la
 * firma, sin esto).
 */
export async function obtenerSesion(): Promise<SesionPayload | null> {
  const almacen = await cookies();
  return verificarTokenSesion(almacen.get(COOKIE_SESION)?.value);
}

/** Igual que obtenerSesion, pero redirige a /admin/login si no hay sesión. */
export async function exigirSesion(): Promise<SesionPayload> {
  const sesion = await obtenerSesion();
  if (!sesion) {
    redirect("/admin/login");
  }
  return sesion;
}
