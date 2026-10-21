// The Gloam in the wall's own medium. Every frame its tendrils and the breath
// of the fissure are rasterised onto the voxel grid, one value per stone cell:
//   r  body: the cell turns to oily black rock and pushes up out of the wall
//   g  cold: a light from somewhere else, at the fissure and along its rims
//   b  scar: paint it has touched dies (darkens, drains to grey) and stays dead
//   a  pulse: a slow beat travelling up the body
// The wall's shader reads this texture per voxel, so the Gloam is stepped,
// blocky and lit by the same lantern as the figures.
import * as THREE from 'three';
import { W, H, hash2 } from './mural.js?v=3';

const N = W * H;
export class GloamField {
  constructor() {
    this.body = new Float32Array(N); this.cold = new Float32Array(N); this.scar = new Float32Array(N); this.pulse = new Float32Array(N);
    this.data = new Uint8Array(N * 4);
    this.tex = new THREE.DataTexture(this.data, W, H, THREE.RGBAFormat);
    this.tex.magFilter = this.tex.minFilter = THREE.NearestFilter;
    this.tex.needsUpdate = true;
    this.x0 = 0; this.x1 = W - 1;   // the columns touched this frame
    this.near = 0;                  // how much body is close to the lantern
  }
  begin(x0, x1) {
    this.x0 = Math.max(0, Math.floor(x0)); this.x1 = Math.min(W - 1, Math.ceil(x1));
    for (let y = 0; y < H; y++) {
      const o = y * W;
      this.body.fill(0, o + this.x0, o + this.x1 + 1); this.cold.fill(0, o + this.x0, o + this.x1 + 1);
      this.scar.fill(0, o + this.x0, o + this.x1 + 1); this.pulse.fill(0, o + this.x0, o + this.x1 + 1);
    }
    this.near = 0;
  }
  inRange(x) { return x >= this.x0 && x <= this.x1; }
  // a blocky disc of body with a cold rim round it
  stamp(cx, cy, r, pulse, rimK = 1) {
    const R = Math.ceil(r + 1.5);
    const xi = Math.round(cx), yi = Math.round(cy);
    for (let y = yi - R; y <= yi + R; y++) {
      if (y < 0 || y >= H) continue;
      for (let x = xi - R; x <= xi + R; x++) {
        if (!this.inRange(x)) continue;
        const d = Math.hypot(x - cx, y - cy), k = y * W + x;
        if (d <= r + 0.1) { this.body[k] = 1; if (pulse > this.pulse[k]) this.pulse[k] = pulse; }
        else if (d <= r + 1.3) { const v = (1 - (d - r - 0.1) / 1.2) * 0.022 * rimK; if (v > this.cold[k]) this.cold[k] = v; }
      }
    }
  }
  // the paint it has touched dies, a little beyond the body
  kill(cx, cy, r) {
    const R = Math.ceil(r + 1.5), xi = Math.round(cx), yi = Math.round(cy);
    for (let y = yi - R; y <= yi + R; y++) {
      if (y < 0 || y >= H) continue;
      for (let x = xi - R; x <= xi + R; x++) {
        if (!this.inRange(x)) continue;
        const d = Math.hypot(x - cx, y - cy), k = y * W + x;
        const v = 1 - Math.max(0, d - r) / 1.3;
        if (v > this.scar[k]) this.scar[k] = Math.min(1, v);
      }
    }
  }
  cell(x, y, body, cold) {
    x = Math.round(x); y = Math.round(y);
    if (!this.inRange(x) || y < 0 || y >= H) return;
    const k = y * W + x;
    if (body > this.body[k]) this.body[k] = body;
    if (cold > this.cold[k]) this.cold[k] = cold;
  }
  glow(x, y, v) { this.cell(x, y, 0, v); }
  // a path of stamps, sampled at half a cell
  path(pts, pulseAt, t) {
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i], n = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) * 2));
      for (let k = 0; k < n; k++) {
        const u = k / n, x = a.x + (b.x - a.x) * u, y = a.y + (b.y - a.y) * u, w = a.w + (b.w - a.w) * u, s = a.s + (b.s - a.s) * u;
        this.stamp(x, y, w, pulseAt(s, t));
      }
    }
  }
  countNear(lx, ly, R) {
    let n = 0;
    const x0 = Math.max(this.x0, Math.floor(lx - R)), x1 = Math.min(this.x1, Math.ceil(lx + R));
    for (let y = Math.max(0, Math.floor(ly - R)); y <= Math.min(H - 1, Math.ceil(ly + R)); y += 2)
      for (let x = x0; x <= x1; x += 2) if (this.body[y * W + x] > 0.5 && Math.hypot(x - lx, y - ly) < R) n++;
    return n * 4;
  }
  commit() {
    const d = this.data;
    for (let y = 0; y < H; y++) for (let x = this.x0; x <= this.x1; x++) {
      const k = y * W + x, o = k * 4;
      d[o] = this.body[k] * 255; d[o + 1] = Math.min(1, this.cold[k]) * 255; d[o + 2] = this.scar[k] * 255; d[o + 3] = this.pulse[k] * 255;
    }
    this.tex.needsUpdate = true;
  }
}
export { hash2 };
