// Page 15 · II The Sea Below: for The Deep, the sea below the sea. Lanterns,
// armour and slow lives far from the light. Four creatures with all the
// time in the world (a little sea dragon minding the Dragon King's pearl, a
// silver hatchetfish with lamps down its keel, a kraken pup keeping the
// ship it found, an ocean sunfish in no hurry), and four things that fell
// from the world above and were kept: a knight's helm with an anemone for a
// plume, Urashima's lacquered box with its cord still tied, a sea king's
// trident left in a rock, and a gold chalice a fish sleeps in.
// Bold blocks of one colour each, faces turned to the viewer; the gold is
// lit from the upper left on the dithered ramp, like the Heart amulet.
// Sky: Deep.
import { grid } from '../voxel.js';
import { INK, BLUSH, S, pair, pairFront, pairFrontAt, tint, onSurface, lathe, sheet, ramp, flank } from './kit.js';

const { glow, stone, stoneDk, sand, moss } = S;
const jade = 0x3fa88a, jadeLt = 0x6cc8a4, belly = 0xf6e6b8, mane = 0xe0565b, pearlLt = 0xffffff,
  silver = 0xd3dbe2, silverDk = 0x98a6b4, steelBack = 0x4f6075,
  steel = 0xb4c0cc, brass = 0xe9b949, anemone = 0xf06f96, anemoneLt = 0xf8b0c4, fish = 0xf2803d,
  lacquer = 0xc23b3b, lacquerDk = 0x8f2a30, black = 0x2e2836, cord = 0x9b6fd6, smoke = 0xf2f6f8,
  kraken = 0x8a64c8, krakenLt = 0xb48ce8, hull = 0x8a5a3c, sail = 0xfbf8f2,
  mola = 0x9fb4c4, molaLt = 0xdfe8ee, molaDk = 0x6f8496,
  pearl = 0xe8f6f4, coral = 0xf08a6c, ruby = 0xe0565b, sapphire = 0x5b8fd6;
const GOLD = [0x8a5a1e, 0xb07a2a, 0xd9a43a, 0xf0c45a, 0xfbe7a6];

export default [
  // a little sea dragon curled round the Dragon King's pearl on the sea
  // floor: a jade coil, a cream belly, gold horns and whiskers, a red mane,
  // its head up behind the pearl and its eyes on you
  (() => {
    const g = grid(9, 8, 9);
    const d = (x, z) => Math.hypot(x - 4, z - 4);
    g.box([0, 8], [0, 1], [0, 8], (x, y, z) => (d(x, z) >= 2 && d(x, z) <= 3.5 ? (y === 0 ? belly : jade) : undefined));   // the coil
    g.box([0, 8], [2, 2], [0, 8], (x, y, z) => (d(x, z) >= 2 && d(x, z) <= 3.2 && z <= 4 ? jade : undefined));      // and its second turn
    g.ellipsoid([4, 2.2, 4], [1.5, 1.6, 1.5], pearl).set(3, 3, 4, pearlLt).set(3, 3, 3, pearlLt);                 // the pearl
    g.box([4, 4], [3, 3], [1, 1], jade);                                                 // the neck, up from the back
    g.box([3, 5], [4, 6], [1, 3], jade).box([3, 5], [4, 5], [4, 4], jadeLt);             // the head, its snout over the pearl
    g.set(4, 4, 4, belly);
    pairFrontAt(g, 4, 3, 6, INK);                                                        // eyes on you
    g.set(3, 7, 1, brass).set(5, 7, 1, brass).set(3, 7, 2, brass).set(5, 7, 2, brass);  // horns
    g.set(2, 4, 4, brass).set(6, 4, 4, brass);                                           // whiskers
    g.box([3, 5], [5, 6], [0, 0], mane).set(4, 7, 1, mane);                              // the mane
    g.set(7, 1, 5, mane).set(7, 1, 6, mane).set(7, 2, 6, mane);                          // the tail tuft
    return g.entry({ id: 'cand-p15-sea-dragon', name: 'Sea Dragon & Pearl', story: "It was asked to mind the Dragon King's pearl for an afternoon. It is still minding it." });
  })(),

  // a hatchetfish side on: a thin silver blade of a fish, deep in the keel
  // and dark along the back, a row of lamps down its belly to hide its
  // shadow, and a big eye looking up
  (() => {
    const g = grid(10, 8, 3);
    const rows = [
      '......d...',
      't..dddddd.',
      'tttsssssss',
      'tt.sssssss',
      't...ssssss',
      '.....sssss',
      '......ssss',
      '.......ss.',
    ];
    sheet(g, rows, [1, 1], { d: steelBack, s: silver, t: silverDk });
    sheet(g, rows, [0, 2], { s: silver, d: steelBack });
    tint(g, (x, y, z) => y <= 4 && !g.get(x, y - 1, z), glow);                          // lamps along the keel
    flank(g, 8, 5, INK); flank(g, 8, 6, steelBack);                                     // the eye, looking up
    return g.entry({ id: 'cand-p15-hatchetfish', name: 'Hatchetfish', story: 'It carries its own lamps, turned down, so nothing below can see it.' });
  })(),

  // a kraken pup on the sea floor, its arms spread round it and one of them
  // curled up to hold the little ship it found, sail and all
  (() => {
    const g = grid(10, 7, 9);
    lathe(g, [4, 4], 0, [2.2, 2.0], kraken);
    for (const [dx, dz] of [[-1, 0], [0, 1], [0, -1]]) {                                 // arms spread round it
      for (let r = 2; r <= 4; r++) g.set(4 + dx * r, 0, 4 + dz * r, kraken);
      g.set(4 + dx * 4, 1, 4 + dz * 4, krakenLt);                                        // tips curled up
    }
    for (const [sx, sz] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) {
      for (const [a, b] of [[2, 1], [2, 2], [3, 2], [3, 3]]) g.set(4 + sx * a, 0, 4 + sz * b, kraken);
      g.set(4 + sx * 3, 1, 4 + sz * 3, krakenLt);
    }
    g.ellipsoid([4, 3.8, 4], [2.3, 2.3, 2.3], kraken);                                   // the head
    tint(g, (x, y) => y >= 5, krakenLt);
    pairFrontAt(g, 4, 3, 4, INK); pairFrontAt(g, 4, 2, 3, BLUSH);                       // a face
    g.set(7, 1, 4, kraken).set(8, 1, 4, kraken);                                         // the arm holding up
    g.box([7, 9], [2, 2], [4, 4], hull).set(8, 3, 4, sail).set(8, 4, 4, sail).set(9, 3, 4, sail).set(8, 5, 4, ruby);   // its ship
    return g.entry({ id: 'cand-p15-kraken-pup', name: 'Kraken Pup', story: 'It found a ship on the sea floor and has decided to keep it.' });
  })(),

  // an ocean sunfish side on: a great round grey disc of a fish with a tall
  // fin above and below, a frill for a tail, a pale belly and a small,
  // patient face
  (() => {
    const g = grid(8, 10, 3);
    g.ellipsoid([4.3, 4.5, 1], [3.3, 3.0, 1.4], mola);
    tint(g, (x, y) => y <= 3, molaLt);
    for (const [x, y] of [[3, 8], [2, 8], [2, 9], [1, 9]]) g.set(x, y, 1, molaDk);        // the fin above, swept back
    for (const [x, y] of [[3, 1], [2, 1], [2, 0], [1, 0]]) g.set(x, y, 1, molaDk);        // the fin below
    g.box([0, 1], [3, 6], [1, 1], molaDk);                                               // the frill of a tail
    flank(g, 6, 5, INK); flank(g, 6, 4, BLUSH);
    g.set(7, 4, 1, molaDk);
    return g.entry({ id: 'cand-p15-sunfish', name: 'Ocean Sunfish', story: 'It is the size of a small boat and has never once been in a hurry.' });
  })(),

  // a knight's great helm sunk in the sand: a flat-topped steel bucket with
  // a cross for its eye-slit and breath, a gold crown round the top, a pink
  // anemone where the plume used to be, and a little fish swimming out
  (() => {
    const g = grid(7, 9, 7);
    lathe(g, [3, 3], 0, [3.3], sand);
    g.box([1, 5], [1, 6], [1, 5], steel).box([2, 4], [7, 7], [2, 4], steel);
    for (const x of [1, 5]) for (const z of [1, 5]) for (let y = 1; y <= 6; y++) g.clear(x, y, z);   // rounded corners
    tint(g, (x, y, z) => y === 6 && onSurface(g, x, y, z), brass);                       // the crown
    for (const [x, z] of [[2, 1], [4, 1], [2, 5], [4, 5], [1, 2], [1, 4], [5, 2], [5, 4]]) g.set(x, 7, z, brass);
    for (let x = 2; x <= 4; x++) g.set(x, 4, 5, INK);                                    // the eye-slit
    g.set(3, 3, 5, INK).set(3, 2, 5, INK);                                               // the breath
    g.set(3, 8, 3, anemone).set(2, 8, 3, anemoneLt).set(4, 8, 3, anemoneLt).set(3, 8, 2, anemoneLt).set(3, 8, 4, anemoneLt);   // the plume
    g.set(4, 4, 6, fish).set(5, 4, 6, fish).set(5, 5, 6, INK);                          // a fish swimming out
    return g.entry({ id: 'cand-p15-knights-helm', name: "Knight's Helm", story: 'The knight never came back for it. The anemone moved in that spring.' });
  })(),

  // Urashima's box from the palace under the sea: red lacquer, a black lid
  // with a gold rim, a purple cord tied in a bow on top, and the thinnest
  // wisp of white getting out at one corner
  (() => {
    const g = grid(7, 9, 7);
    g.box([1, 5], [0, 3], [1, 5], lacquer);
    tint(g, (x, y) => y === 0, lacquerDk);
    g.box([0, 6], [4, 4], [0, 6], brass).box([1, 5], [5, 5], [1, 5], black);           // lid and rim
    tint(g, (x, y, z) => onSurface(g, x, y, z) && (x === 3 || z === 3), cord);        // the cord
    g.set(3, 6, 3, cord).set(2, 6, 3, cord).set(4, 6, 3, cord).set(2, 7, 3, cord).set(4, 7, 3, cord);   // the bow
    g.set(6, 5, 6, smoke).set(6, 6, 6, smoke).set(6, 7, 6, smoke).set(5, 7, 6, smoke).set(5, 8, 6, smoke);   // a wisp
    return g.entry({ id: 'cand-p15-urashimas-box', name: "Urashima's Box", story: 'The princess asked him never to open it. He almost managed.' });
  })(),

  // a sea king's trident standing in a mossy rock: gold, three long prongs,
  // a pearl at the crossbar, and a little coral growing at its foot
  (() => {
    const g = grid(7, 10, 5);
    g.ellipsoid([3, 0.4, 2], [3.3, 2.0, 2.3], stone);
    tint(g, (x, y, z) => !g.get(x, y + 1, z) && y >= 2, moss);
    tint(g, (x, y, z) => y === 0, stoneDk);
    const gold = (x, y) => ramp(GOLD, ((6 - x) + y) / 15, x, y);
    for (let y = 2; y <= 6; y++) g.set(3, y, 2, gold(3, y));                            // the shaft
    for (let x = 0; x <= 6; x++) g.set(x, 6, 2, gold(x, 6));                            // the crossbar
    for (const x of [0, 3, 6]) for (let y = 7; y <= (x === 3 ? 9 : 8); y++) g.set(x, y, 2, gold(x, y));   // prongs
    g.set(3, 6, 3, pearl);
    g.set(1, 2, 3, coral).set(1, 3, 3, coral).set(0, 3, 3, coral).set(1, 4, 3, coral);  // coral
    return g.entry({ id: 'cand-p15-trident', name: 'Trident', story: 'The sea king left it here and went to see about something. That was a while ago.' });
  })(),

  // a gold chalice upright on the sea floor: a wide foot, a stem with a knot,
  // a cup set with a ruby and a sapphire, and a small fish asleep inside
  (() => {
    const g = grid(7, 9, 7);
    const gold = (x, y, z) => ramp(GOLD, ((6 - x) + y + z / 2) / 16, x, y);
    lathe(g, [3, 3], 0, [2.6, 1.4, 0.6, 1.2, 0.6, 1.6, 2.4, 2.8, 2.8], gold);
    const d2 = (x, z) => (x - 3) ** 2 + (z - 3) ** 2;
    for (let y = 7; y <= 8; y++) for (let x = 0; x < 7; x++) for (let z = 0; z < 7; z++)   // the bowl
      if ((y === 8 && d2(x, z) <= 4) || (y === 7 && d2(x, z) <= 2)) g.clear(x, y, z);
    g.set(3, 6, 6, ruby).set(6, 6, 3, sapphire);                                        // jewels
    g.set(2, 7, 3, fish).set(3, 7, 3, fish).set(4, 7, 3, fish).set(2, 8, 3, fish);      // asleep inside, tail up
    return g.entry({ id: 'cand-p15-chalice', name: 'Sunken Chalice', story: 'A king drank from it once. Now a small fish sleeps in it.' });
  })(),
];
