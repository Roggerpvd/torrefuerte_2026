import type { Metadata } from "next";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { FormularioLogin } from "@/components/admin/FormularioLogin";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Acceso al panel",
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 px-6 py-16">
      <div className="absolute right-6 top-6">
        <ThemeToggle />
      </div>

      <div className="flex flex-col items-center gap-3 text-center">
        <Logo className="h-12 w-auto text-fg" />
        <div>
          <p className="font-headline text-xl font-bold uppercase tracking-tight">
            {site.name}
          </p>
          <p className="text-sm text-muted">Panel de administración</p>
        </div>
      </div>

      <FormularioLogin />
    </div>
  );
}
