# 2026-10-28 — what a player actually pays, and how it scales with the layer count

Fifth pass, and it answers two questions. Kellan watched a profiling run and said:
*"it doesn't look like the profiling is going to a level from the map, rather it
looks like it is just moving to it."* He was right, and it turns out the benchmark
has been under-reporting the defect by **five to six and a half times**. This pass
also measures the dose-response the earlier passes could only guess at.

- **Device:** KM — iPhone 13 Pro Max (iPhone14,3), iOS 26.6.1 (23G83), thermal Fair, Low Power Mode off.
- **Build:** `b0f5e92`, **Debug** (the console is needed; #12 established Debug and Release agree on this hang to 0.15%).
- **No tracked file changed.** Both sweeps ran from a diagnostic injected into `ios/App/App/public/index.html` — untracked staging that `cap sync` regenerates. Described in full at the end.

## 1. The benchmark measures the wrong thing

`perf.bench()` calls `strata.startPuzzle(e)` directly. The map is up, but **no stone
is ever tapped**, so the robot skips the hit test, the press ring, the 420 ms
long-press timer, `act()`, the save write and whatever the map's hide does on a real
activation. That is issue #8, and it is why the robot sees **one** ~700 ms hang where
a player gets several.

Measured side by side at the same save states — the robot's `intro` worst frame
against a player's **total** time in frames over 100 ms:

| prone layers | robot `intro` worst | player, total frozen | under-report |
|---|---|---|---|
| 2,247 | 700 ms | **3,344 ms** | **4.8x** |
| 2,123 | 645 ms | **3,239 ms** | **5.0x** |
| 1,826 | 408 ms | **2,545 ms** | **6.2x** |
| 1,480 | 281 ms | **1,826 ms** | **6.5x** |

**A new player pays about 3.3 seconds of frozen main thread to start their first
level**, in four or five separate long frames — not the 0.7 s every report before
this one said, and not the ~1.4 s of two hangs that hand-play suggested.

**On comparing those two columns fairly.** The left is a maximum, the right a sum,
which is not like-for-like — so the multiplier deserves a check. The robot's `intro`
reported **1-2 janks** (frames over 34 ms) at these same save states, against the
player's **4-5 frames over 100 ms**. So the robot genuinely encounters far fewer long
frames, and its total long-frame time cannot exceed roughly 700-750 ms. The
comparison holds on counts as well as on magnitude; it is not an artefact of the two
statistics.

A `worst` figure cannot represent this. Four frames of 1098 / 774 / 729 / 628 ms
reduce to a single "1098 ms", which is why the shape of the problem stayed hidden.
**Report the count and the sum, not the max.**

## 2. The player's level start, across save states

Seven cold launches, one per save state, each: boot, dismiss the title, scroll the
map, tap the first open stone, record every frame for 5 s.

| chapters solved | sprites | prone | rendered | tap→1st frame | frames > 100 ms | **frozen** |
|---|---|---|---|---|---|---|
| 0 | 2,222 | 2,247 | 3,125 | 729 ms | 1098, 774, 729, 628, 115 | **3,344 ms** |
| 1 | 2,094 | 2,123 | 3,398 | 713 ms | 1214, 713, 695, 617 | **3,239 ms** |
| 3 | 1,793 | 1,826 | 3,591 | 620 ms | 948, 620, 529, 448 | **2,545 ms** |
| 5 | 1,443 | 1,480 | 3,802 | 65 ms | 501, 431, 317, 298, 279 | **1,826 ms** |
| 8 | 1,036 | 1,079 | 4,117 | 54 ms | 527, 363, 314, 197, 179 | **1,580 ms** |
| 11 | 582 | 629 | 4,307 | 62 ms | 420, 219, 195 | **834 ms** |
| 14 | 156 | 209 | 4,583 | 476 ms | 476 | **476 ms** |

Two cross-checks worth recording. The device reports `sprites: 2222` on a fresh save
— **exactly** the count measured independently in a browser at a different viewport
in the fourth pass — and `layerProne: 2247`, so the 25-element difference is the
non-sprite layer-prone elements. And `rendered` *rises* with progress (3,125 →
4,583) while `prone` falls: solving chapters adds ordinary elements and removes
layer-prone ones, which is why the layer census, not the element count, is the
number that matters.

## 3. It scales linearly — I had this wrong earlier today

**`frozen = 3 ms + 1.441 ms per prone layer`, R² = 0.976.**

| prone | measured | fit | residual |
|---|---|---|---|
| 2,247 | 3,344 | 3,241 | +103 |
| 2,123 | 3,239 | 3,062 | +177 |
| 1,826 | 2,545 | 2,634 | −89 |
| 1,480 | 1,826 | 2,136 | −310 |
| 1,079 | 1,580 | 1,558 | +22 |
| 629 | 834 | 910 | −76 |
| 209 | 476 | 305 | +171 |

A power law fits the same points worse in linear space (residual sum of squares
**181,437** for linear-with-a-floor against **393,541**), so linear is the
better-supported model.

**Correcting the record.** Earlier today I fitted the robot's `intro worst` across
four points and reported a power law with exponent **2.26** — "cost grows as the
square of the layer count", and a prediction that quartering the sprites would take
the hang to ~31 ms. **That was wrong.** `intro worst` is a maximum over a single run,
the four points spanned only a factor of 1.5, and a max statistic falls faster than
the underlying cost. The seven-point player-path sweep spans a factor of 10.7,
measures a sum, and follows the path a player takes. Halving the sprite count halves
the time — proportionally, with no bonus and no penalty.

The same artefact produced a second claim of mine, that the robot-vs-player
multiplier growing from 4.8x to 6.5x implied "a second component that does not shrink
with the veil". With an intercept of ~3 ms there is no such large fixed cost; the
multiplier grew because the robot's max fell faster than the player's sum.

**What the fix is worth, on the linear model:**

| | prone layers | predicted frozen |
|---|---|---|
| today, a new player | 2,247 | 3,344 ms (measured) |
| half the sprites | 1,124 | ~1,620 ms |
| a quarter (the `z += 120` experiment) | 562 | ~810 ms |
| one composited canvas per chapter | ~45 | **~70 ms** |

So #2's recommended fix is worth roughly a **48x** reduction, from 3.3 s to under a
tenth of a second. That case rests on proportionality, not on a superlinear bonus.

## 4. Limits — read these before planning on the numbers

- **One run per save state.** No repeats, so each row carries unknown variance. The
  top of the range is trustworthy (690–703 ms has reproduced across six independent
  runs), the middle is single-sample.
- **The lowest point sits 171 ms above the line**, and it is a single 476 ms frame
  with `tap→1st frame` of 476 ms. A floor of a few hundred ms at low layer counts
  cannot be excluded from these data, and that is exactly the region a fix lands in.
  **Re-measure after the fix rather than trusting the ~70 ms extrapolation.**
- **`scrollWorst` is not a player's scroll.** The probe drives `scrollTop` from
  JavaScript; a finger scroll runs on the compositor. The 35–488 ms figures in the
  raw log are harness artefacts and say nothing about map scrolling, where the
  earlier 118 fps compositor measurement stands.
- **An app kill during the first sweep is unexplained.** Five page reloads in one
  process ended in `signal 9`. I first read that as jetsam over the map's canvases,
  but Kellan unplugged the phone around that time and `devicectl --console`
  terminates the launched process when its session drops. The two cannot be
  separated from what was captured, so **no memory conclusion is drawn** — #13's
  "unmeasured" still stands. The second sweep avoided reloads entirely by
  relaunching the app per level, which is the better method regardless.
- The tapped stone was `steps`, chapter I, at every save state — the first open
  stone. A fairer sweep would tap within the chapter the player is actually on.

## 5. Method, and the diagnostic in full

The save state sets the veil count, so the sweep had to vary it. Capacitor restores
saves from Preferences before the game reads a key, but `native.js:26` returns early
when localStorage already holds `strata.*` keys — so a seed written before
`start.js` wins without touching the game's logic.

The stone is reachable from the DOM: `map.js:490` attaches a plain `click` →
`opts.onPlay(n.entry, b)`, and the buttons carry `aria-label="Puzzle N"`, with
`aria-disabled="true"` when locked.

```js
const stone = [...document.querySelectorAll('[aria-label^="Puzzle "]')]
  .filter((b) => b.getAttribute('aria-disabled') !== 'true')[0];
const to = Math.max(0, stone.offsetTop - scroller.clientHeight * 0.45);   // .map-scroll
for (let s = 0; s <= 12; s++) { scroller.scrollTop += (to - scroller.scrollTop) * (s / 12); await sleep(40); }
stone.dispatchEvent(new PointerEvent('pointerdown', o));                   // o from getBoundingClientRect
await sleep(90);                                                           // a tap, not a long-press
stone.dispatchEvent(new PointerEvent('pointerup', o));
stone.dispatchEvent(new MouseEvent('click', o));
```

Frames come from a `requestAnimationFrame` log kept across the transition, reported
as every frame over 100 ms plus their count and sum. The probe also stubs the
Preferences plugin, so the phone's own saved game is neither read nor overwritten.

It needs no benchmark and no robot: boot, scroll, tap, record 5 s is about **20
seconds** per measurement against ~200 s for a full `perf.bench()`, which is what
makes sweeping save states affordable. The level index lives outside the `strata.`
prefix so it survives relaunch, and the runner relaunches the app per level so every
measurement comes from a cold process.

```sh
npm run build:app                                    # plain: no robot alongside
node tap-patch.mjs ios/App/App/public/index.html     # the probe, into untracked staging
xcodebuild -project ios/App/App.xcodeproj -scheme App -configuration Debug \
  -destination 'id=<udid>' -derivedDataPath <dd> -allowProvisioningUpdates build
xcrun devicectl device install app --device <udid> <dd>/.../Debug-iphoneos/App.app
# then, once per level:
xcrun devicectl device process launch --console --terminate-existing --device <udid> \
  com.unsupervisedrock.strata
```

This belongs in `perf.js` as a segment of its own (#8). Do **not** reuse the `intro`
name for it: every number in `perf/2026-10-28-*` is the direct-`startPuzzle` `intro`,
and redefining it would make the history incomparable. A separate `tap-start`
alongside it keeps both readable and makes the robot-vs-player gap a visible number
in every run.
