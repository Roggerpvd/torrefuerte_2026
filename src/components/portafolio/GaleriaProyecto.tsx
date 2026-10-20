"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Image from "next/image";

export function GaleriaProyecto({
  imagenes,
  titulo,
}: {
  imagenes: { url: string; altTexto: string | null }[];
  titulo: string;
}) {
  const [activa, setActiva] = useState(0);
  const [lightboxAbierto, setLightboxAbierto] = useState(false);
  const marcoRef = useRef<HTMLDivElement>(null);

  function manejarMovimiento(evento: ReactPointerEvent<HTMLDivElement>) {
    if (evento.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const marco = marcoRef.current;
    if (!marco) return;

    const rect = marco.getBoundingClientRect();
    const x = (evento.clientX - rect.left) / rect.width; // 0..1
    const y = (evento.clientY - rect.top) / rect.height; // 0..1

    const tiltX = (0.5 - y) * 10; // rota sobre el eje X según la posición vertical
    const tiltY = (x - 0.5) * 10; // rota sobre el eje Y según la posición horizontal

    marco.style.setProperty("--tilt-x", `${tiltX}deg`);
    marco.style.setProperty("--tilt-y", `${tiltY}deg`);
    marco.style.setProperty("--shine-x", `${x * 100}%`);
    marco.style.setProperty("--shine-y", `${y * 100}%`);
  }

  function restablecer() {
    const marco = marcoRef.current;
    if (!marco) return;
    marco.style.setProperty("--tilt-x", "0deg");
    marco.style.setProperty("--tilt-y", "0deg");
  }

  const abrirLightbox = useCallback((indice: number) => {
    setActiva(indice);
    setLightboxAbierto(true);
  }, []);

  const cerrarLightbox = useCallback(() => {
    setLightboxAbierto(false);
  }, []);

  const anterior = useCallback(() => {
    setActiva((i) => (i - 1 + imagenes.length) % imagenes.length);
  }, [imagenes.length]);

  const siguiente = useCallback(() => {
    setActiva((i) => (i + 1) % imagenes.length);
  }, [imagenes.length]);

  // Bloquea el scroll del fondo y permite cerrar con Escape o navegar con flechas
  // mientras el visor de pantalla completa está abierto.
  useEffect(() => {
    if (!lightboxAbierto) return;

    const estiloPrevio = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function manejarTecla(evento: KeyboardEvent) {
      if (evento.key === "Escape") cerrarLightbox();
      if (evento.key === "ArrowLeft" && imagenes.length > 1) anterior();
      if (evento.key === "ArrowRight" && imagenes.length > 1) siguiente();
    }
    window.addEventListener("keydown", manejarTecla);

    return () => {
      document.body.style.overflow = estiloPrevio;
      window.removeEventListener("keydown", manejarTecla);
    };
  }, [lightboxAbierto, imagenes.length, anterior, siguiente, cerrarLightbox]);

  if (imagenes.length === 0) {
    return (
      <div className="glass flex aspect-[16/10] items-center justify-center rounded-tf-lg text-muted">
        Sin imágenes registradas
      </div>
    );
  }

  return (
    <div>
      {/* El marco no fuerza una relación de aspecto fija: toma la altura de la
          imagen que muestra, para que cada foto (vertical, horizontal o
          cuadrada) tenga su propio espacio en vez de recortarse o dejar
          franjas vacías dentro de una caja de tamaño fijo. */}
      <div
        ref={marcoRef}
        onPointerMove={manejarMovimiento}
        onPointerLeave={restablecer}
        className="glass group relative w-full overflow-hidden rounded-tf-lg [transform-style:preserve-3d]"
        style={{
          transform:
            "perspective(1200px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg))",
          transition: "transform 0.15s ease-out",
        }}
      >
        <button
          type="button"
          onClick={() => abrirLightbox(activa)}
          aria-label={`Ver "${imagenes[activa].altTexto ?? titulo}" en pantalla completa`}
          className="block w-full cursor-zoom-in"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- se omite
              "fill" a propósito: así la imagen conserva su proporción natural
              y el marco se adapta a su tamaño en vez de recortarla. */}
          <img
            key={imagenes[activa].url}
            src={imagenes[activa].url}
            alt={imagenes[activa].altTexto ?? titulo}
            className="mx-auto block h-auto max-h-[70vh] w-auto max-w-full"
          />
        </button>
        {/* Brillo que sigue al cursor, visible solo con mouse (ver opacity en hover) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(circle at var(--shine-x, 50%) var(--shine-y, 50%), rgb(255 255 255 / 0.22), transparent 55%)",
          }}
        />
        {/* Pista visual de que la imagen se puede ampliar */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-tf-sm bg-bg/70 px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-fg opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100"
        >
          <span aria-hidden="true">⤢</span> Ampliar
        </div>
      </div>

      {imagenes.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-6">
          {imagenes.map((img, i) => (
            <button
              key={img.url}
              type="button"
              onClick={() => setActiva(i)}
              aria-label={`Ver imagen ${i + 1} de ${imagenes.length}`}
              aria-current={activa === i}
              className={`glass glass-interactive relative aspect-square overflow-hidden rounded-tf-sm ${
                activa === i ? "border-accent/60" : ""
              }`}
            >
              <Image
                src={img.url}
                alt=""
                fill
                sizes="120px"
                className="object-contain"
              />
            </button>
          ))}
        </div>
      )}

      {lightboxAbierto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${titulo}: imagen ${activa + 1} de ${imagenes.length}`}
          // Por encima de todo (encabezado incluido) y con el mismo fondo de
          // vidrio al 10% de transparencia que el resto del sitio: lo de
          // atrás (la página) queda visible pero desenfocado, sin una capa
          // oscura encima. Solo la imagen, centrada en toda la pantalla, y
          // una X para cerrar. Las flechas del teclado siguen funcionando
          // para moverse entre fotos cuando hay más de una.
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgb(var(--tf-glass-rgb)/0.1)] p-8 backdrop-blur-2xl backdrop-saturate-150 sm:p-16"
          onClick={cerrarLightbox}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- tamaño
              natural de la imagen, acotado a lo que cabe en la pantalla, con
              margen alrededor para que no quede pegada a los bordes. */}
          <img
            src={imagenes[activa].url}
            alt={imagenes[activa].altTexto ?? titulo}
            className="max-h-[78vh] max-w-[78vw] rounded-tf-md shadow-2xl"
            onClick={(evento) => evento.stopPropagation()}
          />

          <button
            type="button"
            onClick={cerrarLightbox}
            aria-label="Cerrar"
            className="glass glass-interactive fixed right-4 top-4 z-[110] flex h-11 w-11 items-center justify-center rounded-full text-lg font-bold sm:right-6 sm:top-6"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
