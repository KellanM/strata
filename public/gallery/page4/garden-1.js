// Page 4 · Garden & Small Creatures: round woodland and orchard animals, each
// with a prop or a pose (a honey pot, a tree trunk, a yuzu on the head).
// Kawaii rules (docs/voxel-study.md); faces look toward +z; paired features
// go through the pair*/kawaii helpers so they always match.
import { C, grid } from '../voxel.js';
import { INK, BLUSH, front, out, pair, pairFront, pairOut, kawaii, tint } from './kit.js';

const bear = 0xb57d50, bearMuzzle = 0xeed2a8, pot = 0xe08a3c, potRim = 0xc8693a, honey = 0xf8c440,
  koala = 0xaab0bf, koalaFluff = 0xf4f2f5, nose = 0x4d4250, trunk = 0x9a7656, leaf = 0x6fbf73,
  capy = 0xb78358, capyDark = 0x7d5638, yuzu = 0xf6b13a, sloth = 0xb7a083, slothFace = 0xf3e6cc,
  slothMask = 0x6e4f3a, branch = 0x8a6646, chip = 0xd38a4c, chipCream = 0xf8e6c8, stripe = 0x5e4434,
  acorn = 0xd9a865, acornCap = 0x7a5236;

export default [
  // a bear cub hugging a honey pot, a drip of honey on its nose
  (() => {
    const g = grid(7, 8, 8);
    g.ellipsoid([3, 1.8, 2.8], [2.4, 1.8, 2.0], bear)
      .ellipsoid([3, 4.9, 3.0], [2.9, 2.1, 2.2], bear);
    for (let x = 2; x <= 4; x++) for (let y = 3; y <= 4; y++) front(g, x, y, bearMuzzle);
    out(g, 3, 4, INK);
    kawaii(g, 2, 5, { bx: 1, by: 4 });
    pair(g, 1, 7, 2, bear); pair(g, 1, 7, 3, bear);
    g.box([2, 4], [0, 2], [5, 6], pot).box([2, 4], [2, 2], [5, 6], potRim)
      .box([3, 3], [2, 2], [5, 6], honey).set(3, 3, 5, honey);
    pair(g, 1, 1, 5, bear); pair(g, 1, 1, 6, bear);              // paws round the pot
    return g.entry({ id: 'cand-p4-honey-bear', name: 'Honey Bear' });
  })(),

  // a koala hugging a gum-tree trunk: huge fluffy ears, a big dark nose
  (() => {
    const g = grid(7, 9, 7);
    g.box([2, 4], [0, 8], [0, 1], trunk).box([4, 6], [8, 8], [0, 1], leaf).set(6, 7, 0, leaf);
    g.ellipsoid([3, 2.6, 3.2], [2.2, 1.8, 1.6], koala)
      .ellipsoid([3, 5.2, 3.6], [2.6, 1.8, 1.8], koala);
    for (let y = 5; y <= 7; y++) { pair(g, 0, y, 3, koala); pair(g, 0, y, 4, koalaFluff); }
    pair(g, 1, 7, 3, koala); pair(g, 1, 7, 4, koalaFluff);
    front(g, 3, 4, nose); front(g, 3, 5, nose); out(g, 3, 4, nose); out(g, 3, 5, nose);
    kawaii(g, 1, 5, { bx: 1, by: 4 });
    pair(g, 1, 3, 2, koala); pair(g, 1, 4, 2, koala);             // arms round the trunk
    pair(g, 2, 1, 3, koala); pair(g, 2, 1, 4, koala);            // feet
    return g.entry({ id: 'cand-p4-koala', name: 'Koala' });
  })(),

  // a capybara lying perfectly still with a yuzu balanced on its head
  (() => {
    const g = grid(7, 8, 8);
    g.ellipsoid([3, 2.0, 3.0], [2.6, 2.0, 3.0], capy)
      .box([1, 5], [2, 5], [4, 7], capy);                          // the blunt, boxy head
    for (const x of [1, 5]) for (const [y, z] of [[5, 7], [2, 7], [5, 4]]) g.clear(x, y, z);
    pair(g, 2, 0, 1, capyDark); pair(g, 2, 0, 5, capyDark);
    pair(g, 1, 6, 5, capyDark);                                    // little ears
    g.set(3, 3, 7, capyDark);                                      // nose
    kawaii(g, 1, 4, { bx: 1, by: 3 });
    g.box([2, 4], [6, 6], [4, 6], yuzu).set(3, 7, 5, yuzu).set(4, 7, 5, leaf);
    for (const [x, z] of [[2, 4], [4, 4], [2, 6], [4, 6]]) g.clear(x, 6, z);
    return g.entry({ id: 'cand-p4-capybara', name: 'Capybara & Yuzu' });
  })(),

  // a sloth hanging from a branch by both arms, a sleepy masked smile
  (() => {
    const g = grid(9, 9, 5);
    g.box([0, 8], [8, 8], [1, 2], branch).box([7, 8], [7, 7], [1, 2], leaf).set(0, 7, 1, leaf);
    g.ellipsoid([4, 4.4, 2.2], [2.6, 2.0, 1.8], sloth)
      .ellipsoid([4, 1.6, 1.8], [2.0, 1.6, 1.5], sloth);
    for (let y = 5; y <= 7; y++) pair(g, 2, y, 2, sloth);           // arms up to the branch
    for (let x = 3; x <= 5; x++) for (let y = 3; y <= 5; y++) front(g, x, y, slothFace);
    pairFront(g, 2, 4, slothMask); pairFront(g, 3, 4, INK);
    front(g, 4, 3, slothMask);
    pairFront(g, 2, 3, BLUSH);
    pair(g, 3, 0, 2, sloth);
    return g.entry({ id: 'cand-p4-sloth', name: 'Sloth' });
  })(),

  // a chipmunk with stuffed cheeks, clutching an acorn; stripes down its back
  (() => {
    const g = grid(7, 8, 7);
    g.ellipsoid([3, 1.8, 2.8], [2.3, 1.8, 1.9], chip)
      .ellipsoid([3, 4.7, 3.2], [2.9, 2.0, 2.1], chip);
    tint(g, (x, y, z) => y <= 3 && z >= 4, chipCream);
    for (let x = 1; x <= 5; x++) for (let y = 3; y <= 4; y++) front(g, x, y, chipCream);
    out(g, 3, 4, 0xe58a9a);
    kawaii(g, 2, 5, { bx: 1, by: 4 });
    tint(g, (x, y, z) => z <= 2 && y >= 1 && y <= 6, (x, y, z) => (x === 3 ? stripe : x === 2 || x === 4 ? chipCream : undefined));
    g.set(3, 2, 5, acornCap).set(3, 1, 5, acorn).set(3, 1, 6, acorn).set(3, 2, 6, acornCap);
    pair(g, 2, 2, 5, chip);                                        // paws on the acorn
    g.box([3, 4], [1, 5], [0, 0], chip).set(3, 6, 0, chip).set(3, 6, 1, chip);   // a bushy tail up the back
    pair(g, 1, 6, 3, chip); pair(g, 1, 7, 3, chip);
    return g.entry({ id: 'cand-p4-chipmunk', name: 'Chipmunk' });
  })(),
];
