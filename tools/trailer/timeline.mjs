// The trailer's script: one timeline both capture passes play. The video pass
// steps a virtual clock frame by frame; the audio pass plays the same actions
// in real time while recording the game's own sound. Actions are names of
// page helpers (PAGE_HELPERS) with arguments; `video: true` actions only run
// in the video pass (fast-forwards hidden under a dip to colour), `audio: true`
// only in the audio pass.

export const FPS = 30;
export const SIZE = { width: 540, height: 960, scale: 2 };   // → 1080×1920

// levels already solved before the trailer starts, so the map shows objects
export const SOLVED = ['steps', 'heart', 'candle', 'toaster', 'key', 'bed', 'chair', 'record-player', 'alarm-clock',
  'snail-cottage', 'snail', 'hatching-chick', 'moth', 'cat', 'beehive', 'apple', 'cactus', 'tulip', 'mushroom', 'bonsai',
  'flip-flops', 'fish', 'starfish', 'penguin', 'jellyfish', 'boat', 'crab'];

export function buildTimeline() {
  const T = [];
  const at = (t, act, ...args) => T.push({ t, act, args });
  const vat = (t, act, ...args) => T.push({ t, act, args, video: true });
  const aat = (t, act, ...args) => T.push({ t, act, args, audio: true });

  // 0.0 — HOOK: the Mushroom block already glowing, one cube crumbles, then two more
  at(0.0, 'level', 'mushroom', 1.12);
  at(0.0, 'sfx', true);
  vat(0.0, 'ff', 0.9);                 // let the rise-in wave settle before the first frame
  at(0.35, 'chisel');
  at(0.95, 'chisel');
  at(1.25, 'chisel');
  at(0.5, 'caption', 'something is hidden in the stone', 'ink');
  at(2.7, 'caption', null);

  // 3.0 — RHYTHM: a fast run on Bonsai; the notes climb and turn heavenly
  at(2.85, 'dip', '#f1e6c9', 0.15);
  at(3.0, 'level', 'bonsai', 1.08);
  vat(3.0, 'ff', 0.9);
  at(3.12, 'undip', 0.25);
  for (let k = 0; k < 16; k++) at(3.35 + k * 0.17, 'chisel');
  at(3.6, 'caption', 'every tap is a note', 'ink');
  at(6.3, 'caption', null);

  // 6.7 — PEEL: the Lighthouse, layers slide away to show what's inside
  at(6.55, 'dip', '#cdeae4', 0.15);
  at(6.7, 'level', 'lighthouse', 1.0);
  at(6.7, 'sfx', false);
  at(6.7, 'prechisel', 0.55);          // a block part-way through, so the inside shows
  vat(6.7, 'ff', 1.2);
  at(6.7, 'sfx', true);
  at(6.82, 'undip', 0.25);
  at(7.2, 'peel', 0, 1);
  at(7.75, 'peel', 0, 2);
  at(8.3, 'peel', 0, 3);
  at(9.2, 'peel', 0, 0);
  at(7.4, 'caption', 'peel back the layers', 'ink');
  at(9.9, 'caption', null);

  // 10.2 — REVEAL: the last few cubes of the Wishing Well, then the whole finale
  at(10.05, 'dip', '#161b36', 0.15);
  at(10.2, 'level', 'wishing-well', 1.0);
  at(10.2, 'sfx', false);
  at(10.2, 'prechisel', 6);            // leave six cubes to go
  vat(10.2, 'ff', 1.0);
  at(10.32, 'undip', 0.25);
  at(10.25, 'sfx', true);
  for (let k = 0; k < 6; k++) at(10.6 + k * 0.16, 'chisel');   // the last one wins
  // finale plays itself: flash, whirl, colour sweep, title, gems (~6 s)

  // 18.2 — MONTAGE: more uncovered worlds, one beat each
  const montage = [['koinobori', '#2a1838'], ['pelican', '#cdeae4'], ['sunflower', '#fbe3b6'], ['fox', '#eaf2df']];
  montage.forEach(([id, sky], k) => {
    const t0 = 18.3 + k * 1.1;
    at(t0 - 0.12, 'dip', sky, 0.12);
    at(t0, 'sfx', false);
    at(t0, 'level', id, 1.0);
    at(t0, 'solve');
    vat(t0, 'ff', 4.6);
    at(t0 + 0.06, 'undip', 0.14);
    aat(t0 + 0.08, 'chime', k);
  });
  at(19.55, 'caption', 'seven quiet worlds to uncover', 'ink high');
  at(22.4, 'caption', null);

  // 22.7 — THE MAP: the trail of everything found, the companion waiting
  at(22.6, 'dip', '#f7dccb', 0.12);
  at(22.7, 'sfx', true);
  at(22.7, 'map');
  vat(22.7, 'ff', 0.8);
  at(22.8, 'undip', 0.2);
  for (let k = 0; k <= 60; k++) at(22.8 + k / 30, 'mapScroll', k / 60);

  // 24.9 — END CARD
  at(24.85, 'endcard', true);
  aat(25.0, 'finalChord');
  return T.sort((a, b) => a.t - b.t);
}
export const DURATION = 28.5;

// Page-side helpers, injected into both passes as a string.
export const PAGE_HELPERS = String.raw`
(() => {
  const $ = (s) => document.querySelector(s);
  const H = (window.__trailer = {});
  let audio = null;
  H.audioModule = (m) => { audio = m; };

  // overlays: captions, colour dips, end card
  const style = document.createElement('style');
  style.textContent = [
    '.hud, #install, #actions, #coach, #press-ring, #map-close, #map-help, #map-journal { display: none !important; }',
    '#tr-dip { position: fixed; inset: 0; z-index: 50; opacity: 0; pointer-events: none; transition: opacity .15s linear; }',
    '#tr-cap { position: fixed; left: 0; right: 0; top: 71%; z-index: 40; text-align: center; pointer-events: none;',
    'font: 500 17px/1.45 "Avenir Next", Avenir, Futura, "Century Gothic", "Segoe UI", sans-serif;',
    'letter-spacing: .34em; text-transform: uppercase; padding: 0 24px;',
    'opacity: 0; transform: translateY(8px); transition: opacity .5s ease, transform .7s cubic-bezier(.2,.8,.2,1); }',
    '#tr-cap.on { opacity: 1; transform: none; }',
    '#tr-cap.ink { color: #4a3d63; text-shadow: 0 0 18px rgba(255,250,240,.9); }',
    '#tr-cap.light { color: #fbf6ff; text-shadow: 0 0 16px rgba(20,16,40,.55); }',
    '#tr-cap.high { top: 64.5%; }',
    '#tr-end { position: fixed; inset: 0; z-index: 45; pointer-events: none; opacity: 0; transition: opacity .9s ease;',
    'display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; text-align: center;',
    'background: radial-gradient(ellipse at 50% 46%, rgba(255,246,236,.9), rgba(247,220,203,.97) 58%, #e9c9cf 100%);',
    'color: #4a3d63; font-family: "Avenir Next", Avenir, Futura, "Century Gothic", "Segoe UI", sans-serif; }',
    '#tr-end.on { opacity: 1; }',
    '#tr-end h1 { margin: 0; font-weight: 500; font-size: 46px; letter-spacing: .5em; padding-left: .5em; }',
    '#tr-end .line { font-size: 13px; letter-spacing: .34em; text-transform: uppercase; opacity: .85; }',
    '#tr-end .gem { width: 14px; height: 19px; margin: 6px 0 2px; }',
    '#tr-end .cta { margin-top: 26px; font-size: 11px; letter-spacing: .3em; text-transform: uppercase; opacity: .8; }',
    '#tr-end .url { font-size: 13px; letter-spacing: .16em; opacity: .9; }',
  ].join(' ');
  document.head.appendChild(style);
  const dip = document.createElement('div'); dip.id = 'tr-dip'; document.body.appendChild(dip);
  const cap = document.createElement('div'); cap.id = 'tr-cap'; document.body.appendChild(cap);
  const end = document.createElement('div'); end.id = 'tr-end';
  end.innerHTML = '<h1>STRATA</h1><div class="line">peel the stone · find the shape</div>'
    + '<svg class="gem" viewBox="0 0 12 16"><path d="M6 0 0 8l6 8z" fill="#fff2c2"/><path d="M6 0l6 8-6 8z" fill="#e9b949"/></svg>'
    + '<div class="cta">free · plays in your browser</div><div class="url">kellanm.github.io/strata</div>';
  document.body.appendChild(end);

  H.caption = (text, tone) => {
    if (!text) { cap.classList.remove('on'); return; }
    cap.textContent = text; cap.className = tone; void cap.offsetWidth; cap.classList.add('on');
  };
  H.dip = (color, secs) => { dip.style.transition = 'opacity ' + secs + 's linear'; dip.style.background = color; dip.style.opacity = '1'; };
  H.undip = (secs) => { dip.style.transition = 'opacity ' + secs + 's ease-out'; dip.style.opacity = '0'; };
  H.endcard = () => end.classList.add('on');

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
  // leave only n cubes to go (n < 1: keep that fraction of the cubes to go)
  H.prechisel = (n) => {
    const order = visibleOrder();
    const keep = n < 1 ? Math.round(order.length * n) : n;
    for (const i of order.slice(0, Math.max(0, order.length - keep))) strata.act(i, 'break');
  };
  H.solve = () => { for (const i of visibleOrder()) strata.act(i, 'break'); };
  H.peel = (axis, n) => { if (strata.peel.axis !== axis) strata.setPeelAxis(axis, 1); strata.setPeeled(n); };
  H.map = () => { $('#menu-btn').click(); };
  H.mapScroll = (f) => { const s = $('.map-scroll'); if (s) s.scrollTop = f * Math.min(1400, s.scrollHeight - s.clientHeight); };
  H.sfx = (on) => { if (audio) audio.sound.setSfx(on); };
  H.chime = (k) => {
    if (!audio || !audio.sound.ctx) return;
    const s = audio.sound;
    s.fmBell(s.key.root + 36 + [0, 4, 7, 12][k % 4], { dest: s.music, gain: 0.5, decay: 1.6 });
  };
  H.finalChord = () => {
    if (!audio || !audio.sound.ctx) return;
    const s = audio.sound;
    [0, 7, 12, 16, 19].forEach((d, k) => s.fmBell(s.key.root + 24 + d, { dest: s.music, at: s.now + k * 0.09, gain: 0.45, decay: 3.2, index: 1.6 }));
  };
  H.ff = () => {};
})();
`;
