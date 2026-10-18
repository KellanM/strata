// Solvability, uniqueness and solve-path audit for every level, bonus stone
// and tutorial lesson, with the clues the game actually shows. Read-only.
//   node tools/aha-audit.mjs          table
//   node tools/aha-audit.mjs --md     markdown table (docs/aha-study.md)
//   node tools/aha-audit.mjs <id>     one level, wave by wave
import { SHAPES, BONUS, TUTORIAL } from '../public/js/shapes.js';
import { Puzzle, lineSolve } from '../public/js/puzzle.js';
import { mulberry32 } from '../public/js/puzzle.js';
import { analyse, countSolutions, bruteCount, quality, solvedBy, TYPES } from './aha-lib.mjs';

const md = process.argv.includes('--md');
const only = process.argv.slice(2).find((a) => !a.startsWith('--'));
const all = [
  ...SHAPES,
  ...BONUS.map((b) => ({ ...b, chapter: `${b.chapter} (bonus)` })),
  ...TUTORIAL.map((t) => ({ ...t, chapter: 'Tutorial' })),
];

const pct = (v) => `${Math.round(v * 100)}%`;

if (only) {
  const s = all.find((x) => x.id === only);
  const a = analyse(s);
  console.log(`${a.id} ${a.dims}  shown ${a.shown}/${a.lines} clues (${a.shownZeros} shown 0s of ${a.zeroLines} zero lines)`);
  console.log(`wave  cells  lines  0-lines  ${TYPES.join('/')}`);
  const tr = (await import('./aha-lib.mjs')).trace(a.p);
  tr.waves.forEach((w, i) => console.log(`${String(i + 1).padStart(4)}  ${String(w.cells).padStart(5)}  ${String(w.lines).padStart(5)}  ${String(w.zeroLines).padStart(7)}  ${w.hist.join('/')}`));
  console.log(`80% of the carving known by wave ${a.outline}; needed tier ${a.needed}; quality ${quality(a)}`);
  process.exit(0);
}

const rows = [];
let problems = 0;
for (const s of all) {
  const a = analyse(s);
  const u = countSolutions(a.p, 2);
  const brute = bruteCount(a.p);
  const unique = u.exhausted && u.solutions === 1 && !u.differsFromShape && (brute === null || brute === 1);
  const flags = [];
  if (!a.consistent) flags.push('CLUE MISMATCH');
  if (!a.lineSolved) flags.push('LINE LOGIC STALLS');
  if (!unique) flags.push(`NOT UNIQUE (${u.solutions}${u.exhausted ? '' : '+?'})`);
  if (a.rounds !== a.statsRounds) flags.push(`rounds differ from solveStats (${a.statsRounds})`);
  if (flags.length) problems++;
  rows.push({ a, u, brute, unique, flags, q: quality(a) });
}

if (md) {
  console.log('| Chapter | Level | Size | Shown / lines (0s shown, spare) | Solvable | Unique | Passes | Hardest needed | D | Wave-1 decides | 80% carved by wave | Cells per wave | Quality | Flags |');
  console.log('|---|---|---|---|---|---|---|---|---|---|---|---|---|---|');
  let ch = '';
  for (const { a, unique, flags, q } of rows) {
    const c = a.chapter !== ch ? (ch = a.chapter) : '';
    console.log(`| ${c} | ${a.name} | ${a.dims} | ${a.shown}/${a.lines} (${a.shownZeros}, ${a.spare}) | ${a.lineSolved ? 'yes' : '**no**'} | ${unique ? 'yes' : '**no**'} | ${a.rounds} | ${a.needed} | ${a.D.toFixed(1)} | ${pct(a.opening)} | ${a.outline}/${a.rounds} | ${a.profile.join('·')} | ${q} | ${flags.join(', ') || ''} |`);
  }
} else {
  let ch = '';
  for (const { a, u, brute, unique, flags, q } of rows) {
    if (a.chapter !== ch) { ch = a.chapter; console.log(`\n${ch}`); }
    console.log([
      a.id.padEnd(16), a.dims.padEnd(7), `shown ${a.shown}/${a.lines}`.padEnd(13), `0s ${a.shownZeros}/${a.zeroLines}`.padEnd(8), `spare ${a.spare}`.padEnd(8),
      a.lineSolved ? 'solv' : 'STALL', unique ? 'uniq' : 'MULTI', `dfs ${u.nodes}n${brute != null ? ` brute ${brute}` : ''}`.padEnd(10),
      `passes ${String(a.rounds).padStart(2)}`, `need ${a.needed.padEnd(5)}`, `used ${a.hardestUsed.padEnd(7)}`,
      `open ${pct(a.opening).padStart(4)}`, `carved1 ${pct(a.carved1).padStart(4)}`, `r80 ${a.outline}/${a.rounds}`, `D ${a.D.toFixed(1)}`,
      `waves ${a.profile.join('.')}`, `q ${q}`, flags.join(' '),
    ].join('  '));
  }
}

// summary
const n = rows.length;
const by = (f) => rows.filter(f).length;
const mean = (f) => (rows.reduce((s, r) => s + f(r), 0) / n);
console.log(`\n${n} puzzles: ${by((r) => r.a.lineSolved)} line-solvable, ${by((r) => r.unique)} unique, ${problems} flagged.`);
console.log(`hardest tier needed: ${['count', 'glue', 'split'].map((t) => `${t} ${by((r) => r.a.needed === t)}`).join(', ')}`);
console.log(`wave 1 decides >=80% of cells: ${by((r) => r.a.opening >= 0.8)}; 80% of carving known in wave 1: ${by((r) => r.a.outline === 1)}; mean shown 0-clues ${mean((r) => r.a.shownZeros).toFixed(1)}; levels with spare (droppable) clues ${by((r) => r.a.spare > 0)}, mean spare ${mean((r) => r.a.spare).toFixed(1)}`);

// Self-check of the method on random tiny blocks (<= 18 cells), where every
// assignment can be enumerated: whenever line logic (the game's lineSolve or
// this file's propagator) settles every cell, brute force must find exactly
// one solution, and the two propagators must agree.
{
  const rand = mulberry32(2026);
  let trials = 0, solvedCases = 0, multi = 0, bad = 0, disagree = 0, stalledUnique = 0;
  for (let k = 0; k < 3000; k++) {
    const dims = [2 + Math.floor(rand() * 3), 2 + Math.floor(rand() * 3), 1 + Math.floor(rand() * 2)];
    const size = dims[0] * dims[1] * dims[2];
    if (size > 18) continue;
    const solid = Uint8Array.from({ length: size }, () => (rand() < 0.55 ? 1 : 0));
    const p = new Puzzle(dims, solid, new Uint32Array(size));
    for (const l of p.lines) l.hidden = rand() < 0.4;
    trials++;
    const game = lineSolve(p), mine = solvedBy(p, 'full'), n = bruteCount(p);
    if (game !== mine) disagree++;
    if (mine) { solvedCases++; if (n !== 1) bad++; }
    else if (n === 1) stalledUnique++;
    if (n > 1) multi++;
  }
  console.log(`self-check: ${trials} random tiny puzzles; line logic finished ${solvedCases}, all of them brute-force unique: ${bad === 0 ? 'yes' : `NO (${bad} not)`}; game/independent propagator disagree on ${disagree}; ${multi} had several solutions; ${stalledUnique} were unique but beyond line logic.`);
}
