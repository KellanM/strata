// Page 7 · XIII Old Stones: older than the temples; carved and mossy. Things
// that were here first - a golem, a moss spirit, a moai, a stone tortoise
// with its tablet - and the stones themselves: a circle, a holed stone, a
// trilithon, a clapper bridge, a sundial, a giant's hand.
// The mist sky is grey-green, so stone leans warm (sandstone, not slate) and
// moss is a bright spring green; cyan is kept for things that still glow.
import { grid } from '../voxel.js';
import { INK, BLUSH, front, out, pair, pairFront, quad, tint, onSurface, sheet } from './kit.js';

const stone = 0xc7beb0, stoneLt = 0xdcd4c6, stoneDk = 0x8f877c, slate = 0x7d8aa0, basalt = 0x6f6a66,
  moss = 0x7cc35a, mossDk = 0x4f9a4a, mossLt = 0xa8d97a, lichen = 0xe0cf6a, glow = 0x7fe0e6, glowDk = 0x3fb8c4,
  pink = 0xf4a3b5, red = 0xe0565b, capRed = 0xd9534f, cream = 0xf6efe4, earth = 0x8a6a4a, water = 0x6fb8d6,
  pukao = 0xa0522d, bronze = 0xb07a3a, bronzeDk = 0x7f5626, twig = 0x8a5a3c, egg = 0x9fd8e6, pika = 0xc9a27a,
  pikaLt = 0xe8d2b0, yellow = 0xf6d365;

export default [
  // a stone golem, gentle and slow: a broad body, a small head sunk between
  // mossy shoulders, glowing eyes and chest rune, long arms with heavy fists,
  // one shoulder grown a pink flower
  (() => {
    const g = grid(9, 9, 5);
    g.box([2, 6], [3, 6], [1, 3], stone);
    g.box([3, 5], [7, 8], [1, 3], stone).clear(3, 8, 1).clear(5, 8, 1);
    g.set(3, 7, 3, glow).set(5, 7, 3, glow).set(4, 8, 3, stoneDk);
    g.box([4, 4], [4, 5], [3, 3], glowDk).set(3, 5, 3, glowDk).set(5, 5, 3, glowDk);     // the chest rune
    for (const x of [0, 1]) for (let y = 1; y <= 6; y++) for (const z of [1, 2, 3]) {
      if (y >= 3 || x === 1 || z === 2) pair(g, x, y, z, y <= 2 ? stoneDk : stone);      // arms, fists at the bottom
    }
    pair(g, 0, 6, 1, 0); pair(g, 0, 6, 3, 0); pair(g, 0, 1, 1, 0); pair(g, 0, 1, 3, 0);
    pair(g, 2, 0, 2, stoneDk); pair(g, 3, 0, 2, stoneDk); pair(g, 2, 1, 2, stoneDk); pair(g, 3, 1, 2, stoneDk);
    pair(g, 2, 2, 2, stone); pair(g, 3, 2, 2, stone);
    tint(g, (x, y, z) => y === 6 && x !== 4 && onSurface(g, x, y, z), moss);
    pair(g, 1, 7, 2, mossLt); pair(g, 2, 7, 2, moss); g.set(2, 7, 1, moss).set(6, 7, 1, moss);
    g.set(7, 8, 2, pink).set(7, 7, 3, mossDk);
    return g.entry({ id: 'cand-p7-stone-golem', name: 'Stone Golem' });
  })(),

  // a moss spirit: a round, soft ball of moss on two stubby feet, a sprout
  // with two leaves on top, a sleepy face, and a red toadstool growing on
  // its head like a little hat worn to one side
  (() => {
    const g = grid(7, 8, 7);
    g.ellipsoid([3, 2.9, 3], [2.8, 2.6, 2.8], moss);
    tint(g, (x, y, z) => onSurface(g, x, y, z) && (x * 3 + y * 5 + z * 7) % 6 === 0, mossLt);
    tint(g, (x, y, z) => onSurface(g, x, y, z) && (x * 5 + y * 3 + z) % 9 === 0, mossDk);
    pairFront(g, 2, 3, INK); pairFront(g, 1, 2, BLUSH); front(g, 3, 2, mossDk);
    for (const x of [2, 3, 4]) front(g, x, 3, x === 3 ? moss : undefined);
    pair(g, 2, 0, 3, mossDk); pair(g, 2, 0, 4, mossDk);
    g.set(3, 6, 3, mossDk).set(3, 7, 3, mossDk).set(2, 7, 3, mossLt).set(4, 7, 3, mossLt);
    g.set(1, 5, 3, cream).box([0, 2], [6, 6], [3, 3], capRed).set(1, 6, 2, capRed).set(1, 6, 4, capRed).set(1, 7, 3, capRed).set(1, 6, 4, cream);
    return g.entry({ id: 'cand-p7-moss-spirit', name: 'Moss Spirit' });
  })(),

  // a moai buried to the chest in grass: a long weathered face, a heavy
  // brow over shadowed eyes, a long nose and a pressed mouth, long ears, a
  // red pukao topknot with moss on it
  (() => {
    const g = grid(6, 10, 6);
    const tuff = 0x9a8f84, tuffLt = 0xb8ad9f, socket = 0x4a4440;
    g.box([0, 5], [0, 0], [0, 5], mossDk).box([0, 5], [1, 1], [0, 5], (x, y, z) => (x === 0 || x === 5 || z === 0 || z === 5 ? moss : tuff));
    g.box([1, 4], [2, 7], [1, 4], tuff);
    g.box([1, 4], [6, 6], [5, 5], tuffLt);                                    // the brow
    g.set(1, 5, 4, socket).set(4, 5, 4, socket);                              // shadowed eyes
    g.box([2, 3], [3, 5], [5, 5], tuffLt);                                    // the nose
    g.box([1, 4], [2, 2], [4, 4], tuff).box([2, 3], [2, 2], [5, 5], tuffLt).set(1, 3, 4, socket).set(4, 3, 4, socket);
    for (const y of [3, 4, 5, 6]) pair(g, 0, y, 2, tuff);                     // long ears
    g.cylinder('y', [2.5, 2.5], 1.8, [8, 9], pukao).box([1, 4], [8, 8], [1, 4], pukao);
    g.set(1, 9, 2, moss).set(2, 9, 1, moss).set(4, 8, 4, moss).set(1, 7, 1, moss).set(4, 7, 1, mossLt);
    return g.entry({ id: 'cand-p7-moai', name: 'Moai' });
  })(),

  // a bixi, the stone tortoise who carries a tablet: a domed shell with a
  // carved rim, a patient upturned face, four stout feet, and a carved stele
  // on its back with a mossy cap and a faint glowing line of script
  (() => {
    const g = grid(7, 9, 7);
    g.ellipsoid([3, 1.6, 3], [3.1, 1.8, 2.9], stone);
    tint(g, (x, y, z) => y >= 2 && onSurface(g, x, y, z) && (x + z) % 2 === 0, stoneLt);
    tint(g, (x, y, z) => y === 1 && onSurface(g, x, y, z), stoneDk);
    quad(g, 1, 0, 1, stoneDk); quad(g, 1, 0, 2, stoneDk);                                 // four stout feet
    g.box([2, 4], [1, 2], [6, 6], stone).set(2, 2, 6, INK).set(4, 2, 6, INK).set(3, 1, 6, stoneDk);
    g.box([1, 5], [3, 7], [2, 3], stoneLt).box([2, 4], [8, 8], [2, 3], stoneLt).box([1, 5], [3, 3], [2, 4], stoneDk);
    g.box([3, 3], [4, 6], [3, 3], glowDk).set(2, 5, 3, glowDk).set(4, 5, 3, glowDk);
    g.box([2, 4], [8, 8], [2, 3], moss).set(1, 7, 3, moss).set(5, 7, 3, mossLt);
    return g.entry({ id: 'cand-p7-bixi', name: 'Stone Tortoise' });
  })(),

  // a little stone hare on a mossy plinth, long ears up, paws together,
  // wearing a faded red bib someone tied on long ago
  (() => {
    const g = grid(5, 10, 5);
    g.box([0, 4], [0, 0], [0, 4], stoneDk).box([0, 4], [1, 1], [0, 4], (x, y, z) => ((x + z) % 3 ? moss : mossDk));
    g.ellipsoid([2, 3.6, 2], [1.9, 1.6, 1.7], stone).ellipsoid([2, 5.8, 2.3], [1.5, 1.3, 1.4], stone);
    g.box([1, 3], [4, 4], [3, 3], red).set(2, 3, 4, red);
    pairFront(g, 1, 6, INK); front(g, 2, 5, pink); pairFront(g, 1, 5, BLUSH);
    pair(g, 1, 7, 2, stone); pair(g, 1, 8, 2, stone); pair(g, 1, 9, 2, mossLt);           // ears, moss-tipped
    pair(g, 1, 3, 4, stoneLt);                                                            // paws together
    g.set(2, 4, 0, stoneLt);
    return g.entry({ id: 'cand-p7-stone-hare', name: 'Stone Hare' });
  })(),

  // a pika on a mossy rock pile: a round tawny ball with big round ears,
  // a stalk of yellow flowers in its mouth, the talus stones in three greys
  (() => {
    const g = grid(8, 8, 6);
    g.ellipsoid([3.5, 1, 2.5], [3.6, 1.6, 2.6], stoneDk).ellipsoid([2, 2.4, 2.2], [2, 1.5, 1.8], stone)
      .ellipsoid([5.6, 1.8, 3], [1.8, 1.3, 1.8], slate);
    tint(g, (x, y, z) => onSurface(g, x, y, z) && y >= 1 && (x + z) % 4 === 0, moss);
    g.ellipsoid([4, 4.3, 3], [1.9, 1.6, 1.7], pika);
    tint(g, (x, y, z) => y <= 4 && z >= 4 && Math.abs(x - 4) <= 1 && g.get(x, y, z) === pika, pikaLt);
    for (const [x, y] of [[3, 6], [2, 6], [2, 7], [3, 7]]) { g.set(x, y, 3, pika).set(8 - x, y, 3, pika); }
    g.set(2, 6, 4, pink).set(6, 6, 4, pink);
    g.set(3, 5, 5, INK).set(5, 5, 5, INK).set(4, 4, 5, INK);
    g.set(5, 4, 5, mossDk).set(6, 4, 5, mossDk).set(7, 5, 5, yellow).set(7, 4, 5, mossDk).set(7, 3, 5, yellow);
    return g.entry({ id: 'cand-p7-pika', name: 'Pika on the Rocks' });
  })(),

  // a stone circle on a grassy mound: eight stones of different heights round
  // a low altar with a glowing rune, one stone fallen flat
  (() => {
    const g = grid(9, 5, 9);
    g.cylinder('y', [4, 4], 4.4, [0, 0], moss).cylinder('y', [4, 4], 2.4, [0, 0], mossDk);
    const stones = [[[3, 4], 0, 3], [[7, 8], 1, 4], [[8, 8], 4, 2], [[7, 8], 7, 3], [[3, 4], 8, 4], [[0, 1], 7, 2], [[0, 0], 3, 3]];
    for (const [[x0, x1], z, h] of stones) g.box([x0, x1], [1, h], [z, z], (x, y) => (y === h ? stoneLt : stone));
    g.box([8, 8], [1, 2], [3, 4], stone).set(8, 2, 4, stoneLt);
    g.box([1, 2], [1, 1], [1, 2], stoneDk);                                       // the fallen one
    g.box([3, 5], [1, 1], [3, 5], stoneDk).set(4, 1, 4, glow);
    g.set(1, 2, 7, mossLt).set(4, 4, 8, mossLt);
    return g.entry({ id: 'cand-p7-stone-circle', name: 'Stone Circle' });
  })(),

  // a broken column, fluted and leaning on its plinth, ivy climbing it in a
  // slow spiral, its toppled capital lying beside it in the grass
  (() => {
    const g = grid(7, 9, 5);
    g.box([0, 6], [0, 0], [0, 4], moss).box([0, 4], [1, 1], [0, 4], stoneDk);
    g.cylinder('y', [2, 2], 1.6, [2, 7], (x, y, z) => ((x + z) % 2 ? stoneLt : stone));
    g.set(1, 7, 2, 0).set(2, 7, 1, 0).set(3, 7, 3, 0).set(2, 8, 2, stoneLt).set(3, 8, 2, stoneLt);
    for (const [x, y, z] of [[3, 2, 4], [4, 3, 3], [4, 4, 2], [4, 5, 1], [3, 6, 0], [1, 6, 0]]) g.set(x, y, z, x === 4 || z === 4 || z === 0 ? mossDk : moss);
    g.set(4, 2, 4, mossDk).set(4, 3, 4, moss);
    g.box([4, 6], [1, 2], [2, 4], stone).box([4, 6], [1, 1], [2, 4], stoneLt).set(5, 2, 4, stoneDk).set(6, 2, 2, moss);
    g.set(6, 1, 1, pink);
    return g.entry({ id: 'cand-p7-broken-column', name: 'Broken Column' });
  })(),

  // a holed stone between two standing stones, the hole worn round and the
  // ring furred with moss on top and lichen on its face
  (() => {
    const g = grid(9, 8, 4);
    g.box([0, 8], [0, 0], [0, 3], moss);
    g.cylinder('z', [4, 3.6], 3.4, [1, 2], stone).cylinder('z', [4, 3.6], 1.4, [1, 2], 0);
    g.box([0, 8], [0, 0], [0, 3], (x, y, z) => (g.get(x, y, z) === moss ? moss : mossDk));
    tint(g, (x, y, z) => y >= 5 && onSurface(g, x, y, z) && g.get(x, y + 1, z) === 0 && y > 3, moss);
    g.set(2, 3, 2, lichen).set(6, 5, 2, lichen).set(5, 1, 2, lichen);
    g.box([0, 0], [1, 4], [1, 2], stoneDk).set(0, 5, 1, stoneDk).box([8, 8], [1, 3], [1, 2], stoneDk);
    return g.entry({ id: 'cand-p7-holed-stone', name: 'Holed Stone' });
  })(),

  // a trilithon: two tapering uprights and a lintel with its tenon bumps,
  // ivy trailing from the lintel, a stepping-stone path through the door
  (() => {
    const g = grid(8, 9, 5);
    g.box([0, 7], [0, 0], [0, 4], moss);
    for (const x0 of [0, 5]) g.box([x0, x0 + 2], [1, 4], [1, 2], stone).box([x0 + (x0 ? 0 : 1), x0 + (x0 ? 1 : 2)], [5, 6], [1, 2], stone);
    g.box([0, 7], [7, 8], [1, 2], stoneLt).box([0, 7], [7, 7], [2, 2], stone);
    g.set(1, 6, 1, stoneDk).set(6, 6, 1, stoneDk);
    for (const [x, y] of [[3, 6], [3, 5], [4, 6], [6, 5], [6, 4], [2, 3]]) g.set(x, y, 3, x === 3 ? mossDk : moss);
    g.set(3, 7, 3, moss).set(4, 7, 3, moss).set(6, 7, 3, moss).set(2, 4, 3, moss);
    g.box([3, 4], [0, 0], [1, 1], stoneDk).box([3, 4], [0, 0], [3, 4], stoneDk);
    return g.entry({ id: 'cand-p7-trilithon', name: 'Trilithon' });
  })(),

  // a clapper bridge: three long slabs on stacked-stone piers across a
  // stream, mossy banks, the water running under
  (() => {
    const g = grid(9, 4, 5);
    g.box([0, 8], [0, 0], [0, 4], (x, y, z) => (z === 0 || z === 4 ? moss : water));
    g.box([0, 0], [0, 1], [1, 3], mossDk).box([8, 8], [0, 1], [1, 3], mossDk);
    for (const x of [3, 5]) g.box([x, x], [0, 1], [1, 3], (xx, y) => (y ? stoneDk : stone));
    g.box([0, 2], [2, 2], [1, 3], stone).box([3, 5], [2, 2], [1, 3], stoneLt).box([6, 8], [2, 2], [1, 3], stone);
    g.set(2, 3, 1, mossLt).set(6, 3, 3, mossLt).set(1, 1, 0, moss).set(7, 1, 4, moss);
    return g.entry({ id: 'cand-p7-clapper-bridge', name: 'Clapper Bridge' });
  })(),

  // a sundial on a stepped stone pedestal: a bronze dial with hour marks and
  // a tall gnomon, moss creeping up the steps
  (() => {
    const g = grid(7, 9, 7);
    g.box([0, 6], [0, 0], [0, 6], stoneDk).box([1, 5], [1, 1], [1, 5], stone);
    tint(g, (x, y, z) => y === 0 && (x + z) % 3 === 0, moss);
    g.box([2, 4], [2, 4], [2, 4], stone).box([2, 4], [3, 3], [2, 4], stoneLt);
    g.box([1, 5], [5, 5], [1, 5], stone);
    g.box([1, 5], [6, 6], [1, 5], bronze);
    for (const [x, z] of [[1, 3], [3, 1], [5, 3], [3, 5], [1, 1], [5, 1], [1, 5], [5, 5]]) g.set(x, 6, z, bronzeDk);
    g.box([2, 4], [7, 7], [3, 3], bronzeDk).box([3, 4], [8, 8], [3, 3], bronzeDk);
    g.set(1, 1, 5, moss).set(1, 1, 4, moss).set(2, 2, 4, mossLt);
    return g.entry({ id: 'cand-p7-sundial', name: 'Sundial' });
  })(),

  // a giant's stone hand rising from a mossy mound, palm up, fingers curled
  // at the back and the thumb at the side, holding a nest of blue eggs
  (() => {
    const g = grid(7, 8, 7);
    g.ellipsoid([3, 0, 3], [3.4, 1.3, 3.4], moss);
    g.box([2, 4], [1, 3], [2, 4], stone);
    g.box([1, 5], [4, 4], [1, 5], stone).box([2, 4], [4, 4], [2, 4], twig);
    for (const x of [1, 3, 5]) g.box([x, x], [5, 7], [1, 2], stone).set(x, 7, 3, stoneLt);
    g.box([6, 6], [4, 5], [3, 4], stone).set(6, 6, 4, stoneLt);
    g.set(2, 5, 3, twig).set(4, 5, 3, twig).set(3, 5, 4, twig).set(3, 5, 2, twig);
    g.set(3, 5, 3, egg).set(4, 5, 4, egg);
    tint(g, (x, y, z) => g.get(x, y, z) === stone && y <= 2 && (x + z) % 2 === 0, mossDk);
    return g.entry({ id: 'cand-p7-stone-hand', name: "Giant's Hand" });
  })(),
];
