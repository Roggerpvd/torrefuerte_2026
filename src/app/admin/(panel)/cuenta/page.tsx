import type { Metadata } from "next";
import { exigirSesion } from "@/lib/auth/session";
import { FormularioCambiarPassword } from "@/components/admin/FormularioCambiarPassword";

export const metadata: Metadata = { title: "Cuenta — Panel" };
export const dynamic = "force-dynamic";

export default async function AdminCuentaPage() {
  const sesion = await exigirSesion();

  return (
    <div>
      <h1 className="tf-reveal font-headline text-3xl font-black uppercase tracking-tighter md:text-4xl">
        Cuenta
      </h1>
      <p className="tf-reveal mt-2 max-w-2xl text-muted [animation-delay:60ms]">
        Sesión iniciada como <span className="text-fg">{sesion.email}</span>.
      </p>

      <div className="mt-10">
        <FormularioCambiarPassword />
      </div>
    </div>
  );
}
