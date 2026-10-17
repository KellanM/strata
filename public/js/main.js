import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Puzzle, hideClues } from './puzzle.js';
import { SHAPES, randomShape, buildCells } from './shapes.js';
import { PALETTES } from './palettes.js';
import { Cubes } from './cubes.js';
import { Background, GodRays, Motes, Shards } from './atmosphere.js';

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
controls.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: null };
controls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN };

const cubes = new Cubes();
const background = new Background();
const rays = new GodRays();
const motes = new Motes();
const shards = new Shards();
scene.add(background.mesh, motes.points, shards.points);

const CAM_DIST = 120;
let viewRadius = 6;
let game = null;
let tool = 'break';
const peel = { axis: 0, side: 1, peeled: 0, keep: 99 };
let rayBoost = 0;
const clock0 = performance.now();
const now = () => (performance.now() - clock0) / 1000;

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const solvedStore = JSON.parse(localStorage.getItem('strata.solved') || '{}');

// ---------------------------------------------------------------- puzzles

function puzzleList() {
  return SHAPES.map((s, i) => ({ shape: s, palette: PALETTES[i % PALETTES.length], number: i + 1 }));
}

function startPuzzle(entry) {
  const { shape, palette } = entry;
  const { solid, colors } = buildCells(shape);
  const puzzle = new Puzzle(shape.dims, solid, colors);
  hideClues(puzzle, shape.fraction ?? 0.85, shape.seed ?? 7);

  game = {
    entry, shape, puzzle, palette,
    broken: new Uint8Array(puzzle.size),
    painted: new Uint8Array(puzzle.size),
    undo: [], mistakes: 0, start: now(), elapsed: 0, solved: false, revealStart: -1,
  };

  if (!cubes.mesh || !cubes.mesh.parent) scene.add(cubes.build(puzzle));
  else cubes.build(puzzle);
  applyPalette(palette);

  const [X, Y, Z] = shape.dims;
  viewRadius = 0.5 * Math.hypot(X, Y, Z) + 0.6;
  motes.uniforms.uBox.value = viewRadius * 4;
  setPeelAxis(0, 1);
  refreshAO();

  controls.autoRotate = false;
  controls.target.set(0, 0, 0);
  // look square-on at the broad face of flat puzzles, isometric otherwise
  const az = Z < X * 0.6 ? 0.42 : X < Z * 0.6 ? Math.PI / 2 - 0.42 : Math.PI / 4;
  const el = 0.56;
  camera.position.set(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el)).multiplyScalar(CAM_DIST);
  camera.zoom = 1;
  resize();
  controls.update();

  $('#pz-name').textContent = solvedStore[shape.id] ? shape.name : `No. ${entry.number ?? '—'}`;
  $('#pz-meta').textContent = `${X} × ${Y} × ${Z} · ${palette.name}`;
  updateStrikes();
  show('#menu', false);
  show('#win', false);

  // the block rises in with a wave from its base
  const t = now();
  cubes.ripple([(X - 1) / 2, -2, (Z - 1) / 2], t, 1.6, 6);
  rayBoost = 1;
}

function applyPalette(p) {
  const dark = new THREE.Color(p.skyTop).getHSL({}).l < 0.35;
  cubes.setPalette(p);
  background.setPalette(p);
  rays.setPalette(p, dark);
  motes.setPalette(p);
  document.body.classList.toggle('dark', dark);
  const sky = '#' + new THREE.Color(p.skyTop).lerp(new THREE.Color(p.skyBottom), 0.4).getHexString();
  document.documentElement.style.setProperty('--sky', sky);
  if (!dark) document.documentElement.style.setProperty('--ink', '#' + new THREE.Color(p.under).multiplyScalar(0.8).getHexString());
  else document.documentElement.style.removeProperty('--ink');
  document.querySelector('meta[name=theme-color]').content = '#' + new THREE.Color(p.skyTop).getHexString();
}

// ---------------------------------------------------------------- peel

function inPeel(i, keep = peel.keep) {
  const p = game.puzzle.coords(i);
  const dim = game.puzzle.dims[peel.axis];
  const c = peel.side > 0 ? p[peel.axis] : dim - 1 - p[peel.axis];
  return c < keep;
}

function present(i) { return !game.broken[i] && inPeel(i); }

function refreshAO() { cubes.updateAO(game.puzzle, present); }

function setPeelAxis(axis, side = peel.side) {
  peel.axis = axis;
  peel.side = side;
  peel.peeled = 0;
  peel.keep = game.puzzle.dims[axis];
  cubes.uniforms.uPeel.value.set(axis, peel.keep, side);
  const slider = $('#peel');
  slider.max = game.puzzle.dims[axis] - 1;
  slider.value = 0;
  document.querySelectorAll('.axis[data-axis]').forEach((b) => b.classList.toggle('on', +b.dataset.axis === axis));
  $('#flip').classList.toggle('on', side < 0);
  refreshAO();
}

function setPeeled(n) {
  const dims = game.puzzle.dims[peel.axis];
  peel.peeled = Math.max(0, Math.min(dims - 1, n));
  peel.keep = dims - peel.peeled;
  $('#peel').value = peel.peeled;
  refreshAO();
  buzz(6);
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

function win() {
  const g = game;
  g.solved = true;
  g.elapsed = now() - g.start;
  g.revealStart = now() + 0.3;
  const prev = solvedStore[g.shape.id];
  if (!g.shape.id.startsWith('random') && (!prev || g.elapsed < prev.time)) {
    solvedStore[g.shape.id] = { time: g.elapsed, mistakes: g.mistakes };
    localStorage.setItem('strata.solved', JSON.stringify(solvedStore));
  }
  setPeelAxis(peel.axis);
  const d = g.puzzle.dims;
  cubes.ripple([(d[0] - 1) / 2, (d[1] - 1) / 2, (d[2] - 1) / 2], now(), 2.2, 5);
  rayBoost = 2.2;
  controls.autoRotate = !reduceMotion;
  buzz([20, 60, 20, 60, 40]);
  $('#pz-name').textContent = g.shape.name;
  setTimeout(() => {
    if (game !== g) return;
    $('#win-name').textContent = g.shape.name;
    $('#win-stats').textContent = `${fmt(g.elapsed)} · ${g.mistakes ? g.mistakes + ' mistake' + (g.mistakes > 1 ? 's' : '') : 'flawless'}`;
    show('#win', true);
  }, 2600);
}

// ---------------------------------------------------------------- input

let press = null;
const activePointers = new Set();
const ring = $('#press-ring');

function otherTool() { return tool === 'break' ? 'paint' : 'break'; }

canvas.addEventListener('contextmenu', (e) => e.preventDefault());

canvas.addEventListener('pointerdown', (e) => {
  activePointers.add(e.pointerId);
  clearTimeout(press?.timer);
  ring.classList.remove('go');
  if (activePointers.size !== 1) { press = null; return; }
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
});

canvas.addEventListener('pointermove', (e) => {
  if (press && Math.hypot(e.clientX - press.x, e.clientY - press.y) > 9) {
    press.moved = true;
    clearTimeout(press.timer);
    ring.classList.remove('go');
  }
  if (e.pointerType === 'mouse' && game && !e.buttons) {
    const i = pick(e.clientX, e.clientY);
    const h = cubes.uniforms.uHover.value;
    if (i >= 0) h.set(...game.puzzle.coords(i)); else h.set(-99, -99, -99);
  }
});

function endPointer(e, cancelled) {
  activePointers.delete(e.pointerId);
  ring.classList.remove('go');
  if (!press) return;
  clearTimeout(press.timer);
  if (!cancelled && !press.moved && !press.done) {
    const which = press.button === 2 || press.shift ? otherTool() : tool;
    act(pick(press.x, press.y), which);
  }
  press = null;
}
canvas.addEventListener('pointerup', (e) => endPointer(e, false));
canvas.addEventListener('pointercancel', (e) => endPointer(e, true));
canvas.addEventListener('pointerleave', () => cubes.uniforms.uHover.value.set(-99, -99, -99));

function setTool(t) {
  tool = t;
  document.querySelectorAll('.tool').forEach((b) => {
    const on = b.dataset.tool === t;
    b.classList.toggle('on', on);
    b.setAttribute('aria-checked', on);
  });
}

document.querySelectorAll('.tool').forEach((b) => b.addEventListener('click', () => setTool(b.dataset.tool)));
document.querySelectorAll('.axis[data-axis]').forEach((b) =>
  b.addEventListener('click', () => game && setPeelAxis(+b.dataset.axis)));
$('#flip').addEventListener('click', () => game && setPeelAxis(peel.axis, -peel.side));
$('#peel').addEventListener('input', (e) => game && setPeeled(+e.target.value));
$('#undo').addEventListener('click', undo);
$('#menu-btn').addEventListener('click', () => { renderMenu(); show('#menu', true); });
$('#help-btn').addEventListener('click', () => show('#help', true));
$('#help [data-close]').addEventListener('click', () => { show('#help', false); localStorage.setItem('strata.helped', '1'); });
$('#win-menu').addEventListener('click', () => { renderMenu(); show('#menu', true); });
$('#win-next').addEventListener('click', () => {
  const list = puzzleList();
  const idx = list.findIndex((e) => e.shape.id === game.shape.id);
  if (idx >= 0) startPuzzle(list[(idx + 1) % list.length]);
  else startRandom(game.shape.dims[0]);
});
document.querySelectorAll('[data-random]').forEach((b) => b.addEventListener('click', () => startRandom(+b.dataset.random)));
$('#menu').addEventListener('click', (e) => { if (e.target.id === 'menu' && game) show('#menu', false); });

window.addEventListener('keydown', (e) => {
  if (!game) return;
  const k = e.key.toLowerCase();
  if (k === 'z' || (e.ctrlKey && k === 'z')) undo();
  else if (k === 'b' || k === 'c') setTool('break');
  else if (k === 'p' || k === 'm') setTool('paint');
  else if (k === '1' || k === '2' || k === '3') setPeelAxis(+k - 1);
  else if (k === ']' || k === 'arrowup') setPeeled(peel.peeled + 1);
  else if (k === '[' || k === 'arrowdown') setPeeled(peel.peeled - 1);
});

function startRandom(n) {
  const seed = Math.floor(Math.random() * 1e6) + 1;
  startPuzzle({ shape: randomShape(n, seed), palette: PALETTES[seed % PALETTES.length], number: null });
}

// ---------------------------------------------------------------- UI

function show(sel, on) { $(sel).classList.toggle('show', on); }

function fmt(s) {
  const m = Math.floor(s / 60), r = Math.floor(s % 60);
  return `${m}:${String(r).padStart(2, '0')}`;
}

function updateStrikes() {
  $('#strikes').textContent = game.mistakes ? '✕'.repeat(Math.min(game.mistakes, 5)) + (game.mistakes > 5 ? '+' : '') : '';
}

function renderMenu() {
  const grid = $('#grid');
  grid.innerHTML = '';
  for (const entry of puzzleList()) {
    const { shape, palette, number } = entry;
    const solved = solvedStore[shape.id];
    const hex = (h) => '#' + h.toString(16).padStart(6, '0');
    const b = document.createElement('button');
    b.className = 'card' + (solved ? ' solved' : '');
    b.style.background = `linear-gradient(170deg, ${hex(palette.skyTop)}, ${hex(palette.skyBottom)})`;
    b.innerHTML = `
      <span class="num">${String(number).padStart(2, '0')}</span>
      <span class="gem" style="background:linear-gradient(135deg, ${hex(palette.top)} 0 50%, ${hex(palette.lit)} 50% 100%);
        box-shadow: -6px 6px 0 ${hex(palette.shade)}"></span>
      <span class="name">${solved ? shape.name : '???'}</span>
      <span class="dims">${shape.dims.join('×')}${solved ? ' · ' + fmt(solved.time) : ''}</span>`;
    b.addEventListener('click', () => {
      loading(true);
      requestAnimationFrame(() => requestAnimationFrame(() => { startPuzzle(entry); loading(false); maybeHelp(); }));
    });
    grid.appendChild(b);
  }
}

function loading(on) { $('#loading').textContent = on ? 'carving' : ''; }
function maybeHelp() { if (!localStorage.getItem('strata.helped')) show('#help', true); }

// ---------------------------------------------------------------- render

const centerNdc = new THREE.Vector3();

function resize() {
  const w = window.innerWidth, h = window.innerHeight;
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
function frame() {
  const t = now();
  const dt = Math.min(0.05, t - last);
  last = t;
  controls.update();

  if (game) {
    const u = cubes.uniforms;
    u.uTime.value = t;
    u.uPeel.value.y += (peel.keep - u.uPeel.value.y) * Math.min(1, dt * (reduceMotion ? 60 : 9));
    if (game.revealStart > 0) u.uReveal.value = Math.min(1, Math.max(0, (t - game.revealStart) / 2.2));
    if (!game.solved) $('#timer').textContent = fmt(t - game.start);
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

  centerNdc.set(0, 0, 0).project(camera);
  const cx = centerNdc.x * 0.5 + 0.5, cy = centerNdc.y * 0.5 + 0.5;
  rays.uniforms.uCenter.value.set(cx, cy);
  background.uniforms.uCenter.value.set(cx, cy);
  motes.uniforms.uCenter.value.set(cx, cy);

  // 1) silhouette -> outward rays
  if (game) {
    rays.render(renderer, () => {
      background.mesh.visible = motes.points.visible = shards.points.visible = false;
      cubes.uniforms.uMask.value = 1;
      renderer.render(scene, camera);
      cubes.uniforms.uMask.value = 0;
      background.mesh.visible = motes.points.visible = shards.points.visible = true;
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
// a quiet block behind the menu so the first screen already breathes
startPuzzle(puzzleList()[0]);
show('#menu', true);
requestAnimationFrame(frame);

// console hook for testing: strata.game, strata.act(i, 'break' | 'paint')
window.strata = { get game() { return game; }, act, setPeeled, setPeelAxis };
