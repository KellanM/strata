// Multi-angle QA contact sheets for gallery objects (and game levels).
// Six views per object, so one-sided mistakes (a single eye, horn or wing)
// can't hide behind the camera: iso from all four corners (the grid turned in
// 90° steps), a straight top-down view and a straight front view (from +z).
//
//   node tools/qa-sheet.mjs themes/sea.js extra/sky-1.js        (gallery files)
//   node tools/qa-sheet.mjs level:dragon-head level:temple-bell (game SHAPES)
//
// Needs the dev server: PORT=5195 node server.js  (QA_PORT to override).
// Writes shots/qa/<id>.png per object and shots/qa/<file>-sheet.png per file.
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const port = process.env.QA_PORT || 5195;
const args = process.argv.slice(2);
mkdirSync('shots/qa', { recursive: true });

// QA_CHROME: path to a chromium headless shell if Playwright's own download is missing
const browser = await chromium.launch(process.env.QA_CHROME ? { executablePath: process.env.QA_CHROME } : {});
const page = await browser.newPage({ viewport: { width: 400, height: 400 } });
await page.goto(`http://localhost:${port}/gallery/index.html?page=2`);
await page.waitForTimeout(500);

for (const arg of args) {
  const out = await page.evaluate(async (arg) => {
    const { renderThumb } = await import('/js/thumbs.js');
    const { PALETTES } = await import('/js/palettes.js');
    const shapes = await import('/js/shapes.js');
    let list;
    if (arg.startsWith('level:')) {
      const ids = arg.slice(6).split(',');
      list = [...shapes.SHAPES, ...shapes.BONUS].filter((s) => ids.includes(s.id));
    } else {
      list = (await import(`/gallery/${arg}`)).default;
    }
    const pal = PALETTES.find((p) => p.name === 'Dawn');
    // turn the grid a quarter about y: new (x, z) = (z, X-1-x)
    const turn = (s, n) => {
      let cur = s;
      for (let k = 0; k < n; k++) {
        const [X, Y, Z] = cur.dims, prev = cur;
        cur = { ...prev, id: `${s.id}@${k + 1}`, dims: [Z, Y, X], cell: (x, y, z) => prev.cell(X - 1 - z, y, x) };
      }
      return cur;
    };
    const load = (src) => new Promise((r) => { const im = new Image(); im.onload = () => r(im); im.src = src; });
    const flat = (s, mode) => {
      const [X, Y, Z] = s.dims, px = 14;
      const W = X, H = mode === 'top' ? Z : Y;
      const c = document.createElement('canvas');
      c.width = W * px; c.height = H * px;
      const g = c.getContext('2d');
      g.fillStyle = '#eee8e0'; g.fillRect(0, 0, c.width, c.height);
      for (let a = 0; a < W; a++) for (let b = 0; b < H; b++) {
        let col = 0, depth = 0;
        if (mode === 'top') { for (let y = Y - 1; y >= 0; y--) { const v = s.cell(a, y, b); if (v) { col = v; depth = y / Math.max(1, Y - 1); break; } } }
        else { const y = Y - 1 - b; for (let z = Z - 1; z >= 0; z--) { const v = s.cell(a, y, z); if (v) { col = v; depth = z / Math.max(1, Z - 1); break; } } }
        if (!col) continue;
        const k = 0.65 + 0.35 * depth;
        g.fillStyle = `rgb(${((col >> 16) & 255) * k | 0},${((col >> 8) & 255) * k | 0},${(col & 255) * k | 0})`;
        g.fillRect(a * px, b * px, px - 1, px - 1);
      }
      return c;
    };
    const results = [];
    const cellW = 150;
    for (const s of list) {
      const sheet = document.createElement('canvas');
      sheet.width = cellW * 6; sheet.height = cellW + 34;
      const g = sheet.getContext('2d');
      g.fillStyle = '#f7efe6'; g.fillRect(0, 0, sheet.width, sheet.height);
      g.fillStyle = '#4a3d63'; g.font = '600 15px sans-serif';
      g.fillText(`${s.name}  (${s.id})  ${s.dims.join('x')}`, 8, 20);
      const labels = ['iso 0', 'iso 90', 'iso 180', 'iso 270', 'top', 'front'];
      for (let k = 0; k < 4; k++) {
        const im = await load(renderThumb(turn(s, k), pal, { size: 140 }));
        g.drawImage(im, k * cellW + 5, 30, 140, 140);
      }
      for (const [k, mode] of [[4, 'top'], [5, 'front']]) {
        const f = flat(s, mode);
        const sc = Math.min(140 / f.width, 140 / f.height);
        g.drawImage(f, k * cellW + 5 + (140 - f.width * sc) / 2, 30 + (140 - f.height * sc) / 2, f.width * sc, f.height * sc);
      }
      g.fillStyle = '#7a6f8a'; g.font = '11px sans-serif';
      labels.forEach((l, k) => g.fillText(l, k * cellW + 8, cellW + 30));
      results.push({ id: s.id, url: sheet.toDataURL('image/png') });
    }
    // per-file contact sheet: all rows stacked
    const ims = await Promise.all(results.map((r) => load(r.url)));
    const all = document.createElement('canvas');
    all.width = cellW * 6; all.height = ims.reduce((h, im) => h + im.height, 0) || 1;
    let y = 0;
    for (const im of ims) { all.getContext('2d').drawImage(im, 0, y); y += im.height; }
    // and in parts of five rows, small enough to read
    const chunks = [];
    for (let i = 0; i < ims.length; i += 5) {
      const part = ims.slice(i, i + 5);
      const c = document.createElement('canvas');
      c.width = cellW * 6; c.height = part.reduce((h, im) => h + im.height, 0);
      let yy = 0;
      for (const im of part) { c.getContext('2d').drawImage(im, 0, yy); yy += im.height; }
      chunks.push(c.toDataURL('image/png'));
    }
    return { results, sheet: all.toDataURL('image/png'), chunks };
  }, arg);
  for (const r of out.results) writeFileSync(`shots/qa/${r.id.replace(/[^a-z0-9-]/gi, '_')}.png`, Buffer.from(r.url.split(',')[1], 'base64'));
  const name = arg.replace(/[^a-z0-9-]/gi, '_');
  writeFileSync(`shots/qa/${name}-sheet.png`, Buffer.from(out.sheet.split(',')[1], 'base64'));
  for (const [k, url] of out.chunks.entries()) writeFileSync(`shots/qa/${name}-part${k + 1}.png`, Buffer.from(url.split(',')[1], 'base64'));
  console.log(`${arg}: ${out.results.length} objects -> shots/qa/${name}-sheet.png`);
}
await browser.close();
