# Strata: handoff for the next agent

Written 2026-10-26, at commit d13e1f4; brought up to date 2026-10-27. Read this first, then the docs it points to. This file is the map; the `docs/` studies hold the evidence. When something here goes stale, update it in the same commit as the change.

---

## 1. What Strata is

- **The game:** a calm 3D nonogram (picross) in three.js, styled after Monument Valley. You chisel away cubes a block of stone doesn't need, and a small object is uncovered.
  - 182 levels in 15 chapters, 15 bonus stones, and a tutorial.
  - Everything is in `public/js/shapes.js`: `SHAPES`, `CHAPTERS`, `BONUS`, `TUTORIAL` (the old 12 lessons) and `TUTORIAL_V2` (the new 11).
- **The creative north star** (Kellan's words): Journey and Monument Valley first, Shadow of the Colossus too. "Mythical / mysticism, vast nature / journey, call to adventure", "beautiful but minimal", "close to a work of art".
  - Cosy themes feel off-brand.
  - Show only what's needed: no labels, no breakdowns. Results are staged in the scene, not on a UI card.
- **The studio is Unsupervised Rock:** a white pet rock with googly eyes on black, as the splash in `index.html #splash`.
  - The goofy humour belongs to the studio card only. Strata itself stays calm.
- **The player we design for:** Kellan's first testers were three people of about 50 who had never played picross. If they can't follow it, it isn't done.

## 2. Where everything lives

| What | Where |
|---|---|
| Repo | `C:\Qoral\Projects\Misc\Nonogram`, its own git repo; GitHub `KellanM/strata` (public), branch **master** |
| Live web build | https://kellanm.github.io/strata/. Every push to master deploys in about 10 minutes through `.github/workflows/pages.yml` → `npm run build` (`tools/build.mjs`), which also stamps `sw.js` VERSION, so never bump the cache by hand |
| Local server | `npm start`, LAN on :5180 for phones. Agents use `PORT=5290 node server.js` so they don't collide with Kellan's |
| Tests | `npm test`: 31 tests, all must pass. They include solver, uniqueness (every stone, every lesson, has exactly one solution under its shown clues) and ads |
| Store app | Capacitor 8. `capacitor.config.json` has appId `com.unsupervisedrock.strata`, which is permanent once published. `npm run build:app` builds `dist/` without the gallery and prototypes, then runs `cap sync ios` |
| Native bridge | `public/js/native.js`: `nativeApp`, saves mirrored to Capacitor Preferences, real haptics, `noAdsBuild` (store v1 has no ads and no purchases) |
| Store listing | `store/app-store-listing.md`: ready to paste into App Store Connect (name, subtitle, text, keywords, age rating, privacy label, review notes) |
| Store assets | **`store/README.md` indexes them all**: screenshots (`store/screenshots/`, named by order and subject), icon candidates (`store/icon/`), the listing. To reshoot screenshots: `node store/shoot.mjs` (see the listing) |
| Legal pages | `public/privacy.html` and `public/support.html`, deployed with the site |
| Icon and launch art | `resources/` (made by `tools/make-store-art.mjs`) |
| Hidden dev panel | Web only. Hold the version line in How to play, or tap the map's "N stones to uncover" line 5 times. It has the gallery, unlock all, replay tutorial and reset. Add new dev screens there |
| Object gallery | `/strata/gallery/`: candidate objects, from which Kellan picks levels |

## 3. Where things stand (2026-10-27)

**Done and live on the web:**
- The full game.
- The rebuilt tutorial is the web default. It has 11 stones, each uncovering a nameable object (Heart, Pine Tree, Sea Chest, Lantern, Candle, Cat, Crown, Tortoise, Throne, Geode, Mushroom), dressed as Frost Peaks.
  - `?lessons=old` brings back the old run, and the choice sticks in localStorage.
  - The reasoning and each iteration are in `docs/tutorial-study.md`.

**In App Store Connect (a separate agent on Kellan's Mac does the submission):**
- **Build 1.0 (1) is uploaded and processed.** It needed the export-compliance answer by hand ("None of the algorithms mentioned above").
- **Build 1.0 (2) is next.** From then on the repo sets the Xcode project up itself (`tools/ios-configure.mjs`, §4A).
- **The app icon is the Sloth on lime** (`store/icon/app-icon.png`, Kellan's pick 2026-10-27). It's installed for the web (`public/icons/`) and the App Store (`resources/icon.png`).
- **iPhone-only** (Kellan, 2026-10-27).
- Support email: **support@mythen.io**. It's on the privacy and support pages, which have no placeholders left. A "Privacy · Support" link sits in Settings, as Apple 5.1.1(i) requires.
- The compliance research and a ranked build list are in `docs/compliance-study.md`. Items 1 and 2 (the configure script and the privacy manifest) are built; 3 to 5 are not.
- The listing, screenshots, Capacitor setup, haptics and save mirroring are done. Every store asset is indexed in `store/README.md`.
- v1 ships with **no ads, no purchases, no analytics, no accounts**, so the privacy label is "Data Not Collected" and the rating 4+.
- **The store app still uses the old 12 lessons.**
  - The switch is `lessonsV2` in `public/js/main.js`: `return pick ? pick === 'new' : !inStoreApp;`. Remove `!inStoreApp` to use the new run.
  - Do this only when Kellan says so.
  - If it changes, edit the listing's "Twelve short lessons" in the description.

**Not started:** Google Play, ads in the app (AppLovin MAX), analytics, the Daily Stone, Open Graph tags.

## 4. Remaining work

### A. App Store v1 (the critical path)

**Blocked on Kellan** (don't ask again for anything already supplied; check the conversation and this file first):
1. ~~Apple Developer enrolment, the Mac, the API key and the app record~~: done. Kellan's Mac agent signed and uploaded build 1.0 (1).
5. ~~Support email~~ (done: support@mythen.io). **Still needed: a phone number for App Review.**
6. The release date. This also drives the GTM timeline: featuring wants about 12 weeks' notice.
7. **EU Digital Services Act trader status.** If Kellan is a trader, their address and phone are shown publicly in the EU.
8. Decisions on the open listing items:
   - **Subtitle:** not decided. The recommendation (2026-10-27) is "Uncover relics in 3D nonograms" (30 characters), because the name has no search words. The alternative is "A calm 3D nonogram adventure".
   - **Name: decided, "Strata: Stone Puzzles"** (Kellan, 2026-10-27; plain "Strata" is taken). The home-screen label stays "Strata".

**Then the agent's part, on the Mac:**
1. `npm ci`, then `npx cap add ios` (first time only), then `npm run build:app`.
2. `npm run build:app` ends with `tools/ios-configure.mjs`, which sets up the Xcode project every time (tested against Capacitor's template in `test/ios-configure.test.js`):
   - **iPhone-only** (Kellan, 2026-10-27): `TARGETED_DEVICE_FAMILY = 1`, no iPad orientations, so no iPad screenshots are needed;
   - `ITSAppUsesNonExemptEncryption` = NO, so the export question isn't asked per build;
   - portrait only, status bar hidden, Home Screen name "Strata";
   - the privacy manifest `ios-config/PrivacyInfo.xcprivacy` (UserDefaults, CA92.1), added to the app's resources;
   - the version and build number from **`store/release.json`. Bump `build` before every upload.** Build 1 is used.
   By hand: the icon and launch screen (`npx @capacitor/assets generate` from `resources/`).
3. Archive and upload with `xcodebuild` and the API key (`-allowProvisioningUpdates -authenticationKeyPath … -authenticationKeyID … -authenticationKeyIssuerID …`). Then TestFlight on Kellan's iPhone before submitting for review.
4. Before submitting, run the device checks in `docs/launch-checklist.md` §8: first launch through the lessons, offline, backgrounding mid-level, save survival after a relaunch.

**Never ask for or handle Apple passwords.** Signing goes through Xcode, signed in once by Kellan. Uploads use the API key.

### B. After v1 (in rough order)

- **Google Play:** a $25 account. New personal accounts need a closed test (12+ testers, 14 days) before production. Add `@capacitor/android`, handle the back button, and check the adaptive icon's safe zone.
- **Ads in the app (v1.1):** the design is fixed in `docs/ads-study.md`. Interstitials only at breaks and capped; the `rewind` rewarded ad takes back a slip; Remove Ads is **$1.99**, framed as support.
  - Provider: MAX through `ads.js` `setProvider`.
  - Consent: UMP, then ATT, run **after** the tutorial.
  - The privacy label and `privacy.html` must change before this ships.
- **`docs/launch-checklist.md` is partly stale.** It predates commit 56948d8, which added Capacitor 8, Preferences and haptics, and the v1 no-ads decision. Tick those off when you touch it.

### C. Go-to-market

The plan is `docs/gtm-study.md`, researched 2026-10-20. Read its "5 highest-leverage moves" and "The recommended plan". In short:
- **Phase 0, on the web now:**
  - analytics (none exist yet; Kellan picks the service);
  - Open Graph image, meta description and Twitter card (none exist; a shared link shows no image today);
  - a **Daily Stone** with a spoiler-free share line (the Wordle mechanism; no nonogram has one);
  - 3 short clips a week from the trailer pipeline;
  - an itch.io listing;
  - an email list for "tell me when it's on the App Store".
  - Gate G1: lesson completion ≥ 60%, D1 ≥ 25%, D7 ≥ 8%.
- **Phase 1, 12 weeks before launch:** iOS pre-order and Play pre-registration; Apple's featuring nomination; Google's featuring form and Indie Games Corner; a soft launch in Canada or Australia; a press kit; a $300–500 Apple Ads test at most.
- **Phase 2:** launch both stores on the same day.
- **Phase 3:** a new chapter every 4–6 weeks as an In-App Event. Content drops beat everything else for Monument Valley.
- **No paid acquisition** beyond a small test until measured LTV supports it. The gates and kill criteria are in the study.
- Its "Open questions only Kellan can answer" (11 of them) are still open. Bring them up when GTM work starts, a few at a time.
- **Stale numbers in the study:** it says 158 stones and a $2.99 Remove Ads. Today it's 182 stones, $1.99, and no ads at all in v1. Its screenshot story also differs from the 5 chosen on 2026-10-25 (see the listing).

### D. Product follow-ups

- **Tester round:** Kellan's three testers should play the new lessons cold, with nobody explaining. The review method is in `docs/tutorial-study.md`. Nothing about the new run has been tested with players yet; only screenshots and scripted runs.
- **Store lessons:** switch the app to the new lessons once the testers approve (§3).

## 5. Marketing assets

| Asset | Where | Notes |
|---|---|---|
| **The rulebook for any ad or trailer** | `docs/ad-playbook.md` | Read before touching video. Kellan's standing decisions are at the top |
| Best production pipeline | local branch `saturday-trailer-v2` (not pushed): `tools/trailer/v2` (timeline, page, `sfx.mjs`) and `tools/trailer/ads` | Kellan rates Saturday's fast-cut ad as clearly the best. Build new ads from this, not from `timeline-v3/v4` |
| Reference ad | `trailer/reference/saturday-ad-15s.mp4` (local only, gitignored); its 2 fps sheet `saturday-ad-15s-sheet.png` is committed | "The previous video" Kellan means |
| Latest cuts | `trailer/v5/strata-trailer-25s.mp4`, `trailer/v5/strata-ad-15s.mp4` (local), posters and contact sheets in `trailer/v5/` | v5 is the most recent pipeline (`tools/trailer/v5`) |
| Older cuts | `trailer/strata-trailer*.mp4`, posters and contact sheets in `trailer/` | v2 to v4b. v2 (a slow walkthrough) was rejected |
| Store badges | `tools/trailer/badges/` (App Store SVG, Google Play PNG) | For end cards once the listings are live |
| Hook research | `docs/ad-hooks-study.md`, `docs/ad-hooks-renders.md`, `docs/trailer-study.md`, `docs/trailer-v2-study.md` | Six hook-study ads exist on the Saturday branch |
| Store screenshots | `store/screenshots/` | Lead with the reveal, then the break, then the collection |
| App icon | `store/icon/app-icon.png` (installed: the Sloth on lime), candidates beside it; `docs/icon-study.md` | Made with `tools/render-icon.mjs` from the real win state |
| Icon, splash art | `resources/`, `public/icons/` | |
| Press kit | not made yet | A GTM Phase 1 item: logo (the rock), key art, trailer, fact sheet |

**Standing rules for marketing:**
- **Real gameplay only.** Time may be cut between shots under a blur, but play is never faked.
- **Let reveals land fully:** 4.8 s after the winning tap. Never cut mid-rotation or speed it up.
- **No tagline anywhere.** The wall ends on "100+ PUZZLES", exactly that.
- **No "#1" or "best" claims.**

## 6. How we hit the quality bar

The method that worked, every time:
1. **Study before building.** Each big piece has a study in `docs/`: visuals (`study-record.md`), tutorial, ads, GTM, splash, pause, map, motion, voxels, help access. Each one:
   - names the brief;
   - inspects real exemplars;
   - separates what a source said from what we observed and what we're guessing;
   - records what was tried and what failed.
   Read the relevant study before redoing research, and append to it rather than starting a new one.
2. **Look at the actual result.** After any visual or flow change, drive real Chrome with Playwright at a phone viewport (390×844, touch), take screenshots, and **look at them**. Contact sheets of every stone or frame side by side caught most of the real problems: objects that didn't read, ghost fingers left over a solved stone, reveals landing at the wrong angle. Code that passes tests can still look wrong.
3. **Script the player.** For flow bugs, script the way a real player behaves (for example, tapping steadily without pausing) rather than the way you'd test it. The "words only after a mistake" bug only showed up that way.
4. **Iterate on Kellan's tester feedback, not on taste.** Kellan relays what testers did and said. Quote it in the study, make one round of changes, show the evidence, and say plainly what wasn't tested ("checked in the browser only; no tester has played this").
5. **Objects must read at a glance.** Kellan's favourites have:
   - one earthy dominant material plus 1–2 accents;
   - regular patterns (stripes, bands, brick), never random speckle;
   - often a cap on a simpler body;
   - subjects that are heirlooms, creatures of remote places, or mythic landmarks.

   **Paired features must be symmetric** (eyes, ears, horns, wings, limbs). Render all four iso corners plus top and front (`tools/qa-sheet.mjs`) before calling an object done.
6. **Words for a 50-year-old first-timer.** Plain verbs (tap, keep, knock away), one idea per card, at most 18 words (a test enforces this), and a kind reply to a slip.

## 7. Working with Kellan

- **Pronouns:** they/them.
- **They test on an iPhone,** often away from home, from the live site. So "push" is how they see a change. Say when it'll be live (about 10 minutes after a push).
- **They give short feedback from the phone** ("5 still sounds like a riddle"). Take it as the brief, act on it, and reply briefly: what was wrong, what changed, how it was checked, when it's live. Don't send long option lists; recommend one thing.
- **Ask only real decisions.** Use a multiple-choice question when there are genuinely different directions (for example, which biome to dress the lessons as). Don't ask permission for things inside an approved direction.
- **Background:** ex-Unreal Engine developer, so Unreal analogies land.
- **They decide:** names, prices, release date, subtitle, anything public-facing, and which store lessons ship. Draft, recommend, then wait.
- **Approved means approved.** Don't reword or restyle approved pieces (the ad wall, the end sequence, the studio name) without being asked.
- **Never** ask for or handle passwords. Don't search the whole disk or old transcripts without asking first.

## 7b. Talking to the Strata session

Several Claude Code sessions work on Strata at once. **The Strata development session** (this repo's main one, which wrote this file) owns the game, the store assets and this handoff. Other agents own the App Store submission (on Kellan's Mac) and the store page. Coordinate through the two channels below. Never pass passwords, API keys or the `.p8` file through either.

**1. Claude Code's built-in messaging** (first-party). Use it for questions and handbacks between sessions.
- `ListAgents` lists the sessions you can reach. The Strata development session is **`nonogram-cb`**.
  - Names are per session. If a fresh session replaces it, `ListAgents` shows the new name, so check before sending.
- `SendMessage({ to: "nonogram-cb", message: "…" })` sends it a message.
- **Reach:** sessions on the same machine (Kellan's Windows PC). Sessions on other machines (the Mac) are reachable only when Remote Control is connected on both. If `ListAgents` doesn't show `nonogram-cb`, fall back to channel 2.
- **What to send:** say what you need, what you've already checked, and the file paths or commits involved. Keep it short.
- **What not to send:** anything Kellan hasn't approved, presented as approved. A message is not Kellan's go-ahead; the receiving session asks Kellan for decisions.

**2. The repo itself** (always works, on any machine).
- `git pull --rebase` first. Facts live in files: `store/README.md` (store assets), `store/app-store-listing.md` (listing answers), `store/release.json` (version and build), `docs/compliance-study.md`, and this file.
- To hand something back, commit it. Examples: a note under §4A of this file, an updated `store/release.json` after an upload, or new screenshots in `store/`.
- Use the commit message for the story, ending with the attribution lines in §8.
- Bump `build` in `store/release.json` and commit it **before** each upload, so every machine agrees on the next number.

**Who decides:** Kellan (they/them). Every public-facing choice is theirs, whichever session raises it: name, subtitle, icon, price, release date, submitting for review, inviting testers.

## 8. Engineering rules and gotchas

**Git:**
- Commit to master, then `git pull --rebase` (or fetch) and push. Never force-push, never stash or discard someone else's uncommitted work, and stage only your own files.
- Commit style: `feat(lessons): …`, `fix(app): …`, `store: …`, `docs: …`. The subject says what the player gets, in plain words.

**After editing `main.js`:**
- Load the page and check for `pageerror` at boot. A top-level `let` read during boot once crashed the whole module (v0.3.38).
- Then run `npm test`.

**Line endings:** `shapes.js` and `main.js` are CRLF. Scripted multi-line edits must match `\r\n`. `test/*.js` are LF.

**Browser automation:**
- Several agents may share this machine. Take the lock `mkdir C:/Users/Kellan/AppData/Local/Temp/strata-browser.lock` before launching Chrome, and remove it in a `finally`.
- Chrome: `C:/Program Files/Google/Chrome/Application/chrome.exe` with `--use-angle=d3d11 --enable-gpu`.
- Playwright: `file:///C:/Users/Kellan/AppData/Roaming/npm/node_modules/playwright/index.mjs`.

**The title screen must be dismissed before play:** tap (195, 422), wait about 8 s, then swipe up with CDP touch events. `?nosplash` skips the studio card. `window.strata` exposes `game`, `startTutorial(k)` and `act(idx, 'break')` for scripts.

**`shots/` is gitignored:** working screenshots and one-off scripts go there.

**Deploy gotchas:**
- Pages caches for 10 minutes, so the service worker registers with `updateViaCache: 'none'`.
- iOS resumes home-screen apps instead of reloading them, so updates are checked on `visibilitychange`.
- The service worker is off inside the store app.

**Look and sound come from the palette** (`palettes.js`): sky, stone shading, `rayGain`, and the music key and timbre (`audio.js` `KEYS`, via `sound.setKey`).

**Lessons** are data in `shapes.js`. Each hint can have:
- `text` (and `mouse` for desktop wording);
- `demo`, the ghost finger: a cell, a double-tap, a drag, or `{handle: axis}`;
- `line`/`lines`/`pulse` highlights;
- `until`, which advances the hint on break, mistake, rotate, peel or solved;
- `mistake`, the reply to a slip.

Don't use `wait` in first-run lessons: every tap resets its idle timer, so a steady tapper never sees the words.

## 9. Doc index

| Doc | About |
|---|---|
| `docs/study-record.md` | The visual language (Monument Valley lighting, colour script) |
| `docs/tutorial-study.md`, `tutorial-study-sources.md` | Why the old lessons read as riddles; every iteration of the new run |
| `docs/ftue-study.md`, `aha-study.md`, `help-access-study.md` | First session, the "aha", where help lives |
| `docs/game-loop-study.md`, `level-design.md`, `biomes.md`, `biomes-adventure.md`, `map-study.md`, `story-study.md` | Loop, levels, chapters, map, story |
| `docs/voxel-study.md` | Object-building checklist |
| `docs/motion-study.md`, `motion.md`, `pause-study.md`, `splash-study.md` | Motion, pause, studio card |
| `docs/ads-study.md` | In-game ads, Remove Ads, store-release ad checklist, Kellan's ad decisions |
| `docs/ad-playbook.md`, `ad-hooks-study.md`, `ad-hooks-renders.md`, `trailer-study.md`, `trailer-v2-study.md` | Ads and trailers |
| `docs/gtm-study.md` | Go-to-market plan, gates, positioning |
| `docs/launch-checklist.md` | Master pre-launch list for iOS and Android (partly stale, see §4B) |
| `store/app-store-listing.md` | Paste-ready App Store Connect text |
| `store/README.md` | Index of every store asset (screenshots, icons, listing, release.json) |
| `docs/compliance-study.md` | Apple's compliance rules for this app (encryption, privacy manifest, label, age rating, EU trader) and a ranked build list |
| `docs/icon-study.md` | What makes game icons read at 60 px; how the Sloth icon was made and chosen |
