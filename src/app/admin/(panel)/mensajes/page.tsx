import type { Metadata } from "next";
import { listarMensajes } from "@/db/admin-queries";
import { MensajesList } from "@/components/admin/MensajesList";

export const metadata: Metadata = { title: "Mensajes — Panel" };
export const dynamic = "force-dynamic";

export default async function AdminMensajesPage() {
  const mensajes = await listarMensajes();

  return (
    <div>
      <h1 className="tf-reveal font-headline text-3xl font-black uppercase tracking-tighter md:text-4xl">
        Mensajes de contacto
      </h1>
      <p className="tf-reveal mt-2 max-w-2xl text-muted [animation-delay:60ms]">
        Lo que llega desde el formulario de contacto del sitio, del más reciente al más antiguo.
      </p>

      <div className="mt-10">
        <MensajesList mensajes={mensajes} />
      </div>
    </div>
  );
}
