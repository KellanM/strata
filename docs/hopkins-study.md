# Selling Strata the Hopkins way (2026-10-30)

**Brief.** How Claude C. Hopkins would sell and explain Strata, from *Scientific Advertising* (1923, "SA"), *My Life in Advertising* (1927, "ML") and his real ads, set against the current App Store listing (`store/app-store-listing.md`). This is a study only: nothing in the listing has changed. The quotes, the 11 ads inspected (Library of Congress scans and OCR), the 15 mechanisms and where Hopkins clashes with the App Store are all in [hopkins-study-sources.md](hopkins-study-sources.md).

**Who it is for.** Someone scrolling App Store search for a puzzle. They see the icon, name, subtitle and the first three screenshots. If they tap through, they read the promotional text plus about three lines before "more". Installing is free, so the choice takes seconds: what Hopkins called a "chewing gum" decision (SA 8). One complete sentence has to carry the whole case.

**What counts as success.** In the parts people actually see, a stranger can tell:
1. what they *do*;
2. what they *get*;
3. why it's different;
4. what it won't do to them.

The copy must keep Kellan's calm voice and never claim anything untrue.

## The baseline, read as Hopkins would

| Field | Now | Hopkins' reading |
|---|---|---|
| Subtitle | "A calm 3D puzzle game" | A mood, not a fact: "Platitudes and generalities roll off the human understanding like water from a duck" (SA 7). Every relaxing puzzle says "calm". This is the category's "Pure", the word every brewer used. |
| Promo text | "Every stone keeps a secret. Read the numbers…, chisel away…, and watch a small, lovely thing come out of the rock. No timers. No ads." | It opens with the action (good) and has curiosity (good). "A small, lovely thing" is fine writing standing where a fact should be: "Fine writing is a distinct disadvantage" (SA 2). The reassurance falls **below the fold** (mock, left). |
| Description, line 1 | "Every stone keeps something inside." | Repeats the promo's first line. On the product page it sits below the fold anyway. |
| Screenshots | 5 raw game screens, no captions | They show the outcome first (the fox revealed), which is Hopkins' "the face as it will appear" (SA 18). But nothing says what you do. The second screen is clue numbers with no key. |
| Price | Never says "free" | Correct, even by Hopkins: "free" at the top of Pepsodent ads "divided our results by four" (ML XIV). |

## What transfers (ranked)

1. **Say the specific thing every puzzle game has but none says (the preemptive claim, ML VII Schlitz).**
   - Checked today with `node tools/aha-audit.mjs`: **208 of 208 stones (levels, bonus stones and lessons) have exactly one answer, and line logic alone reaches it.**
   - Many nonogram apps can say the same, but few say it, and "no guessing" is a top complaint in puzzle reviews.
   - "One answer per stone, no guessing" is Strata's "washed with live steam". It is true, checkable and concrete.
2. **Specifics over moods (SA 7).**
   - Name the objects, the numbers and the action. "A fox or a baby dragon is left standing" beats "a small, lovely thing".
   - Further true specifics:
     - 182 stones in 15 chapters;
     - stones from 48 to 567 cubes;
     - 11 lessons;
     - each object has its own one-line story ("Everyone said it had been gone for seventy million years. Nobody told it.").
3. **Tell the whole story where it is read (SA 4, 8).** The three visible lines must hold the action, the reward, the difference and the reassurance. The mock showed the current text loses the reassurance. My first rewrite lost the difference too. The third draft fits all four (see Experiment).
4. **Service, not salesmanship (SA 3: "the best ads ask no one to buy").** Captions should *teach the game*, e.g. "The numbers say which cubes stay". They should never say "Download now" or "Best puzzle of 2026". This also fits the calm voice.
5. **Positive first, reassurance after (SA 18; his "It cannot harm…" pattern).** Lead with the fox. "No ads, no timers" closes, as the druggist's guarantee did.
6. **Curiosity (ML IV, XIII "shot from guns").** The hidden object is built-in curiosity. The first caption names the find over the screen that shows it.
7. **Individuality (ML XV).** The story lines give each object a personality no competitor has. The description should quote one, not describe them.
8. **Keyed testing (ML XIV coupons; SA 1 "cost per customer").**
   - Our coupon is a **Custom Product Page** per channel: its own link, promo text and screenshots.
   - **Product Page Optimization** A/B-tests screenshots and the icon.
   - As I understand Apple's tools, neither can test the subtitle, so the subtitle change is a judgement call.
   - Judge by App Analytics retention (day 7), not installs. That is Hopkins' "cost per customer", not per reply.

**Not adopted:**
- Long copy as length for its own sake. The fields are capped, and the description below "more" is read by few.
- Urgency or scarcity.
- Any "free" headline.
- Superlatives.
- Health claims. "Relaxing" is fine; "reduces stress" is a Liquozone-style claim.
- The ethics warning in the sources applies: Hopkins' methods sold Liquozone as readily as Pepsodent. Specific claims are only as good as their truth, which is why claim 1 was verified first.

## Experiment: the store page, before and after

`docs/copy-frames/hopkins-store-mock.png` is a 390 px mock: the real icon and screenshots, with search result and product-page fold at three lines.

- **Now:** the fold ends "…a small, lovely thing come out of the rock. No…". The "no ads" promise is cut, and nothing says what's different.
- **Draft 1** (169 characters): "…a fox, a lighthouse or a baby dragon is left standing. Every stone has one answer. No ads, no timers." It was cut at "Every stone has one…", which lost both the difference and the reassurance. It was rejected for length, not tone.
- **Draft 2** (149 characters): "…found by logic alone. No ads. No tim…". Still cut.
- **Draft 3** (134 characters): all four parts fit in three lines.

**Limits.**
- The mock uses Segoe UI at 15 px, not iOS's SF Pro, and I'm assuming the product page clamps promo plus description to about three lines. Check the fold on a real iPhone after pasting.
- No player has seen any of this.

## Copy to try

**Subtitle (30):**
- "Carve what's hidden, in 3D" (26) **recommended**. It keeps "3D" for search; "puzzles" is already in the name.
- Alternative: "3D logic puzzles: no guessing" (29). It uses the preemptive claim, but less of the curiosity.
- Kellan chose "A calm 3D puzzle game" on 2026-10-28 to match mythen.io. Changing it is his call, and the site would want the same line.

**Promotional text (170).** It can be changed any time without a new build, so it is the cheapest test:
```
Read the numbers, chisel the stone, and a fox or a baby dragon is left standing. One answer per stone, no guessing. No ads, no timers.
```
(134)

**Description, opening.** The rest of the current description stays; only the top and the generalities change:
```
Tap a cube to chisel it away. The numbers on the stone's faces tell you which cubes to keep. Clear the rest, and what was hiding inside is left standing: a lighthouse, a fox curled asleep, a dragon too young to breathe fire.

Every one of the 182 stones has exactly one answer, and you can always reach it by logic alone. You never have to guess.

Each find comes with its own line. The coelacanth: "Everyone said it had been gone for seventy million years. Nobody told it."
```
Also in the body:
- "Stones grow larger" becomes "Stones grow from 48 cubes to 567".
- The "QUIET BY DESIGN" list stays last, in the reassurance position.

**Screenshot captions.** A proposal; the shots are currently uncaptioned, Kellan-approved and freshly reshot. Each caption teaches one thing:
1. Origami Fox result: "Chisel the stone. Find the fox."
2. Orrery mid-solve: "The numbers say which cubes stay"
3. Old Stones journal: "182 stones, each with its own story"
4. Maple Bonsai: "Turn it. Peel back the layers."
5. Coelacanth: "One answer every time. No guessing."

The trade-off: a caption band shrinks the game image (see mock), and the screenshots look less like a quiet art piece. Test it with Product Page Optimization (captioned vs raw) rather than deciding by taste.

**Ad lines.** These agree with `docs/ad-hooks-study.md` concept 4 ("This block is hiding a dragon"), which is Hopkins' curiosity plus a specific. Add the preemptive claim as an end-card line: "One answer. No guessing." It is calmer than "PLAY NOW" and does the same work.

## Open questions
- Does "no guessing" mean anything to players who have never met a nonogram? It may only land with puzzle people, which is Hopkins' "hail the right reader" (SA 5). Test it on the puzzle-channel Custom Product Page first.
- Captioned versus raw screenshots: a Product Page Optimization test, after launch.
