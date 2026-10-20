// Page-side helpers for the v2 ad/trailer, injected as a string into the
// capture page. Everything the trailer adds on top of the game lives here:
// kinetic type, whip-blur cuts, flashes, a finger and tap rings, the content
// grid, and the end card. Trailer CSS animations are all named `tr-…`; the
// capture clock seeks those on SCREEN time (so speed ramps and hidden
// fast-forwards of the game never disturb the edit).
const FONT = '"Avenir Next", Avenir, Futura, "Century Gothic", "Segoe UI", sans-serif';

// The end card's words, in one place. Open questions (see docs/ad-hooks-study.md):
// the store badges and PLAY NOW point at listings that don't exist yet; the
// study suggests cta 'PLAY FREE IN YOUR BROWSER' and badges: false until they do.
// line: an optional line above the CTA (an ad may set its own); sub: below the badges.
export const END_CARD = { title: 'STRATA', cta: 'PLAY NOW', badges: true, line: null, sub: null };

const CSS = String.raw`
    .hud, #install, #actions, #coach, #press-ring, #map-close, #map-help, #map-journal, #chapter-card, #veil { display: none !important; }
    body.tr-ending #win-title, body.tr-notitle #win-title { opacity: 0 !important; }
    #menu .map-head { visibility: hidden; }
    [data-tr] { pointer-events: none; }
    #tr-flash { position: fixed; inset: 0; z-index: 60; background: #fffaf0; opacity: 0; }
    #tr-flash.go { animation: tr-flash .32s ease-out both; }
    @keyframes tr-flash { 0% { opacity: 0 } 45% { opacity: .7 } 100% { opacity: 0 } }
    .tr-whip { animation: tr-whip .3s cubic-bezier(.5,0,.5,1) both; }
    .tr-whip-r { animation: tr-whip-r .3s cubic-bezier(.5,0,.5,1) both; }
    .tr-whip.tr-quick, .tr-whip-r.tr-quick { animation-duration: .18s; }
    @keyframes tr-whip { 0% { filter: none; transform: none } 48%, 52% { filter: blur(26px) brightness(1.2) saturate(1.2); transform: scale(1.13) translateX(-6%) }
      52% { transform: scale(1.13) translateX(6%) } 100% { filter: none; transform: none } }
    @keyframes tr-whip-r { 0% { filter: none; transform: none } 48% { filter: blur(26px) brightness(1.2) saturate(1.2); transform: scale(1.13) translateX(6%) }
      52% { filter: blur(26px) brightness(1.2) saturate(1.2); transform: scale(1.13) translateX(-6%) } 100% { filter: none; transform: none } }

    .tr-text { position: fixed; left: 0; right: 0; z-index: 55; display: flex; flex-direction: column; align-items: center; gap: 2px;
      font-family: ${FONT}; font-weight: 600; text-transform: uppercase; text-align: center; }
    .tr-text .ln { white-space: nowrap; letter-spacing: .14em; padding-left: .14em; }
    .tr-text .ch { display: inline-block; opacity: 0; animation: tr-kin-in .52s cubic-bezier(.16,1,.3,1) both; animation-delay: calc(var(--i) * 26ms); }
    .tr-text.out .ch { animation: tr-kin-out .26s cubic-bezier(.7,0,.84,0) both; animation-delay: calc(var(--i) * 8ms); }
    @keyframes tr-kin-in { 0% { opacity: 0; filter: blur(14px); transform: translateY(26px) scale(1.5) } 60% { opacity: 1 } 100% { opacity: 1; filter: blur(0); transform: none } }
    @keyframes tr-kin-out { 0% { opacity: 1; filter: blur(0); transform: none } 100% { opacity: 0; filter: blur(12px); transform: translateY(-14px) scale(.9) } }
    .tr-text.light { color: #fffaf3; text-shadow: 0 2px 22px rgba(30,16,50,.55), 0 0 2px rgba(30,16,50,.4); }
    .tr-text.ink { color: #3d2a55; text-shadow: 0 0 22px rgba(255,250,240,.95), 0 0 3px rgba(255,250,240,.9); }
    .tr-text.gold { color: #ffe39a; text-shadow: 0 0 28px rgba(255,190,90,.75), 0 2px 10px rgba(60,20,40,.6); }
    .tr-text.slam .ch { animation-name: tr-slam; animation-duration: .42s; animation-delay: 0s; }
    @keyframes tr-slam { 0% { opacity: 0; filter: blur(10px); transform: scale(2.4) } 55% { opacity: 1; filter: blur(0); transform: scale(.94) } 100% { opacity: 1; transform: none } }

    .tr-count { font-size: 150px; line-height: 1; font-weight: 700; letter-spacing: .02em; padding-left: 0;
      background: linear-gradient(180deg, #fff6d6, #ffc95a 60%, #e9963c); -webkit-background-clip: text; background-clip: text; color: transparent;
      filter: drop-shadow(0 0 26px rgba(255,190,90,.7)) drop-shadow(0 4px 10px rgba(50,15,40,.6));
      counter-reset: n var(--n); animation: tr-count 1.15s cubic-bezier(.2,.7,.2,1) both, tr-pop .5s cubic-bezier(.16,1,.3,1) both; }
    .tr-count::after { content: counter(n) '+'; }
    @property --n { syntax: '<integer>'; inherits: false; initial-value: 0; }
    @keyframes tr-count { from { --n: 0 } to { --n: 100 } }
    @keyframes tr-pop { 0% { opacity: 0; transform: scale(1.8); filter: blur(12px) } 100% { opacity: 1; transform: none; filter: blur(0) } }

    .tr-tap { position: fixed; z-index: 58; width: 84px; height: 84px; margin: -42px 0 0 -42px; border-radius: 50%;
      border: 5px solid rgba(255,255,255,.98); box-shadow: 0 0 22px rgba(255,255,255,.9), inset 0 0 14px rgba(255,255,255,.6);
      background: radial-gradient(circle, rgba(255,255,255,.75) 0 22%, rgba(255,255,255,0) 24%); animation: tr-tap .5s ease-out both; }
    body.tr-narrow .tr-tap { width: 50px; height: 50px; margin: -25px 0 0 -25px; border-width: 3px; }
    @keyframes tr-tap { 0% { transform: scale(.3); opacity: 1 } 70% { opacity: .8 } 100% { transform: scale(1.45); opacity: 0 } }
    #tr-finger { position: fixed; z-index: 59; width: 46px; height: 46px; margin: -23px 0 0 -23px; border-radius: 50%;
      background: radial-gradient(circle, rgba(255,255,255,.95) 0 38%, rgba(255,255,255,.35) 40% 62%, rgba(255,255,255,0) 64%);
      box-shadow: 0 6px 18px rgba(30,16,50,.35); opacity: 0; transition: opacity .12s; }
    #tr-finger.on { opacity: 1; }

    #tr-grid { position: fixed; inset: 0; z-index: 30; opacity: 0; overflow: hidden;
      background: radial-gradient(ellipse at 50% 45%, #6b2346 0%, #2a1838 60%, #140d24 100%); }
    #tr-grid.on { opacity: 1; }
    #tr-grid .wall { position: absolute; left: 50%; top: 50%; width: 640px; display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px;
      transform: translate(-50%, -50%); }
    #tr-grid.on .wall { animation: tr-drift 3.4s linear both; }
    @keyframes tr-drift { from { transform: translate(-50%, -50%) scale(1.22) rotate(-4deg) } to { transform: translate(-50%, -52%) scale(.98) rotate(-4deg) } }
    #tr-grid .tile { aspect-ratio: 1; border-radius: 16px; background: rgba(255,255,255,.08); display: grid; place-items: center; opacity: 0;
      box-shadow: inset 0 0 0 1px rgba(255,255,255,.08); }
    #tr-grid.on .tile { animation: tr-tile .4s cubic-bezier(.16,1,.3,1) both; animation-delay: calc(var(--i) * 9ms); }
    @keyframes tr-tile { 0% { opacity: 0; transform: scale(.4) } 100% { opacity: 1; transform: none } }
    #tr-grid img { width: 86%; height: 86%; object-fit: contain; filter: drop-shadow(0 6px 8px rgba(0,0,0,.35)); }
    #tr-grid .shade { position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 46%, rgba(20,10,35,.72) 0%, rgba(20,10,35,.25) 46%, rgba(20,10,35,0) 70%); }

    #tr-end { position: fixed; inset: 0; z-index: 50; display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 0; opacity: 0; font-family: ${FONT}; color: #fffaf3; text-align: center;
      background: radial-gradient(ellipse at 50% 42%, rgba(60,24,70,.15), rgba(30,14,46,.55) 60%, rgba(18,10,32,.85) 100%); }
    #tr-end.on { animation: tr-fadein .45s ease-out both; }
    @keyframes tr-fadein { from { opacity: 0 } to { opacity: 1 } }
    #tr-end h1 { margin: 0 0 6px; font-size: 64px; font-weight: 500; letter-spacing: .34em; padding-left: .34em;
      text-shadow: 0 0 34px rgba(255,220,170,.55), 0 3px 14px rgba(20,8,30,.5); }
    #tr-end h1 .ch { display: inline-block; opacity: 0; }
    #tr-end.on h1 .ch { animation: tr-kin-in .7s cubic-bezier(.16,1,.3,1) both; animation-delay: calc(var(--i) * 70ms + .1s); }
    #tr-end .gem { width: 18px; height: 24px; margin: 8px 0 34px; opacity: 0; }
    #tr-end.on .gem { animation: tr-pop .5s cubic-bezier(.16,1,.3,1) .55s both; }
    #tr-end .cta { padding: 20px 54px; border-radius: 999px; font-size: 30px; font-weight: 700; letter-spacing: .26em; padding-left: calc(54px + .26em);
      color: #3a1d3f; background: linear-gradient(180deg, #ffe7a3, #f6b84b); box-shadow: 0 0 0 3px rgba(255,255,255,.35), 0 0 46px rgba(255,190,90,.75), 0 10px 22px rgba(20,8,30,.45);
      opacity: 0; }
    #tr-end.on .cta { animation: tr-pop .5s cubic-bezier(.16,1,.3,1) .7s both, tr-pulse 1.1s ease-in-out 1.25s infinite; }
    @keyframes tr-pulse { 0%, 100% { transform: scale(1) } 50% { transform: scale(1.06) } }
    #tr-end .badges { display: flex; gap: 18px; align-items: center; margin-top: 40px; opacity: 0; }
    #tr-end.on .badges { animation: tr-pop .5s cubic-bezier(.16,1,.3,1) .95s both; }
    #tr-end .badges img.apple { height: 66px; }
    #tr-end .badges img.google { height: 98px; margin: -16px -14px; }
    #tr-end .line { margin: -14px 0 26px; font-size: 26px; font-weight: 600; letter-spacing: .2em; padding-left: .2em; opacity: 0; color: #ffe39a;
      text-shadow: 0 0 18px rgba(255,190,90,.6); }
    #tr-end.on .line { animation: tr-pop .5s cubic-bezier(.16,1,.3,1) .6s both; }
    #tr-end .sub { margin-top: 22px; font-size: 15px; letter-spacing: .24em; opacity: 0; }
    #tr-end.on .sub { animation: tr-pop .5s cubic-bezier(.16,1,.3,1) 1.05s both; }
    .tr-text.now .ch { animation: none !important; opacity: 1; }
    #tr-strikes { position: fixed; top: 4.5%; right: 7%; z-index: 56; font-family: ${FONT}; font-size: 44px; font-weight: 700; letter-spacing: .2em;
      color: #ff5a5f; text-shadow: 0 0 18px rgba(255,90,95,.7), 0 2px 8px rgba(40,10,20,.5); opacity: 0; }
    #tr-strikes.on { opacity: 1; }
    #tr-sound { position: fixed; top: 4%; right: 6%; z-index: 56; width: 46px; height: 46px; border-radius: 50%; display: grid; place-items: center;
      background: rgba(30,16,50,.35); box-shadow: 0 2px 12px rgba(30,16,50,.35); opacity: 0; transition: opacity .3s; }
    #tr-sound.on { opacity: 1; }
    #tr-strikes.pop { animation: tr-slam .42s cubic-bezier(.16,1,.3,1) both; }
    /* overlay captures: only the trailer's own layers, on a transparent page */
    html:has(body.tr-overlay) { background: transparent !important; }
    body.tr-overlay > *:not([data-tr]) { visibility: hidden !important; }
    .tr-endblur { animation: tr-endblur .5s ease-out both; }
    @keyframes tr-endblur { to { filter: blur(9px) brightness(.62) saturate(1.15); transform: scale(1.06) } }
`;

export const PAGE_HELPERS = String.raw`
(() => {
  const $ = (s) => document.querySelector(s);
  const H = (window.__trailer = {});

  const css = document.createElement('style');
  css.textContent = ` + JSON.stringify(CSS) + String.raw`;
  document.head.appendChild(css);

  const make = (id, html = '') => { const el = document.createElement('div'); el.id = id; el.dataset.tr = ''; el.innerHTML = html; document.body.appendChild(el); return el; };
  const flash = make('tr-flash');
  const finger = make('tr-finger');
  const grid = make('tr-grid', '<div class="wall"></div><div class="shade"></div>');
  const GEM = '<svg class="gem" viewBox="0 0 12 16"><path d="M6 0 0 8l6 8z" fill="#fff2c2"/><path d="M6 0l6 8-6 8z" fill="#e9b949"/></svg>';
  // the end card is built from END_CARD (top of page.mjs), so its words and
  // badges are swapped in one place; an ad may add a line above the CTA
  const endHtml = (c) => '<h1>' + [...c.title].map((ch, i) => '<span class="ch" style="--i:' + i + '">' + ch + '</span>').join('') + '</h1>'
    + GEM + (c.line ? '<div class="line">' + c.line + '</div>' : '') + '<div class="cta">' + c.cta + '</div>'
    + (c.badges ? '<div class="badges"><img class="apple" src="/trailer-assets/appstore.svg"><img class="google" src="/trailer-assets/googleplay.png"></div>' : '')
    + (c.sub ? '<div class="sub">' + c.sub + '</div>' : '');
  const END = ` + JSON.stringify(END_CARD) + String.raw`;
  const end = make('tr-end', endHtml(END));

  // what this capture draws: 'full' (everything), 'game' (the game and its taps,
  // no type or end card: a panel of a composite), 'overlay' (only the type and
  // end card, on a transparent page, laid over a composite)
  const MODE = window.__trMode || 'full';
  if (MODE === 'overlay') document.body.classList.add('tr-overlay');
  if (innerWidth < 300) document.body.classList.add('tr-narrow');   // a thin composite panel: smaller tap rings

  const restart = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };
  const sceneEls = () => [$('#scene'), $('#menu'), $('#win-title'), grid].filter(Boolean);

  // ---- cuts
  H.whip = (dir = 1, withFlash = false, dur = 0.3) => {
    const cls = dir > 0 ? 'tr-whip' : 'tr-whip-r';
    for (const el of sceneEls()) {
      el.classList.remove('tr-whip', 'tr-whip-r', 'tr-quick'); void el.offsetWidth;
      el.classList.add(cls); if (dur < 0.25) el.classList.add('tr-quick');
    }
    if (withFlash) restart(flash, 'go');
  };
  H.flash = () => restart(flash, 'go');

  // ---- kinetic type: lines of words, letters animate in; pos is a fraction of the height
  let texts = [];
  // opts: now (already sharp on its first frame), x / w (centre and width as
  // fractions of the frame: a label over one panel of a composite)
  H.text = (lines, pos = 0.2, size = 58, tone = 'light', slam = false, opts = {}) => {
    if (MODE === 'game') return;
    const el = document.createElement('div');
    el.dataset.tr = '';
    el.className = 'tr-text ' + tone + (slam ? ' slam' : '') + (opts.now ? ' now' : '');
    el.style.top = (pos * 100) + '%';
    el.style.fontSize = size + 'px';
    if (opts.x != null) { const w = opts.w ?? 0.34; el.style.left = ((opts.x - w / 2) * 100) + '%'; el.style.right = 'auto'; el.style.width = (w * 100) + '%'; }
    let i = 0;
    el.innerHTML = lines.map((ln) => '<div class="ln">' + [...ln].map((c) => c === ' ' ? '<span class="ch" style="--i:' + (i++) + '">&nbsp;</span>' : '<span class="ch" style="--i:' + (i++) + '">' + c + '</span>').join('') + '</div>').join('');
    document.body.appendChild(el);
    texts.push(el);
  };
  H.textOut = () => { for (const el of texts) el.classList.add('out'); const old = texts; texts = []; setTimeout(() => old.forEach((e) => e.remove()), 400); };
  H.textClear = () => { texts.forEach((e) => e.remove()); texts = []; };
  H.count = (pos = 0.36) => {
    if (MODE === 'game') return;
    const el = document.createElement('div');
    el.dataset.tr = '';
    el.className = 'tr-text';
    el.style.top = (pos * 100) + '%';
    el.innerHTML = '<div class="ln tr-count"></div>';
    document.body.appendChild(el);
    texts.push(el);
  };

  // ---- the game
  const V = () => strata.camera.position.constructor;
  const screenOf = (i) => {
    const g = strata.game, p = g.puzzle, d = p.dims, [x, y, z] = p.coords(i);
    const v = new (V())(x - (d[0] - 1) / 2, y - (d[1] - 1) / 2, z - (d[2] - 1) / 2);
    strata.camera.updateMatrixWorld();
    v.project(strata.camera);
    return [(v.x * 0.5 + 0.5) * innerWidth, (-v.y * 0.5 + 0.5) * innerHeight];
  };
  // sound (audio pass only): the game's own engine, with chosen moments hushed
  let audio = null, hush = false;
  const silent = new WeakSet(), muted = new WeakMap();   // muted: game → sound names it may not make
  const NOISY = ['chisel', 'win', 'star', 'tick', 'tickDone', 'best', 'intro', 'peel', 'mark', 'mistake', 'protectedTap', 'undo', 'ui', 'stone'];
  const orig = {};
  H.audioModule = (s) => {
    audio = s;
    for (const n of NOISY) {
      orig[n] = s[n].bind(s);
      s[n] = (...a) => (hush || silent.has(strata.game) || muted.get(strata.game)?.includes(n)) ? undefined : orig[n](...a);
    }
  };
  H.mute = (names = []) => { if (strata.game) muted.set(strata.game, names); };   // change what this level may sound
  H.sound = (n, ...a) => { if (audio && audio.ctx) orig[n](...a); };
  H.chime = (k) => {
    if (!audio || !audio.ctx) return;
    audio.fmBell(audio.key.root + 36 + [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24][k % 11], { dest: audio.music, gain: 0.42, decay: 1.4 });
  };
  H.finalChord = () => {
    if (!audio || !audio.ctx) return;
    [0, 7, 12, 16, 19, 24].forEach((d, k) => audio.fmBell(audio.key.root + 24 + d, { dest: audio.music, at: audio.now + k * 0.07, gain: 0.5, decay: 3.4, index: 1.6 }));
  };

  // opts: intro (let the assembly be heard), silent (the level makes no sound at all),
  // left (cubes left to go), solve (finish it at once)
  H.level = (id, zoom = 1, opts = {}) => {
    $('#menu').classList.remove('show');
    $('#title')?.classList.remove('show');
    strata.camera.clearViewOffset?.();
    document.body.classList.remove('tr-ending');
    const entries = strata.journalEntries();
    const k = entries.findIndex((e) => e.shape.id === id);
    if (k < 0) throw new Error('no level ' + id);
    hush = !opts.intro;
    // (quiet: the game's own "backdrop" start - the block already whole - for shots
    // that open on a block mid-solve; the hidden ff covers it either way)
    strata.startPuzzle({ ...entries[k], number: k + 1 }, { quiet: !opts.intro });
    if (!opts.intro) strata.game.introEnd = 0;
    if (opts.silent) silent.add(strata.game);
    if (opts.mute) muted.set(strata.game, opts.mute);
    const cam = strata.camera; cam.zoom = zoom; cam.updateProjectionMatrix();
    if (opts.left != null) H.prechisel(opts.left, opts.orbitAhead ?? 0);
    hush = false;
    if (opts.solve) H.solve();
    if (!opts.keepText) H.textClear();
  };
  // main.js inPeel(): is the cube in a layer the peel has not folded away?
  const unpeeled = (i) => {
    const pz = strata.game.puzzle, pl = strata.peel, c = pz.coords(i), dim = pz.dims[pl.axis];
    const k = pl.side > 0 ? c[pl.axis] : dim - 1 - c[pl.axis];
    return k < dim - pl.peeled;
  };
  // The game's own pick (main.js pick()): walk the voxel grid along the view ray
  // through a screen point and return the first cube still standing.
  const pickAt = (sx, sy) => {
    const g = strata.game, p = g.puzzle, dims = p.dims, cam = strata.camera;
    const nx = (sx / innerWidth) * 2 - 1, ny = -(sy / innerHeight) * 2 + 1;
    cam.updateMatrixWorld();
    const near = new (V())(nx, ny, -1).unproject(cam), far = new (V())(nx, ny, 1).unproject(cam);
    const dir = far.sub(near).normalize();
    const o = near.toArray().map((v, a) => v + dims[a] / 2), d = dir.toArray();
    let t0 = 0, t1 = Infinity;
    for (let a = 0; a < 3; a++) {
      if (Math.abs(d[a]) < 1e-9) { if (o[a] < 0 || o[a] > dims[a]) return -1; continue; }
      let ta = -o[a] / d[a], tb = (dims[a] - o[a]) / d[a];
      if (ta > tb) [ta, tb] = [tb, ta];
      t0 = Math.max(t0, ta); t1 = Math.min(t1, tb);
    }
    if (t0 > t1) return -1;
    const q = o.map((v, a) => v + d[a] * (t0 + 1e-5));
    const cell = q.map((v, a) => Math.min(dims[a] - 1, Math.max(0, Math.floor(v))));
    const step = d.map((v) => (v > 0 ? 1 : -1));
    const tMax = d.map((v, a) => (Math.abs(v) < 1e-9 ? Infinity : (cell[a] + (v > 0 ? 1 : 0) - q[a]) / v));
    const tDelta = d.map((v) => (Math.abs(v) < 1e-9 ? Infinity : Math.abs(1 / v)));
    for (let guard = 0; guard < 200; guard++) {
      const i = p.idx(cell[0], cell[1], cell[2]);
      if (!g.broken[i] && unpeeled(i)) return i;
      const a = tMax[0] < tMax[1] ? (tMax[0] < tMax[2] ? 0 : 2) : (tMax[1] < tMax[2] ? 1 : 2);
      cell[a] += step[a];
      if (cell[a] < 0 || cell[a] >= dims[a]) return -1;
      tMax[a] += tDelta[a];
    }
    return -1;
  };
  // cubes still to go, the ones the camera can actually see first, each group
  // nearest the camera first. Seen: some point of it is on screen (a tight zoom
  // crops the block) and the game's pick there finds this cube - its centre if
  // that shows, else a point toward one of its corners (a sliver still showing).
  // The tap ring goes on that point.
  const SAMPLES = [[0, 0, 0], ...[-1, 1].flatMap((a) => [-1, 1].flatMap((b) => [-1, 1].map((c) => [a * 0.32, b * 0.32, c * 0.32])))];
  const toGo = () => {
    const g = strata.game, p = g.puzzle, cam = strata.camera, out = [];
    const dir = new (V())(); cam.getWorldDirection(dir);
    cam.updateMatrixWorld();
    for (let i = 0; i < p.size; i++) if (!p.solid[i] && !g.broken[i]) {
      const d = p.dims, [x, y, z] = p.coords(i);
      const wx = x - (d[0] - 1) / 2, wy = y - (d[1] - 1) / 2, wz = z - (d[2] - 1) / 2;
      const depth = dir.x * wx + dir.y * wy + dir.z * wz;
      let hit = null, first = null;
      for (const [ox, oy, oz] of SAMPLES) {
        const v = new (V())(wx + ox, wy + oy, wz + oz).project(cam);
        const sx = (v.x * 0.5 + 0.5) * innerWidth, sy = (-v.y * 0.5 + 0.5) * innerHeight;
        first ??= [sx, sy];
        if (sx > 12 && sx < innerWidth - 12 && sy > 12 && sy < innerHeight - 12 && pickAt(sx, sy) === i) { hit = [sx, sy]; break; }
      }
      const [sx, sy] = hit ?? first;
      out.push({ i, sx, sy, seen: !!hit, depth });
    }
    if (order === 'shape') {
      // outside in: the cubes farthest from the hidden object go first, so its
      // silhouette sharpens tap by tap (a guessing game)
      const solids = [];
      for (let j = 0; j < p.size; j++) if (p.solid[j]) solids.push(p.coords(j));
      for (const c of out) { const [x, y, z] = p.coords(c.i); c.far = Math.min(...solids.map(([a, b, d]) => Math.hypot(a - x, b - y, d - z))); }
      return out.sort((a, b) => (b.seen - a.seen) || (b.far - a.far) || (a.depth - b.depth));
    }
    return out.sort((a, b) => (b.seen - a.seen) || (a.depth - b.depth));
  };
  let order = 'near';
  H.tapOrder = (o) => { order = o; };   // 'near' (nearest the camera first) or 'shape' (outside in)
  H.probe = (i) => { const [sx, sy] = screenOf(i); return { sx, sy, pick: pickAt(sx, sy), broken: strata.game.broken[i], zoom: strata.camera.zoom }; };
  H.visibleLeft = () => toGo().filter((c) => c.seen).length;
  // a tap lands on a cube the camera sees, and that cube breaks on this frame
  // the tap ring (and, if the finger is out, the finger) on a screen point
  const ring = (sx, sy) => {
    if (MODE === 'overlay') return;
    const el = document.createElement('div'); el.className = 'tr-tap'; el.dataset.tr = '';
    el.style.left = sx + 'px'; el.style.top = sy + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 600);
    if (finger.classList.contains('on')) H.finger(sx / innerWidth, sy / innerHeight, true);
  };
  H.tap = () => {
    const all = toGo();
    let c = all[0];
    if (!c) return;
    // no centre in view (cubes can half-hide each other's centres): tap where one
    // of them shows on screen, as a finger would, and break the cube the game's
    // pick finds there - if that is a cube still to go
    if (!c.seen) {
      const g = strata.game, p = g.puzzle;
      for (const d of all) {
        const onScreen = d.sx > 12 && d.sx < innerWidth - 12 && d.sy > 12 && d.sy < innerHeight - 12;
        const j = onScreen ? pickAt(d.sx, d.sy) : -1;
        if (j >= 0 && !p.solid[j] && !g.broken[j]) { c = { ...d, i: j, seen: true }; break; }
      }
    }
    c.left = all.length;
    ring(c.sx, c.sy);
    strata.act(c.i, 'break');
    if (!strata.game.broken[c.i] && !strata.game.solved) console.error('tap did not break cube ' + c.i);
    (H.tapLog ??= []).push({ i: c.i, seen: c.seen, left: c.left });
  };
  // leave n cubes to go (n < 1: that fraction), keeping ones the camera can see so
  // the taps that follow land on them; the hidden ones go first
  // (n = 'seen': keep every cube the camera sees, so the block still looks whole)
  // (alsoAz: a camera turn still to come - only cubes seen from both ends of it count as seen)
  H.prechisel = (n, alsoAz = 0) => {
    const all = toGo();
    if (alsoAz) {
      // sampled along the turn, not just at its end
      const cam = strata.camera, pos = cam.position.clone(), q = cam.quaternion.clone();
      for (const f of [0.25, 0.5, 0.75, 1]) {
        H.orbit(alsoAz * f, 0);
        const later = new Set(toGo().filter((c) => c.seen).map((c) => c.i));
        cam.position.copy(pos); cam.quaternion.copy(q); cam.updateMatrixWorld();
        for (const c of all) c.seen = c.seen && later.has(c.i);
      }
      all.sort((a, b) => (b.seen - a.seen) || (a.depth - b.depth));
    }
    const keep = n === 'seen' ? all.filter((c) => c.seen).length : n < 1 ? Math.round(all.length * n) : n;
    // (outside in: keep the cubes nearest the object, so it is still guessable but not given away)
    const pool = order === 'shape' ? [...all].sort((a, b) => (b.seen - a.seen) || (a.far - b.far)) : all;
    const kept = new Set(pool.slice(0, keep).map((c) => c.i));
    for (const c of all) if (!kept.has(c.i)) strata.act(c.i, 'break');
  };
  H.solve = () => { for (const c of toGo()) strata.act(c.i, 'break'); };
  H.peel = (axis, n) => { if (strata.peel.axis !== axis) strata.setPeelAxis(axis, 1); strata.setPeeled(n); };
  H.finger = (x, y, on = true) => {
    if (MODE === 'overlay') return; finger.style.left = (x * innerWidth) + 'px'; finger.style.top = (y * innerHeight) + 'px'; finger.classList.toggle('on', on); };
  // turn the camera round the object, as a finger would
  H.orbit = (dAz, dEl = 0) => {
    const cam = strata.camera, g = strata.game;
    const t = (g && g.win && g.win.target) ? g.win.target : new (V())(0, 0, 0);
    const off = cam.position.clone().sub(t);
    const r = off.length();
    let th = Math.atan2(off.x, off.z) + dAz;
    let ph = Math.acos(Math.max(-1, Math.min(1, off.y / r))) + dEl;
    ph = Math.max(0.3, Math.min(Math.PI - 0.55, ph));
    off.set(r * Math.sin(ph) * Math.sin(th), r * Math.cos(ph), r * Math.sin(ph) * Math.cos(th));
    cam.position.copy(t).add(off);
    cam.lookAt(t);
  };

  H.titles = (on) => document.body.classList.toggle('tr-notitle', !on);
  H.zoomBy =(f) => { const cam = strata.camera; cam.zoom *= f; cam.updateProjectionMatrix(); };

  // ---- the content wall: every object, popping in
  H.gridBuild = async () => {
    const { renderThumb } = await import('/js/thumbs.js');
    const entries = strata.journalEntries();
    const wall = grid.querySelector('.wall');
    const pick = [];
    for (let k = 0; pick.length < 66; k++) pick.push(entries[(k * 7) % entries.length]);
    wall.innerHTML = pick.map((e, i) => '<div class="tile" style="--i:' + i + '"><img src="' + renderThumb(e.shape, e.palette, { size: 120 }) + '"></div>').join('');
  };
  H.grid = (on) => { if (on) restart(grid, 'on'); else grid.classList.remove('on'); };

  // ---- map
  H.map = () => { H.textClear(); $('#menu-btn').click(); };
  H.mapScroll = (f) => { const s = $('.map-scroll'); if (s) s.scrollTop = f * (s.scrollHeight - s.clientHeight); };
  H.mapBlur = (px) => { const s = $('.map-scroll'); if (s) s.style.filter = px ? 'blur(' + px + 'px)' : ''; };

  // ---- end card
  H.endcard = (over = {}) => {
    if (MODE === 'game') { document.body.classList.add('tr-ending'); return; }   // the composite blurs its panels
    if (Object.keys(over).length) end.innerHTML = endHtml({ ...END, ...over });
    document.body.classList.add('tr-ending'); restart($('#scene'), 'tr-endblur'); restart(end, 'on');
  };

  // ---- a wrong move, through the game's real tap path: aim at a visible cube
  // that belongs to the shape (the finger hovers there), then tap it. The game
  // itself flashes it red, shudders it, thuds and counts a ✕.
  let aimed = null;
  H.aimWrong = (fx = 0.5, fy = 0.45) => {
    const g = strata.game, p = g.puzzle, cx = fx * innerWidth, cy = fy * innerHeight, out = [];
    for (let i = 0; i < p.size; i++) if (p.solid[i] && !g.broken[i] && !g.painted[i]) {
      const [sx, sy] = screenOf(i);
      if (pickAt(sx, sy) === i) out.push({ i, sx, sy, d: Math.hypot(sx - cx, sy - cy) });
    }
    out.sort((a, b) => a.d - b.d);
    aimed = out[0] ?? null;
    if (aimed && MODE !== 'overlay') H.finger((aimed.sx + 14) / innerWidth, (aimed.sy + 26) / innerHeight, true);
  };
  H.wrongTap = () => {
    if (!aimed) H.aimWrong();
    if (!aimed) return;
    const c = aimed; aimed = null;
    ring(c.sx, c.sy);
    const before = strata.game.mistakes;
    strata.act(c.i, 'break');
    if (strata.game.mistakes !== before + 1 || strata.game.broken[c.i]) console.error('wrong tap did not register a mistake on cube ' + c.i);
    (H.tapLog ??= []).push({ i: c.i, seen: true, wrong: true });
  };
  // a small speaker in the corner: "this one is for sound"
  const speaker = make('tr-sound', '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#fffaf3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
    + '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="#fffaf3"/><path d="M15.5 9a4 4 0 0 1 0 6"/><path d="M18 6.5a7.5 7.5 0 0 1 0 11"/></svg>');
  H.speaker = (on = true) => { if (MODE !== 'game') speaker.classList.toggle('on', on); };
  // the game's own ✕ count (#strikes), shown big: the HUD it lives in also names the level
  const strikes = make('tr-strikes');
  H.strikes = (on = true) => {
    if (MODE === 'game') return;
    strikes.classList.toggle('on', on);
    const src = $('#strikes');
    const sync = () => { if (strikes.textContent !== src.textContent) { strikes.textContent = src.textContent; restart(strikes, 'pop'); } };
    sync();
    if (!H.strikesObs) { H.strikesObs = new MutationObserver(sync); H.strikesObs.observe(src, { childList: true, characterData: true, subtree: true }); }
  };
  H.ff = () => {};
  H.speed = () => {};
})();
`;
