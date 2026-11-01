// Page 18 · IV Days of the Year: daily stones, one for a season, a weather
// or a day worth marking. Each comment names the date it suits, so the daily
// can schedule it. Palette: Autumn (a mauve-to-amber sky, so bodies lean
// away from amber: green, mint, brick, chocolate, black and white).
// Daily rules: never a level or gallery object, D 9.5-12.0, 90-180 taps
// (trimmed block minus cubes), no side over 10, one piece.
//
// Silhouette first. Each idea as name / identity feature that sets the
// outline / the moment / colour parts, then what became of it:
//  kept  Lovebirds        two heads meeting beak to beak, V notch above   the kiss            green, rosy face, red beaks
//  kept  Melted Snowman   carrot and coal eyes on a slumped lump           the first warm day  snow, puddle blue, hat
//  kept  Chocolate Bunny  tall ears in profile, the near one bitten        someone started     chocolate, red ribbon
//  kept  Ice Cream Van    a giant cone on the roof                          the chimes          mint, pink, wheels
//  kept  Black Cat        arched back, tail up, ears, on a pumpkin         bristling           black, pumpkin orange, gold eyes
//  kept  Nutcracker       tall black shako over a white beard               at attention        red coat, black hat, white
//  kept  Santa's Boots    two boots sticking up out of a chimney           stuck, again        brick, snow, red, black
//  kept  Party Guinea Pig a party hat on a sleeping loaf                    the morning after   ginger, cream, blue hat
//  cut   Ducklings in a Row  built twice: at 40 px the mother's eye read as an ear and the
//                         ducklings as pegs; and page 18's Rubber Duck is yellow with an orange bill
//  cut   Swan & Cygnets   built: the bill swamped the head and the cygnets read as a bowl
//  cut   Snow Rabbit      built three ways: the leaf ears read as a radish's leaves; and Rabbit in a Hat
//  cut   Wheat Sheaf      built: read as a teddy bear at 40 px
//  cut   Present          built: a cube in a game of cubes; the peeking eyes never showed
//  cut   Apple Basket     built: the handle framed it like a picture; D 15.5
//  cut   Gingerbread House built: read as a snowy cottage; a third December stone
//  cut   Sun Hat          built: reads, but it is a hat on its own; no moment
//  out   Mitten, Sandcastle, Cherry Blossom, Kite, Tulip pot: Mittens, Sandcastle, Cherry
//        Blossom, Kite and Tulips exist
//  out   Heart box of chocolates  the Heart's outline
//  out   Paper Crane      Crane exists, and its open wings are Pegasus Foal's
//  out   Birthday Cake    Layer Cake, Cake Slice and Cupcake own it
//  out   Frog under an umbrella   the canopy hides the frog from the game corner
//  out   Frog in a Welly  a boot is solid: about 50 taps
//  out   Flamingo Float, Witch Hat, Maple Leaf  a flat ring, a tall cone, a flat leaf: 230+, 350, 35 taps
//  out   Lantern, Dragon (lunar new year)  Chochin, Paper Lantern and Dragon Head exist
//  out   Christmas Tree   Pine's outline
//  out   Leaf-pile Hedgehog  Hedgehog exists
// Faces and details look toward +z / +x.
// Flat material colours: the game's light does the shading.
import { grid } from '../voxel.js';
import { INK, pairZ, tint, front, out, sheet } from './kit.js';

const leafGreen = 0x5fb35a, rosy = 0xf6a07a, beakRed = 0xd8423e, twig = 0x7a5238, tailBlue = 0x4a7fd0,
  snow = 0xfbfbfd, melt = 0x9fd0ec, hatBlack = 0x2e2b36, carrot = 0xf08a2a,
  choc = 0x8a5236, bow = 0xd8343c, bell = 0xf2c14e,
  mint = 0x9fdcc4, cone = 0xd9a05a, scoop = 0xf49ab4, tyre = 0x3a3442, glass = 0xcfe9f7,
  catBlack = 0x34303d, catEye = 0xe6e04a, pumpkin = 0xec7f2a,
  coat = 0xd8343c, shako = 0x2e2b36, beard = 0xfbf8f2, skin = 0xf4c9a4, gold = 0xf2c14e,
  brick = 0x9c4a3a, icing = 0xfbf8f2, soot = 0x3a2a33, santa = 0xe0343c, boot = 0x2e2b36,
  ginger = 0xe08a3e, cream = 0xfbf3e4, partyHat = 0x4a8fe0, pompom = 0xf6d14a;

export default [
  // [Feb 14, Valentine's Day] Lovebirds. Identity: two heads meeting beak to
  // beak over a branch, the V notch between the crowns. Moment: the kiss.
  // Parts: green birds, rosy faces, red beaks, a blue tail; the branch below.
  // Drawn in profile on the front face so both faces show from the game corner.
  (() => {
    const g = grid(10, 7, 3);
    g.box([0, 9], [0, 0], [1, 2], twig);                                                // the branch
    sheet(g, [
      '..hh.',
      '.hff.',
      '.hff.',
      'gggg.',
      'gggg.',
      '.gg..',
    ], [0, 2], { h: leafGreen, f: rosy, g: leafGreen }, 0, 1);                          // the bird, in profile
    g.set(0, 2, 1, tailBlue).set(0, 1, 1, tailBlue).clear(0, 2, 0).clear(0, 2, 2);      // a blue tail
    for (const [x, y] of [[1, 1], [2, 1], [0, 3], [0, 4], [1, 6], [2, 6], [3, 6], [1, 4], [1, 5]]) g.clear(x, y, 0);
    g.clear(3, 6, 2).clear(1, 1, 2);                                                    // rounded off
    g.set(4, 5, 1, beakRed).set(4, 4, 1, beakRed);                                      // the beak
    g.set(2, 5, 2, INK);                                                                // the eye
    g.mirror('x');                                                                      // and her partner
    return g.entry({ id: 'cand-p18-lovebirds', name: 'Lovebirds', story: 'One branch, all winter, and they still have plenty to say.' });
  })(),

  // [about Mar 20, the spring equinox, or the first warm day] Melted Snowman.
  // Identity: a carrot nose and two coals on a slumped white lump. Moment:
  // the thaw, his hat pushed back, his arms in the puddle. Parts: snow,
  // meltwater, a black hat; carrot, coal and twigs as accents.
  (() => {
    const g = grid(7, 6, 6);
    g.cylinder('y', [3, 2.5], 3.3, [0, 0], melt);                                       // the puddle
    g.ellipsoid([3, 0.6, 2.5], [2.4, 2.9, 2.2], snow);                                  // what is left of him
    g.box([2, 4], [3, 3], [0, 1], hatBlack).box([2, 3], [4, 4], [0, 1], hatBlack);       // the hat, pushed back
    front(g, 3, 2, carrot); out(g, 3, 2, carrot);                                       // the carrot
    front(g, 2, 3, INK); front(g, 4, 3, INK);                                           // two coals
    g.set(0, 1, 2, twig).set(6, 1, 3, twig);                                            // his arms, in the water
    return g.entry({ id: 'cand-p18-melted-snowman', name: 'Melted Snowman', story: 'He had a good winter. The carrot was always going to outlast him.' });
  })(),

  // [Easter Sunday: 28 Mar 2027, 16 Apr 2028] Chocolate Bunny. Identity: the
  // tall ears in profile, the near one bitten short. Moment: someone has
  // started. Parts: one chocolate, a red ribbon and a gold bell. It is hollow
  // inside, as they always are: the carving finds that out.
  (() => {
    const g = grid(7, 10, 3);
    sheet(g, [
      '...hhh.',
      '..hhhhh',
      '.bbbhh.',
      'bbbbbb.',
      'bbbbbb.',
      'bbbbbb.',
      '.bbbbbb',
    ], [0, 2], { h: choc, b: choc });                                                   // the bunny, in profile
    g.box([1, 4], [1, 3], [1, 1], 0).set(1, 3, 1, choc);                                // hollow
    for (const [x, y] of [[4, 7], [5, 7], [4, 8], [5, 8], [4, 9]]) g.set(x, y, 0, choc); // the far ear, whole
    for (const [x, y] of [[4, 7], [5, 7], [4, 8]]) g.set(x, y, 2, choc);                // the near ear, bitten
    g.box([3, 3], [4, 4], [0, 2], bow).set(4, 4, 2, bell);                              // ribbon and bell
    g.set(5, 5, 2, INK).set(5, 5, 0, INK);                                              // eyes
    return g.entry({ id: 'cand-p18-chocolate-bunny', name: 'Chocolate Bunny', story: 'Someone started at the ears. Someone always starts at the ears.' });
  })(),

  // [the first hot weekend: Jul-Aug in the north, Dec-Jan in the south]
  // Ice Cream Van. Identity: the giant cone on the roof. Moment: the hatch
  // open, the chimes going. Parts: mint body, pink scoop and awning, dark
  // hatch and wheels.
  (() => {
    const g = grid(8, 9, 4);
    for (const x of [1, 5]) for (const z of [0, 3]) g.box([x, x + 1], [0, 0], [z, z], tyre);   // wheels
    g.box([0, 5], [1, 4], [0, 3], mint);                                                // the body
    g.box([6, 7], [1, 2], [0, 3], mint).box([6, 6], [3, 3], [0, 3], glass);              // the cab, windscreen
    g.box([1, 4], [3, 3], [3, 3], tyre).box([1, 4], [4, 4], [3, 3], scoop);              // the hatch, its awning
    g.box([2, 3], [5, 5], [1, 2], cone).box([2, 3], [6, 7], [1, 2], scoop).set(2, 8, 1, scoop);   // the cone on the roof
    return g.entry({ id: 'cand-p18-ice-cream-van', name: 'Ice Cream Van', fraction: 0.7, story: 'It plays one tune all summer. Nobody has ever asked it to stop.' });
  })(),

  // [Oct 31, Halloween] Black Cat. Identity: the arched back, the tail
  // straight up and two ear points, black on orange. Moment: bristling on a
  // pumpkin. Parts: black cat, pumpkin; gold eyes.
  (() => {
    const g = grid(7, 8, 5);
    g.ellipsoid([3, 1, 2], [3.6, 2.0, 2.8], pumpkin);                                   // the pumpkin
    for (const x of [1, 4]) for (const z of [1, 3]) g.box([x, x], [3, 4], [z, z], catBlack);   // stiff legs
    g.box([1, 1], [5, 6], [1, 3], catBlack).box([4, 4], [5, 6], [1, 3], catBlack)
      .box([2, 3], [6, 7], [1, 3], catBlack);                                           // the back, arched
    g.box([5, 6], [4, 6], [1, 3], catBlack).clear(5, 6, 1).clear(5, 6, 3).clear(6, 4, 1).clear(6, 4, 3);   // the head, low
    g.set(6, 7, 1, catBlack).set(6, 7, 3, catBlack);                                    // ears
    g.set(6, 5, 1, catEye).set(6, 5, 3, catEye);                                        // eyes
    g.box([0, 0], [5, 7], [2, 2], catBlack);                                            // the tail, straight up
    return g.entry({ id: 'cand-p18-black-cat', name: 'Black Cat', fraction: 0.5, story: 'One night a year everyone expects it. It intends to be worth it.' });
  })(),

  // [early December, Advent] Nutcracker. Identity: the tall black shako
  // over a white beard and a square jaw. Moment: standing to attention.
  // Parts: red coat, black hat and boots, white beard, hair and trousers;
  // gold band, epaulettes and buckle.
  (() => {
    const g = grid(5, 10, 4);
    for (const x of [1, 3]) g.box([x, x], [0, 0], [1, 3], shako).box([x, x], [1, 1], [1, 2], beard);   // boots, trousers
    g.box([1, 3], [2, 4], [1, 2], coat).box([0, 4], [4, 4], [1, 2], coat);              // the coat
    g.box([0, 0], [2, 3], [1, 2], coat).box([4, 4], [2, 3], [1, 2], coat);              // arms at his sides
    g.set(0, 4, 2, gold).set(4, 4, 2, gold).set(2, 3, 3, gold);                         // epaulettes, buckle
    g.box([1, 3], [5, 6], [1, 3], skin);                                                // the head
    g.box([1, 3], [5, 5], [3, 3], beard).box([1, 3], [4, 6], [0, 0], beard);            // the beard, the hair behind
    g.set(0, 5, 2, beard).set(4, 5, 2, beard).set(0, 6, 2, beard).set(4, 6, 2, beard);  // and at the sides
    g.set(1, 6, 3, INK).set(3, 6, 3, INK);                                              // eyes
    g.box([1, 3], [7, 7], [1, 3], gold).box([1, 3], [8, 9], [1, 3], shako);             // the shako
    return g.entry({ id: 'cand-p18-nutcracker', name: 'Nutcracker', fraction: 0.8, story: 'He guards the mantelpiece every December. Nobody has ever handed him a nut.' });
  })(),

  // [Dec 24, Christmas Eve] Santa's Boots. Identity: two black boots
  // sticking up out of a chimney. Moment: stuck, again. Parts: brick
  // chimney, snow on the rim, red trousers; black boots. Hollow down to the
  // soot.
  (() => {
    const g = grid(5, 10, 5);
    g.box([0, 4], [0, 4], [0, 4], brick).box([1, 3], [1, 4], [1, 3], 0);                // the chimney, hollow
    g.box([0, 4], [4, 4], [0, 4], icing).box([1, 3], [4, 4], [1, 3], 0);                // snow on the rim
    g.box([1, 3], [3, 3], [1, 3], soot);                                                // the soot
    for (const x of [1, 3]) g.box([x, x], [4, 6], [2, 2], santa).set(x, 7, 2, icing).set(x, 8, 2, boot).set(x, 8, 3, boot);   // legs, cuffs, boots
    return g.entry({ id: 'cand-p18-santa-boots', name: "Santa's Boots", story: 'Every year the chimneys get narrower. Every year he tries anyway.' });
  })(),

  // [Jan 1, New Year's Day] Party Guinea Pig. Identity: a party hat with a
  // pompom on a loaf-shaped guinea pig. Moment: the morning after, fast
  // asleep. Parts: ginger back, cream face, blue hat; gold pompom, eyes shut.
  (() => {
    const g = grid(7, 6, 5);
    g.ellipsoid([3, 0.6, 2], [3.4, 2.5, 2.4], ginger);                                  // the loaf
    tint(g, (x) => x >= 4, cream);                                                      // a cream face
    g.set(3, 3, 1, ginger).set(3, 3, 3, ginger);                                        // ears
    pairZ(g, 5, 2, 1, INK); pairZ(g, 4, 2, 1, INK);                                     // eyes, shut
    g.box([4, 6], [3, 3], [1, 3], partyHat).clear(4, 3, 1).clear(4, 3, 3).clear(6, 3, 1).clear(6, 3, 3);
    g.set(5, 4, 2, partyHat).set(5, 5, 2, pompom);                                      // the party hat
    return g.entry({ id: 'cand-p18-party-guinea-pig', name: 'Party Guinea Pig', fraction: 0.8, story: 'It saw the new year in. It has not seen much since.' });
  })(),
];
