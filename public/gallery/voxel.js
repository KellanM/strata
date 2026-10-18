// Voxel authoring helpers for gallery candidates.
//
// ENTRY FORMAT: each theme file exports `default [ ...entries ]`, and each entry is
// in the game's SHAPES format:
//   {
//     id: 'cand-<slug>',          // unique, kebab-case, prefixed cand-
//     name: 'Teacup',             // display name
//     dims: [X, Y, Z],            // ≤ 10 per side; y is up, z is toward the viewer
//     cell(x, y, z) { return 0xRRGGBB or 0 },  // solid cells return a colour
//     fraction: 0.65, seed: 1,    // optional: clue hiding (defaults 0.65 / 1)
//   }
// The iso view looks from +x +z, so faces, eyes and details that should read
// belong on the high-x / high-z sides.
//
// Three ways to author one, from most direct to most code-like:
//
// 1. grid(X, Y, Z): a mutable 3D grid with drawing ops, then `.entry({ id, name })`.
//      const g = grid(7, 7, 5);
//      g.box([1, 5], [0, 1], [1, 3], C.terracotta)   // inclusive ranges
//       .ellipsoid([3, 4.5, 2], [2.4, 1.6, 1.8], C.green)
//       .cylinder('y', [3, 2], 0.6, [2, 3], C.brown)  // axis, centre of the other two axes, radius, range along axis
//       .set(3, 6, 2, C.red).clear(3, 0, 2)
//       .mirror('x')                                   // copy the low half onto the high half
//       .layers(0, [ ['..r..', '.rrr.'], ... ], { r: C.red });  // y layers from y0 up;
//                                                      // each layer is rows by z (back first), chars by x
//      export default [ g.entry({ id: 'cand-x', name: 'X' }) ];
//    Ops take an optional predicate/colour function instead of a colour:
//      g.box(xr, yr, zr, (x, y, z) => (y === 0 ? C.dbrown : C.brown))
//
// 2. bitmap(rows, depth, key): a 2D picture (rows top to bottom) extruded through z.
// 3. plan(rows, height, key): a plan view (rows back to front) extruded up y;
//    key values may be functions of y.
// Or write cell(x, y, z) directly using ell / disc / inBox.

export const C = {
  cream: 0xf6efe4, white: 0xfbf8f2, red: 0xe0565b, dred: 0xb8434b, coral: 0xf08a6c, orange: 0xf2a03d,
  yellow: 0xf6d365, gold: 0xe9b949, green: 0x5fae6e, dgreen: 0x3f8a5b, leaf: 0x86c77f, brown: 0x8a5a3c,
  dbrown: 0x6b4a3a, tan: 0xd9b48f, crust: 0xb9773f, blue: 0x5b8fd6, sky: 0x8cc8e8, navy: 0x2f4a7a,
  pink: 0xf4a3b5, rose: 0xe2728f, purple: 0x9b7fd1, grey: 0x9aa3ad, dgrey: 0x5d6670, ink: 0x3a3442,
  teal: 0x4fb3a9, sand: 0xe8d3a3, silver: 0xc9d1d9, terracotta: 0xc8704b, bronze: 0xb07a3a, lilac: 0xc9b6e4,
};

export const ell = (dx, dy, dz, rx, ry, rz) => (dx / rx) ** 2 + (dy / ry) ** 2 + (dz / rz) ** 2 <= 1;
export const disc = (dx, dz, r) => dx * dx + dz * dz <= r * r;
export const inBox = (x, y, z, [x0, x1], [y0, y1], [z0, z1]) => x >= x0 && x <= x1 && y >= y0 && y <= y1 && z >= z0 && z <= z1;

export function bitmap(rows, depth, key) {
  const H = rows.length, W = rows[0].length;
  return { dims: [W, H, depth], cell: (x, y) => key[rows[H - 1 - y][x]] || 0 };
}

export function plan(rows, height, key) {
  const Z = rows.length, X = rows[0].length;
  return {
    dims: [X, height, Z],
    cell: (x, y, z) => { const c = key[rows[z][x]]; return typeof c === 'function' ? c(y) : (y < height && c) || 0; },
  };
}

export function grid(X, Y, Z) {
  const v = new Uint32Array(X * Y * Z);
  const at = (x, y, z) => x + X * (y + Y * z);
  const ok = (x, y, z) => x >= 0 && y >= 0 && z >= 0 && x < X && y < Y && z < Z;
  const paint = (x, y, z, c) => {
    if (!ok(x, y, z)) return;
    const col = typeof c === 'function' ? c(x, y, z) : c;
    if (col !== undefined && col !== null) v[at(x, y, z)] = col || 0;
  };
  const g = {
    dims: [X, Y, Z],
    set(x, y, z, c) { paint(x, y, z, c); return g; },
    clear(x, y, z) { if (ok(x, y, z)) v[at(x, y, z)] = 0; return g; },
    get(x, y, z) { return ok(x, y, z) ? v[at(x, y, z)] : 0; },
    box([x0, x1], [y0, y1], [z0, z1], c) {
      for (let z = z0; z <= z1; z++) for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) paint(x, y, z, c);
      return g;
    },
    ellipsoid([cx, cy, cz], [rx, ry, rz], c) {
      for (let z = 0; z < Z; z++) for (let y = 0; y < Y; y++) for (let x = 0; x < X; x++)
        if (ell(x - cx, y - cy, z - cz, rx, ry, rz)) paint(x, y, z, c);
      return g;
    },
    // axis 'x' | 'y' | 'z'; centre: the other two coords in (x,y,z) order minus the axis
    cylinder(axis, [ca, cb], r, [from, to], c) {
      for (let t = from; t <= to; t++) for (let a = -Math.ceil(r); a <= Math.ceil(r); a++) for (let b = -Math.ceil(r); b <= Math.ceil(r); b++) {
        const pa = Math.round(ca + a), pb = Math.round(cb + b);
        if ((pa - ca) ** 2 + (pb - cb) ** 2 > r * r) continue;
        if (axis === 'y') paint(pa, t, pb, c);
        else if (axis === 'x') paint(t, pa, pb, c);
        else paint(pa, pb, t, c);
      }
      return g;
    },
    // copy the low half onto the high half across the middle of an axis
    mirror(axis) {
      for (let z = 0; z < Z; z++) for (let y = 0; y < Y; y++) for (let x = 0; x < X; x++) {
        const [mx, my, mz] = axis === 'x' ? [X - 1 - x, y, z] : axis === 'y' ? [x, Y - 1 - y, z] : [x, y, Z - 1 - z];
        const src = axis === 'x' ? x : axis === 'y' ? y : z, half = (axis === 'x' ? X : axis === 'y' ? Y : Z) / 2;
        if (src < half - 0.5) v[at(mx, my, mz)] = v[at(x, y, z)];
      }
      return g;
    },
    // layers: array from y0 upward; each layer is rows by z (back first), chars by x; '.' or ' ' = empty
    layers(y0, list, key) {
      list.forEach((rows, k) => rows.forEach((row, z) => [...row].forEach((ch, x) => {
        if (key[ch] !== undefined) paint(x, y0 + k, z, key[ch]);
      })));
      return g;
    },
    cell: (x, y, z) => (ok(x, y, z) ? v[at(x, y, z)] : 0),
    entry(meta) { return { ...meta, dims: [X, Y, Z], cell: g.cell }; },
  };
  return g;
}
