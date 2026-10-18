# The a-ha study: solvability audit and solve-path design

Date: 2026-10-18. **Proposals only.** No level, clue setting or game code was changed for this study. The only additions are read-only tools (`tools/aha-lib.mjs`, `tools/aha-audit.mjs`, `tools/aha-search.mjs`) and one test that checks existing behaviour (`test/uniqueness.test.js`). Read this file before repeating the research.

## Brief

Strata should feel calm, but a solve should still feel like *finding* something, not like processing a form. The questions are:

1. Is every puzzle provably fair? It must be solvable from the shown clues by line logic alone, with exactly one solution.
2. What makes great logic puzzles produce "a-ha" moments?
3. What does Strata's current clue hiding (random by `fraction`/`seed`) do to the solve path?

**Non-negotiables:** the calm tone, phone-sized play, the chapter ramp (`npm test`), the saves keyed by level id, and fairness: no guessing.

**Changeable:** which clues are shown, how levels are chosen and ordered, and the feedback while solving.

**Criteria for a good solve path** (chosen for this brief):
- a findable foothold;
- at least one moment where one deduction opens a lot;
- the object not readable before the middle of the solve;
- few taps that need no thought;
- the group clues (circles and squares) mattering at least once.

## What a clue is in Strata

Read from `public/js/puzzle.js`, `public/js/cubes.js`, `public/js/main.js` and `public/js/shapes.js`.

- **A line** is one full row of cubes along x, y or z. A block of X×Y×Z has Y·Z + Z·X + X·Y lines.
- **A clue** is attached to a line. It is the number of cubes in that line that belong to the object ("stay"), plus a group style, exactly as in Picross 3D:
  - **plain:** all those cubes form one contiguous group (a plain 0 means the line is empty);
  - **circled:** exactly 2 groups;
  - **squared:** 3 or more groups.

  This is `styleOf(groups)` in `puzzle.js`. So Strata *already has* Picross 3D's group hints; that proposition is moot.
- **How it is shown.** Every cube shows, on its two faces perpendicular to an axis, the clue of its line along that axis (`clueTile(puzzle.lineOf(i, a))` in `cubes.js`). You read a line's clue on whichever of its cubes faces you. A hidden clue is a blank face (tile 0).
- **Hidden lines.** A hidden line constrains nothing: the solver skips it, and the player must settle its cubes through the crossing lines. Hiding is per line, so a line is either hidden on all its cubes or shown on all of them.
- **Who hides what:**
  - The tutorial lessons use `show: [x, y, z]`, which shows or hides whole axes.
  - Every other level calls `hideClues(p, fraction ?? 0.85, seed ?? 7)` (`main.js`, `startPuzzle`). That function:
    - shuffles the lines with a seeded RNG;
    - above `fraction` 0.6, tilts the order so give-away clues (0s, full rows) are tried first;
    - walks the first `round(lines × fraction)` lines, hiding each one if the puzzle stays line-solvable.

  Nothing about a level's clue set is designed by hand. The set is a function of `(shape, fraction, seed)`.
- **Mistakes.** Chiselling a cube that belongs to the shape is a mistake, judged against the stored shape (`main.js`, `game.puzzle.solid[i]`). That is why uniqueness matters for fairness. If two solutions fitted the clues, a player who deduced the other one would be punished.
- **Peeling.** Hollow objects hide cubes that can only be reached by peeling layers away. `solveStats().interior` measures the share.

## Part 1: Solvability audit

### What the game already checks

- **`lineSolve(p)`** propagates every shown line to a fixed point. For each line it enumerates every arrangement of that length that fits the clue (count and group style) and the cubes already known. A cube is fixed when it has the same value in every remaining arrangement. This is complete single-line reasoning: nothing a human can deduce from one line at a time is missing. Nothing beyond that is attempted: no cross-line lookahead, no contradiction search.
- **`solveStats(p)`** runs the same rule in synchronous waves. Each wave applies everything the previous state allows. It reports `rounds` (the waves), `opening` (the share of cubes decided in wave 1), `hidden` and `interior`.
- **The tests** (`test/puzzle.test.js`) assert that:
  - every `SHAPES` level and every `BONUS` stone is `lineSolve`-able with its shown clues;
  - every tutorial lesson is solvable with its `show` axes.

  The comment there says "line logic reaching every cell means the solution is unique", and that is correct. Line propagation is *sound*: each deduction holds in every solution consistent with the clues. So if it settles every cube, every solution equals that assignment. The shape itself satisfies its clues, so there is exactly one solution.
- **`tools/levels.mjs` "ok"** means something narrower than it looks.
  - "ok" is `lineSolve` *with every clue shown*, before hiding. It says nothing about the clues the player sees.
  - The shown set is judged by the separate `UNSOLVABLE` column, which is blank when fine.
  - It covers `SHAPES` only, not `BONUS` or `TUTORIAL`.

  Today every row prints `ok` and none prints `UNSOLVABLE`, so the conclusion holds. But "ok" alone would not catch a bad hide.

### What this audit adds (`tools/aha-audit.mjs`, `tools/aha-lib.mjs`)

1. **Exactly the game's clue set.** It uses `show` for lessons and `hideClues(fraction ?? 0.85, seed ?? 7)` otherwise, as `main.js` does.
2. **Clue consistency.** Every clue's count and style is recomputed from the voxels.
3. **An independently written propagator.** This is its own candidate tables and its own queue. It agrees with the game's `lineSolve` on all 86 puzzles.
4. **Backtracking search** for a second solution: propagation plus branching, counting to 2, with a budget of 200,000 nodes. On every puzzle the propagation alone settles everything, so the search ends at its first node with exactly one solution, and that solution is the shape.
5. **Exhaustive enumeration** of all 2^n fillings for the lessons small enough (n ≤ 22: Clear, Keep, Cross, Groups). Each has exactly one.
6. **A soundness self-check.** On 2,495 random tiny blocks with random hidden lines, small enough to enumerate:
   - whenever either propagator finished, brute force found exactly one solution;
   - the two propagators never disagreed.
7. **A wave trace** that matches `solveStats().rounds` on every puzzle. It throws if any deduction contradicts the shape (none did). Each decided cube is credited to the easiest deduction that settled it that wave:
   - **free:** the clue settles its whole line on an empty board (a 0, a full row, a circled 2 in 3);
   - **overlap:** the clue settles part of an untouched line (a 4 in 5 keeps the middle three);
   - **count:** arithmetic with known cubes (the count is reached, or the gaps left must all stay);
   - **glue:** a plain clue's one-group rule with known cubes (reach, joining, cutting off the ends);
   - **split:** the circle or square rule with known cubes.
8. **"Hardest needed".** Restricted solvers are rerun with less information:
   - *count* (every clue read as a bare count);
   - *glue* (plain clues read fully, circles and squares as bare counts);
   - *split* (everything).

   The lowest tier that still finishes is the hardest kind of deduction the level *requires*. "Used" can be harder than "needed", because the trace credits whatever fires first.
9. **"Spare" clues.** These are shown clues that could be hidden on their own with the level staying line-solvable. They are redundancy, not load-bearing.
10. **Dead ends.** Under line logic, a dead end would be a state where no shown line yields anything before the block is settled. **No puzzle has one.** Every wave until the last has at least one productive line, and no step ever needs a guess.

`test/uniqueness.test.js` locks in points 2, 4 and 5 for every level, stone and lesson. It only checks existing behaviour.

### Results

**All 86 puzzles (76 levels, 5 bonus stones, 5 lessons) are solvable by pure line logic with the shown clues, and all have exactly one solution. None is flagged.**

**Hardest tier needed:**
- **count, 10 puzzles:** Steps, Candle, Key, Chair, Snail Cottage, Apple and four lessons. These never need the group rules: counting alone finishes them.
- **glue, 30 puzzles.**
- **split, 46 puzzles.**

| Chapter | Mean passes | Wave 1 decides | Cubes to chisel known after wave 1 | Shown 0s | Wave-1 lines (of them 0s) | Cubes by type: free/overlap/count/glue/split | Mean quality* |
|---|---|---|---|---|---|---|---|
| I First Light | 3.7 | 78% | 71% | 15.7 | 44 (16) | 70/6/20/3/2 % | 2.6 |
| II Moss Garden | 4.9 | 63% | 58% | 12.0 | 36 (12) | 46/13/28/12/1 % | 3.6 |
| III The Orchard | 5.9 | 58% | 54% | 16.3 | 38 (16) | 51/9/29/9/2 % | 3.8 |
| IV The Lagoon | 7.0 | 43% | 40% | 11.1 | 24 (11) | 33/11/38/16/2 % | 5.2 |
| V Ember Steps | 7.4 | 47% | 31% | 12.3 | 30 (12) | 36/12/35/9/7 % | 5.2 |
| VI Lantern Festival | 8.0 | 48% | 41% | 9.7 | 34 (10) | 33/17/29/18/3 % | 4.8 |
| VII Starfall | 8.6 | 42% | 41% | 13.5 | 29 (14) | 32/11/30/22/5 % | 5.0 |

\* The solve-path quality score is defined under Proposition 1. It is a hypothesis, not a measured feeling.

**Problem levels.** None has a correctness problem. These are the design flags:

- **Front-loaded (wave 1 decides ≥ 75% of the block):** Steps 94%, Heart 85%, Teabag Pal 86%, Candle 87%, Toaster 89%, Bed 87%, Alarm Clock 80%, Snail 90%, Snail Cottage 85%.
  - On these, the object is effectively drawn by the first scan.
  - This is acceptable for the first two openers. It is not acceptable for the whole of chapter I.
- **Object carved early (≥ 65% of the chisels known in wave 1) outside chapter I:** Temple Bell 75%, Shiba Pup 67%, Starfish 68%, Cactus 66%, Puffin 65%. In chapter I: Teapot 77%, with 41 shown 0s.
  - The Teapot is the chapter finale, and level-design.md sells it as "peel to clear the belly".
- **Group clues barely matter:**
  - only 1–7% of cubes per chapter are settled by the circle or square rule;
  - 6 levels never need anything beyond counting.
- **Redundant clue sets:** 71 of 81 levels and stones show spare clues, 12.5 on average. Where `fraction` < 1, `hideClues` stops trying before the set is minimal.
- **Long narrow tails:**
  - Spiral (13 passes), Rocket (13), Observatory (14) and Starfall's stone (16) end with many waves of 1–4 productive lines.
  - This is fine as a quiet mop-up. It turns into hunting when the last lines are hidden behind the object.
  - Rocket's last five waves settle 2, 1, 1, 1 and 1 cubes.

### The audit table

Columns:
- **Shown / lines:** shown clues out of all lines (shown 0s, spare clues).
- **Passes:** synchronous waves of line logic.
- **Hardest needed:** see the tiers above.
- **D:** `test/difficulty.js`.
- **Wave-1 decides:** the share of the whole block settled by the first scan.
- **80% carved by wave:** the wave by which 80% of the cubes to chisel are known, out of the total passes.
- **Cells per wave:** the cubes settled in each wave.

In every row, *solvable* means line logic finishes with no guess and no dead end, and *unique* means the independent search found exactly one solution. Regenerate with `node tools/aha-audit.mjs --md`.

| Chapter | Level | Size | Shown / lines (0s shown, spare) | Solvable | Unique | Passes | Hardest needed | D | Wave-1 decides | 80% carved by wave | Cells per wave | Quality | Flags |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| First Light | Steps | 4x4x3 | 25/40 (6, 4) | yes | yes | 2 | count | 5.4 | 94% | 1/2 | 45·3 | 2.5 |  |
|  | Heart | 7x6x2 | 40/68 (12, 14) | yes | yes | 2 | glue | 6.1 | 85% | 1/2 | 71·13 | 1.59 |  |
|  | Teabag Pal | 5x7x2 | 37/59 (5, 22) | yes | yes | 3 | glue | 6.4 | 86% | 2/3 | 60·8·2 | 3.72 |  |
|  | Candle | 5x7x5 | 85/95 (31, 84) | yes | yes | 3 | count | 6.4 | 87% | 1/3 | 153·21·1 | 1.27 |  |
|  | Toaster | 7x6x4 | 69/94 (12, 36) | yes | yes | 3 | glue | 6.7 | 89% | 2/3 | 150·16·2 | 3.32 |  |
|  | Key | 10x5x2 | 53/80 (25, 23) | yes | yes | 3 | count | 6.9 | 73% | 1/3 | 73·26·1 | 1.41 |  |
|  | Bed | 5x5x9 | 88/115 (24, 52) | yes | yes | 3 | split | 7.1 | 87% | 1/3 | 195·24·6 | 1.45 |  |
|  | Chair | 4x6x4 | 41/64 (11, 13) | yes | yes | 3 | count | 7.5 | 67% | 2/3 | 64·29·3 | 4.51 |  |
|  | Record Player | 8x3x7 | 73/101 (7, 40) | yes | yes | 4 | glue | 7.9 | 73% | 2/4 | 123·39·5·1 | 3.12 |  |
|  | Alarm Clock | 7x9x3 | 73/111 (11, 26) | yes | yes | 4 | split | 8.4 | 80% | 2/4 | 151·33·3·2 | 2.81 |  |
|  | Bookshelf | 7x8x3 | 73/101 (4, 39) | yes | yes | 6 | split | 9.3 | 73% | 2/6 | 122·32·6·5·2·1 | 2.78 |  |
|  | Kitten in a Box | 7x7x6 | 96/133 (15, 35) | yes | yes | 5 | split | 10.0 | 57% | 2/5 | 169·88·25·11·1 | 3.2 |  |
|  | Teapot | 9x6x5 | 95/129 (41, 45) | yes | yes | 7 | split | 10.6 | 64% | 3/7 | 173·37·30·12·12·4·2 | 2.73 |  |
| Moss Garden | Snail | 8x6x2 | 50/76 (8, 32) | yes | yes | 2 | glue | 5.8 | 90% | 2/2 | 86·10 | 3.68 |  |
|  | Snail Cottage | 7x6x4 | 65/94 (15, 28) | yes | yes | 3 | count | 7.0 | 85% | 1/3 | 142·24·2 | 1.54 |  |
|  | Hatching Chick | 5x6x5 | 69/85 (16, 54) | yes | yes | 4 | split | 7.6 | 74% | 2/4 | 111·31·7·1 | 2.83 |  |
|  | Moth | 7x5x2 | 39/59 (10, 21) | yes | yes | 5 | glue | 8.0 | 70% | 2/5 | 49·14·5·1·1 | 3.6 |  |
|  | Cat | 6x6x4 | 50/84 (8, 6) | yes | yes | 4 | glue | 8.3 | 64% | 2/4 | 92·41·8·3 | 3.46 |  |
|  | Beehive | 5x7x5 | 53/95 (11, 12) | yes | yes | 5 | glue | 9.8 | 50% | 2/5 | 87·47·35·4·2 | 3.7 |  |
|  | Garden Gnome | 5x10x5 | 68/125 (17, 12) | yes | yes | 6 | glue | 10.2 | 62% | 2/6 | 154·72·14·8·1·1 | 2.72 |  |
|  | Garden Bench | 9x6x4 | 71/114 (9, 10) | yes | yes | 5 | glue | 10.3 | 43% | 3/5 | 92·75·18·27·4 | 6.08 |  |
|  | Fox | 6x8x5 | 69/118 (13, 12) | yes | yes | 7 | glue | 11.2 | 49% | 3/7 | 117·56·33·15·13·5·1 | 4.23 |  |
|  | Corgi | 5x7x7 | 72/119 (13, 13) | yes | yes | 8 | glue | 12.0 | 42% | 3/8 | 103·62·33·27·11·5·3·1 | 4.01 |  |
| The Orchard | Apple | 5x6x5 | 64/85 (13, 32) | yes | yes | 4 | count | 7.9 | 63% | 2/4 | 95·40·14·1 | 3.35 |  |
|  | Avocado | 7x9x3 | 67/111 (9, 14) | yes | yes | 5 | glue | 8.9 | 70% | 2/5 | 133·46·8·1·1 | 2.85 |  |
|  | Cactus | 7x9x5 | 98/143 (31, 31) | yes | yes | 4 | split | 8.9 | 70% | 2/4 | 219·82·11·3 | 2.79 |  |
|  | Tulip | 4x8x3 | 41/68 (7, 8) | yes | yes | 6 | split | 9.5 | 55% | 2/6 | 53·30·9·2·1·1 | 3.96 |  |
|  | Mushroom | 7x6x7 | 82/133 (19, 7) | yes | yes | 5 | glue | 10.0 | 56% | 2/5 | 164·79·29·21·1 | 3.33 |  |
|  | Pumpkin | 7x6x7 | 87/133 (23, 10) | yes | yes | 7 | glue | 10.7 | 60% | 2/7 | 177·72·33·6·4·1·1 | 2.62 |  |
|  | Sunflower | 7x10x2 | 54/104 (13, 23) | yes | yes | 7 | split | 10.8 | 46% | 3/7 | 65·37·22·6·5·3·2 | 4.43 |  |
|  | Bonsai | 7x7x3 | 58/91 (16, 12) | yes | yes | 8 | split | 11.0 | 57% | 3/8 | 84·33·13·9·2·3·1·2 | 4.85 |  |
|  | Pine | 5x9x5 | 61/115 (16, 17) | yes | yes | 7 | split | 11.4 | 47% | 3/7 | 105·59·45·5·7·1·3 | 5.63 |  |
| The Lagoon | Flip-Flops | 6x2x7 | 36/68 (4, 11) | yes | yes | 5 | split | 8.9 | 56% | 3/5 | 47·19·11·6·1 | 5.48 |  |
|  | Puffin | 5x8x5 | 63/105 (17, 10) | yes | yes | 5 | split | 9.3 | 60% | 3/5 | 119·39·26·13·3 | 3.84 |  |
|  | Fish | 7x5x3 | 39/71 (2, 8) | yes | yes | 5 | glue | 9.7 | 34% | 4/5 | 36·34·18·13·4 | 6.3 |  |
|  | Starfish | 7x2x6 | 39/68 (17, 8) | yes | yes | 7 | split | 10.0 | 57% | 3/7 | 48·16·11·5·2·1·1 | 3.91 |  |
|  | Penguin | 3x6x4 | 26/54 (2, 2) | yes | yes | 6 | glue | 10.3 | 32% | 3/6 | 23·17·18·12·1·1 | 6.22 |  |
|  | Jellyfish | 5x8x5 | 50/105 (9, 5) | yes | yes | 5 | glue | 10.5 | 40% | 3/5 | 80·70·41·5·4 | 5.35 |  |
|  | Axolotl | 9x5x7 | 89/143 (24, 11) | yes | yes | 6 | split | 10.8 | 52% | 3/6 | 164·71·44·27·6·3 | 3.63 |  |
|  | Sailboat | 8x8x3 | 65/112 (16, 9) | yes | yes | 7 | split | 11.1 | 46% | 2/7 | 89·68·19·9·4·2·1 | 3.78 |  |
|  | Crab | 9x4x5 | 58/101 (6, 8) | yes | yes | 7 | split | 11.4 | 35% | 3/7 | 63·49·44·11·9·2·2 | 5.24 |  |
|  | Lighthouse | 5x10x5 | 70/125 (19, 0) | yes | yes | 9 | split | 11.9 | 61% | 2/9 | 152·47·23·10·8·5·2·2·1 | 2.45 |  |
|  | Palm Islet | 7x8x7 | 101/161 (35, 15) | yes | yes | 8 | glue | 12.1 | 62% | 2/8 | 242·92·30·11·4·5·4·4 | 2.72 |  |
|  | Pelican | 4x7x6 | 54/94 (8, 0) | yes | yes | 9 | glue | 12.5 | 38% | 5/9 | 63·27·21·10·13·9·11·7·7 | 6.08 |  |
|  | Life Ring | 8x3x8 | 45/112 (4, 5) | yes | yes | 8 | glue | 12.7 | 25% | 5/8 | 48·10·24·20·43·25·18·4 | 8.24 |  |
|  | Turtle | 5x4x7 | 48/83 (4, 0) | yes | yes | 10 | split | 12.9 | 34% | 5/10 | 47·19·25·19·12·4·7·2·3·2 | 6.71 |  |
|  | Mug | 8x6x6 | 82/132 (0, 2) | yes | yes | 8 | split | 13.3 | 12% | 4/8 | 35·87·48·66·23·24·4·1 | 7.91 |  |
| Ember Steps | Taiko Drum | 5x7x5 | 43/95 (1, 3) | yes | yes | 5 | split | 9.5 | 62% | 3/5 | 108·28·31·6·2 | 4.63 |  |
|  | Temple Bell | 7x8x5 | 84/131 (30, 16) | yes | yes | 6 | split | 10.1 | 71% | 2/6 | 199·57·18·4·1·1 | 2.22 |  |
|  | Gate | 9x6x2 | 32/84 (2, 0) | yes | yes | 5 | split | 10.3 | 31% | 2/5 | 34·47·13·7·7 | 6.08 |  |
|  | Paper Fan | 9x5x2 | 24/73 (0, 0) | yes | yes | 7 | split | 11.1 | 44% | 4/7 | 40·20·16·4·4·2·4 | 6.78 |  |
|  | Snow Monkey | 7x8x7 | 101/161 (23, 14) | yes | yes | 7 | split | 11.8 | 51% | 2/7 | 198·117·49·16·4·2·6 | 4.93 |  |
|  | Tea House | 9x8x7 | 108/191 (7, 0) | yes | yes | 6 | split | 11.8 | 36% | 2/6 | 183·224·47·30·12·8 | 4.34 |  |
|  | Shiba Pup | 7x9x6 | 97/159 (32, 12) | yes | yes | 8 | split | 11.9 | 58% | 3/8 | 221·72·46·13·10·7·5·4 | 2.94 |  |
|  | Hourglass | 5x8x5 | 65/105 (2, 0) | yes | yes | 10 | split | 13.6 | 34% | 4/10 | 68·76·16·11·10·9·4·1·2·3 | 6.71 |  |
|  | Spiral Stair | 5x9x5 | 66/115 (14, 6) | yes | yes | 13 | glue | 15.4 | 37% | 5/13 | 84·11·21·10·52·6·14·2·13·2·5·2·3 | 8 |  |
| Lantern Festival | Dragon Head | 8x6x6 | 76/132 (8, 2) | yes | yes | 5 | split | 10.0 | 51% | 3/5 | 148·72·47·16·5 | 4.31 |  |
|  | Kokeshi | 5x9x5 | 49/115 (10, 0) | yes | yes | 6 | glue | 10.4 | 60% | 3/6 | 134·39·40·8·2·2 | 3.72 |  |
|  | Maneki-neko | 5x8x4 | 53/92 (5, 3) | yes | yes | 7 | glue | 10.6 | 52% | 3/7 | 83·34·25·11·5·1·1 | 4.23 |  |
|  | Daruma | 6x7x6 | 67/120 (14, 2) | yes | yes | 9 | split | 12.2 | 54% | 3/9 | 135·39·30·23·8·4·8·4·1 | 4.55 |  |
|  | Koinobori | 10x8x4 | 89/152 (20, 6) | yes | yes | 10 | split | 13.2 | 47% | 3/10 | 149·84·50·15·9·1·1·3·7·1 | 5.48 |  |
|  | Origami Fox | 7x6x3 | 34/81 (1, 0) | yes | yes | 11 | split | 14.4 | 23% | 6/11 | 29·22·15·13·13·16·10·2·2·2·2 | 6.69 |  |
| Starfall | Kite | 6x8x2 | 38/76 (12, 14) | yes | yes | 6 | glue | 10.1 | 44% | 3/6 | 42·31·15·3·3·2 | 4.87 |  |
|  | Moon Rabbit | 6x7x4 | 49/94 (15, 7) | yes | yes | 6 | glue | 10.6 | 48% | 3/6 | 80·37·33·11·5·2 | 4.77 |  |
|  | Polar Bear Cub | 5x8x5 | 62/105 (9, 5) | yes | yes | 7 | split | 10.7 | 52% | 3/7 | 103·45·23·16·9·2·2 | 3.86 |  |
|  | Baby Dragon | 7x8x6 | 87/146 (23, 14) | yes | yes | 6 | split | 10.8 | 54% | 3/6 | 182·69·49·21·7·8 | 3.81 |  |
|  | Rain Cloud | 7x6x3 | 36/81 (0, 6) | yes | yes | 5 | glue | 10.9 | 17% | 3/5 | 22·58·41·3·2 | 8.34 |  |
|  | Star | 7x8x2 | 35/86 (7, 6) | yes | yes | 6 | split | 10.9 | 29% | 3/6 | 32·27·30·21·1·1 | 5.69 |  |
|  | Snowman | 5x9x5 | 51/115 (9, 1) | yes | yes | 8 | glue | 12.1 | 48% | 3/8 | 108·43·47·8·13·2·1·3 | 5.65 |  |
|  | Visitor | 11x8x2 | 62/126 (18, 16) | yes | yes | 9 | split | 12.2 | 49% | 3/9 | 86·49·21·8·5·2·2·2·1 | 3.37 |  |
|  | Windmill | 7x10x4 | 70/138 (11, 7) | yes | yes | 8 | split | 12.8 | 34% | 3/8 | 96·88·43·19·25·4·2·3 | 5.56 |  |
|  | Wishing Well | 7x8x7 | 101/161 (23, 7) | yes | yes | 9 | split | 13.0 | 48% | 3/9 | 188·74·54·22·19·17·15·2·1 | 3.48 |  |
|  | Owl | 6x7x4 | 47/94 (6, 0) | yes | yes | 11 | split | 13.7 | 37% | 5/11 | 62·26·24·12·15·10·7·4·3·3·2 | 5.88 |  |
|  | Rocket | 5x10x5 | 74/125 (22, 0) | yes | yes | 13 | glue | 14.3 | 61% | 3/13 | 153·38·25·8·10·4·2·4·2·1·1·1·1 | 3.72 |  |
|  | Ringed Planet | 9x5x9 | 97/171 (26, 3) | yes | yes | 12 | split | 15.1 | 43% | 3/12 | 174·46·94·27·14·7·10·4·9·3·3·14 | 5.85 |  |
|  | Observatory | 7x7x7 | 99/147 (8, 1) | yes | yes | 14 | split | 16.4 | 24% | 7/14 | 83·52·41·27·28·21·16·19·21·14·10·4·4·3 | 5.78 |  |
| First Light (bonus) | Cottage | 7x7x5 | 66/119 (6, 7) | yes | yes | 7 | glue | 11.2 | 46% | 2/7 | 113·80·19·10·12·9·2 | 3.75 |  |
| Moss Garden (bonus) | Frog | 7x4x7 | 64/105 (11, 3) | yes | yes | 12 | split | 14.3 | 43% | 3/12 | 84·45·36·12·6·4·2·1·1·1·1·3 | 6.26 |  |
| The Lagoon (bonus) | Whale | 10x5x5 | 71/125 (14, 1) | yes | yes | 11 | split | 14.0 | 40% | 4/11 | 101·43·47·24·8·9·5·8·2·2·1 | 4.61 |  |
| Ember Steps (bonus) | Paper Lantern | 7x9x7 | 113/175 (19, 1) | yes | yes | 13 | split | 15.7 | 34% | 5/13 | 148·64·55·57·30·16·24·11·19·10·3·3·1 | 5.49 |  |
| Starfall (bonus) | Crescent Moon | 8x9x4 | 69/140 (13, 0) | yes | yes | 16 | split | 17.7 | 28% | 10/16 | 82·28·32·29·13·16·13·2·9·23·9·16·6·5·3·2 | 8.9 |  |
| Tutorial | Clear | 4x2x1 | 2/14 (1, 0) | yes | yes | 1 | count | 4.7 | 100% | 1/1 | 8 | 2.5 |  |
|  | Keep | 4x3x1 | 3/19 (2, 0) | yes | yes | 1 | count | 4.9 | 100% | 1/1 | 12 | 2.17 |  |
|  | Cross | 3x3x1 | 6/15 (0, 6) | yes | yes | 2 | count | 5.9 | 56% | 2/2 | 5·4 | 6.23 |  |
|  | Groups | 3x2x1 | 2/11 (0, 0) | yes | yes | 1 | split | 4.3 | 100% | 1/1 | 6 | 3.5 |  |
|  | Lantern | 3x3x3 | 27/27 (0, 27) | yes | yes | 1 | count | 5.0 | 100% | 1/1 | 27 | 2.61 |  |

### Limits of the method

- **Big levels rest on soundness, not search.**
  - On all 86 puzzles, propagation finishes before any branching, so the backtracking search never branches.
  - Uniqueness on the large levels therefore rests on the soundness argument above, plus two cross-checks: an independent implementation, and a brute-force validation of both propagators on 2,495 tiny blocks. It does not rest on an exhaustive search of 300-cube blocks.
  - The argument is a proof. The cross-checks guard the *code* that implements it.
- **Passes are not human steps.** A player works sequentially and opportunistically, and may skip a free row and come back. Per-wave numbers describe what is *available*, not what a person does.
- **The tiers are a taxonomy, not a psychology.** A "glue" deduction on a 3-cube line can be easier than a "count" across a 9-cube line.
- **Reveal timing is a proxy:** the share of chiselable cubes that are known. Recognising the object also depends on camera, colour (only shown at the end) and silhouette. No player has been asked when they recognised anything.
- **The audit holds for today's code.** Any change to `hideClues`, a `fraction`/`seed`, or a shape needs a rerun. The new test does that automatically.

## Part 2: The study

### What was actually read, and how

A research subagent fetched the sources below. It read web pages directly and read YouTube talks through their auto-generated captions; it watched no video and played no game.

I re-fetched three of them myself, and the quotes matched:
- Wolter's survey;
- the Picross 3D reception round-up (the 1UP lines);
- Nikoli's English "Puzzles" page.

Treat the rest as quoted by the subagent, with links to check.

**Not found or not accessed:**
- any HAL Laboratory interview on how Picross 3D's puzzles were made (none was found in English or Japanese, and there is no Iwata Asks);
- designer interviews for Mario's Picross, Pictopix (by Tomlab, not Tuesday Quest) and Murder by Numbers;
- Stephen Lavelle in his own words;
- GMTK's "The Rules of Puzzle Design";
- Blow's "Truth in Game Design".

So the claims about Picross 3D below rest on Nintendo's own description and on reviews, not on its designers. **Observed evidence** for Strata comes from the audit tools above; for the exemplars it comes from what the sources show (the captions, Wolter's data), not from playing them.

| # | Source | Access |
|---|---|---|
| S1 | Nintendo UK, *Picross 3D* page: "A circle indicates that the cubes … are in two separate groups. A square indicates … three or more groups." The player will "gradually reveal a fully animated three-dimensional model". https://www.nintendo.com/en-gb/Games/Nintendo-DS/Picross-3D-272244.html | primary |
| S2 | Ray Barnholt (1UP), quoted in Gamasutra's reception round-up: "you're picking away masses of cubes to reveal a cube 'sculpture'", and "Chipping away tower after tower of zeroes starts to feel like a chore." https://www.gamedeveloper.com/game-platforms/critical-reception-nintendo-s-i-picross-3d-i- | secondary; re-checked |
| S3 | Jan Wolter, *Survey of Paint-by-Number Puzzle Solvers*. Random 30×30 grids "are not very similar to human designed puzzles". 0.4% of random grids are unique and line-solvable, against 81.8% of human-made webpbn puzzles. https://webpbn.com/survey/ | primary; re-checked |
| S4 | Nikoli, *Puzzles*: "They are not computer generated clones." The expert who thinks they have found the hidden trick may "walk straight into a trap … a sort of mind game between the solver and the puzzle creator." https://www.nikoli.co.jp/en/puzzles/ | primary; re-checked |
| S5 | Nobuhiko Kanamoto (Nikoli), quoted in the Globe and Mail: computer-generated puzzles lack "the sense of communication between solver and author"; "Good Sudoku authors are always considering a solver's feelings." Wayne Gould's counterpoint: "if it's well done, a handmade puzzle is the same as a computer generated one." https://www.theglobeandmail.com/arts/the-crack-cocaine-of-games/article18242760/ | secondary |
| S6 | Thomas Snyder, profiled in the Stanford Daily: a crafted puzzle leaves "a trail of breadcrumbs". Grandmaster Puzzles: "Computers construct Sudoku by subtracting randomly from a known solution. Humans construct by adding givens." https://stanforddaily.com/2010/03/30/sudoku/ and https://www.gmpuzzles.com/blog/?p=33500 | secondary / primary |
| S7 | Cracking the Cryptic, *How To Create A Sudoku Masterpiece* (guest setter Jovial). The parts are "the concept … the breakin … the midsolve … the finale". "If your solve post breakin is tedious and slow, you run the risk of snapping all of the enjoyment the solver gets out of the break-in." "Difficult … can mistakenly be interpreted as synonymous with beautiful." https://www.youtube.com/watch?v=8DU5IQqUaw8 | captions |
| S8 | CtC, *How To Set A Classic Sudoku: Valtari* (shye). He calls telegraphing "the most important of all: if the solver doesn't know where or what to even look at they're likely to end up bifurcating". He runs "two solvers … one which has the intended technique turned off and the other … turned on". He uses symmetry "to draw the solver's eyes". https://www.youtube.com/watch?v=-kjnNt8ClIA | captions |
| S9 | Oxford Blue interview with CtC: Simon Anthony looks for a "real logical flow" and "moments of epiphany"; Mark Goodliffe looks for a "moment of surprise". https://theoxfordblue.co.uk/cracking-the-cryptic-on-the-beauty-of-sudoku/ | secondary |
| S10 | Simon Tatham, Puzzles developer docs: every puzzle must be solvable "without having to guess". "Human solvers prefer to do more complex deductions than to spend ages searching for simple ones." Generating "at least a given level of difficulty is rather harder", because removing one number can take a puzzle "from Trivial straight to Ambiguous". https://raw.githubusercontent.com/ghewgill/puzzles/master/devel.but (a mirror; the original timed out) | primary text |
| S11 | Mark Brown, GMTK, *What Makes a Good Puzzle?* (2018). A puzzle is built around "a catch", a seeming contradiction; "The player shouldn't be figuring out what to do - just how to do it". In Stephen's Sausage Roll, Lavelle "used an assumption to walk the player right into the puzzle's central catch". A bad one "felt more like a trick than a revelation". https://www.youtube.com/watch?v=zsjC6fa_YBg | captions |
| S12 | Jonathan Blow and Marc ten Bosch, IndieCade 2011. Puzzles as "little nuggets of truth"; "after you're complete you then go through and be an editor … and take out all the things that are not surprising". https://www.youtube.com/watch?v=OGSeLSmOALU | captions |
| S13 | Blow at Gamelab 2018 (Gamereactor): "it's simulating an experience of epiphany … not something dumb or trivial"; "the stuff is right in front of your face the whole time". https://www.gamereactor.eu/shared-epiphany-jonathan-blow-reflects-on-the-witness/ | primary interview |
| S14 | Matthew VanDevander, *DOs and DON'Ts of Honest Puzzle Game Design*: The Witness teaches "an abstract idea through a series of examples and counter examples". https://www.youtube.com/watch?v=0zVjdEhHmGo | captions |
| S15 | Scott Kim, *What is a Puzzle?*: "A puzzle is fun, and it has a right answer"; he enjoys "puzzles that involve such perceptual shifts"; "be sure the player is challenged by the puzzle itself, not the controls". http://www.scottkim.com/thinkinggames/whatisapuzzle/ (Wayback snapshot, 2007) | primary |
| S16 | Nintendo UK, *PICROSS e3*: Mega Picross "will push even experienced players to use a different kind of logic". https://www.nintendo.com/en-gb/Games/Nintendo-3DS-download-software/PICROSS-e3-828782.html | primary |
| S17 | Video Games Chronicle on Jupiter (Picross S): Picross should be "accessible, easy to play, provide a stress-free experience". https://videogameschronicle.com/features/picross-developer-jupiter-on-nearly-30-years-of-puzzling-prowess | primary |

### Mechanisms

Each mechanism is recorded in the skill's format:
- **Claim:** what practitioners say;
- **Observed:** what can be located, in their work or in Strata's data;
- **Interpretation;**
- **Hypothesis:** what to try here.

**M1. A clear break-in.**
- **Claim:** the break-in is a distinct, designed stage (S7). It must be *telegraphed*, or solvers resort to guessing (S8). The solver should be "figuring out … how", not "what" (S11).
- **Observed:**
  - In the CtC setting videos, setters describe drawing the eye to one region, for example with symmetry (S8).
  - In Strata, wave 1 offers 24–44 productive lines on average per chapter, and 43–59% of a first wave comes from 0-lines. The first move is everywhere at once.
- **Interpretation:** a break-in feels like insight because it is *local and findable*. A sweep of free rows is reading, not finding.
- **Hypothesis:** a curated wave 1 of a handful of lines (P1's focus term), placed on the default-camera side, will produce a felt "start", without making the level harder.

**M2. The cascade after a key deduction.**
- **Claim:**
  - A tedious post-break-in midsolve "snaps" the enjoyment; an instant collapse is also a failure (S7).
  - "Logical flow" leads to "moments of epiphany" (S9).
  - The best puzzles reward a single insight with an elegant run (S7, S8, and the Miracle Sudoku discussion in CtC's captions).
- **Observed:** in Strata, most paths taper: each wave is smaller than the last (Bonsai: 84 · 33 · 13 · 9 · 2 · 3 · 1 · 2). Only a handful surge after a narrow wave: Mug, Torus, Rain Cloud, Spiral, Garden Bench.
- **Interpretation:** a cascade needs a *pinch* first: a narrow wave whose result unlocks many lines. Random hiding produces pinches only by accident.
- **Hypothesis:**
  - Score for a narrow wave followed by a large one (P1's cascade term).
  - Make the moment perceptible with completion feedback (P4).

**M3. One memorable insight per level.**
- **Claim:**
  - Blow: edit out "all the things that are not surprising" (S12).
  - A puzzle simulates "epiphany … not something dumb or trivial" (S13).
  - A "one-stepper" is "find the one trick and it all falls to pieces" (S8).
  - Kim prizes the "perceptual shift" (S15).
  - Nikoli frames it as the setter's hidden trick (S4).
- **Observed:** Strata's levels are designed around an *object* (level-design.md), and the clues are chosen by `(fraction, seed)`. No level has a named deduction. Six levels need no rule beyond counting.
- **Interpretation:** in a picture-logic game the *object* can be the level's identity while one *deduction* is its insight. Strata has the first and not the second.
- **Hypothesis:** name one insight per level when curating (P1), check it with a two-solver test as shye does (the level stalls with the technique off), and honour it after the solve (P6).

**M4. Teach a technique, then twist it.**
- **Claim:**
  - The Witness teaches "an abstract idea through a series of examples and counter examples" (S14).
  - Stephen's Sausage Roll walks the player into a catch through an assumption (S11).
  - Jupiter's Mega Picross is a single rule change that demands "a different kind of logic" (S16).
- **Observed:**
  - Strata's tutorial teaches clues, marking, crossing, groups and peeling, one idea per lesson. That part is good and matches this.
  - After the tutorial, chapter order is set by D. Group rules settle 1–7% of cubes in every chapter, so the circles and squares are taught and then rarely required.
- **Interpretation:** the tutorial is a curriculum; the chapters are not.
- **Hypothesis:** one deduction per chapter, introduced in its opener and twisted by its finale, verified with restricted solvers (P3).

**M5. Hide the object until late.**
- **Claim:**
  - Picross 3D's reward is to "gradually reveal" a model, then animate it (S1, S2).
  - Blow insists the thing should be "right in front of your face the whole time" (S13). The reveal is earned, not hidden behind a trick.
- **Observed:** Strata reveals colour only at the end, which is good. But the carved silhouette is readable early: 80% of the chisels are known by wave 1 in 10 puzzles and by waves 1–3 in most. Shown 0s punch the outline through.
- **Interpretation:** in a carving game the object *should* emerge, but its naming detail should come in the second half. Hiding it completely would be a trick, and would break Blow's clarity rule.
- **Hypothesis:** move the identifying feature's cubes late (P5), and budget the 0s (P2).

**M6. Avoid tedious obvious rows.**
- **Claim:**
  - Barnholt on Picross 3D: "Chipping away tower after tower of zeroes starts to feel like a chore" (S2).
  - Tatham: humans "prefer to do more complex deductions than to spend ages searching for simple ones" (S10).
  - Kim: challenge should come from "the puzzle itself, not the controls" (S15).
- **Observed:** shown 0s give away 31–70% of all chisels, depending on the chapter. Big levels need 200–330 taps.
- **Interpretation:** 0s are fine as a warm-up and as Strata's calm rhythm. As the *majority* of the work, they turn the level into chores, and they reveal the object too.
- **Hypothesis:**
  - A per-chapter 0 budget (P2).
  - Drag-chiselling along proven-empty rows (P8).

**M7. Clue density shapes the experience.**
- **Claim:**
  - Nikoli and Snyder argue for hand-placed givens: "communication between solver and author", "a trail of breadcrumbs", adding givens rather than subtracting randomly (S4–S6). There is a counter-view: Gould says a well-made generated puzzle is equivalent (S5).
  - Tatham: generators reliably hit an *upper* bound of difficulty, but not a designed one (S10).
  - Jupiter wants a "stress-free" flow (S17).
- **Observed:**
  - Wolter's data: human-made nonograms are overwhelmingly line-solvable and unique, and random grids almost never are (S3). Strata enforces both, which is good.
  - Strata's sets are subtractive and random. 71 of 81 levels and stones keep spare clues, 12.5 on average.
- **Interpretation:** density is a dial for *how wide* the first scan is, and for how much each clue matters. Calm does not require redundancy: Jupiter's stress-free Picross gets its calm from line-solvability and gentle pacing, not from extra givens.
- **Hypothesis:**
  - Keep line-solvability as the floor.
  - Keep generous density in chapters I–II.
  - From chapter IV on, make every clue load-bearing (P7), steered by P1's path score rather than by `fraction`.

**Where the sources disagree, or don't transfer.**
- **Setter-craft sudoku is aimed at enthusiasts.** S7 warns that "difficult" is often mistaken for "beautiful", and Strata's audience is calm and mobile. So this study borrows the *structure* (break-in, pinch, cascade, finale) and not the difficulty.
- **Generators can be good.** Gould's and Goodliffe's views mean a well-steered generator is acceptable. P1 is exactly that: a search with a human pick, not hand-placing all 76 sets.

### Strata's levels against these mechanisms, chapter by chapter

All figures are from `tools/aha-audit.mjs`. "Wave 1" is the first scan of every shown clue. "Carved" is the share of the cubes to chisel that the player can already know.

**I First Light (13 levels).** Wave 1 settles 78% of the block on average, and 71% of the chisels are known before any reasoning. 70% of all cubes come from free lines: 0s and full rows.
- **First moves:** 44 productive lines on average, 16 of them 0s. There is no break-in to find, because the whole block is the break-in.
- **Early reveal:** seven of the 13 are front-loaded (Steps, Heart, Teabag Pal, Candle, Toaster, Bed, Alarm Clock), and on these the object is drawn by the first scan.
- **Cascade or grind:** neither. Most finish in 2–4 passes, with a tail of 1–6 cubes.
- **The finale:** the Teapot shows 41 0s, which give away 30 of the 51 empty interior cubes. The "peel to clear the belly" moment is mostly decided before it happens.
- **Exceptions:** Chair (67% in wave 1, where the legs need circles) and Bookshelf (only 31% of the carving known in wave 1).
- **Verdict:** a gentle opening is right for chapter I, but this one teaches tapping rather than seeing.

**II Moss Garden (10).** Wave 1 settles 63%. Snail (90%) and Snail Cottage (85%) are still front-loaded. Group clues settle 1% of the cubes, so the circles barely exist here.
- **Best:** Garden Bench, at 43% in wave 1. Its path is 92 · 75 · 18 · **27** · 4: a second wind in wave 4.
- **Corgi and Fox:** long tapers of 7–8 passes. Each wave is smaller than the last; that is a grind, not a cascade.

**III The Orchard (9).** Wave 1 settles 58%. It has the most shown 0s of any chapter (16.3 on average), so the silhouette arrives early. Cactus has 66% of its carving known in wave 1.
- **Best:** Bonsai and Tree, the only two with a real later surge.
- **Bonsai:** 84 · 33 · 13 · 9 · 2 · 3 · 1 · 2. It gives the object away in wave 1 and then hunts. Part 4 shows the same tree with a turn.
- **Pumpkin:** a 1 · 1 tail.

**IV The Lagoon (15).** The first chapter where wave 1 settles less than half the block (43%).
- **Mug:** no shown 0s, 12% in wave 1, then a 2.5× cascade. The best-shaped path in the game.
- **Torus:** 48 · 10 · 24 · 20 · **43**. A narrow second wave, then a late surge.
- **Turtle:** 10 passes with a steady rhythm.
- **Early reveal:** Starfish (68% of carving in wave 1) and Puffin (65%).
- **Lighthouse:** a 9-pass taper.

**V Ember Steps (9).** It has the lowest early carving of any chapter (31%), with real late reveals:
- Gate: 7% known in wave 1;
- Hourglass: 10%, over 10 passes;
- Fan: no shown 0s.

Spiral (13 passes) has a genuine cascade, 10 → **52** at wave 5, but around it run waves of 2–5 lines that can feel like hunting.
- **Outlier:** Temple Bell, with 30 shown 0s and 75% of its carving known on the first scan.

**VI Lantern Festival (6).**
- **Origami Fox:** 23% in wave 1, 9% carved, 11 passes, and almost no pinch (29 · 22 · 15 · 13 · 13 · 16 · 10 …). A steady, even solve: calm, but without a turn.
- **Kokeshi:** 60% in wave 1, so it reads early.

**VII Starfall (14).** Wave 1 settles 42%.
- **Rain Cloud:** no shown 0s, 22 → **58** → 41. A clean break-in and cascade.
- **Planet:** a late rise (… 9 · 3 · 3 · **14**).
- **Rocket:** ends in four waves of one cube each, a hunt for the last cubes on a 13-pass level.
- **Observatory:** 14 passes, steady.
- **Shrine:** Starfall's bonus stone runs 16 passes.

**Across the game.**
- **Fair:** nothing is broken.
- **Cascades:** where they happen (Mug, Torus, Rain Cloud, Spiral, Garden Bench), it is luck of the seed. Nothing in `hideClues` aims for them.
- **Reveal:** recognition comes early whenever many 0s show, which is most levels before chapter IV.
- **Group clues:** they are taught in the tutorial, then settle at most 7% of cubes in any chapter, and 10 puzzles never need anything beyond counting.

## Part 3: Propositions

Ordered by expected effect per unit of cost. Every proposition keeps line-solvability, and so uniqueness, as a hard gate. `test/uniqueness.test.js` and the existing tests would hold any applied change to that.

### P1. Curate each level's clue set around its solve path, and stop relying on random hiding

**Change.**
1. Store an explicit clue mask per level (for example `clues: 'x-mask|y-mask|z-mask'`, as `tools/aha-search.mjs` prints it), used instead of `fraction`/`seed` when present.
2. Author each mask in two steps:
   - **search:** `aha-search` hill-climbs over hide and show toggles, keeping the level line-solvable and its D within ±0.6 of today's. It maximises the solve-path quality score below.
   - **human pass:** Kellan picks the level's one insight (M3) and checks that the path delivers it.

**The quality score** (`quality()` in `tools/aha-lib.mjs`, roughly 0–10). Every term is a hypothesis from Part 2, not a measured feeling:
- **break-in, 1.5:** wave 1 settles 5–30% of the block;
- **focus, 1.5:** at most about 8 lines offer a first move;
- **cascade, 3:** some wave settles 2–6× more than the one before it;
- **late carving, 2:** 80% of the chiselling is known only after about 60% of the passes;
- **little tedium, 2:** few shown 0s.

**Expected effect.**
- On the levels tried (Part 4), the search raised the score substantially at the same D band.
- Wave 1 fell from 57–94% of the block to 37–65%.
- 80% of the carving moved from wave 1–3 to wave 2–5.
- Shown 0s fell from 6, 41 and 16 to 1, 13 and 9.

**Cost.** M–L.
- The tool exists.
- Each level needs a run of about 3–20 s, a human look at the path, and a playtest.
- 76 levels at about 10 minutes each is roughly 2 working days, plus a small loader change in `main.js` (not made).
- `sort-levels`/`retune` would need to learn about masks.

**Risk to calm.** Medium.
- Fewer free rows means fewer zero-thought taps, which some players use to settle in.
- Mitigation: keep chapter I generous (search with a wider break-in band), and keep the D gate so the ramp and its tests still hold.

**Measure.**
- In the tool: `aha-audit` before and after (wave-1 share, the cascade ratio, the 80%-carved wave, shown 0s, the quality score).
- With players: timed phone solves, plus one question after each solve: "when did you know what it was?" (first third, middle, last third).

The proposition succeeds if recognition moves later *without* longer median solves or more mistakes. Nobody has played these yet.

### P2. A zero budget: let 0s be the warm-up, not the solution

**Change.**
- A per-chapter cap on shown 0-clues, for example ≤ 6 in chapter I and ≤ 3 from chapter IV on.
- Prefer 0s that cross the object's identifying feature only *after* the break-in.

This is the cheapest version of P1. It could be as small as a stronger tilt against count-0 lines in `hideClues`, at any `fraction` (not changed).

**Why.**
- Shown 0s give away 31–70% of all chisels, depending on the chapter, and 43–59% of each first wave.
- They also *draw the outline*: a 0 is a hole straight through the block, and the holes are the object's silhouette.
- Mug (no shown 0s) is the best-paced level in the Lagoon. Teapot (41 shown 0s) is the most front-loaded finale.

**Expected effect.** Later recognition, fewer thoughtless taps, more count and glue work.

**Cost.** S.

**Risk.**
- D rises: every hidden 0 is a line the player must now infer.
- Some levels can't lose their 0s and stay line-solvable. The solver simply keeps them.

**Measure.**
- The 80%-carved wave and the wave-1 share per chapter.
- Mean D per chapter, kept in its ramp band (`npm test`).

### P3. One deduction per chapter: teach it, then twist it

**Change.** Give each region a technique to introduce in its first level and twist by its last:

| Chapter | Technique |
|---|---|
| I First Light | counting: 0 rows, full rows, "the count is reached, so the rest goes" |
| II Moss Garden | overlap: a 4 in 5 keeps its middle three, and big numbers anchor |
| III The Orchard | the circle: 2 groups need a gap, so a circled 2 in 3 is X.X |
| IV The Lagoon | peeling: deduce inside a hollow from the outside counts |
| V Ember Steps | squares and splits |
| VI Lantern Festival | glue: a known cube near an edge reaches inward |
| VII Starfall | combining: break-ins that need two techniques at once |

The tooling exists: the restricted solvers in `aha-lib` (`solvedBy(p, 'count' | 'plain' | 'full')`). A chapter's opener must *need* its technique (it is unsolvable with the tier below), and every later level should still use it.

**Why.**
- The Witness and Stephen's Sausage Roll teach by sequences, not text (M4).
- Today the order is set by D alone. Six levels need nothing but counting, and group clues settle only 1–7% of cubes. The circles and squares are taught in a lesson and then rarely needed.

**Expected effect.**
- Each chapter has an idea.
- The chapter's later levels feel like variations on it.

**Cost.** M: re-curating and reordering, plus an optional coach line on a chapter's first level, as in the tutorial hints.

**Risk to calm.** Low, if wordless or optional.

**Measure.**
- The `needed` tier per level matches the curriculum.
- In playtests, mistakes on a chapter's technique should fall by its third level.

### P4. Make the cascade audible, without solving for the player

**Change.**
- When a chisel or mark *completes* a line (all its cubes settled by the player), the line's cubes glint once and the line plays a soft note.
- When one action completes several lines at once, the notes form a short rising arpeggio: one step per line, capped at about 5, in the chapter's key.

The game-loop study's item 10, "a satisfied row glows briefly", is the same idea.

**What never to do.** Never signal lines that have merely become *deducible*. That is a hint system, and it takes the a-ha away. Only acknowledge what the player has done.

**Why.** The cascade is the payoff of a break-in (M2). Today the only feedback is per chisel: the chisel pitch climbs with progress (`audio.js`, `chisel(progress)`). The moment one insight unlocks a region is not marked.

**Expected effect.** The best moment of a good level becomes perceptible. It also rewards P1, because cascades become events.

**Cost.** S–M: audio plus a shader glint. The state is already tracked (`broken`, `painted`).

**Risk to calm.** Low to medium. Keep it sparse and consonant, with the same voice as the chisel, and no pops or score text.

**Measure.**
- Playtest recall: "was there a moment it opened up?"
- Logged completions per action: with P1 there should be a few multi-line moments per level.

### P5. Reveal pacing: the identifying feature settles last

**Change.**
- Tag each level's identifying voxels; often the colour key already marks them (the teapot's spout, the cat's ears, a lamp).
- In `aha-search`, add a term rewarding paths where those cubes, and the 0-lines through them, settle in the last third.

This extends P1's "late carving" from "most of the block" to "the part that names it".

**Why.**
- In Picross 3D the object is named and coloured only at the end. Strata colours at the end too, but the carved silhouette shows the object long before.
- Today 80% of the carving is known by wave 1–3 in most levels, and by wave 1 in 10 puzzles.

**Cost.** M: tagging is about 76 small decisions, partly automatic from voxel-study's "identity colour" rule.

**Risk.** Low. It changes which clues show, not the object.

**Measure.**
- The wave at which identity voxels settle, as a share of the passes.
- The "when did you know" question.

### P6. A key line: discovered, then honoured, never marked in advance

**Change.**
- In curation (P1), identify each level's *key line*: the line whose deduction at the cascade's pinch unlocks the most. `aha-search` already prints the pinch wave and, when it is narrow, its lines.
- Make sure the key line reads on the default-camera side.
- After the solve, the reveal or journal can trace it briefly: "this was the turn".

**Why.** Setters design a break-in that solvers *find* (M1). Highlighting it beforehand would hand over the insight.

**Cost.** S, once P1 exists.

**Risk.** Low. Post-solve only.

**Measure.** Do players, asked where it clicked, point near the key line?

### P7. Remove the spare clues from the later chapters

**Change.** From chapter IV on, require every shown clue to be load-bearing: hide each line that can be hidden. That is `fraction` 1.0 run to the end, or a minimality step in curation.

**Why.**
- 71 of 81 levels and stones show spare clues, 12.5 on average.
- Nikoli-style setting treats every given as a decision (M7).
- Spare clues also make the first scan wider: more lines to read, more free moves.

**Cost.** S.

**Risk.**
- D rises sharply. This needs P1's D gate or a chapter re-sort.
- Minimal puzzles can feel austere. Keep the early chapters out of it.

**Measure.** Spare-clue count, D, and solve times.

### P8. Retire tedium at the tap level

**Change.** The open question in level-design.md: drag to chisel along a row the player has proven empty. This is strictly an input change.

**Why.** Even with P2, a 9-long 0 row is nine taps of no thought, and big levels need 200–330 chisels.

**Cost.** M (input code). **Risk.** Low, if a drag can't cross a marked cube.

**Measure.** Taps per level, and the share of solve time spent on cubes decided in wave 1.

### Evaluated and not recommended

- **Picross 3D-style group hints.** Strata already has them (circled = 2 groups, squared = 3+).
  - The problem is not their absence. They are rarely *needed* (1–7% of cubes).
  - P1 and P3 address that.
- **Marking the key line in advance.** It removes the discovery. See P6.
- **Signalling "this line is now solvable".** That is a hint system, and it pre-empts the a-ha. Keep any such help behind an explicit, optional hint button, if at all.
- **Hiding the object until the very last cube.** In a carving game the object *emerges*; that is half the charm. The aim is "recognised in the second half", not "invisible until the end".

## Part 4: Worked examples

All proposals below are printed by `node tools/aha-search.mjs <id> <iterations> <seed>`. The search is deterministic, so these exact runs reproduce. The masks are printed by the tool and **not applied**.

Notation:
- **wave n: c cubes / l lines** gives the cubes settled and the lines productive in that wave.
- **Type counts** are free/overlap/count/glue/split.

### Steps, chapter I opener: `aha-search steps 3000 2`

| | Today (fraction 0.5, seed 8) | Proposed |
|---|---|---|
| Shown (0s) | 25 of 40 (6) | 29 of 40 (1) |
| Path | wave 1: 45 cubes / 19 lines, then wave 2: 3 | wave 1: 31 / 17, then wave 2: 17 / 16 (all *count*) |
| Wave 1 decides | 94% | 65% |
| 80% carved by | wave 1 of 2 | wave 2 of 2 |
| D | 5.4 | 6.0 (Heart is 6.1, so the order holds) |

**Today.** Every 0 in the block is shown. The first scan carves the whole staircase, and the last three cubes are bookkeeping. The player never *concludes* anything: the steps appear on their own.

**Proposed.**
- The shown 0s drop from six to one.
- The full rows (3/3 in depth, 4/4 up the back) build the steps' solid core first.
- Then one round of counting carves them: "this column's count is reached, so the rest goes".

This is the only technique chapter I needs to teach (P3). It stays an easy opener, with two passes, but the 17 second-wave cubes are a small first cascade the player earns.

### Teapot, chapter I finale and "the first real hollow": `aha-search teapot 5000 3`

| | Today (fraction 0.3, seed 13) | Proposed |
|---|---|---|
| Shown (0s) | 95 of 129 (41) | 75 of 129 (13) |
| Path | 173 · 37 · 30 · 12 · 12 · 4 · 2 | 101 · 16 · **66** · 38 · 49 |
| Wave 1 decides | 64% (163 cubes free) | 37% (97 free) |
| 80% carved by | wave 3 of 7 | wave 5 of 5 |
| Interior (the belly) known in wave 1 | 30 of 51 empty interior cubes | **0 of 51**: the 0s through the belly are hidden |
| Hardest needed | split | glue |
| D | 10.6 | 10.7 |
| Score | 2.7 | 8.5 |

**Today.**
- 41 shown 0s punch straight through the block. They give the silhouette *and* most of the belly on the first scan.
- level-design.md promises "peel to clear the belly", but the belly is mostly decided before any peeling thought.
- After wave 1 the path is a long taper: 37, then 30, then a tail of 12, 12, 4 and 2. That is a grind, not a cascade.

**Proposed.**
- Wave 1 is the outside: all 30 x-rows are shown, plus a few 0s and four 3-in-5 depth overlaps. It roughs out a block, not a teapot.
- **Wave 2 is the pinch:** 16 cubes from 8 lines, mostly counting.
- **Wave 3 is the cascade:** 66 cubes, 48 of them by *glue*, the one-group rule pulling the body's rings into place.
- Waves 4–5 finish the belly and spout.
- 80% of the carving is known only at the end, and D is unchanged.
- **None of the belly is known on the first scan.** The hollow has to be reasoned out, which is the peel "aha" the level was built for.

The level would lose its need for the square rule; whether that matters is a P3 curriculum choice. The key line (P6) is among wave 2's eight lines.

### Bonsai, the player favourite (chapter III): `aha-search bonsai 5000 2`

| | Today (fraction 0.65, seed 3) | Proposed |
|---|---|---|
| Shown (0s) | 58 of 91 (16) | 47 of 91 (9) |
| Path | 84 · 33 · 13 · 9 · 2 · 3 · 1 · 2 | 57 · 20 · 25 · 8 · **4** · 14 · 19 |
| Wave 1 decides | 57% | 39% |
| 80% carved by | wave 3 of 8 | wave 5 of 7 |
| Inside known in wave 1 | 7 of 12 | 2 of 12 |
| D | 11.0 | 11.3 |
| Score | 4.9 | 8.3 |

**Today.**
- The first scan settles 57% of the block (16 0s).
- The rest tapers to four waves of 1–3 cubes: the tree is visible early, and the end is a hunt for the last few.

**Proposed.**
- **Pot first:** wave 1 is the pot, from four 5/7 rows, plus a few 0s.
- **Trunk:** waves 2–4 raise the trunk by counting.
- **The turn at wave 5:** only two lines move. They are the depth clues **1/3 at (x5, y5)** and **1/3 at (x2, y6)**, two lone cubes at the top of the crown. That is the key line pair (P6).
- **The release:** 14 cubes follow, then 19.
- **The circles finish it:** 18 of the last 19 cubes come from the *split* rule. The circled clues close the canopy's two lobes, which is exactly where a bonsai's identity lives.

That is break-in, then a pinch, then a cascade, with the object completed by the most characterful rule at the very end.

### The in-house exemplar: Mug (chapter IV), unchanged

Mug already has the shape this study argues for.
- It has `fraction` 0.8 and no shown 0s.
- Wave 1 settles only 12% of the block, from 10 lines.
- Wave 2 opens 87 cubes, a 2.5× cascade.
- 80% of the carving is known by wave 4 of 8.

It shows the target is reachable with today's machinery. P1 makes it deliberate instead of a lucky seed.

### What the examples do and don't show

- They show that the clue set alone, with the same shapes and the same D, can move a level from "drawn on the first scan" to "break-in, pinch, cascade".
- They don't show that players *feel* the difference. That needs the P1 measurement plan.
- The score is the hill-climb's target, so a high score after a search is expected, not evidence. The evidence is the path itself: read the wave lines.

## Tools and open questions

**Tools.** All are read-only; none writes to `shapes.js`.

| Command | What it does |
|---|---|
| `node tools/aha-audit.mjs` | the full audit (`--md` for the table above, `<id>` for one level wave by wave) |
| `node tools/aha-search.mjs <id> [iterations] [seed]` | proposes a curated clue mask and prints its path |
| `test/uniqueness.test.js` | the independent uniqueness check, run by `npm test` |

**Open questions.**
- **Is the quality score right?** Its weights are guesses. Calibrate them against a handful of timed phone solves, with the "when did you know what it was?" and "was there a moment it opened up?" questions, before trusting it across 76 levels.
- **How should curated masks be stored?** Bitstrings depend on line order in `Puzzle`, which is stable, but a shape edit invalidates its mask. A test would need to fail loudly if that happens.
- **Should chapter I keep its free openings?** Some players want a few levels of pure tapping to settle in. That is Kellan's call (P1, P2).
