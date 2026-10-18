import type { Metadata } from "next";
import Link from "next/link";
import { listarProyectosAdmin } from "@/db/admin-queries";
import { ProyectosList } from "@/components/admin/ProyectosList";

export const metadata: Metadata = { title: "Proyectos — Panel" };
export const dynamic = "force-dynamic";

export default async function AdminProyectosPage() {
  const proyectos = await listarProyectosAdmin();

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="tf-reveal font-headline text-3xl font-black uppercase tracking-tighter md:text-4xl">
            Proyectos
          </h1>
          <p className="tf-reveal mt-2 max-w-2xl text-muted [animation-delay:60ms]">
            El portafolio que se muestra en el sitio público. Solo los proyectos publicados aparecen ahí.
          </p>
        </div>
        <Link
          href="/admin/proyectos/nuevo"
          className="glass glass-interactive tf-reveal shrink-0 rounded-tf-sm bg-accent/90 px-6 py-3 text-sm font-bold uppercase tracking-wide text-on-accent [animation-delay:60ms]"
        >
          + Nuevo proyecto
        </Link>
      </div>

      <div className="mt-10">
        <ProyectosList proyectos={proyectos} />
      </div>
    </div>
  );
}
