# Handoff: App Store page and Mac builds (2026-10-29)

For the agent who looks after Strata's App Store page and makes the iOS builds on the Mac. It covers what changed in the game since build 1.0 (1), what that means for the next build and for the store page, and what is still Kellan's to decide. Read `HANDOFF.md` §4A (building) and `store/README.md` (assets) first; this note doesn't repeat them.

## Where things stand

- **Repo:** `master` at GitHub `KellanM/strata`, clean and pushed. The live web app (https://kellanm.github.io/strata/) is current; every change below is on it.
- **Last upload:** build **1.0 (1)**, 2026-10-27. Nothing has been uploaded since.
- **Next build:** **1.0 (2)**. `store/release.json` already says `"build": 2`, so don't bump it for this upload. Bump it to 3 (and commit) before the one after.
- **About 78 commits** since the build-1 handoff (`12b276d`). All of them are web code under `public/`, so a fresh `npm run build:app` picks them up. No native or Capacitor changes, no new plugins, no new permissions.
- **Uncommitted on purpose; leave them alone:** `tools/trailer/v5/*` (Kellan's pending trailer edits) and `docs/talks/` (transcripts of other people's talks; the repo is public).

## Building 1.0 (2)

As in `HANDOFF.md` §4A:

1. `git pull --rebase --autostash`.
2. `npm ci`, then `npm run build:app` (builds `dist/` and runs `tools/ios-configure.mjs`).
3. Archive and upload with the API key.

**Before uploading, check on the device or simulator.** These parts changed most and are the most phone-sensitive:

- **Splash card.** Black screen; the Unsupervised Rock sticker is drawn on in chalk, held, then wiped (about 1.75 s). Check that:
  - it animates smoothly while the app loads, not frozen or stepping;
  - a tap lifts it early;
  - the screen stays black behind it, with no sky colour at the bottom edge.
- **Title.** A 3×3×3 geode turned corner-on (it reads as a hexagon), with light and god rays coming from the cracks. Check that:
  - dragging turns it, and tapping a stone breaks it (stones clear outward from the one tapped, with no white flash);
  - the light streams up and writes STRATA in stars;
  - the break makes a deep "thoom" followed by short knocks, with no echo.
- **Map, on a save that is several worlds in.** One tap on the title should descend and swoop, blurred, straight to the current stone, with no hard edge between the night and the map. Going back up to the title and down again should land on First Light, with no swoop.
- **Performance to watch.** The title now draws god rays every frame (an extra full-screen pass at half resolution). If an older iPhone stutters on the title, report it; it can be made cheaper.

**Never upload a profiling or autobench build** (`STRATA_AUTOBENCH`).

## What changed for players (for "What to Test" and release notes)

**Opening**
- The studio card is now a chalk sticker of the rock on the studio's name. It's shorter (about 2 s) and a tap skips it.
- The title is a stone geode with light inside. Tap a stone to release the light; the name forms in stars.
- Returning players get "tap to begin" about a second after opening the stone.

**Tutorial on the map**
- The tutorial is now the Learn stone on the map. When it's finished, Learn turns into a carved stone marked "completed" and the next world opens. This fixes playtest feedback that players couldn't tell they had finished the tutorial.

**Map**
- An even rhythm: every stone and shrine is the same distance apart.
- Each world has its own sky gradient. Six worlds' skies were redrawn on First Light's sunrise structure: Beacon Hills, Moss Garden, The Orchard, Autumn Woods, The Lagoon and Desert Oasis.
- First Light is a rose sunrise instead of a bright cream.
- On launch the map swoops straight to your current stone.

**Monetization**
- Still none. No ads, no purchases and no "Remove ads" anywhere (`MONETIZED = false` in `public/js/native.js`; the store app was already ad-free).

**Fixes**
- Locked worlds' shrines no longer show before their world is revealed.
- A stray "swipe up" label no longer shows on the map.

Suggested TestFlight "What to Test":

> New opening: a chalk studio card, then tap the glowing stone on the title. The tutorial now lives on the map as the Learn stone; finish it and watch the map open. Tell us if anything stutters, especially on the title and when the map swoops to your stone.

## App Store page: what needs attention

1. **Screenshots: one of five shows an old sky.** In order (`store/screenshots/`):

   | # | Screenshot | World | Status |
   |---|---|---|---|
   | 1 | Origami Fox | Lantern Festival | Sky unchanged |
   | 2 | Orrery | Clockwork Workshop | Sky unchanged |
   | 3 | Journal | Old Stones | Unchanged |
   | 4 | Maple Bonsai mid-solve | Autumn Woods | **Changed:** now plum over amber, was cream over rust |
   | 5 | Coelacanth | The Deep | Sky unchanged |

   Re-shoot #4 with `store/shoot.mjs` at both sizes (6.9" and 6.5"), and check #1 to #5 against the live app before the next submission. The block colours didn't change; only the skies did. Show Kellan before replacing anything on the store.

2. **App preview video.** Still not made. It would come from `tools/trailer/v5` (the `preview` cut), but those files are Kellan's uncommitted edits, so ask before touching them. Any existing trailer footage shows the **old** opening (the glowing cube and the old splash card).

3. **Listing text.** No change is forced by the above. The subtitle ("A calm 3D puzzle game"), the keywords (98 characters) and the description in `store/app-store-listing.md` still describe the game accurately. If the description mentions the opening, splash or tutorial specifically, check its wording against the new flow.

4. **Privacy label, age rating, encryption.** Unchanged. There are still no ads, no tracking and no data collection. Re-audit before v1.1 adds AppLovin (ATT, the privacy label, child-appropriate ads, EU trader status); see `docs/compliance-study.md` and `HANDOFF.md`.

## What only Kellan decides

- Uploading 1.0 (2) and inviting anyone beyond Kellan to TestFlight.
- Submitting for review, release date, and any App Store Connect setting change.
- Replacing screenshots or adding a preview video on the live listing.
- Open items from before: promotional text and short description, the review contact phone number, LLC, and the AppLovin plan for v1.1 (ads stay off until it's integrated; then the simulated ad system is replaced, keeping its placement rules).

## Rules (as everywhere in this repo)

- Stage only your own files, never with `-A`, `.` or `-a`. Use `git pull --rebase --autostash` and never force-push.
- Never ask for or handle passwords.
- End commit messages with the attribution lines from `HANDOFF.md` §8.
