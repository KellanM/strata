// Home & Morning (I · First Light, Dawn): page 2 wildcards — small, easy,
// with a little story, a face or a hidden interior. Candidates for the early
// First Light slot (D ≈ 5.5–7).
// Entry format and helpers: ../voxel.js. Checklist: docs/voxel-study.md.
// The iso view looks from +x +z, so faces and details sit on high x / high z.
import { C, grid } from '../voxel.js';

const fur = 0xb9b3ad, dfur = 0x8d8580, cocoa = 0x8a5a3c, toast = 0xe0a96a, crust = 0xb9773f,
  jam = 0xd2475a, cap = 0xe0565b, glow = 0xfff0a8, stem = 0xf3e6cf, felt = 0xa9c7e8, mouse = 0xc9c2bd,
  cake = 0xf4c9a8, icing = 0xf7b6c8, page = 0xfbf3e2, cover = 0x5b8fd6, tea = 0xc89c63, pot = 0xc8704b,
  jelly = 0xe8728f, plate = 0xf2f0ec, marsh = 0xfbf8f2;

export default [
  // a cat asleep in a mug: the ears and a curled paw over the rim
  (() => {
    const g = grid(6, 6, 5);
    g.cylinder('y', [2, 2], 2.2, [0, 3], C.coral)
      .cylinder('y', [2, 2], 1.3, [1, 3], 0)                     // hollow
      .cylinder('y', [2, 2], 1.3, [2, 3], fur)                    // the cat fills it
      .box([1, 3], [4, 4], [1, 3], fur)                           // its head above the rim
      .set(1, 5, 2, dfur).set(3, 5, 2, dfur)                      // ears
      .set(1, 4, 3, C.ink).set(3, 4, 3, C.ink)                    // two closed eyes toward you
      .set(2, 4, 3, C.pink)                                       // a pink nose between them
      .set(1, 3, 3, C.white).set(3, 3, 3, C.white)                // two paws over the rim
      .box([5, 5], [1, 2], [2, 2], C.coral);                      // the handle
    return { ...g.entry({ id: 'cand-cat-in-a-mug', name: 'Cat in a Mug' }), fraction: 0.2, seed: 5 };
  })(),

  // a slice of toast with a jam smile
  (() => {
    const g = grid(5, 6, 2);
    g.layers(0, [
      ['.ccc.', '.ccc.'], ['ctttc', 'ctttc'], ['ctttc', 'ctjtc'], ['ctttc', 'cetec'], ['ctttc', 'ctttc'], ['.ccc.', '.ccc.'],
    ], { c: crust, t: toast, j: jam, e: C.ink });
    g.set(1, 2, 1, jam).set(3, 2, 1, jam);                        // the corners of the smile turn up
    return { ...g.entry({ id: 'cand-toast-face', name: 'Toast Face' }), fraction: 0.5, seed: 2 };
  })(),

  // a toadstool night-light: red cap, glowing underside, white stem on a base
  (() => {
    const g = grid(5, 6, 5);
    g.box([1, 3], [0, 0], [1, 3], C.dbrown)
      .cylinder('y', [2, 2], 0.8, [1, 3], stem)
      .cylinder('y', [2, 2], 2.2, [4, 4], cap)
      .cylinder('y', [2, 2], 1.3, [5, 5], cap)
      .cylinder('y', [2, 2], 1.6, [3, 3], glow)                   // light pooled under the cap
      .set(3, 5, 3, C.white).set(4, 4, 2, C.white);               // two spots
    return { ...g.entry({ id: 'cand-mushroom-lamp', name: 'Mushroom Lamp' }), fraction: 0.2, seed: 1 };
  })(),

  // a slipper with a mouse asleep inside: ears and a pink nose at the toe
  (() => {
    const g = grid(6, 4, 4);
    g.box([0, 5], [0, 0], [0, 3], C.white)                        // sole
      .box([3, 5], [1, 2], [0, 3], felt)                          // the toe cap
      .box([0, 2], [1, 1], [0, 0], felt)                          // the heel wall behind
      .box([0, 2], [1, 2], [1, 2], mouse)                         // the mouse, sitting up in the heel
      .set(0, 3, 1, C.pink).set(2, 3, 1, C.pink)                  // two round ears
      .set(0, 2, 2, C.ink).set(2, 2, 2, C.ink)                    // two eyes toward you
      .set(1, 2, 2, C.pink);                                      // and a pink nose between
    return { ...g.entry({ id: 'cand-slipper-mouse', name: 'Slipper Mouse' }), fraction: 0.5, seed: 5 };
  })(),

  // a cupcake that is a little house: door, window, cherry chimney
  (() => {
    const g = grid(5, 7, 5);
    g.cylinder('y', [2, 2], 1.9, [0, 2], cake)
      .cylinder('y', [2, 2], 2.2, [3, 3], icing)
      .cylinder('y', [2, 2], 1.6, [4, 4], icing)
      .cylinder('y', [2, 2], 0.8, [5, 5], icing)
      .set(2, 6, 2, C.red)
      .set(2, 0, 4, C.dbrown).set(2, 1, 4, C.dbrown)              // the door, facing you
      .set(4, 1, 2, C.yellow);                                    // a lit window on the side
    return { ...g.entry({ id: 'cand-cupcake-house', name: 'Cupcake House' }), fraction: 0.3, seed: 3 };
  })(),

  // a pillow that is fast asleep, nightcap slipping off one corner
  (() => {
    const g = grid(6, 4, 4);
    g.box([0, 5], [0, 1], [0, 3], C.white)
      .box([1, 4], [2, 2], [1, 2], C.white)
      .set(2, 1, 3, C.ink).set(3, 1, 3, 0xffffff).set(4, 1, 3, C.ink)  // closed eyes
      .set(0, 2, 0, felt).set(0, 2, 1, felt).set(1, 2, 0, felt).set(0, 3, 0, C.white); // nightcap + pompom
    g.set(3, 1, 3, C.white);
    return { ...g.entry({ id: 'cand-sleepy-pillow', name: 'Sleepy Pillow' }), fraction: 0.3, seed: 6 };
  })(),

  // hot cocoa with a marshmallow snowman bobbing in it
  (() => {
    const g = grid(6, 6, 5);
    g.cylinder('y', [2, 2], 2.2, [0, 2], C.teal)
      .cylinder('y', [2, 2], 1.3, [2, 2], cocoa)
      .set(2, 3, 2, marsh).set(2, 3, 3, marsh).set(2, 4, 2, marsh)
      .set(2, 4, 3, C.orange)                                     // carrot nose toward you
      .set(2, 5, 2, C.ink)                                        // a tiny hat
      .box([5, 5], [0, 1], [2, 2], C.teal);                       // the handle
    return { ...g.entry({ id: 'cand-cocoa-snowman', name: 'Cocoa Snowman' }), fraction: 0.2, seed: 3 };
  })(),

  // an open storybook set down like a tent: blue covers for the roof, pages
  // inside, a little door at the front
  (() => {
    const g = grid(7, 5, 4);
    const A = ['...c...', '..cpc..', '.cpppc.', 'cpppppc', 'cpp.ppc'];   // top row first
    for (let y = 0; y < 5; y++) for (let x = 0; x < 7; x++) for (let z = 0; z < 4; z++) {
      const ch = A[4 - y][x];
      if (ch === 'c') g.set(x, y, z, cover);
      else if (ch === 'p' && (z === 0 || z === 3)) g.set(x, y, z, page);   // the pages show at the ends
    }
    g.set(3, 0, 3, C.dbrown).set(3, 1, 3, C.dbrown)               // the door
      .set(3, 4, 1, C.red).set(3, 4, 2, C.red);                    // a ribbon bookmark on the spine
    return { ...g.entry({ id: 'cand-storybook-house', name: 'Storybook House' }), fraction: 0.2, seed: 6 };
  })(),

  // a loaf baked in the shape of a bunny, ears up, one bent
  (() => {
    const g = grid(6, 6, 4);
    g.box([0, 5], [0, 1], [0, 3], toast)
      .box([0, 5], [2, 2], [1, 2], crust).box([1, 4], [2, 2], [0, 3], crust)
      .box([4, 4], [3, 5], [1, 1], crust).set(4, 4, 1, C.pink)    // one long ear up, pink inside
      .box([4, 4], [3, 4], [2, 2], crust).set(5, 4, 2, crust)     // the other, flopped forward
      .set(5, 1, 1, C.ink).set(5, 1, 2, C.ink)                    // two eyes on the face end
      .set(5, 0, 1, C.pink).set(5, 0, 2, C.pink);                 // and a nose under them
    return { ...g.entry({ id: 'cand-bread-bunny', name: 'Bread Bunny' }), fraction: 0.3, seed: 2 };
  })(),

  // a teabag with a smiling face, string and tag over the top
  (() => {
    const g = grid(5, 7, 2);
    g.box([0, 4], [0, 3], [0, 1], tea)
      .box([1, 3], [4, 4], [0, 1], tea)
      .set(1, 2, 1, C.ink).set(3, 2, 1, C.ink)                    // two eyes
      .set(2, 1, 1, C.rose)                                       // a little smile
      .set(2, 5, 0, C.white).set(2, 6, 0, C.white).set(3, 6, 0, C.white) // string
      .set(4, 6, 0, C.red).set(4, 5, 0, C.red);                   // the tag
    return { ...g.entry({ id: 'cand-teabag-pal', name: 'Teabag Pal' }), fraction: 0.5, seed: 5 };
  })(),

  // a flowerpot with a face and one leafy curl of hair
  (() => {
    const g = grid(5, 6, 5);
    g.cylinder('y', [2, 2], 1.6, [0, 0], pot)
      .cylinder('y', [2, 2], 2.2, [1, 3], pot)
      .cylinder('y', [2, 2], 1.6, [3, 3], C.dbrown)
      .set(1, 2, 3, C.ink).set(3, 2, 3, C.ink).set(2, 1, 4, C.pink)   // eyes on the pot's face, a blush
      .set(2, 4, 2, C.green).set(2, 5, 2, C.green).set(3, 5, 2, C.leaf);
    return { ...g.entry({ id: 'cand-potted-pal', name: 'Potted Pal' }), fraction: 0.2, seed: 1 };
  })(),

  // a jelly on a plate, wobbling, a cherry on top
  (() => {
    const g = grid(5, 5, 5);
    g.cylinder('y', [2, 2], 2.2, [0, 0], plate)
      .cylinder('y', [2, 2], 1.6, [1, 2], jelly)
      .cylinder('y', [2, 2], 1, [3, 3], jelly)
      .set(2, 4, 2, C.red)
      .set(1, 2, 3, C.ink).set(3, 2, 3, C.ink);                   // two happy eyes
    return { ...g.entry({ id: 'cand-jelly', name: 'Jelly' }), fraction: 0.4, seed: 1 };
  })(),
];
