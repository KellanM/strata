// Page 5 · Sky & Night: old stones and night things - a geode split open,
// a dolmen, an inukshuk, a weather vane, a dreamcatcher, an armillary sphere.
import { grid } from '../voxel.js';
import { quad, tint, sheet } from './kit.js';

const crust = 0x8a7a6e, crustDark = 0x6f6258, agate = 0xe8e2f0, amethyst = 0x9b6ad8, amethystLight = 0xc9a6f0, core = 0xf6ecff,
  stoneA = 0x9aa3ad, stoneB = 0x7d8a99, stoneC = 0xc5cbd2, moss = 0x6fae5a, turf = 0x4f8f4a, runeGlow = 0x5ff0d0,
  snow = 0xf6f8ff, rockBase = 0x5d6670, roofRed = 0xb8434b, pole = 0x5d6670, gold = 0xe9b949, goldDark = 0xc9952f, comb = 0xe0565b,
  hoop = 0xc9955a, web = 0xf6efe4, bead = 0x4fd1c5, feather = 0xfbf8f2, featherTip = 0x8cc8e8,
  bronze = 0xb07a3a, ring = 0xe9b949, horizon = 0xf2a03d, earth = 0x5b8fd6, land = 0x5fae6e;

export default [
  // a geode split open toward you: a rough crust, a pale agate band, and a
  // cave of amethyst crystals pointing in to a bright heart
  (() => {
    const g = grid(7, 7, 5);
    g.ellipsoid([3, 3, 4.4], [3.3, 3.3, 4.2], crust);
    tint(g, (x, y, z) => (y <= 1 || x <= 1) && (x + y + z) % 2 === 0, crustDark);
    g.ellipsoid([3, 3, 4.4], [2.6, 2.6, 3.2], agate);
    g.ellipsoid([3, 3, 4.4], [2.0, 2.0, 2.5], amethyst);
    g.ellipsoid([3, 3, 4.4], [1.4, 1.4, 1.8], 0);
    tint(g, (x, y, z) => z === 4 && g.get(x, y, z) === amethyst && (x + y) % 2 === 0, amethystLight);
    g.set(3, 3, 2, core).set(3, 3, 3, amethystLight).set(3, 4, 3, amethystLight).set(2, 3, 3, amethystLight).set(4, 2, 3, amethystLight);
    // only the cut face shows agate and crystal: anything touching the outside is crust
    const outside = (x, y, z) => x < 0 || y < 0 || z < 0 || x > 6 || y > 6 || ((x - 3) / 3.3) ** 2 + ((y - 3) / 3.3) ** 2 + ((z - 4.4) / 4.2) ** 2 > 1;
    tint(g, (x, y, z) => z < 4 && [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, -1]].some(([a, b, c]) => outside(x + a, y + b, z + c)),
      (x, y, z) => ((y <= 1 || x <= 1) && (x + y + z) % 2 === 0 ? crustDark : crust));
    return g.entry({ id: 'cand-p5-geode', name: 'Geode' });
  })(),

  // a dolmen: two standing stones and a back slab under a heavy capstone,
  // moss on its top, on a patch of turf; a rune glows on one stone
  (() => {
    const g = grid(9, 6, 5);
    g.box([0, 8], [0, 0], [0, 4], turf);
    quad(g, 0, 0, 0, 0);
    g.box([1, 2], [1, 3], [1, 3], stoneA).box([6, 7], [1, 3], [1, 3], stoneB).box([3, 5], [1, 2], [1, 1], stoneC);
    g.box([0, 8], [4, 4], [0, 4], stoneA).box([1, 6], [5, 5], [1, 3], stoneA);
    quad(g, 0, 4, 0, 0);
    tint(g, (x, y, z) => y === 5 && x <= 4, moss);
    g.set(7, 2, 3, runeGlow).set(6, 2, 3, runeGlow).set(7, 1, 3, runeGlow);
    return g.entry({ id: 'cand-p5-dolmen', name: 'Dolmen' });
  })(),

  // an inukshuk on a dark rock: two legs, a hip stone, a body, outstretched
  // arms and a head, a little snow on the ledges
  (() => {
    const g = grid(7, 9, 4);
    g.box([0, 6], [0, 0], [0, 3], rockBase);
    quad(g, 0, 0, 0, 0);
    for (const x of [1, 4]) g.box([x, x + 1], [1, 2], [1, 2], stoneB);
    g.box([0, 6], [3, 3], [1, 2], stoneC);
    g.box([2, 4], [4, 4], [1, 2], stoneB);
    g.box([0, 6], [5, 5], [1, 2], stoneA);
    g.box([2, 4], [6, 7], [1, 2], stoneC).box([3, 3], [8, 8], [1, 2], stoneC);
    tint(g, (x, y, z) => (y === 5 || y === 3) && (x === 0 || x === 6), snow);
    tint(g, (x, y, z) => y === 8, snow);
    return g.entry({ id: 'cand-p5-inukshuk', name: 'Inukshuk' });
  })(),

  // a weather vane on a roof ridge: a gilded cockerel standing on a thick
  // arrow over the compass points, turning in the night wind
  (() => {
    const g = grid(7, 10, 5);
    g.box([1, 5], [0, 0], [1, 3], roofRed).box([1, 5], [1, 1], [2, 2], roofRed);
    g.box([3, 3], [2, 4], [2, 2], pole);
    g.set(2, 3, 2, pole).set(4, 3, 2, pole).set(3, 3, 1, pole).set(3, 3, 3, pole);      // the compass points
    g.set(1, 3, 2, gold).set(5, 3, 2, gold).set(3, 3, 0, gold).set(3, 3, 4, gold);
    g.box([0, 5], [5, 5], [2, 2], goldDark).set(6, 5, 2, goldDark).set(5, 4, 2, goldDark).set(5, 6, 2, goldDark)   // the arrow
      .set(0, 4, 2, goldDark).set(1, 4, 2, goldDark);
    const cock = ['....rr.', 'g...ggb', 'gg..gr.', 'ggggg..'];
    cock.forEach((row, k) => [...row].forEach((ch, x) => {
      const c = { g: gold, r: comb, b: 0xf08a3c }[ch];
      if (c) g.set(x, 9 - k, 2, c);
    }));
    return g.entry({ id: 'cand-p5-weather-vane', name: 'Weather Vane' });
  })(),

  // a dreamcatcher: a leather hoop with a woven star of web and a turquoise
  // bead at its heart, three feathers hanging below on beaded strings
  (() => {
    const g = grid(7, 10, 2);
    sheet(g, ['.#####.', '##...##', '#.....#', '#.....#', '#.....#', '##...##', '.#####.'], [0, 1], { '#': hoop }, 0, 3);
    sheet(g, ['...w...', '..www..', '.wwbww.', '..www..', '...w...'], [0, 0], { w: web, b: bead }, 0, 4);
    g.set(3, 6, 1, bead);
    for (const x of [1, 3, 5]) g.set(x, 2, 0, x === 3 ? bead : web);
    for (const x of [1, 5]) g.set(x, 1, 0, feather).set(x, 0, 0, featherTip);   // the two side feathers match
    g.set(3, 1, 0, feather).set(3, 0, 0, feather).set(3, 0, 1, featherTip).set(3, 1, 1, feather);
    return g.entry({ id: 'cand-p5-dreamcatcher', name: 'Dreamcatcher' });
  })(),

  // an armillary sphere: two crossed rings, brass and orange, caging a little
  // blue earth on its axis, on a bronze foot
  (() => {
    const g = grid(7, 8, 7);
    g.cylinder('y', [3, 3], 2.9, [0, 0], bronze);
    const circle = ['.#####.', '##...##', '#.....#', '#.....#', '#.....#', '##...##', '.#####.'];
    circle.forEach((row, k) => [...row].forEach((ch, i) => {
      if (ch !== '#') return;
      g.set(i, 7 - k, 3, ring);                                              // the meridian, facing you
      g.set(3, 7 - k, i, horizon);                                           // the colure, crossing it
    }));
    g.set(3, 1, 3, ring).set(3, 7, 3, ring);
    g.ellipsoid([3, 4, 3], [1.5, 1.5, 1.5], earth).set(3, 5, 4, land).set(4, 4, 4, land).set(4, 5, 3, land).set(2, 3, 3, land).set(2, 4, 2, land);
    g.set(3, 2, 3, ring).set(3, 6, 3, ring);                                 // the polar axis
    return g.entry({ id: 'cand-p5-armillary', name: 'Armillary Sphere' });
  })(),
];
