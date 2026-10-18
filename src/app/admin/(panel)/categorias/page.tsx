import type { Metadata } from "next";
import { listarCategorias } from "@/db/admin-queries";
import { CategoriasManager } from "@/components/admin/CategoriasManager";

export const metadata: Metadata = { title: "Categorías — Panel" };
export const dynamic = "force-dynamic";

export default async function AdminCategoriasPage() {
  const categorias = await listarCategorias();

  return (
    <div>
      <h1 className="tf-reveal font-headline text-3xl font-black uppercase tracking-tighter md:text-4xl">
        Categorías
      </h1>
      <p className="tf-reveal mt-2 max-w-2xl text-muted [animation-delay:60ms]">
        Agrupan los proyectos del portafolio. El slug se genera automáticamente a partir del nombre.
      </p>

      <div className="mt-10">
        <CategoriasManager categoriasIniciales={categorias} />
      </div>
    </div>
  );
}
