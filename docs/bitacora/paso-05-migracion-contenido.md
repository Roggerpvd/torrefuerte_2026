# Paso 5: Migración del portafolio y los servicios

**Fecha:** 24/09/2026
**Estado:** completado en código; falta que cada quien lo ejecute contra su propia base de Neon

## Objetivo
Pasar los proyectos y servicios desde el código del prototipo a la base de datos, mediante un script de carga inicial, y optimizar las imágenes.

## Actividades realizadas
1. Se extrajo el arreglo `projects` del prototipo (`Portafolio.jsx`) con un script que lo interpreta como datos, no a mano, para no cometer errores de transcripción en 49 registros: 49 proyectos, 5 categorías, 55 imágenes en total.
2. Se compararon los ítems de servicios del prototipo (`Servicios.jsx`) contra el brochure institucional (Paso 1). Ingeniería y Construcción estaban incompletos en el prototipo; se usó el texto del brochure, por ser la fuente oficial.
3. Se escribió `src/db/data/proyectos.ts` y `src/db/data/servicios.ts` con estos datos reales.
4. Se escribió `scripts/optimizar-imagenes.mjs`: redimensiona cada imagen a un máximo de 1600 px de ancho y la convierte a WebP.
5. Se ejecutó el script contra las fotos originales del prototipo. Resultado real: **51.2 MB → 7.1 MB (–86 %)**.
6. Se escribió `src/db/seed.ts`, el script de carga inicial: vacía las tablas de contenido e inserta las categorías, los 49 proyectos con sus imágenes y los 3 grupos de servicios con sus ítems.
7. Se verificó el flujo completo (migración + carga) contra una base PostgreSQL de prueba: las 7 tablas se crearon sin errores y quedaron 5 categorías, 49 proyectos, 55 imágenes y 17 ítems de servicio, en las proporciones correctas por categoría.

## Decisiones técnicas
| Decisión | Alternativas | Justificación |
|---|---|---|
| Las imágenes optimizadas se sirven desde `public/` (estáticas de Next.js) | Subirlas todas a Vercel Blob desde el inicio | Ya optimizadas pesan solo 7.1 MB: caben de sobra en el despliegue estático, sin gastar nada de la cuota de 1 GB de Blob. Blob se reserva para las fotos que se suban después desde el panel (Paso 7) |
| Texto de servicios tomado del brochure, no del prototipo | Mantener el texto del prototipo | El prototipo tenía Ingeniería y Construcción incompletos frente al documento oficial de la empresa |
| Extracción de los 49 proyectos por script (regex), no a mano | Transcribir cada proyecto manualmente | Elimina el riesgo de errores de tipeo en un listado de ese tamaño |
| `seed.ts` vacía las tablas antes de insertar | Insertar sin verificar duplicados | Es una carga inicial, pensada para poder correrse de nuevo sin dejar filas repetidas |
| Ancho máximo 1600 px, calidad WebP 78 | Mantener el tamaño y formato originales | 1600 px es más que suficiente para pantallas actuales; WebP a calidad 78 no muestra pérdida perceptible |

## Problemas encontrados y soluciones
| Problema | Solución |
|---|---|
| Traducir 49 proyectos a mano habría sido lento y propenso a errores | Se extrajeron con un script que interpreta el código del prototipo como datos |
| El texto de "Ingeniería" y "Construcción" no coincidía entre el prototipo y el brochure | Se adoptó el texto del brochure, por ser la fuente oficial más reciente |
| El driver de Neon (HTTP) no se puede probar contra una base local común | Se verificó la misma lógica de `seed.ts` con el driver `pg` contra una base PostgreSQL de prueba en este entorno de trabajo; el cambio entre ambos es solo la conexión, no la lógica de carga |

## Evidencias
- `evidencias/paso-05/medicion-imagenes.txt`: salida real del script de optimización (51.2 MB → 7.1 MB, –86 %).
- *(Pendiente, lo agrega el estudiante):* captura de `npm run db:seed` corriendo contra su propia base de Neon.

## Resultado
El contenido real de la empresa (49 proyectos, 55 imágenes optimizadas, 3 grupos de servicios) está listo para cargarse en cualquier base de datos Neon con un solo comando. La lógica de carga fue verificada de punta a punta.

## Siguiente paso
Paso 6: API de contacto, con validación y almacenamiento de los mensajes.
