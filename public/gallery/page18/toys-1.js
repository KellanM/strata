// Page 18 · V Toy Box: daily stones, folk toys and toys from everywhere,
// each with a face or a moment. A stranger plays one from a shared link, so
// each is a toy you'd know from across a room, caught doing its one thing.
// Palette: Festival (indigo to wine, so bodies stay light and warm: brown,
// tan, red, gold, pink, orange). Every entry is in the daily band (judge()
// in public/js/daily.js: D 9.5-12, 90-180 chisels on the trimmed block,
// 4-10 waves), with fraction and seed written out so the gallery and the
// daily agree.
//
// Silhouette first. Each idea as name / identity feature that sets the
// outline / the moment / colour parts:
//  kept  Cymbal Monkey    two gold cymbals held out at full width        about to clash             brown, red waistcoat, gold
//  kept  Noah's Ark       giraffe necks up through the roof              the giraffes didn't fit    brown hull, cream house, red roof, yellow
//  kept  Chattering Teeth an open mouth on two big feet                  mid-chatter, mid-step      pink gums, white teeth, orange feet
//  kept  Troll Doll       a pink tuft of hair as tall as its head        hair on end                tan, hot pink, green felt
//  kept  Cloth Tiger      a big striped head on stub legs, tail up       guarding the cot           orange, black stripes, white muzzle
//  kept  Piñata           a donkey in paper bands, ears up               party day                  pink, yellow, blue, green bands
//  kept  Sock Monkey      the red heel for a mouth on a cream muzzle      sat where you left it      heather brown, cream, red
//  kept  Jumping Jack     arms up, legs out, the string hanging below    the string just pulled     red suit, white face, blue cap
//  cut   Rag Doll         built twice: a red nose made her a clown, and
//                         the yarn hair became a red helmet; at 40 px a red block on a blue one
//  out   Matryoshka peeking, Spinning Top, Wind-up Robot, chewed Teddy, Kendama,
//        Toy Sailboat: Nesting Doll, Spinning Top, Tin Robot, Teddy Bear, Kendama
//        and Sailboat exist
//  out   Rocking Duck     Rocking Horse failed three times on this page (the head
//                         and neck merge), and the Rubber Duck is this page's duck
//  out   Pull-along Dog   Dachshund exists, and Rabbit Lantern owns animal-on-wheels
//  out   Dymkovo Horse    Dala Horse owns the painted folk horse
//  out   Alebrije         a hybrid creature in dots needs a caption; at 40 px a spotted dragon
//  out   Slinky on a Stair the arc leaves the block hollow (200+ taps), and a
//                         striped arch over steps reads as a rainbow
//  out   Drinking Bird    the dipping neck is a 1-cube diagonal staircase into the glass
//  out   Trapeze Acrobat  two 1-thick posts and a 6-cube figure
//  out   Pecking Hens     Chicken Crossing's white hen and red comb, four times smaller
//  out   Stacking Rings   five ramped colours and no face
//  out   Yo-yo            too thin
// Learns from: Cymbal Monkey, the Maneki-neko (the action limb on the
// outline) and the Pegasus Foal (the identity at the full width); Ark, the
// Raccoon in a Bin (the container is the joke); Teeth, the Fox Mask (a face
// with no head, toward the game corner); Troll, the Basket Dog (the thing on
// top sets the outline) and the Kokeshi (big head, colour blocks); Tiger, the
// Akabeko (a folk animal side on, its face at the +x end); Piñata, the Dala
// Horse (a profile sheet, the folk paint is the identity); Sock Monkey, the
// Basket Dog (a sitting charm, one red accent that names it); Jumping Jack,
// the Genie (arms flung up) and the Kokeshi (a symmetric frontal icon).
// Faces and details look toward +z / +x.
import { grid } from '../voxel.js';
import { INK, tint, sheet } from './kit.js';

// Flat material colours: the game's light does the shading.
const fur = 0xa8693f, vest = 0xe0434b, brass = 0xf2c14e, boss = 0xc0802c, chimpFace = 0xf2c49c, tooth = 0xfbf8f2,
  hull = 0x9a5a38, house = 0xf6ecd8, roof = 0xd8433c, giraffe = 0xf2c14e, horn = 0x6b4a3a, door = 0x4a3a4a,
  gum = 0xf08aa0, throat = 0x4a3a4a, tongue = 0xd83c4a, shoe = 0xf2a03d,
  skin = 0xf0b98c, trollHair = 0xf25fa8, felt = 0x6cc04a, trollNose = 0xe07a62,
  tiger = 0xf29a3a, tigerWhite = 0xfbf3e6, tigerNose = 0xd8343c,
  pPink = 0xf25fa8, pYellow = 0xf6d14a, pBlue = 0x4fc3e8, pGreen = 0x7ed05a,
  heather = 0x9a8c7c, sockCream = 0xf6efe0, heel = 0xd8343c,
  jackRed = 0xe0434b, jackYellow = 0xf6c63a, jackFace = 0xfbf3e6, jackBlue = 0x4f86cf, string = 0xf6efe0;

export default [
  // Cymbal Monkey (the Japanese tin chimp). Identity: two gold cymbals held
  // out at arm's length, setting the full width. Moment: wound up, cymbals
  // apart, about to clash. Parts: brown fur, a red waistcoat, gold cymbals
  // with a darker boss; a peach face with a wide white grin.
  (() => {
    const g = grid(9, 9, 3);
    for (const x of [3, 5]) g.box([x, x], [0, 1], [1, 1], fur).set(x, 0, 2, fur);        // legs, feet forward
    g.box([3, 5], [2, 4], [0, 2], vest);                                                  // the red waistcoat
    g.set(2, 4, 1, fur).set(1, 4, 1, fur).set(6, 4, 1, fur).set(7, 4, 1, fur);            // arms, out wide
    for (const x of [0, 8]) {                                                             // the cymbals, apart
      g.box([x, x], [1, 5], [0, 2], brass);
      g.clear(x, 1, 0).clear(x, 1, 2).clear(x, 5, 0).clear(x, 5, 2).set(x, 3, 1, boss);
    }
    g.box([2, 6], [5, 8], [0, 2], fur);                                                   // the head
    for (const x of [2, 6]) g.clear(x, 8, 0).clear(x, 8, 2).clear(x, 5, 0);
    g.box([3, 5], [5, 7], [2, 2], chimpFace);                                             // the face
    g.box([3, 5], [5, 5], [2, 2], tooth);                                                 // the grin
    g.set(3, 6, 2, INK).set(5, 6, 2, INK);                                                // eyes
    for (const y of [6, 7]) g.set(1, y, 1, chimpFace).set(7, y, 1, chimpFace);            // ears
    return g.entry({ id: 'cand-p18-cymbal-monkey', name: 'Cymbal Monkey', fraction: 0.65, seed: 2, story: 'It knows one song. It prefers to play it at three in the morning.' });
  })(),

  // Noah's Ark (the wooden toy ark). Identity: a hull and a house, two
  // giraffe necks up through the roof. Moment: everyone aboard, and the
  // giraffes didn't fit. Parts: brown hull (darkest, lowest), cream house,
  // red roof, yellow giraffes; a dark door and ossicones.
  (() => {
    const g = grid(10, 10, 3);
    g.box([2, 7], [0, 0], [1, 1], hull).box([1, 8], [1, 1], [0, 2], hull).box([0, 9], [2, 2], [0, 2], hull);   // the hull
    g.set(0, 3, 1, hull).set(9, 3, 1, hull);                                              // bow and stern
    g.box([2, 6], [3, 4], [0, 2], house).set(4, 3, 2, door);                              // the house, its door
    g.box([1, 7], [5, 5], [0, 2], roof).box([2, 6], [6, 6], [1, 1], roof);                // the roof
    for (const [x, h] of [[2, 8], [5, 7]]) {                                              // two giraffes, out through it
      g.box([x, x], [6, h], [1, 1], giraffe);                                           // the neck
      g.set(x + 1, h, 1, giraffe).set(x, h + 1, 1, horn);                               // the head, an ossicone
    }
    return g.entry({ id: 'cand-p18-noahs-ark', name: "Noah's Ark", fraction: 0.65, seed: 5, story: 'Two of everything. The giraffes were always going to be a problem.' });
  })(),

  // Chattering Teeth (the wind-up joke). Identity: a mouth wide open toward
  // you, on two big orange feet. Moment: mid-chatter, one foot ahead of the
  // other. Parts: pink gums (big), white teeth top and bottom, orange feet;
  // a dark throat and a red tongue inside, found by peeling.
  (() => {
    const g = grid(7, 8, 6);
    g.box([0, 2], [0, 0], [1, 5], shoe).box([4, 6], [0, 0], [0, 4], shoe);                // feet, mid-step
    g.box([0, 6], [1, 1], [0, 4], gum).clear(0, 1, 4).clear(6, 1, 4);                     // the lower gum
    g.box([0, 6], [2, 5], [0, 0], gum).box([1, 5], [2, 5], [1, 1], throat);               // the hinge, the throat
    g.box([1, 5], [2, 2], [2, 3], tongue);                                                // the tongue
    for (const y of [2, 5]) {                                                             // two rows of teeth
      g.box([1, 5], [y, y], [4, 4], tooth);
      g.box([0, 0], [y, y], [1, 3], tooth).box([6, 6], [y, y], [1, 3], tooth);
    }
    g.box([0, 6], [6, 6], [0, 4], gum).clear(0, 6, 4).clear(6, 6, 4);                     // the upper gum
    g.box([1, 5], [7, 7], [0, 3], gum);
    return g.entry({ id: 'cand-p18-chattering-teeth', name: 'Chattering Teeth', fraction: 0.7, seed: 3, story: 'Wind it once and it talks all the way across the table.' });
  })(),

  // Troll Doll (the Danish good-luck troll). Identity: a tuft of hot pink
  // hair straight up, as tall as the head, narrowing to a point. Moment: hair
  // on end, as it has been since 1959. Parts: tan body, pink hair, green
  // felt tunic over a pot belly; eyes and a snub nose, ears out, big flat feet.
  (() => {
    const g = grid(7, 10, 4);
    g.box([1, 2], [0, 0], [1, 3], skin).box([4, 5], [0, 0], [1, 3], skin);                // big flat feet
    g.box([1, 5], [1, 2], [0, 2], felt).box([2, 4], [1, 2], [3, 3], felt);                // the felt tunic, a pot belly
    for (const z of [0, 2]) g.clear(1, 2, z).clear(5, 2, z);
    g.box([0, 0], [1, 2], [1, 1], skin).box([6, 6], [1, 2], [1, 1], skin);                // arms at its sides
    g.box([1, 5], [3, 5], [0, 3], skin);                                                  // the head
    for (const x of [1, 5]) g.clear(x, 3, 3).clear(x, 3, 0);
    g.set(2, 4, 3, INK).set(4, 4, 3, INK).set(3, 3, 3, trollNose);                        // eyes, a snub nose
    g.set(0, 4, 1, skin).set(0, 4, 2, skin).set(6, 4, 1, skin).set(6, 4, 2, skin);        // ears
    g.box([1, 5], [6, 6], [0, 3], trollHair);                                             // the hair, straight up
    g.box([1, 5], [7, 7], [0, 2], trollHair).box([2, 4], [8, 8], [0, 2], trollHair);
    g.box([2, 4], [9, 9], [1, 1], trollHair).set(3, 9, 0, trollHair);
    for (const x of [1, 5]) g.clear(x, 6, 3).clear(x, 7, 0).clear(x, 7, 2);
    return g.entry({ id: 'cand-p18-troll-doll', name: 'Troll Doll', fraction: 0.7, seed: 3, story: 'Its hair has stood on end since 1959. It will not say why.' });
  })(),

  // Cloth Tiger (bu laohu, the Chinese baby's guardian). Identity: a head as
  // big as the body, round eyes and the mark on its brow, on stub legs, tail
  // up. Moment: on guard by the cot. Parts: orange cloth with black stripes
  // (a pattern, so the softer light), a white muzzle; a red nose.
  (() => {
    const g = grid(9, 7, 5);
    for (const x of [1, 4]) for (const z of [0, 4]) g.box([x, x], [0, 1], [z, z], tiger); // stub legs
    g.box([0, 5], [2, 4], [0, 4], tiger);                                                 // the body
    for (const z of [0, 4]) g.clear(0, 4, z).clear(5, 4, z);
    g.box([5, 8], [1, 5], [0, 4], tiger);                                                 // the big head
    for (const [y, z] of [[5, 0], [5, 4], [1, 0], [1, 4]]) g.clear(8, y, z);
    g.set(5, 6, 0, tiger).set(5, 6, 4, tiger).set(6, 6, 0, tiger).set(6, 6, 4, tiger);    // ears
    g.box([8, 8], [1, 2], [1, 3], tigerWhite).set(8, 2, 2, tigerNose);                    // the white muzzle, the nose
    for (const z of [1, 3]) g.set(8, 3, z, tigerWhite).set(8, 4, z, INK);                 // big round eyes
    g.set(8, 5, 2, INK).set(8, 4, 2, INK).set(8, 3, 2, INK);                              // the mark on its brow
    tint(g, (x, y) => x <= 4 && x % 2 === 1 && y >= 2, INK);                              // stripes
    g.set(0, 5, 2, tiger).set(0, 6, 2, INK).set(1, 6, 2, tiger);                          // the tail, up
    return g.entry({ id: 'cand-p18-cloth-tiger', name: 'Cloth Tiger', fraction: 0.65, seed: 10, lit: { span: 2 }, story: 'Sewn to keep bad dreams off the baby. No dream has tried it.' });
  })(),

  // Piñata (the paper donkey). Identity: a donkey in stripes of paper
  // fringe, neck and ears up. Moment: party day, waiting to be the guest of
  // honour. Parts: four paper colours in bands round the body (a pattern,
  // so the softer light); eyes on the face toward +x.
  (() => {
    const g = grid(8, 9, 4);
    sheet(g, [
      '.....P.P',
      '.....PPP',
      '.....PPP',
      '.....PP.',
      'PPPPPPP.',
      'PPPPPP..',
      'PPPPPP..',
      '.P..P...',
      '.P..P...',
    ], [0, 3], { P: pPink });
    for (const x of [1, 4]) g.clear(x, 0, 1).clear(x, 0, 2).clear(x, 1, 1).clear(x, 1, 2);   // four legs
    for (const z of [1, 2]) g.clear(5, 8, z).clear(7, 8, z);                               // ears, a pair each side
    g.clear(5, 5, 0).clear(5, 5, 3).clear(6, 5, 0).clear(6, 5, 3);                         // the neck
    const bands = [pPink, pYellow, pBlue, pGreen];
    tint(g, () => true, (x, y) => bands[y % 4]);                                          // the paper fringe, in bands
    g.set(7, 7, 0, INK).set(7, 7, 3, INK);                                                // eyes
    g.set(0, 5, 1, pGreen).set(0, 5, 2, pBlue);                                           // the tail
    return g.entry({ id: 'cand-p18-pinata', name: 'Piñata', fraction: 0.65, seed: 10, lit: { span: 2 }, story: 'Guest of honour at every party. It has never once stayed for cake.' });
  })(),

  // Sock Monkey (sewn from a pair of work socks). Identity: the red heel for
  // a mouth on a cream muzzle, ears out. Moment: sat where you left it, legs
  // out, white toes up. Parts: heather brown body and head, cream muzzle,
  // toes and ears; the red heel and two button eyes as accents.
  (() => {
    const g = grid(7, 8, 6);
    g.box([1, 5], [0, 3], [0, 2], heather);                                               // the body, sitting
    for (const x of [1, 5]) g.box([x, x], [0, 0], [3, 4], heather).set(x, 0, 5, sockCream);   // legs out, white toes
    g.box([0, 0], [1, 3], [1, 1], heather).box([6, 6], [1, 3], [1, 1], heather);          // long arms
    g.box([1, 5], [4, 7], [0, 3], heather);                                               // the head
    for (const x of [1, 5]) g.clear(x, 7, 0).clear(x, 7, 3);
    g.box([2, 4], [4, 5], [4, 4], sockCream).box([2, 4], [4, 4], [4, 4], heel);           // the muzzle, the red heel
    g.set(2, 6, 3, INK).set(4, 6, 3, INK);                                                // button eyes
    g.set(0, 5, 2, sockCream).set(0, 6, 2, sockCream).set(6, 5, 2, sockCream).set(6, 6, 2, sockCream);   // ears
    return g.entry({ id: 'cand-p18-sock-monkey', name: 'Sock Monkey', fraction: 0.7, seed: 3, story: 'Made from one pair of work socks. It still smells faintly of boots.' });
  })(),

  // Jumping Jack (the Hampelmann). Identity: a flat wooden clown with arms
  // up and legs flung out, the string hanging below. Moment: the string just
  // pulled. Parts: red suit, white face, blue cap; yellow hands, feet,
  // pompom and buttons; a red bead on a pale string.
  (() => {
    const g = grid(9, 10, 2);
    sheet(g, [
      '....Y....',
      '...BBB...',
      '.Y.FFF.Y.',
      '.R.FFF.R.',
      '.RRRRRRR.',
      '...RRR...',
      '..RR.RR..',
      '.RR...RR.',
      'YR.....RY',
      '...rrr...',
    ], [0, 1], { B: jackBlue, F: jackFace, R: jackRed, Y: jackYellow, r: jackRed });
    g.set(3, 7, 1, INK).set(5, 7, 1, INK).set(4, 6, 1, jackRed);                          // eyes, a red nose
    g.set(4, 4, 1, jackYellow).set(4, 5, 1, jackYellow);                                  // pompom buttons
    g.set(4, 3, 1, string).set(4, 2, 1, string).set(4, 1, 1, string);                     // the string, pulled
    return g.entry({ id: 'cand-p18-jumping-jack', name: 'Jumping Jack', fraction: 0.65, seed: 2, story: 'Pull the string and he jumps for joy. He has no other setting.' });
  })(),
];
