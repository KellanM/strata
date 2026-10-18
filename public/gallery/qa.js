// QA contact sheet (dev only): every object from all four iso corners plus
// straight front, right-side and top views, so a one-sided eye, horn or wing
// can't hide behind the single angle a builder happened to look from.
//   qa.html?files=themes/home,extra/home-1[&only=1,4,9]
import { PALETTES } from '../js/palettes.js';
import { renderThumb } from '../js/thumbs.js';
import { buildCells } from '../js/shapes.js';

const params = new URLSearchParams(location.search);
const files = (params.get('files') || 'themes/home').split(',');
const only = params.get('only') ? new Set(params.get('only').split(',').map(Number)) : null;
const palette = PALETTES.find((p) => p.name === (params.get('palette') || 'Dawn')) ?? PALETTES[0];

// a quarter turn about y, so the iso view looks from the next corner
const turn = (s, k) => {
  let out = s;
  for (let i = 0; i < k; i++) {
    const src = out, [X, Y, Z] = src.dims;
    out = { ...src, id: `${s.id}:r${i + 1}`, dims: [Z, Y, X], cell: (x, y, z) => src.cell(X - 1 - z, y, x) };
  }
  return out;
};

// straight orthographic view: the nearest solid voxel along the view axis
function ortho(s, view) {
  const [X, Y, Z] = s.dims;
  const { solid, colors } = buildCells(s);
  const at = (x, y, z) => (solid[x + X * (y + Y * z)] ? colors[x + X * (y + Y * z)] || 0xffffff : 0);
  let W, H, look;
  if (view === 'front') { W = X; H = Y; look = (u, v) => { for (let z = Z - 1; z >= 0; z--) { const c = at(u, v, z); if (c) return c; } return 0; }; }
  else if (view === 'side') { W = Z; H = Y; look = (u, v) => { for (let x = X - 1; x >= 0; x--) { const c = at(x, v, Z - 1 - u); if (c) return c; } return 0; }; }
  else { W = X; H = Z; look = (u, v) => { for (let y = Y - 1; y >= 0; y--) { const c = at(u, y, Z - 1 - v); if (c) return c; } return 0; }; }
  const cvs = document.createElement('canvas');
  const px = Math.floor(100 / Math.max(W, H));
  cvs.width = cvs.height = 104;
  const g = cvs.getContext('2d');
  const ox = (104 - W * px) / 2, oy = (104 - H * px) / 2;
  for (let u = 0; u < W; u++) for (let v = 0; v < H; v++) {
    const c = look(u, v);
    if (!c) continue;
    g.fillStyle = '#' + c.toString(16).padStart(6, '0');
    g.fillRect(ox + u * px, oy + (H - 1 - v) * px, px - 1, px - 1);
  }
  return cvs;
}

const rows = document.querySelector('#rows');
for (const f of files) {
  const list = (await import(`./${f}.js`)).default;
  list.forEach((s, k) => {
    if (only && !only.has(k + 1)) return;
    const row = document.createElement('div');
    row.className = 'row';
    row.innerHTML = `<div class="label">${f.split('/').pop()} #${k + 1}<br>${s.name}<br><small>${s.dims.join('×')}</small></div>`;
    const add = (el, label) => { const v = document.createElement('div'); v.className = 'view'; v.append(el); const t = document.createElement('span'); t.textContent = label; v.append(t); row.append(v); };
    ['iso +x+z (game)', 'iso turn 1', 'iso turn 2', 'iso turn 3'].forEach((label, t) => {
      const img = new Image();
      img.src = renderThumb(turn(s, t), palette, { size: 104 });
      add(img, label);
    });
    add(ortho(s, 'front'), 'front (+z)');
    add(ortho(s, 'side'), 'side (+x)');
    add(ortho(s, 'top'), 'top');
    rows.append(row);
  });
}
document.body.dataset.ready = '1';
