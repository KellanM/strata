// The puzzle block: a single instanced draw with a hand-written shader.
// Lighting is a colour ramp picked by face direction (no physical shading),
// with baked-style contact shadows in concave corners, a vertical gradient,
// clue glyphs from an atlas, and shader-driven break / peel / ripple motion.
import * as THREE from 'three';

const ATLAS_COLS = 8;
const MAX_RIPPLES = 8;
const SPARKS = 16;   // atmosphere.js SPARK_LIGHTS: the sparks that light the stone

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
  attribute vec3 aFocus;   // tutorial outline: strength from, to, and when it changed
  attribute vec2 aFocusEdge;   // which face edges carry the outline, packed as aAO

  uniform float uTime;
  uniform vec3 uDims;
  uniform vec3 uPeel;      // axis, layers kept (animated), side (+1 / -1)
  uniform vec4 uRip[${MAX_RIPPLES}];       // origin.xyz, start time
  uniform vec2 uRipParam[${MAX_RIPPLES}];  // amplitude, speed
  uniform vec2 uFocusDur;  // seconds for the outline to arrive, and to leave
  uniform float uWin;      // time the puzzle was solved (-99 while playing)
  uniform float uIntro;    // time the level began: the block assembles itself (-99 = no intro)
  uniform float uIntroSpeed;   // 1 in levels; faster for the title's logo

  varying vec3 vN;
  varying vec3 vWN;
  varying vec3 vWP;
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
  varying float vFocus;
  varying float vFocusBits;

  void main() {
    vec3 n = normal;
    float axis = abs(n.x) > 0.5 ? 0.0 : (abs(n.y) > 0.5 ? 1.0 : 2.0);
    vTile = axis == 0.0 ? aClue.x : (axis == 1.0 ? aClue.y : aClue.z);
    float face = axis * 2.0 + (n.x + n.y + n.z > 0.0 ? 1.0 : 0.0);
    float packed = face < 3.0 ? aAO.x : aAO.y;
    float f3 = mod(face, 3.0);
    float div = f3 < 0.5 ? 1.0 : (f3 < 1.5 ? 16.0 : 256.0);
    vAOBits = mod(floor(packed / div + 0.001), 16.0);
    vFocusBits = mod(floor((face < 3.0 ? aFocusEdge.x : aFocusEdge.y) / div + 0.001), 16.0);

    vec3 center = aCell - (uDims - 1.0) * 0.5;
    float scale = 1.0;
    vec3 offset = vec3(0.0);

    // the level begins: cubes drop into place layer by layer, from the base up
    // and the centre out, each landing with a small settle
    if (uIntro > -50.0) {
      float hgt = aCell.y / max(uDims.y - 1.0, 1.0);
      vec2 mid = (uDims.xz - 1.0) * 0.5;
      float spread = length(aCell.xz - mid) / max(length(mid), 1.0);
      float k = ((uTime - uIntro) * uIntroSpeed - (hgt * 0.28 + spread * 0.1)) / 0.3;   // layers overlap: the next falls before the last has settled
      if (k < 0.0) { gl_Position = vec4(0.0, 0.0, 2.0, 1.0); return; }
      if (k < 1.0) {
        float fall = 1.0 - pow(1.0 - k, 3.0);
        offset.y += (1.0 - fall) * 1.6;
        float c1 = 1.7, c3 = c1 + 1.0;                       // ease out with a gentle overshoot
        scale *= 0.55 + 0.45 * (1.0 + c3 * pow(k - 1.0, 3.0) + c1 * pow(k - 1.0, 2.0));
      }
    }

    // chiselled away: the cube is gone the instant it splits into pieces (fragments.js)
    if (aState.z >= 0.0 && uTime >= aState.z) { gl_Position = vec4(0.0, 0.0, 2.0, 1.0); return; }

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

    // tutorial: how strongly this cube is outlined, easing between hints
    float fk = clamp((uTime - aFocus.z) / (aFocus.y > aFocus.x ? uFocusDur.x : uFocusDur.y), 0.0, 1.0);
    vFocus = mix(aFocus.x, aFocus.y, fk * fk * (3.0 - 2.0 * fk));

    float height = aCell.y / max(uDims.y - 1.0, 1.0);

    // solved: a held breath (the block tightens), then after the landing every
    // cube hops in a wave that climbs from the base to the crown
    float won = uTime - uWin;
    if (won >= 0.0 && won < 3.0) {
      float squeeze = sin(3.14159 * clamp(won / 0.32, 0.0, 1.0));
      scale *= 1.0 - 0.09 * squeeze;
      offset -= center * 0.05 * squeeze;
      float h = (won - 1.0 - height * 0.55) / 0.42;
      if (h > 0.0 && h < 1.0) {
        float b = sin(3.14159 * h);
        offset.y += 0.26 * b;
        scale *= 1.0 + 0.07 * b;
        glow += 0.9 * b;
      }
    }

    vGlow = glow;
    vN = n;
    vWN = normalize(mat3(modelMatrix) * n);
    vLocal = position;
    vUv = uv;
    vState = aState;
    vColor = aColor;
    vCell = aCell;
    vHeight = height;

    vec3 p = position * 0.965 * scale + center + offset;
    vWP = (modelMatrix * vec4(p, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uAtlas;
  uniform float uTime;
  uniform float uMask;
  uniform float uReveal;
  uniform float uWin;
  uniform vec3 uDims;
  uniform vec3 uHover;
  uniform float uBreath;   // 0..1: the outline's breath, on the music's beat (held under Reduce Motion)
  uniform float uFocusDim; // 0..1: while something is outlined, the rest of the stone rests in tinted shade
  uniform float uGhost;    // tutorial: the hidden object shows faintly through the stone (0 = not at all)
  uniform float uGild;     // a shrine: gold on the edge lines (0 = none)
  uniform vec2 uLight;     // xz direction of the key light
  uniform vec3 cTop, cLit, cShade, cUnder;
  uniform vec3 pTop, pLit, pShade;
  uniform vec3 cHaze, cGlow, cMistake;
  uniform vec3 cFocus;     // the outline's tone where the stone is pale (a deeper glow of the same hue)
  uniform vec4 uSparks[${SPARKS}];   // the sparks in the air: position, brightness
  uniform vec3 uSparkCol;

  varying vec3 vN;
  varying vec3 vWN;
  varying vec3 vWP;
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
  varying float vFocus;
  varying float vFocusBits;

  float bit(float bits, float p2) { return mod(floor(bits / p2 + 0.001), 2.0); }

  vec3 ramp(vec3 n, vec3 top, vec3 lit, vec3 shade, vec3 under) {
    if (n.y > 0.5) return top;
    if (n.y < -0.5) return under;
    float l = dot(n.xz, uLight) * 0.5 + 0.5;
    return mix(shade, lit, smoothstep(0.1, 0.9, l));
  }

  void main() {
    // the rays' mask: r = silhouette; g = outlined cubes, which glow out into the air (atmosphere.js)
    if (uMask > 0.5) { gl_FragColor = vec4(vPeelFade, vFocus * (0.55 + 0.45 * uBreath), 0.0, 1.0); return; }

    vec3 n = normalize(vN);       // block space: face layout, creases, glyphs
    vec3 wn = normalize(vWN);     // world space: lighting, so a turning object turns through the ramp
    vec3 base = ramp(wn, cTop, cLit, cShade, cUnder);

    // painted: colour blooms out from the face centre
    if (vState.x > 0.5) {
      float t = clamp((uTime - vState.y) / 0.35, 0.0, 1.0);
      float r = length(vUv - 0.5);
      float fill = smoothstep(t * 0.75, t * 0.75 - 0.05, r);
      vec3 paint = ramp(wn, pTop, pLit, pShade, pShade * 0.7);
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
    base = mix(base, base * (wn.y > 0.5 ? 1.07 : 0.9), edge);
    // a shrine's stone is gilded: only that thin rim turns gold, so the faces
    // (and their clues) stay as they are
    base = mix(base, wn.y > 0.5 ? vec3(1.0, 0.87, 0.52) : vec3(0.88, 0.67, 0.3), edge * 0.6 * uGild);

    // vertical gradient: bases sink into haze
    base = mix(cHaze, base, 0.78 + 0.22 * smoothstep(0.0, 0.85, vHeight));

    // tutorial: the hidden object shows through the stone in its own colours,
    // so the goal is seen before a word is read (the first lessons' ghost)
    if (uGhost > 0.0 && dot(vColor, vec3(1.0)) > 0.01) {
      vec3 gc = vColor * ramp(wn, vec3(1.05), vec3(0.92), vec3(0.72), vec3(0.55));
      base = mix(base, gc, uGhost);
    }

    // tutorial: the cubes a hint is about are outlined in light. A soft glow
    // gathers along the group's outer edges (not between its own cubes) and the
    // faces lift a little, breathing on the music's beat. On pale stone the
    // light deepens to the palette's warmer glow so it still reads. Lit before
    // the glyph is inked, so the numbers re-ink over it and stay legible.
    float lit = smoothstep(0.0, 0.3, vFocus);
    // the shade's hue at a set depth, so pale palettes settle as much as dark ones
    vec3 hush = cShade / max(dot(cShade, vec3(0.299, 0.587, 0.114)), 0.05) * 0.7;
    base = mix(base, base * hush, 0.55 * uFocusDim * (1.0 - lit));
    if (vFocus > 0.002) {
      float d = 1.0;
      if (bit(vFocusBits, 1.0) > 0.5) d = min(d, u);
      if (bit(vFocusBits, 2.0) > 0.5) d = min(d, 1.0 - u);
      if (bit(vFocusBits, 4.0) > 0.5) d = min(d, v);
      if (bit(vFocusBits, 8.0) > 0.5) d = min(d, 1.0 - v);
      float seam = exp(-d / 0.028);                          // a thin line of light along the outline
      float soft = exp(-d / (0.08 + 0.05 * uBreath));        // and its glow, spreading in as it breathes
      float pale = smoothstep(0.55, 0.85, dot(base, vec3(0.299, 0.587, 0.114)));
      vec3 tone = mix(cGlow * 1.1, cFocus, pale);
      float a = pow(min(vFocus, 1.0), 1.6) * (0.55 + 0.45 * uBreath);   // a row softly, the cube to act on clearly
      base = mix(base, tone, a * (0.07 + 0.3 * soft));
      base = mix(base, mix(vec3(1.0), cFocus * 0.92, pale), a * seam * 0.85);
    }

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
      vec3 sc = vColor * ramp(wn, vec3(1.08), vec3(0.96), vec3(0.7), vec3(0.5));
      sc = mix(sc, cShade, 0.12 * (1.0 - step(0.5, wn.y)));
      col = mix(col, sc, rev);
    }

    // a band of light rides the front of the colour sweep
    float front = uReveal * 1.3 - 0.15;
    float band = exp(-pow((vHeight - front) * 7.0, 2.0)) * (1.0 - smoothstep(0.8, 1.0, uReveal)) * step(0.001, uReveal);
    col += cGlow * band * 0.6;

    // once it settles, a slow gleam crosses the finished object now and then
    float won = uTime - uWin;
    if (uWin > -50.0 && won > 2.4) {   // (uWin is -99 while playing: no gleam to mistake for a hint)
      float diag = (vCell.x + vCell.y * 1.4 + vCell.z) / (uDims.x + uDims.y * 1.4 + uDims.z);
      float g = fract((won - 2.4) / 4.5) * 1.8 - 0.4 - diag;
      col += cGlow * exp(-g * g * 160.0) * 0.32 * smoothstep(0.0, 0.5, wn.y + 0.6);
    }

    // hover
    if (distance(vCell, uHover) < 0.1) col = mix(col, vec3(1.0), 0.14 + 0.1 * edge);

    // mistake flash
    if (vState.w >= 0.0) col = mix(col, cMistake, exp(-(uTime - vState.w) * 2.5) * 0.85);

    // ripple light
    col += cGlow * vGlow * 0.22;

    // each spark in the air lights the stone a little where it passes, like a
    // firefly: a small warm pool on the faces turned toward it
    vec3 sn = normalize(vWN);
    for (int i = 0; i < ${SPARKS}; i++) {
      vec4 s = uSparks[i];
      if (s.w <= 0.0) continue;
      vec3 d = s.xyz - vWP;
      float r2 = dot(d, d);
      float ndl = max(dot(sn, d * inversesqrt(r2 + 1e-4)), 0.0);
      col += uSparkCol * s.w * (0.25 + 0.75 * ndl) * 0.28 / (1.0 + r2 * 10.0);
    }

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
      uWin: { value: -99 },
      uIntro: { value: -99 }, uIntroSpeed: { value: 1 },
      uDims: { value: new THREE.Vector3(1, 1, 1) },
      uPeel: { value: new THREE.Vector3(1, 99, 1) },
      uHover: { value: new THREE.Vector3(-99, -99, -99) },
      uFocusDur: { value: new THREE.Vector2(0.5, 0.33) },
      uBreath: { value: 0.6 }, uFocusDim: { value: 0 },
      uGhost: { value: 0 }, uGild: { value: 0 },
      uLight: { value: new THREE.Vector2(-0.45, 0.9).normalize() },
      uRip: { value: Array.from({ length: MAX_RIPPLES }, () => new THREE.Vector4(0, 0, 0, -99)) },
      uRipParam: { value: Array.from({ length: MAX_RIPPLES }, () => new THREE.Vector2(0, 1)) },
      cTop: { value: new THREE.Color() }, cLit: { value: new THREE.Color() },
      cShade: { value: new THREE.Color() }, cUnder: { value: new THREE.Color() },
      pTop: { value: new THREE.Color() }, pLit: { value: new THREE.Color() }, pShade: { value: new THREE.Color() },
      cHaze: { value: new THREE.Color() }, cGlow: { value: new THREE.Color() },
      cMistake: { value: new THREE.Color(0xff5a5f) }, cFocus: { value: new THREE.Color() },
      uSparks: { value: Array.from({ length: SPARKS }, () => new THREE.Vector4(0, 0, 0, 0)) },
      uSparkCol: { value: new THREE.Color(1, 1, 1) },
    };
    this.material = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms: this.uniforms });
    this.mesh = null;
    this.ripIndex = 0;
    this.focusAny = false;
  }

  setPalette(p) {
    const u = this.uniforms;
    u.cTop.value.setHex(p.top); u.cLit.value.setHex(p.lit);
    u.cShade.value.setHex(p.shade); u.cUnder.value.setHex(p.under);
    u.pTop.value.setHex(p.paintTop); u.pLit.value.setHex(p.paintLit); u.pShade.value.setHex(p.paintShade);
    u.cHaze.value.setHex(p.skyBottom); u.cGlow.value.setHex(p.rays);
    u.uGild.value = p.gild ?? 0;
    // the outline on pale stone: the glow's own hue, deepened until it reads against cream
    const hsl = new THREE.Color(p.glow).getHSL({});
    u.cFocus.value.setHSL(hsl.h, 0.8, 0.56);
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
    this.focus = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) this.focus[i * 3 + 2] = -99;
    this.focusEdge = new Float32Array(n * 2);

    geo.setAttribute('aCell', new THREE.InstancedBufferAttribute(cell, 3));
    geo.setAttribute('aClue', new THREE.InstancedBufferAttribute(clue, 3));
    geo.setAttribute('aColor', new THREE.InstancedBufferAttribute(color, 3));
    this.stateAttr = new THREE.InstancedBufferAttribute(this.state, 4);
    this.stateAttr.setUsage(THREE.DynamicDrawUsage);
    this.aoAttr = new THREE.InstancedBufferAttribute(this.ao, 2);
    this.aoAttr.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('aState', this.stateAttr);
    geo.setAttribute('aAO', this.aoAttr);
    this.focusAttr = new THREE.InstancedBufferAttribute(this.focus, 3);
    this.focusAttr.setUsage(THREE.DynamicDrawUsage);
    this.focusEdgeAttr = new THREE.InstancedBufferAttribute(this.focusEdge, 2);
    this.focusEdgeAttr.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('aFocus', this.focusAttr);
    geo.setAttribute('aFocusEdge', this.focusEdgeAttr);

    if (!this.mesh) {
      this.mesh = new THREE.Mesh(geo, this.material);
      this.mesh.frustumCulled = false;
    } else {
      this.mesh.geometry = geo;
    }
    this.uniforms.uDims.value.set(...puzzle.dims);
    this.uniforms.uReveal.value = 0;
    this.uniforms.uWin.value = -99;
    this.mesh.rotation.set(0, 0, 0);
    this.mesh.position.set(0, 0, 0);
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

  // Tutorial outline. target[i]: how strongly cube i is outlined now (0 none,
  // ~0.6 a row a number counts, 1 a cube to act on). Changed cubes ease from
  // where they are. The outline runs round each group of equal strength, so a
  // row reads as one shape and the cube to tap inside it as its own.
  setFocus(puzzle, present, target, time) {
    const f = this.focus, dur = this.uniforms.uFocusDur.value;
    const shown = (i) => {
      const from = f[i * 3], to = f[i * 3 + 1], t0 = f[i * 3 + 2];
      const k = Math.min(1, Math.max(0, (time - t0) / (to > from ? dur.x : dur.y)));
      return from + (to - from) * k * k * (3 - 2 * k);
    };
    let changed = false;
    for (let i = 0; i < puzzle.size; i++) {
      const want = present(i) ? target?.[i] || 0 : 0;
      if (want === f[i * 3 + 1]) continue;
      f[i * 3] = shown(i); f[i * 3 + 1] = want; f[i * 3 + 2] = time;
      changed = true;
    }
    // a fading cube keeps its old outline while it goes
    const group = (i) => f[i * 3 + 1] || (time - f[i * 3 + 2] < dur.y ? f[i * 3] : 0);
    const [X, Y, Z] = puzzle.dims;
    for (let i = 0; i < puzzle.size; i++) {
      const g = group(i);
      let lo = 0, hi = 0;
      if (g > 0) {
        const p = puzzle.coords(i);
        for (let face = 0; face < 6; face++) {
          const axis = face >> 1;
          const ta = [[1, 2], [2, 0], [0, 1]][axis];   // tangents, as in updateAO and the shader
          let bits = 0;
          for (let e = 0; e < 4; e++) {
            const q = [...p];
            q[ta[e >> 1]] += e & 1 ? 1 : -1;
            const inside = q[0] >= 0 && q[1] >= 0 && q[2] >= 0 && q[0] < X && q[1] < Y && q[2] < Z;
            const j = inside ? puzzle.idx(q[0], q[1], q[2]) : -1;
            if (j < 0 || !present(j) || group(j) !== g) bits |= 1 << e;
          }
          if (face < 3) lo += bits * 16 ** face; else hi += bits * 16 ** (face - 3);
        }
      }
      if (lo !== this.focusEdge[i * 2] || hi !== this.focusEdge[i * 2 + 1]) changed = true;
      this.focusEdge[i * 2] = lo; this.focusEdge[i * 2 + 1] = hi;
    }
    if (changed) { this.focusAttr.needsUpdate = true; this.focusEdgeAttr.needsUpdate = true; }
    this.focusAny = target ? target.some((v) => v > 0) : false;
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
