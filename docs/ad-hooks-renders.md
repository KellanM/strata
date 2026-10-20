# Ad hooks: first three renders (2026-10-18)

These are the "Top 3 to produce first" from `docs/ad-hooks-study.md`, built on
the v2 trailer pipeline.

**Outputs:**
- `trailer/ads/<slug>.mp4`
  - 1080×1920, 30 fps
  - H.264 CRF 18, capped at 6.8 Mb/s
  - AAC 48 kHz, faststart
  - −15 LUFS, true peak ≤ −1.5 dB
- `trailer/ads/contact/<slug>-N.png`: contact sheets at 5 fps.

**To rebuild:** run `node tools/trailer/ads/build.mjs [slug …]` with the game
server on `PORT`. The scripts are in `tools/trailer/ads/ads.mjs`.

## What was built

| Slug | Concept | Length | Tracks |
|---|---|---|---|
| `dont-tap` | #1 "Don't tap that one" | 10.5 s | one full-frame capture |
| `same-block` | #2 "Same block. Different secret." | 12 s | three 360×1920 panels (`hstack`) and a type/end-card overlay with alpha |
| `level-1-vs-67` | #3 "Level 1 vs Level 67" | 11 s | two 1080×960 halves (`vstack`), then a wipe into a full-frame capture of the same Observatory script, and an overlay |

**New pipeline pieces:**
- **Wrong taps:**
  - `H.aimWrong()` and `H.wrongTap()` find a visible cube that belongs to the
    shape and tap it through `strata.act` (the game's real tap path). The
    game then flashes it red, shudders it, thuds, adds the ✕, and the solve
    loses its third star.
  - Capture checks that the mistake registered and the cube did not break.
- **The ✕ count:** `H.strikes()` shows the game's own `#strikes` text large.
  The HUD it normally lives in also names the level, which would spoil the
  reveal.
- **Capture modes:**
  - `full`: everything, as before.
  - `game`: a composite panel with no type.
  - `overlay`: type and end card only, on a transparent page, written as
    PNG-in-MOV.
- **Per-track options:** viewport `size`, and `H.mute()` for which of a
  level's sounds may play.
- **Starting a level:** `level()` now uses the game's own `quiet` start.
  Capture marks every chapter as entered, so the new chapter card no longer
  holds a level back.
- **End card:** its words live in one place, `END_CARD` at the top of
  `tools/trailer/v2/page.mjs`. An ad can add a line (`dont-tap` adds "ZERO ✕ =
  ★★★").

## Honesty rules: how each ad keeps them

- **Chiselling is never sped up.**
  - `dont-tap`: every tap is real time.
  - `same-block` and `level-1-vs-67`: long solves are joined from real moments
    of the same solve, cut by visible whips. Each segment restarts the level
    with fewer cubes left.
- **Speed-ups only after the last tap.** `dont-tap` runs the finale at 2.4× so
  its title and two gems land before the end card. The gem chimes are replayed
  on those frames. No other ad changes speed.
- **Taps.** Every ring lands on a cube the camera can see, and it breaks (or,
  for the wrong move, takes the real mistake) on that frame. Capture logs:
  - `dont-tap`: 8/8, one of them the wrong move.
  - `same-block`: 36/36 per panel.
  - `level-1-vs-67`: 5/5 for Steps, 23/23 for the Observatory.
- **Facts in the copy.**
  - Steps really is level 1 and the Observatory level 67 (map order; 67 main
    levels).
  - Seven worlds, yes.
  - Garden Gnome, Lighthouse and Rocket are all 5×10×5.
  - One ✕ gives two stars and zero gives three (`score.js`).
  - No percentages, no superlatives, no testimonials.
- **Same block, different skies.** Each panel keeps its level's own palette,
  because that is how the game shows them. "Same block" refers to the 5×10×5
  block, not the colours.

## Open questions (left for Kellan, per the brief)

- **The end card is unchanged: PLAY NOW plus the store badges.** The study
  flags both: the store listings don't exist, and the study suggests "PLAY
  FREE IN YOUR BROWSER" without badges. To switch, edit `END_CARD` and
  re-run `build.mjs` (no script changes needed).
- **No "100+" or "70+" claims.** The new ads avoid content counts other than
  "67 LEVELS · 7 WORLDS".

## Second batch: concepts 4, 6 and 7

| Slug | Concept | Length | Taps on visible cubes |
|---|---|---|---|
| `hiding-dragon` | #4 "This block is hiding a dragon" | 9 s | 28/28 |
| `guess-in-3` | #6 "Guess in 3" | 9 s | 18/18 |
| `sound-on` | #7 "Turn your sound on" | 15 s | 64/64 |

### `hiding-dragon`
- **Opening:** the whole block, with the claim sharp on frame 0 and the first
  crack at 0.3 s.
- **Chisel run:** real time. Two real moments of the solve are joined by one
  whip.
- **Finish:** "ONE TAP LEFT…", then the tap. After it, the finale runs 3.2×
  (picture only), so the head turns to us and all three gems land before the
  end card. The gem chimes are replayed on those frames.
- **Length:** 9 s, not the study's 8, to give the end card 2 s.

### `guess-in-3`
- **Tap order:** taps run outside in (`H.tapOrder('shape')`), farthest from the
  object first, so the silhouette sharpens beat by beat.
- **At the "3":** the 12 Snail cubes nearest the object still cover it, so the
  shell's dome and steps are there to read but blurred.
- **Payoff:** "SNAIL!" with the reveal; finale 2.5× only.
- **Round 2:** a wordless Pelican round with the same treatment.
- **Close:** "CAN YOU GUESS FASTER?", then the end card.
- **Game titles:** hidden throughout, because the copy names the objects.

### `sound-on`
- **Opening:** the Tea House at zoom 2.1, with two taps already landed before
  the first frame (fragments in the air) and a small speaker icon top right. No
  words until 2 s, then "TURN YOUR SOUND ON".
- **Chisel run:** one real-time run of 56 taps, every 0.148 s, under a slow
  0.35-rad orbit. It eases back to zoom 1.3 so the cubes still to go stay on
  screen.
- **Peel:** one layer back and forward again.
- **Finish:** the last six taps, then the reveal (finale 1.8×). The game's title
  shows first, then "ONE MORE?" replaces it, then the end card.
- **Mix:** the game leads.
  - The music bed is at 0.1, against 0.2 in the other ads.
  - The SFX are at 0.18, against 0.35.
  - The game sound measures −21.7 LUFS before loudness normalisation, with the
    SFX far under it. Per-half-second RMS holds at −18 to −20 dB through the
    run.
- **Sound off:** the fragments, rays and rings still read on the contact sheet.

### Pipeline changes for this batch
- **Visibility.** A cube counts as seen if any of nine points (its centre and
  eight toward its corners) is on screen and the game's pick at that point
  finds it. The ring lands on that point.
  - This caught the Tea House's half-hidden cubes, which centre-only picking
    had missed.
  - Picking also respects the peel now (`main.js` `inPeel`).
- **Pre-chiselling for a camera move.** It can plan for an orbit still to come
  (`orbitAhead`): only cubes seen along the whole turn count as seen.
- **Sound levels.** Per track: the music bed level (`music`). Per ad: the SFX
  gain (`sfxGain`).
- **Debugging.** The `PROBE=<cube>` capture option prints a cube's on-screen
  point and the pick result over time.

## Limits

- **Review:** checked by contact sheets, frame-by-frame close-ups and loudness
  measurement only. Nobody has watched them on a phone or listened to them.
- **Panel sound in `same-block`:** only the left panel's chisel run is heard.
  The other two join for their own last taps and reveals, so the three runs
  don't play three melodies at once.
