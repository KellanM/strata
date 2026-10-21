// The sequence as pure functions of time t (seconds), so any frame can be
// rendered exactly (?t=17.2&still) and a skip or replay never drifts.
import { hash2, ground, MOUTH } from './mural.js?v=3';
import * as THREE from 'three';

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
    [0, 6], [1.8, 10], [7.6, 46], [9.6, 72], [11.8, 90], [13.6, 97], [15.2, 118], [17.2, 124], [19.4, 128], [21.0, 134],
    [22.8, 166], [25.4, 175], [27.2, 182], [29.6, 214], [31.2, L.x], [END, L.x],
  ]);
  const ly = track([
    [0, 52], [4, 57], [7.6, 54], [9.6, 50], [11.8, 48], [13.6, 52], [15.2, 60], [17.4, 70], [19.4, 66], [21.0, 56],
    [22.8, 43], [27.2, 41], [29.6, 45], [31.2, L.y], [END, L.y],
  ]);
  const lr = track([[0, 27], [7.4, 27], [9.6, 23], [23.5, 23], [25, 26], [28.5, 26], [29.6, 23], [31.2, 19], [33.2, 9], [END, 8.5]]);
  const lantern = (t) => {
    const walking = 1 - smooth(30.8, 31.4, t);
    const bob = Math.sin(t * 4.2) * 0.35 * walking, sway = Math.sin(t * 2.1 + 1) * 0.5 * walking;
    // the Gloam presses on the flame while it works
    // and holds its breath with it before the strike
    const gutter = smooth(15.5, 16.6, t) * (1 - smooth(21.5, 23, t)) * (1 + 0.5 * smooth(16.3, 16.9, t) * (1 - smooth(17.1, 17.4, t)));
    const fl = 1 + (0.06 + 0.16 * gutter) * Math.sin(t * 13.1) + (0.05 + 0.12 * gutter) * Math.sin(t * 7.3 + 1) + 0.04 * Math.sin(t * 23.7 + 2)
      + 0.05 * Math.sin(t * 31.3 + Math.sin(t * 3.1) * 4);
    const ignite = smooth(0.2, 1.8, t) * (1 + 0.5 * Math.exp(-Math.pow((t - 1.0) / 0.25, 2)));
    return { x: lx(t) + sway + 0.12 * Math.sin(t * 17.0), y: ly(t) + bob + 0.1 * Math.sin(t * 19.0), z: 5, R: lr(t) * (1 + 0.03 * Math.sin(t * 9.1)), I: ignite * fl * Math.max(0.25, 1 - 0.42 * gutter) * (t < 8 ? 1.12 : 1) };
  };

  // ------------------------------------------------------------ the camera
  const cx = track([[0, 24], [7.0, 36], [9.6, 76], [13.4, 94], [15.4, 124], [21.0, 128], [22.8, 172], [27.0, 178], [29.8, 222], [END, L.x]]);
  const cy = track([[0, 56], [15.4, 57], [21.0, 56], [29.8, 55], [END, L.y + 7]]);
  const cd = track([[0, 1.03], [6, 1.0], [15.4, 1.0], [19.0, 0.95], [21.0, 0.98], [22.8, 1.0], [29.8, 1.0], [33.5, 0.86], [END, 0.84]]);

  // ------------------------------------------------------------ the bodies (C)
  const bodies = info.bodies, imp = info.impacts;
  const moon = bodies.find((b) => b.kind === 'moon');
  const field = bodies.filter((b) => b.kind === 'star' && !b.border), border = bodies.filter((b) => b.border);
  // where each lands: two stars and the moon on D's ground; the sky band's stars far off in E
  const far = [{ x: 204, y: ground(204) + 1 }, { x: 218, y: ground(218) + 1 }, { x: 232, y: 26 }, { x: 244, y: ground(244) + 1 }];
  // they seep out of the fissure, rise a little, go still... and strike together
  const plan = (b, c0, strike, target, flight, impactT) => {
    const release = impactT - flight, reach = strike + 0.3;
    b.g = { c0, strike, reach, wrap: reach + 0.55, tug: reach + 0.9, release, impact: impactT, flight };
    b.target = target;
  };
  plan(moon, 15.0, 17.15, imp[1], 1.9, imp[1].t);
  plan(field[0], 15.25, 17.2, imp[0], 1.6, imp[0].t);
  plan(field[1], 15.4, 17.22, imp[2], 1.6, imp[2].t);
  border.forEach((b, k) => plan(b, 15.1 + k * 0.15, 17.18 + k * 0.03, far[k], 2.6, 23.2 + k * 0.32));
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
      const rc = info.crack.filter((c) => c.region === 2).reduce((best, c) => (Math.abs(c.x - rx) < Math.abs(best.x - rx) ? c : best));
      tendrils.push({
        b, k, root: { x: rc.x, y: rc.y },
        bend: (hash2(b.j, k, 9) < 0.5 ? -1 : 1) * (7 + 8 * hash2(b.j, k, 10)),
        ph: hash2(b.j, k, 11) * 6.28, wrapR: b.kind === 'moon' ? 5.6 + k * 0.4 : 1.65,
        squash: b.kind === 'moon' ? 0.5 + 0.1 * k : 0.8, tilt: b.kind === 'moon' ? [-0.7, 0.35, 1.3][k] : (hash2(b.j, 4, 4) - 0.5) * 1.6,
        dir: (k + b.j) % 2 ? -1 : 1, w0: b.kind === 'moon' ? 0.85 : 0.6, delay: k * 0.12,
        a0: b.kind === 'moon' ? [-2.5, -1.57, -0.6][k] : -1.57 + (hash2(b.j, 2, 12) - 0.5) * 1.2,
      });
    }
  }
  const WRAP = 1.25;
  function reachOf(T, t) {
    const g = T.b.g, c0 = g.c0 + T.delay;
    if (t < c0) return 0;
    const up = 0.3 + 0.04 * (T.k % 2);
    if (t < c0 + 1.4) return up * easeOut((t - c0) / 1.4);                                   // it seeps out and rises
    if (t < g.strike + T.delay * 0.3) return up + 0.012 * Math.sin(t * 29 + T.ph);         // still, coiled to strike
    if (t < g.reach) return up + (1 - up) * easeOut((t - g.strike - T.delay * 0.3) / 0.28);  // the lunge
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
      if (f > 0.12 && f < 0.9) w *= 1 + 0.45 * barb;
      w *= 1 + 0.8 * Math.max(0, 1 - f * 6);   // the root flares into the mass
      p.w = w;
    }
    return pts;
  }

  // ------------------------------------------------------------ per-frame output
  const DARK = [0.035, 0.04, 0.055];   // the Gloam's smoke: it eats light
  const DUST = [0.09, 0.07, 0.06];

  // the tiles, in a fixed order: every body's cells, then chips of rock torn from the fissure's lips
  const tileSpecs = [];
  const GOLD = new THREE.Color(0xf0c050), ROCK = new THREE.Color(0x7d6e5e);
  for (const b of bodies) {
    const g = b.g, span = g.release - g.tug;
    for (const [dx, dy] of b.cells) {
      const sp = { b, dx, dy, color: GOLD, metal: 1 };
      if (b.kind === 'moon') {
        // it cracks as it's squeezed, along three lines, one per jerk; gold flakes off its rim
        const lines = [[0.6, 0.8, 0.5], [-0.8, 0.5, -1], [0.95, -0.3, 1.6]];
        lines.forEach(([a, c, o], k) => { if (Math.abs(dx * a + dy * c + o) < 0.55 && sp.crackT === undefined) sp.crackT = g.tug + JERKS[k] * span + 0.03 + Math.hypot(dx, dy) * 0.03; });
        const h = hash2(dx + 20, dy + 20, 77);
        if (Math.hypot(dx, dy) > 3.3 && h < 0.45) sp.flake = g.tug + 0.15 + h / 0.45 * (span - 0.5);
      }
      tileSpecs.push(sp);
    }
  }
  for (const L of info.lips) if ((L.region === 1 || L.region === 2) && hash2(L.x, L.y, 91) < (L.region === 1 ? 0.5 : 0.18) && tileSpecs.length < 200) {
    tileSpecs.push({ chip: L, color: ROCK, metal: 0, vx: (hash2(L.x, L.y, 92) - 0.5) * 6, vy: 1 + hash2(L.x, L.y, 93) * 3 });
  }
  const pulseAt = (s, t) => Math.pow(0.5 + 0.5 * Math.sin(s * 9 - t * 5), 6) * (0.4 + 0.6 * heart(t));
  // a heartbeat under the drag: lub-dub
  function heart(t) {
    if (t < 17.4 || t > 23) return 0.3;
    const p = (t - 17.4) % 0.92;
    return 0.3 + 0.7 * (Math.exp(-p * 14) + 0.6 * Math.exp(-Math.abs(p - 0.24) * 14));
  }
  const breath = (t, x) => 0.62 + 0.38 * Math.sin(t * 1.6 - x * 0.15);
  const COLD = [0.35, 0.62, 0.95];

  function frame(t, mist, glow, field) {
    const out = { lights: [], tiles: [], shake: { x: 0, y: 0 } };
    out.lantern = lantern(t);
    // the cave is warm and golden long ago, cold once the Gloam is in it
    const cool = smooth(7.6, 10.4, t);
    out.amb = [0.05 * (1 - cool) + 0.010 * cool, 0.034 * (1 - cool) + 0.011 * cool, 0.012 * (1 - cool) + 0.018 * cool];
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

    for (const sp of tileSpecs) {
      if (sp.chip) {
        const L = sp.chip, dt = t - L.t;
        if (dt < 0 || dt > 1.3) { out.tiles.push(null); continue; }
        out.tiles.push({ x: L.x + sp.vx * dt, y: L.y + sp.vy * dt - 16 * dt * dt, z: mural.zAt(L.x, L.y) + 0.4 + dt * 2.5, heat: 0, rnd: hash2(L.x, L.y, 9) });
        continue;
      }
      const b = sp.b, p = b.now;
      if (!p.on) { out.tiles.push(null); continue; }
      if (sp.flake !== undefined && t > sp.flake && t < b.g.release) {
        const dt = t - sp.flake;
        if (dt > 1.4) { out.tiles.push(null); continue; }
        const q = bodyAt(b, sp.flake), h = hash2(sp.dx + 30, sp.dy + 30, 5);
        out.tiles.push({ x: q.x + sp.dx + sp.dx * 0.6 * dt, y: q.y + sp.dy + (0.5 + h) * 2 * dt - 14 * dt * dt, z: q.z + 0.3 + dt, heat: 0, rnd: h });
        continue;
      }
      if (sp.flake !== undefined && t > sp.flake && t >= b.g.release) { out.tiles.push(null); continue; }
      out.tiles.push({ x: p.x + sp.dx, y: p.y + sp.dy, z: p.z, heat: p.heat, rnd: hash2(sp.dx + 9, sp.dy + 9, b.j) });
    }

    // the fissure breathes a cold light from somewhere else; where it has torn open, more
    const camX = out.cam.x;
    if (field) {
      field.begin(camX - 30, camX + 30);
      for (const c of info.crack) {
        if (!field.inRange(c.x)) continue;
        const br = breath(t, c.x);
        let v = 0.07;
        if (c.region === 1) v = 0.07 + 0.85 * smooth(9.2, 10.2, t) * Math.max(0.06, 1.2 - Math.hypot(c.x - MOUTH.x, c.y - MOUTH.y) / 22);
        else if (c.region === 2) v = 0.12 + 0.55 * smooth(14.4, 15.2, t);
        else if (c.region === 3) v = 0.18;
        else if (c.region === 4) v = 0.38;
        field.glow(c.x, c.y, v * br);
      }
      for (const L of info.lips) if (t > L.t && field.inRange(L.x)) field.glow(L.x, L.y, 0.45 * breath(t, L.x) * smooth(L.t, L.t + 0.4, t) * (L.region === 1 ? 1 : 0.7));
    }
    {
      const open = smooth(9.2, 10.0, t) * breath(t, MOUTH.x);
      if (open > 0.01) out.lights.push({ x: MOUTH.x, y: MOUTH.y, z: 3, R: 15, c: COLD.map((v) => v * open * 0.9), w: open * 0.8 });
      const cOpen = smooth(14.4, 15.2, t) * (1 - smooth(22, 24, t)) * breath(t, 127);
      if (cOpen > 0.01) out.lights.push({ x: 127, y: 44, z: 3, R: 20, c: COLD.map((v) => v * cOpen * 0.35), w: cOpen * 0.7 });
      const eOpen = breath(t, 224) * smooth(27, 29, t);
      if (eOpen > 0.01) out.lights.push({ x: 222, y: 24, z: 3, R: 13, c: COLD.map((v) => v * eOpen * 0.4), w: eOpen * 0.3 });
    }

    // the tendrils
    for (const T of tendrils) {
      const e = reachOf(T, t);
      if (e <= 0.01) continue;
      const g = T.b.g, after = t >= g.release;
      const tgt = after ? { x: T.b.home.x + T.b.drag.x, y: T.b.home.y + T.b.drag.y } : T.b.now;
      const pts = tendrilPoints(T, t, tgt, e, t < g.reach);
      const a = smooth(g.c0 + T.delay, g.c0 + T.delay + 0.3, t) * (after ? 1 - smooth(0.35, 0.65, t - g.release) : 1);
      if (field && a > 0.02) {
        // the body, raised out of the stone on the voxel grid
        if (a > 0.5) field.path(pts, pulseAt, t);
        else field.path(pts.map((p) => ({ ...p, w: p.w * (a / 0.5) })), pulseAt, t);
        // thorns that grow out of it in the grid, and veins of rot branching through the paint
        for (let i = 3; i < pts.length - 3; i += 4) {
          const p = pts[i], q = pts[i + 1], h = hash2(i, T.k + 5 * T.b.j, 31);
          const ang = Math.atan2(q.y - p.y, q.x - p.x), side = (i >> 2) % 2 ? 1 : -1;
          const nx = -Math.sin(ang) * side, ny = Math.cos(ang) * side;
          field.cell(p.x + nx * (p.w + 1), p.y + ny * (p.w + 1), a, 0);
          field.cell(p.x + nx * (p.w + 1.8) - Math.cos(ang) * 0.9, p.y + ny * (p.w + 1.8) - Math.sin(ang) * 0.9, a, 0);
          if (h < 0.55 && p.s < 1) {
            const grow = clamp((t - (g.c0 + T.delay + 0.5 + p.s * 1.5)) / 1.6) * a;
            let vx = p.x, vy = p.y, va = ang + side * (1.0 + 0.5 * h);
            const len = Math.round((3 + 6 * h) * grow);
            for (let k = 0; k < len; k++) {
              va += (hash2(i * 7 + k, T.k, 33) - 0.5) * 0.9;
              vx += Math.cos(va); vy += Math.sin(va);
              field.cell(vx, vy, a * 0.9, 0);
              if (k === Math.floor(len / 2)) {   // a fork
                let fx = vx, fy = vy, fa = va - side * 0.9;
                for (let j = 0; j < len / 2; j++) { fa += (hash2(j, i, 34) - 0.5) * 0.8; fx += Math.cos(fa); fy += Math.sin(fa); field.cell(fx, fy, a * 0.8, 0); }
              }
            }
          }
        }
        // smoke, faint, rising off it
        for (let i = 6; i < pts.length; i += 12) {
          const p = pts[i], h = hash2(i, T.k + 3 * T.b.j, 21), age = (t * 0.6 + h) % 1;
          mist.add(p.x + (h - 0.5) * 2, p.y + age * 4, 2.4, 2.5 + age * 3, h * 6.28 + t * 0.4, 0.16 * a * Math.sin(age * Math.PI), Math.floor(h * 4), 1.2, DARK[0], DARK[1], DARK[2]);
        }
      }
    }
    // the scars: wherever a tendril has reached, the paint is dead, and stays dead
    if (field) for (const T of tendrils) {
      const g = T.b.g;
      if (t < g.c0) continue;
      const emax = t < g.release ? reachOf(T, t) : 1 + WRAP;
      const tgt = t < g.release ? T.b.now : { x: T.b.home.x + T.b.drag.x, y: T.b.home.y + T.b.drag.y };
      const pts = tendrilPoints(T, t < g.release ? t : g.release, tgt, Math.min(emax, 1), false);
      for (let i = 1; i < pts.length; i += 2) field.kill(pts[i].x, pts[i].y, pts[i].w + 0.4);
    }
    if (field) {
      // the flame shrinks from the dark that comes near it
      const L0 = out.lantern, near = clamp(field.countNear(L0.x, L0.y, L0.R) / 260);
      L0.I *= 1 - 0.3 * near; L0.R *= 1 - 0.18 * near;
      field.commit();
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
    for (let k = 0; k < 12; k++) wisps.push({ kind: 'creep', x: MOUTH.x + (hash2(k, 2, 3) - 0.5) * 4, y: MOUTH.y + (hash2(k, 2, 4) - 0.5) * 3, t0: 9.4 + hash2(k, 2, 1) * 2.6, t1: 16.5, a: 0.3, s: 4, h: hash2(k, 2, 2) });
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
    cues.push({ t: 9.2, kind: 'crack' });
    cues.push({ t: 9.6, kind: 'gloam' });
    cues.push({ t: 16.3, kind: 'hush' });
    cues.push({ t: 17.15, kind: 'strike' });
    for (let tb = 17.4; tb < 22.6; tb += 0.92) cues.push({ t: tb, kind: 'heart' });
    for (const b of bodies) {
      const moonish = b.kind === 'moon';
      cues.push({ t: b.g.wrap - 0.2, kind: 'grip', moon: moonish });
      if (!b.border) for (const j of JERKS) cues.push({ t: b.g.tug + j * (b.g.release - b.g.tug), kind: 'yank', moon: moonish });
      cues.push({ t: b.g.release, kind: 'fall', moon: moonish, dur: b.g.flight });
      cues.push({ t: b.g.release - 0.05, kind: 'tear', k: b.j });
    }
    for (const I of imp) cues.push({ t: I.t, kind: 'impact', moon: I.moon });
    cues.push({ t: 20.5, kind: 'rumble' });
    for (const I of imp) for (let r = 0; r < 4; r++) cues.push({ t: I.t + (I.moon ? 1.5 : 1.8) + r * 0.4 + 0.1, kind: 'stone', r });
    cues.push({ t: 31.3, kind: 'lantern' });
    cues.sort((a, b) => a.t - b.t);
  }

  return { frame, lantern, cues, bodies, tileSpecs, tileCount: tileSpecs.length };
}
