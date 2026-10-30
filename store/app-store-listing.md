# Strata · App Store listing (iOS, version 1.0)

Ready to paste into App Store Connect. Character counts are measured, and limits are in brackets.
Version 1 has no ads, no in-app purchases, no accounts and no data collection.

Content counts come from `public/js/shapes.js`: `SHAPES` has 182 levels across `CHAPTERS` (15). There are 15 bonus stones (`BONUS`, one per chapter) and 12 lessons (`TUTORIAL`).

---

## App name (30)

**Strata: Stone Puzzles** (21)

Kellan's pick, 2026-10-27: "Strata" alone is taken on the App Store. The home-screen label (`appName` in `capacitor.config.json`) stays **Strata**. The name has no genre search words, so the subtitle carries "3D" and "puzzle".

## Subtitle (30)

**A calm 3D puzzle game** (21)

Kellan's pick, 2026-10-28, the same line mythen.io uses for Strata. "3D" and "puzzle" are in it for search; "nonogram" moves to the keywords.

## Promotional text (170)

```
Every stone keeps a secret. Read the numbers on its faces, chisel away what doesn't belong, and watch a small, lovely thing come out of the rock. No timers. No ads.
```
(164)

## Description (4000)

```
Every stone keeps something inside.

Strata is a quiet puzzle about finding it. Each level is a block of stone with an object hidden within: a lantern, a fox curled asleep, a lighthouse, a dragon too young to breathe fire. Numbers on three faces of the stone tell you how many of the object's cubes lie in each row. Read them, chisel away every cube that doesn't belong, and the shape is slowly revealed.

It is a nonogram in three dimensions. Turn the stone in your hands, peel back its layers to see inside, and work row by row until only the object remains.

A JOURNEY ACROSS FIFTEEN LANDS
182 stones across 15 chapters, from First Light and the Moss Garden to the Lantern Festival, the Deep and Starfall. Each chapter is a place with its own light and color, and each stone you uncover takes its place on the map as a small sculpture. A bonus stone waits in every chapter for those who earn their stars.

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
(1,604)

## Keywords (100)

```
nonogram,logic,voxel,cube,relaxing,zen,offline,numbers,brain,chisel,carve
```
(73; comma-separated with no spaces; omits "Strata", the name, and words in the subtitle, which Apple already indexes)

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
- Guns or other weapons; health or wellness topics (added to Apple's questionnaire in 2025; docs/compliance-study.md)

Answer **No** to the yes/no questions:
- Unrestricted web access
- Gambling (real-money)
- User-generated content
- Messaging or chat
- Advertising
- Loot boxes
- Social media (added in 2025); its follow-up, "disabled for users under 13", then does not apply
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

## Content rights

**"Does your app contain, show, or access third-party content?" Yes. "Do you have the necessary rights?" Yes.**

- Third-party content: one font, Anton (SIL Open Font License 1.1, from Google Fonts), for the studio card's lettering; and open-source code, three.js and Capacitor (MIT).
- Everything else is original to Strata: the 182 objects, the map art, the icon and the screenshots. All the music and sound is synthesised by the game's own code, with no audio files.
- Nothing is fetched at runtime; the app is fully offline.
- The licence texts ship in the app as `licenses.txt` (`public/licenses.txt`).

## Copyright

**© 2026 Unsupervised Rock**

## URLs

- **Support URL:** https://kellanm.github.io/strata/support.html
- **Privacy Policy URL:** https://kellanm.github.io/strata/privacy.html
- **Marketing URL (optional):** https://kellanm.github.io/strata/

## App Review notes

Draft for **1.0 (7)** (the web build v1.0.448, commit `adc6dfe`), checked against that build on 2026-10-29. For Kellan to review before it goes into App Store Connect (Notes, under App Review Information; the limit is 4,000 characters).

```
Strata 1.0 (7) - a guide for App Review

Strata is a single-player 3D picture-logic puzzle (a 3D nonogram). Each block of stone hides an object: chisel away every cube that isn't part of it, using the number clues.

Version 1.0 is free. It needs no login or account, works fully offline, and has no ads, no in-app purchases, no tracking and no third-party SDKs. It collects no data; progress is saved only on the device.

STARTING AND COMPLETING THE FIRST PUZZLE
1. Launch the app. After a short splash, the title reads "Tap to begin". Tap anywhere; the view sweeps down to the map.
2. On first launch the map's first stone, Learn ("11 short lessons"), is lit. Tap it.
3. Lesson 1 opens with one line of instruction: tap the white cubes to knock them away; the coloured part stays. Keep tapping white cubes. When only the object is left, the puzzle is solved and the object is named; tap to go on to the next lesson. Each lesson takes under a minute.
4. After lesson 11 the first world (First Light) opens on the map. Tap the lit stone to play the first full puzzle. When it is solved, the object is revealed with 1 to 3 gems and three buttons: Map, Next (the large play button) and Replay.

WHERE THINGS ARE
- Map: appears after the title. From a puzzle, tap the menu button (top left), then Map; or tap Map on the result screen. Pulling down at the top of the map returns to the title.
- Rules: on the map, tap Menu (top left), then Rules. During the lessons, Rules is also in the pause menu. The Learn stone replays the lessons; hold it to choose a single lesson.
- Finds: on the map, tap Finds (top right). It shows every object uncovered so far; tap one to see it large.
- Sound, music and vibration: on the map, Menu, then Settings.

CONTROLS
- Tap a cube: chisel it away. Hold a cube: mark it as part of the object, so it can't be chiselled by mistake. The switch at the bottom (Chisel / Mark) changes what a tap does.
- Drag: turn the block. Pinch: zoom. Double-tap the sky: reset the view.
- Double-tap a cube in a row whose clue is 0: clear the whole row.
- Slide a diamond on the guide beside the block to peel layers away and see inside.
- Clues: a number is how many of the object's cubes are in that row. A circled number means they are split into two groups; a squared number, three groups or more.

THINGS THAT MAY NOT BE OBVIOUS
- There is no way to fail and no time limit. Chiselling a cube that belongs is a "slip": it is marked with a red x and the cube is kept. Gems: 3 for no slips, 2 for a few, 1 for finishing.
- After a slip, a take-back button appears top right; it undoes the last slip at once (free, up to 5 a day).
- If you wait without a move, a row that has a move will glow.
- Stones open one after another down the map, across 15 worlds. Finishing a world's last stone shows that world's finds, then the next world appears from behind its cloud.
- Gold shrines are optional bonus stones. Each opens once its world has enough gems; tapping one that isn't open yet offers to open it for free.
- The Drift, at the foot of the map, offers random blocks (6, 8 or 10 cubes a side) at any time.
```

Contact for App Review: Kellan Mythen, [phone], support@mythen.io.

## Screenshots

These are in `store/screenshots/`. All are real gameplay, captured by `store/shoot.mjs`. Upload them in this order:

| # | Frame | 6.9" (1320×2868) | 6.5" (1284×2778) |
|---|---|---|---|
| 1 | Origami Fox (Festival), revealed: the payoff | `6_9in-1-origami-fox.png` | `6_5in-1-origami-fox.png` |
| 2 | Orrery (Clockwork Workshop): a row of 0s mid-break, from a real double-tap | `6_9in-2-orrery-zero-row.png` | `6_5in-2-orrery-zero-row.png` |
| 3 | The Journal, opened at Old Stones: the Moai, Geode, Stone Golem and the rest of the chapter, uncovered | `6_9in-3-journal-old-stones.png` | `6_5in-3-journal-old-stones.png` |
| 4 | Maple Bonsai (Autumn Woods), mid-solve | `6_9in-4-maple-bonsai-mid-solve.png` | `6_5in-4-maple-bonsai-mid-solve.png` |
| 5 | Coelacanth (The Deep), revealed | `6_9in-5-coelacanth.png` | `6_5in-5-coelacanth.png` |

`shoot.mjs` writes files named by frame (`6_9in-7.png`); copy each to its store name above. To reshoot, run `PORT=5290 node server.js`, then `node store/shoot.mjs [6.9|6.5] [frame ...]`. The store order maps to frames: 1 = frame 3 with `SOLVE=origami-fox`, 2 = frame 6, 3 = frame 7 with `SHELF` = every level of chapters I–XI and `JCHAPTER='Old Stones'`, 4 = frame 2, 5 = frame 5 with `DARK=coelacanth`. Chosen 2026-10-25: lead with what you uncover, then the break, then the collection; the title and map were dropped as they show no play.
