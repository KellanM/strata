// Page 3 · Temples & Lanterns: bamboo-grove animals, a hot-spring monkey, and
// festival-stall treats with faces. Kawaii rules (docs/voxel-study.md); faces
// look toward +z; paired features go through the pair*/kawaii helpers.
import { C, grid } from '../voxel.js';
import { INK, BLUSH, front, out, pair, pairFront, pairOut, kawaii, tint } from './kit.js';

const fur = 0xf8f5f0, black = 0x3b3644, bamboo = 0x7cc46a, rust = 0xd8693a, rustCream = 0xf6e3c8,
  legs = 0x5a3a35, shiba = 0xe9a05a, shibaCream = 0xf8ead2, golden = 0xdb9d50, fin = 0xb8763a,
  lantern = 0xe0565b, rib = 0xa93a45, glow = 0xffd86b, tongue = 0xf28aa0, steamer = 0xd9b77e,
  bao = 0xfbf3e6, monkey = 0xa8988a, monkeyFace = 0xf3a7a4, wood = 0x9a6a45, spring = 0x9fd8f0;

export default [
  // a panda: white head, black ears, drooping eye patches, black arms and legs
  (() => {
    const g = grid(7, 8, 6);
    g.ellipsoid([3, 1.8, 2.6], [2.6, 1.9, 2.1], fur)
      .ellipsoid([3, 5.0, 2.8], [3.0, 2.2, 2.3], fur);
    tint(g, (x, y) => y <= 3 && (y <= 1 || x <= 1 || x >= 5), black);
    pair(g, 2, 0, 4, black);
    pair(g, 1, 7, 2, black); pair(g, 1, 7, 3, black);
    for (const [x, y] of [[2, 5], [2, 4], [1, 4]]) pairFront(g, x, y, black);
    front(g, 3, 4, black);
    pairFront(g, 1, 3, BLUSH);
    g.set(4, 2, 5, bamboo).set(4, 3, 5, bamboo).set(4, 1, 5, bamboo).set(5, 3, 5, bamboo);
    return g.entry({ id: 'cand-p3-panda', name: 'Panda' });
  })(),

  // a red panda: rust fur, white face marks and ear tips, a ringed tail behind
  (() => {
    const g = grid(7, 8, 6);
    g.ellipsoid([3, 1.8, 2.6], [2.3, 1.8, 2.0], rust)
      .ellipsoid([3, 4.9, 3], [2.9, 2.1, 2.2], rust);
    tint(g, (x, y) => y <= 1, legs);
    pair(g, 2, 0, 4, legs);
    for (let x = 2; x <= 4; x++) for (let y = 3; y <= 4; y++) front(g, x, y, rustCream);
    pairFront(g, 1, 4, rustCream);
    pairFront(g, 2, 6, rustCream);
    out(g, 3, 4, INK);
    kawaii(g, 2, 5, { blush: 0 });
    pair(g, 1, 7, 3, rustCream); pair(g, 0, 7, 3, rust);
    g.box([5, 6], [1, 2], [0, 1], rust).box([5, 6], [3, 3], [0, 1], rustCream).box([5, 6], [4, 4], [0, 1], rust).box([5, 6], [5, 5], [0, 1], rustCream);
    return g.entry({ id: 'cand-p3-red-panda', name: 'Red Panda' });
  })(),

  // a shiba pup: pointed ears, cream muzzle and eyebrow dots, a curled tail
  (() => {
    const g = grid(7, 9, 6);
    g.ellipsoid([3, 5, 3], [3.0, 2.2, 2.2], shiba)
      .ellipsoid([3, 1.6, 2.6], [2.2, 1.8, 2.0], shiba);
    tint(g, (x, y, z) => y <= 3 && z >= 4, shibaCream);
    for (let x = 2; x <= 4; x++) for (let y = 3; y <= 4; y++) front(g, x, y, shibaCream);
    pair(g, 1, 7, 2, shiba); pair(g, 1, 7, 3, shiba); pair(g, 1, 8, 3, shiba);
    pairFront(g, 2, 6, shibaCream);
    out(g, 3, 4, INK);
    kawaii(g, 2, 5, { bx: 1, by: 4 });
    pair(g, 2, 0, 4, shibaCream);
    g.set(4, 2, 0, shiba).set(4, 3, 0, shiba).set(5, 3, 0, shiba).set(5, 2, 0, shibaCream);
    return g.entry({ id: 'cand-p3-shiba', name: 'Shiba Pup' });
  })(),

  // taiyaki: a fish-shaped cake, golden, an eye and a blush on each side
  (() => {
    const rows = [
      '..ffff..',
      'f.ggggg.',
      'ffgggggg',
      'ffgggggg',
      'f.ggggg.',
      '...ff...',
    ];
    const g = grid(8, 6, 3);
    rows.forEach((row, k) => [...row].forEach((ch, x) => {
      if (ch === 'g') for (let z = 0; z < 3; z++) g.set(x, 5 - k, z, golden);
      if (ch === 'f') g.set(x, 5 - k, 1, fin);
    }));
    g.set(6, 3, 0, INK).set(5, 2, 0, BLUSH).mirror('z');
    return g.entry({ id: 'cand-p3-taiyaki', name: 'Taiyaki' });
  })(),

  // a lantern ghost: a red paper lantern with a face and a tongue; peel it to
  // find the candle glowing inside
  (() => {
    const g = grid(7, 9, 7);
    g.cylinder('y', [3, 3], 1.5, [0, 0], black)
      .cylinder('y', [3, 3], 2.2, [1, 1], lantern)
      .cylinder('y', [3, 3], 2.9, [2, 2], rib)
      .cylinder('y', [3, 3], 2.9, [3, 4], lantern)
      .cylinder('y', [3, 3], 2.9, [5, 5], rib)
      .cylinder('y', [3, 3], 2.2, [6, 6], lantern)
      .cylinder('y', [3, 3], 1.5, [7, 7], black)
      .set(3, 8, 3, black)
      .cylinder('y', [3, 3], 1.5, [2, 5], 0)
      .set(3, 2, 3, glow).set(3, 3, 3, glow);
    kawaii(g, 2, 4, { by: 3 });
    out(g, 3, 3, tongue);
    g.set(3, 2, 6, tongue);
    return g.entry({ id: 'cand-p3-lantern-ghost', name: 'Lantern Ghost' });
  })(),

  // a bao bun with a face, sitting in a bamboo steamer
  (() => {
    const g = grid(7, 7, 7);
    g.cylinder('y', [3, 3], 3.3, [0, 1], steamer)
      .cylinder('y', [3, 3], 2.4, [1, 1], 0)
      .ellipsoid([3, 2.8, 3], [2.6, 1.9, 2.6], bao)
      .set(3, 5, 3, bao).set(3, 5, 2, bao);                       // the pleated twist on top
    kawaii(g, 2, 3, { bx: 1, by: 2 });
    return g.entry({ id: 'cand-p3-bao', name: 'Bao Bun' });
  })(),

  // a snow monkey soaking in a wooden tub, pink face, snow on its head
  (() => {
    const g = grid(7, 8, 7);
    g.cylinder('y', [3, 3], 3.3, [0, 2], wood)
      .cylinder('y', [3, 3], 2.3, [1, 2], 0)
      .cylinder('y', [3, 3], 2.3, [2, 2], spring)
      .ellipsoid([3, 2.6, 3], [1.8, 1.0, 1.5], monkey)
      .ellipsoid([3, 4.5, 3], [2.3, 1.9, 1.9], monkey);
    tint(g, (x, y) => y >= 6, C.white);
    g.set(2, 7, 3, C.white).set(3, 7, 3, C.white).set(3, 7, 2, C.white);
    for (let x = 2; x <= 4; x++) for (let y = 3; y <= 5; y++) front(g, x, y, monkeyFace);
    pair(g, 0, 4, 3, monkeyFace);
    kawaii(g, 2, 4, { blush: 0 });
    return g.entry({ id: 'cand-p3-snow-monkey', name: 'Snow Monkey' });
  })(),
];
