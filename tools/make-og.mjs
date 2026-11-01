// The link preview (Open Graph) card, 1200x630, for public/og.jpg: what a
// shared link to Strata shows in Messages, WhatsApp, Discord, X and the rest.
//
// docs/og-study.md: crafted games' previews show one hero in the game's own
// world, large, with their wordmark and at most one line - no screenshots in
// shadowed cards, no arrows, no before-and-after. So this is the game itself:
// the Origami Fox just revealed, held at the angle it was played at, in its
// chapter's sky and rays, rendered at 4x and cropped close so it fills about
// two thirds of the height. The result's gems and score are hidden. Over it,
// the wordmark and one specific claim (Hopkins, docs/hopkins-study.md). All of
// it sits inside the centre square (x 320-880) that WhatsApp-style crops keep.
//
//   node tools/make-og.mjs     (starts its own server; needs ffmpeg, and the
//                               network once for the Jost face, which stands in
//                               for the app's Avenir Next on machines without it)
import { execFileSync, spawn } from 'node:child_process';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const { chromium } = await import('playwright').catch(() =>
  import(pathToFileURL(`${process.env.APPDATA}/npm/node_modules/playwright/index.mjs`).href));

const root = fileURLToPath(new URL('..', import.meta.url));
const tmp = mkdtempSync(join(tmpdir(), 'strata-og-'));
const PORT = 5295, ID = 'origami-fox', CLAIM = 'One answer per stone. No guessing.';
const shell = process.env.QA_CHROME || 'C:/Users/Kellan/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';

const server = spawn(process.execPath, ['server.js'], { cwd: root, env: { ...process.env, PORT: String(PORT) }, stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 1500));
const browser = await chromium.launch({ executablePath: shell, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
try {
  // 1. the hero: the game at 1200x630 (x4), past the title, into the level, solved
  const ctx = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 4 });
  await ctx.addInitScript(() => {
    if (sessionStorage.getItem('og')) return;
    sessionStorage.setItem('og', '1');
    for (const k of ['strata.tutorial', 'strata.learned', 'strata.dev.unlock', 'strata.ads.off']) localStorage.setItem(k, '1');
    localStorage.setItem('strata.install.later', String(Date.now()));
  });
  const page = await ctx.newPage();
  await page.goto(`http://localhost:${PORT}/?nosplash`);
  await page.waitForFunction(() => document.querySelector('#title')?.classList.contains('show'));
  await page.waitForTimeout(2000);
  for (let k = 0; k < 8 && await page.evaluate(() => document.querySelector('#title').classList.contains('show')); k++) {
    await page.mouse.click(600, 315);
    await page.waitForTimeout(1200);
  }
  await page.waitForFunction(() => document.querySelector('#menu').classList.contains('show'));
  await page.evaluate(async (id) => {
    const { SHAPES } = await import('/js/shapes.js'), { PALETTES } = await import('/js/palettes.js');
    const shape = SHAPES.find((s) => s.id === id);
    window.strata.startPuzzle({ shape, palette: PALETTES.find((p) => p.name === shape.palette), number: 1 });
  }, ID);
  await page.waitForTimeout(5000);
  await page.addStyleTag({ content: '#title, #menu, #coach, #chapter-card, #win-title, #actions, #win, #pause, #install, #offer, #loading, .hud, .tools, #map-world { visibility: hidden !important; }' });
  await page.evaluate(() => {
    const g = window.strata.game;
    for (let i = 0; i < g.puzzle.size; i++) if (!g.puzzle.solid[i]) window.strata.act(i, 'break');
    g.win.pose = 0;   // the angle it was played at, not the showcase turn
    Object.defineProperty(window.strata.finale.group, 'visible', { get: () => false, set() {} });   // no gems, no score
  });
  await page.waitForTimeout(10000);   // the whirl done, the sparks settled
  const hero = join(tmp, 'hero.png');
  await page.screenshot({ path: hero });
  await ctx.close();

  // 2. close in: the object about two thirds of the height, a little below the middle
  const base = join(tmp, 'base.png');
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', hero, '-vf', 'crop=2410:1265:1195:420,scale=1200:630:flags=lanczos', base]);

  // 3. the wordmark and the claim, in the game's thin letterspaced voice
  const page2 = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page2.setContent(`<!doctype html><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400&display=block" rel="stylesheet">
<style>
  body { margin: 0; width: 1200px; height: 630px; overflow: hidden; color: #fff6ee; font-family: "Avenir Next", Jost, sans-serif;
    background: url(data:image/png;base64,${readFileSync(base).toString('base64')}) center / cover; }
  .mark { position: absolute; top: 44px; width: 100%; text-align: center; font-weight: 300; font-size: 30px;
    letter-spacing: .62em; text-indent: .62em; text-shadow: 0 1px 18px rgba(60, 20, 40, .35); }
  .claim { position: absolute; bottom: 42px; width: 100%; text-align: center; font-weight: 400; font-size: 15px;
    letter-spacing: .3em; text-indent: .3em; text-transform: uppercase; opacity: .88; text-shadow: 0 1px 14px rgba(60, 20, 40, .4); }
</style><div class="mark">STRATA</div><div class="claim">${CLAIM}</div>`);
  await page2.evaluate(() => document.fonts.ready);
  await page2.waitForTimeout(300);
  await page2.screenshot({ path: join(root, 'public', 'og.jpg'), type: 'jpeg', quality: 90 });
  console.log('public/og.jpg');
} finally {
  await browser.close();
  server.kill();
}
