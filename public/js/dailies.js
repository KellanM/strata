// The Daily Stone's own objects (docs/daily-stone.md): Kellan's picks from gallery page 18, the
// Daily Stones (2026-11-01: "These are great dailys to start with"), and the calendar that gives
// each day its stone. Baked here by tools/bake-gallery.mjs, as the levels are in shapes.js, so the
// game never depends on gallery files (they are not in the offline cache).
//
// Each stone is checked as the levels are, by daily.js judge() (test/daily.test.js): with its
// clues shown, line logic alone settles every cell, and it sits in the daily band. `fraction` and
// `seed` are written out, so the clues never move under a stone already played; where they differ
// from the gallery's, the line says why. `from` is the candidate, `section` its part of page 18.
//
// Adding a stone (docs/daily-stone.md has the whole recipe): bake it into STONES, give it a name
// and a story in every table (public/i18n/*.js), then either
//  - an undated stone: a new era at the end of ROTATION, `since` a day not yet reached, `order`
//    the last era's order with the new ids appended (it takes over where the old cycle turns over);
//  - or a dated one: a line in DATED, `since` a day not yet reached.
// Never edit a past era or a dated line's `since`, or the days already played change their stone.
import { voxels, lit, trimToObject } from './shapes.js';

// page 18's sections, and the sky each was drawn against (public/gallery/page18/sections.json)
export const SECTIONS = {
  icons: { name: 'Known Anywhere', palette: 'Dawn' },
  moments: { name: 'Caught in the Act', palette: 'Orchard' },
  wonders: { name: 'Small Wonders', palette: 'Night' },
  seasons: { name: 'Days of the Year', palette: 'Autumn' },
  toys: { name: 'Toy Box', palette: 'Festival' },
};

export const DAILIES = [
  {
    // a piggy bank facing you, a coin half way into the slot
    id: 'daily-piggy-bank', name: 'Piggy Bank', from: 'cand-p18-piggy-bank', section: 'icons', fraction: 0.7, seed: 1,
    story: 'It has been saving since Tuesday. It will not say what for.',
    ...voxels({ a: 0xf28aa6, b: 0xd9607f, c: 0x9a3a56, d: 0x3a3442, e: 0xf2c13d }, [
      '....... .a...a. ....... .a...a. ....... .......',
      '.aaaaa. .aaaaa. .aaaaa. .aaaaa. .aaaaa. ..bbb..',
      '.aaaaa. aaaaaaa aaaaaaa aaaaaaa .aaaaa. ..cbc..',
      '.aaaaa. aaaaaaa aaaaaaa aaaaaaa .daaad. .......',
      '....... .aaaaa. .aeeea. .aaaaa. ....... .......',
      '....... ....... .aeeea. .a...a. ....... .......',
      '....... ....... ...e... ....... ....... .......',
    ]),
  },
  {
    // an instant camera that has just taken your picture, the photo sliding out
    id: 'daily-instant-camera', name: 'Instant Camera', from: 'cand-p18-instant-camera', section: 'icons', fraction: 0.7, seed: 3,
    story: 'It took your picture. It is still deciding what it thinks.',
    ...voxels({ a: 0x7fcfbd, b: 0x34303c, c: 0xd6eefa, d: 0xfbf8f2, e: 0xe0434b, f: 0x5b8fd6 }, [
      '.aaaaa. .aaaaa. .aaaaa. .aaaaa. .......',
      'aaaaaaa aaaaaaa aaaaaaa aaaaaaa ..bbb..',
      'aaaaaaa aaaaaaa aaaaaaa aaaaaaa ..bcb..',
      'aaaaaaa aaaaaaa aaaaaaa aaaaaaa ..bbb..',
      '.aaaaa. .aaaaa. .aaaaa. .aaaaa. .......',
      '....... .ddddd. ....... .....e. .......',
      '....... .dfffd. ....... ....... .......',
      '....... .ddddd. ....... ....... .......',
    ]),
  },
  {
    // a top hat upturned, a white rabbit peeking over the brim
    id: 'daily-rabbit-hat', name: 'Rabbit in a Hat', from: 'cand-p18-rabbit-hat', section: 'icons', fraction: 0.7, seed: 1,
    story: 'Nobody asked the rabbit. The rabbit would like that noted.',
    ...voxels({ a: 0x2f2a36, b: 0xd9434b, c: 0xfbf8f2, d: 0xee8aa4, e: 0x3a3442, f: 0xf4a3b5 }, [
      '...... .aaaa. .aaaa. .aaaa. .aaaa. ......',
      '...... .bbbb. .bbbb. .bbbb. .bbbb. ......',
      '...... .aaaa. .aaaa. .aaaa. .aaaa. ......',
      '.aaaa. acccca acccca acccca acccca .aaaa.',
      '...... .cccc. .cccc. .cccc. .cddc. .c..c.',
      '...... ..cc.. .cccc. .cccc. .ecce. ......',
      '...... ...... .c..c. .f..f. ...... ......',
      '...... ...... .c..c. .f..f. ...... ......',
    ]),
  },
  {
    // a white hen halfway over the road, on the centre line, striding toward you
    id: 'daily-chicken-crossing', name: 'Chicken Crossing', from: 'cand-p18-chicken-crossing', section: 'moments', fraction: 0.85, seed: 7,
    story: 'It has its reasons. It is not sharing them.',
    ...voxels({ a: 0x5d6670, b: 0xfbf8f2, c: 0xf28a2e, d: 0xe0434b, e: 0x3a3442 }, [
      'aaaaaaa aaaaaaa bbaaabb aaaaaaa aaaaaaa',
      '....... ....c.. ....... ..c.... ..c....',
      '....... ..bbb.. ..bbb.. ..bbb.. .......',
      '..bbb.. ..bbb.. .bbbbb. ..bbb.. ...d...',
      '..bbb.. ....... ..bbb.. ..bbb.. ...c...',
      '...b... ....... ..bbb.. ..ebe.. .......',
      '....... ....... ...d... ..ddd.. .......',
    ]),
  },
  {
    // the cross-hilt on top of a boulder, waiting for the right hand
    id: 'daily-sword-stone', name: 'Sword in the Stone', from: 'cand-p18-sword-stone', section: 'wonders', fraction: 0.75, seed: 3,   // (gallery: 0.85; eased from D 14.2)
    story: 'Plenty have tried. The stone is enjoying this enormously.',
    ...voxels({ a: 0xa9a6ad, b: 0xe4ebf2, c: 0xf2c14e, d: 0x7a4a8a }, [
      '.aaaaa. aaaaaaa aaaaaaa .aaaaa.',
      '.aaaaa. aaaaaaa aaaaaaa .aaaaa.',
      '..aaa.. .aaaaa. .aaaaa. ..aaa..',
      '....... ...a... ...b... .......',
      '....... ....... ...b... .......',
      '....... ....... ..ccc.. .......',
      '....... ....... ...d... .......',
      '....... ....... ...c... .......',
    ]),
  },
  {
    // a gold crown between two bulging eyes on a wide frog, lips puckered
    id: 'daily-frog-prince', name: 'Frog Prince', from: 'cand-p18-frog-prince', section: 'wonders', fraction: 0.8, seed: 3,   // (gallery: 0.85 / 7; eased from D 13.2)
    story: 'One kiss, he says. He has said it to several ducks.',
    ...voxels({ a: 0x2f8a6a, b: 0x86cc5c, c: 0xf07a8a, d: 0xf2c14e, e: 0xfbf8f2, f: 0x3a3442 }, [
      '..a...a.. aaaaaaaaa aaaaaaaaa aaaaaaaaa ..aaaaa..',
      'bbbbbbbbb bbbbbbbbb bbbbbbbbb .bbbbbbb. ..b...b..',
      '..bbbbb.. .bbbbbbb. .bbbbbbb. .bbbbbbb. ....c....',
      '......... ..bbbbb.. ..bbbbb.. ..bbbbb.. .........',
      '......... ...ddd... .bbdddbb. .ef...fe. .........',
      '......... ....d.... ...d.d... ......... .........',
    ]),
  },
  {
    // a blue genie out of a gold lamp's spout, arms flung up, ta-da
    id: 'daily-genie', name: 'Genie', from: 'cand-p18-genie', section: 'wonders', fraction: 0.5, seed: 5,
    story: 'A thousand years in a lamp, and he still does the arms.',
    ...voxels({ a: 0xe6b04a, b: 0x5ab8ee, c: 0xe0434b, d: 0x3a3442 }, [
      '...a..... ..aaa.... ...a.....',
      '..aaaa... .aaaaaa.. ..aaaa...',
      '.aaaaaa.. aaaaaaaa. .aaaaaa..',
      '...a..... a.aaa..a. ...a.....',
      '......... aaa...bb. .........',
      '......... .....bb.. .........',
      '....ccc.. ....ccc.. ....ccc..',
      '...bbbbb. ..bbbbbbb ...bbbbb.',
      '....bbb.. ..a.bbb.a ....dbd..',
      '.....b... ..b.bbb.b ....bbb..',
    ]),
  },
  {
    // a hut on two chicken legs, mid-stride, its windows and door a face
    id: 'daily-baba-yaga-hut', name: "Baba Yaga's Hut", from: 'cand-p18-baba-yaga-hut', section: 'wonders', fraction: 0.7, seed: 1, lit: { keep: [0xffe27a] },   // (gallery: 0.85 / 7; eased from D 14.5)
    story: 'It goes for a walk most nights. Knock, and it may turn round.',
    ...voxels({ a: 0xf2a03d, b: 0x8a5a3c, c: 0x4a3a3a, d: 0xffe27a, e: 0x8fae5a }, [
      '..a.... ..a.... .aa.... ..a....',
      '....... ..a.... ....a.. ....aa.',
      '....... ..a.a.. ....a.. .......',
      '....... ..a.a.. ....... .......',
      '.bbbbb. .bbbbb. .bbbbb. .bbcbb.',
      '.bbbbb. .bbbbb. .bbbbb. .bdbdb.',
      '.bbbbb. .bbbbb. .bbbbb. .bbbbb.',
      'eeeeeee eeeeeee eeeeeee eeeeeee',
      '....... eeeeeee eeeeeee .......',
    ]),
  },
  {
    // Oct 31: a black cat bristling on a pumpkin, tail straight up
    id: 'daily-black-cat', name: 'Black Cat', from: 'cand-p18-black-cat', section: 'seasons', fraction: 0.5, seed: 7,
    story: 'One night a year everyone expects it. It intends to be worth it.',
    ...voxels({ a: 0xec7f2a, b: 0x34303d, c: 0xe6e04a }, [
      '..aaa.. .aaaaa. aaaaaaa .aaaaa. ..aaa..',
      '.aaaaa. aaaaaaa aaaaaaa aaaaaaa .aaaaa.',
      '..aaa.. .aaaaa. aaaaaaa .aaaaa. ..aaa..',
      '....... .b..b.. ...a... .b..b.. .......',
      '....... .b..bb. .....bb .b..bb. .......',
      '....... .b..bbc bb..bbb .b..bbc .......',
      '....... .bbbb.b bbbbbbb .bbbb.b .......',
      '....... ..bb..b b.bb... ..bb..b .......',
    ]),
  },
  {
    // Dec 6: a nutcracker at attention, tall black shako over a white beard
    id: 'daily-nutcracker', name: 'Nutcracker', from: 'cand-p18-nutcracker', section: 'seasons', fraction: 0.8, seed: 7,
    story: 'He guards the mantelpiece every December. Nobody has ever handed him a nut.',
    ...voxels({ a: 0x2e2b36, b: 0xfbf8f2, c: 0xd8343c, d: 0xf2c14e, e: 0xf4c9a4, f: 0x3a3442 }, [
      '..... .a.a. .a.a. .a.a.',
      '..... .b.b. .b.b. .....',
      '..... ccccc ccccc .....',
      '..... ccccc ccccc ..d..',
      '.bbb. ccccc dcccd .....',
      '.bbb. .eee. beeeb .bbb.',
      '.bbb. .eee. beeeb .fef.',
      '..... .ddd. .ddd. .ddd.',
      '..... .aaa. .aaa. .aaa.',
      '..... .aaa. .aaa. .aaa.',
    ]),
  },
  {
    // Mar 20: the thaw, a carrot and two coals on a slumped white lump
    id: 'daily-melted-snowman', name: 'Melted Snowman', from: 'cand-p18-melted-snowman', section: 'seasons', fraction: 0.8, seed: 6,   // (gallery: 0.85 / 7; trimmed, it was D 13.5)
    story: 'He had a good winter. The carrot was always going to outlast him.',
    ...voxels({ a: 0x9fd0ec, b: 0xfbfbfd, c: 0x7a5238, d: 0xf08a2a, e: 0x2e2b36, f: 0x3a3442 }, [
      '.aaaaa. .abbba. abbbbba abbbbba .abbba. .aaaaa.',
      '....... ..bbb.. cbbbbb. .bbbbbc ..bbb.. .......',
      '....... ..bbb.. .bbbbb. .bbbbb. ..bdb.. ...d...',
      '..eee.. ..eee.. ..bbb.. ..fbf.. ....... .......',
      '..ee... ..ee... ....... ....... ....... .......',
      '....... ....... ....... ....... ....... .......',
    ]),
  },
  {
    // a cloth tiger (bu laohu) on guard by the cot, tail up
    id: 'daily-cloth-tiger', name: 'Cloth Tiger', from: 'cand-p18-cloth-tiger', section: 'toys', fraction: 0.65, seed: 10, lit: { span: 2 },
    story: 'Sewn to keep bad dreams off the baby. No dream has tried it.',
    ...voxels({ a: 0xf29a3a, b: 0xfbf3e6, c: 0x3a3442, d: 0xd8343c }, [
      '.a..a.... ......... ......... ......... .a..a....',
      '.a..aaaa. .....aaab .....aaab .....aaab .a..aaaa.',
      'acacaaaaa acacaaaab acacaaaad acacaaaab acacaaaaa',
      'acacaaaaa acacaaaab acacaaaac acacaaaab acacaaaaa',
      '.cacaaaaa acacaaaac acacaaaac acacaaaac .cacaaaaa',
      '.....aaa. .....aaaa a....aaac .....aaaa .....aaa.',
      '.....aa.. ......... ca....... ......... .....aa..',
    ]),
  },
  {
    // a troll doll, its pink hair on end as it has been since 1959
    id: 'daily-troll-doll', name: 'Troll Doll', from: 'cand-p18-troll-doll', section: 'toys', fraction: 0.7, seed: 3,
    story: 'Its hair has stood on end since 1959. It will not say why.',
    ...voxels({ a: 0xf0b98c, b: 0x6cc04a, c: 0xe07a62, d: 0x3a3442, e: 0xf25fa8 }, [
      '....... .aa.aa. .aa.aa. .aa.aa.',
      '.bbbbb. abbbbba .bbbbb. ..bbb..',
      '..bbb.. abbbbba ..bbb.. ..bbb..',
      '..aaa.. .aaaaa. .aaaaa. ..aca..',
      '.aaaaa. aaaaaaa aaaaaaa .adada.',
      '.aaaaa. .aaaaa. .aaaaa. .aaaaa.',
      '.eeeee. .eeeee. .eeeee. ..eee..',
      '..eee.. .eeeee. ..eee.. .......',
      '..eee.. ..eee.. ..eee.. .......',
      '...e... ..eee.. ....... .......',
    ]),
  },
  {
    // a sock monkey sat where you left it, the red heel for a mouth
    id: 'daily-sock-monkey', name: 'Sock Monkey', from: 'cand-p18-sock-monkey', section: 'toys', fraction: 0.7, seed: 3,
    story: 'Made from one pair of work socks. It still smells faintly of boots.',
    ...voxels({ a: 0x9a8c7c, b: 0xf6efe0, c: 0xd8343c, d: 0x3a3442 }, [
      '.aaaaa. .aaaaa. .aaaaa. .a...a. .a...a. .b...b.',
      '.aaaaa. aaaaaaa .aaaaa. ....... ....... .......',
      '.aaaaa. aaaaaaa .aaaaa. ....... ....... .......',
      '.aaaaa. aaaaaaa .aaaaa. ....... ....... .......',
      '.aaaaa. .aaaaa. .aaaaa. .aaaaa. ..ccc.. .......',
      '.aaaaa. .aaaaa. baaaaab .aaaaa. ..bbb.. .......',
      '.aaaaa. .aaaaa. baaaaab .adada. ....... .......',
      '..aaa.. .aaaaa. .aaaaa. ..aaa.. ....... .......',
    ]),
  },
];

// The game's dithered light, as every level takes it (shapes.js LIT), with the candidate's own
// options; then the block is trimmed to the object, so no edge is an empty slab (the Melted
// Snowman's grid had a layer of sky over its hat). Lit first, as the levels are, so the dither
// falls as it did in the gallery.
for (const s of DAILIES) {
  s.cell = lit(s, s.lit).cell;
  trimToObject(s);
}
export const DAILY_BY_ID = new Map(DAILIES.map((s) => [s.id, s]));

// ---------------------------------------------------------------- the calendar (daily.js stoneIdOf)

// Daily #2 (1 Nov 2026) is the first curated day. Every day before it keeps its generated stone:
// Daily #1 had been played and shared by then.
export const CURATED_FROM = 2;

// Dated stones fall on their date every year (the month and day of the player's own calendar,
// the daily's rule), from Daily #`since` on, and on no other day: they are held out of the
// rotation. 2026's Oct 31 was Daily #1, so the Black Cat's first night is 31 Oct 2027.
export const DATED = [
  { id: 'daily-black-cat', date: '10-31', since: 2 },       // Halloween
  { id: 'daily-nutcracker', date: '12-06', since: 2 },      // St Nicholas' Day, early in Advent
  { id: 'daily-melted-snowman', date: '03-20', since: 2 },  // about the spring equinox
];

// Every other day takes the next stone of the rotation, and the order starts again once every
// stone has had its day. The order spreads page 18's sections so no two neighbours share one
// (the end and the start too):  I W T I W T I W M W T  (I Known Anywhere, M Caught in the Act,
// W Small Wonders, T Toy Box; the Days of the Year are all dated).
// Eras are appended, never edited: a later era takes over at the first turn of the cycle on or
// after its `since`, starting at its own first stone.
export const ROTATION = [
  { since: CURATED_FROM, order: [
    'daily-piggy-bank', 'daily-genie', 'daily-troll-doll', 'daily-instant-camera', 'daily-frog-prince', 'daily-cloth-tiger',
    'daily-rabbit-hat', 'daily-sword-stone', 'daily-chicken-crossing', 'daily-baba-yaga-hut', 'daily-sock-monkey',
  ] },
];
