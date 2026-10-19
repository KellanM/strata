// Page 10 · III Windward Downs: open grass to the edge of the sky, and the
// wind going your way. A candidate to replace Teatime as chapter II: the
// first wide horizon after home. Small things of the open hills: a thistle,
// a fairy ring, a skylark, a hare, a black-faced sheep, a wild pony, a
// wind-bent tree, a shepherd's hut; and two shrines, a white horse cut in
// the chalk of a hill, and the wind tree where travellers tie ribbons.
// Sky: deep blue overhead to a white haze at the horizon; greens and
// browns carry the objects, whites only where they mean wool or chalk.
// Clue settings (fraction, seed) put each card's D where it would sit in
// a chapter II ramp.
import { grid } from '../voxel.js';
import { INK, BLUSH, front, out, frontZ, pair, pairFront, pairZ, quad, kawaii, tint, onSurface, sheet, plan } from './kit.js';

const grass = 0x7cbf5f, grassLt = 0x9fd47a, grassDk = 0x5c9e4f, chalk = 0xf7f4ec, flint = 0x8a8d96,
  thistle = 0xa76fc0, thistleLt = 0xc99ad8, leaf = 0x6aa257, leafDk = 0x4f8a45,
  wood = 0x9a6440, woodDk = 0x6b4a3a, gold = 0xe9b949,
  lark = 0xb5946a, larkLt = 0xe8d6b8, larkDk = 0x7a5a3a, beak = 0xc9952f,
  hare = 0xb98a5c, hareLt = 0xe8d3b0, pink = 0xe89a9a,
  wool = 0xf3efe6, woolSh = 0xe0dbcf, face = 0x3a3442, eyeLt = 0xf6efe4,
  pony = 0x9a6440, mane = 0x4a3a32, blaze = 0xfbf8f2,
  trunk = 0x7a5a48, crown = 0x6fbf73, crownLt = 0x9fd47a,
  hutWall = 0x6f9f7a, hutDk = 0x4f7a5a, tin = 0x9aa3ad, iron = 0x3f3a48, glow = 0xf6d365, red = 0xe0565b,
  toadstem = 0xf3ead6, toadcap = 0xd9413a, toadcap2 = 0xc98a4a;
const RIBBONS = [0xe0565b, 0xf6d365, 0x5b8fd6, 0xf4a3b5];

export default [
  // a thistle: a rosette of spiky leaves, a stem with one leaf, a green
  // bulb and its purple brush on top
  (() => {
    const g = grid(5, 7, 5);
    g.box([0, 4], [0, 0], [2, 2], leaf).box([2, 2], [0, 0], [0, 4], leaf).set(2, 0, 2, leafDk);
    g.set(0, 1, 2, leaf).set(4, 1, 2, leaf).set(2, 1, 0, leaf).set(2, 1, 4, leaf);
    g.box([2, 2], [1, 3], [2, 2], leafDk).set(1, 2, 2, leaf).set(3, 3, 2, leaf);
    g.box([1, 3], [4, 4], [2, 2], leafDk).box([2, 2], [4, 4], [1, 3], leafDk);
    g.box([1, 3], [5, 5], [1, 3], thistle).box([1, 3], [6, 6], [2, 2], thistleLt).box([2, 2], [6, 6], [1, 3], thistleLt);
    return g.entry({ id: 'cand-p10-thistle', name: 'Thistle', fraction: 0.15, seed: 13,
      story: 'Prickly to touch, and the bees love it anyway.' });
  })(),

  // a fairy ring: a circle of little toadstools come up overnight on the
  // hilltop, the grass inside it greener than the grass outside
  (() => {
    const g = grid(7, 3, 7);
    g.cylinder('y', [3, 3], 3.2, [0, 0], (x, y, z) => (Math.hypot(x - 3, z - 3) < 1.9 ? grassLt : grass));
    // round the ring: red caps and brown caps by turns
    [[3, 0], [5, 1], [6, 3], [5, 5], [3, 6], [1, 5], [0, 3], [1, 1]].forEach(([x, z], k) => {
      g.set(x, 1, z, toadstem).set(x, 2, z, k % 2 ? toadcap2 : toadcap);
    });
    return g.entry({ id: 'cand-p10-fairy-ring', name: 'Fairy Ring', fraction: 0.3, seed: 12,
      story: 'Step inside, and the wind starts to sound like music.' });
  })(),

  // a skylark singing on a grass tuft: streaky brown back, a pale breast, a
  // little crest, its beak up at the sky
  (() => {
    const g = grid(8, 6, 3);
    g.box([2, 5], [0, 0], [0, 2], grass).set(2, 0, 0, 0).set(5, 0, 2, 0).set(3, 1, 0, grassLt);
    g.box([2, 5], [1, 2], [0, 2], lark).set(2, 1, 0, 0).set(2, 1, 2, 0).set(5, 2, 0, 0).set(5, 2, 2, 0);
    g.box([4, 5], [1, 1], [0, 2], larkLt).set(5, 2, 1, larkLt);
    g.set(3, 2, 0, larkDk).set(3, 2, 2, larkDk);                                    // folded wings, streaked
    g.box([5, 6], [3, 3], [0, 2], lark).set(6, 3, 0, 0).set(6, 3, 2, 0).set(5, 4, 1, larkDk).set(4, 4, 1, larkDk);   // head and crest
    pairZ(g, 5, 3, 0, INK);
    g.set(7, 4, 1, beak).set(6, 4, 1, beak);                                       // singing up at the sky
    g.box([0, 1], [2, 2], [1, 1], larkDk).set(0, 3, 1, larkDk);                    // tail
    return g.entry({ id: 'cand-p10-skylark', name: 'Skylark', fraction: 0.4, seed: 3,
      story: 'It sings so high you hear it long before you find it.' });
  })(),

  // a brown hare sitting up: long ears with black tips, big hind feet, a
  // pale belly and a white scut behind
  (() => {
    const g = grid(5, 9, 5);
    g.ellipsoid([2, 1.9, 2], [1.7, 1.9, 1.6], hare);
    tint(g, (x, y, z) => z >= 3 && y <= 2 && x === 2, hareLt);
    g.ellipsoid([2, 4.3, 2.6], [1.5, 1.2, 1.3], hare);
    pair(g, 1, 6, 2, hare); pair(g, 1, 7, 2, hare); pair(g, 1, 8, 2, face);
    pairFront(g, 1, 4, INK);
    front(g, 2, 4, pink);
    pair(g, 1, 0, 3, hareLt); pair(g, 1, 0, 4, hareLt);                           // big hind feet
    g.set(2, 1, 0, chalk);
    return g.entry({ id: 'cand-p10-hare', name: 'Brown Hare', fraction: 0.25, seed: 1,
      story: 'It sat up to watch you pass, then decided you were fine.' });
  })(),

  // a black-faced sheep on the hill: a cloud of cream wool, dark legs, ears
  // out sideways, pale eyes in a dark face
  (() => {
    const g = grid(7, 6, 5);
    for (const x of [1, 4]) for (const z of [1, 3]) g.set(x, 0, z, face).set(x, 1, z, face).set(x, 2, z, wool);
    g.ellipsoid([2.6, 3, 2], [2.4, 1.4, 1.8], wool);
    tint(g, (x, y, z) => onSurface(g, x, y, z) && (x + 2 * y + Math.abs(z - 2)) % 3 === 0, woolSh);
    g.box([5, 6], [3, 4], [1, 3], face).set(6, 4, 1, 0).set(6, 4, 3, 0).set(5, 5, 2, wool);
    pairZ(g, 6, 3, 1, eyeLt);
    pairZ(g, 5, 4, 0, face);
    g.set(0, 3, 2, wool);
    return g.entry({ id: 'cand-p10-sheep', name: 'Hill Sheep', fraction: 0.5, seed: 8,
      story: 'Black face, cream coat, no opinion about where you are going.' });
  })(),

  // a wild pony with the wind in its mane: bay coat, a white blaze, dark
  // legs, mane and tail streaming back
  (() => {
    const g = grid(8, 7, 5);
    for (const x of [2, 5]) for (const z of [1, 3]) g.set(x, 0, z, mane).set(x, 1, z, pony);
    g.box([1, 5], [2, 3], [1, 3], pony);
    g.box([6, 6], [3, 4], [2, 2], pony).box([6, 7], [4, 5], [1, 3], pony).set(7, 4, 1, 0).set(7, 4, 3, 0);
    g.set(7, 5, 2, blaze).set(7, 4, 2, blaze);
    pairZ(g, 6, 5, 1, INK);
    pairZ(g, 6, 6, 1, pony);
    g.set(5, 4, 2, mane).set(5, 5, 2, mane).set(4, 4, 2, mane);                    // mane, blowing back
    g.set(0, 3, 2, mane).set(0, 2, 2, mane).set(0, 1, 2, mane);                    // tail
    return g.entry({ id: 'cand-p10-wind-pony', name: 'Wild Pony', fraction: 0.5, seed: 3,
      story: 'Nobody owns it. It runs with the wind because it wants to.' });
  })(),

  // a lone tree on a round green knoll, bent by years of one wind, its
  // crown swept all to one side
  (() => {
    const g = grid(7, 7, 5);
    g.ellipsoid([3, 0, 2], [3.3, 1.0, 2.4], grass);
    g.ellipsoid([3, 1, 2], [2.2, 0.6, 1.4], grassLt);
    g.set(2, 1, 2, trunk).set(2, 2, 2, trunk).set(2, 3, 2, trunk).set(3, 3, 2, trunk).set(3, 4, 2, trunk);
    g.ellipsoid([4.2, 5.1, 2], [2.4, 1.4, 1.7], crown);
    tint(g, (x, y, z) => g.get(x, y, z) === crown && !g.get(x, y + 1, z) && x <= 4, crownLt);
    g.set(6, 5, 2, crown).set(6, 4, 2, crown);
    return g.entry({ id: 'cand-p10-lone-tree', name: 'Lone Tree', fraction: 0.25, seed: 5,
      story: 'One wind, blowing the same way for a hundred years.' });
  })(),

  // a shepherd's hut on iron wheels: green planks, a curved tin roof, a lit
  // window, a red door at the end with a step, smoke from the stovepipe
  (() => {
    const g = grid(8, 7, 5);
    for (const x of [1, 5]) g.box([x, x], [0, 0], [0, 4], iron);                  // wheels on their axles
    g.box([0, 6], [1, 1], [1, 3], woodDk);
    g.box([0, 6], [2, 3], [1, 3], hutWall).box([0, 6], [2, 2], [1, 3], hutDk);
    g.set(3, 3, 3, glow).set(3, 3, 1, glow);
    g.box([6, 6], [2, 3], [2, 2], red).set(7, 1, 2, wood);
    g.box([0, 6], [4, 4], [0, 4], tin).box([0, 6], [5, 5], [1, 3], tin);
    g.set(1, 6, 2, iron);
    return g.entry({ id: 'cand-p10-shepherds-hut', name: "Shepherd's Hut", fraction: 0.55, seed: 12,
      story: 'A stove, a bunk, a window. Everything a hill needs.' });
  })(),

  // shrine: a white horse cut into the chalk of a green hill, long and
  // leaping, the way it has been kept since before anyone remembers
  (() => {
    const g = grid(10, 5, 3);
    const h = [2, 3, 4, 4, 5, 5, 5, 5, 4, 3];
    h.forEach((n, x) => g.box([x, x], [0, n - 1], [0, 1], (xx, y) => (y === n - 1 ? grassLt : grass)));
    sheet(g, [
      '.......WW.',
      '.WWWWWWW..',
      '...WWWW...',
      '...W..W...',
    ], [2, 2], { W: chalk });
    g.set(0, 0, 2, grassDk).set(9, 0, 2, grassDk);
    return g.entry({ id: 'cand-p10-chalk-horse', name: 'The Chalk Horse', fraction: 0.7, seed: 13,
      story: 'Cut into the hill so long ago that the hill remembers it.' });
  })(),

  // shrine: the wind tree on its hill, old and broad, with ribbons tied to
  // its branches by everyone who passed, all streaming one way
  (() => {
    const g = grid(9, 7, 5);
    g.ellipsoid([4, 0, 2], [4.4, 1.0, 2.4], grass);
    g.ellipsoid([3.6, 1, 2], [2.6, 0.6, 1.4], grassLt);
    g.box([3, 3], [1, 4], [2, 2], trunk).set(2, 1, 2, trunk).set(4, 1, 2, trunk);
    g.box([1, 7], [4, 4], [2, 2], trunk);                                         // the long low limbs
    g.ellipsoid([3.4, 5.3, 2], [2.6, 1.5, 1.8], crown);
    g.ellipsoid([6.4, 5, 2], [1.5, 1.1, 1.4], crown);
    tint(g, (x, y, z) => g.get(x, y, z) === crown && !g.get(x, y + 1, z), crownLt);
    // ribbons tied along the limbs, every one streaming the same way
    [[1, 0], [2, 1], [5, 2], [7, 3]].forEach(([x, k]) => g.set(x, 3, 2, RIBBONS[k]).set(x + 1, 3, 2, RIBBONS[k]));
    g.set(8, 4, 2, RIBBONS[0]);
    return g.entry({ id: 'cand-p10-wind-tree', name: 'The Wind Tree', fraction: 0.75, seed: 4,
      story: 'Everyone who passes ties a ribbon. The wind reads them all.' });
  })(),
];
