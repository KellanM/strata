// The string tables (public/i18n/*.js, public/js/i18n.js; docs/localisation.md): every table
// has every English key and nothing else, the same placeholders, story lines within their
// budget; index.html holds exactly en.js's English; and a table not yet reviewed is never
// chosen for a player.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const EN = await import('../public/i18n/en.js');
const I18N = await import('../public/js/i18n.js');
const TABLES = {};
for (const code of I18N.LANGS.filter((c) => c !== 'en')) TABLES[code] = await import(`../public/i18n/${code}.js`);
const en = { ...EN.strings, ...EN.data() };

// Keys a table may leave out on purpose, falling back to English. None yet: "Strata" and the
// share line's "Strata · Daily #N" are never keys at all, so every key here is translated.
const ENGLISH_ON_PURPOSE = new Set([]);

// Korean particles (을/를, 이/가, 은/는, 과/와) depend on the word before them, which a
// placeholder or an icon can't know, so the Korean table never puts one straight after either
test('ko: no particle straight after a {placeholder} or an icon', () => {
  const ko = TABLES.ko?.strings ?? {};
  for (const [k, v] of Object.entries(ko)) {
    for (const f of typeof v === 'object' ? Object.values(v) : [v]) {
      assert.ok(!/\{\w+\}(을|를|이|가|은|는|과|와|으로|로)(?![가-힣])/.test(f), `ko ${k}: ${f}`);
    }
  }
});

// Story lines: English keeps to 14 words (test/puzzle.test.js). CJK has no words to count, so
// the budget is characters, from the screen: the line sits under the find's name at 13 px in a
// box at most 320 px wide (style.css #win-title .story, #journal-view .jv-story), which holds
// about 23 full-width characters at the tracking CJK gets, or about 19 with Larger text (x1.22).
// Two lines with Larger text is 38; the budget leaves a little for punctuation's full width.
// Chinese runs about a sixth denser than Japanese for the same thought (no kana endings), so its
// budget is tighter, which keeps the two languages' lines about as long as the English.
// Traditional Chinese takes the same 30: the same full-width characters in the same box (its
// glyphs carry more strokes, not more width), and Taiwan's wording runs no longer than the
// mainland's for the same thought (its longest line is 23).
//
// Russian runs about a quarter longer than English in letters, but has no articles, so it is
// counted in characters too. The longest English line is 75 characters, and two lines of it fit
// the 320 px box with Larger text. Cyrillic in the stack's faces (Avenir Next, Segoe UI, Roboto)
// is about a tenth wider a letter than Latin, so 72 characters is the two lines Larger text
// holds; checked in the browser with tools/a11y-shots.mjs --lang ru --large (docs/l10n/ru.md)
// languages whose counted strings need more than English's one and other (CLDR plural rules)
// Spanish is counted in characters too, not words: its words run longer than English's, but a
// line wraps by width, so characters are what fill the box. English's longest line is 75
// characters. At 13 px the box holds about 48 Latin characters a line (Avenir averages about
// half an em), and about 40 with Larger text, so 90 is two lines at the normal size and three
// with Larger text, where English's longest already takes two. 90 is also English's 75 plus the
// fifth that Spanish usually adds. (Finds sets the line at 15 px: three lines there.)
// Korean is counted with its spaces, since it breaks lines at them: a space is about a quarter of
// a syllable's width, so 36 characters with the usual seven or eight spaces is about 30 syllables
// wide. Wrapping only at spaces (word-break: keep-all) can leave up to one word, four or five
// syllables, unused at the end of the first line, which still fits two lines of 19 at Larger text.
// German is counted in characters too, and also in words, as English is. Its letters are Latin,
// in the same 13 px box: at about 6.6 px a letter (Avenir Next, mixed case, with the spaces),
// 320 px holds about 48 letters a line, or about 39 with Larger text. 80 is two lines without
// Larger text and three with it, as the longest English lines (75) take. German runs about 30%
// longer than English, so a budget near the English maximum makes the drafter cut, not wrap.
// And the 14 words English keeps to: German compounds make that easy, the characters are the
// real limit.
const STORY_BUDGET = { ja: 36, 'zh-Hans': 30, 'zh-Hant': 30, ru: 72, es: 90, ko: 36, fr: 72 };
const PLURAL_FORMS = { ru: ['one', 'few', 'many', 'other'] };
const LATIN_STORY_BUDGET = { de: { chars: 80, words: 14 } };
// French counts characters too, not words: its words run longer and its elisions (l’, d’, qu’)
// make a word count meaningless. Measured in Chromium on every line, in the real boxes: the
// result's line (13 px, 320 px box) with Larger text holds about 36 characters, so two lines is
// about 72, and the drafts that ran 69-78 took a third line there (6 of 209, against English's 1).
// With every line at 72 or under none does; the Finds view (15 px) stays on two lines without
// Larger text. English's longest is 75, so French at 72 also stays about as long as the English.

const vars = (s) => {
  const forms = s && typeof s === 'object' ? Object.values(s) : [s];
  return [...new Set(forms.flatMap((f) => [...String(f).matchAll(/\{(\w+)\}/g)].map((m) => m[1])))].sort();
};
const chars = (s) => [...s].length;

for (const [code, T] of Object.entries(TABLES)) {
  test(`${code}: every English key is translated (or on the list of keys left in English)`, () => {
    const missing = Object.keys(en).filter((k) => T.strings[k] == null && !ENGLISH_ON_PURPOSE.has(k));
    assert.deepEqual(missing, [], `${code} is missing ${missing.length} keys`);
  });

  test(`${code}: no key that English doesn't have`, () => {
    const extra = Object.keys(T.strings).filter((k) => !(k in en));
    assert.deepEqual(extra, []);
  });

  test(`${code}: the same placeholders as English, in every form`, () => {
    for (const [k, v] of Object.entries(T.strings)) {
      if (!(k in en)) continue;
      assert.deepEqual(vars(v), vars(en[k]), `${code} ${k}: ${JSON.stringify(v)}`);
      if (v && typeof v === 'object') {
        assert.ok(typeof v.other === 'string', `${code} ${k} needs an "other" form`);
        if (en[k].zero != null) assert.ok(v.zero != null, `${code} ${k} needs a "zero" form, as English has`);
      } else assert.equal(typeof v, typeof en[k], `${code} ${k}`);
    }
  });

  test(`${code}: markup keys keep their icons and close their tags`, () => {
    for (const k of Object.keys(en).filter((x) => x.endsWith('.html'))) {
      const v = T.strings[k];
      if (v == null) continue;
      const icons = (s) => [...s.matchAll(/\{g\d\}/g)].map((m) => m[0]).sort();
      assert.deepEqual(icons(v), icons(en[k]), `${code} ${k}`);
      assert.equal((v.match(/<b>/g) ?? []).length, (v.match(/<\/b>/g) ?? []).length, `${code} ${k}: <b> unbalanced`);
      assert.ok(!/<(?!\/?b>|br>)/.test(v), `${code} ${k}: only <b> and <br>`);
    }
  });

  if (STORY_BUDGET[code]) test(`${code}: story lines within ${STORY_BUDGET[code]} characters`, () => {
    const long = Object.entries(T.strings).filter(([k, v]) => k.startsWith('story.') && chars(v) > STORY_BUDGET[code]);
    assert.deepEqual(long.map(([k, v]) => `${k} (${chars(v)}): ${v}`), []);
  });

  if (PLURAL_FORMS[code]) test(`${code}: counted strings have every form the language needs`, () => {
    const rules = new Intl.PluralRules(code);
    assert.deepEqual([...rules.resolvedOptions().pluralCategories].sort(), [...PLURAL_FORMS[code]].sort());
    for (const [k, v] of Object.entries(T.strings)) {
      if (!v || typeof v !== 'object') continue;
      for (const f of PLURAL_FORMS[code]) assert.ok(typeof v[f] === 'string', `${code} ${k} needs a "${f}" form`);
      // the "one" form is also 21, 31...: it must print the number, never a literal 1
      assert.ok(/\{n\}/.test(v.one), `${code} ${k}: "one" must use {n}`);
    }
  });

  const latin = LATIN_STORY_BUDGET[code];
  if (latin) test(`${code}: story lines within ${latin.chars} characters and ${latin.words} words`, () => {
    const long = Object.entries(T.strings).filter(([k, v]) => k.startsWith('story.')
      && (chars(v) > latin.chars || v.split(/\s+/).length > latin.words));
    assert.deepEqual(long.map(([k, v]) => `${k} (${chars(v)}, ${v.split(/\s+/).length} words): ${v}`), []);
  });

  test(`${code}: has a story-line budget`, () => assert.ok(STORY_BUDGET[code] || LATIN_STORY_BUDGET[code]));

  test(`${code}: marked as not reviewed until it is live`, () => {
    assert.equal(typeof T.reviewed, 'boolean');
    if (!I18N.LANGS_LIVE.includes(code)) assert.equal(T.reviewed, false, `${code} isn't live, so its table is a draft`);
    else assert.equal(T.reviewed, true, `${code} is live, so its table is marked as approved`);
  });
}

test('English story lines keep to 14 words', () => {
  for (const [k, v] of Object.entries(en)) if (k.startsWith('story.')) assert.ok(v.split(/\s+/).length <= 14, `${k}: ${v}`);
});

test('the shrines and every object have a name and a story key', () => {
  const names = Object.keys(en).filter((k) => k.startsWith('name.')).length;
  const stories = Object.keys(en).filter((k) => k.startsWith('story.')).length;
  assert.ok(stories >= 194 + 15, `${stories} stories`);
  assert.ok(names >= stories, `${names} names`);
});

test('a language goes live only from LANGS_LIVE; ?lang= and strata.dev.lang reach any table', () => {
  const live = ['en'];
  assert.equal(I18N.chooseLang({ prefs: ['ja-JP'], live }), 'en');
  assert.equal(I18N.chooseLang({ saved: 'zh-Hans', prefs: ['zh-CN'], live }), 'en');
  assert.equal(I18N.chooseLang({ dev: 'ja', live }), 'ja');
  assert.equal(I18N.chooseLang({ dev: 'zh-CN', live }), 'zh-Hans');
  // once live: a saved choice first, else the first of the device's languages we have
  assert.equal(I18N.chooseLang({ prefs: ['fr-FR', 'ja-JP'], live: ['en', 'ja'] }), 'ja');
  assert.equal(I18N.chooseLang({ prefs: ['en-GB', 'ja-JP'], live: ['en', 'ja'] }), 'en');
  assert.equal(I18N.chooseLang({ saved: 'ja', prefs: ['en-US'], live: ['en', 'ja'] }), 'ja');
  // Traditional Chinese is its own table: Taiwan, Hong Kong, Macau and -Hant, never the simplified
  assert.equal(I18N.chooseLang({ prefs: ['zh-TW'] }), 'zh-Hant');
  assert.equal(I18N.chooseLang({ prefs: ['zh-Hant-HK'] }), 'zh-Hant');
  assert.equal(I18N.chooseLang({ prefs: ['zh-MO'] }), 'zh-Hant');
  assert.equal(I18N.chooseLang({ prefs: ['zh-Hans-CN'] }), 'zh-Hans');
  assert.equal(I18N.chooseLang({ dev: 'zh-Hant', live }), 'zh-Hant');
  // where it isn't live, it falls through to the next preference
  assert.equal(I18N.chooseLang({ prefs: ['zh-TW', 'zh-Hans-CN'], live: ['en', 'zh-Hans'] }), 'zh-Hans');
  assert.equal(I18N.chooseLang({ prefs: ['zh-Hant-HK'], live: ['en', 'zh-Hans'] }), 'en');
  // live today: English, Japanese, Simplified and Traditional Chinese (Kellan, 2026-10-31)
  // Russian, from any Russian tag
  assert.equal(I18N.chooseLang({ prefs: ['ru-RU'], live: ['en', 'ru'] }), 'ru');
  assert.equal(I18N.chooseLang({ prefs: ['ru'], live: ['en'] }), 'en');
  assert.equal(I18N.chooseLang({ dev: 'ru', live: ['en'] }), 'ru');
  // live today: English, Japanese, Simplified Chinese and Russian (Kellan, 2026-10-31)
  // Spanish is one table for Spain and the Americas
  for (const tag of ['es', 'es-ES', 'es-MX', 'es-419', 'es_US']) assert.equal(I18N.chooseLang({ prefs: [tag], live: ['en', 'es'] }), 'es', tag);
  assert.equal(I18N.chooseLang({ prefs: ['es-MX'], live: ['en'] }), 'en');
  // live today: English, Japanese, Simplified Chinese and Spanish (Kellan, 2026-10-31)
  // Korean: every ko tag, once live
  assert.equal(I18N.chooseLang({ prefs: ['ko-KR', 'en-US'], live: ['en', 'ko'] }), 'ko');
  assert.equal(I18N.chooseLang({ prefs: ['ko-KR'], live: ['en'] }), 'en');
  assert.equal(I18N.chooseLang({ dev: 'ko', live: ['en'] }), 'ko');
  // German: every de tag (Germany, Austria, Switzerland), once live
  assert.equal(I18N.chooseLang({ prefs: ['de-AT'], live: ['en', 'de'] }), 'de');
  assert.equal(I18N.chooseLang({ prefs: ['de-CH', 'en-GB'], live: ['en'] }), 'en');
  assert.equal(I18N.chooseLang({ dev: 'de', live: ['en'] }), 'de');
  assert.deepEqual(I18N.LANGS_LIVE, ['en', 'ja', 'zh-Hans', 'zh-Hant', 'ko', 'de', 'fr', 'es', 'ru']);
  // French for every French tag: France, Canada, Belgium, Switzerland
  assert.equal(I18N.chooseLang({ prefs: ['fr-CA', 'en-US'], live: ['en', 'fr'] }), 'fr');
  assert.equal(I18N.chooseLang({ prefs: ['fr_BE'], live: ['en', 'fr'] }), 'fr');
});

// French counts 0 as singular ("0 monde"), so a count English writes as "no slips" keeps its
// zero form, and the singular form must make sense for both 0 and 1
test('fr: plurals pick by French rules, with 0 singular', () => {
  const fr = TABLES.fr.strings;
  const pr = new Intl.PluralRules('fr');
  assert.equal(pr.select(0), 'one');
  assert.equal(pr.select(2), 'other');
  for (const [k, v] of Object.entries(fr)) {
    if (!v || typeof v !== 'object') continue;
    assert.ok(typeof v.one === 'string', `fr ${k} needs a "one" form (0 and 1)`);
    assert.match(v.one, /\{n\}/, `fr ${k}: "one" is said for 0 too, so it shows the number`);
  }
  assert.equal(fr.slips.zero, 'aucun faux pas');
});

// French typography: a no-break space before : (U+00A0) and a narrow one before ; ! ? (U+202F),
// never a plain space or none; « » for quotes; the typographic apostrophe
test('fr: French punctuation spacing, quotes and apostrophes', () => {
  for (const [k, v] of Object.entries(TABLES.fr.strings)) {
    for (const s of typeof v === 'object' ? Object.values(v) : [v]) {
      const text = s.replace(/<[^>]+>/g, '');
      assert.doesNotMatch(text, /(^|[^  ])[:;!?](\s|$)/, `fr ${k}: space before punctuation: ${JSON.stringify(s)}`);
      assert.doesNotMatch(text, /["“”']/, `fr ${k}: quotes and apostrophes: ${JSON.stringify(s)}`);
    }
  }
});

test('t() gives back English exactly, fills its blanks and counts', () => {
  assert.equal(I18N.lang, 'en');
  assert.equal(I18N.t('slips', { n: 0 }), 'no slips');
  assert.equal(I18N.t('slips', { n: 1 }), '1 slip');
  assert.equal(I18N.t('slips', { n: 4 }), '4 slips');
  assert.equal(I18N.t('finds.worlds', { n: 1 }), '1 world');
  assert.equal(I18N.t('finds.worlds', { n: 3 }), '3 worlds');
  assert.equal(I18N.t('map.progress', { done: 12, total: 194 }), '12 of 194 uncovered');
  assert.equal(I18N.t('no.such.key'), 'no.such.key');
});

// Counting by the language's own rules: English one / other is unchanged, and Russian picks
// one (1, 21, 101), few (2-4, 22-24) and many (0, 5-20, 11-14, 25), with zero first where a
// table has it ("без промахов")
test('pluralForm counts in English and in Russian', () => {
  const en = new Intl.PluralRules('en'), ru = new Intl.PluralRules('ru');
  const pick = (forms, n, rules) => I18N.pluralForm(forms, n, rules).replace('{n}', n);
  assert.equal(pick(EN.strings.slips, 0, en), 'no slips');
  assert.equal(pick(EN.strings.slips, 1, en), '1 slip');
  assert.equal(pick(EN.strings.slips, 2, en), '2 slips');
  assert.equal(pick(EN.strings.slips, 21, en), '21 slips');
  const RU = TABLES.ru.strings;
  const cases = { 0: 'без промахов', 1: '1 промах', 2: '2 промаха', 4: '4 промаха', 5: '5 промахов', 11: '11 промахов',
    14: '14 промахов', 21: '21 промах', 22: '22 промаха', 25: '25 промахов', 101: '101 промах', 112: '112 промахов' };
  for (const [n, want] of Object.entries(cases)) assert.equal(pick(RU.slips, Number(n), ru), want, `slips ${n}`);
  // no zero form: 0 is "many" in Russian
  assert.equal(pick(RU['finds.stones'], 0, ru), '0 камней');
  assert.equal(pick(RU['finds.stones'], 3, ru), '3 камня');
  assert.equal(pick(RU['finds.worlds'], 1, ru), '1 мир');
  assert.equal(pick(RU['days.run'], 2, ru), '2 дня подряд');
  assert.equal(pick(RU['days.run'], 7, ru), '7 дней подряд');
  assert.equal(pick(RU['days.run'], 31, ru), '31 день подряд');
  // a table that counts what English doesn't still falls back to other
  assert.equal(I18N.pluralForm({ other: 'x' }, 3, ru), 'x');
});

// index.html holds the English: each data-i18n element's words must be en.js's, so English
// can be left as it is on the page and every other language replaces exactly those words
test('index.html says exactly what en.js says', () => {
  const html = readFileSync(new URL('../public/index.html', import.meta.url), 'utf8');
  const norm = (s) => s.replace(/\s+/g, ' ').trim();
  let n = 0;
  for (const m of html.matchAll(/<(\w+)\b[^>]*?\sdata-i18n="([^"]+)"[^>]*>([^<]*)<\/\1>/g)) {
    assert.ok(m[2] in en, `no key ${m[2]}`);
    assert.equal(norm(m[3]), norm(en[m[2]]), m[2]);
    n++;
  }
  for (const m of html.matchAll(/aria-label="([^"]*)"[^>]*?\sdata-i18n-aria="([^"]+)"/g)) { assert.equal(m[1], en[m[2]], m[2]); n++; }
  for (const m of html.matchAll(/data-mouse="([^"]*)"[^>]*?\sdata-i18n-mouse="([^"]+)"/g)) { assert.equal(m[1], en[m[2]], m[2]); n++; }
  for (const m of html.matchAll(/<p\b[^>]*?\sdata-i18n-html="([^"]+)"[^>]*>([\s\S]*?)<\/p>/g)) {
    let g = 0;
    const inner = m[2].replace(/<span class="glyph[^"]*"[^>]*>[\s\S]*?<\/span>|<svg[\s\S]*?<\/svg>/g, () => `{g${++g}}`);
    assert.equal(norm(inner), norm(en[m[1]]), m[1]);
    n++;
  }
  // every attribute was matched by one of the above
  const attrs = (html.match(/\sdata-i18n(-html|-aria|-mouse)?="/g) ?? []).length;
  assert.equal(n, attrs, 'a data-i18n attribute the test did not read');
  assert.ok(n > 80, `${n} of the page's words checked`);
});
