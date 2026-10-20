// The v3 ad (15 s): two reveals, each played until it has turned to face you
// and stopped (SETTLE, measured with settle.mjs). The hook's Maneki-neko; v1's
// 100+ puzzles wall; Saturday's ending - "one tap left…" on the Dragon Head's
// stone, the last tap, the head whirls round to face you, its first gem chimes -
// then v1's end card. docs/trailer-study.md, v3 and its revision.
import { makeTimeline, blurCut, storage as save, PAGE_HELPERS as HELPERS, SETTLE } from './v3-common.mjs';

export const FPS = 30;
export const SIZE = { width: 540, height: 960, scale: 2 };   // → 1080×1920
export const DURATION = 15.0;
export const POSTER = 12.0;
export const AUDIO_LEAD = 0.08;
export const SHEET_FPS = 2;
export const LUFS = -14;          // social feeds' common target (docs/trailer-study.md, v3)
export const PAGE_HELPERS = HELPERS;

const HOOK = 'maneki-neko', LAST = 'dragon-head';
export const REVEALS = [HOOK, LAST];
export const storage = () => save(REVEALS, LAST);
// before t = 0: off the title, and the hook's stone set up (its assembly and the
// silent chisels play out here, before the sound pass starts recording)
export const prerollFor = (opening) => [['enterMap', [], 2.4], ['level', [HOOK, 1.0], 0.1], ['prep', [1, opening === 'a' ? 1 : 0], 1.2]];
export const PREROLL = prerollFor('a');
const BEAT = 60 / 72;            // motion.js: the gems land a beat apart
const GEMS_AT = 4.1;             // main.js showResult: the first gem, after the win

// The opening comes in three versions for an A/B test of the hook; each ends
// with the Maneki-neko settled, facing you, by HOOK_END. Everything after is the same.
// timeline-v3ad-b.mjs and -c.mjs pick b and c.
//   a: mechanic into payoff - a row of 0 double-tapped away, the last tap (1.0 s), the reveal
//   b: payoff first - frame one is the last tap; the reveal lands and all three gems chime
//   c: tension - one cube left, held under "one more tap…", then the tap (1.0 s) and the reveal
const HOOK_WIN = { a: 1.0, b: 0.03, c: 1.0 };
const HOOK_END = 1.0 + SETTLE + 0.12;   // 5.92: the blur starts after it has stopped
const OPENINGS = {
  a(tl) {
    const { at } = tl;
    at(0.1, 'cap', 'what’s inside?', 'say light up');
    at(0.25, 'rowTap');
    at(0.4, 'rowTap2');
    at(HOOK_WIN.a, 'tap');
    at(1.9, 'cap', null);                // through the flash, gone before its name settles in
  },
  b(tl) {
    const { at } = tl;
    at(HOOK_WIN.b, 'tap');
    at(0.5, 'cap', 'uncover', 'say light up');
    at(0.65, 'cap2', 'what’s hidden', 'say light up2');
    at(1.9, 'capClear');                 // before its own name settles in under the words
  },
  c(tl) {
    const { at } = tl;
    at(0.08, 'cap', 'one more tap…', 'say light up');
    at(HOOK_WIN.c, 'tap');
    at(1.9, 'cap', null);
  },
};

export function buildTimeline(opening = 'a') {
  const tl = makeTimeline();
  const { at, aat } = tl;

  // 0.0 HOOK: the Maneki-neko's stone (set up in the PREROLL), played until it lands
  OPENINGS[opening](tl);

  // 5.92 THE WALL: v1's map trail rolling past; 100+ puzzles (v1's caption)
  let c = HOOK_END;
  blurCut(tl, c, (s) => { at(s, 'mapTop'); at(s, 'mapScroll', 0); }, { ff: 0.4 });
  for (let k = 0; k <= 30; k++) at(c + 0.03 + k / 30, 'mapScroll', 0.15 + 0.5 * k / 30);
  at(c + 0.08, 'capV1', '100+ puzzles', 'ink safe');
  at(c + 1.0, 'capV1', null);
  c += 1.05;                             // 6.97

  // ONE TAP LEFT: the Dragon Head's stone down to its last cube; the tap; it
  // leaps, whirls round to face you and stops; its first gem lands with its chime
  blurCut(tl, c, (s) => { at(s, 'level', LAST, 1.0); at(s, 'prep', 1); }, { ff: 0.6 });
  at(c + 0.05, 'cap', 'one tap left…', 'say light up');
  aat(c + 0.6, 'sfx', true);
  const win = c + 0.7;                   // 7.67
  at(win, 'tap');
  at(win + 0.9, 'cap', null);            // through the flash, gone before its name settles in

  // END CARD: v1's, as it was, once the head has settled (2.5 s)
  const end = win + SETTLE + 0.05;       // 12.52
  at(end, 'endCard');
  aat(end + 0.15, 'finalChord');
  return tl.done();
}
