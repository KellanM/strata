# Settings study: what the settings page should be (2026-10-29)

## Brief

Kellan: "a creative-study pass on the settings page design."

This is research and mockups only; no settings code was changed.

Fixed constraints:
- North star: Monument Valley and Journey.
- Keep the pause's voice (`pause-study.md`): a thin ring, a glyph, one word.
- Keep sound, music, vibration, version (it hides the developer panel), Privacy and Support (Apple 5.1.1).
- Remove Ads and restore return with AppLovin in v1.1 (`MONETIZED`).
- Rules are already reachable from the pause (`help-access-study.md` H1).

## Baseline

`settings-frames/strata-settings.jpg` (web) and `strata-settings-app.jpg` (as the iPhone app shows it):
1. **Settings is the third tab of "How to play".** The panel title changes to "Settings", so it's named twice, and Rules and Touch sit beside it as peers.
2. **In the app it is almost empty.** Three toggles, the version and the legal line fill the top 40%; the card keeps the Rules tab's height, so about 60% is blank above a big Close.
3. **The state is hard to read.** Off is a hollow dot plus 45% opacity, with no word for on or off.
4. **It's a different language from the pause and the map:** a cream card, a pill tab bar and a filled button, where they use rings on the sky.
5. On the map the Settings ring's label overlaps stone names when they scroll under it (`strata-map.jpg`, "SNAIL COTTAGE").

## References

Frames: `settings-frames/refs-1..3.jpg`. All are third-party captures, ±1 s. I checked Alto, Two Dots, I Love Hue and Florence frames directly.

| Game | Page (Obs) |
|---|---|
| Alto's Adventure (DGsUk5Tr7fA 0:05) | "Menu" cog on the title. One swipe carousel: Goals · Settings · Language · Game Center · Stats · Credits, neighbours peeking. Sounds/Music sliders, Pause Position, iCloud, then **Replay Tutorial** and **Reset Progress**. The world blurred behind. Labels only. |
| Two Dots (_meCTopADfc 0:41) | Pause and settings are one sheet with tabs OPTIONS / LEARN: a grid of six toggles (incl. Colorblind, Haptics), and a tiny footer of ID, version and legal. |
| I Love Hue (LytlpMB4b4I 1:21) | Pulls down over the level select: SOUND / NOTIFICATIONS / SHOW SCORES with circled-× marks, Remove Ads, Achievements, and "- CREDITS - / - PRIVACY POLICY -". |
| Florence (naZ4q2ZCIgs 0:47) | A full paper page, "settings" in the game's hand: six outlined rows that say their state: "Music: ON", "Sound: ON", "Vibration: ON". |
| Monument Valley 3 (mVTKtHN0r8c 0:10, Steam Deck) | A centred list over the live title scene under a wash: spaced caps, a line icon per row, OFF/ON words with the active one lit. Preferences holds just Audio and Camera Shake. Version tiny at the foot. |
| Sky (JIk9hNOrmEE 0:12) | No page: a translucent band of six icon+word buttons across the moving world. |
| Islanders (2R-NhneGs0Y 0:21) | A small card beside the unblurred island; an icon rail as tabs. |
| Lara Croft GO (q8P-DfHNBs0 0:35) | The menu is floating objects: the journal is Play, a multitool is Settings. |
| Picross S (uAdOBaGpHWU 1:57) | On the first error, offers to switch off auto-correction "in Options": the setting is offered where it matters. |

Not established: the phone settings of MV1–3, Mini Metro, Threes, Prune and Gorogoa (only their single glyph was seen). No game was seen with Restore Purchase on its settings page.

## Mechanisms

1. **Settings is its own short page:** about 3–8 rows, words not sentences (Alto, Florence, MV3).
2. **The world stays behind, softened.** A wash or blur over the scene (Alto, MV3, Sky); a card only when the game is card-like (Islanders).
3. **State is said in words or a clear mark.** "Music: ON" (Florence), lit OFF/ON (MV3), ⊗ (I Love Hue). Nobody used a stock iOS switch.
4. **Drawn in the game's own type and line.** MV3's spaced caps and line icons are almost Strata's already.
5. **Secondary things sit below and quieter.** Credits, tutorial replay and reset come under the toggles (Alto, MV3). Version and legal go in a tiny footer (Two Dots, MV3).
6. **Credits/About is a real place:** Alto's and MV3's credits pages, Florence's "about us". Strata has a studio sticker and no page for it.

## Mockups (in the game, over the real map)

`settings-frames/settings-mockups.jpg`. The top row is on First Light's sky and the bottom row on a dark world; all are 390×844, the app state, with Music off.

| | Design | Reads |
|---|---|---|
| **A, Rings** | The pause's voice: the title in small caps, a diamond, then three large rings, Sound · Music · Vibration. On is a ringed, lightly filled glyph with "on" under it; off is faded with "off". Below them, three small rings: Rules · Touch · Studio. Footer: version · Privacy · Support. A × top-right. | The clearest kin to the pause and map. State legible at a glance. The second row of rings competes a little with the first. |
| **B, Quiet list** | MV3/Florence: rows in spaced caps with a line icon, the state as "off on" with the current one underlined. A gap, then "How to play ›" and "Unsupervised Rock ›". | The most legible state, and room for more rows later (language, colour-blind, restore). Less of Strata's ring language. |
| **C, Carousel** | Alto: Touch · Settings · Rules as page titles you swipe between, neighbours faded, dots below; A's three rings on the page. | Keeps everything in one place without a tab bar. The swipe isn't discoverable, and the page is emptier than A. |

Seen in the mockups:
- On a dark world, the dark ink on the mauve wash is too faint for the small type (footer, "off"). A real build needs the map's `on-dark` ink.
- All three fill the screen calmly where today's card is mostly empty.

## Recommendation

1. **A (Rings) for the page.** It's in the voice the pause and map already speak, and the state shows by ring plus word. Make the second row quieter: words with small glyphs, not full rings, so the toggles lead. Add "Unsupervised Rock" as the studio/credits door (the sticker, and who made it).
2. **Take Settings out of How to play.** The map's Settings ring opens this page. How to play keeps Rules and Touch, reached from this page and from the pause.
3. **Close with a × and a tap outside**, not a filled button.
4. **Fix the map ring's label collision** regardless of the design: give the head a soft fade behind the rings, or hide the label once the map scrolls.
5. **Later, with v1.1:** Remove Ads and Restore as a quiet row under the toggles (I Love Hue's place); B's list absorbs these more easily, if A gets crowded.

## Limits

- The mockups are static. The open/close motion and tap feedback aren't designed yet.
- MV3's settings are from the Steam Deck build; the phone list is inferred.
- No player testing. These are my assessments against the references.
