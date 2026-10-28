// Renders the source art for the store builds into resources/, where
// `npx @capacitor/assets generate` turns it into every icon and launch-screen
// size iOS and Android ask for:
//   resources/icon.png           1024x1024, the app icon: a copy of store/icon/app-icon.png
//                                (the 3x3x3 stone on lime, docs/icon-study.md; no longer public/icon.svg)
//   resources/splash.png         2732x2732, the native launch screen: plain black,
//   resources/splash-dark.png    the first frame of the web card (index.html #splash),
//                                which opens on a dark house before its spot strikes
//   node tools/make-store-art.mjs   (needs Playwright and Chrome, as the shot scripts)
import { chromium } from 'file:///C:/Users/Kellan/AppData/Roaming/npm/node_modules/playwright/index.mjs';
import { mkdirSync, copyFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
mkdirSync(new URL('resources/', root), { recursive: true });
copyFileSync(new URL('store/icon/app-icon.png', root), new URL('resources/icon.png', root));
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
try {
  const page = await browser.newPage();
  await page.setViewportSize({ width: 2732, height: 2732 });
  // the card opens in the dark (the house lights are down; then its spot strikes)
  await page.setContent(`<body style="margin:0;background:#000;width:2732px;height:2732px"></body>`);
  for (const f of ['splash.png', 'splash-dark.png']) await page.screenshot({ path: new URL(`resources/${f}`, root).pathname.slice(1) });
  console.log('resources/: icon.png, splash.png, splash-dark.png');
} finally { await browser.close(); }
