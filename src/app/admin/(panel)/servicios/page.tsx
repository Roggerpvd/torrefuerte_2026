import type { Metadata } from "next";
import { listarServiciosAdmin } from "@/db/admin-queries";
import { ServiciosManager } from "@/components/admin/ServiciosManager";

export const metadata: Metadata = { title: "Servicios — Panel" };
export const dynamic = "force-dynamic";

export default async function AdminServiciosPage() {
  const servicios = await listarServiciosAdmin();

  return (
    <div>
      <h1 className="tf-reveal font-headline text-3xl font-black uppercase tracking-tighter md:text-4xl">
        Servicios
      </h1>
      <p className="tf-reveal mt-2 max-w-2xl text-muted [animation-delay:60ms]">
        Cada grupo se muestra como una tarjeta en la sección de servicios del sitio, con su lista de ítems.
      </p>

      <div className="mt-10">
        <ServiciosManager serviciosIniciales={servicios} />
      </div>
    </div>
  );
}
