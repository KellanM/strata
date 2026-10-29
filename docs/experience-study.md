# Experience study: the whole game, end to end (2026-10-29)

## Brief

Kellan asked for a game-wide creative study of Strata, of the same kind as `settings-study.md` and `finds-study.md`: a baseline of every screen, references seen in their own games, mechanisms, a prioritised hit list, and in-game mockups of the top few.

This is research and mockups only. No game code was changed, and nothing was committed.

Fixed constraints (Kellan's decisions; not re-opened here):
- North star: Monument Valley and Journey. Calm, near-wordless, soft gradients, one quiet line of type.
- **Launch:** black while loading, then the chalk splash, black, a breath, the geode. The swoop goes to the current stone.
- **Map:** direction B, full-length worlds under cloud, gold shrines. The Menu and Finds rings carry labels.
- **Menu and Finds:** the menu is a carousel washed in the map's sky. Finds folds unreached worlds into "Still ahead".
- **Stars:** three stars plus a rolling score, which Kellan asked for (`game-loop-study.md`). Stars are for a clean hand, never for speed.
- **Lessons and story:** the Learn stone holds the lessons. Story Concept A, with the Gloam.
- **Money:** no monetization in v1.

Prior studies were read for what they decided and what they left open. Nothing here repeats one of them. Where a finding overlaps an open item, the item is named.

## Baseline

All frames are headless Chromium at 390×844, DPR 2, against the dev server, from saves seeded at 0, 30, 31, 38, 70 and 182 stones. The sheets are in `experience-frames/`.

| Sheet | What it shows |
|---|---|
| `baseline-1-launch.jpg` | First and returning launches |
| `baseline-2-map.jpg` | The map at 30, 70 and 182 stones |
| `baseline-3-play.jpg` | Play, lessons, pause and a shrine level |
| `baseline-4-reward.jpg` | Wins, the move to the next level, a chapter end and the Drift |
| `baseline-5-menus.jpg` | Menu carousel and Finds |

Read durations from the code, not from the frames. Screenshots slow headless timers, so frame stamps run late.

### 1. Launch: black, chalk splash, geode, STRATA in stars

The launch runs black (0.4 s), then the chalk splash (1.2–3.6 s), black again (4.4 s) and the geode (5.2 s). A tap opens the stone. The night, with STRATA written in stars, follows in about 1.5 s.

Strong: the sequence is calm and wordless, and every step is a fade, with no cuts.

Weak:
- **"Tap to begin" is the only instruction, and it is the least visible thing on the screen.** It is 10 px caps tracked .42 em, breathing, at the foot of the pink horizon (`L0-descent-3600`).
- **The first map a new player sees opens with a quantity: "182 stones to uncover" (`T-0map`).** Mini Metro's Churchman cut meta counts from the first screen, and calls UI flow "the things you choose to omit".

On a return, the swoop reaches the map in about 0.6 s. The swoop study covered it, and nothing new turned up.

### 2. Map

Strong: each stone becomes its object, every world has its own sky, the shrines glow gold, and the clouds part (`C-2tomap-*`).

Weak:
1. **Type is below a readable floor.** The ring labels are 9.5 px and the stone meta is 9.5 px. The stone numbers and the world numerals and counts are 10 px.
2. **Stars are not gems.** Under each stone's name the map draws three **stars** (`map.js` `STAR`), and world and shrine counts read "40 / 48 ★" and "10 / 12 ★". The win screen, Finds and the Rules page all use **gold diamonds**, and Rules says "◆◆◆". It is the same reward under two symbols (crop in `mockup-3-map-gems.jpg`).
3. **Two counts with two verbs.** The map says "30 of 182 **uncovered**". Finds says "31 of 197 **found**" plus "◆ 77 / 591".
4. **The scroll runs past the Drift into empty night** (`M30-6end`, `M999-6end`). The page's end is a blank screen.
5. **Finishing every stone changes nothing** (`M999-0arrive`). With 182 of 182 the map simply arrives at the Drift. The story's ending is still unbuilt (`story-study.md`).

### 3. Level play

Frame by frame:
- **Dive:** about 0.15 s into a radial glow of the level's sky (`P30-a-dive-150`).
- **Chisel:** a white flash, eight shrinking fragments and rising ash, then the hole (`c-chisel-60/220/620`).
- **Mark:** turns the cube pink.
- **Slip:** a red cube, a ✕ after the timer, and the rewind ring top-right (`f-slip-*`).
- **Peel:** works by the ◆ handles beside the block.
- **Pause:** centred rings over a sky veil.

Strong: the stone, the light and the chisel's particles are already the best-made part of the game.

Weak:
1. **A finished row looks the same as an unfinished one.** No clue changes when its line is done: no satisfied-line state exists in `main.js`, `cubes.js` or `puzzle.js`. On a 6×6×6 block of numbers this is the main thing a player has to track in their head. `game-loop-study.md` #10 ("make state changes loud") is still open.
2. **The level's words sit in a cream card** (`#coach`: a filled, blurred, rounded panel). It is the only filled card left in play. Everything else is type on the sky or a hairline ring. On a dark world it becomes a dark slab (`X-leveldark-before`).
3. **The title block uses two inks.** The level name takes the palette's ink, e.g. `rgb(82,110,110)` in Moss Garden. The meta line underneath keeps the fixed purple `rgba(74,61,99,.62)` on every sky (computed styles).
4. **A clock ticks in the HUD** ("MOSS GARDEN · 0:13"). The Rules page meanwhile says "No rush", and stars never depend on time. The score's "calm pace" bonus does use time.
5. **The stuck-row glow only exists on levels 1–3** (`nudgeAfter`). Idle for 27 s on level 31, nothing happens (`i-idle27`). That is consistent with the design, and listed only so it is not mistaken for a bug.
6. **Two things can arrive at once at the start of a world:** the chapter card (2.8 s) and then the coach line in the same seconds (`C-3newch-900` then `-1600`). That breaks motion.md's "one thing leads".

### 4. Lessons (Learn)

There are 11 lessons, each an everyday object named on reveal (Heart, Pine Tree, Sea Chest, Lantern, Candle, Cat, Crown, Tortoise, Throne…; `T-*`). They are clean, and the words are in plain language.

Weak:
- The progress shows twice: "LESSON 3 OF 11" and a row of diamonds.
- Every lesson's words also sit in the cream card with a "skip".

### 5. Win, result, next

The finale runs as follows (`main.js` `win()`, `showResult()`, from code):

| Time | What happens |
|---|---|
| 0 | Flash, confetti and a ring |
| 0.3 s | The reveal |
| 1.0 s | The landing, with a buzz |
| 1.1 s | The name, letter by letter, and its one-line story |
| 1.8 s | The score counts up for 1.3 s, ticking up the scale |
| 4.1 s, then one per beat (0.83 s) | Each gem |
| about 6.0 s | Map, Replay and Next fade in (0.6 s) |

A tap skips to the end, but nothing on screen says so. Next washes through the next level's sky in 0.26 s plus 0.5 s, and the next level is up by about 0.3 s (`k-next-*`). That part is excellent: it is the "no cuts" Churchman describes.

Weak:
1. **The loudest type on the result is the score.** "1,260" in 120 px canvas type sits under the gems and outweighs the object's name, and the name is the reward. The one-line story ("She has slept in this rock since before the moss") is 13 px, the smallest text on the screen.
2. **The actions are three words and a pill** (`MAP · REPLAY · (NEXT)`, 12 px). That is a fourth button language, after the map's and pause's rings, the HUD's filled discs and the coach's card.
3. **About 6 s before Next can be tapped,** on every level, for a 3-gem solve.
4. **The HUD name changes to the object's name at the moment of the last chisel** (`$('#pz-name').textContent = g.shape.name`). It shows during the HUD's 0.5 s fade-out, over the still-white block (`j-win-100`). The answer appears as type before it appears as the object.
5. **The Drift's random blocks are "uncovered" like objects:** "YOU UNCOVERED / DRIFT 706" over a random lump (`D-drift-1win`).

### 6. Chapter end

When the last stone of a world is solved (`C-*`), Next goes to the map, and the next world's cloud parts with its key's chord. **The world just finished gets nothing.** Its stones are objects now, but there is no moment that says Moss Garden is whole. The next world's chapter card is the only ceremony, and it belongs to the world being entered.

### 7. Shrine level

The map's shrine is gold and has a bell. Inside, a gold card reads "✦ The Shrine of ✦ / Beacon Hills / Kept for those who earned its light." After that the level looks like any other, with the same cream card and HUD (`S-shrine-1enter-2600`). `map-study.md` already lists "the shrine treatment inside the level" as open.

### 8. Menu and Finds

Covered by their own studies. Seen here:
- The Touch page is the wordiest screen in the game: nine bold-term rows (`Q-menu-3touch`).
- Finds still shows unfound objects as dark blurs (`Q-finds-2mid`).
- The detail view puts its text at 15 px, the largest reading size anywhere, against the result screen's 13 px for the same story line.

### 9. Sound and haptics (from code; not heard or felt)

**Sound** (`audio.js`): a chord bed in each chapter's key.
- **Play:** the chisel is a dry chip plus a chord tone that climbs on fast runs. A slip is "a soft consonant thud, never a buzzer".
- **Map and shrine:** each map stone is a plucked string, and a shrine is three rising bells.
- **Win:** home, a bell run, then an add9 chord. Rewards duck the bed by 4 dB.
- **Score:** each score tick climbs the scale, and each gem is root, third or fifth.

**Haptics** (`buzz`):

| Event | Vibration |
|---|---|
| Chisel | 12 ms, every block |
| Mark | 8 ms |
| Protected tap | 4 ms |
| Undo | 6 ms |
| Peel | 6 ms |
| Slip | 30/40/30 |
| Win | 5 pulses, landing at 1.0 s |
| Each gem | 8 ms |

Three inconsistencies:
- A gem (8 ms) is **lighter** than a chisel (12 ms), which inverts the hierarchy.
- Ring buttons and map stones make a sound but give no haptic.
- The reward ducks only 4 dB, against the near-silence the references use (below).

## Inconsistencies across screens

| Dimension | What differs |
|---|---|
| Type sizes | Nine sizes below 16 px: 9, 9.5, 10, 10.5, 11, 12, 13, 14, 15. The same story line is 13 px on the result and 15 px in Finds. |
| Letter-spacing | .2, .24, .26, .3, .32, .42 and .5 em across labels of the same role. |
| Ink | Map, menu and HUD meta: fixed `#4a3d63` at .62. HUD name: palette ink. Finds head: `rgb(89,73,112)`. The win score has its own canvas ink. |
| Reward symbol | ★ on the map (SVG and text). ◆ on the result, in Finds and in Rules. |
| Count words | "uncovered" (map, result) against "found" (Finds). 182 against 197. |
| Buttons | Hairline rings with a label (map, pause, settings toggles). Filled blurred discs (HUD ≡ and rewind, Finds × and ‹). A text-and-pill row (result). A segmented pill (tools). A filled card (coach). `button.primary` (dev panel). |
| Close | Plain × (menu). × in a disc (Finds). ‹ in a disc (Finds detail). The Resume ring (map). A tap on Resume (pause). |
| Press motion | Rings scale to .92 with no overshoot. `.icon-btn` springs (`cubic-bezier(.2,.9,.3,1.4)`). The win letters overshoot (1.15). `motion.md` asks for press without overshoot. |
| Durations | Mostly hard-coded: .45, .46, .5, .6, .7, .9 s and 2.8 s. The `--dur-*` tokens are used only by the coach. |
| Haptics | Covered under §9 above. |

## References

The frames are in `experience-frames/refs-puzzle-1..4.jpg` and `refs-flow-1..3.jpg`, with every tile labelled by game, video id and time. Earlier frames reused: `ftue-frames/` (MV1, MV2, Journey, Sky, Flower openings), `settings-frames/`, `finds-frames/` and `swoop-frames/`, plus `talks/notes.md`.

**Obs** means seen in the video at ±1–2 s. **Data** means an ffmpeg loudness reading from the uploader's mix; nothing was listened to. **Rep** means read.

| Game | What it does | Evidence |
|---|---|---|
| Picross 3D Round 2 | **Strike:** the cube turns red with an X and stays where it is. | Obs eiI0kCxFrpE 6:03 |
| | **Last move:** the timer stops, and within about 1 s the UI is gone. The bare 2-colour model turns on a black starfield for about 3 s. | Obs R8uSdW9oe_I 8:36–8:41 |
| | **Reveal:** a white flash, then the textured, animated object, then "CLEAR!", then a tally with Skip. Then a cut to the book page, where the solved tile now shows the object. | Obs 8:42–8:52; eiI 6:54–7:03 |
| | **Sound:** drops from about −24 to −55 dB within 1 s of the last move. | Data |
| Picross S | **During play:** the active row and column clues are lit. | Obs 8qEh2gonX5Q 5:39 |
| | **Solve:** "CLEAR!" for 1 s, then the clues and marks are cleared, leaving the bare grid for about 2 s, then a glow and the colour picture with its name and time. Then back to the list; no auto-advance. | Obs 5:40–5:48 |
| | **Sound:** silence before the cut. | Data |
| Pictopix | **During play:** the clues of satisfied lines dim to grey. | Obs cdXzbWv5Ejw 4:45 |
| | **Solve:** the clues fade, the grid glides to centre as a silhouette, and colour washes in over about 1 s on a flat colour that changes per puzzle. Then the name, "WELL DONE!", crowns and Back/Continue. | Obs 4:49–5:00 |
| Nonogram.com (negative) | A done line auto-fills with X marks and flashes. A slip costs a heart and shows a red ring under the finger. "Incredible!" popups appear. Results come with coins, goals and events. | Obs HpKaBDv1R8s 1:10–2:28 |
| Two Dots | A medal fills with 3 stars, a "Success" card counts the score, Continue, then the map. | Obs sbkm88KOjV4 0:51–0:59 |
| Threes! | Game over: the score is laid over the board itself, with points on each card. | Obs y6qwPcpLwQ4 7:54–8:01 |
| Monument Valley 3 | **Chapter entry:** a tap zooms through nested diamonds to white. Then the title card "THE TOWN / IN WHICH Noor learns about Sacred Light", with tiny vertical "CHAPTER II" caps. | Obs jQUCenbuqSY 0:12–0:27 |
| | **Sound:** the card plays in near-silence, about 30 dB under the swell. | Data |
| | **Scene solved:** no text and no score, about 3 s fading to pale mint, then the next scene. | Obs 2:37–2:42 |
| Monument Valley 2 | **Ending:** an ascent into stars, the logo drawn in light over the level, held on black for about 8 s, credits over level art, then one diorama card: "Thank you for playing!" | Obs xW0seJcx_oo 0:25–1:58 |
| Prune | **Goal met:** the tree drains to grey and a circled ">" waits for the player. | Obs gWF-El1sNjY 0:44–0:52 |
| | **Between levels:** a 2 s near-black beat with a faint "1-7", then the next ground slides in. | Obs 0:53–0:55; Data: about −35 against −18 |
| Mini Metro | **Game over:** the camera goes to the cause first, then two plain sentences give the cause and the total. | Obs D11h8JSzttQ 0:45–0:47 |
| | **Talk:** "Avoid adding in any extraneous visual rewards" (the Desert Golf approach). Show feedback where the eye is, never in two places. "No cuts". | Rep `talks/notes.md` 12:45, 12:15, 19:11 |
| Florence | **Chapter end:** a tick, black, then the chapters list inks in the next chapter, then a lowercase title card. About 12 s in all. | Obs c0Hmvev5r7A 5:20–5:32 |
| Alto's Odyssey | **Crash:** the goals are struck through one by one, then straight back to the title, already moving. About 7 s to the next run. | Obs pD4NKl35btE 1:09–1:16 |
| | **Zen Mode:** "no scores, no coins, and no power-ups". | Rep altosodyssey.com/press |
| Gris | **Ending:** a white-out, constellations closing, a pan to the sky, credits in tiny spaced caps, "THANKS FOR PLAYING!" in a ring. | Obs ZVEUZBlkp58 2:35–7:50 |
| Monument Valley (Wong) | "Tremendous value in actually completing the experience", and catharsis at the end. Progress by place, not currency. Music that is "zen-like", never "here's the sad bit". | Rep `talks/notes.md` 20:33, 21:38, 23:11 |

Not inspected:
- Islanders and Dorfromantik: the search returned the board game.
- A Monster's Expedition, Gorogoa, Unpacking and Lumino City.
- The MV3 chapter-end card: the video stops mid-chapter.
- Any returning-player greeting screen.
- Any hint being used in the references.
- Any game's haptics.

## Mechanisms

1. **A finished line changes how it looks, with no words.**
   - *Claim:* `game-loop-study.md` (Rez and Peggle) asks for loud state changes.
   - *Evidence:* Pictopix dims satisfied clues (4:45). P3D2's tutorial line reads "See how this number is lighter". Nonogram.com's busier version auto-fills and flashes.
   - *Interpretation:* on a 3D block the player can't scan every face, so a quiet "done" state is memory taken off their hands.
   - *Application:* dim the clues of a completed line to about 35%, on every face where they show (H1).
   - *Fails when* it makes the puzzle easier than intended (it only reports, never deduces), or when dimmed digits are hard to re-check.

2. **The UI leaves before the picture arrives, and there is a hush.**
   - *Evidence:* the UI is gone and the sound falls about 30 dB within 1 s in P3D2 (8:36–8:38, Data). Picross S clears its clues before the colour. Pictopix fades its clues.
   - *Interpretation:* the gap is when the player recognises what they made.
   - *Application:* Strata already steps the HUD aside. It names the object in the HUD too early (finding 5.4) and ducks only 4 dB. Hold the name until the landing, and give the bed a short dip (H6, H7).

3. **The reward is the thing, and the numbers come second or not at all.**
   - *Claim:* Churchman's "Desert Golf". Wong: progress by place, not currency.
   - *Evidence:* MV3's solved scene has no text (2:37). Alto's Zen Mode is "no scores". Mini Metro states facts in sentences. Threes lays its score over the board.
   - *Interpretation:* where a score exists, it reads as a record, not a jackpot.
   - *Application:* Kellan wants the score, so keep it, but make it the quietest element, with the gems and the name leading (M1).

4. **The next step is one obvious, calm control, and it comes early.**
   - *Evidence:* Prune's single circled ">" (0:47). P3D2 has Skip from the tally's start. Alto is back in play in about 7 s.
   - *Application:* the result's actions in the pause's ring voice, with Next as the larger ring (M1), arriving with the name rather than after the last gem.

5. **A world ends with a moment that belongs to it.**
   - *Claim:* Wong on completion and catharsis.
   - *Evidence:* Florence inks the finished chapter into its list (5:22–5:26). P3D2 shows the solved tile in its book. MV2 and Gris end in the sky.
   - *Interpretation:* finishing is felt when the whole set is seen together.
   - *Application:* when a world's last stone is solved, its finds gather on its sky for a few seconds before the next world opens (M4). This is also the seed of story-study's "constellation per finished chapter".

6. **One voice for UI.**
   - *Evidence:* MV and Gris use spaced caps on the scene with thin rings. Prune and Florence use thin outline circles throughout. Mini Metro's filled squares are the outlier.
   - *Interpretation:* consistency is what makes minimal UI read as designed rather than absent.
   - *Application:* move the last filled card (coach) and the text-and-pill row (result) to type on the sky and rings (M1, M2). Use one gem symbol (M3).

7. **Silence between beats** (Data only).
   - *Evidence:* the MV3 card sits about 30 dB under the swell. Prune's level gap is about 17 dB quieter.
   - *Application:* chapter cards and the world-close moment could duck the bed further than rewards do. This is unproven until heard on a phone.

## Prioritised hit list

Principle-backed items are marked **R** (researched). Taste and tuning guesses are marked **T**.

| # | Change | Screen | Benefit | Cost | Trade-off | Review |
|---|---|---|---|---|---|---|
| H1 **R** | **Satisfied lines dim.** When every non-object cube in a line is chiselled, its clue digits fade to about 35% on every face. Optionally a soft tone. | Level | Progress readable at a glance on 3D blocks. Closes game-loop #10. | Medium: a per-face clue alpha in the cube shader, and line state updated on each chisel or undo | Could make some levels feel easier. Only "done" is shown, never "wrong". | Build behind a flag. Five players on 5 mid-game levels with and without. Count re-checks, time, and whether they notice. |
| H2 **R** | **The result in the ring voice (M1).** Map · **Next** · Again as rings; the score at about half size and 62% ink; the story line to 15 px. Next arrives with the name (about 2 s); the gems keep filling around it. | Result | The object and its line lead. One button language. About 4 s less waiting per level. | Low: CSS, `finale.drawLabel`, the timing in `showResult` | Less fanfare for score lovers. The ring row needs about 100 px. | Mockup below. Then on a phone: watch 10 solves for whether anyone waits. |
| H3 **R** | **One gem, one count (M3).** The map's ★ becomes the ◆ gem everywhere (stones, worlds, shrine locks: "◆ 12"). Say "found" or "uncovered" everywhere, not both. Settle 182 vs 197 (count Learn and shrines or not). | Map, Finds, result | The reward reads as one thing. | Low | None worth noting. | Mockup below. Read the map at 1:1. |
| H4 **R** | **A world closes (M4b).** The world's finds ring its name on its own sky, with one line, about 3 s, a tap to go on. Then the next cloud parts. Once per world. | Map, after a chapter's last stone | A felt ending 15 times over. Seeds the story's constellations. | Medium: the thumbnails exist (`renderThumb`), plus an overlay and timing | One more ceremony. Keep it skippable and quiet. | Mockup below. Then time it on a phone against the cloud-part. |
| H5 **T** | **The level in one voice (M2).** The coach's words on the sky, no card. One ink for the title block. Hide the ticking clock in levels; time is still kept for the score and shown in Finds. | Level, lessons | Matches "one quiet line of type". The "No rush" rule stops contradicting the HUD. | Low | The card made lesson words unmissable. Keep it for lessons if cold-play shows they're missed. | Mockup below. Then the `playtest-opening.md` question with lessons in both forms. |
| H6 **R** | **Don't type the answer early.** Leave the HUD name as "No. 31" until the landing. | Win | The reveal belongs to the object. | Trivial | None. | Frame-step the win. |
| H7 **R/T** | **A hush before the reveal.** At the last chisel, duck the bed about 15–20 dB for about 0.5 s, then the win chord. | Win (sound) | Gives recognition a beat. | Low (`sound.duck`) | Too long feels like a glitch. | By ear on a phone, with headphones and speaker. |
| H8 **R** | **One thing leads at a world's first level.** The coach line waits until the chapter card has gone. | Level start | Calm start, nothing stacked. | Trivial | None. | Frame-step the first level of a new world. |
| H9 **T** | **Type scale and floor.** Four label sizes (11/13/15/22+) and two trackings (.2 and .3 em). Nothing under 11 px, including the ring labels (9.5 px today). | All | Legible on a phone; looks deliberate. | Low to medium (CSS sweep, overflow checks) | Long names on the map need checking. | Screenshot every screen at 1:1. Check "Capybara & Yuzu", "Clockwork Workshop". |
| H10 **T** | **Haptic hierarchy.** A gem firmer than a chisel (e.g. 18 ms against 12). A light selection tick for ring buttons and map stones, which have sound but no feel today. | All | Touch matches importance. | Low (`buzz`, `native.js`) | Too many ticks numbs. | On an iPhone with the native build. |
| H11 **T** | **The Drift says what it is.** "carved from the drift · 6³" instead of "you uncovered / DRIFT 706". No story line, and no object framing for a random form. | Drift result | Honest copy. "You uncovered" stays special. | Trivial | None. | Read it. |
| H12 **R** | **Stop the map at the Drift.** Trim the empty night below it. | Map end | The page ends somewhere. | Trivial | None. | Scroll to the end. |
| H13 **R** | **An ending exists.** At 182 of 182 the game should end on something (MV2 and Gris show the shape: an ascent into the sky, the mark drawn in light, one small card). `story-study.md` owns this. Raised here because the map today simply arrives at the Drift. | Endgame | Wong's "completion". | High | Scope. | Story-study's own plan. |

Lower, noted:
- The "tap to begin" line is the least visible element on the title. Raise it to the floor size, or let the breathing stone carry it.
- The first map of a new player opens on "182 stones to uncover". Show it only after the first world.
- The shrine level could take its gold inside the level: the rays, and the title's ✦ (open in `map-study.md`).
- Press motion: let `.icon-btn` stop overshooting, to match the rings (`motion.md`).

## Mockups (in the game, injected; no source edits)

Script: `%TEMP%\strata-xp\mock.mjs`. Every frame is 390×844 at DPR 2 in the real running game. Each mockup is CSS, DOM or a prototype patch injected with Playwright.

**M1, the result** (`experience-frames/mockup-1-result.jpg`): today against Map · Next · Again rings, a quieter score, and the story at 15 px. The bottom row is a 1:1 crop.
- *Reads:* the name and story now lead and the gems still glow. The rings speak the pause's language, and "Next" is unmistakable.
- *Weaker:* the ring row sits close under the score, and the bottom third gets busier than today's single line of words. A built version should lift the gems and score a little, or make Map and Again plain words beside one Next ring.
- *Not shown:* the earlier arrival. It is a timing change, not a picture.

**M2, the level in one voice** (`mockup-2-level-voice.jpg`): Moss Garden and The Deep, today against after. The after has the words on the sky, no card, no clock, and one ink.
- *Reads:* on a light sky it is calmer and the block has more room.
- *Weaker:* on the dark world the white halo I used glows around white type. It is legible, but dark skies need a dark halo, as the map's `on-dark` ink does. Lesson text was not mocked. The cream card may still be right for lessons (`tutorial-study.md` chose 18 px in full ink).

**M3, one gem** (`mockup-3-map-gems.jpg`): the map's top and The Deep, today against after. The after has gold diamond gems under every stone, "◆ 40 / 48" for worlds, and an 11 px floor. The bottom row is a 1:1 crop.
- *Reads:* the gems match the result and Finds, and the labels gain a little size.
- *Weaker:* at sheet scale the change is nearly invisible. That is the point, since it is consistency, but it is no visual upgrade. At 1:1 the small gems are slightly busier than the stars.

**M4, a world closes** (`mockup-4-world-close.jpg`): today, where the map simply moves on to The Orchard's cloud, against A (Moss Garden's 13 finds in an arc above its name) and B (the finds ringed round the name).
- *Reads:* B is the stronger. Each find is legible, and it reads as a constellation of the world: a quiet, earned ending in Strata's own words and sky.
- *Weaker:* A is crowded and the objects overlap. In B the ring is too narrow, so two finds touch "MOSS GARDEN" at the sides. Widen the ellipse or shorten the name's tracking.

## Recommendation

1. **Build H1 first** (satisfied lines dim). It is the biggest gain in how the puzzle *feels* to play. It is not mockable in CSS, so it needs a shader prototype.
2. **Take M1, M3 and H6/H8 together** as one "reward reads as one thing" pass. They are low cost and fix the most visible inconsistencies.
3. **Build M4b** for the end of each world, tuned: a wider ring, about 3 s, a tap to continue, and the bed hushed.
4. **Try M2 on levels only.** Keep the lesson card until the opening playtest says otherwise.
5. **Then the sweeps:** type scale (H9), haptic hierarchy (H10), Drift copy (H11), map end (H12).
6. **Leave H13 (the ending) to story-study,** but treat it as a launch question. Today a player who finishes everything gets no ending.

## Limits

- **Rendering:**
  - Headless Chromium on Windows, not an iPhone. Avenir Next (the game's face) is not installed, so all type renders in a fallback, and sizes and weights are right but the shapes are not.
  - Timings in frames run late. Durations quoted here come from the code.
- **Seeded saves:**
  - The "once ever" reminders fire on later levels than in real play (No. 31's coach line).
  - Every object counts as unseen, so the return-to-map cascade lands on Beacon Hills, not on the stone just solved (`B-tomap-*`). That was not judged.
- **No sound or haptics were experienced.** Reference audio is loudness data from uploaders' mixes.
- **The mockups are static.** No motion was mocked.
- **No player testing.** All judgements are my assessments against the references and the brief.
