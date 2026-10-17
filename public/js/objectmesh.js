// The solved object as one instanced mesh in its true colours, lit with the
// game's face ramp (top / lit / shade by direction), plus an isometric camera
// to frame it. Used by the journal's turntable and by thumbnails.
import * as THREE from 'three';
import { buildCells } from './shapes.js';

const vertexShader = /* glsl */ `
  varying vec3 vN;
  varying vec3 vColor;
  varying vec2 vUv;
  void main() {
    vN = normalize(mat3(modelMatrix) * normal);
    vColor = instanceColor;
    vUv = uv;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec2 uLight;
  varying vec3 vN;
  varying vec3 vColor;
  varying vec2 vUv;
  void main() {
    vec3 n = normalize(vN);
    float l = dot(normalize(n.xz + 1e-4), uLight) * 0.5 + 0.5;
    float k = n.y > 0.5 ? 1.08 : n.y < -0.5 ? 0.5 : mix(0.7, 0.96, smoothstep(0.1, 0.9, l));
    float e = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
    k *= mix(n.y > 0.5 ? 1.06 : 0.9, 1.0, smoothstep(0.0, 0.05, e));
    gl_FragColor = vec4(vColor * k, 1.0);
  }
`;

// An instanced mesh of the solved object, centred on the origin.
export function objectMesh(shape, palette) {
  const { solid, colors } = buildCells(shape);
  const [X, Y, Z] = shape.dims;
  const cells = [];
  for (let z = 0; z < Z; z++) for (let y = 0; y < Y; y++) for (let x = 0; x < X; x++) {
    const i = x + X * (y + Y * z);
    if (solid[i]) cells.push([x, y, z, colors[i]]);
  }
  const a = palette?.lightAngle ?? 0, c = Math.cos(a), s = Math.sin(a);
  const material = new THREE.ShaderMaterial({
    vertexShader, fragmentShader,
    uniforms: { uLight: { value: new THREE.Vector2(-0.45 * c - 0.9 * s, -0.45 * s + 0.9 * c).normalize() } },
  });
  const mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(0.97, 0.97, 0.97), material, cells.length);
  const m = new THREE.Matrix4(), col = new THREE.Color();
  cells.forEach(([x, y, z, hex], k) => {
    m.makeTranslation(x - (X - 1) / 2, y - (Y - 1) / 2, z - (Z - 1) / 2);
    mesh.setMatrixAt(k, m);
    mesh.setColorAt(k, col.setHex(hex));
  });
  mesh.userData.radius = 0.5 * Math.hypot(X, Y, Z);
  return mesh;
}

// An isometric orthographic camera that frames a mesh of the given radius.
export function isoCamera(radius, aspect = 1) {
  const h = radius * 1.08;
  const cam = new THREE.OrthographicCamera(-h * aspect, h * aspect, h, -h, 0.1, 200);
  cam.position.set(1, 0.82, 1).normalize().multiplyScalar(60);
  cam.lookAt(0, 0, 0);
  return cam;
}
