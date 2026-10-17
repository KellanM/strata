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

// Hides as many clues as possible (up to `fraction` of all lines) while the
// puzzle stays line-solvable. Uses a seeded shuffle so a puzzle is stable.
export function hideClues(p, fraction = 1, seed = 1) {
  if (!lineSolve(p)) return false;
  const rand = mulberry32(seed);
  const order = p.lines.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
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
