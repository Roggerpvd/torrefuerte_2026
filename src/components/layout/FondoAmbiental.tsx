/**
 * Manchas de color desenfocadas, fijas detrás de todo el contenido.
 * El efecto de vidrio (`backdrop-filter: blur`) necesita algo con color
 * detrás para desenfocar; sin este fondo, los paneles de vidrio se ven
 * planos porque no hay nada que "esmerilar".
 */
export function FondoAmbiental() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="absolute left-[-10%] top-[-15%] h-[55vmax] w-[55vmax] rounded-full bg-primary/25 blur-[120px]" />
      <div className="absolute right-[-15%] top-[20%] h-[45vmax] w-[45vmax] rounded-full bg-accent/15 blur-[130px]" />
      <div className="absolute bottom-[-20%] left-[20%] h-[50vmax] w-[50vmax] rounded-full bg-primary/15 blur-[140px]" />
    </div>
  );
}
