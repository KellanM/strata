// The sequence as pure functions of time t (seconds), so any frame can be
// rendered exactly (?t=17.2&still) and a skip or replay never drifts.
import { hash2, ground } from './mural.js';

export const END = 35.6;   // the fade is complete
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const smooth = (a, b, v) => { const x = clamp((v - a) / (b - a)); return x * x * (3 - 2 * x); };
const easeOut = (u) => 1 - Math.pow(1 - clamp(u), 3);
const easeIn = (u) => Math.pow(clamp(u), 2.2);

// monotone cubic through timed keys: smooth, never overshoots, can come to rest
export function track(keys) {
  const n = keys.length, t = keys.map((k) => k[0]), v = keys.map((k) => k[1]);
  const d = [], m = new Array(n).fill(0);
  for (let i = 0; i < n - 1; i++) d.push((v[i + 1] - v[i]) / (t[i + 1] - t[i]));
  for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
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

// the yank: a jerk, a give, a harder jerk, a straining hold, then it tears loose
function yank(u) {
  if (u < 0.12) return 0.14 * easeOut(u / 0.12);
  if (u < 0.3) return 0.14 - 0.05 * smooth(0.12, 0.3, u);
  if (u < 0.4) return 0.09 + 0.3 * easeOut((u - 0.3) / 0.1);
  if (u < 0.72) return 0.39 + 0.05 * smooth(0.4, 0.72, u);
  return 0.44 + 0.56 * easeIn((u - 0.72) / 0.28);
}
const JERKS = [0, 0.3, 0.72];

export function makeStory(info, mural) {
  const S = info.sc, L = info.lantern;

  // ------------------------------------------------------------ the lantern
  const lx = track([
    [0, 6], [1.8, 10], [7.6, 46], [9.6, 66], [13.6, 92], [15.2, 118], [17.2, 124], [19.4, 128], [21.0, 134],
    [22.8, 166], [25.4, 175], [27.2, 182], [29.6, 214], [31.2, L.x], [END, L.x],
  ]);
  const ly = track([
    [0, 52], [4, 57], [7.6, 52], [9.6, 50], [13.6, 56], [15.2, 60], [17.4, 70], [19.4, 66], [21.0, 56],
    [22.8, 44], [27.2, 43], [29.6, 46], [31.2, L.y], [END, L.y],
  ]);
  const lr = track([[0, 23], [29.6, 23], [31.2, 19], [33.2, 9], [END, 8.5]]);
  const lantern = (t) => {
    const walking = 1 - smooth(30.8, 31.4, t);
    const bob = Math.sin(t * 4.2) * 0.35 * walking, sway = Math.sin(t * 2.1 + 1) * 0.5 * walking;
    // the Gloam presses on the flame while it works
    const gutter = smooth(15.5, 17.5, t) * (1 - smooth(21.5, 23, t));
    const fl = 1 + (0.06 + 0.16 * gutter) * Math.sin(t * 13.1) + (0.05 + 0.12 * gutter) * Math.sin(t * 7.3 + 1) + 0.04 * Math.sin(t * 23.7 + 2)
      + 0.05 * Math.sin(t * 31.3 + Math.sin(t * 3.1) * 4);
    const ignite = smooth(0.2, 1.8, t) * (1 + 0.5 * Math.exp(-Math.pow((t - 1.0) / 0.25, 2)));
    return { x: lx(t) + sway + 0.12 * Math.sin(t * 17.0), y: ly(t) + bob + 0.1 * Math.sin(t * 19.0), z: 5, R: lr(t) * (1 + 0.03 * Math.sin(t * 9.1)), I: ignite * fl * (1 - 0.42 * gutter) };
  };

  // ------------------------------------------------------------ the camera
  const cx = track([[0, 24], [7.0, 36], [9.6, 72], [13.4, 86], [15.4, 124], [21.0, 128], [22.8, 172], [27.0, 178], [29.8, 222], [END, L.x]]);
  const cy = track([[0, 56], [15.4, 57], [21.0, 56], [29.8, 55], [END, L.y + 7]]);
  const cd = track([[0, 1.03], [6, 1.0], [15.4, 1.0], [19.0, 0.95], [21.0, 0.98], [22.8, 1.0], [29.8, 1.0], [33.5, 0.86], [END, 0.84]]);

  // ------------------------------------------------------------ the bodies (C)
  const bodies = info.bodies, imp = info.impacts;
  const moon = bodies.find((b) => b.kind === 'moon');
  const field = bodies.filter((b) => b.kind === 'star' && !b.border), border = bodies.filter((b) => b.border);
  // where each lands: two stars and the moon on D's ground; the sky band's stars far off in E
  const far = [{ x: 204, y: ground(204) + 1 }, { x: 218, y: ground(218) + 1 }, { x: 232, y: 26 }, { x: 244, y: ground(244) + 1 }];
  const plan = (b, c0, target, flight, impactT) => {
    const release = impactT - flight;
    b.g = { c0, reach: c0 + 2.2, wrap: c0 + 2.9, tug: c0 + 3.3, release, impact: impactT, flight };
    b.target = target;
  };
  plan(moon, 15.0, imp[1], 1.9, imp[1].t);
  plan(field[0], 15.4, imp[0], 1.6, imp[0].t);
  plan(field[1], 15.7, imp[2], 1.6, imp[2].t);
  border.forEach((b, k) => plan(b, 15.2 + k * 0.22, far[k], 2.6, 23.2 + k * 0.32));
  for (const b of bodies) {
    const root = info.gloamTop(b.home.x);
    const fall = (b.home.y - root) * (b.kind === 'moon' ? 0.5 : 0.55);
    b.drag = { x: b.kind === 'moon' ? 2 : (hash2(b.j, 3, 3) - 0.5) * 4, y: -fall };
    b.zWall = Math.max(...b.cells.map(([dx, dy]) => mural.zAt(b.home.x + dx, b.home.y + dy))) + 0.15;
  }

  function bodyAt(b, t) {
    const g = b.g, H = b.home, zWall = b.zWall;
    if (t < g.tug) {
      // gripped: it trembles in the coil
      const shiver = smooth(g.reach, g.wrap, t) * 0.16;
      return { x: H.x + shiver * Math.sin(t * 37 + b.j), y: H.y + shiver * Math.cos(t * 41 + b.j), z: zWall, heat: 0, on: true, phase: 0 };
    }
    if (t < g.release) {
      const u = clamp((t - g.tug) / (g.release - g.tug)), e = yank(u);
      const strain = 0.22 * (u > 0.4 && u < 0.72 ? 1 : 0.4);
      return { x: H.x + b.drag.x * e + strain * Math.sin(t * 47 + b.j), y: H.y + b.drag.y * e + strain * Math.cos(t * 39), z: zWall + 0.1, heat: smooth(0.8, 1, u) * 0.6, on: true, phase: 1, u };
    }
    if (t < g.impact) return { ...meteorAt(b, t), on: true, phase: 2 };
    return { x: b.target.x, y: b.target.y, z: 1, heat: 0, on: false, phase: 3 };
  }
  // the fall: an accelerating arc from where the Gloam let go to the ground
  function meteorPoint(b, u) {
    const P0 = { x: b.home.x + b.drag.x, y: b.home.y + b.drag.y }, P3 = b.target;
    const dx = P3.x - P0.x;
    const P1 = { x: P0.x + dx * 0.25, y: P0.y + 3 }, P2 = { x: P3.x - dx * 0.3, y: P3.y + Math.max(10, (P0.y - P3.y) * 0.6) };
    const k = 1 - u;
    return {
      x: k * k * k * P0.x + 3 * k * k * u * P1.x + 3 * k * u * u * P2.x + u * u * u * P3.x,
      y: k * k * k * P0.y + 3 * k * k * u * P1.y + 3 * k * u * u * P2.y + u * u * u * P3.y,
    };
  }
  function meteorAt(b, t) {
    const u = Math.pow(clamp((t - b.g.release) / b.g.flight), 1.45), p = meteorPoint(b, u);
    return { x: p.x, y: p.y, z: 3.6, heat: 0.6 + 0.4 * smooth(0, 0.2, u), u };
  }

  // ------------------------------------------------------------ the tendrils
  const tendrils = [];
  for (const b of bodies) {
    const n = b.kind === 'moon' ? 3 : 1;
    for (let k = 0; k < n; k++) {
      const off = b.kind === 'moon' ? (k - 1) * 11 : (hash2(b.j, 1, 7) - 0.5) * 14;
      const rx = clamp(b.home.x + off, 106, 148);
      tendrils.push({
        b, k, root: { x: rx, y: info.gloamTop(rx) - 0.6 },
        bend: (hash2(b.j, k, 9) < 0.5 ? -1 : 1) * (7 + 8 * hash2(b.j, k, 10)),
        ph: hash2(b.j, k, 11) * 6.28, wrapR: b.kind === 'moon' ? 5.6 + k * 0.4 : 1.65,
        squash: b.kind === 'moon' ? 0.5 + 0.1 * k : 0.8, tilt: b.kind === 'moon' ? [-0.7, 0.35, 1.3][k] : (hash2(b.j, 4, 4) - 0.5) * 1.6,
        dir: (k + b.j) % 2 ? -1 : 1, w0: b.kind === 'moon' ? 1.35 : 0.95, delay: k * 0.3,
        a0: b.kind === 'moon' ? [-2.5, -1.57, -0.6][k] : -1.57 + (hash2(b.j, 2, 12) - 0.5) * 1.2,
      });
    }
  }
  const WRAP = 1.25;
  function reachOf(T, t) {
    const g = T.b.g, c0 = g.c0 + T.delay;
    if (t < c0) return 0;
    if (t < g.reach) {
      // it reaches in lunges, recoiling a little between them, feeling for the light
      const u = (t - c0) / (g.reach - c0);
      return clamp(easeOut(u) - 0.11 * Math.pow(Math.sin(u * Math.PI * 3), 2) * (1 - u));
    }
    if (t < g.release) return 1 + WRAP * easeOut((t - g.reach) / (g.wrap - g.reach));
    return (1 + WRAP) * (1 - easeIn((t - g.release) / 0.65));   // it lets go and whips back down
  }
  // points along the tendril, root first: x, y, half-width, path s
  function tendrilPoints(T, t, target, e, reaching) {
    const R = T.root, wr = T.wrapR * (1 - 0.15 * smooth(T.b.g.tug, T.b.g.tug + 0.5, t));   // it squeezes
    // the coil: a tilted, tightening spiral, so several cross over the body like a grip
    const coil = (s) => {
      const a = T.a0 + (s - 1) * Math.PI * 2 * T.dir, r = wr * (1 - 0.45 * clamp((s - 1) / WRAP));
      const lx = Math.cos(a) * r, ly = Math.sin(a) * r * T.squash, c = Math.cos(T.tilt), sn = Math.sin(T.tilt);
      return { x: target.x + lx * c - ly * sn, y: target.y + lx * sn + ly * c };
    };
    const E = coil(1);
    const P1 = { x: R.x + T.bend, y: R.y + 12 }, P2 = { x: E.x - T.bend * 1.4, y: E.y - 10 };
    const pts = [], N = 56;
    const total = Math.max(e, 0.001);
    const hookStart = reaching ? Math.max(0, e - 0.22) : (e > 1 ? Math.max(1, e - 0.18) : e);
    for (let i = 0; i <= N; i++) {
      const s = (i / N) * total;
      let x, y;
      if (s <= 1) {
        const k = 1 - s;
        x = k * k * k * R.x + 3 * k * k * s * P1.x + 3 * k * s * s * P2.x + s * s * s * E.x;
        y = k * k * k * R.y + 3 * k * k * s * P1.y + 3 * k * s * s * P2.y + s * s * s * E.y;
        // searching: the far end sways more while it hunts
        const sw = (reaching ? 1.0 + 2.4 * s * s : 1.0) * Math.sin(s * 7 - t * 2.6 + T.ph) * Math.sin(Math.PI * Math.min(s, 1));
        x += sw; y += sw * 0.25;
      } else {
        ({ x, y } = coil(s));
      }
      pts.push({ x, y, s });
    }
    // the hooked tip: the last stretch curls hard, like a claw
    const iH = Math.round((hookStart / total) * N);
    if (iH < N - 1 && iH > 1) {
      const p = pts[iH], q = pts[iH - 1];
      let th = Math.atan2(p.y - q.y, p.x - q.x);
      const seg = Math.hypot(p.x - q.x, p.y - q.y) || 0.3;
      const curl = (reaching ? 2.6 : 2.2) * (T.dir || 1) * (reaching ? (T.bend > 0 ? -1 : 1) : 1);
      let x = p.x, y = p.y;
      for (let i = iH + 1; i <= N; i++) {
        const f = (i - iH) / (N - iH);
        th += curl * 2.2 * f / (N - iH);
        x += Math.cos(th) * seg * 0.9; y += Math.sin(th) * seg * 0.9;
        pts[i].x = x; pts[i].y = y;
      }
    }
    // width: thick where it leaves the Gloam, barbed along its length, a needle at the tip
    for (const p of pts) {
      const f = p.s / total;
      let w = T.w0 * Math.pow(1 - f, 0.75) + 0.05;
      if (p.s > 1) w *= 0.62;
      const barb = Math.max(0, 1 - ((p.s * 9 + T.ph) % 1) * 4);
      if (f > 0.12 && f < 0.9) w *= 1 + 0.85 * barb;
      w *= 1 + 0.9 * Math.max(0, 1 - f * 8);   // the root flares into the mass
      p.w = w;
    }
    return pts;
  }

  // ------------------------------------------------------------ per-frame output
  const DARK = [0.035, 0.04, 0.055];   // the Gloam's smoke: it eats light
  const DUST = [0.09, 0.07, 0.06];

  function frame(t, mist, glow, ribbons) {
    const out = { lights: [], tiles: [], shake: { x: 0, y: 0 } };
    out.lantern = lantern(t);
    out.cam = { x: cx(t), y: cy(t), d: cd(t) };
    out.fade = t < 0.4 ? 1 - smooth(0, 0.4, t) : smooth(33.8, END, t);

    for (const b of bodies) {
      const p = bodyAt(b, t);
      b.now = p;
      // each yank jerks the frame a little
      if (p.phase === 1) for (const j of JERKS) {
        const tj = b.g.tug + j * (b.g.release - b.g.tug), dt = t - tj;
        if (dt > 0 && dt < 0.5) { const a = (b.kind === 'moon' ? 0.35 : 0.08) * Math.exp(-dt * 9); out.shake.y -= a * Math.cos(dt * 40); }
      }
      if (!p.on) continue;
      for (const [dx, dy] of b.cells) out.tiles.push({ x: p.x + dx, y: p.y + dy, z: p.z, heat: p.heat, rnd: hash2(dx + 9, dy + 9, b.j) });
      if (p.phase === 2) {
        const big = b.kind === 'moon';
        out.lights.push({ x: p.x, y: p.y, z: 4, R: big ? 18 : 12, c: [1.8 * p.heat, 0.95 * p.heat, 0.36 * p.heat], w: p.heat * (big ? 2 : 1) });
        // a streak, not a ball: a small hot head and a long tail drawn out along the fall
        glow.add(p.x, p.y, 3.8, big ? 4.5 : 2, 0, 0.3, 0, 1, 1.2, 0.7, 0.35);
        glow.add(p.x, p.y, 3.9, big ? 1.8 : 0.9, 0, 0.9, 0, 1, 2.0, 1.6, 1.1);
        const N = big ? 40 : 34;
        let prev = p;
        for (let i = 1; i <= N; i++) {
          const uu = p.u - i * 0.011;
          if (uu < 0) break;
          const q = meteorPoint(b, uu), f = 1 - i / (N + 1);
          const ang = Math.atan2(prev.y - q.y, prev.x - q.x);
          prev = q;
          glow.add(q.x, q.y, 3.7, (big ? 1.9 : 0.85) * (0.4 + 0.6 * f), ang, f * f * 0.9, 0, 3.4, 1.3 * f + 0.2, 0.6 * f + 0.06, 0.08 + 0.1 * f);
        }
      } else if (p.heat > 0) {
        glow.add(p.x, p.y, 2.0, b.kind === 'moon' ? 9 : 3, 0, p.heat * 0.5, 0, 1, 1.0, 0.5, 0.18);
      }
    }

    // the tendrils
    for (const T of tendrils) {
      const e = reachOf(T, t);
      if (e <= 0.01) continue;
      const g = T.b.g, after = t >= g.release;
      const tgt = after ? { x: T.b.home.x + T.b.drag.x, y: T.b.home.y + T.b.drag.y } : T.b.now;
      const pts = tendrilPoints(T, t, tgt, e, t < g.reach);
      const a = smooth(g.c0 + T.delay, g.c0 + T.delay + 0.3, t) * (after ? 1 - smooth(0.35, 0.65, t - g.release) : 1);
      ribbons.add(pts, 0.95 * a, 2.6 + T.k * 0.01);
      // smoke clings to it, eating the light round it
      for (let i = 4; i < pts.length; i += 7) {
        const p = pts[i], h = hash2(i, T.k + 3 * T.b.j, 21);
        mist.add(p.x + (h - 0.5) * 1.5, p.y, 2.4, p.w * 5 + 2, h * 6.28 + t * 0.4, 0.42 * a, Math.floor(h * 4), 1.2, DARK[0], DARK[1], DARK[2]);
      }
    }

    ambientMist(t, mist);

    // impacts: a short flash, a few sparks, dark dust; the ground shakes
    for (const I of imp) {
      const dt = t - I.t;
      if (dt < 0 || dt > 3) continue;
      const big = I.moon;
      const flash = Math.exp(-dt * (big ? 3 : 4));
      out.lights.push({ x: I.x, y: I.y + 2, z: 4, R: big ? 18 : 12, c: [2.6 * flash, 1.5 * flash, 0.7 * flash], w: flash * (big ? 3 : 2) });
      glow.add(I.x, I.y + 1, 2.5, (big ? 8 : 5) * (0.5 + dt), 0, flash * 0.4, 0, 1, 1.3, 0.7, 0.3);
      for (let k = 0; k < (big ? 14 : 8); k++) {
        const h1 = hash2(k, I.x, 1), h2 = hash2(k, I.x, 2);
        const a = Math.PI * (0.15 + 0.7 * h1), v = (big ? 14 : 9) * (0.4 + 0.6 * h2), life = 0.5 + 0.5 * h2;
        if (dt > life) continue;
        const x = I.x + Math.cos(a) * v * dt, y = I.y + Math.sin(a) * v * dt - 18 * dt * dt;
        glow.add(x, y, 2.6, 0.7, 0, 1 - dt / life, 0, 1, 2.0, 1.1, 0.35);
      }
      for (let k = 0; k < (big ? 6 : 3); k++) {
        const h = hash2(k, I.x, 5), f = smooth(0, 0.3, dt) * (1 - smooth(0.8, 3, dt));
        mist.add(I.x + (h - 0.5) * 7 + (h - 0.5) * dt * 5, I.y + 1 + dt * (1.2 + h * 2), 2.3, (big ? 8 : 5) * (1 + dt * 0.5), h * 6, 0.35 * f, k % 4, 1.3, DUST[0], DUST[1], DUST[2]);
      }
      const sh = (big ? 0.5 : 0.18) * Math.exp(-dt * 5.5);
      out.shake.x += sh * Math.sin(t * 61 + I.x); out.shake.y += sh * Math.cos(t * 53 + I.x);
    }
    return out;
  }

  // slow, deterministic drifting smoke of the Gloam
  const wisps = [];
  {
    // B: dark smoke creeps along the ground ahead of the painted swell
    for (let k = 0; k < 12; k++) wisps.push({ kind: 'creep', x: 82 + k * 2.2, y: ground(82 + k * 2.2) + 2, t0: 10.2 + hash2(k, 2, 1) * 1.6, t1: 16.5, a: 0.3, s: 4.5, h: hash2(k, 2, 2) });
    // C: its body boils over its painted self
    for (let k = 0; k < 22; k++) { const x = 105 + k * 2; wisps.push({ kind: 'boil', x, y: info.gloamTop(x) - 1, t0: 13.5 + hash2(k, 3, 1) * 1.2, t1: 23, a: 0.32, s: 5, h: hash2(k, 3, 2) }); }
    // D: it pours up through the cracks between the new islands
    for (let k = 0; k < 18; k++) {
      const sx = [153, 167.5, 180.5, 195][k % 4];
      wisps.push({ kind: 'rise', x: sx + (hash2(k, 4, 3) - 0.5) * 4, y: 24 + hash2(k, 4, 4) * 6, t0: 23.8 + hash2(k, 4, 1) * 1.6, t1: 60, a: 0.28, s: 6, h: hash2(k, 4, 2) });
    }
    // E: a low drift under the islands
    for (let k = 0; k < 14; k++) wisps.push({ kind: 'drift', x: 196 + k * 4, y: 26 + (k % 3) * 3, t0: 0, t1: 99, a: 0.25, s: 8, h: hash2(k, 5, 2) });
  }
  function ambientMist(t, mist) {
    for (const w of wisps) {
      if (t < w.t0 || t > w.t1 + 2) continue;
      const age = t - w.t0, h = w.h;
      let x = w.x, y = w.y, a = w.a, s = w.s;
      if (w.kind === 'rise') {
        y += age * (1.0 + h); x += Math.sin(age * 0.6 + h * 6) * 1.5;
        a *= smooth(0, 1.2, age) * (1 - smooth(5, 9, age));
        s *= 1 + age * 0.12;
      } else if (w.kind === 'creep') {
        x += age * (0.8 + h) * (h < 0.5 ? -1 : 1); y += Math.sin(age * 0.8 + h * 9) * 0.6;
        a *= smooth(0, 1, age) * (1 - smooth(w.t1, w.t1 + 2, t));
      } else if (w.kind === 'boil') {
        const swell = 1 + 0.4 * smooth(17, 20, t);
        y += Math.sin(t * 0.7 + h * 9) * 0.8 + 1.2 * swell; x += Math.sin(t * 0.4 + h * 5) * 1.2;
        a *= smooth(0, 1.5, age) * (1 - smooth(w.t1, w.t1 + 2, t));
        s *= swell;
      } else {
        x += Math.sin(t * 0.15 + h * 6) * 3 + t * 0.2; y += Math.sin(t * 0.3 + h * 4) * 0.6;
      }
      mist.add(x, y, 2.0 + h * 0.3, s, h * 6.28 + t * 0.12 * (h < 0.5 ? -1 : 1), a, Math.floor(h * 4), 1.6, DARK[0], DARK[1], DARK[2]);
    }
  }

  // ------------------------------------------------------------ sound cues
  const cues = [];
  {
    const seen = new Set();
    for (let t = 1.2; t < 8.5; t += 0.05) {
      const Lt = lantern(t);
      info.chimeStars.forEach((s, k) => {
        if (seen.has(k) || seen.size > 9) return;
        if (Math.hypot(s.x - Lt.x, (s.y - Lt.y) * 0.6) < 7 && hash2(k, 0, 88) < 0.7) { seen.add(k); cues.push({ t, kind: 'chime', k: seen.size }); }
      });
    }
    cues.push({ t: 9.4, kind: 'gloam' });
    for (const b of bodies) {
      const moonish = b.kind === 'moon';
      cues.push({ t: b.g.wrap - 0.2, kind: 'grip', moon: moonish });
      if (!b.border) for (const j of JERKS) cues.push({ t: b.g.tug + j * (b.g.release - b.g.tug), kind: 'yank', moon: moonish });
      cues.push({ t: b.g.release, kind: 'fall', moon: moonish, dur: b.g.flight });
    }
    for (const I of imp) cues.push({ t: I.t, kind: 'impact', moon: I.moon });
    cues.push({ t: 20.5, kind: 'rumble' });
    for (const I of imp) for (let r = 0; r < 4; r++) cues.push({ t: I.t + (I.moon ? 1.5 : 1.8) + r * 0.4 + 0.1, kind: 'stone', r });
    cues.push({ t: 31.3, kind: 'lantern' });
    cues.sort((a, b) => a.t - b.t);
  }

  return { frame, lantern, cues, bodies, tileCount: bodies.reduce((n, b) => n + b.cells.length, 0) };
}
