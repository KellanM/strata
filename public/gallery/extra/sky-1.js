// Sky & Night, extra batch 1 (V · Starfall, Night). Authored to docs/voxel-study.md:
// iso silhouette first, one exaggerated identifying feature, 2–4 colours with jobs,
// one deliberate asymmetry, faces toward +x +z, no floating voxels.
import { C, ell, disc, bitmap, grid } from '../voxel.js';

// Bat: wide scalloped wings, pricked ears, two yellow eyes; one wing dips.
const bat = bitmap([
  '...e.e...',
  'p..yey...',
  'ppppepppp',
  '.pp.e.ppp',
  '.p..e..p.',
], 2, { p: C.purple, e: C.ink, y: C.yellow });

// Lamp post: a tall pole, a glowing lantern, a bracket on one side and a moth at the light.
const lampPost = grid(5, 9, 5)
  .box([1, 3], [0, 0], [1, 3], C.dgrey)
  .box([2, 2], [1, 6], [2, 2], C.dgrey)
  .box([3, 3], [5, 5], [2, 2], C.dgrey)                 // bracket, one side only
  .box([1, 3], [6, 7], [1, 3], C.yellow)                // the glowing glass
  .box([1, 3], [8, 8], [1, 3], C.dgrey)                 // cap
  .set(4, 7, 2, C.lilac);                               // a moth at the light

// Shooting star: a chunky star with a stepped trail behind it.
const shootingStar = bitmap([
  '.....y..',
  '...lyyy.',
  '.lwyyyyy',
  'll..yyy.',
  '....y.y.',
], 2, { y: C.yellow, l: C.lilac, w: C.white });

// Campfire: two crossed logs and a flame that leans.
const campfire = grid(6, 5, 6)
  .box([0, 5], [0, 0], [2, 3], C.brown)
  .box([2, 3], [0, 0], [0, 5], C.dbrown)
  .ellipsoid([2.5, 1.6, 2.5], [1.5, 1.6, 1.5], (x, y) => (y >= 1 ? C.orange : null))
  .ellipsoid([2.6, 1.6, 2.6], [0.9, 1.1, 0.9], (x, y) => (y >= 1 ? C.yellow : null))
  .set(3, 3, 3, C.orange).set(3, 4, 3, C.yellow);       // the tip, off-centre

// Paper plane: a chunky folded dart with a keel and one coloured wing stripe.
const paperPlane = grid(8, 2, 5)
  .layers(0, [
    ['........', '........', '.kkkkkk.', '........', '........'],
    ['ss......', 'wwww....', 'wwwwwwww', 'wwww....', 'ww......'],
  ], { k: C.silver, w: C.white, s: C.sky });

// Alien: a big green head with huge dark eyes, a bent antenna and one arm waving.
const alien = grid(5, 8, 5)
  .box([1, 3], [0, 2], [1, 3], C.dgreen)
  .ellipsoid([2, 4.6, 2], [2.3, 2, 2.1], C.leaf)
  .set(1, 5, 4, C.ink).set(3, 5, 4, C.ink).set(1, 4, 4, C.ink).set(3, 4, 4, C.ink)
  .set(2, 7, 2, C.leaf).set(3, 7, 2, C.yellow)           // antenna, bent to one side
  .set(0, 1, 2, C.dgreen).set(4, 2, 2, C.dgreen).set(4, 3, 2, C.dgreen);   // one arm waving

// Astronaut helmet: a round white helmet, a big gold visor, an antenna on one side.
const helmet = grid(6, 7, 6)
  .ellipsoid([2.5, 2.8, 2.5], [2.9, 2.9, 2.9], C.white)
  .box([0, 5], [2, 4], [4, 5], (x, y, z) => (x >= 1 && x <= 4 && (z === 5 || (z === 4 && (x === 0 || x === 5))) ? C.gold : null))
  .set(1, 6, 1, C.silver).set(1, 5, 1, C.silver).set(2, 0, 2, C.dgrey).set(3, 0, 3, C.dgrey);

// Raindrop: a little teardrop with a face.
const raindrop = grid(4, 6, 4)
  .ellipsoid([1.5, 1.4, 1.5], [1.9, 1.6, 1.9], C.sky)
  .box([1, 2], [3, 3], [1, 2], C.sky).set(1, 4, 1, C.sky).set(1, 5, 1, C.white)
  .set(1, 1, 3, C.ink).set(2, 1, 3, C.ink).set(3, 1, 2, C.pink).set(0, 1, 2, C.pink);   // a cheek each side

// Rain cloud: puffy cloud, a grey underside and drops of different lengths.
const rainCloud = grid(8, 7, 5)
  .ellipsoid([2.2, 4.6, 2], [2.2, 1.5, 1.8], C.white)
  .ellipsoid([4.6, 5, 2], [2.5, 1.9, 2], C.white)
  .ellipsoid([6.3, 4.5, 2], [1.7, 1.4, 1.7], C.white);
for (let x = 0; x < 8; x++) for (let z = 0; z < 5; z++) if (rainCloud.get(x, 3, z) || rainCloud.get(x, 4, z) && !rainCloud.get(x, 3, z)) {
  const y = rainCloud.get(x, 3, z) ? 3 : 4;
  rainCloud.set(x, y, z, C.silver);
}
// drops hang from the cloud's underside, each a different length
for (const [x, z, len] of [[2, 2, 2], [5, 3, 3], [4, 1, 1]]) {
  let y = 0;
  while (y < 7 && !rainCloud.get(x, y, z)) y++;
  for (let k = 1; k <= len; k++) rainCloud.set(x, y - k, z, C.blue);
}

// Windmill: a tapering white tower, a red cap and four big sails on the front.
const windmill = grid(7, 10, 5)
  .box([2, 4], [0, 5], [1, 3], C.sand)
  .box([1, 5], [0, 0], [1, 3], C.sand)
  .box([2, 4], [6, 6], [1, 3], C.red).box([3, 3], [7, 7], [2, 2], C.red)
  .set(3, 1, 4, C.brown)                                // the door
  .set(3, 6, 4, C.dbrown)                               // hub
  .box([3, 3], [7, 9], [4, 4], C.dbrown).box([4, 4], [7, 9], [4, 4], C.white)   // up: spar and sail
  .box([3, 3], [3, 5], [4, 4], C.dbrown).box([2, 2], [3, 5], [4, 4], C.white)   // down
  .box([0, 2], [6, 6], [4, 4], C.dbrown).box([0, 2], [7, 7], [4, 4], C.white)   // left
  .box([4, 6], [6, 6], [4, 4], C.dbrown).box([4, 6], [5, 5], [4, 4], C.white);  // right

// Weathervane: a gold rooster on an arrow, on a post.
const weathervane = grid(7, 10, 3)
  .box([2, 4], [0, 0], [0, 2], C.dgrey)
  .box([3, 3], [1, 4], [1, 1], C.dgrey)
  .box([0, 6], [5, 5], [1, 1], C.dgrey).set(0, 4, 1, C.dgrey).set(6, 5, 0, C.dgrey).set(6, 5, 2, C.dgrey)
  .layers(6, [
    ['.......', 'gggggg.', '.......'],
    ['.......', 'g..gg..', '.......'],
    ['.......', '...ggo.', '.......'],
    ['.......', '...rr..', '.......'],
  ], { g: C.gold, o: C.orange, r: C.red })
  .box([1, 5], [6, 6], [2, 2], (x) => (x >= 1 ? C.gold : null));

// Sleeping fox: a curled orange body, a big white-tipped tail wrapped round, ears up.
const fox = grid(8, 4, 6)
  .ellipsoid([3.5, 1.1, 2.6], [3.3, 1.4, 2.3], C.orange)
  .box([1, 5], [0, 1], [5, 5], C.orange).box([0, 1], [0, 1], [4, 5], C.white)   // tail round the front
  .ellipsoid([6, 1.4, 3.6], [1.3, 1.2, 1.3], C.orange)                         // head
  .set(6, 3, 3, C.orange).set(6, 2, 2, C.orange).set(6, 3, 2, C.orange)        // a pair of ears (one stands on a raised cheek)
  .set(7, 1, 4, C.ink).set(7, 2, 3, C.ink).set(7, 2, 5, C.ink)                 // nose, two closed eyes
  .set(6, 0, 4, C.white).set(7, 0, 4, C.white);                                // chin

// Tent: an orange tent, a dark doorway, a pole with a flag.
const tent = grid(7, 7, 7);
for (let y = 0; y <= 4; y++) {
  const hw = 3 - y * 0.75;
  for (let x = 0; x < 7; x++) for (let z = 1; z <= 5; z++) {
    if (Math.abs(x - 3) <= hw + 0.01) tent.set(x, y, z, C.coral);
  }
}
for (let y = 0; y <= 2; y++) for (let x = 2; x <= 4; x++) if (Math.abs(x - 3) <= 1.4 - y * 0.6) tent.set(x, y, 5, C.ink);
tent.box([3, 3], [5, 5], [3, 3], C.brown).box([3, 3], [6, 6], [3, 3], C.brown).set(4, 6, 3, C.yellow).set(4, 5, 3, C.yellow)
  .box([0, 6], [0, 0], [6, 6], (x) => (x === 1 || x === 5 ? C.dbrown : null));   // two pegs out front

// Wishing well: a stone ring with water inside, posts, a red roof and a hanging bucket.
const well = grid(7, 8, 7)
  .cylinder('y', [3, 3], 3.1, [0, 2], C.grey)
  .cylinder('y', [3, 3], 1.9, [1, 2], 0)
  .cylinder('y', [3, 3], 1.9, [1, 1], C.blue)
  .box([1, 1], [3, 5], [3, 3], C.brown).box([5, 5], [3, 5], [3, 3], C.brown)
  .box([0, 6], [6, 6], [2, 4], C.red).box([1, 5], [7, 7], [3, 3], C.red)
  .set(3, 5, 3, C.tan).set(3, 4, 3, C.tan).set(3, 3, 3, C.brown);   // rope and bucket

// Satellite dish: a wide white bowl on a stand, the feed arm leaning to one side.
const dish = grid(7, 7, 7)
  .box([2, 4], [0, 0], [2, 4], C.dgrey).box([3, 3], [1, 2], [3, 3], C.dgrey)
  .cylinder('y', [3, 3], 3.2, [4, 4], C.white)
  .cylinder('y', [3, 3], 2.2, [3, 3], C.white)
  .cylinder('y', [3, 3], 2.2, [4, 4], 0)
  .cylinder('y', [3, 3], 1.4, [3, 3], C.silver)
  .set(4, 4, 4, C.dgrey).set(4, 5, 4, C.dgrey).set(3, 6, 4, C.red).set(4, 6, 4, C.dgrey);

// Dreamcatcher: a wooden hoop, a lilac web, two feathers of different lengths.
const dreamcatcher = bitmap([
  '.bbbbb.',
  'bb.l.bb',
  'b.lll.b',
  'bll.llb',
  'b.lll.b',
  'bb.l.bb',
  '.bbbbb.',
  '..p.w..',
  '..p.w..',
  '..p....',
], 2, { b: C.brown, l: C.lilac, p: C.pink, w: C.white });

// Hummingbird: a small teal bird, a long thin beak, a red throat, wings up.
const hummingbird = grid(8, 6, 5)
  .ellipsoid([3, 2.4, 2], [2, 1.4, 1.4], C.teal)
  .ellipsoid([5, 3, 2], [1.3, 1.2, 1.2], C.teal)
  .set(6, 3, 2, C.ink).set(7, 3, 2, C.ink)                     // beak
  .set(5, 2, 3, C.red).set(5, 2, 2, C.red)                     // throat
  .set(5, 3, 3, C.ink).set(5, 3, 1, C.ink)                     // an eye each side
  .box([2, 3], [4, 5], [1, 1], C.sky).set(3, 4, 2, C.sky)      // wing raised
  .set(1, 2, 2, C.dgreen).set(0, 2, 2, C.dgreen).set(0, 1, 2, C.dgreen);   // tail

// Sleepy moon: a crescent wearing a striped nightcap with a pompom.
const moon = grid(8, 9, 3);
for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
  const inOuter = (x - 3.5) ** 2 + (y - 3.5) ** 2 <= 3.9 ** 2;
  const inBite = (x - 5.2) ** 2 + (y - 4.2) ** 2 <= 3.0 ** 2;
  if (inOuter && !inBite) for (let z = 0; z < 3; z++) moon.set(x, y, z, C.yellow);
}
moon.set(1, 4, 2, C.ink).set(2, 4, 2, C.ink)                    // closed eye
  .box([3, 4], [7, 7], [0, 2], (x) => (x === 3 ? C.navy : C.blue))
  .box([4, 5], [8, 8], [1, 1], (x) => (x === 4 ? C.blue : C.navy)).set(6, 8, 1, C.white);

// Airship: a long lilac envelope, red tail fins, a gondola with a window.
const airship = grid(10, 6, 5)
  .ellipsoid([5, 3.6, 2], [4.6, 1.9, 2], C.lilac)
  .box([3, 6], [0, 1], [2, 2], C.brown).set(5, 1, 3, C.yellow).set(5, 1, 1, C.yellow)   // a window each side
  .box([0, 0], [3, 5], [2, 2], C.red).set(1, 5, 2, C.red)           // tail fin
  .set(0, 3, 1, C.red).set(0, 3, 3, C.red);                          // side fins

// Biplane: a red fuselage, two cream wings with struts, a dark propeller.
const biplane = grid(9, 5, 9)
  .box([1, 7], [1, 2], [4, 4], C.red)
  .box([4, 5], [1, 1], [0, 8], C.cream)
  .box([4, 5], [3, 3], [0, 8], C.cream)
  .box([4, 4], [2, 2], [1, 1], C.brown).box([4, 4], [2, 2], [7, 7], C.brown)
  .box([0, 1], [3, 4], [4, 4], C.red).box([0, 0], [2, 2], [3, 5], C.red)
  .box([8, 8], [0, 3], [4, 4], C.ink).set(6, 3, 4, C.sky);

// Sun and cloud: a big sun with short rays, a cloud drifting across its lower front.
const sunCloud = grid(9, 9, 3);
for (let y = 0; y < 9; y++) for (let x = 0; x < 9; x++) {
  const r = Math.hypot(x - 4, y - 4);
  const ray = (x === 4 && (y <= 1 || y >= 7)) || (y === 4 && (x <= 1 || x >= 7))
    || ([[2, 2], [6, 6], [2, 6], [6, 2]].some(([a, b]) => a === x && b === y));
  if (r <= 2.5) { sunCloud.set(x, y, 0, C.orange); sunCloud.set(x, y, 1, C.yellow); }
  else if (ray) { sunCloud.set(x, y, 0, C.orange); sunCloud.set(x, y, 1, C.orange); }
}
sunCloud.ellipsoid([5, 2, 2], [2.4, 1.3, 1.2], C.white).ellipsoid([6.8, 1.6, 2], [1.8, 1.1, 1.2], C.white);

// Windsock: a pole and a striped sock that tapers and droops in the breeze.
const windsock = grid(8, 8, 3)
  .box([0, 0], [0, 7], [1, 1], C.dgrey).box([0, 1], [0, 0], [0, 2], C.dgrey)
  .box([1, 2], [5, 7], [1, 1], (x) => (x === 1 ? C.red : C.white))
  .box([1, 2], [6, 6], [0, 2], (x) => (x === 1 ? C.red : C.white))
  .box([3, 4], [5, 6], [1, 1], (x) => (x === 3 ? C.red : C.white))
  .box([5, 6], [4, 5], [1, 1], (x) => (x === 5 ? C.red : C.white))
  .set(7, 4, 1, C.red);

const entry = (id, name, s, extra = {}) => ({ id: `cand-${id}`, name, dims: s.dims, cell: s.cell, ...extra });

export default [
  entry('bat', 'Bat', bat),
  entry('lamp-post', 'Lamp Post', lampPost),
  entry('shooting-star', 'Shooting Star', shootingStar),
  entry('campfire', 'Campfire', campfire),
  entry('paper-plane', 'Paper Plane', paperPlane),
  entry('alien', 'Alien', alien),
  entry('helmet', 'Astronaut Helmet', helmet),
  entry('raindrop', 'Raindrop', raindrop),
  entry('rain-cloud', 'Rain Cloud', rainCloud),
  entry('windmill', 'Windmill', windmill),
  entry('weathervane', 'Weathervane', weathervane),
  entry('fox', 'Sleeping Fox', fox),
  entry('tent', 'Tent', tent),
  entry('well', 'Wishing Well', well),
  entry('dish', 'Satellite Dish', dish),
  entry('dreamcatcher', 'Dreamcatcher', dreamcatcher),
  entry('hummingbird', 'Hummingbird', hummingbird),
  entry('sleepy-moon', 'Sleepy Moon', moon),
  entry('airship', 'Airship', airship),
  entry('biplane', 'Biplane', biplane),
  entry('sun-cloud', 'Sun and Cloud', sunCloud),
  entry('windsock', 'Windsock', windsock),
];
void ell; void disc;
