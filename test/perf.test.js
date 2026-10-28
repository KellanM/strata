// The profiling build's self-running benchmark must never reach a normal build.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('perf: no STRATA_AUTOBENCH in the shipped page; the build only injects it on request', () => {
  assert.doesNotMatch(readFileSync('public/index.html', 'utf8'), /STRATA_AUTOBENCH/);
  assert.match(readFileSync('tools/build.mjs', 'utf8'), /Number\(process\.env\.STRATA_AUTOBENCH \|\| 0\)/);
});

// Issue #4: a run capped at 30 fps (Low Power Mode) must be flagged, a 60 fps one not
test('perf: powerCheck flags an idle p50 near 33 ms, and only that', async () => {
  const { powerCheck } = await import('../public/js/perf.js');
  assert.equal(powerCheck([{ segment: 'idle', p50: 33.3 }]).lowPowerSuspected, true);
  assert.equal(powerCheck([{ segment: 'idle', p50: 16.7 }]).lowPowerSuspected, false);
  assert.equal(powerCheck([{ segment: 'chisel', p50: 16.7 }]).lowPowerSuspected, null);
});
