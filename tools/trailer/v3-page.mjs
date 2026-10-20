// Trailer v3's page helpers. pageHelpers is stringified and injected into both
// capture passes, so it must not reach outside itself. cfg: { badges }.
export function pageHelpers(cfg) {
  const $ = (s) => document.querySelector(s);
  const H = (window.__trailer = {});
  let audio = null;
  H.audioModule = (m) => { audio = m; };
  const FONT = '"Avenir Next", Avenir, Futura, "Century Gothic", "Segoe UI", sans-serif';

  const css = [
    '.hud, #install, #actions, #coach, #press-ring, #map-close, #map-help, #map-journal, #lantern, #journal-close, #journal-back { display: none !important; }',
    // the game's layers blur together on a cut; the trailer's own overlays (.tr) stay sharp
    'body > :not(.tr) { transform-origin: 50% 45%; }',
    'body.tr-blur > :not(.tr) { filter: blur(14px) brightness(1.12) saturate(1.1); transform: scale(1.07); }',
    // only while a cut runs: its own transition wins over the layers' (their opacity changes land at once, under the blur)
    'body.tr-cutting > :not(.tr) { transition: filter var(--trd) var(--tre), transform var(--trd) var(--tre) !important; }',
    '.tr { pointer-events: none; }',
    '#tr-dip { position: fixed; inset: 0; z-index: 50; opacity: 0; transition: opacity .15s linear; }',
    // kinetic captions: each letter blurs and rises in, staggered; they leave upward, blurring out
    '.tr-cap { position: fixed; left: 0; right: 0; z-index: 40; text-align: center; font-family: ' + FONT + '; text-transform: uppercase; white-space: nowrap; }',
    '.tr-cap .w { display: inline-block; }',
    '.tr-cap .c { display: inline-block; opacity: 0; filter: blur(7px); transform: translateY(.45em) scale(1.25);',
    '  transition: opacity .32s ease-out, filter .42s ease-out, transform .55s cubic-bezier(.2,.9,.25,1.15); transition-delay: calc(var(--k) * 34ms); }',
    '.tr-cap.on .c { opacity: 1; filter: none; transform: none; }',
    '.tr-cap.out .c { opacity: 0; filter: blur(9px); transform: translateY(-.35em) scale(.96); transition-duration: .22s, .22s, .26s; transition-delay: calc(var(--k) * 12ms); }',
    // Saturday's ad (trailer/reference/saturday-ad-15s.mp4): bold, wide-tracked, white with a dark glow; REVEAL in gold
    '.tr-cap .ln { display: block; }',
    '.tr-cap.verb { font-weight: 700; font-size: 72px; letter-spacing: .14em; padding-left: .14em; line-height: 1.1; }',
    '.tr-cap.say { font-weight: 700; font-size: 50px; letter-spacing: .15em; padding-left: .15em; line-height: 1.32; }',
    '.tr-cap.ink, .tr-cap.light { color: #fffaf3; text-shadow: 0 3px 18px rgba(42,14,34,.72), 0 0 3px rgba(42,14,34,.55), 0 0 34px rgba(42,14,34,.35); }',
    '.tr-cap.gold { text-shadow: none; filter: drop-shadow(0 0 2px rgba(42,14,34,.6)) drop-shadow(0 3px 12px rgba(42,14,34,.65)); }',
    '.tr-cap.gold .c { background: linear-gradient(180deg, #fff1bd 0%, #ffd36d 48%, #eaa53b 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }',
    // the wall's count: big gold numerals with a +, and PUZZLES under them
    '.tr-cap.num { top: 33%; font-weight: 700; font-size: 140px; letter-spacing: .02em; line-height: 1; animation: trNumIn .35s ease-out both; }',
    '@keyframes trNumIn { from { opacity: 0; filter: blur(10px); } }',
    '.tr-cap.numsub { top: 51.2%; font-weight: 700; font-size: 42px; letter-spacing: .3em; padding-left: .3em; color: #fffaf3; text-shadow: 0 2px 14px rgba(20,8,24,.7); }',
    // where on screen: all inside the safe box shared by TikTok, Reels and Shorts (y 15%-64.5%, x 11%-81%)
    '.tr-cap.low { top: 56%; } .tr-cap.up { top: 16%; }',
    // a finger: where a tap lands, a ring blooms; a drag carries a soft dot
    '.tr-touch { position: fixed; z-index: 45; width: 58px; height: 58px; margin: -29px 0 0 -29px; border-radius: 50%;',
    '  border: 3px solid rgba(255,255,255,.97); background: radial-gradient(circle, rgba(255,255,255,.7), rgba(255,255,255,.18) 58%, rgba(255,255,255,0) 70%);',
    '  box-shadow: 0 0 16px rgba(255,255,255,.8), 0 0 0 1px rgba(50,36,72,.28), inset 0 0 0 1px rgba(50,36,72,.18); animation: trTouch .55s cubic-bezier(.2,.7,.3,1) forwards; }',
    '@keyframes trTouch { 0% { transform: scale(.5); opacity: 1; } 40% { opacity: 1; } 100% { transform: scale(1.5); opacity: 0; } }',
    '#tr-finger { position: fixed; z-index: 45; width: 54px; height: 54px; margin: -27px 0 0 -27px; border-radius: 50%; opacity: 0; transition: opacity .15s linear;',
    '  border: 3px solid rgba(255,255,255,.95); background: radial-gradient(circle, rgba(255,255,255,.85), rgba(255,255,255,.3) 60%, rgba(255,255,255,0) 72%);',
    '  box-shadow: 0 0 18px rgba(255,255,255,.7), 0 0 0 1px rgba(50,36,72,.28); }',
    '#tr-finger.on { opacity: 1; }',
    // no tagline anywhere (brief 2): not under the title, not in the map's head
    '#title .sub, #menu .map-head p.sub:not(#map-progress) { display: none !important; }',
    // the end: the title's own words and hint go as the CTA comes in over its blurred sky
    'body.tr-cta #title h1, body.tr-cta #title .tap { opacity: 0 !important; transition: opacity .25s linear !important; }',
    // under COLLECT / THEM ALL, the settled object's one-line story steps aside (its name stays), so the words don't collide
    'body.tr-nostory #win-title .story { opacity: 0 !important; }',
    // v4: the whole name card steps aside under COLLECT / THEM ALL (v3's review: the name stacked on the caption)
    'body.tr-noname #win-title { opacity: 0 !important; transition: opacity .15s linear !important; }',
    // v4: Saturday's weight - heavier and a touch bigger than v3's (a hairline stroke thickens the bold face)
    '.tr-cap.heavy { -webkit-text-stroke: .035em currentColor; }',
    '.tr-cap.heavy.say { font-size: 54px; letter-spacing: .13em; padding-left: .13em; }',
    '.tr-cap.heavy.verb { font-size: 76px; letter-spacing: .12em; padding-left: .12em; }',
    '.tr-cap.heavy.gold .c { -webkit-text-stroke: 0; }',
    // v4b's living end card (#tr-live): Saturday's darkening and PLAY NOW pulse, measured from
    // trailer/reference/saturday-ad-15s.mp4 (docs/trailer-study.md, v4b), plus slow light
    '#tr-live { position: fixed; inset: 0; z-index: 45; pointer-events: none; opacity: 0; transition: opacity .42s cubic-bezier(.3,.7,.4,1);',
    '  -webkit-backdrop-filter: blur(13px); backdrop-filter: blur(13px);',
    '  background: radial-gradient(ellipse 70% 46% at 50% 44%, rgba(46,24,58,.24), rgba(24,13,36,.62) 60%, rgba(14,8,22,.80)); }',
    '#tr-live.on { opacity: 1; }',
    // a second, slower vignette: the edges keep sinking for a beat after the card is up
    '#tr-live .vig { position: absolute; inset: 0; background: radial-gradient(ellipse 62% 40% at 50% 46%, rgba(0,0,0,0) 55%, rgba(8,4,14,.32)); opacity: 0; transition: opacity 1.2s ease-out .3s; }',
    '#tr-live.on .vig { opacity: 1; }',
    // a warm bloom behind the button that breathes with it
    '#tr-live .bloom { position: absolute; left: 50%; top: 51%; width: 520px; height: 260px; margin: -130px 0 0 -260px; border-radius: 50%;',
    '  background: radial-gradient(ellipse, rgba(255,206,120,.30), rgba(255,190,110,.10) 45%, rgba(255,190,110,0) 70%); opacity: 0; transition: opacity .6s ease-out .7s; }',
    '#tr-live.on .bloom { opacity: 1; animation: trBloom 1.1s ease-in-out 1.1s infinite; }',
    '@keyframes trBloom { 0%, 100% { transform: scale(1); opacity: .75; } 50% { transform: scale(1.12); opacity: 1; } }',
    '#tr-live > .el { position: absolute; left: 0; right: 0; text-align: center; }',
    '#tr-live h1 { top: 30.4%; margin: 0; font-family: ' + FONT + '; font-weight: 400; font-size: 58px; line-height: 1; letter-spacing: .42em; padding-left: .42em; color: #fff; text-shadow: 0 2px 16px rgba(20,8,24,.5), 0 0 30px rgba(255,220,170,.18); }',
    '#tr-live h1 span { display: inline-block; opacity: 0; filter: blur(8px); transform: translateY(6px); transition: opacity .3s ease-out, filter .4s ease-out, transform .5s cubic-bezier(.2,.8,.3,1); transition-delay: calc(.3s + var(--k) * 55ms); }',
    '#tr-live.on h1 span { opacity: 1; filter: none; transform: none; }',
    '#tr-live .gem { top: 41.6%; width: 14px; height: 20px; margin: 0 auto; opacity: 0; transform: scale(.6); transition: opacity .25s .55s, transform .45s cubic-bezier(.2,.9,.3,1.4) .55s; filter: drop-shadow(0 0 6px rgba(255,214,130,.8)); }',
    '#tr-live.on .gem { opacity: 1; transform: none; }',
    // PLAY NOW: pops in from 114% (Saturday: 117% -> 100% over ~0.3 s), then breathes 100% <-> 106% every 1.1 s, its glow with it, and a slow shine crosses it
    '#tr-live .play { top: 46.8%; left: 50%; right: auto; width: 336px; height: 80px; margin-left: -168px; opacity: 0; filter: blur(8px); transform: scale(1.14);',
    '  transition: opacity .22s ease-out .73s, filter .3s ease-out .73s, transform .34s cubic-bezier(.2,.8,.3,1) .73s; }',
    '#tr-live.on .play { opacity: 1; filter: none; transform: none; }',
    '#tr-live .pill { width: 100%; height: 100%; border-radius: 40px; box-sizing: border-box; position: relative; overflow: hidden;',
    '  background: linear-gradient(180deg, #fee8a4, #f7c867 55%, #f1b24c); box-shadow: 0 0 0 2.5px rgba(255,236,206,.42), 0 8px 26px rgba(20,6,20,.35), 0 0 22px rgba(255,206,120,.30);',
    '  display: grid; place-items: center; font: 700 26px/1 ' + FONT + '; letter-spacing: .32em; padding-left: .32em; color: #3b2142; }',
    '#tr-live.on .pill { animation: trPulse 1.1s ease-in-out 1.1s infinite; }',
    '@keyframes trPulse { 0%, 100% { transform: scale(1); box-shadow: 0 0 0 2.5px rgba(255,236,206,.42), 0 8px 26px rgba(20,6,20,.35), 0 0 22px rgba(255,206,120,.30); }',
    '  50% { transform: scale(1.06); box-shadow: 0 0 0 2.5px rgba(255,240,214,.6), 0 10px 30px rgba(20,6,20,.35), 0 0 44px rgba(255,212,130,.62); } }',
    '#tr-live .pill::after { content: ""; position: absolute; top: -20%; bottom: -20%; width: 38%; left: -45%; transform: skewX(-18deg);',
    '  background: linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.55), rgba(255,255,255,0)); opacity: 0; }',
    '#tr-live.on .pill::after { animation: trShine 2.2s ease-in-out 1.45s infinite; }',
    '@keyframes trShine { 0% { left: -45%; opacity: 0; } 3% { opacity: 1; } 23% { left: 115%; opacity: 1; } 24%, 100% { left: 115%; opacity: 0; } }',
    // one soft ring of light from the button, once (the calm stand-in for the casual ads' tapping hand)
    '#tr-live .ripple { position: absolute; inset: 0; border-radius: 40px; box-shadow: 0 0 0 2px rgba(255,230,170,.75), 0 0 18px rgba(255,214,130,.5); opacity: 0; }',
    '#tr-live.on .ripple { animation: trRipple 1.1s cubic-bezier(.2,.7,.3,1) 1.25s 1 both; }',
    '@keyframes trRipple { 0% { opacity: 0; transform: scale(1); } 15% { opacity: .9; } 100% { opacity: 0; transform: scale(1.32, 1.6); } }',
    '#tr-live .row { top: 57.3%; display: flex; justify-content: center; align-items: center; gap: 22px; opacity: 0; filter: blur(8px); transform: translateY(10px); transition: opacity .3s ease-out 1.03s, filter .35s ease-out 1.03s, transform .45s cubic-bezier(.2,.8,.3,1) 1.03s; }',
    '#tr-live.on .row { opacity: 1; filter: none; transform: none; }',
    '#tr-live .apple { height: 64px; display: block; }',
    '#tr-live .google { height: 95.2px; display: block; margin: -15.6px -18.2px; }',
    // dust motes rising through the light (the game's own motes, made visible over the veil)
    '#tr-live .mote { position: absolute; width: var(--s); height: var(--s); border-radius: 50%; background: radial-gradient(circle, rgba(255,240,200,.95), rgba(255,220,150,0) 70%);',
    '  left: var(--x); top: var(--y); opacity: 0; animation: trMote var(--d) linear var(--w) infinite; }',
    '@keyframes trMote { 0% { opacity: 0; transform: translate(0, 0); } 20% { opacity: var(--o); } 80% { opacity: var(--o); } 100% { opacity: 0; transform: translate(var(--dx), -70px); } }',
    // Saturday's 100+ wall: a dark plum field of object tiles, tilted a touch, drifting down
    '#tr-wall { position: fixed; inset: 0; z-index: 38; overflow: hidden; opacity: 0; transition: opacity .2s linear;',
    '  background: radial-gradient(ellipse 80% 60% at 50% 45%, #3f2340, #2a1631 60%, #1d1023); }',
    '#tr-wall.on { opacity: 1; }',
    '#tr-wall .grid { position: absolute; left: -64px; top: -260px; width: 680px; display: grid; grid-template-columns: repeat(5, 116px); gap: 12px; transform: rotate(-3deg); }',
    '#tr-wall.on .grid { animation: trWallDrift 3s linear both; }',
    '@keyframes trWallDrift { from { translate: 0 0; } to { translate: 0 34px; } }',
    '#tr-wall .tile { width: 116px; height: 116px; border-radius: 18px; background: rgba(255,255,255,.07); box-shadow: inset 0 0 0 1px rgba(255,255,255,.06), 0 4px 10px rgba(0,0,0,.18); display: grid; place-items: center; }',
    '#tr-wall .tile img { width: 104px; height: 104px; }',
    '#tr-wall::after { content: ""; position: absolute; inset: 0; background: radial-gradient(ellipse 70% 55% at 50% 45%, rgba(29,16,35,0), rgba(18,8,22,.32)); }',
    // Saturday's end card: a warm plum veil over the blurred scene; STRATA, the gem, PLAY NOW, the badges
    '#tr-end { position: fixed; inset: 0; z-index: 45; pointer-events: none; opacity: 0; transition: opacity .45s ease;',
    '  -webkit-backdrop-filter: blur(16px); backdrop-filter: blur(16px);',
    // (Kellan: the end starts on the map, scrolls up to the title, which blurs under the CTA - not the reference's plum stone)
    '  background: radial-gradient(ellipse 75% 50% at 50% 45%, rgba(40,24,62,.18), rgba(24,14,40,.42) 62%, rgba(14,8,26,.62)); }',
    '#tr-end.on { opacity: 1; }',
    '#tr-end > * { position: absolute; left: 0; right: 0; text-align: center; }',
    '#tr-end h1 { top: 30.4%; margin: 0; font-family: ' + FONT + '; font-weight: 400; font-size: 58px; line-height: 1; letter-spacing: .42em; padding-left: .42em; color: #fff; text-shadow: 0 2px 14px rgba(20,8,24,.35); }',
    '#tr-end h1 span { display: inline-block; opacity: 0; filter: blur(8px); transition: opacity .35s ease-out, filter .45s ease-out; transition-delay: calc(.12s + var(--k) * 60ms); }',
    '#tr-end.on h1 span { opacity: 1; filter: none; }',
    '#tr-end .gem { top: 41.6%; width: 14px; height: 20px; margin: 0 auto; opacity: 0; transition: opacity .3s .55s; }',
    '#tr-end.on .gem { opacity: 1; }',
    '#tr-end .play { top: 46.8%; left: 50%; right: auto; width: 336px; height: 80px; margin-left: -168px; border-radius: 40px; box-sizing: border-box;',
    '  background: linear-gradient(180deg, #fee8a4, #f7c867 55%, #f1b24c); box-shadow: 0 0 0 2.5px rgba(255,236,206,.42), 0 8px 26px rgba(20,6,20,.35);',
    '  display: grid; place-items: center; font: 700 26px/1 ' + FONT + '; letter-spacing: .32em; padding-left: .32em; color: #3b2142;',
    '  opacity: 0; filter: blur(10px); transform: scale(.94); transition: opacity .35s ease-out .62s, filter .4s ease-out .62s, transform .5s cubic-bezier(.2,.9,.25,1.2) .62s; }',
    '#tr-end.on .play { opacity: 1; filter: none; transform: none; }',
    '#tr-end .row { top: 57.3%; display: flex; justify-content: center; align-items: center; gap: 22px; opacity: 0; filter: blur(8px); transition: opacity .35s ease-out .86s, filter .4s ease-out .86s; }',
    '#tr-end.on .row { opacity: 1; filter: none; }',
    '#tr-end .apple { height: 64px; display: block; }',
    // the Play badge's artwork carries its own clear space: the badge itself is 168/250 of the image
    '#tr-end .google { height: 95.2px; display: block; margin: -15.6px -18.2px; }',
    // v1's caption, exactly (font, tracking, ink, its fade and rise), for the 100+ puzzles wall
    '#tr-cap1 { position: fixed; left: 0; right: 0; top: 71%; z-index: 40; text-align: center; pointer-events: none;',
    'font: 500 17px/1.45 "Avenir Next", Avenir, Futura, "Century Gothic", "Segoe UI", sans-serif;',
    'letter-spacing: .34em; text-transform: uppercase; padding: 0 24px;',
    'opacity: 0; transform: translateY(8px); transition: opacity .5s ease, transform .7s cubic-bezier(.2,.8,.2,1); }',
    '#tr-cap1.on { opacity: 1; transform: none; }',
    '#tr-cap1.ink { color: #4a3d63; text-shadow: 0 0 18px rgba(255,250,240,.9); }',
    '#tr-cap1.high { top: 64.5%; }',
    // ...but inside the platforms' safe box (v1's 64.5% and 71% sit in the bottom 35% that their UI covers)
    '#tr-cap1.safe { top: 57%; }',
    // a soft shade behind a big line over a busy picture (the wall)
    '#tr-shade { position: fixed; inset: 0; z-index: 39; opacity: 0; transition: opacity .3s ease; background: radial-gradient(ellipse 70% 30% at 50% 50%, rgba(36,24,52,.55), rgba(36,24,52,.18) 70%, rgba(36,24,52,0)); }',
    '#tr-shade.on { opacity: 1; }',
  ].join('\n');
  const style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);
  const el = (id) => { const e = document.createElement('div'); e.id = id; e.className = 'tr'; document.body.appendChild(e); return e; };
  const dip = el('tr-dip');
  const finger = el('tr-finger');
  const shade = el('tr-shade');
  H.shade = (on) => shade.classList.toggle('on', !!on);
  const end = el('tr-end');
  end.innerHTML = '<h1>' + [...'STRATA'].map((ch, k) => '<span style="--k:' + k + '">' + ch + '</span>').join('') + '</h1>'
    + '<svg class="gem" viewBox="0 0 12 16"><path d="M6 0 0 8l6 8z" fill="#fff2c2"/><path d="M6 0l6 8-6 8z" fill="#e9b949"/></svg>'
    + '<div class="play">PLAY NOW</div>'
    + '<div class="row"><img class="apple" src="' + cfg.badges.apple + '"><img class="google" src="' + cfg.badges.google + '"></div>';
  const wall = el('tr-wall');
  // v4b's living end card
  const live = el('tr-live');
  let seedM = 11; const rm = () => (seedM = (seedM * 16807) % 2147483647) / 2147483647;
  live.innerHTML = '<div class="vig"></div><div class="bloom"></div>'
    + Array.from({ length: 18 }, () => '<i class="mote" style="--x:' + (6 + rm() * 88).toFixed(1) + '%;--y:' + (12 + rm() * 80).toFixed(1) + '%;--s:' + (2 + rm() * 3.5).toFixed(1) + 'px;--d:' + (3.2 + rm() * 2.6).toFixed(2) + 's;--w:' + (-rm() * 4).toFixed(2) + 's;--o:' + (0.35 + rm() * 0.5).toFixed(2) + ';--dx:' + ((rm() - 0.5) * 30).toFixed(0) + 'px"></i>').join('')
    + '<h1 class="el">' + [...'STRATA'].map((ch, k) => '<span style="--k:' + k + '">' + ch + '</span>').join('') + '</h1>'
    + '<svg class="el gem" viewBox="0 0 12 16"><path d="M6 0 0 8l6 8z" fill="#fff2c2"/><path d="M6 0l6 8-6 8z" fill="#e9b949"/></svg>'
    + '<div class="el play"><div class="ripple"></div><div class="pill">PLAY NOW</div></div>'
    + '<div class="el row"><img class="apple" src="' + cfg.badges.apple + '"><img class="google" src="' + cfg.badges.google + '"></div>';
  const cap1 = el('tr-cap1');

  // every caption's laid-out box (untransformed), in % of the frame, for the safe-zone check
  const measure = (c, text) => {
    const r = [...c.querySelectorAll('.w')].map((w) => w.getBoundingClientRect());
    if (!r.length) return;
    const box = { text: String(text), x0: Math.min(...r.map((q) => q.left)) / innerWidth * 100, x1: Math.max(...r.map((q) => q.right)) / innerWidth * 100,
      y0: Math.min(...r.map((q) => q.top)) / innerHeight * 100, y1: Math.max(...r.map((q) => q.bottom)) / innerHeight * 100 };
    for (const k of ['x0', 'x1', 'y0', 'y1']) box[k] = +box[k].toFixed(1);
    (window.__caps = window.__caps || []).push(box);
  };
  H.measureEnd = () => {
    const r = [...end.querySelectorAll('h1 span, .gem, .play, img')].map((e) => e.getBoundingClientRect());
    (window.__caps = window.__caps || []).push({ text: 'END CARD (Saturday)', x0: +(Math.min(...r.map((q) => q.left)) / innerWidth * 100).toFixed(1), x1: +(Math.max(...r.map((q) => q.right)) / innerWidth * 100).toFixed(1),
      y0: +(Math.min(...r.map((q) => q.top)) / innerHeight * 100).toFixed(1), y1: +(Math.max(...r.map((q) => q.bottom)) / innerHeight * 100).toFixed(1) });
  };
  // v1's caption (the wall's): one line that fades and rises in
  H.capV1 = (text, tone) => {
    if (!text) { cap1.classList.remove('on'); return; }
    cap1.textContent = text; cap1.className = 'tr ' + tone; void cap1.offsetWidth; cap1.classList.add('on');
    const rg = document.createRange(); rg.selectNodeContents(cap1); const b = rg.getBoundingClientRect();
    (window.__caps = window.__caps || []).push({ text, x0: +(b.left / innerWidth * 100).toFixed(1), x1: +(b.right / innerWidth * 100).toFixed(1), y0: +(b.top / innerHeight * 100).toFixed(1), y1: +(b.bottom / innerHeight * 100).toFixed(1) });
  };
  // ---- captions (two slots: a main line, and a second line under it)
  const slots = { a: [], b: [] };
  const setCap = (slot, text, cls) => {
    for (const c of slots[slot]) { c.classList.remove('on'); c.classList.add('out'); const old = c; setTimeout(() => old.remove(), 700); }
    slots[slot] = [];
    if (!text) return null;
    const c = document.createElement('div');
    c.className = 'tr tr-cap ' + cls;
    let k = 0;
    // '|' breaks a line, as Saturday's two-line captions
    c.innerHTML = String(text).split('|').map((line) => '<span class="ln">' + line.split(' ').map((w) => '<span class="w">' + [...w].map((ch) => '<span class="c" style="--k:' + (k++) + '">' + ch + '</span>').join('') + '</span>').join('<span class="c" style="--k:0">&nbsp;</span>') + '</span>').join('');
    document.body.appendChild(c);
    void c.offsetWidth;
    c.classList.add('on');
    slots[slot].push(c);
    measure(c, text);
    return c;
  };
  H.cap = (text, cls) => setCap('a', text, cls);
  H.cap2 = (text, cls) => setCap('b', text, cls);
  H.capClear = () => { setCap('a', null); setCap('b', null); };
  // a number that counts up to `to`, with its + all the way (the wall: 21+, 50+ ... 100+)
  H.count = (to, secs, cls) => {
    const c = setCap('a', '0', cls), t0 = performance.now();
    const tick = () => {
      const k = Math.min(1, (performance.now() - t0) / (secs * 1000));
      const n = Math.round(to * (1 - Math.pow(1 - k, 3)));
      const s = n + '+';
      if (c.dataset.s !== s) { c.dataset.s = s; c.innerHTML = [...s].map((ch) => '<span class="c" style="--k:0">' + ch + '</span>').join(''); }
      if (k < 1) requestAnimationFrame(tick);
    };
    tick();
  };

  // v4: the same count, with the game's own score-tick voice under it (main.js showResult ->
  // sound.tick / tickDone, louder for the ad's mix). Each tick is scheduled on the audio
  // clock at the frame its number first shows (frame n of the count shows v(n + 1), so
  // v(n) is on screen from n - 1 frames after the action); a tick only when the number
  // changes, so they run fast while it rolls and thin out as it lands; a bell and a soft
  // body land the 100+.
  H.countRoll = (to, secs, cls) => {
    H.count(to, secs, cls);
    if (!audio || !audio.sound.ctx) return;
    const s = audio.sound, t0 = s.now, F = 1 / 30;
    const v = (n) => Math.round(to * (1 - Math.pow(1 - Math.min(1, n * F / secs), 3)));
    let k = 0, last = v(0), lastAt = t0;
    for (let n = 1; n * F <= secs + F; n++) {
      const x = v(n);
      if (x === last) continue;
      last = x;
      const at = lastAt = t0 + Math.max(0, (n - 1) * F);
      if (x === to) break;                 // the landing gets the bell, not a tick
      s.tone(s.degree(Math.min(k, 14), s.key.root + 36), { at, type: 'sine', gain: 0.075, decay: 0.035, detune: k % 2 ? 5 : -5 });
      s.noise({ at, dur: 0.006, gain: 0.05, freq: 5200, q: 2 });
      k++;
    }
    const land = lastAt;                   // the frame 100+ first shows
    s.fmBell(s.key.root + 48, { at: land, gain: 0.16, decay: 1.6, index: 2 });
    s.fmBell(s.key.root + 36 + 7, { at: land + 0.04, gain: 0.08, decay: 1.4 });
    s.tone(s.key.root + 12, { at: land, type: 'sine', gain: 0.2, decay: 0.26, partial: 2, partialGain: 0.2 });
    window.__rollTicks = k;
  };

  // ---- cuts
  H.dip = (color, secs) => { dip.style.transition = 'opacity ' + secs + 's linear'; dip.style.background = color; dip.style.opacity = '1'; };
  H.undip = (secs) => { dip.style.transition = 'opacity ' + secs + 's ease-out'; dip.style.opacity = '0'; };
  let blurTimer = null;
  const cutT = (secs, ease) => { const b = document.body.style; b.setProperty('--trd', secs + 's'); b.setProperty('--tre', ease); document.body.classList.add('tr-cutting'); };
  H.blurOut = (secs) => { clearTimeout(blurTimer); cutT(secs, 'ease-in'); document.body.classList.add('tr-blur'); };
  H.blurIn = (secs) => {
    cutT(secs, 'cubic-bezier(.2,.8,.3,1)');
    document.body.classList.remove('tr-blur');
    blurTimer = setTimeout(() => document.body.classList.remove('tr-cutting'), secs * 1000 + 40);
  };

  // ---- levels
  H.level = (id, zoom = 1) => {
    $('#menu').classList.remove('show');
    $('#journal').classList.remove('show');
    const entries = strata.journalEntries();
    const k = entries.findIndex((e) => e.shape.id === id);
    strata.startPuzzle({ ...entries[k], number: k + 1 });
    const cam = strata.camera; cam.zoom = zoom; cam.updateProjectionMatrix();
  };
  const G = () => strata.game;
  const V3 = () => strata.camera.position.constructor;
  const cellW = (i) => { const p = G().puzzle, c = p.coords(i), d = p.dims; return new (V3())(c[0] - (d[0] - 1) / 2, c[1] - (d[1] - 1) / 2, c[2] - (d[2] - 1) / 2); };
  // screen <-> scene through the canvas's own box, as the game's pick() does (it may be scaled under a cut)
  const box = () => $('#scene').getBoundingClientRect();
  const toScreen = (v) => { const r = v.clone().project(strata.camera), b = box(); return [b.left + (r.x + 1) / 2 * b.width, b.top + (1 - r.y) / 2 * b.height]; };
  // the game's pick(): a voxel walk along the camera ray from a screen point; the first cube that `has`
  const hitAt = (x, y, has) => {
    const g = G(), p = g.puzzle, cam = strata.camera, V = V3();
    cam.updateMatrixWorld();
    const b = box();
    const o0 = new V(((x - b.left) / b.width) * 2 - 1, -((y - b.top) / b.height) * 2 + 1, -1).unproject(cam);
    const d = new V(0, 0, -1).transformDirection(cam.matrixWorld).toArray();
    const dims = p.dims, o = o0.toArray().map((v, a) => v + dims[a] / 2);
    let t0 = 0, t1 = Infinity;
    for (let a = 0; a < 3; a++) {
      if (Math.abs(d[a]) < 1e-9) { if (o[a] < 0 || o[a] > dims[a]) return -1; continue; }
      let ta = (0 - o[a]) / d[a], tb = (dims[a] - o[a]) / d[a];
      if (ta > tb) [ta, tb] = [tb, ta];
      t0 = Math.max(t0, ta); t1 = Math.min(t1, tb);
    }
    if (t0 > t1) return -1;
    const q = o.map((v, a) => v + d[a] * (t0 + 1e-5));
    const cell = q.map((v, a) => Math.min(dims[a] - 1, Math.max(0, Math.floor(v))));
    const step = d.map((v) => (v > 0 ? 1 : -1));
    const tMax = d.map((v, a) => (Math.abs(v) < 1e-9 ? Infinity : (cell[a] + (v > 0 ? 1 : 0) - q[a]) / v));
    const tDelta = d.map((v) => (Math.abs(v) < 1e-9 ? Infinity : Math.abs(1 / v)));
    for (let guard = 0; guard < 300; guard++) {
      const i = p.idx(cell[0], cell[1], cell[2]);
      if (has(i)) return i;
      const a = tMax[0] < tMax[1] ? (tMax[0] < tMax[2] ? 0 : 2) : (tMax[1] < tMax[2] ? 1 : 2);
      cell[a] += step[a];
      if (cell[a] < 0 || cell[a] >= dims[a]) return -1;
      tMax[a] += tDelta[a];
    }
    return -1;
  };
  const standing = (i) => !G().broken[i];
  // the best screen point that lands on cube i (given which cubes stand), or null:
  // points on its camera-facing faces; the squarest face, nearest its centre
  const tapPoint = (i, has = standing) => {
    const dir = strata.camera.position.clone().normalize();
    const c = cellW(i);
    let best = null;
    for (let a = 0; a < 3; a++) {
      const comp = dir.getComponent(a);
      if (Math.abs(comp) < 0.2) continue;
      const side = comp > 0 ? 1 : -1;
      for (const [u, v] of [[0, 0], [0.22, 0.22], [-0.22, 0.22], [0.22, -0.22], [-0.22, -0.22]]) {
        const f = c.clone(); f.setComponent(a, f.getComponent(a) + 0.5 * side);
        const b1 = (a + 1) % 3, b2 = (a + 2) % 3;
        f.setComponent(b1, f.getComponent(b1) + u); f.setComponent(b2, f.getComponent(b2) + v);
        const [x, y] = toScreen(f);
        if (x < 30 || x > innerWidth - 30 || y < innerHeight * 0.12 || y > innerHeight * 0.85) continue;
        if (hitAt(x, y, has) !== i) continue;
        const score = Math.abs(comp) * 10 - Math.hypot(u, v) * 8;
        if (!best || score > best.score) best = { x, y, score, i, a };
      }
    }
    return best;
  };
  const touch = (x, y) => {
    const r = document.createElement('div'); r.className = 'tr tr-touch';
    r.style.left = x + 'px'; r.style.top = y + 'px';
    document.body.appendChild(r);
    setTimeout(() => r.remove(), 700);
  };
  const pointer = (type, x, y, target = $('#scene')) => {
    const o = { clientX: x, clientY: y, pointerId: 1, pointerType: 'mouse', isPrimary: true, button: 0, buttons: type === 'pointerup' ? 0 : 1, bubbles: true, cancelable: true };
    target.dispatchEvent(new PointerEvent(type, o));
  };
  const log = (e) => { (window.__taps = window.__taps || []).push(e); };
  let lastTap = { x: -999, y: -999, t: -9 };
  const tapAt = (x, y, want) => {
    lastTap = { x, y, t: performance.now() / 1000 };
    touch(x, y);
    const before = want == null ? null : !!G().broken[want];
    pointer('pointerdown', x, y); pointer('pointerup', x, y);
    log({ t: +(performance.now() / 1000).toFixed(2), x: Math.round(x), y: Math.round(y), want, hit: want == null ? null : !before && !!G().broken[want], mistakes: G().mistakes, level: G().shape.id });
  };
  // a tap on a cube that has to go: a visible one, high on the stone and near its middle
  H.tap = () => {
    const g = G(), p = g.puzzle;
    let best = null;
    for (let i = 0; i < p.size; i++) {
      if (p.solid[i] || g.broken[i] || g.painted[i]) continue;
      const pt = tapPoint(i);
      if (!pt) continue;
      // not where the last tap landed, just now: that would be a double-tap
      if (performance.now() / 1000 - lastTap.t < 0.45 && Math.hypot(pt.x - lastTap.x, pt.y - lastTap.y) < 40) continue;
      const score = pt.score - Math.hypot(pt.x - innerWidth / 2, pt.y - innerHeight * 0.42) / 25 + p.coords(i)[1] * 0.4;
      if (!best || score > best.score) best = { ...pt, score };
    }
    if (best) tapAt(best.x, best.y, best.i);
    else log({ miss: true, level: g.shape.id });
  };
  // the 0-lines with a cube standing
  const zeroLines = (has = standing) => {
    const p = G().puzzle, out = [], seen = new Set();
    for (let i = 0; i < p.size; i++) {
      if (!has(i)) continue;
      for (let a = 0; a < 3; a++) {
        const line = p.lineOf(i, a);
        if (line.hidden || line.count !== 0) continue;
        const key = a + ':' + line.cells.join(',');
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({ a, line });
      }
    }
    return out;
  };
  // the tap point for a line: its camera-side end face, which must be what the ray meets
  const linePoint = (a, line, has = standing) => {
    const comp = strata.camera.position.clone().normalize().getComponent(a);
    if (Math.abs(comp) < 0.25) return null;
    const side = comp > 0 ? 1 : -1;
    const p = G().puzzle;
    const cells = line.cells.filter(has);
    if (cells.length < 3) return null;
    const endCell = cells.reduce((b, c) => (p.coords(c)[a] * side > p.coords(b)[a] * side ? c : b));
    const f = cellW(endCell); f.setComponent(a, f.getComponent(a) + 0.5 * side);
    const [x, y] = toScreen(f);
    if (x < 40 || x > innerWidth - 40 || y < innerHeight * 0.18 || y > innerHeight * 0.8) return null;
    if (hitAt(x, y, has) !== endCell) return null;
    return { x, y, n: cells.length, endCell };
  };
  // a double-tap on a shown 0: the game's own cascade clears the row
  let rowAt = null;
  H.rowTap = () => {
    let best = null;
    for (const { a, line } of zeroLines()) {
      const pt = linePoint(a, line);
      if (!pt) continue;
      const score = Math.min(pt.n, 9) * 10 - Math.hypot(pt.x - innerWidth / 2, pt.y - innerHeight * 0.45) / 20;
      if (!best || score > best.score) best = { ...pt, score, a };
    }
    rowAt = best;
    window.__rows = (window.__rows || []).concat([best ? { n: best.n, a: best.a, level: G().shape.id } : { none: true, level: G().shape.id }]);
    if (best) tapAt(best.x, best.y, best.endCell);
  };
  H.rowTap2 = () => { if (rowAt) { touch(rowAt.x, rowAt.y); pointer('pointerdown', rowAt.x, rowAt.y); pointer('pointerup', rowAt.x, rowAt.y); } rowAt = null; };

  // Set the stone up for a shot (silently, under a cut): chisel away everything
  // but `finals` cubes that will each be visible to tap and, with rows > 0,
  // that many whole 0-lines whose end faces show (for double-taps).
  // keepFrac: also leave that share of the rest (a stone part-way through).
  H.prep = (finals = 1, rows = 0, keepFrac = 0) => {
    const g = G(), p = g.puzzle;
    const todo = [];
    for (let i = 0; i < p.size; i++) if (!p.solid[i] && !g.broken[i]) todo.push(i);
    const keep = new Set();
    const has = (i) => p.solid[i] || keep.has(i);
    const keptRows = [];
    for (let r = 0; r < rows; r++) {
      let best = null;
      for (const { a, line } of zeroLines()) {
        if (line.cells.some((c) => keep.has(c) || g.broken[c])) continue;
        line.cells.forEach((c) => keep.add(c));
        const pt = linePoint(a, line, has);
        const others = keptRows.every((k) => linePoint(k.a, k.line, has));
        line.cells.forEach((c) => keep.delete(c));
        if (!pt || !others) continue;
        const score = Math.min(pt.n, 8) * 10 - Math.hypot(pt.x - innerWidth / 2, pt.y - innerHeight * 0.45) / 12;
        if (!best || score > best.score) best = { score, a, line };
      }
      if (best) { best.line.cells.forEach((c) => keep.add(c)); keptRows.push(best); }
    }
    const cand = todo.filter((i) => !keep.has(i)).map((i) => {
      keep.add(i);
      const pt = tapPoint(i, has);
      keep.delete(i);
      return pt && { i, x: pt.x, y: pt.y, s: pt.score - Math.hypot(pt.x - innerWidth / 2, pt.y - innerHeight * 0.42) / 18 };
    }).filter(Boolean).sort((x, y) => y.s - x.s);
    const finalsKept = [];
    const spots = [];
    for (const c of cand) {
      if (finalsKept.length >= finals) break;
      if (spots.some((q) => Math.hypot(q.x - c.x, q.y - c.y) < 55)) continue;   // apart, so two taps are never a double-tap
      keep.add(c.i);
      const ok = [...finalsKept, c.i].every((j) => tapPoint(j, has)) && keptRows.every((k) => linePoint(k.a, k.line, has));
      if (ok) { finalsKept.push(c.i); spots.push(c); } else keep.delete(c.i);
    }
    const rest = todo.filter((i) => !keep.has(i));
    const leave = Math.round(rest.length * keepFrac);
    // the ones furthest from the camera stay standing, so the kept cubes stay in view
    const camDir = strata.camera.position.clone().normalize();
    rest.sort((x, y) => cellW(x).dot(camDir) - cellW(y).dot(camDir));
    for (const i of rest.slice(leave)) strata.act(i, 'break');
    window.__preps = (window.__preps || []).concat([{ level: g.shape.id, finals: finalsKept.length, rows: keptRows.map((k) => k.line.cells.length), left: todo.length - (rest.length - leave) }]);
  };
  H.peel = (axis, n) => { if (strata.peel.axis !== axis) strata.setPeelAxis(axis, 1); strata.setPeeled(n); };

  // ---- a finger turning the solved object (the game's orbit controls)
  H.dragStart = (x, y) => { finger.style.left = x + 'px'; finger.style.top = y + 'px'; finger.classList.add('on'); pointer('pointerdown', x, y); };
  H.dragTo = (x, y) => { finger.style.left = x + 'px'; finger.style.top = y + 'px'; pointer('pointermove', x, y); };
  H.dragEnd = (x, y) => { pointer('pointerup', x, y); finger.classList.remove('on'); };

  // ---- the world: title, map, journal
  H.enterMap = () => { window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' })); };
  H.map = () => { $('#menu-btn').click(); };
  const sheet = () => $('#menu .map-scroll');
  const touchEv = (type, y) => {
    const t = new Touch({ identifier: 7, target: sheet(), clientX: innerWidth / 2, clientY: y });
    sheet().dispatchEvent(new TouchEvent(type, { touches: type === 'touchend' ? [] : [t], changedTouches: [t], bubbles: true, cancelable: true }));
  };
  // back up to the title, at once (under a cut): the map's own pull-down from its top
  H.toTitle = () => {
    $('#journal').classList.remove('show');
    if (!$('#menu').classList.contains('show')) $('#menu-btn').click();
    $('#menu').classList.remove('arriving', 'settling');
    sheet().scrollTop = 0;
    touchEv('touchstart', 200); touchEv('touchmove', 300); touchEv('touchmove', 700); touchEv('touchend', 700);
    sessionStorage.removeItem('strata.descended');   // the next descent is the full one, as on a first launch
  };
  // a finger on the map sheet at its top, pulling down: the title comes back down over it
  H.mapTop = () => {
    if (!$('#menu').classList.contains('show')) $('#menu-btn').click();
    $('#journal').classList.remove('show');
    $('#menu').classList.remove('arriving', 'settling');
    sheet().scrollTop = 0;
  };
  H.pullStart = () => { $('#menu').classList.remove('arriving', 'settling'); sheet().scrollTop = 0; touchEv('touchstart', 240); finger.style.left = innerWidth / 2 + 'px'; finger.style.top = '240px'; finger.classList.add('on'); };
  H.pullMove = (dy) => { touchEv('touchmove', 240 + dy); finger.style.top = (240 + dy) + 'px'; };
  H.pullEnd = () => { touchEv('touchend', 240 + 440); finger.classList.remove('on'); };
  // a tap on the title: the whole descent into the map
  H.tapTitle = () => {
    const t = $('#title'), x = innerWidth / 2, y = innerHeight * 0.74;
    touch(x, y);
    pointer('pointerdown', x, y, t); pointer('pointerup', x, y, t);
  };
  H.noName = (on) => { document.body.classList.toggle('tr-noname', !!on); };
  H.noStory = (on) => { document.body.classList.toggle('tr-nostory', !!on); };
  H.noTag = () => { document.body.classList.add('tr-notag'); };
  H.endCard = () => { document.body.classList.add('tr-cta'); end.classList.add('on'); setTimeout(H.measureEnd, 1200); };
  // v4b: the living end card; behind it the title's logo stone turns slowly (a view rotation,
  // as the trailer's level zoom is: nothing in play changes)
  H.endCardLive = () => {
    document.body.classList.add('tr-cta');
    live.classList.add('on');
    const mesh = strata.cubes.mesh, t0 = performance.now(), r0 = mesh.rotation.y;
    const turn = () => { if (!live.classList.contains('on')) return; mesh.rotation.y = r0 + 0.32 * (performance.now() - t0) / 1000; requestAnimationFrame(turn); };
    requestAnimationFrame(turn);
    setTimeout(() => {
      const r = [...live.querySelectorAll('h1 span, .gem, .pill, img')].map((e) => e.getBoundingClientRect());
      (window.__caps = window.__caps || []).push({ text: 'END CARD (v4b live)', x0: +(Math.min(...r.map((q) => q.left)) / innerWidth * 100).toFixed(1), x1: +(Math.max(...r.map((q) => q.right)) / innerWidth * 100).toFixed(1),
        y0: +(Math.min(...r.map((q) => q.top)) / innerHeight * 100).toFixed(1), y1: +(Math.max(...r.map((q) => q.bottom)) / innerHeight * 100).toFixed(1) });
    }, 1300);
  };
  // v4b's sting, on the game's own voices (Saturday's ending did the same three things:
  // a rising arpeggio, a low swell under the card, and a lift as PLAY NOW pops)
  H.stingSwell = () => {
    if (!audio || !audio.sound.ctx) return;
    const s = audio.sound, r = s.key.root;
    s.tone(r, { dest: s.music, type: 'sine', attack: 0.45, decay: 2.6, gain: 0.5, partial: 2, partialGain: 0.25 });
    s.tone(r + 7, { dest: s.music, type: 'sine', attack: 0.6, decay: 2.4, gain: 0.22 });
  };
  H.stingPop = () => {
    if (!audio || !audio.sound.ctx) return;
    const s = audio.sound, r = s.key.root;
    s.tone(r + 31, { dest: s.music, type: 'sine', attack: 0.006, decay: 0.3, gain: 0.22, glideFrom: -700, glideTime: 0.1 });
    s.fmBell(r + 43, { dest: s.music, at: s.now + 0.06, gain: 0.18, decay: 1.4, index: 1.8 });
  };
  H.stingShine = () => {
    if (!audio || !audio.sound.ctx) return;
    const s = audio.sound;
    s.fmBell(s.key.root + 55, { dest: s.music, gain: 0.05, decay: 0.9, index: 1.2 });
  };
  // the wall's tiles: every object's own map thumbnail (thumbs.js), in a fixed shuffle
  H.wallBuild = async () => {
    const { renderThumb } = await import('./js/thumbs.js');
    const entries = strata.journalEntries();
    let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const pick = entries.map((e) => [rnd(), e]).sort((a, b) => a[0] - b[0]).map((x) => x[1]).slice(0, 50);
    const urls = await Promise.all(pick.map((e) => Promise.resolve(renderThumb(e.shape, e.palette, { size: 120 }))));
    wall.innerHTML = '<div class="grid">' + urls.map((u) => '<div class="tile"><img src="' + u + '"></div>').join('') + '</div>';
    await Promise.all([...wall.querySelectorAll('img')].map((i) => i.decode().catch(() => {})));
  };
  H.wall = (on) => {
    if (on) { const g = wall.querySelector('.grid'); if (g) { g.style.animation = 'none'; void g.offsetWidth; g.style.animation = ''; } }
    wall.classList.toggle('on', !!on);
  };
  H.focusNode = (id) => {
    const e = document.querySelector('.map-node[data-id="' + id + '"]'), s = sheet();
    if (!e || !s) return;
    const r = e.getBoundingClientRect();
    s.scrollTop += r.top + r.height / 2 - innerHeight * 0.5;
  };
  H.tapNode = (id) => {
    const e = document.querySelector('.map-node[data-id="' + id + '"]');
    if (!e) return;
    const r = e.getBoundingClientRect();
    touch(r.left + r.width / 2, r.top + r.height / 2);
    e.click();
  };
  // v1's map scroll: a fraction of the way down the trail (as timeline.mjs)
  H.mapScroll = (f) => { const s = sheet(); if (s) s.scrollTop = f * Math.min(1400, s.scrollHeight - s.clientHeight); };
  H.mapScrollBy = (px) => { const s = sheet(); if (s) s.scrollTop += px; };
  H.journal = () => { $('#map-journal').click(); };
  H.journalScroll = (y) => { const s = $('#journal .jr-scroll'); if (s) s.scrollTop = y; };

  // ---- sound (the audio pass only)
  H.sfx = (on) => { if (audio) audio.sound.setSfx(on); };
  // where the picture jumps ahead (a fast-forward under a cut or a flash), the
  // real-time sound can't: the gems' own chimes (sound.star) are played at the
  // picture's times instead, and the result's later timers are let go by the
  // game's own tap-to-finish on a solved stone (audio pass only)
  H.finishResult = () => { const x = innerWidth / 2, y = innerHeight * 0.5; pointer('pointerdown', x, y); pointer('pointerup', x, y); };
  // a gem's own chime (sound.star's notes), on the music bus, for shots whose game sound is muted
  H.gem = (k) => {
    if (!audio || !audio.sound.ctx) return;
    const s = audio.sound, midi = s.key.root + 36 + [0, s.mode.third, 7][k % 3];
    s.fmBell(midi, { dest: s.music, gain: 0.45, decay: 1.5 });
  };
  H.star = (k) => { if (audio && audio.sound.ctx) audio.sound.star(k); };
  H.whoosh = () => {
    if (!audio || !audio.sound.ctx) return;
    const s = audio.sound;
    s.noise({ dest: s.sfx, dur: 0.22, gain: 0.05, freq: 900, sweepTo: 5200, q: 0.7, attack: 0.12 });
  };
  H.chime = (k, gain = 0.45) => {
    if (!audio || !audio.sound.ctx) return;
    const s = audio.sound;
    s.fmBell(s.key.root + 36 + [0, 4, 7, 12, 16, 19][k % 6], { dest: s.music, gain, decay: 1.6 });
  };
  H.finalChord = () => {
    if (!audio || !audio.sound.ctx) return;
    const s = audio.sound;
    [0, 7, 12, 16, 19].forEach((d, k) => s.fmBell(s.key.root + 24 + d, { dest: s.music, at: s.now + k * 0.09, gain: 0.42, decay: 3.2, index: 1.6 }));
  };
  H.ff = () => {};
}
