// Page 6 · The Deep (VIII): the sea below the sea. Things that light
// themselves, and the odd soft creatures that live where no light reaches.
// Fills the biome's gaps (docs/biomes.md) without repeating the Lagoon's
// whale, octopus, coral or chest: the shell that sails, the iron ball that
// went down to meet them, a wreck, a vent, a glass basket with two shrimp
// living in it. Pale bodies and cyan / amber glows so everything reads on
// the dark navy sky. Peeling the bathysphere, the amphora and the wreck
// finds a light still burning inside.
//
// Bonsai rules (page5/home-1.js): one strong base, 2-3 masses at different
// heights, a characterful connecting part, 3-5 colours with a job each,
// holes that mean something. Faces look toward +z.
import { grid } from '../voxel.js';
import { INK, front, pair, pairZ, pairFront, kawaii, tint, lathe } from './kit.js';

const glow = 0x7ff3e6, amber = 0xf8d77a, flame = 0xf2803d,
  dumbo = 0xf4a77e, dumboWeb = 0xe0815f, dumboEar = 0xf8c49c,
  blob = 0xf3b0bd, blobNose = 0xe3889c, blobFin = 0xf7cdd4,
  iso = 0xc4bfdc, isoBand = 0x9b94bf, isoHead = 0xd8d3ea, isoLeg = 0x8a83ad,
  barrel = 0x8fa3c2, barrelFin = 0xb9c8de, dome = 0xc8f4f0, tube = 0x7fe36a,
  yeti = 0xf2ece0, yetiHair = 0xf2d58c, yetiLeg = 0xd9cfbf,
  pig = 0xf6b9cb, pigDeep = 0xe892ad,
  angel = 0xe4f1ff, angelWing = 0xb8d8ff, heart = 0xf2683d,
  shell = 0xf6ecd8, stripe = 0xc0603a, hood = 0xa8573a, tentacle = 0xf0c8ae, navel = 0x8a6a5a,
  steel = 0x9fb3c2, steelDark = 0x6f8596, brass = 0xd9a83f, rope = 0xd9c7a3,
  sand = 0xc9b48a, hull = 0xa8703f, rail = 0x7a4a2c, rib = 0x5a3b30, kelp = 0x5fae6e, sail = 0xe9e1cc,
  basalt = 0x857a74, sulphur = 0xd9c75a, smoke = 0x4f4860, smokeTop = 0x6f6682, wormTube = 0xf3efe6, plume = 0xe0384b,
  sponge = 0xe9f1ec, spongeNode = 0xb9d9d2, shrimp = 0xf6876a,
  clay = 0xc8704b, clayDark = 0x8a3f2a, octo = 0xb68ae0, coin = 0xf2c84b, barnacle = 0xe9e1cc;

export default [
  // a dumbo octopus: a peach bell with two ear-fins flapping out at its
  // sides like a little elephant's, the webbed skirt scalloped into arm tips
  (() => {
    const g = grid(9, 7, 5);
    g.ellipsoid([4, 4.0, 2], [2.3, 2.6, 2.0], dumbo);
    g.cylinder('y', [4, 2], 3.0, [1, 1], dumboWeb);
    for (const [x, z] of [[1, 2], [7, 2], [2, 0], [6, 0], [2, 4], [6, 4], [4, 0], [4, 4]]) g.set(x, 0, z, dumboWeb);
    for (const z of [1, 2, 3]) { pair(g, 1, 4, z, dumboEar); pair(g, 0, 4, z, dumboEar); }   // ear-fins, out flat
    pair(g, 0, 5, 2, dumboEar);
    kawaii(g, 3, 4, { bx: 2, by: 3 });
    return g.entry({ id: 'cand-p6-dumbo-octopus', name: 'Dumbo Octopus' });
  })(),

  // a blobfish, slumped on the sea floor: a pink pudding with a nose that
  // has given up, two worried eyes and little fins at its sides
  (() => {
    const g = grid(7, 5, 7);
    g.ellipsoid([3, 1.4, 3], [3.0, 2.6, 2.6], blob);                                 // slumped, wider at the bottom
    g.set(3, 2, 0, blobFin).set(3, 1, 0, blobFin).set(2, 1, 0, blobFin).set(4, 1, 0, blobFin);   // tail
    pairFront(g, 2, 3, INK);
    g.box([3, 3], [1, 2], [6, 6], blobNose).box([2, 4], [0, 0], [6, 6], blobNose);   // the nose, drooping to a bulb
    pairFront(g, 1, 1, blobNose);                                                    // jowls
    return g.entry({ id: 'cand-p6-blobfish', name: 'Blobfish' });
  })(),

  // a giant isopod: a lilac armoured pill-bug, its back banded plate by
  // plate, two feelers out in front and little legs along each side
  (() => {
    const g = grid(7, 5, 10);
    for (let z = 1; z <= 7; z++) {                                                  // seven armour plates
      const c = z % 2 ? iso : isoBand;
      g.box([0, 6], [1, 2], [z, z], c).box([1, 5], [3, 3], [z, z], c).box([2, 4], [4, 4], [z, z], c);
    }
    g.box([1, 5], [1, 2], [8, 8], isoHead).box([2, 4], [3, 3], [8, 8], isoHead);
    g.box([1, 5], [1, 2], [0, 0], isoBand).box([2, 4], [3, 3], [0, 0], isoBand);    // tail fan
    pair(g, 1, 2, 8, INK);
    pair(g, 2, 1, 9, isoLeg); pair(g, 1, 1, 9, isoLeg); pair(g, 1, 2, 9, isoLeg);   // feelers, curling up
    for (const z of [2, 4, 6]) pair(g, 1, 0, z, isoLeg);                            // legs
    return g.entry({ id: 'cand-p6-giant-isopod', name: 'Giant Isopod' });
  })(),

  // a barreleye: a deep-sea fish with a clear dome over its head and two
  // green tube eyes inside it, looking straight up for falling food
  (() => {
    const g = grid(9, 6, 5);
    g.ellipsoid([4, 2.2, 2], [3.6, 1.6, 1.6], barrel);
    g.ellipsoid([6, 3.4, 2], [1.9, 2.4, 1.6], dome);
    tint(g, (x, y) => y <= 3 && x <= 7, barrel);
    pairZ(g, 6, 4, 1, tube); pairZ(g, 6, 5, 1, tube);                                // the tube eyes, behind the glass
    g.set(8, 2, 2, barrel);                                                          // snout
    g.set(0, 1, 2, barrelFin).set(0, 2, 2, barrelFin).set(0, 3, 2, barrelFin);       // tail
    pairZ(g, 4, 2, 0, barrelFin); pairZ(g, 3, 2, 0, barrelFin); pairZ(g, 3, 1, 0, barrelFin);   // big pectoral fins
    g.set(2, 4, 2, barrelFin).set(3, 4, 2, barrelFin);                               // dorsal
    return g.entry({ id: 'cand-p6-barreleye', name: 'Barreleye' });
  })(),

  // a yeti crab from the vents: a pale shell on short legs, both arms
  // raised and waving two mitts of blond bristles (they wave them to farm
  // the bacteria that feed them), eyes up on stalks
  (() => {
    const g = grid(9, 6, 7);
    g.ellipsoid([4, 2, 3], [2.6, 1.8, 2.4], yeti);
    for (const z of [2, 4]) { pair(g, 1, 1, z, yetiLeg); pair(g, 1, 0, z, yetiLeg); }
    pair(g, 1, 1, 3, yetiLeg);
    pair(g, 2, 2, 5, yeti); pair(g, 1, 2, 5, yeti);                                  // arms out and up
    for (const [x, y, z] of [[0, 3, 4], [1, 3, 4], [0, 4, 4], [1, 4, 4], [0, 3, 5], [1, 3, 5], [0, 4, 5], [1, 4, 5]]) pair(g, x, y, z, yetiHair);   // bristly mitts
    pair(g, 0, 5, 5, yeti); pair(g, 1, 5, 4, yeti);                                  // pincer tips
    pair(g, 3, 4, 4, INK);                                                           // eyes on stalks
    return g.entry({ id: 'cand-p6-yeti-crab', name: 'Yeti Crab' });
  })(),

  // a sea pig: a plump translucent-pink sea cucumber trundling on tube
  // feet, two floppy papillae up like ears
  (() => {
    const g = grid(7, 6, 9);
    g.ellipsoid([3, 2.2, 4], [2.3, 2.0, 3.6], pig);
    tint(g, (x, y) => y <= 1, pigDeep);
    for (const z of [2, 4, 6]) pair(g, 2, 0, z, pigDeep);
    pair(g, 2, 4, 6, pig); pair(g, 2, 5, 6, pig); pair(g, 1, 5, 6, pigDeep);         // floppy papillae
    pair(g, 2, 4, 3, pigDeep);
    kawaii(g, 2, 3, { bx: 1, by: 2 });
    return g.entry({ id: 'cand-p6-sea-pig', name: 'Sea Pig' });
  })(),

  // a sea angel (clione): an icy little body with two wings raised, two
  // nubs on its head and its orange heart glowing through it
  (() => {
    const g = grid(7, 8, 5);
    g.ellipsoid([3, 5.6, 2], [1.4, 1.3, 1.4], angel)
      .ellipsoid([3, 3.0, 2], [1.6, 2.2, 1.5], angel)
      .set(3, 0, 2, angel);
    g.box([3, 3], [2, 3], [2, 2], heart);
    front(g, 3, 3, heart); front(g, 3, 2, heart);
    pair(g, 1, 4, 2, angelWing); pair(g, 0, 4, 2, angelWing); pair(g, 0, 5, 2, angelWing); pair(g, 1, 5, 2, angelWing); pair(g, 0, 6, 2, angelWing);
    pair(g, 2, 7, 2, angelWing);
    kawaii(g, 2, 5, { bx: 2, by: 4 });
    return g.entry({ id: 'cand-p6-sea-angel', name: 'Sea Angel' });
  })(),

  // a chambered nautilus: a cream coil with bold tiger stripes across the
  // older whorls, fading before the mouth, where the striped hood, an eye on
  // each side and a fringe of tentacles come out; a pearly navel each side
  (() => {
    const g = grid(9, 7, 5);
    const cx = 3.5, cy = 3.2;
    for (let z = 0; z < 5; z++) for (let y = 0; y < 7; y++) for (let x = 0; x < 7; x++) {
      const r = Math.hypot(x - cx, y - cy), R = z === 0 || z === 4 ? 2.6 : 3.4;
      if (r > R) continue;
      const a = Math.atan2(y - cy, x - cx);
      const striped = r > 1.7 && (a > 0.5 || a < -1.9) && Math.floor((a + Math.PI) / (Math.PI / 4)) % 2 === 1;
      g.set(x, y, z, striped ? stripe : shell);
    }
    pairZ(g, 3, 3, 0, navel); pairZ(g, 4, 3, 0, navel);
    g.box([6, 7], [1, 3], [1, 3], hood).box([6, 7], [3, 3], [1, 3], stripe);
    g.box([8, 8], [0, 2], [1, 3], tentacle).box([7, 7], [0, 0], [1, 3], tentacle);
    pairZ(g, 7, 2, 0, INK);
    return g.entry({ id: 'cand-p6-nautilus', name: 'Nautilus' });
  })(),

  // a bathysphere: a steel ball on its cable, brass bolts round the hatch
  // band, two brass-framed portholes with the lamp-lit cabin glowing behind
  (() => {
    const g = grid(7, 9, 7);
    g.ellipsoid([3, 3, 3], [3.2, 3.2, 3.2], steel);
    tint(g, (x, y) => y === 3, steelDark);
    for (let z = 0; z < 7; z++) for (let x = 0; x < 7; x++) if (g.get(x, 3, z) && (x + z) % 2 === 0) g.set(x, 3, z, brass);
    for (let z = 2; z <= 4; z++) for (let y = 2; y <= 4; y++) for (let x = 2; x <= 4; x++) if (Math.abs(x - 3) + Math.abs(y - 3) + Math.abs(z - 3) <= 1) g.clear(x, y, z);
    g.set(3, 2, 3, amber);
    g.clear(3, 4, 6).clear(3, 4, 5).clear(6, 4, 3).clear(5, 4, 3);                  // portholes
    g.set(3, 4, 4, amber).set(4, 4, 3, amber).set(3, 4, 3, amber);                   // the cabin light behind them
    for (const [a, b] of [[2, 4], [4, 4], [3, 5]]) { g.set(a, b, 6, brass); g.set(6, b, a, brass); }
    g.box([2, 4], [6, 6], [2, 4], steelDark).set(3, 7, 3, brass).set(3, 8, 3, rope);
    g.box([1, 5], [0, 0], [3, 3], steelDark);
    return g.entry({ id: 'cand-p6-bathysphere', name: 'Bathysphere' });
  })(),

  // a wreck on the sand: the stern still whole with its cabin lamp burning,
  // the bow gone to bare ribs up to the prow, a hole stove in her side with
  // the cargo's gold showing, the mast snapped and its spar in the sand
  (() => {
    const g = grid(10, 7, 6);
    g.ellipsoid([4.5, 0, 2.5], [5.4, 1.0, 3.4], sand);
    g.box([0, 6], [1, 1], [2, 3], hull).box([0, 6], [2, 2], [1, 4], hull).box([0, 6], [3, 3], [1, 1], rail).box([0, 6], [3, 3], [4, 4], rail);
    g.box([0, 0], [1, 4], [1, 4], hull);
    g.box([0, 1], [4, 5], [1, 4], hull).box([0, 1], [5, 5], [1, 4], rib).box([0, 1], [4, 4], [2, 3], amber).box([0, 1], [4, 4], [4, 4], amber);   // the stern cabin, lit
    g.clear(3, 2, 4).clear(4, 2, 4).clear(3, 3, 4).clear(4, 3, 4);                   // stove in
    g.set(3, 2, 3, coin).set(4, 2, 3, coin).set(3, 3, 3, coin);
    g.box([7, 9], [1, 1], [2, 3], rib);
    g.box([7, 7], [2, 3], [1, 1], rib).box([7, 7], [2, 3], [4, 4], rib).box([7, 7], [2, 2], [1, 4], rib);
    g.box([9, 9], [2, 4], [2, 3], rib);                                              // the prow
    g.box([4, 4], [3, 6], [2, 2], rib).box([3, 5], [5, 5], [2, 2], rib);              // the mast still stands, yard across
    g.set(3, 4, 2, sail).set(5, 4, 2, sail).set(5, 3, 2, sail).set(4, 6, 3, plume);  // rags of sail, a red pennant
    g.box([6, 8], [1, 1], [5, 5], rib);                                              // a fallen spar
    g.set(8, 1, 1, kelp).set(8, 2, 1, kelp).set(8, 2, 0, kelp).set(8, 3, 0, kelp);
    return g.entry({ id: 'cand-p6-shipwreck', name: 'Shipwreck' });
  })(),

  // a black smoker: a basalt chimney on a vent mound, cracks glowing hot, its
  // mouth lit orange under a billowing plume, a short second vent, and
  // red-plumed tube worms crowding its warm foot
  (() => {
    const g = grid(7, 9, 6);
    g.ellipsoid([3, 0, 2.5], [3.4, 1.8, 3.0], basalt);
    lathe(g, [3, 2], 1, [1.5, 1.5, 1.5, 1.5, 1.1, 1.1], basalt);
    tint(g, (x, y, z) => y >= 1 && y <= 5 && (x + 2 * y + z) % 5 === 0, flame);
    tint(g, (x, y, z) => y <= 1 && (x * 3 + z) % 4 === 0 && g.get(x, y + 1, z) === 0, sulphur);
    g.box([2, 4], [7, 7], [2, 2], smoke).box([3, 3], [7, 7], [1, 3], smoke);         // the plume billows up and leans away
    g.box([3, 5], [8, 8], [1, 3], smokeTop).set(6, 8, 2, smokeTop).set(2, 8, 2, smokeTop);
    g.set(3, 6, 2, flame).set(3, 7, 2, flame);
    g.box([5, 5], [1, 2], [1, 1], basalt).set(5, 3, 1, smoke);
    for (const [x, z, h] of [[1, 5, 2], [2, 5, 3], [0, 4, 2]]) { g.box([x, x], [1, h - 1], [z, z], wormTube); g.set(x, h, z, plume); }
    return g.entry({ id: 'cand-p6-black-smoker', name: 'Black Smoker' });
  })(),

  // a Venus' flower basket: a glass sponge woven as a lattice tube, rooted
  // in a spray of glass threads, a sieve lid under a flared rim; inside,
  // the pair of shrimp who live there for life
  (() => {
    const g = grid(7, 9, 7);
    const ring = (y, c, keep = () => true) => {
      for (let z = 1; z <= 5; z++) for (let x = 1; x <= 5; x++) {
        const edge = x === 1 || x === 5 || z === 1 || z === 5, corner = (x === 1 || x === 5) && (z === 1 || z === 5);
        if (edge && !corner && keep(x, z)) g.set(x, y, z, c);
      }
    };
    g.box([2, 4], [0, 1], [2, 4], spongeNode).box([0, 6], [0, 0], [3, 3], spongeNode).box([3, 3], [0, 0], [0, 6], spongeNode);   // roots
    ring(1, spongeNode);
    for (const y of [2, 4, 6]) ring(y, sponge);
    for (const y of [3, 5]) ring(y, spongeNode, (x, z) => !(x === 3 || z === 3));
    g.box([1, 5], [7, 7], [1, 5], sponge).clear(1, 7, 1).clear(5, 7, 1).clear(1, 7, 5).clear(5, 7, 5);
    for (let z = 2; z <= 4; z++) for (let x = 2; x <= 4; x++) if ((x + z) % 2 === 0) g.clear(x, 7, z);   // the sieve
    for (let z = 0; z <= 6; z++) for (let x = 0; x <= 6; x++) {
      const d = Math.hypot(x - 3, z - 3);
      if (d > 2.2 && d <= 3.3) g.set(x, 8, z, sponge);                             // the flared rim
    }
    g.set(4, 3, 2, shrimp).set(4, 3, 3, shrimp).set(4, 4, 3, shrimp);               // one shrimp behind the right window
    g.set(2, 5, 4, shrimp).set(3, 5, 4, shrimp).set(3, 6, 4, shrimp);               // its mate behind the front one
    return g.entry({ id: 'cand-p6-glass-sponge', name: "Venus' Flower Basket" });
  })(),

  // a sunken amphora, with a tenant: a little lilac octopus has moved in
  // and peeks over the lip, one arm draped down the front; a few coins of
  // the old cargo are still inside
  (() => {
    const g = grid(7, 10, 5);
    lathe(g, [3, 2], 0, [1.0, 1.5, 2.2, 2.6, 2.4, 1.6, 1.0, 1.5], clay);
    tint(g, (x, y) => y === 4, clayDark);
    for (let y = 2; y <= 7; y++) { g.clear(3, y, 2); if (y <= 4) g.clear(2, y, 2).clear(4, y, 2).clear(3, y, 1).clear(3, y, 3); }
    g.set(3, 2, 2, coin).set(2, 2, 2, coin);
    for (const s of [0, 1]) { const x = s ? 6 : 0, i = s ? 5 : 1; g.set(i, 6, 2, clay).set(x, 6, 2, clay).set(x, 5, 2, clay).set(x, 4, 2, clay); }   // handles
    g.box([2, 4], [8, 8], [1, 3], octo).box([2, 4], [9, 9], [2, 2], octo).set(3, 9, 1, octo).set(3, 9, 3, octo).set(3, 7, 2, octo);
    pairFront(g, 2, 8, INK);
    g.set(4, 8, 4, octo).set(4, 7, 4, octo).set(4, 6, 4, octo).set(4, 5, 4, octo).set(5, 5, 4, octo);   // an arm over the lip
    for (const [x, y] of [[1, 3], [5, 2], [2, 4]]) front(g, x, y, barnacle);
    return g.entry({ id: 'cand-p6-amphora', name: 'Amphora & Octopus' });
  })(),
];
