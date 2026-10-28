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

// Issue #8: a level start is four or five frozen frames, so tap-start reports
// their count and sum, not only the worst one
test('perf: longFrames counts and sums every frame over 100 ms', async () => {
  const { longFrames } = await import('../public/js/perf.js');
  assert.deepEqual(longFrames([16.7, 1098.2, 16.6, 774, 729.4, 100, 628, 115.3, 33]),
    { over100count: 5, sumOver100: 3344, framesOver100: [1098, 774, 729, 628, 115] });
  assert.deepEqual(longFrames([16.7, 16.6]), { over100count: 0, sumOver100: 0, framesOver100: [] });
  assert.equal(longFrames([60, 120], 50).over100count, 2);
});

test('perf: the bench keeps intro as the direct startPuzzle and adds tap-start, a real tap', () => {
  const src = readFileSync('public/js/perf.js', 'utf8');
  assert.match(src, /mark\('intro'\);[^\n]*\n\s*strata\.startPuzzle\(e\);/);
  assert.match(src, /mark\('tap-start'\)/);
  assert.match(src, /new MouseEvent\('click'/);
});
