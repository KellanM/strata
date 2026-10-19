// Renders the map's mountain tops (public/proto/peaks.js, drawn by the game's
// block shader) into one WebP atlas per palette, plus public/map-peaks/peaks.json.
// Run after adding or changing a chapter's palette or its peaks; the map shows
// no peaks for a palette missing from the atlas. Needs the dev server running.
//   npm start   (another terminal)   then   node tools/render-peaks.mjs [port]
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const port = process.argv[2] || process.env.PORT || '5180';
let chromium;
try { ({ chromium } = await import('playwright')); }
catch { ({ chromium } = await import('file:///C:/Users/Kellan/AppData/Roaming/npm/node_modules/playwright/index.mjs')); }
const out = fileURLToPath(new URL('../public/map-peaks/', import.meta.url));
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ executablePath: process.env.QA_CHROME, args: ['--use-angle=d3d11', '--ignore-gpu-blocklist'] });
try {
  const page = await browser.newPage();
  page.on('pageerror', (e) => console.error('pageerror', e.message));
  await page.goto(`http://localhost:${port}/proto/peaks-export.html`);
  await page.waitForSelector('body[data-ready="1"]', { state: 'attached' });
  const atlases = await page.evaluate(() => window.exportPeaks());
  const manifest = { generated: new Date().toISOString().slice(0, 10), palettes: {} };
  for (const [name, a] of Object.entries(atlases)) {
    const file = `${name.toLowerCase()}.webp`;
    fs.writeFileSync(out + file, Buffer.from(a.data.split(',')[1], 'base64'));
    manifest.palettes[name] = { file, w: a.w, h: a.h, sprites: a.sprites };
  }
  fs.writeFileSync(out + 'peaks.json', JSON.stringify(manifest, null, 1));
  const total = fs.readdirSync(out).reduce((s, f) => s + fs.statSync(out + f).size, 0);
  console.log(`${Object.keys(atlases).length} atlases, ${(total / 1024).toFixed(0)} KB in public/map-peaks/`);
} finally {
  await browser.close();
}
