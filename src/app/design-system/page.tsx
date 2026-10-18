import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export const metadata: Metadata = {
  title: "Sistema de diseño | Torre Fuerte",
  robots: { index: false },
};

/** Documentación viva de los tokens. Los valores deben coincidir con globals.css. */
const colors = [
  { token: "bg", swatch: "bg-bg", role: "Fondo de la página", dark: "#001116", light: "#F3F7F8" },
  { token: "surface", swatch: "bg-surface", role: "Tarjetas y secciones", dark: "#00161C", light: "#E8EFF1" },
  { token: "surface-high", swatch: "bg-surface-high", role: "Elementos elevados", dark: "#00232C", light: "#DCE6E9" },
  { token: "fg", swatch: "bg-fg", role: "Texto principal", dark: "#E5E5E5", light: "#001116" },
  { token: "muted", swatch: "bg-muted", role: "Texto secundario", dark: "#9DB4BB", light: "#4A626A" },
  { token: "primary", swatch: "bg-primary", role: "Cian de la marca", dark: "#89EFFF", light: "#00596A" },
  { token: "accent", swatch: "bg-accent", role: "Dorado (rellenos y botones)", dark: "#CC9900", light: "#CC9900" },
  { token: "accent-text", swatch: "bg-accent-text", role: "Dorado para texto", dark: "#CC9900", light: "#7A5C00" },
];

export default function DesignSystemPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:px-12">
      <header className="glass sticky top-4 z-10 flex items-center justify-between rounded-tf-md px-5 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Logo className="h-8 w-auto" />
          <span className="font-headline text-lg font-bold uppercase tracking-tight">Torre Fuerte</span>
        </Link>
        <ThemeToggle />
      </header>

      <h1 className="mt-16 font-headline text-5xl font-black uppercase tracking-tighter md:text-7xl">
        Sistema de diseño
      </h1>
      <p className="mt-4 max-w-2xl text-muted">
        Referencia de colores, tipografías, logo, vidrio/relieve y componentes base. Cambia el tema con el botón de arriba para ver cómo responde cada elemento.
      </p>

      <section className="mt-16">
        <h2 className="font-headline text-2xl font-bold">Colores</h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {colors.map((c) => (
            <div key={c.token} className="glass rounded-tf-md p-4">
              <div className={`h-16 rounded-tf-sm border border-line ${c.swatch}`} />
              <p className="mt-3 font-headline font-bold">{c.token}</p>
              <p className="text-sm text-muted">{c.role}</p>
              <p className="mt-2 text-xs text-muted">
                Oscuro {c.dark} · Claro {c.light}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-headline text-2xl font-bold">Tipografía</h2>
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <div className="glass rounded-tf-md p-6">
            <p className="text-sm text-muted">Space Grotesk · títulos y etiquetas</p>
            <p className="mt-3 font-headline text-5xl font-black uppercase leading-none tracking-tighter">
              Diseño y obra
            </p>
            <p className="mt-3 font-headline text-2xl font-bold">Construcción y supervisión</p>
          </div>
          <div className="glass rounded-tf-md p-6">
            <p className="text-sm text-muted">Inter · texto de lectura</p>
            <p className="mt-3 max-w-md leading-relaxed">
              Combinamos ingeniería, arquitectura y construcción para convertir conceptos en espacios que funcionan y perduran.
            </p>
            <p className="mt-3 max-w-md text-sm font-light leading-relaxed text-muted">
              Texto secundario en peso ligero, para descripciones y notas.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-headline text-2xl font-bold">Logo</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Un solo SVG que hereda el color del texto: se adapta a cada tema y a cada fondo.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="glass flex items-center justify-center rounded-tf-md p-10">
            <Logo className="h-24 w-auto text-fg" />
          </div>
          <div className="glass flex items-center justify-center rounded-tf-md p-10">
            <Logo className="h-24 w-auto text-primary" />
          </div>
          <div className="flex items-center justify-center rounded-tf-md bg-accent p-10">
            <Logo className="h-24 w-auto text-on-accent" />
          </div>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-headline text-2xl font-bold">Vidrio y relieve (soft UI)</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Glassmorphism + neumorphism: paneles translúcidos al 10% de opacidad
          (<code className="text-accent-text">rgb(var(--tf-glass-rgb) / 0.1)</code>) con desenfoque de fondo y una
          sombra de dos tonos (oscura hacia abajo-derecha, clara hacia arriba-izquierda) que da sensación de
          relieve. Radios moderados — nunca burbujas — para conservar el carácter angular de la marca.
        </p>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Flotante (.glass .glass-interactive)</p>
            <button type="button" className="glass glass-interactive w-full rounded-tf-md p-6 text-left">
              <p className="font-headline font-bold">Tarjeta elevada</p>
              <p className="mt-1 text-sm text-muted">Sube al pasar el cursor, baja al hacer clic.</p>
            </button>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Presionada (.glass-pressed)</p>
            <div className="glass glass-pressed rounded-tf-md p-6">
              <p className="font-headline font-bold">Filtro activo</p>
              <p className="mt-1 text-sm text-muted">Tinte de acento, sombra hacia adentro.</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Hundida (.glass-sunken)</p>
            <div className="glass-sunken rounded-tf-sm p-6">
              <p className="font-headline font-bold">Campo de formulario</p>
              <p className="mt-1 text-sm text-muted">Sombra interior, sin relleno flotante.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16 pb-16">
        <h2 className="font-headline text-2xl font-bold">Botones</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Todos los botones usan la clase <code className="text-accent-text">.glass</code> con radios moderados
          (10–24px), nunca completamente redondos.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <button
            type="button"
            className="glass glass-interactive rounded-tf-sm bg-accent/90 px-6 py-3 font-headline text-sm font-bold uppercase tracking-widest text-on-accent"
          >
            Ver portafolio
          </button>
          <button
            type="button"
            className="glass glass-interactive rounded-tf-sm px-6 py-3 font-headline text-sm font-bold uppercase tracking-widest text-accent-text"
          >
            Contáctanos
          </button>
        </div>
      </section>
    </div>
  );
}
