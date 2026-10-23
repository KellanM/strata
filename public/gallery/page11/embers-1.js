// Page 11 · II Ember Hollow: where a falling star struck the hills, and the
// stones round the crater never quite cooled. Its creatures are the ember
// type - a salamander with a crest of coals, a pup with a fire for a heart,
// a toad whose back is a kiln, a snail with a spiral crack of light in its
// shell, a scarab with a seam of fire - and the totem the people set up to
// keep the embers fed.
// Sky: ash at the top, a low ember glow at the bottom (the Beacon palette,
// cool stone in shade so the fire reads brightest). The creatures are a
// darker, burnt stone so their orange and gold cracks glow against them.
import { grid } from '../voxel.js';
import { INK, S, front, pair, pairFront, quad, tint, onSurface, sideSheet } from './kit.js';

const { stone, stoneLt, stoneDk, basalt, ash, ember, emberHot, emberDk, moss, bronze = 0xb07a3a } = S;

export default [
  // a salamander crawling toward you: low, dark and wide-headed, with a
  // crest of coals down its back, glowing eyes, splayed feet and a tail that
  // curls away with a hot tip
  (() => {
    const g = grid(7, 3, 9);
    g.box([2, 4], [0, 1], [2, 6], ash);
    g.box([1, 5], [0, 1], [7, 8], ash).box([2, 4], [2, 2], [7, 8], ash);              // the wide head
    pair(g, 1, 1, 8, emberHot); pair(g, 2, 2, 8, ash);                                   // glowing eyes
    g.box([2, 4], [0, 0], [8, 8], emberDk);                                             // a warm mouth
    for (const z of [2, 5]) { pair(g, 1, 0, z, ash); pair(g, 0, 0, z, basalt); }         // splayed feet
    for (let z = 2; z <= 6; z++) g.set(3, 2, z, z % 2 ? emberHot : ember);              // the crest of coals
    g.set(2, 1, 4, emberDk).set(4, 1, 3, emberDk);
    g.box([3, 3], [0, 0], [0, 1], ash).box([4, 5], [0, 0], [0, 0], ash).set(6, 0, 0, ember).set(6, 0, 1, emberHot);   // the tail
    return g.entry({ id: 'cand-p11-ember-salamander', name: 'Coal Salamander', story: 'It sleeps in the fire. It thinks you are cold.' });
  })(),

  // a pup sitting up, sandstone gone warm from the inside: a big head, a
  // glowing heart in its chest, ember-tipped ears and a flame for a tail
  (() => {
    const g = grid(7, 9, 6);
    g.ellipsoid([3, 1.8, 2.5], [2.1, 2.0, 2.0], stone);
    g.ellipsoid([3, 4.8, 3], [3.2, 2.1, 2.2], stone);
    pairFront(g, 1, 5, INK);                                                            // eyes set wide
    front(g, 3, 4, stoneLt); g.set(3, 4, 5, INK);                                       // muzzle, a dark nose
    pair(g, 1, 7, 3, stone); pair(g, 1, 8, 3, ember); pair(g, 1, 7, 2, stoneDk);          // pointed ears
    pair(g, 2, 0, 4, stoneDk);                                                          // front paws
    front(g, 3, 2, emberHot); front(g, 3, 1, ember);                                    // the ember heart
    g.set(3, 2, 0, ember).set(3, 3, 0, ember).set(3, 4, 0, emberHot);                   // flame tail
    return g.entry({ id: 'cand-p11-cinder-pup', name: 'Cinder Pup', story: 'Warm to hold. Too warm, after a while.' });
  })(),

  // a fat toad with a kiln on its back: bulging eyes on top, a grin full of
  // firelight, a chimney with a flame licking out of it
  (() => {
    const g = grid(9, 7, 8);
    g.ellipsoid([4, 2, 3.5], [4.3, 2.4, 3.6], stone);
    tint(g, (x, y, z) => y === 0, stoneDk);
    for (const x of [1, 2]) for (const y of [4]) for (const z of [5, 6]) pair(g, x, y, z, stone);   // eye bumps
    pair(g, 2, 4, 6, INK);
    for (let x = 2; x <= 6; x++) front(g, x, 2, x === 4 ? emberHot : ember);           // the glowing grin
    g.box([3, 5], [4, 5], [1, 3], stoneDk).set(4, 5, 2, emberHot).set(4, 6, 2, ember);  // the chimney and its flame
    return g.entry({ id: 'cand-p11-kiln-toad', name: 'Kiln Toad', story: 'Feed it a twig and it purrs like a stove.' });
  })(),

  // a snail coming toward you, its dark shell cracked in a spiral that glows
  // from inside, a pale foot, and two stalk eyes up
  (() => {
    const g = grid(6, 7, 8);
    g.cylinder('x', [3.5, 2.5], 2.8, [1, 4], ash);                                       // the shell
    const spiral = ['.aaaa.', 'aeeeea', 'aeaaea', 'aeahea', 'aeaaaa', '.aaaa.'];
    for (const x of [1, 4]) sideSheet(g, spiral, [x, x], { a: ash, e: ember, h: emberHot }, 0, 1);   // the glowing spiral, both sides
    g.box([1, 4], [0, 0], [0, 7], stone).box([1, 4], [1, 2], [6, 7], stone);            // foot and head
    pair(g, 1, 3, 7, stone); pair(g, 1, 4, 7, INK);                                      // stalk eyes
    pair(g, 0, 0, 6, stoneLt); pair(g, 0, 0, 5, stoneLt);                               // the foot's frill
    pair(g, 0, 0, 1, stoneLt);
    return g.entry({ id: 'cand-p11-lava-snail', name: 'Ember Snail', story: 'It carries the fire home, very slowly.' });
  })(),

  // a scarab, dark as cinder, a seam of fire down its back where the wing
  // cases meet, two coals on each case, glowing eyes, a horn and six legs
  (() => {
    const g = grid(7, 4, 8);
    g.ellipsoid([3, 1.6, 3.2], [3.2, 1.9, 3.3], ash);
    g.box([2, 4], [0, 1], [6, 7], basalt).set(3, 2, 7, basalt).set(3, 3, 7, ember);     // the head and horn
    pair(g, 2, 1, 7, emberHot);                                                         // eyes
    for (let z = 0; z <= 5; z++) if (g.get(3, 3, z)) g.set(3, 3, z, emberHot); else if (g.get(3, 2, z)) g.set(3, 2, z, emberHot);   // the seam
    for (const z of [2, 4]) { const y = g.get(1, 3, z) ? 3 : 2; pair(g, 1, y, z, ember); }   // coals on the wing cases
    for (const z of [2, 4, 6]) { pair(g, 1, 0, z, basalt); pair(g, 0, 0, z, basalt); }   // six legs
    return g.entry({ id: 'cand-p11-ember-scarab', name: 'Cinder Scarab', story: 'It rolled a fallen star all the way here.' });
  })(),

  // the hollow's totem: two faces, one above the other, stone wings and a
  // bronze bowl on its head where the embers are kept alive
  (() => {
    const g = grid(5, 10, 5);
    g.box([1, 3], [0, 7], [1, 3], stone).box([1, 3], [0, 0], [1, 3], stoneDk);
    g.box([1, 3], [4, 4], [4, 4], stoneDk);                                              // brow of the lower face
    pair(g, 1, 3, 3, INK); g.set(2, 2, 4, stoneLt).set(2, 1, 3, emberDk);               // eyes, nose, mouth
    pair(g, 1, 6, 3, emberHot); g.set(2, 5, 4, ember);                                  // the upper face, a beak
    pair(g, 0, 6, 2, stoneDk); pair(g, 0, 5, 2, stoneDk); pair(g, 0, 6, 1, stoneDk); pair(g, 0, 6, 3, stoneDk);   // wings
    g.box([0, 4], [8, 8], [0, 4], bronze).box([1, 3], [8, 8], [1, 3], emberDk);         // the bowl
    g.box([1, 3], [9, 9], [2, 2], ember).box([2, 2], [9, 9], [1, 3], ember).set(2, 9, 2, emberHot);   // the embers
    return g.entry({ id: 'cand-p11-ember-totem', name: 'Ember Totem', story: 'Someone must always tend it. Tonight, it is you.' });
  })(),
];
