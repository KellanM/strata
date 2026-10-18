// QA aid: renders every object in one or more gallery files from six views so
// one-sided mistakes can't hide: isometric from all four corners (the grid
// turned in 90° steps), straight down from the top, and straight on from the
// front (+z). Writes shots/qa/<file>-<n>.png sheets and shots/qa/<id>.png rows.
//
//   PORT=5196 node server.js &   (any port; pass it as QA_PORT)
//   QA_PORT=5196 node tools/qa-sheet.mjs page2/home-1 page2/garden-2 [cand-id ...]
//
// Arguments containing "/" are gallery files (relative to public/gallery/);
// anything else is an id filter.
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const port = process.env.QA_PORT || '5196';
const args = process.argv.slice(2);
const files = args.filter((a) => a.includes('/'));
const only = args.filter((a) => !a.includes('/'));
mkdirSync(new URL('../shots/qa/', import.meta.url), { recursive: true });
const out = (name) => new URL(`../shots/qa/${name}.png`, import.meta.url).pathname.replace(/^\/(\w:)/, '$1');

// QA_CHROME points at a browser build when Playwright's own download is missing
const browser = await chromium.launch(process.env.QA_CHROME ? { executablePath: process.env.QA_CHROME } : {});
const page = await browser.newPage({ viewport: { width: 1000, height: 800 }, deviceScaleFactor: 1 });
page.on('pageerror', (e) => console.error('pageerror', e.message));
await page.goto(`http://localhost:${port}/gallery/index.html`);
await page.waitForTimeout(500);

for (const file of files) {
  const rows = await page.evaluate(async ({ file, only }) => {
    const { renderThumb } = await import('/js/thumbs.js');
    const { PALETTES } = await import('/js/palettes.js');
    const { buildCells } = await import('/js/shapes.js');
    const list = (await import(`/gallery/${file}.js?qa=${Date.now()}`)).default;
    const pal = PALETTES.find((p) => p.name === (/garden/.test(file) ? 'Mint' : /sea/.test(file) ? 'Lagoon' : /temple/.test(file) ? 'Dusk' : /sky/.test(file) ? 'Night' : 'Dawn'));
    // the grid turned k quarter-turns about y (k = 0 is the gallery's own view)
    const turn = (s, k) => {
      const [X, Y, Z] = s.dims;
      const f = [
        (x, y, z) => s.cell(x, y, z),
        (x, y, z) => s.cell(X - 1 - z, y, x),
        (x, y, z) => s.cell(X - 1 - x, y, Z - 1 - z),
        (x, y, z) => s.cell(z, y, Z - 1 - x),
      ][k];
      return { ...s, id: `${s.id}:qa${k}:${Date.now()}`, dims: k % 2 ? [Z, Y, X] : [X, Y, Z], cell: f };
    };
    const hex = (c) => '#' + c.toString(16).padStart(6, '0');
    // flat orthographic views drawn cell by cell
    const flat = (s, mode) => {
      const [X, Y, Z] = s.dims;
      const { solid, colors } = buildCells(s);
      const at = (x, y, z) => solid[x + X * (y + Y * z)] ? colors[x + X * (y + Y * z)] : 0;
      const W = X, H = mode === 'top' ? Z : Y;
      const cs = Math.floor(110 / Math.max(W, H));
      const c = document.createElement('canvas');
      c.width = c.height = 120;
      const g = c.getContext('2d');
      g.fillStyle = '#f4efe8'; g.fillRect(0, 0, 120, 120);
      const ox = (120 - W * cs) / 2, oy = (120 - H * cs) / 2;
      for (let u = 0; u < W; u++) for (let v = 0; v < H; v++) {
        let col = 0, depth = 0;
        if (mode === 'top') { for (let y = Y - 1; y >= 0; y--) { const k = at(u, y, v); if (k) { col = k; depth = (Y - 1 - y) / Y; break; } } }
        else { const y = Y - 1 - v; for (let z = Z - 1; z >= 0; z--) { const k = at(u, y, z); if (k) { col = k; depth = (Z - 1 - z) / Z; break; } } }
        if (!col) continue;
        g.fillStyle = hex(col);
        g.fillRect(ox + u * cs, oy + v * cs, cs, cs);
        g.fillStyle = `rgba(0,0,0,${(depth * 0.45).toFixed(2)})`;
        g.fillRect(ox + u * cs, oy + v * cs, cs, cs);
        g.strokeStyle = 'rgba(0,0,0,.12)'; g.strokeRect(ox + u * cs + 0.5, oy + v * cs + 0.5, cs - 1, cs - 1);
      }
      return c.toDataURL();
    };
    document.body.innerHTML = '';
    document.body.style.cssText = 'margin:0;background:#fbf8f4;font:12px sans-serif;color:#333';
    const out = [];
    list.forEach((s, n) => {
      if (only.length && !only.includes(s.id)) return;
      const row = document.createElement('div');
      row.id = 'row-' + s.id.replace(/[^a-z0-9-]/gi, '_');
      row.style.cssText = 'display:flex;align-items:center;gap:6px;padding:6px 8px;border-bottom:1px solid #e5ddd3;width:max-content';
      const label = document.createElement('div');
      label.style.cssText = 'width:150px';
      label.innerHTML = `<b>${n + 1}. ${s.name}</b><br>${s.id}<br>${s.dims.join('×')}`;
      row.appendChild(label);
      const views = [0, 1, 2, 3].map((k) => [`iso ${['+x+z', '-x+z', '-x-z', '+x-z'][k]}`, renderThumb(turn(s, k), pal, { size: 120 })]);
      views.push(['top', flat(s, 'top')], ['front', flat(s, 'front')]);
      for (const [name, src] of views) {
        const fig = document.createElement('figure');
        fig.style.cssText = 'margin:0;text-align:center';
        fig.innerHTML = `<img src="${src}" width="120" height="120" style="background:#efe7de;display:block"><figcaption style="font-size:10px;color:#888">${name}</figcaption>`;
        row.appendChild(fig);
      }
      document.body.appendChild(row);
      out.push({ id: s.id, row: row.id });
    });
    return out;
  }, { file, only });

  await page.waitForTimeout(200);
  const tag = file.replace(/\//g, '-');
  for (const r of rows) await (await page.$('#' + r.row)).screenshot({ path: out(r.id) });
  for (let k = 0; k * 6 < rows.length; k++) {
    const chunk = rows.slice(k * 6, k * 6 + 6);
    // page coordinates (not viewport ones, which move as rows are scrolled into view)
    const boxes = await page.evaluate((ids) => ids.map((id) => {
      const r = document.getElementById(id).getBoundingClientRect();
      return { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height };
    }), chunk.map((r) => r.row));
    const y0 = boxes[0].y, y1 = boxes[boxes.length - 1].y + boxes[boxes.length - 1].height;
    const w = Math.max(...boxes.map((b) => b.width));
    await page.setViewportSize({ width: Math.ceil(w) + 20, height: 800 });
    await page.screenshot({ path: out(`${tag}-${k + 1}`), clip: { x: 0, y: y0, width: Math.ceil(w), height: Math.ceil(y1 - y0) }, fullPage: true });
  }
  console.log(`${file}: ${rows.length} objects -> shots/qa/${tag}-*.png`);
}
await browser.close();
