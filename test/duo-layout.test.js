// The iPhone Duo's layout rules (v1.1) never reach a phone: the inner screen's larger
// interface lives only in a regular-width media block, and the narrow Split View fixes only
// below the narrowest iPhone that runs Strata (375). A browser checks the rest
// (the fold test in docs/handoff-2026-10-31-v1.1-duo.md); this guards the CSS's shape.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../public/style.css', import.meta.url), 'utf8');

// the body of each top-level @media block, with its condition
function mediaBlocks(src) {
  const out = [];
  const re = /@media\s*([^{]+)\{/g;
  let m;
  while ((m = re.exec(src))) {
    let depth = 1, i = re.lastIndex;
    for (; i < src.length && depth; i++) depth += src[i] === '{' ? 1 : src[i] === '}' ? -1 : 0;
    out.push({ cond: m[1].trim(), body: src.slice(re.lastIndex, i - 1), start: m.index, end: i });
    re.lastIndex = i;
  }
  return out;
}

test('duo layout: the interface scale (--u) is set and used only on regular-width windows', () => {
  const blocks = mediaBlocks(css);
  const regular = blocks.filter((b) => /var\(--u\)|--u:/.test(b.body));
  assert.equal(regular.length, 1);
  assert.match(regular[0].cond, /min-width:\s*600px/);
  assert.match(regular[0].cond, /min-height:\s*600px/);
  const outside = css.slice(0, regular[0].start) + css.slice(regular[0].end);
  assert.doesNotMatch(outside, /--u\b/, 'a phone would pick up the scale');
});

test('duo layout: the narrow-window rules stop short of the narrowest iPhone (375)', () => {
  for (const b of mediaBlocks(css)) {
    const max = b.cond.match(/max-width:\s*(\d+)px/);
    if (max) assert.ok(Number(max[1]) < 375, `@media ${b.cond} would change a phone`);
  }
});
