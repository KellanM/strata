# Russian (ru): the glossary, the counting, and the doubts (2026-10-31)

**Live (Kellan, 2026-10-31), without a native speaker's review.** The table is `public/i18n/ru.js` (712 strings: 174 interface, 538 of the game's own words, with 209 story lines). The store page is `store/listing-ru.md`. The system itself is in `docs/localisation.md`.

## Voice

- **"ты"** throughout, as the game talks to one player. The store page says "ты" too.
- **No gendered past tense for the player.** Russian past tense marks gender (нашёл / нашла), and the game doesn't know the player's. So "you uncovered" is *твоя находка*, "Stuck?" is *Не знаешь, как дальше?*, "on your own" is *самостоятельно*, and the slip is described by the cube (*этот кубик был нужен*), not by what the player did.
- **Imperatives for gestures**, short: *Нажми*, *Удерживай*, *Потяни*, *Сведи пальцы*. The Touch page's left column is verbs, not nouns (*Нажатие*, *Удержание* were longer and stiffer).
- **The story lines** keep the English's shape: one or two short sentences, the joke in the second. Where an English pun can't cross (red grouse's "go back"), the line keeps the bird's call as a call: *«Назад, назад!» Никто не слушает.*

## Glossary (one term per thing; docs/copy-study.md C1)

| English | Russian | Notes |
|---|---|---|
| stone (the block, a level) | камень | 1 камень, 2 камня, 5 камней. Only ever the level |
| cube | кубик | the diminutive: the friendly size, and *куб* reads as geometry |
| object (what's found) | фигура | also "shape" (*найди фигуру*) |
| chisel (tool) | Резец | the tool's name, capitalised in lessons as the English does |
| chisel (verb; the gesture is tap) | отколоть / откалывать | *отколи*, *отколоть кубик* |
| mark (tool) | Метка | |
| mark (verb; the gesture is hold) | поставить метку / отметить | *отмеченный кубик* |
| slip | промах | 1 промах, 2 промаха, 5 промахов; *без промахов*. The HUD's "mistakes" label is *промахи*, the same word |
| gem | самоцвет | 1 самоцвет, 2 самоцвета, 5 самоцветов. Not *камень* or *камушек*: those are the level |
| ◆ (the peel handle) | ромбик | the same glyph as the gem, but a handle: named by its shape, as English "diamond" |
| shrine | святилище | |
| Finds | Находки | *найдено 12 из 194* |
| lesson | урок | the map's Learn stone is *Обучение* |
| circled number (two groups) | число в кружке | *2 в кружке* |
| squared number (three groups or more) | число в квадратике | not *в квадрате*, which is "squared" in arithmetic |
| piece / group (touching cubes in a row) | группа | English uses both "piece" and "group"; Russian keeps one |
| gap | промежуток | |
| row / column | ряд / столбец | *поперёк, вниз или вглубь* for across, down, back |
| face | грань | |
| world | мир | the store's "chapters" and "lands" are миры too |
| Drift | Дрейф | |
| Today, the Daily Stone | Сегодня / Камень дня | *Камень дня №12* |
| tap, double-tap, hold | нажми, дважды нажми, удерживай | mouse: клик, двойной клик, правый клик |
| record (the result's BEST) | РЕКОРД | drawn on the canvas, already in capitals |

## Counting

Russian picks a noun's form by the number: one (1, 21, 101), few (2–4, 22–24), many (0, 5–20, 11–14, 25…), and other for fractions. `i18n.js` already chose a form through `Intl.PluralRules(lang)`; that path is now `pluralForm(forms, n, rules)`, exported so the test can run it with Russian rules. English is unchanged (its `zero` / `one` / `other` give "no slips", "1 slip", "4 slips" as before).

- Every counted Russian string has `one`, `few`, `many` and `other` (other = few's form, which is right for "1,5"). The test checks that, and that `one` prints `{n}`, never a literal 1, since it is also 21 and 101.
- `slips` keeps a `zero`: *без промахов*.
- Strings English doesn't count but Russian must are objects in `ru.js` only: `days.run` (1 день, 2 дня, 5 дней подряд), `map.toUncover`, `map.lessons`, `map.lessonsFirst`, `map.learnAria`, `map.learnAriaDone`, `map.opensAtAria` (prepositional: *при 1 самоцвете, при 5 самоцветах*), `shrine.opensAt`, `finds.stones`. The rest dodge the noun's case: *найдено 12 из 194*, *собрано пока: 7*, *1 из 3 самоцветов*.
- `test/i18n.test.js` "pluralForm counts in English and in Russian" checks 0, 1, 2, 4, 5, 11, 14, 21, 22, 25, 101 and 112.

## Story lines: 72 characters

English keeps to 14 words, whose longest line is 75 characters. Russian has no articles but longer words, so the rule is characters, as for Japanese and Chinese: 72, which is two lines in the 320 px box with Larger text (Cyrillic in Avenir Next and Segoe UI runs about a tenth wider a letter than Latin). The longest Russian line is 68 (coelacanth).

## Type and layout, checked

**Faces.** The stack needs nothing new: Avenir Next has Cyrillic on iOS and macOS, Century Gothic and Segoe UI on Windows, Roboto (through `system-ui`) on Android. In headless Chromium on Windows the chapter card's Cyrillic is drawn in Century Gothic (CDP `CSS.getPlatformFontsForNode`), so no letter falls back to a second face mid-word.

**Every screen.** `tools/a11y-shots.mjs --lang ru`, with and without `--large`, at 390×844 and 375×667: title, lesson card and pause, map, Settings, Rules, Touch, Finds and a find, the lessons list, the chapter card, the level's tip, reminder and pause, the result, the shrine card. Shots: `shots/a11y/ru`, `ru-large` (before the fixes) and `ru-2`, `ru-large-2` (after); `shots/` isn't committed. The tool switch (РЕЗЕЦ / МЕТКА), the ring labels (МЕНЮ, СЕГОДНЯ, НАХОДКИ), Settings' toggles (КРУПНЫЙ ТЕКСТ), the result's rings (КАРТА, ДАЛЬШЕ, ЕЩЁ РАЗ), the lesson cards and the uppercase headings all fit as they were.

**Every name.** The shots show one level, so every object and world name was also set in each place that shows it in big tracked capitals (`shots/ru-real.mjs`, `shots/ru-fit.mjs`, not committed): the result, the HUD, the pause menu, a find's page, the chapter, shrine and world-closing cards, the map's world names and the Finds chapters, at 375 and 390 px, Larger text off and on.

What spilled, and the fix (all in the `ru` block at the end of `style.css`; English untouched):

| Where | What | Fix |
|---|---|---|
| Map, a stone's name beside it, Larger text | ЧАЙНЫЙ ПАКЕТИК ran 13 px off the right edge | the name may take two lines (max 10.5em) |
| Finds tile | ЧАЙНЫЙ ПАКЕТ… cut off | the name wraps, tracking .14em (Larger text already wrapped) |
| Chapter, shrine and world-closing cards | ЧАСОВАЯ МАСТЕРСКАЯ (422 px), ПРАЗДНИК ФОНАРЕЙ, ОБЛАЧНЫЕ ОСТРОВА past 375 px | tracking .3 → .2em, and two lines allowed |
| A find's page, Larger text | ПРОИГРЫВАТЕЛЬ, ОБСЕРВАТОРИЯ, ВЕРБЛЮЖОНОК wider than the screen | 26 → 22 px (× Larger text), tracking .2em |

Names were shortened first where a shorter Russian name was as good: Компас, Скамейка, Глициния, Островок, Каштаны, Карусель, Медвежонок, Водопады, Планета, Тучка (the result screen's single line holds about 17 Cyrillic capitals at 375 px).

**Found in English, left alone:** CLOCKWORK WORKSHOP is wider than a 375 px screen on the chapter card (437 px), the shrine card and the world-closing card, and CARAVANSERAI and DREAMCATCHER on a find's page with Larger text. Not changed here: English is out of scope for this work.

## Open doubts: the first things to fix if players report them

1. **кубик and фигура.** *Кубик* may read as a toy; *куб* is the alternative, but stiffer. *Фигура* is clear, but the chess sense is close. Both are in every lesson, so a change touches about 60 strings.
2. **Резец for the chisel.** Accurate, and a little technical. *Долото* is a woodworker's chisel; *зубило* a metalworker's. If lesson 1 confuses players, look here first.
3. **число в квадратике.** Chosen to dodge "squared"; *в рамке* is the other option, but then the circle needs *в круглой рамке*.
4. **Names that may not be known:** Латимерия (coelacanth; also целакант), Изопода (giant isopod), Тупик (puffin: correct, but it also means "dead end"), Кокэси, Акабэко, Микоси, Цукубай, Коинобори, Маленький они, Корова-хайленд. Шотландская корова is the more common name but did not fit the result screen.
5. **The jokes in the story lines**: alpaca (*Мнения о маршруте она не несёт*), avocado, highland cow, scorpion, red grouse (the English pun on its call is lost). Read a chapter in a row; the voice should be dry and warm, never cute.
6. **Камень дня** for the Daily Stone and **Дрейф** for Drift. Дрейф is right for "drift" and a little nautical.
7. **The store keywords.** 100 bytes is only about 50 Cyrillic letters. антистресс is a guess at what Russian players search for "relaxing"; the store's own search suggestions should decide.
