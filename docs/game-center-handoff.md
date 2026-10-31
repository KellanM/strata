# Game Center for the Daily Stone: handoff to the Mac build

The JavaScript side is done (public/js/native.js). This doc covers the native half and the App Store Connect half. Until both are in, the app behaves exactly as it does today: no plugin, so `gameCenter` is false and every call is a no-op.

## Which plugin

- **No maintained Capacitor 8 plugin covers Challenges.**
  - `@openforge/capacitor-game-connect` is Capacitor 5 only.
  - Its Capacitor 8 forks (`@ni2khanna/…` 8.0.1, `capacitor-game-connect-8` 8.0.0, `@osmanraifgunes/…` 8.1.0) each have a single maintainer.
  - They cover sign-in, scores and achievements, and bundle Google Play Games, but have no Challenges and no activities. Checked 31 Oct 2026.
- **So the app gets a small local plugin of its own,** `StrataGameCenter`, about 100 lines of Swift, in `ios-config/GameCenter/`:
  - `StrataGameCenterPlugin.swift`: the plugin.
  - `MainViewController.swift`: registers it with the bridge.

## The JavaScript contract (native.js)

| JS (native.js) | Plugin method | GameKit |
|---|---|---|
| `signInGameCenter()`, once after the lessons, and at launch for a returning player (4 s in) | `authenticate()` → `{ authenticated }` | `GKLocalPlayer.local.authenticateHandler`; presents Apple's sheet if needed |
| `submitDaily(score, day)`, the day's first solve of today's stone | `submitScore({ leaderboardID: 'strata.daily.score', score, context: day })` | `GKLeaderboard.submitScore(_:context:player:leaderboardIDs:completionHandler:)` |
| `challengeFriends()`, the Challenge ring on the daily's result | `presentChallenge({ challengeID: 'strata.daily.challenge' })` | iOS 26: `GKAccessPoint.shared.trigger(challengeDefinitionID:)`; earlier: `GKGameCenterViewController` on the leaderboard, friends, today |
| `onDailyActivity(fn)`: opens today's stone | event `activity` `{ activityID: 'strata.daily.activity' }` | iOS 26: a `GKGameActivityListener` registered on `GKLocalPlayer.local` after sign-in; `player(_:wantsToPlay:completionHandler:)` |

The page checks `Capacitor.isPluginAvailable('StrataGameCenter')`; a missing plugin means no calls at all.

## Steps on the Mac (after `npm run build:app`)

1. Copy `ios-config/GameCenter/StrataGameCenterPlugin.swift` and `MainViewController.swift` into `ios/App/App/`. Add both to the App target (Xcode: File > Add Files, target App ticked).
2. In `ios/App/App/Base.lproj/Main.storyboard`, set the Bridge View Controller's Custom Class to `MainViewController`, Module `App` (it is `CAPBridgeViewController` by default).
3. In Signing & Capabilities, add **Game Center**. This adds `com.apple.developer.game-center` to `App.entitlements`. Make sure the App ID has Game Center on in the developer portal.
4. Optional, for testing in Xcode before App Store Connect: add a GameKit bundle (File > New > File > Game Center Configuration) with the leaderboard, challenge and activity below, under the same ids.
5. Build to a device signed in to a sandbox Game Center account. Check that:
   - sign-in after the lessons shows the welcome banner;
   - solving today's stone posts a score (Game Center > the leaderboard);
   - the Challenge ring opens Apple's Challenge sheet (iOS 26).
6. Once it works, fold steps 1–3 into `tools/ios-configure.mjs` so a regenerated `ios/` keeps them, with a test like `test/ios-configure.test.js`. I left this out on purpose: a pbxproj edit nobody has built would risk breaking the build.

Things to check against the iOS 26 SDK when you build: `GKAccessPoint.trigger(challengeDefinitionID:handler:)` and the `GKGameActivityListener` method names. They come from Apple's "Creating engaging challenges from leaderboards" article and the GameKit reference, not from a compile.

## App Store Connect checklist (Kellan)

In App Store Connect: the app > Services > Game Center (turn Game Center on for the app first). The ids must match exactly.

1. **Leaderboard: recurring.**
   - Reference name: Daily Stone.
   - Leaderboard ID: **`strata.daily.score`**.
   - Score format: Integer. Sort: High to Low. Score submission type: Best Score.
   - Start date and time: the first day it goes live, at 00:00 in the time zone you choose. The stone turns over at each player's own midnight; pick your main market, e.g. 00:00 US Pacific. Duration: 1 day. Restarts: every 1 day.
   - Score range: 0 to 10000 (today's scores are about 1,000–3,000).
   - Localization (English): name "Daily Stone", score suffix "points", plus an image if you want one.
2. **Challenge.**
   - Reference name: Today's Stone.
   - Challenge ID: **`strata.daily.challenge`**.
   - Leaderboard: `strata.daily.score`. Repeatable: **No** (Apple's own daily-puzzle recipe).
   - Localization: name "Today's Stone"; a description such as "Carve today's stone. Fewest slips, calmest pace wins." Add the image the form asks for.
   - Minimum app version: v1.1.
3. **Activity** (so a Challenge notification opens the right stone).
   - Reference name: Today's Stone.
   - Activity ID: **`strata.daily.activity`**.
   - Associated leaderboard: `strata.daily.score`. Play style: single player.
   - Localization: name "Today's Stone".
4. **Attach them to the v1.1 version** (the version page's Game Center section) before submitting for review.
5. Optional, later: achievements per chapter (gtm-study row 7). Nothing in the code expects them yet.

## Privacy

- Game Center is Apple's own service, signed in by the player. Nothing new is collected by Strata.
- The score sent is the day's result-screen score, with the day number as its context.
- The App Privacy answers don't change ("Data Not Collected"): Apple, not the developer, collects Game Center data. Re-check the wording against the privacy page in docs/compliance-study.md when this ships.
