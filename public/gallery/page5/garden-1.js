// Page 5 · Garden & Small Creatures: bonsai-grade plants and a mossy stone.
// The bonsai rules (see home-1.js): one strong base, 2-3 masses at
// different heights, a trunk with character, two values of green.
import { grid } from '../voxel.js';
import { tint, onSurface } from './kit.js';

const stand = 0x5a3b30, potCream = 0xeee3cf, potBlue = 0x3f5f9f, soil = 0x6b4a3a, trunk = 0x8a5a3c, padDark = 0x3f9a6b, padLight = 0x6fbf6e,
  slate = 0x5d6670, mapleRed = 0xd9483b, mapleOrange = 0xf08a3c, mapleGold = 0xf6c14a,
  terra = 0xc8704b, terraDark = 0xa85a3c, lemonLeaf = 0x3f8a5b, lemon = 0xf6d34a,
  trapGreen = 0x6fbf4a, trapRed = 0xe0565b, tooth = 0xd8f08a, moss = 0x6fae5a,
  bark = 0x7a5236, barkDark = 0x5e3f2a, ring = 0xe2c290, ringDark = 0xb98a5a,
  shroomCap = 0xd98a4a, shroomStem = 0xf3e6cc, bracket = 0xf0b45a,
  wisLeaf = 0x7fbf6a, wisLeafDark = 0x5a9f55, lilac = 0xc9a6e8, purple = 0x8f6ad1, ground = 0x8a6a4a,
  stone = 0x9aa3ad, stoneDark = 0x7d8794, mossTop = 0x8fcf6a, sapling = 0x6fbf5a;

export default [
  // a cascade bonsai on a little stand: the trunk climbs, then spills over
  // the rim of its indigo pot and falls past it to a pad below its base
  (() => {
    const g = grid(9, 9, 5);
    for (const x of [0, 4]) for (const z of [0, 4]) g.box([x, x], [0, 1], [z, z], stand);   // four legs
    g.box([0, 4], [2, 2], [0, 4], stand);
    g.box([0, 4], [3, 4], [1, 3], potBlue).box([1, 3], [4, 4], [2, 2], soil);
    for (const [x, y] of [[2, 5], [2, 6], [3, 6], [4, 6], [5, 6], [5, 5], [6, 5], [6, 4], [6, 3], [7, 3]]) g.set(x, y, 2, trunk);
    g.ellipsoid([1.7, 7.5, 2], [2.1, 0.9, 1.9], padLight);                     // the apex pad over the pot
    g.ellipsoid([5.2, 7.0, 2], [1.5, 0.6, 1.4], padDark);                       // a small pad on the bend
    g.ellipsoid([7.2, 1.5, 2], [1.7, 1.0, 1.9], padDark);                       // the cascade pad, below the pot
    tint(g, (x, y) => y === 2 && x >= 6, padLight);
    g.set(7, 3, 2, trunk);
    return g.entry({ id: 'cand-p5-cascade-bonsai', name: 'Cascade Bonsai' });
  })(),

  // an autumn maple bonsai: a flared trunk forking in two, a red pad low on
  // the left, an orange pad high on the right, a gold crown between
  (() => {
    const g = grid(8, 8, 6);
    g.box([0, 7], [0, 1], [1, 4], slate).box([1, 6], [1, 1], [2, 3], soil);
    for (const [x, z] of [[0, 1], [7, 1], [0, 4], [7, 4]]) g.clear(x, 1, z);
    g.box([3, 4], [2, 2], [2, 3], trunk);
    for (const [x, y, z] of [[3, 3, 2], [3, 4, 2], [2, 4, 2], [2, 5, 2], [4, 3, 3], [4, 4, 3], [5, 4, 3], [5, 5, 3]]) g.set(x, y, z, trunk);
    g.ellipsoid([1.7, 5.7, 2.4], [2.0, 0.9, 1.9], mapleRed);
    g.ellipsoid([5.5, 6.4, 3.0], [2.0, 0.9, 1.9], mapleOrange);
    g.ellipsoid([2.8, 7.2, 2.0], [1.6, 0.6, 1.5], mapleGold);
    g.set(6, 2, 2, mapleRed);                                                   // one fallen leaf on the soil
    return g.entry({ id: 'cand-p5-maple-bonsai', name: 'Maple Bonsai' });
  })(),

  // a potted lemon tree: a terracotta pot with a rolled rim, a short trunk,
  // a round dark canopy hung with lemons
  (() => {
    const g = grid(7, 9, 7);
    g.cylinder('y', [3, 3], 1.5, [0, 0], terra).cylinder('y', [3, 3], 2.3, [1, 1], terra)
      .box([1, 5], [2, 2], [1, 5], terraDark).cylinder('y', [3, 3], 1.4, [2, 2], soil);
    g.box([3, 3], [3, 4], [3, 3], trunk);
    g.ellipsoid([3, 6.2, 3], [2.9, 2.1, 2.9], lemonLeaf);
    const lemons = [[1, 5, 5], [5, 6, 5], [3, 7, 5], [5, 5, 1], [1, 6, 1], [3, 8, 3], [6, 6, 3], [6, 5, 2], [0, 6, 3], [0, 5, 4]];
    for (const [x, y, z] of lemons) if (g.get(x, y, z)) g.set(x, y, z, lemon);
    g.set(4, 4, 5, lemon).set(4, 4, 4, lemonLeaf).set(2, 4, 1, lemon).set(2, 4, 2, lemonLeaf);  // two hanging below
    return g.entry({ id: 'cand-p5-lemon-tree', name: 'Lemon Tree' });
  })(),

  // a Venus flytrap in a mossy pot: one big trap gaping at you, red inside
  // with pale teeth on its lips, and a smaller one snapped shut at the side
  (() => {
    const g = grid(7, 8, 7);
    g.cylinder('y', [3, 2], 2.0, [0, 1], terra).cylinder('y', [3, 2], 2.0, [2, 2], moss);
    g.box([2, 4], [3, 3], [2, 5], trapGreen).box([2, 4], [4, 4], [2, 5], trapRed);   // the lower jaw
    g.box([2, 4], [6, 6], [2, 5], trapRed).box([2, 4], [7, 7], [2, 5], trapGreen);   // the upper jaw
    g.box([2, 4], [4, 6], [1, 1], trapGreen).box([2, 4], [5, 5], [2, 2], trapGreen);  // the hinge at the back
    for (const x of [2, 4]) g.set(x, 4, 6, tooth).set(x, 6, 6, tooth);               // teeth at both corners
    g.set(3, 5, 6, 0);
    g.box([5, 6], [3, 4], [0, 1], trapGreen).set(6, 4, 2, tooth).set(6, 3, 2, tooth).set(5, 2, 1, trapGreen);   // the shut one
    g.set(1, 3, 2, trapGreen).set(0, 3, 2, trapGreen).set(0, 4, 2, trapRed);         // a little leaf, just opening
    return g.entry({ id: 'cand-p5-flytrap', name: 'Venus Flytrap' });
  })(),

  // mushrooms on a log: rings on the cut ends, moss along the top, a tall and
  // a short toadstool, orange shelf fungi stepping up the front
  (() => {
    const g = grid(9, 7, 6);
    g.cylinder('x', [2, 2], 2.2, [0, 8], bark);
    tint(g, (x, y, z) => x === 0 || x === 8, (x, y, z) => {
      const d = Math.hypot(y - 2, z - 2);
      return d < 0.5 ? ringDark : d < 1.5 ? ring : d < 2 ? ringDark : barkDark;
    });
    tint(g, (x, y, z) => y === 4 && x >= 1 && x <= 4, moss);
    g.set(2, 5, 2, moss).set(3, 5, 2, moss);
    g.set(6, 5, 2, shroomStem).box([5, 7], [6, 6], [1, 3], shroomCap);
    g.set(4, 5, 3, shroomStem).set(4, 6, 3, shroomCap);
    g.box([2, 3], [2, 2], [5, 5], bracket).box([5, 7], [2, 2], [5, 5], bracket).set(6, 1, 5, bracket);
    return g.entry({ id: 'cand-p5-mushroom-log', name: 'Mushroom Log' });
  })(),

  // a wisteria bonsai: a twisting trunk in a cream tray, two leafy pads at
  // different heights, lilac flower trails hanging from under both
  (() => {
    const g = grid(9, 9, 5);
    g.box([1, 7], [0, 1], [1, 3], potCream).box([2, 6], [1, 1], [2, 2], soil);
    for (const x of [2, 6]) g.clear(x, 0, 1).clear(x, 0, 3).clear(x + 0, 0, 2);
    for (const [x, y] of [[4, 2], [4, 3], [4, 4], [3, 4], [3, 5], [5, 4], [5, 5], [6, 5], [6, 6]]) g.set(x, y, 2, trunk);
    g.ellipsoid([2.2, 6.3, 2], [2.2, 0.7, 1.7], wisLeaf);
    g.ellipsoid([6.3, 7.4, 2], [2.2, 0.8, 1.7], wisLeaf);
    tint(g, (x, y, z) => g.get(x, y + 1, z) === 0 && ((x < 4 && y === 6) || (x > 4 && y === 7)), wisLeafDark);   // darker under-layer
    tint(g, (x, y, z) => (x < 4 && y === 6) || (x > 4 && y === 7), (x, y, z) => (onSurface(g, x, y, z) ? wisLeaf : wisLeafDark));
    const hang = (yPad, xs) => {
      for (const x of xs) for (let z = 0; z < 5; z++) {
        if (!g.get(x, yPad, z) || g.get(x, yPad - 1, z) || (x + z) % 2) continue;
        const len = (x + z * 2) % 3 === 0 ? 2 : 3;
        for (let k = 1; k <= len; k++) g.set(x, yPad - k, z, k === len ? purple : lilac);
      }
    };
    hang(6, [0, 1, 2, 3, 4]); hang(7, [4, 5, 6, 7, 8]);
    return g.entry({ id: 'cand-p5-wisteria', name: 'Wisteria Bonsai' });
  })(),

  // a mossy boulder: a lumpy stone wearing a green cap that drips down one
  // side, a sapling growing from the top and a pebble at its foot
  (() => {
    const g = grid(8, 7, 6);
    g.ellipsoid([3.6, 2.0, 2.6], [3.4, 2.5, 2.6], stone).ellipsoid([5.8, 1.0, 4.2], [1.4, 1.2, 1.2], stone);
    g.clear(0, 0, 0).clear(7, 0, 0).clear(1, 4, 5);
    tint(g, (x, y) => y <= 1, stoneDark);
    tint(g, (x, y, z) => y >= 4 || (y >= 2 && x <= 1 && z <= 3), moss);
    tint(g, (x, y, z) => y >= 4 && !g.get(x, y + 1, z), mossTop);
    g.set(4, 5, 3, trunk).set(4, 6, 3, sapling).set(3, 6, 3, sapling).set(5, 6, 3, sapling);   // a sapling's first leaves
    return g.entry({ id: 'cand-p5-mossy-boulder', name: 'Mossy Boulder' });
  })(),
];
