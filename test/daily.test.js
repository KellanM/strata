// The Daily Stone (public/js/daily.js, docs/daily-stone.md): the date gives the
// same stone on every device, every day's stone is fair (one answer, reached by
// line logic, in the mid-difficulty band), and the share line can't give the
// answer away.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  dayNumber, dateOf, daySeed, dailyStone, dailyPalette, judge, cellWaves, slipWaves,
  shareText, INVITE, linkedDay, recordDay, readDays, streakAt, noteShare, DAILY_BAND, DAILY_URL, WAVE_CLEAN, WAVE_SLIP,
} from '../public/js/daily.js';
import { Puzzle, setClues, lineSolve, solveStats } from '../public/js/puzzle.js';
import { buildCells } from '../public/js/shapes.js';
import { SHAPES, BONUS } from '../public/js/shapes.js';
import { prepare, countSolutions, cluesConsistent } from '../tools/aha-lib.mjs';

const DAYS = 400;
const memStore = () => {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), map: m };
};

test('daily: the date gives the day number, by the local calendar date', () => {
  assert.equal(dayNumber(new Date(2026, 9, 31, 0, 0, 1)), 1);
  assert.equal(dayNumber(new Date(2026, 9, 31, 23, 59, 59)), 1);
  assert.equal(dayNumber(new Date(2026, 10, 1, 0, 0, 0)), 2);
  assert.equal(dayNumber(new Date(2027, 9, 31, 12)), 366);
  // across both daylight-saving changes, every day is one more than the last
  let prev = dayNumber(new Date(2027, 0, 1, 12));
  for (let k = 1; k < 400; k++) {
    const n = dayNumber(new Date(2027, 0, 1 + k, 12));
    assert.equal(n, prev + 1);
    prev = n;
  }
  assert.equal(dateOf(1), '2026-10-31');
  assert.equal(dateOf(dayNumber(new Date(2027, 2, 14, 9))), '2027-03-14');
});

test('daily: seeds and stones are deterministic (same day, same stone)', () => {
  for (let n = 1; n <= 50; n++) {
    assert.equal(daySeed(n), daySeed(n));
    assert.ok(Number.isInteger(daySeed(n)) && daySeed(n) >= 1);
  }
  // a fixed point, so a change to the generator can't slip by unnoticed (it would reseed every day)
  assert.equal(daySeed(1), 829554316);
  const a = dailyStone(7), b = dailyStone(7);
  const ca = buildCells(a.shape), cb = buildCells(b.shape);
  assert.deepEqual([...ca.solid], [...cb.solid]);
  assert.deepEqual([...ca.colors], [...cb.colors]);
  assert.deepEqual(dailyPalette(7), dailyPalette(7));
  // neighbouring days differ
  const seen = new Set();
  for (let n = 1; n <= 60; n++) seen.add([...buildCells(dailyStone(n).shape).solid].join(''));
  assert.equal(seen.size, 60, 'two days share a stone');
});

test(`daily: ${DAYS} consecutive days are each uniquely solvable by line logic, mid-difficulty`, () => {
  const t0 = performance.now();
  const levelIds = new Set([...SHAPES, ...BONUS].map((s) => s.id));
  for (let n = 1; n <= DAYS; n++) {
    const { shape, d, chisel, waves } = dailyStone(n);
    assert.ok(!levelIds.has(shape.id) && shape.id === `daily-${n}`, `${shape.id}: not a level's object`);
    // the game's own check, as for the levels: line logic settles every cell
    const { solid, colors } = buildCells(shape);
    const p = new Puzzle(shape.dims, solid, colors);
    assert.ok(setClues(p, shape) && lineSolve(p), `day ${n}: not line-solvable with its clues`);
    assert.ok(judge(shape).ok, `day ${n}: outside the band`);
    assert.ok(d >= DAILY_BAND.minD && d <= DAILY_BAND.maxD, `day ${n}: difficulty ${d}`);
    assert.ok(chisel >= DAILY_BAND.minChisel && chisel <= DAILY_BAND.maxChisel, `day ${n}: ${chisel} chisels`);
    assert.equal(solveStats(p).rounds, waves);
    // and the independent check the levels get (uniqueness.test.js)
    const q = prepare(shape);
    assert.ok(cluesConsistent(q), `day ${n}: a clue disagrees with the stone`);
    const r = countSolutions(q, 2);
    assert.ok(r.exhausted && r.solutions === 1 && !r.differsFromShape, `day ${n}: ${r.solutions} solutions`);
  }
  console.log(`${DAYS} daily stones checked in ${((performance.now() - t0) / 1000).toFixed(1)} s`);
});

test('daily: waves per cell match the solver, and slips map to their wave', () => {
  const { shape, waves } = dailyStone(3);
  const p = prepare(shape);
  const { wave, count } = cellWaves(p);
  assert.equal(count, waves);
  assert.ok([...wave].every((w) => w >= 0 && w < count), 'every cell settles in some wave');
  const solidCell = p.solid.findIndex((s) => s);
  const flags = slipWaves(p, [solidCell]);
  assert.equal(flags.length, count);
  assert.equal(flags.filter(Boolean).length, 1);
  assert.ok(flags[wave[solidCell]]);
});

test('daily: the share line is right and never carries the solution', () => {
  const text = shareText({ day: 12, stars: 2, slips: 1, seconds: 252, waves: [false, false, true, false, false], streak: 5 });
  assert.equal(text, [
    'Strata · Daily #12',
    '◆◆◇ · 1 slip · 4:12',
    `${WAVE_CLEAN}${WAVE_CLEAN}${WAVE_SLIP}${WAVE_CLEAN}${WAVE_CLEAN}`,
    '5 days in a row',
    INVITE,
    `${DAILY_URL}?d=12`,
  ].join('\n'));
  assert.match(shareText({ day: 3, stars: 3, slips: 0, seconds: 61, waves: [false], streak: 1 }), /no slips · 1:01\n🟨\nOne 3D logic puzzle a day\. One answer, no guessing\.\nhttps/);

  // For every day: the share of a real solve is a function of the numbers
  // alone. Two different stones solved with the same numbers share the same
  // text but for the day, so nothing of a stone's shape can be in it.
  const ALLOWED = new RegExp(`^[A-Za-z0-9 #·:/?=.,\\n◆◇${WAVE_CLEAN}${WAVE_SLIP}-]+$`, 'u');
  const strip = (t) => t.replace(/#\d+/, '#N').replace(/\?d=\d+/, '?d=N');
  let reference = null;
  for (let n = 1; n <= DAYS; n++) {
    const { shape, waves } = dailyStone(n);
    const p = prepare(shape);
    // a player who slips on the first solid cube of the stone
    const slip = p.solid.findIndex((s) => s);
    const flags = slipWaves(p, [slip]);
    const t = shareText({ day: n, stars: 2, slips: 1, seconds: 200, waves: flags, streak: 4 });
    assert.match(t, ALLOWED, `day ${n}: an unexpected character`);
    assert.ok(t.length < 200, `day ${n}: too long`);
    assert.ok(t.startsWith('Strata · Daily #' + n + '\n') && t.endsWith(`?d=${n}`));
    // nothing of the stone: not its name, colours, size or its solid cells as bits
    const bits = [...p.solid].join('');
    assert.ok(!t.includes(bits.slice(0, 24)), `day ${n}: the solid cells`);
    for (const c of new Set(buildCells(shape).colors)) if (c) assert.ok(!t.toLowerCase().includes(c.toString(16)), `day ${n}: a colour`);
    assert.ok(!/\d+\s*[x×]\s*\d+/.test(t) && !t.includes('³'), `day ${n}: the block's size`);
    // the wave row: one square per wave of the solve, no more
    const row = t.split('\n')[2];
    assert.equal([...row].length, waves);
    // the same numbers on another stone give the same words
    const same = shareText({ day: n, stars: 2, slips: 1, seconds: 200, waves: new Array(waves).fill(false), streak: 4 });
    reference ??= strip(same).split('\n').filter((_, k) => k !== 2).join('\n');
    assert.equal(strip(same).split('\n').filter((_, k) => k !== 2).join('\n'), reference);
  }
});

test('daily: ?d=N links', () => {
  assert.equal(linkedDay('?d=12'), 12);
  assert.equal(linkedDay('?lessons=new&d=400'), 400);
  for (const bad of ['', '?d=', '?d=0', '?d=-3', '?d=1.5', '?d=abc', '?d=12345678', '?x=1']) assert.equal(linkedDay(bad), null, bad);
});

test('daily: the streak is local, gentle, and a replay changes nothing', () => {
  const store = memStore();
  const solve = (n, extra = {}) => recordDay(n, { seconds: 100, slips: 0, stars: 3, score: 900, waves: [false, true], ...extra }, store);
  assert.equal(streakAt(readDays(store), 10), 0);
  assert.ok(solve(10).first);
  assert.equal(streakAt(readDays(store), 10), 1);
  solve(11); solve(12);
  assert.equal(streakAt(readDays(store), 12), 3);
  // the next morning, before it's solved, the run still stands
  assert.equal(streakAt(readDays(store), 13), 3);
  // a missed day starts a new run, quietly
  solve(14);
  assert.equal(streakAt(readDays(store), 14), 1);
  // the first solve of a day is the day's result
  assert.equal(solve(14, { seconds: 5 }).first, false);
  assert.equal(readDays(store)[14].t, 100);
  assert.equal(readDays(store)[14].w, '01');
  assert.equal(noteShare(store), 1);
  assert.equal(noteShare(store), 2);
  // only strata.daily.* keys, nothing else written
  assert.deepEqual([...store.map.keys()].sort(), ['strata.daily.days', 'strata.daily.shares']);
});
