// Page 5 · Temples & Lanterns: a rune stone, intricate lanterns, a bamboo
// water spout and a New Year kadomatsu. Every lantern is hollow with a warm
// glow inside that only peeling uncovers.
import { grid } from '../voxel.js';
import { INK, front, quad, tint, pair } from './kit.js';

const stoneA = 0x8f949c, stoneB = 0x7d8290, rune = 0x5ff0d0, runeDeep = 0x2fb8a8, moss = 0x6fae5a, grass = 0x5fae4e,
  toro = 0xb7b2a8, toroDark = 0x8f8a82, snow = 0xf6f8ff, glow = 0xffd36a, flame = 0xf6a03d,
  paper = 0xfbf1dc, rib = 0xe0c9a0, lacquer = 0x3a3442, mon = 0xe0565b,
  bronze = 0xb7b2a8, verdigris = 0x5d6670, verdigrisDark = 0x7d8794,
  brass = 0x8a5f2a, brassDark = 0x5e3f1f, glassRed = 0xe0565b, glassTeal = 0x4fb3a9, warm = 0xffc85a,
  pebble = 0xd6cfc2, basin = 0x8f949c, water = 0x6fb7e0, bamboo = 0x8fbf4a, bambooNode = 0x6f9f3a, ladle = 0xd9b48f,
  jewel = 0xe9b949, straw = 0xd9b46a, rope = 0x8a5a3c, cut = 0xf0e6c0, pine = 0x3f7a4f, plum = 0xe0565b, plumWhite = 0xfbf8f2;

export default [
  // a rune stone: a rounded standing stone with a glowing algiz carved into
  // its face (another rune on its back), moss on one shoulder, grass at its foot
  (() => {
    const g = grid(7, 9, 4);
    g.box([0, 6], [0, 6], [0, 2], stoneA).box([1, 5], [7, 7], [0, 2], stoneA).set(3, 8, 1, stoneA);
    quad(g, 0, 6, 0, 0); g.set(0, 6, 1, 0).set(6, 6, 1, 0);
    tint(g, (x, y, z) => (x * 3 + y + z * 2) % 7 === 0, stoneB);
    const algiz = ['#.#.#', '.###.', '..#..', '..#..', '..#..'];
    algiz.forEach((row, k) => [...row].forEach((ch, i) => { if (ch === '#') { g.set(1 + i, 6 - k, 2, rune); g.set(1 + i, 6 - k, 1, runeDeep); } }));
    const othala = ['..#..', '.#.#.', '..#..', '.#.#.', '#...#'];   // the back of the stone
    othala.forEach((row, k) => [...row].forEach((ch, i) => { if (ch === '#') g.set(5 - i, 6 - k, 0, rune); }));
    g.box([5, 6], [5, 6], [0, 2], (x, y, z) => (g.get(x, y, z) ? moss : null)).set(5, 7, 1, moss);
    g.box([0, 6], [0, 0], [3, 3], grass).set(1, 1, 3, grass).set(5, 1, 3, grass);
    return g.entry({ id: 'cand-p5-rune-stone', name: 'Rune Stone' });
  })(),

  // a snow-viewing lantern (yukimi-doro): a wide umbrella roof dusted with
  // snow, a lit firebox, four legs kicked outward
  (() => {
    const g = grid(7, 9, 7);
    quad(g, 1, 1, 1, toroDark); quad(g, 0, 1, 1, toroDark); quad(g, 0, 0, 1, toroDark);   // legs bowing outward
    g.box([1, 5], [2, 2], [1, 5], toro);
    g.box([2, 4], [3, 5], [2, 4], (x, y, z) => ((x === 2 || x === 4) && (z === 2 || z === 4) ? toro : glow)).box([3, 3], [3, 5], [3, 3], flame);
    g.box([0, 6], [6, 6], [0, 6], (x, y, z) => (x === 0 || x === 6 || z === 0 || z === 6 ? toroDark : toro));
    quad(g, 0, 7, 0, toroDark);                                                  // the roof's corners turn up
    g.box([1, 5], [7, 7], [1, 5], snow).set(3, 8, 3, toro);
    return g.entry({ id: 'cand-p5-yukimi-lantern', name: 'Snow-viewing Lantern' });
  })(),

  // a chochin: a tall paper lantern with ribs, black lacquered caps and a
  // red mon on both sides, hung from a ring; a candle glows inside
  (() => {
    const g = grid(5, 10, 5);
    const r = [1.2, 1.6, 2.5, 2.5, 2.5, 2.5, 2.5, 1.6, 1.2];
    r.forEach((rad, y) => g.cylinder('y', [2, 2], rad, [y, y], y === 0 || y === 8 ? lacquer : y % 2 ? rib : paper));
    g.box([1, 3], [2, 6], [2, 2], 0).box([2, 2], [2, 6], [1, 3], 0).set(2, 2, 2, flame).set(2, 3, 2, glow);
    for (const z of [4, 0]) for (const [x, y] of [[1, 3], [2, 3], [3, 3], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5]]) g.set(x, y, z, mon);
    g.set(2, 9, 2, lacquer).set(1, 9, 2, lacquer).set(3, 9, 2, lacquer);
    return g.entry({ id: 'cand-p5-chochin', name: 'Chochin' });
  })(),

  // a pagoda lantern: three slate roofs stepping up over a lit firebox in a
  // pale stone body, a gold jewel on top
  (() => {
    const g = grid(5, 10, 5);
    g.box([0, 4], [0, 0], [0, 4], bronze).box([1, 3], [1, 1], [1, 3], bronze);
    quad(g, 0, 0, 0, 0);
    g.box([1, 3], [2, 3], [1, 3], (x, y, z) => ((x === 1 || x === 3) && (z === 1 || z === 3) ? bronze : glow)).set(2, 2, 2, flame).set(2, 3, 2, flame);
    g.box([0, 4], [4, 4], [0, 4], (x, y, z) => (x % 4 === 0 && z % 4 === 0 ? verdigrisDark : verdigris));
    g.box([1, 3], [5, 5], [1, 3], bronze);
    g.box([0, 4], [6, 6], [0, 4], verdigris); quad(g, 0, 6, 0, 0);
    g.set(2, 7, 2, bronze).box([1, 3], [8, 8], [1, 3], verdigris).set(2, 9, 2, jewel);
    return g.entry({ id: 'cand-p5-pagoda-lantern', name: 'Pagoda Lantern' });
  })(),

  // a hanging Moroccan lantern: a brass body pierced all over, coloured glass
  // in some holes and light pouring through the rest, an onion dome and a chain
  (() => {
    const g = grid(5, 10, 5);
    g.box([1, 3], [0, 0], [1, 3], brass).set(2, 0, 2, brassDark);
    const lattice = ['BBB', 'wBw', 'BoB', 'wBw'];                      // rows y4 down to y1, across each face
    g.box([0, 4], [1, 4], [0, 4], (x, y, z) => {
      if ((x === 0 || x === 4) && (z === 0 || z === 4)) return brassDark;
      const t = x === 0 || x === 4 ? z : x;
      if (x > 0 && x < 4 && z > 0 && z < 4) return y === 4 ? brass : glow;
      const ch = lattice[4 - y][t - 1];
      return ch === 'B' ? brass : ch === 'w' ? warm : 0;              // 'o' is a pierced hole onto the glow
    });
    g.box([2, 2], [1, 3], [2, 2], flame);
    g.box([0, 4], [5, 5], [0, 4], brass); quad(g, 0, 5, 0, 0);
    g.box([1, 3], [6, 6], [1, 3], brass);
    g.box([1, 3], [7, 7], [2, 2], brassDark).box([2, 2], [7, 7], [1, 3], brassDark);
    g.set(2, 8, 2, brass).set(2, 9, 2, INK);
    return g.entry({ id: 'cand-p5-moroccan-lantern', name: 'Moroccan Lantern' });
  })(),

  // a tsukubai: a stone basin of still water fed by a bamboo spout, a ladle
  // laid across it, on a bed of raked pebbles with a patch of moss
  (() => {
    const g = grid(9, 6, 5);
    g.box([0, 8], [0, 0], [0, 4], pebble);
    tint(g, (x, y, z) => z === 1 || z === 3, 0xc6bfb2);
    g.box([0, 1], [0, 0], [3, 4], moss).set(0, 0, 2, moss);
    g.cylinder('y', [6, 2], 2.2, [1, 2], basin).cylinder('y', [6, 2], 1.6, [3, 3], basin).cylinder('y', [6, 2], 0.9, [3, 3], water);
    g.box([2, 2], [1, 5], [2, 2], (x, y) => (y === 3 ? bambooNode : bamboo)).box([3, 5], [5, 5], [2, 2], bamboo).set(5, 5, 2, bambooNode);
    g.set(6, 4, 2, water);                                                    // the trickle, falling into the basin
    g.box([5, 7], [4, 4], [4, 4], ladle).set(7, 4, 3, ladle);
    return g.entry({ id: 'cand-p5-tsukubai', name: 'Tsukubai' });
  })(),

  // a kadomatsu: three bamboo stalks cut on a slant, tallest in the middle,
  // bound into a straw base with rope, pine sprigs and plum blossom round it
  (() => {
    const g = grid(6, 10, 5);
    g.box([0, 5], [0, 2], [0, 4], straw);
    quad(g, 0, 0, 0, 0); quad(g, 0, 1, 0, 0); quad(g, 0, 2, 0, 0);
    tint(g, (x, y) => y === 1, rope);
    const stalk = (x0, z0, top) => {
      g.box([x0, x0 + 1], [3, top], [z0, z0 + 1], (x, y) => (y === 5 ? bambooNode : bamboo));
      g.set(x0, top, z0 + 1, cut).set(x0 + 1, top, z0 + 1, cut).set(x0, top, z0, bamboo).set(x0 + 1, top, z0, bamboo);
      g.set(x0, top + 1, z0, cut).set(x0 + 1, top + 1, z0, cut);       // the slant: back corner higher
    };
    stalk(2, 1, 8); stalk(0, 2, 5); stalk(4, 2, 6);
    g.box([0, 5], [3, 3], [4, 4], (x) => (x === 2 || x === 3 ? plum : pine)).set(1, 3, 4, plumWhite).set(4, 3, 4, plumWhite);
    g.box([0, 0], [3, 3], [1, 1], pine).box([5, 5], [3, 3], [1, 1], pine);
    return g.entry({ id: 'cand-p5-kadomatsu', name: 'Kadomatsu' });
  })(),
];
