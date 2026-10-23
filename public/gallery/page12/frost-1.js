// Page 12 · II Frost Relics: high up, where the cold came first and kept
// everything just as it was. A stone mammoth with frost on its back, a
// pebble sprite frozen mid-wave in a chunk of ice, a seal pup asleep on its
// floe, a snow-capped stone lantern with a cold blue light, and a monkey in a
// hot spring that has never once got out.
// Sky: the Frost palette (white to ice blue), so stone stays warm sandstone,
// frost is pure white on the top faces, and ice blue is the one accent; the
// only warm colours are a monkey's face and a seal's black eyes.
import { grid } from '../voxel.js';
import { INK, BLUSH, S, front, out, pair, pairAt, pairFront, pairFrontAt, quad, tint, onSurface } from './kit.js';

const { stone, stoneLt, stoneDk, basalt, moss, mossDk, mossLt, frost, frostBlue, ice, iceDk, glow, tide, foam, cream } = S;

export default [
  // a mammoth coming toward you, slow and patient: a domed head, small ears,
  // a trunk curled at the tip, two long cream tusks, and frost all down its
  // back
  (() => {
    const g = grid(9, 7, 7);
    g.ellipsoid([4, 2.8, 2.6], [3.9, 2.5, 2.7], stone);
    g.ellipsoid([4, 4.3, 4.8], [2.3, 2.3, 1.6], stone);
    quad(g, 3, 0, 2, stoneDk);                                                          // four stout legs
    tint(g, (x, y, z) => onSurface(g, x, y, z) && !g.get(x, y + 1, z) && y >= 5 && z <= 3, frost);
    pair(g, 1, 4, 4, stone); pair(g, 1, 3, 4, stoneDk); pair(g, 0, 4, 4, stoneDk);         // small ears
    pairFront(g, 3, 4, INK);
    g.box([4, 4], [1, 3], [6, 6], stoneDk).set(4, 0, 6, stoneDk).set(4, 0, 5, stoneDk);   // the trunk, curled
    pair(g, 3, 2, 6, cream); pair(g, 3, 1, 6, cream); pair(g, 2, 1, 6, cream); pair(g, 2, 2, 6, cream);   // tusks, curling up
    return g.entry({ id: 'cand-p12-frost-mammoth', name: 'Frost Mammoth', story: 'It walked into the winter and the winter never let it out.' });
  })(),

  // a pebble sprite frozen mid-wave in a chunk of ice: its face pressed to
  // the front, big eyes and pink cheeks under the frost, its leaf ears
  // sticking out of the top
  (() => {
    const g = grid(7, 8, 6);
    g.ellipsoid([3, 3.2, 2.5], [3.2, 3.4, 2.7], ice);
    tint(g, (x, y, z) => onSurface(g, x, y, z) && (x + y * 2 + z) % 5 === 0, frostBlue);
    tint(g, (x, y, z) => onSurface(g, x, y, z) && !g.get(x, y + 1, z), frost);
    for (let x = 1; x <= 5; x++) for (let y = 1; y <= 5; y++) if ((x - 3) ** 2 + (y - 3) ** 2 <= 4.6) front(g, x, y, stone);   // the sprite, at the glass
    pairFront(g, 2, 3, INK); pairFront(g, 2, 2, INK); pairFront(g, 1, 2, BLUSH);
    pair(g, 1, 6, 2, moss); pair(g, 1, 7, 2, mossLt); pair(g, 0, 7, 2, mossLt);            // leaf ears out of the top
    return g.entry({ id: 'cand-p12-frozen-pebblet', name: 'Frozen Pebblet', story: 'It was waving. It is still waving. Be patient with it.' });
  })(),

  // a seal pup asleep on a floe: a round white body, big dark eyes (open,
  // just), a black nose, front flippers out, tail flippers behind
  (() => {
    const g = grid(7, 5, 9);
    g.box([0, 6], [0, 0], [0, 8], ice).box([1, 5], [0, 0], [1, 7], (x, y, z) => ((x + z) % 4 ? frost : ice));   // the floe
    g.ellipsoid([3, 2.2, 3.8], [2.5, 1.9, 3.6], cream);
    g.ellipsoid([3, 2.6, 6.6], [2.0, 1.7, 1.5], cream);
    pairFront(g, 2, 3, INK);
    out(g, 3, 2, INK);                                                                  // the nose
    pair(g, 0, 1, 5, stoneLt); pair(g, 1, 1, 5, cream);                                   // front flippers
    pair(g, 2, 1, 0, stoneLt);                                                          // tail flippers
    return g.entry({ id: 'cand-p12-seal-pup', name: 'Seal Pup', story: 'It fell asleep on the ice and the ice floated off.' });
  })(),

  // a stone lantern with a snow cap: a wide foot, a post, and a light box
  // lit cold blue inside, icicles at the four corners of its roof
  (() => {
    const g = grid(5, 9, 5);
    g.box([0, 4], [0, 0], [0, 4], stoneDk).box([1, 3], [1, 1], [1, 3], stone);
    g.box([2, 2], [2, 3], [2, 2], stone).box([1, 3], [4, 4], [1, 3], stone);           // the post and its collar
    g.box([1, 3], [5, 5], [1, 3], stone).set(2, 5, 2, glow);                           // the light box
    for (const [x, z] of [[2, 3], [2, 1], [1, 2], [3, 2]]) g.set(x, 5, z, frostBlue);
    quad(g, 1, 5, 1, stone);
    g.box([0, 4], [6, 6], [0, 4], stone).box([1, 3], [7, 7], [1, 3], frost).set(2, 8, 2, frost);   // the roof, snowed on
    quad(g, 0, 6, 0, frost);
    quad(g, 0, 5, 0, ice);                                                              // icicles
    return g.entry({ id: 'cand-p12-rime-lantern', name: 'Rime Lantern', story: 'Its flame went cold, but it never went out.' });
  })(),

  // a snow monkey up to its shoulders in a hot spring, a pink face, a cap of
  // snow on its head, steam rising round it from the water
  (() => {
    const g = grid(9, 6, 8);
    const fur = 0xb9ada3, face = 0xe8928a;
    g.cylinder('y', [4, 3.5], 4.2, [0, 1], stone).cylinder('y', [4, 3.5], 2.9, [1, 1], tide);   // the pool
    tint(g, (x, y, z) => y === 0 && (x + z) % 3 === 0, stoneDk);
    tint(g, (x, y, z) => y === 1 && g.get(x, y, z) === stone && (x * 2 + z) % 5 === 0, frost);
    g.ellipsoid([4, 1.6, 3.4], [1.9, 1.3, 1.5], fur);
    g.ellipsoid([4, 3.3, 3.6], [1.6, 1.3, 1.3], fur);
    for (const x of [3, 4, 5]) for (const y of [2, 3]) front(g, x, y, face);
    pairFrontAt(g, 4, 3, 3, INK);
    g.box([3, 5], [4, 4], [3, 4], (x, y, z) => (g.get(x, y, z) ? frost : undefined)).set(4, 5, 3, frost);   // snow on its head
    pair(g, 2, 3, 3, fur);                                                              // ears
    for (const [x, z] of [[1, 2], [7, 5]]) g.set(x, 2, z, foam).set(x, 3, z, foam);     // steam
    g.set(6, 2, 2, foam).set(2, 2, 5, foam);
    return g.entry({ id: 'cand-p12-snow-monkey', name: 'Hot Spring Monkey', story: 'The snow falls on its head. It does not mind at all.' });
  })(),
];
