import { redirect } from "next/navigation";

// Contacto ahora vive como sección de la página única (/#contacto).
// Esta ruta se mantiene solo para no romper enlaces guardados de antes.
export default function ContactoRedirect() {
  redirect("/#contacto");
}
