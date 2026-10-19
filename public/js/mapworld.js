// The map's world (docs/map-study.md): a night sky over a dawn horizon at the
// top of the page, then a sea of mist with each chapter's voxel mountain tops
// rising out of it. Flat layers behind the game's canvas; map.js lays the
// stones out in the map's scroller and this follows its scroll.
//
//   sky     a 2D canvas: the gradient and the horizon move with the page, the
//           stars a little slower (the only parallax at the title)
//   sea     the colour script of the mist, one long gradient
//   layers  far / near / front, sliding at 0.84 / 1 / 1.12 of the page:
//           mountain tops (pre-rendered by tools/render-peaks.mjs into
//           public/map-peaks/, so nothing is built at load), bands of mist on
//           their bases, and over each chapter not yet reached a wall of mist
//           that lifts once (setPart).
import { PALETTES } from './palettes.js';

const RATES = { far: 0.84, near: 1, front: 1.12 };

// ---- colour, in plain hex (no three.js here)
const ch = (h, s) => (h >> s) & 255;
export const mix = (a, b, t) => [16, 8, 0].reduce((o, s) => o | (Math.round(ch(a, s) + (ch(b, s) - ch(a, s)) * t) << s), 0);
const lum = (h) => (0.2126 * ch(h, 16) + 0.7152 * ch(h, 8) + 0.0722 * ch(h, 0)) / 255;
const rgba = (h, a = 1) => `rgba(${ch(h, 16)},${ch(h, 8)},${ch(h, 0)},${a})`;
// a chapter's sea of mist, from its sky
export function seaColour(p) {
  const dark = lum(p.skyTop) < 0.35;
  const sea = mix(p.skyTop, p.skyBottom, dark ? 0.55 : 0.35);
  return dark ? sea : mix(sea, 0xffffff, 0.18);
}
// mist lit by its own sky: warm cream in warm chapters, cool only at night
export function mistColour(p) {
  if (p.name === 'Night') return mix(seaColour(p), 0xdfe6ff, 0.62);
  if (lum(p.skyTop) < 0.35) return mix(mix(p.skyBottom, 0xffffff, 0.42), p.glow, 0.15);
  return mix(0xffffff, p.skyTop, 0.42);
}

// a small stable random stream per string
function rng(seed) {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0;
    h = Math.imul(h ^ (h >>> 13), 3266489909) >>> 0;
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

export class MapWorld {
  constructor(root) {
    this.root = root;
    this.w = 390; this.h = 844; this.dpr = 1; this.u = 0; this.s = 0;
    this.sky = document.createElement('canvas'); this.sky.className = 'mw-sky';
    this.sea = document.createElement('div'); this.sea.className = 'mw-sea';
    this.seaStrip = document.createElement('div'); this.seaStrip.className = 'mw-strip';
    this.sea.appendChild(this.seaStrip);
    root.append(this.sea, this.sky);
    this.layers = {};
    for (const k of ['far', 'near', 'front']) { const d = document.createElement('div'); d.className = `mw-layer mw-${k}`; root.appendChild(d); this.layers[k] = d; }
    this.chunks = [];
    this.ribbons = new Map();
    const rand = rng('stars');
    // three depths of stars; the page moves them by only 88-96%
    this.stars = [[700, 0.9, 0.88, 0.55], [260, 1.3, 0.92, 0.8], [50, 1.9, 0.96, 1]].map(([n, r, rate, a]) => ({ r, rate, a, pts: Array.from({ length: n }, () => [rand(), rand() * 1.15, rand()]) }));
    this.atlas = null;
    this.atlasReady = fetch('map-peaks/peaks.json').then((r) => (r.ok ? r.json() : null)).then((j) => { this.atlas = j; }).catch(() => {});
  }

  setSize(w, h, dpr) {
    if (w === this.w && h === this.h && dpr === this.dpr) return;
    this.w = w; this.h = h; this.dpr = dpr;
    this.sky.width = Math.round(w * dpr); this.sky.height = Math.round(h * dpr);
    this.skyDirty = true;
  }

  // ---------------------------------------------------------------- a map layout
  /**
   * model: { regions: [{ index, name, base, top, bottom, labelZ, labelSide, bank, folded }],
   *          trailX(z) (from the page's centre), driftTop, end }; z in page px
   */
  async build(model) {
    await this.atlasReady;
    this.model = model;
    for (const k of Object.keys(this.layers)) this.layers[k].innerHTML = '';
    this.chunks = [];
    // the colour script, one long gradient on the page's own clock
    const { regions } = model;
    const stops = [`${rgba(seaColour(regions[0].base))} 0px`];
    for (const r of regions) {
      const c = rgba(seaColour(r.base));
      stops.push(`${c} ${(r.top + 120).toFixed(0)}px`, `${c} ${Math.max(r.top + 121, r.bottom - 120).toFixed(0)}px`);
    }
    stops.push(`${rgba(seaColour(regions[regions.length - 1].base))} ${model.end + 2000}px`);
    this.seaStrip.style.height = `${model.end + 2000}px`;
    this.seaStrip.style.background = `linear-gradient(180deg, ${stops.join(', ')})`;
    for (const r of regions) this.buildChunk(r);
    this.lastKey = null;
    this.setView(this.u, this.s, true);
  }

  sprite(r, key) {
    const a = this.atlas?.palettes?.[r.base.name];
    const s = a?.sprites?.[key];
    if (!s) return null;
    return { ...s, file: `map-peaks/${a.file}`, aw: a.w, ah: a.h };
  }
  // a ribbon of mist: soft lobes, every one inside the canvas (no straight cut)
  ribbon(col, seed, w, h, alpha) {
    const key = `${col}|${seed}|${w}|${h}|${alpha}`;
    if (this.ribbons.has(key)) return this.ribbons.get(key);
    const rand = rng(`mist${seed}`);
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d');
    const n = 6 + Math.floor(rand() * 4);
    for (let i = 0; i < n; i++) {
      const rx = w * (0.16 + rand() * 0.18), ry = h * (0.2 + rand() * 0.14);
      const x = rx + rand() * (w - 2 * rx), y = h / 2 + (rand() - 0.5) * (h - 2 * ry) * 0.6;
      const grad = g.createRadialGradient(x, y, 0, x, y, rx);
      grad.addColorStop(0, rgba(col, alpha)); grad.addColorStop(0.55, rgba(col, alpha * 0.6)); grad.addColorStop(1, rgba(col, 0));
      g.save(); g.translate(x, y); g.scale(1, ry / rx); g.translate(-x, -y);
      g.fillStyle = grad; g.fillRect(x - rx, y - rx, rx * 2, rx * 2); g.restore();
    }
    const out = { url: c.toDataURL(), w, h };
    this.ribbons.set(key, out);
    return out;
  }

  buildChunk(r) {
    const model = this.model, rand = rng(r.name + 'm');
    const mist = mistColour(r.base);
    const chunk = { r, z0: r.top - 500, z1: r.bottom + 500, els: [], on: true };
    const W2 = this.w / 2;
    const FADE = 0.5;
    const place = (layer, el, x, z, w, h, ax, ay, cls) => {
      el.className = `mw-spr ${cls}`;
      el.style.width = `${w}px`; el.style.height = `${h}px`;
      el.style.transform = `translate(${(x - w * ax).toFixed(0)}px, ${(z - h * ay).toFixed(0)}px)`;
      this.layers[layer].appendChild(el); chunk.els.push(el);
      return el;
    };
    const drift = (el) => { el.classList.add('drift'); el.style.setProperty('--dur', `${(18 + rand() * 16).toFixed(1)}s`); el.style.setProperty('--delay', `${(-rand() * 20).toFixed(1)}s`); return el; };
    const band = (layer, x, z, w, h, alpha, cls, seed) => {
      const rb = this.ribbon(mist, seed, Math.round(w), Math.round(h), alpha);
      const img = new Image(); img.alt = ''; img.src = rb.url;
      return drift(place(layer, img, x, z, rb.w, rb.h, 0.5, 0.5, `mist ${cls}`));
    };
    // a mountain top, its base faded out, and the densest mist across the cut
    const peak = (layer, x, z, key, cls = '') => {
      const s = this.sprite(r, key);
      if (!s) return null;
      const el = document.createElement('div');
      el.style.backgroundImage = `url(${s.file})`;
      el.style.backgroundSize = `${s.aw}px ${s.ah}px`;
      el.style.backgroundPosition = `${-s.x}px ${-s.y}px`;
      place(layer, el, x, z, s.w, s.h, s.ax, s.ay, `peak ${cls}`);
      const cut = z - s.h * s.ay + s.h * (1 - FADE * 0.55);
      // soft, and never within 40 px of the trail
      let w = s.w * 1.9;
      const tx = model.trailX(cut), sg = Math.sign(x || 1), inner = x - sg * w / 2;
      if (sg * (inner - tx) < 40) w = Math.max(90, 2 * Math.abs(x - (tx + sg * 40)));
      band(layer, x, cut, w, Math.max(70, s.h * 0.5), 0.55, `base ${cls}`, 10 + (key.length % 5));
      return { el, s };
    };
    // the depth pair: a big summit near the stones, cropped by the edge, and a
    // small pale peak far back on the other side
    const side = r.index % 2 ? -1 : 1;
    const sig = this.sprite(r, 'sig');
    let zs = r.labelZ + 200;
    for (let z = r.labelZ + 120; z < Math.min(r.bottom - 100, r.labelZ + 520); z += 20) {
      if (Math.sign(model.trailX(z)) === -side && Math.abs(model.trailX(z)) > 50) { zs = z + 60; break; }
    }
    if (sig) zs = Math.min(r.bottom - 60, Math.max(zs, r.labelZ + 90 + sig.h * sig.ay));
    if (!r.folded) peak('far', -side * (W2 - 40), zs - 120, 'far3', 'distant');
    if (!r.folded && r.index % 3 !== 2 && r.bottom - r.labelZ > 800) {
      const z = Math.min(r.bottom - 160, r.labelZ + 700);
      const x2 = model.trailX(z), sd = Math.abs(x2) > 30 ? -Math.sign(x2) : -side;
      const lf = this.sprite(r, r.index % 2 ? 'lf2' : 'lf1');
      if (lf) peak('near', sd * (W2 - lf.w * 0.12), z, r.index % 2 ? 'lf2' : 'lf1');
      peak('far', -sd * (W2 - 40), z - 140, 'far4', 'distant');
    }
    for (let z = r.top + 80; z < r.bottom; z += 260 + rand() * 120) {
      band('far', (rand() < 0.5 ? -1 : 1) * (250 + rand() * 60), z, 300, 70, 0.32, '', 6 + Math.floor(rand() * 4));
    }
    if (r.bank) {
      // its signature summit stands behind the veil's top edge, away from its
      // name: the teaser; then the veil, and faint shapes deeper in
      if (sig) peak('near', -r.labelSide * (W2 - sig.w * 0.3), r.top + 40 - sig.h * 0.3 + sig.h * sig.ay, 'sig', 'teaser');
      const wall = document.createElement('div');
      wall.className = 'mw-wall';
      const z0 = r.top + 30, z1 = r.bottom + 60;
      wall.style.transform = `translate(-560px, ${z0}px)`;
      wall.style.width = '1120px'; wall.style.height = `${z1 - z0}px`;
      wall.style.background = `linear-gradient(180deg, ${rgba(mist, 0)} 0, ${rgba(mist, 0.94)} 110px, ${rgba(mist, 0.97)} 100%)`;
      this.layers.near.appendChild(wall); chunk.els.push(wall);
      const veil = { wall, base: wall.style.transform, kids: [] };
      for (let z = r.top + 10; z < r.bottom + 40; z += 58) {
        for (let x = -420; x <= 420; x += 150 + rand() * 50) {
          const img = band('near', x + (rand() - 0.5) * 50, z + (rand() - 0.5) * 30, 280 * (0.8 + rand() * 0.5), 80, 0.85, 'veil', Math.floor(rand() * 8));
          veil.kids.push({ el: img, base: img.style.transform, x, seed: rand() });
        }
      }
      // more lies inside: two faint silhouettes, and a soft glow of the chapter's light
      for (const [k, key] of [[0.45, 'ghost1'], [0.75, 'ghost2']]) {
        const pz = r.top + (r.bottom - r.top) * k;
        if (pz > r.bottom - 100) continue;
        const g = peak('near', (key === 'ghost1' ? -1 : 1) * (W2 - 30), pz, key, 'ghost');
        if (g) veil.kids.push({ el: g.el, base: g.el.style.transform, x: 0, seed: 0.5, ghost: true });
      }
      if (r.bottom - r.top > 500) {
        const glow = document.createElement('div');
        glow.className = 'mw-glow';
        glow.style.setProperty('--g', rgba(r.base.glow, 0.5));
        place('near', glow, 0, r.top + (r.bottom - r.top) * 0.55, 420, 420, 0.5, 0.5, 'veil-glow');
        veil.kids.push({ el: glow, base: glow.style.transform, x: 0, seed: 0.2 });
      }
      chunk.veil = veil;
    } else if (sig) {
      peak('near', side * (W2 - sig.w * 0.22), zs, 'sig');
    }
    this.chunks.push(chunk);
  }

  // the mist lifts: it thins from the trail outward, its bands rising and
  // spreading as they fade; the wall behind them clears last
  setPart(index, k) {
    const c = this.chunks.find((x) => x.r.index === index);
    const v = c?.veil;
    if (!v) return;
    const e = k * k * (3 - 2 * k);
    v.wall.style.transform = `${v.base} translateY(${(-e * 70).toFixed(1)}px)`;
    v.wall.style.opacity = String(Math.max(0, 1 - Math.pow(k, 1.4) * 1.15));
    for (const q of v.kids) {
      const kk = Math.min(1, Math.max(0, k * 1.5 - (Math.abs(q.x) / 420) * 0.4 - q.seed * 0.15));
      const ee = kk * kk * (3 - 2 * kk);
      q.el.style.transform = `${q.base} translate(${(Math.sign(q.x || 1) * ee * (90 + 90 * q.seed)).toFixed(1)}px, ${(-ee * (70 + 60 * q.seed)).toFixed(1)}px)`;
      q.el.style.opacity = String(Math.max(0, (q.ghost ? 0.26 : 1) * (1 - ee)));
    }
  }

  // u: the title pan, 0 (stars) .. 1 (the map at its top); s: the map's scroll
  setView(u, s, force = false) {
    const key = `${u.toFixed(4)}|${s.toFixed(1)}`;
    if (!force && key === this.lastKey) return;
    this.lastKey = key;
    this.u = u; this.s = s;
    const off = (1 - u) * window.innerHeight;   // as the map's sheet slides (main.js setScroll)
    for (const [k, el] of Object.entries(this.layers)) el.style.transform = `translate3d(${this.w / 2}px, ${((off - s) * RATES[k]).toFixed(1)}px, 0)`;
    this.seaStrip.style.transform = `translate3d(0, ${(off - s).toFixed(1)}px, 0)`;
    const top = s - off - 400, bot = s - off + this.h + 400;
    for (const c of this.chunks) {
      const on = c.z1 > top && c.z0 < bot;
      if (on !== c.on) { c.on = on; for (const el of c.els) el.style.display = on ? '' : 'none'; }
    }
    // the sky is the top of the page: its horizon moves with it
    const horizon = this.h + 60 - this.h * u - s;
    this.sky.style.display = horizon > -10 ? '' : 'none';
    if (horizon > -10) this.drawSky(horizon);
  }
  drawSky(horizon) {
    const g = this.sky.getContext('2d'), d = this.dpr, w = this.w, h = this.h;
    g.setTransform(d, 0, 0, d, 0, 0);
    g.clearRect(0, 0, w, h);
    const hy = Math.min(h, horizon);
    const grad = g.createLinearGradient(0, horizon - h * 1.4, 0, horizon);
    grad.addColorStop(0, '#121731'); grad.addColorStop(0.45, '#232a52'); grad.addColorStop(0.72, '#4c5187');
    grad.addColorStop(0.88, '#bd93b8'); grad.addColorStop(0.965, '#f6cbc4'); grad.addColorStop(1, '#ffeedd');
    g.fillStyle = grad; g.fillRect(0, 0, w, hy);
    const travel = (this.h + 60) - horizon;
    g.fillStyle = '#eef0ff';
    for (const L of this.stars) {
      for (const [x, y, k] of L.pts) {
        const sy = y * h - travel * L.rate;
        if (sy < -4 || sy > hy - 24) continue;
        g.globalAlpha = L.a * Math.min(1, (hy - 24 - sy) / (h * 0.35)) * (0.5 + 0.5 * k);
        g.fillRect(x * w, sy, L.r, L.r);
      }
    }
    g.globalAlpha = 1;
    if (horizon < h) {
      const first = this.model ? seaColour(this.model.regions[0].base) : 0xf3dcd4;
      const sea = g.createLinearGradient(0, hy, 0, h);
      sea.addColorStop(0, '#fbe6dc'); sea.addColorStop(1, rgba(first));
      g.fillStyle = sea; g.fillRect(0, hy, w, h - hy);
      g.fillStyle = 'rgba(255, 248, 236, .9)'; g.fillRect(0, hy - 1, w, 1.5);
    }
  }
}

export const paletteByName = (name) => PALETTES.find((p) => p.name === name);
