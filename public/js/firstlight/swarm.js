// Swarm: light that leaves a stone and becomes stars. Reusable: give it a
// source and a sky to settle into, call release(), then step() each frame.
//
// The paths are a flow, not a spray:
//   - a flock: a leader rises from the stone along a broad, slow curl field,
//     and every mote keeps its own place in a body around it. The places
//     breathe and shear over time, so the body bends, thins and thickens as
//     it turns, like starlings, and it widens as it climbs;
//   - smoke: a fine curl field (divergence-free, so motes never clump or
//     tear) whose strength grows with height. Near the stone the light leaves
//     in a narrow laminar plume, like incense from the stick; higher up it
//     frays into ribbons at the body's edges.
// The flock sheds its light as it climbs: each mote has its own height, where
// it claims the nearest free star and eases into it; settled, it twinkles. A trail buffer (Trails)
// keeps a short afterglow of the moving motes only, so the streams read as
// smoke and the settled stars stay crisp.
import * as THREE from 'three';

export function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const smooth = (a, b, x) => { const k = Math.min(1, Math.max(0, (x - a) / (b - a))); return k * k * (3 - 2 * k); };

// a stream function as a sum of plane waves; its curl is the velocity
function waves(n, fLo, fHi, wLo, wHi, rand) {
  return Array.from({ length: n }, () => {
    const th = rand() * Math.PI * 2, f = fLo + (fHi - fLo) * rand();
    return { c: Math.cos(th), s: Math.sin(th), f, w: (wLo + (wHi - wLo) * rand()) * (rand() < 0.5 ? -1 : 1), p: rand() * 7, a: 1 / (f * Math.sqrt(n)) };
  });
}
function curl(ws, x, y, t, out) {
  let vx = 0, vy = 0;
  for (const w of ws) {
    const k = w.a * w.f * Math.cos(w.f * (x * w.c + y * w.s) + w.w * t + w.p);
    vx += k * w.s; vy -= k * w.c;
  }
  out[0] = vx; out[1] = vy;
}

const VERT = /* glsl */`
  attribute vec4 aSeed;    // twinkle rate, phase, size, warmth
  attribute vec3 aState;   // visible (0..1), settled (0..1), heat (1 at birth)
  uniform float uTime, uPx, uTrail;
  uniform vec4 uGlow;      // a patch of sky (centre xy, radii xy) whose stars shine brighter: the name's constellation
  uniform float uGlowK;
  varying float vB;
  varying vec3 vCol;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float ph = aSeed.y * 6.2832;
    // in flight: a quick shimmer with rare bright glints; settled: a slow star twinkle
    float shimmer = 0.62 + 0.38 * sin(uTime * mix(7.0, 13.0, aSeed.x) + ph);
    float glint = pow(max(0.0, sin(uTime * mix(1.1, 2.7, aSeed.x) + ph * 7.0)), 30.0) * 1.8;
    float twinkle = (0.85 + 0.3 * sin(uTime * mix(0.5, 1.4, aSeed.x) + ph)) * 1.25;
    // arriving: a soft glint as it lands in its place
    float land = 4.0 * aState.y * (1.0 - aState.y);
    float b = mix(shimmer + glint, twinkle, aState.y) + 1.6 * land * land;
    vec2 g = (position.xy - uGlow.xy) / uGlow.zw;
    b *= 1.0 + uGlowK * aState.y * exp(-dot(g, g) * 1.4);
    // the trail only keeps what is still moving
    vB = b * aState.x * mix(1.0, (1.0 - aState.y) * 0.26, uTrail);
    vec3 ember = vec3(1.0, 0.74, 0.40), air = vec3(0.86, 0.86, 1.0);
    vec3 star = mix(vec3(0.88, 0.9, 1.0), vec3(1.0, 0.93, 0.82), aSeed.w);
    vCol = mix(mix(air, ember, aState.z), star, aState.y);
    float size = aSeed.z * mix(1.0, 0.95, aState.y) * (0.75 + 0.3 * b);
    gl_PointSize = size * uPx * 3.6 * (24.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }`;
const FRAG = /* glsl */`
  varying float vB;
  varying vec3 vCol;
  void main() {
    vec2 q = gl_PointCoord * 2.0 - 1.0;
    float d2 = dot(q, q);
    if (d2 > 1.0) discard;
    float a = (exp(-d2 * 9.0) + 0.28 * exp(-d2 * 2.4)) * vB;
    gl_FragColor = vec4(vCol * a, a);
  }`;

export class Swarm {
  // reserved: the last `reserved` star places are kept for the first `reserved`
  // motes (the name, written in stars): nobody else takes them, and they go nowhere else
  constructor({ count = 1400, seed = 7, source, stars, px = 1, reserved = 0, nameSpeed = 1 }) {
    this.n = count;
    const rand = this.rand = rng(seed);
    this.fine = waves(6, 0.32, 0.7, 0.25, 0.6, rand);
    this.broad = waves(4, 0.07, 0.14, 0.12, 0.3, rand);
    this.src = source.clone();
    this.pos = new Float32Array(count * 3);
    this.vel = new Float32Array(count * 3);
    this.birth = new Float32Array(count).fill(Infinity);
    this.lift = new Float32Array(count);      // its own rising speed
    this.ceiling = new Float32Array(count);   // the height at which it looks for a star
    this.settleAt = new Float32Array(count).fill(Infinity);
    this.star = new Int32Array(count).fill(-1);
    this.state = new Float32Array(count * 3);
    const seeds = new Float32Array(count * 4);
    for (let i = 0; i < count; i++) {
      seeds.set([rand(), rand(), 0.55 + 0.9 * rand() ** 2.2, rand()], i * 4);
      this.lift[i] = 0.8 + 0.5 * rand();
    }
    // each mote's place in the flock's body: a flattened, gently layered cloud
    this.home = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const u = rand() * Math.PI * 2, r = Math.pow(rand(), 0.6);
      this.home.set([Math.cos(u) * r, (rand() - 0.5) * 1.6 * Math.pow(rand(), 0.5), Math.sin(u) * r * 0.5], i * 3);
    }
    this.lead = new THREE.Vector3().copy(source);
    this.leadV = new THREE.Vector3();
    this.released = Infinity;
    // the sky's star places: claimed one by one, nearest first
    this.stars = stars;
    this.free = new Uint8Array(stars.length / 3).fill(1);
    this.reserved = reserved;
    this.nameSpeed = nameSpeed;
    const first = this.free.length - reserved;
    this.free.fill(0, first);
    // the name's stars: a touch larger, and warm, like the stone they came from
    for (let i = 0; i < reserved; i++) { seeds[i * 4 + 2] = 1.7 + 0.25 * rand(); seeds[i * 4 + 3] = 0.85 + 0.15 * rand(); }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 4));
    g.setAttribute('aState', new THREE.BufferAttribute(this.state, 3).setUsage(THREE.DynamicDrawUsage));
    this.material = new THREE.ShaderMaterial({
      vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthWrite: false, depthTest: false,
      blending: THREE.AdditiveBlending, uniforms: { uTime: { value: 0 }, uPx: { value: px }, uTrail: { value: 0 }, uGlow: { value: new THREE.Vector4(0, 0, 1, 1) }, uGlowK: { value: 0 } },
    });
    this.points = new THREE.Points(g, this.material);
    this.points.frustumCulled = false;
    this.flying = 0;
    this.centre = new THREE.Vector3().copy(source);
    this.settled = 0;
    this.onSettle = null;
  }
  // the stone opens: motes leave it over `over` seconds, from all through its volume
  release(t, over = 2.6, size = 0.9) {
    const r = this.rand;
    this.released = t;
    for (let i = 0; i < this.n; i++) {
      // most leave early, a long thin tail after (smoke keeps rising from the stick)
      this.birth[i] = t + over * Math.pow(r(), 2.2);
      this.pos.set([this.src.x + (r() - 0.5) * size, this.src.y + (r() - 0.5) * size, this.src.z + 0.5 + r() * 0.3], i * 3);
      this.vel.set([(r() - 0.5) * 0.6, 0.6 + r() * 0.8, (r() - 0.2) * 0.8], i * 3);
      this.ceiling[i] = this.src.y + 8 + 14 * Math.pow(r(), 0.7);   // (the game's title: a lower sky)
      if (i < this.reserved) {   // the name: among the last to leave, the highest to climb
        this.birth[i] = t + over * (0.35 + 0.65 * r());
        this.ceiling[i] = this.stars[(this.free.length - this.reserved + i) * 3 + 1] - 1.5;
      }
    }
  }
  claim(i) {
    if (i < this.reserved) return this.free.length - this.reserved + i;
    const S = this.stars, x = this.pos[i * 3], y = this.pos[i * 3 + 1] + 2.5;
    // the nearest of a few free places picked at random: motes still settle
    // roughly where they are, but fan out so the whole sky takes its share
    let best = -1, bd = Infinity;
    const first = this.free.length - this.reserved;
    for (let tries = 0, seen = 0; tries < 400 && seen < 28; tries++) {
      const k = (this.rand() * first) | 0;
      if (!this.free[k]) continue;
      seen++;
      const dx = S[k * 3] - x, dy = S[k * 3 + 1] - y, d = dx * dx + dy * dy * 0.6;
      if (d < bd) { bd = d; best = k; }
    }
    if (best < 0) for (let k = 0; k < first; k++) if (this.free[k]) { best = k; break; }
    if (best >= 0) this.free[best] = 0;
    return best;
  }
  step(t, dt) {
    const P = this.pos, V = this.vel, St = this.state, src = this.src, f = [0, 0], b = [0, 0];
    const ease = 1 - Math.exp(-dt * 2.6);
    let cx = 0, cy = 0, cz = 0, fly = 0;
    // the leader: up, along the broad field, slowing as it nears the top of the sky
    const L = this.lead, LV = this.leadV, H = this.home;
    if (t >= this.released) {
      const hl = L.y - src.y;
      curl(this.broad, L.x * 0.6, L.y, t, b);
      const climb = 3.4 * (1 - smooth(13, 21, hl)) * smooth(0, 0.8, t - this.released);
      // low down it sways in a slow S, as smoke does on still air; higher, the broad field takes it
      const lean = Math.sin((t - this.released) * 1.25 + 0.6) * 1.5 * (1 - smooth(4, 10, hl));
      LV.set(lean + b[0] * 2.6 * smooth(0.5, 4, hl) + (src.x - L.x) * 0.08, climb + b[1] * 0.5, 0);
      L.addScaledVector(LV, dt);
    }
    const hl = L.y - src.y;
    const spread = 0.6 + 3.2 * smooth(0, 13, hl);
    for (let i = 0; i < this.n; i++) {
      const i3 = i * 3, age = t - this.birth[i];
      if (age < 0) { St[i3] = 0; continue; }
      const x = P[i3], y = P[i3 + 1], z = P[i3 + 2];
      const h = y - src.y;
      // settling: a mote that reached its height takes the nearest free star
      if (this.star[i] < 0 && (y > this.ceiling[i] || age > (i < this.reserved ? 5.5 : 11))) {
        this.star[i] = this.claim(i);
        this.settleAt[i] = t;
      }
      const fast = i < this.reserved ? this.nameSpeed : 1;   // the name's stars fly faster to their places
      const w = smooth(0, 2.4 / fast, t - this.settleAt[i]);
      // the flock: keep to its place in the body, which breathes and shears as it turns
      const hx = H[i3], hy = H[i3 + 1], hz = H[i3 + 2];
      const qx = L.x + spread * (hx * (1 + 0.3 * Math.sin(t * 0.55 + hy * 2.1)) + 0.45 * hy * Math.sin(t * 0.4));
      const qy = L.y + spread * 0.75 * hy * (1 + 0.35 * Math.cos(t * 0.47 + hx * 2.3)) - 0.6 * spread * hx * hx;
      const qz = L.z + 1 + spread * hz;
      // the smoke: laminar near the stone, curling into ribbons higher up and at the body's edges
      const turb = smooth(0.2, 6, h) * (0.6 + 0.6 * Math.min(1, Math.hypot(hx, hy)));
      curl(this.fine, x, y, t * 0.5, f);
      const pull = 1.1 * smooth(0, 1.2, age);
      let vx = LV.x + (qx - x) * pull + f[0] * 2.4 * turb;
      let vy = LV.y * this.lift[i] + (qy - y) * pull + f[1] * 1.5 * turb;
      let vz = (qz - z) * pull + Math.sin(t * 0.7 + i) * 0.3 * turb;
      if (this.star[i] >= 0) {
        const s = this.star[i] * 3, S = this.stars;
        const k = 1.5 * fast * w;
        vx = vx * (1 - w) + (S[s] - x) * k;
        vy = vy * (1 - w) + (S[s + 1] - y) * k;
        vz = vz * (1 - w) + (S[s + 2] - z) * k;
        if (w >= 1 && St[i3 + 1] < 1) { this.settled++; this.onSettle?.(i); }
      }
      V[i3] += (vx - V[i3]) * ease; V[i3 + 1] += (vy - V[i3 + 1]) * ease; V[i3 + 2] += (vz - V[i3 + 2]) * ease;
      P[i3] += V[i3] * dt; P[i3 + 1] += V[i3 + 1] * dt; P[i3 + 2] += V[i3 + 2] * dt;
      St[i3] = smooth(0, 0.35, age);
      St[i3 + 1] = w;
      St[i3 + 2] = Math.exp(-age * 0.55);
      if (w < 0.5) { cx += P[i3]; cy += P[i3 + 1]; cz += P[i3 + 2]; fly++; }
    }
    this.flying = fly / this.n;
    if (fly) this.centre.set(cx / fly, cy / fly, cz / fly);
    this.points.geometry.attributes.position.needsUpdate = true;
    this.points.geometry.attributes.aState.needsUpdate = true;
  }
}

// The afterglow: a half-resolution buffer that fades each frame and takes the
// moving motes, drawn over the scene additively.
export class Trails {
  constructor(renderer, scale = 0.5) {
    this.renderer = renderer;
    this.scale = scale;
    const opts = { type: THREE.HalfFloatType, depthBuffer: false };
    this.a = new THREE.WebGLRenderTarget(4, 4, opts);
    this.b = new THREE.WebGLRenderTarget(4, 4, opts);
    this.quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const quad = (frag, blending) => new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({
      uniforms: { uTex: { value: null }, uK: { value: 1 } }, depthTest: false, depthWrite: false, transparent: true, blending,
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
      fragmentShader: frag,
    }));
    this.fade = quad('uniform sampler2D uTex; uniform float uK; varying vec2 vUv; void main(){ gl_FragColor = texture2D(uTex, vUv) * uK; }', THREE.NoBlending);
    this.show = quad('uniform sampler2D uTex; uniform float uK; varying vec2 vUv; void main(){ vec4 c = texture2D(uTex, vUv); gl_FragColor = vec4(c.rgb * uK, 0.0); }', THREE.AdditiveBlending);   // light only: the sky behind the canvas still shows
    this.fadeScene = new THREE.Scene().add(this.fade);
    this.showScene = new THREE.Scene().add(this.show);
  }
  setSize(w, h) { this.a.setSize(Math.max(1, w * this.scale | 0), Math.max(1, h * this.scale | 0)); this.b.setSize(this.a.width, this.a.height); }
  // keep: how much of the trail survives a 60 fps frame
  render(scene, camera, swarm, dt, keep = 0.93) {
    const r = this.renderer;
    this.fade.material.uniforms.uTex.value = this.a.texture;
    this.fade.material.uniforms.uK.value = Math.pow(keep, dt * 60);
    r.setRenderTarget(this.b);
    r.render(this.fadeScene, this.quadCam);
    const was = r.autoClear;
    r.autoClear = false;
    swarm.material.uniforms.uTrail.value = 1;
    r.render(scene, camera);
    swarm.material.uniforms.uTrail.value = 0;
    r.autoClear = was;
    r.setRenderTarget(null);
    [this.a, this.b] = [this.b, this.a];
  }
  composite(gain = 1) {
    const r = this.renderer, was = r.autoClear;
    this.show.material.uniforms.uTex.value = this.a.texture;
    this.show.material.uniforms.uK.value = gain;
    r.autoClear = false;
    r.render(this.showScene, this.quadCam);
    r.autoClear = was;
  }
}
