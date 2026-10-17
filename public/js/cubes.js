// The puzzle block: a single instanced draw with a hand-written shader.
// Lighting is a colour ramp picked by face direction (no physical shading),
// with baked-style contact shadows in concave corners, a vertical gradient,
// clue glyphs from an atlas, and shader-driven break / peel / ripple motion.
import * as THREE from 'three';

const ATLAS_COLS = 8;
const MAX_RIPPLES = 8;

// Tile 0 is blank; tile 1 + count*3 + style is a clue.
export function clueTile(line) {
  return line.hidden ? 0 : 1 + line.count * 3 + line.style;
}

function buildAtlas() {
  const T = 128, canvas = document.createElement('canvas');
  canvas.width = canvas.height = T * ATLAS_COLS;
  const g = canvas.getContext('2d');
  g.fillStyle = '#fff';
  g.strokeStyle = '#fff';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  for (let count = 0; count <= 15; count++) {
    for (let style = 0; style < 3; style++) {
      const tile = 1 + count * 3 + style;
      const cx = (tile % ATLAS_COLS) * T + T / 2, cy = Math.floor(tile / ATLAS_COLS) * T + T / 2;
      const label = String(count);
      g.font = `600 ${label.length > 1 ? 60 : 74}px "Avenir Next", Futura, "Century Gothic", "Segoe UI", sans-serif`;
      g.fillText(label, cx, cy + 4);
      g.lineWidth = 7;
      if (style === 1) {
        g.beginPath(); g.arc(cx, cy, 42, 0, Math.PI * 2); g.stroke();
      } else if (style === 2) {
        g.beginPath(); g.roundRect(cx - 40, cy - 40, 80, 80, 10); g.stroke();
      }
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 8;
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  return tex;
}

const vertexShader = /* glsl */ `
  attribute vec3 aCell;
  attribute vec3 aClue;
  attribute vec4 aState;   // paint(0/1), paintTime, breakTime (-1 alive), mistakeTime
  attribute vec2 aAO;      // 4 crease bits per face, faces 0-2 in x, 3-5 in y
  attribute vec3 aColor;   // solution colour revealed on win

  uniform float uTime;
  uniform vec3 uDims;
  uniform vec3 uPeel;      // axis, layers kept (animated), side (+1 / -1)
  uniform vec4 uRip[${MAX_RIPPLES}];       // origin.xyz, start time
  uniform vec2 uRipParam[${MAX_RIPPLES}];  // amplitude, speed

  varying vec3 vN;
  varying vec3 vLocal;
  varying vec2 vUv;
  varying float vTile;
  varying float vAOBits;
  varying vec4 vState;
  varying vec3 vColor;
  varying float vGlow;
  varying float vHeight;
  varying float vPeelFade;
  varying vec3 vCell;

  void main() {
    vec3 n = normal;
    float axis = abs(n.x) > 0.5 ? 0.0 : (abs(n.y) > 0.5 ? 1.0 : 2.0);
    vTile = axis == 0.0 ? aClue.x : (axis == 1.0 ? aClue.y : aClue.z);
    float face = axis * 2.0 + (n.x + n.y + n.z > 0.0 ? 1.0 : 0.0);
    float packed = face < 3.0 ? aAO.x : aAO.y;
    float f3 = mod(face, 3.0);
    float div = f3 < 0.5 ? 1.0 : (f3 < 1.5 ? 16.0 : 256.0);
    vAOBits = mod(floor(packed / div + 0.001), 16.0);

    vec3 center = aCell - (uDims - 1.0) * 0.5;
    float scale = 1.0;
    vec3 offset = vec3(0.0);

    // chiselled away: lift, shrink, tumble out
    if (aState.z >= 0.0) {
      float a = (uTime - aState.z) / 0.42;
      if (a >= 1.0) { gl_Position = vec4(0.0, 0.0, 2.0, 1.0); return; }
      scale = 1.0 - a * a * (3.0 - 2.0 * a);
      offset.y += 0.5 * a * a;
    }

    // peeling: layers beyond the cut slide out along the peel axis and shrink
    int pa = int(uPeel.x);
    float coord = pa == 0 ? aCell.x : (pa == 1 ? aCell.y : aCell.z);
    float dimA = pa == 0 ? uDims.x : (pa == 1 ? uDims.y : uDims.z);
    if (uPeel.z < 0.0) coord = dimA - 1.0 - coord;
    float keep = clamp(uPeel.y - coord, 0.0, 1.0);
    vPeelFade = keep;
    if (keep <= 0.001) { gl_Position = vec4(0.0, 0.0, 2.0, 1.0); return; }
    float k = keep * keep * (3.0 - 2.0 * keep);
    scale *= k;
    vec3 peelDir = vec3(pa == 0 ? 1.0 : 0.0, pa == 1 ? 1.0 : 0.0, pa == 2 ? 1.0 : 0.0) * uPeel.z;
    offset += peelDir * (1.0 - k) * 0.9;

    // ripples: a travelling wave pushes cubes outward from where you touched
    float glow = 0.0;
    for (int i = 0; i < ${MAX_RIPPLES}; i++) {
      vec4 r = uRip[i];
      float age = uTime - r.w;
      if (age < 0.0 || age > 2.6) continue;
      vec3 d = aCell - r.xyz;
      float dist = length(d);
      float front = dist - age * uRipParam[i].y;
      float env = exp(-front * front * 0.9) * exp(-age * 1.7) * uRipParam[i].x;
      vec3 dir = dist > 0.01 ? d / dist : vec3(0.0, 1.0, 0.0);
      offset += (dir * 0.6 + vec3(0.0, 0.8, 0.0)) * env * 0.16;
      scale *= 1.0 - 0.07 * env;
      glow += env;
    }

    // a mistake shudders
    if (aState.w >= 0.0) {
      float age = uTime - aState.w;
      float m = exp(-age * 4.0);
      offset.x += sin(age * 70.0) * 0.07 * m;
    }

    vGlow = glow;
    vN = n;
    vLocal = position;
    vUv = uv;
    vState = aState;
    vColor = aColor;
    vCell = aCell;
    vHeight = aCell.y / max(uDims.y - 1.0, 1.0);

    vec3 p = position * 0.965 * scale + center + offset;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uAtlas;
  uniform float uTime;
  uniform float uMask;
  uniform float uReveal;
  uniform vec3 uHover;
  uniform vec2 uLight;     // xz direction of the key light
  uniform vec3 cTop, cLit, cShade, cUnder;
  uniform vec3 pTop, pLit, pShade;
  uniform vec3 cHaze, cGlow, cMistake;

  varying vec3 vN;
  varying vec3 vLocal;
  varying vec2 vUv;
  varying float vTile;
  varying float vAOBits;
  varying vec4 vState;
  varying vec3 vColor;
  varying float vGlow;
  varying float vHeight;
  varying float vPeelFade;
  varying vec3 vCell;

  float bit(float bits, float p2) { return mod(floor(bits / p2 + 0.001), 2.0); }

  vec3 ramp(vec3 n, vec3 top, vec3 lit, vec3 shade, vec3 under) {
    if (n.y > 0.5) return top;
    if (n.y < -0.5) return under;
    float l = dot(n.xz, uLight) * 0.5 + 0.5;
    return mix(shade, lit, smoothstep(0.1, 0.9, l));
  }

  void main() {
    if (uMask > 0.5) { gl_FragColor = vec4(vec3(vPeelFade), 1.0); return; }

    vec3 n = normalize(vN);
    vec3 base = ramp(n, cTop, cLit, cShade, cUnder);

    // painted: colour blooms out from the face centre
    if (vState.x > 0.5) {
      float t = clamp((uTime - vState.y) / 0.35, 0.0, 1.0);
      float r = length(vUv - 0.5);
      float fill = smoothstep(t * 0.75, t * 0.75 - 0.05, r);
      vec3 paint = ramp(n, pTop, pLit, pShade, pShade * 0.7);
      base = mix(base, paint, max(fill, step(1.0, t)));
    }

    // concave creases: soft contact shadow along edges that meet a neighbour
    float axis = abs(n.x) > 0.5 ? 0.0 : (abs(n.y) > 0.5 ? 1.0 : 2.0);
    vec3 lp = vLocal + 0.5;
    float u = axis == 0.0 ? lp.y : (axis == 1.0 ? lp.z : lp.x);
    float v = axis == 0.0 ? lp.z : (axis == 1.0 ? lp.x : lp.y);
    float occ = 0.0;
    occ += bit(vAOBits, 1.0) * (1.0 - smoothstep(0.0, 0.55, u));
    occ += bit(vAOBits, 2.0) * (1.0 - smoothstep(0.0, 0.55, 1.0 - u));
    occ += bit(vAOBits, 4.0) * (1.0 - smoothstep(0.0, 0.55, v));
    occ += bit(vAOBits, 8.0) * (1.0 - smoothstep(0.0, 0.55, 1.0 - v));
    base *= 1.0 - 0.28 * min(occ, 1.4);

    // crisp edge line, lighter on the upper rim like sunlit masonry
    float e = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
    float edge = 1.0 - smoothstep(0.0, 0.04, e);
    base = mix(base, base * (n.y > 0.5 ? 1.07 : 0.9), edge);

    // vertical gradient: bases sink into haze
    base = mix(cHaze, base, 0.78 + 0.22 * smoothstep(0.0, 0.85, vHeight));

    // clue glyph, inked in a darker (or lighter) tone of the face itself
    vec3 col = base;
    if (vTile > 0.5) {
      float col8 = mod(vTile, 8.0), row8 = floor(vTile / 8.0);
      vec2 auv = vec2((col8 + vUv.x) / 8.0, 1.0 - (row8 + 1.0 - vUv.y) / 8.0);
      float g = texture2D(uAtlas, auv).a;
      float lum = dot(base, vec3(0.299, 0.587, 0.114));
      vec3 ink = lum > 0.5 ? base * vec3(0.36, 0.33, 0.42) : mix(base, vec3(1.0, 0.97, 0.92), 0.78);
      col = mix(col, ink, g * 0.92 * (1.0 - uReveal));
    }

    // solved: the true colours sweep upward, lit by the same ramp
    float rev = smoothstep(vHeight - 0.15, vHeight + 0.15, uReveal * 1.3 - 0.15);
    if (rev > 0.0) {
      vec3 sc = vColor * ramp(n, vec3(1.08), vec3(0.96), vec3(0.7), vec3(0.5));
      sc = mix(sc, cShade, 0.12 * (1.0 - step(0.5, n.y)));
      col = mix(col, sc, rev);
    }

    // hover
    if (distance(vCell, uHover) < 0.1) col = mix(col, vec3(1.0), 0.14 + 0.1 * edge);

    // mistake flash
    if (vState.w >= 0.0) col = mix(col, cMistake, exp(-(uTime - vState.w) * 2.5) * 0.85);

    // ripple light
    col += cGlow * vGlow * 0.22;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export class Cubes {
  constructor() {
    this.atlas = buildAtlas();
    this.uniforms = {
      uAtlas: { value: this.atlas },
      uTime: { value: 0 },
      uMask: { value: 0 },
      uReveal: { value: 0 },
      uDims: { value: new THREE.Vector3(1, 1, 1) },
      uPeel: { value: new THREE.Vector3(1, 99, 1) },
      uHover: { value: new THREE.Vector3(-99, -99, -99) },
      uLight: { value: new THREE.Vector2(-0.45, 0.9).normalize() },
      uRip: { value: Array.from({ length: MAX_RIPPLES }, () => new THREE.Vector4(0, 0, 0, -99)) },
      uRipParam: { value: Array.from({ length: MAX_RIPPLES }, () => new THREE.Vector2(0, 1)) },
      cTop: { value: new THREE.Color() }, cLit: { value: new THREE.Color() },
      cShade: { value: new THREE.Color() }, cUnder: { value: new THREE.Color() },
      pTop: { value: new THREE.Color() }, pLit: { value: new THREE.Color() }, pShade: { value: new THREE.Color() },
      cHaze: { value: new THREE.Color() }, cGlow: { value: new THREE.Color() },
      cMistake: { value: new THREE.Color(0xff5a5f) },
    };
    this.material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms: this.uniforms });
    this.mesh = null;
    this.ripIndex = 0;
  }

  setPalette(p) {
    const u = this.uniforms;
    u.cTop.value.setHex(p.top); u.cLit.value.setHex(p.lit);
    u.cShade.value.setHex(p.shade); u.cUnder.value.setHex(p.under);
    u.pTop.value.setHex(p.paintTop); u.pLit.value.setHex(p.paintLit); u.pShade.value.setHex(p.paintShade);
    u.cHaze.value.setHex(p.skyBottom); u.cGlow.value.setHex(p.rays);
  }

  // Builds the instanced block for a puzzle. Returns the mesh (caller adds to scene).
  build(puzzle) {
    if (this.mesh) { this.mesh.geometry.dispose(); }
    const n = puzzle.size;
    const box = new THREE.BoxGeometry(1, 1, 1);
    const geo = new THREE.InstancedBufferGeometry();
    geo.index = box.index;
    geo.setAttribute('position', box.getAttribute('position'));
    geo.setAttribute('normal', box.getAttribute('normal'));
    geo.setAttribute('uv', box.getAttribute('uv'));
    geo.instanceCount = n;

    const cell = new Float32Array(n * 3), clue = new Float32Array(n * 3), color = new Float32Array(n * 3);
    const c = new THREE.Color();
    for (let i = 0; i < n; i++) {
      const [x, y, z] = puzzle.coords(i);
      cell.set([x, y, z], i * 3);
      for (let a = 0; a < 3; a++) clue[i * 3 + a] = clueTile(puzzle.lineOf(i, a));
      c.setHex(puzzle.colors[i] || 0xffffff);
      color.set([c.r, c.g, c.b], i * 3);
    }
    this.state = new Float32Array(n * 4);
    for (let i = 0; i < n; i++) this.state.set([0, 0, -1, -1], i * 4);
    this.ao = new Float32Array(n * 2);

    geo.setAttribute('aCell', new THREE.InstancedBufferAttribute(cell, 3));
    geo.setAttribute('aClue', new THREE.InstancedBufferAttribute(clue, 3));
    geo.setAttribute('aColor', new THREE.InstancedBufferAttribute(color, 3));
    this.stateAttr = new THREE.InstancedBufferAttribute(this.state, 4);
    this.stateAttr.setUsage(THREE.DynamicDrawUsage);
    this.aoAttr = new THREE.InstancedBufferAttribute(this.ao, 2);
    this.aoAttr.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('aState', this.stateAttr);
    geo.setAttribute('aAO', this.aoAttr);

    if (!this.mesh) {
      this.mesh = new THREE.Mesh(geo, this.material);
      this.mesh.frustumCulled = false;
    } else {
      this.mesh.geometry = geo;
    }
    this.uniforms.uDims.value.set(...puzzle.dims);
    this.uniforms.uReveal.value = 0;
    for (const r of this.uniforms.uRip.value) r.w = -99;
    return this.mesh;
  }

  // present(i) -> whether cell i currently occupies space (alive and not peeled).
  // Marks edges of each face that meet a neighbour stepping out of that face.
  updateAO(puzzle, present) {
    const [X, Y, Z] = puzzle.dims;
    const has = (x, y, z) => x >= 0 && y >= 0 && z >= 0 && x < X && y < Y && z < Z && present(x + X * (y + Y * z));
    for (let i = 0; i < puzzle.size; i++) {
      const p = puzzle.coords(i);
      let lo = 0, hi = 0;
      for (let face = 0; face < 6; face++) {
        const axis = face >> 1, sgn = face & 1 ? 1 : -1;
        // tangents match the shader: axis x -> (y, z), y -> (z, x), z -> (x, y)
        const ta = [[1, 2], [2, 0], [0, 1]][axis];
        let bits = 0;
        for (let e = 0; e < 4; e++) {
          const q = [...p];
          q[axis] += sgn;
          q[ta[e >> 1]] += e & 1 ? 1 : -1;
          if (has(q[0], q[1], q[2])) bits |= 1 << e;
        }
        if (face < 3) lo += bits * 16 ** face; else hi += bits * 16 ** (face - 3);
      }
      this.ao[i * 2] = lo; this.ao[i * 2 + 1] = hi;
    }
    this.aoAttr.needsUpdate = true;
  }

  setState(i, paint, paintTime, breakTime, mistakeTime) {
    const s = this.state;
    if (paint !== undefined) s[i * 4] = paint;
    if (paintTime !== undefined) s[i * 4 + 1] = paintTime;
    if (breakTime !== undefined) s[i * 4 + 2] = breakTime;
    if (mistakeTime !== undefined) s[i * 4 + 3] = mistakeTime;
    this.stateAttr.needsUpdate = true;
  }

  ripple(cell, time, amplitude = 1, speed = 7) {
    const k = this.ripIndex++ % MAX_RIPPLES;
    this.uniforms.uRip.value[k].set(cell[0], cell[1], cell[2], time);
    this.uniforms.uRipParam.value[k].set(amplitude, speed);
  }
}
