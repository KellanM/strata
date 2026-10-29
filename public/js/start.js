// The game's entry: in the store app, saves are restored from the app's own
// storage first (js/native.js), so the game never reads an empty localStorage;
// on the web this is immediate.
import { restoreSaves } from './native.js';

await restoreSaves();
// let the studio's card be drawn on in chalk first, with nothing else asked of the page: the
// game's code, loading and running, held the page for most of a second, and the drawing (in
// WebKit at least) stood still through it and then jumped to done (Kellan, 2026-10-29: "only
// shows like 2 frames"). The card holds until the game is ready anyway; this costs about 0.6 s.
// (Not at all on a quick relaunch, whose card is plain black; and a hidden tab gets no frames.)
const splash = document.getElementById('splash');
if (splash && !splash.classList.contains('quick') && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const draw = splash.querySelector('.chalk .draw');
  await Promise.race([new Promise((r) => draw?.addEventListener('animationend', r, { once: true })), new Promise((r) => setTimeout(r, 900))]);
}
await Promise.race([new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))), new Promise((r) => setTimeout(r, 100))]);
await import('./main.js');
