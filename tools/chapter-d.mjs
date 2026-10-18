// Prints each level's difficulty (D) for one chapter, in play order.
//   node tools/chapter-d.mjs "Ember Steps"
import { Puzzle, setClues, solveStats } from '../public/js/puzzle.js';
import { SHAPES, buildCells } from '../public/js/shapes.js';
import { difficulty } from '../test/difficulty.js';

for (const s of SHAPES.filter((x) => x.chapter === process.argv[2])) {
  const { solid, colors } = buildCells(s);
  const p = new Puzzle(s.dims, solid, colors);
  setClues(p, s);
  console.log(s.id.padEnd(14), difficulty(solveStats(p), p).toFixed(1));
}
