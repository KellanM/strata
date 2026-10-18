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
for (const shape of SHAPES) {
  if (ids.length && !ids.includes(shape.id)) continue;
  await page.goto(base);
  await page.waitForFunction(() => window.strata?.game);
  // start it straight from the game's hook (the menu is a map now, not a grid)
  await page.evaluate(async (id) => {
    const { SHAPES } = await import('./js/shapes.js');
    const { PALETTES } = await import('./js/palettes.js');
    const shape = SHAPES.find((s) => s.id === id);
    window.strata.startPuzzle({ shape, palette: PALETTES.find((p) => p.name === shape.palette), number: 0 });
  }, shape.id);
  await page.waitForFunction((id) => window.strata.game.shape.id === id, shape.id);
  await page.evaluate(() => {
    const g = window.strata.game;
    for (let i = 0; i < g.puzzle.size; i++) if (!g.puzzle.solid[i]) window.strata.act(i, 'break');
  });
  await page.waitForTimeout(Number(process.env.WAIT || 4500));
  await page.screenshot({ path: `shots/level-${shape.id}.png` });
  console.log(shape.id);
}
await browser.close();
