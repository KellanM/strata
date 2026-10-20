// The v3 ad (15 s): the trailer's hook, four reveals, the wall, and Saturday's
// ending - "one tap left…" held on the Dragon Head's stone, the last tap, the
// head whirls round to face you, its gems land with their chimes - then 2.5 s
// of end card. docs/trailer-study.md, v3.
import { makeTimeline, blurCut, storage as save, PAGE_HELPERS as HELPERS, WALL_COUNT } from './v3-common.mjs';

export const FPS = 30;
export const SIZE = { width: 540, height: 960, scale: 2 };   // → 1080×1920
export const DURATION = 15.0;
export const POSTER = 12.2;
export const AUDIO_LEAD = 0.08;
export const SHEET_FPS = 2;
export const LUFS = -14;          // social feeds' common target (docs/trailer-study.md, v3)
export const PAGE_HELPERS = HELPERS;

const HOOK = 'maneki-neko', LAST = 'dragon-head';
const MONTAGE = ['pumpkin', 'origami-fox', 'anglerfish', 'windmill'];
export const REVEALS = [HOOK, LAST, ...MONTAGE];
export const storage = () => save(REVEALS, LAST);
// before t = 0: off the title, and the hook's stone set up (its assembly and the
// silent chisels play out here, before the sound pass starts recording)
export const prerollFor = (opening) => [['enterMap', [], 2.4], ['level', [HOOK, 1.0], 0.1], ['prep', [1, opening === 'a' ? 1 : 0], 1.2]];
export const PREROLL = prerollFor('a');
const BEAT = 60 / 72;            // motion.js: the gems land a beat apart
const GEMS_AT = 4.1;             // main.js showResult: the first gem, after the win

// The opening (0 - 2.3 s) comes in three versions for an A/B test of the hook;
// everything after it is the same. timeline-v3ad-b.mjs and -c.mjs pick b and c.
//   a: mechanic into payoff - a row of 0 double-tapped away, the last tap, the reveal
//   b: payoff first - frame one is the last tap; the Maneki-neko lands named at once
//   c: tension - one cube left, held under "one more tap…", then the tap and the reveal
const OPENINGS = {
  a(tl) {
    const { at, vat, aat } = tl;
    at(0.1, 'cap', 'what’s inside?', 'say light up');
    at(0.3, 'rowTap');
    at(0.45, 'rowTap2');
    at(1.1, 'cap', null);
    at(1.15, 'tap');
    vat(1.35, 'ff', 0.9);
  },
  b(tl) {
    const { at, vat } = tl;
    at(0.02, 'tap');
    vat(0.2, 'ff', 1.0);
    at(0.5, 'cap', 'uncover', 'say light up');
    at(0.65, 'cap2', 'what’s hidden', 'say light up2');
    at(2.15, 'capClear');
  },
  c(tl) {
    const { at, vat } = tl;
    at(0.08, 'cap', 'one more tap…', 'say light up');
    at(1.25, 'cap', null);
    at(1.3, 'tap');
    vat(1.48, 'ff', 1.0);
  },
};

export function buildTimeline(opening = 'a') {
  const tl = makeTimeline();
  const { at, vat, aat } = tl;

  // 0.0 HOOK: the Maneki-neko's stone (set up in the PREROLL)
  OPENINGS[opening](tl);

  // 2.3 MONTAGE: four reveals, 0.95 s each, each jumping on in its flash
  MONTAGE.forEach((id, k) => {
    const c = 2.3 + k * 0.95;
    blurCut(tl, c, (s) => { at(s, 'level', id, 1.0); at(s, 'prep', 1); });
    aat(c + 0.16, 'sfx', true);
    at(c + 0.2, 'tap');
    vat(c + 0.36, 'ff', 1.25);
  });

  at(2.45, 'cap', 'every stone', 'say light up');
  at(2.65, 'cap2', 'hides something', 'say light up2');
  at(5.95, 'capClear');

  // 6.1 THE WALL: the journal rushing past; 150+ puzzles
  blurCut(tl, 6.1, (c) => { at(c, 'map'); at(c, 'journal'); }, { ff: 0.5 });
  for (let f = 0; f <= 39; f++) { const k = f / 39; at(6.12 + f / 30, 'journalScroll', Math.round(2400 * k * k * (3 - 2 * k))); }
  at(6.13, 'shade', true);
  at(6.18, 'count', WALL_COUNT, 0.7, 'big light mid');
  at(6.6, 'cap2', 'puzzles', 'say light mid2');

  // 7.4 ONE TAP LEFT: the Dragon Head's stone down to its last cube, held
  blurCut(tl, 7.4, (c) => { at(c, 'capClear'); at(c, 'shade', false); at(c, 'level', LAST, 1.0); at(c, 'prep', 1); }, { ff: 0.8 });
  at(7.5, 'cap', 'one tap left…', 'say light up');
  aat(8.4, 'sfx', true);
  at(8.62, 'cap', null);            // it leaves with the flash
  const win = 8.6;
  at(win, 'tap');                  // flash; it leaps, whirls round and lands facing you (~10.3)
  // 10.4: on (in a blink) to its gems landing, one a beat, each with its chime
  const jump = 10.4, ff = 2.15;
  blurCut(tl, jump, () => {}, { ff, out: 0.06, inn: 0.12, whoosh: false });
  aat(win + 2.0, 'finishResult');
  [0, 1, 2].forEach((k) => aat(win + GEMS_AT + k * BEAT - ff, 'star', k));   // 10.55, 11.38, 12.22

  // 12.5 END CARD: the game's title, its god rays; the badges (2.5 s)
  blurCut(tl, 12.5, (c) => { at(c, 'mapTop'); at(c, 'pullStart'); at(c, 'pullMove', 440); at(c, 'pullEnd'); at(c, 'endTitle'); }, { ff: 0.9 });
  aat(12.55, 'sfx', true);
  aat(12.6, 'finalChord');
  at(12.75, 'endCard');
  return tl.done();
}
