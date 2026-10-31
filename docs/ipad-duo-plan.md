# iPhone Duo and iPad: what it takes, and in what order (2026-10-31)

Planning only; nothing is built yet. The facts on the Duo and on iPadOS come from a research pass with sources (URLs below). The layout findings come from the web build rendered at each device's size (Chromium, not a device).

## Where Strata is now

- **iPhone only, portrait only:** `TARGETED_DEVICE_FAMILY = 1`, set by `tools/ios-configure.mjs` from `store/release.json` `"devices"`. On iPad it runs in iPhone compatibility mode, which guideline 2.4.1 allows.
- **Universal is one-way.** The app can go universal later, but can't go back (docs/compliance-study.md).
- **The web build already copes with any window size.** It lays itself out from `innerWidth`/`innerHeight`, re-lays on `resize`, `orientationchange` and `visualViewport`, and has one `@media (min-width: 900px)` rule.

## What the renders show

| Size (points) | Device | Puzzle | Interface | Map |
|---|---|---|---|---|
| 466×678 | Duo, outer | Fits, all three peel handles | Fits | Fine |
| 669×951 | Duo, inner | Larger, all handles | Fits; the menu button and labels are a bit small | Fine |
| 694×1024 | iPad, half-screen split | Good | Good | — |
| 1024×1366 | iPad 13", portrait | Big and clear | Phone-sized and tiny on the screen | — |
| 1366×1024 | iPad 13", landscape | Big and clear | Tiny | A thin column, most of the width empty |

**Bug:** at iPad sizes (1024 and wider) **one of the three peel handles is missing**. At 694 wide all three show.

## iPhone Duo: the facts (researched, 2026-10-31)

- **The device:** Apple's first foldable, announced 9 Sep 2026 and on sale since 23 Oct. It opens like a book: a 5.4" outer screen and a 7.6" inner screen, with the same aspect ratio, about 1:1.42–1.46. That is far squarer than a regular iPhone's 1:2.16. It runs iOS 27.1, and Split View now comes to the iPhone.
  - https://www.apple.com/newsroom/2026/09/apple-unveils-iphone-duo/
  - https://developer.apple.com/iphone-duo/
- **Opting in:** build with **Xcode 27.1**; there is no Info.plist key. Apps built with Xcode 26 run in compatibility mode at their old size, centred and not scaled up.
  - https://developer.apple.com/forums/thread/847887
- **Apple's guidance for games:** "Make your game playable in every device pose… fill the screen as the device pose changes… Prefer changing the aspect ratio over letterboxing."
  - https://developer.apple.com/design/human-interface-guidelines/designing-for-iphone-duo
- **Featuring:** Duo screenshots (1398×2034 outer, 2007×2853 inner) earn a **"Made for iPhone Duo" badge** on the product page. Curated Duo collections went live on 23 Oct. Of more than 50 adopters Apple named, about 2 were games, so there is little competition in games for now.
  - https://macrumors.com/2026/10/22/made-for-iphone-duo-app-store-label/
  - https://macrumors.com/2026/10/22/apple-highlights-iphone-duo-apps/
- **Required later:** Duo screenshots become required in April 2027 for builds made with the iOS 27.1 SDK.

## iPad: the facts

- **Full screen is no longer an option.** `UIRequiresFullScreen` is deprecated in iPadOS 26. Built with the 27 SDK, it **no longer stops resizing**: the app must work in any window size and orientation, and the system snaps it to each new size after a drag. Size limits are best-effort only. A launch screen is required.
  - https://developer.apple.com/documentation/technotes/tn3192-migrating-your-app-from-the-deprecated-uirequiresfullscreen-key
- **Screenshots:** one 13" iPad size is required (2064×2752 or 2048×2732).
- **Apple Pencil:** hover may only preview, never act. Squeeze on the Pencil Pro must be a single, undoable action; switching between Chisel and Mark fits that exactly.
- **Featuring:** no Apple source says an iPad-optimised design counts. The evidence is anecdote, e.g. Florence polished iPad first and "hit number four on iPad before even getting featured" (docs/gtm-talks-study.md).

## Milestones

### M0: ship v1 as it is (now)
Build 7 is iPhone-only and in review. Change nothing about devices while it's there.

### M1: v1.1, made for iPhone Duo (recommended next; time-sensitive)
**Why first:** the badge and the launch collections are live now, and few games have adopted the Duo. The renders show the layout already fits both screens, so the work is mostly toolchain, testing and assets, not redesign.

1. **Toolchain:** move the iOS build to Xcode 27.1 and the iOS 27.1 SDK. Check that Capacitor 8 builds cleanly against it, and that the launch screen requirement is met.
2. **Folding mid-puzzle:** unfold and fold during a level, the map, a lesson and the result screen. Nothing may restart, lose state or flash. WebGL must resize cleanly through the system's snap; `relayout()` already exists to hook into.
3. **Narrow windows:** Split View on the Duo gives windows down to about half the inner screen. Check the narrowest width the layout survives, and design for it if it breaks.
4. **The fold:** the crease runs down the middle of the inner screen, exactly where the block sits. Test on a device whether tapping and reading clues across it is fine. That is likely for a soft crease, but it is unverified. The fold's exact position (`ReservedRegion`) is only available to native code, so avoiding the crease would need a small Capacitor bridge; only build it if testing shows a problem.
5. **Sizing:** scale the interface a little on the inner screen (the menu button and labels read small at 669 wide). Keep it a light touch.
6. **Store:** Duo screenshots at both sizes (store/shoot.mjs, two more viewports), which earns the badge. Update "182" to 194 in the listing.
7. **Featuring:** nominate v1.1 in App Store Connect at least 3 weeks before release (8 for a story), naming Duo support, the new levels and the new chapter content.
8. **Device:** the Duo simulator in Xcode 27.1 covers most of this. A real Duo, borrowed or at an Apple Store, is the only check of the crease and the fold animation.

### M2: v1.2, universal for iPad (after M1; the larger design job)
**Why second:** it is one-way and needs real design work, especially landscape. It reuses all of M1's resizing work.

1. **Any window, any orientation (TN3192).** Landscape needs its own layout:
   - The interface moves out of the puzzle's way; the side margins have room for it.
   - The map uses the width: wider spacing, or the chapter story beside the trail.
   - The result screen's rings and the lesson cards are placed for a wide window.
2. **Interface scale by size class.** Use a tablet type scale and larger button rings, so the interface stops being phone-sized on a 13" screen.
3. **Fix the missing peel handle** at large sizes (it may be off-screen; check where it lands).
4. **Input:**
   - **Trackpad and pointer:** hover highlights the cube under the cursor. `finePointer` already exists for the web.
   - **Keyboard shortcuts:** C and M for the tools, ⌘Z to take back, arrows to turn the block, Esc to pause.
   - **Apple Pencil:** hover previews the cube about to be chiselled; squeeze swaps Chisel and Mark.
5. **Performance:** a 13" iPad renders about 2.4 times the pixels of a 6.9" iPhone. Profile on a real iPad (docs/profiling.md), and cap the device pixel ratio if the frame rate drops. Never upload a profiling build.
6. **Store:** 13" iPad screenshots, landscape among them, because landscape is where the 3D block looks best. Set `store/release.json` `"devices"` to universal; `ios-configure.mjs` already handles the switch.
7. **Featuring:** nominate it as "built for iPad". The talks suggest iPad suits calm, crafted games, though that rests on one example.

### Decisions only Kellan can make
- M1 before M2, or both together? Doing them together means one larger release and a later Duo window. I recommend M1 first.
- Test hardware: a Duo and an iPad for real-device checks, or the simulators only?
- Landscape on iPad: a full redesign of the map, or just the puzzle and interface for v1.2?
