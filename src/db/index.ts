/**
 * Conexión a la base de datos (Neon, PostgreSQL) usando el driver
 * serverless de Neon sobre HTTP, pensado para funciones serverless
 * de Vercel: no mantiene una conexión abierta entre peticiones.
 *
 * Uso en cualquier parte del servidor (rutas de API, Server Components):
 *   import { db } from "@/db";
 *   import { categorias } from "@/db/schema";
 *   const filas = await db.select().from(categorias);
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "Falta DATABASE_URL. Copia .env.example como .env.local y pega la cadena de conexión de Neon (ver docs/bitacora/paso-04-conexion-base-de-datos.md)."
  );
}

const sql = neon(process.env.DATABASE_URL);

export const db = drizzle(sql, { schema });
