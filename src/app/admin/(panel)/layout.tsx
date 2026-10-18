import { exigirSesion } from "@/lib/auth/session";
import { obtenerResumenPanel } from "@/db/admin-queries";
import { AdminHeader } from "@/components/admin/AdminHeader";

// Grupo de ruta "(panel)": agrupa todas las páginas autenticadas del panel
// (resumen, proyectos, categorías, servicios, mensajes, cuenta) bajo un
// mismo encabezado, sin afectar la URL. /admin/login queda fuera de este
// grupo a propósito, para no mostrarle el encabezado del panel a quien
// todavía no inició sesión.
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  // El proxy (src/proxy.ts) ya hace una verificación optimista antes de
  // llegar aquí, pero la comprobación que importa de verdad es esta: lee
  // la sesión de nuevo contra su firma y redirige si no es válida.
  const sesion = await exigirSesion();
  const resumen = await obtenerResumenPanel();

  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader email={sesion.email} totalNoLeidos={resumen.totalNoLeidos} />
      <main className="mx-auto w-full max-w-screen-2xl flex-1 px-6 py-10 md:px-12">
        {children}
      </main>
    </div>
  );
}
