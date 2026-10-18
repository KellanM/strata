// Page 4 · Sky & Night: night-sky and snowy-peak babies in bright pastels that
// read on the dark Starfall sky: a unicorn, a cat napping in a crescent moon,
// a red-nosed reindeer calf, a bear in a space helmet, two mountain cubs.
// Kawaii rules (docs/voxel-study.md); faces look toward +z; paired features
// go through the pair*/kawaii helpers so they always match.
import { C, grid } from '../voxel.js';
import { INK, BLUSH, front, frontZ, out, pair, pairFront, pairOut, kawaii, tint } from './kit.js';

const uni = 0xfbf8f2, hoof = 0xc9b6e4, uniHorn = 0xf6d365, mane1 = 0xf4a3c8, mane2 = 0xc9b6f4, mane3 = 0x9fe0d0,
  moon = 0xf8d86a, cat = 0xc9c0e0, catEar = 0xf5b3c0, deer = 0xb57d50, deerCream = 0xf3dfc0, antler = 0xe9cf9a,
  rudolph = 0xe8414b, bell = 0xe9b949, suit = 0xf1f3f9, helmet = 0xdfe6f2, pack = 0x9aa3ad, bear = 0xc08a5a,
  bearMuzzle = 0xf0d8b4, antenna = 0xe0565b, leopard = 0xeeeef2, rosette = 0x8f8ca0, yeti = 0xf6f7fb,
  yetiFace = 0x9fb6d8, yetiHorn = 0xf3e2b0, yetiFoot = 0x7f97c0;

export default [
  // a unicorn foal: a gold horn, a pastel rainbow mane and tail, lilac hooves
  (() => {
    const g = grid(7, 9, 8);
    g.ellipsoid([3, 2.6, 3.0], [2.0, 1.3, 2.6], uni)
      .ellipsoid([3, 5.0, 4.6], [2.4, 1.8, 1.8], uni);
    for (const x of [2, 4]) for (const z of [2, 4]) { g.set(x, 1, z, uni); g.set(x, 0, z, hoof); }
    tint(g, (x, y, z) => z <= 3 && y >= 5, (x, y) => (y >= 6 ? mane1 : mane2));
    g.set(3, 4, 2, mane2).set(3, 3, 1, mane3);
    kawaii(g, 2, 5, { bx: 1, by: 4 });
    g.set(3, 7, 5, uniHorn).set(3, 8, 5, uniHorn);
    pair(g, 2, 7, 4, uni);                                         // ears
    g.set(3, 3, 0, mane1).set(3, 2, 0, mane2).set(3, 1, 0, mane3);   // rainbow tail
    return g.entry({ id: 'cand-p4-unicorn', name: 'Unicorn' });
  })(),

  // a cat napping in the lap of a crescent moon, tail hanging over the edge
  (() => {
    const g = grid(9, 9, 4);
    for (let y = 0; y < 9; y++) for (let x = 0; x < 9; x++) {
      const outer = (x - 4) ** 2 + (y - 5) ** 2 <= 4.4 ** 2;
      const inner = (x - 4) ** 2 + (y - 7.2) ** 2 <= 4.2 ** 2;
      if (outer && !inner) { g.set(x, y, 1, moon); g.set(x, y, 2, moon); }
    }
    g.ellipsoid([4, 3.6, 1.8], [1.8, 1.2, 1.3], cat)
      .ellipsoid([4, 5.4, 2.0], [2.3, 1.5, 1.5], cat);
    pair(g, 2, 7, 2, cat); pair(g, 2, 7, 1, cat);
    kawaii(g, 3, 5, { bx: 2, by: 4 });
    front(g, 4, 4, catEar);
    g.set(6, 2, 3, cat).set(6, 1, 3, cat).set(6, 3, 3, cat);        // tail over the edge
    return g.entry({ id: 'cand-p4-moon-cat', name: 'Cat on the Moon' });
  })(),

  // a reindeer calf: branching antlers, a shiny red nose, a gold bell
  (() => {
    const g = grid(9, 9, 6);
    g.ellipsoid([4, 1.6, 2.6], [2.2, 1.6, 1.9], deer)
      .ellipsoid([4, 4.6, 3.0], [2.6, 1.9, 2.0], deer);
    for (let x = 3; x <= 5; x++) for (let y = 3; y <= 4; y++) front(g, x, y, deerCream);
    out(g, 4, 4, rudolph);
    kawaii(g, 3, 5, { bx: 2, by: 4 });
    pair(g, 1, 5, 3, deer); pair(g, 1, 5, 2, deer);                 // ears out sideways
    for (const [x, y] of [[3, 7], [3, 8], [2, 8], [1, 8], [1, 7]]) pair(g, x, y, 3, antler);   // branching antlers
    out(g, 4, 2, bell);
    pair(g, 3, 0, 4, deer);
    g.set(4, 2, 0, deerCream);
    return g.entry({ id: 'cand-p4-reindeer', name: 'Reindeer Calf' });
  })(),

  // a bear cub in a spacesuit: the helmet open at the front, an antenna on top
  (() => {
    const g = grid(7, 9, 7);
    g.ellipsoid([3, 1.8, 3], [2.4, 1.8, 2.0], suit)
      .ellipsoid([3, 5.0, 3], [3.1, 2.5, 2.6], helmet);
    tint(g, (x, y, z) => z >= 3 && y >= 3 && y <= 6 && x >= 1 && x <= 5, () => 0);
    g.ellipsoid([3, 4.8, 3], [2.1, 1.7, 1.9], bear);
    for (let x = 2; x <= 4; x++) front(g, x, 4, bearMuzzle);
    out(g, 3, 4, INK);
    kawaii(g, 2, 5, { bx: 1, by: 4 });
    pairFront(g, 1, 6, bear);
    g.set(3, 8, 3, antenna);
    g.box([2, 4], [1, 3], [1, 1], pack);
    pair(g, 2, 0, 4, suit);
    out(g, 4, 2, antenna);                                         // a patch on the chest
    return g.entry({ id: 'cand-p4-astro-bear', name: 'Astro Bear' });
  })(),

  // a snow leopard cub: pale and spotted, its huge fluffy tail wrapped round
  // its front paws
  (() => {
    const g = grid(7, 8, 7);
    g.ellipsoid([3, 1.8, 2.8], [2.3, 1.8, 2.0], leopard)
      .ellipsoid([3, 4.9, 3.0], [3.0, 2.1, 2.2], leopard);
    out(g, 3, 4, 0xe58a9a);
    kawaii(g, 2, 5, { bx: 1, by: 4 });
    front(g, 3, 6, rosette); pairFront(g, 1, 6, rosette);
    pair(g, 1, 7, 2, rosette); pair(g, 1, 7, 3, leopard);
    pairFront(g, 0, 4, rosette);
    pair(g, 2, 0, 4, leopard);
    for (const [x, z] of [[5, 2], [6, 2], [6, 3], [6, 4], [6, 5], [5, 5], [4, 5], [3, 5], [2, 5]])
      for (let y = 0; y <= 1; y++) g.set(x, y, z, (x + z) % 3 === 0 ? rosette : leopard);
    g.set(1, 0, 5, rosette).set(1, 1, 5, rosette);                 // the dark tail tip
    return g.entry({ id: 'cand-p4-snow-leopard', name: 'Snow Leopard Cub' });
  })(),

  // a baby yeti: shaggy white, a blue face, little horns, big blue feet
  (() => {
    const g = grid(7, 9, 7);
    g.ellipsoid([3, 2.2, 3], [2.6, 2.1, 2.2], yeti)
      .ellipsoid([3, 5.2, 3.2], [2.9, 2.0, 2.2], yeti);
    for (let x = 1; x <= 5; x++) for (let y = 3; y <= 5; y++) if (!((x === 1 || x === 5) && y === 3)) front(g, x, y, yetiFace);
    kawaii(g, 2, 5, { bx: 1, by: 4 });
    front(g, 3, 4, INK); front(g, 3, 3, 0xf5f0f5);                 // a small open mouth, one fang
    for (let x = 1; x <= 5; x++) out(g, x, 6, yeti);               // a shaggy fringe
    pair(g, 1, 7, 3, yetiHorn); pair(g, 1, 8, 3, yetiHorn);
    pair(g, 0, 3, 3, yeti); pair(g, 0, 4, 3, yeti);                 // arms up in a wave
    pair(g, 1, 0, 4, yetiFoot); pair(g, 2, 0, 4, yetiFoot); pair(g, 1, 0, 5, yetiFoot); pair(g, 2, 0, 5, yetiFoot);
    return g.entry({ id: 'cand-p4-baby-yeti', name: 'Baby Yeti' });
  })(),
];
