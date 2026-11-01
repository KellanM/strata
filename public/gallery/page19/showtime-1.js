// Page 19 · VI Show Time: daily stones, magic, circus and the stage. Kellan
// picked the Rabbit in a Hat, so each is a trick or a show caught at its
// moment, mostly someone peeking out of the thing the act is about.
// Palette: Festival (deep plum to wine, so bodies stay light and bright:
// blue, yellow, lavender grey, gold, red; nothing big and dark). Every entry
// is in the daily band (judge() in public/js/daily.js: D 9.5-12, 90-180
// chisels on the trimmed block, 4-10 waves), with fraction and seed written
// out so the gallery and the daily agree.
//
// Silhouette first. Each idea as name / identity feature that sets the
// outline / the moment / colour parts:
//  kept  Sawn in Half     a box in two halves, the saw standing up out of the cut   mid-trick, still smiling    blue box, steel saw, a head and two feet
//  kept  Clown Car        a pile of heads higher than the car is tall                arriving, nobody out yet    yellow car, white faces, four hair colours
//  kept  Circus Elephant  ears out at full width, trunk up over the head            sat up on her drum          lavender grey, red drum, gold rim, a fez
//  kept  Theatre Masks    two faces side by side, one smiling, one not              (the sign over every stage) gold, pale blue, dark eyes and mouths
//  kept  Stage Fright     a closed red curtain under a gold pelmet                  one eye round the curtain   red pleats, gold, a face in the gap
//  kept  Strongman        a red dumbbell held up at arm's length                    one-handed, twirling        leopard leotard, skin, red weights
//  kept  Jester           a hat drooping to both sides, a bell on every point       grinning at the king        red and green motley, white face, gold bells
//  kept  Circus Wagon     a cage on spoked wheels, a lion's face between the bars   travelling to the next town blue wagon, gold bars and wheels, orange mane
//  cut   Human Cannonball built twice: a barrel at 35-40 degrees is a 1-cube staircase, and at 40 px
//                         it read as a red worm (then as a red blob with the wheel on it)
//  cut   Ventriloquist's Dummy built: a red-haired head on a blue jacket; at 40 px a boy,
//                         the hinged jaw too small to tell
//  out   Seal and Ball    Sea Lion & Ball exists
//  out   Crystal Ball     the storm only shows on the surface, and a ball on a base is the Snow Globe's outline
//  out   Ringmaster's Hat a top hat is the Rabbit in a Hat's; the whip is a 1-cube line
//  out   Juggling Bear    the balls would float, and Drummer Bear and Teddy Bear exist
//  out   Cobra Basket     Cobra in a Basket exists
//  out   Dove from a Sleeve  a sleeve and a glove need a caption
//  out   Clown head       the Jester does the face better, and its hat sets the outline
//  out   Fire-breather, Tightrope, Trapeze, Stilts, Plate Spinning  thin figures and poles
//  out   Sword Box        the same gag as Sawn in Half, and swords stuck through read as a hedgehog
//  out   Bed of Nails     Sawn in Half's layout again
//  out   Big Top          Striped Tent's outline
//  out   Magic Lamp       Genie and Magic Carpet & Lamp exist
// Learns from: Sawn in Half and Clown Car, the Rabbit in a Hat (the act's
// container is the joke, someone peeking out of it) and Chicken Crossing
// (one moment, dry); Circus Elephant, the Akabeko and Pegasus Foal (an
// animal as a frontal icon, the identity at full width); Theatre Masks, the
// Fox Mask (a face with no head) and the Jumping Jack (a flat symmetric
// icon); Stage Fright, the Rabbit in a Hat (a face over the edge of the
// thing); Strongman, the Cymbal Monkey (the prop held out sets the outline);
// Jester, the Troll Doll (the hat sets the outline) and the Nutcracker (a
// toy-like face); Circus Wagon, Baba Yaga's Hut and the Raccoon in a Bin (a
// creature at home in its box). Faces and details look toward +z / +x.
import { grid } from '../voxel.js';
import { INK, tint, sheet } from './kit.js';

// Flat material colours: the game's light does the shading.
const gold = 0xf2c14e,
  boxBlue = 0x4a7fd6, plinth = 0x8a5a3a, steel = 0xd8dde8, sawHandle = 0xc0502c, skin = 0xf0b98c, auburn = 0xc8502c, lips = 0xe0434b,
  carYellow = 0xf6c63a, tyre = 0x4a3a4a, lamp = 0xfbf3e6, clown = 0xfbf3e6, nose = 0xe0262f,
  hOrange = 0xf2803a, hGreen = 0x7ed05a, hBlue = 0x4fc3e8, hPink = 0xf25fa8,
  drum = 0xe0434b, ele = 0xbab4cc, earPink = 0xf2a0b8, toenail = 0xfbf3e6, fez = 0xd8343c,
  comedy = 0xf2c14e, tragedy = 0x9fb4e8,
  drape = 0xd8343c, pelmet = 0xf2c14e, backstage = 0x3a2a4a,
  leopard = 0xf2a03d, spot = 0x5a3a2a, weight = 0xd8434c, bar = 0xd8dde8, tache = 0x5a3a2a, boot = 0x5a3a2a,
  jRed = 0xe0434b, jGreen = 0x5cb85a, jFace = 0xfbeee0, bell = 0xf2c14e, cheek = 0xf07a8a,
  wagon = 0x4a6fd0, wheel = 0x8a5a3a, mane = 0xe0802c, lion = 0xf6d08a, lionNose = 0x6a3a3a;

export default [
  // Sawn in Half (the magician's box). Identity: a box cut in two, the saw
  // standing up out of the cut, a head out of one end and two feet out of
  // the other. Moment: mid-trick, and she is still smiling. Parts: a blue
  // box with gold stars on a wooden plinth, the steel saw and its red
  // handle; her face looks out along +x.
  (() => {
    const g = grid(10, 9, 3);
    g.box([1, 7], [1, 1], [0, 2], plinth).box([2, 6], [0, 0], [0, 2], plinth).clear(4, 0, 0).clear(4, 0, 2);   // the plinth
    g.box([1, 3], [2, 4], [0, 2], boxBlue).box([5, 7], [2, 4], [0, 2], boxBlue);          // two halves
    g.set(2, 3, 2, gold).set(6, 3, 2, gold);                                              // a star on each
    g.box([4, 4], [2, 4], [1, 1], steel).box([4, 4], [5, 7], [0, 2], steel).clear(4, 7, 0);   // the saw, in the cut
    g.box([4, 4], [7, 8], [2, 2], sawHandle).set(4, 8, 1, sawHandle);                    // its handle
    for (const z of [0, 2]) g.set(0, 3, z, skin).set(0, 4, z, skin).set(0, 5, z, skin);  // two feet, toes up
    g.box([8, 9], [2, 4], [0, 2], skin);                                                  // the head
    g.box([8, 9], [5, 5], [0, 2], auburn).box([8, 8], [2, 4], [0, 0], auburn).box([8, 8], [3, 4], [1, 2], auburn);   // her hair
    g.set(9, 4, 0, INK).set(9, 4, 2, INK).set(9, 2, 1, lips);                             // eyes, a smile
    return g.entry({ id: 'cand-p19-sawn-in-half', name: 'Sawn in Half', fraction: 0.6, seed: 5, story: 'Sawn in half twice nightly. She does the crossword between halves.' });
  })(),

  // Clown Car (the tiny car at the circus). Identity: a pile of clown heads
  // higher than the car is tall, four of them and plainly more inside.
  // Moment: arrived in the ring, nobody out yet. Parts: a yellow car on dark
  // wheels, white faces with red noses, a different hair colour each (each
  // under 5 cubes, so they stay flat; the eyes are kept flat too).
  (() => {
    const g = grid(9, 9, 4);
    sheet(g, [
      '.YYYYYYY.',
      'YYYYYYYYY',
      'YYYYYYYYY',
    ], [0, 3], { Y: carYellow }, 0, 1);                                                   // the car
    for (const x of [1, 2, 6, 7]) for (const z of [0, 3]) g.set(x, 0, z, tyre).set(x, 1, z, tyre);   // wheels
    g.set(8, 2, 1, lamp).set(8, 2, 2, lamp);                                              // the headlamp
    const head = (x0, y0, z0, hair) => {                                                  // a clown: face, eyes, nose, hair
      g.box([x0, x0 + 2], [y0, y0 + 1], [z0, z0 + 1], clown);
      g.set(x0, y0 + 1, z0 + 1, INK).set(x0 + 2, y0 + 1, z0 + 1, INK).set(x0 + 1, y0, z0 + 2, nose);
      g.box([x0, x0 + 2], [y0 + 2, y0 + 2], [z0, z0], hair).set(x0, y0 + 2, z0 + 1, hair).set(x0 + 2, y0 + 2, z0 + 1, hair).clear(x0 + 1, y0 + 2, z0);
    };
    head(3, 5, 0, hGreen);                                                                // the back row
    head(0, 4, 2, hOrange); head(5, 4, 2, hPink);                                         // the front row
    head(3, 7, 1, hBlue);                                                                 // and one on top
    return g.entry({ id: 'cand-p19-clown-car', name: 'Clown Car', fraction: 0.6, seed: 9, lit: { keep: [INK] }, story: 'Built for two. Nobody has ever counted how many get out.' });
  })(),

  // Circus Elephant (on her drum). Identity: ears out at full width, the
  // trunk raised up over the top of the head. Moment: sat up on the drum,
  // front feet together, trunk up for applause. Parts: lavender grey (light
  // against the plum sky), a red drum with a gold rim and star, pink inside
  // the ears; a little red fez, worn at an angle.
  (() => {
    const g = grid(9, 10, 4);
    g.box([1, 7], [0, 2], [0, 3], drum);                                                  // the drum, round-cornered
    for (const [x, z] of [[1, 0], [7, 0], [1, 3], [7, 3]]) g.clear(x, 0, z).clear(x, 1, z).clear(x, 2, z);
    tint(g, (x, y) => y === 2, gold);                                                     // its gold rim
    g.set(4, 1, 3, gold);                                                                 // a star
    g.box([2, 6], [3, 4], [0, 2], ele);                                                   // the body, sitting
    for (const x of [2, 6]) g.set(x, 3, 3, toenail).set(x, 4, 3, ele);                    // front feet, toenails
    g.box([2, 6], [5, 8], [0, 2], ele).clear(2, 8, 0).clear(6, 8, 0).clear(2, 8, 2).clear(6, 8, 2);   // the head
    for (const [xo, xi] of [[0, 1], [8, 7]]) {                                            // ears, out wide
      g.box([xo, xo], [4, 8], [1, 1], ele).box([xi, xi], [4, 8], [1, 1], ele);
      g.clear(xo, 8, 1).clear(xo, 4, 1);
      g.box([xi, xi], [5, 7], [1, 1], earPink);
    }
    g.set(3, 7, 2, INK).set(5, 7, 2, INK);                                                // eyes
    g.box([4, 4], [4, 8], [3, 3], ele).set(4, 9, 3, ele).set(4, 9, 2, ele);               // the trunk, up and over
    g.set(5, 9, 1, fez);                                                                  // the fez
    return g.entry({ id: 'cand-p19-circus-elephant', name: 'Circus Elephant', fraction: 0.65, seed: 4, story: 'She never forgets a cue. Or anyone who laughed at the hat.' });
  })(),

  // Theatre Masks (comedy and tragedy). Identity: two faces side by side,
  // one smiling and one not, the smiling one in front. Moment: the sign
  // over every stage door. Parts: gold comedy, pale blue tragedy (apart in
  // lightness as well as hue); dark eyes and mouths.
  (() => {
    const g = grid(10, 8, 3);
    sheet(g, [
      '.TTTT.',
      'TTTTTT',
      'TdTTdT',
      'TTTTTT',
      'TddddT',
      'dTTTTd',
      '.TTTT.',
    ], [0, 1], { T: tragedy, d: INK }, 4, 0);                                             // tragedy, behind and lower
    sheet(g, [
      '.CCCC.',
      'CCCCCC',
      'CdCCdC',
      'CCCCCC',
      'dCCCCd',
      'CddddC',
      '.CCCC.',
    ], [1, 2], { C: comedy, d: INK }, 0, 1);                                              // comedy, in front
    return g.entry({ id: 'cand-p19-theatre-masks', name: 'Theatre Masks', fraction: 0.7, seed: 2, story: 'One of them got the good review. They no longer share a dressing room.' });
  })(),

  // Stage Fright. Identity: a closed red curtain in pleats under a gold
  // pelmet. Moment: five minutes to curtain, one eye round the gap, two
  // hands holding it shut. Parts: red pleats (alternate columns stand
  // forward), a scalloped gold pelmet, the dark gap backstage; a face.
  (() => {
    const g = grid(9, 8, 3);
    g.box([0, 8], [0, 6], [0, 0], drape);                                                 // the curtain
    for (let x = 0; x < 9; x += 2) g.box([x, x], [1, 5], [1, 1], drape);                  // its pleats
    g.box([0, 8], [7, 7], [0, 2], pelmet).box([0, 8], [6, 6], [0, 1], pelmet);            // the pelmet
    for (let x = 1; x < 9; x += 2) g.clear(x, 6, 1);                                      // scalloped
    g.box([4, 4], [0, 5], [0, 1], 0).box([4, 4], [0, 5], [0, 0], backstage);              // the gap
    g.box([4, 4], [2, 4], [1, 2], skin).set(4, 4, 2, INK);                                // a face in it, one eye
    g.set(5, 3, 1, skin).set(3, 3, 1, skin);                                              // hands on the curtain
    return g.entry({ id: 'cand-p19-stage-fright', name: 'Stage Fright', fraction: 0.65, seed: 1, story: 'Five minutes to curtain. He has counted the audience. Twice.' });
  })(),

  // Strongman. Identity: a red dumbbell held up at arm's length, setting the
  // top right. Moment: lifted one-handed, the other hand twirling the
  // moustache. Parts: a leopard leotard (a pattern, so the softer light),
  // skin, red weights on a steel bar; a dark moustache and boots.
  (() => {
    const g = grid(9, 10, 3);
    sheet(g, [
      '....WW.WW',
      '....WWBWW',
      '.HHH..A..',
      '.HHH..A..',
      'AMMMM.A..',
      'A.LLLLA..',
      '.LLLLL...',
      '.LLLLL...',
      '.S...S...',
      'KK...KK..',
    ], [0, 2], { W: weight, B: bar, A: skin, H: skin, L: leopard, K: boot, M: tache, S: skin });
    g.set(1, 7, 2, INK).set(3, 7, 2, INK);                                                // eyes
    tint(g, (x, y, z) => g.cell(x, y, z) === leopard && (x + 2 * y + z) % 4 === 0, spot);   // leopard spots
    return g.entry({ id: 'cand-p19-strongman', name: 'Strongman', fraction: 0.65, seed: 7, lit: { span: 2 }, story: 'He lifts it with one hand. The other is for the moustache.' });
  })(),

  // Jester. Identity: the hat, drooping out to both sides with a gold bell
  // on each point and one on top. Moment: grinning at the king. Parts: red
  // and green motley split down the middle, a white face with rosy cheeks
  // and a grin; a pointed collar to match.
  (() => {
    const g = grid(9, 9, 4);
    sheet(g, [
      '....B....',
      '...RRG...',
      'RRRRRGGGG',
      'R.FFFFF.G',
      'B.FFFFF.B',
      '..FFFFF..',
      '..FFFFF..',
      '.RRRBGGG.',
      '.R.R.G.G.',
    ], [1, 2], { R: jRed, G: jGreen, F: jFace, B: bell });                               // hat, face, collar
    g.box([2, 6], [2, 5], [0, 3], jFace).box([2, 6], [6, 6], [0, 3], (x) => (x < 5 ? jRed : jGreen));   // the head, the hatband
    g.box([1, 7], [1, 1], [0, 3], (x) => (x < 4 ? jRed : x > 4 ? jGreen : bell));        // the collar, all round
    g.set(3, 4, 3, INK).set(5, 4, 3, INK).set(2, 3, 3, cheek).set(6, 3, 3, cheek);        // eyes, cheeks
    g.set(3, 3, 3, INK).set(4, 2, 3, INK).set(5, 3, 3, INK);                              // the grin
    return g.entry({ id: 'cand-p19-jester', name: 'Jester', fraction: 0.65, seed: 1, story: 'Paid to tell the king the truth, as long as it rhymes.' });
  })(),

  // Circus Wagon (the beast wagon). Identity: a cage on spoked wheels, a
  // lion's face between the bars. Moment: on the road to the next town, the
  // lion looking out. Parts: a blue wagon with a gold crest and trim, gold
  // bars and hubs, wooden wheels; an orange mane round a pale face.
  (() => {
    const g = grid(9, 9, 4);
    g.box([0, 8], [3, 3], [0, 3], wagon).box([0, 8], [7, 7], [0, 3], wagon).box([0, 8], [4, 6], [0, 0], wagon);   // floor, roof, back
    g.box([0, 0], [4, 6], [0, 3], wagon).box([8, 8], [4, 6], [0, 3], wagon);              // the ends
    g.box([3, 5], [8, 8], [1, 2], gold).box([0, 8], [7, 7], [3, 3], gold);                // crest and trim
    for (const z of [0, 3]) for (const x0 of [0, 5]) {                                    // spoked wheels
      g.box([x0, x0 + 3], [0, 3], [z, z], wheel).clear(x0, 0, z).clear(x0 + 3, 0, z).clear(x0, 3, z).clear(x0 + 3, 3, z);
      g.box([x0 + 1, x0 + 2], [1, 2], [z, z], gold);
    }
    for (const x of [2, 6]) g.box([x, x], [4, 6], [3, 3], gold);                          // the bars
    g.box([2, 6], [4, 6], [2, 2], mane).box([3, 5], [4, 6], [1, 1], mane);                // the mane
    g.box([3, 5], [4, 5], [2, 3], lion).box([3, 5], [6, 6], [3, 3], mane);                // the face, between the bars
    g.set(3, 5, 3, INK).set(5, 5, 3, INK).set(4, 4, 3, lionNose);                         // eyes, nose
    return g.entry({ id: 'cand-p19-circus-wagon', name: 'Circus Wagon', fraction: 0.65, seed: 7, story: 'The lion travels first class. Nobody has ever asked to share.' });
  })(),
];
