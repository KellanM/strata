// Strata in other languages (docs/growth-roadmap.md test 6). English is the source and the
// fallback for any missing key (public/i18n/en.js); a language's table holds what it has
// translated (public/i18n/ja.js, zh-Hans.js).
//
// Which language: a saved choice (strata.lang), else the device's (navigator.languages, first
// match wins), else English - but only from LANGS_LIVE. A table goes live once a native speaker
// has reviewed it: set its `reviewed` to true and add its code here. Until then it is seen only
// by asking: ?lang=ja (remembered as strata.dev.lang; ?lang= forgets it) or strata.dev.lang.
//
// English is never rewritten on the page: index.html holds it already, and t() gives back
// en.js's strings exactly. In another language the page's words are set once, at boot, from
// their data-i18n attributes (applyStatic), and <html lang> is set for the type (style.css).
import * as EN from '../i18n/en.js';
import { TUTORIAL, TUTORIAL_V2 } from './shapes.js';

// Japanese and Simplified Chinese live on Kellan's word (2026-10-31: "We don't need a human
// reviewer"), without a native speaker's pass; docs/localisation.md keeps the open doubts.
// Traditional Chinese the same day ("Your translations are world class"; docs/l10n/zh-Hant.md)
// Japanese, Simplified Chinese and Russian live on Kellan's word (2026-10-31: "We don't need a
// human reviewer"), without a native speaker's pass; docs/localisation.md and docs/l10n/ keep the
// open doubts
export const LANGS_LIVE = ['en', 'ja', 'zh-Hans', 'zh-Hant', 'ru'];
export const LANGS = ['en', 'ja', 'zh-Hans', 'zh-Hant', 'ru'];   // every table there is, reviewed or not

// a language tag (navigator's, a saved one, ?lang=) to one of ours, or null. Chinese is the
// traditional table for Taiwan, Hong Kong, Macau and any -Hant tag, the simplified one for the
// rest (the mainland, Singapore, Malaysia). Portuguese is Brazil's for every Portuguese tag, and
// Spanish one table for Spain and the Americas
export function match(tag) {
  const t = String(tag ?? '').trim().toLowerCase().replace(/_/g, '-');
  if (!t) return null;
  if (t === 'en' || t.startsWith('en-')) return 'en';
  if (t === 'ja' || t.startsWith('ja-')) return 'ja';
  if (t === 'zh' || t.startsWith('zh-')) return /hant|-tw|-hk|-mo/.test(t) ? 'zh-Hant' : 'zh-Hans';
  for (const code of ['ko', 'de', 'fr', 'es', 'ru']) if (t === code || t.startsWith(code + '-')) return code;
  if (t === 'pt' || t.startsWith('pt-')) return 'pt-BR';
  return null;
}

// dev: strata.dev.lang or ?lang= (any table, for testing); saved: strata.lang; prefs: the device's
export function chooseLang({ dev = null, saved = null, prefs = [], live = LANGS_LIVE } = {}) {
  const asked = match(dev);
  if (asked) return asked;
  for (const tag of [saved, ...prefs]) {
    const m = match(tag);
    if (m && live.includes(m)) return m;
  }
  return 'en';
}

const store = (() => { try { return globalThis.localStorage ?? null; } catch { return null; } })();
function devLang() {
  const q = globalThis.location ? new URLSearchParams(location.search).get('lang') : null;
  if (q != null && store) { if (q) store.setItem('strata.dev.lang', q); else store.removeItem('strata.dev.lang'); }
  return q || store?.getItem('strata.dev.lang');
}
const nav = globalThis.navigator;
export const lang = chooseLang({
  dev: devLang(),
  saved: store?.getItem('strata.lang'),
  prefs: nav ? [...(nav.languages ?? []), nav.language] : [],
});
// (a table that fails to load leaves every word in English, never a blank)
const table = lang === 'en' ? null : await import(`../i18n/${lang}.js`).then((m) => m.strings, () => null);
// for dates and numbers: English keeps the device's own formats, as before
export const locale = lang === 'en' ? undefined : lang;
export const cjk = ['ja', 'zh-Hans', 'zh-Hant', 'ko'].includes(lang);
const plural = new Intl.PluralRules(lang === 'en' ? 'en' : lang);

// a counted string's form for n: `zero` where the table has one ("no slips"), else the language's
// own category from Intl.PluralRules, else `other`. English has one and other; Russian one (1, 21),
// few (2-4, 22), many (0, 5-20, 11) and other (fractions); Japanese and Chinese only other. A
// table may count a string English doesn't ("{n} days in a row": 1 день, 2 дня, 5 дней)
export function pluralForm(forms, n, rules = plural) {
  return (n === 0 && forms.zero != null ? forms.zero : forms[rules.select(n)]) ?? forms.other;
}

function fill(s, vars) {
  if (s && typeof s === 'object') s = pluralForm(s, Number(vars?.n ?? 0));
  return vars ? s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m)) : s;
}
// the interface's words, by key
export function t(key, vars) {
  const s = table?.[key] ?? EN.strings[key];
  return s == null ? key : fill(s, vars);
}
// the game's own words: the translation of `key`, or the English the data holds
export const tx = (key, english, vars) => (table?.[key] != null ? fill(table[key], vars) : english);

export const objName = (shape) => tx(`name.${shape.id}`, shape.name);
export const storyOf = (shape) => tx(`story.${shape.id}`, shape.story);
export const chapterName = (name) => (name ? tx(`chapter.${EN.slug(name)}.name`, name) : name);
export const chapterLine = (ch) => tx(`chapter.${EN.slug(ch.name)}.line`, ch.line);
// a lesson's hint, by the hint itself (its lesson and place are found once)
const hintKeys = new WeakMap();
for (const l of [...TUTORIAL, ...TUTORIAL_V2]) l.hints.forEach((h, k) => hintKeys.set(h, `hint.${l.id}.${k}`));
export const hintStr = (h, field) => (h?.[field] ? tx(`${hintKeys.get(h)}.${field}`, h[field]) : h?.[field]);

// index.html's words. data-i18n: the text; data-i18n-html: markup (a .html key), its {g1}, {g2}
// the element's own child elements, kept; data-i18n-aria / -mouse: those attributes
export function applyStatic(root = globalThis.document) {
  if (!root || lang === 'en') return;
  const doc = root.ownerDocument ?? root;
  doc.documentElement.lang = lang;
  doc.title = t('doc.title');
  for (const el of root.querySelectorAll('[data-i18n]')) el.textContent = t(el.dataset.i18n);
  for (const el of root.querySelectorAll('[data-i18n-html]')) {
    const kept = [...el.children].filter((c) => !/^(B|BR)$/.test(c.tagName)).map((c) => c.outerHTML);
    el.innerHTML = t(el.dataset.i18nHtml).replace(/\{g(\d)\}/g, (m, k) => kept[k - 1] ?? '');
  }
  for (const el of root.querySelectorAll('[data-i18n-aria]')) el.setAttribute('aria-label', t(el.dataset.i18nAria));
  for (const el of root.querySelectorAll('[data-i18n-mouse]')) el.dataset.mouse = t(el.dataset.i18nMouse);
  // Settings' on and off are drawn by style.css (.ring-toggle .s::after)
  doc.documentElement.style.setProperty('--t-on', JSON.stringify(t('set.on')));
  doc.documentElement.style.setProperty('--t-off', JSON.stringify(t('set.off')));
}
applyStatic();
