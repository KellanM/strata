# Visual study: Monument Valley → Strata

**Brief.** A 3D nonogram played mostly on phones. It should feel calm, architectural and hand-coloured. The clue numbers must stay readable on every face and palette.

## Sources
- ustwo developers on Unity ([MCV/Develop](https://www.mcvuk.com/development/unity-focus-monument-valley)): "We ended up writing all our own shaders, using a custom directional lighting model", plus static lightmapping for ambient occlusion, and "hefty overdraw for vignetting and faked volumetric glows". Ken Wong wanted "a very clean, simple look".
- Creative Bloq, *The making of Monument Valley*: Wong printed every screen as a **colour script** and revised it from there. Colour was applied directly through shaders rather than a true lighting system.
- Community recreations (ArtStation, Polycount): flat colours keyed to cardinal face directions, a world-space Y gradient, tinted shadows.
- Limits: I couldn't play the game in this session or get the GDC 2018 talk itself. Observations about the game come from published stills and memory and are marked provisional.

## Mechanisms → what we built
| Source mechanism | Implementation | Result |
|---|---|---|
| Custom directional lighting: each face takes a hand-picked colour | `cubes.js` `ramp()` picks the colour by face normal (top / lit / shade / under). No speculars, no real-time shadows | Kept. The first light direction lit both visible sides the same, which killed the three-tone read. Fixed by swinging the light so one side is lit and the other is in shadow |
| Static AO | Per-face crease bits (4 edges × 6 faces) computed on the CPU from neighbours, darkened in the shader | Kept. Reads clearly in hollows (see the mug rim) |
| Vignette + faked volumetric glow | Silhouette mask → radial blur outward ("reverse god rays"), cut back out of the block, plus a vignette | Kept. The first pass was too strong and washed out the block's base. Added a per-palette `rayGain`; light skies need about half |
| Colour script per chapter | `palettes.js`: five palettes, one per puzzle | Kept |
| Y gradient / base sinking into haze | Mix toward the sky-bottom colour by height | Kept, kept subtle so the lowest clues stay readable |
| Clean, simple look | Ortho isometric camera, thin letterspaced UI, no chrome on the block | Kept |

## Open questions
- Whether the rays on light palettes still feel strong enough on a real phone screen. Only checked in Chromium.
- Clue legibility on the "under" face hasn't been checked at small sizes.
