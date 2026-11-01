# Spanish (es): the table, its glossary, and the doubts to fix first (2026-10-31)

**Live (Kellan, 2026-10-31), without a native speaker's review**, like Japanese and Chinese (`docs/localisation.md`). The table is `public/i18n/es.js`: all 712 keys (174 interface strings, 538 of the game's own words: 209 story lines, every object's name, the 15 worlds, the lessons). The store pages are `store/listing-es.md`.

## One table for Spain and the Americas

`match()` sends every Spanish tag (es, es-ES, es-MX, es-419, es-US…) to this one table, so it has to read as home to a player in Madrid, Mexico City, Bogotá and Buenos Aires.

- **Tú** throughout, in imperatives too (toca, mantén, arrastra, cincela). Never vosotros (Spain only) or usted (too formal for a calm game), and never vos (Río de la Plata), though the tú forms read fine there.
- **Tenses:** narrative past is the simple preterite ("Lo talló alguien paciente"), which is natural everywhere. Where Spain would use the perfect for something just done and the Americas the preterite, the line avoids the tense: the result says **"tu hallazgo"** (your find) rather than "has descubierto" / "descubriste", and the slip is "un cubo de la figura, cincelado por error".
- **Words that change by region were avoided or swapped for one understood everywhere:**

| Thing | Avoided (region) | Used |
|---|---|---|
| hold (gesture) | mantén pulsado (ES) / presionado (MX) | **mantén el dedo** |
| scroll wheel | ratón (ES) / mouse (Am.) | **Rueda**; right-click is **clic derecho** |
| puzzle | puzle (ES) / rompecabezas (Am.), both also "jigsaw" | **piedra** in the game; "reto de lógica" in the share line |
| fringe (highland cow) | flequillo (ES) / fleco, cerquillo (Am.) | "con tanto pelo en la cara" |
| mushroom | seta (ES) | **hongo**, understood in Spain too |
| ice lolly | polo (ES) / paleta (MX) | **helado de palito** |
| beans (Setsubun) | judías / frijoles / porotos, soja / soya | "la noche del Setsubun" |
| lunch | almuerzo / comida (mean different meals) | "antes del mediodía" |
| to catch | coger (vulgar in much of the Americas) | atrapar, tomar |
| between (time) | entre medias (ES) | "en medio" |
| rail (slider) | raíl (ES) / riel (Am.) | **guía** |
| Settings | Ajustes (iOS ES) / Configuración (iOS MX) | **Ajustes**: shorter, and clear in both |

Kept although regional usage varies, because the alternative is worse: **aguacate** (palta in the Southern Cone), **fresas** (frutillas there), **chanclas**, **cometa** for the kite (papalote in Mexico, barrilete in Argentina), **calabaza**, **estantería**, **tostadora**. See the doubts below.

## Glossary: one term per thing (docs/copy-study.md C1)

| English | Spanish | Notes |
|---|---|---|
| stone (the block, a level) | **piedra** | also stands in for "puzzle" (map.puzzleAria "Piedra 12") |
| cube | **cubo** | |
| object (what's found), shape | **figura** | one word for object, shape and picture; feminine, so "descubiertas" |
| chisel (tool / verb; the gesture is tap) | **Cincel** / **cincelar** | "Cincela todos los cubos que no son parte de ella" |
| mark (tool / verb; the gesture is hold) | **Marca** / **marcar** | "con Marca" = with the Mark tool selected |
| slip | **desliz**, plural **deslices** | also for the lessons' "mistake", so there is one word; "por error" for "by mistake" |
| gem | **gema** | |
| shrine | **santuario** | "✦ Santuario ✦" on the shrine's card |
| Finds | **Hallazgos** | and the result's "you uncovered" is "tu hallazgo" |
| lesson / Learn | **lección** / **Aprende** | |
| circled number (two groups) | **número en círculo**; "el 2 en círculo" | |
| squared number (three or more) | **número en cuadrado** | |
| piece / group (touching cubes in a row) | **grupo** | English says pieces (lessons) and groups (Rules); Spanish says grupo in both |
| gap | **hueco** | |
| row / column | **fila** / **columna** | "a lo ancho, hacia abajo o hacia el fondo" for across, down, back |
| world (chapter) | **mundo** | |
| Drift | **Deriva** | so "a la deriva" is kept out of the story lines (jellyfish, floating isle) |
| Today, the Daily Stone | **Hoy**, **la piedra de hoy**, **Diaria #N** | the share line's first line stays "Strata · Daily #N" |
| the ◆ slider | **rombo** | |
| tap, double-tap, hold, drag, pinch | toca, toca dos veces, mantén el dedo, arrastra, pellizca | mouse: clic, doble clic, clic derecho, rueda |
| take back (a slip) | **deshacer** | |
| BEST (the score, on the canvas) | **RÉCORD** | |
| on / off (Settings) | **sí** / **no** | |

The old lessons' "white stone", "picture" and "coloured part" became cubo blanco, figura and cubos de color, as in Japanese and Chinese, so piedra only ever means the level.

Plurals go through `one` / `other` (and `zero` where English has one): slips, finds.worlds, and four strings English writes once but whose number can be 1 in Spanish (days.run, map.toUncover, finds.stones). Opening ¿ and ¡ are used (there are no exclamations in Strata's voice, so only ¿).

## Story lines

209 lines, kept short, dry and warm; a few jokes were rebuilt rather than translated:
- **Red grouse:** its call "go back, go back" is a pun only in English. Spanish keeps the behaviour: "Les dice a todos en el páramo que se vuelvan, que se vuelvan. Nadie le hace caso."
- **Avocado:** "Aún no, aún no, aún no… y perfecto durante una hora, más o menos."
- **Little oni:** the bean-throwing night is named, "la noche del Setsubun", to avoid the beans' regional names.

Budget: 90 characters (`test/i18n.test.js`, justified there): two lines at 13 px, three with Larger text. The longest are 81 (aqueduct, heron, red grouse).

## Layout

`tools/a11y-shots.mjs es --lang es` and `es-large --lang es --large` shot all 17 screens at 390×844 and 375×667 (`shots/a11y/es`, `shots/a11y/es-large`; not committed). Its measure reports no text off screen or clipped, in both runs. By eye and by a measurement of every name in the real one-line styles at 375 px:

- **One-line names were the problem.** The world's card (`#chapter-card .cname`) and the result's name (`#win-title .name`) never wrap. Spanish object names ran past 12 letters twice as often as English (98 names against 43). So:
  - **Words first:** 22 object names were shortened, e.g. Halcón cetrero (was Halcón encapuchado), Límulo (Cangrejo herradura), Alcazaba, Palmeral, Piedra del sol (the Aztec calendar stone's name in Mexico), Microscopio, Carrusel, Pingüinito, Cigüeña, Ermita de la cima, Puerta de faroles. Three world names too: Colinas de fuego, El oasis, Relojería, Lluvia estelar. The widest result name is now 347 px, inside English's widest (Songbird Automaton, 351).
  - **Then CSS** (`style.css`, last block, `:lang(es)` only): the world's card tracks at .2em instead of .3em, so the widest, Escalones de brasa, is 348 px of 375. (English's Clockwork Workshop measures 437 px there, past the screen; that is English's and was left alone.)
- **Finds tiles** cut long names with an ellipsis. In Spanish they wrap onto a second line instead, as they already do with Larger text (`:lang(es) .jr-tile .nm`).
- **Lessons list:** Montículo ran past its column rule and Cofre marino wrapped; they are Hito and Cofre.
- **The level's tip** for the circled number left "gato." alone on a fourth line with Larger text; it lost "entre ellos" and fits in three.
- **The Touch page:** a no-break space keeps "un 0", "el cielo" and "un ◆" together, so the 0 isn't stranded on its own line.
- **Fine as they are:** the Cincel / Marca switch, the map's rings (Menú, Hoy, Hallazgos), Settings' rings (Vibración, Texto más grande, sí / no), the uppercase headings, Rules, pause, the shrine card ("✦ Santuario ✦") and the result.
- The result's score ("2,060" in the shots) is formatted by the device's locale (`toLocaleString()`), so a Spanish phone shows its own grouping; the shots' browser is en-US.

## Open doubts: the first things to fix if players report them

1. **"desliz" for slip.** It's the gentlest word for a small mistake, and it's used everywhere (HUD, Rules, offers, lessons). A player may find "error" plainer; if so, change it everywhere at once.
2. **"figura" for the object.** It covers object, shape and picture in one word and reads well in lessons ("parte de la figura"). "Objeto" is the literal choice; figura was picked because it is concrete and warm.
3. **"Hallazgos" for Finds, "santuario" for shrine, "Deriva" for Drift.** All three are literal and clear; Deriva may sound like being lost at sea, as 漂流 does in Japanese.
4. **Regional words kept on purpose:** cometa (kite: papalote in Mexico), aguacate (palta in Argentina and Chile), fresas, chanclas. If one region's players report them, a regional table (es-419) could override a handful of keys; the system doesn't support that yet (`match()` maps every es tag to one table).
5. **The install hints** (`home.how.html`, `install.*.html`) quote button names that differ by region and browser: Safari says "Añadir a pantalla de inicio" in Spain and "Agregar a pantalla de inicio" in Mexico, and Chrome differs again. The table uses Añadir throughout. These hints are web-only; the iOS app never shows them.
6. **The lessons:** `touch.full` ("Toca dos veces una fila llena") and `hint.lesson-mark.3` ("mantén el dedo") are the gestures a first-time player must get at once. "Mantén el dedo" is clear but not the system's own phrase (mantén pulsado / presionado).
7. **Small labels:** `hud.daily` "Diaria #N" (the daily's name, as a noun), `map.open` "abierto" (a shrine that's open but not solved), `act.challenge` "Desafiar" (Game Center's Spanish says "desafío"), `set.on`/`set.off` "sí"/"no".
8. **The store keywords** (`store/listing-es.md`), especially the Mexico field's English words, which only help if the U.S. store indexes them as expected.
