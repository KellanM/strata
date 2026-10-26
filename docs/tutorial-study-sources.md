# Tutorial study: sources and transferable mechanisms

Date: 2026-10-25. This is the research half of the second tutorial study. The first study is `tutorial-study.md`.

**Problem.** Three first-time players, all about 50, said every lesson screen "felt like a riddle". Even Pillar was hard. Pillar is a 3x3 flat stone with a ghosted shape and no numbers, where the player chisels 2 cubes.

**Verification key.**
- **[V]** I fetched the source and read the claim there.
- **[S]** The claim came only from a search-result summary or snippet.
- **[P]** Provisional: my own recollection, or something I could not check.

Quotes appear only where the fetched text supported them. GameFAQs, StrategyWiki, Giant Bomb and GodIsAGeek all returned 403 errors. As a result, the Picross 3D tutorial order is only partly verified.

---

## 1. Picross 3D (DS, HAL, 2009) and Round 2 (3DS, 2015)

**F1. Basics first, then the circle as a separate, "tougher" set** [V]
- (a) Claim: the demo had "about six levels and a few short tutorials explaining how to play". The first three were basic. The next three were a "tougher tutorial with more advanced rules", which explained that an uncircled number means "the remaining cubes in that row were all consecutive". Source: https://nintendoworldreport.com/hands-on-preview/18805
- (b) In the work: the first set taught break, mark and 0 only. Circles came in a separate set, after several solved puzzles.
- (c) Why it works: the player has already won with the basic rule before meeting a modifier to it.
- (d) For Strata: treat Pillar, Step and Plinth as one opening set that is all about chiselling. No new symbol should appear until the player has finished 2 or 3 stones fluently.

**F2. Many small sample grids, alternating with short explanation** [S]
- (a) Claim: the tutorial teaches the logic over roughly 25 puzzles, in about an hour (Giant Bomb, via search snippet: https://giantbomb.com/reviews/picross-3d-review). An Italian review says it alternates text explanations with practical tests and small sample grids without becoming boring (https://www.everyeye.it/articoli/recensione-picross-3d-11167.html). Round 2's tutorial "took me nearly an hour to play through" [V] (https://purenintendo.com/review-picross-3d-round-2-3ds-eshop/).
- (b) In the work: about 25 puzzles at roughly 2 minutes each, so far more repetitions per concept than Strata's 12.
- (c) Why it works: each idea gets practised several times, not shown once.
- (d) For Strata: give each idea 2 or 3 stones. The first stone for an idea has a card. The second and third have no card and vary the layout. The goal is fluency, not exposure.

**F3. The meaning of every clue fits in one plain sentence** [V]
- (a) Claim, in a reviewer's words: "A circle around a number shows that the blocks needing to be saved are split up into two parts." Source: https://superphillipcentral.com/2010/05/picross-3d-ds-review.html
- (a) Wikipedia: "If a number has a square around it, the cubes will be split up into three or more groups." Source: https://en.wikipedia.org/wiki/Picross_3D
- (c) Why it works: the reviewer kept the rule as a sentence about saving blocks, not as UI vocabulary.
- (d) For Strata: test any card by asking someone to repeat it afterwards. Whatever they say back is the vocabulary to use.

**F4. The audience was explicitly non-gamers** [V]
- (a) Outside Japan, Picross 3D was released under Nintendo's Touch! Generations brand (https://en.wikipedia.org/wiki/Picross_3D). That brand also covered Brain Age, sold to a casual and older audience.
- (d) For Strata: Kellan's 50-year-old testers are the right target audience, not an edge case.

**F5. Do not trap people on a text screen** [V]
- (a) GameRevolution warns that you "cannot return to the previous screen unless you restart the tutorial". Source: https://www.gamerevolution.com/?p=46074
- (d) For Strata: any card must be re-openable, by tapping the stone's "?" or a replay. This matches the Game Accessibility Guidelines' "Allow all narrative and instructions to be replayed".

**F6. Slicer sliders and rotation share the stylus, and players collide them** [S]
- (a) A review notes that reaching to rotate the camera can move a slider by accident (cheapassgamer, via search: https://www.cheapassgamer.com/topic/227881-picross-3d/).
- (d) For Strata: keep the layers slider and the turn gesture spatially apart. Teach them on separate stones, and keep the layers slider hidden until its lesson.

**F7. Order of concepts** [P, not verified]
- My recollection of Picross 3D's lessons: break, then 0 rows, then full rows, then mark, then rotate, then circle, then square, then slicers.
- In this recollection, each lesson uses a narrator text panel before a tiny 1-layer puzzle.
- Treat this as unconfirmed until the DEngel GameFAQs guide or footage is checked. If it is right, Strata's order already broadly matches. The difference is then repetition (F2) and density, not order.

---

## 2. Monument Valley (ustwo, 2014)

**F8. Design for people who aren't "gamers" by cutting the game, not by adding tutorial** [V/S]
- (a) Ken Wong's GDC Europe 2014 talk was titled "Designing Monument Valley: Less Game, More Experience". It was about trading challenging puzzles for an aesthetic journey to reach new audiences (https://gdcvault.com/play/1020878/Designing-Monument-Valley-Less-Game).
- (a) A third-party critical play says "There was not necessarily any onboarding" and players "are expected to complete an 'easy' level on their own" (https://mechanicsofmagic.com/2022/05/26/critical-play-puzzles-54/) [V].
- (b) In the work [P]: the first stage has one obvious thing to touch and one place to go. The world reacts to the first touch. There are no rules to read.
- (c) Why it works: the very first action cannot fail, and the response is a rewarding motion, not a judgment.
- (d) For Strata: Pillar should be the "easy level on your own". Make one cube glow or breathe, so that tapping it is the only plausible thing to do. Let the crumble animation be the explanation, and show text only if nothing happens for about 5 seconds.

---

## 3. Threes! (Sirvo, 2014)

**F9. One word of warmth, one line of instruction that is also the whole control scheme** [V]
- (a) John Teti (AV Club) describes the first screen: the single word "meet", plus "Swipe anywhere to move them". He calls this the game's only action. Source: https://www.avclub.com/the-iphone-hit-threes-gives-you-cuteness-where-you-leas-1798266309
- (a) Vollmer's GDC 2014 talk, "Prime, Teach, Observe", promised to show how to empower players "without patronizing them" (https://gdcvault.com/play/1020512/Prime-Teach-Observe-Tutorializing-Innovative) [S, abstract only].
- (b) In the work: the board is pre-arranged so the very first swipe produces the merge being taught, a 1 plus a 2 making a 3.
- (c) Why it works: the instruction names an action ("swipe anywhere"), not an object. "Anywhere" removes the fear of missing a target. The board is staged so the first action succeeds.
- (d) For Strata: use verb-first cards with no nouns the player has to locate. For Pillar, write "Tap a glowing stone", not "Tap the plain cubes around it". Stage every lesson so the first plausible tap is a correct one.

---

## 4. Super Mario Bros. World 1-1

**F10. The level holds everything needed to "gradually and naturally understand"** [V, via Wikipedia citing Eurogamer 2015]
- (a) Miyamoto designed 1-1 so players "gradually and naturally understand what they're doing". A coin popping from a block will "make [the player] happy" and encourage repeating the action. Source: https://en.wikipedia.org/wiki/World_1-1
- (b) In the work: the first Goomba is slow and costs little progress. The mushroom rolls off a pipe and comes back toward Mario.
- (c) Why it works: the stakes of the first failure are near zero, and the reward is designed to come to you.
- (d) For Strata: Plinth's "Tap one to see what a mistake does" asks a nervous player to fail on purpose. It then mentions losing "gems". Instead, let the first accidental mistake happen naturally and answer it gently, with no cost shown in the lessons.

**F11. Introduce, develop, twist, demonstrate mastery** [V]
- (a) Koichi Hayashida: "First, you have to learn how to use that gameplay mechanic". Then "a slightly more complicated scenario". Then a twist. Finally "you get to demonstrate, finally, what sort of mastery you've gained over it." He also says "it's really important to decide on a core concept". Source: https://www.gamedeveloper.com/design/the-secret-to-i-mario-i-level-design
- (d) For Strata: each concept could be a 3-stone arc. Stone 1 is the trivial case. Stone 2 adds one more row. Stone 3 needs the idea combined with an earlier one, and has no card.

---

## 5. Portal (Valve, 2007): developer commentary

All quotes are from https://theportalwiki.com/wiki/Portal_developer_commentary [V].

**F12. One new concept at a time, confirmed by playtest**
- (a) Chris Chin: "Playtesting revealed that this puzzle introduced too many new concepts at once".
- (a) Kim Swift: "Overwhelmed players tend not to digest new information, so we simplified the puzzle to require only the double fling."
- (d) For Strata, count the concepts on each screen:
  - Plinth: full row, mistakes, ✕, gems, 0 row. That is 4 or 5.
  - Mark: Mark tool, double-tap to mark a row, switching tools, hold-to-mark. That is 4.
  - Split both.

**F13. Players don't notice what you think is obvious**
- (a) Jason Brashill: "playtesters would charge down the stairs without noticing what was creating the portals".
- (a) Jeep Barnett: "without some serious prompting, players will rarely look up."
- (d) For Strata: a hint that names the tool tray, the number, or the "row" assumes the player has noticed it. Point at the thing physically (a pulse or arrow on the actual element) before naming it, or instead of naming it.

**F14. The first concept must be grasped instantly, and Valve found a perceptual shortcut**
- (a) Kim Swift: "It's absolutely critical that players quickly wrap their heads around what a portal is."
- (a) Kim Swift: playtesters "grasped the concept much more quickly when they caught a glimpse of themselves through a portal."
- (d) For Strata: find the "see yourself through the portal" moment for nonograms. One candidate is a cube that visibly belongs to nothing, for example floating apart from the ghost shape, so that removing it is self-evident.

**F15. "Checklisting"**
- (a) Valve breaks new mechanics "into the core components players must understand", always giving "the right incremental step". For the tractor beam, players get "a very clean room to safely experiment with it". Source: https://gameinformer.com/b/features/archive/2010/03/17/thinking-with-portals-making-a-test-chamber [V]
- (d) For Strata: write the checklist explicitly. Example components:
  - a stone can be tapped
  - tapping removes a cube
  - some cubes must stay
  - the ghost shows which ones stay
  - a number counts the ones that stay
  - and so on
  Each item is one stone.

---

## 6. The Witness (Thekla, 2016)

**F16. Rules taught by sequences of panels, no words** [V]
- (a) "The rules are taught to the player throughout the course of the game by the puzzles themselves."
- (a) Blow avoided "over-tutorializing", because explaining immediately "kills epiphany and related things like the joy of discovery". He kept puzzles "as simple as they can be".
- Source: https://en.wikipedia.org/wiki/The_Witness_(2016_video_game)
- (b) In the work [P]: the first panels are a straight line from start to end, then a single turn. Each panel is the smallest possible case of its rule.
- (c) Why it works: a minimal case makes only one reading possible.
- **Caution:** Blow designs for players who enjoy being puzzled. He contrasts himself with Nintendo's "little character telling you every obvious thing" (Edge 2016, via search) [S]. The older-player evidence in F17 says first-timers cannot bootstrap from bare trial and error. Use Witness-style minimal sequences, but add the safety net in F17.

---

## 7. Older and non-gamer players

**F17. Older testers could not start by trial and error, and preferred animated tutorials to written ones** [V, abstract]
- (a) Saari and Hynninen, "Game Development for the Elderly: Experiences from Usability Tests in the Wild" (EasyChair preprint 7448, 2022), a touchscreen puzzle game:
  - The testers "found it difficult to approach the game without instructions".
  - They "were not able to get the game going using only trial and error".
  - They "preferred animated tutorials over detailed written instructions".
  - They "praised pop-up warning messages that appeared when they made mistakes".
  - Individuals had "somewhat different mental models".
- Source: https://easychair.org/publications/preprint/wpXz
- (d) For Strata: the fix is not "fewer words, so they work it out". It is to show rather than tell. A short looping demo, a ghost finger tapping a cube and the cube crumbling, then the player copies it. When the player errs, give a short, kind, specific note.

**F18. Tutorial quality and legibility are the top complaints** [S]
- (a) Zhang, Lyman, Pearce et al., "Integrating AI as Assistive Technology for Older Adult Gamers" (arXiv 2506.07830, 2025). The search summary says the most common challenges were tutorial quality and text legibility. I could not extract the PDF body text to confirm this.

**F19. Accessibility guidance** [V]
- (a) Game Accessibility Guidelines (https://gameaccessibilityguidelines.com/full-list/):
  - "Include interactive tutorials"
  - "Allow players to progress through text prompts at their own pace"
  - "Ensure no essential information (especially instructions) is conveyed by text alone, reinforce with visuals and/or speech"
  - "Use simple clear language"
  - "Include a means of practicing without failure"
  - "Ensure interactive elements / virtual controls are large and well spaced"
  - "Indicate / allow reminder of controls during gameplay"
- (a) Apple HIG minimum hit target of about 44x44 pt [P]: the page would not render, so this figure comes from recollection.
- (d) For Strata:
  - Cubes in lesson stones should render at 44 pt or larger on a 390-pt-wide phone.
  - Card text should be 17 pt or larger.
  - No timed dismissals.
  - Lessons should not cost anything when the player makes a mistake.

**F20. Hands-on, with repetition** [S, practitioner blog]
- (a) Digital Scientists, from studies with 30 participants aged 65+: "keep your copy large, concise and easy to scan", and use a hands-on approach "with repetition". Source: https://digitalscientists.com/blog/onboarding-elderly-users-5-quick-tips/
- This is weak evidence, but it is consistent with F2 and F17.

---

## 8. Gaps

These sources were not reached or not verified:
- Picross 3D's exact lesson list and its first-puzzle layouts
- Picross S/e opening puzzles
- Nonogram.com onboarding
- Two Dots, Mini Metro and Hexcells writeups
- Baba Is You
- Ustwo's own first-level description
- The Iwata Asks pages for Brain Age

One fact did surface: Picross 3D shipped as Touch! Generations, the same brand as Brain Age. The next steps are to watch Picross 3D tutorial footage and to play Nonogram.com's first 3 minutes.

---

## Synthesis: mechanisms ranked by likely impact on "every screen felt like a riddle"

1. **Show, then let them copy, before any sentence.** (F17, F9, F8, F19)
   - On first contact, play a short ghost-finger demo on the real stone: a finger taps, the cube crumbles. Then hand over control.
   - Text appears only if the player hasn't acted after a few seconds.
   - Older first-timers can't bootstrap from nothing (F17), but reading first turns each screen into a riddle.
2. **One concept per stone, counted honestly.** (F12, F11, F15)
   - Write a Valve-style checklist and give each item its own stone.
   - Plinth (full row, mistake, ✕, gems, 0) and Mark (tool, row-mark, switch, hold) carry about 4 concepts each. Each should become 2 to 4 stones.
3. **Stage the first action so it cannot be wrong.** (F9, F10, F8)
   - Every lesson's most obvious tap should be correct.
   - The first mistake should arrive by accident, never on request, and be met with a kind note and no visible cost.
4. **Point physically before naming.** (F13)
   - Pulse the actual cube, number or tool, and avoid naming things the player hasn't noticed: "row", "Mark below", "the 0", "column".
   - Player-facing nouns should be ones they can see, like "glowing stone" or "this number" with an arrow.
5. **Repeat each idea 2 or 3 times without a card.** (F2, F11, F20)
   - The "aha" sticks through the second and third stones, not the first.
   - Picross 3D spends about an hour on roughly 25 puzzles. Strata's 12 single-shot lessons are thin by comparison.
6. **Make the first concept perceptually obvious.** (F14, F16)
   - Pillar should need zero reading. Separate the 2 removable cubes visually: different material, slightly proud of the stone, a hairline gap, or a stronger ghost contrast. Removing them should be self-evident.
7. **Plain sentences from the player's own vocabulary.** (F3, F9)
   - Use verbs first, one clause, everyday words.
   - Test each card by asking a tester to say it back.
8. **No traps, no costs, legible.** (F5, F19)
   - Cards can be replayed and advance at the player's pace.
   - Use 17 pt or larger text and 44 pt or larger targets.
   - No gems are lost in lessons.
9. **Don't introduce modifiers until the base rule is fluent.** (F1)
   - Hold circles and squares until several plain-number stones have been solved without help.

### Anti-patterns visible in the current lesson text (`public/js/shapes.js` TUTORIAL)

- **Explaining before doing.** Every first card is shown before the player has acted (`until: 'break'`), so the player must read before touching.
- **Abstract or invented vocabulary.**
  - "plain cubes": plain compared to what? The ghost is the only distinction, and it is faint.
  - "belong to the shape", "chisel", "clue is hidden", "groups".
- **Multiple concepts per screen.**
  - Plinth: card 2 holds ✕, belonging, gems and a 0 row.
  - Mark: tool switching, double-tap and hold spread over four cards on one stone.
- **Requested failure.** "Tap one to see what a mistake does" asks a cautious adult to do the wrong thing on purpose, then names a cost: "Mistakes cost gems".
- **Naming UI the player hasn't found.** "Pick Mark below", "double-tap the 4", "Numbers above the stone", "the middle column".
- **Rule statements with no worked instance.** Arch and Colonnade are a single card ("A circle means the row's cubes split into two groups…") with `until: 'solved'`. The abstract rule stays on screen through the whole puzzle and is never shown happening.
- **Counting instead of seeing in lesson 2.** Step's first card asks the player to relate a number to an unseen set ("how many of its cubes belong") while they are still learning what "belong" means.
