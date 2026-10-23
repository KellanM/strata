// Page 13 · I Carried Far: heirlooms and things a traveller packs for a
// long road. Page 13 is built from what Kellan's 31 favourite levels share
// (studied from QA sheets of every one of them):
//  - Colour: one bold, flat material owns 40-65% of the voxels (terracotta,
//    indigo, orange paper, red lacquer, pink, brass), with a second material
//    of strong value contrast (dark hair over red, navy roof over cream
//    walls, gold saddle on dark fur) and a small saturated accent. Many are
//    saturated rather than muted; what they avoid is noise, not colour.
//  - Pattern is regular: stripes, bands, checks, rows of bricks or scales
//    (chestnut awning, kokeshi kimono, yak saddle, jellyfish tentacles,
//    clock-tower brick), never random speckle.
//  - Form is crisp and often capped: a roof, a hood, a crown, a canopy or a
//    bell sits on a simpler body, and the colour changes at that line.
//  - Mid-size (7-9 a side), and a third are thin icons 2-4 deep seen face on
//    (heart, sloth, heron, origami fox, bonsai).
//  - Creatures have a big head, and two ink eyes on the front.
// So: one dominant colour per object, a contrasting cap or second material,
// patterns on a grid, boxes before blobs.
// This section: a gourd canteen, a furoshiki bundle, a spinning top, a
// kendama, a nesting doll, an abacus, a travelling lute and a pellet drum.
// Sky: Dawn (the Rucksack and Heart's chapter), so warm reds and indigo sit
// well against peach and lilac.
import { grid } from '../voxel.js';
import { INK, BLUSH, pair, pairAt, pairFront, quad, tint, onSurface, lathe, sheet } from './kit.js';

const red = 0xd2453b, redDk = 0xa8332f, indigo = 0x2f4a7a, indigoDk = 0x22365c, cream = 0xf6efe4, gold = 0xe9b949,
  goldDk = 0xc08a2e, wood = 0xb07a3a, woodDk = 0x6b4a3a, woodLt = 0xe2b25a, gourd = 0xd9a441, gourdDk = 0xb7832e,
  leaf = 0x5f9e4a, face = 0xf6e3cf, black = 0x3a3442, teal = 0x4fb3a9;

export default [
  // a gourd canteen: two rounds of dried gourd, a red cord tied tight round
  // its waist with a tassel hanging, and a wooden stopper
  (() => {
    const g = grid(7, 9, 5);
    g.ellipsoid([3, 2.3, 2], [3.2, 2.4, 2.2], gourd);
    g.ellipsoid([3, 5.9, 2], [2.1, 1.7, 1.8], gourd);
    tint(g, (x, y, z) => y === 4, red);                                                  // the cord
    g.set(3, 4, 4, red).set(3, 3, 4, red).set(3, 2, 4, redDk);                          // the tassel
    g.box([3, 3], [7, 8], [2, 2], woodDk);                                              // the stopper
    tint(g, (x, y, z) => g.get(x, y, z) === gourd && y <= 1, gourdDk);
    return g.entry({ id: 'cand-p13-gourd', name: 'Gourd Canteen', story: 'Water from home lasts longer in a gourd.' });
  })(),

  // a furoshiki bundle: everything you own tied up in an indigo cloth with
  // a white pattern, the knot on top with its two ears standing up
  (() => {
    const g = grid(8, 8, 7);
    g.ellipsoid([3.5, 2.4, 3], [3.9, 2.6, 3.3], indigo);
    tint(g, (x, y, z) => onSurface(g, x, y, z) && y % 2 === 1 && (Math.ceil(Math.abs(x - 3.5)) + z + (y >> 1)) % 2 === 0, cream);   // the pattern, on a grid
    g.box([3, 4], [5, 5], [2, 4], indigoDk);                                             // the knot
    pairAt(g, 3.5, 2, 6, 3, indigo); pairAt(g, 3.5, 2, 7, 3, indigo); pairAt(g, 3.5, 3, 6, 3, indigoDk);   // its two ears
    return g.entry({ id: 'cand-p13-furoshiki', name: 'Furoshiki Bundle', story: 'Everything you own, and a knot your mother tied.' });
  })(),

  // a wooden spinning top in painted bands - red, cream, indigo, gold -
  // standing on its point, its handle up
  (() => {
    const g = grid(7, 9, 7);
    const band = [black, red, cream, red, indigo, indigo, gold, woodDk, woodDk];
    lathe(g, [3, 3], 0, [0.5, 1.0, 1.7, 2.5, 3.2, 3.2, 1.8, 0.5, 0.5], (x, y) => band[y]);
    return g.entry({ id: 'cand-p13-spinning-top', name: 'Spinning Top', story: 'Wind it, throw it, and it sleeps standing up.' });
  })(),

  // a kendama: a red ball on the spike of a wooden handle, the two cups of
  // the cross-piece either side
  (() => {
    const g = grid(7, 9, 5);
    g.box([3, 3], [0, 5], [2, 2], wood).set(3, 0, 2, woodDk);                           // the handle
    g.box([0, 6], [3, 3], [2, 2], wood);                                                // the cross-piece
    for (const x of [0, 6]) g.box([x, x], [4, 4], [1, 3], woodLt).set(x, 4, 2, woodDk);  // the two cups
    g.ellipsoid([3, 6.9, 2], [2.0, 2.0, 2.2], red);                                     // the ball
    tint(g, (x, y, z) => g.get(x, y, z) === red && y === 6, cream);                     // its painted band
    return g.entry({ id: 'cand-p13-kendama', name: 'Kendama', story: 'A thousand tries on a long road, and one perfect catch.' });
  })(),

  // a nesting doll: red lacquer, a cream face with ink eyes and pink cheeks,
  // a gold-bordered scarf, a flower painted on her apron
  (() => {
    const g = grid(7, 9, 6);
    lathe(g, [3, 2.5], 0, [2.6, 3.1, 3.1, 2.8, 2.3, 2.6, 2.6, 2.3, 1.4], red);
    tint(g, (x, y, z) => y === 4 && onSurface(g, x, y, z), gold);                        // the scarf's border
    for (let x = 2; x <= 4; x++) for (const y of [5, 6]) g.set(x, y, 5, face);          // the face
    g.set(2, 6, 5, INK).set(4, 6, 5, INK).set(2, 5, 5, BLUSH).set(4, 5, 5, BLUSH).set(3, 5, 5, face);
    g.box([2, 4], [1, 3], [5, 5], cream).set(3, 2, 5, red).set(3, 3, 5, gold).set(2, 2, 5, leaf).set(4, 2, 5, leaf);   // the apron and its flower
    tint(g, (x, y, z) => y === 0, redDk);
    return g.entry({ id: 'cand-p13-matryoshka', name: 'Nesting Doll', story: 'Open her and there is another, and another, and then you.' });
  })(),

  // an abacus in a dark wooden frame: four rods of beads, each row its own
  // colour, pushed into the counting it was doing when it was put down
  (() => {
    const g = grid(9, 7, 3);
    g.box([0, 0], [0, 6], [0, 2], woodDk).box([8, 8], [0, 6], [0, 2], woodDk);
    g.box([0, 8], [6, 6], [1, 1], woodDk).box([0, 8], [0, 0], [1, 1], woodDk);
    const rows = [[1, red, [1, 2, 3, 7]], [2, gold, [1, 2, 6, 7]], [4, indigo, [1, 5, 6, 7]], [5, teal, [1, 2, 3, 4]]];
    for (const [y, c, beads] of rows) {
      g.box([1, 7], [y, y], [1, 1], woodLt);                                            // the rod
      for (const x of beads) g.box([x, x], [y, y], [0, 2], c);
    }
    g.box([1, 7], [3, 3], [1, 1], woodDk);                                              // the beam
    return g.entry({ id: 'cand-p13-abacus', name: 'Abacus', story: 'It still holds the last sum anyone asked of it.' });
  })(),

  // a travelling lute: a round-backed body of honey wood, a dark rosette in
  // the soundboard, a bridge and strings, the neck and the pegbox bent back
  (() => {
    const g = grid(7, 10, 4);
    g.ellipsoid([3, 2.6, 1.2], [3.2, 2.8, 1.8], wood);
    g.box([0, 6], [0, 6], [3, 3], 0);
    g.ellipsoid([3, 2.6, 2], [2.9, 2.6, 0.6], woodLt);                                  // the soundboard
    g.set(3, 3, 3, woodDk).set(2, 3, 2, woodLt).set(3, 4, 3, black).set(3, 3, 3, black);   // the rosette
    g.box([2, 4], [1, 1], [3, 3], woodDk);                                              // the bridge
    g.box([3, 3], [5, 8], [1, 2], woodDk);                                              // the neck
    g.box([2, 4], [9, 9], [0, 1], woodDk).set(3, 8, 0, woodDk);                         // the pegbox, bent back
    pair(g, 2, 9, 2, gold);                                                             // pegs
    return g.entry({ id: 'cand-p13-lute', name: 'Travelling Lute', story: 'Every town it passes through leaves one more song in it.' });
  })(),

  // a pellet drum: a little red drum on a wooden handle, its heads painted
  // cream with a gold centre, and a bead on a cord either side
  (() => {
    const g = grid(9, 9, 3);
    g.cylinder('z', [4, 5], 2.8, [0, 2], red);
    g.cylinder('z', [4, 5], 1.9, [0, 0], cream).cylinder('z', [4, 5], 1.9, [2, 2], cream);
    g.set(4, 5, 2, gold).set(4, 5, 0, gold);
    tint(g, (x, y, z) => z === 1 && onSurface(g, x, y, z) && g.get(x, y, z) === red && (y === 5), redDk);
    g.box([4, 4], [0, 2], [1, 1], wood).set(4, 0, 1, woodDk);                           // the handle
    pair(g, 1, 5, 1, cream); pair(g, 0, 5, 1, black); pair(g, 0, 4, 1, black);            // cords and beads
    g.set(4, 8, 1, gold);
    return g.entry({ id: 'cand-p13-pellet-drum', name: 'Pellet Drum', story: 'Twist it and it chatters, the way it did for you once.' });
  })(),
];
