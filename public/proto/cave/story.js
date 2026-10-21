// The sequence as pure functions of time t (seconds), so any frame can be
// rendered exactly (?t=17.2&still) and a skip or replay never drifts.
import { panelCenter, hash2, wx, wy } from './mural.js';

export const END = 32.4;   // the fade is complete
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const smooth = (a, b, v) => { const x = clamp((v - a) / (b - a)); return x * x * (3 - 2 * x); };
const easeOut = (u) => 1 - Math.pow(1 - clamp(u), 3);
const easeIn = (u) => Math.pow(clamp(u), 2.2);
const lerp = (a, b, u) => a + (b - a) * u;

// monotone cubic through timed keys: smooth, never overshoots, can come to rest
export function track(keys) {
  const n = keys.length, t = keys.map((k) => k[0]), v = keys.map((k) => k[1]);
  const d = [], m = new Array(n).fill(0);
  for (let i = 0; i < n - 1; i++) d.push((v[i + 1] - v[i]) / (t[i + 1] - t[i]));
  for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  m[0] = 0; m[n - 1] = 0;
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) { m[i] = m[i + 1] = 0; continue; }
    const a = m[i] / d[i], b = m[i + 1] / d[i], s = a * a + b * b;
    if (s > 9) { const k = 3 / Math.sqrt(s); m[i] = k * a * d[i]; m[i + 1] = k * b * d[i]; }
  }
  return (x) => {
    if (x <= t[0]) return v[0];
    if (x >= t[n - 1]) return v[n - 1];
    let i = 0; while (x > t[i + 1]) i++;
    const h = t[i + 1] - t[i], u = (x - t[i]) / h, u2 = u * u, u3 = u2 * u;
    return (2 * u3 - 3 * u2 + 1) * v[i] + (u3 - 2 * u2 + u) * h * m[i] + (-2 * u3 + 3 * u2) * v[i + 1] + (u3 - u2) * h * m[i + 1];
  };
}

export function makeStory(info, mural) {
  const C = [0, 1, 2, 3, 4].map(panelCenter);
  const L = info.lantern;

  // ------------------------------------------------------------ the lantern
  const lx = track([
    [0, C[0].x - 12], [1.6, C[0].x - 9], [6.4, C[0].x + 7], [8.4, C[1].x - 3], [12.0, C[1].x + 5],
    [13.4, C[2].x - 1], [16.2, C[2].x + 1], [18.2, C[2].x + 6], [20.2, C[3].x - 1], [22.6, C[3].x + 1], [24.4, C[3].x + 3],
    [26.6, L.x - 5], [28.4, L.x], [END, L.x],
  ]);
  const ly = track([
    [0, C[0].y - 2], [3.5, C[0].y + 2], [6.4, C[0].y - 1], [8.4, C[1].y - 6], [12.0, C[1].y + 2],
    [13.4, C[2].y + 4], [16.2, C[2].y + 1], [18.2, C[2].y - 6], [20.2, C[3].y - 9], [24.4, C[3].y - 6],
    [26.6, L.y + 3], [28.4, L.y], [END, L.y],
  ]);
  const lr = track([[0, 19], [26.6, 19], [28.4, 17], [30.4, 9], [END, 8.5]]);
  const lantern = (t) => {
    // carried: a slow step-bob and sway, and the flame's own unrest
    const walking = 1 - smooth(28.0, 28.6, t);
    const bob = Math.sin(t * 4.2) * 0.35 * walking, sway = Math.sin(t * 2.1 + 1) * 0.5 * walking;
    const gutter = smooth(14.2, 15.5, t) * (1 - smooth(17.6, 18.8, t));
    const fl = 1 + (0.06 + 0.12 * gutter) * Math.sin(t * 13.1) + (0.05 + 0.1 * gutter) * Math.sin(t * 7.3 + 1) + 0.04 * Math.sin(t * 23.7 + 2)
      + 0.05 * Math.sin(t * 31.3 + Math.sin(t * 3.1) * 4);
    const ignite = smooth(0.2, 1.8, t) * (1 + 0.5 * Math.exp(-Math.pow((t - 1.0) / 0.25, 2)));
    const I = ignite * fl * (1 - 0.38 * gutter);
    return {
      x: lx(t) + sway + 0.12 * Math.sin(t * 17.0), y: ly(t) + bob + 0.1 * Math.sin(t * 19.0),
      z: 5, R: lr(t) * (1 + 0.03 * Math.sin(t * 9.1)), I,
    };
  };

  // ------------------------------------------------------------ the camera
  const cx = track([[0, C[0].x], [6.6, C[0].x + 1], [8.6, C[1].x], [12.2, C[1].x], [13.6, C[2].x], [18.3, C[2].x + 1], [20.0, C[3].x], [24.6, C[3].x], [26.8, C[4].x], [END, C[4].x]]);
  const cy = track([[0, C[0].y], [12.2, C[1].y], [13.6, C[2].y + 1], [18.3, C[2].y - 1], [20.0, C[3].y - 4], [24.6, C[3].y - 4], [26.8, C[4].y - 4], [END, L.y + 4]]);
  const cd = track([[0, 1.04], [6, 1.0], [13.6, 1.0], [16.8, 0.93], [18.3, 0.97], [20.0, 1.0], [26.8, 1.0], [30.5, 0.86], [END, 0.84]]);

  // ------------------------------------------------------------ the bodies (panel 3)
  // each star: tendrils creep to it, wrap it, it struggles, is dragged down, then falls burning
  const stars = info.bodies.filter((b) => b.kind === 'star');
  const moon = info.bodies.find((b) => b.kind === 'moon');
  const imp = info.impacts;   // left to right: star, star, moon, star, star
  const starImpacts = [imp[0], imp[1], imp[3], imp[4]];
  const misses = [{ x: wx(3, 64), y: wy(30) }, { x: wx(3, 70), y: wy(24) }];
  // which star lands where: keep paths from crossing too wildly
  const order = [0, 2, 1, 5, 3, 4];   // star j -> slot
  const slots = [starImpacts[0], starImpacts[1], misses[0], starImpacts[2], starImpacts[3], misses[1]];
  for (const s of stars) {
    const k = order[s.j];
    const target = slots[k];
    const flight = 1.45 + 0.1 * (s.j % 3);
    const impactT = target.t ?? (18.0 + s.j * 0.25 + flight);
    const release = impactT - flight;
    const c0 = 13.2 + s.j * 0.2;
    s.g = { c0, reach: c0 + 1.7, wrap: c0 + 2.2, tug: c0 + 2.6, release, impact: impactT, flight };
    s.drag = { x: (s.j % 2 ? 2 : -1.5), y: -(s.home.y - info.gloamTop(s.home.x - wx(2, 0))) * 0.5 };
    s.target = target;
    s.size = 1;
  }
  {
    const flight = 1.75, release = imp[2].t - flight;
    moon.g = { c0: 13.4, reach: 15.4, wrap: 16.1, tug: 16.6, release, impact: imp[2].t, flight };
    moon.drag = { x: 1.5, y: -12 };
    moon.target = imp[2];
    moon.size = 4.4;
  }
  const bodies = [...stars, moon];

  for (const b of bodies) b.zWall = Math.max(...b.cells.map(([dx, dy]) => mural.zAt(b.home.x + dx, b.home.y + dy))) + 0.15;
  function bodyAt(b, t) {
    const g = b.g, H = b.home;
    const zWall = b.zWall;
    if (t < g.tug) {
      const shiver = smooth(g.reach, g.wrap, t) * 0.14;
      return { x: H.x + shiver * Math.sin(t * 37 + b.j), y: H.y + shiver * Math.cos(t * 41 + b.j), z: zWall, heat: 0, on: true, phase: 0 };
    }
    if (t < g.release) {
      // dragged: it resists, gives, resists, then goes
      const u = clamp((t - g.tug) / (g.release - g.tug));
      const e = 0.7 * u * u + 0.3 * smooth(0.0, 0.5, u) - 0.04 * Math.sin(u * Math.PI * 4) * (1 - u);
      const s = 0.18 * (1 - u);
      return { x: H.x + b.drag.x * e + s * Math.sin(t * 43), y: H.y + b.drag.y * e + s * Math.cos(t * 37), z: zWall + 0.1, heat: smooth(0.75, 1, u) * 0.6, on: true, phase: 1 };
    }
    if (t < g.impact) {
      const p = meteorAt(b, t);
      return { ...p, z: Math.max(p.z, zWall + 0.3), on: true, phase: 2 };
    }
    return { x: b.target.x, y: b.target.y, z: 1, heat: 0, on: false, phase: 3 };
  }
  // the fall: an accelerating arc from where the tendril let go to the ground
  function meteorPoint(b, u) {
    const g = b.g, H = b.home;
    const P0 = { x: H.x + b.drag.x, y: H.y + b.drag.y }, P3 = b.target;
    const P1 = { x: P0.x + 5, y: P0.y - 1 }, P2 = { x: P3.x - 9, y: P3.y + 12 };
    const k = 1 - u;
    return {
      x: k * k * k * P0.x + 3 * k * k * u * P1.x + 3 * k * u * u * P2.x + u * u * u * P3.x,
      y: k * k * k * P0.y + 3 * k * k * u * P1.y + 3 * k * u * u * P2.y + u * u * u * P3.y,
    };
    void g;
  }
  const flightU = (b, t) => Math.pow(clamp((t - b.g.release) / b.g.flight), 1.55);
  function meteorAt(b, t) {
    const u = flightU(b, t), p = meteorPoint(b, u);
    return { x: p.x, y: p.y, z: 3.6, heat: 0.6 + 0.4 * smooth(0, 0.25, u), u };
  }

  // ------------------------------------------------------------ tendrils
  // each reaches from the painted Gloam's edge, curling as it climbs
  const tendrils = [];
  for (const b of bodies) {
    const n = b.kind === 'moon' ? 3 : 1;
    for (let k = 0; k < n; k++) {
      const lxh = b.home.x - wx(2, 0);
      const rootLx = clamp(lxh + (b.kind === 'moon' ? (k - 1) * 9 : (hash2(b.j, 1, 7) - 0.5) * 10), 2, 33);
      const root = { x: wx(2, 0) + rootLx, y: info.gloamTop(rootLx) - 1 };
      tendrils.push({
        b, k, root, bend: (hash2(b.j, k, 9) < 0.5 ? -1 : 1) * (6 + 5 * hash2(b.j, k, 10)),
        ph: hash2(b.j, k, 11) * 6.28, wrapR: b.kind === 'moon' ? 5.6 + k * 0.5 : 1.9,
        dir: k % 2 ? -1 : 1, thick: b.kind === 'moon' ? 1.25 : 1, delay: k * 0.25,
        a0: (b.kind === 'moon' ? [-2.4, -1.6, -0.7][k] : -1.6 + (hash2(b.j, 2, 12) - 0.5)),
      });
    }
  }
  function tendrilPath(T, t, target, s) {
    // s in [0, 1]: the climb; s in (1, 1 + wrap]: the curl round the body
    const R = T.root, wr = T.wrapR;
    const a0 = T.a0;
    const E = { x: target.x + Math.cos(a0) * wr, y: target.y + Math.sin(a0) * wr };
    if (s <= 1) {
      const P1 = { x: R.x + T.bend, y: R.y + 11 }, P2 = { x: E.x - T.bend * 1.5, y: E.y - 6 };
      const k = 1 - s;
      let x = k * k * k * R.x + 3 * k * k * s * P1.x + 3 * k * s * s * P2.x + s * s * s * E.x;
      let y = k * k * k * R.y + 3 * k * k * s * P1.y + 3 * k * s * s * P2.y + s * s * s * E.y;
      // a slow wave travels up it, like something feeling its way
      const w = Math.sin(s * 9 - t * 2.4 + T.ph) * 1.1 * Math.sin(Math.PI * s);
      x += w; y += w * 0.3;
      return { x, y };
    }
    const turn = (s - 1) * Math.PI * 2 * T.dir;
    const r = wr * (1 - 0.18 * (s - 1));
    return { x: target.x + Math.cos(a0 + turn) * r, y: target.y + Math.sin(a0 + turn) * r };
  }
  const WRAP = 1.1;
  function tendrilReach(T, t) {
    const g = T.b.g, c0 = g.c0 + T.delay;
    if (t < c0) return 0;
    if (t < g.reach) return easeOut((t - c0) / (g.reach - c0)) * 1;
    if (t < g.release) return 1 + WRAP * easeOut((t - g.reach) / (g.wrap - g.reach));
    return (1 + WRAP) * (1 - easeIn((t - g.release) / 1.3));
  }

  // ------------------------------------------------------------ per-frame output
  const MIST = [0.55, 0.6, 0.78];      // the Gloam: cold, pale grey
  const DUST = [0.16, 0.12, 0.1];
  const CORE = [0.16, 0.18, 0.27];

  function frame(t, mist, glow) {
    const out = { lights: [], tiles: [], shake: { x: 0, y: 0 } };
    out.lantern = lantern(t);
    out.cam = { x: cx(t), y: cy(t), d: cd(t) };
    out.fade = t < 0.4 ? 1 - smooth(0, 0.4, t) : smooth(30.6, END, t);

    // the bodies and their tiles
    for (const b of bodies) {
      const p = bodyAt(b, t);
      b.now = p;
      if (!p.on) continue;
      for (const [dx, dy] of b.cells) out.tiles.push({ x: p.x + dx, y: p.y + dy, z: p.z, heat: p.heat, rnd: hash2(dx + 9, dy + 9, b.j) });
      if (p.phase === 2) {
        const big = b.kind === 'moon';
        out.lights.push({ x: p.x, y: p.y, z: 4, R: big ? 18 : 12, c: [1.8 * p.heat, 0.95 * p.heat, 0.36 * p.heat], w: p.heat * (big ? 2 : 1) });
        // the head and its trail of burning sky, each puff drawn out along the fall
        glow.add(p.x, p.y, 3.8, big ? 9 : 4, 0, 0.5, 0, 1, 1.2, 0.75, 0.4);
        glow.add(p.x, p.y, 3.9, big ? 3.4 : 1.5, 0, 1, 0, 1, 2.0, 1.7, 1.2);
        const u = p.u, N = big ? 34 : 24;
        let prev = p;
        for (let i = 1; i <= N; i++) {
          const uu = u - i * (big ? 0.011 : 0.01);
          if (uu < 0) break;
          const q = meteorPoint(b, uu), f = 1 - i / (N + 1);
          const ang = Math.atan2(prev.y - q.y, prev.x - q.x);
          prev = q;
          const sz = (big ? 2.6 : 1.2) * (0.35 + 0.65 * f);
          glow.add(q.x, q.y, 3.7, sz, ang, f * f * 0.85, 0, 2.6, 1.3 * f + 0.25, 0.6 * f + 0.08, 0.1 + 0.1 * f);
        }
      } else if (p.heat > 0) {
        glow.add(p.x, p.y, 2.0, b.kind === 'moon' ? 12 : 4, 0, p.heat * 0.6, 0, 1, 1.0, 0.55, 0.2);
      }
    }

    // the tendrils
    for (const T of tendrils) {
      const e = tendrilReach(T, t);
      if (e <= 0.001) continue;
      const tgt = t < T.b.g.release ? T.b.now : { x: T.b.home.x + T.b.drag.x, y: T.b.home.y + T.b.drag.y };
      const N = Math.round(52 * T.thick), flow = (t * 0.55 + T.ph) % 1;
      const total = 1 + WRAP;
      for (let i = 0; i < N + 10; i++) {
        const s = ((i + flow) / (N + 10)) * e;
        if (s > e) continue;
        const p = tendrilPath(T, t, tgt, s);
        const along = s / total, tip = clamp((e - s) / 0.25);
        const size = (3.6 - 2.3 * along) * T.thick * (0.55 + 0.45 * tip) * (s > 1 ? 0.8 : 1);
        const a = 0.62 * smooth(0, 0.12, s) * (0.5 + 0.5 * tip) * (t > T.b.g.release ? 1 - smooth(0.3, 1.3, t - T.b.g.release) * 0.6 : 1);
        const h = hash2(i, T.k + 3 * T.b.j, 21);
        mist.add(p.x + (h - 0.5) * 0.8, p.y + (hash2(i, T.k, 22) - 0.5) * 0.8, 2.4 + i * 0.002, size * (0.85 + 0.3 * h),
          h * 6.28 + t * (0.3 + h * 0.4) * (h < 0.5 ? -1 : 1), a, Math.floor(h * 4), 1.15, MIST[0], MIST[1], MIST[2]);
        // a darker core gives it body: something, not smoke
        if (i % 2 === 0) mist.add(p.x, p.y, 2.45 + i * 0.002, size * 0.62, h * 6.28 - t * 0.5, a * 0.45, (Math.floor(h * 4) + 1) % 4, 1.3, CORE[0], CORE[1], CORE[2]);
      }
    }
    // the tendril's grip shows at the body: a denser knot round it while held
    for (const b of bodies) {
      const g = b.g, held = smooth(g.reach, g.wrap, t) * (1 - smooth(g.release, g.release + 0.4, t));
      if (held <= 0) continue;
      const p = b.now, r = b.kind === 'moon' ? 4 : 1.5;
      for (let i = 0; i < (b.kind === 'moon' ? 10 : 4); i++) {
        const a = i * 2.4 + t * 0.9 * (i % 2 ? 1 : -1);
        mist.add(p.x + Math.cos(a) * r, p.y + Math.sin(a) * r, 2.6, b.kind === 'moon' ? 3.6 : 1.8, a, 0.28 * held, i % 4, 1.2, MIST[0], MIST[1], MIST[2]);
      }
    }

    // the real Gloam: wisps foreshadowed in panel 2, its body boiling in panel 3
    ambientMist(t, mist, out);

    // impacts: a flash, sparks, dust; the ground shakes
    for (const I of imp) {
      const dt = t - I.t;
      if (dt < 0 || dt > 3) continue;
      const big = I.moon;
      const flash = Math.exp(-dt * (big ? 2.6 : 3.4));
      out.lights.push({ x: I.x, y: I.y + 2, z: 4, R: big ? 22 : 15, c: [3.2 * flash, 1.9 * flash, 0.9 * flash], w: flash * (big ? 3 : 2) });
      glow.add(I.x, I.y + 1, 2.5, (big ? 12 : 7) * (0.5 + dt * 0.8), 0, flash * 0.55, 0, 1, 1.4, 0.8, 0.35);
      for (let k = 0; k < (big ? 22 : 12); k++) {
        const h1 = hash2(k, I.x, 1), h2 = hash2(k, I.x, 2);
        const a = Math.PI * (0.1 + 0.8 * h1), v = (big ? 16 : 10) * (0.4 + 0.6 * h2), life = 0.6 + 0.6 * h2;
        if (dt > life) continue;
        const x = I.x + Math.cos(a) * v * dt, y = I.y + Math.sin(a) * v * dt - 18 * dt * dt;
        const f = 1 - dt / life;
        glow.add(x, y, 2.6, 0.9, 0, f, 0, 1, 2.0, 1.1, 0.35);
      }
      for (let k = 0; k < (big ? 10 : 5); k++) {
        const h = hash2(k, I.x, 5), f = smooth(0, 0.3, dt) * (1 - smooth(0.8, 3, dt));
        mist.add(I.x + (h - 0.5) * 8 + (h - 0.5) * dt * 6, I.y + 1 + dt * (1.5 + h * 2), 2.3, (big ? 9 : 6) * (1 + dt * 0.6), h * 6, 0.3 * f, k % 4, 1.3, DUST[0], DUST[1], DUST[2]);
      }
      const sh = (big ? 0.55 : 0.2) * Math.exp(-dt * 5.5);
      out.shake.x += sh * Math.sin(t * 61 + I.x); out.shake.y += sh * Math.cos(t * 53 + I.x);
    }
    return out;
  }

  // slow, deterministic drifting mist
  const wisps = [];
  {
    // panel 2: a few faint wisps rising ahead of the painted swell
    for (let k = 0; k < 9; k++) wisps.push({ kind: 'rise', x: wx(1, 2 + k * 4), y: wy(2), t0: 9.4 + hash2(k, 2, 1) * 1.6, t1: 13.0, a: 0.22, s: 4.5, h: hash2(k, 2, 2) });
    // panel 3: the Gloam's body boiling over its painted self
    for (let k = 0; k < 20; k++) {
      const lxk = 1 + k * 1.75;
      wisps.push({ kind: 'boil', x: wx(2, lxk), y: info.gloamTop(lxk) - 1, t0: 12.2 + hash2(k, 3, 1) * 0.8, t1: 20.5, a: 0.3, s: 5, h: hash2(k, 3, 2) });
    }
    // panel 4: mist pours up through the cracks between the new islands
    for (let k = 0; k < 22; k++) {
      const sx = [8, 14.5, 21.5, 28, 3, 33][k % 6];
      wisps.push({ kind: 'rise', x: wx(3, sx + (hash2(k, 4, 3) - 0.5) * 4), y: wy(-2 + hash2(k, 4, 4) * 6), t0: 21.0 + hash2(k, 4, 1) * 1.6, t1: 40, a: 0.32, s: 6.5, h: hash2(k, 4, 2) });
    }
    // panel 5: a low sea of mist under the islands
    for (let k = 0; k < 16; k++) wisps.push({ kind: 'drift', x: wx(4, -4 + k * 3), y: wy(4 + (k % 4) * 4.5), t0: 0, t1: 99, a: 0.3, s: 9, h: hash2(k, 5, 2) });
  }
  function ambientMist(t, mist) {
    for (const w of wisps) {
      if (t < w.t0 || t > w.t1 + 2) continue;
      const age = t - w.t0, h = w.h;
      let x = w.x, y = w.y, a = w.a, s = w.s;
      if (w.kind === 'rise') {
        y += age * (1.2 + h); x += Math.sin(age * 0.6 + h * 6) * 1.5;
        a *= smooth(0, 1.2, age) * (1 - smooth(5, 9, age)) * (1 - smooth(w.t1, w.t1 + 2, t));
        s *= 1 + age * 0.12;
      } else if (w.kind === 'boil') {
        const swell = 1 + 0.35 * smooth(15.5, 17.5, t);
        y += Math.sin(t * 0.7 + h * 9) * 0.8 + 1.2 * swell; x += Math.sin(t * 0.4 + h * 5) * 1.2;
        a *= smooth(0, 1.5, age) * (1 - smooth(w.t1, w.t1 + 2, t));
        s *= swell;
      } else {
        x += Math.sin(t * 0.15 + h * 6) * 3 + t * 0.25; y += Math.sin(t * 0.3 + h * 4) * 0.6;
      }
      mist.add(x, y, 2.0 + h * 0.3, s, h * 6.28 + t * 0.12 * (h < 0.5 ? -1 : 1), a, Math.floor(h * 4), 1.6, MIST[0], MIST[1], MIST[2]);
    }
  }

  // ------------------------------------------------------------ sound cues
  const cues = [];
  {
    // a soft chime for each star the lantern finds in panel 1
    const seen = new Set();
    for (let t = 1.2; t < 7.5; t += 0.05) {
      const Lt = lantern(t);
      info.p1stars.forEach((s, k) => {
        if (seen.has(k) || seen.size > 9) return;
        if (Math.hypot(s.x - Lt.x, (s.y - Lt.y) * 0.6) < 7 && hash2(k, 0, 88) < 0.7) { seen.add(k); cues.push({ t, kind: 'chime', k: seen.size }); }
      });
    }
    cues.push({ t: 8.6, kind: 'gloam' });
    for (const b of bodies) {
      cues.push({ t: b.g.wrap - 0.2, kind: 'grip', moon: b.kind === 'moon' });
      cues.push({ t: b.g.release, kind: 'fall', moon: b.kind === 'moon', dur: b.g.flight });
    }
    for (const I of imp) cues.push({ t: I.t, kind: 'impact', moon: I.moon });
    cues.push({ t: 17.2, kind: 'rumble' });
    for (const I of imp) for (let r = 0; r < 3; r++) cues.push({ t: I.t + (I.moon ? 1.6 : 1.9) + r * 0.33 + 0.1, kind: 'stone', r });
    cues.push({ t: 28.4, kind: 'lantern' });
    cues.sort((a, b) => a.t - b.t);
  }

  return { frame, lantern, cues, bodies, tileCount: bodies.reduce((n, b) => n + b.cells.length, 0) };
}
