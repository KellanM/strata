// Page 12 · III Crystal Deeps: down in the caves, where no light came after
// the Gloam, the stone grew stars of its own - and the creatures that live
// there grew them too. The crystal type: a tortoise with a geode for a
// shell, a hedgehog with quartz for spines, a mole with crystal claws, a bat
// asleep upside down with crystal ears, and the eye stone that watches the
// cave mouth.
// Sky: deep violet dusk going to lavender (the Dusk palette), so the
// sandstone glows warm against it and the crystal violet is the accent:
// light lilac on the points, deep violet at the roots.
import { grid } from '../voxel.js';
import { INK, BLUSH, S, front, out, pair, pairAt, pairFront, quad, tint, onSurface } from './kit.js';

const { stone, stoneLt, stoneDk, basalt, earth, sand, sandDk, crystal, crystalLt, crystalDk, moss, mossLt, pink, glow } = S;

// a crystal point: a column from y0 to y1 at (x, z), dark at the root, light at the tip
const point = (g, x, z, y0, y1) => { for (let y = y0; y <= y1; y++) g.set(x, y, z, y === y1 ? crystalLt : y === y0 ? crystalDk : crystal); };

export default [
  // a tortoise whose shell is a geode: three clusters of violet points grown
  // up through it, a patient face with dark eyes, four stout feet
  (() => {
    const g = grid(9, 6, 8);
    g.ellipsoid([4, 1.6, 3.4], [4.1, 2.2, 3.5], sand);
    tint(g, (x, y, z) => y <= 1 && onSurface(g, x, y, z), sandDk);
    g.box([3, 5], [1, 3], [7, 7], stone).box([3, 5], [1, 2], [6, 6], stone);            // the head
    pair(g, 3, 2, 7, INK); g.set(4, 1, 7, stoneLt);
    quad(g, 1, 0, 1, stoneDk); quad(g, 1, 0, 2, stoneDk);
    point(g, 4, 3, 3, 5); point(g, 4, 2, 3, 5); point(g, 3, 3, 3, 4); point(g, 5, 3, 3, 4);   // the crown
    point(g, 2, 3, 3, 4); point(g, 6, 3, 3, 4);                                          // a cluster each side
    point(g, 3, 5, 3, 4); point(g, 5, 5, 3, 4);
    return g.entry({ id: 'cand-p12-geode-tortoise', name: 'Geode Tortoise', story: 'Break its shell open and you would find the night sky. Please do not.' });
  })(),

  // a hedgehog curled half up: a round body, quartz for spines from brow to
  // tail, a pale face with a black nose and two small eyes, tiny feet
  (() => {
    const g = grid(7, 5, 7);
    g.ellipsoid([3, 2.2, 3], [3.2, 2.4, 3.2], crystal);
    tint(g, (x, y, z) => onSurface(g, x, y, z) && (x + y + z) % 2 === 0, crystalLt);
    tint(g, (x, y, z) => y <= 1, crystalDk);
    g.ellipsoid([3, 2, 5], [2.0, 1.6, 1.5], sand);                                      // the face
    g.box([2, 4], [0, 0], [3, 5], sand);
    out(g, 3, 2, INK); pairFront(g, 2, 3, INK);                                          // nose and eyes
    return g.entry({ id: 'cand-p12-quartz-hedgehog', name: 'Quartz Hedgehog', story: 'It curls up when frightened, and then it is a geode.' });
  })(),

  // a mole up out of its hole in the cave floor: a round sandy head and
  // shoulders, a pink star of a nose, tiny eyes, and two big crystal claws
  (() => {
    const g = grid(9, 5, 7);
    g.cylinder('y', [4, 3], 4.2, [0, 0], earth).cylinder('y', [4, 3], 2.4, [0, 0], basalt);   // the hole
    tint(g, (x, y, z) => g.get(x, y, z) === earth && (Math.abs(x - 4) + z) % 3 === 0, sandDk);
    g.ellipsoid([4, 2.2, 3], [2.4, 2.6, 2.0], sand);
    tint(g, (x, y, z) => onSurface(g, x, y, z) && y >= 4 && z <= 2, stoneLt);
    out(g, 4, 2, pink);
    pairFront(g, 3, 3, INK);                                                            // tiny eyes
    for (const x of [1, 2]) { pair(g, x, 1, 4, sand); }                                 // arms
    pair(g, 0, 1, 5, crystalLt); pair(g, 1, 1, 5, crystal); pair(g, 0, 2, 5, crystalLt); pair(g, 1, 0, 5, crystalDk);   // crystal claws
    return g.entry({ id: 'cand-p12-crystal-mole', name: 'Crystal Mole', story: 'It digs for the light it has never seen.' });
  })(),

  // a bat asleep upside down under a ledge of rock: its feet hooked on, its
  // wings wrapped round it, its crystal ears pointing at the floor, a sleepy
  // face the right way up for you to see
  (() => {
    const g = grid(7, 9, 5);
    g.box([0, 6], [8, 8], [0, 4], stoneDk).box([1, 5], [7, 7], [1, 3], stone);          // the ledge
    pair(g, 2, 6, 2, basalt);                                                           // feet hooked on
    g.ellipsoid([3, 3.8, 2], [2.4, 2.4, 1.8], crystalDk);                                // wrapped wings
    tint(g, (x, y, z) => (x === 3 && y >= 4) || (z >= 3 && x >= 2 && x <= 4 && y >= 5), crystal);
    g.box([2, 4], [1, 3], [2, 3], sand).box([2, 4], [1, 2], [4, 4], sand);              // the face
    pair(g, 2, 2, 4, INK);
    pair(g, 2, 0, 3, crystalLt); pair(g, 2, 0, 2, crystal);                                // crystal ears, pointing down
    return g.entry({ id: 'cand-p12-crystal-bat', name: 'Crystal Bat', story: 'It sleeps upside down so it can dream of the sky.' });
  })(),

  // the eye stone: a standing stone at the mouth of the cave with one great
  // carved eye of crystal, open, watching; points of violet at its foot
  (() => {
    const g = grid(5, 10, 5);
    g.box([0, 4], [0, 0], [0, 4], stoneDk);
    g.box([1, 3], [1, 8], [1, 3], stone).box([0, 4], [1, 5], [1, 3], stone).set(2, 9, 2, stoneLt);
    g.box([1, 3], [8, 8], [1, 3], stoneLt);
    g.box([1, 3], [4, 6], [4, 4], crystal).set(2, 5, 4, INK).set(2, 6, 4, crystalLt).set(2, 4, 4, crystalDk);   // the eye
    g.set(0, 4, 4, crystalDk).set(4, 4, 4, crystalDk);
    g.box([1, 3], [7, 7], [4, 4], stoneDk);                                             // a heavy brow
    point(g, 0, 0, 1, 2); point(g, 4, 0, 1, 2); point(g, 0, 4, 1, 1); point(g, 4, 4, 1, 1);
    return g.entry({ id: 'cand-p12-eye-stone', name: 'Eye Stone', story: 'Whatever comes out of the dark, it saw it first.' });
  })(),
];
