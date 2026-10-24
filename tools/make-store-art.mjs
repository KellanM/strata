// Renders the source art for the store builds into resources/, where
// `npx @capacitor/assets generate` turns it into every icon and launch-screen
// size iOS and Android ask for:
//   resources/icon.png           1024x1024, the app icon (public/icon.svg)
//   resources/splash.png         2732x2732, the native launch screen: black, the
//   resources/splash-dark.png    Unsupervised Rock mark, so it hands over seamlessly to
//                                the web card (index.html #splash)
//   node tools/make-store-art.mjs   (needs Playwright and Chrome, as the shot scripts)
import { chromium } from 'file:///C:/Users/Kellan/AppData/Roaming/npm/node_modules/playwright/index.mjs';
import { readFileSync, mkdirSync } from 'node:fs';

const root = new URL('../', import.meta.url);
mkdirSync(new URL('resources/', root), { recursive: true });
const icon = readFileSync(new URL('public/icon.svg', root), 'utf8');
const mark = `<svg viewBox="0 0 120 100" width="520" height="433">
  <path fill="#f1eee8" d="M12 84C8 72 16 58 32 51c12-5 30-7 45-3 16 4 30 13 31 26 1 11-11 18-34 20-27 2-57 1-62-10z"/>
  <path fill="#d8d3ca" d="M14 86c10 7 34 8 58 7 20-2 33-7 35-15 1 9-11 16-34 18-26 2-50 0-59-10z"/>
  <path fill="#d8d3ca" d="M86 55c4 2 6 5 5 8-2-2-4-3-7-4 1-1 2-2 2-4z"/>
  <circle fill="#fff" stroke="#111" stroke-width="1.6" cx="49" cy="66" r="10"/>
  <circle fill="#fff" stroke="#111" stroke-width="1.6" cx="73" cy="64" r="8.5"/>
  <circle fill="#111" cx="46.6" cy="68.6" r="4.6"/>
  <circle fill="#111" cx="75.2" cy="62" r="4"/>
</svg>`;
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
try {
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1024, height: 1024 });
  await page.setContent(`<body style="margin:0">${icon.replace('<svg ', '<svg width="1024" height="1024" ')}</body>`);
  await page.screenshot({ path: new URL('resources/icon.png', root).pathname.slice(1), omitBackground: false });
  await page.setViewportSize({ width: 2732, height: 2732 });
  // the mark sits where the web card shows it: centred, a touch above the middle
  await page.setContent(`<body style="margin:0;background:#000;width:2732px;height:2732px;display:grid;place-items:center">
    <div style="margin-top:-160px">${mark}</div></body>`);
  for (const f of ['splash.png', 'splash-dark.png']) await page.screenshot({ path: new URL(`resources/${f}`, root).pathname.slice(1) });
  console.log('resources/: icon.png, splash.png, splash-dark.png');
} finally { await browser.close(); }
