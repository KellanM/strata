# Motion

Timing and easing live in one place: `public/js/motion.js`. It exports the
tokens to JS and writes them to `:root` as CSS custom properties, so a curve or
duration is changed once and every transition that uses it follows.

## Tokens

| token | CSS | use |
|---|---|---|
| `EASE.out` | `var(--ease-out)` | anything arriving: decelerates into place |
| `EASE.in` | `var(--ease-in)` | anything leaving: accelerates away |
| `EASE.inOut` | `var(--ease-inOut)` | moves across the screen (the portal) |
| `EASE.pop` | `var(--ease-pop)` | small things popping in, with a slight overshoot |
| `EASE.glide` | `var(--ease-glide)` | long, soft camera-like arrivals (map pull-back) |
| `DUR.quick` 0.16 s | `var(--dur-quick)` | taps, ticks, small feedback |
| `DUR.base` 0.3 s | `var(--dur-base)` | UI elements entering and leaving |
| `DUR.slow` 0.5 s | `var(--dur-slow)` | larger elements, scroll reveal |
| `DUR.scene` 0.7 s | `var(--dur-scene)` | whole-screen changes |

In JS, `ease.out(k)` etc. are the same curves as functions (0..1 → 0..1), for
three.js and canvas work.

## Rules

- **Enter with `out`, leave with `in`.** Leaving is faster than entering
  (roughly two thirds of the time).
- **One thing leads.** In a transition, one element moves first and the others
  follow it. Stagger is 30–90 ms per item and is capped, so long lists don't
  drag.
- **Cover before you swap.** Never change what's under a transition until the
  cover (veil, map, overlay) is fully opaque. This caused the old-level flash.
- **Render on change.** Code that swaps the scene draws once immediately
  (`draw()` in `startPuzzle`), so the canvas never lags the page.
- **Quiet backdrops.** Anything set up behind something else (the block behind
  the map at launch) starts in its final state, silent.
- **Timers go through `after(seconds, fn)`, not `setTimeout`,** so slow motion
  slows them too. The scene clock `now()` in main.js is already scaled.
- **Reduce Motion skips the animation, not the change.** Every effect checks
  `reduceMotion`.

## Developer tools (developer panel)

- **Slow motion ×4.** Everything runs at a quarter speed: CSS transitions and
  animations, the three.js scene clock, and `after()` timers. Sound is not
  slowed. The setting reloads the app and persists until turned off.
- **Motion log.** A small list in the corner of the screen. Each `mark(name)` call
  adds a line with its time and the gap since the previous step. Add a `mark()`
  at every step of a new transition. It costs nothing when the log is off.

## Where things are

- **Scroll reveal:** `reveal(root, selector, { scroller })` in motion.js. CSS
  classes `.rv` / `.rv-in` are at the end of style.css. Used on the map's stones
  and region names.
- **Map transitions** (the portal, pull-back and dissolve): `openMenu`, `closeMenu`
  and `diveInto` in main.js, with styles under `/* map -> level */` in
  style.css.
- **In-scene motion:**
  - the block assembly is in the `uIntro` shader in cubes.js;
  - the handles' pop is in handles.js `amount()`;
  - the chisel break is in fragments.js;
  - the win is `stepCelebration` in main.js and finale.js.

Older CSS still has some one-off curves. Move them onto the tokens when you
touch them.

Research for the next round of motion work is in `docs/motion-study.md`.
