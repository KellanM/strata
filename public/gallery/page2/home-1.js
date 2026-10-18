// Page 2 · Home & Morning: small, easy candidates to replace Candle (First
// Light, level 3, right after Steps and Heart). Entry format and helpers:
// ../voxel.js. Checklist: docs/voxel-study.md. The iso view looks from +x +z,
// so identifying details face high x / high z.
import { C, grid, bitmap } from '../voxel.js';

const jam = 0xd2475a, glass = 0xbfe3ef, wood = 0xa86f45, butter = 0xf7e08a, tin = 0xc9d1d9;

const flat = (id, name, rows, depth, key, extra = {}) => ({ id, name, ...bitmap(rows, depth, key), ...extra });

const list = [
  // a carton of milk: white with a blue band and a folded gable top
  (() => {
    const g = grid(4, 7, 4);
    g.box([0, 3], [0, 4], [0, 3], C.white)
      .box([0, 3], [1, 2], [0, 3], (x, y, z) => (x === 3 || z === 3 || x === 0 || z === 0 ? C.blue : null))
      .box([0, 3], [5, 5], [1, 2], C.white)
      .box([0, 3], [6, 6], [1, 2], C.blue);
    return g.entry({ id: 'cand-milk-carton', name: 'Milk Carton' });
  })(),

  // a jar of jam with a cream label and a cloth cap tied in a knot
  (() => {
    const g = grid(5, 6, 5);
    g.cylinder('y', [2, 2], 2.2, [0, 3], jam)
      .cylinder('y', [2, 2], 2.2, [1, 2], (x, y, z) => (x === 4 || z === 4 ? C.cream : null))
      .cylinder('y', [2, 2], 2.3, [4, 4], C.red)
      .set(2, 5, 2, C.red).set(3, 5, 2, C.white);
    return g.entry({ id: 'cand-jam-jar', name: 'Jam Jar' });
  })(),

  // salt and pepper: a white shaker and a black one on a little wooden tray
  (() => {
    const g = grid(6, 5, 3);
    g.box([0, 5], [0, 0], [0, 2], wood)
      .box([0, 1], [1, 3], [0, 1], C.white).box([0, 1], [4, 4], [0, 1], tin)
      .box([3, 4], [1, 3], [1, 2], C.ink).box([3, 4], [4, 4], [1, 2], tin)
      .set(1, 2, 1, C.sky);                                   // a dab of blue on the salt
    return g.entry({ id: 'cand-salt-pepper', name: 'Salt & Pepper' });
  })(),

  // a striped sock with a darker heel and toe
  flat('cand-sock', 'Sock', [
    'wwww..',
    'rrrr..',
    'bbbb..',
    'rrrr..',
    'rrrrrd',
    'Drrrdd',
  ], 2, { w: C.white, r: C.coral, b: C.blue, D: C.dred, d: C.dred }),

  // a blue mitten, thumb out to the side, a cream cuff
  flat('cand-mitten', 'Mitten', [
    '.mmm..',
    '.mmmm.',
    '.mmm.m',
    '.mmmmm',
    '.mmmm.',
    '.cccc.',
  ], 2, { m: C.blue, c: C.cream }),

  // a furled umbrella: pointed tip, a canopy flaring at the bottom, a hooked handle
  flat('cand-umbrella', 'Umbrella', [
    '..t..',
    '..u..',
    '.uuu.',
    'uuuuu',
    '..h..',
    '..h.h',
    '..hhh',
  ], 2, { t: C.ink, u: C.red, h: C.brown }),

  // a tin of paint, blue spilling over the rim, a brush standing in it
  (() => {
    const g = grid(5, 6, 5);
    g.cylinder('y', [2, 2], 2.2, [0, 3], tin)
      .cylinder('y', [2, 2], 1.3, [3, 3], C.blue)
      .set(4, 3, 2, C.blue).set(4, 2, 2, C.blue).set(2, 4, 3, C.blue)
      .set(2, 4, 2, wood).set(2, 5, 2, wood);
    return g.entry({ id: 'cand-paint-tin', name: 'Paint Tin' });
  })(),

  // a cup with a pink toothbrush leaning in it
  (() => {
    const g = grid(5, 7, 4);
    g.cylinder('y', [2, 1.5], 1.7, [0, 3], C.teal)
      .box([3, 3], [3, 5], [1, 1], C.pink)
      .box([2, 3], [6, 6], [1, 1], C.white).set(2, 6, 2, C.white);
    return g.entry({ id: 'cand-toothbrush', name: 'Toothbrush' });
  })(),

  // a pink bar of soap with a little cluster of bubbles
  (() => {
    const g = grid(6, 5, 4);
    g.box([0, 4], [0, 1], [0, 3], C.pink)
      .set(1, 2, 2, C.sky).set(2, 2, 2, C.sky).set(2, 3, 2, C.sky).set(3, 3, 2, C.sky).set(3, 4, 2, C.white)
      .set(5, 0, 2, C.sky);
    return g.entry({ id: 'cand-soap', name: 'Soap' });
  })(),

  // a yellow pencil standing on its point: graphite, wood, eraser
  (() => {
    const g = grid(3, 7, 3);
    g.set(1, 0, 1, C.ink)
      .box([0, 2], [1, 1], [0, 2], C.tan).clear(0, 1, 0).clear(2, 1, 0).clear(0, 1, 2).clear(2, 1, 2)
      .box([0, 2], [2, 4], [0, 2], C.yellow)
      .box([0, 2], [5, 5], [0, 2], tin)
      .box([0, 2], [6, 6], [0, 2], C.pink);
    return g.entry({ id: 'cand-pencil', name: 'Pencil' });
  })(),

  // a ball of yarn with one wrapping band and a loose end on the floor
  (() => {
    const g = grid(6, 5, 6);
    g.ellipsoid([2.5, 2.2, 2.5], [2.5, 2.3, 2.5], C.rose)
      .ellipsoid([2.5, 2.2, 2.5], [2.5, 2.3, 2.5], (x, y, z) => (Math.abs(x - z) < 1 ? C.dred : null))
      .box([3, 3], [0, 0], [3, 5], C.rose).box([3, 5], [0, 0], [5, 5], C.rose);
    return g.entry({ id: 'cand-yarn', name: 'Ball of Yarn' });
  })(),

  // a little teddy bear: round ears, a cream snout, dark eyes, a red bow
  (() => {
    const g = grid(6, 7, 5);
    g.ellipsoid([2.5, 1.8, 2], [2.3, 1.9, 1.9], C.tan)
      .ellipsoid([2.5, 4.6, 2.2], [1.9, 1.6, 1.7], C.tan)
      .set(1, 6, 2, C.brown).set(4, 6, 2, C.brown)
      .set(1, 5, 3, C.ink).set(4, 5, 3, C.ink)
      .set(2, 4, 4, C.cream).set(3, 4, 4, C.cream)
      .set(3, 3, 3, C.red);
    return g.entry({ id: 'cand-teddy', name: 'Teddy Bear' });
  })(),

  // a music box, lid open, a tiny dancer, a gold crank on the side
  (() => {
    const g = grid(6, 5, 5);
    g.box([0, 4], [0, 2], [0, 4], C.rose)
      .box([1, 3], [2, 2], [1, 3], C.cream)
      .box([0, 4], [3, 4], [0, 0], C.rose)
      .set(2, 3, 2, C.pink).set(2, 4, 2, C.pink)
      .set(5, 1, 2, C.gold).set(5, 2, 2, C.gold);
    return g.entry({ id: 'cand-music-box', name: 'Music Box' });
  })(),

  // a snow globe: wooden base, glass dome, a tiny pine hidden inside
  (() => {
    const g = grid(5, 6, 5);
    g.cylinder('y', [2, 2], 2.2, [0, 1], wood)
      .ellipsoid([2, 3.6, 2], [2.2, 2.3, 2.2], (x, y, z) => (y >= 2 ? glass : null))
      .set(2, 2, 2, C.dgreen).set(2, 3, 2, C.dgreen).set(2, 4, 2, C.dgreen)
      .set(2, 5, 2, C.white);
    return g.entry({ id: 'cand-snow-globe', name: 'Snow Globe' });
  })(),

  // a slice of toast with a pat of butter melting in the middle
  flat('cand-toast', 'Toast', [
    '.ccc.',
    'ctttc',
    'ctyyc',
    'ctttc',
    'ccccc',
  ], 2, { c: C.crust, t: C.tan, y: butter }),

  // a cookie jar with a terracotta lid and a cookie on top
  (() => {
    const g = grid(6, 7, 6);
    g.cylinder('y', [2.5, 2.5], 2.6, [0, 4], C.cream)
      .cylinder('y', [2.5, 2.5], 2.6, [2, 2], (x, y, z) => (x >= 5 || z >= 5 ? C.brown : null))
      .cylinder('y', [2.5, 2.5], 2.7, [5, 5], C.terracotta)
      .box([2, 3], [6, 6], [2, 3], C.brown);
    return g.entry({ id: 'cand-cookie-jar', name: 'Cookie Jar' });
  })(),

  // a blue vase with one pink flower
  (() => {
    const g = grid(5, 7, 5);
    g.cylinder('y', [2, 2], 1.8, [0, 2], C.blue)
      .box([2, 2], [3, 3], [2, 2], C.blue)
      .box([2, 2], [4, 5], [2, 2], C.green).set(3, 4, 2, C.leaf)
      .box([1, 3], [6, 6], [2, 2], C.pink).box([2, 2], [6, 6], [1, 3], C.pink).set(2, 6, 2, C.yellow);
    return g.entry({ id: 'cand-vase', name: 'Flower Vase' });
  })(),

  // a wedge of cheese with holes on its faces
  (() => {
    const g = grid(6, 4, 5);
    g.box([0, 5], [0, 3], [0, 4], (x, y) => (y <= 3 - Math.floor(x * 0.65) ? C.yellow : null))
      .clear(1, 1, 4).clear(3, 0, 4).clear(0, 2, 2).set(5, 0, 4, C.yellow);
    return g.entry({ id: 'cand-cheese', name: 'Cheese' });
  })(),

  // a cherry pie with a lattice crust
  (() => {
    const g = grid(6, 3, 6);
    g.cylinder('y', [2.5, 2.5], 2.8, [0, 0], C.terracotta)
      .cylinder('y', [2.5, 2.5], 2.6, [1, 1], C.red)
      .cylinder('y', [2.5, 2.5], 2.8, [1, 1], (x, y, z) => ((x - 2.5) ** 2 + (z - 2.5) ** 2 > 4.4 ? C.crust : null))
      .cylinder('y', [2.5, 2.5], 2.3, [2, 2], (x) => (x % 2 === 1 ? C.crust : null));
    return g.entry({ id: 'cand-cherry-pie', name: 'Cherry Pie' });
  })(),

  // a mailbox on a post, a letter peeking out, its red flag up
  (() => {
    const g = grid(5, 7, 5);
    g.box([1, 2], [0, 3], [2, 2], wood)
      .box([0, 3], [4, 6], [0, 3], C.blue)
      .box([1, 2], [5, 5], [4, 4], C.white)
      .box([4, 4], [5, 6], [1, 1], C.red).set(4, 6, 2, C.red);
    return g.entry({ id: 'cand-mailbox', name: 'Mailbox' });
  })(),

  // a matchbox with one match lying on top
  (() => {
    const g = grid(6, 3, 4);
    g.box([0, 4], [0, 1], [0, 3], C.cream)
      .box([0, 4], [0, 1], [0, 3], (x, y, z) => (z === 3 || x === 4 ? C.red : null))
      .box([1, 4], [2, 2], [1, 1], C.tan).set(5, 2, 1, C.red).set(5, 1, 1, C.tan);
    return g.entry({ id: 'cand-matchbox', name: 'Matchbox' });
  })(),

  // a silver spoon with a sugar cube in its bowl
  (() => {
    const g = grid(7, 3, 4);
    g.box([0, 4], [0, 0], [1, 1], tin)
      .box([4, 6], [0, 0], [0, 2], tin)
      .box([5, 6], [1, 2], [1, 2], C.white);
    return g.entry({ id: 'cand-sugar-spoon', name: 'Sugar & Spoon' });
  })(),

  // a boiled egg in a yellow cup with toast soldiers laid alongside
  (() => {
    const g = grid(7, 5, 5);
    g.cylinder('y', [1.5, 2], 1.7, [0, 1], C.yellow)
      .ellipsoid([1.5, 3, 2], [1.4, 1.7, 1.4], (x, y) => (y >= 2 ? C.cream : null))
      .set(1, 4, 2, C.orange).set(2, 4, 2, C.orange)
      .box([3, 6], [0, 0], [1, 1], C.crust).box([3, 6], [0, 0], [3, 3], C.crust);
    return g.entry({ id: 'cand-egg-soldiers', name: 'Egg & Soldiers' });
  })(),

  // a rubber stamp: red knob, wooden block, an inky foot
  (() => {
    const g = grid(4, 6, 4);
    g.box([0, 3], [0, 0], [0, 3], C.ink)
      .box([0, 3], [1, 1], [0, 3], wood)
      .box([1, 2], [2, 3], [1, 2], wood)
      .box([1, 2], [4, 5], [1, 2], C.red).box([0, 3], [4, 4], [1, 2], C.red);
    return g.entry({ id: 'cand-stamp', name: 'Rubber Stamp' });
  })(),

  // a spray bottle: teal body, a white label, a trigger head with a nozzle
  (() => {
    const g = grid(5, 7, 4);
    g.box([0, 2], [0, 4], [0, 2], C.teal)
      .box([0, 2], [2, 3], [2, 2], C.white)
      .set(1, 5, 1, C.white)
      .box([0, 3], [6, 6], [1, 1], C.white).set(4, 6, 1, C.ink)
      .set(3, 5, 1, C.white);
    return g.entry({ id: 'cand-spray-bottle', name: 'Spray Bottle' });
  })(),

  // a hot water bottle with a sleepy face and a white stopper
  flat('cand-hot-water-bottle', 'Hot Water Bottle', [
    '..n..',
    '.rrr.',
    'rerer',
    'rrrrr',
    'rrprr',
    '.rrr.',
  ], 2, { n: C.white, r: C.rose, e: C.ink, p: C.pink }),

  // a light bulb: yellow glass, a silver screw base
  (() => {
    const g = grid(4, 7, 4);
    g.cylinder('y', [1.5, 1.5], 1.2, [0, 0], C.ink)
      .cylinder('y', [1.5, 1.5], 1.2, [1, 2], tin)
      .ellipsoid([1.5, 4.6, 1.5], [1.9, 2.1, 1.9], (x, y) => (y >= 3 ? C.yellow : null))
      .set(2, 6, 2, C.white);
    return g.entry({ id: 'cand-light-bulb', name: 'Light Bulb' });
  })(),
];

// clue hiding tuned so each sits in the easy band (D ≈ 6.4), right after Steps and Heart
const TUNE = {"cand-milk-carton":{"fraction":0.35,"seed":6},"cand-jam-jar":{"fraction":0.05,"seed":3},"cand-sock":{"fraction":0.65,"seed":5},"cand-mitten":{"fraction":0.45,"seed":2},"cand-umbrella":{"fraction":0.35,"seed":7},"cand-paint-tin":{"fraction":0.15,"seed":5},"cand-toothbrush":{"fraction":0.15,"seed":4},"cand-soap":{"fraction":0.45,"seed":4},"cand-pencil":{"fraction":0.55,"seed":3},"cand-yarn":{"fraction":0.15,"seed":7},"cand-teddy":{"fraction":0.05,"seed":5},"cand-music-box":{"fraction":0.15,"seed":5},"cand-snow-globe":{"fraction":0.25,"seed":8},"cand-toast":{"fraction":0.65,"seed":7},"cand-cookie-jar":{"fraction":0.15,"seed":2},"cand-vase":{"fraction":0.05,"seed":7},"cand-cheese":{"fraction":0.45,"seed":4},"cand-cherry-pie":{"fraction":0.35,"seed":6},"cand-mailbox":{"fraction":0.25,"seed":5},"cand-matchbox":{"fraction":0.45,"seed":2},"cand-sugar-spoon":{"fraction":0.25,"seed":1},"cand-egg-soldiers":{"fraction":0.25,"seed":2},"cand-stamp":{"fraction":0.35,"seed":7},"cand-spray-bottle":{"fraction":0.35,"seed":7},"cand-hot-water-bottle":{"fraction":0.45,"seed":1},"cand-light-bulb":{"fraction":0.35,"seed":5},"cand-salt-pepper":{"fraction":0.45,"seed":6}};

export default list.map((e) => ({ ...e, ...TUNE[e.id] }));
