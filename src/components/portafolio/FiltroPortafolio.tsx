"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ProyectoConImagenes } from "@/db/queries";

type Categoria = { id: number; nombre: string; slug: string };

export function FiltroPortafolio({
  categorias,
  proyectos,
}: {
  categorias: Categoria[];
  proyectos: ProyectoConImagenes[];
}) {
  const [categoriaActiva, setCategoriaActiva] = useState<string>("todas");

  const proyectosFiltrados = useMemo(() => {
    if (categoriaActiva === "todas") return proyectos;
    return proyectos.filter((p) => p.categoriaSlug === categoriaActiva);
  }, [categoriaActiva, proyectos]);

  return (
    <div>
      <div className="flex flex-wrap gap-3" role="tablist" aria-label="Filtrar por categoría">
        <button
          type="button"
          role="tab"
          aria-selected={categoriaActiva === "todas"}
          onClick={() => setCategoriaActiva("todas")}
          className={`glass glass-interactive rounded-tf-sm px-4 py-2 text-sm font-medium uppercase tracking-wide ${
            categoriaActiva === "todas" ? "glass-pressed" : "text-muted hover:text-accent-text"
          }`}
        >
          Todas ({proyectos.length})
        </button>
        {categorias.map((c) => {
          const cantidad = proyectos.filter((p) => p.categoriaSlug === c.slug).length;
          if (cantidad === 0) return null;
          return (
            <button
              key={c.slug}
              type="button"
              role="tab"
              aria-selected={categoriaActiva === c.slug}
              onClick={() => setCategoriaActiva(c.slug)}
              className={`glass glass-interactive rounded-tf-sm px-4 py-2 text-sm font-medium uppercase tracking-wide ${
                categoriaActiva === c.slug ? "glass-pressed" : "text-muted hover:text-accent-text"
              }`}
            >
              {c.nombre} ({cantidad})
            </button>
          );
        })}
      </div>

      <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {proyectosFiltrados.map((p, i) => (
          <li key={p.id}>
            <Link
              href={`/portafolio/${p.id}`}
              className="glass glass-interactive tf-reveal group block overflow-hidden rounded-tf-md"
              style={{ animationDelay: `${(i % 9) * 60}ms` }}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-tf-md bg-surface-high">
                {p.imagenes[0] ? (
                  <Image
                    src={p.imagenes[0].url}
                    alt={p.imagenes[0].altTexto ?? p.titulo}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted">
                    Sin imagen
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-accent-text">
                  {p.categoriaNombre}
                  {p.anio ? ` · ${p.anio}` : ""}
                </p>
                <h3 className="mt-1 font-headline text-lg font-bold uppercase tracking-tight">
                  {p.titulo}
                </h3>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {proyectosFiltrados.length === 0 && (
        <p className="mt-10 text-muted">No hay proyectos en esta categoría todavía.</p>
      )}
    </div>
  );
}
