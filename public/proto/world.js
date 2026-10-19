// Direction A: the map as one three.js world under one camera. Stars and a
// dawn horizon above, a sea of cloud below with each chapter's islands poking
// out of it, cloud banks over chapters not yet reached, shrine beams, and the
// trail as a gold dashed ribbon on the cloud. The camera tilts from the stars
// down to the map (title pan u: 0..1), then glides along it (scroll s, px).
import * as THREE from 'three';
import { Soup, island, soupGeometry, puffGeometry, KITS, mixHex, lightOf, rampColor } from './islands.js';
import { rng, trailXAt, COL } from './data.js';

THREE.ColorManagement.enabled = false;
const C = (h) => new THREE.Color(h);
const lum = (c) => 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;

// colours of a chapter's cloud sea, from its sky
export function seaColours(p) {
  const dark = lum(C(p.skyTop)) < 0.35;
  const sea = C(p.skyTop).lerp(C(p.skyBottom), dark ? 0.55 : 0.35);
  if (!dark) sea.lerp(C(0xffffff), 0.18);
  const top = dark ? C(p.skyBottom).lerp(C(p.glow), 0.35) : C(p.glow).lerp(C(0xffffff), 0.35);
  const side = dark ? C(p.skyTop).lerp(C(p.skyBottom), 0.75) : C(p.skyTop).lerp(C(p.skyBottom), 0.55).lerp(C(0xffffff), 0.12);
  return { sea, top, side, dark };
}

const NOISE = /* glsl */ `
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float vnoise(vec2 p) {
    vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }`;
const FOG = /* glsl */ `
  uniform vec3 uFogCol; uniform float uFogNear, uFogFar;
  vec3 fogged(vec3 c, vec3 w) { return mix(c, uFogCol, smoothstep(uFogNear, uFogFar, distance(w, cameraPosition))); }`;
const SEA_LOOKUP = /* glsl */ `
  uniform sampler2D uSea; uniform float uZ0, uZ1;
  vec3 seaAt(float z) { return texture2D(uSea, vec2(clamp((z - uZ0) / (uZ1 - uZ0), 0.0, 1.0), 0.5)).rgb; }`;

export class World {
  constructor(canvas, map, opts = {}) {
    this.map = map;
    this.opts = { hfov: 26, mapPitch: -90, topPitch: -90, titlePitch: 34, ...opts };
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    this.renderer.setClearColor(0x161b36);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, 1, 5, 60000);
    this.camera.rotation.order = 'YXZ';
    this.camera.matrixWorldAutoUpdate = false;   // setView() owns the view matrix (it adds a shear)
    this.time = 0;
    this.shared = {
      uFogCol: { value: C(0xf6dcd2) }, uFogNear: { value: 2600 }, uFogFar: { value: 17000 },
      uSea: { value: null }, uZ0: { value: -9000 }, uZ1: { value: map.height + 4000 }, uTime: { value: 0 },
      uLight: { value: new THREE.Vector2(-0.45, 0.9).normalize() },
    };
    this.parts = new Float32Array(16);
    this.buildSeaTexture();
    this.buildSky();
    this.buildStars();
    this.buildSea();
    this.buildScenery();
    this.buildPath();
    this.buildShrines();
  }

  // ---------------------------------------------------------------- colour script
  buildSeaTexture() {
    const N = 512, data = new Uint8Array(N * 4);
    const { uZ0, uZ1 } = this.shared;
    const regions = this.map.regions;
    const dawn = seaColours(regions[0].base);
    const night = seaColours(regions[regions.length - 1].base);
    for (let i = 0; i < N; i++) {
      const z = uZ0.value + (i / (N - 1)) * (uZ1.value - uZ0.value);
      let c;
      if (z < regions[0].top) c = dawn.sea.clone().lerp(C(0xfff3e6), Math.min(1, (regions[0].top - z) / 6000) * 0.5);
      else if (z > this.map.drift.top) c = night.sea.clone();
      else {
        // blend across each boundary over ~260 px, centred on it
        let k = regions.findIndex((r) => z < r.bottom);
        if (k < 0) k = regions.length - 1;
        const r = regions[k];
        c = seaColours(r.base).sea.clone();
        const prev = regions[k - 1], next = regions[k + 1];
        const w = 260;
        if (prev && z < r.top + w / 2) c = seaColours(prev.base).sea.clone().lerp(c, 0.5 + (z - r.top) / w);
        else if (next && z > r.bottom - w / 2) c = c.lerp(seaColours(next.base).sea, (z - (r.bottom - w / 2)) / w * 0.5);
      }
      data.set([c.r * 255, c.g * 255, c.b * 255, 255], i * 4);
    }
    const tex = new THREE.DataTexture(data, N, 1);
    tex.magFilter = tex.minFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
    this.shared.uSea.value = tex;
  }

  // ---------------------------------------------------------------- sky
  buildSky() {
    const mat = new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      uniforms: { uFogCol: this.shared.uFogCol },
      vertexShader: /* glsl */ `varying vec3 vDir; void main() { vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uFogCol; varying vec3 vDir;
        void main() {
          vec3 d = normalize(vDir); float e = d.y;
          // night above, dawn at the horizon (First Light), the far haze below it
          vec3 c = mix(vec3(1.0, 0.925, 0.86), vec3(0.97, 0.80, 0.78), smoothstep(0.0, 0.035, e));
          c = mix(c, vec3(0.74, 0.58, 0.72), smoothstep(0.02, 0.11, e));
          c = mix(c, vec3(0.30, 0.32, 0.53), smoothstep(0.08, 0.30, e));
          c = mix(c, vec3(0.13, 0.15, 0.30), smoothstep(0.25, 0.62, e));
          c = mix(c, vec3(0.07, 0.085, 0.19), smoothstep(0.6, 1.0, e));
          // the sun just under the horizon, to the north
          float a = max(0.0, dot(normalize(vec3(d.x, 0.0, d.z)), vec3(0.0, 0.0, -1.0)));
          c += vec3(1.0, 0.82, 0.62) * pow(a, 18.0) * exp(-max(e, 0.0) * 14.0) * 0.35;
          if (e < 0.0) c = uFogCol;
          gl_FragColor = vec4(c, 1.0);
        }`,
    });
    this.sky = new THREE.Mesh(new THREE.SphereGeometry(40000, 48, 24), mat);
    this.sky.renderOrder = -10;
    this.scene.add(this.sky);
  }

  // three shells of stars at different distances: as the camera cranes down
  // and tilts, the near shell slides faster than the far one (the parallax)
  buildStars() {
    this.stars = new THREE.Group();
    // [radius, count, size px, brightness, rate]: rate is how fast a shell
    // follows the tilt (far ones slower): the parallax, an artistic one
    const layers = [[14000, 900, 2.0, 0.9, 0.3], [5200, 320, 2.8, 1.2, 0.5], [2400, 60, 4.2, 1.6, 0.72]];
    const rand = rng('stars');
    for (const [R, n, size, bright, rate] of layers) {
      const pos = new Float32Array(n * 3), seed = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        const az = rand() * Math.PI * 2, el = Math.asin(0.04 + rand() * 0.96);
        pos.set([Math.cos(el) * Math.sin(az) * R, Math.sin(el) * R, -Math.cos(el) * Math.cos(az) * R], i * 3);
        seed[i] = rand();
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      g.setAttribute('seed', new THREE.BufferAttribute(seed, 1));
      const m = new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
        uniforms: { uTime: this.shared.uTime, uSize: { value: size }, uBright: { value: bright }, uAlpha: { value: 1 }, uDpr: { value: 1 } },
        vertexShader: /* glsl */ `
          attribute float seed; uniform float uTime, uSize, uDpr; varying float vA; varying float vSeed;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mv;
            vec3 dir = normalize((modelMatrix * vec4(position, 0.0)).xyz);   // fade at the true horizon
            vSeed = seed;
            vA = smoothstep(0.05, 0.3, dir.y) * (0.55 + 0.45 * sin(uTime * (0.6 + seed * 1.7) + seed * 40.0));
            gl_PointSize = uSize * uDpr * (0.6 + seed * seed * 1.4);
          }`,
        fragmentShader: /* glsl */ `
          uniform float uBright, uAlpha; varying float vA; varying float vSeed;
          void main() {
            float r = length(gl_PointCoord - 0.5) * 2.0;
            float a = smoothstep(1.0, 0.0, r);
            vec3 c = mix(vec3(0.85, 0.9, 1.0), vec3(1.0, 0.92, 0.8), step(0.7, vSeed));
            gl_FragColor = vec4(c * a * a * vA * uBright * uAlpha, 1.0);
          }`,
      });
      const pts = new THREE.Points(g, m);
      pts.userData.rate = rate;
      pts.frustumCulled = false;
      this.stars.add(pts);
    }
    this.scene.add(this.stars);
  }

  // ---------------------------------------------------------------- the sea of cloud
  buildSea() {
    const g = new THREE.PlaneGeometry(9000, this.shared.uZ1.value - this.shared.uZ0.value + 60000, 1, 1).rotateX(-Math.PI / 2);
    g.translate(0, 0, (this.shared.uZ0.value + this.shared.uZ1.value) / 2 - 30000);
    const m = new THREE.ShaderMaterial({
      uniforms: { ...this.shared },
      vertexShader: /* glsl */ `varying vec3 vW; void main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
      fragmentShader: /* glsl */ `${NOISE}${FOG}${SEA_LOOKUP}
        uniform float uTime; varying vec3 vW;
        void main() {
          vec3 c = seaAt(vW.z);
          float n = vnoise(vW.xz * 0.0045 + vec2(uTime * 0.01, 0.0)) * 0.65 + vnoise(vW.xz * 0.013 - vec2(0.0, uTime * 0.006)) * 0.35;
          c *= 0.965 + 0.07 * n;
          gl_FragColor = vec4(fogged(c, vW), 1.0);
        }`,
    });
    this.sea = new THREE.Mesh(g, m);
    this.sea.renderOrder = -5;
    this.scene.add(this.sea);
  }

  // ---------------------------------------------------------------- islands and clouds
  buildScenery() {
    const map = this.map;
    const landMat = new THREE.ShaderMaterial({
      uniforms: { ...this.shared },
      vertexColors: true,
      vertexShader: /* glsl */ `varying vec3 vW; varying vec3 vC; void main() { vC = color; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
      fragmentShader: /* glsl */ `${FOG}${SEA_LOOKUP}
        varying vec3 vW; varying vec3 vC;
        void main() {
          // bases sink into the cloud: the same haze as the block's base in the game
          vec3 c = mix(seaAt(vW.z), vC, 0.25 + 0.75 * smoothstep(-6.0, 80.0, vW.y));
          gl_FragColor = vec4(fogged(c, vW), 1.0);
        }`,
    });
    this.landMat = landMat;
    // puffs: one instanced draw per chapter so off-screen chapters cost nothing
    const puff = puffGeometry();
    const cloudMat = new THREE.ShaderMaterial({
      uniforms: { ...this.shared, uParts: { value: this.parts } },
      vertexShader: /* glsl */ `
        attribute vec3 iPos, iScale, iTop, iSide; attribute float iBank, iDir, iSeed;
        uniform float uParts[16]; uniform float uTime;
        varying vec3 vW, vN, vTop, vSide;
        void main() {
          vec3 s = iScale, p = iPos;
          if (iBank >= 0.0) {
            // the cloud parts from the trail outward: billows near the middle go
            // first, drift aside, thin and settle down into the sea
            float k = uParts[int(iBank)];
            float e = clamp(k * 1.15 - abs(iPos.x) / 1700.0 - iSeed * 0.1, 0.0, 1.0);
            p.x += iDir * e * (150.0 + 110.0 * iSeed);
            p.y -= e * (s.y * 1.5 + 30.0);
            p.z += e * (iSeed - 0.5) * 60.0;
            s *= 1.0 - 0.5 * e;
          }
          p.x += sin(uTime * 0.05 + iSeed * 6.283) * 5.0;
          vN = normalize(normal / iScale);
          vec4 w = vec4(position * s + p, 1.0);
          vW = w.xyz; vTop = iTop; vSide = iSide;
          gl_Position = projectionMatrix * viewMatrix * w;
        }`,
      fragmentShader: /* glsl */ `${FOG}
        uniform vec2 uLight; varying vec3 vW, vN, vTop, vSide;
        void main() {
          vec3 n = normalize(vN);
          // soft toon: a lit crown, sky-coloured flanks, a little shadow on the side away from the light
          float l = dot(normalize(n.xz + 1e-4), uLight) * 0.5 + 0.5;
          vec3 side = mix(vSide * 0.93, vSide * 1.03, smoothstep(0.2, 0.8, l));
          vec3 c = mix(side, vTop, smoothstep(0.15, 0.7, n.y));
          c = mix(c, vSide * 0.9, smoothstep(-0.1, -0.6, n.y));
          gl_FragColor = vec4(fogged(c, vW), 1.0);
        }`,
    });
    this.cloudMat = cloudMat;
    this.chunks = [];

    const all = [...map.regions, null];   // null: the vista beyond the map's top
    for (const r of all) {
      const rand = rng(r ? r.name : 'vista');
      const soup = new Soup();
      const puffs = [];
      const p = r ? r.base : map.regions[0].base;
      const light = lightOf(p);
      const sc = seaColours(p);
      const kit = r ? KITS[r.name] ?? KITS['First Light'] : { kinds: ['peak'] };
      const addPuff = (x, y, z, sx, sy, sz, bank = -1, dir = 0, top = sc.top, side = sc.side) =>
        puffs.push({ x, y, z, sx, sy, sz, bank, dir, top, side, seed: rand() });
      const z0 = r ? r.top : -9000, z1 = r ? r.bottom : -200;
      const isles = [];
      if (r) {
        // the chapter's signature peak: tall enough to pierce its cloud bank
        const zt = r.labelZ + 150 + rand() * 120;
        const xt = trailXAt(map, zt);
        const hx = -Math.sign(xt || 1) * (110 + rand() * 40);
        isles.push({ x: hx, z: zt, size: 46 + rand() * 12, kind: kit.hero, hero: true });
        // the rest sit in the pockets the trail leaves, and out past the edges
        for (let z = z0 + 120; z < z1 - 60; z += 150 + rand() * 120) {
          const xt2 = trailXAt(map, z);
          const side = Math.abs(xt2) > 30 ? -Math.sign(xt2) : rand() < 0.5 ? -1 : 1;
          if (rand() < 0.75) isles.push({ x: side * (175 + rand() * 90), z, size: 26 + rand() * 22, kind: kit.kinds[Math.floor(rand() * kit.kinds.length)] });
          if (rand() < 0.8) isles.push({ x: -side * (300 + rand() * 260), z: z + rand() * 80, size: 40 + rand() * 40, kind: kit.kinds[Math.floor(rand() * kit.kinds.length)] });
        }
        for (const s of [r.shrine].filter(Boolean)) isles.push({ x: s.x, z: s.z, size: 22, kind: 'spire', shrine: true });
      } else {
        // far peaks along the horizon, seen from the title
        for (let i = 0; i < 11; i++) isles.push({ x: (rand() - 0.5) * 6000, z: -3200 - rand() * 4500, size: 340 + rand() * 460, kind: rand() < 0.6 ? 'peak' : 'mound', far: true });
      }
      for (const is of isles) {
        const o = new THREE.Vector3(is.x, 0, is.z);
        const h = island(soup, is.kind, o, is.size, rand, p, light, is.far ? {} : kit, is.hero);
        is.h = h;
        // cloud laps around each island's base
        const n = is.far ? 3 : is.shrine ? 2 : 3;
        for (let k = 0; k < n; k++) {
          const a = rand() * 6.28, d = is.size * (0.9 + rand() * 0.5);
          addPuff(is.x + Math.cos(a) * d, 2, is.z + Math.sin(a) * d * 0.7, is.size * (0.55 + rand() * 0.35), is.size * 0.28, is.size * (0.4 + rand() * 0.3));
        }
      }
      if (r) {
        // edge framing: billows along both sides, clear of the trail
        for (let z = z0; z < z1; z += 70 + rand() * 60) {
          for (const sd of [-1, 1]) {
            const x = sd * (215 + rand() * 120);
            if (Math.abs(x - trailXAt(map, z)) < 130) continue;
            addPuff(x, rand() * 8, z, 60 + rand() * 50, 18 + rand() * 14, 40 + rand() * 30);
          }
        }
        // a few low drifts on the open sea
        for (let i = 0; i < 4; i++) {
          const z = z0 + rand() * (z1 - z0), x = (rand() - 0.5) * 900;
          if (Math.abs(x - trailXAt(map, z)) > 160) addPuff(x, -4, z, 50 + rand() * 40, 10, 30 + rand() * 20);
        }
        // the bank over a chapter not yet reached: dense, a little brighter, tinted with its glow
        if (!r.reached) {
          // moonlit on dark chapters: a bank is always lighter than the sea it hides
          const btop = sc.dark ? C(0xdfe4f2).lerp(C(r.base.glow), 0.3).multiplyScalar(0.8) : C(0xfbf8fb).lerp(C(r.base.glow), 0.4);
          const bside = sc.dark ? C(r.base.skyBottom).lerp(C(0xc8cfe6), 0.35) : C(0xebe4ee).lerp(C(r.base.skyBottom), 0.22);
          // big soft billows, higher and rounder along the leading edge
          for (let z = z0 + 40; z < z1 + 60; z += 78 + rand() * 30) {
            const edge = Math.min(1, (z - z0) / 120);
            for (let x = -470; x <= 470; x += 96 + rand() * 40) {
              const big = 1.25 - 0.35 * edge;
              addPuff(x + (rand() - 0.5) * 40, 22 + rand() * 14, z + (rand() - 0.5) * 30, (78 + rand() * 40) * big, (30 + rand() * 12) * big, (74 + rand() * 24) * big, r.index, x < trailXAt(map, z) ? -1 : 1, btop, bside);
            }
          }
        }
      } else {
        for (let i = 0; i < 40; i++) addPuff((rand() - 0.5) * 7000, 0, -1200 - rand() * 7000, 220 + rand() * 260, 50, 140 + rand() * 120);
      }
      const chunk = { region: r, z0: z0 - 300, z1: z1 + 300, isles, maxH: Math.max(0, ...isles.map((i) => i.h)) };
      if (soup.p.length) {
        chunk.land = new THREE.Mesh(soupGeometry(soup), landMat);
        chunk.land.frustumCulled = false;
        this.scene.add(chunk.land);
      }
      if (puffs.length) {
        const g = new THREE.InstancedBufferGeometry();
        g.setIndex(puff.index);
        g.setAttribute('position', puff.getAttribute('position'));
        g.setAttribute('normal', puff.getAttribute('normal'));
        const f = (n) => new Float32Array(puffs.length * n);
        const A = { iPos: f(3), iScale: f(3), iTop: f(3), iSide: f(3), iBank: f(1), iDir: f(1), iSeed: f(1) };
        puffs.forEach((q, i) => {
          A.iPos.set([q.x, q.y, q.z], i * 3); A.iScale.set([q.sx, q.sy, q.sz], i * 3);
          A.iTop.set([q.top.r, q.top.g, q.top.b], i * 3); A.iSide.set([q.side.r, q.side.g, q.side.b], i * 3);
          A.iBank[i] = q.bank; A.iDir[i] = q.dir; A.iSeed[i] = q.seed;
        });
        for (const [k, v] of Object.entries(A)) g.setAttribute(k, new THREE.InstancedBufferAttribute(v, v.length / puffs.length));
        g.instanceCount = puffs.length;
        chunk.clouds = new THREE.Mesh(g, cloudMat);
        chunk.clouds.frustumCulled = false;
        chunk.puffCount = puffs.length;
        this.scene.add(chunk.clouds);
      }
      this.chunks.push(chunk);
    }
  }

  rebuildPath(map) {
    this.scene.remove(this.path);
    this.path.geometry.dispose();
    this.buildPath(map);
  }

  // ---------------------------------------------------------------- the trail
  buildPath(map = this.map) {
    const pos = [], aS = [], aKind = [], aEdge = [];
    const KIND = { gold: 0, faint: 2, hidden: 3 };
    const ribbon = (pts, kind, s0, w, spur = 0) => {
      let s = s0;
      for (let j = 0; j < pts.length - 1; j++) {
        const a = pts[j], b = pts[j + 1];
        const dx = b.x - a.x, dz = b.z - a.z, L = Math.hypot(dx, dz) || 1;
        const nx = -dz / L * w, nz = dx / L * w;
        const v = [[a.x - nx, a.z - nz, s, -1], [a.x + nx, a.z + nz, s, 1], [b.x + nx, b.z + nz, s + L, 1], [b.x - nx, b.z - nz, s + L, -1]];
        for (const i of [0, 1, 2, 0, 2, 3]) { pos.push(v[i][0], 1.5, v[i][1]); aS.push(v[i][2]); aKind.push(KIND[kind] + spur * 10); aEdge.push(v[i][3]); }
        s += L;
      }
      return s;
    };
    for (const seg of map.segments) ribbon(seg.pts, seg.kind, seg.s0, 4.2);
    for (const sp of map.spurs) ribbon(sp.pts, sp.kind, 0, 3.2, 1);
    const drawn = this.pathMat?.uniforms.uDrawn.value ?? 1e9;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('aS', new THREE.Float32BufferAttribute(aS, 1));
    g.setAttribute('aKind', new THREE.Float32BufferAttribute(aKind, 1));
    g.setAttribute('aEdge', new THREE.Float32BufferAttribute(aEdge, 1));
    this.pathMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false,
      uniforms: { ...this.shared, uDrawn: { value: drawn } },
      vertexShader: /* glsl */ `attribute float aS, aKind, aEdge; varying float vS, vKind, vEdge; varying vec3 vW;
        void main() { vS = aS; vKind = aKind; vEdge = aEdge; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
      fragmentShader: /* glsl */ `${FOG}${SEA_LOOKUP}
        uniform float uDrawn, uTime; varying float vS, vKind, vEdge; varying vec3 vW;
        void main() {
          float spur = step(9.5, vKind); float kind = vKind - spur * 10.0;
          float side = abs(vEdge);
          vec3 gold = vec3(0.914, 0.725, 0.286), light = vec3(1.0, 0.93, 0.7), deep = vec3(0.62, 0.43, 0.15);
          float drawn = step(vS, uDrawn);
          if (kind < 0.5 && drawn > 0.5) {
            // gold dashes: long on the trail, short on a shrine's spur
            float period = spur > 0.5 ? 9.0 : 15.0, duty = spur > 0.5 ? 0.42 : 0.56;
            float d = fract(vS / period);
            float on = smoothstep(0.0, 0.06, d) * (1.0 - smoothstep(duty - 0.06, duty, d));
            float body = 1.0 - smoothstep(0.55, 1.0, side);
            vec3 c = mix(deep, gold, smoothstep(0.95, 0.45, side));
            c = mix(c, light, (1.0 - smoothstep(0.0, 0.35, side)) * 0.6);
            gl_FragColor = vec4(c, on * body * 0.95);
          } else if (kind < 3.5) {
            // faint dots ahead: where the trail will go
            float d = fract(vS / 12.0);
            float on = (1.0 - smoothstep(0.12, 0.2, abs(d - 0.5))) * (1.0 - smoothstep(0.45, 0.9, side));
            vec3 c = mix(seaAt(vW.z), vec3(1.0), 0.6);
            gl_FragColor = vec4(c, on * (kind > 2.5 ? 0.0 : 0.55));
          } else discard;
        }`,
    });
    this.path = new THREE.Mesh(g, this.pathMat);
    this.path.frustumCulled = false;
    this.path.renderOrder = 2;
    this.scene.add(this.path);
  }

  // ---------------------------------------------------------------- shrines: a gem over a spire, and its light
  buildShrines() {
    this.shrines = [];
    const gemGeo = new THREE.OctahedronGeometry(1, 0);
    const beamGeo = new THREE.PlaneGeometry(1, 1).translate(0, 0.5, 0);
    for (const r of this.map.regions) {
      const s = r.shrine;
      if (!s) continue;
      const is = this.chunks.find((c) => c.region === r)?.isles.find((i) => i.shrine);
      const y = (is?.h ?? 40) + 26;
      // gem: faceted, the ramp in gold (open) or the stone's own colours (locked)
      const pal = s.state === 'locked' ? r.base : { top: 0xfff2c2, lit: 0xf3c95a, shade: 0xc98d2e, under: 0x8a5a1c };
      const soupC = [];
      const pos = gemGeo.getAttribute('position');
      const light = lightOf(r.base);
      for (let i = 0; i < pos.count; i += 3) {
        const a = new THREE.Vector3().fromBufferAttribute(pos, i), b = new THREE.Vector3().fromBufferAttribute(pos, i + 1), c = new THREE.Vector3().fromBufferAttribute(pos, i + 2);
        const n = b.clone().sub(a).cross(c.clone().sub(a)).normalize();
        const k = rampColor(n, pal, light);
        for (let j = 0; j < 3; j++) soupC.push(k.r, k.g, k.b);
      }
      const g = gemGeo.clone();
      g.setAttribute('color', new THREE.Float32BufferAttribute(soupC, 3));
      const gem = new THREE.Mesh(g, this.landMat);
      gem.scale.set(17, 25, 17);
      gem.position.set(s.x, y, s.z);
      gem.frustumCulled = false;
      this.scene.add(gem);
      // the beam: a soft column of light, gold when the shrine is open
      const col = s.state === 'open' ? C(0xffd77a) : s.state === 'solved' ? C(0xfff2c2) : C(0xffffff);
      const strength = s.state === 'open' ? 1.0 : s.state === 'solved' ? 0.45 : 0.28;
      const beamMat = new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
        uniforms: { uCol: { value: col }, uK: { value: strength }, uTime: this.shared.uTime, uPhase: { value: r.index * 1.3 } },
        vertexShader: /* glsl */ `varying vec2 vUv; void main() {
          vUv = uv;
          // a cylindrical billboard: turn round the vertical toward the camera
          vec3 base = (modelMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
          vec3 toCam = cameraPosition - base; toCam.y = 0.0;
          vec3 right = normalize(vec3(toCam.z, 0.0, -toCam.x) + 1e-5);
          float w = length(modelMatrix[0].xyz), h = length(modelMatrix[1].xyz);
          vec3 p = base + right * position.x * w + vec3(0.0, position.y * h, 0.0);
          gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0); }`,
        fragmentShader: /* glsl */ `uniform vec3 uCol; uniform float uK, uTime, uPhase; varying vec2 vUv;
          void main() {
            float x = abs(vUv.x - 0.5) * 2.0;
            float core = exp(-x * x * 18.0) + 0.35 * exp(-x * x * 3.0);
            float fade = smoothstep(0.0, 0.06, vUv.y) * pow(1.0 - vUv.y, 1.6);
            float breathe = 0.85 + 0.15 * sin(uTime * 1.9 + uPhase);
            gl_FragColor = vec4(uCol * core * fade * uK * breathe, 1.0);
          }`,
      });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.scale.set(s.state === 'open' ? 80 : 56, s.state === 'open' ? 700 : 420, 1);
      beam.position.set(s.x, y - 30, s.z);
      beam.frustumCulled = false;
      beam.renderOrder = 3;
      this.scene.add(beam);
      this.shrines.push({ region: r, shrine: s, gem, beam, y, beamMat, baseY: y });
    }
  }

  // ---------------------------------------------------------------- camera
  setSize(w, h, dpr) {
    this.w = w; this.h = h;
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(w, h, false);
    const aspect = w / h;
    const hf = THREE.MathUtils.degToRad(this.opts.hfov);
    this.camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(hf / 2) / aspect));
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
    // 1 unit = 1 px across the column at the screen centre (on phones)
    this.D = (Math.min(w, 430) / 2) / Math.tan(hf / 2);
    for (const pts of this.stars.children) pts.material.uniforms.uDpr.value = dpr;
  }

  // u: title pan 0 (stars) .. 1 (map top); s: map scroll in px
  setView(u, s) {
    const o = this.opts, rad = THREE.MathUtils.degToRad;
    const ease = (k) => k * k * (3 - 2 * k);
    const sm = Math.min(1, Math.max(0, s / 520));
    const mapPitch = rad(o.topPitch + (o.mapPitch - o.topPitch) * ease(sm));
    const D = this.D;
    const Hm = D * Math.sin(-mapPitch);
    const zm = s + this.h / 2 + Hm / Math.tan(-mapPitch);
    // the title: higher up, looking up and north; crane down while tilting
    // linger where the horizon is: the middle of the pan runs at ~0.45x speed
    const uc = Math.min(1, Math.max(0, u));
    const k = uc + 0.55 * Math.sin(2 * Math.PI * uc) / (2 * Math.PI);
    const pitch = rad(o.titlePitch) + (mapPitch - rad(o.titlePitch)) * k;
    const y = Hm + (1 - k) * 900;
    const z = zm + (1 - k) * 600;
    this.camera.position.set(0, y, z);
    this.camera.rotation.set(pitch, 0, 0);
    this.camera.updateMatrix();
    this.camera.matrixWorld.copy(this.camera.matrix);      // no parent; auto-update is off (see constructor)
    // the oblique lean: height moves things north (up the screen), so peaks
    // show their south faces while the cloud plane itself maps to the screen
    // without distortion (the stones then never drift against the world).
    // It eases in only once the horizon has left the frame.
    const lean = (o.lean ?? 0.42) * ease(Math.min(1, Math.max(0, (u - 0.6) / 0.4)));
    this._shear ??= new THREE.Matrix4();
    this._shear.set(1, 0, 0, 0, 0, 1, 0, 0, 0, -lean, 1, 0, 0, 0, 0, 1);
    this.camera.matrixWorldInverse.copy(this.camera.matrixWorld).invert().multiply(this._shear);
    this.sky.position.copy(this.camera.position);
    // each shell of stars turns part of the way with the camera, so it slides
    // by only `rate` of the tilt: far stars slowest, all slower than the horizon
    this.stars.position.copy(this.camera.position);
    const tilt = pitch - rad(o.titlePitch);
    for (const pts of this.stars.children) pts.rotation.x = tilt * (1 - pts.userData.rate);
    // the stars dim as the camera comes down to the cloud
    const starA = 1 - Math.min(1, Math.max(0, (k - 0.55) / 0.35));
    for (const pts of this.stars.children) pts.material.uniforms.uAlpha.value = starA;
    this.stars.visible = starA > 0;
    const vf = rad(this.camera.fov / 2);
    this.sky.visible = pitch + vf > -0.05;      // only while the horizon can be in frame
    this.u = u; this.s = s;
    // what's in view (z range on the cloud), for culling chapters and the DOM
    const top = pitch + vf, bot = pitch - vf;
    const zAt = (a) => (a >= -0.02 ? -1e9 : this.camera.position.z - this.camera.position.y / Math.tan(-a));
    this.viewZ = [zAt(top) - 260, bot <= -Math.PI / 2 ? this.camera.position.z + this.camera.position.y * Math.tan(-Math.PI / 2 - bot) + 260 : zAt(bot) + 260];
    for (const c of this.chunks) {
      const vis = c.z1 > this.viewZ[0] && c.z0 < this.viewZ[1];
      if (c.land) c.land.visible = vis;
      if (c.clouds) c.clouds.visible = vis;
    }
  }

  setPart(index, k) { this.parts[index] = k; }
  setDrawn(len) { this.pathMat.uniforms.uDrawn.value = len; }

  project(x, y, z, out = {}) {
    const v = this._v ?? (this._v = new THREE.Vector3());
    v.set(x, y, z);
    const dist = v.distanceTo(this.camera.position);
    v.project(this.camera);
    out.x = (v.x * 0.5 + 0.5) * this.w;
    out.y = (-v.y * 0.5 + 0.5) * this.h;
    out.vis = v.z < 1 && v.z > -1;
    out.scale = this.D / dist;
    return out;
  }

  render(t) {
    this.time = t;
    this.shared.uTime.value = t;
    this.renderer.render(this.scene, this.camera);
  }

  stats() {
    const i = this.renderer.info.render;
    return { calls: i.calls, tris: i.triangles };
  }
}
