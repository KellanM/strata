// Page 17 · I Woodsmoke: for chapter V, Autumn Woods ("leaf fall, woodsmoke,
// things gathered for winter"): what gathers, naps and nods off before
// winter. Palette: Autumn (a mauve sky going to amber at the bottom, so
// bodies lean away from amber: chocolate, apple green, deep red, black and
// white). Live levels already in the chapter: Mushroom, Turkey, Chestnut
// Cart, Scarecrow, Pumpkin, Beaver & Birch, Curled Fox, Fox, Mushroom Log,
// Maple Bonsai, Owl, Young Stag, Boar Piglet.
//
// Aimed at Kellan's picks from pages 15 and 16 (Highland Cow, Broody Hen,
// Yawning Hippo, Akabeko, Basket Dog, Ice Lolly, Grapes, Monk...): a chunky
// body in one bold flat colour with one strong accent, a creature caught in
// the thing it does, a folk toy, a food icon on a stick, and a dry joke.
//
// Silhouette first (docs/voxel-study.md, "Silhouette and character"). Each
// idea as name / identity feature that sets the outline / pose / colour parts:
//  kept  Moose        palm antlers, wider than the body       browsing, a leaf in its mouth   chocolate, bone antlers, red leaf
//  kept  Hamster      cheek pouches stuffed past the head     both paws on one more acorn     ginger, cream cheeks and belly, acorn
//  kept  Skunk        the plume tail up, as tall as the body  tail raised, looking at you     black, one white stripe
//  kept  Dala Horse   a carved block horse, notch under it    standing to attention           red, a painted saddle, black mane
//  kept  Toffee Apple the stick out of the top                just dipped, toffee running     apple green, toffee, wood
//  kept  Pheasant     the long tail, raked up behind          strolling across the lane       copper, green head, red face, white ring
//  out   Porcupine    quills fanned up                        the Hedgehog's spiky outline again
//  out   Bison        the shoulder hump                       a second big hoofed beast after the Moose
//  out   Canada Goose the long black neck                     a thin shaft, and it is leaving, not gathering
//  out   Corn Dolly   a plaited straw figure                  needs a caption; reads as a wheat sheaf or a bell
//  out   Hanging Bat  upside down, wrapped in its wings        Little Bat and Crystal Bat have the outline
//  out   Yarn Basket  needles crossed over a ball of wool     needles are thin shafts; the ball alone is a sphere
//  out   Cocoa Mug    marshmallows over the rim               Cat in a Mug and Teacup own the mug
// Faces and details look toward +z / +x.
import { grid } from '../voxel.js';
import { INK, pair, pairZ, pairFront, front, flank, tint, sheet } from './kit.js';

// Flat material colours: the game's light does the shading.
const moose = 0x6e4630, mooseDk = 0x3f2c28, antler = 0xeadbb8, leaf = 0xd8402e,
  hamster = 0xd9803e, cheek = 0xfbf1de, ear = 0xf6b4a8, nut = 0x8a5634, cap = 0x5a3a2a, paw = 0xf3a3a8,
  skunk = 0x34303c, stripe = 0xf8f4ec, nose = 0xf08aa2,
  dala = 0xd8322e, saddle = 0x2f6fb8, trim = 0xf6d365, mane = 0x2a2630,
  apple = 0x8cc04a, toffee = 0xb8262e, stick = 0xe8cf9a,
  copper = 0xc0622e, cock = 0x2f6a4e, wattle = 0xe0302e, ring = 0xfbf8f2, tail = 0x8a5236, beak = 0xf0d08a;

export default [
  // MOOSE
  //   identity: flat palm antlers, the full width, over a heavy head
  //   pose: browsing, head down, a red maple leaf hanging from its lip
  //   parts: chocolate body, bone antlers, dark legs; the leaf the accent
  (() => {
    const g = grid(9, 9, 7);
    for (const x of [3, 5]) for (const z of [0, 3]) g.box([x, x], [0, 1], [z, z], mooseDk);   // long legs
    g.box([2, 6], [2, 4], [0, 4], moose);                                                // the body
    g.box([2, 6], [5, 5], [2, 4], moose).box([3, 5], [6, 6], [3, 4], moose);             // the big shoulder hump
    g.box([3, 5], [4, 6], [5, 5], moose);                                                // the head
    g.box([3, 5], [3, 4], [6, 6], moose).clear(3, 4, 6).clear(5, 4, 6);                 // the long drooping nose
    g.set(4, 2, 5, moose);                                                               // the bell under the chin
    pair(g, 3, 5, 6, INK);                                                               // eyes
    g.set(4, 2, 6, leaf).set(4, 1, 6, leaf);                                             // a maple leaf, mid-chew
    for (const z of [4, 5]) {                                                            // the palm antlers, both sides
      pair(g, 2, 6, z, antler); pair(g, 1, 6, z, antler);
      pair(g, 0, 7, z, antler); pair(g, 1, 7, z, antler); pair(g, 2, 7, z, antler);
    }
    pair(g, 0, 8, 5, antler); pair(g, 2, 8, 5, antler);                                  // and their tines
    return g.entry({ id: 'cand-p17-moose', name: 'Moose', seed: 4, story: 'It eats the leaves before they fall. It says it is helping.' });
  })(),

  // HAMSTER
  //   identity: cheek pouches stuffed so full they stick out past the head
  //   pose: sat up, both paws round one more acorn it has no room for
  //   parts: ginger coat, cream cheeks and belly, a brown acorn
  (() => {
    const g = grid(9, 7, 7);
    g.ellipsoid([4, 3, 3], [2.6, 3.0, 2.4], cheek);                                      // the round body, all head
    tint(g, (x, y, z) => y >= 4 || z <= 1, hamster);                                     // the ginger cap and back
    for (const cx of [1.6, 6.4]) g.ellipsoid([cx, 2.5, 3.6], [1.4, 1.4, 1.4], cheek);    // the stuffed cheeks
    pairFront(g, 3, 3, INK);                                                              // eyes, low and wide
    front(g, 4, 2, paw);                                                                  // the nose
    pair(g, 2, 5, 2, ear); pair(g, 2, 6, 2, hamster);                                    // little round ears, set wide
    g.set(4, 0, 6, nut).set(4, 1, 6, nut).set(4, 2, 6, cap);                             // the acorn,
    pair(g, 3, 1, 6, paw);                                                               // held in both paws
    return g.entry({ id: 'cand-p17-hamster', name: 'Hamster', story: 'Both cheeks are full. It is still deciding where the acorn goes.' });
  })(),

  // SKUNK
  //   identity: the plume tail held straight up, as tall as the body is long
  //   pose: tail raised, head turned to you, entirely unbothered
  //   parts: black coat, one white stripe from the brow up the tail
  (() => {
    const g = grid(9, 8, 5);
    g.box([2, 6], [1, 3], [1, 3], skunk).clear(2, 3, 1).clear(2, 3, 3);                 // the body
    for (const x of [2, 6]) pairZ(g, x, 0, 1, skunk);                                     // stub legs
    g.box([6, 8], [1, 3], [1, 3], skunk).clear(8, 3, 1).clear(8, 3, 3);                 // the head
    g.set(8, 1, 1, 0).set(8, 1, 3, 0);
    g.box([0, 1], [2, 6], [1, 3], skunk);                                                // the tail, straight up
    g.box([1, 3], [7, 7], [1, 3], skunk).set(0, 7, 2, skunk);                            // its plume, tipped forward
    g.box([2, 7], [3, 3], [2, 2], stripe).set(8, 3, 2, stripe);                          // the white stripe, brow to tail
    g.box([1, 1], [4, 6], [2, 2], stripe).box([1, 2], [7, 7], [2, 2], stripe);
    g.set(1, 3, 2, stripe);
    g.set(8, 2, 1, stripe).set(8, 2, 3, stripe);                                         // eyes catching the light
    g.set(8, 1, 2, nose);                                                                // the nose
    return g.entry({ id: 'cand-p17-skunk', name: 'Skunk', lit: { span: 2 }, story: 'Everyone in the wood is very polite to it. It has never had to ask twice.' });
  })(),

  // DALA HORSE
  //   identity: the carved block horse, head up, legs a plank with the
  //   notch cut out under the belly
  //   pose: standing to attention, as it has since it was whittled by the fire
  //   parts: red body, a blue saddle cloth with a yellow edge, a black mane
  (() => {
    const g = grid(9, 9, 3);
    sheet(g, [
      '......R..',
      '.....MRR.',
      '.....MRRR',
      '.....MR.R',
      '.RRRRRR..',
      'TRRRRRRR.',
      'TRRRRRRR.',
      '.RR...RR.',
      '.RR...RR.',
    ], [0, 2], { R: dala, M: mane, T: mane });
    for (const x of [1, 2, 6, 7]) g.clear(x, 0, 1).clear(x, 1, 1);                      // legs, a pair each end
    g.clear(0, 2, 0).clear(0, 3, 0).clear(0, 2, 2).clear(0, 3, 2);                       // a thin tail
    g.box([2, 4], [4, 4], [0, 2], trim);                                                 // the saddle, on top
    for (const z of [0, 2]) g.box([2, 4], [2, 3], [z, z], saddle).set(3, 2, z, trim);   // the cloth on each flank
    flank(g, 7, 6, INK);                                                                 // eyes
    return g.entry({ id: 'cand-p17-dala-horse', name: 'Dala Horse', story: 'Whittled by the stove one long winter. It has stood very straight ever since.' });
  })(),

  // TOFFEE APPLE
  //   identity: the stick up out of the top of a round apple
  //   pose: just dipped and set stick-up on the tray, the toffee pooled
  //   into a foot and the green apple bare round the stick
  //   parts: green apple, red toffee coat and its foot, a pale stick
  (() => {
    const g = grid(7, 9, 7);
    g.cylinder('y', [3, 3], 3.2, [0, 0], toffee);                                        // the toffee pooled into a foot
    g.ellipsoid([3, 3.4, 3], [2.9, 2.7, 2.9], apple);                                    // the apple
    tint(g, (x, y, z) => y <= 5 && !(y === 5 && Math.abs(x - 3) + Math.abs(z - 3) <= 1), toffee);   // the coat, bare round the stick
    g.box([3, 3], [6, 8], [3, 3], stick);                                                // the stick
    return g.entry({ id: 'cand-p17-toffee-apple', name: 'Toffee Apple', story: 'Bought at the bonfire. It will be finished some time next week.' });
  })(),

  // PHEASANT
  //   identity: the long barred tail raked up behind, longer than the bird
  //   pose: strolling across the lane, head up, in no hurry at all
  //   parts: copper body, bottle-green head, a red face, a white collar
  (() => {
    const g = grid(10, 7, 3);
    g.ellipsoid([5.3, 2.7, 1], [2.9, 1.7, 1.5], copper);                                 // the body
    g.box([4, 4], [0, 1], [1, 1], beak).box([6, 6], [0, 1], [1, 1], beak);               // legs, mid-stride
    g.box([7, 8], [3, 3], [0, 2], ring);                                                 // the white collar
    g.box([7, 8], [4, 5], [0, 2], cock);                                                 // the green head
    g.box([9, 9], [4, 4], [1, 1], beak);                                                 // the beak
    flank(g, 8, 5, wattle); flank(g, 8, 4, wattle);                                      // the red face
    g.box([0, 0], [5, 6], [1, 1], tail).box([1, 1], [4, 5], [1, 1], tail)                // the long tail, raked
      .box([2, 2], [3, 4], [1, 1], tail).box([3, 3], [3, 3], [1, 1], tail);
    return g.entry({ id: 'cand-p17-pheasant', name: 'Pheasant', story: 'It crosses the lane slowly. It has right of way, and it knows it.' });
  })(),
];
