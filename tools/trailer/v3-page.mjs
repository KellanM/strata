// Trailer v3's page helpers. pageHelpers is stringified and injected into both
// capture passes, so it must not reach outside itself. cfg: { badges }.
export function pageHelpers(cfg) {
  const $ = (s) => document.querySelector(s);
  const H = (window.__trailer = {});
  let audio = null;
  H.audioModule = (m) => { audio = m; };
  const FONT = '"Avenir Next", Avenir, Futura, "Century Gothic", "Segoe UI", sans-serif';

  const css = [
    '.hud, #install, #actions, #coach, #press-ring, #map-close, #map-help, #map-journal, #lantern, #journal-close, #journal-back { display: none !important; }',
    // the game's layers blur together on a cut; the trailer's own overlays (.tr) stay sharp
    'body > :not(.tr) { transform-origin: 50% 45%; }',
    'body.tr-blur > :not(.tr) { filter: blur(14px) brightness(1.12) saturate(1.1); transform: scale(1.07); }',
    // only while a cut runs: its own transition wins over the layers' (their opacity changes land at once, under the blur)
    'body.tr-cutting > :not(.tr) { transition: filter var(--trd) var(--tre), transform var(--trd) var(--tre) !important; }',
    '.tr { pointer-events: none; }',
    '#tr-dip { position: fixed; inset: 0; z-index: 50; opacity: 0; transition: opacity .15s linear; }',
    // kinetic captions: each letter blurs and rises in, staggered; they leave upward, blurring out
    '.tr-cap { position: fixed; left: 0; right: 0; z-index: 40; text-align: center; font-family: ' + FONT + '; text-transform: uppercase; white-space: nowrap; }',
    '.tr-cap .w { display: inline-block; }',
    '.tr-cap .c { display: inline-block; opacity: 0; filter: blur(7px); transform: translateY(.45em) scale(1.25);',
    '  transition: opacity .32s ease-out, filter .42s ease-out, transform .55s cubic-bezier(.2,.9,.25,1.15); transition-delay: calc(var(--k) * 34ms); }',
    '.tr-cap.on .c { opacity: 1; filter: none; transform: none; }',
    '.tr-cap.out .c { opacity: 0; filter: blur(9px); transform: translateY(-.35em) scale(.96); transition-duration: .22s, .22s, .26s; transition-delay: calc(var(--k) * 12ms); }',
    '.tr-cap.verb { font-weight: 600; font-size: 50px; letter-spacing: .32em; padding-left: .32em; }',
    '.tr-cap.line { font-weight: 600; font-size: 21px; letter-spacing: .26em; padding-left: .26em; line-height: 1.5; }',
    '.tr-cap.big { font-weight: 600; font-size: 92px; letter-spacing: .04em; line-height: 1; }',
    '.tr-cap.say { font-weight: 600; font-size: 29px; letter-spacing: .13em; padding-left: .13em; line-height: 1.3; }',
    '.tr-cap.ink { color: #43355e; text-shadow: 0 0 22px rgba(255,250,240,.95), 0 0 6px rgba(255,250,240,.7); }',
    '.tr-cap.light { color: #fffaf2; text-shadow: 0 2px 18px rgba(30,16,40,.55), 0 0 4px rgba(30,16,40,.4); }',
    '.tr-cap.big.light { text-shadow: 0 4px 30px rgba(30,16,40,.6), 0 0 6px rgba(30,16,40,.45); }',
    // where on screen: all inside the safe box shared by TikTok, Reels and Shorts (y 15%-64.5%, x 11%-81%)
    '.tr-cap.cl1 { top: 49%; } .tr-cap.cl2 { top: 53%; } .tr-cap.cl1, .tr-cap.cl2 { font-size: 26px; }',
    '.tr-cap.low { top: 59%; } .tr-cap.mid { top: 44%; } .tr-cap.mid2 { top: 54.5%; } .tr-cap.up { top: 17%; } .tr-cap.up2 { top: 21%; }',
    // a finger: where a tap lands, a ring blooms; a drag carries a soft dot
    '.tr-touch { position: fixed; z-index: 45; width: 58px; height: 58px; margin: -29px 0 0 -29px; border-radius: 50%;',
    '  border: 3px solid rgba(255,255,255,.97); background: radial-gradient(circle, rgba(255,255,255,.7), rgba(255,255,255,.18) 58%, rgba(255,255,255,0) 70%);',
    '  box-shadow: 0 0 16px rgba(255,255,255,.8), 0 0 0 1px rgba(50,36,72,.28), inset 0 0 0 1px rgba(50,36,72,.18); animation: trTouch .55s cubic-bezier(.2,.7,.3,1) forwards; }',
    '@keyframes trTouch { 0% { transform: scale(.5); opacity: 1; } 40% { opacity: 1; } 100% { transform: scale(1.5); opacity: 0; } }',
    '#tr-finger { position: fixed; z-index: 45; width: 54px; height: 54px; margin: -27px 0 0 -27px; border-radius: 50%; opacity: 0; transition: opacity .15s linear;',
    '  border: 3px solid rgba(255,255,255,.95); background: radial-gradient(circle, rgba(255,255,255,.85), rgba(255,255,255,.3) 60%, rgba(255,255,255,0) 72%);',
    '  box-shadow: 0 0 18px rgba(255,255,255,.7), 0 0 0 1px rgba(50,36,72,.28); }',
    '#tr-finger.on { opacity: 1; }',
    // the end card: on the game's own title, its tagline and "swipe up" away; the badges under the stone
    'body.tr-end #title .tap, body.tr-end #title .sub, body.tr-notag #title .sub { display: none !important; }',
    '#tr-end { position: fixed; left: 0; right: 0; top: 23%; z-index: 40; text-align: center; font-family: ' + FONT + '; color: #f6f1ff; }',
    '#tr-end .cta { font-size: 13px; font-weight: 600; letter-spacing: .34em; padding-left: .34em; text-transform: uppercase; margin-bottom: 10px; }',
    '#tr-end .search { display: flex; align-items: center; gap: 9px; width: 214px; height: 38px; margin: 0 auto 12px; padding: 0 16px; box-sizing: border-box; border-radius: 19px;',
    '  background: rgba(255,255,255,.94); box-shadow: 0 6px 22px rgba(20,12,40,.35); color: #3a2d55; font: 600 16px/1 ' + FONT + '; letter-spacing: .14em; text-transform: uppercase; }',
    '#tr-end .search svg { width: 17px; height: 17px; fill: none; stroke: #6d5f8c; stroke-width: 2.4; stroke-linecap: round; flex: none; }',
    '#tr-end .search .caret { width: 2px; height: 18px; background: #6d5f8c; margin-left: -6px; animation: trCaret 1s steps(1) infinite; }',
    '@keyframes trCaret { 50% { opacity: 0; } }',
    '#tr-end .search { opacity: 0; transform: translateY(14px) scale(.96); transition: opacity .45s ease-out, transform .6s cubic-bezier(.2,.9,.25,1); transition-delay: .08s; }',
    '#tr-end.on .search { opacity: 1; transform: none; }',
    '#tr-end .row { display: flex; justify-content: center; align-items: center; gap: 16px; }',
    '#tr-end .apple { height: 48px; display: block; }',
    // the Play badge's artwork carries its own clear space: the badge itself is 168/250 of the image
    '#tr-end .google { height: 71.4px; display: block; margin: -11.7px -13.1px; }',
    '#tr-end .cta, #tr-end .row { opacity: 0; transform: translateY(14px); transition: opacity .5s ease-out, transform .7s cubic-bezier(.2,.9,.25,1); }',
    '#tr-end.on .cta { opacity: .92; transform: none; } #tr-end.on .row { opacity: 1; transform: none; transition-delay: .18s; }',
    '#tr-legal { position: fixed; left: 0; right: 0; bottom: 14px; z-index: 40; text-align: center; font: 500 6.5px/1.5 ' + FONT + '; color: rgba(240,236,255,.5); opacity: 0; transition: opacity .5s; }',
    '#tr-legal.on { opacity: 1; }',
    // a soft shade behind a big line over a busy picture (the wall)
    '#tr-shade { position: fixed; inset: 0; z-index: 39; opacity: 0; transition: opacity .3s ease; background: radial-gradient(ellipse 70% 30% at 50% 50%, rgba(36,24,52,.55), rgba(36,24,52,.18) 70%, rgba(36,24,52,0)); }',
    '#tr-shade.on { opacity: 1; }',
  ].join('\n');
  const style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);
  const el = (id) => { const e = document.createElement('div'); e.id = id; e.className = 'tr'; document.body.appendChild(e); return e; };
  const dip = el('tr-dip');
  const finger = el('tr-finger');
  const shade = el('tr-shade');
  H.shade = (on) => shade.classList.toggle('on', !!on);
  const end = el('tr-end');
  // the end card: where to find it - a store search typing the name, and the badges
  end.innerHTML = '<div class="cta">free to play</div>'
    + '<div class="search"><svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/></svg><span class="q"></span><i class="caret"></i></div>'
    + '<div class="row"><img class="apple" src="' + cfg.badges.apple + '"><img class="google" src="' + cfg.badges.google + '"></div>';
  const legal = el('tr-legal');
  legal.innerHTML = 'Apple and the Apple logo are trademarks of Apple Inc., registered in the U.S. and other countries.<br>Google Play and the Google Play logo are trademarks of Google LLC.';

  // every caption's laid-out box (untransformed), in % of the frame, for the safe-zone check
  const measure = (c, text) => {
    const r = [...c.querySelectorAll('.w')].map((w) => w.getBoundingClientRect());
    if (!r.length) return;
    const box = { text: String(text), x0: Math.min(...r.map((q) => q.left)) / innerWidth * 100, x1: Math.max(...r.map((q) => q.right)) / innerWidth * 100,
      y0: Math.min(...r.map((q) => q.top)) / innerHeight * 100, y1: Math.max(...r.map((q) => q.bottom)) / innerHeight * 100 };
    for (const k of ['x0', 'x1', 'y0', 'y1']) box[k] = +box[k].toFixed(1);
    (window.__caps = window.__caps || []).push(box);
  };
  H.measureEnd = () => {
    const rg = document.createRange(); rg.selectNodeContents(document.querySelector('#tr-end .cta'));
    const r = [rg.getBoundingClientRect(), ...[...document.querySelectorAll('#tr-end img, #tr-end .search')].map((e) => e.getBoundingClientRect())];
    (window.__caps = window.__caps || []).push({ text: 'END CARD (cta + badges)', x0: +(Math.min(...r.map((q) => q.left)) / innerWidth * 100).toFixed(1), x1: +(Math.max(...r.map((q) => q.right)) / innerWidth * 100).toFixed(1),
      y0: +(Math.min(...r.map((q) => q.top)) / innerHeight * 100).toFixed(1), y1: +(Math.max(...r.map((q) => q.bottom)) / innerHeight * 100).toFixed(1) });
  };
  // ---- captions (two slots: a main line, and a second line under it)
  const slots = { a: [], b: [] };
  const setCap = (slot, text, cls) => {
    for (const c of slots[slot]) { c.classList.remove('on'); c.classList.add('out'); const old = c; setTimeout(() => old.remove(), 700); }
    slots[slot] = [];
    if (!text) return null;
    const c = document.createElement('div');
    c.className = 'tr tr-cap ' + cls;
    let k = 0;
    c.innerHTML = String(text).split(' ').map((w) => '<span class="w">' + [...w].map((ch) => '<span class="c" style="--k:' + (k++) + '">' + ch + '</span>').join('') + '</span>').join('<span class="c" style="--k:0">&nbsp;</span>');
    document.body.appendChild(c);
    void c.offsetWidth;
    c.classList.add('on');
    slots[slot].push(c);
    measure(c, text);
    return c;
  };
  H.cap = (text, cls) => setCap('a', text, cls);
  H.cap2 = (text, cls) => setCap('b', text, cls);
  H.capClear = () => { setCap('a', null); setCap('b', null); };
  // a number that counts up to `to`, then gains its + (the wall)
  H.count = (to, secs, cls) => {
    const c = setCap('a', '0', cls), t0 = performance.now();
    const tick = () => {
      const k = Math.min(1, (performance.now() - t0) / (secs * 1000));
      const n = Math.round(to * (1 - Math.pow(1 - k, 3)));
      const s = n + (k >= 1 ? '+' : '');
      if (c.dataset.s !== s) { c.dataset.s = s; c.innerHTML = [...s].map((ch) => '<span class="c" style="--k:0">' + ch + '</span>').join(''); }
      if (k < 1) requestAnimationFrame(tick);
    };
    tick();
  };

  // ---- cuts
  H.dip = (color, secs) => { dip.style.transition = 'opacity ' + secs + 's linear'; dip.style.background = color; dip.style.opacity = '1'; };
  H.undip = (secs) => { dip.style.transition = 'opacity ' + secs + 's ease-out'; dip.style.opacity = '0'; };
  let blurTimer = null;
  const cutT = (secs, ease) => { const b = document.body.style; b.setProperty('--trd', secs + 's'); b.setProperty('--tre', ease); document.body.classList.add('tr-cutting'); };
  H.blurOut = (secs) => { clearTimeout(blurTimer); cutT(secs, 'ease-in'); document.body.classList.add('tr-blur'); };
  H.blurIn = (secs) => {
    cutT(secs, 'cubic-bezier(.2,.8,.3,1)');
    document.body.classList.remove('tr-blur');
    blurTimer = setTimeout(() => document.body.classList.remove('tr-cutting'), secs * 1000 + 40);
  };

  // ---- levels
  H.level = (id, zoom = 1) => {
    $('#menu').classList.remove('show');
    $('#journal').classList.remove('show');
    const entries = strata.journalEntries();
    const k = entries.findIndex((e) => e.shape.id === id);
    strata.startPuzzle({ ...entries[k], number: k + 1 });
    const cam = strata.camera; cam.zoom = zoom; cam.updateProjectionMatrix();
  };
  const G = () => strata.game;
  const V3 = () => strata.camera.position.constructor;
  const cellW = (i) => { const p = G().puzzle, c = p.coords(i), d = p.dims; return new (V3())(c[0] - (d[0] - 1) / 2, c[1] - (d[1] - 1) / 2, c[2] - (d[2] - 1) / 2); };
  // screen <-> scene through the canvas's own box, as the game's pick() does (it may be scaled under a cut)
  const box = () => $('#scene').getBoundingClientRect();
  const toScreen = (v) => { const r = v.clone().project(strata.camera), b = box(); return [b.left + (r.x + 1) / 2 * b.width, b.top + (1 - r.y) / 2 * b.height]; };
  // the game's pick(): a voxel walk along the camera ray from a screen point; the first cube that `has`
  const hitAt = (x, y, has) => {
    const g = G(), p = g.puzzle, cam = strata.camera, V = V3();
    cam.updateMatrixWorld();
    const b = box();
    const o0 = new V(((x - b.left) / b.width) * 2 - 1, -((y - b.top) / b.height) * 2 + 1, -1).unproject(cam);
    const d = new V(0, 0, -1).transformDirection(cam.matrixWorld).toArray();
    const dims = p.dims, o = o0.toArray().map((v, a) => v + dims[a] / 2);
    let t0 = 0, t1 = Infinity;
    for (let a = 0; a < 3; a++) {
      if (Math.abs(d[a]) < 1e-9) { if (o[a] < 0 || o[a] > dims[a]) return -1; continue; }
      let ta = (0 - o[a]) / d[a], tb = (dims[a] - o[a]) / d[a];
      if (ta > tb) [ta, tb] = [tb, ta];
      t0 = Math.max(t0, ta); t1 = Math.min(t1, tb);
    }
    if (t0 > t1) return -1;
    const q = o.map((v, a) => v + d[a] * (t0 + 1e-5));
    const cell = q.map((v, a) => Math.min(dims[a] - 1, Math.max(0, Math.floor(v))));
    const step = d.map((v) => (v > 0 ? 1 : -1));
    const tMax = d.map((v, a) => (Math.abs(v) < 1e-9 ? Infinity : (cell[a] + (v > 0 ? 1 : 0) - q[a]) / v));
    const tDelta = d.map((v) => (Math.abs(v) < 1e-9 ? Infinity : Math.abs(1 / v)));
    for (let guard = 0; guard < 300; guard++) {
      const i = p.idx(cell[0], cell[1], cell[2]);
      if (has(i)) return i;
      const a = tMax[0] < tMax[1] ? (tMax[0] < tMax[2] ? 0 : 2) : (tMax[1] < tMax[2] ? 1 : 2);
      cell[a] += step[a];
      if (cell[a] < 0 || cell[a] >= dims[a]) return -1;
      tMax[a] += tDelta[a];
    }
    return -1;
  };
  const standing = (i) => !G().broken[i];
  // the best screen point that lands on cube i (given which cubes stand), or null:
  // points on its camera-facing faces; the squarest face, nearest its centre
  const tapPoint = (i, has = standing) => {
    const dir = strata.camera.position.clone().normalize();
    const c = cellW(i);
    let best = null;
    for (let a = 0; a < 3; a++) {
      const comp = dir.getComponent(a);
      if (Math.abs(comp) < 0.2) continue;
      const side = comp > 0 ? 1 : -1;
      for (const [u, v] of [[0, 0], [0.22, 0.22], [-0.22, 0.22], [0.22, -0.22], [-0.22, -0.22]]) {
        const f = c.clone(); f.setComponent(a, f.getComponent(a) + 0.5 * side);
        const b1 = (a + 1) % 3, b2 = (a + 2) % 3;
        f.setComponent(b1, f.getComponent(b1) + u); f.setComponent(b2, f.getComponent(b2) + v);
        const [x, y] = toScreen(f);
        if (x < 30 || x > innerWidth - 30 || y < innerHeight * 0.12 || y > innerHeight * 0.85) continue;
        if (hitAt(x, y, has) !== i) continue;
        const score = Math.abs(comp) * 10 - Math.hypot(u, v) * 8;
        if (!best || score > best.score) best = { x, y, score, i, a };
      }
    }
    return best;
  };
  const touch = (x, y) => {
    const r = document.createElement('div'); r.className = 'tr tr-touch';
    r.style.left = x + 'px'; r.style.top = y + 'px';
    document.body.appendChild(r);
    setTimeout(() => r.remove(), 700);
  };
  const pointer = (type, x, y, target = $('#scene')) => {
    const o = { clientX: x, clientY: y, pointerId: 1, pointerType: 'mouse', isPrimary: true, button: 0, buttons: type === 'pointerup' ? 0 : 1, bubbles: true, cancelable: true };
    target.dispatchEvent(new PointerEvent(type, o));
  };
  const log = (e) => { (window.__taps = window.__taps || []).push(e); };
  let lastTap = { x: -999, y: -999, t: -9 };
  const tapAt = (x, y, want) => {
    lastTap = { x, y, t: performance.now() / 1000 };
    touch(x, y);
    const before = want == null ? null : !!G().broken[want];
    pointer('pointerdown', x, y); pointer('pointerup', x, y);
    log({ t: +(performance.now() / 1000).toFixed(2), x: Math.round(x), y: Math.round(y), want, hit: want == null ? null : !before && !!G().broken[want], mistakes: G().mistakes, level: G().shape.id });
  };
  // a tap on a cube that has to go: a visible one, high on the stone and near its middle
  H.tap = () => {
    const g = G(), p = g.puzzle;
    let best = null;
    for (let i = 0; i < p.size; i++) {
      if (p.solid[i] || g.broken[i] || g.painted[i]) continue;
      const pt = tapPoint(i);
      if (!pt) continue;
      // not where the last tap landed, just now: that would be a double-tap
      if (performance.now() / 1000 - lastTap.t < 0.45 && Math.hypot(pt.x - lastTap.x, pt.y - lastTap.y) < 40) continue;
      const score = pt.score - Math.hypot(pt.x - innerWidth / 2, pt.y - innerHeight * 0.42) / 25 + p.coords(i)[1] * 0.4;
      if (!best || score > best.score) best = { ...pt, score };
    }
    if (best) tapAt(best.x, best.y, best.i);
    else log({ miss: true, level: g.shape.id });
  };
  // the 0-lines with a cube standing
  const zeroLines = (has = standing) => {
    const p = G().puzzle, out = [], seen = new Set();
    for (let i = 0; i < p.size; i++) {
      if (!has(i)) continue;
      for (let a = 0; a < 3; a++) {
        const line = p.lineOf(i, a);
        if (line.hidden || line.count !== 0) continue;
        const key = a + ':' + line.cells.join(',');
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({ a, line });
      }
    }
    return out;
  };
  // the tap point for a line: its camera-side end face, which must be what the ray meets
  const linePoint = (a, line, has = standing) => {
    const comp = strata.camera.position.clone().normalize().getComponent(a);
    if (Math.abs(comp) < 0.25) return null;
    const side = comp > 0 ? 1 : -1;
    const p = G().puzzle;
    const cells = line.cells.filter(has);
    if (cells.length < 3) return null;
    const endCell = cells.reduce((b, c) => (p.coords(c)[a] * side > p.coords(b)[a] * side ? c : b));
    const f = cellW(endCell); f.setComponent(a, f.getComponent(a) + 0.5 * side);
    const [x, y] = toScreen(f);
    if (x < 40 || x > innerWidth - 40 || y < innerHeight * 0.18 || y > innerHeight * 0.8) return null;
    if (hitAt(x, y, has) !== endCell) return null;
    return { x, y, n: cells.length, endCell };
  };
  // a double-tap on a shown 0: the game's own cascade clears the row
  let rowAt = null;
  H.rowTap = () => {
    let best = null;
    for (const { a, line } of zeroLines()) {
      const pt = linePoint(a, line);
      if (!pt) continue;
      const score = Math.min(pt.n, 9) * 10 - Math.hypot(pt.x - innerWidth / 2, pt.y - innerHeight * 0.45) / 20;
      if (!best || score > best.score) best = { ...pt, score, a };
    }
    rowAt = best;
    window.__rows = (window.__rows || []).concat([best ? { n: best.n, a: best.a, level: G().shape.id } : { none: true, level: G().shape.id }]);
    if (best) tapAt(best.x, best.y, best.endCell);
  };
  H.rowTap2 = () => { if (rowAt) { touch(rowAt.x, rowAt.y); pointer('pointerdown', rowAt.x, rowAt.y); pointer('pointerup', rowAt.x, rowAt.y); } rowAt = null; };

  // Set the stone up for a shot (silently, under a cut): chisel away everything
  // but `finals` cubes that will each be visible to tap and, with rows > 0,
  // that many whole 0-lines whose end faces show (for double-taps).
  // keepFrac: also leave that share of the rest (a stone part-way through).
  H.prep = (finals = 1, rows = 0, keepFrac = 0) => {
    const g = G(), p = g.puzzle;
    const todo = [];
    for (let i = 0; i < p.size; i++) if (!p.solid[i] && !g.broken[i]) todo.push(i);
    const keep = new Set();
    const has = (i) => p.solid[i] || keep.has(i);
    const keptRows = [];
    for (let r = 0; r < rows; r++) {
      let best = null;
      for (const { a, line } of zeroLines()) {
        if (line.cells.some((c) => keep.has(c) || g.broken[c])) continue;
        line.cells.forEach((c) => keep.add(c));
        const pt = linePoint(a, line, has);
        const others = keptRows.every((k) => linePoint(k.a, k.line, has));
        line.cells.forEach((c) => keep.delete(c));
        if (!pt || !others) continue;
        const score = Math.min(pt.n, 8) * 10 - Math.hypot(pt.x - innerWidth / 2, pt.y - innerHeight * 0.45) / 12;
        if (!best || score > best.score) best = { score, a, line };
      }
      if (best) { best.line.cells.forEach((c) => keep.add(c)); keptRows.push(best); }
    }
    const cand = todo.filter((i) => !keep.has(i)).map((i) => {
      keep.add(i);
      const pt = tapPoint(i, has);
      keep.delete(i);
      return pt && { i, x: pt.x, y: pt.y, s: pt.score - Math.hypot(pt.x - innerWidth / 2, pt.y - innerHeight * 0.42) / 18 };
    }).filter(Boolean).sort((x, y) => y.s - x.s);
    const finalsKept = [];
    const spots = [];
    for (const c of cand) {
      if (finalsKept.length >= finals) break;
      if (spots.some((q) => Math.hypot(q.x - c.x, q.y - c.y) < 55)) continue;   // apart, so two taps are never a double-tap
      keep.add(c.i);
      const ok = [...finalsKept, c.i].every((j) => tapPoint(j, has)) && keptRows.every((k) => linePoint(k.a, k.line, has));
      if (ok) { finalsKept.push(c.i); spots.push(c); } else keep.delete(c.i);
    }
    const rest = todo.filter((i) => !keep.has(i));
    const leave = Math.round(rest.length * keepFrac);
    // the ones furthest from the camera stay standing, so the kept cubes stay in view
    const camDir = strata.camera.position.clone().normalize();
    rest.sort((x, y) => cellW(x).dot(camDir) - cellW(y).dot(camDir));
    for (const i of rest.slice(leave)) strata.act(i, 'break');
    window.__preps = (window.__preps || []).concat([{ level: g.shape.id, finals: finalsKept.length, rows: keptRows.map((k) => k.line.cells.length), left: todo.length - (rest.length - leave) }]);
  };
  H.peel = (axis, n) => { if (strata.peel.axis !== axis) strata.setPeelAxis(axis, 1); strata.setPeeled(n); };

  // ---- a finger turning the solved object (the game's orbit controls)
  H.dragStart = (x, y) => { finger.style.left = x + 'px'; finger.style.top = y + 'px'; finger.classList.add('on'); pointer('pointerdown', x, y); };
  H.dragTo = (x, y) => { finger.style.left = x + 'px'; finger.style.top = y + 'px'; pointer('pointermove', x, y); };
  H.dragEnd = (x, y) => { pointer('pointerup', x, y); finger.classList.remove('on'); };

  // ---- the world: title, map, journal
  H.enterMap = () => { window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' })); };
  H.map = () => { $('#menu-btn').click(); };
  const sheet = () => $('#menu .map-scroll');
  const touchEv = (type, y) => {
    const t = new Touch({ identifier: 7, target: sheet(), clientX: innerWidth / 2, clientY: y });
    sheet().dispatchEvent(new TouchEvent(type, { touches: type === 'touchend' ? [] : [t], changedTouches: [t], bubbles: true, cancelable: true }));
  };
  // back up to the title, at once (under a cut): the map's own pull-down from its top
  H.toTitle = () => {
    $('#journal').classList.remove('show');
    if (!$('#menu').classList.contains('show')) $('#menu-btn').click();
    $('#menu').classList.remove('arriving', 'settling');
    sheet().scrollTop = 0;
    touchEv('touchstart', 200); touchEv('touchmove', 300); touchEv('touchmove', 700); touchEv('touchend', 700);
    sessionStorage.removeItem('strata.descended');   // the next descent is the full one, as on a first launch
  };
  // a finger on the map sheet at its top, pulling down: the title comes back down over it
  H.mapTop = () => {
    if (!$('#menu').classList.contains('show')) $('#menu-btn').click();
    $('#journal').classList.remove('show');
    $('#menu').classList.remove('arriving', 'settling');
    sheet().scrollTop = 0;
  };
  H.pullStart = () => { $('#menu').classList.remove('arriving', 'settling'); sheet().scrollTop = 0; touchEv('touchstart', 240); finger.style.left = innerWidth / 2 + 'px'; finger.style.top = '240px'; finger.classList.add('on'); };
  H.pullMove = (dy) => { touchEv('touchmove', 240 + dy); finger.style.top = (240 + dy) + 'px'; };
  H.pullEnd = () => { touchEv('touchend', 240 + 440); finger.classList.remove('on'); };
  // a tap on the title: the whole descent into the map
  H.tapTitle = () => {
    const t = $('#title'), x = innerWidth / 2, y = innerHeight * 0.74;
    touch(x, y);
    pointer('pointerdown', x, y, t); pointer('pointerup', x, y, t);
  };
  // the end card's title: the logo stone drawn a little smaller, to make room above it
  H.endTitle = () => { document.body.classList.add('tr-end'); const cam = strata.camera; cam.zoom = 0.74; cam.updateProjectionMatrix(); };
  H.noTag = () => { document.body.classList.add('tr-notag'); };
  H.endCard = () => {
    end.classList.add('on'); legal.classList.add('on');
    const q = end.querySelector('.q'), word = 'Strata';
    [...word].forEach((ch, k) => setTimeout(() => { q.textContent = word.slice(0, k + 1); }, 420 + k * 95));
    setTimeout(H.measureEnd, 1200);
  };
  H.focusNode = (id) => {
    const e = document.querySelector('.map-node[data-id="' + id + '"]'), s = sheet();
    if (!e || !s) return;
    const r = e.getBoundingClientRect();
    s.scrollTop += r.top + r.height / 2 - innerHeight * 0.5;
  };
  H.tapNode = (id) => {
    const e = document.querySelector('.map-node[data-id="' + id + '"]');
    if (!e) return;
    const r = e.getBoundingClientRect();
    touch(r.left + r.width / 2, r.top + r.height / 2);
    e.click();
  };
  H.mapScrollBy = (px) => { const s = sheet(); if (s) s.scrollTop += px; };
  H.journal = () => { $('#map-journal').click(); };
  H.journalScroll = (y) => { const s = $('#journal .jr-scroll'); if (s) s.scrollTop = y; };

  // ---- sound (the audio pass only)
  H.sfx = (on) => { if (audio) audio.sound.setSfx(on); };
  // where the picture jumps ahead (a fast-forward under a cut or a flash), the
  // real-time sound can't: the gems' own chimes (sound.star) are played at the
  // picture's times instead, and the result's later timers are let go by the
  // game's own tap-to-finish on a solved stone (audio pass only)
  H.finishResult = () => { const x = innerWidth / 2, y = innerHeight * 0.5; pointer('pointerdown', x, y); pointer('pointerup', x, y); };
  H.star = (k) => { if (audio && audio.sound.ctx) audio.sound.star(k); };
  H.whoosh = () => {
    if (!audio || !audio.sound.ctx) return;
    const s = audio.sound;
    s.noise({ dest: s.sfx, dur: 0.22, gain: 0.05, freq: 900, sweepTo: 5200, q: 0.7, attack: 0.12 });
  };
  H.chime = (k, gain = 0.45) => {
    if (!audio || !audio.sound.ctx) return;
    const s = audio.sound;
    s.fmBell(s.key.root + 36 + [0, 4, 7, 12, 16, 19][k % 6], { dest: s.music, gain, decay: 1.6 });
  };
  H.finalChord = () => {
    if (!audio || !audio.sound.ctx) return;
    const s = audio.sound;
    [0, 7, 12, 16, 19].forEach((d, k) => s.fmBell(s.key.root + 24 + d, { dest: s.music, at: s.now + k * 0.09, gain: 0.42, decay: 3.2, index: 1.6 }));
  };
  H.ff = () => {};
}
