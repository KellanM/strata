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
// glow: a thin gold rim round the object's outline and a soft gold light beyond it
// (an uncovered object on the map and in the journal; Kellan, 2026-10-25)
export function renderThumb(shape, palette, { size = 160, glow = false } = {}) {
  const key = `${shape.id}|${palette.shade}|${size}|${glow ? 'g' : ''}`;
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
  const url = (glow ? gild(canvas) : canvas).toDataURL('image/png');
  cache.set(key, url);
  return url;
}

// The gold: the object's silhouette in gold, drawn a hair out in every
// direction (the rim) with a soft shadow of the same gold (the glow), and the
// object itself over it. Baked into the picture once, so the map pays nothing
// for it as it scrolls.
function gild(src) {
  const n = src.width;
  const sil = document.createElement('canvas'); sil.width = sil.height = n;
  const sg = sil.getContext('2d');
  sg.drawImage(src, 0, 0);
  sg.globalCompositeOperation = 'source-in';
  sg.fillStyle = '#ffd98a';
  sg.fillRect(0, 0, n, n);
  const out = document.createElement('canvas'); out.width = out.height = n;
  const o = out.getContext('2d');
  o.shadowColor = 'rgba(255, 196, 92, .85)';
  o.shadowBlur = n * 0.045;
  const r = Math.max(1, n * 0.009);
  for (let k = 0; k < 8; k++) o.drawImage(sil, Math.cos(k * Math.PI / 4) * r, Math.sin(k * Math.PI / 4) * r);
  o.shadowBlur = 0;
  o.drawImage(src, 0, 0);
  return out;
}
