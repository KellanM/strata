# Copy study: Nintendo's teaching voice, accessible game copy, and Strata's words (2026-10-29)

## Brief

Kellan: "run a creative study on how nintendo words tutorials / instructions and the rules they use for accessible game copy and see how our own copy stacks up against it."

Fixed constraints:
- **The lessons' order and structure stay.** Their wording was tuned against real confusion (`ftue-study.md`, `tutorial-study.md`), so this study changes words, not the teaching.
- **Strata's voice stays calm.** It has no mascot, no exclamation marks and no praise lines; a solve names the object.
- **Players:** casual players on phones, including older adults and non-native English readers.

What this study covers:
- Lesson lines and the lines shown after a slip.
- Coach cards in levels.
- The Rules page.
- Offers, pause, result, map and Finds labels.

Criteria for "good":
1. A first-time player can act on the line without reading anything else.
2. Each thing in the game has one name.
3. Nothing in an instruction needs an idiom, a symbol or a negative to be understood.
4. The words fit the card at 375 px in two lines.

Sources (full notes in `copy-study-sources.md`):
- **Nintendo's games, transcribed from footage:**
  - Picross 3D: Round 2 (`SFx5hix_ePA`) and Picross 3D DS (`ei5s8lSKLY0`).
  - Picross S4 and S5 (`ZfNQtZ-Dl8U`, `aeUNgQmFoF0`).
  - Brain Training for Switch (`qT_R_jygO10`) and Brain Age DS (`KupNZ8AGPRs`).
  - Yamamura's Dojo (`sK5ZE0ra0vs`).
- **What Nintendo's people have said:** Iwata Asks (all 898 English pages searched) and Sakurai's channel.
- **Accessibility rules:**
  - The Game Accessibility Guidelines and the Xbox Accessibility Guidelines (XAG 101, 109, 114).
  - Apple's Human Interface Guidelines (Writing, Inclusion, Accessibility, VoiceOver).
  - W3C's cognitive-accessibility guidance (COGA) and GOV.UK's writing guide.
  - Microsoft's global-writing tips and Mailchimp's accessibility guide.
  - Andersen et al., CHI 2012.

Limits:
- **Picross S:** the original game's tutorial wasn't in the footage, so S4 and S5 stand in (same developer, same format).
- **Not sampled:** Wii Sports, Wii Fit and Big Brain Academy.
- **No published numbers:** no Nintendo, Treehouse or GDC source gives a sentence length or reading level for tutorials.
- **Not fetched:** the AbleGamers and GDC material.
- **No player testing:** every judgement below about Strata is mine.

## Baseline: Strata's words today

- **Lessons:** 31 lines across 11 lessons and 3 extras, 49 sentences. That's 8.1 words per sentence on average (18 at most) and 12.8 words per card.
- **Reading level:** Flesch reading ease is about 99, which is very easy. Reading level is not the problem.
- **The problem is naming.** Today's words, by thing:

| Thing | Today's words for it |
|---|---|
| The block you solve | stone (map, Rules, L11 "A whole stone") |
| One unit of it | cube; **also** "the white stone" (L1, L2) |
| What's left at the end | object (Rules, Finds, result), picture (lesson slip lines), coloured part (L1, L2), shape (title: "find the shape") |
| Taking a cube away | chisel (the tool, Rules), tap away, knock away, clear, lift off |
| Groups in a row | pieces (lessons), groups (Rules) |
| A mistake | slip (Rules, ✕, offers); never named in the lessons |
| The reward | gems (map, offers), ◆ as a word ("keeps all three ◆") |
| A line of cubes | row (lessons, Rules: "across, down or back"); column (L5 and its slip line) |

## What Nintendo does, and how Strata compares

Evidence is: (Q) a quote from someone at Nintendo, or (O) a line observed on screen, with the video and timestamp.

| # | Pattern | Evidence | Strata |
|---|---|---|---|
| N1 | **Text is the last resort; the screen teaches.** | Q: Iwata, "When you resolve an issue by using text messages ... it is somehow an admission of defeat!" (Iwata Asks, *Super Mario Galaxy*). Sakurai: "The worst thing you can do is make players read long paragraphs like an instruction manual." | **Matches.** One line per card, with the hinted cubes glowing. |
| N2 | **Point with the screen, then say "this".** | O: Picross S4, "Let's start here." (01:25), with the line highlighted. Round 2: "[0] This tells us that there are no colored cubes at all in this row." (06:31) | **Mostly.** "That row says 5", "That cube…". L3's "its row" is vaguer. |
| N3 | **One point per box; split rather than lengthen.** | O: Round 2 splits one thought over two boxes (04:37–04:41). | **Mixed.** L3, L11 and Extra 1's third line each carry two points. |
| N4 | **The rule, then the one action it allows.** | O: "That means that all of the cubes in this row can be removed!", then "Give that a try…" (Round 2, 06:33–06:44) | **Matches.** "…with a gap between. Tap the gap." |
| N5 | **Short praise, then quiet; a solve names what was found.** | O: "Well done! You've solved this puzzle and found a bottle of perfume." (Round 2, 07:56). Q: Brain Age's Ito: Dr. Kawashima says "Very good!" then "suddenly holds back". | **Matches the naming, not the praise.** "You uncovered Cat." Strata's silence is a voice choice; keep it. |
| N6 | **Mistakes are named once, neutrally, and softened.** | O: "Accidentally removing a cube that's part of a puzzle's hidden shape counts as a strike." (Round 2, 08:06). "Strikes don't matter in these practice puzzles…" (3D DS, 06:57). No teaching box says "wrong", "fail" or "error". | **Half.** Slip lines are neutral and say why ("…so it stays"), but the word "slip" first appears on the Rules page and in the ✕. A player meets the ✕ unnamed. |
| N7 | **A new symbol by contrast, then a one-line recap.** | O: "…but that isn't how circle numbers work!" (Round 2, 16:05), then "Normal numbers mean cubes are connected, circle numbers mean cubes are in two groups, and square numbers mean cubes are in three or more groups." (18:42) | **Missing the recap.** Circle (L6) and square (L7) are taught; nothing ties plain, circled and squared together until the Rules page. |
| N8 | **Read the clue aloud as a sentence, in the game's own nouns.** | O: "This [3 1] line has 3 connected squares and 1 isolated square." (S4, 01:44) | **Mostly.** "That row says 3, so all 3 stay." L3's "0: none stay" is telegraphic shorthand, not a sentence. |
| N9 | **Controls are a verb plus a thing.** | O: "touch your stylus to the lower screen and then slide it" (Round 2). "Detach the Joy-Con (R)." (Brain Training) | **Matches**, including mouse versions ("double-click", "right-click"). "Pick Mark below" points to a place rather than naming the thing. |
| N10 | **Emphasis on a few words, or none.** | O: Round 2 colours the action phrase; Picross S uses no emphasis. | **None.** Fine, as in Picross S. |
| N11 | **Reading comfort is offered.** | O: "There are two font sizes available. Feel free to pick the one you like." (Brain Age DS, 09:47). Picross S has "Read Again". | **Missing.** There's no text-size choice. The small capitals labels are 10.5–11 px, at or under Apple's 11 pt minimum. Rules is always available, which helps. |

## Accessibility rules, scored

The full checklist, with sources, is in `copy-study-sources.md` (part 2). Strata against each rule:

| Rule (source) | Strata |
|---|---|
| Short sentences, one point each (COGA; GOV.UK: split sentences over 25 words) | **Pass.** 8 words per sentence; the longest is 18. A few cards carry two points (N3). |
| Plain reading level, lower secondary at most (XAG 114) | **Pass.** About 99 on the Flesch scale. |
| Common words (COGA, GOV.UK) | **Pass.** |
| **One term per thing** (Microsoft: "Use one word for a concept"; Apple: "Create a list of common terms") | **Fail.** See the baseline table. |
| No invented words without a nearby explanation (COGA) | **Fail for "slip".** Pass for "Finds", which is a place you open. |
| Literal: no idioms or metaphors in instructions (COGA, Microsoft) | **Mostly pass.** "A clean stone keeps all three ◆" and "Sure a cube stays?" fail. Poetic chapter lines are titles, not instructions, which COGA allows. |
| Say what to do, not what not to do; avoid "can't" (GOV.UK) | **Three fails:** "can't be chiselled" in Extra 1, the level coach card and the Rules page. |
| Name the gesture the player makes (Apple) | **Pass.** It also switches to mouse words with a mouse. |
| Instructions not by text alone (Game Accessibility Guidelines) | **Pass.** Hinted cubes glow. |
| Player-paced text (Game Accessibility Guidelines) | **Mostly pass.** Coach cards wait for the action. The chapter title card leaves after about 2.9 s, though a tap dismisses it sooner. |
| Readable size; enlarge by at least 200 percent (Apple) | **Weak.** No text-size setting, and the labels sit at the floor. |
| Icons labelled for VoiceOver (Apple) | **Pass** for buttons (menu, take-back, rings, tools). |
| Offers say what you get, and symbols aren't words (App Store 3.1.2) | **Fail on wording:** "keeps all three ◆". In v1 there are no ads, so this is wording only. |

## Proposals (ranked)

R = rewrite, ready to apply. T = test first. Rewrites were rendered in the real lesson card at 375 px (`copy-frames/rewrites-in-card.png`, `-2.png`).

**C1 R. One glossary, applied everywhere.** The glossary:

| Word | Means |
|---|---|
| stone | the whole block, a level |
| cube | one unit |
| object | what's found |
| chisel | take a cube away; the gesture is "tap" |
| mark | protect a cube; the gesture is "hold" |
| slip | a mistake |
| gem | the reward |
| piece | a group of touching cubes in a row |
| row | any line of cubes, with "column" kept for straight down where it helps |

- **Benefit:** Microsoft's "one word per concept"; Nintendo's clue sentences use the game's own nouns.
- **Cost:** about 12 strings.
- **Tradeoff:** lessons lose "picture" and "coloured part", the most concrete words for a first-time player. In L1, "The coloured cubes stay." keeps that colour cue.
- **Review:** the opening playtest (`playtest-opening.md`). Watch whether lesson 1 still reads at once.

| Where | Today | Proposed |
|---|---|---|
| L1 | Tap the white stone to knock it away. The coloured part stays. | Tap a white cube to chisel it away. The coloured cubes stay. |
| L1 slip | That cube is part of the picture, so it stays. Tap the white stone. | That cube is part of the object, so it stays. That's a slip. |
| L2 | Knock away the white stone. Keep the coloured part. | Chisel away the white cubes. Keep the coloured ones. |
| L2, L6, L7, L10 slip | …part of the picture / one of the (two) pieces… | (L2) That cube is part of the object, so it stays. Pieces lines unchanged. |
| L3 | Each number counts the cubes that stay in its row. 0: none stay, so tap them away. | Each number counts the cubes that stay in its row. A 0 means none stay. Chisel them all. |
| L5 | …0: none stay, so tap that column away. | …A 0 means none stay. Chisel that column. |
| L6 | A circle round a number means two pieces, with a gap between. Tap the gap. | A circled number means two pieces, with a gap between. Chisel the gap. |
| L7 | A square round a number means three pieces or more… Tap the gaps. | A squared number means three pieces or more… Chisel the gaps. |
| Rules | 3 (circled): they're split into two groups. 4 (squared): three groups or more. | 3 (circled): two pieces, with a gap between. 4 (squared): three pieces or more. |
| Title | Peel the stone · find the shape | Leave as is: a tagline, not an instruction. Or "find the object". Kellan's call. |

**C2 R. Name the slip once, at the first slip.**
- **Change:** L1's slip line ends "That's a slip." (Nintendo: "counts as a strike").
- **Benefit:** the ✕, the take-back offer and the Rules page then use a word the player has already met.
- **Cost:** one string; fits in two lines.

**C3 R. A one-line recap of the three number kinds.**
- **Change:** "Plain: one piece. Circled: two. Squared: three or more." Show it as the first card of L8, which already practises the circled 2, or at the end of L7. It fits in two lines.
- **Benefit:** Nintendo's contrast-then-recap (Round 2, 18:42).
- **Cost:** one hint step in `shapes.js`.

**C4 R. No "can't" in instructions.**

| Where | Today | Proposed |
|---|---|---|
| Level coach card | Sure a cube stays? Hold it to mark it, and it can't be chiselled by mistake. | Know a cube stays? Hold it to mark it. A marked cube is safe from the chisel. |
| Extra 1 | Marked cubes can't be chiselled. Now switch back to Chisel… | Marked cubes are safe from the chisel. Now switch back to Chisel… |
| Rules | Hold: mark it: a marked cube can't be chiselled | Hold: mark it, so it's safe from the chisel |

This also replaces the elided "Sure a cube stays?".

**C5 R. Offers in words, not symbols.**
- **Change:** "a clean stone keeps all three ◆" becomes "with no slips, a stone keeps all three gems".
- **Cost:** one string. In v1 it shows only after 5 take-backs in a day ("that's all for today"), so it's rarely seen; it's ready for when ads arrive.

**C6 T. One point per card.**
- **Change:** split L3 ("Each number counts…" / "A 0 means none stay…"), L11 ("A whole stone, on your own." / "If you're stuck, wait…") and Extra 1's third line into two steps each (Nintendo N3).
- **Cost:** each split is a new hint step with its own trigger, and lesson pacing is tuned.
- **Review:** test it in the opening playtest before keeping it.

**C7 T. Reading comfort.**
- **Change:** a "Larger text" toggle under Settings, scaling the coach card, Rules and labels by about 1.3. Separately, raise the capitals labels from 10.5–11 px to 12 px (`experience-study.md` H9, the type floor).
- **Benefit:** Brain Age's two font sizes (N11), and Apple's 11 pt minimum and 200 percent enlargement.
- **Cost:** medium. Every card and label must still fit at 375 px when larger.

**C8 T. The chapter title card waits for the player.**
- **Change:** keep the card until a tap, or hold it longer than about 2.9 s, for slower readers (Game Accessibility Guidelines: "dismiss information on a player action").
- **Tradeoff:** a card that waits for a tap interrupts a calm flow. Test a longer hold first.

Not adopted:
- **Praise lines ("Well done!", "Perfect!").** Strata already names the object, which is the half of N5 that fits a calm game.
- **Exclamation marks and coloured key words.** They don't suit Strata's voice. Picross S also does without.
- **A replayable "Read again" in levels.** Rules and the Learn stone already cover it.

## Experiment

The rewrites for C1–C5 were rendered in the real lesson card at 375 × 667, against today's lines (`copy-frames/`).

**Kept as drafted:**
- L1 and L3 read more plainly at the same length.
- L6's line breaks are unchanged.
- The mark card is no longer than today's and drops the negative.

**Worse at first, then fixed:**
- A three-sentence slip line ("…That's a slip. Tap a white cube.") left "cube." alone on a third line. Dropping "Tap a white cube." fixed it, since the glow already shows where to tap.
- The recap, first drafted with "one piece … two pieces … three or more", also ran to three lines. The shorter "Plain: one piece. Circled: two. Squared: three or more." fits in two.

**Dropped:** L11's rewrite ("If you're stuck, wait.") was no clearer than "Stuck? Wait a moment…" at the same length. It's left out of C1 and only appears in C6.

**Not tested:** no player has read the rewrites yet. Whether "chisel" is as immediately clear as "tap away" for a first-time player is the open question. It's the tool's own name and the Rules page's word, but it's less everyday.

## Open questions

- **"Chisel" or "tap away" in lesson 1?** A playtest should decide; `playtest-opening.md` already plans lesson observation.
- **The title's "find the shape".** It's poetic, but it's a fourth word for the object. Kellan's call.
- **"Row" for every direction, or "column" for straight down?** The Rules page and coach card say "row: across, down or back", while L5 says "column". It's a small inconsistency, and either choice is defensible.
