// Audio pass: plays the same timeline in real time and records the game's own
// sound (the engine's output bus, tapped into a MediaRecorder). The picture is
// rendered too but not kept; it's kept small so timers stay punctual.
//
//   node tools/trailer/capture-audio.mjs [out.webm]     (server on PORT 5198)
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
import { buildTimeline, PAGE_HELPERS, DURATION, SOLVED } from './timeline.mjs';

const OUT = process.argv[2] ?? 'trailer/audio.webm';
const URL = `http://localhost:${process.env.PORT ?? 5198}/`;
const browser = await chromium.launch({ executablePath: process.env.QA_CHROME, args: ['--autoplay-policy=no-user-gesture-required'] });
const ctx = await browser.newContext({ viewport: { width: 540, height: 960 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
await page.addInitScript((solved) => {
  localStorage.clear();
  localStorage.setItem('strata.tutorial', '1');
  localStorage.setItem('strata.install.later', String(Date.now()));
  localStorage.setItem('strata.chapters', JSON.stringify(['First Light', 'Moss Garden', 'The Orchard', 'The Lagoon', 'Ember Steps', 'Lantern Festival', 'Starfall']));
  const s = {}; solved.forEach((id) => { s[id] = { time: 80, mistakes: 0, stars: 3, score: 1500 }; });
  localStorage.setItem('strata.solved', JSON.stringify(s));
}, SOLVED);
await page.goto(URL);
await page.waitForFunction(() => window.strata);
await page.evaluate(PAGE_HELPERS);

const timeline = buildTimeline().filter((a) => !a.video);
const b64 = await page.evaluate(async ({ timeline, duration }) => {
  const m = await import('./js/audio.js');
  window.__trailer.audioModule(m);
  const s = m.sound;
  s.unlock();
  // trailer mix: the satisfying sounds lead, the bed sits under them
  const SFX = 1.0;
  s.setSfx = (on) => { for (const b of [s.sfx, s.sfxTonal, s.heaven]) b.gain.setTargetAtTime(on ? SFX : 0, s.ctx.currentTime, 0.02); };
  s.setSfx(true); s.setMusic(true);
  await new Promise((r) => setTimeout(r, 300));
  // a trailer wants the bed a little more present than in play
  s.music.gain.setTargetAtTime(0.16, s.ctx.currentTime, 0.4);
  const dest = s.ctx.createMediaStreamDestination();
  s.out.connect(dest);
  await new Promise((r) => setTimeout(r, 2500));          // let the bed bloom in before t = 0
  const rec = new MediaRecorder(dest.stream, { mimeType: 'audio/webm;codecs=opus', audioBitsPerSecond: 256000 });
  const chunks = [];
  rec.ondataavailable = (e) => chunks.push(e.data);
  const started = new Promise((r) => { rec.onstart = r; });
  rec.start(250);
  await started;
  const t0 = performance.now();
  for (const a of timeline) {
    setTimeout(() => { try { window.__trailer[a.act](...a.args); } catch (e) { console.error(a.act, e); } }, a.t * 1000);
  }
  await new Promise((r) => setTimeout(r, duration * 1000 + 400));
  const stopped = new Promise((r) => { rec.onstop = r; });
  rec.stop();
  await stopped;
  const blob = new Blob(chunks, { type: 'audio/webm' });
  const buf = new Uint8Array(await blob.arrayBuffer());
  let bin = '';
  for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode(...buf.subarray(i, i + 0x8000));
  console.log('drift check', ((performance.now() - t0) / 1000).toFixed(2));
  return btoa(bin);
}, { timeline, duration: DURATION });
writeFileSync(OUT, Buffer.from(b64, 'base64'));
await browser.close();
console.log('audio done', OUT, errors.length ? 'ERRORS: ' + errors.join(' | ') : 'no page errors');
