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
  return { ctx, page };
}

// down to the map, then tap the level's stone there (as a player would)
async function startLevel(page, id) {
  const size = page.viewportSize();
  await page.waitForTimeout(1500);
  await swipeUp(page, size);
  await page.waitForTimeout(3000);
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
    await page.waitForTimeout(3000);
    await swipeUp(page, size);
    await page.waitForTimeout(4000);
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
};

await lock();
let browser;
try {
  browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    args: ['--use-angle=d3d11', '--enable-gpu'] });
  for (const s of sizes.length ? sizes : Object.keys(SIZES)) {
    for (const f of [1, 2, 3, 4, 5]) {
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
