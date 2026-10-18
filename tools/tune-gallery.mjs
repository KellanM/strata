// Dev aid: for each candidate in a gallery file, find the clue-hiding setting
// (fraction, seed) that is solvable with difficulty closest to a target D.
// Usage: node tools/tune-gallery.mjs page2/garden-1 [targetD]
import { stats } from '../public/gallery/stats.js';

const [file, targetArg] = process.argv.slice(2);
const target = Number(targetArg) || 7;
const list = (await import(`../public/gallery/${file}.js`)).default;
const out = {};
for (const s of list) {
  let best = null;
  for (const f of [0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65]) {
    for (let seed = 1; seed <= 12; seed++) {
      const r = stats({ ...s, fraction: f, seed });
      if (!r.solvable) continue;
      const score = Math.abs(r.D - target) - f * 0.5;     // near the target; more hidden clues on ties
      if (!best || score < best.score) best = { f, seed, D: r.D, score };
    }
  }
  out[s.id] = best ? { fraction: best.f, seed: best.seed } : null;
  console.log(s.id.padEnd(26), best ? `f ${best.f}  seed ${best.seed}  D ${best.D.toFixed(1)}` : 'no solvable setting');
}
console.log(JSON.stringify(out));
