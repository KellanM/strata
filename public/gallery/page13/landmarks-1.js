// Page 13 · III Old Landmarks: the places a traveller steers by, weathered
// and older than the maps - a yurt on the steppe, a stupa that watches with
// painted eyes, a stave church with dragons on its gables, a pigeon tower,
// a stepped temple in the jungle, a house on stilts over the water, an
// aqueduct still carrying its thread of water, and a hollow baobab.
// Following the favourites (see carried-1.js): like the Tea House, Kasbah,
// Clock Tower and Lantern Gate, each is one building material for most of
// its body under a cap of another (felt under a roof, white under gold, tar
// under shingle, adobe under a white dome), its detail in regular rows
// (ropes, staves, pigeon holes, steps), crisp boxes rather than rubble.
// Sky: Dusk (the Tea House and Summit Shrine's chapter), so cream walls and
// gold caps glow against the plum.
import { grid } from '../voxel.js';
import { INK, pair, quad, tint, onSurface, front, lathe } from './kit.js';

const felt = 0xf3ead8, feltDk = 0xd9ccb4, rope = 0xc0392b, door = 0xf2a03d, white = 0xf6efe4, gold = 0xe9b949,
  goldDk = 0xc08a2e, blue = 0x2f4a7a, tar = 0x4a3328, tarLt = 0x6b4a3a, shingle = 0x3a2a22, dragon = 0xa8432f,
  adobe = 0xd9a46a, adobeDk = 0x8a5a3c, hole = 0x5a3e30, dove = 0xfbf8f2, temple = 0xbfae8a, templeLt = 0xe6d8b8,
  moss = 0x5f9e4a, mossLt = 0x86c77f, comb = 0xc8452e, water = 0x5ea8dc, foam = 0xdff1fa, bamboo = 0xd9b06a,
  straw = 0xc9a24a, strawDk = 0xa8832e, wood = 0x8a5a3c, honey = 0xd9b47a, honeyDk = 0xb8925a, bark = 0xb79b8a,
  barkDk = 0x8f7568, leaf = 0x6aa257;

export default [
  // a yurt on the steppe: round felt walls bound with red rope, a low cone
  // of an indigo roof with pale ropes running down, a crown ring at the top and a
  // painted orange door
  (() => {
    const g = grid(9, 7, 9);
    g.cylinder('y', [4, 4], 4.3, [0, 2], felt);
    tint(g, (x, y, z) => y === 1 && onSurface(g, x, y, z), rope);                       // the rope band
    lathe(g, [4, 4], 3, [3.8, 2.8, 1.8, 0.9], blue);                                  // the roof cover
    tint(g, (x, y, z) => y >= 3 && onSurface(g, x, y, z) && (x === 4 || z === 4), felt); // ropes down the roof
    g.set(4, 6, 4, gold);                                                               // the crown
    for (const x of [3, 4, 5]) for (const y of [0, 1]) g.set(x, y, 8, door);            // the door
    g.set(4, 1, 8, gold);
    return g.entry({ id: 'cand-p13-yurt', name: 'Yurt', story: 'Packed onto two camels, it can be home anywhere by dark.' });
  })(),

  // a white stupa on its steps, a gold tower on its dome painted with two
  // wide eyes that watch every road, and a spire of gold rings
  (() => {
    const g = grid(7, 10, 7);
    g.box([0, 6], [0, 0], [0, 6], white).box([1, 5], [1, 1], [1, 5], feltDk);
    lathe(g, [3, 3], 2, [3.1, 2.9, 2.3], white);                                        // the dome
    g.box([2, 4], [5, 5], [2, 4], gold);                                                // the tower
    g.set(2, 5, 4, INK).set(4, 5, 4, INK).set(3, 5, 4, rope);                           // its two eyes
    for (let y = 6; y <= 8; y++) g.set(3, y, 3, y % 2 ? goldDk : gold).set(2, 6, 3, gold).set(4, 6, 3, gold).set(3, 6, 2, gold).set(3, 6, 4, gold);   // the spire
    g.set(3, 9, 3, gold);
    tint(g, (x, y, z) => y === 4 && onSurface(g, x, y, z) && (x === 0 || x === 6 || z === 0 || z === 6), blue);
    return g.entry({ id: 'cand-p13-stupa', name: 'Watching Stupa', story: 'Its eyes are painted on every side, so no road goes unwatched.' });
  })(),

  // a stave church of tarred wood, roof on roof on roof, carved dragon
  // heads at the gables, upright staves in its walls, a light arched door
  (() => {
    const g = grid(7, 10, 7);
    g.box([1, 5], [0, 3], [1, 5], (x, y, z) => ((x + z) % 2 ? tar : tarLt));           // staved walls
    g.box([0, 6], [4, 4], [0, 6], shingle);                                             // the first roof
    g.box([2, 4], [5, 6], [2, 4], tar).box([1, 5], [7, 7], [1, 5], shingle);           // the second
    g.box([3, 3], [8, 8], [3, 3], tar).set(3, 9, 3, gold);                              // the spire
    pair(g, 0, 5, 3, dragon); pair(g, 1, 8, 3, dragon);                                   // dragon heads
    g.set(3, 5, 0, dragon).set(3, 5, 6, dragon);
    g.box([3, 3], [0, 1], [5, 5], honey).set(3, 2, 5, honeyDk);                         // the door
    return g.entry({ id: 'cand-p13-stave-church', name: 'Stave Church', story: 'The dragons on its roof keep watch over the fjord.' });
  })(),

  // a round pigeon tower of adobe, its walls studded with rows of nesting
  // holes, a white band and dome on top, two doves home on the ledge
  (() => {
    const g = grid(7, 9, 7);
    g.cylinder('y', [3, 3], 3.2, [0, 5], adobe);
    tint(g, (x, y, z) => onSurface(g, x, y, z) && y >= 1 && y <= 4 && y % 2 === 1 && (x + z) % 2 === 0, hole);   // the holes
    tint(g, (x, y, z) => y === 0, adobeDk);
    g.cylinder('y', [3, 3], 3.2, [6, 6], white);                                        // the ledge
    lathe(g, [3, 3], 7, [2.2, 1.2], white);                                             // the dome
    pair(g, 1, 7, 3, dove);                                                          // doves on the ledge
    pair(g, 1, 7, 4, INK);
    return g.entry({ id: 'cand-p13-dovecote', name: 'Pigeon Tower', story: 'Every bird in the valley knows the way home to it.' });
  })(),

  // a stepped temple in the jungle: three tiers of pale stone, a stair up
  // the middle, a little temple on top with a dark door and a red roof comb,
  // moss creeping up the corners
  (() => {
    const g = grid(7, 7, 7);
    g.box([0, 6], [0, 0], [0, 6], temple).box([1, 5], [1, 2], [1, 5], temple).box([2, 4], [3, 3], [2, 4], temple);
    g.box([2, 4], [4, 4], [2, 4], templeLt).set(3, 4, 4, INK);                          // the shrine, its door
    g.box([2, 4], [5, 5], [3, 3], comb).set(3, 6, 3, comb);                             // the roof comb
    for (const [y, z] of [[0, 6], [1, 5], [2, 5], [3, 4]]) g.set(3, y, z, templeLt);    // the stair
    g.set(3, 1, 6, templeLt).set(3, 3, 5, templeLt);
    quad(g, 0, 0, 0, moss); quad(g, 1, 1, 1, moss); quad(g, 0, 0, 1, mossLt); quad(g, 1, 2, 1, mossLt);
    return g.entry({ id: 'cand-p13-step-temple', name: 'Step Temple', story: 'The jungle has been climbing it for a thousand years.' });
  })(),

  // a house on stilts over the water: a woven bamboo room, a thick thatch
  // with a ridge, a ladder down to the water
  (() => {
    const g = grid(7, 9, 6);
    g.box([0, 6], [0, 0], [0, 5], (x, y, z) => ((x + 2 * z) % 5 ? water : foam));
    quad(g, 1, 1, 1, wood); quad(g, 1, 2, 1, wood); quad(g, 1, 3, 1, wood);              // the stilts
    g.box([1, 5], [4, 4], [1, 4], wood);                                                // the floor
    g.box([2, 4], [5, 6], [2, 3], bamboo).set(3, 5, 3, hole).set(3, 6, 3, hole);       // the room, its door
    g.box([1, 5], [7, 7], [0, 5], straw).box([2, 4], [8, 8], [1, 4], strawDk);          // the thatch
    tint(g, (x, y, z) => y === 7 && (x === 1 || x === 5), strawDk);
    for (let y = 1; y <= 3; y++) g.set(3, y, 5, y % 2 ? wood : bamboo);                 // the ladder
    g.set(3, 4, 5, wood);
    return g.entry({ id: 'cand-p13-stilt-house', name: 'Stilt House', story: 'When the river rises, it just stands a little taller.' });
  })(),

  // an aqueduct of honey stone, two tiers of arches, still carrying its
  // thread of water along the top; moss at the foot of its piers
  (() => {
    const g = grid(9, 8, 3);
    for (const x of [0, 4, 8]) g.box([x, x], [0, 3], [0, 2], honey);                    // big piers
    g.box([0, 8], [4, 4], [0, 2], honeyDk);
    for (const x of [1, 3, 5, 7]) g.box([x, x], [3, 3], [0, 2], honey);                 // the arches' shoulders
    for (const x of [0, 2, 4, 6, 8]) g.box([x, x], [5, 5], [0, 2], honey);              // small piers
    g.box([0, 8], [6, 6], [0, 2], honey);
    g.box([0, 8], [7, 7], [0, 0], honeyDk).box([0, 8], [7, 7], [2, 2], honeyDk).box([0, 8], [7, 7], [1, 1], water);   // the channel
    for (const x of [0, 4, 8]) g.set(x, 0, 2, moss);
    return g.entry({ id: 'cand-p13-aqueduct', name: 'Aqueduct', story: 'Built to carry water to a city that has gone. The water still comes.' });
  })(),

  // a baobab, fat as a tower, its bark in long folds, a dark door in the
  // hollow of its trunk, and a few stubby branches with leaves on top
  (() => {
    const g = grid(7, 10, 7);
    lathe(g, [3, 3], 0, [2.7, 2.9, 3.1, 3.1, 2.9, 2.6, 2.1], bark);
    tint(g, (x, y, z) => onSurface(g, x, y, z) && (x + z) % 2 === 0 && y >= 1, barkDk);   // folds in the bark
    g.box([3, 3], [0, 1], [6, 6], hole);                                                // the hollow
    g.box([1, 5], [7, 7], [3, 3], bark).box([3, 3], [7, 7], [1, 5], bark);              // branches
    for (const [x, z] of [[1, 3], [5, 3], [3, 1], [3, 5]]) g.set(x, 8, z, bark);
    for (const [x, z] of [[0, 3], [1, 3], [5, 3], [6, 3]]) g.set(x, 9, z, leaf);
    for (const [x, z] of [[3, 0], [3, 1], [3, 5], [3, 6]]) g.set(x, 9, z, leaf);
    g.set(1, 9, 3, leaf);
    return g.entry({ id: 'cand-p13-baobab', name: 'Baobab', story: 'Travellers have slept inside it for longer than anyone can count.' });
  })(),
];
