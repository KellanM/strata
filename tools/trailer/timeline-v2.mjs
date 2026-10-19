// Trailer v2: one journey, told by the game itself (docs/trailer-study.md, v2).
// A stone in The Orchard is carved down to a Koala; the map pulls back out of
// it, the gold trail draws on and the mist parts over the next world; the
// trail leads to a shrine, whose gold portal opens on the Moss Tortoise; and
// the page lifts back up into the night sky, to the game's own title.
//
// Same contract as timeline.mjs: `at` actions run in both passes, `vat` only in
// the frame-stepped video pass (fast-forwards hidden under a dip), `aat` only
// in the real-time audio pass. PREROLL runs before t = 0 in both passes.

export const FPS = 30;
export const SIZE = { width: 540, height: 960, scale: 2 };   // → 1080×1920
export const DURATION = 29.7;
export const POSTER = 25.6;     // the Moss Tortoise, named, two gems landed
// the sound arrived ~80 ms before its action and the picture shows an action a frame
// after it (measured from chisel onsets in audio-final-v2.wav vs their frames), so
// v2 advances the sound by less than v1's 0.16 s
export const AUDIO_LEAD = 0.065;

const SOLVED_STATS = { time: 80, mistakes: 0, stars: 3, score: 1500 };
// chapter order (shapes.js CHAPTERS): the save has walked through The Orchard,
// all but its Koala; Autumn Woods' first stones are open but its mist has never
// lifted (strata.map.parted), so the map's ceremony runs when it next opens
export const PARTED = ['First Light', 'Beacon Hills', 'Moss Garden', 'The Orchard'];
const S = await import('../../public/js/shapes.js');
export const COUNTS = {
  stones: S.SHAPES.length,
  chapters: S.CHAPTERS.length,
  shrines: S.BONUS.filter((b) => !S.RETIRED.has(b.id)).length,
};
export function storage() {
  const solved = {};
  for (const s of S.SHAPES) if (PARTED.includes(s.chapter) && s.id !== 'koala') solved[s.id] = SOLVED_STATS;
  // the shrine of Moss Garden is open (its chapter is all three-star), not yet solved
  // the companion last stood at the Orchard's last stone, so its walk on to
  // Autumn Woods is one stone long (map.js placeCompanion: 0.9 s) and the mist
  // parts about 1.7 s after the map opens
  const before = S.SHAPES.filter((s) => s.chapter === 'The Orchard').at(-1);
  return {
    'strata.tutorial': '1',
    'strata.install.later': String(Date.now()),
    'strata.ads.off': '1',              // no interstitials, no simulated ads
    'strata.solved': JSON.stringify(solved),
    'strata.chapters': JSON.stringify(S.CHAPTERS.map((c) => c.name)),   // no first-visit chapter cards
    'strata.map.objects': JSON.stringify(Object.keys(solved)),
    'strata.map.chapters': JSON.stringify(PARTED.slice(0, -1)),
    'strata.map.parted': JSON.stringify(PARTED),
    'strata.map.lit': JSON.stringify(['learn', ...Object.keys(solved)]),
    'strata.map.companion': before.id,
  };
}

// before t = 0: step off the title onto the map ([helper, args, seconds after])
export const PREROLL = [
  ['enterMap', [], 2.4],
];

export function buildTimeline() {
  const T = [];
  const at = (t, act, ...args) => T.push({ t, act, args });
  const vat = (t, act, ...args) => T.push({ t, act, args, video: true });
  const aat = (t, act, ...args) => T.push({ t, act, args, audio: true });

  // 0.0 - HOOK: the Orchard stone, already glowing; cubes crumble from the first second
  at(0.0, 'level', 'koala', 1.06);
  at(0.0, 'sfx', true);
  vat(0.0, 'ff', 0.9);                 // the rise-in wave settles before the first frame
  at(0.25, 'chisel');
  at(0.6, 'chisel');
  at(0.5, 'caption', 'something sleeps in the stone', 'ink');
  // a double-tap on a 0: the whole row goes, gathering pace
  at(1.15, 'rowTap');
  at(1.33, 'rowTap2');
  at(2.35, 'rowTap');
  at(2.53, 'rowTap2');
  at(3.2, 'caption', null);

  // 3.3 - RHYTHM: a quick run of single taps, the notes climbing
  at(3.25, 'caption', 'every tap is a note', 'ink');
  for (let k = 0; k < 9; k++) at(3.35 + k * 0.17, 'chisel');
  at(5.0, 'caption', null);

  // 5.0 - REVEAL: the last cubes, then the finale (flash, whirl, title, gems)
  at(4.9, 'dip', '#f3e8d0', 0.12);
  at(5.02, 'sfx', false);
  at(5.02, 'prechisel', 5);
  vat(5.02, 'ff', 0.3);
  at(5.05, 'sfx', true);
  at(5.07, 'undip', 0.2);
  for (let k = 0; k < 5; k++) at(5.3 + k * 0.15, 'chisel');   // the last one wins (~5.9)

  // 10.6 - THE MAP: it pulls back out of the stone (after the first gem lands);
  // the companion steps on, the gold trail draws, and the mist over the next
  // world parts (~12.3 to 14.7)
  at(10.6, 'map');
  at(11.4, 'caption', 'fifteen worlds above the clouds', 'ink mid');   // in the cloud band, clear of the stones
  at(14.6, 'caption', null);

  // 14.9 - THE SHRINE: along the trail, a gilded stone; its portal opens in gold
  at(14.8, 'dip', '#fbf3df', 0.15);
  at(14.95, 'focusNode', 'bonus-moss-garden');
  at(15.0, 'undip', 0.25);
  at(15.5, 'tapNode', 'bonus-moss-garden');
  // the card holds ("✦ The Shrine of ✦ Moss Garden"), its bells ring, the block assembles
  const SHRINE_SKY = 'radial-gradient(ellipse at 50% 42%, #f1f3d8, #cddcc8 55%, #afc5b2)';
  at(19.2, 'dip', SHRINE_SKY, 0.15);
  at(19.35, 'sfx', false);
  at(19.35, 'prechisel', 4);
  vat(19.35, 'ff', 0.3);
  at(19.4, 'sfx', true);
  at(19.42, 'undip', 0.2);
  for (let k = 0; k < 4; k++) at(19.65 + k * 0.16, 'chisel');   // solved ~20.1; three gems by ~25.7

  // 25.8 - HOME: at the top of the map a finger pulls down, and the night sky
  // and the title come down over it (main.js beginAscent, the touch path)
  at(25.75, 'dip', '#f6dccf', 0.15);
  at(25.9, 'mapTop');
  at(25.95, 'undip', 0.15);
  at(26.15, 'pullStart');
  for (let f = 1; f <= 12; f++) at(26.15 + f / 30, 'pullMove', Math.round(420 * (1 - Math.pow(1 - f / 12, 2))));
  at(26.6, 'pullEnd');
  at(27.3, 'endLines');
  aat(27.3, 'finalChord');
  return T.sort((a, b) => a.t - b.t);
}

// Page-side helpers, injected into both passes as a string.
export const PAGE_HELPERS = String.raw`
(() => {
  const $ = (s) => document.querySelector(s);
  const H = (window.__trailer = {});
  let audio = null;
  H.audioModule = (m) => { audio = m; };

  const style = document.createElement('style');
  style.textContent = [
    '.hud, #install, #actions, #coach, #press-ring, #map-close, #map-help, #map-journal, #lantern { display: none !important; }',
    '#tr-dip { position: fixed; inset: 0; z-index: 50; opacity: 0; pointer-events: none; transition: opacity .15s linear; }',
    '#tr-cap { position: fixed; left: 0; right: 0; top: 71%; z-index: 40; text-align: center; pointer-events: none;',
    'font: 500 17px/1.45 "Avenir Next", Avenir, Futura, "Century Gothic", "Segoe UI", sans-serif;',
    'letter-spacing: .34em; text-transform: uppercase; padding: 0 24px;',
    'opacity: 0; transform: translateY(8px); transition: opacity .5s ease, transform .7s cubic-bezier(.2,.8,.2,1); }',
    '#tr-cap.on { opacity: 1; transform: none; }',
    '#tr-cap.ink { color: #4a3d63; text-shadow: 0 0 18px rgba(255,250,240,.9); }',
    '#tr-cap.light { color: #fbf6ff; text-shadow: 0 0 16px rgba(20,16,40,.6), 0 0 3px rgba(20,16,40,.35); }',
    '#tr-cap.high { top: 64.5%; }',
    '#tr-cap.mid { top: 51.5%; }',
    // the end: the game's own title, its "swipe up" swapped for where to find it
    'body.tr-end #title .tap { display: none !important; }',
    // its tagline is drawn in the day palette's ink, nearly invisible on the night sky: lifted to the title's own colour
    'body.tr-end #title .sub { color: rgba(238,240,255,.82); }',
    '#tr-endlines { position: fixed; left: 0; right: 0; top: 70%; z-index: 40; text-align: center; pointer-events: none;',
    'font-family: "Avenir Next", Avenir, Futura, "Century Gothic", "Segoe UI", sans-serif; color: #f4efff;',
    'opacity: 0; transform: translateY(8px); transition: opacity .8s ease, transform 1s cubic-bezier(.2,.8,.2,1); }',
    '#tr-endlines.on { opacity: 1; transform: none; }',
    '#tr-endlines .gem { width: 12px; height: 16px; display: block; margin: 0 auto 16px; }',
    '#tr-endlines .cta { font-size: 11px; letter-spacing: .3em; text-transform: uppercase; opacity: .85; }',
    '#tr-endlines .url { margin-top: 9px; font-size: 13px; letter-spacing: .16em; opacity: .95; }',
  ].join(' ');
  document.head.appendChild(style);
  const dip = document.createElement('div'); dip.id = 'tr-dip'; document.body.appendChild(dip);
  const cap = document.createElement('div'); cap.id = 'tr-cap'; document.body.appendChild(cap);
  const endl = document.createElement('div'); endl.id = 'tr-endlines';
  endl.innerHTML = '<svg class="gem" viewBox="0 0 12 16"><path d="M6 0 0 8l6 8z" fill="#fff2c2"/><path d="M6 0l6 8-6 8z" fill="#e9b949"/></svg>'
    + '<div class="cta">STONES_TO_UNCOVER stones · free · plays in your browser</div><div class="url">kellanm.github.io/strata</div>';
  document.body.appendChild(endl);

  H.caption = (text, tone) => {
    if (!text) { cap.classList.remove('on'); return; }
    cap.textContent = text; cap.className = tone; void cap.offsetWidth; cap.classList.add('on');
  };
  H.dip = (color, secs) => { dip.style.transition = 'opacity ' + secs + 's linear'; dip.style.background = color; dip.style.opacity = '1'; };
  H.undip = (secs) => { dip.style.transition = 'opacity ' + secs + 's ease-out'; dip.style.opacity = '0'; };

  H.enterMap = () => { window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' })); };

  H.level = (id, zoom = 1) => {
    $('#menu').classList.remove('show');
    const entries = strata.journalEntries();
    const k = entries.findIndex((e) => e.shape.id === id);
    strata.startPuzzle({ ...entries[k], number: k + 1 });
    const cam = strata.camera; cam.zoom = zoom; cam.updateProjectionMatrix();
  };
  // the next cube to chisel: the most visible one that has to go (top, then toward the camera)
  const visibleOrder = () => {
    const g = strata.game, p = g.puzzle, out = [];
    for (let i = 0; i < p.size; i++) if (!p.solid[i] && !g.broken[i]) {
      const [x, y, z] = p.coords(i);
      out.push([i, y * 4 + x + z]);
    }
    return out.sort((a, b) => b[1] - a[1]).map((o) => o[0]);
  };
  H.chisel = () => { const i = visibleOrder()[0]; if (i !== undefined) strata.act(i, 'break'); };
  H.prechisel = (n) => {
    const order = visibleOrder();
    const keep = n < 1 ? Math.round(order.length * n) : n;
    for (const i of order.slice(0, Math.max(0, order.length - keep))) strata.act(i, 'break');
  };

  // A real double-tap: pointer events on the canvas at a cube face whose line
  // shows a 0, so the game's own rowClearTap runs the cascade. The target: the
  // longest clear-able line whose face is in view and not hidden behind cubes.
  let rowAt = null;
  const findRow = () => {
    const g = strata.game, p = g.puzzle, cam = strata.camera, V = cam.position.constructor;
    const dims = p.dims;
    const toCam = cam.position.clone().normalize();
    const idx = (x, y, z) => { for (let i = 0; i < p.size; i++) { const c = p.coords(i); if (c[0] === x && c[1] === y && c[2] === z) return i; } return -1; };
    const W = innerWidth, Hh = innerHeight;
    let best = null;
    for (let i = 0; i < p.size; i++) {
      if (g.broken[i] || g.painted[i]) continue;
      const c = p.coords(i);
      for (let a = 0; a < 3; a++) {
        const side = toCam.getComponent(a) >= 0 ? 1 : -1;
        if (Math.abs(toCam.getComponent(a)) < 0.25) continue;
        const line = p.lineOf(i, a);
        if (line.hidden || line.count !== 0) continue;
        // outermost standing cube of the line on the camera's side
        const out = line.cells.filter((j) => !g.broken[j] && (p.coords(j)[a] - c[a]) * side > 0);
        if (out.length) continue;
        const n = line.cells.filter((j) => !g.broken[j] && !g.painted[j]).length;
        if (n < 3) continue;
        // the face centre, in the block's frame (centred on the origin)
        const w = new V(c[0] - (dims[0] - 1) / 2, c[1] - (dims[1] - 1) / 2, c[2] - (dims[2] - 1) / 2);
        const f = w.clone(); f.setComponent(a, f.getComponent(a) + 0.5 * side);
        // occluded? march toward the camera through the grid
        let hidden = false;
        for (let s = 0.08; s < 30 && !hidden; s += 0.08) {
          const q = f.clone().addScaledVector(toCam, s);
          const gx = Math.round(q.x + (dims[0] - 1) / 2), gy = Math.round(q.y + (dims[1] - 1) / 2), gz = Math.round(q.z + (dims[2] - 1) / 2);
          if (Math.abs(q.x + (dims[0] - 1) / 2 - gx) < 0.48 && Math.abs(q.y + (dims[1] - 1) / 2 - gy) < 0.48 && Math.abs(q.z + (dims[2] - 1) / 2 - gz) < 0.48) {
            if (!(gx === c[0] && gy === c[1] && gz === c[2])) {
              const j = idx(gx, gy, gz);
              if (j >= 0 && !g.broken[j]) hidden = true;
            }
          }
        }
        if (hidden) continue;
        const pr = f.clone().project(cam);
        const sx = (pr.x + 1) / 2 * W, sy = (1 - pr.y) / 2 * Hh;
        if (sx < 40 || sx > W - 40 || sy < Hh * 0.2 || sy > Hh * 0.8) continue;
        const score = n * 10 - Math.hypot(sx - W / 2, sy - Hh * 0.45) / 20;
        if (!best || score > best.score) best = { score, x: sx, y: sy, i, a, n };
      }
    }
    return best;
  };
  const tapAt = (x, y) => {
    const c = $('#scene');
    const o = { clientX: x, clientY: y, pointerId: 1, pointerType: 'mouse', isPrimary: true, button: 0, buttons: 1, bubbles: true, cancelable: true };
    c.dispatchEvent(new PointerEvent('pointerdown', o));
    c.dispatchEvent(new PointerEvent('pointerup', { ...o, buttons: 0 }));
  };
  H.rowTap = () => { rowAt = findRow(); window.__rows = (window.__rows || []).concat([rowAt && { n: rowAt.n, a: rowAt.a }]); if (rowAt) tapAt(rowAt.x, rowAt.y); };
  H.rowTap2 = () => { if (rowAt) tapAt(rowAt.x, rowAt.y); rowAt = null; };

  H.map = () => { $('#menu-btn').click(); };
  H.focusNode = (id) => {
    const el = document.querySelector('.map-node[data-id="' + id + '"]');
    const s = $('#menu .map-scroll');
    if (!el || !s) return;
    const r = el.getBoundingClientRect();
    s.scrollTop += r.top + r.height / 2 - innerHeight * 0.5;
  };
  H.tapNode = (id) => { const el = document.querySelector('.map-node[data-id="' + id + '"]'); if (el) el.click(); };
  H.mapTop = () => { $('#menu-btn').click(); $('#menu').classList.remove('arriving', 'settling'); const s = $('#menu .map-scroll'); if (s) s.scrollTop = 0; };
  // a finger on the map sheet, pulling down from its top
  const sheet = () => $('#menu .map-scroll');
  const touch = (type, y) => {
    const t = new Touch({ identifier: 7, target: sheet(), clientX: innerWidth / 2, clientY: y });
    sheet().dispatchEvent(new TouchEvent(type, { touches: type === 'touchend' ? [] : [t], changedTouches: [t], bubbles: true, cancelable: true }));
  };
  H.pullStart = () => {
    $('#menu').classList.remove('arriving', 'settling');   // mapTop's pull-back, cut short under the dip
    sheet().scrollTop = 0;
    document.body.classList.add('tr-end');
    touch('touchstart', 260);
  };
  H.pullMove = (dy) => touch('touchmove', 260 + dy);
  H.pullEnd = () => touch('touchend', 260 + 420);
  H.endLines = () => endl.classList.add('on');
  H.sfx = (on) => { if (audio) audio.sound.setSfx(on); };
  H.finalChord = () => {
    if (!audio || !audio.sound.ctx) return;
    const s = audio.sound;
    [0, 7, 12, 16, 19].forEach((d, k) => s.fmBell(s.key.root + 24 + d, { dest: s.music, at: s.now + k * 0.09, gain: 0.4, decay: 3.2, index: 1.6 }));
  };
  H.ff = () => {};
})();
`.replace('STONES_TO_UNCOVER', String(COUNTS.stones));
