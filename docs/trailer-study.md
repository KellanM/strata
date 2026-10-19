# Trailer study (2026-10-17)

## Brief

The goal is a short vertical trailer (1080×1920, 30 fps, about 27 s) built from real rendered gameplay. It should convey the calm, satisfying feeling of play and show the most satisfying moments:
- the chisel crumble;
- runs that rise into music;
- peeling layers;
- the reveal and the gems;
- the variety of worlds.

It has to work muted, because store and social feeds autoplay without sound, and with sound, because the game's own audio is half its charm.

## Sources (text only; no trailer video was watched)

- **App Store previews:** portrait 886×1920 or 1080×1920, 15 to 30 s, up to 30 fps. H.264 or ProRes. The video "may only use video screen captures of the app itself". Sources: [aso.dev](https://aso.dev/app-store-connect/screenshots/), [flowjam](https://www.flowjam.com/blog/app-store-preview-video), [dev.to](https://dev.to/mmazzarolo/generating-ios-app-previews-for-the-app-store-k7d).
- **Short social video:**
  - Earn attention in the first 2 to 3 s and design for sound off. Carry one message, end with one clear action, and mute-test the opening ([biteable](https://biteable.com/blog/best-practices-short-social-video/)).
  - Start on the payoff, not the setup ([clip.dor.gg](https://clip.dor.gg/en/blog/gaming-shorts-viral-pattern)).
  - Keep text out of the top 12% and bottom 20% (platform UI). Don't open on a static title card ([vertical-video-design](https://skills.sh/portel-dev/skills/vertical-video-design)).
- **Monument Valley:** the pre-release and release trailers were scored with ambient tracks by Obfusc ([josephx](https://josephx.com/audio/monument-valley)). Ken Wong cites Brian Eno as an influence ([MacStories](https://www.macstories.net/news/ustwo-announces-monument-valley-release-date-posts-behind-the-scenes-video/)). The mood is carried by slow, ambient music and the art itself, with few words. This is an interpretation from those sources; I did not watch the trailers.

## Mechanisms applied

1. **Motion within the first second.** The first frame is the glowing block with rays and motes, and a cube crumbles at 0.35 s. No title card opens the video.
2. **One idea per beat, few words.** Four lowercase, letterspaced captions in the game's own type say the whole message muted. They sit at 71% of the frame height, inside the safe zone.
3. **The payoff is in the middle and lands at full length:** the Wishing Well reveal with its flash, whirl, colour sweep, title and gems. The montage shows variety without explaining it.
4. **Sound is the game's own.** The chisel notes rise with the run and the finale resolves home. For the trailer the effects lead the bed, and loudness is normalised to about −16 LUFS for phones.
5. **One clear action at the end:** STRATA, the line "peel the stone · find the shape", "free · plays in your browser" and the URL.

## Method

- **Picture:** rendered on a virtual clock. `performance.now`, `Date.now`, `requestAnimationFrame`, timers and CSS animations all follow the same stepped time, so every frame is exactly 1/30 s and the capture is perfectly smooth.
- **Sound:** recorded in a second, real-time pass of the same timeline, tapped from the game's audio bus, then muxed.
- **Scripts:** `tools/trailer/`.

## Results and limits

See the parent report. Nobody has tested it with an audience, and I have not listened to it on a phone.

# v2 (2026-10-19)

**Brief.** Kellan asked for the next trailer, built on the research so far and the best new objects, naming the **Koala** and the **Moss Tortoise**. Constraints are unchanged from v1: real captures only, 1080×1920, 30 fps, under 30 s, and it must work muted and with sound. Output: `trailer/strata-trailer-v2.mp4` (29.7 s), `-silent`, `poster-v2.png`, `contact-sheet-v2.png`.

**Baseline (v1, inspected on its contact sheet).** Four separate blocks open the trailer, then a montage and a custom end card. Each beat works on its own, but there is no through-line: nothing connects one stone to the next. The montage has a blank teal frame at about 19 s, a dip that lands before its level has drawn. v1 also predates the title, the map world, shrines and the double-tap cascade.

**New sources.** No new external research. The other studies stand in for it:
- `map-study.md`: the sea of clouds, the mist parting on unlock, and the starry title that is one page with the map;
- `study-record.md` and `biomes-adventure.md`: Journey, Monument Valley and Shadow of the Colossus, which call for mythic, vast, journey and minimal, with cosy framing off-brand.

## Mechanisms applied

1. **A journey, not a sampler (call to adventure).** The trailer follows one path:
   - one stone is carved down to the Koala;
   - the map pulls back out of that same stone;
   - the companion steps on and the mist parts over the next world;
   - the trail's gilded shrine opens on the Moss Tortoise;
   - a finger pulls the night sky back down to the title.

   *Hypothesis:* continuity reads as a world to travel, where v1's cuts read as a list of features. *Check:* every beat hands off to the next on the contact sheet, with no unrelated cut.
2. **Motion in the first second, payoff over setup** (kept from v1). The first frame is the glowing Orchard stone, and the first cube crumbles at 0.25 s. At 1.15 s and 2.35 s, real double-taps on a 0 run the game's own cascade down 9-cube columns. The cascade is the most kinetic new mechanic: a ripple runs ahead, and the run gathers pace with a rising run of notes.
3. **Two reveals, rising in rank.** The Koala is the first payoff, a creature that reads at a glance. The Moss Tortoise is the climax, because a shrine is the game's most mythic moment: a gold portal from the map, the held "✦ The Shrine of ✦ Moss Garden" card with its bells, and a gilded block. The poster is the Tortoise with its gems.
4. **Vastness through the map world.** The mist over Autumn Woods parts on screen, with its peak and warm sky rising in. The caption "fifteen worlds above the clouds" carries the scale without a list. To shorten the wait, the save puts the companion one stone back (`map.js placeCompanion`: 750 ms per stone, 0.9 s minimum), so the parting begins about 1.7 s after the map opens. This is the game's own timing, not a speed-up.
5. **The game is its own end card.** v1 used a custom overlay. v2 ends on the real title: STRATA, the carved logo stone and the night sky, reached by the real pull-down gesture (`beginAscent`, touch path). Only the "swipe up" hint is swapped for one line of where to play, with the count read from the code: **158 stones** and 15 chapters (`SHAPES.length`, matching the map head's "of 158"; the 140 in the request was stale).
6. **Fewer words** (kept from v1). Three captions:
   - "something sleeps in the stone" (v1 said "hidden"; "sleeps" is more mythic);
   - "every tap is a note";
   - "fifteen worlds above the clouds".

   The shrine card speaks for itself. Peel and the gem montage were cut to make room. Peel is v1's beat, and it is hard to read in a trailer.

## Method changes

- `tools/trailer/lib.mjs` is shared by both passes. It holds the version switch (`TRAILER=v2`; unset means v1), the browser lock, system Chrome, the virtual clock and the save seeding.
- Timelines can declare `storage()`, `PREROLL` (v2 steps off the title onto the map before t = 0), `POSTER` and `AUDIO_LEAD`.
- `capture-video.mjs` gained `SCALE=1` for quick drafts and `CUT=secs` to watch a beat play out uninterrupted.
- The row cascade is a real double-tap: synthetic pointer events on a face whose line shows a 0. The target is the longest clearable line whose face is in view and unoccluded. The game's `rowClearTap` does the rest.

## Experiments and what they showed

- **Draft 1 (540×960).**
  - The ending never reached the title. The motion log showed why: the map's wheel path calls `beginAscent()` then `endAscent(false)` with `down = 0`, which falls straight back to the map.
  - The map caption was light on light, and the mist had not parted 4 s after the map opened, because the companion walked the whole Orchard first.
  - Gems landed after the cuts.
- **Draft 2.**
  - With the companion one stone back, the mist parts on screen.
  - A cream dip flashed against the shrine's teal sky. It is now a radial gradient sampled from the sky.
- **Draft 3.**
  - The ending is driven by a touch pull. The night sky follows the finger down over the map, then settles on the title.
  - The map caption collided with Autumn Woods' first stone and the walking companion. It moved to the empty cloud band at 51.5%.
  - The title's own tagline ("peel the stone · find the shape") was nearly invisible: it is drawn in the day palette's dark `--ink-soft` on the night sky. For the end card only, the trailer lifts it to the title's colour.
- **Audio sync.** Chisel onsets in the final WAV were about 80 ms early against their scheduled times. The picture shows an action one frame later, so v1's 0.16 s lead over-corrected for this pass. v2 uses 0.065 s, and the measured onsets now sit within ±15 ms of their first frame.
- **Loudness:** −16.8 LUFS integrated.

## Open

- **For the game, not the trailer:**
  - the mouse-wheel return to the title (above) looks broken;
  - the title's tagline is probably as faint on a real launch as it was in capture.
- v1's timeline predates the title screen and is not re-rendered here. It now needs a title-dismissing `PREROLL` like v2's.
- No audience test. Nobody has listened to v2: sync and loudness were measured, not heard.
