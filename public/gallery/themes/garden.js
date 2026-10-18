// Garden & Small Creatures (II · Moss Garden, Mint): candidate objects. Entry format and helpers: ../voxel.js.
import { C, ell, disc, inBox, bitmap, plan, grid } from '../voxel.js';

export default [
  {
    id: 'cand-snail', name: 'Snail', dims: [8, 6, 4],
    cell(x, y, z) {
      // shell: a disc in the x-y plane, rings alternating
      const sx = x - 4.5, sy = y - 2.5, r = Math.hypot(sx, sy);
      if (z >= 1 && z <= 2 && r <= 2.6 && y >= 1) return r < 1.1 ? C.dbrown : r < 2 ? C.orange : C.crust;
      if (y === 0 && z >= 1 && z <= 2 && x <= 7) return C.sand;
      if (z >= 1 && z <= 2 && x <= 1 && y >= 1 && y <= 2) return C.sand;
      if (z >= 1 && z <= 2 && (x === 0 || x === 1) && y === 3) return x === 0 ? C.ink : C.sand;   // two eye stalks
      return 0;
    },
  },
  {
    id: 'cand-acorn', name: 'Acorn', dims: [5, 6, 5],
    cell(x, y, z) {
      const dx = x - 2, dz = z - 2;
      if (y <= 2) return ell(dx, y - 2, dz, 1.8, 2.6, 1.8) ? (y === 0 ? C.brown : C.tan) : 0;
      if (y <= 4) return disc(dx, dz, y === 3 ? 2.4 : 1.7) ? ((x + z + y) % 2 ? C.dbrown : C.brown) : 0;
      return !dx && !dz ? C.dbrown : 0;
    },
  },
  {
    id: 'cand-wateringcan', name: 'Watering Can', dims: [9, 7, 5],
    cell(x, y, z) {
      const dz = z - 2;
      if (y <= 3 && x >= 1 && x <= 5 && Math.abs(dz) <= 1.5 && disc(x - 3, dz, 2.3)) return y === 3 ? C.dgreen : C.teal;
      if (dz === 0 && [[6, 2], [7, 2], [7, 3], [8, 3], [8, 4]].some(([a, b]) => a === x && b === y)) return C.teal;
      if (dz === 0 && x === 8 && y === 5) return C.silver;
      if (dz === 0 && ((y === 4 && (x === 1 || x === 4)) || (y === 5 && x >= 1 && x <= 4))) return C.dgreen;
      return 0;
    },
  },
  {
    id: 'cand-tulips', name: 'Tulips', dims: [5, 8, 5],
    cell(x, y, z) {
      const dx = x - 2, dz = z - 2;
      if (y <= 2) return Math.abs(dx) <= 2 && Math.abs(dz) <= 1 + (y > 0) - (y === 0) ? (y === 2 ? C.dred : C.terracotta) : 0;
      const stems = [[0, 0], [-2, -1], [2, 1]];
      const heads = [C.red, C.yellow, C.pink];
      for (let k = 0; k < 3; k++) {
        const [sx, sz] = stems[k], top = [7, 5, 6][k];
        if (dx === sx && dz === sz && y < top - 1) return C.green;
        if (Math.abs(dx - sx) + Math.abs(dz - sz) <= (y === top - 1 ? 1 : 0) && y >= top - 1 && y <= top) return heads[k];
      }
      if (y === 3 && ((dx === -1 && dz === 0) || (dx === 1 && dz === 0))) return C.dgreen;
      return 0;
    },
  },
  {
    id: 'cand-sunflower', name: 'Sunflower', dims: [7, 10, 3],
    cell(x, y, z) {
      const fx = x - 3, fy = y - 6.5, r = Math.hypot(fx, fy);
      if (z === 1 && x === 3 && y <= 5) return C.green;
      if (r <= 3.2 && y >= 4) {
        if (z === 2) return r <= 1.6 ? C.dbrown : C.yellow;
        if (z === 1) return r <= 2.2 ? C.dgreen : 0;
        return 0;
      }
      if (z === 1 && x === 3 && y <= 4) return C.green;
      if (z === 1 && ((y === 2 && (x === 4 || x === 5)) || (y === 1 && (x === 2 || x === 1)))) return C.leaf;
      return 0;
    },
  },
  {
    id: 'cand-ladybug', name: 'Ladybug', dims: [6, 3, 7],
    cell(x, y, z) {
      const dx = x - 2.5, dz = z - 2.5;
      // head forward (+z) with two white eyes; legs paired either side
      if (z >= 5) {
        if (z === 5 && y <= 1 && Math.abs(dx) <= 1.5) return y === 1 && (x === 1 || x === 4) ? C.white : C.ink;
        return y === 0 && z === 6 && (x === 1 || x === 4) ? C.ink : 0;
      }
      if (!ell(dx, y, dz, 3, 2.6, 2.9)) return 0;
      // a red dome with spots mirrored left and right
      const spots = [[1, 1], [4, 1], [1, 3], [4, 3], [0, 2], [5, 2]];
      if (y >= 1 && spots.some(([a, b]) => a === x && b === z)) return C.ink;
      return C.red;
    },
  },
  {
    id: 'cand-bee', name: 'Bee', dims: [8, 6, 5],
    cell(x, y, z) {
      const dx = x - 3.5, dz = z - 2;
      if (y <= 3 && ell(dx, y - 1.6, dz, 3.2, 1.9, 1.9)) return x === 6 ? C.ink : x % 2 ? C.yellow : C.ink;
      if (x === 7 && y === 1 && z === 2) return C.ink;
      if (y >= 4 && y <= 5 && (z === 1 || z === 3) && x >= 2 && x <= 4) return y === 5 && x === 4 ? 0 : C.white;
      return 0;
    },
  },
  {
    id: 'cand-cactus', name: 'Cactus', dims: [7, 9, 5],
    cell(x, y, z) {
      const dx = x - 3, dz = z - 2;
      if (y <= 1) return Math.abs(dx) <= 2 && Math.abs(dz) <= 2 ? (y === 1 ? C.dred : C.terracotta) : 0;
      if (Math.abs(dx) <= 1 && Math.abs(dz) <= 1 && (dx === 0 || dz === 0) && y <= 7) return C.green;
      if (dz === 0 && ((dx === -2 && y >= 4 && y <= 6) || (dx === -3 && y >= 5 && y <= 6))) return C.green;
      if (dz === 0 && ((dx === 2 && y >= 3 && y <= 4) || (dx === 3 && y >= 3 && y <= 5))) return C.green;
      if (!dx && !dz && y === 8) return C.pink;
      return 0;
    },
  },
  {
    id: 'cand-birdhouse', name: 'Bird House', dims: [5, 9, 5],
    cell(x, y, z) {
      const dx = x - 2, dz = z - 2;
      if (y <= 3) return !dx && !dz ? C.brown : 0;
      if (y <= 6) return Math.abs(dx) <= 1 && Math.abs(dz) <= 1 ? (z === 3 && !dx && y === 5 ? C.ink : C.sky) : 0;
      if (y === 7) return Math.abs(dz) <= 2 && Math.abs(dx) <= 2 ? C.red : 0;
      if (y === 8) return Math.abs(dz) <= 2 && !dx ? C.red : 0;
      return 0;
    },
  },
  {
    id: 'cand-carrot', name: 'Carrot', dims: [5, 10, 5],
    cell(x, y, z) {
      const dx = x - 2, dz = z - 2;
      if (y <= 6) { const r = 0.4 + y * 0.28; return disc(dx, dz, r) ? (y % 3 === 0 ? C.coral : C.orange) : 0; }
      const tops = [[0, 0], [-1, 0], [1, 0], [0, 1], [0, -1]];
      if (y === 7) return tops.some(([a, b]) => a === dx && b === dz) ? C.green : 0;
      if (y === 8) return (dx === -1 && dz === 0) || (dx === 1 && dz === 0) || (!dx && dz === -1) ? C.leaf : 0;
      if (y === 9) return dx === -1 && dz === 0 ? C.leaf : 0;
      return 0;
    },
  },
  {
    id: 'cand-strawberry', name: 'Strawberry', dims: [5, 7, 5],
    cell(x, y, z) {
      const dx = x - 2, dz = z - 2;
      if (y <= 4) {
        const r = [0.8, 1.6, 2.2, 2.4, 2.2][y];
        if (!disc(dx, dz, r)) return 0;
        // seeds in a pattern that is the same from every side
        return y % 2 === 1 && (x + z) % 2 === 0 && (Math.abs(dx) === 2 || Math.abs(dz) === 2) ? C.yellow : C.red;
      }
      if (y === 5) return (Math.abs(dx) + Math.abs(dz) <= 2 && (dx === 0 || dz === 0)) ? C.green : 0;
      return !dx && !dz ? C.dgreen : 0;
    },
  },
  {
    id: 'cand-bunny', name: 'Bunny', dims: [6, 8, 5],
    cell(x, y, z) {
      if (y <= 3 && ell(x - 2.5, y - 1.5, z - 2, 2.4, 2, 2)) return C.white;
      if (x === 0 && y === 1 && z === 2) return C.white;
      // head facing +x: an eye on each side
      if (y >= 3 && y <= 5 && ell(x - 4, y - 4, z - 2, 1.5, 1.4, 1.4)) return x === 5 && y === 4 && (z === 1 || z === 3) ? C.ink : C.white;
      // two ears side by side, each pink low down
      if (x === 4 && (z === 1 || z === 3) && y >= 5) return y === 6 ? C.pink : C.white;
      return 0;
    },
  },
];
