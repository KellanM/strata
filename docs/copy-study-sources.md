# Copy study: sources

Research notes behind `copy-study.md`, kept as gathered on 2026-10-29. Part 1 transcribes Nintendo's tutorial text from footage (Windows OCR on cropped frames, checked by eye) and collects practitioner quotes from Iwata Asks and Sakurai. Part 2 collects the accessibility-writing rules. In both, quotes are exact and kept apart from interpretation; anything unverified is marked.

---

## How Nintendo words tutorials and instructions: notes for Strata

Date: 2026-10-29. Working folder: `%TEMP%\strata-copy\` (downloads in `dl\`, frames in `frames\`, OCR in `ocr\`, web pages in `web\`, scripts in `scripts\`). Nothing was written to the repo.

**Method.** I downloaded YouTube footage with yt-dlp and cropped each game's text box at 1 frame per second with ffmpeg. I ran Windows' built-in OCR (Windows.Media.Ocr) over every frame. A script then kept only the last frame of each box, which is the fully typed text. For styling (colour, glyphs, caps), I checked the frames by eye: `frames\p3d2_sel.jpg`, `p3dds_sel.jpg`, `ps4_sel.jpg`, plus the contact sheets. For the practitioner side, I crawled all 898 English Iwata Asks pages from iwataasks.nintendo.com into `web\ia\` and grepped them. Sakurai's English lines come from OCR of the official subtitles burned into his videos.

**Key.**
- **(a) Said**: a practitioner quote, with its URL.
- **(b) Observed**: an on-screen line, with the video id and timestamp (mm:ss in that video).
- **(c) Interpretation**: my reading.
- **[V]** means I fetched the source and read it. **[S]** means search snippet only. **[U]** means unverified.

**OCR caveat.** Windows OCR scrambles word order where a word is in a different colour. Lines marked "reconstructed" were re-ordered by checking the frame. Everything else is the OCR text with obvious letter errors fixed (for example "cirde" to "circle", "0K" to "OK").

---

## Part B: Observed on-screen text

### B1. Picross 3D: Round 2 (3DS, HAL, 2015). Video `SFx5hix_ePA` ("Picross 3D Round 2! Tutorial", Fuzzy Gamer)

**How each box is built.** Every box sits on a dark-green chalkboard on the lower screen.
- A small chalk/pencil icon in the corner means "more to come". A "Give it a try!" pill appears when the player must act.
- Each box holds 1 to 3 short sentences, typed out letter by letter. Long explanations are split across several boxes, often mid-sentence with "..." (for example 11:12 to 11:14).
- **Colour.** Action phrases and key terms are in orange-red: "hold down", "tap the cube you want to remove", "lighter", "Accidentally removing a cube that's part of a puzzle's hidden shape", "strike", "Flagging", "add, remove" (frames at 06:44, 07:21, 08:07, 25:31).
- **Glyphs.** Button and tool icons sit inline in the sentence: ✚ / Ⓧ for the D-pad and X button, plus a hammer icon and a paint-can icon. Number examples appear as the actual coloured number tile: "(ex: [2], [4])".

Transcribed lines (video timestamp, then text):

- 04:00 "If you're able to solve them, you'll discover the shapes hidden away inside!"
- 04:03 "Is this your first time playing a game in the Picross 3D series? If so, I recommend starting with the first [icon] book, Puzzle Basics, Vol. 1."
- 04:27 "Looks pretty...difficult...right?" / 04:30 "But the truth is, these puzzles are actually quite easy to enjoy!"
- 04:33 "You see, you use these colored numbers as clues." / 04:37 "They help you figure out which cubes to remove..." / 04:41 "and which ones to mark with orange and blue paint."
- 04:55 "As you continue to remove and mark cubes...the shape hidden in the block gradually appears. This one's a cute little cat!"
- 05:21 "Each blue number (ex: [2], [4]) tells you how many blue cubes ([cube]) are present in that row or column of cubes."
- 05:43 "The easiest way to learn this game's controls is to solve a simple puzzle...so let's do one together!"
- 05:58 "To rotate a block, simply touch your stylus to the lower screen and then slide it in the direction you want the block to turn." This is followed by "Try doing that now, and check out this block's numbers." / 06:08 "Well done!"
- 06:17 "[2] This tells us that there are two connected orange cubes hidden in this column." / 06:23 "As you can see on the lower screen, those two cubes could be in a few different places..." / 06:26 "We don't have enough info yet to know where exactly they're hiding," / 06:28 "so let's leave this column alone for now and take a look at a different number."
- 06:31 "[0] This tells us that there are no colored cubes at all in this row." / 06:33 "That means that all of the cubes in this row can be removed!"
- 06:44 "To remove a cube, hold down ✚ or Ⓧ to select the hammer ([hammer]) and then tap the cube you want to remove. Give that a try on the cubes that're glowing on the lower screen." [frame-checked]
- 06:47 "That's it! Pretty easy, right?"
- 07:16 "Remember how we marked a whole column of cubes in this block because we were certain those cubes were blue?" / 07:18 "One of those marked cubes is in this row—it's got to be the one this number is telling us about!" / 07:21 "And the game knows it, too. See how this number is lighter than the rest?"
- 07:29 "Now that we know we don't need the unmarked cubes in this row, could you please remove them for me?" / 07:31 "Fantastic! We're almost done."
- 07:56 "Well done! You've solved this puzzle and found a bottle of perfume."
- 08:01 "To review, solving puzzles is all about using numbers to find cubes that you can remove and mark. If you look carefully, you will find that there are always cubes you can be sure of."
- **Mistakes**, introduced *after* the first success:
  - 08:06 "Accidentally removing a cube that's part of a puzzle's hidden shape counts as a strike."
  - 08:10 "Marking a cube with the wrong color of paint counts as a strike as well."
  - 08:13 "You should do your best to avoid getting strikes, so plan your moves carefully, OK?"
- 08:16 "Now then, I've prepared three practice puzzles for you. Please give them a try!"
- Practice-puzzle card, 08:26 (frame-checked): "Remove the cubes in the [0] row and [0] column with [hammer], and then mark the rest with [paint]." Card 09:14: "Mark the blue cubes with [blue paint] and the orange cubes with [orange paint]. Be sure to destroy the rest!"
- **Introducing a symbol** (circle):
  - 14:26 "In this tutorial, we'll be learning about circle numbers." / 14:30 "They're a bit different from the normal numbers that we've been looking at so far."
  - 14:33 "Luckily, they're really easy to identify—just like the name suggests, they're enclosed in a circle, like this one here."
  - 14:39 "When you see a normal number, it means that the cubes you're looking for are all connected." / 14:41 "Here, for example, you're on the hunt for four connected blue cubes."
  - 14:49 "On the other hand, when you see a circle number, it means that the cubes you're looking for are divided into two groups."
  - 15:02 lists the cases: "A: one cube, three cubes / B: two cubes, two cubes / C: three cubes, one cube".
- Contrast, then refutation: 16:05 "As you can see below, if we go with possibility A, all three cubes will be connected...but that isn't how circle numbers work!" / 16:09 "When you see a circle number, you know that your cubes have to be split into two groups. That means the correct option here is possibility B."
- Square: 18:14 "When you see a square number, it means that the cubes you're looking for are divided into three or more groups."
- Recap of all three (reconstructed): 18:42 "Normal numbers mean cubes are connected, circle numbers mean cubes are in two groups, and square numbers mean cubes are in three or more groups."
- Card reminder at 17:08: "This puzzle contains orange circle numbers. Remember, those cubes split into two groups."
- **Safety framing for a no-cost tool:** 25:32 "Flagging a cube with the wrong color doesn't count as a strike, and you can add, remove, and change flags as much as you like, so don't be afraid to flag cubes as much as you want."
- **Help:**
  - 29:03 "You might find yourself hitting a wall while working on a really tricky puzzle."
  - 29:06 "If you feel like you have no idea how to solve the one you're working on, don't panic..." / 29:08 "Just tap this icon over here!"
  - 29:16 "you'll be shown a column or a row where there's something to remove, mark with paint, or flag." / 29:19 "You can ask for help as often as you want."
- Praise vocabulary, in order of appearance: "Well done!", "That's it! Pretty easy, right?", "Nice work!", "Fantastic! We're almost done.", "Perfect!", "Thanks!", "Excellent!", "Great work!", "Beautiful!", "You did it!". The reveal names the object: "You've found this puzzle's shape—a pointy arrow." (13:14), "You've revealed the letter H." (16:51).
- Requests are polite: "Can you please mark them with blue paint for me?" (11:49), "Could you please do that right now?" (16:26). There are also imperatives such as "Please mark it now with orange paint." (12:27) and "Let's see you mark it with blue paint!" (16:18).

### B2. Picross 3D (DS, HAL, 2009, US English). Video `ei5s8lSKLY0` (Wii U Virtual Console, no commentary, TallestBrake3)

**How each box is built.** A green chalkboard sits on the top screen with a small cube-bird mascot.
- **Emphasis is in CAPS** (frame-checked): "NOT", "ONE", "NONE", "FIVE". A key number is in yellow ("the number **1**").
- **Controls are spelled out in words**, with a left-handed alternative: "hold up on the +Control Pad (left-handed players can use the X Button)".
- **Praise uses puns**: "A smashing good job!" "A markedly fine effort, if I may say so!"
- The tutorial is a menu of sections (Basics / Numbers / Examples / Circles / Rules). Each section opens with a one-line promise:
  - 03:33 "Let's get into some puzzle-solving basics!"
  - 11:47 "Are you ready to learn about circle numbers?"
  - 18:03 "Learn how strikes and time limits work."

Lines:

- 01:42 "Welcome! In this section, you will learn the rules of Picross 3D while you try your hand at a few puzzles as well."
- 02:07 "Remove small cubes with your stylus in order to uncover the hidden object inside the block!"
- 02:28 "Use the numbers on the cubes to determine which ones are NOT part of the hidden shape. When you find these blocks, tap them with your stylus and smash them to bits!" [frame-checked]
- 02:37 "The numbers on the cubes indicate how many cubes there should be in any given row or column."
- 02:42 / 02:48 / 02:53 explain one axis per box: "If a number is on the top or bottom of a cube, this refers to a vertical column of cubes." Next, side means "a row along the width". Next, front/back means "a row along the depth".
- 02:56 "Simple, right? Now that you know the basics, let's take a closer look..."
- 03:52 "Here the number 1 indicates that only ONE cube in this column is part of the underlying shape." [frame-checked]
- 04:00 "With only this piece of information, we can't tell which cubes should be kept and which should be removed...yet."
- 04:04 "The 0 here indicates that NONE of the cubes in this column are part of the underlying shape." / 04:06 "In other words, you can remove all of the cubes in this column!"
- 04:15 "To remove a cube, hold up on the +Control Pad (left-handed players can use the X Button) and tap the cube!" / 04:20 "Go ahead and remove all of the cubes in this column." / 04:22 "Well done! A smashing good job!"
- 04:36 "You can mark cubes that you want to keep. This will help so that you don't accidentally remove them later while you're working on the puzzle."
- 04:51 "When starting a puzzle, you should first look for numbers indicating that an entire row or column of cubes can be kept (marked) or removed."
- 05:02 "If you mark a cube by mistake, follow the same procedure again to unmark it. Then you can remove the cube."
- 05:17 "Ready to try your first puzzle? Don't be nervous. I'll be here to help you along the way!"
- 05:31 "You remember what that means, right? Yes! You can remove all of the cubes in this column."
- 06:16 "This is key: marked cubes in one row or column will help you spot which ones to keep in other rows and columns."
- 06:23 "Keep looking for rows and columns where the numbers match the quantity of cubes that have been already marked!"
- **Mistakes**, again after the first solve:
  - 06:53 "If you remove a cube that's actually part of the shape, it counts as a strike." / 06:57 "Strikes don't matter in these practice puzzles we're doing, but they will later! Be careful!"
  - 07:01 "OK! Enough yammering from me. I bet you're eager to try a puzzle yourself, eh?"
- One-line tips on the practice puzzles: 07:52 "Tip: Start by looking for rows or columns where you can mark all of the cubes." 09:34 "Tip: Start by looking for rows or columns where you can remove all of the cubes."
- Circle:
  - 12:21 "Normal numbers indicate an unbroken sequence of cubes in a row or column."
  - 12:27 "Circle numbers, on the other hand, indicate that the cubes you need to keep will be divided into two groups separated by a space." [frame-checked]
  - 12:33 "...they could be in groups of 1 and 3 cubes, 2 and 2, or 3 and 1. Make sense?"
- Rules section: 18:23 "If you accidentally remove a cube that was part of the hidden shape in a puzzle, it counts as a strike." / 18:42 "If you get five strikes, then you're out! The puzzle is over."

### B3. Picross S4 (Switch, Jupiter, 2020), normal Picross tutorial. Video `ZfNQtZ-Dl8U` (Game Andyssey)

**How each box is built.** A white bar sits under the grid, with plain dark text and no colour or bold (frame-checked).
- **The grid does the pointing.** The line being discussed gets a red outline and pink squares. The text never says "the third row". It says "this row", "here", "Right here!".
- **Clue numbers are quoted in brackets**: "[3 1]", "[2]", "[10]".
- **Controls never appear in the text.** They live in a fixed bottom bar: "Fill", "X", "Read Again", "Pause". "Read Again" lets the player replay a box.
- Every box is 1 to 2 sentences.

Lines:

- 00:30 "Let's look at some Picross basics." / 00:35 "We'll be using this puzzle as an example."
- 00:43 "In Picross, you must use the hints displayed on the top and left side of the puzzle to fill in the squares."
- 00:48 "These hints show the number of connected squares for that row or column." / 00:51 "So, the two squares here..." / 00:55 "...are connected to the four squares in this row."
- 01:04 "When there are multiple numbers like [3 1], there will always be a gap between the squares represented by each number."
- 01:15 "To reveal the hidden picture, use the hints to fill in the correct squares."
- 01:25 "Let's start here." / 01:33 "As this is a 5 x 5 puzzle, this hint means the whole column should be filled in. Have a go!" / 01:37 "Well done."
- 01:44 "This [3 1] line has 3 connected squares and 1 isolated square." / 01:52 "There's at least one empty square between them. Try filling in the line." / 01:56 "That's correct."
- 02:07 "Always put an "x" on squares that you're certain about not filling in!"
- 02:30 "We don't know which way is correct, but we know the corner squares are empty. So, let's place an "x" on the corner squares!"
- 03:40 "Do you see it? The middle square is used for both, so let's fill it in!" / 03:47 "This trick will come in handy on many puzzles..."
- 04:29 "You're almost there now. Go ahead and complete the puzzle!"
- 04:49 "That's all for our explanation of Picross basic rules and techniques. You can review the content here at any time from the tutorial screen. Have fun playing Picross!"
- Tutorial 2:
  - 06:25 "Blue numbers mean there are squares that can be filled in or marked with an "x"." / 06:31 "Meanwhile, black numbers are lines that won't give you any useful hints right now."
  - 09:17 "This square comes from different hint numbers, so it doesn't qualify. There's a chance it shouldn't be filled in." / 09:22 "This is a difficult point, so take your time!"
  - 09:48 "Notice the hint numbers turned black? This means that nothing more can be done in this line for now."
  - 12:08 "But it doesn't look like we can find either with the methods covered so far. This is a tricky line."
  - 13:01 "Think carefully about hard lines and consider hypothetical scenarios to find solutions." / 13:06 "Like that, you'll be able to solve even the trickiest of hints!"
- Praise is short and flat: "Well done.", "That's correct.", "Correct.", "Good job.", "That's it!", "Just like that!", "You got it!"
- Menu help line (S Genesis demo `8RwJ46013BA` 00:20): "Play normal Picross in this mode." / 00:22 "View detailed explanations for each mode." Options, 00:33: Hint Roulette "Fill in one horizontal and one vertical line at random."
- First-run prompt (S Genesis, `8RwJ46013BA` 01:33, frame-checked): "Welcome to the world of Picross! / Let's start by going over Picross rules and some tips in a tutorial. Do you want to view the tutorial?" The buttons are No / Yes, with No highlighted by default in that frame.

### B4. Picross S5 (Switch, Jupiter), Mega Picross tutorial. Video `aeUNgQmFoF0` (Game Andyssey)

- 00:05 gate card: "Mega Picross is harder than normal Picross. If you're playing for the first time, we recommend playing Mega Picross after playing normal Picross puzzles first."
- 00:34 "Mega Picross has a new type of line called a "Mega Line". Mega Lines are marked with at least one Mega Number, and have different rules from other lines."
- **Rules as numbered cards with Title Case headings.** Each card has ✓/✗ example grids (frame-checked at 01:00):
  - "Always Cover 2 Lines": "1) They always cover 2 lines. The squares indicated by a Mega Number cannot be only on one line."
  - "Squares Must Be Connected": "2) The squares indicated by each Mega Number are always connected."
  - "Do Not Touch Squares From Other Hints": "3) ..."
- 01:16 "That's about it for our explanation of Mega Numbers!"
- 01:45 "They can't touch any squares from other side of a Mega Line. This can be confusing, so be careful!"
- 02:13 "This is very important. Try to remember this example."
- 03:04 "If you solve the normal hints first like this, Mega Lines are a little easier."
- 04:07 "None of these squares can be used. Put an "x" on them!" / 04:16 "Look! Normal hints just turned blue! Let's quickly fill those in now."
- 05:17 "Here it is! Fill it in!" / 05:21 "You're doing well."
- 07:52 "Well done! You're on your way to becoming a Mega Picross master!"

### B5. Dr Kawashima's Brain Training for Nintendo Switch (2019/2020, EU English). Video `qT_R_jygO10` (DanPar)

**How each box is built.** Kawashima speaks in a speech bubble with key words in red (contact sheet): "need a little help", "best possible score", "bright light", "handheld mode", "Raise your hand to start!", "each player".

During play, the prompts are 3 to 5 word imperatives:
- "Try to win." / "Try to lose." / "Raise your hand." (03:54 to 05:03)
- "Count as quickly as you can." / "How many birds are there?" / "Try to count the boxes." / "Wave your flag in the same order." / "Last one!"

Rules boxes, one per Next press:
- 05:23 "Count the number of birds on the screen as fast as you can." / 05:25 "Non-bird objects are included too, so be careful." / 05:27 "There are several rounds, and the one with the quickest right answers wins." / 05:28 "So let's go!"
- 08:50 "Keep an eye out after the countdown." / 08:52 "Several boxes will appear for just a moment. Try to count how many there are." / 08:53 "Once the boxes disappear, quickly enter the number you counted."
- **Hardware is named literally**: 01:13 "Detach the Joy-Con (R)." 01:15 "Hands may not be easily recognised in areas of bright light." 01:19 "Hold the Joy-Con (R) in your left hand and show your right palm." 07:05 "Make sure there are no obstacles nearby and then press any button."
- **Blocked action, with the fix in the same box**: 00:47 "You can't do Daily Training while in TV mode. Please switch to handheld mode or tabletop mode."
- **Losing is reframed**:
  - 06:42 "By the way, even if you don't win, there's absolutely no need to worry." / 06:43 "You can always come and train your brain with me in Daily Training!"
  - 10:20 "But don't worry if you don't win. It's fine. Why?" / 10:21 "Because you know that I'm always there to train with in Daily Training!"
- Hedged claims: "May activate prefrontal cortex", "Flag Raising could help train your memory." (08:39)

### B6. Brain Age: Train Your Brain in Minutes a Day! (DS, 2006, US). Video `KupNZ8AGPRs` (LongplayArchive)

- 00:11 "Hello! My name is Ryuta Kawashima, and I'm a doctor of neuroscience." / 00:13 "Why don't we try doing some brain training together?" / 00:15 "Let's get started!"
- 00:23 "Which hand do you use to write?"
- 01:28 "Look at the problems that appear on the left screen," / 01:30 "and write the answers on the right screen as fast as you can." (Coloured words in the frame: "as fast as you can".) / 01:32 "Solving the problems quickly will activate your prefrontal cortex!" / 01:34 "Ready? Let's go!"
- A persistent hint label sits under the play area: "Write the answer in the frame." / "Tap in order from lowest to highest." / "Read out loud." (contact sheet).
- 02:11 "You know, I never even asked you your name! How negligent of me!"
- 02:34 "Write the last two digits of your birth year on the right screen, please." / 02:45 "Next is the month you were born." (Coloured words in the frame: "month you were born".)
- 03:00 "Touch Select if it's OK or Revise if it's not." On-screen button names are capitalised as they appear.
- 03:10 "You're close to your expected brain age, but you need a little help." / 03:11 "With just a bit of training, you'll work your brain into shape in no time!"
- 04:37 "Try to do this well or better next time!"
- 09:41 "Oh, and it's OK to read to yourself if reading out loud is too embarrassing."
- **Reading comfort**: 09:47 "There are two font sizes available. Feel free to pick the one you like."
- 09:59 "Oops! You finished so quickly, I didn't get a chance to measure you!" Here the system's limit is framed as the doctor's fault, not the player's.

### B7. Super Mario Maker 2: Yamamura's Dojo, Lesson 1 "Intro to Making". Video `sK5ZE0ra0vs` (Nintendo Thumb)

- Yamamura "speaks" pigeon, with a plain-English gloss in parentheses. Nina speaks plainly.
- 00:22 "Coo, coo coooo. (Before we start making courses, I should probably explain what a "course" is.)"
- 00:38 "(Ahem... A course is the space that Mario travels across from the starting point all the way to the goal.)"
- 00:54 "(Courses always begin from the starting point.)" / 00:58 "(From here, Mario will head toward the goal.)" Each sentence is paired with a camera move to the thing it names.
- 01:49 "(In short, the course is everything between the start point and the goal.)"
- 01:56 "(That's a basic overview of courses, though I'm sure it's old news to anyone who's played a Mario game before.)" This acknowledges the expert without slowing the novice.
- 02:00 end prompt: "Watch the lesson again?" Yes / Exit.

### B8. Clubhouse Games: 51 Worldwide Classics, Hit and Blow. Video `JBSRQEKXQkg`

- The uploader skipped "How to Play", so no rules text was captured. Only the in-play banners were captured: "Guess the color and order!" (00:06), "1 Hit! 3 Blows!" (00:24), "Clear!" (00:54).
- The feedback names the result in the game's own terms, with an exclamation mark and no judgement.

### B9. Pikmin 3 (incidental, inside Sakurai video `Xz53DEwuAcU` at about 00:30)

- A control card titled "Throwing": "Take aim with (L) and press (A) to throw." It has a "(B) Close" prompt and an illustration of the action.

---

## Part A: What practitioners said (all [V] unless marked)

### Iwata Asks (crawled from iwataasks.nintendo.com; English official translations)

1. **Text is the last resort; fix the screen first.** *Super Mario Galaxy*, The Developers, p.2. https://iwataasks.nintendo.com/interviews/wii/super_mario_galaxy/1/1/
   - Iwata: "When you resolve an issue by using text messages, although it does constitute a solution, as a developer, you do feel that it is somehow an admission of defeat! (laughs)"
   - Shirai: "Yes. That was really the last resort! (laughs) So I had the design changed to solve some of those issues... I had the design team make it so that the players would be able to figure out what to do next by just looking at the screen."
2. **The voice speaks when it helps and goes quiet when the player is on a roll.** *Brain Age: Concentration Training*, Vol. 2 p.3. https://iwataasks.nintendo.com/interviews/3ds/brain-age/1/2/
   - Ito: "Ito-san was revising the text right up until the final recording." (Said by Kitamura.)
   - Ito: "In addition to making revisions to the wording, we also fine-tuned other aspects of the lines. At first, if you get the right answer, Dr. Kawashima will say, "Very good!" But then just as the player is really starting to concentrate, he suddenly holds back."
   - Iwata: "Instead of talking the whole time, once you're on a roll, he watches in silence."
   - Ito: "And if you make a mistake, he'll offer words of encouragement. But then, when you're building up a head of steam, he will quiet down again."
   - Iwata: "I think that by having Dr. Kawashima addressing you directly, the game's toughness is made more palatable and the player is encouraged to keep trying."
   - Same page, Kitamura: "He congratulates you when you get the right answer, and when it looks like you're ready to give in, he encourages you."
3. **"Simple explanations right from the start."** Takahashi, Vol. 2 p.6: "But this game eases you in with Dr. Kawashima's simple explanations right from the start, so I think it's accessible to all kinds of people." https://iwataasks.nintendo.com/interviews/3ds/brain-age/1/5/
4. **Messages that say "this is a stopping point".** *Brain Age Express* (DSi), p.2. https://iwataasks.nintendo.com/interviews/ds/dsi/5/1/
   - Kawamoto: "after you get a stamp, a message comes up telling you to return to the menu."
   - Iwata: "by periodically saying, 'This is a stopping point,' busy users will feel that they can play it without taking up too much time."
5. **Write so the reader can copy you; cut phrasing that sounds put-on.** *Swapnote*, p.4. https://iwataasks.nintendo.com/interviews/3ds/swapnote/0/3/
   - Kitai: "We want her to write things that will be useful to people who aren't sure how they should write, so she drew cats and stars and footprints—the kinds of things that anyone can easily copy. ... Imai-san and Denyu-sha did create some example sentences for what she should say, but they were like a parade of phrases today's girls would never use!"
   - Kitai: "It felt like men trying too hard to sound like a girl. Nikki straightened that out, too."
6. **Explain in a split second, by showing the hold, not describing it.** *WarioWare: Smooth Moves*, p.2. https://iwataasks.nintendo.com/interviews/wii/warioware_smooth_moves/0/1/
   - Sakamoto: "people have five seconds at most to grasp the way they have to play."
   - Iwata: "indicating to them what to do with messages like 'Press the A Button now!' used to be relatively simple."
   - Sakamoto: "We implemented instructions saying: 'Hold the Remote like this' and 'Next, hold it like this.'"
7. **People won't read; show it moving.** *Wii MotionPlus*, p.4. https://iwataasks.nintendo.com/interviews/wii/wiimotionplus/0/3/
   - Iwata: "Well, unfortunately not every user is going to read the instructions. Plus it's very difficult to work it out by just looking at diagrams."
   - Takamoto: "That's why we decided to put the instructions in video form which you can see when you start Wii Sports Resort."
8. **Test on people who've never seen it; adjust until no explanation is needed.**
   - DSi Sound, Mori: "We saw which parts looked difficult, and then made adjustments so anyone could do it without explanation." https://iwataasks.nintendo.com/interviews/ds/dsi/4/2/
   - *Rhythm Heaven Fever*, Tsunku♂: "we went to people from all age groups—from new employees and female staff members in their mid-twenties to people about 50—and without any explanation, said, 'Play this!' And they couldn't do it. ... they had to start by asking which buttons to use." https://iwataasks.nintendo.com/interviews/wii/rhythmheavenfever/0/4/
   - *Zelda: Spirit Tracks*, Aonuma: "if our two elderly gamers were saying 'I don't get it' more than we expected... in the end we adjusted that somewhat." https://iwataasks.nintendo.com/interviews/ds/zelda/1/3/
9. **Limit the options at first so the instructions can be simple.** *Style Savvy*, p.3. https://iwataasks.nintendo.com/interviews/ds/stylesavvy/0/2/
   - Hattori: "Only an easy-to-grasp number of items is available, and you can start with instructions that even inexperienced persons can manage. ... players who know less about fashion will get polite advice when they make a mistake."
10. **Many words can be replaced by demeanour and events.** *Skyward Sword* Vol. 8 p.3. https://iwataasks.nintendo.com/interviews/wii/zelda-skyward-sword/8/2/
    - Aonuma: "even though he didn't understand the words, he could tell what he should do next just from the character's demeanor and other events taking place in the screen."
    - Aonuma: "As developers, we want to explain little by little what lies ahead and have the players move ahead as they figure it out."
11. **Tutorials for newcomers annoy the experienced; make them optional.** *Super Mario Galaxy 2*, p.3. https://iwataasks.nintendo.com/interviews/wii/supermariogalaxy2/0/2/
    - Miyamoto-era team: "Tutorials are nice for helping people to remember the controls for the first time, but they're a pain for people who already know the controls." The tutorials were "confined ... to something called Tip Network that you only have to look at if you want to." The same page records that Miyamoto "drew up the text" himself.
    - Related, Pokémon BW2 p.4: "a fine balance is necessary for the introductory explanations." https://iwataasks.nintendo.com/interviews/ds/pokemon-black2-white2/0/3/
12. **Reading level as a setting (kanji).** *Pokémon Black/White*, p.1. https://iwataasks.nintendo.com/interviews/ds/pokemon-black-white/0/0/
    - "This time, instead of using just hiragana, you can select kanji mode."
    - Editor's note: "players can choose either the kanji or hiragana modes which changes the types of the characters in which the dialogue is displayed depending on their reading skills."
    - "I thought some people would find kanji easier to read."
13. **Text is easier to read in your hands, in big letters.** *NSMBU*, p.5. https://iwataasks.nintendo.com/interviews/wiiu/nsmbu/0/4/
    - Asuke: "The Wii U GamePad shows pretty big letters, so you can read the comment right in your hands." Iwata: "Reading text is easier in your hands."
14. **1-1 assumes the player hasn't read the manual.** *Super Mario Bros. 25th*. https://iwataasks.nintendo.com/interviews/wii/nsmb/1/4/
    - Iwata: "they tended not to read the instruction manual, and there was no one who was going to tell them what to do."
15. **Explain by function, not mechanism.** *How the 3DS Was Made*, p.11. https://iwataasks.nintendo.com/interviews/3ds/how-nintendo-3ds-made/0/10/
    - "You just have to convey that sensation that 'It really works!'—rather than a scientific explanation".

- Searched and not present: no Iwata Asks for Picross 3D, Picross e/S, Brain Age DS (2005/06), Big Brain Academy or Clubhouse Games. The site's list starts with Wii/DS-era titles; Wii Fit and Wii Sports pages exist but contain no wording guidance.

### Masahiro Sakurai on Creating Games (official channel; English from burned-in official subtitles, OCR)

- `Icl-jMlz1iY` "Teaching Players How to Play":
  - 00:43 "The worst thing you can do is make players read long paragraphs like an instruction manual."
  - 00:59 "A relatively common approach is posting text along the path in the opening stage, / so players can read it, then put it into practice."
  - 01:37 "At any rate, I'd say it's vital that you let players play the game as you teach them."
- `Xz53DEwuAcU` "Making Tutorials Feel Natural":
  - 00:33 "When introducing a game, it's better to give players real challenges to face, / then let them learn by overcoming said challenges."
  - 01:49 "When showing button icons, you need to cover every possible button the player can use."
  - 02:41 "Tutorials shouldn't feel like work, / or like they're slowing down the beginning of the game / instead, try to weave them into the game's progression itself."
- `R7rd4-ua2AI` "Being Kind to Beginners":
  - 02:05 "it's important to be kind when introducing new players to a title."
  - 02:21 "if you hold their hand too much, making them feel as if they're being pulled along / like everyone just keeps telling them how to play the game / they likely won't enjoy themselves."
- `bZSNYX5CVpw` "Emphasizing Text": "Things like adjusting font size. / Adding color." Also 01:12 "it's better to leave that to the translation team. / After all, different languages have different styles of emphasis."

### Nintendo of America localization

- Tim O'Leary (NOA localization lead), Gamasutra: "to be true to the developer's intent. That's like a mantra to us." [V] https://www.gamedeveloper.com/game-platforms/interview-nintendo-i-advance-wars-i-the-art-of-localization. This is about intent, not tutorial wording.
- Rich Amtower (Treehouse), GDC 09: "we worked really closely with the team to come up with terminology and tutorials for the DSi camera and the DSi sound." [V] https://destructoid.com/gdc-09-chatting-with-nintendos-rich-amtower
- Nate Bihldorff on Elite Beat Agents having "a very, very good tutorial" [S]. This was a search snippet of a 2006 Nintendo World Report interview. I didn't fetch the page; URL not confirmed.
- I found no Treehouse or NOA statement about sentence length, reading level or tutorial phrasing. No GDC talk by Nintendo staff on tutorial wording was found.

---

## Part C: Interpretation and transferable patterns

1. **One point per box; split before you lengthen.** The Picross games split a sentence across boxes with "..." rather than letting one box run long ("They help you figure out which cubes to remove..." / "and which ones to mark with orange and blue paint."). Most boxes are 8 to 25 words.
2. **Point at it, then say "this".** Picross S never names coordinates. The highlight carries the location and the text says "this row", "here", "Right here!". In Round 2, the lines open with the actual clue tile, as in "[0] This tells us that...". (Iwata/Shirai: make it readable "by just looking at the screen".)
3. **Read the clue aloud as a sentence, in the game's own nouns.** "[0] This tells us that there are no colored cubes at all in this row." "This [3 1] line has 3 connected squares and 1 isolated square." The clue is the subject and "tells us" is the verb. The conclusion follows in the next box ("That means...").
4. **Every rule is followed straight away by the one action it licenses, phrased as an invitation.** "That means that all of the cubes in this row can be removed!" leads to "Give that a try on the cubes that're glowing." The other forms are "Have a go!", "Try filling in the line.", "Fill it in!" and "Go ahead and finish the puzzle."
5. **Praise is short, immediate and varied, then the voice steps back.** "Well done." "That's correct." "Perfect!" "Nice work!" Kawashima's team made the voice go quiet "once you're on a roll" (Iwata Asks). Name the reveal: "You've revealed the letter H."
6. **Mistakes are named neutrally, after a success, with the cost stated once and softened.** "Accidentally removing a cube that's part of a puzzle's hidden shape counts as a strike." "Strikes don't matter in these practice puzzles..." For safe tools: "doesn't count as a strike ... so don't be afraid to..." Losing: "even if you don't win, there's absolutely no need to worry." No game says "wrong", "fail", "error" or "you lose" in teaching text.
7. **Introduce a symbol by contrast with what they already know, then by what it looks like, then one concrete case, then the refuted wrong case.** The circle sequence runs:
   - "a bit different from the normal numbers"
   - "enclosed in a circle, like this one here"
   - "four blue cubes that are split apart into two groups"
   - "if we go with possibility A, all three cubes will be connected...but that isn't how circle numbers work!"
   - It ends with a 1-line recap: "Normal numbers mean ... circle numbers mean ... square numbers mean ..."
8. **Controls: verb plus the thing, in the player's hand.** For touch, use "tap the cube", "touch your stylus to the lower screen and then slide it". Hardware is named literally ("Detach the Joy-Con (R)."). Where the controls are fixed, Picross S keeps them entirely out of the prose, in a persistent bottom bar. Sakurai: if you show icons, "cover every possible button".
9. **Emphasis is used on a few words only, and differs by era.** Round 2 and Brain Training colour the action phrase or key term in red/orange. DS Picross 3D uses CAPS (NOT, ONE, NONE). Picross S uses none and lets the grid highlight carry it.
10. **A friendly speaker, but plain sentences.** Round 2 has "Looks pretty...difficult...right? But the truth is, these puzzles are actually quite easy to enjoy!" Kawashima has "How negligent of me!" Picross S is neutral. All three keep the instructional sentence itself plain. The Swapnote team cut example lines that sounded put-on.
11. **Reading comfort is a choice, not an assumption.** Brain Age has "There are two font sizes available. Feel free to pick the one you like." Pokémon BW has a kanji/hiragana mode "depending on their reading skills". Picross S has "Read Again". Yamamura's Dojo ends with "Watch the lesson again?"
12. **Say what's coming and when it ends.** For example:
    - "Let's go over the controls you'll need to use to solve puzzles."
    - "That's all for our explanation ... You can review the content here at any time from the tutorial screen."
    - Brain Age Express: "This is a stopping point".
13. **Things they never say in teaching text** (observed absence across the boxes above):
    - no "wrong/incorrect/failed"
    - no grid coordinates or "the third column"
    - no undefined jargon before its first-use definition. "Mega Line" is defined in the same sentence that introduces it.
    - no unexplained "groups" before the contrast with "connected"
    - no blame for system limits ("Oops! You finished so quickly, I didn't get a chance to measure you!")

---

## Couldn't verify / gaps

- **Picross S (original, 2017) normal tutorial.** The S Genesis demo player declined the tutorial. I used Picross S4 and S5 (same developer, Jupiter, same tutorial format) instead.
- **Clubhouse Games 51 "How to Play".** Not captured: the video skips it.
- **Wii Sports / Wii Fit instruction screens.** Not sampled. No Iwata Asks wording guidance was found for them.
- **Big Brain Academy: Brain vs. Brain.** Not sampled.
- **Yamamura's Dojo.** Only Lesson 1 was sampled.
- **Bihldorff's EBA tutorial remark.** Search snippet only [S].
- **Sakurai Famitsu column on menu help text.** Seen via search summary only [U]. https://sourcegaming.info/2016/06/07/rethinking-your-menus-sakurais-famitsu-column-vol-138/ (not fetched).
- **No Nintendo GDC talk or Treehouse interview about tutorial sentence length, reading level or plain words was found.** Claims of a Nintendo "style guide" for tutorial text remain unverified.
- **OCR accuracy.** Lines are OCR plus frame checks for styling; minor wording slips are possible where marked "reconstructed". Sakurai quotes are OCR of the official burned-in subtitles; the auto-captions were not used.
- **Region.** Brain Training Switch footage is EU English ("recognised", "Memorise"). Brain Age DS and Picross 3D DS are US English.
- **Earlier blocks.** GameFAQs, StrategyWiki and Giant Bomb were not retried (they returned 403 earlier).

---

## Accessible, plain game copy: research notes for Strata

Researched 2026-10-29. Audience: casual players, including older adults and non-native English readers. Copy types: short coach lines, a Rules page, buttons, small offers, on a phone.

How to read these notes: **Says** is quoted exactly from the fetched source. **Interpretation** is my own reading for Strata and is not in the source. Raw downloads are in `src/` next to this file (Apple JSON/text, COGA text, GOV.UK text, App Store Review Guidelines text, Andersen 2012 PDF/text).

---

## 1. Sources fetched

### Game Accessibility Guidelines (GAG)
- Full list: https://gameaccessibilityguidelines.com/full-list/
  - Cognition Basic includes: "Avoid flickering images and repetitive patterns", "Allow players to progress through text prompts at their own pace", "Include interactive tutorials", "Use simple clear language", "Use simple clear text formatting", "Use an easily readable default font size".
  - Cognition Intermediate includes: "Highlight important words", "Ensure no essential information (especially instructions) is conveyed by text alone, reinforce with visuals and/or speech", "Include a means of practicing without failure, such as a practice level or sandbox mode", "Indicate / allow reminder of controls during gameplay", "Indicate / allow reminder of current objectives during gameplay", "Include contextual in-game help / guidance / tips", "Give a clear indication that interactive elements are interactive".
  - Cognition Advanced includes: "Allow all narrative and instructions to be replayed", "Avoid any sudden unexpected movement or events".
  - Vision Advanced: "Allow the font size to be adjusted".
- Use simple clear language: https://gameaccessibilityguidelines.com/use-simple-clear-language/
  - "14% of adults in the USA and UK have a reading age of below 11 years old"
  - "Aim for as straightforward language as your copy style allows, for example:" Good: "Click below to save your character". Avoid: "If you click below your chosen character preferences will be saved"
  - "Text should not be dumbed down, but length or complexity should be avoided" "if it is not required by the tone or to get the point across."
  - "Keeping text as concise and straightforward as possible increases the likelihood of it being read by any gamer" "for whom large blocks of text can be extremely intimidating."
- Use simple clear text formatting: https://gameaccessibilityguidelines.com/use-simple-clear-text-formatting/
  - "ideally a clean sans serif font with distinct letter shapes"
  - "aim for mixed case rather than all caps, unjustified left alignment, 1.5x line spacing, and around 70 characters per line."
- Include interactive tutorials: https://gameaccessibilityguidelines.com/include-interactive-tutorials/
  - "guided interactive tuition is still far more useful for all players than a simple instructions screen"
  - "practising the interaction in the context of gameplay is less demanding on short term memory"
- Ensure no essential information is conveyed by text alone: https://gameaccessibilityguidelines.com/ensure-no-essential-information-especially-instructions-is-conveyed-by-text-alone-reinforce-with-visuals-andor-speech/
  - "Reinforcing textual information with images and sounds can be useful for all players."
  - "being confronted with large blocks of text can actually often be so intimidating that the text is skipped entirely."
- Highlight important words: https://gameaccessibilityguidelines.com/highlight-important-words/
  - "Too much text can be intimidating, off-putting and difficult to comprehend for many people"
  - "Breaking sentences down into smaller units is proven to improve understanding" (attributed on the page to Jeff Petty, Microsoft)
- Progress through text at own pace: https://gameaccessibilityguidelines.com/allow-players-to-progress-through-text-prompts-at-their-own-pace/
  - "Instead of a timer, dismiss information on a player action, allowing it to be stepped through."
  - "If that’s not possible, allow it to to be replayed or paused." (typo is the source's)
- Reminder of current objectives: https://gameaccessibilityguidelines.com/indicate-allow-reminder-of-current-objectives-during-gameplay/
  - "A reminder can help greatly." "Either permanently displayed, on player request, or triggered automatically."

Caveat: the GAG quotes came through WebFetch's summariser. Short quoted strings are taken from its output and look verbatim, but I didn't check them against the raw HTML.

### Xbox Accessibility Guidelines (XAG), v3.2
- XAG 101 Text display: https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/101
  - Mobile: "18 px at 100 DPI", "36 px at 200 DPI", "72 px at 400 DPI", "Scale linearly as DPI increases"; "a 5.5" screen with a 1080p resolution is roughly 400 DPI."
  - "Players should be able to resize text up to 200 percent of the minimum font sizes ... without the loss of content, functionality, or meaning."
  - "Line width: The line width shouldn't be more than 80 characters or glyphs (or 40 if Chinese/Japanese/Korean)"
  - "Font case: Provide the ability to display text in proper sentence case rather than in full caps or full lowercase (if used)." "This requirement refers to lines of text. A one- or two-word label is exempt from this guideline."
  - "Alignment: Text is left/right-aligned based on the player language preference (not centered or fully justified)—or players can adjust the text to meet these guidelines."
  - "Platform-provided screen magnification tools aren't an appropriate mitigation for small text size."
- XAG 109 Objective clarity: https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/109
  - "Provide players with the ability to review tasks and objectives at any given time. Descriptions of tasks and objectives should be clear and straightforward."
  - "Static screens that display game controls or controller mappings are not sufficient and should not be considered a tutorial."
  - "players should be able to re-visit the tutorial at any point in the game, regardless of whether the tutorial has previously been completed."
- XAG 112 UI navigation: https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/112
  - "The UI of a game should be consistent and intuitive."
  - "Components that are repeated across multiple pages or screens should appear in the same relative order ... each time that they're repeated."
- XAG 114 UI context: https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/114
  - "UI text that is critical to understanding gameplay or managing game settings (text within menu UIs, tutorials, instructions, etc.) should not require a reading ability that's more advanced than a lower secondary education (seven to nine years of school)."
  - "Narrative text that contributes to the game’s storyline such as journals, character dialogue, other in-game story content, and proper names or titles are not subject to this guideline."
  - "A mechanism is available for displaying specific definitions of words or phrases that are game-specific or used in an unusual or restricted way, including idioms, jargon, acronyms, and abbreviations."
  - "Components reused in different areas that have the same functionality are identified through consistent iconography, labeling, or text."
  - "Ensure that text alternatives (such as narration and tooltips) convey the purpose and operation of the UI components."
  - "before activating a button, a player should already be aware that the interaction is going to put them in an active gameplay experience ... or change a specific aspect of their settings."
  - "Large blocks of text should be split into editorially appropriate sections and have descriptive headings."
- Version history (confirms the XAG 114 reading-level line was added in v3.x): https://learn.microsoft.com/en-us/gaming/accessibility/xag-version-history
- Not found: no XAG is titled "clear and simple language". That requirement lives in XAG 114 (reading level, definitions) and XAG 109 ("clear and straightforward").

### Microsoft Writing Style Guide, global communications
https://learn.microsoft.com/en-us/style-guide/global-communications/writing-tips
- "Write short, simple sentences."
- "Include articles, such as the. Articles help readers and translation software identify the nouns and modifiers in a sentence."
- "If necessary for clarity, include verbs in short headings and UI labels. For example, say Access is denied instead of Access denied."
- "Avoid idioms, colloquial expressions, and culture-specific references. They can be confusing for non-native English speakers and hard to localize."
- "Use active voice and indicative mood most of the time. Use imperative mood in procedures."
- "Use one word for a concept, and use it consistently. Avoid using synonyms to refer to the same concept or feature. And don’t use the same word to refer to multiple concepts or features."
- "Limit your use of sentence fragments. Sentence fragments can be hard to translate."
- "Avoid linking more than three phrases or clauses by using coordinate conjunctions such as and, or, or but. Better yet, avoid linking more than two."

### Apple Human Interface Guidelines
The HTML pages render in JavaScript, so WebFetch got only titles. I got the text from Apple's own JSON data endpoints (`developer.apple.com/tutorials/data/design/human-interface-guidelines/<page>.json`). The quotes below are verbatim from that text. Cite the public URLs.
- Writing: https://developer.apple.com/design/human-interface-guidelines/writing
  - "Create a list of common terms, and reference that list to keep your language consistent."
  - "Be clear. Choose words that are easily understood and convey the right thing. Check each word to be sure it needs to be there. If you can use fewer words, do so. When in doubt, read your writing out loud."
  - "Choose simple, plain language and write with accessibility and localization in mind, avoiding jargon and gendered terminology."
  - "put the most important information first." "If you’re trying to convey more than one idea, consider breaking up the text onto multiple screens"
  - "When labeling buttons and links, it’s almost always best to use a verb. Prioritize clarity and avoid the temptation to be too cute or clever with your labels. For example, just saying “Send” often works better than “Let’s do it!”"
  - "Choose a style for each UI element type and use it consistently throughout your app"
  - "You can use the button label to hint at the next step, or use terms like “Continue” or “Next,” but be consistent with what you choose. Make it clear when a flow is complete by using language like “Done.”"
  - "Use possessive pronouns sparingly." "Avoid using we altogether because it may be unclear who the “we” in question refers to."
  - "Make sure you describe gestures correctly on each device — for example, not saying “click” for a touch device like iPhone or iPad where you mean “tap.”"
  - "iPhone and Apple Watch, for example, offer opportunities for personalization, but their small screens require brevity."
  - "Interjections like “oops!” or “uh-oh” are typically unnecessary and can sound insincere."
  - "Describe what it does when turned on, and people can infer the opposite."
  - "“Use only letters for your name” is better than “Don’t use numbers or symbols.”"
- Inclusion: https://developer.apple.com/design/human-interface-guidelines/inclusion
  - "an academic tone can make an app or game seem like it welcomes only high levels of education."
  - "Avoid using specialized or technical terms without defining them."
  - "Replace colloquial expressions with plain language. Colloquial expressions are often culture-specific and can be difficult to translate."
  - "Consider carefully before including humor. Humor is highly subjective and — similar to colloquial expressions — difficult to translate from one culture to another."
- Accessibility: https://developer.apple.com/design/human-interface-guidelines/accessibility
  - "Ideally, give people the option to enlarge text by at least 200 percent"
  - iOS, iPadOS type: default size "17 pt", minimum size "11 pt"
  - "Minimize use of time-boxed interface elements. ... Prefer dismissing views with an explicit action."
  - "Be cautious with fast-moving and blinking animations."
  - "Support simple gestures for common interactions."
  - "Keep actions simple and intuitive. Ensure that people can navigate your interface using easy-to-remember and consistent interactions."
- VoiceOver: https://developer.apple.com/design/human-interface-guidelines/voiceover
  - "Provide alternative labels for all key interface elements. ... you should provide more descriptive labels that convey your app’s functionality. Add labels to any custom elements your app defines."
  - "Exclude purely decorative images from VoiceOver."
  - "Offer unique titles that succinctly describe each page’s content and purpose."

### Apple App Store Review Guidelines (for in-app wording)
https://developer.apple.com/app-store/review/guidelines/
- 2.5.18: "Interstitial ads or ads that interrupt or block the user experience must clearly indicate that they are an ad, must not manipulate or trick users into tapping into them, and must provide easily accessible and visible close/skip buttons large enough for people to easily dismiss the ad."
- 3.1.2(c): "Before asking a customer to subscribe, you should clearly describe what the user will get for the price."
- 5.6: "Apps should never prey on users or attempt to rip off customers, trick them into making unwanted purchases ..."
- Interpretation: v1 of Strata is free with monetization off. These lines matter for "small offers" now only as a wording standard (say plainly what the player gets). They matter as rules once ads or purchases come in.

### W3C COGA, "Making Content Usable for People with Cognitive and Learning Disabilities"
https://www.w3.org/TR/coga-usable/ (W3C Group Note; I read the full text from a curl download)
- 4.4.1 Use Clear Words: "Use common and clear words in all content. Look at the most common 1500 words or phrases." "Do not invent new words or give words new meanings in your application. ... If you must create new terms, make sure the user has access to an explanation within one click or event." Example: someone with mild dementia blocked by a menu item labelled "mode". "Start using clear words in headings, labels, navigational elements, instructions, and error messages."
- 4.4.2 Use a Simple Tense and Voice: "In English, this is usually the present tense and active voice. Speak directly to the user, and use the simplest form of verbs and sentence structure." "Putting the aim of the sentence at the beginning can also make English sentences easier to follow."
- 4.4.3 Avoid Double Negatives or Nested Clauses: "do not use a double negative to express a positive, and do not use clauses inside clauses."
- 4.4.4 Use Literal Language: "Use literal and concrete language. When possible, use concrete terms and examples that refer to objects or events that you can see, hear or touch. Do not use metaphors and similes unless you include an explanation." "Sometimes instructions have jokes and similes to make the content friendlier. However, this confuses the user"
- 4.4.5 Keep Text Succinct: "Use short sentences. Have only one point per sentence." "Try to have the aim of the paragraph or chunk at the beginning." "In English, if you have a paragraph of more than 50 words, try breaking it up into two paragraphs." "Sentences that have more than one point usually have more than one linking word such as “and” or “but”." "A series of three or more steps is easier to follow as a numbered list."
- 4.4.9 Separate Each Instruction: "In instructions, separate each step. State each step clearly." "including all steps, even those you think are “obvious”"

### GOV.UK content design
- Use clear language: https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/writing-guidelines/clear-language/
  - "There will also be some users who do not have English as their first language"
  - "Do not use formal or long words when easy or short ones will do. Use ‘buy’ instead of ‘purchase’, ‘help’ instead of ‘assist’, and ‘about’ instead of ‘approximately’."
  - "Use the language that users: will be familiar with; use themselves"
  - "Use contractions like ‘you’ll’, but avoid negative contractions like ‘can’t’ or ‘don’t’. Many users find negative contractions hard to read, or misread them as the opposite of what they say."
  - "If something is optional, you can use ‘can’."
  - "The active voice is more direct and puts the focus on the user and the action they need to take."
  - "Paragraphs should have no more than 5 sentences each." "Try to split up sentences that are over 25 words long."
- Clear structure: https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/writing-guidelines/clear-structure/
  - "Put the most important information first. The quicker you get to the point, the greater the chance your users will see the information you want them to."
  - On headings: "active – for example, start them with a verb when possible"
- The old URL gov.uk/guidance/content-design/writing-for-gov-uk redirects to these pages.

### US plain language (plainlanguage.gov, now digital.gov)
- plainlanguage.gov/guidelines/ redirects (301) to https://digital.gov/guides/plain-language
- https://digital.gov/guides/plain-language/writing: "Active voice makes it clear who should do what." The page says content is easier to understand with "Shorter words" and "Short sections." I did not fetch the subpages ("familiar terms" and others).

### Mailchimp content style guide
https://styleguide.mailchimp.com/writing-for-accessibility/
- "Write short sentences and use familiar words. Avoid jargon and slang."
- "Links should provide information on the associated action or destination."
- "Avoid directional instructions and any language that requires the reader to see the layout or design of the page."

### AbleGamers, Accessible Player Experiences (APX)
- Clear Text: https://accessible.games/accessible-player-experiences/access-patterns/clear-text/
  - Problem: "Players cannot reliably read the text in the game or its interfaces." Solution: "Players can change the way text is presented to them in the game or its interfaces so that it can be read reliably."
- Related patterns, listed but not fetched: Training Ground, Total Recall, Helping Hand (https://accessible.games/accessible-player-experiences/access-patterns/).
- Includification (AbleGamers' 2012 PDF): not fetched.

### Research on tutorials and reading
- Andersen et al., "The Impact of Tutorials on Games of Varying Complexity", CHI 2012. Paper: https://grail.cs.washington.edu/projects/game-abtesting/chi2012/chi2012.pdf (project page https://grail.cs.washington.edu/projects/game-abtesting/chi2012/)
  - "The results of our multivariate study of over 45,000 players show that the usefulness of tutorials depends greatly on game complexity. Although tutorials increased play time by as much as 29% in the most complex game, they did not significantly improve player engagement in the two simpler games."
  - "Giving tutorial instructions as closely as possible to when they were needed, rather than out of context in an up-front manual, increased play time by 16% and progress by 40% in Foldit but had no effect in the other two games."
  - "Providing help on-demand improved player engagement in Foldit, but had no effect in Hello Worlds and even negative effects in Refraction."
  - "the players of these games, at least, seem to learn more from experimentation than from reading text."
  - Interpretation: Refraction is a puzzle game, the closest genre to Strata. For simple, discoverable puzzle mechanics, more text did not help. In Refraction, on-demand help even hurt.

### Not found or not fetched (no quotes invented)
- Ubisoft, EA, Sony/PlayStation: I found no public accessibility writing or UX-copy guidance from them. The search turned up nothing primary.
- GDC talks on tutorial text length or skipping: I didn't fetch or verify any. The skipping claim above is GAG's ("so intimidating that the text is skipped entirely"), not a GDC study.
- No source I found gives a word limit for one in-game coach line. The only numbers are GOV.UK (split sentences over 25 words), COGA (break paragraphs over 50 words), and GAG/XAG (about 70 or at most 80 characters per line).

---

## 2. Checklist (rules for Strata copy)

Each rule has a test, its sources, and a note on where it may not fit a calm, wordless-leaning game.

1. **One action per line, verb first.** Test: each coach line has one imperative verb and no "and"/"but" joining two actions. Source: COGA 4.4.5 "Use short sentences. Have only one point per sentence."; COGA 4.4.9 "In instructions, separate each step."; GAG good example "Click below to save your character". Fit note: a closing line ("That's the idea.") has no verb and needs none.
2. **Short sentences, with a hard ceiling.** Test: no sentence is over 25 words (GOV.UK); no Rules paragraph is over 50 words (COGA 4.4.5) or 5 sentences (GOV.UK). Interpretation, not sourced: aim for 12 words or fewer in coach lines on a phone. Apple: "small screens require brevity."
3. **Reading level no higher than lower secondary.** Test: Flesch-Kincaid grade of 7 or lower on the Rules page and coach lines. Source: XAG 114 "seven to nine years of school". The FK grade number is my proxy. Fit note: XAG 114 exempts "proper names or titles", so names like "Strata" and "Finds" are fine.
4. **Common words.** Test: every word in instructions is a common everyday word. Source: COGA 4.4.1 ("most common 1500 words"); GOV.UK ("‘buy’ instead of ‘purchase’").
5. **Literal: no idioms, metaphors or puns in instructions.** Sources: COGA 4.4.4; Microsoft "Avoid idioms, colloquial expressions"; Apple Inclusion on colloquial expressions and humour. Fit note: an evocative title or level name can be poetic. The line that tells the player what to do must be literal.
6. **One term per thing, kept in a glossary.** Test: a term list exists, and no synonyms appear (for example cell/block/cube; clue/number/hint). Sources: Microsoft "Use one word for a concept... And don’t use the same word to refer to multiple concepts"; Apple "Create a list of common terms"; XAG 114 "consistent iconography, labeling, or text".
7. **No invented or redefined words, or explain them once and nearby.** Sources: COGA 4.4.1 "Do not invent new words or give words new meanings... explanation within one click"; XAG 114 definitions mechanism. Fit note: game words like "Finds" are allowed but need a one-line explanation where they first appear.
8. **Name the gesture the player makes.** Test: say "tap", "drag", "pinch" on phone; never "click" or "press". Source: Apple Writing ("not saying “click” ... where you mean “tap.”"). Interpretation: describe what moves, not where it sits on screen. Mailchimp: "Avoid directional instructions".
9. **Buttons are plain verbs, never cute.** Source: Apple: "it’s almost always best to use a verb... “Send” often works better than “Let’s do it!”" Fit note: one-word destination nouns ("Map", "Rules") are fine. Apple says "almost always", and XAG 101 exempts one- or two-word labels from the sentence-case rule.
10. **Present tense, active voice, speak to "you".** Sources: COGA 4.4.2; GOV.UK ("puts the focus on the user and the action").
11. **Say what to do, not what not to do.** Test: no double negatives and no "can't"/"don't" in instructions. Sources: COGA 4.4.3; GOV.UK on negative contractions; Apple ("“Use only letters for your name” is better than “Don’t use numbers or symbols.”").
12. **Most important first: the action before the reason.** Sources: GOV.UK "Put the most important information first"; COGA 4.4.2 "aim of the sentence at the beginning"; Apple "put the most important information first".
13. **Show it; text only reinforces.** Test: every lesson line pairs with an on-board highlight or animation, and the player does the action rather than reads about it. Sources: GAG interactive tutorials and "not conveyed by text alone"; XAG 109 "Static screens... not sufficient"; Andersen 2012 "learn more from experimentation than from reading text." Fit note: this is the strongest fit of all. Cut any line the board already shows.
14. **The player sets the pace.** Test: no coach line or offer dismisses itself on a timer. Sources: GAG "Instead of a timer, dismiss information on a player action"; Apple "Minimize use of time-boxed interface elements."
15. **Reminders on request.** Test: the Rules page and the lessons can be reopened at any time. Sources: GAG reminders of objectives and controls; XAG 109 "re-visit the tutorial at any point". Fit note: per Andersen, on-demand help hurt in a puzzle game. Keep it passive and out of the way.
16. **Readable type and layout.** Test: 17 pt default text, 11 pt minimum (Apple iOS); text scales to 200% (Apple, XAG 101); sentence case, not all caps; left-aligned (XAG 101); 70 characters or fewer per line (GAG). Fit note: short centred labels and titles are a normal exception.
17. **Calm tone: no "oops", no "we", no jokes in instructions.** Sources: Apple ("“oops!” ... can sound insincere"; "Avoid using we altogether"); Apple Inclusion on humour.
18. **Label every icon for VoiceOver with its purpose.** Sources: Apple VoiceOver "Provide alternative labels for all key interface elements"; XAG 114 "convey the purpose and operation".
19. **Offers say exactly what the player gets and how to close them.** Sources: App Store 3.1.2(c) "clearly describe what the user will get"; 2.5.18 for ads "clearly indicate that they are an ad" with visible close. Interpretation: this applies as a wording standard while monetization is off.
