// Page 3 · Garden & Small Creatures: farm babies and fruit & veg with faces.
// Kawaii rules (docs/voxel-study.md); faces look toward +z; paired features
// go through the pair*/kawaii helpers so they always match.
import { C, grid } from '../voxel.js';
import { INK, BLUSH, front, out, pair, pairFront, pairOut, kawaii, tint } from './kit.js';

const pig = 0xf7b8c6, snout = 0xec8ea8, nostril = 0xc9607f, calf = 0xfaf6ef, patch = 0x4a4452,
  muzzle = 0xf3a9b6, horn = 0xf0d9a8, corgi = 0xeba25a, skin = 0x4f8a3c, flesh = 0xe2ee9c,
  pit = 0x9b6a43, stalk = 0xc8e39c, floret = 0x5aa863, pine = 0xf5c64e, crown = 0x4f9e5a;

export default [
  // a piglet: round pink body, a snout with two nostrils, floppy ears, curly tail
  (() => {
    const g = grid(7, 6, 8);
    g.ellipsoid([3, 2.6, 3.6], [3.2, 2.3, 3.3], pig);
    pair(g, 2, 0, 2, pig); pair(g, 2, 0, 5, pig);
    pair(g, 1, 5, 4, snout); pair(g, 1, 5, 3, snout);
    g.box([2, 4], [2, 3], [7, 7], snout);
    pair(g, 2, 2, 7, nostril);
    kawaii(g, 2, 4, { bx: 1, by: 3 });
    g.set(3, 3, 0, pig).set(3, 4, 0, pig).set(4, 4, 0, pig);   // curly tail
    return g.entry({ id: 'cand-p3-piglet', name: 'Piglet' });
  })(),

  // a calf: big white head, pink muzzle, little horns, a bell; patches one side
  (() => {
    const g = grid(7, 8, 6);
    g.ellipsoid([3, 4.6, 3], [2.7, 2.1, 2.3], calf)
      .ellipsoid([3, 1.5, 2.6], [2.1, 1.5, 1.9], calf);
    tint(g, (x, y, z) => x <= 2 && y >= 5 && z <= 2, patch);
    tint(g, (x, y, z) => x >= 4 && y <= 2 && z <= 2, patch);
    for (let x = 2; x <= 4; x++) for (let y = 3; y <= 4; y++) front(g, x, y, muzzle);
    for (let x = 2; x <= 4; x++) out(g, x, 3, muzzle);
    pair(g, 2, 4, 5, nostril);
    kawaii(g, 1, 5, { blush: 0 });
    pair(g, 0, 5, 2, muzzle); pair(g, 0, 5, 3, muzzle);
    pair(g, 2, 7, 3, horn);
    out(g, 3, 2, C.gold);
    return g.entry({ id: 'cand-p3-calf', name: 'Calf' });
  })(),

  // a corgi loaf: big pointed ears, white blaze and muzzle, stubby legs
  (() => {
    const g = grid(7, 7, 8);
    g.ellipsoid([3, 1.6, 3], [2.4, 1.6, 3.0], corgi)
      .ellipsoid([3, 3.3, 5.2], [2.6, 2.0, 1.9], corgi);
    pair(g, 2, 0, 1, corgi); pair(g, 2, 0, 5, C.white);
    pair(g, 1, 5, 5, corgi); pair(g, 1, 6, 5, corgi); pair(g, 1, 5, 4, corgi);
    for (let x = 2; x <= 4; x++) for (let y = 2; y <= 3; y++) front(g, x, y, C.white);
    front(g, 3, 4, C.white); front(g, 3, 5, C.white);
    out(g, 3, 3, INK);
    kawaii(g, 2, 4, { bx: 1, by: 3 });
    return g.entry({ id: 'cand-p3-corgi', name: 'Corgi' });
  })(),

  // half an avocado: dark skin, pale flesh, the round pit as a tummy
  (() => {
    const rows = [
      '..ddd..',
      '.dllld.',
      '.dllld.',
      'dllllld',
      'dllllld',
      'dllllld',
      'dllllld',
      'dllllld',
      '.ddddd.',
    ];
    const g = grid(7, 9, 3);
    rows.forEach((row, k) => [...row].forEach((ch, x) => {
      if (ch === '.') return;
      g.set(x, 8 - k, 0, skin).set(x, 8 - k, 1, ch === 'd' ? skin : flesh);
    }));
    g.box([2, 4], [1, 3], [1, 2], pit).box([1, 5], [2, 2], [1, 1], pit);
    g.clear(2, 1, 2).clear(4, 1, 2).clear(2, 3, 2).clear(4, 3, 2);
    kawaii(g, 2, 5, { bx: 1, by: 4 });
    return g.entry({ id: 'cand-p3-avocado', name: 'Avocado' });
  })(),

  // a broccoli pal: a bumpy floret crown over a pale stalk with a face
  (() => {
    const g = grid(7, 8, 7);
    g.cylinder('y', [3, 3], 2.3, [0, 3], stalk)
      .ellipsoid([3, 5.2, 3], [3.3, 1.8, 3.3], floret)
      .ellipsoid([1.6, 6.4, 3], [1.3, 1.2, 1.4], floret)
      .ellipsoid([3, 6.4, 1.6], [1.4, 1.2, 1.3], floret)
      .ellipsoid([3, 6.4, 4.4], [1.4, 1.2, 1.3], floret)
      .ellipsoid([3, 6.9, 3], [1.2, 1.1, 1.2], floret)
      .mirror('x');
    kawaii(g, 2, 2, { bx: 1, by: 1 });
    return g.entry({ id: 'cand-p3-broccoli', name: 'Broccoli' });
  })(),

  // a pineapple pal: a gold body and a spiky green crown
  (() => {
    const g = grid(7, 9, 7);
    g.ellipsoid([3, 2.8, 3], [2.8, 2.9, 2.8], pine)
      .box([2, 4], [6, 6], [2, 4], crown)
      .box([1, 5], [7, 7], [3, 3], crown).box([3, 3], [7, 7], [1, 5], crown)
      .set(3, 8, 3, crown);
    kawaii(g, 2, 3);
    return g.entry({ id: 'cand-p3-pineapple', name: 'Pineapple' });
  })(),
];
