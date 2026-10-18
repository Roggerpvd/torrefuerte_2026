# Paso 3: Diseño de la base de datos

**Fecha:** 19/09/2026
**Estado:** completado

## Objetivo
Modelar los datos que necesita la plataforma y representarlos en un diagrama entidad-relación, como base para crear las tablas en el Paso 4.

## Actividades realizadas
1. Se revisó cómo están organizados hoy los proyectos y los servicios (array `projects` en `Portafolio.jsx`, array `servicios` en `Servicios.jsx`) para identificar los campos reales que se necesitan: 49 proyectos, 5 categorías fijas, entre 1 y 3 imágenes por proyecto, año opcional; 3 grupos de servicios con una lista de ítems cada uno.
2. Se diseñaron 7 tablas y se definieron sus columnas, tipos y relaciones.
3. Se dibujó el diagrama entidad-relación.
4. Se redactó el esquema en SQL (PostgreSQL), listo para convertir a migraciones de Drizzle ORM en el Paso 4.

## Decisiones técnicas
| Decisión | Alternativas | Justificación |
|---|---|---|
| Imágenes en tabla aparte (`proyecto_imagenes`) | Guardar las URLs en una sola columna de texto separadas por comas | Permite ordenarlas, borrar una sin tocar las demás y consultarlas con SQL normal |
| Categorías en tabla aparte (`categorias`) | Escribir la categoría como texto en cada proyecto | Evita errores de tipeo ("EDUCATIVO" vs "Educativo") y permite agregar categorías desde el panel sin tocar código |
| Ítems de servicio en tabla aparte (`servicio_items`) | Guardar la lista como un campo JSON dentro de `servicios` | Cada ítem se edita, borra o reordena por separado, sin reescribir todo el bloque |
| `publicado` en `proyectos` | Borrar el proyecto para ocultarlo | Permite ocultar un proyecto sin perder su información ni sus imágenes |
| `password_hash`, no la contraseña | Guardar la contraseña tal cual | La contraseña nunca se guarda en texto plano (RNF4, Paso 1) |

## Diagrama entidad-relación
La Figura muestra las 7 tablas y sus relaciones, todas de tipo uno a muchos.

Archivo: `evidencias/paso-03/diagrama-entidad-relacion.png`

## Diccionario de datos
### categorias
| Columna | Tipo | Notas |
|---|---|---|
| id | serial | Llave primaria |
| nombre | varchar | Ej. "Educativo" |
| slug | varchar | Único; para la URL del filtro |
| orden | integer | Orden de aparición |

### proyectos
| Columna | Tipo | Notas |
|---|---|---|
| id | serial | Llave primaria |
| categoria_id | integer | Referencia a `categorias.id` |
| titulo | varchar | |
| anio | integer | Opcional (hay proyectos sin año) |
| descripcion | text | |
| orden | integer | Orden dentro de su categoría |
| publicado | boolean | Por defecto verdadero |
| creado_en / actualizado_en | timestamptz | Con valor automático |

### proyecto_imagenes
| Columna | Tipo | Notas |
|---|---|---|
| id | serial | Llave primaria |
| proyecto_id | integer | Referencia a `proyectos.id`, borrado en cascada |
| url | text | Ruta en Vercel Blob |
| alt_texto | varchar | Para accesibilidad |
| orden | integer | Orden en la galería |

### servicios / servicio_items
Mismo patrón que categorías/proyectos, pero para los 3 grupos de servicios y su lista de ítems.

### mensajes_contacto
| Columna | Tipo | Notas |
|---|---|---|
| id | serial | Llave primaria |
| nombre / email / telefono | varchar | `telefono` opcional |
| mensaje | text | |
| leido | boolean | Por defecto falso |
| creado_en | timestamptz | |

### usuarios_admin
| Columna | Tipo | Notas |
|---|---|---|
| id | serial | Llave primaria |
| email | varchar | Único |
| password_hash | varchar | Nunca la contraseña en texto plano |
| nombre | varchar | |
| creado_en / ultimo_acceso | timestamptz | |

## Esquema SQL
Ver `evidencias/paso-03/esquema.sql`. Se ejecutará como migración en el Paso 4.

## Resultado
Modelo de datos completo y documentado, listo para crear en Neon en el Paso 4.

## Siguiente paso
Paso 4: conexión con la base de datos (Neon), variables de entorno y migraciones.
