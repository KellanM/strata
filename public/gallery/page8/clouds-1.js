// Page 8 · XV Cloud Isles (Dawn palette, a pale-blue sky): above the
// weather; islands that float. Half sky creatures, half dreamy crafted
// things. The kite, rain cloud, windmill, weather vane, hot-air balloon,
// sky lantern, rainbow and unicorn already exist, so this page fills around
// them. Anything floating is still one piece: roots, ropes, strings and
// waterfalls tie the parts together. Clouds have a pale-blue underside
// (kit.puff) so they read as clouds and not as snow.
import { grid } from '../voxel.js';
import { INK, BLUSH, front, out, frontZ, pair, pairFront, pairAt, pairFrontAt, pairZ, quad, kawaii, tint, onSurface, sheet, puff, CLOUD, CLOUD_SHADE } from './kit.js';

const grass = 0x7cc87a, grassDark = 0x5fae6e, rock = 0x9a8a7e, rockDark = 0x7a6c62, dirt = 0xa8764a, root = 0x6b4a3a,
  water = 0x7cc4e4, waterLight = 0xb8e4f6, blossom = 0xf6b6c8, blossomDeep = 0xe98aa6, wood = 0x9a6440, woodDark = 0x6b4a3a,
  cream = 0xf6efe4, white = 0xfbf8f2, gold = 0xe9b949, glow = 0xf6d365, coral = 0xf08a6c, red = 0xe0565b, lilac = 0xb9a3e8,
  sky = 0x8cc8e8, navy = 0x2f4a7a, iron = 0x5d6670;

export default [
  // ---------------------------------------------------------------- creatures

  // a sky whale swimming through the air with a blossom tree growing on its
  // back; a flipper each side, flukes raised
  (() => {
    const g = grid(9, 8, 6);
    const whale = 0x7d9ee0, fin = 0x6585cc, belly = 0xe8eefc;
    g.ellipsoid([4.4, 2.6, 2.5], [3.9, 2.1, 2.4], whale);
    tint(g, (x, y, z) => y <= 1, belly);
    tint(g, (x, y, z) => !g.get(x, y + 1, z) && x >= 2 && x <= 6 && y >= 4, grass);   // a meadow on its back
    pairZ(g, 7, 3, 1, INK); pairZ(g, 7, 2, 1, BLUSH);                         // an eye and a blush each side
    for (const [x, y] of [[5, 2], [4, 2], [4, 1], [3, 1]]) pairZ(g, x, y, 0, fin);   // flippers
    g.box([0, 0], [4, 4], [0, 5], fin).box([0, 0], [3, 3], [2, 3], whale);   // flukes, raised
    g.set(4, 5, 2, woodDark).set(4, 6, 2, woodDark).set(3, 6, 2, woodDark);
    g.ellipsoid([3.6, 6.8, 2.5], [1.7, 0.9, 1.5], blossom);
    g.ellipsoid([5.3, 6.0, 3], [0.9, 0.6, 0.9], blossomDeep).set(4, 6, 2, woodDark).set(5, 5, 4, 0xf6d365).set(2, 5, 3, white);
    return g.entry({ id: 'cand-p8-sky-whale', name: 'Sky Whale' });
  })(),

  // a stork flying in with a bundle hanging from its bill; wings up in a V,
  // black flight feathers, red legs trailing
  (() => {
    const g = grid(9, 6, 7);
    const bundle = 0xf4c1cf, knot = 0xfbf8f2, beak = 0xf2833a, black = 0x2f2a36;
    g.ellipsoid([3.2, 3.6, 3], [2.4, 1.2, 1.3], white);
    g.box([6, 7], [4, 5], [2, 4], white).set(6, 5, 2, 0).set(6, 5, 4, 0);
    pairZ(g, 7, 5, 2, INK);                                                   // an eye each side
    g.set(8, 5, 3, beak).set(8, 4, 3, beak).set(8, 3, 3, knot);
    g.box([7, 8], [0, 2], [2, 4], bundle).set(8, 2, 3, knot).set(7, 2, 3, knot);
    for (let x = 1; x <= 5; x++) { pairZ(g, x, 4, 1, x <= 1 ? black : white); pairZ(g, x, 5, 1, x <= 1 ? black : white); }
    for (let x = 0; x <= 5; x++) pairZ(g, x, 5, 0, x <= 1 ? black : white);
    g.set(0, 4, 3, white).set(0, 3, 3, beak);                                 // tail, legs trailing
    return g.entry({ id: 'cand-p8-stork', name: 'Stork & Bundle' });
  })(),

  // a pegasus foal standing on a cloud, facing you, wings spread wide: a
  // honey coat, a pink forelock and tail, gold-tipped feathers
  (() => {
    const g = grid(9, 8, 6);
    const coat = 0xf2d39b, muzzle = 0xf8e6d4, mane = 0xf08aa8, hoof = 0xb07a3a, wing = 0xfbf8ff, wingTip = 0xf2c14e;
    puff(g, [[[4, 0.6, 2.5], [4.4, 1.2, 2.6]]]);
    for (const x of [3, 5]) for (const z of [1, 4]) g.set(x, 2, z, hoof);
    g.box([3, 5], [3, 4], [1, 4], coat).set(3, 4, 1, 0).set(5, 4, 1, 0);
    g.ellipsoid([4, 5.6, 3.4], [1.6, 1.4, 1.5], coat);
    g.box([3, 5], [5, 5], [5, 5], muzzle);
    pairFront(g, 3, 6, INK);                                                  // eyes
    pair(g, 3, 7, 3, coat);                                                   // ears
    g.set(4, 7, 4, mane).set(4, 7, 3, mane).set(4, 6, 2, mane).set(4, 5, 2, mane);   // forelock and mane
    g.set(4, 4, 0, mane).set(4, 3, 0, mane);                                  // tail
    for (const [x, y] of [[2, 4], [1, 5], [2, 5], [0, 6], [1, 6]]) for (const z of [2, 3]) pair(g, x, y, z, x === 0 ? wingTip : wing);
    return g.entry({ id: 'cand-p8-pegasus', name: 'Pegasus Foal' });
  })(),

  // a ginger kitten carried off by one red balloon, its string in a raised
  // paw, its tail curled up the other side
  (() => {
    const g = grid(8, 10, 5);
    const fur = 0xf2a65a, stripe = 0xd9823a, cream2 = 0xfbeedd, balloon = 0xf0607a, shine = 0xfbe3ea, str = 0x9aa3ad;
    g.ellipsoid([3, 1.1, 2.2], [1.5, 1.2, 1.3], fur)
      .ellipsoid([3, 3.4, 2.2], [2.2, 1.6, 1.6], fur);
    tint(g, (x, y, z) => !g.get(x, y + 1, z) && y >= 4 && x >= 2 && x <= 4, (x) => (x === 3 ? stripe : undefined));
    for (let x = 2; x <= 4; x++) front(g, x, 2, cream2);
    pairFrontAt(g, 3, 2, 3, INK); pairFrontAt(g, 3, 1, 2, BLUSH);              // eyes, blush
    front(g, 3, 2, BLUSH);                                                    // nose
    pairAt(g, 3, 1, 5, 2, fur);                                               // ears
    pairAt(g, 3, 2, 0, 3, cream2);                                            // dangling feet
    g.set(6, 3, 2, fur).set(6, 4, 2, fur).set(6, 5, 2, cream2).set(6, 6, 2, str);   // the raised paw, the string
    g.ellipsoid([5.2, 8.1, 2], [2.2, 1.8, 1.7], balloon).set(6, 7, 2, balloon);
    front(g, 4, 9, shine);
    g.set(1, 1, 2, fur).set(0, 1, 2, fur).set(0, 2, 2, stripe);               // tail
    return g.entry({ id: 'cand-p8-balloon-kitten', name: 'Balloon Kitten' });
  })(),

  // a barn swallow in a swooping glide: long swept wings, a deep forked
  // tail, a red face over a cream breast
  (() => {
    const g = grid(9, 4, 7);
    const back = 0x2f4a7a, back2 = 0x3f5f9a, breast = 0xf6efe4, face = 0xd9573a;
    g.ellipsoid([4.6, 1.2, 3], [3.2, 1.2, 1.1], back);
    tint(g, (x, y, z) => y === 0, breast);
    g.box([7, 8], [1, 2], [2, 4], back).box([8, 8], [1, 2], [3, 3], face).set(8, 1, 2, face).set(8, 1, 4, face);
    pairZ(g, 8, 2, 2, INK);                                                   // eyes either side of the red brow
    for (let x = 3; x <= 6; x++) pairZ(g, x, 1, 1, back2);                    // wings, swept back
    for (let x = 0; x <= 4; x++) pairZ(g, x, 1, 0, back);
    g.set(1, 1, 3, back).set(2, 1, 3, back);
    pairZ(g, 1, 1, 2, back); pairZ(g, 0, 1, 2, back);                         // the forked tail
    return g.entry({ id: 'cand-p8-swallow', name: 'Swallow' });
  })(),

  // a carrier pigeon on a cloud with a letter in its bill: a shimmering
  // teal-and-violet neck, two black wing bars, a red heart seal
  (() => {
    const g = grid(7, 8, 6);
    const body = 0xb4bccc, wing = 0x9aa4b8, bar = 0x4a4550, neck1 = 0x5fb3a9, neck2 = 0x9b7fd1, beak = 0xf0e6d8, letter = 0xe8cf9e;
    puff(g, [[[3, 0.6, 2.5], [3.4, 1.2, 2.6]]]);
    g.ellipsoid([3, 3.2, 2.5], [2.1, 1.6, 1.9], body)
      .ellipsoid([3, 5.3, 2.9], [1.5, 1.2, 1.3], body);
    tint(g, (x, y, z) => y === 4 && onSurface(g, x, y, z), (x, y, z) => ((x + z) % 2 ? neck1 : neck2));
    tint(g, (x, y, z) => (x === 1 || x === 5) && y >= 2 && y <= 3, (x, y) => (y === 3 ? bar : wing));
    pairFront(g, 2, 5, INK);
    out(g, 3, 5, beak);
    g.box([2, 4], [3, 4], [5, 5], letter).set(3, 3, 5, red);
    return g.entry({ id: 'cand-p8-carrier-pigeon', name: 'Carrier Pigeon' });
  })(),

  // a momonga (a flying squirrel) mid-glide, arms and legs spread to stretch
  // its cape, enormous eyes, a flat tail for steering
  (() => {
    const g = grid(7, 4, 9);
    const fur = 0xc9bfb4, cape = 0xb3a596, edge = 0xf3e6cc, face = 0xfbf6ee, paw = 0xe8b4a8;
    g.box([0, 6], [1, 1], [2, 6], cape);
    for (const z of [2, 6]) { g.set(0, 1, z, paw).set(6, 1, z, paw); }       // four paws at the corners
    pair(g, 0, 1, 4, 0);                                                      // the cape sags between them
    tint(g, (x, y, z) => (x === 0 || x === 6) && z !== 2 && z !== 6, edge);
    g.box([2, 4], [2, 2], [3, 6], fur);
    g.box([1, 5], [1, 2], [7, 8], face).box([1, 5], [2, 2], [7, 7], fur);
    pair(g, 1, 2, 8, fur); pair(g, 1, 3, 7, fur);                             // ears
    pair(g, 2, 2, 8, INK);                                                    // big eyes
    g.set(3, 1, 8, paw);                                                      // nose
    g.box([2, 4], [1, 1], [0, 1], cape).set(2, 1, 0, 0).set(4, 1, 0, 0);      // the flat tail
    return g.entry({ id: 'cand-p8-momonga', name: 'Momonga' });
  })(),

  // a baby griffin sitting on a cloud: an eagle's white head and hooked gold
  // beak, a lion cub's body, little wings up, a tufted tail
  (() => {
    const g = grid(7, 8, 6);
    const lion = 0xe9b949, lionDark = 0xc9952f, head = 0xfbf3e0, beak = 0xf2a03d, wing = 0xb07a3a, wingTip = 0xf6efe4, tuft = 0x8a5a3c;
    puff(g, [[[3, 0.6, 2.5], [3.4, 1.2, 2.6]]]);
    g.ellipsoid([3, 3.0, 2.4], [2.1, 1.5, 1.9], lion)
      .ellipsoid([3, 5.4, 3.0], [1.9, 1.5, 1.6], head);
    pairFront(g, 2, 2, lionDark);                                             // front paws
    pairFront(g, 2, 6, INK);
    out(g, 3, 5, beak); g.set(3, 4, frontZ(g, 3, 5), beak);                   // the hooked beak
    pair(g, 2, 7, 2, head); pair(g, 2, 7, 3, head);                           // feather tufts
    for (const [x, y] of [[1, 3], [1, 4], [1, 5], [0, 4], [0, 5], [0, 6]]) pair(g, x, y, 1, y === 6 ? wingTip : wing);
    g.set(3, 3, 0, lion).set(3, 4, 0, lion).set(3, 5, 0, tuft);               // the tail, up the back
    return g.entry({ id: 'cand-p8-griffin', name: 'Baby Griffin' });
  })(),

  // ---------------------------------------------------------------- crafted

  // a floating isle: a meadow with a crooked blossom tree and a little hut,
  // a rock cone underneath, roots dangling into the sky
  (() => {
    const g = grid(7, 9, 7);
    const hut = 0xf6efe4, roof = 0xe0565b, trunk = 0x7a5a48;
    g.cylinder('y', [3, 3], 3.2, [4, 4], grass).cylinder('y', [3, 3], 3.2, [3, 3], dirt)
      .cylinder('y', [3, 3], 2.3, [2, 2], rock).cylinder('y', [3, 3], 1.5, [1, 1], rockDark).set(3, 0, 3, rockDark);
    for (const [x, z, n] of [[5, 2, 2], [1, 4, 2], [2, 1, 1]]) for (let k = 1; k <= n; k++) g.set(x, 2 - k, z, root);
    g.set(2, 5, 2, trunk).set(2, 6, 2, trunk).set(3, 6, 2, trunk).set(3, 7, 2, trunk);
    g.ellipsoid([2.6, 7.8, 2.4], [2.0, 0.8, 1.8], blossom);
    g.ellipsoid([4.6, 6.4, 1.6], [1.0, 0.5, 0.9], blossomDeep).set(4, 6, 2, trunk);
    g.box([4, 5], [5, 5], [4, 5], hut).set(4, 5, 5, woodDark).set(5, 5, 5, glow).box([4, 5], [6, 6], [4, 5], roof);
    g.set(1, 5, 4, 0xf6d365).set(2, 5, 5, white);                             // flowers
    return g.entry({ id: 'cand-p8-floating-isle', name: 'Floating Isle' });
  })(),

  // two isles, one above the other: the upper pond spills over its lip and
  // falls as a waterfall to the lower isle's pool, where a tree leans out
  (() => {
    const g = grid(8, 8, 6);
    const tree = 0x6fbf73;
    // upper isle, back-left
    g.cylinder('y', [2, 2], 2.2, [6, 6], grass).cylinder('y', [2, 2], 2.2, [5, 5], rock).cylinder('y', [2, 2], 1.4, [4, 4], rockDark).set(2, 3, 2, rockDark);
    g.set(1, 6, 2, water).set(2, 6, 2, water).set(2, 6, 1, water).set(3, 6, 2, water).set(4, 6, 2, water);   // the pond, its spill
    // lower isle, front-right
    g.cylinder('y', [5, 3], 2.4, [2, 2], grass).cylinder('y', [5, 3], 2.0, [1, 1], rock).cylinder('y', [5, 3], 1.0, [0, 0], rockDark);
    g.box([5, 6], [3, 6], [2, 2], (x, y) => ((y + x) % 2 ? water : waterLight));   // the fall
    g.box([5, 6], [2, 2], [2, 3], water).set(4, 3, 3, white).set(6, 3, 3, white).set(5, 3, 3, white);   // pool, spray
    g.set(7, 3, 4, woodDark).set(7, 4, 4, woodDark).ellipsoid([6.6, 5, 4.4], [1.2, 0.8, 1.1], tree);
    return g.entry({ id: 'cand-p8-waterfall-isles', name: 'Waterfall Isles' });
  })(),

  // an airship: a striped envelope with tail fins on all four sides, a
  // wooden gondola slung under it with lit windows, a propeller behind
  (() => {
    const g = grid(10, 7, 5);
    const gore1 = 0xf6efe4, gore2 = 0xc9b6e4, finC = 0xf08a6c, gondola = 0x9a6440;
    g.ellipsoid([5, 4.4, 2], [4.6, 2.2, 2.2], (x) => (x % 2 ? gore1 : gore2));
    g.box([0, 1], [4, 4], [0, 4], finC).box([0, 1], [3, 6], [2, 2], finC).box([1, 1], [4, 4], [1, 3], gore2);
    g.box([3, 6], [0, 1], [1, 3], gondola).box([4, 5], [1, 1], [1, 3], (x, y, z) => (z === 2 ? gondola : glow));
    g.set(3, 2, 2, woodDark).set(6, 2, 2, woodDark);                          // rigging
    g.set(2, 1, 2, iron).set(2, 0, 2, woodDark).set(2, 2, 2, woodDark);       // propeller
    g.set(9, 4, 2, gold);                                                     // nose cap
    return g.entry({ id: 'cand-p8-airship', name: 'Airship' });
  })(),

  // a little house lifted off by a bunch of balloons tied to its roof ridge
  (() => {
    const g = grid(7, 10, 6);
    const wall = 0xf6e3a1, roof = 0x4fb3a9, roofDark = 0x3f9a90, door = 0xe0565b, str = 0x9aa3ad;
    g.box([1, 5], [0, 3], [1, 4], wall).box([3, 3], [0, 1], [4, 4], door);
    pairFront(g, 1, 2, glow); front(g, 3, 3, glow);                           // windows
    g.set(2, 0, 5, grass).set(4, 0, 5, grass);                                // flowers by the door
    g.box([1, 5], [4, 4], [0, 5], (x, y, z) => (z === 0 || z === 5 ? roofDark : roof)).box([1, 5], [5, 5], [1, 4], roof).box([1, 5], [5, 5], [2, 3], roofDark);
    g.box([3, 3], [6, 6], [2, 3], str);
    const balloons = [[1.6, 8, 2.5, 0xe0565b], [3, 9, 1.6, 0xf6d365], [4.5, 8, 3.4, 0x5b8fd6], [3, 7.8, 3.6, 0xf4a3b5], [4.6, 9.2, 2, 0x86c77f], [1.8, 9.2, 3.6, 0x9b7fd1]];
    g.ellipsoid([3, 8.3, 2.5], [3.2, 1.7, 2.5], (x, y, z) => {
      let best = null, bd = 1e9;
      for (const [bx, by, bz, c] of balloons) { const d = (x - bx) ** 2 + (y - by) ** 2 + (z - bz) ** 2; if (d < bd) { bd = d; best = c; } }
      return best;
    });
    return g.entry({ id: 'cand-p8-balloon-house', name: 'Balloon House' });
  })(),

  // a paper plane folded from a letter: ruled blue lines, a red margin, a
  // heart sticker, winglets turned up at the back
  (() => {
    const g = grid(9, 3, 7);
    const paper = 0xfbfbff, fold = 0xdfe6f5, line = 0x8cb4e8, margin = 0xe0565b;
    for (let x = 0; x <= 8; x++) {
      const hw = Math.round((8 - x) * 0.4);
      for (let z = 3 - hw; z <= 3 + hw; z++) g.set(x, 1, z, z === 3 ? fold : (z === 1 || z === 5) && x % 2 === 0 ? line : paper);
      if (x >= 1 && x <= 6) g.set(x, 0, 3, fold);
    }
    pairZ(g, 1, 1, 2, margin);
    pairZ(g, 0, 2, 0, paper); pairZ(g, 1, 2, 0, paper);                       // winglets
    g.set(3, 1, 4, margin).set(3, 1, 2, paper);
    return g.entry({ id: 'cand-p8-paper-plane', name: 'Paper Plane' });
  })(),

  // a red biplane with cream wings and wooden struts, a pup at the controls
  // in a leather cap, his scarf streaming back
  (() => {
    const g = grid(9, 5, 7);
    const body = 0xd9413a, wingC = 0xf6efe4, strut = 0x9a6440, pup = 0xf3d2a2, cap = 0x8a5a3c, scarf = 0xf2c14e, tyre = 0x3a3442;
    g.box([2, 7], [1, 2], [2, 4], body).box([0, 1], [2, 2], [3, 3], body).box([0, 0], [3, 4], [3, 3], body);
    g.box([0, 1], [2, 2], [1, 5], wingC).box([0, 0], [2, 2], [3, 3], body);    // tailplane
    g.box([5, 7], [1, 1], [0, 6], wingC).box([5, 7], [4, 4], [0, 6], wingC);  // lower and upper wings
    pairZ(g, 6, 2, 0, strut); pairZ(g, 6, 3, 0, strut); g.set(6, 3, 3, strut);
    g.box([3, 4], [3, 3], [2, 4], pup).box([3, 4], [4, 4], [2, 4], cap);      // the pilot
    pairZ(g, 4, 3, 2, INK); g.set(4, 3, 3, cap);
    g.set(2, 3, 3, scarf).set(1, 3, 3, scarf).set(1, 4, 3, 0);
    g.box([8, 8], [0, 3], [3, 3], strut).set(8, 1, 3, iron).set(8, 2, 3, iron);   // propeller
    pairZ(g, 6, 0, 2, tyre);
    return g.entry({ id: 'cand-p8-biplane', name: 'Biplane' });
  })(),

  // a sky gondola on its cable: a coral cabin with open windows all round, a
  // bunny passenger looking out, the hanger and trolley up on the line
  (() => {
    const g = grid(6, 9, 7);
    const cabin = 0xf08a6c, cabinDark = 0xd9704f, roof = 0xf6efe4, bunny = 0xfbf8f2, ear = 0xf4a3b5;
    g.box([2, 3], [8, 8], [0, 6], iron).box([2, 3], [7, 7], [3, 4], iron).box([2, 3], [5, 6], [3, 4], iron);
    g.box([0, 5], [1, 4], [2, 5], cabin).box([1, 4], [1, 3], [3, 4], 0);
    g.box([0, 5], [2, 3], [2, 5], (x, y, z) => ((x === 0 || x === 5) && (z === 2 || z === 5) ? cabinDark : 0));   // windows all round
    g.box([1, 4], [1, 1], [2, 5], cabinDark).box([0, 5], [1, 1], [3, 4], cabinDark);
    g.box([0, 5], [4, 4], [2, 5], roof).box([1, 4], [0, 0], [3, 4], cabinDark);
    g.box([2, 3], [1, 2], [3, 4], bunny).set(3, 2, 4, bunny);
    pair(g, 2, 3, 3, bunny); pair(g, 2, 3, 3, ear);                           // ears up
    g.set(2, 2, 4, INK).set(3, 2, 4, INK);
    return g.entry({ id: 'cand-p8-sky-gondola', name: 'Sky Gondola' });
  })(),

  // a swing hung from a cloud on flower-wound ropes, a bluebird on the seat
  (() => {
    const g = grid(9, 9, 5);
    const seat = 0x9a6440, rope = 0xd9b48f, leaf = 0x86c77f, flower = 0xf4a3b5, bird = 0x5b8fd6, birdBelly = 0xf6efe4, beak = 0xf2a03d;
    puff(g, [[[4, 6.0, 2], [4.4, 1.3, 2.3]], [[2.8, 7.6, 2], [1.8, 1.0, 1.6]], [[5.6, 7.7, 2], [2.0, 1.1, 1.7]]]);
    g.box([1, 7], [0, 0], [1, 3], seat);
    for (const x of [2, 6]) g.box([x, x], [1, 4], [2, 2], rope);
    pair(g, 2, 3, 3, leaf); pair(g, 2, 1, 1, flower); pair(g, 2, 4, 1, leaf);
    g.box([4, 5], [1, 1], [1, 3], bird).box([5, 5], [1, 1], [1, 3], birdBelly).box([5, 5], [2, 2], [1, 3], bird).set(3, 1, 2, bird);
    pairZ(g, 5, 2, 1, INK);                                                   // an eye each side
    g.set(6, 2, 2, beak);
    return g.entry({ id: 'cand-p8-cloud-swing', name: 'Cloud Swing' });
  })(),

  // a castle on a cloud: a tall keep with a pink spire and a gold pennant,
  // two lilac-roofed towers, lit windows, a gold door
  (() => {
    const g = grid(9, 10, 5);
    const wall = 0xece6f8, wallDark = 0xd6cdee, roofL = 0xb9a3e8, roofP = 0xf4a3c0;
    puff(g, [[[4, 1.2, 2], [4.6, 1.5, 2.6]], [[1.5, 1.6, 2], [1.6, 1.2, 1.6]], [[7, 1.6, 2.4], [1.8, 1.2, 1.6]]]);
    for (const x0 of [0, 6]) {
      g.box([x0, x0 + 2], [2, 5], [1, 3], wall);
      g.box([x0, x0 + 2], [6, 6], [1, 3], roofL).set(x0, 6, 1, 0).set(x0 + 2, 6, 1, 0).set(x0, 6, 3, 0).set(x0 + 2, 6, 3, 0).set(x0 + 1, 7, 2, roofL);
    }
    g.box([3, 5], [2, 7], [1, 3], wall).box([3, 5], [2, 2], [1, 3], wallDark);
    g.box([3, 5], [8, 8], [1, 3], roofP).set(3, 8, 1, 0).set(5, 8, 1, 0).set(3, 8, 3, 0).set(5, 8, 3, 0).set(4, 9, 2, roofP);
    g.box([4, 4], [2, 3], [3, 3], gold).set(4, 6, 3, glow);
    pair(g, 1, 4, 3, glow);
    g.set(5, 9, 2, gold);                                                     // pennant
    return g.entry({ id: 'cand-p8-cloud-castle', name: 'Cloud Castle' });
  })(),
];
