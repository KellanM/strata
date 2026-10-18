// Independent check of the clue sets the game shows (docs/aha-study.md, part 1):
// a separately written propagator plus backtracking search must find exactly
// one solution, the shape itself, for every level, bonus stone and lesson.
// Checks existing behaviour only; it changes no clue.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SHAPES, BONUS, TUTORIAL } from '../public/js/shapes.js';
import { prepare, countSolutions, cluesConsistent, bruteCount } from '../tools/aha-lib.mjs';

test('every puzzle has exactly one solution under its shown clues (independent search)', () => {
  for (const shape of [...SHAPES, ...BONUS, ...TUTORIAL]) {
    const p = prepare(shape);
    assert.ok(cluesConsistent(p), `${shape.id}: a clue disagrees with the shape`);
    const r = countSolutions(p, 2);
    assert.ok(r.exhausted, `${shape.id}: search budget ran out`);
    assert.equal(r.solutions, 1, `${shape.id}: ${r.solutions} solutions`);
    assert.ok(!r.differsFromShape, `${shape.id}: the one solution is not the shape`);
    const brute = bruteCount(p);
    if (brute !== null) assert.equal(brute, 1, `${shape.id}: brute force finds ${brute}`);
  }
});
