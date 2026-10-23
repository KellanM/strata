# FTUE study: a title and first minute that relax you (2026-10-22)

## Brief

Kellan: "We need to focus on making the title screen as relaxing as possible. What are the core emotions we're trying to elicit with this game? What references do it the best? And what can we take from their structure to make this title screen / FTUE experience better?"

The scope is research and proposals only. Nothing gets built until Kellan picks.

Fixed constraints (approved earlier):
- North star: Journey and Monument Valley, then Shadow of the Colossus. Beautiful but minimal, wordless where possible.
- The story is concept A: long ago the Gloam pulled the stars and moon from the sky, the stars fell as meteors, and the ending is triumphant (`story-study.md`).
- The title is a night sky with the carved logo stone. It pans down to the map's horizon, and the title and map are one page (`map-study.md`).
- The 12 lessons teach the objective first (`tutorial-study.md`, four passes). Their wording was tuned against real confusion, so don't throw it away lightly.

## The emotions

A proposal for Kellan to confirm or change. These are my reading of the north star and the story, not research findings.

| | Emotion | What it means in Strata | Where it comes from |
|---|---|---|---|
| 1 | **Stillness** | Nothing is asked of you, and nothing is ticking. The screen breathes. | MV / Alto Zen: "strip out anything that made it feel like a traditional game" (Eli Cymet, Team Alto) |
| 2 | **Quiet curiosity** | Something is hidden in this stone. Archaeology: patient uncovering, not a puzzle exam. | The core verb (peel, find the shape) and Kellan's "archeology mixed with pokemon" |
| 3 | **Wonder at scale** | A small light under a very big sky. You are tiny, and the world is old. | Journey, Shadow of the Colossus |
| 4 | **Hope / restoration** | Every stone you open gives something back to the dark world (a star). | Concept A's triumphant arc. Journey's emotional arc is planned like a three-act film (Jenova Chen, WhatCulture interview) |

For the **first minute** the order matters: stillness → curiosity → one small act → wonder as its reward. Hope is planted there but pays off over the game.

## Baseline: Strata's fresh-save opening today

`docs/ftue-frames/strata-baseline.jpg`; capture script `shots/ftue-baseline.mjs` (390×844 Chromium, fresh localStorage).

What the frames show:
- **0–1.2 s:** dark-indigo title, STRATA, and the logo stone. The corner carves at 0.7 s (frame 2), before the eye has settled.
- **Then:** stars fade in, "SWIPE UP" with a nudging chevron, and a faint subtitle.
- **Tap +0.2–0.6 s:** the night slides away into a **blank pink haze**. One frame has only "SWIPE UP" at its top edge, and the next is pink with a ghost of the coach card.
- **Tap +1.3 s on:** lesson 1 is a **bright aqua room**: a different world from the night you were just in. On screen at once:
  - the menu button;
  - "LESSON 1 OF 12 · 0:00" with a **running timer**;
  - progress dots;
  - a two-sentence instruction card with SKIP;
  - the CHISEL / MARK toggle.

Against the emotions:
- The **timer** and "1 OF 12" are demand signals: you're being measured, and there's homework.
- The palette jump and pink gap **break the continuity** the title built.
- The first words you read are an instruction, before anything has made you curious.
- Nothing connects the night sky to the stone, so the story's hook (the stars are missing) is invisible.

## References inspected

I pulled frames from no-commentary longplays at 1 frame per 4 s. The sheets are in `docs/ftue-frames/`. All observations are silent: I didn't hear the audio.

- **Journey** (PS4), `bkL94nKSd2M`, 0–4:00:
  - 0:24–0:36: black, then grey, then white haze. About 12 s of nothing but light emerging.
  - 0:40–1:04: the camera glides over dunes, past the sun on a ridge, then a field of grave markers.
  - 1:08–1:12: a streak falls from the sky. The traveller arrives as a falling light.
  - 1:20: the traveller sits up in close-up.
  - 1:28 on: free walking toward a crest. At 1:40 a faint control glyph appears, top-left.
  - **2:12–2:24: the "JOURNEY" title fades in, only after the player has climbed the first dune.**
  - 3:44: a ghost controller glyph shows the next verb at the moment it's needed.
- **Monument Valley 1**, `apjRG7kvL5Y` (this capture starts at the prologue):
  - 0:00–0:16: a tiny dark diorama, Ida, one crank to turn.
  - **0:20–0:28: the title draws itself from fragments over a dawn mountain, with the solved prologue still in frame.** It holds about 15 s.
  - Then a chapter card ("in which Ida embarks on a quest for forgiveness") and the first garden.
- **Monument Valley 2**, `tffHa8tcmSE`:
  - 0:20: a headphones card.
  - 0:32–0:36: the first scene opens as an iris from a small disc in the dark.
  - 0:40–1:08: a one-move prologue on a staircase, the same form as MV1's.
  - **1:12–1:32: the title is drawn line by line** (a geometric V) over an aurora and mountains. Then a quiet tap ring appears.
  - 1:48: the chapter card.
- **Sky: Children of the Light** (iOS), `DZ6JJwpsCLg`:
  - 0:00: a single line, **"Wake up, child. Bring our lost stars home."**
  - 0:12: the child rises from a crouch in a dark meadow, lit only by their own candle.
  - 0:16–0:24: a **ghost hand** demonstrates the drag. There's no paragraph of text.
  - 1:16–1:28: a stone gate, a white-out, then the first vista: a far castle in mist.
- **Flower** (PS), `5F8PFeL-bgY`:
  - The title is a **place**: a dim grey apartment window with "flower" written small in the corner, and one potted flower glowing (0:20–0:28).
  - Entering it, the grey city dissolves into a sunlit field (1:12). The first act is one petal on the wind.
- **Alto's Odyssey / Collection** (PC), `xv-yzGb6S6M`:
  - After the logo, play starts at once (0:08). The only UI is a distance figure, top-right, small and pale.
  - This capture doesn't show the mobile title screen, so nothing below depends on Alto's title.

Practitioner sources read:
- **Jenova Chen:** "music is the most effective and powerful medium that can create emotion"; prototyping of Journey's emotional arc began with the music (Game Developer, *Designing a new emotional experience in Journey*). Also: Journey's experience is planned as an emotional arc like a three-act film (WhatCulture interview).
- **Eli Cymet, Team Alto** (The Sweet Setup Q&A):
  - "We wanted to strip out anything that made it feel like a traditional game … give players a mode where they could relax in a truly carefree environment."
  - "the Alto series is much more about capturing a feeling."
  - Sounds have "a musical quality that is meant to make players feel that even simple actions are a little magical."
  - "Subtle cello variations in the game's opening title screen."
- **Nomada (Gris), Adrián Cuevas** (Gamereactor): they didn't want to explain the story completely; they wanted players to *feel* what Gris feels.
- **Ken Wong (Monument Valley):** the opening screen needs a big, beautiful visual to win over skeptical players. Levels are tested on outsiders with no hints, and iterated from what is observed (InVision / Treehouse profile, as summarised in search results; the InVision page now redirects and couldn't be read in full).

Not accessed: Chen's GDC 2013 video (only the summary), the MV1 first-launch screen before its prologue, and any audio. Sound claims are from interviews, not heard.

## Mechanisms

**M1. Play first, then the title as the reward.**
- *Observed:* MV1 (title at 0:20, after the prologue's one move), MV2 (1:12, after the prologue), Journey (2:12, on cresting the first dune).
- *Interpretation:* the name lands as a payoff for a small act, not a gate before it. You've already touched the world, so the title feels like arrival, not a menu.
- *Fails when:* the first act needs explaining. All three firsts are one obvious verb.

**M2. Emergence from one colour, slowly.**
- *Observed:* Journey's ~12 s from black through grey to white haze; MV2's iris from a dark disc; Flower's single lit pot in a grey room.
- *Interpretation:* the eye settles before anything asks for attention, and one light in the dark tells you where to look without words.

**M3. One small light under a vast sky.**
- *Observed:* Sky's child lit only by their own candle; Journey's traveller tiny under the dune and sun; Flower's single flower.
- *Interpretation:* scale makes wonder. The light gives the player a self to care about.

**M4. Teach the verb with a ghost gesture at the moment of need.**
- *Observed:* Sky's ghost hand (0:16–0:24); Journey's faint glyph (1:40, 3:44). No sentence of instructions appears in any of the openings.
- *Caution:* Strata's tutorial passes found real confusion about the *objective*, which a gesture alone may not teach (`tutorial-study.md`, second pass). The proposal is to delay and shorten the words, not delete them.

**M5. The lore in one line, or none.**
- *Observed:* Sky's single line names the whole game's purpose. Journey's falling streak shows the traveller came from the sky, without a word.
- *Note:* Sky's line is close to our story (lost stars brought home). Strata should *show* rather than echo that sentence, or we'll read as derivative.

**M6. Nothing measures you.**
- *Observed:* none of the openings shows a timer, a counter, or "1 of N". Alto's one figure is small and pale.
- *Practitioner:* Team Alto removed "anything that made it feel like a traditional game" for relaxation.

**M7. Sound sets the state first.**
- *Observed:* MV2's headphones card.
- *Practitioner:* Chen began from music; Alto's title has its own cello variations.
- *Not verified by ear.*

## Proposals for Strata, prioritised

Each row gives the change, its benefit, its cost, the trade-off, and how we'd judge it.

| # | Change | Benefit | Cost | Trade-off | Review |
|---|---|---|---|---|---|
| **P1** | **Quiet the first lessons' HUD.** On a fresh save, hide the timer, "LESSON 1 OF 12" and the MARK toggle until the lesson that teaches marking; show the dots only. | Removes the "being measured" signal from minute one (M6). | Small | Speed-runners lose the lesson timer. It can return after the tutorial. | Side-by-side frames; Kellan on phone |
| **P2** | **Keep the night into lesson 1.** The first lesson plays under the title's own night sky, with the stone lit by the lantern glow, instead of the aqua palette. No pink gap: the tap pulls the camera toward the logo stone, and the lesson stone is there. | Continuity: the place you were in is the place you play (M2, M3). | Medium | Later lessons can move into dawn colours, so the 12 lessons become a sunrise. | Frame sequence across the tap; check for a pink or blank frame |
| **P3** | **The title as reward (play first).** A fresh save opens on dark, slowly (~3 s): one lit stone, no wordmark, no "swipe up". A ghost fingertip pulses on one plain cube. You tap; it breaks. A mote of light rises from it into the sky and becomes the first star. Only then does STRATA draw itself in, the stars come out, and the lessons begin. Returning players keep today's instant title. | The strongest pattern in the references (M1). It plants the whole story wordlessly in ~20 s (M5): the stones hold the sky's lost light. | Medium–large: a new boot path; the first lesson becomes this one-tap stone | It postpones the name and the swipe-to-map for new players by ~15 s. | Prototype page first (`proto/ftue.html`), filmed beside the baseline |
| **P4** | **Slow the title's first seconds for everyone.** The carve moves from 0.7 s to after the sky has settled (~2 s). The "swipe up" prompt's breathing (`title-breathe`, 2.6 s) slows to about a 5–6 s cycle, near a slow breath, and it waits longer before appearing. | The first thing you see is calm, not an event (M2). | Tiny | It feels slightly slower on every launch. Keep the carve skippable by tapping. | Kellan on phone |
| **P5** | **Words later and shorter.** Lesson 1's two sentences become a ghost tap on a plain cube first. The sentence appears only if nothing is tapped in ~4 s, and stays one line. | Curiosity before instruction (M4). | Small | It risks the old objective confusion, so keep the sentence; just delay it. | Next playtest: does a new player tap within 5 s? |
| **P6** | **A headphones glyph** on the very first launch, a second long, no text. | Invites the listening state (M7). | Tiny | One more beat before play. | Kellan |

My recommendation: **P1 + P4 now** (cheap, low risk), and **P3 + P2 as one prototype** to judge on the phone before touching the real boot path. P3 is where the references agree most, and it's also where our story lives.

## Validation limits

- Frame sheets at 1 frame per 4 s miss fast transitions. Journey's title fade and MV's line-draw timings are ±4 s.
- No audio was heard.
- The MV1 capture starts at the prologue, not at a cold launch.
- The emotions table is my proposal, not a finding.
- Nothing here has been tested with players. Whether P3's ~15 s delay feels relaxing or slow is exactly what the prototype is for.
