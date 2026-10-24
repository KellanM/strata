// First light (P3 in docs/ftue-study.md): a new player's first ~20 s. Night,
// a wall of old stone, one cube glowing inside it. Tap it: it opens, its
// light rises like incense smoke and turns like a flock, and settles into the
// empty sky as its first stars. Then the name. Wordless.
//   ?auto     tap by itself after 3 s (silent)      ?t=6    jump to 6 s after the tap
//   ?still    hold that moment (for checks)         ?fps    frame times
import * as THREE from 'three';
import { Swarm, Trails, rng } from './swarm.js?v=5';
import { Sound } from './sound.js?v=2';

const params = new URLSearchParams(location.search);
const $ = (s) => document.querySelector(s);
const still = params.has('still');
const jump = params.has('t') ? Number(params.get('t')) : null;
const pre = Number(params.get('pre')) || 0;   // ?pre=4: four seconds in, still before the tap

const canvas = $('#scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: still });
renderer.setClearColor(0x000000, 0);
const DPR = Math.min(2, window.devicePixelRatio || 1);
renderer.setPixelRatio(DPR);
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
const CAM_Z = 24;
const CAM_FROM = -3.2, CAM_TO = 15;   // the camera's height on the wall, and at rest in the sky
const scene = new THREE.Scene();
const swarmScene = new THREE.Scene();

// ---------------------------------------------------------------- the wall
// Old stone, a little uneven, a ruined top edge with moss. Lit by the night
// and by whatever light is near it (the glowing cube, then the rising swarm).
const STONE = [0xb4a998, 0xa89d8c, 0xbdb3a3, 0x9c9282], MOSS = [0x6f8a58, 0x7a9262, 0x617d50];
const CUBE_AT = new THREE.Vector3(0, -5, 0);
const rand = rng(11);
const cells = [];
for (let x = -8; x <= 8; x++) {
  const top = 1 + Math.round(1.6 * Math.sin(x * 0.9 + 1.3) + 1.1 * Math.sin(x * 2.3) + rand() * 1.2);
  for (let y = -22; y <= top; y++) {
    if (x === CUBE_AT.x && y === CUBE_AT.y) continue;
    if (y === top && rand() < 0.3) continue;
    const z = (rand() - 0.5) * 0.18 + (rand() < 0.06 ? 0.28 : 0) - (rand() < 0.05 ? 0.3 : 0);
    const moss = y >= top - 1 && rand() < 0.4 || (rand() < 0.012);
    const c = new THREE.Color(moss ? MOSS[rand() * 3 | 0] : STONE[rand() * 4 | 0]).multiplyScalar(0.94 + rand() * 0.1);
    cells.push([x, y, z, c]);
  }
}
const MAX_LIGHTS = 2;
const wallMat = new THREE.ShaderMaterial({
  uniforms: {
    uL: { value: [new THREE.Vector3(), new THREE.Vector3()] },
    uLc: { value: [new THREE.Color(1, 0.72, 0.42), new THREE.Color(1, 0.86, 0.66)] },
    uLi: { value: [0, 0] },
    uMoon: { value: 1 },
  },
  vertexShader: /* glsl */`
    varying vec3 vN, vW, vC; varying vec2 vUv;
    void main() {
      vec4 w = modelMatrix * instanceMatrix * vec4(position, 1.0);
      vW = w.xyz; vN = normalize(mat3(modelMatrix * instanceMatrix) * normal); vC = instanceColor; vUv = uv;
      gl_Position = projectionMatrix * viewMatrix * w;
    }`,
  fragmentShader: /* glsl */`
    uniform vec3 uL[${MAX_LIGHTS}]; uniform vec3 uLc[${MAX_LIGHTS}]; uniform float uLi[${MAX_LIGHTS}]; uniform float uMoon;
    varying vec3 vN, vW, vC; varying vec2 vUv;
    void main() {
      vec3 n = normalize(vN);
      // the night: a cool, low fill, a little brighter on tops (the sky's light)
      vec3 col = vC * vec3(0.10, 0.11, 0.21) * (0.75 + 0.5 * max(n.y, 0.0)) * uMoon;
      for (int i = 0; i < ${MAX_LIGHTS}; i++) {
        vec3 d = uL[i] - vW; float r = length(d);
        float ndl = max(dot(n, d / r), 0.0) * 0.8 + 0.2;
        col += vC * uLc[i] * ndl * uLi[i] / (1.0 + 0.32 * r * r);
      }
      // carved edges: each block reads as its own stone
      vec2 e = min(vUv, 1.0 - vUv); float edge = smoothstep(0.0, 0.09, min(e.x, e.y));
      col *= 0.62 + 0.38 * edge;
      gl_FragColor = vec4(col, 1.0);
    }`,
});
const box = new THREE.BoxGeometry(0.97, 0.97, 0.97);
const wall = new THREE.InstancedMesh(box, wallMat, cells.length);
const m4 = new THREE.Matrix4();
cells.forEach(([x, y, z, c], i) => { wall.setMatrixAt(i, m4.makeTranslation(x, y, z)); wall.setColorAt(i, c); });
scene.add(wall);
// the dark socket left behind (a slightly recessed back face)
const socket = new THREE.Mesh(new THREE.PlaneGeometry(0.97, 0.97), new THREE.MeshBasicMaterial({ color: 0x07060c }));
socket.position.set(CUBE_AT.x, CUBE_AT.y, -0.46);
scene.add(socket);

// ---------------------------------------------------------------- the glowing cube
const glowMat = new THREE.ShaderMaterial({
  uniforms: { uB: { value: 1 } },
  vertexShader: 'varying vec2 vUv; varying vec3 vN; void main(){ vUv = uv; vN = normal; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: /* glsl */`
    uniform float uB; varying vec2 vUv; varying vec3 vN;
    void main() {
      vec2 e = min(vUv, 1.0 - vUv); float k = min(e.x, e.y);
      // light from inside: hottest at the seams, a warm stone skin across each face
      float seam = 1.0 - smoothstep(0.0, 0.12, k);
      vec3 skin = vec3(0.86, 0.62, 0.38) * (0.55 + 0.45 * uB);
      vec3 hot = vec3(1.0, 0.86, 0.6) * (0.9 + 0.8 * uB);
      gl_FragColor = vec4(mix(skin, hot, seam), 1.0);
    }`,
});
const glowCube = new THREE.Mesh(box, glowMat);
glowCube.position.copy(CUBE_AT);
scene.add(glowCube);
// its halo
const haloTex = (() => {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d'), grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, 'rgba(255,214,150,0.9)'); grd.addColorStop(0.25, 'rgba(255,170,90,0.35)'); grd.addColorStop(1, 'rgba(255,140,60,0)');
  g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
})();
const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: haloTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
halo.position.copy(CUBE_AT).setZ(0.6);
halo.scale.setScalar(5);
scene.add(halo);

// ---------------------------------------------------------------- the sky's places for stars
const starRand = rng(5), starPlaces = [];
for (let i = 0; i < 1800; i++) {
  const z = -14 * starRand() ** 1.5;
  const spread = 1 + -z / CAM_Z;   // farther stars spread wider, to fill the same view
  starPlaces.push((starRand() - 0.5) * 11 * spread * (window.innerWidth / window.innerHeight < 0.75 ? 1 : 2.2), 7 + 19 * starRand() ** 0.85 * (0.9 + 0.2 * spread), z);
}
// The name, written in stars: each letter a few strokes (in a 2 x 3 box),
// stars along them a little apart, as a constellation is drawn. Placed where
// the camera comes to rest, high in the view, so the sky signs itself.
const GLYPHS = {
  S: [[[1.9, 2.6], [1.3, 3], [0.6, 3], [0.1, 2.55], [0.25, 1.85], [1, 1.5], [1.75, 1.15], [1.9, 0.45], [1.35, 0], [0.6, 0], [0.1, 0.4]]],
  T: [[[0, 3], [1, 3], [2, 3]], [[1, 3], [1, 0]]],
  R: [[[0, 0], [0, 3], [1.3, 3], [1.85, 2.55], [1.85, 2.05], [1.3, 1.6], [0, 1.6]], [[0.9, 1.6], [1.9, 0]]],
  A: [[[0, 0], [1, 3], [2, 0]]],   // no crossbar: a peak, as the old title's A reads in stars
};
const nameStars = [], nameLines = [], nameGlow = new THREE.Vector4(), fieldStars = [];
{
  const word = 'STRATA', GAP = 1.15, W = word.length * 2 + (word.length - 1) * GAP;
  // the camera's resting pose (as step() leaves it at the top)
  const rest = camera.clone();
  rest.aspect = window.innerWidth / window.innerHeight;
  rest.fov = rest.aspect < 0.75 ? 45 : 38;
  rest.updateProjectionMatrix();
  rest.position.set(0, CAM_TO, CAM_Z); rest.lookAt(0, CAM_TO + 1.5, 0); rest.updateMatrixWorld();
  const at = (nx, ny) => {   // screen (-1..1) to the sky plane z = -1
    const d = new THREE.Vector3(nx, ny, 0.5).unproject(rest).sub(rest.position).normalize();
    return rest.position.clone().addScaledVector(d, (-1 - rest.position.z) / d.z);
  };
  const left = at(-0.78, 0.6), right = at(0.78, 0.6), k = (right.x - left.x) / W;
  const base = left.y - 1.5 * k;
  const place = (gx, gy) => {
    const x = left.x + gx * k, y = base + gy * k;
    let j = nameStars.findIndex(([px, py]) => Math.hypot(px - x, py - y) < 0.3 * k);
    if (j < 0) { j = nameStars.length; nameStars.push([x, y, -1]); }
    return j;
  };
  [...word].forEach((ch, n) => {
    const ox = n * (2 + GAP);
    for (const stroke of GLYPHS[ch]) {
      let prev = null;
      for (let s = 0; s < stroke.length - 1; s++) {
        const [ax, ay] = stroke[s], [bx, by] = stroke[s + 1];
        const steps = Math.max(1, Math.round(Math.hypot(bx - ax, by - ay) / 0.62));
        for (let q = s === 0 ? 0 : 1; q <= steps; q++) {
          const j = place(ox + ax + (bx - ax) * q / steps, ay + (by - ay) * q / steps);
          if (prev !== null && prev !== j) nameLines.push(prev, j);
          prev = j;
        }
      }
    }
  });
  // the name sits in a richer patch of sky, its own constellation: a field of
  // fixed stars around it comes out as it is written (nameField, below), and
  // the shader brightens every risen star there too (uGlow). Only right on
  // the strokes is the sky kept clear, so the letters read.
  const cx = (left.x + right.x) / 2, cy = base + 1.5 * k, rx = (right.x - left.x) * 0.78, ry = 3 * k * 1.9;
  nameGlow.set(cx, cy, rx, ry);
  const near = (x, y, r) => nameStars.some(([px, py]) => Math.hypot(px - x, py - y) < r);
  const v = new THREE.Vector3(), w = new THREE.Vector3(), clear = [];
  for (let i = 0; i < starPlaces.length; i += 3) {
    v.set(starPlaces[i], starPlaces[i + 1], starPlaces[i + 2]).project(rest);
    // where it appears against the name's plane
    w.set(v.x, v.y, 0.5).unproject(rest).sub(rest.position).normalize();
    const d = (-1 - rest.position.z) / w.z;
    if (near(rest.position.x + w.x * d, rest.position.y + w.y * d, 0.5 * k)) continue;
    clear.push(starPlaces[i], starPlaces[i + 1], starPlaces[i + 2]);
  }
  starPlaces.length = 0; starPlaces.push(...clear);
  // the background sky (system two): stars laid evenly over the resting view,
  // a jittered grid so no patch is bare, at a spread of depths; and a denser
  // cluster round the name, so it sits inside a constellation
  const gr = rng(17), on = new THREE.Vector3();
  const COLS = Math.round(15 * Math.max(1, rest.aspect / 0.46) ** 0.5), ROWS = Math.round(COLS * 2.4 / rest.aspect * 0.46 * 2.2);
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const nx = -1.05 + 2.1 * (c + gr()) / COLS, ny = -1.7 + 2.75 * (r + gr()) / ROWS;
    const z = -2 - 12 * gr();
    on.set(nx, ny, 0.5).unproject(rest).sub(rest.position).normalize();
    const x = rest.position.x + on.x * (z - rest.position.z) / on.z, y = rest.position.y + on.y * (z - rest.position.z) / on.z;
    if (y < 4) continue;                                                    // the wall, not the sky
    if (z > -4 && near(x, y, 0.5 * k)) continue;
    fieldStars.push(x, y, z);
  }
  for (let n = 0; n < 150;) {
    const a = gr() * Math.PI * 2, r = Math.sqrt(-Math.log(1 - gr() * 0.95)) * 0.6;   // dense at the centre, thinning outward
    const x = cx + Math.cos(a) * r * rx, y = cy + Math.sin(a) * r * ry;
    if (near(x, y, 0.75 * k)) continue;
    fieldStars.push(x, y, -1.5 - 2 * gr()); n++;
  }
  for (const [x, y, z] of nameStars) starPlaces.push(x, y, z);
}
const swarm = new Swarm({ count: 1200, source: CUBE_AT, stars: new Float32Array(starPlaces), px: DPR, reserved: nameStars.length, nameSpeed: 2.5 });
swarm.material.uniforms.uGlow.value.copy(nameGlow);
// the constellation's lines: drawn faintly once its stars are home
const nameLine = (() => {
  const pos = new Float32Array(nameLines.length * 3);
  nameLines.forEach((j, i) => pos.set(nameStars[j], i * 3));
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const m = new THREE.LineBasicMaterial({ color: 0xffe2b8, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
  const l = new THREE.LineSegments(g, m); l.frustumCulled = false;
  return l;
})();
scene.add(nameLine);
// the name's constellation: fixed stars round it, brightest near the middle
const nameField = (() => {
  const n = fieldStars.length / 3, seed = new Float32Array(n), r = rng(23);
  for (let i = 0; i < n; i++) seed[i] = r();
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(fieldStars), 3));
  g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
  // when each star wakes (sim time); far off until the rising light comes near it
  g.setAttribute('aOn', new THREE.BufferAttribute(new Float32Array(n).fill(1e6), 1));
  const m = new THREE.ShaderMaterial({
    uniforms: { uGlowK: { value: 0 }, uTime: { value: 0 }, uPx: { value: DPR }, uGlow: { value: nameGlow } },
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `attribute float aSeed, aOn; uniform float uTime, uPx, uGlowK; uniform vec4 uGlow; varying float vA;
      void main(){
        vec4 mv = modelViewMatrix * vec4(position,1.0);
        vec2 q = (position.xy - uGlow.xy) / uGlow.zw; float c = uGlowK * exp(-dot(q,q) * 1.6);
        float wake = clamp((uTime - aOn) / 1.4, 0.0, 1.0); wake *= wake;
        float flash = 1.0 + 1.5 * wake * (1.0 - wake) * 4.0;               // a little glint as it wakes
        vA = wake * flash * (0.45 + 0.7 * c + 0.4 * aSeed) * (0.8 + 0.2 * sin(uTime * (0.5 + aSeed) + aSeed * 50.0));
        gl_PointSize = (2.0 + 3.2 * aSeed * aSeed + 2.6 * c) * uPx * clamp(14.0 / -mv.z, 0.6, 1.2);
        gl_Position = projectionMatrix * mv; }`,
    fragmentShader: 'varying float vA; void main(){ vec2 q = gl_PointCoord * 2.0 - 1.0; float a = min(1.0, exp(-dot(q,q) * 3.5) * vA * 1.6); gl_FragColor = vec4(vec3(1.0, 0.95, 0.88) * a, a); }',
  });
  const p = new THREE.Points(g, m); p.frustumCulled = false;
  return p;
})();
const fieldOn = nameField.geometry.attributes.aOn, fieldRand = rng(31);
let fieldLeft = fieldOn.count;
scene.add(nameField);
swarmScene.add(swarm.points);
const trails = new Trails(renderer);

// faint far stars that come out once the first ones are home (the sky remembering)
const far = (() => {
  const n = 700, pos = new Float32Array(n * 3), seed = new Float32Array(n), r = rng(9);
  for (let i = 0; i < n; i++) { pos.set([(r() - 0.5) * 60, 4 + 40 * r(), -30 - 10 * r()], i * 3); seed[i] = r(); }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
  const m = new THREE.ShaderMaterial({
    uniforms: { uA: { value: 0 }, uTime: { value: 0 }, uPx: { value: DPR } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: 'attribute float aSeed; uniform float uTime, uPx; varying float vA; void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); vA = (0.35 + 0.65 * aSeed) * (0.7 + 0.3 * sin(uTime * (0.4 + aSeed) + aSeed * 40.0)); gl_PointSize = (0.8 + 1.6 * aSeed * aSeed) * uPx; gl_Position = projectionMatrix * mv; }',
    fragmentShader: 'uniform float uA; varying float vA; void main(){ vec2 q = gl_PointCoord * 2.0 - 1.0; float a = exp(-dot(q,q) * 4.0) * vA * uA; gl_FragColor = vec4(vec3(0.85, 0.88, 1.0) * a, a); }',
  });
  const p = new THREE.Points(g, m); p.frustumCulled = false;
  return p;
})();
scene.add(far);

// ---------------------------------------------------------------- timeline
const smooth = (a, b, x) => { const k = Math.min(1, Math.max(0, (x - a) / (b - a))); return k * k * (3 - 2 * k); };
const smoother = (a, b, x) => { const k = Math.min(1, Math.max(0, (x - a) / (b - a))); return k * k * k * (k * (6 * k - 15) + 10); };
let nameAt = null;   // when the name's last star landed
// after the tap the story runs at SPEED (Kellan, 2026-10-23: half as long);
// twinkles keep real time (realT) so the settled sky stays calm
const SPEED = 2;
let tapAt = null, simT = 0, realT = 0, lastReal = null, idleSince = 0;
let camY = CAM_FROM;
const sound = new Sound();
swarm.onSettle = () => sound.star();

function open() {
  if (tapAt !== null) return;
  tapAt = simT;
  swarm.release(simT + 0.35);
  $('#hint').classList.remove('show');
  sound.open(SPEED);
}

function layout() {
  const w = window.innerWidth, h = window.innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  // a phone sees about nine stones across; wider screens see more sky and wall
  camera.fov = w / h < 0.75 ? 45 : 38;
  camera.updateProjectionMatrix();
  trails.setSize(w * DPR, h * DPR);
}
window.addEventListener('resize', layout);
layout();

const hint = $('#hint'), v3 = new THREE.Vector3();
function frame(real) {
  const dt = lastReal === null ? 1 / 60 : Math.min(1 / 20, (real - lastReal) / 1000);
  lastReal = real;
  if (!still || simT === 0) step(dt);
  render(dt);
  if (!still) requestAnimationFrame(frame);
  if (params.has('fps')) $('#perf').textContent = `${(dt * 1000).toFixed(1)} ms`;
}
function step(dt) {
  const sdt = dt * (tapAt === null ? 1 : SPEED);
  simT += sdt; realT += dt;
  const s = tapAt === null ? -1 : simT - tapAt;
  // before the tap: the cube breathes, once every 5.5 s (about a slow breath)
  const breath = 0.5 - 0.5 * Math.cos(simT * Math.PI * 2 / 5.5);
  const lit = smooth(0.4, 3.2, simT);   // the night comes up out of black
  if (tapAt === null) {
    glowMat.uniforms.uB.value = breath * lit;
    halo.material.opacity = (0.45 + 0.4 * breath) * lit;
    halo.scale.setScalar(4.2 + 1.2 * breath);
    wallMat.uniforms.uL.value[0].copy(CUBE_AT).setZ(1.1);
    wallMat.uniforms.uLi.value[0] = (1.4 + 0.9 * breath) * lit;
    // the fingertip: only if nothing has been touched for a while
    if (simT - idleSince > 6.5) {
      v3.copy(CUBE_AT).project(camera);
      hint.style.left = `${(v3.x * 0.5 + 0.5) * window.innerWidth}px`;
      hint.style.top = `${(-v3.y * 0.5 + 0.5) * window.innerHeight}px`;
      hint.classList.add('show');
    }
  } else {
    // the stone opens: a held breath of brightness, then it gives its light away
    const flare = smooth(0, 0.3, s) * (1 - smooth(0.3, 2.4, s));
    glowMat.uniforms.uB.value = 1 + 1.2 * flare;
    const k = 1 - smoother(0.3, 2.6, s);
    glowCube.scale.setScalar(Math.max(0.001, k));
    glowCube.visible = k > 0.01;
    halo.material.opacity = (0.85 + 0.6 * flare) * (1 - smooth(1.2, 3.5, s));
    halo.scale.setScalar(5 + 3 * flare);
    wallMat.uniforms.uLi.value[0] = (2.3 + 2.5 * flare) * (1 - smooth(1, 3.8, s));
    // the rising light lights the wall as it passes
    wallMat.uniforms.uL.value[1].copy(swarm.centre).setZ(swarm.centre.z + 1.5);
    wallMat.uniforms.uLi.value[1] = 3.2 * swarm.flying * smooth(0.3, 1.2, s);
    swarm.step(simT, sdt);
    swarm.material.uniforms.uTime.value = realT;
    far.material.uniforms.uA.value = smooth(9, 14, s);
    // the name: when its stars are all home, the constellation's lines draw in
    let home = 0;
    for (let i = 0; i < swarm.reserved; i++) home += swarm.state[i * 3 + 1] >= 1;
    if (home === swarm.reserved && nameAt === null) nameAt = s;
    nameLine.material.opacity = nameAt === null ? 0 : 0.32 * smooth(0, 2.5, s - nameAt);
    swarm.material.uniforms.uGlowK.value = 0.9 * smooth(5, 10, s);
    nameField.material.uniforms.uGlowK.value = smooth(6, 11, s);
    nameField.material.uniforms.uTime.value = simT;
    // the background wakes where the rising light passes, a widening reach; all of it by 13 s
    if (fieldLeft && s > 1) {
      const reach = 2 + 1.5 * s, c = swarm.centre, A = fieldOn.array;
      for (let i = 0; i < A.length; i++) {
        if (A[i] < 1e6) continue;
        const x = fieldStars[i * 3] - c.x, y = fieldStars[i * 3 + 1] - c.y;
        if (Math.hypot(x, y * 0.8) < reach || s > 13) { A[i] = simT + fieldRand() * 1.5; fieldLeft--; }
      }
      fieldOn.needsUpdate = true;
    }
    if (s > 15) $('#replay').classList.add('show');
  }
  far.material.uniforms.uTime.value = realT;
  // the camera: holds on the wall, then follows the flock up into the sky (a soft, lagging follow)
  if (tapAt !== null) {
    const want = Math.min(CAM_TO, Math.max(CAM_FROM, swarm.lead.y - 2.5));
    camY += (want - camY) * (1 - Math.exp(-sdt * 1.3 * smooth(0.6, 2.2, simT - tapAt)));
  }
  const up = (camY - CAM_FROM) / (CAM_TO - CAM_FROM);
  camera.position.set(0, camY, CAM_Z);
  camera.lookAt(0, camY + 1.5 * up, 0);
  // the sky behind: night from black, brightening a touch toward a far dawn as the camera rises
  document.body.style.setProperty('--lit', lit.toFixed(3));
  document.body.style.setProperty('--up', up.toFixed(3));
}
function render(dt) {
  renderer.setRenderTarget(null);
  renderer.clear();
  renderer.render(scene, camera);
  if (tapAt !== null) {
    trails.render(swarmScene, camera, swarm, dt * SPEED, 0.95);
    trails.composite(1.6);
    const was = renderer.autoClear; renderer.autoClear = false;
    renderer.render(swarmScene, camera);
    renderer.autoClear = was;
  }
}

// ---------------------------------------------------------------- input
const onTap = (e) => {
  idleSince = simT;
  if (tapAt !== null) return;
  sound.unlock();
  // the cube is the thing to touch; a tap anywhere near it opens it
  v3.copy(CUBE_AT).project(camera);
  const sx = (v3.x * 0.5 + 0.5) * window.innerWidth, sy = (-v3.y * 0.5 + 0.5) * window.innerHeight;
  if (Math.hypot(e.clientX - sx, e.clientY - sy) < Math.max(60, window.innerWidth * 0.14)) open();
  else hint.classList.add('show');   // a touch elsewhere: show where
};
canvas.addEventListener('pointerdown', onTap);
$('#replay').addEventListener('click', () => location.reload());

if (params.has('auto')) setTimeout(() => open(), 3000);
for (let i = 0; i < pre * 60; i++) step(1 / 60);
if (jump !== null) {
  // run the clock forward to the requested moment (the sky is a function of time)
  for (let i = 0; i < 3.4 * 60; i++) step(1 / 60);
  open();
  const n = Math.round(jump * 60);
  for (let i = 0; i < n; i++) { step(1 / 60); if (i > n - 50) render(1 / 60); }   // the trail's last moments too
  lastReal = null;
}
requestAnimationFrame(frame);
window.firstlight = { open, swarm, get t() { return tapAt === null ? null : simT - tapAt; } };
