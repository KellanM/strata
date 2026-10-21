# Story study: giving Strata an arc

Date: 2026-10-21. Read this before repeating the research. Frames for the
recommended concept are in `docs/story-frames/`; working captures and
exemplar contact sheets are in `shots/story-study/` (git-ignored).

## Brief

Kellan: "Any ideas related to [giving the game an arc]? How have other games
worked on this? Like saving the princess in Mario or saving Zelda... Are
creatures trapped in stones by a force and we need to free them and bring
life back to the world?"

Strata has a world (a sea of cloud, fifteen island chapters from dawn to
night, a companion walking a gold trail, the Drift under a night sky) but no
arc. Nothing says what the companion walks toward or what happens after the
fifteenth chapter.

**Non-negotiables** (Kellan, earlier): Journey and Monument Valley first,
then Shadow of the Colossus: mythic, vast, a call to adventure, beautiful but
minimal, close to a work of art. Cosy is off-brand. Show only what's needed;
no labels or breakdowns; results staged in the scene. Wordless or nearly so.
Mobile-first, short sessions. The core mechanic doesn't change.

**Criteria for this brief** (mine, not a universal score):
1. **Minute one.** A player sees the goal, or its absence, before the first
   stone, without reading anything.
2. **Each chapter changes the world.** Finishing a chapter visibly changes
   something you'll see again, not a number.
3. **Wordless.** It works with no new text. Existing one-line stories may
   carry it, but nothing may *depend* on reading them.
4. **Fits what's there.** It explains 158 mixed objects (a toaster, a whale,
   a mikoshi, a black smoker) without retconning them, and gives the Drift a
   place.
5. **Not cosy, not preachy, not dark for its own sake.**
6. **Cheap in this codebase.** It reuses the title pan, the peaks, the
   companion, the gold, the palettes.

## What the game already says (baseline, read from code)

There is more latent story than it seems. It falls into four threads.

- **The stone keeps things.** Five chapter lines say so: "Morning finds what
  the stone was keeping" (I), "Green things grow slowly inside the quiet
  rock" (III), "Every seed keeps a shape it has not shown" (IV), "Older than
  names, the stones are still listening" (X), and the last chapter's line:
  **"What the sky let fall, the stone held"** (XV). Objects agree: the Cat
  "has slept in this rock since before the moss"; the Fish "swam into the
  stone and decided to stay"; the Geode is "a dull grey stone, holding a
  night sky inside"; the Owl "watched every star fall, and kept a list".
- **Someone walked ahead of you.** First Light is full of it: the Candle "lit
  before dawn, so the first visitor would find the way"; the Teapot "still
  warm. Someone was here a moment ago"; the Key "fits a lock somewhere further
  down the trail"; the Steps lead "to a door nobody has opened yet"; the Bed
  is turned down "for someone coming home". Beacon Hills: a fire "lit for
  you"; the Watchtower: "someone up here has been watching the road for you";
  the Great Beacon: "When you light it, they will see it from the sea." Later:
  the Lighthouse keeper "left the lamp lit, just in case", the Alpine Hut's
  "lamp in the window for climbers coming down late", the Pocket Watch "kept
  someone company on a very long journey".
- **Lights.** Candle, Beacon, Torchbearer Fox, Lighthouse, Anglerfish ("it
  brought its own lamp"), Brass Lantern, Paper Lantern, the whole Lantern
  Festival, the Star ("the first one out, so the others know where to go").
  The companion (`map.js`, a two-block Totem with one eye) carries a small
  gold lamp, "the gold of the trail it walks", and the map's rule is that
  **gold means progress only** (map-study.md).
- **A day that ends in night.** The chapters run dawn to night (Dawn palette
  to Night). The title is a night sky that pans down through the horizon onto
  the map; the map ends at Starfall, then the Drift, then a long empty night
  sky (`shots/bottom-end.png`). The game already *starts and ends in stars*,
  with nothing in between them yet. The last shrine is the Crescent Moon:
  "The moon came down to rest, and forgot to leave."

The twelve lessons (Pillar, Step, Plinth, Wall, Arch, Colonnade, Rune, Cairn,
Stair, Cornerstone, Geode, Dolmen) are a builder's vocabulary of stone, and
the Beacon Hills summit already shows a lit fire (`chapter-next-sheet.png`).

What the game does not have: a goal visible from the start, any change to
the world when a chapter ends (beyond the next chapter's cloud parting), an
ending, or a reason for the Drift.

## Sources and inspection

Each finding has four parts: **C** a practitioner claim with its source; **O**
observed evidence with a video id and time; **I** my interpretation; **A**
what to apply to Strata.

**How things were inspected.** I can't play these games here. I read
interviews and talk pages; re-read the contact sheets already made for the
map study (`shots/map-study/exemplars/`: Journey PS3 longplay bkL94nKSd2M
0:00–77:05 every 30 s, Sky realm gates eLm48_klF3I, SotC, MV1–3); and grabbed
new frames from YouTube in Chrome for Monument Valley 1 (7RcB1R7iVe4),
Gorogoa (g9N_tyMyMOw), Gris (9z6t9veznXg) and Okami (ERKofit71sI), into
`shots/story-study/sheets/`. yt-dlp is blocked (HTTP 403), so the frames are
seek-and-screenshot stills from fan no-commentary footage at about 360p, not
continuous viewing. No audio. Where a point rests on memory or a wiki, it
says so.

### Rescue: Super Mario Bros. and Zelda (why "save X" works, and why it's wrong here)

- **C.** Miyamoto: "the structure of the gameplay always comes before the
  story... what is the most natural story to take place within that
  structure" (Kotaku via [MCV, 2013](https://www.mcvuk.com/miyamoto-on-the-damsel-in-distress/)).
- **I.** The princess is a destination label for a left-to-right run with a
  castle at the end of each world. It works because it is one noun, stated
  once, and the structure (worlds, castles, "your princess is in another
  castle") repeats it. It needs a villain, a captive and text, and it frames
  the world as an obstacle course.
- **A.** Take the structure, not the content: **one noun, set up once,
  repeated by the structure at every chapter end.** Strata has no enemies and
  no peril, so a rescue would import a villain the game doesn't contain.

### Journey (thatgamecompany, 2012)

- **C.** Chen: "The game's goal is simple: go to the mountain." "We used the
  environment to guide the player without using words, or compass, or map"
  ([Push Square, 2012](https://www.pushsquare.com/news/2012/02/interview_thatgamecompany_journey)).
  "You need to form an emotional arc like in a Hollywood movie with a three
  act structure... to create a climax you need a low moment"; mid-game "the
  mountain has disappeared"; the end is "kind of like a flashback with it all
  together just to see how beautiful life is"
  ([WhatCulture, 2013](https://whatculture.com/gaming/bafta-nominated-journey-director-jenova-chen-interview)).
  Campbell's Hero's Journey shaped it; *Koyaanisqatsi* showed him "I can
  create an emotional narrative arc without plot, character, or dialogue"
  ([Engadget, 2012](https://www.engadget.com/2012-11-07-hit-list-qanda-jenova-chen-thatgamecompany-president.html)).
  Nava: the mural is "this really long image... you kind of uncover
  throughout the game" (GDC, RoHrwAacTwo 23:35, map-study J3).
- **O.** bkL94nKSd2M: the mountain with its beam over a dune crest at
  1:06–2:26; the mural rooms between chapters (42:30–50:30: glyph walls, the
  white-robed elders); the snow climb greys and slows (51:00–69:00) until the
  screen goes white (69:30–70:00); then a burst upward in colour
  (70:30–73:00) and a walk into the light (74:30–75:30).
- **I.** Three tools: a **goal visible from the first frame**; **interludes
  that show the story as pictures** between chapters, not text; and **a low
  before the high** (cold, slow, alone) so the summit means something.
- **A.** Give Strata one thing visible from the title that is plainly
  unfinished, a quiet moment at each chapter end that shows it changing, and
  let the last chapters cool and empty before the ending fills.

### Monument Valley 1 (ustwo games, 2014)

- **C.** Wong describes the story as a symbolic "song" rather than a book
  (Polygon via [Wikipedia](https://en.wikipedia.org/wiki/Monument_Valley_(video_game)));
  collecting and unlocks are "an artificial layer"; "Ida doesn't collect
  anything… she gives something back" (ANIMAL, already in
  game-loop-study.md).
- **O.** 7RcB1R7iVe4 (`sheets/mv1_0-99999.jpg`): the last chapter,
  Observatory, is the game's only night: an impossible cube under stars
  (41:05–41:30). After it, Ida stands on a small plinth in a dark field of
  crow people under a starry sky (42:20). They turn into colourful birds and
  rise into the night above her (42:45–43:10); then the title (43:35). No
  text in any of these frames. I did not capture a level-end altar moment, so
  that part rests on memory.
- **O, the ending.** The payoff is *things rising into a night sky* over a
  tiny, still hero. That is concept A's ending almost exactly, which is
  encouraging (it is proven, and on-brand) and a warning (it must not look
  copied: Strata's version is constellations that stay, made of the objects
  you found, seen again on every title).
- **I.** The collecting is reversed: the player returns what was taken. Each
  level ends in the same small ritual, so the arc is carried by repetition of
  one gesture, not by exposition.
- **A.** Strata's reveal is already a ritual (the object floats with its
  gems). The arc should be **giving back**, not hoarding: each object or
  chapter returns something to the world.

### Shadow of the Colossus (Team Ico, 2005)

- **C.** Ueda began to doubt "feeling good by beating monsters" and "getting
  a sense of accomplishment" while making it
  ([Cane and Rinse, 2019](https://caneandrinse.com/fumito-ueda-interview/));
  "subtracting design" (1UP on GDC 2004, map-study S1).
- **O.** Map-study S3/S4: unexplored land under drawn cloud; a rider a tenth
  of the frame tall.
- **I.** The quest has a **cost** the player feels without being told. A
  small cost gives weight; a large one would break Strata's calm.
- **A.** One quiet cost at the end, e.g. the companion gives up its lamp.

### Sky: Children of the Light (thatgamecompany, 2019)

- **C/O.** Spirits are freed and return to their realm's constellation; each
  realm gate shows a constellation that fills with figures as you find them
  (eLm48_klF3I 0:48–2:16, a fan guide; official store copy: free trapped
  ancestral spirits and send them home among the stars).
- **I.** Collection drawn as **stars in a shape**, shown in a place you
  return to. The sky is the album.
- **A.** Direct precedent for constellations as Strata's journal-in-the-sky.

### Okami (Clover, 2006)

- **C.** The team chose sumi-e to convey Amaterasu's link to nature and her
  task of restoring it ([Wikipedia](https://en.wikipedia.org/wiki/%C5%8Ckami);
  Kamiya in [Iwata Asks](https://iwataasks.nintendo.com/interviews/wiiu/thewonderful101/0/4)).
  Brush gods hide in constellations "with any number of stars missing"; you
  draw the missing stars to restore them (Okami wiki; not a developer source).
- **O.** ERKofit71sI 0:04–1:16: a guardian sapling blooms and a wave of petals
  rolls outward across a grey, cursed field, turning it green and pink in
  one sweep. (The rest of that video failed to load.)
- **I.** Restoration is staged as **one wave across the land**, not object by
  object, so the payoff reads at a glance. Constellations with missing stars
  are an existing, legible image of "incomplete sky".
- **A.** A chapter's completion should be one gesture across its whole
  island, and a missing star or missing moon reads as "unfinished" without
  words.

### Gorogoa (Jason Roberts, 2017)

- **C.** "I think of the character as a mystic... He's devoted to something
  outside the world, and trying to find it"; "If you don't know where your
  destination is, you don't know how long you have to wander"; "The
  animators, especially with no dialogue, are also the actors"
  ([Kotaku, 2017](https://kotaku.com/the-puzzle-of-a-lifetime-1821235999)).
  GDC 2018: "What is the fantasy at the heart of the game's story and
  gameplay, and how is it rooted in real world emotional and spiritual
  drives?" ([session summary](https://gonintendo.com/archives/282371-gdc-2018-session-gorogoa-the-design-of-a-cosmic-acrostic)).
- **O.** g9N_tyMyMOw (`sheets/gorogoa_0-99999.jpg`): at 15:00 a coloured
  mandala holds the coloured orbs the boy is gathering. The last minutes are
  dominated by an **empty circle** (28:40–30:20), carried from panel to
  panel. At 30:45 a bowl holds all five coloured orbs together; at 31:10 the
  many-coloured creature appears; at 31:35 the credits. No words in any
  frame.
- **I.** The closest match to Strata: a wordless puzzle game whose story is
  one devotion (a boy seeking a creature, gathering coloured offerings),
  where every puzzle is also a picture in the story. The ending is *the
  collection assembled in one place*, preceded by an empty shape the player
  has been looking at for minutes.
- **A.** The arc can be a single devotion carried by pictures; the puzzles
  don't need to "mean" anything individually if the collection does.

### Gris (Nomada, 2018)

- **C.** Secondary only: the team consulted a psychologist on grief; each
  chapter adds a colour (Wikipedia; analyses). I found no primary interview.
- **O.** 9z6t9veznXg (the last part of a longplay series;
  `sheets/gris_0-99999.jpg`): the full palette is back (0:30–8:00); at 10:30
  thin constellation lines are drawn across a night sky above a tower; at
  13:00–15:30 the screen goes black, then to black-and-white ink (the low);
  at 18:00 a line of stars joined by hairlines runs up a lilac sky to the
  statue's open hand: the lights gathered over the game become the way up.
  Credits at 20:30.
- **I.** Colour as the progress bar: the world gains a hue per chapter, and
  nothing else needs to be counted.
- **A.** Strata's fifteen palettes are already a colour strip (map-study J2);
  a chapter's completion can *give its colour back* somewhere you see again.
  And a second precedent (with MV1's ending) for **collected lights becoming
  stars**, so the idea is proven in exactly this genre, and Strata's version
  must be its own: the constellations are the shrines you uncovered, and
  they live on the title, not only in the finale.

### Collection that pays off: Super Mario Galaxy, Monument Valley, Townscaper

- **Galaxy.** Grand Stars power the Comet Observatory's beacon; it changes
  colour with each one, and each opens a dome
  ([Super Mario Wiki](https://mariowiki.com/Beacon_(Comet_Observatory))). One
  object in the hub shows total progress, in light.
- **Florence** (Wong, 2018): "When you're communicating with visuals, music
  and gameplay scenarios then the player can interpret these events as they
  wish... a deeper meaning rather than one that we tell them directly"
  ([MCV, 2018](https://mcvuk.com/?p=23751)).
- **Townscaper** as counterpoint: Stålberg calls it a toy; "no goal" beyond
  the pleasure of building ([Bloomberg, 2020](https://www.bloomberg.com/news/articles/2020-07-24/the-video-game-where-you-build-an-empty-town)).
  An arc is optional; Picross games ship 300 puzzles with none. Strata
  doesn't *need* a plot; it needs a destination.
- **Picross with story.** Murder by Numbers wraps picross in a visual novel:
  each puzzle reveals evidence ([PC Gamer](https://www.pcgamer.com/murder-by-numbers-review/));
  reviews found the story and the puzzles pulling apart. A wordy frame is the
  wrong lesson for Strata.
- **Alba** (ustwo): "as you do that, you kind of realise there's more stuff
  going on on the island. Some stuff is in disrepair" (Mistry, via
  [PocketGamer.biz](https://www.pocketgamer.biz/interview/75834/alba-a-wildlife-adventures-journey-to-plant-one-million-trees-around-the-world/)).
  A catalogue plus a place that heals.

## Mechanisms that transfer

1. **One noun, visible from minute one** (Journey's mountain, Mario's
   princess, Galaxy's beacon). Strata's title is where every session starts:
   that is the place for it.
2. **Give back, don't hoard** (MV, Sky). The collection returns something.
3. **One gesture per chapter, across the whole place** (Okami's wave, MV's
   altar, Galaxy's dome). Not per object; per chapter.
4. **Absence reads before presence** (Okami's missing stars, Journey's
   vanished mountain). A gap in a familiar shape is legible without words.
5. **A low before the high, and one small cost** (Journey's snow, SotC).
6. **The story is a picture, not a sentence** (Gorogoa, Florence, Journey's
   murals). Strata's existing one-liners can stay optional flavour.

## Five concepts

Each is a different answer to "what is the player doing?": returning,
following, waking, building, or nothing at all. Costs are rough: S is about a
day, M two to four days, L a week or more.

### A. What the Sky Let Fall (returning)

- **Premise.** Long ago the sky came down. Every star fell into the world and
  became a thing in it (a teapot, a heron, a black smoker) and the stone held
  each one safe. Peeling a stone frees its star; finishing a chapter sends
  that chapter's light home. Chapter XV's line already says it.
- **The companion** is a star-keeper: the small Totem whose lamp is the one
  star that never left. It wants to carry the lights home.
- **The stones** are what kept the fallen sky. Nothing is imprisoned; the
  stone was shelter ("Morning finds what the stone was keeping").
- **Minute one.** The title opens on a night sky that is visibly *missing
  things*: thinner stars, and a faint ring where the moon should be. Low on
  the horizon, one gold point: the companion's lamp.
- **Each chapter.** When its last stone falls, a gold light lifts off the
  chapter's summit and climbs out of frame. On the next visit to the title a
  new constellation hangs in the sky, drawn in the shape of that chapter's
  shrine (a cottage, a beacon, a tortoise...). Fifteen chapters, fifteen
  constellations, no counters.
- **Ending.** Starfall's last stone. The camera rises back up the whole map
  (the title's descent, reversed) through every chapter, into a sky that is
  now full; the moon is back in its ring. The companion opens its lamp and
  lets its own star go up last. It stands lampless and small at the
  horizon; the trail behind it is lit by the sky instead. No text.
- **Objects and the Drift.** Any object can have been a star, so the mixed
  set needs no retcon; the journal becomes a star atlas. The Drift is the
  sky that is *still* falling: after the ending, each Drift solve adds a
  shooting star to the empty night below the map (`bottom-end.png` is
  already that empty sky).
- **Arc.** Dawn to night is already the palette strip, so the late chapters
  darken (Journey's low) while the title sky fills (the high). The cost is
  the lamp.
- **Risks.** Stars could read as a progress counter (keep them sparse, no
  numbers, no tap targets). "Things are stars" could tip into whimsy (keep it
  vast: big empty sky, tiny companion, slow). The ending lives on the title,
  so a player who never returns to it misses the build-up (mitigate: the
  ending pan forces one pass).
- **Cost: M.** The title stars are already pre-drawn canvas sheets in
  `mapworld.js`; constellations are one more sheet (S). The rising light on
  chapter completion fits the existing cloud-parting ceremony in `map.js`
  (S). The ending pan reverses the title descent, plus the moon and the lamp
  (M). Drift shooting stars (S). No new 3D art; the constellations come from
  the shrines' own voxels.

### B. The Lamp Road (following)

- **Premise.** Someone walked this road before you and lit a fire on every
  summit. The fires have gone out. You relight them, chapter by chapter, and
  at the end you find out who walked ahead.
- **The companion** is the next walker. It follows the warm teapots, the
  candle, the watchtower "watching the road for you".
- **The stones** are what the walker left behind: gifts and waymarks.
- **Minute one.** From the title, along the horizon, a line of fifteen dark
  beacon summits receding, the first one lit.
- **Each chapter.** Its signature summit takes a gold flame that stays lit on
  the map; scrolling the map shows the chain of fires growing behind you.
- **Ending.** At the last summit there is no one, only a lamp left on a
  stone. The companion takes it, turns, and the map plays back to First
  Light, where it lights the Candle and warms the Teapot for whoever comes
  next. The player became the "someone" of chapter I.
- **Objects and the Drift.** Animals sit oddly as "things left behind"; the
  Drift is new travellers' roads.
- **Arc.** The cycle (Journey) and the call to adventure (Beacon Hills
  already names it).
- **Risks.** The twist depends on players remembering chapter I's one-liners
  (it fails without the text). Fires on every peak need lit and unlit
  versions of all fifteen pre-rendered summit sprites.
- **Cost: M.** Re-render peaks with a flame layer (`tools/render-peaks.mjs`),
  title horizon chain (S), return-walk ending (M).

### C. The Long Stillness (waking; Kellan's idea, reframed)

- **Premise.** A long stillness lay over the world. Everything in it went
  into the stone to wait. Each solve wakes one; each chapter wakes a land.
- **The companion** is the one thing that stayed awake, carrying the last
  ember.
- **The stones** are shelter, not prisons: no villain needed. (A "force that
  traps creatures" brings an enemy the game never shows, and a trapped
  toaster is funny in the wrong way.)
- **Minute one.** The map is grey and silent ahead of you; only First Light
  has colour.
- **Each chapter.** One wave (Okami's bloom) rolls over the island: colour,
  sound, the solved objects begin to move on their stones.
- **Ending.** The last chapter wakes, and the dawn of chapter I comes round
  again, the night sky under the Drift turning to morning.
- **Objects and the Drift.** Fits every object; the Drift is things still
  sleeping.
- **Arc.** Gentle, but it has no low and no cost.
- **Risks.** The most cosy of the five; "bring life back" is the most common
  mobile meta (Gardenscapes, Merge Mansion) and reads like one. Desaturating
  unreached chapters fights the map's desire rule (a locked chapter should
  look *wanted*, map-study criterion 2). Moving objects on the map is the
  map's slowest path on phones.
- **Cost: L.** Per-chapter desaturation and the wave in `mapworld.js`,
  animated objects (new per-object motion), frame-rate risk on the map.

### D. The Strata Tower (building)

- **Premise.** On the horizon stands a broken tower of fifteen bands. Each
  chapter's shrine restores one band in that chapter's colour. Complete, it
  is the game's colour script stood on end.
- **The companion** is its keeper, carrying each band home.
- **The stones** are quarry: you are cutting the tower's stone, and keeping
  what was inside it.
- **Minute one.** The grey tower on the title horizon, its top missing.
- **Each chapter.** A band lights in the chapter's palette.
- **Ending.** The fifteenth band, then the companion climbs and sets its
  lamp at the top: a lighthouse for the next traveller.
- **Objects and the Drift.** Objects are incidental, which is honest but
  thin; the Drift is the tower's foundation, endless.
- **Arc.** Satisfying collection (Galaxy's beacon), little feeling.
- **Risks.** A new hero asset that must hold up at title size; a tower reads
  as a progress bar.
- **Cost: M–L.** A voxel tower with fifteen states, a title placement, the
  climb.

### E. No plot: the Atlas (the counterpoint)

- **Premise.** Keep Strata a picross album (Townscaper, Picross). Add only an
  end: when the last chapter is done, the camera rises over the whole map,
  every object on its stone, and stops in the night sky.
- **Cost: S.** **Risk:** it answers "what happens after XV" but not "what am
  I walking toward", which was the question.

## Recommendation: A, What the Sky Let Fall

| | A Sky | B Lamp Road | C Stillness | D Tower | E Atlas |
|---|---|---|---|---|---|
| 1 Minute one | missing moon, one gold star | dark beacon chain | grey map ahead | broken tower | none |
| 2 Chapter changes the world | constellation in the title sky | fire on its summit | colour wave | a band lights | none |
| 3 Wordless | yes | the twist needs chapter I's text | yes | yes | yes |
| 4 Fits 158 objects + Drift | anything was a star; Drift = still falling | animals strain "left behind" | yes | objects incidental | yes |
| 5 Not cosy / preachy | vast, one small cost | cyclical, a little sentimental | the cosiest | neutral | neutral |
| 6 Cost | M | M | L | M–L | S |

Why A:

- **It is already the game's last line.** "What the sky let fall, the stone
  held" (XV), "Morning finds what the stone was keeping" (I), the Geode, the
  Owl, the Star, the Crescent Moon shrine. A builds on what Kellan wrote rather
  than replacing it, and the mixed objects need no explanation.
- **The title is the right stage.** Every session starts on the night sky and
  pans down to the map. A puts the arc there, so the player sees their whole
  journey for two seconds every time they open the game: Journey's mountain
  and Galaxy's beacon in the one screen that is already pure scenery.
- **Giving back, not hoarding** (MV, Sky). The constellations are made from
  the shrines' own voxels, so the sky is the journal returned to the world.
- **It has a low and a cost.** The palette strip already darkens toward
  Starfall while the sky fills; the companion gives up its lamp. That is the
  SotC note at Monument Valley volume.
- **It costs no new 3D art**, and it uses gold correctly (gold = progress:
  the lamp, the rising light, the Drift's falling stars).

Keep from B: the companion lighting the First Light Candle in the ending's
last beat is a lovely echo, and works inside A if the ending pan passes
through chapter I. Keep from C: Kellan's "bring life back" survives as the
reframing that **the stone was shelter, not a prison**: no villain.

## Experiment: styleframes

**Question tested:** can concept A's arc be read from the title alone, with
no words, without cluttering the screen Kellan already likes?

**Method.** Real screens from the game (390×844 phone, port 5240, seeded
saves), with the concept painted on a canvas over the live page
(`shots/story-study/frames.mjs`; no game code changed). Constellations are
generated from each shrine's own voxels (`renderThumb` silhouette, a star per
well-covered cell, thinned to seven by farthest-point sampling, joined by a
minimum spanning tree). Three passes:

- **v1** (`shots/story-study/out/`): rejected. A dark veil to "thin the sky"
  also greyed the logo; constellations of 14–20 stars with heavy glow read as
  dot-matrix blobs, not stars; a dashed ring for the missing moon read as a
  UI selection; the full sky smothered the wordmark.
- **v2** (`out2/`): constellations cut to seven stars and hairlines, the
  missing moon as a starless dark disc. Much better, but a veil with holes
  left a visible band around the wordmark.
- **v3** (`out3/`, copied small to `docs/story-frames/`): no veil (a real
  build would draw fewer stars instead), the moon's glow fixed.

**Frames** (`docs/story-frames/storyboard.jpg` shows them in a row):

| Frame | Shows |
|---|---|
| `00-title-today.jpg` | Baseline: today's title. |
| `01-minute-one-title.jpg` | Minute one: a starless dark disc where the moon should be (top right) and one gold point low on the horizon, the companion's lamp. |
| `02b-first-light-done-light-rises.jpg` | First Light's last stone solved: a gold glow on the red-roofed summit and a thread of light rising off the top of the screen. |
| `03-title-after-chapter-I.jpg` | The next title: one small constellation (the Cottage's stars) top left. |
| `04-title-after-chapter-VIII.jpg` | Eight constellations around the logo. |
| `05-title-ending-full-sky.jpg` | The ending: fifteen constellations, the moon back in its place, the companion's gold star let go at the top of the sky; no lamp on the horizon. |
| `06b-drift-stars-still-falling.jpg` | After the ending: gold stars still falling into the night below the Drift. |

**My assessment** (not a player test):

- **Purpose and comprehension.** The *progression* reads: the sky visibly
  fills from 01 to 05, the dark disc is noticed and reads as "missing", and
  the filled moon resolves it. Without words, a player would likely read "my
  progress lives in the sky"; whether they read "the things I uncovered
  *were* stars" is not established and probably needs the ending's motion
  (the light lifting off, the camera rising). The constellations do **not**
  read as their shrines at this sampling; they read as abstract
  constellations. That is acceptable (real constellations are abstract) but
  if the shapes matter, each needs hand placing.
- **Creative execution.** v3 stays minimal at 1 and 8 chapters. At 15 it is
  busier than anything else in the game's UI, but it reads as sky, not
  interface, because nothing is numbered, aligned or tappable. Fifteen is the
  upper limit; I'd test 15 smaller ones, or let the earliest fade as others
  arrive. The chapter-end thread is right in place and colour but faint at
  storyboard size: on a phone it would need motion (and probably a sound) to
  land. The gold lamp on the horizon in 01 is the weakest frame: it floats
  without a reason until you know the story.
- **Technical.** Overlays only; positions are hand-set around the wordmark
  and cube; no motion, no performance cost measured.

**What this disproved:** heavier "absence" (darkening the whole sky) hurts
the title more than it helps; absence works only as one precise gap (the
moon).

## Prioritised hit list (nothing built; for Kellan's go-ahead)

| # | Change | Why (evidence) | Cost | Review |
|---|---|---|---|---|
| 1 | **A constellation sheet in the title sky.** One per completed chapter, drawn from its shrine's voxels: 5–7 stars, hairline links, no glow beyond the existing stars. Fixed places clear of the wordmark and the cube. | Sky's realm constellations; Galaxy's beacon; one noun from minute one | S | The title at 0, 1, 8 and 15 chapters on a phone: does it read as sky, not a counter? |
| 2 | **The missing moon.** A ring in the title sky with no stars in it, filled at the end. | Okami's missing stars; absence reads before presence | S | Does a first-time player notice it at all? (it may need to be larger) |
| 3 | **The light lifting off a finished chapter.** After the last stone's reveal, a gold thread rises from the chapter's summit and leaves the top of the screen; it plays once, inside the existing cloud-parting ceremony. | MV's end-of-level ritual; Okami's one gesture | S–M | Is the moment legible with no text, and short enough (≤2 s)? |
| 4 | **The ending.** After Starfall's last stone: the camera climbs back up the map to the full sky, the moon returns, the companion lets its lamp go. | Journey's flashback and ascent; SotC's cost | M | A full storyboard first; then a real build on a phone |
| 5 | **The Drift keeps falling.** After the ending, each Drift solve sends a gold shooting star into the empty night below the map. | Endless mode with a reason | S | Does it stay quiet? (one star per solve, no counter) |
| 6 | **Let the late chapters cool.** Check that Frost → Cloud Isles → Starfall get quieter and emptier before the end (sound, motes). | Journey's low before the high | S | Listen through XIII–XV |

Suggested order: 1 and 2 together (they make minute one), then 3, then
storyboard 4 with Kellan before building it, then 5 and 6.

## Honest limits

- **I played none of these games.** Evidence is interviews, wiki entries
  where marked, and stills from fan no-commentary longplays at about 360p,
  grabbed by seeking in Chrome (yt-dlp is blocked). Stills are not
  continuous viewing: timing, motion and music are not judged. No audio.
- **Partial footage.** The Okami restoration video failed after 1:16; the
  first MV1 pass hit "Something went wrong" pages, so MV1 has 12 usable
  frames. The Journey and Sky sheets are re-reads of the map study's.
- **Not accessed:** Chen's GDC 2013 *Designing Journey* (Vault login), Ken
  Wong's GDC talks, Roberts' GDC 2018 talk itself (only its summary), any
  primary Nomada interview on Gris's colour, any primary Sky story talk.
- **The styleframes are overlays on real screens**, drawn in a canvas over
  the live game; they show composition and legibility, not motion, timing or
  performance. The constellations are generated from the shrine voxels by a
  quick sampling rule; a real build would hand-tune each one.
- **No player has seen any of this.** My judgements of the frames are mine.

## Questions only Kellan can answer

1. **Which concept?** A (recommended), B, or a mix (A with B's candle beat).
2. **Is the companion allowed a cost?** Giving up its lamp at the end is the
   one sad note. Too much, or right?
3. **Where does the ending trigger?** The last *main* stone of Starfall
   (today the Observatory), not an optional shrine. Should the Crescent Moon
   move from Starfall's shrine to a final, required stone after Starfall (a
   wordless chapter "XVI" of one puzzle), with a new Starfall shrine?
4. **Does the title change at all?** A changes the title sky every time a
   chapter ends. Is the title sacred (logo, rays), or can the sky carry
   progress?
5. **Constellation shapes:** from each chapter's shrine (as drawn), or from
   its signature summit landmark, or a hand-drawn emblem per chapter?
6. **Do the one-line stories change?** None need to. A few could lean in
   (e.g. the Star, the Owl), but they should stay optional.

## Kellan's decisions (2026-10-21)

- **Concept A**, What the Sky Let Fall. **Triumphant** ending, not bittersweet.
- The stars fell to earth **as meteors**.
- Open, under discussion: *why* they fell, whether there is an antagonist, and
  what the fall did to the world. Proposal in chat: the antagonist is a force,
  not a character, and its body is the sea of mist already on the map (see below
  once decided).

**Update (2026-10-21, later):**
- The antagonist is a **pure force, and its body is the mist**. No face, no fight.
- Kellan's motive: it wanted the world in darkness, so it **pulled the stars and
  the moon out of the sky**. This replaces the "the moon held the stars up" framing,
  which was hard to follow.
- The frame: *long ago this calamity happened and the world was dropped into darkness.*
- Open: the antagonist's name. The exposition idea is Kellan's: a lantern-lit voxel
  cave wall, painted like a cave painting.
- **Name: the Gloam** (Kellan, 2026-10-21). Exposition: the ~30 s lantern-lit voxel
  cave mural, five panels, with real mist tendrils dragging the painted moon and stars
  down. A throwaway spike is at public/proto/cave.html.

## Cave spike (2026-10-21)

**Built.** `public/proto/cave.html` (+ `public/proto/cave/*.js`), live at
https://kellanm.github.io/strata/proto/cave.html. A 32 s wordless sequence on a
236 × 104 voxel cave wall (stone heightfield, ribs of rock between five painted
panels) lit only by the companion's lantern: a warm, flickering point light with
a soft Gaussian falloff, carried along the wall with a step-bob. Pigment is
per-voxel: ochre, earth red, charcoal, pale clay for the Gloam, and gold for the
sky's lights (gold flakes are tilted per voxel so they glint as the flame moves).
Tap to begin (this also starts the sound, for iOS), tap to skip, a replay ring at
the end. `?t=17&still` holds any frame; the whole sequence is a function of t.
Contact sheet: `docs/story-frames/cave-spike.jpg`.

**Choices.**
- **No text at all**, not even "GLOAM". The mist is its only name; the word would
  be the one label in an otherwise painted world. Easy to add as a carved glyph if
  wanted.
- **The Gloam is pale, cold clay in paint and cold blue-grey in the real mist**,
  so it reads against the warm stone and lantern (warm = life, cold = the Gloam).
  The real tendrils rise out of the painted mass in panel 3, coil round each star
  and the moon, drag them down, and let go; the stars ignite and streak right as
  meteors, lighting the wall as they pass (each meteor is a real light), and the
  camera follows them into panel 4.
- **Stone closes in horizontal bands** (strata), bottom up, as low domes outlined
  in charcoal: the game's stones in cave-painting form. Each star's gold is the
  last thing covered.
- **The land splits into three broad islands** floating in pale painted mist, the
  same shape as the map's inverted peaks; panel 5 repeats them, figures gone, one
  painted lantern on the middle island. The real lantern stops on it and its light
  closes in before the fade.
- Sound is synthesised (own small WebAudio, not `audio.js`, which is tied to the
  chapter keys): a low drone, a semitone that rubs in when the Gloam rises, a
  chime per star the lantern finds, a breath per grip, whooshes, a rumble, thuds,
  a click per closing stone layer, one warm bell for the lantern; all through a
  generated cave reverb.

**What works** (my judgement from frames on a 390 × 844 viewport, not a player
test): the lantern-on-stone look is moody and the voxel grid reads; panel 1 is
clear (figures, moon, stars) and the gold glints; the painted mist rising in
panel 2 reads as a swell with fingers reaching for the sky; the key beat reads,
because the cold real mist against the warm wall makes the coils round each star
legible, and the shower of meteors across the gap is the most cinematic moment.

**What doesn't yet.**
- The *drag* is the weakest part of the key beat: the coil and the fall read, the
  pull between them is only about 1.5 s and modest. It needs more time or a
  harder yank.
- The stars land as small hot beads that, at a glance, look a little like
  candles. The banded domes read as stones but also a little like acorns.
- Panel 4 is busy for about 3 s (five impacts, cracks, mist, domes, the sky
  darkening at once); it might be calmer with three impacts.
- Real time was checked only in desktop Chrome (≈16.7 ms a frame, 10 draw calls,
  ~150k triangles, pixel ratio capped at 2, stepping down on slow frames). It has
  **not been run on an iPhone yet**; the sound has not been heard on one either.
- Gold reads as gold paint only near the light; far from it, the stars are
  dull ochre.

### Second pass (Kellan's feedback: "the tendrils should look much more evil", and the ground "continuous, not cut up panels... think of real tapestries")

**Looked at** (Wikimedia Commons images, `shots/cave/ref/`): the Bayeux Tapestry
(scene 32, Halley's comet; scene 51, Hastings), a Genji emaki calligraphy sheet,
the Ban Dainagon Ekotoba, Chōjū-giga scroll 1, and a cast of Trajan's Column.
What they do:
- **Bayeux:** one wavy, hummocked ground line carries the whole story. Top and
  bottom borders have their own rhythm (beasts between diagonal bars). Towers and
  trees divide scenes. The comet breaks into the top border while the people
  below point at it. The same people come back again and again.
- **Emaki:** horizontal bands of mist cross the scene as transitions. Gold leaf is
  scattered in squares.
- **Chōjū-giga:** no frames at all; tufts of grass and trees are the only dividers.
- **Trajan's Column:** a continuous low relief carved into the stone.

**Changed:**
- **One continuous frieze** (`mural.js` rewritten). One unbroken hummocked ground
  line runs the whole wall. A top border is the sky band: a gold star between each
  pair of diagonal bars. A bottom border is wavy strata with ammonites, the things
  the stone keeps. The same trio (tall, red, child) recurs:
  - walking under the moon;
  - stopped and pointing as the Gloam rises;
  - cowering;
  - struck to ash.

  The moon recurs too. The scene dividers are:
  - a Bayeux tree;
  - the Gloam's own column of painted smoke;
  - a dead tree;
  - emaki-style bands of the Gloam's mist.

  To the right of the theft the sky band shows empty sockets, so it reads as time
  passing. The land from the impact onward is the same ground broken into islands.
  Figures, ground line and tree are slightly raised, like carved relief. The frieze's
  ends are worn.
- **Evil tendrils** (`Ribbons` in `render.js`): dark ribbons that eat the light, with
  a sickly cold rim, a ragged smoking edge, barbs along their length and clawed,
  hooked tips. They reach in lunges, recoil a little and hunt with their tips. They
  coil as tilted, tightening spirals that cross over the moon like a grip, and
  squeeze. Then the **yank**: a jerk, a give, a harder jerk, a straining hold, and a
  violent tear. That is about 2.2–3.3 s, with a thud and a camera jerk on each pull.
  After that they whip back down. Dark smoke clings to them. The painted Gloam is
  now dark too, with a pale cold rim. No face, no eyes.
- **Meteors** are streaks: a small hot head and a long tail drawn out along the fall.
  The sky band's stars fly on past, toward the far islands.
- **The impact** is calmer: three hits (star, moon, star), smaller flashes, fewer
  sparks. The star sinks as a bead into a scorched crater.
- **The stones** are pale grey banded domes, outlined in charcoal like the game's
  stones. They are no longer earth-red acorns.
- **The rock** is fractured plates, each tilted its own way, with dark seams and pits.
  Voxel edges show only where the rock actually steps, and colour varies by plate,
  not by voxel. It no longer reads as even tiles.
- **Length:** 35.6 s, longer for the yank.

Contact sheet: `docs/story-frames/cave-spike-v2.jpg`.

**Honest read of v2:**
- **Evil and legible:** the tendrils, especially the grip on the moon and the hunting
  hooked tips. The meteors now read as streaks.
- **Continuous:** the frieze holds, borders and all.
- **Still weak:**
  - The tendrils are smooth vector ribbons, crisper than the voxel world round them.
    They may read more as "tentacles/roots" than as mist. Smoke clings to them, but
    they are clearly solid.
  - The small stars' grips are tight knots at the tendril tips. The moon's grip is
    the one that reads at a glance.
  - The yank reads in motion but not in a still.
  - D's islands are a row of similar V shapes.
  - The emaki mist bands in E read as dark dashes rather than clouds.
  - B's Gloam column is partly outside the lantern's light while it rises.
- **Not checked yet:** still not run or heard on an iPhone. Desktop Chrome runs at
  about 16 ms a frame with 11 draw calls, but headless Chrome stepped the pixel ratio
  down to 1.625 during playback, so the cost at ratio 2 on a phone is unknown.

### Third pass (Kellan: "the tendrils look disconnected from the art on the walls... it should feel more evil"; "it looks like the gloam just appears from a random spot... can it creep in from a crack in the wall?")

**Changed:**

- **The Gloam is painted into the wall now.** The vector ribbons are gone. Every
  frame, the tendrils are drawn onto the wall's own voxel grid as a texture the
  stone shader reads (`gloam.js`), with four effects:
  - **Black rock.** The cells they cover turn oily black and push up out of the
    wall as stepped relief, so they read as part of the same carving as the figures.
  - **Thorns and rot.** Thorns grow out of them cell by cell, and veins branch off
    and fork through the paint like rot.
  - **Dead paint.** Paint they have touched dies, draining to dark grey, and stays
    dead after they are gone, leaving scars.
  - **Pulse.** A faint pulse beats up them in time with a heartbeat.

  The moon's gold shows through the coils; the moon cracks along three lines, one
  per jerk of the yank, and gold flakes fall off its rim.
- **A source: a fissure in the rock itself.** It is not painted.
  - A recessed crack runs the whole frieze. In "long ago" it is already a faint
    hairline across the sky, breathing a cold light the lantern walks past.
  - In B it tears open at its mouth: the lips crack away and chips of rock fall,
    and a light from somewhere else breathes out of it in a cold violet-cyan,
    unlike anything in the warm palette. The painted Gloam spills out of the mouth
    into the mural and climbs toward the sky.
  - In C the tendrils grow out of the same fissure.
  - It stays a seeping scar through D's land and the long night.
- **More evil:**
  - The tendrils seep out, rise a little and go still. The flame chokes, the
    sound hushes, and then they strike together in one lunge with a dissonant stab.
  - The yank keeps its jerks, now with a heartbeat under it.
  - The torn stars' chimes bend down out of tune.
  - The painted figures drain to ash as the Gloam reaches them.
  - The lantern dims and shrinks when the Gloam is near it.
- **Also:**
  - The opening is warmer and golden: a wider light and a warm ambient that turns
    cold when the fissure opens.
  - The figures are about 8 voxels tall instead of 6.
  - The islands vary in depth, lean and lobes, and there are islets of different
    sizes.
  - The mist bands at the end are now lobed emaki clouds with flat bellies.
  - The module URLs are bumped to `?v=3`.

Contact sheet: `docs/story-frames/cave-spike-v3.jpg` (long ago, the fissure tears
open, the grip, the tearing loose, the islands, the long night).

**Honest read:**
- **Evil and of a piece with the wall:** the black rot with forking veins, the moon
  cracking in its grip, and the fissure.
- **Stillness then strike:** this needs motion to judge.
- **Weaker:**
  - The voxel tendrils are dense where several overlap. The grip on the moon and
    the stars is less crisp than the v2 coils were; it reads more as a thicket
    closing over them.
  - C is now very dark by design (the flame chokes); the silhouettes hold, but
    only just.
  - The fissure's chips are too small to notice at phone size.
- **Not checked yet:** still not tried on an iPhone by me. Desktop Chrome runs at
  about 16 ms a frame with 10 draw calls, but headless Chrome stepped the pixel
  ratio down to 1.625. The per-frame field update (a 256×108 texture) is new CPU
  and upload work for the phone.

### Fourth pass (Kellan, on v3)

Kellan's notes on v3:
- "Through the crack it looks blue. It should look like a crag... an actual crack in a cave wall."
- The border patterns should be reliefs.
- The darkness should follow the crack.
- The final clouds look cut off, and should keep the Gloam's dark identity.
- Then: "could the crack appear like the gloam is breaking in?" and "the stars that fly off could probably fly in 3d space like they are escaping the wall."

**Changed:**
- **The crack is a crag.**
  - It is stepped voxel layers going into the rock, each about a cell wide, each
    darker than the one above, down to black.
  - The darkening is applied by depth in the shader. Side walls also darken the
    deeper they go into the wall.
  - The lips are jagged and broken: raised shards, missing chips.
  - It is a hairline at its ends, opens about 6 cells wide at its mouth, and tears
    wider in C.
  - The blue glow is gone. All that is left is a rare, very faint cold glint deep in
    the black.
- **It forms on screen as the Gloam breaks in.**
  - The hairline is there from "long ago" as an omen.
  - At 10 s the stone near the mouth bulges.
  - Then it breaks open from the mouth in jolts (about 9 cells per 0.42 s), each with
    a stone crack, dust and a small shake, and short cracks spider off each jolt.
  - Chunks of the lips are pushed out of the wall toward the camera as real 3D
    tiles that tilt, tumble and fall.
  - The camera pushes in on the mouth for the break.
- **The Gloam follows the crack.** It fills the crack from the bottom and brims over
  the lips, with drips running down here and there. It runs along the crack both
  ways from the mouth, so it oozes from the whole length. Only after that do limbs
  climb from points on the crack toward the sky (B), and C's tendrils grow out of
  the same line.
- **One material.**
  - The undersides of D's islands, the sea of the long night and the clouds are now
    the Gloam's own body: oily black raised rock, a faint cold rim, thorns and veins
    of rot on its edges, and a slow pulse.
  - It is no longer pale-rimmed paint.
  - The clouds are whole, lobed shapes, with no flat clipped bellies.
- **Borders in relief:** raised ridges, raised diagonal bars, raised wavy strata and
  ammonites, gold studs for the stars, and real recessed sockets where stars were
  torn out.
- **The stars escape in 3D.** Each one bursts out of the stone in sparks, then
  tumbles as a rigid glowing body through the air in front of the wall, up to 18–30
  units out. Its light and trail travel at its depth, and it lights the wall as it
  passes.
  - The moon and two stars plunge back into D's land.
  - The four sky-band stars flee toward the viewer and out of the frame.
- **Also:**
  - The moon is held by two claws instead of three.
  - Scene C is less dark: the lantern chokes less.
  - The lantern is brighter in D.
  - The fissure in D now runs beneath the islands, not through them.
  - Module URLs are `?v=4`.

Contact sheet: `docs/story-frames/cave-spike-v4.jpg` (4×2):
- long ago, with the faint omen crack;
- close on the crack breaking, with chunks thrown out;
- the Gloam filling it and climbing from it;
- the two-claw grip;
- stars fleeing out of the wall in 3D;
- the islands;
- the Gloam's clouds;
- the long night.

**Honest read:**
- **Works:**
  - The break is now an event, and the Gloam visibly comes out of the crack.
  - The stars leaving the wall in 3D are the most dramatic moment.
  - The clouds and sea read as the Gloam.
- **Weaker:**
  - The crag's steps read as a gradient of darkness more than as distinct ledges at
    phone size; the camera looks straight at the wall, so the side walls stay thin.
  - Once the Gloam fills the mouth, the depth is hidden, as intended, but it means
    the depth is only on screen for about a second.
  - Chunks are thin slabs (the tile depth), not fat rocks.
  - Wherever the Gloam is, the frame is dark; D and E are moody but low-key.
  - The stars' grips are still dense.
- **Not checked yet:** not run on an iPhone by me. Desktop Chrome runs at about
  16 ms a frame with 10 draw calls; the pixel ratio stepped down to 1.625 in headless
  Chrome.

### Fifth pass (Kellan: "the clouds in the final area should look like they are slowly growing like the darkness is impending")

- **It grows.** In the long night, the Gloam's clouds and sea now swell outward cell by
  cell. Every cell has a precomputed moment when the mass reaches it, grown outward
  from the clouds and the sea in uneven steps of about 0.7 s, with veins feeling
  ahead. It never grows over the islands' land. The separate clouds swell, merge
  and close in from above and below between about 26 s and 34 s.
- **A faint pulse** as each step lands.
- **The light holds it back.** Where the real lantern's light falls, the dark pauses
  and recoils, and it presses on again once the light has moved. That is a seed for
  the story's "last light".
- **It never takes the painted lantern.** The clear space around the painted lantern
  shrinks over 27.5–33.5 s to a last ring about 4–5 cells wide. That small warm light
  is the last thing before the fade.
- **Sound:** a low drone that slowly rises and thickens from 26.5 s, and quiet stone
  creaks as it advances.
- **Fixes:**
  - The Gloam's smoke sprites are now exactly black: any colour above black read
    as grey slashes over the Gloam after gamma.
  - The static Gloam's pulse is now a faint, blotchy throb instead of a diagonal
    wave.
- Module URLs are `?v=5`.

Contact sheet: `docs/story-frames/cave-spike-v5.jpg`. Two context frames (long ago,
the stars fleeing), then the ending at 27.0, 29.4, 31.6 and 34.0 s, showing the dark
closing in.

**Honest read:** the impending growth reads well across the four ending frames, and
the last ring of light around the painted lantern is a strong final image. The
growth is slow enough that much of it happens while the lantern walks in, so the
hold-back recoil is subtle in stills; it needs watching in motion. Not checked on an
iPhone yet.
