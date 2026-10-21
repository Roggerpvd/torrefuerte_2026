import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ClientesDestacados } from "@/components/home/ClientesDestacados";
import { FiltroPortafolio } from "@/components/portafolio/FiltroPortafolio";
import { FormularioContacto } from "@/components/contacto/FormularioContacto";
import { getPortafolio, getServicios } from "@/db/queries";
import { site } from "@/lib/site";

// Se renderiza en cada solicitud: el contenido de portafolio y servicios lo
// edita el panel de administración (Paso 7) y no hay una base de datos
// disponible en el momento de compilar, así que no puede pre-renderizarse
// como página estática.
export const dynamic = "force-dynamic";

// Offset para que el encabezado fijo no tape el inicio de cada sección al
// llegar por un enlace ancla (#portafolio, #servicios, #contacto).
const ANCLA = "scroll-mt-24 md:scroll-mt-28";

export default async function Home() {
  const [{ categorias, proyectos }, servicios] = await Promise.all([
    getPortafolio(),
    getServicios(),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      {/* ───────────────────────── Inicio ───────────────────────── */}
      <section id="inicio" className={`relative flex min-h-[80vh] flex-col justify-center overflow-hidden ${ANCLA}`}>
        {/* Fondo: proyecto real de la empresa, de noche — fachada moderna
            bajo un cielo estrellado, con luz cálida que dialoga con el
            dorado de la marca. Imponente y en línea con la paleta. */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/imagenes/marca/hero-obra.webp"
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
            className="object-cover object-[center_42%]"
            priority
          />
          {/* Velo con el color de fondo del tema para legibilidad, más un
              tinte cian/dorado sutil que ata la foto a la paleta de marca. */}
          <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/80 to-bg/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/10 to-bg/55" />
          <div className="absolute inset-0 bg-primary/10 mix-blend-color" />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-accent/15" />
        </div>

        <div className="mx-auto w-full max-w-screen-2xl px-6 py-24 md:px-12 md:py-32">
          <div className="tf-reveal glass max-w-3xl rounded-tf-lg p-8 md:p-12">
            <h1 className="font-headline text-6xl font-black uppercase leading-[0.88] tracking-tighter md:text-8xl lg:text-9xl">
              {site.name}
              <span className="mt-2 block text-3xl font-bold tracking-tight text-primary md:text-5xl">
                {site.descriptor}
              </span>
            </h1>
            <div className="mt-10 flex max-w-xl items-stretch gap-4">
              <div className="w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              <p className="text-lg font-light leading-relaxed text-muted">
                {site.tagline}
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/#portafolio"
                className="glass glass-interactive rounded-tf-sm bg-accent/90 px-6 py-3 text-sm font-bold uppercase tracking-wide text-on-accent"
              >
                Ver portafolio
              </Link>
              <Link
                href="/#contacto"
                className="glass glass-interactive rounded-tf-sm px-6 py-3 text-sm font-bold uppercase tracking-wide text-fg hover:text-accent-text"
              >
                Contáctanos
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ClientesDestacados />

      {/* ──────────────────────── Portafolio ──────────────────────── */}
      <section id="portafolio" className={`mx-auto w-full max-w-screen-2xl px-6 py-24 md:px-12 ${ANCLA}`}>
        <h2 className="tf-reveal font-headline text-4xl font-black uppercase tracking-tighter md:text-6xl">
          Portafolio
        </h2>
        <p className="tf-reveal mt-4 max-w-2xl text-muted [animation-delay:80ms]">
          Una muestra de nuestros proyectos de arquitectura, ingeniería y construcción.
        </p>

        <div className="mt-10">
          <FiltroPortafolio categorias={categorias} proyectos={proyectos} />
        </div>
      </section>

      {/* ──────────────────────── Servicios ──────────────────────── */}
      <section id="servicios" className={`mx-auto w-full max-w-screen-2xl px-6 py-24 md:px-12 ${ANCLA}`}>
        <h2 className="tf-reveal font-headline text-4xl font-black uppercase tracking-tighter md:text-6xl">
          Servicios
        </h2>
        <p className="tf-reveal mt-4 max-w-2xl text-muted [animation-delay:80ms]">
          Diseño integral: arquitectura, ingeniería y construcción en un solo equipo.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {servicios.map((s, i) => (
            <div
              key={s.id}
              className="glass glass-interactive tf-reveal rounded-tf-lg p-8"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <h3 className="font-headline text-2xl font-bold uppercase tracking-tight text-primary">
                {s.titulo}
              </h3>
              <ul className="mt-6 space-y-3">
                {s.items.map((item) => (
                  <li key={item} className="flex gap-3 text-fg">
                    <span className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {servicios.length === 0 && (
          <p className="mt-10 text-muted">Todavía no hay servicios registrados.</p>
        )}
      </section>

      {/* ──────────────────────── Contacto ──────────────────────── */}
      <section id="contacto" className={`mx-auto w-full max-w-screen-xl px-6 py-24 md:px-12 ${ANCLA}`}>
        <h2 className="font-headline text-4xl font-black uppercase tracking-tighter md:text-6xl">
          Contacto
        </h2>
        <p className="mt-4 max-w-2xl text-muted">
          Cuéntanos sobre tu proyecto y te responderemos a la brevedad.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[2fr_3fr]">
          <div className="glass tf-reveal space-y-6 rounded-tf-lg p-8">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-accent-text">Dirección</p>
              <p className="mt-1 text-fg">{site.address}</p>
            </div>
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-accent-text">Correo</p>
              <a href={`mailto:${site.email}`} className="mt-1 block text-fg hover:text-primary">
                {site.email}
              </a>
            </div>
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-accent-text">Teléfonos</p>
              {site.phones.map((tel) => (
                <p key={tel} className="mt-1 text-fg">
                  {tel}
                </p>
              ))}
            </div>
          </div>

          <div className="tf-reveal [animation-delay:120ms]">
            <FormularioContacto
              servicios={servicios.map((s) => ({ id: s.id, nombre: s.titulo }))}
              categorias={categorias.map((c) => ({ id: c.id, nombre: c.nombre }))}
            />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
