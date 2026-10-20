"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";

// Debe coincidir con la duración de las animaciones "tf-intro-logo" y
// "tf-intro-bg" en globals.css.
const DURACION_MS = 1800;

/**
 * Pantalla de bienvenida que se muestra una sola vez por carga completa del
 * sitio: vive en el layout raíz, así que Next.js la mantiene montada (y por
 * lo tanto oculta) mientras la persona navega entre páginas con los enlaces
 * internos; solo vuelve a aparecer en una recarga real del navegador.
 *
 * El ícono aparece centrado, se mantiene un instante y luego la "cámara" se
 * acerca hasta atravesarlo; recién entonces se revela la página de atrás.
 * No se muestra dentro del panel de administración, para no interrumpir el
 * trabajo diario. Con "prefers-reduced-motion: reduce" la animación es
 * instantánea (ver la regla global en globals.css), así que el tiempo de
 * espera también se salta.
 */
export function IntroSplash() {
  const pathname = usePathname();
  const [terminado, setTerminado] = useState(false);

  useEffect(() => {
    if (pathname?.startsWith("/admin")) return;

    const prefiereMenosMovimiento = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const duracion = prefiereMenosMovimiento ? 0 : DURACION_MS;

    const estiloPrevio = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const temporizador = window.setTimeout(() => {
      setTerminado(true);
      document.body.style.overflow = estiloPrevio;
    }, duracion);

    return () => {
      window.clearTimeout(temporizador);
      document.body.style.overflow = estiloPrevio;
    };
    // Solo debe correr una vez, al montar (la carga inicial de la app).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (terminado || pathname?.startsWith("/admin")) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[200] flex items-center justify-center bg-bg [animation:tf-intro-bg_1.8s_cubic-bezier(0.65,0,0.35,1)_both]"
    >
      <div className="flex flex-col items-center gap-4 [animation:tf-intro-logo_1.8s_cubic-bezier(0.65,0,0.35,1)_both]">
        <Logo className="h-20 w-20 text-fg sm:h-24 sm:w-24" />
        <p className="font-headline text-xl font-black uppercase tracking-[0.2em] text-fg sm:text-2xl">
          Torre Fuerte
        </p>
      </div>
      <span className="sr-only">Cargando Torre Fuerte…</span>
    </div>
  );
}
