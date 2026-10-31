# Voxel object design: study record (2026-10-17)

Research for the object gallery and new levels. Sources: Picross 3D Round 2
colour roles (ludusnovus), Picross 3D reveal (Wikipedia, Destructoid),
Crossy Road's angled camera (PocketGamer.biz), Townscaper (Oskar Stålberg,
Game Developer), Monument Valley (Creative Review), voxel dioramas (Thibault
Simar, 80.lv), pixel art (Derek Yu, Stardew modding wiki). Text-only
research: no images were inspected; no HAL / Crossy Road artist interviews
were found.

## Checklist (apply to every object)

Run `node tools/voxel-lint.mjs <gallery file>` first. It measures the rules a script can: size, solvable, one piece, fill, how many colours the light ramps, stray single cubes and thin shafts. Its limits are set so that Kellan's favourites (Pegasus Foal, Origami Fox, Meerkat Lookout) pass clean. Everything else on this list, the look above all, still needs `tools/qa-sheet.mjs` and eyes.

### Dithered light (Kellan, 2026-10-23 and 2026-10-31)

The game lights every level itself when it loads (`lit()` in `public/js/shapes.js`, the Heart's look). Each colour on 5 or more cubes becomes a short ramp of tones, lit from the upper left and the front. Neighbouring tones are blended by a 2x2 ordered dither, warm and pale in the light, cool and deep in shade. The gallery and the QA sheet show candidates lit the same way; add `?flat=1` to see the flat colours.

- **Author flat colours, one per material.** Don't hand-paint highlights, shadows or gradients: the light does that, and painting it again muddies the steps. The light is the shading; the colours are the materials.
- **Judge the lit version.** The squint test, the colour jobs and the contrast with the sky are all judged as the player will see them, in the gallery as it is now, not flat.
- **Accents stay exact.** Colours on fewer than 5 cubes (eyes, a flame, a glint, a nose) are left flat. Keep eyes and the identity accent under 5 cubes so they stay crisp.
- **Patterns get the softer light.** Where the object's own pattern does the work (stripes, scales, segments, checks, mottling, stones in a wall), the full ramp crossing it reads as speckle. Give the entry `lit: { span: 2 }`; it goes into `LIT` in shapes.js when it becomes a level. The lint flags a colour broken into 6 or more single cubes.
- **Keep ramped colours apart.** Each ramped colour spreads over about two tones either way, so two colours close in value merge once lit. Use 2–4 ramped colours (accents are free), separated in lightness, not just in hue. The lint flags 6 or more.
- **Hand-made ramps are the exception.** A hand ramp (page 14's kit `ramp()`) is only for metal or glow that must read brighter than the light alone gives: the Heart's gold, the amber, the orrery's sun. Mark the entry `lit: false` and say why in its comment; the level goes in `LIT_SKIP`. Everything else is authored flat.
- **Changing an existing level's light:** `swap` recolours first (e.g. cobalt on porcelain for the Teapot), and `keep` lists colours to leave flat.

### Silhouette and character (2026-10-31, docs/silhouette-study-sources.md)

The QA sheet now shows each object's game view filled solid ("silhouette") and at 40 px. These rules, ranked, come before the form-and-colour list below and win where they disagree:

1. **Name it at 40 px** in the game view, with one noun, within 2 seconds. This is the test the rest serves.
2. **The identity feature sets the outline.** In the silhouette panel, hiding it should shrink the top or the width: the fox's ear prongs and raised tail, the pegasus's wings at full width. Exception: things whose known outline is already compact (pumpkin, kokeshi, daruma, tortoise). Match the thing's well-known outline; don't add protrusions for their own sake. Outline complexity does not separate Kellan's favourites from the rest.
3. **Colour blocks are parts.** 2–3 big flat colours, one per part, plus accents under 5 cubes. At this size colour names more than outline does.
4. **Creatures face the camera:** both eyes visible from the game view, the snout toward +z or +x.
5. **The pose is the subject's signature behaviour** (the meerkat stands sentinel, the cat beckons). The action limb sits on the outline, never in front of the body in the same colour ("A hand in front of a chest would simply disappear", Lasseter).
6. **Negative space as notches, not holes.** The iso view's depth fills holes in, and only 1% of 638 gallery objects show an enclosed hole. Use V notches between ears, gaps between legs and steps in the outline.
7. **No tangents.** Where two parts meet, there is a step of at least 1 cube or a change in lightness, so they don't merge.
8. **Big, medium, small** by cube count: about half or more, 25–40%, under 10%.
9. **Baby schema for cute creatures:** head volume at least ⅔ of the body's, eyes in the lower half of the head, no mouth, stub legs. Waived when the identity is a body proportion (the meerkat's height). A baby keeps its key part full size and shrinks the rest (Luxo Jr.).
10. **Shape family matches temperament:** ellipsoids for soft, boxes for steady, single-cube points for sly or alert.
11. **Mirror the features, free the pose.** Fully symmetric front-on icons are fine: the Pegasus and the Kokeshi are.
12. **A context base** (cloud, mound, nest, step) holds at most about ⅓ of the cubes and differs in lightness from the figure.
13. **Darkest low, strongest contrast at the identity** (Valve's TF2: dark feet to light chest).
14. **Reject on sight:** stray single cubes, a same-colour part in front of the body, look-alike colours, detail hidden from the game view, and motifs that need a caption to read.

### Form and colour

- **Review from every side before calling it done**: all four iso corners, a
  top-down and a straight front view (tools/qa-sheet.mjs). One camera angle
  hides mistakes.
- **Paired features match**: eyes, ears, horns, wings, arms/legs, claws, fins,
  whiskers, cheeks, paired handles/straps — same colour, same size, mirrored.
  Asymmetry is optional (rule 11 above): when used it is a readable
  character choice (a tilted hat, one raised paw), never a one-sided eye, horn or wing. The user has flagged this
  repeatedly (gnome, snail, pelican, dragon).

- Design the silhouette in the game view first. Opposite corners show the same
  outline mirrored, so check the outline at two corners; colours and face still
  need all four.
- Sizes: small things 5–6³; props/creatures 7³; tall 5×9×5–6×10×6; wide
  9×5×5. Prefer a clear long axis to a perfect cube.
- Main mass plus the protrusions the thing is known by (handle, ears, tail,
  spout, flag); a compact outline is fine when that is the thing's outline
  (rule 2 above).
- 2–4 colours with jobs: body, identity feature, accent, single dark voxel
  for eyes. Non-body colours ≤ ~25% of voxels.
- Each colour forms one or two connected regions; no scattered single voxels
  except eyes.
- Cute: see the baby schema (rule 9 above); eyes are two single dark voxels
  set wide and low, with no mouth or a one-voxel one.
- Identity colour is the most saturated; the body is a pastel that separates
  from the chapter background.
- Hollow where it means something (lantern, house, shell, teapot, birdhouse):
  a 1–3 voxel interior in a surprise colour, shell ≥ 1 thick, an opening.
- No detail on the hidden underside.
- No 1-voxel diagonal staircases longer than 2, no 1-thick shafts longer
  than 3, no edge- or corner-only connections.
- Nonogram: varied row counts, some rows split into 2+ groups, ~25–55% fill,
  no solid rectangles, no floating voxels.
- Negative space is a feature, as notches the game view can show (gap under a
  table, between legs, a handle loop seen side on); enclosed holes mostly fill in.
- Squint test: see rule 1 above (40 px, the QA sheet's panel).

## Mechanisms

1. Colour has a job (Picross 3D R2): each colour names a part or material.
2. The angle shows three faces at once (Crossy Road "voxels look better at
   an angle"): check from the win-screen iso view and its 90° turns.
3. Predictable big shapes, varied small ones (Stålberg): clean primitive mass,
   character in 1–3 small parts.
4. Exaggerate the identifying feature; the favourites go well past 30% of the width (the pegasus's wings are the full 9).
5. The surprise is the reward: the reveal colours show what the grey block
   hid (e.g. a hollow lantern's glowing core found by peeling).
6. Flat, deliberate colour beats noise; let the light shade. Since 2026-10-23 the light is the game's dithered ramp (see Dithered light above), so the material colours are authored flat and the ramp turns them.
7. Reduce jaggies: 2-voxel steps or straight runs, not long 1-voxel stairs.
