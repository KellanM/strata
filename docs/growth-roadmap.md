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

## Not picked for now (still options)

The Smart App Banner, a cadence of content drops, reveal clips, Apple Arcade, and the country chart burst. Don't build these unless asked.
