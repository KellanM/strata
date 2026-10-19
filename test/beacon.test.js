// Beacon Hills replaced Teatime as chapter II (docs/biomes-adventure.md).
// Teatime's stones moved with their ids (First Light, Moss Garden, The Lagoon,
// Clockwork Workshop); Cake Stand and the Layer Cake shrine (bonus-teatime)
// retired. Saves from before must keep every solve that still has a stone,
// carry retired solves harmlessly, keep the trail they had walked, and open
// nothing far ahead.
import { test } from 'node:test';
import assert from 'node:assert/strict';

class Store {
  constructor(init = {}) { this.m = new Map(Object.entries(init)); }
  getItem(k) { return this.m.has(k) ? this.m.get(k) : null; }
  setItem(k, v) { this.m.set(k, String(v)); }
  removeItem(k) { this.m.delete(k); }
}
globalThis.localStorage = new Store();   // map.js reads its developer switch from here

const { SHAPES, BONUS, CHAPTERS, ADDED_LATER, RETIRED } = await import('../public/js/shapes.js');
const { migrateSaves } = await import('../public/js/migrate.js');
const { progress, bonusFor } = await import('../public/js/map.js');
const { recordStars } = await import('../public/js/score.js');

const BEACON = ['thistle', 'beacon', 'pocket-compass', 'hill-ram', 'torch-fox', 'heron', 'watchtower', 'pack-donkey'];
const TEATIME = ['teabag-pal', 'toaster', 'cake-stand', 'mug', 'stand-mixer', 'fried-egg', 'bunny-teacup', 'teapot'];
const MOVED = { 'teabag-pal': 'First Light', toaster: 'First Light', 'fried-egg': 'First Light', teapot: 'First Light',
  'bunny-teacup': 'Moss Garden', mug: 'The Lagoon', 'stand-mixer': 'Clockwork Workshop' };

// the trail as it was with Teatime as chapter II
const moved = new Set(TEATIME);
const firstLight = SHAPES.filter((s) => s.chapter === 'First Light' && !moved.has(s.id)).map((s) => s.id);
const rest = SHAPES.filter((s) => s.chapter !== 'First Light' && s.chapter !== 'Beacon Hills' && !moved.has(s.id)).map((s) => s.id);
const oldTrail = [...firstLight, ...TEATIME, ...rest];
const oldShrines = [...BONUS.map((b) => b.id).filter((id) => id !== 'bonus-beacon-hills'), 'bonus-teatime'];

const entries = SHAPES.map((shape) => ({ shape }));
const at = (id) => SHAPES.findIndex((s) => s.id === id);
const rec = (stars) => ({ time: 90, mistakes: 3 - stars, stars, score: 1000 + stars });
const solvedThrough = (id) => {
  const out = {};
  for (const s of oldTrail) { out[s] = rec(3); if (s === id) break; }
  return out;
};
const run = (solved) => {
  const store = new Store({ 'strata.solved': JSON.stringify(solved), 'strata.map.objects': JSON.stringify(Object.keys(solved)),
    'strata.chapters': JSON.stringify(['First Light', 'Teatime']), 'strata.map.chapters': JSON.stringify(['First Light', 'Teatime']),
    'strata.migrated.shrines-p9': '1' });   // Teatime lasted until after page 9, so these saves had that migration
  migrateSaves(store);
  return JSON.parse(store.getItem('strata.solved'));
};
// every open stone is solved, the first unsolved, or at most two past the furthest solved stone the trail reached
const sane = (solved) => {
  const { furthest, first, open } = progress(entries, solved);
  open.forEach((o, i) => { if (o) assert.ok(solved[SHAPES[i].id] || i === first || i <= furthest + 2, `${SHAPES[i].id} opened oddly`); });
  return { furthest, first, open };
};
// what the journal and the map count: only current stones and shrines (journal.js, map.js)
const totals = (solved) => {
  const all = [...SHAPES, ...BONUS];
  return { found: all.filter((s) => solved[s.id]).length, gems: all.reduce((n, s) => n + recordStars(s, solved[s.id]), 0) };
};
// a shrine opens at its stars once the trail reaches its chapter (map.js renderMap)
const shrineOpen = (chapter, solved, open) => {
  const items = SHAPES.filter((s) => s.chapter === chapter);
  const stars = items.reduce((n, s) => n + recordStars(s, solved[s.id]), 0);
  const reached = items.every((s) => solved[s.id]) || items.some((s) => !solved[s.id] && open[at(s.id)]);
  return stars >= Math.min(12, items.length * 2) && reached;
};

test('chapter II is Beacon Hills; Teatime stones moved with their ids, retired ids stay retired', () => {
  assert.equal(CHAPTERS[1].name, 'Beacon Hills');
  assert.equal(CHAPTERS[1].numeral, 'II');
  assert.deepEqual(SHAPES.filter((s) => s.chapter === 'Beacon Hills').map((s) => s.id).sort(), [...BEACON].sort());
  assert.equal(bonusFor('Beacon Hills')?.name, 'The Great Beacon');
  assert.equal(bonusFor('Beacon Hills').id, 'bonus-beacon-hills');
  for (const [id, ch] of Object.entries(MOVED)) assert.equal(SHAPES.find((s) => s.id === id)?.chapter, ch, `${id} in ${ch}`);
  assert.equal(SHAPES.filter((s) => s.chapter === 'First Light').at(-1).id, 'teapot', 'the Teapot is First Light\'s finale');
  for (const id of [...BEACON, ...Object.keys(MOVED)]) assert.ok(ADDED_LATER.has(id), `${id} in ADDED_LATER`);
  for (const id of RETIRED) assert.ok(![...SHAPES, ...BONUS].some((s) => s.id === id), `retired ${id} reused`);
  assert.ok(RETIRED.has('cake-stand') && RETIRED.has('bonus-teatime'));
  assert.ok(!CHAPTERS.some((c) => c.name === 'Teatime'));
});

test('an old save that solved Teatime and the Layer Cake keeps its moved solves and its trail', () => {
  // into Moss Garden, with every Teatime stone and both early shrines solved
  const before = { ...solvedThrough('snail-cottage'), 'bonus-first-light': rec(3), 'bonus-teatime': rec(2) };
  const solved = run(before);
  assert.deepEqual(solved, before, 'nothing is rewritten: retired solves stay, moved ones keep their ids');
  for (const id of Object.keys(MOVED)) assert.deepEqual(solved[id], rec(3), `${id} still solved`);
  const { furthest, first, open } = sane(solved);
  assert.equal(SHAPES[furthest].id, 'snail-cottage', 'the trail still reaches into Moss Garden');
  assert.equal(SHAPES[first].id, BEACON[0], 'the new chapter waits behind it');
  for (const id of BEACON) assert.ok(open[at(id)], `${id} open`);
  assert.ok(open[at('hatching-chick')] && open[at('moth')]);
  assert.ok(!open[at('cat')], 'nothing further on opened');
  // the moved Mug and Stand Mixer stay solved far ahead without opening their chapters
  assert.ok(open[at('mug')] && open[at('stand-mixer')]);
  assert.ok(!open[at('flip-flops')] && !open[at('record-player')], 'The Lagoon and Clockwork stay locked');
  assert.ok(!shrineOpen('The Lagoon', solved, open) && !shrineOpen('Clockwork Workshop', solved, open));
  assert.ok(!shrineOpen('Beacon Hills', solved, open), 'the Great Beacon waits for its stars');
  // the orphaned Layer Cake and Cake Stand solves count nowhere, and break nothing
  const t = totals(solved);
  const live = Object.keys(solved).filter((id) => !RETIRED.has(id));
  assert.equal(t.found, live.length);
  assert.equal(t.gems, live.length * 3);
  assert.equal(migrateSaves(new Store({ 'strata.solved': JSON.stringify(solved), 'strata.migrated.shrines-p9': '1' })), false, 'idempotent');
});

test('a mid-progress save keeps every solved stone; moved stones fill in behind it', () => {
  // all of the old First Light and the first four Teatime stones (Mug included)
  const solved = run(solvedThrough('mug'));
  const { furthest, first, open } = sane(solved);
  assert.equal(SHAPES[first].id, 'fried-egg', 'the unsolved moved stones in First Light open first');
  assert.equal(SHAPES[furthest].id, 'kitten-box', 'the trail is not cut back');
  assert.ok(open[at('fried-egg')] && open[at('teapot')] && open[at(BEACON[0])]);
  assert.ok(!open[at(BEACON[1])], 'Beacon Hills opens one stone at a time');
  assert.ok(open[at('mug')] && !open[at('flip-flops')] && !open[at('axolotl')], 'a solved Mug does not open The Lagoon');
  assert.ok(!open[at('snail')] && !open[at('bunny-teacup')], 'Moss Garden still locked');
  assert.ok(shrineOpen('First Light', solved, open), 'the Cottage is open, as it was');
  // through Teatime, skipping Stand Mixer and Fried Egg: First Light's gap is
  // not a lock, the trail reaches the Teapot, and the new chapter opens next
  const later = solvedThrough('teapot');
  delete later['stand-mixer']; delete later['fried-egg'];
  const p = sane(run(later));
  assert.equal(SHAPES[p.furthest].id, 'teapot');
  assert.equal(SHAPES[p.first].id, 'fried-egg');
  assert.ok(p.open[at(BEACON[0])] && p.open[at(BEACON[1])] && !p.open[at(BEACON[2])]);
  assert.ok(!p.open[at('snail')] && p.open[at('bunny-teacup')] && !p.open[at('cat')], 'a solved Bunny opens nothing round it');
});

test('a finished save keeps the whole map open, with the new chapter to play', () => {
  const all = Object.fromEntries([...oldTrail, ...oldShrines].map((id) => [id, rec(3)]));
  const solved = run(all);
  const { first, open } = sane(solved);
  assert.ok(open.every(Boolean), 'the whole map stays open');
  assert.equal(SHAPES[first].id, BEACON[0]);
  assert.ok(!solved['bonus-beacon-hills'], 'the Great Beacon is new and unsolved');
  for (const b of BONUS) if (b.chapter !== 'Beacon Hills') assert.ok(shrineOpen(b.chapter, solved, open) || solved[b.id], `${b.chapter} shrine`);
  const t = totals(solved);
  assert.equal(t.found, SHAPES.length + BONUS.length - BEACON.length - 1);
  assert.equal(t.gems, t.found * 3);
});

test('a fresh save opens only the first two stones', () => {
  const store = new Store();
  assert.equal(migrateSaves(store), false);
  const { first, open } = sane({});
  assert.equal(first, 0);
  assert.deepEqual(open.map((o, i) => o && i), [0, 1, ...Array(open.length - 2).fill(false)]);
  assert.deepEqual(totals({}), { found: 0, gems: 0 });
});
