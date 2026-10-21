// The cave wall: rough voxel stone carrying one continuous painted frieze, read
// left to right like the Bayeux Tapestry or an emaki handscroll. One unbroken
// ground line runs the whole way; the same three figures and the same moon recur
// as time passes; a tree, the Gloam's own column of mist and bands of mist
// divide the scenes instead of frames; a sky band of stars runs along the top
// border and a band of strata (with the fossils the stone keeps) along the bottom.
// Each voxel carries up to three states and switches between them at fixed
// times (the Gloam rising, cracks, stone closing over the fallen stars), so the
// whole wall is a pure function of t.
import * as THREE from 'three';

export const W = 256, H = 108;
export const NONE = 1e6;   // "this event never happens"
export const FX0 = 4, FX1 = 251;               // the frieze's ends
export const BB0 = 15, BB1 = 23;               // bottom border (strata) lines
export const TB0 = 88, TB1 = 96;               // top border (sky band) lines
export const G0 = BB1 + 1;                     // the land's base
// scene centres: A long ago, B the Gloam rises, C it pulls them down, D the impact, E the long night
export const SC = [32, 80, 127, 174, 226];
export const XD0 = 153, XE0 = 197;             // where the land is broken: from D's first crack, and E

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
// rock plates: distance to the nearest and second-nearest jittered point
function worley(x, y, s) {
  const xi = Math.floor(x), yi = Math.floor(y);
  let f1 = 9, f2 = 9, id = 0, px = 0, py = 0;
  for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) {
    const cx = xi + i, cy = yi + j;
    const qx = cx + hash2(cx, cy, s), qy = cy + hash2(cx, cy, s + 1);
    const d = Math.hypot(x - qx, y - qy);
    if (d < f1) { f2 = f1; f1 = d; id = hash2(cx, cy, s + 2); px = qx; py = qy; } else if (d < f2) f2 = d;
  }
  return { f1, f2, id, px, py };
}
export function rng(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const smooth = (a, b, v) => { const x = clamp((v - a) / (b - a)); return x * x * (3 - 2 * x); };

// the one ground line, hummocked like the Bayeux Tapestry's
export const ground = (x) => Math.round(36 + 2.2 * Math.sin(x * 0.061 + 0.5) + 4.2 * (fbm(x * 0.05, 0, 11) - 0.5) + 0.9 * Math.abs(Math.sin(x * Math.PI / 7)));

// ---------------------------------------------------------------- pigments
export const PIG = {
  stone: 0, ochre: 1, red: 2, rust: 3, charcoal: 4, gloam: 5, rim: 6, gold: 7,
  ghost: 8, crack: 9, s1: 10, s2: 11, s3: 12, clay: 13, wash: 14, goldFleck: 15,
};
const PIG_HEX = [
  0, 0xc8923f, 0x8a2f1c, 0xae4f28, 0x241e1b, 0x26282f, 0xb9c4c4, 0xf0c050,
  0x7a6a5a, 0x120e0c, 0x8c867e, 0xcfc6b4, 0xb08a52, 0xd6cfc2, 0x1c1816, 0xb78a48,
];
const METAL = new Float32Array(PIG_HEX.length); METAL[PIG.gold] = 1; METAL[PIG.goldFleck] = 0.35;
const PIG_LIN = PIG_HEX.map((h) => new THREE.Color(h));

// ---------------------------------------------------------------- the grid
const N = W * H;
const idx = (x, y) => y * W + x;
const inside = (x, y) => x >= 0 && y >= 0 && x < W && y < H;
const inFrieze = (x, y) => x >= FX0 && x <= FX1 && y >= BB0 && y <= TB1;

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

  // Rough cave rock: fractured plates, each tilted its own way, seams between
  // them, pits, and big slow bulges. The frieze runs along the smoother stretch
  // the painters chose; above it an overhang, below it a ledge.
  relief() {
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const w = worley(x / 6.5, y / 5.5, 5);
      const tilt = ((hash2(w.id * 1e6, 1, 6) - 0.5) * (x / 6.5 - w.px) + (hash2(w.id * 1e6, 2, 6) - 0.5) * (y / 5.5 - w.py)) * 1.4;
      let plate = (w.id - 0.5) * 1.1 + tilt;
      if (w.f2 - w.f1 < 0.1) plate -= 0.6;   // a seam
      let z = (fbm(x * 0.045, y * 0.05, 3) - 0.5) * 2.6 + (fbm(x * 0.35, y * 0.35, 8) - 0.5) * 0.5 + (hash2(x, y, 9) - 0.5) * 0.1;
      if (hash2(x, y, 12) < 0.025) z -= 0.55;   // a pit
      const dy = y < BB0 ? BB0 - y : y > TB1 ? y - TB1 : 0, dx = x < FX0 ? FX0 - x : x > FX1 ? x - FX1 : 0;
      const d = Math.hypot(dx, dy);
      z += plate * (0.45 + 0.55 * smooth(0, 4, d));
      z += smooth(1, 8, d) * (1.0 + 1.8 * fbm(x * 0.08, y * 0.08, 21));
      this.z[idx(x, y)] = z;
    }
  }
  zAt(x, y) { x = Math.round(x); y = Math.round(y); return inside(x, y) ? this.z[idx(x, y)] : 0; }
  lift(x, y, dz) { if (inside(x, y)) this.z[idx(x, y)] += dz; }

  // pigment wears unevenly, and the frieze's two ends are worn away most
  wear(x, y, pig) {
    const ends = 0.35 + 0.65 * smooth(FX0, FX0 + 7, x) * smooth(FX1, FX1 - 7, x);
    if (pig === PIG.gold) return (0.94 + 0.06 * hash2(x, y, 31)) * ends;
    const h = hash2(x, y, 33);
    let c = 0.72 + 0.26 * hash2(x, y, 32);
    if (h < 0.1) c *= 0.5;
    return c * (0.75 + 0.35 * fbm(x * 0.3, y * 0.3, 34)) * ends;
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
  hasEv1(x, y) { return inside(x, y) && this.p1[idx(x, y)] >= 0; }

  // ------------------------------------------------------------ colour
  stone(x, y, out) {
    const f = fbm(x * 0.08, y * 0.08, 41), g = fbm(x * 0.4, y * 0.4, 43);
    const w = worley(x / 6.5, y / 5.5, 5);
    const l = 0.76 + 0.34 * f + 0.22 * (g - 0.5) + 0.04 * (hash2(x, y, 44) - 0.5) + 0.2 * (w.id - 0.5) - (w.f2 - w.f1 < 0.12 ? 0.18 : 0);
    out.setHex(0xa08d74).multiplyScalar(l);
    // seams of cooler, greyer rock run through the warm limestone
    const cool = smooth(0.6, 0.8, fbm(x * 0.05 + 7, y * 0.12, 45));
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
  // stretches are culled.
  build(chunkCols = 24) {
    const chunks = [];
    const base = new THREE.Color(), c = new THREE.Color();
    for (let x0 = 0; x0 < W; x0 += chunkCols) {
      const x1 = Math.min(W, x0 + chunkCols), n = (x1 - x0) * H;
      const aPos = new Float32Array(n * 4), aC0 = new Float32Array(n * 4), aC1 = new Float32Array(n * 4), aC2 = new Float32Array(n * 4);
      const aT = new Float32Array(n * 4), aE = new Float32Array(n * 3);
      let k = 0;
      for (let y = 0; y < H; y++) for (let x = x0; x < x1; x++, k++) {
        const i = idx(x, y), z = this.z[i];
        // contact shadow where higher neighbours crowd in; edges show only where the rock steps
        let occ = 0, step = 0;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
          if (!dx && !dy) continue;
          const zn = this.zAt(x + dx, y + dy);
          occ += Math.max(0, zn - z) * (dx && dy ? 0.1 : 0.16);
          if (!dx || !dy) step = Math.max(step, Math.abs(zn - z));
        }
        const ao = 1 - clamp(occ, 0, 0.55);
        this.stone(x, y, base);
        aPos.set([x, y, z, hash2(x, y, 77)], k * 4);
        const put = (arr, pig, cov) => {
          this.colour(x, y, pig, cov, c, base).multiplyScalar(ao);
          arr.set([c.r, c.g, c.b, METAL[Math.max(pig, 0)]], k * 4);
        };
        put(aC0, this.p0[i], this.v0[i]);
        // an absent event keeps the previous state's colour
        if (this.p1[i] >= 0) put(aC1, this.p1[i], this.v1[i]); else aC1.set(aC0.subarray(k * 4, k * 4 + 4), k * 4);
        if (this.p2[i] >= 0) put(aC2, this.p2[i], this.v2[i]); else aC2.set(aC1.subarray(k * 4, k * 4 + 4), k * 4);
        aT.set([this.p1[i] >= 0 ? this.t1[i] : NONE, this.p2[i] >= 0 ? this.t2[i] : NONE, this.dz1[i], this.dz2[i]], k * 4);
        aE[k * 3] = this.e1[i];
        aE[k * 3 + 2] = clamp(0.12 + step * 1.1, 0.12, 1);
      }
      chunks.push({ x0, x1, n, aPos, aC0, aC1, aC2, aT, aE });
    }
    return chunks;
  }
}
const tmp = new THREE.Color();

// ---------------------------------------------------------------- drawing kit
class Brush {
  constructor(m) { this.m = m; this.lift = 0; }
  dot(x, y, pig, cov) { x = Math.round(x); y = Math.round(y); this.m.set(x, y, pig, cov); if (this.lift) this.m.lift(x, y, this.lift); }
  disc(cx, cy, r, pig) {
    for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++)
      for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++)
        if ((x - cx) ** 2 + (y - cy) ** 2 <= r * r) this.dot(x, y, pig);
  }
  star(x, y, big) {
    this.dot(x, y, PIG.gold);
    if (big) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) this.dot(x + dx, y + dy, PIG.gold);
  }
  sprite(x, y, rows, pig, flip = false) {   // rows top to bottom, 'X' = paint; (x, y) its bottom-left
    rows.forEach((row, r) => [...row].forEach((ch, c) => {
      if (ch === 'X') this.dot(x + (flip ? row.length - 1 - c : c), y + rows.length - 1 - r, pig);
    }));
  }
  line(x0, y0, x1, y1, pig, cov) {
    const n = Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)));
    for (let i = 0; i <= n; i++) this.dot(x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n, pig, cov);
  }
}

// the recurring trio: a tall one, a red one, a child
const TALL_WALK = ['.X..', 'XXX.', '.X.X', '.X..', 'X.X.', 'X..X'];
const UP = ['X...X', 'X.X.X', '.XXX.', '..X..', '.X.X.', '.X.X.'];
const POINT = ['....X', '.X.X.', 'XXX..', '.X...', '.X...', 'X.X..'];
const STAND = ['.X.', 'XXX', '.X.', '.X.', 'X.X', 'X.X'];
const CHILD = ['.X.', 'XXX', '.X.', 'X.X'];
const CHILD_UP = ['X.X', '.X.', '.X.', 'X.X'];
const CROUCH = ['.X..', 'XXX.', '.XXX', 'X..X'];
const AMMONITE = ['.XXX.', 'X...X', 'X.X.X', 'X..XX', '.XX..'];

// The Gloam as the painters drew it: rounded billows and fingers of dots, a
// dark body inside a pale cold rim. discs: [x, y, r, order 0..1]. With t0/t1
// it is painted in over time (lowest first), else it is there already.
function gloam(b, discs, { t0, t1 } = {}) {
  const m = b.m;
  let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
  for (const [x, y, r] of discs) { x0 = Math.min(x0, x - r); x1 = Math.max(x1, x + r); y0 = Math.min(y0, y - r); y1 = Math.max(y1, y + r); }
  const inside = (x, y) => discs.some(([cx, cy, r]) => (x - cx) ** 2 + (y - cy) ** 2 <= r * r);
  for (let y = Math.floor(y0); y <= Math.ceil(y1); y++) for (let x = Math.floor(x0); x <= Math.ceil(x1); x++) {
    let order = 2;
    for (const [cx, cy, r, o] of discs) if ((x - cx) ** 2 + (y - cy) ** 2 <= r * r) order = Math.min(order, o);
    if (order > 1.5) continue;
    order = Math.max(order, clamp((y - y0) / 40));
    const rim = !inside(x - 1, y) || !inside(x + 1, y) || !inside(x, y + 1) || !inside(x, y - 1);
    if (rim && hash2(x, y, 208) < 0.1) continue;
    const pig = rim ? PIG.rim : PIG.gloam, cov = rim ? 0.75 : 0.82 + 0.15 * hash2(x, y, 207);
    if (t0 === undefined) { m.set(x, y, pig, cov); continue; }
    m.ev1(x, y, pig, t0 + (t1 - t0) * clamp(order + (hash2(x, y, 206) - 0.5) * 0.04), { cov, dz: 0.12 });
  }
}
function billows(seed, x0, x1, base, rMin, rMax, order = 0) {
  const r = rng(seed), out = [];
  for (let x = x0; x <= x1; x += rMin + r() * (rMax - rMin) * 0.8) out.push([x, base(x) + r() * 2, rMin + r() * (rMax - rMin), order]);
  return out;
}
function finger(x, y, dx, dy, n, r0, o0 = 0.35, curl = 0.3) {
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

// ---------------------------------------------------------------- the frieze
export function paint(m) {
  const b = new Brush(m);
  const info = { sc: SC };
  const T_IMPACT = [22.5, 23.5, 22.95];   // D's three impacts: left star, the moon, right star

  // ---- the bottom border: thin wavy strata and the fossils the stone keeps
  for (let x = FX0; x <= FX1; x++) {
    b.lift = -0.22; b.dot(x, BB0, PIG.charcoal); b.dot(x, BB1, PIG.charcoal); b.lift = 0;
    for (const [o, pig] of [[2, PIG.rust], [4.5, PIG.ochre], [6.5, PIG.rust]]) {
      const y = BB0 + o + 0.9 * Math.sin(x * 0.13 + o * 1.7);
      if (hash2(x, o * 10, 5) < 0.85) b.dot(x, y, pig, 0.6);
    }
  }
  for (let x = FX0 + 9; x < FX1 - 6; x += 15) b.sprite(x, BB0 + 2, AMMONITE, PIG.charcoal);

  // ---- the top border: the sky band, diagonal bars and a star between each pair
  info.borderStars = [];
  for (let x = FX0; x <= FX1; x++) { b.lift = -0.22; b.dot(x, TB0, PIG.charcoal); b.dot(x, TB1, PIG.charcoal); b.lift = 0; }
  for (let x = FX0 + 2; x < FX1 - 4; x += 10) {
    b.line(x, TB0 + 1, x + 3, TB1 - 1, PIG.rust, 0.7);
    const sx = x + 7, sy = (TB0 + TB1) / 2;
    if (sx > FX1 - 2) continue;
    if (sx < 106) b.star(sx, sy, true);
    else if (sx < 148) info.borderStars.push({ x: sx, y: sy });       // C: these will be torn out
    else for (const [dx, dy] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) m.set(sx + dx, sy + dy, PIG.ghost, 0.5);   // gone: empty sockets
  }

  // ---- the land: one ground, whole until D, broken from D on
  const landPig = (depth, x, y) => {
    let pig = depth < 2 ? PIG.ochre : depth < 5 ? PIG.rust : PIG.red;
    if (hash2(x, y, 3) < 0.06) pig = PIG.ochre;
    return pig;
  };
  for (let x = FX0; x <= FX1; x++) {
    if (x >= XE0) continue;   // E paints its own islands
    const top = ground(x);
    for (let y = G0; y <= top; y++) { b.lift = 0.12; b.dot(x, y, landPig(top - y, x, y)); }
    b.lift = 0.22; b.dot(x, top + 1, PIG.charcoal); b.lift = 0;
  }
  // tufts of grass along the ground in the green time (emaki and Chōjū-giga use them for ground)
  for (let x = FX0 + 3; x < 104; x += 4 + Math.floor(hash2(x, 1, 1) * 4)) {
    const y = ground(x) + 2;
    b.dot(x, y, PIG.rust, 0.7); if (hash2(x, 2, 2) < 0.6) { b.dot(x - 1, y + 1, PIG.rust, 0.6); b.dot(x + 1, y + 1, PIG.ochre, 0.6); }
  }

  // ---- A: long ago. A full sky, a gold moon; the trio walks under it
  b.disc(46, 75, 5.2, PIG.gold);
  for (const [x, y] of [[45, 76], [48, 73], [44, 73]]) b.dot(x, y, PIG.ochre);
  const starsA = [[8, 80, 1], [14, 70, 0], [19, 82, 1], [24, 63, 0], [29, 75, 1], [35, 84, 0], [37, 66, 0], [12, 58, 0], [54, 82, 1], [56, 66, 0], [40, 56, 0], [27, 54, 1], [6, 66, 0], [51, 58, 0]];
  for (const [x, y, big] of starsA) b.star(x, y, big);
  b.lift = 0.18;
  b.sprite(17, ground(18) + 2, TALL_WALK, PIG.charcoal);
  b.sprite(23, ground(24) + 2, UP, PIG.red);
  b.sprite(30, ground(31) + 2, CHILD_UP, PIG.charcoal);
  b.lift = 0;
  info.chimeStars = [...starsA.map(([x, y]) => ({ x, y })), { x: 46, y: 75 }];

  // ---- divider A|B: a Bayeux tree, its branches curling at the ends
  {
    const tx = 58, gy = ground(tx);
    b.lift = 0.2;
    for (let y = gy + 1; y <= 70; y++) { b.dot(tx, y, PIG.charcoal); if (y < 52) b.dot(tx + 1, y, PIG.charcoal); }
    for (const [y, dir, len] of [[52, -1, 6], [56, 1, 6], [61, -1, 5], [64, 1, 5], [68, -1, 3], [69, 1, 3]]) {
      let x = tx, yy = y;
      for (let k = 0; k < len; k++) { x += dir; yy += k < len / 2 ? 1 : 0.4; b.dot(x, yy, PIG.charcoal); }
      b.disc(x + dir, yy + 1.5, 2, k2(y) ? PIG.rust : PIG.ochre);
    }
    b.disc(tx, 72, 2.4, PIG.ochre);
    b.lift = 0;
  }
  function k2(y) { return y % 2 === 0; }

  // ---- B: the Gloam rises from behind the land and reaches for the sky.
  // The trio has stopped: the tall one points, the red one throws up its arms.
  b.disc(82, 78, 4.4, PIG.gold);
  b.dot(81, 79, PIG.ochre); b.dot(83, 77, PIG.ochre);
  const starsB = [[66, 84, 1], [72, 70, 0], [90, 86, 1], [95, 72, 0], [98, 82, 1], [70, 60, 0], [76, 88, 0], [88, 64, 0]];
  for (const [x, y, big] of starsB) b.star(x, y, big);
  b.lift = 0.18;
  b.sprite(65, ground(66) + 2, POINT, PIG.charcoal);
  b.sprite(71, ground(72) + 2, UP, PIG.red);
  b.sprite(76, ground(77) + 2, CHILD, PIG.charcoal);
  b.lift = 0;
  {
    const gb = (x) => ground(x) + 1;
    const discs = [
      ...billows(203, 80, 108, gb, 3, 5.5, 0),
      ...billows(204, 84, 108, (x) => gb(x) + 6, 2.5, 4.5, 0.15),
      // the column that divides B from C: the Gloam stands up out of the land
      ...finger(102, gb(102) + 10, 0.05, 1, 12, 4.2, 0.2, 0.18),
      ...finger(92, gb(92) + 7, -0.25, 1, 9, 2.8, 0.35, 0.4),
      ...finger(86, gb(86) + 6, -0.6, 1, 7, 2.2, 0.35, -0.5),
    ];
    gloam(b, discs, { t0: 9.4, t1: 13.4 });
  }

  // ---- C: it pulls them down. Its body lies along the ground; the moon, two
  // stars and the sky band's stars are loose tiles over faint stains
  const g3 = billows(301, 104, 150, (x) => ground(x) + 1, 3, 6.5, 0);
  gloam(b, g3);
  info.gloamTop = (x) => {
    let top = ground(x) + 1;
    for (const [cx, cy, r] of g3) if (Math.abs(x - cx) < r) top = Math.max(top, cy + Math.sqrt(r * r - (x - cx) ** 2));
    return top;
  };
  b.lift = 0.18;
  b.sprite(111, Math.round(info.gloamTop(112)) - 1, CROUCH, PIG.charcoal);
  b.sprite(116, Math.round(info.gloamTop(117)) - 1, CROUCH, PIG.red, true);
  b.sprite(120, Math.round(info.gloamTop(121)) - 1, CHILD, PIG.charcoal);
  b.lift = 0;
  const PLUS = [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]];
  const disc = [];
  for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) if (dx * dx + dy * dy <= 4.4 * 4.4) disc.push([dx, dy]);
  info.bodies = [
    { kind: 'star', j: 0, home: { x: 113, y: 71 }, cells: PLUS },
    { kind: 'star', j: 1, home: { x: 140, y: 78 }, cells: PLUS },
    ...info.borderStars.map((s, k) => ({ kind: 'star', j: 2 + k, border: true, home: s, cells: PLUS })),
    { kind: 'moon', j: 9, home: { x: 126, y: 74 }, cells: disc },
  ];
  for (const body of info.bodies) for (const [dx, dy] of body.cells) {
    const x = body.home.x + dx, y = body.home.y + dy;
    m.set(x, y, PIG.ghost, 0.5 + 0.2 * hash2(x, y, 305));
  }

  // ---- divider C|D: a bare tree, dead
  {
    const tx = 151, gy = ground(tx);
    b.lift = 0.2;
    for (let y = gy + 1; y <= 66; y++) b.dot(tx + (y > 58 ? 1 : 0), y, PIG.charcoal);
    for (const [y, dir, len] of [[54, -1, 5], [58, 1, 4], [62, -1, 4], [65, 1, 3]]) {
      let x = tx, yy = y;
      for (let k = 0; k < len; k++) { x += dir; yy += 0.7; b.dot(x, yy, PIG.charcoal); }
      b.dot(x + dir, yy - 1, PIG.charcoal);
    }
    b.lift = 0;
  }

  // ---- D: the impact. The trio is struck to ash; the land cracks into three
  // islands over the Gloam; stone closes over each star in layers
  const firstHit = Math.min(...T_IMPACT);
  for (const [x0, spr, pig] of [[160, STAND, PIG.charcoal], [165, STAND, PIG.red], [169, CHILD, PIG.charcoal]]) {
    const y0 = ground(x0 + 1) + 2;
    spr.forEach((row, r) => [...row].forEach((ch, c) => {
      if (ch !== 'X') return;
      const x = x0 + c, y = y0 + spr.length - 1 - r;
      m.set(x, y, pig); m.lift(x, y, 0.18);
      m.ev1(x, y, PIG.charcoal, firstHit + 0.15 + 0.05 * c, { cov: 0.35, dz: -0.18 });
      m.ev2(x, y, PIG.stone, firstHit + 0.9 + 0.3 * hash2(x, y, 403));
    }));
  }
  const impX = [161, 174, 186];
  info.impacts = impX.map((x, k) => ({ x, y: ground(x) + 1, t: T_IMPACT[k], moon: k === 1 }));
  const splits = [XD0, 167.5, 180.5];
  const crackX = splits.map((sx, k) => (y) => sx + 1.4 * Math.sin(y * 0.7 + k * 2) + (fbm(y * 0.5, k, 404) - 0.5) * 2);
  const crackT = [T_IMPACT[0] + 0.3, Math.min(T_IMPACT[0], T_IMPACT[1]) + 0.12, Math.min(T_IMPACT[1], T_IMPACT[2]) + 0.12];
  const bounds = [XD0 - 1, ...splits.slice(1), XE0 - 1];
  for (let x = XD0 - 3; x < XE0; x++) {
    const tp = ground(x);
    for (let y = G0; y <= tp + 1; y++) {
      let near = 99, ck = 0;
      crackX.forEach((f, k) => { const d = Math.abs(x - f(y)); if (d < near) { near = d; ck = k; } });
      const tCrack = crackT[ck] + (tp - y) * 0.035;
      if (near < 0.75) {
        m.ev1(x, y, PIG.crack, tCrack, { cov: 0.95, dz: -0.7 });
        m.ev2(x, y, PIG.gloam, 24.0 + (tp - y) * 0.04, { cov: 0.85, dz: -0.8 });
        continue;
      }
      if (x < XD0) continue;
      let seg = 0;
      while (seg < splits.length - 1 && x > crackX[seg + 1](y)) seg++;
      const a = bounds[seg], c = bounds[seg + 1], mid = (a + c) / 2, half = (c - a) / 2;
      const q = clamp(1 - Math.abs(x - mid) / half);
      const thick = 1.5 + 9 * Math.pow(q, 1.5) + fbm(x * 0.4, y * 0.1, 405);
      if (tp - y > thick || near < 1.8) {
        const rim = tp - y <= thick + 1 && near >= 1.8;
        m.ev1(x, y, rim ? PIG.rim : PIG.gloam, 23.7 + (1 - (y - G0) / (tp - G0)) * 0.5 + 0.25 * hash2(x, y, 406),
          { cov: rim ? 0.7 : 0.8 + 0.15 * hash2(x, y, 407), dz: -0.6 });
      }
    }
  }
  // the star sinks into the ground where it struck; then a low banded stone closes over it, bottom up
  for (const imp of info.impacts) {
    const R = imp.moon ? 5 : 3.6, Hh = imp.moon ? 3.2 : 2.3, tClose = imp.t + (imp.moon ? 1.5 : 1.8);
    for (let dy = -2; dy <= Math.ceil(Hh) + 1; dy++) for (let dx = -Math.ceil(R) - 1; dx <= Math.ceil(R) + 1; dx++) {
      const x = imp.x + dx, y = imp.y + dy;
      const bead = imp.moon ? (Math.abs(dx) <= 2 && dy >= -1 && dy <= 0) : (Math.abs(dx) <= 1 && dy === 0) || (dx === 0 && dy === -1);
      const crater = !bead && dy >= -2 && dy <= 0 && Math.abs(dx) <= (imp.moon ? 3 : 2);
      if (bead) m.ev1(x, y, PIG.gold, imp.t, { cov: 1, dz: -0.35, e: imp.moon ? 0.8 : 0.6 });
      else if (crater) m.ev1(x, y, PIG.charcoal, imp.t + 0.03, { cov: 0.8, dz: -0.3 });
      if (dy < 0) { if (bead) m.ev2(x, y, PIG.s3, tClose - 0.2, { cov: 0.85, dz: 0.1 }); continue; }
      const d = Math.hypot(dx / R, dy / Hh), rim = Math.hypot(dx / (R + 1), dy / (Hh + 1));
      if (d > 1) { if (rim <= 1) m.ev2(x, y, PIG.charcoal, tClose + dy * 0.4 + 0.15, { cov: 0.9, dz: 0.3 }); continue; }
      const pig = [PIG.s1, PIG.s3, PIG.s1, PIG.s2][Math.min(3, dy)];
      m.ev2(x, y, pig, tClose + dy * 0.4, { cov: 0.95, dz: 0.4 + 0.9 * (1 - d) });
    }
  }
  // the long night comes down over D's sky
  for (let y = 46; y < TB0; y++) for (let x = XD0 + 2; x < XE0; x++) {
    if (m.hasEv1(x, y)) continue;
    const n = fbm(x * 0.07, y * 0.07, 408);
    m.ev1(x, y, PIG.wash, 24.2 + (TB0 - y) * 0.03 + 0.6 * n, { cov: 0.25 + 0.3 * smooth(0.3, 0.7, n) });
  }

  // ---- divider D|E: bands of the Gloam's mist cross the frieze, as clouds do in an emaki
  for (const [cx, cy, len, th] of [[200, 48, 14, 2.2], [196, 62, 12, 1.8], [203, 74, 16, 2], [194, 82, 9, 1.5], [214, 56, 10, 1.6], [236, 70, 12, 1.8]]) {
    const discs = [];
    for (let k = -len / 2; k <= len / 2; k += 1.5) discs.push([cx + k, cy + Math.sin(k * 0.4) * 0.8, th * (1 - Math.pow(Math.abs(k) / (len / 2 + 1), 2) * 0.6), 0]);
    gloam(b, discs);
  }

  // ---- E: the long night. No stars, no figures; the land is islands in the
  // Gloam's sea, each with a banded stone; one small lantern remains
  for (let y = 46; y < TB0; y++) for (let x = XE0; x <= FX1; x++) {
    const n = fbm(x * 0.07, y * 0.07, 501);
    if (m.pig0(x, y) === 0) b.dot(x, y, PIG.wash, 0.25 + 0.3 * smooth(0.3, 0.7, n));
  }
  // the sea of the Gloam below and between the islands
  {
    const sea = [];
    for (let x = XE0 - 4; x <= FX1; x += 3.2) sea.push([x, G0 + 3 + 2 * Math.sin(x * 0.3), 3 + 1.4 * hash2(x, 0, 504), 0]);
    for (let x = XE0 + 9; x <= FX1; x += 13) sea.push([x + 2, G0 + 8, 2.6, 0]);
    gloam(b, sea);
  }
  // the same ground, now islands, drifted apart
  const isl = [[XE0 + 2, 210], [214, 234], [238, 249]];
  for (const [a, c] of isl) {
    const mid = (a + c) / 2, half = (c - a) / 2;
    for (let x = a; x <= c; x++) {
      const top = ground(x), q = clamp(1 - Math.abs(x - mid) / (half + 0.6));
      const th = Math.max(1, Math.round(1.5 + 10 * Math.pow(q, 1.5) + 0.6 * fbm(x * 0.5, 3, 503)));
      for (let k = 0; k <= th; k++) { b.lift = 0.12; b.dot(x, top - k, landPig(k, x, top - k)); }
      b.lift = 0.22; b.dot(x, top + 1, PIG.charcoal); b.lift = 0;
    }
  }
  // two small islets drifting higher
  for (const [a, c, top] of [[203, 207, 58], [241, 245, 62]]) for (let x = a; x <= c; x++) {
    const th = x === a || x === c ? 0 : 2;
    for (let k = 0; k <= th; k++) b.dot(x, top - k, k ? PIG.red : PIG.ochre);
  }
  // the banded stones, where the far-flung stars came down
  const mound = (cx, R, Hh) => {
    const base = ground(cx) + 1;
    for (let dy = 0; dy <= Hh + 1; dy++) for (let dx = -R - 1; dx <= R + 1; dx++) {
      const d = Math.hypot(dx / R, dy / Hh), rim = Math.hypot(dx / (R + 1), dy / (Hh + 1));
      if (d > 1) { if (rim <= 1) b.dot(cx + dx, base + dy, PIG.charcoal, 0.9); continue; }
      b.dot(cx + dx, base + dy, [PIG.s1, PIG.s3, PIG.s1, PIG.s2][Math.min(3, dy)], 0.92);
      m.lift(cx + dx, base + dy, 0.3 + 0.8 * (1 - d));
    }
  };
  mound(204, 3, 2); mound(218, 3, 2); mound(244, 3, 2);
  // the lantern: a charcoal frame round a gold flame, its light drawn as dashes
  const LX = 227, LY = ground(LX) + 2;
  b.lift = 0.2;
  b.sprite(LX - 2, LY, ['..X..', '.X.X.', 'XXXXX', 'X...X', 'X...X', 'X...X', 'XXXXX'], PIG.charcoal);
  b.lift = 0;
  for (const [dx, dy] of [[0, 2], [0, 3], [-1, 2], [1, 2], [0, 4]]) b.dot(LX + dx, LY + dy, PIG.gold);
  for (const [dx, dy] of [[-4, 3], [4, 3], [-4, 5], [4, 5], [-3, 7], [3, 7], [0, 9]]) b.dot(LX + dx, LY + dy, PIG.ochre, 0.75);
  info.lantern = { x: LX, y: LY + 3 };
  return info;
}
