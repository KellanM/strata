import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Puzzle, lineSolve, hideClues, solveStats, STYLE_CIRCLE, STYLE_SQUARE } from '../public/js/puzzle.js';
import { SHAPES, CHAPTERS, randomShape, buildCells } from '../public/js/shapes.js';
import { PALETTES } from '../public/js/palettes.js';
import { difficulty } from './difficulty.js';

function make(shape) {
  const { solid, colors } = buildCells(shape);
  return new Puzzle(shape.dims, solid, colors);
}

test('clue styles count groups', () => {
  // 5x1x1 line: X.X.X -> 3 solid in 3 groups
  const p = new Puzzle([5, 1, 1], Uint8Array.from([1, 0, 1, 0, 1]), new Uint32Array(5));
  const line = p.lineOf(0, 0);
  assert.equal(line.count, 3);
  assert.equal(line.style, STYLE_SQUARE);
  const q = new Puzzle([4, 1, 1], Uint8Array.from([1, 1, 0, 1]), new Uint32Array(4));
  assert.equal(q.lineOf(0, 0).style, STYLE_CIRCLE);
});

// Same clue set the game builds (main.js: hideClues(puzzle, fraction ?? 0.85, seed ?? 7)).
function prepared(shape) {
  const p = make(shape);
  const ok = hideClues(p, shape.fraction ?? 0.85, shape.seed ?? 7);
  return { p, ok };
}

test('every level is uniquely line-solvable with the clues the game shows', () => {
  for (const shape of SHAPES) {
    const t0 = performance.now();
    const { p, ok } = prepared(shape);
    const ms = performance.now() - t0;
    assert.ok(ok, `${shape.id} not solvable even with every clue`);
    // line logic reaching every cell means the solution is unique
    assert.ok(lineSolve(p), `${shape.id} unsolvable after hiding`);
    assert.ok(ms < 1500, `${shape.id} took ${ms.toFixed(0)}ms to prepare`);
  }
});

test('level set is well-formed for the map', () => {
  const ids = new Set(SHAPES.map((s) => s.id));
  assert.equal(ids.size, SHAPES.length, 'duplicate ids');
  // players' saves are keyed by these
  for (const id of ['heart', 'invader', 'mushroom', 'tree', 'mug', 'snowman', 'rocket', 'torus'])   // arch was replaced by the taiko drum at the user's request
    assert.ok(ids.has(id), `missing legacy id ${id}`);
  const paletteNames = new Set(PALETTES.map((p) => p.name));
  const order = SHAPES.map((s) => s.chapter).filter((c, i, a) => c !== a[i - 1]);
  assert.deepEqual(order, CHAPTERS.map((c) => c.name), 'chapters contiguous and in CHAPTERS order');
  for (const shape of SHAPES) {
    assert.ok(paletteNames.has(shape.palette), `${shape.id} palette ${shape.palette}`);
    assert.ok(shape.dims.every((d) => d >= 2 && d <= 11), `${shape.id} dims ${shape.dims}`);
    const p = make(shape);
    const chisel = p.size - p.solid.reduce((a, b) => a + b, 0);
    assert.ok(chisel <= 330, `${shape.id} needs ${chisel} chisels, too many taps for a phone`);
  }
});

test('difficulty rises across chapters', () => {
  const byChapter = new Map();
  for (const shape of SHAPES) {
    const { p } = prepared(shape);
    const d = difficulty(solveStats(p), p);
    if (!byChapter.has(shape.chapter)) byChapter.set(shape.chapter, []);
    byChapter.get(shape.chapter).push(d);
  }
  let prevMean = 0;
  for (const [name, ds] of byChapter) {
    const mean = ds.reduce((a, b) => a + b, 0) / ds.length;
    console.log(`${name.padEnd(12)} mean ${mean.toFixed(1)}  [${ds.map((d) => d.toFixed(1)).join(' ')}]`);
    assert.ok(mean > prevMean, `${name} (${mean.toFixed(1)}) is not harder than the chapter before`);
    assert.ok(ds.at(-1) > ds[0], `${name} should end harder than it starts`);
    prevMean = mean;
  }
});

// The shape of the ramp inside each chapter (docs/level-design.md, "The ramp"):
// open gently, climb in small steps with breathers allowed, peak late.
test('each chapter ramps gently', () => {
  const MAX_STEP = 2.0;
  const byChapter = new Map();
  for (const shape of SHAPES) {
    const { p } = prepared(shape);
    if (!byChapter.has(shape.chapter)) byChapter.set(shape.chapter, []);
    byChapter.get(shape.chapter).push({ id: shape.id, d: difficulty(solveStats(p), p) });
  }
  for (const [name, levels] of byChapter) {
    const ds = levels.map((l) => l.d);
    const min = Math.min(...ds), max = Math.max(...ds);
    assert.ok(ds[0] <= min + 0.5, `${name} should open on (nearly) its easiest level, not ${levels[0].id}`);
    const peak = ds.indexOf(max);
    assert.ok(peak >= Math.floor(ds.length * 2 / 3), `${name}'s hardest (${levels[peak].id}) should sit in its last third`);
    for (let i = 1; i < ds.length; i++) {
      assert.ok(ds[i] - ds[i - 1] <= MAX_STEP + 1e-9,
        `${levels[i - 1].id} -> ${levels[i].id} jumps ${(ds[i] - ds[i - 1]).toFixed(1)} (max ${MAX_STEP})`);
    }
  }
});

test('random 8^3 puzzles generate quickly', () => {
  for (const seed of [1, 2, 3]) {
    const p = make(randomShape(8, seed));
    const t0 = performance.now();
    const ok = hideClues(p, 0.85, seed);
    console.log(`random seed ${seed}: solvable=${ok} ${(performance.now() - t0).toFixed(0)}ms`);
    if (ok) assert.ok(lineSolve(p));
  }
});

test('isSolved requires every empty cell broken', () => {
  const p = new Puzzle([3, 1, 1], Uint8Array.from([1, 0, 0]), new Uint32Array(3));
  assert.equal(p.isSolved(Uint8Array.from([0, 1, 0])), false);
  assert.equal(p.isSolved(Uint8Array.from([0, 1, 1])), true);
});

test('tutorial lessons are solvable with exactly the clues they show', async () => {
  const { TUTORIAL } = await import('../public/js/shapes.js');
  for (const lesson of TUTORIAL) {
    const p = make(lesson);
    for (const line of p.lines) line.hidden = !lesson.show[line.axis];
    assert.ok(lineSolve(p), `${lesson.id} not solvable`);
  }
});

test('bonus stones: one per chapter, solvable, phone-sized, harder than their chapter', async () => {
  const { BONUS } = await import('../public/js/shapes.js');
  assert.deepEqual(BONUS.map((b) => b.chapter), CHAPTERS.map((c) => c.name), 'one bonus per chapter, in order');
  const ids = new Set([...SHAPES, ...BONUS].map((s) => s.id));
  assert.equal(ids.size, SHAPES.length + BONUS.length, 'bonus ids collide');
  for (const b of BONUS) {
    assert.ok(b.bonus && b.id.startsWith('bonus-'), `${b.id} flagged`);
    assert.ok(b.dims.every((d) => d >= 2 && d <= 11), `${b.id} dims ${b.dims}`);
    const { p, ok } = prepared(b);
    assert.ok(ok && lineSolve(p), `${b.id} not uniquely line-solvable with its clues`);
    const chisel = p.size - p.solid.reduce((a, c) => a + c, 0);
    assert.ok(chisel <= 330, `${b.id} needs ${chisel} chisels`);
    const hardest = Math.max(...SHAPES.filter((s) => s.chapter === b.chapter).map((s) => {
      const q = prepared(s).p;
      return difficulty(solveStats(q), q);
    }));
    const { p: q } = prepared(b);
    const d = difficulty(solveStats(q), q);
    console.log(`${b.id.padEnd(18)} D ${d.toFixed(1)}  (chapter hardest ${hardest.toFixed(1)})`);
    assert.ok(d > hardest, `${b.id} (${d.toFixed(1)}) should be harder than its chapter (${hardest.toFixed(1)})`);
  }
});

test('every object has a short story and every chapter a title line', async () => {
  const { BONUS } = await import('../public/js/shapes.js');
  for (const s of [...SHAPES, ...BONUS]) {
    assert.ok(typeof s.story === 'string' && s.story.length > 0, `${s.id} has no story`);
    assert.ok(s.story.split(/\s+/).length <= 14, `${s.id} story too long`);
  }
  for (const c of CHAPTERS) {
    assert.ok(c.numeral && c.line, `${c.name} missing numeral/line`);
    assert.ok(c.line.split(/\s+/).length <= 9, `${c.name} line too long`);
  }
});
