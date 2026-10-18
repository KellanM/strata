// Page 5 · Sea & Shore: lanterns for boats and water, a fossil, a ship in a
// bottle, stones stacked by the tide. Lit lanterns keep their flame inside,
// so peeling is how you find it.
import { grid } from '../voxel.js';
import { quad, tint, sheet } from './kit.js';

const iron = 0x3f4a52, brass = 0xd9a83f, amber = 0xf8d77a, flame = 0xf2803d, candle = 0xfbf3e6,
  water = 0x5b9fd6, ripple = 0x8cc8e8, raft = 0x8a5a3c, paper = 0xffe8b8, post = 0x5a3b30, glowCore = 0xf6a03d, red = 0xe0565b,
  shellA = 0xf0d9b0, shellB = 0xd9b07a, groove = 0x8a5a3c, matrix = 0x9aa3ad, matrixDark = 0x7d8794,
  glass = 0xb8e6cf, cork = 0xc89a62, wood = 0x8a5a3c, sea = 0x3f6fc6, hull = 0x8a5a3c, sail = 0xfbf8f2, flag = 0xe0565b,
  slate = 0x5d6670, sand = 0xd9c7a3, grey = 0x9aa3ad, whiteStone = 0xf0ece4, rust = 0xc0704a,
  rock = 0x8a8f99, rockLight = 0xa9afb8, pool = 0x4fb3a9, star = 0xf08a3c, anemone = 0xf47fa0, shell = 0xf6efe4, weed = 0x5fae6e;

export default [
  // a ship's lantern: a dark iron cage round amber glass, a brass band, a
  // vented cap and a carrying ring; the flame burns inside
  (() => {
    const g = grid(5, 8, 5);
    g.box([0, 4], [0, 0], [0, 4], iron);
    quad(g, 0, 0, 0, 0);
    g.box([0, 4], [1, 3], [0, 4], (x, y, z) => ((x === 0 || x === 4) && (z === 0 || z === 4) ? iron : y === 2 ? brass : amber));
    g.box([1, 3], [1, 3], [1, 3], 0).set(2, 1, 2, candle).set(2, 2, 2, flame);
    g.box([0, 4], [4, 4], [0, 4], iron);
    quad(g, 0, 4, 0, 0);
    g.box([1, 3], [5, 5], [1, 3], brass).set(2, 5, 2, iron);
    g.set(1, 6, 2, iron).set(3, 6, 2, iron).box([1, 3], [7, 7], [2, 2], iron);
    return g.entry({ id: 'cand-p5-ships-lantern', name: "Ship's Lantern" });
  })(),

  // a floating lantern: a little paper box on a raft, open at the top so you
  // look down onto its candle, adrift on a disc of rippling water
  (() => {
    const g = grid(9, 5, 9);
    g.cylinder('y', [4, 4], 4.3, [0, 0], (x, y, z) => (Math.abs(Math.hypot(x - 4, z - 4) - 3.4) < 0.5 ? ripple : water));
    g.box([2, 6], [1, 1], [2, 6], raft);
    g.box([2, 6], [2, 3], [2, 6], (x, y, z) => ((x === 2 || x === 6) && (z === 2 || z === 6) ? post : paper));
    quad(g, 2, 4, 2, post);                                                  // the frame's corner posts rise above the paper
    g.box([3, 5], [2, 3], [3, 5], 0).box([3, 5], [2, 2], [3, 5], glowCore).set(4, 2, 4, candle).set(4, 3, 4, flame);
    for (const [x, z] of [[4, 6], [6, 4], [4, 2], [2, 4]]) g.set(x, 3, z, red);   // a painted mark on each face
    return g.entry({ id: 'cand-p5-floating-lantern', name: 'Floating Lantern' });
  })(),

  // an ammonite fossil: a ribbed coil half freed from a split stone, the
  // whorls standing out against the dark rock behind them
  (() => {
    const g = grid(7, 7, 3);
    g.box([0, 6], [0, 6], [0, 0], matrix);
    quad(g, 0, 0, 0, 0);
    tint(g, (x, y) => (x + 2 * y) % 5 === 0, matrixDark);
    g.cylinder('z', [3, 3], 3.2, [1, 1], groove);
    const coil = [
      '.SSSSS.',
      'S.....S',
      'S.SSS.S',
      'S.S.S.S',
      'S.S...S',
      'S.SSSSS',
      '.......',
    ];
    coil.forEach((row, k) => [...row].forEach((ch, x) => {
      if (ch === 'S') g.set(x, 6 - k, 2, (x + k) % 2 ? shellA : shellB);
    }));
    return g.entry({ id: 'cand-p5-ammonite', name: 'Ammonite' });
  })(),

  // a ship in a bottle, lying in a wooden cradle: the glass is open at the
  // front so you can see the little ship on its painted sea; a cork at the neck
  (() => {
    const g = grid(9, 6, 5);
    for (const x of [1, 5]) g.box([x, x], [0, 0], [1, 3], wood);
    g.cylinder('x', [3, 2], 2.2, [0, 6], glass).cylinder('x', [3, 2], 1.2, [7, 7], glass).set(8, 3, 2, cork);
    g.box([1, 6], [2, 4], [1, 4], 0);                                     // hollow, and open toward you
    g.box([1, 6], [2, 2], [1, 3], sea);
    g.box([2, 4], [2, 2], [2, 2], hull).set(5, 2, 2, hull);
    g.box([3, 3], [3, 4], [2, 2], sail).set(2, 3, 2, sail).set(4, 3, 2, sail).set(4, 4, 2, sail);
    g.set(3, 5, 2, flag);
    return g.entry({ id: 'cand-p5-ship-bottle', name: 'Ship in a Bottle' });
  })(),

  // a cairn: five flat river stones stacked by the tide, each a different
  // stone, set a little off-centre so the stack leans and balances
  (() => {
    const g = grid(7, 7, 5);
    g.ellipsoid([3, 0.4, 2], [3.3, 0.9, 2.3], slate)
      .ellipsoid([3.4, 1.8, 2], [2.4, 0.8, 1.8], sand)
      .ellipsoid([2.6, 3.0, 2], [2.0, 0.7, 1.5], grey)
      .ellipsoid([3.2, 4.2, 2], [1.4, 0.7, 1.2], whiteStone)
      .ellipsoid([3, 5.4, 2], [0.9, 0.7, 0.9], rust).set(3, 6, 2, rust);
    return g.entry({ id: 'cand-p5-cairn', name: 'Cairn' });
  })(),

  // a tide pool: a ring of rocks holding still water, an orange starfish on
  // the bottom, a pink anemone, a sprig of weed and a shell on the rim
  (() => {
    const g = grid(9, 4, 7);
    g.ellipsoid([4, 0.6, 3], [4.4, 2.0, 3.4], rock);
    for (let z = 0; z < 7; z++) for (let x = 0; x < 9; x++) if (((x - 4) / 3.1) ** 2 + ((z - 3) / 2.1) ** 2 <= 1) { g.clear(x, 2, z); g.set(x, 1, z, pool); }
    tint(g, (x, y, z) => y === 2 && (x + z) % 3 === 0, rockLight);
    g.set(1, 3, 2, rock).set(1, 3, 3, rock);
    const rim = [[6, 5], [7, 4], [5, 5], [7, 3]].find(([x, z]) => g.get(x, 2, z) === rock || g.get(x, 2, z) === rockLight);
    g.set(rim[0], 3, rim[1], shell);
    ['..#..', '#####', '.###.', '##.##'].forEach((row, dz) => [...row].forEach((ch, dx) => { if (ch === '#') g.set(2 + dx, 1, 2 + dz, star); }));
    g.set(2, 2, 2, anemone).set(2, 2, 1, anemone).set(1, 2, 2, anemone);  // anemone tentacles in the back corner
    g.set(6, 2, 2, weed).set(6, 3, 2, weed);
    return g.entry({ id: 'cand-p5-tide-pool', name: 'Tide Pool' });
  })(),
];
