# App icon study (2026-10-27)

**Brief:** a new App Store icon for *Strata: Stone Puzzles*. The current icon (`resources/icon.png`, from `public/icon.svg`) is an abstract pastel cube cluster.

**Kellan's direction:**
- the Sloth, in its win state;
- over the Cloud Isles sky, or a bright green;
- keep the reveal's own angle and make the Sloth bigger.

Green was "the clear winner", then Kellan asked to see all three.

## Sources

33 live App Store icons were collected at 1024 px through Apple's iTunes Lookup API, and a contact sheet was made at 180 px and 60 px. Both are working files in `shots/icon-study/` (gitignored): `refs-sheet.png`, `research.md` with every URL, and `metrics-60px.txt`.

**Exemplars:**
- Monument Valley 1, 2 and 3; Alto's Adventure and Alto's Odyssey; Sky; Florence; Gorogoa; Prune; Townscaper; Mini Metro; Two Dots; Threes!; I Love Hue;
- NYT Games, Candy Crush, Clash Royale, Crossy Road, Pocket Build, Block Craft 3D;
- nonogram and logic apps: Nonogram.com, Picture Cross, Nonograms Katana, Konami's Pixel Puzzle Collection and others; Sudoku.com, Woodoku, Blockudoku.

**Labels:** [F] means the page was read; [S] means only a search snippet was seen.

**What couldn't be inspected:**
- nothing from ustwo, King, StoreMaven or Phiture about their own icons;
- the University of Turku icon study (569 participants) was blocked;
- no chart data was available, so US rating counts stand in for popularity.

## Mechanisms (observed, with sources)

1. **One central object built from few shapes, filling about 60–80% of the tile.**
   - Seen in Monument Valley 1–3, Townscaper, Picture Cross, Block Craft 3D and Threes!.
   - Apple's HIG [F] says "minimal number of shapes". AppTweak [F] says an icon that doesn't read at 60×60 is "too complicated".
2. **The figure separates from the ground by lightness, not just hue.**
   - Seen in Monument Valley (white on teal), Alto and Prune.
   - A Towerlands test [F] favoured a "flat image in contrasting colors".
   - Apple [F] notes the dark, clear and tinted appearances are "more subdued", so a low-contrast icon goes blank in them.
3. **One saturated background colour.**
   - Monument Valley 2 is blue, Monument Valley 3 and Florence are yellow, Picture Cross is blue.
   - A background colour change alone gave Cookie Jam +8% [F].
4. **Something alive.** A face or silhouette helps; Crossy Road manages it with a one-pixel eye. MindSea [F] counted faces on 38% of top game icons (2017 data).
5. **Show the reward, not the grid.** Picture Cross shows its solved duck; Apple [F] says "avoid replicating UI components". The exceptions are Nonogram.com and Sudoku.com, which sell on grid icons.
6. **One layout across a series, with only the colour changing:** Monument Valley 1–3, both Alto games.
7. **iOS 26 layered icons** [F]: a background layer plus crisp foreground layers, with no baked-in effects. A voxel creature over a flat sky suits this.

**Baseline:** at 60 px the current icon has the lowest contrast of all 34 icons on the sheet. It reads as a pale beige square, and it shows the grid rather than the reward.

## Experiment

- **How the renders were made:** `tools/render-icon.mjs` renders the real game. It opens the Sloth with a chosen palette, solves it and waits for the reveal to settle. It then hides the UI and the finale's gems and score, zooms the camera ×1.7, and renders at 2048 px.
- **Crop:** all three use one crop, (331, 43, 1806, 1518) → 1024, so the Sloth and its branch fill about 80% of the tile.
- **Backgrounds:**
  - Cloud Isles: the `Clouds` palette;
  - green: sky `#ccff66` → `#4db04f`;
  - blue: `#6fb6ff` → `#2d62d8`.
- **Outputs, in the repo under `store/icon/`:** `sloth-green.png`, `sloth-cloud-isles.png`, `sloth-blue.png` (1024 px), `compare-at-phone-sizes.png` (each next to the current icon at 180 and 60 px, on light and dark grounds; made by `tools/icon-sheet.py`) and `reference-icons-33-games.png`.

## Result (my reading at 60 px, not a player test)

- **Green:** the strongest. The beige Sloth separates from the ground by both lightness and hue, and the dark eye patches still read.
  - Weak point: the branch's leaf-green tip merges into the background.
- **Cloud Isles:** calm and on-brand, but the pale sky and the white rays sit close to the Sloth's own lightness. It is the weakest at 60 px and in iOS's tinted and dark modes.
- **Blue:** clear contrast. It's the Monument Valley 2 route, and blue is crowded in puzzle search results (Picture Cross, Blockudoku, Puzzle Page).
- **All three beat the baseline** on mechanisms 1, 4 and 5.

## Open

- **Kellan's final pick:** green was called the clear winner, and all three were then requested.
- **Untested: the leaf tip on green.** Possible fixes are a darker leaf, or a slightly bluer green background.
- **Liquid Glass layers:** to separate the foreground (the Sloth) from the background for iOS 26, render it with `omitBackground`.
- **To ship:** install the chosen file as `resources/icon.png`, update `tools/make-store-art.mjs` so a re-run doesn't overwrite it with the SVG, and run `npx @capacitor/assets generate`.

## Origami Fox (2026-10-27)

**Settings:**
- `ID=origami-fox DPR=4 ZOOM=1.7 TAG=-hi node tools/render-icon.mjs`, at the reveal's own angle (no `AZ`).
- One crop for all four: (355, 53, 1733, 1431) → 1024. The fox is about 80% of the tile's height and 71% of its width.
- **Backgrounds:** green (the Sloth's, `#ccff66` → `#4db04f`), Cloud Isles (`Clouds`), blue (`#6fb6ff` → `#2d62d8`), and its own chapter sky, Lantern Festival (`Festival`).
- **Outputs, in `store/icon/`:** `origami-fox-green.png`, `origami-fox-cloud-isles.png`, `origami-fox-blue.png`, `origami-fox-lantern-festival.png`, and `compare-fox-at-phone-sizes.png` (with the current icon and the Sloth on green).

**My reading at 60 px:**
- **Blue:** the strongest fox. Orange on blue is complementary, the lightness gap is clear, and the two dark eyes and white muzzle still read.
- **Lantern Festival:** the biggest lightness contrast (a bright fox on a dark plum sky) and on-story. The white tail tip stands out best here. But the tile is dark as a whole, so on a dark home screen its edge fades.
- **Green:** the hue contrast holds, but the yellow-green glow behind the ears is close to the orange tops in lightness, so the ears soften.
- **Cloud Isles:** the saturated fox does better here than the Sloth did. The white tail tip merges into the white sky.

**Versus the Sloth on green:** the fox has the stronger colour, but the Sloth reads better as a creature. At this angle, the fox's two ears and its upright tail make three equal columns. At 60 px it reads as an orange crown or castle with two dark squares more than as a fox. The Sloth's hanging silhouette and eye patches say "animal" at once. A turn (`AZ`) that pulls the tail away from the ears would probably fix this, but Kellan asked to keep the reveal's angle.

## Decision (2026-10-27)

Kellan picked **the Sloth on lime** (`store/icon/sloth-lime.png`, installed as `store/icon/app-icon.png`).
- Background: sky `#d8ff6a` → `#5fb83a` (`VARIANTS='{"lime2":{"skyTop":14221162,"skyBottom":6273082,"glow":16777164}}'`), the same crop box as the other Sloths.
- It was tried to fix the leaf tip merging into the green. The yellower lime sets the branch's blue-green leaf apart.
- A darker leaf on the original green (`RECOLOR` in `tools/render-icon.mjs`) was also rendered, but not chosen.

**Installed in:**
- `resources/icon.png`, the App Store source (`tools/make-store-art.mjs` now copies it from `store/icon/app-icon.png`);
- `public/icons/icon-180.png` (iOS Home Screen), `icon-192.png` and `icon-512.png` (manifest), and `favicon-64.png`;
- `public/icons/icon-maskable-512.png`, for Android: the icon at 78% on a gradient sampled from its own edges, so the Sloth stays inside the safe circle.

An iPhone that already has Strata on its Home Screen keeps the old icon until it is removed and added again from Safari. Progress is kept.
