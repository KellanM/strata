# Motion study: what makes motion feel premium in calm mobile games

Date: 2026-10-18. This is a research-only study; no code was changed. Read it, `docs/motion.md` (the token system) and `docs/game-loop-study.md` (ustwo design practice, sound and star rating) before repeating any of this research.

## Brief

Strata's motion should feel premium and satisfying while staying calm. The question is what the best calm and premium mobile games do with transitions, level intros and outros, map motion, UI feedback, easing, timing, sound and haptics, and what they choose not to animate. The output is a short, prioritised list of changes mapped onto the motion tokens in `public/js/motion.js`.

**Criteria for this brief.** These are mine, not a universal score.
1. **Legibility.** Every motion says where something came from or what changed.
2. **Hierarchy.** The size of a transition matches how rare and important the moment is.
3. **One lead.** At any moment one thing is clearly the subject.
4. **Agreement.** Picture, sound and haptic land on the same frame.
5. **Restraint.** Nothing moves without a reason, and frequent actions stay cheap.

## Baseline (from the code at commit 889d783)

| Moment | What Strata does now | Timing |
|---|---|---|
| Map → level | The tapped stone pops (`tap-pop`, pop curve). A circular clip-path "portal" opens in the level's sky colours. The map scales to 1.6 and fades. The level is built behind the veil, the veil fades and the block assembles. | Portal 0.42 s (inOut). Level built at 0.46 s. Veil fade 0.45 s. Assembly 0.7 s. About 1.6 s in total. |
| Level → map | The map pulls back from the stone with `arriving` → `settling`. | `DUR.scene` 0.7 s with glide easing. |
| Level → next level (`goNext`) | `startPuzzle` runs directly. There is no cover: the palette swaps and the new block assembles over the old scene. | 0.7 s assembly. |
| Level intro | Cubes drop in layer by layer, a ripple runs through the block, the airy sweep climbs per layer and a low settle note plays. Taps are ignored until the block is whole. | 0.7 s (`INTRO_TIME`). |
| Chisel | The cube breaks into 8 pieces plus shards, a ripple runs, a 12 ms buzz fires and a chisel note plays. | About 0.5 s. |
| Win | A 0.34 s wind-up, a whirl of 4π decaying into a turntable that never stops (`SHOW_SPIN`), a leap that lands at 1.0 s, 9 confetti bursts, a shockwave of rings, a white flash, a rays boost to 2.6, title letters from 1.1 s, a score count-up from 0.1 to 1.4 s, gems from 2.3 s every 0.72 s, then the action buttons. | About 4–4.5 s before the buttons appear. |
| Win haptic | `buzz([12, 50, 30, 400, 60])`. On Android the last pulse fires at about 0.49 s. iOS collapses the pattern to one tick. | Landing (ripple) is at 1.0 s. |
| Buttons and stones | `:active` scale 0.9 / 0.92, released on `cubic-bezier(.2,.9,.3,1.4)`, which overshoots. | 0.25 / 0.35 s. |
| Scroll reveal | `.rv`: rise 16 px, scale 0.9 → 1 on `EASE.pop` (overshoot). Stagger is 35 ms, capped at 0.4 s, in screen order from the top. | `DUR.slow` 0.5 s. |
| Chapter card | Plays once per chapter, over the level that has already started. | 2.8 s. |

## Sources inspected

### Gameplay footage

I watched these frame by frame. Frames were pulled from YouTube in a browser and laid out as contact sheets at 0.25–1 s steps. I didn't listen to the audio.

- **Monument Valley 2**, a no-commentary walkthrough of chapters 1–4 (https://www.youtube.com/watch?v=CDpvwdr3-C0).
  - *60–80 s, menu to chapter 1:*
    - 60–73 s: the chapter vignette fills in, with a cube appearing in its frame.
    - 74–76 s: fade to black (about 1 s fade, 1–2 s held).
    - 77–80 s: a chapter card on a diagonal field of colour, held about 4 s.
    - 81–82 s: the card dissolves over a level that is already built. The structure doesn't assemble.
  - *176–207 s, end of a level:*
    - 186–196 s: the architecture dismantles itself in separate stages. Each piece sinks into the ground, then there is a pause before the next, about every 1.5–2 s.
    - 196–199 s: the goal plate turns and rises.
    - 199–203 s: a still hold on a white field.
    - 203.0–203.8 s: fade to black, held about 1.3 s.
    - 205.3–207 s: the next scene fades up out of the dark. This could be the walkthrough's own edit, so treat it as provisional.
- **Monument Valley 3**, a no-commentary walkthrough of chapters 1–3 (https://www.youtube.com/watch?v=GEP7rWu1VdM).
  - *152–182 s, chapter select to level.* The best reference for Strata's portal.
    - 158–165 s: on a dark wall of windows, the next window's glyph is drawn line by line, then its art fills in. This is the unlock.
    - 167.8–169.5 s: the camera pushes into the tapped window, decelerating.
    - 169.5–170.8 s: the window's own diamond frame grows to fill the screen.
    - 170.8–175.1 s: concentric diamonds in the next chapter's palette expand from the centre, one after another, roughly 1.2 s per ring.
    - 175.1–176.4 s: white.
    - 176.4–177.7 s: the chapter card fades up from white.
    - About 182 s: the card dissolves into a level that is already built.
    - The shape of the iris is the game's own motif (the diamond / cube top), and its colours are the destination's.
  - *340–363 s, level to level:*
    - 340–358 s: a long still hold on the solved level.
    - 358.5–360 s: fade to a pale lavender drawn from the sky, not to black.
    - 360–362 s: the next level comes out of a misty white.
- **Assemble with Care**, the full game with no commentary (https://www.youtube.com/watch?v=EAXe6uy_aZA).
  - *339.5–348 s, completing the cassette recorder:*
    - 340.0–342.3 s: the finished object turns on its own to a front-on "hero" pose in about 1.5 s and stops.
    - 340.8–341.8 s: paper bands close from top and bottom, leaving a strip of the workbench behind the object.
    - About 341.5 s: the object's name appears above it, with a Continue button below.
    - 342.3–345.8 s: everything holds completely still until the player taps. There are no particles.
    - 345.8–346.5 s: the whole card cross-fades to paper.
    - 346.5–347.3 s: blank paper is held.
    - 347.3–347.8 s: the next story page fades in.
  - *Overview, 20–600 s:* every repair ends on the same framed, still card (220, 400, 580 s).
- **Threes!**, gameplay (https://www.youtube.com/watch?v=km0kdWhXd4A). I sampled it only as an overview. At the resolution I could get, I couldn't measure the timing of individual tile slides, so nothing below depends on it.

### Practitioner sources (read)

- **Apple WWDC 2018, *Designing Fluid Interfaces*** (https://developer.apple.com/videos/play/wwdc2018/803/), from the transcript:
  - "Everything needs to respond instantly."
  - "We recommend starting with 100% damping, or no overshoot."
  - "If the gesture that's driving the motion itself has momentum, then you should reward that momentum with a little bit of overshoot." Their Music example: a tap uses 100% damping, a swipe-dismiss uses 80%.
  - "Bounciness needs to be purposeful."
  - "Maintain spatial consistency… symmetric paths."
  - "Project momentum."
- **Apple HIG, Motion** (https://developer.apple.com/design/human-interface-guidelines/motion):
  - "Aim for brevity and precision in feedback animations."
  - "Generally avoid adding motion to UI interactions that occur frequently."
  - "Don't make people wait for an animation to complete… especially if they have to experience the animation more than once."
  - "Gratuitous or excessive animation can distract people."
- **Apple HIG, Playing haptics** (https://developer.apple.com/design/human-interface-guidelines/playing-haptics):
  - "Match the intensity and sharpness of a haptic with the intensity and sharpness of the animation it accompanies."
  - "Build a clear, causal relationship between each haptic and the action."
  - "Avoid overusing haptics… the best haptic experience is one that people may not be conscious of, but miss when it's turned off."
- **Material 3 motion tokens**, from the source of the token set (https://github.com/material-components/material-web, `tokens/versions/v0_192/_md-sys-motion.scss`):
  - emphasized-decelerate `(0.05, 0.7, 0.1, 1)`;
  - emphasized-accelerate `(0.3, 0, 0.8, 0.15)`;
  - durations from short 50–200 ms through medium 250–400 ms and long 450–600 ms to extra-long 700–1000 ms.
  - I use these as a calibration check on our numbers, not as a style to copy.
- **Threes "Threemails"**, the design email archive by Vollmer and Wohlwend (http://asherv.com/threes/threemails/). I read about the first 40%.
  - "Blocks spawning in through those bars. It's way more elegant than sliding from off screen."
  - "The game's definitely confusing without the slidey transitions."
  - "A swipe is a spectrum": the preview moves with the finger and only commits when the player confirms.
  - "Everything will be a little softer/squishier… It wants to be a little zen."
- **Rich Vreeland on Mini Metro** (https://designingsound.org/2016/02/18/the-programmed-music-of-mini-metro-interview-with-rich-vreeland-disasterpeace):
  - The update loop is treated "like a sequencer".
  - Clumped spawns should "fan out in a rhythmic way". This was prototyped in audio first, and the game was then set up to follow the music.
  - The arpeggio "will only honor so many interactions within a short time frame".
- **Vreeland on Mini Motorways** (https://www.gamedeveloper.com/design/turning-road-noise-into-music-mini-motorways): interactions "need to feel tactile and immediate", and many are "pitched to match the system's current musical state". Horns are "only as annoying as is necessary".
- **Ken Wong, GDC Europe 2014, *Designing Monument Valley: Less Game, More Experience*** (https://www.gdcvault.com/play/1021380/Designing-Monument-Valley-Less). I read only the session description: "trade challenging puzzles for an aesthetic journey… short but sublime". Wong's other claims are in `game-loop-study.md`.

### Not accessed, or only shallowly

- The GDC Vault video of Wong's "The Art of Monument Valley" (2015). The page hit a login wall.
- The Stafford Bawler interview (the site's certificate had expired).
- The A Sound Effect page on Todd Baker (blocked; his MV2 points are already in `game-loop-study.md`).
- The rest of the Threemails.
- Alba, Alto's Odyssey, Gris, A Monster's Expedition and Two Dots. I didn't watch footage of any of them, and searches found no practitioner writing about their motion. They don't support any claim below.
- No MV1 footage.
- I didn't listen to any game audio. All pairing of sound and picture in the exemplars is inferred from interviews, not heard.
- I didn't run Strata itself. The baseline comes from reading the code.

## Mechanisms

C is a practitioner claim, O is observed evidence and I is my interpretation.

1. **Transitions are tiered by rarity.**
   - O: MV3 uses about 10 s for entering a chapter (167.8–177.7 s) and about 3 s for moving between levels (358.5–362 s).
   - O: AwC's completion card takes about 2 s, then waits for the player.
   - I: Ceremony is spent on rare moments, and frequent moments are short. Strata uses one 1.6 s dive for every level, and there is no ceremony at all on Next.
2. **The cover uses the destination's colour and the game's own shape.**
   - O: MV3's iris is a diamond in the next chapter's palette.
   - O: its level-to-level fade goes to a pale sky tint, not black.
   - C: Treacher and Baker designed the colour of each fade-out (see `game-loop-study.md`).
   - I: The transition previews where you are going. Strata already uses the destination's sky. The circle is the only generic part.
3. **The level arrives already built; the outro is where the architecture performs.**
   - O: In MV2 at 81–82 s and MV3 at about 182 s, the chapter card dissolves over a finished level.
   - O: MV2's outro dismantles the level in stages over about 10 s (186–196 s).
   - I: Strata's assembly is short (0.7 s) and carries meaning: it shows the block as "stone". It should stay, but it must not swallow input. See HIG "don't make people wait" and item 6.
4. **The reward is a still, framed presentation, not a pile of effects.**
   - O: AwC turns the object to a hero pose and then holds it completely still, with no particles (340–345.8 s).
   - O: MV2 holds a still frame for about 4 s after the solve (199–203 s).
   - I: The pause is the "premium" part. Strata's finale stacks wind-up, whirl, leap, confetti, rings, flash, rays, letters, count-up and gems in the first 4 s, so no single beat leads.
5. **Overshoot is earned by momentum.**
   - C: Apple (WWDC 2018) says taps get 100% damping and gestures with momentum get a little bounce.
   - I: Strata overshoots on every tap (`.icon-btn`, `.map-node:active`, `tap-pop`) and on every revealed stone (`.rv` uses pop). That spends the bounce where Apple says it reads as unearned.
6. **Feedback is instant, and repeated animations can be interrupted.**
   - C: Apple, in both WWDC and the HIG.
   - I: Strata answers the stone tap at once, which is good. But it ignores taps during the 0.7 s level assembly, which happens on every level.
7. **Sound and motion share a clock.**
   - C: Vreeland treats the update loop as a sequencer and fans clumped events out rhythmically.
   - C: Baker uses stings at phase completion (see `game-loop-study.md`).
   - I: Strata's audio already runs on a grid (72 BPM, `SIXTEENTH` 0.208 s, and the win bells start at 0.34 s, in step with the whirl). Its visual staggers don't follow that grid: gems are 0.72 s apart, while one beat is 0.833 s.
8. **Haptics match the animation's contact frames and are rare.**
   - C: Apple (HIG haptics).
   - I: Strata's win pattern ends at about 0.49 s, mid-leap. The landing is at 1.0 s.
9. **Restraint on frequent surfaces.**
   - C: Apple says to avoid motion on frequent interactions.
   - C: Vreeland caps how many interactions get sound.
   - I: The scroll reveal and the stone tap are Strata's most frequent motions, so they should be its quietest.
10. **Spatial continuity.**
    - C: Apple: symmetric paths, and each element has a consistent place.
    - O: AwC ends on a canonical pose of the object.
    - I: The solved object's last pose should be the pose it has on the map stone, so the pull-back reads as "it went there".

## Prioritised hit list for Strata

Each item lists the change, then its benefit, cost and the risk of over-animating, then how to review it. Throughout, "review" means comparing the change against the current version under the same conditions: slow motion ×4 plus the motion log with `mark()` at every step, a real phone, sound on, at normal speed afterwards. Judge the result by the criteria above, not by whether it is busier.

1. **Clear the finale and let one beat lead at a time.** Sequence it as:
   - wind-up and whirl, until the landing at 1.0 s;
   - a held beat of `DUR.hold` (see the token section);
   - the title;
   - the score;
   - the gems.
   For ordinary levels, cut confetti from 9 bursts to 2–3 thrown at the landing, and drop the white `#flash`. Keep the full confetti only for chapter ends and new bests.
   - *Benefit:* the reward reads as a ceremony, not as noise (mechanism 4). This is the biggest change in perceived quality for the least work.
   - *Cost:* S. It is timing constants in `win()` and `finale`.
   - *Risk:* this removes motion, so the risk is that it feels flat. Mitigate by keeping the rays boost and the landing ripple, the two effects that belong to the world.
   - *Review:* in slow motion, check that at each 0.25 s step you can name the one thing leading. Then compare the old and new versions side by side at normal speed on a phone.
2. **Settle the whirl on a hero pose and hold it still.** The whirl decays onto the angle the object shows on its map stone, instead of decaying into an endless `SHOW_SPIN` turntable. The player can still drag to turn it, which keeps Adrienne Law's "turn and look at any side". The pull-back to the map then starts from the same pose (mechanism 10).
   - *Benefit:* stillness and a continuous object across scenes, as in AwC (340–345.8 s).
   - *Cost:* S. Replace `SHOW_SPIN * s` with a damped approach to a target angle and use `EASE.out` timing. The thumbnail angle can come from `thumbs.js`.
   - *Risk:* very low.
   - *Review:* hold the last win frame next to the map thumbnail. They should match in angle.
3. **Put a cover on Next.** `goNext` currently cuts. Route it through the veil: the next level's sky closes over the old one, either centred on the object or as a full fade in its sky colour (MV3, 358.5–362 s). The new level builds under the cover, and then the cover lifts. This also applies the "cover before you swap" rule from `docs/motion.md`.
   - *Benefit:* removes the only uncovered scene change. The colour previews the destination.
   - *Cost:* S. Generalise `diveInto` to take a point or no element.
   - *Risk:* it adds about 0.5 s to a frequent path. Keep it under 1 s in total.
   - *Review:* watch frame by frame in slow motion for any frame where the old palette and the new block show together.
4. **Make taps press without overshoot, and spend the bounce only on momentum.**
   - `.icon-btn` and `.map-node`: press to 0.94 with `DUR.quick` and `EASE.out`, and release with `EASE.out`, no overshoot.
   - `.rv` scale: change `EASE.pop` to `EASE.out`.
   - Keep `pop` only for single items that appear: peel handles, gems, the tapped stone's acknowledgement (at a smaller amplitude).
   - Add overshoot to momentum gestures: projecting a peel release with velocity, and an orbit throw (mechanism 5).
   - *Benefit:* a calmer and more expensive feel on the most frequent surfaces, with bounce that means something.
   - *Cost:* S, mostly CSS.
   - *Risk:* none from over-animation. This only takes motion away.
   - *Review:* scroll the map in slow motion. No stone should visibly grow past its final size.
5. **Make the level assembly interruptible.** A tap during the 0.7 s intro should finish the assembly at once (snap `uIntro`) and be accepted, instead of being dropped at `if (now() < game.introEnd) return`.
   - *Benefit:* respects the HIG point about animations seen many times, and Strata replays this on every level.
   - *Cost:* S.
   - *Risk:* none.
   - *Review:* tap rapidly right after the dive. No tap should be lost, and the motion log should show "intro skipped".
6. **Put the win haptic on the contact frames.** Replace the single pattern with discrete pulses on the frames that matter:
   - a light pulse at the wind-up release (0.34 s);
   - a heavier pulse at the landing (1.0 s), via `after()` so slow motion keeps it in sync;
   - one light pulse per gem.

   On iOS only one tick can fire, and only inside a trusted touch, so keep that tick on the final chisel, which is already the case. Don't fake the others.
   - *Benefit:* the picture and the touch agree (mechanism 8).
   - *Cost:* S.
   - *Risk:* buzzing too much. Allow at most one pulse per visual beat.
   - *Review:* on Android, in slow motion, watch the motion log and feel whether the landing pulse arrives with the ripple.
7. **Put staggers on the musical grid.**
   - Gems arrive on beats: 0.833 s apart at 72 BPM, starting on a beat counted from the whirl downbeat, instead of every 0.72 s.
   - The title's letter stagger and the reveal cascade use multiples of a sixteenth (or a 32nd, 0.104 s, for letters, which are fine at 55 ms; leave those alone if the result sounds no better).
   - *Benefit:* the motion and the bells feel like one gesture (mechanism 7, Vreeland).
   - *Cost:* S. Export `BEAT` from audio.js, or put it in motion.js.
   - *Risk:* rigid, metronomic motion. Apply it only where a sound also plays.
   - *Review:* this needs sound on at normal speed, because slow motion doesn't slow audio. Compare by ear.
8. **Give the portal the game's shape, in layers.** Replace `circle()` with a rhombus `polygon()`: the top face of an isometric cube, which is the stone's own shape. Open it as two layers, first `glow` and then the sky gradient, offset by about 0.08 s, so it reads as a doorway with depth. MV3 does this with nested diamonds at 170.8–175.1 s. Keep the total under 0.6 s, because this plays on every level.
   - *Benefit:* the cover becomes distinctively Strata (mechanism 2).
   - *Cost:* S–M. It needs a clip-path polygon sized from the point, with a fallback where clip-path is slow.
   - *Risk:* more than two layers starts to look like a screensaver. Two is the limit.
   - *Review:* step through it in slow motion, then judge at normal speed whether it still reads as one motion.
9. **Tier the transitions: a chapter's first level gets a ceremony.** The first dive into a new chapter goes:
   - the portal;
   - a held chapter card, coloured with the chapter's palette, about 2.5 s, shown *before* the block appears rather than over a level that has already started;
   - the card dissolves and the block assembles.

   Every other level keeps the short dive. This also moves `maybeChapterCard` (now an overlay after 60 ms) into the dive sequence.
   - *Benefit:* a hierarchy of moments, as MV3 does (about 10 s per chapter against about 3 s per level), and the card stops competing with the assembly.
   - *Cost:* M.
   - *Risk:* a long wait. Make it tap-to-skip, as now.
   - *Review:* use the motion log to check the card's hold, and that the assembly starts only after it.
10. **Quiet the scroll reveal.**
    - Reveal each stone once per session: returning by pull-back should not replay the cascade.
    - Order the first cascade along the path, outward from the current stone, instead of by screen position from the top.
    - Shorten the rise from 16 px to about 8 px.
    - *Benefit:* the map's most frequent motion becomes almost invisible, while the current stone still leads (mechanisms 9 and 3).
    - *Cost:* S. Keep a seen-set in `reveal()` and add a sort key.
    - *Risk:* none.
    - *Review:* open the map three times in a row. Only the first opening should cascade.

Suggested order: 4, 5 and 2 (they only remove or settle motion and are low risk), then 1, 3, 6, 7, then 8 and 9.

**Deliberately not proposed.** No idle motion on UI chrome. No screen shake: "juice" advice is for action games and conflicts with the calm brief. No sound on scroll reveal. No extra particles anywhere.

## Proposed changes to the token set

- **Add `DUR.hold` = 0.6 s.** This is a beat where nothing moves, used between finale beats, after a cover is fully opaque and before a chapter card fades. In the exemplars the holds are things being designed (AwC 342.3–345.8 s, MV2 199–203 s, MV3 175.1–176.4 s), so a hold should be named rather than buried in `after()` constants.
- **Add `DUR.ceremony` = 1.2 s** for rare, once-per-chapter moves: the chapter card fades, a chapter-end transformation. This keeps `scene` (0.7 s) for frequent screen changes. Material's long and extra-long range (450–1000 ms) supports both durations.
- **Add `EASE.fade` = `[0.4, 0, 0.6, 1]`**, a gentle symmetric curve for opacity-only and colour dissolves. Our `out` curve makes fades snap up in the first frames, and some old CSS still uses the browser's plain `ease`.
- **Add `BEAT` = 60 / 72 s, with `BEAT / 4` as a sixteenth**, exported from one place shared with audio.js. Staggers that come with a sound use it (item 7).
- **Keep `pop`, but write its budget into the motion.md rules.** Use it only for a single small item that appears, never for a tap's press or release, and never for a list or cascade. Momentum gestures get overshoot from a spring or velocity projection, not from `pop`.
- **No change to `out` / `in` / `inOut` / `glide`, and no change to `quick` / `base` / `slow` / `scene`.** They are consistent with Material's emphasized-decelerate/accelerate and duration bands. `out` (0.2, 0.8, 0.2, 1) is a little less front-loaded than Material's emphasized-decelerate (0.05, 0.7, 0.1, 1), which suits a calm game.

## Validation limits and open questions

- No experiments were run, as the brief was research only. Each item above is a hypothesis, to be kept or rejected after the slow-motion and on-phone comparisons described with it.
- The footage was inspected without sound, at YouTube resolution, through third-party walkthroughs. Fades to black may be edits by the uploader (MV2 at 203–205 s). The MV3 and AwC sequences are continuous and look like the game itself.
- Nothing has been tested with players. "Premium" is my reading of the exemplars against the criteria above.
- Open question: whether 2–3 confetti bursts are still too many, and whether removing them makes ordinary levels feel unrewarding. This should be decided on a phone, with sound, by the user.
