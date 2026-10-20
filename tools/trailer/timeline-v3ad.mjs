// The v3 ad (15 s): two reveals, each played until it has turned to face you
// and stopped (SETTLE, measured with settle.mjs). The hook's Maneki-neko;
// Saturday's 100+ puzzles wall; Saturday's ending - "one tap left…" on the Dragon Head's
// stone, the last tap, the head whirls round to face you, its first gem chimes -
// then Saturday's end card. The wall, end card and caption style follow
// trailer/reference/saturday-ad-15s.mp4. docs/trailer-study.md, v3 and its revisions.
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
export const prerollFor = (opening) => [['enterMap', [], 2.4], ['wallBuild', [], 0.1], ['level', [HOOK, 1.0], 0.1], ['prep', [1, opening === 'a' ? 1 : 0], 1.2]];
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
    at(0.1, 'cap', 'what’s|inside?', 'say light up');
    at(0.25, 'rowTap');
    at(0.4, 'rowTap2');
    at(HOOK_WIN.a, 'tap');
    at(1.9, 'cap', null);                // through the flash, gone before its name settles in
  },
  b(tl) {
    const { at } = tl;
    at(HOOK_WIN.b, 'tap');
    at(0.5, 'cap', 'look|inside', 'say light up');
    at(1.9, 'capClear');                 // before its own name settles in under the words
  },
  c(tl) {
    const { at } = tl;
    at(0.08, 'cap', 'one more|tap…', 'say light up');
    at(HOOK_WIN.c, 'tap');
    at(1.9, 'cap', null);
  },
};

export function buildTimeline(opening = 'a') {
  const tl = makeTimeline();
  const { at, aat } = tl;

  // 0.0 HOOK: the Maneki-neko's stone (set up in the PREROLL), played until it lands
  OPENINGS[opening](tl);

  // 5.92 THE WALL (Saturday's): every object on a dark plum field; the count runs up to 100+, PUZZLES under it
  let c = HOOK_END;
  at(c - 0.1, 'blurOut', 0.1);
  aat(c - 0.1, 'whoosh');
  at(c, 'sfx', false);
  at(c, 'wall', true);
  at(c + 0.05, 'count', 100, 0.75, 'num gold');
  at(c + 0.3, 'cap2', 'puzzles', 'numsub');
  aat(c + 0.8, 'gem', 2);
  at(c + 0.94, 'capClear');
  c += 1.0;                              // 6.92

  // ONE TAP LEFT: the Dragon Head's stone down to its last cube; the tap; it
  // leaps, whirls round to face you and stops; its first gem lands with its chime
  blurCut(tl, c, (s) => { at(s, 'wall', false); at(s, 'level', LAST, 1.0); at(s, 'prep', 1); }, { ff: 0.6 });
  at(c + 0.05, 'cap', 'one tap|left…', 'say light up');
  aat(c + 0.6, 'sfx', true);
  const win = c + 0.55;                  // 7.47
  at(win, 'tap');
  at(win + 0.9, 'cap', null);            // through the flash, gone before its name settles in

  // THE END (Kellan): on the map; a quick pull down at its top brings the night
  // sky and the title down (the game's own ascent); it blurs under Saturday's CTA
  c = win + SETTLE + 0.06;               // 12.33
  blurCut(tl, c, (s) => { at(s, 'mapTop'); }, { ff: 0.2 });
  aat(c + 0.08, 'sfx', true);
  at(c + 0.1, 'pullStart');
  for (let f = 1; f <= 6; f++) at(c + 0.1 + f / 30, 'pullMove', Math.round(440 * (1 - Math.pow(1 - f / 6, 2))));
  at(c + 0.1 + 7 / 30, 'pullEnd');
  const end = c + 0.62;                  // 12.95: the title is down; it blurs, the CTA comes in (2 s)
  at(end, 'endCard');
  aat(end + 0.15, 'finalChord');
  return tl.done();
}
