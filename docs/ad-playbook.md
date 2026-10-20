# Strata ad and trailer playbook

Read this before making any Strata ad or trailer. It is the distilled, living guide: update it when a cut teaches something new. The dated research log, with sources and experiments, is [trailer-study.md](trailer-study.md).

## Kellan's standing decisions

- **Let reveals land fully; never cut mid-rotation.**
  - Every reveal plays until the object has turned all the way to face the viewer and stopped. That takes **4.8 s after the winning tap**, measured with `tools/trailer/settle.mjs` from the finale's own state (within 1.5° of rest and turning under 2°/s, at 4.77 s for every object tested). At 2 s, 68° of turn is still left; at 3 s, 16°.
  - Never jump forward inside the flash, and never speed the animation up.
  - To save time, show fewer reveals, or show objects that are already settled (gems landing).
- **The reference is Saturday's revised 15 s ad**: `trailer/reference/saturday-ad-15s.mp4`. The mp4 is gitignored and kept locally; its 2 fps sheet `saturday-ad-15s-sheet.png` is committed. This is "the previous video" Kellan means. Study it frame by frame before changing the wall, the end card or the caption style.
- **The wall is Saturday's** (reference, about 8–10 s):
  - a dark plum field of object tiles: rounded squares holding the objects' own thumbnails, tilted a touch and drifting down;
  - a big gold count that runs up with its "+" the whole way (21+, 50+ … 100+) in about 0.9 s;
  - "PUZZLES" in bold, wide-tracked white underneath.

  It ends on "100+ PUZZLES". It is approved: don't reword it (not "150+") or restyle it.
- **The end sequence** (Kellan, approved):
  1. Cut to the map.
  2. A finger pulls down at its top, and the game's own ascent brings the night sky and the title down.
  3. The title blurs.
  4. Over the blur comes Saturday's CTA: "STRATA" wide-spaced with its small gem, the gold "PLAY NOW" pill, and the App Store and Google Play badges side by side.

  The title's own words fade as the CTA comes in, so nothing doubles up. Keep the map-to-title move even in a 15 s ad; shorten it, don't drop it.
- **Captions in Saturday's style**: bold, wide-tracked, white with a dark glow, 44 px lines and 72 px verbs at 540 wide, with REVEAL in gold.
- **Wrong turns not to repeat:**
  - the v1 end card ("free · plays in your browser");
  - a v1-style wall (the map trail with v1's small caption). That rebuild was wrong: v1 never had the wall; Saturday's ad did;
  - v3's first journal count-up to 150+.
- **Real gameplay only.** Time can be cut between shots, under a blur, but never inside a reveal. Play is never faked.
- **No tagline anywhere**: not on the title, not in the map's head, not on the end card.

## 1. Principles (with evidence)

| Principle | Evidence |
|---|---|
| Something moves by 0.5 s, and no logo opens the ad. | Meta Ad Library, sampled muted: Block Blast 4127189990777035 is mid-game at 0 s; Color Block Jam 955285320353998 has its hand moving at 0 s; Royal Match 3119331334938178 has the King in peril by 1 s. Derek Lieu: "within the first second or two" ([GameDiscover](https://newsletter.gamediscover.co/p/tiktok-practical-advice-for-big-discovery)). |
| The payoff must land completely. A cut that leaves a reveal mid-turn reads as unfinished. | Kellan's review of v3's first cut. The measured settle time is 4.8 s. |
| It has to work muted. Words carry it; the game's sound is the bonus. | AppLovin: "most mobile gamers play with sound off"; captions gave +64% D0 ROAS (for a sleep app) ([AppLovin](https://applovin.com/en/resources/high-performing-video)). Color Block Jam keeps "NO TIMER!" on screen for all 37 s. Nonogram.com 1824481918711949 keeps a two-line caption on screen throughout. |
| Show one readable deduction, then the payoff. | Meowdoku ads fail when the viewer can't see a step they could solve ([AppGrowing](https://appgrowing.net/blog/en/royal-match-ad-creative-analysis-king-in-peril-hooks-and-pick-ctas/), secondary). Strata version: a row of 0, double-tapped away, then the last tap. |
| Rewards should outnumber mechanics. | Kellan's notes on v1 and v2. |
| Show a finger: touch rings on every tap. | Unity's video best practices (search summary). Color Block Jam's hand pointer. |
| End on a separate card, not the last gameplay frame. | Smadex via AppTweak: about 3× IPM ([AppTweak](https://www.apptweak.com/en/aso-blog/improve-creatives-performance-for-mobile-gaming-ad-campaigns)). |
| Length: about 15 s for Reels and TikTok; puzzle optimum about 22 s with an end card; 45–60 s cuts dominate Meta's top impressions. | Liftoff/Vungle via [GameDev Reports](https://gamedevreports.substack.com/p/vungle-and-liftoff-optimal-video). Meta Ad Library: Block Blast's top ads run 54–63 s. |

## 2. Strata specifics

**Budgeting time.**
- A full reveal costs about 5 s: the last tap, then 4.8 s to settle. A 15 s ad holds two of them plus a short wall and a 2.5 s end card. A 30 s trailer holds three, plus TAP / PEEL and a montage of settled objects.
- The first gem lands 4.1 s after the tap, then one more each beat (0.83 s). Shots of settled objects that start about 4.85 s after their win catch gems 2 and 3 landing.

**Hero objects** (survey: `tools/trailer/survey.mjs`):
- **The v4 picks:**
  - **Hook:** the Dragon Head. It has the strongest silhouette and turns to face you; open on its last cube.
  - **The mechanic:** the Sloth (Kellan's choice over the Koala). It reads, but it is the palest: cream on the Orchard's cream.
  - **Montage:** Maneki-neko (crimson), Anglerfish (teal), Windmill (lavender), Pumpkin (peach). Every one is a different sky.
- **Kellan's named favourites:** Maneki-neko, Dragon Head, Kokeshi, Origami Fox, Windmill, Pumpkin, Sloth, Koala, Moss Tortoise.
- **Also strong at phone size:** Armillary Sphere (gold), Anglerfish (teal sky), Mikoshi, Tin Carousel, Clock Tower, Great Lantern Gate, Ringed Planet.
- Lantern Festival objects all share the crimson sky, so never put two of them next to each other in a montage.

**Best moments:**
- the last tap: flash, leap, whirl, colour, name. Let it land;
- the double-tap row cascade;
- gems landing, each with its chime;
- the Dragon Head settling to face you;
- the mist parting;
- a shrine's card and its block assembling;
- the map trail rolling past.

**Reads poorly:**
- a full untouched block;
- peel, unless you already know the game;
- the map's pale First Light header.

**Captions** (Saturday's style; v4's `heavy` weight is the current spec):
- The game's typeface, uppercase, bold 700, with a hairline stroke (`heavy`) to match Saturday's weight.
- Tracking .13em; white `#fffaf3` with a dark plum glow.
- 54 px for lines, broken in two with `|` ("ONE TAP / LEFT…", "COLLECT / THEM ALL"); 76 px for verbs (TAP, PEEL, and REVEAL in gold). Sizes are at 540 wide (×2 in the output).
- Letters blur and rise in, 34 ms apart. The hook's caption starts on frame one.
- At most about 62% of the width when centred: "REVEAL" at 76 px is the widest that fits.
- Saturday put TAP / PEEL / REVEAL at about 80% of the height, which platform UI covers; v3 and v4 keep them at 16%.
- Hold a caption through a flash; clear it before the object's name settles in.
- Under COLLECT THEM ALL, hide the game's name card (`noName`) so nothing stacks above the caption.

**Safe zones** (1080×1920, combined TikTok, Reels and Shorts):
- Keep text inside y 15–64.5% and x 11–82%.
- Saturday's verbs (about 80%) and v1's captions (64.5% and 71%) fall outside that box; v3 keeps every caption inside it.
- The game's object names sit at 4–14%. That is game UI, so leave it.

**End card** (the end sequence above): the CTA layout follows the reference at 540 wide:
- STRATA: 58 px, weight 400, .42em tracking, at 30%;
- the gem at 42%;
- PLAY NOW: a gold pill, 336×80, at 47%;
- the badges: 64 px tall, 22 px apart, at 57%.

Everything sits about 3.5% higher than in the reference, to keep the visible badges above 64.5%. The badge row's width (about 10–90%) is the reference's own and runs past Shorts' right margin, which is a known trade-off. Hold it 2.6 s in the trailer and about 2 s in the ad. The badge artwork is in `tools/trailer/badges/`, official and unmodified.

**Store honesty:** `docs/ad-hooks-study.md` notes that PLAY NOW and store badges pointing at stores that don't list Strata yet would breach Google's "unavailable offers" rule. Fine for previewing; check before running paid ads.

**Sound:**
- Master to −14 LUFS integrated, true peak −1.5 dB.
- Use the game's own sound. Trailer accents (whoosh, gem chime, final chord) are played on the game's audio engine voices.
- Cut on taps and gems. The bed has no beat.
- Montage shots of settled objects are muted, with a chime on each gem as it lands.

**The rolling-number sound** (the wall's 100+; `H.countRoll` in `v3-page.mjs`). This is the game's own count-up voice: `sound.tick(k)` and `tickDone()`, the result card's score count-up in `main.js showResult`. Recipe:
1. **Ticks.** For each frame n of the count where the shown number changes, play one tick on the audio clock at `t0 + (n − 1)/30` s. Frame n of the count shows v(n + 1), so the tick lands on the frame its number first appears.
   - Voice: a sine on scale degree k (climbing, capped at 14) from the key's root + 36; gain 0.075 and decay 35 ms, louder than in-game for the ad mix, with ±5 cent alternating detune.
   - Add a 6 ms noise click at 5.2 kHz.
2. **Pace.** One tick per change means they run every frame while the count rolls fast, then thin out as it eases in. Never a fixed-rate slot-machine rattle.
3. **The landing,** on the frame 100+ first shows:
   - `tickDone`'s bell (an FM bell at root + 48), gain 0.16;
   - a bell a fifth up, 40 ms later;
   - a soft sine body two octaves down.
4. **Keep sfx on through the wall,** so the bell rings on into the next cut.
5. **Check it.** Band-pass the final WAV at 4–7 kHz and compare the click onsets with the frames the number changes on. v4 measured all 25 ticks within 8 ms (under a frame).

## 3. Making a new cut with `tools/trailer`

1. **Copy a timeline.** Copy `timeline-v4.mjs` (the flagship ad), `timeline-v3.mjs` (a trailer) or `timeline-v3ad.mjs` (a 15 s ad, with `OPENINGS` a/b/c) to `timeline-<name>.mjs`. Shared pieces are in `v3-common.mjs` (`SETTLE`, `storage`, `blurCut`); page helpers are in `v3-page.mjs`.
2. **Write the beats.** A timeline exports:
   - `FPS`, `SIZE`, `DURATION`, `POSTER`, `AUDIO_LEAD`, `LUFS`, `SHEET_FPS`;
   - `storage()`, the save to start from;
   - `PREROLL`, the actions before t = 0 (set the hook's stone up here, so its sounds play before recording);
   - `PAGE_HELPERS`;
   - `buildTimeline()`.

   Actions are `at(t, helper, ...args)` for both passes, `vat` for video only (`ff`) and `aat` for audio only. A cut is `blurCut(tl, t, setup, { ff })`.
   - Set a stone up with `prep(finals, rows, keepFrac)`.
   - Then `tap` and `rowTap` / `rowTap2`.
   - **After a winning tap at w, schedule nothing that leaves the shot before `w + SETTLE`.**
3. **Draft:**
   ```
   PORT=5231 node server.js
   PORT=5231 TRAILER=<name> SCALE=1 node tools/trailer/capture-video.mjs /tmp/draft.mp4
   ```
   Add `LIMIT=secs` or `CUT=secs` as needed. Read the log: every `taps` entry should show `hit: true` with `mistakes: 0`; `caps` gives the caption boxes in %.
4. **Final:** `TRAILER=<name> node tools/trailer/capture-video.mjs`, then `capture-audio.mjs`, then `build.mjs`. The outputs are `trailer/strata-trailer-<name>.mp4`, `-silent`, a poster and a contact sheet. The mp4s are gitignored. `TRAILER` unset means v1.
5. **Check:**
   - Look at the frames just before every cut that follows a reveal: the object must face you and be still.
   - Check loudness with `ffmpeg -af ebur128=peak=true`.
   - Check the caption boxes.
   - Listen (nobody has, so far).

**The browser lock.** `C:/Users/Kellan/AppData/Local/Temp/strata-browser.lock` is a mkdir lock that each script takes itself. Never run two browsers at once.

**Gotchas:**
- **Timelines go stale when the game changes.** v1 broke when the title screen arrived. Re-measure these after any change to the finale or the result screen:
  - `SETTLE` (`settle.mjs`);
  - `GEMS_AT = 4.1`;
  - `BEAT = 60/72`;
  - the shrine card's 1.92 s hold;
  - 750 ms per stone for the companion.
- **The canvas is scaled during a blur.** Taps go through its box, as `pick()` does.
- **Accidental double-taps.** Taps under 0.35 s apart and within 30 px, on a 0 line, cascade. `H.tap` keeps 40+ px between taps.
- **The sound pass is real time.** Where the picture fast-forwards, play the moment yourself (`gem`, `star`, `finishResult`).
- **The mist parts only when the map opens from play**, for a reached chapter not in `strata.map.parted`. Put the companion one stone before the first open stone.
- **A shrine's card and bells need the map's own entry.** Tap its node.
- **The contact sheet's 1 fps sampling lands between beats.** Use `SHEET_FPS = 2`.

## 4. What we tried, in order

1. **v1 (Saturday, 4179a05), 28 s.**
   - Structure: chisels, peel, the Wishing Well reveal, a montage of 4 settled objects, the map, v1's end card.
   - Kellan's revisions:
     - final taps, rotations and the best objects;
     - "100+ puzzles";
     - store icons, no tagline;
     - blur cuts and animated text;
     - a 15 s ad ending on the Dragon Head;
     - a slower TAP / PEEL / REVEAL.

   The revised branch is lost, but Saturday's 15 s ad itself survives as `trailer/reference/saturday-ad-15s.mp4`.
2. **v2 (fcf3b40), 29.7 s.** One continuous journey. **Rejected:** slow, and it read as a mechanics walkthrough. Continuity alone isn't compelling.
3. **v3, first cut (71dcd80).**
   - What it had: 10 reveals in 28 s, a jump inside each flash, kinetic captions, a 0 → 150+ journal wall, and a title-screen end card with badges.
   - **Rejected parts:**
     - objects were cut mid-whirl (68° still to turn at 2 s);
     - the end card and the wall had to go back to "the previous video".
4. **v3, revised.** Every reveal lands (3 in the trailer, 2 in the ad); no flash jumps.
   - The v1 end card and a v1-style map-trail wall were tried here, then **rejected**: "the previous video" meant Saturday's ad, now in `trailer/reference/`.
5. **v3, matched to the reference.** Saturday's wall, CTA and caption style; the map-to-title end sequence.
6. **v4, the flagship ad (21.4 s, `timeline-v4.mjs`).**
   - The order: the Dragon Head's "one tap left…" as the hook; TAP / PEEL / REVEAL on the Sloth; COLLECT THEM ALL; the wall; the end sequence.
   - Changes: the rolling-number ticks, heavier captions, and the name card hidden under COLLECT.
   - Length: 21 s, near the puzzle optimum of about 22 s. The 4.8 s rule leaves a 15 s ad room for only two reveals and nothing else.

## 5. Open questions and A/B ideas (once real ad data exists)

- **Ad openings** (`timeline-v3ad.mjs` OPENINGS):
  - **a**: mechanic into payoff;
  - **b**: payoff first, where all three gems chime inside the hook;
  - **c**: tension.

  Compare their 3 s hold rates.
- **Saturday's ad ended on "one tap left…"** without the reveal, a cliffhanger. v3 lands the reveal instead. Worth testing both.
- **A persistent caption for the whole ad**, against beat captions.
- **A calm claim** ("no timers") against curiosity ("what's inside?").
- **A long cut** of 45–60 s, which has room for more full reveals.
- **An App Store preview cut**: the end card's URL mentions the web build, so check Apple's rules before using it.
