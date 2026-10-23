// Page 13 · II Patient Creatures: the ones who live where the road runs out
// (salt flats, cloud forest, high steppe, swamp), calm and a little stern,
// the kind a traveller meets and remembers. A shoebill that does not blink,
// a pangolin in its armour of scales, a Pallas's cat with its ringed tail,
// an alpaca under a woven blanket, a flamingo on one leg, a striped tapir
// calf, a kiwi, and a hornbill on its branch.
// Following the favourites (see carried-1.js): each animal is one fur or
// feather colour for most of its body, a contrasting second colour for its
// face, bill or blanket, its pattern in regular rows (scales, rings,
// stripes), and a big head with ink eyes facing you.
// Sky: Orchard (the Sloth's chapter), warm gold with sage shade, so grey,
// brown and pink coats all separate from it.
import { grid } from '../voxel.js';
import { INK, pair, pairAt, pairFront, pairZ, quad, tint, onSurface, front, out } from './kit.js';

const slate = 0x8c9aa8, slateDk = 0x6a7686, horn = 0xd6c08e, hornDk = 0xa8925e, legDk = 0x4a4f5a,
  scale = 0xa8693c, scaleDk = 0x7f4c2a, skin = 0xe2c4a0, manul = 0xb8ab9a, manulDk = 0x5d5248, mask = 0xf6efe4,
  wool = 0xf3ead8, woolDk = 0xd8ccb4, red = 0xd2453b, gold = 0xe9b949, indigo = 0x2f4a7a, nose = 0x6b4a3a,
  pink = 0xf08aa8, pinkDk = 0xd0627f, water = 0x6fb8d6, tapir = 0x7a4a2c, stripe = 0xf1e3c4,
  kiwi = 0x8a6646, kiwiLt = 0xa8835c, bill = 0xe2c9a0, black = 0x3a3442, white = 0xf6efe4, casque = 0xf2c14e,
  casqueRed = 0xe0563b, wood = 0x8a5a3c, leaf = 0x5f9e4a;

export default [
  // a shoebill standing in the reeds of its own patience: slate-grey, a head
  // too big for it, a huge pale bill, two ink eyes that do not blink
  (() => {
    const g = grid(5, 10, 7);
    pair(g, 1, 0, 3, legDk); pair(g, 1, 1, 3, legDk); pair(g, 1, 2, 3, legDk); pair(g, 1, 0, 4, legDk);   // legs and toes
    g.ellipsoid([2, 4.4, 2.8], [2.4, 2.0, 2.9], slate);
    tint(g, (x, y, z) => (x <= 0 || x >= 4) && z <= 3, slateDk);                        // folded wings
    g.ellipsoid([2, 7.4, 3.2], [2.1, 1.7, 1.7], slate);                                  // the big head
    g.box([1, 3], [6, 7], [5, 6], horn).set(2, 5, 6, hornDk).set(2, 7, 6, hornDk);       // the bill, its hook
    pairFront(g, 1, 8, INK);
    g.set(2, 9, 2, slateDk);                                                            // a tuft at the back
    return g.entry({ id: 'cand-p13-shoebill', name: 'Shoebill', story: 'It has been waiting for that fish since morning. It can wait longer.' });
  })(),

  // a pangolin walking toward you in its armour: rows of brown scales from
  // brow to tail, a pale pointed face with two small eyes, the tail curled up
  (() => {
    const g = grid(7, 6, 10);
    g.ellipsoid([3, 2.2, 4.4], [3.05, 2.3, 3.6], scale);
    tint(g, (x, y, z) => onSurface(g, x, y, z) && z % 2 === 0, scaleDk);                // rows of scales
    g.box([2, 4], [1, 2], [8, 8], skin).set(3, 1, 9, skin).set(3, 3, 8, scale);         // the face
    pair(g, 2, 2, 8, INK);
    quad(g, 1, 0, 3, scaleDk);                                                          // feet
    g.box([3, 3], [1, 5], [0, 0], scale).set(3, 5, 1, scaleDk).set(3, 3, 0, scaleDk).set(3, 1, 0, scaleDk);   // the tail, up
    return g.entry({ id: 'cand-p13-pangolin', name: 'Pangolin', story: 'When the world gets loud, it becomes a pinecone.' });
  })(),

  // a Pallas's cat, hunkered down and unimpressed: round and woolly, a wide
  // flat head with small low ears, a pale face, a striped brow, and a thick
  // ringed tail wrapped round its feet
  (() => {
    const g = grid(9, 7, 6);
    g.ellipsoid([4, 2.2, 2.4], [3.7, 2.4, 2.5], manul);
    g.ellipsoid([4, 4.4, 3], [3.1, 2.0, 2.15], manul);
    pair(g, 2, 6, 3, manul); pair(g, 2, 6, 2, manulDk);                                  // small low ears
    for (let x = 2; x <= 6; x++) for (const y of [3, 4, 5]) front(g, x, y, mask);       // the pale face
    pairFront(g, 3, 5, INK); front(g, 4, 4, nose); front(g, 4, 3, manulDk);             // eyes, nose, a flat mouth
    for (const x of [2, 4, 6]) front(g, x, 6, manulDk);                                 // a striped brow
    g.box([0, 8], [0, 0], [4, 4], (x) => (x % 2 ? manulDk : manul));                    // the ringed tail round its feet
    return g.entry({ id: 'cand-p13-manul', name: "Pallas's Cat", story: 'It has seen many travellers. It was not impressed by any of them.' });
  })(),

  // an alpaca carrying a woven blanket - red, gold and indigo in bands -
  // long neck up, ears up, a soft face with dark eyes
  (() => {
    const g = grid(5, 10, 6);
    g.ellipsoid([2, 3.4, 2.4], [2.5, 1.9, 2.6], wool);
    for (const z of [1, 3]) { pair(g, 1, 0, z, woolDk); pair(g, 1, 1, z, wool); }       // legs
    g.box([1, 3], [5, 7], [3, 4], wool);                                                // the neck
    g.box([1, 3], [7, 8], [3, 5], wool).set(2, 7, 5, nose);                             // the head, its nose
    pair(g, 1, 8, 5, INK);
    pair(g, 1, 9, 4, wool); pair(g, 1, 9, 3, woolDk);                                     // ears
    const bands = [red, gold, indigo, red, gold];
    tint(g, (x, y, z) => z <= 2 && y >= 4 && onSurface(g, x, y, z) && g.get(x, y, z) === wool, (x, y, z) => bands[z]);   // the woven blanket
    return g.entry({ id: 'cand-p13-alpaca', name: 'Alpaca', story: 'It carries the blanket. It does not carry opinions about the route.' });
  })(),

  // a flamingo on one leg in the shallows of a salt lake, its neck folded
  // into an S, its bent bill dipped in black
  (() => {
    const g = grid(5, 10, 5);
    g.cylinder('y', [2, 2], 2.4, [0, 0], water);
    g.box([2, 2], [1, 3], [2, 2], pinkDk).set(2, 3, 3, pinkDk);                        // one leg, the other tucked
    g.ellipsoid([2, 5, 1.8], [2.3, 1.5, 1.9], pink);
    tint(g, (x, y, z) => z === 0 && onSurface(g, x, y, z), pinkDk);                     // tail feathers
    g.box([2, 2], [6, 8], [3, 3], pink);                                                // the neck
    g.box([1, 3], [8, 9], [3, 4], pink);                                                // the head
    pair(g, 1, 9, 4, INK);
    g.set(2, 8, 4, white).set(2, 7, 4, black);                                          // the bill, bent, black-tipped
    return g.entry({ id: 'cand-p13-flamingo', name: 'Flamingo', story: 'It stands on one leg to keep the other one warm.' });
  })(),

  // a tapir calf, side on and walking, its brown coat still striped and
  // spotted with cream, a short trunk, round ears, eyes on both sides
  (() => {
    const g = grid(9, 6, 5);
    g.ellipsoid([3.8, 2.2, 2], [3.6, 1.8, 2.2], tapir);
    tint(g, (x, y, z) => onSurface(g, x, y, z) && x <= 6 && y >= 2 && y <= 3 && x % 2 === 1 && z !== 2, stripe);   // stripes down both flanks
    g.box([6, 8], [2, 4], [1, 3], tapir).box([8, 8], [1, 2], [2, 2], nose);              // the head and trunk
    pairZ(g, 7, 3, 1, INK);                                                             // eyes
    pairZ(g, 6, 5, 1, tapir);                                                           // round ears
    for (const x of [2, 5]) pairZ(g, x, 0, 1, tapir);                                   // legs
    g.set(0, 3, 2, tapir);                                                              // a stub of a tail
    return g.entry({ id: 'cand-p13-tapir-calf', name: 'Tapir Calf', story: 'Born in stripes, so the forest can hide it while it grows.' });
  })(),

  // a kiwi: a round brown bird with no wings to speak of, shaggy feathers in
  // rows, two tiny eyes and a long pale bill pointed at the ground
  (() => {
    const g = grid(7, 6, 8);
    g.ellipsoid([3, 2.6, 3], [3.1, 2.4, 3.1], kiwi);
    tint(g, (x, y, z) => onSurface(g, x, y, z) && y % 2 === 0, kiwiLt);                 // shaggy rows
    pairFront(g, 2, 4, INK);
    g.set(3, 2, 6, bill).set(3, 2, 7, bill).set(3, 1, 7, bill);                         // the long bill
    pair(g, 2, 0, 3, bill); pair(g, 2, 0, 4, bill);                                       // feet
    return g.entry({ id: 'cand-p13-kiwi', name: 'Kiwi', story: 'It cannot fly, so it walked everywhere instead, and learned everything.' });
  })(),

  // a hornbill on a branch: black, a white band on its long tail, and a big
  // yellow bill with a red casque on top
  (() => {
    const g = grid(7, 8, 6);
    g.box([0, 6], [2, 2], [2, 2], wood).set(0, 3, 2, leaf).set(6, 3, 2, leaf).set(0, 2, 1, leaf).set(6, 2, 3, leaf);   // the branch
    g.ellipsoid([3, 4.4, 2], [2.1, 2.2, 1.7], black);
    tint(g, (x, y, z) => g.get(x, y, z) === black && z >= 3 && y <= 4, white);           // a white belly
    g.box([2, 4], [0, 3], [0, 0], black).box([2, 4], [1, 1], [0, 0], white);           // the tail, its band
    g.box([2, 4], [6, 7], [1, 3], black);                                               // the head
    pair(g, 2, 7, 3, white);                                                            // pale eyes
    g.box([3, 3], [5, 6], [4, 5], casque).set(3, 7, 4, casqueRed).set(3, 7, 5, casqueRed).set(3, 5, 5, gold);   // bill and casque
    pair(g, 2, 3, 2, legDk);
    return g.entry({ id: 'cand-p13-hornbill', name: 'Hornbill', story: 'It plants the forest one swallowed seed at a time.' });
  })(),
];
