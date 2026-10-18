"use client";

import { useActionState } from "react";
import {
  crearProyectoAction,
  actualizarProyectoAction,
  type EstadoProyecto,
} from "@/app/admin/(panel)/proyectos/actions";

type Categoria = { id: number; nombre: string; slug: string };

type ProyectoExistente = {
  id: number;
  titulo: string;
  anio: number | null;
  descripcion: string;
  categoriaId: number;
  publicado: boolean;
};

const campoBase =
  "glass-sunken mt-2 w-full rounded-tf-sm px-4 py-2.5 text-fg outline-none placeholder:text-muted/60";

export function ProyectoForm({
  categorias,
  proyecto,
}: {
  categorias: Categoria[];
  proyecto?: ProyectoExistente;
}) {
  const esEdicion = proyecto !== undefined;
  const [estado, accion, pendiente] = useActionState<EstadoProyecto, FormData>(
    esEdicion ? actualizarProyectoAction : crearProyectoAction,
    null
  );

  return (
    <form action={accion} className="glass tf-reveal space-y-6 rounded-tf-lg p-8">
      {esEdicion && <input type="hidden" name="id" value={proyecto.id} />}

      <div>
        <label htmlFor="titulo" className="block text-sm font-medium uppercase tracking-wide text-muted">
          Título
        </label>
        <input
          id="titulo"
          name="titulo"
          type="text"
          required
          minLength={2}
          maxLength={150}
          defaultValue={proyecto?.titulo}
          className={campoBase}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="categoriaId" className="block text-sm font-medium uppercase tracking-wide text-muted">
            Categoría
          </label>
          <select
            id="categoriaId"
            name="categoriaId"
            required
            defaultValue={proyecto?.categoriaId ?? ""}
            className={`${campoBase} appearance-none`}
          >
            <option value="" disabled>
              Elige una categoría
            </option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
          {categorias.length === 0 && (
            <p className="mt-2 text-xs text-accent-text">
              Todavía no hay categorías. Crea una primero en la sección Categorías.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="anio" className="block text-sm font-medium uppercase tracking-wide text-muted">
            Año (opcional)
          </label>
          <input
            id="anio"
            name="anio"
            type="number"
            min={1900}
            max={2100}
            defaultValue={proyecto?.anio ?? undefined}
            className={campoBase}
          />
        </div>
      </div>

      <div>
        <label htmlFor="descripcion" className="block text-sm font-medium uppercase tracking-wide text-muted">
          Descripción
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          required
          minLength={10}
          maxLength={4000}
          rows={6}
          defaultValue={proyecto?.descripcion}
          className={`${campoBase} resize-y`}
        />
      </div>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          name="publicado"
          defaultChecked={proyecto?.publicado ?? true}
          className="h-5 w-5 accent-accent"
        />
        <span className="text-sm font-medium uppercase tracking-wide text-fg">
          Publicado (visible en el sitio)
        </span>
      </label>

      {estado && "error" in estado && (
        <p role="alert" className="glass rounded-tf-sm border-accent/40 px-4 py-3 text-sm text-accent-text">
          {estado.error}
        </p>
      )}
      {estado && "ok" in estado && (
        <p role="status" className="text-sm text-accent-text">
          Guardado.
        </p>
      )}

      <button
        type="submit"
        disabled={pendiente}
        className="glass glass-interactive rounded-tf-sm bg-accent/90 px-6 py-3 text-sm font-bold uppercase tracking-wide text-on-accent disabled:opacity-60"
      >
        {pendiente ? "Guardando…" : esEdicion ? "Guardar cambios" : "Crear proyecto"}
      </button>
    </form>
  );
}
