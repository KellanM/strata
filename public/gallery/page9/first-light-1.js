// Page 9 · ✦I First Light: a landmark alternative to the Cottage shrine.
// Home and morning, made sacred: the village bell tower that rings the day
// in, a sun window over its door, the bell hanging in an open belfry.
// Dawn sky (peach to lilac), so rose stone and a slate roof, not white.
import { grid } from '../voxel.js';
import { INK, pairFront, front, quad, tint } from './kit.js';

const rose = 0xc8806a, roseDk = 0xa86452, slate = 0x5b6f9a, slateDk = 0x45577e, gold = 0xf2b23a, bell = 0xe0a83a,
  wood = 0x8a5a3c, step = 0xd9b8a0;

export default [
  // the morning bell tower: a rose-stone tower on a stepped plinth, a sun
  // window over a cedar door, an open belfry with a golden bell, a slate roof
  (() => {
    const g = grid(7, 10, 7);
    g.box([0, 6], [0, 0], [0, 6], roseDk).box([2, 4], [0, 0], [6, 6], step);
    g.box([1, 5], [1, 4], [1, 5], (x, y, z) => ((x === 1 || x === 5) && (z === 1 || z === 5) && y % 2 ? roseDk : rose));
    g.box([3, 3], [1, 2], [5, 5], wood).set(3, 3, 5, roseDk);
    front(g, 3, 4, gold); pairFront(g, 2, 4, bell);                            // the sun window and its rays
    for (let y = 5; y <= 6; y++) quad(g, 1, y, 1, roseDk);
    g.box([2, 4], [5, 5], [3, 3], bell).box([3, 3], [5, 5], [2, 4], bell).set(3, 6, 3, gold);   // the bell
    g.box([0, 6], [7, 7], [0, 6], slateDk).box([1, 5], [8, 8], [1, 5], slate);
    g.box([2, 4], [9, 9], [3, 3], slate).box([3, 3], [9, 9], [2, 4], slate).set(3, 9, 3, gold);
    tint(g, (x, y, z) => y === 8 && (x === 1 || x === 5) && (z === 1 || z === 5), slateDk);
    return { ...g.entry({ id: 'cand-p9-morning-bell', name: 'Morning Bell Tower' }), fraction: 0.7, seed: 12, story: 'Its bell has rung in every morning the village remembers.' };
  })(),
];
