// Frame timing and a repeatable benchmark, for profiling on a real iPhone
// (docs/profiling.md). Safari has no long-task API, so this measures what a
// player feels: the gap between animation frames.
//
//   strata.perf.mark('label')   start a segment; frames after it count toward it
//   strata.perf.report()        per segment: fps, p50 / p95 / p99 frame ms, worst,
//                               and janks (frames over 34 ms, i.e. a missed 30 fps beat)
//   strata.bench()              the same play every run: a level's intro, steady
//                               chiselling, the reveal, then idle; resolves to the report
//   ?perf (or localStorage strata.perf = '1')   a small live readout, top left
//
// Nothing here runs unless asked: the monitor starts on the first mark().

const segs = [];
let cur = null, last = 0, running = false, hud = null, hudT = 0;

function frame(t) {
  if (last && cur) cur.d.push(t - last);
  last = t;
  if (hud && t - hudT > 500) {
    hudT = t;
    const d = cur ? cur.d.slice(-60) : [];
    const avg = d.length ? d.reduce((a, b) => a + b, 0) / d.length : 0;
    hud.textContent = `${avg ? Math.round(1000 / avg) : '–'} fps · worst ${d.length ? Math.round(Math.max(...d)) : '–'} ms`;
  }
  requestAnimationFrame(frame);
}

function start() {
  if (running) return;
  running = true;
  requestAnimationFrame(frame);
}

export function mark(label) {
  start();
  cur = { label, d: [] };
  segs.push(cur);
}

const pct = (s, p) => s[Math.min(s.length - 1, Math.floor(p * s.length))];
export function report() {
  return segs.filter((s) => s.d.length).map(({ label, d }) => {
    const s = [...d].sort((a, b) => a - b), total = d.reduce((a, b) => a + b, 0);
    return {
      segment: label, frames: d.length, fps: +(1000 * d.length / total).toFixed(1),
      p50: +pct(s, 0.5).toFixed(1), p95: +pct(s, 0.95).toFixed(1), p99: +pct(s, 0.99).toFixed(1),
      worst: +s[s.length - 1].toFixed(1), janks: d.filter((x) => x > 34).length,
    };
  });
}

export function reset() { segs.length = 0; cur = null; }

export function showHud() {
  if (hud) return;
  hud = document.createElement('div');
  hud.id = 'perf-hud';
  hud.style.cssText = 'position:fixed;left:8px;top:calc(env(safe-area-inset-top) + 4px);z-index:99999;font:11px/1.2 ui-monospace,monospace;color:#fff;background:#0009;padding:3px 6px;border-radius:6px;pointer-events:none';
  document.body.appendChild(hud);
  start();
  if (!cur) mark('live');
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// The benchmark: one level, played the same way each time. `strata` is main.js's
// window.strata (startPuzzle, journalEntries, act, game).
export async function bench(strata, { id = 'maple-bonsai', chisels = 40, gapMs = 120 } = {}) {
  reset();
  const e = strata.journalEntries().find((x) => x.shape.id === id);
  if (!e) throw new Error(`bench: no level "${id}"`);
  mark('intro');                       // the block assembling, the camera settling
  strata.startPuzzle(e);
  await wait(3000);
  mark('chisel');                      // steady taps, each breaking one cube that doesn't belong
  const g = strata.game;
  const open = [];
  for (let i = 0; i < g.puzzle.size; i++) if (!g.puzzle.solid[i]) open.push(i);
  for (const i of open.slice(0, chisels)) { strata.act(i, 'break'); await wait(gapMs); }
  mark('reveal');                      // the rest at once: the win, the whirl, the rays, the gems
  for (const i of open.slice(chisels)) strata.act(i, 'break');
  await wait(6000);
  mark('idle');                        // nothing moving but the sky: the battery case
  await wait(5000);
  mark('done');
  const r = report();
  console.table(r);
  return r;
}
