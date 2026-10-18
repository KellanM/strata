// Home & Morning (I · First Light, Dawn): extra candidates, batch 1.
// Entry format and helpers: ../voxel.js. Checklist: docs/voxel-study.md.
// The iso view looks from +x +z, so identifying details face high x / high z.
import { C, grid } from '../voxel.js';

const steel = 0x7d8794, cocoa = 0x8a5a3c, butter = 0xf7e08a, syrup = 0xa8582b, jam = 0xd2475a,
  glass = 0xbfe3ef, water = 0x6fb7dc, wood = 0xa86f45, dwood = 0x7a4c2f, ivory = 0xf4ecdc;

export default [
  // a soft-boiled egg with its top cut off, the yolk showing
  (() => {
    const g = grid(5, 7, 5);
    g.cylinder('y', [2, 2], 2.2, [0, 0], C.teal)
      .cylinder('y', [2, 2], 1, [1, 1], C.teal)
      .cylinder('y', [2, 2], 2.2, [2, 3], C.teal)
      .ellipsoid([2, 4.3, 2], [1.75, 2.2, 1.75], (x, y, z) => (y >= 4 ? C.cream : null))
      .set(2, 6, 2, C.yellow).set(2, 5, 2, C.yellow)
      .set(4, 3, 2, C.white).set(4, 4, 2, C.white);            // a spoon leaning on the rim
    return g.entry({ id: 'cand-egg-cup', name: 'Egg Cup' });
  })(),

  // a fat mug, a huge handle on the viewer's side, coffee on top
  (() => {
    const g = grid(7, 6, 5);
    g.cylinder('y', [2, 2], 2.2, [0, 5], C.coral)
      .cylinder('y', [2, 2], 1.3, [5, 5], cocoa)
      .box([5, 6], [1, 1], [2, 2], C.coral).box([6, 6], [1, 4], [2, 2], C.coral).box([5, 6], [4, 4], [2, 2], C.coral)
      .box([1, 3], [2, 2], [4, 4], C.white);                    // a white band where it faces you
    return g.entry({ id: 'cand-coffee-mug', name: 'Coffee Mug' });
  })(),

  // a deep armchair with rolled arms and a gap beneath the seat
  (() => {
    const g = grid(7, 6, 6);
    g.box([0, 6], [1, 2], [0, 5], C.rose)                        // seat
      .box([0, 6], [3, 5], [0, 1], C.rose)                      // back
      .box([0, 0], [3, 4], [0, 5], C.dred).box([6, 6], [3, 4], [0, 5], C.dred)   // arms
      .box([1, 5], [3, 3], [2, 5], C.pink)                      // cushion
      .box([0, 0], [0, 0], [0, 0], C.dbrown).box([6, 6], [0, 0], [0, 0], C.dbrown)
      .box([0, 0], [0, 0], [5, 5], C.dbrown).box([6, 6], [0, 0], [5, 5], C.dbrown);
    return g.entry({ id: 'cand-armchair', name: 'Armchair' });
  })(),

  // a little bed: headboard, pillow, a quilt folded back
  (() => {
    const g = grid(5, 5, 9);
    g.box([0, 4], [1, 1], [0, 8], C.cream)
      .box([0, 4], [1, 4], [0, 0], wood).box([0, 4], [1, 2], [8, 8], wood)
      .box([0, 0], [0, 0], [0, 0], dwood).box([4, 4], [0, 0], [0, 0], dwood)
      .box([0, 0], [0, 0], [8, 8], dwood).box([4, 4], [0, 0], [8, 8], dwood)
      .box([1, 3], [2, 2], [1, 2], C.white)                     // pillow
      .box([0, 4], [2, 2], [4, 7], C.blue).box([0, 4], [2, 2], [3, 3], C.sky);   // quilt + fold
    return g.entry({ id: 'cand-bed', name: 'Bed' });
  })(),

  // a window box with three flowers at different heights
  (() => {
    const g = grid(9, 6, 3);
    g.box([0, 8], [0, 1], [0, 2], C.terracotta).box([1, 7], [1, 1], [1, 1], C.dbrown)
      .box([1, 1], [2, 3], [1, 1], C.green).set(1, 4, 1, C.red).set(0, 4, 1, C.red).set(2, 4, 1, C.red)
      .box([4, 4], [2, 4], [1, 1], C.green).set(4, 5, 1, C.yellow).set(3, 5, 1, C.yellow).set(5, 5, 1, C.yellow)
      .box([7, 7], [2, 2], [1, 1], C.green).set(7, 3, 1, C.pink).set(6, 3, 1, C.pink).set(8, 3, 1, C.pink)
      .set(5, 2, 1, C.leaf).set(2, 2, 1, C.leaf);
    return g.entry({ id: 'cand-window-box', name: 'Window Box' });
  })(),

  // an anglepoise lamp: heavy base, two arm segments, a big cone shade
  (() => {
    const g = grid(7, 8, 4);
    g.box([0, 2], [0, 0], [1, 2], C.navy)
      .box([1, 1], [1, 4], [1, 1], steel)
      .box([2, 2], [4, 5], [1, 1], steel).box([3, 3], [5, 6], [1, 1], steel).box([4, 4], [6, 6], [1, 1], steel)   // arm in 2-voxel steps
      .box([4, 6], [7, 7], [1, 2], C.navy).box([5, 6], [5, 6], [1, 2], C.navy)
      .box([6, 6], [4, 4], [1, 2], C.yellow);                    // the bulb's glow under the shade
    return g.entry({ id: 'cand-desk-lamp', name: 'Desk Lamp' });
  })(),

  // a croissant: a fat crescent, thick in the middle and tapering to two horns that curl toward you
  (() => {
    const g = grid(9, 3, 5);
    const spine = [];
    for (let k = 0; k <= 12; k++) {
      const t = k / 12, th = (200 + 140 * t) * Math.PI / 180;
      spine.push([4 + 3.4 * Math.cos(th), 4.6 + 3.1 * Math.sin(th), 0.75 + 0.75 * Math.sin(Math.PI * t), t]);
    }
    g.box([0, 8], [0, 2], [0, 4], (x, y, z) => {
      for (const [sx, sz, r, t] of spine) {
        if (((x - sx) / r) ** 2 + ((y - 0.6 - r * 0.5) / (r * 0.9)) ** 2 + ((z - sz) / r) ** 2 <= 1.15) {
          return Math.round(t * 6) % 2 ? C.crust : C.gold;     // rolled ridges
        }
      }
      return null;
    });
    return g.entry({ id: 'cand-croissant', name: 'Croissant' });
  })(),

  // a stack of pancakes, butter on top, syrup running down the front
  (() => {
    const g = grid(7, 6, 7);
    for (let y = 0; y < 4; y++) g.cylinder('y', [3, 3], y % 2 ? 2.9 : 2.7, [y, y], y % 2 ? C.tan : C.crust);
    g.box([2, 3], [4, 4], [2, 3], butter)
      .cylinder('y', [3, 3], 1.6, [4, 4], (x, y, z) => (g.get(x, y, z) ? null : syrup))
      .box([3, 3], [1, 3], [6, 6], syrup).box([4, 4], [2, 3], [6, 6], syrup)
      .set(3, 5, 3, butter);
    return g.entry({ id: 'cand-pancakes', name: 'Pancakes' });
  })(),

  // a tall clock: hood, face, a pendulum window, plinth
  (() => {
    const g = grid(5, 10, 4);
    g.box([0, 4], [0, 1], [0, 3], dwood).box([1, 3], [2, 6], [0, 2], wood)
      .box([0, 4], [7, 9], [0, 3], dwood)
      .box([1, 3], [7, 9], [3, 3], ivory).set(2, 8, 3, C.ink).set(3, 8, 3, C.ink).set(2, 9, 3, C.ink)
      .box([2, 2], [3, 5], [2, 2], C.gold).set(2, 3, 2, C.gold)
      .box([1, 1], [3, 5], [2, 2], glass).box([3, 3], [3, 5], [2, 2], glass);
    return g.entry({ id: 'cand-grandfather-clock', name: 'Grandfather Clock' });
  })(),

  // a bookshelf: frame with gaps, books of different colours and heights
  (() => {
    const g = grid(7, 8, 3);
    g.box([0, 0], [0, 7], [0, 2], wood).box([6, 6], [0, 7], [0, 2], wood)
      .box([0, 6], [0, 0], [0, 2], wood).box([0, 6], [4, 4], [0, 2], wood).box([0, 6], [7, 7], [0, 2], wood);
    const books = [[1, 3, C.red], [2, 2, C.blue], [3, 3, C.green], [5, 2, C.gold]];
    books.forEach(([x, h, c]) => g.box([x, x], [1, h], [1, 2], c));
    [[1, 6, C.teal], [2, 5, C.coral], [4, 6, C.purple], [5, 6, C.yellow]].forEach(([x, h, c]) => g.box([x, x], [5, h], [1, 2], c));
    g.set(4, 1, 1, C.pink).set(4, 1, 2, C.pink);                  // one book lying flat
    return g.entry({ id: 'cand-bookshelf', name: 'Bookshelf' });
  })(),

  // an upright piano: keys on a shelf toward you, a candle on top
  (() => {
    const g = grid(8, 7, 4);
    g.box([0, 7], [0, 5], [0, 1], C.ink)
      .box([0, 7], [2, 2], [2, 3], C.white)
      .box([0, 7], [2, 2], [2, 2], (x) => (x % 2 ? C.ink : C.white))
      .box([0, 0], [0, 1], [2, 3], C.ink).box([7, 7], [0, 1], [2, 3], C.ink)
      .set(6, 6, 0, C.cream).set(6, 6, 1, C.gold);
    return g.entry({ id: 'cand-piano', name: 'Piano' });
  })(),

  // a record player: box, a black disc with a red label, the tone arm
  (() => {
    const g = grid(8, 3, 7);
    g.box([0, 7], [0, 0], [0, 6], wood)
      .cylinder('y', [3, 3], 2.9, [1, 1], C.ink).set(3, 1, 3, C.red)
      .box([7, 7], [1, 2], [0, 0], steel).set(6, 2, 0, steel).set(6, 2, 1, steel).set(5, 2, 1, steel).set(5, 2, 2, steel)   // tone arm resting on the record
      .box([7, 7], [1, 1], [6, 6], C.gold);
    return g.entry({ id: 'cand-record-player', name: 'Record Player' });
  })(),

  // a wedge of layer cake: sponge, jam, frosting, a cherry
  (() => {
    const g = grid(7, 5, 5);
    for (let z = 0; z < 5; z++) for (let x = 0; x < 7; x++) {
      if (x > 2 + z * 1.2) continue;                             // the wedge narrows to the back
      g.box([x, x], [0, 3], [z, z], (_, y) => (y === 1 ? jam : y === 3 ? C.white : C.tan));
    }
    g.set(1, 4, 3, C.red).set(5, 4, 4, C.white);
    return g.entry({ id: 'cand-cake-slice', name: 'Cake Slice' });
  })(),

  // a honey pot: round jar, a cloth lid tied on, a drip
  (() => {
    const g = grid(5, 7, 5);
    g.ellipsoid([2, 2.4, 2], [2.2, 2.6, 2.2], C.gold)
      .cylinder('y', [2, 2], 2.2, [5, 5], C.red).cylinder('y', [2, 2], 1.4, [6, 6], C.red)
      .box([4, 4], [4, 4], [1, 3], C.white)
      .set(2, 4, 4, butter).set(2, 3, 4, butter);
    return g.entry({ id: 'cand-honey-jar', name: 'Honey Jar' });
  })(),

  // a desk globe: blue sphere with green land on a bent stand
  (() => {
    const g = grid(7, 8, 7);
    g.box([2, 4], [0, 0], [2, 4], C.bronze).box([3, 3], [1, 1], [3, 3], C.bronze)
      .ellipsoid([3, 4.5, 3], [2.6, 2.6, 2.6], (x, y, z) => (((x * 3 + y * 5 + z * 2) % 7) < 3 ? C.green : C.blue))
      .box([6, 6], [3, 6], [3, 3], C.bronze);
    return g.entry({ id: 'cand-globe', name: 'Globe' });
  })(),

  // a birdcage with a little yellow bird inside on its perch
  (() => {
    const g = grid(5, 8, 5);
    g.box([0, 4], [0, 0], [0, 4], C.gold)
      .box([0, 4], [5, 5], [0, 4], C.gold).box([1, 3], [6, 6], [1, 3], C.gold).set(2, 7, 2, C.gold)
      .box([0, 0], [1, 4], [0, 0], C.gold).box([4, 4], [1, 4], [0, 0], C.gold)
      .box([0, 0], [1, 4], [4, 4], C.gold).box([4, 4], [1, 4], [4, 4], C.gold)
      .box([2, 2], [1, 4], [4, 4], C.gold).box([4, 4], [1, 4], [2, 2], C.gold)
      .box([1, 3], [2, 2], [2, 2], C.brown).set(2, 3, 2, C.yellow).set(3, 3, 2, C.orange);
    return g.entry({ id: 'cand-birdcage', name: 'Birdcage' });
  })(),

  // a cupcake: pleated case, a swirl of frosting, a cherry off-centre
  (() => {
    const g = grid(5, 7, 5);
    g.cylinder('y', [2, 2], 1.7, [0, 0], C.blue).cylinder('y', [2, 2], 2.2, [1, 2], (x, y, z) => ((x + z) % 2 ? C.sky : C.blue))
      .cylinder('y', [2, 2], 2.3, [3, 3], C.pink).cylinder('y', [2, 2], 1.6, [4, 4], C.pink).cylinder('y', [2, 2], 0.9, [5, 5], C.pink)
      .set(3, 5, 3, C.red).set(3, 6, 3, C.red);
    return g.entry({ id: 'cand-cupcake', name: 'Cupcake' });
  })(),

  // an ice-cream cone with two scoops, the top one tipped
  (() => {
    const g = grid(5, 9, 5);
    for (let y = 0; y <= 3; y++) g.cylinder('y', [2, 2], 0.5 + y * 0.5, [y, y], (x, yy, z) => ((x + z + yy) % 2 ? C.crust : C.tan));
    g.ellipsoid([2, 5, 2], [2.1, 1.6, 2.1], C.pink)
      .ellipsoid([2.6, 7, 2.4], [1.6, 1.4, 1.6], C.cream)
      .set(3, 8, 3, C.red);
    return g.entry({ id: 'cand-ice-cream', name: 'Ice Cream' });
  })(),

  // a fishbowl: a glass rim, blue water, an orange fish swimming at the front, a plant
  (() => {
    const g = grid(7, 7, 7);
    g.ellipsoid([3, 3, 3], [3.1, 3.1, 3.1], (x, y, z) => (y <= 3 ? water : null))
      .cylinder('y', [3, 3], 2.6, [5, 5], (x, y, z) => (Math.hypot(x - 3, z - 3) > 1.6 ? glass : null))   // the rim
      .box([0, 6], [4, 4], [0, 6], (x, y, z) => (ell3(x - 3, 1, z - 3, 3.1) && Math.hypot(x - 3, z - 3) > 2.2 ? glass : null))
      .box([2, 4], [0, 0], [2, 4], C.sand)
      .box([3, 4], [2, 3], [5, 5], C.orange).set(2, 3, 5, C.coral).set(4, 3, 5, C.orange).set(4, 3, 6, C.ink)
      .box([1, 1], [1, 4], [2, 2], C.green).set(1, 4, 1, C.leaf);
    return g.entry({ id: 'cand-fishbowl', name: 'Fishbowl' });
  })(),

  // a ring doughnut: pink icing, sprinkles, the hole through the middle
  (() => {
    const g = grid(7, 3, 7);
    for (let z = 0; z < 7; z++) for (let x = 0; x < 7; x++) {
      const r = Math.hypot(x - 3, z - 3);
      if (r > 3.2 || r < 1.2) continue;
      g.set(x, 0, z, C.crust).set(x, 1, z, C.tan);
      if (r > 1.4 && r < 2.9) g.set(x, 1, z, (x * 7 + z * 3) % 5 === 0 ? C.yellow : (x * 5 + z) % 7 === 0 ? C.blue : C.pink);
      if (r > 1.8 && r < 2.6 && (x + z) % 3 === 0) g.set(x, 2, z, C.pink);
    }
    return g.entry({ id: 'cand-doughnut', name: 'Doughnut' });
  })(),
];

function ell3(dx, dy, dz, r) { return dx * dx + dy * dy + dz * dz <= r * r; }
