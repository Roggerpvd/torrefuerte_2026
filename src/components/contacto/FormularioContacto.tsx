"use client";

import { useState, type FormEvent } from "react";
import { OPCIONES_PLAZO, OPCIONES_PRESUPUESTO } from "@/lib/validation/contacto";

type Estado =
  | { tipo: "inicial" }
  | { tipo: "enviando" }
  | { tipo: "ok" }
  | { tipo: "error"; mensaje: string };

const LARGO_MAXIMO_MENSAJE = 2000;

const campoBase =
  "glass-sunken mt-2 w-full rounded-tf-sm px-4 py-3 text-fg outline-none placeholder:text-muted/60";

type Opcion = { id: number; nombre: string };

type Props = {
  /** Servicios para el select "Servicio de interés" (opcional, ayuda a cotizar). */
  servicios: Opcion[];
  /** Categorías para el select "Categoría de interés" (opcional, ayuda a cotizar). */
  categorias: Opcion[];
};

export function FormularioContacto({ servicios, categorias }: Props) {
  const [estado, setEstado] = useState<Estado>({ tipo: "inicial" });
  const [largoMensaje, setLargoMensaje] = useState(0);

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setEstado({ tipo: "enviando" });

    const form = evento.currentTarget;
    const datos = new FormData(form);

    try {
      const respuesta = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: datos.get("nombre"),
          email: datos.get("email"),
          telefono: datos.get("telefono"),
          servicioId: datos.get("servicioId"),
          categoriaId: datos.get("categoriaId"),
          ubicacion: datos.get("ubicacion"),
          metrajeM2: datos.get("metrajeM2"),
          plazoDeseado: datos.get("plazoDeseado"),
          presupuestoReferencial: datos.get("presupuestoReferencial"),
          mensaje: datos.get("mensaje"),
          sitio_web: datos.get("sitio_web"),
        }),
      });

      const cuerpo = (await respuesta.json()) as { ok: boolean; error?: string };

      if (!respuesta.ok || !cuerpo.ok) {
        setEstado({
          tipo: "error",
          mensaje: cuerpo.error ?? "No se pudo enviar el mensaje. Intenta de nuevo.",
        });
        return;
      }

      setEstado({ tipo: "ok" });
      form.reset();
      setLargoMensaje(0);
    } catch {
      setEstado({
        tipo: "error",
        mensaje: "No se pudo conectar con el servidor. Revisa tu conexión e intenta de nuevo.",
      });
    }
  }

  if (estado.tipo === "ok") {
    return (
      <div className="glass tf-reveal rounded-tf-lg p-8">
        <div className="glass flex h-14 w-14 items-center justify-center rounded-full">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-accent-text" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="mt-5 font-headline text-xl font-bold uppercase tracking-tight text-accent-text">
          Mensaje enviado
        </p>
        <p className="mt-2 text-muted">
          Gracias por escribirnos. Te responderemos a la brevedad.
        </p>
        <button
          type="button"
          onClick={() => setEstado({ tipo: "inicial" })}
          className="glass glass-interactive mt-6 rounded-tf-sm px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-fg hover:text-accent-text"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} className="glass tf-reveal space-y-5 rounded-tf-lg p-8" noValidate>
      {/* Honeypot: invisible para una persona, oculto del lector de pantalla y
          fuera del orden de tabulación. Si un bot lo rellena, la API descarta
          el envío en silencio. */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden">
        <label htmlFor="sitio_web">No llenar este campo</label>
        <input type="text" id="sitio_web" name="sitio_web" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label htmlFor="nombre" className="block text-sm font-medium uppercase tracking-wide text-muted">
          Nombre
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          required
          minLength={2}
          maxLength={120}
          className={campoBase}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium uppercase tracking-wide text-muted">
          Correo
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={150}
          className={campoBase}
        />
      </div>

      <div>
        <label htmlFor="telefono" className="block text-sm font-medium uppercase tracking-wide text-muted">
          Número de celular
        </label>
        <input
          id="telefono"
          name="telefono"
          type="tel"
          inputMode="tel"
          placeholder="987 654 321"
          required
          minLength={6}
          maxLength={30}
          className={campoBase}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="servicioId" className="block text-sm font-medium uppercase tracking-wide text-muted">
            Servicio de interés (opcional)
          </label>
          <select id="servicioId" name="servicioId" defaultValue="" className={campoBase}>
            <option value="">Selecciona un servicio</option>
            {servicios.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="categoriaId" className="block text-sm font-medium uppercase tracking-wide text-muted">
            Categoría de interés (opcional)
          </label>
          <select id="categoriaId" name="categoriaId" defaultValue="" className={campoBase}>
            <option value="">Selecciona una categoría</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium uppercase tracking-wide text-muted">
          Para cotizar más rápido (opcional)
        </p>
        <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="ubicacion" className="block text-xs font-medium uppercase tracking-wide text-muted">
              Ubicación del proyecto
            </label>
            <input
              id="ubicacion"
              name="ubicacion"
              type="text"
              maxLength={150}
              placeholder="Distrito, ciudad"
              className={campoBase}
            />
          </div>

          <div>
            <label htmlFor="metrajeM2" className="block text-xs font-medium uppercase tracking-wide text-muted">
              Metraje aproximado (m²)
            </label>
            <input
              id="metrajeM2"
              name="metrajeM2"
              type="number"
              inputMode="numeric"
              min={1}
              max={1000000}
              className={campoBase}
            />
          </div>

          <div>
            <label htmlFor="plazoDeseado" className="block text-xs font-medium uppercase tracking-wide text-muted">
              Plazo deseado
            </label>
            <select id="plazoDeseado" name="plazoDeseado" defaultValue="" className={campoBase}>
              <option value="">Selecciona un plazo</option>
              {OPCIONES_PLAZO.map((opcion) => (
                <option key={opcion} value={opcion}>
                  {opcion}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="presupuestoReferencial" className="block text-xs font-medium uppercase tracking-wide text-muted">
              Presupuesto referencial
            </label>
            <select
              id="presupuestoReferencial"
              name="presupuestoReferencial"
              defaultValue=""
              className={campoBase}
            >
              <option value="">Selecciona un rango</option>
              {OPCIONES_PRESUPUESTO.map((opcion) => (
                <option key={opcion} value={opcion}>
                  {opcion}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-baseline justify-between">
          <label htmlFor="mensaje" className="block text-sm font-medium uppercase tracking-wide text-muted">
            Mensaje
          </label>
          <span className="text-xs text-muted">
            {largoMensaje}/{LARGO_MAXIMO_MENSAJE}
          </span>
        </div>
        <textarea
          id="mensaje"
          name="mensaje"
          required
          minLength={10}
          maxLength={LARGO_MAXIMO_MENSAJE}
          rows={5}
          onChange={(e) => setLargoMensaje(e.target.value.length)}
          className={`${campoBase} resize-y`}
        />
      </div>

      {estado.tipo === "error" && (
        <p role="alert" className="glass rounded-tf-sm border-accent/40 px-4 py-3 text-sm text-accent-text">
          {estado.mensaje}
        </p>
      )}

      <button
        type="submit"
        disabled={estado.tipo === "enviando"}
        className="glass glass-interactive tf-texto-alto-contraste inline-flex items-center gap-2 rounded-tf-sm bg-accent/90 px-6 py-3 text-sm font-bold uppercase tracking-wide disabled:opacity-60"
      >
        {estado.tipo === "enviando" && (
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-on-accent/30 border-t-on-accent" aria-hidden="true" />
        )}
        {estado.tipo === "enviando" ? "Enviando…" : "Enviar mensaje"}
      </button>
    </form>
  );
}
