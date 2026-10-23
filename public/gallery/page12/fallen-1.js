// Page 12 · IV The Star Keepers: when the Gloam pulled the stars down they
// fell into the earth, and some of them were found and kept. A wayside
// shrine with a star in its niche, a stone dove brooding a star like an egg,
// a tablet with a constellation carved on it so nobody would forget where
// they went, a hooded pilgrim carrying one home on a staff, and a stone basin
// holding a sliver of the fallen moon.
// Sky: the Old Stones mist cooled to slate (the Stones palette), so the
// warm stone holds its colour and star gold is the one bright thing; the
// moon is the only cool white, and the pilgrim's cloak is a faded red.
import { grid } from '../voxel.js';
import { INK, S, front, out, pair, pairFront, quad, tint, onSurface, sheet } from './kit.js';

const { stone, stoneLt, stoneDk, basalt, moss, mossDk, mossLt, earth, star, starHot, starDk, frost, ice, cream, glow } = S;

export default [
  // a wayside shrine on a plinth: a little stone house with a mossy roof, a
  // star kept in its niche, and two small guardian stones either side
  (() => {
    const g = grid(7, 8, 6);
    g.box([0, 6], [0, 0], [0, 5], stoneDk).box([1, 5], [1, 1], [1, 4], stone);
    g.box([2, 4], [2, 4], [1, 3], stone).box([2, 4], [2, 4], [4, 4], stoneLt);          // the house
    g.set(3, 3, 4, 0).set(3, 2, 4, 0).set(3, 3, 3, starHot).set(3, 2, 3, star);         // the niche and its star
    g.box([1, 5], [5, 5], [0, 5], moss).box([2, 4], [6, 6], [1, 4], mossDk).box([3, 3], [7, 7], [2, 3], moss);   // the roof
    tint(g, (x, y, z) => g.get(x, y, z) === moss && (Math.abs(x - 3) + z) % 3 === 0, mossLt);
    pair(g, 0, 1, 4, stone); pair(g, 0, 2, 4, stoneLt); pair(g, 0, 2, 3, stone);           // the guardians
    pair(g, 0, 3, 4, starDk);
    return g.entry({ id: 'cand-p12-star-shrine', name: 'Star Shrine', story: 'Leave a pebble. The star does not mind the company.' });
  })(),

  // a stone dove brooding on a nest of twigs, wings folded over a star
  // where its egg should be, the gold showing at its breast
  (() => {
    const g = grid(7, 5, 7);
    g.cylinder('y', [3, 3], 3.3, [0, 1], earth).cylinder('y', [3, 3], 2.2, [1, 1], 0);   // the nest
    tint(g, (x, y, z) => y === 1, 0x6b4a3a);
    g.cylinder('y', [3, 3], 2.2, [1, 1], 0x6b4a3a);
    g.ellipsoid([3, 2.4, 2.6], [2.1, 1.5, 2.4], stoneLt);                               // the body
    pair(g, 1, 2, 2, stone); pair(g, 1, 2, 3, stone); pair(g, 1, 3, 2, stone);           // folded wings
    g.ellipsoid([3, 3.8, 4.4], [1.2, 1.2, 1.1], stoneLt);                               // the head
    pairFront(g, 2, 4, INK); out(g, 3, 3, starDk);                                       // eyes, beak
    g.box([2, 4], [1, 2], [5, 5], star).set(3, 1, 6, starHot);                          // the star under its breast
    g.set(3, 3, 0, stone).set(3, 2, 0, stone);                                          // tail
    return g.entry({ id: 'cand-p12-star-dove', name: 'Brooding Dove', story: 'It found a star in the grass and sat on it, just in case.' });
  })(),

  // a round tablet on a pedestal with a constellation carved into it, the
  // stars in gold and the lines between them cut dark, moss round its rim
  (() => {
    const g = grid(9, 10, 3);
    g.box([2, 6], [0, 0], [0, 2], stoneDk).box([3, 5], [1, 1], [0, 2], stone);         // the pedestal
    g.cylinder('z', [4, 5.5], 4.3, [0, 1], stone);
    g.cylinder('z', [4, 5.5], 3.3, [1, 1], 0x5d6680);                                    // a disc of night-sky slate
    tint(g, (x, y, z) => y >= 8 && Math.hypot(x - 4, y - 5.5) > 3.3, moss);
    for (const [x, y] of [[2, 4], [3, 5], [4, 5], [5, 6], [6, 7], [5, 4], [5, 3], [2, 6], [2, 5], [6, 2], [4, 4]]) g.set(x, y, 1, stoneLt);   // the lines
    for (const [x, y] of [[1, 3], [4, 6], [7, 8], [6, 3], [2, 7]]) g.set(x, y, 2, star);                      // the stars, standing proud
    g.set(4, 6, 2, starHot).set(1, 3, 1, star).set(7, 8, 1, star);
    return g.entry({ id: 'cand-p12-star-tablet', name: 'Star Tablet', story: 'Carved so that nobody would forget where they went.' });
  })(),

  // a hooded pilgrim walking toward you, a faded red cloak, a dark face with
  // two pale glowing eyes, carrying a star home on the end of a staff
  (() => {
    const g = grid(7, 10, 5);
    const cloak = 0xb8574a, cloakDk = 0x8f3f3a, hood = 0x3a3442;
    g.box([1, 5], [0, 0], [0, 4], stoneDk);
    for (let y = 1; y <= 6; y++) { const w = y <= 2 ? 2 : y <= 4 ? 1.6 : 1.2; g.cylinder('y', [3, 2], w, [y, y], y <= 1 ? cloakDk : cloak); }
    g.ellipsoid([3, 7, 2.2], [1.3, 1.3, 1.3], cloak).set(3, 8, 2, cloak).set(3, 8, 1, cloak).set(3, 9, 1, cloak);   // the hood, its point
    g.set(3, 7, 3, hood).set(2, 7, 3, hood).set(4, 7, 3, hood).set(3, 6, 3, hood);
    g.set(2, 7, 3, frost).set(4, 7, 3, frost);                                          // eyes
    tint(g, (x, y, z) => g.get(x, y, z) === cloak && y === 4 && z >= 3, starDk);        // a gold band
    g.box([6, 6], [1, 7], [3, 3], earth).set(5, 4, 3, cloak);                           // the staff, and the hand on it
    g.set(6, 8, 3, star).set(6, 9, 3, starHot).set(5, 8, 3, star).set(6, 8, 4, star).set(6, 8, 2, star);   // the star on top
    g.set(0, 0, 2, stoneDk);
    return g.entry({ id: 'cand-p12-star-pilgrim', name: 'Star Pilgrim', story: 'One star at a time. It is a long way back up.' });
  })(),

  // a stone basin on three feet, holding a sliver of the fallen moon, cool
  // and white and standing on its points, the water round it lit pale
  (() => {
    const g = grid(8, 8, 6);
    g.cylinder('y', [3.5, 2.5], 3.6, [1, 2], stone).cylinder('y', [3.5, 2.5], 2.6, [2, 2], ice);   // the basin and its water
    g.cylinder('y', [3.5, 2.5], 2.4, [0, 0], stoneDk);
    tint(g, (x, y, z) => y === 1 && onSurface(g, x, y, z), stoneDk);
    sheet(g, [
      '.mm.....',
      '..mm....',
      '...mm...',
      '...mm...',
      '..mm....',
      '.mm.....',
    ], [2, 3], { m: frost }, 1, 2);                                                     // the crescent moon
    g.set(2, 7, 3, cream).set(2, 7, 2, cream);
    g.set(0, 1, 2, moss).set(7, 1, 3, moss).set(3, 2, 5, mossLt);
    return g.entry({ id: 'cand-p12-moon-basin', name: 'Moon Basin', story: 'A sliver of the moon fell here. The water keeps it cool.' });
  })(),
];
