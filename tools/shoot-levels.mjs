// Dev aid: solves each level in a headless browser and screenshots the reveal.
//   PORT=5183 node server.js &  then  node tools/shoot-levels.mjs [id ...]
// Needs `npm i --no-save playwright`. Writes shots/level-<id>.png (400x820).
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { SHAPES } from '../public/js/shapes.js';

const base = process.env.URL || 'http://localhost:5183/';
const ids = process.argv.slice(2);
mkdirSync('shots', { recursive: true });

// CHROME=path/to/chrome.exe reuses an already-downloaded browser.
const browser = await chromium.launch({
  executablePath: process.env.CHROME || undefined,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage({ viewport: { width: 400, height: 820 }, deviceScaleFactor: 1 });
await page.addInitScript(() => localStorage.setItem('strata.tutorial', '1'));
for (const [n, shape] of SHAPES.entries()) {
  if (ids.length && !ids.includes(shape.id)) continue;
  await page.goto(base);
  await page.waitForFunction(() => window.strata?.game);
  await page.evaluate(() => { window.__prev = window.strata.game; });
  await page.locator('#grid .card').nth(n + 1).click();
  await page.waitForFunction((id) => window.strata.game !== window.__prev && window.strata.game.shape.id === id, shape.id);
  await page.evaluate(() => {
    const g = window.strata.game;
    for (let i = 0; i < g.puzzle.size; i++) if (!g.puzzle.solid[i]) window.strata.act(i, 'break');
  });
  await page.waitForTimeout(2300);
  await page.screenshot({ path: `shots/level-${shape.id}.png` });
  console.log(shape.id);
}
await browser.close();
