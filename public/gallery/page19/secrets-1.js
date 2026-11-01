// Page 19 · X Things With a Secret: daily stones, objects that open, hide or
// keep something. Strata is about finding what a stone hides, so each one has
// a secret on show (a soldier at a hatch, eyes under a lid, snow from a
// wardrobe) and, where it reads, a hollow inside that peeling finds (soldiers
// in the horse, a needle in the hay, a stone at the bottom of the soup).
// Palette: Stones (a pale grey-green sky), so every entry leads with a warm or
// strong colour part that isn't stone: honey wood, gold and lapis, red velvet,
// brown wood with white snow, straw gold, barrel brown, a black pot of orange
// soup. Every entry is in the daily band (judge() in public/js/daily.js: D
// 9.5-12, 90-180 chisels on the trimmed block, 4-10 waves), with fraction and
// seed written out so the gallery and the daily agree.
//
// Silhouette first. Each idea as name / identity feature that sets the
// outline / the moment / colour parts:
//  kept  Trojan Horse     a wooden horse on a wheeled cart, head up     a soldier at the hatch       honey wood, dark cart, bronze and red
//  kept  Sarcophagus      a gold mummy case, striped headdress          a bandaged hand out the seam gold, lapis stripes, white bandage
//  kept  Vampire's Coffin the six-sided lid, pushed back                a pale face under the lid    dark wood, red velvet, pale, brass rail
//  kept  Stone Soup       a black pot over a fire, full to the brim     the stone still in it        black pot, orange soup, grey stone
//  kept  Wardrobe         a tall wardrobe, one door swung wide          snow drifting out            brown wood, white snow, a fir inside
//  kept  Ring Box         a red velvet box, its lid up behind           the ring, unasked            red velvet, white satin, gold, a diamond
//  kept  Haystack         a golden dome of hay on a rope band           a red thread going in        straw gold, rope gold, red thread
//  kept  Stowaway         a barrel with hoops, its lid up a crack       two eyes in the dark         barrel brown, dark hoops, white eyes
//  cut   Pillar Box       a letter half in the slot: Weather (VIII) drew a Pillar Box first, with the same id
//  cut   Fabergé Egg      at 5-6 wide the egg reads as a blue vase; a lid hinged open costs 200+ chisels
//  cut   Locket           two heart halves at a right angle read as a gold crown; 34 cubes
//  cut   Hollow Book      opened flat, a tray and a mat; with the cover up, the Ring Box's outline again
//  cut   Safe             the gold trim read as letters, and the swung door leaves a hollow quarter
//  cut   Eight Ball       a 7-cube sphere reads as a black cube, the 8 as an H; 186 chisels
//  cut   Carpet Bag       a standard lamp out of a carpet bag read as a layer cake
//  cut   Magic Beans      the sack read as a turnip; the beanstalk beside it costs 214 chisels
//  cut   Beware of the Dog a kennel reads as a house, and the dog's face was lost in the doorway
//  cut   Upright Coffin   the hexagon faces the camera's left and turns to a brown slab
//  cut   Phone Box        a book exchange now: the windows fill in at this size; 63 chisels
//  cut   Bunbuku Kettle   an iron kettle with a tanuki's head and tail read as a grey robot; 251 chisels
//  cut   Fortune Teller   the paper cootie catcher read as four toy blocks; 9 pieces
//  out   Knight's Helmet  with a robin nesting: page 15's Knight's Helm already has an anemone in it
//  out   Thief in a Jar   Ali Baba's: the Trojan Horse's joke again, and Amphora & Octopus owns creature-in-a-jar
//  out   Treasure Chest with an eye (a mimic), Cuckoo Clock, letterbox, Bird House, Keyhole Arch,
//        Message in a Bottle, Snail Cottage, Clam & Pearl, Matchbox, Music Box, Jack-in-the-Box,
//        Geode, Nesting Doll, Biscuit Tin (the sewing-tin joke): all exist
//  out   Walnut room (a brown blob at 40 px), Time Capsule (needs a caption), fairy door
//        in a stump (rejected before)
// Learns from: Trojan Horse, Noah's Ark (the container is the joke) and the
// Piñata (an animal side on, face at +x); Sarcophagus, the Sphinx and Haniwa
// (an old figure, frontal and symmetric) and the Kokeshi (colour blocks over
// a plain outline); Coffin, the Black Cat (a dated Halloween stone) and the
// Rabbit in a Hat (someone peeking over the edge); Stone Soup, Baba Yaga's Hut
// and the Sword in the Stone (a folk tale's object, with a stone in on the
// joke); Wardrobe, the Frog Prince (the fairy-tale twist) and Noah's Ark
// (something bigger than its box); Ring Box, the Instant Camera and the Piggy
// Bank (an everyday object with a small story); Haystack, the Pumpkin (a known
// compact outline) and the Piggy Bank's coin (one accent that tells it);
// Stowaway, the Rabbit in a Hat (eyes over the brim) and the Cloth Tiger
// (round eyes looking out). Faces and details look toward +z / +x.
import { grid } from '../voxel.js';
import { INK, tint, sheet, lathe } from './kit.js';

// Flat material colours: the game's light does the shading.
const wood = 0xd9a066, mane = 0x8a5a3c, cart = 0x5e4234, bronze = 0xf2c14e, crest = 0xe0434b, hatch = 0x3a3442, rope = 0xf6efe0,
  caseGold = 0xf2c14e, lapis = 0x2f5fb8, bandage = 0xf6efe0,
  coffin = 0x5a3a2e, velvet = 0xc8283c, pale = 0xe6e0ee, brass = 0xe9b949,
  pot = 0x34303c, log = 0x8a5a3c, flame = 0xf6d14a, broth = 0xf2a03d, stone = 0xa8a4a0, carrot = 0xf0602a, leek = 0x7ed05a,
  robe = 0x8a5a3c, snow = 0xf4f9fd, fir = 0x3f8a5b, lamp = 0xf6d365, night = 0x2f4a7a,
  boxRed = 0xc8283c, satin = 0xfbf3e6, ringGold = 0xf2c14e, diamond = 0xd6f0fa,
  hay = 0xf2c75a, hayBand = 0xd9a03a, needle = 0xc9d1d9, thread = 0xe0434b,
  stave = 0xb9773f, hoop = 0x4a3a34, gloom = 0x2a2630, eyeW = 0xfbf8f2;

export default [
  // Trojan Horse (Troy, as Virgil tells it). Identity: a wooden horse on a
  // wheeled cart, its neck and head up. Moment: wheeled in as a gift, and one
  // soldier can't help looking out of the hatch. Parts: honey wood, a darker
  // cart and mane; a bronze helmet with a red crest. Inside, more of them.
  (() => {
    const g = grid(9, 10, 3);
    for (const x of [1, 2, 6, 7]) g.box([x, x], [0, 0], [0, 2], cart);                  // wheels on their axles
    g.box([0, 8], [1, 1], [0, 2], cart);                                                // the cart
    for (const x of [1, 5]) for (const z of [0, 2]) g.set(x, 2, z, wood);               // legs
    g.box([0, 6], [3, 5], [0, 2], wood);                                                // the body
    g.box([1, 5], [4, 4], [1, 1], 0);                                                   // hollow,
    g.set(4, 4, 1, crest).set(5, 4, 1, bronze);                                         // and full of soldiers
    g.box([2, 3], [3, 4], [2, 2], 0).set(2, 3, 1, hatch).set(2, 4, 1, hatch);           // the hatch, open
    g.set(3, 3, 1, bronze).set(3, 4, 1, crest);                                         // one of them, looking out
    g.set(3, 2, 2, rope);                                                               // the rope down
    g.box([5, 6], [6, 7], [1, 1], wood);                                                // the neck
    g.box([4, 4], [6, 9], [1, 1], mane);                                                // the mane
    g.box([5, 8], [8, 8], [1, 1], wood).set(8, 7, 1, wood);                             // the head, nose down
    g.set(5, 9, 1, wood).set(7, 9, 1, wood);                                            // ears
    g.set(7, 8, 1, INK);                                                                // an eye, both sides
    return g.entry({ id: 'cand-p19-trojan-horse', name: 'Trojan Horse', fraction: 0.65, seed: 4, story: 'A gift for the city. It has been very quiet. Too quiet.' });
  })(),

  // Sarcophagus (a pharaoh's gold mummy case, standing). Dated: 4 November,
  // the day in 1922 Howard Carter found the steps to Tutankhamun's tomb.
  // Identity: a gold case with a striped headdress, a gold face and crossed
  // arms. Moment: a bandaged hand has found the seam. Parts: gold, lapis
  // stripes (a pattern, so the softer light), white bandage; the mummy is
  // inside, for peeling.
  (() => {
    const g = grid(7, 10, 4);
    const front = [
      '.NNNNN.',
      'NNFFFNN',
      'NNFFFNN',
      '.NFFFN.',
      '.CCBCC.',
      '.CAAAC.',
      '..AAA..',
      '..GGG..',
      '..GGG..',
      '..GGG..',
    ];
    sheet(g, front, [0, 1], { N: caseGold, F: caseGold, C: caseGold, A: caseGold, B: caseGold, G: caseGold });   // the case
    sheet(g, front, [2, 2], { N: lapis, F: caseGold, C: lapis, A: caseGold, B: lapis, G: caseGold });            // the lid
    tint(g, (x, y, z) => z === 2 && g.get(x, y, z) === lapis && y >= 6 && y % 2 === 1 && x !== 3, caseGold);     // the headdress, striped
    tint(g, (x, y, z) => z === 2 && y === 5 && (x === 1 || x === 5), caseGold);
    g.box([2, 4], [6, 8], [3, 3], caseGold);                                             // the face
    g.set(2, 7, 3, INK).set(4, 7, 3, INK);                                               // eyes
    g.set(3, 4, 3, lapis).set(3, 3, 3, lapis);                                           // the crook
    g.box([2, 4], [0, 5], [1, 1], bandage);                                              // inside: the mummy
    g.set(5, 3, 2, bandage).set(6, 3, 2, bandage).set(5, 4, 2, bandage);                 // a hand, out at the seam
    return g.entry({ id: 'cand-p19-sarcophagus', name: 'Sarcophagus', fraction: 0.7, seed: 8, lit: { span: 2 }, story: 'Sealed for all eternity. Something in there has started knocking.' });
  })(),

  // Vampire's Coffin (the six-sided coffin). Dated: Halloween, 31 October.
  // Identity: the long six-sided lid, seen from above. Moment: just before
  // sunset, the lid pushed back a little and a pale face looking out. Parts:
  // dark wood, red velvet lining, a pale face and fingers, a brass rail.
  (() => {
    const g = grid(10, 4, 7);
    const plan = (x, z) => (x <= 3 || x >= 8 ? z >= 3 && z <= 5 : z >= 2 && z <= 6);
    for (let x = 0; x < 10; x++) for (let z = 0; z < 7; z++) if (plan(x, z)) {
      g.set(x, 0, z, coffin);                                                           // the floor,
      const edge = !plan(x - 1, z) || !plan(x + 1, z) || !plan(x, z - 1) || !plan(x, z + 1);
      g.box([x, x], [1, 2], [z, z], edge ? coffin : velvet);                            // the sides, the lining
    }
    for (let x = 0; x < 10; x++) for (let z = 0; z < 7; z++) if (plan(x, z + 2)) g.set(x, 3, z, coffin);   // the lid, pushed back
    g.box([6, 8], [2, 2], [4, 5], pale).set(7, 2, 5, INK).set(8, 2, 4, INK);           // a face under it
    g.set(4, 2, 6, pale).set(5, 2, 6, pale);                                            // fingers on the edge
    g.box([4, 6], [1, 1], [6, 6], brass).set(1, 1, 5, brass);                          // the handle rail
    return g.entry({ id: 'cand-p19-coffin', name: "Vampire's Coffin", fraction: 0.7, seed: 4, story: 'Do not disturb before sunset. He has asked very nicely.' });
  })(),

  // Stone Soup (the folk tale: a traveller makes soup from a stone, and the
  // village adds the rest). Identity: a black pot over a fire, full to the
  // brim. Moment: the soup is nearly ready, and the stone is still in it.
  // Parts: a black pot, orange soup, a grey stone; carrot and leek, logs and
  // flame. Peeling finds the whole stone at the bottom.
  (() => {
    const g = grid(7, 7, 7);
    g.box([1, 5], [0, 0], [3, 3], log).box([3, 3], [0, 0], [1, 5], log);                // the fire
    g.box([2, 4], [0, 0], [2, 4], (x, y, z) => (x === 3 || z === 3 ? null : flame));
    lathe(g, [3, 3], 1, [2.4, 3.1, 3.3, 3.3, 3.0], pot);                                 // the pot
    g.cylinder('y', [3, 3], 2.3, [5, 5], broth);                                         // full to the brim
    g.box([2, 3], [3, 6], [3, 4], stone).clear(2, 6, 4);                                 // the stone, all of it
    g.set(4, 5, 2, carrot).set(1, 5, 2, carrot).set(4, 5, 4, leek).set(2, 5, 1, leek);   // what the neighbours brought
    g.set(0, 5, 3, pot).set(6, 5, 3, pot).set(0, 4, 3, pot).set(6, 4, 3, pot);           // handles
    return g.entry({ id: 'cand-p19-stone-soup', name: 'Stone Soup', fraction: 0.65, seed: 2, story: 'The recipe calls for one stone. The neighbours bring everything else.' });
  })(),

  // Wardrobe (the one with a winter at the back). Dated: 21 December, the
  // longest night. Identity: a tall wardrobe on feet, one door swung wide.
  // Moment: snow drifting out over the floor. Parts: brown wood, white snow;
  // inside, a fir, a night sky and a lamp-post's light.
  (() => {
    const g = grid(6, 9, 6);
    g.box([0, 5], [0, 7], [0, 2], robe).box([0, 5], [8, 8], [0, 2], robe);              // the wardrobe, its cornice
    for (const x of [1, 4]) g.clear(x, 0, 2).clear(x, 0, 0);                            // feet
    g.box([3, 4], [1, 6], [1, 1], 0);                                                   // the closed half: coats, gone
    g.box([1, 2], [1, 6], [1, 2], 0).box([1, 2], [5, 6], [1, 1], night);               // the open half: a night,
    g.box([1, 2], [1, 1], [1, 2], snow).box([1, 2], [2, 3], [1, 1], fir).box([1, 1], [4, 5], [1, 1], fir).set(2, 4, 1, fir);   // snow and a fir
    g.set(2, 5, 1, lamp);                                                               // a lamp-post's light
    g.box([0, 0], [0, 7], [3, 5], robe);                                                // the door, swung wide
    g.box([1, 4], [0, 0], [3, 5], snow).box([1, 3], [1, 1], [3, 4], snow).set(2, 0, 2, snow);   // the drift
    g.set(3, 3, 2, brass);                                                              // the other door's knob
    return g.entry({ id: 'cand-p19-wardrobe', name: 'Wardrobe', fraction: 0.65, seed: 5, story: 'Hang your coat at the front. Mind the snow at the back.' });
  })(),

  // Ring Box. Dated: Valentine's Day, 14 February. Identity: a red velvet
  // box, its lid up behind like a backrest. Moment: open, and the question
  // not yet asked. Parts: red velvet, white satin, a gold ring; the diamond
  // stays exact (under 5 cubes).
  (() => {
    const g = grid(6, 8, 5);
    g.box([0, 5], [0, 2], [0, 4], boxRed);                                              // the box
    g.box([1, 4], [2, 2], [1, 4], satin);                                               // the cushion
    g.box([0, 5], [3, 7], [0, 0], boxRed).box([1, 4], [3, 6], [0, 0], satin);           // the lid, up
    g.box([1, 4], [3, 3], [2, 2], ringGold).box([1, 4], [5, 5], [2, 2], ringGold).set(1, 4, 2, ringGold).set(4, 4, 2, ringGold);   // the ring
    g.set(2, 6, 2, diamond).set(3, 6, 2, diamond);                                      // the diamond
    return g.entry({ id: 'cand-p19-ring-box', name: 'Ring Box', fraction: 0.7, seed: 1, story: 'He has carried it in his pocket for eleven weeks.' });
  })(),

  // Haystack (and the needle in it). Identity: a golden dome of hay on a
  // darker rope band. Moment: a red thread going in at the front, as if
  // someone sewed it shut. Parts: straw gold, rope gold, a red thread; the
  // needle is in the middle, for peeling.
  (() => {
    const g = grid(7, 7, 7);
    lathe(g, [3, 3], 0, [3.7, 3.7, 3.6, 3.3, 2.9, 2.3, 1.5], hay);                      // the stack
    tint(g, (x, y) => y === 1, hayBand);                                                 // the rope band
    g.box([2, 4], [1, 5], [2, 4], 0).box([3, 3], [1, 5], [3, 3], needle);               // a hollow, and the needle
    g.set(3, 3, 4, thread).set(3, 3, 5, thread).set(3, 2, 6, thread).set(4, 2, 6, thread);   // the thread, out
    return g.entry({ id: 'cand-p19-haystack', name: 'Haystack', fraction: 0.65, seed: 2, story: 'There is a needle in here. Nobody has ever needed it that badly.' });
  })(),

  // Stowaway (a barrel in the hold). Identity: a barrel, staves and two dark
  // hoops. Moment: the lid up a crack at the front, two eyes in the dark.
  // Parts: barrel brown, dark hoops, white eyes in a black gap; empty inside
  // but for whoever it is.
  (() => {
    const g = grid(6, 7, 6);
    lathe(g, [2.5, 2.5], 0, [2.4, 3.2, 2.9, 2.9, 3.2, 2.4], stave);                    // the barrel
    tint(g, (x, y) => y === 1 || y === 4, hoop);                                        // hoops, standing proud
    g.cylinder('y', [2.5, 2.5], 1.9, [1, 5], 0);                                        // empty, nearly
    g.cylinder('y', [2.5, 2.5], 1.9, [1, 1], stave);
    g.cylinder('y', [2.5, 2.5], 1.9, [5, 5], gloom);
    g.cylinder('y', [2.5, 2.5], 2.4, [6, 6], stave);                                    // the lid,
    g.box([0, 5], [6, 6], [4, 5], 0);                                                   // up a crack at the front
    for (const x of [1, 2, 3, 4]) g.set(x, 5, 4, gloom);
    g.set(1, 5, 5, eyeW).set(3, 5, 5, eyeW).set(2, 5, 5, gloom).set(4, 5, 5, gloom);   // two eyes in the dark
    g.set(2, 6, 3, stave).set(1, 6, 3, stave);
    return g.entry({ id: 'cand-p19-stowaway', name: 'Stowaway', fraction: 0.65, seed: 2, lit: { span: 2 }, story: 'Forty barrels of apples were loaded. One of them is watching.' });
  })(),
];
