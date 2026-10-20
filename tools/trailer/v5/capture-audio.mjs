// v5: v2's audio pass, with the lock and v5's save (see capture-video.mjs).
//
// Audio pass for the v2 cuts: plays the cut's sound-making actions in real
// time against the game and records the engine's output bus (as v1). Picture-
// only actions are skipped; levels the edit only glimpses are hushed, and the
// key is locked so every chisel run, reveal and chime sits in one key.
//
//   node tools/trailer/v5/capture-audio.mjs trailer|ad out.webm     (server on PORT, default 5251)
import { chromium, URL as BASE, withLock } from './lib.mjs';
import { writeFileSync } from 'node:fs';
import { VISUAL, SIZE } from './timeline.mjs';
import { PAGE_HELPERS } from './page.mjs';
import { openPage, CHROME, resolveCut } from './capture-video.mjs';

const [CUT = 'trailer', OUT = `trailer/v5/work/${CUT}-audio.webm`] = process.argv.slice(2);
const URL = BASE;
const { actions, duration, size = SIZE, music = 0.2 } = resolveCut(CUT);   // music: the bed's level under the game's sounds
const KEY = process.env.KEY ?? 'Dusk';

await withLock(async () => {
const browser = await chromium.launch({ executablePath: CHROME, args: ['--autoplay-policy=no-user-gesture-required'] });
// same viewport as the picture (taps pick the cubes that viewport sees), at 1×
const { page, errors } = await openPage(browser, { size, scale: 1, silent: false });
await page.goto(URL);
// launch opens on the title: skip to the map (Enter) and let its first-visit
// celebrations play out of the way, twice (as the video pass does)
for (let k = 0; k < 2; k++) {
  if (k) await page.reload();
  await page.waitForFunction(() => window.strata);
  await page.waitForTimeout(3500);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(2500);
}
await page.evaluate(PAGE_HELPERS);

const list = actions.filter((a) => !a.video && !VISUAL.has(a.act));
const b64 = await page.evaluate(async ({ list, duration, KEY, MUSIC }) => {
  const { sound: s } = await import('/js/audio.js');
  s.unlock();
  s.setKey(KEY);
  s.setKey = () => {};
  window.__trailer.audioModule(s);
  // trailer mix: the satisfying sounds lead, the bed sits under them
  s.setSfx = (on) => { for (const b of [s.sfx, s.sfxTonal, s.heaven]) b.gain.setTargetAtTime(on ? 1.0 : 0, s.ctx.currentTime, 0.02); };
  s.setSfx(true); s.setMusic(true);
  await new Promise((r) => setTimeout(r, 300));
  s.music.gain.setTargetAtTime(MUSIC, s.ctx.currentTime, 0.4);
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
  for (const a of list) {
    setTimeout(() => { try { window.__trailer[a.act](...a.args); } catch (e) { console.error(a.act, e); } }, a.t * 1000);
  }
  await new Promise((r) => setTimeout(r, duration * 1000 + 600));
  const stopped = new Promise((r) => { rec.onstop = r; });
  rec.stop();
  await stopped;
  const buf = new Uint8Array(await new Blob(chunks, { type: 'audio/webm' }).arrayBuffer());
  let bin = '';
  for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode(...buf.subarray(i, i + 0x8000));
  console.log('drift check', ((performance.now() - t0) / 1000).toFixed(2));
  return btoa(bin);
}, { list, duration, KEY, MUSIC: music });
writeFileSync(OUT, Buffer.from(b64, 'base64'));
await browser.close();
console.log('audio done', OUT, errors.length ? 'ERRORS: ' + [...new Set(errors)].join(' | ') : 'no page errors');
});
