// Page 19 · III Myths of the World: daily stones, creatures and marvels
// from the world's old stories. A stranger opens one from a shared link, so
// each is a thing you'd name from across a room, with one twist on the
// story everyone half knows: the leprechaun is hiding in his own gold, the
// cyclops has one eye and it is nearly shut. Charming, never fearsome.
// Sky: Night (deep navy to periwinkle), so bodies stay light or warm.
// Every entry is in the daily band (judge() in public/js/daily.js: D 9.5-12,
// 90-180 chisels on the trimmed block, 4-10 waves), with fraction and seed
// written out so the gallery and the daily agree. Authored flat; the game's
// dithered light shades them. Faces and details look toward +z / +x.
//
// Silhouette first. Each idea as name / identity feature that sets the
// outline / the moment / colour parts:
//  kept  Leprechaun's Gold  a green hat with a buckle on a heap of gold      hiding in his own pot,     iron pot, gold, green hat
//                           spilling over a cauldron's rim                  eyes just above the coins
//                           (dated: 17 March, St Patrick's Day)
//  kept  Sleepy Cyclops     one big eye, the lid half down, in a big head   nodding off at bedtime     tan, blue nightcap and pyjamas, white eye
//  kept  Bigfoot            mid-stride side on, face turned to you,         the famous frame           brown fur, tan feet and face
//                           two big bare feet set the base
//  kept  Jiangshi           arms straight out, a yellow paper charm         hopping along              teal robe, pale face, black cap, yellow charm
//                           hanging from the cap
//  kept  Cupid              a chubby cherub, wings at the full width,       holding the heart he'll    peach, white wings, gold curls, red heart
//                           a red heart held out to you                     aim at somebody
//                           (dated: 14 February, St Valentine's Day)
//  kept  Minotaur Calf      a sitting bull calf, horns out to the full      Ariadne's ball of thread   chestnut, ivory horns, pink nose, gold ring, red ball
//                           width, the red ball in its lap                  has become a toy
//  kept  Cat Mummy          an Egyptian cat mummy's bottle shape and        awake: green eyes open,    linen bands, green eyes, one orange paw
//                           pointed ears, in banded linen                   one paw out of the wraps
//  kept  Lamassu            a winged bull with a bearded man's head and     on guard, head to you,     cream stone, gold wings, dark beard, lapis crown
//                           a tall crown, wings up to the top corner        on its famous five legs
//  cut   Golden Fleece      built 3, and it read at once as a gold ram with curled horns; but page 10's
//                           Hill Ram is that same front-on ram, and Rhymes has Baa Baa Black Sheep
//  cut   Kasa-obake         built 2: the one-eyed umbrella read as a red parrot (page 16's Karakasa
//                           failed 4 builds too), and Weather has a Kasa-obake
//  cut   Medusa in shades   built 2: the snake hair read as green punk hair, then as a pot plant with
//                           red berries; 237 taps
//  cut   Thor's Hammer      built 1: the grey head merged into its grey rock, and the air round the
//                           handle is 181 taps
//  cut   Sleipnir           built 3: eight legs read as a bench under a goat, then a llama
//  cut   Tiangou            built 4 (the dog who eats the moon): a crescent in its mouth read as tusks,
//                           then handlebars; a round moon as a tennis ball; orange read as fox, grey as koala
//  cut   Cerberus Pup       built 1: the outward-looking side heads made one lumpy brown band, as on page 18
//  cut   Anansi             built 3: legs over his story pot read as a brown lid; standing over it, a crab
//                           or a table; 213 taps
//  cut   Boto in a Hat      built 1 (the Amazon dolphin who goes to parties): a pink chess piece in a hat
//  out   Griffin chick, Phoenix, Pegasus, Unicorn, Kraken, Sphinx, Genie, Yeti, Golem, Oni, Moon Rabbit,
//        Walking Moai (Moai is a level), Drop Bear (Koala is a level): exist
//  out   Trojan Horse       Secrets has it
//  out   Minotaur in a maze a readable maze is a 9x9 floor, some 300 cells; the calf keeps the thread instead
//  out   Atlas              a globe on a small figure is 245 taps of air, and Globe exists
//  out   World Serpent      a ring is an enclosed hole and about 70 taps
//  out   Centaur, Thunderbird  long or wide and thin; Qilin reads as a unicorn
//  out   Will-o'-the-wisp   Lantern Ghost and a dozen lanterns; Pandora's Box and Basilisk need a caption
// Learns from: Leprechaun, Rabbit in a Hat and the Raccoon in a Bin (the
// container is the joke, the hat is the identity); Cyclops, the Kokeshi (a
// big head, colour blocks) and Sugimori's one motif (the eye is the only
// white); Bigfoot, the Meerkat Lookout (the pose is the identity) and
// Chicken Crossing (caught mid-crossing); Jiangshi, the Genie (the arms on the outline); Cupid, the
// Pegasus Foal (wings at the full width, a symmetric frontal icon);
// Minotaur Calf, the Cloth Tiger and Sock Monkey (a sitting toy with a face)
// and the Jackalope (horns to the full width); Cat Mummy, the Haniwa (an old
// artefact with a face) and the Black Cat; Lamassu, the Sphinx (a guardian
// with a face) and the Akabeko (a folk animal side on, face to the corner).
import { grid } from '../voxel.js';
import { INK, pair, pairZ, front, tint } from './kit.js';

// fill the cells of one y layer inside an oval round (cx, cz)
const oval = (g, y, rx, rz, c, cx = (g.dims[0] - 1) / 2, cz = (g.dims[2] - 1) / 2) => {
  const [X, , Z] = g.dims;
  for (let z = 0; z < Z; z++) for (let x = 0; x < X; x++)
    if (((x - cx) / rx) ** 2 + ((z - cz) / rz) ** 2 <= 1) g.set(x, y, z, c);
  return g;
};

// Flat material colours: the game's light does the shading.
const iron = 0x5d6670, gold = 0xf2c14e, hatGreen = 0x3fae5a, band = 0x3a3442, buckle = 0xfff0a0, skin = 0xf0b98c,
  eyeW = 0xfbf8f2, cySkin = 0xeaa878, lid = 0xb86a5a, cap = 0x4f86cf, pom = 0xfbf8f2,
  horn = 0xf6ead6, hoofDk = 0x4a3a4a,
  fur = 0x8a5a3c, sole = 0xe0b88a,
  shoe = 0x3a3442, robe = 0x3f8a9a, badge = 0xf2c14e, ghoul = 0xd8ecc8, qingHat = 0x3a3442, hatKnob = 0xe0434b, talisman = 0xf6d14a,
  cherub = 0xf6c6a8, wing = 0xfbf8f2, curls = 0xf2c14e, heart = 0xe0434b, nappy = 0xf6efe0,
  bull = 0xa8693f, calfNose = 0xf2b2a0, ring = 0xf2c14e, thread = 0xe0434b, tuft = 0x6b4a3a,
  linen = 0xeee0c0, linenDk = 0xc8a878, catEye = 0x5fc04a, catNose = 0xf08aa0, tabby = 0xf2a03d,
  lamStone = 0xe8d8bc, lamHoof = 0x8a7a6a, feather = 0xf2c14e, beard = 0x4a3a4a, lapis = 0x3f6fc4;

export default [
  // Leprechaun's Gold (Ireland; dated: 17 March, St Patrick's Day). Identity:
  // a green hat with a black band and gold buckle, sat on a heap of gold that
  // bulges over a cauldron's rim. Moment: he is hiding in his own pot, two
  // eyes just above the coins under the brim. Parts: iron pot (darkest, low),
  // gold, green hat; buckle and eyes.
  (() => {
    const g = grid(7, 9, 5);
    for (const x of [1, 5]) for (const z of [1, 3]) g.set(x, 0, z, iron);
    oval(g, 1, 3.0, 2.0, iron); oval(g, 2, 3.5, 2.5, iron);
    oval(g, 3, 3.0, 2.0, iron); oval(g, 3, 2.0, 1.2, gold);
    oval(g, 4, 3.5, 2.5, gold); oval(g, 5, 2.4, 1.6, gold);
    g.box([2, 4], [5, 5], [1, 3], skin).set(2, 5, 3, INK).set(4, 5, 3, INK);
    g.box([1, 5], [6, 6], [0, 4], hatGreen);
    for (const x of [1, 5]) for (const z of [0, 4]) g.clear(x, 6, z);
    g.box([2, 4], [7, 8], [1, 3], hatGreen).box([2, 4], [7, 7], [1, 3], band).set(3, 7, 3, buckle);
    return g.entry({ id: 'cand-p19-leprechaun', name: "Leprechaun's Gold", fraction: 0.6, seed: 3, story: "He isn't hiding. He's counting, and he keeps losing his place." });
  })(),

  // Sleepy Cyclops (Greece). Identity: one big eye in the middle of a big
  // head, the only white on him, its lid half down. Moment: bedtime, nodding
  // off, the nightcap's tip flopped over to one side. Parts: tan head, blue
  // nightcap and pyjamas, the white eye; a white pompom.
  (() => {
    const g = grid(7, 10, 5);
    g.box([1, 5], [0, 1], [0, 3], cap).set(2, 0, 4, cySkin).set(4, 0, 4, cySkin);
    g.set(0, 1, 2, cySkin).set(6, 1, 2, cySkin);
    g.box([1, 5], [2, 7], [1, 4], cySkin);
    for (const x of [1, 5]) for (const y of [2, 7]) for (const z of [1, 4]) g.clear(x, y, z);
    g.box([2, 4], [3, 5], [4, 4], eyeW).set(3, 4, 4, INK).box([2, 4], [6, 6], [4, 4], lid);
    g.box([1, 5], [8, 8], [1, 4], cap).box([2, 4], [9, 9], [2, 3], cap);
    g.set(5, 9, 2, cap).set(6, 9, 2, cap).set(6, 8, 2, cap).set(6, 7, 2, cap).set(6, 6, 2, pom);
    return g.entry({ id: 'cand-p19-cyclops', name: 'Sleepy Cyclops', fraction: 0.65, seed: 7, story: 'He counts his sheep every night. He keeps dozing off at one.' });
  })(),

  // Bigfoot (North America). Identity: a big hairy walker mid-stride, side
  // on, face turned to the camera; two big bare feet set the base. Moment:
  // the famous frame from 1967. Parts: brown fur, tan feet, hands and face;
  // eyes. The stride is the notch between the legs.
  (() => {
    const g = grid(8, 9, 4);
    g.box([0, 3], [0, 0], [0, 1], sole).box([4, 7], [0, 0], [2, 3], sole);
    g.box([2, 3], [1, 2], [0, 1], fur).box([4, 5], [1, 2], [2, 3], fur);
    g.box([2, 6], [3, 6], [0, 3], fur);
    for (const x of [2, 6]) for (const y of [3, 6]) for (const z of [0, 3]) g.clear(x, y, z);
    g.box([3, 5], [7, 8], [1, 3], fur).clear(3, 8, 1).clear(5, 8, 1);
    g.box([3, 5], [7, 7], [3, 3], sole).set(3, 8, 3, sole).set(5, 8, 3, sole).set(3, 7, 3, INK).set(5, 7, 3, INK);
    g.box([7, 7], [4, 6], [1, 2], fur).set(7, 3, 2, sole);
    g.box([1, 1], [4, 6], [1, 2], fur).set(1, 3, 1, sole);
    return g.entry({ id: 'cand-p19-bigfoot', name: 'Bigfoot', fraction: 0.65, seed: 1, story: "He isn't camera-shy. He just has somewhere to be." });
  })(),

  // Jiangshi (China), the hopping ghost. Identity: arms straight out ahead,
  // a yellow paper charm hanging from the cap over the face. Moment: hopping
  // along, feet together. Parts: teal robe with a gold rank badge, pale green
  // face and hands, black cap with a red knob, the yellow charm.
  (() => {
    const g = grid(7, 10, 3);
    g.box([0, 2], [0, 0], [0, 2], shoe);
    g.box([0, 2], [1, 6], [0, 2], robe);
    g.box([2, 2], [3, 4], [1, 1], badge);
    g.box([3, 5], [6, 6], [0, 0], robe).box([3, 5], [6, 6], [2, 2], robe);
    g.set(6, 6, 0, ghoul).set(6, 6, 2, ghoul);
    g.box([0, 2], [7, 8], [0, 2], ghoul);
    g.set(2, 8, 0, INK).set(2, 8, 2, INK);
    g.box([0, 2], [9, 9], [0, 2], qingHat).set(1, 9, 1, hatKnob);
    g.box([3, 3], [6, 8], [1, 1], talisman);
    return g.entry({ id: 'cand-p19-jiangshi', name: 'Jiangshi', fraction: 0.8, seed: 8, story: 'The paper charm keeps him calm. Please do not open a window.' });
  })(),

  // Cupid (Rome; dated: 14 February, St Valentine's Day). Identity: a chubby
  // cherub, white wings at the full width, a red heart held out to you.
  // Moment: choosing whom to aim at next. Parts: peach baby (head bigger
  // than body), gold curls, white wings; the red heart, eyes.
  (() => {
    const g = grid(9, 8, 4);
    g.set(3, 0, 1, cherub).set(5, 0, 1, cherub);
    g.box([3, 5], [1, 3], [0, 2], cherub).box([3, 5], [1, 1], [0, 2], nappy);
    g.set(3, 3, 3, heart).set(5, 3, 3, heart).box([3, 5], [2, 2], [3, 3], heart).set(4, 1, 3, heart);
    g.box([2, 6], [4, 6], [0, 3], cherub);
    for (const x of [2, 6]) g.clear(x, 4, 0).clear(x, 4, 3).clear(x, 6, 3);
    g.box([2, 6], [7, 7], [0, 2], curls).box([2, 6], [6, 6], [0, 0], curls).set(2, 6, 3, curls).set(6, 6, 3, curls);
    g.set(3, 5, 3, INK).set(5, 5, 3, INK);
    for (const [x, y] of [[1, 3], [1, 4], [0, 4], [1, 5], [0, 5], [0, 6]]) { pair(g, x, y, 0, wing); pair(g, x, y, 1, wing); }
    return g.entry({ id: 'cand-p19-cupid', name: 'Cupid', fraction: 0.65, seed: 1, story: 'He has never once checked who he is aiming at.' });
  })(),

  // Minotaur Calf (Crete). Identity: a bull calf sitting up like a person,
  // ivory horns out to the full width, a gold ring in a pink nose. Moment:
  // Ariadne's ball of thread, meant to lead the way out, has become his toy.
  // Parts: chestnut calf, ivory horns, pink muzzle, the red ball; gold ring.
  (() => {
    const g = grid(9, 8, 4);
    g.box([2, 6], [0, 2], [0, 2], bull);
    for (const x of [2, 6]) g.clear(x, 2, 0);
    g.set(3, 0, 3, hoofDk).set(5, 0, 3, hoofDk);
    g.box([3, 5], [1, 2], [3, 3], thread).set(4, 0, 3, thread);
    g.box([2, 6], [3, 6], [0, 3], bull);
    for (const x of [2, 6]) for (const z of [0, 3]) g.clear(x, 6, z).clear(x, 3, z);
    g.box([3, 5], [3, 4], [3, 3], calfNose).set(4, 3, 3, ring);
    g.set(3, 5, 3, INK).set(5, 5, 3, INK);
    pair(g, 1, 5, 2, bull);
    for (const [x, y] of [[1, 6], [0, 6], [0, 7]]) pair(g, x, y, 1, horn), pair(g, x, y, 2, horn);
    g.set(4, 7, 1, tuft).set(4, 7, 2, tuft);
    return g.entry({ id: 'cand-p19-minotaur', name: 'Minotaur Calf', fraction: 0.65, seed: 6, story: "A ball of thread, to find his way out. He'd rather play with it." });
  })(),

  // Cat Mummy (Egypt). Identity: the bottle shape and pointed ears of the
  // cat mummies in museums, in banded linen. Moment: awake, green eyes open,
  // one orange paw out of the wraps. Parts: linen in two tones (a pattern,
  // so the softer light), green eyes, pink nose, the orange paw.
  (() => {
    const g = grid(5, 9, 5);
    [[0, 2.2], [1, 2.4], [2, 2.4], [3, 2.2], [4, 1.6]].forEach(([y, r]) => oval(g, y, r, r, linen));
    for (const y of [5, 6, 7]) oval(g, y, 2.5, 1.6, linen);
    tint(g, (x, y) => y % 2 === 1 && y < 5, linenDk);
    g.set(0, 8, 2, linen).set(1, 8, 2, linen).set(3, 8, 2, linen).set(4, 8, 2, linen);
    front(g, 1, 6, catEye); front(g, 3, 6, catEye); front(g, 2, 5, catNose);
    front(g, 3, 2, tabby); front(g, 3, 3, tabby);
    return g.entry({ id: 'cand-p19-cat-mummy', name: 'Cat Mummy', fraction: 0.6, seed: 6, lit: { span: 2 }, story: 'Three thousand years under wraps. Still knocks things off tables.' });
  })(),
  // Lamassu (Assyria). Identity: a winged bull with a man's bearded head
  // under a tall crown, the gold wings sweeping up off its back to the top
  // corner. Moment: on guard at the gate, head turned to you, and five legs,
  // as the palace statues have: two standing at the front, four walking
  // seen from the side. Parts: cream stone, gold wings, a dark beard, a lapis
  // crown with a gold band; eyes.
  (() => {
    const g = grid(9, 10, 3);
    for (const [x, z] of [[1, 0], [2, 2], [4, 2], [6, 0], [6, 2]]) g.box([x, x], [0, 1], [z, z], lamStone).set(x, 0, z, lamHoof);
    g.box([0, 6], [2, 4], [0, 2], lamStone).box([0, 0], [2, 2], [0, 2], 0).box([3, 3], [2, 2], [0, 2], 0).box([5, 5], [2, 2], [0, 2], 0);
    for (const [x, y] of [[1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [0, 6], [1, 6], [2, 6], [3, 6], [0, 7], [1, 7], [0, 8]]) pairZ(g, x, y, 0, feather);
    g.box([6, 8], [4, 7], [0, 2], lamStone);
    g.box([6, 8], [3, 5], [2, 2], beard).box([7, 8], [3, 3], [1, 1], beard).set(8, 4, 1, beard);
    g.set(6, 6, 2, INK).set(8, 6, 2, INK);
    g.box([6, 8], [8, 9], [0, 2], lapis).box([6, 8], [8, 8], [0, 2], gold);
    return g.entry({ id: 'cand-p19-lamassu', name: 'Lamassu', fraction: 0.6, seed: 3, story: 'He has five legs, so he looks right from the front and the side.' });
  })(),
];
