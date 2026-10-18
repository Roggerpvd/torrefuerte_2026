"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/admin/login/actions";

const campoBase =
  "glass-sunken mt-2 w-full rounded-tf-sm px-4 py-3 text-fg outline-none placeholder:text-muted/60";

export function FormularioLogin() {
  const [estado, accion, pendiente] = useActionState(loginAction, null);

  return (
    <form action={accion} className="glass tf-reveal w-full max-w-sm space-y-5 rounded-tf-lg p-8">
      <div>
        <label htmlFor="email" className="block text-sm font-medium uppercase tracking-wide text-muted">
          Correo
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className={campoBase}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium uppercase tracking-wide text-muted">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={campoBase}
        />
      </div>

      {estado?.error && (
        <p role="alert" className="glass rounded-tf-sm border-accent/40 px-4 py-3 text-sm text-accent-text">
          {estado.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pendiente}
        className="glass glass-interactive flex w-full items-center justify-center gap-2 rounded-tf-sm bg-accent/90 px-6 py-3 text-sm font-bold uppercase tracking-wide text-on-accent disabled:opacity-60"
      >
        {pendiente && (
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-on-accent/30 border-t-on-accent" aria-hidden="true" />
        )}
        {pendiente ? "Entrando…" : "Iniciar sesión"}
      </button>
    </form>
  );
}
