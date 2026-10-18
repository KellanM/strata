// Sea & Shore (III · The Lagoon): candidate objects. Entry format and helpers: ../voxel.js.
import { C, disc, bitmap, plan, grid } from '../voxel.js';

// A crab: low red shell, raised pincers in front, two eyes on top, legs to the sides.
const crab = grid(9, 5, 6)
  .ellipsoid([4, 1.2, 2.5], [3, 1.3, 2], C.red)
  .box([3, 5], [0, 0], [1, 4], C.dred)
  .box([1, 2], [1, 1], [1, 1], C.dred).box([1, 1], [0, 0], [1, 1], C.dred)     // legs
  .box([1, 2], [1, 1], [3, 3], C.dred).box([1, 1], [0, 0], [3, 3], C.dred)
  .box([1, 2], [1, 1], [4, 4], C.red)                                          // arm
  .box([0, 1], [2, 3], [4, 5], C.red).clear(0, 3, 4)                           // pincer with a notch
  .mirror('x')
  .set(3, 3, 3, C.ink).set(5, 3, 3, C.ink);

const jelly = grid(5, 8, 5)
  .ellipsoid([2, 5.5, 2], [2.4, 2, 2.4], (x, y) => (y >= 5 ? C.pink : null))
  .box([0, 4], [5, 5], [0, 4], (x, y, z) => (disc(x - 2, z - 2, 2.4) ? C.rose : null))
  .box([2, 2], [6, 7], [2, 2], C.lilac).set(2, 7, 2, C.white);
for (const [x, z, len] of [[1, 1, 4], [3, 1, 3], [1, 3, 3], [3, 3, 5], [2, 2, 2]])
  for (let y = 4; y > 4 - len && y >= 0; y--) jelly.set(x, y, z, y % 2 ? C.pink : C.lilac);

// An octopus: round head, a skirt, four arms that curl up at the tips.
const octopus = grid(9, 6, 9)
  .ellipsoid([4, 3.6, 4], [2.2, 2.2, 2.2], C.purple)
  .cylinder('y', [4, 4], 2.6, [1, 1], C.purple)
  .set(3, 4, 5, C.ink).set(5, 4, 5, C.ink);
for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
  for (let k = 1; k <= 4; k++) octopus.set(4 + dx * k, 0, 4 + dz * k, k === 4 ? C.lilac : C.purple);
  octopus.set(4 + dx * 4, 1, 4 + dz * 4, C.lilac);
}

const buoy = grid(5, 9, 5)
  .cylinder('y', [2, 2], 2.2, [0, 1], C.navy)
  .cylinder('y', [2, 2], 1.8, [2, 5], (x, y) => (y % 2 ? C.white : C.red))
  .cylinder('y', [2, 2], 1.1, [6, 6], C.red)
  .set(2, 7, 2, C.yellow).set(2, 8, 2, C.yellow)
  .set(1, 7, 2, C.dgrey).set(3, 7, 2, C.dgrey);

const hut = grid(7, 8, 6)
  .box([1, 5], [0, 4], [1, 4], (x) => (x % 2 ? C.white : C.sky))
  .box([2, 4], [1, 3], [2, 3], (x, y) => (y === 1 ? C.sand : 0))           // inside: a sandy floor
  .box([3, 3], [0, 2], [4, 4], C.navy)                                       // door
  .box([0, 6], [5, 5], [0, 5], C.coral)
  .box([1, 5], [6, 6], [0, 5], C.coral)
  .box([2, 4], [7, 7], [0, 5], C.dred)
  .set(5, 3, 5, C.yellow);

// A treasure chest, hollow, with gold inside for whoever peels it open.
const chest = grid(7, 6, 5)
  .box([0, 6], [0, 2], [0, 4], (x) => (x === 0 || x === 6 || x === 3 ? C.gold : C.brown))
  .box([1, 5], [1, 2], [1, 3], (x, y) => (y === 1 ? C.yellow : 0))
  .box([0, 6], [3, 4], [0, 4], (x, y, z) => (y === 4 && (z === 0 || z === 4) ? null : x === 0 || x === 6 || x === 3 ? C.gold : C.dbrown))
  .set(3, 2, 4, C.ink);

const sub = grid(10, 6, 4)
  .ellipsoid([4.5, 1.8, 1.5], [4.6, 1.8, 1.6], C.yellow)
  .box([3, 5], [3, 4], [1, 2], C.gold)
  .set(4, 5, 1, C.dgrey).set(5, 5, 1, C.dgrey).set(6, 5, 1, C.dgrey)
  .set(2, 2, 3, C.sky).set(4, 2, 3, C.sky).set(6, 2, 3, C.sky)
  .set(9, 2, 1, C.dgrey).set(9, 2, 2, C.dgrey).set(9, 3, 1, C.dgrey);

// Branching coral on a sandy patch, with a little anemone and weed.
const coral = grid(7, 8, 5)
  .box([0, 6], [0, 0], [0, 4], (x, y, z) => (disc(x - 3, z - 2, 3.2) ? C.sand : null))
  .box([3, 3], [1, 4], [2, 2], C.pink)
  .box([1, 2], [4, 4], [2, 2], C.pink).box([1, 1], [5, 7], [2, 2], (x, y) => (y >= 6 ? C.coral : C.pink)).set(0, 6, 2, C.coral)
  .box([4, 5], [3, 3], [2, 2], C.pink).box([5, 5], [4, 6], [2, 2], (x, y) => (y >= 6 ? C.coral : C.pink)).set(6, 5, 2, C.coral)
  .box([3, 3], [4, 6], [3, 3], (x, y) => (y >= 6 ? C.coral : C.pink))
  .set(5, 1, 3, C.orange).box([1, 1], [1, 2], [1, 1], C.purple);

const gull = grid(8, 4, 5)
  .ellipsoid([3.5, 1.5, 2], [3, 1.3, 1.3], C.white)
  .box([2, 3], [2, 2], [0, 4], (x, y, z) => (z === 2 ? C.white : C.grey))   // wings spread
  .box([3, 3], [3, 3], [0, 0], C.grey).box([3, 3], [3, 3], [4, 4], C.grey)  // tips lifted
  .box([5, 6], [1, 2], [2, 2], C.white).set(6, 2, 3, C.ink).set(7, 1, 2, C.orange)
  .set(0, 1, 2, C.grey).set(0, 2, 2, C.grey);

export default [
  { id: 'cand-crab', name: 'Crab', ...crab.entry({}) },
  {
    id: 'cand-shell', name: 'Scallop Shell', dims: [9, 8, 2],
    cell(x, y, z) {
      const rows = ['..xxxxx..', '.xxxxxxx.', 'xxxxxxxxx', 'xxxxxxxxx', '.xxxxxxx.', '..xxxxx..', '...xxx...', '..xxxxx..'];
      if (rows[7 - y][x] !== 'x') return 0;
      if (y === 0) return x === 4 ? C.coral : C.pink;            // the hinge and its ears
      if (z === 0 && (y <= 1 || x % 2)) return 0;                // a thinner back
      return x % 2 ? C.cream : C.coral;                          // ribs
    },
  },
  {
    id: 'cand-anchor', name: 'Anchor', ...bitmap([
      '...nnn...',
      '...n.n...',
      '...nnn...',
      '.nnnnnnn.',
      '....n....',
      '....n....',
      'n...n...n',
      'nn..n..nn',
      '.nnnnnnn.',
    ], 2, { n: C.navy }),
  },
  {
    id: 'cand-starfish', name: 'Starfish', ...plan([
      '...o...',
      '...o...',
      'oooyooo',
      '.oyyyo.',
      '..oyo..',
      '.oo.oo.',
      'oo...oo',
    ], 2, { o: (y) => (y === 0 ? C.coral : C.orange), y: C.yellow }),
  },
  { id: 'cand-jellyfish', name: 'Jellyfish', ...jelly.entry({}) },
  { id: 'cand-octopus', name: 'Octopus', ...octopus.entry({}) },
  { id: 'cand-buoy', name: 'Buoy', ...buoy.entry({}) },
  { id: 'cand-beachhut', name: 'Beach Hut', ...hut.entry({}) },
  { id: 'cand-seagull', name: 'Seagull', ...gull.entry({}) },
  { id: 'cand-chest', name: 'Treasure Chest', ...chest.entry({}) },
  { id: 'cand-submarine', name: 'Submarine', ...sub.entry({}) },
  { id: 'cand-coral', name: 'Coral', ...coral.entry({}) },
];
