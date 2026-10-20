// When does a reveal land? Solves each listed stone on the virtual clock and
// samples the finale's own state every frame (main.js stepCelebration:
// game.win.angle and the mesh's lift), then prints the time after the winning
// tap at which the object has turned to its resting pose and stopped: within
// TOL degrees of its final angle, turning slower than 2°/s, and down on the ground.
//
//   PORT=5231 TRAILER=v3 node tools/trailer/settle.mjs id1 id2 ...   (TOL=1.5)
import { chromium } from 'file:///C:/Users/Kellan/AppData/Roaming/npm/node_modules/playwright/index.mjs';
import { T, URL, CHROME, VIRTUAL_TIME, withLock, storageFor, SEED_STORAGE } from './lib.mjs';

const ids = process.argv.slice(2);
const TOL = +process.env.TOL || 1.5;
const step = (page, n = 1) => page.evaluate((n) => { for (let k = 0; k < n; k++) window.__advance(1000 / 30); }, n);

await withLock(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  try {
    const page = await (await browser.newContext({ viewport: { width: 540, height: 960 }, deviceScaleFactor: 1 })).newPage();
    await page.addInitScript(VIRTUAL_TIME);
    await page.addInitScript(SEED_STORAGE, { ...storageFor(T.SOLVED ?? []), 'strata.sfx': '0' });
    await page.goto(URL);
    await page.waitForFunction(() => window.strata && window.__advance);
    await step(page, 30);
    await page.evaluate(T.PAGE_HELPERS);
    await page.evaluate(() => window.__trailer.enterMap());
    await step(page, 72);
    for (const id of ids) {
      await page.evaluate((id) => { window.__trailer.level(id, 1); }, id);
      await step(page, 30);
      await page.evaluate(() => window.__trailer.prep(0));   // the last cube goes: the win
      const samples = [];
      for (let f = 0; f <= 30 * 8; f++) {
        samples.push(await page.evaluate(() => ({ a: strata.game.win?.angle ?? 0, y: strata.cubes.mesh.position.y })));
        await step(page);
      }
      const end = samples.at(-1).a;
      const deg = (r) => r * 180 / Math.PI;
      let settle = null;
      for (let f = samples.length - 1; f > 0; f--) {
        const s = samples[f], v = Math.abs(deg(s.a - samples[f - 1].a)) * 30;
        const ok = Math.abs(deg(s.a - end)) < TOL && v < 2 && Math.abs(s.y) < 0.12;
        if (!ok) { settle = (f + 1) / 30; break; }
      }
      const at = (t) => { const s = samples[Math.round(t * 30)]; return `${deg(end - s.a).toFixed(1)}°`; };
      console.log(`${id.padEnd(18)} settles ${settle?.toFixed(2)} s after the tap   (left to turn at 2 s ${at(2)}, 3 s ${at(3)}, 4 s ${at(4)})`);
    }
  } finally { await browser.close(); }
});
