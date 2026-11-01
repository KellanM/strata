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

// Story lines: English keeps to 14 words (test/puzzle.test.js). CJK has no words to count, so
// the budget is characters, from the screen: the line sits under the find's name at 13 px in a
// box at most 320 px wide (style.css #win-title .story, #journal-view .jv-story), which holds
// about 23 full-width characters at the tracking CJK gets, or about 19 with Larger text (x1.22).
// Two lines with Larger text is 38; the budget leaves a little for punctuation's full width.
// Chinese runs about a sixth denser than Japanese for the same thought (no kana endings), so its
// budget is tighter, which keeps the two languages' lines about as long as the English.
const STORY_BUDGET = { ja: 36, 'zh-Hans': 30 };
// German is counted in characters too, and also in words, as English is. Its letters are Latin,
// in the same 13 px box: at about 6.6 px a letter (Avenir Next, mixed case, with the spaces),
// 320 px holds about 48 letters a line, or about 39 with Larger text. 80 is two lines without
// Larger text and three with it, as the longest English lines (75) take. German runs about 30%
// longer than English, so a budget near the English maximum makes the drafter cut, not wrap.
// And the 14 words English keeps to: German compounds make that easy, the characters are the
// real limit.
const LATIN_STORY_BUDGET = { de: { chars: 80, words: 14 } };

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
  // Traditional Chinese has no table: it falls through to the next preference
  assert.equal(I18N.chooseLang({ prefs: ['zh-TW', 'zh-Hans-CN'], live: ['en', 'zh-Hans'] }), 'zh-Hans');
  assert.equal(I18N.chooseLang({ prefs: ['zh-Hant-HK'], live: ['en', 'zh-Hans'] }), 'en');
  // German: every de tag (Germany, Austria, Switzerland), once live
  assert.equal(I18N.chooseLang({ prefs: ['de-AT'], live: ['en', 'de'] }), 'de');
  assert.equal(I18N.chooseLang({ prefs: ['de-CH', 'en-GB'], live: ['en'] }), 'en');
  assert.equal(I18N.chooseLang({ dev: 'de', live: ['en'] }), 'de');
  // live today: English, Japanese, Simplified Chinese (Kellan, 2026-10-31) and German
  assert.deepEqual(I18N.LANGS_LIVE, ['en', 'ja', 'zh-Hans', 'de']);
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
