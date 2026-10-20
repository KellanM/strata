// v5: v2's video pass against today's game (lock, system Chrome, the full
// current save: every level and shrine solved, the map's one-off reveals seen,
// no ads). The ad hook tracks (tools/trailer/ads) are not ported.
//
// Video pass for the v2 cuts: frame-stepped on a virtual clock (see the v1
// capture-video.mjs), with two clocks: GAME time (performance.now, rAF, timers,
// the game's CSS) and SCREEN time (the trailer's own `tr-…` CSS animations). A
// `speed` action changes how much game time each frame advances (slow-mo,
// catch-up); `ff` advances the game without taking frames.
//
// A cut (or an ad track, tools/trailer/ads/ads.mjs) may set its own viewport
// (`size`) and `mode`: 'full', 'game' (a composite panel) or 'overlay' (type and
// end card only, written with alpha as PNG-in-MOV for compositing).
//
//   node tools/trailer/v5/capture-video.mjs trailer|ad out.mp4   (server on PORT, default 5251)
import { chromium, CHROME as SYS_CHROME, URL as BASE, withLock } from './lib.mjs';
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { CUTS, FPS, SIZE } from './timeline.mjs';
import { PAGE_HELPERS } from './page.mjs';
import { SHAPES, BONUS, CHAPTERS } from '../../../public/js/shapes.js';

const [CUT = 'trailer', OUT = `trailer/v5/work/${CUT}-video.mp4`] = process.argv.slice(2);
const URL = BASE;
// the playwright headless shell (build 1243) unless QA_CHROME says otherwise
export const CHROME = SYS_CHROME;
export const resolveCut = (name) => CUTS[name]();
const { actions, duration, size: VIEW = SIZE, mode: MODE = 'full' } = resolveCut(CUT);

export const VIRTUAL_TIME = `(() => {
  let vt = 0, st = 0;
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
  const isTrailer = (an) => typeof an.animationName === 'string' && an.animationName.startsWith('tr-');
  window.__advance = (ms, screenMs = ms) => {
    // animations first seen now were started since the last frame: count them from then
    const vt0 = vt, st0 = st;
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
    st += screenMs;
    const q = raf; raf = [];
    for (const [, cb] of q) { try { cb(vt); } catch (e) { console.error(e); } }
    for (const an of document.getAnimations()) {
      const tr = isTrailer(an), clock = tr ? st : vt;
      if (!starts.has(an)) starts.set(an, tr ? st0 : vt0);
      try { an.pause(); an.currentTime = clock - starts.get(an); } catch (e) {}
    }
  };
})();`;

export async function openPage(browser, { size = SIZE, scale = size.scale ?? SIZE.scale, silent = true } = {}) {
  const ctx = await browser.newContext({ viewport: { width: size.width, height: size.height }, deviceScaleFactor: scale });
  await ctx.route('**/trailer-assets/*', (route) => {
    const name = new globalThis.URL(route.request().url()).pathname.split('/').pop();
    route.fulfill({ body: readFileSync(new globalThis.URL(`../../../trailer/v2/assets/${name}`, import.meta.url)),
      contentType: name.endsWith('.svg') ? 'image/svg+xml' : 'image/png' });
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.addInitScript(({ ids, chapters, silent }) => {
    if (sessionStorage.getItem('tr.init')) return;
    sessionStorage.setItem('tr.init', '1');
    localStorage.clear();
    localStorage.setItem('strata.tutorial', '1');
    // every chapter already entered: no chapter card holding back a level's start
    localStorage.setItem('strata.chapters', JSON.stringify(chapters));
    localStorage.setItem('strata.install.later', String(Date.now() + 1e10));
    const s = {}; ids.forEach((id) => { s[id] = { time: 80, mistakes: 0, stars: 3, score: 1500 }; });
    localStorage.setItem('strata.solved', JSON.stringify(s));
    if (silent) localStorage.setItem('strata.sfx', '0');
    // v5: today's map celebrates once per object, chapter, parted cloud and lit
    // stone; all of it counts as already seen, so the map shot is calm and whole
    localStorage.setItem('strata.map.objects', JSON.stringify(ids));
    localStorage.setItem('strata.map.lit', JSON.stringify(ids));
    localStorage.setItem('strata.map.chapters', JSON.stringify(chapters));
    localStorage.setItem('strata.map.parted', JSON.stringify(chapters));
    // and no ad interstitial, Remove Ads offer or lantern ad can show (the developer switch)
    localStorage.setItem('strata.ads.off', '1');
  }, { ids: [...SHAPES, ...BONUS].map((s) => s.id).filter((id) => !id.startsWith('lesson')), chapters: CHAPTERS.map((c) => c.name), silent });
  return { page, errors };
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) await withLock(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const { page, errors } = await openPage(browser, { size: VIEW });
  await page.addInitScript(VIRTUAL_TIME);
  await page.goto(URL);
  await page.waitForFunction(() => window.strata && window.__advance);
  // launch opens on the title: let the logo carve, skip to the map (Enter), and let
  // the map celebrate everything once so later visits are calm; then the same again
  const skipTitle = () => page.evaluate(() => {
    for (let k = 0; k < 120; k++) window.__advance(1000 / 30);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    for (let k = 0; k < 90; k++) window.__advance(1000 / 30);
  });
  await skipTitle();
  await page.reload();
  await page.waitForFunction(() => window.strata && window.__advance);
  await skipTitle();
  await page.evaluate((m) => { window.__trMode = m; }, MODE);
  await page.evaluate(PAGE_HELPERS);
  await page.evaluate(() => window.__trailer.gridBuild());

  const overlay = MODE === 'overlay';
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', overlay ? 'png' : 'mjpeg', '-i', '-',
    ...(overlay ? ['-c:v', 'png', '-pix_fmt', 'rgba'] : ['-c:v', 'libx264', '-preset', 'medium', '-crf', '14', '-pix_fmt', 'yuv420p']),
    '-r', String(FPS), OUT], { stdio: ['pipe', 'inherit', 'inherit'] });

  const list = actions.filter((a) => !a.audio);
  const frames = Math.round((+process.env.LIMIT || duration) * FPS);
  const frameMs = 1000 / FPS;
  let next = 0, speed = 1;
  const t0 = Date.now();
  for (let f = 0; f < frames; f++) {
    const time = f / FPS;
    const batch = [];
    while (next < list.length && list[next].t <= time + 1e-6) batch.push(list[next++]);
    for (const a of batch) {
      if (a.act === 'speed') speed = a.args[0];
      else if (a.act === 'ff') await page.evaluate(([n, ms]) => { for (let k = 0; k < n; k++) window.__advance(ms, 0); }, [Math.round(a.args[0] * FPS), frameMs]);
      else await page.evaluate(([act, args]) => window.__trailer[act](...args), [a.act, a.args]);
      // v5: stamp each tap with its screen time and whether its cube really broke
      if (a.act === 'tap') await page.evaluate((t) => { const L = window.__trailer.tapLog, e = L?.[L.length - 1];
        if (e && e.t == null) { e.t = t; e.broke = !!strata.game.broken[e.i]; e.level = strata.game.shape.id; } }, +time.toFixed(3));
    }
    await page.evaluate(([g, s]) => window.__advance(g, s), [frameMs * speed, frameMs]);
    if (process.env.PROBE && f % 15 === 0) console.log(time.toFixed(2), JSON.stringify(await page.evaluate((i) => window.__trailer.probe(i), +process.env.PROBE)));
    if (time < (+process.env.START || 0)) continue;   // review renders: skip ahead without frames
    const jpg = overlay ? await page.screenshot({ type: 'png', omitBackground: true }) : await page.screenshot({ type: 'jpeg', quality: 93 });
    if (!ff.stdin.write(jpg)) await new Promise((r) => ff.stdin.once('drain', r));
    if (f % 90 === 0) console.log(`frame ${f}/${frames}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  ff.stdin.end();
  await new Promise((r) => ff.on('close', r));
  // every tap should have landed on a cube the camera could see
  const taps = await page.evaluate(() => window.__trailer.tapLog ?? []);
  console.log(`taps: ${taps.length}, on visible cubes: ${taps.filter((t) => t.seen).length}, wrong (mistakes): ${taps.filter((t) => t.wrong).length}`);
  for (const t of taps) console.log(`  tap ${t.t?.toFixed(2)}s ${t.level} cube ${t.i} seen=${t.seen} broke=${t.broke}`);
  writeFileSync(OUT.replace(/\.\w+$/, '-taps.json'), JSON.stringify(taps, null, 1));
  const unseen = taps.map((t, k) => [k, t]).filter(([, t]) => !t.seen);
  if (unseen.length) console.log('  NOT visible: tap #' + unseen.map(([k, t]) => `${k} (cube ${t.i}, ${t.left} left)`).join(', '));
  await browser.close();
  console.log('video done', OUT, errors.length ? 'ERRORS: ' + [...new Set(errors)].join(' | ') : 'no page errors');
});
