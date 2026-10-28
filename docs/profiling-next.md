# Do this next — the performance work, in order

2026-10-28, after three profiling passes on an iPhone 13 Pro Max. The evidence is in `perf/2026-10-28-*`; the issues carry the detail. **This file is the short version: what to do, in what order, and what not to bother with.**

## There is one defect

**Starting a level freezes the app's main thread for ~1.4 seconds.** Twice ~700 ms, back to back, on every level start from the map. 96% of each hang is one call — `-[UIView _web_setSubviews:]` — tearing down the **2,254 off-screen `<canvas>` veil sprites** the map keeps for chapters not yet reached. Worst for a new player, because the veil is largest when nothing is uncovered yet.

Everything else found in three passes is small, is a decision for Kellan, or is already closed.

## Two cheap tests before any code changes

Both can invalidate the plan, so they come first.

1. **[#12] Does the hang survive a Release build?** Every number so far came from a **Debug** build, which forwards the page console over the Capacitor bridge and marks the web view inspectable. Build Release + `STRATA_AUTOBENCH=1`, install, record `Time Profiler`, read `potential-hangs`. **Expect ~690 ms if the veil is the cause.** No human needed. The Release build is known to compile and sign.
2. **[#12] One map→level transition on the live web app**, https://kellanm.github.io/strata/, on the same phone. Kellan reports the web is flawless. If it stalls there too, the veil is the whole story. Ten seconds of someone's time.

**Do not rewrite the map's mist until test 1 has run.**

## Then the fix

3. **[#2] Cut the veil's element count.** Options and their costs are in the issue. Recommended path:
   - First, a **one-line experiment**: in `mapworld.js:393` change the veil loop's `z += 58` to `z += 120` and widen the x step. That roughly quarters the sprite count. **Prediction: the hang falls from ~700 ms to ~175 ms.** This is the only thing that tests the causal chain by changing it — everything so far is a matching stack plus a dose-response.
   - If that holds, build the real fix: **one composited canvas per chapter** instead of ~150 sprites (2,254 → ~15). `.mw-wall` already carries most of the look; the cost is the per-lobe parallax in `veil.kids`.
4. **[#11] Find out why it is two hangs, not one.** If only one is fixed, a player still pays ~700 ms. It is **not** a DOM teardown — the canvases stay in place across a tap (2,413 before and after). The candidate is the staged hide: `.show`, `world-up` and `#map-world`'s display all change at ~520 ms, and `#menu` carries `transition: visibility 0s .5s`, so its visibility flips half a second later. **If the two commits can be coalesced into one frame, the cost may halve without touching the veil at all** — the cheapest win available, but it alters the dive, so the visual call is Kellan's.
5. **[#8] Make the bench measure a player's transition.** Today only run 1 of a 3-run bench starts from the map, and the robot's direct `startPuzzle()` shows **one** hang where a player gets two — so **the bench reports about half the real cost**. Without this, a correct fix will look twice as good as it is. **[#9]** pin the save state in the census while in here, or two measurements will not be comparable.

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

**[#13]** Energy and Allocations cannot be read from the CLI on this setup. So **the idle battery target has no measurement**, and the veil's **~202 MiB is a calculation, not a measurement** — it has never been confirmed as retained memory. Don't put that number in a plan as fact.

Also open: row clear, mark and peel still have no bench coverage (#6), and everything here is from **one device** — a 2,254-element teardown would hurt more on an iPhone 11 or SE 2.

## Working method

`docs/profiling.md` §"What works with xctrace" now records the tooling: use `--launch` not `--attach`, combine instruments in one recording, keep the phone unlocked, and resolve `ref=` compression when parsing exports. It cost three sessions to learn; start there.
