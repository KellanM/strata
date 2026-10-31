// The Daily Stone (docs/daily-stone.md; growth roadmap test 8): one stone a
// day, the same for everyone, carved from the drift's own generator
// (shapes.js randomShape) - an abstract block, never one of the levels'
// objects. Solved, it gives a spoiler-free share line, Wordle's way.
//
// Everything here is pure (no DOM, no three.js), so node --test runs it as is;
// storage is passed in (localStorage in the game), and nothing leaves the device.
//
// The day: the player's own calendar date, local time (Wordle's rule). The stone
// turns over at the player's midnight, so "today" means their today and a streak
// counts their days. Daily #N is a number of calendar days, so the seed comes
// from N alone: anyone on the same date has the same stone, and at any moment
// the world is on at most two neighbouring numbers. (UTC would put everyone on
// one stone at once, but turn it over mid-afternoon in the Americas and
// mid-morning in Asia; see docs/daily-stone.md.)

import { Puzzle, setClues, lineSolve, solveStats, difficulty, lineFits } from './puzzle.js';
import { randomShape, buildCells } from './shapes.js';
import { PALETTES, variant } from './palettes.js';

// Daily #1. Fixed for good once the first share has gone out: moving it
// renumbers (and so reseeds) every day after.
export const DAILY_EPOCH = Date.UTC(2026, 9, 31);   // 31 Oct 2026
export const DAILY_URL = 'https://kellanm.github.io/strata/';
const DAY = 86400000;

// Daily #N for a moment, by the local calendar date there (DST-proof: both
// ends are whole UTC dates)
export function dayNumber(date = new Date()) {
  return Math.round((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - DAILY_EPOCH) / DAY) + 1;
}
// the calendar date of Daily #N, 'YYYY-MM-DD'
export function dateOf(n) {
  return new Date(DAILY_EPOCH + (n - 1) * DAY).toISOString().slice(0, 10);
}

// The seed for day N's k-th try: an integer hash (no Math.random, no clock)
export function daySeed(n, attempt = 0) {
  let h = Math.imul((n | 0) ^ 0x5717a7a, 0x9e3779b1) ^ Math.imul(attempt + 1, 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 16), 0x7feb352d);
  h = Math.imul(h ^ (h >>> 15), 0x846ca68b);
  h ^= h >>> 16;
  return ((h >>> 0) % 2147483646) + 1;   // 1 .. 2^31 - 2 (randomShape wants a positive seed)
}

// What makes a good daily: a short session at a mid difficulty. The levels'
// chapters average D 9.3 (Beacon Hills) to 12.6 (Starfall); a 6-cube block in
// the middle of that is some 90-180 chisels, a few minutes.
export const DAILY_SIZE = 6;
export const DAILY_BAND = { minD: 9.5, maxD: 12.0, minChisel: 90, maxChisel: 180, minWaves: 4, maxWaves: 10 };
const ATTEMPTS = 200;

const puzzleOf = (shape) => {
  const { solid, colors } = buildCells(shape);
  return new Puzzle(shape.dims, solid, colors);
};

// every face of the block touches the stone: no empty slab on an edge (a whole
// row of 0s to chisel: taps that teach nothing, as the levels' test says)
function touchesEveryFace(p) {
  const [X, Y, Z] = p.dims;
  const lo = [X, Y, Z], hi = [-1, -1, -1];
  for (let i = 0; i < p.size; i++) {
    if (!p.solid[i]) continue;
    p.coords(i).forEach((v, a) => { lo[a] = Math.min(lo[a], v); hi[a] = Math.max(hi[a], v); });
  }
  return lo.every((v) => v === 0) && hi.every((v, a) => v === p.dims[a] - 1);
}

// Checks a candidate the way the levels are checked (puzzle.test.js): line
// logic alone settles every cell with the clues shown (so the answer is
// unique), and it sits in the band.
export function judge(shape, band = DAILY_BAND) {
  const p = puzzleOf(shape);
  const ok = setClues(p, shape) && lineSolve(p);
  if (!ok) return { ok: false, why: 'not line-solvable' };
  const stats = solveStats(p);
  const d = difficulty(stats, p);
  const chisel = p.size - p.solid.reduce((a, b) => a + b, 0);
  const why = !touchesEveryFace(p) ? 'an empty edge'
    : d < band.minD || d > band.maxD ? `difficulty ${d.toFixed(1)}`
    : chisel < band.minChisel || chisel > band.maxChisel ? `${chisel} chisels`
    : stats.rounds < band.minWaves || stats.rounds > band.maxWaves ? `${stats.rounds} waves`
    : null;
  return { ok: !why, why, d, chisel, waves: stats.rounds, puzzle: p };
}

// Day N's stone: the first try (0, 1, 2, ...) whose seed passes. Deterministic,
// so every device carves the same stone; the attempt is kept for the record.
const cache = new Map();
export function dailyStone(n) {
  if (cache.has(n)) return cache.get(n);
  let pick = null;
  for (let attempt = 0; attempt < ATTEMPTS && !pick; attempt++) {
    const seed = daySeed(n, attempt);
    const shape = randomShape(DAILY_SIZE, seed);
    const j = judge(shape);
    if (j.ok) pick = { shape, seed, attempt, d: j.d, chisel: j.chisel, waves: j.waves };
  }
  // (never seen in thousands of days; if the band ever starves, any solvable stone)
  for (let attempt = ATTEMPTS; !pick; attempt++) {
    const seed = daySeed(n, attempt);
    const shape = randomShape(DAILY_SIZE, seed);
    const j = judge(shape, { minD: 0, maxD: 99, minChisel: 1, maxChisel: 999, minWaves: 1, maxWaves: 99 });
    if (j.ok) pick = { shape, seed, attempt, d: j.d, chisel: j.chisel, waves: j.waves };
  }
  // its own id (not 'random-...': main.js treats those as the drift) and name
  pick.shape = { ...pick.shape, id: `daily-${n}`, name: `Daily #${n}`, daily: n };
  if (cache.size > 512) cache.clear();
  cache.set(n, pick);
  return pick;
}

// the day's sky: one of the game's palettes, at a time of day of its own
export function dailyPalette(n) {
  const seed = daySeed(n, 999);
  return variant(PALETTES[seed % PALETTES.length], (seed % 97) / 96, seed);
}

// The carving's waves: in which wave of line logic each cell is settled (the
// way solveStats counts them: every deduction open at once, then again). The
// share line has one square per wave, so it says how the solve went without
// saying where anything is.
export function cellWaves(p) {
  const state = new Uint8Array(p.size);
  const wave = new Int16Array(p.size).fill(-1);
  const visible = p.lines.filter((l) => !l.hidden);
  for (let w = 0; ; w++) {
    const next = state.slice();
    let changed = false;
    for (const line of visible) {
      const fit = lineFits(line, state);
      if (!fit) continue;   // (never, on a stone that passed judge())
      line.cells.forEach((c, t) => {
        if (state[c] || next[c]) return;
        if ((fit.and >> t) & 1) next[c] = 1;
        else if (!((fit.or >> t) & 1)) next[c] = 2;
        else return;
        wave[c] = w;
        changed = true;
      });
    }
    if (!changed) return { wave, count: w };
    state.set(next);
  }
}

// one flag per wave: did a slip land on a cube that wave settles?
export function slipWaves(p, slipCells) {
  const { wave, count } = cellWaves(p);
  const out = new Array(count).fill(false);
  for (const i of slipCells ?? []) if (wave[i] >= 0) out[wave[i]] = true;
  return out;
}

// ---------------------------------------------------------------- the share line

export const WAVE_CLEAN = '🟨', WAVE_SLIP = '🟫';
const GEM = '◆', GEM_EMPTY = '◇';

function clock(s) {
  s = Math.max(0, Math.floor(s));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60;
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}` : `${m}:${String(r).padStart(2, '0')}`;
}

// Plain text, built only from these numbers: the day, the gems, the slips, the
// time, which waves had a slip, and the days in a row. No cell, row, clue or
// colour ever goes in, so it can't carry the stone's shape (test/daily.test.js).
export function shareText({ day, stars, slips, seconds, waves, streak = 0 }) {
  const gems = GEM.repeat(stars) + GEM_EMPTY.repeat(3 - stars);
  const slipWord = slips === 0 ? 'no slips' : slips === 1 ? '1 slip' : `${slips} slips`;
  const lines = [
    `Strata · Daily #${day}`,
    `${gems} · ${slipWord} · ${clock(seconds)}`,
    waves.map((s) => (s ? WAVE_SLIP : WAVE_CLEAN)).join(''),
  ];
  if (streak >= 2) lines.push(`${streak} days in a row`);
  lines.push(`${DAILY_URL}?d=${day}`);
  return lines.join('\n');
}

// ?d=N in a link: the day it names, or null. A link may be a day behind or
// ahead of the reader's own date (time zones); further out, it is an old day.
export function linkedDay(search) {
  const v = new URLSearchParams(search).get('d');
  const n = /^\d{1,6}$/.test(v ?? '') ? Number(v) : NaN;
  return n >= 1 ? n : null;
}

// ---------------------------------------------------------------- the record, on this device only

const KEY_DAYS = 'strata.daily.days', KEY_SHARES = 'strata.daily.shares';
const KEEP_DAYS = 400;

export function readDays(store = globalThis.localStorage) {
  try { return JSON.parse(store.getItem(KEY_DAYS)) || {}; } catch { return {}; }
}

// A solve of day n. The first solve of a day is its result (a replay changes nothing).
export function recordDay(n, { seconds, slips, stars, score, waves }, store = globalThis.localStorage) {
  const days = readDays(store);
  if (days[n]) return { days, first: false };
  days[n] = { t: Math.round(seconds), m: slips, s: stars, p: score, w: waves.map((x) => (x ? 1 : 0)).join(''), at: Date.now() };
  const keys = Object.keys(days).map(Number).sort((a, b) => b - a);
  for (const k of keys.slice(KEEP_DAYS)) delete days[k];
  try { store.setItem(KEY_DAYS, JSON.stringify(days)); } catch { /* storage full: the day just isn't kept */ }
  return { days, first: true };
}

// Days in a row up to day n: from n if it's solved, else from the day before
// (the run still stands until today is over). A missed day simply starts a
// new run; nothing is ever said about the old one.
export function streakAt(days, n) {
  let k = days[n] ? n : n - 1, run = 0;
  while (days[k]) { run++; k--; }
  return run;
}

export function noteShare(store = globalThis.localStorage) {
  const n = (Number(store.getItem(KEY_SHARES)) || 0) + 1;
  try { store.setItem(KEY_SHARES, String(n)); } catch { /* */ }
  return n;
}
