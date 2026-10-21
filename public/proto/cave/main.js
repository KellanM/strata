// Cave mural spike: Strata's backstory in ~30 s, painted on a voxel wall and
// read by the companion's lantern. Wordless. Tap to begin (and start sound),
// tap again to skip, replay at the end.
//   ?t=12      start at 12 s          ?still   hold that frame (for checks)
//   ?auto      start without the tap (silent)            ?fps   frame times
// window.cave.seek(t) renders any moment; the whole sequence is a function of t.
import * as THREE from 'three';
import { Mural, paint, W, H, rng } from './mural.js?v=5';
import { wallMeshes, voxelMaterial, Tiles, Sprites, Finish, lightUniforms, MAX_LIGHTS } from './render.js?v=5';
import { makeStory, END } from './story.js?v=5';
import { GloamField } from './gloam.js?v=5';
import { CaveSound } from './sound.js?v=5';

const params = new URLSearchParams(location.search);
const $ = (s) => document.querySelector(s);
const startAt = Number(params.get('t')) || 0;
const still = params.has('still');

const canvas = $('#cave');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: still });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setClearColor(0x030203, 1);
renderer.info.autoReset = false;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, 1, 20, 400);

// ---------------------------------------------------------------- build
const mural = new Mural();
const info = paint(mural);
const shared = {
  ...lightUniforms(),
  uTime: { value: 0 },
  uAmb: { value: new THREE.Vector3(0.010, 0.011, 0.018) },
  uExposure: { value: 1.5 },
  uDebug: { value: Number(params.get('dbg') || 0) },
  tGloam: { value: null },
  uGloamSize: { value: new THREE.Vector2(W, H) },
};
const field = new GloamField();
shared.tGloam.value = field.tex;
field.setStatic(info.gloamT, info.growT, info.lantern);
for (const m of wallMeshes(mural.build(), voxelMaterial(shared, 4))) scene.add(m);
const story = makeStory(info, mural);
const tiles = new Tiles(story.tileCount, voxelMaterial(shared, 0.5, 1), story.tileSpecs);
const mist = new Sprites(1000, shared);
const glow = new Sprites(900, shared, { glow: true });
scene.add(tiles.mesh, mist.mesh, glow.mesh);
const finish = new Finish();
const sound = new CaveSound();

// dust in the lantern's light: only what the flame reaches is seen
const r = rng(11);
const motes = Array.from({ length: 320 }, () => ({ x: r() * W, y: 14 + r() * 82, z: 1.5 + r() * 9, s: 0.18 + r() * 0.35, h: r() }));
function addMotes(t, L, camX) {
  for (const m of motes) {
    if (Math.abs(m.x - camX) > 34) continue;
    const y = 14 + ((m.y - 14 + t * (0.25 + 0.5 * m.h)) % 80);
    const x = m.x + Math.sin(t * 0.3 + m.h * 20) * 1.4;
    const z = m.z + Math.sin(t * 0.21 + m.h * 9) * 0.8;
    const d = Math.hypot(x - L.x, y - L.y, (z - L.z) * 0.6) / L.R;
    const a = Math.exp(-3 * d * d) * L.I * (0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * (0.8 + m.h * 2) + m.h * 40)));
    if (a > 0.02) glow.add(x, y, z, m.s * (1 + 0.6 * (z / 10)), 0, a * 0.8, 0, 1, 1.0, 0.68, 0.38);
  }
}

// ---------------------------------------------------------------- size
let fitDist = 125;
function resize() {
  const w = window.innerWidth, h = window.innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  const vt = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)), ht = vt * camera.aspect;
  fitDist = Math.max(20 / ht, 44 / vt);
  finish.uniforms.uAspect.value = w / h;
}
window.addEventListener('resize', resize);
resize();

// ---------------------------------------------------------------- one frame
const v3 = new THREE.Vector3();
let uiFade = 0;
function render(t) {
  shared.uTime.value = t;
  finish.uniforms.uTime.value = t;
  mist.begin(); glow.begin();
  const f = story.frame(t, mist, glow, field);
  shared.uAmb.value.set(...f.amb);
  const L = f.lantern;
  addMotes(t, L, f.cam.x);
  mist.end(); glow.end();

  shared.uLantern.value.set(L.x, L.y, L.z, L.R);
  shared.uLanternCol.value.set(1.0, 0.5, 0.19).multiplyScalar(2.5 * L.I);
  f.lights.sort((a, b) => b.w - a.w);
  for (let i = 0; i < MAX_LIGHTS; i++) {
    const l = f.lights[i];
    if (l && l.w > 0.01) { shared.uLightP.value[i].set(l.x, l.y, l.z, l.R); shared.uLightC.value[i].set(...l.c); }
    else shared.uLightP.value[i].w = 0;
  }
  for (let i = 0; i < tiles.count; i++) {
    const tl = f.tiles[i];
    if (tl) tiles.set(i, tl.x, tl.y, tl.z, tl.rnd, tl.heat * 1.3, ...(tl.rot ?? [0, 0, 0]));
    else tiles.set(i, 0, -1000, 0, 0, 0);
  }
  tiles.commit();

  const d = fitDist * f.cam.d;
  camera.position.set(f.cam.x + f.shake.x, f.cam.y - 4 + f.shake.y, d);
  camera.lookAt(f.cam.x + f.shake.x * 0.5, f.cam.y + f.shake.y * 0.5, 0);
  camera.updateMatrixWorld();
  v3.set(L.x, L.y, L.z).project(camera);
  finish.uniforms.uHaze.value.set((v3.x + 1) / 2, (v3.y + 1) / 2, L.I);
  finish.uniforms.uFade.value = Math.max(f.fade, uiFade);

  renderer.info.reset();
  renderer.autoClear = true;
  renderer.render(scene, camera);
  renderer.autoClear = false;
  renderer.render(finish.scene, finish.camera);
}

// ---------------------------------------------------------------- playback
let state = 'gate', t0 = 0, from = 0, skipAt = 0, frozenT = startAt;
const show = (id, on) => { $(id).hidden = !on; };

function play(at = 0) {
  state = 'play'; from = at; t0 = performance.now(); uiFade = 0;
  show('#gate', false); show('#end', false);
  show('#skip', true);
  setTimeout(() => show('#skip', false), 2600);
  sound.start(story.cues, at);
}
function finishUp() {
  state = 'end';
  show('#skip', false);
  setTimeout(() => { if (state === 'end') show('#end', true); }, 250);
}

window.addEventListener('pointerup', (e) => {
  if (e.target.closest('#replay')) return;
  if (state === 'gate') { sound.unlock(); play(startAt); return; }
  if (state === 'play') {
    // skip: a quick fall to black, then the replay
    state = 'skipping'; skipAt = performance.now();
    sound.stop(0.6);
    show('#skip', false);
  }
});
// iOS: make sure the audio context is born inside a touch
window.addEventListener('touchend', () => { if (state === 'gate') sound.unlock(); }, { passive: true });
$('#replay').addEventListener('click', (e) => { e.stopPropagation(); sound.unlock(); play(0); });

// ---------------------------------------------------------------- loop
const perf = params.has('fps') ? $('#perf') : null;
let last = performance.now(), avg = 16, lastDrop = 0;
function loop(now) {
  requestAnimationFrame(loop);
  const dt = now - last; last = now; avg += (dt - avg) * 0.05;
  // a slower phone gets fewer pixels rather than a stutter
  if (state === 'play' && now - t0 > 4000 && avg > 24 && renderer.getPixelRatio() > 1.25 && now - lastDrop > 2000) {
    renderer.setPixelRatio(Math.max(1.25, renderer.getPixelRatio() - 0.375)); resize(); lastDrop = now; avg = 16;
  }
  if (perf) perf.textContent = `${avg.toFixed(1)} ms · ${renderer.info.render.calls} calls · ${(renderer.info.render.triangles / 1000).toFixed(0)}k tris · dpr ${renderer.getPixelRatio()}`;
  let t;
  if (still || state === 'still') t = frozenT;
  else if (state === 'gate') t = 0;
  else if (state === 'play') {
    t = from + (now - t0) / 1000;
    if (t >= END) { t = END; finishUp(); }
  } else if (state === 'skipping') {
    t = from + (skipAt - t0) / 1000;
    uiFade = Math.min(1, (now - skipAt) / 600);
    if (uiFade >= 1) finishUp();
  } else t = END;
  render(state === 'end' && !still ? END : t);
}

if (still) { state = 'still'; }
else if (params.has('auto')) play(startAt);
else show('#gate', true);
requestAnimationFrame(loop);

window.cave = {
  END,
  seek(t) { frozenT = t; state = 'still'; uiFade = 0; render(t); },
  ready: true,
  field,
};
