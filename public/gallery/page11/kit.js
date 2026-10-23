// Page 11 helpers (page 10's kit) plus the shared colours of the unearthed
// world, so every family on pages 11 and 12 is cut from the same stone.
// Not a section file (it is not listed in manifest.json); the section files
// import it. Fronts look toward +z; `front` finds the nearest-to-viewer voxel.
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
// mirror pairs about a chosen centre (for bodies that sit off the grid's middle)
export const pairAt = (g, cx, x, y, z, c) => g.set(x, y, z, c).set(2 * cx - x, y, z, c);
export const pairFrontAt = (g, cx, x, y, c) => front(front(g, x, y, c), 2 * cx - x, y, c);
// mirrored across z instead (side-on creatures: eyes, ears, panniers on both flanks)
export const pairZ = (g, x, y, z, c) => g.set(x, y, z, c).set(x, y, g.dims[2] - 1 - z, c);
export const pairZAt = (g, cz, x, y, z, c) => g.set(x, y, z, c).set(x, y, 2 * cz - z, c);
// four-fold: (x, y, z) and its mirrors across x and z (legs, posts, roof tips)
export const quad = (g, x, y, z, c) => {
  const X = g.dims[0] - 1, Z = g.dims[2] - 1;
  return g.set(x, y, z, c).set(X - x, y, z, c).set(x, y, Z - z, c).set(X - x, y, Z - z, c);
};
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
    if (g.get(x, y, z) && test(x, y, z)) g.set(x, y, z, typeof c === 'function' ? c(x, y, z) : c);
  return g;
};
// true if a solid voxel has an empty neighbour (it is on the surface)
export const onSurface = (g, x, y, z) =>
  [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]].some(([a, b, c]) => !g.get(x + a, y + b, z + c));
// a solid of revolution about the y axis: radii[k] is the radius at y0 + k
export const lathe = (g, [cx, cz], y0, radii, c) => {
  radii.forEach((r, k) => { if (r > 0) g.cylinder('y', [cx, cz], r, [y0 + k, y0 + k], c); });
  return g;
};
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
// a plan view (rows back to front, chars by x) laid on the y plane at y0
export const plan = (g, rows, y0, key, x0 = 0, z0 = 0) => {
  rows.forEach((row, z) => [...row].forEach((ch, x) => { if (key[ch] !== undefined) g.set(x0 + x, y0, z0 + z, key[ch]); }));
  return g;
};

// The shared material: warm sandstone (the mist sky is grey-green), bright
// spring moss, and one accent per "type" - ember, tide, frost, crystal, star.
// Cyan is kept for stone that still glows from the old world.
export const S = {
  stone: 0xc7beb0, stoneLt: 0xdcd4c6, stoneDk: 0x8f877c, basalt: 0x6f6a66, sand: 0xd9c49a, sandDk: 0xb89a6e,
  moss: 0x7cc35a, mossDk: 0x4f9a4a, mossLt: 0xa8d97a, lichen: 0xe0cf6a, glow: 0x7fe0e6, glowDk: 0x3fb8c4,
  ember: 0xf2803d, emberHot: 0xf6c14a, emberDk: 0xc4502e, ash: 0x5a4f4c,
  tide: 0x5ea8dc, tideDk: 0x3f7fb8, foam: 0xdff1fa, barnacle: 0xeee6d6, kelp: 0x4f8f6a,
  frost: 0xf4f9fd, frostBlue: 0xa9d4ee, ice: 0xcfe9f7, iceDk: 0x86b8dc,
  crystal: 0xb48ce8, crystalLt: 0xdcc8f8, crystalDk: 0x8160c4,
  star: 0xf6d365, starHot: 0xfff2b8, starDk: 0xe0a83a,
  pink: 0xf4a3b5, red: 0xe0565b, cream: 0xf6efe4, bone: 0xefe6cf, boneDk: 0xcdbf9f, earth: 0x8a6a4a,
};
// closed, sleeping eyes: a short dark line on the front of the face, mirrored
export const sleepy = (g, x, y, c = 0x6f6a66) => pairFront(pairFront(g, x, y, c), x + 1, y, c);
