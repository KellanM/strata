// Page 19 · II Nursery Rhymes: daily stones, the rhymes everyone half
// remembers. A stranger plays one from a shared link, so each is one picture
// that names its rhyme, caught at the rhyme's own moment. Palette: Orchard
// (a sage sky over a gold horizon, so no sage greens or golds on a body:
// the moon is lemon, the boat pea green, the tree a bright leaf green). Every
// entry is in the daily band (judge() in public/js/daily.js: D 9.5-12,
// 90-180 chisels on the trimmed block, 4-10 waves), with fraction and seed
// written out so the gallery and the daily agree. None is a dated stone.
//
// Silhouette first. Each idea as name / identity feature that sets the
// outline / the moment / colour parts:
//  kept  Cow over the Moon   a leaping cow, a thin crescent below with sky between   mid-leap, hind hooves on the horn   white, black patches, lemon moon, pink muzzle
//  kept  Old Woman's Shoe    a lace-up boot with a pitched roof on the shaft          home, door on the toe            leather, red roof, lit windows, blue door
//  kept  Baa Baa Black Sheep a black sheep face-on, three tied sacks piled beside     "yes sir, three bags full"       charcoal wool, cream sacks, red cords, pink ears
//  kept  Owl and Pussycat    two heads in a pea-green boat, ear tufts and cat ears   at sea                           pea green, owl brown, ginger, cream faces
//  kept  Rock-a-bye Baby     a hooded cradle on rockers, on top of a tree           on the treetop, before the wind  leaf green, wood, baby blue hood
//  kept  Three Men in a Tub  a hooped tub, three heads in three hats                 all put out to sea               wood, iron hoop, straw boater, toque, a candle
//  kept  Dish and Spoon      a blue-rimmed plate with a face and legs, a spoon       running away, arm in arm         white china, willow blue, silver, red shoes
//  kept  Muffet's Tuffet     a black spider sat on a pink buttoned stool             she has gone, it stays           pink velvet, black, white eyes, wooden feet
//  cut   Three Blind Mice    built: three grey mice nose to tail read as a comb at 40 px,
//                            and the dark glasses as a stripe; 63 cubes, too thin for the band
//  cut   Crooked House       built twice: a stepped lean reads as a stepped cottage from the
//                            game corner (the lean runs toward the camera), not crooked
//  cut   Blackbird Pie       built: birds through a crust read as dark posts with orange tips
//                            (candles on a cake), 229 chisels; and it is food
//  out   Hickory Dickory     Grandfather Clock and Cuckoo Clock exist; a mouse on top
//                            barely changes the outline
//  out   Little Bo Peep      Crook & Lantern (page 15) owns the shepherd's crook
//  out   Mary's Little Lamb  a lamb with a satchel needs a caption; Counting Sheep and Hill Sheep exist
//  out   Jack and Jill       a pail on a hill needs a caption; the two figures are 3 cubes each
//  out   Cat and the Fiddle  the same rhyme as the cow and the dish, and the gallery has many cats
//  out   Humpty Dumpty (page 18), Ding Dong Bell (Wishing Well, Waiting Well), Twinkle
//        Twinkle (Star), I'm a Little Teapot (Teapot), Polly Put the Kettle On (Kettle)
// Learns from: Cow, Counting Sheep (an animal in the air over a thing, the gap
// under it) and Chicken Crossing (an animal caught mid-joke); Shoe, Baba
// Yaga's Hut (a folk dwelling with a twist) and Noah's Ark (the container is
// the joke); Sheep, Sock Monkey (sat facing you, one accent that names it);
// Owl and Tub, Noah's Ark (passengers above a hull) and Rabbit in a Hat (heads
// out of a container); Rock-a-bye, Sword in the Stone (a thing where it
// shouldn't be, told dry); Dish, Chattering Teeth and Jumping Jack (an
// everyday thing with a face, mid-step, front on); Muffet, the Basket Dog
// (the thing on top sets the outline). Faces look toward +z / +x.
import { grid } from '../voxel.js';
import { INK, tint, sheet } from './kit.js';

// Flat material colours: the game's light does the shading.
const cowWhite = 0xf8f4ec, patch = 0x45404c, muzzle = 0xf29aa8, cowHorn = 0xc9a87a, moon = 0xf6d84a,
  leather = 0x9a5f3a, sole = 0x4a3838, roof = 0xd8433c, pane = 0xffe98a, door = 0x4f86cf, brick = 0x8f877c,
  wool = 0x45404e, sheepFace = 0x2b2730, sack = 0xefe3c4, cord = 0xd8433c, eyeWhite = 0xf6efe0, earPink = 0xf29aa8,
  pea = 0x93c84a, owl = 0x9a6a44, owlFace = 0xf6e6c8, ginger = 0xf29a3a, catWhite = 0xfbf3e6, beak = 0xf2a03d, catNose = 0xf29aa8,
  bark = 0x7a5238, leaf = 0x5fae4a, cradle = 0xb87444, hood = 0x8fc4ee, baby = 0xf2c49c,
  stave = 0xa8693f, hoop = 0x4a4452, skin = 0xf2c09a, tash = 0x4a4452, straw = 0xf2d06a, toque = 0xfbf8f2, wax = 0xf6efe0, flame = 0xf2803d,
  china = 0xfbf8f2, willow = 0x4f86cf, silver = 0xb8bcc8, shoe = 0xd8433c, mouth = 0xe0563c,
  velvet = 0xd8607a, button = 0xf6d14a, spider = 0x3a3442, wood = 0x8a5a3c;

export default [
  // The Cow Jumped Over the Moon (Hey Diddle Diddle). Identity: a cow in the
  // air above a thin crescent, sky between them. Moment: mid-leap, front legs
  // reaching, hind hooves just leaving the moon's horn. Parts: white cow with
  // black patches, a lemon crescent one cube thick (so its outline reads, not
  // its top), a pink muzzle and udder, tan horns.
  (() => {
    const g = grid(10, 9, 3);
    sheet(g, [
      '.T.....HHH',
      '.tBBBBBHHH',
      '..BBBBBHmm',
      '..BBBBBLL.',
      'LLL.......',
    ], [0, 2], { B: cowWhite, H: cowWhite, m: muzzle, L: cowWhite, t: cowWhite, T: patch }, 0, 3);
    sheet(g, [
      'M.....M',
      'MM...MM',
      '.MMMMM.',
    ], [2, 2], { M: moon });                                                               // the crescent, horns up
    for (const z of [0, 2]) g.clear(1, 7, z).clear(1, 6, z).clear(1, 3, z);               // the tail; hind legs in a pair
    g.set(8, 8, 0, cowHorn).set(8, 8, 2, cowHorn);                                         // horns
    g.clear(7, 4, 1).clear(8, 4, 1);                                                       // front legs in a pair
    g.set(9, 6, 0, INK).set(9, 6, 2, INK);                                                 // eyes
    tint(g, (x, y, z) => g.get(x, y, z) === cowWhite && ((x >= 3 && x <= 4 && y >= 5) || (x === 6 && y <= 5 && y >= 4)), patch);
    g.set(4, 3, 1, muzzle);                                                                // udder
    return g.entry({ id: 'cand-p19-cow-over-moon', name: 'The Cow Jumped Over the Moon', fraction: 0.65, seed: 1, story: 'Cleared the moon once. The other cows have heard about it daily since.' });
  })(),

  // The Old Woman's Shoe (There Was an Old Woman Who Lived in a Shoe).
  // Identity: a big lace-up boot, side on, with a pitched red roof on its
  // shaft and a chimney; the arch notched under the instep. Moment: home,
  // the lamps lit, the door in the toe. Parts: brown leather, a dark sole and
  // heel (darkest low), red roof; yellow windows and a blue door as accents.
  (() => {
    const g = grid(9, 9, 4);
    sheet(g, [
      '..R......',
      '.RRR.....',
      'RRRRR....',
      'BBBB.....',
      'BBBBB....',
      'BBBBBB...',
      'BBBBBBBB.',
      'BBBBBBBBB',
      'SSS..SSSS',
    ], [0, 3], { R: roof, B: leather, S: sole });
    g.set(0, 7, 1, brick).set(0, 8, 1, brick);                                             // the chimney
    for (const z of [0, 3]) g.clear(4, 4, z).clear(8, 1, z).clear(7, 2, z).clear(8, 0, z); // the tongue; a rounded toe
    g.set(1, 4, 3, pane).set(2, 4, 3, pane).set(3, 2, 3, pane);                            // windows
    g.set(6, 1, 3, door).set(6, 2, 3, door);                                               // the door
    return g.entry({ id: 'cand-p19-old-womans-shoe', name: "The Old Woman's Shoe", fraction: 0.65, seed: 1, story: 'So many children, one shoe. The other is still being looked for.' });
  })(),

  // Baa Baa Black Sheep. Identity: a black sheep face on to you, pink ears
  // out, beside a pile of three tied sacks. Moment: "yes sir, yes sir, three
  // bags full". Parts: charcoal wool (big), cream sacks (medium) with red
  // cords and black wool at the top; a black face with white eyes.
  (() => {
    const g = grid(9, 7, 5);
    g.box([4, 8], [1, 5], [0, 3], wool);                                                   // the fleece
    for (const [x, y] of [[4, 1], [8, 1], [4, 5], [8, 5]]) for (const z of [0, 3]) g.clear(x, y, z);
    g.set(5, 6, 1, wool).set(7, 6, 2, wool);                                               // curls on top
    for (const x of [5, 7]) for (const z of [0, 3]) g.set(x, 0, z, sheepFace);             // legs
    g.box([5, 7], [2, 4], [4, 4], sheepFace);                                              // the face, to you
    g.set(4, 4, 4, earPink).set(8, 4, 4, earPink);                                         // ears out
    g.set(5, 4, 4, eyeWhite).set(7, 4, 4, eyeWhite);
    for (const [x0, y0] of [[0, 0], [2, 0], [1, 3]]) {                                     // three bags full
      g.box([x0, x0 + 1], [y0, y0 + 2], [1, 3], sack);
      g.box([x0, x0 + 1], [y0 + 2, y0 + 2], [2, 2], cord);                                 // tied at the neck
      g.clear(x0, y0 + 2, 1).clear(x0 + 1, y0 + 2, 1).clear(x0, y0 + 2, 3).clear(x0 + 1, y0 + 2, 3);
    }
    g.set(1, 6, 2, wool).set(2, 6, 2, wool);                                               // its wool, out of the top bag
    return g.entry({ id: 'cand-p19-black-sheep', name: 'Baa Baa Black Sheep', fraction: 0.65, seed: 2, story: 'Yes sir, three bags full. It has plenty more where those came from.' });
  })(),

  // The Owl and the Pussycat (Edward Lear). Identity: a pea-green boat with
  // two heads above the gunwale, the owl's ear tufts and the cat's ears
  // making two different crowns. Moment: at sea, side by side, facing you.
  // Parts: pea green hull (big), a brown owl with a cream face, a ginger cat
  // with a white chest; eyes, a beak and a pink nose as accents.
  (() => {
    const g = grid(10, 8, 4);
    sheet(g, [
      'H........H',
      'HHHHHHHHHH',
      '.HHHHHHHH.',
      '..HHHHHH..',
    ], [0, 3], { H: pea });
    for (const x of [0, 9]) g.clear(x, 3, 0).clear(x, 3, 3).clear(x, 2, 0).clear(x, 2, 3);   // bow and stern up
    g.box([1, 3], [3, 6], [1, 2], owl).box([1, 3], [5, 6], [2, 2], owlFace);              // the owl
    g.set(1, 7, 1, owl).set(3, 7, 1, owl).clear(2, 6, 1);                                  // ear tufts
    g.set(1, 6, 2, INK).set(3, 6, 2, INK).set(2, 5, 2, beak);
    g.box([6, 8], [3, 6], [1, 2], ginger).box([6, 8], [3, 4], [2, 2], catWhite);          // the pussycat
    g.set(6, 7, 1, ginger).set(8, 7, 1, ginger);                                           // ears
    g.set(6, 6, 2, INK).set(8, 6, 2, INK).set(7, 5, 2, catNose);
    return g.entry({ id: 'cand-p19-owl-pussycat', name: 'The Owl and the Pussycat', fraction: 0.65, seed: 1, story: 'They took some honey and plenty of money. Nobody remembered the oars.' });
  })(),

  // Rock-a-bye Baby. Identity: a hooded cradle on rockers, set on top of a
  // tree. Moment: on the treetop, before the wind gets up. Parts: a leaf
  // green crown (big), a wooden cradle on two rockers (the gap between them
  // a notch), a baby-blue hood and blanket; the baby's face as an accent.
  (() => {
    const g = grid(8, 10, 4);
    g.box([3, 4], [0, 1], [1, 2], bark);                                                   // the trunk
    g.box([0, 7], [2, 5], [0, 3], leaf);                                                   // the crown, lumpy
    for (const y of [2, 5]) for (const x of [0, 7]) for (const z of [0, 3]) g.clear(x, y, z);
    g.clear(0, 5, 1).clear(0, 5, 2).clear(7, 2, 1).clear(7, 2, 2).clear(3, 2, 0).clear(4, 5, 3);
    sheet(g, [
      '.HH.....',
      '.HHbHHW.',
      '.WWWWWW.',
      'WW....WW',
    ], [1, 2], { H: hood, b: baby, W: cradle }, 0, 6);                                     // the cradle on its rockers
    g.set(3, 8, 1, hood);
    return g.entry({ id: 'cand-p19-rockabye-baby', name: 'Rock-a-bye Baby', fraction: 0.65, seed: 1, story: 'Whoever chose the treetop for the cradle has some explaining to do.' });
  })(),

  // Rub-a-dub-dub, Three Men in a Tub. Identity: a hooped wooden tub with
  // three heads in a row, each crowned by its trade: the butcher's straw
  // boater, the baker's toque, the candlestick maker's lit candle. Moment:
  // all put out to sea. Parts: wood with one iron hoop (big), skin, the
  // three hats; moustaches and the flame as accents.
  (() => {
    const g = grid(10, 8, 4);
    for (let y = 0; y <= 2; y++) for (let x = 0; x < 10; x++) for (let z = 0; z < 4; z++)
      if (((x - 4.5) / 5) ** 2 + ((z - 1.5) / 2.2) ** 2 <= 1) g.set(x, y, z, y === 1 ? hoop : stave);   // the tub
    for (const x of [1, 4, 7]) g.box([x, x + 1], [3, 4], [1, 2], skin).set(x, 3, 2, tash).set(x + 1, 3, 2, tash);   // three men
    g.box([0, 3], [5, 5], [1, 2], straw).box([1, 2], [6, 6], [1, 2], straw);              // the butcher's boater
    g.box([4, 5], [5, 6], [1, 2], toque).box([4, 5], [7, 7], [0, 3], toque);              // the baker's toque
    g.set(8, 5, 1, wax).set(8, 6, 1, wax).set(8, 7, 1, flame);                             // the candlestick maker's candle
    return g.entry({ id: 'cand-p19-three-men-tub', name: 'Three Men in a Tub', fraction: 0.65, seed: 1, story: 'Butcher, baker, candlestick maker. One tub, and not a swimmer among them.' });
  })(),

  // The Dish Ran Away with the Spoon (Hey Diddle Diddle). Identity: a plate
  // with a willow-blue rim, front on, on two legs, a spoon beside it. Moment:
  // running away together, arm in arm, mouth open. Parts: white china with a
  // blue rim (big), a silver spoon (medium); eyes, a red mouth and red shoes.
  (() => {
    const g = grid(10, 9, 3);
    for (let y = 2; y < 9; y++) for (let x = 0; x < 7; x++) {                             // the dish
      const r = (x - 3) ** 2 + (y - 5) ** 2;
      if (r <= 3.3 ** 2) for (const z of [0, 1]) g.set(x, y, z, r > 2.7 ** 2 ? willow : china);
    }
    g.set(2, 6, 2, INK).set(4, 6, 2, INK).set(3, 4, 2, mouth);                             // a face, mouth open
    g.box([2, 2], [0, 1], [1, 1], china).box([4, 4], [0, 1], [1, 1], china).set(1, 0, 1, shoe).set(5, 0, 1, shoe);   // legs, running
    g.box([7, 9], [5, 8], [0, 1], silver).clear(7, 8, 0).clear(9, 8, 0).clear(7, 8, 1).clear(9, 8, 1);             // the spoon's bowl
    g.box([8, 8], [1, 4], [0, 1], silver).set(7, 0, 1, shoe).set(9, 0, 1, shoe).set(8, 0, 1, silver);              // its handle, its feet
    g.set(7, 7, 2, INK).set(9, 7, 2, INK);
    g.box([6, 8], [4, 4], [2, 2], china);                                                  // arm in arm
    return g.entry({ id: 'cand-p19-dish-and-spoon', name: 'The Dish and the Spoon', fraction: 0.65, seed: 1, story: 'They ran off together at midnight. The knife and fork took it badly.' });
  })(),

  // Little Miss Muffet's tuffet. Identity: a big black spider sat on a
  // round pink stool, legs out over both sides. Moment: along came a
  // spider, and she has gone; it has the tuffet to itself. Parts: pink
  // velvet (big), the black spider (medium), white eyes, gold buttons and
  // wooden feet as accents.
  (() => {
    const g = grid(9, 6, 5);
    g.cylinder('y', [4, 2], 2.6, [1, 2], velvet);                                         // the tuffet
    for (const [x, z] of [[2, 1], [6, 1], [2, 3], [6, 3]]) g.set(x, 0, z, wood);           // its feet
    g.set(4, 2, 4, button).set(2, 2, 2, button).set(6, 2, 2, button);
    g.box([3, 5], [3, 5], [1, 3], spider);                                                 // the spider
    for (const [y, z] of [[5, 1], [5, 3], [3, 1], [3, 3]]) g.clear(3, y, z).clear(5, y, z);
    g.set(3, 4, 4, eyeWhite).set(5, 4, 4, eyeWhite).set(4, 4, 4, spider);
    for (const z of [1, 3]) {                                                              // legs, out over the sides
      g.box([0, 2], [5, 5], [z, z], spider).box([0, 0], [3, 4], [z, z], spider);
      g.box([6, 8], [5, 5], [z, z], spider).box([8, 8], [3, 4], [z, z], spider);
      g.box([1, 2], [3, 3], [z, z], spider).set(1, 2, z, spider);
      g.box([6, 7], [3, 3], [z, z], spider).set(7, 2, z, spider);
    }
    return g.entry({ id: 'cand-p19-muffet-tuffet', name: "Miss Muffet's Tuffet", fraction: 0.65, seed: 1, story: 'It only wanted to sit down. She left without finishing her whey.' });
  })(),
];
