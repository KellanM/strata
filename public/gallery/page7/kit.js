// Page 7 helpers (copied from page 5): mirrored setters, sheets and surface tests.
// theme file (it is not listed in manifest.json); the theme files import it.
// Fronts look toward +z; `front` finds the nearest-to-viewer solid voxel.
export const INK = 0x3a3442, BLUSH = 0xf59bb2;

// the front-most (+z) solid voxel at (x, y): its z, or -1
export const frontZ = (g, x, y) => { for (let z = g.dims[2] - 1; z >= 0; z--) if (g.get(x, y, z)) return z; return -1; };
// recolour the front-most voxel at (x, y)
export const front = (g, x, y, c) => { const z = frontZ(g, x, y); if (z >= 0) g.set(x, y, z, c); return g; };
// add a voxel just in front of the front-most voxel at (x, y)
export const out = (g, x, y, c) => { const z = frontZ(g, x, y); if (z >= 0) g.set(x, y, z + 1, c); return g; };
// the same, mirrored across x, so paired features always match
const mx = (g, x) => g.dims[0] - 1 - x;
export const pairFront = (g, x, y, c) => front(front(g, x, y, c), mx(g, x), y, c);
export const pair = (g, x, y, z, c) => g.set(x, y, z, c).set(mx(g, x), y, z, c);
// four-fold: (x, y, z) and its mirrors across x and z (lanterns, legs, roof tips)
export const quad = (g, x, y, z, c) => {
  const X = g.dims[0] - 1, Z = g.dims[2] - 1;
  return g.set(x, y, z, c).set(X - x, y, z, c).set(x, y, Z - z, c).set(X - x, y, Z - z, c);
};
// recolour every solid voxel that passes a test
export const tint = (g, test, c) => {
  const [X, Y, Z] = g.dims;
  for (let z = 0; z < Z; z++) for (let y = 0; y < Y; y++) for (let x = 0; x < X; x++)
    if (g.get(x, y, z) && test(x, y, z)) g.set(x, y, z, typeof c === 'function' ? c(x, y, z) : c);
  return g;
};
// true if a solid voxel has an empty neighbour (it is on the surface)
export const onSurface = (g, x, y, z) =>
  [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]].some(([a, b, c]) => !g.get(x + a, y + b, z + c));
// draw a 2D picture (rows top first, chars by x) onto every z plane in [z0, z1];
// '.' and ' ' are empty, other chars look up a colour in key
export const sheet = (g, rows, [z0, z1], key, x0 = 0, y0 = 0) => {
  const H = rows.length;
  rows.forEach((row, k) => [...row].forEach((ch, x) => {
    if (key[ch] === undefined) return;
    for (let z = z0; z <= z1; z++) g.set(x0 + x, y0 + H - 1 - k, z, key[ch]);
  }));
  return g;
};
// the same picture standing in the z-y plane at x (rows top first, chars by z)
export const sideSheet = (g, rows, [x0, x1], key, z0 = 0, y0 = 0) => {
  const H = rows.length;
  rows.forEach((row, k) => [...row].forEach((ch, z) => {
    if (key[ch] === undefined) return;
    for (let x = x0; x <= x1; x++) g.set(x, y0 + H - 1 - k, z0 + z, key[ch]);
  }));
  return g;
};
