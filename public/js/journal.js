// The journal (Finds, to the player): every object you've uncovered, gathered by
// chapter like the map, each chapter its own page on its own sky, a hairline between;
// the worlds not yet reached are only named, at the end. Found objects sit in a little pool of
// light with their gems (the same gold diamonds as the win screen); the rest
// are a soft dark blur, waiting. Each chapter shows how much of it has been
// found, and glows when complete.
// Tapping a found object opens it on a turntable with its one-line story.
import * as THREE from 'three';
import { CHAPTERS } from './shapes.js';
import { t as tr, objName, storyOf, chapterName } from './i18n.js';
import { PALETTES } from './palettes.js';
import { recordStars } from './score.js';
import { renderThumb, renderRim } from './thumbs.js';
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

// a found object's tile: its picture on its own sky, its name and gems; tapped, its turntable
function foundTile(root, e, n, label) {
  const b = document.createElement('button');
  b.className = 'jr-tile found' + (e.shape.bonus ? ' bonus' : '');
  b.innerHTML = `<span class="jr-pic"><img alt="" draggable="false"><img class="obj-rim" alt="" draggable="false"></span><span class="nm">${esc(objName(e.shape))}</span>${gems(n)}`;
  b.setAttribute('aria-label', tr('finds.tileAria', { name: objName(e.shape), n }));
  Promise.resolve(renderThumb(e.shape, e.palette, { size: 120 })).then((url) => { b.querySelector('img').src = url; });
  // the eclipse's edge, as on the map
  Promise.resolve().then(() => { b.querySelector('.obj-rim').src = renderRim(e.shape, e.palette, { size: 120 }); });
  b.addEventListener('click', () => openView(root, e, n, label));
  return b;
}
// not found yet: its shadow; a shrine says what it is
function waitingTile(bonus) {
  const b = document.createElement('button');
  b.className = 'jr-tile' + (bonus ? ' bonus' : '');
  b.innerHTML = `<span class="jr-pic">${SHADOW}</span><span class="nm">${bonus ? esc(tr('finds.shrine')) : '&nbsp;'}</span>`;
  b.setAttribute('aria-label', tr(bonus ? 'finds.shrineAria' : 'finds.notYet'));
  b.disabled = true;
  return b;
}
const SUN = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.4 15.6a4.6 4.6 0 0 1 9.2 0Z"/><path d="M4 15.6h16M12 6.6v1.9M6.5 9.1l1.3 1.3M17.5 9.1l-1.3 1.3M8.5 18.6h7"/></svg>';

// entries: [{ shape, palette }] for every level and bonus stone. dailies: [{ shape, palette,
// stars }] for every Daily Stone object (dailies.js), stars null until one is solved here.
export function renderJournal(root, { entries, solved, dailies = [] }) {
  const total = entries.length;
  const found = entries.filter((e) => solved[e.shape.id]).length;
  const gemsWon = entries.reduce((n, e) => n + (solved[e.shape.id] ? recordStars(e.shape, solved[e.shape.id]) : 0), 0);
  root.querySelector('#journal-count').innerHTML = `${esc(tr('finds.count', { found, total }))} <span class="jr-total">${GEM}${gemsWon} / ${total * 3}</span>`;
  const grid = root.querySelector('#journal-grid');
  grid.innerHTML = '';
  // the worlds not reached yet - after the first with nothing found, the next to come - are
  // gathered at the end into one quiet section, their names only (docs/finds-study.md)
  const chapters = CHAPTERS.map((ch) => {
    const items = entries.filter((e) => e.shape.chapter === ch.name);
    return { ch, items, have: items.filter((e) => solved[e.shape.id]).length };
  }).filter((c) => c.items.length);
  const next = chapters.findIndex((c) => !c.have);
  const ahead = next < 0 ? [] : chapters.slice(next + 1).filter((c) => !c.have);
  let prev = '#f3d7d0';   // the last sky drawn: the head's, then each chapter's foot
  chapters.forEach(({ ch, items, have }) => {
    if (ahead.some((c) => c.ch === ch)) return;
    const p = PALETTES.find((q) => q.name === ch.palette) ?? PALETTES[0];
    const complete = have === items.length;
    const sec = document.createElement('section');
    sec.className = 'jr-chapter' + (complete ? ' complete' : '');
    prev = hex(p.skyBottom);
    sec.style.setProperty('--sky-top', hex(p.skyTop));
    sec.style.setProperty('--sky-bottom', hex(p.skyBottom));
    sec.style.setProperty('--glow', hex(p.glow));
    sec.style.setProperty('--ink', inkFor(p));
    if (inkFor(p) === '#f4f1ff') sec.classList.add('dark');
    sec.innerHTML = `<header>
        <span class="jr-numeral">${ch.numeral}</span>
        <h3>${esc(chapterName(ch.name))}</h3>
        <span class="jr-progress">${esc(complete ? tr('finds.complete') : tr('finds.have', { have, total: items.length }))}</span>
        <span class="jr-bar"><i style="width:${(100 * have / items.length).toFixed(1)}%"></i></span>
      </header><div class="jr-tiles"></div>`;
    const tiles = sec.querySelector('.jr-tiles');
    for (const e of items) {
      const rec = solved[e.shape.id];
      tiles.appendChild(rec ? foundTile(root, e, recordStars(e.shape, rec)) : waitingTile(e.shape.bonus));
    }
    grid.appendChild(sec);
  });
  // the Daily Stone's objects, once one is solved here: a section of their own after the worlds
  // reached, on the dawn of the map's Today ring, its sun for a numeral. Each is there once, with
  // its best gems; the rest wait in the dark, as a world's do
  const dayHave = dailies.filter((e) => e.stars != null).length;
  if (dayHave) {
    const p = PALETTES.find((q) => q.name === 'Dawn') ?? PALETTES[0];
    const sec = document.createElement('section');
    sec.className = 'jr-chapter jr-daily' + (dayHave === dailies.length ? ' complete' : '');
    prev = hex(p.skyBottom);
    sec.style.setProperty('--sky-top', hex(p.skyTop));
    sec.style.setProperty('--sky-bottom', hex(p.skyBottom));
    sec.style.setProperty('--glow', hex(p.glow));
    sec.style.setProperty('--ink', inkFor(p));
    if (inkFor(p) === '#f4f1ff') sec.classList.add('dark');
    sec.innerHTML = `<header>
        <span class="jr-numeral">${SUN}</span>
        <h3>${esc(tr('finds.daily'))}</h3>
        <span class="jr-progress">${esc(dayHave === dailies.length ? tr('finds.complete') : tr('finds.have', { have: dayHave, total: dailies.length }))}</span>
        <span class="jr-bar"><i style="width:${(100 * dayHave / dailies.length).toFixed(1)}%"></i></span>
      </header><div class="jr-tiles"></div>`;
    const tiles = sec.querySelector('.jr-tiles');
    for (const e of dailies) tiles.appendChild(e.stars != null ? foundTile(root, e, e.stars, tr('finds.daily')) : waitingTile(false));
    grid.appendChild(sec);
  }
  // still ahead: out of the last chapter shown, down into the night of the map's end
  let foot = prev;
  if (ahead.length) {
    const later = document.createElement('section');
    later.className = 'jr-later';
    later.style.background = `linear-gradient(180deg, ${prev} 0, #4c5187 45%, #121731)`;
    const stones = (c) => c.items.filter((e) => !e.shape.bonus).length;
    later.innerHTML = `<h3>${esc(tr('finds.ahead'))}</h3><p>${esc(tr('finds.worlds', { n: ahead.length }))} · ${esc(tr('finds.stones', { n: ahead.reduce((n, c) => n + stones(c), 0) }))}</p>
      <ol>${ahead.map((c) => `<li>${esc(chapterName(c.ch.name))}<span>${esc(tr('finds.stones', { n: stones(c) }))}</span></li>`).join('')}</ol>`;
    grid.appendChild(later);
    foot = '#121731';
  }
  // and past the foot (a bounce at the bottom), the page's last colour goes on
  root.querySelector('.jr-scroll').style.setProperty('--jr-foot', foot);
}

// ---- the turntable

let view = null;

// label: the line over the name (the object's world, or for a Daily Stone's, the section's name)
function openView(root, entry, earned = 0, label = chapterName(entry.shape.chapter)) {
  closeView();
  const pane = root.querySelector('#journal-view');
  const canvas = pane.querySelector('canvas');
  pane.querySelector('.jv-name').textContent = objName(entry.shape);
  pane.querySelector('.jv-story').textContent = storyOf(entry.shape) ?? '';
  pane.querySelector('.jv-gems').innerHTML = gems(earned);
  pane.querySelector('.jv-chapter').textContent = label ?? '';
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
