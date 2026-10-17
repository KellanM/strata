// Writes public/icon.svg: a Dawn-palette 2x2x2 block with its front-top cube
// chiselled away, drawn in the same top/lit/shade ramp as the game.
import { writeFileSync } from 'node:fs';

const S = 1024, s = 150, cx = S / 2, cy = S / 2 + 40;
const c = Math.cos(Math.PI / 6), n = Math.sin(Math.PI / 6);
const P = (x, y, z) => [cx + (x - z) * c * s, cy + (x + z) * n * s - y * s];
const poly = (pts, fill) => `<path d="M${pts.map((p) => p.map((v) => v.toFixed(1)).join(' ')).join('L')}Z" fill="${fill}" stroke="#6f5b8c" stroke-opacity=".18" stroke-width="5" stroke-linejoin="round"/>`;

const cubes = [];
for (let y = 0; y < 2; y++) for (let z = 0; z < 2; z++) for (let x = 0; x < 2; x++)
  if (!(x === 1 && y === 1 && z === 1)) cubes.push([x - 1, y - 1, z - 1]);
cubes.sort((a, b) => a[0] + a[1] + a[2] - b[0] - b[1] - b[2]);

let faces = '';
for (const [x, y, z] of cubes) {
  faces += poly([P(x, y + 1, z), P(x + 1, y + 1, z), P(x + 1, y + 1, z + 1), P(x, y + 1, z + 1)], '#fcf0de');
  faces += poly([P(x, y + 1, z + 1), P(x + 1, y + 1, z + 1), P(x + 1, y, z + 1), P(x, y, z + 1)], '#f1c4a6');
  faces += poly([P(x + 1, y + 1, z), P(x + 1, y + 1, z + 1), P(x + 1, y, z + 1), P(x + 1, y, z)], '#a98cb6');
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}">
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7dccb"/><stop offset="1" stop-color="#c6a3c4"/></linearGradient>
<radialGradient id="halo" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff1df" stop-opacity=".95"/><stop offset=".55" stop-color="#fff1df" stop-opacity=".35"/><stop offset="1" stop-color="#fff1df" stop-opacity="0"/></radialGradient>
</defs>
<rect width="${S}" height="${S}" fill="url(#sky)"/>
<circle cx="${cx}" cy="${cy - 60}" r="470" fill="url(#halo)"/>
${faces}
</svg>
`;
writeFileSync(new URL('../public/icon.svg', import.meta.url), svg);
