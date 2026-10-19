// Audio pass: plays the same timeline in real time and records the game's own
// sound (the engine's output bus, tapped into a MediaRecorder). The picture is
// rendered too but not kept; it's kept small so timers stay punctual.
//
//   PORT=5230 TRAILER=v2 node tools/trailer/capture-audio.mjs [out.webm]   (TRAILER unset: v1)
import { chromium } from 'file:///C:/Users/Kellan/AppData/Roaming/npm/node_modules/playwright/index.mjs';   // the global install
import { writeFileSync } from 'node:fs';
import { T, OUT, URL, CHROME, withLock, storageFor, SEED_STORAGE } from './lib.mjs';

const { buildTimeline, PAGE_HELPERS, DURATION, SOLVED = [], PREROLL = [] } = T;
const OUTFILE = process.argv[2] ?? OUT('audio') + '.webm';

await withLock(async () => {
  const browser = await chromium.launch({ executablePath: CHROME, args: ['--autoplay-policy=no-user-gesture-required'] });
  try {
    const ctx = await browser.newContext({ viewport: { width: 540, height: 960 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.addInitScript(SEED_STORAGE, storageFor(SOLVED));
    await page.goto(URL);
    await page.waitForFunction(() => window.strata);
    await page.evaluate(PAGE_HELPERS);

    const timeline = buildTimeline().filter((a) => !a.video);
    const b64 = await page.evaluate(async ({ timeline, duration, preroll }) => {
      const m = await import('./js/audio.js');
      window.__trailer.audioModule(m);
      const s = m.sound;
      s.unlock();
      // trailer mix: the satisfying sounds lead, the bed sits under them
      const SFX = 1.0;
      s.setSfx = (on) => { for (const b of [s.sfx, s.sfxTonal, s.heaven]) b.gain.setTargetAtTime(on ? SFX : 0, s.ctx.currentTime, 0.02); };
      s.setSfx(true); s.setMusic(true);
      await new Promise((r) => setTimeout(r, 300));
      for (const [act, args, secs] of preroll) {
        window.__trailer[act](...args);
        await new Promise((r) => setTimeout(r, secs * 1000));
      }
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
    }, { timeline, duration: DURATION, preroll: PREROLL });
    writeFileSync(OUTFILE, Buffer.from(b64, 'base64'));
    const info = await page.evaluate(() => ({ rows: window.__rows, title: document.querySelector('#title').className }));
    console.log('audio done', OUTFILE, JSON.stringify(info), errors.length ? 'ERRORS: ' + errors.join(' | ') : 'no page errors');
  } finally {
    await browser.close();
  }
});
