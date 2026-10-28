# 2026-10-28 — iPhone 13 Pro Max, the Instruments passes

Third pass, filling the gap both earlier reports named: **what is actually inside the long frames.** Companion to [the baseline](2026-10-28-iphone-13-pro-max-baseline.md) and [run 2](2026-10-28-iphone-13-pro-max-run2.md).

- **Device:** KM — iPhone 13 Pro Max (iPhone14,3), iOS 26.6.1 (23G83), 120 Hz display, thermal Fair.
- **Build:** commit `a312652`, **Debug**. Hand-play used a **plain** build (no `STRATA_AUTOBENCH`), so no robot played alongside Kellan — the first pass's hand-play trace was contaminated exactly that way.
- **No game code changed.** Nothing uploaded.

## The tooling breakthrough: `xctrace --launch` works

The first pass concluded only `--all-processes` worked, because `--attach <pid>` and `--attach App` both failed. **`--launch` was never tried, and it works:**

```
xcrun xctrace record --template 'Time Profiler' --device <udid> \
  --time-limit 25s --output out.trace --launch -- com.unsupervisedrock.strata
```

| | `--all-processes` | `--launch` |
|---|---|---|
| trace size | 1.4–2.4 GB | **252 KB – 5 MB** |
| save time | minutes, sometimes wedged | seconds |
| `DTServiceHub` inflating the numbers | yes (130 ms inside the first hang) | **no** |

Instruments can also be **combined** on one recording, so a single session yields several views:

```
--template 'Metal System Trace' --instrument 'Hitches' --instrument 'Time Profiler'
```

**Two caveats.** `--launch` traces only the launched process, so `com.apple.WebKit.WebContent` and `.GPU` are absent unless the template records system-wide (Metal System Trace does). And **Instruments will not record on a locked phone** — it prints `will start recording when … is unlocked`, waits out the limit, and saves a trace that fails to export with `Trace is malformed - run data is missing`. Unlock first, and set Auto-Lock to Never for long captures.

## 1. The hang, fully attributed

App-only Time Profiler over a robot map start. **One hang, 689.66 ms, app main thread**, agreeing with the bench's 692–703 ms:

```
690 ms  UIApplicationMain → -[UIApplication _run] → __CFRunLoopRun → __CFRunLoopDoSources0
672 ms   └─ WTF::RunLoop::performWork → WebKit::WebProcessProxy::dispatchMessage
671 ms      └─ RemoteLayerTreeDrawingAreaProxy::commitLayerTree
671 ms         └─ RemoteLayerTreeHost::updateLayerTree
665 ms            └─ RemoteLayerTreePropertyApplier::applyHierarchyUpdates
664 ms               └─ -[UIView(WKUIViewUtilities) _web_setSubviews:]
```

Heaviest leaves: `hashProbe` **178 ms**, `-[NSConcreteHashTable hashGrow]` 47 ms, `objc_msgSend` 46 ms, `-[__NSArrayM insertObject:atIndex:]` 22 ms, `NSConcreteHashTable getItem:`/`insertItem:` 17/15 ms, `NSHashGet` 11 ms.

**96% of the hang is one call — `-[UIView _web_setSubviews:]`** — replacing the web view's subview array, and the cost inside it is hash-table probing and growth over a set of thousands of views. Those views are the **2,254 off-screen canvas veil sprites** the run-2 census found. The causal chain is now complete:

> 2,254 `<canvas>` veil sprites → ~2,400 native layers → UIView subviews → the map hides → `_web_setSubviews:` replaces the set → `NSConcreteHashTable` probe/grow over thousands of entries → ~690 ms on the app's main thread.

This is `docs/performance-profiling-next-test.md`'s prediction confirmed down to the function name, with Low Power Mode off and no profiler inflation.

## 2. A player's transition costs **twice** what the bench reports

The headline finding, and it only appeared in hand-play. Kellan started two levels from the map in 80 seconds. **Each one produced two back-to-back ~700 ms hangs, not one:**

| at | duration | type |
|---|---|---|
| 27.40 s | 137.8 ms | Brief Unresponsiveness |
| 28.66 s | 138.4 ms | Brief Unresponsiveness |
| **28.91 s** | **702.2 ms** | **Hang** |
| **29.63 s** | **712.1 ms** | **Hang** |
| 31.52 s | 123.4 ms | Brief Unresponsiveness |
| 63.54 s | 126.6 ms | Brief Unresponsiveness |
| 65.96 s | 133.3 ms | Brief Unresponsiveness |
| **66.22 s** | **704.5 ms** | **Hang** |
| **66.94 s** | **706.8 ms** | **Hang** |
| 68.87 s | 134.0 ms | Brief Unresponsiveness |
| 80.51 s | 128.3 ms | Brief Unresponsiveness |

**Total main thread unresponsive: 3,747 ms of 80 s — 4.7% of the session**, and essentially all of it inside two level starts.

Both hangs of a pair have the **same stack**: hang 1 is 676 of 698 ms in `_web_setSubviews:` (`hashProbe` 182 ms, `hashGrow` 60 ms); hang 2 is the same path. Durations across the two transitions — 702 / 712 and 704 / 707 ms — are consistent to within 10 ms.

So **a player pays ~1.41 s of frozen main thread per level start, plus ~130 ms either side.** The robot's `startPuzzle()` shows only one hang, because it calls the function directly and skips the dive the player's tap triggers. **The bench understates the real cost by roughly half** — the same class of error as #5 (burst vs player cadence) and #8 (only run 1 starts from the map). Measure the fix against hand-play, not against the bench alone.

Why two rather than one is **not established**. A candidate worth checking first: the map hides in two steps — `#menu` loses `.show` (→ `visibility: hidden`), and `body.world-up` is removed (→ `#map-world` `display: none`) — which would be two hierarchy updates over two sets of canvases.

## 3. Steady chiselling is genuinely clean

Kellan's report — *"no hitches when I was chiselling, but big hitches during the level transition and shortly after"* — matches the trace exactly.

**Hitches over 80 s of hand-play: 57.** Median **16.7 ms**, worst **50.0 ms**, **none over 100 ms**, and only **two over 34 ms** — at 28.84 s and 66.15 s, i.e. immediately before each transition's hangs.

Presented surfaces per second, between the two transitions (32–62 s): **mean 61.6, min 40, max 118.**

This settles a concern I raised and got wrong. From the robot's Metal trace I reported 35–49 surfaces/s during play and suggested `perf.js` was overstating the frame rate. **It is not.** In clean hand-play the presented rate averages 61.6/s with excursions to 118, and a lower count simply means less changed that second — a surface swaps only when there is something new to show. Three measures now agree that steady play is healthy: `perf.js` (0 janks in 1,069 frames), Hitches (nothing over 50 ms), and Kellan's hand.

During a transition the presented rate collapses: **113 → 78 → 34 → 17** surfaces/s across 28–31 s.

## 4. Shader compilation is dead as a theory

From the Metal System Trace, `graphics-compiler-activity-intervals`, 45 s session:

| | |
|---|---|
| shader compiles | 213, all in `com.apple.WebKit.GPU` |
| **total compile time** | **33.7 ms** |
| largest single compile | 3.38 ms |
| **inside the 689 ms hang window** | **0.49 ms** (6 compiles) |

#2 was originally filed as "consistent with shader compilation or first-use GPU upload". It is not, by three orders of magnitude.

## 5. Nothing is GPU-bound. The GPU is loafing.

`gpu-performance-state-intervals` over the robot's play window (18–39 s):

| state | time | share |
|---|---|---|
| **Minimum** | 7,140 ms | **99.3%** |
| Medium | 50 ms | 0.7% |

The GPU sat at its **minimum clock** for essentially the whole window, and only ~34% of wall time carried an active state interval at all. **No draw call is responsible for anything in these reports.** This kills the fill-rate / god-rays / DPR-3 theory a second time, now with direct GPU evidence rather than inference from a clean `idle`.

A note for [#3](https://github.com/KellanM/strata/issues/3): the display reached **118 surfaces/s** during hand-play, so the app is not globally capped at 60 fps. The cap applies to `requestAnimationFrame`, which drives the WebGL scene; CSS and compositor-driven animation (the map's scroll) already reaches 120 Hz. #3's framing should be narrowed to the WebGL path.

## 6. Two passes the CLI cannot deliver on this setup

Reported as failures rather than quietly dropped.

- **Energy / Power Profiler:** records, but `xctrace export` refuses it — `Export failed: Document Missing Template Error`. So **the "idle shouldn't burn battery" target remains unmeasured.** It needs the Instruments GUI, or Xcode's energy gauge, which this session cannot drive. Frame-wise idle is clean, which is not the same claim.
- **Allocations:** records a 204 MB trace containing only `kdebug`, `os-signpost`, `process-info`, `thread-info` and `tick` — **no allocation table at all**, with `--launch` on device. So the **202 MiB of veil canvas backing store is still unconfirmed as retained memory**, and there is no leak claim either way. `metal-current-allocated-size` in a Metal System Trace is a partial substitute worth trying next.

## 7. Still open

- **Why two hangs per player transition**, not one (§2). Highest-value question remaining; it may double the size of the win.
- **Web vs standalone.** Kellan reports the live web app at `kellanm.github.io/strata` is flawless. Three things differ at once — Safari vs WKWebView-in-app, **Release vs Debug**, and deployed assets vs `capacitor://localhost`. The cheap decisive test is one map→level transition in Safari on the same phone. If it is clean there, the veil teardown is only this expensive inside the Capacitor web view, which changes what to fix.
- **Energy and Allocations** (§6).
- **Row clear, mark and peel** still have no bench coverage (#6, second half).
- **One device.** A 2,254-element teardown would hurt more on an iPhone 11 or SE 2.

## 8. Evidence on this Mac (not in git)

In `~/strata-traces/`: `mapstart-timeprofile.trace` (5.3 MB, the attributed hang), `play-metal.trace` (193 MB, GPU and shaders), `handplay.trace` (367 MB, the hand-play session — hitches, hangs, time profile, presented surfaces), `alloc.trace` (204 MB, no allocation data), `idle-power.trace` (will not export). Earlier passes' `robot-hitches.trace` and `play.trace` remain. `.trace` files stay out of git.

Parsers used, in the session scratchpad: `xtrace.py` (resolves xctrace's `ref=`/`id=` reference compression, without which an export looks like two rows instead of hundreds) and `hangwin.py` (inclusive and leaf weights for a time window on one thread).
