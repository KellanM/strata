// Page 9 · ✦XII Lantern Festival: shrine candidates (the chapter has none yet).
// The festival's destinations: the dance tower everyone circles, the god's
// palanquin, a gate with a lantern bigger than a door, a wishing tree hung
// with lanterns, a great stone lantern. Tuned harder than the chapter's
// hardest (Origami Fox, D 14.4). The sky is deep plum, so every piece is
// built from vermilion, gold, paper and light; nothing large is dark.
import { grid } from '../voxel.js';
import { INK, front, pair, pairFront, quad, tint, onSurface } from './kit.js';

const verm = 0xe0483a, vermDk = 0xb8323a, gold = 0xf2b23a, goldDk = 0xc98a2a, light = 0xffd58a, hot = 0xfff1b0,
  paper = 0xf7e3cf, white = 0xfbf8f2, wood = 0xc89a5a, woodDk = 0x9a6a3a, stone = 0xcfc6b8, stoneDk = 0xa59c90,
  teal = 0x4fb3a9, tealDk = 0x3a8a86, blossom = 0xf4a3b5, blossomDk = 0xe07a98, bark = 0x9a6a52, straw = 0xe0b45a,
  moss = 0x8cc46a, pink = 0xf6c6d4, sky = 0x8fd0e8;

export default [
  // the bon-dance tower: a red-and-white festival curtain round its base, a
  // deck with a big drum under a vermilion roof, and a ring of lanterns, red
  // and lit, hung all round the eaves
  (() => {
    const g = grid(7, 10, 7);
    quad(g, 0, 0, 0, woodDk);                                                    // legs below the curtain
    g.box([0, 6], [1, 3], [0, 6], (x, y, z) => (y === 3 ? gold : (x + z) % 2 ? white : verm)).box([1, 5], [1, 3], [1, 5], 0);
    g.box([0, 6], [4, 4], [0, 6], wood);
    for (let y = 5; y <= 7; y++) quad(g, 1, y, 1, woodDk);
    // the drum, its skin to the front and back
    g.box([2, 4], [5, 7], [3, 3], vermDk).set(2, 5, 3, 0).set(4, 5, 3, 0).set(2, 7, 3, 0).set(4, 7, 3, 0);
    for (const z of [2, 4]) g.box([3, 3], [5, 7], [z, z], paper).box([2, 4], [6, 6], [z, z], paper);
    g.set(3, 6, 4, gold).set(3, 6, 2, gold);
    g.box([0, 6], [8, 8], [0, 6], verm).box([2, 4], [9, 9], [2, 4], verm).set(3, 9, 3, gold);
    tint(g, (x, y, z) => y === 8 && (x === 0 || x === 6 || z === 0 || z === 6), vermDk);
    quad(g, 0, 9, 0, gold);
    for (let z = 0; z < 7; z++) for (let x = 0; x < 7; x++) {
      const rim = x === 0 || x === 6 || z === 0 || z === 6;
      if (rim && (x + z) % 2 === 0) g.set(x, 7, z, ((x + z) / 2) % 2 ? verm : light);
    }
    return { ...g.entry({ id: 'cand-p9-yagura', name: 'Bon Dance Tower' }), fraction: 1, seed: 12, story: 'Everyone dances round it until the last lantern burns down.' };
  })(),

  // a mikoshi, the god's palanquin: gold doors, a curved roof with upturned
  // corners and red tassels, a golden phoenix on top, carried on two long poles
  (() => {
    const g = grid(7, 9, 9);
    for (const x of [1, 5]) g.box([x, x], [0, 0], [0, 8], wood);
    g.box([0, 6], [0, 0], [2, 2], woodDk).box([0, 6], [0, 0], [6, 6], woodDk);
    g.box([0, 6], [1, 1], [1, 7], (x, y, z) => (x === 0 || x === 6 || z === 1 || z === 7 ? gold : vermDk));
    g.box([1, 5], [2, 4], [2, 6], vermDk);
    quad(g, 1, 2, 2, verm); quad(g, 1, 3, 2, verm); quad(g, 1, 4, 2, verm);   // pillars at the corners
    g.box([2, 4], [2, 4], [6, 6], gold).box([3, 3], [2, 4], [6, 6], goldDk);   // the doors
    g.box([2, 4], [2, 4], [2, 2], gold);
    for (const x of [1, 5]) g.box([x, x], [3, 3], [3, 5], gold);
    g.box([0, 6], [5, 5], [1, 7], (x, y, z) => (x === 0 || x === 6 || z === 1 || z === 7 ? gold : vermDk))
      .box([1, 5], [6, 6], [2, 6], verm).box([2, 4], [7, 7], [3, 5], vermDk);
    quad(g, 0, 6, 1, gold);                                                      // upturned corners
    quad(g, 0, 4, 1, verm); quad(g, 0, 3, 1, light);                             // tassels
    g.box([1, 5], [8, 8], [4, 4], gold).box([3, 3], [8, 8], [3, 5], gold);      // the phoenix, wings wide
    return { ...g.entry({ id: 'cand-p9-mikoshi', name: 'Mikoshi' }), fraction: 0.85, seed: 7, story: 'Carried through the streets so the god can see the festival too.' };
  })(),

  // a great lantern gate: two vermilion pillars, a teal-tiled roof with gold
  // ridge ends, and hanging in the doorway a red paper lantern taller than a
  // person, gold-capped, with a flame inside it
  (() => {
    const g = grid(9, 9, 6);
    for (const x of [0, 8]) g.box([x, x], [0, 5], [2, 3], verm).box([x, x], [0, 0], [1, 4], stone);
    g.box([0, 8], [6, 6], [1, 4], vermDk);
    g.box([0, 8], [7, 7], [0, 5], teal).box([1, 7], [8, 8], [2, 3], tealDk);
    pair(g, 1, 8, 2, gold); pair(g, 1, 8, 3, gold);
    tint(g, (x, y, z) => y === 7 && (z === 0 || z === 5), tealDk);
    const disc = (y, r, c) => g.cylinder('y', [4, 2.5], r, [y, y], c);
    disc(1, 1.6, gold); disc(5, 1.6, gold);
    for (let y = 2; y <= 4; y++) disc(y, 2.3, verm);
    tint(g, (x, y, z) => y === 3 && z === 4 && x >= 3 && x <= 5, paper);        // its painted band
    g.box([3, 5], [3, 3], [2, 3], 0).box([4, 4], [3, 3], [2, 3], hot);          // the flame inside
    g.set(4, 6, 2, goldDk).set(4, 6, 3, goldDk);
    return { ...g.entry({ id: 'cand-p9-lantern-gate', name: 'Great Lantern Gate' }), fraction: 1, seed: 6, story: 'The lantern in this gate is lit once a year, for everyone.' };
  })(),

  // a wishing tree at night: a cherry in full blossom on a stone dais, a straw
  // rope round its trunk, lanterns hung all round under its crown and paper
  // wishes tied to its lowest branches
  (() => {
    const g = grid(9, 9, 7);
    for (let z = 0; z < 7; z++) for (let x = 0; x < 9; x++) {
      const e = ((x - 4) / 4.6) ** 2 + ((z - 3) / 3.6) ** 2;
      if (e <= 1) g.set(x, 0, z, e > 0.6 ? stoneDk : stone);
    }
    g.box([3, 5], [1, 4], [2, 4], bark);
    for (const [x, z] of [[3, 2], [5, 2], [3, 4], [5, 4]]) g.clear(x, 2, z).clear(x, 3, z).clear(x, 4, z);
    tint(g, (x, y) => y === 2, straw);
    pairFront(g, 3, 1, white);
    g.ellipsoid([4, 6.6, 3], [4.6, 2.4, 3.6], (x, y, z) => ((Math.abs(x - 4) + y + z) % 3 ? blossom : blossomDk));
    // lanterns under the crown's rim, red and lit by turns; wishes between them
    for (let z = 0; z < 7; z++) for (let x = 0; x < 9; x++) {
      if (!g.get(x, 5, z) || g.get(x, 4, z)) continue;
      const rim = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([a, b]) => !g.get(x + a, 5, z + b));
      if (!rim) continue;
      const k = Math.abs(x - 4) + z;
      if (k % 3 === 0) g.set(x, 4, z, verm).set(x, 3, z, light);
      else if (k % 3 === 1 && z >= 3) g.set(x, 4, z, k % 2 ? sky : paper);
    }
    return { ...g.entry({ id: 'cand-p9-wishing-tree', name: 'Wishing Tree' }), fraction: 0.8, seed: 15, story: 'Every lantern on it holds a wish someone whispered tonight.' };
  })(),

  // a great stone lantern: a wide foot, a short pillar wrapped in a festival
  // rope, a fire box glowing through paper windows on every side, a broad
  // roof with curled corners and a jewel on top
  (() => {
    const g = grid(7, 10, 7);
    g.cylinder('y', [3, 3], 3.2, [0, 0], stoneDk).cylinder('y', [3, 3], 2.3, [1, 1], stone);
    g.cylinder('y', [3, 3], 1.2, [2, 3], stone);
    tint(g, (x, y) => y === 3, straw);
    pairFront(g, 2, 2, white);
    g.cylinder('y', [3, 3], 2.3, [4, 4], stoneDk);
    g.box([1, 5], [5, 6], [1, 5], stone);
    for (const [x, z] of [[1, 3], [5, 3], [3, 1], [3, 5], [2, 1], [4, 1], [2, 5], [4, 5], [1, 2], [1, 4], [5, 2], [5, 4]])
      for (let y = 5; y <= 6; y++) g.set(x, y, z, (x === 3 || z === 3) ? hot : light);
    g.cylinder('y', [3, 3], 3.3, [7, 7], stoneDk).cylinder('y', [3, 3], 1.8, [8, 8], stone).set(3, 9, 3, gold);
    quad(g, 0, 8, 0, 0); quad(g, 1, 8, 1, stoneDk);
    tint(g, (x, y, z) => y === 7 && onSurface(g, x, y, z) && (x + z) % 4 === 0, moss);
    return { ...g.entry({ id: 'cand-p9-stone-lantern', name: 'Great Stone Lantern' }), fraction: 0.95, seed: 10, story: 'Lit for the festival every year since before the festival had a name.' };
  })(),
];
