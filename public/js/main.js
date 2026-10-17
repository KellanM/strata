import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Puzzle, hideClues } from './puzzle.js';
import { SHAPES, TUTORIAL, randomShape, buildCells } from './shapes.js';
import { PALETTES, variant } from './palettes.js';
import { scoreFor } from './score.js';
import { Cubes } from './cubes.js';
import { Background, GodRays, Motes, Shards } from './atmosphere.js';
import { PeelHandles } from './handles.js';
import { renderMap } from './map.js';

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
const controls = new OrbitControls(camera, canvas);
controls.enablePan = false;
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.rotateSpeed = 0.75;
controls.minZoom = 0.6;
controls.maxZoom = 3.5;
controls.autoRotateSpeed = 1.4;
// spin freely around, but never far enough over the top to read clues upside down
controls.minPolarAngle = 0.26;
controls.maxPolarAngle = Math.PI - 0.5;
controls.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: null };
controls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN };

const cubes = new Cubes();
const background = new Background();
const rays = new GodRays();
const motes = new Motes();
const shards = new Shards();
const handles = new PeelHandles(cubes.uniforms.uLight);
scene.add(background.mesh, motes.points, shards.points, handles.group);

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

function startPuzzle(entry) {
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

  // the block rises in with a wave from its base
  cubes.ripple([(X - 1) / 2, -2, (Z - 1) / 2], now(), 1.6, 6);
  rayBoost = 1;
}

function applyPalette(p) {
  const a = p.lightAngle ?? 0, c = Math.cos(a), s = Math.sin(a);
  cubes.uniforms.uLight.value.set(-0.45 * c - 0.9 * s, -0.45 * s + 0.9 * c).normalize();
  const dark = new THREE.Color(p.skyTop).getHSL({}).l < 0.35;
  cubes.setPalette(p);
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
  if (changed && !silent) { buzz(6); if (next > 0) tutorialEvent('peel'); }
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
    if (present(i)) return i;
    const a = tMax[0] < tMax[1] ? (tMax[0] < tMax[2] ? 0 : 2) : (tMax[1] < tMax[2] ? 1 : 2);
    cell[a] += step[a];
    if (cell[a] < 0 || cell[a] >= dims[a]) return -1;
    tMax[a] += tDelta[a];
  }
  return -1;
}

function cellWorld(i) {
  const [x, y, z] = game.puzzle.coords(i);
  const d = game.puzzle.dims;
  return new THREE.Vector3(x - (d[0] - 1) / 2, y - (d[1] - 1) / 2, z - (d[2] - 1) / 2);
}

// ---------------------------------------------------------------- actions

function buzz(pattern) { if (navigator.vibrate) navigator.vibrate(pattern); }

function act(i, which) {
  if (!game || game.solved || i < 0) return;
  const t = now();
  const cell = game.puzzle.coords(i);
  const p = game.palette;

  if (which === 'paint') {
    game.painted[i] ^= 1;
    cubes.setState(i, game.painted[i], t);
    game.undo.push({ kind: 'paint', i });
    cubes.ripple(cell, t, 0.45, 10);
    buzz(8);
    if (game.painted[i]) tutorialEvent('paint');
    return;
  }

  if (game.painted[i]) {             // marked cubes are protected
    cubes.ripple(cell, t, 0.25, 12);
    cubes.setState(i, undefined, undefined, undefined, t - 0.35);
    buzz(4);
    return;
  }

  if (game.puzzle.solid[i]) {        // wrong: it belongs to the shape
    game.mistakes++;
    game.painted[i] = 1;
    cubes.setState(i, 1, t + 0.25, undefined, t);
    cubes.ripple(cell, t, 1.5, 9);
    rayBoost = Math.max(rayBoost, 0.5);
    buzz([30, 40, 30]);
    updateStrikes();
    return;
  }

  game.broken[i] = 1;
  cubes.setState(i, undefined, undefined, t);
  game.undo.push({ kind: 'break', i });
  cubes.ripple(cell, t, 1, 7);
  const c = (h) => new THREE.Color(h);
  shards.burst(cellWorld(i), t, [c(p.top), c(p.lit), c(p.shade)], reduceMotion ? 4 : 14);
  rayBoost = Math.max(rayBoost, 0.35);
  buzz(12);
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
  // fit the object into the band between the title and the result card
  const H = canvas.clientHeight, pxPerUnit = H / (camera.top - camera.bottom);
  const bandTop = g.entry.lesson ? H * 0.2 : H * 0.24;
  const bandBottom = g.entry.lesson ? H - 90 : H - 330;
  const band = Math.max(180, bandBottom - bandTop);
  const zoom = THREE.MathUtils.clamp((band / 2) / ((radius + 0.2) * pxPerUnit), 0.55, 1.35);
  const shiftPx = H / 2 - (bandTop + bandBottom) / 2;
  const target = focus.clone();
  target.y -= shiftPx / (pxPerUnit * zoom) / Math.cos(g.homeEl);
  g.win = { t0: t, focus, target, zoom, framed: false, lesson: !!g.entry.lesson };
  if (!g.entry.lesson) document.body.classList.add('solved');
  resetView();

  cubes.ripple([(d[0] - 1) / 2, (d[1] - 1) / 2, (d[2] - 1) / 2], t + 0.3, 2.2, 5);
  cubes.ripple([(d[0] - 1) / 2, -1, (d[2] - 1) / 2], t + 1.0, 1.4, 8);   // the landing
  rayBoost = 2.6;
  buzz([12, 50, 30, 400, 60]);
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
  title.innerHTML = '<span class="sub">you uncovered</span><span class="name">' +
    [...g.shape.name].map((ch, k) => `<span style="--k:${k}">${ch === ' ' ? '&nbsp;' : ch}</span>`).join('') + '</span>';
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
  }, 2900);
}

// ---------------------------------------------------------------- tutorial

function startTutorial(step = 0) {
  tutorial = { step, hint: 0 };
  const lesson = TUTORIAL[step];
  startPuzzle({ shape: lesson, palette: PALETTES[[0, 1, 3, 0, 4][step % 5]], number: null, lesson: step + 1 });
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
  if (!cancelled && !press.moved && !press.done) {
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
  document.querySelectorAll('.tool').forEach((b) => {
    const on = b.dataset.tool === t;
    b.classList.toggle('on', on);
    b.setAttribute('aria-checked', on);
  });
}

document.querySelectorAll('.tool').forEach((b) => b.addEventListener('click', () => setTool(b.dataset.tool)));
$('#undo').addEventListener('click', undo);
$('#menu-btn').addEventListener('click', openMenu);
$('#help-btn').addEventListener('click', () => show('#help', true));
$('#map-help').addEventListener('click', () => show('#help', true));
$('#help [data-close]').addEventListener('click', () => show('#help', false));
$('#coach-skip').addEventListener('click', () => {
  localStorage.setItem('strata.tutorial', '1');
  tutorial = null;
  renderCoach();
  openMenu();
});
$('#win-menu').addEventListener('click', () => { clearResult(); show('#win', false); openMenu(); });
$('#win-replay').addEventListener('click', () => { clearResult(); if (game) startPuzzle(game.entry); });
$('#win-next').addEventListener('click', () => {
  clearResult();
  const list = puzzleList();
  const idx = list.findIndex((e) => e.shape.id === game.shape.id);
  if (game.entry.lesson) startPuzzle(list[0]);
  else if (idx >= 0) startPuzzle(list[(idx + 1) % list.length]);
  else startRandom(game.shape.dims[0]);
});
$('#map-close').addEventListener('click', () => { if (game) show('#menu', false); });
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && game && $('#menu').classList.contains('show')) show('#menu', false);
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
  const card = $('#win');
  card.classList.add('result-mode');
  card.classList.remove('done');
  $('#win-next').textContent = 'Next';
  $('#win-allow').textContent = `≤ ${result.allowance} slip${result.allowance > 1 ? 's' : ''}`;
  const stars = [...document.querySelectorAll('#win-stars .star')];
  stars.forEach((st) => st.classList.remove('on'));
  const scoreEl = $('#win-score'), linesEl = $('#win-lines'), best = $('#win-best');
  best.classList.remove('in');
  best.style.display = isBest ? '' : 'none';
  linesEl.innerHTML = result.lines.map((l) => `<li><span>${l.label}</span><b>+${l.value.toLocaleString()}</b></li>`).join('');
  const items = [...linesEl.children];
  scoreEl.textContent = '0';
  show('#win', true);

  let shown = 0, anim = null;
  const setScore = (v) => { shown = v; scoreEl.textContent = Math.round(v).toLocaleString(); };
  const countTo = (target, ms) => {
    cancelAnimationFrame(anim);
    const from = shown, t0 = performance.now();
    let lastTick = 0;
    const step = (now2) => {
      const k = Math.min(1, (now2 - t0) / ms);
      setScore(from + (target - from) * (1 - Math.pow(1 - k, 3)));
      if (now2 - lastTick > 70) { lastTick = now2; scoreEl.classList.remove('tick'); void scoreEl.offsetWidth; scoreEl.classList.add('tick'); }
      if (k < 1) anim = requestAnimationFrame(step);
    };
    anim = requestAnimationFrame(step);
  };
  const at = (ms, fn) => resultTimers.push(setTimeout(() => { if (game === g) fn(); }, ms));

  let t = 300, running = 0;
  result.lines.forEach((l, k) => {
    const dur = k === 0 ? 900 : 380;
    running += l.value;
    const target = running;
    at(t, () => { items[k].classList.add('in'); countTo(target, dur); });
    t += dur + (k === 0 ? 150 : 120);
  });
  for (let k = 0; k < result.stars; k++) {
    at(t, () => { stars[k].classList.add('on'); buzz(10 + k * 6); });
    t += 380;
  }
  if (isBest) at(t + 50, () => best.classList.add('in'));
  at(t + 250, () => card.classList.add('done'));

  resultFinish = () => {
    clearResult();
    cancelAnimationFrame(anim);
    setScore(result.total);
    items.forEach((li) => li.classList.add('in'));
    stars.forEach((st, k) => st.classList.toggle('on', k < result.stars));
    if (isBest) best.classList.add('in');
    card.classList.add('done');
  };
}
$('#win .panel').addEventListener('click', (e) => {
  if (resultFinish && !e.target.closest('button')) resultFinish();
});

function fmt(s) {
  const m = Math.floor(s / 60), r = Math.floor(s % 60);
  return `${m}:${String(r).padStart(2, '0')}`;
}

function updateStrikes() {
  $('#strikes').textContent = game.mistakes ? '✕'.repeat(Math.min(game.mistakes, 5)) + (game.mistakes > 5 ? '+' : '') : '';
}

const DRIFT_SIZES = [6, 8, 10];

function renderMenu(scroll = true) {
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
    onLearn: () => startTutorial(0),
    onDrift: (n) => startRandom(n),
    onPlay: (entry) => {
      loading(true);
      requestAnimationFrame(() => requestAnimationFrame(() => { startPuzzle(entry); loading(false); }));
    },
  });
}

function openMenu() {
  show('#menu', true);
  renderMenu();
}

window.addEventListener('resize', () => { if ($('#menu').classList.contains('show')) renderMenu(false); });

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
window.addEventListener('resize', resize);

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
    angle = -0.25 * Math.sin(windup * Math.PI / 2) + whirl * (1 - Math.exp(-s / 0.7)) + 0.42 * s;
    const leap = Math.min(1, s / 0.66);
    lift = 0.5 * Math.sin(Math.PI * leap) * (leap < 1 ? 1 : 0)
      + 0.09 * Math.sin((s - 0.66) * 1.5) * THREE.MathUtils.smoothstep(s, 0.66, 2.2);
  }
  const c = Math.cos(angle), sn = Math.sin(angle);
  const fx = w.focus.x, fz = w.focus.z;
  mesh.rotation.y = angle;
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

function frame() {
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

    if (game.win) stepCelebration(t);

    camDir.copy(camera.position).sub(controls.target).normalize();
    handles.group.visible = !game.solved && game.shape.handles !== false;
    handles.layout(game.puzzle.dims, camDir, { ...peel, keepVisual: u.uPeel.value.y }, t, !!currentHint()?.pulseHandle);
  }
  rayBoost *= Math.exp(-dt * 1.6);

  // shared time / scale uniforms
  const unitPx = renderer.domElement.height / ((camera.top - camera.bottom) / camera.zoom);
  motes.uniforms.uTime.value = shards.uniforms.uTime.value = t;
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
      for (const r of winRings) r.mesh.visible = false;
      cubes.uniforms.uMask.value = 1;
      renderer.render(scene, camera);
      cubes.uniforms.uMask.value = 0;
      background.mesh.visible = motes.points.visible = shards.points.visible = true;
      handles.group.visible = vis;
      winRings.forEach((r, k) => { r.mesh.visible = ringsOn[k]; });
    });
  }

  // 2) scene, 3) rays + vignette on top
  renderer.setRenderTarget(null);
  renderer.clear();
  renderer.render(scene, camera);
  if (game) rays.composite(renderer);

  requestAnimationFrame(frame);
}

// ---------------------------------------------------------------- boot

applyPalette(PALETTES[0]);
resize();
renderMenu();
if (localStorage.getItem('strata.tutorial')) {
  // a quiet block behind the menu so the first screen already breathes
  startPuzzle(puzzleList()[0]);
  openMenu();
} else {
  startTutorial(0);
}
requestAnimationFrame(frame);

// offline play: only over https (hosted build); the LAN dev server stays uncached
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

// console hook for testing: strata.game, strata.act(i, 'break' | 'paint')
window.strata = { get game() { return game; }, get peel() { return peel; }, act, startTutorial, setPeeled, setPeelAxis, resetView, handles, camera };
