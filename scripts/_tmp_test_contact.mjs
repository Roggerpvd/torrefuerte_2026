import { chromium } from 'playwright-core';

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage();
await page.goto('http://localhost:3000/#contacto', { waitUntil: 'networkidle' });

// Check selects populated
const servicioOptions = await page.locator('#servicioId option').allTextContents();
const categoriaOptions = await page.locator('#categoriaId option').allTextContents();
console.log('servicioOptions:', servicioOptions);
console.log('categoriaOptions:', categoriaOptions);

await page.fill('#nombre', 'Juan Perez');
await page.fill('#email', 'juan.perez@example.com');
await page.fill('#telefono', '987654321');
await page.selectOption('#servicioId', { index: 1 });
await page.selectOption('#categoriaId', { index: 1 });
await page.fill('#mensaje', 'Quisiera cotizar un proyecto de construccion de vivienda.');

await page.screenshot({ path: '/tmp/contacto-form-filled.png', fullPage: false });

await page.click('button[type="submit"]');
await page.waitForSelector('text=Mensaje enviado', { timeout: 10000 });
console.log('OK: mensaje enviado confirmado');
await page.screenshot({ path: '/tmp/contacto-form-ok.png', fullPage: false });

await browser.close();
