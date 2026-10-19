// Page 9 · ✦IX Ember Steps: a landmark alternative to the Paper Lantern.
// The chapter is all climbing, so its shrine is the top of the climb: a
// stepped hill, a long stair up its face between lanterns, a torii at the
// foot, and a little hall at the summit with an ember burning before it.
// Dusk sky (plum to peach): pale steps, vermilion hall, glowing lights.
import { grid } from '../voxel.js';
import { INK, quad } from './kit.js';

const hill = 0xa88a7a, hillDk = 0x8a6e64, moss = 0x7a9a5a, stair = 0xeadcc4, verm = 0xe0483a, roof = 0x4a3a5a,
  gold = 0xf2b23a, light = 0xffd58a, ember = 0xf2803d;

export default [
  // the summit shrine: terraced slopes either side of a straight stair,
  // stone lanterns lit on the landings, a torii where the climb begins, a
  // vermilion hall with a dark roof at the top and an ember in its brazier
  (() => {
    const g = grid(7, 10, 9);
    const Hz = [7, 7, 7, 6, 6, 4, 4, 2, 2], Hx = [5, 7, 7, 7, 7, 7, 5];
    for (let z = 0; z < 9; z++) for (let x = 0; x < 7; x++) {
      const h = x === 3 ? Math.min(Hz[z], 9 - z) : Math.min(Hz[z], Hx[x]);
      for (let y = 0; y < h; y++) g.set(x, y, z, x === 3 ? (y === h - 1 ? stair : hillDk) : y === h - 1 ? moss : (y + z) % 3 ? hill : hillDk);
    }
    for (const [x, z] of [[2, 4], [4, 4], [2, 6], [4, 6]]) { let h = 0; while (g.get(x, h, z)) h++; g.set(x, h, z, light); }
    for (const x of [1, 5]) g.box([x, x], [2, 3], [8, 8], verm);                   // the torii at the foot
    g.box([0, 6], [4, 4], [8, 8], INK).box([1, 5], [3, 3], [8, 8], verm);
    g.box([2, 4], [7, 7], [0, 1], verm).box([3, 3], [7, 7], [1, 1], gold);        // the hall at the top
    g.box([1, 5], [8, 8], [0, 2], roof).box([2, 4], [9, 9], [1, 1], roof);
    g.set(1, 8, 0, gold).set(5, 8, 0, gold);                                      // upturned roof corners
    g.set(3, 6, 3, ember);                                                        // the ember on the top landing
    return { ...g.entry({ id: 'cand-p9-summit-shrine', name: 'Summit Shrine' }), fraction: 0.85, seed: 2, story: 'Every step is worn smooth. Nobody remembers who climbed first.' };
  })(),
];
