// Shared by trailer v3 (timeline-v3.mjs, ~28 s) and the v3 ad (timeline-v3ad.mjs, 15 s):
// the save, the page helpers, and the beat builders both cuts are made of.
// docs/trailer-study.md, v3.
//
// Every tap in v3 is a real tap: pointer events at a screen point that the
// game's own pick() resolves to the intended cube (checked here with the same
// voxel walk before tapping), with a touch ring drawn where the finger lands.
// Blocks are set up off-screen (under a cut) by chiselling everything but the
// cubes the shot needs; the game sees ordinary chisels.

const S = await import('../../public/js/shapes.js');
export const COUNTS = {
  stones: S.SHAPES.length,
  chapters: S.CHAPTERS.length,
  shrines: S.BONUS.filter((b) => !S.RETIRED.has(b.id)).length,
};
// the settle time of a reveal, measured (tools/trailer/settle.mjs): after the winning
// tap the object has turned to face you and stopped (within 1.5°, under 2°/s) at 4.77 s
export const SETTLE = 4.8;

const SOLVED_STATS = { time: 80, mistakes: 0, stars: 3, score: 1500 };
// the save: nearly everything uncovered (the journal is a full wall), except
// the objects the cut reveals. Autumn Woods' mist has never lifted, so the map
// parts it on screen when it opens (with the companion one stone back from the
// first open stone, the parting starts about 1.7 s in: map.js).
export const UNPARTED = 'Autumn Woods';
// walkTo: the stone that will be the first open one when the map is shown (the
// companion waits one stone before it, so its walk is one stone long)
export function storage(reveals, walkTo) {
  const solved = {};
  for (const s of S.SHAPES) if (!reveals.includes(s.id)) solved[s.id] = SOLVED_STATS;
  for (const b of S.BONUS) if (!reveals.includes(b.id) && !S.RETIRED.has(b.id)) solved[b.id] = SOLVED_STATS;
  const names = S.CHAPTERS.map((c) => c.name);
  const parted = names.filter((n) => n !== UNPARTED);
  const before = S.SHAPES[Math.max(0, S.SHAPES.findIndex((s) => s.id === walkTo) - 1)];
  return {
    'strata.tutorial': '1',
    'strata.install.later': String(Date.now()),
    'strata.ads.off': '1',
    'strata.solved': JSON.stringify(solved),
    'strata.chapters': JSON.stringify(names),
    'strata.map.objects': JSON.stringify(Object.keys(solved)),
    'strata.map.chapters': JSON.stringify(parted),
    'strata.map.parted': JSON.stringify(parted),
    'strata.map.lit': JSON.stringify(['learn', ...Object.keys(solved)]),
    'strata.map.companion': before.id,
  };
}

// ------------------------------------------------------------------ beats
// Each builder pushes actions onto the timeline from t0 and returns when it ends.
// `at`: both passes; `vat`: the frame-stepped video only; `aat`: the real-time audio only.
export function makeTimeline() {
  const T = [];
  const at = (t, act, ...args) => T.push({ t: +t.toFixed(4), act, args });
  const vat = (t, act, ...args) => T.push({ t: +t.toFixed(4), act, args, video: true });
  const aat = (t, act, ...args) => T.push({ t: +t.toFixed(4), act, args, audio: true });
  const done = () => T.sort((a, b) => a.t - b.t);
  return { T, at, vat, aat, done };
}

// a cut to a fresh shot: the outgoing picture smears and blooms, the new one is
// set up under the blur (and fast-forwarded in the video pass), then sharpens.
// `setup` runs at the cut with sfx muted (the shot turns them back on); returns when it's clear.
export function blurCut(tl, t, setup, { ff = 0.8, out = 0.1, inn = 0.18, whoosh = true } = {}) {
  const { at, vat, aat } = tl;
  at(t - out, 'blurOut', out);
  if (whoosh) aat(t - out, 'whoosh');
  at(t, 'sfx', false);
  setup(t);
  if (ff) vat(t, 'ff', ff);
  at(t + 0.02, 'blurIn', inn);
  return t + inn;   // sfx stay muted: the shot unmutes just before its first sound
}

import { pageHelpers } from './v3-page.mjs';
// the official store badges (unmodified; tools/trailer/badges) for the end card
import { readFileSync } from 'node:fs';
const b64 = (f) => readFileSync(new URL('./badges/' + f, import.meta.url)).toString('base64');
const BADGES = { apple: 'data:image/svg+xml;base64,' + b64('app-store.svg'), google: 'data:image/png;base64,' + b64('google-play.png') };
export const PAGE_HELPERS = '(' + pageHelpers.toString() + ')(' + JSON.stringify({ badges: BADGES }) + ');';
