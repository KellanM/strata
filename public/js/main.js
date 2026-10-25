import * as THREE from 'three';
import { makeOrbit } from './orbit.js';
import { Puzzle, setClues, lineFits } from './puzzle.js';
import { SHAPES, BONUS, CHAPTERS, TUTORIAL, randomShape, buildCells } from './shapes.js';
import { PALETTES, variant } from './palettes.js';
import { scoreFor } from './score.js';
import { sound } from './audio.js';
import { Finale } from './finale.js';
import { Fragments } from './fragments.js';
import { Cubes } from './cubes.js';
import { Ash, Background, GodRays, Motes, Shards } from './atmosphere.js';
import { createFirstLight } from './firstlight/scene.js';
import { PeelHandles } from './handles.js';
import { renderMap } from './map.js';
import { MapWorld } from './mapworld.js';
import { renderJournal, closeView, viewOpen } from './journal.js';
import { rate as motionRate, after, mark, reveal, prepareReveal, devFlags, ease, DUR, BEAT } from './motion.js';
import { migrateSaves } from './migrate.js';
import * as ads from './ads.js';

// Palette hexes are display colours; pass them through untouched.
THREE.ColorManagement.enabled = false;

const $ = (s) => document.querySelector(s);
const canvas = $('#scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.autoClear = false;
renderer.setClearColor(0x000000, 0);   // clear to transparent: the title's logo stands on the map's world behind

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 400);
const controls = makeOrbit(camera, canvas);

const cubes = new Cubes();
const background = new Background();
const rays = new GodRays();
const motes = new Motes();
const shards = new Shards();
const ash = new Ash();
const handles = new PeelHandles(cubes.uniforms.uLight);
scene.add(background.mesh, motes.points, shards.points, ash.points, handles.group);
const finale = new Finale(cubes.uniforms.uLight);
scene.add(finale.group);
const fragments = new Fragments(cubes.uniforms.uLight);
scene.add(fragments.mesh);

// shockwave rings that roll out across the ground when a puzzle is solved
const winRings = [0, 0.22, 0.5].map((delay) => {
  const mesh = new THREE.Mesh(
    new THREE.RingGeometry(0.97, 1, 128).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 }),
  );
  mesh.visible = false;
  mesh.renderOrder = 2;
  scene.add(mesh);
  return { mesh, delay };
});

const CAM_DIST = 120;
let viewRadius = 6;
let game = null;
let tool = 'break';
// peeled: whole layers (game logic). keepVisual: what the shader eases toward.
const peel = { axis: 0, side: 1, peeled: 0, keepVisual: 99 };
let rayBoost = 0;
let tutorial = null;          // { step, hint, open }: open = the current hint is showing (a `wait` hint holds back)
let updateReady = false;      // a new version has taken over; reload at a calm moment
let lastTouch = null;         // { i, point }: where the last pick met its cube
let titleUp = true;           // the launch title is showing: the block is a backdrop, no HUD or handles
let introDelay = 0;           // set by the map dive so the block assembles once the veil has lifted
let viewAnim = null;
const clock0 = performance.now();
// the scene clock (seconds); runs at a quarter speed in slow motion (developer panel)
const now = () => ((performance.now() - clock0) / 1000) * motionRate;

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// The map's world (mapworld.js, docs/map-study.md): flat layers behind this
// canvas. At the title the canvas draws only the logo (and its light) over the
// world's night sky. While the map is up the canvas fades out with the map's
// own parts (0.5 s) and the level isn't drawn at all; it fades back in only
// once the level it shows is the right one (a dive builds it under the veil).
// Declared before the first draw() at boot.
const mapWorld = new MapWorld($('#map-world'), $('#menu .map-scroll'));
const menuEl = $('#menu');
const titleEl = $('#title');
// a slip taken back (top-right HUD slot) and the small card that offers a gift
// (a slip taken back, a shrine short of stars); declared here, before boot's first startPuzzle
const rewindEl = $('#rewind');
const offerEl = $('#offer');
let offerAction = null;
let titleU = 0;               // the title pan, 0 (stars) .. 1 (the map at its top)
let mapUpSince = -1;          // scene time the map covered the level (-1: it doesn't)
migrateSaves();   // once, before the save is read: old shrine solves move to their levels
const solvedStore = JSON.parse(localStorage.getItem('strata.solved') || '{}');

// ---------------------------------------------------------------- puzzles

function puzzleList() {
  return SHAPES.map((s, i) => {
    // where this level sits in its chapter sets its time of day
    const mates = SHAPES.filter((o) => o.chapter === s.chapter);
    const k = mates.indexOf(s), t = mates.length > 1 ? k / (mates.length - 1) : 0.5;
    const base = PALETTES.find((p) => p.name === s.palette) ?? PALETTES[i % PALETTES.length];
    return { shape: s, palette: variant(base, t, i + 1), number: i + 1 };
  });
}

// A level left half-done is kept: its chisels, marks, mistakes, undo and time
// come back when it's opened again, after a quit or a restart. Levels and
// shrines only (not lessons, the logo or a drift), the 8 most recent.
const PROGRESS_KEY = 'strata.progress', PROGRESS_KEEP = 8;
const keepsProgress = (g) => !!g && !g.entry.lesson && g.shape.id !== 'logo' && !g.shape.id.startsWith('random');
function readProgress() {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {}; } catch { return {}; }
}
function saveProgress() {
  const g = game;
  if (!keepsProgress(g) || g.solved) return;
  const all = readProgress();
  const on = (a) => a.reduce((o, v, i) => (v && o.push(i), o), []);
  all[g.shape.id] = { b: on(g.broken), p: on(g.painted), u: g.undo.map((u) => [u.kind === 'break' ? 1 : 0, u.i]),
    m: g.mistakes, t: Math.round(((g.pausedAt ?? now()) - g.start) * 10) / 10, at: Date.now() };
  const ids = Object.keys(all).sort((a, b) => all[b].at - all[a].at);
  for (const id of ids.slice(PROGRESS_KEEP)) delete all[id];
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(all)); } catch { /* storage full: the level just starts fresh */ }
}
function clearProgress(id) {
  const all = readProgress();
  if (!(id in all)) return;
  delete all[id];
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
}
function restoreProgress(g) {
  if (!keepsProgress(g)) return;
  const saved = readProgress()[g.shape.id];
  if (!saved) return;
  const n = g.puzzle.size, ok = (i) => Number.isInteger(i) && i >= 0 && i < n;
  // a stale save (the level changed shape since) is dropped, not half-applied
  if (![...saved.b, ...saved.p].every(ok) || saved.b.some((i) => g.puzzle.solid[i])) { clearProgress(g.shape.id); return; }
  for (const i of saved.b) { g.broken[i] = 1; cubes.setState(i, undefined, undefined, 0); }
  for (const i of saved.p) { g.painted[i] = 1; cubes.setState(i, 1, 0); }
  g.undo = (saved.u ?? []).filter(([, i]) => ok(i)).map(([k, i]) => ({ kind: k ? 'break' : 'paint', i }));
  g.mistakes = saved.m | 0;
  g.start = now() - (saved.t || 0);
  g.restored = true;
  mark(`level: ${g.shape.id} resumed (${saved.b.length} chiselled, ${saved.t}s)`);
}
// the clock stops while the app is away (in the background, or the phone locked)
document.addEventListener('visibilitychange', () => {
  if (!game || game.solved || game.pausedAt != null) return;   // paused: its clock already stands still
  if (document.hidden) { game.away = now(); saveProgress(); }
  else if (game.away != null) { game.start += now() - game.away; game.away = null; }
});

// quiet: a backdrop (behind the title or map at launch) - no sound, already
// whole unless `assemble` asks for the silent build
function startPuzzle(entry, { quiet = false, assemble = false, introSpeed = 1 } = {}) {
  const { shape, palette } = entry;
  const { solid, colors } = buildCells(shape);
  const puzzle = new Puzzle(shape.dims, solid, colors);
  setClues(puzzle, shape);   // a curated clue set where a level has one (docs/aha-study.md)

  game = {
    entry, shape, puzzle, palette,
    broken: new Uint8Array(puzzle.size),
    painted: new Uint8Array(puzzle.size),
    undo: [], mistakes: 0, start: now(), elapsed: 0, solved: false, revealStart: -1,
    ghost: entry.lesson ? shape.ghost ?? 0 : 0,   // the first lessons let the hidden object show through
  };
  if (!entry.lesson) tutorial = null;
  lessonNext = null;
  resetCoaching(entry, quiet);

  if (!cubes.mesh || !cubes.mesh.parent) scene.add(cubes.build(puzzle));
  else cubes.build(puzzle);
  restoreProgress(game);   // after the build: it resets every cube's state
  applyPalette(palette);
  sound.setKey(palette.base ?? palette.name);

  const [X, Y, Z] = shape.dims;
  viewRadius = 0.5 * Math.hypot(X, Y, Z) + 1.1;
  motes.uniforms.uBox.value = viewRadius * 4;
  peel.axis = 0; peel.side = 1;
  setPeeled(0, true);
  peel.keepVisual = X;
  cubes.uniforms.uPeel.value.set(0, X, 1);

  controls.autoRotate = false;
  controls.target.set(0, 0, 0);
  for (const r of winRings) r.mesh.visible = false;
  $('#win-title').classList.remove('show');
  document.body.classList.remove('solved');
  finale.hide();
  fragments.clear();
  handles.reset();
  clearResult();
  $('#actions').classList.remove('show');
  // look square-on at the broad face of flat puzzles, isometric otherwise
  game.homeAz = shape.view ?? (Z < X * 0.6 ? 0.42 : X < Z * 0.6 ? Math.PI / 2 - 0.42 : Math.PI / 4);
  game.homeEl = 0.56;
  placeCamera(game.homeAz, game.homeEl);
  camera.zoom = 1;
  viewAnim = null;
  resize();
  controls.update();

  // a lesson's object is a mystery until it's uncovered, as a level's is
  $('#pz-name').textContent = entry.lesson ? '?' : solvedStore[shape.id] ? shape.name : entry.bonus ? '✦ Shrine' : `No. ${entry.number ?? '—'}`;
  $('#pz-meta').textContent = entry.lesson
    ? `lesson ${entry.lesson} of ${TUTORIAL.length}`
    : shape.chapter ?? (shape.id.startsWith('random') ? 'Drift' : palette.name);
  updateStrikes();
  show('#menu', false);
  show('#win', false);
  renderCoach();
  closeOffer();
  renderRewind();
  // the first step into a chapter: its card is held on its own sky first, and
  // the block assembles as it leaves
  // a shrine always has its card held: "✦ The Shrine of …", with its bells
  const atShrine = !quiet && !!entry.bonus;
  const hold = !quiet && !entry.lesson && (atShrine || chapterUnseen(entry)) && !reduceMotion ? DUR.ceremony * (atShrine ? 1.6 : 1) : 0;
  if (atShrine) { shrineCard(entry, hold ? (introDelay + hold) * 1000 / motionRate : 0); sound.shrine(introDelay); }
  else maybeChapterCard(entry, hold ? (introDelay + hold) * 1000 / motionRate : 0);

  // the block assembles itself: cubes drop into place from the base up, then a
  // soft wave runs through the finished stone; taps wait until it's whole
  // (after a map dive, it waits for the veil to lift so the whole drop is seen)
  const still = reduceMotion || (quiet && !assemble);
  const t0 = now() + introDelay + hold;
  cubes.uniforms.uIntro.value = still ? -99 : t0;
  cubes.uniforms.uIntroSpeed.value = introSpeed;
  game.introEnd = still ? 0 : t0 + INTRO_TIME / introSpeed;
  if (game.restored) refreshAO(); else refreshFocus();
  if (!quiet) {
    sound.intro(Y, reduceMotion ? 0 : INTRO_TIME, introDelay + hold);
    cubes.ripple([(X - 1) / 2, -2, (Z - 1) / 2], t0 + (reduceMotion ? 0 : INTRO_TIME - 0.15), 1.2, 6);
  }
  if (quiet && !assemble) handles.setShown(true, -99);   // already in place, no pop
  mark(`level: ${shape.id}${quiet ? ' (quiet)' : ''}`);
  rayBoost = 1;
  draw();
}

// The first time you step into a chapter, its title card rises over the
// block for a breath: numeral, name, one line. Tap to let it go.
const chapterCard = $('#chapter-card');
let chapterCardTimer = 0;
function chapterUnseen(entry) {
  const ch = CHAPTERS.find((c) => c.name === entry.shape.chapter);
  return !!ch && !JSON.parse(localStorage.getItem('strata.chapters') || '[]').includes(ch.name);
}
// holdMs: the block waits this long for the card (0: the card shows over the block)
function maybeChapterCard(entry, holdMs = 0) {
  const ch = !entry.lesson && CHAPTERS.find((c) => c.name === entry.shape.chapter);
  if (!ch) return;
  // wait a beat: boot starts a puzzle quietly behind the title, which isn't entering it
  setTimeout(() => {
    if (game?.entry !== entry || $('#menu').classList.contains('show') || $('#title').classList.contains('show')) return;
    const seen = JSON.parse(localStorage.getItem('strata.chapters') || '[]');
    if (seen.includes(ch.name)) return;
    seen.push(ch.name);
    localStorage.setItem('strata.chapters', JSON.stringify(seen));
    chapterCard.classList.remove('shrine');
    chapterCard.querySelector('.numeral').textContent = ch.numeral;
    chapterCard.querySelector('.cname').textContent = ch.name;
    chapterCard.querySelector('.cline').textContent = ch.line;
    chapterCard.classList.remove('show'); void chapterCard.offsetWidth;
    chapterCard.classList.add('show');
    clearTimeout(chapterCardTimer);
    chapterCardTimer = setTimeout(() => chapterCard.classList.remove('show'), holdMs ? holdMs + 150 : 2900);
  }, 60);
}
// A shrine's card, every time you step into one: the same card in gold
function shrineCard(entry, holdMs = 0) {
  const ch = CHAPTERS.find((c) => c.name === entry.shape.chapter);
  setTimeout(() => {
    if (game?.entry !== entry || $('#menu').classList.contains('show')) return;
    chapterCard.classList.add('shrine');
    chapterCard.querySelector('.numeral').textContent = '✦ The Shrine of ✦';
    chapterCard.querySelector('.cname').textContent = ch?.name ?? entry.shape.chapter;
    chapterCard.querySelector('.cline').textContent = 'Kept for those who earned its light.';
    chapterCard.classList.remove('show'); void chapterCard.offsetWidth;
    chapterCard.classList.add('show');
    mark('shrine: card');
    clearTimeout(chapterCardTimer);
    chapterCardTimer = setTimeout(() => chapterCard.classList.remove('show'), holdMs ? holdMs + 150 : 2900);
  }, 60);
}
chapterCard.addEventListener('click', () => {
  clearTimeout(chapterCardTimer);
  chapterCard.classList.remove('show');
  // tapping the card lets the block come now rather than wait out the hold
  if (game && now() < cubes.uniforms.uIntro.value) {
    cubes.uniforms.uIntro.value = now();
    game.introEnd = now() + INTRO_TIME / cubes.uniforms.uIntroSpeed.value;
  }
});

function applyPalette(p) {
  const a = p.lightAngle ?? 0, c = Math.cos(a), s = Math.sin(a);
  cubes.uniforms.uLight.value.set(-0.45 * c - 0.9 * s, -0.45 * s + 0.9 * c).normalize();
  const dark = new THREE.Color(p.skyTop).getHSL({}).l < 0.35;
  cubes.setPalette(p);
  fragments.setPalette(p);
  ash.setPalette(p);
  background.setPalette(p);
  rays.setPalette(p, dark);
  motes.setPalette(p);
  handles.setPalette(p);
  document.body.classList.toggle('dark', dark);
  const sky = '#' + new THREE.Color(p.skyTop).lerp(new THREE.Color(p.skyBottom), 0.4).getHexString();
  document.documentElement.style.setProperty('--sky', sky);
  if (!dark) document.documentElement.style.setProperty('--ink', '#' + new THREE.Color(p.under).multiplyScalar(0.8).getHexString());
  else document.documentElement.style.removeProperty('--ink');
  // the page behind the canvas wears the sky too, so no edge can ever show a seam
  document.documentElement.style.backgroundColor = '#' + new THREE.Color(p.skyBottom).getHexString();
  document.querySelector('meta[name=theme-color]').content = '#' + new THREE.Color(p.skyTop).getHexString();
}

// ---------------------------------------------------------------- camera

const spherical = new THREE.Spherical();

function placeCamera(az, el) {
  camera.position.set(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el)).multiplyScalar(CAM_DIST);
}

function resetView() {
  if (!game) return;
  spherical.setFromVector3(camera.position.clone().sub(controls.target));
  let dTheta = game.homeAz - spherical.theta;
  dTheta = Math.atan2(Math.sin(dTheta), Math.cos(dTheta));   // shortest way round
  viewAnim = {
    t0: now(), theta0: spherical.theta, dTheta,
    phi0: spherical.phi, phi1: Math.PI / 2 - game.homeEl, zoom0: camera.zoom,
    zoom1: game.win?.zoom ?? 1,
    target0: controls.target.clone(), target1: game.win?.target ?? new THREE.Vector3(),
    duration: game.win && !game.win.framed ? 1.1 : 0.7,
  };
  if (game.win) game.win.framed = true;
  buzz(8);
}

function stepViewAnim(t) {
  if (!viewAnim) return;
  const k = Math.min(1, (t - viewAnim.t0) / (reduceMotion ? 0.01 : viewAnim.duration));
  const e = 1 - Math.pow(1 - k, 3);
  spherical.set(CAM_DIST, viewAnim.phi0 + (viewAnim.phi1 - viewAnim.phi0) * e, viewAnim.theta0 + viewAnim.dTheta * e);
  controls.target.lerpVectors(viewAnim.target0, viewAnim.target1, e);
  camera.position.setFromSpherical(spherical).add(controls.target);
  camera.zoom = viewAnim.zoom0 + (viewAnim.zoom1 - viewAnim.zoom0) * e;
  camera.updateProjectionMatrix();
  if (k >= 1) viewAnim = null;
}

// ---------------------------------------------------------------- peel

function inPeel(i) {
  const p = game.puzzle.coords(i);
  const dim = game.puzzle.dims[peel.axis];
  const c = peel.side > 0 ? p[peel.axis] : dim - 1 - p[peel.axis];
  return c < dim - peel.peeled;
}

function present(i) { return !game.broken[i] && inPeel(i); }

function refreshAO() { cubes.updateAO(game.puzzle, present); refreshFocus(); }

// Switches the peel axis/side. Layers peeled on the old axis fold back in.
function setPeelAxis(axis, side) {
  if (axis === peel.axis && side === peel.side) return;
  const hadPeel = peel.peeled > 0;
  peel.axis = axis;
  peel.side = side;
  peel.peeled = 0;
  peel.keepVisual = game.puzzle.dims[axis];
  cubes.uniforms.uPeel.value.set(axis, peel.keepVisual, side);
  refreshAO();
  if (hadPeel) cubes.ripple(game.puzzle.dims.map((d) => (d - 1) / 2), now(), 0.6, 8);
}

function setPeeled(n, silent = false) {
  const dim = game.puzzle.dims[peel.axis];
  const next = Math.max(0, Math.min(dim - 1, Math.round(n)));
  const changed = next !== peel.peeled;
  peel.peeled = next;
  peel.keepVisual = dim - next;
  if (changed || silent) refreshAO();
  if (changed && !silent) { buzz(6); sound.peel(); poke(); if (next > 0) tutorialEvent('peel'); }
}

// ---------------------------------------------------------------- picking

const raycaster = new THREE.Raycaster();
const ndc = new THREE.Vector2();

// Walks the voxel grid along the view ray and returns the first present cell.
function pick(clientX, clientY) {
  if (!game) return -1;
  const r = canvas.getBoundingClientRect();
  ndc.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
  raycaster.setFromCamera(ndc, camera);
  const dims = game.puzzle.dims;
  const o = raycaster.ray.origin.toArray().map((v, a) => v + dims[a] / 2);
  const d = raycaster.ray.direction.toArray();
  let t0 = 0, t1 = Infinity;
  for (let a = 0; a < 3; a++) {
    if (Math.abs(d[a]) < 1e-9) { if (o[a] < 0 || o[a] > dims[a]) return -1; continue; }
    let ta = (0 - o[a]) / d[a], tb = (dims[a] - o[a]) / d[a];
    if (ta > tb) [ta, tb] = [tb, ta];
    t0 = Math.max(t0, ta); t1 = Math.min(t1, tb);
  }
  if (t0 > t1) return -1;
  const p = o.map((v, a) => v + d[a] * (t0 + 1e-5));
  const cell = p.map((v, a) => Math.min(dims[a] - 1, Math.max(0, Math.floor(v))));
  const step = d.map((v) => (v > 0 ? 1 : -1));
  const tMax = d.map((v, a) => (Math.abs(v) < 1e-9 ? Infinity : (cell[a] + (v > 0 ? 1 : 0) - p[a]) / v));
  const tDelta = d.map((v) => (Math.abs(v) < 1e-9 ? Infinity : Math.abs(1 / v)));
  for (let guard = 0; guard < 200; guard++) {
    const i = game.puzzle.idx(cell[0], cell[1], cell[2]);
    if (present(i)) {
      // remember where the ray met this cube, so its break can spread from the touch
      const c = cellWorld(i);
      const box = new THREE.Box3(c.clone().subScalar(0.5), c.clone().addScalar(0.5));
      lastTouch = { i, point: raycaster.ray.intersectBox(box, new THREE.Vector3()) ?? c };
      return i;
    }
    const a = tMax[0] < tMax[1] ? (tMax[0] < tMax[2] ? 0 : 2) : (tMax[1] < tMax[2] ? 1 : 2);
    cell[a] += step[a];
    if (cell[a] < 0 || cell[a] >= dims[a]) return -1;
    tMax[a] += tDelta[a];
  }
  return -1;
}

// The way out for a cube's pieces: the sum of the normals of its faces that
// have no cube beside them (toward the camera if somehow none are free).
function openSides(i) {
  const [x, y, z] = game.puzzle.coords(i), d = game.puzzle.dims;
  const out = new THREE.Vector3(), c = [x, y, z];
  for (let a = 0; a < 3; a++) for (const s of [-1, 1]) {
    const n = [...c]; n[a] += s;
    const inside = n[a] >= 0 && n[a] < d[a];
    if (!inside || !present(game.puzzle.idx(n[0], n[1], n[2]))) out.setComponent(a, out.getComponent(a) + s);
  }
  return out.lengthSq() ? out.normalize() : camDir.clone();
}

function cellWorld(i) {
  const [x, y, z] = game.puzzle.coords(i);
  const d = game.puzzle.dims;
  return new THREE.Vector3(x - (d[0] - 1) / 2, y - (d[1] - 1) / 2, z - (d[2] - 1) / 2);
}

// ---------------------------------------------------------------- actions

// Haptics. Android: the Vibration API. iOS Safari has none, but toggling a
// native <input switch> gives one system tick (iOS 18+). iOS only honours it
// inside a gesture it trusts (touchend or click; not pointerup, where taps
// land here), so a tick asked for elsewhere waits for the touchend of the same
// touch. Patterns become a single tick. The element is made, clicked and
// removed each time, as the ios-haptics library does.
const iosHaptics = !navigator.vibrate && /iP(hone|ad|od)|Macintosh/.test(navigator.userAgent) && 'ontouchend' in document;
function iosTick() {
  const label = document.createElement('label');
  label.setAttribute('aria-hidden', 'true');
  label.style.display = 'none';
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.setAttribute('switch', '');
  label.appendChild(input);
  document.head.appendChild(label);
  label.click();
  label.remove();
}
let tickPending = 0, lastTick = 0;
function flushTick() {
  if (!tickPending) return;
  const t = performance.now();
  if (t - tickPending < 600 && t - lastTick > 35) { lastTick = t; iosTick(); }
  tickPending = 0;
}
if (iosHaptics) {
  document.addEventListener('touchend', flushTick, { capture: true, passive: true });
  document.addEventListener('click', flushTick, { capture: true });
}
function buzz(pattern) {
  if (navigator.vibrate) { navigator.vibrate(pattern); return; }
  if (!iosHaptics) return;
  const type = window.event?.type;
  if (type === 'click' || type === 'touchend') {           // already inside a trusted gesture
    const t = performance.now();
    if (t - lastTick > 35) { lastTick = t; iosTick(); }
  } else {
    tickPending = performance.now();                        // fires on this touch's touchend
  }
}

const INTRO_TIME = 0.7;   // the level-start assembly (shader: delays ≤ 0.38 s + 0.3 s fall)

function finishIntro() {
  cubes.uniforms.uIntro.value = -99;
  game.introEnd = now();
  chapterCard.classList.remove('show');
  mark('level: assembly skipped by a tap');
}

function act(i, which) {
  if (!game || game.solved || i < 0) return;
  poke();
  if (now() < (game.introEnd ?? 0)) finishIntro();   // don't make people wait: the block is whole at once
  const t = now();
  const cell = game.puzzle.coords(i);
  const p = game.palette;

  if (which === 'paint') {
    game.painted[i] ^= 1;
    cubes.setState(i, game.painted[i], t);
    game.undo.push({ kind: 'paint', i });
    cubes.ripple(cell, t, 0.45, 10);
    buzz(8);
    sound.mark(!!game.painted[i], markStep);
    refreshFocus();
    saveProgress();
    if (game.painted[i]) tutorialEvent('paint');
    return;
  }

  if (game.painted[i]) {             // marked cubes are protected
    cubes.ripple(cell, t, 0.25, 12);
    cubes.setState(i, undefined, undefined, undefined, t - 0.35);
    buzz(4);
    sound.protectedTap();
    return;
  }

  if (game.puzzle.solid[i]) {        // wrong: it belongs to the shape
    game.mistakes++;
    (game.slips ??= []).push(i);   // the latest can be taken back (renderRewind)
    game.painted[i] = 1;
    cubes.setState(i, 1, t + 0.25, undefined, t);
    cubes.ripple(cell, t, 1.5, 9);
    rayBoost = Math.max(rayBoost, 0.5);
    buzz([30, 40, 30]);
    sound.mistake();
    updateStrikes();
    saveProgress();
    tutorialEvent('mistake');
    return;
  }

  game.broken[i] = 1;
  cubes.setState(i, undefined, undefined, t);
  game.undo.push({ kind: 'break', i });
  cubes.ripple(cell, t, 1, 7);
  const c = (h) => new THREE.Color(h);
  // it comes apart into 8 pieces that shrink away, starting where it was touched
  const from = lastTouch?.i === i ? lastTouch.point : cellWorld(i).addScaledVector(openSides(i), 0.5);
  fragments.burst(cellWorld(i), from, t);
  shards.burst(cellWorld(i), t, [c(p.top), c(p.lit), c(p.top)], reduceMotion ? 2 : 3, 0.3,
    { size: 0.4, life: 0.5, gravity: 1.2, spread: 0.85 });
  // and its ash splashes out of the face that was touched, then rises
  if (!reduceMotion) ash.burst(cellWorld(i), 30, from.clone().sub(cellWorld(i)).normalize(), c(p.lit));
  rayBoost = Math.max(rayBoost, 0.35);
  buzz(12);
  const pz = game.puzzle;
  let left = 0, total = 0;
  for (let k = 0; k < pz.size; k++) if (!pz.solid[k]) { total++; if (!game.broken[k]) left++; }
  sound.chisel(total ? 1 - left / total : 1);
  refreshAO();
  saveProgress();
  tutorialEvent('break');
  if (game.puzzle.isSolved(game.broken)) win();
}

function undo() {
  if (!game || game.solved) return;
  poke();
  const u = game.undo.pop();
  if (!u) return;
  const t = now();
  if (u.kind === 'break') {
    game.broken[u.i] = 0;
    cubes.setState(u.i, undefined, undefined, -1);
    refreshAO();
  } else {
    game.painted[u.i] ^= 1;
    cubes.setState(u.i, game.painted[u.i], t);
    refreshFocus();
  }
  cubes.ripple(game.puzzle.coords(u.i), t, 0.5, 9);
  buzz(6);
  sound.undo();
  saveProgress();
}

// The finale: the block holds its breath, the stone falls away to true colour
// under a band of light, the object leaps and whirls with confetti and a
// shockwave, lands with a hop that climbs it, then turns slowly on show.
function win() {
  const g = game;
  const t = now();
  mark('win');
  g.solved = true;
  renderRewind();
  g.elapsed = t - g.start;
  clearProgress(g.shape.id);
  g.revealStart = t + 0.3;
  setPeeled(0, true);
  cubes.uniforms.uHover.value.set(-99, -99, -99);
  cubes.uniforms.uWin.value = t;
  const d = g.puzzle.dims;

  // frame what's left, not the original block
  const focus = new THREE.Vector3(), cells = [];
  for (let i = 0; i < g.puzzle.size; i++) if (!g.broken[i]) cells.push(i);
  for (const i of cells) focus.add(cellWorld(i));
  focus.divideScalar(Math.max(1, cells.length));
  let radius = 0;
  for (const i of cells) radius = Math.max(radius, cellWorld(i).distanceTo(focus) + 0.87);
  // stage it: gems and score beneath the object (not for lessons)
  const box = new THREE.Box3().setFromCenterAndSize(focus, new THREE.Vector3(radius * 2, radius * 2, radius * 2));
  if (!g.entry.lesson) {
    // the gems and score sit beneath the object, clear of its turning sweep
    let bottom = Infinity, reach = 0;
    for (const i of cells) {
      const w = cellWorld(i);
      bottom = Math.min(bottom, w.y - 0.5);
      reach = Math.max(reach, Math.hypot(w.x - focus.x, w.z - focus.z) + 0.5);
    }
    // the number sits low in the sky, inside the rays: pick its ink against the lower sky
    const lowSky = new THREE.Color(g.palette.skyBottom).getHSL({}).l;
    const ink = lowSky > 0.45 ? '#' + new THREE.Color(g.palette.under).multiplyScalar(0.7).getHexString() : '#f6f3ff';
    finale.stage({ palette: g.palette, focus, bottom, reach, ink, t0: t });
  }
  // fit everything into the band between the title and the actions
  const sphere = box.getBoundingSphere(new THREE.Sphere());
  const H = canvas.clientHeight, pxPerUnit = H / (camera.top - camera.bottom);
  const bandTop = g.entry.lesson ? H * 0.2 : 54 + 104 + (g.shape.story ? 44 : 0);   // just under the title
  const bandBottom = g.entry.lesson ? H - 90 : H - 253;   // above the gems and score
  const band = Math.max(180, bandBottom - bandTop);
  const zoom = THREE.MathUtils.clamp((band / 2) / (sphere.radius * 0.92 * pxPerUnit), 0.5, 1.35);
  const shiftPx = H / 2 - (bandTop + bandBottom) / 2;
  const target = sphere.center.clone();
  target.y -= shiftPx / (pxPerUnit * zoom) / Math.cos(g.homeEl);
  // it whirls down onto the pose its map stone shows (thumbs use an azimuth of 45°), then holds still
  g.win = { t0: t, focus, target, zoom, framed: false, lesson: !!g.entry.lesson, pose: g.homeAz - Math.PI / 4 };
  document.body.classList.add('solved');   // the HUD steps aside; a lesson's too, for its name
  resetView();

  cubes.ripple([(d[0] - 1) / 2, (d[1] - 1) / 2, (d[2] - 1) / 2], t + 0.3, 2.2, 5);
  cubes.ripple([(d[0] - 1) / 2, -1, (d[2] - 1) / 2], t + 1.0, 1.4, 8);   // the landing
  rayBoost = 2.6;
  buzz([12, 50, 30, 908, 60]);   // the last pulse is the landing, 1.0 s in
  sound.win();
  $('#pz-name').textContent = g.shape.name;

  // confetti in the object's own colours, thrown from all over it
  const hues = [...new Set(cells.map((i) => g.puzzle.colors[i] || 0xffffff))].slice(0, 5).map((h) => new THREE.Color(h));
  hues.push(new THREE.Color(g.palette.rays));
  const bursts = reduceMotion ? 2 : g.entry.lesson ? 4 : 9;
  for (let k = 0; k < bursts; k++) {
    const at = cellWorld(cells[Math.floor(Math.random() * cells.length)]);
    shards.burst(at, t + 0.34 + k * 0.07, hues, g.entry.lesson ? 18 : 34, 1.7);
  }
  for (const r of winRings) {
    r.mesh.material.color.setHex(g.palette.rays);
    r.mesh.position.set(focus.x, -d[1] / 2 - 0.05, focus.z);
  }

  const flash = $('#flash');
  flash.classList.remove('go'); void flash.offsetWidth; flash.classList.add('go');

  // the payoff, lessons too: the object is named over it ("you uncovered ...")
  const title = $('#win-title');
  const letters = [...g.shape.name];
  const story = !g.entry.lesson && g.shape.story;
  title.innerHTML = '<span class="sub">you uncovered</span><span class="name' + (letters.length > 9 ? ' long' : '') + '">' +
    letters.map((ch, k) => `<span style="--k:${k}">${ch === ' ' ? '&nbsp;' : ch}</span>`).join('') + '</span>' +
    (story ? `<span class="story" style="--d:${(0.25 + letters.length * 0.055 + 0.7).toFixed(2)}s"></span>` : '');
  if (story) title.querySelector('.story').textContent = story;
  title.classList.remove('show'); void title.offsetWidth;
  after(1.1, () => { if (game === g) title.classList.add('show'); });

  if (g.entry.lesson) { tutorialEvent('solved'); return; }
  // a run of flawless solves feeds the streak bonus
  const streak = g.mistakes === 0 ? (Number(localStorage.getItem('strata.streak')) || 0) + 1 : 0;
  localStorage.setItem('strata.streak', String(streak));
  const result = scoreFor(g.shape, { mistakes: g.mistakes, time: g.elapsed, streak });
  const prev = solvedStore[g.shape.id];
  const isBest = !!prev && result.total > (prev.score ?? 0);
  if (!g.shape.id.startsWith('random')) {
    solvedStore[g.shape.id] = {
      time: Math.min(g.elapsed, prev?.time ?? Infinity),
      mistakes: Math.min(g.mistakes, prev?.mistakes ?? Infinity),
      stars: Math.max(result.stars, prev?.stars ?? 0),
      score: Math.max(result.total, prev?.score ?? 0),
    };
    localStorage.setItem('strata.solved', JSON.stringify(solvedStore));
  }
  // the ads' solve count
  ads.noteSolve();
  setTimeout(() => {
    if (game !== g) return;
    showResult(g, result, isBest);
  }, 1800);
}

// ---------------------------------------------------------------- tutorial

// docs/tutorial-study.md. A lesson's hints come one at a time, each held until
// its event. A hint with `wait` stays quiet until the player pauses that long
// or slips: the block is tried first, the words come only when needed. When a
// player is stuck (a lesson's `nudge`, or the first levels), a row that has a
// move glows; pausing longer, its cube breathes too. Nothing is ever forced.

let coachCard = null;     // a one-off line on a level: { text, until }
let idleFrom = 0;         // scene time of the player's last action
let nudge = null;         // the stuck hint showing: { level: 1 | 2, line, cell }
const NUDGE_LEVEL = 25;   // seconds of stillness on levels 1-3 before a row glows
const NUDGE_LESSON = 10;
// a solved lesson holds on its uncovered object, named, before the next stone;
// a tap moves on sooner, once the name has had time to land
const LESSON_PAYOFF = 3.6, LESSON_TAP_AFTER = 1.8;
let lessonNext = null;    // while a solved lesson is on show: move on now (if it's been long enough)

function startTutorial(step = 0) {
  tutorial = { step, hint: 0, open: !TUTORIAL[step].hints[0]?.wait };
  const lesson = TUTORIAL[step];
  const palette = PALETTES.find((p) => p.name === lesson.sky) ?? PALETTES[0];
  startPuzzle({ shape: lesson, palette, number: null, lesson: step + 1 });
}

// startPuzzle: a fresh block starts its coaching from rest
function resetCoaching(entry, quiet) {
  idleFrom = now();
  nudge = null;
  coachCard = null;
  // the first real stone: the rule newcomers most often misread, gone at the first chisel
  if (!quiet && !entry.lesson && entry.number === 1 && !solvedStore[entry.shape.id]) {
    coachCard = { text: 'Numbers now sit on three faces. Each counts the object’s cubes in its row: across, down or back.', until: 'break' };
  }
}

// a mouse has no hold: its other tool is a right-click, so a hint may say so
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const hintText = (h) => (finePointer && h?.mouse) || h?.text;

function currentHint() {
  return tutorial && game?.entry.lesson ? TUTORIAL[tutorial.step].hints[tutorial.hint] : null;
}

// anything the player does restarts the quiet clock and lets a nudge go
function poke() {
  idleFrom = now();
  if (nudge) { nudge = null; applyCues(); }
}

function tutorialEvent(kind) {
  if (coachCard && kind === coachCard.until) { coachCard = null; renderCoach(); }
  const h = currentHint();
  if (!h) return;
  if (kind === 'solved') {
    // the coach steps aside: the object's name is the only words now (win())
    tutorial.hint = TUTORIAL[tutorial.step].hints.length;   // past the last hint
    tutorial.open = true;
    renderCoach();
    const g = game, step = tutorial.step, t0 = now();
    const go = () => {
      if (game !== g || lessonNext !== next) return;
      lessonNext = null;
      if (step + 1 < TUTORIAL.length) startTutorial(step + 1);
      else finishTutorial();
    };
    const next = () => { if (now() - t0 >= LESSON_TAP_AFTER) go(); };
    lessonNext = next;
    after(LESSON_PAYOFF, go);
    return;
  }
  // a slip is the moment a held-back hint is worth reading
  if (kind === 'mistake' && !tutorial.open && h.until !== 'mistake') { tutorial.open = true; renderCoach(); }
  if (h.until !== kind) return;
  tutorial.hint++;
  tutorial.open = !currentHint()?.wait;
  renderCoach();
}

// Lessons done (or skipped): back to the map, where First Light's mist parts
// and the trail draws on to its first stone
function finishTutorial() {
  // a map never opened yet would count First Light as already seen (no parting)
  for (const key of ['strata.map.parted', 'strata.map.lit']) if (localStorage.getItem(key) === null) localStorage.setItem(key, '[]');
  localStorage.setItem('strata.tutorial', '1');
  tutorial = null;
  renderCoach();
  openMenu();
}

function renderCoach(override) {
  const coach = $('#coach');
  const lesson = !!(tutorial && game?.entry.lesson);
  // a solved lesson's object has the stage to itself (its name is over it)
  if ((!lesson && !coachCard) || (lesson && game.solved)) { coach.classList.remove('show'); applyCues(); return; }
  const h = currentHint();
  const text = override || (lesson ? (tutorial.open ? hintText(h) : '') : coachCard.text) || '';
  const was = $('#coach-text').textContent, wasShown = coach.classList.contains('show');
  $('#coach-text').textContent = text;
  $('#coach-dots').innerHTML = lesson ? TUTORIAL.map((_, k) =>
    `<i class="${k < tutorial.step ? 'done' : k === tutorial.step ? 'now' : ''}"></i>`).join('') : '';
  $('#coach-skip').hidden = !lesson;
  coach.classList.toggle('quiet', !text);     // between hints: just the dots and skip
  if (!wasShown || (text && text !== was)) {  // new words arrive; the same words stay put
    coach.classList.remove('show');
    void coach.offsetWidth;
    coach.classList.add('show');
  }
  applyCues();
}

// What the block and controls point at: the showing hint's cues, else a nudge.
function applyCues() {
  const h = tutorial && game?.entry.lesson && tutorial.open ? currentHint() : null;
  refreshFocus();
  document.querySelectorAll('.tool').forEach((b) =>
    b.classList.toggle('cue', !!h?.pulseTool && b.dataset.tool === h.pulseTool && tool !== h.pulseTool));
}

// The cubes the words are about, outlined in light (cubes.js setFocus): the
// row a number counts softly, the cube to act on more strongly. They arrive
// with the words (once the block is whole) and let go as the player acts:
// a chiselled cube goes, a marked one is released, the next hint moves them on.
// A stuck player's nudge uses the same light.
const FOCUS_ROW = 0.6, FOCUS_CUBE = 1;
function refreshFocus() {
  if (!game || game.introEnd === undefined) return;   // startPuzzle calls it once the assembly's timing is known
  const h = tutorial && game.entry.lesson && tutorial.open && !game.solved ? currentHint() : null;
  const p = game.puzzle;
  const lines = h ? [h.line, ...(h.lines ?? [])].filter(Boolean) : nudge?.line ? [nudge.line] : [];
  const cells = h ? [h.pulse, ...(h.focus ?? [])].filter(Boolean) : nudge?.level > 1 ? [nudge.cell] : [];
  const target = new Float32Array(p.size);
  for (const [axis, ...c] of lines) {
    for (let k = 0; k < p.dims[axis]; k++) { const q = [...c]; q[axis] = k; target[p.idx(...q)] = FOCUS_ROW; }
  }
  for (const c of cells) { const i = p.idx(...c); if (!game.painted[i]) target[i] = FOCUS_CUBE; }
  cubes.setFocus(p, present, target, Math.max(now(), game.introEnd ?? 0));
}

// seconds of stillness before a stuck player is shown a row (0: never here)
function nudgeAfter() {
  const e = game.entry;
  if (e.lesson) {
    const h = currentHint();
    if (!tutorial || !h) return 0;
    if (TUTORIAL[tutorial.step].nudge) return TUTORIAL[tutorial.step].nudge;
    // only once the lesson's own words are showing, and only if they point at nothing
    const quiet = !h.line && !h.pulse && !h.pulseTool && !h.pulseHandle;
    return tutorial.open && quiet && (h.until === 'solved' || h.until === 'break') ? NUDGE_LESSON : 0;
  }
  return e.number && e.number <= 3 && !solvedStore[e.shape.id] ? NUDGE_LEVEL : 0;
}

// The first move the clues allow from what the player has shown they know
// (chiselled cubes, correct marks): the row that proves a cube can go, and
// that cube. Deductions they haven't acted on are followed silently.
function findMove() {
  const p = game.puzzle;
  const state = new Uint8Array(p.size);
  for (let i = 0; i < p.size; i++) {
    if (game.broken[i]) state[i] = 2;
    else if (game.painted[i] && p.solid[i]) state[i] = 1;
  }
  // the earliest pass that frees a cube; of its moves, the one nearest the eye
  for (let pass = 0, changed = true; changed && pass < 64; pass++) {
    changed = false;
    let best = null, bestNear = -Infinity;
    for (const line of p.lines) {
      if (line.hidden) continue;
      const fit = lineFits(line, state);
      if (!fit) return null;
      for (let t = 0; t < line.cells.length; t++) {
        const c = line.cells[t];
        if (state[c]) continue;
        if (!((fit.or >> t) & 1)) {
          const near = cellWorld(c).dot(camDir);
          if (near > bestNear) { bestNear = near; best = { line: [line.axis, ...p.coords(c)], cell: p.coords(c) }; }
        } else if ((fit.and >> t) & 1) { state[c] = 1; changed = true; }
      }
    }
    if (best) return best;
  }
  return null;
}

// every frame: a held-back hint opens on a pause; a stuck player gets a nudge
function coachTick(t) {
  if (!game || game.solved || titleUp || t < (game.introEnd ?? 0)) return;
  if (document.querySelector('.overlay.show')) { idleFrom = t; return; }   // time away from the block doesn't count
  const idle = t - idleFrom;
  const h = currentHint();
  if (h && !tutorial.open && h.wait && idle > h.wait) { tutorial.open = true; renderCoach(); }
  const wait = nudgeAfter();
  const level = nudge?.level ?? 0;
  if (wait && level < 2 && idle > wait * (level + 1)) {
    const move = findMove();
    if (move) { nudge = { level: level + 1, ...move }; applyCues(); mark(`nudge ${nudge.level}`); }
    else idleFrom = t;   // nothing to point at: wait another while
  }
}

// ---------------------------------------------------------------- input

let press = null;
let drag = null;              // active handle drag
let lastEmptyTap = -1;
const activePointers = new Set();
const ring = $('#press-ring');

function otherTool() { return tool === 'break' ? 'paint' : 'break'; }

canvas.addEventListener('contextmenu', (e) => e.preventDefault());

// Capture phase so a handle grab never reaches OrbitControls.
canvas.addEventListener('pointerdown', (e) => {
  activePointers.add(e.pointerId);
  if (offerEl.classList.contains('show')) closeOffer();   // back to the block: the offer steps aside
  clearTimeout(press?.timer);
  ring.classList.remove('go');
  if (activePointers.size !== 1) { press = null; drag = null; return; }

  const rect = canvas.getBoundingClientRect();
  const it = game && !game.solved && handles.group.visible ? handles.hit(e.clientX, e.clientY, camera, rect, e.pointerType === 'mouse' ? 22 : 34) : null;
  if (it) {
    e.stopImmediatePropagation();
    canvas.setPointerCapture(e.pointerId);
    if (it.axis !== peel.axis || it.side !== peel.side) setPeelAxis(it.axis, it.side);
    drag = { it, x: e.clientX, y: e.clientY, start: peel.peeled, axis2d: handles.screenAxis(it, camera, rect) };
    handles.grabbed = it;
    controls.enabled = false;
    buzz(6);
    return;
  }

  press = { x: e.clientX, y: e.clientY, button: e.button, shift: e.shiftKey, moved: false, done: false };
  if (e.pointerType !== 'mouse') {
    ring.style.left = e.clientX + 'px';
    ring.style.top = e.clientY + 'px';
    void ring.offsetWidth;
    ring.classList.add('go');
    press.timer = setTimeout(() => {
      if (!press || press.moved) return;
      press.done = true;
      ring.classList.remove('go');
      act(pick(press.x, press.y), otherTool());
    }, 420);
  }
}, { capture: true });

canvas.addEventListener('pointermove', (e) => {
  if (drag) {
    const v = drag.axis2d;
    const len2 = v.lengthSq();
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    // project the finger's travel onto the handle's on-screen axis; inward = peel
    const units = len2 > 64 ? (dx * v.x + dy * v.y) / len2 : dy / 40;
    const dim = game.puzzle.dims[peel.axis];
    const f = Math.max(0, Math.min(dim - 1, drag.start - units));
    setPeeled(f);
    peel.keepVisual = dim - f;          // follow the finger between whole layers
    return;
  }
  if (press && Math.hypot(e.clientX - press.x, e.clientY - press.y) > 9) {
    press.moved = true;
    clearTimeout(press.timer);
    ring.classList.remove('go');
  }
  if (e.pointerType === 'mouse' && game && !e.buttons) {
    const onHandle = !game.solved && handles.group.visible && handles.hit(e.clientX, e.clientY, camera, canvas.getBoundingClientRect(), 22);
    canvas.style.cursor = onHandle ? 'grab' : '';
    const i = onHandle || game.solved ? -1 : pick(e.clientX, e.clientY);
    const h = cubes.uniforms.uHover.value;
    if (i >= 0) h.set(...game.puzzle.coords(i)); else h.set(-99, -99, -99);
  }
});

function endPointer(e, cancelled) {
  activePointers.delete(e.pointerId);
  ring.classList.remove('go');
  if (drag) {
    setPeeled(peel.peeled);
    peel.keepVisual = game.puzzle.dims[peel.axis] - peel.peeled;   // settle on a whole layer
    handles.grabbed = null;
    drag = null;
    controls.enabled = true;
    return;
  }
  if (!press) return;
  clearTimeout(press.timer);
  if (!cancelled && !press.moved && !press.done && game?.solved && lessonNext) {
    lessonNext();   // a solved lesson: on to the next, once its object has been named
  } else if (!cancelled && !press.moved && !press.done && game?.solved && resultFinish) {
    resultFinish();
  } else if (!cancelled && !press.moved && !press.done) {
    const i = pick(press.x, press.y);
    const which = press.button === 2 || press.shift ? otherTool() : tool;
    if (rowClearTap(press.x, press.y, which)) { /* the second tap of a double-tap on a shown 0: the row goes */ }
    else if (i < 0) {
      const t = now();
      if (t - lastEmptyTap < 0.35) { resetView(); lastEmptyTap = -1; } else lastEmptyTap = t;
    } else {
      const face = tappedLine(i);
      act(i, which);
      lastChiselTap = face && { ...face, which, t: now(), x: press.x, y: press.y };
    }
  }
  press = null;
}

// Double-tap a 0 to clear its row. Every face shows the clue of the line
// running straight in from it; if the tapped face's clue is shown and is 0,
// a second tap on the same spot (within DOUBLE_TAP and DOUBLE_TAP_PX) chisels the rest of the line, front to back,
// one cube after another. Each goes through act(), so undo, the save, the
// tutorial and the win all see ordinary chisels. Hidden or non-zero clues:
// the second tap is just a tap. A 0 line has no cube of the object, so this
// can never cause a slip.
const DOUBLE_TAP = 0.35, DOUBLE_TAP_PX = 30;
const ROW_CLEAR_STEP = 0.085;   // seconds between the first two cubes of the cascade (the one tuning dial)
const ROW_CLEAR_EASE = 0.93;    // each later gap is this much shorter, so the run gathers pace
let lastChiselTap = null;       // { line, axis, side, i, which, t, x, y }: the last tap on a cube, for a double-tap
let markStep = 0;               // the note of a mark in a marked row's run (audio.js mark)
let rowClearAt = -9;            // scene time of the last row clear (the browser's own dblclick must not reset the view)

// the face of cube i the last pick met (lastTouch), and the line straight in from it
function tappedLine(i) {
  if (lastTouch?.i !== i) return null;
  const d = lastTouch.point.clone().sub(cellWorld(i)).toArray();
  const axis = d.reduce((b, v, a) => (Math.abs(v) > Math.abs(d[b]) ? a : b), 0);
  return { line: game.puzzle.lineOf(i, axis), axis, side: d[axis] >= 0 ? 1 : -1, i };
}

function rowClearTap(x, y, which) {
  const prev = lastChiselTap;
  lastChiselTap = null;
  if (!prev || !game || game.solved || which !== prev.which) return false;
  if (now() - prev.t > DOUBLE_TAP || Math.hypot(x - prev.x, y - prev.y) > DOUBLE_TAP_PX) return false;
  const { line, axis, side } = prev;
  if (line.hidden) return false;
  // Mark: a row whose number equals the cubes still standing in it is all the
  // object's (a 5 in a row of 5, or a 3 with the rest chiselled): it is marked
  // whole, the mirror of the 0. Any other row: the second tap is just a tap.
  if (which === 'paint') {
    const standing = line.cells.filter((c) => !game.broken[c]).length;
    if (line.count === 0 || line.count !== standing) return false;
    markRow(line, axis, side, prev.i);
    return true;
  }
  if (line.count !== 0) return false;
  // the same spot is the same line: with its first cube gone, the ray there may
  // pass through the hole onto a neighbour, which is still this double-tap
  clearRow(line, axis, side, prev.i);
  return true;
}

function clearRow(line, axis, side, from) {
  const g = game, p = g.puzzle;
  const at = p.coords(from)[axis];
  // front to back: from the tapped face inward, then anything left behind it
  const key = (c) => { const k = (at - p.coords(c)[axis]) * side; return k >= 0 ? k : 1000 - k; };
  const cells = [...line.cells].filter((c) => !g.broken[c] && !g.painted[c] && inPeel(c)).sort((a, b) => key(a) - key(b));
  rowClearAt = now();
  mark(`row clear: ${cells.length} cubes`);
  if (!cells.length) return;
  // a ripple runs ahead through the row at the cascade's pace
  if (!reduceMotion) cubes.ripple(p.coords(from), now(), 1.3, 1 / ROW_CLEAR_STEP);
  let delay = 0, gap = ROW_CLEAR_STEP;
  cells.forEach((c, k) => {
    const go = () => {
      if (game !== g || g.solved || g.broken[c] || g.painted[c]) return;   // finished, left or marked meanwhile
      lastTouch = null;   // its pieces fly from its open sides
      act(c, 'break');
    };
    if (reduceMotion || k === 0) go();
    else after(delay, go);
    if (k > 0) gap = Math.max(0.045, gap * ROW_CLEAR_EASE);
    delay += gap;
  });
}
// the same cascade, marking: every standing cube of the row is the object's
function markRow(line, axis, side, from) {
  const g = game, p = g.puzzle;
  const at = p.coords(from)[axis];
  const key = (c) => { const k = (at - p.coords(c)[axis]) * side; return k >= 0 ? k : 1000 - k; };
  const cells = [...line.cells].filter((c) => !g.broken[c] && !g.painted[c] && inPeel(c)).sort((a, b) => key(a) - key(b));
  rowClearAt = now();
  mark(`row mark: ${cells.length} cubes`);
  if (!cells.length) return;
  if (!reduceMotion) cubes.ripple(p.coords(from), now(), 0.8, 1 / ROW_CLEAR_STEP);
  let delay = 0, gap = ROW_CLEAR_STEP;
  cells.forEach((c, k) => {
    const go = () => {
      if (game !== g || g.solved) return;
      if (!g.broken[c] && !g.painted[c]) { markStep = k + 1; act(c, 'paint'); markStep = 0; }
      if (k === cells.length - 1) tutorialEvent('markrow');   // after the last, so its paints don't move a later hint on
    };
    if (reduceMotion || k === 0) go();
    else after(delay, go);
    if (k > 0) gap = Math.max(0.045, gap * ROW_CLEAR_EASE);
    delay += gap;
  });
}
canvas.addEventListener('pointerup', (e) => endPointer(e, false));
canvas.addEventListener('pointercancel', (e) => endPointer(e, true));
canvas.addEventListener('pointerleave', () => cubes.uniforms.uHover.value.set(-99, -99, -99));
canvas.addEventListener('dblclick', (e) => { if (now() - rowClearAt > 0.6 && pick(e.clientX, e.clientY) < 0) resetView(); });

let rotateFrom = null;
controls.addEventListener('start', () => { rotateFrom = camera.position.clone(); viewAnim = null; });
controls.addEventListener('end', () => {
  if (rotateFrom && rotateFrom.angleTo(camera.position) > 0.25) { poke(); tutorialEvent('rotate'); }
  rotateFrom = null;
});

function setTool(t) {
  tool = t;
  $('.segmented').dataset.tool = t;
  document.querySelectorAll('.tool').forEach((b) => {
    const on = b.dataset.tool === t;
    b.classList.toggle('on', on);
    b.setAttribute('aria-checked', on);
  });
  applyCues();
}

document.querySelectorAll('.tool').forEach((b) => b.addEventListener('click', () => setTool(b.dataset.tool)));
$('#menu-btn').addEventListener('click', () => (pausable() ? openPause() : openMenu()));

// In a level the menu button stills the world: the stone rests, centred under a
// veil of its own sky, with where you are, a ring to resume, and Restart and Map
// beneath (docs/pause-study.md). The clock stops while it's up. A solved level,
// the title's logo, go straight to the map.
const pauseEl = $('#pause'), restartBtn = pauseEl.querySelector('[data-pause="restart"]');
const restartLabel = restartBtn.querySelector('.pause-label');
const pausable = () => !!game && !game.solved && game.shape.id !== 'logo' && !titleUp;
const begun = (g) => g.broken.some(Boolean) || g.painted.some(Boolean);
function openPause() {
  closeOffer();
  game.pausedAt = now();
  saveProgress();
  restartBtn.classList.remove('confirm');
  restartLabel.textContent = 'Restart';
  // where you are, as the HUD says it, without the clock
  pauseEl.querySelector('.pause-chapter').textContent = $('#pz-meta').textContent;
  pauseEl.querySelector('.pause-name').textContent = $('#pz-name').textContent;
  // the map is shut until the lessons are done; a lesson's only way out is skip
  pauseEl.querySelector('[data-pause="map"]').hidden = !!game.entry.lesson && !localStorage.getItem('strata.tutorial');
  show('#pause', true);
  mark('pause: open');
}
function closePause() {
  if (!pauseEl.classList.contains('show')) return;
  show('#pause', false);
  if (game?.pausedAt != null) { game.start += now() - game.pausedAt; game.pausedAt = null; }
}
function restartLevel() {
  const g = game;
  // a level with chisels in it asks once more: "Start over?"
  if (begun(g) && !restartBtn.classList.contains('confirm')) {
    restartBtn.classList.add('confirm');
    restartLabel.textContent = 'Start over?';
    return;
  }
  closePause();
  clearProgress(g.shape.id);
  mark(`pause: restart ${g.shape.id}`);
  if (g.entry.lesson) washInto(g.palette, () => startTutorial(g.entry.lesson - 1));
  else washInto(g.palette, () => startPuzzle(g.entry));
}
pauseEl.addEventListener('click', (e) => {
  const what = e.target.closest('[data-pause]')?.dataset.pause;
  if (what === 'restart') restartLevel();
  else if (what === 'map') { closePause(); saveProgress(); openMenu(); }
  else if (what === 'resume' || !e.target.closest('button')) closePause();   // or a tap anywhere else
});
window.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape' || !pauseEl.classList.contains('show')) return;
  e.stopImmediatePropagation();
  closePause();
}, true);
$('#map-help').addEventListener('click', () => { closeOffer(); renderSupport(); show('#help', true); });

// every level and bonus stone, each in its chapter's palette for the journal
function journalEntries() {
  const bonus = BONUS.map((shape, k) => {
    const base = PALETTES.find((p) => p.name === shape.palette) ?? PALETTES[0];
    return { shape, palette: variant(base, 1, 100 + k) };
  });
  return [...puzzleList(), ...bonus];
}
function openJournal() {
  renderJournal($('#journal'), { entries: journalEntries(), solved: solvedStore });
  $('#journal .jr-scroll').scrollTop = 0;
  show('#journal', true);
}
function closeJournal() { closeView(); show('#journal', false); }
$('#map-journal').addEventListener('click', openJournal);
$('#journal-close').addEventListener('click', closeJournal);
$('#journal-back').addEventListener('click', closeView);
window.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape' || !$('#journal').classList.contains('show')) return;
  e.stopImmediatePropagation();   // don't also close the map beneath
  if (viewOpen()) closeView(); else closeJournal();
}, true);
$('#help [data-close]').addEventListener('click', () => show('#help', false));
// How to play's pages; a mouse reads "right-click" where a finger reads "hold"
const helpTabs = [...document.querySelectorAll('#help [role="tab"]')];
function helpTab(k) {
  $('#help .tabs').dataset.tab = k;
  helpTabs.forEach((t, i) => {
    t.setAttribute('aria-selected', i === k);
    const page = $('#' + t.getAttribute('aria-controls'));
    if (i === k && page.hidden) { page.classList.remove('in'); void page.offsetWidth; page.classList.add('in'); }
    page.hidden = i !== k;
  });
}
helpTabs.forEach((t, i) => t.addEventListener('click', () => helpTab(i)));
if (finePointer) for (const dt of document.querySelectorAll('#help [data-mouse]')) dt.textContent = dt.dataset.mouse;
$('#coach-skip').addEventListener('click', finishTutorial);
function goNext() {
  clearResult();
  const list = puzzleList();
  const idx = list.findIndex((e) => e.shape.id === game.shape.id);
  if (game.entry.lesson) washInto(list[0].palette, () => startPuzzle(list[0]));
  else if (game.entry.bonus) { $('#actions').classList.remove('show'); resultToMap(); }   // shrines lead back to the map
  else if (idx >= 0) {
    const next = list[(idx + 1) % list.length];
    // the last stone of a chapter: the first time, go to the map to watch the next one's cloud part
    if (next.shape.chapter !== game.shape.chapter && !unveiled(next.shape.chapter)) { $('#actions').classList.remove('show'); resultToMap(); }
    else washInto(next.palette, () => startPuzzle(next));
  }
  else startRandom(game.shape.dims[0]);
}

function unveiled(chapter) {
  try { return (JSON.parse(localStorage.getItem('strata.map.parted')) ?? [chapter]).includes(chapter); } catch { return true; }
}

// Level -> next level: the screen washes into the next level's sky (not black,
// not a cut), the level is swapped under it, and the wash lifts as it assembles
function washInto(palette, start) {
  if (reduceMotion || diving) { start(); return; }
  diving = true;
  const hexOf = (h) => '#' + new THREE.Color(h).getHexString();
  veil.style.background = `linear-gradient(180deg, ${hexOf(palette.skyTop)}, ${hexOf(palette.skyBottom)})`;
  veil.classList.add('open', 'washing');
  mark('next: wash');
  after(0.26, () => {
    introDelay = 0.3;
    start();
    introDelay = 0;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      veil.classList.remove('washing');
      mark('next: wash lifts');
      after(0.5, () => { veil.classList.remove('open'); diving = false; });
    }));
  });
}
$('#win-menu').addEventListener('click', () => { clearResult(); show('#win', false); resultToMap(); });
$('#act-map').addEventListener('click', () => { clearResult(); $('#actions').classList.remove('show'); resultToMap(); });
$('#act-replay').addEventListener('click', () => { clearResult(); if (game) startPuzzle(game.entry); });
$('#act-next').addEventListener('click', goNext);
$('#win-next').addEventListener('click', () => { show('#win', false); goNext(); });
$('#map-close').addEventListener('click', () => { if (game && !game.solved) closeMenu(); });
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && game && $('#menu').classList.contains('show')) closeMenu();
});

window.addEventListener('keydown', (e) => {
  if (!game) return;
  const k = e.key.toLowerCase();
  const camSide = (a) => (camera.position.getComponent(a) >= 0 ? 1 : -1);
  if (k === 'z') undo();
  else if (k === 'b' || k === 'c') setTool('break');
  else if (k === 'p' || k === 'm') setTool('paint');
  else if (k === 'r') resetView();
  else if (k === '1' || k === '2' || k === '3') setPeelAxis(+k - 1, camSide(+k - 1));
  else if (k === ']' || k === 'arrowup') { setPeeled(peel.peeled + 1); }
  else if (k === '[' || k === 'arrowdown') { setPeeled(peel.peeled - 1); }
});

function startRandom(n) {
  const seed = Math.floor(Math.random() * 1e6) + 1;
  startPuzzle({ shape: randomShape(n, seed), palette: variant(PALETTES[seed % PALETTES.length], (seed % 97) / 96, seed), number: null });
}

// ---------------------------------------------------------------- UI

function show(sel, on) { $(sel).classList.toggle('show', on); }

function showWin(name, stats, nextLabel, sub = 'you uncovered') {
  clearResult();
  $('#win').classList.remove('result-mode');
  $('#win .plain .sub').textContent = sub;
  $('#win-name').textContent = name;
  $('#win-stats').textContent = stats;
  $('#win-next').textContent = nextLabel;
  show('#win', true);
}

// The result card: the score counts up line by line, then the stars land one
// at a time, then a "new best" stamp. A tap on the card skips to the end.
let resultTimers = [], resultFinish = null;
function clearResult() {
  resultTimers.forEach(clearTimeout);
  resultTimers = [];
  resultFinish = null;
}

function showResult(g, result, isBest) {
  clearResult();
  const at = (ms, fn) => resultTimers.push(setTimeout(() => { if (game === g) fn(); }, ms));
  const actions = $('#actions');
  actions.classList.remove('show');

  // the score carves itself into the plinth, climbing
  let anim = null, shown = 0;
  const countTo = (target, ms) => {
    const from = shown, t0 = performance.now();
    let lastTick = 0, ticks = 0;
    const step = (now2) => {
      const k = Math.min(1, (now2 - t0) / ms);
      shown = from + (target - from) * (1 - Math.pow(1 - k, 3));
      finale.setScore(shown, false);
      if (now2 - lastTick > 75 && k < 1) { lastTick = now2; sound.tick(ticks++); }
      if (k < 1) anim = requestAnimationFrame(step); else sound.tickDone();
    };
    anim = requestAnimationFrame(step);
  };
  finale.setScore(0, false);
  at(100, () => countTo(result.total, 1300));

  // then, one at a time, each earned gem fills its slot
  let t = 2300;
  for (let k = 0; k < result.stars; k++) {
    at(t, () => { finale.lightGem(k, now()); buzz(8); sound.star(k); rayBoost = Math.max(rayBoost, 0.5); });
    t += Math.round(BEAT * 1000);   // on the music's beat
  }
  if (isBest) at(t + 80, () => { finale.setScore(result.total, true); sound.best(); });
  at(t + 200, () => actions.classList.add('show'));

  resultFinish = () => {
    clearResult();
    cancelAnimationFrame(anim);
    finale.setScore(result.total, isBest);
    for (let k = 0; k < result.stars; k++) if (finale.gems[k].lit < 0) finale.lightGem(k, now() - 2);
    actions.classList.add('show');
  };
}

function fmt(s) {
  const m = Math.floor(s / 60), r = Math.floor(s % 60);
  return `${m}:${String(r).padStart(2, '0')}`;
}

function updateStrikes() {
  $('#strikes').textContent = game.mistakes ? '✕'.repeat(Math.min(game.mistakes, 5)) + (game.mistakes > 5 ? '+' : '') : '';
  renderRewind();
}

const DRIFT_SIZES = [6, 8, 10];

let stopReveal = () => {};
let mapRevealed = false;      // the stones cascade in the first time the map is seen each session, not every time
function renderMenu(scroll = true, celebrate = false, animate = scroll) {
  const entries = puzzleList();
  const done = entries.filter((e) => solvedStore[e.shape.id]).length;
  $('#map-progress').textContent = done ? `${done} of ${entries.length} uncovered` : `${entries.length} stones to uncover`;
  // the corner ✕ goes back to a level left part-way; a solved one (or the title's logo) has nothing to go back to
  $('#menu').classList.toggle('has-game', !!game && game.shape.id !== 'logo' && !game.solved);
  stopReveal();
  renderMap($('#map'), {
    entries,
    solved: solvedStore,
    learned: !!localStorage.getItem('strata.tutorial'),
    lessons: TUTORIAL.length,
    drift: DRIFT_SIZES,
    driftPalette: PALETTES.find((p) => p.name === 'Night') ?? PALETTES[PALETTES.length - 1],
    fmt,
    scroll,
    celebrate,
    onLearn: (el) => diveInto(el, PALETTES[0], () => startTutorial(0)),
    onDrift: (n, el) => diveInto(el, PALETTES.find((p) => p.name === 'Night') ?? PALETTES[0], () => startRandom(n)),
    onPlay: (entry, el) => { closeOffer(); diveInto(el, entry.palette, () => startPuzzle(entry)); },
    openedShrines: ads.openedShrines(),
    onShrineLocked: offerShrine,
    world: mapWorld,
    // a chapter's cloud parts: the music moves into its key, with a sweep; a bell as it clears
    onPart: (r) => { sound.setKey(r.base.name); sound.peel(); },
    onParted: () => sound.stone(3),
  });
  // stones and region names fade and rise in as they come into view (not on a
  // quiet re-layout, which would make the whole map blink)
  if (animate && !mapRevealed) {
    mapRevealed = true;
    stopReveal = reveal($('#map'), '.map-node, .map-region', { scroller: $('#menu .map-scroll') });
  }
}

// Level -> map: the map pulls back out of the stone you were playing, as if
// the camera were rising off it (the reverse of the dive in)
let menuMotion = 0;
function openMenu({ instant = false } = {}) {
  if (updateReady) { location.reload(); return; }
  const menu = $('#menu');
  const wasOpen = menu.classList.contains('show');
  mark(instant ? 'map: show (instant)' : 'map: open');
  if (instant) {
    menu.classList.add('instant');
    show('#menu', true);
    renderMenu(true, true);
    void menu.offsetWidth;
    menu.classList.remove('instant');
    return;
  }
  closeOffer();
  mapWorld.backdrop(game?.entry?.palette);
  show('#menu', true);
  renderMenu(true, true);
  if (reduceMotion || wasOpen) return;
  const vh = window.innerHeight;
  const onScreen = (el) => { const r = el?.getBoundingClientRect(); return r && r.bottom > 0 && r.top < vh ? r : null; };
  const r = onScreen(game && menu.querySelector(`.map-node[data-id="${game.shape.id}"]`)) ?? onScreen(menu.querySelector('.map-node.current'));
  menu.style.setProperty('--dive-x', r ? `${r.left + r.width / 2}px` : '50%');
  menu.style.setProperty('--dive-y', r ? `${r.top + r.height / 2}px` : '50%');
  clearTimeout(menuMotion);
  menu.classList.remove('leaving', 'settling');
  menu.classList.add('arriving');
  // start moving only once the freshly built map has painted (its thumbnails
  // decode on that first frame), so none of the motion is lost to the stall
  requestAnimationFrame(() => requestAnimationFrame(() => {
    if (!menu.classList.contains('arriving')) return;
    menu.classList.replace('arriving', 'settling');
    mark('map: pull back');
    menuMotion = after(0.76, () => menu.classList.remove('settling'));
  }));
}

// Map -> the level you were on: the map swells a touch and dissolves
function closeMenu() {
  if (game?.shape.id === 'logo') return;   // the title's logo isn't a level to go back to
  const menu = $('#menu');
  mark('map: close');
  show('#menu', false);
  if (reduceMotion) return;
  clearTimeout(menuMotion);
  menu.classList.remove('arriving', 'settling');
  menu.classList.add('leaving');
  menuMotion = after(0.5, () => menu.classList.remove('leaving'));
}

// Map -> level: the map swells toward the tapped stone while the level's own
// sky washes over it, the puzzle is carved behind that veil, then the veil lifts.
const veil = document.createElement('div');
veil.id = 'veil';
veil.setAttribute('aria-hidden', 'true');
const veilGlow = document.createElement('div');   // the portal's leading diamond, in the level's glow
veilGlow.id = 'veil-glow';
veilGlow.setAttribute('aria-hidden', 'true');
document.body.append(veilGlow, veil);
let diving = false;
function diveInto(el, palette, start) {
  if (diving) return;
  const hexOf = (h) => '#' + new THREE.Color(h).getHexString();
  if (reduceMotion || !el) {
    loading(true);
    requestAnimationFrame(() => requestAnimationFrame(() => { start(); loading(false); }));
    return;
  }
  diving = true;
  el.classList.add('tapped');
  const r = el.getBoundingClientRect(), menu = $('#menu');
  menu.style.setProperty('--dive-x', `${r.left + r.width / 2}px`);
  menu.style.setProperty('--dive-y', `${r.top + r.height / 2}px`);
  menu.classList.add('diving');
  veil.style.background = `radial-gradient(circle at ${r.left + r.width / 2}px ${r.top + r.height / 2}px, ${hexOf(palette.glow)}, ${hexOf(palette.skyTop)} 45%, ${hexOf(palette.skyBottom)})`;
  // the level's sky opens out of the stone like a portal
  for (const v of [veil, veilGlow]) {
    v.style.setProperty('--vx', `${r.left + r.width / 2}px`);
    v.style.setProperty('--vy', `${r.top + r.height / 2}px`);
  }
  veilGlow.style.background = palette.gild ? '#ffdc8c' : hexOf(palette.glow);   // a shrine's portal opens in gold
  mapWorld.backdrop(palette);   // the world swells away with the stones: its chapter's sea stays behind
  menu.classList.remove('arriving', 'settling', 'leaving');
  void veil.offsetWidth;   // commit the closed diamond at the stone first, so it opens from there
  for (const v of [veil, veilGlow]) v.classList.add('open', 'in');
  mark('dive: portal opens');
  after(0.46, () => {
    introDelay = 0.35;                 // the veil takes ~0.45 s to lift
    start();
    introDelay = 0;
    mark('dive: level built');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      for (const v of [veil, veilGlow]) v.classList.remove('in');
      mark('dive: veil lifts');
      after(0.5, () => { for (const v of [veil, veilGlow]) v.classList.remove('open'); });   // close the portal once it has faded
      // reset the (hidden) map only after the block has assembled: restyling the
      // whole map mid-animation dropped a frame on phones
      after(0.35 + INTRO_TIME + 0.25, () => { menu.classList.remove('diving'); diving = false; });
    }));
  });
}

// iOS fires resize mid-rotation with the old size, so lay the map out again
// once the screen has settled (otherwise it keeps the landscape width and
// shows only its right side back in portrait)
let settleTimers = [];
function relayout() {
  settleTimers.forEach(clearTimeout);
  const run = () => { resize(); if ($('#menu').classList.contains('show')) renderMenu(false); };
  run();
  settleTimers = [setTimeout(run, 250), setTimeout(run, 700)];
}
window.addEventListener('resize', relayout);
window.addEventListener('orientationchange', relayout);
window.visualViewport?.addEventListener('resize', relayout);

function loading(on) { $('#loading').textContent = on ? 'carving' : ''; }

// ---------------------------------------------------------------- render

const camDir = new THREE.Vector3();
const centerNdc = new THREE.Vector3();

function resize() {
  // measure the canvas itself: from the iOS home screen innerHeight stops short
  // of the home-indicator strip, while the canvas is sized to the whole screen
  const w = canvas.clientWidth || window.innerWidth, h = canvas.clientHeight || window.innerHeight;
  renderer.setSize(w, h, false);
  const aspect = w / h;
  const half = viewRadius * (aspect < 1 ? 1.1 / aspect : 1.15);
  camera.left = -half * aspect; camera.right = half * aspect;
  camera.top = half; camera.bottom = -half;
  camera.updateProjectionMatrix();
  const px = renderer.getPixelRatio();
  rays.setSize(w * px, h * px);
  mapWorld.setSize(w, h, px);
  background.uniforms.uAspect.value = aspect;
}

let last = now();
// Spin with a wind-up: ease back a touch, then flick into a fast whirl that
// decays to a slow turntable. The object turns about its own centre.
function stepCelebration(t) {
  const w = game.win, mesh = cubes.mesh;
  const age = t - w.t0;
  let angle = 0, lift = 0;
  if (!reduceMotion) {
    const windup = Math.min(1, age / 0.34);
    const s = Math.max(0, age - 0.34);
    const whirl = w.lesson ? Math.PI * 2 : Math.PI * 4;
    // the wind-up's -0.25 is folded into the settle, so it comes to rest exactly on the pose
    angle = -0.25 * Math.sin(windup * Math.PI / 2) + (whirl + w.pose + 0.25) * (1 - Math.exp(-s / 0.7));
    const leap = Math.min(1, s / 0.66);
    lift = 0.5 * Math.sin(Math.PI * leap) * (leap < 1 ? 1 : 0)
      + 0.09 * Math.sin((s - 0.66) * 1.5) * THREE.MathUtils.smoothstep(s, 0.66, 2.2);
  } else angle = w.pose;
  const c = Math.cos(angle), sn = Math.sin(angle);
  const fx = w.focus.x, fz = w.focus.z;
  mesh.rotation.y = angle;
  w.angle = angle;
  mesh.position.set(fx - (fx * c + fz * sn), lift, fz - (-fx * sn + fz * c));

  for (const r of winRings) {
    const a = (age - 0.34 - r.delay) / 1.5;
    r.mesh.visible = a > 0 && a < 1 && !reduceMotion;
    if (!r.mesh.visible) continue;
    const e = 1 - Math.pow(1 - a, 3);
    r.mesh.scale.setScalar(0.6 + viewRadius * 2.4 * e);
    r.mesh.material.opacity = 0.55 * (1 - a) * (1 - a);
  }
}

// one picture of the world; frame() runs it every display frame, and a level
// start runs it at once so the canvas never shows the old level after the page has moved on
function draw() {
  const t = now();
  const dt = Math.min(0.05, t - last);
  last = t;
  stepViewAnim(t);
  controls.update();

  if (game) {
    const u = cubes.uniforms;
    u.uTime.value = t;
    u.uPeel.value.y += (peel.keepVisual - u.uPeel.value.y) * Math.min(1, dt * (reduceMotion || drag ? 60 : 9));
    if (game.revealStart > 0) u.uReveal.value = Math.min(1, Math.max(0, (t - game.revealStart) / 1.5));
    // a lesson's ghost surfaces softly once the block is whole (at once under Reduce Motion)
    u.uGhost.value = game.ghost * (reduceMotion ? 1 : ease.out(Math.min(1, Math.max(0, (t - (game.introEnd ?? 0)) / DUR.ceremony))));
    // the tutorial outline breathes once every two beats of the music (on its
    // clock while it plays); under Reduce Motion it holds a steady glow
    const beatT = sound.ctx?.state === 'running' && motionRate === 1 ? sound.now - sound.clock0 : t;
    u.uBreath.value = reduceMotion ? 0.65 : 0.5 - 0.5 * Math.cos(Math.PI * beatT / BEAT);
    // and the rest of the stone settles into shade while it shows
    const dimTo = cubes.focusAny && !game.solved && t >= (game.introEnd ?? 0) ? 1 : 0;
    u.uFocusDim.value += (dimTo - u.uFocusDim.value) * Math.min(1, dt * (dimTo ? 2.5 : 4));
    if (!game.solved) {   // it stands still under an ad or the pause card
      // written only when the second turns: a text write every frame re-laid out the page each frame
      const clock = fmt((game.adAway ?? game.pausedAt ?? t) - game.start), timerEl = $('#timer');
      if (timerEl.textContent !== clock) timerEl.textContent = clock;
    }

    if (game.win) {
      stepCelebration(t);
      const H = canvas.clientHeight;
      finale.update(t, camera, H, H - 215, H - 154);   // gems, then score, above the actions
    }

    camDir.copy(camera.position).sub(controls.target).normalize();
    handles.group.visible = game.shape.handles !== false;
    handles.setShown(!game.solved && !titleUp && t >= (game.introEnd ?? 0), reduceMotion ? -99 : t);   // they pop in once the block is whole
    const handleCue = !!(tutorial?.open && currentHint()?.pulseHandle) && (reduceMotion ? 'still' : true);
    handles.layout(game.puzzle.dims, camDir, { ...peel, keepVisual: u.uPeel.value.y }, t, handleCue);
    coachTick(t);
  }
  rayBoost *= Math.exp(-dt * 1.6);
  ash.step(dt, t);
  // the sparks' light on the stone: the same vectors, shared each frame
  cubes.uniforms.uSparks.value = ash.lights; cubes.uniforms.uSparkCol.value = ash.lightColor;

  // shared time / scale uniforms
  const unitPx = renderer.domElement.height / ((camera.top - camera.bottom) / camera.zoom);
  motes.uniforms.uTime.value = shards.uniforms.uTime.value = fragments.uniforms.uTime.value = t;
  motes.uniforms.uUnitPx.value = shards.uniforms.uUnitPx.value = ash.uniforms.uUnitPx.value = unitPx;
  motes.uniforms.uFocus.value = camera.position.distanceTo(controls.target);
  background.uniforms.uTime.value = t;
  rays.uniforms.uTime.value = t;
  // the title's light slowly evolves; it eases back to the levels' steadier rays as the title goes
  rays.uniforms.uEvolve.value += ((titleUp ? 1 : 0) - rays.uniforms.uEvolve.value) * Math.min(1, dt * 1.5);
  // their clock is summed, not scaled: uTime * speed swept the shafts through minutes of motion as the speed eased
  rays.uniforms.uPhase.value += dt * (1 + 1.6 * rays.uniforms.uEvolve.value);
  const gain = game?.palette.rayGain ?? 1;
  rays.compUniforms.uIntensity.value = gain * (0.42 + rayBoost * 0.5 + 0.05 * Math.sin(t * 0.7));

  centerNdc.copy(game?.win ? game.win.focus : controls.target).project(camera);
  const cx = centerNdc.x * 0.5 + 0.5, cy = centerNdc.y * 0.5 + 0.5;
  rays.uniforms.uCenter.value.set(cx, cy);
  background.uniforms.uCenter.value.set(cx, cy);
  motes.uniforms.uCenter.value.set(cx, cy);

  // the title (until it has finished gliding away): no sky of our own, the
  // logo and its light stand on the map's world behind the canvas
  const onTitle = titleEl.classList.contains('show');

  // 1) silhouette -> outward rays
  if (game) {
    rays.render(renderer, () => {
      const vis = handles.group.visible;
      background.mesh.visible = motes.points.visible = shards.points.visible = ash.points.visible = handles.group.visible = false;
      const ringsOn = winRings.map((r) => r.mesh.visible);
      const finaleOn = finale.group.visible;
      finale.group.visible = fragments.mesh.visible = false;
      for (const r of winRings) r.mesh.visible = false;
      cubes.uniforms.uMask.value = 1;
      renderer.render(scene, camera);
      cubes.uniforms.uMask.value = 0;
      background.mesh.visible = motes.points.visible = shards.points.visible = ash.points.visible = true;
      handles.group.visible = vis;
      winRings.forEach((r, k) => { r.mesh.visible = ringsOn[k]; });
      finale.group.visible = finaleOn;
      fragments.mesh.visible = true;
    });
  }

  // 2) scene, 3) rays + vignette on top
  renderer.setRenderTarget(null);
  renderer.setClearColor(0x000000, 0);   // the rays' mask pass leaves an opaque black clear behind
  renderer.clear();
  // (the dust motes blend for an opaque sky; on the title the world's stars take their place)
  background.mesh.visible = motes.points.visible = !onTitle;
  renderer.render(scene, camera);
  background.mesh.visible = motes.points.visible = true;
  if (game) rays.composite(renderer);
}
// The world and the canvas: the world shows with the title or the map; the
// canvas fades out while the map is up (diving included: until the new level
// is built under the veil, the canvas only holds the old one), and the level
// stops drawing once it's hidden.
function frame() {
  const onTitle = titleEl.classList.contains('show');
  const mapUp = !onTitle && menuEl.classList.contains('show');
  const worldUp = onTitle || menuEl.classList.contains('show');
  document.body.classList.toggle('world-up', worldUp);
  document.body.classList.toggle('map-up', mapUp);
  document.body.classList.toggle('title-up', onTitle);   // style.css: plain classes, never body:has(), which re-styled every element each frame
  document.body.classList.toggle('menu-open', menuEl.classList.contains('show'));
  if (worldUp) mapWorld.setView(onTitle ? titleU : 1);   // the title's sky only: the map's scroll moves its world natively
  // the title's logo is never a level: if a race ever leaves it bare (no title,
  // no map), the map comes back
  if (game?.shape.id === 'logo' && !onTitle && !menuEl.classList.contains('show') && !diving && !pull.live && !pull.gliding && !ascent.live) {
    mark('title: logo left bare, back to the map');
    titleUp = false;
    openMenu({ instant: true });
  }
  const t = now();
  if (mapUp) { if (mapUpSince < 0) mapUpSince = t; } else mapUpSince = -1;
  if (onTitle && titleBegun) fl.resume(); else fl.pause();
  if (!(mapUp && t - mapUpSince > 0.6) && !onTitle) draw();
  requestAnimationFrame(frame);
}

// ---------------------------------------------------------------- sound

// Safari only lets audio start inside a gesture it trusts (touchend / click),
// so try on each of these; unlock() is a no-op once running
for (const ev of ['pointerdown', 'touchend', 'click', 'keydown']) {
  document.addEventListener(ev, () => sound.unlock(), { capture: true, passive: true });
}
// every control answers: map stones pluck a string, buttons tick
document.addEventListener('click', (e) => {
  const stone = e.target.closest('.map-node');
  if (stone) sound.stone([...document.querySelectorAll('.map-node')].indexOf(stone));
  else if (e.target.closest('button')) sound.ui();
}, { capture: true });
function renderSoundToggles() {
  $('#toggle-sfx').classList.toggle('on', sound.sfxOn);
  $('#toggle-music').classList.toggle('on', sound.musicOn);
}
$('#toggle-sfx').addEventListener('click', () => { sound.setSfx(!sound.sfxOn); renderSoundToggles(); });
$('#toggle-music').addEventListener('click', () => { sound.setMusic(!sound.musicOn); renderSoundToggles(); });
renderSoundToggles();

// ---------------------------------------------------------------- ads, a slip taken back, Remove Ads

// docs/ads-study.md. ads.js decides (every cap) and its provider shows; here
// are the moments: the breath and interstitial on the way from a result to
// the map, a slip taken back, a shrine opened by an ad, and Remove Ads.

// While an ad is up the game's sound stops, and a level's clock stands still.
ads.onAd((on) => {
  sound.hold(on);
  if (!game || game.solved) return;
  if (on) game.adAway = now();
  else if (game.adAway != null) { game.start += now() - game.adAway; game.adAway = null; }
});

function adContext(g) {
  const k = g.shape.chapter ? CHAPTERS.findIndex((c) => c.name === g.shape.chapter) : -1;
  return { lesson: !!g.entry.lesson, chapterIndex: k < 0 ? null : k };
}

// Result -> map (Map on the result, or leaving a shrine). If an interstitial
// may show: the stone's own sky washes in with plain words (C1), the ad, then
// the map's usual pull-back as the sky lifts. Never on Next or Replay.
let toMapBusy = false;
async function resultToMap() {
  const g = game;
  const placement = g?.entry.bonus ? 'shrine_to_map' : 'result_to_map';
  if (toMapBusy || !g?.solved || !ads.canShow(placement, adContext(g))) { if (!toMapBusy) openMenu(); return; }
  toMapBusy = true;
  try {
    const el = await breath(g.palette);
    await ads.showInterstitial(placement);
    openMenu();
    el.classList.remove('in');
    setTimeout(() => el.remove(), reduceMotion ? 0 : 500);
  } finally { toMapBusy = false; }
}

function breath(palette) {
  const hexOf = (h) => '#' + new THREE.Color(h).getHexString();
  const el = document.createElement('div');
  el.id = 'breath';
  el.setAttribute('role', 'status');
  el.style.background = `linear-gradient(180deg, ${hexOf(palette.skyTop)}, ${hexOf(palette.skyBottom)})`;
  el.innerHTML = '<p class="pause">a short ad,<br>then the map</p><div class="dots" aria-hidden="true"><i></i><i></i><i></i></div>';
  document.body.appendChild(el);
  mark('ads: breath');
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('in')));
  return new Promise((resolve) => setTimeout(() => resolve(el), ads.CONFIG.interstitial.breathSec * 1000 / motionRate));
}

// The small card. Only ever opened by a tap on the thing it's about.
function openOffer({ text, small = '', yes = null, onYes = null, onMap = false }) {
  offerEl.querySelector('.offer-text').textContent = text;
  offerEl.querySelector('.offer-small').textContent = small;
  const y = offerEl.querySelector('[data-yes]');
  y.hidden = !yes;
  y.textContent = yes ?? '';
  offerEl.classList.toggle('on-map', onMap);
  offerAction = onYes;
  offerEl.classList.remove('show'); void offerEl.offsetWidth;
  offerEl.classList.add('show');
}
function closeOffer() {
  offerEl.classList.remove('show');
  offerAction = null;
}
offerEl.querySelector('[data-no]').addEventListener('click', closeOffer);
offerEl.querySelector('[data-yes]').addEventListener('click', () => { const run = offerAction; closeOffer(); run?.(); });

// A slip taken back (Kellan, 2026-10-24; it replaced the hint lantern). In a
// level's empty top-right slot (not in lessons), only once there is a slip:
// an ad takes back the latest one, so a stone finished clean still earns all
// three stars. The cube stays marked (it does belong); only the slip goes.
// With Remove Ads it is taken back at once. A day's cap (ads.js CONFIG.rewind).
const rewindShown = () => !!game && !game.entry.lesson && game.shape.id !== 'logo' && !titleUp && !game.solved && game.mistakes > 0;
function renderRewind() {
  const on = rewindShown();
  if (on && rewindEl.hidden && !reduceMotion) { rewindEl.classList.remove('arrive'); void rewindEl.offsetWidth; rewindEl.classList.add('arrive'); }
  rewindEl.hidden = !on;
  if (on) rewindEl.setAttribute('aria-label', `Take back your last slip (${game.mistakes} so far)`);
}
function takeBackSlip(g) {
  if (game !== g || g.solved || g.mistakes <= 0) return;
  const i = g.slips?.pop();
  g.mistakes--;
  const t = now();
  if (i != null) {
    cubes.setState(i, undefined, undefined, undefined, -1);   // no longer a slip; still marked
    cubes.ripple(g.puzzle.coords(i), t, 0.6, 8);
  }
  mark(`rewind: a slip taken back (${g.mistakes} left)`);
  rewindEl.classList.add('glow');
  setTimeout(() => rewindEl.classList.remove('glow'), 1400);
  sound.stone(3);
  buzz(10);
  updateStrikes();
  saveProgress();
}
rewindEl.addEventListener('click', () => {
  if (!rewindShown()) return;
  if (now() < (game.introEnd ?? 0)) finishIntro();
  if (offerEl.classList.contains('show')) { closeOffer(); return; }
  const g = game, can = ads.rewindOffer();
  if (can && ads.adsRemoved()) { ads.noteRewind(); takeBackSlip(g); return; }
  openOffer({
    text: 'Take back your last slip?',
    small: can ? 'a clean stone keeps all three ◆' : 'that’s all for today',
    yes: can ? 'Watch an ad' : null,
    onYes: async () => {
      const ok = await ads.showRewarded('rewind');
      if (!ok) return;
      ads.noteRewind();
      takeBackSlip(g);
    },
  });
});

// A shrine locked only because its stars are short, on a chapter the trail has
// reached: tapping it offers to open it with an ad (for good, map.js reads it).
function offerShrine(s) {
  const id = s.entry.shape.id;
  if (!ads.shrineAdEligible({ ...s, opened: ads.openedShrines().has(id) })) return false;
  const free = ads.adsRemoved() || !ads.enabled();
  openOffer({
    text: `This shrine opens at ${s.need} stars.`,
    small: `${s.stars} gathered so far`,
    yes: free ? 'Open it' : 'Watch to open',
    onMap: true,
    onYes: async () => {
      if (!(await ads.showRewarded('shrine'))) return;
      ads.openShrine(id);
      mark(`shrine opened by ad: ${id}`);
      renderMenu(false, false, false);
      sound.stone(3);
    },
  });
  return true;
}

// Remove Ads, in How to play under the sound toggles
function renderSupport() { $('#support').classList.toggle('owned', ads.adsRemoved()); }
$('#remove-ads').addEventListener('click', async () => {
  if (await ads.buyRemoveAds()) { renderSupport(); renderRewind(); }
});
$('#restore-ads').addEventListener('click', async (e) => {
  const b = e.currentTarget;
  if (await ads.restorePurchases()) { renderSupport(); return; }
  b.textContent = 'nothing to restore';
  setTimeout(() => { b.textContent = 'restore purchase'; }, 1800);
});

function renderDevAds() {
  $('#dev-ads-state').textContent = ads.enabled() ? 'on' : 'off';
  const tn = localStorage.getItem('strata.titleName') || 'lines';
  $('#dev-titlename-state').textContent = tn === titleName ? tn : `${tn} (next launch)`;
  $('#dev-splashtest-state').textContent = localStorage.getItem('strata.splashTest') === 'shards' ? 'on (next launch)' : 'off';
  const tw = localStorage.getItem('strata.titleWall') || 'none';
  $('#dev-titlewall-state').textContent = (tw !== 'none') === titleWall ? tw : `${tw} (next launch)`;
}

// ---------------------------------------------------------------- developer panel

// Hidden on purpose: hold the version line in How to play (a quick tap still
// checks for updates), or tap the map's STRATA title five times.
const devPress = { timer: 0, opened: false };
function openDev() {
  devPress.opened = true;
  $('#dev-unlock-state').textContent = localStorage.getItem('strata.dev.unlock') === '1' ? 'on' : 'off';
  $('#dev .dev-version').textContent = $('#version').textContent;
  renderDevAds();
  show('#help', false);
  show('#dev', true);
  buzz(12);
}
$('#version').addEventListener('pointerdown', () => {
  devPress.opened = false;
  clearTimeout(devPress.timer);
  devPress.timer = setTimeout(openDev, 550);
});
for (const ev of ['pointerup', 'pointerleave', 'pointercancel']) $('#version').addEventListener(ev, () => clearTimeout(devPress.timer));
$('#version').addEventListener('contextmenu', (e) => e.preventDefault());
let titleTaps = [];
$('#map-progress').addEventListener('click', () => {   // (the map's name went; its progress line keeps the five taps)
  const t = performance.now();
  titleTaps = titleTaps.filter((x) => t - x < 1500).concat(t);
  if (titleTaps.length >= 5) { titleTaps = []; openDev(); }
});
$('#dev [data-close]').addEventListener('click', () => show('#dev', false));
$('#dev-slowmo-state').textContent = devFlags.slow ? 'on' : 'off';
$('#dev-motionlog-state').textContent = devFlags.log ? 'on' : 'off';
$('#dev-slowmo').addEventListener('click', () => devFlags.toggle('slow'));
$('#dev-motionlog').addEventListener('click', () => devFlags.toggle('log'));
$('#dev-unlock').addEventListener('click', () => {
  const on = localStorage.getItem('strata.dev.unlock') !== '1';
  localStorage.setItem('strata.dev.unlock', on ? '1' : '0');
  $('#dev-unlock-state').textContent = on ? 'on' : 'off';
  if ($('#menu').classList.contains('show')) renderMenu(false);
});
$('#dev-ads').addEventListener('click', () => { ads.setEnabled(!ads.enabled()); renderDevAds(); });
$('#dev-splashtest').addEventListener('click', () => {
  if (localStorage.getItem('strata.splashTest') === 'shards') localStorage.removeItem('strata.splashTest'); else localStorage.setItem('strata.splashTest', 'shards');
  renderDevAds();
});
$('#dev-titlewall').addEventListener('click', () => {
  localStorage.setItem('strata.titleWall', (localStorage.getItem('strata.titleWall') || 'none') === 'none' ? 'wall' : 'none');
  renderDevAds();
});
$('#dev-titlename').addEventListener('click', () => {
  const next = (localStorage.getItem('strata.titleName') || 'lines') === 'lines' ? 'negative' : 'lines';
  localStorage.setItem('strata.titleName', next);
  renderDevAds();
});
$('#dev-ads-reset').addEventListener('click', () => {
  ads.devReset();
  renderDevAds(); renderSupport(); renderRewind();
  if ($('#menu').classList.contains('show')) renderMenu(false);
});
$('#dev-tutorial').addEventListener('click', () => { show('#dev', false); show('#menu', false); startTutorial(0); });
$('#dev-reset').addEventListener('click', () => {
  if (!confirm('Reset all progress? Stars, scores and the journal will be cleared.')) return;
  for (const k of Object.keys(localStorage)) if (k.startsWith('strata.') && k !== 'strata.sfx' && k !== 'strata.music') localStorage.removeItem(k);
  location.reload();
});

// ---------------------------------------------------------------- add to home screen

// Opened from the Home Screen (iOS sets navigator.standalone; elsewhere the
// display mode says so). In a browser tab, a gentle card says why the app is
// better there and how to add it. iOS has no install API, so it points at
// Share; Chrome on Android offers a real one-tap install.
const installed = navigator.standalone === true || matchMedia('(display-mode: standalone)').matches;
document.body.classList.toggle('standalone', installed);
const isIOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && 'ontouchend' in document);
let installPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); installPrompt = e; maybeShowInstall(); });
const isAndroid = /Android/i.test(navigator.userAgent);
const isSamsung = /SamsungBrowser/i.test(navigator.userAgent);
let installTimer = 0;
function maybeShowInstall() {
  if (installed) return;
  const later = Number(localStorage.getItem('strata.install.later')) || 0;
  if (Date.now() - later < 3 * 24 * 3600 * 1000) return;     // asked again after three days
  if (!localStorage.getItem('strata.tutorial')) return;        // never over the lessons: asked on a later visit
  if (!isIOS && !isAndroid && !installPrompt) return;          // desktop without an install offer
  const card = $('#install');
  // steps for this browser; a real Install button whenever the browser offers one
  card.classList.toggle('ios', isIOS);
  card.classList.toggle('samsung', isSamsung);
  card.classList.toggle('android', isAndroid && !isSamsung);
  card.classList.toggle('can-install', !!installPrompt);
  clearTimeout(installTimer);
  installTimer = setTimeout(() => card.classList.add('show'), 1800);
}
$('#install-later').addEventListener('click', () => {
  localStorage.setItem('strata.install.later', String(Date.now()));
  $('#install').classList.remove('show');
});
$('#install-go').addEventListener('click', async () => {
  if (!installPrompt) return;
  installPrompt.prompt();
  await installPrompt.userChoice.catch(() => {});
  installPrompt = null;
  $('#install').classList.remove('show');
});
maybeShowInstall();

// ---------------------------------------------------------------- boot

ads.init();   // first: a fresh save marks this session its first (no interstitials in it)
renderSupport();
applyPalette(PALETTES[0]);
resize();
// The title: under the name, the logo makes itself - a whole 2x2x2 stone is
// there from the start, then its near top corner is chiselled away, as on the
// app icon.
// The title and the map are one tall page: swipe up and the title and logo
// scroll off the top while the map comes up from below (the touch also lets the
// sound start). The very first time, the swipe begins the first lesson instead.
const titleScreen = $('#title');
// The title is First light (js/firstlight/scene.js): it draws on its own
// canvas inside the title, so it scrolls away with it; the game's canvas (the
// old logo) stays hidden and undrawn while the title is up.
// the name's style: a constellation along the letters, or the letters left dark
// in a cloud of stars (developer panel, or ?name=negative)
const titleName = new URLSearchParams(location.search).get('name') || localStorage.getItem('strata.titleName') || 'lines';
// the wall under the stone: off by default (Kellan, 2026-10-25); developer panel "Title wall", or ?wall=on
const titleWall = (new URLSearchParams(location.search).get('wall') || localStorage.getItem('strata.titleWall') || 'none') !== 'none';
const fl = createFirstLight({ canvas: $('#firstlight'), hint: $('#fl-hint'), veil: $('#fl-night'), nameStyle: titleName, withWall: titleWall,
  onOpen: () => { sound.unlock(); sound.chisel(1); buzz(12); },   // the stone breaks as a block does
  onNamed: () => {
  titleScreen.classList.add('named');
  mark('title: the name is written');
} });
let titleBegun = false;
canvas.style.opacity = '0';
// Sound from the first moment it's allowed: phones only let a page make sound
// after a touch (on iPhone, a finger lifting), except where autoplay is granted
// (e.g. an Android Home Screen app) - so set the audio up now, and it plays
// straight away where it may, or from the first touch on the title otherwise.
sound.unlock();
const soundLive = () => sound.ctx?.state === 'running';
let welcomed = false;
const welcome = () => {   // the first sound of a launch: a soft bell as the music comes up
  if (welcomed || !soundLive()) return;
  welcomed = true;
  sound.stone(0);
  mark('title: sound on');
};
for (const ev of ['touchend', 'click', 'keydown']) {
  titleScreen.addEventListener(ev, () => { sound.unlock(); setTimeout(welcome, 30); }, { passive: true });
}
const LOGO = { id: 'logo', name: 'Strata', dims: [2, 2, 2], view: Math.PI / 4, handles: false, show: [0, 0, 0],
  cell: (x, y, z) => (x & y & z ? 0 : 0xffffff) };
const LOGO_CORNER = 7;   // (1, 1, 1): the corner nearest the camera
startPuzzle({ shape: LOGO, palette: PALETTES[0], number: null }, { quiet: true });
const CARVE_AT = 0.7;   // s after launch: long enough to see the whole stone first
mark('title');
function carveLogo() {
  if (game?.shape !== LOGO || game.broken[LOGO_CORNER]) return;
  const i = LOGO_CORNER, t = now();
  game.broken[i] = 1;
  cubes.setState(i, undefined, undefined, t);
  refreshAO();
  cubes.ripple(game.puzzle.coords(i), t, 1, 7);
  fragments.burst(cellWorld(i), cellWorld(i).add(new THREE.Vector3(0.5, 0.5, 0.5)), t);
  if (soundLive()) { sound.chisel(1); welcomed = true; }   // heard wherever the sound is already allowed
  mark('title: logo carved');
}
const beginTitle = () => { titleBegun = true; };   // First light starts (frame() resumes it)
// build the map only once the logo is done: building it (every stone's picture)
// stalls the page, which froze the carve on phones
let mapBuilt = false;
// it starts at its top: the title and the map are one page, so the swipe carries
// on into the map's head rather than jumping to the current stone
const buildMap = () => {
  if (mapBuilt) return;
  mapBuilt = true;
  renderMenu(false, false, false);
  mapSheet().scrollTop = 0;
  mark('title: map built');
  primeMap();
};
// The studio's card (index.html #splash) holds the screen while the heavy
// work happens behind it: the first frames are drawn (every shader compiled)
// and the whole map is built. Then it lifts - no sooner than its own little
// animation has played (SPLASH_HOLD), and on a quick relaunch at once - and
// the title begins under it, the logo carving as before.
const SPLASH_HOLD = 2.6;   // s: the card fades in (1.1 s) and holds
const splash = $('#splash');
if (splash) {
  requestAnimationFrame(() => requestAnimationFrame(() => {
    buildMap();
    const quick = splash.classList.contains('quick') || reduceMotion;
    const left = quick ? 0 : Math.max(0, SPLASH_HOLD * 1000 - (performance.now() - (window.splashT0 ?? 0)));
    setTimeout(() => {
      splash.classList.add('out');
      mark('splash: lifted');
      setTimeout(() => splash.remove(), 800);
      beginTitle();
    }, left);
  }));
} else {
  beginTitle();
  after(reduceMotion ? 0 : CARVE_AT + 0.6, buildMap);
}

// the scroll: k px up. The title moves with it, the logo too (by shifting the
// camera's view), and the map sheet follows from just below the screen.
const pull = { id: null, y0: 0, dy: 0, v: 0, lastY: 0, lastT: 0, live: false, k: 0, anim: 0 };
const toMap = () => !!localStorage.getItem('strata.tutorial');
const mapSheet = () => $('#menu .map-scroll');
const DESCENT = { first: 1.0, again: 0.75 };   // seconds for a whole descent (decision 2, docs/map-study.md)
const HAND_OFF = 0.9;   // of the descent's way: from here a touch lands on the map, not the title
function setScroll(k) {
  pull.k = k;
  titleU = Math.min(1, Math.max(0, k / window.innerHeight));
  const H = window.innerHeight;
  titleScreen.style.translate = `0 ${-k}px`;
  mapWorld.setView(titleU);   // the sky moves with the sheet in the same frame, or its edge shows mid-swipe
  // the logo's light is drawn over the sky; the map sheet would cut it off along its top
  // edge, so it fades as the logo leaves the screen
  const fade = Math.min(1, Math.max(0, (k / H - 0.4) / 0.45));
  canvas.style.transition = fade > 0 ? 'none' : '';
  canvas.style.opacity = fade > 0 ? (1 - fade * fade * (3 - 2 * fade)).toFixed(3) : '';
  if (titleUp) canvas.style.opacity = '0';   // First light is the title; the old logo stays hidden
  const w = canvas.clientWidth, h = canvas.clientHeight;
  if (k > 0.5) camera.setViewOffset(w, h, 0, k, w, h); else camera.clearViewOffset();
  if (toMap()) {
    const sheet = mapSheet();
    sheet.style.transform = $('#menu .map-backdrop').style.transform = `translateY(${H - k}px)`;
    // the soft top edge (style.css #menu.pulling) slides up out of the sheet as it arrives
    sheet.style.webkitMaskPosition = sheet.style.maskPosition = `0 ${(-0.3 * H * Math.min(1, k / H)).toFixed(1)}px`;
  }
}
// glide from the current scroll to `to` (px), then call done. Its clock counts
// drawn frames, each at most 1/30 s: a slow frame slows it rather than skipping
// ahead (a stall on the tap's first frame used to throw the page most of the way down)
function scrollTo(to, seconds, curve, done, onFrame) {
  cancelAnimationFrame(pull.anim);
  pull.gliding = true;
  const from = pull.k;
  let t = 0, last = performance.now() - 1000 / 60;
  const step = (now_) => {
    t += Math.min(1000 / 30, Math.max(0, now_ - last)); last = now_;
    const k = Math.min(1, (t / 1000) * motionRate / seconds);
    setScroll(from + (to - from) * curve(k));
    onFrame?.(k);
    if (k < 1) pull.anim = requestAnimationFrame(step); else { pull.gliding = false; done?.(); }
  };
  pull.anim = requestAnimationFrame(step);
}
// a glide cut short by a new touch: its ending never runs
function stopGlide() { cancelAnimationFrame(pull.anim); pull.gliding = false; }
// The map waits under the title, just below the screen, already laid out and
// painted: done on the tap's first frame instead, it stalled the descent's start
let mapPrimed = false;
function primeMap() {
  if (!toMap() || !titleUp || $('#menu').classList.contains('show')) return;
  buildMap();
  const menu = $('#menu');
  menu.style.transition = 'none';
  mapSheet().style.transition = 'none';
  menu.classList.add('pulling');   // its corner buttons wait until the map has arrived
  show('#menu', true);
  setScroll(pull.k);
  stopReveal();
  prepareReveal($('#map'), '.map-node, .map-region');
  mapPrimed = true;
  mark('title: map primed');
}
function startPull() {
  fl.dawn();   // leaving without opening the stone: the sky comes up quickly, not black
  pull.live = true;
  stopGlide();
  mark('title: pull');
  titleScreen.style.transition = 'none';
  if (!toMap() || ($('#menu').classList.contains('show') && !mapPrimed)) return;
  primeMap();
  if (!mapPrimed) return;
  mapPrimed = false;
  // the stones cascade in as the map comes up
  mapRevealed = true;
  stopReveal = reveal($('#map'), '.map-node, .map-region', { scroller: mapSheet(), prepared: true });
}
function finishPull() {
  if (!titleUp) return;
  titleUp = false;
  pull.live = false;
  mark('title: to ' + (toMap() ? 'map' : 'lesson'));
  sound.peel();
  const H = window.innerHeight;
  // the descent: about 1 s, lingering at the horizon (world.js); quicker if
  // this session has already seen it (an update reload). The lesson path keeps
  // the short glide: it isn't going to the map.
  const seen = sessionStorage.getItem('strata.descended') === '1';
  sessionStorage.setItem('strata.descended', '1');
  const left = 1 - pull.k / H;
  const seconds = !toMap() ? 0.5 : reduceMotion ? 0.01 : (seen ? DESCENT.again : DESCENT.first) * (0.35 + 0.65 * left);
  const landed = () => {
    menuEl.removeEventListener('pointerdown', handOff, true);
    // the logo has scrolled away: hide the canvas outright before its view offset
    // resets, or the logo pops back to the centre while the canvas fades out
    if (toMap()) { canvas.style.transition = 'none'; canvas.style.opacity = '0'; after(0.7, () => { canvas.style.transition = canvas.style.opacity = ''; }); }
    // to the first lesson: the glide faded the canvas out with the logo (setScroll);
    // hand it back to the stylesheet so it fades in on the lesson, or the lesson is played blind
    else canvas.style.transition = canvas.style.opacity = '';
    titleScreen.classList.remove('show');
    titleScreen.style.cssText = '';
    camera.clearViewOffset();
    titleUp = false;
    after(1.5, () => fl.finish());   // the sky finished while the map rests, so a pull back up finds it written (no stall on that touch)
    if (toMap()) { mapSheet().style.cssText = $('#menu .map-backdrop').style.cssText = ''; $('#menu').style.transition = ''; $('#menu').classList.remove('pulling'); show('#menu', true); }
  };
  // the last of the descent doesn't hold the player: the title lets touches
  // through to the map, and the first one lands it at once (a stone's tap or a
  // scroll then meets a settled map)
  const handOff = () => { if (!pull.gliding) return; stopGlide(); setScroll(H); mark('title: landed by a touch'); landed(); };
  scrollTo(H, seconds, toMap() ? ease.descent : ease.glide, landed, () => {
    if (!toMap() || pull.k < HAND_OFF * H || titleScreen.style.pointerEvents === 'none') return;
    titleScreen.style.pointerEvents = 'none';
    menuEl.addEventListener('pointerdown', handOff, true);
  });
  if (!toMap()) after(0.25, () => startTutorial(0));
}
function cancelPull(seconds = 0.35) {
  pull.live = false;
  scrollTo(0, seconds, ease.out, () => {
    if (pull.live || !titleUp) return;
    titleScreen.style.cssText = '';
    titleScreen.classList.add('show');
    // the map waits just below the screen again, primed for the next descent
    if (toMap() && $('#menu').classList.contains('show')) {
      stopReveal();
      prepareReveal($('#map'), '.map-node, .map-region');
      mapPrimed = true;
    }
  });
}
titleScreen.addEventListener('pointerdown', (e) => {
  if (!titleUp || pull.id !== null) return;
  pull.id = e.pointerId; pull.y0 = pull.lastY = e.clientY; pull.lastT = performance.now(); pull.dy = pull.v = 0;
  pull.y0 += pull.k;   // catch a scroll that is still springing back
  titleScreen.setPointerCapture?.(e.pointerId);
});
titleScreen.addEventListener('pointermove', (e) => {
  if (e.pointerId !== pull.id) return;
  const t = performance.now();
  pull.dy = pull.y0 - e.clientY;                                          // + is up
  pull.v = (pull.lastY - e.clientY) / Math.max(1, t - pull.lastT);         // px per ms, + is up
  pull.lastY = e.clientY; pull.lastT = t;
  if (!pull.live && pull.dy > 6) startPull();
  if (pull.live) setScroll(Math.max(0, pull.dy));
});
const endPull = (e) => {
  if (e.pointerId !== pull.id) return;
  pull.id = null;
  if (!pull.live) {   // a tap: the whole descent, as a full swipe would
    if (e.type === 'pointercancel' || Math.abs(pull.dy) > 10 || pull.gliding) return;   // (a swipe down isn't a tap)
    // First light: a tap opens the stone; while its light rises a tap waits;
    // once the name is written, a tap goes on as before (a swipe always does)
    if (!fl.named) { if (fl.tap(e.clientX, e.clientY)) sound.unlock(); return; }
    startPull();
    finishPull();
    return;
  }
  if (e.type !== 'pointercancel' && (pull.dy > window.innerHeight * 0.18 || pull.v > 0.5)) finishPull();
  else cancelPull();
};
titleScreen.addEventListener('pointerup', endPull);
titleScreen.addEventListener('pointercancel', endPull);

// And back up: at the top of the map, pull down and the title comes back down
// over it, the night sky and the logo with it - the same page, scrolled the other
// way. Let go past a fifth of the screen (or with a flick) and the title stays;
// short of it, the map settles back. A level left open is saved first (its
// progress resumes when it's next opened).
const ascent = { id: null, y0: 0, lastY: 0, lastT: 0, v: 0, live: false };
const atMapTop = () => !titleUp && !pull.gliding && toMap() && mapBuilt && !diving && $('#menu').classList.contains('show')
  && !$('#menu').classList.contains('arriving') && !$('#menu').classList.contains('settling') && mapSheet().scrollTop <= 0;
function beginAscent() {
  ascent.live = true;
  fl.finish();   // coming back, the sky is already written
  stopGlide();
  mark('title: pull back up');
  if (game?.shape !== LOGO) {
    saveProgress();
    titleUp = true;   // before the logo is set: no rewind, no HUD
    startPuzzle({ shape: LOGO, palette: PALETTES[0], number: null }, { quiet: true });
    game.broken[LOGO_CORNER] = 1;
    cubes.setState(LOGO_CORNER, undefined, undefined, 0);   // already carved
    refreshAO();
  }
  titleUp = true;
  const menu = $('#menu');
  menu.classList.add('instant');
  menu.style.transition = 'none';
  mapSheet().style.transition = 'none';
  menu.classList.add('pulling');
  show('#menu', true);   // startPuzzle hid it
  titleScreen.style.transition = 'none';
  titleScreen.classList.add('show');
  setScroll(window.innerHeight);
  void menu.offsetWidth;
  menu.classList.remove('instant');
}
function endAscent(cancelled) {
  if (!ascent.live) return;
  ascent.live = false;
  const H = window.innerHeight, down = H - pull.k;
  if (!cancelled && (down > H * 0.2 || ascent.v > 0.5)) {
    mark('title: back');
    cancelPull(reduceMotion ? 0.01 : 0.35 + 0.5 * (pull.k / window.innerHeight));   // the rest of the way to the title
  } else finishPull();   // not far enough: back down to the map
}
mapSheet().addEventListener('touchstart', (e) => {
  if (e.touches.length !== 1 || !atMapTop()) { ascent.id = null; return; }
  const t = e.touches[0];
  ascent.id = t.identifier; ascent.y0 = ascent.lastY = t.clientY; ascent.lastT = performance.now(); ascent.v = 0;
}, { passive: true });
mapSheet().addEventListener('touchmove', (e) => {
  if (ascent.id === null) return;
  const t = [...e.changedTouches].find((c) => c.identifier === ascent.id);
  if (!t) return;
  const dy = t.clientY - ascent.y0, now_ = performance.now();   // + is down
  ascent.v = (t.clientY - ascent.lastY) / Math.max(1, now_ - ascent.lastT);
  ascent.lastY = t.clientY; ascent.lastT = now_;
  if (!ascent.live) {
    if (dy < -6 || mapSheet().scrollTop > 0) { ascent.id = null; return; }   // a scroll down the map
    if (dy < 10) return;
    beginAscent();
  }
  e.preventDefault();   // the page follows the finger, not the scroller's bounce
  setScroll(Math.max(0, window.innerHeight - Math.max(0, dy - 10)));
}, { passive: false });
for (const ev of ['touchend', 'touchcancel']) mapSheet().addEventListener(ev, (e) => {
  if (ascent.id === null || ![...e.changedTouches].some((c) => c.identifier === ascent.id)) return;
  ascent.id = null;
  endAscent(e.type === 'touchcancel');
});
// a mouse or trackpad: scrolling on up past the top of the map goes back to the title
let wheelUp = 0, wheelAt = 0;
mapSheet().addEventListener('wheel', (e) => {
  if (e.deltaY >= 0 || !atMapTop()) { wheelUp = 0; return; }
  const t = performance.now();
  if (t - wheelAt > 400) wheelUp = 0;
  wheelAt = t;
  wheelUp -= e.deltaY;
  if (wheelUp < 240) return;
  wheelUp = 0;
  beginAscent();
  ascent.v = 1;   // as a flick: the whole way up
  endAscent(false);
}, { passive: true });
window.addEventListener('keydown', (e) => {
  if (!titleUp || !['Enter', ' ', 'ArrowUp'].includes(e.key)) return;
  startPull();
  finishPull();
});
requestAnimationFrame(frame);

// offline play: only over https (hosted build); the LAN dev server stays uncached
// Updates. A home-screen app is often resumed rather than reloaded, so look
// for a new version whenever it comes to the front, not just at launch. When a
// new version has taken over, reload at a calm moment (the map or the result
// screen), never in the middle of a puzzle. Tapping the version line in How to
// play checks right away.
function calmMoment() { return !ads.adShowing() && !$('#breath') && (!game || game.solved || $('#menu').classList.contains('show')); }
function applyUpdate() { if (updateReady && calmMoment()) location.reload(); }
// Inside the store apps (Capacitor) the files are already on the phone: no service worker
// (Android serves the app from https://localhost, which would otherwise register one)
const nativeApp = !!window.Capacitor?.isNativePlatform?.();
if (nativeApp) $('.home-tip')?.remove();   // "best on your Home Screen" is the web's advice
if ('serviceWorker' in navigator && location.protocol === 'https:' && !nativeApp && location.hostname !== 'localhost') {
  const hadController = !!navigator.serviceWorker.controller;
  // updateViaCache 'none': always fetch sw.js fresh; GitHub Pages lets browsers reuse it for 10 min
  navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then((reg) => {
    const check = () => reg.update().catch(() => {});
    document.addEventListener('visibilitychange', () => { if (!document.hidden) check(); });
    setInterval(check, 30 * 60 * 1000);
    $('#version').addEventListener('click', () => {
      if (devPress.opened) { devPress.opened = false; return; }   // that was a hold, not a tap
      $('#version').textContent = 'checking…';
      updateReady = true;                       // the user asked: apply as soon as it lands
      reg.update().then(() => {
        if (!reg.installing && !reg.waiting) setTimeout(() => location.reload(), 300);
      }).catch(() => location.reload());
    });
  }).catch(() => {});
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController) return;                 // first install, nothing to refresh
    updateReady = true;
    if ($('#version').textContent === 'checking…') location.reload(); else applyUpdate();
  });
}

// Tester's shortcut (Kellan, 2026-10-23): tap the stone's name five times,
// quickly, and it carves itself: every empty cube is chiselled, no mistakes.
{
  let taps = 0, last = 0;
  $('#pz-name').addEventListener('pointerdown', () => {
    const t = performance.now();
    taps = t - last < 600 ? taps + 1 : 1;
    last = t;
    if (taps < 5 || !game || game.solved) return;
    taps = 0;
    game.puzzle.solid.forEach((v, i) => { if (!v && !game.broken[i] && !game.solved) { game.painted[i] = 0; act(i, 'break'); } });
  });
}

// console hook for testing: strata.game, strata.act(i, 'break' | 'paint')
window.strata = { ads, poke, get game() { return game; }, get nudge() { return nudge; }, get tutorial() { return tutorial; }, get peel() { return peel; }, act, startTutorial, startPuzzle, journalEntries, setPeeled, setPeelAxis, resetView, handles, camera, cubes };
