// Page 18 · III Small Wonders: daily stones, "myths, marvels and the slightly
// impossible". Each is one clear twist on a thing everyone knows, so a
// stranger can name it from a shared link: a hut that walks, a lighthouse
// with company, a sword nobody can pull. Sky: Night (deep navy to
// periwinkle), so bodies stay light or warm. Designed silhouette first
// (docs/voxel-study.md, "Silhouette and character"): each written down as
// name / identity feature that sets its outline / pose or moment / colour
// parts, before any cubes. Faces and details look toward +z / +x. Authored
// flat; the game's dithered light shades them.
//
// Brainstorm (19), the eight kept first. Every built one was looked at in
// the QA sheet's silhouette and 40 px panels; the ones that failed there were cut.
//   Baba Yaga's Hut   kept: a log hut on two chicken legs, mid-stride; two
//                     lit windows and a door make a face. Wood, moss thatch, orange legs
//   Kraken & Lighthouse kept: a tentacle up the side and curled over the
//                     lamp. White and red stripes, purple arm, lit lamp
//   Sword in the Stone kept: a cross-hilt on a boulder, waiting. Grey stone, gold hilt
//   Nessie            kept: a hump, a tail flick and a long neck in a little
//                     lake, head turned for the photograph. Green, lake blue
//   Humpty Dumpty     kept: an egg on a wall, arms out for balance, legs
//                     dangling. Cream egg, blue belt, brick
//   Genie             kept: rising out of the spout, arms flung up, gold
//                     cuffs. Gold lamp, blue genie, red sash
//   Jackalope         kept: a sitting jackrabbit, ears up, antlers out to
//                     the full width. Tan, cream, bone antlers
//   Frog Prince       kept: a crown between bulging eyes, lips puckered, on
//                     a lily pad. Green frog, gold crown, dark pad
//   Cerberus Pup      cut after 3 builds: three 3-wide heads in a 9-wide block
//                     merge into one brown band; at 40 px a blob with dark spots
//   Trojan Horse      cut after 2 builds: the boxy wooden body read as a bear,
//                     and Dala Horse already owns the wooden horse
//   Mimic             cut after 2 builds: a chest with teeth reads, but it is a
//                     gamer's joke, and the lid's fangs hid its eyes from the game corner
//   Pumpkin Coach     cut after 2 builds: square wheels read as legs; round ones
//                     blow the tap budget
//   Golden Goose      cut after 1 build: a white box beside a gold box; the egg
//                     needs a caption
//   Phoenix Chick, Ship in a Bottle, Cloud Castle, Jack-in-the-Box, Music
//                     Box, Sphinx: no, already in the game
//   Dragon Egg        no: Hatching Chick and Baby Dragon have it between them
//   Mermaid on a Rock no: a person at 9 cubes; the tail alone is Whale Tail
//   Fairy Door Stump  no: Flowerpot with a Door, Toadstool Cottage, Treehouse
//   Rapunzel's Tower  no: a second tall tower beside the lighthouse
//   Kitsune           no: a fourth fox, and a fan of tails is mush at 40 px
import { grid } from '../voxel.js';
import { INK, pair, tint } from './kit.js';

// Flat material colours: the game's light does the shading.
const hutWood = 0x8a5a3c, thatch = 0x8fae5a, leg = 0xf2a03d, glow = 0xffe27a, door = 0x4a3a3a,
  tower = 0xf6f0e6, band = 0xe0434b, sea = 0x3f8fc4, tentacle = 0xb57ad8, sucker = 0xf4c6e6, lamp = 0xfff0a0,
  stone = 0xa9a6ad, steel = 0xe4ebf2, hilt = 0xf2c14e, grip = 0x7a4a8a,
  nessie = 0x6cbf5c, lake = 0x3f8fc4,
  egg = 0xf8f1e2, brick = 0xc6654a, belt = 0x4f7fd0, bow = 0xe0434b, shoe = 0x4a3a3a,
  brass = 0xe6b04a, genie = 0x5ab8ee, sash = 0xe0434b,
  hare = 0xc9925a, cream = 0xf6ead6, nosePink = 0xf08aa2, earPink = 0xf2b2b8, antler = 0xf1e3c4,
  frog = 0x86cc5c, crown = 0xf2c14e, pad = 0x2f8a6a, lips = 0xf07a8a, eyeW = 0xfbf8f2;

export default [
  // Baba Yaga's Hut. Identity: a hut up on two chicken legs, the gap
  // between them a notch under the house. Moment: mid-stride, one foot
  // lifted. Parts: log walls, moss thatch with eaves, orange legs; two lit
  // windows and a door make a face toward you.
  (() => {
    const g = grid(7, 9, 4);
    g.box([1, 5], [4, 6], [0, 3], hutWood);                                                 // the hut
    g.box([0, 6], [7, 7], [0, 3], thatch).box([0, 6], [8, 8], [1, 2], thatch);              // the roof
    g.set(2, 5, 3, glow).set(4, 5, 3, glow).set(3, 4, 3, door);                             // windows and door
    g.box([2, 2], [1, 3], [1, 1], leg);                                                     // left leg, planted
    g.set(2, 0, 0, leg).box([2, 2], [0, 0], [1, 3], leg).set(1, 0, 2, leg);                // its foot, toes forward
    g.set(4, 3, 1, leg).set(4, 2, 1, leg).set(4, 2, 2, leg);                                // right leg, stepping
    g.box([4, 4], [1, 1], [2, 3], leg).set(5, 1, 3, leg);                                   // its foot, lifted
    return g.entry({ id: 'cand-p18-baba-yaga-hut', name: "Baba Yaga's Hut", lit: { keep: [glow] }, story: 'It goes for a walk most nights. Knock, and it may turn round.' });
  })(),

  // Kraken & Lighthouse. Identity: a lighthouse (red and white bands, lamp,
  // red cap) with a purple arm up its side, the tip curled over the top.
  // Moment: reaching for the light. Parts: white tower, red bands, purple
  // arm, a ring of sea; the lamp and two suckers are accents.
  (() => {
    const g = grid(5, 10, 5);
    g.cylinder('y', [2, 2], 2.6, [0, 0], sea);                                              // the sea
    g.box([1, 3], [1, 6], [1, 3], tower);                                                   // the tower
    tint(g, (x, y) => y === 2 || y === 5, band);                                            // red bands
    g.box([1, 3], [7, 7], [1, 3], lamp);                                                    // the lamp room
    for (const [x, z] of [[1, 1], [3, 1], [1, 3], [3, 3]]) g.set(x, 7, z, tower);
    g.box([1, 3], [8, 8], [1, 3], band).clear(1, 8, 1).clear(3, 8, 1).clear(1, 8, 3).clear(3, 8, 3);   // the cap
    const arm = [[0, 1, 4], [1, 1, 4], [2, 1, 4], [3, 1, 4], [4, 1, 4], [4, 1, 3], [4, 2, 3], [4, 2, 2],    // round the foot
      [4, 3, 2], [4, 4, 2], [4, 5, 2], [4, 6, 2], [4, 7, 2], [4, 8, 2], [4, 9, 2], [3, 9, 2]];               // up the side, over the top
    for (const [x, y, z] of arm) g.set(x, y, z, tentacle);
    for (const y of [4, 6]) g.set(4, y, 3, sucker);
    return g.entry({ id: 'cand-p18-kraken-lighthouse', name: 'Kraken & Lighthouse', seed: 3, lit: { keep: [lamp] }, story: 'It only wanted to know what the light was for.' });
  })(),

  // Sword in the Stone. Identity: the cross-hilt on top of a boulder, the
  // outline's whole top. Moment: waiting for the right hand. Parts: grey
  // stone (big), a steel blade, gold guard and pommel, a purple grip.
  (() => {
    const g = grid(7, 8, 4);
    g.ellipsoid([3, 0.2, 1.5], [3.4, 2.9, 2.1], stone);                                     // the stone
    g.set(3, 3, 2, steel).set(3, 4, 2, steel);                                              // the blade
    g.box([2, 4], [5, 5], [2, 2], hilt).set(3, 6, 2, grip).set(3, 7, 2, hilt);             // guard, grip, pommel
    return g.entry({ id: 'cand-p18-sword-stone', name: 'Sword in the Stone', seed: 3, story: 'Plenty have tried. The stone is enjoying this enormously.' });
  })(),

  // Nessie. Identity: a hump and a long neck out of the water (the famous
  // photograph), with a tail flick behind. Moment: head turned to the
  // camera. Parts: green Nessie, a little blue lake; two eyes.
  (() => {
    const g = grid(9, 7, 4);
    g.ellipsoid([4, 0, 1.5], [4.6, 0.5, 2.2], lake);                                        // the lake
    for (const z of [1, 2]) {
      for (const [x, y] of [[0, 2], [1, 2], [1, 1]]) g.set(x, y, z, nessie);               // the tail
      for (const [x, y] of [[3, 1], [3, 2], [4, 2], [4, 3], [5, 2], [5, 1]]) g.set(x, y, z, nessie);   // the hump
      for (const [x, y] of [[7, 1], [7, 2], [7, 3], [7, 4]]) g.set(x, y, z, nessie);       // the neck
    }
    g.box([6, 8], [5, 6], [1, 3], nessie);                                                  // the head
    g.set(6, 6, 3, INK).set(8, 6, 3, INK);                                                  // eyes
    return g.entry({ id: 'cand-p18-nessie', name: 'Nessie', story: 'She is in every photograph. Nobody believes any of them.' });
  })(),

  // Humpty Dumpty. Identity: a big egg sitting on a wall. Moment: arms out
  // for balance, legs dangling over the front. Parts: cream egg (big), brick
  // wall, a blue belt and trousers; a red bow tie, dark shoes, eyes.
  (() => {
    const g = grid(7, 9, 4);
    g.box([0, 6], [0, 1], [0, 1], brick);                                                   // the wall
    g.ellipsoid([3, 5, 1.6], [2.7, 3.2, 1.9], egg);                                         // the egg
    tint(g, (x, y) => y === 4, belt);                                                       // belt
    g.set(3, 4, 3, bow);                                                                    // bow tie
    pair(g, 2, 6, 3, INK);                                                                  // eyes
    pair(g, 0, 5, 1, egg); pair(g, 0, 6, 1, egg);                                           // arms out
    pair(g, 2, 1, 2, belt); pair(g, 2, 0, 2, shoe);                                         // legs and shoes
    return g.entry({ id: 'cand-p18-humpty-dumpty', name: 'Humpty Dumpty', seed: 3, story: 'He has been asked to come down. He says the view is worth it.' });
  })(),

  // Genie. Identity: a blue figure rising out of a gold lamp's spout on a
  // curl of smoke. Pose: arms flung up, ta-da, both on the outline. Parts:
  // gold lamp (spout, lid, handle), blue genie, a red sash where the smoke
  // becomes a genie; gold cuffs.
  (() => {
    const g = grid(9, 10, 3);
    g.box([2, 4], [0, 0], [1, 1], brass).set(3, 0, 0, brass).set(3, 0, 2, brass);          // the foot
    g.box([1, 6], [1, 1], [0, 2], brass).clear(1, 1, 0).clear(1, 1, 2).clear(6, 1, 0).clear(6, 1, 2);
    g.box([1, 6], [2, 2], [0, 2], brass);                                                   // the body
    g.box([2, 4], [3, 3], [1, 1], brass).set(3, 3, 0, brass).set(3, 3, 2, brass);          // the lid
    g.set(7, 2, 1, brass).set(7, 3, 1, brass);                                              // the spout
    for (const [x, y] of [[0, 2], [0, 3], [0, 4], [1, 4], [2, 4]]) g.set(x, y, 1, brass);   // the handle
    g.set(7, 4, 1, genie).set(6, 4, 1, genie).set(6, 5, 1, genie).set(5, 5, 1, genie);     // the curl of smoke
    g.box([4, 6], [6, 6], [0, 2], sash).box([3, 7], [7, 7], [0, 2], genie);                 // sash and shoulders
    g.box([4, 6], [8, 9], [0, 2], genie).clear(4, 9, 0).clear(6, 9, 0);                     // the head
    g.set(4, 8, 2, INK).set(6, 8, 2, INK);                                                  // eyes
    for (const x of [2, 8]) g.set(x, 7, 1, genie).set(x, 8, 1, brass).set(x, 9, 1, genie); // arms up, gold cuffs
    return g.entry({ id: 'cand-p18-genie', name: 'Genie', fraction: 0.5, seed: 5, story: 'A thousand years in a lamp, and he still does the arms.' });
  })(),

  // Jackalope. Identity: antlers on a rabbit, branching out to the full
  // width, the long ears straight up between them (a V notch). Pose:
  // sitting up, very pleased with itself. Parts: tan hare, cream belly and
  // muzzle, bone antlers; eyes, pink nose and inner ears.
  (() => {
    const g = grid(9, 9, 3);
    g.box([2, 6], [0, 2], [0, 2], hare).clear(2, 2, 0).clear(6, 2, 0).clear(2, 2, 2).clear(6, 2, 2);   // the body
    g.box([3, 5], [0, 1], [2, 2], cream);                                                   // belly
    g.box([3, 5], [3, 5], [0, 2], hare).set(2, 4, 1, hare).set(6, 4, 1, hare);              // the head, cheeks
    g.set(4, 3, 2, cream).set(4, 4, 2, nosePink);                                           // muzzle, nose
    g.set(3, 4, 2, INK).set(5, 4, 2, INK);                                                  // eyes
    for (const x of [3, 5]) g.box([x, x], [6, 8], [1, 1], hare).set(x, 7, 2, earPink);     // ears, straight up
    for (const [x, y] of [[2, 5], [1, 5], [0, 5], [1, 6], [1, 7], [0, 7], [0, 8]]) pair(g, x, y, 1, antler);   // antlers
    return g.entry({ id: 'cand-p18-jackalope', name: 'Jackalope', fraction: 0.6, seed: 2, story: 'Half rabbit, half deer, and entirely sure of itself.' });
  })(),

  // Frog Prince. Identity: a gold crown between two bulging eyes on a wide
  // frog. Moment: lips puckered, waiting. Parts: green frog (big), a dark
  // lily pad with its notch, the gold crown; eyes and the pink pucker.
  (() => {
    const g = grid(9, 6, 5);
    g.ellipsoid([4, 0, 2], [4.4, 0.5, 2.5], pad).clear(3, 0, 0).clear(4, 0, 0).clear(5, 0, 0);   // the lily pad
    g.box([1, 7], [1, 2], [0, 3], frog).clear(1, 2, 0).clear(7, 2, 0);                      // the body
    g.box([2, 6], [3, 3], [1, 3], frog);                                                    // the head
    g.box([0, 0], [1, 1], [0, 2], frog).box([8, 8], [1, 1], [0, 2], frog);                  // haunches
    pair(g, 2, 1, 4, frog);                                                                 // front feet
    for (const x of [1, 2]) pair(g, x, 4, 2, frog);                                         // eye bumps
    pair(g, 1, 4, 3, eyeW); pair(g, 2, 4, 3, INK);                                          // eyes
    g.box([3, 5], [4, 4], [1, 2], crown); pair(g, 3, 5, 2, crown); g.set(4, 5, 1, crown);  // the crown
    g.set(4, 2, 4, lips);                                                                   // the pucker
    return g.entry({ id: 'cand-p18-frog-prince', name: 'Frog Prince', story: 'One kiss, he says. He has said it to several ducks.' });
  })(),
];
