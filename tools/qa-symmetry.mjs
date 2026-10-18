// QA aid: finds near-mirror-symmetric objects whose few mismatched voxels are
// likely mistakes (one eye, one horn, one wing), plus colours used by a
// single voxel. Checks both mirror planes (across x and across z), about the
// object's own bounding box. Also reports pieces (gallery-pieces does too).
//
//   node tools/qa-symmetry.mjs themes/home extra/home-1 ...
import { buildCells } from '../public/js/shapes.js';

const files = process.argv.slice(2);
const hex = (c) => '#' + c.toString(16).padStart(6, '0');
const lum = (c) => { const r = (c >> 16) & 255, g = (c >> 8) & 255, b = c & 255; return (0.299 * r + 0.587 * g + 0.114 * b) / 255; };

for (const f of files) {
  const list = (await import(`../public/gallery/${f}.js`)).default;
  console.log(`\n== ${f} (${list.length})`);
  list.forEach((s, k) => {
    const [X, Y, Z] = s.dims;
    const { solid, colors } = buildCells(s);
    const at = (x, y, z) => (x < 0 || y < 0 || z < 0 || x >= X || y >= Y || z >= Z ? 0 : solid[x + X * (y + Y * z)] ? colors[x + X * (y + Y * z)] || 0xffffff : 0);
    let x0 = X, x1 = -1, z0 = Z, z1 = -1, n = 0;
    const counts = new Map();
    for (let z = 0; z < Z; z++) for (let y = 0; y < Y; y++) for (let x = 0; x < X; x++) {
      const c = at(x, y, z);
      if (!c) continue;
      n++;
      counts.set(c, (counts.get(c) || 0) + 1);
      x0 = Math.min(x0, x); x1 = Math.max(x1, x); z0 = Math.min(z0, z); z1 = Math.max(z1, z);
    }
    const mirror = (axis) => {
      const diffs = [];
      for (let z = 0; z < Z; z++) for (let y = 0; y < Y; y++) for (let x = 0; x < X; x++) {
        const a = at(x, y, z);
        const mx = axis === 'x' ? x0 + x1 - x : x, mz = axis === 'z' ? z0 + z1 - z : z;
        const b = at(mx, y, mz);
        if (!a) continue;
        if (!b) diffs.push(`${x},${y},${z} ${hex(a)} vs empty`);
        else if (a !== b) diffs.push(`${x},${y},${z} ${hex(a)} vs ${hex(b)}`);
      }
      return diffs;
    };
    const mx = mirror('x'), mz = mirror('z');
    const best = mx.length <= mz.length ? ['x', mx] : ['z', mz];
    const singles = [...counts].filter(([, v]) => v === 1).map(([c]) => hex(c) + (lum(c) < 0.3 ? '(dark)' : ''));
    const darks = [...counts].filter(([c]) => lum(c) < 0.3).map(([c, v]) => `${hex(c)}×${v}`);
    const frac = best[1].length / n;
    const flag = best[1].length > 0 && frac <= 0.25 ? 'NEAR-SYMMETRIC' : best[1].length === 0 ? 'symmetric' : 'asymmetric';
    console.log(`#${String(k + 1).padStart(2)} ${s.name.padEnd(18)} ${s.dims.join('x').padEnd(7)} n=${String(n).padStart(3)} mirror-${best[0]} diff ${best[1].length} (${(frac * 100).toFixed(0)}%) ${flag}  darks[${darks.join(' ')}] singles[${singles.join(' ')}]`);
    if (flag === 'NEAR-SYMMETRIC' && best[1].length <= 14) for (const d of best[1]) console.log(`      ${d}`);
  });
}
