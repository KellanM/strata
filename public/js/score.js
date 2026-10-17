// Stars and the rolling score. Stars reward a clean hand and say so up front:
// solve it (one), stay within the level's slip allowance (two), no slips
// (three). Undo, marking, peeling and time never cost a star. The score only
// ever adds: cubes cleared, a clean-hand bonus, a calm-pace bonus that is zero
// (never negative) past par, and a bonus for a run of flawless solves.
import { buildCells } from './shapes.js';

const removableCache = new Map();

export function removable(shape) {
  if (!removableCache.has(shape.id)) {
    const { solid } = buildCells(shape);
    let n = 0;
    for (const s of solid) if (!s) n++;
    removableCache.set(shape.id, n);
  }
  return removableCache.get(shape.id);
}

// Slips a two-star solve may make: more room on bigger blocks, never more than 4.
export function slipAllowance(shape) {
  return Math.min(4, Math.max(1, Math.round(removable(shape) / 45)));
}

export function starsFor(shape, mistakes) {
  return mistakes === 0 ? 3 : mistakes <= slipAllowance(shape) ? 2 : 1;
}

// Stars for a saved record; older saves only stored time and mistakes.
export function recordStars(shape, rec) {
  if (!rec) return 0;
  return rec.stars ?? starsFor(shape, rec.mistakes ?? 0);
}

export function scoreFor(shape, { mistakes, time, streak }) {
  const cubes = removable(shape);
  const stars = starsFor(shape, mistakes);
  const base = cubes * 10;
  const lines = [{ label: 'cubes cleared', value: base }];
  if (stars === 3) lines.push({ label: 'flawless', value: roundTo(base * 0.25) });
  else if (stars === 2) lines.push({ label: 'steady hand', value: roundTo(base * 0.1) });
  const par = 30 + cubes * 2.2;
  const pace = Math.max(0, Math.min(1, (par - time) / (par * 0.5)));
  if (pace > 0) lines.push({ label: 'calm pace', value: roundTo(500 * pace) });
  if (streak >= 2) lines.push({ label: `flawless run ×${streak}`, value: 100 * Math.min(streak, 5) });
  const total = lines.reduce((s, l) => s + l.value, 0);
  return { stars, lines, total, allowance: slipAllowance(shape) };
}

function roundTo(v, step = 10) { return Math.round(v / step) * step; }
