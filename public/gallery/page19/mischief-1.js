// Page 19 · IX Up to Something, for the Daily Stones: creatures caught
// mid-mischief, where the behaviour is the joke and the identity (after page
// 18's Chicken Crossing). Palette: Autumn (a mauve-to-amber sky, so bodies
// lean to white, grey, blue, teal, green and pink; orange only where it is
// the thing, the lantern and the ginger cat, set against green or dark).
// Every entry is in the daily band (judge() in public/js/daily.js: D 9.5-12,
// 90-180 chisels on the trimmed block, 4-10 waves), with fraction and seed
// written out so the gallery and the daily agree.
//
// Silhouette first. Each idea as name / identity feature that sets the
// outline / the moment / colour parts:
//  kept  Goat on the Car     a goat on the roof, horns at the top          on the roof, facing you      white goat, blue car, pale windows
//  kept  Gull & Chips        a red carton of chips beside a gull in profile  a chip in its beak         white and grey gull, red carton, gold chips
//  kept  Squirrel & Pumpkin  a tail curling up over a jack-o'-lantern      the morning after            grey squirrel, orange lantern, dark carving
//  kept  Magpie & Ring       the long black tail, the ring at the beak     home to the nest with it     black and white bird, straw nest, gold
//  kept  Dog on the Sofa     a white head and floppy ears over a sofa back  on the forbidden cushion   white dog, teal sofa, brown ears
//  kept  Mouse & Mousetrap   big pink ears over a board, the wire bar set  eating the bait              grey mouse, tan board, yellow cheese
//  kept  Tree Topper         a ginger cat's ears where the star should be  the star on the floor        green tree, ginger cat, red baubles
//  kept  Pig in a Puddle     a pink face and snout over a brown puddle     sat in it, mud to the middle pink pig, brown mud
//  cut   Captain's Parrot    built three ways (front-on, profile, big head): the tricorn
//                            turns a macaw into a red-faced pirate; no beak reads at 40 px
//  cut   Sausage Thief       a sitting dog with a string of sausages to the floor: the
//                            1-thick string read as a chair frame, and 214 chisels
//  cut   Magpie & Ring Box   built and read well, but X Things With a Secret has Ring Box
//                            (the same red box, satin, gold and stone); the nest replaces it
//  out   Blue Tit & Milk     Doorstep Robin (page 15) already sits on a milk bottle's cap
//  out   Mouse in a Cheese   Mouse in the Cheese exists (page 4)
//  out   Cat in a Sink       Cat in a Mug, Kitten in a Bowl and Kitten in a Box own it
//  out   Squirrel & Feeder   Bird Feeder exists; the lantern gives the squirrel a date
//  out   Fox & Boot          seven foxes, and orange on Autumn's amber
//  out   Crow & Key          Key is a level; the magpie is the shiny-thing thief here
//  out   Monkey & Sunglasses four monkeys exist, and sunglasses read as cool, not caught
//  out   Dog & Shoe          a shoe held crosswise is Paper Pup's outline (page 18's note)
//  out   Cockatoo & Bin      Raccoon in a Bin owns the creature in the bin
//  out   Hamster in a Roll   Paper Pup owns the roll, and Hamster the cheeks
// Learns from: Goat, the Chicken Crossing (a small base that says where) and
// the Highland Cow (a frontal animal head); Gull, the Fishing Bear (the
// stolen thing held at the mouth); Squirrel, the Origami Fox (the raised tail
// on the outline); Magpie, the Red Grouse (a bird known by its colours); Dog,
// the Basket Dog (the furniture is the joke) and the Broody Hen (asked to
// move; declined); Mouse, the Cat & Cup (caught at it, unbothered); Tree
// Topper, the Black Cat (a dated cat) and the Melted Snowman (a season's
// object, mid-joke); Pig, the Yawning Hippo (an act in the water).
// Faces and details look toward +z / +x.
import { grid } from '../voxel.js';
import { INK, tint, sheet } from './kit.js';

// Flat material colours: the game's light does the shading.
const goatWhite = 0xf6f1e7, horn = 0x6b5a4a, goatNose = 0xe0a0a0, car = 0x4f86cf, glass = 0xcfe6f2, tyre = 0x3a3442, lamp = 0xf6d365,
  gull = 0xfbf8f2, gullGrey = 0x9aa3ad, gullBeak = 0xf6d84a, gullLeg = 0xf0a8a0, box = 0xe0434b, chip = 0xf2c14e,
  pumpkin = 0xf2803d, carved = 0x4a2e2a, squirrel = 0x8f939c, squirrelWhite = 0xf3efe8,
  magpie = 0x2f2d36, magpieWhite = 0xfbf8f2, magpieBlue = 0x4f7fc8, twig = 0xd2a878, silver = 0xc9d1d9, gold = 0xf2c14e, diamond = 0xe8f6ff, beak = 0x5d6670,
  sofa = 0x3f8a7a, cushion = 0x6fb8a4, dog = 0xf6f1e7, dogEar = 0x8a5a3c,
  mouse = 0x9a9aa2, mouseEar = 0xf4a3b5, board = 0xd9b48f, wire = 0x5d6670, cheese = 0xf6d14a,
  tree = 0x3f8a5b, cat = 0xf29a3a, catWhite = 0xfbf3e6, star = 0xf6d365, bauble = 0xe0434b, tub = 0xb8434b,
  pig = 0xf4a3b5, snout = 0xe07a8c, mud = 0x7a5640;

export default [
  // Goat on the Car. Identity: a goat stood on a car roof, horns at the top
  // of the outline, the car's nose and headlamps toward you. Moment: it has
  // climbed up and is not getting down. Parts: white goat, blue car, pale
  // windows; dark horns and tyres, yellow lamps.
  (() => {
    const g = grid(7, 9, 5);
    for (const x of [0, 1, 5, 6]) for (const z of [0, 4]) g.set(x, 0, z, tyre);           // wheels
    g.box([0, 6], [1, 2], [0, 4], car);                                                 // the body
    for (const x of [0, 6]) for (const z of [0, 4]) g.clear(x, 2, z);
    g.set(1, 1, 4, lamp).set(5, 1, 4, lamp);                                            // headlamps
    g.box([1, 5], [3, 3], [0, 3], glass);                                               // the cabin
    for (const x of [2, 4]) for (const z of [0, 2]) g.set(x, 4, z, goatWhite);          // legs
    g.box([2, 4], [5, 6], [0, 2], goatWhite);                                           // the body
    g.box([2, 4], [5, 7], [3, 4], goatWhite).set(3, 4, 4, goatWhite);                   // the head, the beard
    g.clear(2, 5, 4).clear(4, 5, 4);
    g.set(1, 6, 3, goatWhite).set(5, 6, 3, goatWhite);                                  // ears
    g.set(2, 6, 4, INK).set(4, 6, 4, INK).set(3, 5, 4, goatNose);                       // eyes, nose
    g.set(2, 8, 3, horn).set(4, 8, 3, horn).set(2, 8, 2, horn).set(4, 8, 2, horn);      // horns, swept back
    return g.entry({ id: 'cand-p19-goat-car', name: 'Goat on the Car', fraction: 0.6, seed: 7, story: 'It saw a hill. The hill had wipers.' });
  })(),

  // Gull & Chips. Identity: a herring gull in profile, white head, grey back,
  // yellow beak, beside a red carton of chips. Moment: one chip already in
  // its beak. Parts: white gull, grey wings with black tips, red carton,
  // gold chips; pink legs.
  (() => {
    const g = grid(10, 7, 4);
    g.box([0, 2], [0, 3], [0, 2], box).box([1, 1], [1, 2], [2, 2], gull);               // the carton
    for (const [x, z, h] of [[0, 0, 5], [1, 1, 4], [2, 0, 4], [0, 2, 4], [2, 2, 5]]) g.box([x, x], [4, h], [z, z], chip);   // chips
    sheet(g, [
      '......WW..',
      '......WWY.',
      '..KGGGWW..',
      '..WGGGWWW.',
      '....WWWW..',
      '.....P.P..',
      '.....P.P..',
    ], [1, 3], { W: gull, G: gullGrey, Y: gullBeak, P: gullLeg, K: INK });
    for (const z of [1, 3]) for (const x of [5, 7]) g.clear(x, 0, z).clear(x, 1, z);
    for (const z of [1, 3]) g.clear(8, 5, z).clear(8, 3, z);
    g.set(7, 6, 1, INK).set(7, 6, 3, INK);                                              // eyes
    g.box([9, 9], [4, 5], [2, 2], chip);                                                // the chip, dangling
    return g.entry({ id: 'cand-p19-gull-chips', name: 'Gull & Chips', fraction: 0.65, seed: 1, story: 'It asked. Nobody answered, so it took that as a yes.' });
  })(),

  // Squirrel & Pumpkin (dated: 1 November, the morning after Halloween).
  // Identity: a grey squirrel in profile, its tail curling up over its back,
  // on a jack-o'-lantern carved toward you. Moment: eating the lantern, a
  // piece of it in its paws. Parts: orange lantern, grey squirrel, dark
  // carving; a white front.
  (() => {
    const g = grid(7, 10, 5);
    g.box([0, 6], [0, 3], [0, 4], pumpkin);
    for (const x of [0, 6]) for (const y of [0, 3]) for (const z of [0, 4]) g.clear(x, y, z);
    g.box([1, 2], [2, 2], [4, 4], carved).box([4, 5], [2, 2], [4, 4], carved).box([2, 4], [1, 1], [4, 4], carved);   // the carved face
    sheet(g, [
      '.TT.E..',
      'TT..HH.',
      'TT..HHN',
      'TT.BBB.',
      '.TBBBBP',
      '..BBB..',
    ], [1, 3], { T: squirrel, E: squirrel, H: squirrel, B: squirrel, N: INK, P: pumpkin }, 0, 4);
    g.clear(4, 9, 2).clear(6, 5, 1).clear(6, 5, 3).clear(6, 7, 1).clear(6, 7, 3);
    g.box([5, 5], [4, 5], [2, 2], squirrelWhite);                                       // white front
    g.set(5, 8, 1, INK).set(5, 8, 3, INK);                                              // eyes
    return g.entry({ id: 'cand-p19-squirrel-pumpkin', name: 'Squirrel & Pumpkin', fraction: 0.65, seed: 5, story: 'Halloween ended last night. Nobody has told the squirrel.' });
  })(),

  // Magpie & Ring (the thieving magpie). Identity: the long black tail out
  // behind, white belly and shoulders, a gold ring with its stone at the
  // beak. Moment: home to the nest with it; a spoon and a coin already there.
  // Parts: black and white bird, straw nest; blue wing, gold, silver.
  (() => {
    const g = grid(9, 7, 4);
    g.box([3, 8], [0, 1], [0, 3], twig);                                                // the nest
    for (const x of [3, 8]) for (const z of [0, 3]) g.clear(x, 0, z).clear(x, 1, z);
    g.clear(3, 0, 1).clear(3, 0, 2).clear(8, 0, 1).clear(8, 0, 2);
    g.box([7, 7], [2, 3], [2, 2], silver).set(6, 2, 2, silver);                         // a spoon in it
    sheet(g, [
      '....KKK..',
      'K..KKKKY.',
      'KKKKWWK..',
      '..KKWWW..',
      '.....P...',
    ], [1, 2], { K: magpie, W: magpieWhite, Y: beak, P: beak }, 0, 2);
    g.set(4, 4, 0, magpieBlue).set(5, 4, 0, magpieBlue).set(4, 4, 3, magpieBlue).set(5, 4, 3, magpieBlue);
    g.set(5, 6, 1, INK).set(5, 6, 2, INK);
    g.set(3, 4, 1, magpieWhite).set(3, 4, 2, magpieWhite);                               // white shoulders
    g.set(4, 1, 1, gold).set(4, 1, 2, gold);                                            // a coin
    g.set(8, 4, 1, gold).set(8, 4, 2, gold).set(8, 5, 1, diamond);                       // the ring
    return g.entry({ id: 'cand-p19-magpie-ring', name: 'Magpie & Ring', fraction: 0.65, seed: 3, story: 'A ring, a spoon, a coin. It calls this a collection.' });
  })(),

  // Dog on the Sofa. Identity: a sofa (back, arms, seat) with a white dog's
  // head and floppy brown ears over the back. Moment: sat on the cushion it
  // is not allowed on, looking at you. Parts: teal sofa, paler cushion,
  // white dog, brown ears; the tail just going.
  (() => {
    const g = grid(9, 8, 5);
    g.box([0, 8], [0, 1], [0, 4], sofa);                                                // the seat
    for (const x of [1, 2, 3, 5, 6, 7]) for (const z of [0, 1, 2, 3, 4]) g.clear(x, 0, z);
    g.clear(4, 0, 1).clear(4, 0, 2).clear(4, 0, 3);
    g.box([0, 8], [2, 4], [0, 1], sofa);                                                // the back
    g.box([0, 0], [2, 3], [2, 4], sofa).box([8, 8], [2, 3], [2, 4], sofa);              // arms
    g.box([1, 7], [2, 2], [2, 4], cushion);                                             // the cushion
    g.box([3, 5], [3, 4], [2, 3], dog);                                                 // the dog, sat up
    g.set(3, 3, 4, dog).set(5, 3, 4, dog);                                              // front paws
    g.box([2, 6], [5, 7], [1, 3], dog);                                                 // the big head
    for (const x of [2, 6]) g.clear(x, 7, 1).clear(x, 7, 3);
    g.box([1, 1], [5, 6], [2, 3], dogEar).box([7, 7], [5, 6], [2, 3], dogEar);          // floppy ears
    g.box([3, 5], [5, 5], [4, 4], dog).set(4, 5, 4, INK);                               // muzzle, nose
    g.set(3, 6, 3, INK).set(5, 6, 3, INK);                                              // eyes
    g.set(7, 2, 3, dog).set(7, 3, 3, dog);                                              // its tail, going
    return g.entry({ id: 'cand-p19-dog-sofa', name: 'Dog on the Sofa', fraction: 0.65, seed: 7, story: 'It knows the rule. It is on the cushion, which is different.' });
  })(),

  // Mouse & Mousetrap. Identity: big pink ears on a grey mouse sat on a
  // wooden trap, the wire bar still set behind it. Moment: eating the bait;
  // the trap has not gone off. Parts: tan board, grey mouse and wire, pink
  // ears, yellow cheese.
  (() => {
    const g = grid(9, 6, 4);
    g.box([0, 8], [0, 0], [0, 3], board);                                               // the trap
    g.box([0, 0], [1, 4], [0, 0], wire).box([0, 0], [1, 4], [3, 3], wire).box([0, 0], [4, 4], [1, 2], wire);   // the bar, set
    g.box([4, 7], [1, 2], [0, 2], mouse);                                               // the mouse
    g.box([4, 7], [3, 4], [1, 3], mouse);
    g.box([3, 3], [4, 5], [1, 2], mouseEar).box([8, 8], [4, 5], [1, 2], mouseEar);      // ears
    g.set(5, 4, 3, INK).set(6, 4, 3, INK);
    g.box([5, 6], [1, 2], [3, 3], cheese);
    return g.entry({ id: 'cand-p19-mouse-trap', name: 'Mouse & Mousetrap', fraction: 0.65, seed: 3, story: 'The trap has been set for a week. The mouse eats there daily.' });
  })(),

  // Tree Topper (dated: 24 December). Identity: a stepped green tree with a
  // ginger cat's head and ears where the star should be. Moment: the cat has
  // climbed up; the star is on the floor. Parts: green tree, ginger cat,
  // red tub; red baubles and a gold star as accents.
  (() => {
    const g = grid(7, 10, 5);
    g.box([2, 4], [0, 0], [1, 3], tub);
    const tiers = [[1, 3, 0], [2, 2, 0], [3, 3, 0], [4, 2, 0], [5, 2, 1], [6, 1, 1]];
    for (const [y, r, d] of tiers) g.box([3 - r, 3 + r], [y, y], [d, 4 - d], tree);
    for (const x of [0, 6]) for (const z of [0, 4]) g.clear(x, 1, z).clear(x, 3, z);
    g.box([2, 4], [7, 8], [1, 3], cat).box([2, 4], [7, 7], [4, 4], cat);                // the cat, on top
    g.set(2, 9, 2, cat).set(4, 9, 2, cat);                                              // ears
    g.set(2, 8, 3, INK).set(4, 8, 3, INK).set(3, 7, 4, catWhite);
    g.set(5, 7, 2, cat).set(6, 7, 2, cat).set(6, 6, 2, cat);                            // its tail
    g.set(1, 1, 4, bauble).set(5, 3, 4, bauble).set(2, 4, 4, bauble).set(4, 5, 3, bauble);
    g.set(5, 0, 4, star).set(6, 0, 4, star).set(6, 0, 3, star);                         // the star, on the floor
    return g.entry({ id: 'cand-p19-tree-topper', name: 'Tree Topper', fraction: 0.65, seed: 3, story: 'The star has been moved. The cat has taken over its duties.' });
  })(),

  // Pig in a Puddle. Identity: a pink pig's face, snout and ears toward you,
  // sat in a brown puddle. Moment: freshly washed, and back in it, mud to the
  // middle and on one ear. Parts: pink pig, brown mud; a darker snout.
  (() => {
    const g = grid(8, 7, 6);
    g.box([0, 7], [0, 0], [0, 5], mud);                                                 // the puddle
    for (const x of [0, 7]) for (const z of [0, 5]) g.clear(x, 0, z);
    g.box([1, 6], [1, 2], [0, 3], pig);                                                 // the body, sat in it
    g.box([1, 6], [3, 5], [1, 4], pig);                                                 // the head
    for (const x of [1, 6]) g.clear(x, 5, 4).clear(x, 5, 1).clear(x, 3, 4);
    g.set(1, 6, 2, pig).set(1, 6, 3, pig).set(6, 6, 2, pig).set(6, 6, 3, pig);          // ears
    g.box([3, 4], [3, 4], [5, 5], snout).set(3, 3, 5, INK).set(4, 3, 5, INK);           // the snout
    g.set(2, 5, 4, INK).set(5, 5, 4, INK);                                              // eyes
    tint(g, (x, y) => y === 1, mud);                                                    // muddy to the middle
    g.set(6, 6, 3, mud).set(6, 5, 3, mud);                                              // and one ear
    return g.entry({ id: 'cand-p19-pig-puddle', name: 'Pig in a Puddle', fraction: 0.65, seed: 9, story: 'It had a bath this morning. It has undone all of it.' });
  })(),
];
