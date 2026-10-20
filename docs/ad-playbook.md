# Strata ad and trailer playbook

Read this before making any Strata ad or trailer. It is the distilled, living guide: update it when a cut teaches something new. The dated research log, with sources and experiments, is [trailer-study.md](trailer-study.md).

## Kellan's standing decisions

- **Let reveals land fully; never cut mid-rotation.**
  - Every reveal plays until the object has turned all the way to face the viewer and stopped. That takes **4.8 s after the winning tap**, measured with `tools/trailer/settle.mjs` from the finale's own state (within 1.5° of rest and turning under 2°/s, at 4.77 s for every object tested). At 2 s, 68° of turn is still left; at 3 s, 16°.
  - Never jump forward inside the flash, and never speed the animation up.
  - To save time, show fewer reveals, or show objects that are already settled (gems landing).
- **The end card is v1's** (`timeline.mjs`): STRATA, the gem, "free · plays in your browser", kellanm.github.io/strata, on v1's warm gradient. Left out: its tagline line, because brief 2 says no tagline, and the store badges. Whether to reinstate either is a question for Kellan; see section 5.
- **The wall is v1's "100+ puzzles"**: wording "100+ puzzles", in v1's caption style. It must not be reworded (not "150+"), restyled or replaced with something else.
  - The Saturday revision that first built the wall is lost, so the current wall is a reconstruction in v1's own language: v1's map-trail scroll, with v1's caption set inside the safe box.
- **Real gameplay only.** Time can be cut between shots, under a blur, but never inside a reveal. Play is never faked.
- **No tagline on the title card.**

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
- Kellan's picks: Maneki-neko, Dragon Head, Kokeshi, Origami Fox, Windmill, Pumpkin, Koala, Moss Tortoise.
- Also strong at phone size: Armillary Sphere (gold), Anglerfish (teal sky), Mikoshi, Tin Carousel, Clock Tower, Great Lantern Gate, Ringed Planet.
- Lantern Festival objects all share the crimson sky, so alternate skies in a montage.

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

**Captions:**
- The game's typeface, uppercase.
- v3 beat captions: semibold, 29 px for lines and 50 px for verbs at 540 wide (×2 in the output). The letters blur and rise in, 34 ms apart.
- The wall uses v1's own caption: 500 weight, 17 px, .34em tracking, ink `#4a3d63` with a cream glow, a fade and rise.
- At most about 62% of the width when centred.
- Hold a caption through a flash, but clear it before the object's name settles in at about +1.1 s.

**Safe zones** (1080×1920, combined TikTok, Reels and Shorts):
- Keep text inside y 15–64.5% and x 11–82%.
- v1's caption positions (64.5% and 71%) fall outside that box; v3 sets v1's caption at 57%.
- The game's object names sit at 4–14%. That is game UI, so leave it.

**End card:** v1's (see the decisions above). It fades in over 0.9 s, on top of the settled final object. Hold it 3 s in the trailer and 2.5 s in the ad. The official badge artwork is kept in `tools/trailer/badges/` in case Kellan wants badges back. Unused for now.

**Sound:**
- Master to −14 LUFS integrated, true peak −1.5 dB.
- Use the game's own sound. Trailer accents (whoosh, gem chime, final chord) are played on the game's audio engine voices.
- Cut on taps and gems. The bed has no beat.
- Montage shots of settled objects are muted, with a chime on each gem as it lands.

## 3. Making a new cut with `tools/trailer`

1. **Copy a timeline.** Copy `timeline-v3.mjs` (a trailer) or `timeline-v3ad.mjs` (an ad, with `OPENINGS` a/b/c) to `timeline-<name>.mjs`. Shared pieces are in `v3-common.mjs` (`SETTLE`, `storage`, `blurCut`); page helpers are in `v3-page.mjs`.
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

   The revised branch is lost.
2. **v2 (fcf3b40), 29.7 s.** One continuous journey. **Rejected:** slow, and it read as a mechanics walkthrough. Continuity alone isn't compelling.
3. **v3, first cut (71dcd80).**
   - What it had: 10 reveals in 28 s, a jump inside each flash, kinetic captions, a 0 → 150+ journal wall, and a title-screen end card with badges.
   - **Rejected parts:**
     - objects were cut mid-whirl (68° still to turn at 2 s);
     - the end card and the wall had to go back to v1's.
4. **v3, revised.**
   - Every reveal lands: the trailer has three full reveals plus four settled objects; the ad has two.
   - v1's end card and v1's "100+ puzzles" wall.
   - No flash jumps, which also fixed the bells drifting off the picture.

## 5. Open questions and A/B ideas (once real ad data exists)

- **Ad openings** (`timeline-v3ad.mjs` OPENINGS):
  - **a**: mechanic into payoff;
  - **b**: payoff first, where all three gems chime inside the hook;
  - **c**: tension.

  Compare their 3 s hold rates.
- **For Kellan:** should the end card regain v1's tagline line, or gain the store badges, once the game is in stores?
- **The lost wall:** if Kellan remembers a different 100+ wall from Saturday (a grid, say, rather than the trail), rebuild it to that.
- **A persistent caption for the whole ad**, against beat captions.
- **A calm claim** ("no timers") against curiosity ("what's inside?").
- **A long cut** of 45–60 s, which has room for more full reveals.
- **An App Store preview cut**: the end card's URL mentions the web build, so check Apple's rules before using it.
