// Page 5 · Home & Morning: crafted objects, not characters - plants, a
// terrarium, a cuckoo clock, a tea set, a well-travelled rucksack.
//
// WHY THE BONSAI WORKS (level 'bonsai', the bar for this page):
// - Silhouette: asymmetric but balanced. Two canopy pads sit at different
//   heights on opposite sides of a zig-zag trunk; the outline never mirrors,
//   yet the mass settles over the pot's centre.
// - Layered masses: each pad is a flat, wide ellipsoid one or two voxels
//   tall, so the canopy reads as stacked layers, not a ball.
// - A trunk with character: it steps sideways twice on its way up and forks,
//   and it stays visible between the pads.
// - A grounded base: a wide, plain pot in a strong colour anchors the piece
//   and gives the eye a horizontal to read the lean against.
// - Limited palette with value contrast: two greens (light pad, dark pad),
//   one brown, one blue. Neighbouring masses never share a value.
// - Negative space: the gaps between pads and around the trunk are as
//   deliberate as the cubes; you can see sky through the tree.
// Every object on this page aims for the same: one strong base, 2-3 masses
// at different heights, a characterful connecting part, 3-5 colours with a
// job each, and holes that mean something. Hollow lanterns hide a warm glow
// that only peeling uncovers.
import { grid } from '../voxel.js';
import { INK, front, pair, quad, tint, onSurface, sheet } from './kit.js';

const terra = 0xc8704b, terraDark = 0xa85a3c, soil = 0x6b4a3a, wood = 0x8a5a3c, dwood = 0x5a3b30,
  sage = 0x8fbfa8, sageLight = 0xc4e3cf, tipPink = 0xe98aa6, aloe = 0x3f8a5b, aloeTip = 0x6fbf7a,
  lithops = 0xc9b6a0, bloom = 0xf6d365,
  potCream = 0xf3ead8, potBand = 0x5d8fa8, stem = 0x3f7a4f, leaf = 0x3f9a5f, leafLight = 0x6fc47a, leafMid = 0x2f7f50,
  brass = 0x8a6a3a, glass = 0xd8eef0, fern = 0x8cd65a, moss = 0x6fae5a, mossDark = 0x4f8f4a, capRed = 0xe0565b, cream = 0xf6efe4,
  vase = 0x3f5f9f, vaseBand = 0xf3ead8, branch = 0x5a3b30, sakura = 0xf6b6c8, sakuraDeep = 0xe98aa6,
  tray = 0xb07a50, celadon = 0x8fc1a9, celadonDark = 0x6fa58c, cup = 0xfbf8f2, cupBand = 0x5b7fc6, tea = 0x9cc65a,
  clock = 0x8a5a3c, roof = 0x5a3b30, face = 0xf6efe4, bird = 0xf6d365, beak = 0xf08a3c, chain = 0x5d6670,
  cone = 0x7a4a2a, gold = 0xe9b949, leafCarve = 0x5fae6e,
  canvas = 0xc98a4b, canvasDark = 0xa96f3a, flap = 0x6f7f4a, leather = 0x6b4a3a, roll = 0x5b7fc6, rollBand = 0x3a3442,
  patch = 0xe0565b, tin = 0xc9d1d9, buckle = 0xb59a6a;

export default [
  // a long terracotta trough on two feet: a pink-tipped echeveria rosette, a
  // spiky aloe and a tiny flowering pebble plant
  (() => {
    const g = grid(9, 6, 5);
    g.box([0, 8], [0, 1], [1, 3], terra).box([2, 6], [0, 0], [1, 3], 0)       // feet at each end
      .box([1, 7], [1, 1], [2, 2], soil)
      .box([0, 8], [1, 1], [1, 1], terraDark).box([0, 8], [1, 1], [3, 3], terraDark);  // the rim
    for (let dx = -2; dx <= 2; dx++) for (let dz = -2; dz <= 2; dz++) {
      const r2 = dx * dx + dz * dz;
      if (r2 <= 4.84) g.set(2 + dx, 2, 2 + dz, r2 === 4 ? tipPink : sage);   // the rosette, tips blushing
      if (r2 <= 1) g.set(2 + dx, 3, 2 + dz, r2 === 0 ? sageLight : sage);
    }
    g.box([5, 7], [2, 2], [2, 2], aloe).box([6, 6], [2, 2], [1, 3], aloe)    // the aloe: a plus that climbs
      .box([6, 6], [3, 4], [2, 2], aloe).set(7, 3, 2, aloe).set(6, 3, 1, aloe).set(6, 3, 3, aloe)
      .set(5, 4, 2, aloeTip).set(6, 5, 2, aloeTip).set(7, 4, 2, aloeTip).set(6, 4, 1, aloeTip);
    g.set(8, 2, 2, lithops).set(8, 3, 2, bloom);
    return g.entry({ id: 'cand-p5-succulent-trough', name: 'Succulent Trough' });
  })(),

  // a monstera in a cream pot: three split leaves on bent stems, fanned out
  // to the front, the right and up at the back
  (() => {
    const g = grid(7, 9, 5);
    g.cylinder('y', [3, 2], 2.3, [0, 2], potCream).cylinder('y', [3, 2], 2.3, [1, 1], potBand)
      .cylinder('y', [3, 2], 1.3, [2, 2], soil);
    g.set(3, 3, 2, stem).set(3, 4, 2, stem);
    // front leaf, facing the viewer, slits cut in from its edges
    g.set(3, 4, 3, stem);
    sheet(g, ['.LLL.', 'LL.LL', 'L.LLL', '.LL..'], [4, 4], { L: leaf }, 1, 3);
    // right leaf, facing +x
    g.set(4, 5, 2, stem).set(5, 5, 2, stem);
    for (const [y, row] of [[7, '.LLL.'], [6, 'LL.LL'], [5, 'LLL.L'], [4, '..LL.']]) [...row].forEach((ch, k) => { if (ch === 'L') g.set(6, y, k, leafLight); });
    // top leaf at the back, facing the viewer
    g.set(3, 5, 2, stem).set(3, 5, 1, stem).set(3, 6, 1, stem);
    sheet(g, ['.LLLL', 'LL.LL', 'LLL.L', '..L..'], [0, 0], { L: leafMid }, 1, 5);
    return g.entry({ id: 'cand-p5-monstera', name: 'Monstera' });
  })(),

  // a little greenhouse terrarium: brass frame, glass on two walls, open on
  // the two you look through; a moss mound, a fern and a red toadstool inside
  (() => {
    const g = grid(5, 7, 5);
    g.box([0, 4], [0, 0], [0, 4], wood);
    for (const [x, z] of [[0, 0], [4, 0], [0, 4], [4, 4]]) g.box([x, x], [1, 3], [z, z], brass);
    g.box([1, 3], [1, 3], [0, 0], glass).box([0, 0], [1, 3], [1, 3], glass);
    g.box([1, 3], [1, 1], [1, 3], moss).box([1, 2], [2, 2], [1, 2], mossDark).set(1, 3, 1, mossDark).set(2, 2, 3, moss);
    g.set(3, 2, 3, cream).set(3, 3, 3, capRed).set(2, 3, 1, fern).set(2, 4, 1, fern).set(1, 3, 2, fern).set(3, 3, 1, fern);
    // the gabled glass roof, brass along its edges and ridge
    g.box([0, 4], [4, 4], [0, 4], (x, y, z) => (z === 0 || z === 4 ? brass : glass))
      .box([0, 4], [5, 5], [1, 3], (x, y, z) => ((x === 0 || x === 4) && z !== 2 ? brass : glass))
      .box([0, 4], [6, 6], [2, 2], brass);
    return g.entry({ id: 'cand-p5-terrarium', name: 'Moss Terrarium' });
  })(),

  // a sprig of cherry blossom in an indigo bottle vase: one branch sweeping
  // out to the right, two blossom clusters and a bud
  (() => {
    const g = grid(7, 9, 5);
    g.cylinder('y', [2, 2], 1.5, [0, 2], vase).cylinder('y', [2, 2], 1.5, [1, 1], vaseBand)
      .cylinder('y', [2, 2], 1.1, [3, 3], vase).set(2, 4, 2, vase);
    g.set(2, 5, 2, branch).set(2, 6, 2, branch).set(3, 6, 2, branch).set(4, 6, 2, branch)
      .set(4, 7, 2, branch).set(5, 7, 2, branch);
    g.ellipsoid([5.4, 6.6, 2], [1.4, 1.2, 1.4], sakura).set(5, 7, 2, branch);
    g.ellipsoid([1.6, 7.6, 2], [1.2, 1.0, 1.2], sakura);
    g.set(6, 6, 2, sakuraDeep).set(5, 8, 2, sakuraDeep).set(1, 8, 2, sakuraDeep).set(6, 7, 3, sakuraDeep);
    return g.entry({ id: 'cand-p5-sakura-vase', name: 'Sakura Sprig' });
  })(),

  // a tea set on a wooden tray: a celadon kyusu with its spout to the right
  // and its stick handle toward you, between two little cups of green tea
  (() => {
    const g = grid(9, 5, 7);
    g.box([0, 8], [0, 0], [0, 6], tray);
    for (const [x, z] of [[0, 0], [8, 0], [0, 6], [8, 6]]) g.clear(x, 0, z);
    g.ellipsoid([4, 2, 2], [2.3, 1.4, 2.3], celadon).box([3, 5], [3, 3], [1, 3], celadonDark).set(4, 4, 2, celadonDark);
    g.set(7, 2, 2, celadon).set(7, 3, 2, celadon).set(8, 3, 2, celadon);      // spout
    g.set(4, 2, 5, wood).set(4, 2, 6, wood);                                   // the kyusu's stick handle
    for (const cx of [1, 7]) {
      g.box([cx - 1, cx + 1], [1, 2], [4, 6], cup).box([cx - 1, cx + 1], [1, 1], [4, 6], cupBand).set(cx, 2, 5, tea);
    }
    return g.entry({ id: 'cand-p5-tea-set', name: 'Tea Set' });
  })(),

  // a cuckoo clock: a steep chalet roof, a cream face, the bird out of its
  // door, two pine-cone weights on chains and a pendulum between them
  (() => {
    const g = grid(7, 10, 5);
    g.box([1, 5], [3, 6], [0, 2], clock);
    g.box([0, 6], [7, 7], [0, 2], roof).box([1, 5], [8, 8], [0, 2], roof).box([2, 4], [9, 9], [0, 2], roof);
    g.box([2, 4], [3, 5], [3, 3], face).set(3, 4, 3, dwood).set(3, 5, 3, dwood).set(4, 4, 3, dwood);   // ten past three-ish
    g.set(3, 6, 2, dwood).set(3, 6, 3, bird).set(3, 6, 4, beak);              // the bird, out of its little door
    pair(g, 1, 2, 1, chain); pair(g, 1, 1, 1, cone); pair(g, 1, 0, 1, cone);  // weights
    g.set(3, 2, 1, wood).set(3, 1, 1, gold);                                  // pendulum
    return g.entry({ id: 'cand-p5-cuckoo-clock', name: 'Cuckoo Clock' });
  })(),

  // a well-travelled rucksack: canvas body, an olive flap with two buckled
  // straps, a blue bedroll on top, side pockets, a red patch, a tin mug
  (() => {
    const g = grid(7, 8, 6);
    g.box([1, 5], [0, 5], [0, 3], canvas).box([1, 5], [0, 0], [0, 3], leather);
    quad(g, 1, 5, 0, 0); g.set(1, 5, 3, 0).set(5, 5, 3, 0);                   // rounded shoulders
    g.box([1, 5], [5, 5], [1, 3], flap).box([1, 5], [3, 4], [4, 4], flap);    // flap over the top and down the front
    g.box([2, 4], [1, 2], [4, 4], canvasDark).set(5, 4, 4, patch);            // front pocket; a sewn patch on the flap
    for (const x of [2, 4]) g.set(x, 3, 4, leather).set(x, 2, 4, leather).set(x, 1, 4, leather).set(x, 2, 5, buckle);
    g.box([0, 6], [6, 7], [1, 2], roll).box([2, 2], [6, 7], [1, 2], rollBand).box([4, 4], [6, 7], [1, 2], rollBand);
    for (const x of [0, 6]) g.box([x, x], [1, 2], [1, 2], canvasDark);         // side pockets
    g.set(6, 3, 2, tin).set(6, 4, 2, tin);                                     // tin mug hung on the right
    return g.entry({ id: 'cand-p5-rucksack', name: 'Rucksack' });
  })(),
];
