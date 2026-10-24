# Pre-launch checklist: iOS and Android

Started 2026-10-24. This is the master list for taking Strata from the web build to the App Store and Google Play through a Capacitor wrapper.
- Ad and purchase detail lives in `ads-study.md` (store-release checklist); this list points there rather than repeating it.
- Launch timing, featuring and press live in `gtm-study.md`.
- `[x]` means done in the repo; `[~]` means started.

## 0. Decisions only Kellan can make

- [ ] **Studio name.** Quiet Cairn is a proposal (the splash card uses it).
  - A cairn is a stack of stones left to mark the way for whoever comes next. That is Journey's pilgrimage, Monument Valley's monuments and Colossus's ruins in one image, and it is what Strata is made of.
  - A web search on 2026-10-24 found no studio by that name. A trademark search (USPTO, EUIPO) and the domain are still to do.
  - Alternatives that were considered: Waymark (an itch.io prototype uses it), Capstone (taken by a board-game publisher), Lodestar.
- [ ] **Bundle / application ID.** `com.quietcairn.strata` is drafted in `capacitor.config.json`. It is **permanent once published**, so settle the studio name first.
- [ ] **Developer accounts:**
  - Apple Developer Program: $99 a year. Decide between an individual account and an organisation; an organisation needs a D-U-N-S number, which takes days to weeks.
  - Google Play Console: $25 one-off. Personal accounts created after November 2023 must run a closed test with 12+ testers for 14 days before production (`gtm-study.md`).
- [ ] **Contact email and support URL** for the stores and the privacy policy.
- [ ] **Age rating and audience.** A general audience, not Kids or Families. This is open question 6 in `ads-study.md`, and it decides which ad rules apply.
- [ ] **Launch date.** Book it about 3 months out, for featuring nominations and pre-orders (`gtm-study.md`).

## 1. Accounts, legal, money

- [ ] Apple: agreements, tax and banking (needed for IAP and ad payouts); App Store Connect app record.
- [ ] Google: payments profile; Play Console app record.
- [ ] AppLovin MAX account, the app registered on both platforms, and ad units: one interstitial and one rewarded. Placements are `result_to_map`, `shrine_to_map`, `rewind` and `shrine`.
- [ ] AdMob account, if Google is a mediated network. It needs a published GDPR message for UMP.
- [~] **Privacy policy.** A draft is at `public/privacy.html` (deployed with the site). Fill in the contact address, the mediated networks and the date, then check it against the final SDK list.
- [ ] Terms of use: optional. Apple's standard EULA is enough.
- [ ] `app-ads.txt` at the developer website's root. AppLovin and each network supply the lines.

## 2. The wrapper

- [~] `capacitor.config.json` is drafted: appId, appName, `webDir: dist` (the existing build output), a black background and the native splash handing straight over to the web card.
- [ ] `npm i -D @capacitor/cli @capacitor/core @capacitor/ios @capacitor/android`, then `npx cap add ios` / `npx cap add android`. Add the iOS platform on a Mac: it needs Xcode and CocoaPods or SPM.
- [~] **Icons and launch screens.** Source art is in `resources/`, made by `tools/make-store-art.mjs`:
  - `icon.png` at 1024;
  - `splash.png` and `splash-dark.png` at 2732, black with the cairn mark, so the native launch screen matches the web card exactly.
  - Generate every size with `npx @capacitor/assets generate`.
  - Check the Android adaptive icon's safe zone: the block must sit inside the middle 66%.
- [x] **The service worker is off inside the app.** Capacitor serves the files locally; Android's `https://localhost` would otherwise have registered it. See `main.js` (`nativeApp`).
- [ ] **Updates.** The in-app "checking…" update path and `applyUpdate` only make sense on the web. In the app, hide the version line's tap-to-update, or point it at the store.
- [ ] Portrait lock: Info.plist `UISupportedInterfaceOrientations` and the Android manifest `screenOrientation`.
- [ ] Status bar: hidden, or transparent with light content to suit each palette. Use `@capacitor/status-bar`.
- [ ] Android back button (`@capacitor/app`, `backButton`):
  - level → map;
  - map → title;
  - title → leave the app;
  - an open card closes first.

## 3. Native polish (Apple 4.2: "more than a repackaged website")

- [ ] **Haptics through `@capacitor/haptics`.**
  - iOS WebKit has no `navigator.vibrate`; the iOS 18 checkbox trick in `main.js` (`iosTick`) is web-only.
  - Wire `buzz()` to the plugin when `nativeApp`: light impact for a chisel, a notification "error" for a slip, success for a solve.
- [ ] **Save data durability.** Progress lives in `localStorage`. WKWebView can lose it under storage pressure, or when the app's ID or scheme changes.
  - Mirror the saves (`strata.solved`, progress, settings, `strata.ads*`) to `@capacitor/preferences`, and read them back at boot if `localStorage` is empty.
  - **This is the most important technical item**: losing a player's trail is the worst bug a calm game can have.
- [ ] **Audio:**
  - set the iOS audio session to "ambient", so Strata mixes with the player's own music and respects the silent switch;
  - check that the music resumes after a call or after the app has been backgrounded (the `visibilitychange` suspend/resume already exists in `audio.js`);
  - duck the audio under ads (`ads.onAd` already holds the sound).
- [ ] **Game Center / Play Games.** Optional, but it strengthens the 4.2 case and featuring. Achievements could be chapter completions and the shrines.
- [x] Remove the "Best on your Home Screen" tip in How to play when running as an app (`nativeApp`, main.js).
- [ ] Safe areas on notched and Dynamic Island devices and on Android cutouts (CSS already uses `env(safe-area-inset-*)`). Check on real devices.

## 4. Performance

- [x] **Boot:** the map's mist ribbons no longer encode PNGs. That was about 6.5 s of main thread when the map was built; the boot's long task fell from 8.1 s to 0.2 s in desktop Chrome.
- [x] **The studio card** covers the first frames (shader compiles) and the map build, then lifts.
- [x] Optimisation pass (merged 2026-10-24): levels went from 32–38 fps to a steady 60 under 4x CPU throttle (timer text written only on change, hidden map animations paused, shrine shadow, Ash sleeps when empty, peel handles rebuilt only on change, shapes.js load).
- [ ] Next levers, each a visual call: an idle cap at 30 fps after a few quiet seconds; DPR 2 → 1.5 on phones (44% less pixel fill); fewer god-ray march steps; stop the frame loop while the map is up; pause the map companion's SVG animations.
- [ ] Measure on real devices: an older iPhone (an 11 or SE 2), a mid-range Android (Pixel 6a class) and a low-end Android. Targets:
  - 60 fps while playing;
  - no long task over 100 ms after the card lifts;
  - a cold start under 4 s to the title.
- [ ] Battery: render on demand when nothing moves, or drop to 30 fps when idle.
- [ ] WebGL context loss: restore cleanly after the app has been backgrounded for a long time (iOS can drop the context).
- [ ] App size: three.js is vendored minified. Leave the gallery and `proto/` out of the app's `dist` (they are developer pages); see the build's walk.

## 5. Ads and Remove Ads

The detail is in `ads-study.md`, store-release checklist; the essentials are:
- [ ] The MAX provider (`ads.js` `setProvider`): first spike the Cordova plugin inside Capacitor.
- [ ] Consent: MAX's Terms and Privacy Policy Flow (UMP, then ATT), run **after** the tutorial.
- [ ] Remove Ads IAP ($2.99, non-consumable) through RevenueCat or cordova-plugin-purchase, with Restore.
- [ ] A "Report an ad" route (Apple 2.5.18).
- [ ] Block sensitive ad categories, and review creatives in Ad Review.

## 6. Privacy and compliance

- [ ] App Store privacy "nutrition label" and the Play Data safety form. Both must declare the ad SDKs' data: device ID, coarse location by IP, product interaction and diagnostics.
- [ ] Apple privacy manifest (`PrivacyInfo.xcprivacy`):
  - the app's own required-reason APIs (`UserDefaults`, which Capacitor plugins use);
  - each SDK's manifest, which the SDKs ship.
- [ ] ATT usage string (`NSUserTrackingUsageDescription`), worded plainly and calmly.
- [ ] `SKAdNetworkItems` in Info.plist: the list comes from AppLovin.
- [ ] Android: `AD_ID` permission, and target API level 35 or whatever Play requires at submission.
- [ ] Export compliance: the app uses only exempt encryption (HTTPS), so set `ITSAppUsesNonExemptEncryption = NO`.

## 7. Store listings

- [ ] Name and subtitle ("Strata: peel the stone"?), keywords, and a description in the game's voice.
- [ ] Screenshots: iPhone 6.9" and 6.5", iPad if iPad is supported (decide: iPad support means checking the layout at 4:3), and Android phone. Use real gameplay only, as with the ads; 5 to 8 frames.
- [ ] App preview video, 15 to 30 s. `docs/trailer-v2-study.md` and `tools/trailer/` already exist.
- [ ] Feature graphic for Play (1024x500).
- [ ] Age-rating questionnaires: Apple's and IARC (Play).
- [ ] Category: Games › Puzzle. Secondary category: Family? No; see section 0.
- [ ] Support URL, marketing URL, copyright line ("© 2026 Quiet Cairn").

## 8. Quality

- [ ] A device test matrix (see section 4) covering:
  - first launch → splash → title → lessons → First Light;
  - a slip and taking it back;
  - an interstitial and Remove Ads;
  - a restore on a fresh install;
  - offline play (airplane mode);
  - a low-battery or low-power-mode run.
- [ ] Interruptions: a call, a notification, backgrounding mid-level (the clock pauses), backgrounding mid-ad, and rotation attempts.
- [ ] Accessibility:
  - Dynamic Type does not break the HUD;
  - VoiceOver can at least start a level and reach Settings;
  - reduced motion is honoured (the splash and the ash already are);
  - colour: the puzzle never relies on colour alone (the clues are numbers).
- [ ] Crash and error reporting: Sentry or Firebase Crashlytics, with a small JS hook for `pageerror`.
- [ ] Analytics before soft launch: D1, D7, tutorial completion, level funnel, ad impressions, Remove Ads conversion (`gtm-study.md` says measure first). Any analytics SDK changes the privacy label.
- [ ] TestFlight external testing and a Play closed test, the latter needed anyway for new personal accounts.

## 9. Launch

- [ ] Soft launch in 1 or 2 smaller markets to read D1 and D7 before the featuring forms (Google's asks for them).
- [ ] Featuring: Apple's nomination (App Launch type, 3 weeks minimum, 3 months advised); Google's featuring form plus Indie Games Corner.
- [ ] Pre-orders and pre-registration.
- [ ] A press kit: logo (the cairn), key art, the trailer, a fact sheet.
- [ ] After launch: review mining for "ad", "ads" and "paid"; content drops as the growth lever (`gtm-study.md`).
