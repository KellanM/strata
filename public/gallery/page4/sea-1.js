// Page 4 · Sea & Shore: sea creatures with silhouettes you can name from a
// thumbnail: a shark's fin, an orca's patches, a seahorse curl, a manta's
// wings, an anglerfish's lure. Kawaii rules (docs/voxel-study.md); faces look
// toward +z (the seahorse is a profile and carries an eye on both sides).
import { C, grid } from '../voxel.js';
import { INK, BLUSH, front, out, pair, pairFront, pairOut, kawaii, tint, sheet } from './kit.js';

const shark = 0x86aed6, sharkBelly = 0xf4f7fb, orca = 0x34364a, orcaWhite = 0xf8f8fb,
  horse = 0xf6a26b, horseBelly = 0xfbe0b8, horseFin = 0xfbcf9a, manta = 0x5f78bf, mantaMouth = 0xf4f7fb,
  angler = 0x7a86cf, anglerMouth = 0x8a3a5a, lure = 0xffe36b, stalk = 0x4d4a78, seal = 0xab8670, sealMuzzle = 0xeedcc6,
  sealFlip = 0x6e5244, ball1 = 0xe0565b, ball2 = 0xfbf8f2, ball3 = 0x5b8fd6, bunny = 0xf8f6f0,
  bunnyFoot = 0xf6dc86, gillTuft = 0xf3c25a;

export default [
  // a baby shark: chubby blue body, white smile-belly, a dorsal fin and a tail
  (() => {
    const g = grid(7, 7, 9);
    g.ellipsoid([3, 2.4, 4.3], [2.8, 2.1, 3.8], shark);
    tint(g, (x, y, z) => y <= 1 || (y <= 2 && z >= 6), sharkBelly);
    kawaii(g, 2, 3, { bx: 1, by: 2 });
    g.set(3, 5, 3, shark).set(3, 5, 4, shark).set(3, 6, 3, shark);   // dorsal fin
    for (let y = 1; y <= 4; y++) g.set(3, y, 0, shark);               // tail fin
    pair(g, 0, 2, 5, shark); pair(g, 0, 2, 4, shark);                // side fins
    return g.entry({ id: 'cand-p4-baby-shark', name: 'Baby Shark' });
  })(),

  // a chubby orca: black back, white chin and eye patches, a tall fin and flukes
  (() => {
    const g = grid(7, 8, 9);
    g.ellipsoid([3, 2.4, 4.3], [2.8, 2.1, 3.8], orca);
    tint(g, (x, y, z) => y <= 1 || (y <= 2 && z >= 6), orcaWhite);
    pairFront(g, 1, 4, orcaWhite); pairFront(g, 2, 4, orcaWhite);   // the white eye patches
    pairFront(g, 2, 3, INK);
    pairFront(g, 1, 2, BLUSH);
    g.set(3, 5, 3, orca).set(3, 5, 4, orca).set(3, 6, 3, orca).set(3, 7, 3, orca);
    g.box([1, 5], [2, 2], [0, 0], orca).clear(3, 2, 0).set(3, 2, 0, orca);
    return g.entry({ id: 'cand-p4-orca', name: 'Orca' });
  })(),

  // a seahorse in profile: a spiky crown, a thin tube snout, a ridged belly,
  // a fin on its back and a tail curled under
  (() => {
    const g = grid(7, 9, 3);
    sheet(g, [
      '.......',
      '..hhh..',
      '..hhh..',
      '..hhh..',
      '.hhhb..',
      '.hhhhb.',
      '..hhbb.',
      '...hh..',
      '.......',
    ], [0, 2], { h: horse, b: horseBelly });
    sheet(g, [
      '..h.h..',
      '.......',
      '.....ss',
      '.......',
      'f......',
      'f......',
      '.......',
      '.t.....',
      '.ttt...',
    ], [1, 1], { h: horse, f: horseFin, t: horse, s: horse });
    g.set(3, 8, 1, horse);
    g.set(4, 6, 0, INK).set(4, 6, 2, INK).set(4, 5, 0, BLUSH).set(4, 5, 2, BLUSH);
    return g.entry({ id: 'cand-p4-seahorse', name: 'Seahorse' });
  })(),

  // a manta ray gliding: wide wings tipped up, two little horn fins, a smile
  (() => {
    const g = grid(9, 3, 7);
    g.layers(0, [[
      '....b....',
      '....b....',
      '..wbbbw..',
      '.wwbbbww.',
      'wwwbbbwww',
      '..wbbbw..',
      '...h.h...',
    ], [
      '.........',
      '.........',
      '...bbb...',
      '...bbb...',
      'w..bbb..w',
      '...bbb...',
      '.........',
    ]], { b: manta, w: manta, h: manta });
    g.set(3, 1, 5, INK).set(5, 1, 5, INK).set(4, 0, 5, mantaMouth);
    g.set(3, 0, 5, BLUSH).set(5, 0, 5, BLUSH);
    return g.entry({ id: 'cand-p4-manta', name: 'Manta Ray' });
  })(),

  // an anglerfish: a round periwinkle fish, a toothy grin and a glowing lure
  (() => {
    const g = grid(7, 8, 8);
    g.ellipsoid([3, 2.8, 3.4], [3.0, 2.4, 2.6], angler);
    for (let x = 1; x <= 5; x++) front(g, x, 2, anglerMouth);
    pairFront(g, 2, 2, C.white);
    kawaii(g, 2, 4, { bx: 1, by: 3 });
    g.set(3, 6, 3, stalk).set(3, 7, 3, stalk).set(3, 7, 4, stalk).set(3, 7, 5, stalk)
      .set(3, 7, 6, stalk).set(3, 6, 6, lure);
    pair(g, 0, 3, 3, angler); pair(g, 0, 4, 2, angler);             // side fins
    g.set(3, 2, 0, angler).set(3, 3, 0, angler).set(3, 4, 0, angler);
    return g.entry({ id: 'cand-p4-anglerfish', name: 'Anglerfish' });
  })(),

  // a sea lion sitting up, balancing a striped ball on its head
  (() => {
    const g = grid(7, 9, 6);
    g.ellipsoid([3, 1.6, 2.4], [2.3, 1.6, 1.9], seal)
      .ellipsoid([3, 4.6, 2.8], [2.4, 1.8, 1.9], seal);
    for (let x = 2; x <= 4; x++) for (let y = 3; y <= 4; y++) front(g, x, y, sealMuzzle);
    out(g, 3, 4, INK);
    kawaii(g, 2, 5, { bx: 1, by: 4 });
    pair(g, 0, 1, 2, sealFlip); pair(g, 0, 1, 3, sealFlip);         // side flippers
    pair(g, 2, 0, 3, sealFlip);                                    // front flippers
    pair(g, 2, 1, 0, sealFlip);                                    // tail flippers
    g.box([2, 4], [7, 8], [2, 4], (x) => (x === 2 ? ball1 : x === 3 ? ball2 : ball3));
    for (const x of [2, 4]) for (const [y, z] of [[7, 2], [7, 4], [8, 2], [8, 4]]) g.clear(x, y, z);
    return g.entry({ id: 'cand-p4-sea-lion', name: 'Sea Lion & Ball' });
  })(),

  // a sea bunny: a fluffy white sea slug with two black-tipped "ears"
  (() => {
    const g = grid(7, 6, 7);
    g.ellipsoid([3, 1.6, 3], [3.0, 1.8, 2.8], bunny);
    tint(g, (x, y) => y === 0, bunnyFoot);
    for (const y of [4, 5]) pair(g, 2, y, 3, y === 5 ? INK : bunny);
    pair(g, 2, 3, 3, bunny);
    kawaii(g, 2, 2, { bx: 1, by: 1 });
    g.set(3, 3, 1, gillTuft).set(3, 4, 1, gillTuft).set(2, 4, 1, gillTuft).set(4, 4, 1, gillTuft);
    return g.entry({ id: 'cand-p4-sea-bunny', name: 'Sea Bunny' });
  })(),
];
