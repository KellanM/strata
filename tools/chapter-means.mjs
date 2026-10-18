// Prints each chapter's levels with difficulty and the chapter mean.
//   node tools/chapter-means.mjs
import { Puzzle, setClues, solveStats } from '../public/js/puzzle.js';
import { SHAPES, CHAPTERS, buildCells } from '../public/js/shapes.js';
import { difficulty } from '../test/difficulty.js';

for (const c of CHAPTERS) {
  const ds = SHAPES.filter((s) => s.chapter === c.name).map((s) => {
    const { solid, colors } = buildCells(s);
    const p = new Puzzle(s.dims, solid, colors);
    setClues(p, s);
    return [s.id, difficulty(solveStats(p), p)];
  });
  const mean = ds.reduce((a, d) => a + d[1], 0) / ds.length;
  console.log(`${c.numeral.padEnd(4)}${c.name.padEnd(18)} mean ${mean.toFixed(2)}  (${ds.length})  ${ds.map(([id, d]) => `${id} ${d.toFixed(1)}`).join(' · ')}`);
}
