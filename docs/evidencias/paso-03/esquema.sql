-- Esquema de la base de datos de Torre Fuerte
-- PostgreSQL, para ejecutarse en Neon (Paso 4).

CREATE TABLE categorias (
  id      SERIAL PRIMARY KEY,
  nombre  VARCHAR(60) NOT NULL,
  slug    VARCHAR(60) NOT NULL UNIQUE,
  orden   INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE proyectos (
  id              SERIAL PRIMARY KEY,
  categoria_id    INTEGER NOT NULL REFERENCES categorias(id),
  titulo          VARCHAR(150) NOT NULL,
  anio            INTEGER,
  descripcion     TEXT NOT NULL,
  orden           INTEGER NOT NULL DEFAULT 0,
  publicado       BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT now(),
  actualizado_en  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE proyecto_imagenes (
  id           SERIAL PRIMARY KEY,
  proyecto_id  INTEGER NOT NULL REFERENCES proyectos(id) ON DELETE CASCADE,
  url          TEXT NOT NULL,
  alt_texto    VARCHAR(150),
  orden        INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE servicios (
  id      SERIAL PRIMARY KEY,
  titulo  VARCHAR(60) NOT NULL,
  icono   VARCHAR(60),
  orden   INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE servicio_items (
  id           SERIAL PRIMARY KEY,
  servicio_id  INTEGER NOT NULL REFERENCES servicios(id) ON DELETE CASCADE,
  texto        VARCHAR(150) NOT NULL,
  orden        INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE mensajes_contacto (
  id         SERIAL PRIMARY KEY,
  nombre     VARCHAR(120) NOT NULL,
  email      VARCHAR(150) NOT NULL,
  telefono   VARCHAR(30),
  mensaje    TEXT NOT NULL,
  leido      BOOLEAN NOT NULL DEFAULT FALSE,
  creado_en  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE usuarios_admin (
  id             SERIAL PRIMARY KEY,
  email          VARCHAR(150) NOT NULL UNIQUE,
  password_hash  VARCHAR(255) NOT NULL,
  nombre         VARCHAR(120),
  creado_en      TIMESTAMPTZ NOT NULL DEFAULT now(),
  ultimo_acceso  TIMESTAMPTZ
);

CREATE INDEX idx_proyectos_categoria ON proyectos(categoria_id);
CREATE INDEX idx_proyecto_imagenes_proyecto ON proyecto_imagenes(proyecto_id);
CREATE INDEX idx_servicio_items_servicio ON servicio_items(servicio_id);
CREATE INDEX idx_mensajes_leido ON mensajes_contacto(leido);
