// Page 14 · II Deep Time: creatures older than the stones, and a few that
// never got round to leaving. After the Trilobite, Fossil Fish and Frost
// Mammoth (Kellan's picks from page 12): ancient animals drawn as calm,
// living things, some of them part way to stone - a horseshoe crab, a
// coelacanth with eyes that shine, stromatolites, a glyptodont with a garden on its
// shell, a sea lily turning to stone from the root up, a sail-back warming
// its sail, an ichthyosaur with its great ringed eye, and a midge in amber.
// Each is one shell, hide or scale colour for most of its body, its pattern
// in regular rows (plates, segments, spots on a grid, sail ribs), and the
// amber is lit from the upper left on a dithered ramp like the Heart amulet.
// Sky: Lagoon (the Tide Caves' chapter), since most of them came out of the sea.
import { grid } from '../voxel.js';
import { INK, S, pair, pairZ, pairFront, quad, tint, onSurface, lathe, ramp, flank } from './kit.js';

const { stone, stoneDk, bone, boneDk, moss, mossDk, mossLt, glow, cream } = S;
const shell = 0x9a7a4a, shellLt = 0xb8955e, shellDk = 0x6f5634,
  coel = 0x34608f, coelDk = 0x264a72, spot = 0xf3ead8,
  mat = 0xd9c49a, matDk = 0xa8835c, water = 0x5ea8dc, waterDk = 0x3f7fb8,
  glyp = 0xc9b28a, glypLt = 0xe0cfa8, glypDk = 0x9a8058, hide = 0x8a6a4a,
  lily = 0xd2566a, lilyDk = 0xa83f55, lilyLt = 0xf4a3b5,
  olive = 0x7d8a5a, oliveDk = 0x5a6642, rust = 0xc4502e,
  ichth = 0x6f8aa0, ichthDk = 0x55697e, belly = 0xdfe6ea;
const AMBER = [0x7a3a10, 0xa8561a, 0xd07f22, 0xeaa63c, 0xf8d27a];

export default [
  // a horseshoe crab come up the beach: a domed shell, its tail spike out
  // behind, spines down both sides of the back plate, a pale ridge down the
  // middle and two dark eyes set on the dome
  (() => {
    const g = grid(9, 3, 10);
    const key = { p: shell, o: shellDk, s: shellDk, t: shellDk, r: shellLt };
    g.layers(0, [
      ['....t....', '....t....', '....t....', '..ooooo..', '.sooooos.', '.ppppppp.', 'ppppppppp', 'ppppppppp', 'ppppppppp', '.ppppppp.'],
      ['.........', '.........', '.........', '...ooo...', '..ooooo..', '..ppppp..', '.ppppppp.', '.ppppppp.', '..ppppp..', '.........'],
      ['.........', '.........', '.........', '.........', '....r....', '....r....', '....r....', '....r....', '....r....', '.........'],
    ], key);
    tint(g, (x, y, z) => y === 1 && z >= 5, shellLt);                                   // the dome catches the light
    tint(g, (x, y, z) => y === 1 && (z === 3 || z === 4) && x !== 4, shell);           // banded back plate
    pair(g, 2, 1, 7, INK);                                                              // eyes
    g.set(4, 0, 0, boneDk);
    return g.entry({ id: 'cand-p14-horseshoe-crab', name: 'Horseshoe Crab', story: 'It has come up the same beach every spring since before there were flowers.' });
  })(),

  // a coelacanth side on: deep blue with pale spots in rows, the lobed fins
  // it walks the sea floor on, a three-part tail, and eyes that shine
  (() => {
    const g = grid(10, 7, 5);
    g.ellipsoid([4.8, 3.2, 2], [3.8, 2.2, 1.5], coel);
    g.box([7, 8], [2, 4], [1, 3], coel).set(9, 3, 2, coel);                             // the head
    tint(g, (x, y, z) => (z === 1 || z === 3) && onSurface(g, x, y, z) && x >= 2 && x <= 7 && x % 2 === 0 && y % 2 === 0, spot);   // spots in rows
    for (const y of [1, 2, 3, 4, 5]) g.set(1, y, 2, coelDk);                           // the tail
    g.set(0, 1, 2, coelDk).set(0, 5, 2, coelDk).set(0, 3, 2, coel);
    g.set(5, 6, 2, coelDk).set(4, 6, 2, coelDk);                                        // dorsal fin
    pairZ(g, 6, 1, 0, coelDk); pairZ(g, 5, 0, 0, coelDk);                                // lobed fins, like little legs
    pairZ(g, 3, 1, 0, coelDk);
    flank(g, 8, 4, glow);                                                               // eyes that shine
    return g.entry({ id: 'cand-p14-coelacanth', name: 'Coelacanth', story: 'Everyone said it had been gone for seventy million years. Nobody told it.' });
  })(),

  // stromatolites in a warm shallow sea: three domes of mat laid down a
  // layer a year, banded pale and dark, still green and alive on top
  (() => {
    const g = grid(11, 6, 7);
    g.box([0, 10], [0, 0], [0, 6], (x, y, z) => (z % 2 ? water : waterDk));
    const band = (x, y) => (y % 2 ? mat : matDk);
    lathe(g, [5, 3], 0, [2.2, 2.2, 2.1, 1.8, 1.4, 0.8], band);
    for (const cx of [1, 9]) lathe(g, [cx, 3], 0, [1.2, 1.2, 1.1, 0.6], band);
    tint(g, (x, y) => y === 5 || (y === 3 && (x <= 2 || x >= 8)), mossLt);                // alive on top
    return g.entry({ id: 'cand-p14-stromatolites', name: 'Stromatolites', story: 'They made the air, one thin layer a year, and they are still at it.' });
  })(),

  // a glyptodont: a great domed shell of plates in a checked pattern, a dark
  // rim, an armoured cap on its head, a club of a tail, and moss on top
  (() => {
    const g = grid(7, 6, 10);
    g.ellipsoid([3, 1.8, 4.6], [3.3, 3.4, 4.0], glyp);
    g.box([0, 6], [0, 0], [0, 9], 0);
    tint(g, (x, y, z) => onSurface(g, x, y, z) && y >= 2 && y % 2 === 0, glypLt);           // rows of plates
    tint(g, (x, y) => y === 1, glypDk);                                                 // the rim
    tint(g, (x, y) => y === 5, moss);                                                   // moss on top
    g.box([2, 4], [1, 2], [9, 9], hide).box([2, 4], [3, 3], [9, 9], glypDk);            // the head, its cap
    pairFront(g, 2, 2, INK);
    g.set(3, 1, 0, glypDk).box([2, 4], [2, 2], [0, 0], glypDk).set(3, 3, 0, glypDk);   // the club tail
    quad(g, 1, 0, 2, hide);                                                             // feet
    return g.entry({ id: 'cand-p14-glyptodont', name: 'Glyptodont', story: 'It carried its own roof, and in time a little garden grew on it.' });
  })(),

  // a sea lily on a rock: a stalk of stone segments, bone and shadow in turn,
  // and on top, still alive, a crown of eight red arms opening like a flower
  (() => {
    const g = grid(7, 10, 7);
    g.box([1, 5], [0, 0], [1, 5], stoneDk).box([2, 4], [1, 1], [2, 4], stone);
    pair(g, 1, 1, 3, mossDk); g.set(3, 1, 1, mossDk).set(3, 1, 5, mossDk);
    for (let y = 2; y <= 5; y++) g.set(3, y, 3, y % 2 ? bone : boneDk);                 // the stalk, gone to stone
    g.box([2, 4], [6, 6], [2, 4], lilyDk);                                              // the cup
    for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]]) {
      g.set(3 + dx, 7, 3 + dz, lily).set(3 + 2 * dx, 8, 3 + 2 * dz, lily).set(3 + 2 * dx, 9, 3 + 2 * dz, lilyLt);   // the arms
    }
    g.set(3, 7, 3, lilyDk);
    return g.entry({ id: 'cand-p14-sea-lily', name: 'Sea Lily', story: 'It is turning to stone from the root up, and it does not mind.' });
  })(),

  // a sail-back side on, low and patient, its tall sail of bone ribs and
  // rust skin turned to the sun, legs out to the sides
  (() => {
    const g = grid(10, 7, 5);
    g.ellipsoid([4.5, 2, 2], [3.8, 1.3, 1.5], olive);
    g.box([7, 9], [1, 2], [1, 3], olive).box([7, 8], [3, 3], [1, 3], olive);           // the head
    g.set(1, 1, 2, olive).set(0, 1, 2, oliveDk);                                        // the tail
    const top = [0, 0, 4, 5, 6, 6, 5, 4];
    for (let x = 2; x <= 7; x++) for (let y = 3; y <= top[x]; y++) g.set(x, y, 2, x % 2 ? bone : rust);   // the sail
    for (const x of [3, 6]) { pairZ(g, x, 0, 0, oliveDk); pairZ(g, x, 1, 0, oliveDk); }  // legs
    tint(g, (x, y, z) => g.get(x, y, z) === olive && y === 1 && (z === 1 || z === 3), oliveDk);
    flank(g, 8, 3, INK);                                                                // eyes
    g.set(9, 1, 2, cream);
    return g.entry({ id: 'cand-p14-sail-back', name: 'Sail-back', story: 'Every morning it turns its sail to the sun and waits to be warm.' });
  })(),

  // an ichthyosaur side on: a sea reptile shaped like a dolphin, a long thin
  // snout, a crescent tail, a pale belly, and a great eye in a ring of bone
  (() => {
    const g = grid(10, 6, 5);
    g.ellipsoid([4.4, 2.6, 2], [3.6, 1.7, 1.5], ichth);
    g.box([6, 8], [2, 4], [1, 3], ichth).box([9, 9], [2, 2], [2, 2], ichth);           // head and snout
    tint(g, (x, y) => y <= 1, belly);
    g.set(5, 5, 2, ichthDk).set(4, 5, 2, ichthDk);                                      // dorsal fin
    g.box([1, 1], [2, 3], [2, 2], ichthDk).set(0, 4, 2, ichthDk).set(0, 5, 2, ichthDk).set(0, 1, 2, ichthDk).set(0, 0, 2, ichthDk);   // the tail
    pairZ(g, 6, 2, 0, ichthDk); pairZ(g, 5, 1, 0, ichthDk); pairZ(g, 3, 2, 0, ichthDk);   // flippers, out to the sides
    for (const [x, y] of [[6, 3], [8, 3], [7, 2], [7, 4]]) flank(g, x, y, bone);        // the ring of bone
    flank(g, 7, 3, INK);
    return g.entry({ id: 'cand-p14-ichthyosaur', name: 'Ichthyosaur', story: 'Its eyes were made for the deep, where the light never reached.' });
  })(),

  // a drop of amber lit from the upper left, honey to deep brown in five
  // dithered steps, one glint, and a midge inside with its wings spread
  (() => {
    const rows = ['...#...', '..###..', '.#####.', '#######', '#######', '#######', '#######', '.#####.', '..###..'];
    const H = rows.length;
    const g = grid(7, H, 2);
    rows.forEach((row, k) => [...row].forEach((ch, x) => {
      if (ch !== '#') return;
      const y = H - 1 - k;
      for (const z of [0, 1]) g.set(x, y, z, ramp(AMBER, ((6 - x) + y) / 14, x, y, z === 0 ? 1 : 0));
    }));
    const midge = 0x3a2a22, wing = 0xf3e2b8;
    g.set(3, 2, 1, midge).set(3, 3, 1, midge).set(3, 4, 1, midge);                      // its body and head
    pair(g, 2, 3, 1, wing); pair(g, 1, 4, 1, wing);                                      // wings
    pair(g, 2, 5, 1, midge);                                                            // feelers
    g.set(1, 6, 1, 0xfff4d6);                                                           // the glint
    return g.entry({ id: 'cand-p14-amber', name: 'Amber Midge', story: 'It sat down on a warm branch to rest, a very long time ago.' });
  })(),
];
