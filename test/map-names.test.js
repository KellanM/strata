// With chapters still locked, the map names only the next one; the ones past it
// stay nameless until they become the next.
import { test } from 'node:test';
import assert from 'node:assert/strict';

globalThis.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };
const { namesShown, onMap } = await import('../public/js/map.js');

test('a fresh save names the first chapter and the next one only', () => {
  assert.deepEqual(namesShown([true, false, false, false]), [true, true, false, false]);
});

test('with a couple of chapters open, the first locked one is named and later ones are not', () => {
  assert.deepEqual(namesShown([true, true, true, false, false, false]), [true, true, true, true, false, false]);
});

test('nothing reached yet (lessons unfinished): only the first chapter is named', () => {
  assert.deepEqual(namesShown([false, false, false]), [true, false, false]);
});

test('everything reached: every chapter is named', () => {
  assert.deepEqual(namesShown([true, true, true]), [true, true, true]);
});

// A locked world's shrine stays under its cloud with its stones, even for the
// next chapter (whose name shows); it appears as that chapter's cloud parts.
test('a chapter not yet reached draws neither its stones nor its shrine', () => {
  const locked = { reached: false }, open = { reached: true };
  assert.equal(onMap({ kind: 'bonus', region: locked }), false);
  assert.equal(onMap({ kind: 'puzzle', region: locked }), false);
  assert.equal(onMap({ kind: 'bonus', region: open }), true);
  assert.equal(onMap({ kind: 'puzzle', region: open }), true);
});

test('the lessons and the Drift are always on the map', () => {
  assert.equal(onMap({ kind: 'learn' }), true);
  assert.equal(onMap({ kind: 'drift' }), true);
});
