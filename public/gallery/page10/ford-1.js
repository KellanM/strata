// Page 10 · IV The Ford: the river at the edge of home, the first border
// you cross. A candidate to replace Teatime as chapter II. Small things of
// the crossing: a paper boat sent on ahead, stepping stones, a kingfisher on
// its stake, a bell to call the ferry, a water wheel, a salmon leaping the
// weir, a heron in the shallows, a rope ferry; and two shrines, the old
// humped bridge with its lamp, and the ferryman who takes you over.
// Sky: pale gold to amber, so the water's blue and the heron's grey read.
// Clue settings (fraction, seed) put each card's D where it would sit in
// a chapter II ramp.
import { grid } from '../voxel.js';
import { INK, BLUSH, front, out, frontZ, pair, pairFront, pairZ, quad, kawaii, tint, onSurface, sheet, plan } from './kit.js';

const water = 0x4f93d6, waterLt = 0x7cc0ec, foam = 0xf1f8fd, stone = 0xbdb2a2, stoneDk = 0x948a7c, stoneLt = 0xd8cfc0,
  moss = 0x8cc35a, grass = 0x7cbf5f, grassDk = 0x5c9e4f, reed = 0x9bb86a, reedHead = 0x8a5a3c,
  wood = 0xa8713f, woodDk = 0x6b4a3a, rim = 0xc99a5e, rope = 0xd9b48f, paper = 0xfbf8f2, ruled = 0x8cb4e8, red = 0xe0565b,
  kfBlue = 0x2f8fd0, kfTeal = 0x3fb8c8, kfOrange = 0xf28a3a, kfWhite = 0xfbf8f2,
  salmon = 0xec8f7c, salmonLt = 0xf8dcd0, salmonDk = 0xc0605a, fin = 0xd06858, spot = 0x5a4a50,
  heron = 0xa9b0bc, heronLt = 0xe8ecf2, heronDk = 0x4a4f5a, heronBeak = 0xf2c14e,
  bronze = 0xc9952f, bronzeDk = 0x9a6a2a, glow = 0xf6d365, lily = 0x6aa257, lilyPink = 0xf4a3b5,
  cloak = 0x4a5470, cloakDk = 0x353d55, scarf = 0xd9413a, hood = 0x23202e, eyeGlow = 0xf6e7a0;

export default [
  // a paper boat folded from a ruled page, sent off down the river ahead
  // of you, a ring of ripples round it
  (() => {
    const g = grid(7, 6, 5);
    g.box([0, 6], [0, 0], [0, 4], water); quad(g, 0, 0, 0, 0);
    g.box([1, 5], [0, 0], [1, 3], waterLt);
    g.box([1, 5], [1, 1], [1, 3], paper).box([0, 6], [2, 2], [1, 3], paper).box([1, 5], [2, 2], [2, 2], 0);
    g.box([1, 5], [1, 1], [3, 3], ruled).box([1, 5], [1, 1], [1, 1], ruled);
    sheet(g, ['...p...', '..ppp..', '.ppppp.', '...p...'], [2, 2], { p: paper }, 0, 2);   // the fold standing up
    g.set(3, 4, 2, red);
    return g.entry({ id: 'cand-p10-paper-boat', name: 'Paper Boat', fraction: 0.15, seed: 12,
      story: 'Sent on ahead down the river, to tell them you are coming.' });
  })(),

  // stepping stones across the stream, mossy on top, a lily pad with a
  // pink flower floating beside them
  (() => {
    const g = grid(9, 3, 5);
    g.box([1, 7], [0, 0], [0, 4], water);
    g.box([0, 0], [0, 1], [0, 4], grass).box([8, 8], [0, 1], [0, 4], grass).set(0, 1, 0, 0).set(8, 1, 4, 0);
    for (const [x, z] of [[1, 1], [3, 2], [5, 1], [6, 3]]) g.box([x, x + 1], [1, 1], [z, z + 1], stone);
    g.set(1, 1, 1, moss).set(4, 1, 3, moss).set(6, 1, 1, moss).set(7, 1, 4, stoneDk);
    g.set(3, 0, 4, lily).set(2, 0, 4, lily).set(3, 1, 4, lilyPink);
    return g.entry({ id: 'cand-p10-stepping-stones', name: 'Stepping Stones', fraction: 0.15, seed: 16,
      story: 'Four stones across, and every one of them a little wobbly.' });
  })(),

  // a kingfisher on a stake in the river, facing you: orange breast, blue
  // back and cap, a white throat, a long dark beak
  (() => {
    const g = grid(5, 6, 6);
    g.box([0, 4], [0, 0], [0, 5], water); quad(g, 0, 0, 0, 0);
    g.set(2, 1, 2, woodDk).set(2, 2, 2, wood);
    g.box([1, 3], [3, 4], [1, 3], kfBlue).box([1, 3], [3, 4], [3, 3], kfOrange).set(2, 4, 3, kfWhite);
    pair(g, 1, 3, 1, kfTeal);
    g.box([1, 3], [5, 5], [1, 3], kfBlue);
    pair(g, 1, 5, 3, kfOrange);
    pairFront(g, 1, 5, kfOrange);
    g.set(1, 5, 2, INK).set(3, 5, 2, INK).set(2, 5, 4, INK).set(2, 5, 5, INK);
    g.set(2, 3, 0, kfBlue);
    return g.entry({ id: 'cand-p10-kingfisher', name: 'Kingfisher', fraction: 0.45, seed: 13,
      story: 'A flash of blue, and the river has one fish fewer.' });
  })(),

  // a bell on the bank to call the ferry: a little roofed frame, a bronze
  // bell hanging in it, a tuft of grass round its feet
  (() => {
    const g = grid(5, 6, 3);
    g.box([0, 4], [0, 0], [0, 2], grass).set(0, 0, 0, 0).set(4, 0, 2, 0);
    g.box([0, 0], [1, 3], [1, 1], wood).box([4, 4], [1, 3], [1, 1], wood);
    g.box([0, 4], [4, 4], [1, 1], woodDk).box([0, 4], [5, 5], [0, 2], red);
    g.set(2, 3, 1, bronzeDk).box([1, 3], [2, 2], [1, 1], bronze).box([2, 2], [2, 2], [0, 2], bronze);
    g.box([1, 3], [1, 1], [0, 2], bronzeDk).set(2, 1, 1, bronze);              // the bell's wide lip
    return g.entry({ id: 'cand-p10-ferry-bell', name: 'Ferry Bell', fraction: 0.65, seed: 3,
      story: 'Ring once, and somewhere across the water, a lantern starts to move.' });
  })(),

  // an undershot water wheel turning in the stream against a stone pier:
  // a wooden rim, four spokes, paddles standing out, white water below
  (() => {
    const g = grid(7, 7, 4);
    g.box([2, 4], [0, 3], [0, 0], stoneDk).set(3, 3, 1, woodDk);
    g.box([0, 6], [0, 0], [1, 3], (x, y, z) => (z === 2 ? water : foam));
    for (let y = 0; y <= 6; y++) for (let x = 0; x <= 6; x++) {
      const r = Math.hypot(x - 3, y - 3);
      if (r >= 2.2 && r <= 3.2) g.set(x, y, 2, rim);
      else if (r < 2.2 && (x === 3 || y === 3)) g.set(x, y, 2, woodDk);
    }
    for (const [x, y] of [[1, 5], [5, 5], [1, 1], [5, 1]]) { g.set(x, y, 1, woodDk).set(x, y, 3, woodDk); }   // paddles
    return g.entry({ id: 'cand-p10-water-wheel', name: 'Water Wheel', fraction: 0.7, seed: 7,
      story: 'It has been turning since before the mill had a name.' });
  })(),

  // a salmon leaping clear of the river, silver-pink and spotted, its tail
  // forked behind it and the splash still standing under it
  (() => {
    const g = grid(9, 6, 3);
    g.box([0, 8], [0, 0], [0, 2], water).set(0, 0, 0, 0).set(8, 0, 2, 0).set(3, 0, 1, foam).set(5, 0, 1, foam);
    g.set(4, 1, 1, foam);
    sheet(g, [
      '....f....',
      '..bbbb.tt',
      '.hssssst.',
      '.hppppst.',
      '.......tt',
    ], [1, 1], { f: fin, b: salmonDk, h: salmonDk, s: salmon, p: salmonLt, t: fin }, 0, 1);
    g.set(3, 4, 1, spot).set(5, 4, 1, spot);
    pairZ(g, 1, 3, 0, INK);
    return g.entry({ id: 'cand-p10-salmon', name: 'Leaping Salmon', fraction: 0.4, seed: 11,
      story: 'Swimming home the hard way, which is the only way it knows.' });
  })(),

  // a grey heron on one long leg in the shallows: a white neck, a black
  // crest trailing back, a yellow dagger of a beak, reeds beside it
  (() => {
    const g = grid(7, 9, 3);
    g.box([0, 6], [0, 0], [0, 2], water).set(0, 0, 0, 0).set(6, 0, 2, 0);
    g.box([0, 0], [1, 2], [1, 1], reed).set(0, 3, 1, reedHead).set(1, 1, 0, reed).set(1, 2, 0, reed);
    g.box([3, 3], [1, 3], [1, 1], heronDk);
    g.box([2, 4], [4, 5], [0, 2], heron).box([2, 3], [5, 5], [0, 2], heronDk).box([1, 1], [5, 5], [1, 1], heronDk);
    g.box([4, 4], [4, 4], [0, 2], heronLt);
    g.set(4, 6, 1, heronLt).set(4, 7, 1, heronLt).box([4, 5], [8, 8], [1, 1], heronLt).set(3, 8, 1, INK);
    pairZ(g, 5, 8, 0, INK);
    g.set(6, 8, 1, heronBeak).set(6, 7, 1, 0);
    return g.entry({ id: 'cand-p10-heron', name: 'Heron', fraction: 0.35, seed: 1,
      story: 'It has stood on one leg since dawn, waiting for a fish.' });
  })(),

  // a rope ferry: a plank raft on a rope strung bank to bank, a post up to
  // the line, a lantern on the corner and a bundle waiting to cross
  (() => {
    const g = grid(9, 5, 5);
    g.box([1, 7], [0, 0], [0, 4], water);
    g.box([0, 0], [0, 1], [0, 4], grass).box([8, 8], [0, 1], [0, 4], grass);
    g.box([0, 0], [2, 3], [2, 2], wood).box([8, 8], [2, 3], [2, 2], wood);
    g.box([1, 7], [3, 3], [2, 2], rope);
    g.box([3, 5], [1, 1], [1, 3], wood).box([3, 5], [1, 1], [2, 2], woodDk);
    g.set(4, 2, 2, woodDk);
    g.set(5, 2, 3, glow).set(3, 2, 1, red).set(3, 2, 3, kfBlue);
    return g.entry({ id: 'cand-p10-rope-ferry', name: 'Rope Ferry', fraction: 0.6, seed: 12,
      story: 'Pull the rope hand over hand, and the far bank comes to you.' });
  })(),

  // shrine: the old bridge, a humped stone arch over the river, low walls
  // either side, and a lamp kept burning at its crown
  (() => {
    const g = grid(9, 6, 5);
    g.box([2, 6], [0, 0], [0, 4], water);
    g.box([0, 1], [0, 0], [0, 4], grass).box([7, 8], [0, 0], [0, 4], grass);
    const top = [1, 1, 2, 3, 3, 3, 2, 1, 1];
    top.forEach((t, x) => {
      const y0 = x >= 3 && x <= 5 ? 2 : x === 2 || x === 6 ? 0 : 1;
      g.box([x, x], [y0, t], [1, 3], stone);
      g.box([x, x], [t + 1, t + 1], [1, 1], stoneLt).box([x, x], [t + 1, t + 1], [3, 3], stoneLt);
    });
    g.set(4, 5, 1, glow).set(4, 5, 3, glow);
    g.set(2, 1, 1, moss).set(6, 1, 3, moss).set(3, 2, 3, moss);
    return g.entry({ id: 'cand-p10-old-bridge', name: 'The Old Bridge', fraction: 0.95, seed: 10,
      story: 'Its lamp has not gone out since the first traveller crossed.' });
  })(),

  // shrine: the ferryman, hooded, two small lights for eyes and a red scarf
  // in the wind, standing in his punt with a lantern held out over the bow
  (() => {
    const g = grid(9, 8, 5);
    g.box([0, 8], [0, 0], [0, 4], water); quad(g, 0, 0, 0, 0);
    g.box([1, 7], [1, 1], [1, 3], woodDk).box([1, 7], [2, 2], [1, 1], wood).box([1, 7], [2, 2], [3, 3], wood);
    g.box([3, 5], [2, 3], [1, 3], cloak).box([3, 5], [2, 2], [1, 3], cloakDk);
    g.box([3, 5], [4, 4], [2, 2], scarf).box([4, 4], [4, 4], [1, 3], scarf).set(2, 4, 2, scarf).set(1, 4, 2, scarf);
    g.box([3, 5], [5, 5], [2, 2], hood).box([4, 4], [5, 5], [1, 3], hood).box([4, 4], [6, 6], [2, 2], hood);
    pair(g, 3, 5, 3, eyeGlow);
    g.box([7, 7], [2, 5], [2, 2], wood).set(8, 5, 2, wood).set(8, 4, 2, glow);
    return g.entry({ id: 'cand-p10-ferryman', name: 'The Ferryman', fraction: 0.95, seed: 3,
      story: 'He takes no coin. He asks only where you are going.' });
  })(),
];
