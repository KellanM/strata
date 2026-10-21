// The cave wall: a heightfield of stone voxels, five painted panels, and the
// timed changes painted into them (mist swelling, cracks, stone closing over
// the fallen stars). Each voxel carries up to three states and switches
// between them at fixed times, so the whole wall is a pure function of t.
import * as THREE from 'three';

export const PANELS = 5, PITCH = 46, PX0 = 8, PY0 = 24, PW = 36, PH = 56;
export const W = PX0 * 2 + PITCH * (PANELS - 1) + PW;   // 236 columns
export const H = 104;
export const NONE = 1e6;   // "this event never happens"

export const wx = (i, lx) => PX0 + i * PITCH + lx;
export const wy = (ly) => PY0 + ly;
export const panelCenter = (i) => ({ x: PX0 + i * PITCH + (PW - 1) / 2, y: PY0 + (PH - 1) / 2 });

// ---------------------------------------------------------------- noise
export function hash2(x, y, s = 0) {
  let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(s | 0, 1442695041)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}
function vnoise(x, y, s) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash2(xi, yi, s), b = hash2(xi + 1, yi, s), c = hash2(xi, yi + 1, s), d = hash2(xi + 1, yi + 1, s);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
export function fbm(x, y, s = 0, oct = 4) {
  let f = 0, a = 0.5, n = 0;
  for (let i = 0; i < oct; i++) { f += a * vnoise(x, y, s + i * 17); n += a; x *= 2.03; y *= 2.03; a *= 0.5; }
  return f / n;
}
export function rng(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const smooth = (a, b, v) => { const x = clamp((v - a) / (b - a)); return x * x * (3 - 2 * x); };

// ---------------------------------------------------------------- pigments
// Earth pigments of real cave painting, plus gold for the sky's lights.
export const PIG = {
  stone: 0, ochre: 1, red: 2, rust: 3, charcoal: 4, grey: 5, greyDark: 6, gold: 7,
  ghost: 8, crack: 9, s1: 10, s2: 11, s3: 12, void: 13, wash: 14, goldFleck: 15, clay: 16,
};
const PIG_HEX = [
  0, 0xc8923f, 0x8a2f1c, 0xae4f28, 0x241e1b, 0x75726f, 0x4c4846, 0xf0c050,
  0x7a6a5a, 0x120e0c, 0xa44a2a, 0xd09a48, 0x2e2622, 0xd2d2cf, 0x1c1816, 0xb78a48, 0xb9b5ae,
];
const METAL = new Float32Array(PIG_HEX.length); METAL[PIG.gold] = 1; METAL[PIG.goldFleck] = 0.35;
const PIG_LIN = PIG_HEX.map((h) => new THREE.Color(h));

// ---------------------------------------------------------------- the grid
const N = W * H;
const idx = (x, y) => y * W + x;
const inside = (x, y) => x >= 0 && y >= 0 && x < W && y < H;

export class Mural {
  constructor() {
    this.z = new Float32Array(N);
    this.p0 = new Int8Array(N); this.v0 = new Float32Array(N);
    this.p1 = new Int8Array(N).fill(-1); this.v1 = new Float32Array(N); this.t1 = new Float32Array(N).fill(NONE);
    this.dz1 = new Float32Array(N); this.e1 = new Float32Array(N);
    this.p2 = new Int8Array(N).fill(-1); this.v2 = new Float32Array(N); this.t2 = new Float32Array(N).fill(NONE);
    this.dz2 = new Float32Array(N);
    this.relief();
  }

  // a rough wall; the painted stretches are the smoother ones the painters chose,
  // with ribs of rock between them and an overhang above and a ledge below
  relief() {
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      let z = (fbm(x * 0.055, y * 0.055, 3) - 0.5) * 2.4 + (fbm(x * 0.22, y * 0.22, 7) - 0.5) * 0.9 + (hash2(x, y, 9) - 0.5) * 0.42;
      const d = this.panelDist(x, y);
      z *= 0.6 + 0.4 * smooth(0, 5, d);
      z += smooth(1, 7, d) * (1.1 + 1.8 * fbm(x * 0.09, y * 0.09, 21));
      this.z[idx(x, y)] = z;
    }
  }
  panelDist(x, y) {
    let best = 99;
    for (let i = 0; i < PANELS; i++) {
      const x0 = PX0 + i * PITCH, x1 = x0 + PW - 1;
      const dx = Math.max(x0 - x, x - x1, 0), dy = Math.max(PY0 - y, y - (PY0 + PH - 1), 0);
      best = Math.min(best, Math.hypot(dx, dy * 0.8));
    }
    return best;
  }
  zAt(x, y) { x = Math.round(x); y = Math.round(y); return inside(x, y) ? this.z[idx(x, y)] : 0; }

  // pigment wears unevenly: most cells well covered, some rubbed thin
  wear(x, y, pig) {
    if (pig === PIG.gold) return 0.94 + 0.06 * hash2(x, y, 31);
    const h = hash2(x, y, 33);
    let c = 0.72 + 0.26 * hash2(x, y, 32);
    if (h < 0.1) c *= 0.5;
    return c * (0.75 + 0.35 * fbm(x * 0.3, y * 0.3, 34));
  }
  set(x, y, pig, cov) {
    if (!inside(x, y)) return;
    const i = idx(x, y);
    this.p0[i] = pig; this.v0[i] = cov ?? this.wear(x, y, pig);
  }
  ev1(x, y, pig, t, { cov, dz = 0, e = 0 } = {}) {
    if (!inside(x, y)) return;
    const i = idx(x, y);
    this.p1[i] = pig; this.v1[i] = cov ?? this.wear(x, y, pig); this.t1[i] = t; this.dz1[i] = dz; this.e1[i] = e;
  }
  ev2(x, y, pig, t, { cov, dz = 0 } = {}) {
    if (!inside(x, y)) return;
    const i = idx(x, y);
    this.p2[i] = pig; this.v2[i] = cov ?? this.wear(x, y, pig); this.t2[i] = t; this.dz2[i] = dz;
  }
  pig0(x, y) { return inside(x, y) ? this.p0[idx(x, y)] : 0; }

  // ------------------------------------------------------------ colour
  stone(x, y, out) {
    const f = fbm(x * 0.08, y * 0.08, 41), g = fbm(x * 0.4, y * 0.4, 43);
    const l = 0.8 + 0.34 * f + 0.2 * (g - 0.5) + 0.14 * (hash2(x, y, 44) - 0.5);
    out.setHex(0xa08d74).multiplyScalar(l);
    // seams of cooler, greyer rock run through the warm limestone
    const cool = smooth(0.62, 0.8, fbm(x * 0.05 + 7, y * 0.12, 45));
    out.lerp(new THREE.Color(0x6c6a68).multiplyScalar(l), cool * 0.6);
    return out;
  }
  colour(x, y, pig, cov, out, base) {
    if (pig <= 0) return out.copy(base);
    const c = PIG_LIN[pig];
    const j = 0.9 + 0.2 * hash2(x, y, pig + 50);
    return out.copy(base).lerp(tmp.copy(c).multiplyScalar(j), cov);
  }

  // ------------------------------------------------------------ voxels
  // Packs the wall into instance attributes, in column chunks so offscreen
  // panels are culled.
  build(chunkCols = 24) {
    const chunks = [];
    const base = new THREE.Color(), c = new THREE.Color();
    for (let x0 = 0; x0 < W; x0 += chunkCols) {
      const x1 = Math.min(W, x0 + chunkCols), n = (x1 - x0) * H;
      const aPos = new Float32Array(n * 4), aC0 = new Float32Array(n * 4), aC1 = new Float32Array(n * 4), aC2 = new Float32Array(n * 4);
      const aT = new Float32Array(n * 4), aE = new Float32Array(n * 2);
      let k = 0, zmin = 1e9, zmax = -1e9;
      for (let y = 0; y < H; y++) for (let x = x0; x < x1; x++, k++) {
        const i = idx(x, y), z = this.z[i];
        zmin = Math.min(zmin, z); zmax = Math.max(zmax, z);
        // contact shadow where higher neighbours crowd in
        let occ = 0;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
          if (!dx && !dy) continue;
          occ += Math.max(0, this.zAt(x + dx, y + dy) - z) * (dx && dy ? 0.1 : 0.16);
        }
        const ao = 1 - clamp(occ, 0, 0.55);
        this.stone(x, y, base);
        aPos.set([x, y, z, hash2(x, y, 77)], k * 4);
        const put = (arr, pig, cov) => {
          if (pig < 0) { arr.set([0, 0, 0, 0], k * 4); return; }
          this.colour(x, y, pig, cov, c, base).multiplyScalar(ao);
          arr.set([c.r, c.g, c.b, METAL[Math.max(pig, 0)]], k * 4);
        };
        put(aC0, this.p0[i], this.v0[i]);
        // an absent event keeps the previous state's colour
        if (this.p1[i] >= 0) put(aC1, this.p1[i], this.v1[i]); else aC1.set(aC0.subarray(k * 4, k * 4 + 4), k * 4);
        if (this.p2[i] >= 0) put(aC2, this.p2[i], this.v2[i]); else aC2.set(aC1.subarray(k * 4, k * 4 + 4), k * 4);
        aT.set([this.p1[i] >= 0 ? this.t1[i] : NONE, this.p2[i] >= 0 ? this.t2[i] : NONE, this.dz1[i], this.dz2[i]], k * 4);
        aE[k * 2] = this.e1[i];
      }
      chunks.push({ x0, x1, n, aPos, aC0, aC1, aC2, aT, aE, zmin, zmax });
    }
    return chunks;
  }
}
const tmp = new THREE.Color();

// ---------------------------------------------------------------- drawing kit
// Panel-local painting helpers: lx, ly from the panel's bottom-left.
class Brush {
  constructor(m, i) { this.m = m; this.i = i; }
  X(lx) { return wx(this.i, lx); }
  Y(ly) { return wy(ly); }
  dot(lx, ly, pig, cov) { this.m.set(this.X(lx), this.Y(ly), pig, cov); }
  disc(cx, cy, r, pig) {
    for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++)
      for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++)
        if ((x - cx) ** 2 + (y - cy) ** 2 <= r * r) this.dot(x, y, pig);
  }
  ring(cx, cy, r, pig, every = 1) {
    const n = Math.round(Math.PI * 2 * r);
    for (let k = 0; k < n; k += every) {
      const a = (k / n) * Math.PI * 2;
      this.dot(Math.round(cx + Math.cos(a) * r), Math.round(cy + Math.sin(a) * r), pig);
    }
  }
  star(lx, ly, big) {
    this.dot(lx, ly, PIG.gold);
    if (big) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) this.dot(lx + dx, ly + dy, PIG.gold);
  }
  sprite(lx, ly, rows, pig) {   // rows top to bottom, 'X' = paint
    rows.forEach((row, r) => [...row].forEach((ch, c) => { if (ch === 'X') this.dot(lx + c, ly + rows.length - 1 - r, pig); }));
  }
  // a band of land: ochre crust over earth red, outlined in charcoal
  land(x0, x1, topAt, seed, { outline = true } = {}) {
    for (let lx = x0; lx <= x1; lx++) {
      const top = topAt(lx);
      const edge = Math.min(lx - x0, x1 - lx);
      const bottom = Math.round(2.2 * fbm(lx * 0.3, seed, 9) + (edge < 2 ? 2 - edge : 0) * 1.5);
      for (let ly = bottom; ly <= top; ly++) {
        const depth = top - ly;
        let pig = depth < 2 ? PIG.ochre : depth < 5 ? PIG.rust : PIG.red;
        if (hash2(lx, ly, seed) < 0.06) pig = PIG.ochre;
        this.dot(lx, ly, pig);
      }
      if (outline) this.dot(lx, top + 1, PIG.charcoal);
    }
  }
}

const FIG_UP = ['X...X', 'X.X.X', '.XXX.', '..X..', '.X.X.', '.X.X.'];
const FIG_STAND = ['.X.', 'XXX', '.X.', '.X.', 'X.X', 'X.X'];
const FIG_POINT = ['....X', '.X.X.', 'XXX..', '.X...', '.X...', 'X.X..'];
const FIG_RUN = ['.X..', 'XXX.', '.X.X', '.XX.', 'X..X', 'X...'];


// The Gloam as the painters drew it: rounded billows and fingers of dots,
// pale clay inside, a grey rim. discs: [x, y, r, order 0..1]. With t0/t1 the
// mist is painted in over time (by each disc's order), else it is there already.
function gloam(b, discs, { t0, t1 } = {}) {
  const inside = (lx, ly) => discs.some(([x, y, r]) => (lx - x) ** 2 + (ly - y) ** 2 <= r * r);
  for (let ly = 0; ly < PH; ly++) for (let lx = 0; lx < PW; lx++) {
    let order = 2;
    for (const [x, y, r, o] of discs) if ((lx - x) ** 2 + (ly - y) ** 2 <= r * r) order = Math.min(order, o);
    if (order > 1.5) continue;
    order = Math.max(order, Math.min(1, ly / 34));   // it rises: lower cells first
    const rim = !inside(lx - 1, ly) || !inside(lx + 1, ly) || !inside(lx, ly + 1) || !inside(lx, ly - 1);
    if (rim && ly > 0 && hash2(lx, ly, 208) < 0.12) continue;   // a worn, broken rim here and there
    const pig = rim ? PIG.grey : PIG.clay, cov = rim ? 0.9 : 0.86 + 0.14 * hash2(lx, ly, 207);
    if (t0 === undefined) b.dot(lx, ly, pig, cov);
    else b.m.ev1(b.X(lx), b.Y(ly), pig, t0 + (t1 - t0) * clamp(order + (hash2(lx, ly, 206) - 0.5) * 0.04), { cov });
  }
}
function billows(seed, x0, x1, base, rMin, rMax) {
  const r = rng(seed), out = [];
  for (let x = x0; x <= x1; x += rMin + r() * (rMax - rMin) * 0.8) {
    const rad = rMin + r() * (rMax - rMin);
    out.push([x, base + r() * 3 - 1, rad, 0]);
  }
  return out;
}
function finger(x, y, dx, dy, n, r0, o0 = 0.35, curl = 0.3) {
  // a chain of shrinking dots reaching up and curling
  const out = [];
  let a = Math.atan2(dy, dx), px = x, py = y, r = r0;
  for (let i = 0; i < n; i++) {
    out.push([px, py, r, o0 + (1 - o0) * (i / n)]);
    a += curl * Math.sin(i * 0.8);
    px += Math.cos(a) * r * 1.35; py += Math.sin(a) * r * 1.35;
    r = Math.max(0.75, r * 0.86);
  }
  return out;
}

// ---------------------------------------------------------------- the five panels
export function paint(m) {
  const P = [0, 1, 2, 3, 4].map((i) => new Brush(m, i));
  const info = {};

  // 1. Long ago: a full sky, a gold moon, many stars; tiny figures beneath
  {
    const b = P[0];
    const top = (lx) => Math.round(7 + 2.2 * Math.sin(lx * 0.21 + 0.6) + 2.5 * fbm(lx * 0.12, 0, 101));
    b.land(0, 35, top, 102);
    b.disc(24, 42, 5.2, PIG.gold);
    for (const [x, y] of [[23, 43], [26, 40], [22, 40]]) b.dot(x, y, PIG.ochre);   // the moon's seas
    b.ring(24, 42, 7.6, PIG.ochre, 3);
    const stars = [[4, 51, 1], [9, 45, 0], [14, 53, 1], [17, 39, 0], [6, 34, 1], [31, 53, 0], [33, 35, 1], [12, 29, 0], [20, 51, 0], [2, 41, 0], [28, 30, 0], [16, 46, 1], [35, 47, 0], [8, 23, 0], [22, 27, 1], [30, 22, 0], [3, 27, 0], [26, 54, 1]];
    for (const [x, y, big] of stars) b.star(x, y, big);
    for (const [x, y] of [[11, 36], [19, 33], [33, 27], [5, 47], [25, 23]]) b.dot(x, y, PIG.ochre, 0.6);
    b.sprite(5, top(7) + 2, FIG_UP, PIG.charcoal);
    b.sprite(13, top(14) + 2, FIG_UP, PIG.red);
    b.sprite(20, top(21) + 2, FIG_STAND, PIG.charcoal);
    b.sprite(28, top(29) + 2, FIG_UP, PIG.charcoal);
    info.p1stars = stars.map(([x, y]) => ({ x: wx(0, x), y: wy(y) })).concat([{ x: wx(0, 24), y: wy(42) }]);
  }

  // 2. The Gloam rises: painted grey mist swells up from below toward the sky
  {
    const b = P[1];
    const top = (lx) => Math.round(8 + 2 * Math.sin(lx * 0.25 + 2.0) + 2 * fbm(lx * 0.12, 0, 201));
    b.land(0, 35, top, 202);
    b.disc(9, 47, 4.2, PIG.gold);
    b.dot(8, 48, PIG.ochre); b.dot(10, 46, PIG.ochre);
    const stars = [[3, 40, 1], [16, 52, 1], [22, 44, 0], [27, 53, 1], [33, 46, 0], [30, 36, 1], [19, 35, 0], [6, 30, 0], [13, 41, 0], [24, 30, 0], [34, 28, 0]];
    for (const [x, y, big] of stars) b.star(x, y, big);
    b.sprite(4, top(5) + 2, FIG_POINT, PIG.charcoal);
    b.sprite(12, top(13) + 2, FIG_STAND, PIG.red);
    b.sprite(25, top(26) + 2, FIG_RUN, PIG.charcoal);
    // the mist: a swelling mass of billows, three fingers reaching up for the sky
    const discs = [
      ...billows(203, 1, 35, 4, 3.5, 6.5).map((d) => [d[0], d[1], d[2], 0]),
      ...billows(204, 3, 33, 10, 2.5, 4.5).map((d) => [d[0], d[1], d[2], 0.2]),
      ...finger(6, 13, 0.2, 1, 9, 2.6, 0.35, 0.35), ...finger(18, 15, -0.1, 1, 11, 3, 0.35, -0.3), ...finger(30, 13, -0.3, 1, 8, 2.4, 0.35, 0.4),
    ];
    gloam(b, discs, { t0: 8.6, t1: 11.9 });
  }

  // 3. It pulls them down: the sky is loose tiles (moon, stars) over faint
  // stains; the painted Gloam lies along the bottom, the real one rises from it
  {
    const b = P[2];
    const g3 = [...billows(301, 0, 36, 3, 4, 7), ...billows(302, 2, 34, 8.5, 2.5, 4.2)];
    gloam(b, g3);
    const gloamTop = (lx) => {
      let top = 0;
      for (const [x, y, r] of g3) if (Math.abs(lx - x) < r) top = Math.max(top, y + Math.sqrt(r * r - (lx - x) ** 2));
      return top;
    };
    // two figures half under the mist, looking up
    b.sprite(9, Math.round(gloamTop(11)) - 2, FIG_UP, PIG.charcoal);
    b.sprite(26, Math.round(gloamTop(27)) - 2, FIG_STAND, PIG.red);
    const PLUS = [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]];
    const disc = [];
    for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) if (dx * dx + dy * dy <= 4.4 * 4.4) disc.push([dx, dy]);
    const homes = [[4, 45], [10, 53], [13, 37], [31, 54], [33, 41], [27, 31]];
    info.gloamTop = (lx) => wy(gloamTop(lx));
    info.bodies = [
      ...homes.map(([x, y], j) => ({ kind: 'star', j, home: { x: wx(2, x), y: wy(y) }, cells: PLUS })),
      { kind: 'moon', j: 6, home: { x: wx(2, 21), y: wy(46) }, cells: disc },
    ];
    for (const body of info.bodies) for (const [dx, dy] of body.cells) {
      const x = body.home.x + dx, y = body.home.y + dy;
      m.set(x, y, PIG.ghost, 0.55 + 0.2 * hash2(x, y, 305));
    }
  }

  // 4. The impact: land, figures; then cracks, islands, and stone closing over each star
  {
    const b = P[3];
    const top = (lx) => Math.round(13 + 1.5 * Math.sin(lx * 0.3) + 1.5 * fbm(lx * 0.15, 0, 401));
    b.land(0, 35, top, 402);
    const figs = [[2, FIG_STAND, PIG.charcoal], [15, FIG_UP, PIG.charcoal], [21, FIG_STAND, PIG.red], [29, FIG_UP, PIG.charcoal]];
    // impacts left to right: star, star, moon, star, star (the moon in the middle)
    const impactsL = [4, 10, 18, 27, 32];
    const T = [19.35, 19.7, 20.65, 20.0, 19.5];   // star impacts in a scatter, the moon last
    info.impacts = impactsL.map((lx, k) => ({ x: wx(3, lx), y: wy(top(lx) + 1), t: T[k], moon: k === 2 }));
    const firstHit = Math.min(...T);
    for (const [lx, spr, pig] of figs) {
      const y0 = top(lx + 1) + 2;
      spr.forEach((row, r) => [...row].forEach((ch, c) => {
        if (ch !== 'X') return;
        const x = b.X(lx + c), y = b.Y(y0 + spr.length - 1 - r);
        m.set(x, y, pig);
        // the figures are gone: blown to ash and then to bare stone
        m.ev1(x, y, PIG.charcoal, firstHit + 0.15 + 0.05 * c, { cov: 0.35 });
        m.ev2(x, y, PIG.stone, firstHit + 0.9 + 0.3 * hash2(x, y, 403));
      }));
    }
    // islands: split along jagged cracks midway between impacts; their undersides erode away
    const splits = [14, 23];
    const crackX = splits.map((sx, k) => (ly) => sx + 1.6 * Math.sin(ly * 0.7 + k * 2) + (fbm(ly * 0.5, k, 404) - 0.5) * 2.2);
    const bounds = [-1, ...splits, 36];
    for (let lx = 0; lx < PW; lx++) {
      const tp = top(lx);
      for (let ly = 0; ly <= tp + 1; ly++) {
        const x = b.X(lx), y = b.Y(ly);
        // crack: nearest split line, and when the crack front passes
        let near = 99, ck = 0;
        crackX.forEach((f, k) => { const d = Math.abs(lx - f(ly)); if (d < near) { near = d; ck = k; } });
        const tCrack = [T[1], T[2]][ck] + 0.12 + (tp - ly) * 0.035;
        if (near < 0.75) {
          m.ev1(x, y, PIG.crack, tCrack, { cov: 0.95, dz: -0.7 });
          m.ev2(x, y, PIG.void, 21.5 + (tp - ly) * 0.05, { cov: 0.9, dz: -0.6 });
          continue;
        }
        if (m.pig0(x, y) === 0) continue;   // ragged edge of the land: bare stone stays bare
        // which island this column belongs to, and how thick the island is here
        let seg = 0;
        while (seg < splits.length && lx > crackX[seg](ly)) seg++;
        const a = bounds[seg], c = bounds[seg + 1], mid = (a + c) / 2, half = (c - a) / 2;
        const q = clamp(1 - Math.abs(lx - mid) / half);
        const thick = 1.5 + 10 * Math.pow(q, 1.6) + 1.2 * fbm(lx * 0.4, ly * 0.1, 405);
        if (tp - ly > thick || near < 1.9) {
          // the land beneath falls away into the mist, ragged and thinning toward the bottom
          const cov = (0.55 + 0.4 * fbm(lx * 0.35, ly * 0.35, 410)) * (0.45 + 0.55 * smooth(0, 5, ly));
          m.ev1(x, y, PIG.void, 21.0 + (1 - ly / tp) * 0.4 + (near < 1.9 ? 0 : 0.6) + 0.25 * hash2(x, y, 406), { cov, dz: -0.6 });
        }
      }
    }
    // stone closes over each star: layer on layer from the ground up, a low
    // banded dome outlined in charcoal, the gold last to go under
    for (const imp of info.impacts) {
      const R = imp.moon ? 4.6 : 3.2, Hh = imp.moon ? 4.2 : 3.1, tClose = imp.t + (imp.moon ? 1.6 : 1.9);
      for (let dy = -1; dy <= Math.ceil(Hh) + 1; dy++) for (let dx = -Math.ceil(R) - 1; dx <= Math.ceil(R) + 1; dx++) {
        const x = imp.x + dx, y = imp.y + dy;
        const d = Math.hypot(dx / R, Math.max(dy, 0) / Hh);
        // the star lies sunk in the ground where it struck, a bead of hot gold
        const bead = imp.moon ? (Math.abs(dx) <= 2 && dy >= -2 && dy <= 0 && !(Math.abs(dx) === 2 && dy === -2)) : (Math.abs(dx) <= 1 && dy >= -1 && dy <= 0 && !(dx && dy));
        if (bead) m.ev1(x, y, PIG.gold, imp.t, { cov: 1, dz: -0.3, e: imp.moon ? 1.4 : 1.0 });
        else if (d <= 1.3 && dy >= -1 && dy <= 2) m.ev1(x, y, PIG.charcoal, imp.t + 0.05, { cov: 0.5 });   // scorch
        if (dy < 0) { if (bead) m.ev2(x, y, PIG.s3, tClose - 0.2, { cov: 0.85, dz: 0.1 }); continue; }
        const rim = Math.hypot(dx / (R + 1), dy / (Hh + 1));
        if (d > 1 && rim <= 1) { m.ev2(x, y, PIG.charcoal, tClose + dy * 0.36 + 0.1, { cov: 0.9, dz: 0.25 }); continue; }
        if (d > 1) continue;
        const pig = (d < 0.22 && dy === 0) ? PIG.goldFleck : [PIG.s1, PIG.s2, PIG.s3, PIG.s2, PIG.s1][Math.min(4, dy)];
        m.ev2(x, y, pig, tClose + dy * 0.36 + (d < 0.3 ? 0.3 : 0), { cov: 0.95, dz: 0.3 + 0.8 * (1 - d) });
      }
    }
    // the long night comes down over the sky
    for (let ly = 20; ly < PH; ly++) for (let lx = 0; lx < PW; lx++) {
      const x = b.X(lx), y = b.Y(ly);
      if (m.t1[idx(x, y)] < NONE) continue;
      const n = fbm(lx * 0.25, ly * 0.25, 408);
      if (n < 0.38) continue;
      m.ev1(x, y, PIG.wash, 21.4 + (PH - ly) * 0.045 + 0.4 * hash2(x, y, 409), { cov: 0.25 + 0.35 * n });
    }
  }

  // 5. The long night: islands in a sea of painted mist, no stars, no figures,
  // each island with its banded stone; one small lantern remains
  {
    const b = P[4];
    for (let ly = 0; ly < PH; ly++) for (let lx = 0; lx < PW; lx++) {
      const n = fbm(lx * 0.22, ly * 0.22, 501);
      if (ly > 24 && n > 0.36) b.dot(lx, ly, PIG.wash, 0.2 + 0.4 * n);
    }
    // painted mist (the same pale clay as the Gloam's), below and between the islands
    for (let ly = 0; ly < 26; ly++) for (let lx = 0; lx < PW; lx++) {
      const band = Math.sin(ly * 0.5 + Math.sin(lx * 0.16) * 1.4);
      const n = fbm(lx * 0.3, ly * 0.3, 502);
      if (band > 0.1 && n > 0.42) b.dot(lx, ly, PIG.void, (0.35 + 0.5 * n) * (0.4 + 0.6 * smooth(0, 6, ly)));
    }
    const isl = [
      { a: 0, c: 9, top: 28, th: 6 }, { a: 11, c: 26, top: 19, th: 10 }, { a: 28, c: 35, top: 31, th: 5 }, { a: 3, c: 9, top: 43, th: 3 }, { a: 27, c: 32, top: 46, th: 3 },
    ];
    for (const s of isl) {
      const mid = (s.a + s.c) / 2, half = (s.c - s.a) / 2;
      for (let lx = s.a; lx <= s.c; lx++) {
        const q = Math.max(0, 1 - Math.abs(lx - mid) / (half + 0.6));
        const th = Math.max(1, Math.round(1 + s.th * Math.pow(q, 1.6) + 0.6 * fbm(lx * 0.5, s.top, 503)));
        for (let k = 0; k <= th; k++) b.dot(lx, s.top - k, k < 1 ? PIG.ochre : k < 3 ? PIG.rust : PIG.red);
      }
    }
    // a low banded dome on each island: a star under stone
    const mound = (cx, base, R, Hh) => {
      for (let dy = 0; dy <= Hh + 1; dy++) for (let dx = -R - 1; dx <= R + 1; dx++) {
        const d = Math.hypot(dx / R, dy / Hh), rim = Math.hypot(dx / (R + 1), dy / (Hh + 1));
        if (d > 1) { if (rim <= 1) b.dot(cx + dx, base + dy, PIG.charcoal, 0.9); continue; }
        b.dot(cx + dx, base + dy, (d < 0.22 && dy === 0) ? PIG.goldFleck : [PIG.s1, PIG.s2, PIG.s3, PIG.s2][Math.min(3, dy)], 0.92);
        b.m.z[idx(b.X(cx + dx), b.Y(base + dy))] += 0.3 + 0.8 * (1 - d);
      }
    };
    mound(4, 29, 3, 2); mound(14, 20, 2, 2); mound(31, 32, 2, 2); mound(6, 44, 2, 1);
    // the lantern: a charcoal frame and handle round a gold flame, its light drawn as dashes
    const LX = 21, LY = 20;
    b.sprite(LX - 2, LY, ['..X..', '.X.X.', 'XXXXX', 'X...X', 'X...X', 'X...X', 'XXXXX'], PIG.charcoal);
    for (const [dx, dy] of [[0, 2], [0, 3], [-1, 2], [1, 2], [0, 4]]) b.dot(LX + dx, LY + dy, PIG.gold);
    for (const [dx, dy] of [[-4, 3], [4, 3], [-4, 5], [4, 5], [-3, 7], [3, 7], [0, 9]]) b.dot(LX + dx, LY + dy, PIG.ochre, 0.75);
    info.lantern = { x: wx(4, LX), y: wy(LY + 3) };
    info.p5top = isl.map((s) => ({ x0: wx(4, s.a), x1: wx(4, s.c), y: wy(s.top) }));
  }
  return info;
}
