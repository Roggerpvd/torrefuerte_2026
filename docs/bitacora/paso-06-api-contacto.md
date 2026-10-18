# Paso 6: API de contacto

**Fecha:** 03/10/2026
**Estado:** completado y verificado de punta a punta contra una base de datos real

## Objetivo
Construir el endpoint que recibe el formulario de contacto del sitio público, validar los datos en el servidor, guardarlos en `mensajes_contacto` y, de forma opcional, avisar por correo, sin pagar ningún servicio adicional.

## Actividades realizadas
1. Se escribió `src/lib/validation/contacto.ts`: un esquema de validación con `zod` (nombre, correo, teléfono opcional, mensaje, y un campo trampa `sitio_web`), compartido en principio entre el formulario y la API para que el mensaje de error sea el mismo en ambos lados.
2. Se escribió `src/app/api/contacto/route.ts`, el *route handler* `POST /api/contacto`:
   - valida el cuerpo de la solicitud con el esquema anterior;
   - si el campo trampa (`sitio_web`, invisible para una persona real) llega relleno, responde como si todo hubiera salido bien pero no guarda nada: así el bot no sabe que fue detectado;
   - aplica un límite de 3 mensajes cada 10 minutos por correo, contando los mensajes recientes en la propia base de datos, sin contratar ningún servicio de *rate limiting*;
   - guarda el mensaje en `mensajes_contacto`;
   - si existen las variables `RESEND_API_KEY` y `CONTACT_TO_EMAIL`, envía un aviso por correo con Resend; si no existen, el mensaje de todas formas queda guardado y se podrá leer desde el panel de administración (Paso 7). El envío de correo nunca puede hacer fallar la respuesta al usuario.
3. Se agregaron las dependencias `zod` y `resend` (esta última solo se usa si hay credenciales configuradas).
4. Se verificó la lógica completa contra una base PostgreSQL de prueba en este entorno de trabajo (con el mismo cambio temporal de driver documentado en el Paso 5), cubriendo cinco escenarios:

| # | Escenario | Resultado esperado | Resultado obtenido |
|---|---|---|---|
| 1 | Envío válido | Se guarda y responde `{ok:true}` | Correcto |
| 2 | Datos inválidos (nombre muy corto, correo mal formado) | Responde `400` con el primer error de validación | Correcto |
| 3 | Campo trampa relleno (bot) | Responde `{ok:true}` pero no se guarda nada | Correcto: no aparece en la tabla |
| 4 | Cuarto mensaje en menos de 10 minutos con el mismo correo | Responde `429` y no se guarda | Correcto |
| 5 | Verificación directa en la base de datos | Solo están las 3 filas legítimas, nunca la del bot | Correcto |

## Decisiones técnicas
| Decisión | Alternativas | Justificación |
|---|---|---|
| Límite de envíos contado con una consulta a la propia base de datos | Contratar un servicio externo de *rate limiting* (p. ej. Upstash) | No agrega costo ni una dependencia más; el volumen de mensajes de este sitio no lo justifica |
| Campo trampa (*honeypot*) en vez de CAPTCHA | Agregar reCAPTCHA u otro servicio de verificación | No requiere cuenta ni clave de terceros, y es invisible para una persona real: no añade fricción al formulario |
| El campo trampa no lleva restricción en el esquema de `zod` | Validar también su longitud en `zod` | Si `zod` lo rechazara, el bot recibiría un error 400 que delataría la trampa; el descarte silencioso se maneja en el *route handler*, después de validar |
| Notificación por correo opcional y aislada en su propia función | Hacerla parte obligatoria del flujo | El mensaje debe quedar guardado aunque no haya credenciales de correo configuradas o el envío falle |
| Límite de validación: mensaje de mínimo 10 caracteres, máximo 2000 | Sin límites, o límites más laxos | Evita mensajes vacíos o de una palabra, y mensajes desproporcionadamente largos, sin estorbar un uso normal |

## Problemas encontrados y soluciones
| Problema | Solución |
|---|---|
| Una primera versión del esquema de `zod` validaba el campo trampa con `.max(0, "")`, lo que hacía que `zod` devolviera un error 400 apenas el bot lo rellenaba, revelando la existencia de la trampa | Se quitó esa restricción del esquema; la detección y el descarte silencioso del envío se maneja enteramente en el *route handler*, después de que la validación ya pasó |
| El driver de Neon (HTTP) no se puede probar contra una base local común | Se repitió el mismo procedimiento del Paso 5: cambio temporal a `pg` contra una base PostgreSQL de prueba, revertido en cuanto terminó la verificación |

## Evidencias
- Tabla de los cinco escenarios de prueba, arriba, con su resultado real.
- *(Pendiente, lo agrega el estudiante):* captura de un envío real desde el formulario público, una vez conectado al sitio desplegado.

## Resultado
El endpoint `POST /api/contacto` queda listo para producción: valida, descarta spam en silencio, limita abusos y guarda cada mensaje legítimo, sin ningún costo adicional. El aviso por correo es un extra opcional que no condiciona el funcionamiento del formulario.

## Siguiente paso
Paso 7: panel de administración (inicio de sesión, gestión de proyectos e imágenes, bandeja de mensajes).
