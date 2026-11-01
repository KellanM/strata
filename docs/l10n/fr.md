# French (fr): glossary, choices and open doubts (2026-10-31)

**Live (Kellan, 2026-10-31), without a native speaker's review.** The table is `public/i18n/fr.js` (712 strings: 174 interface strings, and 538 of the game's own words: 209 story lines, the names, the chapters and the lessons). The store listing is `store/listing-fr.md`. The system, and how a language goes live, are in `docs/localisation.md`.

A French device gets French for every French tag (fr-FR, fr-CA, fr-BE, fr-CH: `match()` in `public/js/i18n.js`). The iOS app declares `fr` in `CFBundleLocalizations` (`tools/ios-configure.mjs`).

## Choices

- **Tu, not vous.** The game speaks to one player, calmly, with no ceremony, and French casual games and puzzle apps say tu. Vous would make the short imperatives ("Touche le trou.") sound like a manual. Adjectives that would take the player's gender are avoided: "Tu bloques ?", not "Bloqué ?"; "à toi de jouer", not "seul".
- **Typography.** A no-break space (U+00A0) before ":" and a narrow no-break space (U+202F) before "; ! ?", as the Imprimerie nationale has it; the typographic apostrophe (’) everywhere; « » if a quote is ever needed (none is, today). "N° 12", "Jour n° 12" with a no-break space. `test/i18n.test.js` checks the spacing and that no straight quote or apostrophe is left.
- **Plurals.** French counts 0 as singular (Intl.PluralRules: 0 and 1 are `one`). `slips` keeps its `zero` form ("aucun faux pas"), as English has one; `one` shows the number, since it is said for 0 too ("0 monde", "1 monde"). Counts that English writes as a plain string (no plural forms) are worded so the number never needs agreement: "gemmes : 2 sur 3", "déjà réunies : 4", "découvertes : 12 sur 194".
- **Title case.** French titles are in sentence case: "Le verger", "Premières lueurs", "Bonsaï de glycine". The game uppercases its headings itself.
- **The old lessons** ("white stone", "picture", "coloured part") are cube, forme and cubes colorés, as copy-study C1 proposes for English and as Japanese and Chinese do. So "pierre" only means the level (and stone the material, in object names).

## Glossary (one term per thing; docs/copy-study.md C1)

| English | French | Notes |
|---|---|---|
| stone (the block, a level) | pierre (f) | "la pierre du jour" for Today's stone |
| cube | cube (m) | |
| object (what's found) | forme (f) | "taille la pierre · trouve la forme"; forme fits a fox as well as a lantern, where objet would not |
| chisel (tool) | Burin | not "ciseau": singular ciseau reads as scissors (ciseaux) on a two-word tool switch |
| chisel (verb) | tailler | "tailler la pierre"; "Taille-le." The gesture is toucher |
| mark (tool / verb) | Marque / marquer | "un cube marqué est à l’abri du burin" (copy-study C4: no "can't") |
| slip | faux pas (m, invariable) | "1 faux pas", "3 faux pas", "aucun faux pas" |
| gem | gemme (f) | "3 gemmes"; the store listing says gemmes where English says stars |
| shrine | sanctuaire (m) | "✦ Sanctuaire ✦" on the shrine's card: "Le sanctuaire de" would need an article per chapter name |
| Finds | Trouvailles | the map's ring, the journal's title, "tes trouvailles" |
| lesson | leçon | |
| circled number (two pieces) | nombre cerclé | "un 2 cerclé" |
| squared number (three or more) | nombre encadré | |
| piece / group (touching cubes in a row) | groupe | English says pieces in the lessons and groups on the Rules page; French says groupe in both |
| gap | trou | "Touche le trou." |
| row / column | rangée / colonne | rangée for any line ("en largeur, en hauteur ou en profondeur"); colonne for straight down. Not "ligne": line is the diamond's rail |
| diamond (the peel handle) | losange, its line: rail | |
| world | monde | |
| Drift | Dérive | |
| Clockwork Workshop (world) | L’horlogerie | shorter than "Atelier des rouages", which overflowed the chapter card |
| Today, the Daily Stone | Aujourd’hui, la pierre du jour | "Daily #12" is "Jour n° 12" (the share line's first line stays English) |
| tap, double-tap, hold, drag | toucher, toucher deux fois, maintenir, glisser | as iOS's French says; mouse: clic, double-cliquer, clic droit |
| Settings, Rules, Touch | Réglages, Règles, Gestes | Réglages is iOS's word |
| on / off | oui / non | drawn in a small ring |

## Open doubts: the first things to fix if players report them

1. **Burin and tailler.** Burin is unambiguous, but stone-carvers' word is ciseau, and "tailler un cube" can read as "shape a cube" rather than "cut it away". If players hesitate in lesson 1, try "retirer" for the verb in the lessons only, keeping burin for the tool.
2. **Forme for the object.** It avoids calling a fox an objet, but "la forme cachée" is abstract. "Trouvaille" is the alternative, but it is already Finds.
3. **Rangée.** Natural for across, less so for "down" and "back"; French nonogram players say ligne and colonne. Rangée was kept so the diamond's rail can't be confused with a line of cubes.
4. **The lessons' gestures.** "Toucher deux fois" is long and is the most-read instruction; "double-toucher" is shorter but rarer. And "Glisse" (drag) vs "Fais glisser" (mouse, `hint.v2-geode.0.mouse`) differ only for the mouse.
5. **Jokes that lean on English.** The red grouse ("go back, go back" is its call only in English) became a plain line about telling everyone to turn back; the alpaca's "carries no opinions" and the scorpion "deciding to be the size of a door" are literal and may land flatter. The avocado keeps its rhythm with an em dash.
6. **Names.** "Fumeur noir" (black smoker) is the oceanographers' term but looks odd; "Vache highland", "Arche en serrure" (Keyhole Arch), "Pierre-œil" and "Chien-panier" are coined. Japanese names keep their Hepburn forms (Chōchin, Maneki-neko, Tsukubai), as French sites write them.
7. **Small labels in context.** `map.open` ("ouvert", for a shrine), `map.lockedAria` (", fermée": feminine, for a pierre; a locked shrine would want "fermé"), `win.drift` ("trouvaille de la dérive", a noun phrase to dodge the object's gender), `act.challenge` ("Défier", Game Center's challenge), `result.best` ("RECORD").
8. **The store keywords.** "Picross" is left out of the keywords (Nintendo's mark) but named once in the description; delete "ou picross en 3D" if that is a worry.

## Layout, checked

`tools/a11y-shots.mjs fr --lang fr [--large]` shot every screen at 390×844 and 375×667, with Larger text off and on (`shots/a11y/fr`, `fr-large`, and after the fixes `fr2`, `fr2-large`; `shots/` isn't committed). Its measure found no text off screen or clipped by its box in any run. Looking at the shots, and measuring every chapter name and story line in the real boxes (Chromium, both widths, both text sizes), found these, all fixed:

| Where | What | Fix |
|---|---|---|
| Map rings, Larger text | "AUJOURD’HUI" ran into "TROUVAILLES" | `:lang(fr)` ring labels close up to .12em tracking |
| Pause, both sizes | "RECOMMENCER" crowded "CARTE", and ran into it with Larger text | `pause.retry` is "Réessayer"; same tracking |
| Settings, Larger text | "MUSIQUE" nearly touched "VIBRATIONS" | same tracking (`.ring-toggle .l`) |
| Lessons list, both sizes | "CHAMPIGNON" ran past its column, out of the card with Larger text | the v2 mushroom lesson is "Cèpe"; names close up to .08em |
| Finds header, Larger text | "DÉCOUVERTES : 6 SUR 209" broke over two lines | `finds.count` is "6 sur 209" under the title Trouvailles |
| Chapter card (nowrap, 6.4vw) | "ATELIER DES ROUAGES" was 399 px on a 375 screen; "FÊTE DES LANTERNES" 367 | the world is "L’horlogerie"; the card's name closes up to .24em (widest now 340 at 375, 353 at 390) |
| Result's story line, Larger text | 6 of 209 lines took a third line (English: 1) | 22 lines rewritten shorter; every line is now ≤ 72 characters (the test's budget) and none takes a third line |

Left as is: in the Finds view with Larger text (18 px), 19 French story lines take three lines, against 6 English ones; the view has the room. The tool switch ("BURIN | MARQUE"), the result rings ("CARTE · SUIVANTE · REJOUER"), "TU AS DÉCOUVERT", the uppercase headings and the lesson cards fit at both sizes. The score shows "2,060" in the shots because the headless browser is en-US; it uses the device's locale (`toLocaleString()`), so a French device shows "2 060".

English is untouched: the only CSS is scoped by `:lang(fr)` (English pages are `lang="en"`), and the only code change adds `'fr'` to `LANGS` and `LANGS_LIVE`.
