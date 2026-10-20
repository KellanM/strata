// Ad v4b: v4 beat for beat, with only the ending redesigned (docs/trailer-study.md, v4b).
// Kellan: Saturday's end card "did a great job ... the background darkened and the play now
// button pulsed"; v4's felt "dry and lifeless". So the CTA comes in as Saturday's did,
// measured frame by frame:
// - the scene darkens about 60% in 0.4 s and the edges keep sinking;
// - STRATA blurs in, then the gem;
// - PLAY NOW pops from 114% and then breathes 100% <-> 106% every 1.1 s with its glow;
// - the badges come in last.
// Calm light keeps it alive (end-card research, docs/trailer-study.md v4b): dust motes rising,
// a shine across the button every 2.2 s, one ring of light from it in place of a tapping
// hand, and the logo stone turning slowly behind the blur. Its sting is on the game's own voices. v4 stays
// as it was, for an A/B.
import * as v4 from './timeline-v4.mjs';

export const { FPS, SIZE, AUDIO_LEAD, SHEET_FPS, LUFS, PAGE_HELPERS, REVEALS, storage, PREROLL } = v4;
export const POSTER = 21.0;       // the living card, the button mid-pulse
export const FADE_OUT = 0;        // hold the card to the last frame (Saturday's did; v4 faded to black)
const HOLD = 3.0;                 // ≥ 3 s on the CTA (Segwise's top-ad benchmark); v4 held 2.3 s

export function buildTimeline() {
  const T = v4.buildTimeline().filter((a) => !['endCard', 'finalChord'].includes(a.act));
  const end = v4.buildTimeline().find((a) => a.act === 'endCard').t;
  const at = (t, act, ...args) => T.push({ t: +t.toFixed(4), act, args });
  const aat = (t, act, ...args) => T.push({ t: +t.toFixed(4), act, args, audio: true });
  at(end, 'endCardLive');
  aat(end, 'stingSwell');
  aat(end + 0.08, 'finalChord');           // the arpeggio, as Saturday's card opened on one
  aat(end + 0.73, 'stingPop');             // PLAY NOW lands
  aat(end + 1.45 + 0.25, 'stingShine');    // the first shine crosses the button's middle: a faint glint
  return T.sort((a, b) => a.t - b.t);
}
export const DURATION = +(v4.buildTimeline().find((a) => a.act === 'endCard').t + HOLD).toFixed(2);
