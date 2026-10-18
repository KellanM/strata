// The object gallery: every candidate, by chapter theme, in its chapter's sky.
// Built-in candidates live in themes/<theme>.js; other builders add files to
// extra/ and list them in extra/manifest.json ("<theme>-<n>.js"), which are
// merged into their theme with numbering continuing (I-01 … I-NN).
import * as THREE from 'three';
import { PALETTES } from '../js/palettes.js';
import { renderThumb } from '../js/thumbs.js';
import { objectMesh, isoCamera } from '../js/objectmesh.js';
import { makeOrbit, SHOW_SPIN } from '../js/orbit.js';
import { stats } from './stats.js';

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

async function load() {
  const lists = {};
  for (const t of THEMES) lists[t.key] = [...(await import(`./themes/${t.key}.js`)).default];
  try {
    const manifest = await (await fetch('extra/manifest.json', { cache: 'no-store' })).json();
    for (const file of manifest) {
      const key = file.split('-')[0];
      if (!lists[key]) continue;
      try { lists[key].push(...(await import(`./extra/${file}`)).default); } catch (e) { console.warn('gallery: skipped', file, e); }
    }
  } catch { /* no extras */ }
  return lists;
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
for (const t of THEMES) {
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
    const num = `${t.numeral}-${String(k + 1).padStart(2, '0')}`;
    const st = stats(shape);
    const card = document.createElement('button');
    card.className = 'card' + (picks.has(num) ? ' picked' : '');
    card.innerHTML = `<span class="num">${num}</span>
      <span class="heart" role="button" aria-label="Pick">♥</span>
      <span class="pics"><img alt=""><img class="alt" alt=""></span>
      <span class="name">${shape.name}</span>
      <span class="meta${st.solvable ? '' : ' bad'}">${shape.dims.join('×')} · ${st.cubes} cubes · ${st.solvable ? 'D ' + st.D.toFixed(1) : 'unsolvable'}</span>`;
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
    for (const t of THEMES) {
      const k = lists[t.key].findIndex((_, i) => `${t.numeral}-${String(i + 1).padStart(2, '0')}` === n);
      if (k >= 0) return `${n} ${lists[t.key][k].name}`;
    }
    return n;
  }).join('\n');
  try { await navigator.clipboard.writeText(text); $('#picks-copy').textContent = 'copied'; } catch { prompt('Your picks', text); }
  setTimeout(() => { $('#picks-copy').textContent = 'copy'; }, 1500);
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
