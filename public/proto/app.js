// Map study prototype: title -> map over a sea of cloud.
// Not linked from the game; nothing here writes the game's saved state.
//   ?dir=b        layered 2.5D (the chosen direction, default)   ?dir=a  three.js world
//   ?s=mid        save state (see SCENARIOS in data.js)
//   ?clouds=      cumulus | painted | voxel | mist (direction B)
//   ?scenery=     voxel | lowpoly (direction B)
//   ?map=1        skip the title            ?rm=1   behave as under Reduce Motion
import { buildMap, SCENARIOS, rng } from './data.js';
import { buildLayer, placeLayer, heroSVG, trailSVG, placeFlow } from './ui.js';
import { ease, DUR } from '../js/motion.js';
import { sound } from '../js/audio.js';

const params = new URLSearchParams(location.search);
const scenario = SCENARIOS[params.get('s')] ? params.get('s') : 'mid';
const dirName = params.get('dir') === 'a' ? 'a' : 'b';
const flow = dirName === 'b';      // B: stones and trail live in the page itself
const reduceMotion = params.get('rm') === '1' || matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s) => document.querySelector(s);
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const sleep = (s) => new Promise((r) => setTimeout(r, s * 1000));

let map = buildMap({ scenario });
const overlay = $('#overlay'), scroller = $('#scroller'), spacer = $('#spacer'), titleEl = $('#title');
const W = () => window.innerWidth, H = () => window.innerHeight;

const dir = dirName === 'a'
  ? new (await import('./world.js')).World($('#world'), map, numParams(['hfov', 'mapPitch', 'topPitch', 'titlePitch', 'lean']))
  : new (await import('./layers.js')).Layers($('#flat'), map, { scenery: params.get('scenery') || 'voxel', clouds: params.get('clouds') || 'mist' });
if (dirName === 'b') { $('#world').hidden = true; $('#flat').hidden = false; }
document.body.classList.add(`dir-${dirName}`);

function numParams(keys) {
  const o = {};
  for (const k of keys) if (params.has(k)) o[k] = Number(params.get(k));
  return o;
}

// A: the stones are placed over the world each frame (a track in a sticky
// overlay). B: they are part of the page, with the trail, in one container
// that the browser scrolls: they cannot leave their lines.
const track = document.createElement('div');
track.id = 'track';
overlay.appendChild(track);
const content = document.createElement('div');
content.id = 'content';
if (flow) { overlay.hidden = true; spacer.appendChild(content); spacer.classList.add('flow'); }
let layer = buildLayer(flow ? content : track, map, { onTap });
let trailHTML = '';
function layoutFlow(drawFrom = null) {
  if (!flow) return;
  trailHTML = trailSVG(map, W(), drawFrom);
  content.insertAdjacentHTML('afterbegin', trailHTML);
  content.querySelectorAll('.p-trail').forEach((s, i) => { if (i > 0) s.remove(); });
  placeFlow(layer, W());
  content.querySelectorAll('.trail.draw').forEach((p) => p.style.setProperty('--len', (p.getTotalLength() + 2).toFixed(1)));
}
layoutFlow();
function onTap(n, el) {
  sound.unlock();
  sound.stone(map.nodes.indexOf(n));
  el.animate([{ scale: 1 }, { scale: 0.94 }, { scale: 1 }], { duration: 260, easing: 'ease-out' });
}

// ---------------------------------------------------------------- size
function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  dir.setSize(W(), H(), dpr);
  spacer.style.height = flow ? `${map.height}px` : `${Math.max(H() + 10, map.height - H() * 0.35)}px`;
  if (flow && content.isConnected && layer) { content.querySelector('.p-trail')?.remove(); layoutFlow(); }
}
resize();
window.addEventListener('resize', resize);

// ---------------------------------------------------------------- the view: u (title pan) and s (scroll)
const view = { u: params.get('map') === '1' ? 1 : 0, s: 0, titleUp: params.get('map') !== '1', scrollOverride: null };
function readScroll() { return view.titleUp ? 0 : (view.scrollOverride ?? scroller.scrollTop); }

// ---------------------------------------------------------------- the title
titleEl.querySelector('.logo').innerHTML = logoSVG(false);
const CARVE_AT = 0.7;
setTimeout(() => {
  titleEl.querySelector('.logo').innerHTML = logoSVG(true);
  if (sound.ctx?.state === 'running') sound.chisel(1);
}, reduceMotion ? 0 : CARVE_AT * 1000);

function setTitle(u) {
  view.u = u;
  if (flow) {
    // B: one page. The name and the logo are part of the sky, which is the top
    // of the page: they move exactly as far as the map does (no parallax)
    const off = dir.offset(u);
    titleEl.style.transform = `translateY(${(off - dir.offset(0)).toFixed(1)}px)`;
    content.style.transform = view.titleUp || u < 1 ? `translateY(${off.toFixed(1)}px)` : '';
    return;
  }
  // A: the name and the logo belong to the sky: they rise with it and fade
  const y = -u * H() * 0.9;
  titleEl.style.transform = `translateY(${y.toFixed(1)}px)`;
  titleEl.style.opacity = String(1 - clamp((u - 0.12) / 0.4));
}
const pull = { id: null, y0: 0, lastY: 0, lastT: 0, v: 0, dy: 0, live: false, raf: 0 };
titleEl.addEventListener('pointerdown', (e) => {
  if (!view.titleUp || pull.id !== null) return;
  if (params.get('mute') !== '1') sound.unlock();     // ?mute=1: the frame-time study isolates audio start-up
  if (!pull.welcomed) { pull.welcomed = true; setTimeout(() => sound.stone(0), 30); }
  cancelAnimationFrame(pull.raf);
  pull.id = e.pointerId; pull.y0 = pull.lastY = e.clientY + view.u * H(); pull.lastT = performance.now(); pull.v = 0;
  titleEl.setPointerCapture?.(e.pointerId);
});
titleEl.addEventListener('pointermove', (e) => {
  if (e.pointerId !== pull.id) return;
  const t = performance.now();
  pull.dy = pull.y0 - e.clientY;
  pull.v = (pull.lastY - e.clientY) / Math.max(1, t - pull.lastT);
  pull.lastY = e.clientY; pull.lastT = t;
  if (pull.dy > 6) pull.live = true;
  if (pull.live) setTitle(clamp(pull.dy / H()));
});
const endPull = (e) => {
  if (e.pointerId !== pull.id) return;
  pull.id = null;
  if (!pull.live) return;
  pull.live = false;
  if (e.type !== 'pointercancel' && (pull.dy > H() * 0.18 || pull.v > 0.5)) finishTitle(); else glideU(0, 0.35, ease.out);
};
titleEl.addEventListener('pointerup', endPull);
titleEl.addEventListener('pointercancel', endPull);
window.addEventListener('keydown', (e) => {
  if (view.titleUp && ['Enter', ' ', 'ArrowUp'].includes(e.key)) { sound.unlock(); finishTitle(); }
});
function glideU(to, seconds, curve, done) {
  cancelAnimationFrame(pull.raf);
  if (reduceMotion) { setTitle(to); done?.(); return; }
  const from = view.u, t0 = performance.now();
  const step = () => {
    const k = Math.min(1, (performance.now() - t0) / 1000 / seconds);
    setTitle(from + (to - from) * curve(k));
    if (k < 1) pull.raf = requestAnimationFrame(step); else done?.();
  };
  pull.raf = requestAnimationFrame(step);
}
function finishTitle() {
  if (!view.titleUp) return;
  sound.peel();
  // long enough for the horizon to be seen on the way down (MV3 spends ~5 s on
  // its descent; a swipe asks for less): a tuning guess, see docs/map-study.md
  glideU(1, 0.7 + 1.1 * (1 - view.u), ease.out, enterMap);
}
function enterMap() {
  view.titleUp = false;
  setTitle(1);
  titleEl.classList.add('gone');
  scroller.classList.add('live');
  scroller.scrollTop = 0;
}
if (!view.titleUp) enterMap(); else setTitle(0);

// ---------------------------------------------------------------- frame
const perf = { last: performance.now(), d: [] };
function frame(now) {
  const dt = now - perf.last; perf.last = now;
  perf.d.push(dt); if (perf.d.length > 90) perf.d.shift();
  const s = readScroll();
  dir.setView(view.u, s);
  if (flow) {
    // the page scrolls itself; only the walking hero is placed by hand
    const h = layer.hero;
    if (h.walking) h.el.style.transform = `translate(${(W() / 2 + h.x).toFixed(1)}px, ${(h.z + (h.dy ?? 0)).toFixed(1)}px)`;
  } else if (!noDom) {
    // the track's own move: the cloud's vertical scale at the screen centre, times the scroll
    const a = dir.project(0, 0, s + H() / 2, {}).y, b = dir.project(0, 0, s + H() / 2 + 100, {}).y;
    placeLayer(layer, dir.project.bind(dir), dir.viewZ, H(), track, -s * (b - a) / 100, settle && !view.titleUp);
  }
  dir.render(now / 1000);
  if (perfEl.classList.contains('show') && (perf.n = (perf.n ?? 0) + 1) % 15 === 0) {
    const a = [...perf.d].sort((x, y) => x - y);
    const st = dir.stats();
    perfEl.textContent = `${dirName.toUpperCase()}  ${(1000 / (a.reduce((x, y) => x + y, 0) / a.length)).toFixed(0)} fps  med ${a[a.length >> 1].toFixed(1)}  max ${a[a.length - 1].toFixed(1)} ms\ncalls ${st.calls}  tris ${st.tris}  s ${s.toFixed(0)}`;
  }
  requestAnimationFrame(frame);
}
const perfEl = $('#perf');
// experiment switches for the frame-time study
const noDom = params.get('nodom') === '1';
const settle = params.get('settle') === '1';
for (const k of ['nolabels', 'noimg', 'notextshadow']) if (params.get(k) === '1') document.body.classList.add(k);
if (noDom) overlay.style.display = 'none';
if (params.get('noshadow') === '1') document.body.classList.add('noshadow');
requestAnimationFrame(frame);

// ---------------------------------------------------------------- the unlock ceremony
// The stone you just solved becomes its object, the gold trail draws on to the
// stones it opened (the hero walks it), and if that reaches a new chapter, its
// cloud parts. Once per chapter in the game (persisted like 'awaken').
async function glideScroll(to, seconds) {
  to = clamp(to, 0, scroller.scrollHeight - H());
  if (reduceMotion) { scroller.scrollTop = to; return; }
  const from = scroller.scrollTop, t0 = performance.now();
  await new Promise((res) => {
    const step = () => {
      const k = Math.min(1, (performance.now() - t0) / 1000 / seconds);
      scroller.scrollTop = from + (to - from) * ease.inOut(k);
      if (k < 1) requestAnimationFrame(step); else res();
    };
    requestAnimationFrame(step);
  });
}
function tween(seconds, fn, curve = ease.inOut) {
  if (reduceMotion) { fn(1); return Promise.resolve(); }
  const t0 = performance.now();
  return new Promise((res) => {
    const step = () => {
      const k = Math.min(1, (performance.now() - t0) / 1000 / seconds);
      fn(curve(k));
      if (k < 1) requestAnimationFrame(step); else res();
    };
    requestAnimationFrame(step);
  });
}
const goldEnd = (m) => Math.max(0, ...m.segments.filter((s) => s.kind === 'gold').map((s) => s.s1));
let busy = false;
async function unlockNext() {
  if (busy || view.titleUp) return;
  const cur = map.nodes.find((n) => n.state === 'current' && n.kind === 'puzzle');
  if (!cur) return;
  busy = true;
  sound.unlock();
  const solved2 = { ...map.solved, [cur.entry.shape.id]: { time: 60, mistakes: 0, stars: 3, score: 900 } };
  const next = buildMap({ scenario, solved: solved2 });
  const woke = next.regions.filter((r, i) => r.reached && !map.regions[i].reached);
  const from = goldEnd(map), to = goldEnd(next);
  const focus = woke.length ? woke[0].top + 60 : cur.z;
  await glideScroll(focus - H() * 0.48, DUR.scene);
  await sleep(reduceMotion ? 0 : DUR.hold);
  // the new state, with the newly reached chapters' stones still under cloud
  const prevHero = { x: layer.hero.x, z: layer.hero.z };
  const wakeSet = new Set(woke);
  const wasOpen = new Set(map.trail.filter((n) => n.state !== 'locked').map((n) => n.entry?.shape.id ?? n.kind));
  map = next;
  layer = buildLayer(flow ? content : track, map, { onTap });
  // today's trail draws itself on to the stones that just opened
  layoutFlow(new Set(map.trail.filter((n) => n.state !== 'locked' && !wasOpen.has(n.entry?.shape.id ?? n.kind))));
  for (const it of layer.items) {
    if (it.node === undefined) continue;
    if (it.node.entry?.shape.id === cur.entry.shape.id) it.el.classList.add('fresh');
    if (wakeSet.has(it.node.region)) { it.el.style.opacity = '0'; it.el.style.transition = 'opacity .9s ease'; }
  }
  // the trail inside a chapter whose cloud is about to part waits for it
  const hidden = [...content.querySelectorAll('.trail')].filter((p) => woke.some((r) => String(r.index) === p.dataset.r));
  for (const p of hidden) { p.style.opacity = '0'; p.style.transition = 'opacity .9s ease'; }
  layer.hero.x = prevHero.x; layer.hero.z = prevHero.z;
  layer.hero.walking = true;
  dir.rebuildPath(map);
  dir.setDrawn(from);
  sound.stone(map.nodes.indexOf(cur));
  await sleep(reduceMotion ? 0 : 0.5);
  // the trail draws on, the hero walks it
  const walk = heroWalk(prevHero, map.current);
  const dur = clamp((to - from) / 260, 0.7, 2.2);
  layer.hero.el.classList.add('walking');
  await tween(dur, (k) => { dir.setDrawn(from + (to - from) * k); walk(k); });
  layer.hero.el.classList.remove('walking');
  dir.setDrawn(1e9);
  if (!woke.length) layer.hero.walking = false;
  // the cloud parts over a newly reached chapter
  for (const r of woke) {
    sound.setKey(r.base.name);
    sound.peel();
    layer.items.find((it) => it.region === r)?.el.classList.add('waking');
    const items = layer.items.filter((it) => it.node && it.node.region === r);
    await tween(reduceMotion ? 0 : DUR.ceremony * 2, (k) => {
      dir.setPart(r.index, k);
      for (const it of items) if (k > 0.25 + 0.5 * clamp((it.z - r.top) / (r.bottom - r.top))) it.el.style.opacity = '';
      if (k > 0.3) for (const p of hidden) p.style.opacity = '';
    }, (k) => k);   // linear: each billow staggers by its distance from the trail
    for (const it of items) it.el.style.opacity = '';
    for (const p of hidden) p.style.opacity = '';
    layer.hero.walking = false;
    sound.stone(3);
  }
  busy = false;
}
function heroWalk(start, home) {
  const end = { x: home.x + (home.x > 0 ? 46 : -46), z: home.z + 6 };
  const segs = map.segments.filter((s) => s.a.z >= start.z - 140 && s.b.z <= home.z + 1 && s.b.z > start.z - 60);
  const pts = [start, ...segs.flatMap((s) => s.pts), end];
  const L = [0];
  for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].z - pts[i - 1].z));
  const total = L[L.length - 1] || 1, steps = Math.max(1, segs.length);
  return (k) => {
    const d = k * total;
    let i = 1; while (i < L.length - 1 && L[i] < d) i++;
    const f = (d - L[i - 1]) / Math.max(1e-6, L[i] - L[i - 1]);
    layer.hero.x = pts[i - 1].x + (pts[i].x - pts[i - 1].x) * f;
    layer.hero.z = pts[i - 1].z + (pts[i].z - pts[i - 1].z) * f;
    layer.hero.dy = -Math.abs(Math.sin(k * Math.PI * steps * 2)) * 6;
  };
}

// ---------------------------------------------------------------- the study's controls
const panel = $('#devpanel');
$('#devbtn').addEventListener('click', () => panel.classList.toggle('show'));
const sel = panel.querySelector('#scenario');
sel.innerHTML = Object.entries(SCENARIOS).map(([k, v]) => `<option value="${k}"${k === scenario ? ' selected' : ''}>${v}</option>`).join('');
const go = (patch) => { const p = new URLSearchParams(location.search); for (const [k, v] of Object.entries(patch)) v == null ? p.delete(k) : p.set(k, v); location.search = p.toString(); };
sel.addEventListener('change', () => go({ s: sel.value }));
panel.querySelector('#dir-a').addEventListener('click', () => go({ dir: 'a' }));
panel.querySelector('#dir-b').addEventListener('click', () => go({ dir: 'b' }));
for (const id of ['clouds', 'scenery']) {
  const s = panel.querySelector(`#${id}`);
  if (params.get(id)) s.value = params.get(id);
  s.addEventListener('change', () => go({ [id]: s.value, dir: 'b' }));
}
panel.querySelector('#replay').addEventListener('click', () => go({ map: null }));
panel.querySelector('#unlock').addEventListener('click', () => { panel.classList.remove('show'); unlockNext(); });
panel.querySelector('#perfbtn').addEventListener('click', () => perfEl.classList.toggle('show'));
panel.querySelector('#rmbtn').addEventListener('click', () => go({ rm: reduceMotion ? null : '1' }));
panel.querySelector('#rmbtn').textContent = `Reduce Motion: ${reduceMotion ? 'on' : 'off'}`;

// hooks for the capture scripts (shots/map-study)
window.proto = {
  map: () => map, view, dir, setTitle, finishTitle, enterMap, unlockNext, glideScroll,
  scrollToZ: (z, frac = 0.45) => { scroller.scrollTop = clamp(z - H() * frac, 0, scroller.scrollHeight); },
  busy: () => busy,
};

// ---------------------------------------------------------------- the logo (stand-in for the game's three.js logo)
// a 2x2x2 stone in the Dawn ramp; its near top corner is carved away at 0.7 s
function logoSVG(carved) {
  const c = Math.cos(Math.PI / 6), s = 0.5, u = 26;
  const P = (x, y, z) => [60 + (x - z) * c * u, 62 + (x + z) * s * u - y * u];
  const f = (pts, fill) => `<path d="M${pts.map((p) => P(...p).map((v) => v.toFixed(1)).join(' ')).join('L')}Z" fill="${fill}"/>`;
  let out = '';
  const cells = [];
  for (let x = 0; x < 2; x++) for (let y = 0; y < 2; y++) for (let z = 0; z < 2; z++) if (!(carved && x & y & z)) cells.push([x, y, z]);
  cells.sort((a, b) => a[0] + a[1] + a[2] - (b[0] + b[1] + b[2]) || a[1] - b[1]);
  for (const [x, y, z] of cells) {
    out += f([[x, y + 1, z], [x + 1, y + 1, z], [x + 1, y + 1, z + 1], [x, y + 1, z + 1]], '#fcf0de');
    out += f([[x, y, z + 1], [x + 1, y, z + 1], [x + 1, y + 1, z + 1], [x, y + 1, z + 1]], '#f1c4a6');
    out += f([[x + 1, y, z], [x + 1, y + 1, z], [x + 1, y + 1, z + 1], [x + 1, y, z + 1]], '#a98cb6');
  }
  return `<svg viewBox="0 0 120 124" aria-hidden="true">${out}</svg>`;
}
