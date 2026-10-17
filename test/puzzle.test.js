import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Puzzle, lineSolve, hideClues, STYLE_CIRCLE, STYLE_SQUARE } from '../public/js/puzzle.js';
import { SHAPES, randomShape, buildCells } from '../public/js/shapes.js';

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

test('every built-in shape is line-solvable after hiding clues', () => {
  for (const shape of SHAPES) {
    const p = make(shape);
    const t0 = performance.now();
    assert.ok(hideClues(p, shape.fraction, 7), `${shape.id} not solvable with full clues`);
    const ms = performance.now() - t0;
    assert.ok(lineSolve(p), `${shape.id} unsolvable after hiding`);
    const hidden = p.lines.filter((l) => l.hidden).length;
    console.log(`${shape.id} ${shape.dims.join('x')}: hid ${hidden}/${p.lines.length} in ${ms.toFixed(0)}ms`);
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
