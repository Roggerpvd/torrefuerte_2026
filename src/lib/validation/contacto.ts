import { z } from "zod";

/**
 * Opciones de los selects "Plazo deseado" y "Presupuesto referencial".
 * Se definen aquí (y no en el componente) para que el formulario y la
 * validación del servidor usen exactamente la misma lista de valores.
 */
export const OPCIONES_PLAZO = [
  "Lo antes posible",
  "1 a 3 meses",
  "3 a 6 meses",
  "Más de 6 meses",
  "Aún no lo sé",
] as const;

export const OPCIONES_PRESUPUESTO = [
  "Menos de S/ 20,000",
  "S/ 20,000 - S/ 50,000",
  "S/ 50,000 - S/ 100,000",
  "Más de S/ 100,000",
  "Prefiero conversarlo",
] as const;

/**
 * Esquema de validación del formulario de contacto.
 * Se usa tanto en el cliente (formulario) como en el servidor (API),
 * para que el mensaje de error sea idéntico en ambos lados.
 *
 * El campo `sitio_web` es un honeypot: un campo invisible para una
 * persona real pero que los bots de spam suelen rellenar. No lleva
 * ninguna restricción aquí (ni siquiera de longitud) porque si zod
 * lo rechazara, el bot recibiría un error 400 que delataría la
 * trampa; en cambio, la detección y el descarte silencioso ocurren
 * en el route handler, después de que la validación pasa.
 */
export const contactoSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(120, "El nombre es demasiado largo"),
  email: z
    .string()
    .trim()
    .min(1, "El correo es obligatorio")
    .email("Ingresa un correo válido")
    .max(150, "El correo es demasiado largo"),
  telefono: z
    .string()
    .trim()
    .min(6, "Ingresa un número de celular válido")
    .max(30, "El número de celular es demasiado largo")
    .regex(/^[0-9+\s()-]+$/, "Ingresa un número de celular válido"),
  // Servicio y categoría de interés: selects opcionales del formulario.
  // Llegan como string desde un <select> HTML ("" cuando no se elige
  // nada), así que se normalizan a null antes de convertirlas a número,
  // siguiendo el mismo patrón que el campo `anio` del panel de proyectos.
  servicioId: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? null : v),
    z.coerce.number().int().positive().nullable().optional()
  ),
  categoriaId: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? null : v),
    z.coerce.number().int().positive().nullable().optional()
  ),
  // Datos opcionales para cotizar más rápido: ubicación y metraje son
  // texto/número libres; plazo y presupuesto son selects cerrados, para
  // que el panel reciba valores consistentes y comparables entre mensajes.
  ubicacion: z
    .string()
    .trim()
    .max(150, "La ubicación es demasiado larga")
    .optional()
    .or(z.literal("")),
  metrajeM2: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? null : v),
    z.coerce
      .number("Ingresa un metraje válido")
      .int("Ingresa un metraje válido")
      .positive("Ingresa un metraje válido")
      .max(1_000_000, "Ingresa un metraje válido")
      .nullable()
      .optional()
  ),
  plazoDeseado: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? null : v),
    z.enum(OPCIONES_PLAZO, "Selecciona un plazo válido").nullable().optional()
  ),
  presupuestoReferencial: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? null : v),
    z.enum(OPCIONES_PRESUPUESTO, "Selecciona un rango de presupuesto válido").nullable().optional()
  ),
  mensaje: z
    .string()
    .trim()
    .min(10, "El mensaje debe tener al menos 10 caracteres")
    .max(2000, "El mensaje es demasiado largo"),
  sitio_web: z.string().optional().or(z.literal("")),
});

export type ContactoInput = z.infer<typeof contactoSchema>;
