/**
 * Hash y verificación de contraseñas con scrypt (módulo `crypto` de Node,
 * sin dependencias externas como bcrypt). Cada hash lleva su propia sal
 * aleatoria, guardada junto al resultado en el mismo string:
 *
 *   "<sal en hex>:<hash en hex>"
 *
 * Así no hace falta una columna aparte para la sal.
 */
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);
const LARGO_CLAVE = 64;

export async function hashPassword(password: string): Promise<string> {
  const sal = randomBytes(16).toString("hex");
  const clave = (await scryptAsync(password, sal, LARGO_CLAVE)) as Buffer;
  return `${sal}:${clave.toString("hex")}`;
}

export async function verifyPassword(
  password: string,
  hashGuardado: string
): Promise<boolean> {
  const [sal, claveHex] = hashGuardado.split(":");
  if (!sal || !claveHex) return false;

  const claveGuardada = Buffer.from(claveHex, "hex");
  const claveIngresada = (await scryptAsync(password, sal, LARGO_CLAVE)) as Buffer;

  if (claveGuardada.length !== claveIngresada.length) return false;
  return timingSafeEqual(claveGuardada, claveIngresada);
}
