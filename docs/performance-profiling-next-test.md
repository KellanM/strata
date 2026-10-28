# Next profiling test: findings and implementation brief

2026-10-28. For the build agent; implementation proposals only. Extends [the profiling protocol](profiling.md). Do not change visuals or apply speculative performance fixes before reproducing the measured stalls.

## What the saved trace establishes

KM iPhone 13 Pro Max, iOS 26.6.1; Time Profiler plus Hangs (>250 ms), targeting Strata. Build 1.0(2), Release-with-symbols, and the black-screen observation are user-reported. Times below are UTC on October 28; exported offsets are relative nanoseconds within each run.

- **Run 1:** launched PID 15198, 06:56:45.742–06:57:56.750 (71.007 s), ended exit(0). Detected 512.668 ms and 263.592 ms main-thread events around lifecycle transitions, with only 46 ms and 43 ms of main-thread sampled weight respectively. Native scene creation and initial-frame work completed; that does not prove web content rendered. The black screen remains unexplained.
- **Run 2:** attached PID 15216, 07:05:07.468–07:10:21.516 (314.048 s), stopped by user. Lifecycle: first 2.664 s unknown, 261.694 s background, final **49.600 s foreground-active**, starting at offset 264.448543 s. This is not five minutes of gameplay.
- **07:09:40.206**, offset 272.738371 s: 353.376 ms event, 344 ms main-thread sample weight. WebKit `commitLayerTree`: 310 ms inclusive; `applyBackingStoreToNode`: 292 ms, including IOSurface construction/cache/deallocation paths.
- **07:09:50.913**, offset 283.445382 s: 1195.658 ms event, 1193 ms main-thread sample weight. WebKit `applyHierarchyUpdates` / `_web_setSubviews:`: 1147 ms inclusive; `UIView subviews`: 907 ms, including hash-table work. This is the strongest lead: expensive native layer-hierarchy processing, with no identified triggering game action.
- Run 2 native sample weight: **8.870 s total / 6.609 s main thread**; final foreground interval alone: **5.970 / 5.138 s**. Inclusive stack weights overlap; never sum them. Fair thermal state throughout both runs.

**Limits:** waiting threads/context switches, WebContent CPU, GPU execution and allocations were not profiled. Hexadecimal leaf symbols remain (1.959 s of Run 2 weight), although named parent stacks support the layer-update finding. Sample weight is not exact CPU accounting; wait-entry samples are not blocked duration. No FPS, frame-percentile, leak, GPU-bound, or gameplay-baseline claim is justified. Profiler overhead is unmeasured. Do not blame UIKit, CSS, shader compilation or a specific game function yet.

Evidence on the profiling Mac (local only, not included in this commit):

- Trace: `/Users/kellan/Documents/Codex/2026-10-27/task-2/strata-black-screen-diagnostic.trace`.
- Analysis directory: `/Users/kellan/Documents/Codex/2026-10-28/task/`; `trace-findings.md` explains methodology; `trace-summary.json` contains full stacks/weights; `trace-toc.xml`, `trace-analysis.xml`, `run-2-events.xml` are CLI exports; `analyze_trace.py` reproduces aggregation. Run 2 lifecycle/events were independently exported because combined-export narrative references were inconsistent; typed fields were used for calculations.
- A remote build agent can implement from this brief, but needs explicit artifact transfer for raw-evidence review. Keep the trace out of Git.

## Build next: deterministic scenarios, like latent automation commands

Yes: a declarative scenario can read like BDD (Given fixture / When actions / Then state), while an in-app runner executes condition-based commands like Unreal latent automation. Start with JSON plus a small runner, not a new BDD framework.

Existing foundations: `public/js/perf.js` has `mark`, `report`, and `bench` (fixed 3/6/5 s waits and 40 chisels at 120 ms); `public/js/main.js` exposes `window.strata`, `startPuzzle`, `act`, camera and related state. `npm test` runs Node tests for model/solver/migrations/ads/native configuration. Playwright QA scripts exist in `tools/`, but Playwright is not a package dependency and some executable paths are Windows-specific. No dedicated scenario/UI test suite is declared in `package.json`.

Implement in this order:

1. **Fixtures and semantic actions.** Version a fixture with level (`maple-bonsai` initially), seeded randomness, tutorial/progress state, camera pose, viewport/DPR and motion settings. Use an isolated test-save store; never reset the user's Preferences/localStorage. Route both UI input and runner through the same action functions: start level, rotate, chisel cell, open/close journal, return to map. Expose readiness and completion states from real lifecycle/animation callbacks. Do not mutate `broken`, scene nodes or solved flags directly. A scripted solver must issue legal actions; label any burst-completion stress case separately from player cadence.
2. **Runner with observable deadlines.** Await `bootReady`, `mapReady`, `puzzleReady`, `inputReady`, `revealComplete`, `journalReady`; each has a bounded timeout and state snapshot on failure. Readiness must mean assets/state/transition completion, not merely an element's existence or one animation frame. Timed holds are valid for idle/workload cadence, not substitutes for readiness. Log planned and actual monotonic timestamps, lateness and action outcome; avoid catch-up bursts after a stall. Keep real time/animation/GPU work in device performance runs; fake clocks belong only in runner unit tests.
3. **Timing and diagnostics.** Extend `perf.js` with explicit segment end/cancel, bounded raw-frame export, and visibility handling so background gaps and boundary-crossing frames do not contaminate phase distributions. Add JS `performance.mark/measure` and a minimal Capacitor bridge to native `OSSignposter` for each phase/action boundary. Include run ID, scenario version, phase/action sequence, JS timestamp/timeOrigin and native monotonic receipt time. Bridge calls are asynchronous: estimate clock alignment/round-trip uncertainty and retain both timestamps; do not pretend receipt equals the original JS event. Emit phase markers, not per-frame bridge calls. Apple supports signposted intervals in Instruments and matching XCTest metrics ([OSSignposter](https://developer.apple.com/documentation/os/ossignposter), [XCTOSSignpostMetric](https://developer.apple.com/documentation/xctest/xctossignpostmetric)).
4. **Launch failure evidence.** Add diagnostic-only boot milestones and WK navigation failure/WebContent termination reporting through supported Capacitor integration; preserve existing delegates. Current native entry is `SceneDelegate.swift:7–14` (window + CAPBridgeViewController). Record native scene ready, navigation, JS bootstrap and meaningful content ready separately. Compare ordinary launch/attach against profiler launch; no native fix is established by this trace.

Proposed first scenario (durations are workload choices, not pass thresholds):

| Phase | Action and checkpoint | Measurement |
|---|---|---|
| Setup | Load isolated fixture; boot and map ready; start level; puzzle/input ready | Record cold boot separately; exclude setup from steady gameplay |
| Idle | No input for 5 s while foreground | Frame gaps and native work |
| Rotate | Shared orbit action along a fixed 3 s trajectory; await settled | Rendering/hitch cost; retain a separate real-gesture smoke test |
| Chisel | 40 fixture-selected legal cells at nominal 120 ms cadence; check each result | Actual cadence, frame gaps, state consistency |
| Reveal | Finish remaining legal cells at declared cadence; await solved + revealComplete | Winning-action-to-reveal interval; optional separate burst stress variant |
| Journal | Open, await ready, hold 2 s, close | Layer/DOM changes and retained objects |
| Map | Return, await ready, fixed scroll route, hold 5 s | Hierarchy/backing-store churn |
| Repeat | Repeat navigation/level cycle 3–5 times | Retained growth after settling, not peak allocation alone |

Do not tune away effects on this evidence. If the layer stall reproduces, correlate layer counts/hierarchy changes first, then A/B node reuse or narrower compositing scope. Inspection candidates: `mapworld.js:176` (clear children), `:344–353` (canvas/div creation), `:472` (transforms); `style.css` will-change/backdrop-filter rules. These are hypotheses, not implicated call sites.

## Harness responsibilities

- **In-app runner:** owns deterministic game state and fine-grained action timing. This avoids desktop round-trip jitter. New hooks must be absent or disabled in production: explicit compile/build flag plus opt-in launch configuration in a Release-optimized profiling build, never a query string that activates store-build automation. Audit existing `window.strata` exposure rather than claiming it is already gated. No arbitrary JS command endpoint.
- **Playwright:** browser correctness, scenario contract, DOM overlay interactions, result export and screenshots. `page.evaluate` can invoke the gated runner and await its result; locator auto-waiting helps DOM controls. WebGL cubes are not DOM elements, so locators cannot select a cube; semantic actions bypass hit testing, which needs a separate pointer/gesture smoke test. Mobile viewport/WebKit emulation is not an actual iPhone WKWebView performance result. Sources: [evaluation](https://playwright.dev/docs/evaluating), [actionability](https://playwright.dev/docs/actionability), [emulation](https://playwright.dev/docs/emulation).
- **XCUITest:** real-device launch/foreground control, scenario ID via launch arguments, native/accessibility status checkpoints, screenshots and result attachments. Add a profiling-only native adapter to pass the scenario into the web runner and publish completion/results; XCUITest does not directly evaluate arbitrary WKWebView JS. Avoid one XCTest tap per timed cube. Use bounded state/element waits and explicit assertions; existence alone is not game readiness. Sources: [XCUIApplication](https://developer.apple.com/documentation/xcuiautomation/xcuiapplication), [waitForExistence](https://developer.apple.com/documentation/xcuiautomation/xcuielement/waitforexistence(timeout:)).

## Acceptance criteria for the next test

- One documented CLI/test invocation runs the chosen scenario without manual timed input and exports JSON plus failure screenshots/logs. Include commit/build/config, fixture hash, device/OS, thermal state, DPR, motion mode, timestamps and action outcomes. Timeout/cancellation is explicit; missing signpost pairs or aborted runs fail collection rather than report zero cost.
- Same fixture produces the same action sequence/final state across three runs; a readiness failure stops the sequence. Unit tests cover deadlines/lateness/phase boundaries and fixture isolation; existing `npm test` stays green. Browser tests cover overlays and boot errors. Shipping-build checks prove new automation entry points cannot activate.
- On-device runs use Release optimization with symbols and profiling hooks enabled only in the test configuration. Record any inspection configuration difference; do not upload that build. Compare at least three repeats under comparable thermal conditions, with cold and warm runs separated. Pair minimally instrumented runs with diagnostic captures to estimate overhead.
- Capture host **and WebContent** CPU with signposts, Safari rendering/JS timeline where inspection is enabled, and separate GPU/animation-hitch and allocations passes as needed. Verify actual captured processes/instruments. Avoid enabling every heavyweight profiler at once. Record layer counts around journal/map transitions and memory after repeated settled cycles.
- First establish per-device/per-phase baseline variance. Then choose reviewed regression limits (absolute guardrail plus relative change beyond observed noise), preserving raw distributions. Existing 60 fps/no >100 ms hitch goals in `profiling.md` are targets, not results or calibrated gates. rAF gaps are not presented-frame measurements; memory growth alone does not prove a leak.

This commit changes documentation only. Product implementation and actual device runs remain the next task.
