// Page 18 · II Caught in the Act, for the Daily Stones: creatures doing the
// thing they're known for, where the behaviour is the joke and the identity.
// Palette: Orchard (a sage-to-gold sky, so bodies lean away from sage and
// gold: brown, white, navy, grey, ginger). The daily's rules: never a level
// or gallery object, D 9.5-12.0, 90-180 taps (the trimmed block minus its
// cubes), so every stone is compact and fairly full, 30-55%.
//
// Silhouette first. Each idea as name / identity feature that sets the
// outline / the moment / colour parts:
//  kept  Fishing Bear      a salmon held crosswise, wider than the head    just caught      brown bear, salmon, river
//  kept  Chicken Crossing  red comb on top, the road's centre line under it  mid-crossing   white hen, red comb, grey road
//  kept  Sliding Penguin   long and low, head up at the front            tobogganing      ink back, white belly, ice
//  kept  Raccoon in a Bin  the masked face over the rim, the lid as a hat  caught in it   green bin, grey raccoon, black mask
//  kept  Kangaroo & Joey   tall ears, long feet, the tail along the ground  carrying     red-brown, cream pouch, red earth
//  kept  Hang in There     a kitten hung below a branch by its front paws  hanging on    grey kitten, brown branch, leaves
//  kept  Head in the Sand  the neck going over and down into the ground  "hiding"         black plumes, pink legs and neck, sand
//  kept  Cat & Cup         a paw on a cup that is half over the edge     pushing it off   ginger cat, blue cup, dark table
//  out   Ducks in a Row    built and read well, but Days of the Year has Ducklings in a Row
//  out   Frog & Fly        built and read well, but Small Wonders has a Frog Prince on its pad
//  out   Honking Goose     wings up and the neck out make a sparse block: 17% fill, 324 taps
//  out   Fiddler Crab      built three times; at 40 px the big claw stayed a block on a blue chair
//  out   Pig in Mud        built three times; four trotters in the air read as a pink crown
//  out   Elephant Shower   built three times; face on, the trunk vanished into the face and the
//                          water sat on it like a hat; side on, the ear and eye took over
//  out   Hedgehog & Apples the apples bury the spines: a brown box with apples on it
//  out   Early Bird        built twice; a blackbird is black on black at this size, no face reads
//  out   Otter on its back   Sea Otter already floats holding a shell
//  out   Flamingo on one leg Flamingo already stands on one leg
//  out   Pufferfish, puffed  Pufferfish already is
//  out   Bear in a honey pot Honey Bear already has its paws round the pot
//  out   Dog and a big stick Paper Pup's roll is the same outline and the same act
//  out   Shaking Dog         the flying drops would be stray cubes
//  out   Squirrel's cheeks   Hamster and Chipmunk own the stuffed-cheek read
//  out   Bottoms-up Duck     no face to the camera; at 40 px it is a tail on a pond
//  out   Mousing Fox         the same no-face joke, and the gallery has seven foxes
//  out   Boxing Kangaroo     the gloves sit at the chest; the joey in the pouch is the kinder act
//  out   Bat hanging         Possum already sees the night upside down
// Learns from: Bear, the Yawning Hippo (an act in the water) and the Meerkat
// Lookout (upright, face to you); Chicken, the Red Grouse (a small base that
// says where); Penguin, the Ocean Sunfish (known by one odd posture); Raccoon,
// the Basket Dog (the container is the joke); Kangaroo, the Meerkat Lookout
// (upright, a parent and a little one); Kitten, the Pegasus Foal (a frontal
// icon, the pose spread to the outline); Ostrich, the Highland Cow (the face
// you can't see is the joke); Cat, the Broody Hen (asked to stop; declined).
// Faces and details look toward +z / +x.
import { grid } from '../voxel.js';
import { INK, pair, pairFront, pairFrontAt, pairZ, tint } from './kit.js';

// Flat material colours: the game's light does the shading.
const bear = 0x7a4e34, bearMuzzle = 0xd6a77a, salmon = 0xf07e6a, river = 0x4f9fd0,
  road = 0x5d6670, dash = 0xfbf8f2, hen = 0xfbf8f2, comb = 0xe0434b, beak = 0xf28a2e,
  peng = 0x2f3346, belly = 0xf6f2ea, ice = 0xa9d4ee, pengBeak = 0xf2a03d, snow = 0xfbfdff,
  bin = 0x3f7a55, coon = 0x9a9aa2, mask = 0x34303a, coonWhite = 0xf3efe8,
  roo = 0xb8754a, pouch = 0xf0d9b8, earth = 0x9a4f36,
  kitten = 0x9aa1ab, kittenWhite = 0xfbf8f2, branch = 0x6b4a3a, leafy = 0x5fae4e,
  plume = 0x2f2d36, plumeWhite = 0xfbf8f2, ostrichPink = 0xe88a98, sand = 0xe2c58e, egg = 0xfaf0d8,
  cat = 0xe8913f, catWhite = 0xfbf3e6, cup = 0x4f86cf, table = 0x6b4a3a;

export default [
  // a bear stood in the river with a salmon in its jaws, held crosswise and
  // wider than its head, the forked tail still flipping
  (() => {
    const g = grid(7, 8, 6);
    g.ellipsoid([3, 0, 2.7], [3.6, 0.5, 3.3], river);                                   // the river
    g.ellipsoid([3, 2.4, 2.4], [2.5, 2.1, 1.9], bear);                                  // the body
    g.box([0, 0], [2, 3], [2, 3], bear).box([6, 6], [2, 3], [2, 3], bear);              // arms, out
    g.box([1, 5], [4, 6], [1, 4], bear).clear(1, 6, 1).clear(5, 6, 1);                  // the head
    pair(g, 1, 7, 2, bear); pair(g, 1, 7, 3, bear);                                     // ears
    g.box([2, 4], [5, 5], [5, 5], bearMuzzle).set(3, 5, 5, INK);                         // the muzzle, the nose
    pairFront(g, 2, 6, INK);                                                            // eyes
    g.box([0, 4], [3, 4], [5, 5], salmon).clear(0, 4, 5);                                // the salmon, crosswise
    g.box([5, 5], [2, 4], [5, 5], salmon).set(6, 2, 5, salmon).set(6, 4, 5, salmon);    // its tail, forked
    return g.entry({ id: 'cand-p18-fishing-bear', name: 'Fishing Bear', fraction: 0.55, seed: 3, story: 'It stood in the river all morning. The salmon came to it.' });
  })(),

  // a white hen halfway over the road, on the centre line, red comb up,
  // striding toward you without a look either way
  (() => {
    const g = grid(7, 7, 5);
    g.box([0, 6], [0, 0], [0, 4], road);                                                // the road
    for (const x of [0, 1, 5, 6]) g.set(x, 0, 2, dash);                                 // the centre line
    g.set(2, 1, 3, beak).set(4, 1, 1, beak).set(2, 1, 4, beak);                         // legs, mid-stride
    g.ellipsoid([3, 2.6, 2], [2.2, 1.3, 2.1], hen);                                     // the body
    g.box([2, 4], [3, 4], [0, 0], hen).set(3, 5, 0, hen);                               // the tail, up
    g.box([2, 4], [4, 5], [2, 3], hen);                                                 // the head
    pairFront(g, 2, 5, INK);                                                            // eyes
    g.set(3, 4, 4, beak).set(3, 3, 4, comb);                                            // beak and wattle
    g.set(2, 6, 3, comb).set(3, 6, 2, comb).set(3, 6, 3, comb).set(4, 6, 3, comb);      // the comb
    return g.entry({ id: 'cand-p18-chicken-crossing', name: 'Chicken Crossing', story: 'It has its reasons. It is not sharing them.' });
  })(),

  // a penguin tobogganing on its belly over the ice, head up, flippers
  // swept back, snow heaping up in front of its chest
  (() => {
    const g = grid(5, 5, 10);
    g.ellipsoid([2, 0, 4.5], [2.4, 0.5, 4.9], ice);                                     // the ice
    g.ellipsoid([2, 1.6, 4.0], [1.6, 1.1, 3.4], peng);                                  // the body, flat out
    tint(g, (x, y) => y === 1, belly);                                                  // the white belly underneath
    g.box([1, 3], [2, 4], [6, 7], peng).clear(1, 4, 6).clear(3, 4, 6);                  // the head, up
    g.box([1, 3], [2, 3], [8, 8], belly);                                               // white face
    pairFront(g, 1, 3, INK);                                                            // eyes
    g.set(2, 2, 9, pengBeak);                                                           // the beak
    pair(g, 0, 2, 4, peng); pair(g, 0, 2, 3, peng); pair(g, 0, 2, 2, peng);             // flippers, swept back
    g.set(1, 1, 9, snow).set(3, 1, 9, snow).set(2, 1, 9, snow);                          // snow heaping up
    return g.entry({ id: 'cand-p18-sliding-penguin', name: 'Sliding Penguin', story: 'It can walk. It has tried this, and it is not going back.' });
  })(),

  // a raccoon up out of the bin with the lid still on its head, paws on the
  // rim, its ringed tail hanging out of the back
  (() => {
    const g = grid(7, 8, 6);
    g.cylinder('y', [3, 2.5], 2.6, [0, 3], bin).cylinder('y', [3, 2.5], 1.6, [2, 3], 0); // the bin, open
    g.box([2, 4], [2, 3], [1, 3], coon);                                                // its body, inside
    g.box([1, 5], [4, 6], [1, 3], coon).clear(1, 6, 1).clear(5, 6, 1);                  // the head
    g.box([1, 5], [5, 5], [4, 4], mask).box([2, 4], [4, 4], [4, 4], coonWhite);        // the mask, the white muzzle
    g.set(3, 4, 5, INK).set(3, 6, 4, coonWhite);                                        // the nose, the brow
    pairFront(g, 2, 5, INK);                                                            // eyes in the mask
    pair(g, 1, 7, 2, coon);                                                             // ears
    g.box([1, 1], [3, 3], [4, 5], mask).box([5, 5], [3, 3], [4, 5], mask);              // paws on the rim
    g.box([2, 4], [7, 7], [1, 3], bin).set(1, 7, 3, bin).set(3, 7, 4, bin);             // the lid, on its head
    for (const y of [0, 1, 2, 3]) g.set(6, y, 1, y % 2 ? coon : mask);                  // the ringed tail
    return g.entry({ id: 'cand-p18-raccoon-bin', name: 'Raccoon in a Bin', fraction: 0.65, seed: 2, lit: { span: 2 }, story: 'It is not stealing. It is sorting.' });
  })(),

  // a kangaroo side on, leaning forward on her long feet with her tail along
  // the ground, a joey's head and ear out of the pouch
  (() => {
    const g = grid(8, 10, 3);
    g.box([0, 7], [0, 0], [0, 2], earth).clear(0, 0, 0).clear(0, 0, 2).clear(7, 0, 0).clear(7, 0, 2);   // the red earth
    g.box([0, 2], [1, 1], [1, 1], roo).box([2, 2], [2, 2], [1, 1], roo);                // the tail, along the ground
    for (const z of [0, 2]) g.box([3, 6], [1, 1], [z, z], roo);                         // the long feet
    g.ellipsoid([3.2, 2.6, 1], [1.4, 1.6, 1.9], roo);                                   // the haunch
    g.box([4, 5], [3, 5], [0, 2], roo).clear(4, 5, 0).clear(4, 5, 2);                   // the body, leaning in
    g.box([6, 6], [2, 3], [0, 2], pouch);                                               // the pouch
    g.set(6, 4, 1, roo).set(7, 4, 1, roo).set(6, 5, 1, roo);                            // the joey's head and ear
    pairZ(g, 6, 5, 0, roo);                                                             // her little arms
    g.box([5, 6], [6, 7], [0, 2], roo).clear(6, 7, 0).clear(6, 7, 2);                   // her head
    g.set(7, 6, 1, roo);                                                                // the snout
    g.set(6, 6, 0, INK).set(6, 6, 2, INK);                                              // eyes
    for (const y of [8, 9]) g.set(5, y, 0, roo).set(5, y, 2, roo);                     // tall ears, a notch between
    return g.entry({ id: 'cand-p18-kangaroo-joey', name: 'Kangaroo & Joey', story: 'The joey is nearly too big for the pouch. Nobody has told it.' });
  })(),

  // a grey kitten hanging from a branch by its front paws, back legs
  // dangling, looking at you as if you might help (the 1971 poster)
  (() => {
    const g = grid(9, 9, 3);
    g.box([0, 8], [8, 8], [1, 1], branch);                                              // the branch
    for (const x of [0, 7]) g.box([x, x + 1], [7, 8], [0, 2], leafy);                   // leaves at each end
    g.clear(1, 7, 0).clear(1, 7, 2).clear(7, 7, 0).clear(7, 7, 2);
    pair(g, 1, 3, 1, kitten); for (const y of [4, 5, 6]) pair(g, 2, y, 1, kitten);      // arms up to the branch
    pair(g, 2, 7, 1, kittenWhite);                                                      // white paws on the branch
    g.box([2, 6], [2, 4], [0, 2], kitten).clear(2, 4, 0).clear(6, 4, 0);                // the big head
    g.clear(2, 4, 1).clear(6, 4, 1).clear(2, 4, 2).clear(6, 4, 2);
    pair(g, 3, 5, 1, kitten);                                                           // ears
    g.set(4, 2, 2, kittenWhite);                                                        // the white muzzle
    pairFront(g, 3, 3, INK);                                                            // eyes
    g.box([3, 5], [0, 1], [0, 1], kitten).clear(4, 0, 0).clear(4, 0, 1);                // the body, dangling, back legs
    return g.entry({ id: 'cand-p18-hang-in-there', name: 'Hang in There', fraction: 0.55, seed: 3, story: 'It has been hanging in there since 1971.' });
  })(),

  // an ostrich with its head in the sand, plumes up, one egg showing: it was
  // only ever turning the eggs
  (() => {
    const g = grid(8, 8, 3);
    g.box([1, 7], [0, 0], [0, 2], sand).clear(1, 0, 0).clear(1, 0, 2);                 // the sand
    g.box([6, 7], [1, 1], [0, 2], sand).set(7, 2, 1, sand).set(6, 2, 1, sand);          // the mound
    for (const x of [2, 4]) g.box([x, x], [1, 3], [1, 1], ostrichPink);                // legs
    g.ellipsoid([2.8, 5.2, 1], [2.3, 1.4, 1.4], plume);                                 // the body
    pairZ(g, 3, 5, 0, plumeWhite); pairZ(g, 2, 5, 0, plumeWhite);                       // white wing plumes
    g.box([0, 1], [6, 7], [1, 1], plumeWhite).set(0, 5, 1, plumeWhite);                 // tail plumes
    for (const [x, y] of [[5, 5], [6, 5], [6, 4], [7, 4], [7, 3]]) g.set(x, y, 1, ostrichPink);   // the neck, over and down
    g.set(5, 1, 2, egg);                                                                // an egg
    return g.entry({ id: 'cand-p18-head-in-sand', name: 'Head in the Sand', story: 'It is not hiding. It is turning the eggs.' });
  })(),

  // a ginger cat on the table, one paw on the cup at the very edge, looking
  // right at you; the cup is already half over
  (() => {
    const g = grid(7, 7, 5);
    g.box([0, 5], [2, 2], [0, 4], table);                                               // the table top
    for (const x of [0, 5]) for (const z of [0, 4]) g.box([x, x], [0, 1], [z, z], table);   // legs
    g.box([1, 3], [3, 4], [0, 2], cat);                                                 // the cat, sitting
    g.box([1, 3], [5, 6], [0, 2], cat).clear(2, 6, 0).clear(2, 6, 1).clear(2, 6, 2);    // head, ears either side
    g.set(2, 5, 3, catWhite).set(2, 3, 3, catWhite);                                    // muzzle and bib
    pairFrontAt(g, 2, 1, 5, INK);                                                       // eyes
    g.box([4, 4], [3, 3], [2, 3], cat);                                                 // the paw, out
    g.box([5, 6], [3, 4], [2, 3], cup).set(6, 4, 4, cup);                               // the cup, half over the edge
    g.box([0, 0], [3, 5], [0, 0], cat);                                                 // the tail, up
    return g.entry({ id: 'cand-p18-cat-and-cup', name: 'Cat & Cup', fraction: 0.65, seed: 4, story: 'It has looked you in the eye. It is still pushing.' });
  })(),
];
