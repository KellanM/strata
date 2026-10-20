// Hook-study ads (docs/ad-hooks-study.md, "Top 3 to produce first"), built on
// the v2 pipeline. Each ad is one or more TRACKS (captures, each a script on
// screen time, like the v2 cuts) plus a recipe for build.mjs: how the tracks
// stack into one 1080×1920 frame, which tracks' sound is mixed, and the ad
// SFX cues.
//
// Honesty rules (the study's, binding):
//   - real gameplay only: chiselling is never sped up or skipped mid-shot. A long
//     solve is joined from real segments with visible whip cuts; `speed` /
//     rushes only after the last tap (the reveal animation)
//   - no invented percentages, unprovable superlatives, fake creators or testimonials
//   - every tap ring lands on a visible cube that breaks (or, for a wrong move,
//     takes the game's real mistake) on that frame
import { script, finish, FPS, SIZE } from '../v2/timeline.mjs';

const PANEL3 = { width: 180, height: 960, scale: 2 };    // a third of the frame: 360×1920
const HALF = { width: 540, height: 480, scale: 2 };      // half the frame: 1080×960
const NO_GEM_SOUNDS = ['star', 'tick', 'tickDone', 'best'];

// the end card, with this ad's extra line; type cleared first
function endcard(s, o, over = {}) {
  const { at, aat, cue } = s;
  at(o - 0.1, 'textOut');
  at(o, 'strikes', false);
  at(o, 'finger', 0.5, 0.6, false);
  at(o, 'endcard', over);
  cue(o, 'boom');
  aat(o + 0.05, 'finalChord');
  cue(o + 0.72, 'pop');
}

// ---- 1. "Don't tap that one" (10.5 s): a real wrong move, the correction, the reveal,
// and the gem the mistake cost
function dontTap() {
  const s = script();
  const { at, vat, aat, cue, reveal, turn } = s;
  at(0, 'level', 'origami-fox', 1.3, { left: 7, mute: NO_GEM_SOUNDS });
  vat(0, 'ff', 0.8);
  at(0, 'aimWrong', 0.5, 0.42);              // the finger hovers over a cube of the fox
  at(0, 'strikes', true);
  at(0, 'text', ["DON'T TAP", 'THAT ONE'], 0.08, 60, 'light', false, { now: true });
  at(0.55, 'wrongTap');                       // red flash, shudder, thud, ✕: the game's own
  cue(0.55, 'impact', 0.35);
  at(0.95, 'textOut');
  at(1.15, 'text', ["IT'S PART OF", 'THE FOX'], 0.08, 56, 'light');
  for (let f = 1; f <= 21; f++) at(1.0 + f / FPS, 'zoomBy', 1.006);   // a slow push-in on the marked cube
  [1.9, 2.3, 2.7, 3.05, 3.4, 3.75].forEach((t) => at(t, 'tap'));
  at(3.3, 'textOut');
  at(4.6, 'tap');                             // the last one
  reveal(4.6);
  at(4.95, 'finger', 0.5, 0.6, false);
  // after the last tap only: the finale runs 2.4× (picture) so its title and two
  // gems land in the ad (one ✕ costs the third); the gem chimes play on those frames
  s.rush(5.0, 7.0, 2.4);
  aat(6.54, 'sound', 'star', 0);
  aat(6.89, 'sound', 'star', 1);
  turn(5.6, 7.8, -1.2, -0.06, 0.72, 0.3, 0.6, 1.3);
  endcard(s, 8.0, { line: 'ZERO ✕ = ★★★' });
  return finish(s, 10.5);
}

// ---- 2. "Same block. Different secret." (12 s): three identical 5×10×5 blocks,
// chiselled in step, then revealed one at a time (Garden Gnome, Lighthouse, Rocket)
const SAME = [['gnome', 6.0], ['lighthouse', 7.0], ['rocket', 8.0]];
const SAME_CUT = 2.3, SAME_END = 9.5, SAME_LEN = 12.0;
function samePanel(id, done, first) {
  const s = script();
  const { at, vat, cut } = s;
  // only the first panel's chisel run is heard; the others join for their own last taps
  const mute = first ? NO_GEM_SOUNDS : ['chisel', ...NO_GEM_SOUNDS];
  // segment 1: the whole block (every cube the camera sees still standing), chiselled in step
  at(0, 'level', id, 1.9, { left: 'seen', mute });
  vat(0, 'ff', 0.8);
  at(0, 'titles', false);                     // names go on the overlay, one per panel
  for (let k = 0; k < 15; k++) at(0.12 + k * 0.14, 'tap');
  // segment 2, after a whip (all three panels at once): later in each solve, the shapes diverging
  cut(SAME_CUT, 1, false, 0.3, null);
  at(SAME_CUT, 'level', id, 1.9, { left: 26, mute });
  vat(SAME_CUT, 'ff', 0.8);
  for (let k = 0; k < 21; k++) at(SAME_CUT + 0.2 + k * 0.14, 'tap');   // in step until ~5.3
  at(5.4, 'mute', NO_GEM_SOUNDS);
  for (let j = 0; j < 5; j++) at(done - 0.6 + j * 0.15, 'tap');     // the last five, then the reveal
  at(done, 'flash');
  // once the finale has framed it, push in on the object
  for (let f = 1; f <= 18; f++) at(done + 1.2 + f / FPS, 'zoomBy', Math.pow(1.35, 1 / 18));
  at(SAME_END, 'endcard');
  return { ...finish(s, SAME_LEN), size: PANEL3, mode: 'game' };
}
function sameOverlay() {
  const s = script();
  const { at, cue } = s;
  at(0, 'text', ['SAME BLOCK'], 0.06, 58, 'light', false, { now: true });
  at(0.9, 'textOut');
  at(1.0, 'text', ['3 SECRETS'], 0.06, 58, 'light');
  at(2.1, 'textOut');
  cue(SAME_CUT, 'whoosh', 1, 0.3, { pitch: 0.9, len: 1.1, gain: 0.8 });
  at(4.0, 'text', ['GUESS?'], 0.06, 66, 'gold', true);
  at(5.6, 'textOut');
  const NAMES = { gnome: ['GARDEN', 'GNOME'], lighthouse: ['LIGHT-', 'HOUSE'], rocket: ['ROCKET'] };
  SAME.forEach(([id, done], k) => {
    cue(done, 'impact', 0.7);
    at(done + 0.9, 'text', NAMES[id], 0.875, 25, 'light', false, { x: (k + 0.5) / 3, w: 1 / 3 });
  });
  cue(SAME[0][1] - 0.9, 'riser', 0.85, 0.5);
  endcard(s, SAME_END);
  return { ...finish(s, SAME_LEN), mode: 'overlay' };
}

// ---- 3. "Level 1 vs Level 67" (11 s): Steps on top, Observatory below; Steps is
// done at once, the Observatory is a long solve joined from real segments with
// whip cuts (never sped up), then fills the frame for its reveal
const L67_SPLIT = 6.0, L67_END = 8.5, L67_LEN = 11.0;
function stepsPanel() {
  const s = script();
  const { at, vat } = s;
  at(0, 'level', 'steps', 1.0, { left: 5 });
  at(0, 'titles', false);                     // the overlay labels the halves
  vat(0, 'ff', 0.8);
  [0.3, 0.55, 0.8, 1.05, 1.3].forEach((t) => at(t, 'tap'));
  at(1.3, 'flash');
  at(L67_END, 'endcard');
  return { ...finish(s, L67_LEN), size: HALF, mode: 'game' };
}
function observatory(size) {
  const s = script();
  const { at, vat, cut, turn } = s;
  // segment 1: mid-solve
  at(0, 'level', 'observatory', 1.0, { left: 40, mute: NO_GEM_SOUNDS });
  at(0, 'titles', false);
  vat(0, 'ff', 0.8);
  for (let k = 0; k < 11; k++) at(0.25 + k * 0.155, 'tap');
  // segment 2 (a later moment of the same solve): peel in, look, peel back, chisel
  cut(2.0, -1, false, 0.3, null);
  at(2.0, 'level', 'observatory', 1.0, { left: 24, mute: NO_GEM_SOUNDS });
  vat(2.0, 'ff', 0.8);
  at(2.25, 'peel', 0, 1);
  at(2.6, 'peel', 0, 2);
  at(2.95, 'peel', 0, 0);
  for (let k = 0; k < 6; k++) at(3.15 + k * 0.15, 'tap');
  // segment 3: the last few
  cut(4.0, 1, false, 0.3, null);
  at(4.0, 'level', 'observatory', 1.0, { left: 6, mute: NO_GEM_SOUNDS });
  vat(4.0, 'ff', 0.8);
  [4.3, 4.6, 4.9, 5.15, 5.4, 5.65].forEach((t) => at(t, 'tap'));
  at(5.65, 'flash');
  // after the last tap: the dome turns at the finale's own pace
  turn(6.9, 8.4, 1.0, -0.05, 0.3, 0.7, 0.62, 1.2);
  at(L67_END, 'endcard');
  return { ...finish(s, L67_LEN), size, mode: 'game' };
}
function l67Overlay() {
  const s = script();
  const { at, cue } = s;
  at(0, 'text', ['LEVEL 1'], 0.035, 34, 'light', false, { now: true });
  at(0, 'text', ['LEVEL 67'], 0.535, 34, 'light', false, { now: true });
  cue(1.3, 'impact', 0.5);
  cue(2.0, 'whoosh', -1, 0.3, { pitch: 1.0, len: 1.0, gain: 0.7 });
  cue(4.0, 'whoosh', 1, 0.3, { pitch: 1.2, len: 0.85, gain: 0.6, q: 2 });
  cue(5.65, 'impact', 1);
  at(L67_SPLIT - 0.1, 'textOut');
  cue(L67_SPLIT, 'whoosh', 1, 0.45, { pitch: 0.7, len: 1.2, gain: 0.8, q: 1 });
  at(7.0, 'text', ['67 LEVELS', '7 WORLDS'], 0.08, 52, 'light');
  endcard(s, L67_END);
  return { ...finish(s, L67_LEN), mode: 'overlay' };
}

// ---- 4. "This block is hiding a dragon" (9 s): a declared payoff. The whole
// block with the claim, a real chisel run (two real segments, one whip), "ONE TAP
// LEFT…", the tap, the head turning to us, the gems, the end card
function hidingDragon() {
  const s = script();
  const { at, vat, aat, cue, cut, reveal, turn } = s;
  at(0, 'level', 'dragon-head', 1.15, { left: 'seen', mute: NO_GEM_SOUNDS });
  vat(0, 'ff', 0.8);
  at(0, 'text', ['THIS BLOCK', 'IS HIDING', 'A DRAGON'], 0.06, 52, 'light', false, { now: true });
  for (let k = 0; k < 10; k++) at(0.3 + k * 0.135, 'tap');           // the first crack at 0.3
  at(1.6, 'textOut');
  cut(1.75, 1, false, 0.3, { pitch: 0.85, len: 1.1, gain: 0.8 });
  at(1.75, 'level', 'dragon-head', 1.15, { left: 18, mute: NO_GEM_SOUNDS });
  vat(1.75, 'ff', 0.8);
  for (let k = 0; k < 17; k++) at(1.95 + k * 0.135, 'tap');          // to one cube left
  at(4.25, 'text', ['ONE TAP', 'LEFT...'], 0.08, 62, 'light');
  at(4.9, 'textOut');
  at(4.95, 'tap');
  reveal(4.95);
  // after the last tap only: the finale runs 3.2× (picture) so the head turns to
  // us and its gems land before the end card; their chimes play on those frames
  s.rush(5.1, 6.9, 3.2);
  aat(6.33, 'sound', 'star', 0);
  aat(6.59, 'sound', 'star', 1);
  aat(6.85, 'sound', 'star', 2);
  turn(5.45, 6.85, -1.0, 0.08, 0.35, 0.62, 1.25);
  endcard(s, 7.0);
  return finish(s, 9.0);
}

// ---- 6. "Guess in 3" (9 s): a countdown over a half-chiselled Snail, cubes
// falling on each beat; "SNAIL!" and the reveal; a quick silent round on the
// Pelican; "CAN YOU GUESS FASTER?"; the end card
// Taps go outside in (the cubes farthest from the hidden object first), so the
// silhouette sharpens beat by beat. GUESS_LEFT is how much of the Snail's 24 is
// still covered at the "3": the cubes nearest the snail stay, so its outline is
// there to read but blurred (tuned on the contact sheet).
const GUESS_LEFT = 12;
function guessIn3() {
  const s = script();
  const { at, vat, cue, cut, reveal, turn } = s;
  at(0, 'tapOrder', 'shape');
  at(0, 'titles', false);                                            // the words name it, not the game's title
  at(0, 'level', 'snail', 1.1, { left: GUESS_LEFT, mute: NO_GEM_SOUNDS });
  vat(0, 'ff', 0.8);
  ['3', '2', '1'].forEach((n, b) => {
    at(b, 'text', [n], 0.1, 150, 'gold', true, b === 0 ? { now: true } : {});
    cue(b, 'impact', 0.3);
    for (let k = 0; k < 3; k++) at(b + 0.25 + k * 0.13, 'tap');    // a burst of cubes on each beat
    at(b + 0.92, 'textOut');
  });
  [2.8, 2.92, 3.05].forEach((t) => at(t, 'tap'));                   // the last three
  reveal(3.05);
  at(3.07, 'text', ['SNAIL!'], 0.1, 80, 'gold', true);
  s.rush(3.2, 3.8, 2.5);                                             // the reveal animation only
  at(4.3, 'textOut');
  // round 2: no words
  cut(4.45, -1, false, 0.26, { pitch: 1.15, len: 0.85, gain: 0.7, q: 2 });
  at(4.45, 'level', 'pelican', 1.0, { left: 6, mute: NO_GEM_SOUNDS });
  vat(4.45, 'ff', 0.8);
  [4.75, 4.87, 4.99, 5.3, 5.42].forEach((t) => at(t, 'tap'));
  at(5.75, 'tap');
  reveal(5.75);
  s.rush(5.9, 6.5, 2.5);
  at(6.05, 'text', ['CAN YOU', 'GUESS FASTER?'], 0.08, 52, 'light');
  endcard(s, 7.0);
  return finish(s, 9.0);
}

// ---- 7. "Turn your sound on" (15 s): a tight zoom on the Tea House mid-cascade,
// one long real-time chisel run under a slow orbit, one peel, the reveal,
// "ONE MORE?", the end card. The game's sound leads: the bed sits low, the SFX lower.
const ORBIT = 0.35;          // the camera's slow turn over the run (radians)
function soundOn() {
  const s = script();
  const { at, vat, cue, reveal } = s;
  at(0, 'level', 'tea-house', 2.1, { left: 64, orbitAhead: ORBIT });   // cubes in view from both ends of the orbit
  vat(0, 'ff', 0.8);
  // already mid-cascade on the first frame: two taps just before it, fragments in the air
  at(0, 'tap'); vat(0, 'ff', 0.09); at(0, 'tap'); vat(0, 'ff', 0.09);
  at(0, 'speaker', true);
  for (let k = 0; k < 56; k++) at(0.1 + k * 0.148, 'tap');          // one long run, 0.1–8.2 s
  // a slow turn around it, easing back from the tight zoom so the cubes still to
  // go stay on screen (2.1 → ~1.3 over the run)
  for (let f = 1; f < 9.4 * FPS; f++) { at(f / FPS, 'orbit', ORBIT / (9.4 * FPS), 0); at(f / FPS, 'zoomBy', Math.pow(1.3 / 2.1, 1 / (9.4 * FPS))); }
  at(2.0, 'text', ['TURN YOUR', 'SOUND ON'], 0.08, 44, 'light');
  at(4.2, 'textOut');
  at(8.6, 'peel', 0, 1);                                             // one layer back, a look inside
  at(9.3, 'peel', 0, 0);
  for (let k = 0; k < 6; k++) at(9.55 + k * 0.13, 'tap');           // the last six
  reveal(10.2);
  at(10.2, 'speaker', false);
  s.rush(10.35, 11.35, 1.8);                                         // the reveal animation only
  at(11.5, 'titles', false);                                         // its name has been seen; the question takes its place
  at(11.6, 'text', ['ONE MORE?'], 0.08, 62, 'gold', true);
  endcard(s, 12.5);
  return finish(s, 15.0);
}

export const TRACKS = {
  'hiding-dragon': () => ({ ...hidingDragon(), size: SIZE, mode: 'full' }),
  'guess-in-3': () => ({ ...guessIn3(), size: SIZE, mode: 'full' }),
  'sound-on': () => ({ ...soundOn(), size: SIZE, mode: 'full', music: 0.1 }),
  'dont-tap': () => ({ ...dontTap(), size: SIZE, mode: 'full' }),
  'same-gnome': () => samePanel('gnome', SAME[0][1], true),
  'same-lighthouse': () => samePanel('lighthouse', SAME[1][1], false),
  'same-rocket': () => samePanel('rocket', SAME[2][1], false),
  'same-overlay': sameOverlay,
  'l67-steps': stepsPanel,
  'l67-obs-half': () => observatory(HALF),
  'l67-obs-full': () => observatory(SIZE),
  'l67-overlay': l67Overlay,
};

// how each ad is put together (tools/trailer/ads/build.mjs)
//   video: the tracks to capture; compose: 'single' | 'hstack' | 'vstack-then-full'
//   audio: the tracks whose sound is captured and mixed; sfx: the track holding the ad cues
export const ADS = {
  'hiding-dragon': { duration: 9, video: ['hiding-dragon'], compose: { kind: 'single' }, audio: ['hiding-dragon'], sfx: 'hiding-dragon' },
  'guess-in-3': { duration: 9, video: ['guess-in-3'], compose: { kind: 'single' }, audio: ['guess-in-3'], sfx: 'guess-in-3' },
  'sound-on': { duration: 15, video: ['sound-on'], compose: { kind: 'single' }, audio: ['sound-on'], sfx: 'sound-on', sfxGain: 0.18 },
  'dont-tap': { duration: 10.5, video: ['dont-tap'], compose: { kind: 'single' }, audio: ['dont-tap'], sfx: 'dont-tap' },
  'same-block': {
    duration: SAME_LEN, video: ['same-gnome', 'same-lighthouse', 'same-rocket', 'same-overlay'],
    compose: { kind: 'hstack', panels: ['same-gnome', 'same-lighthouse', 'same-rocket'], overlay: 'same-overlay', blurAt: SAME_END },
    audio: ['same-gnome', 'same-lighthouse', 'same-rocket'], sfx: 'same-overlay',
  },
  'level-1-vs-67': {
    duration: L67_LEN, video: ['l67-steps', 'l67-obs-half', 'l67-obs-full', 'l67-overlay'],
    compose: { kind: 'vstack-then-full', top: 'l67-steps', bottom: 'l67-obs-half', full: 'l67-obs-full', at: L67_SPLIT, overlay: 'l67-overlay', blurAt: L67_END },
    audio: ['l67-steps', 'l67-obs-half'], sfx: 'l67-overlay',
  },
};
