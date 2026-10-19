// Page 9 · ✦VI The Lagoon: a landmark alternative to the Whale shrine.
// A great vermilion gate standing in the shallows, braced on four legs, the
// tide around its feet: the sea's own doorway. Lagoon sky (mint to blue), so
// the water is a deep teal with white foam and the gate does the talking.
import { grid } from '../voxel.js';
import { INK, pair, tint } from './kit.js';

const sea = 0x2a6f8a, seaLt = 0x3f8fb0, foam = 0xf4fbff, verm = 0xe0483a, vermDk = 0xb8323a, gold = 0xf2b23a;

export default [
  // the sea gate: two pillars and their bracing legs rising from the water,
  // a tie beam, a black-capped top beam with upswept ends, foam at its feet
  (() => {
    const g = grid(10, 9, 5);
    g.box([0, 9], [0, 0], [0, 4], sea).box([0, 9], [1, 1], [0, 4], (x, y, z) => ((x + z * 2) % 4 === 0 ? seaLt : sea));
    for (const x of [2, 7]) {
      g.box([x - 1, x + 1], [1, 1], [1, 3], foam);
      g.box([x, x], [2, 6], [2, 2], verm);
      g.box([x, x], [2, 3], [0, 0], vermDk).box([x, x], [2, 3], [4, 4], vermDk).box([x, x], [3, 3], [0, 4], vermDk);
    }
    g.box([1, 8], [5, 5], [2, 2], verm).box([1, 8], [6, 6], [1, 3], verm);
    g.box([0, 9], [7, 7], [1, 3], INK);
    pair(g, 0, 8, 2, INK);
    g.box([4, 5], [5, 5], [2, 2], gold);
    tint(g, (x, y, z) => y === 6 && (z === 1 || z === 3) && (x === 0 || x === 9), INK);
    return { ...g.entry({ id: 'cand-p9-sea-gate', name: 'Sea Gate' }), fraction: 0.9, seed: 11, story: 'At high tide you can only reach it by boat.' };
  })(),
];
