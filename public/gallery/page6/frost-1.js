// Page 6 · Frost Peaks (IX): thin air, deep snow, warm breath. Creatures in
// winter coats (each with one warm or bright note so they don't vanish
// into the pale sky) and the shelters people make up here: an igloo, a
// hut under a snow-loaded roof, a sled packed for the trip, a gondola, an
// ice crystal kept as a shrine. The igloo, the hut and the shrine hide a
// warm or cold light inside for peeling to find.
//
// Bonsai rules (page5/home-1.js): one strong base, 2-3 masses at different
// heights, a characterful connecting part, 3-5 colours with a job each,
// holes that mean something. Faces look toward +z.
import { grid } from '../voxel.js';
import { INK, front, frontZ, out, pair, pairFront, quad, kawaii, tint, sheet } from './kit.js';

const snow = 0xf6f9fd, snowShade = 0xdbe7f3, ice = 0xbfe6f7, iceLight = 0xe6f6fd, iceGlow = 0x6fd8f0, glowIce = 0xfbe3a0,
  fox = 0xf7f8fb, foxShade = 0xcfdae8, earPink = 0xf5b3c0, scarf = 0xd9453f, scarfStripe = 0xf6efe4,
  husky = 0x76849a, huskyWhite = 0xf6f7f9, huskyEye = 0x4fb0f0, collar = 0xe9b949,
  yak = 0x5a4234, yakFace = 0xf3eee4, yakSkirt = 0x43312a, horn = 0xf3e2b0, muzzle = 0x8a6a55, rug = 0xc0392b, rugGold = 0xe9b949, rugBlue = 0x3f6fc6,
  pika = 0xc9a27e, pikaEar = 0xa8825e, stem = 0x6fae5a, flowerA = 0xb68ae0, flowerB = 0xf6d365,
  goat = 0xf3f1ea, goatHorn = 0x6b6157, rock = 0x8a8f99, rockLight = 0xa9afb8,
  ermine = 0xfbfbfd, tailTip = 0x2f2a36,
  chick = 0xb4bcc6, chickCap = 0x2f3440, chickFace = 0xfbfbfd, floe = 0xcfe6f5,
  wood = 0x8a5a3c, woodDark = 0x5a3b30, runner = 0xd2453c, amber = 0xf8d77a, rugWarm = 0xe07a4a,
  stone = 0x9aa3ad, shutter = 0xd2453c, log = 0xb07a50, logEnd = 0xe0b483,
  mitten = 0xd2453c, cuff = 0xf3ead8, knit = 0xfbf8f2,
  straw = 0xd9b76a, paper = 0xfbf8f2,
  cabin = 0xd2453c, cabinRoof = 0x5d6670, cable = 0x5d6670, skis = 0xf6d365, bench = 0x8a5a3c;

export default [
  // an arctic fox sitting in the snow in a red scarf, its huge blue-grey
  // shadowed tail wrapped round to the front like a muff
  (() => {
    const g = grid(7, 8, 7);
    g.ellipsoid([3, 1.6, 2.4], [2.1, 1.9, 1.7], fox)
      .ellipsoid([3, 4.5, 3.0], [2.2, 1.5, 1.7], fox);
    pair(g, 1, 6, 3, fox); pair(g, 2, 6, 3, earPink); pair(g, 1, 7, 3, fox);        // ears
    tint(g, (x, y) => y === 3, scarf);
    out(g, 2, 3, scarf);
    { const z = frontZ(g, 2, 3); g.set(2, 2, z, scarf).set(2, 1, z, scarfStripe).set(2, 0, z, scarf); }   // the scarf's tail
    pairFront(g, 2, 5, INK);
    out(g, 3, 4, INK);                                                               // nose
    g.ellipsoid([4.8, 0.9, 3.6], [1.9, 1.2, 2.9], (x, y, z) => (g.get(x, y, z) ? undefined : z >= 6 ? fox : foxShade));   // the tail, round the right to the front
    pair(g, 2, 0, 3, foxShade);                                                      // paws
    return g.entry({ id: 'cand-p6-arctic-fox', name: 'Arctic Fox' });
  })(),

  // a husky pup: grey saddle, white mask, the ice-blue eyes, ears up, a
  // gold collar and a tail curled over its back
  (() => {
    const g = grid(7, 8, 6);
    g.ellipsoid([3, 1.8, 2.4], [2.1, 1.8, 1.8], husky)
      .ellipsoid([3, 4.6, 3.0], [2.3, 1.7, 1.8], husky);
    tint(g, (x, y, z) => z >= 3 && y <= 2, huskyWhite);                            // white chest
    for (const x of [1, 2, 3, 4, 5]) for (const y of [3, 4]) front(g, x, y, huskyWhite);   // the mask
    front(g, 3, 5, huskyWhite); pairFront(g, 2, 6, huskyWhite);                      // blaze and brows
    pairFront(g, 2, 5, huskyEye);
    out(g, 3, 4, INK);
    pair(g, 1, 6, 3, husky); pair(g, 1, 7, 3, husky); pair(g, 2, 6, 3, earPink);    // ears
    tint(g, (x, y, z) => y === 3 && z <= 2, collar);
    g.set(3, 2, 0, husky).set(3, 3, 0, husky).set(3, 4, 0, husky).set(3, 4, 1, huskyWhite);   // the curled tail
    pair(g, 2, 0, 3, huskyWhite); pair(g, 2, 0, 4, huskyWhite);                      // front paws
    return g.entry({ id: 'cand-p6-husky-pup', name: 'Husky Pup' });
  })(),

  // a yak calf: a shaggy skirt to the ground, cream horns, and a red
  // saddle rug with a gold border and a blue stripe
  (() => {
    const g = grid(7, 7, 9);
    g.ellipsoid([3, 3.4, 3.6], [2.6, 2.0, 3.2], yak);
    for (let z = 1; z <= 6; z++) for (let x = 0; x <= 6; x++) if (((x - 3) / 3.1) ** 2 + ((z - 3.6) / 3.0) ** 2 <= 1) g.box([x, x], [1, 2], [z, z], yakSkirt);
    quad(g, 1, 0, 1, yakSkirt); quad(g, 1, 0, 5, yakSkirt);                          // hooves peeping out
    g.clear(1, 0, 7).clear(5, 0, 7).clear(1, 0, 1).clear(5, 0, 1);
    pair(g, 2, 0, 2, yakSkirt); pair(g, 2, 0, 5, yakSkirt);
    g.box([2, 4], [2, 4], [7, 8], yak).box([2, 4], [3, 4], [8, 8], yakFace).box([2, 4], [2, 2], [8, 8], muzzle);   // head, white-faced
    pairFront(g, 2, 4, INK);
    pair(g, 1, 4, 7, horn); pair(g, 0, 4, 7, horn); pair(g, 0, 5, 7, horn);          // horns
    for (let z = 2; z <= 5; z++) for (let x = 1; x <= 5; x++) {
      for (let y = 6; y >= 0; y--) if (g.get(x, y, z)) { g.set(x, y, z, z === 2 || z === 5 || x === 1 || x === 5 ? rugGold : x === 3 ? rugBlue : rug); break; }
    }
    g.set(3, 3, 0, yakSkirt).set(3, 2, 0, yakSkirt);                                 // tail
    return g.entry({ id: 'cand-p6-yak', name: 'Yak' });
  })(),

  // a pika, round as a pebble, carrying home a mouthful of flowers and
  // grass for its winter haypile
  (() => {
    const g = grid(7, 6, 6);
    g.ellipsoid([3, 2.2, 2.6], [2.4, 2.2, 2.2], pika);
    pair(g, 1, 4, 2, pikaEar); pair(g, 1, 5, 2, pikaEar); pair(g, 2, 5, 2, pikaEar); pair(g, 2, 5, 3, earPink);   // round ears
    kawaii(g, 2, 3, { bx: 1, by: 2 });
    g.box([1, 5], [1, 1], [5, 5], stem);                                             // the bundle across its mouth
    g.set(0, 1, 5, stem).set(0, 2, 5, flowerA).set(6, 1, 5, flowerB).set(6, 2, 5, flowerB).set(5, 2, 5, flowerA);
    pair(g, 2, 0, 4, pikaEar);                                                       // paws
    return g.entry({ id: 'cand-p6-pika', name: 'Pika' });
  })(),

  // a mountain goat kid on a snow-capped crag: a shaggy white coat, a
  // beard, two short black horns sweeping back
  (() => {
    const g = grid(7, 9, 7);
    g.box([0, 6], [0, 0], [0, 6], rock).box([1, 5], [1, 1], [0, 5], rockLight).box([1, 5], [2, 2], [1, 5], rock).box([2, 4], [3, 3], [1, 4], rockLight);
    quad(g, 0, 0, 0, 0); g.clear(6, 0, 3).clear(0, 0, 2);
    for (let z = 0; z < 7; z++) for (let x = 0; x < 7; x++) for (let y = 3; y >= 0; y--) if (g.get(x, y, z)) { if ((x + z) % 3 !== 0) g.set(x, y, z, snow); break; }
    quad(g, 2, 4, 1, goat); g.set(2, 4, 4, goat).set(4, 4, 4, goat).set(2, 4, 1, goat).set(4, 4, 1, goat);   // legs
    g.box([2, 4], [5, 6], [1, 4], goat).box([2, 4], [6, 8], [4, 5], goat);             // body, neck and head
    g.set(3, 5, 5, goat).set(3, 5, 6, goat).set(3, 4, 5, goat);                       // beard
    pairFront(g, 2, 7, INK);
    pair(g, 2, 8, 4, goatHorn); pair(g, 2, 8, 3, goatHorn); pair(g, 2, 7, 3, goatHorn);   // horns sweep back
    pair(g, 1, 7, 5, goat);                                                          // ears
    g.set(3, 6, 0, goat);                                                            // tail
    return g.entry({ id: 'cand-p6-mountain-goat', name: 'Mountain Goat' });
  })(),

  // an ermine in its winter white, sat up on its haunches with its paws
  // tucked, black-tipped tail laid out behind
  (() => {
    const g = grid(5, 9, 5);
    g.ellipsoid([2, 3, 2], [1.6, 2.8, 1.4], ermine)
      .ellipsoid([2, 6.5, 2.4], [1.5, 1.2, 1.4], ermine);
    pair(g, 1, 8, 2, ermine);                                                        // ears
    kawaii(g, 1, 7, { bx: 1, by: 6 });
    out(g, 2, 6, INK);
    pair(g, 1, 4, 3, ermine);                                                        // paws tucked up
    pair(g, 1, 0, 2, ermine);                                                        // feet
    g.set(2, 2, 0, ermine).set(2, 1, 0, ermine).set(2, 0, 0, ermine).set(3, 0, 0, ermine).set(4, 0, 0, tailTip).set(4, 0, 1, tailTip);   // tail
    return g.entry({ id: 'cand-p6-ermine', name: 'Ermine' });
  })(),

  // an emperor penguin chick on an ice floe: grey fluff, a black cap with
  // the white mask, flippers out for balance
  (() => {
    const g = grid(7, 8, 6);
    g.box([0, 6], [0, 0], [0, 5], floe); quad(g, 0, 0, 0, 0);
    g.ellipsoid([3, 3, 2.6], [2.3, 2.3, 2.0], chick)
      .ellipsoid([3, 5.8, 2.8], [2.0, 1.6, 1.7], chickCap);
    for (const x of [1, 2, 3, 4, 5]) for (const y of [5, 6]) front(g, x, y, chickFace);   // the white mask
    front(g, 3, 6, chickCap);
    pairFront(g, 2, 5, INK);
    out(g, 3, 5, INK);                                                               // beak
    pair(g, 0, 3, 3, chick); pair(g, 0, 2, 3, chick);                                // flippers
    pair(g, 2, 1, 4, chickCap);                                                      // feet
    return g.entry({ id: 'cand-p6-penguin-chick', name: 'Penguin Chick' });
  })(),

  // an igloo: a dome of snow blocks laid in courses, a tunnel out to the
  // front, and inside a warm rug and a lamp glowing out of the doorway and
  // through a window of clear ice
  (() => {
    const g = grid(7, 5, 9);
    g.ellipsoid([3, 0, 3], [3.5, 4.2, 3.5], (x, y) => (y === 1 || y === 3 ? snowShade : snow));
    g.ellipsoid([3, 0, 3], [2.0, 3.0, 2.0], 0);
    g.box([2, 4], [0, 2], [5, 8], (x, y) => (y === 1 ? snowShade : snow)).box([3, 3], [0, 1], [5, 8], 0);   // the tunnel
    g.box([2, 4], [0, 0], [1, 4], rugWarm).box([3, 3], [0, 0], [5, 7], rugWarm).set(3, 0, 2, amber).set(3, 1, 2, amber);   // rug and lamp
    g.set(6, 2, 3, glowIce).set(6, 1, 3, glowIce);                                   // ice window, lit from inside
    g.set(3, 4, 3, snowShade);
    return g.entry({ id: 'cand-p6-igloo', name: 'Igloo' });
  })(),

  // a wooden sled with curled red runners, packed for the trip: a bundle
  // of logs strapped on, a lit lantern at the front, the gap underneath
  (() => {
    const g = grid(5, 5, 10);
    for (const x of [0, 4]) g.box([x, x], [0, 0], [0, 9], runner).set(x, 1, 9, runner).set(x, 2, 9, runner).set(x, 2, 8, runner);
    g.box([0, 4], [1, 1], [1, 7], (x, y, z) => (z % 2 ? wood : woodDark));
    g.box([1, 3], [2, 2], [9, 9], woodDark);                                         // the bar across the curls
    g.box([1, 3], [2, 2], [2, 4], log).box([1, 3], [3, 3], [3, 3], log).box([1, 3], [2, 2], [4, 4], logEnd).set(2, 3, 3, logEnd);   // logs
    g.box([1, 3], [2, 2], [1, 1], scarf);                                            // a strap
    g.set(2, 2, 6, woodDark).set(2, 3, 6, amber).set(2, 4, 6, woodDark);             // lantern
    return g.entry({ id: 'cand-p6-sled', name: 'Sled' });
  })(),

  // an alpine hut under a heavy roof of snow: a lit window with red
  // shutters, a stone chimney, logs stacked by the wall and skis leaning
  // on it; the hearth glows inside
  (() => {
    const g = grid(7, 8, 7);
    g.box([1, 5], [0, 3], [1, 5], wood).box([2, 4], [0, 3], [2, 4], 0).set(2, 0, 2, stone).set(2, 1, 2, amber).set(3, 0, 2, stone);   // hollow, a hearth lit at the back
    for (const [y, x0, x1] of [[4, 0, 6], [5, 1, 5], [6, 2, 4]]) g.box([x0, x1], [y, y], [0, 6], woodDark);
    for (let z = 0; z < 7; z++) for (let x = 0; x < 7; x++) for (let y = 6; y >= 4; y--) if (g.get(x, y, z)) { g.set(x, y, z, snow); break; }
    g.box([3, 3], [7, 7], [0, 6], snow);                                             // the ridge, buried
    g.box([2, 4], [4, 6], [5, 5], wood).box([3, 3], [4, 6], [5, 5], wood);            // the gable end
    g.set(3, 2, 5, amber).set(2, 2, 5, shutter).set(4, 2, 5, shutter);
    g.box([2, 2], [0, 1], [5, 5], woodDark);                                         // door
    g.box([5, 5], [6, 7], [2, 2], stone);                                            // chimney
    g.box([6, 6], [0, 1], [2, 4], log).set(6, 0, 3, logEnd).set(6, 1, 2, logEnd);    // log pile
    g.box([0, 0], [0, 3], [4, 4], skis).box([0, 0], [0, 3], [2, 2], skis);           // skis
    return g.entry({ id: 'cand-p6-alpine-hut', name: 'Alpine Hut' });
  })(),

  // a pair of knitted mittens joined by their cord: red with a cream cuff,
  // a knitted white stitch on each, thumbs turned in
  (() => {
    const g = grid(9, 8, 2);
    sheet(g, [
      '.CCCCCCC.',
      '.C.....C.',
      'KKK...KKK',
      'kkk...kkk',
      'RRR...RRR',
      'RWRR.RRWR',
      'RRR...RRR',
      '.R.....R.',
    ], [0, 1], { C: cuff, K: knit, k: cuff, R: mitten, W: knit });
    return g.entry({ id: 'cand-p6-mittens', name: 'Mittens' });
  })(),

  // an ice-crystal shrine: a tall crystal on a stone plinth, bound with a
  // straw rope and paper streamers, two smaller crystals growing beside it,
  // and a cold blue light inside the big one
  (() => {
    const g = grid(7, 9, 7);
    g.box([0, 6], [0, 0], [0, 6], stone); quad(g, 0, 0, 0, 0);
    g.box([1, 5], [1, 1], [1, 5], rock);
    g.box([2, 4], [2, 6], [2, 4], (x, y, z) => ((x === 2 || x === 4) && (z === 2 || z === 4) ? iceLight : ice));
    g.box([3, 3], [7, 7], [2, 4], ice).box([2, 4], [7, 7], [3, 3], ice).set(3, 8, 3, iceLight);
    g.box([3, 3], [2, 5], [3, 3], iceGlow);
    for (let z = 1; z <= 5; z++) for (let x = 1; x <= 5; x++) {
      const edge = x === 1 || x === 5 || z === 1 || z === 5, corner = (x === 1 || x === 5) && (z === 1 || z === 5);
      if (edge && !corner) g.set(x, 5, z, straw);
    }
    g.set(3, 4, 5, paper).set(3, 3, 5, paper).set(5, 4, 3, paper).set(5, 3, 3, paper);   // shide streamers
    g.box([0, 1], [1, 3], [4, 5], ice).set(0, 4, 5, iceLight).set(1, 3, 4, iceLight); // a smaller crystal, back left
    g.box([5, 6], [1, 2], [0, 1], ice).set(6, 3, 0, iceLight);                       // and a little one at the back right
    return g.entry({ id: 'cand-p6-ice-shrine', name: 'Ice Shrine' });
  })(),

  // a gondola on its cable: a red cabin with windows all round, a bench
  // inside, skis racked on its side, hung from the wheel carriage
  (() => {
    const g = grid(7, 9, 5);
    g.box([0, 6], [8, 8], [2, 2], cable).box([2, 4], [7, 7], [2, 2], cabinRoof).set(3, 6, 2, cabinRoof);
    pair(g, 2, 8, 1, cabinRoof); pair(g, 2, 8, 3, cabinRoof);                        // wheels astride the cable
    g.box([1, 5], [0, 4], [0, 4], cabin).box([1, 5], [5, 5], [0, 4], cabinRoof);
    g.box([2, 4], [1, 4], [1, 3], 0);
    g.box([2, 4], [2, 3], [0, 4], 0).box([1, 5], [2, 3], [1, 3], 0);                 // windows all round
    g.box([2, 4], [1, 1], [1, 1], bench);
    g.box([6, 6], [0, 4], [1, 1], skis).box([6, 6], [0, 4], [3, 3], skis);
    return g.entry({ id: 'cand-p6-gondola', name: 'Gondola' });
  })(),
];
