# Tutorial study (2026-10-25)

**Brief:** three first-time players, all about 50, said every lesson screen "felt like a riddle", and the first stone (Pillar) was hard. The goal is a lesson flow that a non-gamer of 50+ gets through without feeling tested. Kellan's own words.

**Evidence:**
- Sources and findings F1–F20 are in [tutorial-study-sources.md](tutorial-study-sources.md).
- The baseline is every lesson's first screen as a newcomer meets it: `shots/lessons/01..12.png` and `sheet.png`, captured by `shots/lessons-baseline.mjs`.

## Fixed (not changing)

These stay as they are:
- the 3D block, chisel and mark, and the numbers on its faces;
- the calm tone and the skies;
- Learn on the map, with a long press to pick one lesson;
- the one-time reminders that already appear in levels (main.js `REMINDERS`): circle, square, blank face.

## What the baseline shows (my reading, not tested with players)

**1. Every first card is a rule, read before the player has done anything.** The action is in the second clause, if there is one.
- Threes opens on a single verb: "Swipe anywhere" (F9).
- Older testers "were not able to get the game going using only trial and error" and "preferred animated tutorials over detailed written instructions" (F17).

**2. Pillar asks you to work out a riddle before you have tapped anything.**
- "A shape is hidden" contradicts what you see: the shape is plainly shown.
- The two cubes to chisel are the pale, glowing ones. Glowing usually marks the special thing, not the "plain" one.
- Portal's lesson applies: the first idea must be grasped at a glance (F14).

**3. Too many concepts on one stone.** Portal cut puzzles back after playtests showed "too many new concepts at once" (F12).
- Plinth has 4–5: a full row, a mistake on purpose, ✕, gems, and a 0 row.
- Wall has 4: the Mark tool, double-tap to mark a row, switching tools, and hold to mark.

**4. Each idea is shown once, never practised.** Picross 3D teaches over about 25 small puzzles in about an hour (F2). Its designer's pattern is to learn the idea, then meet a slightly harder case, then a twist, then show mastery (F11).

**5. The modifiers come too early.** Circle, square and blank-face lessons come before plain numbers are fluent. Picross 3D held circles back for a separate, harder set (F1).

**6. Legibility and pressure.**
- The coach text is 15 px in a soft ink.
- A clock runs during lessons.
- Twelve progress dots signal a long road ahead.
- Plinth mentions "Mistakes cost gems".

**7. Lesson 10 opens on an empty card** with only "Skip" in it: its first hint has no text.

## Proposal: "do it, then name it", one idea per stone, repeated

### Mechanisms adopted

- **A ghost finger demonstrates, the player copies.** A soft hand taps the real cube and the cube crumbles; then it waits for the player. The card appears only after about 5 s of nothing (F17, F8, F9).
- **The first plausible tap is always right** (F9, F10).
- **Point before naming.** Highlight the number and its row before any sentence mentions them (F13).
- **Two or three stones per idea.** The first has a card, the next have none (F2, F11).
- **No mistake is ever requested, and none costs anything in a lesson.** When one happens naturally, a kind line says why the cube stays (F10, F17).
- **Plain verbs:** "Tap", "Clear", "Keep". The test for every card is whether a tester can say it back (F3).
- **Text and stakes:**
  - coach text 18 px in full ink;
  - no clock during lessons;
  - progress as a few dots for this lesson only, not 12 (F19).

### The new first run: 8 small stones, about 6 minutes

Each idea is a short arc. **New** marks the first stone of an idea, **again** a stone with no card.

| # | Idea | Stone | Card (shown only if the player stalls, except where marked) |
|---|---|---|---|
| 1 | **Tap to chisel** (new) | A 3×1 row of rough grey rock with a coloured cube in the middle. The rock is visibly not the object: a different material, slightly apart. The ghost finger taps one grey cube. | "Tap the grey rock." |
| 2 | Tap to chisel (again) | A small figure (an L or a T) wrapped in grey rock: tap until only the figure is left. No ghost of the shape is needed, because the materials differ. | none |
| 3 | **0 means clear the row** (new) | 3×2: the top row is 0. The number and the row light together, then the ghost finger taps each cube of the row. | "0: nothing in this row stays. Clear it." |
| 4 | 0 again, plus **the shortcut** | 3×3 with two 0 rows. After the player clears one row cube by cube, a card appears once. | "Tip: double-tap a 0 to clear its whole row." |
| 5 | **A full row stays** (new) | 3×3: rows reading 0, 3, 0. If the player taps a cube in the 3 row, the ✕ shows with a kind line. | "3 of 3: every cube here stays." If they tap one: "That one stays. The 3 says so." |
| 6 | **Two directions meet** (new) | The current Rune: rows across and columns down. The first real deduction. | "Numbers on top count straight down." |
| 7 | **Turn the stone** (new) | The current Cornerstone. | "Drag to turn the stone." (shown at once) |
| 8 | **On your own** | The current Dolmen, with the glow hint as now. | "A whole stone. If you're stuck, wait, and a row will glow." |

### Moved out of the first run, taught the moment they first matter

These use the existing REMINDERS mechanism (a one-time card in a real level):
- **Mark tool:** taught in the first level where a full row appears, as one line: "Hold a cube to mark it as staying."
- **Circle and square:** already have reminders. These gain a ghost-finger demo over a 1-row example.
- **Blank face:** already has a reminder.
- **Depth (rows running back) and peeling:** taught in the first level whose shape needs them. Peeling is taught on its first 3×3×3 stone with the handle pulsing.

All twelve current lessons stay replayable from Learn's list.

### Cost and risks

**Cost:**
- the ghost finger: a small overlay that animates to a projected cube position, about half a day;
- new lesson stones in shapes.js;
- `until` events for the shortcut tip;
- more uses of REMINDERS.

**Risks:**
- Teaching depth and peel just in time may surprise players at the level where they first appear.
- Picross 3D's exact lesson order is unverified (F7).

**Review method:**
1. Kellan's same three testers play the first 8 stones cold, with nobody explaining anything.
2. Note every pause longer than 5 s, and every "what do I do?".
3. After each stone, ask them to say in their own words what a 0 means and what a 3 means.

## Open questions

- Should circles and squares become lessons 9 and 10 at the end of the first run, or appear only at first use?
- The rock-and-object split in stones 1–2 is a new visual. It needs a styleframe before it is built.

## Iteration 1 (2026-10-25): built behind `?lessons=new`

Kellan approved iterating on the tutorial; it ships after the store build. Turn the new run on with `?lessons=new`, which is remembered; `?lessons=old` switches back.

What was built:
- **The run:** `shapes.js TUTORIAL_V2`, 8 stones: Gem, Pillar, Step, Ledge, Plinth, Rune, Cornerstone, Dolmen.
- **Learn's long press** lists those 8, then the old Mark, Arch, Colonnade, Cairn, Stair and Geode (`LESSON_EXTRAS`).
- **The ghost finger** (`main.js showFinger`) can tap, double-tap on a chosen face, or drag. It appears after 0.9 s of stillness, steps back once the player acts, and returns after 5 s idle.
- **A hint's `mistake`** answers a slip kindly, until the next chisel.
- **No clock during lessons.** Coach text is 18 px in full ink.
- **Two new level reminders, in the new run only:** peeling (the first stone with an inside) and marking (the first full row).
- **Lessons 1–2 use `ghost: 1`.** The shape shows in full colour and the stone around it stays plain white, so what to remove is visible at a glance. In the old Pillar the ghost was partial and the removable cubes glowed.

What I checked, in the browser only (no player has tried it yet):
- all 8 stones play with no page errors;
- the finger lands on the 0's face in Step and Ledge;
- a slip on Plinth shows "That cube stays: its row says 3, so all 3 belong.";
- the old run is unchanged by default.

Evidence: `shots/lessons-v2/sheet.png`; the top row is with the finger, the bottom row after a pause.

**Next:** the same three testers play it cold (see the review method above).

## Iteration 2 (2026-10-25): every stone uncovers a thing you can name

**Feedback on iteration 1 (Kellan, from the same testers):**
- It was still a little difficult.
- Circles and squares weren't landing.
- The names (Pillar, Plinth, Rune, Dolmen) confused people.
- The abstract forms asked them to imagine what they were looking at.

Kellan wants each small stone to end on a simple, delightful object as its reward.

**What changed:**
- **Every lesson hides an everyday thing,** named on its reveal:
  1. Heart: tap away the plain stone.
  2. Goldfish: the same again.
  3. Present: a 0 row.
  4. Cake: double-tap a 0.
  5. Mushroom: numbers on top; a full column picks the one cube in each row.
  6. Cherries: the circle.
  7. Crown: the square.
  8. Little Car: the circle again, with no picture showing.
  9. Sofa: turning, plus a circled 2 between its arms.
  10. Table: on your own; the old Dolmen's shape, now in wood.
- **Circles and squares are back in the first run,** taught on gaps you can see.
  - The cherries are two pieces with a gap.
  - The crown's points are three pieces with gaps.
  - The car's wheels are the circle again, with the picture hidden.
  - The finger taps the gap.
  - The level reminders now point back to the lessons: "like the two cherries" and "like the points of the crown".
- **What a number is, said outright** (Kellan: "I don't think we explicitly state this"). The Present lesson now opens with "Each number counts the cubes that stay in its row. 0: none stay, so tap them away." It shows at once, not after a pause, while the picture shows through, so a 3 can be checked against 3 coloured cubes. A slip there gets "That row says 3: count its coloured cubes. All 3 stay."
- **Plain words:** "white stone", "knock it away", "the coloured part", "pieces", "gap". The words "shape" and "belongs" are gone.
- **The reveal is the reward:**
  - Flat pictures now land almost face-on (`win()` pose), so a heart reads as a heart instead of a block seen at 45°.
  - More confetti: 7 bursts, up from 4.
- **Fixes:** the ghost finger no longer lingers over a solved stone. The lesson tests (`puzzle.test.js` and `uniqueness.test.js`) now cover the new run.
- **Learn's extras** are now Wall, Cairn, Stair and Geode. Arch and Colonnade are replaced by Cherries and Crown.

Evidence: `shots/lessons-v3/reveals.png` (the ten objects) and `play-b.png` (each stone after a pause). Checked in the browser only; no tester has played this version yet.
