// Rendering for the cave: stone voxels lit by the lantern (and the meteors),
// soft mist sprites lit by the same lights, additive glow, and a final pass
// with lantern haze, vignette, grain and the fade.
import * as THREE from 'three';

export const MAX_LIGHTS = 6;

// shared lighting: the lantern plus a few short-lived lights (meteors, impacts)
const LIGHT_GLSL = /* glsl */ `
  uniform vec4 uLantern;      // xyz, radius
  uniform vec3 uLanternCol;   // colour * intensity
  uniform vec4 uLightP[${MAX_LIGHTS}];
  uniform vec3 uLightC[${MAX_LIGHTS}];
  float att(float d, float R) { float x = d / R; return exp(-2.4 * x * x) + 0.05 / (1.0 + 8.0 * x * x); }
`;

const voxelVert = /* glsl */ `
  attribute vec4 aPos;     // x y zFront rnd
  attribute vec4 aC0;      // linear rgb, metal
  attribute vec4 aC1;
  attribute vec4 aC2;
  attribute vec4 aT;       // t1 t2 dz1 dz2
  attribute vec3 aE;       // emission after t1 (cools), live emission (loose tiles), edge strength
  uniform float uTime, uDepth, uTileMode;
  uniform sampler2D tGloam;
  uniform vec2 uGloamSize;
  varying vec3 vGl;
  varying vec3 vWorld, vN, vCol;
  varying float vMetal, vEmit, vTw, vEdge;
  varying vec2 vTilt, vUv;
  varying float vRec, vFront;
  #ifdef TILE
  attribute vec3 aRot;   // a loose tile tumbles: euler angles
  mat3 rotOf(vec3 r) {
    float cx = cos(r.x), sx = sin(r.x), cy = cos(r.y), sy = sin(r.y), cz = cos(r.z), sz = sin(r.z);
    return mat3(cy * cz, cy * sz, -sy, sx * sy * cz - cx * sz, sx * sy * sz + cx * cz, sx * cy, cx * sy * cz + sx * sz, cx * sy * sz - sx * cz, cx * cy);
  }
  #endif
  float h1(float n) { return fract(sin(n) * 43758.5453); }
  void main() {
    float s1 = smoothstep(0.0, 0.45, uTime - aT.x);
    float s2 = smoothstep(0.0, 0.55, uTime - aT.y);
    float dz = aT.z * smoothstep(0.0, 0.3, uTime - aT.x) + aT.w * smoothstep(0.0, 0.7, uTime - aT.y);
    vec4 c = mix(mix(aC0, aC1, s1), aC2, s2);
    // the Gloam, read from its field on the voxel grid
    vec4 gl = texture2D(tGloam, (floor(aPos.xy + 0.5) + 0.5) / uGloamSize);
    float body = gl.r, scar = gl.b * (1.0 - uTileMode);
    // how far the rock has been broken away here: the crag goes dark with depth
    float rec = max(0.0, -dz);
    vRec = rec * (1.0 - body);
    // the Gloam wells up out of the depths: its body fills a crack nearly to the surface
    dz += (body * (0.65 + rec * 0.85) - scar * 0.12) * (1.0 - uTileMode);
    // paint it has touched dies: drained to grey and darkened; its body is black rock
    float lumC = dot(c.rgb, vec3(0.3, 0.5, 0.2));
    c.rgb = mix(c.rgb, vec3(lumC) * 0.22, scar * 0.85);
    c.a *= 1.0 - max(scar * 0.8, body);
    c.rgb = mix(c.rgb, vec3(0.006, 0.006, 0.009), body * (1.0 - 0.45 * uTileMode));
    vGl = vec3(body, gl.g, gl.a);
    vCol = c.rgb; vMetal = c.a;
    vEmit = aE.x * s1 * (1.0 - s2) * (0.25 + 0.75 * exp(-max(uTime - aT.x, 0.0) * 0.9)) + aE.y;
    #ifdef TILE
    mat3 R = rotOf(aRot);
    vec3 w = aPos.xyz + R * vec3(position.xy, position.z * uDepth) + vec3(0.0, 0.0, -0.5 * uDepth);
    vN = R * normal;
    #else
    vec3 w = vec3(aPos.x + position.x, aPos.y + position.y, aPos.z + dz + (position.z - 0.5) * uDepth);
    vN = normal;
    #endif
    vFront = aPos.z + dz;
    vWorld = w; vUv = uv; vEdge = aE.z;
    // per-voxel constants worked out here: hashing an interpolated varying stripes
    vTilt = (vec2(h1(aPos.w * 91.7), h1(aPos.w * 13.1)) - 0.5) * 1.1;
    vTw = pow(0.5 + 0.5 * sin(uTime * (1.1 + aPos.w * 2.3) + aPos.w * 60.0), 28.0);
    gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
  }
`;

const voxelFrag = /* glsl */ `
  ${LIGHT_GLSL}
  uniform vec3 uAmb;
  uniform float uTime, uExposure, uDebug;
  varying vec3 vWorld, vN, vCol;
  varying float vMetal, vEmit, vTw, vEdge;
  varying vec2 vTilt, vUv;
  varying vec3 vGl;
  varying float vRec, vFront;
  void light(vec3 P, vec3 col, float R, vec3 n, vec3 nf, vec3 V, inout vec3 diff, inout vec3 spec) {
    vec3 L = P - vWorld; float d = length(L); L /= d;
    float a = att(d, R);
    diff += col * a * max(dot(n, L), 0.0);
    vec3 Hh = normalize(L + V);
    spec += col * a * pow(max(dot(nf, Hh), 0.0), 30.0);
  }
  void main() {
    vec3 n = normalize(vN);
    // gold is laid on in flakes, each tilted its own way, so it glints as the flame moves
    vec3 nf = n;
    if (vMetal > 0.01 && n.z > 0.5) nf = normalize(vec3(vTilt * vMetal, 1.0));
    vec3 V = normalize(cameraPosition - vWorld);
    vec3 diff = vec3(0.0), spec = vec3(0.0);
    light(uLantern.xyz, uLanternCol, uLantern.w, n, nf, V, diff, spec);
    for (int i = 0; i < ${MAX_LIGHTS}; i++) {
      if (uLightP[i].w > 0.0) light(uLightP[i].xyz, uLightC[i], uLightP[i].w, n, nf, V, diff, spec);
    }
    vec3 col = vCol * (uAmb + diff);
    float lum = dot(diff, vec3(0.3, 0.5, 0.2));
    // a damp sheen on bare stone; gold answers the light with its own colour
    col += spec * 0.03 * (1.0 - vMetal) * (1.0 - vGl.x);
    col += vMetal * (diff * vCol * 0.9 + spec * (vCol * 2.6 + 0.15) + vTw * lum * vCol * 2.0);
    // each voxel's edges catch a little less light: the grid reads, like the game's creases
    vec2 e = min(vUv, 1.0 - vUv);
    // only where the rock actually steps: flat stretches don't read as tiles
    col *= 1.0 - max(vEdge, vGl.x) * 0.32 * (1.0 - smoothstep(0.0, 0.12, min(e.x, e.y)));
    // the crag: each layer down is darker, to black at the bottom; side walls darken as they go down
    col *= 1.0 - 0.96 * smoothstep(1.2, 4.4, vRec);
    col *= exp(-max(0.0, vFront - vWorld.z) * 0.6);
    // the Gloam's body has an oily sheen; the cold from somewhere else breathes at its rims and in the fissure
    col += spec * vGl.x * 0.5 * (1.0 - abs(n.z));   // only its raised edges catch the light
    vec3 cold = mix(vec3(0.42, 0.3, 0.95), vec3(0.3, 0.9, 0.95), 0.6);
    // (gamma lifts any glow over black a lot: the body itself gives none, only a rare pulse)
    col += cold * (vGl.y * 0.5 * (1.0 - vGl.x) + vGl.x * vGl.z * vGl.z * 0.003);
    col += vEmit * vec3(1.0, 0.55, 0.2);
    col = 1.0 - exp(-col * uExposure);
    gl_FragColor = vec4(pow(col, vec3(1.0 / 2.2)), 1.0);
    if (uDebug > 0.5) gl_FragColor = vec4(vGl, 1.0);
    if (uDebug > 1.5) gl_FragColor = vec4(vCol * 4.0, 1.0);
  }
`;

export function lightUniforms() {
  return {
    uLantern: { value: new THREE.Vector4(0, 0, 6, 20) },
    uLanternCol: { value: new THREE.Vector3() },
    uLightP: { value: Array.from({ length: MAX_LIGHTS }, () => new THREE.Vector4()) },
    uLightC: { value: Array.from({ length: MAX_LIGHTS }, () => new THREE.Vector3()) },
  };
}

// a box without its back face: the wall is only ever seen from the front
function voxelGeometry() {
  const box = new THREE.BoxGeometry(1, 1, 1);
  const g = new THREE.InstancedBufferGeometry();
  g.setAttribute('position', box.getAttribute('position'));
  g.setAttribute('normal', box.getAttribute('normal'));
  g.setAttribute('uv', box.getAttribute('uv'));
  g.setIndex(Array.from(box.getIndex().array).slice(0, 30));
  return g;
}

export function voxelMaterial(shared, depth, tileMode = 0) {
  return new THREE.ShaderMaterial({
    defines: tileMode ? { TILE: '' } : {},
    uniforms: { ...shared, uDepth: { value: depth }, uTileMode: { value: tileMode } },
    vertexShader: voxelVert, fragmentShader: voxelFrag,
  });
}

export function wallMeshes(chunks, material) {
  return chunks.map((c) => {
    const g = voxelGeometry();
    const ia = (arr, n) => new THREE.InstancedBufferAttribute(arr, n);
    g.setAttribute('aPos', ia(c.aPos, 4)); g.setAttribute('aC0', ia(c.aC0, 4)); g.setAttribute('aC1', ia(c.aC1, 4));
    g.setAttribute('aC2', ia(c.aC2, 4)); g.setAttribute('aT', ia(c.aT, 4)); g.setAttribute('aE', ia(c.aE, 3));
    g.instanceCount = c.n;
    const cx = (c.x0 + c.x1 - 1) / 2, cy = 52;
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(cx, cy, 0), Math.hypot((c.x1 - c.x0) / 2 + 1, 54, 4));
    return new THREE.Mesh(g, material);
  });
}

// Loose tiles (the panel 3 moon and stars): same look, positions set every frame.
export class Tiles {
  // specs[i]: { color: THREE.Color, metal, crackT }: a gold flake, a chip of rock; crackT darkens it
  constructor(count, material, specs = []) {
    const g = voxelGeometry();
    this.aPos = new THREE.InstancedBufferAttribute(new Float32Array(count * 4), 4).setUsage(THREE.DynamicDrawUsage);
    const e = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) e[i * 3 + 2] = 1;
    this.aE = new THREE.InstancedBufferAttribute(e, 3).setUsage(THREE.DynamicDrawUsage);
    const gold = new THREE.Color(0xf0c050);
    const c = new Float32Array(count * 4), c1 = new Float32Array(count * 4);
    const t = new Float32Array(count * 4);
    for (let i = 0; i < count; i++) {
      const sp = specs[i] ?? {};
      const col = sp.color ?? gold, metal = sp.metal ?? 1;
      c.set([col.r * (0.92 + 0.16 * Math.random()), col.g, col.b, metal], i * 4);
      c1.set([0.012, 0.01, 0.01, 0], i * 4);
      t.set([sp.crackT ?? 1e6, 1e6, 0, 0], i * 4);
    }
    this.aRot = new THREE.InstancedBufferAttribute(new Float32Array(count * 3), 3).setUsage(THREE.DynamicDrawUsage);
    g.setAttribute('aRot', this.aRot);
    g.setAttribute('aPos', this.aPos); g.setAttribute('aE', this.aE);
    g.setAttribute('aC0', new THREE.InstancedBufferAttribute(c, 4));
    g.setAttribute('aC1', new THREE.InstancedBufferAttribute(c1, 4));
    g.setAttribute('aC2', new THREE.InstancedBufferAttribute(c1, 4));
    g.setAttribute('aT', new THREE.InstancedBufferAttribute(t, 4));
    g.instanceCount = count;
    this.mesh = new THREE.Mesh(g, material);
    this.mesh.frustumCulled = false;
    this.count = count;
  }
  set(i, x, y, z, rnd, emit, rx = 0, ry = 0, rz = 0) {
    this.aRot.array.set([rx, ry, rz], i * 3);
    this.aPos.array.set([x, y, z, rnd], i * 4);
    this.aE.array[i * 3 + 1] = emit;
  }
  commit() { this.aPos.needsUpdate = true; this.aE.needsUpdate = true; this.aRot.needsUpdate = true; }
}

// ---------------------------------------------------------------- sprites
// Soft puffs of mist, painted on a canvas the way the map's mist ribbons are.
function mistAtlas() {
  const S = 128, c = document.createElement('canvas');
  c.width = c.height = S * 2;
  const g = c.getContext('2d'), img = g.createImageData(S * 2, S * 2);
  const hash = (x, y, s) => { const h = Math.sin(x * 127.1 + y * 311.7 + s * 74.7) * 43758.5453; return h - Math.floor(h); };
  const vn = (x, y, s) => {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    const a = hash(xi, yi, s), b = hash(xi + 1, yi, s), cc = hash(xi, yi + 1, s), d = hash(xi + 1, yi + 1, s);
    return a + (b - a) * u + (cc - a) * v + (a - b - cc + d) * u * v;
  };
  const fbm = (x, y, s) => { let f = 0, a = 0.5; for (let i = 0; i < 5; i++) { f += a * vn(x, y, s + i); x *= 2; y *= 2; a *= 0.5; } return f; };
  for (let v = 0; v < 4; v++) for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const dx = (x + 0.5) / S - 0.5, dy = (y + 0.5) / S - 0.5;
    const r = Math.sqrt(dx * dx + dy * dy) * 2;
    const n = fbm(x / S * 4, y / S * 4, v * 13);
    // a soft round falloff, eaten into by noise so the edge is wispy, never an ellipse
    const fall = Math.max(0, 1 - r);
    const a = Math.max(0, Math.min(1, fall * fall * (0.25 + 1.6 * n * n) * (1.2 - r * 0.4)));
    const i = ((y + Math.floor(v / 2) * S) * S * 2 + x + (v % 2) * S) * 4;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = Math.round(a * 255); img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.NoColorSpace;
  return t;
}

const spriteVert = /* glsl */ `
  ${LIGHT_GLSL}
  attribute vec4 aP;    // x y z size
  attribute vec4 aQ;    // angle, alpha, variant, stretch
  attribute vec3 aC;    // colour
  uniform vec3 uAmb;
  uniform float uLit;   // 1: lit like stone (mist); 0: self-lit (glow)
  varying vec2 vUv;
  varying vec3 vCol;
  varying float vA;
  varying vec2 vOff;
  void main() {
    float c = cos(aQ.x), s = sin(aQ.x);
    vec2 q = position.xy * vec2(aP.w * aQ.w, aP.w);
    q = mat2(c, s, -s, c) * q;
    vec3 w = vec3(aP.xy + q, aP.z);
    vUv = position.xy + 0.5; vA = aQ.y;
    float vv = floor(aQ.z + 0.5);
    vOff = vec2(mod(vv, 2.0), floor(vv / 2.0 + 0.01)) * 0.5;
    vec3 lit = vec3(1.0);
    if (uLit > 0.5) {
      vec3 Pc = vec3(aP.xy, aP.z);
      lit = vec3(0.07, 0.08, 0.12) + uLanternCol * att(length(uLantern.xyz - Pc), uLantern.w) * 0.3;
      for (int i = 0; i < ${MAX_LIGHTS}; i++) if (uLightP[i].w > 0.0) lit += uLightC[i] * att(length(uLightP[i].xyz - Pc), uLightP[i].w) * 0.45;
    }
    vCol = aC * lit;
    gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
  }
`;
const mistFrag = /* glsl */ `
  uniform sampler2D tMist;
  uniform float uExposure;
  varying vec2 vUv, vOff; varying vec3 vCol; varying float vA;
  void main() {
    float a = texture2D(tMist, vOff + clamp(vUv, 0.01, 0.99) * 0.5).r * vA;
    vec3 col = 1.0 - exp(-vCol * uExposure);
    gl_FragColor = vec4(pow(col, vec3(1.0 / 2.2)), a);
  }
`;
const glowFrag = /* glsl */ `
  uniform float uExposure;
  varying vec2 vUv, vOff; varying vec3 vCol; varying float vA;
  void main() {
    vec2 d = vUv - 0.5;
    float r2 = dot(d, d) * 4.0;
    float a = (exp(-r2 * 5.0) + 0.35 * exp(-r2 * 1.6)) * vA * smoothstep(1.0, 0.7, r2);
    vec3 col = 1.0 - exp(-vCol * a * uExposure);
    gl_FragColor = vec4(pow(col, vec3(1.0 / 2.2)), 1.0);
  }
`;

export class Sprites {
  constructor(capacity, shared, { glow = false } = {}) {
    const g = new THREE.InstancedBufferGeometry();
    const plane = new THREE.PlaneGeometry(1, 1);
    g.setAttribute('position', plane.getAttribute('position'));
    g.setIndex(plane.getIndex());
    this.aP = new THREE.InstancedBufferAttribute(new Float32Array(capacity * 4), 4).setUsage(THREE.DynamicDrawUsage);
    this.aQ = new THREE.InstancedBufferAttribute(new Float32Array(capacity * 4), 4).setUsage(THREE.DynamicDrawUsage);
    this.aC = new THREE.InstancedBufferAttribute(new Float32Array(capacity * 3), 3).setUsage(THREE.DynamicDrawUsage);
    g.setAttribute('aP', this.aP); g.setAttribute('aQ', this.aQ); g.setAttribute('aC', this.aC);
    g.instanceCount = 0;
    this.geo = g; this.capacity = capacity; this.n = 0;
    const uniforms = { ...shared, uLit: { value: glow ? 0 : 1 } };
    if (!glow) uniforms.tMist = { value: mistAtlas() };
    this.mesh = new THREE.Mesh(g, new THREE.ShaderMaterial({
      uniforms, vertexShader: spriteVert, fragmentShader: glow ? glowFrag : mistFrag,
      transparent: true, depthWrite: false, depthTest: false,
      blending: glow ? THREE.AdditiveBlending : THREE.NormalBlending,
    }));
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = glow ? 3 : 2;
  }
  begin() { this.n = 0; }
  add(x, y, z, size, angle, alpha, variant, stretch, r, g, b) {
    if (this.n >= this.capacity || alpha <= 0.002) return;
    const i = this.n++;
    this.aP.array.set([x, y, z, size], i * 4);
    this.aQ.array.set([angle, alpha, variant, stretch], i * 4);
    this.aC.array.set([r, g, b], i * 3);
  }
  end() {
    this.geo.instanceCount = this.n;
    this.aP.needsUpdate = this.aQ.needsUpdate = this.aC.needsUpdate = true;
    this.aP.addUpdateRange?.(0, this.n * 4);
  }
}

// ---------------------------------------------------------------- final pass
export class Finish {
  constructor() {
    this.uniforms = {
      uHaze: { value: new THREE.Vector3(0.5, 0.4, 0) },   // lantern screen uv, strength
      uAspect: { value: 1 }, uFade: { value: 0 }, uTime: { value: 0 },
    };
    const m = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({
      uniforms: this.uniforms, depthTest: false, depthWrite: false, transparent: true,
      blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor,
      vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
      fragmentShader: /* glsl */ `
        uniform vec3 uHaze; uniform float uAspect, uFade, uTime;
        varying vec2 vUv;
        void main() {
          vec2 d = vUv - uHaze.xy; d.x *= uAspect;
          // warm air round the flame
          vec3 haze = vec3(1.0, 0.56, 0.24) * uHaze.z * (0.045 * exp(-dot(d, d) * 10.0) + 0.015 * exp(-dot(d, d) * 2.0));
          vec2 v = vUv - 0.5; v.x *= mix(1.0, uAspect, 0.5);
          float vig = smoothstep(0.3, 0.9, length(v) * 1.2) * 0.7;
          float n = fract(sin(dot(gl_FragCoord.xy + fract(uTime * 7.0) * 91.0, vec2(12.9898, 78.233))) * 43758.5453);
          vec3 grain = vec3((n - 0.5) * 0.035);
          float a = max(vig, uFade);
          gl_FragColor = vec4((haze + grain) * (1.0 - uFade), a);
        }`,
    }));
    m.frustumCulled = false;
    m.renderOrder = 10;
    this.scene = new THREE.Scene();
    this.scene.add(m);
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  }
}

