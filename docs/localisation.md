# Localisation: the string system, the drafts, and how a language goes live (2026-10-31)

Growth-roadmap test 6 (Japanese and Simplified Chinese first). **Live (Kellan, 2026-10-31): ten languages.** English, Japanese, Simplified and Traditional Chinese, Korean, German, French, Spanish (one table for Spain and the Americas), Brazilian Portuguese (for every Portuguese tag) and Russian are on for players whose device or browser prefers them. Kellan decided against a native speaker's review ("We don't need a human reviewer"); the doubts below are what to fix first if players report them. The iOS app declares the languages in `CFBundleLocalizations` (`tools/ios-configure.mjs`).

## The system

- **`public/js/i18n.js`** is the one module. It chooses the language, loads that language's table, and gives the words:
  - `t(key, vars)` for the interface's words. `{name}` is filled in. A value that is an object picks by number (`{ zero, one, other }`, through `Intl.PluralRules`), so English says "no slips", "1 slip", "4 slips" and Japanese and Chinese need only `zero` and `other`.
  - `objName(shape)`, `storyOf(shape)`, `chapterName(name)`, `chapterLine(ch)` and `hintStr(hint, field)` for the game's own words. These are keyed by object id (`name.fox`, `story.fox`), chapter (`chapter.first-light.line`) and lesson (`hint.v2-cat.0.mistake`). English comes straight from the data in `shapes.js`, so nothing is written twice.
  - `applyStatic()` sets the page's own words at boot, from `data-i18n` (text), `data-i18n-html` (a `.html` key: `<b>`, `<br>`, and `{g1}`… for the element's own icons, kept), `data-i18n-aria` and `data-i18n-mouse`. It also sets `<html lang>`, the document title, and Settings' on/off (drawn by CSS).
  - `locale` and `cjk` are for dates (`toLocaleDateString`) and for the result's score label, drawn on a canvas.
- **`public/i18n/en.js`** holds English: the interface's strings by key, and `data()`, which lists the game's words from `shapes.js` under the same keys the other tables use. English is the source and the fallback for any key a table is missing.
- **`public/i18n/ja.js`, `public/i18n/zh-Hans.js`** each hold `reviewed` and `strings`. A table loads only when its language is chosen; English loads no table at all.
- **English is never rewritten.** `index.html` already holds the English and `applyStatic` does nothing in English. `t()` gives back en.js's strings exactly, and `test/i18n.test.js` checks that every `data-i18n` element in `index.html` says what en.js says.
- **Which language:**
  1. `?lang=ja` (remembered as `strata.dev.lang`; `?lang=` forgets it) or `strata.dev.lang`, for testing. This reaches any table, live or not. On the web the developer panel also has a Language row that cycles through them.
  2. Otherwise a saved choice (`strata.lang`), then the device's languages in order (`navigator.languages`), taking the first match that is **live**.
  3. Otherwise English.

  Chinese means the simplified table for zh, zh-CN, zh-SG and zh-Hans. Traditional (zh-TW, zh-HK, zh-Hant) has no table yet, so it falls through to the next preference. There is no language picker in Settings: the device's language decides, as on iOS. `strata.lang` is there for a picker if one is wanted later.
- **The share line** keeps its first line, `Strata · Daily #N`, in every language. The slips, the days in a row and the invitation line are translated.
- **Type** (`style.css`, last block, scoped by `:lang(ja)` and `:lang(zh)` so English is untouched):
  - The font stack adds the system's CJK faces after the Latin ones: Hiragino Sans and PingFang SC on iOS and macOS, Noto Sans CJK on Android, Yu Gothic and Microsoft YaHei on Windows. Numbers and Latin words keep the Avenir look.
  - The wide letter-spacing becomes .04em, and the lead-in padding that balanced it is dropped. The ✕ marks and the gems keep their spacing.
  - Small labels get an 11 px floor (13 px with Larger text), because kanji and hanzi lose their strokes below that.
  - `text-transform: uppercase` is left in place: it changes only the Latin inside a CJK label ("No. 12", "STRATA").

## How a language goes live

1. A native speaker reviews the table (see "What the reviewer should check first" below), and the store listing in `store/listing-<lang>.md`.
2. Set `export const reviewed = true;` in the table.
3. Add the code to `LANGS_LIVE` in `public/js/i18n.js`, for example `['en', 'ja']`. The test fails if a live table isn't marked reviewed, or a reviewed one isn't live.
4. **The iOS app:** check `navigator.languages` on a device set to that language. A WKWebView may report only the app's own localisations; the app has only English today. If it reports English, add `CFBundleLocalizations` (`ja`, `zh-Hans`) to Info.plist through `tools/ios-configure.mjs`. That also makes the App Store list the language, so do it only at go-live.
5. Paste the listing into App Store Connect for that locale (Kellan).

## Tests (`test/i18n.test.js`)

- Every English key is in `ja` and `zh-Hans`, or is on the `ENGLISH_ON_PURPOSE` list (empty today).
- No table has a key English doesn't.
- Placeholders match English in every form. Plurals have `other`, and `zero` where English has one. `.html` keys keep their icons and close their tags.
- English story lines keep to 14 words. Japanese story lines keep to 36 characters and Chinese to 30. That is two lines with Larger text in the 320 px box the line sits in: about 23 full-width characters a line at 13 px, about 19 at 1.22×. Chinese is set tighter because it runs about a sixth denser than Japanese for the same thought.
- `chooseLang` never returns a language that isn't live, except through `?lang=` or `strata.dev.lang`. `LANGS_LIVE` is all ten.
- `index.html` says exactly what en.js says.

## Glossary (one term per thing; docs/copy-study.md C1)

| English | Japanese (ja) | Chinese (zh-Hans) |
|---|---|---|
| stone (the block, a level) | 石 | 石块 (石 in compounds: 今日之石) |
| cube | キューブ | 方块 |
| object (what's found) | かたち | no noun: 它 / 藏着的东西 |
| chisel (tool / verb; the gesture is tap) | ノミ / 削る | 凿子 / 凿掉 |
| mark (tool / verb; the gesture is hold) | 印 / 印をつける | 标记 |
| slip | ミス | 失误 |
| gem | 宝石 | 宝石 |
| shrine | 祠 | 神龛 |
| Finds | 図鑑 | 图鉴 |
| lesson | レッスン | 课 / 课程 |
| circled number (two pieces) | 丸囲みの数字 | 圆圈数字 |
| squared number (three or more pieces) | 四角囲みの数字 | 方框数字 |
| piece (touching cubes in a row) | かたまり | 段 |
| row / column | 列 / 縦の列 | 行 / 列 |
| world | 世界 | 世界 |
| Drift | 漂流 | 漂流 |
| Today, the Daily Stone | 今日 / 今日の石 | 今日 / 今日之石 |
| tap, double-tap, hold | タップ, ダブルタップ, 長押し | 轻点, 轻点两下, 按住 |

The old lessons' "white stone", "picture" and "coloured part" became cube, object and coloured cubes in both languages, as copy-study C1 proposes for English. So 石 / 石块 only ever means the level.

## Open doubts: the first things to fix if players report them

1. **The glossary.** It is fixed in every line, so a wrong word is wrong 200 times. In Japanese, 列 for every direction reads oddly to players used to 行 (across) and 列 (down), and 漂流 for Drift sounds like a shipwreck. In Chinese, the object has no noun, and 这个石块 or 石头 may read more naturally than 石块.
2. **The voice of the story lines** (209 per language, `story.*`). They should be short, dry, warm and specific, and never cute. Read a chapter's worth in a row. The drafters doubted the jokes most: Japanese bonsai, highland-cow and scorpion; Chinese alpaca, avocado and red-grouse (the bird's "go back" call is a pun only in English).
3. **The lessons** (`hint.*`, then `coach.first`, `remind.*`, `rules.*`). These are what a first-time player must understand at once. Look hardest at the Rules page's plain-number line (`rules.plain`, restructured in both), the "full row" gesture (`touch.full`), and Japanese `hint.lesson-keep.1.text`, which is dense.
4. **Names that may not be known:** Japanese shortened deep-sea names (オオグソクムシ, イエティクラブ, アンコウ) and 夢とりの輪; Chinese 蹲踞, 小芥子, 赤牛, 月影盆.
5. **Small labels in context:** `map.open` (a shrine that's open but not yet solved), `act.challenge` (Game Center's challenge), `hud.number`, and `win.dayOf` with a real date.
6. **The store listings** (`store/listing-ja.md`, `listing-zh-Hans.md`), especially the keywords. Both say 宝石 where the English listing says "stars", to match the game.

Over-budget, on purpose: a few Touch-page gesture labels (ダブルタップ / 轻点两下 alone fill the 5- and 4-character budgets). That column wraps in English too.

## Layout, checked

`tools/a11y-shots.mjs --lang ja|zh-Hans [--large]` shot every screen at 390×844 and 375×667, with Larger text off and on: title, lesson card and pause, map, Settings, Rules, Touch, Finds and a find, the lessons list, the chapter card, the level's tip, reminder and pause, the result, and the shrine card (the slip offer could not be shot: a slip made through the test hook does not land). Its measure reports any text off screen or clipped by its box, and none was in either language. The shots are in `shots/a11y/ja`, `zh`, `ja-large` and `zh-large`; `shots/` isn't committed.

## English unchanged, checked

`tools/a11y-shots.mjs` was run on a copy of the build from before this work, and again after it. `--compare` checks every element with text (font size, letter-spacing, box and text) and every word and label on the page, shown or not, on every screen. The clock's digits are masked. `tools/pixel-diff.py` compares the pictures. The results are in the commit message that added this paragraph.

## The other languages (2026-10-31)

Each has its own notes, with its glossary, story-line budget, layout fixes and the doubts to fix first: `docs/l10n/zh-Hant.md`, `ko.md`, `de.md`, `fr.md`, `es.md`, `pt-BR.md` and `ru.md`. Their store pages are `store/listing-<code>.md`. Their layout rules are blocks at the end of `public/style.css`, each scoped to its `:lang()`, so English is never touched.

**Counts:** the "712 strings" quoted in `docs/l10n/*.md` date from 2026-10-31. Since then, the 14 curated daily stones (`public/js/dailies.js`) and the six page 17 levels have added their names and stories to every table, along with the Finds "Daily Stones" heading. `test/i18n.test.js` keeps every table complete, whatever the count.
