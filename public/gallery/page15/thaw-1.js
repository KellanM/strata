// Page 15 · III Warm Breath: for Frost Peaks, the small warm things that hold
// out in the snow. A snow lion with a turquoise mane, the cross flat face
// of a Pallas's cat, a kotatsu with a cat poking out of the quilt and mikan
// on top, a pot-bellied stove with its door aglow, an old leather skate, a
// St Bernard pup with the barrel under its chin, a marmot asleep in its
// nest with snow on its back, and a Fair Isle bobble hat.
// Built like the Pegasus Foal and Meerkat Lookout: boxes, not blobs, a few
// flat colour blocks each, and the face or the warm part turned to the
// viewer. Each has one warm colour against the cold (leather, iron, quilt
// red, wool, fur); the Frost sky (white to ice blue) keeps snow on the top
// faces and lets those colours stand out. Eyes are ink throughout.
// Lit as the game lights them (docs/voxel-study.md, Dithered light): one flat
// colour per material, no painted rims or undersides; the dithered ramp does
// the shading. Eyes, noses, the jewel and the stove's glow stay under 5 cubes
// or are kept flat, so they read exact.
import { grid } from '../voxel.js';
import { INK, BLUSH, S, lathe, sheet } from './kit.js';

const { frost, ember, emberHot, cream } = S;
const lion = 0xf7f3ea, mane = 0x4fb3a9, gold = 0xe9b949,
  manul = 0xa79e95, manulLt = 0xe6ddd2, manulDk = 0x5a514b, manulNose = 0x8a6464,
  quilt = 0xc8464f, wood = 0x9a6a44, mikan = 0xf2a03d, leaf = 0x5fae6e, calico = 0xe08a3c,
  iron = 0x4a4446,
  leather = 0x8a5a3c, sole = 0x4a3a34, blade = 0xc9d1d9, lace = 0xe0565b,
  coat = 0xb5653a, coatDk = 0x7a4128, barrel = 0xc8904f, woodDk = 0x6b4a3a,
  marmot = 0xa8805c, marmotDk = 0x4e3a2e, straw = 0xe0c27a,
  wool = 0xd2464f, navy = 0x2f4a7a;

export default [
  // a snow lion of the high monasteries, sitting up and facing you: a white
  // body, a turquoise mane framing a white face (a ring of it, so from behind
  // you see the white back of the head inside it), two ink eyes, a pink nose,
  // a gold jewel on the brow, and its tail curled up its back to a turquoise tuft
  (() => {
    const g = grid(7, 9, 7);
    g.box([1, 5], [0, 2], [0, 3], lion);                                              // the haunches
    g.box([2, 4], [1, 3], [3, 4], lion);                                              // the chest
    for (const x of [2, 4]) g.box([x, x], [0, 2], [5, 5], lion).set(x, 0, 6, lion);   // front legs and paws
    g.box([1, 5], [4, 7], [3, 5], lion);                                              // the head
    for (const x of [0, 6]) g.box([x, x], [3, 7], [3, 5], mane);                      // the mane: down both sides,
    g.box([1, 5], [8, 8], [3, 5], mane);                                              // over the brow
    g.box([1, 5], [3, 3], [5, 5], mane).box([2, 4], [3, 3], [6, 6], mane);            // and a beard under the chin
    g.clear(0, 3, 3).clear(6, 3, 3);
    g.set(2, 6, 5, INK).set(4, 6, 5, INK);
    g.box([2, 4], [4, 4], [6, 6], lion).set(3, 5, 6, BLUSH);                          // muzzle and nose
    g.set(3, 8, 6, gold);                                                             // a gold jewel on the brow
    g.box([3, 3], [3, 4], [0, 0], lion).box([3, 3], [3, 3], [1, 2], lion);            // the tail, up the back
    g.box([2, 4], [5, 5], [0, 0], mane).set(3, 6, 0, mane).set(3, 5, 1, mane);        // and its tuft
    return g.entry({ id: 'cand-p15-snow-lion', name: 'Snow Lion', story: 'It guards the top of the mountain. Nobody has asked it from what.' });
  })(),

  // a Pallas's cat in a loaf: a wide flat head with tiny ears set out at
  // the sides, a pale muzzle and brows, round eyes, dark cheek stripes, a
  // small dusky nose, and its thick tail wrapped round its front paws, dark
  // at the tip
  (() => {
    const g = grid(8, 6, 7);
    g.box([1, 6], [0, 2], [0, 4], manul).box([2, 5], [3, 3], [1, 2], manul);         // the loaf
    g.clear(1, 2, 0).clear(6, 2, 0).clear(1, 1, 0).clear(6, 1, 0);                    // rounded at the back
    g.box([0, 7], [2, 4], [3, 5], manul).clear(0, 4, 3).clear(7, 4, 3).clear(0, 2, 5).clear(7, 2, 5).clear(0, 2, 3).clear(7, 2, 3);   // the wide head
    g.box([2, 5], [5, 5], [3, 4], manul);                                             // the flat top
    g.set(0, 4, 4, manulDk).set(7, 4, 4, manulDk);                                    // ears, low and wide
    g.box([3, 4], [2, 3], [6, 6], manulLt).set(3, 3, 6, manulNose).set(4, 3, 6, manulNose);   // muzzle and a dusky nose
    g.set(2, 4, 5, INK).set(5, 4, 5, INK);                                            // round eyes
    g.set(1, 5, 4, manulLt).set(2, 5, 4, manulLt).set(5, 5, 4, manulLt).set(6, 5, 4, manulLt);   // pale brows
    g.set(1, 3, 5, manulDk).set(6, 3, 5, manulDk);                                    // cheek stripes
    g.box([0, 7], [0, 0], [6, 6], manul);                                             // the tail, round the front
    g.box([2, 5], [0, 1], [5, 5], manulLt);                                          // front paws, tucked
    g.set(0, 0, 5, manul).set(7, 0, 5, manulDk).set(7, 1, 5, manulDk);               // its dark tip, turned up
    return g.entry({ id: 'cand-p15-pallas-cat', name: "Pallas's Cat", story: 'It always looks cross. It is only cold.' });
  })(),

  // a kotatsu: a low wooden table over a red quilt that falls to the floor,
  // a pile of mikan on top, and a calico cat's head poking out of the front
  // of the quilt, eyes shut
  (() => {
    const g = grid(9, 7, 9);
    g.box([0, 8], [0, 0], [0, 7], quilt);                                             // the quilt, spread on the floor
    g.box([1, 7], [1, 3], [1, 6], quilt);
    g.box([0, 8], [4, 4], [0, 7], wood);                                              // the table top
    for (const [x, z] of [[4, 4], [3, 4], [5, 4], [4, 3], [4, 5]]) g.set(x, 5, z, mikan);
    g.set(4, 6, 4, mikan).set(4, 6, 5, leaf);                                          // a leaf on the top one
    g.box([3, 5], [0, 2], [7, 8], cream);                                             // the cat
    g.set(3, 3, 8, calico).set(5, 3, 8, calico).set(3, 2, 8, calico);                 // calico ears and patch
    g.set(3, 1, 8, INK).set(5, 1, 8, INK).set(4, 0, 8, BLUSH);
    return g.entry({ id: 'cand-p15-kotatsu', name: 'Kotatsu', story: 'Everyone said they would only sit in it for a minute.' });
  })(),

  // a pot-bellied stove: four short legs, a round iron belly, a door glowing
  // orange (and a slit of glow in each side, so it reads from behind too), a
  // collar, and the pipe going straight up. One iron, lit by the ramp; the
  // glow is kept flat so it glows rather than turns.
  (() => {
    const g = grid(7, 10, 7);
    for (const [x, z] of [[2, 2], [4, 2], [2, 4], [4, 4]]) g.set(x, 0, z, iron);
    lathe(g, [3, 3], 1, [2.3, 2.9, 2.9, 2.9, 2.3], iron);
    lathe(g, [3, 3], 6, [1.5], iron);
    g.box([3, 3], [7, 9], [3, 3], iron);                                               // the pipe
    g.box([2, 4], [2, 4], [5, 5], (x, y) => (x === 3 && y === 3 ? emberHot : ember));  // the door, aglow
    for (const x of [1, 5]) g.box([x, x], [2, 3], [3, 3], ember);                     // and a slit of glow each side
    return g.entry({ id: 'cand-p15-wood-stove', name: 'Wood Stove', fraction: 0.55, lit: { keep: [ember] }, story: 'It eats a lot. It gives it all back.' });
  })(),

  // an old leather ice skate, side on: a tall boot with a cream fur cuff,
  // a cream tongue crossed with red laces, a dark sole on three posts and a
  // silver blade turned up at the toe
  (() => {
    const g = grid(9, 9, 3);
    sheet(g, [
      'ffff.....',
      'bbbtt....',
      'bbbbt....',
      'bbbbbt...',
      'bbbbbbtt.',
      'dddddddd.',
    ], [0, 2], { f: cream, b: leather, t: cream, d: sole }, 0, 3);
    for (const [x, y] of [[4, 7], [5, 5], [7, 4]]) g.set(x, y, 1, lace);            // the laces, down the tongue
    sheet(g, [
      '.h..h..h.',
      '.h..h..hs',
      'sssssssss',
    ], [1, 1], { h: blade, s: blade });
    return g.entry({ id: 'cand-p15-ice-skate', name: 'Ice Skate', story: 'Three generations learned to fall over in it.' });
  })(),

  // a St Bernard pup sitting up: chestnut and white, a white blaze down its
  // face, floppy dark ears, and the little barrel on its collar
  (() => {
    const g = grid(7, 8, 7);
    g.box([1, 5], [0, 2], [0, 3], coat);                                              // the haunches
    g.box([2, 4], [1, 3], [3, 4], cream);                                             // the white chest
    for (const x of [2, 4]) g.box([x, x], [0, 2], [5, 5], cream);                     // front legs
    g.box([1, 5], [4, 6], [2, 5], coat).clear(1, 6, 5).clear(5, 6, 5);                // the head
    g.box([3, 3], [5, 6], [5, 5], cream);                                             // the blaze
    g.box([2, 4], [4, 4], [6, 6], cream).set(3, 4, 6, INK);                           // muzzle and nose, below the eyes
    g.set(2, 5, 5, INK).set(4, 5, 5, INK);
    for (const x of [0, 6]) g.box([x, x], [4, 6], [3, 3], coatDk);                    // floppy ears
    g.box([2, 4], [3, 3], [6, 6], (x) => (x === 3 ? barrel : woodDk));               // the barrel on its collar
    g.set(3, 1, 0, coat).set(3, 2, 0, coat);
    return g.entry({ id: 'cand-p15-st-bernard-pup', name: 'St Bernard Pup', story: 'It is learning the pass. So far it has found everyone.' });
  })(),

  // a marmot asleep for the winter, sitting hunched in a ring of straw: a
  // stocky pear of a body, its head bowed with its eyes shut, a dark muzzle,
  // small round dark ears, paws folded at its chest, a short dark tail out
  // behind, and a little snow settled on its back
  (() => {
    const g = grid(8, 8, 8);
    for (let z = 0; z < 8; z++) for (let x = 0; x < 8; x++) {
      const r = Math.hypot(x - 3.5, z - 3.5);
      if (r <= 3.9) g.set(x, 0, z, straw);
      if (r >= 2.9 && r <= 3.9) g.set(x, 1, z, straw);                               // the nest's rim
    }
    g.box([1, 6], [1, 3], [1, 5], marmot);                                            // the stocky body
    g.clear(1, 3, 1).clear(6, 3, 1).clear(1, 3, 5).clear(6, 3, 5);
    g.box([2, 5], [4, 4], [1, 5], marmot);                                            // hunched shoulders
    g.box([1, 6], [5, 6], [3, 6], marmot).clear(1, 6, 6).clear(6, 6, 6);             // the broad flat head, bowed
    g.box([3, 4], [5, 5], [7, 7], marmotDk);                                          // the dark muzzle
    g.set(2, 6, 6, INK).set(5, 6, 6, INK);                                            // shut eyes
    g.set(1, 7, 4, marmot).set(6, 7, 4, marmot);                                      // small round ears
    g.box([2, 5], [3, 3], [6, 6], marmot);                                            // paws folded at the chest
    g.box([3, 4], [1, 2], [0, 0], marmotDk);                                          // the short dark tail
    g.box([3, 4], [5, 5], [1, 2], frost);                                             // snow on its back
    return g.entry({ id: 'cand-p15-sleeping-marmot', name: 'Sleeping Marmot', story: 'It went to bed in September. Do not wake it before May.' });
  })(),

  // a Fair Isle bobble hat: a ribbed red cuff turned up wider than the hat
  // (the ribs are grooves, not paint), a navy band with a cream pattern, a
  // red domed crown, and a big cream bobble on a narrow top. The band is a
  // pattern, so the light runs softer across it (span 2).
  (() => {
    const g = grid(9, 10, 9);
    lathe(g, [4, 4], 0, [4.2, 4.2], (x, y, z) =>                                     // the turned-up cuff, ribbed:
      (Math.hypot(x - 4, z - 4) > 3.3 && (x + z) % 2 ? 0 : wool));                   // every other cube of its rim set back
    lathe(g, [4, 4], 2, [3.7, 3.7], (x, y, z) =>                                     // the Fair Isle band: navy, a cream
      (x === 4 || z === 4 || (y === 3 && Math.max(Math.abs(x - 4), Math.abs(z - 4)) === 3 && Math.abs(x - 4) + Math.abs(z - 4) === 4) ? cream : navy));   // cross on each side
    lathe(g, [4, 4], 4, [3.1, 2.5, 1.5], wool);                                       // the domed crown
    g.ellipsoid([4, 8, 4], [2.4, 1.5, 2.4], cream);                                   // the big bobble
    return g.entry({ id: 'cand-p15-bobble-hat', name: 'Bobble Hat', fraction: 0.6, lit: { span: 2 }, story: 'Knitted the winter before last. Still warm from whoever made it.' });
  })(),
];
