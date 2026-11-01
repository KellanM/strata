# Strata link preview (og:image): a study

Date: 2026-10-31. This is research only, and no repo files were changed. The working files are in `%TEMP%\ogstudy\`: the downloaded images in `img\`, contact sheets `sheet1-3.png`, and the current card cropped square (`cur_sq.png`) and shrunk to thumbnail size (`cur_small.png`).

## 0. The current card

`public/og.jpg` is 1200×630 and 79 KB. Reading from top to bottom:

- the wordmark "S T R A T A";
- a 44 px headline, "Chisel the stone. Find what's inside.";
- two 400×400 rounded cards with soft drop shadows (the clue-numbered stone, then the solved fox), with a circled → arrow between them;
- a letterspaced uppercase line: "ONE ANSWER PER STONE · NO GUESSING · NO ADS".

Every element is centred on the vertical axis.

The page's `og:title` is "Strata: chisel the stone, find what's inside". The chat app prints that title directly under the image, so the image headline repeats it word for word.

## 1. Exemplars: the real og:image / twitter:image

I pulled the meta tags from each page's live HTML with curl on 2026-10-31, downloaded each image, and looked at it. Where a studio site had no og:image or a dead one, I used the Steam store page's og:image. That image is the game's 616×353 header capsule, and it is what actually unfurls when someone shares the Steam link.

| # | Source (tag URL) | Seen? | Composition |
|---|---|---|---|
| 1 | ustwogames.co.uk → storyblok `3_boatem_sailing.JPEG/m/1200x630` | Yes | Monument Valley 3 in-game art, full-bleed. A tiny boat (about 5% of the height) sits centre-left in a big pale sea, with architecture breaking the right and top-left edges. There is no text, no logo and no chrome. It is pure world, with the subject small. |
| 2 | monumentvalleygame.com → `images/ida.png` | No (404) | The dead tag shows that even great studios ship broken previews. monumentvalley.com (MV3) has no og:image at all. |
| 3 | altosodyssey.com → `testing93857/.../thumbnail.png` | No (404) | Also dead. |
| 4 | Mini Motorways: dinopoloclub.com | No og:image tag | The Steam capsule was used instead (seen). It is real top-down game art, full-bleed, with roads running off every edge. The wordmark and pin icon sit centred-right, about 40% wide. There is one text element and no chrome. |
| 5 | A Short Hike: ashorthike.com | No og:image | annapurnainteractive.com/en/games/a-short-hike returned 404 and a fallback card of the plain Annapurna logo on black (seen). That is not useful as art, but it shows what a fallback looks like. |
| 6 | unpackinggame.com → witchbeam `unpacking_maincapsule…png` (1920×1080) | Yes | Key art, not a screenshot. One hero object (a pink pig plush in a box) fills the upper middle at about 60% of the height. A big custom hand-lettered logo fills the lower half. The art bleeds off every edge. There is one text element and no chrome. |
| 7 | Florence: annapurnainteractive.com → sanity `…1650x2100.png?w=1200` | Yes | It is portrait (1200×1527), so platforms crop it heavily. A flat yellow field holds a profile illustration, with the hand-written "florence" at the top. There is one subject, one word, and the game's own lettering. |
| 8 | Wordle: nytimes.com → `wordle_og_1200x630.png` | Yes | White field. The logo is made from the game's own tiles (6 green squares, about 22% of the height), centred, with one small line under it: "A DAILY WORD GAME". The product is the logo. There are two text elements and no shadow or chrome. |
| 9 | townscapergame.com → squarespace `Townscaper 1024x256.png` | Yes | A white custom wordmark on black at 4:1. It letterboxes badly at 1.91:1. The Steam capsule (seen) is much better: a row of in-game houses fills the bottom 40% edge to edge and is cropped by the frame, with the letterspaced custom wordmark in the sky above. |
| 10 | Islanders: islandersgame.com (blank page) → Steam capsule | Yes (Steam) | One island, rendered in the game's engine at about 75% of the height, sits centre-left in a turquoise sea. The huge custom logo crosses the top, and its "A" is a mountain. There is no chrome. |
| 11 | Dorfromantik: dorfromantik.com (no tag) → Steam capsule | Yes (Steam) | One hex tile with a windmill fills the left 50% and bleeds off the bottom-left. The custom logo is on the right over flat sky blue. One object, one logo. |
| 12 | Old Man's Journey: oldmansjourney.com (unreachable) → Steam capsule | Yes (Steam) | A painted harbour scene, full-bleed, with an emblem-style custom logo on the left. |
| 13 | A Little to the Left: site unreachable → Steam capsule | Yes (Steam) | Real game objects scattered flat-lay, bleeding off every edge, with the logo on a paper card in the centre. The "card" is a physical object from the game, not UI chrome. |
| 14 | Before Your Eyes: beforeyoureyesgame.com → squarespace `BYE_logo_black.png` (1500×177) | Yes | A black logo on a transparent background at 8.5:1. It renders as almost nothing (black on black in dark-mode clients). This is an anti-pattern. |
| 15 | linear.app → `/api/og/main?title=Linear` | Yes | Logo and wordmark centred on a near-black vertical gradient, at about 15% of the height. Nothing else. |
| 16 | vercel.com → `og-home-not-x.png` (2400×1350) | Yes | The triangle mark alone with a back-glow rim light, on black. No words. Light, not chrome, is the treatment. |
| 17 | panic.com → `social-card.png` | Yes | The P logo alone, large (about 50% of the height), centred on pale grey. |
| 18 | nova.app → `social-card.jpg` | Yes | A logo and wordmark over a real editor window, bled off the bottom edge. It is the only exemplar with a screenshot, and it is cropped by the frame rather than floated in a card. |
| 19 | play.date → `social-card-3…jpg` | Yes | One product photo: the yellow Playdate (about 80% of the height), centred, in a straight-on, slightly 3/4 view on a purple-to-orange gradient. The logo is on the device's own screen. There are no words outside the object. This is the closest analogue to a Strata stone in a sky. |

Of the indie games I saw, nine used real art or key art. Mini Motorways, Islanders, Dorfromantik and Townscaper (Steam) are in-engine, and Unpacking, Florence, OMJ, ALTTL and MV3 are painted. I also saw five design-led cards: Wordle, Linear, Vercel, Panic and Playdate. Three tags were dead or degenerate: MV1 and Alto returned 404, and BYE is a transparent strip.

### Patterns

1. **One subject.** Every good card has a single hero: an island, a tile, a pig, a device or a mark. None compares two states.
2. **No UI chrome.** None of the 19 cards has rounded cards with drop shadows, arrows, pills or badges. Nova's screenshot bleeds off the frame and is not floated. ALTTL's card is a paper prop from the game itself.
3. **Text budget: 0 to 2 elements.** That means a logo, plus at most one short line (Wordle's "A DAILY WORD GAME"). No exemplar has three tiers. The game cards never repeat the page title as a sentence.
4. **The lettering is the game's own.** Every game has a custom wordmark, and Wordle's is built from its own tiles. Nobody sets a sentence in a stock font.
5. **Bleed and scale.** The art meets or crosses the edges (Townscaper, Dorfromantik, Mini Motorways, ALTTL), or the single object is big: Playdate about 80% of the height, Islanders about 75%, Panic about 50%. MV3 is the deliberate exception, a tiny subject in a big world, and it works because the world itself is the brand.
6. **The background is the game's world or one flat colour.** It is never a neutral backdrop with pictures pinned to it.
7. **Light as a device.** Vercel rim-lights its mark and Playdate uses a gradient sky. Strata already has this in its sky and rays.

## 2. Practitioner guidance and platform behaviour

**Steam capsule rules** ([Steamworks: Store graphical assets](https://partner.steamgames.com/doc/store/assets/standard)):
- Use "the key art and logo that is being used for any retail boxes or marketing".
- "Do not include quotes or other strings of text beyond the title of your game."
- "The game's logotype should be easily legible against the background."
- The small capsule must hold a "readable logo, even at smallest size". Steam auto-generates 120×45 and 184×69 versions.
- Screenshots are a separate asset that "should exclusively show the gameplay". Capsules are art, not screenshots.

**Indie capsule guides** ([presskit.gg](https://presskit.gg/field-guides/steam-capsule-art-guide), [steampageanalyzer](https://www.steampageanalyzer.com/blog/steam-capsule-design-guide), [bugnet](https://bugnet.io/blog/steam-capsule-art-a-guide-for-indie-devs)) agree on three points:
- design from the smallest size up;
- have one focal point ("when everything is emphasized, nothing is");
- apply the one-second recognition test.

These are practitioner opinions, not standards.

**Apple Marketing Guidelines** ([developer.apple.com/app-store/marketing/guidelines](https://developer.apple.com/app-store/marketing/guidelines/)):
- "Display your app on the screen as it appears when your app is running."
- "Don't engage in 'suspension of disbelief' by showing … your app in a fantastic or unrealistic manner."
- "Use clear, simple messaging." "Don't add superlatives."

These support the Hopkins constraint: show the real stone and the real object. Third-party summaries of Apple's App Store promotional artwork (the featuring program) say it excludes taglines, URLs, app icons and prices ([Gummicube](https://www.gummicube.com/blog/apple-promotional-artwork/)). I could not retrieve Apple's own page for that, so treat it as unverified.

**Platform crop and display.** Most of this comes from third-party guides, because none of the platforms publishes exact specs.

- **iMessage:** the large preview shows the full 1.91:1 image, with the title and domain in a bar under it. Some guides say lock-screen or notification tiles crop to the centre square; that is unverified.
- **WhatsApp:** the preview is often a small square thumbnail beside the text, so a 1200×630 image is cropped to the centre square ([Nuxt SEO WhatsApp guide](https://nuxtseo.com/docs/og-image/guides/whatsapp)). Meta's own spec says the image must be under 600 KB, at least 300 px wide and no wider than 4:1, and that WhatsApp may "revert to small link previews" ([Meta docs](https://developers.facebook.com/docs/whatsapp/link-previews)). Practitioners report silent failures above about 300 KB. WhatsApp caches previews for a long time.
- **X:** `summary_large_image` shows roughly 2:1 to 1.91:1 with a small top and bottom trim. That is about 15 px per side at 1200×630. The title and domain sit outside the image.
- **Discord:** the large embed appears only with `twitter:card=summary_large_image`, which Strata already sets. Without it you get an 80×80 thumbnail. Discord caches each URL indefinitely, so add a `?v=` parameter when the image changes.
- **Slack:** a 1.91:1 unfurl with about a 24 h cache. The image must be served with an image MIME type.
- ([screenhance](https://screenhance.com/blog/og-image-size-guide), [env.dev](https://env.dev/guides/opengraph-image-sizes))

### Safe areas for a 1200×630 canvas

- **Full frame:** 1200×630. Keep anything essential at least 40 px from the edges.
- **X, 2:1 trim:** keep essentials within y 20–610.
- **Centre-square crop (WhatsApp thumbnail, possible iMessage tile):** x 285–915 (630×630). The usable core, with a 35 px inner margin, is **x 320–880, y 35–595 (560×560)**. The stone and the wordmark must live here.
- **Thumbnail legibility:** the hero must survive at 80×80 (Discord small) and about 120 px wide (Slack and WhatsApp small). That means the stone fills at least 55% of the canvas height, about 350 px or more, and has a silhouette with clear value contrast against the sky.
- **File size:** stay under 300 KB as a JPEG; 79 KB today is fine. Bump `?v=` when the image changes.

## 3. Diagnosis: why it reads as "vibecoded"

I tested each suspect against the exemplars and against crops of the current file.

1. **Screenshots as UI cards with drop shadows: confirmed, and the biggest cause.**
   - 0 of 19 exemplars float pictures in rounded, shadowed cards. That is the default output of web templates and generators (Tailwind cards, `rounded-2xl shadow-xl`).
   - It tells the viewer "here are two screenshots of an app" instead of "here is a world".
   - It also cuts Strata's best asset, the sky, into two small tiles on a neutral peach page. The art never meets the frame edge.
2. **The before → after arrow: confirmed.**
   - It is a slide-deck and SaaS device, and no exemplar uses it.
   - It halves the hero: each stone is only about 63% of the canvas height, and two heroes compete.
   - In the WhatsApp centre-square crop (`cur_sq.png`), the **arrow is the centre of the thumbnail and both stones are cut in half**. That is the worst possible result for a thumbnail.
3. **Centred everything: partly rejected.**
   - Wordle, Linear, Panic, Vercel and Playdate are all centred and look crafted.
   - The problem is centred *stacked tiers* (wordmark / headline / cards / footer), which is template rhythm. A single centred subject is fine, and the square crop actually rewards it.
4. **Three text tiers: confirmed. It is really four, counting the wordmark.**
   - The exemplars use 0–2 text elements.
   - The headline duplicates `og:title`, which every client prints directly under the image, so the message appears twice.
   - The claim line holds three claims ("one answer · no guessing · no ads"). That is a feature list, not one specific claim, which fails Hopkins's own test of specificity.
   - At 120 px wide (`cur_small.png`), no text is legible anyway.
5. **Template-like system font: confirmed, with a nuance.**
   - The game's font stack is `"Avenir Next", Avenir, Futura, "Century Gothic", "Segoe UI", system-ui`. The card was rendered on Windows, so the headline came out in the **Century Gothic fallback** set in plum. It is not the game's intended face, and it is not lettering.
   - Every exemplar game uses a drawn wordmark. Strata's thin, widely letterspaced "S T R A T A" is closer to an identity than the headline is, and it should be the only type.
6. **Additional causes found:**
   - **Flat peach page colour.** The background is a neutral page, not the game's sky, so the image reads as a web page rather than a place.
   - **Symmetric diptych.** Equal-weight halves have no focal point, which fails the "one focal point" rule.
   - **The stone reads as a "UI" object.** Clue numbers in cream caps on every top face read as interface at small sizes. They are noise, not an image.

## 4. Three directions

All three are rendered by the game itself in a 1200×630 landscape browser viewport. That covers the real sky gradient, rays, particles and the 3D stone, with the HUD hidden. Compositing is limited to the one wordmark and, in B, one line.

**Hopkins constraint:** each shows one real stone and its real object, and any words make one specific, checkable claim.

### A. "The reveal" (rank 1)

**Subject.** One stone at the moment of solving:
- the fox, with the win colour blooming across its faces (`uReveal` at about 0.55–0.7, partway through the real 1.5 s reveal in `main.js`/`cubes.js`);
- a few ivory un-coloured cubes and drifting particles still around it;
- a 3/4 view from slightly above, the camera the game already uses.

It is truthful: this is a real frame the player sees.

**Scale and position.**
- The stone is about 66% of the canvas height (about 415 px tall).
- Its bounding box is centred at x 600 and sits a little low, at y 300–335 (optical centre), so its full extent is within **x 360–840, y 110–530**.
- That fits the 560×560 square-safe core with margin.

**Background.**
- The game's own sky gradient, full-bleed to all four edges.
- The rays radiate from directly behind the stone. That gives a Vercel-like rim, and it doubles as the focal device instead of a card or shadow.
- No vignette box and no frame.

**Text.**
- Only the existing thin "S T R A T A" wordmark, in white or ivory at about 26–30 px with 0.42em tracking (the trailer's h1 treatment).
- Centred at y ≈ 70, which is inside the square crop (it is about 260 px wide).
- No headline, because `og:title` already carries "chisel the stone, find what's inside".

**Crop behaviour.**
- The square crop keeps the stone and wordmark whole.
- The X trim touches only sky.
- At 80 px the result is an orange fox silhouette in light, which is legible.

**Risk.**
- It does not show the puzzle mechanic (no clue numbers), so it could read as a "cute voxel toy" rather than a nonogram. The `og:description` and title must explain the puzzle.
- A mid-bloom frame may look unfinished if the bloom isn't striking. Render a range of `uReveal` values and pick one.
- **Update `og:image:alt`.**

### B. "One stone, one claim" (rank 2)

**Subject.** One stone mid-solve, about 40% chiselled:
- clue numbers visible on the remaining faces;
- the fox's shape already obvious in the kept cubes.

It is the truthful "puzzle" state. Use a fox-shaped (or "kept cubes") view state if the renderer has one; otherwise use a real mid-game save.

**Scale and position.**
- About 60% of the height, centred at x 600 and raised slightly: within **x 340–860, y 70–450**.

**Background.** The same full-bleed sky and rays as A.

**Text.**
- **One claim**, set in the game's letterspaced uppercase at 24–26 px and 0.3em, ivory, centred in y 520–560, and no wider than 520 px so it survives the square crop.
- It must be one specific claim, not a mood. Candidates:
  - "EVERY STONE HAS ONE ANSWER"
  - "NO GUESSING, EVER" (the "no guess" guarantee is Strata's differentiator against random nonograms, and it is checkable)
- No headline. The wordmark is optional; if used, it goes top centre as in A, and then there are two text elements (the maximum).

**Crop behaviour.**
- The square crop keeps the stone and the claim.
- At 80 px the claim is illegible, but the stone still reads.

**Risk.**
- The clue numbers turn to speckle at small sizes and can look like a "UI" again.
- To limit that, render at a camera distance where the numerals are at least 22 px, and keep the numbered faces to 2 sides.
- Text on a sky with rays needs a contrast check: ray brightness peaks behind the stone, but the claim sits below it in the darker lower sky.

### C. "Macro: the stone fills the frame" (rank 3)

**Subject.**
- The camera pushed in until the stone (the solved fox at the end of the reveal, or the stone mid-chisel) crosses the bottom edge and both sides, like the houses in Townscaper's capsule or the tile in Dorfromantik's.
- The fox's head and ears (the most recognisable part) are kept in the upper-centre, at **x 380–820, y 60–420**.
- Sky shows only above and around the ears. Rays come from the top.

**Text.** The wordmark only, small, at top centre over the sky. Or no text at all, MV3-style.

**Crop behaviour.** It is the most crop-proof: any crop is still "fox blocks in light".

**Risk.**
- It breaks "one whole stone": the viewer may not understand that it is a stone, or a puzzle.
- Voxel faces at macro scale show render artefacts (aliasing, banding), so render at 2× and downsample.
- It is the most "mood" of the three, and the least Hopkins-aligned.
- Use it as an alternate, for example a seasonal image or the X header, rather than as the primary card.

### Rejected options

- **Tiny stone in a big sky (MV3 style).** Beautiful at full size, but it fails at 80–120 px thumbnails, and WhatsApp and Discord small previews are common.
- **Two stones in one sky without cards.** It still competes for focus and still splits under the square crop.
- **An app icon on a gradient.** It is generic, and it does not show the product.

## 5. Build notes

- Render from the game with the HUD hidden in a 1200×630 viewport at device pixel ratio 2. Downsample to 1200×630 and save as a JPEG at quality 82–85, aiming for 80–250 KB.
- Before choosing, check every candidate three ways: (a) at full size, (b) cropped to the centre square at x 285–915, shown at 160 px, and (c) shrunk to 120×63.
- **Version the URL** (`og.jpg?v=2`) because Discord and WhatsApp cache previews.
- **Rewrite `og:image:alt`** to describe the new image: it currently describes the two-card version.
- Optionally provide a separate 800×800 square for WhatsApp (practitioner advice, unverified). This is low priority if A's square crop already works.

## 6. Limits

- MV1 and Alto's tags 404; MV3, Mini Metro and Motorways, A Short Hike, Islanders, and Dorfromantik have no og:image. A Little to the Left and Old Man's Journey sites were unreachable. Those games are represented by their Steam capsules: real, but a sibling asset, not the studio's own OG choice.
- I did not test WhatsApp, iMessage, X, Discord or Slack live. The crop behaviour comes from third-party guides plus Meta's spec, and the WhatsApp square crop and iMessage tile crop are practitioner claims, not documented behaviour.
- I could not retrieve Apple's App Store promotional-artwork page itself. The claim that it excludes taglines comes from a secondary source.
- I made no new renders, so the directions are specified, not prototyped. Whether a mid-`uReveal` frame looks good has to be checked in the renderer.

## What was built (2026-10-31)

**Baseline (rejected by Kellan as "vibecoded"):** two screenshots in rounded, shadowed cards, an arrow in a circle, a centred headline and a claim line.

**Experiments**, each rendered from the game itself (tools/make-og.mjs):
- **Half-carved stone:** rejected. Before the reveal every cube is stone-coloured, so at 40–90% carved the fox doesn't read; it's a lumpy salmon block with clue numbers.
- **Reduced-motion reveal:** rejected. The bloom is instant, the gems and score come in at once, and the object is framed small for the result screen.
- **Settled reveal:** kept. The finale's gems and score group is hidden, the fox is held at its played angle, the shot is rendered at 4x, and the crop puts the fox at about two thirds of the height. The game's own camera zoom could not be overridden during the finale, so the crop does the work.
- **Wordmark only, or wordmark plus one claim:** the claim was kept (Hopkins: one specific, true claim). The two text elements match the exemplars' limit.

**Result:** one hero in the game's own light and sky, the STRATA wordmark (Jost 300, standing in for Avenir Next), and "One answer per stone. No guessing." Everything sits inside the centre square, x 320–880, and the fox reads at 240 px wide. The image URL is versioned `?v=2`, because chat apps cache previews.

**Limits:** not yet checked in live iMessage, WhatsApp or Discord unfurls. That's only possible once v1.1 is merged and deployed.

## Revision: the before and after, inside one stone (2026-10-31)

Kellan wanted the before and after kept, so people know what the game does, but styled to be more interesting. Two side-by-side pictures are the template look the exemplars avoid, and a centre-square crop cuts both. So the comparison now happens inside one object:
- **The layout:** the Origami Fox's untouched stone, with its clue numbers, fills the left of the frame and gives way along a thin diagonal seam of light to the revealed fox on the right.
- **How it's made:** both halves are the game's own renders of the same stone. The stone is scaled onto the reveal's framing by projecting its eight corners through each shot's camera; the reveal sits at exactly 0.6 of the stone's on-screen size. It is masked to its own outline, so the sky is one continuous sky.
- **Tuning:** the cut sits 15% of the stone's width left of centre and is tilted 14°, so both of the fox's eyes show.
- **Cost:** the stone hides the fox's left ear.

The URL is versioned `?v=3`.
