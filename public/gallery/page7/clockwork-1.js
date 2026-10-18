// Page 7 · XI Clockwork Workshop: gears, ticking, small machines. Half wind-up
// toys with a key in their backs, half crafted brass-and-tin objects.
// Same bar as the Bonsai (see page5/home-1.js): one strong base, 2-3 masses
// at different heights, a characterful connecting part, 3-5 colours with a
// job each. The workshop's signature is the brass wind-up key: wherever one
// shows, it stands proud of the silhouette.
import { grid } from '../voxel.js';
import { INK, BLUSH, front, out, pair, pairFront, quad, tint, sheet, sideSheet } from './kit.js';

const brass = 0xe0b04a, brassDk = 0x9c7230, copper = 0xc96f42, tin = 0xc9d1d9, tinDk = 0x8d97a3,
  teal = 0x4fb3a9, tealDk = 0x2f8a83, red = 0xe0565b, redDk = 0xb8434b, cream = 0xf6efe4, wood = 0x8a5a3c,
  dwood = 0x5a3b30, pink = 0xf4a3b5, yellow = 0xf6d365, green = 0x6fbf5a, greenDk = 0x3f8a5b, blue = 0x5b8fd6,
  navy = 0x2f4a7a, lilac = 0xc9b6e4, mint = 0x9fdcc4, velvet = 0x9b3b55, steel = 0x5d6670, orange = 0xf2a03d,
  fur = 0xf3e3c8, cherry = 0xa0522d;

// a butterfly wind-up key standing in the x-y plane at z, its stem at (x, y)
const butterfly = (g, x, y, z) => sheet(g, ['KK.KK', 'K.K.K', 'KKKKK', '..K..'], [z, z], { K: brass }, x - 2, y);
// a small key: a 3-wide bow over a stem, in the x-y plane at z
const smallKey = (g, x, y, z) => sheet(g, ['K.K', 'KKK', '.K.'], [z, z], { K: brass }, x - 1, y);

export default [
  // a tin wind-up mouse: a teardrop of grey tin, round pink-lined ears, a
  // pink nose, a curl of tail and a little brass key in its back
  (() => {
    const g = grid(7, 6, 8);
    g.ellipsoid([3, 1.8, 3], [2.4, 1.9, 2.8], tin).ellipsoid([3, 1.6, 5.6], [1.3, 1.2, 1.6], tin);
    g.set(3, 2, 7, pink);
    for (const z of [3, 4]) for (const [x, y] of [[0, 4], [1, 4], [0, 5], [1, 5], [1, 3]]) pair(g, x, y, z, tin);
    pair(g, 0, 4, 4, pink); pair(g, 1, 4, 4, pink);
    pair(g, 2, 3, 4, INK);
    pairFront(g, 1, 2, BLUSH);
    smallKey(g, 3, 2, 0);
    g.set(2, 1, 0, pink).set(1, 1, 0, pink).set(1, 2, 0, pink);                  // a curl of tail
    return g.entry({ id: 'cand-p7-windup-mouse', name: 'Wind-up Mouse' });
  })(),

  // a tin robot waving hello: boxy head with a red antenna bulb and yellow
  // eyes, a red chest panel with two dials, one arm up, a key in its back
  (() => {
    const g = grid(7, 10, 5);
    g.box([1, 2], [0, 0], [2, 4], tinDk).box([4, 5], [0, 0], [2, 4], tinDk);
    g.box([1, 5], [1, 4], [2, 4], tin);
    g.box([2, 4], [2, 3], [4, 4], red).set(2, 3, 4, yellow).set(4, 3, 4, teal);
    g.box([2, 4], [5, 5], [3, 3], tinDk);
    g.box([1, 5], [6, 8], [2, 4], tin);
    g.box([2, 4], [7, 7], [4, 4], tealDk).set(2, 7, 4, yellow).set(4, 7, 4, yellow);
    pairFront(g, 1, 6, BLUSH);
    pair(g, 0, 7, 3, red);                                                       // ear bolts
    g.set(3, 9, 3, red);
    g.box([0, 0], [1, 4], [3, 3], tinDk);                                        // left arm down
    g.box([6, 6], [3, 4], [3, 3], tinDk).box([6, 6], [5, 8], [4, 4], tinDk).set(6, 4, 4, tinDk).set(6, 9, 4, tin);   // right arm up, waving
    butterfly(g, 3, 2, 0);
    g.set(3, 2, 1, brassDk);
    return g.entry({ id: 'cand-p7-tin-robot', name: 'Tin Robot' });
  })(),

  // a singing-bird automaton in profile: a teal songbird singing to the
  // right, beak open, wings and a cocked tail in deeper teal, perched on a
  // domed brass music base with its key on the front
  (() => {
    const g = grid(7, 8, 7);
    g.cylinder('y', [3, 3], 2.9, [0, 0], brassDk).cylinder('y', [3, 3], 2.6, [1, 1], brass)
      .cylinder('y', [3, 3], 1.6, [2, 2], brassDk);
    g.ellipsoid([3, 3.8, 3], [1.8, 1.2, 1.3], teal).ellipsoid([4.6, 5.2, 3], [1.2, 1.2, 1.2], teal);
    g.set(3, 3, 3, teal).set(6, 6, 3, orange).set(6, 5, 3, yellow);
    for (const [x, y] of [[2, 4], [3, 4], [4, 4], [2, 3], [3, 3]]) g.set(x, y, 1, tealDk).set(x, y, 5, tealDk);   // wings
    g.set(5, 6, 2, INK).set(5, 6, 4, INK).set(5, 5, 2, BLUSH).set(5, 5, 4, BLUSH);
    g.set(1, 4, 3, tealDk).set(1, 5, 3, tealDk).set(0, 5, 3, tealDk).set(0, 6, 3, tealDk);   // tail
    sheet(g, ['K.K', 'KKK'], [6, 6], { K: brass }, 2, 0);
    return g.entry({ id: 'cand-p7-songbird', name: 'Songbird Automaton' });
  })(),

  // a tin frog toy crouched to jump: green tin with a yellow belly, goggle
  // eyes up top, red spots down its back, folded legs and a key at its rump
  (() => {
    const g = grid(7, 5, 7);
    g.ellipsoid([3, 1.4, 3.2], [3.2, 1.6, 2.8], green).box([1, 5], [0, 0], [1, 5], green);
    tint(g, (x, y, z) => y <= 1 && z >= 5, yellow);
    for (const [x, y, z] of [[1, 2, 3], [2, 2, 3], [1, 2, 4], [2, 2, 4], [1, 3, 3], [2, 3, 3]]) pair(g, x, y, z, green);
    pair(g, 1, 3, 4, INK); pair(g, 2, 3, 4, cream);
    for (const [y, z] of [[0, 1], [0, 2], [1, 1], [1, 2], [0, 3]]) pair(g, 0, y, z, greenDk);     // folded hind legs
    pair(g, 1, 0, 6, greenDk);                                                                     // front toes
    g.set(3, 2, 6, INK);
    g.set(3, 3, 2, red).set(2, 3, 1, red).set(4, 3, 1, red);
    smallKey(g, 3, 2, 0);
    return g.entry({ id: 'cand-p7-tin-frog', name: 'Tin Frog' });
  })(),

  // a wind-up drummer bear: cream fur, a red band jacket with a gold stripe,
  // a tall blue shako, one stick raised over the drum, the other on it
  (() => {
    const g = grid(7, 10, 6);
    pair(g, 2, 0, 1, dwood); pair(g, 2, 0, 2, dwood); pair(g, 2, 1, 1, navy); pair(g, 2, 1, 2, navy);
    g.ellipsoid([3, 3, 1.8], [2, 1.7, 1.6], red);
    g.box([3, 3], [2, 4], [3, 3], yellow);
    g.ellipsoid([3, 6, 1.8], [1.9, 1.5, 1.6], fur);
    front(g, 3, 5, cream); out(g, 3, 5, INK); pairFront(g, 2, 6, INK); pairFront(g, 1, 5, BLUSH);
    pair(g, 1, 7, 1, fur); pair(g, 1, 8, 1, fur); pair(g, 1, 7, 2, pink);               // round ears
    g.box([2, 4], [8, 8], [1, 2], navy).box([2, 4], [9, 9], [1, 2], navy).set(3, 9, 3, yellow); // shako and badge
    g.cylinder('y', [3, 4], 1.5, [1, 2], cream).cylinder('y', [3, 4], 1.5, [1, 1], blue);
    for (const z of [2, 3]) pair(g, 1, 3, z, red);                                 // arms forward
    pair(g, 1, 3, 4, fur);
    g.set(1, 4, 4, brassDk).set(1, 5, 4, brassDk);                                 // one stick up...
    g.set(5, 3, 5, brassDk).set(4, 3, 5, brassDk);                                 // ...one on the drum
    smallKey(g, 3, 3, 0);
    return g.entry({ id: 'cand-p7-drummer-bear', name: 'Drummer Bear' });
  })(),

  // a jack-in-the-box mid-pop: a red box with a teal diamond, its lid flung
  // back, a crank on the side, and a clown on a spring with a pointed hat
  (() => {
    const g = grid(7, 10, 5);
    g.box([1, 5], [0, 3], [0, 4], red).box([1, 5], [3, 3], [0, 4], brass);
    sheet(g, ['.T.', 'TYT', '.T.'], [4, 4], { T: teal, Y: yellow }, 2, 0);
    sheet(g, ['.RRR.', 'RRRRR', 'RRRRR', 'BBBBB'], [0, 0], { R: redDk, B: brass }, 1, 4);   // the lid, flung back
    g.set(6, 1, 2, brassDk).set(6, 2, 2, brassDk).set(6, 2, 3, brassDk).set(6, 2, 4, red); // crank
    g.box([2, 4], [4, 4], [1, 3], tinDk).set(3, 4, 2, tin);
    g.layers(5, [['...y...', '..ytt..', '.yt.ty.', '..tty..', '...y...']], { y: yellow, t: teal });   // the ruff
    g.ellipsoid([3, 6.6, 2], [1.5, 1.3, 1.5], cream);
    out(g, 3, 6, red); pairFront(g, 2, 7, INK); pairFront(g, 2, 6, BLUSH);
    g.box([2, 4], [8, 8], [1, 3], lilac).set(3, 9, 2, yellow);
    return g.entry({ id: 'cand-p7-jack-in-the-box', name: 'Jack-in-the-Box' });
  })(),

  // a pocket watch standing in a velvet display cushion: gold case, a cream
  // face with four marks and two hands, the crown and its bow ring on top
  (() => {
    const g = grid(7, 10, 5);
    g.box([0, 6], [0, 1], [0, 4], velvet);
    quad(g, 0, 1, 0, 0);
    g.cylinder('z', [3, 4], 3.1, [1, 2], brass).cylinder('z', [3, 4], 2.3, [2, 2], cream);
    g.set(3, 6, 2, INK).set(3, 2, 2, steel).set(1, 4, 2, steel).set(5, 4, 2, steel);
    g.set(3, 4, 2, INK).set(3, 5, 2, INK).set(4, 4, 2, redDk).set(5, 3, 2, redDk);      // hands: ten past
    g.box([3, 3], [8, 8], [1, 2], brassDk);
    for (const [y, z] of [[8, 0], [9, 0], [9, 1], [9, 2], [9, 3], [8, 3]]) g.set(3, y, z, brass);
    quad(g, 0, 1, 1, yellow);                                                         // tassels
    return g.entry({ id: 'cand-p7-pocket-watch', name: 'Pocket Watch' });
  })(),

  // a gear train on a wooden plinth: a big spoked brass wheel meshing with a
  // small copper one up to its right, brass pins through both hubs
  (() => {
    const g = grid(10, 10, 4);
    g.box([0, 9], [0, 0], [0, 3], wood);
    sheet(g, ['..T.T..', '.BBBBB.', 'TB.B.BT', '.BBHBB.', 'TB.B.BT', '.BBBBB.', '..T.T..'], [1, 2], { T: brass, B: brass, H: brassDk }, 0, 1);
    sheet(g, ['..T..', '.BBB.', 'TBHBT', '.BBB.', '..T..'], [1, 2], { T: copper, B: copper, H: brassDk }, 5, 5);
    g.set(3, 4, 3, brassDk).set(3, 4, 0, brassDk).set(7, 7, 3, brassDk).set(7, 7, 0, brassDk);
    return g.entry({ id: 'cand-p7-gear-train', name: 'Gear Train' });
  })(),

  // a cherrywood metronome mid-swing: a stepped pyramid case with a cream
  // scale, the rod leaning right past the top with its brass weight, a key
  // in its side
  (() => {
    const g = grid(7, 9, 5);
    g.box([0, 6], [0, 0], [0, 4], dwood).box([1, 5], [1, 2], [0, 3], cherry).box([1, 5], [3, 4], [0, 2], cherry)
      .box([2, 4], [5, 6], [0, 2], cherry).box([3, 3], [7, 7], [0, 1], dwood);
    g.box([2, 4], [1, 2], [3, 3], cream).box([2, 4], [3, 6], [2, 2], cream);
    for (const y of [3, 5]) g.set(2, y, 2, INK);
    g.box([3, 3], [1, 2], [3, 3], INK).box([3, 3], [3, 4], [3, 3], INK).box([4, 4], [5, 8], [3, 3], INK);
    g.set(4, 6, 3, brass).set(5, 6, 3, brass).set(4, 6, 4, brass);
    sideSheet(g, ['K.K', 'KKK'], [6, 6], { K: brass }, 1, 1);
    return g.entry({ id: 'cand-p7-metronome', name: 'Metronome' });
  })(),

  // a tin carousel: a striped canopy with a scalloped valance over a mirrored
  // drum, four pastel horses on poles, each a different colour
  (() => {
    const g = grid(7, 9, 7);
    g.cylinder('y', [3, 3], 3.2, [0, 0], brassDk).cylinder('y', [3, 3], 3.0, [1, 1], teal);
    g.box([2, 4], [2, 5], [2, 4], cream).box([2, 4], [3, 4], [2, 4], (x, y, z) => ((x + z + y) % 2 ? brass : cream));
    const stripe = (x, y, z) => (Math.floor((Math.atan2(z - 3, x - 3) + Math.PI) / (Math.PI / 4)) % 2 ? red : cream);
    g.cylinder('y', [3, 3], 3.2, [6, 6], stripe).cylinder('y', [3, 3], 2.1, [7, 7], stripe).set(3, 8, 3, brass);
    for (let z = 0; z < 7; z++) for (let x = 0; x < 7; x++)
      if (g.get(x, 6, z) && Math.hypot(x - 3, z - 3) > 2.5 && (x + z) % 2 === 0 && !g.get(x, 5, z)) g.set(x, 5, z, red);
    // horses: on +x facing -z, on -x facing +z, on +z facing +x, on -z facing -x (they ride round)
    const horse = (px, pz, dx, dz, c) => {
      g.set(px, 2, pz, brass).set(px, 5, pz, brass);
      for (let k = -1; k <= 1; k++) g.set(px + dx * k, 3, pz + dz * k, c);
      g.set(px + dx, 4, pz + dz, c).set(px + dx, 5, pz + dz, c).set(px, 4, pz, brass);
    };
    horse(6, 3, 0, -1, pink); horse(0, 3, 0, 1, mint); horse(3, 6, 1, 0, yellow); horse(3, 0, -1, 0, lilac);
    return g.entry({ id: 'cand-p7-carousel', name: 'Tin Carousel' });
  })(),

  // a clockwork tin train: a teal boiler with brass bands and a black funnel,
  // a red cab with windows through, red wheels, and a key on the cab roof
  (() => {
    const g = grid(9, 9, 5);
    g.box([0, 8], [1, 1], [1, 3], steel);
    g.cylinder('x', [3, 2], 1.5, [4, 8], teal);
    for (const x of [5, 7]) g.cylinder('x', [3, 2], 1.5, [x, x], brass);
    g.set(8, 3, 2, yellow);
    g.box([0, 3], [2, 5], [1, 3], red).box([1, 2], [4, 4], [1, 3], 0).box([0, 3], [6, 6], [1, 3], redDk).box([1, 2], [6, 6], [0, 4], redDk);
    g.box([7, 7], [5, 6], [2, 2], INK).box([6, 8], [7, 7], [1, 3], INK);
    g.set(5, 5, 2, brass);
    for (const cx of [2, 6]) for (const z of [0, 4])
      for (const [x, y] of [[cx, 0], [cx - 1, 1], [cx + 1, 1], [cx, 2], [cx, 1]]) g.set(x, y, z, x === cx && y === 1 ? brass : red);
    smallKey(g, 1, 7, 2);
    return g.entry({ id: 'cand-p7-tin-train', name: 'Tin Train' });
  })(),

  // a mint vintage sewing machine on a wooden base: the arm curving over to
  // the needle, a silver handwheel on the right, a red spool on top and a
  // strip of teal cloth under the presser foot
  (() => {
    const g = grid(9, 8, 5);
    g.box([0, 8], [0, 0], [0, 4], wood);
    g.box([5, 7], [1, 4], [1, 3], mint).box([0, 7], [5, 6], [1, 3], mint).box([0, 1], [3, 4], [1, 3], mint);
    g.box([0, 7], [6, 6], [2, 2], brass).set(6, 3, 3, brass);
    g.set(1, 2, 2, steel).set(1, 1, 2, tin);                                         // needle and foot
    g.box([0, 3], [1, 1], [1, 4], teal);
    g.box([8, 8], [2, 5], [1, 3], tin).box([8, 8], [3, 4], [0, 4], tin).set(8, 3, 2, steel).set(8, 4, 2, steel);
    g.set(3, 7, 2, red).set(5, 7, 2, red).set(4, 7, 2, steel);
    return g.entry({ id: 'cand-p7-sewing-machine', name: 'Sewing Machine' });
  })(),

  // a brass microscope: a horseshoe foot, a curved arm with focus knobs on
  // both sides, a black stage with a slide, and the tube with its eyepiece
  (() => {
    const g = grid(6, 9, 6);
    g.box([1, 4], [0, 0], [0, 4], steel).box([2, 3], [0, 0], [3, 4], 0);
    g.box([2, 3], [1, 5], [0, 1], brass).box([2, 3], [6, 6], [0, 2], brass);
    pair(g, 1, 5, 1, brassDk); pair(g, 0, 5, 1, brassDk);                            // focus knobs
    g.box([1, 4], [3, 3], [2, 5], INK).box([2, 3], [3, 3], [4, 4], 0x8cc8e8);
    g.box([2, 3], [4, 8], [3, 4], brass).box([2, 3], [4, 4], [3, 4], tinDk).box([2, 3], [8, 8], [3, 4], INK);
    g.set(2, 1, 3, tin).set(3, 1, 3, tin).set(2, 2, 3, steel);                       // mirror under the stage
    return g.entry({ id: 'cand-p7-microscope', name: 'Brass Microscope' });
  })(),
];
