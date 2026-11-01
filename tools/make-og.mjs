// The link preview (Open Graph) card, 1200x630, for public/og.jpg: what a
// shared link to Strata shows in Messages, WhatsApp, Discord, X and the rest.
//
// docs/og-study.md: crafted games' previews show their own world, large, with
// a wordmark and at most one line - no screenshots in shadowed cards, no
// arrows. Kellan wants the before and after, separate and plain to see: so the
// Origami Fox's stone, untouched with its clue numbers, and the fox it held
// stand side by side at one size, each in its own light, in one sky. Both are
// the game's own renders of the same stone at the same angle (the reveal held
// at the angle it was played at, its gems hidden). Each is cut from its shot
// by its difference from the same shot with it hidden (its rays come with it,
// within a soft circle), and the floating dust is hidden while they're taken
// so none lands on them; the sky behind keeps its dust. Over it, the wordmark
// and one specific claim (Hopkins, docs/hopkins-study.md).
//
//   node tools/make-og.mjs     (starts its own server; needs the network once for
//                               the Jost face, which stands in for the app's Avenir
//                               Next on machines without it)
import { spawn } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const { chromium } = await import('playwright').catch(() =>
  import(pathToFileURL(`${process.env.APPDATA}/npm/node_modules/playwright/index.mjs`).href));

const root = fileURLToPath(new URL('..', import.meta.url));
const tmp = mkdtempSync(join(tmpdir(), 'strata-og-'));
const PORT = 5295, ID = 'origami-fox', CLAIM = 'One answer per stone. No guessing.';
const LAYOUT = { gap: 0.42, size: 0.5, y: 0.56 };   // centres 42% of the width apart; each stone half the height
const shell = process.env.QA_CHROME || 'C:/Users/Kellan/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';
const uri = (f) => 'data:image/png;base64,' + readFileSync(f).toString('base64');

const server = spawn(process.execPath, ['server.js'], { cwd: root, env: { ...process.env, PORT: String(PORT) }, stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 1500));
const browser = await chromium.launch({ executablePath: shell, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
try {
  // 1. the shots: the game at 1200x630 (x4), the stone untouched, then solved
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
  await page.waitForTimeout(6000);
  await page.addStyleTag({ content: '#title, #menu, #coach, #chapter-card, #win-title, #actions, #win, #pause, #install, #offer, #loading, .hud, .tools, #map-world { visibility: hidden !important; }' });
  await page.evaluate(() => Object.defineProperty(window.strata.handles.group, 'visible', { get: () => false, set() {} }));   // no peel handles
  const dust = (on) => page.evaluate((on) => window.strata.scene.traverse((o) => { if (o.isPoints) o.visible = on; }), on);
  // where the stone's eight corners fall (css px); cells are unit cubes about the origin
  const box = () => page.evaluate(async () => {
    const THREE = await import('three');
    const s = window.strata, m = s.cubes.mesh, d = s.game.puzzle.dims;
    m.updateMatrixWorld();
    const xs = [], ys = [];
    for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) {
      const v = new THREE.Vector3(x * d[0] / 2, y * d[1] / 2, z * d[2] / 2).applyMatrix4(m.matrixWorld).project(s.camera);
      xs.push((v.x + 1) / 2 * innerWidth); ys.push((1 - v.y) / 2 * innerHeight);
    }
    return { cx: (Math.min(...xs) + Math.max(...xs)) * 2, cy: (Math.min(...ys) + Math.max(...ys)) * 2, h: (Math.max(...ys) - Math.min(...ys)) * 4 };   // image px (x4)
  });
  // a shot with the object, and the same with it hidden, both without dust
  const pair = async (name) => {
    await dust(false); await page.waitForTimeout(150);
    const b = await box(), shot = join(tmp, `${name}.png`), bare = join(tmp, `${name}-sky.png`);
    await page.screenshot({ path: shot });
    await page.evaluate(() => { window.strata.cubes.mesh.visible = false; });
    await page.waitForTimeout(150);
    await page.screenshot({ path: bare });
    await page.evaluate(() => { window.strata.cubes.mesh.visible = true; });
    await dust(true);
    return { box: b, shot, bare };
  };
  const stone = await pair('stone');
  await page.evaluate(() => {
    const g = window.strata.game;
    for (let i = 0; i < g.puzzle.size; i++) if (!g.puzzle.solid[i]) window.strata.act(i, 'break');
    g.win.pose = 0;   // the angle it was played at, not the showcase turn
    Object.defineProperty(window.strata.finale.group, 'visible', { get: () => false, set() {} });   // no gems, no score
  });
  await page.waitForTimeout(10000);   // the whirl done, the sparks settled
  const fox = await pair('fox');
  const sky = join(tmp, 'sky.png');   // the sky behind both, its dust showing
  await page.evaluate(() => { window.strata.cubes.mesh.visible = false; });
  await page.waitForTimeout(150);
  await page.screenshot({ path: sky });
  await ctx.close();

  // 2. the two, side by side at one size, on the one sky
  const page2 = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  const art = await page2.evaluate(async ({ shots, LAYOUT }) => {
    const load = (src) => new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = src; });
    const W = 2400, H = 1260, out = new OffscreenCanvas(W, H), g = out.getContext('2d');
    g.drawImage(await load(shots.sky), 0, 0, W, H);
    const pixels = (img) => { const c = new OffscreenCanvas(img.width, img.height).getContext('2d'); c.drawImage(img, 0, 0); return c.getImageData(0, 0, img.width, img.height); };
    // the object: where its shot differs from the same shot with it hidden, within a soft circle round it
    const cutout = (img, bare, bx) => {
      const a = pixels(img), d = a.data, b = pixels(bare).data, R0 = bx.h * 0.75, R1 = bx.h * 1.45;
      for (let i = 0; i < d.length; i += 4) {
        const diff = Math.max(Math.abs(d[i] - b[i]), Math.abs(d[i + 1] - b[i + 1]), Math.abs(d[i + 2] - b[i + 2]));
        const r = Math.hypot((i / 4) % img.width - bx.cx, Math.floor(i / 4 / img.width) - bx.cy);
        const fall = r <= R0 ? 1 : r >= R1 ? 0 : 1 - (r - R0) / (R1 - R0);
        d[i + 3] = Math.round(Math.max(0, Math.min(1, (diff - 12) / 50)) * fall * fall * 255);
      }
      const c = new OffscreenCanvas(img.width, img.height);
      c.getContext('2d').putImageData(a, 0, 0);
      return c;
    };
    for (const [s, side] of [[shots.stone, -1], [shots.fox, 1]]) {
      const img = await load(s.shot), k = (LAYOUT.size * H) / s.box.h;
      const cx = W / 2 + side * LAYOUT.gap * W / 2;
      g.drawImage(cutout(img, await load(s.bare), s.box), cx - s.box.cx * k, H * LAYOUT.y - s.box.cy * k, img.width * k, img.height * k);
    }
    const blob = await out.convertToBlob({ type: 'image/png' });
    return 'data:image/png;base64,' + btoa(new Uint8Array(await blob.arrayBuffer()).reduce((q, c) => q + String.fromCharCode(c), ''));
  }, { shots: { sky: uri(sky), stone: { ...stone, shot: uri(stone.shot), bare: uri(stone.bare) }, fox: { ...fox, shot: uri(fox.shot), bare: uri(fox.bare) } }, LAYOUT });
  const base = join(tmp, 'base.png');
  writeFileSync(base, Buffer.from(art.split(',')[1], 'base64'));

  // 3. the wordmark and the claim, in the game's thin letterspaced voice
  await page2.setContent(`<!doctype html><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Jost:wght@300;400&display=block" rel="stylesheet">
<style>
  body { margin: 0; width: 1200px; height: 630px; overflow: hidden; color: #fff6ee; font-family: "Avenir Next", Jost, sans-serif;
    background: url(${uri(base)}) center / cover; }
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
