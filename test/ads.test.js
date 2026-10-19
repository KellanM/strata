// The ads caps, the lantern's flame economy and shrine-by-ad eligibility
// (public/js/ads.js): pure functions of a plain state object and a clock.
import { test } from 'node:test';
import assert from 'node:assert/strict';

class Store {
  constructor() { this.m = new Map(); }
  getItem(k) { return this.m.has(k) ? this.m.get(k) : null; }
  setItem(k, v) { this.m.set(k, String(v)); }
  removeItem(k) { this.m.delete(k); }
}
globalThis.localStorage = new Store();

const {
  CONFIG, dayOf, freshState, rollDay, interstitialAllowed, recordInterstitial, recordSolve,
  lanternAdAllowed, recordLanternAd, shrineAdEligible,
} = await import('../public/js/ads.js');

const MIN = 60 * 1000, HOUR = 60 * MIN;
const T0 = new Date(2026, 9, 19, 9, 0, 0).getTime();   // a local morning
const ctx = (nowMs, over = {}) => ({ nowMs, firstSession: false, lesson: false, chapterIndex: 1, removed: false, enabled: true, ...over });
const solves = (st, n) => { for (let k = 0; k < n; k++) recordSolve(st, { id: `s${k}`, flawless: false }); };

test('the tuning numbers are the agreed ones', () => {
  assert.equal(CONFIG.interstitial.minSolvesBetween, 3);
  assert.equal(CONFIG.interstitial.minGapSec, 240);
  assert.equal(CONFIG.interstitial.maxPerDay, 6);
  assert.equal(CONFIG.lantern.startFlames, 3);
  assert.equal(CONFIG.lantern.maxFlames, 5);
  assert.equal(CONFIG.lantern.adsPerDay, 3);
  assert.equal(CONFIG.lantern.adsPerStone, 1);
});

test('interstitial: one per 3 solves', () => {
  const st = freshState(T0, { returning: true });
  solves(st, 2);
  assert.equal(interstitialAllowed(st, ctx(T0 + HOUR)), false);
  solves(st, 1);
  assert.equal(interstitialAllowed(st, ctx(T0 + HOUR)), true);
  recordInterstitial(st, T0 + HOUR);
  assert.equal(st.solvesSince, 0);
  solves(st, 2);
  assert.equal(interstitialAllowed(st, ctx(T0 + 2 * HOUR)), false, 'the count starts over after an ad');
});

test('interstitial: at least 4 minutes apart', () => {
  const st = freshState(T0, { returning: true });
  solves(st, 3);
  recordInterstitial(st, T0);
  solves(st, 3);
  assert.equal(interstitialAllowed(st, ctx(T0 + 3 * MIN)), false);
  assert.equal(interstitialAllowed(st, ctx(T0 + 4 * MIN - 1)), false);
  assert.equal(interstitialAllowed(st, ctx(T0 + 4 * MIN)), true);
});

test('interstitial: about 6 a day, and the next day starts over (flat, never ramped)', () => {
  const st = freshState(T0, { returning: true });
  let t = T0;
  for (let k = 0; k < 6; k++) {
    solves(st, 3); t += 5 * MIN;
    assert.equal(interstitialAllowed(st, ctx(t)), true, `ad ${k + 1}`);
    recordInterstitial(st, t);
  }
  solves(st, 3); t += 5 * MIN;
  assert.equal(interstitialAllowed(st, ctx(t)), false, 'the 7th today');
  const tomorrow = T0 + 24 * HOUR;
  assert.equal(interstitialAllowed(st, ctx(tomorrow)), true, 'a new day');
  // the caps never tighten with progress: the same at chapter 12 as at chapter 2
  assert.equal(interstitialAllowed(st, ctx(tomorrow, { chapterIndex: 11 })), true);
});

test('interstitial: never in the first session, the lessons or First Light; never with Remove Ads or ads off', () => {
  const st = freshState(T0, { returning: true });
  solves(st, 5);
  const t = T0 + HOUR;
  assert.equal(interstitialAllowed(st, ctx(t, { firstSession: true })), false);
  assert.equal(interstitialAllowed(st, ctx(t, { lesson: true })), false);
  assert.equal(interstitialAllowed(st, ctx(t, { chapterIndex: 0 })), false, 'First Light (and its shrine)');
  assert.equal(interstitialAllowed(st, ctx(t, { removed: true })), false);
  assert.equal(interstitialAllowed(st, ctx(t, { enabled: false })), false);
  assert.equal(interstitialAllowed(st, ctx(t, { chapterIndex: null })), true, 'a drift');
});

test('a fresh save is a first session; a save from before ads is not', () => {
  assert.equal(freshState(T0).firstOpen, T0);
  assert.equal(freshState(T0, { returning: true }).firstOpen, 0);
});

test('flames: start with 3, +1 each morning (local date), capped at 5', () => {
  const st = freshState(T0);
  assert.equal(st.flames, 3);
  rollDay(st, T0 + 3 * HOUR);
  assert.equal(st.flames, 3, 'same day: nothing');
  const morning = new Date(2026, 9, 20, 7, 0, 0).getTime();
  rollDay(st, morning);
  assert.equal(st.flames, 4);
  rollDay(st, morning + HOUR);
  assert.equal(st.flames, 4, 'once a morning');
  const later = new Date(2026, 9, 25, 7, 0, 0).getTime();
  rollDay(st, later);
  assert.equal(st.flames, 5, 'days away still give one morning flame');
  rollDay(st, new Date(2026, 9, 26, 7, 0, 0).getTime());
  assert.equal(st.flames, 5, 'cap 5');
  assert.equal(dayOf(new Date(2026, 9, 20, 23, 59).getTime()), '2026-10-20');
});

test('flames: +1 for the first flawless solve of a level, never farmed', () => {
  const st = freshState(T0);
  st.flames = 1;
  assert.equal(recordSolve(st, { id: 'snail', flawless: true }), 1);
  assert.equal(recordSolve(st, { id: 'snail', flawless: true }), 0, 'a flawless re-solve');
  assert.equal(recordSolve(st, { id: 'owl', flawless: false }), 0, 'with slips');
  assert.equal(recordSolve(st, { id: 'owl', flawless: true }), 1, 'flawless the second time: its first flawless');
  assert.equal(recordSolve(st, { id: 'crab', flawless: true, wasFlawless: true }), 0, 'already flawless before flames existed');
  assert.equal(recordSolve(st, { id: 'random-4', flawless: true, drift: true }), 0, 'drifts are endless: no flames');
  assert.equal(st.flames, 3);
});

test('flames: +1 the first time a chapter is completed; capped at 5', () => {
  const st = freshState(T0);
  assert.equal(recordSolve(st, { id: 'a', flawless: false, completedChapter: 'Beacon Hills' }), 1);
  assert.equal(recordSolve(st, { id: 'b', flawless: false, completedChapter: 'Beacon Hills' }), 0, 'once per chapter');
  assert.equal(recordSolve(st, { id: 'c', flawless: true, completedChapter: 'Moss Garden' }), 1, 'both gains, capped at 5');
  assert.equal(st.flames, 5);
  assert.ok(st.flawless.includes('c') && st.chapters.includes('Moss Garden'), 'a gain lost to the cap is still spent');
  st.flames = 2;
  assert.equal(recordSolve(st, { id: 'c', flawless: true, completedChapter: 'Moss Garden' }), 0);
});

test('lantern by ad: once per stone, 3 a day, a new day starts over', () => {
  const st = freshState(T0);
  assert.equal(lanternAdAllowed(st, 'snail', T0), true);
  recordLanternAd(st, 'snail', T0);
  assert.equal(lanternAdAllowed(st, 'snail', T0 + MIN), false, 'once per stone');
  recordLanternAd(st, 'owl', T0 + MIN);
  recordLanternAd(st, 'crab', T0 + 2 * MIN);
  assert.equal(lanternAdAllowed(st, 'heron', T0 + 3 * MIN), false, '3 a day');
  const tomorrow = T0 + 24 * HOUR;
  assert.equal(lanternAdAllowed(st, 'snail', tomorrow), true);
});

test('shrine by ad: only when stars are the one thing missing, on a reached chapter', () => {
  assert.equal(shrineAdEligible({ reached: true, stars: 9, need: 12, solved: false, opened: false }), true);
  assert.equal(shrineAdEligible({ reached: false, stars: 9, need: 12, solved: false, opened: false }), false, 'the trail has not reached it');
  assert.equal(shrineAdEligible({ reached: true, stars: 12, need: 12, solved: false, opened: false }), false, 'already open by stars');
  assert.equal(shrineAdEligible({ reached: true, stars: 3, need: 12, solved: true, opened: false }), false, 'solved');
  assert.equal(shrineAdEligible({ reached: true, stars: 3, need: 12, solved: false, opened: true }), false, 'opened by an ad before');
});
