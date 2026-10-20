// v5 shared bits: the browser (system Chrome via QA_CHROME), Playwright (the
// global install: this repo has no local copy), the server port, and the
// one-browser-at-a-time lock every Strata tool on this machine takes.
import { mkdirSync, rmSync, statSync } from 'node:fs';
export { chromium } from 'file:///C:/Users/Kellan/AppData/Roaming/npm/node_modules/playwright/index.mjs';

export const CHROME = process.env.QA_CHROME ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
export const PORT = process.env.PORT ?? 5251;
export const URL = `http://localhost:${PORT}/`;
export const OUT_DIR = 'trailer/v5';
export const WORK = 'trailer/v5/work';

const LOCK = 'C:/Users/Kellan/AppData/Local/Temp/strata-browser.lock';
// take the lock (retry while another tool holds it; stale after 20 min), run, release
export async function withLock(fn) {
  for (;;) {
    try { mkdirSync(LOCK); break; } catch {
      try { if (Date.now() - statSync(LOCK).mtimeMs > 20 * 60e3) { rmSync(LOCK, { recursive: true, force: true }); continue; } } catch {}
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  const release = () => { try { rmSync(LOCK, { recursive: true, force: true }); } catch {} };
  process.on('SIGINT', () => { release(); process.exit(130); });
  try { return await fn(); } finally { release(); }
}
