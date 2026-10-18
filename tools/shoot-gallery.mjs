// Dev aid: screenshots of each gallery theme section (phone size) into shots/.
// Usage: node tools/shoot-gallery.mjs [baseUrl]   (default http://localhost:5185)
import { chromium } from 'playwright';

const base = process.argv[2] || 'http://localhost:5185';
let browser;
try { browser = await chromium.launch(); } catch {
  browser = await chromium.launch({ executablePath: `${process.env.LOCALAPPDATA}/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe` });
}
const page = await browser.newPage({ viewport: { width: 400, height: 820 }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.text()); });
page.on('requestfailed', (r) => errors.push('failed ' + r.url()));
await page.goto(`${base}/gallery/index.html`);
try { await page.waitForSelector('.theme .card', { timeout: 15000 }); } catch { console.log(JSON.stringify(errors, null, 1)); await browser.close(); process.exit(1); }
await page.waitForTimeout(800);
for (const key of ['home', 'garden', 'sea', 'temples', 'sky']) {
  const el = await page.$(`#${key}`);
  await el.screenshot({ path: `shots/gallery-${key}.png` });
}
await page.click('#sea .card');
await page.waitForTimeout(900);
await page.screenshot({ path: 'shots/gallery-viewer.png' });
console.log(JSON.stringify({ errors, cards: await page.$$eval('.card', (c) => c.length) }));
await browser.close();
