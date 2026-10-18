CREATE TABLE "categorias" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(60) NOT NULL,
	"slug" varchar(60) NOT NULL,
	"orden" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "categorias_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "mensajes_contacto" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" varchar(120) NOT NULL,
	"email" varchar(150) NOT NULL,
	"telefono" varchar(30),
	"mensaje" text NOT NULL,
	"leido" boolean DEFAULT false NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "proyecto_imagenes" (
	"id" serial PRIMARY KEY NOT NULL,
	"proyecto_id" integer NOT NULL,
	"url" text NOT NULL,
	"alt_texto" varchar(150),
	"orden" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "proyectos" (
	"id" serial PRIMARY KEY NOT NULL,
	"categoria_id" integer NOT NULL,
	"titulo" varchar(150) NOT NULL,
	"anio" integer,
	"descripcion" text NOT NULL,
	"orden" integer DEFAULT 0 NOT NULL,
	"publicado" boolean DEFAULT true NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"actualizado_en" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "servicio_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"servicio_id" integer NOT NULL,
	"texto" varchar(150) NOT NULL,
	"orden" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "servicios" (
	"id" serial PRIMARY KEY NOT NULL,
	"titulo" varchar(60) NOT NULL,
	"icono" varchar(60),
	"orden" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "usuarios_admin" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(150) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"nombre" varchar(120),
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"ultimo_acceso" timestamp with time zone,
	CONSTRAINT "usuarios_admin_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "proyecto_imagenes" ADD CONSTRAINT "proyecto_imagenes_proyecto_id_proyectos_id_fk" FOREIGN KEY ("proyecto_id") REFERENCES "public"."proyectos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proyectos" ADD CONSTRAINT "proyectos_categoria_id_categorias_id_fk" FOREIGN KEY ("categoria_id") REFERENCES "public"."categorias"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "servicio_items" ADD CONSTRAINT "servicio_items_servicio_id_servicios_id_fk" FOREIGN KEY ("servicio_id") REFERENCES "public"."servicios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_mensajes_leido" ON "mensajes_contacto" USING btree ("leido");--> statement-breakpoint
CREATE INDEX "idx_proyecto_imagenes_proyecto" ON "proyecto_imagenes" USING btree ("proyecto_id");--> statement-breakpoint
CREATE INDEX "idx_proyectos_categoria" ON "proyectos" USING btree ("categoria_id");--> statement-breakpoint
CREATE INDEX "idx_servicio_items_servicio" ON "servicio_items" USING btree ("servicio_id");