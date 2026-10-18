/**
 * Crea (o actualiza la contraseña de) el usuario del panel de
 * administración en la base de datos real de Neon.
 *
 * Por defecto usa el correo de la empresa y una contraseña; para usar
 * otros valores, pásalos como variables de entorno:
 *
 *   ADMIN_EMAIL=otro@correo.com ADMIN_PASSWORD=otra-clave npm run db:crear-admin
 *
 * Uso normal (correo y contraseña de la empresa, ya configurados abajo):
 *   npm run db:crear-admin
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { config } from "dotenv";
import { eq } from "drizzle-orm";
import { usuariosAdmin } from "./schema";
import { hashPassword } from "../lib/auth/password";

config({ path: ".env.local" });

const CORREO_POR_DEFECTO = "torrefuertearquitectos@gmail.com";
const PASSWORD_POR_DEFECTO = "torrefuerte2026";

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "Falta DATABASE_URL. Copia .env.example como .env.local y pega la cadena de conexión de Neon."
    );
  }

  const email = (process.env.ADMIN_EMAIL ?? CORREO_POR_DEFECTO).trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? PASSWORD_POR_DEFECTO;

  if (password.length < 8) {
    throw new Error("La contraseña debe tener al menos 8 caracteres.");
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);

  const passwordHash = await hashPassword(password);

  const [existente] = await db
    .select({ id: usuariosAdmin.id })
    .from(usuariosAdmin)
    .where(eq(usuariosAdmin.email, email))
    .limit(1);

  if (existente) {
    await db
      .update(usuariosAdmin)
      .set({ passwordHash })
      .where(eq(usuariosAdmin.id, existente.id));
    console.log(`Contraseña actualizada para ${email}.`);
  } else {
    await db.insert(usuariosAdmin).values({ email, passwordHash });
    console.log(`Usuario administrador creado: ${email}.`);
  }

  console.log("Ya puedes iniciar sesión en /admin/login con ese correo y contraseña.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("No se pudo crear/actualizar el usuario administrador:");
    console.error(error);
    process.exit(1);
  });
