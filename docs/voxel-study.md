# Voxel object design: study record (2026-10-17)

Research for the object gallery and new levels. Sources: Picross 3D Round 2
colour roles (ludusnovus), Picross 3D reveal (Wikipedia, Destructoid),
Crossy Road's angled camera (PocketGamer.biz), Townscaper (Oskar Stålberg,
Game Developer), Monument Valley (Creative Review), voxel dioramas (Thibault
Simar, 80.lv), pixel art (Derek Yu, Stardew modding wiki). Text-only
research: no images were inspected; no HAL / Crossy Road artist interviews
were found.

## Checklist (apply to every object)

- **Review from every side before calling it done**: all four iso corners, a
  top-down and a straight front view (tools/qa-sheet.mjs). One camera angle
  hides mistakes.
- **Paired features match**: eyes, ears, horns, wings, arms/legs, claws, fins,
  whiskers, cheeks, paired handles/straps — same colour, same size, mirrored.
  "Deliberate asymmetry" means a readable character choice (a tilted hat, one
  raised paw), never a one-sided eye, horn or wing. The user has flagged this
  repeatedly (gnome, snail, pelican, dragon).

- Design the silhouette in the iso view first; the identifying feature must
  read at 1 voxel and from at least 3 of the 4 spin angles.
- Sizes: small things 5–6³; props/creatures 7³; tall 5×9×5–6×10×6; wide
  9×5×5. Prefer a clear long axis to a perfect cube.
- Main mass + 1–3 protrusions that break the outline (handle, ears, tail,
  spout, flag). No symmetric blobs.
- At least one deliberate asymmetry (turned head, bent stem, one-sided handle).
- 2–4 colours with jobs: body, identity feature, accent, single dark voxel
  for eyes. Non-body colours ≤ ~25% of voxels.
- Each colour forms one or two connected regions; no scattered single voxels
  except eyes.
- Cute: head ≈ 50–60% of a creature's height, stubby/implied limbs, eyes =
  two single dark voxels set wide and low, no mouth or one voxel.
- Identity colour is the most saturated; the body is a pastel that separates
  from the chapter background.
- Hollow where it means something (lantern, house, shell, teapot, birdhouse):
  a 1–3 voxel interior in a surprise colour, shell ≥ 1 thick, an opening.
- No detail on the hidden underside.
- No 1-voxel diagonal staircases longer than 2, no 1-thick shafts longer
  than 3, no edge- or corner-only connections.
- Nonogram: varied row counts, some rows split into 2+ groups, ~25–55% fill,
  no solid rectangles, no floating voxels.
- Negative space is a feature (gap under a table, donut hole, handle loop).
- Squint test: a 64 px thumbnail should be nameable in 2 seconds; if not,
  enlarge the identifying feature.

## Mechanisms

1. Colour has a job (Picross 3D R2): each colour names a part or material.
2. The angle shows three faces at once (Crossy Road "voxels look better at
   an angle"): check from the win-screen iso view and its 90° turns.
3. Predictable big shapes, varied small ones (Stålberg): clean primitive mass,
   character in 1–3 small parts.
4. Exaggerate the identifying feature (~20–30% of the width at 7³).
5. The surprise is the reward: the reveal colours show what the grey block
   hid (e.g. a hollow lantern's glowing core found by peeling).
6. Flat, deliberate colour beats noise; let the engine light shade.
7. Reduce jaggies: 2-voxel steps or straight runs, not long 1-voxel stairs.
