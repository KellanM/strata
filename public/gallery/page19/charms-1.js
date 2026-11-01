// Page 19 · IV Lucky Charms: daily stones, the things people keep for luck,
// from around the world, each with a face, a moment or a dry joke rather
// than a bare emblem. A stranger plays one from a shared link, so each is a
// charm you'd know from across a room, caught at the moment its luck shows.
// Palette: Festival (indigo to wine, so bodies stay light and warm: cream,
// brick, red, gold, teal; the few darks are hats and pupils, kept small and
// high on light bodies). Every entry is in the daily band (judge() in
// public/js/daily.js: D 9.5-12, 90-180 chisels on the trimmed block, 4-10
// waves), with fraction and seed written out so the gallery and the daily agree.
//
// Silhouette first. Each idea as name / identity feature that sets the
// outline / the moment / colour parts:
//  kept  Chimney Sweep   a top hat out of a brick chimney, brush up beside it  popped out to shake your hand  brick, cream cap, black hat, skin
//                        (dated: 31 December 2026, New Year's Eve, when a sweep is the luck in Germany and Austria)
//  kept  Nazar           a round blue eye on a red cord, a chip out of its rim  cracked: so it worked          cobalt, white, sky blue, a black pupil
//  kept  Lucky Socks     two tube socks standing up by themselves, toes in      too lucky to wash              white, red and blue stripes, grubby toes
//  kept  Horseshoe       the horseshoe over the front door, ends down           the luck has run out           brick, teal door, silver shoe, gold luck
//  kept  Fukusuke        a big head over stiff kamishimo shoulders, kneeling     bowing to the customers        teal, grey hakama, pale face, black topknot
//  kept  Blarney Stone   a battlement with a man hanging head down off it        mid-kiss                       stone grey, green jumper, jeans, red hair
//  kept  Piskie          a Cornish piskie on a toadstool, ears and hat up        hugging his knees              green, skin, a red cap with white spots
//  kept  Kitchen Witch   a hat brim as wide as the broom she rides               hung over the stove            black hat, red dress, straw, brown stick
//  cut   Fingers Crossed two crossed fingers over a fist (built: at 40 px a
//                        beige mitten; one skin colour, so the crossing vanishes)
//  cut   Fortune Cookie  built twice: the fold never read, a lumpy bun; and food
//  cut   Fuzzy Dice      built: a dark slab of mirror over two white cubes; pips
//                        on a 4-cube face can't make most numbers
//  cut   Wishbone        built: a thin pale arch between two big fists
//  cut   Arch Horseshoe  a lone horseshoe, ends down, luck spilled under it: a
//                        stone arch at 40 px; over a door it reads
//  out   Lion Dance, Pot of Gold, Magpie & Ring, Leprechaun: built here first,
//        then found in VII Holidays, IX Up to Something and III Myths
//  out   Lucky Elephant (Thai, trunk up) Temple, Songkran and Circus Elephants exist
//  out   Barcelos Rooster Rooster exists (page 16); same outline
//  out   Four-leaf Clover, Ladybird, Tanuki, Scarab, Wishing Well, Owl, Acorn,
//        Mushroom, Crane, Little Oni, Maneki-neko, Daruma, Omamori, Dreamcatcher,
//        Money Toad: exist or were rejected
//  out   Pisanka         Fabergé Egg (X Secrets) owns the painted egg
//  out   Lucky Penny on its edge, Hamsa: a coin or a hand is flat (under 60 taps)
//  out   Rabbit's Foot   seven rabbits and hares exist; no kind version reads
//  out   Milagro, Kumade, Billiken, Ekeko, Martenitsa: need a caption
//  out   Budai           a revered figure as a joke
// Learns from: Sweep, Raccoon in a Bin and Noah's Ark (the container is the
// joke) and the Genie (a figure out of a vessel); Nazar, the Fox Mask and
// Chattering Teeth (a face with no head) and Eye Stone's stare; Socks, the
// Melted Snowman (an everyday thing, a dry line) and Sock Monkey's red heel;
// Horseshoe, Instant Camera (an everyday object with charm); Fukusuke, the
// Akabeko and Haniwa (Japanese folk with a face) and the Kokeshi (big head,
// colour blocks); Blarney Stone, Chicken Crossing (a moment you catch) and the
// Sword in the Stone (a figure and its famous stone); Piskie, the Troll Doll
// (a lucky doll whose hat sets the top) and the Basket Dog (sitting on its
// thing); Kitchen Witch, Baba Yaga's Hut and the Broomstick (folk magic with
// a twist) and the Pegasus Foal (the identity at full width: the brim).
// Faces and details look toward +z / +x.
import { grid } from '../voxel.js';
import { INK, sheet } from './kit.js';

// Flat material colours: the game's light does the shading.
const brick = 0xc8573f, capStone = 0xe8d3b8, skin = 0xf2c49c, soot = 0x3a3442, handle = 0xd9b48f, bristle = 0x6b4a3a, coin = 0xf6c63a,
  nazarBlue = 0x2f6fd8, nazarWhite = 0xfbf8f2, nazarSky = 0x8cd0f2, cord = 0xd8343c,
  sockWhite = 0xf6f1e6, sockRed = 0xd8343c, sockBlue = 0x4f86cf, grime = 0xa89a86,
  wallRed = 0xc8573f, door = 0x2f9a8a, step = 0xd9c4a8, shoe = 0xc9d1d9, luck = 0xf6c63a, brass = 0xf2c14e,
  kami = 0x3f8fa0, hakama = 0x8a93a3, face = 0xfbe6d2, hair = 0x3a3442, collar = 0xfbf8f2, crest = 0xfbf8f2,
  stone = 0xb8bcc8, blarney = 0x8a8f9c, jumper = 0x3fa055, jeans = 0x4f86cf, hairRed = 0xe0703c, kiss = 0xd8343c,
  stalk = 0xf6efe4, cap = 0xd8343c, spot = 0xfbf8f2, suitGreen = 0x3fa055,
  witchHat = 0x6f4fa8, greyHair = 0xc9c4d4, dress = 0xd8343c, apron = 0xfbf8f2, broomstick = 0x9a5a38, straw = 0xf2c14e;

export default [
  // Chimney Sweep (the Glücksbringer of New Year's Eve; dated: 31 December
  // 2026). Identity: a black top hat coming up out of a brick chimney, the
  // brush up beside it. Moment: popped out to shake your hand, as a sweep
  // met on the year's last day is luck. Parts: brick stack, cream cap, black
  // hat and coat, skin; a brass button and a soot smudge as accents.
  (() => {
    const g = grid(7, 10, 5);
    g.box([0, 4], [0, 2], [0, 4], brick);                                                 // the stack
    g.box([0, 5], [3, 3], [0, 4], capStone);                                              // its cap
    g.box([1, 3], [4, 4], [1, 3], soot).set(2, 4, 3, coin);                               // shoulders, a brass button
    g.box([1, 3], [5, 6], [1, 3], skin);                                                  // the head
    g.set(1, 6, 3, INK).set(3, 6, 3, INK).set(3, 5, 3, soot);                             // eyes, a smudge of soot
    g.box([0, 4], [7, 7], [0, 4], soot).box([1, 3], [8, 9], [1, 3], soot);                // the top hat
    g.box([4, 5], [4, 4], [2, 2], soot).set(6, 4, 2, skin);                               // an arm out, holding
    g.box([6, 6], [5, 6], [2, 2], handle);                                                // the brush's handle
    g.box([6, 6], [7, 9], [1, 3], bristle).clear(6, 9, 1).clear(6, 9, 3).clear(6, 7, 1).clear(6, 7, 3);   // and its bristles
    g.set(3, 4, 4, skin);                                                                 // a hand out to shake
    return g.entry({ id: 'cand-p19-chimney-sweep', name: 'Chimney Sweep', fraction: 0.65, seed: 6, story: 'Shake his hand for luck. Then wash yours.' });
  })(),

  // Nazar (the Turkish blue eye bead). Identity: the round blue eye itself,
  // dark rim, white, sky blue, black pupil, domed toward you, on a red cord.
  // Moment: a chip out of the rim and a crack across the white: it caught
  // the evil eye, which is how you know it worked. Parts: cobalt, white, sky
  // blue, a black pupil; the red cord.
  (() => {
    const g = grid(9, 10, 4);
    for (let y = 0; y < 9; y++) for (let x = 0; x < 9; x++) {
      const r = Math.hypot(x - 4, y - 4);
      if (r <= 4.4) g.set(x, y, 0, nazarBlue).set(x, y, 1, nazarBlue);
      if (r <= 3.5) g.set(x, y, 2, nazarWhite);
      if (r <= 2.3) g.set(x, y, 3, nazarSky);
      if (r <= 1.45) g.set(x, y, 3, INK);
    }
    g.box([4, 4], [9, 9], [0, 2], cord);                                              // the cord
    for (let y = 6; y < 9; y++) for (let x = 6; x < 9; x++) if (Math.hypot(x - 4, y - 4) > 3.4) g.clear(x, y, 1);   // the chip
    g.set(6, 6, 2, INK).set(5, 7, 2, INK);                                                // the crack
    return g.entry({ id: 'cand-p19-nazar', name: 'Nazar', fraction: 0.65, seed: 1, story: 'It cracked overnight. That means it worked.' });
  })(),

  // Lucky Socks (the fan's pair, kept unwashed while the team wins).
  // Identity: two tube socks standing up on their own, red and blue stripes
  // at the top. Moment: stood to attention, toes turned in, too lucky to
  // wash. Parts: white socks, a red and a blue stripe, grubby toes and heels.
  (() => {
    const g = grid(7, 8, 6);
    for (const [x0, toe] of [[0, [[0, 2, 3], [1, 3, 4], [2, 3, 5]]], [4, [[4, 6, 3], [3, 5, 4], [3, 4, 5]]]]) {
      g.box([x0, x0 + 2], [1, 7], [0, 2], sockWhite);                                     // the leg
      g.box([x0, x0 + 2], [0, 1], [0, 2], sockWhite);
      for (const [a, b, z] of toe) g.box([a, b], [0, 1], [z, z], z === 5 ? grime : sockWhite);   // the foot, toes in
      g.box([x0, x0 + 2], [0, 1], [0, 0], grime);                                          // the heel
      g.box([x0, x0 + 2], [6, 6], [0, 2], sockRed).box([x0, x0 + 2], [4, 4], [0, 2], sockBlue);   // stripes
    }
    return g.entry({ id: 'cand-p19-lucky-socks', name: 'Lucky Socks', fraction: 0.7, seed: 7, story: 'Unwashed since the cup final. They stand up on their own now.' });
  })(),

  // Horseshoe (nailed over the front door). Identity: the silver horseshoe
  // over a teal door in a brick wall. Moment: hung ends down, so the luck has
  // run out of it and lies in a gold puddle on the step. Parts: brick wall
  // and frame, teal door, pale step, a silver shoe and gold luck; a brass
  // knocker and a letterbox.
  (() => {
    const g = grid(7, 10, 4);
    g.box([0, 6], [1, 9], [0, 0], wallRed).box([1, 5], [1, 5], [0, 0], door);            // the wall, the door
    g.box([0, 0], [1, 9], [1, 1], wallRed).box([6, 6], [1, 9], [1, 1], wallRed).box([1, 5], [6, 9], [1, 1], wallRed);   // the frame
    g.box([0, 6], [0, 0], [0, 3], step);                                                  // the step
    g.set(3, 4, 0, brass).set(3, 2, 0, INK);                                              // knocker, letterbox
    g.box([2, 4], [9, 9], [2, 2], shoe).box([1, 1], [6, 8], [2, 2], shoe).box([5, 5], [6, 8], [2, 2], shoe);   // the horseshoe, ends down
    g.set(3, 9, 3, INK);                                                                  // its nail
    g.box([2, 4], [1, 1], [1, 3], luck).box([1, 5], [1, 1], [3, 3], luck);                // the luck, run out on the step
    return g.entry({ id: 'cand-p19-horseshoe', name: 'Horseshoe', fraction: 0.65, seed: 1, story: 'Hung the wrong way up. The luck has run out onto the step.' });
  })(),

  // Fukusuke (the Japanese shop's bowing luck doll). Identity: a big round
  // head over stiff kamishimo shoulders that set the full width, a topknot on
  // top, big lucky earlobes. Moment: kneeling to welcome the customers, hands
  // on his knees. Parts: teal kamishimo with white crests, grey hakama, a pale
  // face and black hair; eyes as accents.
  (() => {
    const g = grid(9, 9, 5);
    g.box([1, 7], [0, 1], [0, 4], hakama);                                                // kneeling
    g.box([3, 5], [1, 1], [4, 4], face);                                                  // hands on the knees
    g.box([2, 6], [2, 2], [1, 3], kami).set(4, 2, 3, collar);                             // the body, the collar
    g.box([0, 8], [3, 3], [0, 4], kami);                                                  // the stiff shoulders
    g.set(0, 3, 3, crest).set(8, 3, 3, crest);
    g.box([2, 6], [4, 7], [0, 4], face);                                                  // the big head
    for (const x of [2, 6]) g.clear(x, 7, 4).clear(x, 4, 4);
    g.box([2, 6], [7, 7], [0, 3], hair).box([2, 6], [4, 6], [0, 0], hair);                // hair
    g.box([4, 4], [8, 8], [1, 2], hair);                                                  // the topknot
    g.set(3, 5, 4, INK).set(5, 5, 4, INK);                                                // eyes
    for (const x of [1, 7]) g.box([x, x], [4, 5], [2, 2], face);                          // big lucky earlobes
    return g.entry({ id: 'cand-p19-fukusuke', name: 'Fukusuke', fraction: 0.65, seed: 1, story: 'Bows to everyone who comes into the shop. Has never once stood up.' });
  })(),

  // Blarney Stone (kissed upside down at Blarney Castle for the gift of the
  // gab). Identity: battlements, and a man hanging head down off them, his
  // legs hooked over the top. Moment: mid-kiss, upside down, lost for words.
  // Parts: stone grey (big), green jumper, jeans, skin; red hair, eyes and a
  // grin as accents; the darker Stone either side of his head.
  (() => {
    const g = grid(9, 9, 5);
    g.box([0, 8], [0, 6], [0, 2], stone);                                                 // the tower's top
    for (const x of [0, 1, 3, 4, 5, 7, 8]) g.box([x, x], [7, 8], [0, 2], stone);          // its battlements
    g.box([0, 8], [5, 8], [0, 0], 0);                                                     // the walk behind them
    for (const x of [2, 6]) g.box([x, x], [2, 3], [2, 2], blarney);                       // the Stone, either side of his head
    g.box([3, 5], [6, 6], [3, 3], jeans).box([3, 5], [7, 7], [1, 2], jeans);              // legs hooked over the top
    g.box([3, 5], [4, 5], [3, 4], jumper);                                                // hanging down the wall
    g.box([3, 5], [1, 3], [3, 4], skin).box([3, 5], [1, 1], [4, 4], hairRed).set(4, 1, 3, hairRed);             // the head, upside down
    g.set(3, 2, 4, INK).set(5, 2, 4, INK).set(4, 3, 4, kiss);                            // eyes, and a grin the right way up for him
    return g.entry({ id: 'cand-p19-blarney-stone', name: 'Blarney Stone', fraction: 0.75, seed: 7, story: 'Kiss it upside down and never be lost for words. He currently is.' });
  })(),

  // Piskie (Cornwall's lucky pixie). Identity: a big head with pointed ears
  // and a pointed green hat, sat on a red toadstool. Moment: hugging his
  // knees, waiting to lead you astray. Parts: green suit and hat, skin, a red
  // cap with white spots on a cream stalk; eyes as accents.
  (() => {
    const g = grid(7, 10, 5);
    g.box([2, 4], [0, 0], [1, 3], stalk);                                                 // the toadstool's stalk
    g.box([0, 6], [1, 1], [0, 4], cap).box([1, 5], [2, 2], [0, 4], cap);                  // its cap
    for (const [x, z] of [[0, 0], [6, 0], [0, 4], [6, 4]]) g.clear(x, 1, z);
    g.set(0, 1, 2, spot).set(6, 1, 2, spot).set(2, 1, 4, spot).set(5, 2, 4, spot).set(1, 2, 1, spot);   // white spots
    g.box([1, 5], [3, 4], [1, 3], suitGreen);                                             // hugging his knees
    g.box([2, 4], [3, 4], [4, 4], suitGreen).set(2, 4, 4, skin).set(4, 4, 4, skin);       // knees up, hands round them
    g.box([1, 5], [5, 7], [0, 4], skin);                                                  // the big head
    for (const x of [1, 5]) g.clear(x, 5, 4);
    g.set(2, 6, 4, INK).set(4, 6, 4, INK);                                                // eyes
    g.set(0, 6, 2, skin).set(0, 7, 2, skin).set(6, 6, 2, skin).set(6, 7, 2, skin);        // pointed ears
    g.box([1, 5], [7, 7], [0, 3], suitGreen).box([2, 4], [8, 8], [0, 3], suitGreen);      // the pointed hat
    g.box([3, 3], [9, 9], [0, 1], suitGreen);
    return g.entry({ id: 'cand-p19-piskie', name: 'Piskie', fraction: 0.65, seed: 1, story: 'Take one home for luck. Getting lost on the way is free.' });
  })(),

  // Kitchen Witch (the doll on a broom hung over the stove, from northern
  // Europe). Identity: a witch's hat brim as wide as the broom she rides.
  // Moment: riding along over the cooker, keeping the pots from burning.
  // Parts: a violet hat, black boots, red dress and white apron, a brown broomstick
  // and straw bristles; grey hair, a face and eyes as accents.
  (() => {
    const g = grid(9, 10, 3);
    sheet(g, [
      '......H..',
      '.....HH..',
      '....HHH..',
      '..HHHHHHH',
      '...gFFFg.',
      '....FFF..',
      'SS..RRR..',
      'SSBBBBBBB',
      'SS.RRRRR.',
      '....K.K..',
    ], [0, 2], { H: witchHat, F: skin, g: greyHair, R: dress, B: broomstick, S: straw, K: soot });
    g.set(4, 5, 2, INK).set(6, 5, 2, INK).set(3, 5, 0, skin).set(7, 5, 0, skin);          // eyes
    for (const x of [4, 6]) g.clear(x, 0, 0).clear(x, 0, 2);                               // boots, toes out
    g.set(5, 3, 2, apron).set(5, 1, 2, apron).box([4, 6], [1, 1], [2, 2], apron);         // the apron
    return g.entry({ id: 'cand-p19-kitchen-witch', name: 'Kitchen Witch', fraction: 0.65, seed: 4, story: 'Hung in the kitchen so nothing burns. Nobody told the toast.' });
  })(),
];
