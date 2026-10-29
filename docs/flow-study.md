# Flow study: splash → title → map → puzzle (2026-10-28)

**Brief.** Kellan: are we doing the right things in the opening flow, by the conventions of comparable games? How long should splash screens last? What goes on a title screen? Later feedback from a playtester: they couldn't tell when they had finished the tutorial. Kellan's idea: show the map first, have the player tap the tutorial stone, and bring them back to the map afterwards.

Scope: research and proposals. Nothing gets built until Kellan picks.

Fixed (approved earlier): the Unsupervised Rock card; First Light as the title (the glowing stone breaks, its light writes STRATA in the stars); the title and map as one page; the 12 lessons' wording (`tutorial-study.md`). Earlier studies this builds on: `splash-study.md`, `ftue-study.md` (P1–P6), `map-study.md`.

Sources and per-game evidence: `flow-study-sources.md`. A research agent watched the recordings; timings in them are positions in the recordings, accurate to about ±1 s.

## Baseline: a returning player's cold launch

Captured with `shots/flow-baseline.mjs` (Chromium, 390×844, a save four stones into First Light). Frames are in `shots/flow-base/sheet.png`.

| t | What the player sees |
|---|---|
| 0–3.5 s | The studio card. It plays on every cold launch; only a reload within the same session skips it. |
| 3.5 s | The title: a dark cube with one glowing cube, no name and no prompt. At 8 s idle the tap hint had not appeared. |
| tap | The stone breaks, its light rises, and the night and the stars come in, ~3–4 s. |
| swipe up | The map opens at its **top** (Learn, First Light). The player's next stone is off-screen below. |
| scroll, tap | The puzzle opens (~0.7 s). |

The shortest path is about **16 s and three gestures** (tap, swipe, tap), plus a scroll to find your stone. The whole ceremony repeats on every launch.

Seen in passing: the "SWIPE UP" label shows on the map, over the Learn stone (frame `10-14.8s-map`).

A first-time player: after the card, the title's swipe starts lesson 1 directly. After lesson 12, `finishTutorial()` returns them to a map they have never seen, where First Light's mist parts. Nothing marks "tutorial done" as a moment; that matches the playtest feedback.

## What comparable games do

Details and sources are in `flow-study-sources.md`.

- **Platform.**
  - Apple's HIG says to "launch instantly", and the launch screen "isn't a branding opportunity". Since 2024 it allows a splash screen shown "as soon as launching completes". It also says to "restore the previous state… avoid making people retrace steps".
  - Android caps the splash-icon animation at 1,000 ms.
  - Unity's default is 2 s or more per logo, which is probably where the 2–3 s industry habit comes from.
  - No published data links splash length to early drop-off.
- **Studio cards** run about **1.5–2 s** for one logo (ustwo, Dinosaur Polo Club, Dots, Team Alto, Easybrain). Florence's two logos take ~7 s. Ours, at 3.1 s plus a 0.7 s fade, is at the slow end.
- **Title screens** have the logo, the game world behind it (Alto, Mini Metro, Monument Valley), and **one** input: "Tap to start", one arrow, or one Play button. Monument Valley 2 is a playable scene with no buttons. No peer asks for two different gestures.
- **The first launch** often skips the title and goes straight into play: Nonogram.com goes to a tutorial puzzle ~8 s after its logo, Mini Metro to a tutorial map, Monument Valley to its prologue.
- **The hub is the continue button**: Royal Match has a big "Level N", Two Dots opens the map at your level, and Alto's title sits over the live world, one tap from play. These relaunch behaviours are mostly *unverified* (the recordings are first launches).

## Mechanisms

1. **One gesture from title to play.** *Observed:* Alto, Mini Metro, I Love Hue, Two Dots. *Interpretation:* the title is a breath, not a puzzle about how to leave it. *For us:* the stone tap is the beautiful part, so keep it. The swipe is the second, unprompted gesture, and it's the one to lose.
2. **The ceremony is for the first time; later launches restore your place.** *Platform claim (Apple):* restore state, no retracing. *Observed:* the hubs above. *For us:* the light-writes-the-name sequence is a reward. On every launch it's a toll.
3. **One logo, ~1.5–2 s, skippable.** *Observed* across the peers. *For us:* the card's final hold does nothing for the boot once the map is built.
4. **The map is where progress is legible.** *Observed:* Two Dots and Royal Match make your place the first thing you see. *For us:* this is where "tutorial done" becomes visible: a stone turns solved and the trail moves on. Kellan's idea is this mechanism.
5. **Name a finish.** *Interpretation (no source):* a section ends when it is marked: a stone sealed, a star, a path drawn. Ending the lessons by dropping the player onto a new screen reads as a scene change, not as completion.

## Proposals, prioritised

| # | Change | Benefit | Cost | Trade-off | Review |
|---|---|---|---|---|---|
| **F1** | **Tutorial as a stone on the map** (Kellan's idea). First launch: card → title (tap the stone, the name is written) → the descent lands on the map with **Learn** as the glowing current stone and everything else under mist → tap Learn → the 12 lessons → **back to the map**: Learn seals (solved, its stars), the trail draws to First Light, and the mist parts. | Fixes the playtest: finishing is a visible event in a place the player has seen. Teaches the loop (tap a stone, play, come back) in minute one. Reuses the existing parting and trail. | Medium: the `toMap()` / first-swipe branch, `finishTutorial()`, and the Learn node's states | One more tap before lesson 1. | Fresh-save frame sequence; a new playtester: "what did you just finish?" |
| **F2** | **Relaunch lands on your next stone.** With the tutorial done, after the card the title shows already lit, with the name written and the sky in (no tap needed). One tap or swipe anywhere descends straight to the map, **scrolled to the current stone**, which glows. | Cold launch to puzzle goes from ~16 s and 3 gestures + scroll to ~6 s and 2 taps. The title stays as a still breath. | Small–medium: First Light needs a "settled" state; map scroll target | The breaking stone is seen once per install (or keep it per day: see F5). | Re-run `flow-baseline.mjs`; time and count gestures |
| **F3** | **Card ~1.8 s, tap to skip.** `SPLASH_HOLD` 2.6 → ~1.2 (the card fades in 1.1 s), but never lift before the map is built. A tap skips the hold. | Matches the peers; saves ~1.3 s on every launch. | Tiny | The rock's hop needs ≥2.2 s (`splash-study.md`) if the play version comes back. The current card is a still, so this is free. | Phone feel |
| **F4** | **One clear prompt on the title.** Show the tap hint after ~2 s of stillness, not 6.5 s of sim time (it hadn't shown at 8 s). After the name, make the descent automatic (or "tap to begin"), not an unprompted swipe. | Nobody stalls on a dark screen wondering what to do. | Tiny–small | Less pure stillness. | First-time playtester |
| **F5** | **(Option) Replay the ceremony once a day.** First launch of a day: the full stone break. Later the same day: F2's settled title. | Keeps the ritual special without making it a toll. | Small | Two paths to maintain. | Kellan |
| **F6** | **Fix: "SWIPE UP" shows on the map.** | Bug | Tiny | none | Frame check |
| **F7** | **Measure on TestFlight.** Log timestamps for card lift, title tap, map shown and first move, so the first real players show where they stall. | Data instead of guesses. | Small | none | TestFlight logs |

**Recommendation: F1 + F2 + F6 as one change** (they share the first-swipe and map-scroll code), F3 and F4 alongside because they're tiny. F5 only if Kellan misses the ceremony on relaunch.

## Validation limits

- Baseline frames are from Chromium on a desktop; phone timing is slower (the boot's long tasks).
- Peer timings come from trimmed recordings (±1 s), and most relaunch behaviours are unverified.
- Not watched: Ken Wong's Monument Valley GDC talk and Jamie Churchman's Mini Metro GDC 2017 talk.
- Nothing here is player-tested beyond the one piece of playtest feedback.

## Decision and result (2026-10-28)

Kellan: apply the recommendation (F1 + F2 + F6, with F3 and F4). F5 and F7 not built.

- **F1:** the title always descends to the map. On a fresh save the map is under mist but for Learn (current, glowing); its tap starts the lessons; finishing or skipping them returns to the map, where Learn shows solved, the trail draws to First Light and its mist parts.
- **F2:** with the lessons done, the title starts already written (`fl.finish()` at boot); the map is built scrolled to the current stone.
- **F3:** card fade-in 0.7 s, `SPLASH_HOLD` 1.6 s (about 2 s on screen with the fade out); a tap lifts it once the map is built.
- **F4:** the tap hint after 3.2 s idle (was 6.5 s); the prompt reads "tap to begin" (a swipe still works).
- **F6:** the prompt fades as the page starts moving (`#title.going`), so it no longer rides up over the map.

Measured with `shots/flow-after.mjs` (Chromium, 390×844, frames in `shots/flow-after/`):

| | Before | After |
|---|---|---|
| Returning player, launch → puzzle | ~16 s, tap + swipe + scroll + tap | **5.8 s, 2 taps**, current stone on screen on arrival |
| First launch, launch → lesson 1 | card → tap stone → swipe → lesson | card → tap stone → tap → map → tap Learn (15 s with the full stone break) |

Still open: skipping the lessons leaves the unfinished lesson behind the map's Resume button (also true before); phone timing unmeasured.
