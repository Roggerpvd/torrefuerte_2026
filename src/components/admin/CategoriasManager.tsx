"use client";

import { useActionState, useState } from "react";
import {
  crearCategoriaAction,
  actualizarCategoriaAction,
  eliminarCategoriaAction,
  type EstadoCategoria,
} from "@/app/admin/(panel)/categorias/actions";

type Categoria = { id: number; nombre: string; slug: string };

const campoBase =
  "glass-sunken w-full rounded-tf-sm px-4 py-2.5 text-fg outline-none placeholder:text-muted/60";

export function CategoriasManager({ categoriasIniciales }: { categoriasIniciales: Categoria[] }) {
  return (
    <div className="space-y-8">
      <FormularioNuevaCategoria />

      <ul className="space-y-3">
        {categoriasIniciales.map((c, i) => (
          <li key={c.id} className="tf-reveal" style={{ animationDelay: `${i * 50}ms` }}>
            <FilaCategoria categoria={c} />
          </li>
        ))}
        {categoriasIniciales.length === 0 && (
          <p className="text-muted">Todavía no hay categorías.</p>
        )}
      </ul>
    </div>
  );
}

function FormularioNuevaCategoria() {
  const [estado, accion, pendiente] = useActionState<EstadoCategoria, FormData>(
    crearCategoriaAction,
    null
  );

  return (
    <form action={accion} className="glass tf-reveal flex flex-wrap items-end gap-4 rounded-tf-lg p-6">
      <div className="min-w-[14rem] flex-1">
        <label htmlFor="nombre-nueva" className="block text-sm font-medium uppercase tracking-wide text-muted">
          Nueva categoría
        </label>
        <input
          id="nombre-nueva"
          name="nombre"
          type="text"
          required
          minLength={2}
          maxLength={60}
          placeholder="Ej. Viviendas"
          className={`${campoBase} mt-2`}
          key={estado && "ok" in estado ? Math.random() : "fijo"}
        />
      </div>
      <button
        type="submit"
        disabled={pendiente}
        className="glass glass-interactive rounded-tf-sm bg-accent/90 px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-on-accent disabled:opacity-60"
      >
        {pendiente ? "Creando…" : "Crear"}
      </button>
      {estado && "error" in estado && (
        <p role="alert" className="w-full text-sm text-accent-text">
          {estado.error}
        </p>
      )}
    </form>
  );
}

function FilaCategoria({ categoria }: { categoria: Categoria }) {
  const [editando, setEditando] = useState(false);
  const [estadoEditar, accionEditar, pendienteEditar] = useActionState<EstadoCategoria, FormData>(
    actualizarCategoriaAction,
    null
  );
  const [estadoEliminar, accionEliminar, pendienteEliminar] = useActionState<EstadoCategoria, FormData>(
    eliminarCategoriaAction,
    null
  );

  if (editando) {
    return (
      <form
        action={accionEditar}
        className="glass flex flex-wrap items-end gap-4 rounded-tf-md p-5"
      >
        <input type="hidden" name="id" value={categoria.id} />
        <div className="min-w-[14rem] flex-1">
          <label htmlFor={`nombre-${categoria.id}`} className="block text-xs font-medium uppercase tracking-wide text-muted">
            Nombre
          </label>
          <input
            id={`nombre-${categoria.id}`}
            name="nombre"
            type="text"
            defaultValue={categoria.nombre}
            required
            minLength={2}
            maxLength={60}
            className={`${campoBase} mt-1.5`}
          />
        </div>
        <button
          type="submit"
          disabled={pendienteEditar}
          className="glass glass-interactive rounded-tf-sm bg-accent/90 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-on-accent disabled:opacity-60"
        >
          {pendienteEditar ? "Guardando…" : "Guardar"}
        </button>
        <button
          type="button"
          onClick={() => setEditando(false)}
          className="glass glass-interactive rounded-tf-sm px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-muted hover:text-fg"
        >
          Cancelar
        </button>
        {estadoEditar && "error" in estadoEditar && (
          <p role="alert" className="w-full text-sm text-accent-text">
            {estadoEditar.error}
          </p>
        )}
      </form>
    );
  }

  return (
    <div className="glass glass-interactive flex flex-wrap items-center justify-between gap-4 rounded-tf-md px-5 py-4">
      <div>
        <p className="font-medium text-fg">{categoria.nombre}</p>
        <p className="text-xs text-muted">/{categoria.slug}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setEditando(true)}
          className="rounded-tf-sm px-3 py-2 text-xs font-bold uppercase tracking-wide text-muted hover:text-accent-text"
        >
          Editar
        </button>
        <form
          action={accionEliminar}
          onSubmit={(e) => {
            if (!confirm(`¿Eliminar la categoría "${categoria.nombre}"?`)) {
              e.preventDefault();
            }
          }}
        >
          <input type="hidden" name="id" value={categoria.id} />
          <button
            type="submit"
            disabled={pendienteEliminar}
            className="rounded-tf-sm px-3 py-2 text-xs font-bold uppercase tracking-wide text-muted hover:text-accent-text disabled:opacity-60"
          >
            {pendienteEliminar ? "Eliminando…" : "Eliminar"}
          </button>
        </form>
      </div>
      {estadoEliminar && "error" in estadoEliminar && (
        <p role="alert" className="w-full text-sm text-accent-text">
          {estadoEliminar.error}
        </p>
      )}
    </div>
  );
}
