// Page 10 · II Beacon Hills: a fire on the far hill, and it is meant for
// you. A candidate to replace Teatime as chapter II, the call to adventure:
// the hills above home where the signal fires are lit one after another.
// Small, plain things that call you on: a sealed letter, a pennant, a
// beacon, a horn, a watchtower; the hills' messengers (a raven carrying a
// note, a fox carrying the fire, a ram, a phoenix chick); and two shrines,
// the great beacon and the first flame that lights all the others.
// Sky: slate hills going to ember; stone leans cool and fire stays bright.
// Clue settings (fraction, seed) put each card's D where it would sit in
// a chapter II ramp.
import { grid } from '../voxel.js';
import { INK, BLUSH, front, out, frontZ, pair, pairFront, pairZ, quad, kawaii, tint, onSurface, lathe, sheet } from './kit.js';

const stone = 0x9c96a8, stoneLt = 0xbdb7c8, stoneDk = 0x75708a, turf = 0x8aa05a, turfDk = 0x6f8a4a, heather = 0xa77fb0,
  iron = 0x3f3a48, ember = 0xa83a2a, flameRed = 0xe0503a, flameOr = 0xf28a3a, flameYel = 0xf6c84a, flameTip = 0xfff0b0,
  wood = 0x8a5a3c, woodLt = 0xb07a4a, paper = 0xe8d0a6, flap = 0xc49a62, seal = 0xc0302a,
  banner = 0xd9413a, sun = 0xf6c84a, gold = 0xe9b949, raven = 0x2f2a36, sheen = 0x4a4f6a, beakC = 0x6a6574, eyeLt = 0xf6efe4,
  wool = 0xf3eee2, woolSh = 0xe0d9ca, ramFace = 0x4a4250, horn = 0xd8c08a, hornDk = 0xb89a5a,
  fox = 0xe8803a, foxLt = 0xfbefe0, foxDk = 0x3a3442, ivory = 0xf1e6c8, door = 0x6b4a3a,
  chick = 0xf2a03d, chickLt = 0xf6d365, twig = 0x6b4a3a, roofC = 0xa0503a, brass = 0xc9952f, bronze = 0x9a6a3a;

export default [
  // a sealed letter, standing: the flap folded down to a red wax seal,
  // the string tied under it
  (() => {
    const g = grid(7, 5, 3);
    g.box([0, 6], [0, 4], [0, 0], paper);
    g.box([0, 6], [4, 4], [1, 1], flap).box([1, 5], [3, 3], [1, 1], flap).box([2, 4], [2, 2], [1, 1], flap);
    g.set(3, 2, 1, seal).set(3, 2, 2, seal).set(3, 1, 1, seal).set(3, 0, 1, seal);
    return g.entry({ id: 'cand-p10-sealed-letter', name: 'Sealed Letter', fraction: 0.4, seed: 14,
      story: 'Your name is on the front, in handwriting you almost recognise.' });
  })(),

  // a pennant on a pole, its swallow tail out in the wind: red with a gold
  // hill on it, a gold knob on top, a little cairn holding the pole up
  (() => {
    const g = grid(8, 9, 3);
    g.box([0, 2], [0, 0], [0, 2], stoneDk).set(0, 0, 0, 0).set(2, 0, 2, 0).set(1, 1, 0, stone).set(1, 1, 2, stone).set(0, 1, 1, stone);
    g.box([1, 1], [1, 7], [1, 1], wood).set(1, 8, 1, gold);
    sheet(g, ['BBBBBB', 'BBSBB.', 'BSSSB.', 'BBBBB.', 'BBBBBB'], [1, 1], { B: banner, S: sun }, 2, 3);
    return g.entry({ id: 'cand-p10-pennant', name: 'Pennant', fraction: 0.2, seed: 11,
      story: 'It only ever flies one way: toward the hills.' });
  })(),

  // a hill beacon: a stack of stones, an iron basket on top, and the fire
  // in it, red at the embers, yellow at the tip
  (() => {
    const g = grid(5, 8, 5);
    g.box([0, 4], [0, 0], [0, 4], stoneDk); quad(g, 0, 0, 0, 0);
    g.box([1, 3], [1, 2], [1, 3], stone).set(1, 2, 1, stoneLt).set(3, 1, 3, stoneLt);
    g.box([1, 3], [3, 3], [1, 3], iron);
    g.box([0, 4], [4, 4], [0, 4], iron); quad(g, 0, 4, 0, 0);
    g.box([1, 3], [4, 4], [1, 3], ember);
    g.box([1, 3], [5, 5], [1, 3], flameRed).box([2, 2], [5, 5], [1, 3], flameOr).box([1, 3], [5, 5], [2, 2], flameOr).set(2, 5, 2, flameYel);
    g.box([2, 2], [6, 6], [1, 3], flameOr).box([1, 3], [6, 6], [2, 2], flameOr).set(2, 6, 2, flameYel);
    g.set(2, 7, 2, flameTip);
    return g.entry({ id: 'cand-p10-beacon', name: 'Beacon', fraction: 0.5, seed: 1,
      story: 'One fire is lit, and the next hill answers.' });
  })(),

  // a raven come down on a stone with a rolled note in its beak, tied with
  // red; pale eyes so it reads, a blue sheen on its folded wings
  (() => {
    const g = grid(8, 7, 5);
    g.box([1, 5], [0, 1], [1, 3], stone).box([2, 4], [0, 0], [0, 4], stoneDk).set(1, 1, 1, 0).set(5, 1, 3, 0);
    g.box([1, 4], [2, 3], [1, 3], raven).set(1, 2, 1, 0).set(1, 2, 3, 0);
    tint(g, (x, y, z) => (z === 1 || z === 3) && y === 3 && x <= 3, sheen);
    g.box([4, 5], [4, 5], [1, 3], raven).set(5, 3, 2, raven).set(4, 3, 2, raven);
    pairZ(g, 5, 5, 1, eyeLt);
    g.set(6, 5, 2, beakC).set(6, 4, 2, beakC);
    g.box([7, 7], [4, 4], [1, 3], paper).set(7, 4, 2, seal);                        // the note
    g.box([0, 0], [3, 3], [1, 3], raven);                                           // a wedge of a tail
    return g.entry({ id: 'cand-p10-raven', name: 'Messenger Raven', fraction: 0.5, seed: 13,
      story: 'It flew three valleys to bring you one small rolled-up note.' });
  })(),

  // a hill ram on a rock: thick cream wool, a dark face with pale eyes,
  // a horn curled on each side of his head
  (() => {
    const g = grid(7, 7, 5);
    g.box([1, 5], [0, 0], [0, 4], stone); quad(g, 1, 0, 0, 0);
    for (const x of [2, 4]) for (const z of [1, 3]) g.set(x, 1, z, ramFace);
    g.ellipsoid([3, 3, 1.5], [2.4, 1.4, 1.7], wool);
    tint(g, (x, y, z) => onSurface(g, x, y, z) && (Math.abs(x - 3) + y + z) % 3 === 0, woolSh);
    sheet(g, [
      '..www..',
      'HHfffHH',
      'H.efe.H',
      'HHfffHH',
      '..fff..',
    ], [3, 4], { w: wool, H: horn, f: ramFace, e: eyeLt }, 0, 2);
    pair(g, 0, 4, 4, hornDk); pair(g, 1, 3, 4, hornDk);
    return g.entry({ id: 'cand-p10-ram', name: 'Hill Ram', fraction: 0.65, seed: 8,
      story: 'He keeps the high ground, and lets you pass.' });
  })(),

  // a herald's trumpet: a long brass horn with a flared bell, a red banner
  // hung from it with a gold hill and a gold fringe
  (() => {
    const g = grid(8, 5, 3);
    g.box([0, 5], [3, 3], [1, 1], gold).set(0, 3, 1, brass);
    g.box([6, 6], [2, 4], [1, 1], brass).box([6, 6], [3, 3], [0, 2], brass);
    g.box([7, 7], [2, 4], [0, 2], brass).clear(7, 3, 1);                          // the bell, open
    sheet(g, ['BBSB', 'BSSS', 'ffff'], [1, 1], { B: banner, S: sun, f: sun }, 1, 0);
    return g.entry({ id: 'cand-p10-herald-trumpet', name: "Herald's Trumpet", fraction: 0.55, seed: 10,
      story: 'One long note, and every hill for miles turns to listen.' });
  })(),

  // a fox who carries the fire from hill to hill: sitting up, a lit torch
  // held high in one paw, the white tip of its tail curled round its feet
  (() => {
    const g = grid(7, 7, 5);
    g.box([2, 4], [0, 2], [1, 3], fox).box([3, 3], [1, 2], [3, 3], foxLt);
    pair(g, 2, 0, 4, foxLt);                                                    // front paws
    g.box([5, 6], [0, 0], [1, 1], fox).box([6, 6], [0, 0], [2, 3], fox).set(6, 0, 4, foxLt).set(5, 0, 4, foxLt);   // tail round the feet
    g.box([1, 5], [3, 4], [1, 3], fox);
    pair(g, 1, 3, 3, foxLt); g.set(3, 3, 4, foxLt);                              // cheeks, muzzle
    pair(g, 2, 4, 3, INK);
    pair(g, 1, 5, 2, fox); pair(g, 1, 6, 2, foxDk);                              // ears
    g.set(1, 2, 3, fox).box([0, 0], [1, 3], [3, 3], wood).set(0, 4, 3, flameRed).set(0, 5, 3, flameOr).set(0, 6, 3, flameYel);
    return g.entry({ id: 'cand-p10-torch-fox', name: 'Torchbearer Fox', fraction: 0.65, seed: 3,
      story: 'It carries the fire from hill to hill, and never once drops it.' });
  })(),

  // a phoenix chick in a nest of embers: gold and orange down, a flame of a
  // crest, little red wings, a tail plume like a candle
  (() => {
    const g = grid(7, 7, 6);
    lathe(g, [3, 2.5], 0, [1.6, 2.6], twig);
    g.cylinder('y', [3, 2.5], 1.6, [1, 1], ember);
    g.ellipsoid([3, 2.9, 2.5], [1.7, 1.6, 1.5], chick);
    tint(g, (x, y, z) => z >= 3 && y <= 3 && x >= 2 && x <= 4, chickLt);
    kawaii(g, 2, 3, { blush: flameRed });
    out(g, 3, 3, gold);
    pair(g, 1, 3, 2, flameRed); pair(g, 1, 2, 2, flameRed);
    g.set(3, 5, 2, flameRed).set(3, 6, 2, flameOr).set(3, 6, 1, flameYel).set(3, 5, 1, flameOr);
    g.set(3, 3, 1, chick).set(3, 3, 0, flameRed).set(3, 4, 0, flameOr);
    return g.entry({ id: 'cand-p10-phoenix-chick', name: 'Phoenix Chick', fraction: 0.65, seed: 6,
      story: 'Hatched in the embers of a beacon, and still a little warm.' });
  })(),

  // a round watchtower of grey stone: a dark doorway, a window slit, a
  // crenellated top with the fire burning in the middle; inside, a ladder
  (() => {
    const g = grid(5, 9, 5);
    for (let y = 0; y <= 6; y++) { g.box([0, 4], [y, y], [0, 4], y === 2 || y === 5 ? stoneDk : stone); quad(g, 0, y, 0, 0); }
    g.box([1, 3], [1, 5], [1, 3], 0);
    g.clear(2, 0, 4).clear(2, 1, 4).set(2, 0, 3, door);
    g.set(4, 4, 2, iron).set(0, 4, 2, iron);
    g.box([2, 2], [1, 5], [1, 1], wood);
    for (const [x, z] of [[0, 1], [0, 3], [1, 4], [3, 4], [4, 1], [4, 3], [1, 0], [3, 0]]) g.set(x, 7, z, stoneLt);
    g.set(2, 7, 2, flameOr).set(2, 8, 2, flameYel).set(1, 7, 2, flameRed).set(3, 7, 2, flameRed);
    return g.entry({ id: 'cand-p10-watchtower', name: 'Watchtower', fraction: 0.55, seed: 8,
      story: 'Someone up here has been watching the road for you.' });
  })(),

  // shrine: the great beacon, a stepped stone pyramid with a stair up its
  // front and a great fire in a bronze bowl on the summit
  (() => {
    const g = grid(7, 8, 7);
    g.box([0, 6], [0, 0], [0, 6], stoneDk); quad(g, 0, 0, 0, 0);
    g.box([1, 5], [1, 2], [1, 5], (x, y) => (y === 2 ? stoneLt : stone)); quad(g, 1, 2, 1, 0);
    g.box([2, 4], [3, 3], [2, 4], stone);
    g.set(3, 1, 6, stoneLt).set(3, 2, 5, stoneLt).set(3, 3, 4, stoneLt);           // the stair up
    g.box([1, 5], [4, 4], [1, 5], bronze); quad(g, 1, 4, 1, 0);
    g.box([2, 4], [4, 4], [2, 4], ember);
    g.box([2, 4], [5, 5], [2, 4], flameRed).box([3, 3], [5, 5], [2, 4], flameOr).box([2, 4], [5, 5], [3, 3], flameOr).set(3, 5, 3, flameYel);
    g.box([3, 3], [6, 6], [2, 4], flameOr).box([2, 4], [6, 6], [3, 3], flameOr).set(3, 6, 3, flameYel);
    g.set(3, 7, 3, flameTip);
    return g.entry({ id: 'cand-p10-great-beacon', name: 'The Great Beacon', fraction: 0.7, seed: 7,
      story: 'When it is lit, they can see it from the sea.' });
  })(),

  // shrine: the first flame, a round open temple of pale columns under a
  // red dome; on the altar in the middle, the fire every beacon was lit from
  (() => {
    const g = grid(7, 8, 7);
    g.cylinder('y', [3, 3], 3.2, [0, 0], stoneDk);
    g.cylinder('y', [3, 3], 3.2, [1, 3], (x, y, z) => (Math.hypot(x - 3, z - 3) > 2.2 && (x + z) % 2 === 0 ? stoneLt : 0));
    g.cylinder('y', [3, 3], 3.2, [4, 4], (x, y, z) => (Math.hypot(x - 3, z - 3) > 2.2 ? stone : 0));
    g.cylinder('y', [3, 3], 2.6, [5, 5], roofC).cylinder('y', [3, 3], 1.5, [6, 6], roofC).set(3, 7, 3, gold);
    g.set(3, 1, 3, stone).set(3, 2, 3, flameOr).set(3, 3, 3, flameYel);
    return g.entry({ id: 'cand-p10-first-flame', name: 'The First Flame', fraction: 0.65, seed: 2,
      story: 'Every beacon on every hill was lit from this one.' });
  })(),
];
