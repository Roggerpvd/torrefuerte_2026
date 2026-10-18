import { chromium } from 'playwright-core';

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const page = await browser.newPage();

await page.goto('http://localhost:3000/admin/login', { waitUntil: 'networkidle' });
await page.fill('input[name="email"]', 'test@test.com');
await page.fill('input[name="password"]', 'test1234');
await page.click('button[type="submit"]');
await page.waitForURL('**/admin', { timeout: 10000 });

await page.goto('http://localhost:3000/admin/mensajes', { waitUntil: 'networkidle' });

const bodyText = await page.locator('body').innerText();
console.log('Contiene "Construcción":', bodyText.includes('Construcción'));
console.log('Contiene "Responder por WhatsApp":', bodyText.includes('Responder por WhatsApp'));
console.log('Contiene "Responder por correo":', bodyText.includes('Responder por correo'));
console.log('Contiene "Juan Perez":', bodyText.includes('Juan Perez'));
console.log('Contiene "987654321":', bodyText.includes('987654321'));

const waHref = await page.locator('a:has-text("Responder por WhatsApp")').first().getAttribute('href');
console.log('WhatsApp href:', waHref);
const mailHref = await page.locator('a:has-text("Responder por correo")').first().getAttribute('href');
console.log('Mail href:', mailHref);

await page.screenshot({ path: '/tmp/admin-mensajes.png', fullPage: true });

await browser.close();
