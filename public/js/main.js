import * as THREE from 'three';
import { makeOrbit, SHOW_SPIN } from './orbit.js';
import { Puzzle, hideClues } from './puzzle.js';
import { SHAPES, BONUS, CHAPTERS, TUTORIAL, randomShape, buildCells } from './shapes.js';
import { PALETTES, variant } from './palettes.js';
import { scoreFor } from './score.js';
import { sound } from './audio.js';
import { Finale } from './finale.js';
import { Fragments } from './fragments.js';
import { Cubes } from './cubes.js';
import { Background, GodRays, Motes, Shards } from './atmosphere.js';
import { PeelHandles } from './handles.js';
import { renderMap } from './map.js';
import { renderJournal, closeView, viewOpen } from './journal.js';

// Palette hexes are display colours; pass them through untouched.
THREE.ColorManagement.enabled = false;

const $ = (s) => document.querySelector(s);
const canvas = $('#scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.autoClear = false;

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 400);
const controls = makeOrbit(camera, canvas);

const cubes = new Cubes();
const background = new Background();
const rays = new GodRays();
const motes = new Motes();
const shards = new Shards();
const handles = new PeelHandles(cubes.uniforms.uLight);
scene.add(background.mesh, motes.points, shards.points, handles.group);
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
let tutorial = null;          // { step, hint }
let updateReady = false;      // a new version has taken over; reload at a calm moment
let lastTouch = null;         // { i, point }: where the last pick met its cube
let introDelay = 0;           // set by the map dive so the block assembles once the veil has lifted
let viewAnim = null;
const clock0 = performance.now();
const now = () => (performance.now() - clock0) / 1000;

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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

// quiet: the block behind the map at launch - already whole, no sound
function startPuzzle(entry, { quiet = false } = {}) {
  const { shape, palette } = entry;
  const { solid, colors } = buildCells(shape);
  const puzzle = new Puzzle(shape.dims, solid, colors);
  if (shape.show) for (const line of puzzle.lines) line.hidden = !shape.show[line.axis];
  else hideClues(puzzle, shape.fraction ?? 0.85, shape.seed ?? 7);

  game = {
    entry, shape, puzzle, palette,
    broken: new Uint8Array(puzzle.size),
    painted: new Uint8Array(puzzle.size),
    undo: [], mistakes: 0, start: now(), elapsed: 0, solved: false, revealStart: -1,
  };
  if (!entry.lesson) tutorial = null;

  if (!cubes.mesh || !cubes.mesh.parent) scene.add(cubes.build(puzzle));
  else cubes.build(puzzle);
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

  $('#pz-name').textContent = entry.lesson ? shape.name : solvedStore[shape.id] ? shape.name : `No. ${entry.number ?? '—'}`;
  $('#pz-meta').textContent = entry.lesson
    ? `lesson ${entry.lesson} of ${TUTORIAL.length}`
    : shape.chapter ?? (shape.id.startsWith('random') ? 'Drift' : palette.name);
  updateStrikes();
  show('#menu', false);
  show('#win', false);
  renderCoach();
  maybeChapterCard(entry);

  // the block assembles itself: cubes drop into place from the base up, then a
  // soft wave runs through the finished stone; taps wait until it's whole
  // (after a map dive, it waits for the veil to lift so the whole drop is seen)
  const still = reduceMotion || quiet;
  const t0 = now() + introDelay;
  cubes.uniforms.uIntro.value = still ? -99 : t0;
  game.introEnd = still ? 0 : t0 + INTRO_TIME;
  if (!quiet) {
    sound.intro(Y, reduceMotion ? 0 : INTRO_TIME, introDelay);
    cubes.ripple([(X - 1) / 2, -2, (Z - 1) / 2], t0 + (reduceMotion ? 0 : INTRO_TIME - 0.15), 1.2, 6);
  }
  if (quiet) handles.setShown(true, -99);   // already in place, no pop
  rayBoost = 1;
  draw();
}

// The first time you step into a chapter, its title card rises over the
// block for a breath: numeral, name, one line. Tap to let it go.
const chapterCard = $('#chapter-card');
let chapterCardTimer = 0;
function maybeChapterCard(entry) {
  const ch = !entry.lesson && CHAPTERS.find((c) => c.name === entry.shape.chapter);
  if (!ch) return;
  // wait a beat: boot starts a puzzle quietly behind the map, which isn't entering it
  setTimeout(() => {
    if (game?.entry !== entry || $('#menu').classList.contains('show')) return;
    const seen = JSON.parse(localStorage.getItem('strata.chapters') || '[]');
    if (seen.includes(ch.name)) return;
    seen.push(ch.name);
    localStorage.setItem('strata.chapters', JSON.stringify(seen));
    chapterCard.querySelector('.numeral').textContent = ch.numeral;
    chapterCard.querySelector('.cname').textContent = ch.name;
    chapterCard.querySelector('.cline').textContent = ch.line;
    chapterCard.classList.remove('show'); void chapterCard.offsetWidth;
    chapterCard.classList.add('show');
    clearTimeout(chapterCardTimer);
    chapterCardTimer = setTimeout(() => chapterCard.classList.remove('show'), 2900);
  }, 60);
}
chapterCard.addEventListener('click', () => { clearTimeout(chapterCardTimer); chapterCard.classList.remove('show'); });

function applyPalette(p) {
  const a = p.lightAngle ?? 0, c = Math.cos(a), s = Math.sin(a);
  cubes.uniforms.uLight.value.set(-0.45 * c - 0.9 * s, -0.45 * s + 0.9 * c).normalize();
  const dark = new THREE.Color(p.skyTop).getHSL({}).l < 0.35;
  cubes.setPalette(p);
  fragments.setPalette(p);
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

function refreshAO() { cubes.updateAO(game.puzzle, present); }

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
  if (changed && !silent) { buzz(6); sound.peel(); if (next > 0) tutorialEvent('peel'); }
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

function act(i, which) {
  if (!game || game.solved || i < 0) return;
  if (now() < (game.introEnd ?? 0)) return;          // the block is still assembling
  const t = now();
  const cell = game.puzzle.coords(i);
  const p = game.palette;

  if (which === 'paint') {
    game.painted[i] ^= 1;
    cubes.setState(i, game.painted[i], t);
    game.undo.push({ kind: 'paint', i });
    cubes.ripple(cell, t, 0.45, 10);
    buzz(8);
    sound.mark(!!game.painted[i]);
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
    game.painted[i] = 1;
    cubes.setState(i, 1, t + 0.25, undefined, t);
    cubes.ripple(cell, t, 1.5, 9);
    rayBoost = Math.max(rayBoost, 0.5);
    buzz([30, 40, 30]);
    sound.mistake();
    updateStrikes();
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
  rayBoost = Math.max(rayBoost, 0.35);
  buzz(12);
  const pz = game.puzzle;
  let left = 0, total = 0;
  for (let k = 0; k < pz.size; k++) if (!pz.solid[k]) { total++; if (!game.broken[k]) left++; }
  sound.chisel(total ? 1 - left / total : 1);
  refreshAO();
  tutorialEvent('break');
  if (game.puzzle.isSolved(game.broken)) win();
}

function undo() {
  if (!game || game.solved) return;
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
  }
  cubes.ripple(game.puzzle.coords(u.i), t, 0.5, 9);
  buzz(6);
  sound.undo();
}

// The finale: the block holds its breath, the stone falls away to true colour
// under a band of light, the object leaps and whirls with confetti and a
// shockwave, lands with a hop that climbs it, then turns slowly on show.
function win() {
  const g = game;
  const t = now();
  g.solved = true;
  g.elapsed = t - g.start;
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
  g.win = { t0: t, focus, target, zoom, framed: false, lesson: !!g.entry.lesson };
  if (!g.entry.lesson) document.body.classList.add('solved');
  resetView();

  cubes.ripple([(d[0] - 1) / 2, (d[1] - 1) / 2, (d[2] - 1) / 2], t + 0.3, 2.2, 5);
  cubes.ripple([(d[0] - 1) / 2, -1, (d[2] - 1) / 2], t + 1.0, 1.4, 8);   // the landing
  rayBoost = 2.6;
  buzz([12, 50, 30, 400, 60]);
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

  if (g.entry.lesson) { tutorialEvent('solved'); return; }

  const title = $('#win-title');
  const letters = [...g.shape.name];
  title.innerHTML = '<span class="sub">you uncovered</span><span class="name' + (letters.length > 9 ? ' long' : '') + '">' +
    letters.map((ch, k) => `<span style="--k:${k}">${ch === ' ' ? '&nbsp;' : ch}</span>`).join('') + '</span>' +
    (g.shape.story ? `<span class="story" style="--d:${(0.25 + letters.length * 0.055 + 0.7).toFixed(2)}s"></span>` : '');
  if (g.shape.story) title.querySelector('.story').textContent = g.shape.story;
  title.classList.remove('show'); void title.offsetWidth;
  setTimeout(() => { if (game === g) title.classList.add('show'); }, 1100);
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
  setTimeout(() => {
    if (game !== g) return;
    showResult(g, result, isBest);
  }, 1800);
}

// ---------------------------------------------------------------- tutorial

function startTutorial(step = 0) {
  tutorial = { step, hint: 0 };
  const lesson = TUTORIAL[step];
  startPuzzle({ shape: lesson, palette: PALETTES.find((p) => p.name === ['Dawn', 'Lagoon', 'Mint', 'Dawn', 'Night'][step % 5]) ?? PALETTES[0], number: null, lesson: step + 1 });
}

function currentHint() {
  return tutorial && game?.entry.lesson ? TUTORIAL[tutorial.step].hints[tutorial.hint] : null;
}

function tutorialEvent(kind) {
  const h = currentHint();
  if (!h) return;
  if (kind === 'solved') {
    tutorial.hint = TUTORIAL[tutorial.step].hints.length;   // past the last hint
    renderCoach(tutorial.step === TUTORIAL.length - 1 ? 'That’s everything. Well done.' : 'Nice.');
    const g = game, step = tutorial.step;
    setTimeout(() => {
      if (game !== g) return;
      if (step + 1 < TUTORIAL.length) startTutorial(step + 1);
      else finishTutorial();
    }, 2200);
    return;
  }
  if (h.until !== kind) return;
  tutorial.hint++;
  renderCoach();
}

function finishTutorial() {
  localStorage.setItem('strata.tutorial', '1');
  tutorial = null;
  renderCoach();
  controls.autoRotate = !reduceMotion;
  showWin('You’re ready', 'tap · hold · turn · peel', 'Play No. 1');
}

function renderCoach(override) {
  const coach = $('#coach');
  const h = currentHint();
  if (!tutorial || !game?.entry.lesson) { coach.classList.remove('show'); return; }
  $('#coach-text').textContent = override || h?.text || '';
  $('#coach-dots').innerHTML = TUTORIAL.map((_, k) =>
    `<i class="${k < tutorial.step ? 'done' : k === tutorial.step ? 'now' : ''}"></i>`).join('');
  coach.classList.remove('show');
  void coach.offsetWidth;
  coach.classList.add('show');
  const pulse = h?.pulse;
  cubes.uniforms.uHint.value.set(...(pulse || [-99, -99, -99]));
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
  if (!cancelled && !press.moved && !press.done && game?.solved && resultFinish) {
    resultFinish();
  } else if (!cancelled && !press.moved && !press.done) {
    const i = pick(press.x, press.y);
    if (i < 0) {
      const t = now();
      if (t - lastEmptyTap < 0.35) { resetView(); lastEmptyTap = -1; } else lastEmptyTap = t;
    } else {
      act(i, press.button === 2 || press.shift ? otherTool() : tool);
    }
  }
  press = null;
}
canvas.addEventListener('pointerup', (e) => endPointer(e, false));
canvas.addEventListener('pointercancel', (e) => endPointer(e, true));
canvas.addEventListener('pointerleave', () => cubes.uniforms.uHover.value.set(-99, -99, -99));
canvas.addEventListener('dblclick', (e) => { if (pick(e.clientX, e.clientY) < 0) resetView(); });

let rotateFrom = null;
controls.addEventListener('start', () => { rotateFrom = camera.position.clone(); viewAnim = null; });
controls.addEventListener('end', () => {
  if (rotateFrom && rotateFrom.angleTo(camera.position) > 0.25) tutorialEvent('rotate');
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
}

document.querySelectorAll('.tool').forEach((b) => b.addEventListener('click', () => setTool(b.dataset.tool)));
$('#menu-btn').addEventListener('click', openMenu);
$('#map-help').addEventListener('click', () => show('#help', true));

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
$('#coach-skip').addEventListener('click', () => {
  localStorage.setItem('strata.tutorial', '1');
  tutorial = null;
  renderCoach();
  openMenu();
});
function goNext() {
  clearResult();
  const list = puzzleList();
  const idx = list.findIndex((e) => e.shape.id === game.shape.id);
  if (game.entry.lesson) startPuzzle(list[0]);
  else if (game.entry.bonus) { $('#actions').classList.remove('show'); openMenu(); }   // shrines lead back to the map
  else if (idx >= 0) startPuzzle(list[(idx + 1) % list.length]);
  else startRandom(game.shape.dims[0]);
}
$('#win-menu').addEventListener('click', () => { clearResult(); show('#win', false); openMenu(); });
$('#act-map').addEventListener('click', () => { clearResult(); $('#actions').classList.remove('show'); openMenu(); });
$('#act-replay').addEventListener('click', () => { clearResult(); if (game) startPuzzle(game.entry); });
$('#act-next').addEventListener('click', goNext);
$('#win-next').addEventListener('click', () => { show('#win', false); goNext(); });
$('#map-close').addEventListener('click', () => { if (game) closeMenu(); });
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

function showWin(name, stats, nextLabel) {
  clearResult();
  $('#win').classList.remove('result-mode');
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
    t += 720;
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
}

const DRIFT_SIZES = [6, 8, 10];

function renderMenu(scroll = true, celebrate = false) {
  const entries = puzzleList();
  const done = entries.filter((e) => solvedStore[e.shape.id]).length;
  $('#map-progress').textContent = done ? `${done} of ${entries.length} uncovered` : `${entries.length} stones to uncover`;
  $('#menu').classList.toggle('has-game', !!game);
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
    onPlay: (entry, el) => diveInto(el, entry.palette, () => startPuzzle(entry)),
  });
}

// Level -> map: the map pulls back out of the stone you were playing, as if
// the camera were rising off it (the reverse of the dive in)
let menuMotion = 0;
function openMenu({ instant = false } = {}) {
  if (updateReady) { location.reload(); return; }
  const menu = $('#menu');
  const wasOpen = menu.classList.contains('show');
  if (instant) {
    menu.style.transition = 'none';
    show('#menu', true);
    renderMenu(true, true);
    void menu.offsetWidth;
    menu.style.transition = '';
    return;
  }
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
    menuMotion = setTimeout(() => menu.classList.remove('settling'), 760);
  }));
}

// Map -> the level you were on: the map swells a touch and dissolves
function closeMenu() {
  const menu = $('#menu');
  show('#menu', false);
  if (reduceMotion) return;
  clearTimeout(menuMotion);
  menu.classList.remove('arriving', 'settling');
  menu.classList.add('leaving');
  menuMotion = setTimeout(() => menu.classList.remove('leaving'), 500);
}

// Map -> level: the map swells toward the tapped stone while the level's own
// sky washes over it, the puzzle is carved behind that veil, then the veil lifts.
const veil = document.createElement('div');
veil.id = 'veil';
veil.setAttribute('aria-hidden', 'true');
document.body.appendChild(veil);
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
  const r = el.getBoundingClientRect(), menu = $('#menu');
  menu.style.setProperty('--dive-x', `${r.left + r.width / 2}px`);
  menu.style.setProperty('--dive-y', `${r.top + r.height / 2}px`);
  menu.classList.add('diving');
  veil.style.background = `radial-gradient(circle at ${r.left + r.width / 2}px ${r.top + r.height / 2}px, ${hexOf(palette.glow)}, ${hexOf(palette.skyTop)} 45%, ${hexOf(palette.skyBottom)})`;
  // the level's sky opens out of the stone like a portal
  veil.style.setProperty('--vx', `${r.left + r.width / 2}px`);
  veil.style.setProperty('--vy', `${r.top + r.height / 2}px`);
  menu.classList.remove('arriving', 'settling', 'leaving');
  veil.classList.add('open', 'in');
  setTimeout(() => {
    introDelay = 0.35;                 // the veil takes ~0.45 s to lift
    start();
    introDelay = 0;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      veil.classList.remove('in');
      setTimeout(() => veil.classList.remove('open'), 500);   // close the portal once it has faded
      // reset the (hidden) map only after the block has assembled: restyling the
      // whole map mid-animation dropped a frame on phones
      setTimeout(() => { menu.classList.remove('diving'); diving = false; }, (0.35 + INTRO_TIME) * 1000 + 250);
    }));
  }, 460);
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
    angle = -0.25 * Math.sin(windup * Math.PI / 2) + whirl * (1 - Math.exp(-s / 0.7)) + SHOW_SPIN * s;
    const leap = Math.min(1, s / 0.66);
    lift = 0.5 * Math.sin(Math.PI * leap) * (leap < 1 ? 1 : 0)
      + 0.09 * Math.sin((s - 0.66) * 1.5) * THREE.MathUtils.smoothstep(s, 0.66, 2.2);
  }
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
    if (!game.solved) $('#timer').textContent = fmt(t - game.start);

    if (game.win) {
      stepCelebration(t);
      const H = canvas.clientHeight;
      finale.update(t, camera, H, H - 215, H - 154);   // gems, then score, above the actions
    }

    camDir.copy(camera.position).sub(controls.target).normalize();
    handles.group.visible = game.shape.handles !== false;
    handles.setShown(!game.solved && t >= (game.introEnd ?? 0), reduceMotion ? -99 : t);   // they pop in once the block is whole
    handles.layout(game.puzzle.dims, camDir, { ...peel, keepVisual: u.uPeel.value.y }, t, !!currentHint()?.pulseHandle);
  }
  rayBoost *= Math.exp(-dt * 1.6);

  // shared time / scale uniforms
  const unitPx = renderer.domElement.height / ((camera.top - camera.bottom) / camera.zoom);
  motes.uniforms.uTime.value = shards.uniforms.uTime.value = fragments.uniforms.uTime.value = t;
  motes.uniforms.uUnitPx.value = shards.uniforms.uUnitPx.value = unitPx;
  motes.uniforms.uFocus.value = camera.position.distanceTo(controls.target);
  background.uniforms.uTime.value = t;
  rays.uniforms.uTime.value = t;
  const gain = game?.palette.rayGain ?? 1;
  rays.compUniforms.uIntensity.value = gain * (0.42 + rayBoost * 0.5 + 0.05 * Math.sin(t * 0.7));

  centerNdc.copy(game?.win ? game.win.focus : controls.target).project(camera);
  const cx = centerNdc.x * 0.5 + 0.5, cy = centerNdc.y * 0.5 + 0.5;
  rays.uniforms.uCenter.value.set(cx, cy);
  background.uniforms.uCenter.value.set(cx, cy);
  motes.uniforms.uCenter.value.set(cx, cy);

  // 1) silhouette -> outward rays
  if (game) {
    rays.render(renderer, () => {
      const vis = handles.group.visible;
      background.mesh.visible = motes.points.visible = shards.points.visible = handles.group.visible = false;
      const ringsOn = winRings.map((r) => r.mesh.visible);
      const finaleOn = finale.group.visible;
      finale.group.visible = fragments.mesh.visible = false;
      for (const r of winRings) r.mesh.visible = false;
      cubes.uniforms.uMask.value = 1;
      renderer.render(scene, camera);
      cubes.uniforms.uMask.value = 0;
      background.mesh.visible = motes.points.visible = shards.points.visible = true;
      handles.group.visible = vis;
      winRings.forEach((r, k) => { r.mesh.visible = ringsOn[k]; });
      finale.group.visible = finaleOn;
      fragments.mesh.visible = true;
    });
  }

  // 2) scene, 3) rays + vignette on top
  renderer.setRenderTarget(null);
  renderer.clear();
  renderer.render(scene, camera);
  if (game) rays.composite(renderer);
}
function frame() {
  draw();
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

// ---------------------------------------------------------------- developer panel

// Hidden on purpose: hold the version line in How to play (a quick tap still
// checks for updates), or tap the map's STRATA title five times.
const devPress = { timer: 0, opened: false };
function openDev() {
  devPress.opened = true;
  $('#dev-unlock-state').textContent = localStorage.getItem('strata.dev.unlock') === '1' ? 'on' : 'off';
  $('#dev .dev-version').textContent = $('#version').textContent;
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
$('.map-head h1').addEventListener('click', () => {
  const t = performance.now();
  titleTaps = titleTaps.filter((x) => t - x < 1500).concat(t);
  if (titleTaps.length >= 5) { titleTaps = []; openDev(); }
});
$('#dev [data-close]').addEventListener('click', () => show('#dev', false));
$('#dev-unlock').addEventListener('click', () => {
  const on = localStorage.getItem('strata.dev.unlock') !== '1';
  localStorage.setItem('strata.dev.unlock', on ? '1' : '0');
  $('#dev-unlock-state').textContent = on ? 'on' : 'off';
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

applyPalette(PALETTES[0]);
resize();
renderMenu();
if (localStorage.getItem('strata.tutorial')) {
  // a quiet block behind the menu so the first screen already breathes
  startPuzzle(puzzleList()[0], { quiet: true });
  openMenu({ instant: true });   // the map is the first thing you see, not a fade over the block
} else {
  startTutorial(0);
}
requestAnimationFrame(frame);

// offline play: only over https (hosted build); the LAN dev server stays uncached
// Updates. A home-screen app is often resumed rather than reloaded, so look
// for a new version whenever it comes to the front, not just at launch. When a
// new version has taken over, reload at a calm moment (the map or the result
// screen), never in the middle of a puzzle. Tapping the version line in How to
// play checks right away.
function calmMoment() { return !game || game.solved || $('#menu').classList.contains('show'); }
function applyUpdate() { if (updateReady && calmMoment()) location.reload(); }
if ('serviceWorker' in navigator && location.protocol === 'https:') {
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

// console hook for testing: strata.game, strata.act(i, 'break' | 'paint')
window.strata = { get game() { return game; }, get peel() { return peel; }, act, startTutorial, startPuzzle, journalEntries, setPeeled, setPeelAxis, resetView, handles, camera };
