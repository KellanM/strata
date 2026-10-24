// Everything around the block: sky, outward god rays, dust motes, shards, vignette.
import * as THREE from 'three';

const fsVert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

function fullscreen(material) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  m.frustumCulled = false;
  return m;
}

// Soft vertical sky with a halo behind the block and fine grain against banding.
export class Background {
  constructor() {
    this.uniforms = {
      cTop: { value: new THREE.Color() }, cBottom: { value: new THREE.Color() }, cGlow: { value: new THREE.Color() },
      uCenter: { value: new THREE.Vector2(0.5, 0.5) }, uAspect: { value: 1 }, uTime: { value: 0 },
    };
    this.mesh = fullscreen(new THREE.ShaderMaterial({
      uniforms: this.uniforms, vertexShader: fsVert, depthTest: false, depthWrite: false,
      fragmentShader: /* glsl */ `
        uniform vec3 cTop, cBottom, cGlow;
        uniform vec2 uCenter;
        uniform float uAspect, uTime;
        varying vec2 vUv;
        void main() {
          vec3 c = mix(cBottom, cTop, smoothstep(0.0, 1.0, vUv.y));
          vec2 d = vUv - uCenter; d.x *= uAspect;
          float r = length(d);
          c = mix(c, cGlow, 0.42 * exp(-r * r * 4.0));
          float n = fract(sin(dot(gl_FragCoord.xy + fract(uTime) * 91.0, vec2(12.9898, 78.233))) * 43758.5453);
          c += (n - 0.5) * 0.02;
          gl_FragColor = vec4(c, 1.0);
        }`,
    }));
    this.mesh.renderOrder = -10;
  }
  setPalette(p) {
    this.uniforms.cTop.value.setHex(p.skyTop);
    this.uniforms.cBottom.value.setHex(p.skyBottom);
    this.uniforms.cGlow.value.setHex(p.glow);
  }
}

// Reverse god rays: the block's silhouette is the emitter. A radial blur pushes
// it outward from the block's centre, the silhouette itself is cut back out,
// leaving shafts of light streaming away from the shape.
export class GodRays {
  constructor() {
    const opts = { type: THREE.HalfFloatType, depthBuffer: true };
    this.maskRT = new THREE.WebGLRenderTarget(4, 4, opts);
    this.raysRT = new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType, depthBuffer: false });
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.uniforms = {
      tMask: { value: this.maskRT.texture }, uCenter: { value: new THREE.Vector2(0.5, 0.5) },
      uTime: { value: 0 }, uAspect: { value: 1 },
      uHaloR: { value: 0.03 },   // the tutorial outline's halo radius (uv height)
      uEvolve: { value: 0 },     // 0..1: the title's light slowly turns, swells and changes its shafts
      uPhase: { value: 0 },      // the shafts' own clock, run faster on the title (main.js): a speed change never jumps it
    };
    this.blurScene = new THREE.Scene();
    this.blurScene.add(fullscreen(new THREE.ShaderMaterial({
      uniforms: this.uniforms, vertexShader: fsVert, depthTest: false, depthWrite: false,
      fragmentShader: /* glsl */ `
        uniform sampler2D tMask;
        uniform vec2 uCenter;
        uniform float uTime, uAspect, uHaloR, uEvolve, uPhase;
        varying vec2 vUv;
        void main() {
          // the tutorial's outlined cubes (mask g) glow softly out into the air:
          // a small round blur, kept off the stone so numbers stay crisp
          float halo = 0.0;
          for (int k = 0; k < 24; k++) {
            float a = float(k) * 2.39996, r = sqrt((float(k) + 0.5) / 24.0);
            halo += texture2D(tMask, vUv + vec2(cos(a) / uAspect, sin(a)) * r * uHaloR).g;
          }
          vec2 me = texture2D(tMask, vUv).rg;
          halo = halo / 24.0 * (1.0 - me.r);   // into the air only: on the stone the outline itself speaks

          vec2 dir = vUv - uCenter;
          // on the title the shafts breathe longer and shorter, very slowly
          float reach = 0.92 * (1.0 + uEvolve * (0.07 * sin(uTime * 0.21) + 0.04 * sin(uTime * 0.13 + 2.0)));
          vec2 stepv = dir * (reach / 56.0);
          vec2 uv = vUv;
          float illum = 0.0, decay = 1.0;
          for (int i = 0; i < 56; i++) {
            uv -= stepv;
            illum += texture2D(tMask, uv).r * decay;
            decay *= 0.958;
          }
          illum *= 0.045;
          vec2 da = dir; da.x *= uAspect;
          float ang = atan(da.y, da.x);
          // the fan turns a little, back and forth, and its shafts drift at their own
          // speeds (faster on the title, uEvolve), with a broad swell of light that wanders
          float e = uEvolve, tt = uPhase;
          ang += e * 0.22 * sin(uTime * 0.045);
          float streak = 0.55 + 0.22 * sin(ang * 7.0 + tt * 0.13) + 0.16 * sin(ang * 13.0 - tt * 0.21)
                       + 0.12 * sin(ang * 29.0 + 1.7 + tt * 0.07)
                       + e * 0.1 * sin(ang * 19.0 + 2.0 * sin(uTime * 0.09) - uTime * 0.17);
          streak *= 1.0 + e * 0.28 * sin(ang * 2.0 - uTime * 0.11 + 1.3 * sin(uTime * 0.07));
          float self = texture2D(tMask, vUv).r;
          float near = 0.0;
          for (int k = 0; k < 4; k++) {
            vec2 o = vec2(k == 0 ? 1.0 : (k == 1 ? -1.0 : 0.0), k == 2 ? 1.0 : (k == 3 ? -1.0 : 0.0)) * 0.006;
            near = max(near, texture2D(tMask, vUv + o).r);
          }
          gl_FragColor = vec4(illum * streak * (1.0 - max(self, near)), halo, 0.0, 1.0);
        }`,
    })));

    this.compUniforms = {
      tRays: { value: this.raysRT.texture }, cRays: { value: new THREE.Color() },
      cVignette: { value: new THREE.Color() }, uIntensity: { value: 1 }, uAspect: { value: 1 },
      cHalo: { value: new THREE.Color() }, uHalo: { value: 1 },
    };
    this.compScene = new THREE.Scene();
    this.compScene.add(fullscreen(new THREE.ShaderMaterial({
      uniforms: this.compUniforms, vertexShader: fsVert, depthTest: false, depthWrite: false,
      transparent: true, blending: THREE.CustomBlending,
      blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor,
      fragmentShader: /* glsl */ `
        uniform sampler2D tRays;
        uniform vec3 cRays, cVignette, cHalo;
        uniform float uIntensity, uAspect, uHalo;
        varying vec2 vUv;
        void main() {
          vec2 rh = texture2D(tRays, vUv).rg;
          vec3 rays = cRays * rh.r * uIntensity + cHalo * rh.g * uHalo;
          vec2 d = vUv - 0.5; d.x *= mix(1.0, uAspect, 0.5);
          float vig = smoothstep(0.38, 0.95, length(d) * 1.25) * 0.42;
          gl_FragColor = vec4(rays + cVignette * vig, vig);
        }`,
    })));
  }

  setSize(w, h) {
    const s = 0.25;
    this.maskRT.setSize(Math.max(1, Math.round(w * s)), Math.max(1, Math.round(h * s)));
    this.raysRT.setSize(Math.max(1, Math.round(w * s)), Math.max(1, Math.round(h * s)));
    this.uniforms.uAspect.value = this.compUniforms.uAspect.value = w / h;
  }

  setPalette(p, dark) {
    this.compUniforms.cRays.value.setHex(p.rays);
    this.compUniforms.cHalo.value.setHex(p.glow);
    this.compUniforms.uHalo.value = dark ? 1.1 : 0.7;   // a pale sky needs less to show the same light
    this.compUniforms.cVignette.value.setHex(dark ? 0x05060c : p.under).multiplyScalar(dark ? 1 : 0.55);
  }

  // renderMask(): draws the silhouette (white on black) into the current target.
  render(renderer, renderMask) {
    renderer.setRenderTarget(this.maskRT);
    renderer.setClearColor(0x000000, 1);
    renderer.clear();
    renderMask();
    renderer.setRenderTarget(this.raysRT);
    renderer.render(this.blurScene, this.camera);
    renderer.setRenderTarget(null);
  }

  composite(renderer) {
    renderer.render(this.compScene, this.camera);
  }
}

// Dust motes drifting through the light. Close motes grow soft like bokeh.
export class Motes {
  constructor(count = 280) {
    const pos = new Float32Array(count * 3), seed = new Float32Array(count * 4);
    for (let i = 0; i < count; i++) {
      pos.set([Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5], i * 3);
      seed.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 4));
    this.uniforms = {
      uTime: { value: 0 }, uBox: { value: 20 }, uUnitPx: { value: 30 }, uFocus: { value: 30 },
      cMote: { value: new THREE.Color() }, uCenter: { value: new THREE.Vector2() },
    };
    this.points = new THREE.Points(geo, new THREE.ShaderMaterial({
      uniforms: this.uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        attribute vec4 aSeed;
        uniform float uTime, uBox, uUnitPx, uFocus;
        uniform vec2 uCenter;
        varying float vAlpha, vBlur;
        void main() {
          vec3 p = position * uBox;
          float t = uTime;
          p.y = mod(p.y + t * (0.08 + 0.18 * aSeed.x) + uBox * 0.5, uBox) - uBox * 0.5;
          p.x += sin(t * (0.15 + 0.2 * aSeed.y) + aSeed.z * 6.283) * 0.9;
          p.z += cos(t * (0.12 + 0.2 * aSeed.x) + aSeed.w * 6.283) * 0.9;
          p.x += sin(t * 0.9 * aSeed.w + p.y) * 0.08;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          float dz = (-mv.z - uFocus) / uBox;            // < 0: closer than the block
          vBlur = clamp(-dz * 2.2, 0.0, 1.0);
          float size = (0.05 + 0.09 * aSeed.z) * (1.0 + vBlur * 3.0);
          gl_PointSize = max(1.5, size * uUnitPx);
          float twinkle = 0.45 + 0.55 * (0.5 + 0.5 * sin(t * (0.6 + aSeed.w * 1.4) + aSeed.x * 40.0));
          float edge = smoothstep(0.0, 0.12, 0.5 - abs(p.y) / uBox);
          vec2 nd = gl_Position.xy / gl_Position.w * 0.5 + 0.5 - uCenter;
          float inLight = 0.6 + 0.9 * exp(-dot(nd, nd) * 9.0);
          vAlpha = twinkle * edge * inLight * mix(0.9, 0.22, vBlur);
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 cMote;
        varying float vAlpha, vBlur;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          float a = 1.0 - smoothstep(mix(0.05, 0.32, vBlur), 0.5, d);
          a *= vAlpha;
          gl_FragColor = vec4(cMote * a, a);
        }`,
    }));
    this.points.frustumCulled = false;
  }
  setPalette(p) { this.uniforms.cMote.value.setHex(p.motes); }
}

// Chips of stone thrown off when a cube is chiselled away.
export class Shards {
  constructor(capacity = 480) {
    this.capacity = capacity;
    this.next = 0;
    const geo = new THREE.BufferGeometry();
    this.origin = new Float32Array(capacity * 3);
    this.vel = new Float32Array(capacity * 3);
    this.start = new Float32Array(capacity).fill(-99);
    this.color = new Float32Array(capacity * 3);
    this.meta = new Float32Array(capacity * 3);   // size, life, gravity
    geo.setAttribute('position', new THREE.BufferAttribute(this.origin, 3));
    geo.setAttribute('aMeta', new THREE.BufferAttribute(this.meta, 3));
    geo.setAttribute('aVel', new THREE.BufferAttribute(this.vel, 3));
    geo.setAttribute('aStart', new THREE.BufferAttribute(this.start, 1));
    geo.setAttribute('aColor', new THREE.BufferAttribute(this.color, 3));
    this.geo = geo;
    this.uniforms = { uTime: { value: 0 }, uUnitPx: { value: 30 } };
    this.points = new THREE.Points(geo, new THREE.ShaderMaterial({
      uniforms: this.uniforms, transparent: true, depthWrite: false,
      vertexShader: /* glsl */ `
        attribute vec3 aVel, aColor, aMeta;
        attribute float aStart;
        uniform float uTime, uUnitPx;
        varying vec3 vColor;
        varying float vAlpha, vSpin;
        void main() {
          float t = uTime - aStart;
          if (t < 0.0 || t > aMeta.y) { gl_Position = vec4(0.0, 0.0, 2.0, 1.0); return; }
          // drag eases the throw so chips drift rather than fly
          float travel = (1.0 - exp(-t * 3.0)) / 3.0;
          vec3 p = position + aVel * travel + vec3(0.0, -aMeta.z, 0.0) * t * t * 0.5;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
          float life = t / aMeta.y;
          gl_PointSize = max(1.0, (0.2 + 0.1 * fract(aStart * 37.0)) * aMeta.x * (1.0 - life * 0.7) * uUnitPx);
          vColor = aColor;
          vAlpha = 1.0 - life * life;
          vSpin = aStart * 13.0 + t * 9.0 * (fract(aStart * 7.0) - 0.5);
        }`,
      fragmentShader: /* glsl */ `
        varying vec3 vColor;
        varying float vAlpha, vSpin;
        void main() {
          vec2 q = gl_PointCoord - 0.5;
          float c = cos(vSpin), s = sin(vSpin);
          q = mat2(c, -s, s, c) * q;
          if (max(abs(q.x), abs(q.y)) > 0.3) discard;
          float shade = q.y > 0.0 ? 1.0 : 0.82;
          gl_FragColor = vec4(vColor * shade, vAlpha);
        }`,
    }));
    this.points.frustumCulled = false;
  }

  // power scales the throw, size the chips, life their time; drag (in the
  // shader) makes them drift. Defaults are the celebratory confetti.
  burst(center, time, colors, count = 14, power = 1, { size = 1, life = 1.1, gravity = 5, spread = 0.6 } = {}) {
    for (let k = 0; k < count; k++) {
      const i = this.next++ % this.capacity;
      const a = Math.random() * Math.PI * 2, up = (1.2 + Math.random() * 2.4) * power, sp = (0.8 + Math.random() * 1.8) * power;
      this.origin.set([center.x + (Math.random() - 0.5) * spread, center.y + (Math.random() - 0.5) * spread, center.z + (Math.random() - 0.5) * spread], i * 3);
      this.vel.set([Math.cos(a) * sp * 2.2, up * 2.2, Math.sin(a) * sp * 2.2], i * 3);
      this.meta.set([size * (0.7 + Math.random() * 0.6), life * (0.75 + Math.random() * 0.5), gravity], i * 3);
      this.start[i] = time + Math.random() * 0.05;
      const c = colors[k % colors.length];
      this.color.set([c.r, c.g, c.b], i * 3);
    }
    for (const name of ['position', 'aVel', 'aStart', 'aColor', 'aMeta']) this.geo.getAttribute(name).needsUpdate = true;
  }
}

// Ash: what a chiselled cube gives up (Kellan, 2026-10-23: "like ash rising
// from a fire"; then: in 3D, fast and fluid, shaded like the title's stars).
// Each mote is simulated in the world: it is thrown out of the cube in a puff,
// then carried by moving air - a hot updraft over the cube that draws the
// motes in toward its column as they rise (a plume), inside a swirling field
// (an ABC flow, which has no sources or sinks, so it curls like real air and
// never clumps). Drag lets each mote catch the air quickly, so the motion is
// quick and alive rather than floaty. Drawn depth-tested, so the stone hides
// what passes behind it. Each mote is a white sparkle, as the title's stars:
// a white-hot core in a soft bloom with a turning four-point flare that
// blazes when it glints; it pops in with a little overshoot and twinkles
// small as it goes. Over a pale sky additive light would vanish, so there it
// is laid on normally over a faint shadow of the sky's shade (setPalette).
const ABC = (x, y, z, t, out) => {
  out[0] = Math.sin(z + t * 0.9) + 0.7 * Math.cos(y - t * 0.6);
  out[1] = 0.8 * Math.sin(x + t * 0.7) + Math.cos(z + t * 0.5);
  out[2] = 0.7 * Math.sin(y - t * 0.8) + 0.8 * Math.cos(x + t * 0.4);
};
export class Ash {
  constructor(capacity = 1200) {
    this.capacity = capacity;
    this.next = 0;
    this.pos = new Float32Array(capacity * 3);
    this.vel = new Float32Array(capacity * 3);
    this.axis = new Float32Array(capacity * 3);   // the plume's foot (its burst's cube) and the air's phase
    this.age = new Float32Array(capacity).fill(99);
    this.life = new Float32Array(capacity).fill(1);
    this.state = new Float32Array(capacity * 2);  // fade (0..1), heat (1 hot .. 0 cooled)
    this.seeds = new Float32Array(capacity * 4);  // twinkle rate, phase, size, warmth
    this.alive = 0;
    this.awake = false;   // anything in the air (or about to be); asleep, step() does nothing
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute('aState', new THREE.BufferAttribute(this.state, 2).setUsage(THREE.DynamicDrawUsage));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(this.seeds, 4).setUsage(THREE.DynamicDrawUsage));
    this.geo = geo;
    this.uniforms = {
      uTime: { value: 0 }, uUnitPx: { value: 30 }, uPale: { value: 0 },
      uCool: { value: new THREE.Color(0.9, 0.92, 1.0) },
    };
    this.points = new THREE.Points(geo, new THREE.ShaderMaterial({
      uniforms: this.uniforms, transparent: true, depthWrite: false, depthTest: true,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        attribute vec2 aState;   // fade, heat
        attribute vec4 aSeed;    // twinkle rate, phase, size, warmth
        uniform float uTime, uUnitPx;
        varying float vB, vSpike, vRot;
        void main() {
          if (aState.x <= 0.0) { gl_Position = vec4(0.0, 0.0, 2.0, 1.0); return; }
          float ph = aSeed.y * 6.2832, age = -log(max(aState.y, 1e-4)) / 2.2;
          // as the title's motes: a quick shimmer, and now and then a glint that flares
          float shimmer = 0.7 + 0.3 * sin(uTime * mix(7.0, 13.0, aSeed.x) + ph);
          float glint = pow(max(0.0, sin(uTime * mix(2.0, 4.0, aSeed.x) + ph * 7.0)), 24.0);
          vB = (shimmer + 1.4 * glint) * aState.x;
          // the cross flare: always faint on the big ones, full while glinting
          vSpike = (0.25 + 0.75 * glint) * smoothstep(0.7, 1.3, aSeed.z) + 0.5 * glint;
          vRot = ph + age * mix(-2.5, 2.5, aSeed.x);
          // it pops into being (a quick overshoot), and twinkles small as it goes
          float pop = smoothstep(0.0, 0.05, age) * (1.0 + 0.7 * exp(-age * 9.0));
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = max(2.0, aSeed.z * pop * (0.6 + 0.4 * aState.x) * (1.0 + 0.5 * glint) * 0.4 * uUnitPx);
        }`,
      fragmentShader: /* glsl */ `
        uniform float uPale;
        uniform vec3 uCool;
        varying float vB, vSpike, vRot;
        void main() {
          vec2 q = gl_PointCoord * 2.0 - 1.0;
          float d2 = dot(q, q);
          if (d2 > 1.0) discard;
          // a sparkle: a white-hot core, a soft bloom, and a turning four-point flare
          float c = cos(vRot), s = sin(vRot);
          vec2 r = mat2(c, -s, s, c) * q;
          float core = exp(-d2 * 26.0), bloom = 0.22 * exp(-d2 * 6.0);
          float spikes = (exp(-abs(r.x) * 30.0) * exp(-r.y * r.y * 4.0) + exp(-abs(r.y) * 30.0) * exp(-r.x * r.x * 4.0)) * vSpike;
          float a = min(1.0, (core * 1.4 + bloom + spikes) * vB) * (1.0 - smoothstep(0.85, 1.0, d2));
          if (uPale > 0.5) {
            // over a pale sky white needs an edge: a faint soft shadow of the sky's shade under it
            float shade = 0.22 * exp(-d2 * 3.5) * vB;
            vec3 col = mix(uCool, vec3(1.0), clamp(a / max(a + shade, 1e-3) * 1.4, 0.0, 1.0));
            gl_FragColor = vec4(col, min(1.0, a + shade));
          } else {
            gl_FragColor = vec4(vec3(1.0) * a, a);
          }
        }`,
    }));
    this.points.frustumCulled = false;
    this.geo.setDrawRange(0, 0);
    this.f = [0, 0, 0];
  }

  // light skies take the deeper, normally blended look; dark ones the starlight
  setPalette(p) {
    const lum = (h) => { const c = new THREE.Color(h); return 0.3 * c.r + 0.59 * c.g + 0.11 * c.b; };
    const pale = (lum(p.skyTop) + lum(p.skyBottom)) / 2 > 0.55;
    this.uniforms.uPale.value = pale ? 1 : 0;
    this.uniforms.uCool.value.set(pale ? p.shade : (p.motes ?? 0xe8ecff));
    this.points.material.blending = pale ? THREE.NormalBlending : THREE.AdditiveBlending;
    this.points.material.needsUpdate = true;
  }

  // one cube's worth. `toward`: the way the touch came from (out of the tapped
  // face); the motes splash out that way in a cone, then the air takes them up
  burst(center, count = 22, toward = null) {
    const phase = Math.random() * 20;
    for (let k = 0; k < count; k++) {
      const i = this.next++ % this.capacity, i3 = i * 3;
      const u = Math.random() * 2 - 1, a = Math.random() * Math.PI * 2, r = Math.sqrt(1 - u * u);
      let vx, vy, vz;
      if (toward) {
        const sp = 3.5 + Math.random() * 4.5, cone = 0.55;
        vx = (toward.x + r * Math.cos(a) * cone) * sp; vy = (toward.y + u * cone) * sp; vz = (toward.z + r * Math.sin(a) * cone) * sp;
      } else {
        const sp = 1.5 + Math.random() * 2.5;
        vx = r * Math.cos(a) * sp; vy = (u * 0.6 + 0.4) * sp; vz = r * Math.sin(a) * sp;
      }
      this.pos.set([center.x + (Math.random() - 0.5) * 0.6, center.y + (Math.random() - 0.5) * 0.6, center.z + (Math.random() - 0.5) * 0.6], i3);
      this.vel.set([vx, vy, vz], i3);
      this.axis.set([center.x, center.z, phase], i3);
      this.age[i] = -Math.pow(Math.random(), 2) * 0.12;   // most at once, a short tail
      this.life[i] = 1.1 + Math.random() * 1.1;
      this.seeds.set([Math.random(), Math.random(), 0.55 + 0.9 * Math.random() ** 2.2, Math.random()], i * 4);
    }
    this.geo.attributes.aSeed.needsUpdate = true;
    this.awake = true;
    this.geo.setDrawRange(0, this.capacity);
  }

  step(dt, t) {
    this.uniforms.uTime.value = t;
    // most of the time nothing is in the air: no motes to move, nothing to
    // upload, nothing to draw (the last waking frame already faded every one to 0)
    if (!this.awake) return;
    dt = Math.min(dt, 1 / 30);
    const P = this.pos, V = this.vel, A = this.axis, S = this.state, f = this.f;
    let alive = 0, waiting = 0;
    for (let i = 0; i < this.capacity; i++) {
      if (this.age[i] >= this.life[i]) { S[i * 2] = 0; continue; }
      this.age[i] += dt;
      const age = this.age[i], i3 = i * 3;
      if (age < 0) { S[i * 2] = 0; waiting++; continue; }
      alive++;
      const x = P[i3], y = P[i3 + 1], z = P[i3 + 2], k = age / this.life[i];
      // the air: a swirl that grows as the mote leaves the stone, over a hot updraft
      ABC(x * 1.3 + A[i3 + 2], y * 1.3, z * 1.3 - A[i3 + 2], t * 1.6 + A[i3 + 2], f);
      // the splash spends itself first (drag); then the swirl and the updraft take over
      const take = Math.min(1, Math.max(0, (age - 0.08) * 4));
      const swirl = 2.6 * take;
      const dx = x - A[i3], dz = z - A[i3 + 1], r2 = dx * dx + dz * dz;
      const lift = 3.2 * Math.exp(-age * 0.9) * (0.55 + 0.45 * Math.exp(-r2 * 0.8)) + 0.5;
      // entrained toward the plume's column as it rises
      const ax = f[0] * swirl - dx * 1.2 * take, ay = f[1] * swirl * 0.6 + lift * take, az = f[2] * swirl - dz * 1.2 * take;
      // drag: the mote catches the moving air quickly
      const drag = 1 - Math.exp(-dt * 5.5);
      V[i3] += (ax - V[i3]) * drag; V[i3 + 1] += (ay - V[i3 + 1]) * drag; V[i3 + 2] += (az - V[i3 + 2]) * drag;
      P[i3] += V[i3] * dt; P[i3 + 1] += V[i3 + 1] * dt; P[i3 + 2] += V[i3 + 2] * dt;
      S[i * 2] = Math.min(1, age * 14) * (1 - k * k);
      S[i * 2 + 1] = Math.exp(-age * 2.2);
    }
    this.alive = alive;
    this.awake = alive + waiting > 0;
    if (!this.awake) this.geo.setDrawRange(0, 0);
    this.geo.attributes.position.needsUpdate = true;
    this.geo.attributes.aState.needsUpdate = true;
  }
}
