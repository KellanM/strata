# Daily Stone — Game Center artwork handoff

2026-11-02. For Kellan's rendering agent. Prepare assets for review; **Kellan must approve the exact final image before anyone uploads it**. This handoff grants no Apple upload, configuration, submission, release, phone, account or test-score authority. Preserve the current v1.0 App Review submission and unrelated working files.

## Deliverable and destination

Render **one language-neutral landscape image**, reused as the default for both:

| App Store Connect component | ID | Purpose |
|---|---|---|
| Daily Stone Challenge (display: Today's Stone) | `strata.daily.challenge` | Represents the daily puzzle competition in Game Center |
| Daily Stone Activity (display: Today's Stone) | `strata.daily.activity` | Represents the entry into today's puzzle via the Games app/activity deep link |

App: Strata: Stone Puzzles, `com.unsupervisedrock.strata`, ASC `6827844001`. Both components are linked to `strata.daily.score`, the daily recurring leaderboard. These records already exist; do not create duplicates. The challenge is non-repeatable. Artwork should communicate a calm daily puzzle, not live multiplayer or prizes.

## Apple requirements — checked 2026-11-02

For both default images: **3840 × 2160 pixels**, RGB color space, JPEG (`.jpg`/`.jpeg`) or PNG, **no transparency**, at least **72 ppi**. Localized image variants use the same specifications. Apple documents a default image fallback for Challenge localizations; the Activity form also has a default image and optional localized-image field.

Sources: [Challenge image properties](https://developer.apple.com/help/app-store-connect/reference/game-center/challenges), [Activity image properties](https://developer.apple.com/help/app-store-connect/reference/game-center/game-activities).

Use opaque PNG with an embedded sRGB profile for this delivery (our production preference, not an additional Apple rule). The optional **leaderboard localization image is a separate asset type**, not required for this task; do not assume this landscape file has the correct leaderboard dimensions. Do not change the app icon or store screenshots.

## Render from the actual game

Read current `HANDOFF.md`, `store/README.md`, `docs/daily-stone.md`, `public/js/daily.js` and repository instructions first. Record the source commit used. The local Game Center integration branch may differ from your checkout; do not overwrite either branch or port unrelated native changes.

Inspect these references visually before rendering:

- `resources/icon.png` / `store/icon/app-icon.png`: canonical stone-on-lime identity; softly shaded cream/peach/lavender cube faces, dark clue glyphs, narrow seams, luminous lime atmosphere and restrained motes. This is the chosen icon, not the earlier sloth/fox candidates.
- `store/screenshots/6_9in-2-orrery-zero-row.png` and `6_9in-4-maple-bonsai-mid-solve.png`: actual puzzle rendering, camera, clues and atmosphere. Use as visual references, **not screenshot stand-ins**.
- `public/js/cubes.js`, `palettes.js`, `atmosphere.js`, `objectmesh.js`: real materials, face ramps, contact shading and background treatment. `tools/render-icon.mjs` demonstrates rendering through the app; inspect its assumptions before adapting it to landscape.
- `public/js/daily.js` and `dailies.js`: current master (`eda340c`) uses curated Daily Stone objects from Daily #2 onward; Daily #1 retains the generated abstract stone. Use an actual daily through `dailyStone(n)` and `dailyPalette(n)` rather than assuming the older generated-only design; record `n`, the source commit and camera/framing settings. Prefer an unsolved or lightly chiselled stone so the artwork does not reveal a current day's answer. Do not change daily rollover or Game Center behavior as part of rendering.

Compose a fresh 16:9 scene using actual app geometry/shaders and colors. Keep the block and clues legible, the mood quiet, and the surrounding space breathable. Do not stretch the square icon, upscale a portrait screenshot, invent incorrect numeric clues, change voxel materials, or add fake game UI. If a palette adjustment is proposed, show the unmodified game reference alongside it. Do not bake in English labels, dates, leaderboard scores, Apple branding, buttons or rewards unless Kellan explicitly chooses that direction.

## Framing guidance — recommendations, not Apple specifications

The cited Apple references do not define a universal safe-area rectangle. As a working composition guide, keep the essential stone silhouette and distinctive clues inside the central ~80% of the frame; leave expendable atmosphere at the edges. Avoid placing critical detail at corners or relying on tiny glyphs to communicate the concept. Review at 384×216 and 192×108 and with modest edge crops; these are stress tests, not claims about Apple's exact crops. The final image should still read as Strata when reduced.

## Files to deliver

- `store/game-center/daily-stone-default.png` — final candidate, exact Apple dimensions; one shared file for both components.
- `store/game-center/previews/daily-stone-review.png` — clearly labeled contact sheet showing full frame, small-size views and crop stress tests; **not for upload**.
- `store/game-center/README.md` — source commit, daily number/seed, palette, camera, render command, tool versions, dimensions/color/alpha/ppi validation, SHA-256, proposed mapping to both IDs, and approval status (`Pending Kellan approval` until approved).
- Reproducible render source/script under `tools/` if new tooling is needed; keep changes limited to this artwork task. Preserve other agents' work and follow repository commit attribution rules. This handoff does not authorize pushing.

Optional localized variants only if specifically chosen: `store/game-center/localized/<code>/daily-stone-default.png`. No variants are needed for a language-neutral image. Current app languages are en, ja, zh-Hans, zh-Hant, ko, de, fr, es, pt-BR, ru. Nine translated store files map to eleven non-English ASC locale slots because French/French (Canada) share one file and Spanish (Spain)/Spanish (Mexico) share one file. This context does not require eleven different artworks or authorize uploading translations. See the locale mapping in `docs/handoff-2026-10-31-v1.1-full.md`.

## Validate and hand back

On macOS, from repo root:

```sh
sips -g pixelWidth -g pixelHeight -g space -g profile -g hasAlpha -g dpiWidth -g dpiHeight store/game-center/daily-stone-default.png
shasum -a 256 store/game-center/daily-stone-default.png
git diff --check
```

Confirm 3840×2160, RGB, no alpha, both resolution values ≥72, sensible color profile, clean full-resolution edges and readable small-size composition. Inspect the exported file itself, not only a renderer preview. Missing ppi metadata is not a verified pass; export it explicitly. Compare against actual app references and verify there are no accidental UI overlays or misleading clues. Do not change users' saves or send Game Center scores to obtain the render: use isolated local rendering state.

Return paths, render provenance, validation output, preview and hash to Kellan for approval. Do not upload or press Add for Review/Submit. No iOS binary rebuild is required merely to deliver these image files.
