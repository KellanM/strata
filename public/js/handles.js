// Peel handles: one faceted diamond per axis riding a rail along the block's
// edge on the camera-facing side. Drag a diamond inward to peel layers.
import * as THREE from 'three';

const vertexShader = /* glsl */ `
  varying vec3 vWorld;
  void main() {
    vec4 w = modelMatrix * vec4(position, 1.0);
    vWorld = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 cTop, cLit, cShade;
  uniform vec2 uLight;
  uniform float uGlow;
  varying vec3 vWorld;
  void main() {
    vec3 n = normalize(cross(dFdx(vWorld), dFdy(vWorld)));
    float l = dot(normalize(n.xz + 1e-4), uLight) * 0.5 + 0.5;
    vec3 c = mix(cShade, cLit, smoothstep(0.1, 0.9, l));
    c = mix(c, cTop, smoothstep(0.35, 0.8, n.y));
    c = mix(c, vec3(1.0), uGlow * 0.45);
    gl_FragColor = vec4(c, 1.0);
  }
`;

// Reuses the buffer when the point count is unchanged, otherwise swaps it.
function setPoints(obj, pts) {
  const attr = obj.geometry.getAttribute('position');
  if (attr && attr.count === pts.length) { obj.geometry.setFromPoints(pts); return; }
  obj.geometry.dispose();
  obj.geometry = new THREE.BufferGeometry().setFromPoints(pts);
}

export class PeelHandles {
  constructor(lightUniform) {
    this.group = new THREE.Group();
    this.uniforms = {
      cTop: { value: new THREE.Color() }, cLit: { value: new THREE.Color() }, cShade: { value: new THREE.Color() },
      uLight: lightUniform, uGlow: { value: 0 },
    };
    const mat = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms: this.uniforms });
    const geo = new THREE.OctahedronGeometry(0.3);
    geo.scale(1, 1.35, 1);
    this.railMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.4 });
    this.items = [0, 1, 2].map((axis) => {
      const mesh = new THREE.Mesh(geo, mat);
      const rail = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]), this.railMat);
      const ticks = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({ size: 3, sizeAttenuation: false, transparent: true, opacity: 0.5 }));
      this.group.add(mesh, rail, ticks);
      return { axis, mesh, rail, ticks, side: 1, offset: new THREE.Vector3() };
    });
  }

  setPalette(p) {
    // cut from the level's own stone, a step deeper than the block so they read against the sky
    this.uniforms.cTop.value.setHex(p.lit);
    this.uniforms.cLit.value.setHex(p.shade);
    this.uniforms.cShade.value.setHex(p.under);
    this.railMat.color.setHex(p.shade);
    for (const it of this.items) it.ticks.material.color.setHex(p.shade);
  }

  // dims: puzzle dims. camDir: unit vector from target to camera.
  // peel: { axis, side, keepVisual }. Inactive axes follow the camera.
  layout(dims, camDir, peel, time, pulse) {
    const cam = camDir.toArray();
    for (const it of this.items) {
      const a = it.axis;
      const usable = dims[a] > 1;
      it.mesh.visible = it.rail.visible = it.ticks.visible = usable;
      const active = a === peel.axis && peel.peeled > 0;
      it.side = active ? peel.side : cam[a] >= 0 ? 1 : -1;
      // Rails ride silhouette edges so they never cover a face, one per corner:
      // X along the bottom-back, Z along the bottom-left, Y up the left side.
      const toward = (o) => (cam[o] >= 0 ? 1 : -1);
      const pos = [0, 0, 0];
      if (a === 0) { pos[1] = -1; pos[2] = -toward(2); }
      else if (a === 2) { pos[1] = -1; pos[0] = -toward(0); }
      else { pos[0] = -toward(0); pos[2] = toward(2); }
      for (let o = 0; o < 3; o++) if (o !== a) pos[o] *= dims[o] / 2 + 0.7;
      const keep = a === peel.axis ? peel.keepVisual : dims[a];
      const half = dims[a] / 2;
      pos[a] = it.side * (keep - half + 0.4);
      it.mesh.position.fromArray(pos);
      it.mesh.rotation.y = time * 0.6 + a * 2.1;
      const s = 1 + (pulse ? 0.18 * (0.5 + 0.5 * Math.sin(time * 6)) : 0) + (it === this.grabbed ? 0.2 : 0);
      it.mesh.scale.setScalar(s);

      const p0 = [...pos], p1 = [...pos];
      p0[a] = -half - 0.4; p1[a] = half + 0.4;
      setPoints(it.rail, [new THREE.Vector3(...p0), new THREE.Vector3(...p1)]);
      const ticks = [];
      for (let k = 0; k <= dims[a]; k++) { const q = [...pos]; q[a] = k - half; ticks.push(new THREE.Vector3(...q)); }
      setPoints(it.ticks, ticks);
    }
  }

  // Returns the handle item under a screen point (CSS px), or null.
  hit(clientX, clientY, camera, rect, radius = 34) {
    let best = null, bestD = radius;
    const v = new THREE.Vector3();
    for (const it of this.items) {
      if (!it.mesh.visible) continue;
      v.copy(it.mesh.position).project(camera);
      const sx = rect.left + (v.x * 0.5 + 0.5) * rect.width, sy = rect.top + (-v.y * 0.5 + 0.5) * rect.height;
      const d = Math.hypot(sx - clientX, sy - clientY);
      if (d < bestD) { bestD = d; best = it; }
    }
    return best;
  }

  // Screen-space pixels per world unit along the handle's outward direction.
  screenAxis(it, camera, rect) {
    const a = new THREE.Vector3().copy(it.mesh.position).project(camera);
    const dir = new THREE.Vector3(); dir.setComponent(it.axis, it.side);
    const b = new THREE.Vector3().copy(it.mesh.position).add(dir).project(camera);
    return new THREE.Vector2((b.x - a.x) * 0.5 * rect.width, -(b.y - a.y) * 0.5 * rect.height);
  }
}
