import { chromium } from 'playwright-core';

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage();
await page.goto('http://localhost:3000/#contacto', { waitUntil: 'networkidle' });

// Caso: celular inválido (letras) -> backend debe rechazar
const resp = await page.evaluate(async () => {
  const r = await fetch('/api/contacto', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre: 'Ana Lopez',
      email: 'ana@example.com',
      telefono: 'abc',
      servicioId: '',
      categoriaId: '',
      mensaje: 'Consulta de prueba de validacion.',
    }),
  });
  return { status: r.status, body: await r.json() };
});
console.log('telefono invalido ->', JSON.stringify(resp));

// Caso: sin telefono
const resp2 = await page.evaluate(async () => {
  const r = await fetch('/api/contacto', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre: 'Ana Lopez',
      email: 'ana@example.com',
      telefono: '',
      mensaje: 'Consulta de prueba de validacion.',
    }),
  });
  return { status: r.status, body: await r.json() };
});
console.log('sin telefono ->', JSON.stringify(resp2));

// Caso valido sin servicio/categoria (deben quedar null, no debe romper)
const resp3 = await page.evaluate(async () => {
  const r = await fetch('/api/contacto', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre: 'Carlos Ruiz',
      email: 'carlos@example.com',
      telefono: '955123456',
      servicioId: '',
      categoriaId: '',
      mensaje: 'Consulta sin servicio ni categoria seleccionados.',
    }),
  });
  return { status: r.status, body: await r.json() };
});
console.log('sin servicio/categoria ->', JSON.stringify(resp3));

await browser.close();
