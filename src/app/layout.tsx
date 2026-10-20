import type { Metadata } from "next";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/inter";
import "./globals.css";
import { site } from "@/lib/site";
import { themeInitScript } from "@/components/theme/theme-script";
import { FondoAmbiental } from "@/components/layout/FondoAmbiental";
import { IntroSplash } from "@/components/layout/IntroSplash";

export const metadata: Metadata = {
  title: `${site.name} | ${site.descriptor}`,
  description: site.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: el script del tema cambia data-theme antes de hidratar.
    <html lang="es" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="relative min-h-screen antialiased">
        <IntroSplash />
        <FondoAmbiental />
        {/* Contexto de apilamiento propio (z-0) para que el contenido quede
            sobre el fondo ambiental, que también vive en z-0 pero se pinta
            primero por estar antes en el DOM. */}
        <div className="relative z-0">{children}</div>
      </body>
    </html>
  );
}
