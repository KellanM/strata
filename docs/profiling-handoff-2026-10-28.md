# Profiling handoff, 2026-10-28 — for the build agent

From the Mac session, after profiling on a real iPhone. Evidence is committed; seven issues are filed. Read this, then work the order below.

- [`perf/2026-10-28-iphone-13-pro-max-baseline.md`](../perf/2026-10-28-iphone-13-pro-max-baseline.md) — the baseline, both passes, what was ruled out, and the gaps.
- Issues [#1](https://github.com/KellanM/strata/issues/1) … [#7](https://github.com/KellanM/strata/issues/7).
- Device: KM, iPhone 13 Pro Max (iPhone14,3), iOS 26.6.1, DPR 3, 428×926 (1284×2778), thermal Fair, Debug at commit `4954540`.

## What is established — do not re-derive

- **The 60 fps target passes.** `chisel` is p50 17 / p95 17–20 ms with **zero janks across three runs** (1,069 frames). The tap path is healthy.
- **`idle` is clean**: flat 60 fps, zero janks, worst 18–25 ms.
- **Low Power Mode was on for the first pass and inverted the whole verdict.** It pins rAF to 30 fps and roughly doubled every hitch. Any run without the power state recorded is unreliable — including the figures in `performance-profiling-next-test.md` (353 ms `commitLayerTree`, 1195 ms `applyHierarchyUpdates`), taken before anyone knew to check. Re-take them before building on them.
- **61 s of real hand-play** (row clear, marks, drag-rotate, pinch-zoom, peel) produced **55 hitches, 54 of them a single dropped frame, worst 33.3 ms**, spread evenly with no cluster on any gesture. No gesture is pathological on this device.
- **`perf.js` rAF gaps and Instruments hitch counts are not the same measurement.** The robot's 31 s run logged **3** Core Animation hitches; hand-play logged 55. The WebGL canvas presents outside Core Animation's frame accounting. Don't reconcile the two numbers.

## The `intro` stall is a main-thread hang in the *app* process, not a shader compile

This supersedes the framing in #2. From a 31 s Animation Hitches + Time Profiler capture covering run 1 (Low Power Mode off):

| at | duration | type | thread |
|---|---|---|---|
| 1.77 s | 46.9 ms | Potential Interaction Delay | App main thread |
| 5.69 s | **156.4 ms** | Brief Unresponsiveness | App main thread |
| 5.84 s | 52.1 ms | Potential Interaction Delay | App main thread |
| **10.68 s** | **726.2 ms** | **Hang** | **App main thread** |

The autobench waits 4 s, dismisses the title, waits 6 s, then starts run 1 — so ~10 s in. The hang lands at 10.68 s: that is `startPuzzle()`, and it is the 626 ms frame the bench reports.

**Sampled weight inside the hang window (10.68–11.41 s):**

| process | weight |
|---|---|
| App (UI process) | **730 ms** |
| kernel | 185 ms |
| DTServiceHub (the profiler itself) | 130 ms |
| backboardd | 91 ms |
| **`com.apple.WebKit.WebContent` (JS + WebGL)** | **11 samples, ~6 ms** |

**WebContent is essentially idle.** The game's JavaScript and its WebGL work are not what blocks. That rules out shader compilation and any JS-side cause, and it is consistent with `idle` being clean.

**What the app process is doing** — inclusive, so do not sum these:

```
236 ms  UIApplicationMain → -[UIApplication _run] → __CFRunLoopRun
        → __CFRunLoopDoSources0 → __CFRUNLOOP_IS_CALLING_OUT_TO_A_SOURCE0_PERFORM_FUNCTION__
224 ms    → WTF::RunLoop::performWork()
224 ms      → WebKit::WebProcessProxy::dispatchMessage(IPC::Connection&, IPC::Decoder&)
```

Heaviest leaf frames: `hashProbe` 53 ms, `objc_msgSend` 28 ms, `object_getMethodImplementation` 10 ms, `-[__NSArrayM insertObject:atIndex:]` 10 ms, `-[NSConcreteHashTable hashGrow]` 9 ms.

So: the web process sends a layer/hierarchy update, and the UI process blocks applying it — in hash-table growth, Objective-C dispatch and array insertion. That is the signature of **many native layers or views being created or reordered in one go**.

**This independently reproduces the Codex session's lead** (`applyHierarchyUpdates`, `_web_setSubviews:`, `UIView subviews`, "including hash-table work"), from a different trace, a different method, and with Low Power Mode off. Two sessions converging on the same mechanism is the strongest signal we have.

**Honest limits.** Only ~224 ms of the ~726 ms hang is attributed to that named stack; the remainder is unnamed in this capture. `DTServiceHub` taking 130 ms means the profiler itself inflates the hang somewhat, so 726 ms is an upper bound rather than the un-profiled cost. Inclusive weights overlap. No specific game function is implicated yet.

**Where to look, as hypotheses not conclusions:** whatever `startPuzzle()` changes that forces a large compositing change — `resetCoaching()` / `renderCoach()`, `maybeChapterCard()` / `shrineCard()`, `clearResult()`, `handles.reset()`, `finale.hide()` — plus the `will-change` and `backdrop-filter` rules in `style.css`, and `mapworld.js` layer creation. The actionable next measurement is **layer counts before and after** that transition, not a micro-optimisation.

## Order of work

1. **#4 — record the device power state in `STRATA_BENCH` output.** First; it protects everything after it. Cheap interim with no native code: flag a run whose `idle` p50 sits near 33 ms on a 60 Hz-capable display. Add the "Low Power Mode off, and say so" line to `profiling.md`.
2. **#5 — split burst completion from player cadence in `perf.js`.** This gates #1. Today `reveal` breaks every remaining cube in one synchronous loop — 107 cubes in one frame on `maple-bonsai`. A player breaks the last cube with one tap.
3. **#1 — the reveal hitch (108/124/135 ms), but only once #5 says it is real.** If the player-cadence variant is clean, re-scope #1 rather than optimise it.
4. **#2 — the 726 ms hang.** Re-scope it per the section above: it is native layer-tree application, not shader compilation. Measure layer counts across the transition before changing anything.
5. **#7 — emit boot milestones a CLI can read** (`console.log` suffices; Capacitor forwards the page console to the native log in Debug). Mark JS bootstrap, first frame, studio card lifted, title interactive. Note the separate 156 ms unresponsiveness at 5.69 s sits in the boot path.
6. **#6 — add `rotate` and `zoom` segments**, then row clear, mark, peel. Kellan asked for rotate and zoom specifically. Drive them through the same action functions the UI uses, not by poking the camera.
7. **#3 — the ProMotion cap is Kellan's call, not yours.** The app already meets its 60 fps target; this is a deliberate ceiling decision. If it changes, it belongs in `tools/ios-configure.mjs`.

## Not filed, deliberately

- **~0.9 dropped frames per second in real play** (54 single-frame drops in 61 s), labelled "expensive app update(s)". A label, not a cause. Needs a Time Profiler pass over hand-play before it earns a ticket.
- **48 Capacitor `Preferences set` bridge calls** in one bench run. No evidence of harm — `chisel` has zero janks.

## Protocol

The Mac session measures and does not change game code; you change the game. Reproduce with `STRATA_AUTOBENCH=3 npm run build:app`, Debug on device, console captured, **Low Power Mode off**. Never upload a profiling build; run a plain `npm run build:app` afterwards. Commit to master, `git pull --rebase`, never force-push, stage only your own files.

Traces are kept off git, on the Mac at `~/strata-traces/` (`robot-hitches.trace` 1.4 GB, `play.trace` 2.4 GB). `xctrace --attach` does not work against this device under Xcode 27.1, so captures must use `--all-processes`, and large ones take minutes to write.
