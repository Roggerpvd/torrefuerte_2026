/**
 * Configuración de drizzle-kit: dónde está el esquema, a dónde escribir
 * las migraciones generadas y con qué base de datos conectarse.
 * Se usa solo desde la terminal (`npm run db:generate`, `db:migrate`),
 * nunca en el código de la aplicación.
 */
import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
  throw new Error("Falta DATABASE_URL en .env.local");
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
});
