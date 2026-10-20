// Trailer v3 (~29.5 s): Saturday's v1 structure, made denser and more rewarding
// (docs/trailer-study.md, v3, and its revision). Every reveal plays until the
// object has turned to face you and stopped (SETTLE, measured with settle.mjs):
// the hook's Maneki-neko, TAP / PEEL / REVEAL on the Koala, a montage of four
// solved objects as their last gems land, Saturday's 100+ puzzles wall, the
// Dragon Head uncovered and turned in a finger, and Saturday's end card
// (trailer/reference/saturday-ad-15s.mp4).
//
// Same contract as the other timelines: `at` both passes, `vat` video only
// (fast-forwards hidden under cuts), `aat` audio only. PREROLL runs before t = 0.
import { makeTimeline, blurCut, storage as save, PAGE_HELPERS as HELPERS, SETTLE } from './v3-common.mjs';

export const FPS = 30;
export const SIZE = { width: 540, height: 960, scale: 2 };   // → 1080×1920
export const POSTER = 25.4;
// chisel onsets in the first build sat 30-48 ms after their actions (the picture shows an
// action on the next frame): the sound is advanced a little more than v2's
export const AUDIO_LEAD = 0.08;
export const SHEET_FPS = 2;
export const LUFS = -14;          // social feeds' common target (docs/trailer-study.md, v3)
export const PAGE_HELPERS = HELPERS;
const BEAT = 60 / 72, GEMS_AT = 4.1;   // main.js showResult: the first gem 4.1 s after the win, then one a beat

// the objects this cut uncovers (unsolved in the save)
const HOOK = 'maneki-neko', TPR = 'koala', TURN = 'dragon-head';
const MONTAGE = ['pumpkin', 'kokeshi', 'windmill', 'origami-fox'];
export const REVEALS = [HOOK, TPR, TURN, ...MONTAGE];
export const storage = () => save(REVEALS, TURN);   // at the map, the Dragon Head is the first stone still open
// before t = 0: off the title, and the hook's stone set up (its assembly and the
// silent chisels play out here, before the sound pass starts recording)
export const PREROLL = [['enterMap', [], 2.4], ['wallBuild', [], 0.1], ['level', [HOOK, 1.0], 0.1], ['prep', [1, 1], 1.2]];

export function buildTimeline() {
  const tl = makeTimeline();
  const { at, vat, aat } = tl;

  // 0.0 HOOK: the Maneki-neko's stone down to one row of 0 and a last cube.
  // A double-tap runs the row away; the last tap; it whirls round to face you and settles.
  at(0.1, 'cap', 'what’s|inside?', 'say light up');
  at(0.3, 'rowTap');
  at(0.45, 'rowTap2');
  const hookWin = 1.05;
  at(hookWin, 'tap');
  at(1.95, 'cap', null);                   // through the flash, gone before its name settles in

  // TAP / PEEL / REVEAL: one stone, the Koala; TAP and PEEL 1.25 s each, REVEAL until it lands
  let c = hookWin + SETTLE + 0.15;         // 6.0: the blur starts after it has stopped
  blurCut(tl, c, (s) => { at(s, 'level', TPR, 1.0); });
  at(c + 0.05, 'cap', 'tap', 'verb light up');
  aat(c + 0.2, 'sfx', true);
  [0.25, 0.42, 0.59, 0.76].forEach((d) => at(c + d, 'tap'));
  at(c + 0.9, 'rowTap');
  at(c + 1.04, 'rowTap2');
  c += 1.25;                               // 7.25
  blurCut(tl, c, (s) => { at(s, 'prep', 0, 0, 0.45); }, { ff: 0.6 });
  at(c + 0.02, 'cap', 'peel', 'verb light up');
  aat(c + 0.1, 'sfx', true);
  [0.2, 0.45, 0.7, 0.95].forEach((d, k) => at(c + d, 'peel', 0, k + 1));
  c += 1.25;                               // 8.5
  blurCut(tl, c, (s) => { at(s, 'peel', 0, 0); at(s, 'prep', 2); }, { ff: 0.6 });
  at(c + 0.02, 'cap', 'reveal', 'verb gold up');
  aat(c + 0.15, 'sfx', true);
  at(c + 0.2, 'tap');
  const koalaWin = c + 0.45;
  at(koalaWin, 'tap');                     // the Koala
  at(c + 1.15, 'cap', null);               // before its own name settles in under the word

  // MONTAGE: four more, already uncovered and settled, facing you, as their
  // last gems land (v1's montage): one second each, a chime on each gem
  c = koalaWin + SETTLE + 0.15;            // 13.95
  at(c, 'noStory', true);
  at(c + 0.1, 'cap', 'collect|them all', 'say light up');
  MONTAGE.forEach((id, k) => {
    const t = c + k * 1.0, ff = SETTLE + 0.05;
    blurCut(tl, t, (s) => { at(s, 'level', id, 1.0); at(s, 'prep', 0); }, { ff });
    [1, 2].forEach((g) => { const when = t + GEMS_AT + g * BEAT - ff; if (when < t + 1.0) aat(when, 'gem', g); });
  });
  c += MONTAGE.length * 1.0;               // 17.95
  at(c - 0.12, 'capClear');
  at(c, 'noStory', false);

  // THE WALL (Saturday's): every object on a dark plum field, drifting; the count runs up to 100+ in gold, PUZZLES under it
  at(c - 0.1, 'blurOut', 0.1);
  aat(c - 0.1, 'whoosh');
  at(c, 'sfx', false);
  at(c, 'wall', true);
  at(c + 0.08, 'count', 100, 0.95, 'num gold');
  at(c + 0.4, 'cap2', 'puzzles', 'numsub');
  aat(c + 1.03, 'gem', 2);
  const wallEnd = c + 2.15;
  at(wallEnd - 0.08, 'capClear');
  c = wallEnd;                             // 20.1

  // THE DRAGON HEAD: its last tap; it whirls round to face you and settles; its
  // gems land; a finger turns it to look, and lets it come back
  blurCut(tl, c, (s) => { at(s, 'wall', false); at(s, 'level', TURN, 1.0); at(s, 'prep', 1); }, { ff: 0.6 });
  aat(c + 0.22, 'sfx', true);
  const dragonWin = c + 0.25;
  at(dragonWin, 'tap');
  const d0 = dragonWin + SETTLE + 0.05;
  at(d0, 'dragStart', 330, 470);
  for (let f = 1; f <= 15; f++) at(d0 + f / 30, 'dragTo', 330 - 150 * Math.sin(f / 15 * Math.PI / 2), 470);
  for (let f = 1; f <= 15; f++) at(d0 + (15 + f) / 30, 'dragTo', 180 + 150 * (1 - Math.cos(f / 15 * Math.PI / 2)), 470);
  at(d0 + 31 / 30, 'dragEnd', 330, 470);

  // THE END (Kellan): on the map; a finger pulls down at its top and the night
  // sky and the title come down over it (the game's own ascent); the title blurs
  // under Saturday's CTA - STRATA, the gem, PLAY NOW, the store badges
  c = d0 + 31 / 30 + 0.25;                 // 26.4
  blurCut(tl, c, (s) => { at(s, 'mapTop'); }, { ff: 0.2 });
  aat(c + 0.1, 'sfx', true);
  at(c + 0.18, 'pullStart');
  for (let f = 1; f <= 10; f++) at(c + 0.18 + f / 30, 'pullMove', Math.round(440 * (1 - Math.pow(1 - f / 10, 2))));
  at(c + 0.18 + 11 / 30, 'pullEnd');
  const end = c + 1.0;                     // the title has come down; it blurs, the CTA comes in
  at(end, 'endCard');
  aat(end + 0.15, 'finalChord');
  return tl.done();
}

// the CTA holds 2.6 s
export const DURATION = +(buildTimeline().find((a) => a.act === 'endCard').t + 2.6).toFixed(2);
