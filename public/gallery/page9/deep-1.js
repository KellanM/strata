// Page 9 · ✦VII The Deep: a landmark alternative to the Black Smoker.
// A drowned shrine on the sea floor: pale stone under a dome, cyan runes
// that light themselves, a glowing doorway with a light kept inside, coral
// grown up its sides. The sky is navy, so stone, glow and coral are all bright.
import { grid } from '../voxel.js';
import { pair, quad, tint, onSurface } from './kit.js';

const sand = 0xd9c8a8, rock = 0x8f8a9a, stone = 0xc7beb0, stoneDk = 0xa59c90, glow = 0x7ff3e6, glowLt = 0xc8fff6,
  coral = 0xf08a9a, coralOr = 0xf2803d, anem = 0xb89ae0;

export default [
  // the drowned shrine: a square hall under a dome on a sand floor, runes
  // glowing in bands round its walls, a lit doorway, an orb on the dome, pink
  // coral fans on both sides and orange tube sponges at the corners
  (() => {
    const g = grid(9, 7, 7);
    g.box([0, 8], [0, 0], [0, 6], (x, y, z) => ((x * 2 + z) % 5 === 0 ? rock : sand));
    g.ellipsoid([4, 3.4, 3], [2.5, 2.5, 2.5], stone);
    g.box([2, 6], [1, 3], [1, 5], stone);
    tint(g, (x, y, z) => y === 3 && onSurface(g, x, y, z) && (x + z) % 2 === 0, glow);
    tint(g, (x, y, z) => (y === 1 || y === 3) && (x === 2 || x === 6) && (z === 1 || z === 5), stoneDk);
    g.box([3, 5], [1, 2], [2, 4], 0).box([4, 4], [1, 2], [5, 5], 0);             // a hidden hall behind the doorway
    g.set(4, 1, 3, glowLt).set(4, 2, 3, glow);                                    // and the light it keeps
    g.set(4, 6, 3, glow);
    for (const [z, y] of [[2, 1], [2, 2], [3, 2], [3, 3], [4, 1]]) pair(g, 1, y, z, coral);
    quad(g, 0, 1, 0, coralOr); quad(g, 0, 2, 0, coralOr);
    g.set(3, 5, 2, anem).set(5, 5, 2, anem);
    return { ...g.entry({ id: 'cand-p9-drowned-shrine', name: 'Drowned Shrine' }), fraction: 1, seed: 14, story: 'Nobody built it down here. It sank, and kept its light on.' };
  })(),
];
