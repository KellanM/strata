// The journal: every object you've uncovered, gathered by chapter like the
// map, each chapter on its own sky. Found objects sit in a little pool of
// light with their gems (the same gold diamonds as the win screen); the rest
// are a soft dark blur, waiting. Each chapter shows how much of it has been
// found, and glows when complete.
// Tapping a found object opens it on a turntable with its one-line story.
import * as THREE from 'three';
import { CHAPTERS } from './shapes.js';
import { PALETTES } from './palettes.js';
import { recordStars } from './score.js';
import { renderThumb } from './thumbs.js';
import { objectMesh, isoCamera } from './objectmesh.js';
import { makeOrbit, SHOW_SPIN } from './orbit.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const hex = (h) => '#' + h.toString(16).padStart(6, '0');
// a faceted diamond: lit and shaded halves, like the gems on the win screen
// (an unearned one shows only its outline, drawn as one path so no seam runs down the middle)
const GEM = '<svg viewBox="0 0 12 16" aria-hidden="true"><path class="l" d="M6 0 0 8l6 8z"/><path class="r" d="M6 0l6 8-6 8z"/><path class="o" d="M6 .7 .9 8 6 15.3 11.1 8z"/></svg>';
const gems = (n) => `<span class="jr-gems">${[0, 1, 2].map((k) => `<i class="${k < n ? 'on' : ''}">${GEM}</i>`).join('')}</span>`;
// not found yet: a soft dark blur where the object will be
const SHADOW = '<i class="jr-shadow" aria-hidden="true"></i>';

function inkFor(p) {
  const sky = new THREE.Color(p.skyTop).lerp(new THREE.Color(p.skyBottom), 0.5);
  const dark = sky.getHSL({}).l < 0.45;
  return dark ? '#f4f1ff' : '#' + new THREE.Color(p.under).multiplyScalar(0.72).getHexString();
}

// entries: [{ shape, palette }] for every level and bonus stone.
export function renderJournal(root, { entries, solved }) {
  const total = entries.length;
  const found = entries.filter((e) => solved[e.shape.id]).length;
  const gemsWon = entries.reduce((n, e) => n + (solved[e.shape.id] ? recordStars(e.shape, solved[e.shape.id]) : 0), 0);
  root.querySelector('#journal-count').innerHTML = `${found} of ${total} found <span class="jr-total">${GEM}${gemsWon} / ${total * 3}</span>`;
  const grid = root.querySelector('#journal-grid');
  grid.innerHTML = '';
  CHAPTERS.forEach((ch) => {
    const items = entries.filter((e) => e.shape.chapter === ch.name);
    if (!items.length) return;
    const p = PALETTES.find((q) => q.name === ch.palette) ?? PALETTES[0];
    const have = items.filter((e) => solved[e.shape.id]).length;
    const complete = have === items.length;
    const sec = document.createElement('section');
    sec.className = 'jr-chapter' + (complete ? ' complete' : '');
    sec.style.setProperty('--sky-top', hex(p.skyTop));
    sec.style.setProperty('--sky-bottom', hex(p.skyBottom));
    sec.style.setProperty('--glow', hex(p.glow));
    sec.style.setProperty('--ink', inkFor(p));
    if (inkFor(p) === '#f4f1ff') sec.classList.add('dark');
    sec.innerHTML = `<header>
        <span class="jr-numeral">${ch.numeral}</span>
        <h3>${esc(ch.name)}</h3>
        <span class="jr-progress">${complete ? 'complete' : `${have} of ${items.length}`}</span>
        <span class="jr-bar"><i style="width:${(100 * have / items.length).toFixed(1)}%"></i></span>
      </header><div class="jr-tiles"></div>`;
    const tiles = sec.querySelector('.jr-tiles');
    for (const e of items) {
      const rec = solved[e.shape.id];
      const b = document.createElement('button');
      b.className = 'jr-tile' + (rec ? ' found' : '') + (e.shape.bonus ? ' bonus' : '');
      if (rec) {
        const n = recordStars(e.shape, rec);
        b.innerHTML = `<span class="jr-pic"><img alt="" draggable="false"></span><span class="nm">${esc(e.shape.name)}</span>${gems(n)}`;
        b.setAttribute('aria-label', `${e.shape.name}, ${n} of 3 gems`);
        Promise.resolve(renderThumb(e.shape, e.palette, { size: 120 })).then((url) => { b.querySelector('img').src = url; });
        b.addEventListener('click', () => openView(root, e, n));
      } else {
        b.innerHTML = `<span class="jr-pic">${SHADOW}</span><span class="nm">${e.shape.bonus ? 'shrine' : '&nbsp;'}</span>`;
        b.setAttribute('aria-label', e.shape.bonus ? 'A shrine, not yet opened' : 'Not yet uncovered');
        b.disabled = true;
      }
      tiles.appendChild(b);
    }
    grid.appendChild(sec);
  });
}

// ---- the turntable

let view = null;

function openView(root, entry, earned = 0) {
  closeView();
  const pane = root.querySelector('#journal-view');
  const canvas = pane.querySelector('canvas');
  pane.querySelector('.jv-name').textContent = entry.shape.name;
  pane.querySelector('.jv-story').textContent = entry.shape.story ?? '';
  pane.querySelector('.jv-gems').innerHTML = gems(earned);
  pane.querySelector('.jv-chapter').textContent = entry.shape.chapter ?? '';
  pane.style.setProperty('--sky-top', hex(entry.palette.skyTop));
  pane.style.setProperty('--sky-bottom', hex(entry.palette.skyBottom));
  // ink from the object's own palette, whatever level is playing behind
  const sky = new THREE.Color(entry.palette.skyTop).lerp(new THREE.Color(entry.palette.skyBottom), 0.5);
  pane.style.color = sky.getHSL({}).l < 0.4 ? '#eef0ff' : '#' + new THREE.Color(entry.palette.under).multiplyScalar(0.8).getHexString();
  pane.classList.add('show');

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const mesh = objectMesh(entry.shape, entry.palette);
  const pivot = new THREE.Group();
  pivot.add(mesh);
  scene.add(pivot);
  const camera = isoCamera(mesh.userData.radius);

  // the same orbit as the puzzle and the win screen, over the same slow turntable spin
  const controls = makeOrbit(camera, canvas);
  controls.target.set(0, 0, 0);
  const state = { last: performance.now(), raf: 0 };
  const size = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    const r = mesh.userData.radius * 1.08, a = w / h;
    Object.assign(camera, a >= 1 ? { left: -r * a, right: r * a, top: r, bottom: -r } : { left: -r, right: r, top: r / a, bottom: -r / a });
    camera.updateProjectionMatrix();
  };
  const frame = (t) => {
    const dt = Math.min(0.05, (t - state.last) / 1000);
    state.last = t;
    pivot.rotation.y += SHOW_SPIN * dt;
    controls.update();
    renderer.render(scene, camera);
    state.raf = requestAnimationFrame(frame);
  };
  window.addEventListener('resize', size);
  size();
  state.raf = requestAnimationFrame(frame);

  view = () => {
    cancelAnimationFrame(state.raf);
    controls.dispose();
    window.removeEventListener('resize', size);
    mesh.geometry.dispose();
    mesh.material.dispose();
    renderer.dispose();
    pane.classList.remove('show');
  };
}

export function closeView() {
  if (view) { view(); view = null; }
}

export function viewOpen() { return !!view; }
