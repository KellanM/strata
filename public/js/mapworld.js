// The map's world (docs/map-study.md): a night sky over a dawn horizon at the
// top of the page, then a sea of mist with each chapter's voxel mountain tops
// rising out of it.
//
// The world lives inside the map's own scroller (.mw-scene, behind the stones),
// so the browser moves it with the stones on the compositor: nothing in here
// runs while the map scrolls. (It used to be a fixed layer moved by script on
// every scroll, and on a phone it trailed the stones at ~7 fps.)
//
//   scene   in the scroller: the dawn at the top, the colour script of the
//           mist (one long gradient), and two layers of scenery: mountain tops
//           (pre-rendered by tools/render-peaks.mjs into public/map-peaks/, so
//           nothing is built at load), bands of mist on their bases, and over
//           each chapter not yet reached a wall of mist that lifts once
//           (setPart). Every layer moves with the page: the islands sit still
//           in the world, with no parallax (Kellan, 2026-10-19). PARALLAX
//           brings back the far layer's drift (0.84 of the page, through a CSS
//           scroll-driven animation) where the browser has them.
//   sky     a fixed layer for the title only: the night gradient and three
//           pre-drawn sheets of stars, moved by transforms as the title pans
//           (the stars a little slower: the only parallax at the title). Once
//           the map is up it's hidden, and its root shows the chapter's sea
//           as the backdrop of the dive and the pull-back.
import { PALETTES } from './palettes.js';

const FAR_RATE = 0.84;
const PARALLAX = false;   // the islands don't drift; only the title's stars have parallax
const NIGHT = '#121731';
// the sky, top to bottom over 1.4 screens, ending at the horizon
// (the last stretch is long and the peak low, so the horizon is a glow, not a band)
// (Kellan, 2026-10-25: longer, so night turns to dawn over more of the way down)
// (Kellan, 2026-10-28: to a rose sunrise at the horizon, not a bright cream - the map came up like a flashbang)
const SKY_STOPS = [[0, '#121731'], [0.3, '#1c234d'], [0.5, '#2c3465'], [0.64, '#454a80'], [0.76, '#6f6599'], [0.86, '#a888b0'], [0.93, '#dba7b0'], [1, '#f4c4a8']];
// below the horizon the glow sinks slowly into the first chapter's sea, over
// this many screens: the title's sky and the map are one curve, no edge
const BELOW = [[0, 0xf4c4a8], [0.2, 0xf0c0a8], [0.75, 0xdcb6bb]];
const BELOW_END = 1.8;
const DAWN = 60;   // the horizon sits this far below the top of the map's page

// ---- colour, in plain hex (no three.js here)
const ch = (h, s) => (h >> s) & 255;
export const mix = (a, b, t) => [16, 8, 0].reduce((o, s) => o | (Math.round(ch(a, s) + (ch(b, s) - ch(a, s)) * t) << s), 0);
const lum = (h) => (0.2126 * ch(h, 16) + 0.7152 * ch(h, 8) + 0.0722 * ch(h, 0)) / 255;
const rgba = (h, a = 1) => `rgba(${ch(h, 16)},${ch(h, 8)},${ch(h, 0)},${a})`;
// The sky from the top of the title down through the horizon into the sea, as
// one gradient. CSS joins its stops with straight lines, and each corner shows
// as a band (worst at the horizon's bright peak), so the stops are joined by a
// monotone cubic per channel and sampled finely: the light bends, never kinks.
function dawnGradient(Hs, h, sea) {
  const pts = [...SKY_STOPS.map(([k, c]) => [k * Hs, parseInt(c.slice(1), 16)]),
    ...BELOW.slice(1).map(([k, c]) => [Hs + k * h, c]), [Hs + BELOW_END * h, sea]];
  const xs = pts.map((p) => p[0]);
  const chans = [16, 8, 0].map((sh) => {
    const ys = pts.map((p) => ch(p[1], sh)), n = ys.length;
    const d = xs.slice(1).map((x, i) => (ys[i + 1] - ys[i]) / (x - xs[i]));
    // Fritsch-Carlson tangents: flat at a peak, so the horizon's glow is round
    const m = ys.map((_, i) => (i === 0 ? d[0] : i === n - 1 ? d[n - 2] : d[i - 1] * d[i] <= 0 ? 0 : (2 * d[i - 1] * d[i]) / (d[i - 1] + d[i])));
    return (x) => {
      let i = 0;
      while (i < n - 2 && x > xs[i + 1]) i++;
      const w = xs[i + 1] - xs[i], t = Math.min(1, Math.max(0, (x - xs[i]) / w)), t2 = t * t, t3 = t2 * t;
      const v = (2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * w * m[i] + (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * w * m[i + 1];
      return Math.round(Math.min(255, Math.max(0, v)));
    };
  });
  const end = xs[xs.length - 1], N = 120, stops = [];
  for (let k = 0; k <= N; k++) {
    const x = (k / N) * end;
    stops.push(`rgb(${chans.map((f) => f(x)).join(',')}) ${x.toFixed(1)}px`);
  }
  return { css: `linear-gradient(180deg, ${stops.join(', ')})`, height: end };
}
// a chapter's sea of mist, from its sky
export function seaColour(p) {
  const dark = lum(p.skyTop) < 0.35;
  const sea = mix(p.skyTop, p.skyBottom, dark ? 0.55 : 0.35);
  return dark ? sea : mix(sea, 0xffffff, 0.18);
}
// A chapter's sea as a gradient down its length (Kellan, 2026-10-28: each world
// with its own, as First Light has under the dawn): its sky's top colour over its
// bottom one, as a level's sky runs, softened toward its sea colour
export function seaEnds(p) {
  const s = seaColour(p), lift = (c) => (lum(p.skyTop) < 0.35 ? c : mix(c, 0xffffff, 0.18));
  return [mix(s, lift(p.skyTop), 0.8), mix(s, lift(p.skyBottom), 0.8)];
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
  constructor(root, scroller) {
    this.root = root; this.scroller = scroller;
    this.w = 390; this.h = 844; this.dpr = 1; this.u = -1;
    this.backCol = null;
    // the title's sky (fixed)
    this.sky = document.createElement('div'); this.sky.className = 'mw-sky';
    this.starWrap = document.createElement('div'); this.starWrap.className = 'mw-stars';
    this.sky.append(this.starWrap);
    root.appendChild(this.sky);
    const rand = rng('stars');
    // three depths of stars; the title's pan moves them by only 88-96%
    this.stars = [[700, 0.9, 0.88, 0.55], [260, 1.3, 0.92, 0.8], [50, 1.9, 0.96, 1]].map(([n, r, rate, a]) => {
      const c = document.createElement('canvas'); c.className = 'mw-starsheet';
      this.starWrap.appendChild(c);
      return { r, rate, a, c, pts: Array.from({ length: n }, () => [rand(), rand() * 1.15, rand()]) };
    });
    // the map's world (in the scroller, under the stones)
    this.scene = document.createElement('div'); this.scene.className = 'mw-scene'; this.scene.setAttribute('aria-hidden', 'true');
    this.seaStrip = document.createElement('div'); this.seaStrip.className = 'mw-strip';
    this.dawn = document.createElement('div'); this.dawn.className = 'mw-dawn';
    this.scene.append(this.seaStrip, this.dawn);
    this.layers = {};
    for (const k of ['far', 'near']) { const d = document.createElement('div'); d.className = `mw-layer mw-${k}`; this.scene.appendChild(d); this.layers[k] = d; }
    // the end of the map: under the Drift the mist sinks into night and the stars come out
    this.dusk = document.createElement('div'); this.dusk.className = 'mw-dusk';
    this.duskStars = document.createElement('canvas'); this.duskStars.className = 'mw-dusk-stars';
    this.dusk.appendChild(this.duskStars);
    this.scene.appendChild(this.dusk);
    const reduce = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    this.parallax = PARALLAX && !reduce && !!globalThis.CSS?.supports?.('animation-timeline: scroll()');
    if (this.parallax) this.layers.far.classList.add('mw-par');
    scroller.prepend(this.scene);
    this.chunks = [];
    this.ribbons = new Map();
    this.atlas = null;
    this.atlasReady = fetch('map-peaks/peaks.json').then((r) => (r.ok ? r.json() : null)).then((j) => { this.atlas = j; }).catch(() => {});
  }

  setSize(w, h, dpr) {
    if (w === this.w && h === this.h && dpr === this.dpr) return;
    this.w = w; this.h = h; this.dpr = dpr;
    this.layoutSky();
    if (this.model) this.layoutScene();
    const u = this.u; this.u = -1; this.setView(Math.max(0, u));
  }

  // the title's sky: 1.4 screens of gradient down to the horizon, the dawn sea
  // below it; the stars drawn once per size onto three sheets
  layoutSky() {
    const { w, h } = this, Hs = h * 1.4, d = Math.min(2, this.dpr);
    this.Hs = Hs;
    const sea = this.firstSeaHex ?? 0xd4b3bb, g = dawnGradient(Hs, h, sea);
    this.sky.style.height = `${Hs + h + DAWN}px`;
    this.sky.style.background = `${g.css} 0 0 / 100% ${g.height.toFixed(1)}px no-repeat, ${rgba(sea)}`;
    this.starWrap.style.height = `${Hs}px`;
    for (const L of this.stars) {
      L.c.width = Math.round(w * d); L.c.height = Math.round(Hs * d);
      L.c.style.width = `${w}px`; L.c.style.height = `${Hs}px`;
      const g = L.c.getContext('2d');
      g.setTransform(d, 0, 0, d, 0, 0);
      g.fillStyle = '#eef0ff';
      for (const [x, y, k] of L.pts) {
        const sy = y * h + Hs - h - DAWN;   // where it sits in the sky with the title at rest
        if (sy < -4 || sy > Hs) continue;
        g.globalAlpha = L.a * (0.5 + 0.5 * k);
        g.fillRect(x * w, sy, L.r, L.r);
      }
    }
  }

  // ---------------------------------------------------------------- a map layout
  /**
   * model: { regions: [{ index, name, base, top, bottom, labelZ, labelSide, bank, folded }],
   *          trailX(z) (from the page's centre), driftTop, end }; z in page px
   */
  // (this.built: the painting is done - main.js holds the studio's card for it, or its
  // near-second of work lands on whatever is moving then)
  build(model) { return (this.built = this.paint(model)); }
  async paint(model) {
    await this.atlasReady;
    this.model = model;
    for (const k of Object.keys(this.layers)) this.layers[k].innerHTML = '';
    this.chunks = [];
    // the colour script, one long gradient on the page's own clock
    const { regions } = model;
    this.firstSeaHex = seaColour(regions[0].base);
    this.firstSea = rgba(this.firstSeaHex);
    const stops = [`${this.firstSea} 0px`];
    for (const r of regions) {
      const [a, b] = seaEnds(r.base);
      // (the first begins at its plain sea colour: the dawn above sinks into that)
      stops.push(`${rgba(r.index === 0 ? this.firstSeaHex : a)} ${(r.top + 120).toFixed(0)}px`, `${rgba(b)} ${Math.max(r.top + 121, r.bottom - 120).toFixed(0)}px`);
    }
    this.lastSea = rgba(seaEnds(regions[regions.length - 1].base)[1]);
    stops.push(`${this.lastSea} ${model.end}px`);
    this.seaStrip.style.background = `linear-gradient(180deg, ${stops.join(', ')})`;
    for (const r of regions) this.buildChunk(r);
    this.layoutSky();
    this.layoutScene();
    if (!this.backCol) this.root.style.backgroundColor = this.firstSea;
  }
  // the scene is exactly as tall as the map's page; the dawn at its top carries
  // on the title's sky (the last DAWN px of it, the horizon, the dawn sea)
  layoutScene() {
    const { h } = this, Hs = h * 1.4;
    this.scene.style.height = `${this.model.end}px`;
    const g = dawnGradient(Hs, h, this.firstSeaHex);
    this.dawn.style.height = `${(DAWN + BELOW_END * h).toFixed(1)}px`;
    this.dawn.style.background = `${g.css} 0 ${(DAWN - Hs).toFixed(1)}px / 100% ${g.height.toFixed(1)}px no-repeat`;
    // its foot fades into the first chapter's gradient below (a hard line showed there once the chapters had gradients)
    this.dawn.style.webkitMaskImage = this.dawn.style.maskImage = 'linear-gradient(180deg, #000 45%, transparent)';
    this.layoutDusk();
    // past the end - iOS's bounce at the foot of the scroll - the map's last colour goes on (the
    // scroller's own background, under the half of the screen the bounce opens; the night of
    // the Drift, or the last sea) rather than whatever lay behind (Kellan, 2026-10-29: a pink)
    // (set on its parent, #menu: the descent clears the scroller's own inline style when it lands)
    this.scroller.parentElement.style.setProperty('--map-foot', this.model.driftTop ? '#121731' : this.lastSea);
    // the far layer's parallax: by the end of the scroll it has fallen behind by (1 - rate) of it
    const range = Math.max(0, Math.max(this.model.end, this.scroller.scrollHeight) - this.scroller.clientHeight);
    this.layers.far.style.setProperty('--par', `${(range * (1 - FAR_RATE)).toFixed(1)}px`);
  }
  // The title read backwards: the last chapter's mist warms to a faint horizon
  // glow, deepens through the title's violets to its night under the Drift, and
  // its stars come out toward the bottom. Over the mist (no hard edge where the
  // last chapter's cloud ends), under the stones.
  layoutDusk() {
    const { h, w } = this, m = this.model;
    if (!m?.driftTop) { this.dusk.style.display = 'none'; return; }
    const top = m.driftTop - 0.9 * h, len = m.end - top;
    const at = (z) => z - top;
    const hex = (c, a) => [ch(c, 16), ch(c, 8), ch(c, 0), a];
    const keys = [[0, hex(0xeabfbf, 0)], [0.4 * h, hex(0xd2a6bd, 0.35)], [at(m.driftTop) - 0.2 * h, hex(0x8f7fae, 0.8)],
      [at(m.driftTop), hex(0x4c5187, 1)], [at(m.driftLabel) + 40, hex(0x323a68, 1)], [at(m.driftStones), hex(0x232a52, 1)], [len, hex(0x121731, 1)]];
    // eased between keys and sampled finely, so no corner shows as a band
    const stops = [];
    for (let i = 0; i < keys.length - 1; i++) {
      const [z0, c0] = keys[i], [z1, c1] = keys[i + 1];
      for (let k = 0; k < 10; k++) {
        const t = k / 10, e = t * t * (3 - 2 * t), c = c0.map((v, j) => v + (c1[j] - v) * e);
        stops.push(`rgba(${c.slice(0, 3).map(Math.round).join(',')},${c[3].toFixed(3)}) ${(z0 + (z1 - z0) * t).toFixed(1)}px`);
      }
    }
    stops.push(`rgb(18,23,49) ${len.toFixed(1)}px`);
    Object.assign(this.dusk.style, { display: '', top: `${top.toFixed(1)}px`, height: `${len.toFixed(1)}px`, background: `linear-gradient(180deg, ${stops.join(', ')})` });
    // the stars, thickening and brightening toward the bottom
    const s0 = at(m.driftLabel) - 60, sh = len - s0, d = Math.min(2, this.dpr), c = this.duskStars;
    c.width = Math.round(w * d); c.height = Math.round(sh * d);
    Object.assign(c.style, { top: `${s0.toFixed(1)}px`, width: `${w}px`, height: `${sh.toFixed(1)}px` });
    const g = c.getContext('2d'), rand = rng('dusk');
    g.setTransform(d, 0, 0, d, 0, 0); g.fillStyle = '#eef0ff';
    for (let i = 0; i < 1100; i++) {
      const x = rand(), y = rand(), k = rand(), r = k > 0.93 ? 1.9 : k > 0.7 ? 1.3 : 0.9;
      const ramp = Math.min(1, 1.35 * Math.pow(y, 1.1));   // few at the Drift, the full sky at the bottom
      if (rand() > 0.15 + 0.85 * ramp) continue;
      g.globalAlpha = ramp * (r > 1.5 ? 1 : r > 1 ? 0.8 : 0.55) * (0.5 + 0.5 * rand());
      g.fillRect(x * w, y * sh, r, r);
    }
    // and past the foot (a bounce at the bottom: layoutScene's --map-foot), the same sky at its
    // fullest, so the stars go on rather than stopping at the map's last pixel (Kellan, 2026-10-29)
    const fh = this.h / 2, f = document.createElement('canvas');
    f.width = Math.round(w * d); f.height = Math.round(fh * d);
    const fg = f.getContext('2d'), frand = rng('dusk-foot');
    fg.setTransform(d, 0, 0, d, 0, 0); fg.fillStyle = '#eef0ff';
    for (let i = 0, n = Math.round(1100 * fh / sh); i < n; i++) {
      const x = frand(), y = frand(), k = frand(), r = k > 0.93 ? 1.9 : k > 0.7 ? 1.3 : 0.9;
      fg.globalAlpha = (r > 1.5 ? 1 : r > 1 ? 0.8 : 0.55) * (0.5 + 0.5 * frand());
      fg.fillRect(x * w, y * fh, r, r);
    }
    this.scroller.parentElement.style.setProperty('--map-foot-stars', `url(${f.toDataURL()})`);
  }

  // what shows behind the map while it dives into a level or pulls back from one
  backdrop(p) {
    if (!p || typeof p.skyTop !== 'number') return;
    this.backCol = rgba(seaColour(p));
    if (this.u >= 1) this.root.style.backgroundColor = this.backCol;
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
    // the canvas itself goes on the page: encoding it to a PNG data URL (as it
    // once did) cost seconds of main thread across a map's hundred ribbons
    const out = { canvas: c, used: false, w, h };
    this.ribbons.set(key, out);
    return out;
  }

  // Billows ({ rb: a ribbon, x, z: its centre }) drawn in order into canvases of
  // at most TILE px tall, each where the billows would have stood one by one
  // (the same whole-px corners as place()), so the veil looks as it did. Only
  // the screen's width is kept: these never move, and the world is rebuilt
  // when the width changes (map.js's layout key).
  flatten(billows, TILE = 2048) {
    if (!billows.length) return [];
    const at = billows.map((b) => ({ ...b, left: +(b.x - b.rb.w * 0.5).toFixed(0), top: +(b.z - b.rb.h * 0.5).toFixed(0) }));
    const half = Math.ceil(this.w / 2) + 8;
    const x0 = Math.max(-half, Math.min(...at.map((b) => b.left))), x1 = Math.min(half, Math.max(...at.map((b) => b.left + b.rb.w)));
    const y0 = Math.min(...at.map((b) => b.top)), y1 = Math.max(...at.map((b) => b.top + b.rb.h));
    const out = [];
    for (let ty = y0; ty < y1; ty += TILE) {
      const h = Math.min(TILE, y1 - ty), c = document.createElement('canvas');
      c.width = x1 - x0; c.height = h;
      c.setAttribute('aria-hidden', 'true');
      const g = c.getContext('2d');
      for (const b of at) if (b.top < ty + h && b.top + b.rb.h > ty && b.left < x1 && b.left + b.rb.w > x0) g.drawImage(b.rb.canvas, b.left - x0, b.top - ty);
      out.push({ el: c, x: x0, z: ty, w: x1 - x0, h });
    }
    return out;
  }

  // a peak's box on the page: the sprite, and the mist band across its cut
  box(r, key, x, z) {
    const s = this.sprite(r, key);
    if (!s) return null;
    const top = z - s.h * s.ay, left = x - s.w * s.ax;
    const cut = top + s.h * (1 - 0.5 * 0.55), bandH = Math.max(70, s.h * 0.5);
    return { key, x, z, side: Math.sign(x), left, right: left + s.w, top, art: top + s.h * 0.8, bottom: Math.max(top + s.h, cut + bandH / 2) };
  }
  // where a peak fits in its chapter: at the edge on whichever side is free,
  // its whole box (and its mist) inside the chapter, 40 px off the trail, clear
  // of every stone, label and the chapter's name, not over another peak; of
  // the places that fit, the one furthest from the peaks already there, so a
  // chapter's five spread along its length
  fit(r, key, placed) {
    const s = this.sprite(r, key);
    if (!s) return null;
    const model = this.model, W2 = this.w / 2;
    const stones = (model.stones ?? []).filter((n) => n.z > r.top - 80 && n.z < r.bottom + 80);
    let best = null, bestScore = -1;
    for (let z = r.labelZ + 60; z <= r.bottom; z += 10) {
      for (const sd of [1, -1]) {
        const x = sd * (key.startsWith('far') ? W2 - 40 : W2 - s.w * 0.12);
        const b = this.box(r, key, x, z);
        if (b.top < r.top + 8 || b.bottom > r.bottom - 8) continue;
        if (b.top < r.labelZ + 50) continue;   // the chapter's name
        const inner = sd > 0 ? b.left : b.right;
        let ok = true;
        for (let zz = b.top; zz <= b.art && ok; zz += 10) if (sd * (inner - model.trailX(zz)) < 40) ok = false;
        for (const n of stones) {
          if (!ok) break;
          const lx0 = n.lbl > 0 ? n.x + 28 : n.x - 148, rects = [[n.x - 40, n.x + 40, n.z - 44, n.z + 44], [lx0, lx0 + 120, n.z - 30, n.z + 30]];
          for (const [x0, x1, z0, z1] of rects) if (b.left < x1 && b.right > x0 && b.top < z1 && b.art > z0) ok = false;
        }
        for (const p of placed) if (ok && p && p.side === sd && b.top < p.art + 16 && b.art > p.top - 16) ok = false;
        if (!ok) continue;
        let score = Infinity;
        for (const p of placed) if (p) score = Math.min(score, Math.abs(z - p.z) * (p.side === sd ? 1 : 1.5));
        if (score > bestScore) { best = b; bestScore = score; }
      }
    }
    return best;
  }

  buildChunk(r) {
    const model = this.model, rand = rng(r.name + 'm');
    const mist = mistColour(r.base);
    const chunk = { r, els: [] };
    const W2 = this.w / 2;
    const FADE = 0.5;
    const place = (layer, el, x, z, w, h, ax, ay, cls) => {
      el.className = `mw-spr ${cls}`;
      el.style.width = `${w}px`; el.style.height = `${h}px`;
      el.style.transform = `translate(${(x - w * ax).toFixed(0)}px, ${(z - h * ay).toFixed(0)}px)`;
      this.layers[layer].appendChild(el); chunk.els.push(el);
      return el;
    };
    // the mist holds still: ~100 drifting ribbons cost a style pass and a layer each, every frame
    // of a scroll. (Two draws kept so the scenery's random stream, and its layout, is unchanged.)
    const drift = (el) => { rand(); rand(); return el; };
    const band = (layer, x, z, w, h, alpha, cls, seed) => {
      const rb = this.ribbon(mist, seed, Math.round(w), Math.round(h), alpha);
      // a ribbon's canvas goes up once; the same ribbon again is a quick copy of it
      let el = rb.canvas;
      if (rb.used) { el = document.createElement('canvas'); el.width = rb.w; el.height = rb.h; el.getContext('2d').drawImage(rb.canvas, 0, 0); }
      rb.used = true;
      el.setAttribute('aria-hidden', 'true');
      return drift(place(layer, el, x, z, rb.w, rb.h, 0.5, 0.5, `mist ${cls}`));
    };
    // a mountain top, its base faded out, and the densest mist across the cut
    const peak = (layer, x, z, key, cls = '') => {
      const s = this.sprite(r, key);
      if (!s) return null;
      const el = document.createElement('div');
      el.style.backgroundImage = `url(${s.file})`;
      el.style.backgroundSize = `${s.aw}px ${s.ah}px`;
      el.style.backgroundPosition = `${-s.x}px ${-s.y}px`;
      el.dataset.key = key;
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
    if (r.bank) {
      // under the mist (a chapter not yet reached, or lifting now): as it was
      if (!r.folded) peak('far', -side * (W2 - 40), zs - 120, 'far3', 'distant');
      if (!r.folded && r.index % 3 !== 2 && r.bottom - r.labelZ > 800) {
        const z = Math.min(r.bottom - 160, r.labelZ + 700);
        const x2 = model.trailX(z), sd = Math.abs(x2) > 30 ? -Math.sign(x2) : -side;
        const lf = this.sprite(r, r.index % 2 ? 'lf2' : 'lf1');
        if (lf) peak('near', sd * (W2 - lf.w * 0.12), z, r.index % 2 ? 'lf2' : 'lf1');
        peak('far', -sd * (W2 - 40), z - 140, 'far4', 'distant');
      }
    } else {
      // a reached chapter shows its whole range: the summit and the far peak
      // where they always stood, then both landforms and the second far peak
      // set along the chapter where they fit (scenery() below)
      peak('far', -side * (W2 - 40), zs - 120, 'far3', 'distant');
      if (sig) chunk.placed = [this.box(r, 'sig', side * (W2 - sig.w * 0.22), zs), this.box(r, 'far3', -side * (W2 - 40), zs - 120)];
      for (const [key, layer, cls] of [['lf1', 'near', ''], ['lf2', 'near', ''], ['far4', 'far', 'distant']]) {
        const at = this.fit(r, key, chunk.placed ?? []);
        if (!at) continue;
        peak(layer, at.x, at.z, key, cls);
        (chunk.placed ??= []).push(at);
      }
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
      // ~150 billows per chapter. Only a chapter lifting now (setPart) needs them
      // apart, each to drift off on its own; every other veil is the same
      // billows drawn once into a few tall canvases (issue #2: a canvas each was
      // 2,063 native layers on a new save, and the app froze for seconds
      // rehanging them as a level started)
      const billows = [];
      for (let z = r.top + 10; z < r.bottom + 40; z += 58) {
        for (let x = -420; x <= 420; x += 150 + rand() * 50) {
          const bx = x + (rand() - 0.5) * 50, bz = z + (rand() - 0.5) * 30, bw = 280 * (0.8 + rand() * 0.5), seed = Math.floor(rand() * 8);
          if (r.parting) {
            const img = band('near', bx, bz, bw, 80, 0.85, 'veil', seed);
            veil.kids.push({ el: img, base: img.style.transform, x, seed: rand() });
          } else {
            drift(null); rand();   // the same draws as a lone billow, so the scenery after it is unchanged
            billows.push({ rb: this.ribbon(mist, seed, Math.round(bw), 80, 0.85), x: bx, z: bz });
          }
        }
      }
      for (const t of this.flatten(billows)) {
        place('near', t.el, t.x, t.z, t.w, t.h, 0, 0, 'mist veil');
        veil.kids.push({ el: t.el, base: t.el.style.transform, x: 0, seed: 0.5 });   // were it ever lifted: as one
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

  // u: the title pan, 0 (stars) .. 1 (the map at its top). The map's own
  // scroll needs nothing from here.
  setView(u) {
    u = Math.min(1, Math.max(0, u));
    if (u === this.u) return;
    const was = this.u;
    this.u = u;
    if (u >= 1) {
      if (was < 1) { this.sky.style.display = 'none'; this.root.style.backgroundColor = this.backCol ?? this.firstSea ?? NIGHT; }
      return;
    }
    if (was >= 1 || was < 0) { this.sky.style.display = ''; this.root.style.backgroundColor = NIGHT; }
    const { h } = this;
    const horizon = h + DAWN - h * u;   // as the map's page slides up (main.js setScroll)
    this.sky.style.transform = `translate3d(0, ${(horizon - this.Hs).toFixed(1)}px, 0)`;
    for (const L of this.stars) L.c.style.transform = `translate3d(0, ${(h * u * (1 - L.rate)).toFixed(1)}px, 0)`;
  }
}

export const paletteByName = (name) => PALETTES.find((p) => p.name === name);
