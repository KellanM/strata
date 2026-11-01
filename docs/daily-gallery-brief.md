# Brief: designing Daily Stone candidates (gallery pages 18 and 19)

For each agent designing one section of a daily gallery page. Read all of it before you start.

## Why these matter

Kellan (2026-10-31): daily stones "should be some of the best assets we've created yet as they sit at the top of the funnel to get people interested in the game". A stranger opens one from a shared link, plays it, and the reveal has to make them grin and want tomorrow's. Hold the highest bar the gallery has had, and prefer 8 superb candidates to 8 fine ones.

## What Kellan picks (learn from these)

**His 14 daily picks from page 18 (2026-11-01):**
- Piggy Bank, Instant Camera and Rabbit in a Hat (`page18/icons-1.js`);
- Chicken Crossing (`moments-1.js`);
- Sword in the Stone, Frog Prince, Genie and Baba Yaga's Hut (`wonders-1.js`);
- Black Cat, Nutcracker and Melted Snowman (`seasons-1.js`);
- Cloth Tiger, Troll Doll and Sock Monkey (`toys-1.js`).

**The pattern:**
- folk and fairy-tale things with a twist;
- toys with a face;
- dated stones;
- everyday objects with charm;
- dry humour.

He picked **no food** (Hamburger, Milkshake) and few plain animals.

**The level picks he made earlier** (pages 15–17): Highland Cow, Red Grouse, Drystone Sheepfold, Ocean Sunfish, Broody Hen, Yawning Hippo, Scorpion, Grapes, Monk, Akabeko, Goldfish Lantern, Basket Dog, Moose, Haniwa, Sphinx, Grass Snake, Broomstick, Cloud Fisher.

**His all-time favourites:** Pegasus Foal (`page8/clouds-1.js`), Origami Fox (`extra/temples-1.js`) and Meerkat Lookout (`page7/desert-1.js`).

## Hard constraints (every candidate)

- **Exclusive:** never a level or an existing candidate. Grep `name:` in both quote styles in `public/js/shapes.js` and across `public/gallery/**`, including page 18 and every other page 19 section as they appear. Avoid near-duplicate outlines too.
- **The daily's band:**
  - D between 9.5 and 12.0;
  - **taps 90–180** (trimmed bounding box volume minus cubes);
  - 4–10 waves;
  - must pass `judge()` in `public/js/daily.js`. Run it with node on the candidate, trimmed to its object.
- **Clue settings:** write `fraction` and `seed` on every entry. The game's defaults (0.85 / 7) differ from the gallery's (0.65 / 1).
- **The grid** has no empty slab at any edge, no side over 10, one piece, and is solvable.
- `node tools/voxel-lint.mjs page19/<key>-1` is clean, and `node tools/gallery-check.mjs page19/<key>-1` shows problems: 0.
- **The 180-tap ceiling means compact, fairly full objects.** Wide, thin or spread-out things (open wings, long necks, thin poles) won't fit; a page 18 designer found Pegasus Foal would need about 307 taps.

## Craft rules

Read in full:
- `docs/voxel-study.md`, the "Silhouette and character" (14 ranked rules) and "Dithered light" sections;
- `docs/silhouette-study-sources.md`.

In short:
- name it at 40 px;
- the identity feature sets the outline;
- colour blocks are parts;
- face the camera;
- the pose is the behaviour;
- notches, not holes;
- author flat colours, which the game lights.

**Process: silhouette first.**
- Brainstorm about 15 ideas.
- For each, comment its name, identity feature, pose or moment, and 2–3 colour parts.
- Keep the 8 most distinct.

**House style** (copy `page18/toys-1.js`):
- a header comment with the rejects;
- named colour constants;
- an IIFE per candidate;
- ids `cand-p19-<slug>`;
- a one-line `story` in the game's dry, warm voice, at most 14 words.

**Dated stones:** say the date in the comment.

## Look at your work

1. Run `PORT=<your port> node server.js` in the background.
2. Run `node tools/qa-sheet.mjs <port> page19/<key>-1 palette=<your palette>`; output goes to `shots/qa/`. It has silhouette and 40 px panels.
3. Iterate until each candidate is nameable at 40 px.
4. Also view `http://localhost:<port>/gallery/index.html?page=19`.
5. Stop the server.

All the browser tools share the lock folder `C:/Users/Kellan/AppData/Local/Temp/strata-browser.lock`. Ten agents use it at once, so expect to wait your turn. Remove it only if it's stale and no tool process is running.

Write only your own section file, don't commit, and leave no scratch files in the repo.

## Report

- the 8, with dims, cubes, taps and D;
- each one's identity feature and moment, and the date for dated stones;
- which pick or favourite each learns from;
- the QA sheet path;
- the rejects;
- your honest top 3.
