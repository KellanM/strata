// Miniatures of solved objects for the map. Drawn isometrically on a 2D canvas
// (no second WebGL context on phones), with the same face ramp as the block
// shader: tops brightest, the light-facing side a touch under, the far side in
// shade tinted toward the palette's shadow colour.
import { buildCells } from './shapes.js';

const cache = new Map();
const C30 = Math.cos(Math.PI / 6), S30 = 0.5;

const rgb = (h) => [(h >> 16) & 255, (h >> 8) & 255, h & 255];
function tone(c, k, shade, mixAmt) {
  const s = rgb(shade);
  return `rgb(${c.map((v, i) => Math.round(Math.min(255, v * k) * (1 - mixAmt) + s[i] * mixAmt)).join(',')})`;
}

/**
 * Renders a solved shape as a small isometric picture and returns a data URL.
 * The view is the game's isometric one, looking down the +x +z diagonal.
 */
export function renderThumb(shape, palette, { size = 160, canvas: wantCanvas = false } = {}) {
  const key = `${shape.id}|${palette.shade}|${size}${wantCanvas ? '|c' : ''}`;
  if (cache.has(key)) return cache.get(key);

  const [X, Y, Z] = shape.dims;
  const { solid, colors } = buildCells(shape);
  const grid = new Map();
  const cells = [];
  for (let z = 0; z < Z; z++) for (let y = 0; y < Y; y++) for (let x = 0; x < X; x++) {
    const i = x + X * (y + Y * z);
    if (!solid[i]) continue;
    grid.set(`${x},${y},${z}`, 1);
    cells.push({ x, y, z, c: rgb(colors[i]) });
  }
  const has = (x, y, z) => grid.has(`${x},${y},${z}`);
  cells.sort((a, b) => a.x + a.y + a.z - (b.x + b.y + b.z) || a.y - b.y);

  // fit the projected bounds into the canvas
  const proj = (x, y, z) => [(x - z) * C30, (x + z) * S30 - y];
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  // fit the object itself, not the block it was carved from
  for (const { x, y, z } of cells) {
    for (let k = 0; k < 8; k++) {
      const [px, py] = proj(x + (k & 1), y + ((k >> 1) & 1), z + ((k >> 2) & 1));
      minX = Math.min(minX, px); maxX = Math.max(maxX, px); minY = Math.min(minY, py); maxY = Math.max(maxY, py);
    }
  }
  if (!cells.length) { minX = minY = 0; maxX = maxY = 1; }
  const dpr = Math.min(2, (typeof devicePixelRatio === 'number' && devicePixelRatio) || 1);
  const px = Math.round(size * dpr);
  const pad = 0.08 * px;
  const s = Math.min((px - 2 * pad) / (maxX - minX), (px - 2 * pad) / (maxY - minY));
  const ox = (px - (maxX - minX) * s) / 2 - minX * s, oy = (px - (maxY - minY) * s) / 2 - minY * s;
  const P = (x, y, z) => { const [a, b] = proj(x, y, z); return [ox + a * s, oy + b * s]; };

  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = px;
  const g = canvas.getContext('2d');
  g.lineJoin = 'round';
  g.lineWidth = Math.max(0.6, s * 0.035);
  g.strokeStyle = 'rgba(30, 20, 50, 0.12)';
  const quad = (pts, fill) => {
    g.beginPath();
    pts.forEach(([a, b], k) => (k ? g.lineTo(a, b) : g.moveTo(a, b)));
    g.closePath();
    g.fillStyle = fill;
    g.fill();
    g.stroke();
  };
  for (const { x, y, z, c } of cells) {
    if (!has(x, y + 1, z)) quad([P(x, y + 1, z), P(x + 1, y + 1, z), P(x + 1, y + 1, z + 1), P(x, y + 1, z + 1)], tone(c, 1.08, palette.shade, 0));
    if (!has(x, y, z + 1)) quad([P(x, y + 1, z + 1), P(x + 1, y + 1, z + 1), P(x + 1, y, z + 1), P(x, y, z + 1)], tone(c, 0.96, palette.shade, 0.12));
    if (!has(x + 1, y, z)) quad([P(x + 1, y + 1, z), P(x + 1, y + 1, z + 1), P(x + 1, y, z + 1), P(x + 1, y, z)], tone(c, 0.7, palette.shade, 0.12));
  }
  const url = wantCanvas ? canvas : canvas.toDataURL('image/png');
  cache.set(key, url);
  return url;
}

// The eclipse's edge on an uncovered object (map; Kellan, 2026-10-25), drawn
// as the stones' own (map.js cube .rim): a pale warm line a hair outside the
// outline over the faintest halo, and nothing inside it. Its own picture, laid
// over the object with screen blending (style.css .obj-rim), so it only adds
// light and the miniature's shadow never browns it.
// gold: a solved shrine's object, edged in its shrine's gold (Kellan, 2026-10-29)
export function renderRim(shape, palette, { size = 160, gold = false } = {}) {
  const key = `rim|${shape.id}|${palette.shade}|${size}|${gold}`;
  if (cache.has(key)) return cache.get(key);
  const src = renderThumb(shape, palette, { size, canvas: true });
  const n = src.width, u = n / size;   // canvas pixels per drawn pixel at full size
  const sil = (color) => {
    const c = document.createElement('canvas'); c.width = c.height = n;
    const g = c.getContext('2d');
    g.drawImage(src, 0, 0);
    g.globalCompositeOperation = 'source-in';
    g.fillStyle = color; g.fillRect(0, 0, n, n);
    return c;
  };
  const out = document.createElement('canvas'); out.width = out.height = n;
  const o = out.getContext('2d');
  // spread a silhouette r pixels out in every direction
  const grow = (s, r) => { for (let k = 0; k < 16; k++) o.drawImage(s, Math.cos(k * Math.PI / 8) * r, Math.sin(k * Math.PI / 8) * r); };
  o.globalAlpha = gold ? 0.32 : 0.22; grow(sil(gold ? '#ffd77a' : '#fff1cf'), 4.2 * u);   // the halo
  o.globalAlpha = 1;    grow(sil(gold ? '#e9b949' : '#fff6e2'), (gold ? 1.8 : 1.5) * u);   // the line
  o.globalCompositeOperation = 'destination-out';
  o.drawImage(src, 0, 0);
  const url = out.toDataURL('image/png');
  cache.set(key, url);
  return url;
}
