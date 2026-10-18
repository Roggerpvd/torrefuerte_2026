"use client";

import { useActionState } from "react";
import Link from "next/link";
import { alternarPublicadoAction, eliminarProyectoAction, type EstadoProyecto } from "@/app/admin/(panel)/proyectos/actions";

type Proyecto = {
  id: number;
  titulo: string;
  anio: number | null;
  categoriaNombre: string;
  publicado: boolean;
  totalImagenes: number;
};

export function ProyectosList({ proyectos }: { proyectos: Proyecto[] }) {
  if (proyectos.length === 0) {
    return (
      <p className="glass tf-reveal rounded-tf-lg p-8 text-muted">
        Todavía no hay proyectos. Crea el primero con el botón de arriba.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {proyectos.map((p, i) => (
        <li key={p.id} className="tf-reveal" style={{ animationDelay: `${Math.min(i, 10) * 50}ms` }}>
          <FilaProyecto proyecto={p} />
        </li>
      ))}
    </ul>
  );
}

function FilaProyecto({ proyecto }: { proyecto: Proyecto }) {
  const [, accionPublicar, pendientePublicar] = useActionState<EstadoProyecto, FormData>(
    alternarPublicadoAction,
    null
  );
  const [estadoEliminar, accionEliminar, pendienteEliminar] = useActionState<EstadoProyecto, FormData>(
    eliminarProyectoAction,
    null
  );

  return (
    <div className="glass flex flex-wrap items-center justify-between gap-4 rounded-tf-lg p-5">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/admin/proyectos/${proyecto.id}`}
            className="truncate font-headline text-lg font-bold uppercase tracking-tight hover:text-accent-text"
          >
            {proyecto.titulo}
          </Link>
          {!proyecto.publicado && (
            <span className="glass shrink-0 rounded-tf-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted">
              Borrador
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-muted">
          {proyecto.categoriaNombre}
          {proyecto.anio ? ` · ${proyecto.anio}` : ""} · {proyecto.totalImagenes}{" "}
          {proyecto.totalImagenes === 1 ? "imagen" : "imágenes"}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <form action={accionPublicar}>
          <input type="hidden" name="id" value={proyecto.id} />
          <input type="hidden" name="publicado" value={proyecto.publicado ? "0" : "1"} />
          <button
            type="submit"
            disabled={pendientePublicar}
            className="glass glass-interactive rounded-tf-sm px-3 py-2 text-xs font-bold uppercase tracking-wide text-fg hover:text-accent-text disabled:opacity-60"
          >
            {proyecto.publicado ? "Despublicar" : "Publicar"}
          </button>
        </form>

        <Link
          href={`/admin/proyectos/${proyecto.id}`}
          className="glass glass-interactive rounded-tf-sm px-3 py-2 text-xs font-bold uppercase tracking-wide text-fg hover:text-accent-text"
        >
          Editar
        </Link>

        <form
          action={accionEliminar}
          onSubmit={(e) => {
            if (!confirm(`¿Eliminar "${proyecto.titulo}" y todas sus imágenes? Esto no se puede deshacer.`)) {
              e.preventDefault();
            }
          }}
        >
          <input type="hidden" name="id" value={proyecto.id} />
          <button
            type="submit"
            disabled={pendienteEliminar}
            className="rounded-tf-sm px-3 py-2 text-xs font-bold uppercase tracking-wide text-muted hover:text-accent-text disabled:opacity-60"
          >
            Eliminar
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
