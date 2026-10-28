# Support page and App Store description study (2026-10-28)

**Brief:**
- `public/support.html` is the App Store Support URL. A frustrated player should reach a person fast, and find the few answers that save writing, in Strata's own calm look.
- Separately, Kellan asked what the best games put in their App Store description.

The full research notes, page text and captures are in `shots/support-study/` and `shots/description-study/` (gitignored working files).

## Support page

### Sources

18 pages were captured at 390×844 on 2026-10-28. The contact sheet is `support-frames/references.jpg`.

**Captured:**
- Monument Valley 1–3: ustwo's Zendesk, its save-progress article and the contact page;
- Sky: thatgamecompany's Helpshift and its lost-account article;
- Alto's Adventure and Odyssey, Prune, Threes, Mini Metro;
- Townscaper: Raw Fury's Jira desk;
- Two Dots, I Love Hue, A Monster's Expedition, Hidden Folks.

**No support page anywhere:**
- Gorogoa (the domain is dead);
- Florence (Annapurna's desk is closed);
- Journey (the site has none).

**Apple:**
- Guideline 1.5 requires "an easy way to contact you".
- The App Store Connect Support URL field says the page must lead to actual contact information, "as may be required by local law".

### What the best pages do (observed)

1. **Name the human and give an honest wait.** Hidden Folks: "Email studio director Adriaan… We answer all incoming emails, so it might take us a few days." Alto's support mail goes to the founder; Monster's Expedition names its team.
2. **Say where progress lives, and what can't be recovered.** I Love Hue explains it per platform; Sky lists when recovery is impossible. The anti-pattern is ustwo's "we can only offer very limited help".
3. **A short "check this first" list, with the email on the same page.** Hidden Folks is about 1.3 phone screens. The anti-pattern is Alto: a bare email link at the end of a ~7,000 px page.
4. **Name known issues, with a date.** Mini Metro: "already fixed and is under review at Apple". Sky puts a banner at the top.
5. **Use the game's own look, not helpdesk chrome.** Prune, Threes, Mini Metro and I Love Hue do this. Zendesk, Helpshift and Jira bring cookie walls and other games' categories.
6. **Be candid about limits.** Mini Metro explains why it has no Discord.

### Baseline

`support-frames/before-after.jpg`, left. A plain text wall about 2 phone screens long, with the email at the very bottom and no game art. It had three stale facts:
- "peel" was used for chiselling;
- it said "stars" where the game has gems ◆◆◆;
- the lessons were "from the first stone on the map", but that stone is **Learn**, and a long press on it lists every lesson.

It had no "is my progress safe" answer, no "won't open" answer, and no reply time.

### Revision (shipped)

`support-frames/before-after.jpg`, middle and right.
- **The top:** the 3×3×3 stone on lime (`public/icons/stone-3x3x3-240.png`, Kellan's pick 2026-10-28), STRATA and HELP in the game's letter-spaced type, on the icon's lime fading to the game's cream.
- **The contact card, on the first screen:**
  - "Something not right, or a question?";
  - the email as a button;
  - "A person reads every message. We are a very small studio, so a reply can take a few days.";
  - what to include: the iPhone model, the iOS version and the in-game version line;
  - a dated "Known problems: none right now".
- **"Before you write":** seven questions, closed until tapped (`<details>`):
  - Is my progress safe? This covers the device backup, a new iPhone, **delete erases it, while Offload App keeps it**, and the web build's storage.
  - Won't open or stuck.
  - How to play, with the Learn stone and the long press.
  - The numbers.
  - The time limit, gems and taking a slip back.
  - Sound, music and vibration.
  - Is there anything to buy?
- **The footer:** Privacy · © 2026 Unsupervised Rock.

**Checks:**
- With the questions closed, the whole page is about 1.1 phone screens.
- Every in-game claim was checked against the code: Learn's long press (`map.js`), Rules in the pause menu (`index.html`), the gems, and ↺.
- No page errors.

This is my reading of the page at phone size; no player has tested it.

### Open (Kellan's call)

- **Name the human: done** (Kellan, 2026-10-28): "Kellan, who makes Strata, reads every message." First name only on Strata's page; mythen.io uses the full name.
- **Legal contact details:** Apple's field note mentions an address and phone "as may be required by local law". That ties to the EU trader-status decision (`compliance-study.md`).
- **Keep the known-problems line current.** Update its date whenever something is fixed or found.

## App Store description

### Sources

The current US listing text of 34 games came from Apple's iTunes Lookup API:
- Kellan's references;
- the category's best sellers (Nonogram.com, Picture Cross, Sudoku.com, Woodoku…);
- the 3D nonogram rivals (PiKuBo, Carve, DIGDLE);
- for scale, Subway Surfers, Hay Day and Clash of Clans.

**Apple:** only the first sentence or so shows before "more". The promotional text (170 characters) can change without review and doesn't affect search. On iOS the description isn't indexed for search; Google Play's is. ASO sources report that under about 5% of visitors tap "more".

### Mechanisms

1. **Line one is a world or a feeling, plus the verb and the payoff for an unknown game.**
   - Alto: "Above the placid ivory snow…";
   - Carve: "Read the clues. Carve the cube. Reveal the shape.";
   - never "addictive" (Nonogram.com and Woodoku do this).
2. **Concrete small nouns over adjectives.** Strata's fox curled asleep, coelacanth and orrery are the best nouns in the set.
3. **Saying what's absent signals calm.** Townscaper: "No goal."; Unpacking: "no timers, meters or scores". A free game with no catch puts it near the top.
4. **Numbers small, exact and named.** Alto's "180 handcrafted goals" lands better than "12,000+".
5. **Short ALL-CAPS sections, not bullet dumps,** and no borrowed praise.
6. **Length follows purpose:**
   - Subway Surfers is 459 characters: shouted verbs, six bullets.
   - Supercell's are 3,600–3,700, because of a legally required IAP notice and keyword repetition ("farm simulator" ×4) that only Google Play indexes.

### Risk found

DIGDLE, a rival 3D nonogram, opens: "Every block hides a secret. Your job is to find it." Strata's promotional text "Every stone keeps a secret" is too close. Retire it.

### Drafts

All are in `shots/description-study/drafts.txt` (A, B, P1, P2), and every claim was checked against the code. **Recommended for the App Store (2026-10-28): the short version** (about 480 characters):
> Chisel the stone. Find what it's keeping.
>
> Strata is a 3D nonogram. Numbers on each face count the hidden cubes in each row. Tap to break away what doesn't belong, and a small thing is left: a fox curled asleep, a lantern, a coelacanth.
>
> • 182 stones across 15 chapters
> • Gems for a steady hand, never for speed
> • Twelve short lessons, and a gentle glow when you're stuck
> • Plays offline
> • No ads, no purchases, no accounts
>
> Find a quiet minute, and pick up a stone.

- **Draft A** (1,471 characters) is kept for Google Play, where the longer text helps search.
- **Promotional text P1:** "182 stones, 15 places, nothing to buy. Chisel each one until only what it was keeping is left. No ads, no timer, no sign-in, and it all plays offline."
- **Not yet in `store/app-store-listing.md`:** waiting on Kellan's pick.
