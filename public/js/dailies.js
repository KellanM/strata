// The Daily Stone's own objects (docs/daily-stone.md): Kellan's picks from gallery page 18, the
// Daily Stones (2026-11-01: "These are great dailys to start with"), then from page 19, more
// Daily Stones (2026-11-01, 17 picks), and the calendar that gives each day its stone. Baked here
// by tools/bake-gallery.mjs, as the levels are in shapes.js, so the game never depends on gallery
// files (they are not in the offline cache).
//
// Each stone is checked as the levels are, by daily.js judge() (test/daily.test.js): with its
// clues shown, line logic alone settles every cell, and it sits in the daily band. `fraction` and
// `seed` are written out, so the clues never move under a stone already played; where they differ
// from the gallery's, the line says why. `from` is the candidate, `section` its part of its page.
//
// Adding a stone (docs/daily-stone.md has the whole recipe): bake it into DAILIES, give it a name
// and a story in every table (public/i18n/*.js), then either
//  - an undated stone: a new era at the end of ROTATION, `since` a day not yet reached, `order`
//    the last era's order with the new ids appended (it takes over where the old cycle turns over);
//  - or a dated one: a line in DATED, `since` a day not yet reached.
// Never edit a past era or a dated line's `since`, or the days already played change their stone.
import { voxels, lit, trimToObject } from './shapes.js';

// the picks' sections, and the sky each was drawn against (public/gallery/page18/sections.json,
// page19/sections.json; page 19's Lucky Charms had no pick)
export const SECTIONS = {
  icons: { name: 'Known Anywhere', palette: 'Dawn' },
  moments: { name: 'Caught in the Act', palette: 'Orchard' },
  wonders: { name: 'Small Wonders', palette: 'Night' },
  seasons: { name: 'Days of the Year', palette: 'Autumn' },
  toys: { name: 'Toy Box', palette: 'Festival' },
  // page 19
  storybook: { name: 'Storybook', palette: 'Dawn' },
  rhymes: { name: 'Nursery Rhymes', palette: 'Orchard' },
  myths: { name: 'Myths of the World', palette: 'Night' },
  toybox: { name: 'Toy Box, Again', palette: 'Dusk' },
  showtime: { name: 'Show Time', palette: 'Festival' },
  holidays: { name: 'Holidays of the World', palette: 'Beacon' },
  weather: { name: 'Weather and Seasons', palette: 'Clouds' },
  mischief: { name: 'Up to Something', palette: 'Autumn' },
  secrets: { name: 'Things With a Secret', palette: 'Stones' },
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
  // ---- page 19's picks (Kellan, 2026-11-01), appended: page 18's above never move
  {
    // a cat in big cuffed boots and a plumed hat, dressed to impress
    id: 'daily-puss-in-boots', name: 'Puss in Boots', from: 'cand-p19-puss-in-boots', section: 'storybook', fraction: 0.65, seed: 1,
    story: 'He asked for boots. The rest he arranged himself.',
    ...voxels({ a: 0x5a3a32, b: 0xf2a03d, c: 0xfbf3e6, d: 0xf07a8a, e: 0x3a3442, f: 0xb83a48, g: 0xfbf8f2 }, [
      '....... .aa.aa. .aa.aa. .aa.aa. .......',
      '....... .aa.aa. .aa.aa. .aa.aa. .......',
      '....... aaa.aaa aaa.aaa aaa.aaa .......',
      '....... .bbbbb. bbbbbbb .bcccb. .......',
      '....... .bbbbb. bbbbbbb .bcccb. .......',
      '..bbb.b .bbbbb. .bbbbb. .bbbbb. ..cdc..',
      '.bbbbbb .bbbbb. .bbbbb. .bbbbb. .bebeb.',
      '..bbb.. .bbbbb. .bbbbb. .bbbbb. ..bbb..',
      'fffffff fffffff fffffff fffffff fffffff',
      '......g ..fffgg ..fffg. ..fff.. .......',
    ]),
  },
  {
    // the farmhouse come down from the twister, striped stockings and silver shoes out from under it
    id: 'daily-dorothys-house', name: "Dorothy's House", from: 'cand-p19-dorothys-house', section: 'storybook', fraction: 0.7, seed: 2,
    story: 'It came down in the land of the Munchkins. The welcome was mixed.',
    ...voxels({ a: 0x8fa6c0, b: 0xfbf8f2, c: 0x3a3442, d: 0xdfe6ee, e: 0x7a4a32, f: 0x4a5a7a, g: 0x6b4a3a }, [
      'aaaaa.... aaaaabcbd aaaaa.... aaaaabcbd aaeaa....',
      'aaaaa.... aaaaa...d aaaaa.... aaaaa...d aaeaa....',
      'aaaaa.... aaaaa.... aaaaf.... aaaaa.... afafa....',
      'aaaaa.... aaaaa.... aaaaa.... aaaaa.... aaaaa....',
      'ggggg.... ggggg.... ggggg.... ggggg.... ggggg....',
      '......... ggggg.... ggggg.... ggggg.... .........',
      '......... ......... ggggg.... ......... .........',
    ]),
  },
  {
    // an owl and a cat at sea in a pea-green boat (Lear's "The Owl and the Pussycat"; shortened to sit on one line)
    id: 'daily-owl-pussycat', name: 'Owl and Pussycat', from: 'cand-p19-owl-pussycat', section: 'rhymes', fraction: 0.65, seed: 1,
    story: 'They took some honey and plenty of money. Nobody remembered the oars.',
    ...voxels({ a: 0x93c84a, b: 0x9a6a44, c: 0xf29a3a, d: 0xfbf3e6, e: 0xf6e6c8, f: 0xf2a03d, g: 0xf29aa8, h: 0x3a3442 }, [
      '..aaaaaa.. ..aaaaaa.. ..aaaaaa.. ..aaaaaa..',
      '.aaaaaaaa. .aaaaaaaa. .aaaaaaaa. .aaaaaaaa.',
      '.aaaaaaaa. aaaaaaaaaa aaaaaaaaaa .aaaaaaaa.',
      '.......... abbb..ccca abbb..ddda ..........',
      '.......... .bbb..ccc. .bbb..ddd. ..........',
      '.......... .bbb..ccc. .efe..cgc. ..........',
      '.......... .b.b..ccc. .heh..hch. ..........',
      '.......... .b.b..c.c. .......... ..........',
    ]),
  },
  {
    // one big eye, the lid half down, in a nightcap: nodding off at bedtime
    id: 'daily-cyclops', name: 'Sleepy Cyclops', from: 'cand-p19-cyclops', section: 'myths', fraction: 0.65, seed: 7,
    story: 'He counts his sheep every night. He keeps dozing off at one.',
    ...voxels({ a: 0x4f86cf, b: 0xeaa878, c: 0xfbf8f2, d: 0x3a3442, e: 0xb86a5a }, [
      '.aaaaa. .aaaaa. .aaaaa. .aaaaa. ..b.b..',
      '.aaaaa. .aaaaa. baaaaab .aaaaa. .......',
      '....... ..bbb.. .bbbbb. .bbbbb. ..bbb..',
      '....... .bbbbb. .bbbbb. .bbbbb. .bcccb.',
      '....... .bbbbb. .bbbbb. .bbbbb. .bcdcb.',
      '....... .bbbbb. .bbbbb. .bbbbb. .bcccb.',
      '....... .bbbbb. .bbbbbc .bbbbb. .beeeb.',
      '....... ..bbb.. .bbbbba .bbbbb. ..bbb..',
      '....... .aaaaa. .aaaaaa .aaaaa. .aaaaa.',
      '....... ....... ..aaaaa ..aaa.. .......',
    ]),
  },
  {
    // Feb 14: a chubby cherub, wings at full width, holding the heart
    id: 'daily-cupid', name: 'Cupid', from: 'cand-p19-cupid', section: 'myths', fraction: 0.65, seed: 1,
    story: 'He has never once checked who he is aiming at.',
    ...voxels({ a: 0xf6c6a8, b: 0xf6efe0, c: 0xe0434b, d: 0xfbf8f2, e: 0x3a3442, f: 0xf2c14e }, [
      '......... ...a.a... ......... .........',
      '...bbb... ...bbb... ...bbb... ....c....',
      '...aaa... ...aaa... ...aaa... ...ccc...',
      '.d.aaa.d. .d.aaa.d. ...aaa... ...c.c...',
      'dd.aaa.dd ddaaaaadd ..aaaaa.. ...aaa...',
      'ddaaaaadd ddaaaaadd ..aaaaa.. ..aeaea..',
      'd.fffff.d d.aaaaa.d ..aaaaa.. ..faaaf..',
      '..fffff.. ..fffff.. ..fffff.. .........',
    ]),
  },
  {
    // the clockwork tea-serving doll, a cup held out on its tray
    id: 'daily-karakuri', name: 'Karakuri Tea Doll', from: 'cand-p19-karakuri', section: 'toybox', fraction: 0.65, seed: 4,
    story: 'Brings your tea, waits while you drink it, then walks home with the cup.',
    ...voxels({ a: 0x4a5a9a, b: 0xd8433c, c: 0xfbf6ee, d: 0xa8693f, e: 0xe4f0f6, f: 0x7ed05a, g: 0x2e2a36, h: 0xd8343c, i: 0x3a3442 }, [
      '.aaa... aaaaa.. aaaaa.. aaaaa.. .aaa...',
      '.aaa... aaaaa.. aaaaa.. aaaaa.. .aaa...',
      '.aaa... aaaaa.. aaaaa.. aaaaa.. .aaa...',
      '.bbb... .aaa... .aaa... .aaa... .bbb...',
      '.bbbbc. .bbbddd .bbbddd .bbbddd .bbbbc.',
      '.bbb... .bbb.e. .bbbefe .bbb.e. .bbb...',
      '.gcc... .ggc... .ggh... .ggc... .gcc...',
      '.gcc... gggi... gggc... gggi... .gcc...',
      '.ggg... gggc... gggc... gggc... .ggg...',
      '.gg.... .ggg... .ggg... .ggg... .gg....',
    ]),
  },
  {
    // a masked wrestler toy in the victory flex (undated: the gallery's 21 Sep is unverified)
    id: 'daily-luchador', name: 'Luchador', from: 'cand-p19-luchador', section: 'toybox', fraction: 0.65, seed: 2,
    story: 'Undefeated. Has never once taken the mask off, even for bath time.',
    ...voxels({ a: 0x3f78d8, b: 0xf2c14e, c: 0xe8a878, d: 0xfbf8f2, e: 0x3a3442 }, [
      '..aa.aa.. ..aa.aa.. ..aa.aa..',
      '..aa.aa.. ..aa.aa.. ..aa.aa..',
      '..aaaaa.. ..aaaaa.. ..aaaaa..',
      '..bbbbb.. ..bbbbb.. ..bbbbb..',
      '...ccc... ...ccc... ...ccc...',
      '.ccccccc. ccccccccc ccccccccc',
      '...aaa... cc.aaa.cc cc.aca.cc',
      '..aaaaa.. c.aaaaa.c c.adada.c',
      '...aaa... c.aaaaa.c c.deaed.c',
      '....d.... ...ada... ...ada...',
    ]),
  },
  {
    // a big open-jawed head over tiny arms, roaring at shin height
    id: 'daily-toy-dinosaur', name: 'Toy Dinosaur', from: 'cand-p19-toy-dinosaur', section: 'toybox', fraction: 0.65, seed: 4,
    story: "Fearsome, from a toddler's height. The arms let it down a bit.",
    ...voxels({ a: 0x5fae5a, b: 0xf2e2a8, c: 0xd8343c, d: 0xfbf8f2, e: 0x3a3442 }, [
      '....aaa.. aa....... ....aaa..',
      '..aaaa... aaaaa.... ..aaaa...',
      '..aaab... .aaaab... ..aaab...',
      '...aab... ..aaab... ...aab...',
      '...aaba.. ..aaab... ...aaba..',
      '...aab... ...aab... ...aab...',
      '...abbbb. ...abccc. ...abbbb.',
      '....aa... ....aad.d ....aa...',
      '....aaaea ....aaaaa ....aaaea',
      '....aaaa. ....aaaa. ....aaaa.',
    ]),
  },
  {
    // the nose out past the face, sprouting a leaf: he has just told one
    id: 'daily-pinocchio', name: 'Pinocchio', from: 'cand-p19-pinocchio', section: 'toybox', fraction: 0.65, seed: 3,
    story: 'Says he has never told a lie. The nose has its own opinion.',
    ...voxels({ a: 0x6b4a3a, b: 0xe2b07a, c: 0xd8433c, d: 0x4f86cf, e: 0x4a3428, f: 0x3a3442, g: 0x7ed05a }, [
      '.aaa... ....... .aaa...',
      '.bb.... ....... .bb....',
      'ccc.... ccc.... ccc....',
      'ddb.... ddd.... ddb....',
      'ddd.... ddd.... ddd....',
      'ebbb... ebbb... ebbb...',
      'ebbf... ebbbbbb ebbf...',
      'ebbb... ebbb..g ebbb...',
      'cccc... cccc... cccc...',
      '....... cc..... .......',
    ]),
  },
  {
    // a hat drooping to both sides, a bell on every point, grinning at the king
    id: 'daily-jester', name: 'Jester', from: 'cand-p19-jester', section: 'showtime', fraction: 0.65, seed: 1,
    story: 'Paid to tell the king the truth, as long as it rhymes.',
    ...voxels({ a: 0xe0434b, b: 0x5cb85a, c: 0xf2c14e, d: 0xfbeee0, e: 0x3a3442, f: 0xf07a8a }, [
      '......... .a.a.b.b. .a.a.b.b. .........',
      '.aaacbbb. .aaacbbb. .aaacbbb. .aaacbbb.',
      '..ddddd.. ..ddddd.. ..ddddd.. ..ddedd..',
      '..ddddd.. ..ddddd.. ..ddddd.. ..fedef..',
      '..ddddd.. c.ddddd.c c.ddddd.c ..deded..',
      '..ddddd.. a.ddddd.b a.ddddd.b ..ddddd..',
      '..aaabb.. aaaaabbbb aaaaabbbb ..aaabb..',
      '......... ...aab... ...aab... .........',
      '......... ....c.... ....c.... .........',
    ]),
  },
  {
    // Nov 2: a calavera under a marigold crown, for the Day of the Dead
    id: 'daily-sugar-skull', name: 'Sugar Skull', from: 'cand-p19-sugar-skull', section: 'holidays', fraction: 0.7, seed: 6,
    story: 'Painted, sugared and grinning. Someone special is coming home tonight.',
    ...voxels({ a: 0xfbf8f2, b: 0x3a3442, c: 0x4fb3e8, d: 0xf25fa8, e: 0xf29a2a }, [
      '....... ..aaa.. ..aaa.. ..aaa.. ..aaa..',
      '....... .aaaaa. .aaaaa. .aaaaa. .ababa.',
      '....... .aaaaa. .aaaaa. .aaaaa. .aabaa.',
      '.aaaaa. aaaaaaa aaaaaaa aaaaaaa cbbabbc',
      '.aaaaa. aaaaaaa aaaaaaa aaaaaaa abbabba',
      '.aaaaa. aaaaaaa aaaaaaa aaaaaaa addcdda',
      '....... .aaaaa. .aaaaa. .aaaaa. .aacaa.',
      '....... .eeeee. eeeeeee .eeeee. .......',
      '....... ....... .e.e.e. ....... .......',
    ]),
  },
  {
    // Sep 22: a frog sheltering under a spotted red cap, for the autumn rains (gallery: "Frog under a Toadstool"; shortened to sit on one line)
    id: 'daily-toadstool-frog', name: 'Frog & Toadstool', from: 'cand-p19-toadstool-frog', section: 'weather', fraction: 0.7, seed: 1,
    story: 'A frog, sheltering from the rain. He would rather not discuss it.',
    ...voxels({ a: 0xf2e6d0, b: 0x3f8a3b, c: 0x6cc04a, d: 0x3a3442, e: 0xe8d8c0, f: 0xd8343c, g: 0xfbf8f2 }, [
      '....... .aa.... .aa.... ..bcccb ...ccc. ..bcccb',
      '....... .aa.... .aa.... ...ccc. ...ccc. ...ccc.',
      '....... .aa.... .aa.... ....... ...c.c. ...d.d.',
      'eeeee.. eaaeee. eaaeee. eeeeee. eeeee.. .eee...',
      'fffff.. ffffff. fffffg. ffffff. fffff.. .fgf...',
      '.fff... fffgf.. fffff.. fffff.. .gff... .......',
    ]),
  },
  {
    // Nov 1: a squirrel's tail curling up over a jack-o'-lantern, the morning after
    id: 'daily-squirrel-pumpkin', name: 'Squirrel & Pumpkin', from: 'cand-p19-squirrel-pumpkin', section: 'mischief', fraction: 0.65, seed: 5,
    story: 'Halloween ended last night. Nobody has told the squirrel.',
    ...voxels({ a: 0xf2803d, b: 0x4a2e2a, c: 0x8f939c, d: 0xf3efe8, e: 0x3a3442 }, [
      '.aaaaa. aaaaaaa aaaaaaa aaaaaaa .aaaaa.',
      'aaaaaaa aaaaaaa aaaaaaa aaaaaaa aabbbaa',
      'aaaaaaa aaaaaaa aaaaaaa aaaaaaa abbabba',
      '.aaaaa. aaaaaaa aaaaaaa aaaaaaa .aaaaa.',
      '....... ..ccc.. ..cccd. ..ccc.. .......',
      '....... .ccccc. .ccccda .ccccc. .......',
      '....... cc.ccc. cc.ccc. cc.ccc. .......',
      '....... cc..cc. cc..cce cc..cc. .......',
      '....... cc..ce. cc..cc. cc..ce. .......',
      '....... .cc.c.. .cc.... .cc.c.. .......',
    ]),
  },
  {
    // a white head and floppy ears over the sofa back, on the forbidden cushion
    id: 'daily-dog-sofa', name: 'Dog on the Sofa', from: 'cand-p19-dog-sofa', section: 'mischief', fraction: 0.65, seed: 7,
    story: 'It knows the rule. It is on the cushion, which is different.',
    ...voxels({ a: 0x3f8a7a, b: 0x6fb8a4, c: 0xf6f1e7, d: 0x8a5a3c, e: 0x3a3442 }, [
      'a...a...a a.......a a.......a a.......a a...a...a',
      'aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa aaaaaaaaa',
      'aaaaaaaaa aaaaaaaaa abbbbbbba abbbbbbca abbbbbbba',
      'aaaaaaaaa aaaaaaaaa a..ccc..a a..ccc.ca a..c.c..a',
      'aaaaaaaaa aaaaaaaaa ...ccc... ...ccc... .........',
      '......... ..ccccc.. .dcccccd. .dcccccd. ...cec...',
      '......... ..ccccc.. .dcccccd. .dcececd. .........',
      '......... ...ccc... ..ccccc.. ...ccc... .........',
    ]),
  },
  {
    // a gull in profile beside a red carton of chips, one in its beak
    id: 'daily-gull-chips', name: 'Gull & Chips', from: 'cand-p19-gull-chips', section: 'mischief', fraction: 0.65, seed: 1,
    story: 'It asked. Nobody answered, so it took that as a yes.',
    ...voxels({ a: 0xe0434b, b: 0xf0a8a0, c: 0xfbf8f2, d: 0x9aa3ad, e: 0xf2c14e, f: 0x3a3442, g: 0xf6d84a }, [
      'aaa....... aaa....... aaa..b.b.. ..........',
      'aaa....... aaa....... aca..b.b.. ..........',
      'aaa....... aaa.cccc.. aca.cccc.. ....cccc..',
      'aaa....... aacdddcc.. aacdddccc. ..cdddcc..',
      'e.e....... .efdddcc.. e.fdddcc.e ..fdddcc..',
      'e......... ......cc.. ..e...ccge ......cc..',
      '.......... ......cf.. ......cc.. ......cf..',
    ]),
  },
  {
    // a goat on the roof of a little blue car, horns at the top
    id: 'daily-goat-car', name: 'Goat on the Car', from: 'cand-p19-goat-car', section: 'mischief', fraction: 0.6, seed: 7,
    story: 'It saw a hill. The hill had wipers.',
    ...voxels({ a: 0x3a3442, b: 0x4f86cf, c: 0xf6d365, d: 0xcfe6f2, e: 0xf6f1e7, f: 0xe0a0a0, g: 0x6b5a4a }, [
      'aa...aa ....... ....... ....... aa...aa',
      'bbbbbbb bbbbbbb bbbbbbb bbbbbbb bcbbbcb',
      '.bbbbb. bbbbbbb bbbbbbb bbbbbbb .bbbbb.',
      '.ddddd. .ddddd. .ddddd. .ddddd. .......',
      '..e.e.. ....... ..e.e.. ....... ...e...',
      '..eee.. ..eee.. ..eee.. ..eee.. ...f...',
      '..eee.. ..eee.. ..eee.. .eeeee. ..aea..',
      '....... ....... ....... ..eee.. ..eee..',
      '....... ....... ..g.g.. ..g.g.. .......',
    ]),
  },
  {
    // a black pot over a fire, full to the brim, the stone still in it
    id: 'daily-stone-soup', name: 'Stone Soup', from: 'cand-p19-stone-soup', section: 'secrets', fraction: 0.65, seed: 2,
    story: 'The recipe calls for one stone. The neighbours bring everything else.',
    ...voxels({ a: 0x8a5a3c, b: 0xf6d14a, c: 0x34303c, d: 0xa8a4a0, e: 0x7ed05a, f: 0xf2a03d, g: 0xf0602a }, [
      '....... ...a... ..bab.. .aaaaa. ..bab.. ...a... .......',
      '....... ..ccc.. .ccccc. .ccccc. .ccccc. ..ccc.. .......',
      '...c... .ccccc. .ccccc. ccccccc .ccccc. .ccccc. ...c...',
      '..ccc.. .ccccc. ccccccc ccddccc ccddccc .ccccc. ..ccc..',
      '..ccc.. .ccccc. ccccccc ccddccc ccddccc .ccccc. ..ccc..',
      '...c... .ceffc. .gffgf. cfddffc .fddef. .cfffc. ...c...',
      '....... ....... ....... ..dd... ...d... ....... .......',
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
  // page 19's (added on Daily #2, 1 Nov 2026, so from Daily #3 on). The Sugar Skull's first day is
  // the next day, 2 Nov 2026 (#3); the Squirrel's 1 Nov was already the Piggy Bank's, Daily #2,
  // so its first morning is 1 Nov 2027 (#367), the day after the Black Cat.
  { id: 'daily-sugar-skull', date: '11-02', since: 3 },      // Día de Muertos, the Day of the Dead
  { id: 'daily-cupid', date: '02-14', since: 3 },            // St Valentine's Day
  { id: 'daily-toadstool-frog', date: '09-22', since: 3 },   // the autumn rains: the autumn equinox, about 22 Sep
  { id: 'daily-squirrel-pumpkin', date: '11-01', since: 3 }, // the morning after Halloween
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
  // page 19's 13 undated picks, after page 18's 11, from the first turn on or after Daily #3: the
  // cycle that began on #2 finishes (#13 Sock Monkey, a day later than before, for the Sugar Skull),
  // this era begins on #14 (13 Nov 2026), and the new stones first come on #25-#38 (24 Nov-7 Dec).
  // Their order spreads the sections, Toy Box, Again counted as Toy Box:
  //   ... W T | X T Y S T X R T H S T X C | I ...
  // (X Up to Something, Y Myths of the World, S Storybook, R Nursery Rhymes, H Show Time,
  // C Things With a Secret). The Sleepy Cyclops sits where no year to 2030 puts him next to Cupid
  // on Feb 14; the Squirrel's Nov 1 always falls between two dated days.
  { since: 3, order: [
    'daily-piggy-bank', 'daily-genie', 'daily-troll-doll', 'daily-instant-camera', 'daily-frog-prince', 'daily-cloth-tiger',
    'daily-rabbit-hat', 'daily-sword-stone', 'daily-chicken-crossing', 'daily-baba-yaga-hut', 'daily-sock-monkey',
    'daily-dog-sofa', 'daily-karakuri', 'daily-cyclops', 'daily-puss-in-boots', 'daily-luchador', 'daily-gull-chips',
    'daily-owl-pussycat', 'daily-toy-dinosaur', 'daily-jester', 'daily-dorothys-house', 'daily-pinocchio', 'daily-goat-car',
    'daily-stone-soup',
  ] },
];
