// Dev aid: solvability, chisel count and difficulty range for the bonus
// shapes, plus ASCII slices (--ascii). Picks fraction/seed for each bonus.
//   node tools/bonus-draft.mjs [id] [--ascii]
import { Puzzle, lineSolve, hideClues, solveStats } from '../public/js/puzzle.js';
import { BONUS, buildCells } from '../public/js/shapes.js';
import { difficulty } from '../test/difficulty.js';

const only = process.argv[2]?.startsWith('--') ? null : process.argv[2];
for (const shape of BONUS) {
  if (only && shape.id !== only) continue;
  const { solid, colors } = buildCells(shape);
  const [X, Y, Z] = shape.dims;
  const n = solid.reduce((a, b) => a + b, 0);
  const fullOk = lineSolve(new Puzzle(shape.dims, solid, colors));
  console.log(`${shape.id} ${X}x${Y}x${Z} solid ${n} chisel ${X * Y * Z - n} fullSolvable ${fullOk}`);
  if (process.argv.includes('--ascii')) {
    for (let y = Y - 1; y >= 0; y--) {
      const rows = [];
      for (let z = 0; z < Z; z++) {
        let r = '';
        for (let x = 0; x < X; x++) r += solid[x + X * (y + Y * z)] ? '#' : '.';
        rows.push(r);
      }
      console.log(`  y=${y} ${rows.join(' ')}`);
    }
  }
  if (!fullOk) continue;
  for (const f of [0.65, 0.8, 0.9, 1.0]) {
    const ds = [];
    for (let seed = 1; seed <= 8; seed++) {
      const p = new Puzzle(shape.dims, solid, colors);
      const ok = hideClues(p, f, seed);
      const s = solveStats(p);
      ds.push(ok && s.solved ? `${seed}:${difficulty(s, p).toFixed(1)}` : `${seed}:x`);
    }
    console.log(`  ${f} ${ds.join(' ')}`);
  }
  const cur = new Puzzle(shape.dims, solid, colors);
  hideClues(cur, shape.fraction, shape.seed);
  const s = solveStats(cur);
  console.log(`  chosen f=${shape.fraction} seed=${shape.seed}: ${s.solved ? 'D ' + difficulty(s, cur).toFixed(1) : 'UNSOLVED'}`);
}
