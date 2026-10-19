// Direction B: the same world as flat layers. Stars and the horizon on a 2D
// canvas; islands pre-rendered once (same generator and ramp as direction A)
// into sprites; clouds as soft canvas sprites; parallax from each layer's rate.
// No per-frame WebGL: the per-frame cost is a few layer transforms.
import * as THREE from 'three';
import { Soup, island, soupGeometry, KITS, lightOf } from './islands.js';
import { rng, trailXAt } from './data.js';
import { seaColours } from './world.js';

const css = (c) => `rgb(${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)})`;
const RATES = { far: 0.82, near: 1, front: 1.18 };

export class Layers {
  constructor(root, map) {
    this.root = root; this.map = map; this.u = 0; this.s = 0; this.parts = new Float32Array(16);
    root.innerHTML = '';
    this.sea = document.createElement('div'); this.sea.className = 'b-sea';
    this.sky = document.createElement('canvas'); this.sky.className = 'b-sky';
    root.append(this.sea, this.sky);
    this.layers = {};
    for (const k of ['far', 'near', 'front']) {
      const d = document.createElement('div'); d.className = `b-layer b-${k}`; root.appendChild(d); this.layers[k] = d;
    }
    this.pathSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.pathSvg.setAttribute('class', 'b-path');
    this.layers.near.appendChild(this.pathSvg);
    this.buildSea();
    this.buildSprites();
    this.rebuildPath(map);
    this.stars = [[900, 0.8, 0.3, 0.55], [320, 1.2, 0.5, 0.8], [60, 1.8, 0.72, 1]].map(([n, r, rate, a], li) => {
      const rand = rng('stars' + li);
      return { rate, a, r, pts: Array.from({ length: n }, () => [rand(), rand() * 2.2, rand()]) };
    });
  }

  buildSea() {
    // the colour script as one tall gradient on the near layer's clock
    const stops = [];
    const { regions } = this.map;
    const H = this.map.height + 2000;
    stops.push(`${css(seaColours(regions[0].base).sea)} 0px`);
    for (const r of regions) {
      const c = css(seaColours(r.base).sea);
      stops.push(`${c} ${(r.top + 120).toFixed(0)}px`, `${c} ${(r.bottom - 120).toFixed(0)}px`);
    }
    stops.push(`${css(seaColours(regions[regions.length - 1].base).sea)} ${H}px`);
    this.seaStrip = document.createElement('div');
    this.seaStrip.className = 'b-seastrip';
    this.seaStrip.style.height = `${H}px`;
    this.seaStrip.style.background = `linear-gradient(180deg, ${stops.join(', ')})`;
    this.sea.appendChild(this.seaStrip);
  }

  // islands rendered once to images by an offscreen three.js renderer, then dropped
  buildSprites() {
    const R = 200;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    THREE.ColorManagement.enabled = false;
    renderer.setSize(R, R, false);
    renderer.setClearColor(0x000000, 0);
    const scene = new THREE.Scene();
    const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, -2000, 2000);
    const mat = new THREE.MeshBasicMaterial({ vertexColors: true });
    const sprite = (soup, size, h) => {
      const mesh = new THREE.Mesh(soupGeometry(soup), mat);
      scene.add(mesh);
      const half = Math.max(size * 1.4, h * 0.75);
      cam.left = -half; cam.right = half; cam.top = half * 1.15; cam.bottom = -half * 0.85;
      cam.position.set(0, Math.sin(0.95) * 1000, Math.cos(0.95) * 1000);
      cam.lookAt(0, h * 0.3, 0);
      cam.updateProjectionMatrix();
      renderer.render(scene, cam);
      scene.remove(mesh); mesh.geometry.dispose();
      return { url: renderer.domElement.toDataURL('image/png'), px: half * 2 };
    };
    this.chunks = [];
    for (const r of this.map.regions) {
      const rand = rng(r.name + 'b');
      const kit = KITS[r.name] ?? KITS['First Light'];
      const light = lightOf(r.base), sc = seaColours(r.base);
      const chunk = { r, z0: r.top - 300, z1: r.bottom + 300, els: [], bank: [] };
      const put = (layer, x, z, w, url, cls = '') => {
        const img = new Image(); img.src = url; img.className = `b-spr ${cls}`; img.alt = '';
        img.style.width = `${w}px`;
        img.style.transform = `translate(${(x - w / 2).toFixed(0)}px, ${(z - w * 0.62).toFixed(0)}px)`;
        img.dataset.layer = layer;
        this.layers[layer].appendChild(img); chunk.els.push(img); return img;
      };
      const isle = (kind, size, hero) => { const s = new Soup(); const h = island(s, kind, new THREE.Vector3(0, 0, 0), size, rand, r.base, light, kit, hero); return { ...sprite(s, size, h), h }; };
      const zt = r.labelZ + 150 + rand() * 120, xt = trailXAt(this.map, zt);
      const hero = isle(kit.hero, 50, true);
      put('near', -Math.sign(xt || 1) * 125, zt, hero.px, hero.url);
      for (let z = r.top + 120; z < r.bottom - 60; z += 170 + rand() * 120) {
        const x2 = trailXAt(this.map, z), side = Math.abs(x2) > 30 ? -Math.sign(x2) : 1;
        if (rand() < 0.75) { const a = isle(kit.kinds[Math.floor(rand() * kit.kinds.length)], 30 + rand() * 18); put('near', side * (185 + rand() * 60), z, a.px, a.url); }
        if (rand() < 0.7) { const b = isle(kit.kinds[Math.floor(rand() * kit.kinds.length)], 46 + rand() * 30); put('far', -side * (260 + rand() * 120), z / RATES.far * 0 + z, b.px * 0.8, b.url, 'hazy'); }
      }
      // clouds: framing billows on the front layer, a bank over a chapter not reached
      const puffUrl = this.puff(sc.top, sc.side);
      for (let z = r.top; z < r.bottom; z += 120 + rand() * 80) {
        for (const sd of [-1, 1]) { if (rand() < 0.7) put('front', sd * (205 + rand() * 50), z, 150 + rand() * 80, puffUrl); }
      }
      if (!r.reached) {
        const bt = sc.dark ? new THREE.Color(0xdfe4f2).lerp(new THREE.Color(r.base.glow), 0.3).multiplyScalar(0.8) : new THREE.Color(0xfbf8fb).lerp(new THREE.Color(r.base.glow), 0.4);
        const bs = sc.dark ? new THREE.Color(r.base.skyBottom).lerp(new THREE.Color(0xc8cfe6), 0.35) : new THREE.Color(0xebe4ee).lerp(new THREE.Color(r.base.skyBottom), 0.22);
        const bankUrl = this.puff(bt, bs);
        for (let z = r.top + 30; z < r.bottom + 60; z += 70) {
          for (let x = -300; x <= 300; x += 100) {
            const img = put('near', x + (rand() - 0.5) * 40, z, 190 + rand() * 50, bankUrl, 'bank');
            chunk.bank.push({ img, x, dir: x < trailXAt(this.map, z) ? -1 : 1, seed: rand(), base: img.style.transform });
          }
        }
      }
      for (const el of chunk.els) el.style.display = 'none';
      chunk.on = false;
      this.chunks.push(chunk);
    }
    renderer.dispose();
    renderer.forceContextLoss?.();
  }

  // a soft cloud sprite: a lit crown over sky-coloured flanks
  puff(top, side) {
    const key = css(top) + css(side);
    this.puffCache ??= new Map();
    if (this.puffCache.has(key)) return this.puffCache.get(key);
    const c = document.createElement('canvas'); c.width = 256; c.height = 128;
    const g = c.getContext('2d');
    const blob = (x, y, rx, ry, col) => { g.fillStyle = col; g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); g.fill(); };
    const lobes = [[128, 78, 92, 34], [86, 70, 50, 30], [168, 66, 56, 32], [124, 56, 52, 30]];
    for (const [x, y, rx, ry] of lobes) blob(x, y + 6, rx, ry, css(side));
    for (const [x, y, rx, ry] of lobes) blob(x - 4, y - 2, rx * 0.86, ry * 0.8, css(top));
    const url = c.toDataURL();
    this.puffCache.set(key, url);
    return url;
  }

  rebuildPath(map) {
    this.map = map;
    const seg = (pts, cls) => `<path class="${cls}" d="M${pts.map((p) => `${(p.x).toFixed(1)},${p.z.toFixed(1)}`).join('L')}"/>`;
    let d = '';
    for (const s of map.segments) if (s.kind !== 'hidden') d += seg(s.pts, s.kind === 'gold' ? 'gold' : 'faint');
    for (const s of map.spurs) d += seg(s.pts, s.kind === 'gold' ? 'gold spur' : 'faint');
    this.pathSvg.innerHTML = d;
    this.pathSvg.setAttribute('viewBox', `-600 0 1200 ${map.height}`);
    this.pathSvg.style.width = '1200px'; this.pathSvg.style.height = `${map.height}px`;
  }
  setDrawn() {}
  setPart(i, k) {
    this.parts[i] = k;
    const c = this.chunks.find((c) => c.r.index === i);
    for (const b of c?.bank ?? []) {
      const e = k * k * (3 - 2 * k);
      b.img.style.transform = `${b.base} translateX(${(b.dir * e * (300 + 200 * b.seed)).toFixed(0)}px) scale(${(1 - 0.3 * e).toFixed(3)})`;
      b.img.style.opacity = String(1 - e);
    }
  }

  setSize(w, h, dpr) {
    this.w = w; this.h = h; this.dpr = dpr;
    this.sky.width = Math.round(w * dpr); this.sky.height = Math.round(h * dpr);
    this.skyDirty = true;
  }
  offset(u) { return (1 - u) * (this.h + 100); }
  setView(u, s) {
    const changed = u !== this.u || s !== this.s;
    this.u = u; this.s = s;
    const off = this.offset(u);
    for (const [k, el] of Object.entries(this.layers)) el.style.transform = `translate3d(${this.w / 2}px, ${(off * RATES[k] - s * RATES[k]).toFixed(1)}px, 0)`;
    this.seaStrip.style.transform = `translate3d(0, ${(off - s).toFixed(1)}px, 0)`;
    this.viewZ = [s - off - 200, s - off + this.h + 200];
    for (const c of this.chunks) {
      const on = c.z1 > this.viewZ[0] - 300 && c.z0 < this.viewZ[1] + 300;
      if (on !== c.on) { c.on = on; for (const el of c.els) el.style.display = on ? '' : 'none'; }
    }
    // the sky only exists while the horizon can be on screen
    const horizon = this.h + 60 - u * (this.h + 100) - s;
    this.sky.style.display = horizon > -10 ? '' : 'none';
    if (horizon > -10 && (changed || this.skyDirty)) this.drawSky(u, horizon);
  }
  drawSky(u, horizon) {
    this.skyDirty = false;
    const g = this.sky.getContext('2d'), d = this.dpr, w = this.w, h = this.h;
    g.setTransform(d, 0, 0, d, 0, 0);
    g.clearRect(0, 0, w, h);
    const hy = Math.min(h, horizon);
    const grad = g.createLinearGradient(0, hy - h * 1.6, 0, hy);
    grad.addColorStop(0, '#121731'); grad.addColorStop(0.45, '#232a52'); grad.addColorStop(0.72, '#4c5187');
    grad.addColorStop(0.88, '#bd93b8'); grad.addColorStop(0.965, '#f6cbc4'); grad.addColorStop(1, '#ffeedd');
    g.fillStyle = grad; g.fillRect(0, 0, w, hy);
    for (const L of this.stars) {
      const shift = u * h * 1.3 * L.rate;
      for (const [x, y, k] of L.pts) {
        const sy = y * h - shift - h * 0.2;
        if (sy < -4 || sy > hy - 30) continue;
        const fade = Math.min(1, (hy - 30 - sy) / (h * 0.35));
        g.globalAlpha = L.a * fade * (0.5 + 0.5 * k);
        g.fillStyle = '#eef0ff';
        g.fillRect(x * w, sy, L.r, L.r);
      }
    }
    g.globalAlpha = 1;
    if (horizon < h) {
      // the horizon line, then the far cloud sea under it
      const sea = g.createLinearGradient(0, hy, 0, h);
      sea.addColorStop(0, '#fbe6dc'); sea.addColorStop(1, '#f1d6d0');
      g.fillStyle = sea; g.fillRect(0, hy, w, h - hy);
      g.fillStyle = 'rgba(255, 248, 236, .9)'; g.fillRect(0, hy - 1, w, 1.5);
    }
  }
  project(x, y, z, out = {}) {
    out.x = this.w / 2 + x;
    out.y = z - this.s + this.offset(this.u) - y * 0.5;
    out.vis = true; out.scale = 1;
    return out;
  }
  render() {}
  stats() { return { calls: 0, tris: 0 }; }
}
