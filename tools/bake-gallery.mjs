// Bakes gallery candidates into SHAPES source: each object's voxels become
// layered strings for voxels() in public/js/shapes.js, so a picked object
// becomes a level without the game depending on gallery files (which are not
// in the offline cache).
//
//   node tools/bake-gallery.mjs cand-bed cand-fox ...
import { readdirSync } from 'node:fs';

const ids = process.argv.slice(2);
const pool = [];
for (const dir of ['themes', 'extra', 'page2']) {
  for (const f of readdirSync(new URL(`../public/gallery/${dir}/`, import.meta.url))) {
    if (!f.endsWith('.js')) continue;
    pool.push(...(await import(`../public/gallery/${dir}/${f}`)).default);
  }
}

const hex = (c) => '0x' + c.toString(16).padStart(6, '0');
for (const id of ids) {
  const e = pool.find((p) => p.id === id);
  if (!e) { console.error(`missing ${id}`); continue; }
  const [X, Y, Z] = e.dims;
  const key = new Map();
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const layers = [];
  for (let y = 0; y < Y; y++) {
    const rows = [];
    for (let z = 0; z < Z; z++) {
      let row = '';
      for (let x = 0; x < X; x++) {
        const c = e.cell(x, y, z);
        if (!c) { row += '.'; continue; }
        if (!key.has(c)) key.set(c, letters[key.size]);
        row += key.get(c);
      }
      rows.push(row);
    }
    layers.push(rows.join(' '));
  }
  const legend = [...key].map(([c, l]) => `${l}: ${hex(c)}`).join(', ');
  console.log(`// ${id}: ${e.name} ${X}x${Y}x${Z}`);
  console.log(`...voxels({ ${legend} }, [`);
  for (const l of layers) console.log(`  '${l}',`);
  console.log(']),\n');
}
