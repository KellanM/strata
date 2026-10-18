// Sea & Shore (III · The Lagoon), extra batch 1. Entry format and helpers: ../voxel.js.
// Authored to docs/voxel-study.md: iso silhouette first, one exaggerated identity
// feature, a clean main mass with 1–3 protrusions, 2–4 colours with jobs.
import { C, ell, disc, grid } from '../voxel.js';

// a 2D picture (rows top to bottom) extruded through z0..z1 of a grid
function stamp(g, rows, [z0, z1], key) {
  const H = rows.length;
  rows.forEach((row, r) => [...row].forEach((ch, x) => {
    if (key[ch] !== undefined) for (let z = z0; z <= z1; z++) g.set(x, H - 1 - r, z, key[ch]);
  }));
  return g;
}

// Pufferfish: a round yellow body with stubby spikes, cream belly, coral fins.
const puffer = grid(7, 7, 7)
  .ellipsoid([3, 3, 3], [2.6, 2.6, 2.6], (x, y) => (y <= 2 ? C.cream : C.yellow));
for (const [x, y, z] of [[3, 6, 3], [5, 5, 3], [1, 5, 2], [6, 3, 2], [6, 4, 4], [3, 5, 5], [5, 3, 5], [3, 3, 0], [1, 3, 5]])
  puffer.set(x, y, z, C.gold);
puffer.set(0, 3, 3, C.coral).set(0, 4, 3, C.coral).set(0, 2, 3, C.coral)
  .set(2, 4, 5, C.ink).set(4, 4, 5, C.ink).set(3, 2, 6, C.coral);

// Sandcastle: a keep and a taller front tower, crenellated, with a red flag.
const castle = grid(8, 8, 6)
  .box([0, 7], [0, 1], [0, 5], C.sand)
  .box([1, 4], [2, 4], [1, 3], C.sand)
  .box([5, 7], [2, 5], [3, 5], C.sand)
  .box([3, 3], [2, 3], [3, 3], C.dbrown);
for (const x of [1, 3]) castle.set(x, 5, 1, C.sand).set(x, 5, 3, C.sand);
for (const [x, z] of [[5, 3], [7, 3], [5, 5], [7, 5]]) castle.set(x, 6, z, C.sand);
castle.set(6, 6, 4, C.dbrown).set(6, 7, 4, C.dbrown).set(7, 7, 4, C.red).set(1, 1, 5, C.coral);

// Beach umbrella: a striped dome on a pole, a towel beneath.
const umbrella = grid(7, 7, 7)
  .box([3, 3], [0, 4], [3, 3], C.white)
  .ellipsoid([3, 4.6, 3], [3.3, 1.8, 3.3], (x, y, z) => {
    if (y < 5) return null;
    const s = Math.floor((Math.atan2(z - 3, x - 3) + Math.PI) / (Math.PI / 3)) % 2;
    return s ? C.red : C.white;
  })
  .box([4, 6], [0, 0], [3, 6], (x) => (x === 5 ? C.white : C.blue));

// Bucket and spade: a red pail of sand with an arched handle, a blue spade leaning on it.
const bucket = grid(6, 6, 5)
  .cylinder('y', [2, 2], 2.2, [0, 3], C.red)
  .cylinder('y', [2, 2], 1.2, [2, 3], 0)
  .cylinder('y', [2, 2], 1.2, [2, 2], C.sand)
  .set(0, 4, 2, C.grey).set(4, 4, 2, C.grey).box([0, 4], [5, 5], [2, 2], C.grey)
  .box([5, 5], [0, 1], [1, 3], C.blue).box([5, 5], [2, 4], [2, 2], C.yellow);

// Message in a bottle: sea-glass bottle lying down, a cork, a scroll inside to peel to.
const bottle = grid(8, 4, 4)
  .cylinder('x', [1.5, 1.5], 1.6, [0, 5], C.sky)
  .box([2, 4], [1, 2], [1, 2], C.cream)
  .box([6, 6], [1, 2], [1, 2], C.sky)
  .box([7, 7], [1, 2], [1, 2], C.brown);

// Dolphin: a slim arched body mid-leap, tail fluke up, dorsal fin, pale belly, long beak.
const dolphin = stamp(grid(10, 5, 3), [
  '......b...',
  'b....bb...',
  'bb.bbbbbb.',
  '.bbbbbbbbb',
  '..wwwwww..',
], [1, 2], { b: C.blue, w: C.cream });
dolphin.box([6, 6], [4, 4], [2, 2], 0).set(7, 2, 2, C.ink).set(4, 1, 0, C.blue).set(5, 1, 0, C.blue);

// Seal on a rock, balancing a ball on its nose.
const seal = grid(7, 8, 5)
  .ellipsoid([3, 1, 2], [3.3, 1.5, 2.4], (x, y) => (y <= 1 ? C.dgrey : null))
  .ellipsoid([3, 3.5, 2], [1.5, 2, 1.5], C.silver)
  .ellipsoid([3, 5.5, 2.5], [1.5, 1.2, 1.5], C.silver)
  .set(2, 6, 3, C.ink).set(4, 6, 3, C.ink).set(3, 5, 4, C.ink)
  .set(3, 7, 2, C.red).set(5, 3, 2, C.grey);

// Clam: a ribbed pink shell, lid tipped open at the back, a pearl inside.
const clam = grid(7, 5, 6)
  .ellipsoid([3, 1, 3], [3.2, 1.3, 2.6], (x, y) => (y > 1 ? null : x % 2 ? C.rose : C.pink))
  .ellipsoid([3, 1.8, 3], [2.2, 0.8, 1.6], (x, y) => (y >= 1 ? 0 : null))
  .box([1, 5], [1, 4], [0, 0], (x) => (x % 2 ? C.rose : C.pink))
  .set(3, 1, 3, C.white).set(3, 1, 2, C.pink);

// Pelican: white bird with an outsized orange beak and gold pouch, grey wing.
const pelican = grid(6, 7, 7)
  .ellipsoid([2.5, 3, 2.5], [2.2, 1.8, 2.2], (x) => (x >= 4 || x <= 1 ? C.grey : C.white))   // a grey wing each side
  .box([2, 3], [5, 6], [2, 3], C.white)
  .box([2, 3], [6, 6], [4, 6], C.orange)
  .box([2, 3], [5, 5], [4, 5], C.gold)
  .set(3, 6, 2, C.ink).set(2, 6, 2, C.ink)   // an eye each side
  .box([2, 2], [0, 1], [2, 2], C.orange).box([3, 3], [0, 1], [3, 3], C.orange);

// Rowing boat: blue sides, a white gunwale, a wooden floor and seat, one oar out to the side.
const rowboat = grid(9, 4, 5);
for (let x = 0; x <= 8; x++) {
  const w = x === 0 || x === 8 ? 0 : x === 1 || x === 7 ? 1 : 2;
  rowboat.box([x, x], [0, 0], [2 - Math.min(w, 1), 2 + Math.min(w, 1)], C.navy)
    .box([x, x], [1, 1], [2 - w, 2 + w], C.blue)
    .box([x, x], [2, 2], [2 - w, 2 + w], C.white);
  if (w === 2) rowboat.box([x, x], [1, 2], [1, 3], 0).box([x, x], [1, 1], [1, 3], C.tan);
}
rowboat.box([4, 4], [2, 2], [1, 3], C.crust).set(0, 2, 2, C.white).set(0, 3, 2, C.red)
  .box([5, 5], [3, 3], [2, 4], C.tan);

// Fishing float: red cap over a white body, a slender tip set a little off-centre.
const float = grid(4, 8, 4)
  .ellipsoid([1.5, 2.5, 1.5], [1.7, 1.6, 1.7], (x, y) => (y >= 3 ? C.red : C.white))
  .ellipsoid([1.5, 3.8, 1.5], [1.2, 1.2, 1.2], C.red)
  .box([1, 2], [0, 1], [1, 2], C.white)
  .box([2, 2], [5, 7], [2, 2], C.white).set(2, 7, 2, C.red);

// Flip-flops: a staggered pair of blue soles with pink V straps.
const flipflops = grid(7, 2, 7)
  .box([0, 2], [0, 0], [0, 5], C.blue)
  .box([3, 5], [0, 0], [1, 6], C.sky)
  .set(1, 1, 1, C.pink).set(0, 1, 2, C.pink).set(2, 1, 2, C.pink)
  .set(4, 1, 2, C.pink).set(3, 1, 3, C.pink).set(5, 1, 3, C.pink);

// Lifeguard tower: white legs, a red platform and chair, a striped roof.
const tower = grid(6, 9, 6)
  .box([0, 5], [5, 5], [0, 5], C.red)
  .box([1, 4], [6, 6], [0, 1], C.cream).box([1, 4], [7, 7], [0, 0], C.cream)
  .box([1, 4], [8, 8], [0, 3], (x) => (x % 2 ? C.white : C.red))
  .box([1, 1], [6, 7], [3, 3], C.white).box([4, 4], [6, 7], [3, 3], C.white);
for (const [x, z] of [[1, 1], [4, 1], [1, 4], [4, 4]]) tower.box([x, x], [0, 4], [z, z], C.white);
tower.box([2, 3], [1, 1], [4, 4], C.white).box([2, 3], [3, 3], [4, 4], C.white);

// Ice lolly: three stripes on a stick, a bite taken from the top corner.
const lolly = grid(4, 8, 3)
  .box([0, 3], [2, 7], [0, 2], (x, y) => (y >= 6 ? C.pink : y >= 4 ? C.white : C.leaf))
  .box([1, 2], [0, 1], [1, 1], C.tan)
  .clear(3, 7, 0).clear(3, 7, 1).clear(3, 7, 2).clear(3, 6, 2).clear(0, 7, 0);

// Narwhal: navy back, cream belly, a long spiralled tusk, tail fluke.
const narwhal = grid(10, 5, 5)
  .ellipsoid([3.6, 2, 2], [3.2, 1.7, 1.7], (x, y) => (y <= 1 ? C.cream : C.navy))
  .box([7, 9], [2, 2], [2, 2], (x) => (x % 2 ? C.sand : C.cream))
  .box([0, 0], [2, 3], [1, 3], C.navy)
  .set(5, 3, 3, C.ink);

// Hermit crab: a big banded spiral shell, a little red crab peeking out the front.
const hermit = grid(7, 6, 6)
  .ellipsoid([2.5, 2.8, 2.5], [2.3, 2.6, 2.3], (x, y) => (y % 2 ? C.coral : C.cream))
  .box([3, 5], [0, 1], [3, 5], C.red)
  .box([5, 6], [1, 2], [5, 5], C.red).set(6, 2, 4, C.red)
  .set(4, 2, 5, C.red).set(4, 3, 5, C.ink).set(3, 2, 5, C.red).set(3, 3, 5, C.ink);

// Whale tail: a navy fluke rising from the water, two splashes.
const tail = stamp(grid(7, 7, 3), [
  'nn...nn',
  '.nn.nn.',
  '..nnn..',
  '...n...',
  '...n...',
  '..nnn..',
  '.......',
], [1, 1], { n: C.navy });
tail.box([0, 6], [0, 0], [0, 2], C.sky).set(1, 1, 1, C.white).set(5, 1, 2, C.white).set(3, 1, 1, C.navy);

// Diving helmet: a copper dome, a big dark glass port in a gold ring, a small side port.
const helmet = grid(7, 7, 7)
  .box([0, 5], [0, 1], [0, 5], C.bronze)
  .ellipsoid([2.5, 4, 2.5], [2.6, 2.6, 2.6], (x, y) => (y >= 2 ? C.terracotta : null))
  .box([1, 4], [2, 5], [6, 6], (x, y) => (x >= 2 && x <= 3 && y >= 3 && y <= 4 ? C.navy : C.gold))
  .box([1, 4], [2, 5], [5, 5], (x, y) => (x >= 2 && x <= 3 && y >= 3 && y <= 4 ? C.navy : null))
  .box([5, 5], [3, 4], [2, 3], C.gold).box([6, 6], [3, 4], [2, 3], C.navy);

// Ship's wheel: a wooden ring, four straight spokes with handles, a gold hub, one gold king spoke.
const wheel = grid(9, 9, 1);
for (let y = 0; y < 9; y++) for (let x = 0; x < 9; x++) {
  const dx = x - 4, dy = y - 4, d = Math.hypot(dx, dy);
  const spoke = dx === 0 || dy === 0;
  let c = 0;
  if (d < 1.2) c = C.gold;
  else if (d >= 2.2 && d < 3.5) c = C.brown;
  else if (spoke && d < 3.5) c = C.brown;
  else if (spoke && d < 4.5) c = C.dbrown;
  if (c) wheel.set(x, y, 0, c);
}
wheel.set(4, 8, 0, C.gold);

// Palm islet: a sand mound, a leaning trunk in two-voxel steps, fronds and coconuts.
const palm = grid(8, 8, 7)
  .ellipsoid([3.5, 0, 3], [3.6, 1.6, 3], C.sand)
  .box([3, 3], [1, 4], [3, 3], C.tan).box([4, 4], [4, 5], [3, 3], C.tan)
  .box([1, 7], [6, 6], [3, 3], C.green).box([4, 4], [6, 6], [0, 6], C.green)
  .set(1, 5, 3, C.green).set(7, 5, 3, C.green).set(4, 5, 0, C.green).set(4, 5, 6, C.green)
  .set(4, 7, 3, C.leaf).set(3, 5, 3, C.dbrown).set(5, 5, 3, C.dbrown);

export default [
  puffer.entry({ id: 'cand-pufferfish', name: 'Pufferfish' }),
  castle.entry({ id: 'cand-sandcastle', name: 'Sandcastle' }),
  umbrella.entry({ id: 'cand-beach-umbrella', name: 'Beach Umbrella' }),
  bucket.entry({ id: 'cand-bucket-spade', name: 'Bucket & Spade' }),
  bottle.entry({ id: 'cand-message-bottle', name: 'Message in a Bottle' }),
  dolphin.entry({ id: 'cand-dolphin', name: 'Dolphin' }),
  seal.entry({ id: 'cand-seal', name: 'Seal on a Rock' }),
  clam.entry({ id: 'cand-clam', name: 'Clam & Pearl' }),
  pelican.entry({ id: 'cand-pelican', name: 'Pelican' }),
  rowboat.entry({ id: 'cand-rowing-boat', name: 'Rowing Boat' }),
  float.entry({ id: 'cand-fishing-float', name: 'Fishing Float' }),
  flipflops.entry({ id: 'cand-flip-flops', name: 'Flip-Flops' }),
  tower.entry({ id: 'cand-lifeguard-tower', name: 'Lifeguard Tower' }),
  lolly.entry({ id: 'cand-ice-lolly', name: 'Ice Lolly' }),
  narwhal.entry({ id: 'cand-narwhal', name: 'Narwhal' }),
  hermit.entry({ id: 'cand-hermit-crab', name: 'Hermit Crab' }),
  tail.entry({ id: 'cand-whale-tail', name: 'Whale Tail' }),
  helmet.entry({ id: 'cand-diving-helmet', name: 'Diving Helmet' }),
  wheel.entry({ id: 'cand-ships-wheel', name: "Ship's Wheel" }),
  palm.entry({ id: 'cand-palm-islet', name: 'Palm Islet' }),
];
void ell; void disc;
