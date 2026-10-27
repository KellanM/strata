# Strata · App Store listing (iOS, version 1.0)

Ready to paste into App Store Connect. Character counts are measured, and limits are in brackets.
Version 1 has no ads, no in-app purchases, no accounts and no data collection.

Content counts come from `public/js/shapes.js`: `SHAPES` has 182 levels across `CHAPTERS` (15). There are 15 bonus stones (`BONUS`, one per chapter) and 12 lessons (`TUTORIAL`).

---

## App name (30)

**Strata** (6)

Fallbacks, if the name is taken:
1. **Strata: 3D Nonograms** (20)
2. **Strata – Peel the Stone** (23; en dash)

## Subtitle (30)

**Peel the stone, find its shape** (30)

Alternative: *A quiet 3D picross in stone* (27)

## Promotional text (170)

```
Every stone keeps a secret. Read the numbers on its faces, chisel away what doesn't belong, and watch a small, lovely thing come out of the rock. No timers. No ads.
```
(164)

## Description (4000)

```
Every stone keeps something inside.

Strata is a quiet puzzle about finding it. Each level is a block of stone with an object hidden within: a lantern, a fox curled asleep, a lighthouse, a dragon too young to breathe fire. Numbers on three faces of the stone tell you how many of the object's cubes lie in each row. Read them, chisel away every cube that doesn't belong, and the shape is slowly revealed.

It is a nonogram (picross) in three dimensions. Turn the stone in your hands, peel back its layers to see inside, and work row by row until only the object remains.

A JOURNEY ACROSS FIFTEEN LANDS
182 stones across 15 chapters, from First Light and the Moss Garden to the Lantern Festival, the Deep and Starfall. Each chapter is a place with its own light and colour, and each stone you uncover takes its place on the map as a small sculpture. A bonus stone waits in every chapter for those who earn their stars.

GENTLE TO LEARN
Twelve short lessons teach everything as you play: how to read the numbers, how to chisel, how to mark the cubes you mean to keep. Stones grow larger and their clues fewer as you travel, but the rules never change. If you are stuck, wait a moment and a row with a move will softly glow.

AT YOUR OWN PACE
A small clock counts up, but nothing runs out, and time never costs you a star. A slip can be taken back. Stars reward a steady hand, not a fast one.

QUIET BY DESIGN
• Plays fully offline
• No ads and no tracking
• No accounts and no sign-in
• No in-app purchases
• Your progress stays on your device

Find a quiet minute, pick up a stone, and see what it has been keeping.
```
(1,615)

## Keywords (100)

```
nonogram,picross,3d,puzzle,logic,voxel,griddlers,hanjie,cube,relaxing,calm,zen,offline,numbers,brain
```
(100; comma-separated with no spaces; omits "Strata", the name, and words in the subtitle, which Apple already indexes)

## Category

- **Primary:** Games › Puzzle
- **Secondary:** Games › Casual

Why Casual rather than Board: Strata's audience is people who want a calm, low-pressure game, such as players of Monument Valley, Alto or I Love Hue. Casual is where they browse. Board is mostly digital tabletop: chess, card and board-game adaptations. Strata isn't one, and its logic-puzzle side is already covered by Puzzle.

## Age rating questionnaire

Answer **None** to every frequency question:
- Cartoon or fantasy violence; realistic violence; prolonged graphic or sadistic violence
- Profanity or crude humour; mature or suggestive themes; sexual content or nudity; graphic sexual content
- Horror or fear themes; medical or treatment information; alcohol, tobacco or drug use
- Simulated gambling; contests

Answer **No** to the yes/no questions:
- Unrestricted web access
- Gambling (real-money)
- User-generated content
- Messaging or chat
- Advertising
- Loot boxes
- Age assurance and parental controls (not applicable)

**Expected rating: 4+**

## App Privacy (nutrition label)

**Data Not Collected.** In App Store Connect › App Privacy, answer "No, we do not collect data from this app."

Why this holds for v1:
- Progress (solved stones, stars, scores, settings) is stored in local storage on the device only. Nothing is transmitted off the device.
- There are no accounts, no analytics, no crash reporting SDK, no ad SDK and no purchase SDK in this version.
- The game reads no identifiers (IDFA or IDFV), location, contacts or photos, so there is no App Tracking Transparency prompt.
- Apple's definition of "collect" is transmitting data off the device in a way the developer or a third party can access. Strata transmits nothing.

If a later version adds ads (AppLovin MAX), purchases or analytics, this label and `privacy.html` must change before that version ships.

## Export compliance

- Strata uses **no encryption beyond what's exempt**. The game has no networking of its own, and anything the system does, such as standard HTTPS, is exempt.
- Add to `ios/App/App/Info.plist`:
  ```xml
  <key>ITSAppUsesNonExemptEncryption</key>
  <false/>
  ```
  With this key set, App Store Connect skips the export compliance question on each build.
- If you're asked in App Store Connect instead: "Does your app use encryption?" → **No** (or "only exempt encryption"). No documentation is needed.

## Copyright

**© 2026 Unsupervised Rock**

## URLs

- **Support URL:** https://kellanm.github.io/strata/support.html
- **Privacy Policy URL:** https://kellanm.github.io/strata/privacy.html
- **Marketing URL (optional):** https://kellanm.github.io/strata/

## App Review notes

```
Strata is a single-player puzzle game: a 3D nonogram (picross) where you chisel away cubes from a block of stone to uncover a hidden object. No login or account is needed, and there is nothing to configure. To play: on the title screen, tap the glowing stone in the centre, then swipe up; the first time, twelve short interactive lessons teach the rules step by step, and afterwards the map leads from level to level. The full rules are always available under Settings on the map, or from the pause menu (≡) during a puzzle. The app works entirely offline. This version contains no in-app purchases, no advertising, no tracking and no third-party SDKs, and it collects no data.
```

Contact for App Review: Kellan Mythen, [phone], [support email].

## Screenshots

These are in `store/screenshots/`. All are real gameplay, captured by `store/shoot.mjs`. Upload them in this order:

| # | Frame | 6.9" (1320×2868) | 6.5" (1284×2778) |
|---|---|---|---|
| 1 | Origami Fox (Festival), revealed: the payoff | `6_9in-1.png` | `6_5in-1.png` |
| 2 | Orrery (Clockwork Workshop): a row of 0s mid-break, from a real double-tap | `6_9in-2.png` | `6_5in-2.png` |
| 3 | The Journal, opened at Old Stones: the Moai, Geode, Stone Golem and the rest of the chapter, uncovered | `6_9in-3.png` | `6_5in-3.png` |
| 4 | Maple Bonsai (Autumn Woods), mid-solve | `6_9in-4.png` | `6_5in-4.png` |
| 5 | Coelacanth (The Deep), revealed | `6_9in-5.png` | `6_5in-5.png` |

To reshoot, run `PORT=5290 node server.js`, then `node store/shoot.mjs [6.9|6.5] [frame ...]`. The store order maps to frames: 1 = frame 3 with `SOLVE=origami-fox`, 2 = frame 6, 3 = frame 7 with `SHELF` = every level of chapters I–XI and `JCHAPTER='Old Stones'`, 4 = frame 2, 5 = frame 5 with `DARK=coelacanth`. Chosen 2026-10-25: lead with what you uncover, then the break, then the collection; the title and map were dropped as they show no play.
