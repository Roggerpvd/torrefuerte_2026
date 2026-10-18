import type { Metadata } from "next";
import Link from "next/link";
import { listarCategorias } from "@/db/admin-queries";
import { ProyectoForm } from "@/components/admin/ProyectoForm";

export const metadata: Metadata = { title: "Nuevo proyecto — Panel" };
export const dynamic = "force-dynamic";

export default async function NuevoProyectoPage() {
  const categorias = await listarCategorias();

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/admin/proyectos"
        className="glass glass-interactive inline-flex items-center gap-2 rounded-tf-sm px-4 py-2 text-sm font-medium uppercase tracking-wide text-muted hover:text-fg"
      >
        <span aria-hidden="true">←</span> Volver a proyectos
      </Link>

      <h1 className="tf-reveal mt-6 font-headline text-3xl font-black uppercase tracking-tighter md:text-4xl">
        Nuevo proyecto
      </h1>
      <p className="tf-reveal mt-2 text-muted [animation-delay:60ms]">
        Primero guarda los datos; luego de crearlo podrás agregarle imágenes.
      </p>

      <div className="mt-8">
        <ProyectoForm categorias={categorias} />
      </div>
    </div>
  );
}
