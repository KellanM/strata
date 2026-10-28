# Store assets

Everything that goes into the App Store listing lives here.

| What | File | Notes |
|---|---|---|
| Listing text | `app-store-listing.md` | Name, subtitle, description, keywords, age rating, privacy label, review notes. Paste-ready |
| Screenshots, iPhone 6.9" (1320×2868) | `screenshots/6_9in-<order>-<subject>.png` | Upload in the order of the number |
| Screenshots, iPhone 6.5" (1284×2778) | `screenshots/6_5in-<order>-<subject>.png` | Same five frames |
| Screenshot script | `shoot.mjs` | Real gameplay only. The listing explains how to reshoot each frame |
| **App icon (installed)** | `icon/app-icon.png` (= `icon/sloth-lime.png`) | Kellan's pick, 2026-10-27: the Sloth's win state on lime. Copied to `../resources/icon.png` (App Store source) and `../public/icons/` (web: 180, 192, 512, a maskable 512 for Android, a 64 px favicon) |
| App icon, candidates | `icon/sloth-green.png`, `icon/sloth-cloud-isles.png`, `icon/sloth-blue.png` | 1024 px, the Sloth's win state; the lime version (above) was chosen over these |
| Icon comparison | `icon/compare-at-phone-sizes.png` | Each candidate at 180 and 60 px, on light and dark grounds |
| App icon, fox candidates | `icon/origami-fox-green.png`, `icon/origami-fox-cloud-isles.png`, `icon/origami-fox-blue.png`, `icon/origami-fox-lantern-festival.png` | 1024 px, the Origami Fox's win state. Not picked yet |
| Fox icon comparison | `icon/compare-fox-at-phone-sizes.png` | The current icon, the Sloth on green and the four foxes at 180 and 60 px |
| App icon, 3×3×3 stone candidates | `icon/stone-3x3x3-lime.png`, `icon/stone-3x3x3-cloud-isles.png`; compared in `icon/compare-stone-at-phone-sizes.png` | The Mushroom lesson's unsolved stone with its clues (`NOSOLVE=1 ID=v2-mushroom` in `tools/render-icon.mjs`). Not picked |
| Icon references | `icon/reference-icons-33-games.png` | 33 successful game icons at the same sizes; the study is `../docs/icon-study.md` |
| Version, build, devices | `release.json` | Read by `../tools/ios-configure.mjs`. Bump `build` before every upload. iPhone-only (Kellan, 2026-10-27) |
| Privacy manifest | `../ios-config/PrivacyInfo.xcprivacy` | Copied into the Xcode project by `ios-configure.mjs` |
| Privacy and support pages | `../public/privacy.html`, `../public/support.html` | Deployed with the site |
| App preview video | not made yet | `tools/trailer/v5`, cut `preview` (see `../HANDOFF.md`) |

**The five screenshots, in order:**
1. `origami-fox`: the Origami Fox, uncovered.
2. `orrery-zero-row`: the Orrery, with a row of 0s breaking.
3. `journal-old-stones`: the Journal opened at Old Stones (the Moai, Geode, Stone Golem…).
4. `maple-bonsai-mid-solve`: the Maple Bonsai, partway through a solve.
5. `coelacanth`: the Coelacanth, uncovered.
