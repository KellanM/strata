# The Daily Stone

Growth roadmap test 8; the design sketch is in docs/gtm-study.md (M1). One stone a day, the same for everyone, with a spoiler-free share line. It is built for v1.1 on the web and in the app. Game Center's half needs the native plugin and App Store Connect: see docs/game-center-handoff.md.

From Daily #2 (1 Nov 2026) the stone is a real object: one of Kellan's picks from gallery page 18, the Daily Stones (2026-11-01: "These are great dailys to start with"), and from page 19, more Daily Stones (17 more picks, added on Daily #2 to start on Daily #3), by a fixed calendar (below). Daily #1 was an abstract stone from the drift's generator, and keeps it.

## What the player sees

- **On the map:** after the lessons, a third ring sits between Menu and Finds, labelled TODAY. Its glyph is a sun on the horizon. Once today's stone is solved, the sun is filled and the ring takes a warm hairline until the next day. Before the lessons are done, the ring isn't there.
- **The stone:** a tap dives into it, as into any stone. The bar reads "Daily #N · today's stone".
- **The result:** the usual finale, with the gems and the score on the plinth. The stone is named over it, with its story line, as a level's object is: "Daily #N / Piggy Bank / It has been saving since Tuesday…". For another day's stone (from a link), the line over the name is "Daily #N · 4 Nov". The rings are Map and Share (the larger ring). In the app with Game Center there is also Challenge. There is no Next and no Replay: a day has one result.
  - Daily #1, the generated stone, has no object: its words are "today's stone / Daily #1" (or "the stone of 31 Oct / Daily #1"), as before.
  - While it's carved the bar says "Daily #N · today's stone". The name is the answer's to give, so it comes only with the reveal.
- **Finds:** once a curated stone has been solved here, Finds gains a Daily Stones section after the worlds reached, on the Dawn sky, with the Today ring's sun for its numeral. Each stone is there once, with the best gems of the days it was solved; the rest wait in the dark, as a world's do. Its turntable says "Daily Stones" over the name. It is read from `strata.daily.days` and the calendar, so nothing new is stored.
- **Share:**
  - on a phone, the share sheet;
  - on a computer, the line is copied, and the ring's label reads COPIED for two seconds;
  - in the app, Capacitor's Share plugin if the build has it, otherwise the web view's share sheet, otherwise the clipboard.
- **Tapping Today when it's done:** the small card reads "Daily #N · done for today", then "◆◆◇ · 1 slip · 4:12 · 3 days in a row", with Share.
- **No slip take-backs on the daily:** the rewind ring stays hidden, so every share line is earned the same way.

## The share line

```
Strata · Daily #13
◆◆◇ · 1 slip · 3:41
🟨🟨🟫🟨🟨🟨🟨
3 days in a row
One 3D logic puzzle a day. One answer, no guessing.
https://kellanm.github.io/strata/?d=13
```

- **Line 2:** the gems (◆ earned, ◇ not), the slips ("no slips", "1 slip", "n slips") and the time.
- **Line 3:** one square per wave of the carving.
  - A wave is a round of line logic: every deduction open at once (the same rounds as `solveStats`, the levels' "deduction chain").
  - 🟨 means a clean wave; 🟫 means the player slipped on a cube that this wave settles.
  - Everyone has the same number of squares that day (4–10), so the rows can be compared. A row of gold is a flawless solve.
  - It says how the solve went, and nothing about where anything is.
- **Line 4:** the days in a row, only from 2 days up.
- **Why it can't give the answer away:** `shareText()` takes only the day, gems, slips, seconds, wave flags and run. No name, cell, row, clue, colour or size goes in. The test checks that across 400 days: the same numbers give the same words on every stone, and no stone's name, in any of the ten languages, is in any day's line.

## Decisions

- **The day: local date (Wordle's rule).**
  - Daily #N counts calendar days from Daily #1 = 31 Oct 2026 (`DAILY_EPOCH` in daily.js), by the device's own date. The stone turns over at the player's midnight, so "today" and "days in a row" are theirs.
  - The seed comes from N alone, so everyone on the same date has the same stone. At any moment, the world is on at most two neighbouring numbers.
  - UTC would put everyone on one stone at once, but it would turn over at 4–8 pm in the Americas and mid-morning in Asia. That is the wrong rhythm for a morning or evening ritual.
  - The cost falls on Game Center: a recurring leaderboard restarts at one fixed time (see the handoff). Accepted: friends who challenge each other are mostly in one time zone.
  - **Don't move the epoch once a line has been shared.** Moving it renumbers, and so reseeds, every day.
- **The stones: Kellan's picks,** from Daily #2 on (see "The pool" and "The calendar" below).
- **Daily #1's stone: the drift's own generator,** `randomShape(6, seed)`, a few overlapping spheres (`generatedStone()` in daily.js). It is abstract: never one of the 194 levels' objects. It was every day's stone until the curated ones came; it is kept for Daily #1, which had been shared, and the test pins it.
  - The seed for day N's k-th try is an integer hash of (N, k).
  - The first try that passes is the day's stone:
    - the clues the game shows (`setClues`, as the levels) settle every cell by line logic (`lineSolve`), so there is one answer;
    - the difficulty is 9.5–12.0 (the chapters' means run from 9.3 to 12.6);
    - it takes 90–180 chisels, a few minutes;
    - it has 4–10 waves;
    - no face of the block is an empty slab.
  - On average a day takes about 14 ms in node. Over the first 400 days, the most tries any day needed was 114. The test still checks the generator over 400 days.
  - `difficulty()` moved from test/difficulty.js into puzzle.js so the game can use it. test/difficulty.js re-exports it, so every tool is unchanged.
- **A shared link, `?d=N`** (N up to one day ahead of the reader's date, for time zones):
  - **A returning player:** past the title, the game goes straight into that day's stone (no swoop down the map). If it's today and already solved, the done card opens.
  - **A new player:** the head reads "the day's stone waits" and Learn reads "7 lessons first". The short run follows, then the stone.
    - The short run is 7 of the 12 lessons: chiselling, a number, numbers on top, the circle, the square, turning, peeling.
    - It skips the second picture, the 0 shortcut, the tortoise and the mushroom; the levels' one-time reminders cover those notations where they're met.
    - The store app's old lessons have no short run, so there the full run comes first. Links open on the web anyway.
- **What counts toward the record:**
  - a solve of today's stone, or of yesterday's finished after midnight;
  - only the first solve of a day.
  - An older day from a link can be played and shared, without a run.
- **Days in a row:**
  - They count back from today, or from yesterday until today is solved, so the run stands all day.
  - A missed day quietly starts a new run. There is no "streak lost" message and no notification.
- **Kept on this device only:**
  - `strata.daily.days` holds, per day: time, slips, gems, score and waves. It keeps the last 400 days. (Which stone a day had is the calendar's to say, so it isn't stored.)
  - A half-carved daily is kept with the levels' progress by its stone and its day (`daily-piggy-bank@2`), not by the stone alone: a curated stone comes round again (every 24 days or so, the undated ones), and starts fresh then.
  - `strata.daily.shares` is a count.
  - Neither is ever sent anywhere. The daily doesn't touch `strata.solved`, the finds or the levels' flawless run.
- **The score** is the result screen's own (cubes, clean hand, calm pace), without the levels' run bonus, so it is the same scale for everyone. Game Center gets this number.
- **Testing:**
  - `?today=YYYY-MM-DD` (or `strata.dev.today`) moves the web build's clock. It is ignored in the app.
  - `window.strata.openDaily(n)` opens any day; `window.strata.daily.stoneIdOf(n)` says which stone it has.
  - `tools/qa-daily.mjs <port> [outDir]` plays the flow in a headless browser against a running server, through the shared browser lock: Today on 1 Nov 2026 (the Piggy Bank, named and told on the reveal), the share line (no name), Finds' Daily section, the next day (the Sugar Skull, dated, two days in a row), `?today=2026-11-02` straight from the URL, page 19's stones on their days (the Dog on the Sofa, Owl and Pussycat, Cupid, Frog & Toadstool, Squirrel & Pumpkin), 31 Oct 2027 (the Black Cat, #366), Daily #1's generated stone, `?lang=ja`, `?d=N` links for a returning and a new player, and every stone's name in all ten languages on the result's one-line name (within 375 px) and in its Finds tile.

## The pool

Kellan's picks (2026-11-01), baked into `public/js/dailies.js` by `tools/bake-gallery.mjs`, so the game never reads gallery files (they are not in the offline cache). Each is lit as the levels are (`lit()`, with the candidate's own options), then trimmed to its object (no empty slab on any edge), and checked by `judge()` exactly as the game runs it, with its clue settings written out. Its sky is its section's, the one it was drawn against, at the day's own time of day.

| Stone | From (page 18) | Section, sky | fraction / seed | D | Chisels | Waves |
|---|---|---|---|---|---|---|
| Piggy Bank | `cand-p18-piggy-bank` | I Known Anywhere, Dawn | 0.7 / 1 | 10.4 | 174 | 6 |
| Instant Camera | `cand-p18-instant-camera` | I Known Anywhere, Dawn | 0.7 / 3 | 10.5 | 131 | 6 |
| Rabbit in a Hat | `cand-p18-rabbit-hat` | I Known Anywhere, Dawn | 0.7 / 1 | 10.6 | 168 | 6 |
| Chicken Crossing | `cand-p18-chicken-crossing` | II Caught in the Act, Orchard | 0.85 / 7 | 12.0 | 162 | 7 |
| Sword in the Stone | `cand-p18-sword-stone` | III Small Wonders, Night | 0.75 / 3 | 11.8 | 152 | 6 |
| Frog Prince | `cand-p18-frog-prince` | III Small Wonders, Night | 0.8 / 3 | 11.4 | 141 | 7 |
| Genie | `cand-p18-genie` | III Small Wonders, Night | 0.5 / 5 | 11.0 | 171 | 7 |
| Baba Yaga's Hut | `cand-p18-baba-yaga-hut` | III Small Wonders, Night | 0.7 / 1 | 11.3 | 136 | 6 |
| Black Cat (Oct 31) | `cand-p18-black-cat` | IV Days of the Year, Autumn | 0.5 / 7 | 10.8 | 151 | 7 |
| Nutcracker (Dec 6) | `cand-p18-nutcracker` | IV Days of the Year, Autumn | 0.8 / 7 | 11.1 | 101 | 7 |
| Melted Snowman (Mar 20) | `cand-p18-melted-snowman` | IV Days of the Year, Autumn | 0.8 / 6 | 10.8 | 125 | 6 |
| Cloth Tiger | `cand-p18-cloth-tiger` | V Toy Box, Festival | 0.65 / 10 | 10.5 | 131 | 6 |
| Troll Doll | `cand-p18-troll-doll` | V Toy Box, Festival | 0.7 / 3 | 10.5 | 130 | 6 |
| Sock Monkey | `cand-p18-sock-monkey` | V Toy Box, Festival | 0.7 / 3 | 10.5 | 178 | 5 |

- **Four needed easier clues than the gallery's defaults** (0.85 / 7 where none were written), which put them over the band's 12.0: Sword in the Stone (D 14.2), Frog Prince (13.2), Baba Yaga's Hut (14.5), and the Melted Snowman (13.5 once trimmed: its grid had an empty layer over the hat). Each one's line in dailies.js says so. The gallery files are unchanged.
- **Names and stories** are in all ten tables as `name.daily-<id>` and `story.daily-<id>` (en.js reads them from dailies.js, as it does the levels'), each within its language's story budget (test/i18n.test.js). Finds' section title is `finds.daily`.

**Page 19's picks** (Kellan, 2026-11-01: 17 of the "more Daily Stones"), added on Daily #2 to start on Daily #3. They come after page 18's in `DAILIES`, so Finds shows them after page 18's.

| Stone | From (page 19) | Section, sky | fraction / seed | D | Chisels | Waves |
|---|---|---|---|---|---|---|
| Puss in Boots | `cand-p19-puss-in-boots` | I Storybook, Dawn | 0.65 / 1 | 10.5 | 157 | 6 |
| Dorothy's House | `cand-p19-dorothys-house` | I Storybook, Dawn | 0.7 / 2 | 10.3 | 160 | 5 |
| Owl and Pussycat | `cand-p19-owl-pussycat` | II Nursery Rhymes, Orchard | 0.65 / 1 | 10.6 | 173 | 6 |
| Sleepy Cyclops | `cand-p19-cyclops` | III Myths of the World, Night | 0.65 / 7 | 10.6 | 163 | 7 |
| Cupid (Feb 14) | `cand-p19-cupid` | III Myths of the World, Night | 0.65 / 1 | 11.3 | 158 | 7 |
| Karakuri Tea Doll | `cand-p19-karakuri` | V Toy Box, Again, Dusk | 0.65 / 4 | 10.9 | 160 | 6 |
| Luchador | `cand-p19-luchador` | V Toy Box, Again, Dusk | 0.65 / 2 | 10.4 | 122 | 6 |
| Toy Dinosaur | `cand-p19-toy-dinosaur` | V Toy Box, Again, Dusk | 0.65 / 4 | 11.0 | 155 | 6 |
| Pinocchio | `cand-p19-pinocchio` | V Toy Box, Again, Dusk | 0.65 / 3 | 10.3 | 119 | 6 |
| Jester | `cand-p19-jester` | VI Show Time, Festival | 0.65 / 1 | 10.5 | 164 | 6 |
| Sugar Skull (Nov 2) | `cand-p19-sugar-skull` | VII Holidays of the World, Beacon | 0.7 / 6 | 11.0 | 124 | 7 |
| Frog & Toadstool (Sep 22) | `cand-p19-toadstool-frog` | VIII Weather and Seasons, Clouds | 0.7 / 1 | 11.0 | 131 | 6 |
| Squirrel & Pumpkin (Nov 1) | `cand-p19-squirrel-pumpkin` | IX Up to Something, Autumn | 0.65 / 5 | 10.9 | 144 | 6 |
| Dog on the Sofa | `cand-p19-dog-sofa` | IX Up to Something, Autumn | 0.65 / 7 | 10.7 | 149 | 6 |
| Gull & Chips | `cand-p19-gull-chips` | IX Up to Something, Autumn | 0.65 / 1 | 10.4 | 172 | 6 |
| Goat on the Car | `cand-p19-goat-car` | IX Up to Something, Autumn | 0.6 / 7 | 10.9 | 176 | 7 |
| Stone Soup | `cand-p19-stone-soup` | X Things With a Secret, Stones | 0.65 / 2 | 10.7 | 174 | 7 |

- **None needed easier clues:** page 19 wrote out each candidate's `fraction` and `seed` for the daily band, and every one passes `judge()` with them, lit and trimmed (no block needed trimming). None of the 17 has `lit` options; the test checks every stone's against its candidate's, and page 19's clue settings and stories too.
- **Two English names are shorter than the gallery's,** so they sit on the result's one line (the name never wraps there; English's widest before was Songbird Automaton, 18 letters): *The Owl and the Pussycat* is **Owl and Pussycat**, and *Frog under a Toadstool* is **Frog & Toadstool** (as Squirrel & Pumpkin and Gull & Chips are named). Their ids are the candidates' (`daily-owl-pussycat`, `daily-toadstool-frog`).
- **Their words:** names and stories in all ten tables, in each table's glossary and voice (the frog is きのこ, 蘑菇, 버섯, Pilz, Champignon, Hongo, Cogumelo, гриб, as the levels' Mushroom is), within each story budget. `tools/qa-daily.mjs` sets every name in the result's one-line style at 375 px in all ten languages, and checks Finds shows each. All 17 fit in every language (the widest new one, Russian's Игрушечный динозавр, is 372 px). The check found two of page 18's Portuguese names past the edge, *Cofrinho de Porquinho* (397 px) and *Galinha Atravessando* (378); they are now **Cofrinho** and **Galinha na Estrada** (renaming changes no day's stone).
- **The Luchador is undated.** Its section's notes suggest 21 Sep (Mexico's Día de la Lucha Libre), but the date is unverified, so it is in the rotation.

## The calendar

`stoneIdOf(n)` and `calendar()` in daily.js, from the lists in dailies.js. The date gives the day number (the local date, as always), and the day number gives the stone, the same on every device.

- **Before the cutover** (`CURATED_FROM`, Daily #2): the generated stone. That is only Daily #1.
- **A dated stone falls on its date,** every year, by month and day, from its `since` day on. They are held out of the rotation, so they appear on no other day.

  | Stone | Date | Why | `since` | First day |
  |---|---|---|---|---|
  | Black Cat | Oct 31 | Halloween | #2 | 31 Oct 2027, #366 (2026's Oct 31 was Daily #1, before the cutover) |
  | Nutcracker | Dec 6 | St Nicholas' Day, early in Advent | #2 | 6 Dec 2026, #37 |
  | Melted Snowman | Mar 20 | about the spring equinox | #2 | 20 Mar 2027, #141 |
  | Sugar Skull | Nov 2 | Día de Muertos, the Day of the Dead | #3 | **2 Nov 2026, #3**, the day after it was added |
  | Cupid | Feb 14 | St Valentine's Day | #3 | 14 Feb 2027, #107 |
  | Frog & Toadstool | Sep 22 | the autumn rains, taken as the autumn equinox (22 or 23 Sep; 22 Sep, by the gallery's "autumn rains", as the Snowman takes the spring one's Mar 20) | #3 | 22 Sep 2027, #327 |
  | Squirrel & Pumpkin | Nov 1 | the morning after Halloween | #3 | 1 Nov 2027, #367: 1 Nov 2026 was Daily #2, already the Piggy Bank's when the Squirrel was added |

  - A dated stone may take a day from tomorrow on: its `since` is a day not yet reached, and the rotation simply waits a day for it. The Sugar Skull's #3 was the Genie's, so from #3 on every undated day is one later than it was (the Genie on #4, and so on); #1 and #2 are as they were. The test pins them.
  - 31 Oct, 1 Nov and 2 Nov are all dated from 2027 (Black Cat, Squirrel, Sugar Skull): three sections in a row, none in the rotation's way.
- **Every other day takes the next stone of the rotation,** and the order starts again once all have had their day. Eras are appended:
  - **The first era** (Daily #2 on), 11 of page 18's: Piggy Bank, Genie, Troll Doll, Instant Camera, Frog Prince, Cloth Tiger, Rabbit in a Hat, Sword in the Stone, Chicken Crossing, Baba Yaga's Hut, Sock Monkey. By section that is I W T I W T I W M W T. It opens on a Known Anywhere stone (the Piggy Bank, on the first curated day), for strangers arriving from a link. Its one cycle runs #2, then #4-#13 (the Sock Monkey's is Thu 12 Nov 2026, #13).
  - **The second era** (`since` #3, so from the first turn of the cycle on or after it: **#14, Fri 13 Nov 2026**): page 19's 13 undated stones interleaved with page 18's 11, so the new ones come at once (Kellan wanted his new picks soon, not after a full repeat of page 18's), a new one first. New and old alternate, each in its own order, with two new together near the end (13 against 11):

    Dog on the Sofa, Piggy Bank, Karakuri Tea Doll, Genie, Sleepy Cyclops, Troll Doll, Puss in Boots, Instant Camera, Luchador, Frog Prince, Gull & Chips, Cloth Tiger, Owl and Pussycat, Rabbit in a Hat, Toy Dinosaur, Sword in the Stone, Jester, Chicken Crossing, Dorothy's House, Baba Yaga's Hut, Pinocchio, Goat on the Car, Sock Monkey, Stone Soup.

    24 stones, so an undated stone comes round about every 24 days. The new 13's first days: Dog on the Sofa #14 (13 Nov), Karakuri Tea Doll #16, Sleepy Cyclops #18, Puss in Boots #20, Luchador #22, Gull & Chips #24, Owl and Pussycat #26, Toy Dinosaur #28, Jester #30, Dorothy's House #32 (1 Dec), Pinocchio #34, Goat on the Car #35, Stone Soup #38 (7 Dec, after the Nutcracker's #37).
  - By section (X Up to Something, I Known Anywhere, T Toy Box (page 19's Toy Box, Again counts as Toy Box), W Small Wonders, Y Myths of the World, S Storybook, R Nursery Rhymes, M Caught in the Act, H Show Time, C Things With a Secret) the cycle is X I T W Y T S I T W X T R I T W H M S W T X T C: no two neighbours share a section, the cycle's end (C) and start (X) included, nor the turn from the first era's last day (#13, the Sock Monkey, T) to its first. The seven Toy Box stones are never neighbours, nor are the three Up to Something.
  - **On the calendar, dated days included:** Days of the Year, Holidays of the World and Weather and Seasons are only dated. Two dated stones share a section with undated ones: Cupid (Myths) and the Squirrel (Up to Something). The Squirrel's Nov 1 always sits between two dated days, and no year to 2030 puts the Sleepy Cyclops next to Cupid's Feb 14. The order was found by a search over interleavings that keeps both orders and checks every pair of neighbouring days to 2030, as the test does.
- **The past never changes.** The lists are only ever appended to, each addition with a `since` day not yet reached. The test checks that an appended stone, dated or not, changes no day before its first appearance, and pins the days already played (Daily #1 and #2) when the last stones were added, and those announced from the next day (#3-#13).

The next weeks, from Daily #2 (dated days in bold, a page 19 stone's first day in italics). #1-#13 are pinned by the test: #1 and #2 were played, #3-#13 are being played from 2 Nov.

| # | Date | Stone | # | Date | Stone | # | Date | Stone |
|---|---|---|---|---|---|---|---|---|
| 2 | Sun 1 Nov | Piggy Bank | 18 | Tue 17 Nov | *Sleepy Cyclops* | 34 | Thu 3 Dec | *Pinocchio* |
| 3 | Mon 2 Nov | **Sugar Skull** | 19 | Wed 18 Nov | Troll Doll | 35 | Fri 4 Dec | *Goat on the Car* |
| 4 | Tue 3 Nov | Genie | 20 | Thu 19 Nov | *Puss in Boots* | 36 | Sat 5 Dec | Sock Monkey |
| 5 | Wed 4 Nov | Troll Doll | 21 | Fri 20 Nov | Instant Camera | 37 | Sun 6 Dec | **Nutcracker** |
| 6 | Thu 5 Nov | Instant Camera | 22 | Sat 21 Nov | *Luchador* | 38 | Mon 7 Dec | *Stone Soup* |
| 7 | Fri 6 Nov | Frog Prince | 23 | Sun 22 Nov | Frog Prince | 39 | Tue 8 Dec | Dog on the Sofa |
| 8 | Sat 7 Nov | Cloth Tiger | 24 | Mon 23 Nov | *Gull & Chips* | 40 | Wed 9 Dec | Piggy Bank |
| 9 | Sun 8 Nov | Rabbit in a Hat | 25 | Tue 24 Nov | Cloth Tiger | 41 | Thu 10 Dec | Karakuri Tea Doll |
| 10 | Mon 9 Nov | Sword in the Stone | 26 | Wed 25 Nov | *Owl and Pussycat* | 42 | Fri 11 Dec | Genie |
| 11 | Tue 10 Nov | Chicken Crossing | 27 | Thu 26 Nov | Rabbit in a Hat | 43 | Sat 12 Dec | Sleepy Cyclops |
| 12 | Wed 11 Nov | Baba Yaga's Hut | 28 | Fri 27 Nov | *Toy Dinosaur* | 44 | Sun 13 Dec | Troll Doll |
| 13 | Thu 12 Nov | Sock Monkey | 29 | Sat 28 Nov | Sword in the Stone | 45 | Mon 14 Dec | Puss in Boots |
| 14 | Fri 13 Nov | *Dog on the Sofa* (second era) | 30 | Sun 29 Nov | *Jester* | 46 | Tue 15 Dec | Instant Camera |
| 15 | Sat 14 Nov | Piggy Bank | 31 | Mon 30 Nov | Chicken Crossing | 47 | Wed 16 Dec | Luchador |
| 16 | Sun 15 Nov | *Karakuri Tea Doll* | 32 | Tue 1 Dec | *Dorothy's House* | | | |
| 17 | Mon 16 Nov | Genie | 33 | Wed 2 Dec | Baba Yaga's Hut | | | |

### Adding a stone

1. Check that the candidate passes `judge()` as the game will run it: lit with its `lit` options, trimmed, with the `fraction` and `seed` you'll write down (where the gallery wrote none, the game's defaults are 0.85 and 7). If it's over the band, lower the fraction or try other seeds.
2. Bake it: `node tools/bake-gallery.mjs cand-…`, and paste the `...voxels(...)` into `DAILIES` in dailies.js with `id: 'daily-…'`, `name`, `story`, `from`, `section`, `fraction`, `seed` and any `lit`.
3. Give it a name and a story in every table (`public/i18n/*.js`, the "Daily Stone's" block before the chapters), within each language's story budget.
4. Put it in the calendar, with `since` a day **not yet reached** (tomorrow or later):
   - **Undated:** append an era to `ROTATION`: `{ since, order: [...the last era's order, 'daily-new'] }`. The new era takes over at the first turn of the old cycle on or after `since`, so the old cycle always finishes and the new stone joins at the end. To bring new stones in sooner, the new era may interleave them with the old (as the second era does, a new one first). Check the new order's sections: no two neighbours from one section, the end and the start included (Toy Box, Again counts as Toy Box). A new era may reorder; an old one is never edited.
   - **Dated:** append `{ id, date: 'MM-DD', since }` to `DATED`. Don't give two stones one date. If its date is tomorrow, it takes tomorrow (as the Sugar Skull took #3), and the rotation's days from then on each move one later; if its date is today, today is already played, so it waits a year (as the Squirrel did).
   - Check the calendar's neighbours to 2030 (the test does): a dated stone whose section is also in the rotation can land next to one of its own; move the undated one in the new order.
   - Add the day you're adding on to `PLAYED` in test/daily.test.js, if it isn't there (the days already played), and to `ANNOUNCED` any day whose stone has been made known: both are pinned.
5. Never edit an existing era, a dated line's date or `since`, or a stone's voxels or clue settings: every day already played would change under the players who shared it.
6. `npm test`: test/daily.test.js checks the calendar's rules, every stone (judge(), one solution, written-out clues) and the share line; test/i18n.test.js checks the words.

## Proposals (not built)

- **A misted share image** (gtm-study M1): the day's stone still under its mist, "what's inside?". It needs a canvas render and image sharing, and fits once the line is proven.
- **Forgiveness:** one missed day a week kept in the run (the gtm-study streak idea). I left it out: "days in a row" should be literally true, and a run that just starts again is already gentle.
- **Weekend stones:** a larger object on Saturdays and Sundays, for a longer sit: a second rotation in the calendar, for weekend days.
- **Link previews** (OG image and description) for `?d=` links before any public post: the gtm-study's item 3.
- **Count shares against solves locally,** and show nothing. The roadmap's share-rate metric needs a server, which this build deliberately doesn't have. Read it from the share links' traffic instead (the web host's logs, or a Custom Product Page for the store).
