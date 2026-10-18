/**
 * Proxy (antes "middleware", renombrado en Next.js 16): protege todo el
 * panel de administración antes de que se renderice ninguna página.
 *
 * Es una comprobación "optimista" (solo revisa que la cookie exista y la
 * firma sea válida, sin tocar la base de datos) pensada para redirigir
 * rápido a quien no tiene sesión. La comprobación fuerte de verdad ocurre
 * de nuevo en cada Server Action y Server Component del panel
 * (exigirSesion, en src/lib/auth/session.ts), que es donde realmente
 * importa que no se pueda saltar.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_SESION, verificarTokenSesion } from "@/lib/auth/token";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const esLogin = pathname === "/admin/login";
  const token = request.cookies.get(COOKIE_SESION)?.value;
  const sesionValida = verificarTokenSesion(token) !== null;

  if (!esLogin && !sesionValida) {
    const destino = new URL("/admin/login", request.url);
    destino.searchParams.set("desde", pathname);
    return NextResponse.redirect(destino);
  }

  if (esLogin && sesionValida) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
