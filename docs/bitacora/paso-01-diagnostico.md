# Paso 1: Diagnóstico y levantamiento de requerimientos

**Fecha:** 18/09/2026
**Estado:** borrador, pendiente de validar con la entrevista al encargado de la empresa

## Objetivo
Entender la situación de Torre Fuerte Arquitectos e Ingenieros SAC frente a su presencia en internet y dejar definido qué debe hacer la plataforma, para quién y con qué límites.

## 1. Situación actual
La empresa no cuenta con página web corporativa.

*Completar tras la entrevista:* cómo se dan a conocer hoy, dónde guardan las fotos de sus proyectos y cómo reciben las consultas de clientes.

**Antecedente.** Antes de iniciar las prácticas se elaboró un prototipo exploratorio (React con Vite) con cuatro páginas: inicio, portafolio, servicios y contacto. Era solo frontend: los proyectos y servicios estaban escritos en el código, el formulario enviaba correos con EmailJS sin guardar los mensajes y no había panel ni inicio de sesión. Se usa como **referencia visual** (colores, tipografía y logo). El código no se reutiliza: la plataforma se construye desde cero.

## 2. Problema (hipótesis a validar en la entrevista)
La empresa no tiene un lugar propio y actualizable donde mostrar su portafolio y servicios, ni un canal centralizado donde registrar las consultas de clientes potenciales.

## 3. Objetivos
**General.** Desarrollar e implementar una plataforma web corporativa para Torre Fuerte que permita presentar sus proyectos y servicios y gestionarlos desde un panel de administración.

**Específicos**
1. Levantar y documentar los requerimientos de la empresa.
2. Diseñar la base de datos relacional de la plataforma.
3. Implementar el sitio público: inicio, portafolio con categorías, servicios y contacto.
4. Implementar una API de contacto que valide y almacene los mensajes.
5. Implementar un panel de administración con autenticación, gestión de proyectos, imágenes y mensajes.
6. Desplegar la plataforma y verificar su funcionamiento y seguridad.

## 4. Alcance (propuesta a validar)
**Incluye:** sitio público, portafolio filtrable con detalle y galería, servicios, formulario de contacto con almacenamiento, panel admin con login, gestión de proyectos, servicios, imágenes y mensajes, tema claro y oscuro, despliegue en hosting gratuito.

**No incluye por ahora:** pagos o tienda, cotizador en línea, blog, versión en otros idiomas, dominio propio de pago.

## 5. Requerimientos
**Funcionales**
| ID | Requerimiento |
|---|---|
| RF1 | Catálogo público de proyectos con filtro por categoría |
| RF2 | Detalle de cada proyecto con galería de imágenes |
| RF3 | Página de servicios |
| RF4 | Formulario de contacto con validación y almacenamiento de mensajes |
| RF5 | Inicio de sesión para el administrador |
| RF6 | Crear, editar y eliminar proyectos desde el panel |
| RF7 | Subir imágenes desde el panel |
| RF8 | Bandeja de mensajes recibidos, con estado leído / no leído |

**No funcionales**
| ID | Requerimiento |
|---|---|
| RNF1 | Costo cero de infraestructura |
| RNF2 | Imágenes optimizadas para carga rápida |
| RNF3 | Diseño adaptable a celular y con tema claro y oscuro |
| RNF4 | Seguridad: contraseñas cifradas, claves fuera del código, validación en el servidor |
| RNF5 | Accesibilidad: contraste suficiente (WCAG AA) y navegación con teclado |

## 6. Historias de usuario
| ID | Historia | Criterio de aceptación |
|---|---|---|
| HU1 | Como visitante, quiero ver los proyectos por categoría para conocer el trabajo de la empresa | Al elegir una categoría solo se muestran sus proyectos |
| HU2 | Como visitante, quiero enviar un mensaje y saber que llegó | Tras enviar veo una confirmación; si hay un error, se me explica qué corregir |
| HU3 | Como administrador, quiero iniciar sesión de forma segura | Sin sesión no se puede entrar al panel |
| HU4 | Como administrador, quiero crear y editar proyectos con sus fotos sin tocar código | El cambio se ve en el sitio público sin volver a desplegar |
| HU5 | Como administrador, quiero leer los mensajes y marcarlos como leídos | Los mensajes se listan por fecha y el estado se conserva |

## 7. Restricciones
- La empresa no pagará hosting ni dominio: se usa una dirección gratuita.
- Almacenamiento gratuito acotado: 1 GB de archivos en Vercel Blob y 0,5 GB de base de datos por proyecto en Neon.
- El plan gratuito (Hobby) de Vercel es solo para uso no comercial: sirve para la demostración académica; si la empresa publica el sitio como oficial se requiere otra alternativa (ver decisiones pendientes).

## 8. Guía de entrevista al encargado
1. ¿Qué servicios ofrecen y cuáles quieren destacar?
2. ¿Cómo consiguen clientes hoy?
3. ¿Qué proyectos quieren mostrar? ¿Las fotos son de la empresa y tienen permiso para publicarlas?
4. ¿Quién actualizará el contenido y cada cuánto?
5. ¿Basta con un formulario de contacto o necesitan solicitud de cotizaciones?
6. ¿Tienen logo original en vectorial (.ai, .svg, .pdf) y manual de marca?
7. ¿Hay páginas de otras empresas que les gusten como referencia?
8. ¿Aceptan una dirección web gratuita en lugar de un dominio propio?

**Respuestas:** *(registrar aquí fecha, persona entrevistada y notas)*

## 9. Decisiones pendientes
| Tema | Situación |
|---|---|
| Hosting para producción | Demo académica en Vercel Hobby; decidir con la empresa si la publican de forma oficial |
| Propiedad de las imágenes | Confirmar cuáles son de la empresa antes de publicarlas |
| Logo original | Pedir el archivo vectorial a la empresa |

## 10. Evidencias a adjuntar
- Notas o acta de la entrevista (`docs/evidencias/paso-01/`).
- Constancia de que la empresa no tiene web (captura de búsqueda o dato de la entrevista).
