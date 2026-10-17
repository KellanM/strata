# Game loop study: ustwo's design practice, and star ratings

Date: 2026-10-17. This file records the study. Read it before repeating the research.

## Brief

Make the whole loop of play, reward and unlock feel good, so players want to keep going and keep unlocking things on the map. The user explicitly asked for a 3-star rating with a rolling score, like Angry Birds. The tone stays calm, in the manner of Monument Valley.

## Sources (gathered by two research subagents, with URLs in their reports)

- **Ken Wong**
  - Kotaku: the "album" analogy.
  - Architizer: one idea per screen; Totem's emotional pull.
  - ANIMAL: collecting and unlocks are "an artificial layer"; "Ida doesn't collect anything… she gives something back".
  - Kill Screen: cut "70, 80, 90 percent".
  - Engadget, reporting his GDC 2014 talk: players watch the character, so changes must be loud.
- **Dan Gray** (Wallpaper): "all killer, no filler"; each level has its own core mechanism.
- **John Lau** (Unity, MV3): every level should be art you could print and hang.
- **Todd Baker** (A Sound Effect, MV2): randomised navigation pings tuned to each level; a musical sting when a phase completes; "not overuse musical interactions".
- **Todd Baker and Lucie Treacher** (MV3): each chapter has its own sound; transitions are built from the audio of the destination; the colour of fade-outs is designed.
- **Adrienne Law** (It's Nice That, Assemble with Care): objects you can turn and look at from any side; a calm narrator; each object carries a story.
- **Manesh Mistry** (PocketGamer.biz, Alba): "stripping back"; "respect the player's time"; cataloguing species.
- **Star systems**
  - Picross 3D (DS): stars for solving, for beating the time limit and for no strikes; the criteria are stated.
  - Angry Birds: hidden score thresholds plus a bonus for unused birds.
  - Picross 3D Round 2: a reviewer said the timer "made me want to rush".
  - Kotaku (Fahey): "when they stop coming, I stop playing".
  - Defold's level-complete sample: the timing of the count-up.
- **Not accessed:** the video of Wong's GDC Europe 2014 talk, the MV3 mini-documentary and the Creative Review article (paywalled). I found no ustwo source on haptics.

## Tension, and the user's decision

Monument Valley has no score, stars, timer or lives, on purpose (Wong). The user asked for stars anyway, so they are built in the form the research supports for a calm game:
- stars are earned for a clean hand, not speed;
- the criteria are stated up front;
- you always get at least one star;
- tools never cost a star;
- the score only goes up;
- there is no timer pressure.

It's built (`public/js/score.js`, commit "three-star results"). Open question: whether stars should unlock anything. If they do, only optional extras; never the main path.

## Prioritised hit list (not built yet)

| # | Change | Why (evidence) | Cost |
|---|--------|----------------|------|
| 1 | **Chiselling plays notes.** Each removed cube plays a soft note from a pentatonic scale in the chapter's key, with a timbre per chapter (WebAudio synthesis, no audio files). A gentle sting when a row is completed, a phrase on solving. Keep it sparse. | Baker's pings in the level's key and stings when a phase completes; Treacher's sound per chapter. Strata has no sound at all today. | S |
| 2 | **Solved objects live on the map.** The revealed object shrinks onto its stone and replaces the plain cube, so the map gradually becomes a gallery of everything you've uncovered. | Wong's "gives something back", plus the Gardenscapes "restore the place" loop, without any currency. | M |
| 3 | **Light returns to the map.** Unsolved chapters are misty and desaturated; each solve brings back colour, rays and motes; finishing a chapter triggers a one-off transformation, such as a bridge appearing or the path extending. | Alba's island heals as you play; a big moment per chapter. | M |
| 4 | **Chapter title cards** with a Roman numeral and one poetic line, and a short wordless vignette when a chapter ends. | MV's chapter cards (observed in the game); Wong: "people can work it out for themselves". | S |
| 5 | **One line of story per object**, shown on reveal and gathered in a journal where you can turn the objects. | Assemble with Care's object stories; Alba's catalogue; Picross 3D's object-as-reward. | S–M |
| 6 | **Map-to-level transitions.** Zoom into the stone, fade through the chapter's colour, and fade the level's sound in. | Baker's MV3 transitions and coloured fades. | S |
| 7 | **A companion on the map.** A small traveller walks the path to the newest stone and sits beside new objects. | Wong on Totem. | M |
| 8 | **Optional star shrine per chapter.** One bonus level that opens at, say, 12 of 15 stars. It never blocks the main path. | Picross 3D's stars open bonus puzzles; the critique of gating progress behind stars. | M |
| 9 | **Audit the levels.** Each level should have one distinctive idea and an opening frame you'd print. | Wong's album analogy; Gray's "no filler"; the "print it" goal. | ongoing |
| 10 | **Make state changes loud.** For example, a satisfied row glows briefly. | Wong's playtest finding. | S |

Suggested order: 1, then 2 and 3 (the core of the map loop), then 4, 5 and 6, then 7 and 8.

## Validation limits

All checks so far are headless screenshots. Nothing has been tested with real players, and nobody has felt the stars and score timing on a phone.
