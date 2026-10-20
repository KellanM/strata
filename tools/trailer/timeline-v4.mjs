// Ad v4 (about 21 s): the flagship ad (docs/trailer-study.md, v4; docs/ad-playbook.md).
// Payoff first: the Dragon Head's stone with one cube left, "ONE TAP / LEFT…", the
// tap, and it whirls round to face you. Then the mechanic, on the Sloth: TAP, PEEL,
// REVEAL, and it lands. Then COLLECT THEM ALL: four more, settled, their gems
// landing. Saturday's 100+ wall, now with the rolling number's own ticks. Then the
// map, the pull up to the title, and Saturday's PLAY NOW card over its blur.
// Every reveal lands (SETTLE) before any cut.
import { makeTimeline, blurCut, storage as save, PAGE_HELPERS as HELPERS, SETTLE } from './v3-common.mjs';

export const FPS = 30;
export const SIZE = { width: 540, height: 960, scale: 2 };   // → 1080×1920
export const POSTER = 5.5;        // the Dragon Head, settled, facing you, its first gem lit
export const AUDIO_LEAD = 0.08;
export const SHEET_FPS = 2;
export const LUFS = -14;
export const PAGE_HELPERS = HELPERS;
const BEAT = 60 / 72, GEMS_AT = 4.1;

const HOOK = 'dragon-head', TPR = 'sloth';
const MONTAGE = ['maneki-neko', 'anglerfish', 'windmill', 'pumpkin'];
export const REVEALS = [HOOK, TPR, ...MONTAGE];
export const storage = () => save(REVEALS, HOOK);
// before t = 0: off the title, the wall's tiles drawn, and the Dragon Head's stone
// carved down to its last cube (the sound pass hears none of it)
export const PREROLL = [['enterMap', [], 2.4], ['wallBuild', [], 0.1], ['level', [HOOK, 1.0], 0.1], ['prep', [1, 0], 1.2]];

export function buildTimeline() {
  const tl = makeTimeline();
  const { at, aat } = tl;

  // 0.0 HOOK - tension and payoff at once: one cube left on the Dragon Head's stone
  at(0.0, 'cap', 'one tap|left…', 'say heavy light up');   // words from the very first frame
  const hookWin = 0.85;
  at(hookWin, 'tap');                      // flash; it leaps, whirls and turns to face you
  at(1.75, 'cap', null);                   // through the flash, gone before its name settles in

  // TAP / PEEL / REVEAL on the Sloth: about a second a word, then its reveal lands
  let c = hookWin + SETTLE + 0.12;         // 5.77
  blurCut(tl, c, (s) => { at(s, 'level', TPR, 1.0); });
  at(c + 0.04, 'cap', 'tap', 'verb heavy light up');
  aat(c + 0.16, 'sfx', true);
  [0.2, 0.37, 0.54].forEach((d) => at(c + d, 'tap'));
  at(c + 0.68, 'rowTap');
  at(c + 0.82, 'rowTap2');
  c += 1.1;                                // 6.87
  blurCut(tl, c, (s) => { at(s, 'prep', 0, 0, 0.45); }, { ff: 0.6 });
  at(c + 0.02, 'cap', 'peel', 'verb heavy light up');
  aat(c + 0.1, 'sfx', true);
  [0.18, 0.4, 0.62, 0.84].forEach((d, k) => at(c + d, 'peel', 0, k + 1));
  c += 1.1;                                // 7.97
  blurCut(tl, c, (s) => { at(s, 'peel', 0, 0); at(s, 'prep', 2); }, { ff: 0.6 });
  at(c + 0.02, 'cap', 'reveal', 'verb heavy gold up');
  aat(c + 0.14, 'sfx', true);
  at(c + 0.18, 'tap');
  const slothWin = c + 0.42;
  at(slothWin, 'tap');                     // the Sloth
  at(c + 1.15, 'cap', null);

  // COLLECT THEM ALL: four more, settled and facing you, as their last gems land (0.95 s each)
  c = slothWin + SETTLE + 0.12;            // 13.31
  at(c, 'noName', true);
  at(c + 0.08, 'cap', 'collect|them all', 'say heavy light up');
  MONTAGE.forEach((id, k) => {
    const t = c + k * 0.95, ff = SETTLE + 0.05;
    blurCut(tl, t, (s) => { at(s, 'level', id, 1.0); at(s, 'prep', 0); }, { ff });
    [1, 2].forEach((g) => { const when = t + GEMS_AT + g * BEAT - ff; if (when < t + 0.95) aat(when, 'gem', g); });
  });
  c += MONTAGE.length * 0.95;              // 17.11
  at(c - 0.12, 'capClear');

  // THE WALL (Saturday's), with the rolling number's own ticks and a bell on 100+
  at(c - 0.1, 'blurOut', 0.1);
  aat(c - 0.1, 'whoosh');
  at(c, 'noName', false);
  at(c, 'wall', true);
  aat(c, 'sfx', true);
  at(c + 0.06, 'countRoll', 100, 1.1, 'num gold');
  at(c + 0.35, 'cap2', 'puzzles', 'numsub');
  at(c + 1.38, 'capClear');
  c += 1.45;                               // 18.56

  // THE END: the map; a quick pull down at its top brings the night sky and the
  // title down; it blurs under Saturday's CTA (STRATA, PLAY NOW, the badges)
  blurCut(tl, c, (s) => { at(s, 'wall', false); at(s, 'mapTop'); }, { ff: 0.2 });
  aat(c + 0.02, 'sfx', true);              // the 100+ bell rings on through the cut
  at(c + 0.1, 'pullStart');
  for (let f = 1; f <= 6; f++) at(c + 0.1 + f / 30, 'pullMove', Math.round(440 * (1 - Math.pow(1 - f / 6, 2))));
  at(c + 0.1 + 7 / 30, 'pullEnd');
  const end = c + 0.62;
  at(end, 'endCard');
  aat(end + 0.15, 'finalChord');
  return tl.done();
}
// the CTA holds 2.3 s
export const DURATION = +(buildTimeline().find((a) => a.act === 'endCard').t + 2.3).toFixed(2);
