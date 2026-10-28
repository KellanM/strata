# 2026-10-28 — the Release-vs-Debug control, and why the stall is a *new player's* stall

Fourth pass. It answers the one question that qualified every number in the three
reports before it — [baseline](2026-10-28-iphone-13-pro-max-baseline.md),
[run 2](2026-10-28-iphone-13-pro-max-run2.md),
[Instruments](2026-10-28-iphone-13-pro-max-instruments.md) — and then pins down a
property of the defect that changes who it hurts.

- **Device:** KM — iPhone 13 Pro Max (iPhone14,3), iOS 26.6.1 (23G83), thermal Fair, Low Power Mode off.
- **Builds:** identical web assets (commit `5cb6a7d`; `4be5bd1` for the web half — the commits between touched only `docs/` and `perf/`), `STRATA_AUTOBENCH=1`, built **Release** and compared against the **Debug** trace from the third pass.
- **No game code changed.** Nothing uploaded.

## 1. The hang is not a Debug artefact

`docs/profiling-next.md` made this the gate on the map work: *"Do not rewrite the
map's mist until test 1 has run."* It has run. Same device, same web assets, same
template, same window — the only variable changed was the Xcode configuration.

| build | hang | at | `_web_setSubviews:` | share of hang |
|---|---|---|---|---|
| Debug | 689.66 ms | 12.55 s | 664 / 690 ms | 96.2% |
| **Release, 25 s window** | **688.60 ms** | 13.71 s | **643 / 669 ms** | **96.1%** |
| **Release, 55 s window** | **701.38 ms** | 12.46 s | — | — |

**Debug 690 ms vs Release 688–701 ms.** The first pair differ by **1.06 ms**, 0.15%.
One hang per run, `hang-risks` empty in all three. The Release leaf profile is the
same shape as Debug's — `hashProbe` 162 ms, `-[NSConcreteHashTable hashGrow]` 51 ms,
`objc_msgSend` 47 ms, `object_getMethodImplementation` 33 ms,
`-[__NSArrayM insertObject:atIndex:]` 19 ms, `-[UIView(Hierarchy) subviews]` 14 ms —
and the inclusive chain is identical from `__CFRunLoopDoSources0` down to
`-[UIView(WKUIViewUtilities) _web_setSubviews:]`.

The 55 s pass is worth its own line: it covers the **whole** bench — intro, chisel,
reveal, rotate, zoom, chisel-rest, idle — and still finds **exactly one** hang over
250 ms. "Steady play is clean" now holds on an optimised build too, not just Debug.

### Why this could not have gone the other way

Worth writing down, because it generalises:

**96% of the hang is inside WebKit and UIKit.** Those are system frameworks — shipped
optimised, loaded from the dyld shared cache, byte-identical whichever way the app was
compiled. A Debug configuration can only deoptimise the app's *own* code, and that is
214 KB of Capacitor glue which appears nowhere in the hang stack.

> **Debug-vs-Release cannot explain any hang whose weight sits in system frameworks.**
> Look at where the weight is before spending a build on the question.

### A Release build is mute

There is no `STRATA_BENCH` table from these runs and there cannot be one. From
Capacitor's source, not inferred: `CAPInstanceDescriptor.m:38` defaults
`loggingBehavior` to `Debug`, and `CAPInstanceConfiguration.m:25` makes that mode
`_loggingEnabled = debug`. In Release the bridge does not forward the page console, so
**every Release-build measurement has to come from Instruments.**

## 2. The stall shrinks as the player progresses — it is worst on a fresh save

`mapworld.js:393` builds the veil inside `if (r.bank)`, and `map.js:315` sets
`bank: !r.reached || r.parting`. **Veil sprites exist only for chapters the player has
not reached.** So the layer count — and therefore the hang — is a function of progress.

Measured in a browser at a phone viewport (390×844) against the same `public/`, by
seeding `strata.solved` and counting `canvas.mw-spr` once the map is up:

| chapters solved | sprite canvases | of which veil | Mpx | ~RGBA |
|---|---|---|---|---|
| **0 — a new player** | **2,222** | **2,063** | 51.0 | 204 MiB |
| 1 | 2,094 | 1,936 | 48.1 | 192 MiB |
| 3 | 1,793 | 1,635 | 41.0 | 164 MiB |
| 5 | 1,443 | 1,285 | 32.8 | 131 MiB |
| 8 | 1,036 | 878 | 23.3 | 93 MiB |
| 11 | 582 | 425 | 12.7 | 51 MiB |
| 14+ | **156** | **0** | 2.8 | 11 MiB |

Roughly **−147 veil canvases per chapter solved**, to zero. A player near the end of
the game carries **14× fewer** sprites than a new one.

Three consequences:

1. **The defect is worst exactly where it costs most** — a player's first session, and
   the App Store reviewer's first minutes. It is not a late-game problem that only
   completionists meet; it is a first-impression problem that heals itself.
2. **It is the most likely explanation of "the web is flawless".** #12 listed three
   confounds between web and standalone; this pass killed the build one. If Kellan's
   Safari save has progress and the phone's save was fresh, the two were never
   measuring the same map. Checkable: compare `strata.solved` in each.
3. **The fresh-save number is the one to regression-test.** 2,222 sprites / 2,063 veil
   at 390×844 is the figure a fix has to move, and it needs no device to re-measure.

The 204 MiB independently reproduces the third pass's 202–210 MiB estimate from a
different method. It remains **a calculation from pixel dimensions, not a measurement**
— see #13; Allocations still will not export.

## 3. What is still not known

- **Whether the hang scales linearly with the sprite count.** One device point
  (2,247 prone layers → ~690 ms) gives 0.31 ms per sprite; at that rate a finished
  player's 156 sprites would cost ~48 ms. **That is an extrapolation from a single
  point through the origin, and hash-table growth is not linear.** Confirming it needs
  a device run against a progressed save, which needs a way to seed the save — the
  dev panel's unlock is web-only.
- **Test 2 of #12** — one map→level transition in Safari on the same phone, same save
  state. Needs a human.
- **#11** — why a player gets *two* ~700 ms hangs where the robot gets one.
- **#13** — idle energy and real allocated bytes.

## Method

```sh
export DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer
xcodebuild -project ios/App/App.xcodeproj -scheme App -configuration Release \
  -destination 'id=<udid>' -derivedDataPath <dd> -allowProvisioningUpdates build
xcrun devicectl device install app --device <udid> <dd>/Build/Products/Release-iphoneos/App.app
xcrun xctrace record --template 'Time Profiler' --device <udid> \
  --time-limit 25s --output rel.trace --launch -- com.unsupervisedrock.strata
xcrun xctrace export --input rel.trace \
  --xpath '//trace-toc/run/data/table[@schema="potential-hangs"]'
```

Traces are off git, on the Mac at `~/strata-traces/` — `release-timeprofile.trace`
(5.1 MB) and `release-tp2.trace`. The progress sweep ran in a browser against
`npm start`, seeding `strata.solved` per chapter and counting `canvas.mw-spr` in a
same-origin iframe so one script could sweep every level without reloading.
