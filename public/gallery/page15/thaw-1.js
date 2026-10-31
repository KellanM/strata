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
import { grid } from '../voxel.js';
import { INK, BLUSH, S, pair, quad, lathe, sheet } from './kit.js';

const { frost, ember, emberHot, cream } = S;
const lion = 0xf7f3ea, lionDk = 0xdcd4c6, mane = 0x4fb3a9, maneDk = 0x37908a, gold = 0xe9b949,
  manul = 0xa79e95, manulLt = 0xe6ddd2, manulDk = 0x6f655d,
  quilt = 0xc8464f, quiltDk = 0x9e3440, wood = 0x9a6a44, woodDk = 0x6b4a3a, mikan = 0xf2a03d, leaf = 0x5fae6e, calico = 0xe08a3c,
  iron = 0x4a4446, ironLt = 0x6d6567,
  leather = 0x8a5a3c, leatherDk = 0x6b4a3a, blade = 0xc9d1d9, lace = 0xe0565b,
  coat = 0xb5653a, coatDk = 0x7a4128, barrel = 0xc8904f,
  marmot = 0xb08560, marmotDk = 0x7f5b3f, marmotLt = 0xe0c4a0, straw = 0xe0c27a, strawDk = 0xc4a35c,
  wool = 0xd2464f, navy = 0x2f4a7a;

export default [
  // a snow lion of the high monasteries, sitting up and facing you: a white
  // body, a great square turquoise mane framing a white face, gold eyes'
  // worth of dignity in two ink dots, a pink nose, and its tail held up
  // behind with a turquoise tuft
  (() => {
    const g = grid(7, 9, 7);
    g.box([1, 5], [0, 2], [0, 3], lion);                                              // the haunches
    g.box([2, 4], [1, 4], [3, 4], lion);                                              // the chest
    for (const x of [2, 4]) g.box([x, x], [0, 2], [5, 5], lion).set(x, 0, 6, lionDk); // front legs and paws
    g.box([0, 6], [3, 8], [2, 4], mane).clear(0, 8, 2).clear(6, 8, 2).clear(0, 3, 4).clear(6, 3, 4);
    g.box([0, 6], [3, 3], [2, 4], (x, y, z) => (g.get(x, y, z) ? maneDk : 0));      // the mane's dark underside
    g.box([1, 5], [4, 7], [5, 5], lion);                                              // the face
    g.set(2, 6, 5, INK).set(4, 6, 5, INK);
    g.box([2, 4], [4, 4], [6, 6], lion).set(3, 5, 6, BLUSH);                          // muzzle and nose
    g.set(1, 8, 5, mane).set(5, 8, 5, mane).set(3, 8, 5, gold);                       // curls over the brow, a gold jewel
    g.set(6, 1, 0, lion).set(6, 2, 0, lion).set(6, 3, 0, mane).set(6, 4, 0, mane).set(5, 4, 0, mane);   // the tail and its tuft
    return g.entry({ id: 'cand-p15-snow-lion', name: 'Snow Lion', story: 'It guards the top of the mountain. Nobody has asked it from what.' });
  })(),

  // a Pallas's cat in a loaf: a wide flat head with tiny ears set out at
  // the sides, a pale muzzle and brows, round eyes, dark cheek stripes, and
  // its thick ringed tail wrapped round its front paws
  (() => {
    const g = grid(8, 6, 7);
    g.box([1, 6], [0, 2], [0, 4], manul).box([2, 5], [3, 3], [0, 2], manul);         // the loaf
    g.box([0, 7], [2, 4], [3, 5], manul).clear(0, 4, 3).clear(7, 4, 3).clear(0, 2, 5).clear(7, 2, 5);   // the wide head
    g.box([1, 6], [5, 5], [3, 4], manul);                                             // the flat top
    g.set(0, 4, 4, manulDk).set(7, 4, 4, manulDk);                                    // ears, low and wide
    g.box([3, 4], [2, 3], [6, 6], manulLt).set(3, 3, 6, BLUSH).set(4, 3, 6, BLUSH);   // muzzle and nose
    g.set(2, 4, 5, INK).set(5, 4, 5, INK);                                            // round eyes
    g.set(1, 5, 4, manulLt).set(2, 5, 4, manulLt).set(5, 5, 4, manulLt).set(6, 5, 4, manulLt);   // pale brows
    g.set(1, 3, 5, manulDk).set(6, 3, 5, manulDk);                                    // cheek stripes
    for (let x = 0; x <= 7; x++) g.set(x, 0, 6, x % 2 ? manulDk : manul);             // the ringed tail, round the front
    g.box([2, 5], [0, 1], [5, 5], manulLt);                                          // front paws, tucked
    g.set(0, 0, 5, manul).set(7, 0, 5, manulDk).set(7, 1, 5, manulDk);
    return g.entry({ id: 'cand-p15-pallas-cat', name: "Pallas's Cat", story: 'It always looks cross. It is only cold.' });
  })(),

  // a kotatsu: a low wooden table over a red quilt that falls to the floor,
  // a pile of mikan on top, and a calico cat's head poking out of the front
  // of the quilt, eyes shut
  (() => {
    const g = grid(9, 7, 9);
    g.box([0, 8], [0, 0], [0, 7], quiltDk);
    g.box([1, 7], [1, 3], [1, 6], (x, y) => (y === 1 ? cream : quilt));               // the quilt, a cream hem
    g.box([0, 8], [4, 4], [0, 7], (x, y, z) => (x === 0 || x === 8 || z === 0 || z === 7 ? woodDk : wood));
    for (const [x, z] of [[4, 4], [3, 4], [5, 4], [4, 3], [4, 5]]) g.set(x, 5, z, mikan);
    g.set(4, 6, 4, mikan).set(4, 6, 5, leaf);                                          // a leaf on the top one
    g.box([3, 5], [0, 2], [7, 8], cream);                                             // the cat
    g.set(3, 3, 8, calico).set(5, 3, 8, INK).set(3, 2, 8, calico);                    // calico ears and patch
    g.set(3, 1, 8, INK).set(5, 1, 8, INK).set(4, 0, 8, BLUSH);
    return g.entry({ id: 'cand-p15-kotatsu', name: 'Kotatsu', story: 'Everyone said they would only sit in it for a minute.' });
  })(),

  // a pot-bellied stove: four short legs, a round iron belly with rims, a
  // door glowing orange, a collar, and the pipe going straight up
  (() => {
    const g = grid(7, 10, 7);
    quad(g, 2, 0, 2, iron);
    lathe(g, [3, 3], 1, [2.3, 2.9, 2.9, 2.9, 2.3], (x, y) => (y === 1 || y === 5 ? ironLt : iron));
    lathe(g, [3, 3], 6, [1.5], ironLt);
    g.box([3, 3], [7, 9], [3, 3], iron);                                               // the pipe
    g.box([2, 4], [2, 4], [5, 5], (x, y) => (x === 3 && y === 3 ? emberHot : ember));  // the door, aglow
    return g.entry({ id: 'cand-p15-wood-stove', name: 'Wood Stove', fraction: 0.55, story: 'It eats a lot. It gives it all back.' });
  })(),

  // an old leather ice skate, side on: a tall boot with a cream fur cuff,
  // a cream tongue crossed with red laces, a dark sole on two posts and a
  // silver blade turned up at the toe
  (() => {
    const g = grid(9, 9, 3);
    sheet(g, [
      'ffff.....',
      'bbbtl....',
      'bbbbt....',
      'bbbbbl...',
      'bbbbbbtl.',
      'dddddddd.',
    ], [0, 2], { f: cream, b: leather, t: cream, l: lace, d: leatherDk }, 0, 3);
    sheet(g, [
      '.h....h..',
      '.h....h.s',
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
    g.box([2, 4], [4, 4], [6, 6], cream).set(3, 5, 6, INK);                           // muzzle and nose
    g.set(2, 5, 5, INK).set(4, 5, 5, INK);
    for (const x of [0, 6]) g.box([x, x], [4, 6], [3, 3], coatDk);                    // floppy ears
    g.box([2, 4], [3, 3], [6, 6], (x) => (x === 3 ? barrel : woodDk));               // the barrel on its collar
    g.set(3, 1, 0, coat).set(3, 2, 0, coat);
    return g.entry({ id: 'cand-p15-st-bernard-pup', name: 'St Bernard Pup', story: 'It is learning the pass. So far it has found everyone.' });
  })(),

  // a marmot asleep for the winter, curled in a ring of straw: its pale face
  // turned to you with its eyes shut, small round ears, and snow settled on
  // its back like a blanket
  (() => {
    const g = grid(8, 6, 8);
    for (let z = 0; z < 8; z++) for (let x = 0; x < 8; x++) {
      const r = Math.hypot(x - 3.5, z - 3.5);
      if (r <= 3.9) g.set(x, 0, z, straw);
      if (r >= 2.9 && r <= 3.9) g.set(x, 1, z, (x + z) % 2 ? straw : strawDk);
    }
    g.box([1, 6], [1, 3], [1, 5], marmot).clear(1, 3, 1).clear(6, 3, 1);            // the curled body
    g.box([2, 5], [4, 4], [1, 4], frost);                                             // snow on its back
    g.box([2, 5], [1, 3], [6, 6], marmotLt);                                          // the face
    g.set(2, 2, 6, marmotDk).set(5, 2, 6, marmotDk).set(3, 1, 7, INK).set(4, 1, 7, INK);   // shut eyes, the nose
    g.set(2, 4, 5, marmotDk).set(5, 4, 5, marmotDk);                                  // round ears
    g.box([6, 6], [1, 1], [6, 7], marmotDk);                                          // the tail round the front
    return g.entry({ id: 'cand-p15-sleeping-marmot', name: 'Sleeping Marmot', story: 'It went to bed in September. Do not wake it before May.' });
  })(),

  // a Fair Isle bobble hat: a turned-up cream cuff, a navy band with a cream
  // pattern, red wool to the crown, and a big cream bobble
  (() => {
    const g = grid(7, 10, 7);
    lathe(g, [3, 3], 0, [3.2, 3.2], cream);
    lathe(g, [3, 3], 2, [2.9, 2.8, 2.6, 2.2, 1.5],
      (x, y, z) => (y === 2 ? wool : y === 3 ? (x === 3 || z === 3 ? cream : navy) : y === 4 ? navy : wool));
    g.ellipsoid([3, 8, 3], [1.6, 1.5, 1.6], cream);
    return g.entry({ id: 'cand-p15-bobble-hat', name: 'Bobble Hat', story: 'Knitted the winter before last. Still warm from whoever made it.' });
  })(),
];
