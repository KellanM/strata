// One feel for turning things: the puzzle, the solved object and the journal's
// turntable all orbit with these same settings.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// the slow turntable spin a finished object settles into (radians / second)
export const SHOW_SPIN = 0.42;

export function makeOrbit(camera, element) {
  const controls = new OrbitControls(camera, element);
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.rotateSpeed = 0.75;
  controls.minZoom = 0.6;
  controls.maxZoom = 3.5;
  controls.autoRotateSpeed = 1.4;
  // spin freely around, but never far enough over the top to read clues upside down
  controls.minPolarAngle = 0.26;
  controls.maxPolarAngle = Math.PI - 0.5;
  controls.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: null };
  controls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN };
  return controls;
}
