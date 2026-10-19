// Page 9 · ✦III Moss Garden: a guardian alternative to the Frog shrine.
// The minogame, the old tortoise of the legend that has lived so long moss
// trails behind it like a cloak; a tiny garden grows on its shell.
// The sky is pale mint, so the shell is a deep olive and the moss is dark.
import { grid } from '../voxel.js';
import { INK, pair, pairFront, tint, onSurface } from './kit.js';

const shell = 0x8a6a3a, shellDk = 0x6b4f2a, moss = 0x4f8f45, mossLt = 0x7cb85a, skin = 0x8f9a6a, skinDk = 0x6f7a52,
  pine = 0x2f6f4a, light = 0xffd58a, stone = 0x9aa3ad, cream = 0xf3eadc;

export default [
  // the moss tortoise: a domed shell in olive scutes with moss on its crown,
  // a little pine and two glowing stone lanterns on top, a wise old face,
  // and a long train of moss trailing behind
  (() => {
    const g = grid(9, 6, 9);
    g.ellipsoid([4, 1.4, 4], [4.3, 3.3, 3.6], shell);
    g.box([0, 8], [0, 0], [0, 8], 0);
    tint(g, (x, y, z) => y === 1, shellDk);
    tint(g, (x, y, z) => y >= 2 && onSurface(g, x, y, z) && (Math.abs(x - 4) + z) % 3 === 0, shellDk);
    tint(g, (x, y, z) => y >= 4, (x, y, z) => ((x + z) % 2 ? moss : mossLt));
    for (const [x, z] of [[1, 2], [6, 2], [1, 5], [6, 5]]) g.box([x, x + 1], [0, 1], [z, z + 1], skin);   // legs
    g.box([3, 5], [1, 2], [8, 8], skin).box([3, 5], [1, 1], [7, 7], skin).set(4, 3, 8, skinDk);
    pairFront(g, 3, 2, INK); pair(g, 3, 3, 8, cream);                            // eyes and white brows
    g.box([3, 5], [0, 2], [0, 0], (x, y) => ((x + y) % 2 ? moss : mossLt));      // the moss train
    g.set(4, 5, 4, pine); pair(g, 2, 5, 4, light);
    return { ...g.entry({ id: 'cand-p9-moss-tortoise', name: 'Moss Tortoise' }), fraction: 0.7, seed: 3, story: 'So old the moss on its back has its own garden now.' };
  })(),
];
