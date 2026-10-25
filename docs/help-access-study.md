# Help-access study: where help lives, and how players reach it (2026-10-24)

## Brief

Kellan: "Is it custom to have the help button directly accessible via the map screen? How do other games in this genre do it? Use creative-study."

This is research only. No game code was changed.

Fixed constraints:
- North star: Monument Valley and Journey. Calm, minimal, wordless where possible.
- Keep everything that How to play holds: the rules and clue legend, the gestures, sound and music, Remove Ads and restore, the home-screen tip, and the version line with its hidden developer panel.
- Keep the pause's voice from `docs/pause-study.md`: a thin ring, a glyph, one word.

## Baseline

`docs/help-frames/strata-baseline.jpg` (390×844, Dawn, tutorial done):

- **Map:** two ringed buttons at the top, **Help** (`?`) on the left and **Journal** on the right. When a level is waiting, a Resume ring sits at the foot. The **Learn** stone (00, "12 lessons") is the first stone on the path.
- **The Help ring is the only door** to the rules, the gestures, sound, purchases and the version line (`main.js:1192`; nothing else calls `show('#help', true)`).
- **The panel is called "How to play"** and has three tabs: Rules, Touch and **Settings**. Settings holds sound and music, Remove Ads, the home-screen tip, and the version line. Its close button says **Begin**, a leftover from when it opened on first run.
- **In a level** the pause offers Resume, Restart and Map. The only way to check what a ◯ clue means mid-stone is Map → Help: two hops, and it leaves the stone.
- **Contextual help already exists:** the 12 lessons, the stuck-row glow, and one coach card on level 1 ("Numbers now sit on three faces…", `resetCoaching`).

## References inspected

I pulled frames with yt-dlp 2026.10.21 (`--js-runtimes node`) and ffmpeg. Each clip was sampled as a 30-frame contact sheet, then I took single frames at the moments that mattered. Key frames are in `docs/help-frames/picross.jpg` and `docs/help-frames/calm.jpg`. All footage is third-party captures. Timestamps are ±2 s.

**Key:** *Obs* = I saw it in a frame. *Rep* = a review, wiki or store page says it, and I didn't see it. *Not seen* = absent from the footage I had, which doesn't prove it's absent from the game.

### Picross and nonogram games

| Game | Help on the level select or map? | In settings or pause? | Replayable tutorial? | Contextual, first time? | How settings are reached |
|---|---|---|---|---|---|
| **Picross S** (Switch, `x53sqeM2FG8` 0:00) | No help button. **Tutorial is a peer item on the main menu** (Picross · Mega Picross · Tutorial · Options). *Obs* | Pause seen only as a footer label | Yes: the main-menu item. *Obs* Offered on first boot, can be skipped. *Rep* (Nintendo store, Cubed3) | Not seen | **Options**, a main-menu item. *Obs* |
| **Picross e** (3DS, `SeZ6XHgSXH4`) | Not seen: the capture is in-puzzle only | Not seen | A tutorial for beginners. *Rep* (Nintendo Life e3) | Not seen | Not seen |
| **Pictopix** (PC, `cdXzbWv5Ejw`) | **No.** The level select has only shuffle and a cog, top-right (5:52). *Obs* | Mid-puzzle the only control is ⏸ (6:50). An **Information** card (Hints · Controls · Awards, with a cog) appears after the first puzzle (3:25). *Obs* | **Introduction** is the first title-menu item, interactive (0:02, 0:30–2:00). *Obs* | The Information card after puzzle 1. *Obs* | A cog in the corner of every menu screen. *Obs* "Game Setup" says hints "can be changed at any time… Options → Hints" (2:27). *Obs* |
| **Nonograms Katana** (web build, `ZJLwjnjENdQ` 2:20) | A row of small toolbar icons on every list screen. *Obs*, too low-res to read. The wiki places a **help icon beside the search filter** and a settings icon in the top bar. *Rep* | Not seen | A **Tutorial** entry in the Play menu. *Rep* (wiki) | Not seen | A toolbar icon. *Rep* |
| **Murder by Numbers** (`xmjOC-fEqKI`) | Not seen | ≡ menu top-right in puzzles. *Obs* | Not established | **The tutorial is the story:** SCOUT's boot sequence teaches the first grids line by line (0:28). *Obs* | Difficulty "can be changed at any time" (4:17). *Obs* |
| **Logic Pic** (mobile, `Qo3jAJXd-Vs`) | No map: it opens straight into Puzzle 01 | ⏸ top-right. *Obs* | Not seen | **Yes.** A pink coach bubble on the first puzzles (0:05). Tools join the bottom bar one at a time as puzzles introduce them, and a hint is offered on the first hard level (≈5:50). *Obs* | Not seen |

### Calm puzzle games

| Game | Help on the level select or map? | In settings or pause? | Replayable tutorial? | Contextual, first time? | How settings are reached |
|---|---|---|---|---|---|
| **Monument Valley 1** (`i-kphKarNQo`, from the pause study) | No | The in-level glyph opens photo mode, then "Leave this chapter?" *Obs* | No | Teaching is in the levels | No settings screen seen |
| **Monument Valley 2** (`jTgK8bL9HhM`) | No | No in-play UI in the frames I sampled | No | "Tap the path to move Ro" sits on the art, once (1:22). *Obs* | Not seen |
| **Monument Valley 3** (`XiJCBIP-t1U`) | No | **One circled-dot glyph top-left** throughout play (1:30). *Obs* | No | A ring marks the first rotatable handle (2:10). *Obs* | Behind that glyph (inferred) |
| **Alto's Odyssey** (`l6fc5pKhtvI`) | n/a (endless run) | ⏸ bottom-left. *Obs* | Not seen | **Izel's speech bubbles** on the first run teach each move as it appears (0:37 on). Later a "Tip: Lotus Flowers protect from crashes" line. *Obs* | The consent dialog says "change at any time from the settings menu". *Obs* |
| **Mini Metro** (`Nn2_RkEiAwM`) | **No.** The city select is just a line of cities, with Play and Mode (≈4:00). *Obs* | Clock + ⏸/▶/⏩ at the edge. *Obs* | Not seen | **Hint pills on the map itself**, the first time: "Each river crossing uses a tunnel" (1:20), "Press firmly to delete this line". *Obs* | Not seen |
| **Two Dots** (`XTVekjJtu-g`) | **No.** The map has prizes and a "?" medallion (2:36). I read the medallion as a mystery reward, not help (inferred). *Obs* | **A gear on every level's top bar.** *Obs* | **Per-mechanic tutorials, kept in the in-level Settings** | **Yes.** On a new mechanic: "LEARN · NEW MECHANIC · You can visit Settings during gameplay to access tutorials for this mechanic!", pointing at the gear (4:30). *Obs* | The in-level gear. *Obs* |
| **Threes** (`MdeQaBuN1aw`) | n/a | Top bar: **menu** and **challenges** glyphs, each labelled. *Obs* | Forced on first launch. Replay is reported via an icon. *Rep* (Gamezebo, Yahoo) | **A rotating tip line under the board:** "Pay attention to the next number", "Drag slowly to see the future", "Remember to mix your 1s and 2s" (0:30 on). *Obs* | Menu: music, sound, battery saver. *Rep* |
| **Prune** (`qeavybI63Os`) | **No.** The title is the level select: "prune" over a row of dots, with no buttons (≈1:12). *Obs* | No visible in-play UI. *Obs* | No | **A wordless hand** draws the first swipe (0:36). *Obs* | Not seen |
| **I Love Hue** (`LytlpMB4b4I`) | **No.** The level select has hearts, gems, one corner glyph, and a **⋮ "more" glyph** beside the pack name (0:06). *Obs* | One glyph top-right in play. *Obs* | Not seen | A hand animation demonstrates the first swap (≈0:12). *Obs* | Behind the corner and ⋮ glyphs (inferred) |
| **Gorogoa** (`PRe6-ftFo20`) | No | **A dog-eared page corner**, top-right, is the only control (0:10). *Obs* | No | Not seen | Behind the page corner (inferred) |
| **Flow Free** (`dMlqoL_7QU4`) | No. The menu is a word list (free play, daily, weekly, time trial) with remove ads · store · more games at the foot (0:00). *Obs* | **Cog top-right on every level**; undo, hint and restart along the bottom. *Obs* | Not seen | Not seen | The cog. *Obs* The gameplay explainer sits under About. *Rep* (StrategyWiki) |
| **Baba Is You**, mobile (`b9dm3Tp1HkA`) | No | A left rail with ⏸, restart and undo (1:35). *Obs* | No | **The rules are objects in the level.** Each level introduces one. *Obs*; Teikari wants hints that are "helpful images" (`tutorial-study.md`) | Pause: volume, movement delay. *Rep* (Android Police) |

**Not established:**
- Settings screens for Picross e, MV1–3, Gorogoa, Mini Metro and Alto. The footage never opened them.
- Whether Murder by Numbers lets you replay its tutorial.
- Nonograms Katana's help icon: wiki only, and the wiki pages returned HTTP 402, so I only have their search-result summaries.

## Mechanisms

**M1. A help button on the map is unusual. Katana is the one case.**
- *Obs:* Pictopix's level select, Two Dots' map, I Love Hue, Mini Metro, Prune, Flow and MV carry no help button.
- *Rep:* the only help icon on a list screen is Nonograms Katana's, a dense utility app with a toolbar.
- *Interpretation:* the map is the place for choosing where to go. Help there competes with the stones.

**M2. Every picross game keeps a replayable tutorial at the top level.**
- *Obs:* Picross S's "Tutorial" sits beside its modes; Pictopix's "Introduction" is its first menu item.
- *Rep:* Katana has a Tutorial entry.
- *Interpretation:* nonogram clues are an abstract notation. Players lapse, and Picross S puts the tutorial beside its modes.
- *For Strata:* the **Learn stone** already plays this role, in the map's own language.

**M3. One quiet glyph holds everything secondary.**
- *Obs:* the MV3 circle, Gorogoa's page corner, the cogs in Flow, Pictopix and Two Dots, I Love Hue's ⋮, the labelled "menu" in Threes.
- *Interpretation:* sound, purchases, restore and credits sit behind one modest door, never on the main stage, and it is named for what it is (a cog or a "more"), not "Help".

**M4. Teaching arrives in context, the first time a thing appears, and then steps away.**
- *Obs:* MV2's "Tap the path"; Two Dots' NEW MECHANIC card; Mini Metro's pills; Izel in Alto; Prune's hand; Logic Pic's coach and tools; MbN's SCOUT.
- *Interpretation:* the line sits on the thing it explains, at the moment it matters, and the calm games do it in the world's own type.

**M5. Reference lives where the confusion happens: in the level.**
- *Obs:* Two Dots files each mechanic's tutorial under the **in-level** gear, and says so when the mechanic first appears. Pictopix's Information card and its hint settings are reachable mid-puzzle.
- *Interpretation:* "what does ◯ mean?" is asked mid-stone, not on the map.

**M6. Ambient tips, for games with a long middle.**
- *Obs:* Threes' tip line under the board; Alto's "Tip:" line.
- *Caution:* this adds words to the screen. MV, Prune and Gorogoa never do it.

**M7. Some games need no rules page at all, but those are the ones whose rules are visible.**
- *Obs:* Baba, MV, Gorogoa, Prune.
- *Interpretation:* Strata's ◯ and □ clue marks and its three faces are notation, not world. Removing the legend entirely is not an option (see `tutorial-study.md` C11).

## Answer to the question

**No, it isn't customary.** In this set, a ringed Help button on the level select appears only in the utility-style Nonograms Katana. The calm games keep their maps clean. The picross games keep a **replayable tutorial** at the top level, and put rules reference and settings behind **one cog or menu glyph**.

What Strata has today is close to the genre, under the wrong name. The "Help" ring is really the settings and store door: half of How to play is a Settings tab. Meanwhile the moment players actually need the legend, mid-stone, has no path to it except leaving for the map.

## Hit list, prioritised

| # | Change | Benefit | Cost | Trade-off | Review |
|---|---|---|---|---|---|
| **H1** | **Rules from the pause.** A fourth small ringed glyph, `?` with the word "Rules", under Resume beside Restart and Map. It opens How to play on its Rules tab and returns to the pause (M5; Two Dots, Pictopix) | The legend is one tap away where it's needed, without leaving the stone | Small: one ring and a return path in `openPause`/`#help` close | The pause goes from three choices to four. In lessons it would sit beside Restart only | Playwright: pause → Rules → back to pause; do the rings still read as one row at 390 px? |
| **H2** | **Rename the map's Help ring for what it holds:** a quiet "More" (⋮) or "Settings" (cog) ring. It opens the same panel with tabs reordered Sound & more · Rules · Touch, under a neutral title. The close button says "Close" (or a glyph), not "Begin" (M3) | Sound and Remove Ads become findable. Keeps the left/right symmetry with Journal | Small: labels, the tab order, one string | Rules lose their "Help" door on the map, though they remain one tab away. The Learn stone becomes the map's beginner door | Ask Kellan which glyph; frame before and after |
| **H3** | **Contextual first-time lines through the existing coach card** (M4). The first time outside the lessons a stone shows a ◯ clue, a □ clue or a fully hidden face, add one line, e.g. "◯ the cubes are in two groups", gone at the next chisel. Extends `resetCoaching` | Teaches at the moment of need, in the world's type: the MV and Two Dots pattern | Medium: detecting "first time this clue kind is on screen", plus a seen-flag per kind | More words on early stones. Must stay one line and one time only | Play stones 1–10 fresh; count the lines that appear |
| **H4** | **Make the Learn stone the visible help.** Keep it pinned at the map's start, and let a long-press or second tap open the 12 lessons as a short list, to replay just "Mark" or "hidden faces" (M2; Two Dots' per-mechanic tutorials) | A lapsed player relearns one idea in the game's own medium, not a text page | Medium: a lesson-picker UI | Another overlay to design. The list must stay wordless-ish (lesson objects as icons) | Kellan on phone: can you replay the Mark lesson in under 5 s? |
| H5 | **Keep the map as is**, and fix only the "Begin" label and the "Settings inside How to play" naming | Zero layout churn. A visible `?` does help first-time players who skipped the lessons, and Katana is precedent | Tiny | Settings stay hidden behind a `?`, and there's still no help mid-stone | — |
| H6 | **Ambient tip line** (Threes): one rotating line under the map's progress count | Passive reminders | Small | Words on the calm map, against MV, Prune and Gorogoa. Not recommended | — |
| ✗ | Remove help entirely (MV, Baba) | — | — | The notation needs a legend (M7) | Rejected |

**Recommendation:**
1. Do **H1 + H2** together. Rules go into the pause, where the question is asked, and the map's top-left ring becomes the quiet "More/Settings" door. That matches the genre and the pause's ring language.
2. Then **H3**, which is cheap because the coach card already exists.
3. **H4** is the nicest long-term version of "help", but it needs a design pass.
4. If Kellan prefers no change, **H5** is defensible. At minimum, retitle "Begin".

## Validation limits

- Third-party captures, some from tablets or PC (Pictopix, Katana's web build) rather than phones. One had a streamer overlay (MV2).
- I didn't open settings screens in most of the calm games, so where "settings" says *inferred* above, that is my reading.
- The Two Dots "?" medallion is read as a reward, not help, from its position beside "Prizes". I didn't see it tapped.
- No player testing. Whether players look for sound under a cog or under a `?` is a hypothesis from the references, not a measured result.
- Strata frames: Playwright Chromium at 390×844, Dawn palette, tutorial marked done.
