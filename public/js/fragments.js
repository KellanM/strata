// A chiselled cube comes apart: it becomes 27 small cubes (3×3×3) that exactly
// rebuild it, and each shrinks away where it sits, the pieces nearest an open
// side going first, so the cube crumbles in from its exposed faces. One
// instanced draw for every piece of every recent break; all motion runs in the
// shader. The whole break takes the same 0.42 s the single-cube animation did.
import * as THREE from 'three';

export const BREAK_TIME = 0.42;
const TRAVEL = 0.32;                 // each piece's own flight
const MAX_DELAY = BREAK_TIME - TRAVEL;
const PIECE = 1 / 3;

const vertexShader = /* glsl */ `
  attribute vec3 aOrigin;     // piece centre at rest (world)
  attribute vec3 aDir;        // escape direction and distance
  attribute vec4 aSpin;       // tumble axis, tumble amount
  attribute float aStart;     // when this piece starts to move
  attribute float aEnd;       // when the whole break is over

  uniform float uTime;
  varying vec3 vN;
  varying float vHeight;

  vec3 rot(vec3 v, vec3 axis, float a) {
    float c = cos(a), s = sin(a);
    return v * c + cross(axis, v) * s + axis * dot(axis, v) * (1.0 - c);
  }

  void main() {
    if (uTime < aStart - ${MAX_DELAY.toFixed(3)} || uTime > aEnd) { gl_Position = vec4(0.0, 0.0, 2.0, 1.0); return; }
    float k = clamp((uTime - aStart) / ${TRAVEL.toFixed(3)}, 0.0, 1.0);
    float e = 1.0 - pow(1.0 - k, 3.0);              // ease out: shrinks fast, then gently vanishes
    float size = ${(PIECE * 0.94).toFixed(4)} * (1.0 - e);
    if (size <= 0.001) { gl_Position = vec4(0.0, 0.0, 2.0, 1.0); return; }
    vN = normal;
    vHeight = aOrigin.y;
    gl_Position = projectionMatrix * viewMatrix * vec4(aOrigin + position * size, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 cTop, cLit, cShade, cUnder;
  uniform vec2 uLight;
  varying vec3 vN;
  void main() {
    vec3 n = normalize(vN);
    vec3 c;
    if (n.y > 0.5) c = cTop;
    else if (n.y < -0.5) c = cUnder;
    else c = mix(cShade, cLit, smoothstep(0.1, 0.9, dot(normalize(n.xz + 1e-4), uLight) * 0.5 + 0.5));
    gl_FragColor = vec4(c, 1.0);
  }
`;

export class Fragments {
  constructor(lightUniform, capacity = 27 * 40) {
    this.capacity = capacity;
    this.next = 0;
    const box = new THREE.BoxGeometry(1, 1, 1);
    const geo = new THREE.InstancedBufferGeometry();
    geo.index = box.index;
    geo.setAttribute('position', box.getAttribute('position'));
    geo.setAttribute('normal', box.getAttribute('normal'));
    const attr = (name, size, fill = 0) => {
      const a = new THREE.InstancedBufferAttribute(new Float32Array(capacity * size).fill(fill), size);
      a.setUsage(THREE.DynamicDrawUsage);
      geo.setAttribute(name, a);
      return a;
    };
    this.aOrigin = attr('aOrigin', 3);
    this.aDir = attr('aDir', 3);
    this.aSpin = attr('aSpin', 4);
    this.aStart = attr('aStart', 1, -99);
    this.aEnd = attr('aEnd', 1, -99);
    geo.instanceCount = capacity;
    this.uniforms = {
      uTime: { value: 0 }, uLight: lightUniform,
      cTop: { value: new THREE.Color() }, cLit: { value: new THREE.Color() },
      cShade: { value: new THREE.Color() }, cUnder: { value: new THREE.Color() },
    };
    this.mesh = new THREE.Mesh(geo, new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms: this.uniforms }));
    this.mesh.frustumCulled = false;
  }

  setPalette(p) {
    const u = this.uniforms;
    u.cTop.value.setHex(p.top); u.cLit.value.setHex(p.lit); u.cShade.value.setHex(p.shade); u.cUnder.value.setHex(p.under);
  }

  // center: the cube's world centre. open: unit vector out through its free
  // sides (the sum of the free faces' normals).
  burst(center, open, time) {
    const o = new THREE.Vector3(), dir = new THREE.Vector3(), axis = new THREE.Vector3();
    for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) {
      const i = this.next++ % this.capacity;
      o.set(x, y, z);
      // pieces facing an open side leave first; the far ones follow
      const facing = o.lengthSq() ? o.clone().normalize().dot(open) : 0;
      const delay = MAX_DELAY * (1 - (facing + 1) / 2) + Math.random() * 0.012;
      // out through the open sides, fanning a little from where each piece sits
      dir.copy(open).multiplyScalar(0.55).addScaledVector(o, 0.22)
        .add(new THREE.Vector3((Math.random() - 0.5) * 0.12, Math.random() * 0.1, (Math.random() - 0.5) * 0.12));
      axis.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
      this.aOrigin.setXYZ(i, center.x + x * PIECE, center.y + y * PIECE, center.z + z * PIECE);
      this.aDir.setXYZ(i, dir.x, dir.y, dir.z);
      this.aSpin.setXYZW(i, axis.x, axis.y, axis.z, (Math.random() * 1.2 + 0.4) * (Math.random() < 0.5 ? -1 : 1));
      this.aStart.setX(i, time + MAX_DELAY + delay - MAX_DELAY);
      this.aEnd.setX(i, time + BREAK_TIME);
    }
    for (const a of [this.aOrigin, this.aDir, this.aSpin, this.aStart, this.aEnd]) a.needsUpdate = true;
  }

  clear() {
    this.aStart.array.fill(-99); this.aEnd.array.fill(-99);
    this.aStart.needsUpdate = this.aEnd.needsUpdate = true;
  }
}
