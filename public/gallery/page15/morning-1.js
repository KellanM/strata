// Page 15 · IV First Light, Again: replacements for two levels in chapter I,
// First Light ("Morning finds what the stone was keeping."). The first three
// are for level 14 (Fried Egg's slot: small and low, about 86 cubes, D near
// 10); the last three for level 15 (Kitten in a Box's slot: chunkier, about
// 138 cubes, D 10-13, the last level before the Teapot). Each follows
// Kellan's favourites (Pegasus Foal, Origami Fox, Meerkat Lookout): one clear
// silhouette from the iso corner, a little moment, bold blocks of colour and
// a face where there is one. Faces and details look toward +x / +z.
// Sky: Dawn.
import { grid } from '../voxel.js';
import { INK, BLUSH, pair, tint, flank, lathe } from './kit.js';

// Flat material colours: the game's light (lit() in shapes.js) does the shading.
const coat = 0xf6f0e4, tan = 0xd99a5c, paper = 0xc3c8d0,
  hen = 0xfbf8f2, henDk = 0xe2d8c6, comb = 0xe0434b, beak = 0xf2b33d, straw = 0xe2bf62,
  egg = 0xb87a4e, batter = 0xf0c060, syrup = 0xa4552a, butter = 0xfbf0c0,
  berry = 0xe0434b, leaf = 0x5fae6e, sill = 0xf6efe4, pane = 0xa9d4ee,
  cushion = 0xe2728f, ginger = 0xf2a85a, gingerDk = 0xc9702e, gingerLt = 0xfbe0bc, pot = 0xc8704b,
  stone = 0xb4aca0, milk = 0xfbf8f2, foil = 0x9aa6b4, foilGold = 0xe9b949,
  robin = 0x9a6a48, robinDk = 0x6b4a3a, robinRed = 0xf07a3a, wood = 0x9a6440, woodLt = 0xc08a5a,
  brass = 0xe9b949, brassDk = 0xb8862e, mouse = 0xb8b0c4, mouseLt = 0xe6e0ee, bean = 0x4a2e22, pinkEar = 0xf4a3b5;

export default [
  // [slot 14] a terrier facing you with the morning paper held crossways in
  // its mouth, the roll sticking out both sides, floppy tan ears, tail up
  (() => {
    // Flat materials: white coat, tan patches, grey newsprint (darker than the
    // coat so the two don't merge once lit). The face is just two eyes and a
    // nose; the muzzle shade, the rubber band and the dark roll ends are gone.
    const g = grid(9, 7, 6);
    g.box([3, 5], [1, 2], [0, 2], coat);                                                 // the body
    tint(g, (x, y, z) => y === 2 && z <= 1, tan);                                        // a tan saddle
    for (const x of [3, 5]) for (const z of [0, 2]) g.set(x, 0, z, coat);              // four legs
    g.set(4, 3, 0, coat).set(4, 4, 0, tan);                                              // the tail, up
    g.box([2, 6], [3, 5], [2, 4], coat);                                                 // the head
    pair(g, 1, 5, 3, tan); pair(g, 1, 4, 3, tan);                                        // floppy ears
    g.box([3, 5], [5, 5], [2, 4], tan);                                                  // a tan cap
    g.box([3, 5], [3, 3], [5, 5], coat).set(4, 3, 5, INK);                               // muzzle and nose
    pair(g, 2, 4, 4, INK);                                                               // eyes, set wide
    g.box([0, 8], [2, 2], [5, 5], paper).box([1, 7], [1, 1], [5, 5], paper);              // the rolled paper
    return g.entry({ id: 'cand-p15-paper-pup', name: 'Paper Pup', seed: 2, story: 'The paper comes at seven. He has been at the door since six.' });
  })(),

  // [slot 14] a white hen settled on her straw nest, red comb, yellow beak,
  // two brown eggs peeking out from under her at the front
  (() => {
    // One straw colour for the nest (it was checkered by hand); the light
    // turns the ring. Brown eggs sit darker than the straw so they show.
    const g = grid(8, 6, 7);
    g.cylinder('y', [3.5, 3], 3.2, [0, 0], straw);                                          // the nest
    g.cylinder('y', [3.5, 3], 3.2, [1, 1], straw).cylinder('y', [3.5, 3], 2.2, [1, 1], 0);
    g.ellipsoid([3, 2.2, 3], [2.4, 1.5, 1.9], hen);                                          // her body
    tint(g, (x, y, z) => y === 2 && (z === 1 || z === 5) && x >= 2 && x <= 3, henDk);        // folded wings
    g.box([0, 0], [3, 4], [2, 4], hen).set(0, 5, 3, hen);                                    // tail feathers
    g.box([5, 6], [3, 4], [2, 4], hen);                                                      // the head
    g.set(5, 5, 3, comb).set(6, 5, 3, comb);                                                 // comb
    g.set(7, 4, 3, beak).set(7, 3, 3, comb);                                                 // beak and wattle
    flank(g, 6, 4, INK);
    g.set(2, 1, 6, egg).set(4, 1, 6, egg);                                                   // eggs peeking out
    return g.entry({ id: 'cand-p15-broody-hen', name: 'Broody Hen', fraction: 0.5, seed: 2, story: 'She has been asked to move. She has declined.' });
  })(),

  // [slot 14] a waffle with its grid of pockets, a pat of butter melting in
  // the middle, syrup pooled in some squares and running down one side,
  // and one strawberry on the corner
  (() => {
    // One batter colour (the dark underside was hand shading); the grid of
    // pockets is the pattern, so it takes the softer light (span 2). Rounded
    // corners and a smaller pat bring the fill down.
    const g = grid(7, 4, 7);
    g.box([0, 6], [0, 1], [0, 6], (x, y, z) => (y === 1 && x % 2 && z % 2 ? 0 : batter));   // the pockets
    for (const x of [0, 6]) for (const z of [0, 6]) g.clear(x, 0, z).clear(x, 1, z);       // round corners
    for (const [x, z] of [[1, 5], [5, 5], [5, 1], [3, 5], [5, 3]]) g.set(x, 1, z, syrup);   // syrup pooled
    g.set(6, 1, 5, syrup).set(6, 0, 5, syrup).set(4, 1, 6, syrup).set(4, 0, 6, syrup);     // and running over
    g.set(3, 1, 3, butter).set(3, 2, 3, butter).set(2, 2, 3, butter).set(3, 2, 2, butter); // the butter, melting
    g.set(1, 2, 1, berry).set(1, 3, 1, leaf).set(0, 2, 1, berry).set(1, 2, 0, berry);       // a strawberry
    return g.entry({ id: 'cand-p15-waffle', name: 'Waffle', lit: { span: 2 }, story: 'Every square holds exactly as much syrup as you were going to pour.' });
  })(),

  // [slot 15] a ginger cat curled asleep on a pink cushion on the
  // windowsill, the dawn in the panes behind, a pot of herbs at the end
  (() => {
    // Four materials the light ramps: sill, glass, cushion, ginger. The hand
    // edging, the two-tone panes and the body stripes are gone; the darker
    // ginger is kept to four cubes (ear tips, tail rings) so it stays exact.
    const g = grid(7, 7, 6);
    g.box([0, 6], [0, 0], [0, 5], sill);                                                 // the sill
    g.box([0, 6], [1, 6], [0, 0], sill);                                                 // the window frame
    for (const x0 of [1, 4]) g.box([x0, x0 + 1], [2, 5], [0, 0], pane);                  // the panes, dawn behind
    g.box([0, 4], [1, 1], [1, 4], cushion);                                              // the cushion
    g.ellipsoid([2, 2.6, 2.4], [2.1, 1.2, 1.5], ginger);                                  // the cat, curled
    g.box([3, 5], [2, 4], [3, 4], ginger);                                               // the head, tucked in
    g.box([3, 5], [2, 2], [4, 4], gingerLt);                                             // white chin
    g.set(3, 5, 3, gingerDk).set(5, 5, 3, gingerDk);                                     // ears
    g.set(3, 3, 4, INK).set(5, 3, 4, INK).set(4, 2, 4, BLUSH);                           // closed eyes, nose
    g.box([0, 3], [1, 1], [5, 5], (x) => (x % 2 ? gingerDk : ginger));                   // the tail, round the front
    g.box([6, 6], [1, 2], [1, 2], pot);                                                  // the herb pot
    g.set(6, 3, 1, leaf).set(6, 3, 2, leaf).set(6, 4, 1, leaf);
    return g.entry({ id: 'cand-p15-windowsill-cat', name: 'Windowsill Cat', story: 'The sun reaches this cushion first. She has never once been late.' });
  })(),

  // [slot 15] two milk bottles left on the doorstep, and a robin balanced
  // on the taller one's foil cap, red breast out, very pleased with itself
  (() => {
    // A milk bottle, not a pillar: a square body, rounded shoulders stepping
    // in to the neck, and a foil cap. Four materials the light ramps (stone,
    // milk, robin brown, robin red); foil, tail, eyes and beak are exact
    // accents. (A glass neck under the cap lifted the robin onto a stalk.)
    const g = grid(7, 9, 6);
    g.box([0, 6], [0, 0], [0, 5], stone);                                                  // the step
    const bottle = (cx, cz, h, cap) => {
      g.box([cx - 1, cx + 1], [1, h], [cz - 1, cz + 1], milk);                             // the body
      g.box([cx - 1, cx + 1], [h + 1, h + 1], [cz, cz], milk).box([cx, cx], [h + 1, h + 1], [cz - 1, cz + 1], milk);   // shoulders
      g.set(cx, h + 2, cz, cap);                                                         // the foil cap
    };
    bottle(2, 2, 3, foil);
    bottle(5, 4, 2, foilGold);
    g.ellipsoid([2, 7.0, 2], [1.5, 1.3, 1.5], robin);                                       // the robin, on the cap
    tint(g, (x, y, z) => y >= 6 && y <= 7 && (z === 3 || x === 3), robinRed);               // its red breast
    g.set(1, 8, 2, INK).set(3, 8, 2, INK);                                                 // eyes
    g.set(2, 7, 4, beak);                                                                  // beak
    g.set(2, 7, 0, robinDk).set(2, 8, 0, robinDk);                                         // its tail, cocked up
    return g.entry({ id: 'cand-p15-doorstep-robin', name: 'Doorstep Robin', story: 'The milk comes at six. The robin comes at five past.' });
  })(),

  // [slot 15] a wooden coffee grinder, drawer shut and brass crank at
  // its side, and a mouse sitting in the bowl on top, hugging the best bean
  (() => {
    const g = grid(7, 9, 7);
    g.box([1, 5], [0, 2], [1, 5], wood);                                                   // the box (one wood; the light darkens its foot)
    g.box([2, 4], [1, 1], [5, 5], woodLt).set(3, 1, 6, brass);                             // the drawer and its knob
    g.box([1, 5], [3, 3], [1, 5], brassDk);
    lathe(g, [3, 3], 4, [2.2, 2.4], brass).cylinder('y', [3, 3], 1.5, [5, 5], 0);          // the brass bowl
    g.set(6, 2, 3, brassDk).set(6, 3, 3, brassDk).set(6, 4, 3, brassDk).set(6, 4, 4, woodLt);   // the crank
    g.box([2, 4], [4, 6], [2, 4], mouse);                                                  // the mouse
    for (const x of [1, 4]) g.box([x, x + 1], [7, 8], [3, 3], mouse);                      // big round ears
    pair(g, 1, 7, 3, pinkEar);
    pair(g, 2, 6, 4, INK);                                                                 // eyes
    pair(g, 2, 5, 5, mouseLt);                                                             // paws
    g.set(3, 5, 5, bean).set(3, 6, 5, pinkEar);                                            // the bean, the nose
    return g.entry({ id: 'cand-p15-grinder-mouse', name: 'Grinder Mouse', story: 'Somebody got to the beans first, and he is not sorry.' });
  })(),
];
