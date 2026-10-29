// The game's entry: in the store app, saves are restored from the app's own
// storage first (js/native.js), so the game never reads an empty localStorage;
// on the web this is immediate.
import { restoreSaves } from './native.js';

await restoreSaves();
// let the studio's card paint and its chalk start first: once started, its animation is the
// compositor's and keeps going while the game's code loads and runs (a hidden tab gets no frames)
await Promise.race([new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))), new Promise((r) => setTimeout(r, 100))]);
await import('./main.js');
