// Page 6 · Teatime (X): the kitchen at four o'clock. The game already has
// the kettle, teacup, teapot, croissant, jam jar and pie, so this page
// brings the rest of the table: a three-tier stand, a whole cake with a
// slice out, a biscuit tin, a samovar, a toast rack, a stand mixer, a
// kitchen scale; and the kitchen's residents, each with its prop: a
// dormouse asleep in the teapot, a cow-shaped creamer, a kitten in the
// mixing bowl, an owl tea cosy, a hedgehog bun, a bear in a chef's hat.
//
// Bonsai rules (page5/home-1.js): one strong base, 2-3 masses at different
// heights, a characterful connecting part, 3-5 colours with a job each,
// holes that mean something. Faces look toward +z.
import { grid } from '../voxel.js';
import { INK, front, frontZ, out, pair, pairZ, pairFront, quad, kawaii, tint, lathe, onSurface } from './kit.js';

const potBlue = 0x8fb8de, dot = 0xfbf8f2, dormouse = 0xd9a066, dormBelly = 0xf6e2c0, lidKnob = 0xe9b949,
  cow = 0xfbf8f2, patch = 0x3a3442, muzzle = 0xf4b3b8, hornCream = 0xf3e2b0, udder = 0xf59bb2,
  bowl = 0xf3ead8, bowlBand = 0x5b8fd6, batter = 0xf6dfa0, tabby = 0xf2a65a, tabbyStripe = 0xd9803a, flour = 0xffffff, spoon = 0xb07a50,
  cosy = 0xe0a23a, cosyRib = 0xc98a2a, wing = 0xb8573a, eyeRing = 0xf6efe4, beak = 0xf08a3c, china = 0xfbf8f2,
  bun = 0xd99a52, crust = 0xa8652e, bunPale = 0xf0c890, choc = 0x4a2f2a, plate = 0xfbf8f2,
  bear = 0xb07a4a, bearMuzzle = 0xf0d8b4, apron = 0xfbf8f2, hat = 0xffffff, pin = 0xd9b48f, pinEnd = 0x8a5a3c,
  porcelain = 0xfbf8f2, rimGold = 0xe9b949, rimRose = 0xe98aa6, sandwich = 0xf6e7c8, cucumber = 0x8cc36a, scone = 0xd9a45a, jam = 0xd9354a, cream = 0xfff4dc,
  macaron = 0xf4a3c8, macaron2 = 0x9fe0d0,
  mint = 0x9fd8c8, mintDark = 0x6fb8a8, steel = 0xc9d1d9, chrome = 0xe4e9ee,
  sponge = 0xf3cf8a, jamLayer = 0xd9354a, frosting = 0xfbe9ee, berry = 0xe0384b, leafGreen = 0x5fae6e,
  tin = 0x2f5a9e, tinGold = 0xe9b949, biscuit = 0xe0b06a, chocBiscuit = 0x6b4a3a, wafer = 0xf4a3b5, lidFlower = 0xf28aa8,
  scaleBody = 0x6fb8a8, dial = 0xfbf8f2, needle = 0xd9354a, pan = 0xd9a83f, apple = 0xe0384b, stalk = 0x6b4a3a,
  brass = 0xd9a83f, brassDark = 0xb07a3a, ebony = 0x5a3b30, chinaBlue = 0x5b8fd6,
  toast = 0xe9b15a, toastCrust = 0xa8652e, rack = 0xc9d1d9, butter = 0xf8e27a;

export default [
  // a dormouse asleep in the teapot (as at the Mad Hatter's): it has
  // pushed the lid up with its head and dozed off there, paws on the rim
  (() => {
    const g = grid(9, 9, 5);
    lathe(g, [4, 2], 0, [1.5, 2.3, 2.5, 2.3, 1.5], potBlue);
    tint(g, (x, y, z) => (x + 2 * y + 3 * z) % 5 === 0 && y >= 1 && y <= 3, dot);
    for (let y = 1; y <= 3; y++) g.cylinder('y', [4, 2], 1.3, [y, y], 0);
    g.clear(4, 4, 2);
    g.set(7, 1, 2, potBlue).set(7, 2, 2, potBlue).set(8, 2, 2, potBlue).set(8, 3, 2, potBlue);   // spout
    g.set(1, 1, 2, potBlue).set(0, 1, 2, potBlue).set(0, 2, 2, potBlue).set(0, 3, 2, potBlue).set(1, 3, 2, potBlue);   // handle
    g.ellipsoid([4, 5.5, 2], [1.6, 1.3, 1.4], dormouse).set(4, 4, 2, dormouse);
    front(g, 4, 5, dormBelly);
    pair(g, 2, 6, 2, dormouse); pair(g, 2, 6, 3, dormBelly);                          // round ears
    pairFront(g, 3, 5, INK);                                                         // eyes shut
    pairFront(g, 3, 4, dormouse);                                                    // paws on the rim
    g.box([3, 5], [7, 7], [1, 3], potBlue).set(4, 8, 2, lidKnob);                     // the lid, worn as a hat
    return g.entry({ id: 'cand-p6-teapot-dormouse', name: 'Dormouse in a Teapot' });
  })(),

  // a cow creamer: the jug is the cow. Milk pours from her mouth, her tail
  // curls up into the handle, the lid sits on her back; pink udder, patches
  (() => {
    const g = grid(9, 7, 5);
    g.ellipsoid([4, 3, 2], [3.4, 1.9, 1.9], cow);
    quad(g, 2, 0, 1, cow); quad(g, 2, 1, 1, cow);                                    // legs
    g.set(4, 1, 2, udder);
    g.box([7, 8], [3, 5], [1, 3], cow).box([8, 8], [3, 3], [1, 3], muzzle).clear(8, 5, 1).clear(8, 5, 3);   // head
    pairZ(g, 7, 5, 0, cow); pairZ(g, 7, 6, 1, hornCream);                             // ears, horns
    pairZ(g, 8, 4, 1, INK);                                                          // eyes
    g.box([2, 3], [3, 4], [4, 4], patch).box([5, 5], [2, 3], [4, 4], patch).box([4, 5], [4, 4], [1, 2], patch).set(1, 3, 1, patch);
    g.box([3, 5], [5, 5], [2, 2], cow).set(4, 6, 2, rimGold);                         // the lid on her back
    g.set(0, 3, 2, cow).set(0, 4, 2, cow).set(0, 5, 2, cow).set(1, 5, 2, patch);     // tail handle
    return g.entry({ id: 'cand-p6-cow-creamer', name: 'Cow Creamer' });
  })(),

  // a ginger kitten in the mixing bowl: paws on the rim, a dab of flour on
  // its nose, sat in the batter, the wooden spoon still standing up behind
  (() => {
    const g = grid(9, 7, 7);
    lathe(g, [4, 3], 0, [2.0, 3.0, 3.5, 3.7], bowl);
    tint(g, (x, y) => y === 2, bowlBand);
    for (const [y, r] of [[1, 1.8], [2, 2.4], [3, 2.6]]) g.cylinder('y', [4, 3], r, [y, y], 0);
    g.cylinder('y', [4, 3], 1.8, [1, 1], batter);
    g.ellipsoid([4, 3.8, 3.2], [1.8, 1.6, 1.5], tabby).box([3, 5], [2, 2], [2, 4], tabby);   // sat in the batter
    tint(g, (x, y, z) => g.get(x, y, z) === tabby && z <= 2 && x % 2 === 0, tabbyStripe);
    pair(g, 3, 5, 3, tabby); pair(g, 3, 6, 3, tabby); pair(g, 2, 5, 3, tabby);         // ears
    kawaii(g, 3, 4, { bx: 3, by: 3 });
    front(g, 4, 3, flour);
    pair(g, 3, 4, 6, tabby);                                                         // paws on the rim
    g.box([6, 6], [3, 6], [1, 1], spoon);                                            // the spoon
    return g.entry({ id: 'cand-p6-mixing-kitten', name: 'Kitten in a Bowl' });
  })(),

  // an owl tea cosy: knitted mustard with rust wings, two big button eyes
  // and a beak, ear tufts, the teapot's spout and handle poking out
  (() => {
    const g = grid(9, 8, 6);
    g.ellipsoid([4, 3, 2], [2.8, 3.2, 2.2], (x) => (x % 2 ? cosy : cosyRib));
    tint(g, (x, y) => (x <= 2 || x >= 6) && y >= 1 && y <= 4, wing);
    tint(g, (x, y) => y === 0, china);
    for (const ex of [2, 5]) for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) { front(g, ex + dx, 3 + dy, eyeRing); out(g, ex + dx, 3 + dy, eyeRing); }   // big button eyes stand proud
    pairFront(g, 3, 3, INK);
    out(g, 4, 2, beak); front(g, 4, 3, beak);
    pair(g, 3, 6, 2, cosyRib); pair(g, 3, 7, 2, cosyRib); pair(g, 3, 6, 3, cosyRib); pair(g, 2, 7, 2, cosyRib);   // ear tufts
    g.set(7, 1, 2, china).set(7, 2, 2, china).set(8, 2, 2, china).set(8, 3, 2, china);   // spout
    g.set(1, 1, 2, china).set(0, 1, 2, china).set(0, 2, 2, china).set(0, 3, 2, china).set(1, 3, 2, china);   // handle
    return g.entry({ id: 'cand-p6-owl-cosy', name: 'Owl Tea Cosy' });
  })(),

  // a hedgehog bun on a plate: a bread roll snipped into spines and baked
  // dark at the tips, a pale snout, chocolate-chip eyes and nose
  (() => {
    const g = grid(7, 6, 9);
    g.cylinder('y', [3, 4], 3.4, [0, 0], plate);
    g.ellipsoid([3, 1.4, 3.6], [2.5, 1.9, 3.0], bun);
    for (let z = 0; z < 9; z++) for (let x = 0; x < 7; x++) {
      let top = -1;
      for (let y = 5; y >= 1; y--) if (g.get(x, y, z)) { top = y; break; }
      if (top >= 2 && z <= 5 && (x + z) % 2 === 0) g.set(x, top + 1, z, crust);
    }
    g.box([2, 4], [1, 2], [7, 7], bunPale).set(3, 1, 8, bunPale).set(3, 2, 8, choc);  // snout and nose
    pairFront(g, 2, 3, choc);
    g.set(1, 1, 6, bunPale).set(5, 1, 6, bunPale);                                   // little feet
    return g.entry({ id: 'cand-p6-hedgehog-bun', name: 'Hedgehog Bun' });
  })(),

  // a bear in a chef's hat and apron, a rolling pin held across in both paws
  (() => {
    const g = grid(7, 9, 6);
    g.ellipsoid([3, 1.8, 2.6], [2.2, 1.8, 1.9], bear)
      .ellipsoid([3, 4.6, 2.8], [2.3, 1.6, 1.8], bear);
    tint(g, (x, y, z) => z >= 3 && y <= 2 && x >= 2 && x <= 4, apron);
    out(g, 3, 4, bearMuzzle); front(g, 3, 4, bearMuzzle);
    { const z = frontZ(g, 3, 4); g.set(3, 4, z, INK).set(3, 3, z - 1, bearMuzzle); }
    kawaii(g, 2, 5, { bx: 1, by: 4 });
    pair(g, 1, 6, 2, bear); pair(g, 1, 6, 3, bear);                                  // ears
    g.box([2, 4], [6, 6], [2, 3], hat).ellipsoid([3, 7.6, 2.5], [1.7, 1.1, 1.5], hat);   // the toque
    g.box([0, 6], [2, 2], [5, 5], pin).set(0, 2, 5, pinEnd).set(6, 2, 5, pinEnd);    // rolling pin
    pair(g, 2, 3, 5, bear);                                                          // paws over it
    pair(g, 2, 0, 3, bear);                                                          // feet
    return g.entry({ id: 'cand-p6-baker-bear', name: 'Baker Bear' });
  })(),

  // a three-tier cake stand, rose-rimmed china on a gold pole: finger sandwiches round the
  // bottom, scones with jam and cream in the middle, macarons on top, and a
  // gold loop to carry it by
  (() => {
    const g = grid(7, 9, 7);
    const plateAt = (y, r) => { g.cylinder('y', [3, 3], r, [y, y], porcelain); g.cylinder('y', [3, 3], r, [y, y], (x, yy, z) => (Math.hypot(x - 3, z - 3) > r - 0.6 ? rimRose : porcelain)); };
    plateAt(0, 3.3); plateAt(3, 2.3); plateAt(6, 1.5);
    g.box([3, 3], [1, 7], [3, 3], rimGold);
    for (let z = 0; z < 7; z++) for (let x = 0; x < 7; x++) {
      const d = Math.hypot(x - 3, z - 3);
      if (d >= 1 && d <= 2.3) { g.set(x, 1, z, sandwich); if ((x + z) % 2 === 0) g.set(x, 2, z, (x + z) % 4 === 0 ? cucumber : sandwich); }   // stacked sandwiches
    }
    for (const [x, z] of [[2, 2], [4, 4], [2, 4], [4, 2]]) g.set(x, 4, z, scone).set(x, 5, z, (x + z) % 4 === 0 ? jam : cream);
    g.set(3, 7, 2, macaron).set(3, 7, 4, macaron2).set(2, 7, 3, macaron2).set(4, 7, 3, macaron);
    g.set(3, 8, 3, rimGold).set(2, 8, 3, rimGold).set(4, 8, 3, rimGold);
    return g.entry({ id: 'cand-p6-cake-stand', name: 'Cake Stand' });
  })(),

  // a retro stand mixer in mint: the head tilted over a steel bowl, the
  // beater down in the batter, a chrome band and a speed dial
  (() => {
    const g = grid(9, 9, 5);
    g.box([0, 7], [0, 0], [0, 4], mint); quad(g, 0, 0, 0, 0); g.clear(7, 0, 0).clear(7, 0, 4);
    g.box([0, 2], [1, 5], [1, 3], mint);
    g.ellipsoid([3.8, 7, 2], [3.6, 1.5, 2.1], mint);
    tint(g, (x, y) => y >= 6 && x === 5, chrome);
    g.box([8, 8], [6, 7], [2, 2], mint);
    lathe(g, [5, 2], 1, [1.5, 2.2, 2.4, 2.4], steel);
    for (const [y, r] of [[2, 1.3], [3, 1.4], [4, 1.4]]) g.cylinder('y', [5, 2], r, [y, y], 0);
    g.cylinder('y', [5, 2], 1.3, [2, 2], batter);
    g.box([5, 5], [3, 5], [2, 2], chrome);                                           // beater
    g.set(1, 4, 4, mintDark).set(1, 4, 5, chrome);                                    // speed dial
    return g.entry({ id: 'cand-p6-stand-mixer', name: 'Stand Mixer' });
  })(),

  // a whole layer cake on a plate with a slice taken out: sponge, jam and
  // cream in the cut, pink frosting outside, strawberries round the top
  (() => {
    const g = grid(9, 6, 9);
    g.cylinder('y', [4, 4], 4.4, [0, 0], plate);
    g.cylinder('y', [4, 4], 3.6, [1, 4], (x, y) => (y === 2 ? jamLayer : y === 3 ? cream : sponge));
    tint(g, (x, y, z) => y >= 1 && (y === 4 || Math.hypot(x - 4, z - 4) > 2.8), frosting);
    g.box([5, 8], [1, 4], [5, 8], 0);                                                // the slice out
    for (const [x, z] of [[1, 4], [2, 2], [4, 1], [6, 2], [2, 6], [4, 7]]) g.set(x, 5, z, berry);
    g.set(4, 5, 4, berry).set(4, 5, 3, leafGreen);
    return g.entry({ id: 'cand-p6-layer-cake', name: 'Layer Cake' });
  })(),

  // a biscuit tin with its lid off and propped up behind: navy with a gold
  // band, the lid painted with a flower; inside, shortbread, chocolate
  // rounds and a pink wafer
  (() => {
    const g = grid(7, 6, 8);
    g.cylinder('y', [3, 4], 2.8, [0, 2], (x, y) => (y === 1 ? tinGold : tin));
    g.cylinder('y', [3, 4], 1.8, [1, 2], 0);
    g.cylinder('y', [3, 4], 1.8, [1, 1], biscuit);
    g.set(2, 2, 3, chocBiscuit).set(2, 2, 4, chocBiscuit).set(4, 2, 4, wafer).set(4, 2, 5, wafer).set(3, 2, 5, biscuit).set(3, 3, 4, biscuit).set(3, 2, 4, biscuit);
    g.cylinder('z', [3, 3], 2.7, [1, 1], (x, y) => (Math.hypot(x - 3, y - 3) > 1.9 ? tinGold : tin));   // the lid
    g.set(3, 3, 1, lidFlower).set(2, 3, 1, lidFlower).set(4, 3, 1, lidFlower).set(3, 2, 1, lidFlower).set(3, 4, 1, tinGold);
    return g.entry({ id: 'cand-p6-biscuit-tin', name: 'Biscuit Tin' });
  })(),

  // a kitchen scale: a teal body, a round dial with a red needle, and two
  // red apples weighed in the brass pan
  (() => {
    const g = grid(7, 9, 5);
    g.box([1, 5], [0, 4], [0, 3], scaleBody); quad(g, 1, 4, 0, 0);
    pair(g, 1, 0, 0, 0); pair(g, 1, 0, 3, 0);
    g.cylinder('z', [3, 2], 1.6, [4, 4], dial).set(3, 2, 4, INK).set(4, 3, 4, needle);
    g.box([3, 3], [5, 5], [1, 2], steel);
    lathe(g, [3, 2], 6, [1.5], pan); g.cylinder('y', [3, 2], 2.6, [7, 7], pan).cylinder('y', [3, 2], 1.0, [7, 7], apple);
    g.set(2, 8, 2, apple).set(4, 8, 2, apple).set(4, 8, 1, apple).set(2, 8, 3, apple).set(4, 7, 1, apple).set(2, 7, 3, apple);   // two apples, heaped
    g.set(2, 8, 2, stalk).set(4, 8, 1, leafGreen);
    return g.entry({ id: 'cand-p6-kitchen-scale', name: 'Kitchen Scale' });
  })(),

  // a samovar: a brass urn on a footed base, ebony handles, a tap at the
  // front with a cup under it, and the little teapot warming on its crown
  (() => {
    const g = grid(7, 10, 6);
    lathe(g, [3, 2], 0, [1.5, 2.2, 1.0, 2.0, 2.6, 2.6, 2.6, 1.6, 1.0], brass);
    tint(g, (x, y) => y === 1 || y === 7, brassDark);
    pair(g, 0, 6, 2, ebony); pair(g, 0, 5, 2, ebony);                                // handles
    g.set(3, 4, 5, brassDark).set(3, 3, 5, brassDark);                               // the tap
    g.cylinder('y', [3, 2], 1.5, [9, 9], chinaBlue).set(3, 9, 2, porcelain);         // the teapot on top
    g.set(4, 9, 4, chinaBlue);
    return g.entry({ id: 'cand-p6-samovar', name: 'Samovar' });
  })(),

  // a silver toast rack holding four slices upright, crusts and all, a
  // pat of butter on the end and a loop handle in the middle
  (() => {
    const g = grid(9, 7, 5);
    g.box([0, 8], [0, 0], [0, 0], rack).box([0, 8], [0, 0], [4, 4], rack);
    for (const x of [0, 2, 4, 6, 8]) g.box([x, x], [1, 4], [0, 0], rack).box([x, x], [1, 4], [4, 4], rack).box([x, x], [4, 4], [1, 3], rack);
    for (const x of [1, 3, 5, 7]) g.box([x, x], [1, 5], [0, 4], (xx, y, z) => (y === 5 || z === 0 || z === 4 ? toastCrust : toast));
    for (const x of [1, 3, 5, 7]) { g.clear(x, 5, 0).clear(x, 5, 4); }
    g.box([4, 4], [5, 6], [2, 2], rack).box([3, 5], [6, 6], [2, 2], rack);           // handle
    g.set(8, 1, 2, butter).set(8, 1, 3, butter).set(8, 0, 2, rack).set(8, 0, 3, rack);   // butter pat on the end
    return g.entry({ id: 'cand-p6-toast-rack', name: 'Toast Rack' });
  })(),
];
