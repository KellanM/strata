// Casting sheet: every object's map thumbnail (thumbs.js), labelled, in one
// image, for choosing the trailer's heroes.
//   node tools/trailer/v5/cast.mjs out.png [id ...]   (no ids: every level and shrine)
import { chromium, CHROME, URL, withLock } from './lib.mjs';

const [OUT = 'trailer/v5/work/cast.png', ...ids] = process.argv.slice(2);
await withLock(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  try {
    const page = await (await browser.newContext({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 })).newPage();
    await page.goto(URL);
    await page.waitForFunction(() => window.strata);
    const h = await page.evaluate(async (ids) => {
      const { renderThumb } = await import('/js/thumbs.js');
      const all = strata.journalEntries().filter((e) => !ids.length || ids.includes(e.shape.id));
      document.body.innerHTML = '';
      const d = document.createElement('div');
      d.style.cssText = 'position:absolute;inset:0 auto auto 0;z-index:999;width:1600px;display:grid;grid-template-columns:repeat(12,1fr);gap:4px;background:#2a1838;font:11px sans-serif;color:#fff;padding:4px';
      d.innerHTML = all.map((e) => '<div style="text-align:center"><img style="width:120px;height:120px" src="' + renderThumb(e.shape, e.palette, { size: 120 }) + '"><div>' + e.shape.id + '</div></div>').join('');
      document.body.appendChild(d);
      document.body.style.cssText = 'margin:0;overflow:visible;height:auto';
      await Promise.all([...d.querySelectorAll('img')].map((i) => i.decode().catch(() => {})));
      return d.getBoundingClientRect().height;
    }, ids);
    await page.setViewportSize({ width: 1600, height: Math.ceil(h) });
    await page.screenshot({ path: OUT, fullPage: true });
  } finally { await browser.close(); }
});
console.log('cast', OUT);
