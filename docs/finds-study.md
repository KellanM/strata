# Finds study: the layout and look of the collection (2026-10-29)

## Brief

Kellan asked for "a creative-study on the layout and visual style of the finds menu". Finds was formerly the Journal: every object chiselled out of a stone, 197 of them across 15 chapters, with a turntable detail view for each.

This is a study with mockups; no game code was changed.

Fixed constraints:
- The name Finds and the ring's icon (a stone on a slab), both Kellan's choices.
- North star: Monument Valley and Journey.
- The detail view's turntable and one-line stories.
- Chapters in the map's order and colours.

## Baseline

`finds-frames/strata-baseline.jpg` shows a save 60 stones in, 390×844:
1. **An inventory grid.** Three columns of 88 px tiles, each with a name and a row of gems; 197 slots in total. The page is 10,805 px tall, about 13 screens.
2. **Unfound objects are dark blurs.** For a mid-game player about two-thirds of the page is blurs. Whole worlds not yet reached (The Lagoon, Old Stones, Clockwork…) are walls of them.
3. **Each chapter sits on its own sky with a hard edge,** so the page changes colour abruptly at every chapter.
4. **The detail view is top-heavy:** the object sits high and the text low, with a large empty band between.

## References

Frames: `finds-frames/refs-1..3.jpg`. All are third-party captures, ±2 s. I checked refs-3 directly. Obs = seen in a frame.

| Game | What it does (Obs) |
|---|---|
| Picross 3D albums (i8jMjoCtobM) | Each set is a composed postcard scene. The solved voxel objects are placed into it at varied sizes, with no slots. |
| Picross 3D Round 2 (_P2wFIA3BxU 0:21) | The solved object stands on a wooden table in a sunlit room: the closest domain match to Strata. |
| Pictopix (aGBzsZeZdZ4 37:07) | A quiet 5×3 page. Unsolved tiles are an empty square with a "?". |
| BotW Compendium (IjwZZUceNWU) | Unfound slots are dim, with a category emblem and a glyphed name. Detail is a framed photo and a few lines. |
| Hollow Knight Journal (LX3Q1DK3AF8) | Detail: one creature in a soft spotlight inside a dark vignette, a 1–2 line note in its own voice, and a small corner count. |
| ACNH Critterpedia and museum (88hwUJdM7PM, EA8tmcVqpJU) | Unfound cells are near-blank ghosts. The museum puts each find on a plinth or under a bell jar in a spotlight. |
| Neko Atsume (GXiKHzl6i3s) | Each cat card carries the date it was first seen. |
| Botany Manor (a2AWkdvUCWc) | Unfound plants are flat silhouettes. Inspect: one object over a blurred room. |
| Pokémon Sleep / Legends Arceus | Busy: counts, research tasks. A negative example. |
| Stardew, Nonogram.com | Inventory grid, confetti, goals. Also negatives. |

## Mechanisms

1. **A find lives in a place, not a cell:** ACNH plinths, Picross 3D R2's table, Botany Manor's candlelit table. This fails if the place must be panned to find one of 197 things.
2. **Unfound is a quiet gap, not a lock:** ACNH ghosts, BotW's dim slots. For a nonogram a silhouette gives the answer away, so an uncut stone is safer.
3. **Progress is small and local:** Hollow Knight's corner count. It fails when it becomes the headline (Nonogram.com).
4. **Specimen presentation in the detail view:** one object, one light, a label, one line in its own voice (Hollow Knight, ACNH).
5. **Two densities:** a grid to scan, then the treasured view for one object (ACNH's Display Pictures).
6. **Personal provenance:** Neko's first-seen date. It fails when it grows into a stats block.

## Mockups

`finds-frames/finds-mockups.jpg`. Rows: today, A, B. Columns: the top, the edge of what's found, the end, the detail view. Injected into the real page.

- **A, "Quiet gaps":**
  - Unfound objects become small pale uncut stones, the map's unopened stones (M2).
  - Each chapter's sky blends from the one before.
  - Worlds not yet reached fold into one closing section, "Still ahead · 9 worlds · 112 stones", listing their names, which sinks to the map's night like the Drift.
  - The page goes from 10,805 to 5,395 px.
  - *Reads:* calm and honest. The next world still shows its stones as the next goal.
- **B, "Plinths":** A, plus each find stands on a small stone slab under a soft light (M1, and the Finds icon itself). Unfound slots are empty slabs. The detail view puts the object on a slab.
  - *Reads:* the found rows feel like a museum. A wall of empty slabs in an unfinished chapter gets busy.
  - The detail slab is a CSS stand-in; built properly it would be a mesh under the object, turning with it.

A first pass folded each unreached chapter separately. Ten coloured headers stacked into a candy stripe, which is why "Still ahead" is one section.

## Recommendation

1. **Build A** for the overview.
2. **Take B's plinth into the detail view only** (M4, M5). The grid stays scannable, and the single find gets its moment: on a slab, in a pool of light, with the text drawn up nearer to it.
3. **Optional, M6:** a small provenance line in the detail, such as "found in 1:30 · no slips".
4. **Fix:** the page's pink background shows below "Still ahead". End the page on the night.

## Limits

- Mockups are static screenshots in Chromium.
- The chapter blend and the folding of unreached worlds are injected, not built.
- No player testing.
