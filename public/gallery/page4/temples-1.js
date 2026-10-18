// Page 4 · Temples & Lanterns: shrine-park animals and folklore babies: a Nara
// fawn, a tanuki with its leaf, a tiger cub, a white-eye on a plum branch, a
// kappa with its cucumber, a temple elephant and a little oni.
// Kawaii rules (docs/voxel-study.md); faces look toward +z; paired features
// go through the pair*/kawaii helpers so they always match.
import { C, grid } from '../voxel.js';
import { INK, BLUSH, front, out, pair, pairFront, pairOut, kawaii, tint } from './kit.js';

const deer = 0xcf9258, deerCream = 0xf6e3c8, spot = 0xfbf3e6, nub = 0xe9d2a8, tanuki = 0xa98663,
  tanukiBelly = 0xf2dcc0, tanukiMask = 0x6b4e3a, leaf = 0x6fbf73, tiger = 0xf29a3e, tigerStripe = 0x5a3d2e,
  tigerWhite = 0xfbf3e6, mejiro = 0xa8c65a, mejiroChest = 0xf1e070, mejiroWing = 0x7f9e44, beakDark = 0x4a4048, branch = 0x7a5a44, plum = 0xf6a8c0,
  kappa = 0x8fcf7a, kappaHair = 0x3f7a5a, shell = 0xa8784a, beak = 0xf6c94a, dish = 0xe9eef2, water = 0x8fd0e6,
  cucumber = 0x4f9e4a, ele = 0xb7b3c8, earPink = 0xf3b6c4, cloth = 0xe0565b, goldTrim = 0xe9b949,
  oni = 0xf28b82, oniHair = 0x4a3a5a, horn = 0xf6e3a8, pants = 0xf6c94a, club = 0x8a8f9c;

export default [
  // a Nara fawn: big sideways ears, antler nubs, white spots and a white tail
  (() => {
    const g = grid(7, 9, 8);
    g.ellipsoid([3, 2.6, 3.0], [1.9, 1.3, 2.6], deer)
      .ellipsoid([3, 5.4, 4.8], [2.4, 1.8, 1.8], deer);
    for (const x of [2, 4]) for (const z of [2, 4]) { g.set(x, 0, z, deer); g.set(x, 1, z, deer); }
    for (let x = 2; x <= 4; x++) front(g, x, 4, deerCream);
    out(g, 3, 4, INK);
    kawaii(g, 2, 5, { bx: 1, by: 4 });
    pair(g, 0, 6, 4, deer); pair(g, 0, 6, 5, earPink); pair(g, 1, 6, 5, deer);
    pair(g, 2, 8, 5, nub);
    pair(g, 2, 3, 2, spot); g.set(3, 3, 1, spot).set(3, 3, 3, spot);
    g.set(3, 3, 0, spot);                                          // the white tail
    return g.entry({ id: 'cand-p4-nara-deer', name: 'Nara Fawn' });
  })(),

  // a tanuki: round belly, dark eye patches, a magic leaf on its head
  (() => {
    const g = grid(7, 9, 7);
    g.ellipsoid([3, 1.9, 2.8], [2.5, 1.9, 2.1], tanuki)
      .ellipsoid([3, 5.0, 3.0], [2.8, 2.0, 2.1], tanuki);
    tint(g, (x, y, z) => y <= 2 && z >= 4, tanukiBelly);
    for (let x = 2; x <= 4; x++) front(g, x, 4, tanukiBelly);
    front(g, 3, 5, tanukiBelly);
    pairFront(g, 1, 5, tanukiMask); pairFront(g, 1, 4, tanukiMask);
    out(g, 3, 4, INK);
    kawaii(g, 2, 5, { blush: 0 });
    pair(g, 1, 7, 2, tanukiMask); pair(g, 1, 7, 3, tanukiMask);
    g.set(3, 7, 3, tanuki).set(3, 8, 3, leaf).set(4, 8, 3, leaf).set(4, 8, 2, leaf).set(2, 8, 3, leaf);
    pair(g, 2, 0, 4, tanukiMask);
    g.set(4, 1, 0, tanuki).set(4, 2, 0, tanuki).set(4, 3, 0, tanukiMask);   // tail
    return g.entry({ id: 'cand-p4-tanuki', name: 'Tanuki' });
  })(),

  // a tiger cub: orange with forehead stripes, a white muzzle, round ears
  (() => {
    const g = grid(7, 8, 7);
    g.ellipsoid([3, 1.8, 2.6], [2.3, 1.8, 2.0], tiger)
      .ellipsoid([3, 4.9, 3.0], [3.0, 2.1, 2.2], tiger);
    for (let x = 2; x <= 4; x++) for (let y = 3; y <= 4; y++) front(g, x, y, tigerWhite);
    tint(g, (x, y, z) => y <= 3 && z >= 4 && x >= 2 && x <= 4, tigerWhite);
    out(g, 3, 4, 0xe58a9a);
    kawaii(g, 2, 5, { bx: 1, by: 4 });
    front(g, 3, 6, tigerStripe); pairFront(g, 2, 7, tigerStripe);   // stripes on the forehead
    pairFront(g, 0, 5, tigerStripe);                               // cheek stripes
    tint(g, (x, y, z) => z <= 1 && (y === 2 || y === 5), tigerStripe);
    pair(g, 1, 7, 2, tiger); pair(g, 1, 7, 3, tigerWhite);
    pair(g, 2, 0, 4, tigerWhite);
    g.set(4, 2, 0, tiger).set(5, 2, 0, tigerStripe).set(5, 3, 0, tiger).set(5, 4, 0, tigerStripe);   // tail
    return g.entry({ id: 'cand-p4-tiger-cub', name: 'Tiger Cub' });
  })(),

  // a mejiro (white-eye) on a plum branch: olive green, darker wings, a
  // yellow throat, white rings round its eyes, a tail cocked up behind
  (() => {
    const g = grid(7, 7, 6);
    g.box([0, 6], [0, 0], [2, 3], branch).set(0, 1, 2, plum).set(0, 1, 3, plum).set(6, 1, 3, plum);
    g.ellipsoid([3, 3.2, 2.6], [2.2, 2.2, 1.9], mejiro);
    tint(g, (x, y, z) => g.get(x, y, z) === mejiro && y <= 3 && (x <= 1 || x >= 5), mejiroWing);
    tint(g, (x, y, z) => y >= 2 && y <= 3 && z >= 3 && x >= 2 && x <= 4, mejiroChest);
    pairFront(g, 2, 5, C.white); pairFront(g, 1, 4, C.white);
    kawaii(g, 2, 4, { blush: 0 });
    out(g, 3, 3, beakDark);                                        // a thin pointed beak
    g.set(3, 2, 0, mejiroWing).set(3, 3, 0, mejiroWing).set(3, 4, 0, mejiroWing);   // tail cocked up
    pair(g, 2, 1, 2, 0xe8a0a8);                                    // feet on the branch
    return g.entry({ id: 'cand-p4-mejiro', name: 'Mejiro' });
  })(),

  // a kappa: a water dish on its head ringed with hair, a yellow beak, a
  // shell on its back, hugging a cucumber
  (() => {
    const g = grid(7, 9, 7);
    g.ellipsoid([3, 1.8, 2.8], [2.2, 1.8, 1.9], kappa)
      .ellipsoid([3, 4.9, 3.0], [2.8, 2.0, 2.1], kappa)
      .ellipsoid([3, 2.2, 1.0], [2.0, 1.8, 1.1], shell);
    tint(g, (x, y, z) => y === 6 && (x - 3) ** 2 + (z - 3) ** 2 >= 3, kappaHair);
    g.cylinder('y', [3, 3], 1.5, [7, 7], dish).set(3, 7, 3, water);
    out(g, 3, 4, beak);
    kawaii(g, 2, 5, { bx: 1, by: 4 });
    g.box([2, 4], [2, 2], [5, 5], cucumber);
    pair(g, 1, 2, 4, kappa);                                       // hands on the cucumber
    pair(g, 2, 0, 4, kappa);
    return g.entry({ id: 'cand-p4-kappa', name: 'Kappa' });
  })(),

  // a temple elephant calf: big flat ears, a red and gold headcloth, trunk down
  (() => {
    const g = grid(9, 8, 7);
    g.ellipsoid([4, 1.8, 2.6], [2.6, 1.8, 2.2], ele)
      .ellipsoid([4, 4.4, 3.4], [2.6, 2.2, 2.2], ele);
    for (let y = 3; y <= 6; y++) { pair(g, 0, y, 3, ele); pair(g, 1, y, 3, ele); }
    for (let y = 4; y <= 5; y++) { pair(g, 0, y, 4, earPink); pair(g, 1, y, 4, earPink); }
    tint(g, (x, y) => y >= 6 && x >= 2 && x <= 6, cloth);
    front(g, 4, 6, goldTrim);
    kawaii(g, 3, 5, { bx: 2, by: 4 });
    g.set(4, 3, 6, ele).set(4, 2, 6, ele).set(4, 1, 6, ele);         // trunk
    pair(g, 3, 0, 1, ele); pair(g, 3, 0, 4, ele);
    g.set(4, 2, 0, ele);
    return g.entry({ id: 'cand-p4-temple-elephant', name: 'Temple Elephant' });
  })(),

  // a little oni: rosy red, two horns through curly hair, tiger-striped
  // shorts, a spiky club over one shoulder
  (() => {
    const g = grid(7, 9, 6);
    g.ellipsoid([3, 1.8, 2.6], [2.2, 1.8, 1.9], oni)
      .ellipsoid([3, 4.9, 2.8], [2.8, 2.0, 2.1], oni);
    tint(g, (x, y) => y <= 1, (x) => (x % 2 ? pants : tigerStripe));
    tint(g, (x, y, z) => y >= 6 || (y === 5 && z <= 1), oniHair);
    pair(g, 2, 7, 3, horn); pair(g, 2, 8, 3, horn);
    kawaii(g, 2, 5, { blush: 0 });
    pairFront(g, 1, 4, 0xfbd0d0);
    out(g, 3, 3, C.white);                                         // one little fang
    pair(g, 2, 0, 4, oni);
    g.box([6, 6], [1, 4], [3, 3], club).box([6, 6], [5, 6], [2, 3], club).set(5, 2, 3, oni);
    return g.entry({ id: 'cand-p4-oni', name: 'Little Oni' });
  })(),
];
