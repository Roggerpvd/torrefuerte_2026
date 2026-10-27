"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { site } from "@/lib/site";

const NAV_LINKS = [
  { href: "/#inicio", id: "inicio", label: "Inicio" },
  { href: "/#portafolio", id: "portafolio", label: "Portafolio" },
  { href: "/#servicios", id: "servicios", label: "Servicios" },
  { href: "/#contacto", id: "contacto", label: "Contacto" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [conScroll, setConScroll] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState<string>("inicio");

  useEffect(() => {
    function alScroll() {
      setConScroll(window.scrollY > 16);
    }
    alScroll();
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => window.removeEventListener("scroll", alScroll);
  }, []);

  // Resalta en el encabezado la sección que está visible mientras se hace
  // scroll por la página única. Solo tiene sentido en "/", donde viven las
  // secciones ancladas (inicio, portafolio, servicios, contacto).
  useEffect(() => {
    if (pathname !== "/") return;

    const secciones = NAV_LINKS.map((link) => document.getElementById(link.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (secciones.length === 0) return;

    const observador = new IntersectionObserver(
      (entradas) => {
        const visible = entradas
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          setSeccionActiva(visible.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    secciones.forEach((el) => observador.observe(el));
    return () => observador.disconnect();
  }, [pathname]);

  function esActivo(id: string) {
    if (pathname !== "/") return false;
    return seccionActiva === id;
  }

  return (
    <header
      className={`sticky top-0 z-20 w-full transition-[background-color,backdrop-filter,box-shadow,border-color] duration-300 ${
        conScroll
          ? "border-b border-fg/8 bg-[rgb(var(--tf-glass-rgb)/0.1)] shadow-[0_8px_24px_-8px_var(--tf-shadow-dark)] backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-screen-2xl flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 py-3 sm:justify-between md:px-8 md:py-4">
        <Link href="/#inicio" className="flex items-center gap-3">
          <Logo className="h-8 w-auto shrink-0" />
          <span className="hidden font-headline text-lg font-bold uppercase tracking-tight min-[420px]:inline">
            {site.name}
          </span>
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-active={esActivo(link.id)}
              className={`nav-link text-sm font-medium uppercase tracking-wide transition-colors ${
                esActivo(link.id) ? "text-accent-text" : "text-muted hover:text-fg"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 md:hidden">
          <nav
            aria-label="Principal"
            className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-active={esActivo(link.id)}
                className={`nav-link text-xs font-medium uppercase tracking-wide transition-colors ${
                  esActivo(link.id) ? "text-accent-text" : "text-muted hover:text-fg"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
        </div>

        <div className="hidden md:block">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
