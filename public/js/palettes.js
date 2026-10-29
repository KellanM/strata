// Colour script: each puzzle is lit with its own palette, the way Monument
// Valley gives every chapter a hand-picked scheme instead of physical lighting.
// Faces take a colour from a ramp keyed to the direction they face.
export const PALETTES = [
  {
    name: 'Dawn', rayGain: 0.8,
    skyTop: 0xb48fb0, skyBottom: 0xf0b493, glow: 0xfff0dc,   // sunrise: a rose sky over an apricot horizon (Kellan, 2026-10-28; it was a bright cream)
    top: 0xfcf0de, lit: 0xf1c4a6, shade: 0xa98cb6, under: 0x6f5b8c,
    paintTop: 0x9fe1d4, paintLit: 0x5db6ae, paintShade: 0x3a7a8d,
    rays: 0xfff0d6, motes: 0xfff6e8,
  },
  {
    name: 'Lagoon', rayGain: 0.5,
    skyTop: 0xcdeae4, skyBottom: 0x7aa5c2, glow: 0xfdfbea,
    top: 0xfff5e2, lit: 0xf3cf9c, shade: 0x6f9cb4, under: 0x4b6c8e,
    paintTop: 0xffb1a0, paintLit: 0xe6726b, paintShade: 0xa24f64,
    rays: 0xfffbe6, motes: 0xffffff,
  },
  {
    name: 'Dusk', rayGain: 1.0,
    skyTop: 0x3a2e5e, skyBottom: 0xe79a7e, glow: 0xffc8a2,
    top: 0xffdcbc, lit: 0xec938a, shade: 0x6c518d, under: 0x3d2e63,
    paintTop: 0xffe596, paintLit: 0xf2b45a, paintShade: 0xae6a4c,
    rays: 0xffc9a0, motes: 0xffe2c4,
  },
  {
    name: 'Mint', rayGain: 0.55,
    skyTop: 0xeaf2df, skyBottom: 0xaed0c0, glow: 0xfffdf2,
    top: 0xfffaf0, lit: 0xf3d6c0, shade: 0x93b5ab, under: 0x67898a,
    paintTop: 0xf6b3c2, paintLit: 0xdb7b97, paintShade: 0x9a527a,
    rays: 0xfffbea, motes: 0xffffff,
  },
  {
    // late afternoon in the orchard: warm gold sky, apricot light, sage shadow
    name: 'Orchard', rayGain: 0.75,
    skyTop: 0xfbe3b6, skyBottom: 0xd9a77c, glow: 0xfff3d6,
    top: 0xfdf1dc, lit: 0xf2c89a, shade: 0x9fae8a, under: 0x6f7f62,
    paintTop: 0xf6a98c, paintLit: 0xe0785f, paintShade: 0xa4524f,
    rays: 0xffe9bf, motes: 0xfff6dc,
  },
  {
    // a festival night: deep plum sky, vermilion and lantern gold
    name: 'Festival', rayGain: 1.1,
    skyTop: 0x1c1433, skyBottom: 0x6b2346, glow: 0xffb36b,
    top: 0xf7e3cf, lit: 0xe88a6a, shade: 0x5d3a6e, under: 0x2e1f47,
    paintTop: 0xffd98a, paintLit: 0xf2a541, paintShade: 0xb0623a,
    rays: 0xffc98f, motes: 0xffd7a3,
  },
  {
    name: 'Night', rayGain: 1.15,
    skyTop: 0x161b36, skyBottom: 0x4a5482, glow: 0xb9c8ff,
    top: 0xf2e9da, lit: 0xc7b6db, shade: 0x4f5a8f, under: 0x2a3262,
    paintTop: 0xffd58a, paintLit: 0xeb9e4e, paintShade: 0xa7653f,
    rays: 0xc9d6ff, motes: 0xdfe6ff,
  },
  // The eight biomes of docs/biomes.md; skies match gallery pages 6-8.
  {
    // Beacon Hills (chapter II since it replaced Teatime): slate hills going to
    // ember, cool stone in the shade so the fire reads brightest, an ember mark
    name: 'Beacon', rayGain: 0.9,
    skyTop: 0xc3c8de, skyBottom: 0xefae8a, glow: 0xffe4c4,
    top: 0xfbf2e8, lit: 0xf0c0a0, shade: 0x8e93b0, under: 0x565a7e,
    paintTop: 0xffc27e, paintLit: 0xee7a4c, paintShade: 0xa8443c,
    rays: 0xffdcb8, motes: 0xfff0de,
  },
  {
    // the kitchen at four o'clock: cream and biscuit, mint-green enamel
    // (no chapter uses it since Beacon Hills replaced Teatime; kept for the gallery)
    name: 'Teatime', rayGain: 0.7,
    skyTop: 0xfbe8d6, skyBottom: 0xe2b49a, glow: 0xfff3e2,
    top: 0xfff4e6, lit: 0xf3c9a8, shade: 0xb48c8c, under: 0x7c5a66,
    paintTop: 0xa8dcc8, paintLit: 0x6fb8a4, paintShade: 0x45807c,
    rays: 0xffeed8, motes: 0xfff8ee,
  },
  {
    // leaf fall and woodsmoke: amber sky, russet stone, a cool moss mark
    name: 'Autumn', rayGain: 0.8,
    skyTop: 0xf6d2a2, skyBottom: 0xb8654a, glow: 0xffe9c4,
    top: 0xfdecd2, lit: 0xf0b383, shade: 0x9a6a5c, under: 0x5e3f45,
    paintTop: 0x9fd4b8, paintLit: 0x5ea88a, paintShade: 0x3a7064,
    rays: 0xffdcb0, motes: 0xffe6c6,
  },
  {
    // the sea below the sea: navy to teal, cyan glow, amber lamps
    name: 'Deep', rayGain: 1.1,
    skyTop: 0x0d2a3f, skyBottom: 0x1f6f7a, glow: 0x7ff3e6,
    top: 0xdff3ee, lit: 0x8fd0c8, shade: 0x4a8590, under: 0x24506a,
    paintTop: 0xffe08a, paintLit: 0xf2b04a, paintShade: 0xb06a3a,
    rays: 0x9ff6ec, motes: 0xc8fff6,
  },
  {
    // heat shimmer: sand-gold sky, terracotta shade, oasis-water mark
    name: 'Desert', rayGain: 0.85,
    skyTop: 0xfde7b8, skyBottom: 0xe59a5c, glow: 0xfff4d0,
    top: 0xfff1d8, lit: 0xf6c48e, shade: 0xc27f62, under: 0x8a4f4a,
    paintTop: 0x8fe0dc, paintLit: 0x45b4b8, paintShade: 0x2a7a8c,
    rays: 0xfff0c8, motes: 0xfff8e4,
  },
  {
    // old stones in the mist: grey-green sky, lichen-gold mark
    name: 'Stones', rayGain: 0.5,
    skyTop: 0xdfe6dc, skyBottom: 0x8fa59a, glow: 0xf8fbf2,
    top: 0xf4f2ea, lit: 0xd8d0c0, shade: 0x8a9a92, under: 0x5a6a68,
    paintTop: 0xf2d27a, paintLit: 0xd2a64a, paintShade: 0x8f7040,
    rays: 0xf2f6ea, motes: 0xffffff,
  },
  {
    // the workshop by lamplight: dark wood to brass, teal enamel mark
    name: 'Clockwork', rayGain: 1.05,
    skyTop: 0x3b2a1e, skyBottom: 0xc98b4a, glow: 0xffd28a,
    top: 0xfbe6c4, lit: 0xe0a868, shade: 0x7a5038, under: 0x3e2a22,
    paintTop: 0x9fe0d0, paintLit: 0x4fb3a9, paintShade: 0x2f7a78,
    rays: 0xffcf8f, motes: 0xffe2b0,
  },
  {
    // thin air and deep snow: white to ice blue, a warm mitten-red mark
    name: 'Frost', rayGain: 0.55,
    skyTop: 0xeef4fb, skyBottom: 0xa9c3dd, glow: 0xffffff,
    top: 0xffffff, lit: 0xdde8f4, shade: 0x8fa6c4, under: 0x5b6f92,
    paintTop: 0xffb0a0, paintLit: 0xe86a5e, paintShade: 0xa8424e,
    rays: 0xf4f8ff, motes: 0xffffff,
  },
  {
    // above the weather: pale periwinkle, peach light, a sunny mark
    name: 'Clouds', rayGain: 0.65,
    skyTop: 0xe3efff, skyBottom: 0xb8c8f2, glow: 0xfffdf4,
    top: 0xfffaf2, lit: 0xf6d6c4, shade: 0x9aa6d6, under: 0x6a73a8,
    paintTop: 0xffd98a, paintLit: 0xf2a95a, paintShade: 0xb8704a,
    rays: 0xfff8ea, motes: 0xffffff,
  },
];

// Each level gets its own moment inside its chapter's colour script: the day
// moves on as you walk the chapter (t: 0 first level -> 1 last), so the sky
// drifts in hue and deepens, the key light swings round, and the marking
// colour shifts a little per level. Shifts stay small so a chapter still
// reads as one place.
export function variant(base, t, seed = 0) {
  const j = jitter(seed);                       // -1..1, stable per level
  const dark = hsl(base.skyTop)[2] < 0.35;
  const skyHue = lerp(-0.03, 0.03, t) + 0.012 * j;
  const skyLight = dark ? lerp(-0.03, 0.04, t) : lerp(0.03, -0.05, t);
  const sky = (h) => shift(h, skyHue, 0, skyLight);
  const stone = (h) => shift(h, skyHue * 0.5, 0, 0);
  const paint = (h) => shift(h, 0.045 * j, 0.03 * j, 0);
  return {
    ...base,
    base: base.name,
    skyTop: sky(base.skyTop), skyBottom: shift(base.skyBottom, skyHue * 1.2, 0, skyLight * 0.6),
    glow: shift(base.glow, skyHue * 0.7, 0, 0), rays: shift(base.rays, skyHue * 0.7, 0, 0),
    motes: shift(base.motes, skyHue * 0.7, 0, 0),
    top: stone(base.top), lit: stone(base.lit), shade: stone(base.shade), under: stone(base.under),
    paintTop: paint(base.paintTop), paintLit: paint(base.paintLit), paintShade: paint(base.paintShade),
    lightAngle: lerp(-0.35, 0.35, t) + 0.1 * j,
    rayGain: base.rayGain * (0.85 + 0.3 * t),
  };
}

const lerp = (a, b, t) => a + (b - a) * t;

function jitter(seed) {
  let x = Math.imul(seed + 0x9e3779b9, 0x85ebca6b) >>> 0;
  x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35) >>> 0;
  return ((x ^ (x >>> 16)) >>> 0) / 0xffffffff * 2 - 1;
}

function hsl(hex) {
  const r = (hex >> 16 & 255) / 255, g = (hex >> 8 & 255) / 255, b = (hex & 255) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min, s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h / 6, s, l];
}

function shift(hex, dh, ds, dl) {
  let [h, s, l] = hsl(hex);
  h = (h + dh + 1) % 1; s = Math.min(1, Math.max(0, s + ds)); l = Math.min(1, Math.max(0, l + dl));
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
  const ch = (t) => {
    t = (t + 1) % 1;
    const v = t < 1 / 6 ? p + (q - p) * 6 * t : t < 1 / 2 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p;
    return Math.round(v * 255);
  };
  return (ch(h + 1 / 3) << 16) | (ch(h) << 8) | ch(h - 1 / 3);
}
