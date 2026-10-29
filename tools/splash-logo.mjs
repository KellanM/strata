// The picture of the finished logo that the splash's chalk splotches show (index.html #splash
// .slaps): captured from the card itself at 3x, the chalk's box only, to public/splash-logo.png.
// Rerun if the card changes, then make it greyscale (it is white and black):
//   (the dev server on :5231)   node tools/splash-logo.mjs
//   python -c "from PIL import Image; Image.open('public/splash-logo.png').convert('L').save('public/splash-logo.png', optimize=True)"
import { chromium } from 'file:///C:/Users/Kellan/AppData/Roaming/npm/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const browser = await chromium.launch({ executablePath: process.env.QA_CHROME });
const page = await (await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, serviceWorkers: 'block' })).newPage();
await page.route('**/js/start.js', (r) => r.abort());   // the card alone: the game never boots, nothing lifts it
await page.goto(`http://localhost:${process.env.PORT || 5231}/`);
await page.addStyleTag({ content: '#splash .chalk .sweep, #splash .chalk .slaps { display: none !important; }' });
await page.waitForTimeout(1200);
const box = await page.evaluate(() => { const r = document.querySelector('#splash .chalk').getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; });
fs.writeFileSync('public/splash-logo.png', await page.screenshot({ clip: box }));
await browser.close();
console.log('public/splash-logo.png written');
