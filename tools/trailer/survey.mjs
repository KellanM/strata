// Survey for casting the trailer: solves each listed stone on the virtual clock
// and grabs its reveal pose (named, gems landing), then tiles them into one
// sheet. Uses v3's save and helpers.
//
//   PORT=5231 TRAILER=v3 node tools/trailer/survey.mjs out.png id1 id2 ...   (AT=secs after the win, default 4)
import { chromium } from 'file:///C:/Users/Kellan/AppData/Roaming/npm/node_modules/playwright/index.mjs';
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import { T, URL, CHROME, VIRTUAL_TIME, withLock, storageFor, SEED_STORAGE } from './lib.mjs';

const [out, ...ids] = process.argv.slice(2);
const AT = +process.env.AT || 4;
const dir = 'trailer/.survey';
rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true });
const step = (page, n = 1) => page.evaluate((n) => { for (let k = 0; k < n; k++) window.__advance(1000 / 30); }, n);

await withLock(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  try {
    const page = await (await browser.newContext({ viewport: { width: 540, height: 960 }, deviceScaleFactor: 1 })).newPage();
    page.on('pageerror', (e) => console.log('pageerror', String(e)));
    await page.addInitScript(VIRTUAL_TIME);
    await page.addInitScript(SEED_STORAGE, { ...storageFor(T.SOLVED ?? []), 'strata.sfx': '0' });
    await page.goto(URL);
    await page.waitForFunction(() => window.strata && window.__advance);
    await step(page, 30);
    await page.evaluate(T.PAGE_HELPERS);
    for (const [act, args, secs] of T.PREROLL ?? []) { await page.evaluate(([a, x]) => window.__trailer[a](...x), [act, args]); await step(page, secs * 30); }
    let n = 0;
    for (const id of ids) {
      await page.evaluate((id) => window.__trailer.level(id, 1), id);
      await step(page, 30);
      await page.evaluate(() => window.__trailer.prechisel(0));
      await step(page, Math.round(AT * 30));
      await page.screenshot({ path: `${dir}/${String(n++).padStart(3, '0')}.png` });
    }
  } finally { await browser.close(); }
});
const cols = Math.min(8, ids.length);
execFileSync('ffmpeg', ['-y', '-v', 'error', '-framerate', '1', '-i', `${dir}/%03d.png`, '-vf', `scale=216:384,tile=${cols}x${Math.ceil(ids.length / cols)}`, '-frames:v', '1', out]);
rmSync(dir, { recursive: true, force: true });
console.log('survey', out);
