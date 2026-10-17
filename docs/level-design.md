# Level design

The 26 puzzles in `public/js/shapes.js` are grouped into five chapters (`CHAPTERS`). Each chapter has its own palette. Array order is play order.

## What makes a 3D nonogram satisfying

1. **The reveal is the reward.** Nothing tells you what you're carving until the last cube falls and the colours bloom. The solved object has to read at a glance, at phone size, from the default camera. Every level was screenshotted solved (`tools/shoot-levels.mjs`) and reworked until it read:
   - the key's bow got a 2×2 hole
   - the turtle's shell turned brown so the green head and legs stand out
   - the teapot body went from an ellipsoid shell to stacked rings
   - the gate went from a slab to a torii with a gap between its beams
2. **Deductions should chain.** Clues that give everything away (a 0, or a full row) are free moves, not thinking. A good puzzle opens with a few of those, then makes you combine two half-informative clues into a third deduction. `solveStats().rounds` measures that chain. It counts how many waves of "scan every visible clue, apply what's certain" the solver needs.
3. **Circled and squared clues should matter.** A circle (two groups) or square (three or more) changes which placements fit, so shapes with holes and limbs earn them:
   - chair legs, the key's teeth
   - the hourglass posts, the torii beams
   - the mug and observatory walls

   Flat or convex shapes (Visitor aside) give mostly plain clues, so they sit early.
4. **Some things should only be found by peeling.** Hollow objects with something inside make the peel handles necessary, and the discovery is the "aha":
   - the teapot's belly
   - the lighthouse lamp
   - the pagoda bell (only the upper storey has it)
   - the observatory's telescope on its pier

   `solveStats().interior` is the share of empty cells you can only reach by peeling.
5. **Pacing.** Difficulty rises across chapters, and each chapter opens with a breather and ends on its hardest piece.
6. **Respect the thumb.** One tap chisels one cube.
   - Every level is at most 11 per side and needs at most 330 chisels; the test enforces this.
   - Empty padding layers were trimmed: the teapot went from 7 to 5 deep, the pine from 7 to 5 wide.

## The difficulty dial

`hideClues(p, fraction, seed)` hides clues greedily, in a seeded order, keeping only hides that leave the puzzle line-solvable. Line-solvable also means the solution is unique.

With a purely random order, `fraction` barely mattered. The solver can only hide about 40–55% of lines, whatever the order, so the remaining clues were still full of 0s.
- **Change:** above 0.6, the order is tilted so give-away clues are tried first.
- **Measure:** `giveaway(line)` is the share of a line's cells its clue decides on an empty board.
- **Effect:** for the same hide count, the remaining clues are less generous. For example, the boat's "decided on the first scan" share fell from 64% to 15%.
- **Below 0.6:** the order is unchanged from before, so the gentle early levels keep their many free moves.

`main.js` needs no change. The game still calls `hideClues(puzzle, shape.fraction, shape.seed)`.

## Difficulty metric

`test/difficulty.js` combines the `solveStats()` fields:

```
D = 0.6·rounds + 3·(1 − opening) + 3·hidden + 2·interior + 0.5·log2(cells)
```

| Term | Meaning |
|---|---|
| rounds | Length of the deduction chain |
| opening | Share of cells decided from clues alone |
| hidden | Share of lines with no clue |
| interior | Share of empty cells you must peel to reach |
| log2(cells) | Bigger blocks are more to hold in your head |

Use `tools/tune.mjs` to see each level's D across fractions and seeds, and `tools/levels.mjs` for the full table. Pass a shape id to `levels.mjs` to get ASCII slices.

The metric is a proxy built from solver behaviour. It hasn't been calibrated against real players. Treat the numbers as ordering, not as minutes. Some shapes have a ceiling no seed can lift, because their structure forces many free moves: the gate around 10.7, the lighthouse and snowman around 12. Those are placed as breathers.

## The set

| # | Chapter (palette) | Level | Size | D | What makes it interesting |
|---|---|---|---|---|---|
| 1 | First Light (Dawn) | Steps | 4×4×3 | 5.4 | Each column's count steps up by one; the first 3D read. |
| 2 | | Heart | 7×6×2 | 6.1 | Familiar silhouette, almost all plain clues. |
| 3 | | Key | 10×5×2 | 6.9 | First circled clues: the bow's hole and the teeth. |
| 4 | | Chair | 4×6×4 | 7.5 | Legs make split columns; the seat is a full layer to find. |
| 5 | | Visitor | 11×8×2 | 8.5 | Wide and busy, with square clues across the arms. Chapter closer. |
| 6 | Moss Garden (Mint) | Cat | 7×6×4 | 9.0 | Ears, a tail curled round the paws; green eyes and a pink nose on reveal. |
| 7 | | Mushroom | 7×6×7 | 10.0 | Overhanging cap on a thin stem: the "nothing under here" deductions. |
| 8 | | Bonsai | 7×7×5 | 10.7 | Crooked trunk and two foliage pads; asymmetric, so no mirror shortcuts. |
| 9 | | Pine | 5×9×5 | 11.4 | Stacked tiers with a star; long vertical chains. |
| 10 | | Teapot | 9×6×5 | 11.9 | First real hollow: peel to clear the belly. Spout and handle make split rows. |
| 11 | The Lagoon (Lagoon) | Fish | 8×5×3 | 10.3 | Breather; forked tail. |
| 12 | | Sailboat | 8×8×3 | 11.1 | Hollow hull, mainsail and jib on either side of the mast. |
| 13 | | Lighthouse | 5×10×5 | 11.9 | Striped tower; the lamp sits inside the lantern room. |
| 14 | | Turtle | 7×4×8 | 12.2 | A low dome over four feet: lots of "is there a gap under the shell?" |
| 15 | | Life Ring | 8×3×8 | 12.7 | Almost every clue is circled; a ring is a pure test of group logic. |
| 16 | | Mug | 8×6×6 | 13.3 | Coffee inside a hollow wall; 40 circled clues; the opening gives away only 12%. |
| 17 | Ember Steps (Dusk) | Gate | 9×6×2 | 10.6 | Torii; breather into the hard chapters. |
| 18 | | Pagoda | 7×9×7 | 13.1 | Roofs overhang hollow storeys; a golden bell hides in the upper one. |
| 19 | | Arch | 9×7×3 | 13.4 | Curved span with a keystone; few give-aways left. |
| 20 | | Hourglass | 5×8×5 | 13.6 | Four posts around a sand column; peel to see the sand. |
| 21 | | Spiral Stair | 5×9×5 | 15.4 | Steps wind round a pillar with a colour ramp; the longest chain in the chapter. |
| 22 | Starfall (Night) | Snowman | 5×9×5 | 12.1 | Breather; scarf and carrot on reveal. |
| 23 | | Owl | 6×7×4 | 13.7 | Ear tufts, yellow eyes, feet. |
| 24 | | Rocket | 5×10×5 | 14.3 | Fins split the bottom rows; a porthole. |
| 25 | | Ringed Planet | 9×5×9 | 15.1 | A sphere inside a flat ring: the gap between them is the puzzle. |
| 26 | | Observatory | 7×7×7 | 16.4 | Finale. Hollow drum and dome; the telescope leans out of the slit; 44 circled clues. |

Chapter means: 6.9 → 10.6 → 11.9 → 13.2 → 14.3. `npm test` asserts that each chapter's mean beats the one before, and that each chapter ends harder than it starts.

## Data contract for the map

Each `SHAPES` entry has:
- `chapter`: the name of one of the `CHAPTERS`
- `palette`: the name of one of the `PALETTES`

`CHAPTERS` exports `{ name, palette, blurb }` in order. Chapters are contiguous in `SHAPES`.

Legacy ids are kept so saves survive: heart, invader, mushroom, tree, mug, snowman, rocket, torus, arch. The torus is now named "Life Ring".

## Open questions

- The D weights are hand-set. A few real solves timed on a phone would show whether "rounds" or "opening" better predicts how hard a level feels.
- At 200–330 chisels, the bigger levels would benefit from drag-to-chisel along a row. That belongs in `main.js`.
