// The journal: every object you've uncovered, gathered by chapter. Solved
// ones show a small render, their name and stars; the rest are a quiet "?".
// Tapping a solved one opens it on a turntable you can turn with a finger,
// with its one-line story beneath.
import * as THREE from 'three';
import { CHAPTERS } from './shapes.js';
import { recordStars } from './score.js';
import { renderThumb } from './thumbs.js';
import { objectMesh, isoCamera } from './objectmesh.js';
import { makeOrbit, SHOW_SPIN } from './orbit.js';

const STAR = '<svg viewBox="0 0 24 24"><path d="M12 2.8l2.7 5.9 6.4.7-4.8 4.3 1.4 6.3L12 16.8 6.3 20l1.4-6.3-4.8-4.3 6.4-.7z"/></svg>';
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const hex = (h) => '#' + h.toString(16).padStart(6, '0');

// entries: [{ shape, palette }] for every level and bonus stone.
export function renderJournal(root, { entries, solved }) {
  const total = entries.length;
  const found = entries.filter((e) => solved[e.shape.id]).length;
  root.querySelector('#journal-count').textContent = `${found} of ${total} uncovered`;
  const grid = root.querySelector('#journal-grid');
  grid.innerHTML = '';
  for (const ch of CHAPTERS) {
    const items = entries.filter((e) => e.shape.chapter === ch.name);
    if (!items.length) continue;
    const sec = document.createElement('section');
    sec.className = 'jr-chapter';
    sec.innerHTML = `<h3><span>${ch.numeral}</span>${esc(ch.name)}</h3><div class="jr-tiles"></div>`;
    const tiles = sec.querySelector('.jr-tiles');
    for (const e of items) {
      const rec = solved[e.shape.id];
      const b = document.createElement('button');
      b.className = 'jr-tile' + (rec ? ' found' : '') + (e.shape.bonus ? ' bonus' : '');
      b.style.setProperty('--tint', hex(e.palette.skyTop));
      if (rec) {
        const n = recordStars(e.shape, rec);
        b.innerHTML = `<img alt="" draggable="false"><span class="nm">${esc(e.shape.name)}</span>
          <span class="stars-mini">${[0, 1, 2].map((k) => `<i class="${k < n ? 'on' : ''}">${STAR}</i>`).join('')}</span>`;
        b.setAttribute('aria-label', `${e.shape.name}, ${n} of 3 stars`);
        Promise.resolve(renderThumb(e.shape, e.palette, { size: 96, angle: 0 })).then((url) => { b.querySelector('img').src = url; });
        b.addEventListener('click', () => openView(root, e));
      } else {
        b.innerHTML = `<span class="unknown">?</span><span class="nm">${e.shape.bonus ? 'hidden stone' : '&nbsp;'}</span>`;
        b.setAttribute('aria-label', 'Not yet uncovered');
        b.disabled = true;
      }
      tiles.appendChild(b);
    }
    grid.appendChild(sec);
  }
}

// ---- the turntable

let view = null;

function openView(root, entry) {
  closeView();
  const pane = root.querySelector('#journal-view');
  const canvas = pane.querySelector('canvas');
  pane.querySelector('.jv-name').textContent = entry.shape.name;
  pane.querySelector('.jv-story').textContent = entry.shape.story ?? '';
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
