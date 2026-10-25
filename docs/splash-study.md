# Splash study: the Unsupervised Rock card

**Brief.** The studio card that opens Strata. Kellan: "splash screens on theater productions are incredible and cinematic. How do we raise the production value a ton."

Fixed requirements:
- White on black, with the pet rock (googly eyes) and the lowercase Fredoka name.
- The goofy, self-deprecating tone: silicon is rock, and the game is made by AI left running unsupervised.
- About 3–4 s, smooth during boot, under 30 KB.
- Reduced motion respected; the quick relaunch shows only black.

Open to change: everything else.

**Baseline** (`splash-frames/baseline.jpg`).
- The rock drops and squashes by 0.5 s, the name fades in at 1.25 s, and then nothing happens for ~2 s. The kick "by nobody" at 1.25 s is a 4° wobble no one would notice.
- Flat lighting and a small subject (150 px). There is no story, no payoff tied to the name, and no light.

## What I inspected
I downloaded the idents with yt-dlp, made contact sheets with ffmpeg (2–4 fps over each ident, 8–15 fps around key beats) and printed loudness envelopes at 0.1 s resolution.

**Limits.**
- I read the sound only from the envelopes. I did not listen.
- I did not gather practitioner interviews this session. Everything below is direct observation plus interpretation.

| Ident | Observed (time in the clip) | Mechanism |
|---|---|---|
| **Pixar, Luxo Jr.** | Word on a void floor with a soft pool of light. The lamp hops in (~1.5 s), lands on the "I" in three hops (5–8 s) and squashes it flat. It **looks at the camera**, then switches its own light on as the "I" (~10–11 s). Sound: tiny, sparse foley ticks. | One character, one gag, and the payoff *is* the logo. Physical squash sells weight. The look to camera is the beat. |
| **Nintendo Switch** | Black 0.0–1.6 s. The Joy-Con sits *offset* for ~0.5 s, then **snaps in one frame** (1.6 s) with "click". The wordmark appears on the same frame. The exit is a zoom-through. | Anticipation is a held offset, and the impact is a single frame plus sound plus reveal, all synced. |
| **PS1 boot** | A white field, the diamond builds, a long tonal swell (the envelope is loud for 10 s), then a cut to black and the PS logo. | Sound carries half the ceremony. A light-to-dark cut is a scene change. |
| **Naughty Dog** (Crash era) | A lens flare sweeps the word on (0–1 s). Paw prints stamp in one by one (~2.5 s). Dark space, glow. | Light *reveals* type. A tiny character gag (paws) personalises a plain wordmark. |
| **Laika** | White letters on black. The letters **turn into the studio's puppets**, which walk off. | Monochrome is enough when the type has a performance. |
| **Annapurna / thatgamecompany (Journey)** | A logo fades up on black, holds ~2 s, fades. No gag. | The calm register: hold and restraint. Our tone is goofier, so take only the hold. |
| **Devolver / Free Lives** | Hands clap, then a hard-cut, colour-cycling star. Loud the whole time. | Self-deprecation by excess. Wrong energy for a calm puzzle game. |
| **Double Fine** | A two-headed baby tumbles past, then lands in the cameo. | Studio identity = a weird character doing one thing. |
| **Mojang** | Pixel glyphs scramble, then resolve into the word in ~2 s. | Type as a mechanism. |
| **Supergiant** | "SG" fills the frame, the word unfolds, then a colour flip on a star. | A short sequence. Colour arrives last, as the "sting". |
| **DreamWorks (1997)** | Moonlit clouds. The boy casts his line, and the ripple is the beat. The camera pulls back through cloud and the word rises. | Camera move plus rim light plus haze = "cinema". |
| **Saul Bass, *Vertigo*** | An extreme close-up of eyes. Type over the face, red flood, spirals. | Eyes in close-up carry dread or comedy. Type sits *over* the picture. |
| **Kyle Cooper, *Se7en*** | Dark, grainy inserts. Hand-scratched type jitters, flickers and is double-exposed. | Grain and flicker are texture: "film" rather than "screen". |

## Mechanisms, distilled
1. **One character, one gag, payoff = the name** (Pixar, Laika, Double Fine, Naughty Dog's paws). Our rock already *is* a character. What it lacked was a gag that means "unsupervised".
2. **Anticipation, impact, hold** (Switch, Pixar). Hold a beat of emptiness, then a single-frame-sharp impact with the reveal *on* the impact, then a still hold long enough to read.
3. **Light as the storyteller** (Naughty Dog, DreamWorks, Pixar's pool):
   - one motivated source;
   - a volumetric cone;
   - a pool on the floor;
   - things outside it fall into darkness.

   That is the theatre, and it is literally the stage Kellan asked for.
4. **Film texture** (Se7en): moving grain, a vignette and a slow push-in. Each is cheap, and together they move it from "web page" to "projected".
5. **Sound is half** (PS1, Switch): every beat wants a sound. The web can't play it, so the native app must.
6. **Restraint** (Annapurna, Journey): no more than one gag, and the final frame must be a clean, centred lock-up.

## Hit list (prioritised)
| # | Change | Why (source) | Cost | Status |
|---|---|---|---|---|
| 1 | **The story: the spot wanders off.** House dark. A follow-spot strikes on an empty stage, and the rock drops into it. Then the spot *drifts away on its own* (nobody is at the lighting desk), leaving the rock in the dark with only its googly eyes showing. It cranes after the light, hops into it, and the name lands *with* the landing. | One gag that *is* the name (1). Anticipation, impact, hold (2). | M | **Built** |
| 2 | **A real light:** a haze cone hung above the frame, a floor pool, a contact shadow that grows as the rock falls, and directional darkening of the rock out of the light. | 3 | S | **Built** |
| 3 | **Camera:** a slow push-in (1.14→1.20), a lazy pan after the action that ends centred, and a 2–3 px jolt on each landing. | 3, 4 | S | **Built** |
| 4 | **Tungsten strike flicker** on the spot: catch, stutter, full, in 0.16 s. | 2 (the impact), theatre | XS | **Built** |
| 5 | **Grain + vignette + dust motes in the beam.** | 4 | XS | **Built** |
| 6 | **Rock materials:** a top-lit gradient, a specular crown, a darker belly, googly-eye domes with a fixed glint, pupils with a soft sheen. | 3 | XS | **Built** |
| 7 | **Sound design** for native (below), plus a WebAudio sketch `window.splashSound(ac, at)` | 5 | S | **Sketched**, not played |
| 8 | The native launch screen is plain black, which matches the card's first frame (the house dark). | Seamless hand-off | XS | **Built** |
| 9 | Optional later: a second, rarer variant (1 in 20 launches): the spot never comes back, and the rock stays in the dark, blinking, until the name appears anyway. | Running gag, rewards relaunches | S | Idea |

## Experiments: what the frames showed
Each item is one render of the sequence (`tools`-style Playwright harness, every animation seeked at 30 fps, 390×844 @2x).
- **v1:** the story read on the first render. It was too small in a tall frame, and the dust puffs showed before their cue (WAAPI `fill: both` on delayed animations). I pushed the camera in by 14% and changed the dust to `fill: forwards`.
- **v2:** in shade the rock looked *translucent grey*, not dark (the shade was too light, over the eyes too). The final frame sat 27 px off centre because the pan ignored the camera's scale.
  - **Fix:** a deeper shade *under* the eyes, so the googly eyes stay white in the dark. That turned out to be the best frame of the piece: two eyes in a black void looking after the light.
- **v3:** the light left and the rock hopped almost at once, so the "take" never happened. I retimed it: the light settles by 1.78 s and the rock sits in the dark until its 1.94 s crouch.
- **v4:** the rock leaned *toward* the light, so gravity rolled its loose pupils *away* from it and it looked at the floor. Flipping the lean (it rears back, right side up) rolls the pupils toward the light. The physics now does the acting.
- **v5:** the landing wobble was too floppy, so I damped it (kick 2.4 → 1.5).
- **Live run (real main.js):** the card lifted just as the name appeared. Probes showed the play's first frame waiting up to ~1 s on the boot's long task, while main.js lifts by the wall clock from `splashT0`. The fix lives in `index.html`: the play skips ahead by its start lag. The opening is black, so a short lag costs only darkness. Probed again, the play is at 3.10 s when the lift starts, in every run.

Final: `splash-frames/final-beats.jpg` and `final-poster.jpg`.

**Timeline (s).**
- 0–0.28: black.
- 0.28: the spot strikes.
- 0.28–0.6: an empty stage.
- 0.5–1.0: the rock falls through the beam.
- 1.0: tok, squash, dust.
- 1.2–1.78: the spot wanders off.
- 1.42: the rock cranes back.
- ~1.75–2.06: the rock alone in the dark, eyes only.
- 1.94: crouch.
- 2.06: hop.
- 2.22: lands in the light; the name lands with it.
- 2.22–3.1: hold.
- 3.1: main.js fades it (0.7 s).

`SPLASH_HOLD` stays 3.1. Raising it only lengthens the final hold, and anything under ~2.6 cuts the name's landing.

## Craft notes (the build)
- **Animation and threading:**
  - Everything moves by `transform`/`opacity` through Web Animations, so the compositor runs it through the boot's long tasks.
  - The pupils are HTML circles rather than SVG, so they composite too (the old SVG pupils painted on the main thread).
  - The physics (gravity, a stiff damped floor, rocking on its round bottom, loose-weight pupils) runs once, in about 8 ms, and is baked to 60 fps keyframes.
- **Cost:** about 15 KB raw (5 KB gzipped) inline, with no new requests. The sound sketch is ~3.5 KB of that.
- **Reduced motion:** every animation is `finish()`ed, so the user sees the final poster frame (and main.js lifts at once).
- **Large screens:** a 390×844 stage is fitted to the viewport (`--fit`).

## Sound design (native app)
The web card is silent, because browsers block audio before a gesture. In the native app, play it from the card's start. Mix it quiet: it is a calm game.
1. **Room tone:** a theatre hush under everything, faint.
2. **0.28, the strike:** a follow-spot relay *clunk*, the arc's 50 ms flutter, then a low lamp hum that sits under the rest.
3. **1.0, landing:** a small stone *tok* on wooden boards (a real pebble on a plank, close-miked), then the googly eyes' plastic *tikka-tik* rattle settling. That rattle is the studio's signature sound.
4. **1.2–1.78, the wander:** a spot yoke's servo whine, a little sheepish.
5. **1.75–2.06, the dark:** silence apart from the hum. Let the eyes play it.
6. **2.06–2.22, hop and landing:** a scuff, a lighter *tok* and rattle. On the same frame comes a warm two-note chime a fifth apart (E5, B5; celesta or kalimba). That is the Switch "click" moment, and it should become the studio's sonic logo.

`window.splashSound(ac, at)` in `index.html` synthesises a rough version of all of this from the play's own beats (`window.splashBeats`). It is never called at boot. Use it as a reference for the real foley, or call it after the first touch if wanted. An offline render was checked for errors and levels (peak −8 dBFS).

## Open questions
- **Real phones:** frames come from Chromium only. Check iOS Safari and WKWebView for mask rendering of `.shade` (prefixed `-webkit-mask` is included) and for grain cost.
- **The sketch:** whether the sound sketch should ship as the native sound or be replaced by recorded foley (recommended).
- **Wordmark:** whether the name wants its own tiny beat (letters settling) or stays a clean fade. I kept the fade (restraint, Annapurna).
