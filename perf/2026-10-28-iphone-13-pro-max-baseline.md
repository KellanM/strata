# 2026-10-28 — iPhone 13 Pro Max baseline

Mac session (Kellan's Mac Mini, Xcode 27.1). Protocol: [docs/profiling.md](../docs/profiling.md).

- **Device:** KM — iPhone 13 Pro Max (iPhone14,3), iOS 26.6.1 (23G83). Built-in display 1284×2778, **max refresh 120 Hz**.
- **Build:** commit `4954540`, **Debug**, profiling build (`STRATA_AUTOBENCH=3`), stamped `v0.3.299`. Signed *Apple Development: Kellan Mythen*, team `4JS6BJKPQZ`.
- **Page:** DPR 3, viewport 428×926 → 1284×2778 backing store.
- **Thermal state:** Fair throughout. Battery 68%, on external power.
- Nothing was uploaded to App Store Connect. No game code changed (one exception disclosed at the end).

---

## Read this first: Low Power Mode invalidates a run

**The first full pass was measured with Low Power Mode on, and it is worthless as a baseline.** iOS pins `requestAnimationFrame` to 30 fps in Low Power Mode, which put *every* segment at p50 33 ms — including `idle`, where nothing moves but the sky. That flatness is what gave it away: real GPU strain jitters, a cap does not.

With it switched off, the same build on the same device went to 60 fps and **the verdict changed from "fails the frame-rate target everywhere" to "passes while playing"**. Low Power Mode roughly doubled every hitch as well (`intro` 1293 → 626 ms, `reveal` 196 → 135 ms), because it lowers CPU and GPU clocks.

**Record the power state with every future run.** Worth adding to the protocol and to `strata.bench()`'s own output, since the harness cannot currently see it. Two notes follow from this:

- The earlier Mac-session report in this directory (`2026-10-27-blocked-no-device.md`) is unaffected — it has no numbers.
- **The figures in `docs/performance-profiling-next-test.md` are very likely inflated the same way** (353 ms `commitLayerTree`, 1195 ms `applyHierarchyUpdates`). That trace was taken before anyone knew to check. They should be re-taken with Low Power Mode off before anything is built on them.

---

## The benchmark

`strata.bench()` on `maple-bonsai` (8×8×4, 256 cells), three consecutive runs per pass, unattended.

### Low Power Mode OFF — this is the baseline

| Segment | run | frames | fps | p50 | p95 | p99 | worst | janks |
|---|---|---|---|---|---|---|---|---|
| `intro` | 1 | 141 | 47.2 | 17 | 17 | 38 | **626** | 2 |
| `intro` | 2 | 181 | 60 | 17 | 17 | 20 | **30** | 0 |
| `intro` | 3 | 181 | 59.7 | 17 | 17 | 18 | **37** | 1 |
| `chisel` | 1 | 349 | 60 | 17 | 17 | 18 | **23** | 0 |
| `chisel` | 2 | 360 | 60 | 17 | 20 | 21 | **23** | 0 |
| `chisel` | 3 | 360 | 60 | 17 | 17 | 18 | **19** | 0 |
| `reveal` | 1 | 363 | 59 | 17 | 17 | 20 | **135** | 1 |
| `reveal` | 2 | 362 | 59 | 17 | 17 | 18 | **124** | 1 |
| `reveal` | 3 | 362 | 59.2 | 17 | 17 | 17 | **108** | 1 |
| `idle` | 1 | 301 | 60 | 17 | 17 | 17 | **25** | 0 |
| `idle` | 2 | 300 | 60 | 17 | 17 | 17 | **23** | 0 |
| `idle` | 3 | 301 | 60 | 17 | 17 | 17 | **18** | 0 |

### Low Power Mode ON — kept only as evidence of the hazard

| Segment | run | frames | fps | p50 | p95 | p99 | worst | janks |
|---|---|---|---|---|---|---|---|---|
| `intro` | 1 | 51 | 17.2 | 33 | 41 | 1293 | **1293** | 3 |
| `intro` | 2 | 92 | 30 | 33 | 35 | 67 | **67** | 6 |
| `intro` | 3 | 92 | 30 | 33 | 34 | 49 | **49** | 1 |
| `chisel` | 1 | 175 | 30 | 33 | 34 | 38 | **40** | 4 |
| `chisel` | 2 | 180 | 30 | 33 | 34 | 35 | **40** | 2 |
| `chisel` | 3 | 180 | 30 | 33 | 34 | 40 | **51** | 5 |
| `reveal` | 1 | 182 | 29.4 | 33 | 34 | 42 | **196** | 4 |
| `reveal` | 2 | 181 | 29.3 | 33 | 34 | 34 | **182** | 1 |
| `reveal` | 3 | 182 | 29.5 | 33 | 34 | 47 | **163** | 2 |
| `idle` | 1 | 150 | 30 | 33 | 34 | 34 | **50** | 1 |
| `idle` | 2 | 151 | 30 | 33 | 34 | 34 | **35** | 1 |
| `idle` | 3 | 53 | 30 | 33 | 34 | 50 | **50** | 2 |

(That last `idle` row is a partial segment — the capture window closed early.)

---

## Against the targets

| Target (`docs/profiling.md` §Targets) | Result |
|---|---|
| 60 fps while playing; p95 16.7–17 ms; **no janks in `chisel`** | **PASS.** `chisel` p50 17 / p95 17–20 ms, **0 janks in all three runs** (1,069 frames) |
| No hitch over 100 ms after the studio card lifts | **FAIL, twice.** `intro` 626 ms on first launch; `reveal` 108–135 ms on *every* run |
| Cold start under 4 s, icon to title | **Not properly measured** — see below |
| Idle shouldn't burn battery | **Not measured** (no Energy pass). Frame-wise idle is clean: 60 fps, 0 janks, worst 18–25 ms |

## The two defects

**1. `reveal` is over budget on every run — 108/124/135 ms.** Not warm-up; it recurs. `reveal` fires the win, the whirl, the rays and the gems at once (`finale.js`, `fragments.js`, `atmosphere.js`). Filed as [#1](https://github.com/KellanM/strata/issues/1).

**2. First launch has a 626 ms frame as the block assembles**, dropping to 30/37 ms on later runs in the same session. The first on-device confirmation that the `intro` stall is **warm-up, not a recurring cost** — consistent with shader compilation or first-use GPU upload. Still breaks the 100 ms budget exactly when a new player is watching. Filed as [#2](https://github.com/KellanM/strata/issues/2).

Also filed: [#3](https://github.com/KellanM/strata/issues/3) — `Info.plist` has no `CADisableMinimumFrameDurationOnPhone`, so the app is held to 60 fps on this 120 Hz screen. Not a bug against today's target, which it meets; a ceiling to decide about deliberately, with the trade-off written up in the issue.

## Two theories this run kills

Worth recording so nobody spends time on them:

- **Not fill rate / god rays / DPR 3.** I expected this, and it is wrong: `idle` renders the same sky at a flat 60 fps with zero janks. There is headroom at DPR 3.
- **Not the per-tap AO rebuild.** `refreshAO()` → `cubes.js:468 updateAO()` walks every cell on every chisel and re-uploads the AO attribute. It looks alarming, but the largest block in the game is 630 cells (`bonus-the-orchard`, `bonus-ember-steps`) ≈ 15k neighbour lookups per tap, and `chisel` shows **zero janks**. Not worth optimising on current evidence.

## Cold start — measured, but not the number the target asks for

Three launches, app force-terminated between each, timed from the `devicectl` launch request to Capacitor's `WebView loaded`:

| run | launch → WebView loaded |
|---|---|
| 1 (coldest) | **6.87 s** |
| 2 | 2.83 s |
| 3 | 2.78 s |

**Do not read this as pass/fail against the 4 s target.** It differs from "icon tap to title" in three ways that all matter: it is a **Debug** build (slower than Release), it is launched with a **console attached** (which adds overhead), and it stops at `WebView loaded` rather than the title, which appears after the studio card's `SPLASH_HOLD` (2.6 s, overlapping boot). Run 1 being 2.5× runs 2–3 is the real cold case and is the one to re-measure properly.

A trustworthy number needs a Release build launched from the Home Screen, with the title's arrival signposted. The in-app motion log (`motion.js mark()`) is DOM-only, so it cannot be read headlessly — a boot signpost would fix that.

## Gaps — what this report does *not* contain

- **No Instruments passes.** Animation Hitches, Time Profiler (incl. `com.apple.WebKit.WebContent`), Metal System Trace, Energy and Allocations all failed to produce a usable trace. Two separate tooling problems on this Mac/device pair under Xcode 27.1: `xctrace --attach` cannot resolve the process by pid **or** name on this device (`Cannot find process matching name: App`), so only `--all-processes` works; and after the first successful 10 s capture, every later recording wedged while saving — a 10 s trace eventually hung past 300 s. My own error made it worse: I deleted one trace directory while `xctrace` was still writing to it. **So the central question — what is inside the 626 ms and the ~120 ms frames — is still unanswered.**
- **No gesture coverage.** The bench only taps, on a 120 ms metronome. Untouched: **double-tap row clear** (`clearRow`'s staggered cascade), **mark** (`markRow`), **drag-rotate**, **pinch-zoom**, and the **peel handles/slider**. Kellan reported hitches while tapping by hand, but that session was recorded against the autobench build, so a robot was playing at the same time and the observation cannot be attributed. Given `chisel` is the cleanest segment in the table, the untested gestures are now the more likely suspects.
- **No Energy or Allocations numbers**, so no battery or leak claim either way.

## Evidence on this Mac (not in git)

- Console captures and both passes' raw `STRATA_BENCH` JSON: `/private/tmp/claude-501/-Users-kellan-Documents-Codex-2026-10-27-task-2-strata/ba0494a0-b48e-42ed-a52d-d0ea95b15554/scratchpad/` (`autobench.log`, `autobench-lpm-off.log`, `cold1..3.log`).
- The one trace that did save (10 s, Animation Hitches, all-processes, Low Power Mode on): same directory, `t2.trace`. It is the source of the display and thermal facts above. `.trace` files are kept out of git.

## Method note

`npm run build:app` was re-run without `STRATA_AUTOBENCH` afterwards, so this checkout is **not** left as a profiling build, and `test/perf.test.js` passes (33/33).

Before the PC session added the headless path, I measured one pass with a one-line diagnostic appended to `main.js` (it cleared the title so `frame()` would call `draw()`, then ran the bench three times and logged each table). It was **reverted**, and `main.js` was verified byte-identical to its prior state. Its numbers agree with the official harness to within 1% (1282 vs 1293 ms on the `intro` stall), which is the cross-check behind that figure.
