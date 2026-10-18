// The object gallery: every candidate, by chapter theme, in its chapter's sky.
// Built-in candidates live in themes/<theme>.js; other builders add files to
// extra/ and list them in extra/manifest.json ("<theme>-<n>.js"), which are
// merged into their theme with numbering continuing (I-01 … I-NN).
// Further pages (?page=2 …) hold fresh rounds of ideas: page<n>/manifest.json
// lists "<theme>-<k>.js" files in page<n>/; their cards are numbered P2·I-01.
// The Live page (?page=live) shows every object in the game, by chapter in
// play order, numbered by level as on the map (L-01 …); shrines are ✦.
import * as THREE from 'three';
import { PALETTES } from '../js/palettes.js';
import { renderThumb } from '../js/thumbs.js';
import { objectMesh, isoCamera } from '../js/objectmesh.js';
import { makeOrbit, SHOW_SPIN } from '../js/orbit.js';
import { stats } from './stats.js';
import { SHAPES, CHAPTERS, BONUS } from '../js/shapes.js';
// gallery objects that are levels in the game now (levels made from them carry `from`)
const IN_GAME = new Set([...SHAPES, ...BONUS].map((s) => s.from).filter(Boolean));

const THEMES = [
  { key: 'home', numeral: 'I', name: 'Home & Morning', chapter: 'First Light', palette: 'Dawn' },
  { key: 'garden', numeral: 'II', name: 'Garden & Small Creatures', chapter: 'Moss Garden', palette: 'Mint' },
  { key: 'sea', numeral: 'III', name: 'Sea & Shore', chapter: 'The Lagoon', palette: 'Lagoon' },
  { key: 'temples', numeral: 'IV', name: 'Temples & Lanterns', chapter: 'Ember Steps', palette: 'Dusk' },
  { key: 'sky', numeral: 'V', name: 'Sky & Night', chapter: 'Starfall', palette: 'Night' },
];

const $ = (s) => document.querySelector(s);
const hex = (h) => '#' + h.toString(16).padStart(6, '0');
const PICKS = 'strata.gallery.picks';
const picks = new Set(JSON.parse(localStorage.getItem(PICKS) || '[]'));

// The same object turned half way round, for a second angle on the card.
const turned = (s) => {
  const [X, , Z] = s.dims;
  return { ...s, id: s.id + ':back', cell: (x, y, z) => s.cell(X - 1 - x, y, Z - 1 - z) };
};

const PARAM = new URLSearchParams(location.search).get('page');
const LIVE = PARAM === 'live';
const PAGE = LIVE ? 0 : Math.max(1, Number(PARAM) || 1);
const PAGES = 2;
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
// sections: chapter themes on the idea pages, the game's chapters on Live
const SECTIONS = LIVE
  ? CHAPTERS.map((c, i) => ({ key: c.name, numeral: ROMAN[i] ?? String(i + 1), name: c.name, chapter: c.blurb ?? '', palette: c.palette }))
  : THEMES;
const numberOf = (t, k) => LIVE
  ? (lists[t.key][k].bonus ? `✦ ${t.numeral}` : `L-${String(SHAPES.indexOf(lists[t.key][k]) + 1).padStart(2, '0')}`)
  : `${PAGE > 1 ? `P${PAGE}·` : ''}${t.numeral}-${String(k + 1).padStart(2, '0')}`;

async function load() {
  if (LIVE) {
    const lists = {};
    for (const c of CHAPTERS) lists[c.name] = [...SHAPES.filter((s) => s.chapter === c.name), ...BONUS.filter((b) => b.chapter === c.name)];
    return lists;
  }
  const lists = {};
  const dir = PAGE > 1 ? `page${PAGE}` : 'extra';
  for (const t of THEMES) lists[t.key] = PAGE > 1 ? [] : [...(await import(`./themes/${t.key}.js`)).default];
  try {
    const manifest = await (await fetch(`${dir}/manifest.json`, { cache: 'no-store' })).json();
    for (const file of manifest) {
      const key = file.split('-')[0];
      if (!lists[key]) continue;
      try { lists[key].push(...(await import(`./${dir}/${file}`)).default); } catch (e) { console.warn('gallery: skipped', file, e); }
    }
  } catch { /* nothing more on this page */ }
  return lists;
}

// page links under the title
{
  const nav = document.createElement('nav');
  nav.className = 'pages';
  const live = document.createElement('a');
  live.href = 'index.html?page=live';
  live.textContent = 'Live';
  if (LIVE) live.className = 'on';
  nav.appendChild(live);
  for (let n = 1; n <= PAGES; n++) {
    const a = document.createElement('a');
    a.href = n === 1 ? 'index.html' : `index.html?page=${n}`;
    a.textContent = `Page ${n}`;
    if (n === PAGE) a.className = 'on';
    nav.appendChild(a);
  }
  document.querySelector('header.top').appendChild(nav);
}

function inkFor(p) {
  const sky = new THREE.Color(p.skyTop).lerp(new THREE.Color(p.skyBottom), 0.5);
  const dark = sky.getHSL({}).l < 0.42;
  return { dark, ink: dark ? '#eef0ff' : '#' + new THREE.Color(p.under).multiplyScalar(0.8).getHexString() };
}

function renderPicks() {
  const bar = $('#picks');
  bar.classList.toggle('show', picks.size > 0);
  $('#picks-text').textContent = `${picks.size} picked · ${[...picks].join(', ')}`;
}

const lists = await load();
const root = $('#themes');
for (const t of SECTIONS) {
  if (!lists[t.key].length) continue;              // later pages show only themes with new ideas
  const p = PALETTES.find((q) => q.name === t.palette);
  const { dark, ink } = inkFor(p);
  const sec = document.createElement('section');
  sec.className = 'theme';
  sec.id = t.key;
  sec.style.setProperty('--sky-top', hex(p.skyTop));
  sec.style.setProperty('--sky-bottom', hex(p.skyBottom));
  sec.style.setProperty('--ink', ink);
  sec.style.setProperty('--card', dark ? 'rgba(255,255,255,.08)' : 'rgba(255,250,243,.55)');
  sec.innerHTML = `<header><div class="numeral">${t.numeral}</div><h2>${t.name}</h2><div class="chapter">${t.chapter}</div></header><div class="grid"></div>`;
  const grid = sec.querySelector('.grid');
  lists[t.key].forEach((shape, k) => {
    const num = numberOf(t, k);
    const st = stats(shape);
    const card = document.createElement('button');
    const inGame = !LIVE && IN_GAME.has(shape.id);
    card.className = 'card' + (picks.has(num) ? ' picked' : '') + (shape.qa === 'drop' ? ' dropped' : '') + (inGame ? ' in-game' : '');
    if (shape.qa === 'drop') card.title = shape.qaWhy ?? 'flagged to drop in QA';
    card.innerHTML = `<span class="num">${num}</span>
      <span class="heart" role="button" aria-label="Pick">♥</span>
      ${inGame ? '<span class="live-mark" title="In the game">✓ live</span>' : ''}
      <span class="pics"><img alt=""><img class="alt" alt=""></span>
      <span class="name">${shape.name}</span>
      <span class="meta${st.solvable ? '' : ' bad'}">${shape.dims.join('×')} · ${st.cubes} cubes · ${st.solvable ? 'D ' + st.D.toFixed(1) : 'unsolvable'}</span>
      ${shape.qa === 'drop' ? `<span class="qa-drop">QA: drop · ${shape.qaWhy ?? ''}</span>` : ''}`;
    const [a, b] = card.querySelectorAll('img');
    a.src = renderThumb(shape, p, { size: 150 });
    b.src = renderThumb(turned(shape), p, { size: 80 });
    card.querySelector('.heart').addEventListener('click', (e) => {
      e.stopPropagation();
      if (picks.has(num)) picks.delete(num); else picks.add(num);
      localStorage.setItem(PICKS, JSON.stringify([...picks]));
      card.classList.toggle('picked', picks.has(num));
      renderPicks();
    });
    card.addEventListener('click', () => openViewer(shape, p, num, st, ink));
    grid.appendChild(card);
  });
  root.appendChild(sec);
}
renderPicks();
$('#picks-copy').addEventListener('click', async () => {
  const text = [...picks].map((n) => {
    for (const t of SECTIONS) {
      const k = lists[t.key].findIndex((_, i) => numberOf(t, i) === n);
      if (k >= 0) return `${n} ${lists[t.key][k].name}`;
    }
    return n;
  }).join('\n');
  try { await navigator.clipboard.writeText(text); $('#picks-copy').textContent = 'copied'; } catch { prompt('Your picks', text); }
  setTimeout(() => { $('#picks-copy').textContent = 'copy'; }, 1500);
});

// clear every pick (both pages) - a second tap confirms, so a stray tap can't wipe them
let clearArmed = 0;
$('#picks-clear').addEventListener('click', () => {
  const btn = $('#picks-clear');
  if (!clearArmed) {
    btn.textContent = 'sure?';
    clearArmed = setTimeout(() => { clearArmed = 0; btn.textContent = 'clear'; }, 2500);
    return;
  }
  clearTimeout(clearArmed);
  clearArmed = 0;
  picks.clear();
  localStorage.setItem(PICKS, '[]');
  document.querySelectorAll('.card.picked').forEach((c) => c.classList.remove('picked'));
  btn.textContent = 'clear';
  renderPicks();
});

// ---- the turntable, as in the journal
let closeViewer = null;
function openViewer(shape, palette, num, st, ink) {
  closeViewer?.();
  const pane = $('#viewer'), canvas = pane.querySelector('canvas');
  pane.style.setProperty('--sky-top', hex(palette.skyTop));
  pane.style.setProperty('--sky-bottom', hex(palette.skyBottom));
  pane.style.color = ink;
  pane.querySelector('.num').textContent = num;
  pane.querySelector('.name').textContent = shape.name;
  pane.querySelector('.meta').textContent = `${shape.dims.join(' × ')} · ${st.cubes} cubes · ${st.solvable ? 'D ' + st.D.toFixed(1) : 'unsolvable'}`;
  pane.classList.add('show');

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const mesh = objectMesh(shape, palette);
  const pivot = new THREE.Group();
  pivot.add(mesh);
  scene.add(pivot);
  const camera = isoCamera(mesh.userData.radius);
  const controls = makeOrbit(camera, canvas);
  let last = performance.now(), raf = 0;
  const size = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    const r = mesh.userData.radius * 1.08, a = w / h;
    Object.assign(camera, a >= 1 ? { left: -r * a, right: r * a, top: r, bottom: -r } : { left: -r, right: r, top: r / a, bottom: -r / a });
    camera.updateProjectionMatrix();
  };
  const frame = (t) => {
    const dt = Math.min(0.05, (t - last) / 1000);
    last = t;
    pivot.rotation.y += SHOW_SPIN * dt;
    controls.update();
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  };
  window.addEventListener('resize', size);
  size();
  raf = requestAnimationFrame(frame);
  closeViewer = () => {
    cancelAnimationFrame(raf);
    controls.dispose();
    window.removeEventListener('resize', size);
    mesh.geometry.dispose(); mesh.material.dispose();
    renderer.dispose();
    pane.classList.remove('show');
    closeViewer = null;
  };
}
$('#viewer-close').addEventListener('click', () => closeViewer?.());
window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeViewer?.(); });
