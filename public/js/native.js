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
// - Version 1 ships with no ads and no purchases (ads.js reads noAdsBuild).

const cap = globalThis.Capacitor;
export const nativeApp = !!cap?.isNativePlatform?.();
export const noAdsBuild = nativeApp;
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

// true if the app's haptics took it (main.js buzz falls back to the web's)
export function haptic(pattern) {
  if (!Haptics) return false;
  try {
    if (Array.isArray(pattern)) Haptics.notification({ type: 'ERROR' });           // a slip
    else Haptics.impact({ style: pattern >= 14 ? 'MEDIUM' : 'LIGHT' });
  } catch { /* */ }
  return true;
}

if (nativeApp) document.documentElement.classList.add('native-app');
