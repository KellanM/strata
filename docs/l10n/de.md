# German (de): the glossary, the choices, and the doubts to fix first (2026-10-31)

**Live** on Kellan's word, as Japanese and Chinese went live ("We don't need a human reviewer"): `public/i18n/de.js` has `reviewed = true`, `de` is in `LANGS_LIVE` (`public/js/i18n.js`) and in the iOS app's `CFBundleLocalizations` (`tools/ios-configure.mjs`). Every German tag matches it (de-DE, de-AT, de-CH, de-LU, de-LI). The store page is `store/listing-de.md`. The system itself is described in `docs/localisation.md`.

The table has all **712** keys English has (174 interface strings and 538 of the game's own words: 209 names and story lines, the 15 chapters, the lessons). Nothing is left in English on purpose.

## Voice

- **du**, as calm games do. Imperatives are du-forms: *Tippe*, *Meißle*, *Zieh*, *Warte*.
- **No exclamation marks**, as in English. Short sentences; a colon where English uses one.
- **Story lines** keep the dry, warm turn of the English. The jokes that live on a sound or an idiom were rebuilt rather than translated (see the doubts below).
- **Gendered nouns:** a story's pronoun follows the German noun's gender (*die Katze … sie*, *der Fuchs … er*, *das Alpaka … es*), which sometimes differs from the English he/she.

## Glossary (one word per thing; docs/copy-study.md C1)

| English | German | Notes |
|---|---|---|
| stone (the block, a level) | **Stein** | Only ever the level. The Daily Stone is **Tagesstein**. |
| cube | **Würfel** | |
| object (what's found) | **Figur** | Also for the English "shape" in the lessons and the title line. The chapters' poetic "shape" lines use *Gestalt*. |
| chisel (tool / verb) | **Meißel** / **wegmeißeln** (*meißle … weg*) | The tool switch says MEISSEL in capitals (ß uppercases to SS). |
| mark (tool / verb) | **Marker** / **markieren** | "Marker" is the tool's name beside Meißel; the verb is the ordinary *markieren*. |
| slip, mistake | **Patzer** | One word for both: the HUD's "mistakes", the Rules' "slip", the lessons' "mistake". Same in singular and plural: *kein Patzer, 1 Patzer, 4 Patzer*. |
| gem (◆) | **Juwel** (das Juwel, die Juwelen) | Shorter than *Edelstein*, and never confused with *Stein*. |
| shrine | **Schrein** | |
| Finds | **Funde** | |
| lesson | **Lektion** | |
| circled number | **eingekreiste Zahl** | The lessons call the shape a *Kreis*. |
| squared number | **eingerahmte Zahl** | The lessons call the shape a *Quadrat*. |
| piece / group (touching cubes) | **Gruppe** | English says "pieces" in the lessons and "groups" on the Rules page; German keeps one word. |
| row / column | **Reihe** / **Spalte** | *Reihe* for every direction ("quer, nach unten oder nach hinten"), *Spalte* only where English says column. |
| world (chapter) | **Welt** | |
| Drift | **Treibgut** | "carved from the drift": *aus dem Treibgut gemeißelt*. |
| Today | **Heute** | |
| the diamond slider (◆ on a rail) | **Raute** | |
| tap / double-tap / hold / drag | **tippen** / **doppeltippen** / **gedrückt halten** / **ziehen** | Touch page labels: *Tippen, Halten, Doppeltipp auf …, Ziehen, Zwei Finger*. |
| Settings / Rules / Touch (tabs) | **Optionen** / **Regeln** / **Steuerung** | *Einstellungen* is the iOS word but fills the tab; *Optionen* fits. The help's screen-reader label keeps *Einstellungen*. |
| BEST (the result's score) | **REKORD** | |
| you uncovered | **freigelegt** | German puts the verb last, so the line over the name is the participle alone, like a stamp. |

The old lessons' "white stone", "picture" and "coloured part" became *schlichte Würfel*, *Figur* and *farbige Würfel*, as in Japanese and Chinese, so *Stein* only ever means the level.

## Budgets (test/i18n.test.js)

- **Story lines: at most 80 characters and 14 words.** The line sits under the name at 13 px in a box at most 320 px wide. Avenir Next in mixed case averages about 6.6 px a letter with the spaces, so a line holds about 48 letters, or about 39 with Larger text (×1.22). 80 is two lines without Larger text and three with it, which is what the longest English lines (75 characters) take. German runs about 30% longer than English, so a budget near the English maximum makes the drafter cut rather than wrap. The 14 words are English's own rule; German compounds make it easy, so the characters are the real limit.
- **Names:** at most 18 letters, the length of English's longest (Drystone Sheepfold, Songbird Automaton). The result shows the name on one line; two that ran over were shortened (*Großes Leuchtfeuer*, *Hase in der Tasse*).

## Layout

See "Layout, checked" below.

## Open doubts: the first things to fix if players report them

1. **Patzer.** It is friendly and short, and it fits the HUD and the result. But it is colloquial: some players may expect *Fehler*. If players read it as flippant, *Fehler* is the swap (it is one key per place: `hud.mistakes`, `slips`, `rules.slip`, `hud.rewind*`, `rewind.*`, the lessons' `keep` lines).
2. **Marker as the tool's name.** It reads as a felt pen, which is close to the idea, but *Markieren* (the verb as the tool's name) is what some German apps use. It was not used because it is long in the switch.
3. **Figur for the object.** *Figur* is the nonogram word (*Logikbild*: the picture is the figure), but *Motiv* or *Bild* may read more naturally in "Jeder Stein verbirgt eine Figur".
4. **Treibgut for Drift.** Flotsam is a good image for "carved at random", but it sounds like the beach. *Zufall* or *Freies Spiel* would be plainer.
5. **The story lines that hinged on English:**
   - Red grouse: the call "go back, go back" is a pun on its real call only in English; German keeps the words (*zurück, zurück*) without the pun.
   - Highland cow: *Pony* (a fringe) is right but may first read as the horse.
   - Teabag Pal (*Teebeutelchen*), Ice Lolly (*Eis am Stiel*), Kite (*Flugdrachen*, so it isn't the dragon) and Pine (*Kiefer*: the English name is a pine with a star on top, which a German reader may call a *Tanne*).
   - The Japanese words (Tsukubai, Mikoshi, Chochin, Koinobori, Kappa, Akabeko, Maneki-neko) are kept as the English keeps them; the stories explain them.
6. **The lessons** (`hint.*`, `coach.first`, `remind.*`, `rules.*`) run 20 to 35% longer than English. The cards were checked at both sizes, but the longest (`hint.lesson-mark.2.text`, 130 characters) is the one to trim first if a card feels heavy.
7. **Small labels in context:** `act.challenge` (*Fordern*, Game Center's challenge, seen only on iOS with Game Center), `map.open` (*offen*), `win.dayOf` with a real date (*der Stein vom 31. Oktober*), and `ads.remove`'s price (*1,99 $*, the German order; the real price comes from the store if purchases return).
8. **The store listing:** "Steinrätsel" in the name, and the keywords (*malen nach zahlen* is the most-searched German name for the genre but also means paint-by-numbers for children).

## Layout, checked

`tools/a11y-shots.mjs de --lang de` and `de-large --lang de --large` shot every screen at 390×844 and 375×667 (title, lesson card and pause, map, Settings, Rules, Touch, Finds and a find, the lessons list, chapter card, the level's tip, reminder and pause, the result, the shrine card). The shots are in `shots/a11y/de` and `shots/a11y/de-large` (not committed). A second probe set every German name and chapter name in the result's title, the find's own page and the chapter card, at both sizes, with Larger text off and on.

- **Fine as written:** the MEISSEL / MARKER switch, the result's rings (KARTE, WEITER, NOCHMAL), the pause's (KARTE, NEUSTART), Settings' rings (TÖNE, MUSIK, VIBRATION, GRÖSSERE SCHRIFT), the help tabs (OPTIONEN, REGELN, STEUERUNG), the lesson and reminder cards (four lines at most, with Larger text), the Rules and Touch pages, the shrine card, and every name on the result (one line; names over 9 letters take the smaller size, as in English).
- **Cut in the words:** *Einstellungen* → *Optionen* for the tab; *Das große Leuchtfeuer* → *Großes Leuchtfeuer* and *Häschen in der Tasse* → *Hase in der Tasse*, so no name is longer than English's longest (18); four story lines, to the 80-character budget.
- **Fixed in CSS** (`style.css`, the last block, `:lang(de)` only):
  - With Larger text, the Finds tiles let a long name wrap, but a single compound (TEEBEUTELCHEN) has no space to wrap at and was clipped (121 > 108 px). It now breaks with a hyphen (*TEEBEUTEL-CHEN*; `hyphens: auto`, with `overflow-wrap: anywhere` where a browser has no German dictionary). The tiles also track .12em instead of .2em, so more names fit before the ellipsis without Larger text, as English's long names already ellipsize there.
  - The find's own page set its name at 26 px tracked .3em in a 320 px box; 62 German names had a word wider than the box (SCHLÜSSELLOCHBOGEN needed 448 px; with Larger text, 546). The name is now tracked .12em and kept under 5.8vw (about 22 px), so every name fits on one line at both sizes, with Larger text too: there the name stays at that size and the story under it grows.
- After the fixes, the measure reports nothing off screen or clipped in either run, and the name probe reports every name fitting.

English is untouched: `index.html` and `en.js` did not change, and the new CSS matches only `html:lang(de)`, which English never sets.
