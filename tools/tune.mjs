// Dev aid: difficulty range per level across fraction/seed choices, to pick
// settings that sit inside each chapter's band (see docs/level-design.md).
import { Puzzle, hideClues, solveStats } from '../public/js/puzzle.js';
import { SHAPES, buildCells } from '../public/js/shapes.js';
import { difficulty } from '../test/difficulty.js';

const fractions = [0.5, 0.65, 0.8, 0.9, 1.0];
const only = process.argv.slice(2);
for (const shape of SHAPES) {
  if (only.length && !only.includes(shape.id)) continue;
  const { solid, colors } = buildCells(shape);
  const row = fractions.map((f) => {
    const ds = [];
    for (let seed = 1; seed <= 8; seed++) {
      const p = new Puzzle(shape.dims, solid, colors);
      hideClues(p, f, seed);
      ds.push(`${seed}:${difficulty(solveStats(p), p).toFixed(1)}`);
    }
    return `${f} [${ds.join(' ')}]`;
  });
  console.log(`${shape.id}\n  ${row.join('\n  ')}`);
}
