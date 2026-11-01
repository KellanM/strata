// QA aid: the Daily Stone's flow in a headless browser (docs/daily-stone.md),
// against a running server: the map's Today ring, a curated stone's solve and
// its reveal (name and story), the share line (never the name), Finds' Daily
// section, the next day, a dated stone on its date, Daily #1's generated stone,
// another language, and ?d=N links for a returning and a new player.
// Screenshots go to the folder given (default: the system's temp folder).
// Through the shared browser lock, as the other browser tools.
//   PORT=5317 node server.js   then   node tools/qa-daily.mjs 5317 [outDir]
import { mkdirSync, rmSync, statSync } from 'node:fs';
import { tmpdir, homedir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'file:///C:/Users/Kellan/AppData/Roaming/npm/node_modules/playwright/index.mjs';   // the global install
const port = process.argv[2] || '5317';
const out = (process.argv[3] || join(tmpdir(), 'strata-daily')) + '/';
mkdirSync(out, { recursive: true });
const shell = process.env.QA_CHROME || 'C:/Users/Kellan/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';
const LOCK = join(process.env.LOCALAPPDATA || join(homedir(), 'AppData', 'Local'), 'Temp', 'strata-browser.lock');
async function withLock(fn) {
  for (;;) {
    try { mkdirSync(LOCK); break; } catch {
      try { if (Date.now() - statSync(LOCK).mtimeMs > 20 * 60e3) { rmSync(LOCK, { recursive: true, force: true }); continue; } } catch {}
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  try { return await fn(); } finally { try { rmSync(LOCK, { recursive: true, force: true }); } catch {} }
}
const errors = [];
const log = (...a) => console.log(...a);
const assert = (c, m) => { if (!c) { console.log('FAIL', m); process.exitCode = 1; } else console.log('ok  ', m); };
let browser;

async function newPage(storage = {}) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await ctx.addInitScript((s) => {
    if (!sessionStorage.getItem('seeded')) {
      for (const [k, v] of Object.entries(s)) localStorage.setItem(k, v);
      sessionStorage.setItem('seeded', '1');
    }
    window.__shared = [];
    navigator.share = async (d) => { window.__shared.push(d.text); };
  }, storage);
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  return page;
}
const toMap = async (page) => {
  await page.waitForFunction(() => window.strata?.openMenu, null, { timeout: 30000 });
  await page.waitForTimeout(2500);
  await page.keyboard.press('Enter');   // the title's own key: on to the map
  await page.waitForTimeout(2500);
};
const solve = (page) => page.evaluate(() => {
  const s = window.strata, g = s.game, p = g.puzzle;
  // one slip on purpose, on a solid cube, then every empty cube
  const slip = p.solid.findIndex((v) => v);
  s.act(slip, 'break');
  for (let i = 0; i < p.size; i++) if (!p.solid[i] && !g.broken[i]) s.act(i, 'break');
  return { id: g.shape.id, solved: g.solved, mistakes: g.mistakes };
});
// the words over the solved stone
const reveal = (page) => page.evaluate(() => {
  const el = document.querySelector('#win-title');
  const txt = (s) => el.querySelector(s)?.textContent.replace(/\u00a0/g, ' ') ?? null;
  return { sub: txt('.sub'), name: txt('.name'), story: txt('.story'), shown: el.classList.contains('show') };
});
// Today, from the map: tap the ring, the stone opens; solve it; the reveal
async function playToday(page, shot) {
  await page.click('#map-today');
  await page.waitForTimeout(2200);
  const meta = await page.evaluate(() => ({ bar: document.querySelector('#pz-name').textContent, meta: document.querySelector('#pz-meta').textContent,
    id: window.strata.game.shape.id, day: window.strata.game.entry.daily }));
  const r = await solve(page);
  await page.waitForTimeout(5500);
  const words = await reveal(page);
  if (shot) await page.screenshot({ path: out + shot });
  return { ...meta, ...words, solved: r.solved, mistakes: r.mistakes };
}

const learned = { 'strata.tutorial': '1', 'strata.map.parted': '[]', 'strata.map.lit': '[]' };

async function run() {
  // 1. the map shows Today, after the lessons: 1 Nov 2026 is Daily #2, the first curated stone
  {
    const page = await newPage(learned);
    await page.goto(`http://localhost:${port}/?today=2026-11-01`);
    await toMap(page);
    const today = await page.evaluate(() => { const b = document.querySelector('#map-today'); return { hidden: b.hidden, day: b.dataset.day, done: b.classList.contains('done') }; });
    assert(!today.hidden && today.day === '2' && !today.done, `the map shows Today (Daily #${today.day})`);
    await page.evaluate(() => document.querySelector('#menu .map-scroll').scrollTo(0, 0));
    await page.waitForTimeout(600);
    await page.screenshot({ path: out + '1-map-today.png' });

    // 2. tap Today, today's curated stone opens, unnamed; solve it: named, with its story
    const r = await playToday(page, '3-reveal-piggy-bank.png');
    log('day 2:', JSON.stringify(r));
    assert(r.bar === 'Daily #2' && r.meta === 'today’s stone' && r.id === 'daily-piggy-bank', `Today opens Daily #2, unnamed: "${r.bar} · ${r.meta}"`);
    assert(r.name === 'Piggy Bank' && r.sub === 'Daily #2', `solved, it is named: "${r.sub} / ${r.name}"`);
    assert(r.story === 'It has been saving since Tuesday. It will not say what for.', 'the reveal tells its story');
    assert(r.solved && r.mistakes === 1, 'solved via the puzzle state, one slip');
    const acts = await page.evaluate(() => [...document.querySelectorAll('#actions button')].filter((b) => getComputedStyle(b).display !== 'none').map((b) => b.id));
    assert(JSON.stringify(acts) === JSON.stringify(['act-map', 'act-share']), `the result offers ${acts.join(', ')}`);

    // 3. Share: the text is right, and never names the stone
    await page.click('#act-share');
    await page.waitForTimeout(400);
    const shared = await page.evaluate(() => window.__shared);
    log('--- shared text ---\n' + shared[0] + '\n-------------------');
    const lines = (shared[0] ?? '').split('\n');
    assert(lines[0] === 'Strata · Daily #2', 'line 1: Strata and the day');
    assert(/^◆◆◇ · 1 slip · \d+:\d\d$/.test(lines[1]), 'line 2: gems, slips, time');
    assert(/^[🟨🟫]+$/u.test(lines[2]) && [...lines[2]].filter((c) => c === '🟫').length === 1, 'line 3: one square per wave, one slipped');
    assert(lines.at(-1) === 'https://kellanm.github.io/strata/?d=2', 'last line: the link');
    assert(!/piggy|bank|pig/i.test(shared[0]), 'the share line never names the stone');
    const store = await page.evaluate(() => Object.fromEntries(Object.keys(localStorage).filter((k) => k.startsWith('strata.daily')).map((k) => [k, localStorage.getItem(k)])));
    log('stored', JSON.stringify(store));
    const solvedStore = JSON.parse(await page.evaluate(() => localStorage.getItem('strata.solved') || '{}'));
    assert(!Object.keys(solvedStore).some((k) => k.startsWith('daily')), 'the levels’ record is untouched');

    // 4. back on the map: done, until tomorrow
    await page.click('#act-map');
    await page.waitForTimeout(1800);
    await page.evaluate(() => document.querySelector('#menu .map-scroll').scrollTo(0, 0));
    await page.waitForTimeout(500);
    assert(await page.evaluate(() => document.querySelector('#map-today').classList.contains('done')), 'Today shows done');
    await page.click('#map-today');
    await page.waitForTimeout(700);
    log('offer:', await page.evaluate(() => document.querySelector('#offer').innerText.replace(/\n+/g, ' | ')));
    await page.screenshot({ path: out + '4-map-done.png' });

    // 5. Finds: the day's object in its Daily section
    await page.evaluate(() => document.querySelector('#offer [data-no]')?.click());
    await page.waitForTimeout(400);
    await page.evaluate(() => document.querySelector('#map-journal').click());
    await page.waitForTimeout(1500);
    const finds = await page.evaluate(() => {
      const sec = document.querySelector('#journal .jr-daily');
      sec?.scrollIntoView();
      return sec && { title: sec.querySelector('h3').textContent, found: [...sec.querySelectorAll('.jr-tile.found .nm')].map((n) => n.textContent), tiles: sec.querySelectorAll('.jr-tile').length };
    });
    await page.waitForTimeout(900);
    assert(finds && finds.found.join() === 'Piggy Bank' && finds.tiles === 14, `Finds has a Daily section: ${JSON.stringify(finds)}`);
    await page.screenshot({ path: out + '5-finds-daily.png' });
    await page.evaluate(() => document.querySelector('#journal .jr-daily .jr-tile.found')?.click());
    await page.waitForTimeout(1500);
    const view = await page.evaluate(() => [...document.querySelectorAll('#journal-view .jv-chapter, #journal-view .jv-name, #journal-view .jv-story')].map((e) => e.textContent));
    assert(view[1] === 'Piggy Bank' && view[0] === 'Daily Stones' && /Tuesday/.test(view[2]), `its turntable: ${view.join(' / ')}`);
    await page.screenshot({ path: out + '6-finds-view.png' });

    // 6. the next day: it resets, the next stone of the rotation (and the run is two days)
    await page.evaluate(() => { localStorage.setItem('strata.dev.today', '2026-11-02'); });
    await page.goto(`http://localhost:${port}/`);
    await toMap(page);
    const next = await page.evaluate(() => { const b = document.querySelector('#map-today'); return { day: b.dataset.day, done: b.classList.contains('done') }; });
    assert(next.day === '3' && !next.done, `the next day it resets (Daily #${next.day}, not done)`);
    const r3 = await playToday(page, '7-reveal-genie.png');
    log('day 3:', JSON.stringify(r3));
    assert(r3.id === 'daily-genie' && r3.name === 'Genie' && /lamp/.test(r3.story ?? ''), 'tomorrow’s stone is the Genie, named, with its story');
    await page.click('#act-share');
    await page.waitForTimeout(300);
    const shared2 = await page.evaluate(() => window.__shared.at(-1));
    log('--- day 3 ---\n' + shared2);
    assert(/\n2 days in a row\n/.test(shared2) && !/genie|lamp/i.test(shared2), 'two days in a row, and no name');
    await page.context().close();
  }

  // 7. a dated stone on its date: 31 Oct 2027 is Daily #366, the Black Cat
  {
    const page = await newPage(learned);
    await page.goto(`http://localhost:${port}/?today=2027-10-31`);
    await toMap(page);
    const r = await playToday(page, '8-reveal-black-cat.png');
    log('day 366:', JSON.stringify(r));
    assert(r.day === 366 && r.id === 'daily-black-cat' && r.name === 'Black Cat' && r.sub === 'Daily #366', '31 Oct 2027 gives the Black Cat on Daily #366');
    await page.click('#act-share');
    await page.waitForTimeout(300);
    assert(!/black|cat/i.test(await page.evaluate(() => window.__shared.at(-1))), 'its share line has no name');
    await page.context().close();
  }

  // 8. Daily #1, before the cutover: its generated stone, named by its day as before
  {
    const page = await newPage(learned);
    await page.goto(`http://localhost:${port}/?today=2026-10-31`);
    await toMap(page);
    const r = await playToday(page, '9-reveal-day-1.png');
    log('day 1:', JSON.stringify(r));
    assert(r.day === 1 && r.id === 'daily-1' && r.name === 'Daily #1' && r.sub === 'today’s stone' && r.story == null, '31 Oct 2026 keeps its generated stone, Daily #1');
    await page.context().close();
  }

  // 9. in Japanese: the name and story from ja.js
  {
    const page = await newPage(learned);
    await page.goto(`http://localhost:${port}/?today=2026-11-04&lang=ja`);
    await toMap(page);
    const r = await playToday(page, '10-reveal-ja-instant-camera.png');
    log('ja:', JSON.stringify(r));
    assert(r.id === 'daily-instant-camera' && r.name === 'インスタントカメラ' && r.story === 'あなたを撮った。どう思ったかは、まだ考え中。' && r.sub === 'デイリー #5',
      '?lang=ja shows the Japanese name and story');
    await page.click('#act-share');
    await page.waitForTimeout(300);
    assert(!/インスタント|カメラ|Camera/i.test(await page.evaluate(() => window.__shared.at(-1))), 'the Japanese share line has no name');
    await page.context().close();
  }

  // 10. ?d=N for a returning player: on to that stone from the title (Daily #13: the Piggy Bank again)
  {
    const page = await newPage(learned);
    await page.goto(`http://localhost:${port}/?d=13&today=2026-11-12`);
    await page.waitForFunction(() => window.strata?.openMenu, null, { timeout: 30000 });
    await page.waitForTimeout(3500);
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => window.strata.game?.entry?.daily === 13, null, { timeout: 15000 }).catch(() => {});
    const g = await page.evaluate(() => [window.strata.game?.entry?.daily, window.strata.game?.shape.id]);
    assert(g[0] === 13 && g[1] === 'daily-piggy-bank', `?d=13 opens Daily #13 for a returning player (${g.join(', ')})`);
    await page.waitForTimeout(1500);
    await page.screenshot({ path: out + '11-link-returning.png' });
    await page.context().close();
  }

  // 11. ?d=N for a new player: the short lessons, then the stone
  {
    const page = await newPage({});
    await page.goto(`http://localhost:${port}/?d=13&today=2026-11-12`);
    await toMap(page);
    const head = await page.evaluate(() => [document.querySelector('#map-progress').textContent, document.querySelector('#map-today').hidden, document.querySelector('.map-node.learn .mt')?.textContent]);
    assert(head[1] === true && head[2] === '7 lessons first', `new player: no Today ring yet; Learn says "${head[2]}"; head "${head[0]}"`);
    await page.click('.map-node.learn');
    await page.waitForTimeout(1500);
    const lessons = [];
    for (let k = 0; k < 7; k++) {
      await page.waitForFunction(() => window.strata.game?.entry?.lesson && !window.strata.game.solved, null, { timeout: 15000 });
      lessons.push(await page.evaluate(() => window.strata.game.shape.id));
      await page.evaluate(() => {
        const s = window.strata, g = s.game, p = g.puzzle;
        for (let i = 0; i < p.size; i++) if (!p.solid[i] && !g.broken[i]) s.act(i, 'break');
      });
      await page.waitForTimeout(4600);
    }
    log('lessons run:', lessons.join(' '));
    await page.waitForFunction(() => window.strata.game?.entry?.daily === 13, null, { timeout: 15000 }).catch(() => {});
    const g = await page.evaluate(() => [window.strata.game?.shape.id, localStorage.getItem('strata.tutorial')]);
    assert(lessons.length === 7 && g[0] === 'daily-piggy-bank' && g[1] === '1', `after ${lessons.length} lessons, straight to ${g[0]}`);
    await page.waitForTimeout(1200);
    await page.screenshot({ path: out + '12-link-new-player-stone.png' });
    await page.context().close();
  }
}

await withLock(async () => {
  browser = await chromium.launch({ executablePath: shell, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  try { await run(); } finally { await browser.close(); }
});
log('page errors:', errors.length ? errors : 'none');
log('screenshots:', out);
