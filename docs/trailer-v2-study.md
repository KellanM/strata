# Trailer v2: an ad funnel, not a tutorial (study record, 2026-10-17)

## Brief and what changed from v1
The user's verdict on v1: it showed *how the game is played*, when it should
show the most addictive visual rewards and how much there is to uncover. The
new brief is a mobile ad funnel with high production value: the final taps,
the reveals, people turning finished objects, the new level-start
assembly, the best objects (Maneki-neko, Dragon Head, Kokeshi, Origami Fox,
Windmill, Pumpkin), "100+ puzzles", fast blur cuts, animated text, and an
end card with PLAY NOW and the store badges, with no tagline.

## Sources (text research; no reference ads were watched)
- **TikTok Ads, "Creative best practices for performance ads"**
  (ads.tiktok.com/help/article/creative-best-practices):
  - 9:16, at least 720p, sound on.
  - Keep key content inside the UI safe zone.
  - Introduce the content proposition within the first 3 s.
  - Structure: hook → selling points → clear CTA.
  - Text overlays at about 5–10 words per second.
  - Suspense, surprise or emotion makes the hook.
- **AppAgent, "Channel-by-channel creative playbook"** (Meta, Google,
  TikTok, AppLovin): open mid-action in the first 1–2 s and name the game
  only after the hook. 6–20 s is typical for ads.
- **Straight North (Meta creative)**: for sound-off viewing, on-screen text
  should run hook → value proposition → CTA.
- **Segwise, puzzle-ad breakdowns (Color Block Jam, Screwdom)**:
  - Let gameplay audio or satisfying ASMR moments drive the emotion.
  - Gameplay after the hook is *proof of the promise*.
  - Cut away just before a payoff to use the pull of the unfinished
    (Zeigarnik effect).
- **AdMapix (puzzle ad patterns)**: reward reveals and "a single satisfying
  mechanic" are recurring winning hook types.

## Mechanisms applied
| Mechanism | Application |
|---|---|
| Hook in under 1 s, mid-action, no logo | Frame 1 is the Maneki-neko block with five cubes left. The last taps land by 0.9 s, the reveal flash hits at about 1 s, and "WHAT'S INSIDE?" slams in over it. The name appears only on the end card. |
| Reward first, mechanics second | Every shot ends in or sits in a reward: a reveal, a spin, gems landing, the block assembling. Mechanics get one 2 s "TAP / PEEL / REVEAL" triplet and no tutorial beats. |
| Proof of abundance | "100+ PUZZLES" counts up over a cascade grid of dozens of revealed objects, then the map flies past full of objects. |
| Sound-off legibility | Few huge words (≤ 3 per beat) in the game's letterspaced type, animated in on the beat: blur → sharp, wide → tight tracking, scale settle. Kept inside a 9:16 safe zone (top 14 % and bottom 22 % free). |
| Pace | 120 BPM grid with cuts on beats. Whip-blur cuts: a CSS blur ramp plus a scale punch and slight slide, peaking on the cut frame, with a white flash on big moments. A speed ramp slows the moment of impact and speeds through the settling. |
| Satisfying sound leads | The game's own chisel run, heavenly build, win phrase and gem chimes stay in one key. Ad SFX are layered on top: whooshes on cuts, sub impacts on reveals, a soft pulse building, and a riser into the end card. |
| CTA 2–3 s, clear | End card: STRATA, then "PLAY NOW" as a button-shaped pill that pulses, with the official App Store and Google Play badges. No tagline. |
| Unfinished pull (15 s ad only) | The ad cut ends on the Dragon Head with one cube left, then cuts to PLAY NOW. The trailer cut pays everything off. |

## Badges
- **Apple:** the official "Download on the App Store" SVG from
  developer.apple.com/assets/elements/badges.
- **Google:** the official "Get it on Google Play" PNG from
  play.google.com/intl/en_us/badges.

Both are official artwork. The app is not in either store yet, so they are
aspirational. Real ads need store listings, and Apple's and Google's badge
guidelines (minimum size, clear space, no alteration) must be followed.

## How it is made
`tools/trailer/v2/` reuses the v1 approach and extends it:
- **Video pass:** deterministic and frame-stepped. It runs two clocks:
  - game time, which can be slowed for slow-mo, rushed, or fast-forwarded off-screen;
  - screen time, which drives the trailer's own `tr-…` CSS: type, whips, the wall, the end card.
- **Audio pass:** the same script in real time against the game's own sound
  engine. The key is locked to one palette. Levels that are only glimpsed are
  hushed, and per-beat chimes are added.
- **SFX:** whooshes, impacts, a riser, count ticks and a pop are synthesised
  offline (`sfx.mjs`).
- **Mix:** two-pass loudnorm to −15 LUFS, then a limiter.

## Review iterations (contact sheets at 5–6 fps)
1. **First render of 0–8.4 s and 6.4–25 s:**
   - Blocks and revealed objects sat small in frame, so the zoom was raised to
     1.1–1.3 and a slow punch-in was added while the finger turns an object.
   - The Koinobori and Origami Fox reveals were cut before the object
     appeared. The game is now rushed (1.8–2.3×) after those taps, picture
     only, so the object lands before the cut.
   - Montage beats showed half-swept objects behind a 0.3 s whip that filled
     most of each 0.44 s beat. Each beat now fast-forwards 2.1 s into the
     finale and uses a 0.18 s whip.
   - The content wall popped in too slowly: the stagger dropped from 22 ms to
     9 ms per tile.
   - The STRATA wordmark nearly touched the frame edges, so it is smaller with
     tighter tracking. The badges are larger.
   - The Dragon Head was on screen for only ~0.3 s before the end card, so the
     end card moved later (21.8 → 22.1 s), the slow-mo was shortened and the
     map beat trimmed.

2. **First full renders of both cuts:**
   - The trailer came out at 31 MB, so the CRF 18 encode is now capped at
     6.8 Mb/s.
   - True peak was −0.9 dB, so loudnorm now targets TP −2 and a limiter
     follows it.
   - The SFX bed measured −14 LUFS against the game's −21 and would have
     buried the game's sound, so it is mixed at 0.35 and the game leads.
   - "COLLECT THEM ALL" was wiped by each montage level start, and it also
     collided with the game's own "you uncovered …" title. The text now
     persists through the montage and the game titles are hidden for those
     beats.
   - In the ad, the content wall stayed up behind the Dragon Head, and "ONE
     TAP LEFT…" stayed over the end card. Both are now cleared.

3. **Kellan's notes on v2** ("amazing"; three changes):
   - **Repetitive whooshes.** The reveal cuts came at a constant 0.44 s, each
     with the same whoosh.
     - The montage now accelerates: each gap is 0.86× the one before
       (trailer 0.66 → 0.20 s; ad 0.68 → 0.24 s at 0.84×). A riser leads
       into it.
     - Whooshes thin out as the cuts speed up. Every cut through the third
       has one, then only every other cut.
     - They shrink and rise as the cuts speed up: pitch climbs, length and
       gain drop, Q narrows.
     - The other cuts each get their own pitch, length and filter Q.
     - TAP → PEEL → REVEAL also tightens (0.78 → 0.58 s). Its reveal cut has
       no whoosh; the flash and impact carry it.
   - **Hold on the Fox, not the Windmill.** The Origami Fox reveal now plays
     out at full speed (no rush). A finger then turns the finished Fox toward
     its face for 2.3 s with a 1.6× push-in, while its title, gems and score
     land. The Windmill is now the first, quick beat of the montage.
   - **Dragon Head taps broke nothing visible.** The tap helper chose cubes
     by grid position, which were often on the far side of the block, so a
     ring appeared but the cube that broke was hidden. Pre-chiselling also
     left the hidden cubes to go.
     - Taps now use the game's own pick (a voxel ray walk along the view ray,
       ported from main.js `pick()`). A ring only goes on a cube whose centre
       picks that same cube, nearest the camera first.
     - Pre-chiselling keeps visible cubes and breaks the hidden ones.
     - Capture logs every tap. Trailer: 19 of 19 on visible cubes. 15 fps
       close-up sheets show each cube coming apart into its 2×2×2 fragments
       on the tap frame (Maneki-neko, Origami Fox, Dragon Head).
   - **Master merged.** The title screen, map transitions and motion system
     came in with it. Capture skips the title with Enter (the game's own key
     shortcut) before each run.

4. **Kellan's notes on the revision:**
   - **Pay the Dragon Head off in the ad.** The cliffhanger cut-away is gone.
     - After "ONE TAP LEFT…", the last tap breaks a visible cube, then the
       flash and impact play.
     - A beat of slow motion follows, then a 4× picture-only rush, so the
       head turns to face us and both gems land before the end card.
     - The game's own gem chimes would arrive late in real time, so they are
       muted for that level and replayed on the picture's gem frames.
     - The end card keeps 2.5 s.
   - **TAP / PEEL / REVEAL too fast to read (both cuts).** Each word now has a
     1.25 s beat.
     - The slam is sharp by about +0.25 s and stays clear until the next whip
       starts at +1.10 s, so each word is fully legible for about 0.85 s.
     - Its action plays underneath: 7 taps, 3 peels, the reveal.
   - **Keep the 100+ wall as it was.** It keeps its length and start in both
     cuts (trailer 14.26 s / 2.34 s; ad 8.0 s / 2.0 s). The time came from
     elsewhere:
     - Trailer: the montage drops to 6 beats in 2.16 s, and the hook's hold
       after the reveal is 0.4 s shorter.
     - Ad: the montage drops to 4 beats in 1.65 s, and the hook is 0.4 s
       shorter.

## Evaluation and limits
Recorded in the report. Nobody has watched it on a phone or listened to it;
review was by contact sheets and audio measurements.

## v5 port (2026-10-20)
The approved v2 cuts, brought onto master and re-rendered against today's game
(15 chapters, 158 stones, 15 shrines, the title, the cloud-sea map, the pause
card). The creative is unchanged: same shot plan, pacing, whip cuts, captions,
sfx (`v2/sfx.mjs`, imported as is), 100+ wall and end card.

- **Where:** `tools/trailer/v5/` (timeline, page, capture-video,
  capture-audio, build, sheet, plus `lib.mjs` for the lock and Chrome, and
  `cast.mjs`, a thumbnail sheet of every object for casting). `tools/trailer/v2/`
  is the original, untouched (it was checked out from `saturday-trailer-v2`,
  not merged). Renders: `trailer/v5/strata-trailer-25s.mp4` and
  `strata-ad-15s.mp4` (not committed); posters and contact sheets in `trailer/v5/`.
- **Run:** `PORT=5251 node server.js`, then for each cut
  `node tools/trailer/v5/capture-video.mjs trailer|ad`,
  `node tools/trailer/v5/capture-audio.mjs trailer|ad`,
  `node tools/trailer/v5/build.mjs trailer|ad`. Each browser run takes
  `strata-browser.lock`.

**What broke, and the fix (all trailer-side; no game change):**
- *Playwright and Chrome:* v2 imported a local `playwright` and a headless
  shell that aren't here. v5 uses the global install and system Chrome
  (`QA_CHROME`), under the shared lock.
- *The map's one-off reveals:* today's map celebrates each object, chapter,
  parted cloud and lit stone once. The capture save marks all of them seen
  (`strata.map.objects/lit/chapters/parted`), so the map shot is calm and whole.
  Shrines are in the solved save too, so their peaks are lit.
- *Ads:* the save sets the developer switch `strata.ads.off`, so no
  interstitial or offer can appear.
- *New HUD and cards:* the lantern, pause card, offer card, ad breath and the
  dive's veil glow are hidden with the HUD.
- *Saved progress:* today's game resumes a half-done level. `level` clears
  `strata.progress` first, so every shot starts from its own setup. It also
  closes the pause card and the journal.
- *Pause menu:* the menu button opens the pause card on a level still in play.
  `map` goes on through its Map button if the card shows. In these cuts the
  level is solved by then, so the map opens directly, as before.
- *Win pose:* today's win whirls onto the map thumbnail's pose. At the
  montage's 2.1 s fast-forward the flat objects are still turning, so the new
  Windmill arrived edge-on. A per-object camera offset is applied after the
  fast-forward, when the win's own framing has finished (`FACE`: Windmill
  −0.9 rad, Sloth −1.4 rad).
- *Map length:* the 15-chapter map is about twice as long. The 2.1 s scroll
  now covers half of it, ending at First Light (`MAP_SPAN` 0.5), so it moves
  at v2's speed. It passes Beacon Hills, the Moss Garden and the cloud islands.
- *Title:* the boot title is still skipped with Enter (the game's own key).
  Nothing to change.

**Asset swaps (same slots and timings):**
| Slot | v2 | v5 |
|---|---|---|
| Trailer montage, beat 3 | Wishing Well | **Sloth** (faces us, hanging from its branch) |
| Trailer montage, beat 5 | Daruma | **Moss Tortoise** (the Moss Garden's shrine, on its green sky) |
| Trailer montage, beat 6 (a blurred 0.2 s beat) | Sunflower | Wishing Well |
| Ad montage, beat 4 | Planet | **Sloth** |
| Map caption | SEVEN WORLDS | **FIFTEEN WORLDS** (now true) |

Kept: Maneki-neko (hook), Kokeshi / Tea House / Koinobori (TAP / PEEL /
REVEAL), the Origami Fox hold (Kellan's note), the Windmill first and the
Pumpkin and Planet in the montage, and the Dragon Head finale. The Koala stays
out (Kellan preferred the Sloth). The 100+ wall draws from today's 173 objects.
Today's visuals come in on their own: the current rays and finale, the
cloud-sea map with its island peaks and companion, and today's thumbnails on
the wall. The double-tap row cascade has no slot in this plan, so it isn't
shown.

**Checks:**
- Taps: trailer 20 of 20 and ad 16 of 16 land on visible cubes, and each
  breaks on its tap frame. The capture now logs each tap's time, cube and
  break (`work/*-video-taps.json`).
- 15 fps close-ups: `contact/taps-*.png`.
- Loudness: trailer −15.0 LUFS (TP −2.0 dBFS); ad −15.0 LUFS (TP −1.9). This
  matches the v2 renders exactly, measured the same way.
- Side by side with v2: `contact/compare-trailer-v2-v5.png`.
- `npm test`: 34 pass.

**Limits:** review was by contact sheets and measurements. Nobody has listened
to v5 with sound or watched it on a phone.
