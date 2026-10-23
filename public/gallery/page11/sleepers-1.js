// Page 11 · I The Sleepers: creatures of the old world who lay down before
// the dark came and never got up. Half of them are stone now, all of them
// are mossy, and some are only dozing - a bear nodding off sitting up, a
// stag whose antlers grew into a little tree, a fox wrapped in its own tail,
// a boar with a mossy ridge, a pebble sprite (awake, and curious about you),
// and what a pebble sprite grows into: a cairnback, carrying the stones.
// Sky: the Old Stones mist (grey-green), so the stone leans warm sandstone
// and the moss is a bright spring green; closed eyes are a dark seam in the
// stone, open eyes are ink, and cyan is kept for the rune still glowing.
import { grid } from '../voxel.js';
import { INK, BLUSH, S, front, out, pair, pairAt, pairFront, pairFrontAt, quad, tint, onSurface, sleepy } from './kit.js';

const { stone, stoneLt, stoneDk, basalt, moss, mossDk, mossLt, glow, pink, cream } = S;

export default [
  // a stone bear asleep sitting up, head nodding, paws folded on its belly
  // and its feet stuck out in front; a cap of moss on its head and shoulders
  // with one pink flower growing out of it
  (() => {
    const g = grid(7, 9, 6);
    g.ellipsoid([3, 2.4, 2.5], [3.2, 2.6, 2.7], stone);
    g.ellipsoid([3, 5.6, 3], [2.4, 2.0, 2.0], stone);
    pair(g, 1, 7, 3, stone); pair(g, 1, 7, 2, stoneDk);                                 // round ears
    g.box([2, 4], [4, 4], [5, 5], stoneLt).set(3, 5, 5, stoneLt).set(3, 5, 5, INK);       // muzzle, nose
    sleepy(g, 1, 6, basalt);
    for (const z of [4, 5]) { pair(g, 1, 0, z, stoneDk); pair(g, 2, 0, z, stoneDk); }    // feet out in front
    pair(g, 2, 3, 5, stoneLt);                                                          // paws on the belly
    tint(g, (x, y, z) => onSurface(g, x, y, z) && !g.get(x, y + 1, z) && (y >= 7 || (y >= 4 && z <= 2)), moss);
    tint(g, (x, y, z) => g.get(x, y, z) === moss && (x + 2 * z) % 4 === 0, mossLt);
    g.set(4, 8, 2, mossDk).set(4, 8, 3, pink);
    return g.entry({ id: 'cand-p11-moss-bear', name: 'Sleeping Bear', story: 'It sat down for one winter. The moss kept the rest.' });
  })(),

  // a pebble sprite: a round stone no bigger than a fist, two leaf ears, big
  // ink eyes, stubby feet; the first creature that ever came to see you
  (() => {
    const g = grid(7, 7, 5);
    g.ellipsoid([3, 2.5, 2], [2.8, 2.4, 2.3], stone);
    tint(g, (x, y, z) => y <= 1 && onSurface(g, x, y, z), stoneDk);
    pairFront(g, 2, 3, INK); pairFront(g, 2, 2, INK);                                   // tall eyes
    pairFront(g, 1, 2, BLUSH);
    pair(g, 1, 5, 2, moss); pair(g, 1, 6, 2, mossLt); pair(g, 0, 6, 2, mossLt);           // leaf ears
    g.set(3, 5, 2, mossDk);
    pair(g, 2, 0, 3, stoneDk);
    return g.entry({ id: 'cand-p11-pebblet', name: 'Pebblet', story: 'It was a pebble until you looked at it.' });
  })(),

  // a stag lying down and facing you, its mossy antlers grown into a little
  // tree with pink blossom at the tips; ears out, a white scut behind
  (() => {
    const g = grid(7, 8, 6);
    g.box([1, 5], [0, 2], [0, 3], stone).box([2, 4], [3, 3], [0, 2], stone);            // the body, lying down
    pair(g, 0, 0, 2, stoneDk); pair(g, 0, 0, 3, stoneDk); pair(g, 0, 0, 4, stoneDk);       // folded legs
    g.box([2, 4], [3, 5], [3, 4], stone);                                               // the head
    g.set(3, 3, 5, stoneLt).set(3, 4, 5, INK);                                          // muzzle, dark nose
    pair(g, 2, 4, 4, INK);                                                              // eyes
    pair(g, 1, 5, 3, stone); pair(g, 0, 5, 3, stoneDk);                                   // ears
    pair(g, 2, 6, 3, mossDk); pair(g, 2, 7, 3, moss); pair(g, 1, 7, 3, moss);              // antlers
    pair(g, 1, 6, 3, mossLt); pair(g, 0, 7, 3, pink);
    g.set(3, 3, 0, cream);                                                              // a white scut
    tint(g, (x, y, z) => g.get(x, y, z) === stone && z <= 2 && !g.get(x, y + 1, z), moss);
    return g.entry({ id: 'cand-p11-mossbuck', name: 'Mossbuck', story: 'Every spring its antlers flower. Nobody has seen it stand.' });
  })(),

  // a fox curled nose to tail on a flat stone, its brush wrapped round the
  // front with a pale tip, two pointed ears up even in sleep
  (() => {
    const g = grid(8, 6, 8);
    const fox = 0xd9a77c, foxDk = 0xb87f55;
    g.box([0, 7], [0, 0], [0, 7], stoneDk).box([1, 6], [0, 0], [1, 6], stone);
    g.ellipsoid([3.5, 1.8, 3.2], [3.2, 1.6, 2.8], fox);
    g.box([0, 4], [1, 2], [6, 6], fox).box([0, 1], [1, 2], [5, 5], fox).set(0, 2, 6, cream).set(1, 2, 6, cream).set(0, 1, 6, cream);
    g.box([4, 6], [1, 3], [4, 6], fox);                                                 // the head, resting on the brush
    g.set(5, 1, 7, foxDk).set(5, 2, 7, cream);
    g.set(4, 3, 6, INK).set(6, 3, 6, INK);                                              // eyes shut tight
    pairAt(g, 5, 4, 4, 5, foxDk); pairAt(g, 5, 4, 5, 5, foxDk); pairAt(g, 5, 4, 4, 4, fox);     // ears
    tint(g, (x, y, z) => y >= 3 && z <= 3 && onSurface(g, x, y, z) && !g.get(x, y + 1, z), foxDk);
    g.set(7, 1, 1, moss).set(6, 1, 0, mossLt);
    return g.entry({ id: 'cand-p11-curled-fox', name: 'Curled Fox', story: 'It wrapped its tail round itself and waited out the dark.' });
  })(),

  // a stone boar, awake and suspicious: long snout, two cream tusks curling
  // up beside it, a ridge of moss bristles down its back, stubby legs
  (() => {
    const g = grid(7, 7, 9);
    g.ellipsoid([3, 3, 3.6], [3.2, 2.6, 3.6], stoneDk);
    g.box([2, 4], [2, 3], [7, 8], stone).set(2, 3, 8, basalt).set(4, 3, 8, basalt);   // snout and nostrils
    pair(g, 1, 2, 7, cream); pair(g, 1, 3, 7, cream);                                     // tusks
    pairFront(g, 1, 4, INK);
    pair(g, 1, 6, 5, basalt); pair(g, 1, 5, 5, stoneDk);                                  // ears
    quad(g, 2, 0, 2, basalt); quad(g, 2, 1, 2, basalt);                                 // legs
    for (let z = 0; z <= 5; z++) g.set(3, 6, z, z % 2 ? moss : mossDk);                   // the bristle ridge
    g.box([3, 3], [5, 5], [0, 6], moss).set(3, 4, 0, moss);
    return g.entry({ id: 'cand-p11-stone-boar', name: 'Stone Boar', story: 'It snored once, and a mountain shifted.' });
  })(),

  // what a pebblet grows into: a slow, low creature with the same leaf ears,
  // carrying a cairn on its back, one stone on top of another, the last one
  // a rune that still glows
  (() => {
    const g = grid(7, 8, 8);
    g.ellipsoid([3, 1.5, 3.4], [3.3, 1.9, 3.5], stone);
    tint(g, (x, y, z) => y === 0, stoneDk);
    g.box([2, 4], [1, 3], [6, 7], stone);                                               // the head
    pair(g, 2, 2, 7, INK); g.set(3, 1, 7, stoneLt);
    pair(g, 2, 4, 6, moss); pair(g, 1, 4, 6, moss); pair(g, 1, 5, 6, mossLt);             // leaf ears
    quad(g, 1, 0, 2, stoneDk);                                                          // feet
    g.box([2, 4], [4, 4], [2, 4], stoneLt).box([2, 4], [5, 5], [2, 4], stoneDk).box([3, 3], [5, 5], [3, 3], stoneDk);
    g.box([2, 4], [5, 5], [2, 4], 0).box([2, 3], [5, 5], [2, 3], stone).set(3, 5, 4, stone).set(4, 5, 3, stone);
    g.set(3, 1, 0, stoneDk).set(3, 6, 3, stoneLt).set(3, 7, 3, glow);                                       // the cairn, and its rune
    g.set(1, 3, 2, moss).set(5, 3, 2, moss).set(1, 3, 4, mossLt).set(5, 3, 4, mossLt);
    return g.entry({ id: 'cand-p11-cairnback', name: 'Cairnback', story: 'It carries every stone anyone ever left for it.' });
  })(),
];
