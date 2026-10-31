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
import { grid } from '../voxel.js';
import { INK, pair, pairFront, tint } from './kit.js';

const black = 0x3d3a46, white = 0xf6efe4, tongue = 0xe8788f,
  ginger = 0xd0783e, gingerLt = 0xe8995a, gingerDk = 0xa85a30, horn = 0xf3ead8, hornDk = 0xc9b48a, muzzle = 0xf0b8a8,
  chestnut = 0xc0683a, chestnutDk = 0x8a4a2e, kGrey = 0x8e93b0, buff = 0xf3dcae, beak = 0xf2c04a,
  grouse = 0xa04c32, grouseDk = 0x6e3426, wattle = 0xe8403a, feather = 0xfbf8f2,
  heather = 0xb070b8, heatherLt = 0xd09ad6, moss = 0x6aa257, mossDk = 0x4f8a45, grass = 0x86b862,
  wood = 0x8a5a3c, woodLt = 0xb07a3a, woodDk = 0x6b4a3a, iron = 0x4a4652, ironLt = 0x6a6672,
  hutGreen = 0x4f7a5a, hutGreenLt = 0x6a967a, tin = 0xc4c8d6, tinDk = 0x8e93b0, lamp = 0xf6c84a, lampHot = 0xfff0b0,
  brass = 0xe0b04a, tRed = 0xd0402e, marten = 0x9a5a34, martenDk = 0x5e3626, bib = 0xf2d79a,
  stone = 0xb0aaa2, stoneLt = 0xcfc8bc, stoneDk = 0x8a847e, wool = 0xf6f1e6, woolDk = 0xe0d9ca, face = 0x4a4250;

// a fixed scatter in 0..1 for stone, fleece and feather texture
const hash = (x, y, z) => {
  const n = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
  return n - Math.floor(n);
};

export default [
  // a border collie sitting up to attention, facing you: a black coat, a
  // white chest, blaze and muzzle, ears up with the tips folded, tongue
  // out, and the white-tipped tail wrapped round its front paws
  (() => {
    const g = grid(7, 10, 8);
    g.box([1, 5], [0, 2], [0, 3], black);                                                 // the haunches
    g.box([1, 5], [3, 5], [1, 3], black);                                                 // the body, upright
    g.box([2, 4], [0, 5], [4, 4], white);                                                 // the white chest
    pair(g, 2, 0, 5, white);                                                              // front paws
    g.box([1, 5], [5, 5], [4, 4], tRed).set(3, 4, 4, tRed);                               // a red neckerchief
    g.box([1, 5], [6, 8], [2, 5], black);                                                 // the head
    g.box([2, 4], [6, 7], [5, 5], white).box([3, 3], [8, 8], [5, 5], white);             // the white face and blaze
    g.box([2, 4], [6, 6], [6, 6], white).set(3, 7, 6, white).set(3, 6, 7, INK);          // the snout, nose at the tip
    g.set(3, 5, 6, tongue);                                                               // tongue out
    pairFront(g, 2, 7, INK);                                                              // eyes
    pair(g, 1, 9, 3, black); pair(g, 1, 9, 4, black); pair(g, 0, 8, 4, black);           // ears up, tips flopped over
    g.box([6, 6], [0, 0], [1, 4], black).set(6, 0, 5, white).set(5, 0, 5, white);        // the tail round the paws
    return g.entry({ id: 'cand-p15-collie', name: 'Sheepdog', story: 'Nobody ever told it how many sheep there are. It counts them anyway.' });
  })(),

  // a highland cow facing you: a shaggy ginger coat in two shades, a fringe
  // over the eyes, a pink muzzle, and wide cream horns turning up at the tips
  (() => {
    const g = grid(9, 8, 8);
    g.box([2, 6], [2, 5], [1, 5], (x, y, z) => (hash(x, y, z) > 0.5 ? ginger : gingerLt)); // the shaggy body
    for (const [x, z] of [[2, 1], [6, 1], [2, 5], [6, 5]]) g.box([x, x], [0, 1], [z, z], gingerDk);   // legs
    g.box([4, 4], [2, 4], [0, 0], gingerDk);                                              // the tail
    g.box([3, 5], [2, 5], [6, 7], gingerLt);                                              // the head
    g.box([3, 5], [2, 3], [7, 7], muzzle).set(3, 2, 7, INK).set(5, 2, 7, INK);            // the muzzle, nostrils
    g.box([2, 6], [5, 6], [7, 7], (x, y) => ((x + y) % 2 ? gingerLt : gingerDk));         // the fringe
    g.box([3, 5], [6, 6], [6, 6], ginger).set(4, 7, 7, gingerLt).set(4, 7, 6, ginger);    // and its top-knot
    pairFront(g, 3, 4, INK);                                                              // eyes, just showing
    for (const [x, y] of [[2, 5], [1, 5], [0, 5], [0, 6]]) pair(g, x, y, 6, x === 0 && y === 6 ? hornDk : horn);   // the horns
    return g.entry({ id: 'cand-p15-highland-cow', name: 'Highland Cow', story: "It can't see a thing through that fringe, and it doesn't seem to mind." });
  })(),

  // a kestrel on a fence post, facing you: a slate-grey head with a dark
  // moustache, a buff breast flecked brown, chestnut wings folded at the
  // sides, yellow feet gripping the post, the grey tail hanging behind
  (() => {
    const g = grid(5, 10, 5);
    g.box([1, 3], [0, 4], [1, 3], (x, y) => (y === 4 ? woodLt : y === 0 ? woodDk : wood)); // the post
    g.box([1, 3], [5, 7], [1, 3], chestnut);                                              // the body
    g.box([1, 3], [5, 7], [3, 3], (x, y) => (hash(x, y, 3) > 0.7 ? chestnut : buff));    // the flecked breast
    for (const y of [5, 6, 7]) pair(g, 0, y, 2, y === 5 ? chestnutDk : chestnut);         // folded wings
    pair(g, 0, 6, 1, chestnutDk);
    g.box([1, 3], [8, 9], [1, 3], kGrey);                                                 // the head
    g.box([1, 3], [8, 8], [3, 3], buff);                                                  // pale cheeks
    pair(g, 1, 9, 3, INK); pair(g, 1, 8, 3, INK);                                        // eyes and moustache
    g.set(2, 8, 4, beak);                                                                 // the hooked beak
    pair(g, 1, 4, 4, beak);                                                               // feet over the edge
    g.box([2, 2], [3, 6], [0, 0], kGrey).set(2, 3, 0, INK);                               // the tail and its band
    return g.entry({ id: 'cand-p15-kestrel', name: 'Kestrel on a Post', story: 'It holds still in a gale better than the post does.' });
  })(),

  // a red grouse in the heather, facing you: a round chestnut bird with a
  // scarlet comb over each eye, white feathered feet, a dark tail behind,
  // sat on a mound of purple heather and moss
  (() => {
    const g = grid(7, 7, 7);
    g.ellipsoid([3, 0, 3], [3.4, 1.2, 3.4], (x, y, z) => (hash(x, y, z) > 0.55 ? heather : hash(x, y, z) > 0.3 ? heatherLt : moss));   // the heather
    g.ellipsoid([3, 2.8, 3], [2.4, 1.9, 2.3], (x, y, z) => (hash(x, y, z) > 0.75 ? grouseDk : grouse));   // the round body
    g.box([2, 4], [4, 5], [3, 5], grouse);                                                // the head
    g.box([3, 3], [4, 4], [6, 6], hornDk);                                                // the beak
    pairFront(g, 2, 5, INK);                                                              // eyes
    pair(g, 2, 6, 5, wattle);                                                              // a scarlet comb over each eye
    g.box([2, 4], [3, 4], [0, 0], grouseDk);                                              // the tail
    pair(g, 2, 1, 5, feather);                                                            // feathered feet
    return g.entry({ id: 'cand-p15-grouse', name: 'Red Grouse', story: 'It tells everyone on the moor to go back, go back. Nobody does.' });
  })(),

  // a shepherd's hut on iron wheels: green planked walls, a curved tin roof,
  // a stovepipe, a lit window, and a stable door at the end up two steps
  (() => {
    const g = grid(9, 9, 6);
    g.box([1, 7], [2, 5], [1, 4], (x) => (x % 2 ? hutGreen : hutGreenLt));               // the planked walls
    g.box([1, 7], [1, 1], [1, 4], woodDk);                                               // the chassis
    g.box([0, 8], [6, 6], [1, 4], tin).box([0, 8], [7, 7], [2, 3], tinDk);               // the curved roof
    g.box([0, 8], [6, 6], [0, 0], tinDk).box([0, 8], [6, 6], [5, 5], tinDk);
    for (const x of [2, 6]) for (const z of [0, 5]) {                                     // the iron wheels
      g.set(x - 1, 1, z, iron).set(x + 1, 1, z, iron).set(x, 0, z, iron).set(x, 2, z, iron);
      g.set(x, 1, z, ironLt);
    }
    g.box([2, 2], [7, 8], [2, 2], iron);                                                  // the stovepipe
    g.box([4, 5], [3, 4], [4, 4], lamp).set(4, 4, 4, lampHot);                            // the lit window
    g.box([7, 7], [2, 4], [2, 3], woodLt).set(7, 3, 3, brass);                            // the door
    g.box([8, 8], [1, 1], [2, 3], wood).box([8, 8], [0, 0], [2, 3], woodDk);             // the steps
    return g.entry({ id: 'cand-p15-shepherds-hut', name: "Shepherd's Hut", story: 'Wheels, a stove and a bed. In lambing season, the best house on the hill.' });
  })(),

  // a shepherd's crook stuck in a tussock, its lantern hung from the hook:
  // a dark iron frame round four lit panes, a brass cap and base, a hot core
  (() => {
    const g = grid(5, 10, 3);
    g.box([0, 1], [0, 0], [0, 2], moss).set(0, 1, 1, grass).set(1, 1, 0, mossDk);       // the tussock
    g.box([0, 0], [1, 8], [1, 1], woodLt);                                                // the staff
    g.set(1, 9, 1, woodLt).set(2, 9, 1, woodLt).set(3, 9, 1, woodLt).set(3, 8, 1, woodLt);   // the hook
    g.set(3, 7, 1, iron);                                                                 // the ring
    g.box([2, 4], [6, 6], [0, 2], brass).set(3, 6, 1, brass);                            // the cap
    g.box([2, 4], [2, 5], [0, 2], (x, y, z) => {                                          // the lantern
      const edgeX = x !== 3, edgeZ = z !== 1;
      if (edgeX && edgeZ) return iron;                                                     // frame at the corners
      if (y === 5) return iron;                                                            // the top band
      return x === 3 && z === 1 ? lampHot : y === 3 ? lampHot : lamp;                     // the lit panes
    });
    g.box([2, 4], [1, 1], [0, 2], brass);                                                // the base
    return g.entry({ id: 'cand-p15-crook-lantern', name: 'Crook & Lantern', fraction: 0.5, story: 'It hooked a lamb out of a ditch, then held the light for the walk home.' });
  })(),

  // a pine marten sat up on a milestone, facing you: a chestnut coat, a
  // cream bib up to the chin, round pale-rimmed ears, dark paws on the top
  // of the stone, the bushy dark tail hanging down its side; the stone worn
  // round, moss on top, its number cut in the front
  (() => {
    const g = grid(7, 10, 6);
    g.box([1, 5], [0, 3], [1, 4], (x, y, z) => (hash(x, y, z) > 0.6 ? stoneLt : stone));   // the milestone
    for (const [x, z] of [[1, 1], [5, 1], [1, 4], [5, 4]]) g.clear(x, 3, z);             // worn round on top
    tint(g, (x, y, z) => y === 3 && hash(x, y, z) > 0.45, moss);                          // moss on top
    g.box([2, 2], [1, 2], [4, 4], stoneDk).box([4, 4], [1, 2], [4, 4], stoneDk);          // its number, cut in: II
    g.box([2, 4], [4, 5], [1, 3], marten);                                                // the haunches
    g.box([2, 4], [6, 6], [2, 3], marten);                                                // the body
    g.box([2, 4], [4, 6], [4, 4], (x) => (x === 3 ? bib : 0)).box([2, 4], [6, 6], [3, 3], bib);   // the cream bib
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

  // a round drystone sheepfold: a ring of stones laid without mortar, each
  // a shade of its own, a wooden hurdle across the gap, and one black-faced
  // ewe inside, looking out at you over it
  (() => {
    const g = grid(9, 4, 9);
    g.cylinder('y', [4, 4], 4.4, [0, 0], grass);                                          // the turf
    g.cylinder('y', [4, 4], 4.4, [1, 2], (x, y, z) => {                                   // the wall
      const h = hash(x, y, z);
      return h > 0.66 ? stoneLt : h > 0.33 ? stone : stoneDk;
    });
    g.cylinder('y', [4, 4], 3.3, [1, 2], 0);
    g.box([3, 5], [1, 2], [7, 8], 0);                                                     // the gap
    g.box([3, 5], [1, 2], [8, 8], (x, y) => (y === 2 || x === 4 ? woodLt : 0));          // the hurdle
    g.box([3, 5], [1, 1], [8, 8], woodLt);
    g.box([2, 5], [1, 2], [2, 4], (x, y, z) => (hash(x, y, z) > 0.5 ? wool : woolDk));   // the ewe
    g.box([3, 4], [2, 3], [5, 5], face);                                                  // her black face
    g.set(2, 3, 5, face).set(5, 3, 5, face);                                              // her ears
    tint(g, (x, y, z) => y === 3 && z === 5 && (x === 3 || x === 4), white);              // eyes catching the light
    return g.entry({ id: 'cand-p15-sheepfold', name: 'Drystone Sheepfold', fraction: 0.5, story: 'No mortar. Every stone was chosen to sit on the one below.' });
  })(),
];
