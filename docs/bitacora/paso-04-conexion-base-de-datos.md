# Paso 4: Conexión con la base de datos

**Fecha:** 24/09/2026
**Estado:** completado en código; falta que ejecutes la migración en tu propia base de Neon

## Objetivo
Crear la base de datos en Neon, conectarla al proyecto mediante variables de entorno y crear las 7 tablas del Paso 3 con una migración.

## Actividades realizadas
1. Se instalaron `drizzle-orm`, `@neondatabase/serverless` (driver) y, como herramientas de desarrollo, `drizzle-kit`, `dotenv` y `tsx`.
2. Se escribió `src/db/schema.ts`: el esquema de Drizzle, línea por línea equivalente a `esquema.sql` del Paso 3, incluidos los 4 índices.
3. Se generó la migración con `drizzle-kit generate`, verificando que el SQL resultante coincide con el diseño del Paso 3 (mismas tablas, columnas, llaves foráneas e índices).
4. Se escribió `src/db/index.ts`: el cliente de conexión que usará el resto de la aplicación (Pasos 5 a 7), sobre el driver HTTP de Neon (sin conexiones persistentes, pensado para funciones serverless).
5. Se escribieron dos scripts de terminal: `db:migrate` (aplica las migraciones pendientes) y `db:test-connection` (confirma que la conexión funciona y lista las tablas creadas).

## Decisiones técnicas
| Decisión | Alternativas | Justificación |
|---|---|---|
| Drizzle ORM | Prisma | Genera SQL más cercano al que ya se diseñó a mano en el Paso 3, y su configuración es más liviana |
| Driver `@neondatabase/serverless` (HTTP) | Driver `pg` con conexión TCP persistente | Vercel ejecuta el backend como funciones serverless de corta duración; una conexión persistente no encaja ahí, y Neon recomienda el driver HTTP para ese caso |
| Migraciones con `drizzle-kit generate` + script propio | Escribir las migraciones a mano | El SQL se genera automáticamente a partir de `schema.ts`, así el esquema y las migraciones nunca quedan desincronizados |
| `src/db/index.ts` lanza un error claro si falta `DATABASE_URL` | Dejar que falle con un error genérico de conexión | Un error explícito ahorra tiempo al momento de depurar |

## Cómo crear tu base de datos en Neon
Estos pasos los debe hacer el propio desarrollador; no se pueden automatizar desde aquí.

1. Crea una cuenta gratuita en [neon.com](https://neon.com) (o entra con GitHub).
2. Crea un proyecto nuevo. Cualquier nombre de región sirve; una cercana a Perú (por ejemplo, la de AWS en EE. UU. Este) da menor latencia.
3. En el panel del proyecto, ve a **Connect** y copia la **cadena de conexión agrupada** ("Pooled connection"), que empieza con `postgresql://`.
4. En la carpeta del proyecto, copia `.env.example` como `.env.local` y pega esa cadena en `DATABASE_URL`.
5. Ejecuta las migraciones:
   ```bash
   npm run db:migrate
   ```
6. Verifica la conexión y que las 7 tablas se crearon:
   ```bash
   npm run db:test-connection
   ```

## Problemas encontrados y soluciones
| Problema | Solución |
|---|---|
| `drizzle-kit generate` exige una `DATABASE_URL` válida en formato, aunque no se conecta a ninguna base para generar el SQL | Se usó una URL de marcador de posición solo para generar la migración en este entorno de trabajo, y se eliminó después. Nunca se guardó ninguna credencial real |
| Al traducir `esquema.sql` a `schema.ts` se perdieron los 4 índices (Drizzle no los infiere de las llaves foráneas) | Se agregaron explícitamente con `index()` en cada tabla, y se confirmó que la migración regenerada los incluye |
| `drizzle-kit` trae una dependencia (`esbuild`) con una alerta de seguridad de severidad moderada | Es una herramienta de desarrollo que corre solo en la terminal del programador, nunca en producción ni expuesta a internet; no representa un riesgo para la aplicación desplegada |

## Evidencias
- `evidencias/paso-04/migracion-0000.sql`: la migración generada por Drizzle a partir del esquema.
- *(Pendiente, lo agrega el estudiante):* captura de `npm run db:test-connection` mostrando la hora del servidor y las 7 tablas creadas en su propia base de Neon.

## Resultado
El proyecto tiene un cliente de base de datos listo (`src/db/index.ts`), un esquema completo en código y una migración generada y verificada contra el diseño del Paso 3. Falta que cada quien la ejecute contra su propia base de Neon (paso manual, con cuenta personal).

## Siguiente paso
Paso 5: migración del portafolio y los servicios desde el código a la base de datos, con un script de carga inicial.
