/**
 * Consultas y mutaciones que usa el panel de administración (Paso 7).
 * A diferencia de src/db/queries.ts (solo lectura, solo contenido
 * publicado, para las páginas públicas), estas funciones leen y escriben,
 * y no filtran por `publicado`: el panel necesita ver y editar todo.
 */
import "server-only";
import { asc, count, desc, eq, max } from "drizzle-orm";
import { db } from "./index";
import {
  categorias,
  proyectos,
  proyectoImagenes,
  servicios,
  servicioItems,
  mensajesContacto,
  usuariosAdmin,
} from "./schema";

// ───────────────────────── Usuarios admin ─────────────────────────

export async function obtenerUsuarioAdminPorEmail(email: string) {
  const [usuario] = await db
    .select()
    .from(usuariosAdmin)
    .where(eq(usuariosAdmin.email, email.trim().toLowerCase()))
    .limit(1);
  return usuario ?? null;
}

export async function registrarAcceso(usuarioId: number) {
  await db
    .update(usuariosAdmin)
    .set({ ultimoAcceso: new Date() })
    .where(eq(usuariosAdmin.id, usuarioId));
}

export async function actualizarPasswordUsuario(usuarioId: number, passwordHash: string) {
  await db
    .update(usuariosAdmin)
    .set({ passwordHash })
    .where(eq(usuariosAdmin.id, usuarioId));
}

// ───────────────────────── Categorías ─────────────────────────

export async function listarCategorias() {
  return db.select().from(categorias).orderBy(asc(categorias.orden), asc(categorias.nombre));
}

export async function crearCategoria(datos: { nombre: string; slug: string }) {
  const [{ maximo }] = await db
    .select({ maximo: max(categorias.orden) })
    .from(categorias);
  const [fila] = await db
    .insert(categorias)
    .values({ nombre: datos.nombre, slug: datos.slug, orden: (maximo ?? 0) + 1 })
    .returning({ id: categorias.id });
  return fila.id;
}

export async function actualizarCategoria(
  id: number,
  datos: { nombre: string; slug: string }
) {
  await db
    .update(categorias)
    .set({ nombre: datos.nombre, slug: datos.slug })
    .where(eq(categorias.id, id));
}

/** Lanza un error legible si la categoría todavía tiene proyectos. */
export async function eliminarCategoria(id: number) {
  const [{ total }] = await db
    .select({ total: count() })
    .from(proyectos)
    .where(eq(proyectos.categoriaId, id));

  if (total > 0) {
    throw new Error(
      `No se puede eliminar: ${total} proyecto(s) todavía usan esta categoría.`
    );
  }
  await db.delete(categorias).where(eq(categorias.id, id));
}

// ───────────────────────── Proyectos (admin) ─────────────────────────

export type ProyectoAdmin = {
  id: number;
  titulo: string;
  anio: number | null;
  descripcion: string;
  categoriaId: number;
  categoriaNombre: string;
  publicado: boolean;
  orden: number;
  totalImagenes: number;
};

export async function listarProyectosAdmin(): Promise<ProyectoAdmin[]> {
  const [proyectosFilas, categoriasFilas, imagenesFilas] = await Promise.all([
    db.select().from(proyectos).orderBy(desc(proyectos.actualizadoEn)),
    db.select().from(categorias),
    db.select({ proyectoId: proyectoImagenes.proyectoId }).from(proyectoImagenes),
  ]);

  const categoriaPorId = new Map(categoriasFilas.map((c) => [c.id, c.nombre]));
  const totalImagenesPorProyecto = new Map<number, number>();
  for (const img of imagenesFilas) {
    totalImagenesPorProyecto.set(
      img.proyectoId,
      (totalImagenesPorProyecto.get(img.proyectoId) ?? 0) + 1
    );
  }

  return proyectosFilas.map((p) => ({
    id: p.id,
    titulo: p.titulo,
    anio: p.anio,
    descripcion: p.descripcion,
    categoriaId: p.categoriaId,
    categoriaNombre: categoriaPorId.get(p.categoriaId) ?? "Sin categoría",
    publicado: p.publicado,
    orden: p.orden,
    totalImagenes: totalImagenesPorProyecto.get(p.id) ?? 0,
  }));
}

export type ProyectoAdminDetalle = {
  id: number;
  titulo: string;
  anio: number | null;
  descripcion: string;
  categoriaId: number;
  publicado: boolean;
  imagenes: { id: number; url: string; altTexto: string | null; orden: number }[];
};

export async function obtenerProyectoAdminPorId(
  id: number
): Promise<ProyectoAdminDetalle | null> {
  const [proyecto] = await db.select().from(proyectos).where(eq(proyectos.id, id)).limit(1);
  if (!proyecto) return null;

  const imagenes = await db
    .select()
    .from(proyectoImagenes)
    .where(eq(proyectoImagenes.proyectoId, id))
    .orderBy(asc(proyectoImagenes.orden));

  return {
    id: proyecto.id,
    titulo: proyecto.titulo,
    anio: proyecto.anio,
    descripcion: proyecto.descripcion,
    categoriaId: proyecto.categoriaId,
    publicado: proyecto.publicado,
    imagenes: imagenes.map((img) => ({
      id: img.id,
      url: img.url,
      altTexto: img.altTexto,
      orden: img.orden,
    })),
  };
}

export type DatosProyecto = {
  titulo: string;
  categoriaId: number;
  anio: number | null;
  descripcion: string;
  publicado: boolean;
};

export async function crearProyecto(datos: DatosProyecto): Promise<number> {
  const [{ maximo }] = await db.select({ maximo: max(proyectos.orden) }).from(proyectos);
  const [fila] = await db
    .insert(proyectos)
    .values({ ...datos, orden: (maximo ?? 0) + 1 })
    .returning({ id: proyectos.id });
  return fila.id;
}

export async function actualizarProyecto(id: number, datos: DatosProyecto) {
  await db
    .update(proyectos)
    .set({ ...datos, actualizadoEn: new Date() })
    .where(eq(proyectos.id, id));
}

/** Solo cambia publicado/despublicado, sin tocar el resto de campos (botón rápido en la lista). */
export async function alternarPublicadoProyecto(id: number, publicado: boolean) {
  await db
    .update(proyectos)
    .set({ publicado, actualizadoEn: new Date() })
    .where(eq(proyectos.id, id));
}

/** Devuelve las URLs de las imágenes que tenía, para poder borrarlas de Blob. */
export async function eliminarProyecto(id: number): Promise<string[]> {
  const imagenes = await db
    .select({ url: proyectoImagenes.url })
    .from(proyectoImagenes)
    .where(eq(proyectoImagenes.proyectoId, id));

  // onDelete: "cascade" en el esquema se encarga de proyecto_imagenes.
  await db.delete(proyectos).where(eq(proyectos.id, id));

  return imagenes.map((i) => i.url);
}

export async function agregarImagenProyecto(
  proyectoId: number,
  datos: { url: string; altTexto: string | null }
) {
  const [{ maximo }] = await db
    .select({ maximo: max(proyectoImagenes.orden) })
    .from(proyectoImagenes)
    .where(eq(proyectoImagenes.proyectoId, proyectoId));
  await db.insert(proyectoImagenes).values({
    proyectoId,
    url: datos.url,
    altTexto: datos.altTexto,
    orden: (maximo ?? 0) + 1,
  });
}

/** Devuelve la URL eliminada, para poder borrarla también de Blob. */
export async function eliminarImagenProyecto(imagenId: number): Promise<string | null> {
  const [imagen] = await db
    .select({ url: proyectoImagenes.url })
    .from(proyectoImagenes)
    .where(eq(proyectoImagenes.id, imagenId))
    .limit(1);
  if (!imagen) return null;

  await db.delete(proyectoImagenes).where(eq(proyectoImagenes.id, imagenId));
  return imagen.url;
}

export async function actualizarAltTextoImagen(imagenId: number, altTexto: string) {
  await db
    .update(proyectoImagenes)
    .set({ altTexto: altTexto.trim().length > 0 ? altTexto.trim() : null })
    .where(eq(proyectoImagenes.id, imagenId));
}

/** Intercambia el orden con la imagen vecina (mover arriba/abajo en la galería). */
export async function moverImagenProyecto(
  proyectoId: number,
  imagenId: number,
  direccion: "arriba" | "abajo"
) {
  const imagenes = await db
    .select()
    .from(proyectoImagenes)
    .where(eq(proyectoImagenes.proyectoId, proyectoId))
    .orderBy(asc(proyectoImagenes.orden));

  const indice = imagenes.findIndex((i) => i.id === imagenId);
  if (indice === -1) return;

  const indiceVecino = direccion === "arriba" ? indice - 1 : indice + 1;
  if (indiceVecino < 0 || indiceVecino >= imagenes.length) return;

  const actual = imagenes[indice];
  const vecino = imagenes[indiceVecino];

  await Promise.all([
    db
      .update(proyectoImagenes)
      .set({ orden: vecino.orden })
      .where(eq(proyectoImagenes.id, actual.id)),
    db
      .update(proyectoImagenes)
      .set({ orden: actual.orden })
      .where(eq(proyectoImagenes.id, vecino.id)),
  ]);
}

// ───────────────────────── Servicios ─────────────────────────

export type ServicioAdmin = {
  id: number;
  titulo: string;
  icono: string | null;
  orden: number;
  items: { id: number; texto: string; orden: number }[];
};

export async function listarServiciosAdmin(): Promise<ServicioAdmin[]> {
  const [serviciosFilas, itemsFilas] = await Promise.all([
    db.select().from(servicios).orderBy(asc(servicios.orden)),
    db.select().from(servicioItems).orderBy(asc(servicioItems.orden)),
  ]);

  const itemsPorServicio = new Map<number, ServicioAdmin["items"]>();
  for (const item of itemsFilas) {
    const lista = itemsPorServicio.get(item.servicioId) ?? [];
    lista.push({ id: item.id, texto: item.texto, orden: item.orden });
    itemsPorServicio.set(item.servicioId, lista);
  }

  return serviciosFilas.map((s) => ({
    id: s.id,
    titulo: s.titulo,
    icono: s.icono,
    orden: s.orden,
    items: itemsPorServicio.get(s.id) ?? [],
  }));
}

export async function crearServicio(datos: { titulo: string; icono: string | null }) {
  const [{ maximo }] = await db.select({ maximo: max(servicios.orden) }).from(servicios);
  const [fila] = await db
    .insert(servicios)
    .values({ ...datos, orden: (maximo ?? 0) + 1 })
    .returning({ id: servicios.id });
  return fila.id;
}

export async function actualizarServicio(
  id: number,
  datos: { titulo: string; icono: string | null }
) {
  await db.update(servicios).set(datos).where(eq(servicios.id, id));
}

export async function eliminarServicio(id: number) {
  // onDelete: "cascade" en el esquema se encarga de servicio_items.
  await db.delete(servicios).where(eq(servicios.id, id));
}

export async function agregarItemServicio(servicioId: number, texto: string) {
  const [{ maximo }] = await db
    .select({ maximo: max(servicioItems.orden) })
    .from(servicioItems)
    .where(eq(servicioItems.servicioId, servicioId));
  await db.insert(servicioItems).values({
    servicioId,
    texto,
    orden: (maximo ?? 0) + 1,
  });
}

export async function actualizarItemServicio(itemId: number, texto: string) {
  await db.update(servicioItems).set({ texto }).where(eq(servicioItems.id, itemId));
}

export async function eliminarItemServicio(itemId: number) {
  await db.delete(servicioItems).where(eq(servicioItems.id, itemId));
}

// ───────────────────────── Mensajes de contacto ─────────────────────────

export type MensajeConNombres = typeof mensajesContacto.$inferSelect & {
  servicioNombre: string | null;
  categoriaNombre: string | null;
};

/**
 * Mensajes de contacto con el nombre del servicio y la categoría que el
 * visitante marcó como de interés (si los marcó), para que el panel pueda
 * armar una respuesta o cotización sin tener que cruzar tablas a mano.
 */
export async function listarMensajes(): Promise<MensajeConNombres[]> {
  const [mensajes, listaServicios, listaCategorias] = await Promise.all([
    db.select().from(mensajesContacto).orderBy(desc(mensajesContacto.creadoEn)),
    db.select().from(servicios),
    db.select().from(categorias),
  ]);

  const servicioPorId = new Map(listaServicios.map((s) => [s.id, s.titulo]));
  const categoriaPorId = new Map(listaCategorias.map((c) => [c.id, c.nombre]));

  return mensajes.map((m) => ({
    ...m,
    servicioNombre: m.servicioId ? servicioPorId.get(m.servicioId) ?? null : null,
    categoriaNombre: m.categoriaId ? categoriaPorId.get(m.categoriaId) ?? null : null,
  }));
}

export async function marcarMensaje(id: number, leido: boolean) {
  await db.update(mensajesContacto).set({ leido }).where(eq(mensajesContacto.id, id));
}

export async function eliminarMensaje(id: number) {
  await db.delete(mensajesContacto).where(eq(mensajesContacto.id, id));
}

// ───────────────────────── Resumen del panel ─────────────────────────

export async function obtenerResumenPanel() {
  const [[{ totalProyectos }], [{ totalPublicados }], [{ totalServicios }], [{ totalMensajes }], [{ totalNoLeidos }]] =
    await Promise.all([
      db.select({ totalProyectos: count() }).from(proyectos),
      db
        .select({ totalPublicados: count() })
        .from(proyectos)
        .where(eq(proyectos.publicado, true)),
      db.select({ totalServicios: count() }).from(servicios),
      db.select({ totalMensajes: count() }).from(mensajesContacto),
      db
        .select({ totalNoLeidos: count() })
        .from(mensajesContacto)
        .where(eq(mensajesContacto.leido, false)),
    ]);

  return {
    totalProyectos,
    totalPublicados,
    totalServicios,
    totalMensajes,
    totalNoLeidos,
  };
}
