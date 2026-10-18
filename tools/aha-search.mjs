// Searches clue subsets of one level for a better solve path, as scored by
// quality() in tools/aha-lib.mjs, while keeping the level line-solvable (so
// unique) and its difficulty D within +-0.6 of today's, so the chapter ramp
// would survive. PRINTS A PROPOSAL ONLY: shapes.js and the game are untouched.
//   node tools/aha-search.mjs <id> [iterations=4000] [seed=1]
import { lineSolve, mulberry32 } from '../public/js/puzzle.js';
import { SHAPES, BONUS } from '../public/js/shapes.js';
import { prepare, analysePuzzle, quality, trace, lineName, TYPES } from './aha-lib.mjs';

const [id, itArg, seedArg] = process.argv.slice(2);
const shape = [...SHAPES, ...BONUS].find((s) => s.id === id);
if (!shape) { console.log('usage: node tools/aha-search.mjs <level id> [iterations] [seed]'); process.exit(1); }
const iters = Number(itArg ?? 4000), rand = mulberry32(Number(seedArg ?? 1));

const p = prepare(shape);
const base = analysePuzzle(p, shape);
const D0 = base.D;
const score = (a) => quality(a) - 3 * Math.max(0, Math.abs(a.D - D0) - 0.6);
const snapshot = () => p.lines.map((l) => l.hidden);
const restore = (h) => p.lines.forEach((l, i) => { l.hidden = h[i]; });
const original = snapshot();

let best = { s: score(base), h: original, a: base };
for (let restart = 0; restart < 6; restart++) {
  // start: everything shown, then greedy hiding in a random order that tries
  // 0s and full rows first with some probability
  p.lines.forEach((l) => { l.hidden = false; });
  const free = (l) => l.count === 0 || l.count === l.cells.length;
  const order = p.lines.map((l, i) => [i, rand() - (free(l) ? rand() * 1.5 : 0)]).sort((x, y) => x[1] - y[1]).map((x) => x[0]);
  const target = 0.3 + rand() * 0.4;
  for (const i of order.slice(0, Math.round(order.length * target))) {
    p.lines[i].hidden = true;
    if (!lineSolve(p)) p.lines[i].hidden = false;
  }
  let cur = analysePuzzle(p, shape), cs = score(cur);
  for (let k = 0; k < iters; k++) {
    const i = Math.floor(rand() * p.lines.length);
    const line = p.lines[i];
    line.hidden = !line.hidden;
    if (line.hidden && !lineSolve(p)) { line.hidden = false; continue; }
    const a = analysePuzzle(p, shape), s = score(a);
    if (s >= cs) { cur = a; cs = s; if (s > best.s) best = { s, h: snapshot(), a }; }
    else line.hidden = !line.hidden;
  }
}

const show = (label, a) => {
  console.log(`${label.padEnd(9)} shown ${a.shown}/${a.lines} (0s ${a.shownZeros})  passes ${a.rounds}  D ${a.D.toFixed(1)}  ` +
    `wave-1 ${Math.round(a.opening * 100)}% via ${a.breakLines} lines  80% carved by wave ${a.outline}  need ${a.needed}  ` +
    `cells/wave ${a.profile.join('.')}  inside known in wave 1 ${a.inner1}/${a.inner}  quality ${quality(a)}`);
};
console.log(`${shape.name} (${shape.id}) ${base.dims}`);
show('today', base);
show('proposed', best.a);

restore(best.h);
const tr = trace(p);
const firstMoves = tr.waves[0].movers.filter((l) => l.count !== 0);
console.log(`\nproposed wave 1: ${tr.waves[0].cells} cells from ${tr.waves[0].lines} lines (${tr.waves[0].zeroLines} of them 0s), types ${TYPES.map((t, i) => `${t} ${tr.waves[0].hist[i]}`).join(', ')}`);
for (const l of firstMoves.slice(0, 14)) console.log(`  ${lineName(p, l)}`);
if (firstMoves.length > 14) console.log(`  ... ${firstMoves.length - 14} more`);
if (best.a.pinch) {
  const w = best.a.pinch.wave - 1;   // 0-based index of the pinch wave
  console.log(`pinch: wave ${w + 1} moves ${tr.waves[w].cells} cells via ${tr.waves[w].lines} lines, then wave ${w + 2} opens ${tr.waves[w + 1].cells}`);
  if (tr.waves[w].lines <= 6) for (const l of tr.waves[w].movers) console.log(`  ${lineName(p, l)}`);
}
console.log(`waves: ${tr.waves.map((w, i) => `${i + 1}:${w.cells}c/${w.lines}l[${w.hist.join('/')}]`).join('  ')}`);
const bits = [0, 1, 2].map((ax) => p.lines.filter((l) => l.axis === ax).map((l) => (l.hidden ? '.' : '#')).join(''));
console.log(`shown mask (lines in Puzzle order, # = shown) x|y|z:\n  ${bits.join('\n  ')}`);
restore(original);
