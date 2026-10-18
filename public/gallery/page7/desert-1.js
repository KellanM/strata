// Page 7 · XII Desert Oasis: heat shimmer, palm shade, cool water. Small desert
// animals with oversized ears and feet, and the crafted things of an oasis
// camp: a striped tent, a keyhole arch, a brass coffee pot, a water lever.
// The sky here is pale gold, so sand-coloured bodies lean warm and deep,
// and every piece carries one cool note (water, teal tile, a blue band).
import { grid } from '../voxel.js';
import { INK, BLUSH, frontZ, front, out, pair, pairFront, quad, tint, onSurface, sheet } from './kit.js';

const sand = 0xe8d3a3, sandDk = 0xd2a86e, camel = 0xc98a4b, camelDk = 0x8f5e33, fennec = 0xeeb06a,
  cream = 0xfbf3e4, pink = 0xf4a3b5, terra = 0xc8704b, terraDk = 0x9c4f33, teal = 0x4fb3a9, water = 0x5bb8d6,
  blue = 0x3f6fb5, red = 0xd9534f, redDk = 0xa83f45, gold = 0xe9b949, brass = 0xd9a842, brassDk = 0x9c7230,
  copper = 0xc96f42, palm = 0x5fae6e, palmDk = 0x3f8a5b, trunk = 0x8a5a3c, trunkDk = 0x6b4a3a, date = 0xd9663a,
  scarab = 0x2f9a8f, scarabDk = 0x1f6f6a, stone = 0x9aa3ad, stoneDk = 0x77808a, basket = 0xd9b06a, basketDk = 0xa8803f,
  sandCat = 0xdcb27a, catStripe = 0x9c7a50, jerboa = 0xe5b77e, meer = 0xc9a06e, meerDk = 0x6b4a3a, gecko = 0x8fd14f,
  plaster = 0xf6efe4, wood = 0x8a5a3c;

export default [
  // a camel calf resting with its legs folded under: one big hump under a
  // red saddle blanket with gold tassels, a neck rising to a smiling head
  (() => {
    const g = grid(9, 9, 5);
    g.box([1, 5], [1, 3], [1, 3], camel);
    for (const x of [1, 5]) for (const z of [1, 3]) g.clear(x, 3, z);
    g.box([1, 2], [0, 0], [1, 3], camelDk).box([4, 5], [0, 0], [1, 3], camelDk);       // folded legs
    g.box([2, 4], [4, 4], [1, 3], red).box([2, 4], [5, 5], [2, 2], camel).set(3, 5, 1, camel).set(3, 5, 3, camel).set(3, 6, 2, camel);
    for (const z of [0, 4]) g.box([2, 4], [3, 3], [z, z], red).set(2, 2, z, gold).set(4, 2, z, gold);
    g.box([6, 6], [2, 3], [1, 3], camel).box([6, 6], [4, 5], [2, 2], camel);            // chest and neck
    g.box([6, 8], [6, 7], [1, 3], camel).clear(8, 7, 1).clear(8, 7, 3);
    g.set(8, 6, 2, camelDk);
    g.set(7, 7, 1, INK).set(7, 7, 3, INK).set(8, 6, 1, BLUSH).set(8, 6, 3, BLUSH);
    g.set(6, 8, 1, camelDk).set(6, 8, 3, camelDk);                                      // ears
    g.set(0, 2, 2, camel).set(0, 1, 2, camelDk);                                        // tail
    return g.entry({ id: 'cand-p7-camel-calf', name: 'Camel Calf' });
  })(),

  // a fennec fox sitting up, all ears: two huge pink-lined ears, a cream
  // face and tummy, and a black-tipped tail wrapped round its paws
  (() => {
    const g = grid(7, 9, 6);
    g.ellipsoid([3, 1.8, 2.4], [2.1, 1.8, 1.8], fennec).ellipsoid([3, 4.4, 2.8], [1.9, 1.4, 1.7], fennec)
      .box([2, 4], [0, 0], [1, 3], fennec);
    tint(g, (x, y, z) => z >= 3 && y <= 3 && Math.abs(x - 3) <= 1, cream);
    for (const x of [2, 3, 4]) front(g, x, 4, cream);
    front(g, 3, 3, cream); out(g, 3, 4, INK);
    pairFront(g, 2, 5, INK);
    for (const z of [2, 3]) for (const [x, y] of [[1, 5], [1, 6], [0, 6], [0, 7], [1, 7], [0, 8]]) pair(g, x, y, z, fennec);
    pair(g, 1, 6, 3, pink); pair(g, 1, 7, 3, pink); pair(g, 0, 7, 3, pink);
    pair(g, 2, 0, 4, cream);
    for (const [x, y, z] of [[5, 0, 1], [5, 0, 2], [6, 0, 2], [6, 1, 2], [6, 0, 3], [6, 1, 3], [6, 0, 4], [5, 0, 4], [5, 0, 5]]) g.set(x, y, z, fennec);
    g.set(4, 0, 5, INK);
    return g.entry({ id: 'cand-p7-fennec', name: 'Fennec Fox' });
  })(),

  // a sand cat peeking out of a woven palm basket: a broad face, wide-set
  // ears, paws on the rim and a banded tail curling out over the side
  (() => {
    const g = grid(7, 8, 7);
    g.cylinder('y', [3, 3], 3, [0, 3], (x, y, z) => (y % 2 ? cream : terra));
    g.cylinder('y', [3, 3], 2, [1, 3], sandCat).cylinder('y', [3, 3], 3, [3, 3], terraDk).cylinder('y', [3, 3], 2, [3, 3], sandCat);
    g.ellipsoid([3, 4.6, 3.3], [2.2, 1.5, 1.7], sandCat);
    for (const [x, y] of [[1, 5], [0, 6], [1, 6]]) { pair(g, x, y, 3, sandCat); pair(g, x, y, 2, sandCat); }
    pair(g, 1, 6, 3, pink);
    for (const x of [2, 3, 4]) front(g, x, 4, cream);
    out(g, 3, 4, pink); pairFront(g, 2, 5, INK); pairFront(g, 1, 4, BLUSH);
    g.set(3, 6, 3, catStripe).set(3, 6, 2, catStripe);
    pair(g, 2, 4, 5, cream); pair(g, 2, 3, 6, cream);                                   // paws over the rim
    g.set(5, 4, 1, sandCat).set(6, 4, 1, catStripe).set(6, 5, 1, sandCat).set(6, 6, 1, INK);   // banded tail, out the back
    return g.entry({ id: 'cand-p7-sand-cat', name: 'Sand Cat in a Basket' });
  })(),

  // a jerboa on its long hind feet, nibbling a seed: tall ears, a round body
  // and a long tail ending in a black-and-white tuft
  (() => {
    const g = grid(10, 8, 4);
    g.box([4, 6], [1, 3], [0, 3], jerboa);
    for (const [x, y] of [[4, 3], [6, 3], [4, 1], [6, 1]]) { g.clear(x, y, 0); g.clear(x, y, 3); }
    g.box([6, 6], [1, 2], [1, 2], cream);
    g.box([5, 8], [4, 5], [0, 3], jerboa);
    for (const [x, y] of [[5, 5], [8, 5], [8, 4], [5, 4]]) { g.clear(x, y, 0); g.clear(x, y, 3); }
    g.set(9, 4, 1, pink).set(9, 4, 2, pink);
    g.set(7, 5, 0, INK).set(7, 5, 3, INK).set(8, 4, 0, BLUSH).set(8, 4, 3, BLUSH);
    for (const z of [0, 3]) g.set(6, 6, z, jerboa).set(6, 7, z, jerboa).set(5, 7, z, jerboa).set(6, 6, z === 0 ? 1 : 2, pink);
    for (const z of [0, 3]) g.box([3, 6], [0, 0], [z, z], camelDk);                                    // long hind feet
    g.set(7, 2, 1, cream).set(7, 2, 2, cream).set(8, 2, 1, trunk).set(8, 2, 2, trunk);                  // paws and a seed
    g.box([1, 3], [1, 1], [1, 1], jerboa).box([0, 0], [1, 2], [1, 2], cream).set(0, 2, 1, INK).set(0, 2, 2, INK);
    return g.entry({ id: 'cand-p7-jerboa', name: 'Jerboa' });
  })(),

  // two meerkats on lookout atop their burrow mound, a parent and a pup,
  // paws held at their chests, dark eye patches, the burrow mouth below
  (() => {
    const g = grid(8, 9, 5);
    g.box([0, 7], [0, 0], [0, 4], sand).box([1, 6], [1, 1], [1, 3], sandDk);
    g.set(3, 0, 4, meerDk).set(4, 0, 4, meerDk);
    const kat = (cx, y0, h, head) => {
      g.box([cx - 1, cx + 1], [y0, y0 + h - 1], [1, 3], meer);
      g.clear(cx - 1, y0 + h - 1, 1).clear(cx + 1, y0 + h - 1, 1);
      g.box([cx, cx], [y0, y0 + h - 2], [3, 3], cream);
      g.set(cx - 1, y0 + h - 2, 4, meer).set(cx + 1, y0 + h - 2, 4, meer);                  // paws at the chest
      const hy = y0 + h;
      g.box([cx - 1, cx + 1], [hy, hy + head - 1], [1, 3], meer).clear(cx - 1, hy + head - 1, 1).clear(cx + 1, hy + head - 1, 1);
      g.set(cx, hy, 3, cream).set(cx, hy, 4, meerDk);                                     // pointed snout, dark nose
      g.set(cx - 1, hy + 1, 3, INK).set(cx + 1, hy + 1, 3, INK);                          // eye patches
      g.set(cx, hy + head, 2, meer);
      g.set(cx, y0, 0, meerDk);
    };
    kat(2, 2, 4, 2);
    kat(6, 2, 2, 2);
    g.set(2, 1, 0, meerDk);
    return g.entry({ id: 'cand-p7-meerkats', name: 'Meerkat Lookout' });
  })(),

  // a scarab rolling its ball: a teal beetle with a split shell edged in
  // gold, little gold horns, three pairs of legs, front feet on a sand ball
  (() => {
    const g = grid(10, 6, 5);
    g.ellipsoid([7, 2.5, 2], [2.6, 2.6, 2.5], sandDk);
    for (const [x, y] of [[5, 0], [9, 0], [5, 4], [9, 4]]) for (const z of [0, 4]) g.clear(x, y, z);
    tint(g, (x, y, z) => (x + y * 2 + z) % 4 === 0, sand);
    g.ellipsoid([2, 1.6, 2], [2.1, 1.5, 1.6], scarab);
    tint(g, (x, y, z) => z === 2 && x <= 3 && y >= 2, scarabDk);
    tint(g, (x, y, z) => x <= 3 && y === 1 && (z === 1 || z === 3) && onSurface(g, x, y, z), gold);
    g.box([4, 4], [1, 2], [1, 3], INK).set(5, 2, 1, gold).set(5, 2, 3, gold).set(4, 2, 1, cream).set(4, 2, 3, cream);
    for (const z of [0, 4]) g.set(1, 0, z, INK).set(1, 1, z, INK).set(3, 0, z, INK).set(3, 1, z, INK).set(4, 1, z, INK).set(5, 1, z, INK);
    return g.entry({ id: 'cand-p7-scarab', name: 'Scarab & Ball' });
  })(),

  // a striped desert tent: a red-and-cream canopy, one end and a doorway
  // open, a patterned rug inside and a lantern hanging from the ridge
  (() => {
    const g = grid(9, 6, 7);
    const profile = ['...C...', '..CCC..', '.CC.CC.', 'CC...CC', 'C.....C', 'C.....C'];
    for (let x = 0; x < 9; x++) profile.forEach((row, k) => [...row].forEach((ch, z) => {
      if (ch === 'C') g.set(x, 5 - k, z, x % 2 ? redDk : cream);
    }));
    g.box([0, 0], [0, 4], [1, 5], (x, y, z) => (g.get(x, y, z) ? undefined : redDk));
    for (let z = 0; z < 7; z++) g.set(0, 5, z, g.get(0, 5, z) ? teal : 0);
    g.box([0, 8], [5, 5], [3, 3], teal);
    g.box([3, 5], [0, 1], [6, 6], 0).box([3, 5], [2, 2], [5, 6], 0);                 // the doorway
    g.box([1, 8], [0, 0], [1, 5], (x, y, z) => (z === 1 || z === 5 || x === 8 ? gold : (x + z) % 3 === 0 ? teal : red));
    g.set(4, 3, 3, gold).set(4, 2, 3, 0xf6d365);
    return g.entry({ id: 'cand-p7-tent', name: 'Striped Tent' });
  })(),

  // a tall terracotta water jar with a blue band and two loop handles, full
  // to the neck; a lime gecko clings to its side, peeking over the shoulder
  (() => {
    const g = grid(7, 9, 7);
    g.ellipsoid([3, 3, 3], [2.7, 2.6, 2.7], terra).cylinder('y', [3, 3], 1.5, [0, 0], terraDk)
      .cylinder('y', [3, 3], 1.3, [5, 6], terra).cylinder('y', [3, 3], 1.8, [7, 7], terraDk);
    g.box([3, 3], [5, 7], [3, 3], 0).set(3, 5, 3, water).set(3, 6, 3, water).clear(3, 6, 3);
    tint(g, (x, y, z) => y === 2 && onSurface(g, x, y, z), blue);
    tint(g, (x, y, z) => y === 3 && onSurface(g, x, y, z) && (x + z) % 2 === 0, cream);
    for (const y of [3, 4, 5]) pair(g, 0, y, 3, terraDk);
    pair(g, 1, 5, 3, terraDk); pair(g, 1, 6, 3, terraDk);
    for (const [x, y] of [[4, 2], [4, 3], [4, 4], [5, 4], [3, 3], [5, 2], [4, 1], [3, 1]]) out(g, x, y, gecko);
    out(g, 4, 5, gecko);
    const hz = frontZ(g, 4, 5);
    g.set(3, 5, hz, INK).set(5, 5, hz, INK);
    return g.entry({ id: 'cand-p7-water-jar', name: 'Water Jar & Gecko' });
  })(),

  // a date palm leaning over a little spring: a banded trunk that steps
  // twice, a crown of drooping fronds, orange date clusters, stone-rimmed
  // water at its foot
  (() => {
    const g = grid(9, 9, 5);
    g.box([0, 8], [0, 0], [0, 4], sand).box([0, 3], [1, 1], [0, 4], sandDk);
    g.box([4, 8], [1, 1], [0, 4], stone).box([5, 7], [1, 1], [1, 3], 0).box([5, 7], [0, 0], [1, 3], water);
    g.set(4, 1, 0, stoneDk).set(8, 1, 4, stoneDk).set(8, 1, 0, stoneDk);
    for (const [x, y0, y1] of [[1, 2, 3], [2, 3, 4], [3, 4, 6]]) for (let y = y0; y <= y1; y++) g.set(x, y, 2, y % 2 ? trunk : trunkDk);
    g.set(3, 7, 2, palmDk);
    // the crown: a cross of fronds at y 7, drooping at their tips
    g.box([0, 6], [7, 7], [2, 2], palm).box([3, 3], [7, 7], [0, 4], palm).set(3, 8, 2, palmDk);
    g.box([2, 4], [7, 7], [1, 3], palmDk).box([0, 0], [6, 6], [2, 2], palm).box([6, 7], [6, 6], [2, 2], palm).set(7, 5, 2, palm);
    g.set(3, 6, 0, palm).set(3, 6, 4, palm).set(2, 8, 1, palm).set(4, 8, 3, palm).set(2, 8, 3, palm).set(4, 8, 1, palm);
    g.set(2, 6, 1, date).set(2, 5, 1, date).set(4, 6, 3, date).set(4, 5, 3, date);
    return g.entry({ id: 'cand-p7-date-palm', name: 'Date Palm Spring' });
  })(),

  // a keyhole arch in white plaster: teal tiles round the horseshoe opening,
  // blue tile dots, terracotta crenels, a brass lantern hanging inside
  (() => {
    const g = grid(9, 10, 3);
    const open = (x, y) => (x - 4) ** 2 + (y - 5.5) ** 2 <= 2.6 ** 2 || (Math.abs(x - 4) <= 1 && y <= 5);
    for (let y = 0; y < 9; y++) for (let x = 0; x < 9; x++) if (!open(x, y)) {
      const rim = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([a, b]) => x + a >= 0 && x + a < 9 && y + b >= 0 && open(x + a, y + b));
      for (const z of [0, 1]) g.set(x, y, z, rim ? teal : z === 1 && (Math.abs(x - 4) + 2 * y) % 5 === 0 ? blue : plaster);
    }
    for (const x of [0, 2, 4, 6, 8]) g.set(x, 9, 0, terra).set(x, 9, 1, terra);
    g.box([0, 8], [8, 8], [0, 1], (x, y, z) => (g.get(x, y, z) ? terra : undefined));
    g.box([2, 6], [0, 0], [2, 2], sandDk);
    g.set(4, 8, 1, brassDk).set(4, 7, 1, brass).set(4, 6, 1, 0xf6d365).set(3, 6, 1, 0xf2a03d).set(5, 6, 1, 0xf2a03d).set(4, 5, 1, brass);
    return g.entry({ id: 'cand-p7-keyhole-arch', name: 'Keyhole Arch' });
  })(),

  // a dallah, the brass coffee pot: a wide base, a pinched waist, a crescent
  // beak of a spout rising to the lid, a tall stepped lid and finial, a loop
  // handle at the back
  (() => {
    const g = grid(8, 9, 5);
    g.cylinder('y', [3, 2], 2.2, [0, 1], brass).cylinder('y', [3, 2], 1.8, [2, 2], copper)
      .cylinder('y', [3, 2], 1.1, [3, 3], brass).cylinder('y', [3, 2], 1.6, [4, 5], brass)
      .cylinder('y', [3, 2], 1.1, [6, 6], copper).set(3, 7, 2, brass).set(3, 8, 2, gold);
    sheet(g, ['...S', '..SS', '..S.', '.SS.', 'SS..'], [2, 2], { S: brass }, 4, 3);
    g.set(7, 7, 2, brassDk);
    g.box([0, 0], [2, 5], [2, 2], brassDk).set(1, 5, 2, brassDk).set(1, 2, 2, brassDk);
    return g.entry({ id: 'cand-p7-dallah', name: 'Dallah' });
  })(),

  // a shaduf, the oasis water lever: a mud-brick pillar, a beam with a stone
  // counterweight at one end and a clay bucket on a rope over the spring
  (() => {
    const g = grid(9, 9, 5);
    g.box([0, 8], [0, 0], [0, 4], sand);
    g.box([4, 8], [1, 1], [0, 4], stone).box([5, 7], [1, 1], [1, 3], 0).box([5, 7], [0, 0], [1, 3], water);
    g.box([2, 3], [1, 4], [1, 3], (x, y, z) => ((x + y + z) % 2 ? sandDk : terra)).box([3, 3], [5, 5], [1, 3], wood);
    g.box([1, 3], [6, 6], [2, 2], wood).box([4, 6], [7, 7], [2, 2], wood).box([7, 8], [8, 8], [2, 2], wood).set(3, 7, 2, wood).set(6, 8, 2, wood);
    g.box([0, 1], [4, 5], [1, 3], stoneDk).set(1, 6, 1, 0).set(1, 6, 3, 0);
    g.set(8, 7, 2, trunkDk).set(8, 6, 2, trunkDk);
    g.box([7, 8], [4, 5], [1, 3], terra).box([7, 8], [5, 5], [2, 2], water);
    return g.entry({ id: 'cand-p7-shaduf', name: 'Shaduf' });
  })(),

  // a magic carpet riding a ripple of air, its front edge curling up: red
  // with a teal border, a gold medallion, tassels, and a little brass lamp
  (() => {
    const g = grid(9, 6, 6);
    const h = [2, 2, 1, 1, 1, 1, 2, 2, 3];
    for (let x = 0; x < 9; x++) for (let z = 0; z < 6; z++) {
      const edge = z === 0 || z === 5 || x === 0 || x === 8;
      const med = Math.abs(x - 4) + Math.abs(z - 2.5) <= 1.6;
      g.set(x, h[x], z, edge ? teal : med ? gold : red);
      if (x > 0 && h[x - 1] !== h[x]) g.set(x, h[x - 1], z, edge ? teal : red);
    }
    g.box([8, 8], [4, 4], [1, 4], teal);
    for (const z of [0, 2, 3, 5]) g.set(0, 1, z, 0xf6d365);
    sheet(g, ['..K..', 'HBBBS', '.BBB.'], [2, 3], { K: brassDk, H: brassDk, B: brass, S: brass }, 2, 2);
    g.set(6, 4, 2, brassDk);
    return g.entry({ id: 'cand-p7-magic-carpet', name: 'Magic Carpet & Lamp' });
  })(),
];
