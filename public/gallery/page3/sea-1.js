// Page 3 · Sea & Shore: round sea babies and one piece of sushi with a face.
// Kawaii rules (docs/voxel-study.md); faces look toward +z (the clownfish and
// taiyaki-style side views carry an eye on both sides, mirrored across z).
import { C, grid } from '../voxel.js';
import { INK, BLUSH, front, out, pair, pairFront, pairOut, kawaii, tint } from './kit.js';

const otter = 0x9a6e52, otterFace = 0xf0dfc8, water = 0x8fd0e6, clam = 0xf7a8a8, axo = 0xf7b8cc,
  gill = 0xe46a8e, smile = 0xd0607e, clown = 0xf28a3c, walrus = 0xb89a86, whisker = 0xf1e2cc,
  tusk = 0xfbf8f2, puffinInk = 0x35313e, beak = 0xf06b3a, beakTip = 0xf6c64a, feet = 0xf2913d,
  rice = 0xfbf8f2, salmon = 0xf7966e, fat = 0xfcd4c0, squid = 0xf8d3dd;

export default [
  // a sea otter floating upright, cream face, a pink shell held to its chest
  (() => {
    const g = grid(7, 9, 6);
    g.cylinder('y', [3, 3], 3.3, [0, 0], water)
      .ellipsoid([3, 3.2, 2.6], [2.4, 2.3, 2.0], otter)
      .ellipsoid([3, 6.2, 2.7], [2.6, 2.0, 2.1], otter);
    for (let x = 1; x <= 5; x++) for (let y = 5; y <= 7; y++) if (!(y === 7 && (x === 1 || x === 5))) front(g, x, y, otterFace);
    pair(g, 1, 8, 2, otter);
    kawaii(g, 2, 6, { bx: 1, by: 5 });
    front(g, 3, 5, INK);
    g.box([2, 4], [3, 4], [5, 5], clam);
    pair(g, 2, 5, 5, otter);
    return g.entry({ id: 'cand-p3-sea-otter', name: 'Sea Otter' });
  })(),

  // an axolotl: wide pink head, three frilly gill fronds each side, a smile
  (() => {
    const g = grid(9, 5, 7);
    g.ellipsoid([4, 2, 4.6], [2.8, 1.8, 2.1], axo)
      .ellipsoid([4, 1.5, 2.2], [1.7, 1.3, 2.0], axo)
      .set(4, 1, 0, axo).set(4, 2, 0, axo).set(4, 3, 0, axo);
    for (const [x, y] of [[1, 3], [1, 4], [0, 4], [1, 2], [0, 2], [1, 1], [1, 0], [0, 0]]) pair(g, x, y, 4, gill);
    pair(g, 2, 0, 4, axo); pair(g, 3, 0, 1, axo);
    kawaii(g, 3, 2, { bx: 2, by: 1 });
    front(g, 4, 1, smile);
    return g.entry({ id: 'cand-p3-axolotl', name: 'Axolotl' });
  })(),

  // a clownfish: round orange body, three white bands, an eye on each side
  (() => {
    // side profile (head at +x): g body, f fins (centre plane only)
    const rows = [
      '...ff...',
      '..ggggg.',
      'f.gggggg',
      'ffgggggg',
      'f.gggggg',
      '..ggggg.',
      '...f.f..',
    ];
    const g = grid(8, 7, 3);
    const at = (x, y) => rows[6 - y]?.[x] ?? '.';
    for (let y = 0; y < 7; y++) for (let x = 0; x < 8; x++) {
      const ch = at(x, y);
      if (ch === 'f') g.set(x, y, 1, clown);
      if (ch !== 'g') continue;
      const edge = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => at(x + dx, y + dy) !== 'g');
      const col = x === 3 || x === 5 ? C.white : clown;
      for (let z = edge ? 1 : 0; z <= (edge ? 1 : 2); z++) g.set(x, y, z, col);
    }
    g.set(6, 4, 0, INK).set(6, 3, 0, BLUSH).mirror('z');
    return g.entry({ id: 'cand-p3-clownfish', name: 'Clownfish' });
  })(),

  // a walrus pup: plump and round, a cream whisker pad, two little tusks
  (() => {
    const g = grid(7, 6, 8);
    g.ellipsoid([3, 2.5, 3], [3.1, 2.5, 3.1], walrus);
    for (const [x, y] of [[2, 2], [4, 2], [2, 3], [4, 3], [3, 3]]) g.set(x, y, 7, whisker);
    g.box([2, 4], [2, 3], [6, 6], whisker);
    g.set(3, 3, 7, INK).set(3, 2, 7, 0);
    pair(g, 2, 1, 7, tusk); pair(g, 2, 0, 7, tusk);
    kawaii(g, 2, 4, { blush: 0 });
    pairFront(g, 1, 3, BLUSH);
    pair(g, 1, 0, 4, walrus); pair(g, 0, 0, 4, walrus); pair(g, 0, 0, 5, walrus);
    return g.entry({ id: 'cand-p3-walrus', name: 'Walrus Pup' });
  })(),

  // a puffin: black back and cap, white face and chest, a big striped beak
  (() => {
    const g = grid(5, 8, 6);
    g.ellipsoid([2, 2.5, 2.4], [2.1, 2.4, 2.1], puffinInk)
      .ellipsoid([2, 5.2, 2.6], [2.0, 1.9, 1.9], puffinInk);
    tint(g, (x, y, z) => z >= 3 && y <= 6, C.white);
    g.set(2, 5, 5, beak).set(2, 4, 5, beakTip);
    pairFront(g, 1, 6, INK);
    pairFront(g, 1, 5, BLUSH);
    pair(g, 1, 0, 3, feet); pair(g, 1, 0, 4, feet);
    return g.entry({ id: 'cand-p3-puffin', name: 'Puffin' });
  })(),

  // salmon nigiri: a rice pillow with a face, salmon draped over the top
  (() => {
    const g = grid(7, 5, 4);
    g.box([1, 5], [0, 2], [0, 3], rice);
    pair(g, 1, 2, 0, 0); pair(g, 1, 2, 3, 0);
    g.box([0, 6], [3, 3], [0, 3], salmon);
    pair(g, 0, 2, 1, salmon); pair(g, 0, 2, 2, salmon);
    g.box([1, 5], [4, 4], [0, 3], salmon);
    tint(g, (x, y) => y >= 3 && (x === 2 || x === 4), fat);
    kawaii(g, 2, 1, { bx: 1, by: 0 });
    return g.entry({ id: 'cand-p3-nigiri', name: 'Salmon Nigiri' });
  })(),

  // a little squid: an arrow fin on top, a soft body with a face, five arms
  (() => {
    const g = grid(7, 9, 4);
    g.box([1, 5], [3, 6], [0, 3], squid);
    for (const y of [3, 6]) { pair(g, 1, y, 0, 0); }
    g.box([0, 6], [7, 7], [1, 2], squid).box([2, 4], [8, 8], [1, 2], squid);
    pair(g, 1, 7, 0, squid);
    for (let y = 0; y <= 2; y++) { pair(g, 2, y, 3, squid); g.set(3, y, 1, squid); }
    for (let y = 1; y <= 2; y++) pair(g, 1, y, 1, squid);
    kawaii(g, 2, 5, { bx: 1, by: 4 });
    return g.entry({ id: 'cand-p3-squid', name: 'Little Squid' });
  })(),
];
