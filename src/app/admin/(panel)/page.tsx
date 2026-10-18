import type { Metadata } from "next";
import Link from "next/link";
import { obtenerResumenPanel } from "@/db/admin-queries";

export const metadata: Metadata = { title: "Panel de administración" };
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const resumen = await obtenerResumenPanel();

  const tarjetas = [
    {
      titulo: "Proyectos",
      valor: resumen.totalProyectos,
      detalle: `${resumen.totalPublicados} publicados`,
      href: "/admin/proyectos",
    },
    {
      titulo: "Servicios",
      valor: resumen.totalServicios,
      detalle: "grupos de servicio",
      href: "/admin/servicios",
    },
    {
      titulo: "Mensajes",
      valor: resumen.totalMensajes,
      detalle:
        resumen.totalNoLeidos > 0
          ? `${resumen.totalNoLeidos} sin leer`
          : "todos leídos",
      href: "/admin/mensajes",
      destacar: resumen.totalNoLeidos > 0,
    },
  ] as const;

  return (
    <div>
      <h1 className="tf-reveal font-headline text-3xl font-black uppercase tracking-tighter md:text-4xl">
        Resumen
      </h1>
      <p className="tf-reveal mt-2 text-muted [animation-delay:60ms]">
        Un vistazo rápido al contenido del sitio.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tarjetas.map((t, i) => (
          <Link
            key={t.titulo}
            href={t.href}
            style={{ animationDelay: `${i * 80}ms` }}
            className="glass glass-interactive tf-reveal rounded-tf-lg p-8"
          >
            <p className="text-sm font-medium uppercase tracking-wide text-muted">
              {t.titulo}
            </p>
            <p className="mt-3 font-headline text-5xl font-black tracking-tighter">
              {t.valor}
            </p>
            <p
              className={`mt-2 text-sm font-medium uppercase tracking-wide ${
                "destacar" in t && t.destacar ? "text-accent-text" : "text-muted"
              }`}
            >
              {t.detalle}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/admin/proyectos/nuevo"
          className="glass glass-interactive rounded-tf-sm bg-accent/90 px-6 py-3 text-sm font-bold uppercase tracking-wide text-on-accent"
        >
          + Nuevo proyecto
        </Link>
        <Link
          href="/admin/categorias"
          className="glass glass-interactive rounded-tf-sm px-6 py-3 text-sm font-bold uppercase tracking-wide text-fg hover:text-accent-text"
        >
          Gestionar categorías
        </Link>
      </div>
    </div>
  );
}
