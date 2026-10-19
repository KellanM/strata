// Page 9 · ✦IV The Orchard: shrine candidates (the chapter has none yet).
// A shrine is the chapter's destination, so each is a landmark or a guardian
// rather than one more object: a sacred tree, a tree-keeper, the first seed,
// a glasshouse that keeps a tree inside, a tower a tree has taken over.
// Bigger and busier than the chapter's levels and tuned harder than its
// hardest (Wisteria Bonsai, D 12.4). The sky is late-afternoon gold, so
// nothing leans on cream: leaf greens, apple red, bark and terracotta.
import { grid } from '../voxel.js';
import { INK, BLUSH, front, pair, pairFront, quad, tint, onSurface } from './kit.js';

const leaf = 0x5f9e4a, leafDk = 0x3f7f3f, leafLt = 0x86c46a, apple = 0xd9413a, blossom = 0xf4a3b5,
  bark = 0x7a5236, barkDk = 0x5a3b2a, stone = 0xa8a29a, stoneDk = 0x86807a, grass = 0x7cc35a,
  straw = 0xe0b45a, paper = 0xfbf8f2, torii = 0xe0483a, gold = 0xf2b23a, brick = 0xc8704b, brickDk = 0x9c4f33,
  iron = 0x4f8f78, glass = 0xcfe9ea, orange = 0xf2902a, seed = 0x9a6440, seedDk = 0x7a4a2a, seam = 0xe8c898,
  tile = 0xd98a5a, slate = 0x5b6f8a;

export default [
  // the mother tree, the orchard's oldest: so old it fruits and flowers at
  // once; a straw rope and paper streamers round its trunk, a hollow at its
  // foot where a small light is kept, two stone lanterns on its stepped dais
  // and one golden apple at the very top
  (() => {
    const g = grid(9, 10, 7);
    for (let z = 0; z < 7; z++) for (let x = 0; x < 9; x++) {
      const e = ((x - 4) / 4.6) ** 2 + ((z - 3) / 3.6) ** 2;
      if (e <= 1) g.set(x, 0, z, e > 0.6 ? stoneDk : stone);                   // a stepped stone dais
      if (e <= 0.68) g.set(x, 1, z, grass);                                    // and its grass mound
    }
    g.box([3, 5], [1, 5], [2, 4], bark);
    for (const [x, z] of [[3, 2], [5, 2], [3, 4], [5, 4]]) for (let y = 4; y <= 5; y++) g.clear(x, y, z);
    for (const [x, z] of [[2, 3], [6, 3], [4, 1], [4, 5]]) g.set(x, 2, z, barkDk);   // root flares
    g.clear(4, 2, 5).box([4, 4], [2, 3], [4, 4], 0).set(4, 2, 3, gold);         // the hollow and its light
    tint(g, (x, y) => y === 4, straw);                                         // the rope
    pairFront(g, 3, 3, paper);                                                 // its streamers
    g.ellipsoid([4, 7.3, 3], [4.6, 2.8, 3.6], (x, y, z) => ((Math.abs(x - 4) + y + z) % 3 ? leaf : leafDk));
    tint(g, (x, y, z) => y >= 6 && onSurface(g, x, y, z) && (Math.abs(x - 4) * 2 + y * 3 + z) % 7 === 0, apple);
    tint(g, (x, y, z) => y >= 6 && onSurface(g, x, y, z) && (Math.abs(x - 4) * 2 + y * 3 + z) % 7 === 4, blossom);
    g.set(4, 9, 3, gold);                                                      // the golden apple
    pair(g, 2, 1, 6, stoneDk); pair(g, 2, 2, 6, 0xffd58a);                     // two little stone lanterns
    return { ...g.entry({ id: 'cand-p9-mother-tree', name: 'Mother Tree' }), fraction: 0.65, seed: 12, story: 'So old it fruits and flowers at once, and nobody minds.' };
  })(),

  // the orchard keeper: a tree that walks the rows at night, a kind face in
  // its bark, branch arms held up with an apple in each hand, root feet and a
  // crown of leaves full of fruit and blossom
  (() => {
    const g = grid(9, 10, 6);
    g.box([2, 3], [0, 0], [1, 4], barkDk).box([5, 6], [0, 0], [1, 4], barkDk);   // root feet
    g.box([2, 6], [1, 6], [1, 4], bark);
    for (const x of [2, 6]) for (const z of [1, 4]) g.clear(x, 1, z).clear(x, 6, z);
    tint(g, (x, y, z) => y >= 1 && y <= 6 && (x + y) % 3 === 0 && z === 1, barkDk);   // bark grain behind; a clean face in front
    // the face: tall eyes with a glint, blush, a little mouth, a mossy brow
    for (const x of [2, 3, 4, 5, 6]) front(g, x, 6, leafDk);
    pairFront(g, 3, 4, INK); pairFront(g, 3, 3, INK); pairFront(g, 3, 5, 0xfbf8f2);
    pairFront(g, 2, 2, BLUSH); front(g, 4, 2, barkDk);
    // arms: out from the shoulders, up, an apple held in each hand
    pair(g, 1, 4, 2, bark); pair(g, 1, 4, 3, bark); pair(g, 0, 4, 2, bark); pair(g, 0, 5, 2, bark); pair(g, 0, 6, 2, bark);
    pair(g, 0, 7, 2, apple); pair(g, 0, 7, 3, leafLt);
    g.ellipsoid([4, 8.2, 2.5], [3.6, 1.9, 2.8], (x, y, z) => ((Math.abs(x - 4) + y + z) % 3 ? leaf : leafDk));
    tint(g, (x, y, z) => y >= 7 && onSurface(g, x, y, z) && Math.abs(x - 4) <= 3 && (Math.abs(x - 4) * 2 + y * 3 + z) % 6 === 1, apple);
    tint(g, (x, y, z) => y >= 7 && onSurface(g, x, y, z) && Math.abs(x - 4) <= 3 && (Math.abs(x - 4) * 2 + y * 3 + z) % 6 === 4, blossom);
    return { ...g.entry({ id: 'cand-p9-orchard-keeper', name: 'Orchard Keeper' }), fraction: 0.8, seed: 9, story: 'It walks the rows at night and counts every apple twice.' };
  })(),

  // a glasshouse built round the orchard's first orange tree: a brick base,
  // a green iron frame open at the sides, a glazed hipped roof with a gold
  // finial, and the little tree inside in its pot, hung with oranges
  (() => {
    const g = grid(7, 9, 7);
    g.box([0, 6], [0, 0], [0, 6], (x, y, z) => ((x + z) % 2 ? tile : brick));
    g.box([0, 6], [1, 1], [0, 6], brickDk).box([1, 5], [1, 1], [1, 5], 0).clear(3, 1, 6);
    for (const x of [0, 3, 6]) for (const z of [0, 3, 6]) if (x !== 3 || z !== 3) g.box([x, x], [2, 4], [z, z], iron);
    g.box([0, 6], [5, 5], [0, 6], iron).box([1, 5], [5, 5], [1, 5], 0);
    g.box([1, 5], [6, 6], [1, 5], glass).box([2, 4], [7, 7], [2, 4], glass).set(3, 8, 3, gold);
    tint(g, (x, y, z) => y >= 6 && (x === z || x + z === 6) && !(x === 3 && z === 3), iron);   // hip ribs, glass between
    g.box([2, 4], [1, 1], [2, 4], brick).set(3, 1, 3, barkDk).box([3, 3], [2, 3], [3, 3], bark);  // pot and trunk
    g.ellipsoid([3, 4.4, 3], [1.8, 1.3, 1.8], (x, y, z) => ((x + y + z) % 3 ? leaf : leafDk));
    tint(g, (x, y, z) => y >= 3 && y <= 5 && onSurface(g, x, y, z) && g.get(x, y, z) !== iron && (Math.abs(x - 3) + Math.abs(z - 3) + y) % 3 === 0 && (x !== 3 || z !== 3), orange);
    return { ...g.entry({ id: 'cand-p9-glasshouse', name: 'Glasshouse' }), fraction: 0.95, seed: 16, story: 'Built round the first orange tree, to keep the winter off it.' };
  })(),

  // the first seed: a great seed on a stepped stone altar, split at the top
  // where it glows gold, one green shoot with two leaves rising out of it and
  // pale roots reaching down over the rim of its stone bowl
  (() => {
    const g = grid(7, 10, 7);
    g.box([0, 6], [0, 0], [0, 6], stone);
    for (const [x, z] of [[0, 0], [6, 0], [0, 6], [6, 6]]) g.clear(x, 0, z);
    g.box([1, 5], [1, 1], [1, 5], stoneDk);
    g.cylinder('y', [3, 3], 2.6, [2, 2], stone);
    g.ellipsoid([3, 5, 3], [2.4, 2.9, 2.4], (x, y, z) => (y <= 3 ? seedDk : seed));
    tint(g, (x, y, z) => x === 3 && y >= 3 && onSurface(g, x, y, z), seam);
    for (const [x, z] of [[3, 3], [2, 3], [4, 3], [3, 2], [3, 4]]) g.set(x, 7, z, gold);
    g.clear(3, 7, 3).box([3, 3], [7, 8], [3, 3], leafLt);
    pair(g, 2, 9, 3, leaf); pair(g, 1, 9, 3, leaf); pair(g, 1, 8, 3, leafDk);
    g.set(3, 9, 3, leafLt);
    for (const [x, z] of [[1, 2], [2, 1], [5, 2], [4, 1], [1, 4], [2, 5], [5, 4], [4, 5]]) g.set(x, 2, z, seam);   // roots over the rim
    quad(g, 1, 1, 1, seam);
    return { ...g.entry({ id: 'cand-p9-first-seed', name: 'The First Seed' }), fraction: 0.95, seed: 4, story: 'Every tree in the orchard began as this one, and it is still beginning.' };
  })(),

  // a round stone tower a blossoming apple tree has taken over: its crown
  // bursts from the top, roots run down the walls, a door and a lit window
  (() => {
    const g = grid(7, 10, 7);
    g.cylinder('y', [3, 3], 2.6, [0, 0], stoneDk);
    g.cylinder('y', [3, 3], 2.3, [1, 5], (x, y, z) => ((x + y * 2 + z) % 4 === 0 ? stoneDk : stone));
    g.box([3, 3], [1, 2], [5, 5], INK).set(3, 2, 5, slate);                     // the door
    pairFront(g, 2, 4, gold);                                                   // two lit windows
    g.ellipsoid([3, 7.6, 3], [3.4, 2.2, 3.4], (x, y, z) => ((x + y + z) % 3 ? blossom : leaf));
    tint(g, (x, y, z) => y >= 7 && onSurface(g, x, y, z) && (Math.abs(x - 3) + Math.abs(z - 3) + y) % 5 === 0, apple);
    // roots down the walls, on all four faces
    for (const [x, z] of [[1, 5], [5, 5], [1, 1], [5, 1]]) for (let y = 3; y <= 5; y++) g.set(x, y, z, bark);
    quad(g, 1, 2, 1, barkDk);
    return { ...g.entry({ id: 'cand-p9-tree-tower', name: 'Tree Tower' }), fraction: 0.85, seed: 5, story: 'The tower kept the tree safe, until the tree kept the tower.' };
  })(),
];
