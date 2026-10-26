
 // Detalle de obras ejecutadas por cliente, inmediatamente debajo de la
// cinta de "Proyectos de mayor valor". Son datos reales tomados del
// brochure institucional de la empresa: cada cliente es una tarjeta de
// vidrio con su lista de obras, en el mismo lenguaje visual del resto
// del sitio (ver ".glass" en globals.css).

type ClienteConObras = {
  nombre: string;
  obras: string[];
};

const CLIENTES_CON_OBRAS: ClienteConObras[] = [
  {
    nombre: "Colegios Peruanos S.A.",
    obras: [
      "Supervisión de obra: ampliación de aulas, Colegio Innova Schools Sede Tacna 02 – Pocollay",
      "Adecuación de ambientes (lactario, SS. HH. para personas con discapacidad), Colegio Innova Schools Sede Tacna 02 – Pocollay",
      "Instalación de estructura metálica y toldo, Colegio Innova Schools Sede Moquegua, Fundo El Gramadal",
      "Mantenimiento de cielo raso y acondicionamiento de drenaje pluvial en zona de comedor, Colegio Innova Schools Sede Arequipa 02 – Cerro Colorado",
      "Adecuación de ambientes, Colegio Innova Schools Sede Tacna 02 – Pocollay, Tacna",
      "Adecuación de ambientes, Colegio Innova Schools Sede Tacna 01",
      "Adecuación de ambientes, Colegio Innova Schools Sede Moquegua, Fundo El Gramadal",
    ],
  },
  {
    nombre: "Municipalidad Provincial de Tarata",
    obras: [
      "Reparación de tubería de plástico HDPE y construcción de cámaras de transición en el canal de riego Londaya, Comisión de Regantes Lupaja, Tarata",
      "Mantenimiento de los ambientes destinados a la Biblioteca Pública del distrito de Tarata, Tacna",
      "Reparación del sistema de tratamiento de la planta de aguas residuales en el pueblo joven Juan Velasco Alvarado, Tarata, Tacna",
    ],
  },
];

function TarjetaCliente({
  cliente,
  indice,
}: {
  cliente: ClienteConObras;
  indice: number;
}) {
  return (
    <div
      className="glass glass-interactive tf-reveal flex flex-col rounded-tf-lg p-8"
      style={{ animationDelay: `${indice * 90}ms` }}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-headline text-xl font-bold uppercase leading-tight tracking-tight text-fg md:text-2xl">
          {cliente.nombre}
        </h3>

        <span className="shrink-0 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-accent-text">
          Obra
        </span>
      </div>

      <ul className="mt-6 space-y-3">
        {cliente.obras.map((obra) => (
          <li key={obra} className="flex gap-3 text-fg">
            <span
              className="mt-[0.15em] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-bold text-accent-text"
              aria-hidden="true"
            >
              ✓
            </span>

            <span className="text-sm leading-relaxed text-black dark:text-white">
              {obra}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ServiciosEjecutados() {
  if (CLIENTES_CON_OBRAS.length === 0) return null;

  return (
    <section
      aria-label="Servicios ejecutados por cliente"
      className="mx-auto w-full max-w-screen-2xl px-6 pb-14 md:px-12"
    >
      <p className="tf-reveal text-center text-sm font-medium uppercase tracking-[0.2em] text-muted">
        Servicios ejecutados
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {CLIENTES_CON_OBRAS.map((cliente, i) => (
          <TarjetaCliente
            key={cliente.nombre}
            cliente={cliente}
            indice={i}
          />
        ))}
      </div>
    </section>
  );
}
