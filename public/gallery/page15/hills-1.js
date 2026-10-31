// Page 15 · I Hill Roads, for Beacon Hills ("a fire on the far hill"): what
// keeps a fire, a flock and a traveller on the high road. The chapter has its
// signal fire, its ram, its donkey and its watchtower already; these are the
// rest of the hill's working life. Creatures (a collie, a shaggy cow, a
// kestrel on a post, a grouse in the heather, a pine marten on a milestone)
// and the things a shepherd leaves on the hill (a wheeled hut, a crook with
// its lantern, a drystone fold). Aimed at Kellan's best-rated three (Pegasus Foal, Origami
// Fox, Meerkat Lookout): one bold silhouette from the iso view, big blocks
// of colour, a pose with a small story in it, and a face that looks at you.
// Sky: Beacon (slate going to ember), so heather, ginger and lamplight read
// warm and the stone and iron read cool.
//
// Lit as the game lights them (lit() in shapes.js): every colour here is one
// flat material and the dithered ramp does the shading. Eyes, noses, combs
// and other accents stay under 5 cubes so they keep their exact colour.
import { grid } from '../voxel.js';
import { INK, pair, pairFront } from './kit.js';

const black = 0x3d3a46, white = 0xf6efe4, tongue = 0xe8788f, tRed = 0xd0402e,
  ginger = 0xd0783e, gingerLt = 0xeaa064, gingerDk = 0x8e4a28, horn = 0xf3ead8, hornTip = 0xb09670, muzzle = 0xf0b8a8,
  chestnut = 0xc0683a, kGrey = 0x8e93b0, buff = 0xf3dcae, beak = 0xf2c04a,
  grouse = 0xa04c32, grouseDk = 0x5e2c22, wattle = 0xe8403a, feather = 0xfbf8f2, heather = 0xb070b8,
  moss = 0x6aa257, grass = 0x86b862,
  wood = 0x8a5a3c, woodLt = 0xb07a3a, iron = 0x4a4652, hutGreen = 0x56826a, tin = 0xc4c8d6,
  lamp = 0xf6c84a, brass = 0xe0b04a, marten = 0x9a5a34, martenDk = 0x5e3626, bib = 0xf2d79a,
  stone = 0xb0aaa2, stoneDk = 0x77716c, wool = 0xf6f1e6, face = 0x4a4250;

export default [
  // a border collie sitting up to attention, facing you: a black coat with
  // the white collar, chest, legs, blaze and muzzle of the breed, its ears
  // folded over at the sides, a long white snout with the tongue out,
  // a red neckerchief, and the white-tipped tail wrapped round its paws
  (() => {
    const g = grid(7, 10, 8);
    g.box([1, 5], [0, 2], [0, 3], black);                                                 // the haunches
    g.box([1, 5], [3, 4], [1, 3], black);                                                 // the body, upright
    g.box([1, 5], [5, 5], [1, 3], white);                                                 // the white collar
    g.box([1, 5], [3, 4], [4, 4], white).box([2, 4], [0, 2], [4, 4], white);              // the white chest and front legs
    pair(g, 2, 0, 5, white);                                                              // front paws
    g.box([1, 5], [5, 5], [4, 4], tRed).box([2, 4], [5, 5], [5, 5], tRed).set(3, 4, 5, tRed);   // the neckerchief, knotted in front
    g.box([1, 5], [6, 8], [2, 5], black).clear(1, 8, 5).clear(5, 8, 5);                  // the head
    g.box([1, 5], [6, 6], [5, 5], white).box([3, 3], [7, 8], [5, 5], white);              // the white muzzle and blaze
    g.box([2, 4], [6, 6], [6, 6], white).set(3, 7, 6, white).set(3, 6, 7, white).set(3, 7, 7, INK);   // the long snout, nose at the tip
    g.set(3, 5, 6, tongue);                                                               // tongue out
    pairFront(g, 2, 7, INK);                                                              // eyes
    pair(g, 1, 9, 3, black); pair(g, 1, 9, 4, black); pair(g, 0, 9, 4, black); pair(g, 0, 8, 4, black);   // ears up, the tips folded over
    g.box([6, 6], [0, 0], [1, 4], black).set(6, 0, 5, white).set(5, 0, 5, white);        // the tail round the paws
    return g.entry({ id: 'cand-p15-collie', name: 'Sheepdog', story: 'Nobody ever told it how many sheep there are. It counts them anyway.' });
  })(),

  // a highland cow facing you: a shaggy ginger coat that hangs in tufts
  // below the belly, a paler fringe over the eyes, a pink muzzle, and wide
  // cream horns turning up at the tips
  (() => {
    // 9x8x6: the body is a cube shorter than the first cut and the tail is
    // gone, so a phone's chisels stay under 300; the face, fringe and horn
    // span are unchanged
    const g = grid(9, 8, 6);
    g.box([2, 6], [2, 5], [0, 3], ginger);                                                // the shaggy body
    for (const [x, z] of [[3, 0], [5, 0], [3, 3], [5, 3], [2, 1], [6, 1]]) g.set(x, 1, z, ginger);   // the coat hanging in tufts
    for (const [x, z] of [[2, 0], [6, 0], [2, 3], [6, 3]]) g.box([x, x], [0, 1], [z, z], gingerDk);   // legs
    g.box([3, 5], [2, 5], [4, 5], ginger);                                                // the head
    g.box([3, 5], [2, 3], [5, 5], muzzle).set(3, 2, 5, INK).set(5, 2, 5, INK);            // the muzzle, nostrils
    g.box([2, 6], [5, 6], [5, 5], gingerLt);                                              // the fringe
    g.box([3, 5], [6, 6], [4, 4], gingerLt).set(4, 7, 5, gingerLt).set(4, 7, 4, gingerLt);   // and its top-knot
    pairFront(g, 3, 4, INK);                                                              // eyes, just showing
    for (const [x, y] of [[2, 5], [1, 5], [0, 5], [0, 6]]) pair(g, x, y, 4, x === 0 && y === 6 ? hornTip : horn);   // the horns
    return g.entry({ id: 'cand-p15-highland-cow', name: 'Highland Cow', story: "It can't see a thing through that fringe, and it doesn't seem to mind." });
  })(),

  // a kestrel on a fence post, facing you: a slate-grey head with a dark
  // moustache under each eye, a buff breast, chestnut wings folded at the
  // sides, yellow feet gripping the post, the grey tail hanging behind
  (() => {
    const g = grid(5, 10, 6);
    g.box([1, 3], [0, 2], [1, 3], wood);                                                  // the post
    g.box([1, 3], [3, 6], [1, 3], chestnut);                                              // the body
    g.box([1, 3], [4, 6], [4, 4], buff).set(2, 3, 4, buff);                               // the breast
    for (const x of [0, 4]) g.box([x, x], [3, 6], [1, 3], chestnut).clear(x, 6, 3);       // folded wings
    g.box([1, 3], [7, 9], [1, 4], kGrey).clear(1, 9, 1).clear(3, 9, 1);                   // the head
    g.set(2, 7, 4, buff);                                                                 // the pale throat
    pair(g, 1, 8, 4, INK); pair(g, 1, 7, 4, INK);                                         // eyes and moustache
    g.set(2, 8, 5, beak);                                                                 // the hooked beak
    pair(g, 1, 2, 4, beak);                                                               // feet over the edge
    g.box([2, 2], [2, 5], [0, 0], kGrey);                                                 // the tail
    return g.entry({ id: 'cand-p15-kestrel', name: 'Kestrel on a Post', story: 'It holds still in a gale better than the post does.' });
  })(),

  // a red grouse in the heather, facing you: a round chestnut bird with a
  // scarlet comb over each eye, white feathered feet, a dark tail behind,
  // sat on a mound of purple heather
  (() => {
    const g = grid(7, 7, 7);
    g.ellipsoid([3, 0, 3], [3.4, 1.2, 3.4], heather);                                     // the heather
    for (const [x, z] of [[1, 5], [0, 3]]) pair(g, x, 1, z, heather);                     // and its tufts
    g.ellipsoid([3, 2.8, 3], [2.4, 1.9, 2.3], grouse);                                    // the round body
    g.box([2, 4], [4, 6], [3, 5], grouse);                                                // the head
    g.set(3, 4, 6, beak);                                                                 // the beak
    pairFront(g, 2, 4, INK);                                                              // eyes
    pair(g, 2, 5, 5, wattle); pair(g, 2, 5, 4, wattle);                                   // a scarlet comb over each eye
    g.box([2, 4], [3, 4], [0, 0], grouseDk);                                              // the tail
    pair(g, 2, 1, 5, feather);                                                            // feathered feet
    return g.entry({ id: 'cand-p15-grouse', name: 'Red Grouse', story: 'It tells everyone on the moor to go back, go back. Nobody does.' });
  })(),

  // a shepherd's hut on iron wheels: green walls, a curved tin roof, a
  // stovepipe, a lit window, and a stable door at the end up two steps
  (() => {
    const g = grid(9, 9, 6);
    g.box([1, 7], [2, 5], [1, 4], hutGreen);                                              // the walls
    g.box([1, 7], [1, 1], [1, 4], iron);                                                  // the chassis
    g.box([0, 8], [6, 6], [0, 5], tin).box([0, 8], [7, 7], [2, 3], tin);                  // the curved roof
    for (const x of [2, 6]) for (const z of [0, 5]) {                                     // the iron wheels
      g.set(x - 1, 1, z, iron).set(x + 1, 1, z, iron).set(x, 0, z, iron).set(x, 2, z, iron).set(x, 1, z, iron);
    }
    g.box([2, 2], [7, 8], [2, 2], iron);                                                  // the stovepipe
    g.box([4, 5], [3, 4], [4, 4], lamp);                                                  // the lit window
    g.box([7, 7], [2, 4], [2, 3], woodLt).set(7, 3, 3, brass);                            // the door
    g.box([8, 8], [0, 1], [2, 3], woodLt).clear(8, 1, 2);                                 // the steps
    return g.entry({ id: 'cand-p15-shepherds-hut', name: "Shepherd's Hut", lit: { keep: [lamp] }, story: 'Wheels, a stove and a bed. In lambing season, the best house on the hill.' });
  })(),

  // a shepherd's crook stuck in a tussock, its lantern hung close under the
  // hook: a dark iron frame round four lit panes, a brass cap and base. The lamp is kept
  // flat (lit keep) so it glows rather than shades
  (() => {
    const g = grid(4, 10, 3);
    g.box([0, 1], [0, 0], [0, 2], moss).set(0, 1, 0, moss).set(0, 1, 2, moss);         // the tussock
    g.box([0, 0], [1, 9], [1, 1], woodLt);                                                // the staff
    g.set(1, 9, 1, woodLt).set(2, 9, 1, woodLt).set(2, 8, 1, woodLt);                    // the hook
    g.set(2, 7, 1, iron);                                                                 // the ring
    g.box([1, 3], [6, 6], [0, 2], brass);                                                 // the brass cap
    g.box([1, 3], [3, 5], [0, 2], (x, y, z) => (x !== 2 && z !== 1 ? iron : lamp));       // the frame round the lit panes
    g.box([1, 3], [2, 2], [0, 2], brass);                                                 // and base
    return g.entry({ id: 'cand-p15-crook-lantern', name: 'Crook & Lantern', fraction: 0.7, lit: { keep: [lamp] }, story: 'It hooked a lamb out of a ditch, then held the light for the walk home.' });
  })(),

  // a pine marten sat up on a milestone, facing you: a chestnut coat, a
  // cream bib up to the chin, round pale-rimmed ears, dark paws on the top
  // of the stone, the bushy dark tail hanging down its side; the stone worn
  // round, moss on top, its number cut in the front
  (() => {
    const g = grid(7, 10, 6);
    g.box([1, 5], [0, 3], [1, 4], stone);                                                 // the milestone
    for (const [x, z] of [[1, 1], [5, 1], [1, 4], [5, 4]]) g.clear(x, 3, z);             // worn round on top
    g.box([1, 5], [3, 3], [1, 4], (x, y, z) => (g.get(x, y, z) ? moss : 0));               // moss on top
    g.box([2, 2], [1, 2], [4, 4], stoneDk).box([4, 4], [1, 2], [4, 4], stoneDk);          // its number, cut in: II
    g.box([2, 4], [4, 5], [1, 3], marten);                                                // the haunches
    g.box([2, 4], [6, 6], [2, 3], marten);                                                // the body
    g.box([3, 3], [4, 6], [4, 4], bib).box([2, 4], [6, 6], [3, 3], bib);                  // the cream bib
    pair(g, 2, 4, 4, martenDk);                                                           // front paws
    g.box([1, 5], [7, 8], [2, 4], marten);                                                // the head, wide and round
    g.clear(1, 8, 2).clear(5, 8, 2);
    g.box([2, 4], [7, 7], [4, 4], bib).set(3, 7, 5, martenDk);                            // chin and snout
    pairFront(g, 2, 8, INK);                                                              // eyes
    pair(g, 1, 9, 3, marten); pair(g, 1, 9, 4, bib);                                      // round ears, pale rims
    g.set(5, 4, 2, martenDk);                                                             // the tail, hanging down
    g.box([6, 6], [1, 4], [2, 3], martenDk).set(6, 0, 2, martenDk);
    return g.entry({ id: 'cand-p15-pine-marten', name: 'Pine Marten', story: 'It sits on the milestone as if it had put it there.' });
  })(),

  // a round drystone sheepfold: a ring of stones laid without mortar in
  // two greys, each course offset from the one below, a wooden hurdle
  // across the gap, and one black-faced ewe inside, looking out at you over
  // it. The stones are the pattern, so the light is softened (span 2)
  (() => {
    const g = grid(9, 4, 9);
    g.cylinder('y', [4, 4], 4.4, [0, 0], grass);                                          // the turf
    g.cylinder('y', [4, 4], 4.4, [1, 2], (x, y, z) =>                                    // the wall, in courses
      (Math.floor((Math.atan2(z - 4, x - 4) / Math.PI + 1) * 4 + (y % 2) / 2) % 2 ? stone : stoneDk));
    g.cylinder('y', [4, 4], 3.3, [1, 2], 0);
    g.box([3, 5], [1, 3], [7, 8], 0);                                                     // the gap
    g.box([3, 5], [1, 2], [8, 8], (x, y) => (y === 2 || x !== 4 ? woodLt : 0));          // the hurdle
    g.box([2, 5], [1, 2], [2, 4], wool);                                                  // the ewe
    g.box([3, 4], [2, 3], [5, 5], face);                                                  // her black face
    g.set(2, 3, 5, face).set(5, 3, 5, face);                                              // her ears
    g.set(3, 3, 5, white).set(4, 3, 5, white);                                            // eyes catching the light
    return g.entry({ id: 'cand-p15-sheepfold', name: 'Drystone Sheepfold', fraction: 0.5, lit: { span: 2 }, story: 'No mortar. Every stone was chosen to sit on the one below.' });
  })(),
];
