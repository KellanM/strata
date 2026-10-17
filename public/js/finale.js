// The solved object's quiet aftermath: beneath it, three small diamonds (the
// same form as the peel handles) brighten one by one, and the score sits below
// in letterspaced type that always faces you. Slow, soft, nothing pops; the
// object itself floats on its own in the light.
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
    c = mix(c, cGlow, uGlow * 0.6);
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

const clamp01 = (k) => Math.min(1, Math.max(0, k));
const smooth = (k) => { k = clamp01(k); return k * k * (3 - 2 * k); };

export class Finale {
  constructor(lightUniform) {
    this.group = new THREE.Group();
    this.group.visible = false;
    // the score: crisp type on a plane that always faces the camera
    this.canvas = document.createElement('canvas');
    this.canvas.width = 1024; this.canvas.height = 256;
    this.tex = new THREE.CanvasTexture(this.canvas);
    this.tex.anisotropy = 8;
    this.label = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.25), new THREE.MeshBasicMaterial({ map: this.tex, transparent: true, depthTest: false, depthWrite: false }));
    this.label.renderOrder = 6;
    this.group.add(this.label);

    const gem = new THREE.OctahedronGeometry(0.21);
    gem.scale(1, 1.4, 1);
    this.gems = [0, 1, 2].map(() => {
      const m = new THREE.Mesh(gem, rampMaterial(lightUniform));
      m.material.depthTest = false;
      m.renderOrder = 5;
      this.group.add(m);
      return { mesh: m, lit: -1 };
    });
    this.text = { score: 0, best: false };
  }

  // focus: the object's turning centre. bottom: world y of its lowest face.
  // reach: horizontal distance from focus to the object's farthest edge.
  stage({ palette, focus, bottom, reach, ink, t0 }) {
    this.t0 = t0;
    this.ink = ink;
    this.focus = focus.clone();
    this.top = bottom;
    this.reach = reach;
    this.text = { score: 0, best: false };

    const set = (m, top, lit, shade) => {
      m.uniforms.cTop.value.setHex(top); m.uniforms.cLit.value.setHex(lit); m.uniforms.cShade.value.setHex(shade);
    };
    for (const g of this.gems) {
      set(g.mesh.material, palette.paintTop, palette.paintLit, palette.paintShade);
      g.mesh.material.uniforms.cGlow.value.setHex(palette.glow);
      g.lit = -1;
    }

    this.drawLabel();
    this.group.visible = true;
  }

  // world box of the whole stage, for framing
  bounds() {
    const r = this.reach, f = this.focus;
    return new THREE.Box3(new THREE.Vector3(f.x - r, this.top - 2.6, f.z - r), new THREE.Vector3(f.x + r, this.top, f.z + r));
  }

  setScore(v, best) {
    v = Math.round(v);
    if (v === this.text.score && best === this.text.best) return;
    this.text = { score: v, best };
    this.drawLabel();
  }

  drawLabel() {
    const g = this.canvas.getContext('2d'), W = this.canvas.width, H = this.canvas.height;
    g.clearRect(0, 0, W, H);
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = this.ink ?? '#4a3d63';
    // a soft halo in the opposite tone keeps the digits clear of the rays
    const light = parseInt((this.ink ?? '#000000').slice(1, 3), 16) > 128;
    g.shadowColor = light ? 'rgba(20, 16, 40, 0.45)' : 'rgba(255, 252, 245, 0.7)';
    g.shadowBlur = 24;
    const font = '"Avenir Next", Avenir, Futura, "Century Gothic", "Segoe UI", sans-serif';
    g.font = `500 120px ${font}`;
    g.letterSpacing = '22px';
    g.fillText(this.text.score.toLocaleString(), W / 2 + 11, H * 0.6);
    if (this.text.best) {
      g.globalAlpha = 0.6;
      g.font = `500 30px ${font}`;
      g.letterSpacing = '16px';
      g.fillText('BEST', W / 2 + 8, H * 0.14);
      g.globalAlpha = 1;
    }
    g.letterSpacing = '0px';
    this.tex.needsUpdate = true;
  }

  lightGem(k, t) { this.gems[k].lit = t; }

  update(t, camera) {
    if (!this.group.visible) return;
    const age = t - this.t0;

    // just beneath the object, toward the viewer: gems, then the number
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
    const anchor = new THREE.Vector3(this.focus.x, this.top - 1.05, this.focus.z);
    const toward = new THREE.Vector3().subVectors(camera.position, anchor).setY(0).normalize();
    anchor.addScaledVector(toward, this.reach * 0.9 + 0.4);

    this.gems.forEach((gm, k) => {
      const appear = smooth((age - 1.8 - k * 0.12) / 0.9);
      const m = gm.mesh;
      m.position.copy(anchor).addScaledVector(right, (k - 1) * 0.78).addScaledVector(up, 0.04 * Math.sin(t * 0.9 + k * 2.1));
      m.rotation.set(0, t * 0.35 + k * 0.9, 0);
      const lit = gm.lit >= 0 && t >= gm.lit;
      const a = lit ? t - gm.lit : 0;
      const bloom = lit ? smooth(a / 0.9) : 0;
      m.scale.setScalar(appear * (0.82 + 0.18 * bloom));
      const u = m.material.uniforms;
      u.uOpacity.value = appear * (0.18 + 0.82 * bloom);
      u.uGlow.value = lit ? 0.22 + 0.5 * Math.exp(-a * 1.1) * bloom : 0;
      m.visible = appear > 0.01;
    });

    const show = smooth((age - 1.7) / 0.9);
    this.label.visible = show > 0.01;
    this.label.material.opacity = show;
    this.label.quaternion.copy(camera.quaternion);
    this.label.position.copy(anchor).addScaledVector(up, -0.85);
    const w = 3.8;
    this.label.scale.set(w, w, 1);
  }

  hide() { this.group.visible = false; }
}
