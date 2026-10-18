// Page 8 · XIV Autumn Woods (Orchard palette, a woodsmoke sky): leaf fall,
// woodsmoke, things gathered for winter. Half woodland critters with a prop
// or a pose, half crafted autumn things, held to the Bonsai bar (page5/home-1):
// one strong base, 2-3 masses at different heights, a characterful connecting
// part, 3-5 colours with a job each, and holes that mean something.
// The hedgehog, squirrel, chipmunk, fox, owl, acorn, pumpkin, wheelbarrow,
// mushroom log and maple bonsai already exist, so this page fills around them.
// Faces look toward +z; paired features go through pair*/kawaii so they match.
import { grid } from '../voxel.js';
import { INK, BLUSH, front, out, frontZ, pair, pairFront, pairAt, pairFrontAt, pairZ, quad, kawaii, tint, onSurface, sheet } from './kit.js';

const bark = 0x7a5236, barkDark = 0x5a3b2a, wood = 0x9a6440, woodDark = 0x6b4a3a, endGrain = 0xe6c493, endGrain2 = 0xd4a46e,
  rust = 0xc8452e, ember = 0xe8562f, amber = 0xf2a03d, gold = 0xf2c14e, leafRed = 0xd9452f, leafOrange = 0xec7a2c, leafGold = 0xf0b43a,
  moss = 0x6f9a4a, cream = 0xf3eadc, white = 0xfbf8f2, stone = 0x9aa3ad, stoneDark = 0x7d8794, iron = 0x4f5560, steel = 0xc9d1d9,
  apple = 0xd9413a, appleGreen = 0x8cbf4a, stem = 0x5a3b30, glow = 0xf6d365;

export default [
  // ---------------------------------------------------------------- critters

  // a raccoon sitting up with a stolen apple in both paws: a dark mask with
  // bright eyes, white brows and muzzle, a fat ringed tail curling up beside it
  (() => {
    const g = grid(8, 8, 6);
    const fur = 0xa29eab, mask = 0x4b4553, pale = 0xf1ecf2, ring = 0x6b6676;
    g.ellipsoid([3, 1.7, 2.5], [2.2, 1.7, 1.8], fur)
      .ellipsoid([3, 4.8, 2.7], [2.7, 2.0, 2.1], fur);
    tint(g, (x, y, z) => y <= 2 && z >= 4 && x >= 2 && x <= 4, pale);           // belly
    for (let x = 1; x <= 5; x++) front(g, x, 5, mask);                        // the mask band
    pairFrontAt(g, 3, 2, 5, white);                                           // eyes glint in the mask
    for (let x = 2; x <= 4; x++) { front(g, x, 6, pale); front(g, x, 4, pale); }   // brows and muzzle
    pairFrontAt(g, 3, 1, 4, pale);                                            // white cheeks
    out(g, 3, 4, INK);                                                        // nose
    pairAt(g, 3, 2, 7, 2, fur); pairAt(g, 3, 2, 7, 3, pale);                  // ears, pale inside
    // the apple, held out in front, both paws on it
    g.box([2, 4], [1, 2], [5, 5], apple).set(2, 2, 5, 0).set(3, 3, 5, stem).set(4, 3, 5, appleGreen);
    pairAt(g, 3, 1, 1, 5, fur); pairAt(g, 3, 1, 1, 4, fur);                   // paws round it
    // the ringed tail: out of the right hip and up, fat in the middle
    g.box([5, 6], [0, 1], [1, 2], (x, y) => (y ? fur : ring)).box([6, 7], [2, 5], [1, 2], (x, y) => (y % 2 ? ring : fur))
      .box([6, 6], [6, 6], [1, 2], ring).clear(7, 5, 1).clear(7, 2, 2);
    return g.entry({ id: 'cand-p8-raccoon', name: 'Raccoon & Apple' });
  })(),

  // a badger sitting up in a knitted scarf: white face, two black stripes
  // running from the nose over the eyes, a rust-and-mustard scarf tail
  (() => {
    const g = grid(7, 8, 6);
    const coat = 0x8f8a96, dark = 0x3f3a46, face = 0xf6f2ec, scarf = 0xd9572f, scarf2 = 0xf0b44a;
    g.ellipsoid([3, 1.9, 2.5], [2.4, 1.9, 1.9], coat)
      .ellipsoid([3, 5.0, 2.8], [2.5, 1.8, 2.0], face);
    tint(g, (x, y, z) => y === 0, dark);                                      // feet
    tint(g, (x, y, z) => y <= 2 && z >= 4 && x >= 2 && x <= 4, dark);         // dark chest
    tint(g, (x, y, z) => y >= 4 && (x === 2 || x === 4) && !(y === 4 && z >= 4), dark);   // the stripes
    pairFront(g, 2, 5, white);                                                // eyes glint in the stripes
    out(g, 3, 4, INK);                                                        // nose
    pair(g, 1, 6, 2, dark); pair(g, 1, 6, 3, face);                           // little white-tipped ears
    // the scarf: a ring round the neck, knitted in two colours, its tail down the chest
    tint(g, (x, y, z) => y === 3 && onSurface(g, x, y, z), (x) => (x % 2 ? scarf : scarf2));
    front(g, 4, 2, scarf); front(g, 4, 1, scarf2); out(g, 4, 1, scarf);
    return g.entry({ id: 'cand-p8-badger', name: 'Badger in a Scarf' });
  })(),

  // a young stag facing you, antlers forked like two cupped hands, one red
  // maple leaf caught between the tines
  (() => {
    const g = grid(7, 10, 5);
    const deer = 0xc27a43, chest = 0xf0dcc0, antler = 0xf0dfb8, hoof = 0x5a3b30;
    g.box([2, 4], [2, 3], [0, 3], deer);
    for (const [x, z] of [[2, 0], [4, 0]]) g.clear(x, 3, z);                   // rounded rump
    for (const x of [2, 4]) for (const z of [0, 3]) g.set(x, 1, z, deer).set(x, 0, z, hoof);   // four legs
    g.box([2, 4], [4, 6], [2, 4], deer).set(2, 6, 4, 0).set(4, 6, 4, 0).set(2, 4, 2, 0).set(4, 4, 2, 0);
    front(g, 3, 4, INK); pairFront(g, 2, 4, chest); tint(g, (x, y, z) => z === 3 && y === 3 && x === 3, chest);
    pairFront(g, 2, 5, INK);                                                  // eyes
    pair(g, 1, 6, 3, deer); pair(g, 0, 6, 3, chest);                          // ears out sideways
    g.set(3, 3, 0, white);                                                    // white scut
    sheet(g, ['A.A.A.A', 'AAA.AAA', '..A.A..'], [3, 3], { A: antler }, 0, 7);
    g.set(5, 9, 3, leafRed).set(5, 9, 2, leafOrange);                         // a caught leaf
    return g.entry({ id: 'cand-p8-stag', name: 'Young Stag' });
  })(),

  // a beaver holding a birch stick at its chest, buck teeth over it, a flat
  // cross-hatched paddle tail on the ground beside it, a gold leaf on the stick
  (() => {
    const g = grid(8, 7, 6);
    const fur = 0x9a6440, belly = 0xc89a6a, muzzle = 0xe8c898, tooth = 0xfbf8f2, tail = 0x6b5446, tail2 = 0x7d6555,
      birch = 0xf1ece0, birchMark = 0x4a4550;
    g.ellipsoid([3, 1.8, 2.4], [2.3, 1.8, 1.8], fur)
      .ellipsoid([3, 4.6, 2.7], [2.3, 1.7, 1.9], fur);
    tint(g, (x, y, z) => y <= 2 && z >= 4, belly);
    for (let x = 2; x <= 4; x++) front(g, x, 4, muzzle);
    out(g, 3, 4, INK);                                                        // nose
    front(g, 3, 3, tooth); out(g, 3, 3, tooth);                               // buck teeth
    pairFrontAt(g, 3, 2, 5, INK);                                             // eyes
    pairAt(g, 3, 2, 6, 3, fur);                                               // round ears
    g.box([0, 6], [2, 2], [5, 5], (x) => (x === 1 || x === 5 ? birchMark : birch)).set(6, 3, 5, leafGold);
    pairAt(g, 3, 2, 0, 3, fur);                                               // feet
    g.box([5, 7], [0, 0], [1, 3], (x, y, z) => ((x + z) % 2 ? tail : tail2)).set(5, 1, 2, fur).clear(7, 0, 1).clear(7, 0, 3);
    return g.entry({ id: 'cand-p8-beaver', name: 'Beaver & Birch' });
  })(),

  // a great spotted woodpecker clinging to a cut stump, tapping: red cap,
  // white cheeks, barred black back; an acorn stashed in a knot hole in front
  (() => {
    const g = grid(7, 8, 5);
    const bk = 0xa0703f, bk2 = 0x8a5c34, black = 0x2f2a36, cheek = 0xf6f2ec, red = 0xd9413a, beak = 0x9aa3ad;
    g.cylinder('y', [2, 2], 2.3, [0, 6], (x, y, z) => ((x * 2 + z * 3) % 5 === 0 ? bk2 : bk));
    g.cylinder('y', [2, 2], 1.5, [6, 6], endGrain).set(2, 6, 2, endGrain2);   // the cut top, a ring
    g.set(1, 7, 2, leafRed).set(2, 7, 1, leafGold);                           // fallen leaves on it
    g.box([2, 2], [3, 4], [4, 4], 0).box([2, 2], [3, 4], [3, 3], 0x3a2a22).set(2, 3, 4, 0xd9a865).set(2, 4, 3, woodDark);   // knot hole, acorn
    // the bird on the right face: belly to the bark, back to the sky
    g.box([5, 5], [0, 1], [2, 2], black);                                     // stiff tail, propping
    g.box([5, 6], [2, 4], [1, 3], black).box([5, 5], [2, 4], [2, 2], cheek);
    pairZ(g, 6, 3, 1, cheek);                                                 // white shoulder bars
    g.box([5, 6], [5, 5], [1, 3], cheek).box([5, 6], [6, 6], [1, 3], red).box([6, 6], [5, 5], [2, 2], black);
    pairZ(g, 6, 5, 1, INK);                                                   // an eye each side
    g.set(4, 5, 2, beak);                                                     // beak in the bark
    g.set(5, 2, 2, red);                                                      // red under the tail
    return g.entry({ id: 'cand-p8-woodpecker', name: 'Woodpecker' });
  })(),

  // a dormouse fast asleep for the winter, curled in a nest of fallen leaves,
  // its fluffy tail tucked under its chin like a scarf
  (() => {
    const g = grid(7, 6, 7);
    const fur = 0xe6a54a, tailC = 0xd38a32, belly = 0xf6dcb0, lid = 0x7a4a2a, ear = 0xf2b8a6;
    const sector = (x, z) => [leafRed, leafOrange, leafGold, leafOrange][Math.floor((Math.atan2(z - 3, x - 3) + Math.PI) / (Math.PI / 2)) % 4];
    g.cylinder('y', [3, 3], 3.2, [0, 0], (x, y, z) => sector(x, z));
    g.cylinder('y', [3, 3], 3.2, [1, 1], (x, y, z) => (z <= 1 && (x - 3) ** 2 + (z - 3) ** 2 >= 4 ? sector(x, z) : null));   // leaves curl up behind
    g.ellipsoid([3, 2.6, 3], [2.3, 1.8, 2.1], fur);
    for (let x = 2; x <= 4; x++) front(g, x, 2, belly);
    pairFront(g, 2, 3, lid);                                                  // closed eyes
    out(g, 3, 2, BLUSH);                                                      // nose
    pair(g, 2, 5, 3, ear);                                                    // round ears
    // the tail: round the right side and across under the chin, a pale tip
    g.box([5, 5], [1, 1], [2, 4], tailC).box([2, 5], [1, 1], [5, 5], tailC).set(1, 1, 5, belly).set(5, 2, 3, tailC);
    return g.entry({ id: 'cand-p8-dormouse', name: 'Sleeping Dormouse' });
  })(),

  // a wild boar piglet (uribou), humbug-striped down its back, snuffling
  // forward; a red leaf has landed on it
  (() => {
    const g = grid(7, 6, 8);
    const coat = 0xa86b45, stripe = 0xf0d9b0, snout = 0xe0a08a, nostril = 0x7a3f32, hoof = 0x5a3b30;
    g.ellipsoid([3, 2.6, 3.4], [2.3, 1.9, 3.1], coat);
    tint(g, (x, y, z) => (x === 2 || x === 4) && !g.get(x, y + 1, z) && z <= 5, stripe);   // two stripes down the back
    g.box([2, 4], [1, 2], [7, 7], snout);
    pair(g, 2, 1, 7, nostril);                                                // nostrils
    pairFront(g, 2, 3, INK);                                                  // eyes
    pair(g, 1, 4, 5, coat); pair(g, 1, 5, 5, hoof);                           // ears, dark tips
    for (const [x, z] of [[2, 1], [4, 1], [2, 5], [4, 5]]) g.box([x, x], [0, 1], [z, z], (xx, y) => (y ? coat : hoof));
    g.set(3, 3, 0, coat).set(3, 4, 0, hoof);                                  // a flick of tail
    g.set(3, 5, 3, leafRed).set(4, 5, 3, leafRed).set(4, 5, 2, leafOrange);   // the leaf on its back
    return g.entry({ id: 'cand-p8-piglet', name: 'Boar Piglet' });
  })(),

  // a round little turkey with its tail fanned out in autumn bands
  (() => {
    const g = grid(9, 8, 5);
    const body = 0x8a5a3c, wing = 0x6b4a3a, head = 0xd9b48f, wattle = 0xd9413a, beak = 0xf2b23a, foot = 0xe8873a;
    for (let x = 0; x < 9; x++) for (let y = 2; y < 8; y++) {
      const d = Math.hypot(x - 4, (y - 2) * 1.05);
      if (d <= 4.6) g.set(x, y, 0, d > 3.6 ? leafRed : d > 2.6 ? amber : gold);
    }
    g.ellipsoid([4, 2.4, 2.4], [2.2, 2.0, 1.7], body);
    tint(g, (x, y, z) => (x === 2 || x === 6) && y >= 2 && y <= 3, wing);
    g.ellipsoid([4, 5, 3], [1.2, 1.3, 1.1], head);
    pairFront(g, 3, 5, INK);
    out(g, 4, 5, beak);
    g.set(4, 4, 4, wattle).set(4, 3, 4, wattle);
    pair(g, 3, 0, 3, foot);
    return g.entry({ id: 'cand-p8-turkey', name: 'Turkey' });
  })(),

  // ---------------------------------------------------------------- crafted

  // a scarecrow on its post: a sack head with stitched eyes, a wide straw hat,
  // a patched red shirt, straw at the cuffs, and a crow on its arm
  (() => {
    const g = grid(9, 10, 3);
    const sack = 0xd9b884, straw = 0xe8c46a, strawDark = 0xc9a04a, shirt = 0xc8452e, patch = 0x5b7fc6, over = 0x5b6f9a, crow = 0x2f2a36;
    g.box([4, 4], [0, 2], [1, 1], wood);
    g.box([3, 5], [2, 3], [0, 2], over).box([3, 5], [4, 5], [0, 2], shirt).set(5, 4, 2, patch);
    g.box([1, 2], [4, 5], [1, 1], shirt).box([6, 7], [4, 5], [1, 1], shirt);
    for (const x of [0, 8]) g.set(x, 4, 1, straw).set(x, 5, 1, strawDark).set(x, 3, 1, straw);   // straw hands
    g.set(3, 1, 1, straw).set(5, 1, 1, straw);                                // straw at the ankles
    g.box([3, 5], [6, 7], [0, 2], sack);
    pairFront(g, 3, 7, INK); front(g, 4, 6, woodDark);                        // stitched face
    g.box([1, 7], [8, 8], [0, 2], straw).box([3, 5], [9, 9], [0, 2], strawDark).box([3, 5], [8, 8], [0, 2], shirt);   // hat, red band
    for (const x of [1, 7]) g.set(x, 8, 1, strawDark);
    g.set(7, 6, 1, crow).set(6, 6, 1, crow).set(7, 7, 1, crow).set(8, 7, 1, amber);   // the crow
    return g.entry({ id: 'cand-p8-scarecrow', name: 'Scarecrow' });
  })(),

  // a log cabin: notched corners where the logs cross, a stone chimney with
  // a curl of smoke, a warm window, a pumpkin by the door; peel inside to
  // find the hearth
  (() => {
    const g = grid(8, 10, 7);
    const roof = 0xa8432f, roofDark = 0x8a3326, door = 0x5a3b30, smoke = 0xdcd8e0, pumpkin = 0xe8873a;
    g.box([1, 6], [0, 4], [1, 5], (x, y) => (y % 2 ? woodDark : wood)).box([2, 5], [1, 3], [2, 4], 0);
    for (let y = 0; y <= 4; y++) {
      if (y % 2 === 0) for (const z of [1, 5]) { g.set(0, y, z, endGrain); g.set(7, y, z, endGrain); }
      else for (const x of [1, 6]) { g.set(x, y, 0, endGrain); g.set(x, y, 6, endGrain); }
    }
    g.box([1, 6], [5, 6], [2, 4], wood);                                      // the gable fill
    for (let k = 0; k < 4; k++) g.box([0, 7], [5 + k, 5 + k], [k, 6 - k], (x, y, z) => (z === k || z === 6 - k ? roofDark : roof));
    g.box([3, 3], [0, 2], [5, 5], door).set(5, 2, 5, glow).set(6, 2, 3, glow);
    g.box([5, 6], [5, 8], [1, 2], (x, y) => ((x + y) % 2 ? stone : stoneDark)).set(6, 9, 1, smoke).set(5, 9, 1, smoke);
    g.set(4, 0, 6, pumpkin).set(4, 1, 6, moss);
    g.set(2, 1, 2, ember).set(2, 2, 2, amber);                                // the hearth inside
    return g.entry({ id: 'cand-p8-log-cabin', name: 'Log Cabin' });
  })(),

  // a woodpile of split rounds stacked three, two, one, with a gap between
  // the middle pair, and a hatchet bitten into the top log
  (() => {
    const g = grid(9, 10, 5);
    const log = (x0, y0) => g.box([x0, x0 + 2], [y0, y0 + 2], [0, 3], (x, y, z) => {
      const cx = x - x0 - 1, cy = y - y0 - 1;
      if (cx && cy) return z === 3 ? undefined : bark;                        // rounded: no corners on the cut face
      if (z < 3) return bark;
      return cx === 0 && cy === 0 ? endGrain2 : endGrain;
    });
    for (const [x, y] of [[0, 0], [3, 0], [6, 0], [1, 3], [5, 3], [3, 6]]) log(x, y);
    g.set(4, 8, 1, steel).set(4, 8, 2, steel).set(4, 9, 1, iron).set(4, 9, 2, iron).set(4, 9, 3, wood).set(4, 9, 4, wood);
    return g.entry({ id: 'cand-p8-woodpile', name: 'Woodpile & Hatchet' });
  })(),

  // a cider press: a slatted basket of apple mash under a big iron screw and
  // a turning bar, a jug filling at the spout, apples waiting their turn
  (() => {
    const g = grid(7, 9, 6);
    const mash = 0xe9c46a, juice = 0xf2b23a, jug = 0xd9c8a8, jugBand = 0x8a6a4a;
    g.box([0, 6], [0, 0], [0, 4], wood);
    g.cylinder('y', [3, 2], 1.8, [1, 4], (x, y, z) => ((x + z) % 2 ? wood : mash));
    g.cylinder('y', [3, 2], 1.8, [1, 1], iron).cylinder('y', [3, 2], 1.8, [4, 4], iron);
    g.cylinder('y', [3, 2], 1.3, [5, 5], woodDark);                           // the pressing plate
    for (const x of [0, 6]) g.box([x, x], [1, 7], [1, 2], woodDark);          // frame
    g.box([0, 6], [7, 7], [1, 2], woodDark);
    g.set(3, 6, 2, iron).set(3, 8, 2, iron).box([1, 5], [8, 8], [2, 2], iron).set(1, 8, 2, wood).set(5, 8, 2, wood);
    g.set(3, 1, 5, wood).set(4, 1, 5, juice);                                 // spout, a drip
    g.box([5, 6], [1, 2], [4, 5], jug).box([5, 6], [2, 2], [4, 5], jugBand).set(5, 3, 5, juice);
    g.set(0, 1, 4, apple).set(1, 1, 4, apple).set(0, 1, 3, appleGreen).set(0, 2, 4, apple);
    return g.entry({ id: 'cand-p8-cider-press', name: 'Cider Press' });
  })(),

  // a campfire in a ring of stones, crossed logs, flames in three colours,
  // and a blue enamel coffee pot warming on a flat stone
  (() => {
    const g = grid(7, 5, 7);
    const enamel = 0x4f7fc6, enamelDot = 0xfbf8f2;
    for (let x = 0; x < 7; x++) for (let z = 0; z < 7; z++) {
      const d = Math.hypot(x - 3, z - 3);
      if (d >= 2.2 && d <= 3.3) g.set(x, 0, z, (x * 3 + z) % 3 ? stone : stoneDark);
    }
    g.box([1, 5], [0, 0], [3, 3], bark).box([3, 3], [0, 0], [1, 5], bark).set(1, 0, 3, endGrain).set(5, 0, 3, endGrain).set(3, 0, 5, endGrain).set(3, 0, 1, endGrain);
    g.cylinder('y', [3, 3], 1.5, [1, 1], ember).cylinder('y', [3, 3], 1.0, [2, 2], amber).set(3, 3, 3, glow).set(3, 2, 3, glow).set(2, 3, 3, amber).set(3, 4, 3, glow);
    g.box([5, 6], [1, 2], [5, 6], enamel).set(5, 3, 5, enamel).set(6, 2, 6, enamelDot).set(4, 2, 5, enamel);   // the pot, its spout
    g.set(6, 0, 6, stoneDark).set(5, 0, 6, stone).set(6, 0, 5, stone);
    return g.entry({ id: 'cand-p8-campfire', name: 'Campfire' });
  })(),

  // a ginkgo bonsai gone gold: a zig-zag trunk, two fan-leaf pads at
  // different heights and a small crown, a few leaves already fallen on the pot
  (() => {
    const g = grid(8, 8, 5);
    const pot = 0x4f6d8c, potRim = 0x6b8bab, soil = 0x6b4a3a, trunk = 0x7a6455, light = 0xf6d04d, deep = 0xe4a32a;
    g.box([1, 6], [0, 1], [1, 3], pot).box([1, 6], [1, 1], [1, 3], potRim).box([2, 5], [1, 1], [2, 2], soil);
    pair(g, 1, 0, 1, 0); pair(g, 1, 0, 3, 0);
    g.box([3, 4], [2, 2], [2, 2], trunk).set(3, 3, 2, trunk).set(4, 3, 2, trunk).set(4, 4, 2, trunk).set(5, 4, 2, trunk)
      .set(4, 5, 2, trunk).set(3, 5, 2, trunk).set(3, 6, 2, trunk);
    g.ellipsoid([5.8, 4.6, 2], [1.8, 0.8, 1.6], deep);                        // low pad, right
    g.ellipsoid([1.6, 5.8, 2], [1.8, 0.8, 1.7], light);                       // high pad, left
    g.ellipsoid([3.6, 7, 2], [1.6, 0.7, 1.3], deep);                          // the crown
    g.set(5, 4, 2, trunk).set(3, 6, 2, trunk);
    g.set(5, 2, 3, light).set(2, 2, 1, deep);                                 // fallen leaves
    return g.entry({ id: 'cand-p8-ginkgo-bonsai', name: 'Ginkgo Bonsai' });
  })(),

  // a forager's basket: an oval of woven wicker and a two-ply handle, heaped
  // with a fat porcini, chanterelles, chestnuts and one red toadstool nobody
  // should eat
  (() => {
    const g = grid(8, 7, 6);
    const wick = 0xc9955a, wick2 = 0xa8763f, porcini = 0x8a5a3c, stemC = 0xf3e6cc, chant = 0xf2a03d, red = 0xe0565b, chestnut = 0x6b3a22;
    const inside = (x, z, rx, rz) => ((x - 3.5) / rx) ** 2 + ((z - 2.5) / rz) ** 2 <= 1;
    for (let x = 0; x < 8; x++) for (let z = 0; z < 6; z++) {
      if (inside(x, z, 2.6, 1.6)) g.set(x, 0, z, wick2);
      for (const y of [1, 2]) if (inside(x, z, 3.6, 2.6)) g.set(x, y, z, inside(x, z, 2.6, 1.6) ? moss : (x + y + z) % 2 ? wick : wick2);
    }
    g.box([3, 4], [3, 4], [0, 0], wick2).box([3, 4], [3, 4], [5, 5], wick2).box([3, 4], [5, 5], [0, 5], wick);   // the handle, across
    g.box([0, 2], [4, 4], [1, 3], porcini).set(1, 3, 2, stemC).set(1, 3, 3, stemC).set(1, 5, 2, porcini);   // porcini
    g.box([5, 7], [4, 4], [2, 4], red).set(6, 3, 3, stemC).set(5, 4, 4, white).set(7, 4, 2, white).set(6, 5, 3, red);   // the toadstool
    g.set(2, 3, 4, chant).set(3, 3, 4, chant).set(4, 3, 4, chant).set(3, 3, 2, chestnut).set(4, 3, 3, chestnut).set(5, 3, 1, chant);
    return g.entry({ id: 'cand-p8-forager-basket', name: "Forager's Basket" });
  })(),

  // a treehouse in an old oak: a plank deck, a little blue house with a red
  // roof, ladder rungs up the trunk, a lantern on the deck's corner, the
  // canopy going orange over the back
  (() => {
    const g = grid(8, 10, 6);
    const house = 0x6f8fa8, roof = 0xa8432f, deck = 0xc9955a, door = 0x5a3b30, rung = 0xe8c898;
    g.box([3, 4], [0, 7], [2, 3], bark);
    g.set(2, 0, 2, bark).set(5, 0, 3, bark).set(3, 0, 1, bark).set(4, 0, 4, bark);   // roots
    g.box([3, 4], [1, 1], [4, 4], rung).set(3, 2, 4, bark).set(4, 2, 4, bark);     // ladder rungs
    g.box([1, 6], [3, 3], [1, 5], deck);
    g.box([2, 5], [4, 5], [2, 4], house).box([3, 3], [4, 5], [4, 4], door).set(5, 5, 3, glow);
    g.box([1, 6], [6, 6], [1, 5], roof).box([1, 6], [7, 7], [2, 4], roof);
    g.ellipsoid([3.5, 8.4, 1.0], [3.6, 1.5, 1.7], (x, y, z) => [leafOrange, leafRed, leafGold][(x + y * 2 + z) % 3]);
    g.set(6, 2, 5, glow).set(6, 4, 5, woodDark);                              // lantern at the corner
    return g.entry({ id: 'cand-p8-treehouse', name: 'Treehouse' });
  })(),

  // a chestnut-roaster's cart: a striped awning, a glowing brazier heaped
  // with chestnuts, one spoked wheel each side, shafts to pull it by
  (() => {
    const g = grid(9, 8, 6);
    const cart = 0xa8432f, trim = 0xf2c14e, awn1 = 0xf6efe4, awn2 = 0xc8452e, nut = 0x6b3a22, nutCut = 0xf0d9b0, tire = 0x3f3a46;
    g.box([1, 6], [2, 3], [1, 4], cart).box([1, 6], [3, 3], [1, 4], (x, y, z) => (z === 1 || z === 4 || x === 1 || x === 6 ? trim : cart));
    for (const z of [0, 5]) {
      for (let x = 2; x <= 4; x++) for (let y = 0; y <= 2; y++) {
        const r = Math.hypot(x - 3, y - 1);
        g.set(x, y, z, r === 0 ? trim : (x === 3 || y === 1) ? woodDark : tire);
      }
    }
    pairZ(g, 7, 3, 1, wood); pairZ(g, 8, 3, 1, wood);                         // shafts
    g.box([2, 4], [4, 4], [2, 3], iron).box([2, 4], [5, 5], [2, 3], ember).set(3, 6, 2, nut).set(2, 6, 3, nut).set(4, 6, 3, nutCut).set(3, 6, 3, nut);
    g.box([1, 1], [4, 6], [1, 1], woodDark).box([6, 6], [4, 6], [1, 1], woodDark);
    g.box([0, 7], [7, 7], [0, 5], (x) => (x % 2 ? awn1 : awn2));
    for (let x = 0; x <= 7; x += 2) g.set(x, 6, 5, awn2);                     // scalloped edge
    g.set(6, 4, 4, awn1).set(6, 5, 4, awn1);                                  // a paper cone of nuts
    return g.entry({ id: 'cand-p8-chestnut-cart', name: 'Chestnut Cart' });
  })(),
];
