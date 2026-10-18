// Dev aid: lists the stray (non-largest) pieces of each candidate as x,y,z voxels.
// Usage: node tools/gallery-pieces.mjs [theme ...]
import { buildCells } from '../public/js/shapes.js';

const themes = process.argv.slice(2).length ? process.argv.slice(2) : ['home', 'garden', 'sea', 'temples', 'sky'];
for (const theme of themes) {
  const list = (await import(`../public/gallery/themes/${theme}.js`)).default;
  for (const s of list) {
    const { solid } = buildCells(s);
    const [X, Y, Z] = s.dims;
    const seen = new Int32Array(solid.length).fill(-1);
    const groups = [];
    for (let i = 0; i < solid.length; i++) {
      if (!solid[i] || seen[i] >= 0) continue;
      const g = [], st = [i];
      seen[i] = groups.length;
      while (st.length) {
        const j = st.pop();
        g.push(j);
        const x = j % X, y = Math.floor(j / X) % Y, z = Math.floor(j / (X * Y));
        for (const [a, b, c] of [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]) {
          const xx = x + a, yy = y + b, zz = z + c;
          if (xx < 0 || yy < 0 || zz < 0 || xx >= X || yy >= Y || zz >= Z) continue;
          const k = xx + X * (yy + Y * zz);
          if (solid[k] && seen[k] < 0) { seen[k] = groups.length; st.push(k); }
        }
      }
      groups.push(g);
    }
    if (groups.length < 2) continue;
    groups.sort((a, b) => b.length - a.length);
    const fmt = (g) => g.map((j) => `${j % X},${Math.floor(j / X) % Y},${Math.floor(j / (X * Y))}`).join(' ');
    console.log(`${s.id}: ${groups.slice(1).map(fmt).join(' | ')}`);
  }
}
