// Video pass: renders the trailer frame by frame on a virtual clock, so every
// frame is exactly 1/30 s of game time however long the screenshot takes.
// performance.now, Date.now, requestAnimationFrame and timers are replaced in
// the page; CSS animations are paused and seeked to the same clock. Frames go
// straight into ffmpeg as JPEGs (no frame folder on disk).
//
//   PORT=5230 TRAILER=v2 node tools/trailer/capture-video.mjs [out.mp4]
//   (TRAILER unset: v1. LIMIT=secs renders only the start; SCALE=1 renders 540×960 for a quick look)
import { chromium } from 'file:///C:/Users/Kellan/AppData/Roaming/npm/node_modules/playwright/index.mjs';   // the global install
import { spawn } from 'node:child_process';
import { T, OUT, URL, CHROME, VIRTUAL_TIME, withLock, storageFor, SEED_STORAGE } from './lib.mjs';

const { buildTimeline, PAGE_HELPERS, FPS, SIZE, DURATION, SOLVED = [], PREROLL = [] } = T;
const OUTFILE = process.argv[2] ?? OUT('video') + '.mp4';
const scale = +process.env.SCALE || SIZE.scale;
const step = (page, n = 1) => page.evaluate((n) => { for (let k = 0; k < n; k++) window.__advance(1000 / 30); }, n);

await withLock(async () => {
  const browser = await chromium.launch({ executablePath: CHROME, args: ['--autoplay-policy=no-user-gesture-required'] });
  try {
    const ctx = await browser.newContext({ viewport: { width: SIZE.width, height: SIZE.height }, deviceScaleFactor: scale });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
    await page.addInitScript(VIRTUAL_TIME);
    // the video pass is silent
    await page.addInitScript(SEED_STORAGE, { ...storageFor(SOLVED), 'strata.sfx': '0', ...(process.env.MLOG ? { [process.env.MLOG]: '1' } : {}) });
    await page.goto(URL);
    await page.waitForFunction(() => window.strata && window.__advance);
    await step(page, 30);
    await page.evaluate(PAGE_HELPERS);
    for (const [act, args, secs] of PREROLL) {
      await page.evaluate(([act, args]) => window.__trailer[act](...args), [act, args]);
      await step(page, Math.round(secs * FPS));
    }

    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-pix_fmt', 'yuv420p', '-r', String(FPS), OUTFILE], { stdio: ['pipe', 'inherit', 'inherit'] });

    const timeline = buildTimeline().filter((a) => !a.audio && !(a.t >= +process.env.CUT));   // CUT=secs: nothing after (to watch a beat play out)
    const frames = Math.round((+process.env.LIMIT || DURATION) * FPS);
    let next = 0;
    const t0 = Date.now();
    for (let f = 0; f < frames; f++) {
      const time = f / FPS;
      while (next < timeline.length && timeline[next].t <= time + 1e-6) {
        const a = timeline[next++];
        if (a.act === 'ff') await step(page, Math.round(a.args[0] * FPS));
        else await page.evaluate(([act, args]) => window.__trailer[act](...args), [a.act, a.args]);
      }
      await step(page);
      const jpg = await page.screenshot({ type: 'jpeg', quality: 94 });
      if (!ff.stdin.write(jpg)) await new Promise((r) => ff.stdin.once('drain', r));
      if (f % 60 === 0) console.log(`frame ${f}/${frames}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    }
    ff.stdin.end();
    await new Promise((r) => ff.on('close', r));
    const info = await page.evaluate(() => ({ rows: window.__rows, progress: document.querySelector('#map-progress')?.textContent, log: document.querySelector('#motion-log')?.innerText, menu: document.querySelector('#menu').className, scroll: document.querySelector('#menu .map-scroll')?.scrollTop, title: document.querySelector('#title').className }));
    console.log('video done', OUTFILE, JSON.stringify(info), errors.length ? 'ERRORS: ' + errors.join(' | ') : 'no page errors');
  } finally {
    await browser.close();
  }
});
