/**
 * Consultas de solo lectura que usan las páginas públicas (portafolio,
 * servicios). Se mantienen separadas del esquema para que las páginas no
 * tengan que conocer la forma exacta de las tablas.
 */
import { asc, eq } from "drizzle-orm";
import { db } from "./index";
import {
  categorias,
  proyectos,
  proyectoImagenes,
  servicios,
  servicioItems,
} from "./schema";

export type ProyectoConImagenes = {
  id: number;
  titulo: string;
  anio: number | null;
  descripcion: string;
  categoriaId: number;
  categoriaNombre: string;
  categoriaSlug: string;
  imagenes: { url: string; altTexto: string | null }[];
};

/**
 * Todas las categorías con sus proyectos publicados (cada uno con sus
 * imágenes, ya en el orden guardado). Pensada para la página de
 * portafolio, que filtra por categoría en el cliente sin volver a pedir
 * datos al servidor.
 */
export async function getPortafolio(): Promise<{
  categorias: { id: number; nombre: string; slug: string }[];
  proyectos: ProyectoConImagenes[];
}> {
  const [categoriasFilas, proyectosFilas, imagenesFilas] = await Promise.all([
    db.select().from(categorias).orderBy(asc(categorias.orden)),
    db
      .select()
      .from(proyectos)
      .where(eq(proyectos.publicado, true))
      .orderBy(asc(proyectos.orden)),
    db.select().from(proyectoImagenes).orderBy(asc(proyectoImagenes.orden)),
  ]);

  const categoriaPorId = new Map(categoriasFilas.map((c) => [c.id, c]));
  const imagenesPorProyecto = new Map<number, typeof imagenesFilas>();
  for (const img of imagenesFilas) {
    const lista = imagenesPorProyecto.get(img.proyectoId) ?? [];
    lista.push(img);
    imagenesPorProyecto.set(img.proyectoId, lista);
  }

  const proyectosConImagenes: ProyectoConImagenes[] = proyectosFilas.map(
    (p) => {
      const categoria = categoriaPorId.get(p.categoriaId);
      return {
        id: p.id,
        titulo: p.titulo,
        anio: p.anio,
        descripcion: p.descripcion,
        categoriaId: p.categoriaId,
        categoriaNombre: categoria?.nombre ?? "Sin categoría",
        categoriaSlug: categoria?.slug ?? "",
        imagenes: (imagenesPorProyecto.get(p.id) ?? []).map((img) => ({
          url: img.url,
          altTexto: img.altTexto,
        })),
      };
    }
  );

  return {
    categorias: categoriasFilas.map((c) => ({
      id: c.id,
      nombre: c.nombre,
      slug: c.slug,
    })),
    proyectos: proyectosConImagenes,
  };
}

/** Un proyecto publicado por id, con sus imágenes y su categoría. */
export async function getProyectoPorId(
  id: number
): Promise<ProyectoConImagenes | null> {
  const [proyecto] = await db
    .select()
    .from(proyectos)
    .where(eq(proyectos.id, id))
    .limit(1);

  if (!proyecto || !proyecto.publicado) return null;

  const [categoria] = await db
    .select()
    .from(categorias)
    .where(eq(categorias.id, proyecto.categoriaId))
    .limit(1);

  const imagenes = await db
    .select()
    .from(proyectoImagenes)
    .where(eq(proyectoImagenes.proyectoId, proyecto.id))
    .orderBy(asc(proyectoImagenes.orden));

  return {
    id: proyecto.id,
    titulo: proyecto.titulo,
    anio: proyecto.anio,
    descripcion: proyecto.descripcion,
    categoriaId: proyecto.categoriaId,
    categoriaNombre: categoria?.nombre ?? "Sin categoría",
    categoriaSlug: categoria?.slug ?? "",
    imagenes: imagenes.map((img) => ({
      url: img.url,
      altTexto: img.altTexto,
    })),
  };
}

export type ServicioConItems = {
  id: number;
  titulo: string;
  icono: string | null;
  items: string[];
};

/** Los grupos de servicios con sus ítems, en el orden guardado. */
export async function getServicios(): Promise<ServicioConItems[]> {
  const [serviciosFilas, itemsFilas] = await Promise.all([
    db.select().from(servicios).orderBy(asc(servicios.orden)),
    db.select().from(servicioItems).orderBy(asc(servicioItems.orden)),
  ]);

  const itemsPorServicio = new Map<number, string[]>();
  for (const item of itemsFilas) {
    const lista = itemsPorServicio.get(item.servicioId) ?? [];
    lista.push(item.texto);
    itemsPorServicio.set(item.servicioId, lista);
  }

  return serviciosFilas.map((s) => ({
    id: s.id,
    titulo: s.titulo,
    icono: s.icono,
    items: itemsPorServicio.get(s.id) ?? [],
  }));
}
