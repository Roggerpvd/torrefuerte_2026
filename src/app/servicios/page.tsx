import { redirect } from "next/navigation";

// Servicios ahora vive como sección de la página única (/#servicios).
// Esta ruta se mantiene solo para no romper enlaces guardados de antes.
export default function ServiciosRedirect() {
  redirect("/#servicios");
}
