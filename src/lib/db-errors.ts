/**
 * Traduce errores de Postgres (vía el driver de Neon) a mensajes legibles
 * para mostrar en los formularios del panel, en vez del mensaje técnico
 * crudo ("Failed query: insert into ...") que da Drizzle por defecto.
 *
 * Los códigos son SQLSTATE estándar de Postgres:
 * https://www.postgresql.org/docs/current/errcodes-appendix.html
 */
type ErrorConCodigo = { code?: string; cause?: unknown };

/**
 * Drizzle envuelve el error real de Postgres en su propio DrizzleQueryError
 * (mensaje tipo "Failed query: ..."), con el error de pg original en
 * `.cause` (y ese sí trae el código SQLSTATE). Por eso hay que mirar la
 * cadena de `cause` y no solo el error de primer nivel.
 */
function codigoDe(error: unknown, profundidad = 0): string | undefined {
  if (!error || typeof error !== "object" || profundidad > 5) return undefined;
  const conCodigo = error as ErrorConCodigo;
  if (typeof conCodigo.code === "string") return conCodigo.code;
  if (conCodigo.cause) return codigoDe(conCodigo.cause, profundidad + 1);
  return undefined;
}

export function mensajeErrorAmigable(error: unknown, porDefecto: string): string {
  const codigo = codigoDe(error);

  if (codigo === "23505") {
    // unique_violation
    return "Ya existe un registro con ese mismo nombre. Elige otro.";
  }
  if (codigo === "23503") {
    // foreign_key_violation
    return "No se puede completar: hay otros registros que dependen de este.";
  }
  if (codigo === "23502") {
    // not_null_violation
    return "Falta completar un campo obligatorio.";
  }

  // Errores propios (los que lanzamos nosotros mismos con new Error(...), como
  // el de eliminarCategoria cuando todavía tiene proyectos) ya vienen en
  // español y listos para mostrar.
  if (error instanceof Error && !codigo) {
    return error.message;
  }

  return porDefecto;
}
