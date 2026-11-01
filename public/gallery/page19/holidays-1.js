// Page 19 · VII Holidays of the World: daily stones, one for a festival
// somewhere, on its day. Each comment names the date (or the rule for a
// moving one), so the daily can schedule it. Kept warm: a festival's
// familiar objects and joys, not its sacred symbols. In calendar order.
// Palette: Beacon (slate lavender going to ember peach, so bodies stay off
// lavender and peach: white, red, black, purple, brown, with bright accents).
// Every entry is in the daily band (judge() in public/js/daily.js: D 9.5-12,
// 90-180 chisels on the trimmed block, 4-10 waves), with fraction and seed
// written out so the gallery and the daily agree.
//
// Silhouette first. Each idea as name / identity feature that sets the
// outline / the moment / colour parts, then what became of it:
//  kept  First-Footer      a Scottie's beard, ears and carrot tail, side on   the first foot over the step   black, tartan coat, shortbread
//  kept  Holi Pup          a sitting white pup, splashed in four colours       home from Holi                  white, pink, green, blue
//  kept  Aubergine Cow     an aubergine on four chopstick legs                 ready to take them back         purple, green cap, pale wood
//  kept  Lord Rabbit       tall ears up through a gold helmet                  on guard in red armour          red, gold, white, pink
//  kept  Désalpe           a tall crown of flowers between the horns           coming down the mountain        brown, white face, flowers, bell
//  kept  Sugar Skull       a marigold crown over dark eye sockets             expecting visitors              white, orange, pink, dark
//  kept  Carp in the Bath  a bathtub, a fish's head and tail out of it        it has the bath                 white, water blue, bronze
//  kept  Tió de Nadal      a log with a face, a red cap and a blanket          fed and waiting                 bark, pale face, red cap, blue blanket
//  cut   Lion Dance, Pot of Gold  built; charms-1 has both (and myths-1 has Leprechaun's Gold)
//  cut   Songkran Elephant built, trunk up and spraying; showtime-1's Circus Elephant has the outline
//  cut   Wild Haggis       built three ways (legs shorter on the uphill side): the tam read as a
//                          gift box and the body as a brown block; and First-Footer is Scotland's
//  cut   Pongal Pot        built three ways: the froth read as cream or snow, the sugarcane as sticks
//  cut   Dragon Boat       built: hull, head, drum and oars are a muddle at 40 px, and no moment
//  cut   Hina Dolls        built: flat, D 8.8; and toybox-1's Karakuri Tea Doll is the kimono doll
//  cut   Mattu Pongal Bull built: painted horns, garland and bell read as a goat; a second bovine
//  cut   Easter Bilby      built: a grey rabbit with an egg; the Chocolate Bunny has Easter
//  out   Groundhog         weather-1 has Groundhog Day
//  out   Kukur Tihar Dog   (Nepal garlands every dog for a day) a third dog, and Holi Pup's outline
//  out   Diwali Diya       Oil Lamp exists, and a saucer and flame is about 60 taps
//  out   Mooncake          food, and a disc; Lord Rabbit has Mid-Autumn instead
//  out   St Patrick's Hat  charms-1 has the Pot of Gold, and a hat on its own has no moment
//  out   Carnival Mask     Fox Mask and showtime-1's Theatre Masks; Hanami picnic, Tanabata
//                          wishes, Midsummer maypole: spread out or thin, 200+ taps
//  out   Thanksgiving Pie, Turkey in Disguise: food, and Turkey and Cherry Pie exist
//  out   Bonfire Night     Toffee Apple and Campfire exist, and the Guy isn't warm
//  out   Sinterklaas Shoe  (a clog with a carrot for the horse) Dec 5 is the Nutcracker's
//  out   Poisson d'Avril   a paper fish on a cat's back: page 19's fifth cat, and the fish is 4 cubes
//  out   Cheese Rolling    the hill is more than a third of the cubes; Puck Fair's goat: Goat on the Car
// Learns from: First-Footer, the Black Cat (a dark creature, one bright
// accent) and the Akabeko (side on, face at the +x end); Holi Pup, the Basket
// Dog (a sitting charm) and the Melted Snowman (caught just after); Aubergine
// Cow, the Akabeko and the Sock Monkey (an everyday thing made a creature);
// Lord Rabbit, the Kokeshi (a frontal icon in colour blocks) and the Cloth
// Tiger (a folk guardian toy); Désalpe, the Highland Cow and the Troll Doll
// (the thing on top sets the outline); Sugar Skull, the Chattering Teeth (a
// face with no body, toward the camera); Carp in the Bath, the Raccoon in a
// Bin and Noah's Ark (the container is the joke); Tió, the Sock Monkey (sat
// where you left it) and Baba Yaga's Hut (an object on legs, with a face).
// Faces and details look toward +z / +x.
import { grid } from '../voxel.js';
import { INK, tint } from './kit.js';

// Flat material colours: the game's light does the shading.
const scottie = 0x34303d, tartan = 0xd8343c, tartanDk = 0x3f7a4a, shortbread = 0xf2c47a, glint = 0xfbf8f2,
  pupWhite = 0xfbf8f2, gulalPink = 0xf25fa8, gulalGreen = 0x5fc04a, gulalBlue = 0x3f9fe8, gulalYellow = 0xf6d14a, tongue = 0xe8506a,
  aubergine = 0x5a2f7a, calyx = 0x5fb35a, chopstick = 0xead2a6,
  armour = 0xd8343c, gold = 0xf2c14e, fur = 0xfbf8f2, earPink = 0xf29ab0,
  cowBrown = 0xa8693f, cowWhite = 0xfbf3e6, cowNose = 0xf0c0a8, hoof = 0x5a4a52, horn = 0xf6efe0,
  leaf = 0x5fb35a, bloomPink = 0xf25fa8, bloomYellow = 0xf6d14a, bloomRed = 0xe0343c, bellGold = 0xf2c14e,
  sugar = 0xfbf8f2, petal = 0xf25fa8, petalBlue = 0x4fb3e8, marigold = 0xf29a2a,
  enamel = 0xfbf8f2, clawFoot = 0x5a5468, bathWater = 0x5fb3e0, carp = 0xd8902e,
  bark = 0x8a5a3a, heartwood = 0xf2d9a8, capRed = 0xe0343c, blanket = 0x5f8fd8;

export default [
  // [Jan 1, Hogmanay into New Year's Day, Scotland] First-Footer. The first
  // visitor over the step after midnight brings the year's luck, and should
  // be tall and dark, with a gift. Identity: a Scottie's beard, upright ears
  // and carrot tail, side on. Moment: on the step, a finger of shortbread
  // held crosswise. Parts: black dog, a red and green tartan coat (a pattern,
  // so the softer light), the shortbread; white glints for eyes.
  (() => {
    const g = grid(9, 8, 4);
    for (const x of [1, 5]) for (const z of [0, 3]) g.set(x, 0, z, scottie);              // short legs
    g.box([1, 5], [1, 4], [0, 3], scottie);                                               // the body
    g.box([5, 7], [3, 6], [0, 3], scottie);                                               // the head
    g.box([8, 8], [3, 4], [1, 2], scottie).box([7, 8], [2, 2], [1, 2], scottie);          // the muzzle and beard
    g.set(6, 7, 0, scottie).set(6, 7, 3, scottie);                                        // ears, up
    g.box([0, 0], [4, 6], [1, 2], scottie);                                               // the carrot tail
    g.set(7, 5, 0, glint).set(7, 5, 3, glint);                                            // eyes
    tint(g, (x, y) => x >= 1 && x <= 4 && y >= 3, (x, y, z) => ((x + z) % 2 ? tartan : tartanDk));   // the tartan coat
    g.box([8, 8], [3, 3], [0, 3], shortbread);                                            // the gift
    return g.entry({ id: 'cand-p19-first-footer', name: 'First-Footer', fraction: 0.65, seed: 1, lit: { span: 2 }, story: 'Tall, dark and bearing gifts. Well: dark, and bearing gifts.' });
  })(),

  // [Holi, India and Nepal: the day after the Phalguna full moon, late Feb to
  // late Mar] Holi Pup. Identity: a white pup sitting up, splashed with
  // coloured powder in four round splashes that cross its parts (paint, not
  // features, so they don't pair). Moment: home from Holi, tongue out. Parts:
  // white, then pink, green, blue and a yellow accent (a pattern, so the
  // softer light).
  (() => {
    const g = grid(7, 8, 6);
    g.box([1, 5], [0, 3], [0, 3], pupWhite).clear(1, 3, 0).clear(5, 3, 0);              // the body, sitting
    g.box([0, 0], [0, 1], [1, 3], pupWhite).box([6, 6], [0, 1], [1, 3], pupWhite);        // haunches
    for (const x of [2, 4]) g.box([x, x], [0, 2], [4, 4], pupWhite).set(x, 0, 5, pupWhite);   // front legs
    g.box([2, 4], [2, 3], [4, 4], pupWhite);                                              // the chest
    g.box([1, 5], [4, 7], [1, 4], pupWhite);                                              // the big head
    for (const [x, y] of [[1, 7], [5, 7], [1, 4], [5, 4]]) g.clear(x, y, 4).clear(x, y, 1);
    g.box([2, 4], [4, 5], [5, 5], pupWhite).set(3, 3, 5, tongue);                         // the muzzle, tongue out
    g.box([0, 0], [4, 6], [2, 3], pupWhite).box([6, 6], [4, 6], [2, 3], pupWhite);        // floppy ears
    g.box([6, 6], [2, 3], [0, 0], pupWhite);                                              // the tail
    const splash = (cx, cy, cz, r, c) => tint(g, (x, y, z) => (x - cx) ** 2 + (y - cy) ** 2 + (z - cz) ** 2 <= r * r, c);
    splash(1, 7.5, 3, 2.2, gulalPink);
    splash(5.5, 1.5, 2.5, 1.9, gulalGreen);
    splash(0.5, 1, 3.5, 1.5, gulalBlue);
    splash(5, 5, 5, 1.3, gulalYellow);
    g.set(2, 6, 4, INK).set(4, 6, 4, INK).set(3, 5, 5, INK);                              // eyes and nose
    return g.entry({ id: 'cand-p19-holi-pup', name: 'Holi Pup', fraction: 0.65, seed: 1, lit: { span: 2 }, story: 'Went out white. Came home in every colour. Regrets nothing.' });
  })(),

  // [Aug 13, Obon, Japan (Jul 13 in Tokyo): set out by the door with the
  // cucumber horse until the 16th] Aubergine Cow (nasu no ushi). The spirits
  // ride home on a quick cucumber horse and go back on a slow aubergine cow.
  // Identity: a fat aubergine on four chopstick legs, its green cap and stalk
  // for a head. Moment: standing ready. Parts: purple (big), pale wood legs,
  // the green cap.
  (() => {
    const g = grid(9, 6, 4);
    [2.0, 2.1, 2.0, 1.9, 1.7, 1.5, 1.3].forEach((r, x) => g.cylinder('x', [x >= 4 ? 3.6 : 3.4, 1.5], r, [x, x], aubergine));   // the aubergine
    g.cylinder('x', [3.8, 1.5], 1.1, [7, 7], calyx);                                      // its cap
    g.set(6, 5, 1, calyx).set(6, 5, 2, calyx).set(6, 4, 0, calyx).set(6, 4, 3, calyx);    // the cap's points, back over the shoulders
    g.set(8, 4, 1, calyx).set(8, 3, 1, calyx);                                            // the stalk
    for (const x of [1, 5]) for (const z of [0, 3]) {                                     // chopstick legs, up to the body
      for (let y = 0; y < 6 && !g.get(x, y, z); y++) { g.set(x, y, z, chopstick); if (g.get(x, y, z ? 2 : 1)) break; }
    }
    return g.entry({ id: 'cand-p19-aubergine-cow', name: 'Aubergine Cow', fraction: 0.65, seed: 1, story: 'The cucumber horse brings them home fast. This one takes them back slowly.' });
  })(),

  // [Mid-Autumn Festival, the 15th of the 8th lunar month: mid Sep to early
  // Oct] Lord Rabbit (Tu'er Ye), Beijing's clay festival rabbit: the moon's
  // rabbit, who came down to cure a plague in borrowed armour. Identity: tall
  // ears up through a gold helmet. Moment: seated on guard. Parts: red armour
  // (big, darkest, low), white face and ears, gold helmet and shoulders; pink
  // in the ears and a pink nose.
  (() => {
    const g = grid(7, 10, 5);
    g.box([1, 5], [0, 2], [0, 3], armour).box([1, 5], [0, 0], [4, 4], armour);           // armour, knees forward
    g.box([0, 0], [0, 0], [1, 3], armour).box([6, 6], [0, 0], [1, 3], armour);            // the hem, spread
    g.box([0, 0], [1, 2], [1, 2], armour).box([6, 6], [1, 2], [1, 2], armour);            // arms
    g.box([0, 6], [2, 2], [0, 3], gold);                                                  // gold shoulders
    g.box([1, 5], [3, 5], [0, 3], fur);                                                   // the head
    g.box([2, 4], [3, 3], [4, 4], fur).set(3, 3, 4, earPink);                             // the muzzle, a pink nose
    g.set(2, 4, 3, INK).set(4, 4, 3, INK);                                                // eyes
    g.box([1, 5], [6, 6], [0, 3], gold).clear(1, 6, 0).clear(5, 6, 0).clear(1, 6, 3).clear(5, 6, 3);   // the helmet
    for (const x of [2, 4]) g.box([x, x], [7, 9], [1, 2], fur).box([x, x], [7, 8], [2, 2], earPink);   // ears, up through it
    g.set(3, 7, 1, armour).set(3, 7, 2, armour);                                          // the helmet's red knob
    return g.entry({ id: 'cand-p19-lord-rabbit', name: 'Lord Rabbit', fraction: 0.65, seed: 1, story: 'He came down from the moon to cure a plague, and kept the armour.' });
  })(),

  // [the last Saturday of September, the Désalpe at Charmey; the Swiss
  // valleys bring their herds down from mid Sep to early Oct] Désalpe.
  // Identity: a tall crown of flowers between the horns. Moment: walking down
  // from the summer pasture, the big bell on. Parts: brown body, white face,
  // the flowers (pink, yellow, red on green leaves: a pattern, so the softer
  // light), a gold bell.
  (() => {
    const g = grid(8, 9, 4);
    for (const x of [0, 3]) for (const z of [0, 3]) g.set(x, 1, z, cowBrown).set(x, 0, z, hoof);   // legs
    g.box([0, 4], [2, 4], [0, 3], cowBrown).clear(0, 4, 0).clear(0, 4, 3);                 // the body
    g.box([5, 6], [3, 5], [0, 3], cowWhite).box([7, 7], [3, 4], [1, 2], cowNose);          // the white face, the muzzle
    for (const z of [0, 3]) g.clear(6, 5, z).clear(6, 3, z);
    g.set(5, 6, 0, horn).set(5, 6, 3, horn);                                              // horns
    g.set(6, 4, 0, INK).set(6, 4, 3, INK);                                                // eyes
    g.box([5, 6], [6, 6], [1, 2], leaf);                                                  // the crown: leaves,
    g.box([4, 6], [7, 7], [0, 3], bloomPink);                                             // flowers,
    for (const [x, z] of [[4, 0], [6, 0], [4, 3], [6, 3]]) g.clear(x, 7, z);
    tint(g, (x, y, z) => y === 7 && (x + z) % 2 === 0, bloomYellow);
    g.box([5, 5], [8, 8], [1, 2], bloomRed);                                              // and a red one on top
    g.box([5, 6], [1, 2], [1, 2], bellGold);                                              // the big bell
    return g.entry({ id: 'cand-p19-desalpe', name: 'Désalpe', fraction: 0.65, seed: 1, lit: { span: 2 }, story: 'All summer on the mountain. Today she comes down in flowers.' });
  })(),

  // [Nov 2, Día de Muertos, Mexico (Nov 1-2)] Sugar Skull (calavera de
  // azúcar), kept cheerful. Identity: a crown of marigolds over two dark eye
  // sockets and a stitched grin. Moment: set out on the ofrenda, expecting
  // visitors. Parts: white sugar (big), orange marigolds, the dark sockets,
  // nose and stitches; pink petals over the eyes, blue dots on the brow and
  // cheeks.
  (() => {
    const g = grid(7, 9, 5);
    g.box([0, 6], [3, 6], [0, 4], sugar);                                                 // the cranium
    for (let z = 0; z <= 4; z++) g.clear(0, 6, z).clear(6, 6, z);
    for (let y = 3; y <= 6; y++) g.clear(0, y, 0).clear(6, y, 0);
    for (let x = 0; x <= 6; x++) g.clear(x, 6, 0);
    g.box([1, 5], [0, 2], [1, 4], sugar);                                                 // the jaw
    for (let z = 1; z <= 4; z++) g.clear(1, 0, z).clear(5, 0, z);
    for (const x of [1, 4]) g.box([x, x + 1], [3, 4], [4, 4], INK);                       // eye sockets
    g.box([1, 2], [5, 5], [4, 4], petal).box([4, 5], [5, 5], [4, 4], petal);              // petals over them
    g.set(3, 2, 4, INK);                                                                  // the nose
    for (const x of [2, 4]) g.set(x, 1, 4, INK);                                          // the stitched grin
    g.set(3, 6, 4, petalBlue).set(3, 5, 4, petalBlue);                                    // a flower on the brow
    g.set(0, 3, 4, petalBlue).set(6, 3, 4, petalBlue);                                    // cheek dots
    g.box([0, 6], [7, 7], [1, 3], marigold);                                              // the marigold crown
    for (const x of [0, 6]) g.clear(x, 7, 1).clear(x, 7, 3);
    for (const x of [1, 3, 5]) g.set(x, 8, 2, marigold);
    return g.entry({ id: 'cand-p19-sugar-skull', name: 'Sugar Skull', fraction: 0.7, seed: 6, story: 'Painted, sugared and grinning. Someone special is coming home tonight.' });
  })(),

  // [Dec 23, Czechia and Slovakia: the Christmas Eve carp lives in the bath
  // for a few days first] Carp in the Bath. Identity: a white clawfoot tub, a
  // carp's head up out of the water at one end and its tail at the other.
  // Moment: it has had the bath to itself since Tuesday. Parts: white enamel
  // (big), the water a step down inside the rim, the bronze carp; dark feet,
  // eyes and an O of a mouth.
  (() => {
    const g = grid(9, 6, 5);
    for (const x of [1, 7]) for (const z of [1, 3]) g.set(x, 0, z, clawFoot);              // claw feet
    g.box([1, 7], [1, 1], [1, 3], enamel);                                                // the tub
    g.box([0, 8], [2, 3], [0, 4], enamel);
    for (const y of [2, 3]) g.clear(0, y, 0).clear(8, y, 0).clear(0, y, 4).clear(8, y, 4);
    g.box([1, 7], [3, 3], [1, 3], 0).box([1, 7], [2, 2], [1, 3], bathWater);               // the water, below the rim
    g.box([5, 7], [3, 3], [1, 3], carp).box([6, 7], [4, 4], [1, 3], carp).set(6, 5, 2, carp);   // the carp's head, up
    g.set(7, 5, 2, INK).set(7, 4, 1, INK).set(7, 4, 3, INK);                              // its mouth and eyes
    g.box([2, 3], [3, 3], [2, 2], carp).box([0, 2], [4, 4], [2, 2], carp)
      .set(0, 5, 2, carp).set(2, 5, 2, carp);                                             // its tail, out the other end
    return g.entry({ id: 'cand-p19-carp-in-the-bath', name: 'Carp in the Bath', fraction: 0.65, seed: 1, story: 'Nobody in the house has had a bath since Tuesday.' });
  })(),

  // [Dec 24, Catalonia: the Tió arrives on Dec 8 and is fed and kept warm
  // until Christmas Eve, when it is asked, with sticks and a song, for the
  // presents] Tió de Nadal. Identity: a log on two stick legs, a painted face
  // on its cut end, a red barretina flopping back. Moment: fed, wrapped up and
  // waiting. Parts: bark (big, darkest, low), a blue blanket, the pale face,
  // the red cap and a red smile.
  (() => {
    const g = grid(8, 8, 5);
    const log = (x0, x1, y0, c) => {
      g.box([x0, x1], [y0, y0 + 4], [0, 4], c);
      for (let x = x0; x <= x1; x++) for (const [y, z] of [[y0, 0], [y0, 4], [y0 + 4, 0], [y0 + 4, 4]]) g.clear(x, y, z);
    };
    log(0, 2, 0, bark); log(3, 6, 1, bark); log(7, 7, 1, heartwood);                     // the log, its front end up, the cut face
    g.set(6, 0, 1, bark).set(6, 0, 3, bark);                                              // two stick legs
    g.set(7, 4, 1, INK).set(7, 4, 3, INK);                                                // eyes
    g.set(7, 2, 1, capRed).set(7, 1, 2, capRed).set(7, 2, 3, capRed);                     // a smile
    g.box([5, 7], [6, 6], [1, 3], capRed).box([4, 6], [7, 7], [2, 2], capRed);            // the barretina, flopping back
    tint(g, (x, y) => x >= 1 && x <= 3 && y >= 3, blanket);                               // the blanket
    return g.entry({ id: 'cand-p19-tio', name: 'Tió de Nadal', fraction: 0.65, seed: 1, story: 'Fed and kept warm all December. On Christmas Eve it pays everyone back.' });
  })(),
];
