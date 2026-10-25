# Pause study: a centred pause that stills the world (2026-10-24)

## Brief

Kellan: "iterate on the in game pause screen. Center it and creative-study some of the best pause screens in mobile games using our references."

Fixed constraints:
- North star: Journey and Monument Valley, then Shadow of the Colossus and Alto. Beautiful but minimal, wordless where possible.
- Keep every function: **Resume**, **Restart** (with its "Start over?" second tap once a level has chisels in it), **Map** (hidden during the lessons until the tutorial is done), tap-outside and Escape to resume, and the clock that stops while paused.
- Keep the game's type (Avenir, letter-spaced caps) and per-palette colours (`--sky`, `--ink`).

## Baseline

`docs/pause-frames/before-after.jpg`, panels 1 and 3 (390×844, Dawn `chair` and Starfall `bunny`).

- A 168 px card unfolds from the menu button, **top-left**. Three left-aligned text rows with hairlines: RESUME / RESTART / MAP.
- The veil is a flat 28% of the sky, so the stone, its clue numbers and the whole HUD (title, timer, strike ✕, rewind, Chisel/Mark) stay fully lit around a small box.
- "Start over?" turns the middle row into a filled pill.
- It reads as an app's dropdown menu, not as a moment in the game. It's also off the thumb's natural axis on a phone.

## References inspected

Frames were pulled with yt-dlp and ffmpeg (1 frame every 1–15 s, then 1 fps around the pause). Key frames are in `docs/pause-frames/references.jpg`. No audio was heard.

- **Monument Valley 1** (`i-kphKarNQo`, 0:04–0:13; phone capture):
  - The pause is a pinch-out photo-mode with three glyphs along the bottom (✕, download, share).
  - "Leave this chapter?" is a **centred question** in small spaced caps, sitting straight on the art with no panel.
  - Below it are **two glyph+word choices placed symmetrically** about the centre (CANCEL / EXIT).
  - The diorama is not dimmed at all.
- **Alto's Adventure** (`DGsUk5Tr7fA`; `Ddk3Gza6sVo` 2:04–2:14):
  - The world is frosted: blurred and washed toward its own fog colour.
  - The current goals are centred in the middle of the screen. HOME / RESTART sit in a dark drawer on the left, the one panel in the whole set and the least graceful element.
  - Resume runs a "1, 2, Go!" countdown, because the run is moving.
- **Alto's Odyssey** (`Vm9JTSOixc0`, 3:25–3:44, iPhone):
  - The world is heavily blurred in its own sunset colours. Small centred lines of text and three stars, with no box.
- **Journey** (`jU4deOs21AA`, pause screens):
  - Pausing turns into slow dissolves through scenery of the current area, with a tiny JOURNEY wordmark bottom-right.
  - The pause is a place to look at, not a list.
- **Sky: Children of the Light** (`6q8V3iv40z0`, 5:22–5:50, iPad):
  - The menu is one row of glyphs with small words (Home, Invite, Graphics…) laid over the undimmed world.
  - The return-home confirm is centred: a gate glyph, one line of text, then ✕ and ✓ glyphs.
- **Old Man's Journey** (`W7BB9B6DuYs`, 3:53–3:58):
  - The scene stays put under a night-blue wash.
  - Three outlined circle glyphs (✕, sound, exit), **no words at all**.
- **Gris** (`gQhlkdXN7rI`, 0:54, 3:09):
  - The menu is concentric thin rings around the centred word GRIS, with options as small nodes on the rings, over the painted sky.
  - Settings open as one node on a ring, on black.
- **Florence** (`g4RhetLI6kM`): no pause screen. During play there is one small outlined home glyph, top-right, and nothing else.
- **Mini Metro** (`Nn2_RkEiAwM`): pause is a time control, a clock with ⏸ / ▶ / ⏩ glyphs at the edge. The map simply stops, with no overlay.
- **Not observed:**
  - MV2 and MV3: the MV3 longplay (`XiJCBIP-t1U`, 0–10 min) never opens a menu, and no MV2 capture showed one.
  - Prune and Threes: only their in-play corner glyphs (a small circle; a "menu" tab) appear in `pBAcZ1RBX7Y` and `MdeQaBuN1aw`.
  - The conclusions below don't depend on these three.

## Mechanisms

**M1. No box: the words sit on the art.**
- *Observed:* MV1, Alto's Odyssey, Sky, OMJ, Gris. Only Alto's Adventure uses a panel, and it's its weakest frame.
- *Interpretation:* a card says "app menu". Type on the world says "this is still the game".

**M2. The world stays, veiled in its own colour.**
- *Observed:* OMJ's night-blue wash, Alto's blur toward its fog/sunset hue, MV1 untouched, Journey showing more of the world.
- *Interpretation:* the pause is a held breath inside the place. The tint is the palette's, never neutral grey.

**M3. One centred, symmetric axis.**
- *Observed:* MV1's question with a choice on each side; Sky's ✕ ✓ pair under a centred glyph; Gris's rings; Alto's centred goals.
- *Interpretation:* symmetry is calm. On a phone the centre column is also where either thumb lands.

**M4. Few choices, as glyphs with at most one small word.**
- *Observed:* MV1 two, OMJ three wordless, Sky one glyph row.
- *Note:* "Map" and "Restart" are ambiguous as glyphs alone, so they keep one word each. Resume is unambiguous as a play glyph.

**M5. Say where you are, quietly.**
- *Observed:* Journey's wordmark over its own scenery; Alto's current goals and level.
- *Interpretation:* the pause is a chance to name the place, without measuring you.

**M6. Confirm in the same voice.**
- *Observed:* MV1's "Leave this chapter?" and Sky's question use the same type as everything else. There's no red and no modal box.

**M7. Stillness that isn't a countdown.**
- *Observed:* Alto counts you back in because its world is moving. Mini Metro just stops time.
- *Interpretation:* Strata has no momentum to protect, so resuming should be instant.

## Hit list, prioritised

| # | Change | Benefit | Cost | Trade-off | Review | Status |
|---|---|---|---|---|---|---|
| **H1** | **Centre it, drop the card.** A single centred column straight on the veil (M1, M3) | It reads as part of the world; on the thumb axis | Small | Loses the "unfolds from the button" link | Before/after frames | **Built** |
| **H2** | **A veil of the level's own sky**, thickest at the centre (74% → 26%), with a 3.5 px blur. Fade the HUD and coach out while paused (M2) | The stone rests visibly behind; the clue numbers stop competing with the words; the timer and ✕ vanish (nothing measures you) | Small | `backdrop-filter` over WebGL costs some GPU on older phones | Dawn + Starfall frames; Kellan on phone | **Built** |
| **H3** | **Resume as one large ring with a play glyph**, wordless; Restart and Map as smaller ringed glyphs with one word each, symmetric beneath (M3, M4) | Wordless where it can be; the primary action is unmistakable | Small | Two new glyphs to learn (↻ clockwise vs rewind's anticlockwise ↺ with a gem) | Does a new player find Map? | **Built** |
| **H4** | **Name the place:** chapter (small caps) over the level's name or number, in the chapter card's type, then a small crystal diamond (M5) | A quiet title card; it echoes the axes' crystals | Tiny | Repeats the HUD, but the HUD is hidden while paused | Frames | **Built** |
| **H5** | **"Start over?" in the same voice:** the restart ring fills with ink and its word changes; nothing else moves (M6) | Calm and clear, with a fixed button width so the row doesn't jump | Tiny | — | Confirm frame | **Built** |
| **H6** | **Settle in line by line:** each part rises 8 px with an 80 ms stagger, as the chapter card does; reduced motion just fades | Arrival feels authored | Tiny | — | Kellan on phone | **Built** |
| H7 | **The stone turns slowly while paused** (Journey's pause as a view; MV's photo mode) | Makes the pause a moment to admire the piece | Medium: camera code in `main.js` | It touches the lead's camera; the veil would need to thin | Prototype later | Proposed |
| H8 | **Sound toggles in the pause** as two glyphs (OMJ's sound glyph) | Fewer trips to How to play | Small | One more item | Ask Kellan | Proposed |

## Result

`docs/pause-frames/before-after.jpg` shows the panels in this order: Dawn before, Dawn after, Starfall "Start over?" before, Starfall "Start over?" after.

- **Purpose:** all functions still work. Verified in Playwright (390×844 touch, Dawn `chair` and Starfall `bunny`):
  - the Resume ring, a tap off the buttons, and Escape all close the pause;
  - Restart asks "Start over?" and then restarts;
  - Map opens the map;
  - no pageerrors; `npm test` passes.
- **Execution:**
  - The pause now reads as a still moment on one axis. The stone stays visible as a soft shape in its own light, closer to Alto's frost and OMJ's wash than to a dropdown.
  - The dark palette holds: white ink on the Starfall veil.
  - My judgement, not tested with players: the ring and glyph weights could be a touch lighter on a real Retina screen.
- **Not checked:**
  - a lesson (Map hidden, so Restart sits alone and centred);
  - Safari's `backdrop-filter` cost on an older iPhone;
  - real-device feel.

## Validation limits

- The reference footage is third-party captures: some were tablets, one had a streamer overlay. Timings are ±1 s.
- MV2, MV3, Prune and Threes pause screens were not seen (see above).
- No player testing. "Calmer" is my reading of the frames.
