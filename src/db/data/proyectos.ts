/**
 * Datos reales del portafolio, extraídos del prototipo (Portafolio.jsx).
 * "archivoOriginal" es el nombre del archivo en la carpeta Public/ del
 * prototipo; el script de optimización (scripts/optimizar-imagenes.mjs)
 * lo usa para encontrar la imagen fuente y generar su versión WebP.
 */
export type ProyectoSeed = {
  slug: string;
  categoriaSlug: string;
  titulo: string;
  anio: number | null;
  descripcion: string;
  imagenes: string[]; // nombres de archivo en Public/ del prototipo
};

export const categoriasSeed = [
  { slug: "educativo", nombre: "Educativo" },
  { slug: "hidraulica", nombre: "Hidráulica" },
  { slug: "estructuras", nombre: "Estructuras" },
  { slug: "interiores", nombre: "Interiores" },
  { slug: "viviendas", nombre: "Viviendas" },
] as const;

export const proyectosSeed: ProyectoSeed[] = [
  { slug: "edu-1", categoriaSlug: "educativo", titulo: "SEDE TACNA POCOLLAY", anio: 2023, descripcion: "Desarrollo integral de infraestructura educativa con enfoque en funcionalidad y cumplimiento de normativas de seguridad.", imagenes: ["f.png", "g.png"] },
  { slug: "edu-2", categoriaSlug: "educativo", titulo: "SEDE TACNA POCOLLAY", anio: 2023, descripcion: "Empozamiento de agua para ubicación de puntos criticos.", imagenes: ["SedeAqpCerroColorado.jpg"] },
  { slug: "edu-3", categoriaSlug: "educativo", titulo: "SEDE TACNA POCOLLAY", anio: 2023, descripcion: "Trazo y corte de piso para puntos de tomacorrientes.", imagenes: ["pisoTomacorrientes.jpg"] },
  { slug: "edu-4", categoriaSlug: "educativo", titulo: "SEDE TACNA POCOLLAY", anio: 2023, descripcion: "Entubado de tubería para instalación de puntos de tomacorriente y resane de piso en áreas intervenidas.", imagenes: ["entubadoTomacorriente.jpg", "cemento.jpg"] },
  { slug: "edu-5", categoriaSlug: "educativo", titulo: "SEDE TACNA POCOLLAY", anio: 2023, descripcion: "Cableado de puntos de tomacorriente.", imagenes: ["cableado.jpg"] },
  { slug: "edu-6", categoriaSlug: "educativo", titulo: "SEDE TACNA POCOLLAY", anio: 2023, descripcion: "Pintado de tabiquería de drywall.", imagenes: ["pintado.jpg"] },
  { slug: "edu-7", categoriaSlug: "educativo", titulo: "SEDE TACNA POCOLLAY", anio: 2023, descripcion: "Pintado de líneas amarillas en columnas metálicas.", imagenes: ["pintadoColumnas.jpg"] },
  { slug: "hid-1", categoriaSlug: "hidraulica", titulo: "CAMBIO DE TUBERÍA", anio: null, descripcion: "Reemplazo y mejora de redes hidráulicas con materiales certificados y técnicas de mínima intervención.", imagenes: ["h.png"] },
  { slug: "est-1", categoriaSlug: "estructuras", titulo: "TOLDO DE LONA", anio: null, descripcion: "Diseño e instalación de estructuras tensadas de lona de alta resistencia para espacios exteriores e industriales.", imagenes: ["l.png"] },
  { slug: "est-2", categoriaSlug: "estructuras", titulo: "Cobertura", anio: null, descripcion: "Techo de estructura de aluminio con policarbonato sobre equipo de data.", imagenes: ["techo.jpg"] },
  { slug: "est-3", categoriaSlug: "estructuras", titulo: "Instalación de Estantes en Almacén", anio: null, descripcion: "Suministro e instalación de estantes en almacén.", imagenes: ["suministro.jpg", "suministro2.jpg", "suministro3.jpg"] },
  { slug: "int-1", categoriaSlug: "interiores", titulo: "ADECUACIÓN DE INTERIORES", anio: null, descripcion: "Renovación y optimización de espacios para mejorar la ergonomía y eficiencia operativa del recinto.", imagenes: ["i.png", "j.png", "k.png"] },
  { slug: "int-2", categoriaSlug: "interiores", titulo: "ADECUACIÓN DE INTERIORES", anio: null, descripcion: "Adecuación interior de vivienda con distribución de ambientes, acabados y optimización de espacios habitables.", imagenes: ["interior1.jpg"] },
  { slug: "int-3", categoriaSlug: "interiores", titulo: "ADECUACIÓN DE INTERIORES", anio: null, descripcion: "Renovación y optimización de espacios para mejorar la ergonomía y eficiencia operativa del recinto.", imagenes: ["interior2.jpg"] },
  { slug: "int-4", categoriaSlug: "interiores", titulo: "ADECUACIÓN DE INTERIORES", anio: null, descripcion: "Renovación y optimización de espacios para mejorar la ergonomía y eficiencia operativa del recinto.", imagenes: ["interior3.jpg"] },
  { slug: "int-5", categoriaSlug: "interiores", titulo: "ADECUACIÓN DE INTERIORES", anio: null, descripcion: "Renovación y optimización de espacios para mejorar la ergonomía y eficiencia operativa del recinto.", imagenes: ["interior4.jpg"] },
  { slug: "int-6", categoriaSlug: "interiores", titulo: "ADECUACIÓN DE INTERIORES", anio: null, descripcion: "Renovación y optimización de espacios para mejorar la ergonomía y eficiencia operativa del recinto.", imagenes: ["interior5.jpg"] },
  { slug: "int-7", categoriaSlug: "interiores", titulo: "ADECUACIÓN DE INTERIORES", anio: null, descripcion: "Renovación y optimización de espacios para mejorar la ergonomía y eficiencia operativa del recinto.", imagenes: ["interior6.jpg"] },
  { slug: "int-8", categoriaSlug: "interiores", titulo: "ADECUACIÓN DE INTERIORES", anio: null, descripcion: "Renovación y optimización de espacios para mejorar la ergonomía y eficiencia operativa del recinto.", imagenes: ["interior7.jpg"] },
  { slug: "int-9", categoriaSlug: "interiores", titulo: "ADECUACIÓN DE INTERIORES", anio: null, descripcion: "Renovación y optimización de espacios para mejorar la ergonomía y eficiencia operativa del recinto.", imagenes: ["interior8.jpg"] },
  { slug: "int-10", categoriaSlug: "interiores", titulo: "ADECUACIÓN DE INTERIORES", anio: null, descripcion: "Renovación y optimización de espacios para mejorar la ergonomía y eficiencia operativa del recinto.", imagenes: ["interior9.jpg"] },
  { slug: "int-11", categoriaSlug: "interiores", titulo: "ADECUACIÓN DE INTERIORES", anio: null, descripcion: "Renovación y optimización de espacios para mejorar la ergonomía y eficiencia operativa del recinto.", imagenes: ["interior10.jpg"] },
  { slug: "int-12", categoriaSlug: "interiores", titulo: "ADECUACIÓN DE INTERIORES", anio: null, descripcion: "Renovación y optimización de espacios para mejorar la ergonomía y eficiencia operativa del recinto.", imagenes: ["interior11.jpg"] },
  { slug: "int-13", categoriaSlug: "interiores", titulo: "ADECUACIÓN DE INTERIORES", anio: null, descripcion: "Renovación y optimización de espacios para mejorar la ergonomía y eficiencia operativa del recinto.", imagenes: ["interior12.jpg"] },
  { slug: "int-14", categoriaSlug: "interiores", titulo: "ADECUACIÓN DE INTERIORES", anio: null, descripcion: "Renovación y optimización de espacios para mejorar la ergonomía y eficiencia operativa del recinto.", imagenes: ["interior13.jpg"] },
  { slug: "int-15", categoriaSlug: "interiores", titulo: "ADECUACIÓN DE INTERIORES", anio: null, descripcion: "Renovación y optimización de espacios para mejorar la ergonomía y eficiencia operativa del recinto.", imagenes: ["interior14.jpg"] },
  { slug: "int-16", categoriaSlug: "interiores", titulo: "ADECUACIÓN DE INTERIORES", anio: null, descripcion: "Renovación y optimización de espacios para mejorar la ergonomía y eficiencia operativa del recinto.", imagenes: ["interior15.jpg"] },
  { slug: "int-17", categoriaSlug: "interiores", titulo: "ADECUACIÓN DE INTERIORES", anio: null, descripcion: "Renovación y optimización de espacios para mejorar la ergonomía y eficiencia operativa del recinto.", imagenes: ["interior16.jpg"] },
  { slug: "int-18", categoriaSlug: "interiores", titulo: "ADECUACIÓN DE INTERIORES", anio: null, descripcion: "Renovación y optimización de espacios para mejorar la ergonomía y eficiencia operativa del recinto.", imagenes: ["interior17.jpg"] },
  { slug: "int-19", categoriaSlug: "interiores", titulo: "ADECUACIÓN DE INTERIORES", anio: null, descripcion: "Renovación y optimización de espacios para mejorar la ergonomía y eficiencia operativa del recinto.", imagenes: ["interior18.jpg"] },
  { slug: "int-20", categoriaSlug: "interiores", titulo: "ADECUACIÓN DE INTERIORES", anio: null, descripcion: "Renovación y optimización de espacios para mejorar la ergonomía y eficiencia operativa del recinto.", imagenes: ["interior19.jpg"] },
  { slug: "int-21", categoriaSlug: "interiores", titulo: "ADECUACIÓN DE INTERIORES", anio: null, descripcion: "Renovación y optimización de espacios para mejorar la ergonomía y eficiencia operativa del recinto.", imagenes: ["interior20.jpg"] },
  { slug: "int-22", categoriaSlug: "interiores", titulo: "ADECUACIÓN DE INTERIORES", anio: null, descripcion: "Renovación y optimización de espacios para mejorar la ergonomía y eficiencia operativa del recinto.", imagenes: ["interior21.jpg"] },
  { slug: "int-23", categoriaSlug: "interiores", titulo: "ADECUACIÓN DE INTERIORES", anio: null, descripcion: "Renovación y optimización de espacios para mejorar la ergonomía y eficiencia operativa del recinto.", imagenes: ["interior22.jpg"] },
  { slug: "int-24", categoriaSlug: "interiores", titulo: "ADECUACIÓN DE INTERIORES", anio: null, descripcion: "Renovación y optimización de espacios para mejorar la ergonomía y eficiencia operativa del recinto.", imagenes: ["interior23.jpg"] },
  { slug: "int-25", categoriaSlug: "interiores", titulo: "ADECUACIÓN DE INTERIORES", anio: null, descripcion: "Renovación y optimización de espacios para mejorar la ergonomía y eficiencia operativa del recinto.", imagenes: ["interior24.jpg"] },
  { slug: "int-26", categoriaSlug: "interiores", titulo: "ADECUACIÓN DE INTERIORES", anio: null, descripcion: "Renovación y optimización de espacios para mejorar la ergonomía y eficiencia operativa del recinto.", imagenes: ["interior25.jpg"] },
  { slug: "int-27", categoriaSlug: "interiores", titulo: "ADECUACIÓN DE INTERIORES", anio: null, descripcion: "Renovación y optimización de espacios para mejorar la ergonomía y eficiencia operativa del recinto.", imagenes: ["interior26.jpg"] },
  { slug: "int-28", categoriaSlug: "interiores", titulo: "ADECUACIÓN DE INTERIORES", anio: null, descripcion: "Renovación y optimización de espacios para mejorar la ergonomía y eficiencia operativa del recinto.", imagenes: ["interior27.jpg"] },
  { slug: "viv-1", categoriaSlug: "viviendas", titulo: "CASA 1", anio: 2024, descripcion: "Vivienda Unifamiliar.", imagenes: ["01.jpg"] },
  { slug: "viv-2", categoriaSlug: "viviendas", titulo: "CASA 2", anio: 2024, descripcion: "Vivienda Unifamiliar.", imagenes: ["02.jpg"] },
  { slug: "viv-3", categoriaSlug: "viviendas", titulo: "CASA 3", anio: 2024, descripcion: "Vivienda Unifamiliar.", imagenes: ["VISTA 01 A.jpg"] },
  { slug: "viv-4", categoriaSlug: "viviendas", titulo: "CASA 4", anio: 2024, descripcion: "Vivienda Multifamiliar.", imagenes: ["VISTA 01 copia.jpg"] },
  { slug: "viv-5", categoriaSlug: "viviendas", titulo: "CASA 5", anio: 2024, descripcion: "Vivienda Multifamiliar.", imagenes: ["VISTA 01 ok.jpg"] },
  { slug: "viv-6", categoriaSlug: "viviendas", titulo: "CASA 6", anio: 2024, descripcion: "Vivienda Multifamiliar.", imagenes: ["VISTA 012.jpg"] },
  { slug: "viv-7", categoriaSlug: "viviendas", titulo: "CASA 7", anio: 2024, descripcion: "Vivienda Unifamiliar.", imagenes: ["Vista11.png"] },
  { slug: "viv-8", categoriaSlug: "viviendas", titulo: "CASA 8", anio: 2024, descripcion: "Vivienda Unifamiliar.", imagenes: ["VISTA 01A.jpg"] },
  { slug: "viv-9", categoriaSlug: "viviendas", titulo: "CASA 9", anio: 2024, descripcion: "Vivienda Unifamiliar.", imagenes: ["VISTA 02.jpg"] },
  { slug: "viv-10", categoriaSlug: "viviendas", titulo: "CASA 10", anio: 2024, descripcion: "Vivienda Multifamiliar.", imagenes: ["VISTA 04.jpg"] },
];
