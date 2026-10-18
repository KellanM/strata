// Reorders the levels inside each chapter of public/js/shapes.js from easiest
// to hardest by measured difficulty (test/difficulty.js), rewriting the source
// so the map's order is the sorted order. Entries are the top-level `{ … },`
// blocks inside each `...chapter(n, [ … ]),` array; comments between entries
// travel with the entry that follows them.
//
//   node tools/sort-levels.mjs          rewrite in place
//   node tools/sort-levels.mjs --dry    print the new order only
import { readFileSync, writeFileSync } from 'node:fs';
import { Puzzle, hideClues, solveStats } from '../public/js/puzzle.js';
import { SHAPES, buildCells } from '../public/js/shapes.js';
import { difficulty } from '../test/difficulty.js';

const file = new URL('../public/js/shapes.js', import.meta.url);
const dry = process.argv.includes('--dry');

const D = new Map();
for (const s of SHAPES) {
  const { solid, colors } = buildCells(s);
  const p = new Puzzle(s.dims, solid, colors);
  hideClues(p, s.fraction ?? 0.85, s.seed ?? 7);
  D.set(s.id, difficulty(solveStats(p), p));
}

const lines = readFileSync(file, 'utf8').split(/\r?\n/);
const out = [];
let i = 0;
while (i < lines.length) {
  out.push(lines[i]);
  if (!/^ {2}\.\.\.chapter\(\d+, \[$/.test(lines[i])) { i++; continue; }
  // collect entries until the chapter's closing "  ]),"
  i++;
  const entries = [];
  let pending = [];
  while (!/^ {2}\]\),$/.test(lines[i])) {
    if (lines[i] === '    {') {
      const block = [...pending, lines[i]];
      pending = [];
      i++;
      while (lines[i] !== '    },') block.push(lines[i++]);
      block.push(lines[i++]);
      const id = block.join('\n').match(/id: '([^']+)'/)[1];
      entries.push({ id, block });
    } else {
      pending.push(lines[i++]);
    }
  }
  entries.sort((a, b) => D.get(a.id) - D.get(b.id));
  console.log(entries.map((e) => `${e.id} ${D.get(e.id).toFixed(1)}`).join(' · '));
  for (const e of entries) out.push(...e.block);
  out.push(...pending);
  out.push(lines[i++]);   // "  ]),"
}
if (!dry) writeFileSync(file, out.join('\n'));
