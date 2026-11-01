# Localisation: the string system, the drafts, and how a language goes live (2026-10-31)

Growth-roadmap test 6 (Japanese and Simplified Chinese first). Everything here is built on the `v1.1` branch. Players still see only English: the Japanese and Chinese tables are drafts, `reviewed: false`, until a native speaker has checked them.

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
- `chooseLang` never returns a language that isn't live, except through `?lang=` or `strata.dev.lang`. `LANGS_LIVE` is `['en']`.
- `index.html` says exactly what en.js says.
