// The link preview (Open Graph) card, 1200x630, for public/og.jpg: what a
// shared link to Strata shows in Messages, WhatsApp, Discord, X and the rest.
//
// docs/og-study.md: crafted games' previews show one hero in the game's own
// world, large, with their wordmark and at most one line - no screenshots in
// shadowed cards, no arrows. Kellan still wants the before and after, so it
// is told inside one stone: the Origami Fox's stone, untouched, on the left,
// gives way along a seam of light to the fox it held on the right. Both halves
// are the game's own renders of the same stone at the same angle (the reveal
// held at the angle it was played at, its gems hidden), the stone scaled onto
// the reveal's framing by projecting its corners through each shot's camera.
// Over it, the wordmark and one specific claim (Hopkins, docs/hopkins-study.md),
// all inside the centre square (x 320-880) that WhatsApp-style crops keep.
//
//   node tools/make-og.mjs     (starts its own server; needs ffmpeg, and the
//                               network once for the Jost face, which stands in
//                               for the app's Avenir Next on machines without it)
import { execFileSync, spawn } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const { chromium } = await import('playwright').catch(() =>
  import(pathToFileURL(`${process.env.APPDATA}/npm/node_modules/playwright/index.mjs`).href));

const root = fileURLToPath(new URL('..', import.meta.url));
const tmp = mkdtempSync(join(tmpdir(), 'strata-og-'));
const PORT = 5295, ID = 'origami-fox', CLAIM = 'One answer per stone. No guessing.';
const CUT = { tilt: 14, left: 0.15 };   // the seam: degrees from upright, and how far left of the stone's middle
const shell = process.env.QA_CHROME || 'C:/Users/Kellan/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';
const uri = (f) => 'data:image/png;base64,' + readFileSync(f).toString('base64');

const server = spawn(process.execPath, ['server.js'], { cwd: root, env: { ...process.env, PORT: String(PORT) }, stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 1500));
const browser = await chromium.launch({ executablePath: shell, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
try {
  // 1. the two shots: the game at 1200x630 (x4), the stone untouched, then solved
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
  // never shown: the peel handles, and the result's gems and score
  await page.evaluate(() => Object.defineProperty(window.strata.handles.group, 'visible', { get: () => false, set() {} }));
  await page.waitForTimeout(400);
  // where the stone's eight corners fall on screen (css px); cells are unit cubes about the origin
  const corners = () => page.evaluate(async () => {
    const THREE = await import('three');
    const s = window.strata, m = s.cubes.mesh, d = s.game.puzzle.dims;
    m.updateMatrixWorld();
    const pts = [];
    for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) {
      const v = new THREE.Vector3(x * d[0] / 2, y * d[1] / 2, z * d[2] / 2).applyMatrix4(m.matrixWorld).project(s.camera);
      pts.push([(v.x + 1) / 2 * innerWidth, (1 - v.y) / 2 * innerHeight]);
    }
    return pts;
  });
  const before = await corners(), stone = join(tmp, 'stone.png');
  await page.screenshot({ path: stone });
  await page.evaluate(() => {
    const g = window.strata.game;
    for (let i = 0; i < g.puzzle.size; i++) if (!g.puzzle.solid[i]) window.strata.act(i, 'break');
    g.win.pose = 0;   // the angle it was played at, not the showcase turn
    Object.defineProperty(window.strata.finale.group, 'visible', { get: () => false, set() {} });
  });
  await page.waitForTimeout(10000);   // the whirl done, the sparks settled
  const after = await corners(), fox = join(tmp, 'fox.png');
  await page.screenshot({ path: fox });
  await ctx.close();

  // 2. one stone: the fox's frame, the untouched stone over its left part, a seam of light between
  const page2 = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page2.setContent('<canvas width="4800" height="2520"></canvas>');
  const split = await page2.evaluate(async ({ A, B, before, after, CUT }) => {
    const load = (src) => new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.src = src; });
    const [fox, stone] = await Promise.all([load(A), load(B)]);
    const box = (pts) => { const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]); return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) }; };
    const bb = box(before), ab = box(after);
    const k = (ab.x1 - ab.x0) / (bb.x1 - bb.x0), dx = ab.x0 - bb.x0 * k, dy = ab.y0 - bb.y0 * k;   // the stone onto the fox's frame
    const c = document.querySelector('canvas'), g = c.getContext('2d');
    g.drawImage(fox, 0, 0);
    const o = new OffscreenCanvas(4800, 2520), oc = o.getContext('2d');
    oc.drawImage(stone, dx * 4, dy * 4, stone.width * k, stone.height * k);
    // only the stone, not its sky: its outline is the hull of its corners
    const P = before.map(([x, y]) => [(x * k + dx) * 4, (y * k + dy) * 4]);
    const cross = (p, a, b) => (a[0] - p[0]) * (b[1] - p[1]) - (a[1] - p[1]) * (b[0] - p[0]);
    const sorted = [...P].sort((a, b) => a[0] - b[0] || a[1] - b[1]), hull = [];
    for (const pass of [sorted, [...sorted].reverse()]) {
      const st = [];
      for (const q of pass) { while (st.length > 1 && cross(st.at(-2), st.at(-1), q) <= 0) st.pop(); st.push(q); }
      st.pop(); hull.push(...st);
    }
    oc.globalCompositeOperation = 'destination-in';
    oc.filter = 'blur(6px)';
    oc.beginPath(); hull.forEach(([x, y], i) => (i ? oc.lineTo(x, y) : oc.moveTo(x, y))); oc.closePath(); oc.fill();
    oc.filter = 'none';
    // and only left of the cut, feathered
    const t = CUT.tilt * Math.PI / 180, nx = Math.cos(t), ny = Math.sin(t);
    const cx = ((ab.x0 + ab.x1) / 2 - CUT.left * (ab.x1 - ab.x0)) * 4, cy = (ab.y0 + ab.y1) / 2 * 4;
    const fade = oc.createLinearGradient(cx - nx * 26, cy - ny * 26, cx + nx * 26, cy + ny * 26);
    fade.addColorStop(0, '#000'); fade.addColorStop(1, 'rgba(0,0,0,0)');
    oc.fillStyle = fade; oc.fillRect(0, 0, 4800, 2520);
    g.drawImage(o, 0, 0);
    // the seam: a thin light where the stone gives way, fading at both ends
    g.save(); g.globalCompositeOperation = 'screen'; g.translate(cx, cy); g.rotate(t);
    const h = (ab.y1 - ab.y0) * 4 * 0.6;
    for (const [w, a] of [[34, 0.16], [12, 0.35], [4, 0.7]]) {
      const v = g.createLinearGradient(0, -h, 0, h);
      v.addColorStop(0, 'rgba(255,230,190,0)'); v.addColorStop(0.5, `rgba(255,236,205,${a})`); v.addColorStop(1, 'rgba(255,230,190,0)');
      g.fillStyle = v; g.fillRect(-w / 2, -h, w, h * 2);
    }
    g.restore();
    // the frame: the stone about 60% of the height, a little below the middle (room for the wordmark)
    const H = (ab.y1 - ab.y0) * 4 / 0.62, W = H * 1200 / 630;
    const left = (ab.x0 + ab.x1) / 2 * 4 - W / 2, top = (ab.y0 + ab.y1) / 2 * 4 - 0.54 * H;
    const out = new OffscreenCanvas(2400, 1260);
    out.getContext('2d').drawImage(c, left, top, W, H, 0, 0, 2400, 1260);
    const blob = await out.convertToBlob({ type: 'image/png' });
    return 'data:image/png;base64,' + btoa(new Uint8Array(await blob.arrayBuffer()).reduce((s, b) => s + String.fromCharCode(b), ''));
  }, { A: uri(fox), B: uri(stone), before, after, CUT });
  const base = join(tmp, 'base.png');
  writeFileSync(base, Buffer.from(split.split(',')[1], 'base64'));

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
