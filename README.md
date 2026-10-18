# Torre Fuerte: plataforma web corporativa

Plataforma web para presentar y gestionar los proyectos y servicios de **Torre Fuerte Arquitectos e Ingenieros SAC**. Proyecto de prácticas profesionales (UTP), desarrollado por pasos y documentado en [`docs/`](docs/README.md).

## Requisitos

- Node.js 20.9 o superior
- npm

## Cómo ejecutarlo

```bash
npm install
npm run dev        # http://localhost:3000
```

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compila para producción |
| `npm run start` | Sirve la versión compilada |
| `npm run lint` | Revisa el código |

## Tecnologías

Next.js (App Router) · React · TypeScript · Tailwind CSS v4 · tipografías autoalojadas (Space Grotesk e Inter).
Se incorporan en los siguientes pasos: Neon (PostgreSQL), Drizzle ORM, Vercel Blob y Auth.js.

## Estructura

```
src/
  app/               Rutas y páginas (App Router)
    design-system/   Referencia de colores, tipografía y componentes
  components/
    brand/           Logo
    theme/           Selector de tema claro/oscuro
  lib/               Datos y utilidades compartidas
public/              Archivos estáticos (siempre en minúscula: Vercel distingue mayúsculas)
docs/                Bitácora del proyecto e insumos del informe
```

## Variables de entorno

Copia `.env.example` como `.env.local` y completa los valores cuando cada paso lo pida.
`.env.local` nunca se sube a GitHub.

## Sistema de diseño

Colores, tipografías y logo están definidos una sola vez en `src/app/globals.css` (tema oscuro y claro).
Vista de referencia en `/design-system`.
