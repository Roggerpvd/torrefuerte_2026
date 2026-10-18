"use client";

import { useActionState } from "react";
import { cambiarPasswordAction, type EstadoCuenta } from "@/app/admin/(panel)/cuenta/actions";

const campoBase =
  "glass-sunken mt-2 w-full rounded-tf-sm px-4 py-3 text-fg outline-none placeholder:text-muted/60";

export function FormularioCambiarPassword() {
  const [estado, accion, pendiente] = useActionState<EstadoCuenta, FormData>(
    cambiarPasswordAction,
    null
  );

  return (
    <form action={accion} className="glass tf-reveal max-w-md space-y-5 rounded-tf-lg p-8">
      <div>
        <label htmlFor="actual" className="block text-sm font-medium uppercase tracking-wide text-muted">
          Contraseña actual
        </label>
        <input id="actual" name="actual" type="password" autoComplete="current-password" required className={campoBase} />
      </div>
      <div>
        <label htmlFor="nueva" className="block text-sm font-medium uppercase tracking-wide text-muted">
          Nueva contraseña
        </label>
        <input id="nueva" name="nueva" type="password" autoComplete="new-password" required minLength={8} className={campoBase} />
      </div>
      <div>
        <label htmlFor="confirmar" className="block text-sm font-medium uppercase tracking-wide text-muted">
          Confirmar nueva contraseña
        </label>
        <input id="confirmar" name="confirmar" type="password" autoComplete="new-password" required minLength={8} className={campoBase} />
      </div>

      {estado && "error" in estado && (
        <p role="alert" className="glass rounded-tf-sm border-accent/40 px-4 py-3 text-sm text-accent-text">
          {estado.error}
        </p>
      )}
      {estado && "ok" in estado && (
        <p className="glass rounded-tf-sm px-4 py-3 text-sm text-accent-text">
          Contraseña actualizada.
        </p>
      )}

      <button
        type="submit"
        disabled={pendiente}
        className="glass glass-interactive rounded-tf-sm bg-accent/90 px-6 py-3 text-sm font-bold uppercase tracking-wide text-on-accent disabled:opacity-60"
      >
        {pendiente ? "Guardando…" : "Cambiar contraseña"}
      </button>
    </form>
  );
}
