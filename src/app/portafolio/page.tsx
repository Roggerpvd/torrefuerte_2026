import { redirect } from "next/navigation";

// El portafolio ahora vive como sección de la página única (/#portafolio).
// Esta ruta se mantiene solo para no romper enlaces guardados de antes.
export default function PortafolioRedirect() {
  redirect("/#portafolio");
}
