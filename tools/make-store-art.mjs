// Renders the source art for the store builds into resources/, where
// `npx @capacitor/assets generate` turns it into every icon and launch-screen
// size iOS and Android ask for:
//   resources/icon.png           1024x1024, the app icon (public/icon.svg)
//   resources/splash.png         2732x2732, the native launch screen: black, the
//   resources/splash-dark.png    Quiet Cairn mark, so it hands over seamlessly to
//                                the web card (index.html #splash)
//   node tools/make-store-art.mjs   (needs Playwright and Chrome, as the shot scripts)
import { chromium } from 'file:///C:/Users/Kellan/AppData/Roaming/npm/node_modules/playwright/index.mjs';
import { readFileSync, mkdirSync } from 'node:fs';

const root = new URL('../', import.meta.url);
mkdirSync(new URL('resources/', root), { recursive: true });
const icon = readFileSync(new URL('public/icon.svg', root), 'utf8');
const mark = `<svg viewBox="0 0 96 96" width="440" height="440">
  <path fill="#fff" d="M14 86c0-6 9-10 34-10s34 4 34 10-12 8-34 8-34-2-34-8z"/>
  <path fill="#fff" d="M26 70c0-5 8-9 23-9s21 4 21 8-6 8-22 8-22-2-22-7z"/>
  <path fill="#fff" d="M35 55c0-5 5-8 13-8s12 3 12 7-4 7-13 7-12-2-12-6z"/>
  <path fill="#fff" d="M48 25l1.6 6.4L56 33l-6.4 1.6L48 41l-1.6-6.4L40 33l6.4-1.6z"/>
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
