// v5: Saturday's v2 cuts (tools/trailer/v2/timeline.mjs, approved), ported to
// today's game. Same shot plan, pacing, cuts, captions, sfx, wall and end card;
// only these changed (docs/trailer-v2-study.md, "v5 port"):
//   - montage heroes: the Sloth (3rd beat, in for the Wishing Well, which moves
//     to the last, blurred beat) and the Moss Tortoise (the Moss Garden's shrine,
//     in for the Daruma); the Sunflower is out. The ad's 4th beat: the Sloth in
//     for the Planet
//   - the Windmill gets a camera offset so it lands facing us (FACE)
//   - the map scroll covers half of today's longer map, at v2's speed (MAP_SPAN)
//   - the map beat says FIFTEEN WORLDS (there are 15 chapters now, not seven)
//
// The v2 scripts: a 25 s trailer and a 15 s ad, both reward-led. Each cut is a
// list of actions on SCREEN time. Both capture passes play the same list:
//   - video pass: frame-stepped; `ff` (a hidden fast-forward of the game) and
//     `speed` (game time per screen frame: slow-mo / catch-up) only apply here
//   - audio pass: real time; visual-only actions are skipped (VISUAL)
// plus a list of ad SFX cues (whooshes, impacts, a riser) that sfx.mjs renders
// offline and build.mjs mixes under the game's own sound.
export const FPS = 30;
export const SIZE = { width: 540, height: 960, scale: 2 };   // → 1080×1920

export const VISUAL = new Set(['text', 'textOut', 'count', 'whip', 'flash', 'finger', 'orbit', 'zoomBy','grid', 'endcard', 'titles', 'strikes', 'speaker', 'mapScroll', 'mapBlur', 'ff', 'speed']);

// every level counts as solved, so the map and the content wall are full
export const ALL_SOLVED = true;

export function script() {
  const T = [], S = [];
  const at = (t, act, ...args) => T.push({ t, act, args });
  const vat = (t, act, ...args) => T.push({ t, act, args, video: true });
  const aat = (t, act, ...args) => T.push({ t, act, args, audio: true });
  const cue = (t, kind, ...args) => S.push({ t, kind, args });
  // a whip-blur cut: the blur peaks (and the scene swaps) at tc. w shapes its
  // whoosh ({ pitch, len, gain, q }) so no two sound alike; w = null: no whoosh
  const cut = (tc, dir = 1, flash = false, dur = 0.3, w = {}) => {
    at(tc - dur / 2, 'whip', dir, flash, dur);
    if (w) cue(tc, 'whoosh', dir, dur, w);
  };
  const reveal = (t) => { at(t, 'flash'); cue(t, 'impact'); };
  // a finger turning the finished object: per-frame camera steps + the finger dot
  // (zoom: an overall punch-in over the turn)
  const turn = (t0, t1, az, el = 0, x0 = 0.3, x1 = 0.7, y = 0.62, zoom = 1.3) => {
    const n = Math.round((t1 - t0) * FPS);
    at(t0 - 0.12, 'finger', x0, y, true);
    for (let k = 1; k <= n; k++) {
      const e0 = ease((k - 1) / n), e1 = ease(k / n);
      at(t0 + k / FPS, 'orbit', az * (e1 - e0), el * (e1 - e0));
      at(t0 + k / FPS, 'zoomBy', Math.pow(zoom, e1 - e0));
      at(t0 + k / FPS, 'finger', x0 + (x1 - x0) * e1, y - 0.03 * Math.sin(Math.PI * e1), true);
    }
    at(t1 + 0.08, 'finger', x1, y, false);
  };
  const ease = (k) => k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
  // a slow-mo on impact that catches back up, so picture and sound re-align
  const slowmo = (t, slow = 0.35, len = 0.5, fast = 1.7) => {
    const f = len * (1 - slow) / (fast - 1);
    vat(t, 'speed', slow); vat(t + len, 'speed', fast); vat(t + len + f, 'speed', 1);
    return t + len + f;
  };
  // run the game fast for a stretch (picture only), to get to the revealed object sooner
  const rush = (t0, t1, x) => { vat(t0, 'speed', x); vat(t1, 'speed', 1); };
  return { T, S, at, vat, aat, cue, cut, reveal, turn, slowmo, rush };
}

// --- shared beats -------------------------------------------------------------
function hook(s, end) {
  const { at, vat, cue, reveal, turn, slowmo } = s;
  at(0, 'level', 'maneki-neko', 1.3, { left: 5 });
  vat(0, 'ff', 0.8);
  at(0.04, 'text', ["WHAT'S", 'INSIDE?'], 0.07, 66, 'light');
  [0.32, 0.56, 0.76, 0.92, 1.06].forEach((t) => at(t, 'tap'));
  at(1.0, 'textOut');
  reveal(1.06);
  const back = slowmo(1.08);
  turn(Math.max(back, 2.2), end - 0.08, -1.5, 0.12, 0.3, 0.72);
}

function triplet(s, o, reveal = { id: 'koinobori', zoom: 1.15 }) {
  const { at, vat, cut } = s;
  // each word holds L = 1.25 s: the slam lands sharp by ~+0.25 s and stays clear
  // until the next whip starts blurring at L − 0.15, so ~0.85 s fully legible,
  // with its action playing under it. Each whoosh is its own size; the reveal
  // cut has none (its flash and impact carry it). Returns the section's end.
  const L = TRIPLET_BEAT;
  cut(o, 1, false, 0.3, { pitch: 0.8, len: 1.15, gain: 1 });
  at(o, 'level', 'kokeshi', 1.2, { left: 0.45 });
  vat(o, 'ff', 0.8);
  at(o + 0.02, 'text', ['TAP'], 0.74, 92, 'light', true);
  for (let k = 0; k < 7; k++) at(o + 0.18 + k * 0.14, 'tap');
  cut(o + L, -1, false, 0.26, { pitch: 1.15, len: 0.8, gain: 0.75, q: 2.2 });
  at(o + L, 'level', 'tea-house', 1.25, { left: 0.6 });
  vat(o + L, 'ff', 0.8);
  at(o + L + 0.02, 'text', ['PEEL'], 0.74, 92, 'light', true);
  at(o + L + 0.22, 'peel', 0, 1);
  at(o + L + 0.47, 'peel', 0, 2);
  at(o + L + 0.72, 'peel', 0, 3);
  cut(o + 2 * L, 1, false, 0.22, null);
  at(o + 2 * L, 'level', reveal.id, reveal.zoom, { left: 1 });
  vat(o + 2 * L, 'ff', 0.8);
  at(o + 2 * L + 0.1, 'tap');
  s.reveal(o + 2 * L + 0.1);
  s.rush(o + 2 * L + 0.2, o + 2 * L + 0.8, 1.9);
  at(o + 2 * L + 0.12, 'text', ['REVEAL'], 0.74, 92, 'gold', true);
  return o + 3 * L;
}
const TRIPLET_BEAT = 1.25;
// v5b: the ad's REVEAL scene, from The Deep (env DEEP='{"id":..,"zoom":..}' to audition)
const DEEP = { id: 'seahorse', zoom: 1.3, ...JSON.parse(process.env.DEEP ?? '{}') };
// v5: today's win whirls onto the map thumbnail's pose, and 2.1 s in it is still
// turning; a camera offset so these land facing us (radians, trailer-side)
const FACE = { windmill: -0.9, sloth: -1.4, ...JSON.parse(process.env.FACE ?? '{}') };

// reveals cut faster and faster (each gap r × the last), a riser leading in.
// Whooshes thin out and shrink as the cuts speed up: big and low on the first,
// then smaller and higher, and only on some cuts.
function montage(s, o, ids, total, r = 0.86, text = true) {
  const { at, vat, aat, cue, cut } = s;
  const n = ids.length, g0 = total * (1 - r) / (1 - Math.pow(r, n));
  cue(o - 0.85, 'riser', 0.85, 0.6);
  const JITTER = [1, 0.9, 1.12, 0.95, 1.2, 0.88, 1.08, 1.15, 0.92, 1.04];
  let tc = o;
  ids.forEach((id, k) => {
    const gap = g0 * Math.pow(r, k), u = k / (n - 1);
    const dur = k === 0 ? 0.3 : Math.min(0.22, gap * 0.55);
    const whoosh = k < 3 || k % 2 === 0
      ? { pitch: (0.85 + 0.7 * u) * JITTER[k % JITTER.length], len: 1.1 - 0.55 * u, gain: 1 - 0.6 * u, q: 1.2 + 1.6 * u }
      : null;
    cut(tc, k % 2 ? -1 : 1, k === 0, dur, whoosh);
    at(tc, 'level', id, 1.0, { silent: true, solve: true, keepText: k > 0 });
    vat(tc, 'ff', 2.1);
    if (FACE[id]) at(tc, 'orbit', FACE[id], 0);   // after the ff: the win's own framing has finished by then
    aat(tc, 'chime', k);
    for (let f = 1; f < Math.round(gap * FPS); f++) { at(tc + f / FPS, 'orbit', 0.022, 0); at(tc + f / FPS, 'zoomBy', 1.008); }
    tc += gap;
  });
  if (text) {
    // the game's own "you uncovered …" title would sit under the words: hide it here
    at(o, 'titles', false);
    at(o + 0.18, 'text', ['COLLECT', 'THEM ALL'], 0.11, 62, 'light');
    at(o + total - 0.35, 'textOut');
    at(o + total, 'titles', true);
  }
}

function hundred(s, o, len) {
  const { at, cue, cut } = s;
  cut(o, 1, true, 0.3, { pitch: 0.65, len: 1.3, gain: 1, q: 1 });
  at(o, 'grid', true);
  at(o + 0.08, 'count', 0.33);
  cue(o + 0.08, 'count', 1.15);
  at(o + 0.5, 'text', ['PUZZLES'], 0.5, 56, 'light');
  cue(o + 1.23, 'impact', 0.6);
  at(o + len - 0.3, 'textOut');
}

function endcard(s, o) {
  const { at, aat, cue } = s;
  at(o - 0.1, 'textOut');
  at(o, 'endcard');
  at(o, 'finger', 0.5, 0.6, false);
  cue(o, 'boom');
  aat(o + 0.05, 'finalChord');
  cue(o + 0.72, 'pop');
}

// --- the 25 s trailer ---------------------------------------------------------
export function trailer() {
  const s = script();
  const { at, vat, aat, cue, cut, reveal, turn, slowmo } = s;
  hook(s, 3.1);
  const F = triplet(s, 3.1);             // 6.85

  // F: the block assembles itself, then gives up its secret
  cut(F, -1, false, 0.3, { pitch: 0.7, len: 1.25, gain: 0.85, q: 1 });
  at(F, 'level', 'origami-fox', 1.0, { intro: true });
  at(F + 0.12, 'text', ['EVERY BLOCK'], 0.12, 58, 'light');
  cut(F + 1, 1, false, 0.24, { pitch: 1.25, len: 0.7, gain: 0.55, q: 2.6 });
  at(F + 1, 'level', 'origami-fox', 1.1, { left: 4 });
  vat(F + 1, 'ff', 0.8);
  at(F + 1.02, 'text', ['HIDES A', 'SECRET'], 0.12, 58, 'light');
  [1.16, 1.36, 1.53, 1.68].forEach((t) => at(F + t, 'tap'));
  at(F + 1.64, 'textOut');
  reveal(F + 1.68);
  // the hold: the reveal plays out in full (no rush), then a finger turns the
  // finished Fox with a slow push-in while its title, gems and score land
  turn(F + 2.9, F + 5.2, -1.2, -0.06, 0.72, 0.3, 0.6, 1.6);

  // montage of reveals, accelerating (the Windmill is its quick first beat), ending
  // where the 100+ wall has always started
  montage(s, F + 5.25, ['windmill', 'pumpkin', 'sloth', 'planet', 'bonus-moss-garden', 'wishing-well'], 14.26 - (F + 5.25), 0.84);

  // 14.26 100+ puzzles
  hundred(s, 14.26, 2.34);

  // 16.6 the map: fifteen worlds (the sea of clouds and its island peaks)
  cut(16.6, -1, false, 0.3, { pitch: 1.05, len: 1, gain: 0.7, q: 1.6 });
  at(16.6, 'grid', false);
  at(16.6, 'map');
  vat(16.6, 'ff', 0.8);
  for (let k = 0; k <= 63; k++) at(16.6 + k / FPS, 'mapScroll', 1 - ease3(k / 63), MAP_SPAN);
  at(16.72, 'text', ['FIFTEEN', 'WORLDS'], 0.11, 66, 'ink');
  at(18.45, 'textOut');

  // 18.75 hero: the Dragon Head, last taps in slow motion
  cut(18.75, 1, true, 0.3, { pitch: 0.75, len: 1.2, gain: 0.9, q: 1.2 });
  at(18.75, 'level', 'dragon-head', 1.15, { left: 3 });
  vat(18.75, 'ff', 0.8);
  at(18.8, 'text', ['UNCOVER', 'THEM ALL'], 0.11, 66, 'light');
  [19.2, 19.55, 19.85].forEach((t) => at(t, 'tap'));
  at(19.8, 'textOut');
  reveal(19.85);
  const back = slowmo(19.87, 0.3, 0.45, 1.8);
  cue(21.0, 'riser', 1.1);
  turn(back + 0.02, 21.95, -1.0, 0.08, 0.35, 0.62, 1.25);

  endcard(s, 22.1);
  return finish(s, 25.0);
}

// --- the 15 s ad --------------------------------------------------------------
export function ad() {
  const s = script();
  const { at, vat, aat, cue } = s;
  hook(s, 2.6);
  // v5b (Kellan: "a scene from the deep world ... the color scheme there is amazing"):
  // the REVEAL beat opens on the Deep's teal sea, and the Seahorse lands orange on it
  const M = triplet(s, 2.6, { id: DEEP.id, zoom: DEEP.zoom });   // 6.35
  montage(s, M, ['windmill', 'pumpkin', 'origami-fox', 'sloth'], 8.0 - M, 0.84);
  hundred(s, 8.0, 2.0);                  // the 100+ wall keeps its length and timing

  // 10.0 the Dragon Head: two taps, "ONE TAP LEFT…", the last tap, the full reveal
  s.cut(10.0, -1, true, 0.3, { pitch: 0.9, len: 1.1, gain: 0.85, q: 1.3 });
  at(10.0, 'grid', false);
  at(10.0, 'level', 'dragon-head', 1.15, { left: 3, mute: ['star', 'tick', 'tickDone', 'best'] });
  vat(10.0, 'ff', 0.8);
  [10.3, 10.52].forEach((t) => at(t, 'tap'));
  at(10.56, 'text', ['ONE TAP', 'LEFT...'], 0.11, 66, 'light');
  at(11.22, 'textOut');
  at(11.3, 'tap');
  s.reveal(11.3);
  // a beat of slow motion on the impact, then the game runs fast (picture only)
  // so the head turns to face us and the gems land before the end card
  vat(11.32, 'speed', 0.4); vat(11.52, 'speed', 4); vat(12.15, 'speed', 1);
  s.turn(11.8, 12.42, -1.0, 0.08, 0.35, 0.62, 1.25);
  // the game's own gem chimes would land late in real time: play them on the picture's gems
  aat(12.0, 'sound', 'star', 0);
  aat(12.25, 'sound', 'star', 1);
  endcard(s, 12.5);
  return finish(s, 15.0);
}

// v5: the share of today's (twice as long) map the 2.1 s scroll covers, so it moves at v2's speed
const MAP_SPAN = 0.5;
function ease3(k) { return 1 - Math.pow(1 - k, 3); }
export function finish(s, duration) {
  return { actions: s.T.sort((a, b) => a.t - b.t), cues: s.S.sort((a, b) => a.t - b.t), duration };
}
export const CUTS = { trailer, ad };
