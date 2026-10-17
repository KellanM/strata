// Level report: solvability and difficulty for every puzzle, plus optional
// ASCII slices of one shape (top layer first, z rows back to front).
//   node tools/levels.mjs            table of all levels
//   node tools/levels.mjs teapot     slices of one shape
import { Puzzle, lineSolve, hideClues, solveStats } from '../public/js/puzzle.js';
import { SHAPES, buildCells } from '../public/js/shapes.js';
import { difficulty } from '../test/difficulty.js';

const only = process.argv[2];

function make(shape) {
  const { solid, colors } = buildCells(shape);
  return new Puzzle(shape.dims, solid, colors);
}

if (only) {
  const shape = SHAPES.find((s) => s.id === only);
  const [X, Y, Z] = shape.dims;
  const glyph = new Map();
  const chars = 'ABCDEFGHIJKLMNOP';
  for (let y = Y - 1; y >= 0; y--) {
    const rows = [];
    for (let z = 0; z < Z; z++) {
      let row = '';
      for (let x = 0; x < X; x++) {
        const c = shape.cell(x, y, z);
        if (c && !glyph.has(c)) glyph.set(c, chars[glyph.size]);
        row += c ? glyph.get(c) : '.';
      }
      rows.push(row);
    }
    console.log(`y=${y}  ${rows.join('  ')}`);
  }
  console.log([...glyph].map(([c, g]) => `${g}=#${c.toString(16)}`).join(' '));
  process.exit(0);
}

let chapter = '';
for (const shape of SHAPES) {
  if (shape.chapter !== chapter) { chapter = shape.chapter; console.log(`\n${chapter} (${shape.palette})`); }
  const p = make(shape);
  const full = lineSolve(p);
  hideClues(p, shape.fraction, shape.seed);
  const s = solveStats(p);
  const solids = p.solid.reduce((a, b) => a + b, 0);
  const styles = [0, 0, 0];
  for (const l of p.lines) if (!l.hidden && l.count) styles[l.style]++;
  console.log([
    shape.id.padEnd(12), shape.dims.join('x').padEnd(7),
    `cells ${String(p.size).padStart(3)}`, `chisel ${String(p.size - solids).padStart(3)}`,
    full ? 'ok ' : 'FULL-UNSOLVABLE', s.solved ? '' : 'UNSOLVABLE',
    `hidden ${(s.hidden * 100).toFixed(0).padStart(2)}%`, `rounds ${String(s.rounds).padStart(2)}`,
    `open ${(s.opening * 100).toFixed(0).padStart(2)}%`, `inner ${(s.interior * 100).toFixed(0).padStart(2)}%`,
    `o/c/s ${styles.join('/')}`, `D ${difficulty(s, p).toFixed(1)}`,
  ].join('  '));
}
