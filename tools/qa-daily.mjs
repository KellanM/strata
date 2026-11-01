// QA aid: the Daily Stone's flow in a headless browser (docs/daily-stone.md),
// against a running server: the map's Today ring, a solve, the share line, the
// next day, and ?d=N links for a returning and a new player. Screenshots go to
// the folder given (default: the system's temp folder).
//   PORT=5317 node server.js   then   node tools/qa-daily.mjs 5317 [outDir]
import { mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'file:///C:/Users/Kellan/AppData/Roaming/npm/node_modules/playwright/index.mjs';   // the global install
const port = process.argv[2] || '5317';
const out = (process.argv[3] || join(tmpdir(), 'strata-daily')) + '/';
mkdirSync(out, { recursive: true });
const shell = process.env.QA_CHROME || 'C:/Users/Kellan/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';
const browser = await chromium.launch({ executablePath: shell, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const errors = [];
const log = (...a) => console.log(...a);
const assert = (c, m) => { if (!c) { console.log('FAIL', m); process.exitCode = 1; } else console.log('ok  ', m); };

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

const learned = { 'strata.tutorial': '1', 'strata.map.parted': '[]', 'strata.map.lit': '[]' };

// 1. the map shows Today, after the lessons
{
  const page = await newPage(learned);
  await page.goto(`http://localhost:${port}/?today=2026-11-12`);
  await toMap(page);
  const today = await page.evaluate(() => { const b = document.querySelector('#map-today'); return { hidden: b.hidden, day: b.dataset.day, done: b.classList.contains('done'), n: window.strata.todayN() }; });
  assert(!today.hidden && today.day === '13' && !today.done, `the map shows Today (Daily #${today.day})`);
  await page.evaluate(() => document.querySelector('#menu .map-scroll').scrollTo(0, 0));
  await page.waitForTimeout(600);
  await page.screenshot({ path: out + '1-map-today.png' });

  // 2. tap Today, the stone opens; solve it
  await page.click('#map-today');
  await page.waitForTimeout(2200);
  const meta = await page.evaluate(() => [document.querySelector('#pz-name').textContent, document.querySelector('#pz-meta').textContent, window.strata.game.shape.dims.join('x')]);
  assert(meta[0] === 'Daily #13' && meta[1] === 'today’s stone', `the stone opens: ${meta.join(' / ')}`);
  await page.screenshot({ path: out + '2-daily-stone.png' });
  const r = await solve(page);
  assert(r.solved && r.mistakes === 1, `solved via the puzzle state (${JSON.stringify(r)})`);
  await page.waitForTimeout(5500);
  const acts = await page.evaluate(() => [...document.querySelectorAll('#actions button')].filter((b) => getComputedStyle(b).display !== 'none').map((b) => b.id));
  assert(JSON.stringify(acts) === JSON.stringify(['act-map', 'act-share']), `the result offers ${acts.join(', ')}`);
  await page.screenshot({ path: out + '3-result.png' });

  // 3. Share: the text is right
  await page.click('#act-share');
  await page.waitForTimeout(400);
  const shared = await page.evaluate(() => window.__shared);
  log('--- shared text ---\n' + shared[0] + '\n-------------------');
  const lines = (shared[0] ?? '').split('\n');
  assert(lines[0] === 'Strata · Daily #13', 'line 1: Strata and the day');
  assert(/^◆◆◇ · 1 slip · \d+:\d\d$/.test(lines[1]), 'line 2: gems, slips, time');
  assert(/^[🟨🟫]+$/u.test(lines[2]) && [...lines[2]].filter((c) => c === '🟫').length === 1, 'line 3: one square per wave, one slipped');
  assert(lines.at(-1) === 'https://kellanm.github.io/strata/?d=13', 'last line: the link');
  const store = await page.evaluate(() => Object.fromEntries(Object.keys(localStorage).filter((k) => k.startsWith('strata.daily')).map((k) => [k, localStorage.getItem(k)])));
  log('stored', JSON.stringify(store));
  assert(!('daily-13' in JSON.parse(await page.evaluate(() => localStorage.getItem('strata.solved') || '{}'))), 'the levels’ record is untouched');

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

  // 5. the next day: it resets (and the run is two days, once that's solved)
  await page.evaluate(() => { localStorage.setItem('strata.dev.today', '2026-11-13'); });
  await page.goto(`http://localhost:${port}/`);
  await toMap(page);
  const next = await page.evaluate(() => { const b = document.querySelector('#map-today'); return { day: b.dataset.day, done: b.classList.contains('done') }; });
  assert(next.day === '14' && !next.done, `the next day it resets (Daily #${next.day}, not done)`);
  await page.click('#map-today');
  await page.waitForTimeout(2200);
  const shape14 = await page.evaluate(() => window.strata.game.shape.id);
  assert(shape14 === 'daily-14', 'tomorrow’s stone is a new one');
  await solve(page);
  await page.waitForTimeout(5000);
  await page.click('#act-share');
  await page.waitForTimeout(300);
  const shared2 = await page.evaluate(() => window.__shared.at(-1));
  log('--- day 2 ---\n' + shared2);
  assert(/\n2 days in a row\n/.test(shared2), 'two days in a row');
  await page.context().close();
}

// 6. ?d=N for a returning player: on to that stone from the title
{
  const page = await newPage(learned);
  await page.goto(`http://localhost:${port}/?d=13&today=2026-11-12`);
  await page.waitForFunction(() => window.strata?.openMenu, null, { timeout: 30000 });
  await page.waitForTimeout(3500);
  // the title: swipe up / tap to the map (a tap on the title goes on once it's open)
  await page.keyboard.press('Enter');
  await page.waitForFunction(() => window.strata.game?.entry?.daily === 13, null, { timeout: 15000 }).catch(() => {});
  const g = await page.evaluate(() => window.strata.game?.shape.id);
  assert(g === 'daily-13', `?d=13 opens Daily #13 for a returning player (${g})`);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: out + '5-link-returning.png' });
  await page.context().close();
}

// 7. ?d=N for a new player: the short lessons, then the stone
{
  const page = await newPage({});
  await page.goto(`http://localhost:${port}/?d=13&today=2026-11-12`);
  await toMap(page);
  const head = await page.evaluate(() => [document.querySelector('#map-progress').textContent, document.querySelector('#map-today').hidden, document.querySelector('.map-node.learn .mt')?.textContent]);
  assert(head[1] === true && head[2] === '7 lessons first', `new player: no Today ring yet; Learn says "${head[2]}"; head "${head[0]}"`);
  await page.evaluate(() => document.querySelector('#menu .map-scroll').scrollTo(0, 0));
  await page.waitForTimeout(500);
  await page.screenshot({ path: out + '6-link-new-player-map.png' });
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
  assert(lessons.length === 7 && g[0] === 'daily-13' && g[1] === '1', `after ${lessons.length} lessons, straight to ${g[0]}`);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: out + '7-link-new-player-stone.png' });
  await page.context().close();
}

log('page errors:', errors.length ? errors : 'none');
await browser.close();
