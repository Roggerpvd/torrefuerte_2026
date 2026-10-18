/**
 * Carga inicial: llena la base de datos con el portafolio y los servicios
 * reales (src/db/data/), y apunta cada imagen a su versión ya optimizada
 * en public/imagenes/proyectos/ (generada por scripts/optimizar-imagenes.mjs).
 *
 * Es una carga completa, no un "upsert": primero vacía las tablas de
 * contenido y las vuelve a llenar, así se puede correr de nuevo sin
 * duplicar filas. No toca mensajes_contacto ni usuarios_admin.
 *
 * Uso:
 *   npm run db:seed
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { config } from "dotenv";
import {
  categorias,
  proyectos,
  proyectoImagenes,
  servicios,
  servicioItems,
} from "./schema";
import { categoriasSeed, proyectosSeed } from "./data/proyectos";
import { serviciosSeed } from "./data/servicios";

config({ path: ".env.local" });

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("Falta DATABASE_URL en .env.local");
  }
  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);

  console.log("Vaciando tablas de contenido...");
  await db.delete(proyectoImagenes);
  await db.delete(proyectos);
  await db.delete(categorias);
  await db.delete(servicioItems);
  await db.delete(servicios);

  console.log("Insertando categorías...");
  const categoriasInsertadas = await db
    .insert(categorias)
    .values(
      categoriasSeed.map((c, i) => ({
        nombre: c.nombre,
        slug: c.slug,
        orden: i,
      }))
    )
    .returning();
  const idPorSlugCategoria = new Map(
    categoriasInsertadas.map((c) => [c.slug, c.id])
  );

  console.log(`Insertando ${proyectosSeed.length} proyectos...`);
  for (let i = 0; i < proyectosSeed.length; i++) {
    const p = proyectosSeed[i];
    const categoriaId = idPorSlugCategoria.get(p.categoriaSlug);
    if (!categoriaId) {
      throw new Error(`Categoría no encontrada: ${p.categoriaSlug}`);
    }

    const [proyectoInsertado] = await db
      .insert(proyectos)
      .values({
        categoriaId,
        titulo: p.titulo,
        anio: p.anio,
        descripcion: p.descripcion,
        orden: i,
      })
      .returning();

    if (p.imagenes.length > 0) {
      await db.insert(proyectoImagenes).values(
        p.imagenes.map((_, idx) => ({
          proyectoId: proyectoInsertado.id,
          url: `/imagenes/proyectos/${p.slug}/${idx + 1}.webp`,
          altTexto: p.titulo,
          orden: idx,
        }))
      );
    }
  }

  console.log("Insertando servicios...");
  for (let i = 0; i < serviciosSeed.length; i++) {
    const s = serviciosSeed[i];
    const [servicioInsertado] = await db
      .insert(servicios)
      .values({ titulo: s.titulo, icono: s.icono, orden: i })
      .returning();

    await db.insert(servicioItems).values(
      s.items.map((texto, idx) => ({
        servicioId: servicioInsertado.id,
        texto,
        orden: idx,
      }))
    );
  }

  console.log(
    `Listo: ${categoriasInsertadas.length} categorías, ${proyectosSeed.length} proyectos y ${serviciosSeed.length} grupos de servicios.`
  );
}

main().catch((err) => {
  console.error("Fallo la carga inicial:", err.message);
  process.exit(1);
});
