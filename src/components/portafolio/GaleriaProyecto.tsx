"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";

export function GaleriaProyecto({
  imagenes,
  titulo,
}: {
  imagenes: { url: string; altTexto: string | null }[];
  titulo: string;
}) {
  const [activa, setActiva] = useState(0);
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

  if (imagenes.length === 0) {
    return (
      <div className="glass flex aspect-[16/10] items-center justify-center rounded-tf-lg text-muted">
        Sin imágenes registradas
      </div>
    );
  }

  return (
    <div>
      <div
        ref={marcoRef}
        onPointerMove={manejarMovimiento}
        onPointerLeave={restablecer}
        className="glass group relative aspect-[16/10] w-full overflow-hidden rounded-tf-lg [transform-style:preserve-3d]"
        style={{
          transform:
            "perspective(1200px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg))",
          transition: "transform 0.15s ease-out",
        }}
      >
        <Image
          key={imagenes[activa].url}
          src={imagenes[activa].url}
          alt={imagenes[activa].altTexto ?? titulo}
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover"
          priority
        />
        {/* Brillo que sigue al cursor, visible solo con mouse (ver opacity en hover) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(circle at var(--shine-x, 50%) var(--shine-y, 50%), rgb(255 255 255 / 0.22), transparent 55%)",
          }}
        />
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
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
