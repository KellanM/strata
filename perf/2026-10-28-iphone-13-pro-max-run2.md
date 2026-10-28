# 2026-10-28 — iPhone 13 Pro Max, run 2 (the new benchmark)

Mac session, second pass, against the benchmark rewritten on the PC side (`40b93b1`). Protocol: [docs/profiling.md](../docs/profiling.md). The first pass is [2026-10-28-iphone-13-pro-max-baseline.md](2026-10-28-iphone-13-pro-max-baseline.md) — **two of its conclusions are corrected here.**

- **Device:** KM — iPhone 13 Pro Max (iPhone14,3), iOS 26.6.1 (23G83), 120 Hz display.
- **Build:** commit `40b93b1`, **Debug**, profiling build (`STRATA_AUTOBENCH=3`), stamped `v0.3.312`. DPR 3, viewport 428×926 → 1284×2778.
- **Low Power Mode: off.** All three runs report `idle p50 17 ms: not capped at 30 fps`, and `lowPowerSuspected: false`. Issue #4 works — this is now machine-checked rather than remembered.
- Nothing uploaded to App Store Connect. **No game code changed** — no diagnostic this time either.

## Headline

| | |
|---|---|
| **#1 — the reveal hitch** | **Settled: a harness artefact.** The player's completion is 18–61 ms. The 108–135 ms in the first pass was the burst, which still measures 136–145 ms |
| **#2 — the first-launch stall** | **Cause found, and it is not warm-up.** Starting a level while the map is up costs **692–703 ms, every time**, because the map holds **2,254 off-screen `<canvas>` veil sprites** that WebKit tears down in one hierarchy update |
| **Cold start** | **PASS at ~3.0 s**, of which 2.27 s is the studio card's deliberate hold. Real work is done at 340 ms |
| **Gestures** | `rotate` and `zoom` are clean: zero janks in all three runs, worst 18–25 ms |

## 1. The three runs


#### Run 1 of 3 — started from **the map** (`{"level":"logo","lesson":false,"title":false,"map":true}`)

| Segment | frames | fps | p50 | p95 | p99 | worst | janks |
|---|---|---|---|---|---|---|---|
| `intro` | 137 | 45.9 | 17 | 19 | 40 | **695** | 2 |
| `chisel` | 302 | 59.8 | 17 | 18 | 22 | **52** | 1 |
| `rotate` | 229 | 60 | 17 | 17 | 17 | **25** | 0 |
| `zoom` | 229 | 60 | 17 | 17 | 17 | **19** | 0 |
| `chisel-rest` | 785 | 60 | 17 | 18 | 21 | **24** | 0 |
| `reveal` | 361 | 59.7 | 17 | 17 | 20 | **61** | 1 |
| `idle` | 300 | 60 | 17 | 17 | 17 | **23** | 0 |
| `restart` | 181 | 59.7 | 17 | 17 | 17 | **40** | 1 |
| `reveal-burst` | 362 | 59 | 17 | 17 | 17 | **136** | 1 |

`power`: idle p50 17 ms: not capped at 30 fps (Low Power Mode looks off)

#### Run 2 of 3 — started from a finished level (`{"level":"maple-bonsai","lesson":false,"title":false,"map":false}`)

| Segment | frames | fps | p50 | p95 | p99 | worst | janks |
|---|---|---|---|---|---|---|---|
| `intro` | 181 | 60 | 17 | 17 | 17 | **29** | 0 |
| `chisel` | 303 | 60 | 17 | 17 | 20 | **21** | 0 |
| `rotate` | 229 | 60 | 17 | 17 | 18 | **18** | 0 |
| `zoom` | 229 | 60 | 17 | 17 | 17 | **21** | 0 |
| `chisel-rest` | 799 | 60 | 17 | 17 | 20 | **23** | 0 |
| `reveal` | 361 | 60 | 17 | 17 | 18 | **30** | 0 |
| `idle` | 301 | 60 | 17 | 17 | 17 | **24** | 0 |
| `restart` | 181 | 60 | 17 | 17 | 18 | **28** | 0 |
| `reveal-burst` | 361 | 58.9 | 17 | 17 | 17 | **139** | 1 |

`power`: idle p50 17 ms: not capped at 30 fps (Low Power Mode looks off)

#### Run 3 of 3 — started from a finished level (`{"level":"maple-bonsai","lesson":false,"title":false,"map":false}`)

| Segment | frames | fps | p50 | p95 | p99 | worst | janks |
|---|---|---|---|---|---|---|---|
| `intro` | 181 | 60 | 17 | 17 | 18 | **27** | 0 |
| `chisel` | 303 | 60 | 17 | 17 | 20 | **24** | 0 |
| `rotate` | 229 | 60 | 17 | 17 | 18 | **21** | 0 |
| `zoom` | 229 | 60 | 17 | 17 | 19 | **21** | 0 |
| `chisel-rest` | 802 | 60 | 17 | 17 | 21 | **24** | 0 |
| `reveal` | 361 | 60 | 17 | 17 | 17 | **18** | 0 |
| `idle` | 300 | 60 | 17 | 17 | 17 | **21** | 0 |
| `restart` | 181 | 60 | 17 | 17 | 18 | **29** | 0 |
| `reveal-burst` | 361 | 58.9 | 17 | 17 | 17 | **145** | 1 |

`power`: idle p50 17 ms: not capped at 30 fps (Low Power Mode looks off)

#### reveal vs reveal-burst

| run | `reveal` worst | `reveal` janks | `reveal-burst` worst | `reveal-burst` janks |
|---|---|---|---|---|
| 1 | **61 ms** | 1 | **136 ms** | 1 |
| 2 | **30 ms** | 0 | **139 ms** | 1 |
| 3 | **18 ms** | 0 | **145 ms** | 1 |

## 2. `reveal` vs `reveal-burst` — this settles #1

**The player's completion is within budget. The burst is not, and never was a player number.**

The player's `reveal` — the last cube broken alone, then the win, whirl, rays and gems — peaks at **61 / 30 / 18 ms** across the three runs, with one jank in run 1 and none after. The burst, every remaining cube broken in one synchronous loop, peaks at **136 / 139 / 145 ms**, one jank every run.

The first pass measured 108 / 124 / 135 ms and filed it as [#1](https://github.com/KellanM/strata/issues/1). That was the burst: the old `reveal` segment *was* the burst. **A player never sees it.** The win/whirl/rays/gems path (`finale.js`, `fragments.js`, `atmosphere.js`) is not a defect on this device — splitting the segment was the whole fix, and it belongs to #5.

Two honest caveats:

- The 61 ms in run 1 is the only player-side blemish, and it is the run that also carries a 52 ms jank in `chisel` and 40 ms in `restart` — first-run-in-session warm-up, all three well under the 100 ms budget.
- The burst is still a useful stress signal. 145 ms for ~100 breaks in one frame says the per-break cost is roughly 1.4 ms, which is fine; nothing suggests a quadratic blow-up.

**#1 should be closed as "not reproducible at the player's cadence"**, with the burst number kept as the labelled stress case it now is.

## 3. The layer census — this is the cause of #2

### The census

| run | started from | `layersBefore` prone / rendered | `layersAfter` prone / rendered | `intro` worst |
|---|---|---|---|---|
| 1 | **the map** | **2247 / 3165** | 16 / 165 | **695 ms** |
| 2 | a finished level | 31 / 180 | 17 / 180 | 29 ms |
| 3 | a finished level | 31 / 180 | 17 / 180 | 27 ms |

In run 1 the `top` group is unambiguous: **`#menu` alone holds 2,223 of the 2,247**. `all` stays at 3,276 either side, so nothing is removed from the DOM — `#menu` goes `visibility: hidden` and ~3,000 elements leave the render tree at once.

### It is not warm-up — three more cold launches

The first pass read `intro` 626 ms on run 1, 30 and 37 ms after, and concluded **"warm-up, not a recurring cost."** That was wrong, and the `context` field is what exposes it: runs 2 and 3 are cheap because they start from a *level*, not because the app is warm.

Three further cold launches, app force-terminated before each, reading run 1 only:

| launch | started from | `layersBefore` prone | `layersAfter` prone | `intro` worst |
|---|---|---|---|---|
| 1 | the map | 2247 | 16 | **692 ms** |
| 2 | the map | 2247 | 16 | **692 ms** |
| 3 | the map | 2247 | 16 | **703 ms** |

**Four map starts: 695, 692, 692, 703 ms — a spread of 11 ms.** It recurs every single time, and the cost tracks the layer count, not the session's age.

This matters more than "a slow first launch", because **a player starts every level by tapping a stone on the map.** The map is up every time. The dive animation and veil may hide some of it, but the main thread is unresponsive for ~0.7 s on each level start.

### What those 2,254 elements are

Counted from the same DOM in a desktop browser with the map up (the DOM and CSS are shared, so the breakdown transfers; the phone's 2,223 and desktop's 2,254 differ only by how much of the map is still unreached):

| canvas class | count |
|---|---|
| **`mw-spr mist veil`** | **2,254** |
| `mw-spr mist base distant` / `ghost` / `teaser` / `base` | 80 |
| `mw-spr mist` | 79 |
| `mw-starsheet`, `mw-dusk-stars`, the scene | 7 |
| **total `<canvas>` on the page** | **2,420** |

- **55.1 megapixels** of canvas backing store — about **210 MiB if each is RGBA**.
- **Zero** of the 2,413 mist canvases were within a screen of the viewport at the top of the map.
- Built in [`mapworld.js:393`](../public/js/mapworld.js:393): a nested `z += 58` / `x += 150 + rand() * 50` loop over the **full height of every chapter not yet reached**. So the count is *highest for a new player* — exactly who pays the 700 ms on their first level.

This is the mechanism the Instruments capture in the first pass described but could not name: `WebKit::WebProcessProxy::dispatchMessage` → `hashProbe`, `-[NSConcreteHashTable hashGrow]`, `-[__NSArrayM insertObject:atIndex:]`. Thousands of canvas-backed boxes changing visibility in one hierarchy update is precisely that shape. **The Codex session's `applyHierarchyUpdates` / `_web_setSubviews:` lead was right, and this is what was inside it.**

### Directions, as options not decisions

The veil's look is Kellan's call; these are the levers and their costs.

1. **One composited canvas per chapter** instead of ~150 sprites — draw the lobes into a single tall canvas. Cuts 2,254 elements to ~15. Biggest win, and the `.mw-wall` gradient div already carries most of the look. Cost: the per-lobe parallax in `veil.kids` would have to go or be faked.
2. **Build the veil only for chapters near the scroll position**, destroying and rebuilding as the map scrolls. Keeps the look exactly. Cost: scroll-time work, which the map deliberately avoids (`mapworld.js:337` notes the author already moved the mist to static for this reason).
3. **A coarser grid** — `z += 58` → `z += 120` and a wider x step roughly quarters the count for a thinner veil. Cheapest to try, smallest win, visible.
4. **Reuse one image per ribbon variant.** Only 8 seeds exist (`Math.floor(rand() * 8)`), but the width is randomised, so the `ribbon()` cache keyed on `col|seed|w|h|alpha` almost never hits and a fresh canvas is copied per sprite. Quantising the width would collapse it to ~8 distinct bitmaps. **Note the existing comment at `mapworld.js:274`: `toDataURL` was tried and "cost seconds of main thread"** — so this needs `convertToBlob` + `createObjectURL`, not a data URL. Cuts the 210 MiB, not the element count.

**Not yet proven:** that fixing this removes the hang. The dose-response and the stack both point at it, but the only way to know is to cut the count and re-run. Options 1 and 3 are each a one-run experiment.

## 4. Cold start — `STRATA_BOOT`, three cold launches

Times are ms since the web view began loading the page. The first row is wall clock from the `devicectl` launch request.

| milestone | cold 1 | cold 2 | cold 3 |
|---|---|---|---|
| *launch → `WebView loaded`* (wall) | *587* | *426* | *432* |
| `js` | 136 | 110 | 99 |
| `first-frame` | 267 | 229 | 223 |
| `map-built` | 340 | 313 | 319 |
| `splash-lifted` | 2616 | 2611 | 2611 |
| `title-interactive` | **2620** | **2614** | **2614** |
| **launch → `title-interactive`** (wall) | **3127** | **2996** | **3004** |

**Under the 4 s target, at ~3.0 s.** And the shape is the real finding: **the app's own work is finished at 340 ms.** Everything from there to 2,611 ms is the studio card holding by design (`SPLASH_HOLD` 2.6 s). The boot path is 11% work and 89% hold.

So cold start is not an engineering problem; it is a question for Kellan. Shortening `SPLASH_HOLD` is the only lever that moves the number, and that is a branding trade-off, not a fix. Icon-to-title would land near 2.7 s with a 2.0 s hold, or near 1.2 s with a 0.5 s hold. **Report, don't decide.**

Caveats, all of which make these numbers a little pessimistic and none optimistic:

- **Debug build with a console attached.** Release will be faster.
- **Launched by `devicectl`, not an icon tap**, and t=0 includes `devicectl`'s own connection setup — which is most of the 587/426/432 ms spread, not app work.
- **None of these is a first launch after install.** All nine launches this session ran back-to-back, so the dyld cache, WebKit and the app's pages were warm. The 6.87 s first-ever launch in the first pass is still the only sample of the genuinely cold case, and it deserves a re-measure after a reboot.
- `splash-lifted` and `title-interactive` are 3–4 ms apart, so `title-interactive` is effectively the card's exit, not a separate readiness event.

## 5. Against the targets

| Target (`docs/profiling.md` §Targets) | Result |
|---|---|
| 60 fps while playing; p95 16.7–17 ms; no janks in `chisel` | **PASS.** Every playing segment is p50 17 / p95 17–19. One jank in `chisel` run 1 (52 ms); none in runs 2–3. `rotate`, `zoom` and `chisel-rest` are **0 janks in all three runs** |
| No hitch over 100 ms after the studio card lifts | **FAIL, once — and it is #2.** `intro` 692–703 ms on every start from the map. `reveal` now **passes** (61 ms worst). `reveal-burst` 136–145 ms is a stress case, not a player number |
| Cold start under 4 s, icon to title | **PASS**, ~3.0 s, with the caveats above |
| Idle shouldn't burn battery | **Frame-wise clean**: 60 fps, 0 janks, worst 21–24 ms. **Still no Energy pass** — no battery claim either way |

## 6. Corrections to the first pass

Both come from the `context` field, which is why #2's instrumentation earned its keep immediately.

1. **"`reveal` is over budget on every run — 108/124/135 ms"** → that was the burst. The player's reveal peaks at 61 ms. #1 is not a defect.
2. **"First launch has a 626 ms frame … warm-up, not a recurring cost"** → not warm-up. It is the map's teardown, and it recurs on every level start from the map. Four samples, 692–703 ms.

A third, smaller one: the bench's `ua` field reports `iPhone OS 18_7` while the device runs **iOS 26.6.1**. That is WebKit's frozen user-agent string. **Don't read the OS version out of `STRATA_BENCH`** — take it from `devicectl`.

## 7. Gaps — what this report does *not* contain

Unchanged from the first pass, and still the work that would turn hypotheses into causes:

- **No Instruments pass in this run.** The 692–703 ms attribution here rests on the first pass's Time Profiler capture plus the census's dose-response, not a fresh trace. A Time Profiler pass over a *map start* specifically would name the WebKit call that scales with the canvas count.
- **No Time Profiler over hand-play**, so the ~0.9 dropped frames per second in real play (54 single-frame drops in 61 s, labelled "expensive app update(s)") still has no cause and no ticket.
- **No Metal System Trace, no Energy, no Allocations.** The Allocations gap now looks more interesting than it did: 55 megapixels of off-screen canvas is a memory finding waiting to be confirmed.
- **Gesture coverage is better but not complete.** `rotate` and `zoom` are in and clean. Row clear, mark and peel are still untested, as `docs/profiling.md` notes.
- **One device.** No older iPhone (an 11 or SE 2), where a 2,254-element teardown would hurt more.

## 8. Evidence on this Mac (not in git)

In `/private/tmp/claude-501/-Users-kellan-Documents-Codex-2026-10-27-task-2-strata/ba0494a0-b48e-42ed-a52d-d0ea95b15554/scratchpad/`:

- `run2-bench.log` / `run2-bench.json` — the console capture and the three extracted `STRATA_BENCH` lines.
- `run2-cold1.log` … `run2-cold3.log` — the three cold launches, each line stamped with ms since launch.
- `run2-mapstart1.log` … `run2-mapstart3.log` — the three map-start confirmation launches.
- The first pass's traces remain at `~/strata-traces/` (`robot-hitches.trace` 1.4 GB, `play.trace` 2.4 GB). `.trace` files stay out of git.

## 9. Method notes

- The bench was driven headlessly by `STRATA_AUTOBENCH=3`, launched with `xcrun devicectl device process launch --console --terminate-existing`, so every launch in this report is a true cold start. Nine in total.
- `xctrace --attach` still cannot resolve the process on this device under Xcode 27.1; only `--all-processes` works.
- `devicectl device info details` exposes **no power state**, so Low Power Mode cannot be read from the Mac. The inference in `powerCheck()` is the only reading available — which is the argument for having built it.
- The canvas breakdown in §3 was taken in a desktop browser against `PORT=5290 node server.js`, by showing `#menu` the way the game does and grouping the census's hits by reason, tag and class. No game code was changed to do it.
- `npm run build:app` was re-run without `STRATA_AUTOBENCH` afterwards, so this checkout is **not** left as a profiling build.
