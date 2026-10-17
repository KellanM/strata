// The puzzle map: a trail that descends through the strata. Each chapter is a
// layer of rock with a wavy upper edge, and the background drifts through each
// puzzle's palette, so moving down the trail moves through the colour script.
// Plain DOM + SVG so it stays light over the live scene.

import { recordStars } from './score.js';

const NS = 'http://www.w3.org/2000/svg';
const STEP = 116;          // vertical distance between nodes
const REGION_GAP = 92;     // room for a chapter label
const COL = 420;           // max width of the trail column
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

const hex = (h) => '#' + h.toString(16).padStart(6, '0');
const lum = (h) => {
  const r = (h >> 16) & 255, g = (h >> 8) & 255, b = h & 255;
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
};
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

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

// Catmull-Rom segment between p1 and p2 as a cubic bezier.
function segment(p0, p1, p2, p3) {
  const t = 1 / 6;
  const c1 = [p1[0] + (p2[0] - p0[0]) * t, p1[1] + (p2[1] - p0[1]) * t];
  const c2 = [p2[0] - (p3[0] - p1[0]) * t, p2[1] - (p3[1] - p1[1]) * t];
  return `M${p1[0]},${p1[1]}C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${p2[0]},${p2[1]}`;
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

/**
 * Renders the map into `root`.
 * opts: { entries, solved, learned, lessons, drift: number[], driftPalette,
 *         onPlay(entry), onLearn(), onDrift(n), fmt(seconds), scroll: bool }
 */
export function renderMap(root, opts) {
  const { entries, solved, learned, lessons, drift, driftPalette, fmt } = opts;
  const scroller = root.closest('.map-scroll');
  const fullW = root.clientWidth || window.innerWidth;
  const colW = Math.min(COL, fullW - 24);
  const x0 = (fullW - colW) / 2;
  const { first, open } = progress(entries, solved);

  // ---- layout: Learn, then chapters in array order, then Drift
  const regions = [];
  for (const e of entries) {
    const name = e.shape.chapter ?? 'The Quarry';
    let r = regions[regions.length - 1];
    if (!r || r.name !== name) regions.push((r = { name, items: [] }));
    r.items.push(e);
  }

  const nodes = [];         // { kind, x, y, palette, entry?, n?, state }
  const labels = [];        // { y, text, sub, palette }
  let k = 0, y = 70;
  const place = () => x0 + colW * (0.5 + 0.28 * Math.sin(k * 0.92 + 0.5));

  const learnPal = regions[0]?.items[0].palette ?? driftPalette;
  nodes.push({ kind: 'learn', x: place(), y, palette: learnPal, sky: learnPal, state: learned ? 'solved' : 'current' });
  k++; y += STEP * 0.9;

  regions.forEach((r, ri) => {
    const done = r.items.reduce((n, e) => n + recordStars(e.shape, solved[e.shape.id]), 0);
    y += REGION_GAP * 0.35;
    labels.push({ y, top: y - REGION_GAP * 0.35, text: r.name, sub: `${ROMAN[ri] ?? ri + 1} · ${done} / ${r.items.length * 3} ★`, palette: r.items[0].palette });
    y += REGION_GAP * 0.65;
    for (const e of r.items) {
      const i = entries.indexOf(e);
      const state = solved[e.shape.id] ? 'solved' : !open[i] ? 'locked' : i === first && learned ? 'current' : 'open';
      nodes.push({ kind: 'puzzle', x: place(), y, palette: e.palette, sky: r.items[0].palette, entry: e, state });
      k++; y += STEP;
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
    stops.push(`${hex(l.palette.skyTop)} ${((top / height) * 100).toFixed(2)}%`);
    stops.push(`${hex(l.palette.skyBottom)} ${((bottom / height) * 100).toFixed(2)}%`);
  });
  root.style.height = `${height}px`;
  root.style.setProperty('--map-bg', `linear-gradient(180deg, ${stops.join(', ')})`);

  // ---- svg: strata layers + trail
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
    markup += `<path d="M${fmtPts(waves[li])}L${fmtPts(lower)}Z" fill="${dark ? '#0b0f24' : '#fff'}" fill-opacity="${a}"/>`;
    markup += `<path d="M${fmtPts(waves[li])}" fill="none" stroke="${hex(l.palette.under)}" stroke-opacity=".25" stroke-width="1.2"/>`;
  });

  // trail through learn + puzzles, trailing off into the drift layer
  const trail = nodes.filter((n) => n.kind !== 'drift');
  const pts = trail.map((n) => [n.x, n.y]);
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i], p3 = pts[i + 2] ?? pts[i + 1];
    const reached = trail[i + 1].state !== 'locked' && trail[i].state === 'solved';
    const col = hex(trail[i + 1].palette.under);
    markup += reached
      ? `<path d="${segment(p0, pts[i], pts[i + 1], p3)}" class="trail walked" stroke="${col}"/>`
      : `<path d="${segment(p0, pts[i], pts[i + 1], p3)}" class="trail" stroke="${col}"/>`;
  }
  const last = pts[pts.length - 1], end = labels[labels.length - 1].top - 6;
  const cxm = x0 + colW / 2;
  markup += `<path d="M${last[0]},${last[1]}Q${last[0]},${(last[1] + end) / 2} ${cxm},${end}" class="trail tail" stroke="${hex(trail[trail.length - 1].palette.under)}"/>`;
  svg.innerHTML = markup;

  // ---- DOM: labels and node buttons
  root.innerHTML = '';
  root.appendChild(svg);

  for (const l of labels) {
    // set the chapter title on whichever side the trail isn't crossing
    const above = trail.filter((n) => n.y < l.y).pop(), below = trail.find((n) => n.y > l.y);
    const cross = below ? (above.x + below.x) / 2 : x0 + colW / 2;
    const el = document.createElement('div');
    const left = cross > x0 + colW / 2;
    el.className = `map-region ${left ? 'at-left' : 'at-right'}` + (lum(l.palette.skyTop) < 0.45 ? ' on-dark' : '');
    el.style.top = `${l.y}px`;
    el.style.setProperty('--edge', `${x0 + 8}px`);
    el.innerHTML = `<span class="r-name">${esc(l.text)}</span><span class="r-sub">${esc(l.sub)}</span>`;
    root.appendChild(el);
  }

  let current = null;
  for (const n of nodes) {
    const p = n.palette;
    const b = document.createElement('button');
    const side = n.kind === 'drift' ? '' : n.x > x0 + colW / 2 ? ' lbl-left' : ' lbl-right';
    b.className = `map-node ${n.kind} ${n.state}${side}` + (lum(n.sky.skyTop) < 0.45 ? ' on-dark' : '');
    b.style.left = `${n.x}px`;
    b.style.top = `${n.y}px`;
    b.style.setProperty('--glow', hex(p.glow));
    const faces = n.state === 'solved' && n.kind === 'puzzle'
      ? [p.paintTop, p.paintLit, p.paintShade]
      : [p.top, p.lit, p.shade];
    let num = '', name = '', meta = '';
    if (n.kind === 'learn') {
      num = '00'; name = 'Learn'; meta = `${lessons} lessons`;
      b.setAttribute('aria-label', `Learn: ${lessons} short lessons${learned ? ', completed' : ''}`);
      b.addEventListener('click', opts.onLearn);
    } else if (n.kind === 'drift') {
      num = ''; name = `${n.n}³`; meta = 'drift';
      b.setAttribute('aria-label', `Drift: random ${n.n} by ${n.n} by ${n.n} puzzle`);
      b.addEventListener('click', () => opts.onDrift(n.n));
    } else {
      const { shape, number } = n.entry;
      const s = solved[shape.id];
      num = String(number).padStart(2, '0');
      name = s ? shape.name : n.state === 'locked' ? '' : '???';
      meta = s ? starRow(recordStars(shape, s)) : '';
      b.setAttribute('aria-label', `Puzzle ${number}` +
        (s ? `, ${shape.name}, solved` : n.state === 'locked' ? ', locked' : ''));
      if (n.state === 'locked') {
        b.setAttribute('aria-disabled', 'true');
        b.addEventListener('click', () => {
          b.classList.remove('nudge'); void b.offsetWidth; b.classList.add('nudge');
        });
      } else {
        b.addEventListener('click', () => opts.onPlay(n.entry));
      }
    }
    b.innerHTML = `<span class="halo"></span><span class="ring"></span>${cube(hex(faces[0]), hex(faces[1]), hex(faces[2]), n.kind === 'drift' ? 38 : 46)}
      ${n.state === 'solved' ? '<span class="mark" aria-hidden="true"></span>' : ''}
      <span class="label">${num ? `<span class="n">${num}</span>` : ''}<span class="nm">${esc(name)}</span><span class="mt">${meta}</span></span>`;
    root.appendChild(b);
    if (n.state === 'current' && !current) current = n;
  }

  // ---- open on the current node
  if (opts.scroll !== false && scroller) {
    const target = current ?? nodes[0];
    const headH = root.offsetTop;
    scroller.scrollTop = Math.max(0, headH + target.y - scroller.clientHeight * 0.45);
  }
  return { current };
}

const STAR = '<svg viewBox="0 0 24 24"><path d="M12 2.8l2.7 5.9 6.4.7-4.8 4.3 1.4 6.3L12 16.8 6.3 20l1.4-6.3-4.8-4.3 6.4-.7z"/></svg>';
function starRow(n) {
  return `<span class="stars-mini" aria-label="${n} of 3 stars">${[0, 1, 2].map((k) => `<i class="${k < n ? 'on' : ''}">${STAR}</i>`).join('')}</span>`;
}
