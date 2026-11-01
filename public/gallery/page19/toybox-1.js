// Page 19 · V Toy Box, Again: daily stones, more toys from everywhere, each
// with a face or a moment. A stranger plays one from a shared link, so each
// is a toy you'd know from across a room, caught doing its one thing.
// Palette: Dusk (a violet sky over a peach horizon, so bodies stay clear and
// mid-to-light: blue, teal, red, cream, green). Every entry is in the daily
// band (judge() in public/js/daily.js: D 9.5-12, 90-180 chisels on the
// trimmed block, 4-10 waves), with fraction and seed written out so the
// gallery and the daily agree.
//
// Silhouette first. Each idea as name / identity feature that sets the
// outline / the moment / colour parts:
//  kept  Luchador         a masked head between two flexed arms          the victory flex           blue mask and tights, tan, gold belt
//  kept  Karakuri Tea Doll a tray with a cup held out past the face      bringing your tea          black hair, white face, red, indigo
//  kept  Sock Puppet      a forearm hooked over into a wide-open mouth   mid-sentence               teal sock, red mouth, white cuff
//  kept  Pinocchio        the nose, out past the face, sprouting a leaf  just told one               wood, red cap and shorts, blue jacket
//  kept  Daruma Otoshi    one disc knocked half out of the stack         the hammer just struck     blue and wood discs, yellow, red daruma
//  kept  Hobby Horse      a horse's head on a bare stick                 waiting to be ridden       white head, black mane, red bridle
//  kept  Toy Dinosaur     a big open-jawed head over tiny arms           roaring, at shin height    green, cream belly, white teeth
//  kept  Rag Doll         yarn bunches out each side of a button-eyed face  sat where you left her  orange yarn, peach face, blue dress
//  cut   Toy Telephone    built twice: a red box with a face, but the handset on top reads
//                         as a staple, then a slab (as page 18's Telephone found)
//  cut   Space Hopper     built twice: an orange ball with horns reads as a pumpkin, then a fox's head
//  cut   Nose Glasses     built twice: black rims, brows and moustache merge round the pink nose
//  cut   Rubber Chicken   built: on its back, legs up, a yellow lump; at 40 px a roast chicken
//  cut   Blacksmiths      built (the Bogorodskoye bear and man at the anvil): two 3-wide figures
//                         and two hammers are noise at 40 px, and one face looks away
//  cut   Kathputli        built: the control bar and strings frame the puppet like a doorway
//  cut   Ventriloquist Dummy built: a boy in a suit, the jaw lines vanish; Show Time cut one too
//  out   Tin Spaceship, Wind-up Mouse, Toy Soldier, cup-and-ball: Rocket and UFO, Wind-up Mouse,
//        Nutcracker (the same shako and red coat) and Kendama exist
//  out   Wooden Duck on wheels  Rubber Duck owns the duck, Rabbit Lantern the animal on wheels
//  out   Nevalyashka      the roly-poly's outline is the Nesting Doll's and the Daruma's
//  out   Hahoe Mask       a face slab in one wood colour, and Show Time has Theatre Masks
//  out   Channapatna toys lacquered rings and tops: page 18's Stacking Rings and Spinning Top
//  out   Marionette       the strings are 1-thick shafts; Pinocchio is this page's puppet
//  out   Pull-string Doll the ring and string are 1-thick; otherwise the Rag Doll
//  out   Tamagotchi       a solid egg: about 50 taps
// Learns from: Luchador, the Cymbal Monkey (the action limbs on the outline,
// at full width) and the Kokeshi (a symmetric frontal icon); Karakuri, the
// Akabeko (a folk figure side on, its face at the +x end) and the Basket Dog
// (the thing it carries sets the outline); Sock Puppet, the Sock Monkey (a
// sock and one red part that names it) and the Chattering Teeth (a mouth open
// toward you); Pinocchio, the Frog Prince (the tale's twist as one part) and
// the Origami Fox (a point for a sly thing); Daruma Otoshi, the Piggy Bank
// and Instant Camera (the moment as a part half out); Hobby Horse, the Dala
// Horse (a folk horse, a profile); Toy Dinosaur, the Meerkat Lookout (the
// upright stance is the read); Rag Doll, the Sock Monkey (sat where you left
// it, legs out) and the Troll Doll (the hair sets the outline, the face stays
// big).
// Dated stones: Sock Puppet for Lost Sock Memorial Day (9 May); Luchador for
// Mexico's Día de la Lucha Libre (21 September, the first lucha libre show in
// 1933).
// Faces and details look toward +z / +x.
import { grid } from '../voxel.js';
import { INK, sheet, tint } from './kit.js';

// Flat material colours: the game's light does the shading.
const lucha = 0x3f78d8, luchaSkin = 0xe8a878, belt = 0xf2c14e, flame = 0xfbf8f2,
  hakama = 0x4a5a9a, kimono = 0xd8433c, hair = 0x2e2a36, gofun = 0xfbf6ee, tray = 0xa8693f, cup = 0xe4f0f6, tea = 0x7ed05a, lips = 0xd8343c,
  sock = 0x3fb8a8, cuff = 0xfbf3e6, felt = 0xd8343c, googly = 0xfbf8f2,
  wood = 0xe2b07a, cap = 0xd8433c, jacket = 0x4f86cf, shoe = 0x6b4a3a, paint = 0x4a3428, leaf = 0x7ed05a,
  discB = 0x4f86cf, discC = 0xf2dcb0, discY = 0xf6d14a, daruma = 0xe0434b, darumaFace = 0xfbf6ee,
  horse = 0xf6efe0, mane = 0x3a2e2a, stick = 0xe8c89a, bridle = 0xd8343c, nostril = 0x6b4a3a,
  dino = 0x5fae5a, belly = 0xf2e2a8, tooth = 0xfbf8f2, roar = 0xd8343c,
  dress = 0x4f86cf, stocking = 0xe0434b, ragShoe = 0x2e2a36, ragFace = 0xf6d2b4, yarn = 0xe8532e, ragCheek = 0xf07a8a, ragSmile = 0xc0303c;

export default [
  // Luchador (the Mexican masked wrestler, as a toy figure). Identity: a
  // masked head between two arms flexed up, setting the full width. Moment:
  // the victory flex. Parts: blue mask and tights, tan chest and arms, a gold
  // belt; white flames round the eyes and a stripe over the top say "mask".
  // Dated: 21 September, Mexico's Día de la Lucha Libre.
  (() => {
    const g = grid(9, 10, 3);
    for (const x of [2, 5]) g.box([x, x + 1], [0, 1], [0, 2], lucha);                      // boots and tights
    g.box([2, 6], [2, 2], [0, 2], lucha);                                                 // trunks
    g.box([2, 6], [3, 3], [0, 2], belt);                                                  // the belt
    g.box([3, 5], [4, 4], [0, 2], luchaSkin).box([1, 7], [5, 5], [0, 2], luchaSkin);      // chest, shoulders
    for (const x of [0, 8]) g.box([x, x], [5, 8], [1, 2], luchaSkin);                     // forearms up, fists
    g.box([1, 1], [6, 6], [1, 2], luchaSkin).box([7, 7], [6, 6], [1, 2], luchaSkin);      // biceps
    g.box([2, 6], [6, 9], [0, 2], lucha);                                                 // the mask
    for (const z of [0, 1, 2]) g.clear(2, 9, z).clear(6, 9, z).clear(2, 6, z).clear(6, 6, z);
    g.clear(3, 9, 0).clear(5, 9, 0).clear(2, 8, 0).clear(6, 8, 0);                        // rounded at the back
    g.set(3, 8, 2, INK).set(5, 8, 2, INK);                                                // eyes
    g.set(2, 8, 2, flame).set(6, 8, 2, flame).set(3, 7, 2, flame).set(5, 7, 2, flame);    // white flames round them
    g.set(4, 9, 0, flame).set(4, 9, 1, flame).set(4, 9, 2, flame);                        // a stripe over the top
    g.set(4, 6, 2, luchaSkin);                                                            // the mouth
    return g.entry({ id: 'cand-p19-luchador', name: 'Luchador', fraction: 0.65, seed: 2, story: 'Undefeated. Has never once taken the mask off, even for bath time.' });
  })(),

  // Karakuri Tea Doll (chahakobi ningyō, the Edo tea-serving automaton).
  // Identity: a tray with a cup held out past the face, setting the width.
  // Moment: bringing your tea. Parts: indigo hakama (darkest, lowest), red
  // kimono, black hair, a white face toward +x; a wooden tray, a pale cup
  // with green tea.
  (() => {
    const g = grid(7, 10, 5);
    g.box([0, 4], [0, 3], [0, 4], hakama);                                                // the hakama
    for (const [x, z] of [[0, 0], [0, 4], [4, 0], [4, 4]]) g.box([x, x], [0, 3], [z, z], 0);
    g.box([0, 0], [3, 3], [1, 3], 0).box([4, 4], [3, 3], [1, 3], 0);                       // a step under the tray
    g.box([1, 3], [4, 5], [1, 3], kimono);                                                // the kimono
    for (const z of [0, 4]) g.box([1, 3], [3, 5], [z, z], kimono).set(4, 4, z, kimono).set(5, 4, z, gofun);   // sleeves, arms, hands
    g.box([4, 6], [4, 4], [1, 3], tray);                                                  // the tray
    g.set(5, 5, 1, cup).set(5, 5, 3, cup).set(4, 5, 2, cup).set(6, 5, 2, cup).set(5, 5, 2, tea);   // the cup of tea
    g.box([0, 3], [6, 9], [0, 4], hair);                                                  // the head
    for (const [x, y, z] of [[0, 9, 0], [0, 9, 4], [3, 9, 0], [3, 9, 4], [0, 6, 0], [0, 6, 4], [0, 8, 0], [0, 8, 4], [0, 7, 0], [0, 7, 4]]) g.clear(x, y, z);
    g.box([0, 0], [9, 9], [1, 3], 0).box([0, 0], [6, 6], [1, 3], 0);
    g.box([3, 3], [6, 8], [1, 3], gofun);                                                 // the face
    for (const z of [0, 4]) g.box([2, 3], [6, 7], [z, z], gofun);
    g.set(3, 7, 1, INK).set(3, 7, 3, INK).set(3, 6, 2, lips);                             // eyes, a little mouth
    return g.entry({ id: 'cand-p19-karakuri', name: 'Karakuri Tea Doll', fraction: 0.65, seed: 4, story: 'Brings your tea, waits while you drink it, then walks home with the cup.' });
  })(),

  // Sock Puppet. Identity: a forearm in a sock, hooked over into a mouth
  // wide open toward +x, googly eyes on top. Moment: mid-sentence. Parts:
  // teal sock, the red felt inside the mouth, a white cuff (lowest); white
  // googly eyes with dark pupils. Dated: 9 May, Lost Sock Memorial Day.
  (() => {
    const g = grid(8, 10, 3);
    g.box([0, 2], [0, 3], [0, 2], sock).box([0, 2], [0, 1], [0, 2], cuff);                // the forearm, the cuff
    for (const x of [0, 2]) g.clear(x, 0, 0).clear(x, 0, 2);
    g.box([0, 6], [3, 3], [0, 2], sock);                                                  // the lower jaw
    g.box([2, 6], [4, 4], [0, 2], felt).box([2, 2], [5, 6], [0, 2], felt);                // the red inside of the mouth
    g.box([0, 1], [4, 6], [0, 2], sock);                                                  // the back of the head
    g.box([0, 7], [7, 8], [0, 2], sock);                                                  // the upper jaw
    for (const z of [0, 2]) g.clear(0, 8, z).clear(7, 8, z);
    for (const z of [0, 2]) g.set(4, 9, z, googly).set(5, 9, z, INK);                     // googly eyes
    return g.entry({ id: 'cand-p19-sock-puppet', name: 'Sock Puppet', fraction: 0.65, seed: 8, story: 'Made from a lost sock. It has views on where the other went.' });
  })(),

  // Pinocchio (Collodi's wooden puppet). Identity: the nose, three cubes out
  // past the face toward +x, a leaf sprouting at its tip. Moment: he has just
  // told one. Parts: bare wood (face, hands, legs), red cap and shorts, blue
  // jacket, painted brown hair at the back; dark shoes lowest.
  (() => {
    const g = grid(7, 10, 3);
    for (const z of [0, 2]) g.box([1, 3], [0, 0], [z, z], shoe).box([1, 2], [1, 1], [z, z], wood);   // shoes, wooden legs
    g.box([0, 2], [2, 2], [0, 2], cap);                                                   // shorts
    g.box([0, 2], [3, 4], [0, 2], jacket);                                                // the jacket
    for (const z of [0, 2]) g.set(2, 3, z, wood);                                         // hands
    g.box([0, 3], [5, 7], [0, 2], wood);                                                  // the head
    g.box([0, 0], [5, 7], [0, 2], paint);                                                 // painted hair
    g.set(3, 6, 0, INK).set(3, 6, 2, INK);                                                // eyes
    g.box([4, 6], [6, 6], [1, 1], wood).set(6, 7, 1, leaf);                               // the nose, sprouting
    g.box([0, 3], [8, 8], [0, 2], cap).box([0, 1], [9, 9], [1, 1], cap);                  // the cap
    return g.entry({ id: 'cand-p19-pinocchio', name: 'Pinocchio', fraction: 0.65, seed: 3, story: 'Says he has never told a lie. The nose has its own opinion.' });
  })(),

  // Daruma Otoshi (the Japanese hammer-and-stack game). Identity: one disc
  // knocked half out of the stack toward +x, the daruma still sitting on top.
  // Moment: the hammer has just struck. Parts: discs in blue and pale wood
  // (not the macaw's red, green, blue and yellow: built that way it read as a
  // parrot), the knocked one yellow; a red daruma with a white face toward +z.
  (() => {
    const g = grid(7, 9, 5);
    const disc = (x0, y, c) => {
      g.box([x0, x0 + 4], [y, y], [0, 4], c);
      for (const [x, z] of [[x0, 0], [x0, 4], [x0 + 4, 0], [x0 + 4, 4]]) g.clear(x, y, z);
    };
    disc(0, 0, discB); disc(0, 1, discC); disc(2, 2, discY); disc(0, 3, discC); disc(0, 4, discB);   // one knocked out
    for (const y of [5, 6, 7]) disc(0, y, daruma);                                       // the daruma
    g.box([1, 3], [8, 8], [1, 3], daruma).box([0, 0], [7, 7], [1, 3], 0).box([1, 3], [7, 7], [0, 0], 0);   // rounded at the back
    g.box([1, 3], [5, 7], [4, 4], darumaFace);                                            // its white face
    g.set(1, 6, 4, INK).set(3, 6, 4, INK);                                                // eyes
    return g.entry({ id: 'cand-p19-daruma-otoshi', name: 'Daruma Otoshi', fraction: 0.65, seed: 3, story: 'Knock out one layer at a time. The daruma pretends not to notice.' });
  })(),

  // Hobby Horse. Identity: a horse's head on a bare stick, the long face
  // toward +x. Moment: leant waiting to be ridden. Parts: white cloth head,
  // black yarn mane down the back, a red bridle across the cheek; a pale
  // wooden stick.
  (() => {
    const g = grid(8, 10, 3);
    sheet(g, [
      '..EE....',
      '.MHHH...',
      'MMHHHH..',
      'MHHHHHHH',
      'MHHHHHHH',
      '.MHH.HH.',
      '..SS....',
      '..SS....',
      '..SS....',
      '..SS....',
    ], [0, 2], { E: horse, M: mane, H: horse, S: stick });
    g.clear(2, 9, 1).clear(3, 9, 1);                                                      // two ears
    for (const y of [0, 1, 2, 3]) for (const x of [2, 3]) g.clear(x, y, 0).clear(x, y, 2);   // the stick, thin
    g.clear(3, 0, 1);
    g.set(4, 7, 0, INK).set(4, 7, 2, INK);                                                // eyes
    g.box([5, 5], [4, 7], [0, 2], bridle).clear(5, 7, 1);                                 // the bridle
    g.set(7, 5, 0, nostril).set(7, 5, 2, nostril);
    return g.entry({ id: 'cand-p19-hobby-horse', name: 'Hobby Horse', fraction: 0.65, seed: 5, story: 'Gallops anywhere you like, provided you do all the running.' });
  })(),

  // Toy Dinosaur (the plastic T. rex). Identity: a big open-jawed head on an
  // upright body, the tail on the ground behind, tiny arms. Moment: roaring,
  // from shin height. Parts: green plastic, a cream belly and throat; white
  // teeth and a red mouth as accents.
  (() => {
    const g = grid(9, 10, 3);
    sheet(g, [
      '....HHHH.',
      '....HHHHH',
      '....HH...',
      '...BHHHH.',
      '...BBB...',
      '..BBBB...',
      '..BBBB...',
      '.BBBBB...',
      'TBBBBB...',
      'TT..BBB..',
    ], [0, 2], { H: dino, B: dino, T: dino });
    for (const [x, y] of [[0, 0], [0, 1], [1, 0], [1, 1], [1, 2], [2, 3], [2, 4]]) g.clear(x, y, 0).clear(x, y, 2);   // the tail, narrower
    g.clear(4, 0, 1).clear(5, 0, 1).clear(6, 0, 1).clear(5, 1, 1);                        // two legs
    tint(g, (x, y) => x === 5 && y >= 2 && y <= 5, belly);                                // the cream belly
    tint(g, (x, y) => x >= 4 && y === 6, belly);
    for (const z of [0, 2]) g.set(6, 4, z, dino);                                          // tiny arms
    g.set(7, 8, 0, INK).set(7, 8, 2, INK);                                                // eyes
    for (const x of [6, 8]) g.set(x, 7, 1, tooth);                                        // teeth
    g.box([5, 7], [6, 6], [1, 1], roar);                                                  // the mouth
    return g.entry({ id: 'cand-p19-toy-dinosaur', name: 'Toy Dinosaur', fraction: 0.65, seed: 4, story: "Fearsome, from a toddler's height. The arms let it down a bit." });
  })(),

  // Rag Doll (page 18's failed twice: a red nose made a clown, the hair a
  // helmet). Identity: orange yarn bunches out each side of a big peach face
  // with button eyes; the top is loops, not a cap. Moment: sat where you left
  // her, legs out, arms flopped. Parts: orange yarn, peach face, blue dress;
  // pink cheeks, a stitched smile, red stockings and black shoes as accents.
  (() => {
    const g = grid(7, 8, 5);
    g.box([1, 5], [0, 2], [0, 2], dress);                                                 // the dress, sitting
    for (const x of [2, 4]) g.set(x, 0, 3, stocking).set(x, 0, 4, ragShoe);               // legs out
    for (const x of [0, 6]) g.box([x, x], [1, 2], [1, 1], dress).set(x, 0, 1, ragFace);   // floppy arms
    g.box([1, 5], [3, 6], [0, 2], ragFace);                                               // the head
    g.box([1, 5], [3, 6], [0, 0], yarn).box([1, 5], [7, 7], [0, 2], yarn);                // yarn hair
    g.clear(1, 7, 2).clear(3, 7, 2).clear(5, 7, 2).clear(1, 7, 0).clear(5, 7, 0);         // in loops
    g.box([1, 5], [6, 6], [2, 2], yarn).set(3, 6, 2, ragFace);                            // the fringe
    for (const x of [0, 6]) g.box([x, x], [4, 6], [0, 1], yarn).clear(x, 6, 1);           // bunches out to the sides
    g.set(2, 5, 2, INK).set(4, 5, 2, INK);                                                // button eyes
    g.set(1, 4, 2, ragCheek).set(5, 4, 2, ragCheek).set(3, 3, 2, ragSmile);               // cheeks, a stitched smile
    return g.entry({ id: 'cand-p19-rag-doll', name: 'Rag Doll', fraction: 0.65, seed: 3, story: 'Loved so hard her stuffing has moved. She would not have it otherwise.' });
  })(),
];
