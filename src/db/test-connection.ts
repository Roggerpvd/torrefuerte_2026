/**
 * Prueba rápida de conexión: confirma que DATABASE_URL funciona y que
 * las 7 tablas del Paso 3 ya existen. Se ejecuta con
 * `npm run db:test-connection` después de migrar.
 */
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env.local" });

async function run() {
  if (!process.env.DATABASE_URL) {
    throw new Error("Falta DATABASE_URL en .env.local");
  }
  const sql = neon(process.env.DATABASE_URL);

  const [{ ahora }] = await sql`select now() as ahora`;
  console.log("Conexión OK. Hora del servidor:", ahora);

  const tablas = await sql`
    select table_name from information_schema.tables
    where table_schema = 'public'
    order by table_name
  `;
  console.log(
    `Tablas encontradas (${tablas.length}):`,
    tablas.map((t) => t.table_name).join(", ")
  );
}

run().catch((err) => {
  console.error("Fallo la conexión:", err.message);
  process.exit(1);
});
