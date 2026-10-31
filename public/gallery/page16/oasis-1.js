// Page 16 · II Palm Shade: for chapter VIII, Desert Oasis ("heat shimmer,
// palm shade, cool water"): what the caravan carries, and who waits by the
// water. Palette: Desert (a sand-gold sky, so bodies lean away from gold:
// lilac, rust, olive, cream). Live levels already in the chapter: Cactus,
// Meerkat Lookout, Ostrich, Hooded Falcon, Chameleon, Fennec Fox,
// Caravanserai, Kasbah Tower, Brass Lantern, Camel Calf, Date Palm Spring.
//
// Silhouette first. Each idea as name / identity feature that sets the
// outline / signature pose / colour parts:
//  kept  Hippo     the yawn: jaws open into a V notch     yawning in the pool        lilac, pink mouth, water
//  kept  Scorpion  tail curled over the back, claws up    on guard                   rust body, dark claws
//  kept  Cobra     the hood, wider than the basket        rising out of the basket   olive, cream belly, wicker
//  kept  Oil Lamp  spout one end, handle loop the other   lit at the spout           brass, dark brass, flame
//  kept  Scales    a T beam with two hanging pans          tipped by a heavier pan    brass, wood, spice
//  kept  Giraffe   the neck, and the legs under it          walking, face turned       tan patches, cream legs
//  out   Vulture   hunched shoulders over a bald head      a perched bird, too close to the Hooded Falcon
//  out   Crocodile long toothy snout                       open jaws again (the Hippo) and long and low (the Lamp)
//  out   Caracal   black ear tufts                         a third big-eared desert cat after Fennec and Sand Cat
//  out   Nubian Ibex  swept-back horns                     the Hill Ram and Mountain Goat own that outline
//  out   Darbuka   a goblet drum                           reads as a vase at 40 px
//  out   Prickly Pear  paddles and red fruit               a second cactus in a chapter that has one
//  out   Pomegranate   the crown                           fruit belongs to The Orchard section
// Faces and details look toward +z / +x.
import { grid } from '../voxel.js';
import { INK, pair, tint } from './kit.js';

// Flat material colours: the game's light does the shading.
const hippo = 0x9d8fb4, mouth = 0xf08aa2, tusk = 0xfbf8f2, pool = 0x4fa8cf,
  rust = 0xc8673a, claw = 0x6e3a2c, sting = 0x2f2a36,
  olive = 0x6f9a3e, belly = 0xf1e3a6, wicker = 0xb9824a, tongue = 0xe0434b,
  brass = 0xe0ad45, brassDk = 0x94662c, flame = 0xfff0a8, flameHot = 0xe2522e,
  wood = 0x6b4a3a, paprika = 0xc8323a, saffron = 0xf07a2a,
  cream = 0xfaf0d8, patch = 0xd98a46, hoof = 0x5a3a2e, muzzle = 0x9a6a4a;

export default [
  // a hippo up to its middle in the pool, mid-yawn: the jaws open wide, a
  // pink mouth, two little tusks, eyes and ears on top of its head
  (() => {
    const g = grid(9, 7, 8);
    g.ellipsoid([4, 0, 3.5], [4.6, 0.5, 4.2], pool);                                    // the pool
    g.ellipsoid([4, 1.4, 2.3], [3.7, 2.3, 2.6], hippo);                                 // the back, half under
    g.box([1, 7], [2, 4], [2, 4], hippo).clear(1, 4, 2).clear(7, 4, 2);                 // the head
    g.box([2, 6], [1, 1], [5, 7], hippo);                                               // the lower jaw, dropped
    g.box([3, 5], [1, 1], [5, 6], mouth).box([3, 5], [2, 3], [4, 4], mouth);            // tongue and throat
    g.box([2, 6], [4, 4], [5, 5], hippo).box([2, 6], [5, 5], [5, 7], hippo)             // the upper jaw, thrown up
      .box([2, 6], [6, 6], [6, 7], hippo).clear(2, 6, 7).clear(6, 6, 7);
    g.box([3, 5], [4, 4], [5, 5], mouth).box([3, 5], [5, 5], [6, 7], mouth);            // its pink underside
    pair(g, 2, 2, 7, tusk); pair(g, 2, 3, 7, tusk);                                     // tusks
    for (const x of [1, 7]) g.set(x, 5, 3, hippo).set(x, 5, 4, INK).set(x, 6, 3, hippo);   // eye bumps and ears
    tint(g, (x, y) => y === 0, pool);                                                   // the waterline
    return g.entry({ id: 'cand-p16-yawning-hippo', name: 'Yawning Hippo', fraction: 0.6, story: 'It has been waiting by the water since before the water.' });
  })(),

  // a little scorpion on guard: claws up and open, tail arched high over its
  // back with the sting held forward over its head, big eyes on the front
  (() => {
    const g = grid(8, 7, 7);
    g.box([2, 5], [0, 1], [1, 2], rust).clear(2, 1, 1).clear(5, 1, 1);                  // the body
    g.box([2, 5], [0, 2], [3, 5], rust).clear(2, 2, 3).clear(5, 2, 3);                  // the head, big
    pair(g, 2, 2, 5, INK);                                                              // eyes
    g.box([0, 1], [0, 2], [4, 5], claw).box([6, 7], [0, 2], [4, 5], claw);              // the claws
    for (const y of [0, 2]) { pair(g, 0, y, 6, claw); pair(g, 1, y, 6, claw); }         // pincers, open
    for (const z of [1, 3]) pair(g, 1, 0, z, rust);                                     // legs
    for (const [y, z] of [[1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [5, 1], [6, 1], [6, 2], [6, 3], [5, 3]])
      g.box([3, 4], [y, y], [z, z], rust);                                              // the tail, arched
    g.box([3, 4], [4, 4], [3, 4], sting);                                               // the sting
    return g.entry({ id: 'cand-p16-scorpion', name: 'Scorpion', story: 'Thumb-sized, and it has decided to be the size of a door.' });
  })(),

  // a cobra rising out of the charmer's basket, hood spread wider than the
  // basket, its head on top, a pale belly stripe, tongue out
  (() => {
    const g = grid(7, 10, 7);
    g.cylinder('y', [3, 3], 2.6, [0, 2], wicker).cylinder('y', [3, 3], 1.6, [1, 2], 0); // the basket
    g.cylinder('y', [3, 3], 1.6, [2, 2], olive);                                        // the coil inside
    g.box([3, 3], [3, 4], [2, 3], olive);                                               // the neck
    g.box([1, 5], [5, 5], [2, 3], olive).box([0, 6], [6, 7], [2, 3], olive)             // the hood
      .box([1, 5], [8, 8], [2, 3], olive);
    g.box([1, 5], [6, 7], [3, 3], belly).box([2, 4], [5, 5], [3, 3], belly)             // the pale hood front
      .box([3, 3], [3, 4], [3, 3], belly);
    g.box([2, 4], [8, 9], [2, 3], olive);                                               // the head, flat, on top
    pair(g, 2, 9, 3, INK);                                                              // eyes
    g.set(3, 8, 4, olive).set(3, 7, 4, tongue);                                         // snout and tongue
    return g.entry({ id: 'cand-p16-cobra-basket', name: 'Cobra in a Basket', fraction: 0.55, story: 'The flute stopped an hour ago. Nobody has told the cobra.' });
  })(),

  // an oil lamp, lit: a long low brass body, a spout rising to the flame, a
  // loop handle at the back and a domed lid with a finial
  (() => {
    const g = grid(10, 6, 3);
    g.box([3, 5], [0, 0], [0, 2], brassDk);                                             // the foot
    g.box([2, 7], [1, 1], [0, 2], brass).box([1, 8], [2, 2], [0, 2], brass)             // the body
      .box([3, 6], [3, 3], [0, 2], brass);
    for (const z of [0, 2]) g.clear(2, 1, z).clear(7, 1, z).clear(1, 2, z).clear(8, 2, z).clear(3, 3, z).clear(6, 3, z);
    g.set(9, 2, 1, brass).set(9, 3, 1, brass);                                          // the spout
    g.set(9, 4, 1, flameHot).set(9, 5, 1, flame);                                       // the flame
    g.box([4, 5], [4, 4], [1, 1], brassDk).set(4, 5, 1, brassDk);                       // lid and finial
    for (const [x, y] of [[0, 2], [0, 3], [0, 4], [1, 4], [2, 4], [2, 3]]) g.set(x, y, 1, brassDk);   // the handle
    return g.entry({ id: 'cand-p16-oil-lamp', name: 'Oil Lamp', story: 'Rub it if you like. It only does light.' });
  })(),

  // a merchant's scales: a wooden post on a broad foot, a brass beam tipped
  // by a heap of paprika against one pinch of saffron. (Drawn two cubes deep
  // it read as a tree at 45°; square pans keep it a pair of scales, and a
  // tall post with long chains keeps the gaps beside the post open.)
  (() => {
    const g = grid(9, 10, 3);
    g.box([2, 6], [0, 0], [0, 2], wood).box([3, 5], [1, 1], [1, 1], wood)               // the foot, stepped
      .box([4, 4], [1, 1], [0, 2], wood).box([4, 4], [1, 8], [1, 1], wood);             // and the post
    for (const y of [3, 6]) g.set(4, y, 0, wood).set(4, y, 2, wood);                    // knops, front and back
    g.box([1, 3], [8, 8], [1, 1], brass).set(4, 9, 1, brass).box([5, 7], [9, 9], [1, 1], brass);   // the beam, tipped
    const scale = (cx, yb, top, heap, cells) => {
      g.box([cx - 1, cx + 1], [yb, yb], [0, 2], brass);                                 // the pan
      cells.forEach(([dx, dy, dz]) => g.set(cx + dx, yb + 1 + dy, 1 + dz, heap));       // what is in it
      g.box([cx, cx], [yb + 2 + (heap === paprika ? 1 : 0), top], [1, 1], brass);       // the chain
    };
    scale(1, 2, 7, paprika, [[0, 0, 0], [-1, 0, 0], [1, 0, 0], [0, 0, -1], [0, 0, 1], [0, 1, 0], [0, 1, 1]]);
    scale(7, 5, 8, saffron, [[0, 0, 0]]);
    return g.entry({ id: 'cand-p16-spice-scales', name: 'Spice Scales', story: 'The paprika weighs more. The saffron costs more. The scales only know the first thing.' });
  })(),

  // a giraffe calf on its way to the water: long legs, a neck reaching up
  // and forward, its face turned to you, two ossicones; tan patches netted
  // in cream. Its head is at the far end so the neck shows in the game view.
  (() => {
    const g = grid(3, 10, 8);
    g.box([0, 2], [3, 4], [3, 6], patch);                                               // the body
    tint(g, (x, y, z) => z === 5 || (y === 4 && x === 1), cream);                       // the net between patches
    for (const x of [0, 2]) for (const z of [3, 6]) g.box([x, x], [1, 2], [z, z], cream).set(x, 0, z, hoof);   // legs
    g.box([1, 1], [5, 5], [2, 3], patch).box([1, 1], [6, 6], [1, 2], patch);            // the neck, reaching
    g.box([0, 2], [7, 8], [0, 2], patch);                                               // the head
    g.box([2, 2], [7, 7], [0, 2], muzzle);                                              // the muzzle
    g.set(2, 8, 0, INK).set(2, 8, 2, INK);                                              // eyes
    g.set(1, 9, 0, patch).set(1, 9, 2, patch);                                          // ossicones
    g.set(1, 4, 7, cream).set(1, 3, 7, hoof);                                           // the tail
    return g.entry({ id: 'cand-p16-giraffe-calf', name: 'Giraffe Calf', lit: { span: 2 }, story: 'It came a long way for a drink, and it is in no hurry to bend down.' });
  })(),
];
