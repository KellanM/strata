// The splash card's erase in blocks (index.html #splash .blocks, main.js eraseInBlocks):
// the finished logo, captured from the card itself at 3x, to public/splash-logo.png, and
// which squares of a 12 px grid over the chalk's box hold any of it - the rest are black and
// are never made - written into index.html's .chalk data-blocks. Rerun if the card changes.
//   (the dev server on :5231)   node tools/splash-blocks.mjs
import { chromium } from 'file:///C:/Users/Kellan/AppData/Roaming/npm/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const CELL = 12;
const browser = await chromium.launch({ executablePath: process.env.QA_CHROME });
const page = await (await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, serviceWorkers: 'block' })).newPage();
await page.route('**/js/start.js', (r) => r.abort());   // the card alone: the game never boots, nothing lifts it
await page.goto(`http://localhost:${process.env.PORT || 5231}/`);
await page.addStyleTag({ content: '#splash .chalk .sweep, #splash .chalk .blocks { display: none !important; }' });
await page.waitForTimeout(1200);
const box = await page.evaluate(() => { const r = document.querySelector('#splash .chalk').getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; });
const [w, h] = await page.evaluate(() => { const c = document.querySelector('#splash .chalk'); return [c.offsetWidth, c.offsetHeight]; });
const png = await page.screenshot({ clip: box });
fs.writeFileSync('public/splash-logo.png', png);
// which cells hold any of the logo's light: read back in the page from the image just made
const cells = await page.evaluate(async ({ url, w, h, CELL }) => {
  const img = new Image(); img.src = url; await img.decode();
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d'); g.drawImage(img, 0, 0, w, h);
  const d = g.getImageData(0, 0, w, h).data, out = [];
  for (let y = 0; y < h; y += CELL) for (let x = 0; x < w; x += CELL) {
    let lit = 0;
    for (let j = y; j < Math.min(h, y + CELL); j++) for (let i = x; i < Math.min(w, x + CELL); i++) if (d[(j * w + i) * 4] > 40) lit++;
    if (lit > 2) out.push(`${x / CELL}.${y / CELL}`);
  }
  return out;
}, { url: `data:image/png;base64,${png.toString('base64')}`, w, h, CELL });
await browser.close();
const html = fs.readFileSync('public/index.html', 'utf8');
const next = html.replace(/(<div class="chalk"[^>]*?)( data-blocks="[^"]*")?>/, `$1 data-blocks="${cells.join(' ')}">`);
if (next === html) throw new Error('splash-blocks: no .chalk in index.html');
fs.writeFileSync('public/index.html', next);
console.log(`splash-logo.png ${png.length} bytes; ${cells.length} of ${Math.ceil(w / CELL) * Math.ceil(h / CELL)} cells hold the logo`);
