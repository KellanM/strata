// The voxel checklist (docs/voxel-study.md), the parts a script can measure,
// for every candidate in gallery files. Its limits were set so that Kellan's
// favourites (Pegasus Foal, Origami Fox, Meerkat Lookout) pass clean. Problems (✗) break a rule; notes (·)
// are worth a look in the QA sheet. The look itself - the squint test, paired
// features, the dithered light - still needs eyes (tools/qa-sheet.mjs).
//   node tools/voxel-lint.mjs page15/hills-1 [page15/below-1 ...]
import { stats } from '../public/gallery/stats.js';

const files = process.argv.slice(2);
if (!files.length) { console.log('usage: node tools/voxel-lint.mjs <gallery file> ...'); process.exit(1); }

const hex = (c) => '#' + c.toString(16).padStart(6, '0');
const ACCENT = 5;   // lit() leaves colours on fewer cubes than this flat
const N6 = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];

let problems = 0;
for (const file of files) {
  const list = (await import(new URL(`../public/gallery/${file}.js`, import.meta.url))).default;
  console.log(`\n${file} (${list.length})`);
  for (const s of list) {
    const [X, Y, Z] = s.dims, bad = [], note = [];
    const at = (x, y, z) => (x < 0 || y < 0 || z < 0 || x >= X || y >= Y || z >= Z ? 0 : s.cell(x, y, z) || 0);
    const cells = [], count = new Map(), lo = [X, Y, Z], hi = [-1, -1, -1];
    for (let z = 0; z < Z; z++) for (let y = 0; y < Y; y++) for (let x = 0; x < X; x++) {
      const c = at(x, y, z); if (!c) continue;
      cells.push([x, y, z, c]); count.set(c, (count.get(c) || 0) + 1);
      [x, y, z].forEach((v, a) => { lo[a] = Math.min(lo[a], v); hi[a] = Math.max(hi[a], v); });
    }
    const r = stats(s);
    if (s.dims.some((d) => d > 10)) bad.push('a side over 10');
    if (!r.solvable) bad.push('UNSOLVABLE');
    if (r.pieces > 1) bad.push(`${r.pieces} pieces`);
    // fill of the trimmed block (the game trims each block to its object)
    const vol = hi.reduce((p, v, a) => p * (v - lo[a] + 1), 1), fill = cells.length / vol;
    if (fill < 0.25 || fill > 0.55) note.push(`fill ${(fill * 100).toFixed(0)}% (aim 25-55%)`);
    // colours with jobs: 2-4 that the light ramps (accents are free)
    const big = [...count].filter(([, n]) => n >= ACCENT).sort((a, b) => b[1] - a[1]);
    if (big.length > 5) note.push(`${big.length} ramped colours (aim 2-4, plus accents)`);
    // each ramped colour in one or two regions; strays read as noise, more so once dithered
    for (const [c, n] of big) {
      const seen = new Set(), sizes = [];
      for (const [x, y, z, cc] of cells) {
        const k = `${x},${y},${z}`; if (cc !== c || seen.has(k)) continue;
        let size = 0; const st = [[x, y, z]]; seen.add(k);
        while (st.length) {
          const [a, b, d] = st.pop(); size++;
          for (const [dx, dy, dz] of N6) {
            const q = `${a + dx},${b + dy},${d + dz}`;
            if (!seen.has(q) && at(a + dx, b + dy, d + dz) === c) { seen.add(q); st.push([a + dx, b + dy, d + dz]); }
          }
        }
        sizes.push(size);
      }
      const strays = sizes.filter((v) => v === 1).length;
      if (strays >= 6) note.push(`${hex(c)} in ${sizes.length} regions, ${strays} single cubes (a pattern? try lit: { span: 2 })`);
    }
    // thin shafts: a run of more than 3 cubes, 1 thick, nothing beside it
    let longest = 0;
    for (const [ax, p1, p2] of [[0, 1, 2], [1, 0, 2], [2, 0, 1]]) {
      const D = [X, Y, Z], step = [0, 0, 0]; step[ax] = 1;
      const lone = (v) => {
        for (const [dx, dy, dz] of N6) {
          if ([dx, dy, dz][ax] !== 0) continue;
          if (at(v[0] + dx, v[1] + dy, v[2] + dz)) return false;
        }
        return !!at(...v);
      };
      for (let a = 0; a < D[p1]; a++) for (let b = 0; b < D[p2]; b++) {
        let run = 0;
        for (let t = 0; t < D[ax]; t++) {
          const v = [0, 0, 0]; v[ax] = t; v[p1] = a; v[p2] = b;
          run = lone(v) ? run + 1 : 0; longest = Math.max(longest, run);
        }
      }
    }
    if (longest > 3) note.push(`a 1-thick shaft ${longest} long (aim 3 or under)`);
    // hand-made ramps: the game lights every level itself
    if (s.lit === false) note.push('lit: false (hand ramp): say why in its comment; the level goes in LIT_SKIP');
    problems += bad.length;
    const head = `${bad.length ? '✗' : note.length ? '·' : '✓'} ${s.id.padEnd(26)} ${s.dims.join('x').padEnd(7)} ${String(cells.length).padStart(3)} cubes  ${r.solvable ? 'D ' + r.D.toFixed(1) : ''}`;
    console.log(head + [...bad.map((t) => `\n    ✗ ${t}`), ...note.map((t) => `\n    · ${t}`)].join(''));
  }
}
console.log(`\nproblems: ${problems}`);
process.exit(problems ? 1 : 0);
