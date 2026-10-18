// Temples & Lanterns (IV · Ember Steps), extra batch 1. Entry format and helpers: ../voxel.js.
// Authored to docs/voxel-study.md: iso silhouette first, one exaggerated identity
// feature, a clean main mass with 1–3 protrusions, 2–4 colours with jobs.
import { C, grid } from '../voxel.js';

function stamp(g, rows, [z0, z1], key) {
  const H = rows.length;
  rows.forEach((row, r) => [...row].forEach((ch, x) => {
    if (key[ch] !== undefined) for (let z = z0; z <= z1; z++) g.set(x, H - 1 - r, z, key[ch]);
  }));
  return g;
}

// Maneki-neko: the beckoning cat, one paw raised high, red collar, gold coin.
const neko = grid(6, 8, 5)
  .ellipsoid([2.5, 1.8, 2], [2.2, 1.9, 1.8], C.white)
  .box([1, 4], [4, 6], [1, 3], C.white)
  .box([1, 4], [4, 4], [3, 3], C.red)
  .set(1, 7, 2, C.white).set(4, 7, 2, C.white).set(1, 7, 1, C.pink).set(4, 7, 1, C.pink)
  .set(2, 5, 3, C.ink).set(4, 5, 3, C.ink)
  .box([5, 5], [3, 6], [2, 2], C.white).set(5, 6, 3, C.pink)
  .box([2, 3], [2, 3], [4, 4], C.gold);

// Dragon head: green snout forward, gold horns, red mane, one golden whisker.
const dragon = grid(8, 7, 6)
  .box([1, 6], [2, 5], [0, 3], C.green)
  .box([2, 5], [2, 4], [4, 5], C.green)
  .box([2, 5], [1, 1], [2, 5], C.dgreen)
  .set(2, 4, 5, C.dgreen).set(5, 4, 5, C.dgreen)
  .set(2, 2, 5, C.white).set(5, 2, 5, C.white)
  .set(2, 5, 3, C.ink).set(5, 5, 3, C.ink)
  .set(1, 6, 1, C.gold).set(1, 6, 0, C.gold).set(6, 6, 1, C.gold).set(6, 6, 0, C.gold)   // a matching pair of horns
  .box([0, 0], [3, 5], [1, 2], C.red).box([7, 7], [3, 5], [1, 2], C.red)
  .set(0, 3, 5, C.gold).set(1, 3, 5, C.gold).set(6, 3, 5, C.gold).set(7, 3, 5, C.gold);   // whiskers on both sides

// Moon gate: a cream wall with a round opening, a tiled cap, a blossom branch through it.
const moongate = grid(9, 8, 3)
  .box([0, 8], [0, 6], [0, 1], (x, y) => (Math.hypot(x - 4, y - 3.5) < 2.7 ? 0 : C.cream))
  .box([0, 8], [7, 7], [0, 2], C.navy)
  .box([0, 8], [0, 0], [2, 2], C.grey)
  .set(6, 5, 1, C.dbrown).set(5, 5, 1, C.pink).set(5, 4, 1, C.pink).set(6, 6, 2, C.pink);

// Shrine: a little wooden hut on a stone base, red gable roof, a rope and bell, an offering box.
const shrine = grid(7, 7, 6)
  .box([0, 6], [0, 0], [0, 5], C.grey)
  .box([1, 5], [1, 3], [1, 4], C.tan)
  .box([2, 4], [1, 2], [4, 4], C.dbrown)
  .box([0, 6], [4, 4], [0, 5], C.red).box([1, 5], [5, 5], [0, 5], C.red).box([2, 4], [6, 6], [0, 5], C.dbrown)
  .box([3, 3], [2, 3], [5, 5], C.red).set(3, 1, 5, C.gold);

// Prayer flags: two posts strung with a line of coloured flags.
const flags = grid(9, 6, 3)
  .box([0, 0], [0, 5], [1, 1], C.dbrown).box([8, 8], [0, 5], [1, 1], C.dbrown)
  .box([0, 8], [0, 0], [0, 2], C.grey)
  .box([1, 7], [5, 5], [1, 1], C.tan);
[C.blue, C.white, C.red, C.green, C.yellow, C.blue, C.white].forEach((c, k) => flags.box([1 + k, 1 + k], [3, 4], [1, 1], c));

// Guardian lion: a seated stone komainu, dark curled mane, a red ball under one paw.
const lion = grid(6, 8, 6)
  .box([1, 4], [0, 4], [1, 4], C.grey)
  .box([0, 5], [4, 7], [1, 2], C.dgrey)
  .box([1, 4], [5, 7], [2, 5], C.grey)
  .box([1, 1], [0, 2], [5, 5], C.grey).box([4, 4], [0, 2], [5, 5], C.grey)
  .set(1, 6, 5, C.ink).set(4, 6, 5, C.ink).box([2, 3], [5, 5], [5, 5], C.red)   // eyes centred on the face
  .box([5, 5], [0, 1], [4, 5], C.red);

// Rice bowl: a wide blue bowl with a pale rim, a dome of white rice, slim dark chopsticks on top.
const rice = grid(8, 5, 7)
  .cylinder('y', [3, 3], 1.4, [0, 0], C.navy)
  .cylinder('y', [3, 3], 2.7, [1, 2], (x, y) => (y === 2 ? C.sky : C.blue))
  .cylinder('y', [3, 3], 2.0, [2, 2], C.white)
  .cylinder('y', [3, 3], 1.6, [3, 3], C.white)
  .box([1, 7], [4, 4], [3, 3], C.dbrown).box([2, 7], [4, 4], [4, 4], C.dbrown);

// Tea bowl and whisk: an earthen bowl of bright matcha, a bamboo whisk standing beside it.
const matcha = grid(7, 6, 6)
  .cylinder('y', [3, 3], 1.5, [0, 0], C.terracotta)
  .cylinder('y', [3, 3], 2.4, [1, 2], C.terracotta)
  .cylinder('y', [3, 3], 1.6, [2, 2], C.leaf)
  .box([6, 6], [0, 1], [2, 4], C.cream).set(6, 2, 3, C.cream).box([6, 6], [3, 5], [3, 3], C.tan);

// Koinobori: one big carp streamer flying from a pole: open white mouth, big eye, scale bands, forked tail.
const koi = grid(10, 8, 4)
  .box([0, 0], [0, 7], [1, 1], C.dbrown).set(0, 7, 1, C.gold)
  .box([1, 7], [2, 6], [1, 2], (x, y) => (y === 2 ? C.white : (x + y) % 3 === 0 ? C.rose : C.red))
  .box([8, 8], [3, 5], [1, 2], C.red)
  .box([9, 9], [1, 3], [1, 2], C.red).box([9, 9], [5, 7], [1, 2], C.red)
  .box([1, 1], [3, 5], [1, 2], C.white).set(1, 4, 2, 0)
  .set(2, 5, 3, C.white).set(3, 5, 3, C.ink)
  .set(2, 5, 0, C.white).set(3, 5, 0, C.ink);   // an eye on each side

// Red bridge: an arched lacquered bridge with railings and gold post caps.
const bridge = grid(9, 6, 4);
const hump = [0, 1, 2, 3, 3, 3, 2, 1, 0];
hump.forEach((h, x) => {
  bridge.box([x, x], [Math.max(0, h - 1), h], [1, 2], C.red);
  if (x <= 1 || x >= 7) bridge.box([x, x], [0, h], [1, 2], C.red);
  bridge.set(x, h + 1, 3, C.red).set(x, h, 3, C.red);
});
for (const x of [0, 4, 8]) bridge.set(x, hump[x] + 2, 3, C.gold).set(x, hump[x] + 1, 3, C.red);

// Bamboo: three stalks of different heights with darker nodes and a few leaves.
const bamboo = grid(6, 10, 5).box([0, 5], [0, 0], [0, 4], C.dbrown);
for (const [x, z, h] of [[1, 1, 9], [3, 3, 7], [4, 1, 5]]) {
  for (let y = 1; y <= h; y++) bamboo.set(x, y, z, y % 3 === 0 ? C.dgreen : C.green);
  bamboo.set(x + 1, h, z, C.leaf).set(x, h, z + 1, C.leaf);
}

// Zen garden: raked sand in rings around a mossy boulder, a small stone near the edge.
const zen = grid(8, 4, 7)
  .box([0, 7], [0, 0], [0, 6], (x, y, z) => (Math.round(Math.hypot(x - 2, z - 2)) % 2 ? C.sand : C.cream))
  .ellipsoid([2, 1, 2], [1.8, 1.8, 1.6], (x, y) => (y >= 1 ? C.grey : null))
  .set(2, 3, 2, C.dgrey).set(1, 1, 3, C.green).set(3, 1, 3, C.green).set(3, 1, 1, C.green)
  .box([5, 6], [1, 1], [4, 5], C.dgrey).set(6, 2, 5, C.dgrey);

// Sake set: a white bottle with a blue band and two cups, on a black lacquer tray.
const sake = grid(7, 6, 5)
  .box([0, 6], [0, 0], [0, 4], C.ink)
  .cylinder('y', [2, 2], 1.5, [1, 3], (x, y) => (y === 2 ? C.navy : C.white))
  .cylinder('y', [2, 2], 0.6, [4, 5], C.white).set(2, 5, 2, C.navy)
  .box([4, 5], [1, 1], [1, 2], C.white).box([5, 5], [1, 1], [3, 4], C.white);

// Kokeshi: a wooden doll, red kimono with pink flowers, black hair, a red bow on one side.
// Drawn layer by layer, five wide so the face has room: hair over the back and
// top, a cream face at the front with two eyes and two pink cheeks, mirrored,
// and a red bow at one side (the one deliberate asymmetry).
const kokeshi = grid(5, 9, 5)
  .cylinder('y', [2, 2], 1.9, [0, 4], (x, y, z) => ((x + y + z) % 3 === 0 && y > 0 ? C.pink : C.red))
  .layers(5, [
    ['.kkk.', 'kkkkk', 'kccck', 'ccccc', '.pcp.'],   // cheeks
    ['.kkk.', 'kkkkk', 'kccck', 'ccccc', '.ece.'],   // eyes
    ['.kkk.', 'kkkkk', 'kccck', 'kccck', '.ccc.'],   // forehead, clear of the hair
    ['.kkk.', 'kkkkk', 'kkkkr', 'kkkkk', '.kkk.'],
  ], { k: C.ink, c: C.cream, p: C.pink, e: C.ink, r: C.red });

// Wind chime (fūrin): a glass bell with a painted goldfish, a paper strip below.
const furin = grid(5, 8, 5)
  .ellipsoid([2, 4, 2], [1.9, 1.6, 1.9], (x, y) => (y >= 3 ? C.sky : null))
  .set(2, 4, 4, C.red).set(1, 4, 4, C.red)
  .box([2, 2], [6, 7], [2, 2], C.dgrey)
  .box([2, 2], [2, 2], [2, 2], C.tan).box([2, 3], [0, 1], [2, 2], C.cream);

// Dango: three sweet dumplings, green, white and pink, on a skewer.
const dango = grid(5, 9, 5)
  .box([2, 2], [0, 8], [2, 2], C.tan)
  .ellipsoid([2, 2, 2], [1.5, 1.2, 1.5], C.leaf)
  .ellipsoid([2, 4.4, 2], [1.5, 1.2, 1.5], C.white)
  .ellipsoid([2, 6.8, 2], [1.5, 1.2, 1.5], C.pink);

// Cherry blossom: a dark trunk with a crooked branch, clouds of pink blossom.
const sakura = grid(8, 9, 7)
  .box([3, 4], [0, 4], [3, 3], C.dbrown)
  .box([5, 6], [4, 4], [3, 3], C.dbrown).set(6, 5, 3, C.dbrown)
  .ellipsoid([3, 6.6, 3], [3, 1.8, 2.6], (x, y, z) => ((x * 7 + y * 3 + z * 5) % 5 === 0 ? C.rose : C.pink))
  .ellipsoid([6, 5.6, 3], [1.6, 1.3, 1.6], C.pink);

// Stone frog: a mossy grey frog statue with bulging eyes.
const sfrog = grid(6, 5, 6)
  .ellipsoid([2.5, 1.5, 2.5], [2.6, 1.6, 2.6], (x, y, z) => (y >= 2 && (x + z) % 3 === 0 ? C.green : C.grey))
  .box([1, 4], [0, 0], [4, 5], C.grey)
  .set(1, 3, 4, C.grey).set(4, 3, 4, C.grey).set(1, 4, 4, C.ink).set(4, 4, 4, C.ink)
  .box([2, 3], [1, 1], [5, 5], C.dgrey);

// Origami fox: a folded orange fox, tall pointed ears, white cheeks and tail tip.
const fox = grid(7, 6, 5)
  .box([1, 4], [0, 1], [1, 3], C.orange)
  .box([3, 6], [2, 3], [1, 3], C.orange)
  .box([3, 3], [4, 5], [1, 1], C.orange).box([6, 6], [4, 5], [1, 1], C.orange)   // a pair of ears
  .box([4, 5], [2, 2], [3, 3], C.white).set(3, 3, 3, C.ink).set(6, 3, 3, C.ink)   // eyes either side of the muzzle
  .box([0, 0], [1, 3], [1, 2], C.orange).set(0, 4, 1, C.white).set(0, 3, 1, C.white);

// Ema: a wooden votive plaque, a red cord at the top, a painted red sun.
const ema = stamp(grid(6, 7, 2), [
  '..rr..',
  '..rr..',
  '.tttt.',
  'tttttt',
  'ttssst',
  'ttssst',
  'tttttt',
], [0, 1], { t: C.tan, r: C.red, s: C.red });
ema.box([0, 5], [0, 0], [1, 1], C.crust).box([1, 4], [5, 5], [0, 0], C.crust);

export default [
  neko.entry({ id: 'cand-maneki-neko', name: 'Maneki-neko' }),
  dragon.entry({ id: 'cand-dragon-head', name: 'Dragon Head' }),
  moongate.entry({ id: 'cand-moon-gate', name: 'Moon Gate' }),
  shrine.entry({ id: 'cand-shrine', name: 'Shrine' }),
  flags.entry({ id: 'cand-prayer-flags', name: 'Prayer Flags' }),
  lion.entry({ id: 'cand-guardian-lion', name: 'Guardian Lion' }),
  rice.entry({ id: 'cand-rice-bowl', name: 'Rice Bowl' }),
  matcha.entry({ id: 'cand-matcha', name: 'Tea Bowl & Whisk' }),
  koi.entry({ id: 'cand-koinobori', name: 'Koinobori' }),
  bridge.entry({ id: 'cand-red-bridge', name: 'Red Bridge' }),
  bamboo.entry({ id: 'cand-bamboo', name: 'Bamboo' }),
  zen.entry({ id: 'cand-zen-garden', name: 'Zen Garden' }),
  sake.entry({ id: 'cand-sake-set', name: 'Sake Set' }),
  kokeshi.entry({ id: 'cand-kokeshi', name: 'Kokeshi' }),
  furin.entry({ id: 'cand-wind-chime', name: 'Wind Chime' }),
  dango.entry({ id: 'cand-dango', name: 'Dango' }),
  sakura.entry({ id: 'cand-cherry-blossom', name: 'Cherry Blossom' }),
  sfrog.entry({ id: 'cand-stone-frog', name: 'Stone Frog' }),
  fox.entry({ id: 'cand-origami-fox', name: 'Origami Fox' }),
  ema.entry({ id: 'cand-ema', name: 'Ema Plaque' }),
];
