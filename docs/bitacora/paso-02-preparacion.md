# Paso 2: Preparación del proyecto

**Fecha:** 18/09/2026
**Estado:** completado

## Objetivo
Dejar listo el proyecto base: tecnologías elegidas, estructura ordenada, identidad visual de Torre Fuerte traducida a un sistema de diseño, y un repositorio limpio para trabajar y documentar cada paso.

## Actividades realizadas
1. Se creó el proyecto con Next.js (App Router), TypeScript y Tailwind CSS v4.
2. Se extrajo el estilo del prototipo (colores, tipografías, forma de los elementos) y se definió como sistema de diseño con tema oscuro y claro.
3. Se vectorizó el logo a SVG, con color heredado del tema.
4. Se creó una portada provisional y la página `/design-system` como referencia visual.
5. Se preparó la estructura de carpetas, el `.env.example`, el `.gitignore` y el README.
6. Se crearon la bitácora y las plantillas de documentación.
7. Se verificó el resultado: lint sin errores, compilación de producción correcta y capturas en tema oscuro, claro y móvil.

## Decisiones técnicas
| Decisión | Alternativas | Justificación |
|---|---|---|
| Next.js 16 con TypeScript | Mantener Vite con funciones aparte | Páginas, API y panel viven en un solo proyecto y se despliegan juntos en Vercel |
| Tailwind CSS v4 con tokens en CSS | Valores de color escritos en cada componente | Un solo lugar para los colores; cambiar un tema no obliga a tocar componentes |
| Tema claro con variables propias | Reglas `!important` sobre el tema oscuro (prototipo) | Cada tema se diseña y se verifica por separado |
| Tipografías autoalojadas (`@fontsource`) | Google Fonts | Sin peticiones externas, más rápido y sin dependencia de terceros |
| Logo SVG con `currentColor` | PNG blanco con filtro CSS | Se ve bien en cualquier fondo y tema, pesa menos de 1 KB y escala sin perder calidad |
| Carpeta `public` en minúscula | `Public` (prototipo) | Vercel usa Linux, que distingue mayúsculas; con `Public` los archivos no se servirían |

**Contraste de color (WCAG AA exige 4,5 o más para texto)**
| Rol | Tema oscuro | Tema claro |
|---|---|---|
| Texto principal | 15,3 | 17,8 |
| Texto secundario | 8,9 | 6,0 |
| Cian de marca | 14,5 | 7,4 |
| Dorado para texto | 7,4 | 5,8 |

Para el tema claro se usaron versiones más oscuras del cian y del dorado, porque los originales no tienen contraste suficiente sobre fondo claro.

## Problemas encontrados y soluciones
| Problema | Solución |
|---|---|
| Carpeta `Public` con mayúscula | Se usa `public` |
| `.env` y `.env.example` eran carpetas | Ahora son archivos; el `.gitignore` excluye `.env*` salvo `.env.example` |
| Dos etiquetas `<title>` en el HTML | Un solo título definido desde `metadata` |
| Logo solo blanco, invisible en fondo claro | SVG que hereda el color del tema |
| Comprimido de 375 MB con `node_modules`, `dist` y renders | El repositorio solo lleva código y `docs/`; lo demás se regenera o se excluye |

## Evidencias
En `docs/evidencias/paso-02/`: portada en tema oscuro, tema claro y móvil, y la página del sistema de diseño.
Por capturar: el repositorio creado en GitHub y `npm run dev` funcionando en tu equipo.

## Comandos para crear el repositorio
```bash
git init
git add .
git commit -m "Paso 2: proyecto base, sistema de diseño y bitácora"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/torre-fuerte.git
git push -u origin main
```

## Resultado
Proyecto base funcionando con la identidad visual de Torre Fuerte, tema claro y oscuro, estructura ordenada y documentación iniciada.

## Siguiente paso
Paso 3: diseño de la base de datos y diagrama entidad-relación.
