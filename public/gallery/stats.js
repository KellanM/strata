// Size, cube count, solvability and difficulty for a candidate, computed the
// same way the game's tests do (test/difficulty.js), so gallery numbers match.
import { Puzzle, hideClues, solveStats } from '../js/puzzle.js';
import { buildCells } from '../js/shapes.js';

const difficulty = (s, p) => s.rounds * 0.6 + (1 - s.opening) * 3 + s.hidden * 3 + s.interior * 2 + Math.log2(p.size) * 0.5;

export function stats(shape) {
  const { solid, colors } = buildCells(shape);
  let cubes = 0;
  for (const v of solid) cubes += v;
  const p = new Puzzle(shape.dims, solid, colors);
  const solvable = hideClues(p, shape.fraction ?? 0.65, shape.seed ?? 1);
  const s = solvable ? solveStats(p) : null;
  // pieces: 6-connected groups of cubes (1 = one solid object, nothing floating)
  const [X, Y, Z] = shape.dims, seen = new Uint8Array(p.size);
  let pieces = 0;
  for (let i = 0; i < p.size; i++) {
    if (!solid[i] || seen[i]) continue;
    pieces++;
    const stack = [i]; seen[i] = 1;
    while (stack.length) {
      const j = stack.pop(), x = j % X, y = Math.floor(j / X) % Y, z = Math.floor(j / (X * Y));
      for (const [dx, dy, dz] of [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]) {
        const a = x + dx, b = y + dy, c = z + dz;
        if (a < 0 || b < 0 || c < 0 || a >= X || b >= Y || c >= Z) continue;
        const k = a + X * (b + Y * c);
        if (solid[k] && !seen[k]) { seen[k] = 1; stack.push(k); }
      }
    }
  }
  return {
    dims: shape.dims, cubes, removable: p.size - cubes, pieces, fill: cubes / p.size,
    solvable: !!(solvable && s.solved),
    D: s && s.solved ? difficulty(s, p) : null,
  };
}
