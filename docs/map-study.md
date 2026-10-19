# Map study: a sea of cloud, from the stars down

Date: 2026-10-18. Phase 1 was the study and a working prototype. Phase 2 (below) shipped direction B in the game.
Read this, `docs/study-record.md` (the Monument Valley look), `docs/motion-study.md` and `docs/motion.md` (motion tokens and rules) before redoing any of this.

**Prototype:** `public/proto/map.html`, at https://kellanm.github.io/strata/proto/map.html. Open the ≡ button for:
- save states;
- direction A or B;
- *Solve the next stone* (the ceremony);
- replaying the title;
- frame times;
- Reduce Motion.

The best way to see the ceremony is `?s=threshold&map=1`, then *Solve the next stone*.

The prototype reads the game's real `SHAPES`, `CHAPTERS`, `BONUS`, palettes, `progress()`, `bonusFor()`, `recordStars()` and `renderThumb()`. It never writes the game's save. The build deploys `proto/` but leaves it out of the offline cache (`tools/build.mjs`), exactly as it does `gallery/`.

## Phase 2: in the game

Kellan approved direction B with mist and voxel mountain tops. It is now the game's map and title.

**How it's built:**
- **`public/js/mapworld.js`** is the world. It is a fixed `#map-world` layer behind the WebGL canvas, which now has a transparent clear. The world holds:
  - the sky canvas (night, stars, the horizon);
  - the sea gradient strip;
  - three peak layers at rates 0.84 / 1 / 1.12;
  - the mist ribbons;
  - each locked chapter's veil wall.

  `setView(u, s)` follows the title pan (`u`) and the map's scroll (`s`). `setPart(i, k)` lifts a chapter's veil.
- **The peaks are pre-rendered.** `node tools/render-peaks.mjs` (with the dev server on 5203) renders every palette's voxel sprites in Chrome through `proto/peaks-export.html`. It uses the game's own block shader (`proto/voxels.js`). The output is one WebP atlas per palette plus `peaks.json`, written to `public/map-peaks/` (about 0.5 MB). The map loads them as images and never builds voxels at runtime. Re-run the tool after changing `proto/peaks.js` or a palette.
- **map.js** still owns the stones, the trail (today's design), the names, `progress()` and the unlock rules. It hands the world a layout model (`opts.world.build`).
- **The title** is the real logo over the world's night sky. The canvas hides its background and motes there. The title and logo move with the page; only the stars parallax.
- **The descent** lasts 1.5 s, or 0.8 s when it is repeated in the same session (`DESCENT` in main.js, sessionStorage `strata.descended`).
- **While the map is up** (`body.map-up`), the canvas fades out and stops drawing after 0.6 s. It only comes back once `start()` has rebuilt the level under the veil. This is still "cover before you swap".
- **Decisions:** chapters after the next one fold into a short stretch of mist (`FOLD_LATER_CHAPTERS`). The shrine treatment in the level is the restrained one: gilded block edges (`uGild`), a held title card, a gold portal and a three-note bell (`sound.shrine`).

**The path flash (Kellan's video).** When the mist lifted, the new path showed at full opacity, dimmed, and then drew in.
- *Cause:* the new trail segments and stones were inserted visible. Measuring the trail (`getTotalLength`) flushed style, which committed opacity 1. Then opacity 0 and the transition were set together, so the browser animated 1 → 0 before the reveal.
- *Fix:* the segments and stones are created hidden (`in-parting` / `veiled-in`), and the transition is armed a frame later.
- *Check:* `shots/map-study/ceremony.mjs` traces every element's opacity each frame and found 25 elements, 0 flashes. The prototype got the same fix: `proto-flash.mjs` went from 25 flashes to 0.

**Performance.** At CPU ×4, 390×844 @3x, with every stone solved (pooled over 3 runs, `phase2-perf.json`):

| | Title pan | Map scroll |
|---|---|---|
| Before | 14–16 fps | 7 fps |
| Now | 21–25 fps | 9–10 fps |

The map scroll's cost is the stones' DOM, the same as before. Hiding the stones gives 56 fps.

One trap was found and removed: a `body:has(#menu.show)` rule re-styled all ~3900 elements on every frame of the pan, which dropped it to 5 fps. Rules like that are now plain body classes (`title-up`, `menu-open`, `map-up`, `world-up`) set in `frame()`.

**QA:** `shots/map-study/`:
- `phase2-flow-*.png` and `video/phase2-full-flow.mp4`: title → swipe → map → level → win → back with the mist lifting → shrine;
- `phase2-misc-*.png`: fresh player, journal, dev panel and unlock, Reduce Motion, gallery;
- `oldlevel.mjs`: 0 frames of the old level during the pull-back and dive.

A fresh critic reviewed the integrated build before it shipped. Fixes from that review:
- At the end of the descent the logo popped back to the centre. The canvas now hides before its view offset clears (`logo-pop.mjs`: 0 visible frames).
- The won level lingered over the mist. The canvas now fades out in 0.28 s, and `#win` hides with the map.
- The trail into a chapter whose mist hasn't lifted showed early. It is now created hidden too.
- The return scroll put the just-solved stone under the corner buttons.
- The shrine card wrapped and was sharp for only about 0.3 s. It is now "✦ The Shrine of ✦ / First Light", it is held longer, and it is sharp sooner.

**Phone fix 1: the scenery trailed the stones.** On Kellan's iPhone, the stones and trail scrolled at full rate but the peaks and mist moved at about 7 fps.

*Cause:* the world was a fixed layer moved by `setView()` from script on every scroll, while the stones scrolled natively on the compositor. On the phone the main thread was free only about 7 times a second.

*Fix:*
- **The world moved into the scroller.** It is now `.mw-scene`, the first child of `.map-scroll`, under the stones, so the browser scrolls it with them and nothing runs during a scroll.
- **Far-peak parallax (0.84) is a CSS scroll-driven animation** (`animation-timeline: --map-scroll`). It is used only where `CSS.supports` reports it, and never under Reduce Motion; elsewhere the far peaks move with the page.
- **The fixed `#map-world` is now only the title's sky.** It holds a gradient plus three pre-drawn star sheets, moved by transforms during the pan, with no canvas redraw per frame.
- **The dawn and horizon** at the top of the scene continue that sky, so the seam doesn't show.

**Phone fix 2: main-thread cost during a scroll** (traced at CPU ×4, `paint-who.mjs`, `perf-ab.mjs`). Any per-frame repaint re-layerized the whole map (about 3,700 nodes). The repaints came from:
- about 100 drifting mist ribbons (now still);
- SVG-internal animations: the shrine gem's float and the companion's bob and lamp. Each now animates its own `<svg>` box, and only unclaimed shrines float.
- the title's swipe hint, which kept animating under the map.

The map's stones and trail are now filed into 1000 px bands with `content-visibility: auto` (`.map-band`, each with its own svg in page coordinates). Off-screen bands are neither painted nor layerized.

**Frame rates** (rAF at CPU ×4, 390×844 @3x, every stone solved):

| | Map fling | Title pan |
|---|---|---|
| Before | 9–10 fps | 21–25 fps |
| After | 22–27 fps | 40–52 fps |

During a fling, the world gets 0 style writes from script (387 before). The gap between a near peak and a stone moves 0 px; before, it jumped up to 211 px between frames. The far layer's offset is exactly 0.16 of the scroll (`par-check.mjs`).

**The dotted trail.**
- Dotted and solid stretches are the same `<path>`: the same `segment()` data, and only the dash style differs. The shrine spur also turns solid once its shrine is kept.
- `trail-geom.mjs` compares every segment's `d` across 17 saves (walking, mist-lifts, folding): 0 changes.
- `trail-overlay-*.png` draws every path twice, red dotted over cyan solid, across chapter boundaries. The two coincide.

**Still open:** the phone's GPU and real touch momentum, and tuning the shrine bell by ear.

## Round 4: First Light's summit, and every chapter's full range (2026-10-19)

**Kellan:** rework First Light's red-roofed mountain to make it more beautiful, and show the approved prototype's ~5 mountains per chapter on the unlocked map. (Kellan's third ask, chapters' mountains showing in other chapters, went away once parallax was turned off. Existing peaks were not moved.)

**First Light's summit** (`SIGNATURE.Dawn` in `public/proto/peaks.js`; the study is in `shots/peaks-r4/`, with the sheet at `shots/first-light-summit-sheet.png`).
- **The old one:** a flat red slab roof on a thin stilt, a lamp on one side only, and pink noise at the foot. At thumbnail size it read as a red table on a bump.
- **Four variants on one new mountain,** each with one idea:
  - A: chimney smoke;
  - B: a stair from the door down into the mist;
  - C: a blossom tree;
  - D: a waterfall.

  The mountain itself is three rock shelves stepping down toward the front-left, with risers of 2–3 voxels and grass only on ledges wide enough to stand on. The cottage turns its white gable to the viewer, with the door and the lit window on its centre line. Every variant was rendered on the export page (the game page's own cubes state tints renders) and placed on the real map at 390×820.
- **A fresh critic** ranked them B, A, old, C, D:
  - smoke as still cubes reads as stray floating blocks;
  - the tree is a second loud focal point;
  - the cyan water is out of palette and reads as a glitch.
- **B ships:** the home you set out from at dawn, its path starting at the door and walking down into the mist toward the trail of stones. The critic's fixes are in:
  - a one-wide stair carved into the rock (rise 1, run 1), with the threshold at the door;
  - a calmer terracotta roof (lit face about #d45940 on the map, was about #c8302a);
  - a lighter door, so it is no longer the darkest value on the map;
  - no lone grass cubes;
  - the art moved left in its grid, so the map's edge crops rock rather than the house.
- **Size:** the sprite is 205×244 (was 177×196). `dawn.webp` is 38 KB (was 35 KB). The other 15 atlases re-render byte-identical.

**The full range on every reached chapter** (`mapworld.js`, `fit()` and `box()`):

| Before | After |
|---|---|
| A reached chapter showed `sig` + `far3`, plus `lf1` or `lf2` + `far4` only when `index % 3 !== 2` and longer than 800 px: 4, or 2 in every third chapter (50 peaks with everything unlocked). | Every reached chapter shows all five distinct shapes in its atlas: `sig`, `lf1`, `lf2`, `far3`, `far4` (75 peaks). |

- **What the atlas holds.** Each palette has seven sprites: `sig`, `lf1`, `lf2`, `far3`, `far4`, and `ghost1` and `ghost2`, which are `lf1` and `lf2` re-rendered pale for the locked wall. That makes five distinct mountains.
- **Placement.**
  - `sig` and `far3` stay where they always stood.
  - `lf1`, `lf2` and `far4` are each placed at the screen edge, at the place in the chapter furthest from the peaks already there, so the five spread along its length on alternating sides.
  - A place only counts if the peak's whole box, including its mist band, lies inside the chapter, its art stays 40 px off the trail, it clears every stone, label (map.js now passes `stones` to the world) and the chapter's name, and it doesn't sit over another peak on the same side.
- **Unchanged:** chapters under mist (locked, folded, or lifting this session) build exactly as before.

**Checks** (`shots/peaks-r4/probe.mjs` with unlock-all, a fresh save and 40 solved; `perf.mjs`):
- Every reached chapter has 5 peaks.
- Every added peak lies within its chapter's band: 0 outside, across all three saves.
- Each added peak's art was tested against the real DOM rects of stones, labels and names: 0 overlaps.
- No page errors at boot, and `npm test` passes 23 of 23.
- **Fling** (CPU ×4, 390×820 @3x, unlock-all, 3×3000 px wheel flings, 3 runs):
  - median frame 33.4 ms both before and after;
  - 24.7 fps after against 26.2 before, from the 25 more sprites and mist bands;
  - 0 script style writes to the world during the flings.

  The layers, the content-visibility bands and the no-parallax setting are unchanged.

## Round 3: mist, and mountain tops (2026-10-19)

**Kellan:**
> "For clouds let's go with mist… the islands look rough, they should feel like mountain tops with the bases obscured by the mist so they are sticking out. And they should have bigger voxels."

**Mist is the clouds** (`public/proto/layers.js`, the prototype's default):
- **Colour.** Mist is lit by its own sky: warm cream in warm chapters, peach at dusk, cool only at night.
- **On the peaks.** Most of it hangs on the peaks: one soft band (edge alpha under 0.6) sits across each peak's lower slopes, exactly where its base has faded out. Bands never come within 40 px of the trail.
- **Free bands.** A few faint ones remain, far back.
- **Motion.** Everything drifts slowly on its own `translate` property; nothing moves under Reduce Motion.
- **Locked chapters** sit behind a dense wall of mist:
  - its leading edge is feathered;
  - the chapter's signature summit stands behind the edge, on the side away from its name (the teaser);
  - two faint silhouettes show deeper in.
- **The lift.** On unlock the bands thin from the trail outward, rising and spreading as they fade, and the wall clears last (`video/r3-mist-lift.mp4`, `r3-final-mist-lift-strip.png`).

**Mountain tops** (`public/proto/peaks.js`; the sheet is at `proto/voxels.html`):
- **Built from heightfields:** a concave summit set off-centre, one ridge spur, terraces of uneven depth. Ground only on ledges wide enough to stand on, quiet strata, no per-voxel noise. A tidy pass removes thin columns and anything floating.
- **Voxels are big.** About 10 px per voxel for a signature summit and 7.5 for the others.
- **The base dissolves.** It fades to nothing in the render, and the mist band covers the cut.
- **Composition, per screen:** a big summit cropped by the edge, a small pale peak far back on the other side, and every third chapter keeps a stretch of open mist.
- **Each biome:** a signature landmark on its summit, plus its own two landform families. Signatures include:
  - a sun shrine;
  - a beacon cairn with its fire lit (the new Beacon Hills);
  - a lighthouse crag;
  - sea stacks with glowing tips;
  - a mesa arch;
  - a torii summit;
  - standing stones;
  - a clock tower;
  - a pagoda;
  - snow horns;
  - a cairn with a pennant;
  - a crystal.

**The adversarial passes:** three critique rounds, each by a fresh art-director subagent against the checklist. Before and after sheets are `shots/map-study/r3-round{1..4}-{sheet,map,locked}.png`.

| Round | What the critic found | What changed |
|---|---|---|
| 1 | Mist edges clipped into hard cards. Peaks were stepped cakes and Christmas trees. Bases reappeared below the mist. The same four shapes repeated in every biome. Stripe noise. Voxels too fine. Mechanical placement. Lilac mist went muddy in warm chapters. The teaser didn't pierce. | Soft lobes kept inside each ribbon. Heightfield peaks, half the voxel count. Strong base fade with mist at the cut. Per-biome landforms. Warm and cool mist. Alternating sides. New signatures. |
| 2 | Scale collapsed into trinkets. One-voxel needles. Shapes repeated within a biome. Flat slabs read as trays. Bases still showed in three chapters. Free mist blobs read as stickers. No depth. The teaser hit the title. | Larger voxels. Summit caps and the tidy pass. Three shapes per biome (new chimney rocks for Clockwork). Butte tops broken into levels. The base fully gone at the cut. Mist anchored to the peaks. A far pale peak per screen. The teaser moved opposite the title. |
| 3 | Verdict: show it as a direction pass. Deep, Lagoon, Festival, Dusk, Cloud Isles and Starfall land. Still weak: slab signatures, Beacon Hills with no kit, opaque mist under signatures, the teaser, noisy Autumn, Frost, Orchard and Mint summits, and crops crowding titles. | Narrowing tiers for the slab biomes. A Beacon Hills kit with its fire lit. Base mist at alpha 0.55 and clear of the trail. One clean landmark per summit. Summits 90 px clear of names, cropped at the rock, never at the landmark. A larger teaser. |

**Still open** (my judgement, not tested with players):
- The First Light shrine is small.
- Some far peaks are hard to see on dark chapters.
- The locked wall is a large plain area below its teaser.
- Building the sprites takes about 1.5 s at load; the game should pre-render them at build time.

## Round 2: Kellan's review (2026-10-19)

**Decisions (Kellan):**
- **Direction B, the 2.5D layers, is the direction.** It is now the prototype's default; `?dir=a` still opens the 3D world.
- **The title and the logo don't parallax.** They are the top of the page and move exactly as far as the map does. Only the stars drift, at 88–96% of the page's motion.
- **Today's trail design comes back.** It keeps `segment()`'s curves and the `.trail`, `.walked` and `.draw` styles, coloured by the stone each segment leads to. The gold dashes are dropped.
- **The scenery is voxels, built for beauty with no puzzle rules,** and the clouds need iterating.

**The bug: stones drifted off their lines.**
- *Root cause.* In round 1 the stones and the lines lived in two different layers, and JS glued them together every frame:
  - The stones sat in a `position: sticky` overlay inside the scroller, placed by JS per frame.
  - The lines were drawn elsewhere: in B, an SVG in a separate fixed layer moved by JS; in A, a WebGL ribbon on the canvas.
- *How it shows.* Any frame where the two disagree shows as drift:
  - During iOS momentum scrolling, the compositor moves the scroller (and with it the sticky layer) while JS-placed layers trail by a frame.
  - In A, the canvas was 100lvh tall while its projection used `innerHeight`. With Safari's toolbars showing, the WebGL image stretched vertically against the DOM, so stones slid further off the dashes the lower they were.
  - B also lifted shrine nodes 30 px above their spur's end.
- *Limit.* The analysis is from the code. Desktop Chromium can't reproduce iOS momentum or its toolbars.
- *Fix, by construction.* In B the stones, labels, hero and trail are now one container inside the scroller's own content, so the browser scrolls them together. They can't separate under momentum, resize or slow frames.
- *Verified.* `shots/map-study/b-evidence.mjs` measured the distance from each trail end on screen to its stone centre, every frame, through a wheel fling with the CPU throttled ×4 and after a resize. It saw 3–7 ends per screen across 93 frames, and the worst was **0.00 px**. Recording: `shots/map-study/video/b-scroll-locked.mp4`.

**Clouds: four treatments on the real map** (`shots/map-study/clouds-compare.png`; rows top to bottom are cumulus, painted, voxel, mist; columns are an open chapter, the boundary into a chapter under cloud, and a dark chapter under cloud).

| Treatment | Verdict |
|---|---|
| **Cumulus: crisp heaped lobes, lit tops, cool shaded undersides (Sky, K4)** | **Chosen.** It frames the edges clearly without busy detail, keeps its shape at phone size, and its banks read as a cloud wall. |
| Painted: soft layered banks | Pleasant but blurry. The edges disappear on pale chapters. |
| Voxel cloud masses | Next to voxel islands they read as popcorn or rubble. The same lesson as round 1's faceted clouds: clouds and land need different materials. |
| Mist ribbons | Too faint to frame. A locked chapter becomes a flat wash. |

- **Locked chapters are a solid body of cloud.** A gradient body with no gaps for the sea to show through, covered in billows and densest along its leading edge. Round 1's sprite tiling read as fish scales.
- **The parting.** The bank is two halves that move apart from the trail outward. Billows near the middle go first, drift wider than the body and thin away, and the chapter's stones and trail fade in behind them. It takes about 1.5 s of visible change (`video/b-cloud-parting.mp4`, `b-cloud-parting-strip.png`).
- **Still to tune:** dark-chapter banks (The Deep) still lean teal.

**Voxel scenery** (`public/proto/voxels.js`; every biome's set on `proto/voxels.html`; `shots/map-study/voxel-sheet-v1.png`).
- **How they're rendered.** Islands are drawn once by the game's own block shader (`cubes.js`): the face-colour ramp, crease AO, and bases sinking into the chapter's cloud colour. Glowing cubes get a soft light painted over the render. The sprites are then plain images in the layers, so the per-frame cost is the same as before.
- **Two or three signature islands per biome:**
  - First Light: a meadow with a cottage window lit and a waterfall.
  - Teatime: a layered cake mesa with a teapot.
  - The Lagoon: an atoll with a lagoon, a palm and a lighthouse.
  - The Deep: glowing coral spires.
  - Desert Oasis: a sandstone arch and an oasis.
  - Ember Steps: a stepped temple, a torii and lanterns.
  - Old Stones: a stone circle.
  - Clockwork Workshop: a brass tower with a gear and lit windows.
  - Lantern Festival: a lantern pagoda.
  - Frost Peaks: a snow peak with pines, and an igloo.
  - Cloud Isles: a floating isle trailing a waterfall.
  - Starfall: an observatory among glowing crystals.
  - Plus groves and strata spires.
- **Judgement** (`scenery-voxel-vs-lowpoly.png`, the same places with voxel on top and low-poly below): **voxels work**. They speak the same language as the stones' objects, so the map reads as one world. The low-poly islands look like another game.
- **Weaknesses:**
  - At ~4.4 px per voxel the islands are small. A larger signature island per chapter would carry more.
  - The generic strata spire repeats across biomes.
  - Building all the sprites takes about 1.5 s at load. In the game, render them once at build time.

## Brief

Kellan's request, in short:
- Reskin the map so the player *wants* to unlock the next biome.
- The vibe: Journey and Monument Valley first, Shadow of the Colossus too. Mythical, vast, the call to adventure; beautiful but minimal.
- Levels in a sea of clouds, with low-poly island peaks of each biome showing through: "as part of the map, but not really", so they are scenery.
- The title: you look at the stars; the swipe pans the camera down through star parallax; a horizon appears and the top of the map rises from below.
- Clouds or other elements line the edges but never cover the hero's path.
- The unlocked path is a dashed golden curved line.
- Locked biomes sit under cloud that parts when they unlock.
- Make the shrines stand out more.

Readings agreed with the caller:
- The finger swipes **up**: the content follows the finger and the camera pans down.
- "The hero" is the map companion.
- The islands are not interactive.

**Criteria for this brief** (mine, not a universal score):
1. **One world.** The title and the map read as one place under one camera.
2. **Desire.** A locked chapter shows enough to want, and no more.
3. **Legible path.** The trail and its stones always read first; tap targets are at least 44 px.
4. **Restraint.** One accent colour (gold) means progress, and almost nothing moves.
5. **Phone frame rate.** At CPU ×4 it must do clearly better than today, and never worse.

## Baseline (code at c92aa6d; captures in `shots/map-study/baseline-*.png`)

- **Title:** the 2×2×2 logo carved by the game's own renderer, with rays, on a pastel sky. A swipe up translates the title off the top and slides the map sheet up 1:1 (`setScroll`, `camera.setViewOffset`).
- **Map:** one SVG and DOM column, 18,160 px tall at 140 stones:
  - chapters are wavy bands of tint;
  - mist lifts per chapter;
  - the trail is a thin dotted line in the stone colour, solid once walked;
  - a tiny companion;
  - shrines are a small faint gem glyph beside a dotted spur.
- **Shrines are the least visible thing on the map:** the gem is smaller and fainter than an ordinary stone (`baseline-shrine.png`). That confirms Kellan's complaint.
- **Locked stones** are faint numbered ghosts; locked chapters are a grey wash (`baseline-locked.png`).
- **Frame times** (CPU ×4, 390×844 at 3×, every stone solved, 3 runs; `shots/map-study/perf-final.json`):
  - the map scrolls at **7 fps** (median frame 133 ms);
  - the title pan runs at **16 fps**.
  - Unthrottled, the scroll drops to 47 fps.
- **Why it is slow** (`baseline-perf-breakdown.json`):
  - `frame()` draws the full level scene (mask, scene and rays) every display frame, even under an opaque map;
  - the map sits on a `backdrop-filter` blur;
  - the map DOM is 2,183 nodes, with animated wisps and motes.
  - Pausing the scene behind the map took the scroll from 9.7 to 11.2 fps; dropping the blur as well took it to 13.3 fps.

## Sources inspected

Each finding has four parts:
- **C:** a practitioner claim, with its source;
- **O:** observed evidence, with video id and timestamp;
- **I:** my interpretation;
- **A:** what to apply to Strata.

Contact sheets with burned-in timestamps are in `shots/map-study/exemplars/<game>/`. That folder is git-ignored, and the downloaded video has been deleted.

**Limits, stated once:**
- I can't play these games. Everything comes from official trailers and talks, and from fan no-commentary footage, which is labelled as such.
- YouTube served most footage at 360p; 1080p was available only for official trailers.
- No audio was listened to.
- Talk quotes are auto-captions or machine transcripts unless marked otherwise.
- The CEDEC 2017 quotes are my translations of a Famitsu report.

### Journey (thatgamecompany, 2012)

Why study it: it is the canonical "distant goal always calling you" game, and its art director explained the colour arc and the mural on GDC's channel.

Sources:
- Matt Nava, *The Art of Journey*, GDC (RoHrwAacTwo);
- Jenova Chen in WhatCulture (2013) and Game Developer (2012);
- the Steam launch trailer;
- PS3 footage (bkL94nKSd2M).

The Chen GDC 2013 Vault talk is behind a login, and I did not access it.

- **J1. The opening climbs to a reveal; it does not descend from stars.**
  - O, 1:06–2:26:
    - light streaks by day;
    - the traveller climbs a dune for about 40 s;
    - over the crest, the mountain and its beam appear centred in haze at about 45% of frame height;
    - "JOURNEY" fades in above it.
    - There is no night sky; the shooting star in the PC trailer is a cut-together shot.
  - A: the goal earns its reveal by a move of the camera. Strata's pan should *arrive* at a vista, the horizon and first peaks, rather than simply cut to the map.
- **J2. One colour strip from start to end, with one hue saved for the end.**
  - C, Nava, 11:52 and 15:10: a colour guide running left to right; "I wanted to save the color blue for the last part of the game".
  - A: the 15 palettes already make one strip, dawn to night. Check it as a thumbnail row (`proto-a-biomes.png`).
- **J3. The mural shows the whole route as one frieze.**
  - C, Nava, 23:35–24:16: "this really long image… you kind of uncover throughout the game".
  - A: a map can be a tapestry you uncover. That is the cloud-parting idea.
- **J4. Fog distance carries emotion.**
  - C, Nava, 14:47: "if it's clearer… you're supposed to feel more happy… if the fog is closer it… becomes… more scary".
  - A: locked means near, dense cloud; unlocked means a long, clear view. Parting cloud then reads as relief, not as a UI state.

### Shadow of the Colossus (Team Ico, 2005; remake 2018)

Why study it: Ueda's subtraction; a single light guide in place of waypoints; vast negative space.

Sources:
- 1UP's report of *The Method of Developing ICO* (GDC 2004, archived);
- PS2, PS4 and PS5 fan footage (KuF28o0p764, zAo9OqEmSRM, EtjDFN_ESnk, QA31SjAyHZc).

- **S1. Subtraction, with a warning.**
  - C, 1UP's paraphrase: "subtracting design: every element of the game that took away from its reality was removed".
  - C, Ueda in Q&A: "maybe in Ico, I think we subtracted too much!"
  - A: cut, then test that every remaining cue is still understood.
- **S2. The sword beam converges when you face the goal.**
  - O, QA31SjAyHZc 2:24–2:33: 3–5 rays fan out, then tighten into one ray toward the gap in the cliffs.
  - A: a guide that sharpens as you face it (an idea for later; not prototyped).
- **S3. The map covers unexplored land in drawn cloud.**
  - O, EtjDFN_ESnk 30:10 and 60:10: unexplored regions are covered by cumulus; more of the map is revealed later.
  - A: direct precedent for cloud over locked biomes.
- **S4. Tiny hero, huge frame.**
  - O, 14:30–14:58: rider and horse take about a tenth of the frame height; the horizon sits about 40% from the top.

### Sky: Children of the Light (thatgamecompany, 2019)

Why study it: its cloud sea with islands rising out of it *is* the proposed map, and the art team explained readability.

Sources:
- the Gnomon *Art of Sky* talk (FwcNVlpymNk);
- GDC 2019 storytelling (wQP9spsb_IQ);
- the Steam trailer at 1080p;
- Isle of Dawn footage (myh9-MaL_Q4).

- **K1. Sky already performs the title move, through cloud instead of stars.**
  - O, 14:22–15:08: a canyon of cloud walls, then the clouds part onto a peak with a light at its summit above a flat cloud sea. The horizon sits at about 55% of frame height, cloud banks frame both edges, and the logo appears over the peak.
  - A: stars, then the horizon, then the cloud floor, then the first peak, framed by cloud at the edges.
- **K2. One emotional curve, mapped to time of day.**
  - C, about 19:20 (auto-captions): realms run "dawn… day… rain… sunset… dusk… night".
  - A: Strata's chapters already run dawn → dusk → night.
- **K3. Goals take about 20% of the screen.**
  - C, 54:29: the important meshes are "twenty percent of the screen; most of the screen is… terrain"; having two motivations is "generally bad" (01:07:44).
  - A: one hero landmark per screen, the rest soft.
- **K4. Crisp clouds; bases dissolve into haze.**
  - C, 01:42:46: the clouds were changed to be "a bit more crisp" to stay readable.
  - C, 36:03: "the only warm element… should be the character".
  - O, trailer 1:21: island bases dissolve into blue haze; clouds are white on the lit side and blue-grey in shadow.
  - A: crisp rounded clouds, bases in haze, warm gold kept for path, hero and goal.

### Monument Valley 1–3 (ustwo games)

Why study it: the house style, and MV3 is the only one with a sea between places.

Sources:
- Ken Wong (Gamasutra, 2014; Designer Fund talk z-dqzxYAyE0);
- Dan Gray (BAFTA, jBjpDhSo-RE);
- David Fernández-Huerta, *Behind the Art of MV2* (RqJ-FCRQlhE);
- the MV3 making-of (pjsLWH0mCVk);
- fan longplays (7RcB1R7iVe4, tffHa8tcmSE, LcmqMEthtks).

The menus I had already studied are not repeated here (see `motion-study.md`).

- **M1. All three games open with a vertical camera move between figure and sky.**
  - O, MV1 0:28–0:37: the camera tilts up into a V of layered bands, and the title assembles.
  - O, MV3 1:21–1:49.5:
    - the lighthouse beam widens into a V;
    - the empty vista holds for about 3 s;
    - dots like stars gather into the title;
    - after the tap, **the camera tilts down for about 5 s into the world**.
  - A: the closest precedent for Strata's pan. Let it linger at the horizon.
- **M2. One chapter at a time; the next one is withheld.**
  - C, Gray: "no times no scores no enemies".
  - O, MV1 0:51–0:54 and 18:20: the next chapter's face rotates into view, and its emblem goes from grey to colour.
  - A: withholding drives desire. It is weighed against Strata's long single trail in decision 1 below.
- **M3. The MV3 sea is a screen-space gradient with flat land shapes and no 3D shore.**
  - C, making-of, about 6:41: "suggest a world that exists like beyond what's in the frame".
  - O, 10:10–12:13: no foam or reflections; a new area arrives through a gate of white light.
  - A: depth through colour and haze, not detail; thresholds of light.
- **M4. Fog never crosses the walkable path.**
  - O, MV2 trailer 0:12 and longplay 15:52: fog sits at the bases of towers and under platforms, never over the walkway.
  - A: a hard rule. Cloud never covers the gold path.

### Old Man's Journey (Broken Rules, 2017) and Alto's Odyssey (Snowman)

Why study them: the layered-2.5D alternative, explained by its makers.

Sources:
- *Happy Inside the Box: The Art of Old Man's Journey*, GDC (unadRBf0g5A);
- Harry Nesbitt on Gamasutra;
- both trailers.

- **L1. Flat stacked layers, three tones per shape, hue shifting top to bottom.**
  - C, about 30:32: "all just flat layers… it's just like three layers that's it"; "no two hills that connect anywhere have the same color".
  - C, about 29:11: choosing 2D or 3D "ended up being a gut decision".
  - A: either rendering approach is defensible, so decide by experiment (below).
- **L2. Depth from about five value bands converging on the sky.**
  - C, Nesbitt: "leave them feeling curious about what exists beyond the screen".
  - O, trailer 0:31: sky, far ridges, hazy hills, a hero temple against the sun, near-black foreground.
  - A: no more than five depth bands.

### Super Mario World overworld (1990) and Breath of the Wild (2017)

Why study them: a route that grows as you play, and optional places that pull without arrows. Mechanisms only, not the look.

Sources:
- fan longplays (VECLGXA8VWU, Be4LB4qTiTI, tOvTBrO7bPo);
- shmuplations' SMW interview;
- Iwata Asks (NSMBU);
- the GDC 2017 BotW talk (QyMsF31NdNc, machine-transcribed);
- Famitsu's CEDEC 2017 reports (my translations).

Correction to the brief: the "triangle rule" and "gravity" come from **CEDEC 2017**, not GDC 2017.

- **W1. The next path is already faintly there, then fills in.**
  - O, VECLGXA8VWU 3:12.6–3:14.5:
    - unreached routes are dark trails pressed into the grass;
    - about 0.6 s after the map appears, path tiles fill outward from the cleared level over about 1.25 s, while Mario stands still.
  - A: faint dots for the path ahead; on a solve, hold, then let the gold draw on.
- **W2. Secret routes are dotted and marked differently.**
  - O, Be4LB4qTiTI 12:52.25–12:53.1: dots appear one at a time, a sparkle flashes, and a new node appears.
  - A: a shrine spur gets its own finer dots, and the shrine is the one thing that glows.
- **W3. One map-wide gesture explains a rule change.**
  - O: the yellow-block burst at 2:43–2:46; the automatic walk into the new land at 12:04–12:07.
  - A: the cloud parting is one gesture; the hero walks into the new chapter.
- **B1. "Gravity".**
  - C, Fujibayashi (CEDEC, my translation): 「光に吸い寄せられる昆虫をイメージしてほしい」, "picture an insect drawn to light". Shrines were redesigned to stand out even by day.
  - O, tOvTBrO7bPo 22:42 and 28:26: an unvisited shrine glows **orange** and turns **blue** once done.
  - A: an open shrine is warm and bright; a solved shrine is calm and cool.
- **B2. The region reveal.**
  - O, 14:36–14:40: a cloud-like outline fills from its edge, flashes once, and settles, in about 4 s.
  - A: part along the chapter's own shape, with one bright beat.
- **B3. Hide and reveal.**
  - C, Yonezu (CEDEC, my translation): 「つねに何かしらの目標が見えているゲーム」, "a game where some goal is always in view", achieved by repeated 「遮蔽と出現」, "hiding and appearing".

## The design (what the prototype tests)

**Spatial model: one camera.**
- The title looks up at the night sky: Starfall's sky, the journey's end.
- The swipe tilts the camera down by about 124°:
  - three shells of stars slide at 0.3×, 0.5× and 0.72× of the tilt, which is the parallax;
  - the dawn horizon (First Light) rises from the bottom and the far cloud sea opens out, with distant peaks;
  - the camera settles looking straight down at the first chapter, where the map begins.
- Scrolling then glides the camera south along the trail.
- The night that opens the title is the night the trail ends in, so the map is one day, dawn to night.
- All 140+ stones and 13+ shrines lie on the cloud plane in one column. The scenery sits in the "pockets" the trail's curve leaves and beyond the screen edges.

**Locked chapters:**
- A chapter not yet reached sits under a bank of cloud tinted with its own glow.
- Its signature peak pierces the bank, its shrine's light shows, and its numeral and name are written on the cloud.
- Its stones and trail are hidden.

**On unlock:**
1. The stone you solved becomes its object.
2. The gold draws on to the newly open stones, and the hero walks it.
3. The bank parts from the trail outward and settles into the sea.

## Experiment: choosing the rendering

The question that mattered most was not how it looks in a still, but whether a world this rich could run on a phone, and in which medium. Both directions use the same data, the same DOM stones and labels, and the same island generator.

- **A. A three.js world:**
  - flat-shaded, low-poly islands baked with the game's face ramp (`cubes.js ramp()`: top / lit / shade / under by face normal and the palette's light, with the bases sinking into haze);
  - instanced cloud puffs, one draw call per chapter;
  - the path as a dashed ribbon shader;
  - shrine gems and beams;
  - stars as three point shells;
  - one camera.
- **B. Layered 2.5D:**
  - a 2D canvas for the sky and stars;
  - islands pre-rendered once to sprites by the same generator, then the WebGL context is dropped;
  - soft canvas cloud sprites;
  - an SVG path;
  - parallax from per-layer rates.

### Frame times

`shots/map-study/perf-final.json`. Conditions: CPU throttled ×4 through CDP, 390×844 at 3×, every stone solved (all objects and shrines). The same gestures each time: a title pan of a 440 px drag and release, then three 3,000 px wheel flings at 1,500 px/s. Three runs pooled.

| | title pan | map scroll |
|---|---|---|
| Baseline (today) | 16 fps (median 50 ms, p95 100 ms) | **7 fps** (median 133 ms, p95 200 ms) |
| A · 3D world | 52 fps (median 16.7, p95 16.8 ms) | **48 fps** (median 16.7, p95 33 ms) |
| B · 2.5D layers | 52 fps | 53 fps (median 16.7, p95 33 ms) |

- **Attribution** (`proto-perf-attribution.json`): direction A with its DOM layer hidden runs at 60 fps at ×4, with no frames over 17 ms. **The WebGL world is not the cost; the DOM stones and labels are.** Removing text-shadows, thumbnails or labels each won a few fps, and the result varied from run to run.
- **The first touch** on the title costs a hitch of 0.12–0.75 s. Starting the AudioContext (and building its reverb in JS) is part of it: with sound muted, the worst frame fell from 750 or 183 ms to 167 or 117 ms. The game's title has the same hitch.
- **Measurement limits:**
  - The GPU here is an RTX 5090 (ANGLE D3D11). CPU throttling does not slow it, so fill-rate on a phone GPU is **not** measured. A phone must be checked by hand: open the ≡ panel and choose *Frame times*.
  - Headless Chrome ignores synthesised *touch* scrolls. My first "scroll" numbers, for both baseline and prototype, had not scrolled at all, so every scroll above uses wheel gestures and records the distance moved (9,000 px each).
  - Runs vary by up to about 15 fps under ×4, because other agents were using this machine. That is why there are three runs.

### What the experiment showed, including what didn't work

1. **A wins on beauty and B does not win on frame rate.** The two run neck and neck: both about 7× the baseline.
   - Only A makes the pan a camera move: the cloud sea foreshortens toward a real horizon and the peaks overlap (`strip-compare-title-pan.png`, `video/compare-title-pan.mp4`).
   - B's pan is a gradient sliding upward.
   - B's tiled bank sprites read as repeating "fish scales" (`proto-b-locked.png`).
   - For open chapters the two look alike, because B's islands come from A's generator.
   - **Primary direction: A.**
2. **Faceted cloud puffs read as rubble or cobblestones** next to faceted islands, especially on dark chapters (`look/v1-strip-map.png`). Smooth, crisp, rounded clouds keep the two materials apart (Sky, K4), and only the islands are low-poly.
3. **A tilted perspective map was more cinematic but cost the frame rate.** At pitch −78°, stones at the top of the screen render about 25% smaller. Every stone then drifts against the world every frame, and rewriting about 25 transforms per frame cut A to about 43 fps.
   - **The fix:** in map view the camera looks straight down, so the cloud plane maps linearly, plus an *oblique lean* (a shear in the view matrix): height moves things up the screen, so peaks still show their faces like a diorama, and perspective-by-height keeps the parallax.
   - The lean eases in only after the horizon has left the frame. The stones then move with one transform per frame.
4. **Putting every stone into one tall track layer was worse** (35 fps): the 20,000 px layer has to be re-rasterised as it slides. The per-stone show and hide culling stays.
5. **Timing.**
   - The release glide first passed the horizon in about 0.2 s. The camera's mapping was speeding through the middle of the pan, so now the middle runs at about 0.45× speed. MV3 holds its descent for about 5 s; the right length for a swipe is open decision 2.
   - The parting first popped in about 0.3 s. Rendered at fixed `k` (`strip-a-parting-by-k.png`), its shape was right all along; the ease was squeezing it. It now unfolds over about 1.5 s, from the trail outward (`strip-a-cloud-parting.png`).
6. **Still weak:**
   - Brass and dark chapters (Clockwork) have heavy, saturated billows that crowd the chapter name (`proto-a-all-clockwork.png`).
   - The far vista at the horizon is thin.
   - The labels' glow is a CSS text-shadow, which costs frame rate.
   - The logo is a stand-in SVG. The game's own three.js logo and rays belong in that spot (Phase 2).

**Evidence:** everything is in `shots/map-study/` (git-ignored):
- `compare-baseline-a-b.png`: baseline, A and B at matched states (title, mid-pan, map top, chapter boundary, locked chapter, shrine);
- `proto-a-*.png`: styleframes, including `proto-a-biomes.png` for the dark and late chapters;
- `strip-*.png`;
- `video/*.mp4`: the pans and the ceremony at true speed.

## Prioritised hit list (Phase 2)

"Review" means:
- a side-by-side with the baseline at 390×844;
- the motion log;
- slow motion ×4;
- a phone with sound;
- the frame-time panel.

1. **The map becomes world A, drawn by the game's own renderer.**
   - *Change:*
     - While the map is up, `frame()` draws the map world instead of the level scene: one canvas, one WebGL context.
     - Drop `.map-backdrop` and its blur.
     - Keep `#menu .map-scroll` as the scroller and position the stones from it.
     - Keep `diveInto`, the pull-back and the map cascade on the same DOM.
   - *Benefit:* the whole look, and scrolling goes from 7 to about 50 fps at ×4.
   - *Cost:* L. Port `world.js`, `islands.js` and the layer code into `map.js` and `main.js`.
   - *Tradeoff:* the level is not drawn behind the map. "Quiet backdrops" still hold: the level is rebuilt under the dive's cover, as now.
   - *Review:* frame times at ×4; motion log through the dive and the pull-back; check that no old level flashes.
2. **The title is the same world, tilted.**
   - *Change:*
     - The name, the sub-line and the real logo sit in the night sky.
     - The swipe scrubs the tilt; Enter, Space and ArrowUp finish it.
     - The release glides to the map top, which still opens at its top.
     - The map's tappable STRATA (the developer panel) stays at the head.
     - Sound starts on the first touch, as now.
   - *Benefit:* the call to adventure (M1, K1, J1).
   - *Cost:* M.
   - *Tradeoff:* a longer move than today's 0.5 s.
   - *Review:* scrub slowly; check that the horizon is seen; check that keys work.
3. **The gold path, the faint way ahead, and the draw-in.**
   - *Change:*
     - Unlocked segments are a gold dashed ribbon (#e9b949 with a dark rim, so it reads on light skies too).
     - Locked segments in a reached chapter are faint white dots.
     - Locked segments in an unreached chapter stay under cloud.
     - After a solve: hold `DUR.hold`, then draw on outward at about 260 px/s while the hero walks (W1).
   - *Benefit:* progress you can see, and the way ahead is promised.
   - *Cost:* S, once item 1 is in.
   - *Tradeoff:* none worth noting.
   - *Review:* slow motion; the motion log marks the draw-in.
4. **Cloud banks over unreached chapters, with teasers.**
   - *Change:* tinted banks; the signature peak pierces them; the shrine's light shows; the name and numeral sit on the cloud; no stones, no padlocks (M2, S3, J4).
   - *Benefit:* desire with restraint.
   - *Cost:* M.
   - *Tradeoff:* full-length banks mean long stretches of cloud for a new player (decision 1).
   - *Review:* can a new player say what is next within 3 s (K3)?
5. **The parting ceremony, once per chapter.**
   - *Change:* persist the parted chapters, like the existing chapter 'awaken', in a new key `strata.map.parted`. The sequence:
     1. glide (`DUR.scene`) to the boundary;
     2. `DUR.hold`;
     3. the stone becomes its object;
     4. the draw-in;
     5. the bank parts from the trail outward over `DUR.ceremony` × 2, linear;
     6. the stones fade in behind it;
     7. the name wakes.
     - Reduce Motion: the bank is simply gone, with no tween.
   - *Benefit:* the chapter-sized moment (W3, B2).
   - *Cost:* M.
   - *Tradeoff:* about 5 s, played once per chapter. A tap should finish it at once (the motion.md rule).
   - *Review:* the video next to `video/a-unlock-ceremony.mp4`; the motion log marks each step.
6. **Shrines on the map.**
   - *Change:*
     - Each shrine is a gem over a slim spire on its own islet, the only vertical thing nearby.
     - **Open:** a warm gold halo and a beam (the only thing that breathes).
     - **Locked:** pale, with its star count.
     - **Solved:** a calm, cool glow (BotW orange to blue).
     - The tap target is 84 px.
     - The spur is finer gold dots (W2).
   - *Benefit:* answers "make shrines stand out". In the prototype they are the brightest thing on the map (`proto-a-shrine.png`).
   - *Cost:* S–M.
   - *Tradeoff:* none worth noting.
   - *Review:* the first glance on a phone — is the shrine the first thing seen?
7. **Shrines inside the level** (not prototyped).
   - *Change:*
     - the dive's diamonds in gold;
     - a held card, "✦ The Shrine of First Light";
     - the cube shader's crisp edge line tinted gold (a gilded stone);
     - rays tinted gold;
     - a bell motif with the reverb bus up;
     - the return to the map plays the warm-to-cool change.
     - No plinth: Kellan asked for one to be removed before.
   - *Benefit:* the shrine feels like a different place (BotW's shrine interiors).
   - *Cost:* M.
   - *Tradeoff:* none worth noting.
   - *Review:* the first frame of a shrine next to an ordinary level.
8. **Edge framing.**
   - *Change:*
     - clouds and islands only in the trail's pockets and beyond the edges, never within about 130 px of the path (M4);
     - no more than 5 depth bands (L2);
     - framing clouds darker and cooler than the open sea (K4).
   - *Benefit:* a place, not a list.
   - *Cost:* S.
   - *Tradeoff:* none worth noting.
   - *Review:* labels must stay readable. Fix Clockwork first.
9. **The hero.**
   - *Change:*
     - Keep the Totem (two iso blocks, one eye) and give it a small gold lamp, the same gold as the path it draws.
     - It stays larger than true scale, about 6% of screen height. In SMW, Mario is as big as a level node (VECLGXA8VWU 1:10); SotC's hero is about a tenth of the frame (S4).
     - It walks the drawn path and steps aside at the stone.
   - *Benefit:* continuity with the existing companion, and a reason for the gold.
   - *Cost:* S.
   - *Tradeoff:* none worth noting.
   - *Review:* is it found at once on every chapter's palette?
10. **Performance budget.** See below.

## Rules

**Minimalism: what we leave out.**
- No padlocks, arrows, "go here" markers or banners ("Chapter unlocked!").
- No counters beyond the chapter star counts, the shrine counts and the head's "n of N uncovered".
- No particles on the map, except the ceremony's.
- Scenery never carries information, and nothing on it is tappable.
- **Gold means progress only:** the path, the hero's lamp, open shrines and earned stars. Nothing else is gold.
- Cloud never covers the path.
- Besides the hero's idle, exactly one thing breathes per screen: the current stone's ring or an open shrine.

**Motion (`motion.js` tokens):**

| Moment | Timing and easing |
|---|---|
| Pan | follows the finger 1:1; release glides `ease.out` over 0.7–1.8 s; cancel `ease.out` over 0.35 s |
| Star shells | 0.3×, 0.5×, 0.72× of the tilt |
| Ceremony | glide `DUR.scene`, `DUR.hold`, draw-in ≤ 2.2 s, parting `DUR.ceremony` × 2 linear, stones fade `DUR.slow` |
| Cloud drift | a 5-unit sway over about 2 minutes |
| Breathing | 3.2 s |

- `pop` is used only for the object rising on a stone.
- Reduce Motion skips the tilt glide, star twinkle, drift, parting and walk, but never the state change.

**Sound hooks (`audio.js`; no new files):**

| Moment | Hook |
|---|---|
| First touch | `unlock()`, then a `stone(0)` bell, as today |
| Pan release | `peel()` |
| Logo carve | `chisel(1)` |
| Draw-in | `stone(i)` as the gold reaches each stone |
| Parting | `setKey(chapter palette)`, so the bed moves into the new chapter's key (Baker and Treacher: transitions built from the destination), plus `peel()` for the sweep and a bell when it settles |
| Shrine opening | `star(2)` |

The prototype plays the first-touch, release, stone and parting hooks.

**Performance budget (phones):**
- **Frame rate:** at CPU ×4, map scroll median ≤ 17 ms and p95 ≤ 34 ms; title pan likewise.
- **GPU work:** about 35 draw calls; ≤ 70k triangles in view; 1 WebGL context; DPR capped at 2.
- **Culling:** chapters are culled by z-range, and one puff draw per chapter.
- **No `backdrop-filter`.** Never draw the level under the map.
- **DOM:**
  - Stones outside the view are `display: none`.
  - In view, transforms only.
  - The track moves with one transform per frame.
  - No per-stone CSS animation except the current stone.
  - Prefer baked glows to text-shadows.
- **Start-up:**
  - Warm the map's shaders before the pan (`renderer.compile`).
  - Build the reverb impulse off the first-touch path.
- **Check on a real phone with the frame-time panel.** The GPU budget is unverified here.

## Phase 2 plan

1. Port world A into the game:
   - `map.js` renders the world plus the DOM layer;
   - `main.js` swaps the scene while the map is up;
   - keep `progress()`, the unlock rules, thumbs, chapter names and numerals, shrine counts, Drift and Learn.
2. Rebuild the title as the tilt:
   - the real logo, with no build animation and its corner carving;
   - music and sfx start on the title;
   - swipe up and the keys;
   - the map opens at its top.
3. Ceremony, persisted in `strata.map.parted`; then the shrine treatment on the map and in the level.
4. Reduce Motion, motion-log marks at every step, and slow-motion review.
5. Performance against the budget at ×4, then on a phone.
6. QA screenshots at 390×844 and on desktop.
7. Update docs: `motion.md`, this file, and `level-design.md`'s map contract.
8. `npm test`, then push.

## Open decisions for Kellan

1. **How much of a locked chapter to show.**
   - The prototype keeps every chapter at full length under cloud: honest about the journey's length, but a new player scrolls through about 14 screens of cloud.
   - Monument Valley withholds: only the next chapter shows as a teaser, and the ones after fold into a short stretch of cloud.
2. **How long the descent takes.**
   - The prototype's release glide runs 0.7–1.8 s and lingers at the horizon.
   - MV3 holds its descent for about 5 s.
   - The title is seen every launch, so longer is more beautiful once and slower every time after.
3. **The shrine inside the level.** Item 7's gilded stone, gold rays and name card, or something quieter, such as only the card and a gold dive.

## Validation limits

- Every judgement here is mine, from Chromium captures at 390×844. Nothing has been tested with players.
- The phone GPU budget, real touch scrolling and momentum are unverified until Kellan opens the prototype on his phone.
- Sound pairing is wired to existing hooks but has not been tuned by ear.
- The prototype's logo is a stand-in.
- The map grew to 151 stones in 7b780f1 while this study ran. The prototype reads the live data, so it shows 151.

**No island parallax (2026-10-19).** Kellan: the floating islands shouldn't have parallax. The far layer's scroll-driven drift is off (`PARALLAX = false` in mapworld.js), so every island moves with the page. The title's stars keep their slight parallax.

## The title-to-map seam (2026-10-19)

Kellan: the gradient between the title and the map "comes to an abrupt end". Three causes: CSS joins gradient stops with straight lines, so the brightness peaked at the horizon and then went flat, which reads as an edge (a Mach band); a 1.5 px horizon line on top of that peak; and the fixed sky was moved one frame after the map sheet, so mid-swipe the two were a few px apart. Fixed by making the sky one curve from the top of the title, through a rounded horizon glow, down into the first chapter's sea over 1.15 screens (`dawnGradient` in mapworld.js: a monotone cubic per channel, sampled into 120 stops), by removing the line, and by moving the sky in the same call as the sheet. A tap on the title now runs the whole descent, as a full swipe does.
