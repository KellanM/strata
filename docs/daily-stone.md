# The Daily Stone

Growth roadmap test 8; the design sketch is in docs/gtm-study.md (M1). One stone a day, the same for everyone, with a spoiler-free share line. It is built for v1.1 on the web and in the app. Game Center's half needs the native plugin and App Store Connect: see docs/game-center-handoff.md.

## What the player sees

- **On the map:** after the lessons, a third ring sits between Menu and Finds, labelled TODAY. Its glyph is a sun on the horizon. Once today's stone is solved, the sun is filled and the ring takes a warm hairline until the next day. Before the lessons are done, the ring isn't there.
- **The stone:** a tap dives into it, as into any stone. The bar reads "Daily #N · today's stone".
- **The result:** the usual finale, with the gems and the score on the plinth. The words over the stone are "today's stone / Daily #N". The rings are Map and Share (the larger ring). In the app with Game Center there is also Challenge. There is no Next and no Replay: a day has one result.
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
https://kellanm.github.io/strata/?d=13
```

- **Line 2:** the gems (◆ earned, ◇ not), the slips ("no slips", "1 slip", "n slips") and the time.
- **Line 3:** one square per wave of the carving.
  - A wave is a round of line logic: every deduction open at once (the same rounds as `solveStats`, the levels' "deduction chain").
  - 🟨 means a clean wave; 🟫 means the player slipped on a cube that this wave settles.
  - Everyone has the same number of squares that day (4–10), so the rows can be compared. A row of gold is a flawless solve.
  - It says how the solve went, and nothing about where anything is.
- **Line 4:** the days in a row, only from 2 days up.
- **Why it can't give the answer away:** `shareText()` takes only the day, gems, slips, seconds, wave flags and run. No cell, row, clue, colour or size goes in. The test checks that across 400 days: the same numbers give the same words on every stone.

## Decisions

- **The day: local date (Wordle's rule).**
  - Daily #N counts calendar days from Daily #1 = 31 Oct 2026 (`DAILY_EPOCH` in daily.js), by the device's own date. The stone turns over at the player's midnight, so "today" and "days in a row" are theirs.
  - The seed comes from N alone, so everyone on the same date has the same stone. At any moment, the world is on at most two neighbouring numbers.
  - UTC would put everyone on one stone at once, but it would turn over at 4–8 pm in the Americas and mid-morning in Asia. That is the wrong rhythm for a morning or evening ritual.
  - The cost falls on Game Center: a recurring leaderboard restarts at one fixed time (see the handoff). Accepted: friends who challenge each other are mostly in one time zone.
  - **Don't move the epoch once a line has been shared.** Moving it renumbers, and so reseeds, every day.
- **The stone: the drift's own generator,** `randomShape(6, seed)`, a few overlapping spheres. It is abstract: never one of the 194 levels' objects.
  - The seed for day N's k-th try is an integer hash of (N, k).
  - The first try that passes is the day's stone:
    - the clues the game shows (`setClues`, as the levels) settle every cell by line logic (`lineSolve`), so there is one answer;
    - the difficulty is 9.5–12.0 (the chapters' means run from 9.3 to 12.6);
    - it takes 90–180 chisels, a few minutes;
    - it has 4–10 waves;
    - no face of the block is an empty slab.
  - On average a day takes about 14 ms in node. Over the first 400 days, the most tries any day needed was 114.
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
  - `strata.daily.days` holds, per day: time, slips, gems, score and waves. It keeps the last 400 days.
  - `strata.daily.shares` is a count.
  - Neither is ever sent anywhere. The daily doesn't touch `strata.solved`, the finds or the levels' flawless run.
- **The score** is the result screen's own (cubes, clean hand, calm pace), without the levels' run bonus, so it is the same scale for everyone. Game Center gets this number.
- **Testing:**
  - `?today=YYYY-MM-DD` (or `strata.dev.today`) moves the web build's clock. It is ignored in the app.
  - `window.strata.openDaily(n)` opens any day.

## Proposals (not built)

- **A misted share image** (gtm-study M1): the day's stone still under its mist, "what's inside?". It needs a canvas render and image sharing, and fits once the line is proven.
- **Forgiveness:** one missed day a week kept in the run (the gtm-study streak idea). I left it out: "days in a row" should be literally true, and a run that just starts again is already gentle.
- **Weekend stones:** a 7-cube block on Saturdays and Sundays, for a longer sit. That is one line in `dailyStone()`.
- **Link previews** (OG image and description) for `?d=` links before any public post: the gtm-study's item 3.
- **Count shares against solves locally,** and show nothing. The roadmap's share-rate metric needs a server, which this build deliberately doesn't have. Read it from the share links' traffic instead (the web host's logs, or a Custom Product Page for the store).
