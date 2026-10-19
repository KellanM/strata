# Ads study: where Strata shows ads and offers gifts (2026-10-19)

This is the study record. Read it before you repeat the research. It is about **in-game** ads and incentives. Marketing trailers are covered in `docs/ad-hooks-study.md`.

## Brief

Kellan wants Strata to be free and ad-supported, so that the ads fund development. The ads must not make the game frustrating.

- **Release plan:** App Store and Play Store, through a Capacitor wrapper, with AppLovin MAX as the mediation layer. Until then, prototyping continues in the web app.
- **Kellan's two ideas:**
  - after 10 wrong moves, watch an ad to recharge;
  - an ad every X levels.
- **A prior take, to be tested rather than assumed:**
  - no mistake-gated energy;
  - rare interstitials at natural breaks, with caps, and none in the tutorial or the first chapter;
  - opt-in rewarded ads: restore a gem, a hint lantern, perhaps open a shrine early;
  - a one-time Remove Ads purchase;
  - no banners.

**What must not change:** Strata's calm (Journey, Monument Valley, Shadow of the Colossus), the minimal UI, and the rules already built:
- slips are safe and the cube is kept;
- stars reward a clean hand, not speed, and you always get at least one;
- tools never cost a gem;
- there is no timer pressure;
- level progress is saved mid-level.

### Success criteria (what we review against)

1. **No ad interrupts play or a payoff.** No ad appears while a stone is in progress, and none over the reveal, the score count-up or the gems landing.
2. **The first session is ad-free.** That covers the 12 lessons and the whole of First Light. *(First Light is chapter I; the tutorial ends there.)*
3. **Rewarded offers feel like gifts, not tolls.**
   - The player asks for them.
   - They pay out more than they cost.
   - They are never the only way forward.
   - They never appear at the moment of failure.
4. **Guessing stays safe.** No ad becomes the price of a mistake.
5. **Honest and minimal.**
   - Every ad is labelled as an ad before it plays.
   - No surface shows an ad without the player knowing what's coming.
   - At most one ad-related element is on screen at a time.
6. **Paying once ends it.** Remove Ads removes every forced ad, permanently.

## Sources

The labels mean:
- **[F]**: the page was fetched and read.
- **[S]**: only a search-result snippet was seen.

I could not install any app, play any ad-supported game, or watch any video. Statements about how exemplars place their ads therefore come from store listings, reviews, press and practitioner quotes, not from direct observation. Any frequency attributed to a game is what reviewers report, not something I measured.

### Exemplars, and why each was studied

| Exemplar | Why it merits study | What was inspected |
|---|---|---|
| **Nonogram.com** (Easybrain) | The closest genre match. The largest ad-supported nonogram. | US App Store listing [F]; App Store reviews [F]; justuseapp review aggregation [F] |
| **Crossy Road** (Hipster Whale) | The most-cited case of opt-in video ads that players liked. The creators explained their reasons publicly. | Droid Gamers / Unity interview [F]; Game Developer [F]; Thumbsticks' GDC 2015 report [F]; Mobile Dev Memo [F]; PocketGamer.biz [F] |
| **Alto's Adventure / Odyssey** (Snowman) | Calm and art-led, the closest tonal match. A premium iOS game that went free on Android with opt-in ads. | AndroidGuys review [F]; GSMArena / Android Central on Odyssey [S] |
| **I Love Hue** (Zut!) | A calm colour puzzle whose reviewers praise how its ads are handled. | US App Store listing and reviews [F] |
| **Wordscapes, Woodoku, Block Blast, Unpuzzle** | High-revenue casual puzzle games: the industry default for interstitial cadence. | Wordscapes App Store [F]; AppLixir's Block Blast deconstruction [F]; Woodoku and Unpuzzle reviews [S] |
| **Two Dots** | A puzzle game with a design-led brand and lives / moves IAP. | App Store [F]; Tom's Guide and Game Developer [S] |
| **Picross S / e, and ad-supported picross apps** | Genre: Nintendo-style premium, set against ad-heavy clones. | dekudeals prices [S]; reviews of "IQ Logic Pic", "Nonogram: Picture Cross", "Nonograms 999" [S]; "Nonogram – Offline Picross" App Store [F] |
| **Monument Valley** (ustwo) | The brand reference point. Premium, then a paid expansion, then Apple Arcade and Netflix. | PocketGamer.biz on ustwo's 2015 figures [F]; mobilegamer.biz on MV3 [F]; PhoneArena and VGC [S] |
| **Polytopia, Smash Hit** | Praised for refusing aggressive monetisation. | PocketGamer.biz interview with Lövstedt [F]; Smash Hit store text [S] |

### Platform rules, SDK documentation and research

**Platform rules**
- **Apple App Store Review Guidelines** [F] https://developer.apple.com/app-store/review/guidelines/
  - 2.5.18: interstitials "must clearly indicate that they are an ad… must provide easily accessible and visible close/skip buttons", and apps "must also include the ability for users to report any inappropriate or age-inappropriate ads".
  - 3.1.1: unlocking features "must use in-app purchase".
  - 3.2.2(x): "Apps may otherwise incentivize users to take specific actions within apps (such as by completing a level or watching an ad)". Rewarded ads are explicitly allowed.
  - 5.1.1(ii), 5.1.2(i): tracking requires ATT, and nothing may be gated on, or rewarded for, granting it.
  - 1.3: the Kids Category "should not include third-party analytics or third-party advertising".
- **Apple, User privacy and data use** [F] https://developer.apple.com/app-store/user-privacy-and-data-use/: an ad SDK that combines data across apps counts as tracking. A pre-prompt is allowed "so long as you are transparent".
- **Google Play**
  - **Ads policy** [F] https://support.google.com/googleplay/android-developer/answer/9857753
    - "Full screen interstitial ads… that show unexpectedly, typically when the user has chosen to do something else, are not allowed."
    - "Ads that appear during game play at the beginning of a level… are not allowed."
    - Interstitials "not closeable after 15 seconds are not allowed".
    - "This policy does not apply to rewarded ads which are explicitly opted-in by users."
  - **Better Ads Experiences** [F] https://support.google.com/googleplay/android-developer/answer/12271244: a natural break is "the break after the score screen in a gaming app".
  - **Families** [F] https://support.google.com/googleplay/android-developer/answer/9893335: this programme forbids interstitials "immediately upon app launch" and offers that can't be exited after 5 s, and it requires self-certified ad SDKs.
  - **Payments** [F] https://support.google.com/googleplay/android-developer/answer/9858738: Play Billing is required, and its examples include "an ad-free version of an app".

**AppLovin MAX**
- **Create an ad unit** [F] https://support.applovin.com/en/max/max-dashboard/ad-units/create-an-ad-unit
  - "you can set a frequency cap for full-screen and rewarded formats".
  - Placements are named in the SDK for per-placement reporting.
  - Use one ad unit per format.
- **App open ads** [F] https://support.applovin.com/en/max/ios/ad-formats/app-open-ads
  - "Wait until new users open the app and use it a few times before you show the first App Open Ad".
  - Show a splash first.
  - "Use a frequency cap that you manage outside AppLovin".
- **Rewarded video tips** [F] https://support.applovin.com/en/best-practices/tips-for-using-rewarded-videos-more-effectively
  - Place rewards where the user needs "a hint" or "another life".
  - "Placement is frequency-capped. This ensures the reward does not become saturated."
  - "offer only one or two rewarded videos per day".
- **Ad Review overview** [F] https://support.applovin.com/en/max/ad-review/overview: lets you see the creatives that ran and find problematic ones. Category flagging and blocking are described only in a blog snippet [S].
- **Terms and Privacy Policy Flow** [F] https://support.applovin.com/en/max/android/overview/terms-and-privacy-policy-flow: the SDK automates Google UMP (in GDPR regions), then its own terms and privacy flow, then the ATT prompt on iOS.

**Industry evidence**
- **Unity / ironSource, rewarded ads and IAP** (2022) [F] https://unity.com/blog/understanding-the-impact-of-rewarded-ads-on-iap-retention-and-engagement
  - Across 8 apps, users who engaged with rewarded ads were "4.5 times more likely to make in-app purchase".
  - Those who watched one in week 1 had 30-day retention "of at least 50%, compared to the benchmark of 13%".
  - **Observational and self-selected:** engaged players both watch and buy, so this is not evidence that the ads cause the effect.
- **ironSource, interstitial best practices** (2021) [F] https://unity.com/blog/best-practices-for-maximizing-revenue-from-interstitial-ads-in-your-app
  - A first interstitial "from Level 3 to Level 8" gave better retention and ARPU than Level 1, in hyper-casual games.
  - Serve interstitials "only… at natural breaks".
  - If D1 drops, reduce frequency.
- **Appodeal (vendor)** [S]: an *earlier* first interstitial gave about +20% ARPU with "no negative impact" on 12-day retention. This is counter-evidence, so the timing of the first ad is an empirical question.
- **Unity player survey via GamesBeat** (2016) [F] https://gamesbeat.com/unity-the-majority-of-mobile-gamers-are-open-to-engaging-with-incentivized-video-ads/: preferred format was incentivised video 46%, full-screen pop-ups 29%, banners 20%, interstitial video 5%.
- **Hybrid monetisation** [S]: a Deconstructor of Fun episode (2025) claims IAP-focused hybrid games outperform ad-first hybrid models by about 4× (Sensor Tower). This comes from the show notes only.
- **Not found:** no published Remove Ads conversion rate. No rigorous public case where adding interstitials measurably cut retention. Vendor-blog figures like "D7 −10–30%" have no traceable source and are not used here.

**Academic research**
- **Gao et al., arXiv 2008.12112** (2020) [F] https://arxiv.org/abs/2008.12112: 36,309 ad-related reviews. "users care most about the number of unique ads and ad display frequency".
- **NTU Management Review 30(3)** (2020) [F] https://review.management.ntu.edu.tw/ebook/30.3/135: reward-based ads improve viewing decisions, and reward- or permission-based ads yield better attitudes than interstitials. The design details (n=561) are snippet-only [S].
- **Hirsimäki, "Between Beats"**, Oulu MSc thesis (2021) [F] https://oulurepo.oulu.fi/handle/10024/17894: adding rewarded ads to a game with interstitials lowered perceived intrusiveness. A small study (n=51, per snippet [S]).
- **Mishra & Malhotra, IJIM 61** (2021) [F] https://pmc.ncbi.nlm.nih.gov/articles/PMC7525271/: intrusiveness weakens the link between gameful experience and attitude towards in-game ads.
- **Coalition for Better Ads, in-app standard** (2021) [S]: it lists "Interruptive Interstitials… Non-Skippable Interruptive Video Interstitials; and Video Interstitials When Opening an App" as below standard. betterads.org could not be fetched.

**Exemplar URLs:**
- Nonogram.com: https://apps.apple.com/us/app/nonogram-com-number-games/id1452992954 and https://justuseapp.com/en/app/1452992954/nonogram-com-number-puzzle/reviews
- Crossy Road:
  - https://www.droidgamers.com/news/crossy-roads-has-made-a-million-dollars-from-video-ads/
  - https://gamedeveloper.com/business/how-i-crossy-road-i-made-1-million-from-video-ads
  - https://www.thumbsticks.com/crossy-road-how-hipster-whale-reinvented-free-to-play/
  - https://mdm.co/crossy-road-a-case-study-in-mobile-ad-monetization
  - https://www.pocketgamer.biz/making-of-crossy-road/
- Alto's Adventure: https://androidguys.com/reviews/app-reviews/altos-adventure/
- I Love Hue: https://apps.apple.com/us/app/i-love-hue/id1081075274
- Wordscapes: https://apps.apple.com/us/app/wordscapes/id1207472156
- Block Blast: https://www.applixir.com/?p=4308
- Two Dots: https://apps.apple.com/us/app/two-dots-fun-dot-game/id880178264
- Nonogram – Offline Picross: https://apps.apple.com/us/app/nonogram-offline-picross/id1477321837
- Monument Valley: http://www.pocketgamer.biz/monument-valley-massive-success-or-upside-cap/

### Baseline (the game today, untouched)

These were captured at 390×844 by `shots/ads/capture-base.mjs` from commit d207eba, with the first 21 stones seeded as solved. They are also the backdrops of the styleframes, in `public/proto/ads/*.jpg`.
- `shots/ads/base-play.png`: No. 22 Snail (Moss Garden) in play.
  - The HUD has the menu button at top left, the name / time / slips in the centre, and an **empty 46 px slot at top right** (`.hud-spacer`).
  - Chisel and Mark sit at the bottom.
- `shots/ads/base-result.png`: the finale with one slip.
  - It shows "YOU UNCOVERED / SNAIL", the story line, the object turning in rays, two lit gems and **one hollow gem slot**, and the score 760.
  - Below it are the words Map · Replay · **Next** (outlined).
  - There is no panel; the result lives in the 3D scene.
- `shots/ads/base-map.png` and `base-help.png`: the map, and How to play over it.
  - How to play already holds the settings: the Sound and Music toggles, and the version line that opens the hidden developer panel.

Facts from the code that the design relies on:
- `win()` stages the reveal at about 0–1.8 s, then `showResult` counts the score up for about 1.3 s and lights the gems one per beat. `#actions` appears last, at roughly 3–4 s.
- `goNext()` washes into the next stone's sky through `washInto()`. A stone can be left mid-level and resumed, so leaving for an ad never costs progress.
- The stuck nudge (`nudgeAfter`, `findMove`) already finds "a row with a move" and lights it. It is free on levels 1–3 after 25 s of stillness.
- Shrines open at 12 stars per chapter (`SHRINE_STARS` in map.js), and never block the main path.
- Stars are 3 for no slips, 2 within `slipAllowance`, and 1 otherwise (`score.js`).

## Findings

Each finding is in four parts:
- **Claim:** what a practitioner or source says.
- **Observed:** what can be located.
- **Interpretation:** what it means.
- **Application:** what Strata should try, and how to tell whether it worked.

### 1. Never tie an ad to a mistake

- **Claim:** Matt Hall (Crossy Road, GDC 2015 via Thumbsticks [F]): "The last place you want a player to feel bad is when they've just lost a game." On a "save-me" button: "if we sold coins and had a 'save-me' button and it felt like the other games, would anyone have cared?" (Polygon, quoted by Mobile Dev Memo [F]).
- **Observed:** Nonogram.com's listing says "Get extra lives if you make a mistake" [F]. Its reviews name this loop as the main grievance:
  - "Lose 3 lives, and you have to watch an ad… to get one more" (FleshyHeadedMonkey, 2022) [F];
  - "the ads we're forced into watching every time we misclick or make a mistake" (Urricuh) [F];
  - "there are now long ads to get more lives" (ZeeYDee) [F].
  - One review reports that the ad "will freeze… and discard your progress" (Hemulen52) [F].
- **Interpretation:** In a nonogram, a "mistake" is often a mis-tap or an honest deduction error, not reckless play. Pricing it with an ad teaches players that thinking out loud is costly. That works against Strata's rule that a slip is safe and the cube is kept. It also moves the ad to the peak of frustration, which is exactly where Hall says players must not feel bad.
- **Application:** Slips keep costing only a gem, never time or an ad. **Review:** in playtests, check whether players guess as freely with ads as without them, and whether anyone says they are "saving" moves.

### 2. Opt-in video works when it pays more than it costs

- **Claim:** Hall: "you reward them with something that would take them much longer than that [the ad's length]" (Thumbsticks [F]). Also: video ads were "a really good way to earn money without getting into people's faces… We just needed to figure out a fun reason for players to watch them" (Droid Gamers [F]). Andy Sum: "Treat your players with respect" (Game Developer [F]).
- **Observed:**
  - Crossy Road made about $3M of its first roughly $10M gross from video ads, as stated at GDC (Mobile Dev Memo [F]).
  - Alto's Adventure on Android: "Free (optional ads)… watch a short video in order to revive Alto… (up to twice per run). There are no mandatory ads" (AndroidGuys [F]).
- **Interpretation:** A rewarded ad feels like a gift when three things hold:
  - the player starts it;
  - the reward is worth more than 30 seconds;
  - declining costs nothing.

  That is the opposite of finding 1, where declining costs your progress.
- **Application:** Strata's rewarded offers are: fill an empty gem (after the payoff, once per stone) and a hint lantern (only when tapped, after the free flames are used). **Review:** the opt-in rate per offer, and whether the stars still mean something to players. See the risk under hit list item 2.

### 3. Interstitials: at breaks, capped, and never ramped up

- **Claim:** Hall's view, via the Thumbsticks writer (the writer's paraphrase, not a quote): interstitials give players "the perfect opportunity to leave the game".
- **Observed:**
  - Reviews of Wordscapes describe cadence growing with progress: "there are now so many ads… more frequent, last longer" (Janiel2452, 2025) [F]. A Play review reports ads every few levels early on and after every level by about level 65 [S].
  - Nonogram.com, without the IAP: "one literally between every puzzle" [F].
  - AppLixir's Block Blast teardown describes interstitials "between rounds… at natural break points rather than mid-board" [F], while users report ads "after nearly every level" [S].
  - I Love Hue's reviewers: "very few ads and no annoying pop-up banners", and "ads, everything is so perfectly managed" [F].
- **Interpretation:** Breaks are the only acceptable place, but a break that recurs after every level turns the break itself into the toll. The resentment in these reviews tracks **frequency and creep**, not the existence of ads.
- **Application:**
  - Show an interstitial only on the way **from a result to the map**, never on Next.
  - Use a time cap and a stone cap, and keep them flat (no ramp).
  - The first session gets none.
  - Precise thresholds are tuning guesses; see the hit list.

  **Review:** day-1 and day-7 retention with and without interstitials (an A/B test in the store build), plus review mining for "ads".

### 4. Rewarded ads correlate with good players; interstitials are the retention risk

- **Claim:** ironSource: show the first interstitial "from Level 3 to Level 8" rather than at Level 1 for better retention and ARPU; serve only "at natural breaks"; if D1 drops, reduce frequency [F]. AppLovin: rewarded placements should be "frequency-capped" so "the reward does not become saturated", and "offer only one or two rewarded videos per day" [F].
- **Observed:**
  - Unity's 8-app study: rewarded-ad users are 4.5× more likely to buy, and have at least 50% 30-day retention against a 13% benchmark [F]. This is self-selected.
  - Unity's survey: 46% prefer incentivised video, against 5% for interstitial video [F].
  - Gao et al.: review complaints centre on ad **frequency** [F].
  - Small academic studies find rewarded or opt-in ads are rated less intrusive than interstitials [F/S].
  - Appodeal reports the opposite of ironSource on first-ad timing [S].
- **Interpretation:** The evidence consistently favours opt-in over forced ads for player attitude. It is *correlational*, not causal, on retention and IAP. Nobody publishes thresholds for a calm game. The safe reading is:
  - rewarded ads are low-risk if they are capped and kept scarce;
  - interstitials are where the risk sits, so delay them and cap them.
- **Application:**
  - The first interstitial comes after First Light, which is well past "Level 3 to 8".
  - Cap lantern ads near AppLovin's saturation warning. The defaults below allow 3 a day, a guess just above their "one or two".
  - Treat every cap as a dial for the store build's A/B tests.

### 5. Clashing ad creative breaks a calm game even when placement is right

- **Observed:** A reviewer of I Love Hue praised its handling but found "the awful casino style ads all the more irritating" [F]. A reviewer of Unpuzzle complained that ads ignore silent mode [S].
- **Interpretation:** Strata cannot style the ad itself, but it can choose what runs.
- **Application:**
  - Block gambling, casino, dating and other adult or "sensitive" categories in MAX's ad review and blocking controls, and on each network.
  - Start the audio of the game's own music ducked out, and never unmute.

  **Review:** take screenshots of every ad seen in the first two weeks of testing.

### 6. The brand reference point earns by being a complete work

- **Observed:** ustwo's 2015 figures (PocketGamer.biz [F]):
  - 2.4M paid sales at $3.99;
  - the $1.99 Forgotten Shores expansion was bought by "576,000 players (or 34 percent of the iOS user base)";
  - about $5.9M net, against about $1.4M development.
  - MV3 launched in December 2024 exclusive to Netflix, "with no microtransactions or ads" [S]. It later went to console and PC [S].
  - Polytopia's Lövstedt: "we don't have in-game currencies or ads… it's vital that we honour our key design philosophy of not monetising aggressively" [F].
- **Interpretation:** Monument Valley never ran ads. Strata's closest analogue to its model is **a single honest purchase that makes the game whole**, which is what Remove Ads becomes when it is priced and framed like a premium unlock rather than an escape from punishment. A third of Monument Valley's iOS players paid for more of a game they loved. That is a useful order of magnitude for players who choose to pay *when the game is good and the ask is respectful*, but it is not a forecast for an F2P conversion rate.
- **Application:** Frame Remove Ads as "keep Strata whole". Make it permanently available in How to play. Make the purchase also turn the rewarded gifts free. **Review:** the conversion rate of Remove Ads in the store build.

### 7. Remove Ads must mean what it says

- **Observed:**
  - Peers price it inconsistently: Nonogram.com "No Ads" $14.99 [F] (a reviewer remembers $4.99); I Love Hue Too $4.99 [S]; Wordscapes $2.99 per Common Sense Media, possibly stale [F].
  - "Nonogram – Offline Picross" sells a $4.99/week to $49.99/year subscription to remove ads [F].
  - It is unclear in peer games whether No Ads also removes the "extra life" videos. One Nonogram.com reviewer says it did; another was unsure [F].
- **Interpretation:** The confusion is itself a grievance.
- **Application:**
  - One price, never a subscription.
  - It removes every interstitial.
  - The rewarded gifts then come **without** an ad. They stay capped as before, so the economy doesn't break.

  **Review:** refund requests and reviews mentioning "paid" together with "still ads".

## The design: a prioritised hit list

Ordered by benefit per unit of risk. Every cap is a **tuning guess**: no source gives thresholds for a calm puzzle game, and they must be set from the store build's own data.

| # | Placement | Trigger | Cap (tuning guess) | Reward | Expected benefit | Risk / tradeoff | How we'd review it |
|---|---|---|---|---|---|---|---|
| 1 | **Remove Ads IAP**, a line under Sound/Music in How to play | Player opens How to play | Always available. Shown nowhere else, except one gentle line on the breath card after the 5th interstitial (one time only) | No interstitials, ever. Lantern flames and gem fills no longer ask for an ad (same caps). Restore purchase | The cleanest revenue for the players who love it. Answers "paying once ends it" | Payers no longer generate rewarded revenue (small). Price is a guess: $3.99 sits in the observed $2.99–$4.99 band; Nonogram.com's $14.99 is an outlier | Conversion per installer; reviews mentioning "paid" |
| 2 | **Fill the empty gem** (rewarded), the hollow gem slot on the result | Only after the gems landed and `#actions` showed; only when stars < 3 | Once per stone, ever. Not offered on shrines or lessons | That stone's next gem (2 → 3 or 1 → 2). The score is unchanged | A gift at the high point. Tops up shrine stars without a replay | **Devalues "three gems = no slips"**, and makes shrine stars indirectly ad-reachable. Mitigations: one gem per stone; the journal could still record "flawless" separately. An open question for Kellan | Opt-in rate; whether players replay for real 3-gem solves less (replay rate before/after) |
| 3 | **The hint lantern** (rewarded), in the empty top-right HUD slot | Player taps the lantern during a stone (never offered unprompted) | 3 flames to start, plus 1 each morning (stacking to 3). Then one lantern per ad: at most 1 ad per stone and 3 a day (AppLovin warns of saturation above "one or two" a day) | Lights one row with a move (the existing nudge light, `findMove`) | Unsticks players without spoiling the puzzle. The most-requested utility in nonogram apps (Nonogram.com sells hints) | A lantern near the play area is a temptation; mid-stone is the moment of struggle. It's acceptable only because it is pull, not push, and slips stay free | Lantern use per stone by chapter (a spike reveals a badly tuned level); puzzle completion rate |
| 4 | **Interstitial at a break** (forced): result → Map, through a "breath" card in the stone's sky | Tapping **Map** (or leaving a shrine) after a solve. **Never on Next, Replay, mid-stone, or over the reveal** | None in the tutorial or First Light, and none in the first session. Then at most 1 per 4 min of play **and** 1 per 3 solves, and at most about 6 a day | None: it's the price of free, and says so | Most of the forced-ad revenue with the least intrusion. A player chaining Next → Next sees none until they go to the map | A player who uses the map as their hub sees more ads. A deliberately low ceiling leaves revenue on the table | A/B on the caps; D1/D7 retention; session length; review mining |
| 5 | **Shrine early** (rewarded) | Tap a locked shrine | Once per chapter | Opens the shrine before its 12 stars | Small | It cheapens the shrine as a reward for stars; it's the map's ceremony | **Deferred**: build only if data shows players stall below 12 stars |
| 6 | **App-open ad** | Returning after more than 4 h | At most 1 a day, never on the first launch | None | Some revenue | It meets players at the title, Strata's most "work of art" moment | **Rejected for now** (see below) |

### Recommended defaults for `ads.js` (all tuning guesses)

```js
const CAPS = {
  freeUntil: { tutorialDone: true, chapter: 2 },   // no forced ads until First Light is done
  interstitial: { minGapSec: 240, minSolvesBetween: 3, maxPerDay: 6, placements: ['result_to_map', 'shrine_to_map'] },
  rewarded: {
    gem: { perStone: 1 },
    lantern: { startFlames: 3, flamesPerDay: 1, maxFlames: 3, adsPerStone: 1, adsPerDay: 3 },
  },
};
```

## Verdict on Kellan's two ideas

**"10 wrong moves, then watch an ad to recharge": reject.** Reasons:
- It puts the ad at the peak of frustration. Hall's rule, and the most-cited grievance in Nonogram.com's reviews.
- It breaks the promise in How to play that a slip is safe and the cube is kept. It turns every honest guess into a cost, so players stop experimenting, which is how nonograms are learned.
- It needs an energy timer. Strata has no timer pressure on purpose (the game-loop study).
- It punishes mis-taps on a phone, a physical problem rather than a skill one.
- Its styleframe (E) is the only frame that blocks the puzzle. It reads as a toll in every revision: dimmed board, scarcity meter, countdown.

What it was reaching for (some ad revenue tied to difficulty) is better served by the **lantern**. The player pulls it, it helps rather than restores, and it never makes a slip cost more.

**"An ad every X levels": accept the idea in a constrained form.**
- Count **solves**, but also require **time** between ads, so speed players aren't punished.
- Show it only at the **map transition**, never between Next and the next stone, and never over the reveal.
- Start after First Light.
- Keep it flat; never ramp the frequency up with progress (the Wordscapes complaint).

With minSolvesBetween 3 and a 4-minute gap, a typical stone of a few minutes means roughly one interstitial per 3–5 stones, and only for players who go back to the map. That is an estimate from the caps, not a measurement.

## Rejected proposals

- **Mistake-gated energy or recharge.** Verdict above.
- **Banners.** A permanent strip on a minimal screen. Picross reviewers single them out: "now theres a constant banner at the bottom??" (Nonograms 999 [S]). Their revenue is small, and they would sit under Chisel/Mark, inviting mis-taps.
- **App-open ads (for now).** The title screen ("swipe up") is the game's first impression and a crafted moment. AppLovin itself says to wait until new users have opened the app "a few times" and to show a splash first; the Coalition for Better Ads lists "Video Interstitials When Opening an App" as below standard [S]. Revisit only if the interstitial revenue is insufficient, and then only on warm starts after a long absence.
- **Ads in the tutorial or First Light.** These sessions decide retention. An ad-free first session is a success criterion.
- **An interstitial on Next, or over the reveal and score.** That is the payoff; the result card is the emotional peak.
- **Rewarded "continue" or "undo a slip" mid-stone.** It is the mistake-recharge in disguise.
- **Double-the-score for an ad.** Score is the only number that rolls up, and doubling it makes it meaningless. Rewards should be objects (gems, light), not inflation.
- **Pre-roll consent nags and "rate us" pops right after an ad.** Hall: ask only after the player has enjoyed the game for a while (Thumbsticks [F]).
- **A Remove Ads subscription.** Peers that do this ("Nonogram – Offline Picross" weekly / yearly) are the opposite of a calm brand.

## Experiment: styleframes

`public/proto/ads.html` is a static page. It is excluded from the offline cache already, because `tools/build.mjs` skips `proto/`, so build.mjs needed no change.
- It draws the proposed UI with the game's own `style.css` over real captures (`public/proto/ads/*.jpg`) at 390×844, in the Moss Garden palette (`--ink` #526e6c).
- Shots are taken by `shots/ads/shoot.mjs <tag>`.
  - Revision 1: `shots/ads/r1-*.png` and `r1-sheet.png`.
  - Revision 2: `r2-*.png`.
  - Contact sheet: `shots/ads/sheet.png`, which is revision 2.

### Critique of revision 1 (adversarial, against the criteria)

| Frame | Gift or toll? | Minimal? | Legible? | Problem found |
|---|---|---|---|---|
| A · restore gem (an outlined pill under the score) | A gift in timing, but the pill **competes with Next**: two outlined capsules stacked, so which is the primary? | No: a second button row | Yes | The offer is detached from the empty gem it refers to. "This gem" is ambiguous |
| B · lantern | **Toll language:** a "0" badge on the icon and "you have none left" are scarcity cues that nag from the corner all level | Mostly | The glyph read as a bottle | — |
| C1 · breath card | Honest ("a short ad · then the map") | It reused the **chapter card** (numeral, name, line) | Yes | It would tie the chapter ceremony to ads, and the invented line was filler |
| C2 · placeholder | — | Yes | Yes | Fine for a prototype. Real MAX creatives can't be styled |
| D · Remove Ads | A gift | **Two filled buttons** (Remove Ads and Begin): salesy | Yes | It didn't say what payers keep |
| E · mistake recharge | **Toll**, as expected: it dims and blocks the board, with a scarcity meter and a countdown | No | Yes | The control: it shows the rejected mechanic would read badly even in Strata's own type |

### Revision 2 (what changed)

- **A:**
  - The pill is gone.
  - The **hollow gem slot itself is the offer**: a soft light inside it, with two small words under it, "FILL IT / watch an ad".
  - Map · Replay · Next are untouched.
  - The caption was moved below the score line after the first r2 shot showed "760 FILL IT" reading as one phrase.
- **B:**
  - No counter on the lantern.
  - A drawn lantern with a flame.
  - The card only appears when an unlit lantern is tapped: "A lantern lights one row with a move. / a new flame each morning", with [Not now] [Watch an ad].
- **C1:**
  - Only the stone's sky and "a short ad, then the map".
  - The chapter card stays the chapter's.
- **D:**
  - Remove Ads is an outlined secondary; Begin stays the only filled button.
  - Added "then the lantern and gems need no ad".

### Result (my assessment in Chromium; not a player test)

- **A (r2), the strongest.** It reads as part of the gem row rather than a sales surface, and the hierarchy is right. Next still dominates.
  - Discoverability is lower than in r1.
  - The 8.5 px "watch an ad" is at the edge of legibility on a real phone.
  - Check both on a device. If it's missed, raise the caption to 10 px rather than going back to a pill.
- **B (r2).** Calm, honest and pull-only. The glyph now reads as a lantern. The dark primary "Watch an ad" is acceptable, because the player tapped the lantern to get help.
- **C1 + C2.** Honest, and minimal to the point of plainness. That's intended: the ad is the price, and it shouldn't be dressed up as a moment.
- **D (r2).** Quiet and clear. The perk line answers "paying once ends it".
- **E.** It still reads as a toll, which confirms the verdict.

What the experiment did **not** test: motion and timing (the halo on the gem should breathe slowly, and appear only after `#actions`), sound ducking around ads, real ad creatives, and any real player's reaction.

Best frames: `shots/ads/r2-f-gem.png`, `r2-f-lantern.png`, `r2-f-remove.png`. Contrast: `r2-f-recharge.png`.

## Web-prototype plan (not built; production code untouched in this study)

Build ads in the web app behind a tiny interface that a native plugin can implement later.

**`public/js/ads.js`**, a provider-agnostic interface:
```js
// placements: 'result_to_map' | 'shrine_to_map' (interstitial); 'gem' | 'lantern' (rewarded)
export function canShow(placement, ctx) -> boolean      // caps, first-session rule, Remove Ads, provider ready
export function showInterstitial(placement) -> Promise<void>   // resolves when closed (or immediately if !canShow)
export function showRewarded(placement) -> Promise<boolean>    // true only if the reward was earned
export function setProvider(p)                           // 'fake' (web) | 'max' (Capacitor) | 'none'
export const removeAds = { owned(), buy() -> Promise<boolean>, restore() }
```

- **State in localStorage** (prefixed `strata.ads.`, so dev "Reset progress" clears it too):
  - `firstOpen` (time);
  - `lastInterstitial` (time);
  - `solvesSinceInterstitial`;
  - `day` and `dayCounts` ({interstitial, lanternAds});
  - `gemFilled` (set of shape ids);
  - `flames` and `flamesDay`;
  - `removed` (Remove Ads; on the web it's a dev toggle).
- **Fake provider (web).**
  - A full-screen element (`#fake-ad`) labelled "SIMULATED AD", with a 5 s countdown ring and a close button that appears at 0. Reuse styleframe C2.
  - For rewarded: a "close early" button that resolves `false`, so the no-reward path gets exercised.
  - It pauses the music (`sound`) and the clock.
  - The level clock already stops while the player is away (commit db163ff); call the same pause.
- **Hook points in `main.js`** (one-line calls; no restructuring):
  - **The interstitial.**
    - `#act-map` and `#win-menu` handlers: `await ads.breath(palette)` (C1, about 1.2 s), then `await ads.showInterstitial('result_to_map')`, then the existing `openMenu()`.
    - Shrines: the same in `goNext()`'s bonus branch.
    - `goNext()` itself is never touched.
  - **The gem.**
    - In `showResult`, at the same tick that `actions.classList.add('show')` runs, call `if (result.stars < 3 && ads.canShow('gem', {id})) showGemOffer(k = result.stars)`.
    - On `true`: `finale.lightGem(k)`, update `solvedStore[id].stars`, and mark `gemFilled`.
    - Clear it in `clearResult()`.
  - **The lantern.**
    - Put the button in the `.hud-spacer` slot.
    - Tap: if there are flames, spend one, then `nudge = { level: 2, ...findMove() }; applyCues()`.
    - Otherwise open the card (B), then `showRewarded('lantern')`.
    - Hide it in lessons. Levels 1–3 keep their free nudge.
  - **Ordering.** `calmMoment()`, the update reload, should also wait while an ad is showing.
- **Developer panel** (`#dev`): add rows for
  - "Ads: fake / off";
  - "Ad caps: real / always" (ignore caps to test the placements);
  - "Remove Ads owned: on/off";
  - "Reset ad state".
- **Tests** (`test/ads.test.js`, node --test):
  - pure cap logic with an injected clock;
  - first-session rule;
  - day rollover;
  - Remove Ads short-circuits;
  - gem once per stone;
  - flames refill at most to 3.
- **Analytics stub:** `ads.log(event, placement)` to the console now; wire it to a real backend later. Without data, none of the caps can be tuned.

## Store-release checklist

**Wrapper and SDK** (state on 2026-10-19)
- [ ] **The MAX plugin is the weakest link.**
  - The official `cordova-plugin-applovin-max` (github.com/AppLovin/AppLovin-MAX-Cordova) was last released as 2.1.0 on 2025-04-05, on MAX SDK 13.2.0. The repo was last pushed 2026-05-28, with 14 stars and 12 open issues [F]. It is lagging behind AppLovin's React Native plugin (9.6.0, 2026-06-03 [F]).
  - AppLovin documents it for the Cordova CLI only. Capacitor runs Cordova plugins but "does not support Cordova install variables, auto configuration, or hooks" (https://capacitorjs.com/docs/plugins/cordova [F]), so the native setup must be done by hand, including the Ad Review Gradle plugin and Ruby script.
  - There is **no mature Capacitor-native MAX plugin.** `anthlubic/capacitor-applovin-max` was created 2026-10-14 with 0 stars. `DeineAgenturUG/capacitor-plugin-applovin` was last pushed in 2024 [F].
  - **Recommendation:** spike the official Cordova plugin inside Capacitor first. If it fights the build, write a small custom Capacitor plugin. Strata needs only init, consent, one interstitial unit, one rewarded unit and their callbacks.
  - Either way, it implements `ads.js`'s `setProvider('max')`.
- [ ] One ad unit per format (AppLovin's recommendation), with **named placements**: `result_to_map`, `shrine_to_map`, `gem`, `lantern`.
- [ ] A dashboard frequency cap on the interstitial unit, as a **backstop** only. The real caps live in `ads.js`.
- [ ] Preload the next ad after each show. If none is loaded, `canShow` returns false and the game simply continues. Never wait on an ad.
- [ ] Test mode, plus MAX's Mediation Debugger, before submission.

**Consent and privacy**
- [ ] Use MAX's **Terms and Privacy Policy Flow**, which runs Google UMP in GDPR regions, then the terms and privacy flow, then **ATT on iOS**. It needs a privacy policy URL and a published GDPR message in AdMob [F]. A separate ATT plugin is then optional; if one is needed, `capacitor-plugin-app-tracking-transparency` 3.0.0 or `@capgo/capacitor-app-tracking-transparency` 8.1.21 are current [F].
- [ ] Run the flow **after** the tutorial, never on the first launch's title screen. No ad is requested before then anyway. The flow fires at SDK init, so initialise the SDK lazily; check that this works.
- [ ] Nothing is gated on, or rewarded for, accepting tracking (Apple 5.1.2(i)). Any pre-prompt must be "transparent".
- [ ] App Store privacy label and Play Data safety form, covering the ad SDKs.
- [ ] **Stay out of the Kids Category and Play's Families programme.** Target a general audience, not children. Otherwise Apple 1.3 rules out third-party ads, and Families requires self-certified SDKs and no interest-based ads.

**Ad behaviour required by policy**
- [ ] Interstitials only at the result-to-map break. That is Play's "after the score screen", never at the start of a level or at launch.
- [ ] Interstitials closeable within 15 s (Play). Check the network settings and creative lengths. Apple requires a visible close button.
- [ ] A **"Report an ad"** route (Apple 2.5.18). For example, a line in How to play that opens a mail form, with the last creative's ID from Ad Review.
- [ ] Block gambling, casino and dating creatives on each network and in MAX, and review creatives in **Ad Review** for the first weeks.
- [ ] Audio: duck the game's music and SFX while an ad plays, and restore them after.
- [ ] Pause the level clock while an ad is up. It already stops while the app is away.

**Remove Ads**
- [ ] A non-consumable IAP through **StoreKit** (Apple 3.1.1) and **Play Billing** (Play Payments names "an ad-free version of an app").
- [ ] Use either `@revenuecat/purchases-capacitor` (13.7.4, published 2026-10-13, actively maintained) or `cordova-plugin-purchase` (j3k0, 13.19.1, repo pushed 2026-10-14) [F]. RevenueCat is less code; cordova-plugin-purchase avoids a third-party service.
- [ ] A **Restore purchase** button.
- [ ] Keep the entitlement locally (`strata.ads.removed`) and re-verify it on launch, so the purchase works offline.
- [ ] The purchase short-circuits `showInterstitial`. The gem and lantern resolve `true` without an ad.
- [ ] Never gate the purchase on ATT (Apple 5.1.1(ii)).

**Before and after launch**
- [ ] An A/B test (MAX's ad-unit A/B, or our own flag) between the default caps and a lighter variant, measuring D1/D7 retention, session length, ad ARPDAU and Remove Ads conversion.
- [ ] Review mining in the first month for "ad", "ads" and "paid".

## Open questions for Kellan

1. **Should filled gems count as real gems?** They count towards shrines in the proposal. Alternatives:
   - count them as gems, but keep "flawless" separate in the journal;
   - or don't offer the gem fill at all, and rely on the lantern plus interstitials.

   This is the biggest brand call: stars currently mean "a clean hand".
2. **The Remove Ads price.** $2.99, $3.99 or $4.99? And should it also be framed as "support the game" (a tip jar), or stay purely functional?
3. **Lantern economy.** Should flames also be earned by play (one per chapter completed, or per flawless solve), so that an engaged player rarely needs an ad?
4. **Interstitial ceiling.** Is a flat ceiling of about 1 per 3 solves and 4 minutes acceptable, knowing it leaves revenue on the table compared with the industry's every-level cadence? Or do you want to A/B a tighter variant?
5. **Should the shrines ever be ad-reachable?** Recommended: no.
6. **Kids.** Strata looks family-friendly. Do you want to avoid being treated as a children's app, which means avoiding Kids-category and "Designed for Families" positioning? That positioning brings much stricter ad rules (see the checklist).
7. **Premium alternative.** Would you consider a paid "Strata+" on Apple Arcade later, as Monument Valley did? If so, keep all ad code behind `ads.js` so a build without ads is one switch.

## Validation limits

- No exemplar was played. Ad placement in other games is inferred from store pages, reviews and press, and some sources are snippet-only (marked [S]).
- No player has seen the styleframes. The judgement of "gift vs toll" is my own adversarial review in Chromium at 390×844, not audience research.
- All caps and prices are tuning guesses, to be set from store-build data. No source gives thresholds for a calm puzzle game.
