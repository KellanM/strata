// Temples & Lanterns (IV · Ember Steps, Dusk): candidate objects. Entry format and helpers: ../voxel.js.
import { C, ell, disc, bitmap, plan, grid } from '../voxel.js';

const bell = grid(7, 8, 5)
  .box([0, 6], [7, 7], [2, 2], C.dbrown)                       // beam
  .box([0, 0], [0, 6], [2, 2], C.brown).box([6, 6], [0, 6], [2, 2], C.brown)
  .set(3, 6, 2, C.tan)
  .cylinder('y', [3, 2], 1.1, [4, 5], C.bronze)
  .cylinder('y', [3, 2], 1.6, [2, 3], C.bronze)
  .cylinder('y', [3, 2], 2.1, [1, 1], C.gold)
  .set(3, 0, 2, C.dbrown);

const lantern = grid(5, 9, 5)
  .box([0, 4], [0, 0], [0, 4], C.grey)
  .box([1, 3], [1, 1], [1, 3], C.grey)
  .box([2, 2], [2, 3], [2, 2], C.grey)
  .box([1, 3], [4, 5], [1, 3], (x, y, z) => ((x === 2 || z === 2) && y === 5 && (x === 3 || z === 3) ? C.yellow : C.silver))
  .set(3, 5, 2, C.yellow).set(2, 5, 3, C.yellow).set(2, 4, 2, C.orange)
  .box([0, 4], [6, 6], [0, 4], C.dgrey)
  .box([1, 3], [7, 7], [1, 3], C.dgrey)
  .set(2, 8, 2, C.grey);

const drum = grid(7, 7, 5)
  .cylinder('z', [3, 3.5], 2.9, [1, 3], (x, y, z) => (z === 3 ? C.cream : (x + y) % 3 === 0 && (Math.abs(x - 3) + Math.abs(y - 3.5) > 2.5) ? C.gold : C.red))
  .box([1, 1], [0, 1], [2, 2], C.dbrown).box([5, 5], [0, 1], [2, 2], C.dbrown)
  .box([1, 5], [0, 0], [1, 3], (x, y, z) => (z === 1 || z === 3) && (x === 1 || x === 5) ? C.dbrown : null);

const teahouse = grid(9, 8, 7)
  .box([1, 7], [0, 0], [1, 5], C.grey)
  .box([2, 6], [1, 3], [2, 4], (x, y, z) => (z === 4 && x >= 3 && x <= 5 && y >= 1 ? (x === 4 ? C.dbrown : C.cream) : x === 2 || x === 6 ? C.dbrown : C.cream))
  .box([0, 8], [4, 4], [0, 6], C.navy)
  .box([1, 7], [5, 5], [1, 5], C.navy)
  .box([2, 6], [6, 6], [2, 4], C.navy)
  .box([3, 5], [7, 7], [3, 3], C.navy)
  .set(0, 5, 0, C.navy).set(8, 5, 0, C.navy).set(0, 5, 6, C.navy).set(8, 5, 6, C.navy)
  .set(7, 1, 5, C.red).set(7, 2, 5, C.yellow);

// An origami crane: a folded body, wings swept up from its back, neck and red crown.
const crane = grid(8, 6, 6)
  .box([2, 5], [1, 2], [2, 3], C.white)
  .box([3, 4], [3, 3], [0, 5], C.white)                                   // wings across the back
  .box([3, 3], [4, 4], [0, 0], C.white).box([3, 3], [4, 4], [5, 5], C.white) // tips lifted
  .box([6, 6], [2, 4], [2, 2], C.white).set(7, 4, 2, C.white).set(7, 4, 3, C.ink)
  .set(6, 5, 2, C.red)
  .set(1, 2, 2, C.ink).set(1, 3, 2, C.ink).set(0, 3, 2, C.ink);           // tail

const daruma = grid(6, 7, 6)
  .ellipsoid([2.5, 3, 2.5], [2.6, 3.2, 2.6], C.red)
  .box([1, 4], [3, 5], [5, 5], (x, y) => (y === 5 && (x === 1 || x === 4) ? C.red : C.cream))
  .set(1, 4, 5, C.ink).set(3, 4, 5, C.cream).set(4, 4, 5, C.cream).set(2, 4, 5, C.cream)
  .box([0, 5], [1, 1], [3, 5], (x, y, z) => (z === 5 && x > 0 && x < 5 ? C.gold : null))
  .set(5, 3, 3, C.gold).set(5, 4, 4, C.cream).set(5, 4, 3, C.ink);

const incense = grid(5, 8, 5)
  .cylinder('y', [2, 2], 2.2, [1, 2], (x, y, z) => (y === 2 && x === 2 && z === 2 ? C.dgrey : C.bronze))
  .set(1, 0, 1, C.dbrown).set(3, 0, 1, C.dbrown).set(1, 0, 3, C.dbrown).set(3, 0, 3, C.dbrown)
  .set(2, 3, 2, C.dbrown).set(2, 4, 2, C.dbrown)
  .set(2, 5, 2, C.lilac).set(2, 6, 2, C.lilac).set(3, 6, 2, C.lilac).set(3, 7, 2, C.lilac);

const gong = grid(8, 9, 3)
  .box([0, 0], [0, 7], [1, 1], C.dbrown).box([7, 7], [0, 7], [1, 1], C.dbrown)
  .box([0, 7], [8, 8], [1, 1], C.red)
  .box([0, 7], [0, 0], [0, 2], C.dbrown)
  .set(3, 7, 1, C.ink).set(4, 7, 1, C.ink)
  .cylinder('z', [3.5, 4], 2.3, [1, 1], (x, y) => (Math.hypot(x - 3.5, y - 4) < 1 ? C.yellow : C.gold));

const umbrella = grid(7, 8, 7);
for (let y = 3; y <= 6; y++) umbrella.cylinder('y', [3, 3], [3.2, 2.6, 1.8, 0.9][y - 3], [y, y], (x, yy, z) => ((x - 3) * (z - 3) === 0 || Math.abs(x - 3) === Math.abs(z - 3) ? C.dred : C.red));
umbrella.box([3, 3], [0, 2], [3, 3], C.dbrown).set(3, 7, 3, C.dbrown);

export default [
  { id: 'cand-bell', name: 'Temple Bell', ...bell.entry({}) },
  {
    id: 'cand-fan', name: 'Paper Fan', ...bitmap([
      '..rcrcrcr..',
      '.rcrcrcrcr.',
      'rcrcrcrcrcr',
      '.rcrcrcrcr.',
      '..rcrcrcr..',
      '....bbb....',
      '.....b.....',
    ].map((r) => r.slice(0, 10)), 2, { r: C.red, c: C.cream, b: C.dbrown }),
  },
  {
    id: 'cand-koi', name: 'Koi', ...plan([
      '..........',
      '....o.....',
      '.wooowowk.',
      'ooowwoooo.',
      '.wooooowk.',
      '....o.....',
      '..........',
    ].map((r) => r.slice(0, 10)), 2, {
      o: (y) => (y === 0 ? C.coral : C.orange), w: C.white, k: (y) => (y === 1 ? C.ink : C.white),
    }),
  },
  { id: 'cand-stonelantern', name: 'Stone Lantern', ...lantern.entry({}) },
  { id: 'cand-taiko', name: 'Taiko Drum', ...drum.entry({}) },
  { id: 'cand-teahouse', name: 'Tea House', ...teahouse.entry({}) },
  { id: 'cand-crane', name: 'Crane', ...crane.entry({}) },
  {
    id: 'cand-lotus', name: 'Lotus', ...plan([
      '.ggggg.',
      'ggpgpgg',
      'gpppppg',
      'ggpypgg',
      'gpppppg',
      'ggpgpgg',
      '.gg.gg.',
    ], 3, {
      g: (y) => (y === 0 ? C.green : null), p: (y) => (y === 0 ? C.green : y <= 2 ? C.pink : null),
      y: (y) => (y === 0 ? C.green : y <= 1 ? C.yellow : null),
    }),
  },
  { id: 'cand-incense', name: 'Incense Burner', ...incense.entry({}) },
  { id: 'cand-daruma', name: 'Daruma', ...daruma.entry({}) },
  { id: 'cand-gong', name: 'Gong', ...gong.entry({}) },
  { id: 'cand-umbrella', name: 'Paper Umbrella', ...umbrella.entry({}) },
];
