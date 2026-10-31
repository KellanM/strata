# Strata · listing copy to try (Hopkins study, 2026-10-30)

Draft copy from [docs/hopkins-study.md](../docs/hopkins-study.md). Nothing here is in App Store Connect yet, and the live text stays in [app-store-listing.md](app-store-listing.md) until Kellan picks. Character counts are measured; limits are in brackets.

The claim "one answer per stone, no guessing" is checked: `node tools/aha-audit.mjs` reports 208 of 208 stones (levels, bonus stones and lessons) line-solvable and unique. Re-run it before using the claim if levels change.

## Subtitle (30)

**Carve what's hidden, in 3D** (26), recommended. It keeps "3D" for search; "puzzles" is already in the name.

Alternative: **3D logic puzzles: no guessing** (29).

Now: "A calm 3D puzzle game" (21), Kellan's pick of 2026-10-28, matching mythen.io. If it changes, the site's line should change too.

## Promotional text (170)

```
Read the numbers, chisel the stone, and a fox or a baby dragon is left standing. One answer per stone, no guessing. No ads, no timers.
```
(134)

It fits in the three lines above "more" in the mock (`docs/copy-frames/hopkins-store-mock.png`). Check that on a real iPhone after pasting. Promotional text changes without a new build, so it is the first thing to try.

## Description, new opening

This replaces the first two paragraphs. The rest of the current description stays, with two edits:
- In GENTLE TO LEARN, "Stones grow larger and their clues fewer as you travel" becomes "Stones grow from 48 cubes to 567 and their clues fewer as you travel".
- The QUIET BY DESIGN list stays last.

```
Tap a cube to chisel it away. The numbers on the stone's faces tell you which cubes to keep. Clear the rest, and what was hiding inside is left standing: a lighthouse, a fox curled asleep, a dragon too young to breathe fire.

Every one of the 182 stones has exactly one answer, and you can always reach it by logic alone. You never have to guess.

Each find comes with its own line. The coelacanth: "Everyone said it had been gone for seventy million years. Nobody told it."

It is a nonogram in three dimensions. Turn the stone in your hands, peel back its layers to see inside, and work row by row until only the object remains.
```

## Screenshot captions (optional; test against the plain shots)

| Shot | Caption |
|---|---|
| 1 Origami Fox, result | Chisel the stone. Find the fox. |
| 2 Orrery, mid-solve | The numbers say which cubes stay |
| 3 Old Stones journal | 182 stones, each with its own story |
| 4 Maple Bonsai, mid-solve | Turn it. Peel back the layers. |
| 5 Coelacanth, result | One answer every time. No guessing. |

A caption band shrinks the game image. Decide with a Product Page Optimization test (captioned against plain) after launch, not by taste.

## Ad end card

Add "One answer. No guessing." under the CTA. Everything else in `docs/ad-playbook.md` stays.

## How to judge

Give each channel its own Custom Product Page link and compare day-7 retention in App Analytics, not installs.
