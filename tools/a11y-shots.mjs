// Larger text, checked in a browser (docs/growth-roadmap.md test 7): every screen with
// interface text, at 390x844 and 375x667, with the setting off and on. Each screen is
// screenshotted, and its text measured: every element's font size and box (so a run with
// the setting off can be compared with one from before the setting existed), and any
// text that runs out of the screen or out of its own box.
//
//   PORT=5301 node server.js &  then
//   node tools/a11y-shots.mjs <label> [--large] [--url http://localhost:5301/]
//     writes shots/a11y/<label>/<w>x<h>-<screen>.png and shots/a11y/<label>/metrics.json
//   node tools/a11y-shots.mjs --compare <labelA> <labelB>
//     prints every element whose size or box differs between two runs
//
// Chromium (the headless shell; CHROME=path overrides), one browser at a time through the
// shared lock (tools/trailer/lib.mjs). Needs Playwright (PLAYWRIGHT=path/to/index.mjs or global).
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);

if (args[0] === '--compare') {
  const read = (l) => JSON.parse(readFileSync(path.join(ROOT, 'shots/a11y', l, 'metrics.json'), 'utf8'));
  const a = read(args[1]), b = read(args[2]);
  let diffs = 0, total = 0;
  for (const key of Object.keys(a)) {
    if (!b[key]) { console.log(`${key}: missing in ${args[2]}`); continue; }
    const B = new Map(b[key].els.map((e) => [e.path, e]));
    for (const e of a[key].els) {
      total++;
      const f = B.get(e.path);
      if (!f) { diffs++; console.log(`${key} ${e.path}: gone`); continue; }
      if (f.fs !== e.fs || f.ls !== e.ls || f.r.join() !== e.r.join()) { diffs++; console.log(`${key} ${e.path}: ${e.fs} ${e.r} -> ${f.fs} ${f.r}`); }
    }
  }
  console.log(`${diffs} of ${total} elements differ`);
  process.exit(diffs ? 1 : 0);
}

const label = args[0];
const large = args.includes('--large');
const base = opt('--url', 'http://localhost:5301/');
const only = opt('--only', null);
const OUT = path.join(ROOT, 'shots/a11y', label);
mkdirSync(OUT, { recursive: true });

async function loadPlaywright() {
  const tries = [process.env.PLAYWRIGHT, 'playwright',
    path.join(process.env.APPDATA || path.join(homedir(), 'AppData', 'Roaming'), 'npm', 'node_modules', 'playwright', 'index.mjs')].filter(Boolean);
  for (const t of tries) {
    try { return await import(existsSync(t) ? pathToFileURL(t).href : t); } catch {}
  }
  throw new Error('a11y-shots: Playwright not found');
}
const LOCK = path.join(process.env.LOCALAPPDATA || path.join(homedir(), 'AppData', 'Local'), 'Temp', 'strata-browser.lock');
async function withLock(fn) {
  for (;;) {
    try { mkdirSync(LOCK); break; } catch {
      try { if (Date.now() - statSync(LOCK).mtimeMs > 20 * 60e3) { rmSync(LOCK, { recursive: true, force: true }); continue; } } catch {}
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  try { return await fn(); } finally { try { rmSync(LOCK, { recursive: true, force: true }); } catch {} }
}
const CHROME = process.env.CHROME || path.join(homedir(), 'AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe');

// every element with its own text, as the eye meets it: font size, letter spacing, box;
// and what spills - out of the screen, or out of a box that clips it
const MEASURE = () => {
  const vw = innerWidth, vh = innerHeight, els = [], spills = [];
  const pathOf = (el) => {
    const p = [];
    for (let e = el; e && e !== document.body; e = e.parentElement) {
      const sib = e.parentElement ? [...e.parentElement.children].filter((c) => c.tagName === e.tagName) : [];
      p.unshift(e.id ? '#' + e.id : e.tagName.toLowerCase() + (sib.length > 1 ? `:${sib.indexOf(e) + 1}` : ''));
      if (e.id) break;
    }
    return p.join('>');
  };
  const seen = (el) => {
    for (let e = el; e; e = e.parentElement) {
      const s = getComputedStyle(e);
      if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) return false;
    }
    return true;
  };
  for (const el of document.body.querySelectorAll('*')) {
    const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (!own || !seen(el)) continue;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    if (el.closest('.sr-only, #splash, #title.fl h1, #title.fl .sub, #dev, #motion-log')) continue;
    const s = getComputedStyle(el);
    const e = { path: pathOf(el), text: el.textContent.trim().slice(0, 40), fs: s.fontSize, ls: s.letterSpacing,
      r: [r.left, r.top, r.width, r.height].map((v) => Math.round(v * 10) / 10) };
    els.push(e);
    // out of the screen (a scroller's content below its fold is not a spill)
    // (nor is the carousel's neighbouring page, or its neighbours' titles)
    const inScroller = el.closest('.map-scroll, .jr-scroll, .help-page'), paged = el.closest('.help-pages, .car-titles');
    if ((!paged && (r.left < -0.5 || r.right > vw + 0.5)) || (!inScroller && (r.top < -0.5 || r.bottom > vh + 0.5))) spills.push({ ...e, why: 'off screen' });
    // clipped by its own box
    if (el.scrollWidth > el.clientWidth + 1 && /hidden|clip/.test(s.overflowX + s.overflow)) spills.push({ ...e, why: `clipped ${el.scrollWidth}>${el.clientWidth}` });
  }
  return { els, spills };
};

const sizes = [[390, 844], [375, 667]];
const fresh = { 'strata.install.later': String(Date.now()) };
const done = { ...fresh, 'strata.tutorial': '1' };

const pw = await loadPlaywright();
const metrics = {};
await withLock(async () => {
  const browser = await pw.chromium.launch({ executablePath: CHROME, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  try {
    for (const [w, h] of sizes) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
      const page = await ctx.newPage();
      page.on('pageerror', (e) => console.log('pageerror', e.message));
      const { SHAPES } = await import(pathToFileURL(path.join(ROOT, 'public/js/shapes.js')).href);
      const solvedOf = (n) => JSON.stringify(Object.fromEntries(SHAPES.filter((s) => !s.id.startsWith('bonus')).slice(0, n).map((s) => [s.id, { time: 80, mistakes: 1, stars: 2, score: 1200 }])));
      const shoot = async (name) => {
        if (only && !name.includes(only)) return;
        const key = `${w}x${h}-${name}`;
        await page.screenshot({ path: path.join(OUT, key + '.png') });
        metrics[key] = await page.evaluate(MEASURE);
        for (const s of metrics[key].spills) console.log(`${key}: ${s.why}: ${s.path} "${s.text}" ${s.r}`);
      };
      const boot = async (save) => {
        await page.goto('about:blank');
        await page.goto(base + '?nosplash');
        await page.evaluate((kv) => { localStorage.clear(); for (const [k, v] of Object.entries(kv)) localStorage.setItem(k, v); }, { ...save, ...(large ? { 'strata.largeText': '1' } : {}) });
        await page.goto(base + '?nosplash');
        await page.waitForFunction(() => window.strata?.game, null, { timeout: 180e3 });
        await page.waitForTimeout(4500);
      };
      const toMap = async () => {
        await page.evaluate(() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' })));
        await page.waitForFunction(() => document.getElementById('menu')?.classList.contains('show'), null, { timeout: 30e3 });
        await page.waitForTimeout(3500);
      };
      const click = (sel) => page.evaluate((s) => document.querySelector(s).click(), sel);

      // a new player: the title, then the first lesson and its card, and the lesson's pause
      await boot(fresh);
      await shoot('title');
      await toMap();
      await click('.map-node.current');
      await page.waitForFunction(() => window.strata.game?.entry?.lesson, null, { timeout: 30e3 });
      await page.waitForTimeout(5000);
      await shoot('lesson-coach');
      await click('#menu-btn'); await page.waitForTimeout(1200);
      await shoot('lesson-pause');

      // a player a few stones in: the map, its settings, rules and touch, the finds
      await boot({ ...done, 'strata.solved': solvedOf(6), 'strata.chapters': JSON.stringify(['First Light']) });
      await toMap();
      await shoot('map');
      await page.evaluate(() => { const sc = document.querySelector('#menu .map-scroll'); sc.scrollTop = Math.max(0, sc.scrollTop - 420); });
      await page.waitForTimeout(1500);
      await shoot('map-up');
      await click('#map-help'); await page.waitForTimeout(1500);
      await shoot('settings');
      await page.evaluate(() => document.querySelector('#help .car-titles [aria-controls="help-rules"]').click()); await page.waitForTimeout(1500);
      await shoot('rules');
      await page.evaluate(() => document.querySelector('#help .car-titles [aria-controls="help-touch"]').click()); await page.waitForTimeout(1500);
      await shoot('touch');
      await click('#help [data-close]'); await page.waitForTimeout(900);
      await click('#map-journal'); await page.waitForTimeout(1800);
      await shoot('finds');
      await page.evaluate(() => document.querySelector('#journal-grid .jr-tile.found')?.click()); await page.waitForTimeout(1800);
      await shoot('finds-view');
      await click('#journal-back'); await page.waitForTimeout(600);
      await click('#journal-close'); await page.waitForTimeout(900);

      // a level: its chapter card, its tip card and the tools, its pause; solved, the result
      await page.evaluate(() => { localStorage.setItem('strata.chapters', '[]'); localStorage.removeItem('strata.reminded'); });
      await click('.map-node.current'); await page.waitForTimeout(1300);
      await shoot('chapter-card');
      await page.waitForTimeout(4500);
      await shoot('level-tip');
      await click('#menu-btn'); await page.waitForTimeout(1200);
      await shoot('level-pause');
      await page.evaluate(() => document.querySelector('[data-pause="resume"]').click()); await page.waitForTimeout(800);
      await page.evaluate(() => { const g = window.strata.game; for (let i = 0; i < g.puzzle.size; i++) if (!g.puzzle.solid[i]) window.strata.act(i, 'break'); });
      await page.waitForTimeout(7000);
      await shoot('result');
      await ctx.close();
    }
  } finally { await browser.close(); }
});
writeFileSync(path.join(OUT, 'metrics.json'), JSON.stringify(metrics));
console.log(`wrote ${OUT}`);
