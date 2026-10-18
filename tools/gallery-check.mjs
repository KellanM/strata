// Dev aid: size, cubes, solvability and difficulty for every gallery candidate.
// Usage: node tools/gallery-check.mjs [theme ...]
import { stats } from '../public/gallery/stats.js';

const themes = process.argv.slice(2).length ? process.argv.slice(2) : ['home', 'garden', 'sea', 'temples', 'sky'];
let bad = 0;
for (const t of themes) {
  const list = (await import(t.includes("/") ? `../public/gallery/${t}.js` : `../public/gallery/themes/${t}.js`)).default;
  console.log(`\n${t} (${list.length})`);
  for (const s of list) {
    const r = stats(s);
    const big = s.dims.some((d) => d > 10);
    if (!r.solvable || big || r.cubes === 0 || r.pieces > 1) bad++;
    console.log(`  ${s.id.padEnd(20)} ${s.dims.join('x').padEnd(7)} cubes ${String(r.cubes).padStart(3)}  ${r.solvable ? 'D ' + r.D.toFixed(1) : 'UNSOLVABLE'}  fill ${(r.fill * 100).toFixed(0)}%${r.pieces > 1 ? `  ${r.pieces} PIECES` : ''}${big ? '  TOO BIG' : ''}`);
  }
}
console.log(`\nproblems: ${bad}`);
