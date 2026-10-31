# Go-to-market talks study: what the talks say about launching on iOS (2026-10-31)

This is the companion to `gtm-study.md`. That study's stated gap was "I watched no videos: no GDC talks, no TikToks". This one fills the talks part of that gap. It doesn't repeat the platform facts, benchmarks or plan in `gtm-study.md`. Where a talk confirms something already there, it says so in one line and moves on.

**Research only.** No game code was changed. Nothing was committed.

**Strata's situation for this study (2026-10-31):**
- a calm, free, offline 3D nonogram by one developer;
- **v1 has no ads and no in-app purchases** (the `MONETIZED` switch is off). `gtm-study.md` was written when the plan was capped ads plus a $2.99 Remove Ads purchase. Its UA and LTV maths assumed that plan;
- the iOS build is in App Review now;
- the web build is live at kellanm.github.io/strata.

## How the talks were inspected (read this before trusting a quote)

- **I watched none of these talks.** I can't play video or audio. For each talk I downloaded YouTube's caption track with yt-dlp and read the text.
- **Caption quality:**
  - Apple's sessions have **manual captions**, so their quotes are reliable.
  - Every GDC talk and podcast has **auto-generated captions only**. Their quotes are "as heard by the captioner" and contain mis-hearings: "raiding games" is Radiangames; "bouquet" is almost certainly "okay".
  - The Iron Horse paid-UA talk's track reads like a **machine translation**: "facilities" for installs, "RPO" for ARPU. Treat its quotes as paraphrase.
- **Timestamps** mark the start of the 30-second caption block that holds the quote.
- **How much of each talk I read:**
  - **Full transcript**: I read the whole talk.
  - **Partial transcript**: I searched the transcript and read the relevant sections only.
  - **Abstract only**: I saw no content beyond a listing or summary.
- The transcripts sit in a temp folder outside the repo. None was committed (they're third-party text).
- **Searches:** YouTube searches via yt-dlp (about 50 queries), plus two web searches to confirm speaker names.
- **What I couldn't get:**
  - YouTube rate-limited (HTTP 429) two captions: "Put Your Name on Your Game" (Bennett Foddy and Zach Gage, GDC 2019, youtu.be/N4UFC0y1tY0) and "2014 vs. 2018: The Shape of Financial Success Before and After the Indiepocalypse" (GDC 2019, youtu.be/sIqz5xmQKnc).
  - GDC Vault itself was not opened. `docs/talks/notes.md` (2026-10-28) found Vault URLs redirecting to a maintenance page.
  - Ken Wong's two Monument Valley GDC talks aren't on YouTube (see `docs/talks/notes.md`). His Florence postmortem is covered below.
- **Searched for but not found as talks I could read:**
  - Threes, Alto's Adventure GTM (the only Alto GDC talk is about merchandise), A Little to the Left, Cats & Soup, Unpacking, Two Dots (only a UI talk, VY8TsXKRySU, and Margaret Robertson's career talk);
  - Sylvain Gauchet, Mobile Growth & Pizza, Deconstructor of Fun (only weekly-news episodes);
  - Eric Seufert on indie launches specifically (his ATT interview is covered instead).

## The talks

Relevance to Strata: **High** = changes what Kellan should do in the next 90 days; **Medium** = useful context or a tactic for later; **Low** = included for completeness or contrast.

### A. Apple's own sessions

#### A1. "Explore game curation and featuring on the App Store"
- **Speaker and venue:** Kelli, a games editor on the App Store editorial team, at Meet with Apple (Apple Developer), posted 2025-12-18. 16 min.
- **URL:** https://www.youtube.com/watch?v=cx9-9e6tQd0
- **Inspection:** full transcript (manual captions).
- **Key claims:**
  - Players discover games three ways: "browsing our curated tabs, by being referred from outside the store, and by using search" [01:00]. The store is "curated by ... real humans worldwide", and "global editorial teams play everything that we feature" [01:30–02:00].
  - **Collections Strata could fit**, named on stage: "controller support or **offline play**", and "Try before you buy" [03:30]. Seasonal and cultural beats: "International Women's Day, Earth Day, **Accessibility Awareness Day**, and pride" [05:00]. Local editors also plan around local events [05:00].
  - **Game Center earns placement:** "if your game is utilizing Game Center features, there are more opportunities to find it placed in the games app" [06:30].
  - **No checklist:** "There's no checklist that we go through or specific requirements" [07:00]. Editors look at:
    - gameplay design, UI and flow;
    - visual style, animation and sound;
    - controls and performance;
    - "In-game localization and accessibility are also important considerations" [07:30].
  - **A build must be playable:** "we don't feature games that we haven't played", so nominate "when you have a TestFlight build available" [13:30–14:00].
  - **Timing:** "at least three weeks in advance". A collection can go up quickly, but "For stories, it's best to give us about **eight weeks**" [14:00–14:30]. Nominations are checked "every week" [13:00].
  - **One nomination per update:** "If your game has multiple unique updates on the way, please submit those as individual nominations" [15:00]. Dates can be edited after submitting [15:30].
  - On Afterplace, a solo developer's game: the developer "consistently kept us alerted about those updates" [09:00–09:30].
- **Relevance: High.** This is the most direct primary source on the one lever every speaker below agrees matters. Two details are new compared with `gtm-study.md`:
  - eight weeks for a story, not three;
  - Game Center as a placement lever in the Games app, not just protection against guideline 4.2.

#### A2. "Unlock success with premium games on the App Store"
- **Speaker and venue:** Mike Escudero, App Store business development (games), at Meet with Apple, posted 2025-12-17. 13 min.
- **URL:** https://www.youtube.com/watch?v=OEj-58LCbjk
- **Inspection:** full transcript (manual captions).
- **The Dredge segment is missing.** The talk ends by handing over to Nadia Thorne of Black Salt Games (Dredge), but her segment isn't in this upload. It is probably in the full "Press Start" stream (youtu.be/H4Dm97pNGV0, 3 h 30 min), which I didn't read.
- **Key claims:**
  - **Reach:** the App Store reaches "more than 800 million visitors every week". The Today tab is "the most widely read front page in the world" [01:00].
  - **TestFlight:** up to 10,000 external testers through a public link [02:00].
  - **Pre-order:** up to 180 days ahead, and "on launch day, your game will automatically be downloaded onto user's device, letting you build momentum and climb those top charts" [02:30–03:00]. A soft launch can run in some regions while others take pre-orders [03:00].
  - **Four business models:** paid, freemium, a premium hybrid and **"Try Before You Buy"**: "download your game for free, and then unlock the full game content via a single in-app purchase", "such as a little to the left" [04:30].
  - **In-app events** need no new build and surface "in search results, personalized recommendations, and editorial collections" [06:00].
  - **The Thronefall case:**
    - a pre-order page gave the developer "a landing page where they could direct traffic" [09:00–09:30];
    - Try Before You Buy to "open up the top of funnel" [09:30];
    - Universal Purchase plus cloud save [10:00];
    - the "full offering of Game Center features" [10:30].
  - **Game Center Challenges** can include friends "regardless of whether or not that friend has the game installed. So it's an acquisition tool as well" [11:00].
  - **Small Business Program:** 15% commission [12:00].
- **Relevance: Medium–High.**
  - It names Game Center Challenges as an acquisition channel, which is new compared with the study. A daily stone with a friends' challenge is the natural fit.
  - It confirms Try Before You Buy as a store-recognised model with its own editorial collection, an option if monetisation returns.
  - It is Apple selling Apple features, so treat the case study as an illustration, not as evidence.

#### A3. "Meet in-app events on the App Store" (WWDC21)
- **Speaker and venue:** Will Averill, App Store Connect engineering, WWDC 2021 (re-posted 2025-01-28). 14 min.
- **URL:** https://www.youtube.com/watch?v=DG72e54Rmss
- **Inspection:** full transcript (manual captions).
- **Key claims:**
  - **On the product page,** events appear "above screenshots for users who have downloaded your app, and below screenshots for those who haven't" [01:30].
  - **Before and during an event:** you can promote it "up to two weeks before they start", and users can ask for a notification [02:00].
  - **Length and copy:** an event runs "as long as 31 days or as short as 15 minutes" [06:30]. The name allows 30 characters, the short description 50 and the long description 120 [04:30–05:00].
  - **Event Purpose** (attract new users, inform active users, or bring back lapsed users) feeds personalised recommendations [09:00].
  - **Limits:** 10 events approved and 5 published at a time [11:30–12:00]. "There's no need to create a new version of your app" [10:30].
- **Dated?** The mechanics are still current; the store design shown is iOS 15.
- **Relevance: High** for Strata's chapter drops (M5 in `gtm-study.md`). New here:
  - an event shows *above* the screenshots for lapsed players;
  - "lapsed users" is an explicit purpose, so a new chapter doubles as a win-back push from the store itself.

#### A4. "Get started with product page optimization" (WWDC21)
- **Speakers and venue:** Seema Vora and Cailin Arena, App Store, WWDC 2021 (re-posted 2024). 28 min.
- **URL:** https://www.youtube.com/watch?v=78s73lIi5l0
- **Inspection:** full transcript (manual captions; read in detail to 28:00).
- **Key claims:**
  - **What you can test:** the icon, screenshots and previews, with up to 3 treatments [02:00]. An icon treatment shows across the store and becomes the installed icon [03:30–04:00].
  - **The worked example's traffic:** "about 174,404 impressions -- or about two weeks' time -- to conclude that the treatment results in 5 percent improvement ... with 90 percent confidence" [08:30–09:00].
  - **Minor tweaks don't settle anything:** "Minor tweaks tend not to yield conclusive results" [14:00]. No confidence is shown for the first 7 days [22:00]. Treatments "Likely to Be Inconclusive" within the 90-day limit should be stopped [23:00].
  - **Sample hypotheses:** icon colour, localised previews for Japan, character-focused screenshots [19:00].
- **Relevance: Medium, with a warning the study missed.** At Strata's likely traffic (hundreds of product-page impressions a day, not ~12k), a PPO test of a modest change won't conclude within 90 days. **Inference:** only test big swings, such as an icon concept or the first screenshot's subject, and only after a feature or a viral spike lifts traffic.

#### A5. "What's new in App Store Connect" (WWDC25)
- **Speakers and venue:** Chinedu and Michael, App Store Connect engineering, WWDC 2025. 26 min.
- **URL:** https://www.youtube.com/watch?v=41T0PEPZyHQ
- **Inspection:** partial transcript (manual captions; read the discovery sections, 08:30–20:00).
- **Key claims:**
  - **App Store Tags:** "generated by our large language models using a range of data sources, including your app's metadata", human-reviewed, and shown in search. Developers can deselect tags [09:00–10:00].
  - **Custom product pages can now carry keywords** and "be surfaced in search results". Assigning keywords can go live "without needing to submit for review" [10:30–11:30].
  - **Offer codes** now cover non-consumables [12:00].
  - **Review Summaries** are generated by LLM [15:00].
  - **Accessibility Nutrition Labels** on the product page (Larger Text, VoiceOver and so on) [19:00–19:30].
- **Relevance: Medium–High.** All of this postdates `gtm-study.md`'s sources:
  - Tags are derived from metadata, so the description should name what Strata *is* in plain words ("offline", "relaxing", "logic puzzle", "3D"), not only keywords.
  - Keyworded CPPs let a "picross" search and a "relaxing puzzle" search each land on their own screenshot set.
  - Accessibility labels are a visible, checkable signal of the accessibility editors say they weigh (A1).

#### A6. "Enhance your presence on the App Store" (WWDC26)
- **Speaker and venue:** Ruhi, App Store Connect engineering manager, WWDC 2026 (2026-06-08). 8 min.
- **URL:** https://www.youtube.com/watch?v=VE8eCNBdVMk
- **Inspection:** full transcript (manual captions).
- **Key claims:**
  - **A new Product Page Header:** "your Product Page can now have a Header, and here you have the freedom to use images and videos, outside of your app screenshots and previews" [00:30–01:00].
  - **Search results:** "Instead of showing the default app screenshots, you can use an impactful image or video, to make your app stand out in the Search Results" [01:30].
  - **Where they go:** these assets can also be used in Apple Ads and in custom product pages [02:00–02:30], and they work "on both iOS 27 and iPadOS 27" [04:00].
  - **Asset Library:** approved assets can be swapped live "without going through additional reviews". The example swaps a summer header for a winter one [06:30–07:00].
- **Relevance: High and brand new.** This changes the screenshot story in `gtm-study.md`:
  - Strata's strongest asset (a revealed object turning to face you, or the reveal clip) can be the **search-result visual** itself;
  - a seasonal chapter can swap the header without a release.
- **Unverified:** whether this is live in the iOS 27 store today, and its exact specs. Check App Store Connect.

### B. GDC talks

#### B1. "Free vs. Paid: Discoverability for Smaller Mobile Games"
- **Speaker and venue:** a solo developer of 17 mobile games, who self-identifies through Radiangames titles (Inferno 2, Slydris, Scorcher, Overload/Revival). This is Luke Schneider. **His name is inferred, not spoken** in the captions.
- **Event:** GDC 2019 Game Discoverability Day (posted 2020-02-17). 26 min.
- **URL:** https://www.youtube.com/watch?v=_NuN9YrES0I
- **Inspection:** full transcript (auto-captions).
- **Key claims:**
  - **One day of promotion per game:** he emails "about a dozen press people", does some social posts and spends "about a day promoting the game" [04:00–04:30]. He has "never talked to" Apple or Google, yet "15 of the 17 games ... have been featured" because Apple sees the TouchArcade and Pocket Gamer coverage [04:30–05:00].
  - **The listing slot decides downloads:** "the slot on the new games list is directly corresponds to how many downloads I'll get for my game regardless of quality" [14:00].
  - **Free versus paid, same slot:** a free game and a paid game got the *same* featuring slot. The free one had about **20× the first-week US downloads** ("for lower price gains the ratio will be a bit closer than 20 to one") [14:30]. First-five-week revenue was "very similar" [13:30].
  - **Featuring rolls out by country:** Game of the Day "in the U.S. in January, a bunch of other countries in February and then China in March, it was like getting three extra launches" [15:00].
  - **Free games demand more:** "you have to be more hardcore about ease-of-use issues" [16:00]. "if you don't enjoy obsessing over optimization and stats get someone to help you" [18:00].
  - **Paid games need a feature:** "if you're doing paid games you probably need to get an Apple feature to be successful" [19:30].
  - **The paid chart is cheap to climb:** in 2019 about 300 downloads a day reached the top 50 paid games [12:30–13:00].
  - **Discoverability compounds:** fast, consistent, good releases built standing coverage, and "eventually Apple started picking up on that" [24:30].
- **Dated?** **Yes.** TouchArcade closed in 2024, and the chart numbers are 2019. The free-versus-paid ratio and the "feature by country" pattern still match later reports, but that is unverified.
- **Relevance: High.** The closest speaker to Strata's profile: a solo developer of calm-leaning puzzle and action games who hates marketing. Two lessons:
  1. Free multiplies reach about 20× at equal featuring.
  2. Apple featuring rolls out country by country, so localisation buys extra "launches".

#### B2. "Paid Acquisition for Smartphone Games: A Scrappy, Practical Guide"
- **Speaker and venue:** "Mike", CEO and sole employee of Iron Horse Games (surname not in the captions), GDC 2019 Game Discoverability Day (posted 2019-12-02). 33 min.
- **URL:** https://www.youtube.com/watch?v=fV-L1WtZiM4
- **Inspection:** full transcript (machine-translated captions; quotes are approximate).
- **Key claims (idle games, mostly on Google Play):**
  - **Apple's ratio is poor:** "four to seven paid installations for every one organic one" [24:30]. He doesn't market on Apple until he has done "a huge amount of marketing for Google" because Apple has "no safety net" [25:00].
  - **Chart-buying test:** $4,000 a day for 4,000 installs reached the US top 300 games and added only "100 to 200" organic installs a day. The top 100 needs about 10,000 installs a day [25:30–26:00].
  - **Google's launch window:** organic-to-paid can reach 4:1 in the first 30 days [14:00].
  - **Ad-network credits:** networks give $5k–20k in ad credit for integrating their SDK [09:30–10:00].
- **Dated?** **Very.** It predates ATT (2021) and the SKAN era, and the CPI numbers are from 2019.
- **Relevance: Low for v1**, but useful evidence: a solo publisher with 11M installs a year found Apple paid UA the worst channel of all. That backs `gtm-study.md`'s "no paid UA at launch" from the practitioner side.

#### B3. "BADLAND Postmortem: Building on App Store Launch Success"
- **Speaker and venue:** Johannes Vuorinen, Frogmind (two people), GDC 2014. Posted 2014-07-03 by a third party, not the GDC channel. 25 min.
- **URL:** https://www.youtube.com/watch?v=nXenflW1Ufo
- **Inspection:** full transcript (auto-captions).
- **Key claims:**
  - **Before launch:** the first gameplay video drew TouchArcade and Edge coverage, and "next day we got email from Apple" [02:30–03:00].
  - **Launch:** Editor's Choice brought "100 000 downloads for 3.99", then "pretty quickly it went to somewhere around one thousand downloads per day" [03:30–04:00].
  - **Updates:** "monthly updates" [06:30]. Each spike came from "new featurings in app store", plus returning players and press [07:00].
  - **Price drops:** spikes that "seem to work automatically" because deal trackers pick them up [07:30–08:00].
  - **A free week:** in Apple's anniversary promotion it gave 7M downloads, then "almost no effect for the paid downloads after that" [08:30–09:30].
  - **No paid UA:** asked about advertising, he said there was none: "mostly because of the huge app store promotion and app store featurings" [24:30].
  - **Android:** free with video ads plus a premium unlock; 6M downloads at about $0.05 ARPU [16:00–16:30].
- **Dated?** **Yes**: the 2013–14 App Store, before the Today tab.
- **Relevance: Medium–High.** It is a clean natural experiment for M5 in `gtm-study.md`: content updates → refeaturing → spikes, with no paid UA. It is also a caution: a one-off giveaway spike (the free week) didn't convert into lasting players.

#### B4. "Letting Go: A Florence Postmortem"
- **Speaker and venue:** Ken Wong, Mountains, GDC 2019 (posted 2019-07-16). 32 min.
- **URL:** https://www.youtube.com/watch?v=MhI03UIT70c
- **Inspection:** full transcript (auto-captions). It is mostly design; the business part is at the end.
- **Key claims:**
  - **The premium result:** Florence, Apple Design Award winner and Annapurna-published, "only did sort of [okay], it made its money back and then some" [28:30].
  - **Premium mobile is hard:** "it makes me wonder how premium games fare when they don't win Apple Design Awards or when they don't get constant featuring on the App Store. I think if your business plan is based around premium mobile you're up for a really tough challenge" [29:00].
  - **Where sales came from:** "iOS makes up 88% of sales". "China is our biggest market on iOS by far, over 40 percent, almost double ... the US" [29:30].
  - **The store banner was planned early:** Wong drew the hero poster thinking "I would love to see that as the banner on the App Store one day" [16:30].
- **Relevance: Medium.**
  - It supports Kellan's free v1: the most-awarded calm mobile game of its year only broke even on premium.
  - **The China figure is new** compared with `gtm-study.md`. For a wordless, calm, beautiful game, Simplified Chinese may matter more than its place in the study's localisation list implies (inference from one game).

#### B5. "The Business & Development of Sword & Sworcery"
- **Speaker and venue:** Nathan Vella, Capybara Games. The talk is from 2012 (it says 350k sold in under a year) and was posted 2018-09-13. 62 min.
- **URL:** https://www.youtube.com/watch?v=xQDboND7wJY
- **Inspection:** partial transcript (auto-captions; read 00:00–22:30 and searched the rest).
- **Key claims:**
  - **Pick a niche:** "everyone actually isn't a demographic ... when you say oh I'm making a game for everyone it actually means that you're not really making a game for anyone" [17:00]. A hits-driven mindset is "playing the iPhone lottery" [17:30–18:00].
  - **Serve the core platform first:** they targeted a "culturally literate audience" and polished the iPad version first, judging it the core audience's platform. It "hit number four on iPad before even getting featured". Two-thirds of sales and over three-quarters of revenue came from the iPad or Universal builds [20:30–21:30].
  - **Contributors spread the word:** friends who contribute small pieces "grow the number of eyeballs on your project" [14:30].
- **Dated?** **Very**: 2011–12 premium iOS.
- **Relevance: Low–Medium.** The niche-first principle still holds and is echoed by B6 and C1. **Inference:** iPad may be Strata's natural "best version" for calm 3D puzzles; check the iPad share in App Analytics after launch.

#### B6. "The Golden Rule of Game Promotion: No One Cares About Your Game"
- **Speaker and venue:** Thomas Reisenegger, Future Friends Games, GDC 2023 (posted 2023-05-01). 31 min. Speaker confirmed via the GDC Vault listing.
- **URL:** https://www.youtube.com/watch?v=-341jEXj-iI
- **Inspection:** partial transcript (auto-captions; read 00:00–14:00).
- **Key claims:**
  - **Rule 1, "get to the point quick"** [06:00]. Indie trailers that open on logos and environment shots lose "90 of the people" [06:30].
  - **The store page matters most:** "your store Page is your most single important marketing asset; 90 of all people that ever gonna see your game ... come through a store Page" [09:30]. Townscaper's "Instant town building toy" is the model of a one-line hook.
  - **Rule 2, "make things work for newcomers"** [10:30].
  - **TikTok as a test bed:** it is a good place to test hooks, because watch time is the metric [08:30–09:00].
- **Relevance: Medium.** It is Steam/console-oriented, but the store-page and first-second rules transfer directly to App Store screenshots and the new WWDC26 header. It agrees with `ad-hooks-study.md`.

#### B7. "The Marketing Money Talk: How to Budget Your Indie Game's Promotion Campaign"
- **Speaker and venue:** Thomas Reisenegger, GDC 2024 (posted 2024-10-14). 33 min.
- **URL:** https://www.youtube.com/watch?v=-jM9Tx6AVIE
- **Inspection:** partial transcript (auto-captions; read 00:00–16:00).
- **Key claims:**
  - **Scope:** explicitly for premium PC and console, "not super aimed [at] people that make free-to-play games or mobile games" [03:00].
  - **Budgets:** "planning your budget is great, I think sticking to it terrible idea"; keep slack for opportunities [06:30].
  - **Item #1 in his spending hierarchy is "first party support"** (platform featuring) [09:00]. A cheap self-captured trailer costs $500–1,000 [11:30].
- **Relevance: Low–Medium.** It is useful as the PC-side echo of the mobile speakers: platform-holder support ranks first.

#### B8. "Selling Out: What a Year of F2P Taught an Art-House Indie"
- **Speaker and venue:** Margaret Robertson, Dots (ex-Hide&Seek), GDC 2019. 65 min.
- **URL:** https://www.youtube.com/watch?v=wAEQ7ujO89o
- **Inspection:** partial transcript (auto-captions; searched, and read 40:30–58:30).
- **Key claims:**
  - **Live service changes the work:** Two Dots "is iterating incredibly fast, month on month" [44:30–45:00]. She urges indies to imagine shipping a follow-up to their own game [45:30].
  - **Her monetisation litmus test:** "we don't do anything we would be uncomfortable [with] if our players knew about" [54:00].
- **Relevance: Low.** It is a career talk, not GTM. Her litmus test matches Strata's honest-monetisation stance for whenever monetisation returns.

### C. Industry talks and podcasts

#### C1. "Hitting #1 on the App Store by Partnering with Hank Green" (Launched podcast)
- **Speaker and venue:** Bria Sullivan (Focus Friend; Boba Story), host Charlie Chapman, *Launched* by RevenueCat, posted 2026-05-06. 79 min.
- **URL:** https://www.youtube.com/watch?v=RfCIikVJBkw
- **Inspection:** partial transcript (auto-captions; read 13:00–18:30, 27:00–37:30 and 41:30–64:00).
- **Key claims:**
  - **Where her marketing began:** she learned it by becoming a TikTok creator around 2020–21, building in public, and interviewing her audience on livestreams about art direction ("Is this more of the vibe that y'all like?") [13:00–18:00]. "the look and feel matters so much for organic reach" [37:00].
  - **She dropped the pre-order chart hack.** Indie TikTok developers would "gather pre-orders for as long as we could, like 90 days ... and do a big launch because you could hit number one" [44:30]. A friend's apps went "up to number one and all the way down ... to nearly zero"; the one with a long tail came from "nailing what the experience is like from beginning to end". So she told Hank, "I don't think that we should do that" [45:30–46:00].
  - **A quiet launch first:** one YouTube community post gave "like 20,000 downloads ... in that week", with "so much bad feedback" [46:30]. She waited until the complaint emails waned, then did the full push [53:30].
  - **No ads and no tracking:** she pulled the ads for Hank's reputation and "made the decision to not have an advertising tracking ID, which ... basically kills paid acquisition for us" [51:00–52:00]. Privacy came up unprompted in her audience interviews [51:30].
  - **The launch angle:** the creators' messaging led with screen-time control rather than "focus timer". She "just had to trust them" [57:30–58:00]. Press coverage followed the chart climb; it wasn't pitched [58:30–59:00].
  - **Apple:** she did Apple's Entrepreneur Camp ("every indie should apply to it if it still exists") [62:00]. What she says attracts editors is "the onboarding being really easy to understand and a little bit of design" [63:30]. The host, Chapman (Dark Noise), adds that featuring is "pretty much the only marketing channel I have" and that system-integration features get Apple's attention [63:00]. That remark is his, not hers.
  - **Outcome:** #1 overall on the App Store, about 200k → 2M downloads [00:00]. It won an App Store Award and Google Play's best app of 2025 [61:00].
- **Relevance: High.** It is the most recent indie launch case here, and it shares Strata's unusual constraint: **no ads and no tracking, by choice**. Lessons:
  - creator distribution plus a soft launch to a core community before the loud push;
  - don't game the charts with pre-orders;
  - craft and onboarding for editors.
- **Caveat:** her reach came from Hank Green's audience, and that can't be copied.

#### C2. "Thriving as an App Developer Despite Apple's ATT" (Sub Club)
- **Speaker and venue:** Eric Seufert (Mobile Dev Memo, Heracles), host David Barnard, Sub Club by RevenueCat, posted 2021-12-01. 64 min.
- **URL:** https://www.youtube.com/watch?v=yDl35hu1esQ
- **Inspection:** partial transcript (auto-captions; searched, and read 37:30–54:00).
- **Key claims:**
  - **ATT hurt small developers most:** before ATT, "any small time app developer" could spin up Facebook campaigns. ATT "edged out the small guy" [37:30, 41:30–42:00].
  - **Freemium needs scale:** you need "a very large surface area for experimentation" [40:00].
  - **Organic has a ceiling:** "organic's never gonna be the ultimate scale channel ... it's going to flatten out" [50:00]. Paid users "look distinct", so "the sooner you bring that in, the sooner you can sort of optimize the product for them", with "an organic halo effect" [50:30–51:00].
  - **Against "magical thinking":** the idea that a good product needn't be marketed; "Apple spends tens of billions of dollars on marketing" [54:00].
- **Dated?** Partly. It was recorded 8 months after ATT; SKAN and AdAttributionKit have moved on since.
- **Relevance: Medium, as the main dissent.** He is the strongest credible voice *against* an organic-only plan. For a free game with no ads, though, there is no revenue for paid UA to recover, so his argument applies only if monetisation returns.

#### C3. "Can a Bad Name Hurt a Good Game?" (GameDiscoverCo Show)
- **Speakers and venue:** Simon Carless and Chris Plante, GameDiscoverCo, posted 2026-10-06. 39 min.
- **URL:** https://www.youtube.com/watch?v=e96unkZLv-U
- **Inspection:** partial transcript (auto-captions; read 09:30–15:30).
- **Key claims:**
  - **Carless:** a name "just needs to be ... functionally discernable from other games" and not constantly confused; beyond that, names rarely make or break a game [11:00–11:30].
  - **Plante, against colons:** press shortens the name and fans split on which half to search [14:00].
  - **Carless, the exception:** some titles add words for SEO, and "certainly on the app store people definitely do this. They will elongate their app store name for search engine reasons" [15:00–15:30].
- **Relevance: Medium.** It bears on `gtm-study.md`'s "Strata: 3D Nonogram" proposal and its 2013-*Strata* collision:
  - the App Store convention supports the suffix;
  - the collision is exactly the "functionally discernable" risk Carless names;
  - **inference:** people will call the game "Strata", so the subtitle and the icon must carry the "3D nonogram" identity.
- **Note:** it is Steam-centred; the App Store remark is a one-liner.

#### C4. "How to build your app's brand on the app stores" (Phiture ASO consultants)
- **Speakers and venue:** Phiture consultants (names unclear in the captions), Business of Apps webinar, posted 2020-04-06. 29 min.
- **URL:** https://www.youtube.com/watch?v=R3KTH-j2-oU
- **Inspection:** partial transcript (auto-captions; read the opening).
- **Key claim:** branded search dominates keyword downloads for established apps. In one client's Google Play data, "brand keywords account for 65.3% [of] downloads by keywords" [01:30].
- **Relevance: Low–Medium.** **Inference:** a new app with no brand lives on generic keywords ("nonogram", "picross"), which is why B2, C5 and A5's keyworded CPPs matter more at launch than later.

#### C5. "ASO: Focus on what actually matters" (ASO Conference 2023)
- **Speaker and venue:** Anton Tatarynovich (Freeletics, ex-Phiture), Phiture ASO Conference 2023 (posted 2026-05-06). 35 min.
- **URL:** https://www.youtube.com/watch?v=GYkVb8SQPN4
- **Inspection:** partial transcript (auto-captions; searched, and read 11:00–23:00).
- **Key claims:**
  - **Audit traffic sources first.** If search is a small share and mostly brand, ranking work "would not really reflect on the top line metrics" [11:30–12:00].
  - **Keyword work fades:** "the more mature the app is, the less impactful keyword optimization is" [22:30].
  - **Use conversion rate by source** to choose between keyword work and conversion work [15:00].
- **Relevance: Medium.** The flip side is that keyword work pays most at launch. Do it once properly now, then judge by App Analytics' source split.

#### C6. Shorter or lower-value items read
- **"ASO 3.0 – The Next Generation of ASO for Mobile Games"** (StoreMaven and Jam City, Mobile Growth Association, posted 2020-02-27). https://www.youtube.com/watch?v=2f847ejXswY. Full transcript. ASO is "not a one-time thing" [05:00]; test "the first impression ... a cohesive message in theming" [15:00]. **Low**: aimed at teams with UA budgets.
- **"Woodoku's 'Brainy' Marketing"** (AppAgent, *Mobile Ad Eaters* #7, 2021-04-01). https://www.youtube.com/watch?v=63lmmhXA0yw. Full transcript (5 min). Triple Dot's growth director:
  - the best ad character was a cute brain;
  - "seasonality ... winter campaigns, Christmas campaigns" win [01:30];
  - they put winning ad themes into the game [02:00].
  
  **Low–Medium**: it backs seasonal chapter drops and seasonal header swaps (A6).
- **"Discoverability from Day Zero"** (Felix Kramer, Fellow Traveller scout, GDC 2020). https://www.youtube.com/watch?v=V-LYyRqEC84. Opening read only; it is about PC publishing scouting. **Not used.**

## Recurring strategies, ranked

The rank weighs how many credible speakers back a strategy against its fit for a free, calm puzzle game made by one person with no marketing budget.

| # | Strategy | Backed by | Fit for Strata | Notes |
|---|---|---|---|---|
| 1 | **Apple editorial featuring is the main lever on iOS; book it like an event** | A1, A2, B1, B3, B4, C1 (Sullivan and host Chapman), B7 (PC equivalent) | Very high | Every indie mobile success here ran through featuring. Florence and Schneider say premium can't work *without* it. New detail: 3 weeks minimum, **8 weeks for a story**, a playable build required, one nomination per update |
| 2 | **Content updates create new featuring moments** | A1, A3, B3, B8, B1 (feature rollout by country) | Very high | BADLAND's monthly updates each brought refeaturing. Apple asks for a separate nomination per update and recommends keeping editors "alerted". In-app events add store surfaces, including above the screenshots for lapsed players |
| 3 | **Craft, onboarding, accessibility and localisation are what editors weigh** | A1, A5, C1, B4 | Very high | Strata's strongest cards. Apple names accessibility and localisation outright, and WWDC25 made accessibility visible on the product page |
| 4 | **Free beats paid on reach; premium needs a feature** | B1 (about 20× downloads at the same slot), B3 (free on Android), B4, C2 (freemium needs scale) | High (already decided) | Confirms v1 is free. Nobody here shows a no-revenue free game *growing*, though; it is reach without a business |
| 5 | **Paid UA on iOS is a poor tool for a small developer** | B2 (Apple 4–7 paid : 1 organic), C1 (no tracking ID "kills paid acquisition"), B3 (none used), C2 (ATT hurt small developers) | High | The one dissent is C2, below |
| 6 | **The store page is the main marketing asset; hook in the first second** | B6, A4, A6, C6 (ASO 3.0), B1 (trailers "are actually on the store now") | High | WWDC26's header and search visual make this more powerful than when `gtm-study.md` was written |
| 7 | **Start in a niche and with a core community, then go wide** | B5, C1, B6 (make things work for newcomers), B1 (a dozen press contacts who always cover him) | High | Sullivan's quiet launch to a core audience before the push; Vella's "everyone isn't a demographic". For Strata the core is the nonogram/picross audience plus calm-game players |
| 8 | **Game Center integration is a discovery surface, not a checkbox** | A1, A2 | Medium–High | New. Challenges reach friends who don't have the game. It fits a daily stone. Engineering cost via Capacitor is unknown |
| 9 | **Seasonal and cultural timing** | A1, A6, C6 (Woodoku) | Medium | Editors plan around holidays and awareness days, and WWDC26 lets the header change with the season without review |
| 10 | **Generic keywords matter most at launch** | C4, C5, B2 | Medium | Brand search doesn't exist yet for a new app. Keyworded CPPs (A5) let different searches see different pages |
| 11 | **Creators and short video carry calm games** | C1, B6 (TikTok as a hook test bed) | Medium | Already in `gtm-study.md` (M3). C1 adds that a creator *partner* can be the whole launch, though Strata has no Hank Green |
| 12 | **Pre-orders for momentum** | A2 (Apple), C1 (against chart-gaming) | Medium–Low | See the disagreements |

## Disagreements between speakers

1. **Organic only, or layer in paid early?**
   - Seufert (C2): "organic's never gonna be the ultimate scale channel", and delaying paid delays learning who your scaled audience is.
   - Schneider (B1), Vuorinen (B3) and Sullivan (C1) grew without paid on iOS.
   - Iron Horse (B2), the only paid-UA practitioner here, found Apple paid UA the worst channel.
   - **Resolution for Strata:** Seufert's argument assumes revenue per user to optimise against. A v1 with no monetisation has none, so organic plus featuring is the only coherent plan. Revisit if `MONETIZED` turns on.
2. **Pre-orders: a launch accelerant or a trap?**
   - Apple (A2) presents pre-orders as building momentum to "climb those top charts", and as a landing page.
   - Sullivan (C1) saw pre-order-stacked #1s crash "to nearly zero", and chose a quiet soft launch to her core audience instead.
   - They don't fully conflict: Apple's Thronefall used the pre-order page as a traffic target, not as a chart hack.
   - **For Strata:** the build is already in review, so the decision is whether to hold release for a pre-order window at all. These talks lean against holding just to stack day-one installs.
3. **Paid or free for a craft-first game.**
   - Schneider (B1) still prefers paid for his own sanity ("working on Scorcher was more enjoyable and the launch was way less stressful") despite about 20× fewer downloads.
   - Wong (B4) calls premium mobile "a really tough challenge".
   - Apple (A2) promotes Try Before You Buy as the bridge.
   - This is settled for v1 (free) but relevant to the later monetisation choice. Try Before You Buy has its own editorial collection (A1), which a capped-ads model doesn't.
4. **Can you go one-day-of-marketing?**
   - Schneider (B1) spends about a day per launch and has never contacted Apple.
   - Sullivan (C1) and Reisenegger (B6, B7) treat marketing as a craft equal to development ("the reason that someone will be successful is ... their instinct for marketing", C1 [00:00]).
   - Schneider's approach relied on TouchArcade, which no longer exists, and on 17 releases of track record. A first-time developer can't borrow that standing.

## What's new compared with `gtm-study.md`

**Changes or sharpens a recommendation:**
1. **Apple's story lead time is ~8 weeks, not 3** (A1). Nominate the *first content update* now, even while v1 is in review, and submit each chapter drop as its own nomination.
2. **The WWDC26 Product Page Header and custom search-result visuals** (A6, iOS 27). Strata's reveal can be the first thing seen in search. The screenshot story in `gtm-study.md` should be re-planned around a header asset, with seasonal swaps from the Asset Library.
3. **WWDC25 App Store Tags, keyworded CPPs and Accessibility Nutrition Labels** (A5). Write the description so the LLM-generated tags land on "offline", "relaxing" and "logic puzzle". Build "picross" and "relaxing puzzle" CPPs with keywords. Fill in the accessibility labels honestly.
4. **Game Center as a placement and acquisition surface** (A1, A2), not just protection against guideline 4.2. A daily stone plus Challenges is the store-native version of the Wordle share loop.
5. **PPO needs traffic Strata won't have** (A4): ~174k impressions for a 5% lift in the worked example. Only test bold changes, and only after a spike.

**New evidence for existing choices:**
6. **About 20× downloads for free versus paid at the same featuring slot** (B1). It supports the free v1 with a number from a solo developer.
7. **Featuring rolls out country by country** ("three extra launches", B1), and **China was over 40% of Florence's iOS sales** (B4). Localising, especially Simplified Chinese and Japanese, buys extra featuring moments. The China figure comes from one game; treat it as a hypothesis.
8. **A natural experiment for "content drops are relaunches"** (B3): each monthly update brought new featuring. A one-off free-week spike of 7M left almost no lasting effect.

**New tactics or cautions:**
9. **A no-ads, no-tracking launch has a recent precedent** (C1). Focus Friend dropped its tracking ID for its audience's privacy, gave up paid UA, and still reached #1 via creators and editorial. It also soft-launched quietly to its core audience before the loud push.
10. **Apple's Entrepreneur Camp** (C1): an application-based Apple programme an indie can apply to. Whether it is open, and its eligibility, are unverified.
11. **Name:** "functionally discernable" is the test (C3). App Store name suffixes are conventional, which supports "Strata: 3D Nonogram". People will still call it "Strata", so the icon and subtitle carry the identity.
12. **The "monetisation is off" correction.** `gtm-study.md`'s brief, LTV model and "honest price" screenshot assume ads plus Remove Ads. For v1 the screenshot line should be something like "Free. No ads. No purchases.", which is a stronger wedge than the $2.99 line. That copy is a suggestion; nothing has tested it.

## Watch these first (5)

1. **"Explore game curation and featuring on the App Store"**, Apple editorial, 16 min. https://www.youtube.com/watch?v=cx9-9e6tQd0
   - An App Store games editor explains, in her own words, what editors play, which collections exist (including "offline play") and the 3-week / 8-week timing.
   - It is the single most decision-relevant 16 minutes for a game that is in review now.
2. **"Free vs. Paid: Discoverability for Smaller Mobile Games"**, GDC 2019, 26 min. https://www.youtube.com/watch?v=_NuN9YrES0I
   - A solo developer who dislikes marketing explains how 15 of 17 games got featured, gives the ~20× free-versus-paid download ratio, describes Game of the Day rolling out by country, and warns that free games demand stats work.
   - The closest profile to Kellan's. The TouchArcade parts are dated.
3. **"Hitting #1 on the App Store by Partnering with Hank Green"**, Launched (RevenueCat), 2026. https://www.youtube.com/watch?v=RfCIikVJBkw
   - Start at about 41:30 and stop at about 64:00.
   - The most recent indie #1, launched with no ads and no tracking. It covers the quiet community launch before the push, why she rejected pre-order stacking, and what she thinks editors want.
4. **"Enhance your presence on the App Store"**, WWDC26, 8 min. https://www.youtube.com/watch?v=VE8eCNBdVMk
   - The new product-page header and search-result visuals, which postdate the existing store-page plan.
   - Pair it with "What's new in App Store Connect" (WWDC25, https://www.youtube.com/watch?v=41T0PEPZyHQ, 08:30–20:00) for Tags, keyworded CPPs and Accessibility Nutrition Labels.
5. **"BADLAND Postmortem: Building on App Store Launch Success"**, GDC 2014, 25 min. https://www.youtube.com/watch?v=nXenflW1Ufo
   - Two developers, no UA, an Editor's Choice launch, then monthly updates, each bringing new featuring.
   - It is the clearest evidence for Strata's chapter-drop plan. It's dated (2014 store), so watch it for the pattern, not the numbers.

**Runner-up:** "Letting Go: A Florence Postmortem" (https://www.youtube.com/watch?v=MhI03UIT70c, 28:30–30:00). Watch it if premium is ever reconsidered; it also has the China number.

## Inspection limits

- **I watched no video.** Everything here comes from caption text. Tone, slides and charts were invisible: Sworcery's sales graph was described as "gone" even in the room, and Schneider's charts are on his slides only.
- **Auto-caption errors** are likely in every GDC and podcast quote. The Iron Horse track appears machine-translated.
- **Missing talks:**
  - the Foddy and Gage, and Indiepocalypse, captions were rate-limited;
  - the GDC Vault wasn't opened;
  - the Mobile Summit and Independent Games Summit tracks were sampled only through what the GDC YouTube channel has posted;
  - talks I couldn't find: Alto, Threes, A Little to the Left, Cats & Soup, Unpacking, Mini Metro marketing (`docs/talks/` has its design talk). Also no Sylvain Gauchet, Deconstructor of Fun or Mobile Growth & Pizza episode on indie launches.
- **The talks are survivors.** BADLAND, Florence, Sworcery and Focus Friend were all featured or awarded. Schneider (B1) is the only speaker who also shows modest outcomes.
- **Dating:**
  - B1, B2, B3, B5 and C2 predate or barely postdate ATT (April 2021). B1, B3 and B5 also predate the Today tab, or the closure of TouchArcade (2024).
  - The Apple sessions are current (2021–2026). Apple sells its own features, though, so their case studies are illustrations, not independent evidence.
- **Not checked live:** whether WWDC26's header and search visuals are available in App Store Connect today, and whether Apple's Entrepreneur Camp is open to games and to Kellan.
