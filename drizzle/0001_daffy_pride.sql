ALTER TABLE "mensajes_contacto" ADD COLUMN "servicio_id" integer;--> statement-breakpoint
ALTER TABLE "mensajes_contacto" ADD COLUMN "categoria_id" integer;--> statement-breakpoint
ALTER TABLE "mensajes_contacto" ADD CONSTRAINT "mensajes_contacto_servicio_id_servicios_id_fk" FOREIGN KEY ("servicio_id") REFERENCES "public"."servicios"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mensajes_contacto" ADD CONSTRAINT "mensajes_contacto_categoria_id_categorias_id_fk" FOREIGN KEY ("categoria_id") REFERENCES "public"."categorias"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_mensajes_servicio" ON "mensajes_contacto" USING btree ("servicio_id");--> statement-breakpoint
CREATE INDEX "idx_mensajes_categoria" ON "mensajes_contacto" USING btree ("categoria_id");