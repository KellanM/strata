// Direction B: the world as flat layers behind the map's page. The sky (a 2D
// canvas, stars with a slight parallax), the colour script of the cloud sea,
// and scenery sprites on three layers (far, near, front) that slide at their
// own rates. The stones and the trail are NOT here: they live in the page
// itself (app.js), so they always sit on each other.
//
// Scenery: voxel islands rendered once by the game's block shader (voxels.js),
// or the study's earlier low-poly islands (?scenery=lowpoly).
// Clouds, four treatments to compare (?clouds=):
//   painted  soft painted banks, layered toward the haze
//   cumulus  crisp heaped cumulus, lit tops and shaded undersides
//   voxel    cloud masses built from cubes, like the islands
//   mist     long ribbons of mist along the edges
import * as THREE from 'three';
import { Soup, island, soupGeometry, KITS, lightOf } from './islands.js';
import { rng, trailXAt } from './data.js';
import { seaColours } from './world.js';
import { designs, renderVoxels, grid as vgrid, dispose as disposeVoxels } from './voxels.js';
import { peaksFor } from './peaks.js';

const C = (h) => new THREE.Color(h);
const css = (c, a = 1) => `rgba(${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)},${a})`;
export const RATES = { far: 0.84, near: 1, front: 1.12 };
export const CLOUDS = ['painted', 'cumulus', 'voxel', 'mist'];

export class Layers {
  constructor(root, map, { scenery = 'voxel', clouds = 'mist' } = {}) {
    this.root = root; this.map = map; this.u = 0; this.s = 0; this.parts = new Float32Array(32);
    this.opts = { scenery, clouds };
    root.innerHTML = '';
    this.sea = document.createElement('div'); this.sea.className = 'b-sea';
    this.sky = document.createElement('canvas'); this.sky.className = 'b-sky';
    root.append(this.sea, this.sky);
    this.layers = {};
    for (const k of ['far', 'near', 'front']) {
      const d = document.createElement('div'); d.className = `b-layer b-${k}`; root.appendChild(d); this.layers[k] = d;
    }
    this.cache = new Map();
    this.buildSea();
    this.buildScenery();
    // stars: three depths; the page moves them by only 88-96% (a slight parallax)
    this.stars = [[700, 0.9, 0.88, 0.55], [260, 1.3, 0.92, 0.8], [50, 1.9, 0.96, 1]].map(([n, r, rate, a], li) => {
      const rand = rng('stars' + li);
      return { rate, a, r, pts: Array.from({ length: n }, () => [rand(), rand() * 1.15, rand()]) };
    });
  }

  buildSea() {
    const { regions } = this.map;
    const H = this.map.height + 2000;
    const stops = [`${css(seaColours(regions[0].base).sea)} 0px`];
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

  // ---------------------------------------------------------------- sprites
  memo(key, make) { if (!this.cache.has(key)) this.cache.set(key, make()); return this.cache.get(key); }

  voxelIsle(r, k, seed) {
    const sc = seaColours(r.base);
    return this.memo(`v|${r.base.name}|${k}|${seed}`, () => {
      const list = designs(r.base);
      const make = list[k % list.length];
      const out = renderVoxels(make(rng(`${r.name}|${k}|${seed}`)), r.base, { haze: sc.sea.getHex(), ppv: 4.4 });
      return out;
    });
  }

  lowpolyIsle(r, kind, size, hero, seed) {
    return this.memo(`l|${r.name}|${kind}|${Math.round(size)}|${hero}|${seed}`, () => {
      this.lp ??= (() => {
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
        renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
        renderer.setSize(200, 200, false); renderer.setClearColor(0, 0);
        return { renderer, scene: new THREE.Scene(), cam: new THREE.OrthographicCamera(-1, 1, 1, -1, -2000, 2000), mat: new THREE.MeshBasicMaterial({ vertexColors: true }) };
      })();
      const { renderer, scene, cam, mat } = this.lp;
      const s = new Soup();
      const h = island(s, kind, new THREE.Vector3(0, 0, 0), size, rng(seed), r.base, lightOf(r.base), KITS[r.name] ?? {}, hero);
      const mesh = new THREE.Mesh(soupGeometry(s), mat);
      scene.add(mesh);
      const half = Math.max(size * 1.4, h * 0.75);
      cam.left = -half; cam.right = half; cam.top = half * 1.15; cam.bottom = -half * 0.85;
      cam.position.set(0, Math.sin(0.95) * 1000, Math.cos(0.95) * 1000); cam.lookAt(0, h * 0.3, 0); cam.updateProjectionMatrix();
      renderer.render(scene, cam);
      scene.remove(mesh); mesh.geometry.dispose();
      return { url: renderer.domElement.toDataURL('image/png'), w: half * 2, h: half * 2, ax: 0.5, ay: 0.62 };
    });
  }

  // ---- clouds: each treatment draws a sprite for a given palette and seed
  cloudSprite(kind, top, side, seed, big = false) {
    return this.memo(`c|${kind}|${top.getHex()}|${side.getHex()}|${seed}|${big}`, () => {
      const rand = rng(`${kind}${seed}`);
      if (kind === 'voxel') {
        const W = big ? 30 : 22, g = vgrid(W, 9, Math.round(W * 0.6));
        const n = big ? 7 : 5;
        for (let i = 0; i < n; i++) {
          const cx = 4 + rand() * (W - 8), cz = 3 + rand() * (W * 0.6 - 6), rx = 3 + rand() * 4;
          g.blob(cx, 1.5, cz, rx, 2.5 + rand() * 3, rx * 0.8, (x, y) => (y >= 3 ? top.getHex() : y >= 1 ? new THREE.Color().copy(top).lerp(side, 0.5).getHex() : side.getHex()), rand, 0.15);
        }
        return renderVoxels(g, { top: top.getHex(), lit: top.getHex(), shade: side.getHex(), under: side.getHex(), skyBottom: side.getHex(), rays: 0xffffff, glow: 0xffffff, paintTop: 0, paintLit: 0, paintShade: 0 }, { ppv: 4.4, haze: side.getHex() });
      }
      const cw = big ? 420 : 300, ch = kind === 'mist' ? 70 : big ? 170 : 130;
      const c = document.createElement('canvas'); c.width = cw * 2; c.height = ch * 2;
      const g = c.getContext('2d'); g.scale(2, 2);
      if (kind === 'mist') {
        // a long ribbon: soft at both ends, a little brighter along its top
        for (let i = 0; i < 4; i++) {
          const y = ch * (0.35 + rand() * 0.3), x = cw * (0.2 + rand() * 0.6), rx = cw * (0.35 + rand() * 0.2), ry = ch * (0.18 + rand() * 0.12);
          const grad = g.createRadialGradient(x, y, 0, x, y, rx);
          grad.addColorStop(0, css(top, 0.55)); grad.addColorStop(0.6, css(top, 0.25)); grad.addColorStop(1, css(top, 0));
          g.save(); g.translate(x, y); g.scale(1, ry / rx); g.translate(-x, -y);
          g.fillStyle = grad; g.fillRect(x - rx, y - rx, rx * 2, rx * 2); g.restore();
        }
      } else if (kind === 'painted') {
        // soft lobes in three passes: the shaded base, the body, the lit crown
        const lobes = Array.from({ length: big ? 11 : 8 }, () => [cw * (0.12 + rand() * 0.76), ch * (0.42 + rand() * 0.22), ch * (0.2 + rand() * 0.16)]);
        const pass = (dy, col, a, k) => {
          for (const [x, y, r] of lobes) {
            const grad = g.createRadialGradient(x, y + dy, 0, x, y + dy, r * k);
            grad.addColorStop(0, css(col, a)); grad.addColorStop(0.65, css(col, a * 0.85)); grad.addColorStop(1, css(col, 0));
            g.fillStyle = grad; g.beginPath(); g.arc(x, y + dy, r * k, 0, Math.PI * 2); g.fill();
          }
        };
        pass(ch * 0.08, side, 0.9, 1.15);
        pass(0, C(0xffffff).lerp(top, 0.5), 0.9, 1);
        pass(-ch * 0.06, top, 0.75, 0.72);
      } else {
        // cumulus: heaped lobes on a flat base; crisp silhouette, lit from
        // above, cool and shaded underneath
        const lobes = [];
        const n = big ? 9 : 6;
        for (let i = 0; i < n; i++) {
          const t = (i + 0.5) / n, x = cw * (0.12 + 0.76 * t + (rand() - 0.5) * 0.06);
          const hump = Math.sin(Math.PI * t);
          const r = ch * (0.18 + 0.2 * hump + rand() * 0.08);
          lobes.push([x, ch * 0.78 - r * (0.7 + 0.3 * hump), r]);
        }
        const base = ch * 0.8;
        g.save();
        g.beginPath(); for (const [x, y, r] of lobes) { g.moveTo(x + r, y); g.arc(x, y, r, 0, Math.PI * 2); }
        g.rect(cw * 0.1, base - ch * 0.12, cw * 0.8, ch * 0.12);
        g.clip();
        const grad = g.createLinearGradient(0, ch * 0.1, 0, base);
        grad.addColorStop(0, css(top)); grad.addColorStop(0.55, css(C(0xffffff).lerp(top, 0.6).lerp(side, 0.15))); grad.addColorStop(1, css(side));
        g.fillStyle = grad; g.fillRect(0, 0, cw, ch);
        // a little shadow on the side of each lobe away from the light (upper left)
        for (const [x, y, r] of lobes) {
          const sh = g.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.2, x, y, r * 1.05);
          sh.addColorStop(0, 'rgba(255,255,255,0)'); sh.addColorStop(0.8, 'rgba(255,255,255,0)'); sh.addColorStop(1, css(side, 0.35));
          g.fillStyle = sh; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
        }
        g.restore();
      }
      return { url: c.toDataURL(), w: cw, h: ch, ax: 0.5, ay: kind === 'mist' ? 0.5 : 0.8 };
    });
  }

  // ---------------------------------------------------------------- mist and mountain tops (round 3)
  peakSprite(r, i, o) {
    const sc = seaColours(r.base);
    return this.memo(`pk|${r.base.name}|${i}|${o.ppv}|${o.tint ?? 0}`, () => {
      const list = peaksFor(r.base);
      const mistCol = this.mistColour(r);
      return renderVoxels(list[i % list.length].make(), r.base, { haze: sc.sea.getHex(), ppv: o.ppv, fade: o.fade ?? 0.42, tint: o.tint ? { color: mistCol.getHex(), amount: o.tint } : null });
    });
  }
  // mist lit by its own sky: warm cream in warm chapters, cool only at night
  mistColour(r) {
    const p = r.base, sc = seaColours(p);
    if (p.name === 'Night') return sc.sea.clone().lerp(C(0xdfe6ff), 0.62);
    if (sc.dark) return C(p.skyBottom).lerp(C(0xffffff), 0.42).lerp(C(p.glow), 0.15);
    return C(0xffffff).lerp(C(p.skyTop), 0.42);
  }
  // a ribbon of mist: overlapping soft ellipses, brightest along the middle
  mistRibbon(col, seed, w, h, alpha) {
    return this.memo(`mr|${col.getHex()}|${seed}|${w}|${h}|${alpha}`, () => {
      const rand = rng(`mist${seed}`);
      const c = document.createElement('canvas'); c.width = w * 2; c.height = h * 2;
      const g = c.getContext('2d'); g.scale(2, 2);
      const n = 6 + Math.floor(rand() * 4);
      for (let i = 0; i < n; i++) {
        // every lobe stays inside the canvas, so no edge is ever cut straight
        const rx = w * (0.16 + rand() * 0.18), ry = h * (0.2 + rand() * 0.14);
        const x = rx + rand() * (w - 2 * rx), y = h / 2 + (rand() - 0.5) * (h - 2 * ry) * 0.6;
        const grad = g.createRadialGradient(x, y, 0, x, y, rx);
        grad.addColorStop(0, css(col, alpha)); grad.addColorStop(0.55, css(col, alpha * 0.6)); grad.addColorStop(1, css(col, 0));
        g.save(); g.translate(x, y); g.scale(1, ry / rx); g.translate(-x, -y);
        g.fillStyle = grad; g.fillRect(x - rx, y - rx, rx * 2, rx * 2); g.restore();
      }
      return { url: c.toDataURL(), w, h, ax: 0.5, ay: 0.5 };
    });
  }
  buildMist(r, chunk, rand, put) {
    const map = this.map;
    const mist = this.mistColour(r), sc = seaColours(r.base);
    const drift = (img) => { img.classList.add('drift'); img.style.setProperty('--dur', `${(18 + rand() * 16).toFixed(1)}s`); img.style.setProperty('--delay', `${(-rand() * 20).toFixed(1)}s`); return img; };
    const FADE = 0.5;   // the lower half of a peak's sprite fades out; fully gone by its last 20%
    // a peak, its base fading out, and the densest band of mist exactly where it's gone
    const peak = (layer, x, z, i, o, cls = '') => {
      const spr = this.peakSprite(r, i, { fade: FADE, ...o });
      const img = put(layer, x, z, spr, 1, `peak ${cls}`);
      const cut = z - spr.h * spr.ay + spr.h * (1 - FADE * 0.55);
      // soft (edge alpha well under 0.6) and never within 40 px of the trail
      let w = Math.round(spr.w * 1.9);
      const tx = trailXAt(map, cut), inner = x - Math.sign(x || 1) * w / 2;
      if (Math.sign(x || 1) * (inner - tx) < 40) w = Math.max(90, Math.round(2 * Math.abs(x - (tx + Math.sign(x || 1) * 40))));
      drift(put(layer, x, cut, this.mistRibbon(mist, 10 + i, w, Math.round(Math.max(70, spr.h * 0.5)), 0.55), 1, `mist base ${cls}`));
      return { spr, img };
    };
    const W2 = this.w / 2 || 195;
    // the depth pair on each screen: a big summit near the stones, cropped by
    // the edge (about 38% off), and a small pale peak far back on the other side
    const side = r.index % 2 ? -1 : 1;
    let zs = r.labelZ + 200;
    for (let z = r.labelZ + 120; z < Math.min(r.bottom - 100, r.labelZ + 520); z += 20) {
      if (Math.sign(trailXAt(map, z)) === -side && Math.abs(trailXAt(map, z)) > 50) { zs = z + 60; break; }
    }
    // clear of the chapter's name by 90 px, and never cropped at its landmark
    const sigSpr = this.peakSprite(r, 0, { ppv: 10, fade: FADE });
    zs = Math.min(r.bottom - 60, Math.max(zs, r.labelZ + 90 + sigSpr.h * sigSpr.ay));
    const sig = { x: side * (W2 - sigSpr.w * 0.22), z: zs };
    peak('far', -side * (W2 - 40), zs - 120, 3, { ppv: 4.5, tint: 0.5 }, 'distant');
    // lower in the chapter: another landform near the stones and a far one,
    // except in every third chapter, which keeps a stretch of open mist
    if (r.index % 3 !== 2) {
      const z = Math.min(r.bottom - 160, r.labelZ + 700);
      const x2 = trailXAt(map, z), sd = Math.abs(x2) > 30 ? -Math.sign(x2) : -side;
      const w = this.peakSprite(r, 1 + (r.index % 2), { ppv: 7.5, fade: FADE }).w;
      peak('near', sd * (W2 - w * 0.12), z, 1 + (r.index % 2), { ppv: 7.5 });
      peak('far', -sd * (W2 - 40), z - 140, 4, { ppv: 4.5, tint: 0.5 }, 'distant');
    }
    // a few free bands only, far back and faint; the rest of the mist hangs on the peaks
    for (let z = r.top + 80; z < r.bottom; z += 260 + rand() * 120) {
      const sd = rand() < 0.5 ? -1 : 1;
      drift(put('far', sd * (250 + rand() * 60), z, this.mistRibbon(mist, 6 + Math.floor(rand() * 4), 300, 70, 0.32), 1, 'mist'));
    }
    if (!r.reached) {
      // its signature summit stands behind the veil's top edge, on the side
      // away from the chapter's name: only its upper part shows (the teaser)
      const labelSide = trailXAt(map, r.labelZ) > 0 ? -1 : 1;
      const tw = this.peakSprite(r, 0, { ppv: 10, fade: FADE });
      peak('near', -labelSide * (W2 - tw.w * 0.3), r.top + 40 - tw.h * 0.3 + tw.h * tw.ay, 0, { ppv: 10 }, 'teaser');
      // the veil: a dense wall of mist that lifts when the trail reaches it
      const wall = document.createElement('div');
      wall.className = 'b-wall';
      const z0 = r.top + 30, z1 = r.bottom + 60;
      wall.style.transform = `translate(-560px, ${z0}px)`;
      wall.style.width = '1120px'; wall.style.height = `${z1 - z0}px`;
      wall.style.background = `linear-gradient(180deg, ${css(mist, 0)} 0, ${css(mist, 0.94)} 110px, ${css(mist, 0.97)} 100%)`;
      this.layers.near.appendChild(wall); chunk.els.push(wall);
      const veil = { wall, base: wall.style.transform, kids: [] };
      for (let z = r.top + 10; z < r.bottom + 40; z += 58) {
        for (let x = -420; x <= 420; x += 150 + rand() * 50) {
          const img = put('near', x + (rand() - 0.5) * 50, z + (rand() - 0.5) * 30, this.mistRibbon(mist, Math.floor(rand() * 8), 280, 80, 0.85), 0.8 + rand() * 0.5, 'mist veil');
          veil.kids.push({ img, base: img.style.transform, x, seed: rand() });
        }
      }
      chunk.veil = veil;
      // two faint silhouettes deeper in the veil: more lies inside
      for (const [k, i] of [[0.45, 1], [0.75, 2]]) {
        const pz = r.top + (r.bottom - r.top) * k;
        if (pz > r.bottom - 100) continue;
        const { img } = peak('near', (i === 1 ? -1 : 1) * (W2 - 30), pz, i, { ppv: 6, tint: 0.2 }, 'ghost');
        img.style.opacity = '0.26';
        veil.kids.push({ img, base: img.style.transform, x: 0, seed: 0.5, ghost: true });
      }
    } else {
      peak('near', sig.x, sig.z, 0, { ppv: 10 });
    }
  }

  // ---------------------------------------------------------------- placement
  buildScenery() {
    const map = this.map;
    this.chunks = [];
    for (const r of map.regions) {
      const rand = rng(r.name + 'b');
      const sc = seaColours(r.base);
      const chunk = { r, z0: r.top - 400, z1: r.bottom + 400, els: [] };
      const put = (layer, x, z, spr, scale = 1, cls = '') => {
        const img = new Image(); img.src = spr.url; img.alt = ''; img.className = `b-spr ${cls}`;
        const w = spr.w * scale, h = spr.h * scale;
        img.style.width = `${w}px`;
        img.style.transform = `translate(${(x - w * spr.ax).toFixed(0)}px, ${(z - h * spr.ay).toFixed(0)}px)${rand() < 0.5 && cls.includes('cloud') ? ' scaleX(-1)' : ''}`;
        this.layers[layer].appendChild(img); chunk.els.push(img); return img;
      };
      if (this.opts.clouds === 'mist' && this.opts.scenery === 'voxel') {
        this.buildMist(r, chunk, rand, put);
        for (const el of chunk.els) el.style.display = 'none';
        chunk.on = false;
        this.chunks.push(chunk);
        continue;
      }
      const isle = (k, size, hero, seed) => this.opts.scenery === 'lowpoly'
        ? this.lowpolyIsle(r, hero ? KITS[r.name]?.hero ?? 'peak' : (KITS[r.name]?.kinds ?? ['peak'])[k % 3], size, hero, `${r.name}${seed}`)
        : this.voxelIsle(r, k, seed % 2);
      // the chapter's signature island near its name, the rest in the trail's pockets
      const zt = r.labelZ + 150 + rand() * 120, xt = trailXAt(map, zt);
      put('near', -Math.sign(xt || 1) * 140, zt, isle(0, 50, true, 1), this.opts.scenery === 'lowpoly' ? 1 : 1.1);
      let k = 1;
      for (let z = r.top + 170; z < r.bottom - 60; z += 210 + rand() * 140) {
        const x2 = trailXAt(map, z), side = Math.abs(x2) > 30 ? -Math.sign(x2) : 1;
        if (rand() < 0.8) put('near', side * (175 + rand() * 50), z, isle(k++, 30 + rand() * 18, false, k), 0.8 + rand() * 0.25);
        if (rand() < 0.7) put('far', -side * (250 + rand() * 90), z + 40, isle(k++, 46 + rand() * 30, false, k), 0.6 + rand() * 0.2, 'hazy');
      }
      // clouds along both edges: far ones lighter, front ones framing
      const kind = this.opts.clouds;
      for (let z = r.top; z < r.bottom; z += (kind === 'mist' ? 150 : 130) + rand() * 90) {
        for (const sd of [-1, 1]) {
          if (rand() < 0.75) put('front', sd * (205 + rand() * 60), z, this.cloudSprite(kind, sc.top, sc.side, Math.floor(rand() * 5)), kind === 'voxel' ? 0.9 : 0.75 + rand() * 0.35, 'cloud');
          if (rand() < 0.5) put('far', sd * (300 + rand() * 120), z + 60, this.cloudSprite(kind, sc.top, sc.side, 5 + Math.floor(rand() * 3)), 0.6 + rand() * 0.2, 'cloud hazy');
        }
      }
      if (!r.reached) this.buildBank(r, chunk, rand, kind, sc, put);
      for (const el of chunk.els) el.style.display = 'none';
      chunk.on = false;
      this.chunks.push(chunk);
    }
    disposeVoxels();
    this.lp?.renderer.dispose();
  }

  // A chapter not yet reached sits under a bank: a solid body of cloud (no
  // gaps for the sea to show through) with a billowing top edge and surface,
  // in two halves that part from the trail outward.
  buildBank(r, chunk, rand, kind, sc, put) {
    const dark = sc.dark;
    const top = dark ? C(0xdfe4f2).lerp(C(r.base.glow), 0.3).multiplyScalar(0.82) : C(0xfbf8fb).lerp(C(r.base.glow), 0.4);
    const side = dark ? C(r.base.skyBottom).lerp(C(0xc8cfe6), 0.62) : C(0xebe4ee).lerp(C(r.base.skyBottom), 0.22);
    const halves = [];
    for (const sd of [-1, 1]) {
      const half = document.createElement('div');
      half.className = 'b-bank';
      const z0 = r.top + 60, z1 = r.bottom + 40;
      half.style.transform = `translate(${sd < 0 ? -560 : 0}px, ${z0}px)`;
      half.style.width = '560px'; half.style.height = `${z1 - z0}px`;
      half.style.background = `linear-gradient(180deg, ${css(top, 0)} 0, ${css(top)} 70px, ${css(C(0xffffff).lerp(top, 0.7).lerp(side, 0.2))} 100%)`;
      this.layers.near.appendChild(half);
      chunk.els.push(half);
      halves.push({ el: half, sd, base: half.style.transform, kids: [] });
    }
    // the billows: along the leading edge, and scattered over the body
    for (let z = r.top; z < r.bottom; z += kind === 'mist' ? 70 : 95) {
      const edge = z < r.top + 140;
      for (let x = -470; x <= 470; x += kind === 'mist' ? 210 : 150) {
        if (!edge && rand() < 0.45) continue;
        const spr = this.cloudSprite(kind, top, side, Math.floor(rand() * 6), true);
        const img = put('near', x + (rand() - 0.5) * 60, z + (edge ? 70 : 60) + (rand() - 0.5) * 40, spr, kind === 'voxel' ? 1 : 0.8 + rand() * 0.4, 'cloud bank');
        halves[x < 0 ? 0 : 1].kids.push({ img, base: img.style.transform, x, seed: rand() });
      }
    }
    chunk.bank = halves;
  }

  setPart(i, k) {
    this.parts[i] = k;
    const c = this.chunks.find((c) => c.r.index === i);
    if (c?.veil) {
      // the mist lifts: it thins from the trail outward, its bands rising and
      // spreading as they fade; the wall behind them clears last
      const v = c.veil, e = k * k * (3 - 2 * k);
      v.wall.style.transform = `${v.base} translateY(${(-e * 70).toFixed(1)}px)`;
      v.wall.style.opacity = String(Math.max(0, 1 - Math.pow(k, 1.4) * 1.15));
      for (const q of v.kids) {
        const kk = Math.min(1, Math.max(0, k * 1.5 - (Math.abs(q.x) / 420) * 0.4 - q.seed * 0.15));
        const ee = kk * kk * (3 - 2 * kk);
        q.img.style.transform = `${q.base} translate(${(Math.sign(q.x || 1) * ee * (90 + 90 * q.seed)).toFixed(1)}px, ${(-ee * (70 + 60 * q.seed)).toFixed(1)}px)`;
        q.img.style.opacity = String(Math.max(0, (q.ghost ? 0.26 : 1) * (1 - ee)));
      }
      return;
    }
    for (const h of c?.bank ?? []) {
      // the middle opens first; billows drift wider than the body and thin away
      const e = k * k * (3 - 2 * k);
      h.el.style.transform = `${h.base} translateX(${(h.sd * e * 340).toFixed(1)}px)`;
      h.el.style.opacity = String(Math.max(0, 1 - e * 1.25));
      for (const q of h.kids) {
        const kk = Math.min(1, Math.max(0, k * 1.3 - (Math.abs(q.x) / 470) * 0.3 - q.seed * 0.1));
        const ee = kk * kk * (3 - 2 * kk);
        q.img.style.transform = `${q.base} translateX(${(h.sd * ee * (260 + 120 * q.seed)).toFixed(1)}px)`;
        q.img.style.opacity = String(Math.max(0, 1 - ee * 1.1));
      }
    }
  }
  setDrawn() {}
  rebuildPath() {}

  setSize(w, h, dpr) {
    this.w = w; this.h = h; this.dpr = dpr;
    this.sky.width = Math.round(w * dpr); this.sky.height = Math.round(h * dpr);
    this.skyDirty = true;
  }
  // the page sits (1 - u) * (H + 100) below its place while the title is up
  offset(u) { return (1 - u) * (this.h + 100); }
  setView(u, s) {
    const changed = u !== this.u || s !== this.s;
    this.u = u; this.s = s;
    const off = this.offset(u);
    // the near layer moves exactly with the page; far and front a little slower / faster
    for (const [k, el] of Object.entries(this.layers)) el.style.transform = `translate3d(${this.w / 2}px, ${((off - s) * RATES[k]).toFixed(1)}px, 0)`;
    this.seaStrip.style.transform = `translate3d(0, ${(off - s).toFixed(1)}px, 0)`;
    this.viewZ = [s - off - 300, s - off + this.h + 300];
    for (const c of this.chunks) {
      const on = c.z1 > this.viewZ[0] - 300 && c.z0 < this.viewZ[1] + 300;
      if (on !== c.on) { c.on = on; for (const el of c.els) el.style.display = on ? '' : 'none'; }
    }
    // the sky is the top of the page: its horizon moves with the page
    const horizon = this.h + 60 - (this.h + 100) * u - s;
    this.sky.style.display = horizon > -10 ? '' : 'none';
    if (horizon > -10 && (changed || this.skyDirty)) this.drawSky(horizon);
  }
  drawSky(horizon) {
    this.skyDirty = false;
    const g = this.sky.getContext('2d'), d = this.dpr, w = this.w, h = this.h;
    g.setTransform(d, 0, 0, d, 0, 0);
    g.clearRect(0, 0, w, h);
    const hy = Math.min(h, horizon);
    // the gradient is pinned to the horizon, which is pinned to the page
    const grad = g.createLinearGradient(0, horizon - h * 1.4, 0, horizon);
    grad.addColorStop(0, '#121731'); grad.addColorStop(0.45, '#232a52'); grad.addColorStop(0.72, '#4c5187');
    grad.addColorStop(0.88, '#bd93b8'); grad.addColorStop(0.965, '#f6cbc4'); grad.addColorStop(1, '#ffeedd');
    g.fillStyle = grad; g.fillRect(0, 0, w, hy);
    const travel = (this.h + 60) - horizon;   // how far the page has moved
    for (const L of this.stars) {
      for (const [x, y, k] of L.pts) {
        const sy = y * h - travel * L.rate;
        if (sy < -4 || sy > hy - 24) continue;
        g.globalAlpha = L.a * Math.min(1, (hy - 24 - sy) / (h * 0.35)) * (0.5 + 0.5 * k);
        g.fillStyle = '#eef0ff';
        g.fillRect(x * w, sy, L.r, L.r);
      }
    }
    g.globalAlpha = 1;
    if (horizon < h) {
      const sea = g.createLinearGradient(0, hy, 0, h);
      sea.addColorStop(0, '#fbe6dc'); sea.addColorStop(1, '#f1d6d0');
      g.fillStyle = sea; g.fillRect(0, hy, w, h - hy);
      g.fillStyle = 'rgba(255, 248, 236, .9)'; g.fillRect(0, hy - 1, w, 1.5);
    }
  }
  project(x, y, z, out = {}) {
    out.x = this.w / 2 + x;
    out.y = z - this.s + this.offset(this.u);
    out.vis = true; out.scale = 1;
    return out;
  }
  render() {}
  stats() { return { calls: 0, tris: 0 }; }
}
