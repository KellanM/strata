// Page 10 · I The Waymarks: the old road out of the valley, marked by the
// people who walked it first. A candidate to replace Teatime as chapter II,
// the first steps away from home, so everything here is small and plain:
// a signpost, a map half unrolled, a compass, boots, a gate left open, a
// plank bridge, a lamp post for late walkers; the road's slow travellers (a
// pack donkey, a tortoise with its bedroll); and two shrines of the road, a
// wayside shrine and the first cairn, where every walker adds a stone.
// Sky: a cool periwinkle morning, so warm stone, wood, leather and brass
// stand out against it (a gold sky swallowed them).
// Each object carries the clue setting (fraction, seed) that puts it where
// it would sit in a chapter II ramp, so the card's D is its chapter II D.
import { grid } from '../voxel.js';
import { INK, front, out, pair, pairFront, pairZ, quad, tint, onSurface, sheet, plan } from './kit.js';

const grass = 0x7cbf5f, grassDk = 0x5c9e4f, stone = 0xb3a99a, stoneLt = 0xd3cabb, stoneDk = 0x8a8276,
  post = 0x8a5a3c, postDk = 0x6b4a3a, boardA = 0xf1e3c4, boardB = 0xe2b25a, tip = 0xd9573a,
  parchment = 0xf1e2bf, river = 0x5ea8dc, route = 0xe0565b, forest = 0x6aa257, rod = 0x8a5a3c,
  brass = 0xe0b04a, brassDk = 0xb07a3a, face = 0xf6efe4, red = 0xe0565b, navy = 0x2f4a7a, gold = 0xf6d365,
  sole = 0x4a3a32, leather = 0xa8693c, leatherDk = 0x7a4a2c, wool = 0xf1e3c4,
  path = 0xe6cf9c, wood = 0x9a6a44, iron = 0x4a4550, plank = 0xc08a52, water = 0x5ea8dc, foam = 0xdff1fa,
  donkey = 0xa9a4ad, donkeyDk = 0x6f6a76, muzzle = 0xeee8e2, blanket = 0xd9573a, wicker = 0xd2a35e, roll = 0x5b8fd6,
  shell = 0x9a7a44, shellLt = 0xc4a060, skin = 0xa3b47a, glow = 0xf6d365, glowHot = 0xf2a03d,
  shrineStone = 0xe2d6bd, shrineDk = 0xbfae90, roof = 0xc0504a, roofDk = 0x9a3e3a, niche = 0x5b8fd6, candle = 0xf6efe4, flower = 0xf4a3b5;
const RIBBONS = [0xe0565b, 0xf6d365, 0x5b8fd6, 0x86c77f, 0xf4a3b5];

export default [
  // a signpost at the edge of the village: one arm points home, the other
  // points on, its tip painted red; a grass tuft and a stone at its foot
  (() => {
    const g = grid(8, 8, 3);
    g.box([2, 4], [0, 0], [0, 2], grass).set(2, 0, 0, 0).set(4, 0, 2, 0);
    g.set(1, 0, 1, stoneDk).set(5, 0, 1, grassDk);
    g.box([3, 3], [0, 6], [1, 1], post).set(3, 7, 1, postDk);
    sheet(g, ['AAA.', 'AAAa', 'AAA.'], [1, 1], { A: boardA, a: tip }, 4, 5);       // pointing on
    sheet(g, ['.BB', 'bBB', '.BB'], [1, 1], { B: boardB, b: tip }, 0, 2);          // pointing home
    return g.entry({ id: 'cand-p10-signpost', name: 'Signpost', fraction: 0.3, seed: 15,
      story: 'One arm points home. The other points at everything else.' });
  })(),

  // a trail map, half unrolled: the far end still curled round its rod, a
  // blue river, two green woods and a red dotted way to a red cross
  (() => {
    const g = grid(8, 3, 6);
    plan(g, [
      '........',
      '........',
      '.pfpwpR.',
      '.pppwrp.',
      '.fprwpp.',
      '.rppwpf.',
    ], 0, { p: parchment, w: river, f: forest, r: route, R: red });
    g.box([1, 6], [0, 1], [0, 1], parchment).box([0, 0], [1, 1], [0, 1], rod).box([7, 7], [1, 1], [0, 1], rod);
    g.box([1, 6], [2, 2], [0, 0], parchment);                                   // the curl
    return g.entry({ id: 'cand-p10-trail-map', name: 'Trail Map', fraction: 0.25, seed: 15,
      story: 'Half of it is still rolled up. That half is yours.' });
  })(),

  // a pocket compass lying open: the brass case with its red needle, the
  // lid standing up behind with a gold star painted inside
  (() => {
    const g = grid(7, 7, 8);
    g.cylinder('y', [3, 4], 3.2, [0, 0], brassDk);
    g.cylinder('y', [3, 4], 3.2, [1, 1], (x, y, z) => (Math.hypot(x - 3, z - 4) > 2.3 ? brass : face));
    g.set(3, 1, 2, red).set(3, 1, 3, red).set(3, 1, 4, brassDk).set(3, 1, 5, navy).set(3, 1, 6, navy);
    pair(g, 1, 1, 4, INK);                                                       // east and west
    g.cylinder('z', [3, 3], 3.2, [0, 0], (x, y) => (Math.hypot(x - 3, y - 3) > 2.3 ? brass : navy));
    for (const [x, y] of [[3, 3], [2, 3], [4, 3], [3, 2], [3, 4]]) g.set(x, y, 0, gold);   // the star
    return g.entry({ id: 'cand-p10-compass', name: 'Pocket Compass', fraction: 0.25, seed: 16,
      story: 'It always knows north. Where you go from there is up to you.' });
  })(),

  // walking boots, one a step ahead of the other: dark soles, red laces up
  // the front, a cream wool sock turned over at the top
  (() => {
    const g = grid(7, 5, 6);
    const boot = (x0, z0) => {
      g.box([x0, x0 + 2], [0, 0], [z0, z0 + 4], sole);
      g.box([x0, x0 + 2], [1, 1], [z0, z0 + 3], leather).set(x0 + 1, 1, z0 + 4, leatherDk);
      g.box([x0, x0 + 2], [2, 3], [z0, z0 + 2], leather).box([x0, x0 + 2], [4, 4], [z0, z0 + 2], wool);
      g.clear(x0, 4, z0).clear(x0 + 2, 4, z0);
      g.set(x0 + 1, 1, z0 + 3, red).set(x0 + 1, 2, z0 + 2, red).set(x0 + 1, 3, z0 + 2, red);
    };
    boot(0, 0); boot(4, 1);
    g.set(3, 4, 1, red).set(3, 4, 2, red);                                     // laces knotted together
    return g.entry({ id: 'cand-p10-boots', name: 'Walking Boots', fraction: 0.45, seed: 16,
      story: 'Broken in on the first mile, and ready for all the rest.' });
  })(),

  // a field gate left open: two stone gateposts, the wooden gate swung
  // wide on its hinge toward you, a sandy path running through
  (() => {
    const g = grid(8, 5, 6);
    g.box([2, 5], [0, 0], [0, 5], path);
    g.box([0, 1], [0, 3], [0, 1], stone).box([6, 7], [0, 3], [0, 1], stone);
    g.box([0, 1], [4, 4], [0, 1], stoneLt).box([6, 7], [4, 4], [0, 1], stoneLt);
    g.box([2, 2], [1, 1], [1, 5], wood).box([2, 2], [3, 3], [1, 5], wood);
    for (const z of [1, 3, 5]) g.set(2, 2, z, wood);
    g.set(5, 2, 1, iron);                                                        // the latch, waiting
    g.box([0, 1], [0, 0], [2, 2], grass).set(0, 0, 3, grassDk).box([6, 7], [0, 0], [2, 2], grass).set(7, 0, 3, grass).set(7, 0, 4, grassDk);
    return g.entry({ id: 'cand-p10-open-gate', name: 'Open Gate', fraction: 0.5, seed: 2,
      story: 'Someone left the gate open, as if they knew you were coming.' });
  })(),

  // a plank footbridge over a brook: grassy banks, a little step up onto
  // the span, a handrail on each side
  (() => {
    const g = grid(8, 5, 5);
    g.box([0, 1], [0, 0], [0, 4], grass).box([6, 7], [0, 0], [0, 4], grass);
    g.box([2, 5], [0, 0], [0, 4], (x, y, z) => ((x * 3 + z) % 5 === 0 ? foam : water));
    g.box([0, 1], [1, 1], [1, 3], plank).box([6, 7], [1, 1], [1, 3], plank);
    g.box([2, 5], [2, 2], [1, 3], plank);
    for (const x of [2, 5]) for (const z of [1, 3]) g.set(x, 1, z, wood).set(x, 3, z, wood);
    g.box([2, 5], [4, 4], [1, 1], wood).box([2, 5], [4, 4], [3, 3], wood);
    g.set(0, 0, 4, grassDk).set(7, 0, 0, grassDk);
    return g.entry({ id: 'cand-p10-footbridge', name: 'Footbridge', fraction: 0.4, seed: 7,
      story: 'Three planks and a handrail: the whole width of the known world.' });
  })(),

  // a lamp post where the last lane ends: a stone foot, an iron post with a
  // collar, and a lantern on top, lit for whoever is walking late
  (() => {
    const g = grid(5, 9, 5);
    g.box([1, 3], [0, 0], [1, 3], stoneDk).box([0, 4], [0, 0], [2, 2], stoneDk).box([2, 2], [0, 0], [0, 4], stoneDk);
    g.set(0, 0, 3, grass).set(4, 0, 1, grass).set(3, 0, 4, grassDk);
    g.box([2, 2], [1, 4], [2, 2], iron);
    g.box([1, 3], [1, 1], [2, 2], iron).box([2, 2], [1, 1], [1, 3], iron);         // its flared foot
    g.box([1, 3], [5, 5], [1, 3], iron);                                         // the lantern's base,
    g.box([1, 3], [6, 7], [1, 3], glow);                                          // lit glass,
    g.box([1, 3], [8, 8], [2, 2], iron).box([2, 2], [8, 8], [1, 3], iron);         // and its cap
    return g.entry({ id: 'cand-p10-lamp-post', name: 'Lamp Post', fraction: 0.4, seed: 1,
      story: 'The last lamp before the dark woods, kept lit for late walkers.' });
  })(),

  // a pack donkey: long ears, a pale nose, two wicker panniers, a red
  // blanket and a blue bedroll strapped on top
  (() => {
    const g = grid(9, 8, 5);
    for (const x of [2, 5]) for (const z of [1, 3]) g.set(x, 0, z, donkeyDk).set(x, 1, z, donkey);
    g.box([1, 6], [2, 3], [1, 3], donkey);
    g.set(6, 4, 2, donkey).set(6, 5, 2, donkeyDk);
    g.box([7, 8], [4, 5], [1, 3], donkey).box([8, 8], [4, 4], [1, 3], muzzle);
    pairZ(g, 7, 5, 1, INK);
    pairZ(g, 7, 6, 1, donkey); pairZ(g, 7, 7, 1, donkeyDk);                       // the long ears
    g.set(0, 3, 2, donkey).set(0, 2, 2, donkeyDk);                              // tail
    g.box([2, 4], [2, 3], [0, 0], wicker).box([2, 4], [2, 3], [4, 4], wicker);  // panniers
    g.box([2, 5], [4, 4], [1, 3], blanket).box([3, 4], [5, 5], [1, 3], roll);
    return g.entry({ id: 'cand-p10-pack-donkey', name: 'Pack Donkey', fraction: 0.65, seed: 9,
      story: 'It knows the road better than the map does, and says nothing.' });
  })(),

  // a tortoise on the road with everything it owns: a bedroll tied on its
  // shell with a red strap, an old face and an older walk
  (() => {
    const g = grid(8, 5, 5);
    g.ellipsoid([3, 2.0, 2], [2.6, 1.6, 2.3], shell);
    tint(g, (x, y, z) => onSurface(g, x, y, z) && y >= 2 && x % 2 === 1 && z % 2 === 0, shellLt);
    for (const x of [2, 4]) for (const z of [1, 3]) g.set(x, 0, z, skin);
    g.box([6, 7], [1, 2], [1, 3], skin).clear(7, 1, 1).clear(7, 1, 3);
    pairZ(g, 7, 2, 1, INK);
    g.set(0, 1, 2, skin);
    g.box([2, 4], [4, 4], [1, 3], roll).box([3, 3], [4, 4], [1, 3], red);
    return g.entry({ id: 'cand-p10-tortoise', name: 'Wandering Tortoise', fraction: 0.6, seed: 14,
      story: 'The slowest traveller on the road has been walking the longest.' });
  })(),

  // shrine: a wayside shrine on a carved column, a little roof over a blue
  // niche where a candle is always burning, pink flowers left on the step
  (() => {
    const g = grid(5, 10, 5);
    g.box([0, 4], [0, 0], [0, 4], shrineDk).set(0, 0, 0, 0).set(4, 0, 0, 0).set(0, 0, 4, 0).set(4, 0, 4, 0);
    g.box([1, 3], [1, 1], [1, 3], shrineDk);
    for (let y = 2; y <= 4; y++) g.box([1, 3], [y, y], [2, 2], shrineStone).box([2, 2], [y, y], [1, 3], shrineStone);
    g.box([1, 3], [5, 7], [1, 3], shrineStone);
    g.clear(2, 5, 3).clear(2, 6, 3).clear(2, 5, 2).clear(2, 6, 2);
    g.set(2, 5, 1, niche).set(2, 6, 1, niche).set(2, 5, 2, candle).set(2, 6, 2, glow);
    g.box([0, 4], [8, 8], [1, 3], roof).box([1, 3], [9, 9], [2, 2], roofDk);
    pair(g, 1, 1, 4, flower);
    return g.entry({ id: 'cand-p10-wayside-shrine', name: 'Wayside Shrine', fraction: 0.85, seed: 4,
      story: 'A candle in a niche, never once found burned out.' });
  })(),

  // shrine: the first cairn, where every walker adds a stone: a broad stack
  // of river stones, a band of ribbons tied round it, a lamp in a niche
  (() => {
    const g = grid(7, 9, 7);
    const layers = [[3.2, 3, 3, stoneDk], [3.0, 3, 3, stone], [2.7, 3.3, 2.8, stoneLt], [2.4, 2.8, 3.2, stone],
      [2.1, 3, 3, stoneDk], [1.6, 3.2, 2.9, stoneLt], [1.2, 3, 3, stone], [0.6, 3, 3, stoneDk]];
    layers.forEach(([r, cx, cz, c], y) => g.cylinder('y', [cx, cz], r, [y, y], c));
    let k = 0;
    tint(g, (x, y, z) => y === 4 && onSurface(g, x, y, z), () => RIBBONS[k++ % RIBBONS.length]);
    g.clear(3, 1, 6).clear(3, 1, 5).clear(3, 2, 5).clear(3, 2, 6);
    g.set(3, 1, 4, glowHot).set(3, 2, 4, glow);
    g.set(3, 8, 3, stoneLt);
    return g.entry({ id: 'cand-p10-first-cairn', name: 'The First Cairn', fraction: 0.95, seed: 16,
      story: 'Every traveller adds one stone. Nobody remembers who laid the first.' });
  })(),
];
