// The game's entry: in the store app, saves are restored from the app's own
// storage first (js/native.js), so the game never reads an empty localStorage;
// on the web this is immediate.
import { restoreSaves } from './native.js';

await restoreSaves();
// (the studio's card is black while the game loads; its chalk plays after: main.js)
await import('./main.js');
