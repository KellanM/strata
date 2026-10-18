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
