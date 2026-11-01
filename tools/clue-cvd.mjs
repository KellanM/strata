// The clue marks without colour (docs/growth-roadmap.md test 7): one level's block, with
// plain, circled and squared clues and some cubes marked, drawn in every chapter's palette,
// as the eye sees it and through simulated colour-vision deficiencies (protanopia,
// deuteranopia, tritanopia), with no colour at all (achromatopsia), and blurred (a circle
// and a square must still differ when soft).
//
//   PORT=5301 node server.js &  then
//   node tools/clue-cvd.mjs <label> [--url http://localhost:5301/] [--shape bookshelf] [--large]
//     writes shots/a11y/<label>/cvd-<n>.png: a sheet, a row per palette, a column per vision
//
// Chromium headless shell (CHROME=path overrides), through the shared browser lock.
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
const label = args[0];
const base = opt('--url', 'http://localhost:5301/');
const shapeId = opt('--shape', 'bookshelf');
const OUT = path.join(ROOT, 'shots/a11y', label);
mkdirSync(OUT, { recursive: true });

async function loadPlaywright() {
  const tries = [process.env.PLAYWRIGHT, 'playwright',
    path.join(process.env.APPDATA || path.join(homedir(), 'AppData', 'Roaming'), 'npm', 'node_modules', 'playwright', 'index.mjs')].filter(Boolean);
  for (const t of tries) {
    try { return await import(existsSync(t) ? pathToFileURL(t).href : t); } catch {}
  }
  throw new Error('clue-cvd: Playwright not found');
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

const { CHAPTERS } = await import(pathToFileURL(path.join(ROOT, 'public/js/shapes.js')).href);
const VISIONS = ['none', 'protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia', 'blurred'];
// Machado, Oliveira & Fernandes (2009), full severity (Chromium's own); achromatopsia: luminance
const MATRICES = {
  protanopia: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
  deuteranopia: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.011820, 0.042940, 0.968881]],
  tritanopia: [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.303900]],
  achromatopsia: [[0.2126, 0.7152, 0.0722], [0.2126, 0.7152, 0.0722], [0.2126, 0.7152, 0.0722]],
};
const pw = await loadPlaywright();
await withLock(async () => {
  const browser = await pw.chromium.launch({ executablePath: CHROME, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  try {
    // a fresh page for each palette (one page through them all slowed till a shot timed out), each
    // shot kept as it is taken, so a run cut short picks up where it stopped
    const CELLS = path.join(OUT, 'cvd-cells');
    mkdirSync(CELLS, { recursive: true });
    const cells = [];   // [palette, png]
    for (const ch of CHAPTERS) {
      const file = path.join(CELLS, `${ch.palette}.png`);
      if (!existsSync(file)) {
        const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
        await page.goto(base + '?nosplash');
        await page.evaluate(({ large, chapters }) => {
          localStorage.clear(); localStorage.setItem('strata.tutorial', '1'); localStorage.setItem('strata.chapters', JSON.stringify(chapters));
          if (large) localStorage.setItem('strata.largeText', '1');
        }, { large: args.includes('--large'), chapters: CHAPTERS.map((c) => c.name) });
        await page.goto(base + '?nosplash');
        await page.waitForFunction(() => window.strata?.game, null, { timeout: 180e3 });
        await page.waitForTimeout(3000);
        // past the title and the map into a level, as a player comes (the title holds the scene back)
        await page.evaluate(() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' })));
        await page.waitForFunction(() => document.getElementById('menu')?.classList.contains('show'), null, { timeout: 60e3 });
        await page.waitForTimeout(2500);
        await page.evaluate(() => document.querySelector('.map-node.current').click());
        await page.waitForFunction(() => !document.getElementById('menu').classList.contains('show') && window.strata.game?.entry?.number, null, { timeout: 60e3 });
        await page.waitForTimeout(2000);
        // the level alone: no coach or HUD over it
        await page.addStyleTag({ content: '#coach, .hud, #chapter-card, #install { display: none !important; }' });
        await page.evaluate(async ({ id, pal }) => {
          const { SHAPES } = await import('./js/shapes.js');
          const { PALETTES } = await import('./js/palettes.js');
          window.strata.startPuzzle({ shape: SHAPES.find((s) => s.id === id), palette: PALETTES.find((p) => p.name === pal), number: 0 }, { quiet: true });
        }, { id: shapeId, pal: ch.palette });
        await page.waitForTimeout(2500);
        // some cubes marked, so the clues on the marks' colour show too
        await page.evaluate(() => { const g = window.strata.game; for (let i = 0; i < g.puzzle.size; i++) if (g.puzzle.solid[i] && i % 3 === 0) window.strata.act(i, 'paint'); });
        await page.waitForTimeout(1500);
        writeFileSync(file, await page.screenshot({ clip: { x: 20, y: 250, width: 350, height: 350 }, timeout: 120e3 }));
        await page.close();
        console.log(ch.palette);
      }
      cells.push([ch.palette, readFileSync(file).toString('base64')]);
    }
    // the sheets, five palettes each: each shot as seen, and through each filter. Chromium's own
    // emulation (Emulation.setEmulatedVisionDeficiency) took minutes a shot over a live WebGL page
    // here, so the same matrices are applied as SVG filters in linear RGB, as Chromium does
    const m = (r) => r.map((row) => [...row, 0, 0].join(' ')).join('  ') + '  0 0 0 1 0';
    const filters = `<svg width="0" height="0" style="position:absolute"><defs>${Object.entries(MATRICES).map(([k, r]) =>
      `<filter id="${k}" color-interpolation-filters="linearRGB"><feColorMatrix type="matrix" values="${m(r)}"/></filter>`).join('')}</defs></svg>`;
    const sheet = await browser.newPage({ viewport: { width: 1320, height: 1200 }, deviceScaleFactor: 1 });
    for (let s = 0; s * 5 < CHAPTERS.length; s++) {
      const rows = CHAPTERS.slice(s * 5, s * 5 + 5).map((ch) => {
        const src = `data:image/png;base64,${cells.find((c) => c[0] === ch.palette)[1]}`;
        return `<tr><th>${ch.palette}</th>${VISIONS.map((v) => `<td><img src="${src}" style="filter:${v === 'none' ? 'none' : v === 'blurred' ? 'blur(2px)' : `url(#${v})`}"></td>`).join('')}</tr>`;
      }).join('');
      await sheet.setContent(`<style>body{margin:8px;font:13px system-ui;background:#fff}td{padding:2px}img{width:210px;display:block}th{writing-mode:vertical-rl;transform:rotate(180deg);font-weight:500}</style>
        ${filters}<table><tr><th></th>${VISIONS.map((v) => `<th style="writing-mode:initial;transform:none">${v === 'none' ? 'as seen' : v}</th>`).join('')}</tr>${rows}</table>`);
      await sheet.screenshot({ path: path.join(OUT, `cvd-${s + 1}.png`), fullPage: true });
    }
  } finally { await browser.close(); }
});
console.log(`wrote ${OUT}/cvd-*.png`);
