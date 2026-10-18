// Sky & Night (V · Starfall, Night): candidate objects. Entry format and helpers: ../voxel.js.
import { C, ell, disc, bitmap, plan, grid } from '../voxel.js';

const balloon = grid(7, 10, 7)
  // four even panels, so it looks the same from every corner
  .ellipsoid([3, 6.3, 3], [3.2, 3.4, 3.2], (x, y, z) => (Math.abs(x - 3) > Math.abs(z - 3) ? C.red : C.yellow))
  .box([2, 4], [3, 3], [2, 4], C.tan)                                     // the balloon's mouth
  .box([2, 4], [0, 1], [2, 4], C.tan)                                     // basket
  .set(2, 2, 2, C.dbrown).set(4, 2, 2, C.dbrown).set(2, 2, 4, C.dbrown).set(4, 2, 4, C.dbrown);

const cloud = grid(9, 4, 5)
  .ellipsoid([2.2, 1.2, 2], [2.2, 1.4, 1.8], C.white)
  .ellipsoid([4.5, 1.8, 2], [2.4, 2.2, 2], C.white)
  .ellipsoid([6.6, 1.2, 2], [2, 1.4, 1.8], C.white);
const cloudCell = cloud.cell;   // given a soft grey underside below

const satellite = grid(10, 5, 3)
  .box([4, 5], [1, 3], [0, 2], C.gold)
  .box([0, 3], [2, 2], [1, 1], (x) => (x === 3 ? C.silver : C.blue))
  .box([6, 9], [2, 2], [1, 1], (x) => (x === 6 ? C.silver : C.blue))
  .box([0, 2], [1, 3], [1, 1], (x, y) => (y === 2 ? C.blue : C.navy))
  .box([7, 9], [1, 3], [1, 1], (x, y) => (y === 2 ? C.blue : C.navy))
  .set(5, 4, 1, C.silver).set(4, 4, 1, C.white).set(4, 2, 2, C.ink);

const ufo = grid(7, 5, 7)
  .cylinder('y', [3, 3], 3.2, [1, 1], C.silver)
  .cylinder('y', [3, 3], 2.2, [0, 0], C.dgrey)
  .cylinder('y', [3, 3], 1.6, [2, 3], (x, y) => (y === 3 ? C.sky : C.sky))
  .set(3, 4, 3, C.sky)
  .set(0, 1, 3, C.yellow).set(6, 1, 3, C.yellow).set(3, 1, 0, C.yellow).set(3, 1, 6, C.yellow);

// A telescope on a stand, its tube stepping up toward the sky.
const telescope = grid(8, 8, 5)
  .box([3, 3], [1, 3], [2, 2], C.dbrown)
  .box([2, 4], [0, 0], [2, 2], C.dbrown).box([3, 3], [0, 0], [1, 3], C.dbrown)
  .box([2, 4], [4, 4], [2, 3], C.navy)
  .box([4, 6], [5, 5], [2, 3], C.navy)
  .box([6, 7], [6, 6], [2, 3], (x) => (x === 7 ? C.gold : C.navy))
  .box([1, 1], [4, 4], [2, 3], C.dgrey);

// Fireflies in a jar: glowing points resting against the glass.
const jar = grid(5, 7, 5)
  .cylinder('y', [2, 2], 2.2, [0, 4], (x, y, z) => (Math.abs(x - 2) <= 1 && Math.abs(z - 2) <= 1 && y >= 1 ? 0 : y === 0 ? C.sky : C.lilac))
  .set(1, 2, 2, C.yellow).set(3, 3, 2, C.yellow).set(2, 4, 1, C.yellow).set(2, 1, 3, C.yellow)
  .cylinder('y', [2, 2], 1.5, [5, 5], C.bronze)
  .set(2, 6, 2, C.bronze);

// A rainbow arching between two clouds.
const rainbow = grid(9, 6, 2);
for (let y = 0; y < 6; y++) for (let x = 0; x < 9; x++) {
  const d = Math.hypot(x - 4, y + 0.5);
  const band = d > 5.6 ? null : d > 4.7 ? C.red : d > 3.8 ? C.orange : d > 2.9 ? C.yellow : null;
  if (band) rainbow.box([x, x], [y, y], [0, 1], band);
}
rainbow.box([0, 2], [0, 0], [0, 1], C.white).set(1, 1, 1, C.white).set(0, 1, 1, C.white)
  .box([6, 8], [0, 0], [0, 1], C.white).set(7, 1, 1, C.white).set(8, 1, 1, C.white);

const lanternSky = grid(5, 7, 5)
  .box([1, 3], [2, 5], [1, 3], (x, y, z) => (x === 2 && z === 2 && y < 5 ? null : y === 5 ? C.orange : C.yellow))
  .box([2, 2], [6, 6], [2, 2], C.orange)
  .set(2, 1, 2, C.orange).set(2, 2, 2, C.yellow).set(2, 0, 2, C.gold);

export default [
  {
    id: 'cand-comet', name: 'Comet', ...bitmap([
      '......yy.',
      '....lyyyy',
      '..llwyyyy',
      'llwwwyyy.',
      '..llwlyy.',
      '....l....',
    ], 2, { y: C.yellow, w: C.white, l: C.lilac }),
  },
  { id: 'cand-balloon', name: 'Hot-Air Balloon', ...balloon.entry({}) },
  { id: 'cand-cloud', name: 'Cloud', dims: cloud.dims, cell: (x, y, z) => { const c = cloudCell(x, y, z); return c && y === 0 ? C.silver : c; } },
  {
    id: 'cand-kite', name: 'Kite', ...bitmap([
      '...r...',
      '..rry..',
      '.rrryy.',
      'bbbwyyy',
      '.bbbgy.',
      '..bbg..',
      '...b...',
      '...r...',
      '..yry..',
      '...r...',
    ], 2, { r: C.red, y: C.yellow, b: C.blue, g: C.green, w: C.white }),
  },
  { id: 'cand-satellite', name: 'Satellite', ...satellite.entry({}) },
  { id: 'cand-ufo', name: 'UFO', ...ufo.entry({}) },
  {
    id: 'cand-star', name: 'Star', ...bitmap([
      '...y...',
      '...y...',
      '..yyy..',
      'yyyoyyy',
      '.yyoyy.',
      '..yyy..',
      '.yy.yy.',
      'yy...yy',
    ], 2, { y: C.yellow, o: C.gold }),
  },
  { id: 'cand-telescope', name: 'Telescope', ...telescope.entry({}) },
  { id: 'cand-rainbow', name: 'Rainbow', ...rainbow.entry({}) },
  { id: 'cand-fireflies', name: 'Firefly Jar', ...jar.entry({}) },
  {
    id: 'cand-snowflake', name: 'Snowflake', ...bitmap([
      '..sss..',
      '...s...',
      's..s..s',
      'sssWsss',
      's..s..s',
      '...s...',
      '..sss..',
    ], 2, { s: C.sky, W: C.white }),
  },
  { id: 'cand-skylantern', name: 'Sky Lantern', ...lanternSky.entry({}) },
];
