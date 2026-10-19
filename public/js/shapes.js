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
  { name: 'Teatime', numeral: 'II', palette: 'Teatime', blurb: 'the kitchen at four o\'clock',
    line: 'The kettle sings, and the stone keeps time.' },
  { name: 'Moss Garden', numeral: 'III', palette: 'Mint', blurb: 'small creatures of the garden',
    line: 'Green things grow slowly inside the quiet rock.' },
  { name: 'The Orchard', numeral: 'IV', palette: 'Orchard', blurb: 'things that grow',
    line: 'Every seed keeps a shape it has not shown.' },
  { name: 'Autumn Woods', numeral: 'V', palette: 'Autumn', blurb: 'leaf fall, woodsmoke, things gathered for winter',
    line: 'Leaves fall, and the woods show their shapes.' },
  { name: 'The Lagoon', numeral: 'VI', palette: 'Lagoon', blurb: 'the sea and the shore',
    line: 'The tide remembers everything it carried.' },
  { name: 'The Deep', numeral: 'VII', palette: 'Deep', blurb: 'the sea below the sea',
    line: 'Below the light, things carry their own lamps.' },
  { name: 'Desert Oasis', numeral: 'VIII', palette: 'Desert', blurb: 'heat shimmer, palm shade, cool water',
    line: 'Somewhere under the sand, a well is waiting.' },
  { name: 'Ember Steps', numeral: 'IX', palette: 'Dusk', blurb: 'temples and stairways',
    line: 'Climb slowly. The evening is climbing too.' },
  { name: 'Old Stones', numeral: 'X', palette: 'Stones', blurb: 'older than the temples; carved and mossy',
    line: 'Older than names, the stones are still listening.' },
  { name: 'Clockwork Workshop', numeral: 'XI', palette: 'Clockwork', blurb: 'gears, ticking, small machines',
    line: 'Every gear is waiting for its turn.' },
  { name: 'Lantern Festival', numeral: 'XII', palette: 'Festival', blurb: 'festival things, lit from within',
    line: 'Tonight every paper lantern holds a wish.' },
  { name: 'Frost Peaks', numeral: 'XIII', palette: 'Frost', blurb: 'thin air, deep snow, warm breath',
    line: 'Breathe slowly. The snow keeps every footprint.' },
  { name: 'Cloud Isles', numeral: 'XIV', palette: 'Clouds', blurb: 'above the weather; islands that float',
    line: 'Above the weather, even stones learn to float.' },
  { name: 'Starfall', numeral: 'XV', palette: 'Night', blurb: 'the sky at night',
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
  ]),
  // ---------------------------------------------------------------- Teatime
  // The kitchen at four o'clock: pots, cakes and things that steam.
  ...chapter(1, [
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
      // from the object gallery (toaster)
      id: 'toaster', from: 'cand-toaster', name: 'Toaster', fraction: 0.35, seed: 1,
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
      // from the object gallery (page 6: Cake Stand)
      id: 'cake-stand', name: 'Cake Stand', from: 'cand-p6-cake-stand', fraction: 0.05, seed: 11,
      story: 'Three tiers, and someone has already taken the best one.',
      ...voxels({ a: 0xe98aa6, b: 0xfbf8f2, c: 0xf6e7c8, d: 0xe9b949, e: 0x8cc36a, f: 0xd9a45a, g: 0xd9354a, h: 0xfff4dc, i: 0xf4a3c8, j: 0x9fe0d0 }, [
        '..aaa.. .abbba. abbbbba abbbbba abbbbba .abbba. ..aaa..',
        '....... ..ccc.. .ccccc. .ccdcc. .ccccc. ..ccc.. .......',
        '....... ...e... ..e.c.. .e.d.e. ..c.e.. ...e... .......',
        '....... ..aaa.. .abbba. .abdba. .abbba. ..aaa.. .......',
        '....... ....... ..f.f.. ...d... ..f.f.. ....... .......',
        '....... ....... ..g.h.. ...d... ..h.g.. ....... .......',
        '....... ....... ..aaa.. ..ada.. ..aaa.. ....... .......',
        '....... ....... ...i... ..jdi.. ...j... ....... .......',
        '....... ....... ....... ..ddd.. ....... ....... .......',
      ]),
    },
    {
      id: 'mug', name: 'Mug', dims: [8, 6, 6], fraction: 0.3, seed: 6,
      story: 'The keeper’s mug, half full, between one watch and the next.',
      cell(x, y, z) {
        const dx = x - 2.5, dz = z - 2.5, r2 = dx * dx + dz * dz;
        if (x <= 5 && r2 <= 2.6 * 2.6 && (y === 0 || r2 >= 1.7 * 1.7)) return y === 5 ? 0xf6efe4 : 0x5b8fd6;
        if (x <= 5 && y === 4 && r2 < 1.7 * 1.7) return 0x6b4a3a;
        const handle = (x === 6 && (y === 1 || y === 4)) || (x === 7 && y >= 1 && y <= 4);
        return handle && (z === 2 || z === 3) ? 0x5b8fd6 : 0;
      },
    },
    {
      // from the object gallery (page 6: Stand Mixer)
      id: 'stand-mixer', name: 'Stand Mixer', from: 'cand-p6-stand-mixer', fraction: 0.3, seed: 16,
      story: 'It hums the batter smooth while the oven warms.',
      ...voxels({ a: 0x9fd8c8, b: 0xc9d1d9, c: 0xf6dfa0, d: 0xe4e9ee, e: 0x6fb8a8 }, [
        '.aaaaaa.. aaaaaaaa. aaaaaaaa. aaaaaaaa. .aaaaaa..',
        '......... aaa.bbb.. aaa.bbb.. aaa.bbb.. .........',
        '.....b... aaa.bcb.. aaabcccb. aaa.bcb.. .....b...',
        '....bbb.. aaabb.bb. aaab.d.b. aaabb.bb. ....bbb..',
        '....bbb.. aaabb.bb. aaab.d.b. aaabb.bb. .e..bbb..',
        '......... aaa...... aaa..d... aaa...... .........',
        '......... ..aaad... ..aaada.a ..aaad... .........',
        '...aa.... .aaaada.. .aaaadaaa .aaaada.. ...aa....',
        '......... ..aaad... ..aaada.. ..aaad... .........',
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
  ...chapter(2, [
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
  ...chapter(3, [
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
  ]),
  // ---------------------------------------------------------------- Autumn Woods
  // Leaf fall and woodsmoke: creatures and things gathered for winter.
  ...chapter(4, [
    {
      id: 'mushroom', name: 'Mushroom', dims: [7, 6, 7], fraction: 0.35, seed: 11,
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
      // from the object gallery (page 8: Turkey)
      id: 'turkey', name: 'Turkey', from: 'cand-p8-turkey', fraction: 0.25, seed: 19,
      story: 'Fanned out proudly, strutting through the fallen leaves.',
      ...voxels({ a: 0xe8873a, b: 0x8a5a3c, c: 0xd9452f, d: 0xf2a03d, e: 0x6b4a3a, f: 0xf2c14e, g: 0xd9413a, h: 0xd9b48f, i: 0x3a3442 }, [
        '......... ......... ......... ...a.a... .........',
        '......... ......... ...bbb... ...bbb... .........',
        'cdefffedc ...bbb... ..ebbbe.. ..ebbbe.. ....b....',
        'cdefffedc ...bbb... ..ebbbe.. ...bbb... ....g....',
        'ccdfffdcc ......... ...bbb... ...bhb... ....g....',
        '.ccdddcc. ......... ....h.... ...ihi... ....h....',
        '...ccc... ......... ......... ....h.... .........',
        '......... ......... ......... ......... .........',
      ]),
    },
    {
      // from the object gallery (page 8: Chestnut Cart)
      id: 'chestnut-cart', name: 'Chestnut Cart', from: 'cand-p8-chestnut-cart', fraction: 0.45, seed: 8,
      story: 'Roasting chestnuts on the corner, warm in a paper twist.',
      ...voxels({ a: 0x3f3a46, b: 0x6b4a3a, c: 0xf2c14e, d: 0xa8432f, e: 0x9a6440, f: 0x4f5560, g: 0xf6efe4, h: 0xe8562f, i: 0x6b3a22, j: 0xf0d9b0, k: 0xc8452e }, [
        '..aba.... ......... ......... ......... ......... ..aba....',
        '..bcb.... ......... ......... ......... ......... ..bcb....',
        '..aba.... .dddddd.. .dddddd.. .dddddd.. .dddddd.. ..aba....',
        '......... .ccccccee .cddddc.. .cddddc.. .ccccccee .........',
        '......... .b....b.. ..fff.... ..fff.... ......g.. .........',
        '......... .b....b.. ..hhh.... ..hhh.... ......g.. .........',
        '......... .b....b.. ...i..... ..iij.... ......... k.k.k.k..',
        'kgkgkgkg. kgkgkgkg. kgkgkgkg. kgkgkgkg. kgkgkgkg. kgkgkgkg.',
      ]),
    },
    {
      // from the object gallery (page 8: Scarecrow)
      id: 'scarecrow', name: 'Scarecrow', from: 'cand-p8-scarecrow', fraction: 0.65, seed: 9,
      story: 'The crows learned long ago that he will not chase them.',
      ...voxels({ a: 0x9a6440, b: 0xe8c46a, c: 0x5b6f9a, d: 0xc8452e, e: 0x5b7fc6, f: 0xc9a04a, g: 0xd9b884, h: 0x2f2a36, i: 0x6b4a3a, j: 0xf2a03d, k: 0x3a3442 }, [
        '......... ....a.... .........',
        '......... ...bab... .........',
        '...ccc... ...ccc... ...ccc...',
        '...ccc... b..ccc..b ...ccc...',
        '...ddd... bdddddddb ...dde...',
        '...ddd... fdddddddf ...ddd...',
        '...ggg... ...ggghh. ...gig...',
        '...ggg... ...ggg.hj ...kgk...',
        '.bbdddbb. .fbdddbf. .bbdddbb.',
        '...fff... ...fff... ...fff...',
      ]),
    },
    {
      // from the object gallery (pumpkin)
      id: 'pumpkin', from: 'cand-pumpkin', name: 'Pumpkin', fraction: 0.6, seed: 24,
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
      // from the object gallery (page 8: Beaver & Birch)
      id: 'beaver', name: 'Beaver & Birch', from: 'cand-p8-beaver', fraction: 0.6, seed: 23,
      story: 'Gnawing patiently, sure the birch will fall exactly where he planned.',
      ...voxels({ a: 0x7d6555, b: 0x6b5446, c: 0x9a6440, d: 0xc89a6a, e: 0xf1ece0, f: 0x4a4550, g: 0xfbf8f2, h: 0xf0b43a, i: 0xe8c898, j: 0x3a3442 }, [
        '........ .....ab. .....bab ..c.cab. ........ ........',
        '........ ..ccc... ..cccc.. ..ccc... ...d.... ........',
        '........ ..ccc... .ccccc.. .ccccc.. ..ddd... efeeefe.',
        '........ ........ ..ccc... ..cgc... ...g.... ......h.',
        '........ ...c.... ..ccc... .ccccc.. ..iii... ...j....',
        '........ ...c.... .ccccc.. .ccccc.. ..jcj... ........',
        '........ ........ ...c.... ..ccc... ........ ........',
      ]),
    },
    {
      // from the object gallery (fox)
      id: 'fox', from: 'cand-fox', name: 'Fox', fraction: 0.55, seed: 24,
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
      id: 'mushroom-log', name: 'Mushroom Log', from: 'cand-p5-mushroom-log', fraction: 0.65, seed: 6,
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
      // from the object gallery (page 5: Maple Bonsai)
      id: 'maple-bonsai', name: 'Maple Bonsai', from: 'cand-p5-maple-bonsai', fraction: 0.6, seed: 20,
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
    {
      id: 'owl', name: 'Owl', dims: [6, 7, 4], fraction: 0.85, seed: 23,
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
      // from the object gallery (page 8: Young Stag)
      id: 'young-stag', name: 'Young Stag', from: 'cand-p8-stag', fraction: 0.9, seed: 3,
      story: 'His first antlers, with a leaf caught in them for luck.',
      ...voxels({ a: 0x5a3b30, b: 0xc27a43, c: 0xfbf8f2, d: 0xf0dcc0, e: 0x3a3442, f: 0xf0dfb8, g: 0xec7a2c, h: 0xd9452f }, [
        '..a.a.. ....... ....... ..a.a.. .......',
        '..b.b.. ....... ....... ..b.b.. .......',
        '..bbb.. ..bbb.. ..bbb.. ..bbb.. .......',
        '...c... ..bbb.. ..bbb.. ..bdb.. .......',
        '....... ....... ...b... ..bbb.. ..ded..',
        '....... ....... ..bbb.. ..bbb.. ..ebe..',
        '....... ....... ..bbb.. dbbbbbd ...b...',
        '....... ....... ....... ..f.f.. .......',
        '....... ....... ....... fff.fff .......',
        '....... ....... .....g. f.f.fhf .......',
      ]),
    },
    {
      // from the object gallery (page 8: Boar Piglet)
      id: 'boar-piglet', name: 'Boar Piglet', from: 'cand-p8-piglet', fraction: 0.8, seed: 15,
      story: 'Stripes down its back, and a red leaf riding along.',
      ...voxels({ a: 0x5a3b30, b: 0xa86b45, c: 0x7a3f32, d: 0xe0a08a, e: 0xf0d9b0, f: 0x3a3442, g: 0xec7a2c, h: 0xd9452f }, [
        '....... ..a.a.. ....... ....... ....... ..a.a.. ....... .......',
        '....... ..b.b.. ...b... ..bbb.. ..bbb.. ..bbb.. ....... ..cdc..',
        '....... ..bbb.. ..bbb.. .bbbbb. .bbbbb. ..bbb.. ..bbb.. ..ddd..',
        '...b... ..ebe.. ..bbb.. .bbbbb. .bbbbb. ..bbb.. ..fbf.. .......',
        '...a... ....... ..ebe.. ..ebe.. ..ebe.. .bebeb. ....... .......',
        '....... ....... ....g.. ...hh.. ....... .a...a. ....... .......',
      ]),
    },
  ]),
  // ---------------------------------------------------------------- The Lagoon
  // The sea and the shore: wide shapes, hidden insides.
  ...chapter(5, [
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
  ]),
  // ---------------------------------------------------------------- The Deep
  // The sea below the sea: soft creatures and things that light themselves.
  ...chapter(6, [
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
      id: 'seahorse', name: 'Seahorse', from: 'cand-p4-seahorse', fraction: 0.6, seed: 18,
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
      // from the object gallery (page 4: Baby Shark)
      id: 'baby-shark', name: 'Baby Shark', from: 'cand-p4-baby-shark', fraction: 0.6, seed: 24,
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
      // from the object gallery (page 6: Giant Isopod)
      id: 'giant-isopod', name: 'Giant Isopod', from: 'cand-p6-giant-isopod', fraction: 0.8, seed: 13,
      story: 'Armoured plate by plate, it has waited a hundred years for supper.',
      ...voxels({ a: 0x8a83ad, b: 0x9b94bf, c: 0xc4bfdc, d: 0xd8d3ea, e: 0x3a3442 }, [
        '....... ....... .a...a. ....... .a...a. ....... .a...a. ....... ....... .......',
        '.bbbbb. ccccccc bbbbbbb ccccccc bbbbbbb ccccccc bbbbbbb ccccccc .ddddd. .aa.aa.',
        '.bbbbb. ccccccc bbbbbbb ccccccc bbbbbbb ccccccc bbbbbbb ccccccc .eddde. .a...a.',
        '..bbb.. .ccccc. .bbbbb. .ccccc. .bbbbb. .ccccc. .bbbbb. .ccccc. ..ddd.. .......',
        '....... ..ccc.. ..bbb.. ..ccc.. ..bbb.. ..ccc.. ..bbb.. ..ccc.. ....... .......',
      ]),
    },
    {
      // from the object gallery (jellyfish)
      id: 'jellyfish', from: 'cand-jellyfish', name: 'Jellyfish', fraction: 0.9, seed: 21,
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
      // from the object gallery (page 4: Anglerfish)
      id: 'anglerfish', name: 'Anglerfish', from: 'cand-p4-anglerfish', fraction: 0.8, seed: 18,
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
      // from the object gallery (page 6: Yeti Crab)
      id: 'yeti-crab', name: 'Yeti Crab', from: 'cand-p6-yeti-crab', fraction: 0.65, seed: 20,
      story: 'It farms its supper in its hairy arms, and waves them proudly.',
      ...voxels({ a: 0xd9cfbf, b: 0xf2ece0, c: 0xf2d58c, d: 0x3a3442 }, [
        '......... ......... .a.....a. ......... .a.....a. ......... .........',
        '......... ......... .a.bbb.a. .abbbbba. .a.bbb.a. ......... .........',
        '......... ...bbb... ..bbbbb.. ..bbbbb.. ..bbbbb.. .bbbbbbb. .........',
        '......... ......... ...bbb... ..bbbbb.. cc.bbb.cc cc.....cc .........',
        '......... ......... ......... ......... cc.d.d.cc cc.....cc .........',
        '......... ......... ......... ......... .b.....b. b.......b .........',
      ]),
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
  ]),
  // ---------------------------------------------------------------- Desert Oasis
  // Heat shimmer and palm shade: desert creatures and a well of cool water.
  ...chapter(7, [
    {
      // from the object gallery (cactus)
      id: 'cactus', from: 'cand-cactus', name: 'Cactus', fraction: 0.7, seed: 1,
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
      // from the object gallery (page 7: Meerkat Lookout)
      id: 'meerkats', name: 'Meerkat Lookout', from: 'cand-p7-meerkats', fraction: 0.6, seed: 23,
      story: 'One stands guard so the others can dig in peace.',
      ...voxels({ a: 0xe8d3a3, b: 0x6b4a3a, c: 0xd2a86e, d: 0xc9a06e, e: 0xfbf3e4, f: 0x3a3442 }, [
        'aaaaaaaa aaaaaaaa aaaaaaaa aaaaaaaa aaabbaaa',
        '..b..... .cccccc. .cccccc. .cccccc. ........',
        '..b...b. .ddd.ddd .ddd.ddd .ded.ded .....d.d',
        '........ .ddd..d. .ddd.ddd .ded.ddd ........',
        '........ .ddd.ddd .ddd.ddd .ded.ded .d.d..b.',
        '........ ..d...d. .ddd.ddd .ddd.fdf ........',
        '........ .ddd.... .ddd..d. .ded.... ..b.....',
        '........ ..d..... .ddd.... .fdf.... ........',
        '........ ........ ..d..... ........ ........',
      ]),
    },
    {
      // from the object gallery (page 7: Fennec Fox)
      id: 'fennec', name: 'Fennec Fox', from: 'cand-p7-fennec', fraction: 0.65, seed: 8,
      story: 'Big ears, for hearing beetles walk beneath the sand.',
      ...voxels({ a: 0xeeb06a, b: 0xfbf3e4, c: 0x3a3442, d: 0xf4a3b5 }, [
        '....... ..aaaa. ..aaaaa ..bbb.a ..b.baa ....ca.',
        '....... ...a... ..aaa.a ..bbb.a ...b... .......',
        '....... ..aaa.. .aaaaa. ..bbb.. ...b... .......',
        '....... ....... ..aaa.. ..bbb.. ....... .......',
        '....... ....... ..aaa.. ..aaa.. ..bbb.. ...c...',
        '....... ....... .aaaaa. .aaaaa. ..cac.. .......',
        '....... ....... aa...aa ad...da ....... .......',
        '....... ....... aa...aa dd...dd ....... .......',
        '....... ....... a.....a a.....a ....... .......',
      ]),
    },
    {
      // from the object gallery (page 7: Camel Calf)
      id: 'camel-calf', name: 'Camel Calf', from: 'cand-p7-camel-calf', fraction: 0.8, seed: 2,
      story: 'Born on the dunes, and already sure of the way to water.',
      ...voxels({ a: 0x8f5e33, b: 0xc98a4b, c: 0xe9b949, d: 0xd9534f, e: 0xf59bb2, f: 0x3a3442 }, [
        '......... .aa.aa... .aa.aa... .aa.aa... .........',
        '......... .bbbbb... abbbbb... .bbbbb... .........',
        '..c.c.... .bbbbbb.. bbbbbbb.. .bbbbbb.. ..c.c....',
        '..ddd.... ..bbb.b.. .bbbbbb.. ..bbb.b.. ..ddd....',
        '......... ..ddd.... ..ddd.b.. ..ddd.... .........',
        '......... ...b..... ..bbb.b.. ...b..... .........',
        '......... ......bbe ...b..bba ......bbe .........',
        '......... ......bf. ......bbb ......bf. .........',
        '......... ......a.. ......... ......a.. .........',
      ]),
    },
    {
      // from the object gallery (page 7: Date Palm Spring)
      id: 'date-palm', name: 'Date Palm Spring', from: 'cand-p7-date-palm', fraction: 0.65, seed: 18,
      story: 'Shade, sweet dates and cool water: everything a traveller wants.',
      ...voxels({ a: 0xe8d3a3, b: 0x5bb8d6, c: 0xd2a86e, d: 0x77808a, e: 0x9aa3ad, f: 0x6b4a3a, g: 0x8a5a3c, h: 0xd9663a, i: 0x5fae6e, j: 0x3f8a5b }, [
        'aaaaaaaaa aaaaabbba aaaaabbba aaaaabbba aaaaaaaaa',
        'ccccdeeed cccce...e cccce...e cccce...e cccceeeed',
        '......... ......... .f....... ......... .........',
        '......... ......... .gg...... ......... .........',
        '......... ......... ..ff..... ......... .........',
        '......... ..h...... ...g...i. ....h.... .........',
        '...i..... ..h...... i..f..ii. ....h.... ...i.....',
        '...i..... ..jjj.... iijjjii.. ..jjj.... ...i.....',
        '......... ..i.i.... ...j..... ..i.i.... .........',
      ]),
    },
  ]),
  // ---------------------------------------------------------------- Ember Steps
  // Temple architecture: long chains of deduction.
  ...chapter(8, [
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
      id: 'spiral', name: 'Spiral Stair', dims: [5, 9, 5], fraction: 0.65, seed: 9,
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
  // ---------------------------------------------------------------- Old Stones
  // Older than the temples: carved, mossy, and half asleep in the mist.
  ...chapter(9, [
    {
      // from the object gallery (page 7: Moai)
      id: 'moai', name: 'Moai', from: 'cand-p7-moai', fraction: 0.7, seed: 13,
      story: 'It has watched the horizon so long it forgot to blink.',
      ...voxels({ a: 0x4f9a4a, b: 0x7cc35a, c: 0x9a8f84, d: 0xb8ad9f, e: 0x4a4440, f: 0xa8d97a, g: 0xa0522d }, [
        'aaaaaa aaaaaa aaaaaa aaaaaa aaaaaa aaaaaa',
        'bbbbbb bccccb bccccb bccccb bccccb bbbbbb',
        '...... .cccc. .cccc. .cccc. .cccc. ..dd..',
        '...... .cccc. cccccc .cccc. .ecce. ..dd..',
        '...... .cccc. cccccc .cccc. .cccc. ..dd..',
        '...... .cccc. cccccc .cccc. .ecce. ..dd..',
        '...... .cccc. cccccc .cccc. .cccc. .dddd.',
        '...... .bccf. .cccc. .cccc. .cccc. ......',
        '...... .gggg. .gggg. .gggg. .gggb. ......',
        '...... ..bg.. .bggg. .gggg. ..gg.. ......',
      ]),
    },
    {
      // from the object gallery (page 5: Geode)
      id: 'geode', name: 'Geode', from: 'cand-p5-geode', fraction: 0.75, seed: 19,
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
      // A torii: two beams with a gap between them make split rows.
      id: 'gate', name: 'Gate', dims: [9, 6, 2], fraction: 0.8, seed: 5,
      story: 'Pass beneath it and leave the day behind.',
      cell(x, y) {
        if (y === 5) return 0x3d2e3a;
        if (y === 3) return x >= 1 && x <= 7 ? 0xe2553f : 0;
        if (y === 4 && x === 4) return 0xe2553f;
        return x === 2 || x === 6 ? (y === 0 ? 0x3d2e3a : 0xe2553f) : 0;
      },
    },
    {
      // from the object gallery (page 7: Moss Spirit)
      id: 'moss-spirit', name: 'Moss Spirit', from: 'cand-p7-moss-spirit', fraction: 0.8, seed: 9,
      story: 'Shy as dew, it hides wherever the stones stay damp.',
      ...voxels({ a: 0x4f9a4a, b: 0x7cc35a, c: 0xa8d97a, d: 0xf59bb2, e: 0x3a3442, f: 0xf6efe4, g: 0xd9534f }, [
        '....... ....... ....... ..a.a.. ..a.a.. ....... .......',
        '....... ....... ..bbb.. ..bbb.. ..bca.. ....... .......',
        '....... ..bba.. .bbbbb. .bbbbb. .dbbbd. ..bab.. .......',
        '....... ..bbb.. .bbbba. .bbbbb. .abbbb. ..ebe.. .......',
        '....... ..bcb.. .bbbbb. .bbbbb. .bbbbb. ..abb.. .......',
        '....... ....... ..acb.. .fbbb.. ..bbb.. ....... .......',
        '....... ....... .g..... ggga... .f..... ....... .......',
        '....... ....... ....... .gcac.. ....... ....... .......',
      ]),
    },
    {
      // from the object gallery (page 7: Stone Golem)
      id: 'stone-golem', name: 'Stone Golem', from: 'cand-p7-stone-golem', fraction: 0.7, seed: 7,
      story: 'It sat down to rest and grew a garden on its shoulders.',
      ...voxels({ a: 0x8f877c, b: 0xc7beb0, c: 0x3fb8c4, d: 0x7cc35a, e: 0xa8d97a, f: 0x7fe0e6, g: 0x4f9a4a, h: 0xf4a3b5 }, [
        '......... ......... ..aa.aa.. ......... .........',
        '......... .a.....a. aaaa.aaaa .a.....a. .........',
        '......... .a.....a. aabb.bbaa .a.....a. .........',
        '......... bbbbbbbbb bbbbbbbbb bbbbbbbbb .........',
        '......... bbbbbbbbb bbbbbbbbb bbbbcbbbb .........',
        '......... bbbbbbbbb bbbbbbbbb bbbcccbbb .........',
        '......... .dddbddd. dddbbbddd .dddbddd. .........',
        '......... ..dbbbd.. .edbbbde. ...fbf.g. .........',
        '......... ....b.... ...bbb.h. ...bab... .........',
      ]),
    },
    {
      // from the object gallery (page 7: Sundial)
      id: 'sundial', name: 'Sundial', from: 'cand-p7-sundial', fraction: 0.75, seed: 13,
      story: 'It only tells the time when the sun agrees to help.',
      ...voxels({ a: 0x7cc35a, b: 0x8f877c, c: 0xc7beb0, d: 0xa8d97a, e: 0xdcd4c6, f: 0x7f5626, g: 0xb07a3a }, [
        'abbabba bbabbab babbabb abbabba bbabbab babbabb abbabba',
        '....... .ccccc. .ccccc. .ccccc. .acccc. .acccc. .......',
        '....... ....... ..ccc.. ..ccc.. ..dcc.. ....... .......',
        '....... ....... ..eee.. ..eee.. ..eee.. ....... .......',
        '....... ....... ..ccc.. ..ccc.. ..ccc.. ....... .......',
        '....... .ccccc. .ccccc. .ccccc. .ccccc. .ccccc. .......',
        '....... .fgfgf. .ggggg. .fgggf. .ggggg. .fgfgf. .......',
        '....... ....... ....... ..fff.. ....... ....... .......',
        '....... ....... ....... ...ff.. ....... ....... .......',
      ]),
    },
    {
      // from the object gallery (page 7: Broken Column)
      id: 'broken-column', name: 'Broken Column', from: 'cand-p7-broken-column', fraction: 0.75, seed: 7,
      story: 'Once it held up a roof; now it holds up the sky.',
      ...voxels({ a: 0x7cc35a, b: 0x8f877c, c: 0xf4a3b5, d: 0xdcd4c6, e: 0xc7beb0, f: 0x4f9a4a }, [
        'aaaaaaa aaaaaaa aaaaaaa aaaaaaa aaaaaaa',
        'bbbbb.. bbbbb.c bbbbddd bbbbddd bbbbddd',
        '....... .ede... .dedeea .edeeee ...febe',
        '....... .ede... .ded... .edef.. ....a..',
        '....... .ede... .dedf.. .ede... .......',
        '....... .edef.. .ded... .ede... .......',
        '.f.f... .ede... .ded... .ede... .......',
        '....... .e.e... ..ed... .ed.... .......',
        '....... ....... ..dd... ....... .......',
      ]),
    },
    {
      // from the object gallery (page 7: Stone Hare)
      id: 'stone-hare', name: 'Stone Hare', from: 'cand-p7-stone-hare', fraction: 0.75, seed: 8,
      story: 'Carved mid-leap, it has not landed in a thousand years.',
      ...voxels({ a: 0x8f877c, b: 0x4f9a4a, c: 0x7cc35a, d: 0xc7beb0, e: 0xdcd4c6, f: 0xe0565b, g: 0xf59bb2, h: 0xf4a3b5, i: 0x3a3442, j: 0xa8d97a }, [
        'aaaaa aaaaa aaaaa aaaaa aaaaa',
        'bccbc ccbcc cbccb bccbc ccbcc',
        '..... ..... ..d.. ..... .....',
        '..... .ddd. .ddd. .ddd. .efe.',
        '..e.. .ddd. .ddd. .fff. .....',
        '..... ..... .gdg. ..h.. .....',
        '..... ..d.. .ddd. .idi. .....',
        '..... ..... .ddd. ..... .....',
        '..... ..... .d.d. ..... .....',
        '..... ..... .j.j. ..... .....',
      ]),
    },
    {
      // from the object gallery (page 7: Giant's Hand)
      id: 'giants-hand', name: 'Giant\'s Hand', from: 'cand-p7-stone-hand', fraction: 0.9, seed: 24,
      story: 'A giant reached up through the hill and fell asleep.',
      ...voxels({ a: 0x7cc35a, b: 0x4f9a4a, c: 0xc7beb0, d: 0x8a5a3c, e: 0x9fd8e6, f: 0xdcd4c6 }, [
        '..aaa.. .aaaaa. aaaaaaa aaaaaaa aaaaaaa .aaaaa. ..aaa..',
        '....... ...a... ..bcb.. .acbca. ..bcb.. ...a... .......',
        '....... ....... ..bcb.. ..cbc.. ..bcb.. ....... .......',
        '....... ....... ..ccc.. ..ccc.. ..ccc.. ....... .......',
        '....... .ccccc. .cdddc. .cdddcc .cdddcc .ccccc. .......',
        '....... .c.c.c. .c.d.c. ..ded.c ...de.c ....... .......',
        '....... .c.c.c. .c.c.c. ....... ......f ....... .......',
        '....... .c.c.c. .c.c.c. .f.f.f. ....... ....... .......',
      ]),
    },
  ]),
  // ---------------------------------------------------------------- Clockwork Workshop
  // Gears and ticking: wind-up toys and small brass machines.
  ...chapter(10, [
    {
      // from the object gallery (record-player)
      id: 'record-player', name: 'Record Player', from: 'cand-record-player', fraction: 0.7, seed: 9,
      story: 'The record still turns. The last song never quite finished.',
      ...voxels({ a: 0xa86f45, b: 0x7d8794, c: 0x3a3442, d: 0xe0565b, e: 0xe9b949 }, [
        'aaaaaaaa aaaaaaaa aaaaaaaa aaaaaaaa aaaaaaaa aaaaaaaa aaaaaaaa',
        '.......b .ccccc.. .ccccc.. .ccdcc.. .ccccc.. .ccccc.. .......e',
        '......bb .....bb. .....b.. ........ ........ ........ ........',
      ]),
    },
    {
      // from the object gallery (clock)
      id: 'alarm-clock', name: 'Alarm Clock', from: 'cand-clock', fraction: 0.65, seed: 21,
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
      // from the object gallery (page 7: Tin Frog)
      id: 'tin-frog', name: 'Tin Frog', from: 'cand-p7-tin-frog', fraction: 0.65, seed: 7,
      story: 'Wind the key twice and it hops exactly three times.',
      ...voxels({ a: 0x3f8a5b, b: 0x6fbf5a, c: 0xf6d365, d: 0xe0b04a, e: 0x3a3442, f: 0xe0565b, g: 0xf6efe4 }, [
        '....... abbbbba abbbbba abbbbba .bbbbb. .ccccc. .a...a.',
        '....... a.bbb.a abbbbba bbbbbbb .bbbbb. .ccccc. .......',
        '...d... ..bbb.. .bbbbb. .bbbbb. .bbbbb. .bbbbb. ...e...',
        '..ddd.. ..f.f.. ...f... .bb.bb. .eg.ge. ....... .......',
        '..d.d.. ....... ....... ....... ....... ....... .......',
      ]),
    },
    {
      // from the object gallery (page 7: Pocket Watch)
      id: 'pocket-watch', name: 'Pocket Watch', from: 'cand-p7-pocket-watch', fraction: 0.65, seed: 3,
      story: 'Its ticking kept someone company on a very long journey.',
      ...voxels({ a: 0x9b3b55, b: 0xf6d365, c: 0xe0b04a, d: 0xf6efe4, e: 0x5d6670, f: 0xb8434b, g: 0x3a3442, h: 0x9c7230 }, [
        'aaaaaaa aaaaaaa aaaaaaa aaaaaaa aaaaaaa',
        '.aaaaa. baacaab aaacaaa baaaaab .aaaaa.',
        '....... .ccccc. .cdedc. ....... .......',
        '....... .ccccc. .ddddf. ....... .......',
        '....... ccccccc cedgfec ....... .......',
        '....... .ccccc. .ddgdd. ....... .......',
        '....... .ccccc. .cdgdc. ....... .......',
        '....... ...c... ...c... ....... .......',
        '...c... ...h... ...h... ...c... .......',
        '...c... ...c... ...c... ...c... .......',
      ]),
    },
    {
      // from the object gallery (page 7: Sewing Machine)
      id: 'sewing-machine', name: 'Sewing Machine', from: 'cand-p7-sewing-machine', fraction: 0.7, seed: 15,
      story: 'It stitched every coat in the village, one treadle at a time.',
      ...voxels({ a: 0x8a5a3c, b: 0x4fb3a9, c: 0x9fdcc4, d: 0xc9d1d9, e: 0x5d6670, f: 0xe0b04a, g: 0xe0565b }, [
        'aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa',
        '......... bbbb.ccc. bbbb.ccc. bbbb.ccc. bbbb.....',
        '......... .....cccd .e...cccd .....cccd .........',
        '........d cc...cccd cc...ccce cc...cfcd ........d',
        '........d cc...cccd cc...ccce cc...cccd ........d',
        '......... ccccccccd ccccccccd ccccccccd .........',
        '......... cccccccc. ffffffff. cccccccc. .........',
        '......... ......... ...geg... ......... .........',
      ]),
    },
    {
      // from the object gallery (page 7: Songbird Automaton)
      id: 'songbird', name: 'Songbird Automaton', from: 'cand-p7-songbird', fraction: 0.75, seed: 7,
      story: 'A brass bird that sings the same sweet tune every hour.',
      ...voxels({ a: 0x9c7230, b: 0xe0b04a, c: 0x2f8a83, d: 0x4fb3a9, e: 0xf59bb2, f: 0xf6d365, g: 0x3a3442, h: 0xf2a03d }, [
        '....... .aaaaa. .aaaaa. .aaaaa. .aaaaa. .aaaaa. ..bbb..',
        '....... ..bbb.. .bbbbb. .bbbbb. .bbbbb. ..bbb.. ..b.b..',
        '....... ....... ..aaa.. ..aaa.. ..aaa.. ....... .......',
        '....... ..cc... ....... ..ddd.. ....... ..cc... .......',
        '....... ..ccc.. ..ddd.. .cddd.. ..ddd.. ..ccc.. .......',
        '....... ....... ....de. cc..ddf ....de. ....... .......',
        '....... ....... .....g. c...ddh .....g. ....... .......',
        '....... ....... ....... ....... ....... ....... .......',
      ]),
    },
    {
      // from the object gallery (page 7: Brass Microscope)
      id: 'microscope', name: 'Brass Microscope', from: 'cand-p7-microscope', fraction: 1, seed: 22,
      story: 'Look closer: a whole world lives in one drop of water.',
      ...voxels({ a: 0x5d6670, b: 0xe0b04a, c: 0xc9d1d9, d: 0x3a3442, e: 0x8cc8e8, f: 0x8d97a3, g: 0x9c7230 }, [
        '.aaaa. .aaaa. .aaaa. .a..a. .a..a. ......',
        '..bb.. ..bb.. ...... ..cc.. ...... ......',
        '..bb.. ..bb.. ...... ..a... ...... ......',
        '..bb.. ..bb.. .dddd. .dddd. .deed. .dddd.',
        '..bb.. ..bb.. ...... ..ff.. ..ff.. ......',
        '..bb.. ggbbgg ...... ..bb.. ..bb.. ......',
        '..bb.. ..bb.. ..bb.. ..bb.. ..bb.. ......',
        '...... ...... ...... ..bb.. ..bb.. ......',
        '...... ...... ...... ..dd.. ..dd.. ......',
      ]),
    },
    {
      // from the object gallery (page 7: Tin Train)
      id: 'tin-train', name: 'Tin Train', from: 'cand-p7-tin-train', fraction: 0.7, seed: 5,
      story: 'Wound up tight, it rattles round the workshop floor.',
      ...voxels({ a: 0xe0565b, b: 0xe0b04a, c: 0x5d6670, d: 0x4fb3a9, e: 0xf6d365, f: 0x3a3442, g: 0xb8434b }, [
        '..a...a.. ......... ......... ......... ..a...a..',
        '.aba.aba. ccccccccc ccccccccc ccccccccc .aba.aba.',
        '..a...a.. aaaadbdbd aaaadbdbd aaaadbdbd ..a...a..',
        '......... aaaadbdbd aaaadbdbe aaaadbdbd .........',
        '......... a..adbdbd a..adbdbd a..adbdbd .........',
        '......... aaaa..... aaaa.b.f. aaaa..... .........',
        '.gg...... gggg..... gggg...f. gggg..... .gg......',
        '......... ......fff .b....fff ......fff .........',
        '......... ......... bbb...... ......... .........',
      ]),
    },
    {
      // from the object gallery (page 7: Tin Carousel)
      id: 'tin-carousel', name: 'Tin Carousel', from: 'cand-p7-carousel', fraction: 0.4, seed: 5,
      story: 'Round and round, the little horses never tire of the music.',
      ...voxels({ a: 0x9c7230, b: 0x4fb3a9, c: 0xe0b04a, d: 0xf6efe4, e: 0xc9b6e4, f: 0x9fdcc4, g: 0xf4a3b5, h: 0xf6d365, i: 0xe0565b }, [
        '..aaa.. .aaaaa. aaaaaaa aaaaaaa aaaaaaa .aaaaa. ..aaa..',
        '...b... .bbbbb. .bbbbb. bbbbbbb .bbbbb. .bbbbb. ...b...',
        '...c... ....... ..ddd.. c.ddd.c ..ddd.. ....... ...c...',
        '..eee.. ....... f.cdc.g f.dcd.g f.cdc.g ....... ..hhh..',
        '..ec... ....... ..dcd.g c.cdc.c f.dcd.. ....... ...ch..',
        '..eci.. .i...i. i.ddd.g c.ddd.c f.ddd.i .i...i. ..ich..',
        '..idd.. .iiddi. ddidiii ddddddd iiididd .iddii. ..ddi..',
        '....... ...d... ..idi.. .ddddd. ..idi.. ...d... .......',
        '....... ....... ....... ...c... ....... ....... .......',
      ]),
    },
    {
      // from the object gallery (page 5: Armillary Sphere)
      id: 'armillary', name: 'Armillary Sphere', from: 'cand-p5-armillary', fraction: 0.55, seed: 1,
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
      id: 'hourglass', name: 'Hourglass', dims: [5, 8, 5], fraction: 0.85, seed: 7,
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
  ]),
  // ---------------------------------------------------------------- Lantern Festival
  // Festival things: faces and folds, peeled to find.
  ...chapter(11, [
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
  // ---------------------------------------------------------------- Frost Peaks
  // Thin air and deep snow: shaggy coats, warm huts, warm breath.
  ...chapter(12, [
    {
      // A breather between the boat and the tower.
      id: 'penguin', name: 'Penguin', dims: [5, 7, 4], fraction: 0.8, seed: 15,
      story: 'A long way from home, and perfectly calm about it.',
      cell(x, y, z) {
        if (y === 0) return (x === 1 || x === 3) && z >= 2 ? 0xf08a3c : 0;
        if (y === 4 && x === 2 && z === 3) return 0xf08a3c;
        if (!ell(x - 2, y - 3, z - 1.5, 2.0, 3.0, 1.6)) return 0;
        return z >= 2 && Math.abs(x - 2) <= 1 && y <= 3 ? 0xf6f2ea : 0x2d3142;
      },
    },
    {
      // from the object gallery (page 6: Yak)
      id: 'yak', name: 'Yak', from: 'cand-p6-yak', fraction: 0.45, seed: 9,
      story: 'Slow and shaggy, carrying the whole village\'s tea up the pass.',
      ...voxels({ a: 0x43312a, b: 0x5a4234, c: 0x8a6a55, d: 0xf3eee4, e: 0xe9b949, f: 0xf3e2b0, g: 0x3a3442, h: 0xc0392b, i: 0x3f6fc6 }, [
        '....... ....... ..a.a.. .a...a. ....... .aa.aa. ....... ....... .......',
        '....... ..aaa.. .aaaaa. aaaaaaa aaaaaaa .aaaaa. ..aaa.. ....... .......',
        '...a... ..aaa.. .aaaaa. aaaaaaa aaaaaaa .aaaaa. ..aaa.. ..bbb.. ..ccc..',
        '...a... ..bbb.. .bbbbb. .bbbbb. .bbbbb. .bbbbb. ..bbb.. ..bbb.. ..ddd..',
        '....... ..bbb.. .eebee. .ebbbe. .ebbbe. .ebbbe. ..bbb.. ffbbbff ..gdg..',
        '....... ....... ...e... ..hih.. ..hih.. ..eee.. ....... f.....f .......',
        '....... ....... ....... ....... ....... ....... ....... ....... .......',
      ]),
    },
    {
      // from the object gallery (page 6: Alpine Hut)
      id: 'alpine-hut', name: 'Alpine Hut', from: 'cand-p6-alpine-hut', fraction: 0.65, seed: 20,
      story: 'A lamp in the window for climbers coming down late.',
      ...voxels({ a: 0x8a5a3c, b: 0xf6d365, c: 0x9aa3ad, d: 0xb07a50, e: 0xe0b483, f: 0x5a3b30, g: 0xf8d77a, h: 0xd2453c, i: 0xf6f9fd }, [
        '....... .aaaaa. bacc.ad .a...ae ba...ad .afaaa. .......',
        '....... .aaaaa. bag..ae .a...ad ba...ad .afaaa. .......',
        '....... .aaaaa. ba...a. .a...a. ba...a. .ahgha. .......',
        '....... .aaaaa. ba...a. .a...a. ba...a. .aaaaa. .......',
        'ifffffi ifffffi ifffffi ifffffi ifffffi ifaaafi ifffffi',
        '.ifffi. .ifffi. .ifffi. .ifffi. .ifffi. .iaaai. .ifffi.',
        '..iii.. ..iii.. ..iiic. ..iii.. ..iii.. ..aaa.. ..iii..',
        '...i... ...i... ...i.c. ...i... ...i... ...i... ...i...',
      ]),
    },
    {
      // from the object gallery (page 4: Baby Yeti)
      id: 'baby-yeti', name: 'Baby Yeti', from: 'cand-p4-baby-yeti', fraction: 0.6, seed: 15,
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
      // from the object gallery (page 6: Mountain Goat)
      id: 'mountain-goat', name: 'Mountain Goat', from: 'cand-p6-mountain-goat', fraction: 0.65, seed: 5,
      story: 'Sure-footed on ledges nobody else would even look at twice.',
      ...voxels({ a: 0x8a8f99, b: 0xf6f9fd, c: 0xa9afb8, d: 0xf3f1ea, e: 0x6b6157, f: 0x3a3442 }, [
        '.aaaaa. baaaaab .aaaaab aaaaaa. baaaaab baaaaab .bbabb.',
        '.bbcbb. .ccccc. .ccccc. .ccccc. .ccccc. .ccccc. .......',
        '....... .baaaa. .aaaab. .baaab. .baaaa. .abbab. .......',
        '....... ..cbb.. ..bbc.. ..bcb.. ..cbb.. ....... .......',
        '....... ..d.d.. ....... ....... ..d.d.. ..ddd.. .......',
        '....... ..ddd.. ..ddd.. ..ddd.. ..ddd.. ...d... ...d...',
        '...d... ..ddd.. ..ddd.. ..ddd.. ..ddd.. ..ddd.. .......',
        '....... ....... ....... ..e.e.. ..ddd.. .dfdfd. .......',
        '....... ....... ....... ..e.e.. ..ede.. ..ddd.. .......',
      ]),
    },
    {
      // from the object gallery (page 3: Polar Bear Cub)
      id: 'polar-cub', name: 'Polar Bear Cub', from: 'cand-p3-polar-cub', fraction: 0.75, seed: 21,
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
      id: 'snowman', name: 'Snowman', dims: [5, 9, 5], fraction: 1, seed: 20,
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
      // from the object gallery (page 3: Snow Monkey)
      id: 'snow-monkey', name: 'Snow Monkey', from: 'cand-p3-snow-monkey', fraction: 0.95, seed: 17,
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
      // from the object gallery (page 6: Penguin Chick)
      id: 'penguin-chick', name: 'Penguin Chick', from: 'cand-p6-penguin-chick', fraction: 0.85, seed: 12,
      story: 'Still in its grey fluff, waiting for the sea to call.',
      ...voxels({ a: 0xcfe6f5, b: 0xb4bcc6, c: 0x2f3440, d: 0x3a3442, e: 0xfbfbfd }, [
        '.aaaaa. aaaaaaa aaaaaaa aaaaaaa aaaaaaa .aaaaa.',
        '....... ....... ...b... ..bbb.. ..c.c.. .......',
        '....... ...b... ..bbb.. bbbbbbb ..bbb.. .......',
        '....... ..bbb.. .bbbbb. bbbbbbb ..bbb.. .......',
        '....... ...b... ..bbb.. .bbbbb. ..bbb.. .......',
        '....... ....... ..ccc.. ..ccc.. ..ded.. ...d...',
        '....... ....... ..ccc.. ..ccc.. ..ece.. .......',
        '....... ....... ...c... ..ccc.. ....... .......',
      ]),
    },
  ]),
  // ---------------------------------------------------------------- Cloud Isles
  // Above the weather: islands that float and things that fly.
  ...chapter(13, [
    {
      // from the object gallery (page 8: Momonga)
      id: 'momonga', name: 'Momonga', from: 'cand-p8-momonga', fraction: 0.8, seed: 6,
      story: 'A flying squirrel, spread like a handkerchief on the wind.',
      ...voxels({ a: 0xb3a596, b: 0xe8b4a8, c: 0xf3e6cc, d: 0xfbf6ee, e: 0xc9bfb4, f: 0x3a3442 }, [
        '....... ....... ....... ....... ....... ....... ....... ....... .......',
        '...a... ..aaa.. baaaaab caaaaac .aaaaa. caaaaac baaaaab .ddddd. .ddbdd.',
        '....... ....... ....... ..eee.. ..eee.. ..eee.. ..eee.. .eeeee. .efdfe.',
        '....... ....... ....... ....... ....... ....... ....... .e...e. .......',
      ]),
    },
    {
      // Starfall opens softly before the long climb.
      id: 'kite', name: 'Kite', dims: [6, 8, 2], fraction: 0.8, seed: 11, view: 0.35,
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
      // from the object gallery (rain cloud)
      id: 'rain-cloud', from: 'cand-rain-cloud', name: 'Rain Cloud', fraction: 0.8, seed: 7,
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
      // from the object gallery (page 8: Stork & Bundle)
      id: 'stork', name: 'Stork & Bundle', from: 'cand-p8-stork', fraction: 0.5, seed: 3,
      story: 'Someone, somewhere, is expecting a very special delivery today.',
      ...voxels({ a: 0xf4c1cf, b: 0xfbf8f2, c: 0xf2833a, d: 0x2f2a36, e: 0x3a3442 }, [
        '......... ......... .......aa .......aa .......aa ......... .........',
        '......... ......... .......aa .......aa .......aa ......... .........',
        '......... ......... .......aa .......bb .......aa ......... .........',
        '......... ......... ...bb.... c.bbbb..b ...bb.... ......... .........',
        '......... .dbbbb... ..bbb.bb. bbbbbbbbc ..bbb.bb. .dbbbb... .........',
        'ddbbbb... .dbbbb... .......e. ......bbc .......e. .dbbbb... ddbbbb...',
      ]),
    },
    {
      // from the object gallery (page 8: Biplane)
      id: 'biplane', name: 'Biplane', from: 'cand-p8-biplane', fraction: 0.65, seed: 11,
      story: 'Two wings, one pilot, and the whole sky to wander in.',
      ...voxels({ a: 0x3a3442, b: 0x9a6440, c: 0xf6efe4, d: 0xd9413a, e: 0x5d6670, f: 0xf3d2a2, g: 0xf2c14e, h: 0x8a5a3c }, [
        '......... ......... ......a.. ........b ......a.. ......... .........',
        '.....ccc. .....ccc. ..dddccc. ..dddccce ..dddccc. .....ccc. .....ccc.',
        '......b.. cc....... ccdddddd. dcdddddde ccdddddd. cc....... ......b..',
        '......b.. ......... ...fa.... dggfh.b.b ...fa.... ......... ......b..',
        '.....ccc. .....ccc. ...hhccc. d..hhccc. ...hhccc. .....ccc. .....ccc.',
      ]),
    },
    {
      // from the object gallery (page 8: Pegasus Foal)
      id: 'pegasus', name: 'Pegasus Foal', from: 'cand-p8-pegasus', fraction: 0.7, seed: 14,
      story: 'Its wings are still too big for it, but not for long.',
      ...voxels({ a: 0xd9e3f6, b: 0xfbfcff, c: 0xb07a3a, d: 0xf08aa8, e: 0xf2d39b, f: 0xfbf8ff, g: 0xf8e6d4, h: 0xf2c14e, i: 0x3a3442 }, [
        '......... ..aaaaa.. .aaaaaaa. .aaaaaaa. ..aaaaa.. .........',
        '......... .abbbbba. abbbbbbba abbbbbbba .abbbbba. .........',
        '......... ...c.c... ......... ......... ...c.c... .........',
        '....d.... ...eee... ...eee... ...eee... ...eee... .........',
        '....d.... ....e.... ..feeef.. ..feeef.. ...eee... .........',
        '......... ......... .ff.d.ff. .ffeeeff. ...eee... ...ggg...',
        '......... ......... hf..d..fh hf.eee.fh ...iei... .........',
        '......... ......... ......... ...ede... ....d.... .........',
      ]),
    },
    {
      // from the object gallery (page 4: Unicorn)
      id: 'unicorn', name: 'Unicorn', from: 'cand-p4-unicorn', fraction: 0.7, seed: 24,
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
      // from the object gallery (page 8: Waterfall Isles)
      id: 'waterfall-isles', name: 'Waterfall Isles', from: 'cand-p8-waterfall-isles', fraction: 0.55, seed: 2,
      story: 'The water falls from one island and lands on the next.',
      ...voxels({ a: 0x7a6c62, b: 0x9a8a7e, c: 0x7cc87a, d: 0x7cc4e4, e: 0xb8e4f6, f: 0xfbf8f2, g: 0x6b4a3a, h: 0x6fbf73 }, [
        '........ ........ .....a.. ....aaa. .....a.. ........',
        '........ .....b.. ....bbb. ...bbbbb ....bbb. .....b..',
        '........ ....ccc. ...ccddc ...ccddc ...ccccc ....ccc.',
        '........ ........ ..a..ed. ....fff. .......g ........',
        '........ ..a..... .aaa.de. ..a..... .......g ........',
        '..b..... .bbb.... bbbbbed. .bbb.... ..b...hh ......hh',
        '..c..... .cdc.... cddddde. .ccc.... ..c..... ........',
        '........ ........ ........ ........ ........ ........',
      ]),
    },
    {
      // from the object gallery (page 8: Sky Whale)
      id: 'sky-whale', name: 'Sky Whale', from: 'cand-p8-sky-whale', fraction: 0.7, seed: 7,
      story: 'It carries a little meadow on its back above the clouds.',
      ...voxels({ a: 0x6585cc, b: 0xe8eefc, c: 0x7d9ee0, d: 0xf59bb2, e: 0x3a3442, f: 0x7cc87a, g: 0x6b4a3a, h: 0xfbf8f2, i: 0xf6d365, j: 0xf6b6c8, k: 0xe98aa6 }, [
        '......... ......... ......... ......... ......... .........',
        '...aa.... ....bb... ...bbbb.. ...bbbb.. ....bb... ...aa....',
        '....aa... ..cccccd. .cccccccc .cccccccc ..cccccd. ....aa...',
        '......... ..ccccce. ccccccccc ccccccccc ..ccccce. .........',
        'a........ a..fff... a.fffffc. a.fffffc. a..fff... a........',
        '......... ......... ....g.... ..h...... .....i... .........',
        '......... ......... ...gg.... ....jkk.. ......... .........',
        '......... ......... ...jjj... ...jjj... ......... .........',
      ]),
    },
    {
      // from the object gallery (page 5: Weather Vane)
      id: 'weather-vane', name: 'Weather Vane', from: 'cand-p5-weather-vane', fraction: 1, seed: 19,
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
      id: 'windmill', from: 'cand-windmill', name: 'Windmill', fraction: 0.8, seed: 4,
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
  ]),
  // ---------------------------------------------------------------- Starfall
  // The sky at night: the longest climbs.
  ...chapter(14, [
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
    // A layer cake with candles, the kitchen's best (gallery page 6: Layer Cake)
    name: 'Layer Cake', from: 'cand-p6-layer-cake', fraction: 0.7, seed: 19,
    story: 'Baked for a birthday nobody has told you about yet.',
    ...voxels({ a: 0xfbf8f2, b: 0xfbe9ee, c: 0xf3cf8a, d: 0xd9354a, e: 0xfff4dc, f: 0xe0384b, g: 0x5fae6e }, [
      '...aaa... .aaaaaaa. .aaaaaaa. aaaaaaaaa aaaaaaaaa aaaaaaaaa .aaaaaaa. .aaaaaaa. ...aaa...',
      '......... ...bbb... ..bcccb.. .bcccccb. .bcccccb. .bccc.... ..bcc.... ...bb.... .........',
      '......... ...bbb... ..bdddb.. .bdddddb. .bdddddb. .bddd.... ..bdd.... ...bb.... .........',
      '......... ...bbb... ..beeeb.. .beeeeeb. .beeeeeb. .beee.... ..bee.... ...bb.... .........',
      '......... ...bbb... ..bbbbb.. .bbbbbbb. .bbbbbbb. .bbbb.... ..bbb.... ...bb.... .........',
      '......... ....f.... ..f...f.. ....g.... .f..f.... ......... ..f...... ....f.... .........',
    ]),
  }),
  bonus(2, {
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
  bonus(4, {
    // A cider press, the harvest squeezed into one cup (gallery page 8: Cider Press)
    name: 'Cider Press', from: 'cand-p8-cider-press', fraction: 0.65, seed: 7,
    story: 'Every apple of the autumn, pressed into one sweet cup.',
    ...voxels({ a: 0x9a6440, b: 0x6b4a3a, c: 0x4f5560, d: 0x8cbf4a, e: 0xd9413a, f: 0xd9c8a8, g: 0xf2b23a, h: 0xe9c46a, i: 0x8a6a4a }, [
      'aaaaaaa aaaaaaa aaaaaaa aaaaaaa aaaaaaa .......',
      '....... b.ccc.b b.ccc.b d.ccc.. ee...ff ...agff',
      '....... b.aha.b b.hah.b ..aha.. e....ii .....ii',
      '....... b.aha.b b.hah.b ..aha.. ....... .....g.',
      '....... b.ccc.b b.ccc.b ..ccc.. ....... .......',
      '....... b..b..b b.bbb.b ...b... ....... .......',
      '....... b.....b b..c..b ....... ....... .......',
      '....... bbbbbbb bbbbbbb ....... ....... .......',
      '....... ....... .accca. ....... ....... .......',
    ]),
  }),
  bonus(5, {
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
  bonus(6, {
    // A black smoker: a vent chimney glowing on the sea floor (gallery page 6: Black Smoker)
    name: 'Black Smoker', from: 'cand-p6-black-smoker', fraction: 1, seed: 12,
    story: 'A chimney of the deep, breathing warm smoke where no sun reaches.',
    ...voxels({ a: 0x857a74, b: 0xd9c75a, c: 0xf2803d, d: 0xf3efe6, e: 0xe0384b, f: 0x4f4860, g: 0x6f6682 }, [
      '..aab.. .aaaaa. aaaaaab aaaaaaa .aaaaa. ..aaa..',
      '....... .bcaaa. .caaaa. .aaaac. daaaba. .dd....',
      '....... ..aaaa. ..aac.. ..aca.. e...... .ed....',
      '....... ..acaf. ..caa.. ..aaa.. ....... ..e....',
      '....... ..aaa.. ..aaa.. ..aac.. ....... .......',
      '....... ...a... ..aca.. ...a... ....... .......',
      '....... ...a... ..aca.. ...a... ....... .......',
      '....... ...f... ..fcf.. ...f... ....... .......',
      '....... ...ggg. ..ggggg ...ggg. ....... .......',
    ]),
  }),
  bonus(7, {
    // A keyhole arch, the gateway to the oasis (gallery page 7: Keyhole Arch)
    name: 'Keyhole Arch', from: 'cand-p7-keyhole-arch', fraction: 0.85, seed: 20,
    story: 'A doorway in the desert, opening onto more desert.',
    ...voxels({ a: 0xf6efe4, b: 0x4fb3a9, c: 0xd2a86e, d: 0x3f6fb5, e: 0xd9a842, f: 0xf2a03d, g: 0xf6d365, h: 0xc8704b, i: 0x9c7230 }, [
      'aab...baa aab...baa ..ccccc..',
      'aab...baa adb...bda .........',
      'aab...baa aab...baa .........',
      'aab...baa dab...bad .........',
      'ab.....ba ab.....ba .........',
      'ab.....ba ab..e..ba .........',
      'ab.....ba ab.fgf.ba .........',
      'ab.....ba ab..e..ba .........',
      'hhhh.hhhh hhhhihhhh .........',
      'h.h.h.h.h h.h.h.h.h .........',
    ]),
  }),
  bonus(8, {
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
  bonus(9, {
    // A stone circle, the oldest shrine of all (gallery page 7: Stone Circle)
    name: 'Stone Circle', from: 'cand-p7-stone-circle', fraction: 0.75, seed: 10,
    story: 'Nobody remembers who raised them, but the stones remember the sun.',
    ...voxels({ a: 0x7cc35a, b: 0x4f9a4a, c: 0xc7beb0, d: 0x8f877c, e: 0x7fe0e6, f: 0xdcd4c6, g: 0xa8d97a }, [
      '...aaa... .aaaaaaa. .aabbbaa. aabbbbbaa aabbbbbaa aabbbbbaa .aabbbaa. .aaaaaaa. ...aaa...',
      '...cc.... .dd....cc .dd...... c..ddd..c ...ded..c ...ddd... ......... cc.....cc ...cc....',
      '...cc.... .......cc ......... c.......c ........f ......... ......... fg.....cc ...cc....',
      '...ff.... .......cc ......... f........ ......... ......... ......... .......ff ...cc....',
      '......... .......ff ......... ......... ......... ......... ......... ......... ...fg....',
    ]),
  }),
  bonus(10, {
    // A gear train, every wheel turning the next (gallery page 7: Gear Train)
    name: 'Gear Train', from: 'cand-p7-gear-train', fraction: 0.7, seed: 19,
    story: 'Every wheel turns another; none of them knows what for.',
    ...voxels({ a: 0x8a5a3c, b: 0xe0b04a, c: 0x9c7230, d: 0xc96f42 }, [
      'aaaaaaaaaa aaaaaaaaaa aaaaaaaaaa aaaaaaaaaa',
      '.......... ..b.b..... ..b.b..... ..........',
      '.......... .bbbbb.... .bbbbb.... ..........',
      '.......... bb.b.bb... bb.b.bb... ..........',
      '...c...... .bbcbb.... .bbcbb.... ...c......',
      '.......... bb.b.bbd.. bb.b.bbd.. ..........',
      '.......... .bbbbbddd. .bbbbbddd. ..........',
      '.......c.. ..b.bddcdd ..b.bddcdd .......c..',
      '.......... ......ddd. ......ddd. ..........',
      '.......... .......d.. .......d.. ..........',
    ]),
  }),
  bonus(12, {
    // An igloo, a warm room built of snow (gallery page 6: Igloo)
    name: 'Igloo', from: 'cand-p6-igloo', fraction: 0.75, seed: 22,
    story: 'Built of snow, and warmer inside than you would ever guess.',
    ...voxels({ a: 0xf6f9fd, b: 0xe07a4a, c: 0xf8d77a, d: 0xdbe7f3, e: 0xfbe3a0 }, [
      '..aaa.. .abbba. aabcbaa a.bbb.a aabbbaa .aabaa. ..aba.. ..aba.. ..a.a..',
      '..ddd.. .ddddd. dd.c.dd dd...de dd...dd .dd.dd. ..d.d.. ..d.d.. ..d.d..',
      '...a... .aaaaa. .a...a. aa...ae .a...a. .aaaaa. ..aaa.. ..aaa.. ..aaa..',
      '....... ..ddd.. .ddddd. .dd.dd. .ddddd. ..ddd.. ....... ....... .......',
      '....... ....... ...a... ..ada.. ...a... ....... ....... ....... .......',
    ]),
  }),
  bonus(13, {
    // A floating isle, the highest ground on the map (gallery page 8: Floating Isle)
    name: 'Floating Isle', from: 'cand-p8-floating-isle', fraction: 0.9, seed: 17,
    story: 'An island that let go of the ground and drifted up.',
    ...voxels({ a: 0x6b4a3a, b: 0x7a6c62, c: 0x9a8a7e, d: 0xa8764a, e: 0x7cc87a, f: 0x7a5a48, g: 0xf6d365, h: 0xf6efe4, i: 0xfbf8f2, j: 0xe98aa6, k: 0xe0565b, l: 0xf6b6c8 }, [
      '....... ....... .....a. ...b... .a..... ....... .......',
      '....... ..a.... ..bbba. ..bbb.. .abbb.. ....... .......',
      '....... ..ccc.. .ccccc. .ccccc. .ccccc. ..ccc.. .......',
      '..ddd.. .ddddd. ddddddd ddddddd ddddddd .ddddd. ..ddd..',
      '..eee.. .eeeee. eeeeeee eeeeeee eeeeeee .eeeee. ..eee..',
      '....... ....... ..f.... ....... .g..hh. ..i.ag. .......',
      '....... ....... ..fffj. ....... ....kk. ....kk. .......',
      '....... ....... ...f... ....... ....... ....... .......',
      '....... ..ll... .llll.. .llll.. ..ll... ....... .......',
    ]),
  }),
  bonus(14, {
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

// Levels that arrived when the map grew from 7 chapters to 15 (docs/biomes.md).
// A save from before then never saw them, so they don't count as gaps along
// its trail (map.js progress): a returning player keeps the trail they walked.
export const ADDED_LATER = new Set([
  'cake-stand', 'stand-mixer', 'turkey', 'chestnut-cart', 'scarecrow', 'beaver', 'young-stag', 'boar-piglet',
  'giant-isopod', 'yeti-crab', 'meerkats', 'fennec', 'camel-calf', 'date-palm', 'moai', 'moss-spirit',
  'stone-golem', 'sundial', 'broken-column', 'stone-hare', 'giants-hand', 'tin-frog', 'pocket-watch',
  'sewing-machine', 'songbird', 'microscope', 'tin-train', 'tin-carousel', 'yak', 'alpine-hut',
  'mountain-goat', 'penguin-chick', 'momonga', 'stork', 'biplane', 'pegasus', 'waterfall-isles', 'sky-whale',
]);

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


// Guided lessons (docs/tutorial-study.md). One idea each, in the order level 1
// and chapter I need them. Clues: `show` picks whole axes ([x, y, z]); `clues`
// is a per-line mask as in levels (puzzle.js setClues); neither means the
// usual hideClues(fraction, seed). `sky` is the palette.
// Each hint holds until its event fires: break | paint | mistake | rotate |
// peel | solved. A hint with `wait` stays quiet until the player has paused
// that long (or slipped); hints are for hesitation, not a script to read.
//   pulse: [x, y, z]   that cube breathes
//   line: [axis, x, y, z]   the row along `axis` through that cube glows
//   pulseHandle / pulseTool: 'paint' | 'break'   point at a control
// `nudge` (seconds): if the player pauses that long, a row with a move glows.
export const TUTORIAL = [
  {
    // a 0 empties its row; the forced first move is a chisel
    id: 'lesson-clear', name: 'Clear', sky: 'Dawn', view: Math.PI / 4, handles: false, dims: [3, 2, 1], show: [1, 0, 0],
    cell: (x, y) => (y === 0 ? 0xe9b949 : 0),
    hints: [
      { text: 'This row’s number is 0: none of its cubes stay. Tap one to chisel it.', line: [0, 0, 1, 0], pulse: [0, 1, 0], until: 'break' },
      { text: 'Clear the rest of the 0 row.', line: [0, 0, 1, 0], until: 'solved' },
    ],
  },
  {
    // a full count keeps every cube, and a slip is safe and visible
    id: 'lesson-keep', name: 'Keep', sky: 'Lagoon', view: Math.PI / 4, handles: false, dims: [3, 3, 1], show: [1, 0, 0],
    cell: (x, y) => (y === 1 ? 0x5db6ae : 0),
    hints: [
      { text: 'A 3 in a row of three: every cube stays. Try chiselling one anyway.', line: [0, 0, 1, 0], pulse: [1, 1, 0], until: 'mistake' },
      { text: 'That ✕ was a slip: the cube is kept, but slips cost gems. Clear the 0 rows.', until: 'solved' },
    ],
  },
  {
    // the Mark tool: a cube you know stays can't be chiselled by accident
    id: 'lesson-mark', name: 'Mark', sky: 'Mint', view: Math.PI / 4, handles: false, dims: [4, 2, 1], show: [1, 0, 0],
    cell: (x, y) => (y === 1 ? 0x6cc28f : 0),
    hints: [
      { text: 'The 4 row all stays. Switch to Mark below, then tap one of its cubes.', line: [0, 0, 1, 0], pulseTool: 'paint', until: 'paint' },
      { text: 'Marked cubes are safe from the chisel. Back to Chisel, and clear the 0 row.', pulseTool: 'break', until: 'solved' },
    ],
  },
  {
    // numbers on top count their column; two directions combine
    id: 'lesson-cross', name: 'Columns', sky: 'Dawn', view: Math.PI / 4, handles: false, dims: [3, 3, 1], show: [1, 1, 0],
    cell: (x, y) => (x === 1 || y === 1 ? 0xe0546b : 0),
    hints: [
      { text: 'Numbers on top count their column, straight down.', line: [1, 1, 0, 0], until: 'break' },
      { text: 'Each 1 keeps a single cube. The two 3s say which.', wait: 8, until: 'solved' },
    ],
  },
  {
    // numbers on the front count the row running back, away from you
    id: 'lesson-depth', name: 'Depth', sky: 'Lagoon', view: 0.45, handles: false, dims: [3, 1, 3], show: [0, 0, 1],
    cell: (x) => (x === 1 ? 0x5b8fd6 : 0),
    hints: [
      { text: 'Numbers on the front count the row running straight back, away from you.', line: [2, 0, 0, 0], until: 'break' },
      { text: 'Clear both 0 rows, all the way to the back.', until: 'solved' },
    ],
  },
  {
    // turning the block: three 1s point at a cube you can't see from here
    id: 'lesson-turn', name: 'Turn', sky: 'Mint', view: Math.PI / 4, handles: false, dims: [2, 2, 2], show: [1, 1, 1],
    cell: (x, y, z) => (x + y + z === 0 ? 0 : 0x6cc28f),
    hints: [
      { text: 'Drag anywhere to turn the block.', wait: 5, until: 'rotate' },
      { text: 'The three 1s all point at the same hidden cube.', wait: 6, until: 'solved' },
    ],
  },
  {
    // a circle: the cubes stay in two separate groups
    id: 'lesson-groups', name: 'Arch', sky: 'Dawn', view: Math.PI / 4, handles: false, dims: [3, 2, 1], show: [1, 0, 0],
    cell: (x, y) => (y === 1 || x !== 1 ? 0xc98fb4 : 0),
    hints: [
      { text: 'A circle means its cubes stay in 2 separate groups, with a gap between.', line: [0, 0, 0, 0], until: 'solved' },
    ],
  },
  {
    // a square: three or more groups
    id: 'lesson-square', name: 'Comb', sky: 'Lagoon', view: Math.PI / 4, handles: false, dims: [5, 2, 1], show: [1, 0, 0],
    cell: (x, y) => (y === 1 || x % 2 === 0 ? 0x5db6ae : 0),
    hints: [
      { text: 'A square means 3 or more separate groups.', line: [0, 0, 0, 0], until: 'solved' },
    ],
  },
  {
    // a blank face hides its clue; the others are enough
    id: 'lesson-blank', name: 'Blank', sky: 'Mint', view: Math.PI / 4, handles: false, dims: [3, 3, 1],
    clues: '###|.#.|.........',
    cell: (x, y) => (y === 2 || x === 1 ? 0x6cc28f : 0),
    hints: [
      { text: 'A face with no number is a hidden clue. The others are enough.', line: [1, 0, 0, 0], until: 'break' },
      { text: 'The middle column’s 3 decides the two 1s.', wait: 8, until: 'solved' },
    ],
  },
  {
    // peeling: the inside is only reached by slicing layers away
    id: 'lesson-peel', name: 'Lantern', sky: 'Night', dims: [3, 3, 3], show: [1, 1, 1],
    cell: (x, y, z) => (x === 1 && y === 1 && z === 1 ? 0 : 0xe9b949),
    hints: [
      { text: 'Something is hidden inside. Drag a diamond along its rail to peel a layer away.', pulseHandle: true, until: 'peel' },
      { text: 'Every row through the middle is circled: split around one gap. Chisel it.', pulse: [1, 1, 1], until: 'solved' },
    ],
  },
  {
    // the bridge to level 1: a whole small stone with some blank faces, on your own
    id: 'lesson-stool', name: 'Stool', sky: 'Dawn', dims: [3, 3, 3], fraction: 0.5, seed: 4, nudge: 9,
    cell: (x, y, z) => (y === 2 || ((x !== 1) && (z !== 1)) ? (y === 2 ? 0xe58f84 : 0xb9773f) : 0),
    hints: [
      { text: 'A whole stone, on your own. If you pause, a row with a move will glow.', until: 'break' },
      { text: '', until: 'solved' },
    ],
  },
];
