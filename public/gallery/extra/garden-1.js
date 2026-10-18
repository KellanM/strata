// Garden & Small Creatures (II · Moss Garden, Mint): extra candidates, batch 1.
// Entry format and helpers: ../voxel.js. Checklist: docs/voxel-study.md.
// The iso view looks from +x +z, so faces, eyes and identifying details face high x / high z.
import { C, grid } from '../voxel.js';

const fur = 0xe2873e, cheek = 0xf6c9b5, spine = 0x6a4d3a, belly = 0xe8cfae, rind = 0x3f8a5b,
  flesh = 0xec6a77, pear = 0xc7d66a, stone = 0xb9bfc5, water = 0x7cc4e4, sock = 0xf3e7d3;

export default [
  // a hedgehog: dark spiky back with a jagged top, pale face and nose toward you
  (() => {
    const g = grid(7, 5, 6);
    g.ellipsoid([3, 1.2, 2.4], [3, 2.6, 2.4], (x, y, z) => (y === 0 ? null : spine))
      .box([1, 5], [0, 0], [1, 3], belly)
      .box([2, 4], [1, 2], [5, 5], belly).set(3, 1, 5, belly).set(3, 2, 5, belly)
      .set(3, 1, 5, C.ink)                                       // nose
      .set(2, 2, 5, C.ink)                                       // one eye (the other is round the turn)
      .set(1, 4, 2, spine).set(3, 4, 1, spine).set(5, 4, 2, spine);   // spikes break the top line
    return g.entry({ id: 'cand-hedgehog', name: 'Hedgehog' });
  })(),

  // a butterfly: big round upper wings and small lower ones, black edges and a pale spot, slim body
  (() => {
    const g = grid(9, 8, 2);
    const inWing = (x, y) => {
      const ax = Math.abs(x - 4);
      if (ax === 0) return false;
      const upper = ((ax - 2.2) / 2.3) ** 2 + ((y - 5) / 2.2) ** 2 <= 1;
      const lower = ((ax - 1.8) / 1.6) ** 2 + ((y - 1.8) / 1.7) ** 2 <= 1;
      return upper || lower;
    };
    g.box([0, 8], [0, 7], [1, 1], (x, y) => {
      if (!inWing(x, y)) return null;
      const edge = !inWing(x - 1, y) || !inWing(x + 1, y) || !inWing(x, y - 1) || !inWing(x, y + 1);
      const ax = Math.abs(x - 4);
      if (ax === 1) return C.orange;
      if (edge) return C.ink;
      return ax === 2 && y === 5 ? C.cream : C.orange;
    })
      .box([4, 4], [1, 6], [0, 1], C.ink).set(3, 7, 1, C.ink).set(5, 7, 1, C.ink).set(4, 7, 1, C.ink);
    return g.entry({ id: 'cand-butterfly', name: 'Butterfly' });
  })(),

  // a caterpillar: round green segments rising and falling, a red face at the front
  (() => {
    const g = grid(10, 5, 3);
    const segs = [[1.2, 1.3], [3.2, 1.9], [5.2, 1.3], [7.2, 1.6]];
    segs.forEach(([x, y], k) => g.ellipsoid([x, y, 1], [1.4, 1.35, 1.2], k % 2 ? C.leaf : C.green));
    g.ellipsoid([8.6, 2.6, 1], [1.3, 1.5, 1.2], C.red)
      .set(9, 3, 2, C.ink).set(9, 4, 1, C.ink);                  // eye and antenna on the face
    for (const [x] of segs) g.set(Math.round(x), 0, 1, C.dgreen);   // little feet
    return g.entry({ id: 'cand-caterpillar', name: 'Caterpillar' });
  })(),

  // a garden gnome: tall red hat, white beard, blue coat, boots
  (() => {
    const g = grid(5, 10, 5);
    g.box([1, 3], [0, 0], [1, 3], C.dbrown)
      .box([1, 3], [1, 3], [1, 3], C.blue)
      .box([1, 3], [4, 5], [1, 3], cheek)
      .box([1, 3], [3, 5], [3, 4], C.white).set(2, 2, 4, C.white)
      .set(1, 5, 4, C.ink).set(3, 5, 4, C.ink)                   // two eyes above the beard
      .box([0, 4], [6, 6], [0, 4], C.red).box([1, 3], [7, 7], [1, 3], C.red).box([2, 2], [8, 9], [2, 2], C.red).set(3, 9, 2, C.red);   // the hat tip flops over
    return g.entry({ id: 'cand-gnome', name: 'Garden Gnome' });
  })(),

  // a bird bath: stone bowl of water on a pedestal, a little bird on the rim
  (() => {
    const g = grid(7, 6, 7);
    g.cylinder('y', [3, 3], 1.8, [0, 0], stone).cylinder('y', [3, 3], 0.8, [1, 2], stone)
      .cylinder('y', [3, 3], 3.1, [3, 3], stone).cylinder('y', [3, 3], 3.1, [4, 4], stone)
      .cylinder('y', [3, 3], 2.2, [4, 4], water)
      .set(6, 5, 3, C.red).set(6, 5, 4, 0xa86b4a);               // a robin on the rim
    return g.entry({ id: 'cand-bird-bath', name: 'Bird Bath' });
  })(),

  // a watermelon slice: a tall triangle, green rind along the bottom, black seeds
  (() => {
    const g = grid(9, 6, 2);
    for (let y = 0; y < 6; y++) {
      const half = 4.4 - y * 0.85;
      for (let x = 0; x < 9; x++) {
        if (Math.abs(x - 4) > half) continue;
        const c = y === 0 ? rind : y === 1 ? 0xd7eebf : (x + y * 3) % 5 === 0 && y < 5 ? C.ink : flesh;
        g.box([x, x], [y, y], [0, 1], c);
      }
    }
    return g.entry({ id: 'cand-watermelon', name: 'Watermelon' });
  })(),

  // a sitting fox: orange body, white chest and muzzle toward you, tall ears, a big white-tipped tail
  (() => {
    const g = grid(7, 8, 7);
    g.ellipsoid([3, 1.8, 3], [2, 1.9, 1.9], fur)
      .box([2, 4], [1, 3], [5, 5], (x, y, z) => (g.get(x, y, z - 1) ? C.white : null))
      .ellipsoid([3, 5.2, 3.4], [1.9, 1.5, 1.7], fur)
      .box([2, 4], [4, 5], [5, 5], C.white).set(3, 4, 6, C.white).set(3, 5, 6, C.ink)   // muzzle and nose
      .set(2, 6, 4, C.ink).set(4, 6, 4, C.ink)                   // eyes
      .box([1, 2], [7, 7], [3, 3], fur).box([4, 5], [7, 7], [3, 3], fur).set(1, 7, 3, C.ink).set(5, 7, 3, C.ink)   // ears with dark tips
      .box([5, 6], [0, 1], [2, 5], fur).box([5, 6], [0, 1], [6, 6], C.white);   // the tail sweeps round to the front
    return g.entry({ id: 'cand-fox', name: 'Fox' });
  })(),

  // a squirrel holding an acorn, huge plume of a tail behind
  (() => {
    const g = grid(6, 9, 5);
    g.ellipsoid([2.5, 2, 3], [1.6, 2, 1.4], C.crust)
      .ellipsoid([2.5, 4.8, 3.2], [1.4, 1.3, 1.3], C.crust)
      .set(2, 5, 4, C.ink).set(3, 4, 4, C.cream)
      .set(2, 6, 3, C.crust).set(3, 6, 3, C.crust)
      .box([2, 3], [0, 8], [0, 1], (x, y, z) => (y >= 2 && y <= 8 && (y < 7 || z === 0) ? C.brown : null))   // the tail up the back
      .box([1, 4], [7, 8], [0, 0], C.brown)
      .set(3, 2, 4, C.tan).set(3, 3, 4, C.dbrown);              // the acorn in its paws
    return g.entry({ id: 'cand-squirrel', name: 'Squirrel' });
  })(),

  // a wheelbarrow: tray of soil with a seedling, one red wheel in front, two handles
  (() => {
    const g = grid(5, 5, 9);
    g.box([0, 4], [2, 3], [2, 6], C.green).box([1, 3], [3, 3], [3, 5], C.dbrown)
      .set(2, 4, 4, C.leaf)
      .box([2, 2], [0, 2], [7, 8], C.red).box([2, 2], [1, 1], [6, 8], C.red)
      .box([0, 0], [1, 2], [0, 1], C.brown).box([4, 4], [1, 2], [0, 1], C.brown)
      .box([0, 0], [0, 1], [3, 3], C.dgrey).box([4, 4], [0, 1], [3, 3], C.dgrey);
    return g.entry({ id: 'cand-wheelbarrow', name: 'Wheelbarrow' });
  })(),

  // a pair of wellies: tall yellow boots, one slumped, socks peeking out
  (() => {
    const g = grid(6, 7, 6);
    g.box([0, 1], [0, 5], [0, 1], C.yellow).box([0, 1], [0, 1], [2, 3], C.yellow).box([0, 1], [6, 6], [0, 1], sock)
      .box([3, 4], [0, 3], [2, 3], C.yellow).box([3, 4], [0, 1], [4, 5], C.yellow).box([3, 4], [4, 4], [1, 2], C.yellow)
      .box([0, 4], [0, 0], [1, 1], C.dbrown);                    // a muddy step joining them
    return g.entry({ id: 'cand-wellies', name: 'Wellies' });
  })(),

  // a pumpkin: ribbed orange body, a curly stem, one leaf
  (() => {
    const g = grid(7, 6, 7);
    g.ellipsoid([3, 2.2, 3], [3.2, 2.3, 3.2], (x, y, z) => ((Math.round(Math.atan2(z - 3, x - 3) * 3) % 2) ? C.orange : 0xe78a2e))
      .set(3, 5, 3, C.dbrown).set(4, 5, 3, C.dbrown)
      .set(4, 5, 4, C.green).set(5, 5, 4, C.green);
    return g.entry({ id: 'cand-pumpkin', name: 'Pumpkin' });
  })(),

  // a pear: full bottom, narrow neck, a stalk that leans and a leaf
  (() => {
    const g = grid(5, 8, 5);
    g.ellipsoid([2, 2, 2], [2.2, 2.2, 2.2], pear).ellipsoid([2, 4.5, 2], [1.4, 1.6, 1.4], pear)
      .box([2, 2], [6, 7], [2, 2], C.brown).set(3, 7, 2, C.brown).set(3, 6, 2, C.green).set(4, 6, 2, C.green)
      .set(3, 2, 4, C.yellow);                                   // a blush where the light hits
    return g.entry({ id: 'cand-pear', name: 'Pear' });
  })(),

  // two cherries on joined stems, one higher than the other
  (() => {
    const g = grid(7, 8, 3);
    g.ellipsoid([1.6, 1.4, 1], [1.5, 1.5, 1.3], C.red).ellipsoid([5, 2.4, 1], [1.5, 1.5, 1.3], C.dred)
      .box([2, 2], [3, 5], [1, 1], C.green).box([4, 4], [4, 5], [1, 1], C.green)
      .box([2, 4], [6, 6], [1, 1], C.green).set(3, 7, 1, C.green).set(4, 7, 1, C.leaf).set(5, 7, 1, C.leaf)
      .set(1, 2, 2, C.white);                                    // a highlight
    return g.entry({ id: 'cand-cherries', name: 'Cherries' });
  })(),

  // a pot of daisies: white petals round yellow hearts, at three heights
  (() => {
    const g = grid(7, 7, 5);
    g.box([1, 5], [0, 2], [1, 3], C.terracotta).box([0, 6], [2, 2], [0, 4], C.terracotta)
      .box([2, 4], [3, 3], [2, 2], C.dgreen);
    const flower = (x, y, z) => g.set(x, y, z, C.yellow).set(x - 1, y, z, C.white).set(x + 1, y, z, C.white).set(x, y + 1, z, C.white).set(x, y - 1, z, C.white);
    g.box([2, 2], [3, 4], [2, 2], C.green).box([4, 4], [3, 5], [2, 2], C.green).box([3, 3], [3, 3], [2, 3], C.green);
    flower(2, 5, 2); flower(4, 6, 2); flower(3, 4, 4);
    return g.entry({ id: 'cand-daisy-pot', name: 'Daisy Pot' });
  })(),

  // a duckling: round fluffy body, big head, orange beak, little wing
  (() => {
    const g = grid(5, 5, 6);
    g.ellipsoid([2, 1.3, 2.2], [2.1, 1.5, 2.4], C.yellow)
      .ellipsoid([2, 3.4, 3.4], [1.3, 1.3, 1.3], C.yellow)
      .set(2, 3, 5, C.orange).set(2, 2, 5, C.orange)
      .set(3, 4, 4, C.ink).set(1, 4, 4, C.ink)
      .set(4, 1, 2, butterYellow()).set(2, 2, 0, C.yellow);      // a wing and a tail flick
    return g.entry({ id: 'cand-duckling', name: 'Duckling' });
  })(),

  // a cluster of red-spotted toadstools, three heights on a mossy mound
  (() => {
    const g = grid(8, 6, 6);
    g.box([0, 7], [0, 0], [0, 5], C.leaf);
    const shroom = (x, z, h, r) => {
      g.box([x, x], [1, h - 1], [z, z], C.cream);
      g.cylinder('y', [x, z], r, [h, h], (xx, yy, zz) => ((xx + zz) % 3 === 0 ? C.white : C.red));
      if (r > 1) g.set(x, h + 1, z, C.red);
    };
    shroom(2, 2, 4, 1.7); shroom(5, 3, 2, 1.2); shroom(6, 1, 3, 1);
    return g.entry({ id: 'cand-toadstools', name: 'Toadstools' });
  })(),

  // a dragonfly: long blue body, two pairs of clear wings
  (() => {
    const g = grid(9, 2, 7);
    g.box([4, 4], [0, 0], [0, 6], C.blue).box([4, 4], [1, 1], [5, 6], C.teal).set(4, 1, 6, C.ink)
      .box([1, 3], [1, 1], [4, 4], 0xd5ecf5).box([5, 8], [1, 1], [4, 4], 0xd5ecf5)
      .box([1, 3], [1, 1], [3, 3], 0xc3e2ef).box([5, 7], [1, 1], [3, 3], 0xc3e2ef)
      .box([4, 4], [1, 1], [3, 4], C.blue);
    return g.entry({ id: 'cand-dragonfly', name: 'Dragonfly' });
  })(),

  // a garden bench: slatted seat and back, curled iron legs
  (() => {
    const g = grid(9, 6, 4);
    g.box([0, 8], [2, 2], [1, 3], (x, y, z) => (z % 2 ? C.crust : C.brown))
      .box([0, 8], [3, 5], [0, 0], (x, y) => (y % 2 ? C.brown : C.crust))
      .box([0, 0], [0, 4], [0, 0], C.ink).box([8, 8], [0, 4], [0, 0], C.ink)
      .box([0, 0], [0, 1], [3, 3], C.ink).box([8, 8], [0, 1], [3, 3], C.ink)
      .box([0, 0], [3, 3], [1, 3], C.ink).box([8, 8], [3, 3], [1, 3], C.ink);   // armrests
    return g.entry({ id: 'cand-garden-bench', name: 'Garden Bench' });
  })(),

  // a molehill: a heap of earth with a mole popping out, pink nose
  (() => {
    const g = grid(7, 5, 7);
    g.ellipsoid([3, 0, 3], [3.4, 2.4, 3.4], (x, y, z) => (y === 0 ? C.dbrown : C.brown))
      .ellipsoid([3.5, 3, 4], [1.2, 1.4, 1.2], C.ink)
      .set(4, 3, 5, C.pink).set(3, 3, 5, 0x5d6670).set(5, 2, 4, C.pink);   // nose, eye shine, a paw
    return g.entry({ id: 'cand-molehill', name: 'Molehill' });
  })(),

  // a robin: round brown body, a big red breast toward you, thin legs
  (() => {
    const g = grid(5, 6, 6);
    g.ellipsoid([2, 3, 2.5], [1.8, 2, 2.2], 0xa86b4a)
      .box([1, 3], [2, 3], [4, 4], C.red).set(2, 4, 4, C.red)
      .set(2, 4, 5, C.gold).set(1, 4, 4, C.ink)
      .box([2, 2], [0, 1], [3, 3], C.ink)
      .box([2, 2], [3, 4], [0, 0], 0x7a5038);                    // tail cocked up
    return g.entry({ id: 'cand-robin', name: 'Robin' });
  })(),
];

function butterYellow() { return 0xf7e08a; }
