# Tutorial study: teaching the rules without being told

Date: 2026-10-18. This records the study behind the tutorial redesign. Read it before repeating the research.

## Brief

Kellan's playtests:

> "The tutorial levels could be a lot more intuitive. With the people I've UX tested it with, this app took a while for them to understand the rules, and I still had to explain some of the mechanics when they started the first level after the tutorial."

Later: "We could add more tutorial levels that make it more straightforward." So more, smaller lessons are preferred over fewer, denser ones.

**Goal.** A newcomer finishes the lessons and plays level 1 without anyone explaining anything.

**Constraints:**
- the core rules don't change;
- the tone stays calm;
- everything can be skipped;
- every lesson is uniquely line-solvable with the clues it shows (`npm test`);
- saved progress (`strata.tutorial` and so on) keeps working;
- Reduce Motion is respected.

**Success criteria for this brief:**
1. Every mechanic that level 1 and chapter I use is taught before it's needed.
2. One idea per lesson.
3. The words come after the player has had a chance to try, except for a genuinely new symbol or control.
4. A stuck player is pointed somewhere, not told the answer.

## Baseline: the old tutorial, played at 390×844 from a clean localStorage

Screenshots are in `shots/tut-base-*.png` (gitignored). The old tutorial was five lessons:
- Clear: 4×2×1
- Keep: 4×3×1
- Cross: 3×3×1
- Groups: 3×2×1
- Lantern: 3×3×3

Level 1 (Steps, 4×4×3) was the handoff.

### Confusion points found

| # | Where | What a newcomer meets |
|---|---|---|
| C1 | Every lesson | **Text before action.** Each lesson opened on a card that stated the rule, and sometimes three ideas at once. Lesson 1 covered counting, 0 and chiselling. Groups covered circles, squares and a worked deduction in one 3-line paragraph. The square was described but never shown. |
| C2 | Lessons 1, 2, 4 → level 1 | **A clue's direction was never taught.** Every early lesson was one cube deep, with numbers only on the end face of horizontal rows. Level 1 has numbers on three faces, including front-face numbers that count rows running *into* the screen. Lesson 3 said "clues sit on the tops as well as the front", but its numbers were on the top and the *side*, and the front was blank. This is the most likely cause of "I had to explain the mechanics". |
| C3 | Level 1 | **Blank faces were never explained.** Lessons hid whole axes, so blank faces were everywhere but meant nothing in particular. Level 1 mixes numbered and blank faces on the same side (38% of its clues are hidden). |
| C4 | Whole tutorial | **The ✕ and its cost never appeared.** No lesson let you slip, so the first ✕ came in level 1, unexplained. Nothing linked slips to gems. |
| C5 | Keep | **Mark was taught as "hold"** and the Mark button was never mentioned. The marked cube made no difference to the puzzle, so the reason to mark was told, not felt. |
| C6 | Cross | **Rotation was asked for when it wasn't needed.** "Drag to turn" came first, but every clue was visible from the start. Turning had no consequence, so it taught nothing. |
| C7 | Groups | **Circles and squares shared one lesson**, and squares were never shown at all. Chapter I's Teabag Pal (level 3) has circles, and Key (level 6) has the first square. |
| C8 | Lessons 1–2 | **No deduction was asked for.** Lesson 1 could be finished by tapping the pulsing cubes. The 4 row was never tested. |
| C9 | First run on a phone | **The install card covered the Chisel/Mark bar** during lesson 1 (shot `tut-base-1.png`). |
| C10 | Level 1 | **No bridge.** The jump went from flat 3-cube puzzles to a 48-cube block with three clue faces and hidden clues, and no help if you were stuck. |
| C11 | Help overlay | It said "Stars" while the result shows gems. It didn't mention blank faces, the ✕, or the Mark button. |

## Sources

Gathered by a research subagent with WebSearch/WebFetch.
- **Fetched** means the page itself was read.
- **Snippet** means only a search summary was seen, so its wording is less reliable.
- **No gameplay video or talk recording was watched.** Everything about how these games feel in play is second-hand.
- Blocked sites (HTTP 403): TouchArcade, Giant Bomb, StrategyWiki, God is a Geek, PressReader/Edge. The GDC Mini Metro page returned 404.

| Exemplar | Source | Status | What it supports |
|---|---|---|---|
| Picross 3D Round 2 | Nintendo e-manual (PDF) | fetched | Help "shows a column or a row where there's something to remove… or flag". The hint points to *where*, not *what*. The manual teaches rules by "books" of practice puzzles. Strikes cost score, not progress. |
| Picross 3D (DS) | NintendoWorldReport hands-on #18805 | fetched | The first 3 levels teach only plain numbers, 0s, break and mark. A separate "tougher tutorial" set brings in circled numbers. |
| Picross 3D (DS) | SuperPhillip Central review; GameRevolution review | fetched | The tutorial lets you "play the game while you learn". Weakness: you can't step back a screen. |
| Picross 3D Round 2 | review snippets | snippet | The tutorial reportedly took 45–60 minutes. This is a warning about length. |
| Picross S | NWR review #45619 | fetched | Hint Roulette reveals a row and a column; mistakes glow red. |
| Monument Valley | Game Developer (Graft, 2014), quoting Ken Wong | fetched | "We only added a level if we had something new to say"; design for non-gamers. |
| Monument Valley | Treehouse profile | fetched | Tested "on strangers or friends without giving them any hints or help". |
| Monument Valley | mechanicsofmagic critique (2024) | fetched | One consistent mark (dots) on everything movable. Only abstract seen for Wong's GDC 2014 talk. |
| The Witness | Wikipedia's summary of Blow | fetched | Explaining an idea up front "kills epiphany". The opening area is "clear without verbal explanation"; panels come in teaching clusters. |
| The Witness | Engadget (Cowan, 2014) | fetched | "The key to these puzzles is in the player's head." |
| Baba Is You | MCV "When We Made…" | fetched | Teikari: levels he "felt… were too easy or too obvious mostly turned out to be very very difficult". |
| Baba Is You | Red Bull interview | fetched | Every level should "incorporate some new interaction". He wants hints "more like helpful images than straight-up written hints". |
| Baba Is You | StrategyWiki on Level 0 | snippet | The rules are on screen and the solution is trivial. |
| Threes! | AV Club (Teti, 2014); Gamezebo | fetched | Short scripted board with one line per verb, then one goal sentence. Mandatory but a couple of minutes long. A constrained board waiting for specific swipes is unverified (memory). |
| A Monster's Expedition | Pocket Gamer review; wurb.com | fetched | Unlimited instant undo and a local reset make trying cheaper than reading. |
| Mini Metro | Steam developer post (2014) | fetched | Track-editing tricks "aren't as intuitive as we thought". Wordless teaching under-teaches secondary gestures. |
| Kishōtenketsu | Game Developer (Nutt, 2012), interview with Koichi Hayashida | fetched | Introduce, develop, a change-up "you weren't expecting", then a conclusion where "you get to demonstrate… mastery". |
| Portal | developer commentary transcript, Portal Wiki | fetched | "Just one correct solution to these early puzzles"; a puzzle "introduced too many new concepts at once"; "Overwhelmed players tend not to digest new information." |
| Adaptive hint timing | He, Zhu & Cai 2022; Hint Factory | snippet | Rule-based hint timing often feels mismatched. **No source supports a specific idle threshold.** Strata's 10 s and 25 s are tuning guesses. |

## Mechanisms distilled (claim → observed → interpretation → what we tried)

1. **One rule per puzzle; a lesson exists only if it says something new.**
   - Claim: Wong, Teikari, Portal.
   - Observed: Picross 3D gives circles their own tutorial set.
   - Interpretation: two new ideas in one puzzle means neither sticks (C1, C7).
   - Tried: 11 lessons, each built round a single idea. Circle and square are separate lessons. Depth, turning, blank faces and the ✕ each get their own.
2. **The first puzzle for a rule has one obvious move, so solving it is the explanation.**
   - Claim: Faliszek's "just one correct solution"; Baba's Level 0.
   - Tried:
     - Clear: a 0 row. The only safe taps are on it.
     - Arch: a circled 2 in a row of three, which fits only one way.
     - Comb: a square 3 in five, which also fits only one way.
3. **Teach by consequence; make the wrong move safe and informative.**
   - Claim: Monster's Expedition's free undo; Picross strikes cost score, not progress.
   - Tried:
     - Keep *asks* you to chisel a cube of the full row. You see the ✕ land and the cube get kept, and the next line says what slips cost (C4).
     - Turn hides its only removable cube from the starting view. The three visible 1s point at it, so turning has a reason (C6).
4. **Words only when needed (hesitation or error), and pointing at *where*, not *what*.**
   - Claim: Blow on epiphany; Picross 3D Round 2's Help highlights a row; Teikari's "helpful images".
   - Tried:
     - Hints can carry `wait`: the card shows only the lesson's dots until the player pauses that long or slips.
     - A stuck player gets a **row glow** on a row that allows a move. Pausing longer, the cube itself breathes too.
     - The glow is the *wordless* half of every hint. Each number-teaching hint lights the row its number counts, which makes the direction (C2) visible instead of described.
5. **The secondary control needs an explicit, in-context demo.**
   - Claim: Mini Metro's developers.
   - Tried: Mark points at the Mark button with a breathing ring, then back at Chisel (C5).
6. **Use a four-beat arc: introduce, develop, twist, conclude.**
   - Claim: Hayashida.
   - Tried, across the set:
     - introduce: Clear, Keep, Mark;
     - develop: Columns, Depth;
     - twist: Turn, then Arch and Comb (the same counting rule, but the gaps matter now), then Blank and Lantern;
     - conclude: Stool, a whole small stone with blank faces and circles, done alone.
   - Level 1 is then the real test.
7. **Keep it short; Picross 3D Round 2's tutorial is reported at 45–60 min.**
   - Each lesson has 1–10 chisels. The full run took about 3½ minutes of scripted play, including the deliberate waits.
   - A real newcomer will be slower: the lessons ask for thinking, not just tapping.

**Rejected or not built:**
- A text-free tutorial. Glyph meanings (circle, square, blank) can't be inferred from one example; Mini Metro shows the cost of over-minimalism.
- A tutorial-only "no strikes" mode. The ✕ is shown on purpose in Keep, and lessons never award gems anyway.

## The new lessons (`TUTORIAL` in `public/js/shapes.js`)

| # | Lesson | Block | Teaches | How |
|---|---|---|---|---|
| 1 | Clear | 3×2×1 | 0 means none stay; tap chisels | The 0 row glows and its first cube breathes. One line, then "Clear the rest". |
| 2 | Keep | 3×3×1 | A full count keeps all; a slip is a ✕ that costs gems | "Try chiselling one anyway" on the glowing 3 row. The ✕ lands and the cube is kept. |
| 3 | Mark | 4×2×1 | The Mark tool protects a cube you know stays | The Mark button breathes; after a mark, the Chisel button does. |
| 4 | Columns | 3×3×1 cross | Top numbers count straight down; two directions combine | The middle column glows. The "which 1?" line appears only after an 8 s pause. |
| 5 | Depth | 3×1×3, viewed near-front | Front numbers count the row running back | The 0 row running back glows. Clearing it shows the row's depth. |
| 6 | Turn | 2×2×2, one corner out | Turning the block | No words at first. The only cube to chisel is hidden at the back, and three visible 1s point at it. "Drag to turn" appears after 5 s still (or a slip), and the "three 1s" line after a further 6 s. |
| 7 | Arch | 3×2×1 | A circle means 2 groups | The circled row glows, which fits only #.#. The result is an arch. |
| 8 | Comb | 5×2×1 | A square means 3+ groups | A square 3 in five fits only #.#.#. |
| 9 | Blank | 3×3×1 T, `clues` mask | A face with no number hides its clue | Columns x0 and x2 are blank and glowing. The middle 3 decides. A "decides the 1s" line comes after 8 s. |
| 10 | Lantern | 3×3×3 hollow | Peeling with the handles | The handles pulse. After a peel, the hidden centre breathes. |
| 11 | Stool | 3×3×3, `hideClues` 0.5 | Everything together, alone; the stuck hint | One line ("on your own; pause and a row glows"). The nudge fires after 9 s still. |

Every lesson passes `lineSolve` with the clues it shows, and the independent search in `test/uniqueness.test.js` finds exactly one solution. Brute force covers the small ones. The test now also checks:
- hint events are known names;
- hints are at most 18 words;
- hint cells lie inside the block;
- the last hint lasts until the lesson is solved.

## Experiment results (observed in Chromium at 390×844; not user tests)

Screenshots of each lesson's key moment are in `shots/tutorial/` (gitignored):
- `00-title`;
- `01-clear`;
- `02-keep`, `02b-keep-slip`;
- `03-mark`, `03b-mark-back`;
- `04-columns`, `04b-columns-wait`;
- `05-depth`;
- `06-turn-wait`, `06b-turn-turned`;
- `07-arch`;
- `08-comb`;
- `09-blank`;
- `10-lantern`, `10b-lantern-peeled`;
- `11-stool`, `11b-stool-nudge`;
- `12-ready`;
- `13-level1`, `13b-level1-nudge`;
- reduced motion: `rm-03-mark`, `rm-10-lantern`.

**Results:**
- **The row glow washed out its own number (first pass).** It was applied after the glyph was inked, so the 4 in Mark became nearly invisible. Moving the glow before the ink fixed it; the number now re-inks against the lit face.
- **The glow was too faint on light palettes (first pass).** It was raised from 0.16–0.28 to 0.30–0.50 toward the palette's glow colour. It's still a soft cue, and it's visible on Dawn, Lagoon, Mint and Night.
- **The stuck hint first picked a row at the back** of the block, where it couldn't be seen. It now takes the move nearest the camera from the earliest deduction round.
- **"Front" was ambiguous at the isometric angle,** where the +z face is the lower-left side. Depth now opens at a near-front angle (0.45 rad), so "front" means the face looking at you.
- **The install card was moved twice:**
  - first deferred to the end of the lessons;
  - that put it over level 1's tool bar, so it now waits for a later visit.
- **Two near-identical "pause and a row glows" cards ran back to back** (Stool, then level 1). Level 1's card became the rule newcomers most often misread: "Each number counts the row running straight in from its face. Take your time."
- **Boot has no console errors** (the same 18 pre-existing warnings as before).
- **The full first run works end to end** with real taps, button presses and drags. Peeling was driven through `setPeeled`, the same path a handle drag takes.

## Changelog, mapped to the confusion points

- **C1:**
  - lessons are now one idea each, with copy of 18 words or fewer (test-enforced);
  - "wait" hints stay quiet until the player pauses or slips;
  - between hints the card shrinks to dots and skip.
- **C2:**
  - Columns teaches top numbers, Depth teaches front numbers, and Turn uses all three directions;
  - every number-teaching hint lights the row its number counts;
  - level 1 opens with one reminder line about direction.
- **C3:** the Blank lesson mixes numbered and blank faces on one side, as level 1 does.
- **C4:** the Keep lesson makes a deliberate, safe slip, shows the ✕ in the HUD and names the gem cost.
- **C5:** the Mark lesson points at the Mark button, then back at Chisel. Hold stays in the help overlay as a shortcut.
- **C6:** Turn can only be solved by turning.
- **C7:** circle and square get a lesson each; both appear again in Lantern and Stool.
- **C8:** Columns, Blank and Stool ask for real two-clue deductions.
- **C9:** the install card never shows during the lessons.
- **C10:**
  - Stool is the bridge lesson;
  - levels 1–3 (until solved) get the wordless stuck hint: after 25 s still, a row with a move glows, and after 50 s its cube breathes too.
- **C11:** the help overlay now covers:
  - gems, not stars;
  - direction ("across, down or back");
  - blank faces;
  - the Mark button;
  - the ✕;
  - the stuck hint.

**Motion:**
- The coach enters with `--ease-out` over `--dur-slow` and leaves with `--ease-in` over `--dur-base`.
- Lesson-to-lesson timing uses `after()`, so slow motion slows it too.
- Under Reduce Motion:
  - the hinted cube stops bobbing and holds a steady tint;
  - the row glow is steady;
  - the tool ring is static;
  - the handle is held a little larger instead of pulsing (`uCalm`, `'still'`).

**Saved progress:** `strata.tutorial` keeps the same meaning. Lesson ids are not stored anywhere, and the map's Learn stone reads the lesson count. Players who finished the old tutorial go straight to the map as before.

## Validation limits and open questions

- **No newcomer has played this yet.** Everything above is my own play-through in a desktop Chromium at phone size, plus secondhand sources.
- **The thresholds are guesses** (8 s, 10 s and 25 s, and the glow strength). The literature found doesn't support a number.
- **Not checked on a real phone:**
  - touch rotation in Turn: how far a thumb drag turns the block;
  - the hold gesture;
  - glow visibility in sunlight.
- **"Try chiselling one anyway" invites a deliberate error.** It's safe here, but some players may find it odd. Watch for it.
- **Eleven lessons is long by count, though each takes seconds.** Watch whether the dots row (11 diamonds) reads as a chore.
