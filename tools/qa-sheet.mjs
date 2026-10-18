// QA contact sheets: renders public/gallery/qa.html (every object from four
// iso corners plus front, side and top) and screenshots it in chunks of rows.
//   node tools/qa-sheet.mjs <port> <file>[,<file>...] [only=1,4,9] [palette=Mint]
// Output: shots/qa/<file>-<n>.png
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const [port = '5194', files = 'themes/home', ...rest] = process.argv.slice(2);
const opts = Object.fromEntries(rest.map((a) => a.split('=')));
mkdirSync('shots/qa', { recursive: true });
const shell = process.env.QA_CHROME || 'C:/Users/Kellan/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';
const browser = await chromium.launch({ executablePath: shell });
const page = await browser.newPage({ viewport: { width: 900, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
const q = new URLSearchParams({ files, ...(opts.only ? { only: opts.only } : {}), ...(opts.palette ? { palette: opts.palette } : {}) });
await page.goto(`http://localhost:${port}/gallery/qa.html?${q}`);
await page.waitForSelector('body[data-ready="1"]', { timeout: 30000 });
await page.waitForTimeout(800);
const rows = await page.$$('.row');
const per = 7;
const tag = (opts.tag || files.replace(/[\/,]/g, '_'));
for (let i = 0; i < rows.length; i += per) {
  const a = await rows[i].boundingBox(), b = await rows[Math.min(rows.length, i + per) - 1].boundingBox();
  await page.screenshot({ path: `shots/qa/${tag}-${i / per + 1}.png`, clip: { x: 0, y: a.y, width: 900, height: b.y + b.height - a.y }, fullPage: true });
}
console.log(`${rows.length} rows -> shots/qa/${tag}-*.png`, errors.length ? errors : '');
await browser.close();
