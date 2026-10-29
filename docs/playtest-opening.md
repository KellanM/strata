# Playtest: the opening (2026-10-28)

**Why.** We rebuilt the opening (`flow-study.md` F1-F4, F6): the lessons now start from Learn on the map and end back on it, and a relaunch is one tap from the map. Both GDC-era talks we studied (`talks/notes.md`) tested this way from the first prototype: a new player, no instructions, watched. Ken Wong: test "the whole UX, the whole system", not the puzzle alone.

**The one question.** After the lessons, can a new player tell you what they just finished?

## Who and how

- **3-5 people who have never seen Strata.** Mix them: at least one who plays puzzle games and one who "doesn't play games".
- **Their own phone**, a fresh install (or the web app in a private tab), with sound however they normally have it. Wong: on mobile you can't count on audio.
- **Record the screen** (iOS: Control Centre → Screen Recording, long-press for the mic) so we get taps and timing. In person, also watch their face and hands.
- **Say only this:** "This is a game called Strata. Play it however you like. Thinking aloud helps, but you don't have to. I can't answer questions while you play." Then say nothing until the end, even if they're stuck. Note where you wanted to help.
- **Length:** first launch until they've played their first First Light puzzle, or 15 minutes. Then they close the app fully, wait a minute, and open it again to play one more.

## What to note (with the recording's timestamp)

| Moment | Watch for |
|---|---|
| Card → title | Do they touch the screen during the card? |
| Title: the stone | Time to the first touch; do they touch elsewhere first; did the fingertip hint appear before they touched? |
| Name written | Do they wait, tap, swipe, or look lost? Time to leaving the title. |
| Map arrives | Do they tap Learn on their own? How long? Do they try other things (mist, buttons) first? |
| Lessons | Any stall over 10 s (which lesson and step); do they read the card at the top or look at the block; do they use Skip; mistakes. |
| Back on the map | Do they react to Learn being marked done, the trail drawing on, the mist parting? What do they tap next? |
| Relaunch | Time from opening the app to the first move in a puzzle; do they find their stone without scrolling? |
| Throughout | Anything they needed sound for; anything they said out loud. |

## Afterwards (ask in this order, don't lead)

1. "What did you just finish, before the map came back?" (the question above)
2. "What do you think the map is for?"
3. "What would you do next, if you kept playing?"
4. "Was there a moment you weren't sure what to do?"
5. "Anything you liked or disliked?"

## What would count as working

These are our guesses at a bar, not research figures.

- At least 4 in 5 say, unprompted, that they finished learning or the tutorial (question 1).
- At least 4 in 5 tap Learn within 10 s of the map arriving.
- Nobody stalls more than 10 s on the title.
- On relaunch, the first puzzle move comes within about 10 s on their phone.

If someone fails one of these, look at where in the recording it went wrong before changing anything. Mini Metro's team went "too minimal" and had to add guidance back, so adding a small cue is an acceptable fix.

## Before running it

- The new opening has to be on the device: the web app (a push to master deploys it) or a TestFlight build (needs Kellan).
- Record the results below: one row per tester, then what changes.

## Results

| Tester | Plays games? | Q1 answer | Stone → touch | Title → map | Map → Learn | Stalls | Relaunch → move | Notes |
|---|---|---|---|---|---|---|---|---|
