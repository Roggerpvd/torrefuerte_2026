"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { logoutAction } from "@/app/admin/actions";
import { site } from "@/lib/site";

const NAV_LINKS = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/proyectos", label: "Proyectos" },
  { href: "/admin/categorias", label: "Categorías" },
  { href: "/admin/servicios", label: "Servicios" },
  { href: "/admin/mensajes", label: "Mensajes" },
  { href: "/admin/cuenta", label: "Cuenta" },
] as const;

export function AdminHeader({
  email,
  totalNoLeidos,
}: {
  email: string;
  totalNoLeidos: number;
}) {
  const pathname = usePathname();

  function esActivo(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-20 w-full border-b border-fg/8 bg-[rgb(var(--tf-glass-rgb)/0.1)] backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex max-w-screen-2xl flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-8">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-3">
            <Logo className="h-7 w-auto shrink-0" />
            <span className="font-headline text-base font-bold uppercase tracking-tight">
              {site.name}
              <span className="ml-2 text-accent-text">Admin</span>
            </span>
          </Link>
        </div>

        <nav aria-label="Panel de administración" className="flex flex-wrap items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-active={esActivo(link.href)}
              className={`relative rounded-tf-sm px-3 py-2 text-sm font-medium uppercase tracking-wide transition-colors ${
                esActivo(link.href)
                  ? "glass text-accent-text"
                  : "text-muted hover:text-fg"
              }`}
            >
              {link.label}
              {link.href === "/admin/mensajes" && totalNoLeidos > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-on-accent">
                  {totalNoLeidos}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="hidden text-xs font-medium uppercase tracking-wide text-muted hover:text-fg sm:inline"
          >
            Ver sitio ↗
          </Link>
          <ThemeToggle />
          <span className="hidden text-xs text-muted lg:inline">{email}</span>
          <form action={logoutAction}>
            <button
              type="submit"
              className="glass glass-interactive rounded-tf-sm px-3 py-2 text-xs font-bold uppercase tracking-wide text-fg hover:text-accent-text"
            >
              Salir
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
