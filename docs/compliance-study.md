# Compliance study: App Store compliance for Strata's iOS release

Researched 2026-10-27, at build 1.0 (1), which is uploaded and shows **Missing Compliance** in TestFlight. Method: the creative-study method used across `docs/` (brief, primary sources, what a source says vs what we observed vs what we infer, then a ranked, testable hit list).

Labels used throughout:
- **[F]** the page was fetched and read (Apple's DocC pages were read from their JSON source, `developer.apple.com/tutorials/data/documentation/...json`, because the HTML is rendered by script).
- **[S]** search snippet or third-party report only; not confirmed on a primary page.
- **[O]** observed by us in this repo or in `node_modules` (Capacitor 8.5.3, Haptics 8.0.2, Preferences 8.0.1).
- **[I]** our inference.
- **[M]** from memory, not re-checked this session. Treat as a lead, not a fact.

Anything that Apple changed in 2025–26 is date-stamped.

---

## 1. Brief

Strata ("Strata: Stone Puzzles", bundle `com.unsupervisedrock.strata`) is a Capacitor 8 app wrapping a three.js web build. v1 has no ads, purchases, analytics, accounts or networking. The `ios/` project is generated on the Mac (`npx cap add ios`) and is not in the repo, so every hand edit to it is lost each time it is regenerated.

Questions:
1. What is the right export-compliance answer, now and when ads arrive?
2. What privacy manifest does the app need, and what does App Store Connect reject at upload?
3. What is the App Privacy label for v1 and for the ads/IAP version?
4. What is the current age-rating questionnaire, and what are our answers?
5. Which other gates does a first submission hit?
6. What can we build in the repo so each answer is given once, correctly and automatically, and so a code change that breaks an answer fails a check?

---

## 2. Sources

| # | Source | URL | Label |
|---|---|---|---|
| A1 | Complying with encryption export regulations | https://developer.apple.com/documentation/security/complying-with-encryption-export-regulations | [F] |
| A2 | `ITSAppUsesNonExemptEncryption` | https://developer.apple.com/documentation/bundleresources/information-property-list/itsappusesnonexemptencryption | [F] |
| A3 | Overview of export compliance (ASC Help) | https://developer.apple.com/help/app-store-connect/manage-app-information/overview-of-export-compliance | [F] |
| A4 | Export compliance documentation for encryption (ASC Help reference) | https://developer.apple.com/help/app-store-connect/reference/app-information/export-compliance-documentation-for-encryption | [F] |
| A5 | Provide export compliance information for beta builds | https://developer.apple.com/help/app-store-connect/test-a-beta-version/provide-export-compliance-information-for-beta-builds | [F] |
| A6 | Determine and upload app encryption documentation | https://developer.apple.com/help/app-store-connect/manage-app-information/determine-and-upload-app-encryption-documentation | [F] |
| A7 | Developer Forums 772201, "What type of encryption algorithms does your app implement?" (Jan 2025, no Apple staff reply) | https://developer.apple.com/forums/thread/772201 | [F] (community, not Apple) |
| A8 | Developer Forums 802828, key = NO but still asked (Oct 2025, no replies) | https://developer.apple.com/forums/thread/802828 | [F] (community) |
| B1 | Describing use of required reason API | https://developer.apple.com/documentation/bundleresources/describing-use-of-required-reason-api | [F] |
| B2 | `NSPrivacyAccessedAPIType` (UserDefaults reasons CA92.1, 1C8F.1, C56D.1, AC6B.1) | https://developer.apple.com/documentation/bundleresources/app-privacy-configuration/nsprivacyaccessedapitypes/nsprivacyaccessedapitype | [F] |
| B3 | Adding a privacy manifest to your app or third-party SDK | https://developer.apple.com/documentation/bundleresources/adding-a-privacy-manifest-to-your-app-or-third-party-sdk | [F] |
| B4 | Third-party SDK requirements (the "commonly used SDKs" list) | https://developer.apple.com/support/third-party-SDK-requirements/ | [F] |
| B5 | Capacitor 8 docs, Privacy Manifest | https://capacitorjs.com/docs/ios/privacy-manifest | [F] |
| B6 | `@capacitor/preferences` 8.0.1 README, "Apple Privacy Manifest Requirements" | `node_modules/@capacitor/preferences/README.md` | [O] |
| B7 | ITMS-91053 reports (ptkd.com, RevenueCat community, NativeScript blog) | e.g. https://blog.nativescript.org/ios-privacy-manifests/ | [S] |
| C1 | App privacy details on the App Store | https://developer.apple.com/app-store/app-privacy-details/ | [F] |
| D1 | Age ratings values and definitions | https://developer.apple.com/help/app-store-connect/reference/app-information/age-ratings-values-and-definitions | [F] (first 100k of 116k chars) |
| D2 | Set an app age rating | https://developer.apple.com/help/app-store-connect/manage-app-information/set-an-app-age-rating | [F] (page partly garbled) |
| D3 | App Store Connect API, `AgeRatingDeclaration.Attributes` (the questionnaire as data) | https://developer.apple.com/documentation/appstoreconnectapi/ageratingdeclaration/attributes-data.dictionary | [F] |
| E1 | Upcoming requirements | https://developer.apple.com/news/upcoming-requirements/ | [F] |
| E2 | Manage EU Digital Services Act trader requirements | https://developer.apple.com/help/app-store-connect/manage-compliance-information/manage-european-union-digital-services-act-trader-requirements | [F] |
| E3 | Screenshot specifications | https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications | [F] |
| E4 | App preview specifications | https://developer.apple.com/help/app-store-connect/reference/app-information/app-preview-specifications | [F] |
| E5 | App information (content rights, bundle ID, SKU, EULA) | https://developer.apple.com/help/app-store-connect/reference/app-information/app-information | [F] |
| E6 | Provide test information (TestFlight) | https://developer.apple.com/help/app-store-connect/test-a-beta-version/provide-test-information | [F] |
| E7 | App Review Guidelines (1.5, 2.1(a), 2.3.3, 2.4.1, 4.2, 5.1.1(i)) | https://developer.apple.com/app-store/review/guidelines/ | [F] (first 100k of 114k chars) |
| E8 | `UIRequiresFullScreen` | https://developer.apple.com/documentation/bundleresources/information-property-list/uirequiresfullscreen | [F] |
| E9 | App Store Connect API, `Build.Attributes.usesNonExemptEncryption` | https://developer.apple.com/documentation/appstoreconnectapi/build/attributes-data.dictionary | [F] |
| F1 | AppLovin MAX iOS, Privacy manifests | https://support.applovin.com/en/max/ios/overview/privacy-manifests | [F] |
| F2 | IDFA question in the submission flow (Branch guide, TechCrunch, undated) | https://help.branch.io/developers-hub/docs/apple-app-store | [S] |
| R | Repo: `HANDOFF.md`, `store/README.md`, `store/app-store-listing.md`, `package.json`, `capacitor.config.json`, `public/js/native.js`, `public/privacy.html`, `public/support.html`, `docs/launch-checklist.md` §6, `node_modules/@capacitor/*`, the `cap add ios` templates in `node_modules/@capacitor/cli/assets/ios-*-template.tar.gz` | | [O] |

---

## 3. Findings

### 3.1 Export compliance

**What the sources say**
- [F A1] "If your app uses, accesses, contains, implements, or incorporates encryption, this is considered an export of encryption software." Every new version gets the questions unless the Info.plist answers them.
- [F A1, A2] Set `ITSAppUsesNonExemptEncryption` to `NO` "if your app, including any third-party libraries it links against, doesn't use encryption, or if it only uses forms of encryption that are exempt". "Typically, the use of encryption that's built into the operating system, for example when your app makes HTTPS connections using URLSession, is exempt from export documentation upload requirements, whereas the use of proprietary encryption is not." Without the key, "App Store Connect walks you through an export compliance questionnaire every time you upload a new version".
- [F A1] "If your app uses exempt forms of encryption, you might alternatively be required to submit a year-end self-classification report to the U.S. government."
- [F A4] Apple's own mapping, the clearest statement on the topic:

  | Encryption in use | Documentation |
  |---|---|
  | "limited to that within the Apple operating system" | "No documentation required in App Store Connect." |
  | "an industry standard algorithm, not provided within the Apple operating system" | French encryption declaration (only if distributed in France) |
  | "proprietary encryption algorithms not accepted by international standard bodies" | US CCATS **and** the French declaration (France only) |

- [F A3] France: "The main items of control for France are Secure Storage, Secure Communications, and Security Anti-Virus applications." A3 also lists "crypto functionality within Apple's operating system" as something that needs a *determination*, which A4 then resolves as "no documentation".
- [F A7] The TestFlight question, as reproduced by a developer (Jan 2025): *"What type of encryption algorithms does your app implement?"* with four options: (1) proprietary or non-standard algorithms; (2) "Standard encryption algorithms instead of, or in addition to, using or accessing the encryption within Apple's operating system"; (3) both; (4) "None of the algorithms mentioned above". [S A7] Community consensus: option 4 is for apps that use only the OS's encryption, or none.
- [F A5] "Specify encryption use for your build to avoid the beta being marked as Missing Compliance." The answers given in the TestFlight dialog are not said to carry over to later builds; only the Info.plist key (or an approved documentation code) removes the question for future builds.
- [F E9] The App Store Connect API has a `usesNonExemptEncryption` Boolean on `Build`, so the answer for an already-uploaded build can also be set by script with the API key.
- [F A8] One developer (Oct 2025) reports being asked even with the key set to `NO`; there was no answer. [I] Treat this as rare; if it happens, the answer is the same.

**What we observed**
- [O] `public/js` has one `fetch`, a relative file (`map-peaks/peaks.json`) inside the bundle. No `XMLHttpRequest`, `WebSocket`, `sendBeacon` or `crypto.subtle`. No external URLs in `index.html`, `style.css` or `public/js` besides `https://localhost` (Android's local scheme). The service worker is off in the app.
- [O] Native code: Capacitor core's `AppUUID.swift` calls CommonCrypto `CC_SHA256` to hash a random UUID. That is Apple's OS library, and hashing is not encryption for confidentiality. No `CCCrypt`, `SecKey`, CryptoKit or bundled OpenSSL in Capacitor, Haptics or Preferences.
- [O] Build 1.0 (1) shows Missing Compliance, so it was uploaded **without** `ITSAppUsesNonExemptEncryption`. [I] The other Info.plist edits listed in HANDOFF §4A.2 (portrait only, status bar hidden, display name) may be missing from that build too.

**Inference**
- [I] **"None of the algorithms mentioned above" is the right answer for build 1.0 (1).** Strata implements no encryption; anything encrypted on its behalf would be done by iOS itself (A4 row 1: no documentation). Options 2 and 3 are for algorithms *not* provided by the OS, and option 1 for proprietary ones. No French declaration is needed (A4 footnote applies only to rows 2 and 3).
- [I] The year-end self-classification report: A1 says "might". [M] A BIS rule of March 2021 removed the self-classification report for most mass-market items, and OS-only encryption is the lowest-risk case. Not worth acting on for v1; listed under open questions for v1.1+.
- **When AppLovin MAX arrives:** [I] the answer stays NO / "None" only if every linked SDK (MAX, each mediation adapter and network SDK, Google UMP, the analytics SDK) uses the OS's TLS (URLSession/WKWebView) and no bundled crypto library. Ad SDKs are binary frameworks, so a source grep can't prove it. We need a binary scan on the Mac (§5, item 8) and each vendor's statement. If an SDK bundles a standard library (for example BoringSSL), A4 row 2 applies: answer option 2 and, if Strata is sold in France, upload a French declaration.

### 3.2 Privacy manifests

**What the sources say**
- [F B1] "Starting May 1, 2024, apps that don't describe their use of required reason API in their privacy manifest file aren't accepted by App Store Connect." "If you use the API in your app's code, then you need to report the API in your app's privacy manifest file." "For each executable or dynamic library in an app that uses a required reason API, the bundle that includes the executable or dynamic library needs to include a privacy manifest file that reports the API."
- [F B2] UserDefaults reason **CA92.1**: "access user defaults to read and write information that is only accessible to the app itself." 1C8F.1 is for App Groups, C56D.1 is for third-party SDK wrappers only, and AC6B.1 is for MDM managed configuration.
- [F B3] "App Store Connect rejects app submissions that include invalid privacy manifest files." "Starting February 12, 2025, apps you submit for review in App Store Connect must contain a valid privacy manifest file for a certain number of commonly used third-party SDKs." "You need to add the privacy manifest file to your target's resources."
- [F B4] **Capacitor and Cordova are on Apple's list** of SDKs that need a privacy manifest (and a signature when used as binary dependencies). Capacitor plugins are not named. AppLovin and Google UMP are not on the list.
- [F B5, O B6] Capacitor 8's docs and the Preferences README both say the **app** must add `PrivacyInfo.xcprivacy` with `NSPrivacyAccessedAPICategoryUserDefaults` / `CA92.1` when using `@capacitor/preferences`.
- [S B7] ITMS-91053 "Missing API declaration" arrives by email minutes after upload and names the category.

**What we observed**
- [O] `@capacitor/ios` ships two manifests (`Capacitor/PrivacyInfo.xcprivacy`, `CapacitorCordova/PrivacyInfo.xcprivacy`), both empty: no API types, no data, tracking false.
- [O] `@capacitor/preferences` **ships no manifest**, yet calls `UserDefaults.standard` (`Preferences.swift:19`, `PreferencesPlugin.swift:89-114`). `@capacitor/haptics` ships none and needs none (UIFeedbackGenerator only).
- [O] The SPM template (`ios-spm-template.tar.gz`, which Capacitor 8 uses by default) builds plugins as source in a local `CapApp-SPM` package, linked statically into the app binary. [I] So Preferences' UserDefaults use is in the **app's** executable, and only the app target's manifest can declare it. That matches B5/B6.
- [O] **The template does not contain a `PrivacyInfo.xcprivacy`**, and its `project.pbxproj` uses classic groups (explicit `PBXFileReference` entries). Copying a file into `ios/App/App/` is not enough: it must also be added to the App target's Copy Bundle Resources phase, or it won't be in the `.app`.
- [O] No other required-reason APIs (file timestamps, system boot time, disk space, active keyboards) appear in the Capacitor, Haptics or Preferences Swift/ObjC sources.
- [I] Build 1.0 (1) almost certainly has no app manifest. B1 says such builds "aren't accepted". Either the upload passed with a warning email (ITMS-91053) or the rule is enforced at *review* submission. **Kellan should check the account's email for an ITMS-91053 message about build 1.** Either way, the next build must have the manifest.

**Inference: the app's manifest for v1**
```text
NSPrivacyTracking            false
NSPrivacyTrackingDomains     []
NSPrivacyCollectedDataTypes  []
NSPrivacyAccessedAPITypes    [ { NSPrivacyAccessedAPICategoryUserDefaults : [CA92.1] } ]
```
**v1.1 (ads, IAP, analytics):** [F F1] AppLovin ships its manifest from SDK 12.4.1, and its Mediation Debugger (12.4.2+) checks both the network SDKs' manifests and the app's. [I] The app's own manifest stays as above unless *our* code starts collecting data or using new APIs. The SDKs' manifests cover the SDKs, and Xcode's privacy report merges them (Organizer › Archive › Generate Privacy Report). [I] Our data types still go in the *nutrition label*, which is a separate form (§3.3).

### 3.3 App Privacy label

**What the sources say**
- [F C1] "Collect" means "transmitting data off the device in a way that allows you and/or your third-party partners to access it for a period longer than what is necessary to service the transmitted request in real time." Third-party partners include "advertising networks, third-party SDKs". "Tracking" is linking data about a user or device "with Third-Party Data for targeted advertising or advertising measurement purposes, or sharing [it] with a data broker."

**v1: "Data Not Collected"** [O] The listing's answer is right: nothing leaves the device, and there's no third-party code that transmits data. Preferences and localStorage stay on the device. Capacitor's AppUUID never leaves it either.

**v1.1 with MAX, UMP, ATT, Remove Ads and analytics:** [I] A likely shape, to be confirmed against AppLovin's and each network's own disclosure pages at the time (not fetched here):

| Data type (C1) | Used to track you? | Linked? | Purposes | Why |
|---|---|---|---|---|
| Device ID (IDFA when ATT allows; IDFV) | Yes | Usually treated as linked | Third-party advertising, analytics | Ad SDKs |
| Advertising Data | Yes | | Third-party advertising | Ads seen and clicked |
| Coarse Location (IP-derived) | Yes | | Third-party advertising | Ad targeting |
| Product Interaction | Possibly | | Analytics, third-party advertising | Analytics events; ad SDK engagement |
| Crash Data, Performance Data, Other Diagnostic Data | No | | App functionality, analytics | SDK diagnostics, crash reporting |
| Purchase History | Only if our analytics or an SDK sends it | | Analytics | StoreKit itself is Apple's, not a collection by us |

Other things that change at v1.1:
- `privacy.html` (5.1.1(i) requires naming third parties and deletion and consent routes).
- The age-rating answer "Advertising" becomes Yes (still 4+, §3.4).
- ATT `NSUserTrackingUsageDescription` and `SKAdNetworkItems` (already in `launch-checklist.md` §6).
- DSA trader status probably flips (§3.5).
- The listing's "No ads and no tracking" bullets and the promo text "No ads." must go.

### 3.4 Age rating (the 2025 questionnaire)

**What the sources say**
- [F E1] **2026-01-31:** ratings were auto-migrated to the new system, and developers had to answer the updated questions by this date. The new tiers show on iOS 26 and later.
- [F D1] Tiers: 4+, 9+, 13+, 16+, 18+, and Unrated (which can't be published). For example, Advertising, UGC, messaging and parental controls still allow **4+**. Health/wellness topics and loot boxes make it 9+. Unrestricted web access makes it 16+.
- [F D3] The questionnaire, as the API stores it (this is the authoritative list of current questions):
  - Yes/no: `parentalControls`, `ageAssurance`, `unrestrictedWebAccess`, `userGeneratedContent`, `socialMedia`, `socialMediaAgeRestricted`, `messagingAndChat`, `advertising`, `healthOrWellnessTopics`, `gambling`, `lootBox`.
  - Frequency (NONE / INFREQUENT_OR_MILD / FREQUENT_OR_INTENSE, or NONE / INFREQUENT / FREQUENT): `profanityOrCrudeHumor`, `horrorOrFearThemes`, `alcoholTobaccoOrDrugUseOrReferences`, `medicalOrTreatmentInformation`, `matureOrSuggestiveThemes`, `sexualContentOrNudity`, `sexualContentGraphicAndNudity`, `violenceCartoonOrFantasy`, `violenceRealistic`, `violenceRealisticProlongedGraphicOrSadistic`, **`gunsOrOtherWeapons`**, `gamblingSimulated`, `contests`.
  - Plus `kidsAgeBand`, `ageRatingOverrideV2`, `koreaAgeRatingOverride` and `developerAgeRatingInfoUrl`.

**Gap in our listing** [O] `store/app-store-listing.md` misses four current questions: **Guns or Other Weapons** (None), **Health or Wellness Topics** (No), **Social Media** (No) and **Social Media Disabled for Users Under 13** (No). It also lists "Age assurance and parental controls" as "not applicable"; they are two yes/no questions, both No.

**Answers for v1:** every frequency question is None; every yes/no is No; no Made for Kids; no override. **Expected rating: 4+.**

**At v1.1:** Advertising = Yes, still 4+. The rewarded "rewind" is not a loot box (there's no randomised paid item), so `lootBox` stays No.

[I] One judgement call to note: stones uncover a dragon and other creatures, with no violence shown. "Cartoon or Fantasy Violence: None" holds unless a later chapter adds combat imagery.

### 3.5 Other gates on a first submission

| Gate | Source says | Our status | Label |
|---|---|---|---|
| **Minimum Xcode/SDK** | From **2026-04-28**: uploads must be built with Xcode 26+ and the iOS 26 SDK. From **2026-09-09**: apps must target iOS 13+ | Capacitor 8 targets iOS 15. Build 1 was accepted, so the Mac's Xcode is presumably 26+ | [F E1] [I] |
| **iPad: screenshots and orientation** | 13" iPad screenshots are "Required if app runs on iPad". `UIRequiresFullScreen` is **deprecated in iOS 26.0**, and Apple says to support multitasking and resizing on iPadOS 26. Guideline 2.4.1: "iPhone apps should run on iPad whenever possible" | The `cap add ios` template sets **`TARGETED_DEVICE_FAMILY = "1,2"`** (iPhone and iPad) with all iPad orientations. We have **no iPad screenshots**. Portrait-only on a universal app, without `UIRequiresFullScreen`, has historically failed upload with ITMS-90474 [S] | [F E3, E8, E7] [O] |
| **iPhone screenshots** | 6.9" (1320×2868 accepted) or 6.5" is required; the others scale down. Up to 10 per size; PNG/JPEG; no alpha. From April 2027, iPhone Duo screenshots for apps built with the iOS 27.1 SDK | 6.9" and 6.5" sets exist. Check they have no alpha channel | [F E3] [O] |
| **App preview** | 15–30 s; 886×1920 portrait for both large iPhone groups; H.264 or ProRes 422 HQ; ≤30 fps; stereo AAC 256 kbps; ≤500 MB; up to 3 per size | Optional; not made yet (`tools/trailer/v5` cut "preview") | [F E4] |
| **EU DSA trader status** | Must be declared even if you don't distribute in the EU. Traders publish address (or P.O. box), phone and email on EU product pages, with verification. Factors include IAP or ad revenue and VAT registration. Since **2025-02-17**, apps without verified trader status are removed from the EU store | Undecided. v1 (free, no ads, no IAP) leans non-trader; v1.1 (ads plus IAP) leans trader | [F E2, E1] |
| **Content rights** | "Apps that contain, show, or access third-party content must have all the necessary rights" | All art and levels are original. The only third-party assets are the Anton font (OFL 1.1, subset) and three.js (MIT). Answer: does not contain third-party content, or "Yes, I have the rights". Both licences require their notice to travel with the copy | [F E5] [O] |
| **IDFA question** | Older guides show "Does this app use the Advertising Identifier (IDFA)?" at submission. Not found in current Apple Help | v1: No. v1.1: answered through App Privacy and ATT | [S F2] [I] |
| **TestFlight Beta App Review** | External testing needs a Beta App Description (required) and a feedback email. Internal testers (on the team, up to 100) need no Beta App Review [M] | Kellan testing on their own iPhone as an internal tester needs no review. Friends outside the team (the three testers) are external testers, which needs a description, an email, contact details and review notes | [F E6] [M] |
| **Support URL contact** | Guideline 1.5: "Make sure your app and its Support URL include an easy way to contact you." 2.1(a): "placeholder text, empty websites, and other temporary content should be scrubbed" | **`support.html` and `privacy.html` still read `[support email]`, and `privacy.html` reads `[release date]`** | [F E7] [O] |
| **In-app privacy policy link** | 5.1.1(i): "All apps must include a link to their privacy policy in the App Store Connect metadata field **and within the app** in an easily accessible manner" | **No link to `privacy.html` anywhere in `index.html` or `public/js`** | [F E7] [O] |
| **4.2 Minimum functionality** | "elevate it beyond a repackaged website" | Already tracked (`launch-checklist.md` §3): native haptics, offline, save mirroring, no browser chrome | [F E7] |
| **Status bar hidden** | n/a | Template has `UIViewControllerBasedStatusBarAppearance = true`. Hiding it via plist needs `UIStatusBarHidden = true` **and** that key set to `false` | [O] [M] |
| **Display name** | n/a | Template `CFBundleDisplayName` is "My App"; `cap add` should write `appName` ("Strata"). Verify in the archive | [O] [I] |

---

## 4. What we could build: the shape

The `ios/` project is disposable, so the repo must hold every answer and a script must re-apply them. A layout:

```
store/compliance.json           every questionnaire answer + evidence + "invalidated by" triggers
ios-config/PrivacyInfo.xcprivacy the app target's manifest (committed)
tools/ios-configure.mjs         after `cap add ios` / `cap sync`: patches Info.plist + pbxproj, adds the manifest
tools/ios-verify.sh             on the Mac, after archive: reads the .app and checks each answer held
test/compliance.test.js         `npm test` fails when a code or dependency change breaks an answer
```
`npm run build:app` becomes `node tools/build.mjs --app && npx cap sync ios && node tools/ios-configure.mjs`, so a fresh Mac can't skip the patch.

---

## 5. Ranked hit list

Ranked by (chance the next submission fails without it) × (how often it saves work later) ÷ cost.

### 1. `tools/ios-configure.mjs`: patch the generated project, idempotently
- **Change:** a Node script that runs after `cap add ios` and after every `cap sync`. It sets these values from `store/compliance.json` and a version file (e.g. `store/release.json`: `{ "version": "1.0", "build": 2 }`):
  - In `ios/App/App/Info.plist`: `ITSAppUsesNonExemptEncryption = false`; `UISupportedInterfaceOrientations = [Portrait]`; `UIStatusBarHidden = true`; `UIViewControllerBasedStatusBarAppearance = false`; `CFBundleDisplayName = Strata`.
  - In `project.pbxproj`: `MARKETING_VERSION`, `CURRENT_PROJECT_VERSION`, and `TARGETED_DEVICE_FAMILY = 1` (if Kellan picks iPhone-only, see open questions).
  - It copies `ios-config/PrivacyInfo.xcprivacy` into `ios/App/App/` and adds it to the App target's resources.
  - Plist edits use the `plist` npm package (or `plutil -replace` on the Mac). The pbxproj edit uses the `xcode` npm package (cordova-node-xcode, `addResourceFile`) or `@trapezedev/project`, which also edits plists and build settings.
  - The script refuses to run if the build number isn't higher than the last uploaded one recorded in `release.json`.
- **Benefit:** it fixes Missing Compliance for every future build, and with it the manifest, orientation, iPad and version steps. These are the steps the build-1 upload missed. One command, no Xcode clicking.
- **Cost:** about half a day, plus one devDependency (`xcode` or `@trapezedev/project`).
- **Risk:** pbxproj editing is fragile. A malformed project won't open, which fails loudly rather than silently. A Capacitor upgrade could change the template (mitigated by the verify step, #4).
- **Verify:** on Windows, run it against the template extracted from `node_modules/@capacitor/cli/assets/ios-spm-template.tar.gz` into a temp directory. Then assert the plist values and that the pbxproj has a `PrivacyInfo.xcprivacy` `PBXBuildFile` in the Resources phase. Run it twice; the second run makes no changes. On the Mac, `xcodebuild -showBuildSettings | grep -E 'MARKETING_VERSION|CURRENT_PROJECT_VERSION|TARGETED_DEVICE_FAMILY'`.

### 2. Commit `ios-config/PrivacyInfo.xcprivacy`
- **Change:** the four-key manifest in §3.2, with CA92.1 for UserDefaults and nothing else.
- **Benefit:** it closes the one upload or review rejection the sources name explicitly (B1, B5, B6). It is reviewable in a PR, and test #3 can read it.
- **Cost:** minutes.
- **Risk:** over-declaring is harmless. Under-declaring later (a new plugin using file timestamps, say) is what #3 guards against.
- **Verify:** `plutil -lint` on the Mac. In the archive, `find App.app -name PrivacyInfo.xcprivacy` shows the app's manifest at the root plus `Capacitor.bundle`'s. Xcode › Organizer › Generate Privacy Report lists "User Defaults: CA92.1". No ITMS-91053 email after upload.

### 3. `test/compliance.test.js`: answers that fail when invalidated
- **Change:** a `node --test` file, run by `npm test`, that reads `store/compliance.json` and fails when:
  - **Dependencies:** a `dependencies` or `devDependencies` entry not on the allowlist recorded with each answer (today: `@capacitor/core|ios|haptics|preferences|cli`, `three`). A new SDK must update `compliance.json`, which forces a re-answer.
  - **Network:** a `fetch(` whose argument isn't a relative path; any `XMLHttpRequest`, `WebSocket`, `EventSource` or `sendBeacon`; an absolute `http(s)://` URL in `public/js`, `index.html` or `style.css` (allowlist `https://localhost`, `w3.org` namespaces); an external `<script src>` or `<link href>`.
  - **Crypto:** `crypto.subtle` or a WebCrypto, `tweetnacl`, `crypto-js` or `node-forge` import under `public/`.
  - **Native required-reason APIs:** a regex scan of `node_modules/@capacitor/*/ios/**/*.{swift,m,h}` for the API families in B2 (`UserDefaults`, `.creationDate|modificationDate|attributesOfItem`, `systemUptime|mach_absolute_time`, `volumeAvailableCapacity|NSFileSystemFreeSize|statfs`, `activeInputModes`). Each family found must appear in `ios-config/PrivacyInfo.xcprivacy`, unless that package ships its own manifest declaring it.
  - **Consistency:** `noAdsBuild` in `native.js` true ⇔ `compliance.json` says no ads ⇔ the listing and `privacy.html` say "no ads". The manifest's tracking flag matches the label. `ITSAppUsesNonExemptEncryption` in the config matches the export answer.
  - **Placeholders:** any `[support email]`, `[release date]` or `[phone]` left in `public/privacy.html`, `public/support.html`, or the listing's review notes.
- **Benefit:** it turns "the privacy label is Data Not Collected" from a claim into a checked invariant. The day ads land, the test fails and points at each answer to redo.
- **Cost:** about half a day. Regex scans give false positives, so it needs a small allowlist.
- **Risk:** regexes miss obfuscated or binary-only code (ad SDKs are binaries). That's covered by #4 on the Mac. A noisy test gets "fixed" by widening the allowlist, so each allowlist entry should carry a reason string.
- **Verify:** add a throwaway `fetch('https://example.com')` to a scratch file and see the test fail; revert. Delete the CA92.1 entry and see the native scan fail.

### 4. `tools/ios-verify.sh` on the Mac, after archive, before upload
- **Change:** a script that opens the `.xcarchive` and checks:
  - `/usr/libexec/PlistBuddy -c 'Print :ITSAppUsesNonExemptEncryption'` is false;
  - the orientations are Portrait only;
  - `CFBundleDisplayName` is Strata, and the version and build match `release.json`;
  - `UIDeviceFamily` matches the decision;
  - `PrivacyInfo.xcprivacy` is at the `.app` root and passes `plutil -lint`.

  For the later ads build, it also scans the binaries (`strings`/`nm` over `App.app/App` and `Frameworks/*`) for `OpenSSL`, `BoringSSL`, `CCCrypt`, `SecKeyCreateEncryptedData` or `libsodium`, which prints evidence for the export answer.
- **Benefit:** it checks what actually ships, not what we meant to ship. Build 1 shows how a step gets skipped silently. It also gives the export-compliance evidence that a source grep can't give for binary SDKs.
- **Cost:** about 2 hours. It runs only on the Mac.
- **Risk:** low. Paths inside the archive differ between Xcode versions; keep the `find` lookups loose.
- **Verify:** run it on the build-1 archive, if it's still on the Mac. It should **fail** on the missing encryption key (this proves the check works), then pass on build 2.

### 5. `store/compliance.json` (+ a generated section in the listing)
- **Change:** one record per question: export (TestFlight option text, plist value), the App Privacy label, the age-rating fields with D3's exact API names and values, content rights, DSA, IDFA, the manifest entries. Each record carries `answer`, `evidence` (file:line or source URL with its [F]/[S] label and date) and `invalidatedBy` (e.g. `"dependency:any-new"`, `"network:any"`, `"noAdsBuild:false"`). Optionally, a script renders the human section of `app-store-listing.md` from it, so the two can't drift.
- **Benefit:** a single source for #1, #3 and #6, and for whoever does the next submission. The age-rating block maps one to one onto the API, which makes #6 possible.
- **Cost:** about 2 hours.
- **Risk:** a second copy of the listing's answers until the listing is generated from it. Generate it, or delete the hand-written section.
- **Verify:** #3 loads it. A JSON schema (or a test) asserts every D3 age-rating field is present.

### 6. App Store Connect API script for the questionnaires (`tools/asc.mjs`)
- **Change:** with the API key HANDOFF §4A.3 already asks for, PATCH from `compliance.json`:
  - `builds/{id}` `usesNonExemptEncryption=false` (this clears Missing Compliance on already-uploaded builds without the UI);
  - `ageRatingDeclarations/{id}`, all fields;
  - app info (categories, content rights).

  The App Privacy label is not in the public API [M], so that stays manual.
- **Benefit:** the questionnaires become repeatable per version and reviewable as diffs. This is the "answered once" goal.
- **Cost:** about a day (JWT signing, finding IDs).
- **Risk:** it writes to the live app record, so it needs a `--dry-run` that prints the diff first. The key's role must allow it (App Manager does).
- **Verify:** `--dry-run` against the record, then a GET after the PATCH shows the values. The TestFlight build status changes from Missing Compliance.

### 7. Fix the two review blockers in the web content (needs Kellan's email)
- **Change:** replace `[support email]` and `[release date]` in `privacy.html` and `support.html`. Add a quiet "Privacy" link in Settings / How to play that opens `privacy.html` (it's in `dist/`, so it works offline).
- **Benefit:** it satisfies 1.5, 2.1(a) and 5.1.1(i), each of which can cause a rejection.
- **Cost:** under an hour once the email exists. The in-app link touches `main.js`, so follow HANDOFF §8 (the boot `pageerror` check, then `npm test`).
- **Risk:** low. Wording and placement are Kellan's call (a public-facing piece).
- **Verify:** test #3's placeholder check passes. A Playwright tap on the link shows the page.

### 8. Third-party notices in the bundle
- **Change:** `public/licenses.txt` (three.js MIT; Anton OFL 1.1), linked next to the privacy link.
- **Benefit:** meets both licences' notice conditions and backs the content-rights answer.
- **Cost:** 15 minutes.
- **Risk:** none.
- **Verify:** present in `dist/` after `npm run build -- --app`.

### 9. Update `launch-checklist.md` §6 and the listing's age-rating block
- **Change:** add the four missing age-rating questions. Make "Age assurance" and "Parental controls" two separate No answers. Point §6 at `compliance.json` and these tools. Note the v1.1 deltas from §3.3.
- **Benefit:** stops a stale checklist from misleading the next agent (HANDOFF §4B already flags it as stale).
- **Cost:** 30 minutes.
- **Risk:** none.
- **Verify:** read-through.

---

## 6. Open questions only Kellan can answer

1. **iPhone only, or iPad too, for v1?** My recommendation is iPhone-only (`TARGETED_DEVICE_FAMILY = 1`). It avoids 13" iPad screenshots and iPadOS 26 resizing work; the app still runs on iPads in iPhone compatibility mode (2.4.1). Making it universal later is allowed; going back from universal is not [M].
2. **Did Apple email anything after build 1.0 (1) was uploaded?** In particular ITMS-91053 (missing API declaration) or ITMS-91061/91065 (manifest or signature for a listed SDK, which Capacitor is). That's the cheapest validation of §3.2.
3. **DSA trader status:** individual or organisation, and trader or not? If trader, which address (a P.O. box is allowed) and phone will be shown publicly on EU product pages? v1.1 with ads and IAP probably makes Strata a trader, so deciding once now avoids a change later.
4. **The support email and the App Review phone** (already HANDOFF §4A.5). They unblock #7.
5. **Is Strata available in France?** It doesn't matter for v1 (OS-only crypto). It matters at v1.1 only if a bundled SDK brings its own crypto.
6. **External testers?** If the three testers get TestFlight builds, someone has to write the Beta App Description and feedback email, and the build needs Beta App Review.
7. **For v1.1:** which analytics service? Its data types decide the label rows in §3.3.

---

## 7. Validation limits

- **Not verified on a device or in App Store Connect.** No access to the Mac, the archive, or the account. The account's emails and the build's real Info.plist are unknown; I inferred them from "Missing Compliance".
- **Apple's TestFlight question wording** comes from a developer's post (A7, Jan 2025), not from an Apple page. Apple's Help pages describe the outcomes (A4) but not the dialog's text. If the dialog has changed, map the answer by meaning: "encryption limited to that within the Apple operating system / none".
- **ITMS-91053 enforcement point** (upload vs review submission): Apple says "aren't accepted"; the community reports emails. I didn't confirm which applies in late 2026.
- **The ads-version privacy label** is a reasoned draft. AppLovin's own disclosure guidance and each mediated network's guidance were not fetched. Redo this at v1.1.
- **The age-rating page (D1)** was read to 100k of 116k characters (the Korea section onward was not). D2's step text was partly garbled. D3 (the API fields) is the cleanest list of questions.
- **The Review Guidelines** were read to 100k of 114k characters. The sections cited are all in the part read.
- **Static scans** (§3.1, §3.2) cover the JS in `public/` and the Swift/ObjC in `node_modules/@capacitor/*`. They can't see inside binary xcframeworks (`capacitor-swift-pm` is resolved on the Mac).
- **Legal points** (US self-classification, French declaration, DSA trader test) are Apple's summaries, not legal advice; Apple itself says so (A3, E2).
