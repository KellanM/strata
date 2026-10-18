// Sets a level's clue settings to land as close as possible to a target
// difficulty, rewriting its `fraction` / `seed` in public/js/shapes.js.
//   node tools/retune.mjs <id>=<target> [<id>=<target> ...]
import { readFileSync, writeFileSync } from 'node:fs';
import { Puzzle, hideClues, solveStats } from '../public/js/puzzle.js';
import { SHAPES, buildCells } from '../public/js/shapes.js';
import { difficulty } from '../test/difficulty.js';

const file = new URL('../public/js/shapes.js', import.meta.url);
let src = readFileSync(file, 'utf8');
for (const arg of process.argv.slice(2)) {
  const [id, t] = arg.split('=');
  const target = Number(t);
  const shape = SHAPES.find((s) => s.id === id);
  if (!shape) { console.log(`?? ${id}`); continue; }
  const { solid, colors } = buildCells(shape);
  let best = null;
  for (let f = 0; f <= 1.0001; f += 0.05) for (let seed = 1; seed <= 24; seed++) {
    const p = new Puzzle(shape.dims, solid, colors);
    hideClues(p, f, seed);
    const d = difficulty(solveStats(p), p);
    if (!best || Math.abs(d - target) < Math.abs(best.d - target)) best = { f: Math.round(f * 100) / 100, seed, d };
  }
  const re = new RegExp(`(id: '${id}',[^\\n]*?fraction: )[0-9.]+(, seed: )\\d+`);
  if (!re.test(src)) { console.log(`?? no fraction/seed on the id line of ${id}`); continue; }
  src = src.replace(re, `$1${best.f}$2${best.seed}`);
  console.log(`${id.padEnd(14)} target ${target}  got ${best.d.toFixed(1)}  (fraction ${best.f}, seed ${best.seed})`);
}
writeFileSync(file, src);
