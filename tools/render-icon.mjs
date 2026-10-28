// App icon candidates (docs/icon-study.md): a level's win state over a chosen sky,
// square, with no UI and no gems or score. Writes shots/icon-study/<id>-<variant><TAG>.png
//   PORT=5290 node server.js   then
//   DPR=4 ZOOM=1.7 TAG=-hi node tools/render-icon.mjs
//   env: ID (level, default sloth), VARIANTS (JSON: name -> palette name, or sky
//   overrides on Clouds), ZOOM, AZ (turn, radians), DPR, RAW=1 (also a frame with UI),
//   RECOLOR (JSON: colour -> colour, decimal, for the icon only)
// then crop to 1024 (see docs/icon-study.md) and compare with tools/icon-sheet.py
import { chromium } from 'file:///C:/Users/Kellan/AppData/Roaming/npm/node_modules/playwright/index.mjs';
import { mkdirSync, rmSync } from 'node:fs';
const LOCK = 'C:/Users/Kellan/AppData/Local/Temp/strata-browser.lock';
const OUT = 'shots/icon-study/';
mkdirSync(OUT, { recursive: true });
const ID = process.env.ID || 'sloth';
// name: a palette from palettes.js, or a JSON override merged onto Clouds
const VARIANTS = JSON.parse(process.env.VARIANTS || '{"clouds":"Clouds","orchard":"Orchard","green":{"skyTop":13434726,"skyBottom":5091407,"glow":16777164}}');
for (;;) { try { mkdirSync(LOCK); break; } catch { await new Promise((r) => setTimeout(r, 3000)); } }
let browser;
try {
  browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--use-angle=d3d11', '--enable-gpu'] });
  for (const [key, pal] of Object.entries(VARIANTS)) {
    const ctx = await browser.newContext({ viewport: { width: 512, height: 512 }, deviceScaleFactor: Number(process.env.DPR || 2), isMobile: true, hasTouch: true });
    await ctx.addInitScript(() => {
      for (const [k, v] of Object.entries({ 'strata.tutorial': '1', 'strata.learned': '1', 'strata.dev.unlock': '1', 'strata.ads.off': '1', 'strata.install.later': String(Date.now()) })) localStorage.setItem(k, v);
    });
    const page = await ctx.newPage();
    page.on('pageerror', (e) => console.log('pageerror', e.message));
    await page.goto('http://localhost:5290/?nosplash');
    await page.waitForFunction(() => window.strata?.game);
    await page.waitForTimeout(1500);
    // the title: open the stone, then swipe up to the map
    await page.touchscreen.tap(256, 256);
    await page.waitForTimeout(8000);
    const cdp = await ctx.newCDPSession(page);
    let y = 430; await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 256, y }] });
    for (let i = 0; i < 12; i++) { y -= 28; await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 256, y }] }); await page.waitForTimeout(16); }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await page.waitForTimeout(4000);
    await page.evaluate(async ({ id, pal, recolor }) => {
      const { PALETTES } = await import('/js/palettes.js');
      const e = window.strata.journalEntries().find((x) => x.shape.id === id);
      const base = PALETTES.find((p) => p.name === (typeof pal === 'string' ? pal : 'Clouds'));
      const palette = typeof pal === 'string' ? base : { ...base, ...pal };
      // RECOLOR: for the icon only, swap a colour (e.g. a leaf that merges into the sky)
      const swap = recolor ? Object.fromEntries(Object.entries(recolor).map(([k, v]) => [Number(k), v])) : null;
      const shape = swap ? { ...e.shape, cell: (x, y, z) => { const c = e.shape.cell(x, y, z); return swap[c] ?? c; } } : e.shape;
      window.strata.startPuzzle({ ...e, shape, palette });
    }, { id: ID, pal, recolor: process.env.RECOLOR ? JSON.parse(process.env.RECOLOR) : null });
    await page.waitForTimeout(2500);
    await page.evaluate(() => { const g = window.strata.game; for (let i = 0; i < g.puzzle.size; i++) if (!g.puzzle.solid[i]) window.strata.act(i, 'break'); });
    await page.waitForTimeout(6500);
    // the finale's gems and score (a Group of 9), and the handles: hidden, so the object stands alone
    await page.evaluate(() => { for (const c of window.strata.cubes.mesh.parent.children) if (c.type === 'Group') c.visible = false; });
    // framing for an icon: closer (ZOOM), and the object turned about its vertical axis (AZ, radians)
    await page.evaluate(({ zoom, az }) => { const c = window.strata.camera; c.zoom *= zoom; c.updateProjectionMatrix(); window.strata.cubes.mesh.rotation.y += az; }, { zoom: Number(process.env.ZOOM || 1), az: Number(process.env.AZ || 0) });
    await page.waitForTimeout(1200);
    if (process.env.RAW) await page.screenshot({ path: `${OUT}${ID}-${key}-raw.png` });
    await page.addStyleTag({ content: 'body *:not(canvas) { visibility: hidden !important; } canvas { visibility: visible !important; }' });
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${OUT}${ID}-${key}${process.env.TAG || ''}.png` });
    console.log(key, await page.evaluate(() => window.strata.game.solved));
    await ctx.close();
  }
} finally { await browser?.close(); rmSync(LOCK, { recursive: true, force: true }); }
