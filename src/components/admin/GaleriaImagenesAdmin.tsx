"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  agregarImagenAction,
  eliminarImagenAction,
  actualizarAltTextoAction,
  moverImagenAction,
} from "@/app/admin/(panel)/proyectos/actions";

type Imagen = { id: number; url: string; altTexto: string | null; orden: number };

export function GaleriaImagenesAdmin({
  proyectoId,
  imagenesIniciales,
}: {
  proyectoId: number;
  imagenesIniciales: Imagen[];
}) {
  const router = useRouter();
  // Sin estado local propio para la lista: el servidor (el prop, refrescado
  // con router.refresh() después de cada mutación) es la fuente de verdad
  // del orden y el contenido.
  const imagenes = imagenesIniciales;
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [idOcupado, setIdOcupado] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function subirArchivos(archivos: FileList | null) {
    if (!archivos || archivos.length === 0) return;
    setError(null);
    setSubiendo(true);
    try {
      for (const archivo of Array.from(archivos)) {
        const subida = new FormData();
        subida.append("archivo", archivo);
        const respuesta = await fetch("/api/admin/upload", { method: "POST", body: subida });
        const cuerpo = (await respuesta.json()) as { ok: boolean; url?: string; error?: string };
        if (!respuesta.ok || !cuerpo.ok || !cuerpo.url) {
          setError(cuerpo.error ?? "No se pudo subir la imagen.");
          continue;
        }
        const datos = new FormData();
        datos.set("proyectoId", String(proyectoId));
        datos.set("url", cuerpo.url);
        const resultado = await agregarImagenAction(null, datos);
        if (resultado && "error" in resultado) setError(resultado.error);
      }
      router.refresh();
    } finally {
      setSubiendo(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function eliminar(imagenId: number) {
    if (!confirm("¿Eliminar esta imagen? Esto no se puede deshacer.")) return;
    setIdOcupado(imagenId);
    const datos = new FormData();
    datos.set("imagenId", String(imagenId));
    datos.set("proyectoId", String(proyectoId));
    const resultado = await eliminarImagenAction(null, datos);
    if (resultado && "error" in resultado) setError(resultado.error);
    router.refresh();
    setIdOcupado(null);
  }

  async function mover(imagenId: number, direccion: "arriba" | "abajo") {
    setIdOcupado(imagenId);
    const datos = new FormData();
    datos.set("proyectoId", String(proyectoId));
    datos.set("imagenId", String(imagenId));
    datos.set("direccion", direccion);
    await moverImagenAction(null, datos);
    router.refresh();
    setIdOcupado(null);
  }

  async function guardarAlt(imagenId: number, altTexto: string) {
    const datos = new FormData();
    datos.set("imagenId", String(imagenId));
    datos.set("proyectoId", String(proyectoId));
    datos.set("altTexto", altTexto);
    await actualizarAltTextoAction(null, datos);
  }

  return (
    <div className="glass tf-reveal rounded-tf-lg p-8 [animation-delay:80ms]">
      <h2 className="font-headline text-xl font-bold uppercase tracking-tight text-primary">
        Imágenes
      </h2>
      <p className="mt-1 text-sm text-muted">
        La primera imagen es la que se usa como portada en el portafolio. JPG, PNG, WEBP o AVIF, hasta 10 MB.
      </p>

      <label className="glass glass-interactive mt-5 flex cursor-pointer items-center justify-center gap-2 rounded-tf-sm px-6 py-4 text-sm font-bold uppercase tracking-wide text-fg hover:text-accent-text">
        {subiendo ? (
          <>
            <span
              className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-accent-text/30 border-t-accent-text"
              aria-hidden="true"
            />
            Subiendo…
          </>
        ) : (
          "+ Agregar imágenes"
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          disabled={subiendo}
          onChange={(e) => subirArchivos(e.target.files)}
          className="sr-only"
        />
      </label>

      {error && (
        <p role="alert" className="mt-3 text-sm text-accent-text">
          {error}
        </p>
      )}

      {imagenes.length === 0 ? (
        <p className="mt-6 text-muted">Todavía no hay imágenes.</p>
      ) : (
        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {imagenes.map((img, i) => (
            <li key={img.id} className="glass-sunken overflow-hidden rounded-tf-md">
              <div className="relative aspect-[4/3] w-full bg-surface-high">
                <Image
                  src={img.url}
                  alt={img.altTexto ?? ""}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
                {i === 0 && (
                  <span className="absolute left-2 top-2 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-on-accent">
                    Portada
                  </span>
                )}
              </div>
              <div className="space-y-3 p-4">
                <input
                  type="text"
                  defaultValue={img.altTexto ?? ""}
                  placeholder="Texto alternativo (describe la imagen)"
                  maxLength={150}
                  onBlur={(e) => guardarAlt(img.id, e.target.value)}
                  className="w-full rounded-tf-sm bg-transparent px-1 py-1 text-xs text-fg outline-none placeholder:text-muted/60"
                />
                <div className="flex items-center justify-between gap-2">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => mover(img.id, "arriba")}
                      disabled={i === 0 || idOcupado === img.id}
                      className="rounded-tf-sm px-2 py-1 text-xs text-muted hover:text-fg disabled:opacity-30"
                      aria-label="Mover arriba"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => mover(img.id, "abajo")}
                      disabled={i === imagenes.length - 1 || idOcupado === img.id}
                      className="rounded-tf-sm px-2 py-1 text-xs text-muted hover:text-fg disabled:opacity-30"
                      aria-label="Mover abajo"
                    >
                      ↓
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => eliminar(img.id)}
                    disabled={idOcupado === img.id}
                    className="rounded-tf-sm px-2 py-1 text-xs font-bold uppercase tracking-wide text-muted hover:text-accent-text disabled:opacity-60"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
