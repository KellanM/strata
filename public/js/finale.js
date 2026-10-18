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
const easeOut = (k) => 1 - Math.pow(1 - clamp01(k), 3);
// grows in and settles with the faintest overshoot
const settle = (k) => { k = clamp01(k); const c = 1.3; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); };

function glowTexture(ring) {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  if (ring) {
    grad.addColorStop(0.0, 'rgba(255,255,255,0)');
    grad.addColorStop(0.72, 'rgba(255,255,255,0)');
    grad.addColorStop(0.84, 'rgba(255,255,255,0.9)');
    grad.addColorStop(1.0, 'rgba(255,255,255,0)');
  } else {
    grad.addColorStop(0.0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.25, 'rgba(255,255,255,0.55)');
    grad.addColorStop(1.0, 'rgba(255,255,255,0)');
  }
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

function sprite(tex) {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending }));
  s.renderOrder = 7;
  s.visible = false;
  return s;
}

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

    // each gem: an empty slot drawn as just its silhouette (a thin diamond
    // outline facing you), the gem that forms inside it, and a ring of light
    const R = 0.4, TALL = 1.4;
    const gem = new THREE.OctahedronGeometry(R);
    gem.scale(1, TALL, 1);
    const outline = new THREE.Shape([[0, R * TALL], [R, 0], [0, -R * TALL], [-R, 0]].map(([x, y]) => new THREE.Vector2(x, y)));
    const w = 0.035, inner = new THREE.Path([[0, R * TALL - w * 1.6], [-(R - w * 1.2), 0], [0, -(R * TALL - w * 1.6)], [R - w * 1.2, 0]].map(([x, y]) => new THREE.Vector2(x, y)));
    outline.holes.push(inner);
    const slotGeo = new THREE.ShapeGeometry(outline);
    const ring = glowTexture(true);
    this.gems = [0, 1, 2].map(() => {
      const m = new THREE.Mesh(gem, rampMaterial(lightUniform));
      m.material.depthTest = false;
      m.renderOrder = 5;
      const slot = new THREE.Mesh(slotGeo, new THREE.MeshBasicMaterial({ transparent: true, depthTest: false, depthWrite: false }));
      slot.renderOrder = 4;
      const halo = sprite(ring);
      this.group.add(m, slot, halo);
      return { mesh: m, slot, halo, lit: -1 };
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
      g.slot.material.color.set(ink);
      g.halo.material.color.setHex(palette.glow);
      g.lit = -1;
    }

    this.drawLabel();
    this.group.visible = true;
  }

  // world box of the whole stage, for framing
  bounds() {
    const r = this.reach, f = this.focus;
    return new THREE.Box3(new THREE.Vector3(f.x - r, this.top - 3.3, f.z - r), new THREE.Vector3(f.x + r, this.top, f.z + r));
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
    g.shadowColor = light ? 'rgba(20, 16, 40, 0.75)' : 'rgba(255, 252, 245, 0.7)';
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
    const anchor = new THREE.Vector3(this.focus.x, this.top - 1.4, this.focus.z);
    const toward = new THREE.Vector3().subVectors(camera.position, anchor).setY(0).normalize();
    anchor.addScaledVector(toward, this.reach * 0.9 + 0.4);

    this.gems.forEach((gm, k) => {
      const appear = smooth((age - 1.6 - k * 0.15) / 0.8);
      const slotPos = anchor.clone().addScaledVector(right, (k - 1) * 1.25).addScaledVector(up, 0.05 * Math.sin(t * 0.9 + k * 2.1));
      const lit = gm.lit >= 0 && t >= gm.lit;
      const a = lit ? t - gm.lit : 0;

      // the empty slot: only its silhouette, facing you; it brightens as the
      // gem fills it, then gives way to the gem
      gm.slot.position.copy(slotPos);
      gm.slot.quaternion.copy(camera.quaternion);
      const flare = lit ? Math.exp(-a * 3) : 0;
      gm.slot.material.opacity = appear * (0.45 + 0.55 * flare) * (1 - smooth((a - 0.25) / 0.5));
      gm.slot.visible = gm.slot.material.opacity > 0.01;

      // the gem forms inside it: grows and settles, spins fast then slows
      const m = gm.mesh;
      m.visible = lit;
      if (lit) {
        m.position.copy(slotPos);
        m.scale.setScalar(settle(a / 0.75));
        m.rotation.set(0, k * 0.9 + 0.35 * a + (8 / 2.4) * (1 - Math.exp(-2.4 * a)), 0);
        const u = m.material.uniforms;
        u.uOpacity.value = smooth(a / 0.2);
        // and now and then one catches the light
        const glint = a > 2 ? Math.pow(Math.max(0, Math.sin(t * 0.8 + k * 2.3)), 40) * 0.6 : 0;
        u.uGlow.value = 0.18 + 0.9 * Math.exp(-a * 2.2) + glint;
      }

      // a ring of light opens from it as it fills
      gm.halo.visible = lit && a < 1.4;
      if (gm.halo.visible) {
        gm.halo.position.copy(slotPos);
        gm.halo.scale.setScalar(0.9 + 2.6 * easeOut(a / 1.4));
        gm.halo.material.opacity = 0.7 * Math.pow(1 - a / 1.4, 2);
      }
    });

    const show = smooth((age - 1.7) / 0.9);
    this.label.visible = show > 0.01;
    this.label.material.opacity = show;
    this.label.quaternion.copy(camera.quaternion);
    this.label.position.copy(anchor).addScaledVector(up, -1.2);
    const w = 3.8;
    this.label.scale.set(w, w, 1);
  }

  hide() { this.group.visible = false; }
}
