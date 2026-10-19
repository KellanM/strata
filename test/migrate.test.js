// Gallery page 9 swapped four shrines; the old shrine objects became levels.
// Saves from before must keep those solves on the same objects, leave the new
// shrines unsolved, and keep the trail they had walked (docs/biomes.md).
import { test } from 'node:test';
import assert from 'node:assert/strict';

class Store {
  constructor(init = {}) { this.m = new Map(Object.entries(init)); }
  getItem(k) { return this.m.has(k) ? this.m.get(k) : null; }
  setItem(k, v) { this.m.set(k, String(v)); }
  removeItem(k) { this.m.delete(k); }
}
globalThis.localStorage = new Store();   // map.js reads its developer switch from here

const { SHAPES, BONUS, ADDED_LATER } = await import('../public/js/shapes.js');
const { migrateSaves, SHRINE_MOVES, SHRINE_FLAG } = await import('../public/js/migrate.js');
const { progress } = await import('../public/js/map.js');

const entries = SHAPES.map((shape) => ({ shape }));
const P9 = ['chameleon', 'ostrich', 'hooded-falcon', 'kasbah', 'brass-lantern', 'first-seed', 'mikoshi', ...Object.values(SHRINE_MOVES)];
// the trail as it was before page 9: today's order without the page-9 stones
const oldTrail = SHAPES.filter((s) => !P9.includes(s.id));
const rec = (stars) => ({ time: 90, mistakes: 3 - stars, stars, score: 1000 + stars });
const solvedThrough = (id) => {
  const out = {};
  for (const s of oldTrail) { out[s.id] = rec(3); if (s.id === id) break; }
  return out;
};
const run = (solved) => {
  const store = new Store({ 'strata.solved': JSON.stringify(solved), 'strata.map.objects': JSON.stringify(Object.keys(solved)) });
  migrateSaves(store);
  return { store, solved: JSON.parse(store.getItem('strata.solved')), seen: JSON.parse(store.getItem('strata.map.objects')) };
};
// every open stone is solved or lies at most two past the furthest solved stone the trail reached
const sane = (solved) => {
  const { furthest, first, open } = progress(entries, solved);
  open.forEach((o, i) => { if (o) assert.ok(solved[SHAPES[i].id] || i === first || i <= furthest + 2, `${SHAPES[i].id} opened oddly`); });
  return { furthest, first, open };
};
const at = (id) => SHAPES.findIndex((s) => s.id === id);

test('page-9 stones and the demoted shrines are levels, flagged as added later', () => {
  for (const id of P9) {
    assert.ok(SHAPES.some((s) => s.id === id), `${id} is a level`);
    assert.ok(ADDED_LATER.has(id), `${id} in ADDED_LATER`);
  }
  for (const id of Object.keys(SHRINE_MOVES)) assert.ok(BONUS.some((b) => b.id === id), `${id} still a shrine`);
  const names = Object.fromEntries(BONUS.map((b) => [b.id, b.name]));
  assert.equal(names['bonus-moss-garden'], 'Moss Tortoise');
  assert.equal(names['bonus-the-lagoon'], 'Sea Gate');
  assert.equal(names['bonus-ember-steps'], 'Summit Shrine');
  assert.equal(names['bonus-clockwork-workshop'], 'Clock Tower');
  assert.equal(names['bonus-the-orchard'], 'Mother Tree');
  assert.equal(names['bonus-lantern-festival'], 'Great Lantern Gate');
});

test('a save with old Frog and Whale shrine solves keeps them on the Frog and the Whale', () => {
  const before = { ...solvedThrough('seahorse'), 'bonus-moss-garden': rec(3), 'bonus-the-lagoon': rec(2), 'bonus-teatime': rec(1) };
  const { store, solved, seen } = run(before);
  assert.deepEqual(solved.frog, rec(3));
  assert.deepEqual(solved.whale, rec(2));
  assert.equal(solved['bonus-moss-garden'], undefined, 'the Moss Tortoise waits unsolved');
  assert.equal(solved['bonus-the-lagoon'], undefined, 'the Sea Gate waits unsolved');
  assert.deepEqual(solved['bonus-teatime'], rec(1), 'untouched shrines keep their solve');
  assert.ok(seen.includes('frog') && !seen.includes('bonus-moss-garden'), 'the map remembers the Frog, not the new shrine');
  assert.equal(store.getItem(SHRINE_FLAG), '1');
  // the trail: still mid-Deep, the new Orchard level behind it open, nothing far ahead
  const { furthest, first, open } = sane(solved);
  assert.equal(SHAPES[furthest].id, 'seahorse');
  assert.equal(SHAPES[first].id, 'first-seed');
  assert.ok(open[at('first-seed')] && open[at('baby-shark')]);
  assert.ok(!open[at('cactus')], 'Desert Oasis not opened');

  // idempotent: a second run changes nothing, and a later solve of the new shrine stays put
  solved['bonus-moss-garden'] = rec(1);
  store.setItem('strata.solved', JSON.stringify(solved));
  assert.equal(migrateSaves(store), false);
  const again = JSON.parse(store.getItem('strata.solved'));
  assert.deepEqual(again['bonus-moss-garden'], rec(1));
  assert.deepEqual(again.frog, rec(3));
});

test('a mid-progress save keeps its trail; new stones behind it open', () => {
  const { solved } = run(solvedThrough('tsukubai'));     // Desert done (its old five), into Ember Steps
  const { furthest, first, open } = sane(solved);
  assert.equal(SHAPES[furthest].id, 'tsukubai');
  assert.equal(SHAPES[first].id, 'frog');
  for (const id of ['frog', 'first-seed', 'whale', 'chameleon', 'ostrich', 'hooded-falcon', 'kasbah', 'brass-lantern']) assert.ok(open[at(id)], `${id} open`);
  assert.ok(open[at('fan')] && open[at('tea-house')]);
  for (const id of ['shiba-pup', 'paper-lantern', 'spiral', 'moai', 'gear-train', 'mikoshi']) assert.ok(!open[at(id)], `${id} locked`);
});

test('a save that solved every shrine and stone keeps it all', () => {
  const all = Object.fromEntries([...oldTrail.map((s) => s.id), 'bonus-moss-garden', 'bonus-the-lagoon', 'bonus-ember-steps', 'bonus-clockwork-workshop'].map((id) => [id, rec(3)]));
  const { solved } = run(all);
  for (const id of Object.values(SHRINE_MOVES)) assert.ok(solved[id]);
  const { open } = sane(solved);
  assert.ok(open.every(Boolean), 'the whole map stays open');
});

test('a fresh save opens only the first stone and migrates nothing', () => {
  const store = new Store();
  assert.equal(migrateSaves(store), false);
  assert.equal(store.getItem('strata.solved'), null);
  assert.equal(store.getItem(SHRINE_FLAG), '1');
  const { first, open } = sane({});
  assert.equal(first, 0);
  assert.deepEqual(open.map((o, i) => o && i), [0, 1, ...Array(open.length - 2).fill(false)]);
});
