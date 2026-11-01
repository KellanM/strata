// Page 18 · I Known Anywhere: daily stones, things anyone on earth can name
// at a glance. They sit at the top of the funnel: a stranger plays one from a
// shared link, so each is a universal object given a face, a pose or a small
// story. Palette: Dawn (a rose sky over an apricot horizon, so bodies lean
// bold: yellow, mint, sky blue, black and white). Every entry is in the daily
// band (judge() in public/js/daily.js: D 9.5-12, 90-180 chisels, 4-10 waves),
// with fraction and seed written out so the gallery and the daily agree.
//
// Silhouette first. Each idea as name / identity feature that sets the
// outline / the moment / colour parts:
//  kept  Rubber Duck      big head on a round body, beak forward    afloat, tail flicked up     yellow, orange beak, bath blue
//  kept  Piggy Bank       a round body on four stubs, ears forward  a coin half in the slot     pink, deep pink snout, gold coin
//  kept  Hamburger        the stack, cheese corners poking out      one bite already gone       bun, patty, cheese, lettuce
//  kept  Instant Camera   a box with one big round lens             the photo sliding out       mint, black lens, white photo
//  kept  Holiday Car      a bubble cabin over four wheels           a suitcase on the roof      sky blue, glass, tan case
//  kept  Milkshake        a flared soda glass, a straw breaking out the cherry on top           strawberry pink, cream, cherry
//  kept  Rabbit in a Hat  a top hat upturned, two ears out of it    peeking over the brim       black hat, red band, white rabbit
//  kept  Gumball Machine  a glass ball on a red stand               one gumball paid out        red, glass, sweets as accents
//  out   Telephone        the handset bridged over the cradle       drawn twice: at 7 wide the handset reads as a staple, the dial as an eye
//  out   Rocking Horse    the curved rockers, legs flung out        drawn three times: 3 deep, the head and neck merge and it reads as a puppy on a sled
//  out   Television       a box with rabbit-ear aerials             the camera already owns box-with-a-thing-on-top
//  out   Popcorn          a striped tub, overflowing                stripes and a lumpy top; no face, no moment
//  out   Pizza Slice      a wedge, the tip drooping                 flat: at the game's angle a triangle of noise, and too few chisels
//  out   Magnet           a red U with silver tips                  a letter, not a thing anyone loves
//  out   Gift Box         a box with a bow                          a cube in a game of cubes (and Days of the Year has a Present)
//  out   Banana           a curve, half peeled                      thin peel strips: 1-thick shafts and 230 chisels
//  out   Bicycle          two wheels                                the wheels are holes, and holes fill in at this size
//  taken Hot-Air Balloon, Cupcake, Snow Globe, Paper / Beach Umbrella, Paper Boat,
//        Watermelon, Piano, Alarm Clock, Toadstool Cottage, Teapot, Kettle, Light Bulb
// Faces and details look toward +z / +x.
import { grid } from '../voxel.js';
import { INK, onSurface, pair, tint } from './kit.js';

// Flat material colours: the game's light does the shading.
const duck = 0xf7cf3a, beak = 0xf0782a, bath = 0x63b4e0, suds = 0xfbf8f2,
  pig = 0xf28aa6, snout = 0xd9607f, nostril = 0x9a3a56, coin = 0xf2c13d,
  bun = 0xd9914a, patty = 0x6b3e2c, cheese = 0xf8cf3e, lettuce = 0x6dbb48, seed = 0xfbf1d6,
  mint = 0x7fcfbd, lens = 0x34303c, glass = 0xd6eefa, photo = 0xfbf8f2, shot = 0x5b8fd6, button = 0xe0434b,
  car = 0x5fa6e0, window = 0xd3ecf8, tyre = 0x34303c, lamp = 0xfff0a8, case_ = 0xb9773f, strap = 0x6b4a3a, chrome = 0xc9d1d9,
  shake = 0xf48fb1, cream = 0xfbf8f2, cherry = 0xd8263c, glassFt = 0xcfe6ef, straw = 0x4f8fdc, strawW = 0xfbf8f2,
  hat = 0x2f2a36, band = 0xd9434b, rabbit = 0xfbf8f2, earPink = 0xf4a3b5, nose = 0xee8aa4,
  red = 0xd9434b, globe = 0xe2f2f8, gumP = 0xf28aa6, gumY = 0xf6c63a, gumB = 0x4f8fdc, gumG = 0x5fbf6a, silver = 0xc9d1d9;

export default [
  // a rubber duck afloat in the bath: a round yellow body low in the water,
  // a big head, the flat orange beak toward you, its tail flicked up, and
  // a little foam where it has been paddling
  (() => {
    const g = grid(8, 7, 6);
    g.box([0, 6], [0, 1], [0, 5], duck).box([0, 6], [2, 2], [1, 4], duck)              // the body
      .box([1, 5], [3, 3], [1, 4], duck);
    for (const [x, y] of [[0, 1], [6, 1], [0, 2], [6, 2]]) for (const z of [0, 5]) g.clear(x, y, z);
    for (const z of [1, 4]) g.clear(0, 2, z).clear(1, 3, z).clear(5, 3, z);
    g.box([0, 0], [3, 4], [2, 3], duck);                                                // the tail, flicked up
    g.box([3, 6], [4, 6], [1, 4], duck);                                                // the head
    for (const x of [3, 6]) for (const z of [1, 4]) g.clear(x, 6, z);
    g.clear(3, 4, 1).clear(3, 4, 4);
    g.box([7, 7], [3, 4], [2, 3], beak);                                                // the beak
    g.set(6, 5, 1, INK).set(6, 5, 4, INK);                                              // eyes
    tint(g, (x, y, z) => y === 0 && (x === 0 || x === 6 || z === 0 || z === 5), bath);  // the waterline
    g.box([7, 7], [0, 0], [1, 4], bath);
    g.set(1, 1, 5, suds).set(2, 1, 5, suds).set(1, 1, 4, suds);                         // suds
    return g.entry({ id: 'cand-p18-rubber-duck', name: 'Rubber Duck', fraction: 0.65, seed: 1, story: 'Captain of this bath for eleven years. Not one sinking.' });
  })(),

  // a piggy bank facing you: a round pink body on four stubs, ears forward,
  // a deep pink snout, and a coin half way into the slot
  (() => {
    const g = grid(7, 7, 6);
    g.box([0, 6], [1, 4], [0, 4], pig);                                                 // the body
    for (const x of [0, 6]) for (const z of [0, 4]) g.box([x, x], [1, 4], [z, z], 0);   // rounded
    for (const x of [0, 6]) g.box([x, x], [4, 4], [0, 4], 0).box([x, x], [1, 1], [0, 4], 0);
    g.box([0, 6], [4, 4], [0, 0], 0).box([0, 6], [4, 4], [4, 4], 0);
    for (const x of [1, 5]) for (const z of [1, 3]) g.set(x, 0, z, pig);                // stub legs
    g.box([2, 4], [1, 2], [5, 5], snout).set(2, 2, 5, nostril).set(4, 2, 5, nostril);   // the snout
    pair(g, 1, 3, 4, INK);                                                              // eyes
    pair(g, 1, 5, 2, pig); pair(g, 1, 5, 3, pig);                                       // ears, forward
    g.box([2, 4], [4, 5], [2, 2], coin).set(3, 6, 2, coin);                             // the coin, half in
    return g.entry({ id: 'cand-p18-piggy-bank', name: 'Piggy Bank', fraction: 0.7, seed: 1, story: 'It has been saving since Tuesday. It will not say what for.' });
  })(),

  // a hamburger with one bite out of it: sesame bun, a lettuce frill, a
  // cheese slice whose corners hang out over the patty
  (() => {
    const g = grid(7, 7, 7);
    const disc = (y, r, c) => g.cylinder('y', [3, 3], r, [y, y], c);
    disc(0, 2.2, bun); disc(1, 2.9, bun);                                               // the heel
    disc(2, 3.3, patty);                                                                // the patty
    g.box([0, 6], [3, 3], [0, 6], cheese);                                              // the cheese, square
    for (const [x, z] of [[0, 0], [6, 0], [0, 6], [6, 6]]) g.set(x, 2, z, cheese);      // its corners, melting
    disc(4, 3.5, lettuce);                                                              // the lettuce, frilled
    for (let x = 0; x < 7; x++) for (let z = 0; z < 7; z++) if ((x - 3) ** 2 + (z - 3) ** 2 > 7 && (x + z) % 2) g.clear(x, 4, z);
    disc(5, 3.1, bun); disc(6, 1.9, bun);                                               // the crown
    for (const [x, z] of [[2, 3], [4, 2], [3, 4]]) g.set(x, 6, z, seed);                // sesame
    for (let y = 1; y < 7; y++) for (let x = 0; x < 7; x++) for (let z = 0; z < 7; z++)  // the bite
      if ((x - 6.4) ** 2 + (z - 0.6) ** 2 < 4.4) g.clear(x, y, z);
    return g.entry({ id: 'cand-p18-hamburger', name: 'Hamburger', fraction: 0.65, seed: 4, story: 'Someone took one bite and went to answer the door.' });
  })(),

  // an instant camera that has just taken your picture: a mint box, one big
  // black lens toward you, the photo sliding out of the top
  (() => {
    const g = grid(7, 8, 5);
    g.box([0, 6], [0, 4], [0, 3], mint);                                                // the body
    for (const x of [0, 6]) for (const y of [0, 4]) g.box([x, x], [y, y], [0, 3], 0);   // rounded corners
    g.box([2, 4], [1, 3], [4, 4], lens).set(3, 2, 4, glass);                            // the lens
    g.box([1, 5], [5, 7], [1, 1], photo);                                               // the photo
    g.box([2, 4], [6, 6], [1, 1], shot);                                                // still developing
    g.set(5, 5, 3, button);                                                             // the shutter
    return g.entry({ id: 'cand-p18-instant-camera', name: 'Instant Camera', fraction: 0.7, seed: 3, story: 'It took your picture. It is still deciding what it thinks.' });
  })(),

  // a little car off on holiday: a bubble cabin over four wheels, headlamps
  // for eyes, and everything it owns strapped to the roof
  (() => {
    const g = grid(9, 6, 5);
    g.box([0, 8], [1, 2], [0, 4], car);                                                 // the body
    for (const z of [0, 4]) g.clear(0, 2, z).clear(8, 2, z);
    g.box([2, 6], [3, 3], [0, 4], window).box([2, 5], [4, 4], [1, 3], car);             // the cabin
    g.box([1, 1], [3, 3], [1, 3], car).box([6, 6], [3, 3], [1, 3], car);
    for (const x of [1, 2, 6, 7]) for (const z of [0, 4]) g.set(x, 0, z, tyre);        // wheels
    g.set(8, 2, 1, lamp).set(8, 2, 3, lamp);                                            // headlamps
    g.box([8, 8], [1, 1], [1, 3], chrome);                                              // the bumper
    g.box([2, 5], [5, 5], [1, 3], case_).box([3, 3], [5, 5], [1, 3], strap);            // the suitcase
    return g.entry({ id: 'cand-p18-holiday-car', name: 'Holiday Car', fraction: 0.65, seed: 4, story: 'Everything it owns is on the roof. It has never felt lighter.' });
  })(),

  // a strawberry milkshake in a soda glass: whipped cream piled over the
  // rim and running down one side, a striped straw, the cherry on top
  (() => {
    const g = grid(5, 10, 5);
    const disc = (y, r, c) => g.cylinder('y', [2, 2], r, [y, y], c);
    disc(0, 1.5, glassFt); g.set(2, 1, 2, glassFt);                                      // the foot and stem
    disc(2, 1.5, shake); disc(3, 2.0, shake); disc(4, 2.3, shake); disc(5, 2.3, shake);  // the glass, full
    disc(6, 2.3, cream); disc(7, 1.5, cream);                                           // the cream
    g.set(4, 5, 2, cream).set(4, 4, 2, cream).set(4, 5, 3, cream);                      // running down the side
    g.set(2, 8, 2, cherry);                                                             // the cherry
    for (const [y, x, c] of [[7, 3, straw], [8, 3, strawW], [8, 4, straw], [9, 4, strawW]]) g.set(x, y, 1, c);   // the straw
    return g.entry({ id: 'cand-p18-milkshake', name: 'Milkshake', fraction: 0.65, seed: 1, story: 'The cherry goes last. Everyone knows the cherry goes last.' });
  })(),

  // a top hat upturned on the table, a white rabbit peeking over the brim
  (() => {
    const g = grid(6, 8, 6);
    g.cylinder('y', [2.5, 2.5], 2.2, [0, 2], hat);                                      // the crown
    g.cylinder('y', [2.5, 2.5], 2.2, [1, 1], band);                                     // the band
    g.cylinder('y', [2.5, 2.5], 3.0, [3, 3], hat);                                      // the brim
    g.box([1, 4], [3, 5], [1, 4], rabbit);                                              // the rabbit
    g.clear(1, 5, 1).clear(4, 5, 1);
    pair(g, 1, 5, 4, INK); pair(g, 2, 4, 4, nose);                                      // eyes, nose
    for (const y of [6, 7]) { pair(g, 1, y, 2, rabbit); pair(g, 1, y, 3, earPink); }     // ears
    pair(g, 1, 4, 5, rabbit);                                                           // paws on the brim
    return g.entry({ id: 'cand-p18-rabbit-hat', name: 'Rabbit in a Hat', fraction: 0.7, seed: 1, story: 'Nobody asked the rabbit. The rabbit would like that noted.' });
  })(),

  // a gumball machine that has just paid out: a red stand, a glass ball of
  // sweets, a red cap, and one gumball waiting in the chute
  (() => {
    const g = grid(6, 8, 6);
    g.box([0, 5], [0, 0], [0, 5], red);                                                 // the foot
    for (const x of [0, 5]) for (const z of [0, 5]) g.clear(x, 0, z);
    g.box([1, 4], [1, 2], [1, 4], red);                                                 // the stand
    g.ellipsoid([2.5, 4.5, 2.5], [2.9, 2.2, 2.9], globe);                               // the glass
    g.box([2, 3], [7, 7], [2, 3], red);                                                 // the cap
    const gums = [gumY, gumB, gumG, gumP];                                                // sweets against the glass,
    let k = 0;                                                                          // on the faces you can see
    for (let y = 6; y >= 3; y--) for (let x = 5; x >= 0; x--) for (let z = 5; z >= 0; z--)
      if (k < 16 && g.get(x, y, z) === globe && onSurface(g, x, y, z) && (x + z >= 5 || y === 6) && (x + 2 * y + 3 * z) % 2 === 0)
        g.set(x, y, z, gums[k++ % 4]);
    g.set(2, 1, 5, silver).set(3, 1, 5, silver);                                        // the chute
    g.set(3, 2, 5, silver);                                                             // the coin knob
    g.set(2, 0, 5, gumP);                                                               // one, paid out
    return g.entry({ id: 'cand-p18-gumball', name: 'Gumball Machine', fraction: 0.65, seed: 6, story: 'One coin, one gumball. The pink one, as it happens.' });
  })(),
];
