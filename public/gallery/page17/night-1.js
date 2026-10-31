// Page 17 · IV Late Hours: for Starfall ("the sky at night"): the ones
// still up when the stars come out. Palette: Night (navy going to slate),
// so every figure is light or warm and separates from the sky by lightness,
// not hue: ochre, wool, pale grey, a lit lamp. Dark parts are kept to
// accents (eyes, a nose, a sheep's face). Live levels already in the
// chapter: Moon Rabbit, Baby Dragon, Star, Dreamcatcher, Astrolabe,
// Visitor, Moon Basin, Star Tablet, Wishing Well, Rocket, Ringed Planet,
// Observatory.
//
// Aimed at Kellan's picks from pages 15 and 16 (Highland Cow, Red Grouse,
// Drystone Sheepfold, Ocean Sunfish, Broody Hen, Ice Lolly, Yawning Hippo,
// Scorpion, Grapes, Monk, Akabeko, Goldfish Lantern, Basket Dog). What they
// share: a creature caught doing its one thing; one bold flat body colour
// with one strong accent; a canonical outline anyone can name; often a small
// base that says where it is; and a calm joke in the story. At night that
// means the ones awake late, and things that glow.
//
// Silhouette first (docs/voxel-study.md, "Silhouette and character"). Each
// idea as name / identity feature that sets the outline / pose / colour parts:
//  kept  Coyote          the snout thrown up past laid-back ears / howling, sat / ochre, cream chest, red bandana
//  kept  Possum          hung by a pink tail from a branch wider than it / upside down, looking at you / pale grey, white face, pink
//  kept  Counting Sheep  a sheep in the air over a fence, the gap under it / mid-leap / wool, dark face and legs, wooden fence
//  kept  Hamster Wheel   the wheel, a ring on a stand / running at 3 a.m. / pale wheel, orange hamster
//  kept  Candle Mouse    round ears with a notch between, a candle held out / up past bedtime / grey fur, pink, the flame
//  kept  Lava Lamp       wide cone base, bulging glass, small cap / one slow blob rising / chrome, lit liquid, pink wax
//  out   Firefly         built 3 times: a yellow tail and white wings read as a bee at 40 px; the glow alone could not name it
//  out   Cricket         built once: the bent hind legs turned a green blob into a frog
//  out   Lamplighter     built once: a block figure with a stick; nothing a stranger could name
//  out   Nightcap        (on the mouse) a third prong between the ears that muddled them; Sleepy Sheep has the nightcap
//  out   Skunk           the plume tail; its black coat vanishes on the Night sky
//  out   Moon Bear       the cream crescent on a black chest; black on the night sky, and four bears already
//  out   Jack-o'-Lantern a carved, lit face; Pumpkin's outline, already a level
//  out   Moon-gazing Hare  ears up, face to the moon; Moon Rabbit owns that outline in this chapter
//  out   Howling Wolf    snout up; grey on navy, and Frost Wolf has the grey wolf. The Coyote is the warm one
//  out   Mooncake        a stamped round cake; a disc at 40 px, needs a caption
//  out   Sleepwalker     arms straight out, nightcap; a pale figure with its arms out is a ghost at 40 px
//  out   Bushbaby        huge eyes on a stem; its outline is the mouse's, and the eyes need colour to read
// Near neighbours checked: Crystal Bat hangs under a ledge (the Possum's
// long branch and tail loop are its own); Sleepy Sheep sits (this one
// leaps); Hamster is a hamster (this outline is the wheel).
// Faces and details look toward +x / +z.
import { grid } from '../voxel.js';
import { INK, pair, pairAt, pairZ, lathe } from './kit.js';

// Flat material colours: the game's light (lit() in shapes.js) does the shading.
const ochre = 0xd99a52, chest = 0xf6e6c8, bandana = 0xe0434b,
  possum = 0xaea8be, face = 0xf8f4ec, pink = 0xf29ab0, branch = 0xb07a3a, leaf = 0x86c77f,
  wool = 0xf6f1e6, sheepFace = 0x5a5066, fence = 0xc8924a,
  hamster = 0xe8a050, belly = 0xfbf3e6, wheel = 0xc9cbe0,
  fur = 0xc4bccc, tin = 0x6a9ae0, wax = 0xfbf8f2, flame = 0xffd77a,
  chrome = 0xc9d1d9, liquid = 0xb6e8f0, lava = 0xf25a7a;

export default [
  // Coyote. Identity: the snout thrown straight up, past ears laid flat
  // back. Pose: sat back on its haunches, howling, eyes shut. Parts: one
  // ochre coat, a cream chest and paws, a red bandana for the accent.
  (() => {
    const g = grid(8, 10, 5);
    g.box([1, 3], [0, 2], [1, 3], ochre).clear(1, 2, 1).clear(1, 2, 3);                  // the haunches
    g.box([3, 5], [1, 4], [1, 3], ochre);                                                 // the chest, upright
    g.box([5, 5], [1, 4], [1, 3], chest);                                                 // pale front
    pairZ(g, 5, 0, 1, chest);                                                             // front paws
    g.box([3, 5], [5, 5], [1, 3], bandana);                                               // the bandana
    g.box([3, 5], [6, 7], [1, 3], ochre).clear(3, 7, 2);                                  // the head
    g.box([6, 6], [7, 7], [1, 3], ochre);                                                 // the muzzle, thrown up
    g.set(6, 8, 2, ochre).set(6, 9, 2, INK);                                              // the snout straight up, the nose
    pairZ(g, 3, 8, 1, ochre); pairZ(g, 2, 8, 1, ochre);                                   // ears, laid back
    pairZ(g, 5, 7, 1, INK);                                                               // eyes shut
    for (const [x, z] of [[0, 3], [1, 4], [2, 4], [3, 4]]) g.set(x, 0, z, ochre);         // the tail round its feet
    return g.entry({ id: 'cand-p17-coyote', name: 'Coyote', story: 'It sings to the moon every night. The moon has never once sung back.' });
  })(),

  // Possum. Identity: hung by a pink tail looped over a branch longer than
  // it is. Pose: upside down, quite comfortable, looking at you. Parts: a
  // pale grey body, a white face, pink tail, ears and nose; the branch.
  (() => {
    const g = grid(9, 10, 5);
    g.box([0, 8], [8, 8], [1, 2], branch);                                                // the branch
    g.set(8, 9, 1, leaf).set(7, 9, 1, leaf).set(0, 9, 2, leaf);                           // leaves at the ends
    for (const [y, z] of [[7, 3], [8, 3], [9, 3], [9, 2], [9, 1]]) g.set(5, y, z, pink);  // the tail, looped over
    g.ellipsoid([4, 5, 2], [2.1, 2.4, 1.5], possum);                                      // the body, hanging
    g.box([3, 5], [0, 2], [2, 4], face).clear(3, 0, 4).clear(5, 0, 4);                   // the face, upside down
    g.set(4, 0, 4, pink);                                                                 // the nose
    pair(g, 3, 2, 4, INK);                                                                // eyes
    pair(g, 2, 2, 3, pink);                                                               // round pink ears
    g.set(3, 7, 3, pink).set(3, 8, 3, pink);                                              // a hind foot on the branch too
    return g.entry({ id: 'cand-p17-possum', name: 'Possum', story: 'It sees the whole night upside down and prefers it that way.' });
  })(),

  // Counting Sheep. Identity: a sheep in the air over a fence, the gap
  // under its front. Pose: mid-leap, chin up, front legs reaching, hind
  // hooves just leaving the top rail. Parts: white wool, dark face and
  // legs, a wooden fence.
  (() => {
    const g = grid(9, 8, 5);
    for (const z of [0, 2, 4]) g.box([2, 2], [0, 3], [z, z], fence);                      // the posts
    for (const y of [1, 3]) g.box([2, 2], [y, y], [0, 4], fence);                         // the rails
    g.box([2, 6], [5, 6], [1, 3], wool).box([3, 5], [7, 7], [1, 3], wool)                // the woolly body
      .box([3, 5], [4, 4], [1, 3], wool).clear(2, 6, 1).clear(2, 6, 3);
    g.set(1, 6, 2, wool);                                                                 // a stub of a tail
    g.box([7, 8], [6, 7], [1, 3], sheepFace);                                             // the face, chin up
    g.set(7, 7, 2, wool);                                                                 // a woolly top-knot
    pairZ(g, 7, 6, 0, sheepFace);                                                         // ears
    pairZ(g, 8, 7, 1, face);                                                              // eyes
    pairZ(g, 6, 4, 1, sheepFace); pairZ(g, 7, 4, 1, sheepFace);                           // front legs, reaching
    pairZ(g, 2, 4, 1, sheepFace);                                                         // hind legs, pushing off the rail
    return g.entry({ id: 'cand-p17-counting-sheep', name: 'Counting Sheep', story: 'Number four hundred and twelve. It has been doing this since ten.' });
  })(),

  // Hamster Wheel. Identity: the wheel, a ring on a stand, the hole open
  // to the camera. Pose: running flat out at the bottom of it. Parts: a
  // pale wheel, an orange hamster with a cream belly.
  (() => {
    const g = grid(9, 9, 4);
    g.cylinder('z', [4, 4], 4.4, [1, 3], wheel).cylinder('z', [4, 4], 3.0, [1, 3], 0);    // the wheel
    g.box([4, 4], [0, 4], [0, 0], wheel).box([3, 5], [0, 0], [0, 1], wheel).set(4, 4, 1, wheel);   // its stand and axle
    g.box([2, 5], [1, 2], [1, 3], hamster).clear(2, 2, 1).clear(2, 2, 3);                 // the hamster, running
    g.box([3, 5], [1, 1], [3, 3], belly);
    g.box([5, 6], [2, 3], [1, 3], hamster).set(6, 2, 2, belly);                           // its head
    pairZ(g, 6, 3, 1, INK); g.set(7, 2, 2, pink);                                         // eyes, nose
    pairZ(g, 5, 4, 1, hamster);                                                           // ears
    return g.entry({ id: 'cand-p17-hamster-wheel', name: 'Hamster Wheel', story: 'It has run eleven miles tonight and is still in the spare room.' });
  })(),

  // Candle Mouse. Identity: two round ears with a notch between them, and
  // a lit candle held out at its side. Pose: up past bedtime, padding
  // about. Parts: grey fur, pink ears, nose and tail, the candle's flame.
  (() => {
    const g = grid(9, 9, 5);
    g.box([2, 4], [0, 2], [1, 3], fur).clear(2, 2, 1).clear(4, 2, 1);                     // the body
    pairAt(g, 3, 2, 0, 4, fur);                                                           // feet
    g.box([1, 5], [3, 5], [1, 3], fur);                                                   // the big head
    for (const z of [1, 3]) g.clear(1, 5, z).clear(5, 5, z).clear(1, 3, z).clear(5, 3, z);
    for (const cx of [1, 5]) {                                                            // round ears, a notch between
      g.box([cx - 1, cx + 1], [6, 8], [2, 2], fur).clear(cx - 1, 8, 2).clear(cx + 1, 8, 2);
      g.set(cx, 7, 3, pink);                                                              // pink inside
    }
    g.clear(3, 6, 2);
    pairAt(g, 3, 2, 4, 4, INK); g.set(3, 3, 4, pink);                                     // eyes, nose
    g.set(5, 2, 2, fur).set(6, 2, 2, fur);                                                // the paw out
    g.box([6, 8], [2, 2], [2, 2], tin).set(7, 2, 1, tin).set(7, 2, 3, tin);               // the candlestick
    g.set(7, 3, 2, wax).set(7, 4, 2, wax).set(7, 5, 2, flame);                            // the candle, lit
    g.set(1, 0, 1, pink).set(0, 0, 1, pink);                                              // the tail
    return g.entry({ id: 'cand-p17-candle-mouse', name: 'Candle Mouse', lit: { keep: [flame] }, story: 'It went to get a glass of water. That was an hour ago.' });
  })(),

  // Lava Lamp. Identity: the wide cone base, the bulging glass, the small
  // cap: an outline nothing else has. Pose: one slow blob on its way up,
  // the rest pooled at the bottom. Parts: chrome, lit liquid, pink wax;
  // the liquid and wax are lit from within, so they stay flat (keep), and
  // the chrome cone gets the softer light (span 2) so its steps don't speckle.
  (() => {
    const g = grid(7, 10, 7);
    lathe(g, [3, 3], 0, [3.0, 2.5, 2.0, 1.5], chrome);                                    // the base
    lathe(g, [3, 3], 4, [1.6, 2.1, 2.3, 2.1, 1.6], liquid);                              // the glass
    lathe(g, [3, 3], 9, [1.2], chrome);                                                   // the cap
    lathe(g, [3, 3], 4, [1.6], lava);                                                     // wax pooled at the bottom
    for (const [x, y, z] of [[5, 6, 4], [4, 6, 5], [5, 7, 4], [4, 7, 5],                  // a blob rising
      [2, 8, 4], [3, 8, 4]]) g.set(x, y, z, lava);                                        // one near the top
    return g.entry({ id: 'cand-p17-lava-lamp', name: 'Lava Lamp', lit: { keep: [liquid, lava], span: 2 }, story: 'It has been thinking the same slow thought since 1973.' });
  })(),
];
