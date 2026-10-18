// Page 3 · Home & Morning: the cutest round critters and food with faces.
// Kawaii rules (docs/voxel-study.md): big head, small body, two single dark
// eyes set low and wide, a pink blush cube under each, tiny or no mouth.
// Faces look toward +z; paired features are set with pair*/mirror helpers.
import { C, grid } from '../voxel.js';
import { INK, BLUSH, front, out, pair, pairFront, kawaii, tint } from './kit.js';

const ginger = 0xf0b072, cream = 0xfbeedd, kraft = 0xcf9f6c, kitten = 0xc4bed0, custard = 0xf8dc7a,
  caramel = 0xb8713f, plate = 0xfbf8f2, rice = 0xfbf8f2, nori = 0x2f4a3f, mint = 0x9fdcc4,
  ginger2 = 0xc98547, icing = 0xfbf8f2;

export default [
  // a hamster: one round ginger ball with a cream face, holding a seed in two paws
  (() => {
    const g = grid(7, 6, 7);
    g.ellipsoid([3, 2.5, 3], [3.3, 2.6, 2.9], ginger);
    tint(g, (x, y, z) => (z >= 4 && y <= 2) || (z >= 3 && y <= 1), cream);
    pair(g, 1, 5, 3, 0xf5b3a8); pair(g, 1, 5, 2, ginger);          // ears, pink inside
    kawaii(g, 2, 3);
    pair(g, 2, 1, 6, ginger);
    g.set(3, 1, 6, 0x5a4c46).set(3, 2, 6, 0x5a4c46);
    return { ...g.entry({ id: 'cand-p3-hamster', name: 'Hamster' }) };
  })(),

  // a kitten peeking out of a cardboard box, paws over the rim, flaps open
  (() => {
    const g = grid(7, 7, 6);
    g.box([0, 6], [0, 2], [0, 5], kraft).box([1, 5], [1, 2], [1, 4], 0);
    for (let z = 1; z <= 4; z++) pair(g, 0, 3, z, kraft);         // the two side flaps, open
    g.ellipsoid([3, 4.0, 2.9], [2.5, 1.8, 1.9], kitten);
    pair(g, 1, 6, 2, kitten); pair(g, 1, 6, 3, kitten);
    kawaii(g, 2, 4, { bx: 1, by: 4 });
    pair(g, 1, 3, 5, C.white);                                     // two paws over the rim
    return g.entry({ id: 'cand-p3-kitten-box', name: 'Kitten in a Box' });
  })(),

  // purin: a custard pudding with a caramel top and a cherry, on a plate
  (() => {
    const g = grid(7, 7, 7);
    g.cylinder('y', [3, 3], 3.3, [0, 0], plate)
      .cylinder('y', [3, 3], 2.6, [1, 2], custard)
      .cylinder('y', [3, 3], 2.3, [3, 3], custard)
      .cylinder('y', [3, 3], 2.0, [4, 4], caramel)
      .set(4, 3, 5, caramel)                     // one drip down the front
      .set(3, 5, 3, C.white).set(3, 6, 3, C.red);
    kawaii(g, 2, 2, { by: 1 });
    return g.entry({ id: 'cand-p3-purin', name: 'Purin' });
  })(),

  // onigiri: a rice triangle with a nori band and a sleepy smile
  (() => {
    const rows = ['..www..', '.wwwww.', '.wwwww.', 'wwwwwww', 'wwnnnww', '.wnnnw.'];
    const g = grid(7, 6, 4);
    const at = (x, y) => rows[5 - y]?.[x] ?? '.';
    for (let z = 0; z < 4; z++) for (let y = 0; y < 6; y++) for (let x = 0; x < 7; x++) {
      const ch = at(x, y);
      if (ch === '.') continue;
      const edge = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => at(x + dx, y + dy) === '.');
      if ((z === 0 || z === 3) && edge && ch === 'w') continue;
      g.set(x, y, z, ch === 'n' ? nori : rice);
    }
    kawaii(g, 2, 3);
    return g.entry({ id: 'cand-p3-onigiri', name: 'Onigiri' });
  })(),

  // a mint macaron: two domed shells and a cream stripe, a face on the top shell
  (() => {
    const g = grid(7, 5, 7);
    g.cylinder('y', [3, 3], 2.6, [0, 0], mint)
      .cylinder('y', [3, 3], 3.2, [1, 1], mint)
      .cylinder('y', [3, 3], 3.2, [2, 2], cream)
      .cylinder('y', [3, 3], 3.2, [3, 3], mint)
      .cylinder('y', [3, 3], 2.6, [4, 4], mint);
    kawaii(g, 2, 4, { bx: 1, by: 3 });
    return g.entry({ id: 'cand-p3-macaron', name: 'Macaron' });
  })(),

  // a gingerbread pal: icing cuffs and boots, a red button, rosy cheeks
  (() => {
    const rows = [
      '..ggg..',
      '.ggggg.',
      '.ggggg.',
      '.ggggg.',
      '..ggg..',
      'wgggggw',
      '.ggrgg.',
      '.gg.gg.',
      '.ww.ww.',
    ];
    const key = { g: ginger2, w: icing, r: C.red };
    const g = grid(7, 9, 2);
    rows.forEach((row, k) => [...row].forEach((ch, x) => { if (key[ch]) { g.set(x, 8 - k, 0, key[ch]).set(x, 8 - k, 1, key[ch]); } }));
    kawaii(g, 2, 6, { bx: 1, by: 5 });
    return g.entry({ id: 'cand-p3-gingerbread', name: 'Gingerbread Pal' });
  })(),
];
