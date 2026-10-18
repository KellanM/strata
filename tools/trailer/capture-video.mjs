// Video pass: renders the trailer frame by frame on a virtual clock, so every
// frame is exactly 1/30 s of game time however long the screenshot takes.
// performance.now, Date.now, requestAnimationFrame and timers are replaced in
// the page; CSS animations are paused and seeked to the same clock. Frames go
// straight into ffmpeg as JPEGs (no frame folder on disk).
//
//   node tools/trailer/capture-video.mjs [out.mp4]      (server on PORT 5198)
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { buildTimeline, PAGE_HELPERS, FPS, SIZE, DURATION, SOLVED } from './timeline.mjs';

const OUT = process.argv[2] ?? 'trailer/video.mp4';
const URL = `http://localhost:${process.env.PORT ?? 5198}/`;
const CHROME = process.env.QA_CHROME;

const VIRTUAL_TIME = `(() => {
  let vt = 0;
  const base = Date.now();
  performance.now = () => vt;
  Date.now = () => base + vt;
  let raf = [], rafId = 1, timers = [], tid = 1;
  window.requestAnimationFrame = (cb) => { const id = rafId++; raf.push([id, cb]); return id; };
  window.cancelAnimationFrame = (id) => { raf = raf.filter((r) => r[0] !== id); };
  window.setTimeout = (fn, ms = 0, ...a) => { const id = tid++; timers.push({ id, at: vt + Math.max(0, +ms || 0), fn, a }); return id; };
  window.clearTimeout = (id) => { timers = timers.filter((t) => t.id !== id); };
  window.setInterval = (fn, ms, ...a) => {
    const id = tid++;
    const tick = () => { timers.push({ id, at: vt + ms, fn: tick, a: [] }); fn(...a); };
    timers.push({ id, at: vt + ms, fn: tick, a: [] });
    return id;
  };
  window.clearInterval = window.clearTimeout;
  const starts = new WeakMap();
  window.__advance = (ms) => {
    const end = vt + ms;
    for (;;) {
      timers.sort((x, y) => x.at - y.at);
      const t = timers[0];
      if (!t || t.at > end) break;
      timers.shift();
      vt = Math.max(vt, t.at);
      try { typeof t.fn === 'function' && t.fn(...t.a); } catch (e) { console.error(e); }
    }
    vt = end;
    const q = raf; raf = [];
    for (const [, cb] of q) { try { cb(vt); } catch (e) { console.error(e); } }
    for (const an of document.getAnimations()) {
      if (!starts.has(an)) starts.set(an, vt - (an.currentTime ?? 0));
      try { an.pause(); an.currentTime = vt - starts.get(an); } catch (e) {}
    }
  };
})();`;

const browser = await chromium.launch({ executablePath: CHROME, args: ['--autoplay-policy=no-user-gesture-required'] });
const ctx = await browser.newContext({ viewport: { width: SIZE.width, height: SIZE.height }, deviceScaleFactor: SIZE.scale });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
await page.addInitScript(VIRTUAL_TIME);
await page.addInitScript((solved) => {
  localStorage.clear();
  localStorage.setItem('strata.tutorial', '1');
  localStorage.setItem('strata.install.later', String(Date.now()));
  localStorage.setItem('strata.chapters', JSON.stringify(['First Light', 'Moss Garden', 'The Orchard', 'The Lagoon', 'Ember Steps', 'Lantern Festival', 'Starfall']));
  const s = {}; solved.forEach((id) => { s[id] = { time: 80, mistakes: 0, stars: 3, score: 1500 }; });
  localStorage.setItem('strata.solved', JSON.stringify(s));
  localStorage.setItem('strata.sfx', '0');   // the video pass is silent
}, SOLVED);
await page.goto(URL);
await page.waitForFunction(() => window.strata && window.__advance);
for (let k = 0; k < 30; k++) await page.evaluate(() => window.__advance(1000 / 30));
await page.evaluate(PAGE_HELPERS);

const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-pix_fmt', 'yuv420p', '-r', String(FPS), OUT], { stdio: ['pipe', 'inherit', 'inherit'] });

const timeline = buildTimeline().filter((a) => !a.audio);
const frames = Math.round((+process.env.LIMIT || DURATION) * FPS);
let next = 0;
const t0 = Date.now();
for (let f = 0; f < frames; f++) {
  const time = f / FPS;
  while (next < timeline.length && timeline[next].t <= time + 1e-6) {
    const a = timeline[next++];
    if (a.act === 'ff') {
      const steps = Math.round(a.args[0] * FPS);
      for (let k = 0; k < steps; k++) await page.evaluate(() => window.__advance(1000 / 30));
    } else {
      await page.evaluate(([act, args]) => window.__trailer[act](...args), [a.act, a.args]);
    }
  }
  await page.evaluate(() => window.__advance(1000 / 30));
  const jpg = await page.screenshot({ type: 'jpeg', quality: 94 });
  if (!ff.stdin.write(jpg)) await new Promise((r) => ff.stdin.once('drain', r));
  if (f % 60 === 0) console.log(`frame ${f}/${frames}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
}
ff.stdin.end();
await new Promise((r) => ff.on('close', r));
await browser.close();
console.log('video done', OUT, errors.length ? 'ERRORS: ' + errors.join(' | ') : 'no page errors');
