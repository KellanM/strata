# Brazilian Portuguese (pt-BR): glossary, doubts, layout (2026-10-31)

**Live (Kellan, 2026-10-31),** without a native speaker's review, the same way as Japanese and Simplified Chinese (`docs/localisation.md`). Every Portuguese tag gets this table (`pt`, `pt-BR`, `pt-PT`, `pt-AO`…; `match()` in `public/js/i18n.js`), so players in Portugal read Brazilian Portuguese.

- **Table:** `public/i18n/pt-BR.js`, all 712 keys (174 interface strings, 538 of the game's own: 209 names and story lines of objects, 45 chapter strings, the lessons' names and hints).
- **Store page:** `store/listing-pt-BR.md`.
- **iOS:** `pt-BR` in `CFBundleLocalizations` (`tools/ios-configure.mjs`).
- **Tests:** `test/i18n.test.js` (every key, placeholders, markup, story lines within 64 characters, plurals with a zero form, `LANGS_LIVE`).

## Voice

- **Você** throughout, and the imperative that goes with it ("Toque", "Arraste", "Cinzele"). No "tu", and no object pronoun "te"; where English says "you" as an object, the line is turned so it isn't needed ("para você passar").
- Short, dry, warm, specific, as in English; no exclamation marks, no praise. The story lines keep English's jokes where Portuguese has them (the sloth is a *bicho-preguiça* already; the avocado is "verde, verde, verde", which is what Brazilians say of unripe fruit) and say the thing plainly where it doesn't (the red grouse, below).
- **Story lines keep to 64 characters** (English runs to 75), and together run about 3 % shorter than English; the table as a whole runs about 5 % longer. That is well under the 25 % usually budgeted for Portuguese, because lines were rewritten to fit, not left long: 44 story lines were cut after the first layout check (below), and the longest lesson lines were trimmed ("uma linha com jogada", as on the Rules page, rather than "uma linha que dá para resolver").

## Glossary (one word per thing; docs/copy-study.md C1)

| English | pt-BR | Notes |
|---|---|---|
| stone (the block, a level) | **pedra** | Only the level. A rock that is scenery is *rocha* ("Dorme nesta rocha", the moss garden's "rocha quieta"); objects made of stone keep *de pedra* (Golem de Pedra), as English does. |
| cube | **cubo** | |
| object (what's found) | **objeto** | The title's "find the shape" stays *encontre a forma*, as in English. |
| chisel (tool) / to chisel | **Cinzel** / **cinzelar** | The gesture is *toque* (tap). *Cinzelar* is a real, slightly literary verb ("cinzelar a pedra"); see doubt 1. |
| mark (tool) / to mark | **Marca** / **marcar** | The gesture is *segure* (hold). On the tool switch: Cinzel / Marca. In the lessons: "Escolha Marca", "Ainda na Marca". |
| slip | **deslize** | A small lapse, never *erro*. Plural *deslizes*; the HUD says *deslizes* where English says "mistakes". |
| to slide (the ◆) | **arrastar** | Never *deslizar*: its imperative, *deslize*, is the noun for a slip. |
| take back (a slip) | **desfazer** | "Desfazer o último deslize" |
| gem (◆) | **gema** | The word Brazilian games use (Clash Royale and others). Also "egg yolk", but never in a game's context. |
| shrine | **santuário** | The shrine card reads *✦ Santuário ✦* over the world's name (no "de", so names with an article don't clash). The Summit Shrine is *Santuário do Cume*. |
| Finds | **Achados** | |
| lesson / Learn | **lição** / **Aprender** | |
| circled number | **número com círculo** (*o 2 com círculo*) | Lessons that say "a circle" say *um círculo*. |
| squared number | **número com quadrado** | |
| piece (touching cubes in a row) / gap | **pedaço** / **vão** | English's Rules page says "groups"; pt-BR uses *pedaço* there too, so one word. |
| row / column | **linha** / **coluna** | *Linha* for any direction ("na horizontal, na vertical ou para trás"), *coluna* where English says column. |
| world | **mundo** | |
| Drift | **Deriva** | "esculpida na deriva", "sem fim · esculpida ao acaso". |
| Today / the Daily Stone / Daily #N | **Hoje** / **pedra do dia** / **Dia #N** | The share line's first line stays "Strata · Daily #N" in every language. |
| tap, double-tap, hold, drag, pinch | **toque**, **toque duas vezes** (verb) / **dois toques** (the Touch page's labels), **segure**, **arraste**, **pinça** | Mouse: *clique*, *clique duas vezes* / *clique duplo*, *botão direito*, *role*. |
| Settings, Rules, Touch | **Ajustes**, **Regras**, **Gestos** | *Ajustes* is iOS's own word in Brazil. |
| on / off | **sim** / **não** | Drawn in the settings rings; *ligado* / *desligado* is longer than the ring allows. |
| best (the result's stamp) | **RECORDE** | |

Chapter names: Primeira Luz, Colinas das Fogueiras, Jardim de Musgo, O Pomar, Bosque de Outono, A Laguna, As Profundezas, Oásis do Deserto, Degraus de Brasa, Pedras Antigas, Oficina de Corda, Festa das Lanternas, Picos Gelados, Ilhas das Nuvens, Chuva de Estrelas.

## Plurals

`Intl.PluralRules('pt-BR')` counts 0 as **one** ("0 mundo"), unlike English. Every plural in the table therefore has its own `zero` form (`slips`: *sem deslizes*; `finds.worlds`: *0 mundos*), and the test checks that any future plural has one too. Strings that English writes with a fixed plural (`{n} pedras`, `{n} lições`, `{n} dias seguidos`) are only shown with n ≥ 2.

## Open doubts: the first things to fix if players report them

1. **"Cinzelar" in the first lesson.** It's the tool's own name, but less everyday than *tirar*, *quebrar* or *remover*. The copy study already asks the same of English "chisel". If first-time players stall on lesson 1, try "Toque num cubo branco para tirá-lo" there and keep *cinzelar* elsewhere.
2. **"Deslize" for slip.** It's gentle and right, but it's a lapse in conduct more than a fumble of the hand. *Escorregão* is the literal slip but sounds comic. Watch whether players link the ✕ to *deslize*.
3. **"Gema".** Clear in games, but if it reads as "yolk" to anyone, *joia* is the fallback (not *pedra preciosa*: *pedra* is the level).
4. **"Dia #N" for Daily #N** (`hud.daily`, `today.done`). Short for the HUD, but it could read as "day 12 of something". *Pedra do dia #N* is clearer and longer.
5. **The story lines' jokes.** The red grouse's English pun ("go back, go back" is its call) has no Portuguese; it's now "Diz a todos na charneca: volta, volta. Ninguém volta.", which keeps the joke and loses the bird-call. Also read: highland cow (*Vaca Escocesa*), scorpion, alpaca, akabeko (*Bata na cabeça*, to avoid *toque*, our gesture). The cuts for length (above) lost some detail: the bed lost its quilt, the deep-sea chimney its "where no sun reaches"; read them against the English.
6. **Names that may not be known in Brazil:** *Límulo* (horseshoe crab), *Caravançará*, *Feneco*, *Calau*, *Galo-Silvestre* (red grouse; *lagópode* is the exact name and rarer still), *Planetário Mecânico* (orrery), *Fumarola Negra*, *Arco Fechadura*. *Jabuti* (tortoise) and *Pipa* (kite) are the Brazilian words, not Portugal's (*cágado*/*tartaruga*, *papagaio*): players in Portugal will notice.
7. **The price** (`ads.remove`, "$1.99"): unchanged from English. Ads and purchases are off in v1; when they arrive the price must come from the store, in reais.
8. **The keyword line** (`store/listing-pt-BR.md`): "pintar" and "números" are a guess at how casual Brazilian players search for picture-logic puzzles. Check App Store search suggestions before the next update.

## Layout, checked

`tools/a11y-shots.mjs <label> --lang pt-BR [--large]` against this worktree, every screen at 390×844 and 375×667 with Larger text off and on (title, lesson card and pause, map, Settings, Rules, Touch, Finds and a find, the lessons list, chapter card, level tip, reminder and pause, result, shrine card). The tool shows only the first world, so a second script (kept out of the repo) solved every stone and measured every Finds tile name, every map label, every object's name and all 209 story lines in the find view, English's and Portuguese's, and the five longest world names on the chapter card. Shots: `shots/a11y/pt`, `pt-large` (before the fixes), `pt-final`, `pt-final-large` (after), `pt-fit`, `pt-fit2`; `shots/` isn't committed.

Found, and fixed:

| Where | What | Fix |
|---|---|---|
| Finds tiles | Names cut with an ellipsis ("SAQUINHO DE …"); 57 of 209 need two lines at 375 px | `:lang(pt-BR)`: tile names wrap to two lines, as they already do with Larger text, with tracking .14em instead of .2em |
| Map labels | With Larger text, "SAQUINHO DE CHÁ" ran 25 px off the right edge (and so would the longer names further on) | `:lang(pt-BR)`: a label wraps within 40vw beside its stone; tracking .2em |
| Chapter card | "COLINAS DAS FOGUEIRAS", "FESTA DAS LANTERNAS" are one line in capitals, wider than 375 px (the name is `white-space: nowrap`) | `:lang(pt-BR)`: the name may take two balanced lines (measured 72..310 px of 375 for the longest) |
| Story lines | Find view, Larger text: 37 of 209 took three lines (English: 6); at normal size 2 did (English: 0) | Rewritten shorter; now 0 at normal size and 0 with Larger text at 375 px. The test's budget, 64, is the longest that remained |
| Touch page | "Toque duas vezes num 0 / numa linha cheia / no céu" took two lines each in the narrow label column, and "marcar: um cubo marcado não pode ser cinzelado" three | *Dois toques num 0*, *Dois toques no céu*…, and *marcar, a salvo do cinzel* (copy-study C4's "safe from the chisel") |
| Finds header | "205 DE 209 DESCOBERTOS" took two lines with Larger text | *205 de 209 achados*, the Finds' own word |

Checked and fine: the tool switch (CINZEL / MARCA), the ring labels (SOM, MÚSICA, VIBRAÇÃO, TEXTO MAIOR; on/off as SIM / NÃO), the help tabs (AJUSTES · REGRAS · GESTOS), the lesson and tip cards (three lines at most with Larger text, as in English), the pause (RECOMEÇAR), the result (VOCÊ DESCOBRIU, PRÓXIMA, REPETIR), the shrine card (✦ SANTUÁRIO ✦).

**Seen in English too, not changed:** the chapter card's name is also wider than a 375 px screen for "CLOCKWORK WORKSHOP" (measured −24..406 px), and with Larger text 6 English story lines take three lines in the find view. The map's "Strata" title reports as clipped in its box in every language.

English is untouched: every rule above is scoped to `html:lang(pt-BR)`, at the end of `style.css`, and `npm test` checks `index.html` against `en.js`.
