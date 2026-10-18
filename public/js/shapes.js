// Hidden voxel shapes. Each shape is a function (x, y, z) -> hex colour, or 0
// for empty. y is up, z is toward the viewer. Colours are only seen once the
// puzzle is solved. docs/level-design.md explains the set and its pacing.
import { mulberry32 } from './puzzle.js';


// Extrudes a 2D bitmap (rows top-to-bottom, '#'-style chars mapped via `key`).
function extrude(rows, depth, key) {
  const H = rows.length, W = rows[0].length;
  return {
    dims: [W, H, depth],
    cell: (x, y) => key[rows[H - 1 - y][x]] || 0,
  };
}

const ring = (dx, dz) => Math.sqrt(dx * dx + dz * dz);
const ell = (dx, dy, dz, rx, ry, rz) => (dx / rx) ** 2 + (dy / ry) ** 2 + (dz / rz) ** 2 <= 1;
const DIRS8 = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];

// Baked voxels (tools/bake-gallery.mjs): one string per height, bottom up;
// in each, rows back to front separated by spaces, one character per x, '.'
// for empty. `key` maps characters to colours.
function voxels(key, layers) {
  const grid = layers.map((l) => l.split(' '));
  return {
    dims: [grid[0][0].length, grid.length, grid[0].length],
    cell: (x, y, z) => key[grid[y][z][x]] ?? 0,
  };
}

// Regions of the map, in play order. Each shares a palette so a chapter reads
// as one place; puzzles inside rise in size and in how few clues they show.
// `line` is the one line shown on the chapter's title card.
export const CHAPTERS = [
  { name: 'First Light', numeral: 'I', palette: 'Dawn', blurb: 'home and morning',
    line: 'Morning finds what the stone was keeping.' },
  { name: 'Moss Garden', numeral: 'II', palette: 'Mint', blurb: 'the garden and its small creatures',
    line: 'Green things grow slowly inside the quiet rock.' },
  { name: 'The Lagoon', numeral: 'III', palette: 'Lagoon', blurb: 'the sea and the shore',
    line: 'The tide remembers everything it carried.' },
  { name: 'Ember Steps', numeral: 'IV', palette: 'Dusk', blurb: 'temples and lanterns',
    line: 'Climb slowly. The evening is climbing too.' },
  { name: 'Starfall', numeral: 'V', palette: 'Night', blurb: 'the sky at night',
    line: 'What the sky let fall, the stone held.' },
];

const chapter = (i, list) => list.map((s) => ({ ...s, chapter: CHAPTERS[i].name, palette: CHAPTERS[i].palette }));

export const SHAPES = [
  // ---------------------------------------------------------------- First Light
  // Small blocks, many clues, plain groups: learn to read counts in 3D.
  ...chapter(0, [
    {
      id: 'steps', name: 'Steps', dims: [4, 4, 3], fraction: 0.5, seed: 8,
      story: 'Four steps down to a door nobody has opened yet.',
      cell: (x, y) => (y > x ? 0 : y === x ? 0xfcefe0 : 0xe58f84),
    },
    {
      id: 'heart', name: 'Heart', fraction: 0.5, seed: 6,
      story: 'Carved by someone patient, for whoever would find it.',
      ...extrude([
        '.RR.RR.',
        'RRRRRRR',
        'RRRRRRR',
        '.RRRRR.',
        '..RRR..',
        '...R...',
      ], 2, { R: 0xe0546b }),
    },
    {
      // from the object gallery (candle)
      id: 'candle', name: 'Candle', fraction: 0.1, seed: 3,
      story: 'Lit before dawn, so the first visitor would find the way.',
      ...voxels({ a: 0xe9b949, b: 0xf6efe4, c: 0x3a3442, d: 0xf2a03d }, [
        '.aaa. aaaaa aaaaa aaaaa .aaa.',
        '..... .bbb. .bbb. .bbb. .....',
        '..... .bbb. .bbb. .bbb. .....',
        '..... .bbb. .bbb. .bbb. .....',
        '..... .b.b. ..b.. .b.b. .....',
        '..... ..... ..c.. ..... .....',
        '..... ..... ..d.. ..... .....',
      ]),
    },
    {
      // from the object gallery (toaster)
      id: 'toaster', name: 'Toaster', fraction: 0.3, seed: 1,
      story: 'Two slices waiting, warm, for whoever wakes up first.',
      ...voxels({ a: 0x5d6670, b: 0xc9d1d9, c: 0x3a3442, d: 0xd9b48f, e: 0xb9773f }, [
        'aaaaaa. aaaaaa. aaaaaa. aaaaaa.',
        'bbbbbb. bbbbbb. bbbbbb. bbbbbb.',
        'bbbbbb. bbbbbb. bbbbbbc bbbbbb.',
        'bbbbbb. bddddb. bddddb. bbbbbb.',
        '....... .edde.. .edde.. .......',
        '....... .eeee.. .eeee.. .......',
        '....... ....... ....... .......',
      ]),
    },
    {
      id: 'key', name: 'Key', fraction: 0.5, seed: 7, view: 0.35,
      story: 'It fits a lock somewhere further down the trail.',
      ...extrude([
        '.KK.......',
        'K..K......',
        'K..KKKKKKK',
        '.KK...K.KK',
        '......K..K',
      ], 2, { K: 0xe9b949 }),
    },
    {
      // from the object gallery (bed)
      id: 'bed', name: 'Bed', fraction: 0.3, seed: 1,
      story: 'Made up neatly, the quilt turned down for someone coming home.',
      ...voxels({ a: 0x7a4c2f, b: 0xa86f45, c: 0xf6efe4, d: 0xfbf8f2, e: 0x8cc8e8, f: 0x5b8fd6 }, [
        'a...a ..... ..... ..... ..... ..... ..... ..... a...a',
        'bbbbb ccccc ccccc ccccc ccccc ccccc ccccc ccccc bbbbb',
        'bbbbb .ddd. .ddd. eeeee fffff fffff fffff fffff bbbbb',
        'bbbbb ..... ..... ..... ..... ..... ..... ..... .....',
        'bbbbb ..... ..... ..... ..... ..... ..... ..... .....',
      ]),
    },
    {
      id: 'chair', name: 'Chair', dims: [4, 6, 4], fraction: 0.5, seed: 8,
      story: 'Set out at dawn for whoever arrives first.',
      cell(x, y, z) {
        const edgeX = x === 0 || x === 3, edgeZ = z === 0 || z === 3;
        if (y <= 1) return edgeX && edgeZ ? 0xa8714c : 0;
        if (y === 2) return 0xe0546b;
        if (z !== 0) return 0;
        return edgeX || y === 5 ? 0xa8714c : 0;
      },
    },
    {
      // from the object gallery (record-player)
      id: 'record-player', name: 'Record Player', fraction: 0.3, seed: 1,
      story: 'The record still turns. The last song never quite finished.',
      ...voxels({ a: 0xa86f45, b: 0x7d8794, c: 0x3a3442, d: 0xe0565b, e: 0xe9b949 }, [
        'aaaaaaaa aaaaaaaa aaaaaaaa aaaaaaaa aaaaaaaa aaaaaaaa aaaaaaaa',
        '.......b .ccccc.. .ccccc.. .ccdcc.. .ccccc.. .ccccc.. .......e',
        '......bb .....bb. .....b.. ........ ........ ........ ........',
      ]),
    },
    {
      // from the object gallery (clock)
      id: 'alarm-clock', name: 'Alarm Clock', fraction: 0.5, seed: 1,
      story: 'It rang once at dawn, then let everyone sleep a little longer.',
      ...voxels({ a: 0x3a3442, b: 0xe0565b, c: 0xfbf8f2, d: 0xe9b949 }, [
        '.a...a. .a...a. .a...a.',
        '.bbbbb. .bbbbb. .bbbbb.',
        'bcccccb b.....b bcccccb',
        'bccaacb b..aa.b bccaacb',
        'bccaccb b..a..b bccaccb',
        'bcccccb b.....b bcccccb',
        '.bbbbb. .bbbbb. .bbbbb.',
        'dd...dd dd...dd dd...dd',
        '.d...d. .d...d. .d...d.',
      ]),
    },
    {
      // from the object gallery (bookshelf)
      id: 'bookshelf', name: 'Bookshelf', fraction: 0.3, seed: 1,
      story: 'A book for every colour, and one lying down to rest.',
      ...voxels({ a: 0xa86f45, b: 0xe0565b, c: 0x5b8fd6, d: 0x5fae6e, e: 0xf4a3b5, f: 0xe9b949, g: 0x4fb3a9, h: 0xf08a6c, i: 0x9b7fd1, j: 0xf6d365 }, [
        'aaaaaaa aaaaaaa aaaaaaa',
        'a.....a abcdefa abcdefa',
        'a.....a abcd.fa abcd.fa',
        'a.....a ab.d..a ab.d..a',
        'aaaaaaa aaaaaaa aaaaaaa',
        'a.....a agh.ija agh.ija',
        'a.....a ag..ija ag..ija',
        'aaaaaaa aaaaaaa aaaaaaa',
      ]),
    },
  ]),

  // ---------------------------------------------------------------- Moss Garden
  // Round, living forms: circled clues and the first hollow (the teapot).
  ...chapter(1, [
    {
      // A gentle way into the garden: small and low, before the cat.
      id: 'ladybug', name: 'Ladybug', dims: [5, 3, 6], fraction: 0.3, seed: 1,
      story: 'She never sits still long enough to be counted.',
      cell(x, y, z) {
        if (z === 5) return y <= 1 && x >= 1 && x <= 3 ? 0x2d3142 : 0;
        if (!ell(x - 2, y - 0.3, z - 2.4, 2.4, 2.4, 2.6)) return 0;
        // four spots on a red back
        const spot = y === 2 ? (x === 1 || x === 3) && (z === 2 || z === 3) && (x + z) % 2 === 1 : y === 1 && (x === 0 || x === 4) && z === 2;
        return spot ? 0x2d3142 : 0xd9455a;
      },
    },
    {
      // from the object gallery (snail)
      id: 'snail', name: 'Snail', fraction: 0.4, seed: 1,
      story: 'It carried its whole house across the garden before lunch.',
      ...voxels({ a: 0xe8d3a3, b: 0xb9773f, c: 0xf2a03d, d: 0x6b4a3a, e: 0x3a3442 }, [
        '........ aaaaaaaa aaaaaaaa ........',
        '........ aa.bccb. aa.bccb. ........',
        '........ aabcddcb aabcddcb ........',
        '........ eabcddcb eabcddcb ........',
        '........ ...bccb. ...bccb. ........',
        '........ ....bb.. ....bb.. ........',
      ]),
    },
    {
      id: 'apple', name: 'Apple', dims: [5, 6, 5], fraction: 0.3, seed: 2,
      story: 'The first one to fall, and the sweetest.',
      cell(x, y, z) {
        if (y === 5) return x === 2 && z === 2 ? 0x8a5a3c : x === 3 && z === 2 ? 0x5fae6e : 0;
        return ell(x - 2, y - 2, z - 2, 2.4, 2.3, 2.4) ? (y === 4 ? 0xe86a6a : 0xd9455a) : 0;
      },
    },
    {
      // from the object gallery (cactus)
      id: 'cactus', name: 'Cactus', fraction: 0.4, seed: 1,
      story: 'It kept the sunniest corner and flowered when nobody was looking.',
      ...voxels({ a: 0xc8704b, b: 0xb8434b, c: 0x5fae6e, d: 0xf4a3b5 }, [
        '.aaaaa. .aaaaa. .aaaaa. .aaaaa. .aaaaa.',
        '.bbbbb. .bbbbb. .bbbbb. .bbbbb. .bbbbb.',
        '....... ...c... ..ccc.. ...c... .......',
        '....... ...c... ..ccccc ...c... .......',
        '....... ...c... .cccccc ...c... .......',
        '....... ...c... ccccc.c ...c... .......',
        '....... ...c... ccccc.. ...c... .......',
        '....... ...c... ..ccc.. ...c... .......',
        '....... ....... ...d... ....... .......',
      ]),
    },
    {
      id: 'cat', name: 'Cat', dims: [7, 6, 4], fraction: 0.65, seed: 4,
      story: 'She has slept in this rock since before the moss.',
      cell(x, y, z) {
        const orange = y === 1 ? 0xd9824a : 0xf2a65a;
        // ears, head, eyes and nose
        if (y === 5) return (x === 1 || x === 5) && z === 2 ? 0xf2a65a : 0;
        if (y >= 3) {
          if (x < 1 || x > 5 || z < 1) return 0;
          if (z === 3 && y === 4 && (x === 2 || x === 4)) return 0x3f9a6b;
          if (z === 3 && y === 3 && x === 3) return 0xf08a9a;
          return 0xf2a65a;
        }
        // body, white chest, paws and a tail curled round the front
        if (x >= 1 && x <= 5 && z <= 2) return z === 2 && x >= 2 && x <= 4 && y >= 1 ? 0xfff6ea : orange;
        if (y === 0 && z === 3 && (x === 2 || x === 4)) return 0xfff6ea;
        if (y === 0 && ((x === 6 && z >= 1) || (x === 5 && z === 3))) return 0xd9824a;
        return 0;
      },
    },
    {
      // A banded skep with a door you can only see once it's open, and one bee.
      id: 'beehive', name: 'Beehive', dims: [5, 6, 5], fraction: 0.65, seed: 3,
      story: 'A whole summer of sunlight, stored away in wax.',
      cell(x, y, z) {
        const r = ring(x - 2, z - 2);
        if (y === 1 && x === 2 && z === 4) return 0;
        if (y === 5) return r === 0 ? 0xd99a2b : 0;
        if (x === 4 && y === 3 && z === 3) return 0x2d3142;   // a bee, clinging to the hive's side
        return r <= [2.2, 2.3, 2.1, 1.7, 1.0][y] ? (y % 2 ? 0xe9b949 : 0xd99a2b) : 0;
      },
    },
    {
      id: 'tulip', name: 'Tulip', dims: [5, 8, 5], fraction: 0.65, seed: 4,
      story: 'Planted in autumn, nearly forgotten, and then this morning.',
      cell(x, y, z) {
        const r = ring(x - 2, z - 2);
        if (y <= 1) return r <= 1.6 ? 0xc2604e : 0;
        if (y <= 4) {
          if (r === 0) return 0x4f9a6b;
          if (y === 3 && z === 2 && (x === 1 || x === 0)) return 0x5fae6e;
          if (y === 4 && z === 2 && x === 3) return 0x5fae6e;
          return 0;
        }
        if (y === 5) return r <= 1.0 ? 0xe0546b : 0;
        if (y === 6) return r <= 1.6 && r > 0.9 ? 0xe0546b : 0;
        return r === 1 ? 0xf08a9a : 0;
      },
    },
    {
      id: 'mushroom', name: 'Mushroom', dims: [7, 6, 7], fraction: 0.65, seed: 2,
      story: 'After the rain, a whole village of them, overnight.',
      cell(x, y, z) {
        const dx = x - 3, dz = z - 3, r2 = dx * dx + dz * dz;
        if (y <= 2) return r2 <= 1 ? 0xf3e6d0 : 0;
        const r = [3.3, 3.0, 2.2][y - 3];
        if (r2 > r * r) return 0;
        // white spots set evenly round the cap, so they match from every side:
        // one on the crown, four at the diagonals above, four at the sides below
        const spot = (y === 5 && r2 === 0)
          || (y === 4 && Math.abs(dx) === 2 && Math.abs(dz) === 2)
          || (y === 3 && r2 === 9 && (dx === 0 || dz === 0));
        return spot ? 0xfff4e6 : 0xd9455a;
      },
    },
    {
      // from the object gallery (gnome)
      id: 'gnome', name: 'Garden Gnome', fraction: 0.65, seed: 1,
      story: 'He has guarded the strawberries for years and eaten only a few.',
      ...voxels({ a: 0x6b4a3a, b: 0x5b8fd6, c: 0xfbf8f2, d: 0xf6c9b5, e: 0x3a3442, f: 0xe0565b }, [
        '..... .aaa. .aaa. .aaa. .....',
        '..... .bbb. .bbb. .bbb. .....',
        '..... .bbb. .bbb. .bbb. ..c..',
        '..... .bbb. .bbb. .ccc. .ccc.',
        '..... .ddd. .ddd. .ccc. .ccc.',
        '..... .ddd. .ddd. .ccc. .ece.',
        'fffff fffff fffff fffff fffff',
        '..... .fff. .fff. .fff. .....',
        '..... ..... ..f.. ..... .....',
        '..... ..... ..ff. ..... .....',
      ]),
    },
    {
      // from the object gallery (garden-bench)
      id: 'garden-bench', name: 'Garden Bench', fraction: 0.65, seed: 1,
      story: 'A place to sit still while the garden does the growing.',
      ...voxels({ a: 0x3a3442, b: 0xb9773f, c: 0x8a5a3c }, [
        'a.......a ......... ......... a.......a',
        'a.......a ......... ......... a.......a',
        'a.......a bbbbbbbbb ccccccccc bbbbbbbbb',
        'accccccca a.......a a.......a a.......a',
        'abbbbbbba ......... ......... .........',
        'ccccccccc ......... ......... .........',
      ]),
    },
    {
      id: 'bonsai', name: 'Bonsai', dims: [7, 7, 5], fraction: 0.65, seed: 3,
      story: 'Three hundred years of careful pruning, and one stubborn branch.',
      cell(x, y, z) {
        if (y <= 1) return x >= 1 && x <= 5 && z >= 1 && z <= 3 ? (y === 1 && x >= 2 && x <= 4 && z === 2 ? 0x6b4a3a : 0x4f7fb8) : 0;
        const trunk = [[3, 2], [3, 3], [2, 4], [4, 4], [5, 5]];
        if (z === 2 && trunk.some(([tx, ty]) => tx === x && ty === y)) return 0x8a5a3c;
        if (ell(x - 1.5, y - 5.2, z - 2, 1.7, 0.9, 1.6)) return 0x5fae6e;
        if (ell(x - 4.8, y - 6, z - 2, 1.6, 0.7, 1.4)) return 0x3f9a6b;
        return 0;
      },
    },
    {
      // from the object gallery (pumpkin)
      id: 'pumpkin', name: 'Pumpkin', fraction: 0.65, seed: 1,
      story: 'Grown fat on a whole summer, waiting for the first frost.',
      ...voxels({ a: 0xe78a2e, b: 0xf2a03d, c: 0x6b4a3a, d: 0x5fae6e }, [
        '....... ....... ....... ...a... ....... ....... .......',
        '....... ..abb.. .abbab. .bbaaa. .abbab. ..abb.. .......',
        '..aba.. .babba. aabbabb bbbaaaa aabbabb .babba. ..aba..',
        '...b... .babba. .abbab. bbbaaaa .abbab. .babba. ...b...',
        '....... ....... ..bba.. ..baa.. ..bba.. ....... .......',
        '....... ....... ....... ...cc.. ....dd. ....... .......',
      ]),
    },
    {
      // from the object gallery (sunflower)
      id: 'sunflower', name: 'Sunflower', fraction: 0.65, seed: 1,
      story: 'It turned all day long to keep the sun in view.',
      ...voxels({ a: 0x5fae6e, b: 0x86c77f, c: 0xf6d365, d: 0x3f8a5b, e: 0x6b4a3a }, [
        '....... ...a... .......',
        '....... .bba... .......',
        '....... ...abb. .......',
        '....... ...a... .......',
        '....... ...a... ..ccc..',
        '....... ..dad.. .ccecc.',
        '....... .ddddd. cceeecc',
        '....... .ddddd. cceeecc',
        '....... ..ddd.. .ccecc.',
        '....... ....... ..ccc..',
      ]),
    },
    {
      id: 'tree', name: 'Pine', dims: [5, 9, 5], fraction: 0.65, seed: 3,
      story: 'The tallest thing in the garden, keeping a star for later.',
      cell(x, y, z) {
        const dx = Math.abs(x - 2), dz = Math.abs(z - 2), r2 = dx * dx + dz * dz;
        if (y <= 1) return r2 === 0 ? 0x8a5a3c : 0;
        if (y === 8) return r2 === 0 ? 0xf6d365 : 0;
        const tier = [2.3, 1.5, 1.0, 1.8, 1.0, 0.5][y - 2];
        return r2 <= tier * tier ? (y === 2 || y === 5 ? 0x2f7f58 : 0x3f9a6b) : 0;
      },
    },
    {
      // from the object gallery (fox)
      id: 'fox', name: 'Fox', fraction: 0.65, seed: 1,
      story: 'It waited by the gate at dusk, tail wrapped round its paws.',
      ...voxels({ a: 0xe2873e, b: 0xfbf8f2, c: 0x3a3442 }, [
        '....... ....... .....aa ...a.aa .....aa .....aa .....bb',
        '....... ....... ..aaaaa ..aaaaa ..aaaaa ..bbbaa .....bb',
        '....... ....... ..aaa.. ..aaa.. ..aaa.. ..bbb.. .......',
        '....... ....... ..aaa.. ..aaa.. ..aaa.. ..bbb.. .......',
        '....... ....... ....... ..aaa.. ...a... ..bbb.. ...b...',
        '....... ....... ..aaa.. ..aaa.. ..aaa.. ..bbb.. ...c...',
        '....... ....... ...a... ..aaa.. ..cac.. ....... .......',
        '....... ....... ....... .ca.ac. ....... ....... .......',
      ]),
    },
    {
      // A hollow pot: the empty belly is only reachable by peeling.
      id: 'teapot', name: 'Teapot', dims: [9, 6, 5], fraction: 0.65, seed: 4,
      story: 'Still warm. Someone was here a moment ago.',
      cell(x, y, z) {
        const dx = x - 4, dz = z - 2, r = ring(dx, dz);
        if (y <= 3) {
          const [out, hole] = [[1.6, 0], [2.3, 1.5], [2.3, 1.5], [1.9, 1.0]][y];
          if (r <= out && r >= hole) return y === 2 ? 0x5b8fd6 : 0xf6efe4;
        }
        if (y === 4) return r <= 1.5 ? 0x5b8fd6 : 0;
        if (y === 5) return r === 0 ? 0x5b8fd6 : 0;
        if (z !== 2) return 0;
        const handle = (x === 1 && (y === 1 || y === 3)) || (x === 0 && y >= 1 && y <= 3);
        const spout = (x === 7 && (y === 1 || y === 2)) || (x === 8 && y === 3);
        return handle || spout ? 0xf6efe4 : 0;
      },
    },
  ]),

  // ---------------------------------------------------------------- The Lagoon
  // Hulls, rings and a lamp hidden in a tower: give-away clues start to vanish.
  ...chapter(2, [
    {
      // from the object gallery (flip-flops)
      id: 'flip-flops', name: 'Flip-Flops', fraction: 0.65, seed: 1,
      story: 'Kicked off at the water\'s edge, one a little ahead of the other.',
      ...voxels({ a: 0x5b8fd6, b: 0x8cc8e8, c: 0xf4a3b5 }, [
        'aaa.... aaabbb. aaabbb. aaabbb. aaabbb. aaabbb. ...bbb.',
        '....... .c..... c.c.c.. ...c.c. ....... ....... .......',
      ]),
    },
    {
      // A breather between the boat and the tower.
      id: 'penguin', name: 'Penguin', dims: [5, 7, 4], fraction: 0.9, seed: 1,
      story: 'A long way from home, and perfectly calm about it.',
      cell(x, y, z) {
        if (y === 0) return (x === 1 || x === 3) && z >= 2 ? 0xf08a3c : 0;
        if (y === 4 && x === 2 && z === 3) return 0xf08a3c;
        if (!ell(x - 2, y - 3, z - 1.5, 2.0, 3.0, 1.6)) return 0;
        return z >= 2 && Math.abs(x - 2) <= 1 && y <= 3 ? 0xf6f2ea : 0x2d3142;
      },
    },
    {
      id: 'fish', name: 'Fish', dims: [8, 5, 3], fraction: 0.8, seed: 1,
      story: 'It swam into the stone and decided to stay.',
      cell(x, y, z) {
        if (x === 6 && z === 1 && y >= 1 && y <= 3) return 0xf2b45a;
        if (x === 7 && z === 1 && y !== 2) return 0xf2b45a;
        const r = z === 1 ? [2.7, 2.1] : [2.0, 1.3];
        if (!ell(x - 3, y - 2, 0, r[0], r[1], 1)) return 0;
        if (x === 2 && y === 3 && z !== 1) return 0x2f2b3a;
        return y === 2 && z !== 1 ? 0xffd58a : 0xf28c3c;
      },
    },
    {
      id: 'starfish', name: 'Starfish', dims: [7, 2, 7], fraction: 0.65, seed: 3,
      story: 'Left behind by the tide, waiting patiently for the next one.',
      cell(x, y, z) {
        const dx = x - 3, dz = z - 3;
        const a = Math.atan2(dz, dx), d = Math.hypot(dx, dz);
        const arm = Math.cos(5 * (a + Math.PI / 2)) * 0.5 + 0.5;
        if (d > 1.2 + 2.3 * arm ** 1.6) return 0;
        if (y === 1) return d <= 1.2 ? 0xf6c38a : 0;
        return 0xe8704a;
      },
    },
    {
      // from the object gallery (jellyfish)
      id: 'jellyfish', name: 'Jellyfish', fraction: 0.8, seed: 2,
      story: 'It drifts wherever the tide is going, and never minds the way.',
      ...voxels({ a: 0xc9b6e4, b: 0xf4a3b5, c: 0xe2728f, d: 0xfbf8f2 }, [
        '..... ..... ..... ...a. .....',
        '..... .b... ..... ...b. .....',
        '..... .a.a. ..... .a.a. .....',
        '..... .b.b. ..b.. .b.b. .....',
        '..... .a.a. ..a.. .a.a. .....',
        '.ccc. ccccc ccccc ccccc .ccc.',
        '.bbb. bbbbb bbabb bbbbb .bbb.',
        '..... .bbb. .bdb. .bbb. .....',
      ]),
    },
    {
      // from the object gallery (crab)
      id: 'crab', name: 'Crab', fraction: 0.8, seed: 2,
      story: 'Sideways is still forward, if you are a crab.',
      ...voxels({ a: 0xb8434b, b: 0xe0565b, c: 0x3a3442 }, [
        '......... .a.aaa.a. ...aaa... .a.aaa.a. ...aaa... .........',
        '......... .aabbbaa. ..bbbbb.. .aabbbaa. .bbbbbbb. .........',
        '......... ....b.... ..bbbbb.. ..bbbbb.. bb..b..bb bb.....bb',
        '......... ......... ......... ...c.c... .b.....b. bb.....bb',
        '......... ......... ......... ......... ......... .........',
      ]),
    },
    {
      id: 'boat', name: 'Sailboat', dims: [8, 8, 3], fraction: 0.65, seed: 3,
      story: 'Small sails, long water, and the far shore always moving.',
      cell(x, y, z) {
        if (y === 0) return x >= 2 && x <= 5 ? 0xe0546b : 0;
        if (y === 1) return x >= 1 && x <= 6 ? 0xf6efe4 : 0;
        if (y === 2) return (z !== 1 || x === 0 || x === 7) ? 0xe0546b : x === 3 ? 0x8a5a3c : 0;
        if (z !== 1) return 0;
        if (x === 3) return y === 7 ? 0xe9b949 : 0x8a5a3c;
        const main = x >= 4 && x - 4 <= 6 - y;
        const jib = y <= 4 && x <= 2 && 2 - x <= 4 - y;
        return main || jib ? 0xfffaf0 : 0;
      },
    },
    {
      // from the object gallery (pelican)
      id: 'pelican', name: 'Pelican', fraction: 0.8, seed: 4,
      story: 'It keeps the whole morning\'s catch in its beak, and shares none.',
      ...voxels({ a: 0xf2a03d, b: 0xfbf8f2, c: 0x9aa3ad, d: 0xe9b949, e: 0x3a3442 }, [
        '...... ...... ..a... ...a.. ...... ...... ......',
        '...... ...... ..a... ...a.. ...... ...... ......',
        '...... ..bb.. .cbbc. .cbbc. ..bb.. ...... ......',
        '...... .cbbc. .cbbc. .cbbc. .cbbc. ...... ......',
        '...... ..bb.. .cbbc. .cbbc. ..bb.. ...... ......',
        '...... ...... ..bb.. ..bb.. ..dd.. ..dd.. ......',
        '...... ...... ..ee.. ..bb.. ..aa.. ..aa.. ..aa..',
      ]),
    },
    {
      id: 'lighthouse', name: 'Lighthouse', dims: [5, 10, 5], fraction: 1.0, seed: 5,
      story: 'The keeper left the lamp lit, just in case.',
      cell(x, y, z) {
        const dx = x - 2, dz = z - 2, adx = Math.abs(dx), adz = Math.abs(dz);
        const wide = adx + adz <= 3;
        if (y === 0) return wide ? 0x8d8a99 : 0;
        if (y <= 5) return adx <= 1 && adz <= 1 ? (y % 2 ? 0xfff6ea : 0xe0546b) : 0;
        if (y === 6) return wide ? 0x3d3a52 : 0;
        if (y === 7) return adx === 1 && adz === 1 ? 0x3d3a52 : adx === 0 && adz === 0 ? 0xffe596 : 0;
        if (y === 8) return adx <= 1 && adz <= 1 ? 0xe0546b : 0;
        return adx === 0 && adz === 0 ? 0x3d3a52 : 0;
      },
    },
    {
      // from the object gallery (palm-islet), its lone left sand tip trimmed to fit a phone
      id: 'palm-islet', name: 'Palm Islet', fraction: 0.65, seed: 2,
      story: 'An island just big enough for one tree and one long nap.',
      ...voxels({ a: 0xe8d3a3, b: 0xd9b48f, c: 0x5fae6e, d: 0x6b4a3a, e: 0x86c77f }, [
        '....... aaaaaa. aaaaaa. aaaaaaa aaaaaa. aaaaaa. .......',
        '....... ..aa... aaaaaa. aabaaa. aaaaaa. ..aa... .......',
        '....... ....... ....... ..b.... ....... ....... .......',
        '....... ....... ....... ..b.... ....... ....... .......',
        '....... ....... ....... ..bb... ....... ....... .......',
        '...c... ....... ....... c.dbd.c ....... ....... ...c...',
        '...c... ...c... ...c... ccccccc ...c... ...c... ...c...',
        '....... ....... ....... ...e... ....... ....... .......',
      ]),
    },
    {
      id: 'turtle', name: 'Turtle', dims: [7, 4, 8], fraction: 0.9, seed: 5,
      story: 'Slow is a direction, too.',
      cell(x, y, z) {
        const dx = x - 3, dz = z - 3.5;
        if (y >= 1 && ell(dx, y - 0.6, dz, 2.9, 2.6, 3.0)) {
          if (y === 1) return 0xd6b46a;
          return (Math.round(dx) + Math.round(dz)) % 2 === 0 ? 0xa8804c : 0x7f5f3a;
        }
        if (y === 0) return (x === 1 || x === 5) && (z === 1 || z === 6) ? 0x9fcf7a : 0;
        if (y === 1) return x === 3 && z === 7 ? 0x9fcf7a : 0;
        return 0;
      },
    },
    {
      id: 'torus', name: 'Life Ring', dims: [8, 3, 8], fraction: 0.9, seed: 4,
      story: 'Thrown once, to someone who caught it.',
      cell(x, y, z) {
        const dx = x - 3.5, dz = z - 3.5;
        const d = Math.sqrt(dx * dx + dz * dz) - 2.6;
        if (d * d + (y - 1) ** 2 > 1.25) return 0;
        return (dx > 0) === (dz > 0) ? 0xe0546b : 0xfff6ea;
      },
    },
    {
      id: 'mug', name: 'Mug', dims: [8, 6, 6], fraction: 0.8, seed: 3,
      story: 'The keeper’s mug, half full, between one watch and the next.',
      cell(x, y, z) {
        const dx = x - 2.5, dz = z - 2.5, r2 = dx * dx + dz * dz;
        if (x <= 5 && r2 <= 2.6 * 2.6 && (y === 0 || r2 >= 1.7 * 1.7)) return y === 5 ? 0xf6efe4 : 0x5b8fd6;
        if (x <= 5 && y === 4 && r2 < 1.7 * 1.7) return 0x6b4a3a;
        const handle = (x === 6 && (y === 1 || y === 4)) || (x === 7 && y >= 1 && y <= 4);
        return handle && (z === 2 || z === 3) ? 0x5b8fd6 : 0;
      },
    },
  ]),

  // ---------------------------------------------------------------- Ember Steps
  // Architecture: overhangs, enclosed rooms and long chains of deduction.
  ...chapter(3, [
    {
      // from the object gallery (dragon head)
      id: 'dragon-head', name: 'Dragon Head', fraction: 0.65, seed: 1,
      story: 'It guards the temple steps, and has never once blinked.',
      ...voxels({ a: 0x3f8a5b, b: 0x5fae6e, c: 0xfbf8f2, d: 0xe0565b, e: 0xe9b949, f: 0x3a3442 }, [
        '........ ........ ........ ........ ........ ........',
        '........ ........ ..aaaa.. ..aaaa.. ..aaaa.. ..aaaa..',
        '.bbbbbb. .bbbbbb. .bbbbbb. .bbbbbb. ..bbbb.. ..cbbc..',
        '.bbbbbb. dbbbbbbd dbbbbbbd .bbbbbb. ..bbbb.. eebbbbee',
        '.bbbbbb. dbbbbbbd dbbbbbbd .bbbbbb. ..bbbb.. ..abba..',
        '.bbbbbb. dbbbbbbd dbbbbbbd .bfbbfb. ........ ........',
        '.e....e. .e....e. ........ ........ ........ ........',
      ]),
    },
    {
      // from the object gallery (temple bell)
      id: 'temple-bell', name: 'Temple Bell', fraction: 0.65, seed: 1,
      story: 'Struck once at dusk, it keeps ringing long after you leave.',
      ...voxels({ a: 0x8a5a3c, b: 0x6b4a3a, c: 0xe9b949, d: 0xb07a3a, e: 0xd9b48f }, [
        '....... ....... a..b..a ....... .......',
        '...c... ..ccc.. accccca ..ccc.. ...c...',
        '....... ..ddd.. a.ddd.a ..ddd.. .......',
        '....... ..ddd.. a.ddd.a ..ddd.. .......',
        '....... ...d... a.ddd.a ...d... .......',
        '....... ...d... a.ddd.a ...d... .......',
        '....... ....... a..e..a ....... .......',
        '....... ....... bbbbbbb ....... .......',
      ]),
    },
    {
      // A torii: two beams with a gap between them make split rows.
      id: 'gate', name: 'Gate', dims: [9, 6, 2], fraction: 1.0, seed: 1,
      story: 'Pass beneath it and leave the day behind.',
      cell(x, y) {
        if (y === 5) return 0x3d2e3a;
        if (y === 3) return x >= 1 && x <= 7 ? 0xe2553f : 0;
        if (y === 4 && x === 4) return 0xe2553f;
        return x === 2 || x === 6 ? (y === 0 ? 0x3d2e3a : 0xe2553f) : 0;
      },
    },
    {
      // Flat like the gate, but every rib is a decision.
      id: 'fan', name: 'Paper Fan', dims: [9, 6, 2], fraction: 1.0, seed: 1, view: 0.35,
      story: 'Folded open once a year, on the warmest evening.',
      cell(x, y, z) {
        const dx = x - 4, dy = y + 0.5, d = Math.hypot(dx, dy), a = Math.atan2(dy, dx);
        if (y === 0) return x === 4 ? 0x8a5a3c : 0;
        if (d < 1.6 || d > 5.4) return 0;
        const rib = Math.floor((a / Math.PI) * 9) % 2;
        return d > 4.6 ? 0xe0546b : rib ? 0xf6e7d2 : 0xf3c1a4;
      },
    },
    {
      // from the object gallery (tea house); replaced the Pagoda
      id: 'tea-house', name: 'Tea House', fraction: 1.0, seed: 1,
      story: 'Two lanterns lit, the kettle on, and room for one more.',
      ...voxels({ a: 0x9aa3ad, b: 0x6b4a3a, c: 0xf6efe4, d: 0xe0565b, e: 0xf6d365, f: 0x2f4a7a }, [
        '......... .aaaaaaa. .aaaaaaa. .aaaaaaa. .aaaaaaa. .aaaaaaa. .........',
        '......... ......... ..bcccb.. ..bcccb.. ..bcbcb.. .d.....d. .........',
        '......... ......... ..bcccb.. ..bcccb.. ..bcbcb.. .e.....e. .........',
        '......... ......... ..bcccb.. ..bcccb.. ..bcbcb.. ......... .........',
        'fffffffff fffffffff fffffffff fffffffff fffffffff fffffffff fffffffff',
        'f.......f .fffffff. .fffffff. .fffffff. .fffffff. .fffffff. f.......f',
        '......... ......... ..fffff.. ..fffff.. ..fffff.. ......... .........',
        '......... ......... ......... ...fff... ......... ......... .........',
      ]),
    },
    {
      // from the object gallery (taiko drum)
      id: 'taiko-drum', name: 'Taiko Drum', fraction: 0.9, seed: 2,
      story: 'One beat for the dawn, one for dusk, and silence in between.',
      ...voxels({ a: 0x6b4a3a, b: 0xf6efe4, c: 0xe9b949, d: 0xe0565b }, [
        '....... .a...a. .a...a. .a...a. .......',
        '..bbb.. ..ccc.. .addda. ..ccc.. ..bbb..',
        '.bbbbb. .cdddc. .ddddd. .cdddc. .bbbbb.',
        '.bbbbb. .ddddd. .ddddd. .ddddd. .bbbbb.',
        '.bbbbb. .ddddd. .ddddd. .ddddd. .bbbbb.',
        '.bbbbb. .cdddc. .ddddd. .cdddc. .bbbbb.',
        '..bbb.. ..ccc.. ..ddd.. ..ccc.. ..bbb..',
      ]),
    },
    {
      id: 'hourglass', name: 'Hourglass', dims: [5, 8, 5], fraction: 0.9, seed: 7,
      story: 'The sand still falls, though no one is counting anymore.',
      cell(x, y, z) {
        const dx = x - 2, dz = z - 2, corner = Math.abs(dx) === 2 && Math.abs(dz) === 2;
        if (y === 0 || y === 7) return 0x8a5a3c;
        if (corner) return 0xa8714c;
        const centre = dx === 0 && dz === 0, near = Math.abs(dx) <= 1 && Math.abs(dz) <= 1;
        if (y === 6 || y === 1) return near ? 0xf2b45a : 0;
        return centre ? 0xf2b45a : 0;
      },
    },
    {
      id: 'spiral', name: 'Spiral Stair', dims: [5, 9, 5], fraction: 0.8, seed: 2,
      story: 'Each step turns a little, until you are somewhere else.',
      cell(x, y, z) {
        const dx = x - 2, dz = z - 2;
        if (dx === 0 && dz === 0) return 0xfcefe0;
        const [ux, uz] = DIRS8[y % 8];
        const onStep = (dx === ux && dz === uz) || (dx === 2 * ux && dz === 2 * uz);
        const ramp = [0xffd58a, 0xf6b07a, 0xec938a, 0xd9809c, 0xb878a8, 0x9a74b0, 0x7d6eb0, 0x6c63a6, 0x5c5a9a];
        return onStep ? ramp[y] : 0;
      },
    },
  ]),

  // ---------------------------------------------------------------- Starfall
  // Fewest clues, deepest interiors; the observatory is the finale.
  ...chapter(4, [
    {
      // Starfall opens softly before the long climb.
      id: 'kite', name: 'Kite', dims: [6, 8, 2], fraction: 0.65, seed: 6, view: 0.35,
      story: 'The string snapped long ago. It has been flying ever since.',
      cell(x, y, z) {
        const dx = Math.abs(x - 3), up = Math.abs(y - 5);
        if (y >= 3 && dx + up <= 2) {
          if (x === 3 || y === 5) return 0x8a6a5a;
          return (x < 3) === (y > 5) ? 0xf6d365 : 0xe86a6a;
        }
        if (z === 1 && ((x === 2 && y === 2) || (x === 1 && y === 1) || (x === 0 && y === 0))) return 0x9cc8e6;
        return 0;
      },
    },
    {
      id: 'bunny', name: 'Moon Rabbit', dims: [6, 7, 4], fraction: 0.65, seed: 5,
      story: 'On clear nights it hops down from the moon to visit.',
      cell(x, y, z) {
        if (y >= 4 && (z === 0 || z === 3) && x === 4) return y === 5 ? 0xf3b4c2 : 0xf4efe8;   // two ears, apart
        if (x === 5 && y === 2 && (z === 1 || z === 2)) return z === 1 ? 0xf08a9a : 0xf4efe8;
        if (ell(x - 4, y - 2.4, z - 1.5, 1.2, 1.3, 1.4)) return 0xf4efe8;
        if (ell(x - 2, y - 1, z - 1.5, 2.1, 1.3, 1.7)) return 0xf4efe8;
        if (x === 0 && y === 1 && (z === 1 || z === 2)) return 0xffffff;
        return 0;
      },
    },
    {
      id: 'snowman', name: 'Snowman', dims: [5, 9, 5], fraction: 0.9, seed: 3,
      story: 'Built on the coldest night, and smiling about it.',
      cell(x, y, z) {
        const dx = x - 2, dz = z - 2;
        const ball = (cy, r) => dx * dx + dz * dz + (y - cy) ** 2 <= r * r;
        if (y === 8) return dx === 0 && dz === 0 ? 0x2f2b3a : 0;
        if (y === 6 && dx === 0 && dz === 2) return 0xf08a3c;
        if (y === 5 && ball(4.4, 1.6)) return 0xe0546b;
        if (ball(1.5, 2.3) || ball(4.4, 1.6) || ball(6.6, 1.2)) return 0xf7f4ef;
        return 0;
      },
    },
    {
      id: 'invader', name: 'Visitor', fraction: 0.65, seed: 1,
      story: 'It came a very long way, and seems glad to be found.',
      ...extrude([
        '..G.....G..',
        '...G...G...',
        '..GGGGGGG..',
        '.GG.GGG.GG.',
        'GGGGGGGGGGG',
        'G.GGGGGGG.G',
        'G.G.....G.G',
        '...GG.GG...',
      ], 2, { G: 0x6cc28f }),
    },
    {
      id: 'owl', name: 'Owl', dims: [6, 7, 4], fraction: 1.0, seed: 1,
      story: 'It watched every star fall, and kept a list.',
      cell(x, y, z) {
        if (y === 6) return (x === 1 || x === 4) && z === 1 ? 0x8a6a8e : 0;
        if (y === 0) return (x === 1 || x === 4) && z === 3 ? 0xf2b45a : 0;
        if (!ell(x - 2.5, y - 3.1, z - 1.5, 2.9, 2.9, 1.9)) return 0;
        if (z === 3 && y === 4 && (x === 1 || x === 4)) return 0xffe596;
        if (z === 3 && y === 3 && (x === 2 || x === 3)) return 0xf2b45a;
        if (x === 0 || x === 5) return 0x6c5476;
        return z === 3 && y <= 2 ? 0xe6d3c2 : 0x8a6a8e;
      },
    },
    {
      id: 'rocket', name: 'Rocket', dims: [5, 10, 5], fraction: 1.0, seed: 5,
      story: 'Packed for a short trip. Planning a long one.',
      cell(x, y, z) {
        const dx = x - 2, dz = z - 2, r2 = dx * dx + dz * dz;
        if (y <= 1) {
          const fin = (dx === 0 || dz === 0) && r2 === 4;
          if (fin) return 0xe0546b;
        }
        if (y <= 6) return r2 <= 1.5 * 1.5 ? (y === 4 && dz === 1 && dx === 0 ? 0x6fd3e8 : 0xeee6f2) : 0;
        if (y <= 8) return r2 <= (y === 7 ? 1.1 : 0.5) ** 2 ? 0xe0546b : 0;
        return r2 === 0 ? 0xe0546b : 0;
      },
    },
    {
      id: 'planet', name: 'Ringed Planet', dims: [9, 5, 9], fraction: 0.9, seed: 4,
      story: 'A ring around a faraway world, still waiting for a name.',
      cell(x, y, z) {
        const dx = x - 4, dy = y - 2, dz = z - 4, r = ring(dx, dz);
        if (dx * dx + dy * dy + dz * dz <= 2.3 * 2.3) return [0x8a74c0, 0xc79ad0, 0xf2c6b4, 0xc79ad0, 0x8a74c0][y];
        if (y === 2 && r >= 3.2 && r <= 4.3) return 0xf2d58a;
        return 0;
      },
    },
    {
      // Finale: a hollow drum and dome around a telescope that leans out of
      // the slit. Most of the inside is only reachable by peeling.
      id: 'observatory', name: 'Observatory', dims: [7, 7, 7], fraction: 0.9, seed: 1,
      story: 'Where the night was measured, star by careful star.',
      cell(x, y, z) {
        const dx = x - 3, dz = z - 3, r = ring(dx, dz);
        if (y === 0) return r <= 3.2 ? 0x8d8a99 : 0;
        const scope = [[3, 4, 3], [3, 4, 4], [3, 5, 4], [3, 5, 5], [3, 6, 5], [3, 6, 6]];
        if (scope.some(([a, b, c]) => a === x && b === y && c === z)) return 0xffd58a;
        if (x === 3 && z === 3 && y <= 3) return 0x6c63a6;
        if (y <= 3) {
          const door = x === 3 && z === 6 && y <= 2;
          return r <= 3.2 && r >= 2.2 && !door ? (y === 3 ? 0xc7c0dc : 0xe8e2f2) : 0;
        }
        const d = Math.sqrt(dx * dx + dz * dz + (y - 3.5) ** 2);
        const slit = x === 3 && z >= 3;
        return d <= 2.8 && d >= 1.8 && !slit ? 0x8fa3d9 : 0;
      },
    },
  ]),
];

// One bonus stone per chapter, opened by stars (the map decides when). Each is
// a little harder than its chapter's hardest level and never blocks the path.
const bonus = (i, s) => ({
  ...s, id: `bonus-${CHAPTERS[i].name.toLowerCase().replace(/[^a-z]+/g, '-')}`,
  chapter: CHAPTERS[i].name, palette: CHAPTERS[i].palette, bonus: true,
});

export const BONUS = [
  bonus(0, {
    // A pitched roof over a solid house, with a chimney off-centre.
    name: 'Cottage', dims: [7, 7, 5], fraction: 0.65, seed: 8,
    story: 'Smoke from the chimney means someone is home.',
    cell(x, y, z) {
      if (x === 5 && z === 1 && y >= 5) return 0xb4867a;                      // chimney
      if (y <= 2) {
        if (x < 1 || x > 5 || z < 1 || z > 3) return 0;
        if (z === 3 && x === 3 && y <= 1) return 0x7a5a8c;                     // door
        if (z === 3 && (x === 1 || x === 5) && y === 1) return 0xffd58a;       // windows
        return 0xf6e7d2;
      }
      const half = 3 - (y - 3);                                                // roof narrows upward
      return Math.abs(x - 3) <= half ? (y === 6 ? 0xb85a4a : 0xd9725e) : 0;
    },
  }),
  bonus(1, {
    // A frog on a notched lily pad.
    name: 'Frog', dims: [7, 4, 7], fraction: 0.8, seed: 6,
    story: 'It has been sitting on the same leaf all summer.',
    cell(x, y, z) {
      const dx = x - 3, dz = z - 3;
      if (y === 0) {
        const notch = x === 3 && z >= 5;
        return ring(dx, dz) <= 3.2 && !notch ? 0x3f8f6a : 0;
      }
      if (x === 1 && z === 1 && y >= 1 && y <= 2) return y === 2 ? 0xffd6df : 0xf6b3c2;  // a lotus on the pad's edge
      if (y === 1) {
        if ((dx * dx) / 4.4 + (dz * dz) / 2.6 <= 1) return z === 5 ? 0xe8e6a8 : 0x7cc46a;
        return (Math.abs(dx) === 3 && z === 2) || (Math.abs(dx) === 2 && z === 5) ? 0x7cc46a : 0;   // legs
      }
      if (y === 2) return Math.abs(dx) <= 1 && dz >= -1 && dz <= 1 ? 0x7cc46a : 0;
      return Math.abs(dx) === 1 && z === 4 ? 0xfaf5e4 : 0;                     // eyes
    },
  }),
  bonus(2, {
    // A whale, tail flukes raised, with a spout of water.
    name: 'Whale', dims: [10, 5, 5], fraction: 0.9, seed: 7,
    story: 'The lagoon’s oldest swimmer, singing to no one in particular.',
    cell(x, y, z) {
      if (x === 2 && z === 2 && y === 4) return 0x9fd9f0;                      // spout
      if (x <= 7 && ell(x - 3.6, y - 1.1, z - 2, 3.9, 1.9, 2.1)) {
        if (x === 1 && y === 1 && (z === 1 || z === 3)) return 0x1d2740;      // eyes
        return y === 0 ? 0xdde8f2 : 0x4f78b0;
      }
      if (x === 8 && z === 2 && (y === 1 || y === 2)) return 0x4f78b0;
      if (x === 9 && y === 2) return 0x4f78b0;                                 // flukes spread wide
      if (x === 9 && y === 3 && (z === 0 || z === 4)) return 0x4f78b0;
      return 0;
    },
  }),
  bonus(3, {
    // A paper lantern: a hollow shell with a candle burning inside.
    name: 'Paper Lantern', dims: [7, 9, 7], fraction: 0.9, seed: 1,
    story: 'One small flame inside, keeping the whole dusk company.',
    cell(x, y, z) {
      const dx = x - 3, dz = z - 3, r = ring(dx, dz);
      if (y === 0) return r <= 1.5 ? 0x5a3a4a : 0;
      if (y === 8) return r <= 1.0 ? 0x5a3a4a : 0;
      if (dx === 0 && dz === 0 && y <= 2) return 0xf6efe4;                    // candle
      if (dx === 0 && dz === 0 && y === 3) return 0xffd58a;                   // flame
      const out = [0, 2.3, 2.9, 3.2, 3.2, 3.2, 2.9, 2.3][y];
      if (r > out || r < out - 1.15) return 0;
      return y === 2 || y === 6 ? 0xa53b52 : 0xe0546b;
    },
  }),
  bonus(4, {
    // A crescent moon with a small star caught in its curve.
    name: 'Crescent Moon', dims: [9, 9, 4], fraction: 0.9, seed: 1,
    story: 'The moon came down to rest, and forgot to leave.',
    cell(x, y, z) {
      const inMoon = (px, py) => ring(px - 4, py - 4) <= 4.3 && ring(px - 6, py - 5.2) > 3.5;
      if (inMoon(x, y)) {
        const deep = [[1, 0], [-1, 0], [0, 1], [0, -1]].every(([a, b]) => inMoon(x + a, y + b));
        if (!deep && (z === 0 || z === 3)) return 0;
        return z === 0 ? 0xe8dcb8 : 0xfff1c9;
      }
      const star = Math.abs(x - 6) + Math.abs(y - 3) <= 1;                     // a small plus, in the crook
      return star && (z === 1 || z === 2) ? 0xffd58a : 0;
    },
  }),
];

// Random puzzle: a few overlapping spheres, coloured by height band.
export function randomShape(n, seed) {
  const rand = mulberry32(seed);
  const blobs = Array.from({ length: 3 + Math.floor(rand() * 3) }, () => ({
    c: [rand() * (n - 1), rand() * (n - 1), rand() * (n - 1)],
    r: n * (0.18 + rand() * 0.22),
  }));
  const hues = [0xe0546b, 0xe9b949, 0x6cc28f, 0x5b8fd6, 0xc98fb4];
  const h0 = Math.floor(rand() * hues.length);
  return {
    id: `random-${n}-${seed}`, name: `Drift ${seed % 1000}`, dims: [n, n, n], fraction: 0.85, seed,
    cell(x, y, z) {
      const inside = blobs.some(({ c, r }) => (x - c[0]) ** 2 + (y - c[1]) ** 2 + (z - c[2]) ** 2 <= r * r);
      return inside ? hues[(h0 + Math.floor((y / n) * 2)) % hues.length] : 0;
    },
  };
}

export function buildCells(shape) {
  const [X, Y, Z] = shape.dims;
  const size = X * Y * Z;
  const solid = new Uint8Array(size);
  const colors = new Uint32Array(size);
  for (let z = 0; z < Z; z++)
    for (let y = 0; y < Y; y++)
      for (let x = 0; x < X; x++) {
        const c = shape.cell(x, y, z);
        const i = x + X * (y + Y * z);
        if (c) { solid[i] = 1; colors[i] = c; }
      }
  return { solid, colors };
}


// Guided lessons. `show` picks which axes' clues are visible ([x, y, z]);
// clues are never auto-hidden so each lesson isolates one idea. Each hint
// holds until its event fires: break | paint | rotate | peel | solved.
export const TUTORIAL = [
  {
    id: 'lesson-clear', view: Math.PI / 4, handles: false, name: 'Clear', dims: [4, 2, 1], show: [1, 0, 0],
    cell: (x, y) => (y === 0 ? 0xe9b949 : 0),
    hints: [
      { text: 'Each number counts the cubes that stay in its row. A 0 means none do. Tap a top cube to chisel it away.', pulse: [0, 1, 0], until: 'break' },
      { text: 'Clear the rest of the top row.', until: 'solved' },
    ],
  },
  {
    id: 'lesson-mark', view: Math.PI / 4, handles: false, name: 'Keep', dims: [4, 3, 1], show: [1, 0, 0],
    cell: (x, y) => (y === 1 ? 0x5db6ae : 0),
    hints: [
      { text: 'A 4 in a row of four: every cube stays. Hold one of them to mark it.', pulse: [1, 1, 0], until: 'paint' },
      { text: 'Marked cubes can’t be chiselled by accident. Now clear the two 0 rows.', until: 'solved' },
    ],
  },
  {
    id: 'lesson-cross', view: Math.PI / 4, handles: false, name: 'Cross', dims: [3, 3, 1], show: [1, 1, 0],
    cell: (x, y) => (x === 1 || y === 1 ? 0xe0546b : 0),
    hints: [
      { text: 'Drag anywhere to turn the block. Clues sit on the tops as well as the front.', until: 'rotate' },
      { text: 'The middle column keeps all 3, so the single cube in the top and bottom rows must be in the middle.', until: 'solved' },
    ],
  },
  {
    id: 'lesson-groups', view: Math.PI / 4, handles: false, name: 'Groups', dims: [3, 2, 1], show: [1, 0, 0],
    cell: (x, y) => (y === 0 || x !== 1 ? 0xc98fb4 : 0),
    hints: [
      { text: 'A circled number means the cubes come in 2 separate groups (a square means 3 or more). Two cubes in two groups across three spaces leaves one way to do it.', until: 'solved' },
    ],
  },
  {
    id: 'lesson-peel', name: 'Lantern', dims: [3, 3, 3], show: [1, 1, 1],
    cell: (x, y, z) => (x === 1 && y === 1 && z === 1 ? 0 : 0xe9b949),
    hints: [
      { text: 'Something is hidden inside. Drag a diamond handle along the block’s edge to peel layers away.', pulseHandle: true, until: 'peel' },
      { text: 'Every row through the middle cube is split in two around it. Chisel it.', pulse: [1, 1, 1], until: 'solved' },
    ],
  },
];
