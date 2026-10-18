// The puzzle map: a trail that descends through the strata. Each chapter is a
// layer of rock with a wavy upper edge, and the background drifts through each
// puzzle's palette, so moving down the trail moves through the colour script.
// The map is a world that answers progress: solved stones become the objects
// they hid, mist lifts from a chapter as its stones are uncovered (with a
// one-off awakening when the last one falls), a small companion walks the trail
// to wherever you are, and each chapter keeps an optional shrine for its stars.
// Plain DOM + SVG so it stays light over the live scene.

import { recordStars } from './score.js';
import { renderThumb } from './thumbs.js';
import { PALETTES, variant } from './palettes.js';
import * as Shapes from './shapes.js';

const NS = 'http://www.w3.org/2000/svg';
const STEP = 116;          // vertical distance between nodes
const REGION_GAP = 92;     // room for a chapter label
const COL = 420;           // max width of the trail column
const SHRINE_STARS = 12;   // stars in a chapter that open its shrine
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

const hex = (h) => '#' + h.toString(16).padStart(6, '0');
const lum = (h) => {
  const r = (h >> 16) & 255, g = (h >> 8) & 255, b = h & 255;
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
};
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const reduceMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// small persisted sets: which objects / chapters the map has already celebrated
function seenSet(key) {
  try { return new Set(JSON.parse(localStorage.getItem(key) || '[]')); } catch { return new Set(); }
}
function saveSet(key, set) { localStorage.setItem(key, JSON.stringify([...set])); }

function hashId(id) {
  let h = 2166136261;
  for (const ch of id) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
}

// Small isometric cube in a palette's face ramp.
function cube(top, left, right, size = 44) {
  const c = Math.cos(Math.PI / 6) * 0.5, h = 0.5;
  const p = (x, y) => `${(50 + x * 100).toFixed(1)},${(50 + y * 100).toFixed(1)}`;
  return `<svg class="cube" viewBox="0 0 100 100" style="width:${size}px;height:${size}px" aria-hidden="true">
    <path d="M${p(0, -h)}L${p(c, -h / 2)}L${p(0, 0)}L${p(-c, -h / 2)}Z" fill="${top}"/>
    <path d="M${p(-c, -h / 2)}L${p(0, 0)}L${p(0, h)}L${p(-c, h / 2)}Z" fill="${left}"/>
    <path d="M${p(c, -h / 2)}L${p(0, 0)}L${p(0, h)}L${p(c, h / 2)}Z" fill="${right}"/>
  </svg>`;
}

// A chapter shrine: a faceted gem hovering over a low plinth.
function shrine(p, size = 44) {
  return `<svg class="cube shrine-gem" viewBox="0 0 100 100" style="width:${size}px;height:${size}px" aria-hidden="true">
    <path d="M30 80L50 70L70 80L50 90Z" fill="${hex(p.top)}"/>
    <path d="M30 80L50 90V95L30 85Z" fill="${hex(p.lit)}"/>
    <path d="M70 80L50 90V95L70 85Z" fill="${hex(p.shade)}"/>
    <g class="gem">
      <path d="M50 12L66 38L50 46Z" fill="${hex(p.glow)}"/>
      <path d="M50 12L34 38L50 46Z" fill="${hex(p.lit)}"/>
      <path d="M34 38L50 46L50 64Z" fill="${hex(p.shade)}"/>
      <path d="M66 38L50 46L50 64Z" fill="${hex(p.under)}"/>
    </g>
  </svg>`;
}

// The companion: a little Totem built like everything else in the world, two
// isometric blocks in the same projection as the stones and the puzzle (a
// smaller head on a deeper base), coloured from the chapter's stone, with one
// eye carved flat into the head's lit face.
const ISO_X = Math.cos(Math.PI / 6);
function isoBlock(cx, topY, e, H, top, left, right) {
  const hw = ISO_X * e / 2, hh = e / 4;                 // same proportions as cube()
  const N = [cx, topY - hh], E = [cx + hw, topY], S = [cx, topY + hh], W = [cx - hw, topY];
  const d = (pts) => 'M' + pts.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join('L') + 'Z';
  const down = ([x, y]) => [x, y + H];
  return {
    svg: `<path d="${d([N, E, S, W])}" fill="${top}"/>`
      + `<path d="${d([W, S, down(S), down(W)])}" fill="${left}"/>`
      + `<path d="${d([E, S, down(S), down(E)])}" fill="${right}"/>`,
    W, S, H,
  };
}

function companion(p) {
  const base = isoBlock(20, 37, 22, 11, hex(p.lit), hex(p.shade), hex(p.under));
  const head = isoBlock(20, 25, 15, 9.5, hex(p.top), hex(p.lit), hex(p.shade));
  // the eye: a small parallelogram lying in the head's left (lit) face
  const [wx, wy] = head.W, [sx, sy] = head.S;
  const ux = (sx - wx), uy = (sy - wy);                 // along the face
  const at = (a, b) => [wx + ux * a, wy + uy * a + head.H * b];
  const eye = [at(0.36, 0.3), at(0.56, 0.3), at(0.56, 0.62), at(0.36, 0.62)]
    .map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join('L');
  const sw = ISO_X * 15, sh = 6.2;                       // shadow: a flat iso diamond on the ground
  return `<svg viewBox="0 0 40 56" aria-hidden="true">
    <path class="shadow" d="M20 ${49 - sh}L${20 + sw} 49L20 ${49 + sh}L${20 - sw} 49Z" fill="${hex(p.under)}" fill-opacity=".22"/>
    ${base.svg}
    <g class="head">${head.svg}<path class="eye" d="M${eye}Z" fill="${hex(p.under)}"/></g>
  </svg>`;
}

// Catmull-Rom segment between p1 and p2 as a cubic bezier.
function segment(p0, p1, p2, p3, move = true) {
  const t = 1 / 6;
  const c1 = [p1[0] + (p2[0] - p0[0]) * t, p1[1] + (p2[1] - p0[1]) * t];
  const c2 = [p2[0] - (p3[0] - p1[0]) * t, p2[1] - (p3[1] - p1[1]) * t];
  return `${move ? `M${p1[0]},${p1[1]}` : ''}C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${p2[0]},${p2[1]}`;
}

// Unlock rule: solved, the first unsolved, or within two of the furthest solved.
export function progress(entries, solved) {
  let furthest = -1, first = -1;
  entries.forEach((e, i) => {
    if (solved[e.shape.id]) furthest = i;
    else if (first < 0) first = i;
  });
  const open = entries.map((e, i) => !!solved[e.shape.id] || i === first || i <= furthest + 2);
  return { furthest, first, open };
}

// Optional shrine puzzle for each chapter, if the level set provides one.
export function bonusFor(chapter) {
  return (Shapes.BONUS ?? []).find((b) => b.chapter === chapter) ?? null;
}

export function bonusEntry(shape) {
  const base = PALETTES.find((p) => p.name === shape.palette) ?? PALETTES[0];
  return { shape, palette: variant(base, 0.5, hashId(shape.id) % 1000), number: '✦', bonus: true };
}

/**
 * Renders the map into `root`.
 * opts: { entries, solved, learned, lessons, drift: number[], driftPalette,
 *         onPlay(entry, el), onLearn(el), onDrift(n, el), fmt(seconds), scroll: bool,
 *         celebrate: bool (play one-off reveals; false for passive re-renders) }
 */
export function renderMap(root, opts) {
  const { entries, solved, learned, lessons, drift, driftPalette } = opts;
  const celebrate = opts.celebrate !== false && !reduceMotion();
  const scroller = root.closest('.map-scroll');
  const fullW = root.clientWidth || window.innerWidth;
  const colW = Math.min(COL, fullW - 24);
  const x0 = (fullW - colW) / 2;
  const { first, open } = progress(entries, solved);
  const seenObjects = seenSet('strata.map.objects');
  const seenChapters = seenSet('strata.map.chapters');

  // ---- layout: Learn, then chapters in array order, then Drift
  const regions = [];
  for (const e of entries) {
    const name = e.shape.chapter ?? 'The Quarry';
    let r = regions[regions.length - 1];
    if (!r || r.name !== name) regions.push((r = { name, items: [] }));
    r.items.push(e);
  }

  const nodes = [];         // { kind, x, y, palette, entry?, n?, state }
  const labels = [];        // { y, top, text, sub, palette, region? }
  let k = 0, y = 70;
  const place = () => x0 + colW * (0.5 + 0.28 * Math.sin(k * 0.92 + 0.5));

  const learnPal = regions[0]?.items[0].palette ?? driftPalette;
  nodes.push({ kind: 'learn', x: place(), y, palette: learnPal, sky: learnPal, state: learned ? 'solved' : 'current' });
  k++; y += STEP * 0.9;

  regions.forEach((r, ri) => {
    r.stars = r.items.reduce((n, e) => n + recordStars(e.shape, solved[e.shape.id]), 0);
    r.solvedCount = r.items.filter((e) => solved[e.shape.id]).length;
    r.fraction = r.solvedCount / r.items.length;
    r.complete = r.solvedCount === r.items.length;
    r.awaken = r.complete && celebrate && !seenChapters.has(r.name);
    y += REGION_GAP * 0.35;
    labels.push({ y, top: y - REGION_GAP * 0.35, text: r.name, sub: `${ROMAN[ri] ?? ri + 1} · ${r.stars} / ${r.items.length * 3} ★`, palette: r.items[0].palette, region: r });
    y += REGION_GAP * 0.65;
    for (const e of r.items) {
      const i = entries.indexOf(e);
      const state = solved[e.shape.id] ? 'solved' : !open[i] ? 'locked' : i === first && learned ? 'current' : 'open';
      const n = { kind: 'puzzle', x: place(), y, palette: e.palette, sky: r.items[0].palette, entry: e, state };
      nodes.push(n);
      r.last = n;
      k++; y += STEP;
    }
    // the shrine sits off the trail, on the far side from the chapter's last stone
    const b = bonusFor(r.name);
    if (b) {
      const entry = bonusEntry(b);
      const leftSide = r.last.x > x0 + colW / 2;
      r.shrine = {
        kind: 'bonus', x: x0 + colW * (leftSide ? 0.16 : 0.84), y: r.last.y + STEP * 0.5,
        palette: entry.palette, sky: r.items[0].palette, entry, region: r,
        state: solved[b.id] ? 'solved' : r.stars >= SHRINE_STARS ? 'open' : 'locked',
      };
      nodes.push(r.shrine);
    }
  });

  y += REGION_GAP * 0.35 - STEP * 0.4;
  labels.push({ y, top: y - REGION_GAP * 0.35, text: 'Drift', sub: 'endless · carved at random', palette: driftPalette, drift: true });
  y += REGION_GAP * 0.75;
  const allSolved = first < 0;
  drift.forEach((n, j) => {
    nodes.push({ kind: 'drift', x: x0 + colW * (0.5 + (j - 1) * 0.3), y: y + (j === 1 ? 26 : 0), palette: driftPalette, sky: driftPalette, n, state: allSolved && j === 0 ? 'current' : 'open' });
  });
  k++;
  const height = y + 150;

  // ---- background: each chapter carries its own sky, blended across the seams
  const stops = [];
  labels.forEach((l, li) => {
    const top = li === 0 ? 0 : l.top + 30;
    const bottom = (labels[li + 1]?.top ?? height) - 30;
    l.bottom = labels[li + 1]?.top ?? height;
    stops.push(`${hex(l.palette.skyTop)} ${((top / height) * 100).toFixed(2)}%`);
    stops.push(`${hex(l.palette.skyBottom)} ${((bottom / height) * 100).toFixed(2)}%`);
  });
  root.style.height = `${height}px`;
  root.style.setProperty('--map-bg', `linear-gradient(180deg, ${stops.join(', ')})`);

  // ---- svg: strata layers, the mist over them, and the trail
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class', 'map-svg');
  svg.setAttribute('width', fullW);
  svg.setAttribute('height', height);
  svg.setAttribute('viewBox', `0 0 ${fullW} ${height}`);
  svg.style.width = `${fullW}px`;
  svg.style.height = `${height}px`;
  let markup = '';
  // each chapter is a band of sediment between two soft wavy edges;
  // alternate bands are lifted slightly so the layers read
  const waves = labels.map((l, li) => {
    const amp = 10 + (li % 3) * 4, ph = li * 1.7, w = [];
    for (let x = 0; x <= fullW + 20; x += 20) {
      w.push([x, l.top + Math.sin(x / 90 + ph) * amp + Math.sin(x / 37 + ph * 2) * amp * 0.25]);
    }
    return w;
  });
  const fmtPts = (w) => w.map(([x, yy]) => `${x},${yy.toFixed(1)}`).join('L');
  labels.forEach((l, li) => {
    const next = waves[li + 1] ?? [[fullW + 20, height], [0, height]];
    const lower = waves[li + 1] ? [...next].reverse() : next;
    const dark = lum(l.palette.skyTop) < 0.45;
    const a = (li % 2 ? 0.07 : 0.17) * (dark ? 0.6 : 1);
    const band = `M${fmtPts(waves[li])}L${fmtPts(lower)}Z`;
    markup += `<path d="${band}" fill="${dark ? '#0b0f24' : '#fff'}" fill-opacity="${a}"/>`;
    // mist: thick over untouched chapters, thinning as their stones are uncovered
    const r = l.region;
    if (r && (r.fraction < 1 || r.awaken)) {
      const mist = dark ? '#3b3f5c' : '#e9e5ec';
      const op = r.awaken ? 0 : (1 - r.fraction) * 0.5;
      markup += `<path d="${band}" class="mist${r.awaken ? ' clearing' : ''}" fill="${mist}" style="--mist:${op.toFixed(3)}" fill-opacity="${op.toFixed(3)}"/>`;
    }
    markup += `<path d="M${fmtPts(waves[li])}" fill="none" stroke="${hex(l.palette.under)}" stroke-opacity=".25" stroke-width="1.2"/>`;
  });

  // trail through learn + puzzles, trailing off into the drift layer
  const trail = nodes.filter((n) => n.kind === 'learn' || n.kind === 'puzzle');
  const pts = trail.map((n) => [n.x, n.y]);
  const segD = (i, move = true) => segment(pts[i - 1] ?? pts[i], pts[i], pts[i + 1], pts[i + 2] ?? pts[i + 1], move);
  for (let i = 0; i < pts.length - 1; i++) {
    const reached = trail[i + 1].state !== 'locked' && trail[i].state === 'solved';
    const col = hex(trail[i + 1].palette.under);
    // the step out of a chapter that just woke draws itself in
    const draws = reached && trail[i].entry && regions.find((r) => r.last === trail[i])?.awaken;
    markup += `<path d="${segD(i)}" class="trail${reached ? ' walked' : ''}${draws ? ' draw' : ''}" stroke="${col}"/>`;
  }
  const last = pts[pts.length - 1], end = labels[labels.length - 1].top - 6;
  const cxm = x0 + colW / 2;
  markup += `<path d="M${last[0]},${last[1]}Q${last[0]},${(last[1] + end) / 2} ${cxm},${end}" class="trail tail" stroke="${hex(trail[trail.length - 1].palette.under)}"/>`;
  // a faint spur from each chapter's last stone to its shrine
  for (const r of regions) {
    if (!r.shrine) continue;
    const a = r.last, s = r.shrine;
    markup += `<path d="M${a.x},${a.y}Q${(a.x + s.x) / 2},${s.y} ${s.x},${s.y}" class="trail spur" stroke="${hex(a.palette.under)}"/>`;
  }
  svg.innerHTML = markup;

  // ---- DOM: atmosphere, labels and node buttons
  root.innerHTML = '';
  root.appendChild(svg);

  for (const l of labels) {
    const r = l.region;
    if (!r) continue;
    const dark = lum(l.palette.skyTop) < 0.45;
    const band = document.createElement('div');
    band.className = 'map-air' + (r.awaken ? ' awaken' : '') + (dark ? ' on-dark' : '');
    band.style.top = `${l.top}px`;
    band.style.height = `${l.bottom - l.top}px`;
    band.style.setProperty('--glow', hex(l.palette.glow));
    let air = '';
    // wisps of mist drift where the chapter is still hidden
    const wisps = r.awaken ? 3 : Math.round((1 - r.fraction) * 3);
    for (let w = 0; w < wisps; w++) {
      air += `<i class="wisp" style="top:${18 + w * 27}%;left:${(w * 37) % 70}%;--d:${16 + w * 5}s;--o:${r.awaken ? 0.5 : (0.25 + 0.35 * (1 - r.fraction)).toFixed(2)}"></i>`;
    }
    // light returns as motes: one for each stone uncovered
    const motes = r.awaken ? 14 : r.solvedCount + (r.complete ? 4 : 0);
    for (let m = 0; m < motes; m++) {
      const h = hashId(`${r.name}${m}`);
      air += `<i class="mote" style="left:${(h % 92) + 4}%;top:${((h >> 8) % 80) + 10}%;--d:${3 + (h % 5)}s;--delay:${(h >> 4) % 4}s"></i>`;
    }
    if (r.awaken) air += '<i class="sweep"></i>';
    band.innerHTML = air;
    root.appendChild(band);
  }

  for (const l of labels) {
    // set the chapter title on whichever side the trail isn't crossing
    const above = trail.filter((n) => n.y < l.y).pop(), below = trail.find((n) => n.y > l.y);
    const cross = below ? (above.x + below.x) / 2 : x0 + colW / 2;
    const el = document.createElement('div');
    const left = cross > x0 + colW / 2;
    el.className = `map-region ${left ? 'at-left' : 'at-right'}` + (lum(l.palette.skyTop) < 0.45 ? ' on-dark' : '') + (l.region?.awaken ? ' awaken' : '');
    el.style.top = `${l.y}px`;
    el.style.setProperty('--edge', `${x0 + 8}px`);
    el.innerHTML = `<span class="r-name">${esc(l.text)}</span><span class="r-sub">${esc(l.sub)}</span>`;
    root.appendChild(el);
  }

  let current = null;
  const newlySeen = [];
  for (const n of nodes) {
    const p = n.palette;
    const b = document.createElement('button');
    const side = n.kind === 'drift' ? '' : n.x > x0 + colW / 2 ? ' lbl-left' : ' lbl-right';
    b.className = `map-node ${n.kind} ${n.state}${side}` + (lum(n.sky.skyTop) < 0.45 ? ' on-dark' : '');
    b.style.left = `${n.x}px`;
    b.style.top = `${n.y}px`;
    b.style.setProperty('--glow', hex(p.glow));
    b.style.setProperty('--sky', hex(n.sky.skyBottom));
    let num = '', name = '', meta = '', art = cube(hex(p.top), hex(p.lit), hex(p.shade), n.kind === 'drift' ? 38 : 46);
    if (n.kind === 'learn') {
      num = '00'; name = 'Learn'; meta = `${lessons} lessons`;
      b.setAttribute('aria-label', `Learn: ${lessons} short lessons${learned ? ', completed' : ''}`);
      b.addEventListener('click', () => opts.onLearn(b));
    } else if (n.kind === 'drift') {
      num = ''; name = `${n.n}³`; meta = 'drift';
      b.setAttribute('aria-label', `Drift: random ${n.n} by ${n.n} by ${n.n} puzzle`);
      b.addEventListener('click', () => opts.onDrift(n.n, b));
    } else {
      const { shape, number } = n.entry;
      const s = solved[shape.id];
      const isBonus = n.kind === 'bonus';
      num = isBonus ? '✦' : String(number).padStart(2, '0');
      if (isBonus) {
        name = s ? shape.name : 'Shrine';
        meta = s ? starRow(recordStars(shape, s)) : n.state === 'locked' ? `${n.region.stars} / ${SHRINE_STARS} ★` : 'open';
        if (!s) art = shrine(p);
      } else {
        name = s ? shape.name : n.state === 'locked' ? '' : '???';
        meta = s ? starRow(recordStars(shape, s)) : '';
      }
      if (s) {
        // the stone has become the thing it was hiding
        const fresh = celebrate && !seenObjects.has(shape.id);
        art = `${fresh ? cube(hex(p.top), hex(p.lit), hex(p.shade), 46) : ''}<img class="obj" alt="" src="${renderThumb(shape, p, { size: 120 })}">`;
        if (fresh) { b.classList.add('fresh'); newlySeen.push(shape.id); }
      }
      b.setAttribute('aria-label', `${isBonus ? `${n.region.name} shrine` : `Puzzle ${number}`}` +
        (s ? `, ${shape.name}, solved` : n.state === 'locked' ? (isBonus ? `, opens at ${SHRINE_STARS} stars` : ', locked') : ''));
      if (n.state === 'locked') {
        b.setAttribute('aria-disabled', 'true');
        b.addEventListener('click', () => {
          b.classList.remove('nudge'); void b.offsetWidth; b.classList.add('nudge');
        });
      } else {
        b.addEventListener('click', () => opts.onPlay(n.entry, b));
      }
    }
    b.innerHTML = `<span class="halo"></span><span class="ring"></span>${art}
      ${n.state === 'solved' && n.kind === 'learn' ? '<span class="mark" aria-hidden="true"></span>' : ''}
      <span class="label">${num ? `<span class="n">${num}</span>` : ''}<span class="nm">${esc(name)}</span><span class="mt">${meta}</span></span>`;
    root.appendChild(b);
    n.el = b;
    if (n.state === 'current' && !current) current = n;
  }

  // the step out of an awakened chapter draws itself along its own length
  svg.querySelectorAll('.trail.draw').forEach((path) => {
    const len = path.getTotalLength?.() ?? 200;
    path.style.setProperty('--len', len.toFixed(1));
  });

  if (newlySeen.length) { newlySeen.forEach((id) => seenObjects.add(id)); saveSet('strata.map.objects', seenObjects); }
  const woke = regions.filter((r) => r.awaken);
  if (woke.length) { woke.forEach((r) => seenChapters.add(r.name)); saveSet('strata.map.chapters', seenChapters); }

  // ---- the companion keeps you company at the newest stone
  const home = current
    ?? [...trail].reverse().find((n) => n.state === 'solved' && n.kind === 'puzzle')
    ?? trail[0];
  placeCompanion(root, svg, trail, pts, segD, home, celebrate);

  // ---- open on the current node, or on a chapter that has just woken
  if (opts.scroll !== false && scroller) {
    const target = woke.length ? { y: woke[0].last.y + STEP * 0.35 } : current ?? nodes[0];
    const headH = root.offsetTop;
    scroller.scrollTop = Math.max(0, headH + target.y - scroller.clientHeight * 0.45);
  }
  return { current };
}

// Sits beside `home`, on the side away from its label. If it was last seen
// further back along the trail, it walks there first.
function placeCompanion(root, svg, trail, pts, segD, home, celebrate) {
  const key = (n) => (n.entry ? n.entry.shape.id : n.kind);
  const to = trail.indexOf(home);
  if (to < 0) return;
  const el = document.createElement('div');
  el.className = 'companion';
  el.innerHTML = companion(home.sky);
  root.appendChild(el);
  const side = (n) => [n.x + (n.el?.classList.contains('lbl-left') ? 44 : -44), n.y + 8];
  const put = ([x, yy], flip) => {
    el.style.transform = `translate(${x.toFixed(1)}px, ${yy.toFixed(1)}px)`;
    el.classList.toggle('flip', !!flip);
  };

  // only a map the player actually sees moves the companion on
  const prevKey = localStorage.getItem('strata.map.companion');
  if (celebrate || !prevKey) localStorage.setItem('strata.map.companion', key(home));
  const from = trail.findIndex((n) => key(n) === prevKey);
  const [hx, hy] = side(home);
  if (!celebrate || from < 0 || from >= to) { put([hx, hy], hx < home.x); return; }

  // walk the trail from the old stone to the new one, hopping as it goes
  const path = document.createElementNS(NS, 'path');
  let d = '';
  for (let i = from; i < to; i++) d += segD(i, i === from);
  path.setAttribute('d', d);
  path.setAttribute('fill', 'none');
  svg.appendChild(path);
  const len = path.getTotalLength();
  const steps = to - from;
  const dur = Math.min(3200, Math.max(900, steps * 750));
  const start = side(trail[from]);
  put(start, start[0] < trail[from].x);
  el.classList.add('walking');
  const t0 = performance.now() + 550;
  let lastX = start[0];
  const tick = (now) => {
    if (!el.isConnected) return;
    const k = Math.max(0, Math.min(1, (now - t0) / dur));
    const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    let pos;
    if (k <= 0) pos = start;
    else {
      const pt = path.getPointAtLength(len * e);
      // step off the stone at the start, onto the trail, and off again at the end
      const off = Math.min(1, k * 6, (1 - k) * 6);
      const a = k < 0.5 ? start : [hx, hy];
      pos = [pt.x + (a[0] - pt.x) * (1 - off), pt.y + (a[1] - pt.y) * (1 - off) - Math.abs(Math.sin(e * Math.PI * steps * 2)) * 7];
    }
    put(pos, pos[0] < lastX - 0.01 ? false : pos[0] > lastX + 0.01 ? true : el.classList.contains('flip'));
    lastX = pos[0];
    if (k < 1) requestAnimationFrame(tick);
    else { el.classList.remove('walking'); put([hx, hy], hx < home.x); path.remove(); }
  };
  requestAnimationFrame(tick);
}

const STAR = '<svg viewBox="0 0 24 24"><path d="M12 2.8l2.7 5.9 6.4.7-4.8 4.3 1.4 6.3L12 16.8 6.3 20l1.4-6.3-4.8-4.3 6.4-.7z"/></svg>';
function starRow(n) {
  return `<span class="stars-mini" aria-label="${n} of 3 stars">${[0, 1, 2].map((k) => `<i class="${k < n ? 'on' : ''}">${STAR}</i>`).join('')}</span>`;
}
