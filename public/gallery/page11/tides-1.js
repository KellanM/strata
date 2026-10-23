// Page 11 · III The Tide Caves: the sea once came up to these cliffs, and
// when it went back its children stayed behind and turned to stone. The tide
// type: an ammonite that crawled out of its fossil, a crab with barnacles on
// its back, a frog on a rock beside its pool, a hermit peeping out of a conch,
// and a whale surfacing from the grass with its spout still going.
// Sky: the Lagoon's sea-glass blue, so the stone stays warm sand and the
// tide accent (sea blue, foam white) is the living part of each creature.
import { grid } from '../voxel.js';
import { INK, BLUSH, S, front, out, pair, pairAt, pairFront, pairFrontAt, quad, tint, onSurface, lathe } from './kit.js';

const { stone, stoneLt, stoneDk, sand, sandDk, moss, mossDk, mossLt, tide, tideDk, foam, barnacle, kelp, pink, red, cream } = S;

export default [
  // an ammonite that crawled out of its own fossil: the spiral shell with its
  // ribs, and underneath, a tide-blue head with two round eyes and a fringe
  // of tentacles feeling the ground
  (() => {
    const g = grid(8, 8, 5);
    const [cx, cy] = [3.5, 4.3];
    g.cylinder('z', [cx, cy], 3.7, [0, 2], stone);
    tint(g, (x, y, z) => z === 0 || z === 2, (x, y) => {
      const r = Math.hypot(x - cx, y - cy), th = Math.atan2(y - cy, x - cx) / (2 * Math.PI);
      return Math.floor((r + th * 2.6) / 1.3) % 2 ? stoneLt : sandDk;
    });
    g.box([2, 5], [0, 2], [3, 4], tide);                                                // the head
    pairFrontAt(g, 3.5, 2, 2, INK); pairFrontAt(g, 3.5, 2, 1, BLUSH);
    for (const x of [2, 3, 4, 5]) g.set(x, 0, 4, x % 2 ? tideDk : tide);
    pairAt(g, 3.5, 1, 0, 4, tideDk); pairAt(g, 3.5, 1, 0, 3, tide);                      // tentacles
    return g.entry({ id: 'cand-p11-ammonite', name: 'Ammonite Crawler', story: 'It waited a million years in the rock, then got up.' });
  })(),

  // a crab with barnacles on its back, both claws raised, stalk eyes up and
  // three legs a side
  (() => {
    const g = grid(10, 6, 6);
    g.ellipsoid([4.5, 1.6, 2.5], [3.3, 1.7, 2.8], stone);
        g.set(4, 3, 2, barnacle).set(5, 3, 2, barnacle).set(4, 3, 1, barnacle).set(5, 3, 3, barnacle);
    for (const z of [1, 2, 3]) { pair(g, 1, 1, z, stone); pair(g, 0, 1, z, stone); pair(g, 0, 0, z, stoneDk); }   // legs
    pair(g, 1, 1, 4, stone); pair(g, 1, 2, 4, stone);                                     // arms
    for (const y of [3, 4]) for (const x of [0, 1]) for (const z of [4, 5]) pair(g, x, y, z, x ? stone : tide);   // claws
    pair(g, 0, 5, 4, tideDk);
    pairAt(g, 4.5, 3, 3, 4, stone); pairAt(g, 4.5, 3, 4, 4, INK);                         // stalk eyes
    return g.entry({ id: 'cand-p11-barnacle-crab', name: 'Barnacle Crab', story: 'The barnacles think it is a rock. It lets them.' });
  })(),

  // a frog sitting up on a lily stone in its pool: round and sea-green, big
  // eyes on top, a pale throat, its pool clear blue round it
  (() => {
    const g = grid(7, 6, 7);
    const frog = 0x7fbfae, frogDk = 0x4f9a8a;
    g.cylinder('y', [3, 3], 3.4, [0, 0], tide);
    tint(g, (x, y, z) => (x + z * 3) % 7 === 0, foam);
    g.cylinder('y', [3, 3], 2.2, [0, 0], kelp);                                         // the lily stone
    g.ellipsoid([3, 2.4, 3], [2.6, 1.7, 2.3], frog);
    tint(g, (x, y, z) => g.get(x, y, z) === frog && y <= 2 && z >= 4 && x >= 2 && x <= 4, cream);
    for (const x of [1, 2]) pair(g, x, 4, 4, frog);                                     // the eye bumps
    pair(g, 1, 4, 3, frog); pair(g, 1, 5, 4, frogDk); pair(g, 2, 5, 4, frogDk);
    pair(g, 1, 4, 5, INK);
    pair(g, 1, 1, 5, frogDk); pair(g, 1, 0, 5, frogDk);                                  // front feet
    return g.entry({ id: 'cand-p11-pool-frog', name: 'Pool Frog', story: 'When the sea left, it kept one pool for itself.' });
  })(),

  // a conch lying with its mouth toward you, sand and cream bands round the
  // spire, the pink lip of the opening, and a little hermit peeping out
  (() => {
    const g = grid(7, 8, 7);
    lathe(g, [3, 3], 0, [3.2, 3.2, 2.8, 2.3, 1.8, 1.3, 0.8, 0.4], sand);
    tint(g, (x, y) => y % 2 === 1, cream);
    g.box([2, 4], [0, 2], [4, 6], 0).box([2, 4], [0, 2], [4, 4], pink);                  // the opening
    g.box([1, 5], [3, 3], [5, 6], (x, y, z) => (g.get(x, y, z) ? pink : 0));
    g.box([2, 4], [0, 1], [5, 5], red);                                                 // the hermit
    pair(g, 2, 2, 5, red); pair(g, 2, 2, 6, INK);                                        // eyes
    pair(g, 2, 0, 6, red);                                                              // claws
    return g.entry({ id: 'cand-p11-conch-hermit', name: 'Conch Hermit', story: 'It found a shell the sea forgot to take back.' });
  })(),

  // a whale surfacing from a sea of grass, half stone, a few barnacles, its
  // tail flukes up behind and its spout still rising
  (() => {
    const g = grid(10, 6, 6);
    g.box([0, 9], [0, 0], [0, 5], (x, y, z) => ((x + z) % 4 ? moss : mossDk));
    g.ellipsoid([5.6, 1, 2.5], [4.4, 2.6, 2.6], stone);
    tint(g, (x, y, z) => y === 1 && x >= 7 && onSurface(g, x, y, z), stoneLt);           // pale jaw
    g.set(8, 2, 4, INK).set(8, 2, 1, INK);                                              // an eye on each flank
    g.box([1, 1], [1, 3], [2, 3], stone).box([0, 2], [4, 4], [0, 5], stone).box([1, 2], [4, 4], [2, 3], stoneDk);   // the flukes
    g.set(4, 3, 2, barnacle).set(4, 3, 3, barnacle).set(5, 3, 3, barnacle);
    g.box([7, 7], [4, 4], [2, 3], tide).box([7, 7], [5, 5], [1, 4], foam);              // the spout
    return g.entry({ id: 'cand-p11-grass-whale', name: 'Grass Whale', story: 'It still breathes, once a year, when the tide should come.' });
  })(),
];
