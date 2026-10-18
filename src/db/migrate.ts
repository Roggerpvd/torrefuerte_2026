/**
 * Aplica las migraciones pendientes (carpeta ./drizzle) sobre la base de
 * datos que apunte DATABASE_URL. Se ejecuta con `npm run db:migrate`,
 * nunca se importa desde la aplicación.
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import { config } from "dotenv";

config({ path: ".env.local" });

async function run() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "Falta DATABASE_URL en .env.local. Copia la cadena de conexión desde el panel de Neon (ver docs/bitacora/paso-04-conexion-base-de-datos.md)."
    );
  }
  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);

  console.log("Aplicando migraciones...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Listo: la base de datos quedó al día.");
}

run().catch((err) => {
  console.error("No se pudo migrar:", err.message);
  process.exit(1);
});
