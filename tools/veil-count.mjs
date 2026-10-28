// The map's veil, counted in a browser (issues #2, #9): on a new player's save
// (the lessons done, nothing solved) at 390x844, past the title to the map,
// how many mist sprites (canvas.mw-spr) and layer-prone elements the map holds.
// A level start's freeze on a phone is linear in that layer count
// (perf/2026-10-28-player-path-and-scaling.md), so this is the number a fix to
// #2 has to move, measured without a device.
//
//   node tools/veil-count.mjs                 WebKit (closest to iOS), prints JSON
//   node tools/veil-count.mjs --shot out.png  also: the map scrolled to the first
//                                             unreached chapter's veil, screenshotted
//   node tools/veil-count.mjs --tap           also: run perf.tapStart (#8) and print it
//   BROWSER=chromium ...                      Chromium instead (waits for the shared
//                                             browser lock, as tools/trailer/lib.mjs does)
//   SOLVED=n                                  seed the first n stones as solved
//   DPR=3                                     a phone's pixel ratio (default 1)
//
// Serves the repo through server.js on a spare port; needs Playwright (the
// project's, or a global install: PLAYWRIGHT=path/to/playwright/index.mjs).
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const shot = args.includes('--shot') ? args[args.indexOf('--shot') + 1] : null;
const tap = args.includes('--tap');
const kind = process.env.BROWSER || 'webkit';
const solvedN = Number(process.env.SOLVED || 0);

async function loadPlaywright() {
  const tries = [process.env.PLAYWRIGHT, 'playwright',
    path.join(process.env.APPDATA || path.join(homedir(), 'AppData', 'Roaming'), 'npm', 'node_modules', 'playwright', 'index.mjs')].filter(Boolean);
  for (const t of tries) {
    try { return await import(existsSync(t) ? pathToFileURL(t).href : t); } catch {}
  }
  throw new Error('veil-count: Playwright not found (npm i -g playwright, or PLAYWRIGHT=path/to/index.mjs)');
}

// Chrome is shared with the other shot scripts: one at a time, through the same
// lock directory (tools/trailer/lib.mjs; stale after 20 min). WebKit doesn't take it.
const LOCK = path.join(process.env.LOCALAPPDATA || path.join(homedir(), 'AppData', 'Local'), 'Temp', 'strata-browser.lock');
async function withLock(fn) {
  if (kind === 'webkit') return fn();
  for (;;) {
    try { mkdirSync(LOCK); break; } catch {
      try { if (Date.now() - statSync(LOCK).mtimeMs > 20 * 60e3) { rmSync(LOCK, { recursive: true, force: true }); continue; } } catch {}
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  try { return await fn(); } finally { try { rmSync(LOCK, { recursive: true, force: true }); } catch {} }
}

const port = 5300 + Math.floor(Math.random() * 400);
const server = spawn(process.execPath, ['server.js'], { cwd: ROOT, env: { ...process.env, PORT: String(port) }, stdio: 'ignore' });
const base = `http://localhost:${port}/`;
try {
  for (let i = 0; ; i++) {
    try { if ((await fetch(base)).ok) break; } catch {}
    if (i > 100) throw new Error('veil-count: server did not start');
    await new Promise((r) => setTimeout(r, 100));
  }
  const pw = await loadPlaywright();
  const out = await withLock(async () => {
    const browser = await pw[kind].launch(kind === 'chromium' ? { args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] } : {});
    try {
      const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: Number(process.env.DPR || 1) });
      const page = await ctx.newPage();
      // a fresh save: nothing but the lessons done (without them the title leads to
      // lesson 1, not the map); SOLVED=n marks the first n stones solved
      const { SHAPES } = await import(pathToFileURL(path.join(ROOT, 'public/js/shapes.js')).href);
      const solved = Object.fromEntries(SHAPES.slice(0, solvedN).map((sh) => [sh.id, { time: 80, mistakes: 0, stars: 3, score: 1500 }]));
      await page.addInitScript((kv) => { localStorage.clear(); for (const [k, v] of Object.entries(kv)) localStorage.setItem(k, v); },
        { 'strata.tutorial': '1', ...(solvedN ? { 'strata.solved': JSON.stringify(solved) } : {}) });
      await page.goto(base);
      await page.waitForFunction(() => window.strata?.game, null, { timeout: 60e3 });
      // past the title to the map, as the profiling build does (main.js STRATA_AUTOBENCH)
      await page.waitForTimeout(4000);
      await page.evaluate(() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' })));
      await page.waitForFunction(() => document.getElementById('menu')?.classList.contains('show') && document.querySelectorAll('canvas.mw-spr').length > 0, null, { timeout: 30e3 });
      await page.waitForTimeout(3000);
      const res = await page.evaluate(() => {
        const c = window.strata.perf.layerCensus(), s = window.strata.perf.saveState();
        const mpx = [...document.querySelectorAll('canvas.mw-spr')].reduce((a, el) => a + el.width * el.height, 0) / 1e6;
        return { sprites: s.sprites, veil: s.veil, spriteMpx: +mpx.toFixed(1), layerProne: c.layerProne, rendered: c.rendered, all: c.all, top: c.top, save: s };
      });
      res.browser = `${kind} ${browser.version()}`;
      if (shot) {
        // the first chapter not yet reached, its veil from a little above its top edge
        await page.evaluate(() => {
          const sc = document.querySelector('#menu .map-scroll'), r = document.querySelector('#map .map-region.veiled');
          if (sc && r) sc.scrollTop = Math.max(0, Math.round(r.getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop - 300));
        });
        await page.waitForTimeout(1500);
        await page.screenshot({ path: path.resolve(shot) });
        res.shot = path.resolve(shot);
      }
      if (tap) res.tap = await page.evaluate(async () => {
        const t = await window.strata.perf.tapStart(window.strata);
        return { ...t, report: window.strata.perf.report().find((x) => x.segment === 'tap-start') };
      });
      return res;
    } finally { await browser.close(); }
  });
  console.log(JSON.stringify(out, null, 2));
} finally { server.kill(); }
