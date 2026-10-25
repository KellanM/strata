// The puzzle map: a trail across a sea of mist (docs/map-study.md). The world
// itself (the sky, the mist, each chapter's mountain tops, the walls of mist
// over chapters not yet reached) is mapworld.js, in flat layers behind the
// page; this file lays the map out and builds its DOM in the map's scroller:
// the stones, the chapter names, the trail, the shrines and the companion.
// Stones and trail live in the same page, so they always sit on each other.
//
// The map answers progress: solved stones become the objects they hid, the
// trail draws on to stones as they open, a chapter's mist lifts once when the
// trail first reaches it, the companion walks to wherever you are, and each
// chapter keeps an optional shrine, lit once its stars are earned.

import { recordStars } from './score.js';
import { renderThumb } from './thumbs.js';
import { PALETTES, variant } from './palettes.js';
import * as Shapes from './shapes.js';
import { after, mark, DUR, ease, rate as motionRate } from './motion.js';

const NS = 'http://www.w3.org/2000/svg';
const STEP = 116;          // vertical distance between stones
const GAP = 190;           // a chapter boundary: room for the cloud's edge and the name
const COL = 420;           // max width of the trail column
const SHRINE_STARS = 12;   // stars in a chapter that open its shrine
// Chapters past the next one still under cloud are folded into a short stretch
// (name, signature peak, shrine light) and open to full length when they become
// the next. false: every chapter keeps its full length under cloud.
export const FOLD_LATER_CHAPTERS = false;
const FOLDED_H = 300;
const BAND = 1000, BAND_PAD = 420;   // the map's paint bands (content-visibility), px
// a short chapter asks for fewer: two stars a stone at most
const shrineStars = (r) => Math.min(SHRINE_STARS, r.items.length * 2);
// developer switch (hidden panel): every stone and shrine open
const devUnlock = () => localStorage.getItem('strata.dev.unlock') === '1';

const hex = (h) => '#' + h.toString(16).padStart(6, '0');
const lum = (h) => {
  const r = (h >> 16) & 255, g = (h >> 8) & 255, b = h & 255;
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
};
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const reduceMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// small persisted sets: what the map has already celebrated
function seenSet(key) {
  const raw = localStorage.getItem(key);
  try { return raw === null ? null : new Set(JSON.parse(raw)); } catch { return new Set(); }
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

// A chapter shrine: a faceted gem over a slim spire; gold once its stars open it.
const GOLD = { top: 0xfff2c2, lit: 0xf3c95a, shade: 0xc98d2e, under: 0x8a5a1c };
function shrine(p, state, size = 56) {
  const g = state === 'locked' ? p : GOLD;
  // the gem is its own <svg> over the spire's, so its float moves a whole box
  // the compositor can carry: an animated <g> inside one svg repainted the map's
  // whole layer every frame
  const box = `viewBox="0 0 100 120" aria-hidden="true"`;
  return `<span class="cube shrine-gem" style="width:${size}px;height:${size * 1.2}px">
    <svg ${box}>
      <path d="M42 112L50 108L58 112L50 116Z" fill="${hex(p.top)}"/>
      <path d="M44 111L50 76L50 116Z" fill="${hex(p.lit)}"/><path d="M56 111L50 76L50 116Z" fill="${hex(p.shade)}"/>
    </svg>
    <svg class="gem" ${box}>
      <path d="M50 14L68 42L50 51Z" fill="${hex(g.top)}"/>
      <path d="M50 14L32 42L50 51Z" fill="${hex(g.lit)}"/>
      <path d="M32 42L50 51L50 70Z" fill="${hex(g.shade)}"/>
      <path d="M68 42L50 51L50 70Z" fill="${hex(g.under)}"/>
    </svg>
  </span>`;
}

// The companion: a little Totem built like everything else in the world (two
// isometric blocks, one eye carved into the head's lit face), carrying a small
// gold light: the gold of the trail it walks.
const ISO_X = Math.cos(Math.PI / 6);
function isoBlock(cx, topY, e, H, top, left, right) {
  const hw = ISO_X * e / 2, hh = e / 4;
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
  const base = isoBlock(20, 41, 22, 11, hex(p.lit), hex(p.shade), hex(p.under));
  const head = isoBlock(20, 29, 15, 9.5, hex(p.top), hex(p.lit), hex(p.shade));
  const [wx, wy] = head.W, [sx, sy] = head.S;
  const at = (a, b) => [wx + (sx - wx) * a, wy + (sy - wy) * a + head.H * b];
  const eye = [at(0.36, 0.3), at(0.56, 0.3), at(0.56, 0.62), at(0.36, 0.62)]
    .map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join('L');
  // three stacked svgs (body, head, lamp), so the head's bob and the lamp's
  // sway move whole boxes on the compositor instead of repainting the map
  const box = `viewBox="0 0 40 60" aria-hidden="true"`;
  return `<svg ${box}>
    <ellipse class="shadow" cx="20" cy="53.5" rx="12" ry="3.6" fill="${hex(p.under)}" fill-opacity=".2"/>
    ${base.svg}
  </svg><svg class="head" ${box}>${head.svg}<path class="eye" d="M${eye}Z" fill="${hex(p.under)}"/></svg><svg class="lamp" ${box}><circle cx="31" cy="9" r="7" fill="#ffe7a1" fill-opacity=".35"/><path d="M31 4.6L34 9L31 13.4L28 9Z" fill="#ffe7a1"/><path d="M31 4.6L34 9L31 9Z" fill="#fff6d8"/></svg>`;
}

// Catmull-Rom segment between p1 and p2 as a cubic bezier.
function segment(p0, p1, p2, p3, move = true) {
  const t = 1 / 6;
  const c1 = [p1[0] + (p2[0] - p0[0]) * t, p1[1] + (p2[1] - p0[1]) * t];
  const c2 = [p2[0] - (p3[0] - p1[0]) * t, p2[1] - (p3[1] - p1[1]) * t];
  return `${move ? `M${p1[0]},${p1[1]}` : ''}C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${p2[0]},${p2[1]}`;
}

// Unlock rule: solved, the first unsolved, or within two of the furthest solved
// stone reached along the trail. "Reached" walks the trail in order and steps
// onto the next solved stone only if at most one unsolved stone lies between
// (the old "within two"), so a solved stone sitting further on by itself (a
// level that moved chapters when the map grew) stays solved but doesn't open
// the trail around it. Stones added since (Shapes.ADDED_LATER) don't count as
// gaps, so a returning player keeps the trail they had walked and the new
// stones behind it open. For a save made on an unchanged trail this is the
// same as the furthest solved stone.
export function progress(entries, solved) {
  const later = Shapes.ADDED_LATER ?? new Set();
  let furthest = -1, first = -1, gap = 0;
  entries.forEach((e, i) => {
    if (solved[e.shape.id]) { if (gap <= 1) { furthest = i; gap = 0; } }
    else {
      if (first < 0) first = i;
      if (!later.has(e.shape.id)) gap++;
    }
  });
  const open = entries.map((e, i) => devUnlock() || !!solved[e.shape.id] || i === first || i <= furthest + 2);
  return { furthest, first, open };
}

// Optional shrine puzzle for each chapter, if the level set provides one.
export function bonusFor(chapter) {
  return (Shapes.BONUS ?? []).find((b) => b.chapter === chapter) ?? null;
}

// A shrine's level: its chapter's palette at midday, with gold in its light
// (the rays, the glow behind the block and the dive) and gilded edges.
export function bonusEntry(shape) {
  const base = PALETTES.find((p) => p.name === shape.palette) ?? PALETTES[0];
  const v = variant(base, 0.5, hashId(shape.id) % 1000);
  const mix = (a, b, t) => {
    const c = (h, s) => (h >> s) & 255;
    return [16, 8, 0].reduce((o, s) => o | (Math.round(c(a, s) + (c(b, s) - c(a, s)) * t) << s), 0);
  };
  const palette = { ...v, glow: mix(v.glow, 0xffd98a, 0.45), rays: mix(v.rays, 0xffd27a, 0.6), gild: 1 };
  return { shape, palette, number: '✦', bonus: true };
}

// The map's layout key: the world is rebuilt only when this changes
let worldKey = '';
let drawSeq = 0;

/**
 * Renders the map into `root`.
 * opts: { entries, solved, learned, lessons, drift: number[], driftPalette,
 *         onPlay(entry, el), onLearn(el), onDrift(n, el), fmt(seconds), scroll: bool,
 *         celebrate: bool (play one-off reveals; false for passive re-renders),
 *         world: MapWorld, onPart(region), onParted(region),
 *         openedShrines: Set of shrine ids opened by an ad (ads.js),
 *         onShrineLocked({ entry, el, reached, stars, need, solved }) -> true if it took the tap }
 */
export function renderMap(root, opts) {
  const { entries, solved, learned, lessons, drift, driftPalette } = opts;
  const celebrate = opts.celebrate !== false && !reduceMotion();
  const scroller = root.closest('.map-scroll');
  const fullW = root.clientWidth || window.innerWidth;
  const colW = Math.min(COL, fullW - 24);
  const x0 = (fullW - colW) / 2;
  // the lessons come first: until they're done, even First Light is under mist
  // (it parts the first time the map opens after them)
  const { first, open } = learned || devUnlock() ? progress(entries, solved) : { first: -1, open: entries.map(() => false) };
  const seenObjects = seenSet('strata.map.objects') ?? new Set();
  const seenChapters = seenSet('strata.map.chapters') ?? new Set();
  // chapters whose cloud has parted, and stones the gold has reached; the first
  // time this map runs, everything already reached counts as seen (no fanfare)
  const parted = seenSet('strata.map.parted');
  const lit = seenSet('strata.map.lit');

  // ---- chapters, in the order of the level set (data, never a fixed list)
  const regions = [];
  for (const e of entries) {
    const name = e.shape.chapter ?? 'The Quarry';
    let r = regions[regions.length - 1];
    if (!r || r.name !== name) {
      const ch = Shapes.CHAPTERS?.find((c) => c.name === name);
      regions.push((r = { name, numeral: ch?.numeral ?? String(regions.length + 1), items: [], index: regions.length,
        base: PALETTES.find((p) => p.name === (ch?.palette ?? e.shape.palette)) ?? e.palette }));
    }
    r.items.push(e);
  }
  for (const r of regions) {
    r.stars = r.items.reduce((n, e) => n + recordStars(e.shape, solved[e.shape.id]), 0);
    r.solvedCount = r.items.filter((e) => solved[e.shape.id]).length;
    r.complete = r.solvedCount === r.items.length;
    // a chapter is reached once one of its unsolved stones is open, or all are solved
    r.reached = r.complete || r.items.some((e) => !solved[e.shape.id] && open[entries.indexOf(e)]);
    r.awaken = r.complete && celebrate && !seenChapters.has(r.name);
  }
  const nextLocked = regions.find((r) => !r.reached);
  for (const r of regions) {
    r.folded = FOLD_LATER_CHAPTERS && !r.reached && r !== nextLocked;
    r.parting = r.reached && !!parted && !parted.has(r.name) && celebrate;
  }

  // ---- layout (y down the map, x across the page)
  const nodes = [];         // { kind, x, y, palette, entry?, n?, state, region? }
  const trail = [];         // learn + the stones that are laid out, in order
  let k = 0, y = 70;
  const place = () => x0 + colW * (0.5 + 0.28 * Math.sin(k * 0.92 + 0.5));
  const learnPal = regions[0]?.items[0].palette ?? driftPalette;
  // the first stone of all sits on the centre line; the trail swings out from it
  const learn = { kind: 'learn', x: x0 + colW * 0.5, y, palette: learnPal, sky: learnPal, state: learned ? 'solved' : 'current' };
  nodes.push(learn); trail.push(learn);
  k++; y += STEP * 0.9;

  regions.forEach((r) => {
    r.top = y;
    r.nodes = [];
    if (r.folded) {
      // a short stretch of cloud: the name, its peak, its shrine's light
      r.labelY = y + 96;
      k += r.items.length;
      y += FOLDED_H;
    } else {
      y += GAP * 0.42;
      r.labelY = y;
      y += GAP * 0.58;
      for (const e of r.items) {
        const i = entries.indexOf(e);
        const state = solved[e.shape.id] ? 'solved' : !open[i] ? 'locked' : i === first && learned ? 'current' : 'open';
        const n = { kind: 'puzzle', x: place(), y, palette: e.palette, sky: r.items[0].palette, entry: e, state, region: r };
        nodes.push(n); trail.push(n); r.nodes.push(n);
        r.last = n;
        k++; y += STEP;
      }
    }
    const b = bonusFor(r.name);
    if (b) {
      const entry = bonusEntry(b);
      const need = shrineStars(r);
      const leftSide = r.last ? r.last.x > x0 + colW / 2 : (k % 2 === 0);
      r.shrine = {
        kind: 'bonus', x: x0 + colW * (leftSide ? 0.14 : 0.86), y: r.folded ? r.labelY + 120 : r.last.y + STEP * 0.62,
        palette: entry.palette, sky: r.items[0].palette, entry, region: r, need,
        // stars open it, once the trail has reached the chapter (stars from
        // stones that moved here when the map grew don't open it from afar);
        // or an ad did, on a chapter the trail has reached (ads.js)
        state: solved[b.id] ? 'solved' : devUnlock() || (r.reached && (r.stars >= need || !!opts.openedShrines?.has(b.id))) ? 'open' : 'locked',
      };
      nodes.push(r.shrine);
      if (!r.folded) y += STEP * 0.35;
    }
    r.bottom = y;
  });

  const driftTop = y;
  y += GAP * 0.42;
  const driftLabelY = y;
  y += GAP * 0.58;
  const allSolved = learned && first < 0;
  drift.forEach((n, j) => {
    nodes.push({ kind: 'drift', x: x0 + colW * (0.5 + (j - 1) * 0.3), y: y + (j === 1 ? 26 : 0), palette: driftPalette, sky: driftPalette, n, state: allSolved && j === 0 ? 'current' : 'open' });
  });
  // below the Drift the mist sinks into night, the title's sky upside down (mapworld.js)
  const height = y + 190 + Math.round((globalThis.innerHeight || 844) * 0.8);
  root.style.height = `${height}px`;

  // the trail's x at a depth (for keeping names and scenery off it)
  const trailX = (yy) => {
    if (yy <= trail[0].y) return trail[0].x;
    for (let i = 0; i < trail.length - 1; i++) {
      const a = trail[i], b = trail[i + 1];
      if (yy >= a.y && yy <= b.y) return a.x + (b.x - a.x) * ((yy - a.y) / Math.max(1, b.y - a.y));
    }
    return trail[trail.length - 1].x;
  };
  for (const r of regions) r.labelSide = trailX(r.labelY) > x0 + colW / 2 ? -1 : 1;

  // ---- the world for this layout (rebuilt only when the layout changes)
  const headH = root.offsetTop;
  if (opts.world) {
    const key = [fullW, headH, height, ...regions.map((r) => `${r.name}:${r.top}:${r.bottom}:${r.reached ? 1 : 0}${r.parting ? 'p' : ''}${r.shrine ? Math.round(r.shrine.x) : ''}`)].join('|');
    if (key !== worldKey) {
      worldKey = key;
      const cx = fullW / 2;
      opts.world.build({
        regions: regions.map((r) => ({
          index: r.index, name: r.name, base: r.base, folded: r.folded, reached: r.reached,
          bank: !r.reached || r.parting,
          top: headH + r.top, bottom: headH + r.bottom, labelZ: headH + r.labelY, labelSide: r.labelSide,
          shrine: r.shrine ? { x: r.shrine.x - cx, z: headH + r.shrine.y } : null,
        })),
        trailX: (z) => trailX(z - headH) - cx,
        // the stones and their labels, for keeping scenery off them (a label sits on the side toward the centre)
        stones: nodes.filter((n) => n.kind !== 'drift').map((n) => ({ x: n.x - cx, z: headH + n.y, lbl: n.x > x0 + colW / 2 ? -1 : 1 })),
        driftTop: headH + driftTop, driftLabel: headH + driftLabelY, driftStones: headH + y, end: headH + height,
      });
      mark('map: world built');
    }
  }

  // ---- svg: the trail
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class', 'map-svg');
  svg.setAttribute('width', fullW);
  svg.setAttribute('height', height);
  svg.setAttribute('viewBox', `0 0 ${fullW} ${height}`);
  svg.style.width = `${fullW}px`;
  svg.style.height = `${height}px`;
  const pts = trail.map((n) => [n.x, n.y]);
  const segD = (i, move = true) => segment(pts[i - 1] ?? pts[i], pts[i], pts[i + 1], pts[i + 2] ?? pts[i + 1], move);
  const draws = [];
  let markup = '';
  const parts = [];   // { html, y0, y1 }: every path, to be filed into a band
  const extent = (...ys) => [Math.min(...ys), Math.max(...ys)];
  for (let i = 0; i < pts.length - 1; i++) {
    const a = trail[i], b = trail[i + 1];
    // nothing under the mist: a chapter not yet reached shows no trail
    if (b.region && !b.region.reached) continue;
    // inside a chapter whose mist is about to lift, the trail is created hidden
    // (class in-parting) and appears as it clears: never shown first, then hidden
    const hide = b.region?.parting ? ' in-parting' : '';   // including the stretch that leads into it
    // today's trail: dotted, solid where walked, in the colour of the stone it leads to;
    // a stretch walked for the first time draws itself on
    const walked = b.state !== 'locked' && a.state === 'solved';
    const id = b.entry?.shape.id ?? b.kind;
    const fresh = walked && celebrate && lit && !lit.has(id);
    if (fresh) draws.push({ i, id });
    const [p0, p3] = [pts[i - 1] ?? pts[i], pts[i + 2] ?? pts[i + 1]];
    const [y0, y1] = extent(a.y, b.y, a.y + (b.y - p0[1]) / 6, b.y - (p3[1] - a.y) / 6);
    parts.push({ y0, y1, html: `<path d="${segD(i)}" data-seg="${a.entry?.shape.id ?? a.kind}>${id}" class="trail${walked ? ' walked' : ''}${fresh ? ' draw' : ''}${hide}" stroke="${hex(b.palette.under)}"/>` });
  }
  // a faint spur from each chapter's last stone to its shrine
  for (const r of regions) {
    if (!r.shrine || !r.last || !r.reached) continue;
    const a = r.last, s = r.shrine;
    // one path, dotted until the shrine is kept, then solid: same d either way
    parts.push({ y0: Math.min(a.y, s.y), y1: Math.max(a.y, s.y), html: `<path d="M${a.x},${a.y}Q${(a.x + s.x) / 2},${s.y} ${s.x},${s.y}" data-seg="${a.entry?.shape.id}>${s.entry.shape.id}" class="trail spur${s.state === 'solved' ? ' walked' : ''}${r.parting ? ' in-parting' : ''}" stroke="${hex(a.palette.under)}"/>` });
  }

  // ---- DOM: names and stones
  root.innerHTML = '';
  root.appendChild(svg);
  // Stones and trail are filed into bands down the page, each with
  // content-visibility: auto, so the browser skips painting (and re-layerizing)
  // every band off screen. A path that won't fit its band stays in the page-wide svg.
  const bands = new Map();
  const bandFor = (y) => {
    const i = Math.max(0, Math.floor(y / BAND));
    let g = bands.get(i);
    if (!g) {
      const top = i * BAND - BAND_PAD, h = Math.min(BAND + 2 * BAND_PAD, height - top);   // the last band stops at the map's end, or it scrolls on past it
      const el = document.createElement('div');
      el.className = 'map-band';
      el.style.top = `${top}px`; el.style.height = `${h}px`;
      const bs = document.createElementNS(NS, 'svg');
      bs.setAttribute('class', 'map-svg');
      bs.setAttribute('width', fullW); bs.setAttribute('height', h);
      bs.setAttribute('viewBox', `0 ${top} ${fullW} ${h}`);   // page coordinates, unchanged
      bs.style.width = `${fullW}px`; bs.style.height = `${h}px`;
      el.appendChild(bs);
      g = { el, svg: bs, top, h, markup: '' };
      bands.set(i, g);
    }
    return g;
  };
  for (const part of parts) {
    const g = bandFor(part.y0);
    if (part.y0 >= g.top && part.y1 <= g.top + g.h) g.markup += part.html; else markup += part.html;
  }
  svg.innerHTML = markup;
  for (const r of regions) {
    const el = document.createElement('div');
    const dark = lum(r.base.skyTop) < 0.45;
    const left = r.labelSide < 0;
    el.className = `map-region ${left ? 'at-left' : 'at-right'}${dark ? ' on-dark' : ''}${r.reached ? '' : ' veiled'}${r.awaken ? ' awaken' : ''}`;
    el.style.top = `${r.labelY}px`;
    el.style.setProperty('--edge', `${x0 + 8}px`);
    el.innerHTML = `<span class="r-num">${esc(r.numeral)}</span><span class="r-name">${esc(r.name)}</span><span class="r-sub">${r.stars} / ${r.items.length * 3} ★</span>`;
    root.appendChild(el);
    r.el = el;
  }
  {
    const el = document.createElement('div');
    el.className = 'map-region at-centre on-dark';
    el.style.top = `${driftLabelY}px`;
    el.innerHTML = '<span class="r-name">Drift</span><span class="r-sub">endless · carved at random</span>';
    root.appendChild(el);
  }

  let current = null;
  const newlySeen = [];
  for (const n of nodes) {
    // stones of a chapter under cloud aren't there yet (its shrine's light is)
    if (n.kind === 'puzzle' && !n.region.reached) continue;
    const p = n.palette;
    const b = document.createElement('button');
    const side = n.kind === 'drift' ? '' : n.x > x0 + colW / 2 ? ' lbl-left' : ' lbl-right';
    const dark = lum(n.sky.skyTop) < 0.45;
    b.className = `map-node ${n.kind} ${n.state}${side}${dark ? ' on-dark' : ''}` + (n.region?.parting ? ' veiled-in' : '');
    if (n.entry) b.dataset.id = n.entry.shape.id;
    const band = bandFor(n.y);
    b.style.left = `${n.x}px`;
    b.style.top = `${n.y - band.top}px`;
    b.dataset.y = n.y;
    b.style.setProperty('--glow', hex(p.glow));
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
        meta = s ? starRow(recordStars(shape, s)) : n.state === 'locked' ? `${n.region.stars} / ${shrineStars(n.region)} ★` : 'open';
        if (!s) art = shrine(n.region.base, n.state);
        if (!n.region.reached) b.classList.add('far');
      } else {
        name = s ? shape.name : n.state === 'locked' ? '' : '???';
        meta = s ? starRow(recordStars(shape, s)) : '';
      }
      if (s) {
        // the stone has become the thing it was hiding
        const fresh = celebrate && !seenObjects.has(shape.id);
        art = `${fresh ? cube(hex(p.top), hex(p.lit), hex(p.shade), 46) : ''}<img class="obj" alt="" src="${renderThumb(shape, p, { size: 120, glow: true })}">`;
        if (fresh) { b.classList.add('fresh'); newlySeen.push(shape.id); }
      }
      b.setAttribute('aria-label', `${isBonus ? `${n.region.name} shrine` : `Puzzle ${number}`}` +
        (s ? `, ${shape.name}, solved` : n.state === 'locked' ? (isBonus ? `, opens at ${shrineStars(n.region)} stars` : ', locked') : ''));
      if (n.state === 'locked') {
        b.setAttribute('aria-disabled', 'true');
        b.addEventListener('click', () => {
          // a shrine short only of stars may be offered another way in (main.js)
          if (isBonus && opts.onShrineLocked?.({ entry: n.entry, el: b, reached: n.region.reached, stars: n.region.stars, need: shrineStars(n.region), solved: false })) return;
          b.classList.remove('nudge'); void b.offsetWidth; b.classList.add('nudge');
        });
      } else {
        b.addEventListener('click', () => opts.onPlay(n.entry, b));
      }
    }
    b.innerHTML = `<span class="halo"></span><span class="ring"></span>${art}
      ${n.state === 'solved' && n.kind === 'learn' ? '<span class="mark" aria-hidden="true"></span>' : ''}
      <span class="label">${num ? `<span class="n">${num}</span>` : ''}<span class="nm">${esc(name)}</span><span class="mt">${meta}</span></span>`;
    band.el.appendChild(b);
    n.el = b;
    if (n.state === 'current' && !current) current = n;
  }

  for (const g of [...bands.keys()].sort((a, b) => a - b).map((k) => bands.get(k))) {
    g.svg.innerHTML = g.markup;
    g.el.prepend(g.svg);
    root.appendChild(g.el);
  }

  if (newlySeen.length) { newlySeen.forEach((id) => seenObjects.add(id)); saveSet('strata.map.objects', seenObjects); }
  const woke = regions.filter((r) => r.awaken);
  if (woke.length) { woke.forEach((r) => seenChapters.add(r.name)); saveSet('strata.map.chapters', seenChapters); }
  // the first run marks what is already there as seen; a passive render saves nothing
  const goldIds = trail.filter((n, i) => i > 0 && n.state !== 'locked').map((n) => n.entry?.shape.id ?? n.kind);
  if (!lit || celebrate) saveSet('strata.map.lit', new Set([...(lit ?? []), ...goldIds]));
  const reachedNames = regions.filter((r) => r.reached).map((r) => r.name);
  if (!parted || celebrate) saveSet('strata.map.parted', new Set([...(parted ?? []), ...reachedNames]));

  // ---- the companion keeps you company at the newest stone
  const home = current
    ?? [...trail].reverse().find((n) => n.state === 'solved' && n.kind === 'puzzle')
    ?? trail[0];
  // a newly reached chapter's cloud parts first; then the companion walks over into it
  const partingRegions = regions.filter((r) => r.parting);
  const partAt = 0.9, walkAt = partingRegions.length && opts.world ? partAt + DUR.ceremony * 1.7 : 0.55;
  const walk = placeCompanion(root, svg, trail, pts, segD, home, celebrate, walkAt);

  // ---- the gold draws on as the companion walks
  const drawStart = walkAt, drawDur = walk ?? 0.9;
  root.querySelectorAll('.trail.draw').forEach((path) => {
    const len = path.getTotalLength?.() ?? 200;
    path.style.setProperty('--len', (len + 2).toFixed(1));
    path.style.setProperty('--d', `${(drawDur / motionRate).toFixed(2)}s`);
    path.style.setProperty('--delay', `${(drawStart / motionRate).toFixed(2)}s`);
  });
  if (draws.length) mark(`map: gold draws on (${draws.length})`);
  if (partingRegions.length && opts.world) partCloud(opts, partingRegions, partAt, root);

  // ---- open on the current stone, a chapter whose cloud parts, or one that has just woken
  if (opts.scroll !== false && scroller) {
    const target = partingRegions.length ? { y: partingRegions[0].top - scroller.clientHeight * 0.08 }
      : woke.length && woke[0].last ? { y: woke[0].last.y + STEP * 0.35 } : current ?? nodes[0];
    scroller.scrollTop = Math.max(0, headH + target.y - scroller.clientHeight * 0.45);
  }
  return { current, parting: partingRegions.map((r) => r.name) };
}

// The cloud over a newly reached chapter parts from the trail outward; its
// stones appear as it clears, and its name wakes. Once per chapter.
function partCloud(opts, regions, delay, root) {
  for (const r of regions) opts.world.setPart(r.index, 0);
  after(delay, () => regions.forEach((r, j) => after(j * DUR.ceremony, () => {
    if (!root.isConnected) return;
    mark(`map: cloud parts over ${r.name}`);
    opts.onPart?.(r);
    r.el?.classList.add('waking');
    const stones = r.nodes.map((n) => n.el).filter(Boolean);
    if (r.shrine?.el) stones.push(r.shrine.el);
    const span = Math.max(1, r.bottom - r.top);
    after(DUR.ceremony * 0.5, () => root.querySelectorAll('.in-parting').forEach((p) => p.classList.remove('in-parting')));
    const t0 = performance.now(), dur = DUR.ceremony * 2 * 1000 / motionRate;
    const step = () => {
      const k = Math.min(1, (performance.now() - t0) / dur);
      opts.world.setPart(r.index, k);   // linear: the world staggers each billow by its distance from the trail
      for (const el of stones) if (el.classList.contains('veiled-in') && k > 0.2 + 0.55 * ((parseFloat(el.dataset.y) - r.top) / span)) el.classList.remove('veiled-in');
      if (k < 1) requestAnimationFrame(step);
      else { for (const el of stones) el.classList.remove('veiled-in'); mark(`map: ${r.name} clear`); opts.onParted?.(r); }
    };
    requestAnimationFrame(step);
  })));
}

// Sits beside `home`, on the side away from its label. If it was last seen
// further back along the trail, it walks there first. Returns the walk's
// length in seconds (or null when it doesn't walk).
function placeCompanion(root, svg, trail, pts, segD, home, celebrate, delay = 0.55) {
  const key = (n) => (n.entry ? n.entry.shape.id : n.kind);
  const to = trail.indexOf(home);
  if (to < 0) return null;
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
  if (!celebrate || from < 0 || from >= to) { put([hx, hy], hx < home.x); return null; }

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
  const t0 = performance.now() + delay * 1000 / motionRate;
  let lastX = start[0];
  const tick = (now) => {
    if (!el.isConnected) return;
    const k = Math.max(0, Math.min(1, (now - t0) / (dur / motionRate)));
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
  return dur / 1000;
}

const STAR = '<svg viewBox="0 0 24 24"><path d="M12 2.8l2.7 5.9 6.4.7-4.8 4.3 1.4 6.3L12 16.8 6.3 20l1.4-6.3-4.8-4.3 6.4-.7z"/></svg>';
function starRow(n) {
  return `<span class="stars-mini" aria-label="${n} of 3 stars">${[0, 1, 2].map((k) => `<i class="${k < n ? 'on' : ''}">${STAR}</i>`).join('')}</span>`;
}
