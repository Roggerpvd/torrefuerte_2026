/**
 * Datos reales de los servicios. El texto es el del brochure institucional
 * (fuente oficial), que en Construcción e Ingeniería tiene ítems más
 * completos que los del prototipo (ver Paso 5, "Decisiones técnicas").
 */
export type ServicioSeed = {
  titulo: string;
  icono: string;
  items: string[];
};

export const serviciosSeed: ServicioSeed[] = [
  {
    titulo: "Construcción",
    icono: "construction",
    items: [
      "Demolición",
      "Obra nueva",
      "Sistema Drywall",
      "Desmontaje, mantenimiento y construcción de coberturas ligeras y estructuras metálicas",
    ],
  },
  {
    titulo: "Arquitectura",
    icono: "architecture",
    items: [
      "Proyectos residenciales",
      "Proyectos comerciales",
      "Proyectos educativos",
      "Habilitaciones urbanas",
      "Remodelaciones",
      "Diseño interior",
    ],
  },
  {
    titulo: "Ingeniería",
    icono: "engineering",
    items: [
      "Supervisión de obra",
      "Diseño estructural",
      "Estudio de suelo",
      "Presupuesto de obra",
      "Mantenimiento de obra civil",
      "Mantenimiento PTAR",
      "Expediente técnico",
    ],
  },
];
