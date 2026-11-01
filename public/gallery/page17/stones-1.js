// Page 17 · II Kept in Stone: for Old Stones ("older than the temples;
// carved and mossy"): carved keepers, and the creatures who outlasted
// them. Palette: Stones (a pale grey-green mist, darker toward the
// ground), so grey stone is the risk: each figure is either clearly darker
// than the mist (the gargoyle, the cormorant) or a warm colour that is not
// grey (terracotta, sandstone, ironstone, a green snake), and each has one
// colour part that is not stone (moss, water, blue paint, a pink yawn).
// Live levels already in the chapter: Moai, Geode, Gate, Moss Spirit,
// Amber Midge, Stone Golem, Eye Stone, Fossil Fish, Sundial, Broken Column,
// Stone Hare, Giant's Hand.
//
// Aimed at Kellan's picks from pages 15 and 16 (Highland Cow, Red Grouse,
// Drystone Sheepfold, Sunfish, Broody Hen, Ice Lolly, Yawning Hippo,
// Scorpion, Grapes, Monk, Akabeko, Goldfish Lantern, Basket Dog): a
// creature caught doing its one thing, a chunky body in one flat colour
// with one strong accent, a face toward you, and a dry joke in the story.
//
// Silhouette first. Each idea as name / identity feature that sets the
// outline / signature pose / colour parts. Every kept one was built and
// looked at in the QA sheet's silhouette and 40 px panels.
//  kept  Gargoyle    bat wings and horns up behind a big head        spouting the rain        dark stone, pale cornice, moss; water
//  kept  Haniwa      one arm up, one down, a tube body with O eyes   dancing (or singing)     terracotta, moss mound
//  kept  Cormorant   wings held out wide, hooked beak in profile     drying them on a rock    black bird, pale rock, moss
//  kept  Sphinx      long lying lion, the striped headcloth flaps    lying in wait, no nose   sandstone, blue paint
//  kept  Grass Snake wound twice round a standing stone, head up     keeping the stone warm   green snake, pale stone; yellow collar
//  kept  Stone Troll big head, ears out, long arms to the ground     caught mid-yawn by dawn  brown ironstone, moss tuft; pink yawn
//  cut   Pigeon on a Statue  after 3 builds: at 40 px the bust never read as a head, and the
//                    pigeon read as a grey hat
//  cut   Barrow Badger  after 4 builds: the striped face under a capstone read as a zebra-striped
//                    box; the dolmen held two thirds of the cubes
//  out   Jizo        red cap and bib on a stone pill                 page 16 (Ember Steps) has it
//  out   Guardian Lion  mane, paw on a ball                          extra/temples has it; and the gargoyle is the stone beast here
//  out   Bixi        a tortoise carrying a stele                     page 7's Stone Tortoise is exactly this
//  out   Inukshuk    a stacked stone man, arms out                   page 5 has it
//  out   Horseshoe Crab  dome and spike                              a live level
//  out   Heron on a Stone  S neck, one leg                           Heron exists; the cormorant has the stone
//  out   Dogu        goggle eyes on a clay doll                      the Haniwa's twin, and goggles need a caption
//  out   Nandi       a lying bull with a marigold garland            long and lying, the Sphinx's outline
//  out   Lion Fountain  a mask spouting into a basin                 the gargoyle's spout, flatter
//  out   See-No-Evil Monkey  hands over the eyes                     a same-colour hand in front of the face (rule 5)
//  out   Wren on a Wall  the cocked tail                             a round small bird again (Robin, Doorstep Robin)
//  out   Ladybird on a Pebble, Stone Elephant, Tiki: Ladybug and Temple Elephant exist; Tiki is Moai's cousin
//
// Authored flat; the game's dithered light shades them. Faces and details
// look toward +x / +z.
import { grid } from '../voxel.js';
import { INK, pair, front, tint, lathe } from './kit.js';

// Flat material colours: the game's light (lit() in shapes.js) does the shading.
const gargoyle = 0x5e5a64, ashlar = 0xdccfb6, moss = 0x7cc35a, water = 0x4fa8dc, lichen = 0xf2d27a,
  clay = 0xd2784a, hole = 0x4a2a24, mound = 0x6fb85a,
  shag = 0x34363e, menhir = 0xd2c6b0, throat = 0xf29a3a, beakGrey = 0x8a8a8a,
  sand = 0xd8a862, paint = 0x3f6fb8,
  eye = 0xe8f0d8, snake = 0x5a9a3e, collar = 0xf2d24a, tongue = 0xe0434b,
  troll = 0x9a7a62, yawn = 0xf08aa2;

export default [
  // GARGOYLE
  //   identity: bat wings and horns up behind a big head, sat on a ledge
  //   pose: spouting the rain from its open mouth, as it was carved to
  //   parts: dark stone beast, pale cornice with moss on top; water, lichen eyes
  (() => {
    const g = grid(8, 10, 6);
    g.box([1, 6], [0, 2], [0, 3], ashlar);                                              // the cornice
    tint(g, (x, y) => y === 2, moss);                                                   // moss along its top
    g.box([2, 5], [3, 5], [0, 2], gargoyle).clear(2, 5, 0).clear(5, 5, 0);             // sat on its haunches
    pair(g, 2, 3, 3, gargoyle); pair(g, 2, 4, 3, gargoyle);                             // front legs, on the edge
    g.box([2, 5], [6, 8], [1, 4], gargoyle);                                            // the big head
    g.box([2, 5], [5, 5], [3, 4], gargoyle);                                            // the lower jaw
    for (const [x, y] of [[1, 5], [1, 6], [1, 7], [0, 6], [0, 7], [0, 8], [0, 9]])
      for (const z of [0, 1]) pair(g, x, y, z, gargoyle);                               // bat wings, up behind
    pair(g, 2, 9, 2, gargoyle);                                                         // horns
    g.box([3, 4], [6, 6], [4, 5], water).box([3, 4], [0, 5], [5, 5], water);            // the rain, out of its mouth
    pair(g, 2, 7, 4, lichen);                                                           // eyes, wide apart
    return g.entry({ id: 'cand-p17-gargoyle', name: 'Gargoyle', story: 'It was carved to frighten off evil. These days it mostly frightens off pigeons, and only when it rains.' });
  })(),

  // HANIWA
  //   identity: one arm flung up and one down, on a plain clay tube; three
  //   holes for a face
  //   pose: dancing on its burial mound, mouth open in an O
  //   parts: terracotta figure, green mound; dark holes
  (() => {
    const g = grid(7, 10, 5);
    g.ellipsoid([3, 0, 2], [3.4, 1.3, 2.6], mound);                                     // the mound
    lathe(g, [3, 2], 1, [2.3, 1.5, 1.5, 1.5], clay);                                    // the tube body, flared
    g.set(3, 5, 2, clay);                                                               // the neck
    g.box([2, 4], [6, 8], [1, 3], clay);                                                // the head
    front(g, 2, 7, hole); front(g, 4, 7, hole); front(g, 3, 6, hole);                   // two eyes and an O
    g.set(5, 4, 2, clay).set(6, 4, 2, clay).box([6, 6], [5, 7], [2, 2], clay);          // one arm up
    g.set(1, 4, 2, clay).set(0, 4, 2, clay).set(0, 3, 2, clay);                         // one arm down
    return g.entry({ id: 'cand-p17-haniwa', name: 'Haniwa', story: 'Buried to keep a king company, it found something to sing about.' });
  })(),

  // CORMORANT
  //   identity: wings held out to the full width, the hooked beak in profile
  //   pose: drying them on an old rock, beak to the wind
  //   parts: black bird, pale rock, moss; orange throat, a pale eye
  (() => {
    const g = grid(9, 9, 5);
    g.ellipsoid([4, 0.4, 2], [2.8, 2.2, 2.4], menhir);                                   // the rock
    tint(g, (x, y, z) => y === 0 && (x <= 2 || z >= 4), moss);                            // moss round its foot
    g.box([3, 5], [3, 5], [1, 3], shag);                                                // the body
    g.box([4, 4], [6, 6], [2, 2], shag).box([4, 5], [7, 8], [2, 2], shag);              // neck and head, in profile
    g.set(5, 8, 2, eye).set(5, 7, 2, throat);                                           // eye, orange throat
    g.set(6, 8, 2, beakGrey).set(7, 8, 2, beakGrey).set(7, 7, 2, beakGrey);             // the hooked beak, to the wind
    for (const [x, y] of [[2, 4], [2, 5], [1, 5], [1, 6], [0, 6], [0, 7], [0, 5]])
      for (const z of [1, 2]) pair(g, x, y, z, shag);                                   // the wings, held out
    return g.entry({ id: 'cand-p17-cormorant', name: 'Cormorant', story: 'It hangs its wings out to dry on the old stone. The stone has never asked what it does for a living.' });
  })(),

  // SPHINX
  //   identity: a long lying lion with the striped headcloth hanging
  //   either side of its face
  //   pose: lying in wait, paws out, looking at you without a nose
  //   parts: sandstone lion, blue-striped headcloth
  (() => {
    const g = grid(10, 7, 5);
    g.box([0, 5], [0, 2], [1, 3], sand).clear(0, 2, 1).clear(0, 2, 3);                  // the lion, lying
    g.box([5, 7], [0, 3], [1, 3], sand);                                                 // the chest
    for (const z of [1, 3]) g.box([6, 9], [0, 0], [z, z], sand);                        // paws out in front
    g.box([6, 8], [4, 5], [1, 3], sand);                                                 // the face
    g.box([6, 8], [6, 6], [1, 3], paint).box([6, 6], [4, 5], [1, 3], paint);             // the headcloth
    for (const z of [0, 4]) g.box([6, 7], [2, 6], [z, z], (x, y) => (y % 2 ? paint : sand));   // its flaps, striped
    g.set(8, 3, 2, paint).set(8, 2, 2, paint);                                           // the beard
    g.set(8, 5, 1, INK).set(8, 5, 3, INK);                                               // eyes
    return g.entry({ id: 'cand-p17-sphinx', name: 'Sphinx', lit: { span: 2 }, story: 'It lost its nose long ago and has not gone looking for it.' });
  })(),

  // GRASS SNAKE
  //   identity: a snake wound twice round a standing stone, its head up
  //   over the top
  //   pose: keeping the stone warm, looking at you, tongue out
  //   parts: green snake, pale stone; yellow collar, red tongue
  (() => {
    const g = grid(7, 9, 8);
    g.box([2, 4], [0, 7], [2, 4], menhir).clear(2, 7, 2).clear(4, 7, 2).clear(2, 7, 4).clear(4, 7, 4);   // the standing stone
    const ring = [];                                                                     // the square ring round it, front left first
    for (let x = 1; x <= 5; x++) ring.push([x, 5]);
    for (let z = 4; z >= 1; z--) ring.push([5, z]);
    for (let x = 4; x >= 1; x--) ring.push([x, 1]);
    for (let z = 2; z <= 4; z++) ring.push([1, z]);
    let y = 1;
    for (let i = 0; i < 32; i++) {                                                       // two turns, climbing
      const [x, z] = ring[i % 16];
      if (i && i % 5 === 0) { g.set(x, y, z, snake); y++; }
      g.set(x, y, z, snake);
    }
    g.box([2, 4], [8, 8], [3, 5], snake).set(3, 8, 6, snake);                            // the head, flat, up over the top
    g.box([2, 4], [8, 8], [2, 2], collar);                                               // its yellow collar
    pair(g, 2, 8, 4, INK);                                                               // eyes
    g.set(3, 8, 7, tongue);                                                              // tongue
    return g.entry({ id: 'cand-p17-grass-snake', name: 'Grass Snake', story: 'The stone was put up to mark something. The snake says: the sunny side.' });
  })(),

  // TROLL
  //   identity: a big head with ears out sideways and a big nose, long
  //   arms hanging to the ground
  //   pose: caught mid-yawn by the sunrise, and turned to stone in it
  //   parts: brown ironstone troll, a tuft of moss; pink yawn
  (() => {
    const g = grid(9, 9, 8);
    for (const x of [2, 5]) g.box([x, x + 1], [0, 0], [2, 4], troll);                   // big feet
    g.ellipsoid([4, 2.4, 3], [2.4, 2.1, 2.1], troll);                                   // the pot belly
    g.box([2, 6], [5, 7], [1, 5], troll).clear(2, 7, 1).clear(6, 7, 1).clear(2, 7, 5).clear(6, 7, 5);   // the big head
    g.box([3, 5], [8, 8], [2, 4], moss).clear(3, 8, 2).clear(5, 8, 2);                  // a tuft of moss
    g.box([3, 5], [3, 3], [5, 5], troll);                                               // the jaw, dropped
    g.box([3, 5], [4, 5], [5, 5], yawn);                                                // the yawn
    g.box([4, 4], [6, 7], [6, 6], troll);                                               // the big nose
    pair(g, 3, 7, 5, INK);                                                              // eyes, screwed shut
    pair(g, 1, 6, 3, troll); pair(g, 1, 7, 3, troll); pair(g, 0, 7, 3, troll);          // ears, out sideways
    for (const [x, y] of [[1, 4], [1, 3], [0, 3], [0, 2], [0, 1], [0, 0]])
      for (const z of [2, 3]) pair(g, x, y, z, troll);                                  // long arms, knuckles down
    return g.entry({ id: 'cand-p17-troll', name: 'Stone Troll', fraction: 0.6, story: 'It stopped for a good long yawn, and the sun came up. It has been yawning ever since.' });
  })(),
];
