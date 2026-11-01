// The Daily Stone (public/js/daily.js, public/js/dailies.js, docs/daily-stone.md):
// the date gives the same stone on every device, the calendar of curated stones
// keeps its rules (and its past), every day's stone is fair (one answer, reached
// by line logic, in the mid-difficulty band), and the share line can't give the
// answer away.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  dayNumber, dateOf, daySeed, dailyStone, generatedStone, dailyPalette, judge, cellWaves, slipWaves, calendar, stoneIdOf,
  shareText, INVITE, linkedDay, recordDay, readDays, streakAt, noteShare, DAILY_BAND, DAILY_URL, WAVE_CLEAN, WAVE_SLIP,
} from '../public/js/daily.js';
import { DAILIES, DAILY_BY_ID, SECTIONS, CURATED_FROM, DATED, ROTATION } from '../public/js/dailies.js';
import { Puzzle, setClues, lineSolve, solveStats } from '../public/js/puzzle.js';
import { buildCells } from '../public/js/shapes.js';
import { SHAPES, BONUS } from '../public/js/shapes.js';
import { LANGS } from '../public/js/i18n.js';
import { prepare, countSolutions, cluesConsistent } from '../tools/aha-lib.mjs';
import { PALETTES } from '../public/js/palettes.js';
import { readdirSync, readFileSync } from 'node:fs';

const DAYS = 400;
const LAST_2030 = dayNumber(new Date(2030, 11, 31, 12));
const sectionOf = (id) => DAILY_BY_ID.get(id).section;
// for spreading the calendar, page 19's Toy Box, Again counts as page 18's Toy Box
const familyOf = (id) => (sectionOf(id) === 'toybox' ? 'toys' : sectionOf(id));
// the days already played when the last stones were added (Daily #2, 1 Nov 2026, page 19's picks):
// each day's stone, as it was shared. Never edit these; add the next day played instead.
const PLAYED = { 1: null, 2: 'daily-piggy-bank' };
const DATED_IDS = new Set(DATED.map((d) => d.id));
// every name a stone has, in every language
const NAMES = [];
for (const code of LANGS) {
  const T = code === 'en' ? null : (await import(`../public/i18n/${code}.js`)).strings;
  for (const s of DAILIES) NAMES.push(T ? T[`name.${s.id}`] : s.name);
}
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
  for (const n of [1, 7]) {
    const a = dailyStone(n), b = dailyStone(n);
    const ca = buildCells(a.shape), cb = buildCells(b.shape);
    assert.deepEqual([...ca.solid], [...cb.solid]);
    assert.deepEqual([...ca.colors], [...cb.colors]);
    assert.deepEqual(dailyPalette(n), dailyPalette(n));
  }
  // the generator's neighbouring days differ
  const seen = new Set();
  for (let n = 1; n <= 60; n++) seen.add([...buildCells(generatedStone(n).shape).solid].join(''));
  assert.equal(seen.size, 60, 'two days share a stone');
});

// ---------------------------------------------------------------- the calendar (dailies.js)

test('daily: Daily #1 keeps the stone it was shared with', () => {
  // the generated stone of 31 Oct 2026, as it was before the curated stones came
  assert.equal(stoneIdOf(1), null);
  const { shape, seed, attempt, d } = dailyStone(1);
  assert.equal(shape.id, 'daily-1');
  assert.equal(seed, 1059122607);
  assert.equal(attempt, 4);
  assert.deepEqual(shape.dims, [6, 6, 6]);
  assert.equal([...buildCells(shape).solid].join(''),
    '000000111000111000110000000000000000110100111110111000111000010000000000111110111110111110111000010000000000'
    + '011111111111111110111100011100011000111110111110111110111100111100011100111100111100111100111100111100011100');
  assert.equal(d.toFixed(3), '10.839');
  assert.equal(dailyPalette(1).base, 'Clouds');
  assert.equal(dailyPalette(1).skyTop, 13689087);
});

test('daily: from Daily #2 (1 Nov 2026) every day is one of the curated stones', () => {
  assert.equal(CURATED_FROM, 2);
  assert.equal(dateOf(CURATED_FROM), '2026-11-01');
  assert.equal(stoneIdOf(2), 'daily-piggy-bank');
  for (let n = 2; n <= LAST_2030; n++) {
    const id = stoneIdOf(n);
    assert.ok(DAILY_BY_ID.has(id), `day ${n}: ${id}`);
    const { shape, curated } = dailyStone(n);
    assert.ok(curated && shape.id === id && shape.daily === n && /^cand-p1[89]-/.test(shape.from), `day ${n}`);
  }
  // every stone has its place in the calendar, once: dated, or in the rotation
  const placed = [...DATED.map((d) => d.id), ...ROTATION.at(-1).order];
  assert.deepEqual([...placed].sort(), DAILIES.map((s) => s.id).sort());
  for (const era of ROTATION) for (const id of era.order) assert.ok(DAILY_BY_ID.has(id), id);
});

test('daily: the days already played keep their stones (Daily #1 and #2)', () => {
  for (const [n, id] of Object.entries(PLAYED)) assert.equal(stoneIdOf(Number(n)), id, `Daily #${n}`);
  assert.equal(dateOf(2), '2026-11-01');
  // every line in the lists starts on a day not yet played when it was added, and the calendar
  // made of only the lines in force on each played day agrees with today's, up to that day
  const lastPlayed = Math.max(...Object.keys(PLAYED).map(Number));
  for (const n of Object.keys(PLAYED).map(Number).filter((x) => x >= CURATED_FROM)) {
    const rotation = ROTATION.filter((e) => e.since <= n), dated = DATED.filter((d) => d.since <= n);
    assert.deepEqual(calendar(lastPlayed, { rotation, dated }).slice(0, n + 1), calendar(lastPlayed).slice(0, n + 1), `Daily #${n}`);
  }
  // page 19's lines (added on Daily #2) start tomorrow, Daily #3, not on a day already played
  for (const line of [...ROTATION.slice(1), ...DATED.filter((d) => DAILY_BY_ID.get(d.id).from.startsWith('cand-p19-'))]) {
    assert.ok(line.since > lastPlayed, `since ${line.since}: a day already played`);
  }
});

test('daily: the dated stones fall on their dates, 2026-2030, and on no other day', () => {
  const DATES = {
    'daily-black-cat': [10, 31], 'daily-nutcracker': [12, 6], 'daily-melted-snowman': [3, 20],
    'daily-sugar-skull': [11, 2], 'daily-cupid': [2, 14], 'daily-toadstool-frog': [9, 22], 'daily-squirrel-pumpkin': [11, 1],
  };
  assert.deepEqual(Object.keys(DATES).sort(), [...DATED_IDS].sort());
  for (let y = 2026; y <= 2030; y++) {
    for (const [id, [m, d]] of Object.entries(DATES)) {
      const n = dayNumber(new Date(y, m - 1, d, 9));
      if (n < CURATED_FROM) { assert.equal(stoneIdOf(n), null, `${y}-${m}-${d}: before the cutover`); continue; }
      if (n in PLAYED) { assert.equal(stoneIdOf(n), PLAYED[n], `${y}-${m}-${d}: already played`); continue; }
      assert.equal(stoneIdOf(n), id, `${y}-${m}-${d}`);
    }
  }
  for (let n = CURATED_FROM; n <= LAST_2030; n++) {
    const id = stoneIdOf(n);
    if (!DATED_IDS.has(id)) continue;
    const [m, d] = DATES[id];
    assert.equal(dateOf(n).slice(5), `${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`, `day ${n}: ${id}`);
  }
  // none before its date this year: Halloween 2026 was Daily #1, so the Black Cat waits for 2027
  assert.equal(dayNumber(new Date(2026, 9, 31, 12)), 1);
  assert.equal(stoneIdOf(366), 'daily-black-cat');
  assert.equal(dateOf(366), '2027-10-31');
  const first = (id) => { for (let n = CURATED_FROM; ; n++) if (stoneIdOf(n) === id) return dateOf(n); };
  assert.equal(first('daily-black-cat'), '2027-10-31');
  assert.equal(first('daily-nutcracker'), '2026-12-06');
  assert.equal(first('daily-melted-snowman'), '2027-03-20');
  // page 19's: the Sugar Skull tomorrow, 2 Nov 2026 (Daily #3), the first day not yet played
  assert.equal(dayNumber(new Date(2026, 10, 2, 9)), 3);
  assert.equal(stoneIdOf(3), 'daily-sugar-skull');
  assert.equal(first('daily-sugar-skull'), '2026-11-02');
  assert.equal(first('daily-cupid'), '2027-02-14');
  assert.equal(first('daily-toadstool-frog'), '2027-09-22');
  // 1 Nov 2026 was Daily #2, the Piggy Bank's, already played: the Squirrel waits for 1 Nov 2027,
  // the morning after the Black Cat
  assert.equal(stoneIdOf(2), 'daily-piggy-bank');
  assert.equal(first('daily-squirrel-pumpkin'), '2027-11-01');
  assert.equal(stoneIdOf(367), 'daily-squirrel-pumpkin');
  assert.equal(stoneIdOf(368), 'daily-sugar-skull');
});

test('daily: the undated days cycle through the rotation, and no section comes twice in a row', () => {
  const undated = [];
  for (let n = CURATED_FROM; n <= LAST_2030; n++) if (!DATED_IDS.has(stoneIdOf(n))) undated.push([n, stoneIdOf(n)]);
  // page 18's 11 in order (Daily #2, then #4 on: the Sugar Skull took #3); then, from the turn of
  // that cycle (Daily #14, 13 Nov 2026), the second era: page 18's 11 and page 19's 13, cycling
  const [first, second] = ROTATION.map((e) => e.order);
  assert.equal(ROTATION.length, 2);
  assert.deepEqual(second.slice(0, first.length), first, 'the second era keeps the first one\'s order, the new stones after');
  assert.deepEqual(undated.slice(0, first.length).map(([, id]) => id), first);
  assert.equal(undated[first.length][0], 14);
  assert.equal(dateOf(14), '2026-11-13');
  undated.slice(first.length).forEach(([n, id], k) => assert.equal(id, second[k % second.length], `Daily #${n}`));
  // page 19's undated stones first come on #25-#38, 24 Nov-7 Dec 2026 (the Nutcracker has #37)
  const firstDay = (id) => undated.find(([, x]) => x === id)[0];
  assert.deepEqual(second.slice(first.length).map(firstDay), [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 38]);
  // neither order puts one section next to itself, the end and the start included (Toy Box,
  // Again counted as Toy Box)
  for (const order of [first, second]) {
    order.forEach((id, k) => assert.notEqual(familyOf(id), familyOf(order[(k + 1) % order.length]), `${id}, ${order[(k + 1) % order.length]}`));
  }
  for (let k = 1; k < undated.length; k++) {
    assert.notEqual(familyOf(undated[k][1]), familyOf(undated[k - 1][1]), `undated days ${undated[k - 1]}, ${undated[k]}`);
  }
  // and on the calendar too, dated days included (Cupid's Feb 14 never next to the Sleepy Cyclops
  // to 2030; the Squirrel's Nov 1 is always between two dated days)
  for (let n = CURATED_FROM + 1; n <= LAST_2030; n++) assert.notEqual(familyOf(stoneIdOf(n)), familyOf(stoneIdOf(n - 1)), `days ${n - 1}, ${n}`);
  // the Days of the Year, Holidays of the World and Weather and Seasons are all dated: none in the rotation
  for (const id of second) assert.ok(!['seasons', 'holidays', 'weather'].includes(sectionOf(id)), id);
});

test('daily: the calendar is deterministic', () => {
  const a = calendar(LAST_2030), b = calendar(LAST_2030);
  assert.deepEqual(a, b);
  for (let n = 1; n <= LAST_2030; n++) assert.equal(stoneIdOf(n), a[n]);
  // a short walk agrees with a long one
  assert.deepEqual(calendar(500), a.slice(0, 501));
});

test('daily: appending a stone changes no day before its era starts', () => {
  const before = calendar(LAST_2030);
  const SINCE = 200;   // (a day already past would be wrong in dailies.js; here it shows the rule)
  const rotation = [...ROTATION, { since: SINCE, order: [...ROTATION.at(-1).order, 'daily-new-undated'] }];
  const dated = [...DATED, { id: 'daily-new-dated', date: '07-04', since: 300 }];
  const after = calendar(LAST_2030, { rotation, dated });
  // nothing changes until the new stone's first day, which comes after its era's day
  const first = after.indexOf('daily-new-undated');
  assert.ok(first > SINCE, `the new stone's first day: ${first}`);
  for (let n = 1; n < first; n++) assert.equal(after[n], before[n], `day ${n} changed`);
  // it joined at the end of the cycle: the undated days just before it are one whole cycle
  const order = ROTATION.at(-1).order;
  const lead = after.slice(CURATED_FROM, first).filter((id) => !DATED_IDS.has(id)).slice(-order.length);
  assert.deepEqual(lead, order);
  // the new dated stone is on its date from its day on, and never before
  assert.ok(after.includes('daily-new-dated'));
  for (let n = 1; n <= LAST_2030; n++) {
    if (after[n] === 'daily-new-dated') assert.ok(n >= 300 && dateOf(n).endsWith('-07-04'), `day ${n}`);
  }
});

test('daily: every curated stone is trimmed, lit, written out and fair', () => {
  const levelIds = new Set([...SHAPES, ...BONUS].map((s) => s.id));
  for (const s of DAILIES) {
    assert.ok(s.id.startsWith('daily-') && !levelIds.has(s.id), `${s.id}: its own id`);
    assert.ok(s.name && s.story && s.story.split(/\s+/).length <= 14, `${s.id}: a name and a story`);
    assert.ok(SECTIONS[s.section], `${s.id}: section ${s.section}`);
    // the clue settings written out, so the clues never move under a stone already played
    assert.ok(typeof s.fraction === 'number' && Number.isInteger(s.seed), `${s.id}: fraction and seed`);
    // judge(): line logic settles every cell with the clues the game shows, no empty edge (the
    // block is trimmed to the object), in the daily band
    const j = judge(s);
    assert.ok(j.ok, `${s.id}: ${j.why}`);
    // and the independent check the levels get (uniqueness.test.js)
    const q = prepare(s);
    assert.ok(cluesConsistent(q), `${s.id}: a clue disagrees with the stone`);
    const r = countSolutions(q, 2);
    assert.ok(r.exhausted && r.solutions === 1 && !r.differsFromShape, `${s.id}: ${r.solutions} solutions`);
    // lit as the levels are: more tones than the flat candidate had colours
    assert.ok(new Set(buildCells(s).colors).size > 4, `${s.id}: lit`);
  }
  // the sky of a curated day is its section's, the one it was drawn against in the gallery
  for (const s of DAILIES) assert.ok(PALETTES.some((p) => p.name === SECTIONS[s.section].palette), `${s.id}: sky ${SECTIONS[s.section].palette}`);
  assert.equal(dailyPalette(2).base, 'Dawn');
  assert.equal(dailyPalette(3).base, SECTIONS[sectionOf(stoneIdOf(3))].palette);
  assert.equal(dailyPalette(3).base, 'Beacon');   // the Sugar Skull, Holidays of the World
});

test('daily: each stone keeps its candidate\'s light, and page 19\'s its clue settings and story', async () => {
  const pool = new Map();
  for (const page of ['page18', 'page19']) {
    const dir = new URL(`../public/gallery/${page}/`, import.meta.url);
    for (const f of readdirSync(dir).filter((x) => x.endsWith('.js'))) {
      const mod = await import(new URL(f, dir));
      if (Array.isArray(mod.default)) for (const e of mod.default) pool.set(e.id, e);
    }
  }
  for (const s of DAILIES) {
    const e = pool.get(s.from);
    assert.ok(e, `${s.id}: its candidate ${s.from}`);
    assert.deepEqual(s.lit ?? null, e.lit ?? null, `${s.id}: lit options`);
    if (!s.from.startsWith('cand-p19-')) continue;
    // (page 18's four that took easier clues say so on their line; page 19's needed none)
    assert.deepEqual([s.fraction, s.seed], [e.fraction, e.seed], `${s.id}: clue settings`);
    assert.equal(s.story, e.story, `${s.id}: story`);
    assert.equal(SECTIONS[s.section].palette, JSON.parse(readFileSync(new URL('../public/gallery/page19/sections.json', import.meta.url), 'utf8'))
      .find((x) => x.key === s.section).palette, `${s.id}: its section's sky`);
  }
});

test(`daily: the generator's stones, ${DAYS} days of them, are each uniquely solvable by line logic, mid-difficulty`, () => {
  const t0 = performance.now();
  const levelIds = new Set([...SHAPES, ...BONUS].map((s) => s.id));
  for (let n = 1; n <= DAYS; n++) {
    const { shape, d, chisel, waves } = generatedStone(n);
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
  // the days walked include every curated stone's, so each one's share is checked
  const walked = new Set(calendar(DAYS));
  for (const s of DAILIES) assert.ok(walked.has(s.id), `${s.id}: no day in the first ${DAYS}`);
  assert.equal(NAMES.length, LANGS.length * DAILIES.length);
  assert.ok(NAMES.every(Boolean), 'every stone has a name in every language');
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
    // nothing of the stone: not its name (in any language, nor any curated stone's, nor its id),
    // colours, size or its solid cells as bits
    for (const name of NAMES) assert.ok(!t.toLowerCase().includes(name.toLowerCase()), `day ${n}: a name, ${name}`);
    assert.ok(!t.includes(shape.id) && !(shape.from && t.includes(shape.from)), `day ${n}: the stone's id`);
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
