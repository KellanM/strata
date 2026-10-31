# Silhouette and appeal: study record (2026-10-31)

How top character and object designers make figures recognisable by silhouette and appealing as characters, and what carries over to Strata's voxel objects: 7³ to 10³, a fixed isometric view, shown at about 64–160 px. This is research only. Nothing in the game or gallery changed. The scratch renders and the measurement script are in a temp folder, not in the repo.

Read with `docs/voxel-study.md`, the current checklist. Section 5 lists where this study conflicts with it.

---

## 0. What was read, what was seen, and the limits

**Read in full or in the relevant sections (primary text):**

| Source | How it was read |
|---|---|
| Mitchell, Francke, Eng, *Illustrative Rendering in Team Fortress 2*, NPAR 2007. https://steamcdn-a.akamaihd.net/apps/valve/2007/NPAR07_IllustrativeRenderingInTeamFortress2.pdf | Full text extracted from the PDF. **Figure 2 (the nine classes, colour and silhouette) inspected.** |
| Valve, *Stylization with a Purpose: The Illustrative World of Team Fortress 2*, GDC 2008 slides. https://cdn.fastly.steamstatic.com/apps/valve/2008/GDC2008_StylizationWithAPurpose_TF2.pdf (also MIGS 2008, *Connecting Visuals to Gameplay at Valve*: https://cdn.fastly.steamstatic.com/apps/valve/2008/MIGS08_ConnectingVisualsToGameplay.pdf) | Slide text extracted. Slide images not viewed. |
| Walt Stanchfield, *Gesture Drawing for Animation*, ed. Leo Brodie: the Disney class handouts later published as *Drawn to Life*. https://archive.org/download/ART15PDT/ART-7-GDF_djvu.txt | OCR text searched for silhouette, tangent, story, straights and curves. **The book's drawings were not seen.** The Hahn-edited *Drawn to Life* volumes themselves were not read; the Brodie compilation is the same handouts. |
| John Lasseter, *Principles of Traditional Animation Applied to 3D Computer Animation*, SIGGRAPH 1987. https://www.ics.uci.edu/~fowlkes/class/ics162/exercises/lasseter.pdf | Full text. Figures not viewed. Lasseter's source [26] is Thomas & Johnston, *The Illusion of Life*. I did not read that book directly. |
| CGW, "The Shape of Animation" (Up), June 2009. https://www.cgw.com/Publications/CGW/2009/Volume-32-Issue-6-June-2009-/The-Shape-of-Animation.aspx | Read through a fetch summary, with quotes extracted. |
| Richard Corliss's Pete Docter quote, Time Quotes of the Day. https://content.time.com/time/quotes/0,26174,1896685,00.html | Quote verified on the page. *The Art of Up* was **not** read. |
| Iwata Asks, Super Mario Bros. 25th Anniversary, vol. 2 p. 5. https://iwataasks.nintendo.com/interviews/wii/mario25th/1/4/ | Read. |
| Iwata Asks, Steel Diver p. 4 (Miyamoto on Mario's shape). https://iwataasks.nintendo.com/interviews/3ds/steel-diver/0/3/ | Read. |
| Ken Sugimori & Junichi Masuda on building Gen 1 (translated). https://lavacutcontent.com/sugimori-masuda-developer-interview/ | Read. |
| Ken Sugimori, 2000 interview, Shmuplations translation, excerpted by WellPlayed. https://www.well-played.com.au/pokemon-artist-ken-sugimori-talks-design-in-newly-translated-2000-interview/ | Read the excerpt only. The full Shmuplations page was not reached. |
| Sugimori, 2018 Siliconera interview, via Nintendo Life. https://www.nintendolife.com/news/2018/07/ken_sugimori_wants_pokemon_designs_to_be_as_memorable_as_possible | Read. |
| Derek Yu, *Pixel Art Tutorial* (rebooted version). https://www.derekyu.com/makegames/pixelart.html | Full text. **Images inspected: `mario.png` and `pinkyparty.png`** (his 32×32 chibi party). |
| Crossy Road making-of, PocketGamer.biz (Andy Sum, Matt Hall, Ben Weatherall). https://www.pocketgamer.biz/making-of-crossy-road/ | Read. |
| Glocker et al., "Baby schema modulates the brain reward system…", PNAS 2009. https://www.cceb.upenn.edu/csa/assets/user-content/documents/PNAS-2009-Glocker.pdf | Full text. |
| Tokyo Weekender, "Spun into life: the making of traditional kokeshi dolls". https://www.tokyoweekender.com/art_and_culture/history/spun-into-life-the-making-traditional-kokeshi-dolls/ | Read. |
| ludusnovus, "Invisible Design in Picross 3D: Round 2". https://ludusnovus.net/2016/10/22/invisible-design-in-picross-3d-round-2/ | Read again (it was already cited in voxel-study). |
| Sir_carma (Antoine Lendrevie) interview, 3DVF. https://3dvf.com/dossier-1398-1-rencontre-avec-sir-carma-specialiste-voxel-art-html/ | Read, in French. It says nothing on silhouette or readability. |

**Images inspected (seen, not just read about):**

- TF2 NPAR paper, Figure 2: the nine classes in colour and in flat silhouette.
- Derek Yu: the NES Mario sprite and the four-character 32×32 chibi party.
- Pokémon: eight Gen 2 (Crystal) battle sprites (Pikachu, Gengar, Snorlax, Squirtle, Eevee, Meowth, Bulbasaur, Jigglypuff) and their Gen 7 menu icons, from the PokeAPI sprites repo (https://github.com/PokeAPI/sprites). These are ripped game assets. I made my own fill-black and 16 px versions (§2.3).
- Crossy Road: Chicken, Emo Goose, Mallard, Penguin and Pew Die Pug, from the Crossy Road fandom wiki (https://crossyroad.fandom.com).
- Picross 3D: the DS gameplay screenshot, the cover, and the Round 2 "Cat" reveal screenshot, from Wikipedia.
- Strata: fresh QA sheets (four iso corners, silhouette, 40 px, front, side, top) of Pegasus Foal, Origami Fox, Meerkat Lookout, Maneki-neko, Dragon Head and Kokeshi, made with `tools/qa-sheet.mjs`.

**Looked for and not found (no claims are made about these):**

- **Ben Weatherall:** no interview of his own on character design; only the PocketGamer piece. The GDC 2015 talk "Crossy Road: A Whale of a Time" (https://gdcvault.com/play/1021897) is members-only.
- **Monument Valley:** nothing about how Ida's figure was designed.
- **Mike Judge (voxel):** not found. Sir_carma's interview covers workflow and lighting only.
- **Kōji Nishino:** no design interview found.
- **Animal Crossing:** Iwata Asks for City Folk and New Leaf, pages checked; neither discusses character proportion.
- **Picross 3D (HAL Laboratory):** no designer commentary found, in English or Japanese.
- **Sanrio / Hello Kitty:** the "no mouth" explanation could not be traced to a primary source, so it is not used.
- **The "big-medium-small" rule:** I could not trace it to a named practitioner's primary text. It shows up only in course listings. It is used here as common practice, backed by Stanchfield's "straight against curve" and "extremes" and by Valve's read hierarchy, not as a quoted rule.

---

## 1. Findings by source

### 1.1 Valve: Team Fortress 2

**Claimed:**
- "the silhouettes of the nine classes were carefully designed to be very distinct from one another … Even when viewed only in silhouette with no internal shading at all, the characters are readily identifiable to players. … demonstrating the ability to visually read the characters even with no internal detail was used to validate the character design during the concept phase." (NPAR 2007, §3 and Fig. 2)
- "The body proportions, weapons and silhouette lines as determined by footwear, hats and clothing folds were explicitly designed to give each character a unique silhouette. In the shaded interior areas of a character, the clothing folds were explicitly designed to echo silhouette shapes." (NPAR 2007, §4)
- "High frequency detail is omitted where possible." (NPAR 2007, §2)
- A read hierarchy: "Team → Friend or Foe? → Color. Class → Run or Attack? → Distinctive silhouettes, Body proportions. Weapons → Shoes, hats and clothing folds. Selected weapon → What's he packin'? → Highest contrast at chest level, where weapon is held. Gradient from dark feet to light chest." (GDC 2008 slides)
- The character-creation order: "1. Character silhouette 2. Interior shapes 3. Model sheet …"; "Character Silhouette: Building block of character design. Identifiable at first read"; "Keep it iconic. Work out design in three quarter pose"; "Solve design problems using silhouette only." (GDC 2008)

**In real work (Figure 2, inspected):** in silhouette, each class is carried by one prop pushed outside the body: the Engineer's wrench held up, the Heavy's minigun, the Sniper's rifle laid horizontal, the Pyro's tank and hose, the Medic's backpack and coat-tails, the Soldier's rocket launcher on the shoulder. Body mass separates the classes before the props do: the Heavy is about twice the Scout's width and the Spy is the thinnest. The Spy is identified by having *no* prop and the narrowest, straightest outline. Absence can be the identity feature.

**Why it works:** the viewer decodes in layers. Colour arrives first and from furthest away, then the gross outline, then detail. Each layer answers one question, and no layer depends on the one below it.

**Hypothesis for Strata:** the 40 px thumbnail is TF2's "distance". The object's single identifying prop or part should sit outside the main mass in the game's three-quarter view, as the wrench or rifle does: wings spread, an ear pair, a raised paw, a spout. Valve worked out its designs "in three quarter pose". Strata's fixed iso camera *is* the three-quarter pose, so it should be the primary design view, not one of four equal ones.

### 1.2 Disney via Lasseter and Stanchfield; Pixar's *Up*

**Claimed:**
- Staging in silhouette (Lasseter 1987, citing *The Illusion of Life*): "In those days, all the characters were black and white … Bodies, arms and hands were all black, so there was no way to stage an action clearly except in silhouette. A hand in front of a chest would simply disappear. Out of this limitation, the animators realized that it is always better to show an action in silhouette."
- Twins (Lasseter): "one thing to avoid is called 'twins', where both arms and both legs are in the same position, doing the same thing. This gives the pose a stiff, wooden, unappealing quality. … Likewise one side of a face should never mirror the other."
- Appeal (Lasseter): "A design that is complicated or hard to read lacks appeal. Clumsy shapes and awkward moves all have low appeal."
- Baby versions of an object (Lasseter on Luxo Jr.): "The light bulb is the same size on Jr., while the shade is smaller. The springs and support rods are the same diameter as Dad's, yet they are much shorter."
- Cheating for silhouette (Stanchfield, "Learn to Cheat"): "'Cheating' in drawing is a term used when some part of the figure is adjusted to help make the pose read more clearly. One of the most obvious places to introduce a cheat is in establishing a good silhouette. … Dawson's left elbow was extended to avoid the tangent it was forming with the backside."
- Tangents (Stanchfield, ch. 3): "A tangent occurs when two or more lines meet or merge into one another so there is no differentiation between the parts which they describe. A simple example is two mountain shapes drawn with no overlap … The simple solution to this problem is to add overlap."
- Silhouette is force, not tracing (Stanchfield): "Silhouette almost explains 'extreme,' but not if it is thought of as a tracing of the outside of the figure. Forces are at play in a gesture."
- Straight against curve (Stanchfield): "All curves and no straights make a dreary drawing. Straights and curves used indiscriminately are but trickery, but when used logically they can emphasize and clarify the gesture."
- The one-pose story (Stanchfield): "The essence of the gesture (the one-pose story, how this particular figure enacts this particular pose, the feeling it evokes)."
- Pairs (Stanchfield): "Never draw one appendage without planning a counter move with its opposite.... never."
- Shape language (Pete Docter, *Up*, quoted by Corliss in Time): "We tried to push caricature … and the language of shapes — to make these drawings an expression of the characters. Carl wants to stay enclosed in his box of a house. He's just kind of square. His wife is more curves, almost balloon shapes, and Russell is very balloon-like." CGW adds: Russell "looks like a little egg with stubby arms and legs and no neck"; Dug "is round; they're angular", against the pack dogs; and from the effects side, "We removed anything extra."

**In real work:** I read these but did not view the images, so this is from text. Andre's itch in *Andre and Wally B.* was moved to his side so that it reads in silhouette (Lasseter, Fig. 6). Luxo Jr. is the same lamp with Dad's parts shortened but the bulb kept at full size.

**Why it works:** silhouette is the one channel that survives distance, low light and small size. Anything staged *inside* the outline needs value or colour contrast to be seen at all. Shape families carry temperament before any face is read: a square is stable and won't roll; a circle rolls and is soft. Twins look mechanical because living bodies are never in perfect mirror balance.

**Hypothesis for Strata:**
- The action limb or prop (a raised paw, a held string, a whisk) goes on the *side* of the body in the game view, breaking the outline, never in front of the chest.
- A "baby" anything keeps its key feature at full size and shrinks the rest: the meerkat pup does exactly this (§4).
- Pick the shape family from the subject's temperament. Boxes and single-voxel points suit sly, crisp or folded subjects (the Origami Fox). Ellipsoids suit soft, friendly ones (the Pegasus Foal's head, the Pumpkin).
- Mirror the *features* but let the *pose* differ.

### 1.3 Nintendo and Game Freak

**Claimed:**
- Mario's design was driven by function. Imanishi: "how few pixels he was made out of … It would have been impossible to show his hair, so they had to make him wear a hat. In order to hide his mouth, they gave him a big nose and mustache." Iwata: "The entire design is based on function, like making it easy to tell which direction he is facing." (Iwata Asks, Mario 25th)
- Miyamoto: "The reason Mario is a plump shape is because gaming devices at that time could only read collisions between square boxes … not because I wanted to make him cute. … resolution was low, so I made his face big." (Iwata Asks, Steel Diver)
- Sugimori on Game Boy sprites: "We couldn't use a lot of pixels to show all the details, and we couldn't use many colors either … so we made sprites that were easy to understand and symbolized more complex designs." (Sugimori & Masuda)
- Sugimori: "If you change the location of just one pixel in a sprite, it can give an entirely different impression." (2000 interview, via Shmuplations/WellPlayed)
- Sugimori: "Usually it's pretty easy to tell what the motif was for a pokémon, right?" (same)
- Sugimori: "take away from designs that are too cool … if it looks too cool then it takes away from what makes it memorable for the players." And: "Look at Oshawott's cheeks. It has three freckles, and if you take them away Oshawott becomes cuter." (Siliconera 2018, via Nintendo Life)

**In real work (sprites inspected, §2.3):** the Gen 7 menu icons redraw each Pokémon at about 30 px with the head enlarged and the body shrunk to a stub. Pikachu, Eevee and Meowth become almost all head. At icon size the designers chose a bigger face over the full-body silhouette: the icon silhouettes are *less* distinct than the battle-sprite silhouettes, while the face and colour carry more.

**Why it works:** at very low resolution the face is the most information-dense, most attended part of a creature, so you spend your pixels there. A single motif ("easy to tell what the motif was") is decodable in one glance. Facing direction is a functional read in its own right.

**Hypothesis for Strata:** the smaller the grid, the larger the head should be relative to the body, and the more the face should face the camera. The motif should be a single noun ("fox", "teapot"), not a hybrid needing a caption. "Memorable" is helped by one small unexpected touch, such as gold wing tips, a red collar or a white tail tip. Sugimori's freckles show that one *extra* touch can also hurt, so each small-tier part should earn its place.

### 1.4 Small-scale crafts: pixel art, Crossy Road, voxel artists, kokeshi

**Claimed:**
- Derek Yu: "The smaller a sprite gets, the less your sprite looks like what it's supposed to represent and the more responsibility each individual pixel has." And: "I often use colored shapes instead of drawing the outline because at this size, color plays a larger role in defining the character than outlines. If we look at Mario again, he doesn't have an outline at all! … his sideburns define his ears, his sleeves define his hands, and his overalls more or less make his entire body intelligible."
- Yu: "If your character has well defined arms and legs, the head will probably need to be smaller to make room for them." And: "For small sprites, I tend to favor chibi (or super-deformed) designs where the characters are cute and have large heads and eyes … But perhaps you're more interested in bringing out a character's mobility or brute strength instead, in which case you may choose to focus less on the head."
- Yu: "A well-defined character has details that do not obscure the basic forms." And: "remove the color from your artwork … to see whether your shading still reads well."
- Andy Sum (Crossy Road): "[Matt] told me that he wanted to rotate the camera because voxels look better at an angle … there was no denying that it looked 100 times better." And: "I wanted to have really obvious hit boxes and sharp edges."
- Kokeshi (Tokyo Weekender): "the basic blueprint is always the same: an enlarged head and cylindrical body with no arms or legs."

**In real work (inspected):**
- Yu's party: the four chibi heroes have heads about as big as their torsos. Each is told apart by one held prop (sword, staff, mace, shield) plus one dominant colour, the same read hierarchy as TF2.
- Crossy Road: Chicken, Goose and Penguin are a *single tall box* with no separate head. Identity is carried by two to four small saturated protrusions on a plain mass: the red comb and wattle, the orange beak, orange feet. Eyes are one dark voxel per side. The Mallard is pure colour blocking: a green head band, a white collar ring, a brown chest. Emo Goose is the Goose plus one accessory (a black fringe). The camera is high three-quarter and the colours are flat.
- Kokeshi: no limbs at all. Identity is the head/body ratio plus colour blocking (black hair cap, painted kimono). Strata's own Kokeshi (QA sheet) has the plainest possible silhouette, a cylinder under a ball, yet it is a named favourite.

**Why it works:** at a few pixels or voxels per part, outline detail falls below what the eye can resolve. Contiguous colour areas survive downsampling, and outlines and one-pixel features do not (§2.3). A plain big mass with small saturated protrusions gives the eye one place to land.

**Hypothesis for Strata:** at 40–64 px a 7³ object is about 6–9 px per voxel, so colour blocks carry the second read and silhouette the first. Each big colour should be one *part* (head, body, base) so that the colour map *is* the anatomy, as with Mario's overalls. Crossy Road shows that one box plus two or three saturated nubs is enough for a bird.

### 1.5 Baby schema

**Claimed:** Lorenz's Kindchenschema as listed by Glocker et al. (PNAS 2009): "large head, big eyes, high and protruding forehead, chubby cheeks, small nose and mouth, short and thick extremities, and plump body shape". Their manipulation defines high baby schema as "round face, high forehead, big eyes, small nose and mouth". Glocker's earlier study (cited there) found that high-schema faces were rated cuter and drew stronger caretaking motivation. They note the response extends to "animals … and even objects".

**Why it works:** the features act as a "releaser", a small set of stimulus features enough to trigger the response. That is why a few voxels can carry it.

**Hypothesis for Strata:** a "high forehead" on a voxel head means the eyes sit in the *lower half of the head*, not the lower half of the figure. A "small nose and mouth" means no mouth, or a single voxel. "Short thick extremities" means 1×1 stub legs, never 1-voxel-thin long legs. Objects can take it too: a squat teapot with a big round body and a short spout reads as "baby".

### 1.6 Picross 3D (HAL)

No designer commentary was found. Seen in the screenshots: the solved puzzle is *re-rendered* for the reveal, with rounded, non-cube pieces and painted faces (the Round 2 Cat). The cube solution is not the final image. On the cover, the dog's face is painted on the front face toward the camera, and the ears are two blocks on top. ludusnovus explains the 10-block limit as "the near maximum size that still allows accurate selection of blocks with a stylus".

**Hypothesis for Strata:** Picross 3D did not trust raw cubes to carry character at the reveal; it added rounding and painted faces. Strata keeps the cubes, and its dithered light (`lit()`) does some of that work. So the cube form has to carry *more* identity in Strata than it did in Picross 3D. That argues for leaning on colour blocking, the face toward the camera, and the identifying outline.

---

## 2. Experiments run for this study

### 2.1 Silhouette measurements on all 638 gallery objects

A scratch script dumped every gallery entry (`public/gallery/{page*,extra,themes}`) and rasterised its orthographic silhouette from the iso corners at about 35° elevation. It measured:

- **solidity:** the area of the silhouette divided by the area of its convex hull;
- **notches:** concave bays in the outline at least ¾ of a cube face in area;
- **enclosed holes:** background fully surrounded by the object, at least ½ a cube face.

| | all 638 | favourites |
|---|---|---|
| solidity, game view (median) | 0.915 (IQR 0.877–0.945) | Kokeshi 0.955, Maneki-neko 0.971, Pumpkin 0.963, Moss Tortoise 0.964; Pegasus 0.891, Meerkats 0.908, Origami Fox 0.905; Windmill 0.875, Sloth 0.864, Koala 0.880, Dragon Head 0.907 |
| notches, game view | median 1 (0: 178 objects, 1: 159, 2: 195, 3+: 106) | Pumpkin 0, Neko 0, Tortoise 0; most others 2; Dragon Head 3 |
| objects with an enclosed hole visible in the game-view silhouette | **1%** | none |

**Results:**

1. **Silhouette complexity does not separate the favourites from the rest.** Four of the eleven favourites are among the *most* solid outlines in the gallery: Kokeshi, Maneki-neko, Pumpkin and Moss Tortoise. They work because their outline is the *canonical* outline of a known thing (a turned doll, a squat gourd, a domed shell, a sitting cat with one paw up), helped by colour blocking. "More protrusions" is the wrong target. "The outline you'd draw if asked to draw this thing" is the right one.
2. **Enclosed holes almost never survive the iso projection at this scale.** Depth behind a gap fills it. Negative space that names the object has to be either a *notch in the outline* (between ears, between legs, between two figures) or a hole cut *along the view diagonal*.
3. **Opposite iso corners give the same silhouette, mirrored.** A silhouette check therefore needs only two corners, the game view and one 90° turn. The other two corners differ only in which faces, and so which colours and eyes, are visible.
4. Eyes visible from the game corner: 243 of 281 objects with 1–6 ink voxels (86%). This is already the norm, so it doesn't discriminate.

### 2.2 QA sheets of the favourites (inspected)

Fill-black panels: the Origami Fox silhouette alone says "fox": two ear prongs with a notch and a raised tail. The Pegasus silhouette says "winged thing on a mound". Its *horse* comes from colour (honey coat, pink forelock, cream muzzle) and the face toward the camera. The Meerkat silhouette says "two upright figures, tall and short, on a slab", and that *is* the meerkat read. Kokeshi and Neko silhouettes are generic in outline and are carried by colour blocking and the head/body split (Kokeshi) or the raised paw out to the side (Neko).

### 2.3 Pokémon sprites: the fill-black and 16 px test (inspected)

Eight Crystal sprites, each shown in colour, filled black, and downsampled to 16 px; plus their Gen 7 icons in colour and black:

- **Black-fill readable:** Pikachu (ears plus zigzag tail), Gengar (spiked crown), Eevee (ears plus ruff), Jigglypuff (ball with ear points). **Generic blob in black:** Snorlax, Bulbasaur, Squirtle.
- **At 16 px** every outline detail is gone. What survives is two or three big colour/value blocks plus one high-contrast accent. Gengar: a dark mass with a white grin and red eyes. Snorlax: dark body over a cream belly. Pikachu: yellow with red cheeks. Eevee: brown with a cream ruff.
- **The icons** enlarge the head and drop body detail. Their silhouettes read worse than the sprites' do; faces and colour read better.

**Result:** silhouette carries recognition at "sprite" size (about 56 px for a full figure). At "icon" size (16–30 px) colour/value blocking and the face carry it. Strata's 64–160 px thumbnails of a 7³ object sit at the boundary: about 6–20 px per voxel, roughly between Pokémon's icon and sprite sizes. Strata needs both channels.

---

## 3. Mechanisms, topic by topic

| Topic | Claimed (source) | Seen in real work | Why it works | Voxel hypothesis (7³–10³, iso) |
|---|---|---|---|---|
| Silhouette first / fill-black | "Solve design problems using silhouette only" (Valve GDC08); TF2 silhouettes "used to validate the character design" | TF2 Fig. 2; Pikachu, Gengar, Eevee in black | The outline survives distance and low light | The QA sheet's black panel at the game corner must suggest the category, *or* the object must have a known canonical outline (§2.1) |
| One exaggerated feature | Mario's big nose and moustache; Dug's "Snoopy nose" (CGW); TF2 weapons | TF2 props outside the body; the Crossy Road comb and beak | One landing point for the eye | The identity feature defines the outline's extremes (top or width) in the game view |
| Big-medium-small | Practice, not traced to a primary text; Valve's colour→silhouette→detail layers are the closest | TF2: body mass, then prop, then patches | A hierarchy tells the eye where to go first | Three tiers by voxel count: roughly ≥50% / 25–40% / ≤10% |
| Shape language | Docter: Carl "just kind of square", Russell "balloon-like"; Peterson's cube/circle (secondary) | *Up* (read, not seen) | Shapes carry temperament before the face is read | Ellipsoid = soft or friendly; box = steady object; single-voxel points = alert, sly or sharp |
| Pose, line of action, story | Stanchfield: "the one-pose story"; Lasseter: stage the action in silhouette | Andre's side-scratch; Neko's raised paw | A verb is more memorable than a noun | Pose = the subject's signature behaviour; the action limb sits on the outline |
| Head ratio, eye placement | Lorenz via Glocker: large head, high forehead, big eyes, small mouth; Yu: chibi for small sprites; Miyamoto: "made his face big" | Pokémon icons; Yu's party; kokeshi | The baby-schema "releaser" | Head ≥ ⅔ of body volume for cute creatures; eyes in the lower half of the head, 1–3 voxels apart; no mouth |
| Negative space | Stanchfield: "negative and positive shapes" | TF2 gaps between arm and body; Pikachu's ear notch | A gap is a shape too, and costs nothing | Notches, not holes: holes survive iso in only 1% of objects (§2.1) |
| Tangents and overlaps | Stanchfield: tangent "destroys any illusion of depth … add overlap"; Lasseter: "A hand in front of a chest would simply disappear" | Dawson's elbow cheat | Merged edges collapse two parts into one | Parts meet with a ≥1-voxel step or a colour change; same-colour parts in front of the body are invisible |
| Several angles | Valve: "Work out design in three quarter pose"; Sum: voxels look better at an angle | Crossy Road's fixed high three-quarter view | The three-quarter view shows three faces and the outline | Design for the game corner; check one 90° turn for false reads. The other two corners share those outlines (§2.1) |
| Colour vs silhouette | Valve: colour first at distance; Yu: "color plays a larger role … than outlines" | Mario, the Mallard, Kokeshi; the 16 px test | Colour blocks survive downsampling | At 40–64 px colour blocking does the naming; silhouette tells the category |
| What fails tiny | Sugimori: one pixel changes the impression; Valve: "High frequency detail is omitted"; Yu: details must not obscure forms | The 16 px Pokémon test | Detail below 2 px aliases into noise | Single-voxel features other than eyes; same-value colour pairs; patterns finer than 2 voxels; detail on faces hidden from the game view |

---

## 4. The three favourites in these terms

### Pegasus Foal (`cand-p8-pegasus`, `public/gallery/page8/clouds-1.js`, 9×8×6, 125 voxels)

- **Identity feature sets the outline.** The wings (`pair()` over x 0–2, mirrored to 6–8) span the full 9-voxel width, while the body is 3 wide. If you cover the wings, the bounding box shrinks to a third. That is far beyond voxel-study's "20–30% of the width".
- **Three redundant cues, each in a different channel.** Silhouette gives the wings. Colour gives a horse: honey coat, a cream muzzle protruding at z=5, pink forelock and tail. Context gives the sky: the cloud base, with a pale-blue underside from `puff`. No single cue has to carry everything.
- **Baby schema.** The head ellipsoid (about 14 voxels) is about ⅔ of the body box (about 22). Eyes sit on the front face at the head's middle row, just above the muzzle. Legs are four 1×1 hooves, and there is no mouth.
- **Big-medium-small.** Big: cloud plus wing span. Medium: body and head. Small: ears, forelock, the gold tips at x=0 and x=8 (an accent under 5 voxels each side, so it stays flat and crisp).
- **Negative space.** Gaps between the hooves (x=4 is empty at y=2) and between the ears.
- **Pose and story.** It faces the camera on a cloud with its wings open: "look at me", the moment just after landing.
- **Symmetric.** Fully mirror-symmetric, which contradicts voxel-study's "at least one deliberate asymmetry" (§5).

### Origami Fox (`cand-origami-fox`, `public/gallery/extra/temples-1.js`, 7×6×5, 59 voxels)

- **Silhouette-first.** Fill it black and it still says fox: two 2-tall ear prongs (x=3 and x=6, on the back plane) with a 2-wide V notch between them, and the tail rising at x=0. That makes three upward prongs over a low body.
- **Shape language matches the subject.** It is built only from boxes and points, with no ellipsoids. That is folded paper and a sly animal at once. Docter's rule in voxels: the shape family *is* the character.
- **Colour blocking, minimal.** One body colour (orange), white for the muzzle and tail tip, and two ink eyes: two colours that get the dithered ramp, plus accents. The white tail tip is the small-tier detail that confirms "fox", the classic marking.
- **Face to the camera.** The eyes sit at the outer corners of the head's front face, 3 voxels apart, with the white muzzle between them below. Wide-set eyes over a small muzzle is baby schema without rounding.
- **Head = body** (24 voxels each): chibi proportion on a 59-voxel object.
- **Sparse.** 28% fill, so every voxel is in the outline or the face. Nothing is hidden mass.

### Meerkat Lookout (`cand-p7-meerkats`, `public/gallery/page7/desert-1.js`, 8×9×5, 151 voxels)

- **Pose is the identity.** The meerkat's signature behaviour is the upright sentinel stance. Two vertical columns on a mound are the whole read, even in black. This is Stanchfield's one-pose story: the name is "Lookout", a verb.
- **Big-medium-small, literally.** Mound (8 wide, the base), parent (body 4 + head 2), pup (body 2 + head 2). The different heights make a rhythm, and the one-voxel full-height gap at x=4 is negative space that says "two".
- **Luxo Jr. in voxels.** The pup's head is the same 3×2×3 as the parent's, but its body is half the height. That is exactly Lasseter's "the light bulb is the same size on Jr., while the shade is smaller". The pup is the baby-schema version of the same design: not twins, but a family.
- **The identifying marking as an accent.** Dark eye patches (ink at the head's outer front corners) and a dark nose protruding at z=4 turn the faces toward the camera.
- **Softening by clearing.** The back top corners of each body and head are cleared, so the boxes read as rounded without ellipsoid noise.
- **One weak spot, per Lasseter.** The paws at the chest (z=4) are body-coloured and sit in front of the body. In the game view they read as a bump, not as paws: "a hand in front of a chest would simply disappear". The figure works anyway, because the pose carries it.

**What the three share:**
- a creature doing its signature thing;
- the face toward the camera;
- the identifying feature on the outline;
- 2–3 big flat colour blocks that map to parts;
- one small accent that confirms the guess (gold tips, white tail tip, dark eye patches);
- a base or context of at most about a third of the voxels in a different value (cloud, mound), or none at all (the fox).

---

## 5. Where this conflicts with `docs/voxel-study.md`

1. **"At least one deliberate asymmetry" and "No symmetric blobs."** The top-rated Pegasus Foal and the favourite Kokeshi are fully mirror-symmetric, and Pumpkin and Moss Tortoise are near-symmetric solid outlines. Lasseter and Stanchfield argue against *twinned poses* in animated figures, not against frontal symmetry in an icon. **Proposal:** make asymmetry optional. Require instead that a symmetric object be frontal, face the camera and have a canonical outline.
2. **"Paired features match … mirrored"** against Lasseter's "twins" and Stanchfield's "counter move". These are compatible once split. **Proposal:** "mirror the *features* (eyes, ears, wings: same size and colour); the *pose* may differ (one paw up, head tilted)." The current text already allows "one raised paw"; this makes the split explicit.
3. **"Main mass + 1–3 protrusions that break the outline."** The measurements (§2.1) show four favourites with zero or near-zero outline notches. **Proposal:** protrusions are needed only when the canonical outline of the subject has them. Otherwise the identity goes into colour blocking and the head/body split.
4. **"Exaggerate the identifying feature (~20–30% of the width at 7³)."** The favourites go far past this: Pegasus wings are 100% of the width, and the fox's ears plus tail set the whole top edge. **Proposal:** replace the percentage with "the identity feature sets the outline's extreme (top or width) in the game view".
5. **"Cute: head ≈ 50–60% of a creature's height."** The adult meerkat's head is about a third of its height, and correctly so, because its identity is the tall body. Yu: "If your character has well defined arms and legs, the head will probably need to be smaller." **Proposal:** apply the head ratio by *volume* (head ≥ ⅔ of the body), and waive it when the subject's identity is a body proportion (meerkat, flamingo, giraffe, sloth's arms).
6. **"Eyes … set wide and low."** Glocker/Lorenz say *high forehead*, which means low in the *head*. **Proposal:** "eyes in the lower half of the head", to avoid putting them low on the figure.
7. **"Negative space is a feature (… donut hole, handle loop)."** Enclosed holes survive the iso projection in only 1% of objects. **Proposal:** "negative space as outline notches; a hole only if it is open along the view diagonal (check the black panel)".
8. **"The identifying feature must read … from at least 3 of the 4 spin angles."** Opposite corners share a silhouette, and Valve designs in the three-quarter pose. **Proposal:** the game corner is primary and must read. One 90° turn must not give a *false* read. The remaining two corners are checked for colour and face only.
9. **Squint test at 64 px.** This one is consistent. Add that at that size colour blocking does the naming (Valve, Yu, §2.3), so the 40 px column of the QA sheet is the stronger test.

---

## 6. Ranked rules for Strata's voxel objects

Ranked by how much each decides whether an object is named at a glance and liked. Each has a test you can run on a 7³ grid with the QA sheet (`tools/qa-sheet.mjs`) or by counting voxels in the entry.

1. **Name it at 40 px in the game view.** *Test:* in the QA sheet's 40 px column, after looking away for a while, can you name it with a single noun within 2 seconds? If not, rules 2–4 are where to fix it. (Valve "identifiable at first read"; Sugimori "easy to tell what the motif was".)
2. **The identity feature owns the outline's extreme.** *Test:* in the black panel at the game corner, cover the identity feature: the top edge or the width should shrink. If it doesn't, the feature is hidden inside the mass. (TF2 props; the Pegasus wings, the fox's ears and tail.) *Exception:* subjects whose canonical outline is compact (pumpkin, kokeshi, tortoise). For those, the outline must match the drawing you'd make of the thing, and rule 3 carries the identity.
3. **Colour blocks are parts.** 2–3 big flat colours, each covering one part (head, body, base, shell), and one accent of fewer than 5 voxels on the identity feature. *Test:* the lint's ramped-colour count is 2–4; every big colour region is one connected part; downsample the 40 px view to about 16 px and the parts are still separate patches. (Yu: "color plays a larger role … than outlines"; Mario's overalls; the 16 px Pokémon test.)
4. **The face is toward the camera** (creatures). *Test:* both eyes visible in the game view on the same or adjacent faces; the snout or beak protrudes toward +z or +x. (Iwata: "easy to tell which direction he is facing"; all three favourites.)
5. **The pose is the subject's signature behaviour, staged on the outline.** *Test:* the object's name can include a verb (lookout, beckoning, landing). The action limb or prop breaks the black outline and is not in front of the body in the same colour. (Stanchfield's one-pose story; Lasseter's "a hand in front of a chest would simply disappear"; the Neko's raised paw.)
6. **Negative space is a notch, not a hole.** At least one notch in the game-view black outline, at least 1 voxel wide and 2 deep, that names something (between ears, between legs, between two figures, under a handle). *Test:* black panel. Count a through-hole only if it shows as background there. (§2.1: holes survive iso in 1% of objects.)
7. **No tangents.** Where two parts meet in the game view (head and body, figure and base, two figures), they differ by a ≥1-voxel step in the outline or by a clear value change, and no edge of one part lines up with the edge of the next. *Test:* in the black panel, can you point to where the head ends? In the lit view, are adjacent parts more than one ramp step apart in value? (Stanchfield on tangents and overlap; Dawson's elbow.)
8. **Big-medium-small by count.** One part holds roughly half the voxels or more, a second part 25–40%, and details 10% or less. *Test:* count voxels per part from the entry code. (Valve's layered read; the meerkat mound, parent and pup.)
9. **Baby schema for cute creatures.** Head volume at least ⅔ of the body's; eyes 1–3 voxels apart in the lower half of the head; no mouth or one voxel; legs 1×1 stubs at most 2 tall. Waive the head ratio when the identity is a body proportion. *Test:* count head and body voxels; read the eye y against the head's y-range. (Glocker/Lorenz; Miyamoto "made his face big"; Yu on chibi.)
10. **Baby versions keep the key part at full size.** For a "young" or "little" variant, keep the identifying part (head, bulb, spout) at adult size and shorten the rest. *Test:* compare the part's dimensions with the adult or reference version. (Lasseter on Luxo Jr.; the meerkat pup.)
11. **The shape family matches the temperament.** Ellipsoids for soft or friendly, boxes for steady or made things, single-voxel points for alert, sly or sharp. Mix with intent: Stanchfield's "straight against curve". *Test:* say in one word which family dominates and why it suits the subject. (Docter on Carl and Russell; the Origami Fox.)
12. **Mirror features, free poses.** Paired features match in size, colour and height. Limbs and head may differ to avoid twins, but a fully symmetric frontal icon is allowed. *Test:* the `tools/qa-symmetry.mjs` / paired-feature check passes for features; the pose difference is deliberate and nameable. (Lasseter on twins; the Pegasus Foal.)
13. **A context base names the setting and is subordinate.** If there is a base (cloud, mound, basket, water), it holds at most about ⅓ of the voxels and has a different value from the figure. *Test:* count base voxels; in the lit view the figure-to-base boundary is a value change. (The cloud and mound in the favourites.)
14. **Darkest low, highest contrast at the identity.** Dark values sit at the base or feet; the strongest light/dark contrast sits on the head or identity feature. *Test:* in the lit game view, find where the eye lands first, which should be the face or feature. (Valve: "Gradient from dark feet to light chest", "Highest contrast at chest level, where weapon is held".)
15. **Two silhouettes, four corners.** Check the black outline at the game corner and one 90° turn only (opposite corners mirror those). Check colours and the face at all four. *Test:* QA sheet.
16. **What fails at 7³ (reject on sight):**
    - single-voxel features other than eyes or accents in the identity colour;
    - a same-colour part in front of the body;
    - two ramped colours within one value step;
    - patterns finer than 2 voxels without `lit: { span: 2 }`;
    - identity detail on faces the game corner can't see;
    - hybrid motifs that need a caption;
    - an extra "cool" detail that doesn't help the read (Sugimori's freckles).

---

## 7. Limits of this study

- **Image inspection was limited** to the items in §0. Stanchfield's and Lasseter's drawings, *The Art of Up* and *The Illusion of Life* were read about, not seen.
- **Several named practitioners have no reachable primary commentary on silhouette:** Ben Weatherall, Monument Valley's team, HAL's Picross 3D team, Kōji Nishino, Sanrio and Mike Judge. Claims about their work here come only from inspected images, and they are labelled as such.
- **The measurements in §2.1 use an approximate camera elevation (about 35°)**, not the game's exact camera, and treat each voxel as a cube with no light. They support relative claims (favourites vs the gallery, holes vs notches), not exact thresholds.
- **The favourites are a list, not ratings.** No per-object scores exist in the repo, so "favourites vs the rest" is a contrast with a small and possibly biased set.
