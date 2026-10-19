// Page 9 · VIII Desert Oasis: new levels for a short chapter (5 levels and
// the Keyhole Arch). Already in the game: Camel Calf, Fennec Fox, Meerkat
// Lookout, Date Palm Spring, Cactus. Page 7 still holds unpicked desert ideas
// (Sand Cat, Jerboa, Scarab, Striped Tent, Water Jar & Gecko, Dallah, Shaduf,
// Magic Carpet), so none of those come back here. Tuned for the chapter's
// middle (its levels run D 9.8-12.8, mean 11.3). The sky is pale gold, so
// sand colours stay small: bodies lean deep and every piece carries one cool
// note (teal, blue or water).
import { grid } from '../voxel.js';
import { INK, BLUSH, front, out, pair, pairFront, pairZ, quad, tint, onSurface, lathe } from './kit.js';

const sand = 0xe8d3a3, sandDk = 0xd2a86e, terra = 0xc8704b, terraDk = 0x9c4f33, teal = 0x2f9a8f, tealLt = 0x4fb3a9,
  blue = 0x3f6fb5, blueDk = 0x2f4f8a, water = 0x5bb8d6, cream = 0xf6efe4, gold = 0xe9b949, bronze = 0xa87a3a,
  bronzeDk = 0x7a5a2a, palm = 0x5fae6e, palmDk = 0x3f8a5b, wood = 0x8a5a3c, woodDk = 0x6b4a3a, red = 0xd9534f,
  redDk = 0xa83f45, black = 0x3a3442, white = 0xfbf8f2, stone = 0x9a8a7e, stoneDk = 0x7a6c62, amber = 0xf2a03d;

export default [
  // a hoopoe on a sandstone rock: a cinnamon bird with a raised crest of
  // black-tipped feathers, zebra-barred wings and a long curved bill
  (() => {
    const g = grid(10, 9, 4);
    const cin = 0xd98a52;
    g.box([1, 7], [0, 0], [0, 3], stone).box([2, 6], [1, 1], [1, 2], stoneDk);
    pairZ(g, 4, 2, 1, black);                                                    // legs
    g.ellipsoid([4.5, 4, 1.5], [2.4, 1.6, 1.6], cin);
    tint(g, (x, y, z) => y >= 4 && x <= 5 && (z === 0 || z === 3 || y === 5), (x) => (x % 2 ? black : cream));
    g.box([0, 2], [4, 5], [1, 2], black).box([1, 1], [4, 5], [1, 2], cream);    // tail, a white band
    g.box([6, 7], [5, 6], [1, 2], cin);
    pairZ(g, 7, 6, 1, INK);
    g.box([8, 8], [5, 5], [1, 2], black).box([9, 9], [4, 5], [1, 2], black);    // the long bill
    g.box([5, 8], [7, 7], [1, 2], cin).box([5, 8], [8, 8], [1, 2], (x) => (x % 2 ? black : cin));   // the crest
    return { ...g.entry({ id: 'cand-p9-hoopoe', name: 'Hoopoe' }), fraction: 0.65, seed: 5, story: 'It raises its crest like a fan whenever it has news.' };
  })(),

  // an ostrich, tall and proud: a fluffy black body with white plumes, a long
  // pink neck, big lashy eyes and strong legs, one foot forward
  (() => {
    const g = grid(8, 10, 4);
    const neck = 0xd9888a, beak = 0xf2a03d;
    for (const z of [1, 2]) g.box([3, 3], [0, 3], [z, z], neck).set(4, 0, z, neck);
    g.ellipsoid([3, 5, 1.5], [2.8, 1.9, 1.9], black);
    tint(g, (x, y, z) => y === 5 && (z === 0 || z === 3) && x >= 2 && x <= 4, white);   // wing plumes
    g.box([0, 0], [5, 6], [1, 2], white);                                          // tail plume
    g.box([5, 5], [6, 8], [1, 2], neck).box([5, 6], [9, 9], [1, 2], neck).set(7, 9, 1, beak).set(7, 9, 2, beak);
    pairZ(g, 6, 9, 1, INK);
    return { ...g.entry({ id: 'cand-p9-ostrich', name: 'Ostrich' }), fraction: 0.7, seed: 15, story: 'Too proud to fly, and much too fast to need to.' };
  })(),

  // an oryx standing side-on: a tawny coat over a white belly, a black stripe
  // along each flank, a black-and-white face and long straight horns
  (() => {
    const g = grid(8, 10, 4);
    const coat = 0xc98a52;
    for (const x of [1, 5]) for (const z of [0, 3]) g.box([x, x], [0, 2], [z, z], (_, y) => (y === 0 ? black : y === 1 ? white : black));
    g.box([1, 5], [3, 4], [0, 3], coat);
    for (const x of [1, 5]) for (const z of [0, 3]) g.clear(x, 4, z);
    tint(g, (x, y, z) => y === 3 && (z === 0 || z === 3), black);                 // flank stripes
    tint(g, (x, y, z) => y === 3 && (z === 1 || z === 2), white);
    g.box([6, 6], [4, 5], [1, 2], coat).box([6, 7], [6, 6], [1, 2], white).box([7, 7], [5, 5], [1, 2], black);
    pairZ(g, 6, 6, 1, black);                                                      // the face mask
    for (const z of [1, 2]) for (const [x, y] of [[6, 7], [6, 8], [5, 8], [5, 9]]) g.set(x, y, z, black);   // horns
    g.box([0, 0], [3, 4], [1, 2], coat).set(0, 3, 1, black).set(0, 3, 2, black);   // tail
    return { ...g.entry({ id: 'cand-p9-oryx', name: 'Oryx' }), fraction: 0.5, seed: 7, story: 'It can smell rain from a whole day away.' };
  })(),

  // a chameleon on a twig: a tall green body with a ridge along its back, a
  // helmet head, swivelling eyes on both sides and a tail curled like a fern
  (() => {
    const g = grid(10, 6, 4);
    const green = 0x5fae4a, belly = 0xb8dc6a, ridge = 0x3f8a3f;
    g.box([0, 9], [0, 0], [1, 2], wood).box([8, 8], [1, 2], [1, 2], wood).set(9, 3, 1, palm).set(9, 3, 2, palm).set(8, 3, 1, palm).set(8, 3, 2, palm);
    g.ellipsoid([4.5, 2.6, 1.5], [2.6, 1.6, 1.1], green);
    tint(g, (x, y) => y === 2, belly);
    for (const x of [2, 3, 4, 5, 6]) {                                             // a saw-tooth ridge along the back
      let top = 0;
      for (let y = 0; y < 7; y++) if (g.get(x, y, 1) === green) top = y;
      for (const z of [1, 2]) { g.set(x, top + 1, z, ridge); if (x % 2) g.set(x, top + 2, z, ridge); }
    }
    g.box([7, 7], [2, 4], [1, 2], green).set(7, 5, 1, ridge).set(7, 5, 2, ridge).set(8, 2, 1, green).set(8, 2, 2, green);
    pairZ(g, 7, 3, 0, INK);                                                        // turret eyes
    for (const [x, y] of [[2, 3], [1, 3], [0, 3], [0, 2], [0, 1], [1, 1]]) g.set(x, y, 1, green).set(x, y, 2, green);   // the curled tail
    for (const x of [3, 6]) g.box([x, x], [1, 1], [1, 2], green);                 // legs down to the twig
    for (const x of [3, 6]) pairZ(g, x, 0, 0, green);                              // feet gripping it
    return { ...g.entry({ id: 'cand-p9-chameleon', name: 'Chameleon' }), fraction: 0.8, seed: 12, story: 'One eye on the date palm, one on you. Both are friendly.' };
  })(),

  // a little grey donkey carrying water home: a jar slung on each side, a
  // blue saddle cloth, a white muzzle, very long ears
  (() => {
    const g = grid(9, 8, 5);
    const grey = 0x8f8796, pale = 0xd8d2dc, dark = 0x5a5462;
    for (const x of [2, 5]) for (const z of [1, 3]) g.set(x, 0, z, dark).set(x, 1, z, grey);
    g.box([1, 6], [2, 3], [1, 3], grey);
    tint(g, (x, y) => y === 2, pale);
    g.box([6, 6], [4, 4], [2, 2], grey).box([7, 8], [4, 5], [1, 3], grey).box([8, 8], [4, 4], [1, 3], pale);
    g.clear(8, 5, 1).clear(8, 5, 3);
    pairZ(g, 7, 6, 1, grey); pairZ(g, 7, 7, 1, dark);                              // long ears
    pairZ(g, 7, 5, 1, INK);
    g.box([2, 5], [4, 4], [1, 3], blue);                                           // saddle cloth
    for (const [x, y] of [[3, 1], [4, 1], [3, 2], [4, 2], [3, 3], [4, 3]]) pairZ(g, x, y, 0, terra);   // the jars
    pairZ(g, 3, 3, 0, terraDk); pairZ(g, 4, 3, 0, terraDk);
    g.set(0, 3, 2, grey).set(0, 2, 2, dark);
    return { ...g.entry({ id: 'cand-p9-donkey', name: 'Donkey & Water Jars' }), fraction: 0.85, seed: 14, story: 'Every morning it carries the oasis home, two jars at a time.' };
  })(),

  // a falcon on its block perch, hooded for calm: a red leather hood with a
  // gold plume, a speckled cream breast, slate wings and yellow feet
  (() => {
    const g = grid(5, 10, 5);
    const slate = 0x6f6258, breast = 0xf0e2c8, fleck = 0x9a7a5a, hood = 0xc84a3a, yellow = 0xf2c84a;
    g.box([0, 4], [0, 0], [1, 3], woodDk).box([2, 2], [1, 2], [2, 2], wood).box([1, 3], [3, 3], [1, 3], red);
    tint(g, (x, y, z) => y === 3 && (x === 1 || x === 3) && (z === 1 || z === 3), gold);
    g.ellipsoid([2, 5.6, 2], [1.9, 2.0, 1.5], slate);
    tint(g, (x, y, z) => z >= 3 && Math.abs(x - 2) <= 1 && y <= 7, (x, y) => ((x + y) % 3 === 0 ? fleck : breast));
    pairFront(g, 1, 4, yellow);
    g.box([1, 3], [8, 9], [1, 3], hood).set(2, 9, 2, gold).set(2, 8, 4, yellow);
    g.box([2, 2], [4, 5], [0, 0], slate);
    return { ...g.entry({ id: 'cand-p9-falcon', name: 'Hooded Falcon' }), fraction: 0.75, seed: 4, story: 'The hood keeps it calm. It is dreaming about the sky.' };
  })(),

  // a tagine: a glazed clay dish with a tall cone of a lid, painted in teal and
  // blue bands, a little knob on top
  (() => {
    const g = grid(7, 8, 7);
    g.cylinder('y', [3, 3], 2.6, [0, 0], terraDk).cylinder('y', [3, 3], 3.4, [1, 1], terra);
    tint(g, (x, y, z) => y === 1 && onSurface(g, x, y, z) && (x + z) % 2 === 0, tealLt);
    lathe(g, [3, 3], 2, [2.7, 2.2, 1.6, 1.1, 0.6], (x, y) => [blue, cream, terra, teal, terra][y - 2]);
    tint(g, (x, y, z) => y === 3 && (x + z) % 2 === 1, teal);
    g.set(3, 7, 3, terraDk);
    return { ...g.entry({ id: 'cand-p9-tagine', name: 'Tagine' }), fraction: 0.9, seed: 15, story: 'Something has been simmering under that lid since breakfast.' };
  })(),

  // a kasbah tower of red earth: stepped corner pinnacles, a diamond lattice
  // pressed into its upper walls, small dark windows, a cedar door and a
  // stork's nest on top with the stork at home
  (() => {
    const g = grid(7, 10, 7);
    const adobe = 0xc87a4a, adobeDk = 0xa85f3a;
    g.box([0, 6], [0, 0], [0, 6], adobeDk).box([1, 5], [1, 7], [1, 5], adobe);
    tint(g, (x, y, z) => y >= 5 && y <= 6 && onSurface(g, x, y, z) && (x + z + y) % 2 === 0 && (x === 1 || x === 5 || z === 1 || z === 5), adobeDk);
    for (const [x, z] of [[1, 1], [5, 1], [1, 5], [5, 5]]) g.set(x, 8, z, adobe).set(x, 9, z, adobeDk);
    for (const [x, z] of [[3, 1], [3, 5], [1, 3], [5, 3]]) g.set(x, 8, z, adobe);
    g.box([3, 3], [1, 2], [5, 5], wood).set(3, 3, 5, adobeDk);
    pairFront(g, 2, 4, INK); front(g, 3, 6, INK);
    g.box([2, 4], [8, 8], [2, 4], wood).set(3, 9, 3, white).set(3, 9, 4, red);    // the nest, a stork
    return { ...g.entry({ id: 'cand-p9-kasbah', name: 'Kasbah Tower' }), fraction: 0.75, seed: 9, story: 'The storks come back to the same tower every spring.' };
  })(),

  // a courtyard fountain in zellige tile: a round basin of teal, blue and
  // white mosaic, still water, a slim column carrying a bowl that overflows
  (() => {
    const g = grid(7, 6, 7);
    g.cylinder('y', [3, 3], 3.4, [0, 1], (x, y, z) => ((x + z) % 3 === 0 ? white : (x + z) % 3 === 1 ? teal : blue));
    g.cylinder('y', [3, 3], 2.4, [1, 1], water);
    g.box([3, 3], [1, 3], [3, 3], blueDk);
    g.cylinder('y', [3, 3], 1.5, [4, 4], (x, z) => teal).set(3, 4, 3, water).set(3, 5, 3, white);
    for (const [x, z] of [[1, 3], [5, 3], [3, 1], [3, 5]]) g.set(x, 4, z, water);
    return { ...g.entry({ id: 'cand-p9-fountain', name: 'Zellige Fountain' }), fraction: 0.7, seed: 10, story: 'Cool water in the middle of the heat, for anyone passing.' };
  })(),

  // a pierced brass lantern: a domed cap and hanging ring, coloured glass
  // panes set in a dark brass frame, a flame somewhere inside
  (() => {
    const g = grid(5, 9, 5);
    g.box([1, 3], [0, 0], [1, 3], bronzeDk).box([0, 4], [1, 1], [0, 4], bronze);
    g.box([0, 4], [2, 5], [0, 4], bronze);
    const glass = [teal, red, blue, amber];
    for (let y = 2; y <= 5; y++) {
      for (const k of [1, 2, 3]) {
        g.set(k, y, 4, glass[(k + y) % 4]).set(k, y, 0, glass[(k + y + 2) % 4]);
        g.set(0, y, k, glass[(k + y + 1) % 4]).set(4, y, k, glass[(k + y + 3) % 4]);
      }
    }
    tint(g, (x, y, z) => (y === 3 || y === 4) && (x === 2 || z === 2) && onSurface(g, x, y, z), gold);
    g.box([0, 4], [6, 6], [0, 4], bronzeDk).box([1, 3], [7, 7], [1, 3], bronze);
    for (const [x, z] of [[0, 0], [4, 0], [0, 4], [4, 4]]) g.clear(x, 6, z);
    g.set(2, 8, 2, bronzeDk).set(1, 8, 2, bronzeDk).set(3, 8, 2, bronzeDk);
    return { ...g.entry({ id: 'cand-p9-brass-lantern', name: 'Brass Lantern' }), fraction: 0.95, seed: 6, story: 'At dusk it throws coloured stars across the whole courtyard.' };
  })(),
];
