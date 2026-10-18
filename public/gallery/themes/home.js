// Home & Morning (I · First Light, Dawn): candidate objects. Entry format and helpers: ../voxel.js.
import { C, ell, disc, inBox, bitmap, plan, grid } from '../voxel.js';

const clock = bitmap([
      '.b...b.',
      'bb...bb',
      '.rrrrr.',
      'rwwwwwr',
      'rwwkwwr',
      'rwwkkwr',
      'rwwwwwr',
      '.rrrrr.',
      '.k...k.',
    ], 3, { r: C.red, w: C.white, k: C.ink, b: C.gold });

export default [
  {
    id: 'cand-kettle', name: 'Kettle', dims: [8, 7, 5],
    cell(x, y, z) {
      if (y <= 4 && ell(x - 3.5, y - 2.2, z - 2, 2.7, 2.8, 2.2)) return y === 0 ? C.dred : C.red;
      if (z === 2 && ((y === 5 && (x === 2 || x === 5)) || (y === 6 && x >= 2 && x <= 5))) return C.ink;
      if (z === 2 && x === 7 && (y === 2 || y === 3)) return C.red;
      return 0;
    },
  },
  {
    id: 'cand-teacup', name: 'Teacup', dims: [8, 4, 7],
    cell(x, y, z) {
      const dx = x - 3, dz = z - 3;
      if (y === 0) return disc(dx, dz, 3.2) ? C.cream : 0;
      if (y <= 3 && disc(dx, dz, 2.2)) return y >= 2 && disc(dx, dz, 1.2) ? 0 : y === 2 ? C.blue : C.white;
      if (z === 3 && ((x === 6 && (y === 1 || y === 3)) || (x === 7 && y >= 1 && y <= 3))) return C.white;
      return 0;
    },
  },
  {
    id: 'cand-toaster', name: 'Toaster', dims: [7, 7, 4],
    cell(x, y, z) {
      if (inBox(x, y, z, [0, 5], [0, 3], [0, 3])) return y === 3 && (z === 1 || z === 2) && x >= 1 && x <= 4 ? C.tan : y === 0 ? C.dgrey : C.silver;
      if (x === 6 && y === 2 && z === 2) return C.ink;
      if ((z === 1 || z === 2) && x >= 1 && x <= 4 && y >= 3 && y <= 5) {
        if (y === 3) return C.tan;
        return x === 1 || x === 4 || y === 5 ? C.crust : C.tan;
      }
      return 0;
    },
  },
  {
    id: 'cand-candle', name: 'Candle', dims: [5, 7, 5],
    cell(x, y, z) {
      const dx = x - 2, dz = z - 2;
      if (y === 0) return disc(dx, dz, 2.3) ? C.gold : 0;
      if (y <= 4) return Math.abs(dx) <= 1 && Math.abs(dz) <= 1 ? (y === 4 && (dx || dz) && (dx + dz) % 2 ? 0 : C.cream) : 0;
      if (y === 5) return !dx && !dz ? C.ink : 0;
      return !dx && !dz ? C.orange : 0;
    },
  },
  {
    // hollow behind its face: the middle layer is empty except the red rim
    id: 'cand-clock', name: 'Alarm Clock', dims: clock.dims,
    cell: (x, y, z) => { const c = clock.cell(x, y, z); return z === 1 && c === C.white ? 0 : c; },
  },
  {
    id: 'cand-books', name: 'Books', dims: [6, 5, 4],
    cell(x, y, z) {
      if (y === 0) return x <= 5 && z <= 3 ? (x === 5 ? C.cream : C.blue) : 0;
      if (y === 1) return x <= 4 && z >= 1 ? (x === 4 ? C.cream : C.red) : 0;
      if (y === 2) return x >= 1 && x <= 5 && z <= 2 ? (z === 2 ? C.cream : C.green) : 0;
      if (y === 3) return x >= 1 && x <= 3 && z >= 1 && z <= 3 ? (z === 3 ? C.cream : C.gold) : 0;
      if (y === 4) return x === 2 && z === 2 ? C.red : 0;
      return 0;
    },
  },
  {
    id: 'cand-slippers', name: 'Slippers', ...plan([
      '.hh..hh.',
      'hssh.hssh'.slice(0, 8),
      'hssh.hss'.slice(0, 8),
      'pssp.pss',
      'pppp.ppp',
      'pppp.ppp',
      '.ww...ww',
    ].map((r) => r.padEnd(8, '.')), 2, { p: (y) => (y === 0 ? C.rose : C.pink), h: (y) => (y === 0 ? C.rose : C.pink), s: (y) => (y === 0 ? C.rose : null), w: (y) => (y === 0 ? C.rose : C.white) }),
  },
  {
    id: 'cand-houseplant', name: 'House Plant', dims: [7, 8, 5],
    cell(x, y, z) {
      const dx = x - 3, dz = z - 2;
      if (y <= 2) { const w = y === 0 ? 1 : 2; return Math.abs(dx) <= w && Math.abs(dz) <= w ? (y === 2 ? C.dred : C.terracotta) : 0; }
      if (!dx && !dz && y <= 6) return C.dgreen;
      const leaves = [[1, 4, 0], [2, 4, 0], [2, 5, 0], [3, 5, 0], [-1, 5, 0], [-2, 5, 0], [-2, 6, 0], [-3, 6, 0],
        [0, 5, 1], [0, 5, 2], [0, 6, 2], [0, 6, -1], [0, 7, -1], [-1, 7, -1], [0, 7, 0]];
      return leaves.some(([a, b, c]) => a === dx && b === y && c === dz) ? C.green : 0;
    },
  },
  {
    id: 'cand-lamp', name: 'Table Lamp', dims: [5, 8, 5],
    cell(x, y, z) {
      const dx = x - 2, dz = z - 2, r = Math.max(Math.abs(dx), Math.abs(dz));
      if (y === 0) return r <= 1 ? C.dbrown : 0;
      if (y <= 3) return !dx && !dz ? C.gold : 0;
      if (y <= 7) return r <= (y <= 5 ? 2 : 1) ? (y === 4 && r < 2 ? (r === 0 ? C.gold : 0) : C.yellow) : 0;
      return 0;
    },
  },
  {
    id: 'cand-bread', name: 'Bread Loaf', dims: [7, 4, 4],
    cell(x, y, z) {
      if (!inBox(x, y, z, [0, 6], [0, 3], [0, 3])) return 0;
      if (y === 3 && (z === 0 || z === 3 || x === 0 || x === 6)) return 0;
      if (y === 2 && (z === 0 || z === 3) && (x === 0 || x === 6)) return 0;
      if (y === 3) return x % 2 ? C.cream : C.crust;
      if (y === 1 && z >= 1 && z <= 2 && x >= 1 && x <= 5) return 0;   // a soft crumb inside, found by peeling
      return y === 0 ? C.dbrown : C.crust;
    },
  },
  {
    id: 'cand-radio', name: 'Radio', dims: [7, 6, 4],
    cell(x, y, z) {
      if (inBox(x, y, z, [0, 6], [0, 3], [0, 3])) {
        // speaker: a tan panel with a dark cone in its middle; tuning dial to the right
        if (z === 3 && x >= 1 && x <= 3 && y >= 1 && y <= 2) return x === 2 ? C.dbrown : C.tan;
        if (z === 3 && x === 5 && y === 2) return C.gold;
        return y === 3 ? C.dred : C.coral;
      }
      // carry handle centred on top, antenna at the right end
      if (z === 1 && ((y === 4 && (x === 2 || x === 4)) || (y === 5 && x >= 2 && x <= 4))) return C.dbrown;
      if (x === 6 && z === 2 && y >= 4) return C.silver;
      return 0;
    },
  },
  {
    id: 'cand-rocker', name: 'Rocking Chair', dims: [5, 7, 6],
    cell(x, y, z) {
      if (x !== 0 && x !== 4 && !(y >= 2)) return 0;
      // side profile in (z, y): curved rockers, legs, seat, back
      const rocker = (y === 0 && z >= 1 && z <= 4) || (y === 1 && (z === 0 || z === 5));
      if ((x === 0 || x === 4) && rocker) return C.dbrown;
      if ((x === 0 || x === 4) && y === 1 && (z === 1 || z === 4)) return C.brown;
      if (y === 2 && z >= 1 && z <= 4) return C.tan;
      if (z === 1 && y >= 3 && y <= 6) return x >= 1 && x <= 3 && y >= 4 && y <= 5 ? C.coral : C.tan;
      if ((x === 0 || x === 4) && y === 3 && z === 4) return C.brown;
      return 0;
    },
  },
];
