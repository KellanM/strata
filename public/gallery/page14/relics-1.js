// Page 14 · III Sky Relics: the things people made to keep the sky - to
// read it, count it, carry it - before the Gloam pulled the stars down, and
// in case it ever did. After the Eye Stone, Star Tablet and Moon Basin
// (Kellan's picks from page 12): an astrolabe, a calendar stone, a bronze
// sky disc, three moon stones, a sundial big enough to climb, an orrery, a
// sun chariot and a row of horizon towers.
// Most are face-on icons of one material - brass, stone, verdigris, red
// sandstone - with gold or moon-white carved into them in regular rings,
// rays and rows. The brass and gold are lit from the upper left on a
// dithered five-step ramp, like the Heart amulet.
// Sky: Night (the Skywatchers' chapter), so the gold and the moon-white glow.
import { grid } from '../voxel.js';
import { INK, S, pair, pairZ, quad, tint, onSurface, sheet, ramp } from './kit.js';

const { stone, stoneLt, stoneDk, basalt, moss, mossDk, frost, star, starHot, starDk } = S;
const GOLD = [0x8f6326, 0xb98535, 0xdcab48, 0xf0cc6a, 0xfae6a4];
const navy = 0x2f4a7a, gold = 0xe9b949, ochre = 0xd9a441, red = 0xd2453b,
  verd = 0x4f9a8a, verdDk = 0x3f7f72, bronze = 0xb07a3a, bronzeDk = 0x7f5428,
  sand = 0xc0604a, sandDk = 0x9a4838, marble = 0xf3ead8, wood = 0x8a5a3c, woodDk = 0x6b4a3a,
  blue = 0x5b8fd6, rust = 0xc8704b, rock = 0x8f877c, rockLt = 0xa8a094;
const disc = (x, y, cx = 4, cy = 4) => Math.hypot(x - cx, y - cy);

export default [
  // an astrolabe: a brass disc lit from the upper left, a plate of night
  // blue inside it, a gold ring for the sun's road, a rule across it, four
  // star pointers, a pin at the centre and a ring on top to hang it by
  (() => {
    const g = grid(9, 10, 2);
    for (let x = 0; x <= 8; x++) for (let y = 0; y <= 8; y++) {
      const d = disc(x, y);
      if (d > 4.3) continue;
      const lit = ((8 - x) + y) / 16;
      g.set(x, y, 0, ramp(GOLD, lit, x, y, 1));
      if (d >= 3.3) g.set(x, y, 1, GOLD[Math.round(1 + lit * 3)]);                       // the rim, lit in steps
      else if (d >= 1.8 && d < 2.5) g.set(x, y, 1, gold);                               // the sun's road
      else g.set(x, y, 1, navy);
    }
    for (const [x, y] of [[2, 2], [6, 2], [2, 6], [6, 6]]) g.set(x, y, 1, starHot);   // star pointers
    g.set(4, 4, 1, starHot);
    for (const x of [3, 4, 5]) for (const z of [0, 1]) g.set(x, 9, z, ramp(GOLD, ((8 - x) + 9) / 16, x, 9, 1 - z));   // the ring on top
    return g.entry({ id: 'cand-p14-astrolabe', name: 'Astrolabe', story: 'Hold it up to the night, and it tells you where you are and what hour it is.' });
  })(),

  // a calendar stone: a round slab carved in rings - a band of day-marks,
  // eight gold rays, and in the middle a face with its tongue out
  (() => {
    const g = grid(9, 9, 2);
    for (let x = 0; x <= 8; x++) for (let y = 0; y <= 8; y++) {
      const d = disc(x, y);
      if (d > 4.3) continue;
      g.set(x, y, 0, stoneDk);
      if (d >= 3.3) g.set(x, y, 1, x === 4 || y === 4 ? stoneLt : stoneDk);                // the rim, four day-marks
      else if (d >= 2.2) g.set(x, y, 1, x === 4 || y === 4 || Math.abs(x - 4) === Math.abs(y - 4) ? ochre : stone);   // rays
      else g.set(x, y, 1, stoneLt);                                                     // the face
    }
    g.set(3, 5, 1, INK).set(5, 5, 1, INK).set(4, 3, 1, red).set(4, 2, 1, red);
    return g.entry({ id: 'cand-p14-calendar-stone', name: 'Calendar Stone', story: 'Every day of the year is carved on it, and it is still counting.' });
  })(),

  // a sky disc of green bronze: a gold sun, a gold crescent moon, a cluster
  // of stars, the two horizons on its edges and a boat along the bottom
  (() => {
    const g = grid(9, 9, 2);
    const art = [
      '..ddddd..',
      '.dvgvgvd.',
      'dvvvgvvvd',
      'gvssvmvvg',
      'gvssvvmvg',
      'gvvvvmvvg',
      'dvgvvvgvd',
      '.dvgggvd.',
      '..ddddd..',
    ];
    sheet(g, art, [1, 1], { d: verdDk, v: verd, g: gold, s: star, m: gold });
    sheet(g, art.map((r) => r.replace(/[^.]/g, 'd')), [0, 0], { d: verdDk });
    return g.entry({ id: 'cand-p14-sky-disc', name: 'Sky Disc', story: 'Someone hammered the sky onto bronze, in case it ever went missing.' });
  })(),

  // three moon stones on a plinth, moss on their heads: a crescent carved on
  // the left, the full moon on the taller middle stone, and the crescent
  // turned the other way on the right
  (() => {
    const g = grid(11, 8, 3);
    g.box([0, 10], [0, 0], [0, 2], stoneDk);
    for (const [x0, top] of [[0, 5], [4, 6], [8, 5]]) {
      g.box([x0, x0 + 2], [1, top], [0, 1], basalt);
      g.box([x0, x0 + 2], [top + 1, top + 1], [0, 1], moss).set(x0, top + 1, 0, 0).set(x0 + 2, top + 1, 0, 0);   // moss caps
    }
    for (const [x, y] of [[1, 4], [0, 3], [1, 2]]) pair(g, x, y, 1, frost);           // the crescents, mirrored
    for (const [x, y] of [[5, 3], [4, 4], [5, 4], [6, 4], [5, 5]]) g.set(x, y, 1, frost);   // the full moon
    g.set(5, 4, 1, starHot);
    return g.entry({ id: 'cand-p14-moon-stones', name: 'Moon Stones', story: 'It waxes on the left stone and wanes on the right, and the middle one waits.' });
  })(),

  // a sky stair: a sundial of red sandstone big enough to climb, a stair up
  // its gnomon edged in white, and a curved quadrant either side marked
  // off in white like a ruler
  (() => {
    const g = grid(9, 9, 7);
    g.box([0, 8], [0, 0], [0, 6], sandDk);
    for (let z = 0; z <= 6; z++) {
      const top = 8 - z;
      g.box([3, 5], [1, top], [z, z], sand);
      pair(g, 3, top, z, marble);                                                       // the stair's white edges
    }
    const h = [4, 2, 1];
    for (let x = 0; x <= 2; x++) for (let z = 2; z <= 5; z++) {
      g.box([x, x], [1, h[x]], [z, z], sand); g.box([8 - x, 8 - x], [1, h[x]], [z, z], sand);
      if (z % 2 === 0) pair(g, x, h[x], z, marble);                                      // the marks
    }
    return g.entry({ id: 'cand-p14-sky-stair', name: 'Sky Stair', story: 'A sundial big enough to climb, and true to the second.' });
  })(),

  // an orrery: a gold sun on a brass post over a wooden base, a brass ring
  // for the planets' road, four arms out to it, and four small worlds riding it
  (() => {
    const g = grid(7, 8, 7);
    g.box([2, 4], [0, 0], [2, 4], woodDk).box([3, 3], [1, 3], [3, 3], starDk);
    g.cylinder('y', [3, 3], 3.2, [4, 4], starDk).cylinder('y', [3, 3], 2.3, [4, 4], 0);   // the ring
    g.box([1, 5], [4, 4], [3, 3], starDk).box([3, 3], [4, 4], [1, 5], starDk);           // its arms
    for (let x = 0; x <= 6; x++) for (let y = 4; y <= 7; y++) for (let z = 0; z <= 6; z++)
      if (Math.hypot(x - 3, y - 5.6, z - 3) <= 1.7) g.set(x, y, z, ramp(GOLD, ((4.6 - x) + (y - 4) + (z - 1.4)) / 6.4, x + z, y));   // the sun
    pair(g, 0, 5, 3, blue); pairZ(g, 3, 5, 0, rust);                                    // the worlds
    return g.entry({ id: 'cand-p14-orrery', name: 'Orrery', story: 'The whole sky, small enough to wind by hand.' });
  })(),

  // a sun chariot: a bronze horse on wheels drawing the sun, a disc gold on
  // the side that faces you, in rings, and dark bronze on the other
  (() => {
    const g = grid(10, 9, 3);
    g.box([0, 9], [1, 1], [1, 1], bronzeDk);                                            // the axle-tree
    for (const x of [1, 6]) for (const z of [0, 2]) g.box([x, x + 1], [0, 1], [z, z], woodDk);   // wheels
    g.set(2, 2, 1, bronzeDk);
    for (let x = 0; x <= 4; x++) for (let y = 3; y <= 7; y++) {
      const d = Math.hypot(x - 2, y - 5);
      if (d > 2.4) continue;
      g.set(x, y, 1, bronzeDk);                                                         // the night side
      g.set(x, y, 2, d < 0.9 ? starHot : d < 1.6 ? gold : d < 2.1 ? starHot : gold);        // the day side, in rings
    }
    sheet(g, [
      '...e.',
      '...th',
      '...hh',
      'bbbn.',
      'bbb..',
      'l.l..',
      'l.l..',
    ], [1, 1], { b: bronze, n: bronze, h: bronze, e: bronze, t: INK, l: bronze }, 5, 2);   // the horse
    return g.entry({ id: 'cand-p14-sun-chariot', name: 'Sun Chariot', story: 'One side gold for the day, one side dark for the night.' });
  })(),

  // horizon towers: six small towers along a ridge, and the sun coming up
  // in the gap between the middle two, as it does on one morning a year
  (() => {
    const g = grid(11, 8, 3);
    const h = [1, 1, 2, 2, 3, 3, 3, 2, 2, 1, 1];
    for (let x = 0; x <= 10; x++) g.box([x, x], [0, h[x] - 1], [0, 2], (xx, y) => (y % 2 ? rockLt : rock));   // the ridge
    for (let x = 2; x <= 8; x++) for (let y = 3; y <= 7; y++) if (Math.hypot(x - 5, y - 4.4) <= 2.6) g.set(x, y, 0, Math.hypot(x - 5, y - 4.4) <= 1.4 ? starHot : star);   // the sun
    for (const x of [0, 2, 4, 6, 8, 10]) {
      g.box([x, x], [h[x], h[x] + 1], [1, 2], stone);                                   // a tower
      g.set(x, h[x] + 2, 1, stoneLt).set(x, h[x] + 2, 2, stoneLt);                      // its cap
    }
    return g.entry({ id: 'cand-p14-horizon-towers', name: 'Horizon Towers', story: 'Count the towers the sun rises between, and you will know the day.' });
  })(),
];
