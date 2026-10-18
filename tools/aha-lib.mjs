// Read-only analysis helpers for docs/aha-study.md: an independent line
// propagator, a solve-path trace with deduction types, a backtracking
// uniqueness check and solve-path quality measures. Nothing here writes to
// shapes.js or changes how the game picks its clues.
//
// The game's solver (public/js/puzzle.js) is reused only for the Puzzle
// geometry and for hideClues (so the clue set is exactly the one the game
// shows). Candidate tables, propagation and search are re-implemented here so
// they can cross-check it.
import { Puzzle, hideClues, solveStats, lineSolve } from '../public/js/puzzle.js';
import { buildCells } from '../public/js/shapes.js';
import { difficulty } from '../test/difficulty.js';

const U = 0, S = 1, E = 2;

function info(m, n) {
  let count = 0, groups = 0, prev = 0;
  for (let b = 0; b < n; b++) {
    const bit = (m >> b) & 1;
    count += bit;
    if (bit && !prev) groups++;
    prev = bit;
  }
  return { count, groups };
}
const styleOfGroups = (g) => (g >= 3 ? 2 : g === 2 ? 1 : 0);

// mode 'full': count + group style; 'count': the count alone
const cache = new Map();
export function candidates(n, count, style, mode = 'full') {
  const k = `${n}:${count}:${mode === 'full' ? style : '-'}`;
  if (cache.has(k)) return cache.get(k);
  const out = [];
  for (let m = 0; m < 1 << n; m++) {
    const { count: c, groups } = info(m, n);
    if (c !== count) continue;
    if (mode === 'full' && styleOfGroups(groups) !== style) continue;
    out.push(m);
  }
  cache.set(k, out);
  return out;
}

// The clue set the game shows (main.js: show per axis, else hideClues with the
// same defaults).
export function prepare(shape) {
  const { solid, colors } = buildCells(shape);
  const p = new Puzzle(shape.dims, solid, colors);
  if (shape.show) for (const line of p.lines) line.hidden = !shape.show[line.axis];
  else hideClues(p, shape.fraction ?? 0.85, shape.seed ?? 7);
  return p;
}

function lineMasks(line, state) {
  let sm = 0, em = 0;
  const n = line.cells.length;
  for (let t = 0; t < n; t++) {
    const s = state[line.cells[t]];
    if (s === S) sm |= 1 << t; else if (s === E) em |= 1 << t;
  }
  return { sm, em, n, full: (1 << n) - 1 };
}

function fit(cands, sm, em, full) {
  let and = full, or = 0, any = false;
  for (const m of cands) {
    if ((m & em) || (m & sm) !== sm) continue;
    and &= m; or |= m; any = true;
  }
  return { and, or, any };
}

// Line mode for a restricted solver. 'count': every line by count alone.
// 'plain': plain (one-group) clues use their contiguity, circled / squared
// ones only their count. 'full': everything the game's clues say.
function modeFor(line, tier) {
  if (tier === 'full') return 'full';
  if (tier === 'plain') return line.style === 0 ? 'full' : 'count';
  return 'count';
}

// Propagate to a fixed point. Returns {ok, state} (ok=false on contradiction).
export function propagate(p, state, tier = 'full') {
  const lines = p.lines;
  const queue = [], queued = new Uint8Array(lines.length);
  for (let li = 0; li < lines.length; li++) if (!lines[li].hidden) { queue.push(li); queued[li] = 1; }
  while (queue.length) {
    const li = queue.pop(); queued[li] = 0;
    const line = lines[li];
    const { sm, em, n, full } = lineMasks(line, state);
    if ((sm | em) === full) {
      const c = info(sm, n);
      if (c.count !== line.count || (modeFor(line, tier) === 'full' && styleOfGroups(c.groups) !== line.style)) return { ok: false, state };
      continue;
    }
    const { and, or, any } = fit(candidates(n, line.count, line.style, modeFor(line, tier)), sm, em, full);
    if (!any) return { ok: false, state };
    for (let t = 0; t < n; t++) {
      const c = line.cells[t];
      if (state[c] !== U) continue;
      const v = (and >> t) & 1 ? S : !((or >> t) & 1) ? E : U;
      if (v === U) continue;
      state[c] = v;
      for (let a = 0; a < 3; a++) {
        const o = p.cellLines[c * 3 + a];
        if (!queued[o] && !lines[o].hidden) { queued[o] = 1; queue.push(o); }
      }
    }
  }
  return { ok: true, state };
}

export function solvedBy(p, tier) {
  const { ok, state } = propagate(p, new Uint8Array(p.size), tier);
  return ok && state.every((s) => s !== U);
}

// Backtracking search with propagation. Counts solutions consistent with the
// shown clues, stopping at `limit`. Hidden lines constrain nothing.
export function countSolutions(p, limit = 2, budget = 200000) {
  let found = 0, nodes = 0, differs = false, exhausted = true;
  const rec = (state) => {
    if (found >= limit) return;
    if (++nodes > budget) { exhausted = false; return; }
    const r = propagate(p, state);
    if (!r.ok) return;
    const i = state.indexOf(U);
    if (i < 0) {
      found++;
      for (let k = 0; k < p.size; k++) if ((state[k] === S) !== !!p.solid[k]) differs = true;
      return;
    }
    for (const v of [S, E]) { const s = state.slice(); s[i] = v; rec(s); }
  };
  rec(new Uint8Array(p.size));
  return { solutions: found, nodes, exhausted, differsFromShape: differs };
}

// Exhaustive check for tiny blocks: every assignment of every cell.
export function bruteCount(p) {
  if (p.size > 22) return null;
  let n = 0;
  const vis = p.lines.filter((l) => !l.hidden);
  for (let m = 0; m < 1 << p.size; m++) {
    let ok = true;
    for (const line of vis) {
      let lm = 0;
      for (let t = 0; t < line.cells.length; t++) if ((m >> line.cells[t]) & 1) lm |= 1 << t;
      const c = info(lm, line.cells.length);
      if (c.count !== line.count || styleOfGroups(c.groups) !== line.style) { ok = false; break; }
    }
    if (ok) n++;
  }
  return n;
}

// Shown clues agree with the shape (recomputed from the voxels, not trusted).
export function cluesConsistent(p) {
  for (const line of p.lines) {
    let m = 0;
    for (let t = 0; t < line.cells.length; t++) if (p.solid[line.cells[t]]) m |= 1 << t;
    const c = info(m, line.cells.length);
    if (c.count !== line.count || styleOfGroups(c.groups) !== line.style) return false;
  }
  return true;
}

// Deduction types, easiest first.
//   free:    the clue settles its whole line on an empty board (0, full, 2-circled-in-3...)
//   overlap: the clue settles part of an untouched line (a 4 in 5: middle three stay)
//   count:   arithmetic with known cells: the count is reached, or the gaps left must all stay
//   glue:    a plain clue's one-group rule with known cells (reach, gluing, splitting off ends)
//   split:   the circle/square group rule with known cells
export const TYPES = ['free', 'overlap', 'count', 'glue', 'split'];

function giveawayAll(line) {
  const n = line.cells.length;
  const { and, or } = fit(candidates(n, line.count, line.style), 0, 0, (1 << n) - 1);
  return (and | (~or & ((1 << n) - 1))) === (1 << n) - 1;
}

// Wave-by-wave trace, synchronous like solveStats(): every deduction a scan
// of the current state allows, applied together. A cell decided by several
// lines in one wave is credited to its easiest type.
export function trace(p) {
  const state = new Uint8Array(p.size);
  const vis = p.lines.filter((l) => !l.hidden);
  const waves = [];
  const decidedAt = new Int16Array(p.size).fill(-1);
  for (;;) {
    const best = new Int8Array(p.size).fill(99);
    const productive = new Set();
    for (const line of vis) {
      const { sm, em, n, full } = lineMasks(line, state);
      if ((sm | em) === full) continue;
      const f = fit(candidates(n, line.count, line.style), sm, em, full);
      const fresh = (sm | em) === 0;
      const cnt = fresh ? null : fit(candidates(n, line.count, line.style, 'count'), sm, em, full);
      for (let t = 0; t < n; t++) {
        const c = line.cells[t];
        if (state[c] !== U) continue;
        const v = (f.and >> t) & 1 ? S : !((f.or >> t) & 1) ? E : U;
        if (v === U) continue;
        if ((v === S) !== !!p.solid[c]) throw new Error(`unsound deduction at cell ${c}`);
        let type;
        if (fresh) type = giveawayAll(line) ? 0 : 1;
        else if (((cnt.and >> t) & 1) || !((cnt.or >> t) & 1)) type = 2;
        else type = line.style === 0 ? 3 : 4;
        productive.add(line);
        if (type < best[c]) best[c] = type;
      }
    }
    const hist = [0, 0, 0, 0, 0];
    let k = 0;
    for (let c = 0; c < p.size; c++) if (best[c] !== 99) {
      state[c] = p.solid[c] ? S : E; hist[best[c]]++; k++; decidedAt[c] = waves.length;
    }
    if (!k) break;
    waves.push({ cells: k, lines: productive.size, hist, movers: [...productive],
      zeroLines: [...productive].filter((l) => l.count === 0).length });
  }
  return { waves, solved: state.every((s) => s !== U), decidedAt };
}

// Reveal pacing: the wave (1-based) by which 80% of the cubes to chisel are
// known. The object appears as those cubes go, so a 1 here means a player can
// carve most of the object out on the first scan. A proxy for "when the object
// is recognisable", not a measurement of recognition.
function revealWave(p, decidedAt, share = 0.8) {
  const at = [];
  for (let c = 0; c < p.size; c++) if (!p.solid[c]) at.push(decidedAt[c]);
  at.sort((a, b) => a - b);
  return at.length ? at[Math.max(0, Math.ceil(at.length * share) - 1)] + 1 : 1;
}

export function analyse(shape) {
  return analysePuzzle(prepare(shape), shape);
}

export function analysePuzzle(p, shape) {
  const tr = trace(p);
  const st = solveStats(p);
  const empties = p.size - p.solid.reduce((a, b) => a + b, 0);
  const shown = p.lines.filter((l) => !l.hidden);
  const hardest = Math.max(...tr.waves.map((w) => w.hist.reduce((m, v, i) => (v ? i : m), 0)));
  const needed = solvedBy(p, 'count') ? 'count' : solvedBy(p, 'plain') ? 'glue' : solvedBy(p, 'full') ? 'split' : 'beyond line logic';
  let empty1 = 0, inner = 0, inner1 = 0;
  const [X, Y, Z] = p.dims;
  for (let c = 0; c < p.size; c++) {
    if (p.solid[c]) continue;
    if (tr.decidedAt[c] === 0) empty1++;
    const [x, y, z] = p.coords(c);
    if (x > 0 && y > 0 && z > 0 && x < X - 1 && y < Y - 1 && z < Z - 1) { inner++; if (tr.decidedAt[c] === 0) inner1++; }
  }
  const later = tr.waves.slice(1);
  // the narrowest later wave and how much the next wave opens up after it
  let pinch = null;
  for (let i = 0; i < tr.waves.length - 1; i++) {
    const ratio = tr.waves[i + 1].cells / tr.waves[i].cells;
    if (!pinch || ratio > pinch.ratio) pinch = { wave: i + 1, lines: tr.waves[i].lines, cells: tr.waves[i].cells, ratio };
  }
  const outline = revealWave(p, tr.decidedAt);
  const shownZeros = shown.filter((l) => l.count === 0).length;
  // shown clues the puzzle could lose on their own and stay line-solvable
  let spare = 0;
  for (const l of shown) { l.hidden = true; if (lineSolve(p)) spare++; l.hidden = false; }
  return {
    id: shape.id, name: shape.name, chapter: shape.chapter ?? (shape.show ? 'Tutorial' : ''),
    dims: shape.dims.join('x'), cells: p.size, chisels: empties,
    shown: shown.length, lines: p.lines.length, shownZeros, spare,
    zeroLines: p.lines.filter((l) => l.count === 0).length,
    consistent: cluesConsistent(p),
    lineSolved: tr.solved, statsRounds: st.rounds, rounds: tr.waves.length,
    opening: tr.waves[0] ? tr.waves[0].cells / p.size : 0,
    carved1: empties ? empty1 / empties : 0, inner, inner1,
    breakLines: tr.waves[0]?.lines ?? 0, breakZeroLines: tr.waves[0]?.zeroLines ?? 0,
    profile: tr.waves.map((w) => w.cells),
    lineProfile: tr.waves.map((w) => w.lines),
    hist: tr.waves.reduce((a, w) => a.map((v, i) => v + w.hist[i]), [0, 0, 0, 0, 0]),
    hardestUsed: TYPES[hardest], needed,
    pinch, outline, D: difficulty(st, p),
    narrowest: later.length ? Math.min(...later.map((w) => w.lines)) : null,
    p,
  };
}

// A proposed "solve-path quality" score, 0..~10. Each term is a design
// hypothesis from docs/aha-study.md, not a measured player response.
//   breakIn  : wave 1 should be a small, clear foothold (5-30% of cells)
//   cascade  : somewhere later one wave should open up much more than the one before
//   late     : 80% of the carving should not be known before ~60% of the passes
//   focus    : few lines offering the first move (a findable break-in, not 40 free rows)
//   tedium   : shown 0-clues are free moves that also give the outline away
export function quality(a, targetRounds = null) {
  const o = a.opening;
  const breakIn = o <= 0 ? 0 : o < 0.05 ? o / 0.05 : o <= 0.3 ? 1 : Math.max(0, 1 - (o - 0.3) / 0.5);
  const cascade = a.pinch ? Math.min(1, Math.log2(Math.max(1, a.pinch.ratio)) / 2.5) : 0;
  const late = a.rounds > 1 ? Math.min(1, (a.outline - 1) / Math.max(1, a.rounds - 1) / 0.6) : 0;
  const tedium = a.shown ? a.shownZeros / a.shown : 0;
  // a foothold is clearer when only a handful of lines offer a first move
  const focus = a.breakLines <= 8 ? 1 : Math.max(0, 1 - (a.breakLines - 8) / 32);
  const pace = targetRounds == null ? 1 : Math.max(0, 1 - Math.abs(a.rounds - targetRounds) / 4);
  return +((1.5 * breakIn + 1.5 * focus + 3 * cascade + 2 * late + 2 * (1 - tedium)) * pace).toFixed(2);
}

// "x-row at y=2 z=0" style names for a line: axis letter and the fixed coordinates.
export function lineName(p, line) {
  const c = p.coords(line.cells[0]);
  const fixed = [0, 1, 2].filter((a) => a !== line.axis).map((a) => `${'xyz'[a]}${c[a]}`).join(' ');
  const mark = line.style === 1 ? `(${line.count})` : line.style === 2 ? `[${line.count}]` : `${line.count}`;
  return `${'xyz'[line.axis]}-line ${fixed} clue ${mark}/${line.cells.length}`;
}
