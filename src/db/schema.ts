/**
 * Esquema de la base de datos, con Drizzle ORM.
 * Corresponde 1 a 1 con docs/evidencias/paso-03/esquema.sql (Paso 3).
 * Cualquier cambio de columnas se hace aquí y se traduce a una migración
 * con `npm run db:generate` (Paso 4).
 */
import {
  pgTable,
  serial,
  integer,
  varchar,
  text,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

export const categorias = pgTable("categorias", {
  id: serial("id").primaryKey(),
  nombre: varchar("nombre", { length: 60 }).notNull(),
  slug: varchar("slug", { length: 60 }).notNull().unique(),
  orden: integer("orden").notNull().default(0),
});

export const proyectos = pgTable(
  "proyectos",
  {
    id: serial("id").primaryKey(),
    categoriaId: integer("categoria_id")
      .notNull()
      .references(() => categorias.id),
    titulo: varchar("titulo", { length: 150 }).notNull(),
    anio: integer("anio"),
    descripcion: text("descripcion").notNull(),
    orden: integer("orden").notNull().default(0),
    publicado: boolean("publicado").notNull().default(true),
    creadoEn: timestamp("creado_en", { withTimezone: true })
      .notNull()
      .defaultNow(),
    actualizadoEn: timestamp("actualizado_en", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (tabla) => [index("idx_proyectos_categoria").on(tabla.categoriaId)]
);

export const proyectoImagenes = pgTable(
  "proyecto_imagenes",
  {
    id: serial("id").primaryKey(),
    proyectoId: integer("proyecto_id")
      .notNull()
      .references(() => proyectos.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    altTexto: varchar("alt_texto", { length: 150 }),
    orden: integer("orden").notNull().default(0),
  },
  (tabla) => [index("idx_proyecto_imagenes_proyecto").on(tabla.proyectoId)]
);

export const servicios = pgTable("servicios", {
  id: serial("id").primaryKey(),
  titulo: varchar("titulo", { length: 60 }).notNull(),
  icono: varchar("icono", { length: 60 }),
  orden: integer("orden").notNull().default(0),
});

export const servicioItems = pgTable(
  "servicio_items",
  {
    id: serial("id").primaryKey(),
    servicioId: integer("servicio_id")
      .notNull()
      .references(() => servicios.id, { onDelete: "cascade" }),
    texto: varchar("texto", { length: 150 }).notNull(),
    orden: integer("orden").notNull().default(0),
  },
  (tabla) => [index("idx_servicio_items_servicio").on(tabla.servicioId)]
);

export const mensajesContacto = pgTable(
  "mensajes_contacto",
  {
    id: serial("id").primaryKey(),
    nombre: varchar("nombre", { length: 120 }).notNull(),
    email: varchar("email", { length: 150 }).notNull(),
    telefono: varchar("telefono", { length: 30 }),
    // Servicio y categoría de interés: el visitante los elige en el
    // formulario para que el panel pueda armar una respuesta o una
    // cotización preliminar sin tener que preguntarlo por separado.
    // Son opcionales (SET NULL) porque no deben bloquear el envío del
    // mensaje ni desaparecer si se borra el servicio o la categoría.
    servicioId: integer("servicio_id").references(() => servicios.id, {
      onDelete: "set null",
    }),
    categoriaId: integer("categoria_id").references(() => categorias.id, {
      onDelete: "set null",
    }),
    // Datos opcionales para armar una cotización preliminar sin tener que
    // preguntarlos por separado (Paso 7.6). Ninguno es obligatorio: un
    // visitante que todavía no los tiene claros no debe quedar bloqueado
    // para enviar su consulta.
    ubicacion: varchar("ubicacion", { length: 150 }),
    metrajeM2: integer("metraje_m2"),
    plazoDeseado: varchar("plazo_deseado", { length: 40 }),
    presupuestoReferencial: varchar("presupuesto_referencial", { length: 60 }),
    mensaje: text("mensaje").notNull(),
    leido: boolean("leido").notNull().default(false),
    creadoEn: timestamp("creado_en", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (tabla) => [
    index("idx_mensajes_leido").on(tabla.leido),
    index("idx_mensajes_servicio").on(tabla.servicioId),
    index("idx_mensajes_categoria").on(tabla.categoriaId),
  ]
);

export const usuariosAdmin = pgTable("usuarios_admin", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 150 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  nombre: varchar("nombre", { length: 120 }),
  creadoEn: timestamp("creado_en", { withTimezone: true })
    .notNull()
    .defaultNow(),
  ultimoAcceso: timestamp("ultimo_acceso", { withTimezone: true }),
});
