// The clue numbers' contrast against their faces, in every chapter palette, as the eye
// sees it and as it is seen with each colour-vision deficiency (docs/growth-roadmap.md
// test 7). The faces are taken as cubes.js shades them where a clue sits: the face's
// ramp (top; the sides from shade to lit; under), the haze at the block's foot, a little
// crease shadow, and painted (marked) cubes in the palette's mark colours. The ink is
// cubes.js's own rule, run here in JS (inkFor below mirrors the shader).
//
//   node tools/clue-contrast.mjs            the table: the lowest contrast per palette
//   node tools/clue-contrast.mjs --rule old the rule before v1.1 (the dark ink on a face lighter
//                                           than luma 0.5, the light ink otherwise)
//
// WCAG contrast (relative luminance, linear sRGB). Colour-vision deficiencies are
// simulated with Machado, Oliveira & Fernandes (2009) at full severity, in linear RGB;
// greyscale is the luminance itself, so it reads as the normal column.
import { PALETTES, variant } from '../public/js/palettes.js';

const rule = process.argv.includes('--rule') ? process.argv[process.argv.indexOf('--rule') + 1] : 'new';

const hex = (h) => [(h >> 16 & 255) / 255, (h >> 8 & 255) / 255, (h & 255) / 255];
const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const mul = (a, k) => a.map((v, i) => v * (Array.isArray(k) ? k[i] : k));
const clamp01 = (c) => c.map((v) => Math.min(1, Math.max(0, v)));
const lin = (c) => c.map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
const Y = (l) => 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2];
const ratio = (a, b) => { const [p, q] = [Y(a), Y(b)].sort((x, y) => y - x); return (p + 0.05) / (q + 0.05); };
const CVD = {
  protan: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
  deutan: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.011820, 0.042940, 0.968881]],
  tritan: [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.303900]],
};
const sim = (m, l) => clamp01(m.map((r) => r[0] * l[0] + r[1] * l[1] + r[2] * l[2]));

// cubes.js: the ink for a face's clue
const DARK = [0.36, 0.33, 0.42], CREAM = [1.0, 0.97, 0.92];
function inkFor(base) {
  const dark = mul(base, DARK), light = mix(base, CREAM, 0.78);
  if (rule === 'old') return 0.299 * base[0] + 0.587 * base[1] + 0.114 * base[2] > 0.5 ? dark : light;
  // the ink that stands further from the face (luminance, as cubes.js approximates it: ^2.2)
  const y = (c) => 0.2126 * c[0] ** 2.2 + 0.7152 * c[1] ** 2.2 + 0.0722 * c[2] ** 2.2;
  const by = y(base), cr = (c) => (Math.max(by, y(c)) + 0.05) / (Math.min(by, y(c)) + 0.05);
  const useDark = cr(dark) >= cr(light), ink = useDark ? dark : light;
  // a mid-tone face, where even that one stands close: taken further, toward near-black or cream,
  // as far as it falls short of 4.5:1
  const k = Math.min(1, Math.max(0, (4.5 - cr(ink)) / 0.5));
  return mix(ink, useDark ? mul(base, 0.12) : CREAM, k);
}

// the faces a clue can sit on, for one level's palette
function faces(p) {
  const out = [], haze = hex(p.skyBottom);
  const add = (name, c) => {
    for (const h of [0.78, 1]) for (const occ of [0, 0.3]) out.push({ name: `${name}${h < 1 ? ' at the foot' : ''}${occ ? ' in a crease' : ''}`, c: clamp01(mix(haze, mul(c, 1 - 0.28 * occ), h)) });
  };
  add('top', hex(p.top));
  for (let s = 0; s <= 1.001; s += 0.1) add(`side ${s.toFixed(1)}`, mix(hex(p.shade), hex(p.lit), s));
  add('under', hex(p.under));
  add('marked top', hex(p.paintTop));
  for (let s = 0; s <= 1.001; s += 0.25) add(`marked side ${s.toFixed(2)}`, mix(hex(p.paintShade), hex(p.paintLit), s));
  return out;
}

const rows = [];
for (const base of PALETTES) {
  const worst = { normal: [99], protan: [99], deutan: [99], tritan: [99] };
  for (const t of [0, 0.5, 1]) for (const seed of [0, 7, 19, 42]) {
    for (const f of faces(variant(base, t, seed))) {
      const glyph = mix(f.c, inkFor(f.c), 0.92);   // the atlas's full coverage, as the shader inks it
      const a = lin(f.c), b = lin(glyph);
      const r = { normal: ratio(a, b) };
      for (const [k, m] of Object.entries(CVD)) r[k] = ratio(sim(m, a), sim(m, b));
      for (const k of Object.keys(worst)) if (r[k] < worst[k][0]) worst[k] = [r[k], f.name];
    }
  }
  rows.push({ palette: base.name, ...Object.fromEntries(Object.entries(worst).map(([k, [v, n]]) => [k, `${v.toFixed(2)} (${n})`])) });
}
console.log(`clue contrast, the lowest per palette (rule: ${rule}); greyscale = normal`);
console.table(rows);
