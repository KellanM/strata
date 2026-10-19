// Map study prototype: the map's real content and rules, laid out for the
// cloud-sea world. Not part of the game (docs/map-study.md).
//
// Units: x across the trail column (0 = centre), z down the map; both are CSS
// px at the cloud-sea surface in map view. The world puts y up and +z south.
import { SHAPES, CHAPTERS } from '../js/shapes.js';
import { PALETTES, variant } from '../js/palettes.js';
import { progress, bonusFor, bonusEntry } from '../js/map.js';
import { recordStars } from '../js/score.js';

export const COL = 360;          // trail column
export const STEP = 116;         // stone to stone
const GAP = 190;                 // chapter boundary: room for the cloud edge and the name
const SHRINE_STARS = 12;
const shrineStars = (r) => Math.min(SHRINE_STARS, r.items.length * 2);

export const paletteOf = (name) => PALETTES.find((p) => p.name === name) ?? PALETTES[0];

// the game's puzzleList() (main.js), unchanged
export function puzzleList() {
  return SHAPES.map((s, i) => {
    const mates = SHAPES.filter((o) => o.chapter === s.chapter);
    const k = mates.indexOf(s), t = mates.length > 1 ? k / (mates.length - 1) : 0.5;
    const base = PALETTES.find((p) => p.name === s.palette) ?? PALETTES[i % PALETTES.length];
    return { shape: s, palette: variant(base, t, i + 1), number: i + 1 };
  });
}

// ---- save states to look at (the game's own localStorage is only ever read)
const rec = (stars) => ({ time: 70, mistakes: 3 - stars, stars, score: 900 });
export const SCENARIOS = {
  new: 'New player: First Light open',
  mid: 'Mid journey: I done, II half (shrines open)',
  threshold: 'One stone before Moss Garden opens',
  late: 'Late: I–VIII done, IX begun',
  all: 'Everything solved (all 153 objects)',
  open: 'Dev unlock: all open, none solved',
  save: 'Your save on this device (read-only)',
};
export function scenarioSolved(name, entries) {
  const solved = {};
  const ch = (c) => entries.filter((e) => e.shape.chapter === CHAPTERS[c].name);
  const solve = (list, stars = 3) => list.forEach((e, i) => { solved[e.shape.id] = rec(typeof stars === 'function' ? stars(i) : stars); });
  if (name === 'mid') { solve(ch(0), (i) => (i === 3 ? 2 : 3)); solve(ch(1).slice(0, 5)); }
  if (name === 'threshold') { solve(ch(0), (i) => (i === 3 ? 2 : 3)); solve(ch(1).slice(0, 6)); }
  if (name === 'late') { for (let c = 0; c < 8; c++) solve(ch(c), (i) => (i % 4 ? 3 : 2)); solve(ch(8).slice(0, 3)); }
  if (name === 'all') {
    solve(entries);
    for (const c of CHAPTERS) { const b = bonusFor(c.name); if (b) solved[b.id] = rec(3); }
  }
  if (name === 'save') {
    try { Object.assign(solved, JSON.parse(localStorage.getItem('strata.solved') || '{}')); } catch {}
  }
  return solved;
}

/** Lays the map out. Returns { regions, nodes, trail, segments, height, ... }. */
export function buildMap({ scenario = 'mid', solved: given } = {}) {
  const entries = puzzleList();
  const solved = given ?? scenarioSolved(scenario, entries);
  const pr = progress(entries, solved);
  const open = scenario === 'open' ? entries.map(() => true) : pr.open;
  const first = entries.findIndex((e, i) => !solved[e.shape.id] && open[i]);
  const learned = true;

  const regions = [];
  for (const e of entries) {
    const name = e.shape.chapter;
    let r = regions[regions.length - 1];
    if (!r || r.name !== name) {
      const c = CHAPTERS.find((x) => x.name === name);
      regions.push((r = { name, numeral: c.numeral, line: c.line, base: paletteOf(c.palette), index: regions.length, items: [] }));
    }
    r.items.push(e);
  }

  const nodes = [];
  const trail = [];
  let k = 0, z = 210;
  const place = () => COL * 0.28 * Math.sin(k * 0.92 + 0.5);
  const learn = { kind: 'learn', x: place(), z, state: 'solved', palette: regions[0].items[0].palette, region: null };
  nodes.push(learn); trail.push(learn);
  k++; z += STEP * 0.9;

  for (const r of regions) {
    r.stars = r.items.reduce((n, e) => n + recordStars(e.shape, solved[e.shape.id]), 0);
    r.solvedCount = r.items.filter((e) => solved[e.shape.id]).length;
    r.complete = r.solvedCount === r.items.length;
    r.reached = r.complete || r.items.some((e) => !solved[e.shape.id] && open[entries.indexOf(e)]);
    r.top = z;                                   // where its sky and cloud begin
    z += GAP * 0.42;
    r.labelZ = z;
    z += GAP * 0.58;
    r.nodes = [];
    for (const e of r.items) {
      const i = entries.indexOf(e);
      const state = solved[e.shape.id] ? 'solved' : !open[i] ? 'locked' : i === first ? 'current' : 'open';
      const n = { kind: 'puzzle', x: place(), z, entry: e, palette: e.palette, state, region: r, index: i };
      nodes.push(n); trail.push(n); r.nodes.push(n);
      k++; z += STEP;
    }
    r.last = r.nodes[r.nodes.length - 1];
    const b = bonusFor(r.name);
    if (b) {
      const entry = bonusEntry(b);
      const left = r.last.x > 0;
      const need = shrineStars(r);
      r.shrine = {
        kind: 'bonus', x: (left ? -1 : 1) * COL * 0.4, z: r.last.z + STEP * 0.62, entry, palette: entry.palette, region: r, need,
        state: solved[b.id] ? 'solved' : scenario === 'open' || (r.stars >= need && r.reached) ? 'open' : 'locked',
      };
      nodes.push(r.shrine);
      z += STEP * 0.35;
    }
    r.bottom = z;
  }
  // Drift: endless, under the night at the very end
  const drift = { name: 'Drift', top: z, labelZ: z + GAP * 0.42 };
  z += GAP;
  [6, 8, 10].forEach((n, j) => nodes.push({ kind: 'drift', x: (j - 1) * COL * 0.3, z: z + (j === 1 ? 26 : 0), n, state: first < 0 ? 'current' : 'open', palette: paletteOf('Night'), region: null }));
  z += 180;
  drift.bottom = z;

  // the trail, as a Catmull-Rom curve through learn + puzzles
  const segments = [];
  let len = 0;
  for (let i = 0; i < trail.length - 1; i++) {
    const a = trail[i], b = trail[i + 1];
    // the unlocked path is gold; past it, faint where the chapter is reached, under cloud where not
    const kind = b.state === 'locked' ? (b.region?.reached ? 'faint' : 'hidden') : 'gold';
    const walked = (a.state === 'solved') && b.state === 'solved';
    const pts = curve(trail[i - 1] ?? a, a, b, trail[i + 2] ?? b, 14);
    const s0 = len;
    for (let j = 1; j < pts.length; j++) len += Math.hypot(pts[j].x - pts[j - 1].x, pts[j].z - pts[j - 1].z);
    segments.push({ a, b, kind, walked, pts, s0, s1: len });
  }
  // shrine spurs: from the chapter's last stone out to its shrine
  const spurs = regions.filter((r) => r.shrine).map((r) => {
    const a = r.last, s = r.shrine;
    const mid = { x: (a.x + s.x) / 2, z: s.z };
    const pts = [];
    for (let j = 0; j <= 10; j++) {
      const t = j / 10, u = 1 - t;
      pts.push({ x: u * u * a.x + 2 * u * t * mid.x + t * t * s.x, z: u * u * a.z + 2 * u * t * mid.z + t * t * s.z });
    }
    return { a, b: s, kind: s.state === 'locked' ? 'faint' : 'gold', pts, region: r };
  });

  const current = nodes.find((n) => n.state === 'current')
    ?? [...trail].reverse().find((n) => n.state === 'solved' && n.kind === 'puzzle') ?? learn;
  const done = entries.filter((e) => solved[e.shape.id]).length;
  return { entries, solved, regions, nodes, trail, segments, spurs, drift, height: z, current, done, total: entries.length };
}

// Catmull-Rom between b and c, sampled (n points, b included, c included)
function curve(a, b, c, d, n) {
  const out = [];
  for (let j = 0; j <= n; j++) {
    const t = j / n, t2 = t * t, t3 = t2 * t;
    const f = (p0, p1, p2, p3) => 0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
    out.push({ x: f(a.x, b.x, c.x, d.x), z: f(a.z, b.z, c.z, d.z) });
  }
  return out;
}

// x of the trail at depth z (for keeping scenery off the path)
export function trailXAt(map, z) {
  const t = map.trail;
  if (z <= t[0].z) return t[0].x;
  for (let i = 0; i < t.length - 1; i++) {
    if (z >= t[i].z && z <= t[i + 1].z) {
      const k = (z - t[i].z) / Math.max(1, t[i + 1].z - t[i].z);
      return t[i].x + (t[i + 1].x - t[i].x) * k;
    }
  }
  return t[t.length - 1].x;
}

// stable pseudo-random per string
export function rng(seedStr) {
  let h = 2166136261;
  for (const ch of seedStr) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0;
    h = Math.imul(h ^ (h >>> 13), 3266489909) >>> 0;
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}
