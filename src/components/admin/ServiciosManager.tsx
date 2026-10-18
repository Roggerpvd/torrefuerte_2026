"use client";

import { useActionState, useState } from "react";
import {
  crearServicioAction,
  actualizarServicioAction,
  eliminarServicioAction,
  agregarItemAction,
  actualizarItemAction,
  eliminarItemAction,
  type EstadoServicio,
} from "@/app/admin/(panel)/servicios/actions";

type Item = { id: number; texto: string };
type Servicio = { id: number; titulo: string; items: Item[] };

const campoBase =
  "glass-sunken w-full rounded-tf-sm px-4 py-2.5 text-fg outline-none placeholder:text-muted/60";

export function ServiciosManager({ serviciosIniciales }: { serviciosIniciales: Servicio[] }) {
  return (
    <div className="space-y-8">
      <FormularioNuevoServicio />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {serviciosIniciales.map((s, i) => (
          <div key={s.id} className="tf-reveal" style={{ animationDelay: `${i * 80}ms` }}>
            <TarjetaServicio servicio={s} />
          </div>
        ))}
        {serviciosIniciales.length === 0 && (
          <p className="text-muted">Todavía no hay servicios.</p>
        )}
      </div>
    </div>
  );
}

function FormularioNuevoServicio() {
  const [estado, accion, pendiente] = useActionState<EstadoServicio, FormData>(
    crearServicioAction,
    null
  );

  return (
    <form action={accion} className="glass tf-reveal flex flex-wrap items-end gap-4 rounded-tf-lg p-6">
      <div className="min-w-[14rem] flex-1">
        <label htmlFor="titulo-nuevo" className="block text-sm font-medium uppercase tracking-wide text-muted">
          Nuevo grupo de servicio
        </label>
        <input
          id="titulo-nuevo"
          name="titulo"
          type="text"
          required
          minLength={2}
          maxLength={60}
          placeholder="Ej. Arquitectura"
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

function TarjetaServicio({ servicio }: { servicio: Servicio }) {
  const [editandoTitulo, setEditandoTitulo] = useState(false);
  const [estadoTitulo, accionTitulo, pendienteTitulo] = useActionState<EstadoServicio, FormData>(
    actualizarServicioAction,
    null
  );
  const [, accionEliminarServicio, pendienteEliminarServicio] = useActionState<EstadoServicio, FormData>(
    eliminarServicioAction,
    null
  );

  return (
    <div className="glass rounded-tf-lg p-6">
      <div className="flex items-start justify-between gap-3">
        {editandoTitulo ? (
          <form action={accionTitulo} className="flex flex-1 items-end gap-3">
            <input type="hidden" name="id" value={servicio.id} />
            <input
              name="titulo"
              type="text"
              defaultValue={servicio.titulo}
              required
              minLength={2}
              maxLength={60}
              className={campoBase}
            />
            <button
              type="submit"
              disabled={pendienteTitulo}
              className="glass glass-interactive shrink-0 rounded-tf-sm bg-accent/90 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-on-accent disabled:opacity-60"
            >
              {pendienteTitulo ? "…" : "Guardar"}
            </button>
            <button
              type="button"
              onClick={() => setEditandoTitulo(false)}
              className="shrink-0 rounded-tf-sm px-3 py-2.5 text-xs font-bold uppercase tracking-wide text-muted hover:text-fg"
            >
              Cancelar
            </button>
          </form>
        ) : (
          <>
            <h2 className="font-headline text-xl font-bold uppercase tracking-tight text-primary">
              {servicio.titulo}
            </h2>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setEditandoTitulo(true)}
                className="rounded-tf-sm px-2 py-1 text-xs font-bold uppercase tracking-wide text-muted hover:text-accent-text"
              >
                Editar
              </button>
              <form
                action={accionEliminarServicio}
                onSubmit={(e) => {
                  if (!confirm(`¿Eliminar "${servicio.titulo}" y todos sus ítems?`)) {
                    e.preventDefault();
                  }
                }}
              >
                <input type="hidden" name="id" value={servicio.id} />
                <button
                  type="submit"
                  disabled={pendienteEliminarServicio}
                  className="rounded-tf-sm px-2 py-1 text-xs font-bold uppercase tracking-wide text-muted hover:text-accent-text disabled:opacity-60"
                >
                  Eliminar
                </button>
              </form>
            </div>
          </>
        )}
      </div>
      {estadoTitulo && "error" in estadoTitulo && (
        <p role="alert" className="mt-2 text-sm text-accent-text">
          {estadoTitulo.error}
        </p>
      )}

      <ul className="mt-5 space-y-2">
        {servicio.items.map((item) => (
          <FilaItem key={item.id} item={item} />
        ))}
      </ul>

      <FormularioNuevoItem servicioId={servicio.id} />
    </div>
  );
}

function FilaItem({ item }: { item: Item }) {
  const [editando, setEditando] = useState(false);
  const [estado, accion, pendiente] = useActionState<EstadoServicio, FormData>(
    actualizarItemAction,
    null
  );
  const [, accionEliminar, pendienteEliminar] = useActionState<EstadoServicio, FormData>(
    eliminarItemAction,
    null
  );

  if (editando) {
    return (
      <li>
        <form action={accion} className="flex items-center gap-2">
          <input type="hidden" name="id" value={item.id} />
          <input
            name="texto"
            type="text"
            defaultValue={item.texto}
            required
            minLength={2}
            maxLength={150}
            className={`${campoBase} py-2 text-sm`}
          />
          <button
            type="submit"
            disabled={pendiente}
            className="shrink-0 rounded-tf-sm px-3 py-2 text-xs font-bold uppercase tracking-wide text-accent-text disabled:opacity-60"
          >
            Ok
          </button>
          <button
            type="button"
            onClick={() => setEditando(false)}
            className="shrink-0 rounded-tf-sm px-2 py-2 text-xs font-bold uppercase tracking-wide text-muted hover:text-fg"
          >
            ✕
          </button>
        </form>
        {estado && "error" in estado && (
          <p role="alert" className="mt-1 text-xs text-accent-text">
            {estado.error}
          </p>
        )}
      </li>
    );
  }

  return (
    <li className="flex items-center justify-between gap-3 text-sm">
      <div className="flex min-w-0 flex-1 gap-2">
        <span className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
        <span className="text-fg">{item.texto}</span>
      </div>
      <div className="flex shrink-0 items-center gap-1 opacity-70">
        <button
          type="button"
          onClick={() => setEditando(true)}
          className="rounded-tf-sm px-2 py-1 text-xs uppercase tracking-wide text-muted hover:text-accent-text"
        >
          Editar
        </button>
        <form action={accionEliminar}>
          <input type="hidden" name="id" value={item.id} />
          <button
            type="submit"
            disabled={pendienteEliminar}
            className="rounded-tf-sm px-2 py-1 text-xs uppercase tracking-wide text-muted hover:text-accent-text disabled:opacity-60"
          >
            ✕
          </button>
        </form>
      </div>
    </li>
  );
}

function FormularioNuevoItem({ servicioId }: { servicioId: number }) {
  const [estado, accion, pendiente] = useActionState<EstadoServicio, FormData>(
    agregarItemAction,
    null
  );

  return (
    <form action={accion} className="mt-4 flex items-center gap-2 border-t border-line/40 pt-4">
      <input type="hidden" name="servicioId" value={servicioId} />
      <input
        name="texto"
        type="text"
        required
        minLength={2}
        maxLength={150}
        placeholder="Agregar ítem…"
        className={`${campoBase} py-2 text-sm`}
        key={estado && "ok" in estado ? Math.random() : "fijo"}
      />
      <button
        type="submit"
        disabled={pendiente}
        className="shrink-0 rounded-tf-sm px-3 py-2 text-xs font-bold uppercase tracking-wide text-accent-text disabled:opacity-60"
      >
        +
      </button>
      {estado && "error" in estado && (
        <p role="alert" className="text-xs text-accent-text">
          {estado.error}
        </p>
      )}
    </form>
  );
}
