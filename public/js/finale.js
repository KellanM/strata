// The solved object's stage: a stepped plinth of the level's own stone rises
// beneath it, the score is carved into the plinth's face as it counts, and
// three star gems sit in front, lighting one at a time. Unearned stars stay as
// faint glass. Everything lives in the scene, under the same light and rays.
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
  uniform vec3 cTop, cLit, cShade, cGlow;
  uniform vec2 uLight;
  uniform float uGlow, uOpacity;
  varying vec3 vWorld;
  void main() {
    vec3 n = normalize(cross(dFdx(vWorld), dFdy(vWorld)));
    float l = dot(normalize(n.xz + 1e-4), uLight) * 0.5 + 0.5;
    vec3 c = mix(cShade, cLit, smoothstep(0.1, 0.9, l));
    c = mix(c, cTop, smoothstep(0.35, 0.8, n.y));
    c = mix(c, cGlow, uGlow * 0.55);
    gl_FragColor = vec4(c, uOpacity);
  }
`;

function rampMaterial(light) {
  return new THREE.ShaderMaterial({
    vertexShader, fragmentShader, transparent: true,
    uniforms: {
      cTop: { value: new THREE.Color() }, cLit: { value: new THREE.Color() }, cShade: { value: new THREE.Color() },
      cGlow: { value: new THREE.Color() }, uLight: light, uGlow: { value: 0 }, uOpacity: { value: 1 },
    },
  });
}

function starGeometry() {
  const shape = new THREE.Shape();
  for (let k = 0; k < 10; k++) {
    const r = k % 2 ? 0.22 : 0.5, a = Math.PI / 2 + (k * Math.PI) / 5;
    const x = Math.cos(a) * r, y = Math.sin(a) * r;
    if (k === 0) shape.moveTo(x, y); else shape.lineTo(x, y);
  }
  shape.closePath();
  const g = new THREE.ExtrudeGeometry(shape, { depth: 0.14, bevelEnabled: true, bevelThickness: 0.07, bevelSize: 0.06, bevelSegments: 1 });
  g.center();
  return g;
}

const ease = (k) => 1 - Math.pow(1 - Math.min(1, Math.max(0, k)), 3);

export class Finale {
  constructor(lightUniform) {
    this.group = new THREE.Group();
    this.group.visible = false;
    this.stoneMat = rampMaterial(lightUniform);
    this.lower = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), this.stoneMat);
    this.upper = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), this.stoneMat);
    this.group.add(this.lower, this.upper);

    // the carving: a canvas decal laid on the plinth face toward the camera
    this.canvas = document.createElement('canvas');
    this.canvas.width = 512; this.canvas.height = 160;
    this.tex = new THREE.CanvasTexture(this.canvas);
    this.tex.anisotropy = 8;
    this.carve = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: this.tex, transparent: true, depthWrite: false }));
    this.group.add(this.carve);

    const sg = starGeometry();
    this.stars = [0, 1, 2].map(() => {
      const m = new THREE.Mesh(sg, rampMaterial(lightUniform));
      m.material.depthTest = false;
      m.renderOrder = 5;
      this.group.add(m);
      return { mesh: m, lit: -1 };
    });
    this.shown = -1;
  }

  // focus: object centre. bottom: world y of the object's lowest face.
  // footprint: [minX, maxX, minZ, maxZ] of the object. face: 'x' or 'z' side toward the camera.
  stage({ palette, bottom, footprint, camDir, ink, t0 }) {
    const [x0, x1, z0, z1] = footprint;
    const w = x1 - x0 + 1.5, d = z1 - z0 + 1.5, cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
    this.dims = { w, d, cx, cz, top: bottom };
    this.lower.scale.set(w + 0.7, 0.45, d + 0.7);
    this.upper.scale.set(w, 0.55, d);
    this.t0 = t0;
    this.ink = ink;
    this.text = { score: 0, best: false };
    this.shown = -1;

    const u = this.stoneMat.uniforms;
    u.cTop.value.setHex(palette.top); u.cLit.value.setHex(palette.lit); u.cShade.value.setHex(palette.shade);
    for (const s of this.stars) {
      const su = s.mesh.material.uniforms;
      su.cTop.value.setHex(palette.paintTop); su.cLit.value.setHex(palette.paintLit); su.cShade.value.setHex(palette.paintShade);
      su.cGlow.value.setHex(palette.glow);
      s.lit = -1;
    }

    // carve on whichever side face looks most toward the camera
    const alongX = Math.abs(camDir.x) > Math.abs(camDir.z);
    const sgn = alongX ? Math.sign(camDir.x) || 1 : Math.sign(camDir.z) || 1;
    this.face = { alongX, sgn };
    this.drawCarving();
    this.group.visible = true;
  }

  // world-space box of the whole stage, for framing
  bounds() {
    const { w, d, cx, cz, top } = this.dims;
    return new THREE.Box3(new THREE.Vector3(cx - w / 2 - 1.2, top - 2.7, cz - d / 2 - 1.2), new THREE.Vector3(cx + w / 2 + 1.2, top, cz + d / 2 + 1.2));
  }

  setScore(v, best) {
    v = Math.round(v);
    if (v === this.text.score && best === this.text.best) return;
    this.text = { score: v, best };
    this.drawCarving();
  }

  drawCarving() {
    const g = this.canvas.getContext('2d'), W = this.canvas.width, H = this.canvas.height;
    g.clearRect(0, 0, W, H);
    g.textAlign = 'center'; g.textBaseline = 'middle';
    const label = this.text.score.toLocaleString();
    g.font = `600 ${this.text.best ? 78 : 92}px "Avenir Next", Futura, "Century Gothic", "Segoe UI", sans-serif`;
    const y = this.text.best ? 92 : H / 2 + 4;
    // carved: a pale lip below, the cut in a deep tone of the stone
    g.fillStyle = 'rgba(255,255,255,0.5)';
    g.fillText(label, W / 2, y + 3);
    g.fillStyle = this.ink;
    g.fillText(label, W / 2, y);
    if (this.text.best) {
      g.font = '600 26px "Avenir Next", Futura, "Century Gothic", "Segoe UI", sans-serif';
      g.letterSpacing = '10px';
      g.fillText('BEST', W / 2 + 5, 30);
      g.letterSpacing = '0px';
    }
    this.tex.needsUpdate = true;
  }

  lightStar(k, t) { this.stars[k].lit = t; }

  // earned: how many stars to show as gems (others are glass)
  update(t, camera, earned) {
    if (!this.group.visible) return;
    const { w, d, cx, cz, top } = this.dims;
    const rise = ease((t - this.t0 - 0.95) / 0.75);
    const sink = (1 - rise) * 1.6;
    this.upper.position.set(cx, top - 0.275 - sink, cz);
    this.lower.position.set(cx, top - 0.775 - sink, cz);
    this.stoneMat.uniforms.uOpacity.value = Math.min(1, rise * 1.4);

    const { alongX, sgn } = this.face;
    const fw = alongX ? d : w;
    const half = (alongX ? w : d) / 2;
    const cw = Math.min(fw * 0.95, 4.2);
    this.carve.scale.set(cw, Math.min(cw * 160 / 512, 0.52), 1);
    this.carve.position.set(alongX ? cx + sgn * (half + 0.01) : cx, top - 0.28 - sink, alongX ? cz : cz + sgn * (half + 0.01));
    this.carve.rotation.set(0, alongX ? sgn * Math.PI / 2 : sgn > 0 ? 0 : Math.PI, 0);
    this.carve.material.opacity = ease((t - this.t0 - 1.6) / 0.5);
    this.carve.visible = this.carve.material.opacity > 0.01;

    // the stars hang in a shallow arc in front of the plinth, facing you
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
    right.y = 0; right.normalize();
    const toward = new THREE.Vector3().subVectors(camera.position, new THREE.Vector3(cx, top, cz)).setY(0).normalize();
    const base = new THREE.Vector3(cx, top - 2.15 - sink, cz).addScaledVector(toward, Math.max(w, d) * 0.72 + 0.3);
    this.stars.forEach((s, k) => {
      const appear = ease((t - this.t0 - 1.9 - k * 0.08) / 0.5);
      const m = s.mesh;
      m.position.copy(base).addScaledVector(right, (k - 1) * 1.15);
      m.position.y += (k === 1 ? 0.22 : 0) + 0.05 * Math.sin(t * 1.4 + k);
      m.quaternion.copy(camera.quaternion);
      m.rotateY(0.25 * Math.sin(t * 0.9 + k * 1.7));
      const lit = s.lit >= 0 && t >= s.lit;
      const a = lit ? t - s.lit : 0;
      const pop = lit ? 1 + 0.35 * Math.exp(-a * 6) * Math.sin(Math.min(a, 0.5) * Math.PI * 2) : 1;
      m.scale.setScalar(appear * (k === 1 ? 1.12 : 1) * pop * (lit ? 1 : 0.86));
      const u = m.material.uniforms;
      u.uOpacity.value = lit ? 1 : 0.22 * appear;
      u.uGlow.value = lit ? 0.25 + 0.75 * Math.exp(-a * 2.5) : 0;
      m.visible = appear > 0.01;
    });
    void earned;
  }

  hide() { this.group.visible = false; }
}
