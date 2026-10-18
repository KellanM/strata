// QA aid: loads the gallery and the game headless and reports page errors.
//   node tools/qa-load.mjs <port>
import { chromium } from 'playwright';

const port = process.argv[2] || '5194';
const shell = process.env.QA_CHROME || 'C:/Users/Kellan/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';
const browser = await chromium.launch({ executablePath: shell });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto(`http://localhost:${port}/gallery/index.html`);
await page.waitForTimeout(4000);
const cards = await page.$$eval('.card', (els) => els.length);
await page.goto(`http://localhost:${port}/`);
await page.waitForTimeout(1500);
const game = await page.evaluate(() => !!document.querySelector('#menu'));
console.log(JSON.stringify({ errors, cards, game }));
await browser.close();
