import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { GaleriaProyecto } from "@/components/portafolio/GaleriaProyecto";
import { getProyectoPorId } from "@/db/queries";

type Params = Promise<{ id: string }>;

// Se renderiza en cada solicitud: ver la nota en src/app/portafolio/page.tsx.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  const proyecto = Number.isInteger(Number(id))
    ? await getProyectoPorId(Number(id))
    : null;
  return { title: proyecto ? proyecto.titulo : "Proyecto no encontrado" };
}

export default async function ProyectoPage({ params }: { params: Params }) {
  const { id } = await params;
  const idNumerico = Number(id);

  if (!Number.isInteger(idNumerico)) {
    notFound();
  }

  const proyecto = await getProyectoPorId(idNumerico);
  if (!proyecto) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-screen-xl flex-1 px-6 py-16 md:px-12">
        <Link
          href="/#portafolio"
          className="glass glass-interactive inline-flex items-center gap-2 rounded-tf-sm px-4 py-2 text-sm font-medium uppercase tracking-wide text-muted hover:text-fg"
        >
          <span aria-hidden="true">←</span> Volver al portafolio
        </Link>

        <div className="tf-reveal mt-6 grid grid-cols-1 gap-10 lg:grid-cols-[3fr_2fr]">
          <GaleriaProyecto imagenes={proyecto.imagenes} titulo={proyecto.titulo} />

          <div className="glass h-fit rounded-tf-lg p-8">
            <p className="text-sm font-medium uppercase tracking-wide text-accent-text">
              {proyecto.categoriaNombre}
              {proyecto.anio ? ` · ${proyecto.anio}` : ""}
            </p>
            <h1 className="mt-2 font-headline text-3xl font-black uppercase tracking-tighter md:text-4xl">
              {proyecto.titulo}
            </h1>
            <p className="mt-6 leading-relaxed text-muted">{proyecto.descripcion}</p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
