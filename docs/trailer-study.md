# Trailer study (2026-10-17)

## Brief

The goal is a short vertical trailer (1080×1920, 30 fps, about 27 s) built from real rendered gameplay. It should convey the calm, satisfying feeling of play and show the most satisfying moments:
- the chisel crumble;
- runs that rise into music;
- peeling layers;
- the reveal and the gems;
- the variety of worlds.

It has to work muted, because store and social feeds autoplay without sound, and with sound, because the game's own audio is half its charm.

## Sources (text only; no trailer video was watched)

- **App Store previews:** portrait 886×1920 or 1080×1920, 15 to 30 s, up to 30 fps. H.264 or ProRes. The video "may only use video screen captures of the app itself". Sources: [aso.dev](https://aso.dev/app-store-connect/screenshots/), [flowjam](https://www.flowjam.com/blog/app-store-preview-video), [dev.to](https://dev.to/mmazzarolo/generating-ios-app-previews-for-the-app-store-k7d).
- **Short social video:**
  - Earn attention in the first 2 to 3 s and design for sound off. Carry one message, end with one clear action, and mute-test the opening ([biteable](https://biteable.com/blog/best-practices-short-social-video/)).
  - Start on the payoff, not the setup ([clip.dor.gg](https://clip.dor.gg/en/blog/gaming-shorts-viral-pattern)).
  - Keep text out of the top 12% and bottom 20% (platform UI). Don't open on a static title card ([vertical-video-design](https://skills.sh/portel-dev/skills/vertical-video-design)).
- **Monument Valley:** the pre-release and release trailers were scored with ambient tracks by Obfusc ([josephx](https://josephx.com/audio/monument-valley)). Ken Wong cites Brian Eno as an influence ([MacStories](https://www.macstories.net/news/ustwo-announces-monument-valley-release-date-posts-behind-the-scenes-video/)). The mood is carried by slow, ambient music and the art itself, with few words. This is an interpretation from those sources; I did not watch the trailers.

## Mechanisms applied

1. **Motion within the first second.** The first frame is the glowing block with rays and motes, and a cube crumbles at 0.35 s. No title card opens the video.
2. **One idea per beat, few words.** Four lowercase, letterspaced captions in the game's own type say the whole message muted. They sit at 71% of the frame height, inside the safe zone.
3. **The payoff is in the middle and lands at full length:** the Wishing Well reveal with its flash, whirl, colour sweep, title and gems. The montage shows variety without explaining it.
4. **Sound is the game's own.** The chisel notes rise with the run and the finale resolves home. For the trailer the effects lead the bed, and loudness is normalised to about −16 LUFS for phones.
5. **One clear action at the end:** STRATA, the line "peel the stone · find the shape", "free · plays in your browser" and the URL.

## Method

- **Picture:** rendered on a virtual clock. `performance.now`, `Date.now`, `requestAnimationFrame`, timers and CSS animations all follow the same stepped time, so every frame is exactly 1/30 s and the capture is perfectly smooth.
- **Sound:** recorded in a second, real-time pass of the same timeline, tapped from the game's audio bus, then muxed.
- **Scripts:** `tools/trailer/`.

## Results and limits

See the parent report. Nobody has tested it with an audience, and I have not listened to it on a phone.

# v2 (2026-10-19)

**Brief.** Kellan asked for the next trailer, built on the research so far and the best new objects, naming the **Koala** and the **Moss Tortoise**. Constraints are unchanged from v1: real captures only, 1080×1920, 30 fps, under 30 s, and it must work muted and with sound. Output: `trailer/strata-trailer-v2.mp4` (29.7 s), `-silent`, `poster-v2.png`, `contact-sheet-v2.png`.

**Baseline (v1, inspected on its contact sheet).** Four separate blocks open the trailer, then a montage and a custom end card. Each beat works on its own, but there is no through-line: nothing connects one stone to the next. The montage has a blank teal frame at about 19 s, a dip that lands before its level has drawn. v1 also predates the title, the map world, shrines and the double-tap cascade.

**New sources.** No new external research. The other studies stand in for it:
- `map-study.md`: the sea of clouds, the mist parting on unlock, and the starry title that is one page with the map;
- `study-record.md` and `biomes-adventure.md`: Journey, Monument Valley and Shadow of the Colossus, which call for mythic, vast, journey and minimal, with cosy framing off-brand.

## Mechanisms applied

1. **A journey, not a sampler (call to adventure).** The trailer follows one path:
   - one stone is carved down to the Koala;
   - the map pulls back out of that same stone;
   - the companion steps on and the mist parts over the next world;
   - the trail's gilded shrine opens on the Moss Tortoise;
   - a finger pulls the night sky back down to the title.

   *Hypothesis:* continuity reads as a world to travel, where v1's cuts read as a list of features. *Check:* every beat hands off to the next on the contact sheet, with no unrelated cut.
2. **Motion in the first second, payoff over setup** (kept from v1). The first frame is the glowing Orchard stone, and the first cube crumbles at 0.25 s. At 1.15 s and 2.35 s, real double-taps on a 0 run the game's own cascade down 9-cube columns. The cascade is the most kinetic new mechanic: a ripple runs ahead, and the run gathers pace with a rising run of notes.
3. **Two reveals, rising in rank.** The Koala is the first payoff, a creature that reads at a glance. The Moss Tortoise is the climax, because a shrine is the game's most mythic moment: a gold portal from the map, the held "✦ The Shrine of ✦ Moss Garden" card with its bells, and a gilded block. The poster is the Tortoise with its gems.
4. **Vastness through the map world.** The mist over Autumn Woods parts on screen, with its peak and warm sky rising in. The caption "fifteen worlds above the clouds" carries the scale without a list. To shorten the wait, the save puts the companion one stone back (`map.js placeCompanion`: 750 ms per stone, 0.9 s minimum), so the parting begins about 1.7 s after the map opens. This is the game's own timing, not a speed-up.
5. **The game is its own end card.** v1 used a custom overlay. v2 ends on the real title: STRATA, the carved logo stone and the night sky, reached by the real pull-down gesture (`beginAscent`, touch path). Only the "swipe up" hint is swapped for one line of where to play, with the count read from the code: **158 stones** and 15 chapters (`SHAPES.length`, matching the map head's "of 158"; the 140 in the request was stale).
6. **Fewer words** (kept from v1). Three captions:
   - "something sleeps in the stone" (v1 said "hidden"; "sleeps" is more mythic);
   - "every tap is a note";
   - "fifteen worlds above the clouds".

   The shrine card speaks for itself. Peel and the gem montage were cut to make room. Peel is v1's beat, and it is hard to read in a trailer.

## Method changes

- `tools/trailer/lib.mjs` is shared by both passes. It holds the version switch (`TRAILER=v2`; unset means v1), the browser lock, system Chrome, the virtual clock and the save seeding.
- Timelines can declare `storage()`, `PREROLL` (v2 steps off the title onto the map before t = 0), `POSTER` and `AUDIO_LEAD`.
- `capture-video.mjs` gained `SCALE=1` for quick drafts and `CUT=secs` to watch a beat play out uninterrupted.
- The row cascade is a real double-tap: synthetic pointer events on a face whose line shows a 0. The target is the longest clearable line whose face is in view and unoccluded. The game's `rowClearTap` does the rest.

## Experiments and what they showed

- **Draft 1 (540×960).**
  - The ending never reached the title. The motion log showed why: the map's wheel path calls `beginAscent()` then `endAscent(false)` with `down = 0`, which falls straight back to the map.
  - The map caption was light on light, and the mist had not parted 4 s after the map opened, because the companion walked the whole Orchard first.
  - Gems landed after the cuts.
- **Draft 2.**
  - With the companion one stone back, the mist parts on screen.
  - A cream dip flashed against the shrine's teal sky. It is now a radial gradient sampled from the sky.
- **Draft 3.**
  - The ending is driven by a touch pull. The night sky follows the finger down over the map, then settles on the title.
  - The map caption collided with Autumn Woods' first stone and the walking companion. It moved to the empty cloud band at 51.5%.
  - The title's own tagline ("peel the stone · find the shape") was nearly invisible: it is drawn in the day palette's dark `--ink-soft` on the night sky. For the end card only, the trailer lifts it to the title's colour.
- **Audio sync.** Chisel onsets in the final WAV were about 80 ms early against their scheduled times. The picture shows an action one frame later, so v1's 0.16 s lead over-corrected for this pass. v2 uses 0.065 s, and the measured onsets now sit within ±15 ms of their first frame.
- **Loudness:** −16.8 LUFS integrated.

## Open

- **For the game, not the trailer:**
  - the mouse-wheel return to the title (above) looks broken;
  - the title's tagline is probably as faint on a real launch as it was in capture.
- v1's timeline predates the title screen and is not re-rendered here. It now needs a title-dismissing `PREROLL` like v2's.
- No audience test. Nobody has listened to v2: sync and loudness were measured, not heard.

# v3 (2026-10-19)

The distilled, reusable guide is now [ad-playbook.md](ad-playbook.md). This log stays the dated record.

**Brief.** Kellan rejected v2: one slow journey that reads as a mechanics walkthrough. v3 goes back to Saturday's v1 as the base and makes it "a lot more compelling":
- keep its structure: a hook on a final tap and a reveal; TAP / PEEL / REVEAL; a fast blur-cut montage of the best objects; rotating shapes; the wall; animated text; an end card with App Store and Google Play badges and no tagline;
- use what is new since: the map world, the double-tap row cascade, the title's sky, shrines, the Koala and Moss Tortoise;
- deliver two cuts, a ~28 s trailer and a 15 s ad, plus two alternative 3 s openings for the ad.

Saturday's revisions only lived on a deleted branch. I rebuilt them from `timeline.mjs` and Kellan's notes:
- a 15 s ad that ends on the Dragon Head: "one tap left…", the final tap, the head turns to face you, the gems chime, then a 2.5 s end card;
- TAP / PEEL / REVEAL at about 1.25 s per word;
- the wall;
- a montage of 6 reveals in the trailer and 4 in the ad.

**Outputs:**
- `trailer/strata-trailer-v3.mp4` (28.4 s);
- `trailer/strata-trailer-v3ad.mp4` (15 s, opening a);
- `-v3ad-b.mp4` and `-v3ad-c.mp4` (openings b and c);
- for each cut: `-silent`, a poster and a 2 fps contact sheet.

The mp4s are gitignored, as in v2.

## Sources (what was actually inspected)

- **Text research.** These are written claims, not viewed ads:
  - Derek Lieu's trailer posts. His points: say what the video is about in the first 1 to 2 s; captions; build the mechanic, then layers; cut by feel, about 2 frames.
  - Apple's App Store preview guidelines and badge rules.
  - Google Play's badge rules.
  - Platform safe zones, via Socialync.
  - Smadex via AppTweak: an end card that differs from the last frame got about 3× the IPM.
  - AppLovin: most players watch muted; captions gave +64% D0 ROAS, for a sleep app.
  - Liftoff/Vungle, via GameDev Reports: puzzle ads perform best at about 22 s with an App Store end card.

  URLs are in the playbook.
- **Real ads, sampled muted frame by frame from Meta Ad Library** (no login; a subagent took the samples). I looked at two of the frame sheets myself, `.playwright-mcp/bb20.png` and `cbj.png`, which are gitignored:
  - **Block Blast, 4127189990777035, 19.9 s.** The board is mid-game at 0 s. There is no text in the whole ad, only the score and "Combo 8 / 9" at 16 to 17 s. The separate end card at 18 to 20 s has the logo, a search bar typing "BLOCK BLAST", and both badges.
  - **"Color block Jam" page, 955285320353998, 37 s.** A "NO TIMER!" bar stays across the top for the whole ad, with a hand pointer on every move. The end card is an overlay on the blurred last frame: icon, search bar, both badges.
  - **Described from the subagent's samples (not viewed by me):**
    - Royal Match 3119331334938178 (60 s): the King is in peril by 1 s, and the CTA is "Choose the next level!".
    - Nonogram.com 1824481918711949 (30 s): a persistent two-line challenge caption and a level ladder of ticks (1x1 ✓ … 5x5 ✗).
    - Gem Nonogram 1712554213189639 (19 s).
    - A 10 s Color Block Jam loop with no end card.
  - Most of Block Blast's highest-impression ads run 54 to 63 s.
- **Could not view:**
  - TikTok Creative Center Top Ads (login wall after 4 ads);
  - Liftoff's video-length and end-card report (form-gated);
  - Liftoff's Creative Index (images only);
  - Unity's and ironSource's pages (search summaries only);
  - Sensor Tower, MobileAction and AppAgent breakdowns.

  No ad was heard: everything above is muted.

## Mechanisms applied

1. **Motion and a question by 0.5 s.** None of the viewed ads opened on a logo, and all were moving at 0 s.
   - The trailer and ad open on the Maneki-neko's stone, already carved down to one row of 0 and a last cube.
   - "WHAT'S INSIDE?" builds in letter by letter from 0.1 s.
   - A real double-tap runs the row away at 0.35 s. The last tap at 1.35 s gives the flash, whirl and name.

   This is a deduction you can read (a 0 means the row goes) leading into a payoff, which matches Meowdoku's "show one solvable step".
2. **Touch rings on every tap.** Unity recommends touch indicators, and Color Block Jam keeps its hand on screen. Each ring is drawn where the synthetic pointer lands. The game's own `pick()` decides which cube breaks; the trailer checks it first with the same voxel walk and logs the result. In all four cuts, every tap hit its cube and there were 0 mistakes.
3. **Words carry it muted.** A muted viewer sees, in order:
   - "what's inside?" / TAP / PEEL / REVEAL / "every stone hides something";
   - "fifteen worlds above the clouds" / 150+ PUZZLES / "one tap left…";
   - free to play / search STRATA / badges.

   Captions use the game's typeface: uppercase, semibold, 29 to 50 px at 540 wide (58 to 100 px in the 1080 output). Letters blur and rise in with a 34 ms stagger and leave upward. This follows the brief's "the text should animate as well", and "puzzles" plus a 0 → 150 count-up turns the content volume into motion.
4. **More rewards than mechanics.** The trailer has 10 reveals in 28 s: Maneki-neko, Koala, the six in the montage, the Moss Tortoise and the Dragon Head. It also has the gems twice, the shrine card, the mist parting and the wall. Mechanics get about 2.6 s (TAP and PEEL).
   - In the montage, each shot is a last tap. Inside the win's white flash the picture jumps about 1.25 s ahead, to the object landing in its colours with its name typing in. At 1.1 s a shot, the reward is on screen for most of each shot, not just the stone.
   - This is a time cut hidden in the flash, not faked play. Every frame is the game rendering its own state.
5. **Blur cuts.** The game's layers blur at 14 px, scale up 7% and brighten over 0.1 s. The new shot is set up underneath the blur, then sharpens over 0.18 s. Captions, rings and the end card sit outside the blur. The audio pass adds a soft noise sweep, the engine's own `noise()`.
6. **A separate end card, different from the last shot** (Smadex). The ascent is the real pull-down at the map's top, where the night sky comes down over the map. The end card is then the game's own title with its evolving god rays, minus its tagline and "swipe up".
   - Added on top: "free to play", a store search bar typing STRATA (the Block Blast and Color Block Jam pattern), the unmodified official App Store and Google Play badges side by side, and the trademark lines.
   - The logo stone is drawn at zoom 0.74 so that all of this sits above it, inside the safe box.
7. **Safe zones.** The combined TikTok, Reels and Shorts safe box is y 15–64.5% and x 11–82% (Shorts reserves its right 192 px). Every caption box and the end card are measured in-page and logged. All are inside the box: the extremes are y 17–58.4% and x 20.6–81.9%.
   - The game's own object name and story sit at about 4 to 14% from the top, inside TikTok's top bar. That is game UI and was left alone.
8. **Sound.** The sound is the game's own: chisels, cascades, the win, `star()` for each gem, the bed and the shrine bells. The trailer-only extras are played on the engine's own voices: the cut whoosh and the final chord, `fmBell` as in v1 and v2.
   - Where the picture jumps, real-time sound can't follow. So the audio pass releases the game's result timers with its own tap-to-finish and plays `sound.star(k)` at the times the picture shows the gems landing. The gem chimes land on the gems.
   - Loudness is mastered to −14 LUFS (social feeds), not v1/v2's −16. Measured (trailer / ad a / b / c): −14.2 / −14.9 / −14.4 / −14.5 LUFS integrated, peak −1.5 to −1.7 dBFS.
   - Chisel onsets in the first build arrived 30 to 48 ms after their actions. `AUDIO_LEAD` is now 0.08 s, and Lieu's "a couple of frames late looks in sync" applies.
9. **150+, not 100+.** There are 158 stones (`SHAPES.length`) plus 15 shrines. "150+" is true and a third bigger, and the count-up lands on it. `WALL_COUNT` reads it from the code: the count rounded down to a fifty.

## Experiments and what they showed

- **Survey** (`tools/trailer/survey.mjs`): 56 objects and shrines, each solved and grabbed at its reveal pose on one sheet.
  - By colour and silhouette at phone size, the strongest picks after the six Kellan named are: Armillary Sphere (gold), Mikoshi, Anglerfish (teal sky), Tin Carousel, Clock Tower, Great Lantern Gate and Ringed Planet.
  - Lantern Festival objects all share the crimson sky, so the montage alternates skies: peach, crimson, teal, crimson, lavender, gold.
- **Draft 1:**
  - the Koala's second final tap missed, because a tap landed while the canvas was still scaled by the blur (pick() reads the canvas box). Taps now go through the canvas box;
  - a single tap 23 px from the last one became an accidental double-tap cascade, so taps now keep 40+ px apart;
  - the title → descent → map shot landed on First Light's plain pink header, and the mist never parted on it;
  - the shrine shot spent 1.5 s on blur.
- **Draft 2:**
  - parting only runs when the map opens from play (`renderMenu(…, celebrate)`), and the companion's walk delays it by 750 ms a stone. The save now puts the companion one stone before the first stone still open when the map is shown (the Dragon Head), with Autumn Woods unparted, and the map is opened from the last montage solve, as v2 did. The title's descent itself was dropped. Only its reverse, the ascent into the end card, is shown;
  - the map world after the descent was flat. Autumn Woods' peaks rising out of the cloud read better;
  - the shrine card had been skipped, because a shrine needs the map's own entry, which has the `bonus` flag. It is now reached by tapping the node.
- **Draft 3:**
  - centred captions wider than about 62% clip the safe box. "Every stone hides something" and "uncover what's hidden" were split into two lines;
  - the end card's badges sat at 68%, in the bottom 35% that platform UI covers. They moved above the stone.
- **Ad:** "one tap left…" was on for only 0.65 s. The montage tightened to 0.95 s a shot, so the line now holds 1.1 s and leaves with the flash. The Dragon's three gems land at 10.55, 11.38 and 12.22 s, before the 2.5 s end card.

## Results and honest limits

- **Against v1:** v3 is clearly denser and more rewarding. v1 had 2 full reveals plus a montage of 4 already-solved objects. v3 has 10 reveals in 28 s, each shown from its last tap, plus the world, a shrine, a turntable and the wall, with captions you can read muted.
- **Against v2:** the same new content (Koala, Moss Tortoise, the map, a shrine, the ascent), but cut as rewards rather than walked through.
- **Weak spots:**
  - TAP and PEEL are still stone-coloured mechanics, about 2.6 s of them. Peel reads only if you already know the game.
  - The map shot is the palest in the trailer, and the mist parting is subtle at phone size.
  - The shrine takes 3.5 s and its card is quiet.
  - In the montage, the win's bell run doesn't jump with the picture, so the sound is real but the bell run is a beat behind the image (the gem chimes are synced).
  - The montage line stacks just under each object's name.
  - The end card's badges promise stores the game isn't in yet.
  - With badges and a Google mention, these cuts can't be App Store previews. A preview needs a cut without them (Apple 2.3.7 / 2.3.10).
- **Not done:**
  - no audience or ad-network test;
  - **nobody has listened to v3 with sound.** Sync and loudness were measured, not heard.
- v1's timeline now has a `PREROLL` off the title and renders again against the current game (`TRAILER` unset).
