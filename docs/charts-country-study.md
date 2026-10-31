# Country charts study: is "country boosting" real, and should Strata do it? (2026-10-31)

**Research only.** No game code or other repo file was changed. Read `gtm-study.md` first; this doc doesn't repeat it. It answers one question that a friend of Kellan's raised: some App Store storefronts need few downloads a day to chart, so developers "pick the easiest country first and work their way up", and charting is "a rocket ship once you're on".

## The short answer

1. **Cheap countries are real.** Each country has its own App Store charts, and small English-speaking storefronts need far fewer downloads than the US. In New Zealand or Ireland, the free Puzzle top 100 probably takes tens of downloads a day, and the top 10 low hundreds (estimate, derived below; no published figure exists for those countries).
2. **"Work your way up" is mostly a myth.** Charts are calculated per storefront. A rank in New Zealand does not feed the US rank. I found no evidence of a mechanism by which it would, only vendor claims about "social proof". What carries over is real players, their ratings in their own storefronts, a screenshot, and the data.
3. **"Rocket ship" is true only near the top of big charts.** Near the top of the US overall chart, the chart is itself a heavy traffic surface (Bacon: The Game, `gtm-study.md`). Being #40 in Puzzle in New Zealand is a list few people open. Browse traffic of all kinds was about 15% of iOS downloads in 2018, and search was 65% [F, Sensor Tower]. Category charts are only one part of browse.
4. **Most of the classic "country boosting" is against Apple's rules.** The services that sold "top 10 in country X" used bots, farmed accounts, or paid users per install. Apple's current guidelines ban manipulating charts "with paid, incentivized, filtered, or fake feedback, or engag[ing] with third-party services to do so" [F]. In 2025, Apple pulled 11,500 apps from the charts and terminated 193,000 developer accounts [F].
5. **The legal version:** concentrate *real* launch-week downloads in one or two small storefronts. Use pre-orders there, a small Apple Ads budget targeted there, and local community posts. For Strata (free, no monetisation in v1), that costs roughly $200–600 (estimate). It buys the retention read that `gtm-study.md` already budgets $300–500 for, plus a probable top-50 Puzzle spot in New Zealand and Ireland for a few days. Expect it to buy little lasting traffic.

---

## 1. Downloads per day needed to chart

### What's published (all old, all US/UK/big markets)

No source publishes thresholds for Puzzle by country, and none for New Zealand, Ireland, Singapore, the Nordics, Canada or Australia. AppTweak sells exactly this ("Downloads to Top", any category and country), and so do Sensor Tower and Appfigures, but it's gated. Everything public is below.

| Source (date) | Method | Market, chart | Daily downloads | Stale? |
|---|---|---|---|---|
| Reflection via PocketGamer.biz, **Jan 2017 data** [F] | Average daily downloads of free iPhone apps at each tier | **US free games:** top 200 / 100 / 10 | **2,929 / 4,889 / 26,534** | Yes, 9 years. But US top 10 in 2022 (below) is almost the same, so the ratios still look usable |
| same [F] | same | **UK free games:** top 200 / 100 / 10 | **621 / 1,115 / 6,309** | Yes |
| same [F] | same | Free games top 10: France / Germany / Italy | 3,479 / 2,610 / 1,600 | Yes |
| same [F] | same | US Word games top 20 / top 10; US Dice top 200 / top 10 | 1,857 / 3,949; 115 / 456 | Yes. **Puzzle** is named with Action, Arcade and Sim as the subcategories that need the *most*, but with no figure |
| same [F] | Text says each tier up (top 100 → 50 → 20) costs about 65–80% more | — | — | — |
| Sensor Tower, **Sep 2019** [F] | Median daily downloads, H1 2019, Store Intelligence estimates | iPhone games top 10: US / China / Japan / **Great Britain** | 43,000 / 29,000 / 10,000 / **8,000** | Yes |
| same [F] | same | US iPhone games No. 1 | 174,000 (118,000 in 2016) | Yes |
| Sensor Tower, **Jun 2022** (via TechCrunch [F] and Sensor Tower [F]) | Median daily downloads, 2022 YTD, US | iPhone games No. 1 / top 10 | **93,000 / 26,000** (−46% / −40% vs 2019) | The most recent public threshold. 4 years old |
| same [F] | same | Android games No. 1 / top 10 | 37,000 / 16,000 | — |
| Sensor Tower, **Jan 2026** [F] | Weekly US iOS downloads, Q4 2025 | The top 5 **Puzzle** games (Block Blast!, Jigsolitaire, Magic Sort!, Word Search Explorer, Pixel Flow!) | Peaks of 289k–898k a week, about **40k–130k a day** | Current, but it's the top 5, not a threshold |
| AppTweak, updated Jul 2025 (charts dated 2022) [F] | "Downloads to Top" estimates | Only non-game examples (e.g. Google Play Germany Travel #1 ≈ 8k/day; US Sports #1 ≈ 13k/day) | — | No games, no small markets |
| Apple Developer Forums, May 2016 [F] | One developer's own numbers | **57 downloads worldwide in 4 days** put a *paid* Music app at #7 in Australia's paid Music chart and #9 in Spain's | — | Old. Paid sub-charts are nearly empty. Free Puzzle is nothing like that |

**What I couldn't find:** a developer postmortem that says "we reached #N in Puzzle in country X with Y downloads". I searched dev blogs, Indie Hackers, the Apple forums and ASO vendors. The one I found (the forum post above) is for a paid Music chart. Reddit couldn't be loaded (as before).

### Derived estimates for the storefronts that matter (**estimates**, not published data)

**Method (mine, no source states it):**
- Start from the UK free-games figures (Reflection 2017, cross-checked against Sensor Tower's 8,000 UK top 10 in 2019 and the US trend, flat 2017–2022). That gives about 5,000–6,300 for the top 10 and about 1,100 for the top 100.
- Scale by each country's iPhone base relative to the UK. That's population × iOS share, from general knowledge, not fetched: Canada ×0.6–0.7, Australia ×0.4–0.5, Sweden ×0.15, Norway and Denmark ×0.08–0.1, Ireland, New Zealand and Singapore ×0.06–0.08, Finland ×0.05.
- Convert overall Games to the **Puzzle subcategory**: ×0.3–0.7 at the top 10, because puzzle now dominates the game charts (the Q4 2025 top-5 puzzle games are top-5 overall games), and ×0.25–0.5 at the top 100. Puzzle is about 20% of iOS game downloads [S, Apptica Q1 2023], and Reflection ranked it among the hardest subcategories [F].
- Top 50 ≈ top 100 × 1.7 (Reflection's 65–80% per tier [F]).

Treat every figure below as ±2–3×. The chart window is not public; ASO vendors say recent velocity dominates, so a rank must be held with this volume for about 2–3 days running (unverified).

| Storefront (free iPhone, **Games › Puzzle**) | Top 10 /day | Top 50 /day | Top 100 /day |
|---|---|---|---|
| United States | 8,000–18,000 | 2,000–4,000 | 1,200–2,500 |
| United Kingdom | 1,500–4,400 | 470–940 | 275–550 |
| Canada | 900–3,000 | 280–650 | 165–385 |
| Australia | 600–2,200 | 190–470 | 110–275 |
| Sweden | 225–660 | 70–140 | 40–80 |
| Norway, Denmark | 120–440 | 40–95 | 25–55 |
| **New Zealand** | **90–350** | **30–75** | **15–45** |
| **Ireland** | **90–350** | **30–75** | **15–45** |
| **Singapore** | **90–350** | **30–75** | **15–45** |
| Finland | 75–220 | 25–50 | 15–30 |

*All of this table is an estimate.* Overall **Games** (not just Puzzle) costs roughly 1.5–3× these numbers. The only cross-check that holds up is that Sensor Tower's current US top-5 Puzzle volume (40k–130k a day) sits well above the US top-10 estimate, as it should.

### How the charts are computed, and how that changed

Apple has never published the chart formula. What's known:
- **Velocity, not totals.** The chart reflects recent downloads, by every vendor's account [S, AppRadar, Wuzzon]. Apple has never confirmed the time window.
- **2011:** after Apple started rejecting pay-per-install offers (Tapjoy), developers reported a ranking change. Flurry and W3i read it as a shift "from downloads to activity" [S, PocketGamer, AppleInsider]. Apple confirmed nothing.
- **2013:** TechCrunch reported that Apple appeared to be testing ratings, "and possibly engagement", as chart factors [S]. Again unconfirmed.
- **2017 (iOS 11):** charts were pushed below editorial content, and Top Grossing was removed from the main view [S, TechCrunch]. Browse's share of downloads rose from about 10% to over 15%, mostly from featuring [F, Sensor Tower 2018].
- **2025:** Apple says it blocked 11,500 apps from the charts and 7,800 from search for inflating their visibility [F, Apple Newsroom, May 2026]. **So the charts are filtered:** downloads Apple judges inauthentic are removed, and so are apps.
- **Retention and engagement as chart inputs:** 2026 ASO blogs say "retention now matters more" [S], but none cites Apple. **Unverified.** Plan as if raw recent downloads by unique accounts decide the rank, with fraud filtering on top.

## 2. How much a chart position moves downloads (2023–2026)

**Hard evidence is thin. I found no controlled 2023–2026 study of organic lift from a chart rank.**

- **Search dominates discovery.** Search drove 65% of iOS downloads (games 56%), browse about 15%, and app referrals 17% of game downloads [F, Sensor Tower, May 2018]. Apple's ads site has long said almost 65% of downloads follow a search [S]. A category chart is a small slice of browse.
- **ASO vendor case studies** report about +140–200% organic uplift when an app moved from the top 20 to the top 10 in a US Shopping category, or roughly 1,000–1,500 extra organic installs a day [S, AppSamurai]. These are self-reported, from a vendor that sells burst campaigns, uncontrolled, and US-scale.
- **Featuring, not charts, is the measured multiplier.**
  - Game of the Day: a median of about +800% for a week [F, Sensor Tower 2018; see `gtm-study.md`].
  - Apptopia found games *already* in their category's top 20 gained only about 44% from a feature [S, TechCrunch 2017]. Once you're on a chart, the marginal visibility is modest.
  - AppTweak's 2026 guide cites Train Station 2 at +470% organic installs from a US Game of the Day [S].
- **Decay.** No source measured how fast chart-driven lift decays. The mechanism implies it decays as fast as the velocity behind it: the chart reflects recent downloads, so when the push stops, the rank and the browse traffic it brings fall within days (inference). The friend's "rocket ship" is the positive-feedback case: the chart's own traffic exceeds the push, so the rank holds itself up. That needs a chart people actually browse (US or UK overall top 10–25) and a game that converts browsers. #40 in New Zealand Puzzle won't create it.
- **Estimate for Strata:** holding top 50 Puzzle in New Zealand might add a few to a few dozen organic NZ installs a day while it lasts, and close to nothing after (estimate).

## 3. The legitimate country-launch playbook

| Tactic | Evidence | Does it help Strata? |
|---|---|---|
| **Soft launch in small English markets** (Canada, Australia, NZ; lately the Nordics, Philippines) | PocketGamer.biz: 72% of soft launches used Canada as a US proxy, 56% Australia, 39% NZ [S, undated]. Canada and Australia have become "pricey" [S]. Pokémon GO soft-launched in Australia and NZ [S] | Yes, for **data** (retention, store conversion), not for charts. This matches `gtm-study.md` Phase 1 |
| **A burst of real users** (Apple Ads, a launch-day audience, press, creators) | Apple Ads are real users choosing to download, so allowed. Vendors describe bursts of 24–72 h because charts weight recent velocity [S, AppSamurai glossary, Moburst] | Allowed. Useful in small storefronts where a few hundred real installs move the rank |
| **Pre-orders** | Apple: 2–180 days for a new app, "your app automatically downloads onto the devices of people who have pre-ordered", release dates can be set "for each region" [F, Apple]. Apple doesn't say pre-orders count toward day-1 charts; marketing sites assert it [S] | Yes. Pre-orders turn weeks of interest into one release-day spike in one storefront, and per-region dates allow a small-market launch first |
| **Localise the store listing only** | Apple's featuring guidance values localisation [F, `gtm-study.md`]. Keyword fields are per locale (ASO practice) | Not needed for English storefronts. For non-English markets it's cheap reach; it doesn't change chart maths |
| **Chart in one country to help others** | Charts are per storefront (Apple shows separate charts per country). Ratings and reviews are shown per storefront (general knowledge). No source showed spillover [searched] | **No direct mechanism.** Indirect only: the players are real, and "#1 Puzzle in NZ" is a social post. Apple editorial attention from a small-country rank is unverified; nothing suggests editors watch NZ Puzzle |
| **"Trending" signals** | Third-party trackers (Appfigures, AppMagic, Sensor Tower) flag fast risers across countries; some press reads them | Weak, unquantified |

## 4. The rules (quoted)

### App Review Guidelines (page last updated 16 Oct 2026) [F]

**Section 3, introduction:**
> "If we find that you have attempted to manipulate reviews, inflate your chart rankings with paid, incentivized, filtered, or fake feedback, or engage with third-party services to do so on your behalf, we will take steps to preserve the integrity of the App Store, which may include expelling you from the Apple Developer Program."

**5.6 Developer Code of Conduct:**
> "Repeated manipulative or misleading behavior or other fraudulent conduct will lead to your removal from the Apple Developer Program." … "Your Developer Program account will be terminated if you engage in activities or actions that are not in accordance with the Developer Code of Conduct."

**5.6.1 App Store Reviews:**
> "Use the provided API to prompt users to review your app … we will disallow custom review prompts."

**5.6.3 Discovery Fraud:**
> "Manipulating any element of the App Store customer experience such as charts, search, reviews, or referrals to your app erodes customer trust and is not permitted."

**5.6.4 App Quality:** "excessive customer reports … negative customer reviews, and excessive refund requests" may count against a developer.

**3.2.2(x):**
> "Apps must not force users to rate the app, review the app, download other apps, or other store-related actions in order to access functionality, content, or use of the app. Apps may otherwise incentivize users to take specific actions within apps (such as by completing a level or watching an ad)."

### Developer Program License Agreement [F, fetched 2026-10-31]

**Section 3.2 (the item developers' violation notices cite as 3.2(f)):**
> "You will not, directly or indirectly, commit any act intended to interfere with any of the Apple Software or Services, the intent of this Agreement, or Apple's business practices including, but not limited to, taking actions that may hinder the performance or intended use of the App Store … (e.g., submitting fraudulent reviews of Your own Application or any third-party application …). Further, You will not engage, or encourage others to engage, in any unlawful, unfair, misleading, fraudulent, improper, or dishonest acts or business practices relating to Your Covered Products …"

**Termination** (11.2) is triggered, among other things, "if You engage, or encourage others to engage, in any misleading, fraudulent, improper, unlawful or dishonest act relating to this Agreement, including … falsifying consumer reviews for Your Application".

Apple's violation notices quoted on its forums say "manipulation of App Store chart rankings, user reviews or search index" [S, Apple Developer Forums].

### Apple's statements and enforcement

- **Feb 2012, Apple to developers** [F, quoted by MacStories]: "when you promote your app, you should avoid using services that advertise or guarantee top placement in App Store charts. Even if you are not personally engaged in manipulating App Store chart rankings or user reviews, employing services that do so on your behalf may result in the loss of your Apple Developer Program membership."
- **The trigger: TopDealApps** [F, Pocket Gamer, Feb 2012]. It claimed 200,000 US users with iTunes accounts, who were **paid per download** during campaign windows, and guaranteed a top-50 US free rank. One client's app got over 30,000 downloads "with no reviews and few logins". *This is the "real users, paid to install" model; Apple treated it as manipulation.*
- **2011, pay-per-install offers** [S, Engadget, GamesBeat]. Apple rejected apps carrying Tapjoy-style "install this app for virtual currency" offers. Glu estimated a loss of about $7M a year [S]. Apple targeted the offers again in 2012 [S, TechCrunch].
- **2025 figures** [F, Apple Newsroom, 20 May 2026]:
  - Bad actors use "bot networks to create fake accounts, spam users, manipulate charts, or generate fake reviews".
  - Apple blocked 11,500 apps from the charts and 7,800 from search.
  - It blocked about 195M fraudulent ratings and reviews.
  - It rejected 1.1B fraudulent account creations and terminated 193,000 developer accounts over fraud.
  - For comparison, 2024: over 46,000 terminations and 143M reviews [S].

### Allowed and prohibited

| Allowed | Prohibited (expulsion risk) |
|---|---|
| Apple Ads, Meta and TikTok ads to real people who choose to install | Bots, emulators, device or "click" farms |
| Posting to your own players, socials, email list, Reddit (within sub rules), press, creators | Paying people (cash, gift cards, credits) to download: "rewarded" or "incentivized" install networks and offerwalls |
| Pre-orders, per-region release dates, a soft launch | Any service that "guarantees" a chart position or "top 10 in country X" |
| Asking people to download, rate honestly, and share | Rewards for ratings or reviews; asking for 5 stars in exchange for anything; review swaps |
| In-app rewards for in-app actions (finish a level) | Forcing a rating or review, or a download of another app, to unlock content (3.2.2(x)) |
| Releasing first in a small storefront and focusing real marketing there | Asking friends abroad to create NZ or Irish Apple IDs, switch storefronts, or download and delete to inflate a small chart; "install exchange" groups. Even if the people are real, the downloads aren't genuine demand, and 5.6.3 bans manipulating "any element … such as charts" |

**Grey zone, avoid:** a creator or influencer paid to *feature* the game is advertising, and fine with disclosure. A creator paid *per install their audience makes* moves toward incentivised installs. Stay on flat-fee coverage, or none.

## 5. For Strata

**Constraints that shape the plan:**
- **v1 is free, with no ads or purchases**, so no install pays anything back. Spend is justified only by what it teaches.
- **The app has no analytics or tracking** (privacy page: "no ads, no analytics, and no tracking"). That rules out an attribution SDK. Apple Ads reports its own installs in its dashboard, and App Store Connect's App Analytics gives installs, sessions and retention by territory for users who share data, so nothing needs adding (both from general knowledge of the products, not re-fetched).
- **The web build has no analytics either**, so nobody knows where the web players live. They're probably mostly US (assumption). They can't be sent to the NZ store: a US player downloads from the US storefront, and that's correct. **The web audience can't be pointed at a small country.** It counts toward the US chart, where it won't register.

### Which storefronts (2–4)

1. **New Zealand** (primary).
   - Among the lowest thresholds in English (estimate: top 50 Puzzle about 30–75 a day).
   - Apple Ads runs there [F].
   - It's a classic soft-launch market [S].
   - Its day starts first worldwide, so it gets the launch day first (general knowledge).
2. **Ireland.** About the same threshold. Apple Ads runs there [F]. It's a different region (Europe), so you learn whether the burst carries across.
3. **Singapore** (optional).
   - A similar threshold, and Apple Ads runs there [F].
   - The store's English, but the audience is multilingual, and its Puzzle chart may be crowded with Chinese-language titles (unverified).
   - Use it only if NZ and IE work.
4. **Australia** (stretch, data rather than rank). Top 100 Puzzle at about 110–275 a day (estimate) is reachable, and Apple Ads CPA there was $3.02 in 2025 [F, MobileAction, all categories]. It's the better retention read, because it's bigger and closer to US behaviour, but it costs about 4× more.

Skip Canada and the UK for chart purposes. A top-50 Puzzle spot there costs several hundred real installs a day (estimate), with no payback in v1.

### Launch-week burst plan (rule-compliant)

**T−3 to T−6 weeks (once the build passes review):**
- Put Strata on **pre-order**. Choose between two options:
  - (a) **Worldwide, same release day.** The simplest. Featuring prefers one launch moment (`gtm-study.md`).
  - (b) **NZ and IE release about 1–2 weeks before the rest** as a soft launch. Apple allows per-region dates [F]. That gives a retention read before the main day, but the main launch then isn't "new" in those two storefronts.

  If an Apple featuring nomination is in, prefer (a), and keep NZ and IE as the *focus* of paid spend only.
- Build an Apple Ads account. Plan Search results ads on exact keywords (nonogram, picross, griddlers, hanjie, logic puzzle, Strata), plus a **Today tab or Search tab** ad in NZ and IE. Small-market keyword volume for "nonogram" is likely too low to spend the budget (estimate), and the broad placements reach more people.
- Post a pre-order link where NZ and Irish puzzle players actually are, and only where self-promotion is allowed (check rules live):
  - r/newzealand and r/ireland only if allowed; often it isn't;
  - NZ and Irish game-dev communities (the NZGDA, Imirt in Ireland);
  - local puzzle and board-game groups.

  Show the honest pitch and the trailer.

**Day 0 to day 3 (the burst):**
- Apple Ads in NZ and IE at **$40–80 a day per country** for 3–4 days. Exact keywords plus Search tab, CPA estimated at $1.50–4 (MobileAction 2025: AU $3.02, CA $2.81 [F]; games CPA about $2.20–2.90 [F, SplitMetrics via gtm-study]). That's about 15–40 paid installs a day per country.
- Organic on top of that:
  - pre-order auto-downloads land on day 0 [F, Apple];
  - local community posts;
  - the worldwide audience (web banner, clips, Reddit per `gtm-study.md` Phase 2), which lands in each player's own storefront.
- Screenshot whatever rank results, for posts. **Not in the store metadata:** keep "#1" claims out (`gtm-study.md`).

**Day 4 to day 14 (read the data):**
- Stop or cut the spend.
- Compare D1 and D7 for paid NZ and IE users against everyone else (App Store Connect retention by territory; Apple Ads installs).
- Note how long the rank holds without spend. That is the honest test of the friend's "rocket ship" claim at Strata's scale.

**Plausible cost and outcome (all estimates):**

| Option | Cash | Likely outcome |
|---|---|---|
| NZ and IE, 4 days at $40–80 per country per day | **$320–640** | About 100–300 paid installs in total. With organic, probably **top 100 and possibly top 50 Puzzle** in both for 2–4 days; top 10 unlikely. Organic lift from the rank: tens of installs. The real output is a cohort retention read, the same job as the $300–500 test in `gtm-study.md` |
| Add Australia, 4 days at $100–150 a day | +$400–600 | Probably top 100 Puzzle in AU; a better US-proxy retention sample |
| Push NZ to the top 10 Puzzle | About $1,000–3,500 | Roughly 90–350 installs a day for 3 days. Not worth it in v1: no revenue, and #1 in NZ Puzzle has no proven effect elsewhere |

**Recommendation:**
- Run the NZ and IE burst **as** the Apple Ads test that `gtm-study.md` already budgets. Don't add a separate "boosting" budget.
- Keep the real effort on the levers with evidence: the featuring nomination, the Daily Stone and share line, and clips.
- Never buy a "guaranteed ranking" or "real-user install" package. Most of those are the 2012 TopDealApps model, and Apple names "paid, incentivized … feedback" and "third-party services" explicitly.

## Limits

- **No public 2023–2026 threshold data** exists for Puzzle or for any small storefront. The tools that have it (AppTweak Downloads to Top, Sensor Tower, Appfigures, AppMagic) are paid. The country table is my derivation from 2017–2022 US and UK data, and could be off 2–3×.
  - A one-month AppTweak or Appfigures trial would replace it with measured numbers for NZ, IE, SG and AU Puzzle. Do that before spending.
- **Chart lift and decay:** no controlled study found. The vendor case studies are self-interested.
- **Apple's algorithm** (window, unique-account rules, any retention input) is unpublished. Claims about it are labelled.
- The iPhone-base scale factors and the Apple Ads and App Store Connect capabilities above are general knowledge, not re-fetched.
- Reddit couldn't be loaded. I watched no videos and read no gated reports.

## Sources

[F] = fetched and read; [S] = snippet or summary only. All accessed 2026-10-31.

**Thresholds and charts**
- [F] PocketGamer.biz (sponsored, Reflection data, Dec 2017), "Breaking down the download numbers required to get your game in the App Store's top rankings": pocketgamer.biz/sponsored-app-stores-top-ranking-download-requirements/
- [F] Sensor Tower (Sep 2019), "Downloads Needed to Reach No. 1 on the U.S. App Store …": sensortower.com/blog/app-downloads-to-number-one
- [F] Sensor Tower (Jun 2022), "Downloads Needed for a No. 1 App Have Climbed 37% in 3 Years": sensortower.com/blog/app-downloads-to-number-one-2022
- [F] TechCrunch (2 Jun 2022), "New report examines the number of downloads it takes to hit the top of the App Store"
- [F] Sensor Tower (Jan 2026), "Top 5 Puzzle Games Performance on iOS in the US, Q4 2025"
- [F] AppTweak (updated Jul 2025), "How Many Downloads Does Your App Need to Reach Top Rankings?"
- [F] AppTweak, "App downloads statistics: top countries by app downloads in 2025" (US 6.8B and UK 1.2B iOS)
- [F] Apple Developer Forums thread 46773 (May 2016), "Very low downloads in the Top Charts?"
- [F] Apple, US iPhone Puzzle chart page: apps.apple.com/us/iphone/charts/7012
- [S] Apptica via GameDevReports, mobile puzzles Q1 2023 (puzzle about 19.9% of iOS downloads)
- [S] TechCrunch (Aug 2013), "Apple's App Store Rankings Algorithm Changed To Consider Ratings, And Possibly Engagement"
- [S] PocketGamer.biz and AppleInsider (2011), the ranking change after the incentivised-install ban
- [S] AppRadar, Wuzzon, ASO World (2026), ranking-factor guides (velocity; retention unverified)
- [S] TechCrunch (Sep 2017), the iOS 11 App Store redesign; charts below editorial

**Lift**
- [F] Sensor Tower (May 2018), "App Store Browsing Has Grown to Drive 15% of Downloads Since iOS 11's Launch"
- [S] AppSamurai, "How We Reached Top 10 in App Store Shopping Category" (index fetched [F]; the figures seen only as a snippet)
- [S] TechCrunch (Oct 2017), Apptopia: App of the Day +1,747%, games +792%, top-20 games +44%
- [S] AppTweak (2026), "How to get your app featured…" (Train Station 2, +470%)

**Playbook**
- [F] Apple, "Offering apps and games for pre-order": developer.apple.com/app-store/pre-orders/
- [F] Apple Ads, Countries and Regions: ads.apple.com/app-store/countries-and-regions (NZ, IE, SG, AU, CA, UK and the Nordics all listed)
- [F] MobileAction, 2026 Apple Ads benchmark report: regional CPA (2025: GB $4.53, US $3.85, AU $3.02, CA $2.81) and regional CPT (GB $2.60, US $1.93, DK $1.63)
- [S] PocketGamer.biz, soft-launch trends (Canada 72%, Australia 56%, NZ 39%); AppQuantum, Adjust, AppMasters soft-launch guides; Chartboost commentary on Canada and Australia getting pricey
- [S] Pre-order chart claims: trysonar.app, appsops.store

**Rules and enforcement**
- [F] Apple, App Review Guidelines (last updated 16 Oct 2026): §3 intro, 3.2.2(x), 5.6, 5.6.1–5.6.4
- [F] Apple Developer Program License Agreement (current web version, fetched 2026-10-31): §3.2 "will not … interfere …", the termination clause
- [S] Apple Developer Forums threads 769623 and 769626, 662422 (DPLA violation notices citing 3.2(f) and 11.2, "manipulation of App Store chart rankings, user reviews or search index")
- [F] Apple Newsroom (20 May 2026), "The App Store stopped over $2.2 billion in fraudulent transactions in 2025"
- [S] Press summaries of the 2024 fraud report (46,000 terminations, 143M reviews)
- [F] MacStories (6 Feb 2012), "Apple Warns Developers Against Using Services That Manipulate App Store Rankings"
- [F] Pocket Gamer (Feb 2012), "TopDealApps.com has details of over 200,000 iTunes accounts …"
- [S] Engadget (Apr 2011), "Apple banning pay-per-install apps …"; GamesBeat and PocketGamer.biz on Tapjoy and Glu; TechCrunch (Nov 2012), "Apple Stomps On Tapjoy's App Download …"
- [S] TechCrunch and Gummicube (Jun 2021), the guideline update that expanded 5.6 and clarified 5.6.3
