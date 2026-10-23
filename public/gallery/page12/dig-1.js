// Page 12 · I The Dig: under the hill, the bones of a world that remembers.
// Fossils that are not quite finished being alive - a trilobite that still
// walks, a fish in its slab whose eye still follows you, a dragon's skull
// with the old light in its sockets, a clutch of three stone eggs (moss,
// tide and ember, and the ember one is hatching), a squat idol with round
// eyes half dug out of the sand, and a serpent's backbone arching out of the
// ground like a bridge.
// Sky: the Desert's sand-gold, so the finds are bone and sandstone, a shade
// paler or darker than the ground they came out of; the accents are the
// three type colours (moss, tide, ember) and the cyan of things still glowing.
import { grid } from '../voxel.js';
import { INK, BLUSH, S, front, out, pair, pairAt, pairFront, pairFrontAt, quad, tint, onSurface, sheet } from './kit.js';

const { stone, stoneLt, stoneDk, sand, sandDk, bone, boneDk, earth, moss, mossDk, mossLt, tide, tideDk, ember, emberHot,
  glow, glowDk, star, starDk, cream, ash } = S;

export default [
  // a trilobite walking out of the rock: a ridged, segmented shell, a broad
  // head shield, two dark compound eyes up top, a row of little legs
  (() => {
    const g = grid(7, 3, 9);
    const rows = [[2, 4], [1, 5], [0, 6], [0, 6], [0, 6], [0, 6], [0, 6], [0, 6], [1, 5]];   // width at each z, tail to head
    rows.forEach(([a, b], z) => g.box([a, b], [0, 0], [z, z], z >= 6 ? sand : z % 2 ? sandDk : sand));
    g.box([2, 4], [1, 1], [1, 7], (x, y, z) => (z % 2 ? sand : bone));                 // the axial ridge
    for (let z = 2; z <= 5; z++) pair(g, 0, 0, z, z % 2 ? earth : boneDk);              // leg tips
    pair(g, 1, 1, 7, bone); pair(g, 1, 2, 7, INK);                                       // eyes on top of the head
    g.set(3, 1, 8, bone);
    return g.entry({ id: 'cand-p12-trilobite', name: 'Trilobite', story: 'Older than the mountains, and still not in a hurry.' });
  })(),

  // a fish in its slab, every rib and fin ray in pale bone - and its one
  // eye, which is not bone, and which follows you round the room
  (() => {
    const g = grid(9, 7, 2);
    g.box([0, 8], [0, 6], [0, 0], sandDk).box([1, 7], [0, 6], [0, 0], sand).box([0, 8], [0, 0], [0, 1], sandDk);
    sheet(g, [
      '.........',
      '.b..b.b..',
      'b.b.b.bbb',
      '.bbbbbbbe',
      'b.b.b.bbb',
      '.b..b.b..',
      '.........',
    ], [1, 1], { b: bone, e: INK });
    g.set(0, 5, 1, sandDk).set(8, 6, 1, sandDk).set(2, 6, 1, mossLt);
    return g.entry({ id: 'cand-p12-fossil-fish', name: 'Fossil Fish', story: 'Its bones are stone. Its eye has not heard the news.' });
  })(),

  // a dragon's skull coming out of the sand: long snout, teeth, horns swept
  // back, and in its eye sockets the old light, still glowing
  (() => {
    const g = grid(9, 6, 8);
    g.box([0, 8], [0, 0], [0, 7], sandDk).box([1, 7], [0, 0], [1, 6], (x, y, z) => ((x * 2 + z) % 5 ? sandDk : earth));
    g.box([2, 6], [1, 4], [0, 4], bone).box([3, 5], [5, 5], [1, 3], bone);              // the cranium
    g.box([3, 5], [1, 3], [5, 7], bone).box([3, 5], [3, 3], [7, 7], boneDk);           // the snout
    pair(g, 3, 3, 7, ash);                                                              // nostrils
    pair(g, 2, 3, 4, glowDk); pair(g, 2, 2, 4, boneDk);                                  // the sockets, still lit
    g.set(2, 3, 4, glow).set(6, 3, 4, glow);
    pair(g, 3, 1, 7, cream); pair(g, 3, 1, 5, cream);                                     // teeth
    pair(g, 1, 4, 2, bone); pair(g, 1, 5, 2, bone); pair(g, 0, 5, 2, boneDk); pair(g, 0, 5, 1, boneDk); pair(g, 0, 5, 0, boneDk);   // horns swept back
    g.set(4, 5, 0, moss).set(3, 5, 1, mossLt);
    return g.entry({ id: 'cand-p12-dragon-skull', name: 'Dragon Skull', story: 'The dig stopped here. Nobody wanted to be the one to lift it.' });
  })(),

  // a clutch of three stone eggs in a nest, each banded in its type - moss,
  // ember, tide - and the ember one in the middle is hatching: a warm little
  // head with two eyes looking out over the broken rim
  (() => {
    const g = grid(9, 6, 5);
    g.box([0, 8], [0, 0], [0, 4], (x, y, z) => ((x + z) % 2 ? earth : sandDk));          // the nest
    const egg = (cx, band) => {
      g.ellipsoid([cx, 2.6, 2], [1.5, 2.1, 1.5], stoneLt);
      tint(g, (x, y, z) => Math.abs(x - cx) < 1.6 && y === 2, band);
      tint(g, (x, y, z) => Math.abs(x - cx) < 1.6 && y === 4 && (x + z) % 2 === 0, band);
    };
    egg(1, moss); egg(7, tide); egg(4, ember);
    g.box([3, 5], [4, 5], [1, 3], 0);                                                   // the top broken off
    g.set(3, 4, 1, stoneLt).set(5, 4, 1, stoneLt).set(3, 4, 3, stoneLt).set(5, 4, 3, stoneLt);   // a jagged rim
    g.box([4, 4], [4, 5], [2, 2], ember).set(4, 5, 2, emberHot);                        // the hatchling's head
    g.box([3, 5], [3, 3], [2, 2], ember);
    pair(g, 3, 4, 2, ember); pair(g, 3, 4, 3, INK); g.set(4, 4, 3, emberHot);            // two eyes over the rim
    return g.entry({ id: 'cand-p12-egg-clutch', name: 'Three Eggs', story: 'Three kinds of creature, one nest. The warm one woke first.' });
  })(),

  // an idol half dug out of the sand: squat and round, two big ringed eyes,
  // hands on its belly, a little crest, and the digger's brush left by it
  (() => {
    const g = grid(7, 8, 6);
    g.ellipsoid([3, 3.2, 2.5], [2.9, 3.3, 2.4], sandDk);
    g.box([0, 6], [0, 0], [0, 5], sand).box([0, 6], [1, 1], [0, 5], (x, y, z) => (x === 0 || x === 6 || z === 0 || z === 5 ? sand : undefined));
    pairFront(g, 1, 5, star); pairFront(g, 2, 5, INK); pairFront(g, 2, 6, star); pairFront(g, 2, 4, star);   // ringed eyes
    front(g, 3, 3, earth);                                                              // a small mouth
    pairFront(g, 1, 2, stoneLt); pairFront(g, 2, 2, stoneLt);                          // hands on its belly
    g.box([2, 4], [7, 7], [2, 2], starDk).set(3, 7, 3, starDk);                         // the crest
    g.set(5, 1, 5, earth).set(6, 1, 5, cream);                                          // the digger's brush
    return g.entry({ id: 'cand-p12-sand-idol', name: 'Sand Idol', story: 'Dug up at noon. By evening it had moved.' });
  })(),

  // a sea serpent's backbone arching out of the dunes in two humps, the
  // vertebrae bone and shadow in turn, ribs hanging, its skull resting on
  // the sand with the light gone from its eyes
  (() => {
    const g = grid(10, 5, 4);
    g.box([0, 9], [0, 0], [0, 3], (x, y, z) => ((x + z) % 4 ? sandDk : earth));
    const h = [1, 2, 3, 3, 2, 1, 2, 3, 3, 2];
    for (let x = 0; x <= 7; x++) g.box([x, x], [h[x], h[x]], [1, 2], x % 2 ? boneDk : bone);
    for (const x of [0, 5]) g.box([x, x], [1, 1], [1, 2], boneDk);
    for (const x of [2, 3]) g.box([x, x], [1, 2], [1, 2], bone);
    for (const x of [7]) g.box([x, x], [1, 2], [1, 2], bone);
    for (const x of [2, 3, 7]) { g.set(x, 2, 0, boneDk).set(x, 2, 3, boneDk); }         // ribs
    g.box([8, 9], [2, 4], [0, 3], bone).box([9, 9], [2, 2], [0, 3], boneDk);             // the skull
    g.box([8, 9], [1, 1], [1, 2], bone);
    g.set(9, 3, 0, ash).set(9, 3, 3, ash);                                              // empty eyes, both sides
    g.set(8, 4, 0, boneDk).set(8, 4, 3, boneDk);
    return g.entry({ id: 'cand-p12-serpent-bones', name: 'Serpent Bones', story: 'Two humps of it are above the sand. Nobody has dug for the rest.' });
  })(),
];
