// Page 16 · III Up the Steps: for Ember Steps ("temples and stairways"),
// temple keepers, bells and the creatures on the stair. Silhouette first
// (docs/voxel-study.md, "Silhouette and character"): each idea was named,
// given the one feature that sets its outline, a pose and 2-3 colour parts
// before a cube was placed. The chapter already has Calendar Stone, Taiko
// Drum, Temple Bell, Nara Fawn, Tsukubai, Paper Fan, Tea House, Shiba Pup,
// Temple Elephant, Paper Lantern and Spiral Stair, so none of those come
// back. Faces and details look toward +x / +z. Sky: Dusk.
//
// Brainstormed and left out (built and looked at unless noted): Praying
// Mantis (at 40 px a green sprout in a planter), Hand Bell (a lathe bell
// reads as a beehive or pine cone in iso, and Temple Bell is already in the
// chapter), White Snake (white coil on white light: a blob), Kabuto (the
// crest seen at 45 degrees reads as a crab), and, not built, Pagoda (the
// level it was got replaced by Tea House), Torii (the Gate level), Cobra
// in a basket (belongs to the desert), Prayer Wheel (reads as a drum on a
// stick), Komainu and Inari fox (Guardian Lion and the foxes exist).
import { grid } from '../voxel.js';
import { INK, front, tint, lathe } from './kit.js';

// Flat material colours: the game's light (lit() in shapes.js) does the shading.
const peaBlue = 0x2f6fd0, peaFan = 0x3f9a6a, peaGold = 0xf2c14e, peaLeg = 0x9aa3ad,
  hen = 0xfbf8f2, sickle = 0x2f4a3a, comb = 0xe0434b, beak = 0xf2b33d,
  duckBuff = 0xe8c48e, duckSail = 0xf07a2a, duckCrest = 0x2f6a5a, duckStripe = 0xfbf8f2, duckBill = 0xe0434b, pond = 0x5ea8dc,
  robe = 0xf08a2a, skin = 0xf6d2b0, straw = 0xe6c45a, handle = 0x8a5a3c, step = 0x8f877c,
  hakama = 0xd8403a, kimono = 0xfbf8f2, hair = 0x2f2a36, suzu = 0xf2c14e,
  jizo = 0xbdb6aa, cap = 0xe0434b, moss = 0x5f9e4e;

export default [
  // PEACOCK
  //   identity: the tail fanned open, wider and taller than everything else
  //   pose: displaying, square to you, crest up
  //   parts: green fan with a gold rim (span 2), blue body and head
  //   The fan stands on the diagonal (x + z constant), so it faces the game
  //   camera square on instead of being seen at 45 degrees; from the other
  //   corners it is a zigzag edge.
  (() => {
    const g = grid(8, 10, 8);
    for (let z = 0; z < 8; z++) for (let x = 0; x < 8; x++) for (let y = 1; y < 10; y++) {
      const sum = x + z; if (sum < 4 || sum > 6) continue;
      const d = Math.hypot((x - z) / 7.4, (y - 1) / 8.6);
      if (d <= 1) g.set(x, y, z, sum === 6 && d > 0.8 ? peaGold : peaFan);       // the fan, its rim gold
    }
    g.ellipsoid([4.3, 2.4, 4.3], [1.5, 1.3, 1.5], peaBlue);                       // the body
    g.box([4, 5], [4, 6], [4, 5], peaBlue).clear(4, 4, 4);                         // the neck and head
    g.set(5, 6, 4, INK).set(4, 6, 5, INK);                                        // eyes, one on each face you see
    g.set(4, 7, 4, peaGold);                                                      // the crest
    g.set(4, 1, 5, peaLeg).set(4, 0, 5, peaLeg).set(5, 1, 4, peaLeg).set(5, 0, 4, peaLeg);   // legs
    return g.entry({ id: 'cand-p16-peacock', name: 'Peacock', fraction: 0.5, seed: 2, lit: { span: 2 }, story: 'Nobody asked. He is showing you anyway.' });
  })(),

  // ROOSTER (the shrine's sacred rooster, as at Ise)
  //   identity: the red comb on top and the dark sickle tail arching up
  //   behind; together they set the top and both ends of the outline
  //   pose: chest out, head up, mid-crow
  //   parts: white body, dark green tail, red comb and wattle; gold beak and feet
  (() => {
    const g = grid(8, 10, 4);
    g.ellipsoid([3.4, 3.4, 1.5], [2.4, 1.6, 1.6], hen);                           // the body
    g.box([5, 6], [4, 7], [1, 2], hen);                                           // the chest and neck
    g.box([5, 6], [8, 8], [1, 2], comb).set(7, 5, 1, comb).set(7, 5, 2, comb);    // comb and wattle
    g.box([7, 7], [6, 7], [1, 2], beak);                                          // the beak, open
    g.set(6, 7, 1, INK).set(6, 7, 2, INK);                                        // an eye each side
    for (const [x, y] of [[0, 3], [0, 4], [1, 4], [0, 5], [1, 5], [2, 5], [0, 6], [1, 6], [0, 7], [1, 7], [1, 8], [2, 8]])
      g.set(x, y, 1, sickle).set(x, y, 2, sickle);                                // the tail, arched
    g.box([3, 4], [0, 1], [1, 2], beak).clear(4, 1, 1).clear(4, 1, 2);            // legs and feet
    return g.entry({ id: 'cand-p16-rooster', name: 'Rooster', story: 'The shrine keeps its roosters for the dawn. This one keeps all the other hours too.' });
  })(),

  // MONK
  //   identity: a round shaven head on a saffron robe, and the broom held
  //   out at his side, bristles on the step
  //   pose: sweeping the top step, eyes closed, content
  //   parts: saffron robe, bare head, straw broom; grey step under
  (() => {
    const g = grid(9, 9, 5);
    g.box([0, 8], [0, 0], [0, 4], step);                                          // the step
    lathe(g, [3, 2], 1, [2.2, 2.2, 1.8, 1.6], robe);                              // the robe
    g.ellipsoid([3, 6.4, 2], [2.3, 2.0, 1.9], skin);                              // the head, big and round
    front(g, 2, 6, INK); front(g, 4, 6, INK);                                     // eyes, low in the head
    g.box([5, 6], [4, 4], [2, 2], robe).set(6, 4, 3, skin);                       // the sleeve, the hand
    g.box([7, 7], [3, 7], [3, 3], handle);                                        // the broom handle, out at his side
    g.box([7, 8], [1, 1], [2, 4], straw).set(7, 2, 3, straw);                     // the bristles
    return g.entry({ id: 'cand-p16-monk', name: 'Monk', story: 'He sweeps the same hundred steps each morning. The leaves are in no hurry.' });
  })(),

  // SHRINE MAIDEN (miko)
  //   identity: the bell-tree (kagura suzu) held up high at her side, over
  //   a flared red skirt; black hair with a tail down her back
  //   pose: mid-dance, the bells raised to ring
  //   parts: red hakama, white kimono, black hair; gold bells
  (() => {
    const g = grid(8, 10, 5);
    lathe(g, [3, 2], 0, [2.3, 2.2, 1.9, 1.6], hakama);                            // the red skirt, flared
    g.box([2, 4], [4, 5], [1, 3], kimono);                                        // the white kimono
    g.box([0, 1], [3, 5], [1, 3], kimono).clear(0, 5, 1).clear(0, 5, 3);           // her left sleeve, wide and hanging
    g.ellipsoid([3, 7.4, 2], [2.1, 1.7, 1.9], hair);                              // the head, all hair...
    g.box([2, 4], [6, 7], [4, 4], skin);                                          // ...but the face, a little forward
    front(g, 2, 6, INK); front(g, 4, 6, INK);                                     // eyes, under a skin row so the hair doesn't swallow them
    g.box([3, 3], [3, 6], [0, 0], hair);                                          // the tail of hair, down her back
    g.box([5, 6], [5, 5], [2, 2], kimono).set(6, 6, 2, skin);                     // her right arm, raised
    g.box([6, 6], [7, 7], [2, 2], handle);                                        // the handle
    g.box([6, 7], [8, 9], [2, 2], suzu).box([6, 6], [8, 8], [1, 3], suzu);        // the bells
    return g.entry({ id: 'cand-p16-miko', name: 'Shrine Maiden', fraction: 0.5, seed: 1, story: 'She rings the bells for the god of the stair, who prefers them a little faster.' });
  })(),

  // JIZO
  //   identity: a red knit cap and a red bib on a round stone head wider
  //   than its shoulders, two of them, tall and short (a compact, known
  //   outline; the colour and the pair carry it)
  //   pose: standing side by side on the moss, eyes closed
  //   parts: grey stone, red cap and bib, green moss
  (() => {
    const g = grid(10, 9, 5);
    g.box([0, 9], [0, 0], [1, 3], moss).box([1, 8], [0, 0], [0, 4], moss);       // the moss
    const statue = (cx, h) => {
      lathe(g, [cx, 2], 1, [2.3, ...Array(h - 2).fill(1.9), 1.5], jizo);            // the robe, narrowing
      const hy = h + 2.6;
      g.ellipsoid([cx, hy, 2], [2.2, 1.7, 2.2], jizo);                             // the head, wider than the shoulders
      tint(g, (x, y) => y > hy && Math.abs(x - cx) <= 2, cap);                     // the knit cap
      tint(g, (x, y, z) => y === h && z >= 3 && Math.abs(x - cx) <= 1, cap);       // the bib
      front(g, cx - 1, Math.floor(hy), INK); front(g, cx + 1, Math.floor(hy), INK); // eyes, closed
    };
    statue(2, 4);
    statue(7, 2);
    return g.entry({ id: 'cand-p16-jizo', name: 'Jizo', fraction: 0.5, seed: 2, story: 'They have stood here so long that someone keeps knitting them hats.' });
  })(),

  // MANDARIN DUCK
  //   identity: the two orange sails standing up off its back and the dark
  //   crest swept back off its head
  //   pose: afloat on the temple pond, head up, bill forward
  //   parts: buff body, orange sails and whiskers, dark green crest and
  //   tail; a little pond under; red bill, white eye-stripe
  (() => {
    const g = grid(9, 8, 6);
    g.ellipsoid([4, 0, 2.5], [3.6, 0.6, 2.2], pond);                              // the pond, a little
    g.ellipsoid([3.2, 1.6, 2.5], [3.0, 1.2, 1.7], duckBuff);                      // the body
    g.box([0, 0], [2, 3], [2, 3], duckCrest);                                     // the tail, up
    for (const z of [1, 4]) g.box([2, 3], [3, 4], [z, z], duckSail).set(3, 5, z, duckSail);   // the sails
    g.box([5, 7], [3, 5], [2, 3], duckBuff).box([6, 7], [6, 6], [2, 3], duckBuff); // the head
    tint(g, (x, y) => x >= 5 && y === 3, duckSail);                               // orange whiskers
    g.box([4, 6], [7, 7], [2, 3], duckCrest).box([3, 5], [6, 6], [2, 3], duckCrest).box([3, 4], [5, 5], [2, 3], duckCrest);   // the crest, swept back
    g.set(5, 5, 3, duckStripe).set(5, 5, 2, duckStripe);                          // the white eye-stripe
    g.set(6, 5, 3, INK).set(6, 5, 2, INK);                                        // an eye each side
    g.set(8, 4, 2, duckBill).set(8, 4, 3, duckBill);                              // the bill
    return g.entry({ id: 'cand-p16-mandarin-duck', name: 'Mandarin Duck', story: 'He has dressed for the temple. The temple has not noticed.' });
  })(),
];
