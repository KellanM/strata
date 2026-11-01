// Page 17 · III Above the Weather: for Cloud Isles ("above the weather;
// islands that float"): things that float, and the ones who ride them.
// Palette: Clouds (a pale periwinkle sky going to peach), so nothing here is
// built white: the figures are pink, brown, black, magenta and green, and any
// cloud is a context base under or over them (rule 12), never the figure.
// Live levels already in the chapter: Momonga, Kite, Rain Cloud, Stork &
// Bundle, Biplane, Pegasus Foal, Grass Whale, Unicorn, Waterfall Isles, Sky
// Whale, Weather Vane, Windmill. Pegasus Foal owns "wings spread on a
// cloud, facing you", so nothing here spreads its wings on a cloud.
//
// Aimed at Kellan's picks from pages 15 and 16 (Highland Cow, Red Grouse,
// Drystone Sheepfold, Ocean Sunfish, Broody Hen, Ice Lolly, Yawning Hippo,
// Scorpion, Grapes, Monk, Akabeko, Goldfish Lantern, Basket Dog). What they
// share: one chunky body in one bold flat colour with one strong accent; a
// creature caught doing its one thing (yawning, brooding, nodding,
// sweeping); folk toys and charms; a base that says where it is (heather,
// nest, pool, step); and a dry joke in the story. Few are fantasy: the
// funny comes from the behaviour, not from a hybrid.
//
// Silhouette first. Each idea as name / identity feature that sets the
// outline / signature pose or moment / colour parts:
//  kept  Flying Pig   two little wings over a fat pink barrel, snout out     mid-flap, trotters dangling     pink, white wings, dark-pink snout
//  kept  Monkey King  the red staff standing taller than him                 on his cloud, peering far      brown fur, peach face, gold cloud
//  kept  Broomstick   the long broom, bristles fanned at one end             a black cat riding it          black cat, straw, wood
//  kept  Black Swan   the S of the neck and the red beak                     a cygnet riding on her back    black, red beak, grey cygnet, pond
//  kept  Balloon Dog  sausage legs and a snout, the twists as notches        standing proud, tail up        one magenta, a knot
//  kept  Beanstalk    a green stalk twisting up into a cloud                 still growing                  green stalk, leaf, cloud cap, soil
//  out   Albatross      long straight wings          Pegasus Foal and Stork & Bundle own the spread wing in this chapter
//  out   Paper Crane    wings out                    the same, and about 10% fill (cut on page 16 too)
//  out   Hummingbird    needle beak, hovering        already in extra/sky-1, and turned to noise at 40 px on page 16
//  out   Windsock       a striped cone on a pole     already in extra/sky-1
//  out   Parachute Bear a dome over a small bear     the dome reads as an umbrella or a jellyfish
//  out   Tortoise & Geese  two geese carry a stick, the tortoise bites it   three figures in 10 cubes; noise at 40 px
//  out   Weather House a chalet with two doors       needs a caption
//  out   Taketombo     a propeller on a stick        reads as a T
//  out   Fujin         the wind bag over his head    needs a caption
//  out   Frigatebird   the red throat pouch blown up few players can name it
//  out   Cloud Nap Cat a curled cat on a cloud       Curled Fox has the outline, and it is Pegasus Foal's base
// Faces and details look toward +z / +x. Authored flat; the game's dithered
// light (lit() in shapes.js) shades them.
import { grid } from '../voxel.js';
import { INK, pair, pairZ, front, tint } from './kit.js';

// Flat material colours: the game's light does the shading.
const pig = 0xee8aa4, pigDk = 0xc4567a, wing = 0xfbf8f2,
  fur = 0x8e5a36, face = 0xf4c69c, band = 0xf2b632, staff = 0xd8403a,
  cat = 0x34303e, catEye = 0xf6d365, straw = 0xe2b25a, broom = 0x8a5a3c, binding = 0xd8503a,
  swan = 0x3a3448, beak = 0xe0433f, beakTip = 0xfbf8f2, cygnet = 0xc8c2cf, pond = 0x5fa4d8,
  balloon = 0xe0468a, knot = 0xa82a62,
  coat = 0x4a62a8, skin = 0xf2c09a, boot = 0x5a3a2e, line = 0x9aa3ad, fish = 0xf07a2a,
  cloud = 0xfbfcff, cloudDk = 0xd9e3f6;

export default [
  // a pig, flying: a fat pink barrel side on with its snout to you, four
  // trotters dangling, a curl of a tail, and two small white wings going
  // like the clappers on its back
  (() => {
    const g = grid(10, 8, 7);
    g.box([1, 6], [2, 5], [1, 5], pig);                                                 // the barrel
    for (let x = 1; x <= 6; x++) for (const [y, z] of [[2, 1], [2, 5], [5, 1], [5, 5]]) g.clear(x, y, z);
    g.box([6, 8], [3, 6], [1, 5], pig);                                                 // the head, set high
    for (let x = 6; x <= 8; x++) for (const [y, z] of [[6, 1], [6, 5]]) g.clear(x, y, z);
    g.box([9, 9], [3, 4], [2, 4], pigDk).set(9, 4, 2, INK).set(9, 4, 4, INK);           // the snout, nostrils
    g.set(8, 5, 2, INK).set(8, 5, 4, INK);                                              // eyes
    pairZ(g, 7, 7, 2, pig); pairZ(g, 8, 7, 2, pig);                                     // ears, flopped forward
    for (const x of [2, 5]) for (const z of [2, 4]) g.box([x, x], [0, 1], [z, z], pigDk); // trotters, dangling
    g.set(0, 4, 3, pigDk).set(0, 5, 3, pigDk);                                          // the tail, curled up
    for (const [x, y] of [[4, 4], [4, 5], [4, 6], [3, 6], [3, 7], [2, 7]]) pairZ(g, x, y, 0, wing);   // wings, up
    return g.entry({ id: 'cand-p17-flying-pig', name: 'Flying Pig', story: 'Everyone said it would happen when pigs flew. It is waiting to see what happens.' });
  })(),

  // the Monkey King on his cloud: standing to you, his red staff planted
  // taller than he is, a gold band on his brow, his tail curled up behind
  (() => {
    const g = grid(8, 10, 6);
    g.ellipsoid([3.5, 0.8, 3], [3.6, 1.1, 2.4], cloud).ellipsoid([6.4, 1.6, 3], [1.2, 1.2, 1.2], cloud);   // the cloud, curled up at one end
    tint(g, (x, y, z) => !g.get(x, y - 1, z), cloudDk);
    for (const x of [2, 4]) g.set(x, 2, 3, fur);                                        // legs
    g.box([2, 4], [3, 4], [2, 4], fur);                                                 // the body
    g.ellipsoid([3, 6, 3], [2.4, 1.6, 1.7], fur);                                       // the head, wider than him
    for (let x = 2; x <= 4; x++) for (const y of [5, 6]) front(g, x, y, face);          // the face
    front(g, 2, 6, INK); front(g, 4, 6, INK);                                           // eyes
    for (let x = 2; x <= 4; x++) front(g, x, 7, band);                                  // the gold band
    g.set(0, 6, 3, face).set(6, 6, 3, face);                                            // ears
    g.box([5, 6], [4, 4], [3, 3], fur);                                                 // the arm to the staff
    g.box([7, 7], [2, 9], [3, 3], staff).set(7, 9, 3, band);                            // the staff, a gold tip
    for (const [x, y] of [[1, 3], [0, 3], [0, 4], [0, 5], [1, 5]]) g.set(x, y, 2, fur); // the tail, curled
    return g.entry({ id: 'cand-p17-monkey-king', name: 'Monkey King', fraction: 0.6, story: 'He can cover a thousand miles in one somersault. He has not decided where to.' });
  })(),

  // a broomstick out on its own: a long handle, the bristles fanned out
  // behind, and the witch's black cat riding it, ears up, tail up, looking
  // at you
  (() => {
    const g = grid(10, 9, 5);
    g.box([2, 9], [3, 3], [2, 2], broom);                                               // the handle
    g.box([1, 1], [2, 4], [1, 3], straw).box([0, 0], [1, 5], [0, 4], straw);            // the bristles, fanned
    for (const [y, z] of [[1, 0], [1, 4], [5, 0], [5, 4]]) g.clear(0, y, z);
    for (const [y, z] of [[3, 1], [3, 3], [2, 2], [4, 2]]) g.set(2, y, z, binding);     // the binding
    g.box([5, 6], [4, 5], [1, 3], cat);                                                 // the cat
    g.box([4, 7], [6, 7], [1, 3], cat);                                                 // its head
    for (const x of [4, 7]) g.clear(x, 7, 1);
    g.set(4, 8, 2, cat).set(7, 8, 2, cat);                                              // ears
    g.set(4, 6, 3, catEye).set(7, 6, 3, catEye);                                        // eyes
    g.set(5, 3, 3, cat).set(6, 3, 3, cat);                                              // paws round the handle
    for (const [x, y] of [[4, 4], [3, 4], [3, 5], [3, 6], [3, 7]]) g.set(x, y, 1, cat); // the tail, up
    return g.entry({ id: 'cand-p17-broomstick', name: 'Broomstick', story: 'The witch is in having tea. The cat was told not to touch anything.' });
  })(),

  // a black swan afloat, side on, a grey cygnet riding at the back between
  // the curled feathers of her wings; the S of the neck, a red beak
  (() => {
    const g = grid(9, 9, 6);
    g.ellipsoid([4.5, 0, 2.5], [4.6, 0.7, 3], pond);                                    // the pond
    g.ellipsoid([3.5, 2, 2.5], [3.2, 1.5, 2.1], swan);                                  // her body
    for (const x of [1, 2]) pairZ(g, x, 4, 1, swan);                                    // the wing feathers, curled up
    g.box([1, 2], [4, 4], [2, 3], cygnet).box([2, 2], [5, 5], [2, 3], cygnet);          // the cygnet, riding
    g.set(3, 5, 2, INK).set(3, 5, 3, INK);                                              // its beak
    for (const [x, y] of [[6, 3], [6, 4], [6, 5], [5, 5], [5, 6], [5, 7], [6, 7]]) g.box([x, x], [y, y], [2, 3], swan);   // the neck
    g.box([6, 7], [8, 8], [2, 3], swan);                                                // her head
    g.set(8, 8, 2, beak).set(8, 8, 3, beak).set(8, 7, 2, beakTip).set(8, 7, 3, beakTip); // the red beak, pale tip
    g.set(7, 8, 1, beak).set(7, 8, 4, beak);                                            // red eyes
    return g.entry({ id: 'cand-p17-black-swan', name: 'Black Swan', fraction: 0.6, story: 'The cygnet can swim perfectly well. It has decided not to.' });
  })(),

  // a balloon dog, twisted out of one long magenta balloon: sausage legs,
  // a long snout, two little ears and the tail up, the knot on its nose
  (() => {
    const g = grid(10, 9, 4);
    g.box([2, 6], [3, 4], [0, 3], balloon);                                             // the body
    for (const x of [2, 6]) for (const z of [0, 3]) g.clear(x, 4, z);
    for (const x of [1, 2, 6, 7]) for (const z of [0, 3]) g.box([x, x], [0, 2], [z, z], balloon);   // the legs
    for (const z of [0, 3]) g.clear(1, 2, z).clear(7, 2, z);
    g.box([6, 7], [5, 6], [1, 2], balloon);                                             // the neck
    g.box([6, 9], [7, 7], [1, 2], balloon);                                             // the head and snout
    g.set(9, 7, 1, knot).set(9, 7, 2, knot);                                            // the knot
    pairZ(g, 6, 8, 0, balloon); pairZ(g, 6, 7, 0, balloon);                             // ears
    g.box([1, 1], [4, 6], [1, 2], balloon);                                             // the tail, up
    return g.entry({ id: 'cand-p17-balloon-dog', name: 'Balloon Dog', story: 'It got away from a birthday party. It is very pleased with how high it got.' });
  })(),

  // an old fisherman sat on the end of a cloud in a wide straw hat, legs
  // over the side, his rod out and the line down through the weather, a
  // small fish on the end of it. (Sat at the front of the cloud he hid it
  // from the game view; side on at its end, the cloud runs off behind him.)
  (() => {
    const g = grid(9, 9, 5);
    g.ellipsoid([2.6, 2, 2], [3.0, 1.3, 2.2], cloud).ellipsoid([0.9, 3, 2], [1.2, 1.1, 1.5], cloud);   // the cloud
    tint(g, (x, y, z) => g.get(x, y, z) === cloud && !g.get(x, y - 1, z), cloudDk);
    g.box([3, 5], [4, 5], [1, 3], coat);                                                // his coat
    for (const z of [1, 3]) g.set(6, 4, z, coat).set(6, 3, z, coat).set(6, 2, z, boot); // legs over the edge
    g.box([3, 5], [6, 6], [1, 3], skin);                                                // his head
    g.set(5, 6, 1, INK).set(5, 6, 3, INK);                                              // eyes
    g.box([2, 6], [7, 7], [0, 4], straw);                                               // the hat
    for (const [x, z] of [[2, 0], [6, 0], [2, 4], [6, 4]]) g.clear(x, 7, z);
    g.box([3, 5], [8, 8], [1, 3], straw);
    for (const [x, z] of [[3, 1], [5, 1], [3, 3], [5, 3]]) g.clear(x, 8, z);
    g.set(6, 5, 2, skin);                                                               // his hands
    g.set(7, 5, 2, straw).set(7, 6, 2, straw).set(8, 6, 2, straw);                       // the rod
    g.box([8, 8], [2, 5], [2, 2], line);                                                // the line
    g.box([8, 8], [0, 1], [2, 2], fish);                                                 // a fish on it
    return g.entry({ id: 'cand-p17-cloud-fisher', name: 'Cloud Fisher', fraction: 0.6, story: 'Forty years fishing off this cloud. Today, for the first time, something bit.' });
  })(),
];
