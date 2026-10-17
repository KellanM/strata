// Small still renders of solved objects for the map and the journal: one
// shared offscreen renderer, returned as a PNG data URL and cached.
import * as THREE from 'three';
import { objectMesh, isoCamera } from './objectmesh.js';

let renderer = null;
const cache = new Map();

export function renderThumb(shape, palette, { size = 128, angle = 0 } = {}) {
  const key = `${shape.id}|${size}|${angle}`;
  if (cache.has(key)) return Promise.resolve(cache.get(key));
  if (!renderer) {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setClearColor(0x000000, 0);
  }
  const px = Math.round(size * Math.min(2, window.devicePixelRatio || 1));
  renderer.setSize(px, px, false);
  const scene = new THREE.Scene();
  const mesh = objectMesh(shape, palette);
  mesh.rotation.y = angle;
  scene.add(mesh);
  renderer.render(scene, isoCamera(mesh.userData.radius));
  const url = renderer.domElement.toDataURL('image/png');
  mesh.geometry.dispose();
  mesh.material.dispose();
  cache.set(key, url);
  return Promise.resolve(url);
}
