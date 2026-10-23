// Page 14 uses page 11's kit (mirrored setters, sheets, lathe), plus the
// ordered-dither ramp from the Heart amulet (shapes.js): a five-step tone
// ramp lit from the upper left, neighbouring steps blended by a 2x2 Bayer
// pattern so a curve reads as curved, not banded. Not a section file; the
// section files import it.
export * from '../page11/kit.js';

export const BAYER = [[0, 2], [3, 1]];
// tones dark to light; k in 0..1 is how lit the cell is; shift darkens by whole steps
export const ramp = (tones, k, x, y, shift = 0) => {
  const t = k * (tones.length - 1) + (BAYER[y & 1][x & 1] / 4 - 0.375) - shift;
  return tones[Math.max(0, Math.min(tones.length - 1, Math.round(t)))];
};
// paint the outermost voxel on both flanks (lowest and highest z) at (x, y):
// eyes and markings for creatures seen side on
export const flank = (g, x, y, c) => {
  const Z = g.dims[2];
  for (let z = 0; z < Z; z++) if (g.get(x, y, z)) { g.set(x, y, z, c); break; }
  for (let z = Z - 1; z >= 0; z--) if (g.get(x, y, z)) { g.set(x, y, z, c); break; }
  return g;
};
