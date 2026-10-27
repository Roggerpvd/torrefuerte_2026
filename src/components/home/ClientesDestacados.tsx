// Cinta de clientes / proyectos de mayor valor, antes del portafolio
// general. Es una sola fila que corre de derecha a izquierda sin parar
// (ver ".tf-marquee-track" en globals.css); el contenido se repite varias
// veces seguidas para que el recorrido se vea continuo y lleno, incluso
// cuando todavía hay un solo cliente cargado.
//
// Clientes reales con obras ejecutadas por la empresa (brochure
// institucional). El logo de cada cliente, si se tiene, se coloca en
// public/imagenes/marca/ y se referencia aquí con la ruta; el campo
// "servicio" es el tipo de trabajo ejecutado para ese cliente (se
// muestra como una etiqueta junto al nombre).
import Image from "next/image";

type ClienteDestacado = {
  nombre: string;
  subtitulo?: string;
  /** Ruta dentro de /public al logo real (PNG o SVG). Opcional: sin esto
   *  se muestra el nombre como texto, igual que ahora. */
  logo?: string;
  /** Tipo de servicio ejecutado para este cliente, p. ej. "Ampliación". */
  servicio?: string;
};

const CLIENTES: ClienteDestacado[] = [
  {
    nombre: "Colegios Peruanos S.A.",
    subtitulo: "Innova Schools — varias sedes",
    servicio: "Supervisión y ampliación",
  },
  {
    nombre: "Municipalidad Provincial de Tarata",
    subtitulo: "Saneamiento y mantenimiento",
    servicio: "Obra pública",
  },
  {
    nombre: "Wayra Inmobiliaria SAC",
    subtitulo: "Innova Schools, Moquegua",
    servicio: "Ampliación",
  },
  {
    nombre: "Consorcio Legionario",
    subtitulo: "Gobierno Regional de Tacna",
    servicio: "Mejoramiento",
  },
  {
    nombre: "Varcoc Ingenieros SAC",
    subtitulo: "Corporación ADC",
    servicio: "Desmontaje",
  },
];

// Con pocos clientes reales la cinta se ve vacía o el recorrido tarda en
// notarse; se repite el arreglo hasta tener al menos este número de
// tarjetas antes de duplicarlo para el bucle.
const MINIMO_TARJETAS = 6;
const clientesRellenos: ClienteDestacado[] = Array.from(
  { length: Math.max(MINIMO_TARJETAS, CLIENTES.length) },
  (_, i) => CLIENTES[i % CLIENTES.length]
);

function Chip({ cliente }: { cliente: ClienteDestacado }) {
  return (
    <div className="glass mx-3 flex shrink-0 items-center gap-3 rounded-tf-md px-6 py-4">
      {cliente.logo ? (
        <Image
          src={cliente.logo}
          alt={cliente.nombre}
          width={40}
          height={40}
          className="h-10 w-10 shrink-0 object-contain"
        />
      ) : (
        <span className="h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />
      )}
      <div>
        <div className="flex items-center gap-2">
          <p className="font-headline text-lg font-bold uppercase leading-tight tracking-tight text-fg">
            {cliente.nombre}
          </p>
          {cliente.servicio && (
            <span className="rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-accent-text">
              {cliente.servicio}
            </span>
          )}
        </div>
        {cliente.subtitulo && (
          <p className="text-xs uppercase tracking-wide text-muted">{cliente.subtitulo}</p>
        )}
      </div>
    </div>
  );
}

export function ClientesDestacados() {
  if (CLIENTES.length === 0) return null;

  return (
    <section
      aria-label="Proyectos de mayor valor"
      className="mx-auto w-full max-w-screen-2xl px-6 py-14 md:px-12"
    >
      <p className="tf-reveal text-center text-sm font-medium uppercase tracking-[0.2em] text-muted">
        Proyectos de mayor valor
      </p>

      <div
        className="tf-reveal relative mt-8 overflow-hidden [animation-delay:80ms] [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
      >
        <div className="tf-marquee-track flex w-max">
          {/* Duplicado para el bucle continuo; oculto a lectores de pantalla. */}
          {[0, 1].map((copia) => (
            <div key={copia} className="flex" aria-hidden={copia === 1}>
              {clientesRellenos.map((cliente, i) => (
                <Chip key={`${copia}-${cliente.nombre}-${i}`} cliente={cliente} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
