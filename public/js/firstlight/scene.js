// First light: the title (Kellan, 2026-10-24; prototyped in proto/firstlight,
// P3 in docs/ftue-study.md). Night, a wall of old stone, one cube glowing
// inside it. Tap it: it opens, its light rises like incense smoke and turns
// like a flock, and settles into the sky as its first stars; some of them
// write the name, a constellation. Then the swipe down to the map.
//
//   const fl = createFirstLight({ canvas, hint, onNamed })
//   fl.tap(x, y)    a touch on the title: opens the stone if it is near it
//                   (else shows where to touch); true if it opened it
//   fl.opened / fl.named
//   fl.finish()     straight to the finished sky (coming back to the title)
//   fl.pause() / fl.resume()   draw only while the title shows
import * as THREE from 'three';
import { Swarm, Trails, rng } from './swarm.js';
import { Sound } from './sound.js';
import { PALETTES } from '../palettes.js';
import { Fragments } from '../fragments.js';
import { Shards, Ash } from '../atmosphere.js';

// nameStyle: 'lines' (a constellation drawn along the letters) or 'negative'
// (a dense cluster of stars around the letters, which are left dark)
// withWall: false leaves the glowing stone alone in the night, no wall under it
// veil: an element over the sky behind the scene; black until the stone opens
// onChisel(progress): each of the 27 cubes as it breaks (0..1 through the cascade), for its sound
export function createFirstLight({ canvas, hint = null, veil = null, onNamed = null, onOpen = null, onChisel = null, nameStyle = 'lines', withWall = true }) {
  const negative = nameStyle === 'negative';
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  const DPR = Math.min(2, window.devicePixelRatio || 1);
  renderer.setPixelRatio(DPR);
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
  const CAM_Z = 24;
  // the camera's height on the wall, and at rest: only a little way up, so the
  // wall's top stays in view at the foot of the sky, a horizon under the name
  let CAM_FROM = 2; const CAM_TO = 9;   // CAM_FROM is the glowing cube's height (set below): it opens dead centre on every screen
  const scene = new THREE.Scene();
  const swarmScene = new THREE.Scene();

  // ---------------------------------------------------------------- the wall
  // A low wall of the game's own stone (Kellan, 2026-10-24): coloured as a
  // level's block is (palettes.js Dawn: a face's colour by the way it faces),
  // level along its top, the glowing stone resting there. Lit by the night and
  // by whatever light is near it (the glowing cube, then the rising swarm).
  const P = PALETTES[0];
  const TOP = 1;   // the top row of stones
  const CUBE_AT = new THREE.Vector3(0, TOP + 1, 0);
  // The logo's stone (Kellan, 2026-10-28): a geode. A 3x3x3 block of stone with
  // its middle cube missing and a light in the hollow, shining out through the
  // cracks between the 26 stones. A touch on any of them releases the light - it
  // becomes the swarm, the stars and the name - and clears the stones as a row of
  // zeros clears in a level, from the touched one outward. How it is turned
  // (?rot= to try others): iso, corner-on as the app icon shows it; game, a
  // level's own three-quarter view from above; soft, turned a little less and
  // seen a little lower; front, nearly face on
  const TURNS = { iso: [Math.atan(1 / Math.SQRT2), -Math.PI / 4], game: [0.5, -Math.PI / 4], soft: [0.36, -0.6], front: [0.3, -0.38] };
  const [PITCH, YAW] = TURNS[new URLSearchParams(globalThis.location?.search ?? '').get('rot')] ?? TURNS.soft;   // soft (Kellan, 2026-10-28: corner-on looked strange)
  // its turn: the resting one, plus however a finger has turned it (turnBy)
  const ISO = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), PITCH)
    .multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), YAW));
  const stoneCells = [];   // each stone's cell on the lattice, from the hollow (CUBE_AT)
  for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) {
    if (!x && !y && !z) continue;   // the hollow
    stoneCells.push(new THREE.Vector3(x, y, z));
  }
  {
    // the block on the screen's centre line, its lowest point resting on the wall's top
    let low = 0;
    for (let x = -1.5; x <= 1.5; x += 3) for (let y = -1.5; y <= 1.5; y += 3) for (let z = -1.5; z <= 1.5; z += 3)
      low = Math.min(low, new THREE.Vector3(x, y, z).applyQuaternion(ISO).y);
    CUBE_AT.set(0, Math.max(TOP + 1, TOP + 0.5 - low), 0);   // the hollow, where the light is
    CAM_FROM = CUBE_AT.y;   // the camera opens level with it
  }
  const rand = rng(11);
  const cells = [];
  for (let x = -8; x <= 8; x++) {
    for (let y = -22; y <= TOP; y++) {
      const z = (rand() - 0.5) * 0.18 + (rand() < 0.06 ? 0.28 : 0) - (rand() < 0.05 ? 0.3 : 0);
      const c = new THREE.Color(1, 1, 1).multiplyScalar(0.93 + rand() * 0.1);   // each stone a touch lighter or darker
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
      uTopC: { value: new THREE.Color(P.top) }, uLitC: { value: new THREE.Color(P.lit) },
      uShadeC: { value: new THREE.Color(P.shade) }, uUnderC: { value: new THREE.Color(P.under) },
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
      uniform vec3 uTopC, uLitC, uShadeC, uUnderC;
      varying vec3 vN, vW, vC; varying vec2 vUv;
      void main() {
        vec3 n = normalize(vN);
        // the block's colour script: tops pale, the faces toward us warm, the sides in shade
        vec3 base = (n.y > 0.5 ? uTopC : n.y < -0.5 ? uUnderC : abs(n.z) > 0.5 ? uLitC : uShadeC) * vC;
        // the night: a cool, low fill, a little brighter on tops (the sky's light)
        vec3 col = base * vec3(0.13, 0.13, 0.24) * (0.8 + 0.5 * max(n.y, 0.0)) * uMoon;
        for (int i = 0; i < ${MAX_LIGHTS}; i++) {
          vec3 d = uL[i] - vW; float r = length(d);
          float ndl = max(dot(n, d / r), 0.0) * 0.8 + 0.2;
          col += base * uLc[i] * ndl * uLi[i] / (1.0 + 0.32 * r * r);
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
  if (withWall) scene.add(wall);
  // behind the stones, the dark of the wall's core: the seams between them never show the sky
  const core = new THREE.Mesh(new THREE.PlaneGeometry(17, 24), new THREE.MeshBasicMaterial({ color: 0x08070d }));
  core.position.set(0, TOP - 11.5, -0.5);
  if (withWall) scene.add(core);

  // ---------------------------------------------------------------- the geode
  // The light in the hollow: a core of light filling the block's inside, seen only
  // where the cracks between the stones let it out (the stones are set a little
  // apart), and a ball of light at its heart that the touch releases
  const coreMat = new THREE.MeshBasicMaterial({ color: 0xffc27a });
  const hollow = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.8, 2.8), coreMat);
  hollow.position.copy(CUBE_AT); hollow.quaternion.copy(ISO);
  scene.add(hollow);
  const CORE = new THREE.Color(0xffc27a), CORE_HOT = new THREE.Color(0xfff0d2);
  const orb = new THREE.Sprite(new THREE.SpriteMaterial({ map: (() => {
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const g = c.getContext('2d'), grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, 'rgba(255,250,235,1)'); grd.addColorStop(0.18, 'rgba(255,226,160,0.95)');
    grd.addColorStop(0.45, 'rgba(255,170,90,0.35)'); grd.addColorStop(1, 'rgba(255,140,60,0)');
    g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  })(), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
  orb.position.copy(CUBE_AT);
  orb.scale.setScalar(1.6);
  scene.add(orb);   // hidden in the stone until the stones around it go
  let orbFrom = null;   // when the light was released (real time): it streams away from then
  // The 26 stones, lit as the wall is. The touch clears them as a row of zeros
  // clears in a level (main.js clearRow): the touched stone first, a ripple
  // running out through the block ahead of the cascade, the rest one after
  // another, nearest the touch first, the run gathering pace
  const stoneRand = rng(23);
  const stones = new THREE.InstancedMesh(box, wallMat, stoneCells.length);
  const GAP = 0.94;   // each stone's size: the cracks between them let the light out
  const ROW_CLEAR_STEP = 0.05, ROW_CLEAR_EASE = 0.9;   // a quicker run than a level's (Kellan, 2026-10-28)
  // off: the stone's place from the hollow as the block is turned now
  const stoneBreaks = stoneCells.map((cell) => ({ cell, off: cell.clone().applyQuaternion(ISO), done: false, at: 0, n: 0,
    c: new THREE.Color(1, 1, 1).multiplyScalar(0.93 + stoneRand() * 0.1) }));
  let touched = null;   // the stone the touch landed on
  function schedule(first) {
    touched = stoneBreaks[first];
    const order = [...stoneBreaks].sort((a, b) => a.off.distanceTo(touched.off) - b.off.distanceTo(touched.off) || stoneRand() - 0.5);
    let delay = 0, gap = ROW_CLEAR_STEP;
    order.forEach((f, j) => { f.at = delay; f.n = j + 1; if (j > 0) gap = Math.max(0.028, gap * ROW_CLEAR_EASE); delay += gap; });
  }
  const sq = new THREE.Quaternion().copy(ISO), sp = new THREE.Vector3(), ss = new THREE.Vector3(), rd = new THREE.Vector3();
  const rc = new THREE.Color(), RIPPLE_GLOW = new THREE.Color(1.25, 0.95, 0.7), UP = new THREE.Vector3(0, 0.8, 0);
  function placeStones(k) {   // k: seconds since the touch (null: at rest)
    let any = false;
    stoneBreaks.forEach((f, i) => {
      if (k === null) { f.done = false; stones.setColorAt(i, f.c); }
      else if (!f.done && k >= f.at) { f.done = true; breakStone(CUBE_AT.clone().add(f.off), f, f.n / stoneCells.length); }
      sp.copy(CUBE_AT).add(f.off);
      let scale = f.done ? 0.0001 : GAP;
      // the ripple running ahead of the cascade (cubes.js): out from the touched stone, and a little up
      if (k !== null && !f.done && touched) {
        const d = rd.copy(f.off).sub(touched.off), dist = d.length();
        const front = dist - k / ROW_CLEAR_STEP, env = Math.exp(-front * front * 0.9) * Math.exp(-k * 1.7) * 1.3;
        if (dist > 0.01) d.normalize();
        sp.addScaledVector(d.multiplyScalar(0.6).add(UP), env * 0.16);
        scale *= 1 - 0.07 * env;
        // and its light: a warm brightening that travels with the wave (cubes.js, ripple light)
        stones.setColorAt(i, rc.copy(f.c).lerp(RIPPLE_GLOW, Math.min(1, env * 0.5)).multiplyScalar(1 + 0.9 * env));
      }
      ss.setScalar(scale);
      stones.setMatrixAt(i, m4.compose(sp, sq, ss));
      if (!f.done) any = true;
    });
    stones.instanceMatrix.needsUpdate = true;
    if (stones.instanceColor) stones.instanceColor.needsUpdate = true;
    stones.visible = any;
  }
  placeStones(null);
  scene.add(stones);
  // Turned by a finger, as a level's block is (orbit.js: its speed, its limits,
  // its easing out): around the vertical by a sideways drag, and tipped toward or
  // away by an up-and-down one, from overhead to a little below
  const X = new THREE.Vector3(1, 0, 0), Y = new THREE.Vector3(0, 1, 0), qy = new THREE.Quaternion();
  const turn = { yaw: 0, pitch: 0, vy: 0, vp: 0, held: false, at: 0 };
  function setTurn() {
    const p = Math.min(Math.PI / 2 - 0.26, Math.max(-(Math.PI / 2 - 0.5), PITCH + turn.pitch));
    turn.pitch = p - PITCH;
    ISO.setFromAxisAngle(X, p).multiply(qy.setFromAxisAngle(Y, YAW + turn.yaw));
    for (const f of stoneBreaks) f.off.copy(f.cell).applyQuaternion(ISO);
    sq.copy(ISO);
    hollow.quaternion.copy(ISO);
    placeStones(null);
  }
  function turnBy(dx, dy) {
    const k = 2 * Math.PI / window.innerHeight * 0.75, t = performance.now();
    const a = dx * k, b = dy * k, dt = Math.max(8, t - turn.at) / 1000;
    turn.vy = a / dt; turn.vp = b / dt; turn.at = t; turn.held = true;
    turn.yaw += a; turn.pitch += b;
    setTurn();
  }
  // a soft glow round the block, from the light behind its cracks
  const haloTex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const g = c.getContext('2d'), grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, 'rgba(255,214,150,0.9)'); grd.addColorStop(0.25, 'rgba(255,170,90,0.35)'); grd.addColorStop(1, 'rgba(255,140,60,0)');
    g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  })();
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: haloTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
  halo.position.copy(CUBE_AT).setZ(CUBE_AT.z - 2.2);   // behind the block: it shows round its edges
  halo.scale.setScalar(6);
  scene.add(halo);
  // A stone breaks as a block does in a level (main.js act): it comes apart into
  // eight pieces on the block's lattice that shrink away from the touched stone's
  // side, a few chips fly, and its sparks splash out and rise
  const GLOW = { top: 0xfff2cc, lit: 0xffd590, shade: 0xe9a560, under: 0xb8743c };
  const shards = new Shards(), ash = new Ash();
  ash.setPalette({ skyTop: 0x121731, skyBottom: 0x2a2f5c, shade: GLOW.shade, motes: 0xfff1d6 });
  // the pieces are shaded as their stones are: the same colours, the night, the light out of the cracks and the rising stream
  const { uL, uLc, uLi, uMoon } = wallMat.uniforms;
  const stoneFrags = new Fragments({ value: new THREE.Vector2(-0.45, 0.9).normalize() }, 8 * 60, ISO, { uL, uLc, uLi, uMoon });
  const STONE = { top: P.top, lit: P.lit, shade: P.shade, under: P.under };
  stoneFrags.setPalette(STONE);
  const m4r = new THREE.Matrix4();
  const latticeToPieces = () => stoneFrags.uniforms.uRot.value.setFromMatrix4(m4r.makeRotationFromQuaternion(ISO));
  // the chips aren't lit (atmosphere.js Shards): their colours as the stone looks at night by its glow
  const night = (h, k) => new THREE.Color(h).multiply(new THREE.Color(1, 0.78, 0.56)).multiplyScalar(k);
  const CHIPS = [night(P.top, 0.62), night(P.lit, 0.55), night(P.top, 0.62)];
  scene.add(stoneFrags.mesh, shards.points, ash.points);
  function breakStone(at, f, progress) {
    const t = realT, c = (h) => new THREE.Color(h), out = f.off.clone().normalize();
    if (!quiet) onChisel?.(progress);
    // the shrink spreads from the side toward the touched stone (the touched one: from its face toward us)
    const toward = f === touched ? new THREE.Vector3(0, 0.2, 1) : touched.off.clone().sub(f.off);
    stoneFrags.burst(at, at.clone().addScaledVector(toward.normalize(), 0.5), t);
    shards.burst(at, t, CHIPS, 2, 0.3, { size: 0.4, life: 0.5, gravity: 1.2, spread: 0.85 });
    if (!quiet) ash.burst(at, 9, out.add(new THREE.Vector3(0, 0.3, 0.6)).normalize(), c(GLOW.shade));
  }
  let unitPx = 30;   // device px per world unit at the stone's depth (the shards' and sparks' size)

  // ---------------------------------------------------------------- the sky's places for stars
  const starRand = rng(5), starPlaces = [];
  for (let i = 0; i < 1800; i++) {
    const z = -14 * starRand() ** 1.5;
    const spread = 1 + -z / CAM_Z;   // farther stars spread wider, to fill the same view
    starPlaces.push((starRand() - 0.5) * 11 * spread * (window.innerWidth / window.innerHeight < 0.75 ? 1 : 2.2), 2.5 + 17.5 * starRand() ** 0.85 * (0.9 + 0.2 * spread), z);
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
  const nameStars = [], nameLines = [], nameGlow = new THREE.Vector4(), fieldStars = [], sprayStars = [];
  // where the name settles (screen height, -1 bottom .. 1 top) and how many stars
  // are sprayed across the sky behind it, a band like the Milky Way (Kellan,
  // 2026-10-28: it settled high, over a wide empty sky). ?namey= and ?spray= to try others
  const q = new URLSearchParams(globalThis.location?.search ?? '');
  const NAME_Y = +(q.get('namey') ?? 0.35), SPRAY = +(q.get('spray') ?? 3000);
  // The horizon (Kellan, 2026-10-28: the sky ended in a straight line, a blanket
  // laid down as the camera settled): low in the resting view the stars thin out
  // into the glow, as real ones do, along an uneven line. keep(x, y, z, r): r in 0..1
  let horizon = () => true;
  {
    const word = 'STRATA', GAP = 1.15, W = word.length * 2 + (word.length - 1) * GAP;
    // the camera's resting pose (as step() leaves it at the top)
    const rest = camera.clone();
    rest.aspect = window.innerWidth / window.innerHeight;
    rest.fov = rest.aspect < 0.75 ? 45 : 38;
    rest.updateProjectionMatrix();
    rest.position.set(0, CAM_TO, CAM_Z); rest.lookAt(0, CAM_TO + 1.5, 0); rest.updateMatrixWorld();
    const hv = new THREE.Vector3(), hr = rng(53);
    horizon = (x, y, z) => {
      hv.set(x, y, z).project(rest);
      const e = hv.y + 0.16 * Math.sin(hv.x * 2.6 + 0.4) + 0.09 * Math.sin(hv.x * 6.3 + 2.1);   // the uneven line
      const k = Math.min(1, Math.max(0, (e + 1.1) / 0.75));
      return hr() < k * k * (3 - 2 * k);   // a few at the foot of the screen, all of them by a third of the way up
    };
    const at = (nx, ny) => {   // screen (-1..1) to the sky plane z = -1
      const d = new THREE.Vector3(nx, ny, 0.5).unproject(rest).sub(rest.position).normalize();
      return rest.position.clone().addScaledVector(d, (-1 - rest.position.z) / d.z);
    };
    const left = at(-0.78, NAME_Y), right = at(0.78, NAME_Y), k = (right.x - left.x) / W;
    const base = left.y - 1.5 * k;
    const place = (gx, gy) => {
      const x = left.x + gx * k, y = base + gy * k;
      let j = nameStars.findIndex(([px, py]) => Math.hypot(px - x, py - y) < 0.3 * k);
      if (j < 0) { j = nameStars.length; nameStars.push([x, y, -1]); }
      return j;
    };
    // the negative name: the word set heavy on a small canvas, a distance field
    // from its letters, and stars scattered round them - thickest right against
    // their edges, thinning outward - so the letters are dark shapes in a cloud
    let letterGap = () => Infinity;   // world distance from a point to the nearest letter (0 inside)
    if (negative) {
      const CW = 560, PAD = 70, CH = 150 + 2 * PAD, W2 = CW + 2 * PAD;
      const cv = document.createElement('canvas'); cv.width = W2; cv.height = CH;
      const g = cv.getContext('2d');
      let size = 150;
      g.font = `500 ${size}px "Avenir Next", Avenir, "Helvetica Neue", "Segoe UI", system-ui, sans-serif`;
      try { g.letterSpacing = '6px'; } catch { /* older engines */ }
      size *= CW / g.measureText(word).width;
      g.font = `500 ${size}px "Avenir Next", Avenir, "Helvetica Neue", "Segoe UI", system-ui, sans-serif`;
      g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#fff';
      g.fillText(word, W2 / 2, CH / 2 + size * 0.04);
      const img = g.getImageData(0, 0, W2, CH).data;
      // chamfer distance (px) to the nearest letter pixel
      const D = new Float32Array(W2 * CH);
      for (let i = 0; i < D.length; i++) D[i] = img[i * 4 + 3] > 110 ? 0 : 1e6;
      const pass = (i, j, w) => { if (D[j] + w < D[i]) D[i] = D[j] + w; };
      for (let y = 0; y < CH; y++) for (let x = 0; x < W2; x++) {
        const i = y * W2 + x;
        if (x > 0) pass(i, i - 1, 1); if (y > 0) { pass(i, i - W2, 1); if (x > 0) pass(i, i - W2 - 1, 1.414); if (x < W2 - 1) pass(i, i - W2 + 1, 1.414); }
      }
      for (let y = CH - 1; y >= 0; y--) for (let x = W2 - 1; x >= 0; x--) {
        const i = y * W2 + x;
        if (x < W2 - 1) pass(i, i + 1, 1); if (y < CH - 1) { pass(i, i + W2, 1); if (x < W2 - 1) pass(i, i + W2 + 1, 1.414); if (x > 0) pass(i, i + W2 - 1, 1.414); }
      }
      const u = (right.x - left.x) / CW, ox = (left.x + right.x) / 2, oy = base + 1.5 * k;   // world per px, the word's centre
      const toPx = (x, y) => [Math.round((x - ox) / u + W2 / 2), Math.round(CH / 2 - (y - oy) / u)];
      letterGap = (x, y) => {
        const [px, py] = toPx(x, y);
        if (px < 0 || py < 0 || px >= W2 || py >= CH) return Infinity;
        return D[py * W2 + px] * u;
      };
      const nr = rng(41), SP = 4.2;
      for (let py = 0; py < CH; py += SP) for (let px = 0; px < W2; px += SP) {
        const x = px + (nr() - 0.5) * SP, y = py + (nr() - 0.5) * SP;
        const d = D[Math.min(CH - 1, Math.max(0, Math.round(y))) * W2 + Math.min(W2 - 1, Math.max(0, Math.round(x)))];
        if (d < 3.5) continue;                                            // the letters, and a hair's gap round them
        const edge = Math.min(x, W2 - x, y, CH - y) / PAD;                // the cloud's own soft outer edge
        if (nr() > 0.6 * Math.exp(-(d - 3.5) / 17) * Math.min(1, edge * 1.3)) continue;   // a lighter cloud: fewer stars crowd the edges
        nameStars.push([ox + (x - W2 / 2) * u, oy + (CH / 2 - y) * u, -1]);
      }
    }
    if (!negative) [...word].forEach((ch, n) => {
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
    // the sky kept clear where the name must read: right on the strokes (lines), or inside the letters (negative)
    const near = negative ? (x, y, r) => letterGap(x, y) < r * 0.35
      : (x, y, r) => nameStars.some(([px, py]) => Math.hypot(px - x, py - y) < r);
    const v = new THREE.Vector3(), w = new THREE.Vector3(), clear = [];
    for (let i = 0; i < starPlaces.length; i += 3) {
      v.set(starPlaces[i], starPlaces[i + 1], starPlaces[i + 2]).project(rest);
      // where it appears against the name's plane
      w.set(v.x, v.y, 0.5).unproject(rest).sub(rest.position).normalize();
      const d = (-1 - rest.position.z) / w.z;
      if (near(rest.position.x + w.x * d, rest.position.y + w.y * d, 0.5 * k)) continue;
      if (!horizon(starPlaces[i], starPlaces[i + 1], starPlaces[i + 2])) continue;
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
      if (withWall && y < TOP + 1.2) continue;                                // the wall, not the sky
      if (z > -4 && near(x, y, 0.5 * k)) continue;
      if (!horizon(x, y, z)) continue;
      fieldStars.push(x, y, z);
    }
    for (let n = 0; n < (negative ? 60 : 150);) {
      const a = gr() * Math.PI * 2, r = Math.sqrt(-Math.log(1 - gr() * 0.95)) * 0.6;   // dense at the centre, thinning outward
      const x = cx + Math.cos(a) * r * rx, y = cy + Math.sin(a) * r * ry;
      if (near(x, y, 0.75 * k)) continue;
      fieldStars.push(x, y, -1.5 - 2 * gr()); n++;
    }
    // the spray: a broad band of small stars sweeping through the name, from the
    // lower left of the screen to the upper right, densest along its spine
    const sp = rng(41), TILT = 0.55;   // the band's slope on screen
    for (let n = 0, tries = 0; n < SPRAY && tries < SPRAY * 6; tries++) {
      const t = sp() * 2.6 - 1.3, across = (sp() + sp() + sp() - 1.5) * 0.3 * (0.5 + sp());
      const nx = t / Math.hypot(1, TILT) - across * TILT / Math.hypot(1, TILT), ny = NAME_Y - 0.15 + t * TILT / Math.hypot(1, TILT) * 2 + across / Math.hypot(1, TILT);
      if (Math.abs(nx) > 1.1 || ny < -1.2 || ny > 1.1) continue;
      const z = -3 - 10 * sp();
      on.set(nx, ny, 0.5).unproject(rest).sub(rest.position).normalize();
      const x = rest.position.x + on.x * (z - rest.position.z) / on.z, y = rest.position.y + on.y * (z - rest.position.z) / on.z;
      if ((withWall && y < TOP + 1.2) || near(x, y, 0.45 * k) || !horizon(x, y, z)) continue;
      sprayStars.push(x, y, z); n++;
    }
    for (const [x, y, z] of nameStars) starPlaces.push(x, y, z);
  }
  const swarm = new Swarm({ count: 1200, source: CUBE_AT, stars: new Float32Array(starPlaces), px: DPR, reserved: nameStars.length, nameSpeed: 2.5,
    nameSize: negative ? [0.75, 0.5] : [1.7, 0.25] });
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
          vA = wake * flash * (0.45 + 0.7 * c + 0.4 * aSeed) * (1.0 - 0.4 + 0.4 * sin(uTime * (0.9 + 1.6 * aSeed) + aSeed * 50.0) * sin(uTime * (0.37 + 0.5 * aSeed) + aSeed * 17.0) + 0.9 * pow(max(0.0, sin(uTime * (0.21 + 0.35 * aSeed) + aSeed * 91.0)), 40.0));
          gl_PointSize = (2.0 + 3.2 * aSeed * aSeed + 2.6 * c) * uPx * clamp(14.0 / -mv.z, 0.6, 1.2);
          gl_Position = projectionMatrix * mv; }`,
      fragmentShader: 'varying float vA; void main(){ vec2 q = gl_PointCoord * 2.0 - 1.0; float a = min(1.0, exp(-dot(q,q) * 3.5) * vA * 1.6); gl_FragColor = vec4(vec3(1.0, 0.95, 0.88) * a, a); }',
    });
    const p = new THREE.Points(g, m); p.frustumCulled = false;
    return p;
  })();
  const fieldOn = nameField.geometry.attributes.aOn, fieldRand = rng(31);
  let dawnAt = null;   // when the sky began to come (real time): the tap, or a swipe that left without one
  let fieldLeft = fieldOn.count;
  scene.add(nameField);
  swarmScene.add(swarm.points);
  const trails = new Trails(renderer);

  // faint far stars that come out once the first ones are home (the sky remembering)
  const far = (() => {
    const n = 700, pos = new Float32Array(n * 3), seed = new Float32Array(n), r = rng(9);
    for (let i = 0; i < n; i++) {
      let x, y, z;
      do { x = (r() - 0.5) * 60; y = 40 * r(); z = -30 - 10 * r(); } while (!horizon(x, y, z));   // they too fade low in the sky
      pos.set([x, y, z], i * 3); seed[i] = r();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    const m = new THREE.ShaderMaterial({
      uniforms: { uA: { value: 0 }, uTime: { value: 0 }, uPx: { value: DPR } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: 'attribute float aSeed; uniform float uTime, uPx; varying float vA; void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); vA = (0.35 + 0.65 * aSeed) * (1.0 - 0.45 + 0.45 * sin(uTime * (0.9 + 1.6 * aSeed) + aSeed * 50.0) * sin(uTime * (0.37 + 0.5 * aSeed) + aSeed * 17.0) + 0.9 * pow(max(0.0, sin(uTime * (0.21 + 0.35 * aSeed) + aSeed * 91.0)), 40.0)); gl_PointSize = (0.8 + 1.6 * aSeed * aSeed) * uPx; gl_Position = projectionMatrix * mv; }',
      fragmentShader: 'uniform float uA; varying float vA; void main(){ vec2 q = gl_PointCoord * 2.0 - 1.0; float a = exp(-dot(q,q) * 4.0) * vA * uA; gl_FragColor = vec4(vec3(0.85, 0.88, 1.0) * a, a); }',
    });
    const p = new THREE.Points(g, m); p.frustumCulled = false;
    return p;
  })();
  scene.add(far);
  // the spray behind the name (sprayStars): small and dim, like the far stars, coming out as the name is written
  const spray = (() => {
    const n = sprayStars.length / 3, seed = new Float32Array(n), r = rng(43);
    for (let i = 0; i < n; i++) seed[i] = r() ** 1.6;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(sprayStars), 3));
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    const m = new THREE.ShaderMaterial({
      uniforms: { uA: { value: 0 }, uTime: { value: 0 }, uPx: { value: DPR } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: 'attribute float aSeed; uniform float uTime, uPx; varying float vA; void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); vA = (0.3 + 0.7 * aSeed) * (1.0 - 0.45 + 0.45 * sin(uTime * (0.9 + 1.6 * aSeed) + aSeed * 50.0) * sin(uTime * (0.37 + 0.5 * aSeed) + aSeed * 17.0) + 0.9 * pow(max(0.0, sin(uTime * (0.21 + 0.35 * aSeed) + aSeed * 91.0)), 40.0)); gl_PointSize = (1.3 + 2.6 * aSeed * aSeed) * uPx; gl_Position = projectionMatrix * mv; }',
      fragmentShader: 'uniform float uA; varying float vA; void main(){ vec2 q = gl_PointCoord * 2.0 - 1.0; float a = min(1.0, exp(-dot(q,q) * 3.5) * vA * uA); gl_FragColor = vec4(vec3(0.95, 0.93, 1.0) * a, a); }',
    });
    const p = new THREE.Points(g, m); p.frustumCulled = false;
    return p;
  })();
  scene.add(spray);

  // ---------------------------------------------------------------- timeline
  const smooth = (a, b, x) => { const k = Math.min(1, Math.max(0, (x - a) / (b - a))); return k * k * (3 - 2 * k); };
  const smoother = (a, b, x) => { const k = Math.min(1, Math.max(0, (x - a) / (b - a))); return k * k * k * (k * (6 * k - 15) + 10); };
  let nameAt = null;   // when the name's last star landed
  // after the tap the story starts fast and slows into place (Kellan, 2026-10-23):
  // the clock runs at FAST as the light leaves the stone, easing to real time as
  // the name's stars land (story s 3..11). Twinkles keep real time (realT) so the
  // settled sky stays calm.
  const FAST = 3;
  const pace = (s) => 1 + (FAST - 1) * (1 - smooth(3, 11, s));
  let tapAt = null, simT = 0, realT = 0, lastReal = null, idleSince = 0;
  let camY = CAM_FROM, tapReal = 0, dawnSpan = 7.5;   // the sky comes slowly, over the whole rise
  const sound = new Sound();
  let quiet = false;   // finish() runs the clock forward in silence
  swarm.onSettle = () => { if (!quiet) sound.star(); };

  function open(first = nearestStone()) {
    if (tapAt !== null) return;
    tapAt = simT; tapReal = realT; if (dawnAt === null) dawnAt = realT + 0.25;
    turn.vy = turn.vp = 0; turn.held = false;   // it stops where the touch found it
    latticeToPieces();
    schedule(first);   // the touched stone breaks first, the rest follow it (placeStones)
    breakAt = realT + 0.06;   // and the light in the hollow is released
    hint?.classList.remove('show');
    if (!quiet) { onOpen?.(); sound.open(2.5, false); }   // the chisel's own sound (onOpen), then the swell
  }
  let breakAt = null;
  function breakGlow() {
    // the light leaves the hollow as the swarm, a puff of its sparks with it
    const c = (h) => new THREE.Color(h);
    orbFrom = realT;
    if (!quiet) ash.burst(CUBE_AT, 30, new THREE.Vector3(0, 0.6, 0.8).normalize(), c(GLOW.lit));
    swarm.release(simT + 0.12);
  }

  function layout() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // a phone sees about nine stones across; wider screens see more sky and wall
    camera.fov = w / h < 0.75 ? 45 : 38;
    camera.updateProjectionMatrix();
    trails.setSize(w * DPR, h * DPR);
    unitPx = (h * DPR) / (2 * Math.tan(camera.fov * Math.PI / 360) * CAM_Z);
  }
  window.addEventListener('resize', layout);
  layout();

  const v3 = new THREE.Vector3();
  // it draws only while the title is showing (pause / resume)
  let running = false, raf = 0;
  function frame(real) {
    if (!running) return;
    const dt = lastReal === null ? 1 / 60 : Math.min(1 / 20, (real - lastReal) / 1000);
    lastReal = real;
    step(dt);
    render(dt);
    // the sky: black behind the glowing stone until it opens, then it fades in as the light rises
    if (veil) veil.style.opacity = dawnAt === null ? '1' : (1 - smooth(0, dawnSpan, realT - dawnAt)).toFixed(3);
    raf = requestAnimationFrame(frame);
  }
  function step(dt) {
    const sdt = dt * (tapAt === null ? 1 : pace(simT - tapAt));
    simT += sdt; realT += dt;
    const s = tapAt === null ? -1 : simT - tapAt;
    // before the tap: the cube breathes, once every 5.5 s (about a slow breath)
    const breath = 0.5 - 0.5 * Math.cos(simT * Math.PI * 2 / 5.5);
    const lit = smooth(0.4, 3.2, simT);   // the night comes up out of black
    if (tapAt === null) {
      if (!turn.held && (Math.abs(turn.vy) > 0.01 || Math.abs(turn.vp) > 0.01)) {
        turn.yaw += turn.vy * dt; turn.pitch += turn.vp * dt;
        const keep = Math.pow(1 - 0.08, dt * 60); turn.vy *= keep; turn.vp *= keep;
        setTurn();
      }
      coreMat.color.copy(CORE).lerp(CORE_HOT, 0.35 * breath).multiplyScalar(lit);
      halo.material.opacity = (0.16 + 0.14 * breath) * lit;
      halo.scale.setScalar(5.6 + 0.8 * breath);
      wallMat.uniforms.uL.value[0].copy(CUBE_AT).setZ(CUBE_AT.z + 1.8);   // the light out of the cracks, on the stones' faces
      wallMat.uniforms.uLi.value[0] = (0.55 + 0.35 * breath) * lit;
      // the fingertip: once the night is up, if nothing has been touched (docs/flow-study.md F4)
      if (hint && simT - idleSince > 3.2) {
        v3.copy(CUBE_AT).project(camera);
        hint.style.left = `${(v3.x * 0.5 + 0.5) * window.innerWidth}px`;
        hint.style.top = `${(-v3.y * 0.5 + 0.5) * window.innerHeight}px`;
        hint.classList.add('show');
      }
    } else {
      // the logo's stones are chiselled away, and then the glowing cube breaks
      if (stones.visible) placeStones(realT - tapReal);
      if (breakAt !== null && realT >= breakAt) { breakAt = null; breakGlow(); }
      // the stone opens: a held breath of brightness, then it gives its light away
      const flare = smooth(0, 0.3, s) * (1 - smooth(0.3, 2.4, s));
      coreMat.color.copy(CORE).lerp(CORE_HOT, 0.6 + 0.4 * flare);
      hollow.visible = orbFrom === null || realT - orbFrom < 0.25;   // the hollow's light has gone into the ball
      halo.material.opacity = (0.3 + 0.35 * flare) * (1 - smooth(1.2, 3.5, s));
      halo.scale.setScalar(5.6 + 2 * flare);
      wallMat.uniforms.uLi.value[0] = (1 + 1.4 * flare) * (1 - smooth(1, 3.8, s));
      // the ball: a held breath as the stone opens, then it streams away as the swarm (release over 2.6 s), smaller and smaller
      const gone = orbFrom === null ? 0 : smooth(0, 2.4, realT - orbFrom);
      orb.material.opacity = (1 - gone) * (1 + 0.4 * flare);
      orb.scale.setScalar((1.4 + 0.6 * flare) * (1 - 0.8 * gone));
      orb.position.y = CUBE_AT.y + 0.35 * gone;
      orb.visible = gone < 1;
      // the rising light lights the wall as it passes
      wallMat.uniforms.uL.value[1].copy(swarm.centre).setZ(swarm.centre.z + 1.5);
      wallMat.uniforms.uLi.value[1] = 3.2 * swarm.flying * smooth(0.3, 1.2, s);
      swarm.step(simT, sdt);
      // the break's own pieces keep real time, as in a level
      stoneFrags.uniforms.uTime.value = shards.uniforms.uTime.value = realT;
      shards.uniforms.uUnitPx.value = ash.uniforms.uUnitPx.value = unitPx;
      ash.step(dt, realT);
      stoneFrags.uniforms.uSparks.value = ash.lights;   // the sparks light the pieces
      stoneFrags.uniforms.uSparkCol.value = ash.lightColor;
      swarm.material.uniforms.uTime.value = realT;
      far.material.uniforms.uA.value = smooth(9, 14, s);
      spray.material.uniforms.uA.value = 1.6 * smooth(5, 12, s);
      // the name: when its stars are all home, the constellation's lines draw in
      let home = 0;
      for (let i = 0; i < swarm.reserved; i++) home += swarm.state[i * 3 + 1] >= 1;
      if (home === swarm.reserved && nameAt === null) { nameAt = s; onNamed?.(); }
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
    }
    far.material.uniforms.uTime.value = spray.material.uniforms.uTime.value = realT;
    // the camera: holds on the wall, then follows the flock up into the sky (a soft, lagging follow)
    if (tapAt !== null) {
      // a slow glide of its own, in real time (not the story's quick clock):
      // it waits a breath, then eases up over about six seconds and settles
      const k = Math.min(1, Math.max(0, (realT - tapReal - 0.6) / 6));
      camY = CAM_FROM + (CAM_TO - CAM_FROM) * (0.5 - 0.5 * Math.cos(Math.PI * k));
    }
    const up = (camY - CAM_FROM) / (CAM_TO - CAM_FROM);
    camera.position.set(0, camY, CAM_Z);
    camera.lookAt(0, camY + 1.5 * up, 0);
  }
  function render(dt) {
    renderer.setRenderTarget(null);
    renderer.clear();
    renderer.render(scene, camera);
    if (tapAt !== null) {
      trails.render(swarmScene, camera, swarm, dt * pace(simT - tapAt), 0.95);
      trails.composite(1.6);
      const was = renderer.autoClear; renderer.autoClear = false;
      renderer.render(swarmScene, camera);
      renderer.autoClear = was;
    }
  }

  // ---------------------------------------------------------------- input and control
  function tap(x, y) {
    idleSince = simT;
    if (tapAt !== null) return false;
    sound.unlock();
    // the stone is the thing to touch; a touch on it, or near it, opens it from the stone under the finger
    v3.copy(CUBE_AT).project(camera);
    const sx = (v3.x * 0.5 + 0.5) * window.innerWidth, sy = (-v3.y * 0.5 + 0.5) * window.innerHeight;
    if (Math.hypot(x - sx, y - sy) < Math.max(90, window.innerWidth * 0.22)) { open(stoneAt(x, y)); return true; }
    hint?.classList.add('show');   // a touch elsewhere: show where
    return false;
  }
  // the stone under a point on the screen: the nearest to the camera of those the point is on
  function stoneAt(x, y) {
    let best = nearestStone(), score = Infinity;
    const r = unitPx / DPR * 0.55;   // a stone's half-width on screen, in css px
    stoneBreaks.forEach((f, i) => {
      v3.copy(CUBE_AT).add(f.off).project(camera);
      const d = Math.hypot((v3.x * 0.5 + 0.5) * window.innerWidth - x, (-v3.y * 0.5 + 0.5) * window.innerHeight - y);
      if (d < r && v3.z < score) { score = v3.z; best = i; }
    });
    return best;
  }
  function nearestStone() { let best = 0; stoneBreaks.forEach((f, i) => { if (f.off.z > stoneBreaks[best].off.z) best = i; }); return best; }
  // the finished sky at once: the clock run forward (the sky is a function of time)
  function finish() {
    if (tapAt !== null && simT - tapAt > 15) return;
    quiet = true;   // run forward in silence
    if (tapAt === null) { while (simT < 3.4) step(1 / 60); open(); }
    for (let i = 0; i < 60 * 30 && simT - tapAt <= 15; i++) step(1 / 60);
    quiet = false;
    dawnAt = -1e3;   // the sky long since come
    if (veil) veil.style.opacity = '0';
    lastReal = null;
  }
  return {
    tap, finish,
    // a finger on the stone turns it (main.js routes a drag that starts on it here)
    onStone(x, y) {
      if (tapAt !== null) return false;
      v3.copy(CUBE_AT).project(camera);
      return Math.hypot(x - (v3.x * 0.5 + 0.5) * window.innerWidth, y - (-v3.y * 0.5 + 0.5) * window.innerHeight) < Math.max(90, window.innerWidth * 0.22);
    },
    turnBy(dx, dy) { if (tapAt === null) { idleSince = simT; hint?.classList.remove('show'); turnBy(dx, dy); } },
    grab() { turn.vy = turn.vp = 0; turn.held = true; turn.at = performance.now(); },
    letGo() { turn.held = false; if (performance.now() - turn.at > 80) turn.vy = turn.vp = 0; },
    // the sky comes now, quickly (a swipe on to the map without opening the stone)
    dawn() { if (dawnAt === null) { dawnAt = realT; dawnSpan = 0.6; } },
    get opened() { return tapAt !== null; },
    get named() { return nameAt !== null; },
    pause() { running = false; cancelAnimationFrame(raf); },
    resume() { if (running) return; running = true; lastReal = null; raf = requestAnimationFrame(frame); },
  };
}
