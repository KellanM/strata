# Profiling Strata on iPhone

Two sessions work on this together:
- **The Strata development session**, on Kellan's Windows PC, changes the game.
- **A Mac session** builds it in Xcode, runs it on a real iPhone, and measures.

They're on different machines, so **the repo is the channel**: the Mac pulls, measures, and commits results to `perf/`; the PC reads them, changes the game, and pushes. If both machines have Remote Control connected, `SendMessage` to `nonogram-cb` works too (HANDOFF.md §7b), but still commit the results.

## Targets (docs/launch-checklist.md §4)

**Turn Low Power Mode off before measuring, and say so in the report** (issue #4). It pins `requestAnimationFrame` to 30 fps and roughly doubles every hitch. On 2026-10-28 it silently turned a passing baseline into a failing one. Each `STRATA_BENCH` line now carries `power`: if `idle` p50 sits near 33 ms, the run is flagged `lowPowerSuspected` and a `STRATA_BENCH_WARNING` line is logged. Discard such a run. JS can't read the power state, so this is inferred from the frames.

- **60 fps while playing.** p95 frame time 16.7–17 ms, with no janks in `chisel`.
- **No hitch over 100 ms** after the studio card lifts.
- **Cold start under 4 s** from tapping the icon to the title.
- **Idle shouldn't burn battery:** see Energy in Instruments, segment `idle`.
- **Test devices:** an older iPhone (an 11 or SE 2) as well as a recent one, if both are available.

## The benchmark (built into the game, `public/js/perf.js`)

`strata.bench()` plays one level the same way every time: `maple-bonsai` by default. It resolves to a table with one row per segment:

| Segment | What happens |
|---|---|
| `intro` | the level's block assembles, the camera settles (3 s) |
| `chisel` | 40 steady taps, one every 120 ms, each breaking a cube that doesn't belong |
| `rotate` | a one-finger turn on the half-chiselled stone: 280 px out over 1.5 s and back, then 0.8 s of damping (issue #6) |
| `zoom` | a two-finger pinch: fingers 120 → 320 px apart over 1.5 s and back, then 0.8 s (issue #6) |
| `chisel-rest` | the same cadence down to the last cube (about 13 s on `maple-bonsai`) |
| `reveal` | **the player's completion:** the last cube alone, then the win, the whirl, the rays and the gems (6 s) |
| `idle` | nothing but the sky (5 s); also the Low Power Mode check |
| `restart` | the same stone started again, warm (3 s) |
| `reveal-burst` | **a stress case, not a player number:** every cube broken in one loop (about 100 in one frame), then the reveal (6 s). Skip it with `{ burst: false }` |

**How `rotate` and `zoom` are driven:** as touch pointer events dispatched on the game's canvas, so they go through the game's own pointer handler and OrbitControls (with its damping), as a finger does. Two details:
- The turn starts at a spot the game's hit test finds clear of the peel diamonds; a touch on a diamond peels instead of turning.
- `setPointerCapture` is a no-op during the gesture, because synthetic pointers can't be captured.

Checked in desktop Chrome: the turn moves the camera a quarter turn, the pinch zooms ×2.66 and back, and no cube is broken and no slip counted. Row clear, mark and peel segments are still to do.

**Why `reveal` and `reveal-burst` are separate** (issue #5, 2026-10-28): before this, `reveal` broke every remaining cube in one loop, and its 108–135 ms hitch on the iPhone may have been that harness artefact rather than something a player sees. Desktop Chrome, one run: `reveal` worst 33–50 ms, `reveal-burst` 150–167 ms. **Only the iPhone can settle #1.**

**The start context and a layer census** (issue #2): each run also records `context`:
- `from`: what was on screen when `startPuzzle()` ran (`level`, `lesson`, `title`, `map`). The bench doesn't start a level the way a player does, with a tap on the map's stone and its dive. On a fresh install, dismissing the title leads into the first lesson, so the first `startPuzzle()` replaces a lesson.
- `layersBefore` / `layersAfter`: `layerCensus()` on either side of `startPuzzle()`. This counts the on-screen elements whose style tends to give them a native layer (`will-change`, `backdrop-filter`, a 3D transform, a running animation, canvas/video), grouped by the nearest element with an id.
  - It's a proxy: JS can't see WebKit's real layer tree.
  - Desktop shows no change (19 of 188 rendered, both sides). If the iPhone's numbers jump, the `top` groups say where.
  - The census runs outside any measured segment. Call `strata.perf.layerCensus()` from Web Inspector at any time.

Each row shows fps, the p50/p95/p99 frame time in ms, the worst frame, and janks (frames over 34 ms).

**Options:** `strata.bench({ id: 'dragon-head', chisels: 40, gapMs: 120, burst: true })`.

**Other tools:**
- `strata.perf.mark('label')` starts your own segment; `strata.perf.report()` reads every segment.
- A live fps readout: `?perf` on the web, or `localStorage.setItem('strata.perf', '1')` and reload.

**Desktop Chrome baseline** (2026-10-27, Windows, GPU; for shape only, not a phone):

| Segment | fps | p95 | worst | janks |
|---|---|---|---|---|
| intro | 53.3 | 33.3 | 116.7 | 5 |
| chisel | 60 | 16.8 | 16.9 | 0 |
| reveal | 58.4 | 16.9 | 100.1 | 2 |
| idle | 59.8 | 16.8 | 33.2 | 0 |

**First leads:** a hitch as the block assembles, and one at the reveal. These are likely shader compiles or first-use GPU uploads. They are unconfirmed.

## On the Mac

1. `git pull`, `npm ci`, then `npm run build:app` (this runs `tools/ios-configure.mjs`). Open `ios/App/App.xcodeproj` in Xcode.
2. **Run a Debug build on the iPhone.** Debug builds make the web view inspectable, which Capacitor allows only in debug. Never ship a build made for profiling: upload only from the normal Release archive.
3. **The JavaScript side: Safari Web Inspector.**
   - Safari › Develop › [the iPhone] › Strata.
   - In the console: `await strata.bench()`, then copy the table.
   - For a hitch, record the **Timelines** tab (JavaScript & Events, Rendering Frames, and Screen if available) during a bench run. Find what runs inside the long frames.
4. **The native and GPU side: Instruments** (Product › Profile, or attach to the running app). Start the bench from Web Inspector while it records:
   - **Animation Hitches:** the frame drops the player sees.
   - **Time Profiler:** where the CPU time goes. Web content runs in a separate WebKit process (`com.apple.WebKit.WebContent`), so look there for JS and WebGL.
   - **Metal System Trace / GPU:** whether frames are GPU-bound, from fill rate, the god rays and DPR.
   - **Energy Log** (or Xcode's energy gauge) during `idle`.
   - **Allocations** across three or four levels in a row, to catch a leak.
5. **Cold start:** time from tapping the icon to the title three times, after force-quitting each time. For the game's own boot timeline, set the motion log on (`localStorage.setItem('strata.dev.motionlog', '1')`, then relaunch): `mark()` in `motion.js` lists each boot step on screen.

## Headless: the benchmark runs itself (no one at Web Inspector)

For a session that can't operate Safari or the Instruments window (added 2026-10-28, after the Mac's first report):

1. `STRATA_AUTOBENCH=3 npm run build:app` makes a **profiling build**.
   - About 4 s after launch it goes past the title by itself, waits, then runs `strata.bench()` 3 times.
   - It logs each result as one line: `STRATA_BENCH {json}` (run, device, DPR, viewport and the per-segment table), then `STRATA_BENCH_DONE`.
   - The build prints a loud warning. **Never upload it.** A plain `npm run build:app` removes it again, and `test/perf.test.js` checks that the flag never sits in the source page.
2. Install and launch the Debug build, and read the log. Capacitor passes the page's `console.log` to the native log in Debug builds, so either works:
   - launch with `xcrun devicectl device process launch --console --device <id> com.unsupervisedrock.strata` and keep stdout;
   - or stream the device log (e.g. `log stream` / Console.app filtered on `STRATA_BENCH`).
3. Record Instruments around it from the CLI: `xcrun xctrace record --template 'Animation Hitches' --device <id> --attach <pid> --time-limit 60s --output ~/strata-traces/…`. Repeat with Time Profiler and Metal System Trace, and use `xctrace export` to read the results.
4. Rebuild without the flag before anything else is built from that checkout.

In a desktop Chrome check, a fresh launch went through the title and ran the benchmark unattended, with no page errors.

## Cold start: boot milestones (issue #7)

The store app logs one `STRATA_BOOT <name> <ms>` line per milestone, in ms since the page started loading (`performance.now()`). On the web they appear only with `?perf`. The milestones:
- `js`: main.js running;
- `first-frame`;
- `map-built`;
- `splash-lifted`: the studio card goes;
- `title-interactive`: the title takes a tap.

Desktop Chrome: `js` 165, `first-frame` 975, `title-interactive` 2623 ms; the card holds for at least 2.6 s by design (`SPLASH_HOLD`).

**These times start when the web view begins loading the page, not at the icon tap.** For icon-to-title, add the native launch time from the device log (the process launch to Capacitor's `WebView loaded`).

**In a Release build, Capacitor doesn't forward the page's console by default** (`loggingBehavior` is `debug`). To read `STRATA_BOOT` from a Release cold start, set `"loggingBehavior": "production"` in `capacitor.config.json` for that measurement build only, and revert it.

## Reporting back

Commit one file per run to `perf/YYYY-MM-DD-<device>-<what>.md` containing:
- the device, iOS version, build (commit hash) and Debug/Release;
- the `strata.bench()` table;
- for each hitch: the segment, roughly when, how long, and what Web Inspector or Instruments shows inside it (the function names, the shader compile, layout or GC);
- Energy and Allocations notes;
- anything that looked or felt wrong on the phone.

Screenshots of Instruments are welcome (`perf/*.png`). Keep `.trace` files out of git, since they're large; note where they're kept on the Mac.

**Rules:**
- The Mac session doesn't change game code. It reports, and the PC session changes the game. The exception is a one-line diagnostic you revert and mention.
- Before pushing: `git pull --rebase`. Never force-push. Stage only your own files.
- Commit messages end with the attribution lines in HANDOFF.md §8.
- Visual trade-offs (lower DPR, fewer ray steps, a 30 fps idle cap) are Kellan's call. Report the cost and the gain; don't decide.
