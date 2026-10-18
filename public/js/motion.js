// Motion: the one place timing and easing live, for CSS and JS alike, plus the
// developer tools for watching it. See docs/motion.md.
//
//   EASE / DUR      shared tokens; also written to :root as --ease-* / --dur-*
//   ease.out(k)     the same curves as JS functions, for three.js and canvas work
//   rate            1, or 0.25 in slow motion - multiply any clock by it
//   after(s, fn)    setTimeout in seconds that respects slow motion
//   mark(name)      note a step of a transition; shown in the motion log
//   reveal(...)     fade/rise elements in as they scroll into view

// Curves. Entering things decelerate (out), leaving things accelerate (in),
// things moving across the screen do both (inOut); pop overshoots and settles.
export const EASE = {
  out: [0.2, 0.8, 0.2, 1],
  in: [0.55, 0, 0.75, 0.2],
  inOut: [0.35, 0, 0.2, 1],         // starts promptly: a response to a tap must move at once
  pop: [0.2, 0.9, 0.3, 1.35],
  glide: [0.25, 1, 0.5, 1],          // long, soft arrival (camera-like moves)
  fade: [0.4, 0, 0.6, 1],            // opacity and colour dissolves (washes, veils)
};
// Durations in seconds: quick feedback, standard, slow, whole-scene changes.
// hold: a named still beat; ceremony: once-per-chapter moments.
export const DUR = { quick: 0.16, base: 0.3, slow: 0.5, scene: 0.7, hold: 0.6, ceremony: 1.2 };
// One beat of the music (audio.js plays at 72 BPM): rhythmic UI (the win's gems) lands on it.
export const BEAT = 60 / 72;

const DEV_SLOW = 'strata.dev.slowmo', DEV_LOG = 'strata.dev.motionlog';
export const slowMotion = localStorage.getItem(DEV_SLOW) === '1';
export const rate = slowMotion ? 0.25 : 1;
export const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// cubic-bezier as a function of progress k (0..1), like CSS
function bezier([x1, y1, x2, y2]) {
  const f = (a, b, t) => 3 * a * t * (1 - t) ** 2 + 3 * b * t * t * (1 - t) + t ** 3;
  return (k) => {
    if (k <= 0) return 0;
    if (k >= 1) return 1;
    let lo = 0, hi = 1, t = k;
    for (let i = 0; i < 24; i++) { t = (lo + hi) / 2; if (f(x1, x2, t) < k) lo = t; else hi = t; }
    return f(y1, y2, t);
  };
}
export const ease = Object.fromEntries(Object.entries(EASE).map(([k, v]) => [k, bezier(v)]));

// tokens into CSS
{
  const root = document.documentElement.style;
  for (const [k, v] of Object.entries(EASE)) root.setProperty(`--ease-${k}`, `cubic-bezier(${v.join(',')})`);
  for (const [k, v] of Object.entries(DUR)) root.setProperty(`--dur-${k}`, `${v}s`);
}

export const after = (seconds, fn) => setTimeout(fn, (seconds * 1000) / rate);

// ---- slow motion: every CSS transition and animation plays at `rate` too
if (slowMotion) {
  const slow = () => {
    for (const a of document.getAnimations()) if (a.playbackRate !== rate) a.playbackRate = rate;
    requestAnimationFrame(slow);
  };
  requestAnimationFrame(slow);
}

// ---- the motion log: a small on-screen list of named steps with their times,
// so a transition can be read on a phone without devtools
const logOn = localStorage.getItem(DEV_LOG) === '1';
let logEl = null, last = 0;
export function mark(name) {
  if (!logOn) return;
  if (!logEl) {
    logEl = document.createElement('ol');
    logEl.id = 'motion-log';
    document.body.appendChild(logEl);
  }
  const t = performance.now();
  const gap = last ? Math.round((t - last) * rate) : 0;
  last = t;
  const li = document.createElement('li');
  li.textContent = `${(t / 1000).toFixed(2)}  +${gap}ms  ${name}`;
  logEl.prepend(li);
  while (logEl.children.length > 14) logEl.lastChild.remove();
}

export const devFlags = {
  get slow() { return slowMotion; },
  get log() { return logOn; },
  toggle(which) {
    const key = which === 'slow' ? DEV_SLOW : DEV_LOG;
    localStorage.setItem(key, localStorage.getItem(key) === '1' ? '0' : '1');
    location.reload();
  },
};

// ---- scroll reveal. Elements matching `selector` inside `root` start hidden
// (class rv) and fade/rise in (class rv-in) as they enter `scroller`'s view,
// once. Those already in view when it starts cascade in, top to bottom.
export function reveal(root, selector, { scroller = null, stagger = 0.035, maxStagger = 0.4, instant = false } = {}) {
  const els = [...root.querySelectorAll(selector)];
  if (reduceMotion || instant || !('IntersectionObserver' in window)) return () => {};
  // jump straight to hidden (no transition): the elements may already have been
  // laid out visible, and would otherwise fade *out* first
  for (const el of els) { el.style.transition = 'none'; el.classList.add('rv'); }
  void root.offsetWidth;
  for (const el of els) el.style.transition = '';
  const io = new IntersectionObserver((entries) => {
    const coming = entries.filter((e) => e.isIntersecting).map((e) => e.target)
      .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
    coming.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * stagger, maxStagger)}s`;
      el.classList.add('rv-in');
      io.unobserve(el);
      // once in, drop the delay so later hovers and taps answer at once
      after(Math.min(i * stagger, maxStagger) + DUR.slow + 0.1, () => { el.style.transitionDelay = ''; el.classList.remove('rv', 'rv-in'); });
    });
  }, { root: scroller, rootMargin: '0px 0px -6% 0px', threshold: 0.01 });
  for (const el of els) io.observe(el);
  return () => io.disconnect();
}
