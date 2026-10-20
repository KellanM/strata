# Go-to-market study: how Strata finds its players (2026-10-20)

This is the study record. Read it before you repeat the research. It covers launch, growth channels, store featuring and positioning. In-game ad placement is covered in `ads-study.md`, and ad creative in `ad-playbook.md`, `ad-hooks-study.md` and `trailer-v2-study.md`. Nothing here repeats them; where they settle something, this doc points back to them.

**Research only.** No game code was changed.

## The 5 highest-leverage moves

1. **Ship a Daily Stone with a spoiler-free share line, on the web, now.** Wordle's emoji grid is the only documented zero-budget path from hundreds of players to millions. Wordle had about 90 players on 1 Nov 2021, over 300k by 2 Jan 2022, and about 2M a week later [F, Wikipedia]. Strata already has a seeded shape generator (`randomShape(n, seed)` in main.js, used by drifts), so a date-seeded daily is cheap. No nonogram I found ships a share grid [S]: the niche looks open (inference).
2. **Measure before anything else.** The web build has no analytics today (checked: there is only the `ads.log` console stub). Every gate below needs D1, D7, tutorial completion and share rate. Until those numbers exist, Strata cannot pass a phase gate or fill in Google's featuring form, which asks for soft-launch D1/D7/D30 [F].
3. **Use the existing trailer pipeline as a short-form clip engine.** Post 10–15 s real-gameplay clips of the reveal, three a week, in the "what's inside?" format. A Little to the Left, a calm puzzle game, broke out through creators' TikToks of solving it: one creator posted 42 clips with over 65M views [F, GameDiscoverCo]. Bacon: The Game, by a solo dev, reached 18.5M downloads, "all organic", after a TikTok with over 9M views [F, mobilegamer.biz].
4. **Treat the store launch as the one big event, and book it 3 months out.** Use iOS pre-orders (up to 180 days ahead) and Play pre-registration (up to 90 days). Submit Apple's featuring nomination, Google's featuring form and the Indie Games Corner form. Launch on both stores on the same day, because Google's form asks for it. Measured on the iOS 11 store in 2018, Game of the Day gave a median +802% in downloads [F, TechCrunch / Sensor Tower]. That figure is old and the lift fades.
5. **No paid acquisition at launch, beyond a small test (no more than $500).** At current numbers, an install costs about 10–30× what a player earns back (see the benchmarks). Spend Strata's money on content drops instead. Monument Valley's own spike analysis found that new content launches beat everything else, and that awards "did not come close" [F, TechCrunch 2015].

## Brief

- **Goal:** the best go-to-market plan for Strata.
- **Strata today:**
  - a calm, premium 3D nonogram;
  - 158 stones, 15 chapters, 15 shrines and a 12-lesson tutorial;
  - live as a free PWA at kellanm.github.io/strata, with no ads yet on the web.
- **The plan:** iOS and Android through Capacitor, free, with capped AppLovin MAX ads and a $2.99 Remove Ads purchase (`ads-study.md`, as built).
- **The team:** Kellan alone, ex-Unreal, on a modest budget. The north star is "beautiful but minimal".

**Fixed:**
- the monetisation design (`ads-study.md`, Kellan's decisions of 2026-10-19);
- the calm brand;
- honest ads that use only real gameplay (`ad-hooks-study.md`).

**Changeable:** the channels, the order and timing, the product hooks for growth, the store positioning and the budget split.

**What counts as success:**
- a plan a solo dev can execute;
- every phase gated by a measurable number;
- no step that depends on paid UA being profitable before data shows it is.

### Baseline (inspected 2026-10-20)

- The live page's `<title>` is "Strata — 3D Nonograms". The manifest description is "Peel the stone, find the shape."
- **No meta description and no Open Graph or Twitter tags.** A link shared to Discord, iMessage, Reddit or X shows no image.
- No analytics, no daily puzzle, no share action. The only use of share is the iOS install instructions.
- **Drifts already exist.** They are random stones generated from a seed, on the Night palette, through `randomShape(n, seed)`.
- **A name collision.** *Strata* (Graveck, 2013) is a well-reviewed ribbon-layering puzzle game on iOS, Android and Steam: Metacritic 85 on iOS [S, Wikipedia], with a Cult of Mac review [F] (App Store id 641702337). I couldn't confirm whether it is still listed. That affects searching for "strata" and needs a trademark check (see open questions).
- The repo is 3 days old (first commit 2026-10-17).

## Sources

Labels:
- **[F]**: the page was fetched and read.
- **[S]**: only a search snippet or summary was seen.
- **Model**: my own calculation; no source states it.
- **Estimate**: my judgement; no source.

Three research agents and I gathered these on 2026-10-20.

**What I couldn't inspect:**
- I watched no videos: no GDC talks, no TikToks.
- I played no exemplars and couldn't load reddit.com.
- Gated data (GameAnalytics and AppsFlyer genre charts, Sensor Tower, AppMagic, 2025–26 Tenjin and Appodeal eCPM tables) was not accessible.
- So the puzzle-specific numbers are older than I'd like, and the claims about channel mechanisms come from postmortems, not from observation.

**Exemplars**
- **Monument Valley 1:**
  - ustwo's figures (TechCrunch, Jan 2015) [F]: $5.86M revenue, 2.44M paid sales, an $852k build and the biggest day at launch. Its spike analysis ranks content launches and Christmas first, and says awards "did not come close";
  - House of Cards: from #150 to #2 on the US paid chart [F, PocketGamer.biz];
  - year 2: 26M downloads, over 23M of them in year 2, driven by "the lack of a price tag" (free promotions) [F, MacStories];
  - Forgotten Shores: bought by 24% of buyers [F] (34% of iOS players per the PocketGamer.biz figure cited in ads-study).
- **Monument Valley 2:** revealed and released in the WWDC 2017 keynote; peak day $728k; about 3.5M sales in year 1; over $500k marketing [F, Pocket Gamer]. The free-to-start China version passed 30M installs [F].
- **Alto's Adventure:** premium on iOS, with Apple ads, retail demo units and "Best of 2015" [S]. **Free with ads plus a $4.99 ad-free unlock on Android:** 36.5M downloads and about 1.5M daily devices [F, Engadget 2018; Game Developer case study].
- **Mini Metro:** a free browser alpha, from Ludum Dare (2013), spread virally, and the devs say the studio "might not exist" without it [F, Game Developer postmortem].
- **Townscaper:** progress GIFs on Twitter; 380k Steam sales against an expected 4k [F, MCV]. Dorfromantik: a free itch prototype got about 20k downloads [S].
- **Tiny Glade:** 1.375M wishlists from viral WIP clips plus a Next Fest demo [F, GameDiscoverCo].
- **A Little to the Left:** a GMTK jam entry, 65M TikTok views from one creator, 300k sold by Feb 2023 [F, GameDiscoverCo].
- **Bacon: The Game:** solo dev, a 9M-view TikTok, #1 in the US, 18.5M downloads "all organic" [F, mobilegamer.biz]. It went viral about two months after the dev added dark mode.
- **Card Crawl Adventure (solo, free plus IAP):** about 55k downloads in month 1 with an Apple feature, but only about $2k revenue [F, GameDiscoverCo]. This is the realistic baseline.
- **Wordle:** the timeline above; 1.2M results shared on X between 1 and 13 Jan 2022; bought by the NYT for "low seven figures" [F, Wikipedia].
- **The F2P puzzle incumbents:**
  - Nonogram.com: 196K ratings, 4.6★, "Picture cross logic puzzle", No Ads $14.99, coin packs up to $99.99 [F, App Store, today]; it is part of Easybrain's 1.5B-download portfolio [S];
  - Flow Free: over 100M downloads, built by spinning off variants [F, Wikipedia];
  - Block Blast: grew on UA, "over 50 A/B tests a week" [S, mobilegamer.biz].
- **The premium picross niche:** Picross e on 3DS, about 680k across 9 titles [S].
- **Apple Arcade and Netflix:** ustwo calls them a "financially stable way" to make risky games [F, PocketGamer.biz interview].

**Platforms**
- **Apple:**
  - Getting featured [F]: no checklist; design, accessibility, localisation and uniqueness; at least 2 weeks' notice, 3 months advised. The App Store Connect help says a minimum of 3 weeks.
  - Featuring nominations form [F]: the types are New Content, App Enhancements and App Launch.
  - Pre-orders [F]: 2–180 days.
  - In-App Events [F]: up to 31 days long, promoted up to 14 days before; badges include Challenge and New Season.
  - Product Page Optimization [F]: 3 treatments, 90 days.
  - Custom Product Pages [F]: up to 70, each with its own URL and keywords.
  - Product page specs [F]: name and subtitle 30 characters each, keywords 100, promo text 170 (not indexed), 10 screenshots, up to 3 previews of 30 s or less, captured on the device.
  - Review Guidelines 4.2 [F]: "beyond a repackaged website".
  - Apple Design Awards 2026 categories [F]. Selection appears to be by Apple, with no entry form (unverified).
- **Google Play:**
  - Featuring form [F]: launch within 120 days; the AAB in Console 3 weeks before; rating ≥ 3.8; "launch simultaneously across key mobile platforms"; localise; asks for soft-launch D1/D7/D30 and ARPDAU; new launches only.
  - Indie Games Corner form [F]: teams of 1–15, rating ≥ 3.8.
  - Pre-registration [F]: up to 90 days, a launch notification, auto-install up to 200 MB. Personal accounts created after 13 Nov 2023 must pass closed testing first.
  - Android vitals bad-behaviour thresholds [F]: 1.09% crash, 0.47% ANR.
  - Store listing experiments and custom store listings [F].
- **Portals:**
  - CrazyGames docs [F]: not exclusive; Basic Launch runs 7–21 days with 500+ plays and looks for D1 of 10–15% and 10+ minutes of play; the full launch needs their SDK and their ads only; "App Store links are never allowed in-game."
  - Poki [F]: hand-picked; web-exclusive for 5 years by default, though app stores stay yours; 100% of revenue from direct traffic, 50/50 on players Poki sends.
- **Show HN rules** [F].

**Benchmarks**
- **GameAnalytics 2026 report** (2025 data, 16,262 games), via the GameDevReports summary [F].
- **AppsFlyer Q3 2022 puzzle retention**, via Mistplay [F].
- **Tenjin Q1 2024 US eCPM** [F]; Appodeal Q4 2024 [S].
- **SplitMetrics 2026 Apple Ads benchmarks** [F].
- **CPI ranges:** Business of Apps [S], Admiral Media and GameGrowthAdvisor [F], Liftoff [S].
- **Unity 2023:** ad removal was 11% of first IAPs on iOS [S].
- **Mistplay × AppsFlyer 2025:** puzzle has the highest share of payers at D30 [F, summary].
- **Duolingo's streak A/B test:** +3.3% relative D14 retention [S, Duolingo blog].

**Channels**
- **Chris Zukowski (howtomarketagame):** TikTok and Reddit wishlist data, and that press gives no measurable lift [F].
- **TouchArcade closed in Sept 2024** [S].
- **IGF:** the 2027 deadline (13 Sep 2026) has passed [F]; Big Indie Pitch London is on 18 Jan 2027 [S].
- **Keymailer / Lurkit pricing** [S].

## Benchmarks: the coordinator's numbers, checked

| Coordinator's claim | Corrected | Basis |
|---|---|---|
| Puzzle D1 / D7 / D30 ≈ 30–40 / 12–18 / 5–8% | **Too optimistic for 2026.** These figures match AppsFlyer **2022** puzzle data (31.9 / 12.2 / 5.4%). GameAnalytics' 2025 data, all genres: D1 top-quartile "just above 30%", top-10% about 40%; **D7 median just under 4%**, top-quartile 6–7%, top-10% 11–12%; **D30 median about 0.7%**, top-quartile about 1.7%. Puzzle is among the best-retaining genres, but its own numbers are gated. **Working targets for Strata: D1 30%, D7 8–10%, D30 3%. That would be top-quartile, not average.** | [F] GA 2026 via GameDevReports; [F] AppsFlyer 2022 via Mistplay. GA pools unmarketed SDK games, which drags the median down |
| US puzzle CPI ≈ $2–4 iOS, $1–2 Android | **Android is too low.** Use **US iOS $2–5 and US Android $1.50–3.50.** Apple Ads, games: CPT $1.30–1.80, CPA $2.20–2.90. Cheap "global" figures ($0.14–0.65 Android) are blends dominated by low-cost markets | [F] SplitMetrics 2026, GameGrowthAdvisor; [S] Business of Apps, Liftoff |
| Calm, ad-light ARPDAU ≈ $0.02–0.06 | **Lower end only, and only for US players.** Model: US interstitial eCPM about $14–20 and rewarded about $16–30. At Strata's caps (about 1 interstitial per 3 solves, none in the first session) I estimate 0.5–1.5 interstitials and 0.1–0.3 rewarded per DAU, giving **$0.01–0.035 US**, and roughly **$0.005–0.015 blended worldwide** | Model on [F] Tenjin Q1 2024 and [S] Appodeal Q4 2024 eCPMs. The impressions per DAU are an estimate, because no credible puzzle benchmark exists |
| "So paid UA is likely unprofitable at launch" | **Confirmed, and strongly.** See the LTV model below | Model |
| Steady-state DAU ≈ daily installs × 6–10 | **True only on 2022-grade retention. On 2025 top-quartile curves it is ×3–4; on the median, ×2–2.5** | Model below |

**The DAU multiplier (model).** DAU ≈ installs per day × (1 + Σ R(t)), with a power-law fit R(t) = D1 · t^−b through D1 and D30, summed over 90–180 days (real curves steepen after that).

| Curve (D1 / D30) | Multiplier at 90 d | At 180 d |
|---|---|---|
| AppsFlyer 2022 puzzle (31.9 / 5.4) | ×6.2 | ×8.4 |
| Coordinator's top end (40 / 8) | ×8.6 | ×12.2 |
| GA 2025 top-quartile (30 / 1.7) | ×3.1 | ×3.6 |
| GA 2025 median (22 / 0.75) | ×2.1 | ×2.3 |

**Why paid UA doesn't pay (model).**
- **90-day ad LTV per install** ≈ ARPDAU × lifetime days (the multiplier above) = **$0.03–0.30**, from $0.01 × ×3 up to $0.035 × ×8.4.
- **Remove Ads:**
  - there is no public conversion rate;
  - Unity says only that ad removal was 11% of first IAPs on iOS [S];
  - at a guessed 0.5–2% of installs × $2.54 net (Apple's 15% Small Business rate; from my knowledge, not re-fetched), it adds **$0.01–0.05**.
- **Total: about $0.05–0.35 per install, against a $2–5 US CPI.** Paid UA loses 85–98% of spend at launch.
- It could only work if retention lands far above the 2022 curve and Remove Ads converts far above the guess. Both are testable; neither should be assumed.

**Payers.** Mistplay × AppsFlyer (2025, US) found puzzle has the highest share of payers at D30: 7–8%. That is probably a share of *retained* users, on a rewards-app audience [F, summary]. It suggests Remove Ads may convert better among engaged players than the 0.5–2% guess; treat it as an upside case, not a plan.

## Mechanisms (what moved the needle, and why it applies)

Each mechanism gives the claim with its source, then my interpretation, then what to do in Strata.

### M1. A share artifact built into the game is the zero-budget growth engine

- **Claim:**
  - Wordle's growth followed the copyable emoji grid, which Wardle added after seeing players in New Zealand make their own, plus a single shared daily puzzle [F].
  - Clues by Sam passed 50k daily players [S], and Termo reached 100k daily within about 10 days [S]. Both are daily web puzzles.
- **Interpretation:**
  - The grid works because it is **spoiler-free, identical for everyone that day, and tiny**. Posting it is a brag that is also an invitation.
  - The scarcity of one puzzle a day makes everyone's result comparable.
  - A nonogram's answer is a picture, so the share must hide the object and show *how* you solved it.
- **Application, the Daily Stone:**
  - One stone a day, the same for everyone, seeded by the date.
  - The share is text plus an optional image:

    ```
    Strata · Day 12 · ◆◆◇
    1 slip · 4:12 · 🔥5
    kellanm.github.io/strata/#d12
    ```

  - The image is the day's stone **still in its mist** (silhouette hidden), with "what's inside?". Never the revealed object for the daily.
  - **Two content options** (a decision for Kellan):
    - (a) a date-seeded drift: cheap, but no object and no story, so a weaker payoff;
    - (b) a rotation of authored objects held back from the campaign: the real reveal, but it needs a content pipeline.
- **Review:** share rate (shares ÷ daily solves), the share of new players arriving from a `#d` link, and daily-solver D7.

### M2. A free playable link is the top of the funnel

- **Claim:**
  - Mini Metro's browser alpha carried it ("might not exist" without it) [F].
  - Dorfromantik's free itch prototype got about 20k downloads [S].
  - Townscaper grew from a free browser toy [F].
- **Interpretation:** a link with zero friction converts curiosity better than a store page, and it gathers the retention data the store forms ask for.
- **Application:** keep the PWA as the always-on demo and the daily's home. Fix link previews (OG image and description) before any public post.
  - **Risks:**
    - Press and featuring both want a launch *moment*: Apple's "App Launch" type, and Google's form is "new launches only" [F]. Frame the web build as a "preview" and save the press push for the store date.
    - Apple 4.2 rejects a "repackaged website" [F]. The Capacitor build needs app-like substance: offline play (the PWA already has it), haptics, IAP, and probably Game Center.
    - I found **no evidence either way** on whether a game already free on the web is less likely to be featured. Mini Metro was free in the browser and later made Apple's Best of 2016 [S], which is weak evidence that it doesn't disqualify.
    - Cannibalisation: no data. Web players see no ads, which is acceptable while the web build is the funnel.

### M3. Short clips of the satisfying moment travel; polish matters less than the hook

- **Claim:**
  - A Little to the Left: 42 creator TikToks, over 65M views, the January sales spike [F].
  - Bacon: a 9M-view TikTok and 18.5M organic downloads [F].
  - Tiny Glade's WIP clips were "rarely not viral" [F].
  - Zukowski: one viral video took a game from 3K to 6K wishlists; a re-edit took another from 10K to 7M views; raw screen recordings beat polished trailers; only about 10% of the traffic is trackable [F].
- **Interpretation:**
  - The formats that travel are **process-then-payoff**: tidying, solving, the reveal.
  - Strata's reveal (a whirl, then colour, then the object turning to face you) is exactly that, and `ad-playbook.md` has already measured how to let it land (4.8 s).
  - The outcome distribution is extremely skewed: most posts get little, and one post can carry a year.
- **Application:**
  - Three organic clips a week from `tools/trailer`, posted natively to TikTok, Reels and Shorts.
  - Rotate the honest hooks already designed in `ad-hooks-study.md`: "This block is hiding a dragon", "Wait for it", "Guess in 3", "Same block, different secret".
  - The CTA is "Play free in your browser" until the stores list Strata (Google's "unavailable offers" rule, already noted there).
- **Review:** 2-second hold rate and views per post, plus `#c` link sessions.

### M4. Platform editorial is the biggest lever on mobile; book it like an event

- **Claim:**
  - MV2 launched inside the WWDC keynote: a $728k peak day [F].
  - Alto: "Best of 2015" and retail demo units [S].
  - Card Crawl Adventure: about 55k installs in month 1 with a feature [F].
  - In 2018, Game of the Day gave a median +802% in week-after downloads [F].
  - Apple asks for 3 months' notice [F]; Google wants SimShip, a rating ≥ 3.8 and soft-launch retention [F].
- **Interpretation:**
  - Editors look for craft, uniqueness, accessibility and localisation. Strata's art direction is its strongest card.
  - But a feature is a spike over a small baseline. Without retention, it decays to nothing.
- **Application:**
  - Nominate 12 weeks out: Apple "App Launch" with a pre-order; Google's featuring form plus Indie Corner.
  - SimShip both stores.
  - Localise the store pages, and ideally the game's few strings, into the top 5–6 languages. Strata's UI has few words.
  - Ship visible accessibility (colour-safe palettes are already a goal, haptics, Dynamic Type for the UI text) and say so in the form's "Helpful details".
  - After launch, use In-App Events (a Challenge or New Season badge) for each new chapter.

### M5. Content drops are relaunches

- **Claim:**
  - Monument Valley's biggest spikes were content launches, ahead of awards [F].
  - 24% of buyers bought Forgotten Shores [F].
  - Flow Free grew by shipping variants [F].
  - Apple In-App Events and Google Promotional Content give recurring store surfaces [F]/[S].
- **Application:**
  - A new chapter (10 stones plus a shrine) every 4–6 weeks after launch, each as an In-App Event, with a seasonal palette where it fits (a winter chapter in December).
  - The 15 existing chapters could be **held partly in reserve** so launch has 10–12 and the rest arrive as drops. That is a decision for Kellan; it trades launch value for 90 days of relaunch moments.

### M6. Free beats premium on reach; the paid route is a later option

- **Claim:**
  - Alto went free with ads on Android and reached 36.5M downloads [F].
  - MV1's year-2 downloads came from free promotions [F].
  - MV2's free-to-start China version reached 30M [F].
  - Apple Arcade and Netflix give ustwo stability [F].
- **Application:** this confirms the free-with-ads plan. Keep `ads.js` switchable (ads-study open question 7), so a build without ads can be pitched to Arcade or Netflix if the store numbers prove the craft but not the ad revenue.

### M7. What not to copy

- **Block Blast and Easybrain grow on industrial UA** [S]: 50 A/B tests a week, and coin packs up to $99.99. Strata can't out-spend them, and shouldn't.
- **Pop-culture luck** (House of Cards) can't be planned.
- **Press moves little for mobile indies.** Zukowski found no measurable lift [F], and TouchArcade, the main iOS outlet, closed in 2024 [S]. Press is worth one afternoon at launch, not a campaign.

## Channel table

**Installs and DAU ranges are estimates unless a source is given.** The "evidence" column is the sourced part. Where it says "no data", the range is my judgement and should be replaced by Strata's own numbers within weeks.

| # | Channel | Cost | Kellan's effort | Evidence | Estimated outcome for Strata |
|---|---|---|---|---|---|
| 1 | **Store featuring** (Apple and Google forms, Indie Corner) | $0 | 1–2 days of forms and art; 3 months' lead | Median Game of the Day uplift +802% (2018) [F]; Card Crawl about 55k in month 1 [F]. MV2's peak day [F] | **If featured:** 10k–100k installs in the feature week, decaying over 2–3 weeks. **If not:** organic store search, low hundreds a day at launch falling to tens. Both estimates; the probability of a feature is unknowable |
| 2 | **Daily Stone and share line** (web) | $0 | About 1–2 weeks to build (agent) | Wordle: 90 → 2M players in about 10 weeks [F]. Termo, Clues by Sam [S] | Most dailies don't take off. A realistic band is tens to low thousands of daily players within 3 months; Wordle-scale is an outlier (estimate) |
| 3 | **Organic short-form** (TikTok, Reels, Shorts) | $0 | About 3 h a week once the clip pipeline is templated | 65M views (A Little to the Left), 9M (Bacon), 3K → 6K wishlists from one video [F] | Most posts get under 1k views; a breakout clip gets 100k–1M+ and hundreds to tens of thousands of plays. Skewed: judge after 20–30 posts, not 3 (estimate) |
| 4 | **Reddit** (r/WebGames, r/nonograms, r/Picross, r/iosgaming, r/AndroidGaming, r/playmygame, r/IndieGaming) | $0 | Low; 1 post per sub per milestone | A typical post adds about 100–150 wishlists; outliers about 11K [S, Zukowski / analyzers]. r/Picross about 5K members [S] | 50–2,000 plays per good post; puzzle subs are small but convert well (estimate). Check each sub's self-promotion rule first; I couldn't load Reddit |
| 5 | **Show HN** | $0 | 1 h plus a day answering comments | A non-game Show HN: about 468 users on launch day [S]. Tiled Words (a daily web puzzle): "several hundred daily players" afterwards [S] | 500–20k visits in 48 h if it reaches the front page, otherwise about 50. One shot: use it **when the Daily Stone ships** |
| 6 | **Creators** (cozy and puzzle YouTubers, TikTokers) | $0–$300 (Keymailer free tier; Lurkit about 15% commission) [S] | Medium: a personal email to 30–50 creators | Creator clips drove A Little to the Left [F]. No mobile conversion data [S] | A few small creators cover it; one mid-size cover is a spike similar to a good Reddit post (estimate) |
| 7 | **Showcases** (Big Indie Pitch, mobile; Wholesome Direct; Day of the Devs; IGF 2028) | $0–$75, plus travel | Medium | Wholesome Direct: about 1,500 submissions for about 60 slots; Day of the Devs: 1,100+ for 20 [S]. IGF 2027 closed 13 Sep 2026 [F] | Low odds, high prestige. A showcase slot is worth thousands of views and some press; volume is small (MV1: awards "did not come close" [F]) |
| 8 | **Press** (PocketGamer, AppAdvice, Android Police, Droid Gamers, 148Apps) | $0 | 1 afternoon (press kit plus 20 emails) | No measurable lift in Zukowski's data [F]. TouchArcade is gone [S] | Mostly credibility and quotes for the store page; installs negligible (estimate) |
| 9 | **Discord** | $0 | Ongoing | A retention tool, not acquisition: The Matriarch had 700 members, and one video added 300 [F] | Start only once there are about 200 daily players who ask for it |
| 10 | **Portals** (itch.io; CrazyGames Basic Launch) | $0 | itch: 1 h. CrazyGames: a separate build with no store links and their SDK | CrazyGames' Basic Launch benchmarks: D1 10–15%, 10+ min [F]. Earnings about €1 per 1k plays [S] | itch: a few hundred plays. CrazyGames: a free external retention read, but no funnel to the stores (links banned). **Poki: skip.** Its web exclusivity conflicts with the GitHub Pages PWA [F] |
| 11 | **Apple Ads** (exact keywords: nonogram, picross, griddlers) | $300–500 test | Low | Games CPA about $2.20–2.90 [F] | About 100–200 installs, used **to read retention by cohort and store conversion, not to grow** |
| 12 | **Paid social** (Meta, TikTok) | Not before gate G3 | Medium | TikTok ad group minimum about $20 a day [S]; LTV model above | Loses money at launch (model) |
| 13 | **Cross-promotion** | $0 | Low | MAX supports cross-promo [S] | Needs a second app; not applicable |
| 14 | **Newsletters** | $0 | Low | Nothing found for consumer puzzle newsletters | Unverified; skip unless one surfaces |

**A blended scenario, all estimates, for planning only:** 300 installs a day from organic, daily-share and occasional clips. At ×3–6 that is about 1,000–1,800 DAU. At $0.01–0.03 ARPDAU that is about $10–55 a day in ads, plus Remove Ads. A feature or a breakout clip moves the whole curve; their absence leaves Strata as a hobby-scale income.

## Product levers, ranked by impact against effort

| Rank | Lever | Impact | Effort | Why |
|---|---|---|---|---|
| 1 | **Analytics** (privacy-light: sessions, lesson completion, solves, D1/D7, shares, `#d`/`#c` link sources) | Enables everything | S (1–2 days, agent) | No gate can be judged without it. Google's form asks for retention [F] |
| 2 | **Daily Stone plus a spoiler-free share line** | High (the only zero-budget viral loop with precedent) | S–M (date seed on `randomShape`; a share sheet; a results card) | M1 |
| 3 | **OG / link-preview card**, plus a per-share image of the misted daily | Medium (every shared link becomes an image) | S (an HTML head and one image) | The baseline has none |
| 4 | **Gentle streak** for the daily only (a lantern-flame motif; one missed day forgiven a week; never a guilt notification) | Medium for retention | S once the daily exists | Duolingo: +3.3% relative D14 from a streak change [S]. Kept calm to fit the brand |
| 5 | **Share a revealed object** (campaign stones: the object on its sky with its story line, via `navigator.share` with an image) | Medium (Pinterest- and Instagram-friendly art; not spoiler-sensitive outside the daily) | S | Collectible objects are the payoff, and art is the brand |
| 6 | **Content drops** as In-App Events (new chapters, seasonal palettes) | High for re-engagement and featuring | M–L per chapter | M5 |
| 7 | **Native polish for the store build:** haptics on chisel and reveal, Game Center (achievements per chapter; a daily leaderboard of slips, not time) | Medium (protects against 4.2; may help featuring, unverified) | M | Apple 4.2 [F] |
| 8 | **User-made puzzles** | Unknown, possibly high | L (a 3D editor, a uniqueness and solvability check, moderation, hosting) | No precedent found for 3D picross UGC driving growth. **Defer** past 90 days |

## The recommended plan

**Owners:**
- **K** = Kellan: posting as Strata, accounts, money, judgement calls, store accounts.
- **A** = an agent: builds, clip renders, drafts, data pulls.

Costs are cash; time is noted where it is large.

### Phase 0: now, on the web (weeks 0–6)

| Action | Owner | Cost |
|---|---|---|
| Add analytics. Options: GoatCounter, Plausible or Umami (self-hosted or paid), or a tiny event endpoint. Track events plus link sources | A builds, K picks | $0–9/mo |
| Add an OG image, meta description and Twitter card | A | $0 |
| Build the Daily Stone, the share line, the misted share image, the `#d` deep link, and the streak | A, K reviews | $0 |
| Start the clip cadence: 3 a week from `tools/trailer`, captioned per `ad-playbook.md`, with the "Play free in your browser" CTA | A renders, K posts | $0, about 3 h a week for K |
| List on itch.io (a free, web-embedded link to the PWA) | K | $0 |
| Once the daily is live: Show HN, then r/WebGames, r/nonograms and r/Picross, a week apart | K | $0 |
| Start an email list: "tell me when Strata reaches the App Store" on the title or How to play screen | A | $0 |
| Run the name check: the 2013 *Strata* game, plus a USPTO/EUIPO search | K | $0 |

**Gate G1 (to enter Phase 1).** Measured on at least 500 web players who started lesson 1:
- lesson-12 completion ≥ 60%;
- D1 ≥ 25%, D7 ≥ 8%;
- daily share rate ≥ 3%.

These are targets, not benchmarks. They are set at about the GA top quartile, discounted for web.

### Phase 1: pre-launch (about 12 weeks before launch, to launch)

| Action | Owner | Cost |
|---|---|---|
| Capacitor build: the MAX spike, StoreKit / Play Billing and consent, per `ads-study.md`'s checklist; haptics; Game Center | A, K | Apple $99/yr; Google $25 once |
| Google Play closed test. Required first for personal accounts created after 13 Nov 2023 [F]; the exact tester count and length weren't re-fetched (unverified) | K | $0 |
| Store pages (see Positioning); 5–6 localisations of the store text | A drafts, K approves | $0–300 for native-speaker checks |
| **T−12 weeks:** iOS pre-order (2–180 days) plus Play pre-registration (≤ 90 days, auto-install ≤ 200 MB) | K | $0 |
| **T−12 weeks:** Apple featuring nomination ("App Launch"), Google featuring form, Indie Games Corner form. Attach the TestFlight link, a 1-page pitch, and the web retention and share data from Phase 0 | A drafts, K submits | $0 |
| **Soft launch, 2–4 weeks**, in 1–2 English-speaking markets (e.g. Canada, Australia); not the US | K | $0 |
| Apple Ads exact-keyword test during the soft launch | K | $300–500 |
| Press kit (an itch-style presskit page), the trailer v5 cuts (the store CTA becomes honest once listed), 20 press emails and 30–50 creator emails, scheduled for launch day | A drafts, K sends | $0 |
| Big Indie Pitch London (18 Jan 2027), if the dates line up | K | Ticket plus travel |

**Gate G2 (to launch).** In the soft launch:
- store D1 ≥ 30%, D7 ≥ 8%;
- crash rate < 1% (Play's bad-behaviour threshold is 1.09% [F]);
- rating ≥ 4.3 (Google's forms need ≥ 3.8 [F]);
- no ad-related review complaints in the first 50 reviews.

### Phase 2: launch week

| Action | Owner | Cost |
|---|---|---|
| SimShip iOS and Android on the date nominated | K | $0 |
| On day 0: the email list, the itch page update, the PWA banner ("Strata is on the App Store and Google Play") | A, K | $0 |
| One Reddit post per relevant sub (r/iosgaming, r/AndroidGaming, r/nonograms, r/Picross, r/IndieGaming), respecting each sub's rules | K | $0 |
| Daily clips for 7 days | A, K | $0 |
| Press and creator emails go out (written in Phase 1) | K | $0 |
| Ask for ratings only after a chapter is complete, never after an ad (`ads-study.md`) | already designed | $0 |
| Watch vitals, ad review, crash reports | A | $0 |

**Measure:** installs per day by source, store conversion rate, D1, rating.

### Phase 3: the first 90 days

| Action | Owner | Cost |
|---|---|---|
| A new chapter as an In-App Event every 4–6 weeks (Challenge or New Season badge), each with an Apple "New Content" nomination | A builds, K designs | $0 |
| Product Page Optimization: test screenshot 1 (the reveal against the map) and the icon | A, K | $0 |
| The ad cap A/B (ads-study open question 4) | A | $0 |
| Weekly review mining for "ad", "paid", "hard", "bug" | A | $0 |
| Keep the clip cadence; double down on whichever hook has the best hold rate | A, K | $0 |
| Start a Discord only if players ask | K | $0 |
| Day 60: a decision memo on scaling UA, the Arcade/Netflix pitch, or steady state | A drafts | $0 |

**Gate G3 (to spend on UA beyond tests).**
- Measured D30 ≥ 4%.
- Modelled 180-day LTV (ads plus IAP) ≥ 0.8 × the CPI of a $1–2k test on Apple Ads or Meta.
- Without both, keep spending at $0 and put the time into content and clips.

## Kill criteria and decision gates

- **Web D1 under 20%, or lesson completion under 50%:** stop channel work and fix onboarding and the first session first. Players lost in the first session can't be won back by any channel.
- **Store D1 under 25% in the soft launch:** don't launch wide yet; fix retention before any spend or featuring push. A feature then would spend the one launch moment on a leaky game.
- **D7 under 5%:** look at the content curve (where players stop in the chapters, the lantern spikes per stone in `ads.log`) before adding growth.
- **Daily share rate under 2% after 3 weeks:** the share card isn't working. Redesign the share line or the image once, then judge again.
- **A clip hook with no post over 10k views after 20 posts:** retire that hook and try the next from `ad-hooks-study.md`.
- **Paid UA:** never scale while modelled LTV < 0.8 × CPI. The test budget is capped at $500 before G3.
- **Ads:** if reviews mentioning ads exceed about 5% of 1–2★ reviews, or D1 in the ad arm trails the control by 3+ points in the cap A/B, lower the interstitial ceiling.
- **Not featured, and DAU under 300 at day 60:** stop chasing growth. Choose between (a) steady-state content drops as a calm hobby game, and (b) pitching a build without ads to Apple Arcade or Netflix on the strength of the craft.

## Positioning and store pages

**Category**
- Games › Puzzle as primary; Casual as the second game subcategory.
- **Avoid Kids and Family** (ads-study: Apple 1.3 and Play Families would forbid the MAX setup).

**Name**
- "Strata" alone collides with the 2013 puzzle game and is a generic word.
- Use **"Strata: 3D Nonogram"** (19 characters) on both stores.
- "3D nonogram" is the honest differentiator: Picross 3D is Nintendo-only (DS/3DS), and the mobile nonogram charts are 2D (inference from the listings seen; I didn't survey the whole store).

**Apple subtitle** (30 characters): "Calm picross puzzles in 3D" (26).

**Apple keyword field** (100 characters; don't repeat words already in the name or subtitle, by common ASO practice):

```
griddlers,pic a pix,hanjie,logic,relaxing,zen,cube,sculpt,brain,offline,no timer,paint by number
```

Check the length before submitting. **Google:** the title as above; the 80-character short description, e.g. "Peel stone blocks to reveal 158 hidden objects. Calm 3D picross, no timers."; and the full description, which is indexed, uses nonogram, picross, griddlers and logic naturally.

**Screenshot story** (the first 3 show in search [F, Apple]; one idea per frame; real UI only):
1. The reveal: an object turned to face you on its sky. "Peel the stone. Find what's inside."
2. A block mid-solve with readable clues. "Nonograms, in three dimensions."
3. The map, the sea of clouds and the companion. "15 worlds. 158 stones."
4. The collection, a journal of objects with their story lines. "Every stone keeps a story."
5. The calm promise. "No timers. No lives. Slips are safe."
6. The honest price. "Free. One $2.99 purchase removes ads."
7. Shrines and bonus stones.

**App preview:**
- ≤ 30 s, captured on device, muted autoplay [F]: a store cut of v5 **without** the store badges and end card. Apple's rules for previews (device-captured footage) make the ad end card inappropriate there.
- Use the poster frame of the Dragon Head facing you.

**"Premium look, free":**
- Lead with craft and calm, and name the price honestly.
- The contrast with incumbents is real and documented: Nonogram.com's reviews centre on lives and ad loops (`ads-study.md` finding 1), and its No Ads costs $14.99 [F].
- Strata's "No lives. Slips are safe. $2.99 removes ads" is a sharp, truthful wedge.
- Make no "#1" or "best" claims, and no invented completion percentages (Google metadata policy, already in ad-hooks-study).

**Custom Product Pages / custom store listings:** one per channel, e.g. "from the web" (linked from the PWA banner) and "daily" (linked from share links), so conversion can be read by source [F].

## Open questions only Kellan can answer

1. **The launch date.** Is there a target (e.g. before the holidays, or spring 2027)? Featuring needs about 12 weeks' notice, so the latest realistic SimShip date is about mid-January 2027 if forms go in now.
2. **The Daily Stone's content.** (a) Date-seeded drifts (cheap, no object or story), or (b) authored objects held back from the campaign (a real reveal; needs a steady supply)? Could a mix work, e.g. authored on weekends?
3. **The name.** "Strata: 3D Nonogram" in the stores? Are you willing to run the trademark check, and what if the 2013 *Strata* is still listed?
4. **Social presence.** Will you post clips as Strata on TikTok, Instagram and YouTube, and at what weekly time budget? Faceless screen clips, or would you appear as the solo dev? Build-in-public worked for Townscaper [F].
5. **Analytics.** Which service, and is a privacy-light event logger acceptable on the web build?
6. **The 90-day cash budget.** This plan needs about $125 in store fees plus a $300–500 test, plus optional showcase travel. Is there more, and should any go to localisation?
7. **Holding chapters for drops.** Launch with all 15 chapters, or with 10–12 and release the rest as monthly In-App Events?
8. **The web build after launch.** Keep it free with no ads as the funnel and the daily's home (recommended), add ads, or trim it to the daily plus the first chapter?
9. **Store accounts.** Personal or organisation developer accounts? Personal Google accounts have the closed-testing requirement; an organisation needs a D-U-N-S number.
10. **Localisation.** Which languages? A proposal: EN, DE, FR, ES, PT-BR, JA, KO, ZH-Hans. Japan is picross's home market.
11. **The premium route.** Is an Apple Arcade or Netflix pitch acceptable as the plan B at the day-60 gate?

## Validation limits

- **The benchmarks are older or broader than ideal.** Puzzle-specific 2025–26 retention, CPI and eCPM sit behind logins; the corrections lean on all-genre GameAnalytics data and 2024 eCPMs.
- **Every install, DAU and revenue range for Strata is an estimate** from those benchmarks and the exemplars. None is a forecast. Phase 0's analytics are there to replace them within weeks.
- **The exemplars are survivors.** For each Wordle there are thousands of dailies nobody shares, and the plan's gates exist to catch that early.
- **The featuring uplift data is from 2018.** I found no current aggregate.
- **I couldn't load Reddit**, so check each subreddit's rules live.
- **No player has seen the share line, the store pages or the screenshot story.** They are proposals to test.
