// Page 14 · I Works of Hand: built by people whose names are gone, and most
// of it still works. Page 14 follows Kellan's picks from pages 11-13, above
// all the Aqueduct ("might be the best one yet"), the Stilt House and the
// Yurt: old infrastructure, one honest building material for most of the
// body, its detail in regular courses (arches, slats, tiers, merlons), and
// a cap of a second material where the roof meets the wall. A stepwell, a
// trullo, a granary on stone stilts, a windcatcher, rice terraces, a cliff
// dwelling, a caravanserai and a sunken cistern.
// Sky: Stones (the Old Stones mist cooled to slate), so honey stone,
// whitewash and terracotta all hold their warmth against it.
import { grid } from '../voxel.js';
import { INK, pair, quad, tint, onSurface, front, pairFront, lathe } from './kit.js';

const honey = 0xd9b47a, honeyLt = 0xead2a0, honeyDk = 0xb8925a, white = 0xf6efe4, whiteDk = 0xe2d8c6,
  slate = 0x8f8a84, slateLt = 0xb0aaa2, stone = 0xc7beb0, stoneLt = 0xdcd4c6, stoneDk = 0x8f877c,
  terra = 0xc8704b, terraDk = 0xa4553a, wood = 0x8a5a3c, woodLt = 0xb07a3a, woodDk = 0x6b4a3a,
  water = 0x5ea8dc, waterDk = 0x3f7fb8, foam = 0xdff1fa, turq = 0x3fa7a0, adobe = 0xd9a46a, adobeLt = 0xe8c08a,
  adobeDk = 0xb8834e, rice = 0x8cc860, bund = 0x5f9e4a, earth = 0x8a6a4a, straw = 0xc9a24a, strawDk = 0xa8832e,
  rock = 0xb07560, rockLt = 0xc4876e, sage = 0x9ab87a, pale = 0xead2a8, marble = 0xe6e0d4;

export default [
  // a stepwell: a square pit cut down into honey stone in shrinking courses,
  // each course a band of its own shade, water at the bottom, and a little
  // pavilion with a terracotta roof on the back rim
  (() => {
    const g = grid(9, 7, 9);
    g.box([0, 8], [0, 4], [0, 8], (x, y) => (y % 2 ? honey : honeyLt));
    g.box([1, 7], [4, 4], [2, 7], 0).box([2, 6], [3, 3], [3, 6], 0).box([3, 5], [2, 2], [4, 5], 0);   // the courses down
    g.box([3, 5], [1, 1], [4, 5], water).set(4, 1, 4, foam);                             // the water
    for (const x of [2, 4, 6]) g.set(x, 5, 1, honeyLt);                                  // the pavilion's pillars
    g.box([2, 6], [5, 5], [0, 0], honeyDk);
    g.box([1, 7], [6, 6], [0, 1], terra);                                                // its roof
    tint(g, (x, y, z) => y === 6 && (x === 1 || x === 7), terraDk);
    return g.entry({ id: 'cand-p14-stepwell', name: 'Stepwell', story: 'Every step down is cooler than the last, and the water waits at the bottom.' });
  })(),

  // a trullo: round whitewashed walls under a cone of grey stone laid in
  // courses, a white pinnacle on top, a sign painted on the roof, a wooden door
  (() => {
    const g = grid(7, 9, 7);
    g.cylinder('y', [3, 3], 3.2, [0, 2], white);
    tint(g, (x, y) => y === 0, whiteDk);
    lathe(g, [3, 3], 3, [3.3, 2.7, 2.1, 1.4, 0.8], (x, y) => (y % 2 ? slate : slateLt));   // the cone, course on course
    g.set(3, 8, 3, white);                                                              // the pinnacle
    front(g, 3, 4, white); front(g, 3, 5, white);                                       // the sign on the roof
    g.box([3, 3], [0, 1], [6, 6], wood);                                                // the door
    pairFront(g, 1, 1, INK);                                                            // two small windows
    return g.entry({ id: 'cand-p14-trullo', name: 'Trullo', story: 'Stone on stone with nothing between, and it has stood five hundred years.' });
  })(),

  // a granary raised on four stone stilts, flat stones on top to stop the
  // mice, slatted wooden walls, a roof of terracotta tiles in rows, a stone
  // finial at each end of the ridge
  (() => {
    const g = grid(7, 9, 5);
    quad(g, 1, 0, 1, stoneDk); quad(g, 1, 1, 1, stone);                                  // the stilts
    g.box([0, 6], [2, 2], [0, 4], stoneLt);                                             // the mouse stones
    g.box([1, 5], [3, 5], [0, 4], (x, y, z) => ((x + z) % 2 ? wood : woodLt));          // slatted walls
    g.box([3, 3], [3, 4], [4, 4], woodDk);                                              // the door
    g.box([0, 6], [6, 6], [0, 4], 1).box([0, 6], [7, 7], [1, 3], 1).box([0, 6], [8, 8], [2, 2], 1);
    tint(g, (x, y) => y >= 6, (x) => (x % 2 ? terra : terraDk));                         // tiles in rows
    pair(g, 0, 8, 2, stoneLt);                                                          // the finials
    return g.entry({ id: 'cand-p14-granary', name: 'Raised Granary', story: 'Up on its stone stilts, the grain stays dry and the mice stay hungry.' });
  })(),

  // a windcatcher: a square adobe house with a turquoise door, and a tower
  // on its roof open on all four sides to catch the wind from anywhere
  (() => {
    const g = grid(7, 10, 7);
    g.box([0, 6], [0, 3], [0, 6], adobe);
    tint(g, (x, y) => y === 0, adobeDk);
    quad(g, 0, 4, 0, adobe);                                                            // corner merlons
    g.box([2, 4], [4, 8], [2, 4], adobe);                                               // the tower
    for (const y of [6, 7]) g.set(3, y, 4, INK).set(3, y, 2, INK).set(2, y, 3, INK).set(4, y, 3, INK);   // open on every side
    tint(g, (x, y) => y === 8, adobeDk);
    g.box([1, 5], [9, 9], [1, 5], adobeLt);                                             // the cap
    g.box([3, 3], [0, 1], [6, 6], turq);                                                // the door
    pairFront(g, 1, 2, INK);                                                            // windows
    return g.entry({ id: 'cand-p14-windcatcher', name: 'Windcatcher', story: 'It catches the wind on the roof and sends it down to sleep in the cellar.' });
  })(),

  // rice terraces climbing a hill in four steps, each one a grassy bund and
  // a flooded paddy in rows of rice and water, a little thatched hut on top
  (() => {
    const g = grid(9, 6, 9);
    for (let k = 0; k < 4; k++) {
      const zf = 8 - 2 * k;
      g.box([0, 8], [k, k], [0, zf], earth);
      g.box([0, 8], [k, k], [zf - 1, zf - 1], (x) => (x % 2 ? water : rice));           // the paddy
      g.box([0, 8], [k, k], [zf, zf], bund);                                            // the bund
      g.clear(0, k, zf).clear(8, k, zf);
    }
    g.box([3, 5], [4, 4], [0, 1], woodLt).set(4, 4, 1, INK);                           // the hut
    g.box([2, 6], [5, 5], [0, 1], straw);
    tint(g, (x, y) => y === 5 && (x === 2 || x === 6), strawDk);
    return g.entry({ id: 'cand-p14-terraces', name: 'Rice Terraces', story: 'A hill made into stairs, one handful of earth at a time.' });
  })(),

  // a cliff dwelling: houses of pale adobe built into an alcove under an
  // overhang of banded rock, a round tower in the middle, sage on top
  (() => {
    const g = grid(9, 8, 6);
    g.box([0, 8], [0, 7], [0, 5], (x, y) => (y % 2 ? rock : rockLt));
    g.box([1, 7], [1, 5], [2, 5], 0);                                                   // the alcove
    g.box([0, 8], [6, 6], [5, 5], 0).box([0, 8], [7, 7], [4, 5], 0);                    // the overhang, worn back
    g.box([1, 2], [1, 3], [2, 4], pale).box([6, 7], [1, 3], [2, 4], pale);               // two houses
    g.box([3, 5], [1, 4], [2, 3], adobe);                                               // the tower
    g.set(4, 3, 3, INK).set(4, 1, 3, INK);                                              // its window and door
    pair(g, 1, 1, 4, INK); pair(g, 1, 3, 4, woodDk);                                     // the houses' doors, beam ends
    tint(g, (x, y, z) => onSurface(g, x, y, z) && !g.get(x, y + 1, z) && y >= 6, sage);
    return g.entry({ id: 'cand-p14-cliff-dwelling', name: 'Cliff Dwelling', story: 'The cliff is the roof. It has never once leaked.' });
  })(),

  // a caravanserai: a square of adobe walls round a courtyard with a pool,
  // rooms opening onto the court, merlons along the top, and a tall gate
  // framed in turquoise tile
  (() => {
    const g = grid(9, 6, 9);
    g.box([0, 8], [0, 0], [0, 8], (x, y, z) => ((x + z) % 2 ? honeyLt : honey));       // the paving
    g.box([0, 8], [1, 2], [0, 8], adobe).box([1, 7], [1, 2], [1, 7], 0);                // the walls
    for (let k = 1; k <= 7; k += 2) g.set(k, 1, 0, INK).set(0, 1, k, INK).set(8, 1, k, INK);   // rooms round the court
    tint(g, (x, y, z) => y === 0 && (x === 0 || x === 8 || z === 0 || z === 8), adobeDk);
    for (let x = 0; x <= 8; x++) for (let z = 0; z <= 8; z++)
      if ((x === 0 || x === 8 || z === 0 || z === 8) && (x + z) % 2 === 0) g.set(x, 3, z, adobe);   // merlons
    quad(g, 0, 3, 0, adobeDk); quad(g, 0, 4, 0, adobeDk);                                // corner towers
    g.box([2, 6], [0, 5], [8, 8], (x, y) => (x === 2 || x === 6 || y === 5 ? turq
      : (x === 4 && y <= 3) || ((x === 3 || x === 5) && y <= 2) ? INK : adobeLt));     // the gate
    g.box([3, 5], [0, 0], [3, 5], water).set(4, 1, 4, foam);                            // the pool
    return g.entry({ id: 'cand-p14-caravanserai', name: 'Caravanserai', story: "One day's walk from the last one, one day's walk from the next." });
  })(),

  // a sunken cistern: rows of marble columns standing in still water, their
  // arches running in three arcades, the water lit in bands
  (() => {
    const g = grid(9, 6, 7);
    g.box([0, 8], [0, 0], [0, 6], (x, y, z) => (z % 2 ? water : waterDk));
    for (const z of [1, 3, 5]) {
      for (const x of [1, 3, 5, 7]) g.box([x, x], [1, 2], [z, z], marble);             // the columns
      g.box([0, 8], [3, 3], [z, z], (x) => (x % 2 ? stoneLt : honey));                // capitals and arches
      g.box([0, 8], [4, 4], [z, z], honeyDk);
    }
    for (const x of [0, 8]) for (const z of [1, 3, 5]) g.set(x, 3, z, honey);
    return g.entry({ id: 'cand-p14-cistern', name: 'Sunken Cistern', story: 'The city drank from it for a thousand years and never saw it.' });
  })(),
];
