// Ads, a slip taken back by an ad, shrines opened by an ad, and Remove Ads
// (docs/ads-study.md). The game talks only to this module; the module talks to
// one provider, which actually shows an ad or makes a purchase.
//
// THE NATIVE SWAP. A provider is a plain object:
//   {
//     name: 'web' | 'max' | 'none',
//     ready(kind)            -> boolean    // 'interstitial' | 'rewarded': is one loaded? (never wait on an ad)
//     interstitial(placement) -> Promise<void>     // resolves when it has closed
//     rewarded(placement)     -> Promise<boolean>  // true only if the reward was earned
//     purchase(sku, price)    -> Promise<boolean>  // the Remove Ads IAP
//     restore()               -> Promise<boolean>  // true if Remove Ads is owned
//   }
// ads-web.js is the web prototype's (a labelled placeholder and a simulated
// purchase). A Capacitor build registers its own with setProvider(): AppLovin
// MAX for the two ad units (placements as named below) and StoreKit / Play
// Billing (RevenueCat or cordova-plugin-purchase) for SKU. Every cap, the
// first-session rule, the breath before an interstitial, the taken-back slip
// and the shrines stay here and in main.js, unchanged.
//
// Everything that decides is a pure function of a plain state object, so
// test/ads.test.js runs it in node without a DOM.

import { webProvider } from './ads-web.js';
import { noAdsBuild } from './native.js';   // version 1 in the stores: no ads, no purchases; every gift is free

// All the tuning numbers, in one place. Every one is a guess to be set from
// the store build's own data (docs/ads-study.md, the hit list).
export const CONFIG = {
  interstitial: {
    placements: ['result_to_map', 'shrine_to_map'],
    minSolvesBetween: 3,      // at most one per 3 solves
    minGapSec: 240,           // and at least 4 minutes apart
    maxPerDay: 6,             // and about 6 a day; flat, never ramped with progress
    freeChapters: 1,          // none in the first chapter (First Light), nor the lessons
    freeFirstSession: true,   // none in the first session
    breathSec: 1.2,           // the quiet "a short ad, then the map" screen before it
  },
  // A slip taken back by an ad (Kellan, 2026-10-24: in place of the hint
  // lantern): each ad takes back the latest slip, so a stone can still be
  // finished clean, for all three stars.
  rewind: {
    adsPerDay: 5,             // a day's cap (AppLovin warns of saturation above "one or two" an hour)
  },
  web: { adSec: 5 },          // the placeholder's countdown
  removeAds: { sku: 'strata.remove_ads', price: '$1.99' },
};

webProvider.adSec = CONFIG.web.adSec;

const KEY = 'strata.ads';                 // the state below
const KEY_REMOVED = 'strata.ads.removed'; // Remove Ads owned ('1')
const KEY_OFF = 'strata.ads.off';         // developer: no ads at all ('1')
const KEY_SHRINES = 'strata.ads.shrines'; // shrine ids opened by an ad
const store = () => globalThis.localStorage;

// ---------------------------------------------------------------- pure rules

// the local calendar date: daily caps start over each morning
export function dayOf(ms) {
  const d = new Date(ms);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function freshState(nowMs, { returning = false } = {}) {
  return {
    firstOpen: returning ? 0 : nowMs,   // a save from before ads were built is not a first session
    solvesSince: 0,                     // solves since the last interstitial
    lastAd: 0,                          // when the last interstitial showed (ms)
    day: dayOf(nowMs), dayAds: 0, dayRewinds: 0,
  };
}

// a new day: the daily counts start over
export function rollDay(st, nowMs) {
  const today = dayOf(nowMs);
  if (st.day !== today) { st.day = today; st.dayAds = 0; st.dayRewinds = 0; }
  return st;
}

// ctx: { nowMs, firstSession, lesson, chapterIndex (0 = First Light; null for a drift), removed, enabled }
export function interstitialAllowed(st, ctx) {
  const c = CONFIG.interstitial;
  if (!ctx.enabled || ctx.removed || ctx.lesson) return false;
  if (c.freeFirstSession && ctx.firstSession) return false;
  if (ctx.chapterIndex != null && ctx.chapterIndex < c.freeChapters) return false;
  if (st.solvesSince < c.minSolvesBetween) return false;
  if (ctx.nowMs - st.lastAd < c.minGapSec * 1000) return false;
  const today = dayOf(ctx.nowMs);
  if (st.day === today && st.dayAds >= c.maxPerDay) return false;
  return true;
}

export function recordInterstitial(st, nowMs) {
  rollDay(st, nowMs);
  st.lastAd = nowMs;
  st.solvesSince = 0;
  st.dayAds++;
  return st;
}

// A solve (levels, shrines and drifts; never a lesson): counts toward the interstitial.
export function recordSolve(st) {
  st.solvesSince++;
  return st;
}

// a slip taken back by an ad (or, with Remove Ads, without one): a day's cap
export function rewindAllowed(st, nowMs) {
  const count = st.day === dayOf(nowMs) ? st.dayRewinds : 0;
  return count < CONFIG.rewind.adsPerDay;
}

export function recordRewind(st, nowMs) {
  rollDay(st, nowMs);
  st.dayRewinds++;
  return st;
}

// A shrine may be opened by an ad only when its stars are the one thing
// missing: the trail has reached its chapter, it isn't solved or open already.
//   s: { reached, stars, need, solved, opened (by an ad before) }
export function shrineAdEligible(s) {
  return !!s.reached && !s.solved && !s.opened && s.stars < s.need;
}

// ---------------------------------------------------------------- state

let state = null;
const firstSessionFlag = 'strata.ads.firstSession';   // sessionStorage: survives an update reload

function load() {
  if (state) return state;
  const now = Date.now();
  try { state = JSON.parse(store()?.getItem(KEY) ?? 'null'); } catch { state = null; }
  if (!state || typeof state !== 'object') {
    const returning = !!store()?.getItem('strata.tutorial');
    state = freshState(now, { returning });
    if (!returning) try { globalThis.sessionStorage?.setItem(firstSessionFlag, '1'); } catch { /* private mode */ }
  }
  state = { ...freshState(now), ...state };
  rollDay(state, now);
  save();
  return state;
}
function save() { try { store()?.setItem(KEY, JSON.stringify(state)); } catch { /* storage full */ } }

// at boot, before anything else reads the state: a fresh save marks this session its first
export function init() { load(); }

export function isFirstSession() {
  try { return globalThis.sessionStorage?.getItem(firstSessionFlag) === '1'; } catch { return false; }
}

// ---------------------------------------------------------------- provider

const noneProvider = {
  name: 'none',
  ready: () => true,
  interstitial: async () => {},
  rewarded: async () => true,      // ads off (developer): the gift comes without one
  purchase: async () => true,
  restore: async () => store()?.getItem(KEY_REMOVED) === '1',
};
let provider = webProvider;
export function setProvider(p) { provider = p; }

// The simulated provider (webProvider: a placeholder screen, a pretend purchase) is
// for the developer panel only. Players never see it - not even once MONETIZED is
// on - until a real network is set with setProvider (Kellan, 2026-10-28: we have
// real players).
const simulated = () => provider === webProvider;
export const enabled = () => !noAdsBuild && (simulated() ? store()?.getItem(KEY_OFF) === '0' : store()?.getItem(KEY_OFF) !== '1');
// Remove Ads can be bought: a store build with a real provider
export const purchasable = () => !noAdsBuild && !simulated();
export function setEnabled(on) { store()?.setItem(KEY_OFF, on ? '0' : '1'); }
const active = () => (enabled() ? provider : noneProvider);

let showing = false;
const listeners = new Set();
// fn(true) as an ad opens, fn(false) as it closes (main.js: sound and the level clock)
export function onAd(fn) { listeners.add(fn); }
export const adShowing = () => showing;
async function during(run) {
  showing = true;
  listeners.forEach((fn) => fn(true));
  try { return await run(); } finally { showing = false; listeners.forEach((fn) => fn(false)); }
}

// the analytics stub: wire to a backend before the caps can be tuned
export function log(event, placement, extra = {}) {
  if (globalThis.location?.search?.includes('adslog')) console.log('[ads]', event, placement, extra);
}

// ---------------------------------------------------------------- the game's API

export function adsRemoved() { return noAdsBuild || store()?.getItem(KEY_REMOVED) === '1'; }

// May this placement run now? Interstitials: every cap. Rewarded: a loaded ad
// (a taken-back slip's own cap is asked through rewindOffer()).
export function canShow(placement, ctx = {}) {
  if (CONFIG.interstitial.placements.includes(placement)) {
    if (!enabled()) return false;
    return interstitialAllowed(load(), {
      nowMs: Date.now(), firstSession: isFirstSession(), removed: adsRemoved(), enabled: true, ...ctx,
    }) && provider.ready('interstitial');
  }
  return active().ready('rewarded');
}

export async function showInterstitial(placement) {
  log('interstitial', placement);
  await during(() => active().interstitial(placement));
  recordInterstitial(load(), Date.now());
  save();
}

// true if the reward was earned. With Remove Ads, or ads off, it's a gift without an ad.
export async function showRewarded(placement) {
  if (adsRemoved()) { log('rewarded_free', placement); return true; }
  const p = active();
  if (p.name === 'none') return true;
  log('rewarded', placement);
  const ok = await during(() => p.rewarded(placement));
  log(ok ? 'rewarded_earned' : 'rewarded_closed', placement);
  return ok;
}

export async function buyRemoveAds() {
  if (!purchasable() && !enabled()) return false;
  const ok = await provider.purchase(CONFIG.removeAds.sku, CONFIG.removeAds.price);
  if (ok) store()?.setItem(KEY_REMOVED, '1');
  log(ok ? 'purchase' : 'purchase_cancelled', 'remove_ads');
  return ok;
}
export async function restorePurchases() {
  const owned = await provider.restore();
  if (owned) store()?.setItem(KEY_REMOVED, '1');
  return owned;
}

// ---- solves, and slips taken back

export function noteSolve() {
  const st = load();
  rollDay(st, Date.now());
  recordSolve(st);
  save();
}

export const rewindOffer = () => rewindAllowed(load(), Date.now());
export function noteRewind() { recordRewind(load(), Date.now()); save(); }

// ---- shrines opened by an ad

export function openedShrines() {
  try { return new Set(JSON.parse(store()?.getItem(KEY_SHRINES) || '[]')); } catch { return new Set(); }
}
export function openShrine(id) {
  const s = openedShrines();
  s.add(id);
  store()?.setItem(KEY_SHRINES, JSON.stringify([...s]));
}

// ---- developer panel

export function devReset() {
  for (const k of [KEY, KEY_REMOVED, KEY_SHRINES]) store()?.removeItem(k);
  try { globalThis.sessionStorage?.removeItem(firstSessionFlag); } catch { /* */ }
  state = null;
  // a reset starts as a returning player, not a first session: ads can be tested at once
  state = freshState(Date.now(), { returning: true });
  save();
}
