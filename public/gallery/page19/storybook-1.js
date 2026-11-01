// Page 19 · I Storybook: daily stones, fairy tales and fables, one moment from
// each. A stranger plays one from a shared link, so each is a tale you could
// name from across a room, caught at its best-known moment, with a dry turn.
// Palette: Dawn (a rose sky over an apricot horizon), so bodies are strong
// and kept off apricot and mauve: red, grey, gold, purple, pink, brown, blue.
// Every entry is in the daily band (judge() in public/js/daily.js: D 9.5-12,
// 90-180 chisels on the trimmed block, 4-10 waves), with fraction and seed
// written out so the gallery and the daily agree. Authored flat; the game's
// dithered light shades them. Faces and details look toward +z / +x.
//
// Silhouette first. Each idea as name / identity feature that sets the
// outline / the moment / colour parts:
//  kept  Wolf in Grandma's Bed  pointed ears up through a white bonnet, a long
//                               snout over the quilt          "what big teeth"     red quilt, grey wolf, white cap, brown bed
//  kept  Straw House            a pink pig's face filling the door of a
//                               thatched hut                  just before the huff straw, thatch, pink
//  kept  Princess and the Pea   a tall wobbling stack of mattresses, a crown
//                               on top, one pea at the bottom  a sleepless night   three mattress colours, brown bed, green pea
//  kept  Puss in Boots          big cuffed boots below, a plumed hat above      dressed to impress   orange cat, brown boots, red hat, white plume
//  kept  Rapunzel's Tower       a gold plait down the tower's side, piled on
//                               the ground                    let down her hair    grey stone, purple roof, gold plait
//  kept  Gingerbread House      candy canes, gumdrops, white icing, a bite out
//                               of the eaves                  someone's been nibbling  ginger walls, icing, chocolate roof
//  kept  Magic Mirror           an oval gold frame with a face in the glass     about to answer      gold frame, pale glass, dark face
//  kept  Dorothy's House        striped stockings and silver shoes out from
//                               under a farmhouse             just landed          blue boards, brown roof, black-white legs
//  cut   Wolf in Sheep's Clothing  built twice: a white body with a grey head is
//                               just a sheep (sheep have grey faces), and the snout ran to 210 taps
//  cut   Pinocchio              the nose is a 1-cube stick the colour of the face,
//                               lost at 40 px; Toy Box, Again has a Pinocchio now
//  cut   Jack's Beanstalk       a stalk in a pot under a cloud read as a tree or
//                               a cauliflower, and ran to 221 taps
//  cut   Gingerbread Man on the Fox's Nose  the fox side on read as an orange
//                               lump, and the man on its nose was 2 pieces; Gingerbread Pal exists
//  cut   Troll under the Bridge a grey arch with green under it; the goat was 6
//                               cubes, and Stone Troll and three bridges exist
//  cut   Glass Slipper          a pale shape on a red cushion; needs a caption
//  cut   Forty Thieves          built twice: the turban over the jar's rim read as
//                               a lid, then as Genie's head-out-of-a-vessel again
//  cut   Bunbuku Chagama        the tanuki teakettle read as a boar or a hedgehog
//  cut   The Fox and the Grapes a 3-deep profile with the grapes in a second piece;
//                               at 40 px an orange lump by a post
//  out   Three Little Pigs' brick house, a wolf's legs up the chimney: a third
//        wolf and a third house; Bremen Town Musicians: four animals at 2 cubes
//        each; Goldilocks' bowls (food, and three bowls are flat); the poisoned
//        apple (Apple, Toffee Apple, Apple & Worm exist); the tortoise passing the
//        hare (five tortoises exist, and two animals side by side blow the taps)
// Learns from: Wolf, the Raccoon in a Bin and Noah's Ark (the container is the
// joke) and the Frog Prince (the accessory names the twist); Straw House, Baba
// Yaga's Hut (a house with a face) and Rabbit in a Hat (something peeks out);
// Pea, the Piñata (bands of colour are the identity, lit span 2) and the Troll
// Doll (the thing on top); Puss, the Black Cat and the Maneki-neko (a cat
// facing you) and Jumping Jack (a symmetric frontal icon); Rapunzel, the Kraken
// & Lighthouse (one bright thing down a pale tower); Gingerbread House, the
// Piggy Bank (an everyday thing with charm); Magic Mirror, the Fox Mask (a face
// with no head); Dorothy's House, the Melted Snowman (dry humour, just after).
import { grid } from '../voxel.js';
import { INK, sheet } from './kit.js';

// Flat material colours: the game's light does the shading.
const bedWood = 0x7a4a32, quilt = 0xd8434c, wolf = 0x7a7486, bonnet = 0xfbf6ee, ribbon = 0xf08aa0, fang = 0xfbf8f2,
  straw = 0xf0cf6a, thatch = 0xc8903a, pig = 0xf4a0b0, snout = 0xe07890,
  matPink = 0xf08aa0, matBlue = 0x5fb8e0, matYellow = 0xf6d14a, pea = 0x5fc04a, skin = 0xf6c8a0, sheetLilac = 0xb89ae0, crown = 0xf2c14e,
  boot = 0x5a3a32, puss = 0xf2a03d, pussWhite = 0xfbf3e6, hat = 0xb83a48, plume = 0xfbf8f2, pussNose = 0xf07a8a,
  stone = 0xa8a2aa, slate = 0x8a5ac0, plait = 0xf6c63a, plaitDk = 0xe0a83a, bow = 0xe0434b,
  ginger = 0xc0803e, choc = 0x6b3f2a, icing = 0xfbf8f2, gumRed = 0xe0434b, gumGreen = 0x6cc04a, gumYellow = 0xf6d14a, candyDoor = 0xf08aa0,
  frame = 0xd89a3a, glass = 0xbfe0ee,
  boards = 0x8fa6c0, shingle = 0x6b4a3a, pane = 0x4a5a7a, stocking = 0x3a3442, stockingW = 0xfbf8f2, silver = 0xdfe6ee;

export default [
  // Wolf in Grandma's Bed (Little Red Riding Hood). Identity: a wolf's head
  // in Grandma's white bonnet, pointed ears up through it, a long snout out
  // over the quilt. Moment: "what big teeth you have". Parts: red quilt (big),
  // brown bed and headboard (darkest, lowest), grey wolf, white bonnet; two
  // white fangs, pink ribbons and a black nose as accents.
  (() => {
    const g = grid(7, 9, 6);
    g.box([0, 6], [0, 0], [0, 5], bedWood);                                              // the bed
    g.box([0, 6], [1, 6], [0, 0], bedWood).clear(0, 6, 0).clear(6, 6, 0);               // the headboard
    g.box([0, 6], [1, 2], [1, 5], quilt);                                                 // the quilt, to his chin
    g.box([1, 5], [3, 5], [1, 2], wolf);                                                  // the head
    g.box([1, 5], [6, 6], [1, 3], bonnet).set(1, 6, 3, ribbon).set(5, 6, 3, ribbon);     // the bonnet, its brim
    for (const x of [1, 5]) g.set(x, 7, 1, wolf).set(x, 7, 2, wolf).set(x, 8, 1, wolf);  // ears, up through it
    g.box([2, 4], [3, 4], [3, 3], wolf).box([3, 3], [3, 4], [4, 4], wolf);               // the long snout
    g.set(3, 3, 5, wolf).set(3, 4, 5, INK);                                               // its tip, the nose
    g.set(2, 3, 4, fang).set(4, 3, 4, fang);                                              // big teeth
    g.set(2, 5, 2, INK).set(4, 5, 2, INK);                                                // eyes
    return g.entry({ id: 'cand-p19-grandmas-wolf', name: "Wolf in Grandma's Bed", fraction: 0.65, seed: 5, story: 'Grandma is feeling much better. Her ears seem to have grown.' });
  })(),

  // Straw House (the Three Little Pigs). Identity: a pig's pink face filling
  // the doorway of a thatched hut, ears forward. Moment: the knock at the
  // door, just before the huffing. Parts: pale straw walls, darker thatch
  // overhanging (the outline), the pink pig; a darker snout, eyes, and a few
  // straws already lifting off the far side.
  (() => {
    const g = grid(7, 7, 6);
    g.box([1, 5], [0, 3], [1, 4], straw);                                                 // the walls
    g.box([0, 6], [4, 4], [0, 5], thatch).box([1, 5], [5, 5], [1, 4], thatch).box([2, 4], [6, 6], [2, 3], thatch);   // the thatch
    for (const [x, z] of [[0, 0], [6, 0], [0, 5], [6, 5]]) g.clear(x, 4, z);
    g.box([2, 4], [0, 2], [4, 4], pig);                                                   // the pig, in the door
    g.set(3, 1, 5, snout).set(2, 2, 4, INK).set(4, 2, 4, INK);                            // snout, eyes
    g.set(2, 3, 5, pig).set(4, 3, 5, pig);                                                // ears, forward
    g.set(6, 1, 2, straw).set(6, 3, 3, straw).set(6, 2, 1, straw);                        // straws lifting
    return g.entry({ id: 'cand-p19-straw-house', name: 'Straw House', fraction: 0.75, seed: 2, story: 'He was told about bricks. He felt straw had more character.' });
  })(),

  // Princess and the Pea. Identity: a tall, wobbling stack of mattresses on a
  // bed, a crowned princess sitting up on top. Moment: a sleepless night, the
  // pea at the very bottom (green, at the front). Parts: three mattress
  // colours in bands (a pattern, so the softer light), brown bed, lilac
  // quilt; gold crown, eyes and the pea as accents.
  (() => {
    const g = grid(7, 10, 5);
    for (const x of [0, 6]) for (const z of [0, 4]) g.set(x, 0, z, bedWood);             // legs
    g.box([0, 6], [1, 1], [0, 4], bedWood);                                               // the bed
    const mats = [matPink, matBlue, matYellow];
    for (let k = 0; k < 5; k++) {                                                         // five mattresses, wobbling
      const x0 = k % 2 ? 1 : 0;
      g.box([x0, x0 + 5], [2 + k, 2 + k], [0, 4], mats[k % 3]);
    }
    g.set(3, 2, 4, pea);                                                                  // the pea
    g.box([1, 5], [7, 7], [1, 4], sheetLilac);                                            // her quilt
    g.box([2, 4], [7, 8], [1, 2], skin);                                                  // sitting up, wide awake
    g.box([1, 5], [7, 8], [0, 0], bedWood).box([1, 1], [8, 8], [1, 2], bedWood).box([5, 5], [8, 8], [1, 2], bedWood).box([2, 4], [8, 8], [1, 1], bedWood);   // dark hair
    g.set(2, 9, 1, crown).set(3, 9, 1, crown).set(4, 9, 1, crown);                        // the crown
    g.set(2, 8, 2, INK).set(4, 8, 2, INK);                                                // eyes
    return g.entry({ id: 'cand-p19-princess-pea', name: 'Princess and the Pea', fraction: 0.65, seed: 4, lit: { span: 2 }, story: 'Twenty mattresses and one pea. She has not slept a wink.' });
  })(),

  // Puss in Boots. Identity: big cuffed boots at the bottom, a wide plumed hat
  // at the top, a cat between. Moment: dressed up and ready to talk his way
  // into a castle. Parts: orange cat (big), dark brown boots (darkest, lowest),
  // red hat; white chest and muzzle, a white plume, eyes and a pink nose.
  (() => {
    const g = grid(7, 10, 5);
    for (const x0 of [1, 4]) g.box([x0, x0 + 1], [0, 1], [1, 3], boot);                 // the boots
    g.box([0, 2], [2, 2], [1, 3], boot).box([4, 6], [2, 2], [1, 3], boot);               // their cuffs
    g.box([1, 5], [3, 4], [1, 3], puss).box([2, 4], [3, 4], [3, 3], pussWhite);          // the body, a white chest
    for (const y of [3, 4]) g.set(0, y, 2, puss).set(6, y, 2, puss);                     // arms
    g.box([1, 5], [5, 7], [0, 4], puss);                                                  // the head
    for (const x of [1, 5]) g.clear(x, 5, 0).clear(x, 5, 4).clear(x, 7, 0).clear(x, 7, 4);
    g.box([2, 4], [5, 5], [4, 4], pussWhite).set(3, 5, 4, pussNose);                     // muzzle, nose
    g.set(2, 6, 4, INK).set(4, 6, 4, INK);                                                // eyes
    g.box([0, 6], [8, 8], [0, 4], hat).box([2, 4], [9, 9], [1, 3], hat);                 // the hat, brim out wide
    g.set(5, 9, 1, plume).set(6, 9, 1, plume).set(5, 9, 2, plume).set(6, 9, 0, plume);   // the plume
    g.set(6, 5, 0, puss).set(6, 6, 0, puss);                                              // the tail, up behind
    return g.entry({ id: 'cand-p19-puss-in-boots', name: 'Puss in Boots', fraction: 0.65, seed: 1, story: 'He asked for boots. The rest he arranged himself.' });
  })(),

  // Rapunzel's Tower. Identity: a gold plait from the top window down the
  // tower's side, with plenty left over on the ground. Moment: "let down your
  // hair". Parts: grey stone (big, rounded corners), purple roof, gold plait
  // in two golds (a pattern, so the softer light); her face at the window
  // and a red bow.
  (() => {
    const g = grid(7, 10, 5);
    g.box([0, 4], [0, 6], [0, 4], stone);                                                 // the tower
    for (const x of [0, 4]) for (const z of [0, 4]) g.box([x, x], [0, 6], [z, z], 0);    // rounded corners
    g.box([0, 4], [7, 7], [0, 4], slate).box([1, 3], [8, 8], [1, 3], slate).set(2, 9, 2, slate);   // the roof
    g.set(4, 5, 2, skin).set(4, 6, 2, plait).set(4, 5, 1, plait).set(4, 5, 3, plait);    // her face at the window
    g.box([5, 5], [1, 5], [2, 3], (x, y, z) => (y % 2 ? plait : plaitDk));         // the plait, let down
    g.box([5, 6], [0, 0], [1, 4], plait).set(6, 0, 1, 0).set(5, 1, 4, bow);              // and some to spare
    return g.entry({ id: 'cand-p19-rapunzel', name: "Rapunzel's Tower", fraction: 0.65, seed: 1, lit: { span: 2 }, story: 'There is a door round the back. Nobody has ever checked.' });
  })(),

  // Gingerbread House (Hansel and Gretel). Identity: a ginger cottage with
  // candy canes at the door, gumdrops on the roof and white icing on every
  // edge. Moment: someone has been nibbling (a bite out of the eaves, on the
  // left of the outline). Parts: ginger walls, chocolate roof, white icing;
  // red, green and yellow sweets and a pink door as accents.
  (() => {
    const g = grid(7, 8, 6);
    g.box([1, 5], [0, 3], [1, 4], ginger);                                                // the walls
    for (const x of [1, 5]) g.box([x, x], [0, 3], [4, 4], icing);                        // piped corners
    g.box([0, 6], [4, 4], [0, 5], icing).box([0, 6], [5, 5], [1, 4], choc).box([0, 6], [6, 6], [2, 3], icing);   // the roof
    g.set(4, 7, 2, gumRed).set(4, 7, 3, gumRed);                                          // a chimney of sweets
    g.set(3, 0, 4, candyDoor).set(3, 1, 4, candyDoor);                                    // the door
    g.set(1, 5, 4, gumRed).set(3, 5, 4, gumGreen).set(5, 5, 4, gumYellow).set(2, 5, 1, gumYellow).set(4, 5, 1, gumGreen);   // gumdrops
    for (const x of [2, 4]) g.set(x, 0, 5, gumRed).set(x, 1, 5, icing).set(x, 2, 5, gumRed);   // candy canes by the door
    g.clear(0, 4, 5).clear(1, 4, 5).clear(0, 4, 4).clear(0, 5, 4).clear(0, 4, 3);       // the bite
    return g.entry({ id: 'cand-p19-gingerbread-house', name: 'Gingerbread House', fraction: 0.7, seed: 2, story: 'Lovely old cottage. Someone has been eating the drainpipe.' });
  })(),

  // Magic Mirror (Snow White). Identity: an oval gold frame on a foot, a face
  // looking out of the glass. Moment: the morning question, about to be
  // answered. Parts: gold frame (the outline), pale blue glass; the face in
  // dark accents (eyes and a straight mouth).
  (() => {
    const g = grid(7, 10, 3);
    sheet(g, [
      '..FFF..',
      '.FGGGF.',
      'FGGGGGF',
      'FGGGGGF',
      'FGGGGGF',
      'FGGGGGF',
      '.FGGGF.',
      '..FFF..',
      '...F...',
      '.FFFFF.',
    ], [0, 1], { F: frame, G: glass });
    g.box([1, 5], [0, 0], [0, 2], frame);                                                 // the foot
    g.set(2, 6, 1, INK).set(4, 6, 1, INK).box([2, 4], [4, 4], [1, 1], INK);              // the face in the glass
    return g.entry({ id: 'cand-p19-magic-mirror', name: 'Magic Mirror', fraction: 0.65, seed: 5, story: 'Asked the same question every morning. It has stopped being tactful.' });
  })(),

  // Dorothy's House (The Wonderful Wizard of Oz, 1900). Identity: two legs in
  // striped stockings and silver shoes (the book's, not the film's ruby) out
  // from under a farmhouse, on the right of the outline. Moment: just landed
  // from Kansas. Parts: blue-grey boards (big), brown roof; black-and-white
  // stockings, silver shoes, a door and dark windows.
  (() => {
    const g = grid(9, 7, 5);
    g.box([0, 4], [0, 3], [0, 4], boards);                                                // the house
    g.box([0, 4], [4, 4], [0, 4], shingle).box([0, 4], [5, 5], [1, 3], shingle).box([0, 4], [6, 6], [2, 2], shingle);   // the roof
    g.set(2, 0, 4, bedWood).set(2, 1, 4, bedWood).set(1, 2, 4, pane).set(3, 2, 4, pane).set(4, 2, 2, pane);   // door, windows
    for (const z of [1, 3]) {                                                             // the legs from under it
      for (const x of [5, 6, 7]) g.set(x, 0, z, x % 2 ? stockingW : stocking);
      g.set(8, 0, z, silver).set(8, 1, z, silver);                                        // silver shoes, toes up
    }
    return g.entry({ id: 'cand-p19-dorothys-house', name: "Dorothy's House", fraction: 0.7, seed: 2, story: 'It came down in the land of the Munchkins. The welcome was mixed.' });
  })(),
];
