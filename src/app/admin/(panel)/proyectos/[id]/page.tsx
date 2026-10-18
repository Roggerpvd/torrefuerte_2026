import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { listarCategorias, obtenerProyectoAdminPorId } from "@/db/admin-queries";
import { ProyectoForm } from "@/components/admin/ProyectoForm";
import { GaleriaImagenesAdmin } from "@/components/admin/GaleriaImagenesAdmin";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ creado?: string }>;

export const metadata: Metadata = { title: "Editar proyecto — Panel" };
export const dynamic = "force-dynamic";

export default async function EditarProyectoPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { id } = await params;
  const { creado } = await searchParams;
  const idNumerico = Number(id);
  if (!Number.isInteger(idNumerico)) notFound();

  const [proyecto, categorias] = await Promise.all([
    obtenerProyectoAdminPorId(idNumerico),
    listarCategorias(),
  ]);
  if (!proyecto) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/admin/proyectos"
        className="glass glass-interactive inline-flex items-center gap-2 rounded-tf-sm px-4 py-2 text-sm font-medium uppercase tracking-wide text-muted hover:text-fg"
      >
        <span aria-hidden="true">←</span> Volver a proyectos
      </Link>

      <h1 className="tf-reveal mt-6 font-headline text-3xl font-black uppercase tracking-tighter md:text-4xl">
        {proyecto.titulo}
      </h1>

      {creado === "1" && (
        <p
          role="status"
          className="tf-reveal glass mt-4 rounded-tf-sm px-4 py-3 text-sm text-accent-text [animation-delay:40ms]"
        >
          Proyecto creado. Ahora puedes agregarle imágenes abajo.
        </p>
      )}

      <div className="mt-8 space-y-8">
        <ProyectoForm categorias={categorias} proyecto={proyecto} />
        <GaleriaImagenesAdmin proyectoId={proyecto.id} imagenesIniciales={proyecto.imagenes} />
      </div>
    </div>
  );
}
