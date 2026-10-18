// Page 3 helpers: kawaii faces on voxel critters. Not a theme file (it is not
// listed in manifest.json); the theme files import it. Faces look toward +z,
// so `front` finds the nearest-to-viewer solid voxel of a column.
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
export const pairOut = (g, x, y, c) => out(out(g, x, y, c), mx(g, x), y, c);
export const pair = (g, x, y, z, c) => g.set(x, y, z, c).set(mx(g, x), y, z, c);
// two eyes at x / mirror, height y; blush one lower and one further out
export const kawaii = (g, ex, ey, { eye = INK, blush = BLUSH, bx = ex - 1, by = ey - 1 } = {}) => {
  pairFront(g, ex, ey, eye);
  if (blush) pairFront(g, bx, by, blush);
  return g;
};
// recolour every solid voxel that passes a test
export const tint = (g, test, c) => {
  const [X, Y, Z] = g.dims;
  for (let z = 0; z < Z; z++) for (let y = 0; y < Y; y++) for (let x = 0; x < X; x++)
    if (g.get(x, y, z) && test(x, y, z)) g.set(x, y, z, c);
  return g;
};
