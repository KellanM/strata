// Shared by the trailer's capture passes: which timeline to play, the browser
// (system Chrome, one at a time across every tool on this machine), the
// virtual clock, and the save a capture starts from.
//
//   TRAILER=v2 picks tools/trailer/timeline-v2.mjs (default: timeline.mjs, v1)
import { mkdirSync, rmSync, statSync } from 'node:fs';

export const VERSION = process.env.TRAILER ?? 'v1';
export const T = await import(VERSION === 'v1' ? './timeline.mjs' : `./timeline-${VERSION}.mjs`);
// where this version's files go: v1 keeps its old names, v2 on are suffixed
export const OUT = (name) => `trailer/${name}${VERSION === 'v1' ? '' : '-' + VERSION}`;
export const URL = `http://localhost:${process.env.PORT ?? 5198}/`;
export const CHROME = process.env.QA_CHROME ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';

// one browser at a time: a lock directory every tool here takes (stale after 20 min)
const LOCK = 'C:/Users/Kellan/AppData/Local/Temp/strata-browser.lock';
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

// the save the trailer starts from: a timeline's own (v2 on), or v1's
export function storageFor(solved) {
  if (T.storage) return T.storage();
  const s = {}; solved.forEach((id) => { s[id] = { time: 80, mistakes: 0, stars: 3, score: 1500 }; });
  return {
    'strata.tutorial': '1',
    'strata.install.later': String(Date.now()),
    'strata.chapters': JSON.stringify(['First Light', 'Moss Garden', 'The Orchard', 'The Lagoon', 'Ember Steps', 'Lantern Festival', 'Starfall']),
    'strata.solved': JSON.stringify(s),
  };
}
export const SEED_STORAGE = (kv) => { localStorage.clear(); for (const [k, v] of Object.entries(kv)) localStorage.setItem(k, v); };

export const VIRTUAL_TIME = `(() => {
  let vt = 0;
  const base = Date.now();
  performance.now = () => vt;
  Date.now = () => base + vt;
  let raf = [], rafId = 1, timers = [], tid = 1;
  window.requestAnimationFrame = (cb) => { const id = rafId++; raf.push([id, cb]); return id; };
  window.cancelAnimationFrame = (id) => { raf = raf.filter((r) => r[0] !== id); };
  window.setTimeout = (fn, ms = 0, ...a) => { const id = tid++; timers.push({ id, at: vt + Math.max(0, +ms || 0), fn, a }); return id; };
  window.clearTimeout = (id) => { timers = timers.filter((t) => t.id !== id); };
  window.setInterval = (fn, ms, ...a) => {
    const id = tid++;
    const tick = () => { timers.push({ id, at: vt + ms, fn: tick, a: [] }); fn(...a); };
    timers.push({ id, at: vt + ms, fn: tick, a: [] });
    return id;
  };
  window.clearInterval = window.clearTimeout;
  const starts = new WeakMap();
  window.__advance = (ms) => {
    const end = vt + ms;
    for (;;) {
      timers.sort((x, y) => x.at - y.at);
      const t = timers[0];
      if (!t || t.at > end) break;
      timers.shift();
      vt = Math.max(vt, t.at);
      try { typeof t.fn === 'function' && t.fn(...t.a); } catch (e) { console.error(e); }
    }
    vt = end;
    const q = raf; raf = [];
    for (const [, cb] of q) { try { cb(vt); } catch (e) { console.error(e); } }
    for (const an of document.getAnimations()) {
      if (!starts.has(an)) starts.set(an, vt - (an.currentTime ?? 0));
      try { an.pause(); an.currentTime = vt - starts.get(an); } catch (e) {}
    }
  };
})();`;
