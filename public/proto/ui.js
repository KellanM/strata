// The map's interactive layer for the prototype: stones, chapter names, the
// map head and the hero, as DOM over the world. Positions come from the
// direction's project(x, y, z), every frame, for what is in view only.
import { renderThumb } from '../js/thumbs.js';
import { recordStars } from '../js/score.js';
import { trailXAt } from './data.js';

const hex = (h) => '#' + h.toString(16).padStart(6, '0');
const lum = (h) => (0.2126 * ((h >> 16) & 255) + 0.7152 * ((h >> 8) & 255) + 0.0722 * (h & 255)) / 255;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
export const isDark = (p) => lum(p.skyTop) < 0.45;

function cube(p, size = 44) {
  const c = Math.cos(Math.PI / 6) * 0.5, h = 0.5;
  const q = (x, y) => `${(50 + x * 100).toFixed(1)},${(50 + y * 100).toFixed(1)}`;
  return `<svg class="cube" viewBox="0 0 100 100" style="width:${size}px;height:${size}px" aria-hidden="true">
    <path d="M${q(0, -h)}L${q(c, -h / 2)}L${q(0, 0)}L${q(-c, -h / 2)}Z" fill="${hex(p.top)}"/>
    <path d="M${q(-c, -h / 2)}L${q(0, 0)}L${q(0, h)}L${q(-c, h / 2)}Z" fill="${hex(p.lit)}"/>
    <path d="M${q(c, -h / 2)}L${q(0, 0)}L${q(0, h)}L${q(c, h / 2)}Z" fill="${hex(p.shade)}"/>
  </svg>`;
}

// The hero: the map's Totem (two iso blocks, one eye), now carrying a small
// gold light: the same gold as the path it leaves behind.
const ISO_X = Math.cos(Math.PI / 6);
function block(cx, topY, e, H, top, left, right) {
  const hw = ISO_X * e / 2, hh = e / 4;
  const N = [cx, topY - hh], E = [cx + hw, topY], S = [cx, topY + hh], W = [cx - hw, topY];
  const d = (pts) => 'M' + pts.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join('L') + 'Z';
  const dn = ([x, y]) => [x, y + H];
  return { svg: `<path d="${d([N, E, S, W])}" fill="${top}"/><path d="${d([W, S, dn(S), dn(W)])}" fill="${left}"/><path d="${d([E, S, dn(S), dn(E)])}" fill="${right}"/>`, W, S, H };
}
export function heroSVG(p) {
  const base = block(20, 41, 22, 11, hex(p.lit), hex(p.shade), hex(p.under));
  const head = block(20, 29, 15, 9.5, hex(p.top), hex(p.lit), hex(p.shade));
  const [wx, wy] = head.W, [sx, sy] = head.S;
  const at = (a, b) => [wx + (sx - wx) * a, wy + (sy - wy) * a + head.H * b];
  const eye = [at(0.36, 0.3), at(0.56, 0.3), at(0.56, 0.62), at(0.36, 0.62)].map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join('L');
  return `<svg viewBox="0 0 40 60" aria-hidden="true">
    <ellipse class="shadow" cx="20" cy="53.5" rx="12" ry="3.6" fill="${hex(p.under)}" fill-opacity=".2"/>
    ${base.svg}<g class="head">${head.svg}<path class="eye" d="M${eye}Z" fill="${hex(p.under)}"/></g>
    <g class="lamp"><circle cx="31" cy="9" r="7" fill="url(#lampglow)"/><path d="M31 4.6L34 9L31 13.4L28 9Z" fill="#ffe7a1"/><path d="M31 4.6L34 9L31 9Z" fill="#fff6d8"/></g>
    <defs><radialGradient id="lampglow"><stop offset="0" stop-color="#ffe7a1" stop-opacity=".9"/><stop offset="1" stop-color="#ffd77a" stop-opacity="0"/></radialGradient></defs>
  </svg>`;
}

// A shrine: a faceted gem over a slim spire, gold once its stars open it
const GOLD = { top: 0xfff2c2, lit: 0xf3c95a, shade: 0xc98d2e, under: 0x8a5a1c };
function shrineGem(p, state, size = 54) {
  const g = state === 'locked' ? p : GOLD;
  return `<svg class="cube shrine-gem" viewBox="0 0 100 120" style="width:${size}px;height:${size * 1.2}px" aria-hidden="true">
    <path d="M42 112L50 108L58 112L50 116Z" fill="${hex(p.top)}"/>
    <path d="M44 111L50 76L50 116Z" fill="${hex(p.lit)}"/><path d="M56 111L50 76L50 116Z" fill="${hex(p.shade)}"/>
    <path d="M50 14L68 42L50 51Z" fill="${hex(g.top)}"/><path d="M50 14L32 42L50 51Z" fill="${hex(g.lit)}"/>
    <path d="M32 42L50 51L50 70Z" fill="${hex(g.shade)}"/><path d="M68 42L50 51L50 70Z" fill="${hex(g.under)}"/>
  </svg>`;
}

// Today's trail (map.js): Catmull-Rom curves through the stones, dotted, solid
// where walked, in the colour of the stone it leads to. Nothing under cloud.
function segment(p0, p1, p2, p3) {
  const t = 1 / 6;
  const c1 = [p1[0] + (p2[0] - p0[0]) * t, p1[1] + (p2[1] - p0[1]) * t];
  const c2 = [p2[0] - (p3[0] - p1[0]) * t, p2[1] - (p3[1] - p1[1]) * t];
  return `M${p1[0].toFixed(1)},${p1[1].toFixed(1)}C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
}
export function trailSVG(map, W, drawFrom = null, hidden = null) {
  const cx = W / 2, t = map.trail, pts = t.map((n) => [cx + n.x, n.z]);
  let m = '';
  for (let i = 0; i < t.length - 1; i++) {
    const a = t[i], b = t[i + 1];
    if (b.region && !b.region.reached) continue;
    const walked = b.state !== 'locked' && a.state === 'solved';
    const draw = drawFrom && drawFrom.has(b) ? ' draw' : '';
    // a chapter about to be revealed: its trail is created hidden (never shown first)
    const hide = hidden && b.region && hidden.has(b.region.index) ? ' style="opacity:0"' : '';
    m += `<path d="${segment(pts[i - 1] ?? pts[i], pts[i], pts[i + 1], pts[i + 2] ?? pts[i + 1])}" class="trail${walked ? ' walked' : ''}${draw}" data-r="${b.region?.index ?? ''}" stroke="${hex(b.palette.under)}"${hide}/>`;
  }
  for (const r of map.regions) {
    if (!r.shrine || !r.reached) continue;
    const a = r.last, s = r.shrine;
    m += `<path d="M${cx + a.x},${a.z}Q${cx + (a.x + s.x) / 2},${s.z} ${cx + s.x},${s.z}" class="trail spur" stroke="${hex(a.palette.under)}"/>`;
  }
  return `<svg class="p-trail" width="${W}" height="${map.height}" viewBox="0 0 ${W} ${map.height}" aria-hidden="true">${m}</svg>`;
}

// Flow placement: everything in the page itself at its map position, once.
export function placeFlow(layer, W) {
  for (const it of layer.items) {
    it.el.style.display = '';
    it.el.style.transform = `translate(${(W / 2 + it.x).toFixed(1)}px, ${it.z.toFixed(1)}px)`;
  }
}

const STAR = '<svg viewBox="0 0 24 24"><path d="M12 2.8l2.7 5.9 6.4.7-4.8 4.3 1.4 6.3L12 16.8 6.3 20l1.4-6.3-4.8-4.3 6.4-.7z"/></svg>';
const starRow = (n) => `<span class="stars-mini" aria-label="${n} of 3 stars">${[0, 1, 2].map((k) => `<i class="${k < n ? 'on' : ''}">${STAR}</i>`).join('')}</span>`;

/** Builds the DOM for a map model into `root`. */
export function buildLayer(root, map, { onTap } = {}) {
  root.innerHTML = '';
  const items = [];   // { el, x, y, z, kind, node? }
  const add = (el, x, y, z, kind, extra = {}) => { root.appendChild(el); el.style.display = 'none'; const it = { el, x, y, z, kind, ...extra }; items.push(it); return it; };

  // the map head: the name stays tappable (the game's developer panel opens from it)
  const head = document.createElement('header');
  head.className = 'p-head';
  head.innerHTML = `<div class="in"><h1>Strata</h1><p class="sub">${map.done ? `${map.done} of ${map.total} uncovered` : `${map.total} stones to uncover`}</p></div>`;
  add(head, 0, 0, 70, 'head');

  for (const r of map.regions) {
    const el = document.createElement('div');
    const dark = isDark(r.base);
    // the name sits on whichever side the trail isn't crossing
    const left = trailXAt(map, r.labelZ) > 0;
    el.className = `p-region ${left ? 'at-left' : 'at-right'}${dark ? ' on-dark' : ''}${r.reached ? '' : ' veiled'}`;
    el.innerHTML = `<div class="in"><span class="r-num">${r.numeral}</span><span class="r-name">${esc(r.name)}</span><span class="r-sub">${r.stars} / ${r.items.length * 3} ★</span></div>`;
    add(el, left ? -172 : 172, 0, r.labelZ, 'region', { region: r });
  }
  {
    const el = document.createElement('div');
    el.className = 'p-region at-centre on-dark';
    el.innerHTML = `<div class="in"><span class="r-name">Drift</span><span class="r-sub">endless · carved at random</span></div>`;
    add(el, 0, 0, map.drift.labelZ, 'region');
  }

  for (const n of map.nodes) {
    if (n.region && !n.region.reached && n.kind !== 'bonus') continue;     // under the cloud
    const b = document.createElement('button');
    const p = n.palette;
    const dark = n.region ? isDark(n.region.base) : n.kind === 'drift';
    const side = n.kind === 'drift' ? '' : n.x > 0 ? ' lbl-left' : ' lbl-right';
    b.className = `p-node ${n.kind} ${n.state}${side}${dark ? ' on-dark' : ''}`;
    let num = '', name = '', meta = '', art = cube(p, n.kind === 'drift' ? 38 : 44);
    if (n.kind === 'learn') { num = '00'; name = 'Learn'; meta = '12 lessons'; }
    else if (n.kind === 'drift') { name = `${n.n}³`; meta = 'drift'; }
    else {
      const s = map.solved[n.entry.shape.id];
      const shape = n.entry.shape;
      if (n.kind === 'bonus') {
        num = '✦'; name = s ? shape.name : 'Shrine';
        meta = s ? starRow(recordStars(shape, s)) : n.state === 'locked' ? `${n.region.stars} / ${n.need} ★` : 'open';
        art = shrineGem(n.region.base, n.state);
      } else {
        num = String(n.entry.number).padStart(2, '0');
        name = s ? shape.name : n.state === 'locked' ? '' : '???';
        meta = s ? starRow(recordStars(shape, s)) : '';
      }
      if (s && n.kind !== 'bonus') art = `<img class="obj" alt="" src="${renderThumb(shape, p, { size: 120 })}">`;
      if (s && n.kind === 'bonus') art = `<img class="obj" alt="" src="${renderThumb(shape, p, { size: 120 })}">`;
      b.setAttribute('aria-label', n.kind === 'bonus' ? `${n.region.name} shrine${s ? `, ${shape.name}, solved` : n.state === 'locked' ? `, opens at ${n.need} stars` : ', open'}` : `Puzzle ${n.entry.number}${s ? `, ${shape.name}, solved` : n.state === 'locked' ? ', locked' : ''}`);
    }
    b.innerHTML = `<span class="pad"></span>${n.state === 'current' ? '<span class="ring"></span>' : ''}${art}
      <span class="label">${num ? `<span class="n">${num}</span>` : ''}<span class="nm">${esc(name)}</span><span class="mt">${meta}</span></span>`;
    b.addEventListener('click', () => onTap?.(n, b));
    const y = n.kind === 'bonus' ? (n.gemY ?? 60) : 0;
    add(b, n.x, y, n.z, 'node', { node: n });
    n.el = b;
  }

  const hero = document.createElement('div');
  hero.className = 'p-hero';
  hero.innerHTML = heroSVG(map.current.palette ?? map.regions[0].base);
  const heroIt = add(hero, map.current.x + (map.current.x > 0 ? 46 : -46), 0, map.current.z + 6, 'hero');

  return { items, hero: heroIt };
}

// Places what's in view; hides the rest (no layers for off-screen stones).
// The whole track moves with one transform per frame (`shift`, px): each stone
// is only rewritten when its place relative to the track drifts by more than
// 0.4 px, which at a fixed camera pitch is rarely, so a scroll costs one
// style write rather than one per stone.
// settled: the camera has stopped changing shape (map view), so every stone is
// placed once, all shown, none promoted: the track is one layer the compositor
// slides, and only the hero is placed per frame.
export function placeLayer(layer, project, viewZ, H, track, shift = 0, settled = false) {
  const pt = {};
  if (track && shift !== layer.shift) { track.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0)`; layer.shift = shift; }
  if (settled && !layer.settled) {
    layer.settled = true;
    track.classList.add('settled');
    for (const it of layer.items) {
      project(it.x, it.y, it.z, pt);
      it.el.style.display = ''; it.on = true;
      it.px = pt.x; it.py = pt.y - shift; it.pk = 1;
      it.el.style.transform = `translate(${pt.x.toFixed(1)}px, ${(pt.y - shift).toFixed(1)}px)`;
    }
  }
  if (!settled && layer.settled) { layer.settled = false; track.classList.remove('settled'); for (const it of layer.items) it.px = undefined; }
  for (const it of layer.items) {
    if (layer.settled && it.kind !== 'hero') continue;
    const near = it.z > viewZ[0] - 80 && it.z < viewZ[1] + 80;
    if (!near) { if (it.on) { it.el.style.display = 'none'; it.on = false; } continue; }
    project(it.x, it.y, it.z, pt);
    const vis = pt.vis && pt.y > -140 && pt.y < H + 140;
    if (!vis) { if (it.on) { it.el.style.display = 'none'; it.on = false; } continue; }
    if (!it.on) { it.el.style.display = ''; it.on = true; it.px = undefined; }
    const k = it.kind === 'node' || it.kind === 'hero' ? Math.max(0.55, Math.min(1.12, pt.scale)) : Math.max(0.7, Math.min(1, pt.scale));
    const x = pt.x, y = pt.y + (it.dy ?? 0) - shift;
    if (it.px !== undefined && Math.abs(x - it.px) < 0.4 && Math.abs(y - it.py) < 0.4 && Math.abs(k - it.pk) < 0.004) continue;
    it.px = x; it.py = y; it.pk = k;
    it.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${k.toFixed(3)})`;
  }
}
