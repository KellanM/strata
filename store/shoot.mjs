// App Store screenshots from real gameplay (store/screenshots/).
//   PORT=5290 node server.js &   then   node store/shoot.mjs [6.9|6.5] [frame ...]
// Takes the shared browser lock (strata-browser.lock) for the whole run.
import { chromium } from 'file:///C:/Users/Kellan/AppData/Roaming/npm/node_modules/playwright/index.mjs';
import { mkdirSync, rmSync } from 'node:fs';

const BASE = process.env.URL || 'http://localhost:5290/';
const OUT = process.env.OUT || new URL('screenshots/', import.meta.url).pathname.slice(1);
const LOCK = 'C:/Users/Kellan/AppData/Local/Temp/strata-browser.lock';
const SIZES = {
  '6.9': { width: 440, height: 956 },   // 1320x2868
  '6.5': { width: 428, height: 926 },   // 1284x2778
};
const args = process.argv.slice(2);
const sizes = args.filter((a) => SIZES[a]);
const frames = args.filter((a) => !SIZES[a]);
const want = (f) => !frames.length || frames.includes(String(f));
mkdirSync(OUT, { recursive: true });

const SOLVED = ['steps', 'heart', 'teabag-pal', 'candle', 'toaster', 'key', 'bed', 'chair'];
const solvedJSON = JSON.stringify(Object.fromEntries(SOLVED.map((id) => [id, { time: 60, mistakes: 0, stars: 3, score: 1500 }])));

async function lock() {
  for (;;) {
    try { mkdirSync(LOCK); return; } catch { await new Promise((r) => setTimeout(r, 5000)); }
  }
}

// a fresh page with a save where the lessons are done and some stones solved
async function open(browser, size, { solved = solvedJSON, query = '?nosplash' } = {}) {
  const ctx = await browser.newContext({ viewport: size, deviceScaleFactor: 3, isMobile: true, hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1' });
  await ctx.addInitScript(({ solved }) => {
    if (sessionStorage.getItem('shot.init')) return;
    sessionStorage.setItem('shot.init', '1');
    localStorage.setItem('strata.tutorial', '1');
    localStorage.setItem('strata.learned', '1');
    localStorage.setItem('strata.dev.unlock', '1');
    localStorage.setItem('strata.install.later', String(Date.now()));
    localStorage.setItem('strata.ads.off', '1');
    localStorage.setItem('strata.solved', solved);
  }, { solved });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log('pageerror', e.message));
  await page.goto(BASE + query);
  await page.waitForFunction(() => window.strata?.game);
  // web-only furniture that the app does not have
  await page.addStyleTag({ content: '#install, .sim-ad { display: none !important; }' });
  // NOACTIONS=1: a result without its Map · Next · Replay rings, the object alone
  if (process.env.NOACTIONS) await page.addStyleTag({ content: '#actions { display: none !important; }' });
  return { ctx, page };
}

// from the title down to the map: a tap once the title is up (the opening is a tap now, not a swipe),
// then the swoop to the current stone, and a moment to settle
async function toMap(page) {
  await page.waitForFunction(() => document.querySelector('#title')?.classList.contains('show'));
  await page.waitForTimeout(2000);
  const size = page.viewportSize();
  for (let k = 0; k < 8 && await page.evaluate(() => document.querySelector('#title').classList.contains('show')); k++) {
    await page.mouse.click(size.width / 2, size.height / 2);
    await page.waitForTimeout(1200);
  }
  await page.waitForFunction(() => !document.querySelector('#title').classList.contains('show') && document.querySelector('#menu').classList.contains('show'));
  await page.waitForTimeout(3000);
}

// down to the map, then tap the level's stone there (as a player would)
async function startLevel(page, id) {
  await toMap(page);
  const node = page.locator(`.map-node[data-id="${id}"]`);
  await node.evaluate((el) => el.scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(1500);
  await node.click();
  await page.waitForFunction((id) => window.strata.game?.shape?.id === id, id);
}

async function solve(page) {
  await page.evaluate(() => {
    const g = window.strata.game;
    for (let i = 0; i < g.puzzle.size; i++) if (!g.puzzle.solid[i]) window.strata.act(i, 'break');
  });
}

// a swipe up with a real finger (CDP touch), from the title down to the map
async function swipeUp(page, size) {
  const cdp = await page.context().newCDPSession(page);
  const x = size.width / 2;
  let y = size.height * 0.8;
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
  for (let i = 0; i < 12; i++) {
    y -= size.height * 0.05;
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y }] });
    await page.waitForTimeout(16);
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
}

const FRAMES = {
  // 1: the title once the stone is opened and the name has formed in the stars
  async 1(browser, size) {
    const { ctx, page } = await open(browser, size);
    await page.waitForTimeout(2500);
    await page.touchscreen.tap(size.width / 2, size.height / 2);
    await page.waitForTimeout(9000);
    return { ctx, page };
  },
  // 2: a level mid-solve, some cubes chiselled
  async 2(browser, size) {
    const { ctx, page } = await open(browser, size);
    await page.waitForTimeout(1500);
    await startLevel(page, process.env.MID || 'maple-bonsai');
    await page.waitForTimeout(3500);
    await page.evaluate(([frac, axis]) => {
      const g = window.strata.game;
      const empty = [];
      for (let i = 0; i < g.puzzle.size; i++) if (!g.puzzle.solid[i]) empty.push(i);
            const c = (i) => g.puzzle.coords(i);
      const ax = Number(axis);   // whole layers off one face, the way a player peels
      empty.sort((a, b) => c(b)[ax] - c(a)[ax]);
      for (const i of empty.slice(0, Math.floor(empty.length * frac))) window.strata.act(i, 'break');
    }, [Number(process.env.FRAC || 0.55), process.env.AXIS || '1']);
    await page.waitForTimeout(2500);
    return { ctx, page };
  },
  // 3: a solved level's reveal
  async 3(browser, size) {
    const { ctx, page } = await open(browser, size);
    await page.waitForTimeout(1500);
    await startLevel(page, process.env.SOLVE || 'kasbah');
    await page.waitForTimeout(3000);
    await solve(page);
    await page.waitForTimeout(6000);
    return { ctx, page };
  },
  // 4: the map, a few stones solved
  async 4(browser, size) {
    const { ctx, page } = await open(browser, size);
    await toMap(page);
    return { ctx, page };
  },
  // 5: a striking object in a dark palette
  async 5(browser, size) {
    const { ctx, page } = await open(browser, size);
    await page.waitForTimeout(1500);
    await startLevel(page, process.env.DARK || 'baby-dragon');
    await page.waitForTimeout(3000);
    await solve(page);
    await page.waitForTimeout(6000);
    return { ctx, page };
  },
  // 6: a row of 0s mid-break - a real double-tap on a 0 face, caught as the cascade runs
  async 6(browser, size) {
    const { ctx, page } = await open(browser, size);
    await page.waitForTimeout(1500);
    await startLevel(page, process.env.ZERO || 'orrery');
    await page.waitForTimeout(3500);
    // a pinch in, as a player leans close to chisel
    await page.evaluate((z) => { const c = window.strata.camera; c.zoom *= z; c.updateProjectionMatrix(); }, Number(process.env.ZOOM || 1.6));
    await page.waitForTimeout(600);
    // a long 0 line along the top (or front) face, tapped on its end turned toward the camera
    const at = await page.evaluate(() => {
      const { game: g, camera, cubes } = window.strata;
      const p = g.puzzle, d = p.dims;
      const V = camera.position.constructor;
      const toCam = camera.getWorldDirection(new V()).negate();
      const n = [new V(1, 0, 0), new V(0, 1, 0), new V(0, 0, 1)];
      let best = null;
      for (const line of p.lines) {
        if (line.hidden || line.count !== 0) continue;
        const ax = line.axis;
        for (const side of [1, -1]) {
          const facing = n[ax].clone().multiplyScalar(side).transformDirection(cubes.mesh?.matrixWorld ?? camera.matrixWorldInverse.clone().identity()).dot(toCam);
          if (facing < 0.35) continue;
          const cells = [...line.cells].filter((c) => !g.broken[c]);
          if (cells.length < 6) continue;
          const front = cells.reduce((a, c) => ((p.coords(c)[ax] - p.coords(a)[ax]) * side > 0 ? c : a));
          // a row along the top or the front face cuts a groove you can see; one straight in only leaves a hole
          const [cx, cy, cz] = p.coords(cells[0]);
          const onTop = ax !== 1 && cy === d[1] - 1, onFront = ax !== 2 && cz === d[2] - 1;
          const score = cells.length + facing * 3 + (onTop ? 12 : 0) + (onFront ? 6 : 0);
          if (!best || score > best.score) best = { front, ax, side, score, n: cells.length };
        }
      }
      if (!best) return { dbg: p.lines.filter((l) => l.count === 0 && !l.hidden).map((l) => [l.axis, l.cells.filter((c) => !g.broken[c]).length]).slice(0, 30), toCam: toCam.toArray(), mat: cubes.mesh?.matrixWorld.elements };
      const [x, y, z] = p.coords(best.front);
      const w = new V(x - (d[0] - 1) / 2, y - (d[1] - 1) / 2, z - (d[2] - 1) / 2);
      w.setComponent(best.ax, w.getComponent(best.ax) + 0.48 * best.side);
      if (cubes.mesh) w.applyMatrix4(cubes.mesh.matrixWorld);
      w.project(camera);
      return { x: (w.x + 1) / 2 * innerWidth, y: (1 - w.y) / 2 * innerHeight, n: best.n };
    });
    if (!at || at.dbg) throw new Error('no 0 line facing the camera ' + JSON.stringify(at));
    const before = await page.evaluate(() => window.strata.game.broken.filter(Boolean).length);
    await page.touchscreen.tap(at.x, at.y);
    await page.waitForTimeout(140);
    await page.touchscreen.tap(at.x, at.y);
    await page.waitForTimeout(Number(process.env.CATCH || 200));
    const after = await page.evaluate(() => window.strata.game.broken.filter(Boolean).length);
    console.log(`zero row: ${at.n} cubes in line, ${after - before} broken at the shot`);
    return { ctx, page };
  },
  // 7: the Journal, a shelf of uncovered things - the collection the stones are hiding
  async 7(browser, size) {
    const ids = (process.env.SHELF || 'steps,heart,teabag-pal,candle,toaster,key,bed,chair,rucksack,pocket-compass,heron,moss-tortoise,sloth,chestnut-cart,mother-tree,maple-bonsai,black-smoker,yeti-crab,jellyfish,meerkats,chameleon,kasbah,tea-house,summit-shrine,moai,geode,stone-golem,broken-column,pegasus,yak,mountain-goat,origami-fox,lantern-gate,kokeshi,maneki-neko,tin-frog,pocket-watch,clock-tower,aqueduct,alpaca,trilobite,orrery,coelacanth,frost-mammoth').split(',');
    const solved = JSON.stringify(Object.fromEntries(ids.map((id) => [id, { time: 60, mistakes: 0, stars: 3, score: 1500 }])));
    const { ctx, page } = await open(browser, size, { solved });
    await page.evaluate((ids) => localStorage.setItem('strata.seen.objects', JSON.stringify(ids)), ids);
    await toMap(page);
    await page.click('#map-journal');
    await page.waitForTimeout(2000);
    if (process.env.JSCROLL) await page.evaluate((y) => { const el = [...document.querySelectorAll('#journal *')].find((e) => e.scrollHeight > e.clientHeight + 20) ?? document.querySelector('#journal'); el.scrollTop = y; }, Number(process.env.JSCROLL));
    // JCHAPTER: open the shelf at that chapter's header (e.g. 'Old Stones')
    if (process.env.JCHAPTER) await page.evaluate((name) => {
      const sec = [...document.querySelectorAll('#journal .jr-chapter')].find((x) => x.querySelector('h3').textContent === name);
      let el = sec.parentElement; while (el && el.scrollHeight <= el.clientHeight + 20) el = el.parentElement;
      el.scrollTop += sec.getBoundingClientRect().top - el.getBoundingClientRect().top;
    }, process.env.JCHAPTER);
    await page.waitForTimeout(800);
    return { ctx, page };
  },
};

await lock();
let browser;
try {
  browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args: ['--use-angle=d3d11', '--enable-gpu'] });
  for (const s of sizes.length ? sizes : Object.keys(SIZES)) {
    for (const f of [1, 2, 3, 4, 5, 6, 7]) {
      if (!want(f)) continue;
      const { ctx, page } = await FRAMES[f](browser, SIZES[s]);
      const file = `${OUT}${process.env.PREFIX || ''}${s.replace('.', '_')}in-${f}.png`;
      await page.screenshot({ path: file });
      console.log(file);
      await ctx.close();
    }
  }
} finally {
  await browser?.close();
  rmSync(LOCK, { recursive: true, force: true });
}
