// The link preview (Open Graph) card, 1200x630, for public/og.jpg: what a
// shared link to Strata shows in Messages, WhatsApp, Discord, X and the rest.
// Hopkins (docs/hopkins-study.md): the picture shows the product at work and
// the result - one stone half carved, then what was inside it - and the words make
// one specific claim, with no "play now" and no "free" in the headline.
//   node tools/make-og.mjs        (reads the store screenshots; needs ffmpeg)
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
const { chromium } = await import('playwright').catch(() =>
  import(pathToFileURL(`${process.env.APPDATA}/npm/node_modules/playwright/index.mjs`).href));

const root = new URL('..', import.meta.url), shots = new URL('store/screenshots/', root);
const tmp = mkdtempSync(join(tmpdir(), 'strata-og-'));
const crop = (url, y, out) => {
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', url.pathname.replace(/^\/(\w:)/, '$1'), '-vf', `crop=1100:1100:110:${y},scale=440:440`, join(tmp, out)]);
  return 'data:image/png;base64,' + readFileSync(join(tmp, out)).toString('base64');
};
// the same stone both sides: the Origami Fox half carved (store/og, shot with
// MID=origami-fox FRAC=0.5 node store/shoot.mjs 6.9 2), then revealed (store frame 1)
const carving = crop(new URL('store/og/origami-fox-carving.png', root), 880, 'a.png');
const inside = crop(new URL('6_9in-1-origami-fox.png', shots), 650, 'b.png');

const html = `<!doctype html><meta charset="utf-8"><style>
  body { margin: 0; width: 1200px; height: 630px; overflow: hidden; color: #4a3d63;
    font-family: "Avenir Next", Avenir, Futura, "Century Gothic", "Segoe UI", sans-serif;
    background: linear-gradient(180deg, #f6e3d2 0%, #eecbb0 100%); }
  .row { position: absolute; top: 150px; left: 0; right: 0; display: flex; justify-content: center; align-items: center; gap: 34px; }
  .row img { width: 400px; height: 400px; border-radius: 28px; box-shadow: 0 14px 40px rgba(74, 61, 99, .18); }
  .arrow { width: 54px; height: 54px; border-radius: 50%; border: 1.5px solid rgba(74, 61, 99, .45); display: grid; place-items: center; font-size: 24px; }
  .name { position: absolute; top: 36px; width: 100%; text-align: center; font-size: 20px; letter-spacing: .5em; text-indent: .5em; }
  h1 { position: absolute; top: 74px; width: 100%; margin: 0; text-align: center; font-weight: 400; font-size: 44px; letter-spacing: .01em; }
  .claim { position: absolute; bottom: 26px; width: 100%; text-align: center; font-size: 19px; letter-spacing: .22em; text-indent: .22em; text-transform: uppercase; opacity: .78; }
</style>
<div class="name">STRATA</div>
<h1>Chisel the stone. Find what’s inside.</h1>
<div class="row"><img src="${carving}"><div class="arrow">→</div><img src="${inside}"></div>
<div class="claim">One answer per stone · no guessing · no ads</div>`;

const shell = process.env.QA_CHROME || 'C:/Users/Kellan/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';
const browser = await chromium.launch({ executablePath: shell });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html);
await page.waitForTimeout(300);
await page.screenshot({ path: new URL('public/og.jpg', root).pathname.replace(/^\/(\w:)/, '$1'), type: 'jpeg', quality: 88 });
await browser.close();
console.log('public/og.jpg');
