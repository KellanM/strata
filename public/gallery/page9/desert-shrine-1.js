// Page 9 · ✦VIII Desert Oasis: a landmark alternative to the Keyhole Arch.
// The chapter's line is "Somewhere under the sand, a well is waiting": this
// is that well, under a tiled dome on four piers, open on every side, with
// water far down inside and a bucket on its rope. Desert sky, so terracotta
// piers and a blue dome rather than white plaster.
import { grid } from '../voxel.js';
import { tint } from './kit.js';

const terra = 0xc8704b, terraDk = 0x9c4f33, teal = 0x2f9a8f, blue = 0x3f6fb5, blueDk = 0x2f4f8a, gold = 0xe9b949,
  water = 0x5bb8d6, stone = 0x9a8a7e, wood = 0x8a5a3c, rope = 0xe0b45a;

export default [
  // the waiting well: a stone well head in a domed pavilion, pointed arches
  // on all four sides, a teal tile band, a blue dome with a gold finial, a
  // bucket hanging on its rope over dark water
  (() => {
    const g = grid(7, 9, 7);
    g.box([0, 6], [0, 0], [0, 6], terraDk);
    for (const x0 of [0, 6]) for (const z0 of [0, 6]) g.box([x0, x0], [1, 3], [z0, z0], terra);   // slim corner piers
    for (const k of [1, 2, 4, 5]) for (const [x, z] of [[k, 0], [k, 6], [0, k], [6, k]]) g.set(x, 3, z, k === 1 || k === 5 ? terra : terraDk);   // pointed arches
    g.box([0, 6], [4, 4], [0, 6], teal).box([1, 5], [4, 4], [1, 5], 0);
    tint(g, (x, y, z) => y === 4 && (x + z) % 2 === 0, gold);
    for (let y = 5; y <= 8; y++) for (let z = 0; z < 7; z++) for (let x = 0; x < 7; x++)
      if (((x - 3) / 3.1) ** 2 + ((y - 4.6) / 3.6) ** 2 + ((z - 3) / 3.1) ** 2 <= 1) g.set(x, y, z, (x + y + z) % 3 === 0 ? blueDk : blue);
    g.set(3, 8, 3, gold);
    g.box([2, 4], [1, 2], [2, 4], stone).box([3, 3], [2, 2], [3, 3], 0).set(3, 1, 3, water);   // the well head
    g.set(3, 4, 3, rope).set(3, 3, 3, wood);
    return { ...g.entry({ id: 'cand-p9-waiting-well', name: 'Waiting Well' }), fraction: 0.65, seed: 15, story: 'Under the sand, under the dome, the water has been waiting.' };
  })(),
];
