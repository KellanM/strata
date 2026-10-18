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

const clamp01 = (x) => Math.min(1, Math.max(0, x));
// overshoots a touch and settles: the diamonds pop into place
const easeOutBack = (k) => 1 + 2.7 * Math.pow(k - 1, 3) + 1.7 * Math.pow(k - 1, 2);

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
    this.items = [0, 1, 2].map((axis) => {
      const mesh = new THREE.Mesh(geo, mat);
      const rail = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]), new THREE.LineBasicMaterial({ transparent: true, opacity: 0.4 }));
      const ticks = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({ size: 3, sizeAttenuation: false, transparent: true, opacity: 0.5 }));
      this.group.add(mesh, rail, ticks);
      return { axis, mesh, rail, ticks, side: 1, offset: new THREE.Vector3(), k: 0 };
    });
    // in / out: the handles arrive once the block is whole and leave when it's solved
    this.on = false;
    this.since = -99;
  }

  // Show or hide with an animation (no-op if already in that state).
  setShown(on, time) {
    if (on === this.on) return;
    this.on = on;
    this.since = time;
  }

  // Hidden at once, no animation (a new level starts without them).
  reset() { this.on = false; this.since = -99; }

  // 0..1 (a little over 1 mid-pop) for the handle on axis a
  amount(time, a) {
    if (this.on) return easeOutBack(clamp01((time - this.since - a * 0.09) / 0.5));
    const k = clamp01((time - this.since - (2 - a) * 0.04) / 0.26);
    return 1 - k * k * k;
  }

  setPalette(p) {
    // cut from the level's own stone, a step deeper than the block so they read against the sky
    this.uniforms.cTop.value.setHex(p.lit);
    this.uniforms.cLit.value.setHex(p.shade);
    this.uniforms.cShade.value.setHex(p.under);
    for (const it of this.items) { it.rail.material.color.setHex(p.shade); it.ticks.material.color.setHex(p.shade); }
  }

  // dims: puzzle dims. camDir: unit vector from target to camera.
  // peel: { axis, side, keepVisual }. Inactive axes follow the camera.
  layout(dims, camDir, peel, time, pulse) {
    const cam = camDir.toArray();
    for (const it of this.items) {
      const a = it.axis;
      const usable = dims[a] > 1;
      const k = it.k = this.amount(time, a), line = clamp01(k);
      it.mesh.visible = it.rail.visible = it.ticks.visible = usable && k > 0.001;
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
      it.mesh.rotation.y = time * 0.6 + a * 2.1 + (1 - line) * 2.4;   // spins in as it arrives
      // pulse: true breathes; 'still' (Reduce Motion) holds the handle a little larger instead
      const beat = pulse === 'still' ? 0.12 : pulse ? 0.18 * (0.5 + 0.5 * Math.sin(time * 6)) : 0;
      const s = 1 + beat + (it === this.grabbed ? 0.2 : 0);
      it.mesh.scale.setScalar(s * Math.max(k, 0.001));

      // the rail draws out from the diamond both ways; the ticks fade in with it
      const p0 = [...pos], p1 = [...pos];
      p0[a] = pos[a] + (-half - 0.4 - pos[a]) * line; p1[a] = pos[a] + (half + 0.4 - pos[a]) * line;
      setPoints(it.rail, [new THREE.Vector3(...p0), new THREE.Vector3(...p1)]);
      it.rail.material.opacity = 0.4 * line;
      it.ticks.material.opacity = 0.5 * line * line;
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
      if (!it.mesh.visible || it.k < 0.6) continue;
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
