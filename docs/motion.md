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
| `DUR.hold` 0.6 s | `var(--dur-hold)` | a named still beat between two moves |
| `DUR.ceremony` 1.2 s | `var(--dur-ceremony)` | once-per-chapter moments (the held chapter card) |
| `EASE.fade` | `var(--ease-fade)` | opacity and colour dissolves (the Next wash) |
| `BEAT` 0.833 s | — | one beat of the music (72 BPM): rhythmic UI such as the win's gems |

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
- **Never fade the parent of a blurred backdrop.** While an element's parent has
  opacity below 1, its `backdrop-filter` can't see the scene, so it shows
  everything sharp and then snaps the blur on when the fade ends. Fade the
  children and toggle the parent's `visibility` (see `#menu` in style.css).
- **Render on change.** Code that swaps the scene draws once immediately
  (`draw()` in `startPuzzle`), so the canvas never lags the page.
- **Quiet backdrops.** Anything set up behind something else (the block behind
  the map at launch) starts in its final state, silent.
- **Timers go through `after(seconds, fn)`, not `setTimeout`,** so slow motion
  slows them too. The scene clock `now()` in main.js is already scaled.
- **`pop` is for things that arrive by momentum** (a flick, a reveal, a gem
  landing), not for answering a tap: a pressed button or stone settles without
  overshoot (Apple, *Designing Fluid Interfaces*).
- **Don't make people wait for an animation they see every time:** a tap during
  the level-start assembly finishes it at once and counts.
- **Reduce Motion skips the animation, not the change.** Every effect checks
  `reduceMotion`.
- **Create hidden, then arm the transition.** An element that will fade in is
  created with its hidden class already on (`veiled-in`, `in-parting`), and its
  transition is armed a frame later. If an element is inserted visible and then
  set to opacity 0 along with a transition, any style flush in between (for
  example `getTotalLength()`) makes it animate 1 → 0 first. That was the path
  flash when the mist lifted.
- **No `body:has()` for state that changes during motion.** Set body classes in
  `frame()` instead. A `:has()` rule on body re-styles the whole document on
  every frame.

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
- **The map's world** (sky, mist, peaks; `docs/map-study.md`, Phase 2): mapworld.js.
  - **The descent** from the title: `DESCENT` in main.js, 1.5 s, or 0.8 s again in the same session.
  - **The mist lift:** `partCloud()` in map.js tweens `world.setPart` over `DUR.ceremony * 2` and reveals the hidden stones and trail.
  - **The canvas** fades out under the map (`body.map-up #scene`) and stops drawing after 0.6 s.
- **In-scene motion:**
  - the block assembly is in the `uIntro` shader in cubes.js;
  - the handles' pop is in handles.js `amount()`;
  - the chisel break is in fragments.js;
  - the win is `stepCelebration` in main.js and finale.js.

Older CSS still has some one-off curves. Move them onto the tokens when you
touch them.

Research behind these rules: `docs/motion-study.md`. Applied from it so far:
- the win spin settles on the object's map pose;
- Next washes through the next level's sky;
- a tap skips the assembly;
- the win buzz lands with the object;
- the gems fall on the beat;
- the portal is nested diamonds;
- a chapter's card is held before its first block;
- the map cascade plays once a session.
