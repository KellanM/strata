// Page 16 · I Things That Grow: for The Orchard ("things that grow"): fruit,
// flowers and the slow creatures who live among them. The chapter already has
// Apple, Avocado, Tulip, Sloth, Hornbill, Sunflower, Koala, Bonsai, Pine,
// Wisteria Bonsai and The First Seed, so these go round them.
//
// Silhouette first (docs/voxel-study.md, "Silhouette and character"). Each
// idea was written down as a name, the feature that sets its outline, its
// pose and its colour parts before it was built:
//
//   Orangutan     a big leaf held up as an umbrella sets the top and width;
//                 sheltering; rust coat / peach face / leaf green
//   Inchworm      the arch, with the gap under it, is the whole outline;
//                 inching; lime body / brown twig
//   Lemur         the ringed tail standing tall beside it, hooked over;
//                 sitting up; grey coat / white mask and rings / dark rings
//   Grapes        the bunch tapering to a point, a vine leaf at the top;
//                 hanging; purple / leaf green / brown stem
//   Pomegranate   a round fruit with a pointed crown on top, split at the
//                 front; ripe, bursting; red skin / dark crown / deep seeds
//   Aubergine     a fat teardrop standing and leaning, a spiky green cap;
//                 standing; deep purple / green cap
//
// Tried and dropped: Hummingbird (wings, beak and trumpet flower turned to
// noise at 40 px), Bananas (a hand of three: the dark tips faced the camera
// as spots), Banana half peeled (read as a corn cob; the flaps keep fill under
// 25%), and on paper Slow Loris, Macaw (too near the Hornbill), Fuchsia,
// Apple Core (too near the Apple) and Bird of Paradise (needs a caption).
//
// Flat material colours: the game's light (lit() in shapes.js) shades them.
// Faces and details look toward +x / +z. Palette: Orchard (sage to gold).
import { grid } from '../voxel.js';
import { INK, pair, front, out, tint } from './kit.js';

const rust = 0xb8582a, face = 0xf2c9a0, palm = 0x5a3c30, leaf = 0x5fae6e, rib = 0x3f7a4b,
  lime = 0xa8d45a, twig = 0x8a5a3c, twigLeaf = 0x3f8a5b,
  lemur = 0xa89e98, white = 0xf6f2ea, ring = 0x3a3442,
  grape = 0x7b4f9e, vine = 0x6aa84f, stem = 0x8a5a3c,
  pome = 0xe0565b, crownRed = 0x9a3a3a, seed = 0x8a1a34,
  aubergine = 0x5e3a7a, calyx = 0x5f9e4e;

export default [
  // a baby orangutan sitting with a big leaf held over her head on its
  // stalk, one long arm up, the other hanging to the ground
  (() => {
    const g = grid(9, 10, 6);
    g.ellipsoid([4, 1.5, 2.5], [2.5, 1.8, 2.0], rust);                                // the body, sitting
    g.ellipsoid([4, 4.4, 2.8], [2.7, 1.9, 2.1], rust);                                // the big head
    for (let x = 3; x <= 5; x++) for (let y = 3; y <= 5; y++) front(g, x, y, face);  // the bare face
    out(g, 4, 3, face);                                                               // its muzzle
    front(g, 3, 5, INK); front(g, 5, 5, INK);                                         // eyes
    g.set(4, 6, 2, rust).set(4, 7, 2, rust);                                          // a spiky tuft
    g.box([7, 7], [2, 7], [1, 2], rust).box([7, 7], [8, 8], [1, 2], palm);            // the long arm up, the hand
    g.box([1, 1], [1, 2], [2, 3], rust).set(1, 0, 3, palm).set(1, 0, 2, rust);        // the other arm, knuckles down
    pair(g, 3, 0, 3, palm);                                                           // feet
    g.ellipsoid([4.5, 9, 1.5], [4.6, 0.6, 2.3], leaf);                                // the leaf, held up
    g.box([1, 7], [9, 9], [1, 1], rib);                                               // its midrib, from the stalk
    g.set(0, 9, 1, leaf).box([0, 0], [8, 8], [1, 2], leaf).set(8, 8, 1, leaf);         // the tip and the far edge droop
    return g.entry({ id: 'cand-p16-orangutan', name: 'Orangutan', seed: 2, story: 'It is not raining. She would like to be ready if it does.' });
  })(),

  // an inchworm on a twig, mid-inch: its body drawn up into an arch, the
  // head end planted and looking at you
  (() => {
    const g = grid(10, 6, 3);
    g.box([0, 9], [0, 0], [0, 1], twig);                                              // the twig
    g.set(9, 1, 0, twigLeaf).set(9, 2, 0, twigLeaf).set(8, 2, 0, twigLeaf);           // a leaf at its end
    g.layers(1, [
      ['ll......ll', 'll......ll'],
      ['.ll....lll', '.ll....lll'],
      ['.ll....ll.', '.ll....ll.'],
      ['..llllll..', '..llllll..'],
      ['...llll...', '...llll...'],
    ], { l: lime });                                                                  // the arch, back feet to head
    g.box([8, 9], [1, 2], [2, 2], lime);                                              // the head, a little bigger
    g.set(8, 2, 2, INK).set(9, 2, 1, INK);                                            // eyes, round the corner
    return g.entry({ id: 'cand-p16-inchworm', name: 'Inchworm', story: 'It has measured the whole branch twice and got two different answers.' });
  })(),

  // a ring-tailed lemur sitting up, its ringed tail standing tall beside
  // it, hooked over at the tip
  (() => {
    const g = grid(8, 10, 5);
    g.ellipsoid([3, 2.0, 2.2], [1.9, 2.1, 1.6], lemur);                               // the body
    for (let y = 1; y <= 3; y++) front(g, 3, y, white);                               // a pale belly
    g.box([1, 5], [4, 6], [1, 3], lemur);                                             // the head
    for (const [x, z] of [[1, 1], [5, 1]]) g.clear(x, 6, z).clear(x, 4, z);           // rounded off
    g.box([1, 5], [4, 5], [3, 3], white);                                             // the white mask
    g.set(2, 5, 3, INK).set(4, 5, 3, INK);                                            // dark eye patches
    g.set(3, 4, 4, INK);                                                              // the nose
    g.set(1, 7, 2, lemur).set(5, 7, 2, lemur);                                        // pointed ears
    g.set(2, 0, 3, lemur).set(4, 0, 3, lemur);                                        // feet
    g.box([5, 6], [1, 1], [1, 2], ring);                                              // the tail, round behind
    for (let y = 1; y <= 8; y++) g.box([7, 7], [y, y], [1, 2], y % 2 ? ring : white); // and standing up, ringed
    g.box([6, 7], [9, 9], [1, 2], ring);                                              // hooked over at the tip
    return g.entry({ id: 'cand-p16-lemur', name: 'Lemur', seed: 3, lit: { span: 2 }, story: 'It holds its tail up so the others can find it. Nobody has ever got lost.' });
  })(),

  // a bunch of purple grapes hanging from a short stem, a vine leaf at the top
  (() => {
    const g = grid(7, 10, 5);
    const berries = [
      [1, 7, 2], [3, 7, 2], [5, 7, 2], [2, 7, 3], [4, 7, 3],
      [2, 5, 2], [4, 5, 2], [3, 5, 3], [1, 6, 1], [5, 6, 1],
      [2, 3, 2], [4, 3, 2], [3, 3, 3], [3, 4, 1],
      [3, 1, 2],
    ];
    for (const b of berries) g.ellipsoid(b, [1, 1, 1], grape);
    g.set(3, 9, 2, stem).set(3, 8, 2, stem);                                          // the stem
    g.box([4, 6], [9, 9], [1, 3], vine).set(5, 8, 1, vine).set(6, 8, 2, vine);        // the vine leaf
    return g.entry({ id: 'cand-p16-grapes', name: 'Grapes', seed: 3, lit: { span: 2 }, story: 'Picked in the morning, before the wasps were up.' });
  })(),

  // a pomegranate with its little crown on top, split open at the front
  // corner to show the deep red seeds packed inside
  (() => {
    const g = grid(7, 8, 7);
    g.ellipsoid([3, 2.8, 3], [3.0, 2.8, 3.0], pome);                                  // the fruit
    g.box([2, 4], [6, 6], [2, 4], crownRed).clear(3, 6, 3);                           // the crown, a ring
    for (const x of [2, 4]) for (const z of [2, 4]) g.set(x, 7, z, crownRed);         // and its four points
    const split = (x, y, z) => x >= 4 && z >= 4 && y >= 2 && y <= 4;                  // a wedge out of the front corner
    tint(g, (x, y, z) => !split(x, y, z) && (split(x + 1, y, z) || split(x, y, z + 1) || split(x, y + 1, z)), seed);   // the seeds, packed
    tint(g, split, 0);                                                                // and cut away
    return g.entry({ id: 'cand-p16-pomegranate', name: 'Pomegranate', story: 'Six hundred seeds inside, and it knows exactly where each one is.' });
  })(),

  // an aubergine standing up, fat at the bottom, leaning as it narrows,
  // its green cap spread in points over the shoulders and a bent stalk
  (() => {
    const g = grid(7, 10, 7);
    [1.6, 2.4, 2.7, 2.6, 2.2, 1.8, 1.4, 1.2].forEach((r, y) => g.cylinder('y', [3.6 - 0.18 * y, 3], r, [y, y], aubergine));
    tint(g, (x, y) => y >= 6, calyx);                                                 // the cap
    for (const [x, z] of [[4, 3], [1, 3], [2, 5], [2, 1]]) g.set(x, 5, z, calyx);     // its points, over the shoulders
    g.set(2, 8, 3, calyx).set(2, 9, 3, calyx).set(3, 9, 3, calyx);                   // the stalk, bent
    return g.entry({ id: 'cand-p16-aubergine', name: 'Aubergine', story: 'It took all summer to get this shade. It would like that noticed.' });
  })(),
];
