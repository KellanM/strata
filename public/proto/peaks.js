// Mountain tops for the map's sea of mist (docs/map-study.md, round 3).
// Chunky voxel peaks whose bases dissolve into the mist, built from a
// heightfield (not concentric rings): a concave summit set off-centre, one
// ridge spur to one side, terraces of uneven depth. Ground caps sit only on
// ledges wide enough to stand on; risers are bare rock; no per-voxel noise.
import { grid as coarseGrid } from './voxels.js';

const STEPS = [1, 1, 2, 1, 3, 1, 2];   // terrace depths, uneven on purpose

// Resolution. Every peak is designed in "design voxels" (the coordinates
// below) and built at K cubes per design voxel: the same mountain, the same
// size on the map, in finer cubes. The map renders each sprite at K times
// fewer px per cube so its cubes come out the size of a stone's miniature
// (peaks-export.html); K = 1 is the peak exactly as designed.
let K = 1;
const fine = (c) => Math.round(c * K);   // a design coordinate's first cube
const design = (c) => {                   // and the design voxel a cube is part of
  let d = Math.floor(c / K);
  while (fine(d + 1) <= c) d++;
  while (d > 0 && fine(d) > c) d--;
  return d;
};
function grid(X, Y, Z) {
  const g = coarseGrid(fine(X), fine(Y), fine(Z));
  g.k = K;
  return g;
}

/**
 * Fills columns up to a quantised height. peaks: [{ x, z, h, r, p, n }] (a
 * concave cone: h * (1 - d/r)^p, d in a superellipse of power n); spurs:
 * [{ x0, z0, x1, z1, h0, h1, w }] (a ridge whose height runs h0 -> h1).
 */
function terrain(g, { peaks = [], spurs = [], rock, rock2, steps = STEPS, floor = 1 }) {
  // the terraces stand at the designed heights, counted in cubes
  const levels = [0];
  for (let k = 0; levels[levels.length - 1] < g.Y / K; k++) levels.push(levels[levels.length - 1] + steps[k % steps.length]);
  const q = (h) => { let v = 0; for (const l of levels) if (l <= h) v = l; return fine(v); };
  const H = (x, z) => {
    let h = 0;
    for (const p of peaks) {
      // the summit keeps a small cap (never a one-voxel needle)
      const n = p.n ?? 2, d = (Math.abs(x - p.x) ** n + Math.abs(z - p.z) ** n) ** (1 / n);
      const tip = p.tip ?? 1.2, dd = Math.max(0, d - tip);
      if (d < p.r) h = Math.max(h, p.h * Math.pow(1 - dd / (p.r - tip), p.p ?? 1.4));
    }
    for (const s of spurs) {
      const vx = s.x1 - s.x0, vz = s.z1 - s.z0, L2 = vx * vx + vz * vz;
      const t = Math.max(0, Math.min(1, ((x - s.x0) * vx + (z - s.z0) * vz) / L2));
      const d = Math.hypot(x - (s.x0 + vx * t), z - (s.z0 + vz * t));
      if (d < s.w) h = Math.max(h, (s.h0 + (s.h1 - s.h0) * t) * (1 - (d / s.w) ** 2));
    }
    return h;
  };
  const hf = [];
  for (let z = 0; z < g.Z; z++) for (let x = 0; x < g.X; x++) {
    // the height of the design voxel this cube is part of: the mountain as it was
    // drawn, every step and outcrop kept, built in K by K columns of cubes
    const h = Math.min(g.Y - 1, q(H(design(x), design(z))));
    hf[x + g.X * z] = h;
    if (h < fine(floor)) continue;
    // rock: one tone, a second only every third level (a quiet strata, not stripes)
    for (let y = 0; y < h; y++) g.set(x, y, z, strata(y, rock, rock2));
  }
  g.hf = hf;
  return g;
}
const strata = (y, rock, rock2) => (Math.floor(y / (3 * K)) % 2 ? rock2 : rock);
// the ground's height under a design voxel, in design voxels
const hAt = (g, x, z) => {
  const fx = fine(Math.round(x)), fz = fine(Math.round(z));
  return (g.hf?.[fx + g.X * fz] ?? g.top(fx, fz) + 1) / K;
};

// ground on ledges wide enough to stand on; risers and narrow rims stay rock.
// A cap is one design voxel deep (K cubes), as the mountain was drawn.
function caps(g, ground, { snow, snowFrom = Infinity, ground2, minFlat = 2 } = {}) {
  const solid = (x, y, z) => !!g.get(x, y, z);
  const deep = Math.max(1, fine(1));
  for (let z = 0; z < g.Z; z++) for (let y = 0; y < g.Y; y++) for (let x = 0; x < g.X; x++) {
    if (!solid(x, y, z) || solid(x, y + 1, z)) continue;
    const i = x + g.X * (y + g.Y * z);
    if (g.struct?.has(i) || g.glow.has(i)) continue;
    let flat = 0;
    // (the neighbours one design voxel away, so a ledge is judged as it was drawn)
    for (const [dx, dz] of [[deep, 0], [-deep, 0], [0, deep], [0, -deep]]) if (solid(x + dx, y, z + dz) && !solid(x + dx, y + 1, z + dz)) flat++;
    const c = y >= fine(snowFrom) ? snow : flat >= minFlat || (minFlat <= 2 && y < fine(2)) ? ground : 0;
    if (!c) continue;
    for (let d = 0; d < deep && y - d >= 0; d++) {
      const j = x + g.X * (y - d + g.Y * z);
      if (!solid(x, y - d, z) || g.struct?.has(j) || g.glow.has(j)) break;
      g.set(x, y - d, z, c);
    }
  }
}
// no needles, posts or strays: terrain cubes above the first two layers need a
// neighbour beside them, and nothing may float; repeated until nothing changes
function tidy(g) {
  const d = Math.max(1, fine(1));   // (judged a design voxel at a time)
  for (let pass = 0; pass < 4; pass++) {
    let changed = false;
    for (let y = g.Y - 1; y >= fine(2); y--) for (let z = 0; z < g.Z; z++) for (let x = 0; x < g.X; x++) {
      if (!g.get(x, y, z) || g.struct?.has(x + g.X * (y + g.Y * z))) continue;
      const side = [[d, 0], [-d, 0], [0, d], [0, -d]].filter(([dx, dz]) => g.get(x + dx, y, z + dz)).length;
      if (side === 0 || !g.get(x, y - d, z)) { g.clear(x, y, z); changed = true; }
    }
    if (!changed) break;
  }
  return g;
}
// a design voxel of a structure: K by K by K cubes (y may be fractional when it
// comes from hAt, so it is scaled before it's rounded). A lit one glows once,
// from its centre (renderVoxels: g.glowAt).
function put(g, x, y, z, c, lit = false) {
  x = Math.round(x); z = Math.round(z);
  if (K === 1) y = Math.round(y);
  const [x0, x1, y0, y1, z0, z1] = [fine(x), fine(x + 1), fine(y), fine(y + 1), fine(z), fine(z + 1)];
  for (let zz = z0; zz < z1; zz++) for (let yy = y0; yy < y1; yy++) for (let xx = x0; xx < x1; xx++) {
    if (!g.ok(xx, yy, zz)) continue;
    g.set(xx, yy, zz, c, lit && K === 1); (g.struct ??= new Set()).add(xx + g.X * (yy + g.Y * zz));
  }
  const key = `${x0},${y0},${z0}`;
  if (K !== 1) {
    g.glowAt ??= new Map();
    if (lit && g.ok(x0, y0, z0)) g.glowAt.set(key, [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2, c]);
    else g.glowAt.delete(key);
  }
}
// clears a design voxel's cubes, sparing a structure's
function clearAt(g, x, y, z) {
  for (let zz = fine(z); zz < fine(z + 1); zz++) for (let yy = fine(y); yy < fine(y + 1); yy++) for (let xx = fine(x); xx < fine(x + 1); xx++) {
    if (!g.struct?.has(xx + g.X * (yy + g.Y * zz))) g.clear(xx, yy, zz);
  }
}
// no lone ground cubes (they read as moss stuck on a cliff)
function despeckle(g, ground, rock) {
  for (let z = 0; z < g.Z; z++) for (let y = 0; y < g.Y; y++) for (let x = 0; x < g.X; x++) {
    if (g.get(x, y, z) !== ground) continue;
    const d = Math.max(1, fine(1));   // one design voxel away
    if (![[d, 0], [-d, 0], [0, d], [0, -d]].some(([dx, dz]) => g.get(x + dx, y, z + dz) === ground)) g.set(x, y, z, rock);
  }
}
// a cottage with its gable to the front-left (+z): walls wx by wz, two high;
// the ridge runs along z, the roof overhangs one voxel at both eaves; the
// front gable is white with the roof as its stepped rim, the door at its foot
// and a lit window under the ridge, both on the centre line
function cottage(g, x0, z0, wx, wz, y, { roof = 0xe39a84, roof2 = 0xd38a74, wall = 0xfbf3e6, door = 0xb08060, lamp = 0xffd58a } = {}) {
  for (let k = 0; k < 2; k++) for (let dz = 0; dz < wz; dz++) for (let dx = 0; dx < wx; dx++) put(g, x0 + dx, y + k, z0 + dz, wall);
  const zf = z0 + wz - 1, xm = x0 + (wx - 1) / 2;
  for (let c = 0; ; c++) {
    const xa = x0 - 1 + c, xb = x0 + wx - c;
    if (xa > xb) break;
    for (let x = xa; x <= xb; x++) for (let z = z0; z <= zf; z++) {
      const rim = x === xa || x === xb;
      put(g, x, y + 2 + c, z, z === zf && !rim ? wall : rim ? roof : roof2);
    }
  }
  put(g, xm, y, zf, door);
  put(g, xm, y + 2, zf, lamp, true);
}
function tree(g, x, z, trunk, leaf, leaf2) {   // seated on the ground where it stands
  const y = hAt(g, x, z);
  put(g, x, y, z, trunk);
  for (let dy = 1; dy <= 2; dy++) for (let dz = -1; dz <= 1; dz++) for (let dx = -1; dx <= 1; dx++) {
    if (dy === 2 && Math.abs(dx) + Math.abs(dz) === 2) continue;
    put(g, x + dx, y + dy, z + dz, dy === 2 ? leaf2 : leaf);
  }
}
function pine(g, x, z, trunk, leaf, tip) {
  const y = hAt(g, x, z);
  put(g, x, y, z, trunk);
  for (const [dx, dz] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) put(g, x + dx, y + 1, z + dz, leaf);
  put(g, x, y + 2, z, tip ?? leaf);
}

// ---------------------------------------------------------------- the biomes
// rock, rock2 (close tones), ground, mist: all inside the biome's palette
const BIOMES = {
  Dawn: { rock: 0xe9b9a2, rock2: 0xdcab96, ground: 0xa8d88f, ground2: 0xc7e6a6 },
  Teatime: { rock: 0xe6c3a2, rock2: 0xd9b493, ground: 0xb8dcc8, ground2: 0xd3eadc },
  Beacon: { rock: 0xa9adc6, rock2: 0x9da1bc, ground: 0xc9cf9a, ground2: 0xd8dcae },
  Mint: { rock: 0xa9c4ba, rock2: 0x9bb8ae, ground: 0x9fd18a, ground2: 0xbfe2a6 },
  Orchard: { rock: 0xdcbc96, rock2: 0xceae88, ground: 0xb8c97a, ground2: 0xcfda94 },
  Autumn: { rock: 0xcf9a7c, rock2: 0xc08a6e, ground: 0xe9a86e, ground2: 0xf2c08a },
  Lagoon: { rock: 0xe3cfa4, rock2: 0xd6c096, ground: 0x9fd8b0, ground2: 0xbfe6c8 },
  Deep: { rock: 0x5f9ea8, rock2: 0x55929c, ground: 0x8fd0c8, ground2: 0xa8ddd6 },
  Desert: { rock: 0xe6a06a, rock2: 0xd99260, ground: 0xfadfae, ground2: 0xf3cf98 },
  Dusk: { rock: 0x9a6a8a, rock2: 0x8c5e7e, ground: 0xf0b49a, ground2: 0xf6c8ae },
  Stones: { rock: 0xbdb8aa, rock2: 0xb0ab9d, ground: 0xa9c18f, ground2: 0xbfd3a6 },
  Clockwork: { rock: 0xc99a6e, rock2: 0xbd8e63, ground: 0xead2a8, ground2: 0xf2dfbc },
  Festival: { rock: 0x94708f, rock2: 0x8a6686, ground: 0xc493a8, ground2: 0xd2a4b6 },
  Frost: { rock: 0x9fb0cc, rock2: 0x93a5c2, ground: 0xffffff, ground2: 0xf2f6fc },
  Clouds: { rock: 0xbcc6ea, rock2: 0xafbae2, ground: 0xfffaf2, ground2: 0xf6e2d6 },
  Night: { rock: 0x6f78b0, rock2: 0x666fa6, ground: 0xb8a8d6, ground2: 0xc9bce2 },
};
export const biomeOf = (p) => BIOMES[p.name] ?? { rock: p.lit, rock2: p.lit, ground: p.top, ground2: p.top };

// Landforms: each a family of distinct shapes; v picks the variant (0..2), so
// a biome's peaks differ from each other as well as from other biomes'.
const LANDFORM = {
  // rolling hills: a long low back, a second knoll, a saddle between
  hills: (B, v) => terrain(grid(12, 9, 11), [
    { peaks: [{ x: 4, z: 4, h: 7, r: 6, p: 0.9 }, { x: 9, z: 7, h: 5, r: 4, p: 0.9 }], ...B },
    { peaks: [{ x: 6, z: 5, h: 8, r: 6.5, p: 1.1 }], spurs: [{ x0: 6, z0: 5, x1: 1, z1: 9, h0: 6, h1: 2, w: 2.6 }], ...B },
    { peaks: [{ x: 3, z: 6, h: 6, r: 4.5, p: 0.8 }, { x: 8, z: 4, h: 7, r: 4.5, p: 0.8 }], ...B },
  ][v % 3]),
  // buttes: tall sheer-sided tables, tops broken into levels, a raised shoulder
  buttes: (B, v) => terrain(grid(11, 12, 11), [
    { peaks: [{ x: 4, z: 4.5, h: 9, r: 4, p: 0.12, n: 3 }, { x: 7.5, z: 7, h: 6, r: 3, p: 0.12, n: 3 }, { x: 3, z: 3, h: 10, r: 2, p: 0.1, n: 3 }], steps: [3, 2, 1], ...B },
    { peaks: [{ x: 5, z: 5, h: 8, r: 4.6, p: 0.15, n: 2.6 }, { x: 7, z: 3.5, h: 10, r: 2.2, p: 0.1, n: 3 }], steps: [2, 2, 3], ...B },
    { peaks: [{ x: 3.5, z: 5, h: 10, r: 2.6, p: 0.1, n: 3 }, { x: 7.5, z: 5, h: 7, r: 3.2, p: 0.12, n: 3 }], steps: [3, 1, 2], ...B },
  ][v % 3]),
  // a long ridge with a summit at one end, or a broken crest
  ridge: (B, v) => terrain(grid(13, 11, 10), [
    { peaks: [{ x: 3.5, z: 4, h: 10, r: 4.5, p: 1.3 }], spurs: [{ x0: 4, z0: 4, x1: 11.5, z1: 6, h0: 7, h1: 3, w: 2.6 }], ...B },
    { peaks: [{ x: 9, z: 5, h: 9, r: 4.2, p: 1.2 }, { x: 4, z: 6, h: 6, r: 3.5, p: 1 }], spurs: [{ x0: 9, z0: 5, x1: 3, z1: 6, h0: 6, h1: 4, w: 2.4 }], ...B },
    { peaks: [{ x: 6, z: 5, h: 10, r: 5, p: 1.5 }], spurs: [{ x0: 6, z0: 5, x1: 12, z1: 2, h0: 6, h1: 2, w: 2.2 }, { x0: 6, z0: 5, x1: 1, z1: 8, h0: 5, h1: 2, w: 2.2 }], ...B },
  ][v % 3]),
  // sea stacks: columns of rock, two or three, never thinner than 2
  stacks: (B, v) => terrain(grid(12, 13, 10), [
    { peaks: [{ x: 3.5, z: 4, h: 11, r: 2.9, p: 0.25 }, { x: 8, z: 6, h: 7, r: 2.6, p: 0.3 }], ...B },
    { peaks: [{ x: 5, z: 5, h: 9, r: 3.6, p: 0.35 }, { x: 9.5, z: 4, h: 5, r: 2.2, p: 0.3 }], ...B },
    { peaks: [{ x: 3, z: 6, h: 8, r: 2.5, p: 0.3 }, { x: 6.5, z: 3.5, h: 12, r: 2.7, p: 0.25 }, { x: 9.5, z: 7, h: 5, r: 2.2, p: 0.3 }], ...B },
  ][v % 3]),
  // horns: steep spires in a cluster, each at least 3 wide at its cap
  horns: (B, v) => terrain(grid(11, 14, 10), [
    { peaks: [{ x: 4, z: 4, h: 12, r: 4, p: 1.1, tip: 1.6 }, { x: 7.5, z: 6.5, h: 8, r: 3, p: 1, tip: 1.4 }], ...B },
    { peaks: [{ x: 5, z: 5, h: 13, r: 4.6, p: 1.3, tip: 1.6 }], spurs: [{ x0: 5, z0: 5, x1: 10, z1: 7, h0: 7, h1: 3, w: 2.2 }], ...B },
    { peaks: [{ x: 3.5, z: 5, h: 10, r: 3.4, p: 1, tip: 1.5 }, { x: 7.5, z: 4, h: 12, r: 3.6, p: 1.2, tip: 1.5 }], ...B },
  ][v % 3]),
  // orchard ridges: even terraces up a shoulder
  terraces: (B, v) => terrain(grid(13, 10, 12), [
    { peaks: [{ x: 5, z: 5, h: 8, r: 6.5, p: 0.8 }], spurs: [{ x0: 5, z0: 5, x1: 11, z1: 9, h0: 6, h1: 2, w: 3 }], steps: [1], ...B },
    { peaks: [{ x: 8, z: 5, h: 7, r: 5.5, p: 0.7 }], spurs: [{ x0: 8, z0: 5, x1: 2, z1: 8, h0: 6, h1: 2, w: 3 }], steps: [1, 2], ...B },
    { peaks: [{ x: 4, z: 7, h: 6, r: 5, p: 0.7 }, { x: 9, z: 4, h: 8, r: 4.5, p: 0.9 }], steps: [1], ...B },
  ][v % 3]),
  // tors: a crag carrying stacked 2x2 boulders
  tors: (B, v) => {
    const g = terrain(grid(11, 10, 10), { peaks: [{ x: 5, z: 4.5, h: 6 - (v % 2), r: 5, p: 0.9 }], ...B });
    caps(g, B.ground, B);
    for (const [x, z, k] of [[[3, 3, 2], [6, 5, 3]], [[5, 4, 3]], [[3, 5, 2], [7, 3, 2]]][v % 3]) {
      const y = hAt(g, x, z);
      for (let i = 0; i < k; i++) for (const [dx, dz] of [[0, 0], [1, 0], [0, 1], [1, 1]]) put(g, x + dx, y + i, z + dz, i % 2 ? B.rock : B.rock2);
    }
    return g;
  },
  // domes: rounded summits like upturned bowls, one or two
  domes: (B, v) => terrain(grid(12, 10, 11), [
    { peaks: [{ x: 5, z: 5, h: 8, r: 5.5, p: 0.55, tip: 1.8 }], steps: [1, 2], ...B },
    { peaks: [{ x: 4, z: 5, h: 7, r: 4.5, p: 0.55, tip: 1.6 }, { x: 8.5, z: 5, h: 5, r: 3.5, p: 0.55, tip: 1.4 }], steps: [1, 2], ...B },
    { peaks: [{ x: 6, z: 5, h: 9, r: 5.5, p: 0.7, tip: 1.6 }], spurs: [{ x0: 6, z0: 5, x1: 1, z1: 8, h0: 4, h1: 2, w: 2.4 }], steps: [2, 1], ...B },
  ][v % 3]),
  // alps: a sharp peak with shoulders and a spur
  alps: (B, v) => terrain(grid(13, 14, 12), [
    { peaks: [{ x: 4, z: 4, h: 13, r: 6, p: 1.7, tip: 1.5 }, { x: 9, z: 7, h: 7, r: 3.4, p: 1.5, tip: 1.4 }], spurs: [{ x0: 4, z0: 4, x1: 11, z1: 2, h0: 8, h1: 3, w: 2.2 }], ...B },
    { peaks: [{ x: 7, z: 6, h: 12, r: 6, p: 1.6, tip: 1.5 }], spurs: [{ x0: 7, z0: 6, x1: 1, z1: 3, h0: 7, h1: 3, w: 2.4 }], ...B },
    { peaks: [{ x: 4, z: 6, h: 10, r: 4.5, p: 1.5, tip: 1.4 }, { x: 9, z: 4, h: 11, r: 4.6, p: 1.6, tip: 1.4 }], ...B },
  ][v % 3]),
  // chimney rocks: a quarried brass massif with flat-cut shelves (Clockwork)
  chimneys: (B, v) => terrain(grid(12, 13, 11), [
    { peaks: [{ x: 4, z: 4, h: 11, r: 2.8, p: 0.15, n: 3 }, { x: 7, z: 6, h: 8, r: 4.5, p: 0.5, n: 2.6 }], steps: [2], ...B },
    { peaks: [{ x: 6, z: 5, h: 9, r: 5, p: 0.6, n: 3 }, { x: 8.5, z: 3.5, h: 12, r: 2.4, p: 0.1, n: 3 }], steps: [2], ...B },
    { peaks: [{ x: 3.5, z: 6, h: 10, r: 2.6, p: 0.1, n: 3 }, { x: 8, z: 5, h: 10, r: 2.6, p: 0.1, n: 3 }, { x: 6, z: 5, h: 5, r: 5, p: 0.6 }], steps: [2], ...B },
  ][v % 3]),
};
// a biome's two landform families (its peaks alternate between them)
const FAMILY = {
  Dawn: ['hills', 'domes'], Teatime: ['buttes', 'domes'], Beacon: ['ridge', 'tors'], Mint: ['domes', 'hills'], Orchard: ['terraces', 'hills'],
  Autumn: ['ridge', 'horns'], Lagoon: ['stacks', 'ridge'], Deep: ['stacks', 'horns'], Desert: ['buttes', 'ridge'],
  Dusk: ['horns', 'ridge'], Stones: ['tors', 'hills'], Clockwork: ['chimneys', 'buttes'], Festival: ['domes', 'horns'],
  Frost: ['alps', 'horns'], Clouds: ['horns', 'domes'], Night: ['alps', 'stacks'],
};
const snowy = { Frost: 6 };

// each biome's signature summit: one clear landmark on an offset summit, ~12 across
const SIGNATURE = {
  Dawn: (B) => { // the home you set out from: a cottage on stacked rock shelves, its window lit, a pale stair from its door down into the mist (round 4)
    // three shelves stepping down toward the front-left, risers of two and three
    const g = terrain(grid(13, 16, 16), {
      peaks: [[10, 3.9], [7, 5.3], [4, 6.6]].map(([h, r], i) => ({ x: 3.5 + i * 0.4, z: 6.2 + i * 1.3, h, r, p: 0.06, n: 2.6, tip: r * 0.7 })),
      steps: [2, 3, 2, 3], ...B,
    });
    const y = hAt(g, 3, 6);
    caps(g, B.ground, { minFlat: 3 });
    despeckle(g, B.ground, B.rock);
    cottage(g, 2, 4, 3, 4, y);
    // the stair: from the door's threshold, one down per step, carved into the shelves
    for (let z = 8, h = y - 1; z < 16 && h >= 0; z++, h--) {
      for (let yy = h + 1; yy < 16; yy++) clearAt(g, 3, yy, z);
      for (let zz = fine(z); zz < fine(z + 1); zz++) for (let xx = fine(3); xx < fine(4); xx++) {
        for (let yy = 0; yy < fine(h); yy++) if (!g.get(xx, yy, zz)) g.set(xx, yy, zz, strata(yy, B.rock, B.rock2));
      }
      put(g, 3, h, z, 0xfbeee0);
    }
    return g;
  },
  Teatime: (B) => { // a tea house on a butte: a mint roof, a window lit
    const g = terrain(grid(12, 11, 11), { peaks: [{ x: 5, z: 5, h: 9, r: 5.6, p: 0.6, n: 2.8, tip: 2 }, { x: 8.5, z: 8, h: 4, r: 3, p: 0.6, n: 2.8 }], steps: [2], ...B });
    caps(g, B.ground, B);
    const y = hAt(g, 5, 5);
    for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 0; dz++) { put(g, 5 + dx, y, 5 + dz, 0xfff4e6); put(g, 5 + dx, y + 1, 5 + dz, 0xfff4e6); }
    for (let dx = -2; dx <= 2; dx++) for (let dz = -2; dz <= 1; dz++) put(g, 5 + dx, y + 2, 5 + dz, 0x6fb8a4);
    for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 0; dz++) put(g, 5 + dx, y + 3, 5 + dz, 0x9fd4c4);
    put(g, 6, y, 6, 0xffd58a, true);
    return g;
  },
  Beacon: (B) => { // a slate hill crowned by a stone cairn, its beacon fire lit
    const g = terrain(grid(13, 13, 12), { peaks: [{ x: 5, z: 5, h: 9, r: 6, p: 1.1, tip: 1.6 }], spurs: [{ x0: 5, z0: 5, x1: 11, z1: 9, h0: 5, h1: 2, w: 2.8 }], ...B });
    caps(g, B.ground, B);
    const y = hAt(g, 5, 5);
    for (let k = 0; k < 2; k++) for (const [dx, dz] of [[0, 0], [1, 0], [0, 1], [1, 1]]) put(g, 4 + dx, y + k, 4 + dz, k ? 0x8e93b0 : 0x9da1bc);
    for (const [dx, dz] of [[0, 0], [1, 0], [0, 1], [1, 1]]) put(g, 4 + dx, y + 2, 4 + dz, 0xffb36b, true);
    put(g, 4, y + 3, 4, 0xffe4c4, true);
    return g;
  },
  Mint: (B) => { // a mossy summit, two round trees and a stone lantern lit
    const g = terrain(grid(12, 11, 12), { peaks: [{ x: 4.5, z: 5, h: 8, r: 6.5, p: 1 }], spurs: [{ x0: 5, z0: 5, x1: 10, z1: 9, h0: 5, h1: 2, w: 3 }], ...B });
    caps(g, B.ground, B);
    tree(g, 4, 5, 0x8a5a3c, 0x7cc47f, 0xa8dc96);
    const y = hAt(g, 6, 3);
    put(g, 6, y, 3, 0xd8d0c0); put(g, 6, y + 1, 3, 0xffe7a1, true); put(g, 6, y + 2, 3, 0xc4bdad);
    return g;
  },
  Orchard: (B) => { // terraces up one shoulder, its fruit trees in a grove
    const g = terrain(grid(13, 10, 12), { peaks: [{ x: 5, z: 5, h: 8, r: 7, p: 0.85 }], spurs: [{ x0: 5, z0: 5, x1: 11, z1: 9, h0: 6, h1: 2, w: 3 }], steps: [1], ...B });
    caps(g, B.ground, B);
    // one apple tree on the summit, its fruit on the crown only
    tree(g, 5, 5, 0x8a5a3c, 0x86b85a, 0x9cc96a);
    const ty = hAt(g, 5, 5);
    put(g, 6, ty + 1, 6, 0xe0785f); put(g, 4, ty + 2, 5, 0xe0785f);
    return g;
  },
  Autumn: (B) => { // a ridge in leaf-fall: amber crowns on the high shoulder, pines below
    const g = terrain(grid(14, 11, 11), { peaks: [{ x: 4, z: 4.5, h: 9, r: 5.5, p: 1.3 }], spurs: [{ x0: 4, z0: 4.5, x1: 12, z1: 7, h0: 7, h1: 3, w: 3 }], ...B });
    caps(g, B.ground, B);
    tree(g, 6, 5, 0x6b4a3a, 0xe9933f, 0xf6c27a);
    return g;
  },
  Lagoon: (B) => { // a lighthouse on a sea crag, a cliff face toward the sea
    const g = terrain(grid(11, 15, 11), { peaks: [{ x: 4, z: 5, h: 7, r: 5, p: 0.45 }], spurs: [{ x0: 4, z0: 5, x1: 9, z1: 8, h0: 4, h1: 2, w: 2.5 }], ...B });
    caps(g, B.ground, B);
    const y = hAt(g, 4, 5);
    for (let k = 0; k < 5; k++) for (const [dx, dz] of [[0, 0], [1, 0], [0, 1], [1, 1]]) put(g, 4 + dx, y + k, 5 + dz, k % 3 === 1 ? 0xe0565b : 0xfbf8f2);
    for (const [dx, dz] of [[0, 0], [1, 0], [0, 1], [1, 1]]) { put(g, 4 + dx, y + 5, 5 + dz, 0xffe08a, true); put(g, 4 + dx, y + 6, 5 + dz, 0xe0565b); }
    return g;
  },
  Deep: (B) => { // sea stacks joined by an arch, bioluminescent tips
    const g = terrain(grid(13, 12, 10), { peaks: [{ x: 3, z: 5, h: 10, r: 2.9, p: 0.25 }, { x: 10, z: 5, h: 7, r: 2.3, p: 0.2 }], ...B });
    caps(g, B.ground, B);
    for (let x = 3; x <= 10; x++) { put(g, x, 6, 5, B.rock); put(g, x, 6, 4, B.rock2); }
    put(g, 3, hAt(g, 3, 5), 5, 0x9ff6ec, true); put(g, 10, hAt(g, 10, 5), 5, 0xffc0dc, true);
    return g;
  },
  Desert: (B) => { // a mesa with cliff bands, an arch on its rim
    const g = terrain(grid(13, 12, 12), { peaks: [{ x: 6, z: 6, h: 9, r: 5.6, p: 0.55, n: 3, tip: 2.4 }, { x: 9.5, z: 9, h: 4, r: 3, p: 0.5, n: 3 }], steps: [2, 2, 3], ...B });
    caps(g, B.ground, B);
    const y = hAt(g, 6, 6);
    for (let k = 0; k < 4; k++) { put(g, 3, y + k, 8, B.rock); put(g, 7, y + k, 8, B.rock); }
    for (let x = 3; x <= 7; x++) put(g, x, y + 4, 8, B.rock2);
    return g;
  },
  Dusk: (B) => { // a basalt summit: a torii at the top, a lantern lit
    const g = terrain(grid(12, 13, 11), { peaks: [{ x: 5, z: 5, h: 9, r: 5.5, p: 1.2 }], spurs: [{ x0: 5, z0: 5, x1: 10, z1: 9, h0: 6, h1: 2, w: 2.6 }], ...B });
    caps(g, B.ground, B);
    const y = hAt(g, 5, 5);
    for (let k = 0; k < 3; k++) { put(g, 4, y + k, 5, 0xd9534f); put(g, 7, y + k, 5, 0xd9534f); }
    for (let x = 3; x <= 8; x++) put(g, x, y + 3, 5, 0xd9534f);
    for (let x = 2; x <= 9; x++) put(g, x, y + 4, 5, 0x9e3b3b);
    put(g, 9, hAt(g, 9, 8), 8, 0xffc8a2, true);
    return g;
  },
  Stones: (B) => { // a flat summit above grey cliffs, a ring of standing stones
    const g = terrain(grid(12, 11, 12), { peaks: [{ x: 6, z: 6, h: 8, r: 6, p: 0.6, n: 2.4, tip: 2.6 }], spurs: [{ x0: 6, z0: 6, x1: 11, z1: 10, h0: 4, h1: 2, w: 2.4 }], steps: [2, 3], ...B });
    caps(g, B.ground, B);
    const y = hAt(g, 6, 6);
    for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2, x = 6 + Math.round(Math.cos(a) * 2.4), z = 6 + Math.round(Math.sin(a) * 2.4); for (let k = 0; k < (i % 2 ? 2 : 3); k++) put(g, x, y + k, z, 0xf0ebe0); }
    return g;
  },
  Clockwork: (B) => { // a quarried butte with a brass clock tower
    const g = terrain(grid(11, 15, 11), { peaks: [{ x: 5, z: 5, h: 7, r: 5.4, p: 0.6, n: 2.8, tip: 1.8 }], spurs: [{ x0: 5, z0: 5, x1: 10, z1: 9, h0: 4, h1: 2, w: 2.2 }], steps: [2], ...B });
    caps(g, B.ground, B);
    const y = hAt(g, 5, 5);
    // a 3x3 tower, brass bands, one lit window toward the light, a teal cap
    for (let k = 0; k < 6; k++) for (let dz = -1; dz <= 1; dz++) for (let dx = -1; dx <= 1; dx++) {
      const win = k === 3 && dx === 0 && dz === 1;
      put(g, 5 + dx, y + k, 5 + dz, win ? 0xffd28a : k % 3 === 2 ? 0xc98b4a : 0xf2dfbc, win);
    }
    for (let dz = -1; dz <= 1; dz++) for (let dx = -1; dx <= 1; dx++) put(g, 5 + dx, y + 6, 5 + dz, 0x4fb3a9);
    for (const [dx, dz] of [[0, 0], [1, 0], [0, 1], [1, 1]]) put(g, 4 + dx, y + 7, 4 + dz, 0x9fe0d0);
    put(g, 7, y + 4, 5, 0xe9b949); put(g, 7, y + 4, 4, 0xe9b949);
    return g;
  },
  Festival: (B) => { // a pagoda on a dark summit, its eaves hung with lanterns
    const g = terrain(grid(12, 15, 11), { peaks: [{ x: 5, z: 5, h: 6, r: 5.2, p: 0.8 }], spurs: [{ x0: 5, z0: 5, x1: 10, z1: 8, h0: 4, h1: 2, w: 2.5 }], ...B });
    caps(g, B.ground, B);
    let y = hAt(g, 5, 5);
    for (const r of [1, 1, 0]) {
      for (let dx = -r; dx <= r; dx++) for (let dz = -r; dz <= r; dz++) put(g, 5 + dx, y, 5 + dz, 0xf7e3cf);
      y++;
      for (let dx = -r - 1; dx <= r + 1; dx++) for (let dz = -r - 1; dz <= r + 1; dz++) put(g, 5 + dx, y, 5 + dz, 0xe05a4a);
      put(g, 5 + r + 1, y - 1, 5 + r + 1, 0xffb36b, true);
      y++;
    }
    put(g, 5, y, 5, 0xffd98a, true);
    return g;
  },
  Frost: (B) => { // sharp asymmetric horns, snow on the top faces only
    const g = terrain(grid(13, 14, 12), { peaks: [{ x: 4.5, z: 5, h: 13, r: 6, p: 1.3, tip: 1.6 }, { x: 9.5, z: 7, h: 8, r: 3.6, p: 1.2, tip: 1.4 }], spurs: [{ x0: 4.5, z0: 5, x1: 11, z1: 3, h0: 8, h1: 3, w: 2.4 }], ...B });
    caps(g, B.ground2, { snow: 0xffffff, snowFrom: 6 });
    return g;
  },
  Clouds: (B) => { // a slender spire with one pennant, a second spire beside it
    const g = terrain(grid(11, 15, 10), { peaks: [{ x: 4, z: 4, h: 12, r: 3.6, p: 1 }, { x: 8, z: 6, h: 8, r: 2.8, p: 1 }], ...B });
    caps(g, B.ground, B);
    // a 2x2 cairn with a pennant, not a pole
    const y = hAt(g, 4, 4);
    for (let k = 0; k < 2; k++) for (const [dx, dz] of [[0, 0], [1, 0], [0, 1], [1, 1]]) put(g, 4 + dx, y + k, 4 + dz, k ? 0xfffaf2 : 0xd9dff4);
    put(g, 4, y + 2, 4, 0x8a5a3c); put(g, 4, y + 3, 4, 0x8a5a3c);
    put(g, 5, y + 3, 4, 0xf2a95a); put(g, 6, y + 3, 4, 0xf2a95a); put(g, 5, y + 2, 4, 0xf2a95a);
    return g;
  },
  Night: (B) => { // a crystal spire summit, star-glints on its top faces
    const g = terrain(grid(12, 15, 11), { peaks: [{ x: 5, z: 5, h: 8, r: 5.5, p: 1.2 }], spurs: [{ x0: 5, z0: 5, x1: 10, z1: 8, h0: 5, h1: 2, w: 2.5 }], ...B });
    caps(g, B.ground, B);
    const y = hAt(g, 5, 5);
    // a 2x2 crystal, tall, lit at its tip, with a shorter one leaning beside it
    for (let k = 0; k < 6; k++) for (const [dx, dz] of k < 5 ? [[0, 0], [1, 0], [0, 1], [1, 1]] : [[0, 0]]) put(g, 5 + dx, y + k, 5 + dz, k < 3 ? 0xa9b8f2 : 0xdfe6ff, k >= 4);
    for (let k = 0; k < 3; k++) for (const [dx, dz] of [[0, 0], [1, 0]]) put(g, 3 + dx, y + k, 7 + dz, k < 2 ? 0xb9c8ff : 0xeef2ff, k === 2);
    return g;
  },
};

/**
 * The peaks for a biome: its signature summit first, then its own landforms.
 * make(k) builds one at k cubes per design voxel (1: as designed).
 */
export function peaksFor(p) {
  const B = biomeOf(p);
  const sig = SIGNATURE[p.name];
  const [fa, fb] = (FAMILY[p.name] ?? ['hills', 'domes']).map((f) => LANDFORM[f]);
  const cap = (g) => { tidy(g); caps(g, B.ground, { snow: 0xffffff, snowFrom: snowy[p.name] ?? Infinity }); return g; };
  const at = (build) => (k = 1) => { K = k; try { return build(); } finally { K = 1; } };
  return [
    { kind: 'signature', make: at(() => tidy(sig ? sig(B) : cap(fa(B, 0)))) },
    { kind: 'landform', make: at(() => cap(fa(B, 0))) },
    { kind: 'landform', make: at(() => cap(fb(B, 1))) },
    { kind: 'far', make: at(() => cap(fa(B, 2))) },
    { kind: 'far', make: at(() => cap(fb(B, 2))) },
  ];
}

// the builders, for studies of new summits (shots/peaks-r4/variants.js)
export { terrain, caps, tidy, put, hAt, tree };
