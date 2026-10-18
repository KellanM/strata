// Puzzle model, clue derivation and a line-logic solver used to decide which
// clues can be hidden while keeping the puzzle solvable without guessing.
//
// Coordinates: x right, y up, z toward the viewer. Cell index = x + X*(y + Y*z).
// A "line" is a full row of cells along one axis. Its clue is the number of
// solid cells plus a style: 0 = one contiguous group (plain), 1 = two groups
// (circled), 2 = three or more groups (squared).

export const STYLE_PLAIN = 0;
export const STYLE_CIRCLE = 1;
export const STYLE_SQUARE = 2;

const UNKNOWN = 0, SOLID = 1, EMPTY = 2;

export function styleOf(groups) {
  return groups >= 3 ? STYLE_SQUARE : groups === 2 ? STYLE_CIRCLE : STYLE_PLAIN;
}

function maskInfo(mask, n) {
  let count = 0, groups = 0, prev = 0;
  for (let b = 0; b < n; b++) {
    const bit = (mask >> b) & 1;
    count += bit;
    if (bit && !prev) groups++;
    prev = bit;
  }
  return { count, groups };
}

// tables[n] = Map(clueKey -> Int32Array of every mask of length n matching it)
const tables = [];
function tableFor(n) {
  if (tables[n]) return tables[n];
  const byKey = new Map();
  for (let m = 0; m < 1 << n; m++) {
    const { count, groups } = maskInfo(m, n);
    const key = count * 3 + styleOf(groups);
    if (!byKey.has(key)) byKey.set(key, []);
    byKey.get(key).push(m);
  }
  for (const [k, v] of byKey) byKey.set(k, Int32Array.from(v));
  return (tables[n] = byKey);
}

export class Puzzle {
  // solid: Uint8Array (1 = part of the hidden shape), colors: Uint32Array of hex colours
  constructor(dims, solid, colors) {
    this.dims = dims;
    this.size = dims[0] * dims[1] * dims[2];
    this.solid = solid;
    this.colors = colors;
    this.lines = [];
    this.cellLines = new Int32Array(this.size * 3);
    this.#buildLines();
  }

  idx(x, y, z) { return x + this.dims[0] * (y + this.dims[1] * z); }

  coords(i) {
    const [X, Y] = this.dims;
    return [i % X, Math.floor(i / X) % Y, Math.floor(i / (X * Y))];
  }

  #buildLines() {
    const d = this.dims;
    for (let axis = 0; axis < 3; axis++) {
      const a1 = (axis + 1) % 3, a2 = (axis + 2) % 3;
      for (let v = 0; v < d[a2]; v++) {
        for (let u = 0; u < d[a1]; u++) {
          const cells = new Int32Array(d[axis]);
          const p = [0, 0, 0];
          p[a1] = u; p[a2] = v;
          for (let t = 0; t < d[axis]; t++) {
            p[axis] = t;
            cells[t] = this.idx(p[0], p[1], p[2]);
          }
          let mask = 0;
          for (let t = 0; t < cells.length; t++) if (this.solid[cells[t]]) mask |= 1 << t;
          const { count, groups } = maskInfo(mask, cells.length);
          const li = this.lines.length;
          this.lines.push({ axis, cells, count, style: styleOf(groups), hidden: false });
          for (const c of cells) this.cellLines[c * 3 + axis] = li;
        }
      }
    }
  }

  lineOf(cell, axis) { return this.lines[this.cellLines[cell * 3 + axis]]; }

  isSolved(broken) {
    for (let i = 0; i < this.size; i++) if (!this.solid[i] && !broken[i]) return false;
    return true;
  }
}

// Propagates line constraints to a fixed point. Returns true if every cell is
// determined (the puzzle is solvable by pure line logic with the visible clues).
export function lineSolve(p) {
  const state = new Uint8Array(p.size);
  const nLines = p.lines.length;
  const queue = [];
  const queued = new Uint8Array(nLines);
  for (let li = 0; li < nLines; li++) {
    if (!p.lines[li].hidden) { queue.push(li); queued[li] = 1; }
  }
  while (queue.length) {
    const li = queue.pop();
    queued[li] = 0;
    const line = p.lines[li];
    const n = line.cells.length;
    let solidM = 0, emptyM = 0;
    for (let t = 0; t < n; t++) {
      const s = state[line.cells[t]];
      if (s === SOLID) solidM |= 1 << t;
      else if (s === EMPTY) emptyM |= 1 << t;
    }
    const full = (1 << n) - 1;
    if ((solidM | emptyM) === full) continue;
    const cands = tableFor(n).get(line.count * 3 + line.style);
    let and = full, or = 0, any = false;
    if (cands) {
      for (let k = 0; k < cands.length; k++) {
        const m = cands[k];
        if ((m & emptyM) || (m & solidM) !== solidM) continue;
        and &= m; or |= m; any = true;
      }
    }
    if (!any) return false;
    for (let t = 0; t < n; t++) {
      const c = line.cells[t];
      if (state[c] !== UNKNOWN) continue;
      let ns = UNKNOWN;
      if ((and >> t) & 1) ns = SOLID;
      else if (!((or >> t) & 1)) ns = EMPTY;
      if (ns === UNKNOWN) continue;
      state[c] = ns;
      for (let a = 0; a < 3; a++) {
        const other = p.cellLines[c * 3 + a];
        if (other !== li && !queued[other] && !p.lines[other].hidden) {
          queued[other] = 1;
          queue.push(other);
        }
      }
    }
  }
  for (let i = 0; i < p.size; i++) if (state[i] === UNKNOWN) return false;
  return true;
}

// Difficulty profile of the visible clue set. Lines are solved in waves: each
// wave applies every deduction available from the state left by the previous
// one (like a player scanning the block, acting, then scanning again).
//   rounds:  waves needed to finish (deduction chain length)
//   opening: share of cells decidable from clues alone in wave 1
//   hidden:  share of lines with no clue
//   interior: share of empty cells not visible from outside the block, i.e.
//            cells the player must peel to reach
export function solveStats(p) {
  const state = new Uint8Array(p.size);
  const visible = p.lines.filter((l) => !l.hidden);
  let rounds = 0, opening = 0, changed = true;
  while (changed) {
    changed = false;
    const next = state.slice();
    for (const line of visible) {
      const n = line.cells.length;
      let solidM = 0, emptyM = 0;
      for (let t = 0; t < n; t++) {
        const s = state[line.cells[t]];
        if (s === SOLID) solidM |= 1 << t;
        else if (s === EMPTY) emptyM |= 1 << t;
      }
      const full = (1 << n) - 1;
      if ((solidM | emptyM) === full) continue;
      const cands = tableFor(n).get(line.count * 3 + line.style) || [];
      let and = full, or = 0, any = false;
      for (const m of cands) {
        if ((m & emptyM) || (m & solidM) !== solidM) continue;
        and &= m; or |= m; any = true;
      }
      if (!any) return { solved: false, rounds, opening, hidden: 0, interior: 0 };
      for (let t = 0; t < n; t++) {
        const c = line.cells[t];
        if (state[c] !== UNKNOWN || next[c] !== UNKNOWN) continue;
        if ((and >> t) & 1) next[c] = SOLID;
        else if (!((or >> t) & 1)) next[c] = EMPTY;
        else continue;
        changed = true;
      }
    }
    if (changed) {
      rounds++;
      if (rounds === 1) opening = next.reduce((a, s) => a + (s !== UNKNOWN), 0) / p.size;
      state.set(next);
    }
  }
  const [X, Y, Z] = p.dims;
  let empties = 0, inner = 0;
  for (let i = 0; i < p.size; i++) {
    if (p.solid[i]) continue;
    empties++;
    const [x, y, z] = p.coords(i);
    if (x > 0 && y > 0 && z > 0 && x < X - 1 && y < Y - 1 && z < Z - 1) inner++;
  }
  return {
    solved: state.every((s) => s !== UNKNOWN),
    rounds,
    opening,
    hidden: p.lines.filter((l) => l.hidden).length / p.lines.length,
    interior: empties ? inner / empties : 0,
  };
}

// Share of a line's cells its clue decides on an empty board (0 and full rows
// decide everything; a 2 in a row of 5 decides nothing).
function giveaway(line) {
  const n = line.cells.length;
  const cands = tableFor(n).get(line.count * 3 + line.style);
  let and = (1 << n) - 1, or = 0;
  for (const m of cands) { and &= m; or |= m; }
  let known = 0;
  for (let t = 0; t < n; t++) if (((and >> t) & 1) || !((or >> t) & 1)) known++;
  return known / n;
}

// The clues a level shows, the one place every caller decides them (the game,
// the tests and the tools must agree):
//  - `show`: per axis, all or nothing (the tutorial)
//  - `clues`: a hand-curated set, one string per axis 'x|y|z', a character per
//    line in Puzzle order ('#' shown, '.' hidden) - designed for its solve path
//    (docs/aha-study.md). A shape edit changes the lines, so a stale mask throws.
//  - otherwise hideClues with the level's fraction / seed
// Returns whether the puzzle is line-solvable with the clues it ends up showing.
export function setClues(p, shape, defaults = { fraction: 0.85, seed: 7 }) {
  if (shape.show) {
    for (const line of p.lines) line.hidden = !shape.show[line.axis];
    return lineSolve(p);
  }
  if (shape.clues) {
    const masks = shape.clues.split('|');
    for (let ax = 0; ax < 3; ax++) {
      const lines = p.lines.filter((l) => l.axis === ax);
      if (!masks[ax] || masks[ax].length !== lines.length) {
        throw new Error(`${shape.id}: clue mask for axis ${ax} has ${masks[ax]?.length ?? 0} lines, the shape has ${lines.length} (was the shape edited?)`);
      }
      lines.forEach((l, k) => { l.hidden = masks[ax][k] !== '#'; });
    }
    return lineSolve(p);
  }
  return hideClues(p, shape.fraction ?? defaults.fraction, shape.seed ?? defaults.seed);
}

// Hides as many clues as possible (up to `fraction` of all lines) while the
// puzzle stays line-solvable. Uses a seeded shuffle so a puzzle is stable.
// Above fraction 0.6 the shuffle is tilted so give-away clues (0s, full rows)
// are tried first: fewer free moves, more real deductions. That makes
// `fraction` the one difficulty dial a shape needs.
export function hideClues(p, fraction = 1, seed = 1) {
  if (!lineSolve(p)) return false;
  const rand = mulberry32(seed);
  const tilt = Math.max(0, (fraction - 0.6) / 0.4) * 2;
  const key = p.lines.map((l) => rand() - tilt * giveaway(l));
  const order = p.lines.map((_, i) => i).sort((a, b) => key[a] - key[b]);
  const attempts = Math.round(order.length * fraction);
  for (let k = 0; k < attempts; k++) {
    const line = p.lines[order[k]];
    line.hidden = true;
    if (!lineSolve(p)) line.hidden = false;
  }
  return true;
}

export function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
