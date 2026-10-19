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

## Second pass: the objective (2026-10-18)

Kellan, after the first UX tests of the eleven-lesson tutorial:

> "I think we're teaching the mechanics better now, but they don't know the purpose / objective of the game."

Testers learned how to chisel and peel, but not why. They still needed someone to explain afterwards.

### Diagnosis: a first-time play-through at 390×844

I played from a clean localStorage with Playwright (shots in `shots/tutorial/`, gitignored). The goal was never stated or shown in any of these places:

| # | Where | What a newcomer met |
|---|---|---|
| O1 | Title → lesson 1 | The only statement of purpose was the title's small subtitle, "peel the stone · find the shape". It is gone by the time the swipe ends. |
| O2 | Lesson 1 (Clear) | The first words were a rule ("This row's number is 0: none of its cubes stay"). "Stay" was never tied to anything. Nothing said the stone holds something, or that chiselling is how you find it. |
| O3 | Every lesson's HUD | The title was the lesson's verb ("Clear", "Keep", "Columns"). It named the skill, not an object you're looking for. |
| O4 | Every lesson's solve | **No payoff.** The block turned yellow and the coach said "Nice." Lessons 1–6 revealed plain bars (a 3-cube bar, a 4-cube bar, a plus). Nothing was named, so nothing said "this is what you were digging for". Levels say "you uncovered" and name the object; lessons skipped that code (`win()` returned early). |
| O5 | Numbers | Every lesson said a number counts the cubes that "stay". It never said they are the *object's* cubes, so the number meant nothing beyond its row. |
| O6 | End card | It read "YOU UNCOVERED / YOU'RE READY": the static "you uncovered" label sat above the tutorial's own words. The mechanics recap ("tap · mark · turn · peel") came where the goal should have been. |
| O7 | Level 1 | Its one card was about direction, not purpose. |

So a newcomer reached level 1 knowing the verbs and the number rule, without ever having been shown the noun.

### Design

**Exemplars.**
- *Picross 3D* (DS/3DS): every puzzle's subject is unknown until it's solved. Then it shows in colour with its name. That naming is the reason to finish.
- *Monument Valley*: the goal (the exit, the totem) is visible before you can reach it. You see where you're going, and nobody says it.
- *The Witness*, *Baba Is You*: a first screen with one obvious action, where doing it is the explanation.

None of these was re-researched for this pass. See the sources table above.

**Principle.** Show the noun before the verbs. Let the player see what they are digging for, then name it every time it appears, as levels already do.

**Directions weighed:**
- **A ghost of the object, then the reveal: built.** In the first two lessons the object shows faintly through the stone in its own colours. The player sees the goal and what "done" looks like before reading anything.
- **"You found a ___" payoff: built,** reusing the level's "you uncovered" title.
- **One number and its row lit, tied to the object: built.** Lesson 2 glows a 3 row whose three cubes are visibly the object's colours.
- **A wordless before → after demo: not built separately.** The ghost lesson *is* the before → after, played by the player instead of watched. A demo the player watches would put a screen of passivity before the first tap.
- **A progress meter: not built.** In the ghost lessons the ghost itself shows how much is left. A HUD meter adds chrome to every level for a question testers didn't raise. Revisit if testers ask "am I nearly done?" in level 1.

### Changes, lesson by lesson (now 12)

| # | Lesson | Object | Change |
|---|---|---|---|
| 1 | **Hidden (new)** | Mushroom, 3×3×1, no numbers | The object shows through the stone (`ghost: 0.62`), surfacing softly once the block is whole. "Something is hidden in this stone. Chisel away the plain stone around it." One plain cube breathes. After 6 s still: "Keep going until only the hidden thing is left." Solved: **YOU UNCOVERED / MUSHROOM**. |
| 2 | Clear → **Pencil** | Pencil (eraser, body, graphite tip) | Ghost at 0.6. The 3 row glows: "Each number counts the hidden object's cubes in its row." There, three coloured cubes sit beside a 3. After the first chisel the 0 row glows: "So a 0 row has none of them: chisel it all." |
| 3 | Keep → **Log** | Log | No ghost from here on. "A 3 in a row of three: all three are the object's. Chisel one anyway." |
| 4 | Mark → **Caterpillar** | Caterpillar | "The 4 row is all object." |
| 5 | Columns → **Flower** | Flower (yellow centre) | Recoloured and named. |
| 6 | Depth → **Train** | Train (red engine at the front) | Recoloured and named. |
| 7 | Turn → **Steps** | Steps | Named. |
| 8–9 | Arch, Comb | unchanged | Named already. |
| 10 | Blank → **Hammer** | Hammer (grey head, wooden handle) | Recoloured and named. |
| 11–12 | Lantern, Stool | unchanged | Named already. |

The lesson ids are unchanged, so `lesson-clear` is now the Pencil.

**Every lesson:**
- The HUD title is **?** until solved, then the object's name, as a level shows "No. 1" until solved.
- On solving, the coach steps aside and the level's title plays: "YOU UNCOVERED" and then the name, letter by letter. The HUD fades as in a level (`body.solved`).
- The lesson holds 3.6 s on its object. A tap moves on, once 1.8 s have passed, so the name has landed. This replaces "Nice." and the 2.2 s cut.

**Around the lessons:**
- **End card:** "LESSONS DONE / YOU'RE READY / UNCOVER WHAT'S INSIDE". `showWin` takes the small label, which fixes "you uncovered you're ready".
- **Level 1 card:** "Each number counts the object's cubes in the row running in from its face."
- **Help:** "Every stone hides an object. Chisel away every cube that isn't part of it, and the object is uncovered in its true colours. A number counts the object's cubes…"

**Code:**
- `cubes.js`: one tutorial uniform, `uGhost`. It tints object cubes toward their true colour, lit by the same ramp, before the row glow and glyph ink, so numbers stay legible.
- `main.js`: eases it in with `ease.out` over `DUR.ceremony` after the assembly. It is set at once under Reduce Motion.
- The win title now uses `after()`, so slow motion slows it too.

**Tests:**
- A lesson that shows no clues at all must have a ghost. Lesson 1 is solved by sight, so it's exempt from `lineSolve` and from the independent uniqueness search.
- Every other lesson is still uniquely line-solvable with its clues.
- Every lesson's object needs a name of 12 characters or fewer.

### Results (observed in Chromium at 390×844, not user tests)

Screenshots (gitignored):
- `shots/tutorial/objective-01-hidden.png`: the ghosted mushroom and the first line;
- `objective-02-hidden-wait`;
- `objective-03-hidden-uncovered`: the payoff;
- `objective-04-count-number`: the 3 row lit beside three coloured cubes;
- `objective-05-count-zero`;
- `objective-06-count-uncovered`;
- `objective-07-keep-no-ghost`;
- `objective-08-uncovered-4`: the Caterpillar title;
- `objective-09-ready`: the end card;
- `objective-10-level1`;
- Reduce Motion: `objective-rm-01-hidden`, `objective-rm-03-hidden-uncovered` and `objective-rm-04-count-number`.

What the runs showed:
- **The first pencil had a tan tip,** which vanished into the cream stone under the ghost. The 3 then seemed to count two cubes, which broke the lesson's one equation. The tip is now graphite and the ghost was raised to 0.6.
- **Two end-card lines wrapped to two rows** ("every stone hides something", "find what the stone hides"). "Uncover what's inside" fits on one, and echoes "you uncovered".
- **Tap-to-continue:** a tap 0.8 s after a solve is ignored; a tap at 2.2 s moves on.
- **The full run works end to end** (12 lessons, end card, level 1) with no console errors.
- **Lesson time:** each solve now holds about 1.4 s longer unless tapped, so about 17 s more over the whole tutorial.

### What to watch in the next UX test

1. **After lesson 1, ask "what are you trying to do?"** The target answer: "find the thing hidden in the stone" or "carve away what isn't the mushroom". If the answer is still "tap the cubes", the ghost reads as decoration, not as a goal.
2. **The ghost-to-numbers handover (lesson 2 → 3).** Does anyone ask where the colours went, or look for them in lesson 3? If so, lesson 3 may need a line ("Now the numbers alone show it").
3. **Does anyone chisel the coloured cubes in lesson 1?** That would mean "plain stone" didn't read.
4. **At level 1's first pause, can they say what a number counts?** Listen for "how many of the object's cubes are in that row".
5. **The payoff hold.** Watch whether people wait for the name or tap through. Tapping through at 1.8 s is fine, but if they tap before the name shows, the hold is too long.
6. **The objects' names.** Are Log, Train and Hammer recognisable from three to five cubes? If an object needs its name to make sense, the name is doing its job. If the name surprises people, the colours need work.
7. **Still open:** a progress sense ("am I nearly done?") in real levels, and whether twelve dots feel like a chore.

## Third pass: light on the cube, honest forms, baby steps (2026-10-18)

Kellan, after a playtest:

> "can you please nicely highlight the outline of the cube that the tutorial is talking about when relevant? Or else they might give up. … the objects that we uncover in the tutorial are pretty unrealistic. Like 3 blocks representing a train is so strange that it takes you out of the atmosphere of the game. … Maybe for the tutorial we can have a 3x3x1 then a 2x2, etc, taking baby steps"

Kept from the second pass: the objective is shown first (the ghost), one idea per lesson, and at most one short line of text.

### 1. The outline: light falls on what the words are about

Whenever a line names cubes, those cubes are lit. This covers the cube to chisel, the cube to keep or mark, and the row a number counts. Hesitation nudges use the same light.

**Look.** It follows `docs/study-record.md` (hand-picked face colours, tinted shadow, faked volumetric glow). It has three parts:
- **A seam of light** traces the *group's* outer edges, not the edge of every cube. A row reads as one shape. The cube to act on inside a row gets its own seam, because the outline is drawn wherever the focus strength changes (row 0.6, cube 1).
  - The seam's colour is the palette's `rays` glow on mid and dark faces.
  - On pale faces it deepens to the glow's own hue (`cFocus`: HSL of `glow`, s 0.8, l 0.56), so it reads as a gilded edge on cream instead of vanishing.
- **Tinted shade on the rest.** While anything is outlined, every other cube settles about 20% into the palette's shade hue (`uFocusDim`), so the light *falls on* the cubes being talked about. This is what made the cue readable on Dawn, Mint and Lagoon. A seam alone was nearly invisible there (first iteration, below).
- **A halo into the air.** The god-rays mask carries the outlined cubes in its green channel. A small round blur of that channel is added in the composite with the palette's glow colour. It is kept off the stone (`× (1 − silhouette)`), so it never washes a number. It mostly shows on dark palettes.

**Motion.**
- The light breathes once every two beats (72 BPM, so 1.67 s per breath). While the music plays, the breath is locked to the music's clock (`sound.now − sound.clock0`).
- It arrives in 0.5 s, timed with the coach line and starting once the assembly is done, and leaves in 0.33 s.
- **Reduce Motion:** a steady glow with no breath.
- A chiselled cube leaves the outline with its break. A marked cube is released from cube-level focus. When the next hint starts, the light moves on.

**Code.**
- `cubes.js`:
  - per-instance `aFocus` (from, to, start time) and `aFocusEdge`: 4 edge bits per face, packed like `aAO`;
  - `setFocus(puzzle, present, target, time)` computes the outline edges on the CPU;
  - the shading runs before the glyph is inked, so numbers re-ink over it.
- `main.js` `refreshFocus()` builds the target from the open hint (`line`/`lines`, `pulse`/`focus`) or from the nudge. It runs on hint change, break, mark, undo and peel.
- The old row glow, cube breath and bob (`uHint`, `uHintLine`, `uCalm`) are gone; this replaces them.
- **Bug fixed on the way:** the finale's slow gleam ran *during play* too (`uWin` is −99 while playing, so `won > 2.4` was always true). It made random cubes flash white every 4.5 s, which a newcomer would take for a hint. It is now gated to solved blocks.

**Iterations (Chromium, 390×844):**
1. A soft fill plus a wide rim read as lit lamps, not an outline. The halo also bled over the stone and greyed the "3" on its own face. → A thin seam (falloff 0.028) and a gentler lift, with the halo kept off the stone.
2. On Dawn and Mint the seam alone was invisible (the Rune's column and the Dolmen nudge). → Tinted shade on everything else.
3. On Mint the shade was still too faint, because Mint's shade colour is pale. → The shade hue is normalised to a fixed depth, so every palette settles by the same amount.

### 2. Honest forms instead of pretend objects

Three cubes can't be a train. Each lesson now hides a small carved form that really is that size, from the game's own world of stone, steps and standing stones. The ghost in lessons 1–2 shows the form, and the reveal names it ("You uncovered / Pillar").

### 3. Baby steps: one direction at a time

The order now grows one axis at a time:
- rows on flat stones;
- then a second face of numbers;
- then the row running back on a 2×2×2;
- then turning;
- then the inside.

| # | Size | Idea | Hides | Lit when the line shows |
|---|---|---|---|---|
| 1 | 3×3×1 | The goal: carve away the plain stone (ghost, no numbers) | **Pillar** (base, shaft, capital) | the two plain cubes |
| 2 | 3×2×1 | A number counts the form's cubes in its row; 0 means none (ghost) | **Step** | the 3 row, then the 0 row |
| 3 | 3×3×1 | A full row is all form; a slip is a ✕ that costs gems | **Plinth** | the 3 row, with the cube to try as its own; then the 0 row |
| 4 | 4×2×1 | The Mark tool | **Wall** (dry stone and moss) | the 4 row, then the 0 row |
| 5 | 3×2×1 | A circle means 2 groups | **Arch** | the circled row |
| 6 | 5×2×1 | A square means 3+ groups | **Colonnade** | the squared row |
| 7 | 3×3×1 | Numbers on top count their column | **Rune** (a carved cross) | the middle column; then both 3s |
| 8 | 3×3×1 | A blank face hides its clue | **Cairn** (stones stacked, smallest on top) | the blank column; then the deciding 3 |
| 9 | 2×2×2 | Front numbers count the row running back | **Stair** (one step up, two deep) | the 0 row running back |
| 10 | 2×2×2 | Turning the block | **Cornerstone** | the three rows through the hidden corner (after the wait) |
| 11 | 3×3×3 | Peeling | **Geode** (drab rind, amethyst showing through) | the hidden heart, once peeled |
| 12 | 3×3×3 | Everything, alone | **Dolmen** (a capstone on four standing stones) | the nudge's row (after 9 s still) |

Step → Stair → level 1's Steps is a deliberate thread.

**Other changes:**
- The circle and square now come before columns, because they only need rows.
- Blank comes right after columns, the direction it uses.
- Lesson 1 opens at the flatter front angle (0.42) so the Pillar reads as an I, not an S.
- Copy says "form" instead of "object" in the lessons; level 1's card still says "object", because real levels hide real objects.

**Saved progress:**
- New ids are `lesson-count` and the Pillar/Step/... names on the old slots.
- Lesson ids are stored nowhere. `strata.tutorial` keeps its meaning, and the lesson count is still 12, so nothing saved changes.

**Tests:**
- Every lesson but the ghost lesson is still uniquely line-solvable, checked by both the line solver and the independent search.
- The hint test now also checks `lines` and `focus` cells and line axes.

### Results (Chromium at 390×844, not user tests)

Shots are in `shots/tutorial/` (gitignored); the QA script is `shots/tutorial/highlight.mjs` (`look | full | rm`).
- **Light palettes:** `highlight-look-03-plinth` (Lagoon), `-04-wall` (Mint), `-07-rune-wait` (Dawn), `-12-dolmen-nudge` (Dawn).
- **Dark palette:** `highlight-look-11-geode-peeled` (Night).
- **The breath:** `highlight-pulse-0..3`, a quarter breath apart.
- **Reduce Motion:** `highlight-rm-look-*`.
- **The full run:** `highlight-01-pillar` … `highlight-14-level1`, with each reveal in `highlight-reveal-01-pillar` … `-12-dolmen`.
- **End to end:** all 12 lessons were solved by real taps, drags and the Mark/Chisel buttons, then the end card, then level 1. There were no page errors at boot or during play.

### What to watch in the next playtest

1. **Do people tap the lit cubes without reading?** That's fine for lessons 1–4. If they tap lit cubes that are *meant to stay* (the Plinth's 3 row, the Wall's 4 row), the light is reading as "chisel here". The cube-level seam may then need to differ more from the row-level one.
2. **Does the shade on the rest of the stone read as "look here", or as a dimmed, disabled block?**
3. **Lesson 1 → 2:** with the ghost and the light both showing, can they still say what they're looking for?
4. **The names.** Do Plinth, Cairn and Dolmen land, or do people need them explained? They are truthful but less familiar than Steps or Arch. A puzzled face at the reveal is fine; asking "what's a dolmen?" is a small delight; disengagement is not.
5. **The 2×2×2 jump (lessons 8 → 9).** It's the biggest step in the sequence: from flat stones to depth and a new camera angle.
6. **On a real phone in daylight:** is the gold seam visible on Mint and Lagoon at arm's length?

## Pass 4: plain wording (2026-10-19)

Playtesters struggled to parse the hints. The worst was "A 3 in a row of three: all three are the form's. Chisel one anyway." The hints had been squeezed into colon-joined riddles and used the word "form", which nothing else in the game uses. Every hint was rewritten by these rules:

- **Say "shape"** for what the stone hides, and "belongs" for a cube that is part of it. "Stay" and "the form's" are gone.
- **Point at what is lit:** "this row says 3", "the three glowing rows".
- **Give the reason, then the action:** "This row says 3 with 3 cubes, so all belong. Tap one to see what a mistake does."
- **Name the result plainly:** "The ✕ means that cube belongs, so it stays. Mistakes cost gems."
- **Circles and squares say what splits:** "the row's cubes split into two groups, with a gap between them."
- **Stay within the 18-word limit** (test/puzzle.test.js).

Level 1's card changed from "Each number counts the object's cubes in the row running in from its face" to "Numbers now sit on three faces. Each counts the object's cubes in its row: across, down or back."
