# Strata ad and trailer playbook

Read this before making any Strata ad or trailer. It is the distilled, living guide: update it when a cut teaches something new. The dated research log, with sources and experiments, is [trailer-study.md](trailer-study.md).

## 1. Principles (with evidence)

| Principle | Evidence |
|---|---|
| Something moves by 0.5 s, and no logo opens the ad. | Meta Ad Library, sampled muted: Block Blast 4127189990777035 is mid-game at 0 s; Color Block Jam 955285320353998 has a hand already moving at 0 s; Royal Match 3119331334938178 has the King in peril by 1 s. Derek Lieu: viewers leave if they don't know what the video is about "within the first second or two" ([GameDiscover](https://newsletter.gamediscover.co/p/tiktok-practical-advice-for-big-discovery)). |
| It has to work muted. Words carry it; the game's sound is the bonus. | AppLovin: "most mobile gamers play with sound off"; captions gave +64% D0 ROAS (for a sleep app) ([AppLovin](https://applovin.com/en/resources/high-performing-video)). Color Block Jam keeps "NO TIMER!" on screen for all 37 s. Nonogram.com 1824481918711949 keeps a two-line challenge caption on screen throughout. |
| Show one readable deduction, then the payoff. | Meowdoku ads fail when the viewer can't see a step they could solve ([AppGrowing](https://appgrowing.net/blog/en/royal-match-ad-creative-analysis-king-in-peril-hooks-and-pick-ctas/), secondary). Strata version: a row of 0, double-tapped away, then the last tap. |
| Payoff density beats explanation. Reward shots should outnumber mechanics shots. | Kellan's notes on v1 and v2. Block Blast pays off about every 2 s (score jumps, combos). |
| Show a finger: touch rings on every tap. | Unity's video best practices (search summary). Color Block Jam's hand pointer. |
| End on a separate card, not the last gameplay frame. | Smadex via AppTweak: about 3× IPM when the end card differs from the last frame ([AppTweak](https://www.apptweak.com/en/aso-blog/improve-creatives-performance-for-mobile-gaming-ad-campaigns)). Block Blast and Color Block Jam end on logo + search bar typing the name + both badges. |
| Length: about 15 s for Reels and TikTok; puzzle optimum about 22 s with an App Store end card; long 45–60 s cuts dominate Meta's top impressions. | Liftoff/Vungle via [GameDev Reports](https://gamedevreports.substack.com/p/vungle-and-liftoff-optimal-video). Meta Ad Library: Block Blast's top-impression ads run 54–63 s. |
| Real gameplay only. Time can be cut (under a blur or the win's flash); play can't be faked. | Kellan's marketing rule. Apple: previews "may only use video screen captures of the app itself" ([Apple](https://developer.apple.com/app-store/app-previews/)). |

## 2. Strata specifics

**Hero objects** (survey: `tools/trailer/survey.mjs`; v3 used these):
- Kellan's picks: Maneki-neko, Dragon Head, Kokeshi, Origami Fox, Windmill, Pumpkin, Koala, Moss Tortoise.
- Also strong at phone size: Armillary Sphere (gold), Anglerfish (teal sky), Mikoshi, Tin Carousel, Clock Tower, Great Lantern Gate, Ringed Planet.
- All Lantern Festival objects share the crimson sky. Alternate skies in a montage (peach, crimson, teal, lavender, gold), never two crimsons in a row.

**Best moments:**
- the last tap: flash, leap, whirl, colour sweep, then the name typing in;
- the double-tap row cascade (a ripple, then notes climbing);
- gems landing one a beat, each with its chime;
- the Dragon Head turning to face you;
- the mist parting over a new world;
- a shrine's "✦ The Shrine of ✦" card, then its block assembling;
- the journal wall rushing past;
- the night sky pulling down over the map to the title.

**Reads poorly:**
- a full untouched block (a beige cube of numbers);
- peel, unless you already know the game;
- the map's First Light header, which is pale pink and empty;
- whole reveals in real time: the colour sweep takes 1.8 s.

**Captions:**
- The game's typeface, uppercase, semibold.
- Sizes, at 540 CSS wide (the 1080 output is ×2):
  - 29 px for lines;
  - 50 px for single verbs;
  - 92 px for numbers.
- 3–4 words per line, at most about 62% of the width when centred. Split longer lines into two.
- Ink `#43355e` with a cream glow on light skies; cream with a dark shadow on dark skies.
- Animation: each letter blurs and rises in, 34 ms apart, and leaves upward, blurring out.
- Hold for at least 1.1 s; aim for 1.5 s + 0.3 s a word.

**Safe zones** (1080×1920, combined TikTok, Reels and Shorts):
- Keep text and the end card inside y 15–64.5% and x 11–82%.
- The game's own object name sits at 4–14% (it's game UI, leave it). Don't put a caption at 17% when a name is showing unless you mean them to stack.

**End card** (2.5 s in the ad, about 2.5–3 s in the trailer):
- The game's real title with its god rays, minus its tagline and "swipe up". The logo stone is drawn at zoom 0.74.
- Above it: "FREE TO PLAY", a search pill typing STRATA, then the official, unmodified badges side by side:
  - Apple's black badge first, 48 px tall at 540;
  - the Google Play badge at the same visible height.
- The trademark lines go small at the bottom.
- The badge artwork is in `tools/trailer/badges/`: from developer.apple.com and play.google.com, unedited.
- No tagline. No badges or Google mention in an App Store preview cut.

**Sound:**
- Master to −14 LUFS integrated, true peak −1.5 dB.
- The game's own sound only. Trailer accents (whoosh, chimes, final chord) are played on the game's audio engine voices.
- The bed is ambient with no beat, so cut on taps, flashes and gems, not on bars.
- Design it muted first. Sound is the reward for the people who unmute.

**Copy:**
- Say "150+ puzzles" (158 stones; `WALL_COUNT` reads it from the code).
- No "best", no "#1".

## 3. Making a new cut with `tools/trailer`

1. **Copy a timeline.** Copy `timeline-v3.mjs` (a trailer) or `timeline-v3ad.mjs` (an ad) to `timeline-<name>.mjs`. Shared pieces are in `v3-common.mjs`; the page helpers are in `v3-page.mjs`.
2. **Write the beats.** A timeline exports:
   - `FPS`, `SIZE`, `DURATION`, `POSTER`, `AUDIO_LEAD`, `LUFS`, `SHEET_FPS`;
   - `storage()`, the save to start from;
   - `PREROLL`, the actions before t = 0;
   - `PAGE_HELPERS`;
   - `buildTimeline()`.

   Inside `buildTimeline()`, actions are `at(t, helper, ...args)` for both passes, `vat` for video only (`ff` fast-forwards) and `aat` for audio only. `blurCut(tl, t, setup, { ff })` is the standard cut.
   - Set a stone up off-screen with `prep(finals, rows, keepFrac)`.
   - Then `tap` and `rowTap` / `rowTap2` (a double-tap).
   - To jump inside the flash: `vat(tapTime + 0.18, 'ff', 1.25)`.
3. **Draft:**
   ```
   PORT=5231 TRAILER=<name> SCALE=1 node tools/trailer/capture-video.mjs /tmp/draft.mp4
   ```
   Start the server first with `PORT=5231 node server.js`. Add `LIMIT=secs` to render only the start, or `CUT=secs` to stop the actions after that time. Read the log line: `taps` (each `hit: true`, `mistakes: 0`), `preps`, `rows`, and `caps` (caption boxes in % of the frame).
4. **Final:**
   ```
   TRAILER=<name> node tools/trailer/capture-video.mjs
   TRAILER=<name> node tools/trailer/capture-audio.mjs
   TRAILER=<name> node tools/trailer/build.mjs
   ```
   The outputs are `trailer/strata-trailer-<name>.mp4`, `-silent`, `poster-<name>.png` and `contact-sheet-<name>.png`. The mp4, webm and wav files are gitignored. `TRAILER` unset means v1.
5. **Check:**
   - Look at the contact sheet and at frames around every cut.
   - Run `ffmpeg -i out.mp4 -af ebur128=peak=true -f null -` to check loudness.
   - Check the caption boxes against the safe zone.
   - Listen with sound (nobody has, so far).

**The browser lock.** Each script takes `C:/Users/Kellan/AppData/Local/Temp/strata-browser.lock` itself (a mkdir; it goes stale after 20 min). Never run two browsers at once. Anything else that opens Chrome must take it too.

**Gotchas:**
- **Timelines go stale when the game changes.** v1 broke when the title screen arrived (fix: a `PREROLL` with `enterMap`). Re-draft old timelines after any change to play, map, title or result timing. Values that come from game code:
  - `GEMS_AT = 4.1` (`showResult`: 1.8 + 2.3 s);
  - `BEAT = 60/72`;
  - a 1.92 s shrine card hold;
  - 750 ms per stone for the companion.
- **The canvas is scaled during a blur.** Taps go through its box, as `pick()` does. Don't tap during a cut anyway.
- **Accidental double-taps.** Two taps under 0.35 s apart and within 30 px, on a 0 line, run a cascade. `H.tap` keeps 40+ px between taps.
- **The sound pass runs in real time and can't fast-forward.** Where the picture jumps, play the moment yourself: `finishResult`, then `star(k)` at the picture's gem times. Set up hook stones in `PREROLL` so their assembly sounds happen before recording.
- **The mist parts only when the map opens from play** (`celebrate`), and only for a reached chapter missing from `strata.map.parted`. Put the companion one stone before the first open stone (`storage(reveals, walkTo)`).
- **A shrine's card and bells need the map's own entry.** Tap its node; `level('bonus-…')` skips the card.
- **`level()` zoom is a framing choice.** Keep it at 1.0 for levels; the reveal re-frames itself.
- **The contact sheet's 1 fps sampling lands between beats.** Use `SHEET_FPS = 2`.

## 4. What we tried, in order

1. **v1 (Saturday, 4179a05), 28 s.**
   - Structure: a hook on chisels; "every tap is a note"; peel; the Wishing Well reveal; a 4-object montage; the map; a custom end card.
   - Kellan's revisions:
     - fewer mechanics, more final taps and rotations of the best objects (neko, dragon, kokeshi, origami fox, windmill, pumpkin);
     - "100+ puzzles";
     - store badges, no tagline;
     - blur cuts, fast;
     - "an optimized game ad funnel" with animated text;
     - then a 15 s ad ending on the Dragon Head ("one tap left…"), a slower TAP / PEEL / REVEAL, the 100+ wall, and montages of 6 and 4.

   Those revisions lived on a branch that no longer exists.
2. **v2 (fcf3b40), 29.7 s.** One continuous journey: Koala, then the map, then the mist, then the Moss Tortoise shrine, then the title. **Rejected:** slow, and it read as a mechanics walkthrough, not rewards. The lesson: continuity is not compelling on its own. Density of payoffs is.
3. **v3 (this cut), 28.4 s trailer + 15 s ad with 3 openings.**
   - Back to v1's structure, with 10 reveals.
   - Every montage shot is a real last tap, and the picture jumps inside the flash.
   - Kinetic captions, blur cuts, touch rings.
   - The map's mist parting, a shrine, a finger turning the Dragon Head.
   - A 0 → 150+ wall.
   - The real title as the end card, with a search bar and badges.

   See the log for the weak spots.

## 5. Open questions and A/B ideas (once real ad data exists)

- **Ad openings** (`timeline-v3ad.mjs` OPENINGS; only the first 2.3 s differ):
  - **a**: mechanic into payoff, "what's inside?" with the row cascade and the last tap;
  - **b**: payoff first, frame one is the last tap, "uncover / what's hidden";
  - **c**: tension, "one more tap…" held.

  Compare the 3 s hold rate (Meta: 25–30% is baseline, 40%+ is good).
- **A persistent caption for the whole ad** (Nonogram.com's style) against beat captions.
- **A calm claim**, Color Block Jam style: "no timers" or "no rush", against a curiosity line.
- **A long cut** of 45–60 s for rewarded placements.
- **A ladder**, e.g. "dragon ✓ neko ✓ … 150+", in place of the journal wall.
- **The CTA line:** "free to play", or Royal Match style ("choose your next world").
- **An App Store preview cut:** no badges, no Google mention, dissolves only, and the game's name only in the UI.
- **Do the badges oversell** before store launch? Decide before running paid ads.
