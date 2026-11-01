// Page 19 · VIII Weather and Seasons: daily stones for a weather or a season,
// each a creature or a moment the weather made (as the Melted Snowman is the
// first warm day). Each comment names the date or season it suits, so the
// daily can put it on the calendar. Palette: Clouds (a pale periwinkle sky,
// so nothing big is pale blue, and white parts lean on the light: snow and
// white feathers sit on red, brown or yellow, and the outline's top is never
// white on its own). Every entry is in the daily band (judge() in
// public/js/daily.js: D 9.5-12, 90-180 chisels on the trimmed block, 4-10
// waves), with fraction and seed written out so the gallery and the daily agree.
//
// Silhouette first. Each idea as name / identity feature that sets the
// outline / the moment / colour parts, then what became of it:
//  kept  Leaf-pile Cat      two black ears and a tail up out of an orange heap   the ambush     black, leaf orange, red, gold
//  kept  Snowed In          a gabled kennel, its roof deep in snow, a face at the door   declined   brick red, snow, white dog
//  kept  Pillar Box         a red pillar box in a snow cap, a robin on top        last post      red, snow, robin
//  kept  Bee in a Crocus    a striped bottom up out of a purple cup                asleep in it   purple, yellow and black, green
//  kept  Lamb in a Coat     a red mac over a woolly back, black face and legs      lambing in the rain   red, wool, black
//  kept  Duck in a Sou'wester  a yellow rain hat with its back brim, an orange bill   out in it   white duck, yellow hat, puddle blue
//  kept  Kasa-obake         a closed umbrella with one big eye, a tongue, one leg   the rains are here   indigo, white eye, red tongue
//  kept  Frog under a Toadstool  a spotted red cap with a frog under its brim       sheltering     red, cream, green
//  cut   The Mitten         built three ways (lying flat, on its edge, thumb up); at 40 px a red
//                           sofa or a bag with a teddy in it, never a mitten full of animals
//  cut   Groundhog Day      built twice; upright and brown it reads as a teddy bear, and his
//                           shadow on the snow reads as a lilac rug
//  cut   Dog Days           built three times; the paddling pool reads as a coral box, the
//                           sunglasses as a stripe; and Bath-time Pup already has a dog in a tub
//  cut   March Hares        built; boxing face to face along x, the iso view stacks one hare
//                           behind the other, and it is two plain animals
//  cut   Puffed-up Sparrow  built twice; front on, the cheek and bib read as a chequerboard; side on,
//                           a brown box with a beak
//  cut   Nestlings          built; the open beaks read as yellow cubes on a basket
//  out   Mousing Fox        page 18 turned it down: no face to the camera, and seven foxes exist
//  out   Snail on a wet leaf, Cat at a rainy window, Snow-capped Birdhouse, Wellies in a puddle,
//        Rainbow and pot, Sunflower, Windsock, Scarecrow: Snail, Windowsill Cat, Bird House,
//        Wellies, Rainbow, Sunflower, Weather Vane and Scarecrow exist, and a rainbow is
//        six ramped colours
//  out   Hedgehog in leaves Hedgehog exists (page 18 turned down Leaf-pile Hedgehog)
//  out   Penguin-free sledge  Sled and Sliding Penguin own the sledge outline
//  out   Struck tree and owl  a bare tree is thin poles: 250+ taps; Owl exists
//  out   Teru teru bozu     white on this sky, and Little Ghost's outline
//  out   Fat Bear Week      page 18's Fishing Bear already holds the salmon
// Learns from: Leaf-pile Cat, the Black Cat (black on orange, gold eyes)
// and the Raccoon in a Bin (the hiding place is the joke); Snowed In, the
// Basket Dog (a face over the rim of its own place) and the Melted Snowman
// (a weather day, said dry); Pillar Box, the Piggy Bank and the Instant
// Camera (an everyday thing, its one colour) and the Red Grouse (a small
// creature that says where); Bee, the Rabbit in a Hat (something in a cup,
// its top end out); Lamb, the Highland Cow (a hill animal in its weather)
// and the Sock Monkey (one red part names it); Duck, the Troll Doll (the
// thing on top sets the outline); Kasa-obake, the Genie and Baba Yaga's Hut
// (a folk object come alive); Frog, the Frog Prince (a frog and one prop).
// Faces and details look toward +z / +x.
import { grid } from '../voxel.js';
import { INK, pairZ, tint } from './kit.js';

// Flat material colours: the game's light does the shading.
const leafO = 0xe8862a, leafR = 0xc8443a, leafG = 0xeab03a, cat = 0x34303d, catEye = 0xd6e04a,
  kennel = 0xc0563c, roof = 0x6b4a3a, snow = 0xf8f9fc, dogW = 0xf4ece0, dogEar = 0x8a5a3c,
  pillar = 0xd8343c, plate = 0xf6efe0, robin = 0x8a5a3c, robinRed = 0xf07a3a,
  leaf = 0x5fae4e, crocus = 0x7a4fc0, stamen = 0xf2a03d, beeY = 0xf6c63a, beeK = 0x2e2b36, wing = 0xb8c4e0,
  wool = 0xf4efe4, face = 0x2e2b36, coatRed = 0xe0434b, nose = 0x9a7a7a,
  duck = 0xfbf8f2, bill = 0xf28a2e, hat = 0xf6c63a, puddle = 0x5f9fd8,
  paper = 0x40488a, paperDk = 0x2f3570, tongue = 0xe8506a, eyeW = 0xfbf8f2, wood = 0x9a6440, geta = 0x6b4a3a,
  stem = 0xf2e6d0, capRed = 0xd8343c, gill = 0xe8d8c0, spot = 0xfbf8f2, frog = 0x6cc04a, frogDk = 0x3f8a3b;

export default [
  // [early November, the leaves down] Leaf-pile Cat. Identity: two black ear
  // points and a hooked tail up out of an orange heap. Moment: the ambush,
  // gold eyes just over the leaves. Parts: leaves in orange, red and gold
  // (a pattern, so the softer light), a black cat; gold-green eyes.
  (() => {
    const g = grid(7, 6, 7);
    const pick = (x, y, z) => { const h = ((x >> 1) * 7 + y * 3 + (z >> 1) * 5) % 4; return h < 2 ? leafO : h < 3 ? leafR : leafG; };
    g.ellipsoid([3, -0.5, 3], [3.9, 3.6, 3.5], pick);                                     // the heap
    g.box([1, 5], [2, 3], [3, 5], cat);                                                   // the head, just out
    g.set(1, 4, 4, cat).set(1, 4, 3, cat).set(5, 4, 4, cat).set(5, 4, 3, cat);            // ears
    g.set(2, 3, 5, catEye).set(4, 3, 5, catEye);                                          // eyes, over the leaves
    g.set(4, 3, 1, cat).set(4, 4, 1, cat).set(5, 4, 1, cat).set(5, 5, 1, cat);            // the tail gives it away
    return g.entry({ id: 'cand-p19-leaf-pile-cat', name: 'Leaf-pile Cat', fraction: 0.7, seed: 2, lit: { span: 2 }, story: 'Perfectly hidden. Apart from the ears. And the eyes. And the tail.' });
  })(),

  // [the first heavy snow, December to January] Snowed In. Identity: a
  // gabled kennel under a thick roof of snow, a white face filling the door.
  // Moment: he has looked at the snow and decided against it. Parts: brick
  // red kennel, snow on every step of the roof, a white dog with brown ears.
  // The roof is hollow and he is lying inside, found by carving.
  (() => {
    const g = grid(7, 8, 6);
    g.box([0, 6], [0, 3], [0, 4], kennel).box([1, 5], [0, 3], [1, 3], 0);                 // the kennel, hollow
    g.box([1, 5], [0, 1], [1, 3], dogW);                                                  // the rest of him, inside
    for (let k = 0; k < 4; k++) g.box([k, 6 - k], [4 + k, 4 + k], [0, 5], roof);          // the roof, overhanging
    tint(g, (x, y, z) => y >= 4 && !g.get(x, y + 1, z), snow);                            // and the snow on it
    g.box([1, 5], [4, 4], [1, 4], 0).box([2, 4], [5, 5], [2, 3], 0);                      // the loft, empty
    g.box([2, 4], [0, 2], [4, 4], dogW).box([2, 4], [0, 3], [5, 5], dogW);                // his face in the door
    g.set(2, 2, 5, INK).set(4, 2, 5, INK).set(3, 1, 5, INK);                              // eyes, nose
    g.box([1, 1], [1, 3], [5, 5], dogEar).box([5, 5], [1, 3], [5, 5], dogEar);            // ears
    return g.entry({ id: 'cand-p19-snowed-in', name: 'Snowed In', fraction: 0.65, seed: 1, story: 'He has seen the snow. He has decided against it.' });
  })(),

  // [about 18 December, the last posting day before Christmas, or any first
  // snow] Pillar Box. Identity: the red pillar under a cap of snow, its slot
  // a dark band, a robin on top. Moment: last post. Parts: red box, snow,
  // a brown robin with an orange breast; a white plate under the slot.
  (() => {
    const g = grid(5, 10, 5);
    g.box([0, 4], [0, 0], [0, 4], pillar);                                                // the plinth
    for (const [x, z] of [[0, 0], [4, 0], [0, 4], [4, 4]]) g.clear(x, 0, z);
    g.cylinder('y', [2, 2], 2.2, [1, 4], pillar);                                         // the pillar
    g.box([0, 4], [5, 5], [0, 4], pillar);                                                // the cap's rim
    for (const [x, z] of [[0, 0], [4, 0], [0, 4], [4, 4]]) g.clear(x, 5, z);
    g.box([1, 3], [6, 6], [1, 3], pillar);                                                // the dome
    tint(g, (x, y, z) => y >= 5 && !g.get(x, y + 1, z), snow);                            // under snow
    g.box([1, 3], [7, 7], [2, 2], snow).box([2, 2], [7, 7], [1, 3], snow);                // heaped up
    g.box([1, 3], [4, 4], [4, 4], INK).set(2, 2, 4, plate);                               // the slot, the plate
    g.set(2, 8, 1, robin).set(2, 8, 2, robin).set(2, 8, 3, robinRed).set(2, 9, 3, robin); // the robin
    return g.entry({ id: 'cand-p19-pillar-box', name: 'Pillar Box', fraction: 0.7, seed: 3, story: 'Last post before Christmas. The robin is reading every card.' });
  })(),

  // [the first warm day of spring, early March] Bee in a Crocus. Identity: a
  // yellow-and-black striped bottom up out of a purple cup. Moment: she
  // went in for pollen and fell asleep there (bumblebees do). Parts: purple
  // crocus, the bee's stripes, a green stem and leaves; two grey wings.
  (() => {
    const g = grid(5, 10, 5);
    g.box([2, 2], [0, 3], [2, 2], leaf).box([1, 1], [0, 2], [2, 2], leaf)
      .box([3, 3], [0, 2], [2, 2], leaf).box([2, 2], [0, 1], [1, 3], leaf);              // stem and leaves
    g.box([1, 3], [3, 3], [1, 3], crocus);                                                // the cup
    g.box([0, 4], [4, 6], [1, 3], crocus).box([1, 3], [4, 6], [0, 4], crocus);
    g.box([1, 3], [5, 6], [1, 3], 0);
    for (const [x, z] of [[0, 1], [0, 3], [4, 1], [4, 3], [1, 0], [3, 0], [1, 4], [3, 4]]) g.clear(x, 6, z);   // petal tips
    g.box([1, 3], [4, 4], [1, 3], stamen);                                                // the pollen
    g.box([1, 3], [5, 5], [1, 3], beeY).box([1, 3], [6, 6], [1, 3], beeK);                // the bee, head first
    g.box([1, 3], [7, 7], [1, 3], beeY);                                                  // her bottom, out
    g.box([1, 3], [8, 8], [2, 2], beeK).box([2, 2], [8, 8], [1, 3], beeK).set(2, 9, 2, beeY);
    g.set(0, 8, 2, wing).set(4, 8, 2, wing);                                              // wings, folded up
    return g.entry({ id: 'cand-p19-crocus-bee', name: 'Bee in a Crocus', fraction: 0.7, seed: 6, story: 'The first warm day. She went in for pollen and stayed for a nap.' });
  })(),

  // [April, lambing on the hills] Lamb in a Coat. Identity: a red mac over
  // a woolly back, a black face and legs; hill farmers coat newborn lambs
  // against spring rain. Moment: his first day out. Parts: red coat, cream
  // wool, black face and legs; a grey nose.
  (() => {
    const g = grid(8, 7, 4);
    for (const x of [1, 4]) for (const z of [0, 3]) g.box([x, x], [0, 1], [z, z], face); // legs
    g.box([0, 5], [2, 4], [0, 3], wool);                                                  // the fleece
    for (const z of [0, 3]) g.clear(0, 4, z).clear(5, 4, z).clear(0, 2, z);
    g.box([1, 4], [4, 4], [0, 3], coatRed).box([1, 4], [3, 3], [0, 0], coatRed)
      .box([1, 4], [3, 3], [3, 3], coatRed);                                              // the coat
    g.box([6, 7], [3, 5], [1, 2], face).clear(7, 5, 1).clear(7, 5, 2);                    // the head
    g.set(6, 5, 0, face).set(6, 5, 3, face);                                              // ears, out sideways
    g.set(6, 6, 1, wool).set(6, 6, 2, wool).set(5, 5, 1, wool).set(5, 5, 2, wool);        // a woolly topknot
    g.set(0, 3, 1, wool).set(0, 3, 2, wool);                                              // the tail
    g.set(7, 3, 1, nose).set(7, 3, 2, nose);                                              // nose
    return g.entry({ id: 'cand-p19-lamb-coat', name: 'Lamb in a Coat', fraction: 0.65, seed: 1, story: 'Born on a wet hill in April. The coat was not optional.' });
  })(),

  // [April showers, or any day of steady rain] Duck in a Sou'wester.
  // Identity: a yellow rain hat with its long back brim on a white duck.
  // Moment: out in it, on purpose. Parts: white duck, yellow hat, a blue
  // puddle; an orange bill and dark eyes.
  (() => {
    const g = grid(7, 8, 5);
    g.ellipsoid([3, 0, 2], [3.6, 0.6, 2.6], puddle);                                      // the puddle
    g.box([0, 4], [1, 3], [1, 3], duck).clear(0, 1, 1).clear(0, 1, 3).clear(4, 1, 1)
      .clear(4, 1, 3).clear(0, 3, 1).clear(0, 3, 3);                                      // the body
    g.set(0, 4, 2, duck);                                                                 // tail up
    g.box([3, 5], [4, 5], [1, 3], duck);                                                  // the head
    g.box([6, 6], [4, 4], [1, 3], bill);                                                  // the bill
    pairZ(g, 5, 5, 1, INK);                                                               // eyes
    g.box([2, 6], [6, 6], [0, 4], hat).box([3, 5], [7, 7], [1, 3], hat)
      .box([1, 1], [5, 6], [1, 3], hat);                                                  // the sou'wester, back brim down
    for (const [x, z] of [[2, 0], [6, 0], [2, 4], [6, 4]]) g.clear(x, 6, z);
    return g.entry({ id: 'cand-p19-souwester-duck', name: "Duck in a Sou'wester", fraction: 0.65, seed: 4, story: 'Lovely weather for ducks, everyone says. She dressed for it anyway.' });
  })(),

  // [early June, when Japan's rainy season (tsuyu) sets in] Kasa-obake, the
  // umbrella yokai: a thing kept a hundred years comes alive. Identity: a
  // closed paper umbrella with one big eye and a long tongue, hopping on its
  // handle in a geta. Moment: the rains are here, and so is it. Parts:
  // indigo paper, a white eye, a red tongue, wood.
  (() => {
    const g = grid(5, 10, 5);
    g.set(2, 9, 2, wood).set(2, 8, 2, paper);                                             // the tip
    g.box([1, 3], [7, 7], [1, 3], paper);                                                 // the folded paper
    g.box([0, 4], [4, 6], [1, 3], paper).box([1, 3], [4, 6], [0, 0], paper);
    g.box([0, 4], [3, 3], [0, 4], paperDk);                                               // the hem
    for (const [x, z] of [[0, 0], [4, 0], [0, 4], [4, 4]]) g.clear(x, 3, z);
    g.box([1, 3], [4, 6], [3, 3], eyeW).set(2, 5, 3, INK);                                // the eye
    g.set(2, 3, 3, tongue).set(2, 3, 4, tongue).set(2, 2, 4, tongue).set(2, 1, 4, tongue);  // the tongue
    g.set(2, 2, 2, wood).set(2, 1, 2, wood);                                              // its one leg
    g.box([1, 3], [0, 0], [2, 2], geta).box([2, 2], [0, 0], [1, 3], geta);                // in a geta
    return g.entry({ id: 'cand-p19-kasa-obake', name: 'Kasa-obake', fraction: 0.65, seed: 1, story: 'An umbrella left a hundred years in a cupboard. It has opinions now.' });
  })(),

  // [the first autumn rains, mushroom season, September to October] Frog
  // under a Toadstool. Identity: a red cap with white spots over a cream
  // stem, a green frog under the brim. Moment: sheltering from the rain,
  // which a frog has no need to do. Parts: red cap, cream stem and gills,
  // green frog; white spots and dark eyes.
  (() => {
    const g = grid(7, 6, 6);
    g.cylinder('y', [2, 2], 3.4, [3, 4], capRed).cylinder('y', [2, 2], 2.3, [5, 5], capRed);   // the cap
    tint(g, (x, y) => y <= 3, gill);                                                      // gills under it
    g.box([1, 2], [0, 3], [1, 2], stem);                                                  // the stem
    for (const [x, y, z] of [[1, 5, 4], [3, 5, 1], [5, 4, 2], [2, 4, 5]]) g.set(x, y, z, spot);   // spots
    g.box([3, 5], [0, 1], [3, 5], frog);                                                  // the frog
    g.set(3, 2, 4, frog).set(5, 2, 4, frog).set(3, 2, 5, INK).set(5, 2, 5, INK);          // eye bumps
    g.set(6, 0, 5, frogDk).set(6, 0, 3, frogDk).set(2, 0, 5, frogDk).set(2, 0, 3, frogDk);   // feet
    return g.entry({ id: 'cand-p19-toadstool-frog', name: 'Frog under a Toadstool', fraction: 0.7, seed: 1, story: 'A frog, sheltering from the rain. He would rather not discuss it.' });
  })(),
];
