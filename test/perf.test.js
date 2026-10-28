// The profiling build's self-running benchmark must never reach a normal build.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('perf: no STRATA_AUTOBENCH in the shipped page; the build only injects it on request', () => {
  assert.doesNotMatch(readFileSync('public/index.html', 'utf8'), /STRATA_AUTOBENCH/);
  assert.match(readFileSync('tools/build.mjs', 'utf8'), /Number\(process\.env\.STRATA_AUTOBENCH \|\| 0\)/);
});
