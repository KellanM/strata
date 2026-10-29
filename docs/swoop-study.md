# Swoop study: the launch's fast move down the map (2026-10-29)

## Brief

Kellan: the in-between when a returning player taps the title and the map swoops to their stone "looks like bands", not speed. Should it have vertical lines? Can the gradients blend so it feels like moving really fast? How do other games and films do this?

What was built before this study (`main.js` `glideToStone`, far case):
- A stand-in strip, four screens tall, of the sea's colours from the top of the map to the stone. It slides up 3 screens in 1.25 s, driven by the compositor.
- The real map, blurred, leaps under it.
- Faint static vertical hairlines over it.

## Baseline

`swoop-frames/strata-base.jpg` (20 fps, Chromium at 390×844, a save at stone ~141):
- Each frame shows 3–5 distinct horizontal colour stripes with fairly hard edges.
- Dark teal (The Lagoon) reads as a stripe.
- The hairlines can barely be seen, and since they don't move they read as texture, not motion.

## References

Frames: `swoop-frames/refs-1..4.jpg`. All are third-party captures at 360–480p, ±1 s. Obs = I saw it in a frame. Rep = I read it.

| Example | What carries the speed (Obs) |
|---|---|
| Abzû, riding the current (HRW5SEQP5pw 2:08) | 5–12 faint, thin, pale lines per frame, varied lengths, each living 1–3 frames, radiating from the destination. The diver and the destination stay fixed. Only during the fast current. |
| Flower trailer (s1oZnf3475c 0:54) | No lines. Near grass blurred along the motion, a petal trail, a rolled camera. The sky is a smooth gradient that stays slow. |
| Journey, sand surfing (bg44uTuztVo 0:18) | The traveller's own wake: sand ribbons parallel to the motion. No screen lines. |
| Ori bash (WbvIXV6lrSk 0:14) | A smear of glowing light along the path. |
| Spider-Verse, Leap of Faith (L9E6XGnlC2A 0:19) | A straight vertical fall. A few thin, crisp, saturated bars and a fine window grid sweep up 15–25% of the frame per frame. Miles stays fixed. |
| Kiki's Delivery Service takeoff (HSXUO9v7F_E 0:16) | No blur or lines. Detailed painted rooftops move a long way each frame. Kiki is the anchor. |
| Star Wars, lightspeed (8A6PTCf6dVc 0:51) | Points grow into streaks over about 1 s. The cockpit is still. Near things smear and far ones stay crisp. |
| 2001 slit-scan (NaK4z3Fjpkk 0:12) | The colour fields change slowly. The stripes inside the streaks are what move. |
| Google Earth fly-to (9g-a2CzgL9k) | Zoom out, pan, zoom in in about 2.3 s. No blur; the detail moving between frames carries it. Rep: van Wijk & Nuij 2003, via the Mapbox `flyTo` docs. |
| Tiny Wings, between islands (x6pT_2E5xI0 0:54) | Doesn't show speed: a soft cloud wipe covers the gap. |

## Mechanisms

1. **Speed is read from something crisp crossing the screen,** not from colour. A smooth gradient sliding past gives the eye nothing to follow, so it reads as a drifting band.
2. **Streaks run parallel to the motion, vary in length, and change every frame.** Static lines read as grain.
3. **Calm games use few, faint, short-lived lines** (Abzû), or world trails (Flower, Journey). Dense, even lines belong to action and manga.
4. **Colour changes should be long and soft** (Flower, 2001), **or few and thin** (Spider-Verse). Broad blocks with visible edges are the "bands" look.
5. **A fixed anchor** makes the motion readable (cockpit, diver, Miles).
6. **Build up, then decelerate long;** the arrival is staged by the detail coming back.

## Experiments

These were behind `?swoop=`, recorded in the real game, frames in `swoop-frames/strata-*.jpg` and MP4s sent to Kellan.

| Variant | Result |
|---|---|
| smear: colours box-averaged over 1/5 of the way, in OKLab | Bands gone, but the middle went **muddy grey** (complements averaged), and an even field shows **no motion at all**. Disproved "just blend". |
| smear v2: 1/9 of the way, chroma restored to the mean chroma | Colour back, soft drifts between worlds. Used in all the variants below. |
| lines / lines2: soft-light streaks, 45/70 of them | Too faint in lines. lines2 reads, softly. |
| **stars**: 140 bright white streaks, varied lengths, flying 4 screens while the colours go 3, stretching with speed | Reads as speed (400–750 ms). **Kellan chose it.** |

## Applied (commit df8ff35)

- The stars variant is the default: the smeared OKLab colours plus the streaks. The static hairlines are gone.
- **The title's night is the strip's first screen,** sampled from the title (`TITLE_NIGHT`). The cover fades in without a change of colour, and the night runs on into the map's dawn (Kellan: "the first colors … match the title screen").
- **The arrival slows** (Kellan: "slightly slowing down before it lands"):
  - The strip's easing has a longer tail, and T is 1.45 s.
  - The streaks shrink and fade by 80%.
  - The map lands half a screen short and glides onto the stone with an ease-out as the stand-in lifts.
- The streak tile is drawn 1.5 s after launch for returning players, not on the tap.

## Limits and open

- All recordings are headless Chromium at 25 fps. Smoothness on an iPhone is untested; Kellan to check on device.
- A fixed anchor (mechanism 5) isn't tried yet. Candidates: the title's stars stretching into the streaks, or the target stone held sharp while the world rushes past.
- The Lagoon's dark teal still reads as a short band. That is true to the map, but it could be softened.

## Audit and fixes (2026-10-29)

A subagent audited the swoop against ten intended behaviours in Chromium and WebKit (probes in `%TEMP%\strata-swoop-audit`). Fixed from its findings, and re-measured with its tools:

1. **The arrival's colours.** The strip's last stretch (what shows as the map comes through) is now the landing spot's own sky at true scale, read from `mapWorld.skyAt` (sea and dusk), with the smear easing off toward it. Before, it was a squeeze of ~7000 px of map. Strip end vs map at rest: rgb(155,126,115) vs (69,37,63) before; (60,30,58) vs (70,37,63) after, and (215,171,146) vs (214,172,148) at 60 stones.
2. **One clock.** The leap and the end read the strip animation's own time, not the frames', and the swoop ends when its animations finish. Before, with the CPU throttled ×4, the settle was cut off at 383/580 ms; now all three finish at 580/580.
3. **The descent finished at the leap** (under the opaque veil), as a touch would: the sheet's own translate is 0 through the lift in Chromium, throttled Chromium and WebKit.
4. **The cover's first screen** ends at the map's dawn (`skyAt(0)`), the colour the tap is hurrying the title's foot to, not the night's violet.
5. **The landing point** is measured by layout (offsetTop), not by the stone's entrance pose: it lands at 45%, 20 px lower than before.
6. **The streak tile** is drawn once the title has begun, in an idle moment, as a pre-decoded blob, not on a 1.5 s timer that landed on the splash's erase.

Also: a touch before the lift fades the veil off over 160 ms instead of cutting to the map in one frame. Not done: re-landing after a rotation mid-swoop (the app is portrait-locked).
