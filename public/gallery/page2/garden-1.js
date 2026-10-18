// Page 2 · Garden & Small Creatures: easy openers for Moss Garden (to replace
// Ladybug). Small (mostly 4–6 per side), 2–3 colours, one cute detail each.
// Entry format and helpers: ../voxel.js. Checklist: docs/voxel-study.md.
// The iso view looks from +x +z, so faces and details face high x / high z.
import { C, grid } from '../voxel.js';

const mouse = 0xb7b4bd, blush = 0xf4a3b5, shell = 0xf3ead8, nest = 0xa77750, egg = 0x9fd3e6,
  soil = 0x7a5640, peach = 0xf7b08a, corn = 0xf3cf55, husk = 0x9cc46f, beetle = 0x3f9a8f,
  bell = 0x7d8fe0, daff = 0xf6d24e, trumpet = 0xf29b38, worm = 0xec9aa6, lettuce = 0x9fd27a,
  pine = 0x9a6a45, dew = 0x9fd8f0, turnip = 0xf1e6f0, plum = 0xa66fb8;

// layers(y0 up), each layer = rows by z (back first), chars by x
const L = (X, Y, Z, rows, key, meta, extra) => {
  const g = grid(X, Y, Z).layers(0, rows, key);
  if (extra) extra(g);
  return g.entry(meta);
};

const ENTRIES = [
  // a field mouse: round grey body, pink ears and nose, a curling tail behind
  (() => {
    const g = grid(6, 4, 4);
    g.ellipsoid([2.4, 1.1, 1.5], [2.1, 1.25, 1.3], mouse)
      .ellipsoid([4.4, 1.3, 1.5], [1.25, 1.1, 1.05], mouse)
      .set(4, 2, 0, blush).set(4, 3, 0, blush).set(4, 2, 3, blush).set(4, 3, 3, blush)   // two round ears
      .set(5, 1, 1, blush).set(5, 1, 2, blush)                 // nose
      .set(5, 2, 1, C.ink).set(5, 2, 2, C.ink)                 // two eyes
      .set(0, 1, 1, blush).set(0, 2, 1, blush).set(0, 3, 1, blush).set(1, 3, 1, blush);   // tail curling up
    return g.entry({ id: 'cand-p2-mouse', name: 'Field Mouse' });
  })(),

  // a chick hatching: cracked white shell below, fluffy yellow head popping out
  L(5, 6, 5, [
    ['.sss.', 'sssss', 'sssss', 'sssss', '.sss.'],
    ['.sss.', 's...s', 's...s', 's...s', '.sss.'],
    ['.s.s.', 'syyys', '.yyy.', 'syyys', '.s.s.'],
    ['.....', '.yyy.', '.yyy.', '.yyy.', '.....'],
    ['.....', '.yyy.', '.yyy.', '.kyk.', '..o..'],
    ['.....', '..y..', '.yyy.', '.....', '.....'],
  ], { s: shell, y: C.yellow, k: C.ink, o: C.orange }, { id: 'cand-p2-chick', name: 'Hatching Chick' }),

  // a bird's nest: a woven brown ring holding three blue eggs
  L(6, 3, 6, [
    ['.nnnn.', 'nnnnnn', 'nnnnnn', 'nnnnnn', 'nnnnnn', '.nnnn.'],
    ['.nnnn.', 'n.e..n', 'n..e.n', 'n.e..n', 'n....n', '.nnnn.'],
    ['..n.n.', 'n....n', '...e..', 'n.....', '.....n', '.n.n..'],
  ], { n: nest, e: egg }, { id: 'cand-p2-nest', name: "Bird's Nest" }),

  // a sprout in a pot: terracotta pot of soil, two round leaves on a stem
  L(5, 6, 5, [
    ['.ttt.', 'ttttt', 'ttttt', 'ttttt', '.ttt.'],
    ['.ttt.', 't...t', 't...t', 't...t', '.ttt.'],
    ['.ttt.', 'tsSst', 'tsSst', 'tsSst', '.ttt.'],
    ['.....', '.....', '..g..', '.....', '.....'],
    ['.....', '..g..', '.ggl.', '.....', '.....'],
    ['.....', '.gg..', '...ll', '.....', '.....'],
  ], { t: C.terracotta, s: soil, S: soil, g: C.green, l: C.leaf }, { id: 'cand-p2-sprout', name: 'Sprout Pot' }),

  // a beetle: shiny teal shell split down the back, dark head with two horns, legs
  L(6, 3, 5, [
    ['......', '.k.k.k', '......', '.k.k.k', '......'],
    ['.bbbk.', 'bbbbkk', 'bkbbkk', 'bbbbkk', '.bbbk.'],
    ['..bb..', '.bbb..', '.kkk.k', '.bbb..', '..bb..'],
  ], { b: beetle, k: C.ink }, { id: 'cand-p2-beetle', name: 'Beetle' }),

  // a four-leaf clover: four heart leaves around a centre, a stem curling out
  L(7, 2, 7, [
    ['.......', '.......', '.......', '...d...', '.......', '.......', '.....d.'],
    ['.gg.gg.', '.gggggg', '..ggg..', 'gggdggg', '..ggg..', '.gg.gg.', '.......'],
  ], { g: C.green, d: C.dgreen }, { id: 'cand-p2-clover', name: 'Four-leaf Clover' }, (g) => {
    g.clear(6, 1, 1).set(4, 0, 4, C.dgreen).set(5, 0, 4, C.dgreen).set(5, 0, 5, C.dgreen);
  }),

  // a dandelion clock: a white seed puff on a thin green stem, one seed drifting off
  (() => {
    const g = grid(5, 7, 5);
    g.box([2, 2], [0, 3], [2, 2], C.green).set(3, 1, 2, C.leaf).set(1, 0, 2, C.leaf)
      .ellipsoid([2, 5, 2], [1.7, 1.5, 1.7], C.white)
      .set(2, 4, 2, C.cream)
      .set(4, 6, 2, C.white);                                  // a seed lifting away
    g.set(4, 5, 2, C.white);
    return g.entry({ id: 'cand-p2-dandelion', name: 'Dandelion' });
  })(),

  // a pea pod: an open dark pod, a row of bright peas showing, a curl of stem
  L(7, 3, 4, [
    ['.......', '.ddddd.', '.ddddd.', '.......'],
    ['.ddddd.', 'dPpPpPd', 'dpPpPpd', '.ddddd.'],
    ['.......', 'd......', '.......', '.......'],
  ], { d: C.dgreen, P: 0xb3e273, p: 0x95d063 }, { id: 'cand-p2-pea-pod', name: 'Pea Pod' }),

  // a radish: round pink root with a white tip and a spray of green leaves
  (() => {
    const g = grid(5, 7, 5);
    g.ellipsoid([2, 2, 2], [1.8, 1.7, 1.8], C.rose)
      .set(2, 0, 2, C.white).clear(1, 0, 2).clear(3, 0, 2).clear(2, 0, 1).clear(2, 0, 3)
      .box([2, 2], [4, 5], [2, 2], C.green).set(1, 5, 2, C.leaf).set(1, 6, 2, C.leaf)
      .set(3, 5, 2, C.green).set(3, 6, 3, C.green).set(3, 5, 3, C.green).set(2, 6, 1, C.leaf).set(2, 5, 1, C.leaf);
    return g.entry({ id: 'cand-p2-radish', name: 'Radish' });
  })(),

  // a tomato: round red fruit with a green star of leaves and a tiny stalk
  (() => {
    const g = grid(5, 5, 5);
    g.ellipsoid([2, 1.6, 2], [2.2, 1.7, 2.2], C.red)
      .set(2, 4, 2, C.dgreen).set(2, 3, 2, C.green).set(1, 3, 2, C.green).set(3, 3, 2, C.green)
      .set(2, 3, 1, C.green).set(2, 3, 3, C.green).set(3, 3, 3, C.leaf);
    return g.entry({ id: 'cand-p2-tomato', name: 'Tomato' });
  })(),

  // a garden trowel: a wooden handle and a pointed steel blade, with a speck of soil
  L(7, 2, 3, [
    ['.......', 'wwwbbb.', '.......'],
    ['.......', 'ww.sbbb', '...bbb.'],
  ], { w: C.crust, b: C.silver, s: soil }, { id: 'cand-p2-trowel', name: 'Trowel' }, (g) => {
    g.set(6, 0, 1, C.silver).clear(6, 1, 1).set(3, 1, 1, C.silver).set(3, 1, 2, C.silver).set(4, 0, 2, C.silver);
  }),

  // a rosebud: a tight pink bud on a stem with two thorny leaves
  (() => {
    const g = grid(5, 7, 5);
    g.box([2, 2], [0, 3], [2, 2], C.dgreen)
      .set(1, 2, 2, C.green).set(3, 1, 2, C.green).set(3, 1, 3, C.green)
      .ellipsoid([2, 4.8, 2], [1.4, 1.6, 1.4], C.rose)
      .set(2, 6, 2, C.pink).set(2, 5, 3, C.pink).set(3, 5, 2, C.pink)
      .set(1, 4, 2, C.green).set(2, 4, 1, C.green);
    return g.entry({ id: 'cand-p2-rosebud', name: 'Rosebud' });
  })(),

  // a pinecone: stacked rings of brown scales tapering to a point, a sprig on top
  L(5, 6, 5, [
    ['.....', '..p..', '.pPp.', '..p..', '.....'],
    ['.pPp.', 'pPpPp', 'PpPpP', 'pPpPp', '.pPp.'],
    ['.PpP.', 'PpPpP', 'pPpPp', 'PpPpP', '.PpP.'],
    ['.....', '.pPp.', '.PpP.', '.pPp.', '.....'],
    ['.....', '..P..', '.PpP.', '..P..', '.....'],
    ['.....', '.....', '..gg.', '.....', '.....'],
  ], { p: pine, P: C.dbrown, g: C.green }, { id: 'cand-p2-pinecone', name: 'Pinecone' }),

  // a leaf with a dewdrop: a broad green leaf with a vein and one bright drop
  L(7, 2, 6, [
    ['.......', '..ggg..', '.ggdgg.', 'gggdggg', '.ggdgg.', '...d...'],
    ['.......', '.......', '.......', '....w..', '.......', '.......'],
  ], { g: C.leaf, d: C.dgreen, w: dew }, { id: 'cand-p2-dewdrop', name: 'Leaf & Dewdrop' }, (g) => {
    g.set(3, 0, 0, C.leaf).set(2, 0, 0, C.leaf);
  }),

  // bluebells: a curved stem with three nodding blue bells
  (() => {
    const g = grid(6, 7, 3);
    g.box([1, 1], [0, 5], [1, 1], C.green).box([2, 4], [6, 6], [1, 1], C.green).set(1, 6, 1, C.green)
      .set(4, 5, 1, C.green)
      .box([4, 4], [3, 4], [1, 1], bell).set(5, 3, 1, bell).set(3, 3, 1, bell)
      .box([2, 2], [4, 5], [2, 2], bell).set(3, 4, 2, bell)
      .set(1, 2, 0, C.leaf).set(0, 2, 0, C.leaf);
    g.set(2, 6, 1, C.green).set(2, 6, 2, C.green).set(2, 5, 1, C.green);
    return { ...g.entry({ id: 'cand-p2-bluebell', name: 'Bluebells' }), qa: 'drop', qaWhy: 'reads as a green hook with blue blobs; the bells do not read' };
  })(),

  // an earthworm: a pink wiggly body rising out of a soil mound, a happy face
  L(7, 4, 4, [
    ['.......', '.sssss.', '.sssss.', '.......'],
    ['.......', '..ww...', '.www...', '.......'],
    ['.......', '...ww..', '....w..', '.......'],
    ['.......', '....www', '.....wk', '.......'],
  ], { s: soil, w: worm, k: C.ink }, { id: 'cand-p2-worm', name: 'Earthworm' }),

  // an ant: a round abdomen, a pinched waist, a grey head with a white eye and antenna
  L(7, 4, 5, [
    ['.......', '.k..k..', '.......', '.k..k..', '.......'],
    ['.......', 'kkk.ddw', 'kkkkddd', 'kkk.ddw', '.......'],
    ['.......', '......k', '.k...d.', '......k', '.......'],
    ['.......', '......k', '.......', '......k', '.......'],
  ], { k: C.ink, d: C.dgrey, w: C.white }, { id: 'cand-p2-ant', name: 'Ant' }),

  // a daffodil: a yellow star of petals with an orange trumpet, a tall stem and leaf
  L(5, 7, 4, [
    ['.....', '..g..', '..g..', '.....'],
    ['.....', '..g..', '.lg..', '.....'],
    ['.....', '..g..', '.lg..', '.....'],
    ['.....', '..g..', '..g..', '.....'],
    ['..y..', '.yyy.', 'yyyyy', '..y..'],
    ['.....', '.yyy.', '.yoy.', '..o..'],
    ['.....', '..y..', '.....', '.....'],
  ], { g: C.green, l: C.leaf, y: daff, o: trumpet }, { id: 'cand-p2-daffodil', name: 'Daffodil' }),

  // a peach: a soft round fruit with a crease, a blush and a single leaf
  (() => {
    const g = grid(5, 6, 5);
    g.ellipsoid([2, 2, 2], [2.1, 2, 2.1], peach)
      .set(3, 1, 4, C.coral).set(4, 1, 3, C.coral).set(4, 2, 3, C.coral).set(3, 2, 4, C.coral)
      .set(2, 3, 4, C.coral)
      .set(2, 4, 2, C.dbrown).set(2, 5, 2, C.dbrown).set(3, 5, 2, C.green).set(4, 5, 2, C.green);
    return g.entry({ id: 'cand-p2-peach', name: 'Peach' });
  })(),

  // a turnip: a round white root blushing purple on top, a tuft of leaves and a tail
  (() => {
    const g = grid(5, 7, 5);
    g.ellipsoid([2, 2.3, 2], [1.9, 1.8, 1.9], (x, y) => (y >= 3 ? plum : turnip))
      .set(2, 0, 2, turnip)
      .box([2, 2], [4, 6], [2, 2], C.green).set(1, 5, 2, C.green).set(1, 6, 2, C.leaf).set(2, 5, 3, C.leaf).set(2, 6, 3, C.green);
    return g.entry({ id: 'cand-p2-turnip', name: 'Turnip' });
  })(),

  // a corn cob: yellow kernels peeking out of peeled-back green husks
  (() => {
    const g = grid(5, 7, 5);
    g.ellipsoid([2, 3.5, 2], [1.4, 3, 1.4], corn)
      .box([1, 1], [0, 3], [2, 2], husk).box([3, 3], [0, 2], [2, 2], husk).box([2, 2], [0, 3], [1, 1], husk)
      .set(0, 3, 2, husk).set(0, 4, 2, husk).set(4, 2, 3, husk).set(4, 3, 3, husk)
      .set(2, 0, 2, C.dgreen);
    g.set(3, 2, 3, husk).set(3, 3, 3, husk);
    return g.entry({ id: 'cand-p2-corn', name: 'Corn Cob' });
  })(),

  // a moth: broad lilac wings with two dark eye spots, a fuzzy brown body
  L(7, 5, 2, [
    ['..l.l..', '.......'],
    ['.lllll.', '...b...'],
    ['lllllll', '...b...'],
    ['lklllkl', '...b...'],
    ['ll...ll', '...b...'],
  ], { l: C.lilac, k: C.ink, b: C.dbrown }, { id: 'cand-p2-moth', name: 'Moth' }),

  // a bird feeder: a red-roofed tray of seed on a post, a little blue bird on the rim
  L(5, 7, 5, [
    ['.....', '.....', '..p..', '.....', '.....'],
    ['.....', '.....', '..p..', '.....', '.....'],
    ['.....', '.....', '..p..', '.....', '.....'],
    ['.www.', 'wsssw', 'wsssw', 'wsssw', '.www.'],
    ['.....', '.w.w.', '.....', '.....', '.bb..'],
    ['rrrrr', 'rrrrr', 'rrrrr', 'rrrrr', '.....'],
    ['.....', '.rrr.', '.rrr.', '.....', '.....'],
  ], { p: C.dbrown, w: C.crust, s: C.yellow, r: C.red, b: C.sky }, { id: 'cand-p2-feeder', name: 'Bird Feeder' }),

  // a lettuce: frilly layered green leaves, paler at the heart
  L(5, 4, 5, [
    ['.ddd.', 'ddddd', 'ddddd', 'ddddd', '.ddd.'],
    ['.d.d.', '.lll.', 'dlLld', '.lll.', '.d.d.'],
    ['.....', '.l.l.', '..L..', '.l.l.', '.....'],
    ['.....', '.....', '..L..', '.....', '.....'],
  ], { d: C.dgreen, l: lettuce, L: 0xd7ee9e }, { id: 'cand-p2-lettuce', name: 'Lettuce' }),

  // a garden spider: round body, two bright eyes, legs reaching out, a silk thread above
  L(5, 6, 5, [
    ['k...k', '.....', '.....', '.....', 'k...k'],
    ['kk.kk', '.kkk.', 'kkkkk', '.kkk.', 'kk.kk'],
    ['.....', '.kkk.', '.kkk.', '.wkw.', '.....'],
    ['.....', '.....', '..k..', '.....', '.....'],
    ['.....', '.....', '..t..', '.....', '.....'],
    ['.....', '.....', '..t..', '.....', '.....'],
  ], { k: C.ink, w: C.white, t: C.silver }, { id: 'cand-p2-spider', name: 'Garden Spider' }),

  // a strawberry pot: terracotta pot of leaves, two plump strawberries hanging over the rim
  L(6, 5, 6, [
    ['.ttt..', 'ttttt.', 'ttttt.', 'ttttt.', '.ttt..', '......'],
    ['.ttt..', 't...t.', 't...tr', 't...t.', '.ttt..', '..r...'],
    ['.ttt..', 'tgggt.', 'tgggtr', 'tgggt.', '.ttt..', '..r...'],
    ['......', '.g.g..', '..g..c', '.g.g..', '......', '..c...'],
    ['......', '..g...', '.ggg..', '..g...', '......', '......'],
  ], { t: C.terracotta, g: C.green, r: C.red, c: C.leaf }, { id: 'cand-p2-strawberry-pot', name: 'Strawberry Pot' }),
];

// Clue settings tuned (tools/tune-gallery.mjs) so each sits near D 7, an easy opener.
const TUNE = {
  'cand-p2-mouse': [0.55, 1], 'cand-p2-chick': [0.2, 2], 'cand-p2-nest': [0.2, 9], 'cand-p2-sprout': [0.2, 9],
  'cand-p2-beetle': [0.5, 2], 'cand-p2-clover': [0.4, 9], 'cand-p2-dandelion': [0.25, 12], 'cand-p2-pea-pod': [0.65, 11],
  'cand-p2-radish': [0.25, 12], 'cand-p2-tomato': [0.35, 12], 'cand-p2-trowel': [0.6, 9], 'cand-p2-rosebud': [0.3, 5],
  'cand-p2-pinecone': [0.25, 5], 'cand-p2-dewdrop': [0.55, 10], 'cand-p2-bluebell': [0.4, 7], 'cand-p2-worm': [0.35, 9],
  'cand-p2-ant': [0.35, 3], 'cand-p2-daffodil': [0.4, 10], 'cand-p2-peach': [0.3, 2], 'cand-p2-turnip': [0.25, 2],
  'cand-p2-corn': [0.3, 9], 'cand-p2-moth': [0.65, 8], 'cand-p2-feeder': [0.2, 6], 'cand-p2-lettuce': [0.6, 9],
  'cand-p2-spider': [0.4, 7], 'cand-p2-strawberry-pot': [0.2, 8],
};

export default ENTRIES.map((e) => (TUNE[e.id] ? { ...e, fraction: TUNE[e.id][0], seed: TUNE[e.id][1] } : e));
