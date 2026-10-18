"use client";

import { useState } from "react";
import { marcarMensajeAction, eliminarMensajeAction } from "@/app/admin/(panel)/mensajes/actions";

type Mensaje = {
  id: number;
  nombre: string;
  email: string;
  telefono: string | null;
  servicioNombre: string | null;
  categoriaNombre: string | null;
  ubicacion: string | null;
  metrajeM2: number | null;
  plazoDeseado: string | null;
  presupuestoReferencial: string | null;
  mensaje: string;
  leido: boolean;
  creadoEn: Date;
};

/** Deja solo dígitos y antepone el 51 de Perú si el número no trae código de país. */
function numeroWhatsApp(telefono: string): string {
  const soloDigitos = telefono.replace(/\D/g, "");
  if (soloDigitos.startsWith("51")) return soloDigitos;
  return `51${soloDigitos}`;
}

const formateador = new Intl.DateTimeFormat("es-PE", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function MensajesList({ mensajes }: { mensajes: Mensaje[] }) {
  if (mensajes.length === 0) {
    return <p className="text-muted">Todavía no llegó ningún mensaje de contacto.</p>;
  }

  return (
    <ul className="space-y-4">
      {mensajes.map((m, i) => (
        <li key={m.id} className="tf-reveal" style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}>
          <TarjetaMensaje mensaje={m} />
        </li>
      ))}
    </ul>
  );
}

/** Arma el texto de WhatsApp con los datos de cotización que el visitante llenó, para que el administrador no tenga que retipearlos. */
function textoWhatsApp(mensaje: Mensaje): string {
  const partes = [
    `Hola ${mensaje.nombre}, somos de Torre Fuerte Arquitectos e Ingenieros. Gracias por tu consulta${
      mensaje.servicioNombre ? ` sobre ${mensaje.servicioNombre}` : ""
    }${mensaje.categoriaNombre ? ` (${mensaje.categoriaNombre})` : ""}.`,
  ];
  const datos: string[] = [];
  if (mensaje.ubicacion) datos.push(`ubicación: ${mensaje.ubicacion}`);
  if (mensaje.metrajeM2) datos.push(`metraje: ${mensaje.metrajeM2} m²`);
  if (mensaje.plazoDeseado) datos.push(`plazo: ${mensaje.plazoDeseado}`);
  if (mensaje.presupuestoReferencial) datos.push(`presupuesto: ${mensaje.presupuestoReferencial}`);
  if (datos.length > 0) {
    partes.push(`Con los datos que nos diste (${datos.join(", ")}) te contamos los detalles:`);
  } else {
    partes.push("Te contamos los detalles:");
  }
  return partes.join(" ");
}

function TarjetaMensaje({ mensaje }: { mensaje: Mensaje }) {
  const [abierto, setAbierto] = useState(false);
  const mensajeCorto = mensaje.mensaje.length > 160 && !abierto;

  return (
    <div
      className={`glass rounded-tf-lg p-6 ${mensaje.leido ? "" : "border-accent/30"}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {!mensaje.leido && (
              <span className="h-2 w-2 shrink-0 rounded-full bg-accent" aria-label="No leído" />
            )}
            <p className="font-headline text-lg font-bold uppercase tracking-tight">
              {mensaje.nombre}
            </p>
          </div>
          <p className="mt-1 text-sm text-muted">
            <a href={`mailto:${mensaje.email}`} className="hover:text-fg">
              {mensaje.email}
            </a>
            {mensaje.telefono && <span> · {mensaje.telefono}</span>}
          </p>
          <p className="mt-1 text-xs text-muted">{formateador.format(mensaje.creadoEn)}</p>

          {(mensaje.servicioNombre || mensaje.categoriaNombre) && (
            <div className="mt-2 flex flex-wrap gap-2">
              {mensaje.servicioNombre && (
                <span className="glass rounded-tf-sm px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-accent-text">
                  {mensaje.servicioNombre}
                </span>
              )}
              {mensaje.categoriaNombre && (
                <span className="glass rounded-tf-sm px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                  {mensaje.categoriaNombre}
                </span>
              )}
            </div>
          )}

          {/* Datos para cotizar: solo los que el visitante llenó, cada uno
              con su etiqueta para no tener que adivinar qué número es cuál. */}
          {(mensaje.ubicacion || mensaje.metrajeM2 || mensaje.plazoDeseado || mensaje.presupuestoReferencial) && (
            <dl className="mt-3 grid grid-cols-1 gap-x-4 gap-y-1 text-sm text-muted sm:grid-cols-2">
              {mensaje.ubicacion && (
                <div className="flex gap-1">
                  <dt className="font-medium text-fg/80">Ubicación:</dt>
                  <dd>{mensaje.ubicacion}</dd>
                </div>
              )}
              {mensaje.metrajeM2 && (
                <div className="flex gap-1">
                  <dt className="font-medium text-fg/80">Metraje:</dt>
                  <dd>{mensaje.metrajeM2} m²</dd>
                </div>
              )}
              {mensaje.plazoDeseado && (
                <div className="flex gap-1">
                  <dt className="font-medium text-fg/80">Plazo:</dt>
                  <dd>{mensaje.plazoDeseado}</dd>
                </div>
              )}
              {mensaje.presupuestoReferencial && (
                <div className="flex gap-1">
                  <dt className="font-medium text-fg/80">Presupuesto:</dt>
                  <dd>{mensaje.presupuestoReferencial}</dd>
                </div>
              )}
            </dl>
          )}

          {/* Respuesta rápida: WhatsApp (si dejó celular) y correo, ambos con
              el contexto de la consulta ya escrito para no retipear nada. */}
          <div className="mt-3 flex flex-wrap gap-2">
            {mensaje.telefono && (
              <a
                href={`https://wa.me/${numeroWhatsApp(mensaje.telefono)}?text=${encodeURIComponent(
                  textoWhatsApp(mensaje)
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="glass glass-interactive rounded-tf-sm px-3 py-2 text-xs font-bold uppercase tracking-wide text-fg hover:text-accent-text"
              >
                Responder por WhatsApp
              </a>
            )}
            <a
              href={`mailto:${mensaje.email}?subject=${encodeURIComponent(
                `Re: tu consulta a Torre Fuerte${mensaje.servicioNombre ? ` — ${mensaje.servicioNombre}` : ""}`
              )}`}
              className="glass glass-interactive rounded-tf-sm px-3 py-2 text-xs font-bold uppercase tracking-wide text-fg hover:text-accent-text"
            >
              Responder por correo
            </a>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <form action={marcarMensajeAction}>
            <input type="hidden" name="id" value={mensaje.id} />
            <input type="hidden" name="leido" value={(!mensaje.leido).toString()} />
            <button
              type="submit"
              className="glass glass-interactive rounded-tf-sm px-3 py-2 text-xs font-bold uppercase tracking-wide text-fg hover:text-accent-text"
            >
              {mensaje.leido ? "Marcar no leído" : "Marcar leído"}
            </button>
          </form>
          <form
            action={eliminarMensajeAction}
            onSubmit={(e) => {
              if (!confirm(`¿Eliminar el mensaje de ${mensaje.nombre}?`)) {
                e.preventDefault();
              }
            }}
          >
            <input type="hidden" name="id" value={mensaje.id} />
            <button
              type="submit"
              className="glass glass-interactive rounded-tf-sm px-3 py-2 text-xs font-bold uppercase tracking-wide text-muted hover:text-accent-text"
            >
              Eliminar
            </button>
          </form>
        </div>
      </div>

      <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-fg">
        {mensajeCorto ? `${mensaje.mensaje.slice(0, 160)}…` : mensaje.mensaje}
      </p>
      {mensaje.mensaje.length > 160 && (
        <button
          type="button"
          onClick={() => setAbierto((v) => !v)}
          className="mt-2 text-xs font-bold uppercase tracking-wide text-accent-text"
        >
          {abierto ? "Ver menos" : "Ver más"}
        </button>
      )}
    </div>
  );
}
