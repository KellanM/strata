# Do this next — the performance work, in order

2026-10-28, after four profiling passes on an iPhone 13 Pro Max. The evidence is in `perf/2026-10-28-*`; the issues carry the detail. **This file is the short version: what to do, in what order, and what not to bother with.**

## Update, later on 2026-10-28: #8 and #2 are in, waiting on the device

- **#8 / #9, the bench.** `perf.bench()` now ends every run with **`tap-start`**: back to the map (`strata.openMenu`), ease `.map-scroll` to the first open stone, pointerdown / 90 ms / pointerup / click, every frame for 5 s, reported as **`over100count`, `sumOver100`, `framesOver100`**. `intro` is unchanged (the direct `startPuzzle()`), so the history stays comparable. The autobench passes `{ fromMap: true }`, so every run's `intro` is a map start, and a run that isn't logs a `STRATA_BENCH_WARNING`. `context.save` and the layer census now pin the save state: stones solved, chapters reached, `canvas.mw-spr` and veil counts.
- **The browser regression measure is one command:** `node tools/veil-count.mjs` (WebKit, fresh save, 390×844; add `--shot f.png`, `--tap`, `DPR=3` or `SOLVED=n`).
- **#2, the fix.** Every veil except one that is lifting right now is drawn once into a few tall canvases (`MapWorld.flatten`, at most 2,048 px tall, cropped to the screen's width). A chapter whose cloud is parting still gets its ~150 separate billows, so `setPart`'s lift is unchanged. Fresh save, WebKit, 390×844:

  | | `canvas.mw-spr` | veil | layer-prone | sprite Mpx | predicted frozen on device |
  |---|---|---|---|---|---|
  | before | 2,222 | 2,063 | 2,248 | 51.0 | 3,344 ms (measured) |
  | `z += 120`, x step 300–400 (experiment, not kept) | 741 | 582 | 767 | 16.3 | ~1,110 ms |
  | **composited (shipped)** | **174** | **15** | **200** | **12.3** | **~290–480 ms** |

  The prediction comes from the linear fit, not from a measurement. 290 ms is the line; 476 ms is what the device measured at 209 prone layers, which sits above the line. A fresh save now carries fewer layer-prone elements than a player near the end did before. The veil looks the same: before and after differ by at most 3/255 at DPR 1, and by at most 5/255 inside the veil at DPR 3 (`perf/2026-10-28-veil/`). The experiment visibly thinned the veil's top edge, so it was not kept. Most of what remains are 80 ambient far-layer bands and ~80 bands at the feet of peaks. The ambient bands are the next lever if the device still shows a floor.
- **Next, on the Mac:** run an autobench and one hand-played level start on a fresh save, and read `tap-start`'s `sumOver100` against the 3,344 ms above. That is device verification, so #2 stays open until it's done.

## There is one defect

**Starting a level freezes the app's main thread for ~3.3 seconds on a new player's save.** Measured on the real path — scroll the map, tap a stone — as **four or five** separate frozen frames (1098 / 774 / 729 / 628 / 115 ms), not the two hand-play suggested. 96% of each hang is one call — `-[UIView _web_setSubviews:]` — tearing down the **2,222 off-screen `<canvas>` veil sprites** the map keeps for chapters not yet reached.

**The benchmark under-reports it by 4.8–6.5x**, because `perf.bench()` calls `startPuzzle()` directly and never taps a stone (#8). Every figure in the first four reports is the robot's number. Fix the bench before you trust a before/after.

**It fades as the player progresses, linearly.** The veil is built only for chapters not yet reached, so the sprite count falls ~147 per chapter solved: **2,222 canvases on a fresh save, 156 once the map is open** — 14x fewer. Measured across seven save states on device, the cost is **linear in the layer count: frozen = 3 ms + 1.441 ms per prone layer, R2 = 0.976** (3,344 ms at 2,247 layers down to 476 ms at 209). So halving the sprite count halves the time, and **one composited canvas per chapter (~45 layers) predicts ~70 ms — a 48x win**. The defect is at its worst in a player's first session and in the App Store reviewer's first minutes, and it heals itself as they play. The fresh-save count is the number a fix has to move, and it can be re-measured in a browser without a device.

*(An earlier draft of this file claimed the scaling was quadratic, from a four-point fit of the robot's `intro worst`. That was a max statistic over too narrow a range; the seven-point player-path sweep supersedes it. There is no superlinear bonus — the case for the fix is proportional.)*

Everything else found in four passes is small, is a decision for Kellan, or is already closed.

## Test 1 is done — the map work is unblocked

1. **[#12] Does the hang survive a Release build? Yes, unchanged.** Debug 689.66 ms vs **Release 688.60 ms** — a difference of **1.06 ms, 0.15%** — same stack, same leaves, same 96% in `-[UIView _web_setSubviews:]`. A 55 s Release pass over the whole bench still finds exactly one hang over 250 ms. **Every number in the four reports stands**, and the gate on the mist rewrite is lifted. In hindsight it could not have gone otherwise: 96% of the hang is in WebKit and UIKit, which ship optimised and identical in both configurations. Detail: [`perf/2026-10-28-release-vs-debug.md`](../perf/2026-10-28-release-vs-debug.md).
2. **[#12, still open] One map->level transition on the live web app**, https://kellanm.github.io/strata/, on the same phone. Ten seconds of someone's time. **Check the save state on both sides when you do** — if Safari has progress and the phone's save was fresh, "the web is flawless" may just be the progress curve above, not a difference between Safari and WKWebView at all.

**A Release build is mute**: Capacitor only forwards the page console in Debug (`CAPInstanceDescriptor.m:38`), so any Release measurement has to come from Instruments, never from `STRATA_BENCH`.

## Then the fix

3. **[#2] Cut the veil's element count.** *(Done in the browser, 2,222 → 174 sprites. See the update at the top; device verification is pending.)* Options and their costs are in the issue. Recommended path:
   - First, a **one-line experiment**: in `mapworld.js:393` change the veil loop's `z += 58` to `z += 120` and widen the x step. That roughly quarters the sprite count. **Prediction, from the measured linear fit: a player's frozen time falls from ~3,344 ms to ~810 ms, and the robot's `intro` from ~700 ms to ~175 ms.** Count `canvas.mw-spr` in a browser on a fresh save first: the fix is working if that 2,222 drops, and that check costs no device time.
   - If that holds, build the real fix: **one composited canvas per chapter** instead of ~150 sprites (2,222 → ~15). `.mw-wall` already carries most of the look; the cost is the per-lobe parallax in `veil.kids`.
4. **[#11] Find out why it is four or five long frames, not one.** If only one is fixed, a player still pays ~700 ms. It is **not** a DOM teardown — the canvases stay in place across a tap (2,413 before and after). The candidate is the staged hide: `.show`, `world-up` and `#map-world`'s display all change at ~520 ms, and `#menu` carries `transition: visibility 0s .5s`, so its visibility flips half a second later. **If the two commits can be coalesced into one frame, the cost may halve without touching the veil at all** — the cheapest win available, but it alters the dive, so the visual call is Kellan's.
5. **[#8] Make the bench measure a player's transition — do this before any before/after.** *(Done: `tap-start`, see the update at the top.)* Measured: the robot's direct `startPuzzle()` reports **4.8-6.5x less** than a player's real tap. A working probe (scroll `.map-scroll`, dispatch pointerdown/up/click on `[aria-label^="Puzzle "]`, log every frame over 100 ms) is written up in the issue and in `perf/2026-10-28-player-path-and-scaling.md`; port it as a `tap-start` segment, not as a redefined `intro`. **Report the count and the sum of long frames, never the max** - a max turns five frozen frames into one. Without this, a correct fix will look twice as good as it is. **[#9]** pin the save state in the census while in here, or two measurements will not be comparable.

## Kellan's decisions, not work

- **[#10]** Cold start is ~3.0 s and passes, but the app's own work ends at **340 ms** — 89% of the boot is `SPLASH_HOLD` holding deliberately. Shortening the studio card is the only lever.
- **[#3]** Whether the WebGL scene should go above 60 fps. The map's compositor-driven scroll **already reaches 118 fps**, so only the `requestAnimationFrame` path is capped. The GPU sits at minimum clock, so there is headroom; the argument against is battery, which is unmeasured.

## Closed — do not spend time here

| | why |
|---|---|
| Shader compilation | **33.7 ms** across a 45 s session; **0.49 ms** inside the hang. Three orders of magnitude out |
| GPU / fill rate / god rays / DPR 3 | GPU at **Minimum clock 99.3%** of the play window. Nothing is draw-bound |
| The reveal hitch (#1) | Closed. The 108–135 ms was the harness's burst completion; a player's reveal peaks at 61 ms |
| The per-tap AO rebuild | `chisel` has zero janks; the largest block is 630 cells |
| "`perf.js` overstates the frame rate" | My own false alarm. Clean hand-play presents 61.6 surfaces/s, peaking at 118 |
| Steady chiselling | 57 hitches in 80 s, median 16.7 ms, worst 50 ms, none over 100 ms. Confirmed by hand |

## Still unmeasured, and say so

**[#13]** Energy and Allocations cannot be read from the CLI on this setup. So **the idle battery target has no measurement**, and the veil's **~204 MiB is a calculation, not a measurement** — reproduced twice from pixel dimensions by two different methods, but never confirmed as retained memory. Don't put that number in a plan as fact.

**Whether the hang scales linearly with the sprite count** is also unknown. One device point gives 0.31 ms per sprite, which would put a finished player at ~48 ms — but that extrapolates from a single point through the origin, and hash-table growth is not linear. Confirming it needs a device run against a progressed save, and there is no way to seed one yet (the dev panel's unlock is web-only).

Also open: row clear, mark and peel still have no bench coverage (#6), and everything here is from **one device** — a 2,222-element teardown would hurt more on an iPhone 11 or SE 2.

## Working method

`docs/profiling.md` §"What works with xctrace" now records the tooling: use `--launch` not `--attach`, combine instruments in one recording, keep the phone unlocked, and resolve `ref=` compression when parsing exports. It cost three sessions to learn; start there.
