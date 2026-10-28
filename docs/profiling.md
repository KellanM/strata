# Profiling Strata on iPhone

Two sessions work on this together:
- **The Strata development session**, on Kellan's Windows PC, changes the game.
- **A Mac session** builds it in Xcode, runs it on a real iPhone, and measures.

They're on different machines, so **the repo is the channel**: the Mac pulls, measures, and commits results to `perf/`; the PC reads them, changes the game, and pushes. If both machines have Remote Control connected, `SendMessage` to `nonogram-cb` works too (HANDOFF.md §7b), but still commit the results.

## Targets (docs/launch-checklist.md §4)

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
| `reveal` | the rest broken at once: the win, the whirl, the rays and the gems (6 s) |
| `idle` | nothing but the sky (5 s) |

Each row shows fps, the p50/p95/p99 frame time in ms, the worst frame, and janks (frames over 34 ms).

**Options:** `strata.bench({ id: 'dragon-head', chisels: 40, gapMs: 120 })`.

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
