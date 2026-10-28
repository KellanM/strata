// Frame timing and a repeatable benchmark, for profiling on a real iPhone
// (docs/profiling.md). Safari has no long-task API, so this measures what a
// player feels: the gap between animation frames.
//
//   strata.perf.mark('label')   start a segment; frames after it count toward it
//   strata.perf.report()        per segment: fps, p50 / p95 / p99 frame ms, worst,
//                               and janks (frames over 34 ms, i.e. a missed 30 fps beat)
//   strata.bench()              the same play every run: a level's intro, steady
//                               chiselling to the last cube, the player's reveal, idle,
//                               then a burst completion as a stress case; resolves to the report
//   powerCheck(report)          flags a run capped at 30 fps (Low Power Mode, issue #4)
//   boot(name)                  STRATA_BOOT lines for cold-start timing (issue #7)
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
//
// Two completions, kept apart (issue #5):
//   rotate, zoom  a one-finger turn and a two-finger pinch on the half-chiselled stone (issue #6)
//   reveal        the player's: every cube but one chiselled at the same steady
//                 cadence, then the last one alone, and the reveal measured from that tap
//   reveal-burst  a stress case, not a player number: the stone restarted and every
//                 cube broken in one loop (a hundred breaks in one frame), then the reveal.
//                 Skip it with { burst: false }.
// The run is also checked for Low Power Mode (issue #4): iOS pins
// requestAnimationFrame to 30 fps there, so an idle p50 near 33 ms means the
// whole run is capped and its numbers can't be compared. JS can't read the
// power state, so this is an inference from the frames; it is logged with the result.
export async function bench(strata, { id = 'maple-bonsai', chisels = 40, gapMs = 120, burst = true } = {}) {
  reset();
  const e = strata.journalEntries().find((x) => x.shape.id === id);
  if (!e) throw new Error(`bench: no level "${id}"`);
  const openCells = () => {
    const g = strata.game, out = [];
    for (let i = 0; i < g.puzzle.size; i++) if (!g.puzzle.solid[i] && !g.broken[i]) out.push(i);
    return out;
  };

  // Issue #2: the first-launch hang is the app applying a big layer update as the
  // level starts. Count the layer-prone elements either side of it, and say what
  // the level was started from (a lesson, the map, the title), since the bench
  // doesn't start it the way a player does (a tap on the map's stone).
  const from = where(strata);
  const layersBefore = layerCensus();
  mark('intro');                       // the block assembling, the camera settling
  strata.startPuzzle(e);
  await wait(3000);
  mark('census');                      // not a measurement: the census itself costs a frame
  const layersAfter = layerCensus();
  await wait(100);
  mark('chisel');                      // steady taps, each breaking one cube that doesn't belong
  let open = openCells();
  for (const i of open.slice(0, chisels)) { strata.act(i, 'break'); await wait(gapMs); }
  // Issue #6: turning and pinching, replayed as real pointer events on the canvas,
  // so they go through the game's own handler and OrbitControls as a finger does
  const canvas = document.getElementById('scene');   // the game's WebGL canvas
  if (canvas) {
    // start where no peel diamond is (the game's own hit test), or the touch peels instead of turning
    const r = canvas.getBoundingClientRect(), cx = r.left + r.width / 2;
    const clear = (y) => [cx - 160, cx - 140, cx + 140, cx + 160].every((x) => !strata.handles?.hit?.(x, y, strata.camera, r, 34));
    const cy = [0.85, 0.8, 0.9, 0.75, 0.3].map((f) => r.top + r.height * f).find(clear) ?? r.top + r.height * 0.85;
    mark('rotate');                    // one finger: 280 px right over 1.5 s, and back
    await gesture(canvas, 1500, (k) => [[cx - 140 + 280 * tri(k), cy]]);
    await wait(800);                   // the turn's damping settling
    mark('zoom');                      // two fingers: spread from 120 to 320 px apart over 1.5 s, and back
    await gesture(canvas, 1500, (k) => { const h = 60 + 100 * tri(k); return [[cx - h, cy], [cx + h, cy]]; });
    await wait(800);
  }
  mark('chisel-rest');                 // the same cadence, down to the last cube
  open = openCells();
  for (const i of open.slice(0, -1)) { strata.act(i, 'break'); await wait(gapMs); }
  mark('reveal');                      // the last tap, as a player makes it: the win, the whirl, the rays, the gems
  for (const i of openCells()) strata.act(i, 'break');
  await wait(6000);
  mark('idle');                        // nothing moving but the sky: the battery case, and the power check
  await wait(5000);

  if (burst) {
    mark('restart');                   // the same stone again (warm), then the stress case
    strata.startPuzzle(e);
    await wait(3000);
    mark('reveal-burst');              // every cube at once: NOT a player number
    for (const i of openCells()) strata.act(i, 'break');
    await wait(6000);
  }
  mark('done');
  const r = report().filter((x) => x.segment !== 'census');
  last_ = { from, layersBefore, layersAfter };
  console.table(r);
  const power = powerCheck(r);
  if (power.lowPowerSuspected) console.warn(`STRATA_BENCH_WARNING ${power.note}`);
  return r;
}

// A gesture as touch pointer events on the canvas: path(k) gives each finger's
// [x, y] for k in 0..1 over `ms` there and the same again back (tri), one step a frame.
// Synthetic pointers can't be captured, so setPointerCapture is a no-op meanwhile.
const tri = (k) => (k < 0.5 ? k * 2 : 2 - k * 2);
const nextFrame = () => new Promise((r) => requestAnimationFrame(r));
export async function gesture(el, ms, path) {
  const capture = el.setPointerCapture, release = el.releasePointerCapture;
  el.setPointerCapture = el.releasePointerCapture = () => {};
  const send = (type, pts) => pts.forEach(([x, y], n) => el.dispatchEvent(new PointerEvent(type, {
    pointerId: 900 + n, pointerType: 'touch', isPrimary: n === 0, clientX: x, clientY: y,
    button: 0, buttons: type === 'pointerup' ? 0 : 1, bubbles: true, cancelable: true, composed: true })));
  try {
    send('pointerdown', path(0));
    const t0 = performance.now();
    for (;;) {
      await nextFrame();
      const k = Math.min(1, (performance.now() - t0) / (ms * 2));
      send('pointermove', path(k));
      if (k >= 1) break;
    }
    send('pointerup', path(1));
  } finally { el.setPointerCapture = capture; el.releasePointerCapture = release; }
}

// what the last bench started its level from, and the layer census either side
let last_ = null;
export const lastContext = () => last_;

function where(strata) {
  const show = (id) => document.getElementById(id)?.classList.contains('show') ?? false;
  return { level: strata.game?.shape?.id ?? null, lesson: !!strata.game?.entry?.lesson, title: show('title'), map: show('menu') };
}

// Elements on screen whose style tends to make WebKit give them their own native
// layer: will-change, backdrop-filter, a 3D transform, a running animation, or a
// canvas or video. A proxy for the layer tree (JS can't see the real one), grouped
// by the nearest element with an id, so a jump between two censuses says where.
export function layerCensus() {
  const groups = {};
  let total = 0, rendered = 0;
  for (const el of document.querySelectorAll('body *')) {
    if (el.checkVisibility ? !el.checkVisibility({ visibilityProperty: true }) : !el.getClientRects().length) continue;
    rendered++;
    const cs = getComputedStyle(el);
    const prone = cs.willChange !== 'auto' || (cs.backdropFilter && cs.backdropFilter !== 'none') ||
      (cs.webkitBackdropFilter && cs.webkitBackdropFilter !== 'none') || /matrix3d|translateZ|translate3d/.test(cs.transform) ||
      (cs.animationName !== 'none' && cs.animationPlayState !== 'paused') || /^(CANVAS|VIDEO|IFRAME)$/.test(el.tagName);
    if (!prone) continue;
    total++;
    const key = el.id ? '#' + el.id : el.parentElement?.closest('[id]') ? '#' + el.parentElement.closest('[id]').id : el.tagName.toLowerCase();
    groups[key] = (groups[key] ?? 0) + 1;
  }
  const top = Object.entries(groups).sort((a, b) => b[1] - a[1]).slice(0, 10);
  return { layerProne: total, rendered, all: document.querySelectorAll('body *').length, top: Object.fromEntries(top) };
}

// Low Power Mode, inferred: idle p50 near 33 ms (30 fps) instead of ~17 (60 fps).
// Only a suspicion - a display or OS cap could look the same - but a run carrying
// it must not be compared with one that doesn't.
export function powerCheck(r) {
  const idle = r.find((x) => x.segment === 'idle');
  if (!idle) return { lowPowerSuspected: null, note: 'no idle segment to check' };
  const capped = idle.p50 > 25;
  return {
    lowPowerSuspected: capped,
    idleP50: idle.p50,
    note: capped
      ? `idle p50 ${idle.p50} ms: frames capped near 30 fps - Low Power Mode is probably on. Discard this run.`
      : `idle p50 ${idle.p50} ms: not capped at 30 fps (Low Power Mode looks off)`,
  };
}

// Boot milestones a CLI can read (issue #7): one console line each, which
// Capacitor forwards to the device log in Debug builds. Times are ms since the
// page's navigation started (performance.now()). Logged in the store app, and on
// the web only with ?perf, so normal web play stays quiet.
const bootLog = (() => {
  try { return !!window.Capacitor?.isNativePlatform?.() || new URLSearchParams(location.search).has('perf') || !!window.STRATA_AUTOBENCH; } catch { return false; }
})();
const booted = new Set();
export function boot(name) {
  if (!bootLog || booted.has(name)) return;
  booted.add(name);
  console.log(`STRATA_BOOT ${name} ${Math.round(performance.now())}`);
}
