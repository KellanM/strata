// Trailer v3 (~28 s): Saturday's v1 structure, made denser and more rewarding
// (docs/trailer-study.md, v3). Hook on a final tap and a reveal; TAP / PEEL /
// REVEAL on one stone; a blur-cut montage of six reveals; the world (the title's
// god rays, the descent through the sky onto the map, the mist parting); a
// shrine; a finger turning the Dragon Head; the wall of 150+; the end card on
// the game's own title with the store badges.
//
// Same contract as the other timelines: `at` both passes, `vat` video only
// (fast-forwards hidden under cuts), `aat` audio only. PREROLL runs before t = 0.
import { makeTimeline, blurCut, storage as save, PAGE_HELPERS as HELPERS, WALL_COUNT } from './v3-common.mjs';

export const FPS = 30;
export const SIZE = { width: 540, height: 960, scale: 2 };   // → 1080×1920
export const DURATION = 28.5;
export const POSTER = 22.2;
// chisel onsets in the first build sat 30-48 ms after their actions (the picture shows an
// action on the next frame): the sound is advanced a little more than v2's
export const AUDIO_LEAD = 0.08;
export const SHEET_FPS = 2;
export const LUFS = -14;          // social feeds' common target (docs/trailer-study.md, v3)
export const PAGE_HELPERS = HELPERS;

// the objects this cut uncovers (unsolved in the save)
const HOOK = 'maneki-neko', TPR = 'koala', SHRINE = 'bonus-moss-garden', TURN = 'dragon-head';
const MONTAGE = ['pumpkin', 'kokeshi', 'anglerfish', 'origami-fox', 'windmill', 'armillary'];
export const REVEALS = [HOOK, TPR, SHRINE, TURN, ...MONTAGE];
export const storage = () => save(REVEALS, TURN);   // at the map, the Dragon Head is the first stone still open
// before t = 0: off the title, and the hook's stone set up (its assembly and the
// silent chisels play out here, before the sound pass starts recording)
export const PREROLL = [['enterMap', [], 2.4], ['level', [HOOK, 1.0], 0.1], ['prep', [1, 1], 1.2]];

export function buildTimeline() {
  const tl = makeTimeline();
  const { at, vat, aat } = tl;

  // 0.0 HOOK: the Maneki-neko's stone down to one row of 0 and a last cube.
  // A double-tap runs the row away, the last tap lands, and it's uncovered.
  at(0.12, 'cap', 'what’s inside?', 'say light up');
  at(0.35, 'rowTap');
  at(0.5, 'rowTap2');
  at(1.3, 'cap', null);
  at(1.35, 'tap');                      // the last cube: flash, whirl, colour, name

  // 3.4 TAP / PEEL / REVEAL: one stone, the Koala, three verbs, 1.25 s each
  blurCut(tl, 3.4, (c) => { at(c, 'level', TPR, 1.0); });
  at(3.45, 'cap', 'tap', 'verb ink up');
  aat(3.6, 'sfx', true);
  [3.65, 3.82, 3.99, 4.16].forEach((s) => at(s, 'tap'));
  at(4.3, 'rowTap');
  at(4.44, 'rowTap2');
  blurCut(tl, 4.75, (c) => { at(c, 'prep', 0, 0, 0.45); }, { ff: 0.6 });
  at(4.77, 'cap', 'peel', 'verb ink up');
  aat(4.85, 'sfx', true);
  at(4.95, 'peel', 0, 1);
  at(5.2, 'peel', 0, 2);
  at(5.45, 'peel', 0, 3);
  at(5.7, 'peel', 0, 4);
  blurCut(tl, 6.0, (c) => { at(c, 'peel', 0, 0); at(c, 'prep', 2); }, { ff: 0.6 });
  at(6.02, 'cap', 'reveal', 'verb ink up');
  aat(6.2, 'sfx', true);
  at(6.25, 'tap');
  at(6.5, 'tap');                       // the Koala: flash, and in it on to the landing, named
  vat(6.68, 'ff', 1.2);
  at(6.95, 'cap', null);                // before the Koala's own name settles under it

  // 7.9 MONTAGE: six reveals, 1.1 s each. The last tap, and in its flash the
  // picture jumps on to the object landing in its colours, named.
  MONTAGE.forEach((id, k) => {
    const c = 7.9 + k * 1.1;
    blurCut(tl, c, (s) => { at(s, 'level', id, 1.0); at(s, 'prep', 1); });
    aat(c + 0.16, 'sfx', true);
    at(c + 0.2, 'tap');
    vat(c + 0.36, 'ff', 1.25);          // inside the flash: on to the landing
  });

  at(8.05, 'cap', 'every stone', 'say light up');
  at(8.25, 'cap2', 'hides something', 'say light up2');
  at(11.0, 'capClear');

  // 14.5 THE WORLD: the map pulls back out of the last stone; above the sea of
  // clouds the gold trail draws on and the mist over Cloud Isles parts
  blurCut(tl, 14.5, (c) => { at(c, 'map'); }, { ff: 1.9 });
  aat(14.6, 'sfx', true);
  at(14.75, 'cap', 'fifteen worlds', 'say ink cl1');
  at(15.0, 'cap2', 'above the clouds', 'say ink cl2');
  at(17.0, 'capClear');

  // 17.2 THE SHRINE: its card held on its own sky with its bells ("✦ The Shrine of
  // ✦ Moss Garden"), the gilded block assembling; the last tap; the Moss Tortoise
  blurCut(tl, 17.2, (c) => { at(c, 'map'); at(c, 'focusNode', SHRINE); at(c, 'tapNode', SHRINE); }, { ff: 1.0 });
  aat(17.2, 'sfx', true);
  blurCut(tl, 18.0, () => {}, { ff: 0.95, whoosh: false });   // on to the gilded block assembling
  aat(18.05, 'sfx', true);
  blurCut(tl, 19.0, (c) => { at(c, 'prep', 1); }, { ff: 0.3 });
  aat(19.15, 'sfx', true);
  at(19.2, 'tap');
  vat(19.38, 'ff', 1.25);

  // 20.7 TURN IT: the Dragon Head, uncovered; a finger turns it round
  blurCut(tl, 20.7, (c) => { at(c, 'level', TURN, 1.0); at(c, 'prep', 0); }, { ff: 3.3 });
  aat(20.75, 'sfx', true);
  // its gems land at 4.1 s + a beat each after the win (main.js showResult): 21.5, 22.33
  aat(20.7 + 2.0, 'finishResult');
  [0, 1].forEach((k) => aat(20.7 + 4.1 + k * 60 / 72 - 3.3, 'star', k));
  at(20.95, 'dragStart', 380, 480);
  for (let f = 1; f <= 36; f++) at(20.95 + f / 30, 'dragTo', 380 - 200 * (1 - Math.pow(1 - f / 36, 2)), 480 + 18 * Math.sin(f / 36 * Math.PI));
  at(22.2, 'dragEnd', 180, 480);

  // 22.7 THE WALL: the journal, everything found, rushing past; 150+
  blurCut(tl, 22.7, (c) => { at(c, 'map'); at(c, 'journal'); }, { ff: 0.5 });
  for (let f = 0; f <= 60; f++) { const k = f / 60; at(22.72 + f / 30, 'journalScroll', Math.round(2800 * k * k * (3 - 2 * k))); }
  at(22.75, 'shade', true);
  at(22.8, 'count', WALL_COUNT, 0.9, 'big light mid');
  at(23.5, 'cap2', 'puzzles', 'say light mid2');

  // 24.7 HOME: at the top of the map a finger pulls down; the night sky and
  // the title come down over it (the reverse of the descent)
  blurCut(tl, 24.7, (c) => { at(c, 'capClear'); at(c, 'shade', false); at(c, 'mapTop'); }, { ff: 0.2 });
  at(24.9, 'pullStart');
  for (let f = 1; f <= 10; f++) at(24.9 + f / 30, 'pullMove', Math.round(440 * (1 - Math.pow(1 - f / 10, 2))));
  at(25.27, 'pullEnd');
  at(25.3, 'endTitle');
  aat(25.6, 'finalChord');
  at(25.9, 'endCard');
  return tl.done();
}
