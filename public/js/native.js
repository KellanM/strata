// The store app (Capacitor; docs/launch-checklist.md). On the web every export
// here is a quiet no-op.
//
// - Saves: the game keeps everything in localStorage, which iOS may clear from
//   a web view under storage pressure. In the app every strata.* key is also
//   copied into the app's own storage (Capacitor Preferences): whenever the app
//   goes to the background and every half minute, and once more at boot, if
//   localStorage comes up empty, it is filled back from there - before the
//   game reads a single key (js/start.js).
// - Haptics: the iPhone's own engine (Capacitor Haptics), not the web's.
// - Version 1 ships with no ads and no purchases, in the app and on the web
//   (Kellan, 2026-10-28: free until the ad network is integrated). ads.js reads
//   noAdsBuild: every gift is free, no ad shows, Remove Ads is hidden.

// the one switch for ads and purchases: false until they are integrated for real
export const MONETIZED = false;
const cap = globalThis.Capacitor;
export const nativeApp = !!cap?.isNativePlatform?.();
export const noAdsBuild = nativeApp || !MONETIZED;
const plugin = (name) => (nativeApp ? cap.registerPlugin?.(name) ?? cap.Plugins?.[name] : null);
const Prefs = plugin('Preferences');
const Haptics = plugin('Haptics');
const PREFIX = 'strata.';

const ours = () => Object.keys(localStorage).filter((k) => k.startsWith(PREFIX));

export async function restoreSaves() {
  if (!Prefs) return;
  try {
    if (ours().length) return;   // the web view kept them: nothing to do
    const { keys } = await Prefs.keys();
    for (const key of keys.filter((k) => k.startsWith(PREFIX))) {
      const { value } = await Prefs.get({ key });
      if (value != null) localStorage.setItem(key, value);
    }
  } catch { /* a missing plugin must never stop the game */ }
}

let mirroring = false;
async function mirror() {
  if (!Prefs || mirroring) return;
  mirroring = true;
  try {
    const now = new Set(ours());
    for (const key of now) await Prefs.set({ key, value: localStorage.getItem(key) });
    // a key the game removed (a reset) goes from the copy too
    const { keys } = await Prefs.keys();
    for (const key of keys) if (key.startsWith(PREFIX) && !now.has(key)) await Prefs.remove({ key });
  } catch { /* try again next time */ }
  mirroring = false;
}
if (Prefs) {
  document.addEventListener('visibilitychange', () => { if (document.hidden) mirror(); });
  setInterval(mirror, 30 * 1000);
  setTimeout(mirror, 5000);
}

// true if the app's haptics took it (main.js buzz falls back to the web's).
// kind 'tick': the selection tick, the lightest the iPhone has (a date-picker
// wheel's click), for a block breaking. 'slip': the error notification.
// 'win': the success notification (it used to be the error one, like a slip).
// Otherwise a light impact, or medium from 14 up.
let selecting = false;
export function haptic(pattern, kind) {
  if (!Haptics) return false;
  try {
    if (kind === 'tick') {
      if (!selecting) { selecting = true; Haptics.selectionStart(); }   // the generator lives on, ready
      Haptics.selectionChanged();
    } else if (kind === 'win') Haptics.notification({ type: 'SUCCESS' });
    else if (kind === 'slip' || Array.isArray(pattern)) Haptics.notification({ type: 'ERROR' });
    else Haptics.impact({ style: pattern >= 14 ? 'MEDIUM' : 'LIGHT' });
  } catch { /* */ }
  return true;
}

// ---------------------------------------------------------------- the Daily Stone

// Sharing the day's line (daily.js shareText). In the app: Capacitor's Share
// plugin if the build has it, else the web view's own share sheet. On the web:
// the share sheet on a phone, the clipboard on a computer (Wordle's way).
// Returns 'shared' | 'copied' | 'cancelled' | 'failed'.
const available = (name) => nativeApp && !!cap?.isPluginAvailable?.(name);
export async function shareOut(text) {
  const Share = available('Share') ? plugin('Share') : null;
  if (Share) {
    try { await Share.share({ text }); return 'shared'; } catch (e) { if (/cancel/i.test(e?.message ?? '')) return 'cancelled'; }
  }
  const touch = globalThis.matchMedia?.('(pointer: coarse)').matches;
  if (navigator.share && (touch || nativeApp)) {
    try { await navigator.share({ text }); return 'shared'; } catch (e) { if (e?.name === 'AbortError') return 'cancelled'; }
  }
  try { await navigator.clipboard.writeText(text); return 'copied'; } catch { /* no clipboard access: the old way */ }
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try { ok = document.execCommand('copy'); } catch { /* */ }
  ta.remove();
  return ok ? 'copied' : 'failed';
}

// Game Center (app only): the day's score to a daily leaderboard, and Apple's
// Challenges on it, so friends can be asked to beat it (docs/daily-stone.md,
// docs/game-center-handoff.md). A small local plugin, StrataGameCenter, in
// the iOS project; until the Mac build adds it, gameCenter is false and every
// call below is a quiet no-op, as on the web. The ids are App Store Connect's.
export const GAME_CENTER = {
  plugin: 'StrataGameCenter',
  leaderboard: 'strata.daily.score',       // recurring, daily, high to low
  challenge: 'strata.daily.challenge',     // a Challenge on that leaderboard, not repeatable
  activity: 'strata.daily.activity',       // the activity a Challenge deep-links into
};
const GC = available(GAME_CENTER.plugin) ? plugin(GAME_CENTER.plugin) : null;
export const gameCenter = !!GC;
let gcSignIn = null;
// once, after the lessons (it may show Game Center's own banner)
export function signInGameCenter() {
  if (!GC) return Promise.resolve(false);
  gcSignIn ??= GC.authenticate().then((r) => !!r?.authenticated).catch(() => false);
  return gcSignIn;
}
// the day's first solve, scored as the result screen shows it (no run bonus)
export async function submitDaily(score, day) {
  if (!GC) return false;
  try {
    if (!(await signInGameCenter())) return false;
    await GC.submitScore({ leaderboardID: GAME_CENTER.leaderboard, score: Math.max(0, Math.round(score)), context: day | 0 });
    return true;
  } catch { return false; }
}
// Apple's sheet to challenge friends on today's stone
export async function challengeFriends() {
  if (!GC) return false;
  try {
    if (!(await signInGameCenter())) return false;
    await GC.presentChallenge({ challengeID: GAME_CENTER.challenge });
    return true;
  } catch { return false; }
}
// a Challenge (or the Games app) asks for today's stone
export function onDailyActivity(fn) {
  if (!GC) return;
  try { GC.addListener('activity', (e) => { if (!e?.activityID || e.activityID === GAME_CENTER.activity) fn(e); }); } catch { /* */ }
}

if (nativeApp) document.documentElement.classList.add('native-app');
if (noAdsBuild) globalThis.document?.documentElement.classList.add('no-ads');
