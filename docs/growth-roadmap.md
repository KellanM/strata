# Growth roadmap: the strategies Kellan picked, as tests (2026-10-31)

Read this before any growth work, and keep the status table current. The background is in docs/gtm-study.md, gtm-talks-study.md, charts-country-study.md, hopkins-study.md and ipad-duo-plan.md.

**Principle (Kellan): test, don't assume.** Each strategy has a hypothesis, one primary metric, a way to read that metric without a tracking SDK, and a decision rule. The privacy label stays "Data Not Collected", so measurement uses only App Store Connect (App Analytics, Custom Product Pages and promotional text), plus counts on the web that never leave the device.

## Release plan

- **v1.0 (build 7, in review):** unchanged.
- **v1.1, "made for iPhone Duo":** everything below except localisation, which follows in v1.2 once native speakers have checked it. The work happens on a `v1.1` branch. The web goes live only when Kellan merges it, so the release can be tested as a whole first.
- **v1.2:** Japanese and Simplified Chinese, plus anything v1.1's results change.
- **v1.3:** iPad (docs/ipad-duo-plan.md, M2).

## The tests

| # | Strategy | Hypothesis | Primary metric (where to read it) | Decision rule | Status |
|---|---|---|---|---|---|
| D | iPhone Duo version | A "Made for iPhone Duo" badge and the Duo collections bring featuring and installs that few games compete for | Featuring yes/no; impressions and installs in the week after (App Analytics, by Source Type: App Store Browse) | Keep adopting new hardware early if featured, or if Browse impressions at least double against the v1.0 baseline | planned (v1.1) |
| 1 | Rating prompt after a world closes | Asking at a peak moment brings more and better ratings | Ratings count and average (App Store Connect › Ratings and Reviews), in the 4 weeks before and after v1.1 | Keep if the average is ≥ 4.5; move the moment if under 4.3 | planned (v1.1) |
| 3 | Measurement without tracking | One link per channel shows which channels bring players who stay | Installs and D7 retention per Custom Product Page (App Analytics) | Spend effort only on channels with D7 at or above the median | planned. Code: none. Kellan sets up the Custom Product Pages and the links |
| 4 | Promotional text as an A/B test | Hopkins's specific-claim line converts better than the mood line | Conversion rate, product-page views to installs (App Analytics) | Run each line for 2 weeks and keep the higher one. Only differences above about 20% can be told apart at Strata's traffic (gtm-talks-study) | ready: copy in store/listing-copy-hopkins.md; Kellan pastes it |
| 6 | Localisation (Japanese, Simplified Chinese) | Localised store pages and game reach Japanese and Chinese puzzle players, and editors value localisation | Impressions and installs by territory (App Analytics: Japan, China mainland, Taiwan) | Add the next language if those territories reach ≥ 10% of installs within 8 weeks | v1.2; the string system is built in v1.1, the translations checked by native speakers before shipping |
| 7 | Accessibility (larger text, clue marks without colour) | Players with low vision or colour blindness can play, and editors look for it | Share of players who turn on Larger text (counted on the device, never sent); reviews that mention it | Keep. It's the right thing whatever the numbers say; the count tells us whether to go further | planned (v1.1) |
| 8 | Daily Stone and share line, plus Game Center Challenges | A shared daily brings players back each day and reaches new ones through the share | D1 and D7 retention (App Analytics) against v1.0's; installs from the share link's Custom Product Page | Keep and grow it if D7 rises or the share link brings ≥ 5% of installs; otherwise simplify it | web and share line in v1.1; Game Center Challenges need App Store Connect setup (Kellan) and the native plugin (Mac build agent) |

## Who does what

- **Built here** (game code, tests, docs): the Duo layout work, the rating prompt call, the larger-text setting, the clue-mark check, the Daily Stone and share line, the JavaScript side of Game Center, the string system, and draft translations (marked unreviewed).
- **Mac build agent:** the Xcode 27.1 build, `npx cap sync` with the new plugins (`@capacitor-community/in-app-review` 8.x, and the Game Center plugin), the Game Center capability, and Duo screenshots in the simulator if `store/shoot.mjs` can't produce them.
- **Kellan:**
  - all App Store Connect changes: Custom Product Pages, promotional text, Game Center leaderboards and Challenges, and the featuring nomination;
  - the order of release;
  - the native-speaker review of the translations.

## Every other strategy we raised (on the table, not started)

Kellan (2026-10-31): keep all of these, not just the ones picked. Each is a test waiting for its turn. Move a row up into the table above when it starts.

| Strategy | Hypothesis | Metric (where) | Notes and risks | Source |
|---|---|---|---|---|
| iPad, universal (v1.3) | The 3D puzzle is at its best on a big screen; iPad players are the calm-game core | iPad share of installs and sessions; iPad featuring | One-way decision. Needs landscape layout, interface scale, pointer, keyboard and Pencil. A peel handle goes missing on iPad sizes today | ipad-duo-plan.md M2 |
| #2 Smart App Banner on the web | Web players on iPhone move to the app | Installs from the web's Custom Product Page link | One meta tag, once the App Store page is live | this list |
| #5 Content drops, nominated for featuring | Each update is a new featuring chance (BADLAND) | Featuring per update; reactivated players (App Analytics) | Gallery picks are the supply; add an in-app event to each drop; nominate 3 weeks ahead, 8 for a story | gtm-talks-study.md |
| #9 Reveal clips, and a search-result video | "What's inside?" clips travel at no cost; a video beats screenshots in search | Views to installs from the link in the bio's Custom Product Page | The trailer pipeline exists; check that the WWDC26 search-result video is live in App Store Connect | gtm-study.md M3, gtm-talks-study.md |
| #10 Apple Arcade pitch | Strata fits Arcade (no ads, no purchases, crafted); Arcade pays and features steadily | Accepted or not | A strategic fork: exclusivity may clash with the free web version and with ads later (strata-monetization-off) | this list |
| #11 Country chart burst (New Zealand, Ireland) | A short Search Ads burst charts Strata in small Puzzle charts | Top Puzzle rank in New Zealand and Ireland; installs during the burst and the week after | Charts are per country, so it doesn't carry over. About $300–600. Time it with an update and a nomination. Real users only | charts-country-study.md |
| Hopkins listing copy | Specific claims ("one answer per stone, no guessing") convert better than moods | Conversion rate (App Analytics) | Promo text first (#4); the subtitle and captions are Kellan's call | store/listing-copy-hopkins.md |
| Copy study rewrites (C1–C8) | One name per thing makes the lessons clearer | Lesson completion (counted on the device); D1 | The rewrites are ready; "chisel" against "tap away" needs a playtest | copy-study.md |
| Pre-orders and the featuring forms | A launch is one big event, booked months ahead | Featuring; day-one installs | For future major updates | gtm-study.md |

**Avoid:** paid "boosting" services, bots and rewarded installs (guideline 5.6; Apple ended 193k developer accounts in 2025); paid ads at scale while v1 earns nothing; A/B tests too small to resolve at Strata's traffic.
