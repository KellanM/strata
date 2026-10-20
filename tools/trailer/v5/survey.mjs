// Casting in place: each listed stone in its own sky, mid-solve (`left` cubes
// to go) and revealed (AT s after solving), tiled into one sheet, on the v5 save.
//   node tools/trailer/v5/survey.mjs out.png id ...   (AT=2.1, LEFT=3, ZOOM=1.15, FACE='{"id":rad}')
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import { chromium, URL, withLock, WORK } from './lib.mjs';
import { openPage, CHROME, VIRTUAL_TIME } from './capture-video.mjs';
import { PAGE_HELPERS } from './page.mjs';

const [OUT, ...ids] = process.argv.slice(2);
const AT = +(process.env.AT ?? 2.1), LEFT = +(process.env.LEFT ?? 3), ZOOM = +(process.env.ZOOM ?? 1.15);
const FACE = JSON.parse(process.env.FACE ?? '{}');
const dir = `${WORK}/survey`;
rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true });
const step = (page, secs) => page.evaluate((n) => { for (let k = 0; k < n; k++) window.__advance(1000 / 30); }, Math.round(secs * 30));
await withLock(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  try {
    const { page } = await openPage(browser, { size: { width: 540, height: 960 }, scale: 1 });
    await page.addInitScript(VIRTUAL_TIME);
    await page.goto(URL);
    await page.waitForFunction(() => window.strata && window.__advance);
    await step(page, 4);
    await page.evaluate(() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' })));
    await step(page, 3);
    await page.evaluate(PAGE_HELPERS);
    let n = 0;
    for (const id of ids) {
      await page.evaluate(([id, z, left]) => window.__trailer.level(id, z, { left }), [id, ZOOM, LEFT]);
      await step(page, 0.8);
      await page.screenshot({ path: `${dir}/${String(n++).padStart(3, '0')}.png` });
      await page.evaluate(() => window.__trailer.solve());
      await step(page, AT);
      if (FACE[id]) await page.evaluate((a) => window.__trailer.orbit(a, 0), FACE[id]);
      await step(page, 0.05);
      await page.screenshot({ path: `${dir}/${String(n++).padStart(3, '0')}.png` });
    }
  } finally { await browser.close(); }
});
const cols = Math.min(8, ids.length * 2);
execFileSync('ffmpeg', ['-y', '-v', 'error', '-framerate', '1', '-i', `${dir}/%03d.png`, '-vf', `scale=216:384,tile=${cols}x${Math.ceil(ids.length * 2 / cols)}`, '-frames:v', '1', OUT]);
console.log('survey', OUT);
