// Page 11 · IV The Skywatchers: when the Gloam pulled the stars down, the
// old people carved guardians to watch the sky for their return, and some of
// the guardians are still watching. An owl on its pillar with starlight in
// its eyes, a sky lion with a fallen star under its paw, a stone keeper
// cradling one in its arms, a moth with stars on its wings, and the star
// itself, where it struck, still caught in the rock.
// Sky: dusk going to night (the Night palette, lifted to a lavender horizon
// so the cards stay readable). Stone keeps its warm sandstone; star gold is
// the one accent, and the only bright thing in the section.
import { grid } from '../voxel.js';
import { INK, S, front, out, pair, pairFront, quad, tint, onSurface, sheet } from './kit.js';

const { stone, stoneLt, stoneDk, basalt, moss, mossDk, mossLt, lichen, glow, star, starHot, starDk } = S;

export default [
  // an owl on a low plinth, wings folded, ear tufts up, a pale face disc
  // and two eyes that still hold starlight; moss at its feet
  (() => {
    const g = grid(7, 9, 6);
    g.box([0, 6], [0, 0], [0, 5], stoneDk).box([1, 5], [1, 1], [1, 4], stone);          // the plinth
    g.ellipsoid([3, 4.6, 2.6], [3.2, 3.1, 2.3], stone);
    tint(g, (x, y, z) => (x <= 0 || x >= 6) || (y <= 5 && (x <= 1 || x >= 5) && z <= 3), stoneDk);   // folded wings
    for (let x = 1; x <= 5; x++) for (const y of [4, 5, 6]) front(g, x, y, stoneLt);  // the face disc
    pairFront(g, 2, 5, star); out(g, 3, 4, starDk);                                     // eyes and beak
    pair(g, 1, 7, 2, stone); pair(g, 1, 8, 2, stoneDk);                                   // ear tufts
    pair(g, 2, 1, 5, star);                                                             // talons
    g.set(1, 1, 5, moss).set(5, 1, 0, mossLt).set(0, 1, 4, mossDk);
    return g.entry({ id: 'cand-p11-star-owl', name: 'Star Owl', story: 'It has not blinked since the last star fell.' });
  })(),

  // a sky lion on its plinth: a curly lichen-gold mane, a round face with a
  // wide grin, and under one front paw the star it caught
  (() => {
    const g = grid(7, 8, 8);
    g.box([0, 6], [0, 0], [0, 7], stoneDk).box([1, 5], [0, 0], [1, 6], stone);           // the plinth
    g.box([1, 5], [1, 3], [1, 4], stone);                                               // haunches and body
    pair(g, 1, 1, 5, stone); pair(g, 1, 2, 5, stone); pair(g, 1, 1, 6, stoneLt);            // front legs and paws
    g.ellipsoid([3, 5, 4], [2.9, 2.2, 2.2], lichen);                                     // the mane
    g.box([2, 4], [4, 6], [5, 6], stone);                                               // the face
    pair(g, 2, 6, 6, INK); g.set(3, 5, 6, stoneDk).set(3, 4, 6, basalt);                // eyes, nose, grin
    pair(g, 1, 7, 4, lichen); pair(g, 1, 7, 3, starDk);                                   // ears in the mane
    g.box([4, 5], [1, 2], [6, 7], star).set(5, 2, 7, starHot);                          // the caught star
    g.set(3, 2, 0, lichen).set(3, 3, 0, lichen).set(3, 4, 0, starDk);                   // tail tuft
    return g.entry({ id: 'cand-p11-sky-lion', name: 'Sky Lion', story: 'It caught one star as they fell. It will not let go.' });
  })(),

  // a stone keeper kneeling with a fallen star held to its chest in both
  // arms, its head bowed over it, the star lighting its face from below
  (() => {
    const g = grid(9, 9, 6);
    g.box([2, 6], [0, 1], [0, 3], stoneDk);                                             // kneeling legs
    g.box([2, 6], [2, 6], [1, 3], stone);                                               // the body
    g.box([3, 5], [7, 8], [1, 3], stone).box([3, 5], [8, 8], [1, 3], mossDk).set(4, 8, 2, moss);   // the head, mossed over
    pair(g, 3, 7, 4, glow);                                                             // eyes lit from below
    g.set(4, 7, 4, stone);
    for (const y of [3, 4, 5, 6]) { pair(g, 1, y, 2, stone); pair(g, 0, y, 2, y >= 5 ? stone : stoneDk); }   // shoulders and arms
    pair(g, 1, 2, 3, stoneDk); pair(g, 1, 2, 4, stoneDk); pair(g, 2, 2, 5, stoneDk); pair(g, 0, 3, 3, stoneDk); pair(g, 0, 3, 4, stoneDk); pair(g, 1, 3, 4, stoneDk);   // forearms round the star
    g.box([3, 5], [2, 4], [4, 5], star).set(4, 3, 5, starHot).set(4, 5, 4, starDk).set(4, 1, 4, starDk);   // the star
    return g.entry({ id: 'cand-p11-star-keeper', name: 'Star Keeper', story: 'It found the star cooling in the grass and kept it warm.' });
  })(),

  // a moth resting on a stone with its wings open toward you, a star-gold
  // eye on each wing, feathered antennae, a soft round body
  (() => {
    const g = grid(9, 7, 3);
    sheet(g, [
      '..ll.ll..',
      'aaahhhaaa',
      'absabasba',
      'aabbbbbaa',
      '.aabbbaa.',
      '..aabaa..',
      '...ppp...',
    ], [1, 1], { l: lichen, a: stone, b: stoneLt, s: star, h: stoneLt, p: stoneDk });
    g.box([3, 5], [5, 5], [0, 2], stoneLt).box([4, 4], [1, 4], [0, 2], stoneLt);         // head and body
    g.box([3, 5], [0, 0], [0, 2], stoneDk);
    pair(g, 3, 5, 2, INK);                                                              // eyes
    pair(g, 2, 3, 2, star);                                                             // eye spots raised
    return g.entry({ id: 'cand-p11-star-moth', name: 'Star Moth', story: 'It flies toward the only light it knows: the one in the ground.' });
  })(),

  // where a star struck: a boulder split open round it, the star still bright
  // in the crack, gold seams running out through the stone, moss on the cool
  // side
  (() => {
    const g = grid(8, 6, 7);
    g.ellipsoid([3.5, 2.4, 3], [3.8, 3.2, 3.2], stone);
    tint(g, (x, y, z) => y === 0, stoneDk);
    tint(g, (x, y, z) => onSurface(g, x, y, z) && z <= 2 && y >= 3, moss);
    tint(g, (x, y, z) => g.get(x, y, z) === moss && (x + y) % 3 === 0, mossLt);
    sheet(g, ['..s..', '.sss.', 'sshss', '.sss.', '.s.s.'], [6, 6], { s: star, h: starHot }, 1, 1);   // the star in the crack
    for (const [x, y] of [[0, 3], [7, 3], [1, 6], [6, 6], [2, 0], [5, 0]]) front(g, x, y, starDk);   // seams
    return g.entry({ id: 'cand-p11-struck-stone', name: 'Where It Fell', story: 'The star is still warm. The stone has not forgiven it.' });
  })(),
];
