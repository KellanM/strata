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
  { name: 'Moss Garden', numeral: 'II', palette: 'Mint', blurb: 'small creatures of the garden',
    line: 'Green things grow slowly inside the quiet rock.' },
  { name: 'The Orchard', numeral: 'III', palette: 'Orchard', blurb: 'things that grow',
    line: 'Every seed keeps a shape it has not shown.' },
  { name: 'The Lagoon', numeral: 'IV', palette: 'Lagoon', blurb: 'the sea and the shore',
    line: 'The tide remembers everything it carried.' },
  { name: 'Ember Steps', numeral: 'V', palette: 'Dusk', blurb: 'temples and stairways',
    line: 'Climb slowly. The evening is climbing too.' },
  { name: 'Lantern Festival', numeral: 'VI', palette: 'Festival', blurb: 'festival things, lit from within',
    line: 'Tonight every paper lantern holds a wish.' },
  { name: 'Starfall', numeral: 'VII', palette: 'Night', blurb: 'the sky at night',
    line: 'What the sky let fall, the stone held.' },
];

const chapter = (i, list) => list.map((s) => ({ ...s, chapter: CHAPTERS[i].name, palette: CHAPTERS[i].palette }));

export const SHAPES = [
  // ---------------------------------------------------------------- First Light
  // Home and morning: small blocks, many clues, plain groups.
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
      // from the object gallery (teabag pal)
      id: 'teabag-pal', name: 'Teabag Pal', from: 'cand-teabag-pal', fraction: 0.45, seed: 11,
      story: 'Steeped once at dawn, and still smiling about it.',
      ...voxels({ a: 0xc89c63, b: 0xe2728f, c: 0x3a3442, d: 0xfbf8f2, e: 0xe0565b }, [
        'aaaaa aaaaa',
        'aaaaa aabaa',
        'aaaaa acaca',
        'aaaaa aaaaa',
        '.aaa. .aaa.',
        '..d.e .....',
        '..dde .....',
      ]),
    },
    {
      // from the object gallery (candle)
      id: 'candle', from: 'cand-candle', name: 'Candle', fraction: 0.1, seed: 3,
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
      id: 'toaster', from: 'cand-toaster', name: 'Toaster', fraction: 0.3, seed: 1,
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
      id: 'bed', from: 'cand-bed', name: 'Bed', fraction: 0.3, seed: 1,
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
      id: 'record-player', name: 'Record Player', from: 'cand-record-player', fraction: 0.3, seed: 1,
      story: 'The record still turns. The last song never quite finished.',
      ...voxels({ a: 0xa86f45, b: 0x7d8794, c: 0x3a3442, d: 0xe0565b, e: 0xe9b949 }, [
        'aaaaaaaa aaaaaaaa aaaaaaaa aaaaaaaa aaaaaaaa aaaaaaaa aaaaaaaa',
        '.......b .ccccc.. .ccccc.. .ccdcc.. .ccccc.. .ccccc.. .......e',
        '......bb .....bb. .....b.. ........ ........ ........ ........',
      ]),
    },
    {
      // from the object gallery (clock)
      id: 'alarm-clock', name: 'Alarm Clock', from: 'cand-clock', fraction: 0.5, seed: 1,
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
      // from the object gallery (page 5: Rucksack)
      id: 'rucksack', name: 'Rucksack', from: 'cand-p5-rucksack', fraction: 0.65, seed: 1,
      story: 'Packed the night before, a tin mug clinking on the side.',
      ...voxels({ a: 0x6b4a3a, b: 0xc98a4b, c: 0xa96f3a, d: 0xb59a6a, e: 0xc9d1d9, f: 0x6f7f4a, g: 0xe0565b, h: 0x5b7fc6, i: 0x3a3442 }, [
        '.aaaaa. .aaaaa. .aaaaa. .aaaaa. ....... .......',
        '.bbbbb. cbbbbbc cbbbbbc .bbbbb. ..aca.. .......',
        '.bbbbb. cbbbbbc cbbbbbc .bbbbb. ..aca.. ..d.d..',
        '.bbbbb. .bbbbb. .bbbbbe .bbbbb. .fafaf. .......',
        '.bbbbb. .bbbbb. .bbbbbe .bbbbb. .ffffg. .......',
        '..bbb.. .fffff. .fffff. .fffff. ....... .......',
        '....... hhihihh hhihihh ....... ....... .......',
        '....... hhihihh hhihihh ....... ....... .......',
      ]),
    },
    {
      // from the object gallery (bookshelf)
      id: 'bookshelf', from: 'cand-bookshelf', name: 'Bookshelf', fraction: 0.3, seed: 1,
      // hints curated for the solve path, not hidden at random (docs/aha-study.md)
      clues: '########..##..#..###.##.|.#################.##|.......#.#.....#......#.#...........#####.#...###.......',
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
    {
      // from the object gallery (page 4: Fried Egg)
      id: 'fried-egg', name: 'Fried Egg', from: 'cand-p4-fried-egg', fraction: 0.65, seed: 1,
      // hints curated for the solve path, not hidden at random (docs/aha-study.md)
      clues: '#...#.#.#.#.#.#.#.#.#...#.#.|..###..######.#####################.#####.#.####....#...#..#.#.|#....##..##...#####.####.#.##.#.####',
      story: 'Sunny side up, and the morning has barely begun.',
      ...voxels({ a: 0x5d6670, b: 0xfbf8f2, c: 0x9a6a45, d: 0xf59bb2, e: 0xf6b93b, f: 0x3a3442 }, [
        '..aaa.... .aaaaa... aaaaaaa.. aaaaaaa.. aaaaaaa.. .aaaaa... ..aaa....',
        '..aaa.... .abbba... abbbbba.. abbbbbacc abbbbba.. .adbda... ..aaa....',
        '......... ......... ..eee.... ..eee.... ..fef.... ......... .........',
        '......... ......... ......... ...e..... ......... ......... .........',
      ]),
    },
    {
      // from the object gallery (page 3: Kitten in a Box)
      id: 'kitten-box', name: 'Kitten in a Box', from: 'cand-p3-kitten-box', fraction: 0.35, seed: 22,
      // hints curated for the solve path, not hidden at random (docs/aha-study.md)
      clues: '#......#####...##..##.###..#######....##..|##########################################|#.......#####..#####.######..######.#####..#...#.',
      story: 'The box was for the new kettle. The kettle never stood a chance.',
      ...voxels({ a: 0xcf9f6c, b: 0xc4bed0, c: 0xfbf8f2, d: 0xf59bb2, e: 0x3a3442 }, [
        'aaaaaaa aaaaaaa aaaaaaa aaaaaaa aaaaaaa aaaaaaa',
        'aaaaaaa a.....a a.....a a.....a a.....a aaaaaaa',
        'aaaaaaa a.....a a.....a a.....a a.....a aaaaaaa',
        '....... a.....a a.bbb.a abbbbba a.bbb.a .c...c.',
        '....... ...b... .bbbbb. .bbbbb. .debed. .......',
        '....... ....... ..bbb.. .bbbbb. ..bbb.. .......',
        '....... ....... .b...b. .b...b. ....... .......',
      ]),
    },
    {
      // from the object gallery (page 4: Bunny in a Teacup)
      id: 'bunny-teacup', name: 'Bunny in a Teacup', from: 'cand-p4-bunny-teacup', fraction: 0.65, seed: 1,
      // hints curated for the solve path, not hidden at random (docs/aha-study.md)
      clues: '#.#......####.....######....###..###..##.##..####.#.###.#..#.##|.####...###.#.###########################.#####..|###..#####.###.##.#############.#########.##########.#..#####..',
      story: 'There was tea in it once. Now there is a bunny, which is better.',
      ...voxels({ a: 0xfbf3e6, b: 0x9fcdea, c: 0xfbf8f2, d: 0xf59bb2, e: 0x3a3442, f: 0xf5b3c0 }, [
        '..aaa.. .aaaaa. aaaaaaa aaaaaaa aaaaaaa .aaaaa. ..aaa..',
        '....... ..bbb.. .bbbbb. .bbbbb. .bbbbb. ..bbb.. .......',
        '....... ..bbb.. .b...b. .b...bb .b...b. ..bbb.. .......',
        '....... ..bbb.. .b.c.b. .bcccbb .b.c.b. ..bbb.. .......',
        '....... ....... ..ccc.. .dcccd. ..ece.. ....... .......',
        '....... ....... ..ccc.. .ccccc. ..ccc.. ....... .......',
        '....... ....... ....... ..c.c.. ..f.f.. ....... .......',
        '....... ....... ....... ..c.c.. ..f.f.. ....... .......',
        '....... ....... ....... ..c.c.. ....... ....... .......',
      ]),
    },
    {
      // A hollow pot: the empty belly is only reachable by peeling.
      id: 'teapot', name: 'Teapot', dims: [9, 6, 5], fraction: 0.3, seed: 13,
      // hints curated for the solve path, not hidden at random (docs/aha-study.md)
      clues: '########################.##...|..#.#..#.#.#.#######.#########.####..#.#.####|.........######.#.#.####.#.##..##..#............##....',
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
  // ---------------------------------------------------------------- Moss Garden
  // Small creatures and garden life: the first hollows and split rows.
  ...chapter(1, [
    {
      // from the object gallery (snail)
      id: 'snail', from: 'cand-snail', name: 'Snail', fraction: 0.4, seed: 1,
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
      // from the object gallery (snail cottage)
      id: 'snail-cottage', name: 'Snail Cottage', from: 'cand-snail-cottage', fraction: 0.35, seed: 16,
      story: 'She carries her whole house, and the window is always lit.',
      ...voxels({ a: 0xa9cf8f, b: 0xe8a87c, c: 0x6b4a3a, d: 0xfff0a8, e: 0x3a3442, f: 0xc8704b }, [
        '....... aaaaaaa aaaaaaa .......',
        '.bbbb.. .bbbbaa .bbbbaa .bcbb..',
        '.bbbb.. .bbbdaa .bbbbae .bcbb..',
        '.bbbb.. .bbbb.a .bbbb.a .bbbb..',
        '.ffff.. .ffff.. .ffff.. .ffff..',
        '..ff... ..ff... ..ff... ..ff...',
      ]),
    },
    {
      // from the object gallery (hatching chick)
      id: 'hatching-chick', name: 'Hatching Chick', from: 'cand-p2-chick', fraction: 0.2, seed: 23,
      story: 'First light through the shell, and a very small hello.',
      ...voxels({ a: 0xf3ead8, b: 0xf6d365, c: 0x3a3442, d: 0xf2a03d }, [
        '.aaa. aaaaa aaaaa aaaaa .aaa.',
        '.aaa. a...a a...a a...a .aaa.',
        '.a.a. abbba .bbb. abbba .a.a.',
        '..... .bbb. .bbb. .bbb. .....',
        '..... .bbb. .bbb. .cbc. ..d..',
        '..... ..b.. .bbb. ..... .....',
      ]),
    },
    {
      // from the object gallery (moth)
      id: 'moth', name: 'Moth', from: 'cand-p2-moth', fraction: 0.4, seed: 14,
      story: 'Drawn to the porch lamp, it stayed to watch the garden sleep.',
      ...voxels({ a: 0xc9b6e4, b: 0x6b4a3a, c: 0x3a3442 }, [
        '..a.a.. .......',
        '.aaaaa. ...b...',
        'aaaaaaa ...b...',
        'acaaaca ...b...',
        'aa...aa ...b...',
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
      // A banded skep with a door you can only see once it's open, hanging by a
      // dark stem that springs from the top block's upper corner.
      id: 'beehive', name: 'Beehive', dims: [5, 7, 5], fraction: 0.65, seed: 3,
      story: 'A whole summer of sunlight, stored away in wax.',
      cell(x, y, z) {
        const r = ring(x - 2, z - 2);
        if (y === 6) return x === 2 && z === 1 ? 0x2d3142 : 0;   // the stem: shares the top block's back top edge
        if (y === 1 && x === 2 && z === 4) return 0;
        if (y === 5) return r === 0 ? 0xd99a2b : 0;
        return r <= [2.2, 2.3, 2.1, 1.7, 1.0][y] ? (y % 2 ? 0xe9b949 : 0xd99a2b) : 0;
      },
    },
    {
      // from the object gallery (gnome)
      id: 'gnome', name: 'Garden Gnome', from: 'cand-gnome', fraction: 0.65, seed: 1,
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
      id: 'garden-bench', name: 'Garden Bench', from: 'cand-garden-bench', fraction: 0.65, seed: 1,
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
      // from the object gallery (fox)
      id: 'fox', from: 'cand-fox', name: 'Fox', fraction: 0.65, seed: 1,
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
      // from the object gallery (page 5: Mushroom Log)
      id: 'mushroom-log', name: 'Mushroom Log', from: 'cand-p5-mushroom-log', fraction: 0.65, seed: 1,
      story: 'The old log fell in a storm. Now it feeds a whole village.',
      ...voxels({ a: 0x5e3f2a, b: 0x7a5236, c: 0xe2c290, d: 0xf0b45a, e: 0xb98a5a, f: 0x6fae5a, g: 0xf3e6cc, h: 0xd98a4a }, [
        '......... ......... abbbbbbba ......... ......... .........',
        '......... cbbbbbbbc cbbbbbbbc cbbbbbbbc ......... ......d..',
        'abbbbbbba cbbbbbbbc ebbbbbbbe cbbbbbbbc abbbbbbba ..dd.ddd.',
        '......... cbbbbbbbc cbbbbbbbc cbbbbbbbc ......... .........',
        '......... ......... affffbbba ......... ......... .........',
        '......... ......... ..ff..g.. ....g.... ......... .........',
        '......... .....hhh. .....hhh. ....hhhh. ......... .........',
      ]),
    },
    {
      // from the object gallery (page 4: Capybara & Yuzu)
      id: 'capybara', name: 'Capybara & Yuzu', from: 'cand-p4-capybara', fraction: 0.65, seed: 1,
      story: 'A warm bath, a yuzu balanced just so, and nowhere to be.',
      ...voxels({ a: 0x7d5638, b: 0xb78358, c: 0xf59bb2, d: 0x3a3442, e: 0xf6b13a, f: 0x6fbf73 }, [
        '....... ..a.a.. ....... ...b... ....... ..a.a.. ....... .......',
        '....... ..bbb.. .bbbbb. .bbbbb. .bbbbb. ..bbb.. ....... .......',
        '...b... ..bbb.. .bbbbb. .bbbbb. .bbbbb. .bbbbb. .bbbbb. ..bbb..',
        '....... ..bbb.. .bbbbb. .bbbbb. .bbbbb. .bbbbb. .bbbbb. .cbabc.',
        '....... ....... ....... ...b... .bbbbb. .bbbbb. .bbbbb. .dbbbd.',
        '....... ....... ....... ....... ..bbb.. .bbbbb. .bbbbb. ..bbb..',
        '....... ....... ....... ....... ...e... .aeeea. ...e... .......',
        '....... ....... ....... ....... ....... ...ef.. ....... .......',
      ]),
    },
    {
      // from the object gallery (page 3: Corgi)
      id: 'corgi', name: 'Corgi', from: 'cand-p3-corgi', fraction: 0.65, seed: 1,
      story: 'Short legs, long walks, and every flowerbed inspected personally.',
      ...voxels({ a: 0xeba25a, b: 0xfbf8f2, c: 0xf59bb2, d: 0x3a3442 }, [
        '....... ..a.a.. ....... ...a... ....... ..b.b.. ....... .......',
        '....... ..aaa.. .aaaaa. .aaaaa. .aaaaa. ..aaa.. ....... .......',
        '....... ..aaa.. .aaaaa. .aaaaa. .aaaaa. ..aaa.. ..bbb.. .......',
        '....... ....... ...a... ..aaa.. ..aaa.. .aaaaa. .cbabc. ...b...',
        '....... ....... ....... ....... ..aaa.. .aaaaa. .adbda. .......',
        '....... ....... ....... ....... .a...a. .aaaaa. ...b... .......',
        '....... ....... ....... ....... ....... .a...a. ....... .......',
      ]),
    },
  ]),
  // ---------------------------------------------------------------- The Orchard
  // Things that grow: rounder forms, overhangs, fewer clues.
  ...chapter(2, [
    {
      id: 'apple', name: 'Apple', dims: [5, 6, 5], fraction: 0.3, seed: 2,
      story: 'The first one to fall, and the sweetest.',
      cell(x, y, z) {
        if (y === 5) return x === 2 && z === 2 ? 0x8a5a3c : x === 3 && z === 2 ? 0x5fae6e : 0;
        return ell(x - 2, y - 2, z - 2, 2.4, 2.3, 2.4) ? (y === 4 ? 0xe86a6a : 0xd9455a) : 0;
      },
    },
    {
      // from the object gallery (page 3: Avocado)
      id: 'avocado', name: 'Avocado', from: 'cand-p3-avocado', fraction: 0.65, seed: 1,
      story: 'Not ready, not ready, not ready - perfect for about an hour.',
      ...voxels({ a: 0x4f8a3c, b: 0xe2ee9c, c: 0x9b6a43, d: 0xf59bb2, e: 0x3a3442 }, [
        '.aaaaa. .aaaaa. .......',
        'aaaaaaa abcccba ...c...',
        'aaaaaaa accccca ..ccc..',
        'aaaaaaa abcccba ...c...',
        'aaaaaaa adbbbda .......',
        'aaaaaaa abebeba .......',
        '.aaaaa. .abbba. .......',
        '.aaaaa. .abbba. .......',
        '..aaa.. ..aaa.. .......',
      ]),
    },
    {
      // from the object gallery (cactus)
      id: 'cactus', from: 'cand-cactus', name: 'Cactus', fraction: 0.4, seed: 1,
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
      // from the object gallery (page 4: Sloth)
      id: 'sloth', name: 'Sloth', from: 'cand-p4-sloth', fraction: 0.65, seed: 1,
      story: 'It has been hanging there since spring. It is in no rush.',
      ...voxels({ a: 0xb7a083, b: 0xf3e6cc, c: 0x6e4f3a, d: 0x3a3442, e: 0x6fbf73, f: 0x8a6646 }, [
        '......... ......... ...a.a... ......... .........',
        '......... ...aaa... ...aaa... ....a.... .........',
        '......... ...aaa... ...aaa... ...aaa... .........',
        '......... ....a.... ...aaa... ...bcb... .........',
        '......... ...aaa... ..aaaaa.. ..cdbdc.. .........',
        '......... ...aaa... ..aaaaa.. ..abbba.. .........',
        '......... ......... ..aaaaa.. ...aaa... .........',
        '......... e......ee ..a...aee ......... .........',
        '......... fffffffff fffffffff ......... .........',
      ]),
    },
    {
      // from the object gallery (pumpkin)
      id: 'pumpkin', from: 'cand-pumpkin', name: 'Pumpkin', fraction: 0.65, seed: 1,
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
      id: 'sunflower', from: 'cand-sunflower', name: 'Sunflower', fraction: 0.65, seed: 1,
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
      // from the object gallery (page 4: Koala)
      id: 'koala', name: 'Koala', from: 'cand-p4-koala', fraction: 0.65, seed: 1,
      story: 'It found the best tree in the orchard and is not letting go.',
      ...voxels({ a: 0x9a7656, b: 0xaab0bf, c: 0x4d4250, d: 0xf4f2f5, e: 0x3a3442, f: 0x6fbf73 }, [
        '..aaa.. ..aaa.. ....... ....... ....... ....... .......',
        '..aaa.. ..aaa.. ....... ..bbb.. ..b.b.. ....... .......',
        '..aaa.. ..aaa.. ..bbb.. .bbbbb. ..bbb.. ....... .......',
        '..aaa.. ..aaa.. .bbbbb. .bbbbb. ..bbb.. ....... .......',
        '..aaa.. ..aaa.. .b...b. ..bbb.. ..bcb.. ...c... .......',
        '..aaa.. ..aaa.. ..bbb.. bbbbbbb debbbed ..bcb.. ...c...',
        '..aaa.. ..aaa.. ...b... bbbbbbb dbbbbbd ..bbb.. .......',
        '..aaa.f ..aaa.. ....... bb...bb dd...dd ....... .......',
        '..aafff ..aafff ....... ....... ....... ....... .......',
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
      // from the object gallery (page 5: Wisteria Bonsai)
      id: 'wisteria-bonsai', name: 'Wisteria Bonsai', from: 'cand-p5-wisteria', fraction: 0.65, seed: 1,
      story: 'Every spring it remembers it was meant to be a waterfall.',
      ...voxels({ a: 0xeee3cf, b: 0x6b4a3a, c: 0x8a5a3c, d: 0x8f6ad1, e: 0xc9a6e8, f: 0x7fbf6a, g: 0x5a9f55 }, [
        '......... .a.aaa.a. .a.aaa.a. .a.aaa.a. .........',
        '......... .aaaaaaa. .abbbbba. .aaaaaaa. .........',
        '......... ......... ....c.... ......... .........',
        '......... ...d..... ....d.... .d....... .........',
        '......... .d.e.d... ..dcec... .e.d.d.d. .........',
        '......... .e.e.e.d. ..ececc.d .e.e.e.e. .........',
        '......... .fff.e.e. .ffff.c.e .fff.e.e. .........',
        '......... .....fff. .....fgff .....fff. .........',
        '......... ......f.. .....fff. ......f.. .........',
      ]),
    },
    {
      // from the object gallery (page 5: Maple Bonsai)
      id: 'maple-bonsai', name: 'Maple Bonsai', from: 'cand-p5-maple-bonsai', fraction: 0.65, seed: 1,
      story: 'Forty autumns in a shallow pot, and it still turns red.',
      ...voxels({ a: 0x5d6670, b: 0x6b4a3a, c: 0x8a5a3c, d: 0xd9483b, e: 0xf08a3c, f: 0xf6c14a }, [
        '........ aaaaaaaa aaaaaaaa aaaaaaaa aaaaaaaa ........',
        '........ .aaaaaa. abbbbbba abbbbbba .aaaaaa. ........',
        '........ ........ ...cc.d. ...cc... ........ ........',
        '........ ........ ...c.... ....c... ........ ........',
        '........ ........ ..cc.... ....cc.. ........ ........',
        '........ ........ .dd..... .dd..c.. ........ ........',
        '........ .dd..... dddd.ee. ddddeeee .dd..ee. ........',
        '........ ..ff.... ..fffee. ..ff.ee. .....ee. ........',
      ]),
    },
  ]),
  // ---------------------------------------------------------------- The Lagoon
  // The sea and the shore: wide shapes, hidden insides.
  ...chapter(3, [
    {
      // from the object gallery (flip-flops)
      id: 'flip-flops', from: 'cand-flip-flops', name: 'Flip-Flops', fraction: 0.65, seed: 1,
      story: 'Kicked off at the water\'s edge, one a little ahead of the other.',
      ...voxels({ a: 0x5b8fd6, b: 0x8cc8e8, c: 0xf4a3b5 }, [
        'aaa.... aaabbb. aaabbb. aaabbb. aaabbb. aaabbb. ...bbb.',
        '....... .c..... c.c.c.. ...c.c. ....... ....... .......',
      ]),
    },
    {
      // from the object gallery (page 3: Puffin)
      id: 'puffin', name: 'Puffin', from: 'cand-p3-puffin', fraction: 0.65, seed: 1,
      story: 'A sea-bird in a painted beak, home for the summer.',
      ...voxels({ a: 0xf2913d, b: 0x35313e, c: 0xfbf8f2, d: 0xf6c64a, e: 0xf59bb2, f: 0xf06b3a, g: 0x3a3442 }, [
        '..... ..... ..... .a.a. .a.a. .....',
        '..... ..b.. .bbb. .ccc. ..c.. .....',
        '..... .bbb. bbbbb .ccc. .ccc. .....',
        '..... .bbb. bbbbb .ccc. .ccc. .....',
        '..... ..b.. .bbb. .ccc. ..c.. ..d..',
        '..... .bbb. .bbb. .ccc. .ece. ..f..',
        '..... ..b.. .bbb. .ccc. .gcg. .....',
        '..... ..... ..b.. ..b.. ..... .....',
      ]),
    },
    {
      // from the object gallery (page 4: Manta Ray)
      id: 'manta', name: 'Manta Ray', from: 'cand-p4-manta', fraction: 0.65, seed: 1,
      story: 'A shadow that flies, slow and wide, over the lagoon floor.',
      ...voxels({ a: 0x5f78bf, b: 0xf59bb2, c: 0xf4f7fb, d: 0x3a3442 }, [
        '....a.... ....a.... ..aaaaa.. .aaaaaaa. aaaaaaaaa ..abcba.. ...a.a...',
        '......... ......... ...aaa... ...aaa... a..aaa..a ...dad... .........',
        '......... ......... ......... ......... ......... ......... .........',
      ]),
    },
    {
      // from the object gallery (page 4: Seahorse)
      id: 'seahorse', name: 'Seahorse', from: 'cand-p4-seahorse', fraction: 0.65, seed: 1,
      story: 'It holds the seagrass with its tail and watches the tide go by.',
      ...voxels({ a: 0xf6a26b, b: 0xfbe0b8, c: 0xfbcf9a, d: 0xf59bb2, e: 0x3a3442 }, [
        '....... .aaa... .......',
        '...aa.. .a.aa.. ...aa..',
        '..aabb. ..aabb. ..aabb.',
        '.aaaab. caaaab. .aaaab.',
        '.aaab.. caaab.. .aaab..',
        '..aad.. ..aaa.. ..aad..',
        '..aae.. ..aaaaa ..aae..',
        '..aaa.. ..aaa.. ..aaa..',
        '....... ..aaa.. .......',
      ]),
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
      // from the object gallery (page 4: Baby Shark)
      id: 'baby-shark', name: 'Baby Shark', from: 'cand-p4-baby-shark', fraction: 0.65, seed: 1,
      story: 'All the teeth, none of the menace. Yet.',
      ...voxels({ a: 0x86aed6, b: 0xf4f7fb, c: 0xf59bb2, d: 0x3a3442 }, [
        '....... ....... ....... ....... ....... ....... ....... ....... .......',
        '...a... ....... ..bbb.. ..bbb.. .bbbbb. .bbbbb. ..bbb.. ...b... .......',
        '...a... ..aaa.. .aaaaa. .aaaaa. aaaaaaa aaaaaaa .cbbbc. ..bbb.. ...b...',
        '...a... ..aaa.. .aaaaa. .aaaaa. .aaaaa. .aaaaa. .aaaaa. ..dad.. .......',
        '...a... ....... ...a... ..aaa.. ..aaa.. ..aaa.. ..aaa.. ....... .......',
        '....... ....... ....... ...a... ...a... ....... ....... ....... .......',
        '....... ....... ....... ...a... ....... ....... ....... ....... .......',
      ]),
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
      // from the object gallery (jellyfish)
      id: 'jellyfish', from: 'cand-jellyfish', name: 'Jellyfish', fraction: 0.8, seed: 2,
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
      // from the object gallery (page 3: Axolotl)
      id: 'axolotl', name: 'Axolotl', from: 'cand-p3-axolotl', fraction: 0.65, seed: 1,
      story: 'It smiles at the bottom of the pool, and never says why.',
      ...voxels({ a: 0xf7b8cc, b: 0xe46a8e, c: 0xf59bb2, d: 0xd0607e, e: 0x3a3442 }, [
        '......... ...a.a... ......... ......... bba...abb ......... .........',
        '....a.... ...aaa... ...aaa... ...aaa... .baaaaab. ..caaac.. ...ada...',
        '....a.... ...aaa... ...aaa... ...aaa... bbaaaaabb ..aaaaa.. ..aeaea..',
        '....a.... ......... ......... ....a.... .baaaaab. ..aaaaa.. ...aaa...',
        '......... ......... ......... ......... bb.....bb ......... .........',
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
      // from the object gallery (page 4: Anglerfish)
      id: 'anglerfish', name: 'Anglerfish', from: 'cand-p4-anglerfish', fraction: 0.65, seed: 1,
      story: 'Down where the sun never reaches, it brought its own lamp.',
      ...voxels({ a: 0x7a86cf, b: 0x8a3a5a, c: 0xfbf8f2, d: 0xf59bb2, e: 0x3a3442, f: 0x4d4a78, g: 0xffe36b }, [
        '....... ....... ....... ....... ....... ....... ....... .......',
        '....... ....... ..aaa.. ..aaa.. ..aaa.. ...a... ....... .......',
        '...a... ...a... .aaaaa. .aaaaa. .aaaaa. .bcbcb. ....... .......',
        '...a... ..aaa.. .aaaaa. aaaaaaa .aaaaa. .daaad. ....... .......',
        '...a... ....... aaaaaaa .aaaaa. .aaaaa. ..eae.. ....... .......',
        '....... ....... ....... ..aaa.. ...a... ....... ....... .......',
        '....... ....... ....... ...f... ....... ....... ...g... .......',
        '....... ....... ....... ...f... ...f... ...f... ...f... .......',
      ]),
    },
    {
      // from the object gallery (crab)
      id: 'crab', from: 'cand-crab', name: 'Crab', fraction: 0.8, seed: 2,
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
      id: 'palm-islet', name: 'Palm Islet', from: 'cand-palm-islet', fraction: 0.65, seed: 2,
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
      // from the object gallery (pelican)
      id: 'pelican', from: 'cand-pelican', name: 'Pelican', fraction: 0.8, seed: 15,
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
      id: 'turtle', name: 'Turtle', dims: [7, 4, 8], fraction: 0.8, seed: 13,
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
  // Temple architecture: long chains of deduction.
  ...chapter(4, [
    {
      // from the object gallery (taiko drum)
      id: 'taiko-drum', from: 'cand-taiko', name: 'Taiko Drum', fraction: 0.8, seed: 18,
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
      // from the object gallery (temple bell)
      id: 'temple-bell', from: 'cand-bell', name: 'Temple Bell', fraction: 0.65, seed: 1,
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
      id: 'gate', name: 'Gate', dims: [9, 6, 2], fraction: 0.95, seed: 22,
      story: 'Pass beneath it and leave the day behind.',
      cell(x, y) {
        if (y === 5) return 0x3d2e3a;
        if (y === 3) return x >= 1 && x <= 7 ? 0xe2553f : 0;
        if (y === 4 && x === 4) return 0xe2553f;
        return x === 2 || x === 6 ? (y === 0 ? 0x3d2e3a : 0xe2553f) : 0;
      },
    },
    {
      // from the object gallery (page 4: Nara Fawn) - ears perked up and in, so the
      // block is 5 wide, not 7, and stays under the phone's tap budget
      id: 'nara-fawn', name: 'Nara Fawn', from: 'cand-p4-nara-deer', fraction: 0.65, seed: 1,
      story: 'It bows for a rice cracker, and expects one every time.',
      ...voxels({ a: 0xcf9258, b: 0xfbf3e6, c: 0xf6e3c8, d: 0x3a3442, e: 0xf3b6c4, f: 0xe9d2a8 }, [
        '....... ....... ..a.a.. ....... ..a.a.. ....... ....... .......',
        '....... ....... ..a.a.. ....... ..a.a.. ....... ....... .......',
        '....... ...a... ..aaa.. ..aaa.. ..aaa.. ...a... ....... .......',
        '...b... ..aba.. ..bab.. ..aba.. ..aaa.. ..aaa.. ....... .......',
        '....... ....... ....... ....... ..aaa.. ..ccc.. ...d... .......',
        '....... ....... ....... ....... .aaaaa. .aaaaa. ..dad.. .......',
        '....... ....... ....... ....... ..aaa.. .aaaaa. ..aaa.. .......',
        '....... ....... ....... ....... .a.a.a. .eaaae. ....... .......',
        '....... ....... ....... ....... ....... ..f.f.. ....... .......',
      ]),
    },
    {
      // from the object gallery (page 5: Tsukubai)
      id: 'tsukubai', name: 'Tsukubai', from: 'cand-p5-tsukubai', fraction: 0.65, seed: 1,
      story: 'Crouch to drink, and the water teaches you to be humble.',
      ...voxels({ a: 0xd6cfc2, b: 0xc6bfb2, c: 0x6fae5a, d: 0x8f949c, e: 0x8fbf4a, f: 0x6f9f3a, g: 0x6fb7e0, h: 0xd9b48f }, [
        'aaaaaaaaa bbbbbbbbb caaaaaaaa ccbbbbbbb ccaaaaaaa',
        '......d.. .....ddd. ..e.ddddd .....ddd. ......d..',
        '......d.. .....ddd. ..e.ddddd .....ddd. ......d..',
        '......... .....ddd. ..f..dgd. .....ddd. .........',
        '......... ......... ..e...g.. .......h. .....hhh.',
        '......... ......... ..eeef... ......... .........',
      ]),
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
      // from the object gallery (page 3: Snow Monkey)
      id: 'snow-monkey', name: 'Snow Monkey', from: 'cand-p3-snow-monkey', fraction: 0.65, seed: 1,
      story: 'Snow on its head, warm water to its chin, in no hurry at all.',
      ...voxels({ a: 0x9a6a45, b: 0x9fd8f0, c: 0xa8988a, d: 0xf3a7a4, e: 0x3a3442, f: 0xfbf8f2 }, [
        '..aaa.. .aaaaa. aaaaaaa aaaaaaa aaaaaaa .aaaaa. ..aaa..',
        '..aaa.. .a...a. a.....a a.....a a.....a .a...a. ..aaa..',
        '..aaa.. .abbba. abbcbba abcccba abbcbba .abbba. ..aaa..',
        '....... ....... ..ccc.. ..ccc.. ..ddd.. ....... .......',
        '....... ....... ..ccc.. dcccccd ..ede.. ....... .......',
        '....... ....... ..ccc.. .ccccc. ..ddd.. ....... .......',
        '....... ....... ...f... ..fff.. ...f... ....... .......',
        '....... ....... ...f... ..ff... ....... ....... .......',
      ]),
    },
    {
      // from the object gallery (tea house); replaced the Pagoda
      id: 'tea-house', name: 'Tea House', from: 'cand-teahouse', fraction: 1.0, seed: 1,
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
      // from the object gallery (page 3: Shiba Pup)
      id: 'shiba-pup', name: 'Shiba Pup', from: 'cand-p3-shiba', fraction: 0.65, seed: 1,
      story: 'It guards the temple steps, mostly by napping on them.',
      ...voxels({ a: 0xe9a05a, b: 0xf8ead2, c: 0xf59bb2, d: 0x3a3442 }, [
        '....... ....... ...a... ...a... ..b.b.. .......',
        '....... ..aaa.. ..aaa.. .aaaaa. ..bbb.. .......',
        '....ab. ..aaa.. .aaaaa. .aaaaa. ..bbb.. .......',
        '....aa. ....... ..aaa.. ..bbb.. ....... .......',
        '....... ....... .aaaaa. .aaaaa. .cbbbc. ...d...',
        '....... ..aaa.. .aaaaa. aaaaaaa .aaaaa. ..dad..',
        '....... ....... .aaaaa. .aaaaa. .ababa. .......',
        '....... ....... .a...a. .aaaaa. ....... .......',
        '....... ....... ....... .a...a. ....... .......',
      ]),
    },
    {
      // from the object gallery (page 4: Temple Elephant)
      id: 'temple-elephant', name: 'Temple Elephant', from: 'cand-p4-temple-elephant', fraction: 0.65, seed: 1,
      story: 'Dressed for the procession, patient as the stone steps.',
      ...voxels({ a: 0xb7b3c8, b: 0xf3b6c4, c: 0xf59bb2, d: 0x3a3442, e: 0xe0565b, f: 0xe9b949 }, [
        '......... ...a.a... ......... ......... ...a.a... ......... .........',
        '......... ...aaa... ..aaaaa.. ..aaaaa.. ...aaa... ......... ....a....',
        '....a.... ...aaa... ..aaaaa.. ..aaaaa.. ...aaa... ......... ....a....',
        '......... ....a.... ...aaa... aa.aaa.aa ...aaa... ....a.... ....a....',
        '......... ......... ...aaa... aaaaaaaaa bbcaaacbb ...aaa... .........',
        '......... ......... ...aaa... aaaaaaaaa bbaaaaabb ...dad... .........',
        '......... ......... ....e.... aa.eee.aa ...efe... ......... .........',
        '......... ......... ......... ......... ......... ......... .........',
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
  // ---------------------------------------------------------------- Lantern Festival
  // Festival things: faces and folds, peeled to find.
  ...chapter(5, [
    {
      // from the object gallery (dragon head)
      id: 'dragon-head', from: 'cand-dragon-head', name: 'Dragon Head', fraction: 0.8, seed: 15,
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
      // from the object gallery (page 4: Little Oni)
      id: 'little-oni', name: 'Little Oni', from: 'cand-p4-oni', fraction: 0.65, seed: 1,
      story: 'On bean-throwing night it hides behind its club, grinning.',
      ...voxels({ a: 0xf28b82, b: 0xf6c94a, c: 0x5a3d2e, d: 0x8a8f9c, e: 0xfbf8f2, f: 0xfbd0d0, g: 0x4a3a5a, h: 0x3a3442, i: 0xf6e3a8 }, [
        '....... ....... ....... ....... ..a.a.. .......',
        '....... ...b... ..cbc.. ..cbc.d ..cbc.. .......',
        '....... ..aaa.. .aaaaa. .aaaaad ..aaa.. .......',
        '....... ....... ..aaa.. ..aaa.d ...a... ...e...',
        '....... ...a... .aaaaa. .faaafd ..aaa.. .......',
        '....... ..ggg.. .aaaaad .aaaaad .ahaha. .......',
        '....... ....... .gggggd .gggggd ..ggg.. .......',
        '....... ....... ....... ..i.i.. ....... .......',
        '....... ....... ....... ..i.i.. ....... .......',
      ]),
    },
    {
      // from the object gallery (kokeshi)
      id: 'kokeshi', from: 'cand-kokeshi', name: 'Kokeshi', fraction: 1, seed: 5,
      story: 'Turned from cherry wood, smiling the same small smile for years.',
      ...voxels({ a: 0xe0565b, b: 0xf4a3b5, c: 0x3a3442, d: 0xf6efe4 }, [
        '..... .aaa. .aaa. .aaa. .....',
        '..... .baa. .aab. .aba. .....',
        '..... .aab. .aba. .baa. .....',
        '..... .aba. .baa. .aab. .....',
        '..... .baa. .aab. .aba. .....',
        '.ccc. ccccc cdddc ddddd .bdb.',
        '.ccc. ccccc cdddc ddddd .cdc.',
        '.ccc. ccccc cdddc cdddc .ddd.',
        '.ccc. ccccc cccca ccccc .ccc.',
      ]),
    },
    {
      // from the object gallery (maneki-neko)
      id: 'maneki-neko', from: 'cand-maneki-neko', name: 'Maneki-neko', fraction: 0.85, seed: 17,
      story: 'One paw raised, calling luck in from the street.',
      ...voxels({ a: 0xfbf8f2, b: 0xe9b949, c: 0xe0565b, d: 0x3a3442, e: 0xf4a3b5 }, [
        '...... ...... ..aa.. ...... ......',
        '...... .aaaa. .aaaa. .aaaa. ......',
        '...... .aaaa. .aaaa. .aaaa. ..bb..',
        '...... ..aa.. .aaaaa ..aa.. ..bb..',
        '...... .aaaa. .aaaaa .cccc. ......',
        '...... .aaaa. .aaaaa .adad. ......',
        '...... .aaaa. .aaaaa .aaaae ......',
        '...... .e..e. .a..a. ...... ......',
      ]),
    },
    {
      // from the object gallery (page 4: Kappa)
      id: 'kappa', name: 'Kappa', from: 'cand-p4-kappa', fraction: 0.65, seed: 1,
      story: 'Bow to it politely, and the water on its head spills out.',
      ...voxels({ a: 0x8fcf7a, b: 0xa8784a, c: 0x4f9e4a, d: 0xf59bb2, e: 0xf6c94a, f: 0x3a3442, g: 0x3f7a5a, h: 0xe9eef2, i: 0x8fd0e6 }, [
        '....... ....... ....... ....... ..a.a.. ....... .......',
        '....... ..bbb.. ..aaa.. ..aaa.. ..aaa.. ....... .......',
        '...b... ..bbb.. ..aba.. .aaaaa. .aaaaa. ..ccc.. .......',
        '....... ..bbb.. ..aaa.. ..aaa.. ...a... ....... .......',
        '....... ...b... .aaaaa. .aaaaa. .daaad. ...e... .......',
        '....... ...a... .aaaaa. .aaaaa. .afafa. ...a... .......',
        '....... ....... ..aaa.. .gaaag. ..aaa.. ....... .......',
        '....... ....... ..hhh.. ..hih.. ..hhh.. ....... .......',
        '....... ....... ....... ....... ....... ....... .......',
      ]),
    },
    {
      // from the object gallery (daruma)
      id: 'daruma', from: 'cand-daruma', name: 'Daruma', fraction: 0.9, seed: 23,
      story: 'Knock it down and it rises again, every single time.',
      ...voxels({ a: 0xe0565b, b: 0xe9b949, c: 0xf6efe4, d: 0x3a3442 }, [
        '...... ...... ..aa.. ..aa.. ...... ......',
        '...... ..aa.. .aaaa. .aaaa. ..aa.. .bbbb.',
        '...... .aaaa. .aaaa. .aaaa. .aaaa. ......',
        '..aa.. .aaaa. aaaaaa aaaaaa .aaaa. .cccc.',
        '...... .aaaa. .aaaa. .aaaa. .aaaa. .dccd.',
        '...... ..aa.. .aaaa. .aaaa. ..aa.. .acca.',
        '...... ...... ..aa.. ..aa.. ...... ......',
      ]),
    },
    {
      // from the object gallery (page 5: Chochin)
      id: 'chochin', name: 'Chochin', from: 'cand-p5-chochin', fraction: 0.65, seed: 1,
      story: 'Folded flat all year, it opens wide for one bright night.',
      ...voxels({ a: 0x3a3442, b: 0xe0c9a0, c: 0xfbf1dc, d: 0xf6a03d, e: 0xe0565b, f: 0xffd36a }, [
        '..... ..a.. .aaa. ..a.. .....',
        '..... .bbb. .bbb. .bbb. .....',
        '.ccc. cc.cc c.d.c cc.cc .ccc.',
        '.eee. bb.bb b.f.b bb.bb .eee.',
        '.ece. cc.cc c...c cc.cc .ece.',
        '.eee. bb.bb b...b bb.bb .eee.',
        '.ccc. cc.cc c...c cc.cc .ccc.',
        '..... .bbb. .bbb. .bbb. .....',
        '..... ..a.. .aaa. ..a.. .....',
        '..... ..... .aaa. ..... .....',
      ]),
    },
    {
      // from the object gallery (koinobori)
      id: 'koinobori', from: 'cand-koinobori', name: 'Koinobori', fraction: 0.8, seed: 17,
      story: 'A paper carp that swims the wind on festival mornings.',
      ...voxels({ a: 0x6b4a3a, b: 0xe0565b, c: 0xfbf8f2, d: 0xe2728f, e: 0x3a3442, f: 0xe9b949 }, [
        '.......... a......... .......... ..........',
        '.......... a........b .........b ..........',
        '.......... accccccc.b .ccccccc.b ..........',
        '.......... acbdbbdbbb .cbdbbdbbb ..........',
        '.......... acdbbdbbb. ..dbbdbbb. ..........',
        '..ce...... acbbdbbdbb .cbbdbbdbb ..ce......',
        '.......... abbdbbdb.b .bbdbbdb.b ..........',
        '.......... f........b .........b ..........',
      ]),
    },
    {
      // from the object gallery (page 4: Tanuki)
      id: 'tanuki', name: 'Tanuki', from: 'cand-p4-tanuki', fraction: 0.65, seed: 1,
      story: 'A leaf on its head, and it could be anything at all.',
      ...voxels({ a: 0x6b4e3a, b: 0xa98663, c: 0xf2dcc0, d: 0x3a3442, e: 0x6fbf73 }, [
        '....... ....... ....... ....... ..a.a.. ....... .......',
        '....b.. ...b... ..bbb.. .bbbbb. ..ccc.. ....... .......',
        '....b.. ..bbb.. .bbbbb. .bbbbb. .ccccc. ....... .......',
        '....a.. ....... ..bbb.. .bbbbb. ..bbb.. ....... .......',
        '....... ....... .bbbbb. .bbbbb. .accca. ...d... .......',
        '....... ...b... .bbbbb. .bbbbb. .adbda. ...c... .......',
        '....... ....... .bbbbb. .bbbbb. .bbbbb. ....... .......',
        '....... ....... .a...a. .a.b.a. ....... ....... .......',
        '....... ....... ....e.. ..eee.. ....... ....... .......',
      ]),
    },
    {
      // from the object gallery (origami fox)
      id: 'origami-fox', from: 'cand-origami-fox', name: 'Origami Fox', fraction: 0.9, seed: 23,
      story: 'Folded from a single sheet, and quicker than it looks.',
      ...voxels({ a: 0xf2a03d, b: 0xfbf8f2, c: 0x3a3442 }, [
        '....... .aaaa.. .aaaa.. .aaaa.. .......',
        '....... aaaaa.. aaaaa.. .aaaa.. .......',
        '....... a..aaaa a..aaaa ...abba .......',
        '....... b..aaaa a..aaaa ...caac .......',
        '....... b..a..a ....... ....... .......',
        '....... ...a..a ....... ....... .......',
      ]),
    },
  ]),
  // ---------------------------------------------------------------- Starfall
  // The sky at night: the longest climbs.
  ...chapter(6, [
    {
      // from the object gallery (page 5: Geode)
      id: 'geode', name: 'Geode', from: 'cand-p5-geode', fraction: 0.65, seed: 1,
      story: 'A dull grey stone, holding a night sky inside.',
      ...voxels({ a: 0x6f6258, b: 0x8a7a6e, c: 0xe8e2f0, d: 0x9b6ad8, e: 0xc9a6f0, f: 0xf6ecff }, [
        '....... ....... ....... ...a... ..aba..',
        '....... ....... ..bab.. .bacab. .accca.',
        '....... ..bbb.. .bcccb. .addeb. ace.ecb',
        '....... ..bbb.. .acfcb. aceedcb bc...cb',
        '....... ..bbb.. .bcccb. .adedb. ace.ecb',
        '....... ....... ..bbb.. .bbcbb. .acccb.',
        '....... ....... ....... ...b... ..bbb..',
      ]),
    },
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
      // from the object gallery (page 4: Baby Yeti)
      id: 'baby-yeti', name: 'Baby Yeti', from: 'cand-p4-baby-yeti', fraction: 0.65, seed: 1,
      story: 'Its footprints are small. The stories will make them bigger.',
      ...voxels({ a: 0x7f97c0, b: 0xf6f7fb, c: 0x9fb6d8, d: 0xf5f0f5, e: 0xf59bb2, f: 0x3a3442, g: 0xf3e2b0 }, [
        '....... ....... ....... ....... .aa.aa. .aa.aa. .......',
        '....... ....... ..bbb.. .bbbbb. ..bbb.. ....... .......',
        '....... ..bbb.. .bbbbb. .bbbbb. .bbbbb. ..bbb.. .......',
        '....... ...b... .bbbbb. bbbbbbb .bcbcb. ...d... .......',
        '....... ....... ..bbb.. bbbbbbb .ecfce. ....... .......',
        '....... ....... .bbbbb. .bbbbb. .cbbbc. ..fcf.. .......',
        '....... ....... .bbbbb. .bbbbb. .bbbbb. .bbbbb. ..bbb..',
        '....... ....... ....... .gbbbg. ...b... ....... .......',
        '....... ....... ....... .g...g. ....... ....... .......',
      ]),
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
      // from the object gallery (page 3: Polar Bear Cub)
      id: 'polar-cub', name: 'Polar Bear Cub', from: 'cand-p3-polar-cub', fraction: 0.65, seed: 1,
      story: 'Wrapped up for the long night, watching the sky go green.',
      ...voxels({ a: 0xf8f6f2, b: 0xe8576b, c: 0xece2d4, d: 0xf59bb2, e: 0x3a3442 }, [
        '....... ....... ...a... ...a... ..a.a.. .......',
        '....... ..aaa.. .aaaaa. .aaaaa. ..aaa.. ....b..',
        '....... ..aaa.. .aaaaa. .aaaaa. ..aaa.. ....b..',
        '....... ...b... ..bbb.. ..bbb.. ...b... ...c...',
        '....... ..aaa.. .aaaaa. .aaaaa. .daaad. ..cec..',
        '....... ..aaa.. .aaaaa. .aaaaa. .aeaea. .......',
        '....... ...a... .aaaaa. .aaaaa. ..aaa.. .......',
        '....... ....... .a...a. ....... ....... .......',
      ]),
    },
    {
      // from the object gallery (page 3: Baby Dragon)
      id: 'baby-dragon', name: 'Baby Dragon', from: 'cand-p3-baby-dragon', fraction: 0.65, seed: 1,
      story: 'It has not breathed fire yet. It practises on the stars.',
      ...voxels({ a: 0x8fd8b0, b: 0xfaf0c8, c: 0xf3a7c8, d: 0xf59bb2, e: 0x3a3442, f: 0xfbe7a8 }, [
        '....... ....... ....... ...a... ....... ....... .......',
        '....aaa ....a.. ..aaa.. .aaaaa. ..bbb.. ....... .......',
        '......c c..a..c caaaaac .aaaaa. .bbbbb. ...b... .......',
        '....... c.....c c.aaa.c ..aaa.. ..bbb.. ....... .......',
        '....... ....... ..aaa.. .aaaaa. .daaad. ..aaa.. .......',
        '....... ....... .aaaaa. .aaaaa. .aaaaa. .aeaea. .......',
        '....... ....... ..aaa.. .aaaaa. .aaaaa. ..aaa.. .......',
        '....... ....... ....... .f.a.f. ...a... ....... .......',
      ]),
    },
    {
      // from the object gallery (rain cloud)
      id: 'rain-cloud', from: 'cand-rain-cloud', name: 'Rain Cloud', fraction: 0.75, seed: 9,
      story: 'It carries the evening rain carefully, one drop at a time.',
      ...voxels({ a: 0x5b8fd6, b: 0xc9d1d9, c: 0xfbf8f2 }, [
        '........ ........ ........ ........ ........',
        '........ ........ ........ .....a.. ........',
        '........ ........ ..a..... .....a.. ........',
        '........ ....a... ..a..... .....a.. ........',
        '........ .bbbbbbb .bbbbbbb .bbbbbbb ........',
        '........ .ccccccc .ccccccc .ccccccc ........',
        '........ ...cccc. ..ccccc. ...cccc. ........',
      ]),
    },
    {
      // from the object gallery (star)
      id: 'star', from: 'cand-star', name: 'Star', fraction: 0.7, seed: 16,
      story: 'The first one out, so the others know where to go.',
      ...voxels({ a: 0xf6d365, b: 0xe9b949 }, [
        'aa...aa aa...aa',
        '.aa.aa. .aa.aa.',
        '..aaa.. ..aaa..',
        '.aabaa. .aabaa.',
        'aaabaaa aaabaaa',
        '..aaa.. ..aaa..',
        '...a... ...a...',
        '...a... ...a...',
      ]),
    },
    {
      // from the object gallery (page 5: Dreamcatcher)
      id: 'dreamcatcher', name: 'Dreamcatcher', from: 'cand-p5-dreamcatcher', fraction: 0.65, seed: 1,
      story: 'The bad dreams snag in the web. The good ones slip through.',
      ...voxels({ a: 0x8cc8e8, b: 0xfbf8f2, c: 0xf6efe4, d: 0x4fd1c5, e: 0xc9955a }, [
        '.a.b.a. ...a...',
        '.b.b.b. ...b...',
        '.c.d.c. .......',
        '.eeeee. .eeeee.',
        'ee.c.ee ee...ee',
        'e.ccc.e e.....e',
        'eccdcce e..d..e',
        'e.ccc.e e.....e',
        'ee.c.ee ee...ee',
        '.eeeee. .eeeee.',
      ]),
    },
    {
      // from the object gallery (page 4: Unicorn)
      id: 'unicorn', name: 'Unicorn', from: 'cand-p4-unicorn', fraction: 0.65, seed: 1,
      story: 'It only comes out when every star is lit.',
      ...voxels({ a: 0xc9b6e4, b: 0x9fe0d0, c: 0xfbf8f2, d: 0xc9b6f4, e: 0xf4a3c8, f: 0x3a3442, g: 0xf6d365 }, [
        '....... ....... ..a.a.. ....... ..a.a.. ....... ....... .......',
        '...b... ....... ..c.c.. ....... ..c.c.. ....... ....... .......',
        '...d... ...c... ..ccc.. ..ccc.. ..ccc.. ...c... ....... .......',
        '...e... ..cbc.. ..ccc.. ..ccc.. ..ccc.. ..ccc.. ....... .......',
        '....... ....... ...d... ....... ..ccc.. ..ccc.. ...c... .......',
        '....... ....... ....... ..ddd.. .ccccc. .ccccc. ..fcf.. .......',
        '....... ....... ....... ....... ..ccc.. ..ccc.. ...c... .......',
        '....... ....... ....... ....... ..c.c.. ...g... ....... .......',
        '....... ....... ....... ....... ....... ...g... ....... .......',
      ]),
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
      // from the object gallery (page 5: Weather Vane)
      id: 'weather-vane', name: 'Weather Vane', from: 'cand-p5-weather-vane', fraction: 0.65, seed: 1,
      story: 'The cockerel turns to face whatever wind is coming.',
      ...voxels({ a: 0xb8434b, b: 0x5d6670, c: 0xe9b949, d: 0xc9952f, e: 0xe0565b, f: 0xf08a3c }, [
        '....... .aaaaa. .aaaaa. .aaaaa. .......',
        '....... ....... .aaaaa. ....... .......',
        '....... ....... ...b... ....... .......',
        '...c... ...b... .cbbbc. ...b... ...c...',
        '....... ....... dd.b.d. ....... .......',
        '....... ....... ddddddd ....... .......',
        '....... ....... cccccd. ....... .......',
        '....... ....... cc..ce. ....... .......',
        '....... ....... c...ccf ....... .......',
        '....... ....... ....ee. ....... .......',
      ]),
    },
    {
      // from the object gallery (windmill)
      id: 'windmill', from: 'cand-windmill', name: 'Windmill', fraction: 0.75, seed: 7,
      story: 'It turns all night for a wind nobody else can feel.',
      ...voxels({ a: 0xe8d3a3, b: 0x8a5a3c, c: 0xfbf8f2, d: 0x6b4a3a, e: 0xe0565b }, [
        '....... .aaaaa. .aaaaa. .aaaaa. .......',
        '....... ..aaa.. ..aaa.. ..aaa.. ...b...',
        '....... ..aaa.. ..aaa.. ..aaa.. .......',
        '....... ..aaa.. ..aaa.. ..aaa.. ..cd...',
        '....... ..aaa.. ..aaa.. ..aaa.. ..cd...',
        '....... ..aaa.. ..aaa.. ..aaa.. ..cdccc',
        '....... ..eee.. ..eee.. ..eee.. ddddddd',
        '....... ....... ...e... ....... cccdc..',
        '....... ....... ....... ....... ...dc..',
        '....... ....... ....... ....... ...dc..',
      ]),
    },
    {
      // from the object gallery (wishing well)
      id: 'wishing-well', from: 'cand-well', name: 'Wishing Well', fraction: 0.75, seed: 10,
      story: 'Every coin a wish, and the water keeps them all.',
      ...voxels({ a: 0x9aa3ad, b: 0x5b8fd6, c: 0x8a5a3c, d: 0xd9b48f, e: 0xe0565b }, [
        '...a... .aaaaa. .aaaaa. aaaaaaa .aaaaa. .aaaaa. ...a...',
        '...a... .aaaaa. .abbba. aabbbaa .abbba. .aaaaa. ...a...',
        '...a... .aaaaa. .a...a. aa...aa .a...a. .aaaaa. ...a...',
        '....... ....... ....... .c.c.c. ....... ....... .......',
        '....... ....... ....... .c.d.c. ....... ....... .......',
        '....... ....... ....... .c.d.c. ....... ....... .......',
        '....... ....... eeeeeee eeeeeee eeeeeee ....... .......',
        '....... ....... ....... .eeeee. ....... ....... .......',
      ]),
    },
    {
      // from the object gallery (page 5: Armillary Sphere)
      id: 'armillary', name: 'Armillary Sphere', from: 'cand-p5-armillary', fraction: 0.65, seed: 1,
      story: 'Rings of brass that hold the sky still long enough to read.',
      ...voxels({ a: 0xb07a3a, b: 0xf2a03d, c: 0xe9b949, d: 0x5b8fd6, e: 0x5fae6e }, [
        '....... .aaaaa. .aaaaa. .aaaaa. .aaaaa. .aaaaa. .......',
        '....... ...b... ...b... .ccccc. ...b... ...b... .......',
        '...b... ...b... ....... cc.c.cc ....... ...b... ...b...',
        '...b... ....... ...d... c.edd.c ...d... ....... ...b...',
        '...b... ....... ..edd.. c.ddd.c ..dde.. ....... ...b...',
        '...b... ....... ...d... c.dde.c ...e... ....... ...b...',
        '...b... ...b... ....... cc.c.cc ....... ...b... ...b...',
        '....... ...b... ...b... .ccccc. ...b... ...b... .......',
      ]),
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
    name: 'Cottage', dims: [7, 7, 5], fraction: 0.7, seed: 6,
    // hints curated for the solve path, not hidden at random (docs/aha-study.md)
    clues: '..#...##..##.#########..####..#..##|################.#.###.###...######|..........#.#....#.#.##...##..........#.#......#.',
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
  bonus(3, {
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
  bonus(4, {
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
  bonus(6, {
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

// Every level's starting block fits its object exactly: an empty slab on an
// edge of the block is a whole row of 0s to chisel, taps that teach nothing.
// So each block is trimmed to the object's bounding box (the object itself is
// unchanged). The tutorial keeps its blocks: its empty rows are the lesson.
function trimToObject(shape) {
  const [X, Y, Z] = shape.dims;
  const lo = [X, Y, Z], hi = [-1, -1, -1];
  for (let z = 0; z < Z; z++) for (let y = 0; y < Y; y++) for (let x = 0; x < X; x++) {
    if (!shape.cell(x, y, z)) continue;
    [x, y, z].forEach((v, a) => { lo[a] = Math.min(lo[a], v); hi[a] = Math.max(hi[a], v); });
  }
  if (lo.every((v) => v === 0) && hi.every((v, a) => v === shape.dims[a] - 1)) return;
  const cell = shape.cell;
  shape.dims = hi.map((v, a) => v - lo[a] + 1);
  shape.cell = (x, y, z) => cell(x + lo[0], y + lo[1], z + lo[2]);
}
for (const shape of [...SHAPES, ...BONUS]) trimToObject(shape);

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
