// Garden & Small Creatures (II · Moss Garden, Mint): page 2 wildcards —
// small, easy, little houses and characters. Candidates for the Moss Garden
// opener (D ≈ 6–8).
// Entry format and helpers: ../voxel.js. Checklist: docs/voxel-study.md.
// The iso view looks from +x +z, so faces and details sit on high x / high z.
import { C, grid } from '../voxel.js';

const shell = 0xe8a87c, roof = 0xc8704b, body = 0xa9cf8f, door = 0x6b4a3a, glow = 0xfff0a8,
  berry = 0xe0565b, seed = 0xfbe7a1, pot = 0xc8704b, soil = 0x6b4a3a, bee = 0xf6d365, bag = 0x5b8fd6,
  worm = 0xf4a3b5, book = 0x9b7fd1, page = 0xfbf3e2, can = 0x8cc8e8, nut = 0xe0ad6c, nutcap = 0x6b4a3a,
  capRed = 0xe0565b, stem = 0xf3e6cf, leaf = 0x86c77f, dleaf = 0x3f8a5b, mail = 0x5b8fd6, bean = 0x9ccf7a;

export default [
  // a snail whose shell is a tiny cottage: door, window, roof on its back
  (() => {
    const g = grid(7, 6, 4);
    g.box([0, 6], [0, 0], [1, 2], body)                           // the foot
      .box([5, 6], [1, 2], [1, 2], body)                          // head
      .set(6, 3, 1, body).set(6, 3, 2, body)                       // eye stalks
      .set(6, 2, 2, C.ink)                                        // an eye toward you
      .box([1, 4], [1, 3], [0, 3], shell)                         // the house
      .box([1, 4], [4, 4], [0, 3], roof).box([2, 3], [5, 5], [0, 3], roof)
      .set(2, 1, 3, door).set(2, 2, 3, door)                      // door facing you
      .set(4, 2, 1, glow);                                        // a lit window
    return { ...g.entry({ id: 'cand-snail-cottage', name: 'Snail Cottage' }), fraction: 0.35, seed: 4 };
  })(),

  // a strawberry made into a house, seed windows and a leafy roof
  (() => {
    const g = grid(5, 6, 5);
    g.ellipsoid([2, 2, 2], [2.2, 2.5, 2.2], berry)
      .cylinder('y', [2, 2], 2.2, [4, 4], leaf).set(2, 5, 2, dleaf)
      .set(2, 0, 4, door).set(2, 1, 4, door)                      // the door
      .set(4, 2, 2, glow).set(3, 3, 4, seed).set(1, 2, 4, seed);  // a window and seeds
    return { ...g.entry({ id: 'cand-strawberry-house', name: 'Strawberry House' }), fraction: 0.25, seed: 3 };
  })(),

  // a flowerpot with a tiny door and a window, a flower for a chimney
  (() => {
    const g = grid(5, 7, 5);
    g.cylinder('y', [2, 2], 1.7, [0, 0], pot)
      .cylinder('y', [2, 2], 2.2, [1, 3], pot)
      .cylinder('y', [2, 2], 1.6, [3, 3], soil)
      .set(2, 1, 4, door).set(2, 2, 4, door)                      // the door
      .set(4, 2, 2, glow)                                         // a window
      .set(1, 4, 1, C.green).set(1, 5, 1, C.green).set(1, 6, 1, C.yellow).set(0, 6, 1, C.white);
    return { ...g.entry({ id: 'cand-flowerpot-door', name: 'Flowerpot with a Door' }), fraction: 0.3, seed: 5 };
  })(),

  // a bumblebee off on an adventure with a little blue backpack
  (() => {
    const g = grid(6, 5, 4);
    g.ellipsoid([2.5, 2, 1.5], [2.2, 1.6, 1.6], (x) => (x % 2 ? C.ink : bee))
      .box([1, 2], [1, 3], [0, 0], bag)                           // the backpack on its back
      .set(1, 4, 1, C.white).set(2, 4, 1, C.white).set(3, 4, 2, C.white)  // wings
      .set(5, 2, 2, C.ink).set(5, 2, 1, bee);                     // face with an eye
    return { ...g.entry({ id: 'cand-backpack-bee', name: 'Backpack Bee' }), fraction: 0.2, seed: 3 };
  })(),

  // a worm reading a book: its head peeks over the open pages
  (() => {
    const g = grid(7, 5, 4);
    g.box([0, 4], [0, 0], [1, 1], worm).set(0, 1, 1, worm)       // body, tail curled up
      .box([4, 5], [0, 0], [2, 2], worm).set(4, 0, 3, worm)
      .box([5, 5], [1, 3], [2, 2], worm)                          // neck behind the book
      .box([4, 5], [4, 4], [2, 2], worm)                          // head
      .set(4, 4, 3, C.ink).set(5, 4, 3, C.ink)                    // eyes over the pages
      .box([3, 6], [1, 3], [3, 3], (x) => (x === 3 || x === 6 ? book : page));   // the open book
    g.set(4, 4, 3, C.ink);
    return { ...g.entry({ id: 'cand-bookworm', name: 'Bookworm' }), qa: 'drop', qaWhy: 'reads as a purple box and a pink hook; the worm is lost', fraction: 0.25, seed: 4 };
  })(),

  // a watering can pouring a tiny rainbow
  (() => {
    const g = grid(7, 5, 3);
    g.box([0, 3], [0, 2], [0, 2], can)
      .box([1, 2], [3, 3], [1, 1], can)                           // handle
      .set(4, 2, 1, can).set(5, 2, 1, can).set(5, 3, 1, can)      // spout
      .set(6, 3, 1, C.red).set(6, 2, 1, C.yellow).set(6, 1, 1, C.green).set(6, 0, 1, C.blue);
    return { ...g.entry({ id: 'cand-rainbow-can', name: 'Rainbow Can' }), fraction: 0.35, seed: 4 };
  })(),

  // an acorn with a front door and a cap for a roof
  (() => {
    const g = grid(5, 6, 5);
    g.ellipsoid([2, 1.8, 2], [2, 2, 2], nut)
      .cylinder('y', [2, 2], 2.2, [3, 4], nutcap)
      .set(2, 5, 2, nutcap).set(3, 5, 2, nutcap)                  // stalk, tipped
      .set(2, 0, 4, door).set(2, 1, 4, door)
      .set(4, 2, 2, glow);
    return { ...g.entry({ id: 'cand-acorn-cottage', name: 'Acorn Cottage' }), fraction: 0.45, seed: 2 };
  })(),

  // a toadstool cottage: spotted cap roof, stalk walls, a round door
  (() => {
    const g = grid(5, 6, 5);
    g.cylinder('y', [2, 2], 1.6, [0, 2], stem)
      .cylinder('y', [2, 2], 2.2, [3, 3], capRed)
      .cylinder('y', [2, 2], 1.6, [4, 4], capRed)
      .set(2, 5, 2, capRed)
      .set(1, 4, 3, C.white).set(3, 3, 4, C.white)                // spots
      .set(2, 0, 4, door).set(2, 1, 4, door)                      // door
      .set(4, 1, 2, glow);                                        // window
    return { ...g.entry({ id: 'cand-toadstool-cottage', name: 'Toadstool Cottage' }), fraction: 0.4, seed: 3 };
  })(),

  // a leaf for a boat, a twig mast and a petal sail
  (() => {
    const g = grid(7, 4, 3);
    g.box([1, 5], [0, 0], [0, 2], leaf).box([0, 6], [0, 0], [1, 1], leaf)
      .box([2, 4], [1, 1], [1, 1], dleaf)                         // the midrib
      .set(3, 1, 1, door).set(3, 2, 1, door).set(3, 3, 1, door)   // twig mast
      .set(4, 2, 1, C.pink).set(4, 3, 1, C.pink).set(5, 2, 1, C.pink); // petal sail
    return { ...g.entry({ id: 'cand-leaf-boat', name: 'Leaf Boat' }), fraction: 0.45, seed: 3 };
  })(),

  // a little garden mailbox with a snail making its delivery
  (() => {
    const g = grid(5, 7, 4);
    g.box([2, 2], [0, 3], [1, 1], door)                           // post
      .box([1, 3], [4, 5], [0, 3], mail).box([2, 2], [6, 6], [0, 3], mail)
      .set(3, 5, 3, C.red).set(3, 4, 3, C.red)                    // the flag, up
      .set(0, 6, 1, shell).set(1, 6, 1, shell).set(1, 6, 2, body).set(1, 6, 3, body); // snail on top
    g.set(2, 6, 1, mail);
    return { ...g.entry({ id: 'cand-snail-mail', name: 'Snail Mail' }), fraction: 0.35, seed: 6 };
  })(),

  // a broad bean waking up, one leaf like a nightcap
  (() => {
    const g = grid(5, 5, 4);
    g.ellipsoid([2, 1.5, 1.5], [2.2, 1.5, 1.5], bean)
      .set(1, 2, 3, C.ink).set(3, 2, 3, C.ink)                    // sleepy eyes
      .set(2, 3, 1, C.green).set(2, 4, 1, leaf).set(3, 4, 1, leaf);
    return { ...g.entry({ id: 'cand-sleepy-bean', name: 'Sleepy Bean' }), qa: 'drop', qaWhy: 'only 17 cubes; the eyes read as feet', fraction: 0.3, seed: 5 };
  })(),

  // an apple with a worm peeking out of its side, wearing a hat
  (() => {
    const g = grid(6, 6, 5);
    g.ellipsoid([2, 2, 2], [2.2, 2.2, 2.2], berry)
      .set(2, 5, 2, door).set(3, 5, 2, leaf)                      // stalk and leaf
      .set(4, 2, 3, worm).set(5, 2, 3, worm).set(5, 3, 3, worm)   // the worm, out of a hole
      .set(5, 3, 4, C.ink).set(5, 4, 3, C.navy);                  // eye and a little hat
    return { ...g.entry({ id: 'cand-apple-worm', name: 'Apple & Worm' }), fraction: 0.25, seed: 1 };
  })(),
];
