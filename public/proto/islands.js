// Low-poly scenery for the cloud sea: island peaks per biome, coloured with the
// game's face ramp (cubes.js ramp(): top / lit / shade / under, picked by face
// normal and the palette's key light), baked into vertex colours so the world
// needs no lighting at run time. Plus the cloud puff geometry.
import * as THREE from 'three';

const col = (h) => new THREE.Color(h);
export const mixHex = (a, b, t) => col(a).lerp(col(b), t);

// the ramp, as cubes.js: top faces, then sides between shade and lit by the
// light, under faces dark
export function rampColor(n, p, light, out = new THREE.Color()) {
  if (n.y > 0.72) return out.set(p.top);
  if (n.y < -0.5) return out.set(p.under);
  const len = Math.hypot(n.x, n.z) || 1;
  const l = ((n.x / len) * light.x + (n.z / len) * light.y) * 0.5 + 0.5;
  const s = l < 0.1 ? 0 : l > 0.9 ? 1 : (l - 0.1) / 0.8;
  out.set(p.shade).lerp(col(p.lit), s * s * (3 - 2 * s));
  // gentle slopes catch some of the top light
  if (n.y > 0.35) out.lerp(col(p.top), (n.y - 0.35) / 0.37 * 0.55);
  return out;
}

export function lightOf(p) {
  const a = p.lightAngle ?? 0, c = Math.cos(a), s = Math.sin(a);
  return new THREE.Vector2(-0.45 * c - 0.9 * s, -0.45 * s + 0.9 * c).normalize();
}

// ---- a tiny triangle soup builder
class Soup {
  constructor() { this.p = []; this.c = []; this.inside = null; }
  tri(a, b, c, color) {
    this.p.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z);
    for (let i = 0; i < 3; i++) this.c.push(color.r, color.g, color.b);
  }
  // colour a triangle by its own normal through the ramp; faces are turned to
  // point away from `inside` (set by each builder), so winding never matters
  rtri(a, b, c, p, light, tint = null, tintAmt = 0) {
    const n = new THREE.Vector3().subVectors(b, a).cross(new THREE.Vector3().subVectors(c, a)).normalize();
    if (this.inside) {
      const cx = (a.x + b.x + c.x) / 3 - this.inside.x, cy = (a.y + b.y + c.y) / 3 - this.inside.y, cz = (a.z + b.z + c.z) / 3 - this.inside.z;
      if (n.x * cx + n.y * cy + n.z * cz < 0) { n.negate(); const t = b; b = c; c = t; }
    }
    const k = rampColor(n, p, light);
    if (tint) k.lerp(tint, tintAmt);
    this.tri(a, b, c, k);
  }
  quad(a, b, c, d, p, light, tint, amt) { this.rtri(a, b, c, p, light, tint, amt); this.rtri(a, c, d, p, light, tint, amt); }
}
const V = (x, y, z) => new THREE.Vector3(x, y, z);

// a faceted peak: rings of jittered points narrowing to an apex
function peak(s, o, r, h, rand, p, light, { segs = 6, rings = 2, sharp = 1, snow = 0, base = -24 } = {}) {
  const ringPts = [];
  const levels = [base, ...Array.from({ length: rings }, (_, i) => h * ((i + 1) / (rings + 1)) ** (0.8 / sharp))];
  const radii = [r * 1.08, ...Array.from({ length: rings }, (_, i) => r * (1 - ((i + 1) / (rings + 1)) ** sharp))];
  const rot = rand() * Math.PI * 2;
  levels.forEach((y, li) => {
    const ring = [];
    for (let i = 0; i < segs; i++) {
      const a = rot + (i / segs) * Math.PI * 2 + (rand() - 0.5) * 0.5;
      const rr = radii[li] * (0.8 + rand() * 0.35);
      ring.push(V(o.x + Math.cos(a) * rr, o.y + y + (li ? (rand() - 0.5) * h * 0.08 : 0), o.z + Math.sin(a) * rr));
    }
    ringPts.push(ring);
  });
  const apex = V(o.x + (rand() - 0.5) * r * 0.25, o.y + h, o.z + (rand() - 0.5) * r * 0.25);
  const white = col(0xffffff);
  s.inside = V(o.x, o.y + base + (h - base) * 0.25, o.z);
  for (let li = 0; li < ringPts.length - 1; li++) {
    const A = ringPts[li], B = ringPts[li + 1];
    for (let i = 0; i < segs; i++) {
      const j = (i + 1) % segs;
      const hy = (B[i].y + B[j].y) / 2 - o.y;
      const t = snow && hy > h * (1 - snow) ? 0.8 : 0;
      s.quad(A[i], A[j], B[j], B[i], p, light, white, t);
    }
  }
  const top = ringPts[ringPts.length - 1];
  for (let i = 0; i < segs; i++) {
    const j = (i + 1) % segs;
    s.rtri(top[i], top[j], apex, p, light, white, snow ? 0.85 : 0);
  }
}

// a flat-topped mesa (or a step of a ziggurat)
function mesa(s, o, r, h, rand, p, light, { segs = 7, base = -24, flare = 1.15, rot = rand() * 6.28 } = {}) {
  const lo = [], hi = [];
  for (let i = 0; i < segs; i++) {
    const a = rot + (i / segs) * Math.PI * 2;
    const k = 0.88 + rand() * 0.2;
    lo.push(V(o.x + Math.cos(a) * r * flare * k, o.y + base, o.z + Math.sin(a) * r * flare * k));
    hi.push(V(o.x + Math.cos(a) * r * k, o.y + h, o.z + Math.sin(a) * r * k));
  }
  const c = V(o.x, o.y + h, o.z);
  s.inside = V(o.x, o.y + (base + h) * 0.4, o.z);
  for (let i = 0; i < segs; i++) {
    const j = (i + 1) % segs;
    s.quad(lo[i], lo[j], hi[j], hi[i], p, light);
    s.rtri(hi[i], hi[j], c, p, light);
  }
}

// an axis-aligned box (for steps, stones, arches, lanterns)
function box(s, o, w, h, d, p, light, rotY = 0, tint = null, amt = 0) {
  const cs = Math.cos(rotY), sn = Math.sin(rotY);
  const P = (x, y, z) => V(o.x + x * cs - z * sn, o.y + y, o.z + x * sn + z * cs);
  const x = w / 2, z = d / 2;
  s.inside = V(o.x, o.y + h / 2, o.z);
  const b = [P(-x, 0, -z), P(x, 0, -z), P(x, 0, z), P(-x, 0, z)];
  const t = [P(-x, h, -z), P(x, h, -z), P(x, h, z), P(-x, h, z)];
  s.quad(t[3], t[2], t[1], t[0], p, light, tint, amt);
  for (let i = 0; i < 4; i++) { const j = (i + 1) % 4; s.quad(b[i], b[j], t[j], t[i], p, light, tint, amt); }
}

function tree(s, o, size, p, light, leaf) {
  const lp = { ...p, top: leaf.top, lit: leaf.lit, shade: leaf.shade, under: leaf.under };
  box(s, o, size * 0.18, size * 0.5, size * 0.18, p, light);
  const r = () => 0.5;
  peak(s, V(o.x, o.y + size * 0.35, o.z), size * 0.42, size * 1.0, r, lp, light, { segs: 5, rings: 1, base: 0 });
}

// Biome kits: what pokes out of each chapter's clouds. Scenery only.
// kinds: peak, mound, mesa, steps, spire, stones, float, arch, dunes
export const KITS = {
  'First Light': { kinds: ['mound', 'peak', 'mound'], hero: 'peak', trees: 0.35 },
  'Teatime': { kinds: ['mesa', 'mound', 'mesa'], hero: 'mesa' },
  'Moss Garden': { kinds: ['mound', 'mound', 'peak'], hero: 'peak', trees: 0.7, leaf: 'moss' },
  'The Orchard': { kinds: ['mound', 'mound', 'mesa'], hero: 'mound', trees: 0.8, leaf: 'orchard' },
  'Autumn Woods': { kinds: ['peak', 'mound', 'peak'], hero: 'peak', trees: 0.8, leaf: 'autumn' },
  'The Lagoon': { kinds: ['mound', 'mesa', 'mound'], hero: 'peak', trees: 0.3, leaf: 'palm' },
  'The Deep': { kinds: ['spire', 'peak', 'spire'], hero: 'spire', glow: 0x7ff3e6 },
  'Desert Oasis': { kinds: ['mesa', 'dunes', 'arch'], hero: 'mesa' },
  'Ember Steps': { kinds: ['steps', 'peak', 'steps'], hero: 'steps' },
  'Old Stones': { kinds: ['stones', 'mound', 'peak'], hero: 'stones' },
  'Clockwork Workshop': { kinds: ['mesa', 'steps', 'spire'], hero: 'spire', glow: 0xffd28a },
  'Lantern Festival': { kinds: ['peak', 'mound', 'steps'], hero: 'steps', glow: 0xffb36b },
  'Frost Peaks': { kinds: ['peak', 'peak', 'peak'], hero: 'peak', snow: 0.45, sharp: 1.6 },
  'Cloud Isles': { kinds: ['float', 'float', 'mound'], hero: 'float' },
  'Starfall': { kinds: ['spire', 'peak', 'mound'], hero: 'peak', glow: 0xb9c8ff, snow: 0.2 },
};
const LEAVES = {
  moss: { top: 0xcfe8b8, lit: 0x9cc98f, shade: 0x5f8f7a, under: 0x3f6658 },
  orchard: { top: 0xe4e9a8, lit: 0xb8c97a, shade: 0x7f9466, under: 0x55684d },
  autumn: { top: 0xf6c27a, lit: 0xe08a4f, shade: 0x9a5a48, under: 0x5e3f45 },
  palm: { top: 0xc8ecc4, lit: 0x8ccfa8, shade: 0x4f9a8f, under: 0x2f6a6e },
};

/**
 * One island into the soup. `o` is its base centre on the cloud sea (y = 0),
 * `size` its footprint radius; returns its peak height.
 */
export function island(s, kind, o, size, rand, p, light, kit = {}, hero = false) {
  const h = size * (hero ? 3.0 + rand() * 0.6 : 0.9 + rand() * 0.9) * (kit.sharp ?? 1);
  if (kind === 'peak') peak(s, o, size, h, rand, p, light, { segs: 5 + Math.floor(rand() * 3), rings: 2, sharp: kit.sharp ?? 1, snow: kit.snow ?? 0 });
  else if (kind === 'spire') peak(s, o, size * 0.55, h * 1.35, rand, p, light, { segs: 5, rings: 3, sharp: 1.8, snow: kit.snow ?? 0 });
  else if (kind === 'mound') peak(s, o, size * 1.1, h * 0.55, rand, p, light, { segs: 7, rings: 2, sharp: 0.6 });
  else if (kind === 'dunes') { peak(s, o, size * 1.2, h * 0.35, rand, p, light, { segs: 6, rings: 1, sharp: 0.7 }); }
  else if (kind === 'mesa') mesa(s, o, size * 0.9, h * 0.7, rand, p, light);
  else if (kind === 'steps') {
    const n = 3 + Math.floor(rand() * 2), rot = rand() * 6.28;
    for (let i = 0; i < n; i++) box(s, V(o.x, o.y - 24 + i * (h / n), o.z), size * 1.5 * (1 - i / (n + 0.6)), h / n + 24 * (i ? 0 : 1), size * 1.5 * (1 - i / (n + 0.6)), p, light, rot);
  } else if (kind === 'stones') {
    mesa(s, o, size * 1.1, size * 0.25, rand, p, light, { segs: 8 });
    const n = 5 + Math.floor(rand() * 3);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      box(s, V(o.x + Math.cos(a) * size * 0.7, o.y + size * 0.2, o.z + Math.sin(a) * size * 0.7), size * 0.22, size * (0.7 + rand() * 0.5), size * 0.14, p, light, a);
    }
  } else if (kind === 'arch') {
    mesa(s, o, size * 0.9, size * 0.25, rand, p, light, { segs: 6 });
    const rot = rand() * 6.28, cs = Math.cos(rot), sn = Math.sin(rot);
    for (const sd of [-1, 1]) box(s, V(o.x + cs * sd * size * 0.45, o.y + size * 0.2, o.z + sn * sd * size * 0.45), size * 0.24, size * 1.1, size * 0.3, p, light, rot);
    box(s, V(o.x, o.y + size * 1.3, o.z), size * 1.2, size * 0.24, size * 0.34, p, light, rot);
  } else if (kind === 'float') {
    // a floating isle: a flat top over an inverted peak, lifted off the sea
    const lift = size * 1.2 + rand() * size;
    const q = V(o.x, o.y + lift, o.z);
    mesa(s, q, size, size * 0.18, rand, p, light, { segs: 7, base: 0, flare: 1 });
    // the underside: a peak built at the origin, mirrored down below the top
    const under = new Soup();
    peak(under, V(0, 0, 0), size * 0.95, size * 1.3, rand, p, light, { segs: 7, rings: 1, base: 0 });
    s.inside = V(q.x, q.y - size * 0.35, q.z);
    for (let i = 0; i < under.p.length; i += 9) {
      const at = (k) => V(under.p[i + k] + q.x, q.y - under.p[i + k + 1], under.p[i + k + 2] + q.z);
      s.rtri(at(0), at(3), at(6), p, light);
    }
    if (kit.trees) tree(s, V(q.x + size * 0.2, q.y + size * 0.18, q.z - size * 0.1), size * 0.6, p, light, LEAVES.moss);
    return lift + size * 1.4;
  }
  if (kit.trees && rand() < kit.trees && kind !== 'steps' && kind !== 'stones') {
    const leaf = LEAVES[kit.leaf] ?? LEAVES.moss;
    const n = 1 + Math.floor(rand() * 3);
    for (let i = 0; i < n; i++) {
      const a = rand() * 6.28, d = size * (0.3 + rand() * 0.45);
      const ty = kind === 'mound' ? h * 0.55 * 0.55 : kind === 'mesa' ? h * 0.7 : h * 0.35;
      tree(s, V(o.x + Math.cos(a) * d, o.y + ty - 6, o.z + Math.sin(a) * d), size * (0.35 + rand() * 0.2), p, light, leaf);
    }
  }
  return h;
}

export function soupGeometry(s) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(s.p, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(s.c, 3));
  return g;
}
export { Soup };

// A cloud puff: a soft, smooth-shaded ball (faceted puffs read as rubble next
// to the faceted islands; round clouds keep the two materials apart)
export function puffGeometry() {
  return new THREE.SphereGeometry(1, 12, 7);
}
