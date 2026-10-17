// Hidden voxel shapes. Each shape is a function (x, y, z) -> hex colour, or 0
// for empty. y is up. Colours are only seen once the puzzle is solved.
import { mulberry32 } from './puzzle.js';


// Extrudes a 2D bitmap (rows top-to-bottom, '#'-style chars mapped via `key`).
function extrude(rows, depth, key) {
  const H = rows.length, W = rows[0].length;
  return {
    dims: [W, H, depth],
    cell: (x, y) => key[rows[H - 1 - y][x]] || 0,
  };
}

export const SHAPES = [
  {
    id: 'heart', name: 'Heart', fraction: 0.5,
    ...extrude([
      '.RR.RR.',
      'RRRRRRR',
      'RRRRRRR',
      '.RRRRR.',
      '..RRR..',
      '...R...',
    ], 2, { R: 0xe0546b }),
  },
  {
    id: 'invader', name: 'Visitor', fraction: 0.7,
    ...extrude([
      '..G.....G..',
      '...G...G...',
      '..GGGGGGG..',
      '.GG.GGG.GG.',
      'GGGGGGGGGGG',
      'G.GGGGGGG.G',
      'G.G.....G.G',
      '...GG.GG...',
    ], 2, { G: 0x6cc28f }),
  },
  {
    id: 'mushroom', name: 'Mushroom', dims: [7, 6, 7], fraction: 0.85,
    cell(x, y, z) {
      const dx = x - 3, dz = z - 3, r2 = dx * dx + dz * dz;
      if (y <= 2) return r2 <= 1 ? 0xf3e6d0 : 0;
      const r = [3.3, 3.0, 2.2][y - 3];
      if (r2 > r * r) return 0;
      const spot = y === 5 ? (dx + dz) % 2 === 0 && r2 > 0 : y === 4 && r2 >= 6 && (x + 2 * z) % 4 === 0;
      return spot ? 0xfff4e6 : 0xd9455a;
    },
  },
  {
    id: 'tree', name: 'Pine', dims: [7, 9, 7], fraction: 0.85,
    cell(x, y, z) {
      const dx = Math.abs(x - 3), dz = Math.abs(z - 3);
      if (y <= 1) return dx === 0 && dz === 0 ? 0x8a5a3c : 0;
      const tier = [3, 2.2, 1.4, 2.4, 1.6, 0.8, 0.6][y - 2];
      return dx * dx + dz * dz <= tier * tier ? 0x3f9a6b : 0;
    },
  },
  {
    id: 'mug', name: 'Mug', dims: [8, 6, 6], fraction: 0.85,
    cell(x, y, z) {
      const dx = x - 2.5, dz = z - 2.5, r2 = dx * dx + dz * dz;
      if (x <= 5 && r2 <= 2.6 * 2.6 && (y === 0 || r2 >= 1.7 * 1.7)) return y === 5 ? 0xf6efe4 : 0x5b8fd6;
      const handle = (x === 6 && (y === 1 || y === 4)) || (x === 7 && y >= 1 && y <= 4);
      return handle && (z === 2 || z === 3) ? 0x5b8fd6 : 0;
    },
  },
  {
    id: 'snowman', name: 'Snowman', dims: [5, 9, 5], fraction: 0.85,
    cell(x, y, z) {
      const dx = x - 2, dz = z - 2;
      const ball = (cy, r) => dx * dx + dz * dz + (y - cy) ** 2 <= r * r;
      if (y === 8) return dx === 0 && dz === 0 ? 0x2f2b3a : 0;
      if (y === 6 && dx === 0 && dz === 2) return 0xf08a3c;
      if (ball(1.5, 2.3) || ball(4.4, 1.6) || ball(6.6, 1.2)) return 0xf7f4ef;
      return 0;
    },
  },
  {
    id: 'rocket', name: 'Rocket', dims: [5, 10, 5], fraction: 0.85,
    cell(x, y, z) {
      const dx = x - 2, dz = z - 2, r2 = dx * dx + dz * dz;
      if (y <= 1) {
        const fin = (dx === 0 || dz === 0) && r2 === 4;
        if (fin) return 0xe0546b;
      }
      if (y <= 6) return r2 <= 1.5 * 1.5 ? (y === 4 && dz === 1 && dx === 0 ? 0x6fd3e8 : 0xeee6f2) : 0;
      if (y <= 8) return r2 <= (y === 7 ? 1.1 : 0.5) ** 2 ? 0xe0546b : 0;
      return r2 === 0 ? 0xe0546b : 0;
    },
  },
  {
    id: 'torus', name: 'Ring', dims: [8, 3, 8], fraction: 0.85,
    cell(x, y, z) {
      const dx = x - 3.5, dz = z - 3.5;
      const d = Math.sqrt(dx * dx + dz * dz) - 2.6;
      return d * d + (y - 1) ** 2 <= 1.25 ? 0xe9b949 : 0;
    },
  },
  {
    id: 'arch', name: 'Arch', dims: [9, 7, 3], fraction: 0.85,
    cell(x, y, z) {
      const dx = x - 4, dy = y;
      const outer = dx * dx + dy * dy <= 4.4 * 4.4 || (Math.abs(dx) >= 3 && y <= 3);
      const inner = dx * dx + dy * dy <= 2.4 * 2.4;
      return outer && !inner && Math.abs(dx) <= 4 ? 0xc98fb4 : 0;
    },
  },
];

// Random puzzle: a few overlapping spheres, coloured by height band.
export function randomShape(n, seed) {
  const rand = mulberry32(seed);
  const blobs = Array.from({ length: 3 + Math.floor(rand() * 3) }, () => ({
    c: [rand() * (n - 1), rand() * (n - 1), rand() * (n - 1)],
    r: n * (0.18 + rand() * 0.22),
  }));
  const hues = [0xe0546b, 0xe9b949, 0x6cc28f, 0x5b8fd6, 0xc98fb4];
  const h0 = Math.floor(rand() * hues.length);
  return {
    id: `random-${n}-${seed}`, name: `Drift ${seed % 1000}`, dims: [n, n, n], fraction: 0.85, seed,
    cell(x, y, z) {
      const inside = blobs.some(({ c, r }) => (x - c[0]) ** 2 + (y - c[1]) ** 2 + (z - c[2]) ** 2 <= r * r);
      return inside ? hues[(h0 + Math.floor((y / n) * 2)) % hues.length] : 0;
    },
  };
}

export function buildCells(shape) {
  const [X, Y, Z] = shape.dims;
  const size = X * Y * Z;
  const solid = new Uint8Array(size);
  const colors = new Uint32Array(size);
  for (let z = 0; z < Z; z++)
    for (let y = 0; y < Y; y++)
      for (let x = 0; x < X; x++) {
        const c = shape.cell(x, y, z);
        const i = x + X * (y + Y * z);
        if (c) { solid[i] = 1; colors[i] = c; }
      }
  return { solid, colors };
}


// Guided lessons. `show` picks which axes' clues are visible ([x, y, z]);
// clues are never auto-hidden so each lesson isolates one idea. Each hint
// holds until its event fires: break | paint | rotate | peel | solved.
export const TUTORIAL = [
  {
    id: 'lesson-clear', view: Math.PI / 4, handles: false, name: 'Clear', dims: [4, 2, 1], show: [1, 0, 0],
    cell: (x, y) => (y === 0 ? 0xe9b949 : 0),
    hints: [
      { text: 'Each number counts the cubes that stay in its row. A 0 means none do. Tap a top cube to chisel it away.', pulse: [0, 1, 0], until: 'break' },
      { text: 'Clear the rest of the top row.', until: 'solved' },
    ],
  },
  {
    id: 'lesson-mark', view: Math.PI / 4, handles: false, name: 'Keep', dims: [4, 3, 1], show: [1, 0, 0],
    cell: (x, y) => (y === 1 ? 0x5db6ae : 0),
    hints: [
      { text: 'A 4 in a row of four: every cube stays. Hold one of them to mark it.', pulse: [1, 1, 0], until: 'paint' },
      { text: 'Marked cubes can’t be chiselled by accident. Now clear the two 0 rows.', until: 'solved' },
    ],
  },
  {
    id: 'lesson-cross', view: Math.PI / 4, handles: false, name: 'Cross', dims: [3, 3, 1], show: [1, 1, 0],
    cell: (x, y) => (x === 1 || y === 1 ? 0xe0546b : 0),
    hints: [
      { text: 'Drag anywhere to turn the block. Clues sit on the tops as well as the front.', until: 'rotate' },
      { text: 'The middle column keeps all 3, so the single cube in the top and bottom rows must be in the middle.', until: 'solved' },
    ],
  },
  {
    id: 'lesson-groups', view: Math.PI / 4, handles: false, name: 'Groups', dims: [3, 2, 1], show: [1, 0, 0],
    cell: (x, y) => (y === 0 || x !== 1 ? 0xc98fb4 : 0),
    hints: [
      { text: 'A circled number means the cubes come in 2 separate groups (a square means 3 or more). Two cubes in two groups across three spaces leaves one way to do it.', until: 'solved' },
    ],
  },
  {
    id: 'lesson-peel', name: 'Lantern', dims: [3, 3, 3], show: [1, 1, 1],
    cell: (x, y, z) => (x === 1 && y === 1 && z === 1 ? 0 : 0xe9b949),
    hints: [
      { text: 'Something is hidden inside. Drag a diamond handle along the block’s edge to peel layers away.', pulseHandle: true, until: 'peel' },
      { text: 'Every row through the middle cube is split in two around it. Chisel it.', pulse: [1, 1, 1], until: 'solved' },
    ],
  },
];
