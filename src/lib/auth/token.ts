/**
 * Firma y verificación del token de sesión (HMAC-SHA256 con AUTH_SECRET),
 * sin ninguna dependencia de next/headers. Se mantiene separado de
 * session.ts (que sí usa cookies()) para que el proxy -- que corre antes
 * de que exista un contexto de petición de Server Component -- pueda
 * importar solo esto, sin arrastrar next/headers a su bundle.
 */
import { createHmac, timingSafeEqual } from "node:crypto";

export const COOKIE_SESION = "tf_admin_sesion";
export const DURACION_SESION_MS = 7 * 24 * 60 * 60 * 1000; // 7 días

export type SesionPayload = {
  usuarioId: number;
  email: string;
  expira: number; // epoch ms
};

function secreto(): string {
  const valor = process.env.AUTH_SECRET;
  if (!valor) {
    throw new Error(
      "Falta AUTH_SECRET. Genera uno con `openssl rand -base64 32` y agrégalo a .env.local."
    );
  }
  return valor;
}

function firmar(payloadB64: string): string {
  return createHmac("sha256", secreto()).update(payloadB64).digest("base64url");
}

export function crearTokenSesion(datos: Omit<SesionPayload, "expira">): string {
  const payload: SesionPayload = {
    ...datos,
    expira: Date.now() + DURACION_SESION_MS,
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const firma = firmar(payloadB64);
  return `${payloadB64}.${firma}`;
}

export function verificarTokenSesion(token: string | undefined): SesionPayload | null {
  if (!token) return null;
  const [payloadB64, firma] = token.split(".");
  if (!payloadB64 || !firma) return null;

  const firmaEsperada = firmar(payloadB64);
  const a = Buffer.from(firma);
  const b = Buffer.from(firmaEsperada);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf8")
    ) as SesionPayload;
    if (typeof payload.expira !== "number" || payload.expira < Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}
