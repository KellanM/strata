// Page 3 · Sky & Night: night-time babies in bright pastels that read on the
// dark Starfall sky. Kawaii rules (docs/voxel-study.md); faces look toward +z;
// paired wings, ears and horns go through the pair*/kawaii helpers.
import { C, grid } from '../voxel.js';
import { INK, BLUSH, front, frontZ, out, pair, pairFront, pairOut, kawaii, tint } from './kit.js';

const batBody = 0xc6b2ec, batWing = 0x9a7fdc, ghost = 0xf4f1fb, dragon = 0x8fd8b0, belly = 0xfaf0c8,
  dragonHorn = 0xfbe7a8, dragonWing = 0xf3a7c8, bear = 0xf8f6f2, bearMuzzle = 0xece2d4, scarf = 0xe8576b,
  wool = 0xf7f2ea, sheepFace = 0xf6dccf, sheepLeg = 0x7a7187, cap = 0x6f86e0;

export default [
  // a little bat: a round lilac body, pointed ears, scalloped wings spread wide
  (() => {
    const rows = [
      '..e...e..',
      'w.ebbbe.w',
      'wwbbbbbww',
      'wwbbbbbww',
      'w.bbbbb.w',
    ];
    const g = grid(9, 5, 3);
    rows.forEach((row, k) => [...row].forEach((ch, x) => {
      const y = 4 - k;
      if (ch === 'w') g.set(x, y, 1, batWing);
      if (ch === 'e') g.set(x, y, 1, batBody);
      if (ch === 'b') for (let z = 0; z < 3; z++) if (!((x === 2 || x === 6) && z !== 1)) g.set(x, y, z, batBody);
    }));
    kawaii(g, 3, 2, { bx: 2, by: 1 });
    return g.entry({ id: 'cand-p3-bat', name: 'Little Bat' });
  })(),

  // a little ghost: a soft white sheet with a frilled hem and two stubby arms
  (() => {
    const g = grid(7, 8, 5);
    const sec = (y, rx, rz, keep = () => true) => {
      for (let z = 0; z < 5; z++) for (let x = 0; x < 7; x++)
        if (((x - 3) / rx) ** 2 + ((z - 2) / rz) ** 2 <= 1 && keep(x, z)) g.set(x, y, z, ghost);
    };
    for (let y = 1; y <= 5; y++) sec(y, 2.6, 2.2);
    sec(6, 2.2, 1.9);
    sec(7, 1.3, 1.2);
    sec(0, 2.6, 2.2, (x) => x % 2 === 1);
    pair(g, 0, 3, 2, ghost);
    kawaii(g, 2, 4, { bx: 1, by: 3 });
    return g.entry({ id: 'cand-p3-ghost', name: 'Little Ghost' });
  })(),

  // a baby dragon: mint, round, cream belly, tiny horns and wings, a curling tail
  (() => {
    const g = grid(7, 8, 7);
    g.ellipsoid([3, 1.8, 3], [2.3, 1.9, 2.1], dragon)
      .ellipsoid([3, 5, 3.4], [2.9, 2.1, 2.3], dragon);
    tint(g, (x, y, z) => y <= 3 && z >= 4, belly);
    pair(g, 1, 7, 3, dragonHorn);
    for (const [y, z] of [[2, 1], [3, 1], [2, 2], [3, 2]]) pair(g, 0, y, z, dragonWing);
    kawaii(g, 2, 5, { bx: 1, by: 4 });
    g.set(4, 1, 1, dragon).set(4, 1, 0, dragon).set(5, 1, 0, dragon).set(6, 1, 0, dragon).set(6, 2, 0, dragonWing);
    return g.entry({ id: 'cand-p3-baby-dragon', name: 'Baby Dragon' });
  })(),

  // a polar bear cub in a red scarf, one end hanging down the front
  (() => {
    const g = grid(7, 8, 6);
    g.ellipsoid([3, 1.8, 2.6], [2.5, 1.9, 2.1], bear)
      .ellipsoid([3, 4.9, 2.8], [2.8, 2.1, 2.2], bear);
    pair(g, 1, 7, 2, bear);
    tint(g, (x, y) => y === 3, scarf);
    for (const [x, y] of [[2, 4], [3, 4], [4, 4], [3, 3]]) out(g, x, y, bearMuzzle);
    front(g, 3, 4, INK);
    kawaii(g, 2, 5, { bx: 1, by: 4 });
    out(g, 4, 2, scarf); g.set(4, 1, 5, scarf);
    pair(g, 2, 0, 4, bear);
    return g.entry({ id: 'cand-p3-polar-cub', name: 'Polar Bear Cub' });
  })(),

  // a sleepy sheep: a woolly ball, a peach face, a nightcap flopped to one side
  (() => {
    const g = grid(7, 8, 8);
    g.ellipsoid([3, 3, 3], [3.1, 2.4, 2.8], wool);
    for (const z of [2, 4]) pair(g, 2, 0, z, sheepLeg);
    for (let x = 1; x <= 5; x++) for (let y = 2; y <= 4; y++)
      if (!((x === 1 || x === 5) && y === 2)) out(g, x, y, sheepFace);
    pair(g, 0, 4, frontZ(g, 1, 4), sheepFace);
    kawaii(g, 2, 3, { bx: 1, by: 3, blush: 0 });
    g.box([2, 4], [6, 6], [2, 4], cap).set(3, 7, 3, cap).set(4, 7, 3, cap).set(5, 7, 3, C.white);
    return g.entry({ id: 'cand-p3-sleepy-sheep', name: 'Sleepy Sheep' });
  })(),
];
