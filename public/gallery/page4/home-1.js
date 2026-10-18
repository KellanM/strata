// Page 4 · Home & Morning: house pets with iconic silhouettes, little scenes
// (a bunny in a teacup, a pup in the bath) and one strong food icon.
// Kawaii rules (docs/voxel-study.md): big head, small body, two single dark
// eyes set low and wide, a pink blush cube under each. Faces look toward +z;
// paired features go through the pair*/kawaii helpers so they always match.
import { C, grid } from '../voxel.js';
import { INK, BLUSH, front, out, pair, pairFront, kawaii, tint } from './kit.js';

const fawn = 0xecc99a, mask = 0x4d4250, tongue = 0xf28aa0, doxie = 0xc9763f, doxieEar = 0x8c4a2b,
  cup = 0x9fcdea, saucer = 0xfbf3e6, bunny = 0xfbf8f2, earPink = 0xf5b3c0, pan = 0x5d6670,
  handle = 0x9a6a45, eggWhite = 0xfbf8f2, yolk = 0xf6b93b, budgie = 0x8fd45e, budgieWing = 0x5fae4e,
  budgieFace = 0xf8e36a, cere = 0x6f9fe8, bar = 0x4a4652, tub = 0xf4b6c2, foot = 0xe9b949,
  foam = 0xfbf8f2, golden = 0xf1c070, goldenEar = 0xc98547,
  cheese = 0xf6cf5a, mouse = 0xb9b6c6, tail = 0xf0a8b8;

export default [
  // a pug: a fawn face with a black squashed muzzle, black folded ears, tongue out
  (() => {
    const g = grid(7, 8, 7);
    g.ellipsoid([3, 1.8, 2.6], [2.3, 1.8, 2.0], fawn)
      .ellipsoid([3, 4.9, 3.0], [3.0, 2.1, 2.3], fawn);
    for (let x = 2; x <= 4; x++) front(g, x, 3, mask);             // the squashed black muzzle
    front(g, 3, 4, mask); out(g, 3, 4, mask);
    out(g, 3, 3, tongue);
    pair(g, 1, 7, 2, mask); pair(g, 1, 7, 3, mask); pair(g, 0, 6, 3, mask);
    kawaii(g, 2, 5, { bx: 1, by: 4 });
    pair(g, 2, 0, 4, fawn);
    g.set(3, 2, 0, fawn).set(3, 3, 0, fawn).set(4, 3, 0, fawn);   // curly tail
    return g.entry({ id: 'cand-p4-pug', name: 'Pug' });
  })(),

  // a dachshund: a long low sausage on four stubby legs, its head turned to
  // look at you, long floppy ears, a little tail up
  (() => {
    const g = grid(9, 6, 6);
    g.box([1, 6], [1, 2], [1, 3], doxie);
    for (const [x, z] of [[1, 1], [1, 3]]) g.clear(x, 2, z);
    for (const x of [1, 6]) for (const z of [1, 3]) g.set(x, 0, z, doxie);
    g.set(0, 2, 2, doxie).set(0, 3, 2, doxie);                     // tail up
    g.box([5, 7], [3, 5], [1, 3], doxie);                          // the head, on the chest
    for (const x of [5, 7]) for (const z of [1, 3]) g.clear(x, 5, z);
    g.set(6, 3, 4, doxie).set(6, 3, 5, mask);                      // snout and nose
    for (const x of [4, 8]) for (let y = 3; y <= 4; y++) g.set(x, y, 2, doxieEar);
    for (const x of [5, 7]) { g.set(x, 4, 3, INK); g.set(x, 3, 3, BLUSH); }
    return g.entry({ id: 'cand-p4-dachshund', name: 'Dachshund' });
  })(),

  // a bunny peeking out of a teacup on its saucer, long ears straight up
  (() => {
    const g = grid(7, 9, 7);
    g.cylinder('y', [3, 3], 3.3, [0, 0], saucer)
      .cylinder('y', [3, 3], 2.6, [1, 3], cup)
      .cylinder('y', [3, 3], 1.6, [2, 3], 0)
      .ellipsoid([3, 4.3, 3], [2.4, 1.7, 1.9], bunny);
    g.set(6, 2, 3, cup).set(6, 3, 3, cup);                         // the handle
    for (let y = 6; y <= 8; y++) pair(g, 2, y, 3, bunny);
    pair(g, 2, 6, 4, earPink); pair(g, 2, 7, 4, earPink);
    kawaii(g, 2, 4, { bx: 1, by: 4 });
    return g.entry({ id: 'cand-p4-bunny-teacup', name: 'Bunny in a Teacup' });
  })(),

  // a fried egg with a sleepy yolk face, sizzling in a little pan
  (() => {
    const g = grid(9, 4, 7);
    g.cylinder('y', [3, 3], 3.3, [0, 0], pan)
      .cylinder('y', [3, 3], 3.3, [1, 1], pan)
      .cylinder('y', [3, 3], 2.4, [1, 1], eggWhite)
      .box([7, 8], [1, 1], [3, 3], handle);
    g.box([2, 4], [2, 2], [2, 4], yolk).set(3, 3, 3, yolk);
    g.set(2, 2, 4, INK).set(4, 2, 4, INK);
    g.set(2, 1, 5, BLUSH).set(4, 1, 5, BLUSH);                     // pink cheeks on the white
    return g.entry({ id: 'cand-p4-fried-egg', name: 'Fried Egg' });
  })(),

  // a budgie: green body, yellow face with a blue nose and cheek spots,
  // barred head, a long tail
  (() => {
    const g = grid(7, 8, 6);
    g.ellipsoid([3, 2.4, 2.6], [2.3, 2.2, 2.0], budgie)
      .ellipsoid([3, 5.1, 3.0], [2.6, 1.9, 2.0], budgieFace);
    tint(g, (x, y, z) => (y === 4 || y === 6) && z <= 1, bar);
    tint(g, (x, y, z) => y <= 3 && (x <= 1 || x >= 5), budgieWing);
    kawaii(g, 2, 5, { blush: 0 });
    out(g, 3, 4, 0xf0d8a8);                                        // beak
    out(g, 3, 5, cere);
    pairFront(g, 1, 4, cere);
    pair(g, 2, 0, 3, 0xf0a8b0);
    g.set(3, 2, 0, budgieWing).set(3, 1, 0, budgieWing).set(3, 0, 0, cere);                 // tail
    return g.entry({ id: 'cand-p4-budgie', name: 'Budgie' });
  })(),

  // bath time: a golden pup in a pink claw-foot tub, foam piled at the far
  // end and one bubble on its head
  (() => {
    const g = grid(9, 8, 6);
    g.box([0, 8], [1, 3], [0, 4], tub).box([1, 7], [2, 3], [1, 3], 0);
    for (const x of [0, 8]) for (const z of [0, 4]) { g.clear(x, 3, z); g.set(x, 0, z, foot); }
    g.box([1, 7], [3, 3], [1, 3], foam).box([1, 2], [4, 4], [1, 3], foam).box([1, 2], [5, 5], [2, 2], foam);
    g.ellipsoid([5, 4.5, 2], [1.8, 1.7, 1.5], golden);
    for (const x of [3, 7]) for (let y = 4; y <= 5; y++) g.set(x, y, 2, goldenEar);
    g.set(4, 5, 3, INK).set(6, 5, 3, INK).set(4, 4, 3, BLUSH).set(6, 4, 3, BLUSH);
    g.set(5, 4, 4, mask);                                          // nose
    g.set(3, 4, 4, golden).set(7, 4, 4, golden);                   // paws on the rim
    g.set(5, 7, 2, foam);                                          // a bubble on its head
    return g.entry({ id: 'cand-p4-bath-pup', name: 'Bath-time Pup' });
  })(),

  // a mouse poking its head out of a hole in a wedge of cheese, tail out the side
  (() => {
    const g = grid(7, 7, 6);
    const h = [6, 6, 5, 5, 4, 4, 3];                               // the wedge slopes in 2-voxel steps
    g.box([0, 6], [0, 6], [0, 3], (x, y) => (y < h[x] ? cheese : 0));
    for (const [x, y, z] of [[5, 2, 3], [5, 1, 3], [0, 4, 1], [3, 4, 1], [1, 5, 2], [6, 1, 1]]) g.clear(x, y, z);
    g.ellipsoid([3, 2.4, 4.0], [2.2, 1.7, 1.5], mouse);
    for (const y of [4, 5]) { pair(g, 0, y, 4, mouse); pair(g, 1, y, 4, mouse); }
    pair(g, 1, 4, 5, earPink); pair(g, 1, 5, 5, earPink);
    kawaii(g, 2, 3, { blush: 0 });
    out(g, 3, 2, earPink);                                         // pink nose
    pairFront(g, 1, 2, BLUSH);
    g.set(6, 0, 4, tail).set(6, 0, 5, tail).set(5, 0, 5, tail);    // tail curling out the side
    return g.entry({ id: 'cand-p4-cheese-mouse', name: 'Mouse in the Cheese' });
  })(),
];
