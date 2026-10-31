// Page 16 · IV Lit From Within: for Lantern Festival ("festival things, lit
// from within"): masks, charms and folk spirits out for one night. Designed
// silhouette first (docs/voxel-study.md, "Silhouette and character"): each
// candidate is written down as a one-noun name, the identity feature that
// sets its outline, its pose, and its 2-3 colour parts, before any cubes.
// Faces and details look toward +x / +z. Authored flat; the game's dithered
// light shades them. Sky: Festival.
//
// Brainstorm (13), the six kept first. Every one was built and looked at
// in the QA sheet's silhouette and 40 px panels; the ones that failed there
// were cut.
//   Tengu           kept: the long nose past the edge of a narrow red face
//   Basket Dog      kept: a straw basket worn as a hat, wider than the head
//   Akabeko         kept: a red ox toy, head nodding low on its spring
//   Goldfish Lantern kept: the round body and the forked fan tail
//   Fox Mask        kept: ear prongs over a white face plate, snout to you
//   Rabbit Lantern  kept: tall ears over a paper body on round wheels
//   Karakasa        cut after 4 builds: closed, it read as a little gold man;
//                   open, as an egg, then a lollipop tree on a tile. The leg
//                   hides under the canopy from the game corner
//   Lion Dance      cut after 1 build: the spotted green cloth read as a turtle,
//                   and the red head is Dragon Head's job in this chapter
//   Paper Crane     not built: about 10% fill, and its wings out are Pegasus Foal's
//   Teru Teru Bozu  no: ball over a skirt is Little Ghost and Lantern Ghost again
//   Goldfish in a Bag no: the fish hides inside a blob of water
//   Omamori         no: a small pouch needs a caption
//   Money Toad      no: Stone Frog, Kiln Toad and Tin Frog have the outline
import { grid } from '../voxel.js';
import { INK, pair, pairZ, tint } from './kit.js';

// Flat material colours: the game's light (lit() in shapes.js) does the shading.
const tenguRed = 0xe0434b, robe = 0x5b6a94, hair = 0xfbf8f2, geta = 0x8a5a3c,
  dogWhite = 0xf8f4ec, basket = 0xc8924a, collar = 0xe0434b, ear = 0x4a3a4a,
  beko = 0xe0433f, bekoDk = 0x3a3442, horn = 0xf6efe4, spot = 0xf6d365, muzzle = 0xfbf8f2,
  fish = 0xe8483c, belly = 0xfbf3e6, fin = 0xf59a62, mouth = 0xf07a8a, glow = 0xffd77a,
  maskWhite = 0xf8f4ec, maskRed = 0xe0434b,
  rabbit = 0xf8f4ec, rabbitRed = 0xe0434b, wheel = 0x8a5a3c;

export default [
  // Tengu. Identity: the long red nose, straight out at you and past the
  // edge of a narrow red face. Pose: nose in the air (the proud mountain
  // goblin), standing on one-tooth geta. Parts: red face, slate robe,
  // white hair. (The fan, beard, wings and tokin cap all crowded the face
  // at 40 px and came off.)
  (() => {
    const g = grid(7, 8, 8);
    g.set(2, 0, 3, geta).set(4, 0, 3, geta);                                              // one-tooth geta
    g.box([2, 4], [1, 3], [2, 4], robe);                                                   // the robe
    pair(g, 1, 2, 3, robe); pair(g, 1, 1, 3, robe);                                        // sleeves
    g.box([2, 4], [4, 6], [2, 4], tenguRed);                                               // the head
    g.set(3, 5, 5, tenguRed).set(3, 5, 6, tenguRed).set(3, 6, 7, tenguRed).set(3, 6, 6, tenguRed);   // the nose, tip up
    pair(g, 2, 6, 4, INK);                                                                 // eyes, above it
    for (let y = 4; y <= 6; y++) for (const z of [2, 3]) pair(g, 1, y, z, hair);           // white hair
    g.box([2, 4], [4, 4], [1, 1], hair);
    return g.entry({ id: 'cand-p16-tengu', name: 'Tengu', story: 'He comes down from the mountain one night a year, for the sweets.' });
  })(),

  // Basket Dog (zarukaburi inu, the papier-mache charm dog). Identity: the
  // bamboo basket worn as a hat, wider than the head, over a big white
  // head. Pose: standing square to you, very serious about it. Parts:
  // white paper body, straw basket, red collar.
  (() => {
    const g = grid(9, 8, 8);
    for (const x of [3, 5]) for (const z of [2, 4]) g.set(x, 0, z, dogWhite);             // four stub legs
    g.box([3, 5], [1, 2], [1, 4], dogWhite);                                               // the body
    g.box([3, 5], [2, 2], [2, 4], collar);                                                 // red collar
    g.box([2, 6], [3, 5], [2, 5], dogWhite);                                               // the big head
    g.box([3, 5], [3, 3], [6, 6], dogWhite).set(4, 3, 7, INK);                             // the snout, the nose
    pair(g, 3, 4, 5, INK);                                                                 // eyes over the snout
    pair(g, 1, 4, 3, ear); pair(g, 1, 3, 3, ear); pair(g, 1, 4, 4, ear);                   // painted ears, flopped out
    g.set(4, 2, 0, dogWhite).set(4, 3, 0, dogWhite);                                       // tail up
    g.cylinder('y', [4, 3], 3.1, [6, 6], basket).cylinder('y', [4, 3], 1.9, [7, 7], basket);   // the basket, worn as a hat
    return g.entry({ id: 'cand-p16-basket-dog', name: 'Basket Dog', story: 'The basket keeps colds from getting in. It has never had one.' });
  })(),

  // Akabeko. Identity: a red ox with its head hung low and forward on the
  // spring, horns up. Pose: mid-nod. Parts: red body and head, black legs.
  (() => {
    const g = grid(9, 6, 5);
    for (const x of [1, 5]) for (const z of [1, 3]) g.box([x, x], [0, 1], [z, z], bekoDk);   // legs
    g.box([1, 5], [2, 4], [1, 3], beko);                                                   // the body
    g.clear(1, 4, 1).clear(1, 4, 3);
    g.box([6, 8], [1, 3], [1, 3], beko);                                                   // the head, nodding
    pairZ(g, 7, 3, 0, horn); pairZ(g, 7, 4, 0, horn);                                      // horns, out and up
    g.box([8, 8], [1, 1], [1, 3], muzzle);                                                 // white muzzle
    g.set(8, 2, 1, INK).set(8, 2, 3, INK);                                                 // eyes
    pairZ(g, 2, 3, 1, spot); pairZ(g, 4, 3, 1, spot);                                      // gold spots
    g.set(0, 3, 2, bekoDk).set(0, 2, 2, bekoDk);                                           // tail
    return g.entry({ id: 'cand-p16-akabeko', name: 'Akabeko', story: 'Tap its head and it agrees with you. It agrees with everyone.' });
  })(),

  // Goldfish Lantern. Identity: a round red body and the forked fan tail.
  // Pose: swimming on the air. Parts: red back, white belly; the candle
  // inside, found by peeling.
  (() => {
    const g = grid(9, 8, 5);
    g.ellipsoid([5.5, 3.5, 2], [2.7, 2.6, 2.0], fish);                                     // the body
    tint(g, (x, y) => y <= 2, belly);                                                      // white belly
    g.box([2, 2], [2, 5], [2, 2], fin).box([1, 1], [1, 6], [2, 2], fin);                   // the fan tail
    g.box([0, 0], [0, 2], [2, 2], fin).box([0, 0], [5, 7], [2, 2], fin);
    g.set(5, 7, 2, fin).set(4, 7, 2, fin);                                                 // the dorsal fin
    g.set(8, 4, 1, INK).set(8, 4, 3, INK).set(8, 3, 2, mouth);                            // eyes and a round mouth
    g.set(5, 3, 2, glow).set(5, 4, 2, glow);                                               // the candle inside
    return g.entry({ id: 'cand-p16-goldfish-lantern', name: 'Goldfish Lantern', seed: 2, lit: { keep: [glow] }, story: 'It swims the length of the street and back. Nobody remembers lighting it.' });
  })(),

  // Fox Mask. Identity: two ear prongs over a white face plate, the snout
  // coming at you. Pose: hung up at the stall, looking. Parts: white
  // plate, red markings.
  (() => {
    const g = grid(7, 9, 5);
    g.box([0, 6], [4, 6], [0, 1], maskWhite).box([1, 5], [3, 3], [0, 1], maskWhite).box([2, 4], [1, 2], [0, 1], maskWhite);
    pair(g, 0, 7, 0, maskWhite); pair(g, 1, 7, 0, maskRed); pair(g, 0, 8, 0, maskWhite);   // ears
    pair(g, 0, 7, 1, maskWhite); pair(g, 1, 7, 1, maskRed); pair(g, 0, 8, 1, maskWhite);
    g.box([2, 4], [2, 3], [2, 3], maskWhite);                                              // the snout
    g.set(3, 3, 4, INK);                                                                   // nose
    pair(g, 1, 5, 1, INK);                                                                 // eye slits
    pair(g, 2, 6, 1, maskRed); g.set(3, 6, 1, maskRed);                                    // brow flames
    return g.entry({ id: 'cand-p16-fox-mask', name: 'Fox Mask', story: 'Whoever wears it is a fox until morning. That is the rule.' });
  })(),

  // Rabbit Lantern. Identity: two tall ears over a paper body on round
  // wheels, a toy you pull. Pose: sitting up, ears pricked, waiting for the
  // string. Parts: white paper, wooden wheels, red ears and eyes.
  (() => {
    const g = grid(7, 9, 8);
    g.box([1, 5], [1, 3], [1, 6], rabbit);                                                 // the body
    for (const [x, y, z] of [[1, 3, 1], [5, 3, 1], [1, 3, 6], [5, 3, 6], [1, 1, 1], [5, 1, 1], [1, 1, 6], [5, 1, 6]]) g.clear(x, y, z);
    g.box([1, 5], [4, 4], [3, 6], rabbit).box([2, 4], [5, 5], [4, 6], rabbit);             // the head
    g.clear(1, 4, 6).clear(5, 4, 6);
    for (let y = 6; y <= 8; y++) { pair(g, 2, y, 5, rabbit); pair(g, 2, y, 6, rabbit); }                          // tall ears
    pair(g, 2, 5, 6, rabbitRed);                                                           // red eyes
    for (const x of [0, 6]) for (const zc of [2, 5]) {                                     // wheels
      g.box([x, x], [0, 2], [zc, zc], wheel).box([x, x], [1, 1], [zc - 1, zc + 1], wheel);
    }
    g.set(3, 2, 0, rabbit);                                                                // tail
    g.set(3, 2, 3, glow).set(3, 2, 4, glow);                                               // the candle inside
    return g.entry({ id: 'cand-p16-rabbit-lantern', name: 'Rabbit Lantern', lit: { keep: [glow] }, story: 'Pulled on a string all evening. It has seen the whole festival from knee height.' });
  })(),
];
