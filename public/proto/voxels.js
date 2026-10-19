// Voxel scenery for the map (docs/map-study.md): islands built from cubes in
// the game's own look, rendered once by the game's block shader (cubes.js: the
// face-colour ramp, crease AO, bases sinking into haze) into sprites for the
// flat layers. Scenery, not puzzles: any size, any detail, glowing cubes.
import * as THREE from 'three';
import { Cubes } from '../js/cubes.js';
import { Puzzle } from '../js/puzzle.js';

// ---------------------------------------------------------------- a voxel grid
export function grid(X, Y, Z) {
  const v = new Uint32Array(X * Y * Z);
  const glow = new Set();
  const at = (x, y, z) => x + X * (y + Y * z);
  const ok = (x, y, z) => x >= 0 && y >= 0 && z >= 0 && x < X && y < Y && z < Z;
  const g = {
    X, Y, Z, v, glow,
    ok,
    get: (x, y, z) => (ok(x, y, z) ? v[at(x, y, z)] : 0),
    set(x, y, z, c, lit = false) {
      x = Math.round(x); y = Math.round(y); z = Math.round(z);
      if (!ok(x, y, z)) return g;
      v[at(x, y, z)] = c;
      if (lit) glow.add(at(x, y, z)); else glow.delete(at(x, y, z));
      return g;
    },
    clear(x, y, z) { if (ok(x, y, z)) { v[at(x, y, z)] = 0; glow.delete(at(x, y, z)); } return g; },
    box(x0, x1, y0, y1, z0, z1, c, lit) {
      for (let z = z0; z <= z1; z++) for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) g.set(x, y, z, typeof c === 'function' ? c(x, y, z) : c, lit);
      return g;
    },
    blob(cx, cy, cz, rx, ry, rz, c, rand, rough = 0.18) {
      for (let z = Math.floor(cz - rz - 1); z <= cz + rz + 1; z++) for (let y = Math.floor(cy - ry - 1); y <= cy + ry + 1; y++) for (let x = Math.floor(cx - rx - 1); x <= cx + rx + 1; x++) {
        const d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 + ((z - cz) / rz) ** 2;
        if (d <= 1 + (rand ? (rand() - 0.5) * rough * 2 : 0)) g.set(x, y, z, typeof c === 'function' ? c(x, y, z) : c);
      }
      return g;
    },
    top(x, z) { for (let y = Y - 1; y >= 0; y--) if (v[at(x, y, z)]) return y; return -1; },
  };
  return g;
}

// ---------------------------------------------------------------- colours
const mix = (a, b, t) => {
  const c = (h, s) => (h >> s) & 255;
  return [16, 8, 0].reduce((o, s) => o | (Math.round(c(a, s) + (c(b, s) - c(a, s)) * t) << s), 0);
};
const jit = (c, rand, amt = 0.06) => mix(c, rand() < 0.5 ? 0x000000 : 0xffffff, rand() * amt);

// ---------------------------------------------------------------- building blocks
// A natural island: stacked noisy rings narrowing downward into the cloud, with
// strata on the sides (a nod to the game's name) and a cap of ground on top.
function isle(g, rand, cx, cz, r, h, { rock, rock2, ground, ground2, depth = 0.7, flat = 0.25 }) {
  const top = h - 1;
  for (let y = 0; y <= top; y++) {
    const t = y / Math.max(1, top);
    // narrow at the bottom (sinking into cloud), widest just under the top
    const rr = r * (0.35 + 0.65 * Math.pow(t, depth)) * (1 - flat * Math.max(0, t - 0.92) * 8);
    for (let z = Math.floor(cz - rr - 2); z <= cz + rr + 2; z++) for (let x = Math.floor(cx - rr - 2); x <= cx + rr + 2; x++) {
      const a = Math.atan2(z - cz, x - cx);
      const wob = 1 + 0.16 * Math.sin(a * 3 + cx) + 0.1 * Math.sin(a * 7 + cz * 0.7) + (rand() - 0.5) * 0.12;
      if (Math.hypot(x - cx, z - cz) <= rr * wob) {
        const band = Math.floor(y / 2) % 2 ? rock : rock2;
        g.set(x, y, z, y >= top - (y === top ? 0 : 0) && y === top ? (rand() < 0.2 ? ground2 : ground) : jit(band, rand, 0.05));
      }
    }
  }
  // the ground spills one cube down the edge here and there
  for (let z = 0; z < g.Z; z++) for (let x = 0; x < g.X; x++) {
    const ty = g.top(x, z);
    if (ty === top - 1 && rand() < 0.5) g.set(x, ty, z, ground2);
  }
  return top + 1;
}
// A mountain top: rings narrowing upward from a wide base in the cloud
function peak(g, rand, cx, cz, r, h, { rock, rock2, snow, snowFrom = 0.62 }) {
  for (let y = 0; y < h; y++) {
    const t = y / h, rr = r * Math.pow(1 - t, 0.85) + 0.4;
    for (let z = Math.floor(cz - rr - 2); z <= cz + rr + 2; z++) for (let x = Math.floor(cx - rr - 2); x <= cx + rr + 2; x++) {
      const a = Math.atan2(z - cz, x - cx);
      const wob = 1 + 0.2 * Math.sin(a * 3 + y * 0.4) + (rand() - 0.5) * 0.18;
      if (Math.hypot(x - cx, z - cz) <= rr * wob) g.set(x, y, z, t > snowFrom - 0.08 * Math.sin(a * 2) ? snow : Math.floor(y / 2) % 2 ? rock : rock2);
    }
  }
}
function tree(g, rand, x, y, z, { trunk, leaf, leaf2, leaf3, size = 3, kind = 'round' }) {
  const th = kind === 'pine' ? 2 : size;
  for (let k = 0; k < th; k++) g.set(x, y + k, z, trunk);
  if (kind === 'pine') {
    const layers = size + 2;
    for (let k = 0; k < layers; k++) {
      const r = (layers - k) * 0.55 + 0.3;
      for (let dz = -2; dz <= 2; dz++) for (let dx = -2; dx <= 2; dx++) if (Math.hypot(dx, dz) <= r) g.set(x + dx, y + th + k, z + dz, k % 2 ? leaf : leaf2);
    }
    g.set(x, y + th + layers, z, leaf3 ?? leaf);
    return;
  }
  if (kind === 'palm') {
    for (let k = 0; k < size + 2; k++) g.set(x + (k > size - 1 ? 1 : 0), y + k, z, trunk);
    const ty = y + size + 2;
    for (const [dx, dz] of [[1, 0], [2, 0], [3, -1], [-1, 0], [-2, 1], [0, 1], [0, 2], [1, 3], [0, -1], [-1, -2]]) g.set(x + 1 + dx, ty - (Math.abs(dx) + Math.abs(dz) > 2 ? 1 : 0), z + dz, rand() < 0.5 ? leaf : leaf2);
    g.set(x + 1, ty, z, leaf3 ?? leaf);
    return;
  }
  const r = size * 0.8 + 0.6;
  g.blob(x, y + th + r * 0.7, z, r, r * 0.85, r, (xx, yy) => (yy > y + th + r * 0.9 ? leaf3 ?? leaf : rand() < 0.5 ? leaf : leaf2), rand, 0.25);
}
function waterfall(g, rand, x, z, fromY, { water, foam }) {
  for (let y = fromY; y >= 0; y--) {
    g.set(x, y, z, rand() < 0.25 ? foam : water);
    if (rand() < 0.5) g.set(x + 1, y, z, rand() < 0.3 ? foam : water);
  }
}
function lantern(g, x, y, z, { post, lamp }) {
  g.set(x, y, z, post).set(x, y + 1, z, post).set(x, y + 2, z, lamp, true);
}
function torii(g, x, y, z, { red, dark }) {
  for (let k = 0; k < 5; k++) { g.set(x, y + k, z, red).set(x + 4, y + k, z, red); }
  for (let dx = -1; dx <= 5; dx++) g.set(x + dx, y + 5, z, dark);
  for (let dx = 0; dx <= 4; dx++) g.set(x + dx, y + 3, z, red);
}

// ---------------------------------------------------------------- the biomes
// Each palette (a chapter's biome) gets its signature islands. Colours lean on
// the palette's own ramp so a biome reads as its chapter.
export function designs(p) {
  const base = { rock: mix(p.shade, p.lit, 0.35), rock2: mix(p.shade, p.under, 0.25), ground: mix(p.top, 0x9fd18a, 0.35), ground2: mix(p.top, 0x86c77f, 0.5) };
  const leaves = { trunk: 0x8a5a3c, leaf: 0x7cc47f, leaf2: 0x5fae6e, leaf3: 0xa8dc96 };
  const water = { water: 0x7cc6e8, foam: 0xe9f7ff };
  const warm = { post: mix(p.shade, 0x6b4a3a, 0.4), lamp: 0xffd27a };
  const name = p.name;
  const S = {
    // a meadow island with a waterfall and a cottage whose window is lit
    meadow: (rand) => {
      const g = grid(22, 18, 22);
      const h = isle(g, rand, 11, 11, 9.5, 10, base);
      g.box(8, 12, h, h + 2, 9, 12, 0xf6e7d2).box(8, 12, h + 3, h + 3, 9, 12, mix(p.lit, 0xd9725e, 0.6)).box(9, 11, h + 4, h + 4, 10, 11, mix(p.lit, 0xb85a4a, 0.6));
      g.set(12, h + 1, 11, 0xffd58a, true);
      tree(g, rand, 15, h, 7, { ...leaves, leaf: 0xf4a3b5, leaf2: 0xe2728f, leaf3: 0xfcd0da });
      tree(g, rand, 5, h, 13, { ...leaves, size: 2 });
      waterfall(g, rand, 19, 14, h - 1, water);
      return g;
    },
    // a tall rock with strata and a tree on top
    spire: (rand, k = {}) => {
      const g = grid(14, 26, 14);
      const h = isle(g, rand, 7, 7, 4.5, 20, { ...base, depth: 0.25, flat: 0.1, ...k });
      tree(g, rand, 7, h, 7, { ...leaves, size: 2, ...(k.tree ?? {}) });
      return g;
    },
    grove: (rand, tk = {}) => {
      const g = grid(24, 16, 24);
      const h = isle(g, rand, 12, 12, 10.5, 8, base);
      for (let i = 0; i < 6; i++) tree(g, rand, 5 + Math.floor(rand() * 14), h, 5 + Math.floor(rand() * 14), { ...leaves, size: 2 + Math.floor(rand() * 2), ...tk });
      return g;
    },
    pond: (rand) => {
      const g = grid(22, 14, 22);
      const h = isle(g, rand, 11, 11, 9.5, 8, base);
      for (let z = 7; z <= 14; z++) for (let x = 7; x <= 14; x++) if (Math.hypot(x - 10.5, z - 10.5) < 3.6) g.set(x, h - 1, z, 0x8fd3e8);
      for (const [x, z] of [[6, 15], [15, 6], [16, 15]]) lantern(g, x, h, z, warm);
      tree(g, rand, 5, h, 6, { ...leaves, size: 2 });
      return g;
    },
  };
  const kit = {
    Dawn: [S.meadow, (r) => S.spire(r), (r) => S.grove(r, { leaf: 0xf4a3b5, leaf2: 0xe9b3c8, leaf3: 0xfcd8e2 })],
    Teatime: [(r) => { // a layered cake of a mesa with a teapot house
      const g = grid(22, 18, 22);
      const h = isle(g, r, 11, 11, 9, 11, { rock: 0xf3d9b8, rock2: 0xe0a77f, ground: 0xfff4e6, ground2: 0xf6c0c8, depth: 0.25, flat: 0 });
      g.blob(11, h + 2, 11, 3, 2.4, 3, 0x9fd4c4, r, 0.05).set(15, h + 2, 11, 0x9fd4c4).set(16, h + 3, 11, 0x9fd4c4).set(11, h + 5, 11, 0xfff4e6);
      g.set(11, h + 1, 14, 0xffd58a, true);
      return g;
    }, (r) => S.spire(r, { ground: 0xfff4e6, ground2: 0xf6c0c8, tree: { leaf: 0x9fd4c4, leaf2: 0x6fb8a4, leaf3: 0xc8eee0 } })],
    Mint: [S.pond, (r) => S.grove(r), (r) => S.spire(r)],
    Orchard: [(r) => S.grove(r, { leaf: 0x9cc96a, leaf2: 0x7fae5a, leaf3: 0xe0785f }), (r) => S.grove(r, { leaf: 0xb8c97a, leaf2: 0x8fae5a, leaf3: 0xf2c89a })],
    Autumn: [(r) => S.grove(r, { leaf: 0xf0a04b, leaf2: 0xd9733f, leaf3: 0xf6c27a, kind: 'round' }), (r) => {
      const g = grid(22, 22, 22);
      const h = isle(g, r, 11, 11, 9, 9, base);
      for (let i = 0; i < 5; i++) tree(g, r, 4 + Math.floor(r() * 14), h, 4 + Math.floor(r() * 14), { trunk: 0x6b4a3a, leaf: 0x3f8a5b, leaf2: 0x2f6a4a, kind: 'pine', size: 3 + Math.floor(r() * 2) });
      g.box(9, 13, h, h + 2, 9, 12, 0x8a5a3c).box(9, 13, h + 3, h + 3, 9, 12, 0x6b4a3a).set(13, h + 1, 12, 0xffc46b, true);
      return g;
    }],
    Lagoon: [(r) => { // an atoll: sand ring, lagoon water, a palm and a lighthouse
      const g = grid(24, 18, 24);
      const h = isle(g, r, 12, 12, 10.5, 6, { rock: 0xe8d3a3, rock2: 0xd9b48f, ground: 0xf6e6c0, ground2: 0xe8d3a3, depth: 0.5 });
      for (let z = 0; z < 24; z++) for (let x = 0; x < 24; x++) if (Math.hypot(x - 12, z - 12) < 6) g.set(x, h - 1, z, Math.hypot(x - 12, z - 12) < 4 ? 0x4fb3c9 : 0x8fe0dc);
      tree(g, r, 4, h, 12, { trunk: 0xb9773f, leaf: 0x5fae6e, leaf2: 0x86c77f, kind: 'palm', size: 3 });
      for (let k = 0; k < 9; k++) g.set(18, h + k, 7, k % 3 === 1 ? 0xe0565b : 0xfbf8f2);
      g.set(18, h + 9, 7, 0xffe08a, true);
      return g;
    }, (r) => S.spire(r, { ground: 0xf6e6c0, tree: { kind: 'palm', trunk: 0xb9773f, size: 3 } })],
    Deep: [(r) => { // dark spires with glowing coral
      const g = grid(18, 28, 18);
      isle(g, r, 9, 9, 5, 22, { rock: 0x24506a, rock2: 0x1d4258, ground: 0x2f6a7a, ground2: 0x4a8590, depth: 0.2, flat: 0 });
      for (let i = 0; i < 14; i++) { const x = Math.floor(r() * 18), z = Math.floor(r() * 18), y = 4 + Math.floor(r() * 18); if (g.get(x, y, z)) { const dx = x < 9 ? -1 : 1; g.set(x + dx, y, z, r() < 0.5 ? 0x7ff3e6 : 0xffb0d0, true); } }
      return g;
    }, (r) => {
      const g = grid(20, 16, 20);
      const h = isle(g, r, 10, 10, 8, 8, { rock: 0x24506a, rock2: 0x2f5f78, ground: 0x4a8590, ground2: 0x2f6a7a });
      for (let i = 0; i < 9; i++) { const x = 3 + Math.floor(r() * 14), z = 3 + Math.floor(r() * 14), n = 2 + Math.floor(r() * 4); for (let k = 0; k < n; k++) g.set(x, h + k, z, k === n - 1 ? 0x7ff3e6 : 0xe86a8a, k === n - 1); }
      return g;
    }],
    Desert: [(r) => { // a sandstone mesa with an arch and an oasis
      const g = grid(24, 20, 22);
      const h = isle(g, r, 12, 11, 10, 9, { rock: 0xe59a5c, rock2: 0xc27f62, ground: 0xfde7b8, ground2: 0xf6c48e, depth: 0.3, flat: 0 });
      for (let k = 0; k < 7; k++) { g.set(5, h + k, 9, 0xe59a5c).set(5, h + k, 10, 0xc27f62).set(12, h + k, 9, 0xe59a5c).set(12, h + k, 10, 0xc27f62); }
      g.box(5, 12, h + 7, h + 8, 9, 10, 0xf6c48e);
      for (let z = 13; z <= 17; z++) for (let x = 13; x <= 18; x++) if (Math.hypot(x - 15.5, z - 15) < 2.6) g.set(x, h - 1, z, 0x45b4b8);
      tree(g, r, 18, h, 13, { trunk: 0xb9773f, leaf: 0x5fae6e, leaf2: 0x86c77f, kind: 'palm', size: 3 });
      return g;
    }, (r) => S.spire(r, { rock: 0xe59a5c, rock2: 0xc27f62, ground: 0xfde7b8, ground2: 0xf6c48e, tree: { kind: 'palm', trunk: 0xb9773f, size: 3 } })],
    Dusk: [(r) => { // stepped temple with a torii and lanterns
      const g = grid(24, 24, 24);
      const h = isle(g, r, 12, 12, 10.5, 7, base);
      for (let s = 0; s < 4; s++) g.box(6 + s * 2, 17 - s * 2, h + s * 2, h + s * 2 + 1, 6 + s * 2, 17 - s * 2, s % 2 ? 0xffdcbc : 0xec938a);
      g.box(11, 12, h + 8, h + 9, 11, 12, 0xffdcbc).set(11, h + 10, 11, 0xffc8a2, true);
      torii(g, 9, h, 19, { red: 0xd9534f, dark: 0x3d2e63 });
      for (const [x, z] of [[5, 5], [18, 5], [5, 18]]) lantern(g, x, h, z, { post: 0x6c518d, lamp: 0xffc8a2 });
      return g;
    }, (r) => S.spire(r)],
    Stones: [(r) => { // a stone circle on a mossy hill
      const g = grid(24, 18, 24);
      const h = isle(g, r, 12, 12, 10.5, 7, { ...base, ground: 0x9fb58a, ground2: 0x86a07a });
      for (let i = 0; i < 9; i++) { const a = (i / 9) * Math.PI * 2, x = Math.round(12 + Math.cos(a) * 6.5), z = Math.round(12 + Math.sin(a) * 6.5), n = 3 + Math.floor(r() * 3); for (let k = 0; k < n; k++) g.set(x, h + k, z, k === n - 1 && r() < 0.5 ? 0xd2a64a : 0xd8d0c0); }
      for (let k = 0; k < 7; k++) g.set(12, h + k, 12, 0xd8d0c0);
      return g;
    }, (r) => S.spire(r, { rock: 0xd8d0c0, rock2: 0x8a9a92, ground: 0x9fb58a })],
    Clockwork: [(r) => { // a brass tower with a gear and lit windows
      const g = grid(20, 30, 20);
      const h = isle(g, r, 10, 10, 8, 8, { rock: 0x7a5038, rock2: 0x5e3f30, ground: 0xc98b4a, ground2: 0xe0a868 });
      for (let k = 0; k < 16; k++) for (let dz = -2; dz <= 2; dz++) for (let dx = -2; dx <= 2; dx++) if (Math.abs(dx) + Math.abs(dz) <= 3) g.set(10 + dx, h + k, 10 + dz, k % 4 === 2 && ((dx === 2 && dz === 0) || (dz === 2 && dx === 0)) ? 0xffd28a : (k % 4 === 3 ? 0xb07a3a : 0xe0a868), k % 4 === 2 && ((dx === 2 && dz === 0) || (dz === 2 && dx === 0)));
      g.blob(10, h + 17, 10, 2.5, 2, 2.5, 0x9fe0d0);
      for (let a = 0; a < 12; a++) { const x = 10 + Math.round(Math.cos(a / 12 * Math.PI * 2) * 4), y = h + 9 + Math.round(Math.sin(a / 12 * Math.PI * 2) * 4); g.set(x, y, 13, a % 2 ? 0xb07a3a : 0xe9b949); }
      return g;
    }, (r) => S.spire(r, { rock: 0x7a5038, rock2: 0x5e3f30, ground: 0xc98b4a, ground2: 0xe0a868, tree: { leaf: 0x4fb3a9, leaf2: 0x2f7a78, leaf3: 0x9fe0d0 } })],
    Festival: [(r) => { // a pagoda hung with lanterns
      const g = grid(22, 30, 22);
      const h = isle(g, r, 11, 11, 9, 7, { rock: 0x5d3a6e, rock2: 0x2e1f47, ground: 0x6b2346, ground2: 0x8a3a5a });
      for (let t = 0; t < 4; t++) {
        const y = h + t * 5, w = 4 - t * 0.7;
        g.box(Math.round(11 - w + 1), Math.round(11 + w - 1), y, y + 2, Math.round(11 - w + 1), Math.round(11 + w - 1), 0xf7e3cf);
        g.box(Math.round(11 - w - 1), Math.round(11 + w + 1), y + 3, y + 3, Math.round(11 - w - 1), Math.round(11 + w + 1), 0xe88a6a);
        g.set(Math.round(11 + w + 1), y + 2, 11, 0xffb36b, true).set(11, y + 2, Math.round(11 + w + 1), 0xffb36b, true);
      }
      for (let i = 0; i < 5; i++) g.set(2 + Math.floor(r() * 18), h + 6 + Math.floor(r() * 14), 2 + Math.floor(r() * 18), 0xffb36b, true);
      return g;
    }, (r) => S.spire(r, { rock: 0x5d3a6e, rock2: 0x2e1f47, ground: 0x6b2346, tree: { leaf: 0xe88a6a, leaf2: 0xc06a5a, leaf3: 0xffb36b } })],
    Frost: [(r) => { // a snowy peak with pines and a lit igloo
      const g = grid(26, 28, 26);
      peak(g, r, 13, 13, 12, 26, { rock: 0x8fa6c4, rock2: 0x6f86aa, snow: 0xffffff, snowFrom: 0.55 });
      peak(g, r, 6, 18, 5, 12, { rock: 0x8fa6c4, rock2: 0x6f86aa, snow: 0xffffff, snowFrom: 0.5 });
      for (let i = 0; i < 7; i++) { const x = 2 + Math.floor(r() * 22), z = 2 + Math.floor(r() * 22), t = g.top(x, z); if (t > 0 && t < 9) tree(g, r, x, t + 1, z, { trunk: 0x6b4a3a, leaf: 0x3f6f62, leaf2: 0x2f5a52, leaf3: 0xffffff, kind: 'pine', size: 2 }); }
      return g;
    }, (r) => {
      const g = grid(18, 14, 18);
      const h = isle(g, r, 9, 9, 7.5, 6, { rock: 0x8fa6c4, rock2: 0x5b6f92, ground: 0xffffff, ground2: 0xeef4fb });
      g.blob(9, h, 9, 3.2, 2.8, 3.2, 0xf4f8ff);
      g.box(8, 10, h, h + 1, 12, 12, 0xffb36b, true);
      return g;
    }],
    Clouds: [(r) => { // a floating isle trailing a waterfall into the clouds
      const g = grid(22, 30, 22);
      const lift = 10;
      const h = isle(g, r, 11, 11, 9, 9, { ...base, depth: 0.25 });
      // lift the whole isle so it floats, its underside a hanging cone
      const moved = grid(22, 30, 22);
      for (let z = 0; z < 22; z++) for (let y = 0; y < 30 - lift; y++) for (let x = 0; x < 22; x++) { const c = g.get(x, y, z); if (c) moved.set(x, y + lift, z, c); }
      tree(moved, r, 9, h + lift, 9, { ...leaves, size: 3 });
      waterfall(moved, r, 17, 12, h + lift - 1, { water: 0xbfe6ff, foam: 0xffffff });
      return moved;
    }, (r) => S.spire(r, { tree: { leaf: 0xfffaf2, leaf2: 0xf6d6c4, leaf3: 0xffffff } })],
    Night: [(r) => { // an observatory on a peak, crystals glowing
      const g = grid(22, 28, 22);
      const h = isle(g, r, 11, 11, 9, 14, { rock: 0x4f5a8f, rock2: 0x2a3262, ground: 0xc7b6db, ground2: 0x8f9ac4, depth: 0.4 });
      g.box(8, 14, h, h + 3, 8, 14, 0xf2e9da).blob(11, h + 4, 11, 3.6, 3, 3.6, 0xc7b6db);
      g.box(13, 15, h + 5, h + 6, 10, 11, 0x4f5a8f).set(11, h + 1, 15, 0xffd58a, true);
      for (let i = 0; i < 6; i++) { const x = 2 + Math.floor(r() * 18), z = 2 + Math.floor(r() * 18), t = g.top(x, z); if (t >= 0 && t < h - 1) for (let k = 1; k <= 2 + Math.floor(r() * 2); k++) g.set(x, t + k, z, 0xb9c8ff, true); }
      return g;
    }, (r) => S.spire(r, { rock: 0x4f5a8f, rock2: 0x2a3262, ground: 0xc7b6db, tree: { kind: 'pine', trunk: 0x2a3262, leaf: 0x4f5a8f, leaf2: 0x3a4478, leaf3: 0xdfe6ff } })],
  };
  return kit[name] ?? [S.meadow, S.spire, S.grove];
}

// ---------------------------------------------------------------- rendering
const C = (h) => new THREE.Color(h);
let renderer = null, cubes = null, scene = null, camera = null;
function setup() {
  if (renderer) return;
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
  cubes = new Cubes();
  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -500, 500);
}
export function dispose() {
  renderer?.dispose(); renderer?.forceContextLoss?.();
  renderer = cubes = scene = camera = null;
}

/**
 * Renders a voxel grid in the game's iso view with the block shader: true
 * colours (as a solved stone), crease AO, the base sinking into `haze`.
 * ppv: CSS px per voxel. Returns { url, w, h } with w/h in CSS px and the
 * sprite's anchor (where its base centre sits) as ax/ay fractions.
 */
export function renderVoxels(g, palette, { ppv = 4.2, dpr = 2, haze, tint = null, fade = 0 } = {}) {
  setup();
  const THREE_ = THREE;
  const [X, Y, Z] = [g.X, g.Y, g.Z];
  const solid = new Uint8Array(X * Y * Z), colors = new Uint32Array(X * Y * Z);
  for (let i = 0; i < solid.length; i++) { if (g.v[i]) { solid[i] = 1; colors[i] = g.v[i]; } }
  const puzzle = new Puzzle([X, Y, Z], solid, colors);
  const mesh = cubes.build(puzzle);
  cubes.setPalette({ ...palette, skyBottom: haze ?? palette.skyBottom });
  const a = palette.lightAngle ?? 0, c = Math.cos(a), s = Math.sin(a);
  cubes.uniforms.uLight.value.set(-0.45 * c - 0.9 * s, -0.45 * s + 0.9 * c).normalize();
  for (let i = 0; i < solid.length; i++) if (!solid[i]) cubes.setState(i, undefined, undefined, 0);
  cubes.updateAO(puzzle, (i) => solid[i] === 1);
  cubes.uniforms.uTime.value = 10; cubes.uniforms.uReveal.value = 1; cubes.uniforms.uIntro.value = -99;
  cubes.uniforms.uPeel.value.set(0, 999, 1);
  if (!mesh.parent) scene.add(mesh);
  // the game's iso view: azimuth 45 degrees, elevation 0.56 rad
  const az = Math.PI / 4, el = 0.56;
  const dir = new THREE_.Vector3(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el));
  camera.position.copy(dir).multiplyScalar(200);
  camera.up.set(0, 1, 0);
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld();
  // fit: project the grid's corners
  const pts = [];
  for (let k = 0; k < 8; k++) pts.push(new THREE_.Vector3((k & 1 ? X : 0) - X / 2, (k & 2 ? Y : 0) - Y / 2, (k & 4 ? Z : 0) - Z / 2));
  const inv = camera.matrixWorldInverse;
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const p of pts) { const q = p.clone().applyMatrix4(inv); x0 = Math.min(x0, q.x); x1 = Math.max(x1, q.x); y0 = Math.min(y0, q.y); y1 = Math.max(y1, q.y); }
  camera.left = x0; camera.right = x1; camera.top = y1; camera.bottom = y0;
  camera.updateProjectionMatrix();
  const w = Math.round((x1 - x0) * ppv), h = Math.round((y1 - y0) * ppv);
  renderer.setPixelRatio(dpr);
  renderer.setSize(w, h, false);
  renderer.setRenderTarget(null);
  renderer.clear();
  renderer.render(scene, camera);
  // glowing cubes: a soft light painted over the render
  const out = document.createElement('canvas');
  out.width = Math.round(w * dpr); out.height = Math.round(h * dpr);
  const ctx = out.getContext('2d');
  ctx.drawImage(renderer.domElement, 0, 0);
  if (g.glow.size) {
    ctx.globalCompositeOperation = 'lighter';
    for (const i of g.glow) {
      const x = i % X, y = Math.floor(i / X) % Y, z = Math.floor(i / (X * Y));
      const v = new THREE_.Vector3(x + 0.5 - X / 2, y + 0.5 - Y / 2, z + 0.5 - Z / 2).project(camera);
      const px = (v.x * 0.5 + 0.5) * out.width, py = (-v.y * 0.5 + 0.5) * out.height, r = ppv * dpr * 1.8;
      const col = C(g.v[i]);
      const grad = ctx.createRadialGradient(px, py, 0, px, py, r);
      const rgb = `${Math.round(col.r * 255)},${Math.round(col.g * 255)},${Math.round(col.b * 255)}`;
      grad.addColorStop(0, `rgba(${rgb},.26)`); grad.addColorStop(1, `rgba(${rgb},0)`);
      ctx.fillStyle = grad; ctx.fillRect(px - r, py - r, r * 2, r * 2);
    }
  }
  // distance: the whole peak leans toward the mist's colour
  if (tint) {
    ctx.globalCompositeOperation = 'source-atop';
    const t = C(tint.color);
    ctx.fillStyle = `rgba(${Math.round(t.r * 255)},${Math.round(t.g * 255)},${Math.round(t.b * 255)},${tint.amount})`;
    ctx.fillRect(0, 0, out.width, out.height);
  }
  // the base dissolves: the lower part of the sprite fades out into the mist
  if (fade > 0) {
    ctx.globalCompositeOperation = 'destination-out';
    const y0 = out.height * (1 - fade), y1 = out.height * (1 - fade * 0.4);   // fully gone over the last 40% of the fade
    const grad = ctx.createLinearGradient(0, y0, 0, y1);
    grad.addColorStop(0, 'rgba(0,0,0,0)'); grad.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.fillStyle = grad; ctx.fillRect(0, y0, out.width, out.height - y0);
  }
  ctx.globalCompositeOperation = 'source-over';
  // where the base's centre lands, so the sprite can be placed by its foot
  const foot = new THREE_.Vector3(0, -Y / 2, 0).project(camera);
  return { url: out.toDataURL('image/png'), w, h, ax: foot.x * 0.5 + 0.5, ay: -foot.y * 0.5 + 0.5 };
}
