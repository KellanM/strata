# New biomes: applied

**Applied 2026-10-18.** Kellan picked gallery objects for all eight biomes, and
the map now has 15 chapters, 140 levels and 13 shrines. The proposal below is
kept as written; "As built" records what shipped.

## As built

Map order is the suggested journey, unchanged: the chapter means rise without
a swap (the moved levels were retuned with `tools/retune.mjs` to fit their new
place; curated `clues:` levels kept their clues).

| # | Chapter | Palette | Levels | Mean D | Shrine |
|---|---|---|---|---|---|
| I | First Light | Dawn | 9 | 7.67 | Cottage |
| II | Teatime | Teatime | 8 | 8.76 | Layer Cake |
| III | Moss Garden | Mint | 10 | 9.03 | Frog |
| IV | The Orchard | Orchard | 9 | 10.34 | none yet |
| V | Autumn Woods | Autumn | 12 | 10.60 | Cider Press |
| VI | The Lagoon | Lagoon | 11 | 10.93 | Whale |
| VII | The Deep | Deep | 8 | 11.15 | Black Smoker |
| VIII | Desert Oasis | Desert | 5 | 11.30 | Keyhole Arch |
| IX | Ember Steps | Dusk | 9 | 11.42 | Paper Lantern |
| X | Old Stones | Stones | 9 | 11.59 | Stone Circle |
| XI | Clockwork Workshop | Clockwork | 11 | 11.77 | Gear Train |
| XII | Lantern Festival | Festival | 10 | 11.88 | none yet |
| XIII | Frost Peaks | Frost | 9 | 12.02 | Igloo |
| XIV | Cloud Isles | Clouds | 11 | 12.45 | Floating Isle |
| XV | Starfall | Night | 9 | 12.71 | Crescent Moon |

- **Moved, ids kept** (so solved state carries over): every level in the
  "Moves in from today" column below, as listed. All of them existed.
- **New from the gallery:** 46 picks from pages 6-8; one per biome became its
  shrine (the strongest finale of the set), the other 38 are levels.
- **Palettes:** eight new ones in `public/js/palettes.js`, skies from the
  gallery `sections.json`; each has a key and timbre in `public/js/audio.js`.
- **Shrines** open at 12 stars, or two stars a stone in a short chapter
  (Desert Oasis: 10), once the trail has reached the chapter.
- **Returning players:** the unlock rule (`progress()` in `public/js/map.js`)
  walks the trail and only extends it through solved stones that are at most
  one unsolved stone apart; the 38 new levels (`ADDED_LATER` in shapes.js)
  don't count as gaps. So a save keeps the trail it had walked, the new stones
  behind it open, and a moved level that now sits further on stays solved
  without unlocking the chapters around it. Fresh saves behave exactly as
  before.
- The Orchard and Lantern Festival still have no shrine (none was proposed);
  a pick for each would complete the set.

## The proposal

With 102 levels in 7 chapters the map has grown lopsided: Starfall has 20,
The Lagoon 19 and First Light 16, while Lantern Festival has 10. This proposes
eight new biomes. Some take levels from today's crowded chapters, and gallery
pages 6–8 fill the rest.

Each biome has a colour script (sky top → bottom), a one-line mood, what
moves into it from today's levels, and the gap the new gallery fills.

| # | Biome | Sky | Mood | Moves in from today | Gallery fills |
|---|---|---|---|---|---|
| 1 | **The Deep** | `#0d2a3f → #1f6f7a`, glow cyan | the sea below the sea; things that light themselves | Jellyfish, Anglerfish, Manta Ray, Baby Shark, Seahorse, Turtle (from The Lagoon) | whales, octopus, nautilus, coral, a diving bell, a sunken chest, a lantern fish |
| 2 | **Frost Peaks** | `#eef4fb → #a9c3dd` | thin air, deep snow, warm breath | Snowman, Polar Bear Cub, Baby Yeti (Starfall), Penguin (The Lagoon), Snow Monkey (Ember Steps) | an igloo, a sled, a snow leopard, a mountain hut, a mitten, an ice-crystal shrine |
| 3 | **Teatime** | `#fbe8d6 → #e2b49a` | the kitchen at four o'clock | Teapot, Fried Egg, Bunny in a Teacup, Toaster, Teabag Pal (First Light), Mug (The Lagoon) | a cake stand, a kettle, a jam jar, a croissant, a stand mixer, a pie |
| 4 | **Clockwork Workshop** | `#3b2a1e → #c98b4a`, brass | gears, ticking, small machines | Alarm Clock, Record Player (First Light), Hourglass (Ember Steps), Armillary Sphere (Starfall) | a music box, a gear tower, a wind-up bird, a pocket watch, a telescope, an automaton |
| 5 | **Desert Oasis** | `#fde7b8 → #e59a5c` | heat shimmer, palm shade, a well of cool water | Cactus (The Orchard) | a camel, a fennec fox, a tent, a scarab, a sand-cat, a water jar, a date palm, a lantern-lit arch |
| 6 | **Old Stones** (Rune Vale) | `#dfe6dc → #8fa59a`, mist | older than the temples; carved and mossy | Geode (Starfall), Gate (Ember Steps) | more rune stones, a stone circle, a golem, a moss-covered column, an ammonite wall, a henge door |
| 7 | **Autumn Woods** | `#f6d2a2 → #b8654a` | leaf fall, woodsmoke, things gathered for winter | Maple Bonsai (The Orchard), Mushroom Log (Moss Garden), Mushroom, Pumpkin (The Orchard), Fox (Moss Garden), Owl (Starfall) | a hedgehog, a squirrel with an acorn, a log cabin, a wheelbarrow of apples, a scarecrow, a woodpile |
| 8 | **Cloud Isles** | `#e3efff → #b8c8f2` | above the weather; islands that float | Kite, Rain Cloud, Windmill, Weather Vane, Unicorn (Starfall) | a hot-air balloon, a floating island with a tree, a paper plane, a sky whale, a lighthouse on a cloud, a stork |

## What happens to today's chapters

- **First Light** loses its kitchen items (to Teatime) and its clocks (to Clockwork). That brings it from 16 to about 10, all bedroom and morning things.
- **The Lagoon** keeps the shore (boat, lighthouse, crab, pelican, palm, flip-flops, puffin, starfish, fish) and loses the deep sea. That brings it from 19 to about 11.
- **Starfall** keeps the night sky (star, planet, rocket, observatory, dreamcatcher, invader, wishing well, bunny, kite?). Its snow and cloud levels move out. That brings it from 20 to about 10.
- **Moss Garden, The Orchard, Ember Steps and Lantern Festival** change a little each.

## Ordering on the map

The map is one path, so the order is a difficulty ramp as well as a journey.
Here is one possible journey, a day into a night and back to dawn, with
biomes 1–8 slotted in:

First Light → Teatime → Moss Garden → The Orchard → Autumn Woods → The Lagoon →
The Deep → Desert Oasis → Ember Steps → Old Stones → Clockwork Workshop →
Lantern Festival → Frost Peaks → Cloud Isles → Starfall

That is 15 chapters of about 7–14 levels each as the gallery picks come in.

Each chapter still ramps easiest to hardest and has a bonus shrine (8 new
shrines needed). `test/` keeps the chapter means rising, so the order above
may shift once levels are measured.

## Decisions for Kellan

1. Which biomes to make (all eight, or a subset).
2. Whether to move today's levels as listed.
3. The map order.
4. Picks from gallery pages 6–8 to fill each biome.
