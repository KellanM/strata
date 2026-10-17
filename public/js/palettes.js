// Colour script: each puzzle is lit with its own palette, the way Monument
// Valley gives every chapter a hand-picked scheme instead of physical lighting.
// Faces take a colour from a ramp keyed to the direction they face.
export const PALETTES = [
  {
    name: 'Dawn', rayGain: 0.8,
    skyTop: 0xf7dccb, skyBottom: 0xc6a3c4, glow: 0xfff1df,
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
    name: 'Night', rayGain: 1.15,
    skyTop: 0x161b36, skyBottom: 0x4a5482, glow: 0xb9c8ff,
    top: 0xf2e9da, lit: 0xc7b6db, shade: 0x4f5a8f, under: 0x2a3262,
    paintTop: 0xffd58a, paintLit: 0xeb9e4e, paintShade: 0xa7653f,
    rays: 0xc9d6ff, motes: 0xdfe6ff,
  },
];
