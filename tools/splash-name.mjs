// Renders the splash card's name - UNSUPERVISED / ROCK in Anton, laid flat in
// perspective (index.html .floor .name) - to public/splash-name.png, black on
// clear, at 4x, and prints where it sits in the card's 390 x 844 drawing. The
// card draws it as an image so its sticker border (an SVG filter) treats the
// rock and the name as one shape in every browser: Safari dropped the CSS 3D
// warp under a filter.   node tools/splash-name.mjs   (then update index.html's <image>)
import { chromium } from 'file:///C:/Users/Kellan/AppData/Roaming/npm/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const font = fs.readFileSync('public/fonts/anton-splash.woff2').toString('base64');
const html = `<!doctype html><html><head><style>
  @font-face { font-family: "Splash Anton"; src: url(data:font/woff2;base64,${font}) format("woff2"); }
  html, body { margin: 0; background: transparent; }
  .art { position: absolute; left: 0; top: 0; width: 390px; height: 844px; }
  .name span { display: block; }
  .name .l1 { font-size: 38px; margin-bottom: 5px; }   /* a gap before ROCK: rounded, the two lines touched */
  .name .l2 { font-size: 106px; line-height: .84; transform: scaleY(.62); transform-origin: 50% 0; margin-bottom: -.3em; }
  .floor { position: absolute; left: 0; top: 316px; width: 390px; height: 300px; perspective: 260px; perspective-origin: 195px -40px; }
  .name { position: absolute; left: 0; right: 0; top: 70px; margin: 0; text-align: center; color: #000; transform: rotateX(64deg); transform-origin: 50% 100%;
    font: 400 46px/.86 "Splash Anton", Impact, "Arial Narrow", sans-serif; letter-spacing: .01em; transform-style: preserve-3d; white-space: nowrap; }
</style></head><body><div class="art"><div class="floor"><p class="name"><span class="l1">UNSUPERVISED</span><span class="l2">ROCK</span></p></div></div></body></html>`;
const b = await chromium.launch({ executablePath: process.env.QA_CHROME });
try {
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 4 })).newPage();
  await p.setContent(html); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
  const full = await p.screenshot({ omitBackground: true });
  fs.writeFileSync('shots/splash-name-full.png', full);
} finally { await b.close(); }
