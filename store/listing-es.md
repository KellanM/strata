# Strata · App Store listing, Spanish (español)

**Approved for the store by Kellan, 2026-10-31, without a native speaker's review** (`docs/l10n/es.md` lists the open doubts).

One text for both of App Store Connect's Spanish pages, **Spanish (Spain)** and **Spanish (Mexico)**, written in the same neutral Spanish as the game (`public/i18n/es.js`): tú, no vosotros, no word that belongs to one region. Only the **Keywords** differ, because each page's field is searched by different people (see below). Paste everything else into both.

Translated from [app-store-listing.md](app-store-listing.md), for version 1.1: 200 stones (the game's count after build 7). Claims and their order follow the English. Counts are measured with a script (`node` over this file): characters for each field, and UTF-8 bytes for Keywords, which is how App Store Connect counts them (á, é, í, ó, ú and ñ are two bytes each). The in-game words follow the glossary in `docs/l10n/es.md`: piedra, cubo, figura, cincel / cincelar, marca / marcar, desliz, gema, santuario, mundo.

---

## App name (30)

```
Strata: Nonogramas de piedra
```

(28 / 30 characters)

"Stone Puzzles" becomes "Nonogramas de piedra": Spanish has no single word for "puzzle" that reads the same everywhere (puzle in Spain, rompecabezas in Mexico, and both also mean a jigsaw), and nonograma is the genre's name in both, so the name carries the most-searched genre word. The home-screen label stays **Strata**.

## Subtitle (30)

```
Juego de lógica 3D, con calma
```

(29 / 30 characters)

"A calm 3D puzzle game". Lógica and 3D are search words; "con calma" is the calm.

## Promotional text (170)

```
Cada piedra guarda un secreto. Lee los números de sus caras, cincela lo que sobra y mira cómo sale de la roca algo pequeño y precioso. Sin cronómetro. Sin anuncios.
```

(164 / 170 characters)

## Description (4000)

```
Cada piedra guarda algo dentro.

Strata es un juego tranquilo que consiste en encontrarlo. Cada nivel es un bloque de piedra con una figura escondida: un farol, un zorro dormido, un faro, un dragón demasiado joven para echar fuego. Los números de tres caras de la piedra te dicen cuántos cubos de la figura hay en cada fila. Léelos, cincela todos los cubos que no son parte de ella, y la figura irá apareciendo poco a poco.

Es un nonograma en tres dimensiones: lógica de «pintar por números», pero en piedra. Gira la piedra en tus manos, quita capas para ver dentro y avanza fila a fila hasta que solo quede la figura.

UN VIAJE POR QUINCE MUNDOS
200 piedras en 15 mundos, de Primera luz y el Jardín de musgo a la Noche de faroles, el Mar profundo y la Lluvia estelar. Cada mundo es un lugar con su propia luz y sus colores, y cada figura que descubres ocupa su sitio en el mapa como una pequeña escultura. En cada mundo espera un santuario, una piedra extra para quien reúne sus gemas.

FÁCIL DE APRENDER
Doce lecciones cortas te lo enseñan todo mientras juegas: cómo leer los números, cómo cincelar y cómo marcar los cubos que quieres conservar. A lo largo del viaje las piedras crecen y las pistas escasean, pero las reglas nunca cambian. Si te atascas, espera un momento: una fila donde puedes avanzar brillará suavemente.

A TU RITMO
Un pequeño reloj cuenta hacia arriba, pero nada se agota y el tiempo nunca te cuesta una gema. Un desliz se puede deshacer. Las gemas premian una mano firme, no una rápida.

TRANQUILO POR DISEÑO
• Funciona sin conexión
• Sin anuncios y sin rastreo
• Sin cuentas ni inicio de sesión
• Sin compras dentro de la app
• Tu progreso se queda en tu dispositivo

Busca un minuto tranquilo, toma una piedra y descubre qué guardaba.
```

(1,762 / 4000 characters)

## Keywords (100 bytes)

Comma-separated with no spaces after the commas. Neither field repeats a word from the name or subtitle (Strata, nonogramas, piedra, juego, lógica, 3D, calma), which Apple indexes already.

### Spanish (Spain)

```
puzle,puzzle,rompecabezas,acertijo,números,cubos,relajante,zen,sin conexión,mente,hanjie,tallar
```

(97 / 100 bytes; 95 characters)

Spain searches puzle (the Academy's spelling) and puzzle, and rompecabezas; números and cubos are the clue and the material; relajante and zen the mood; sin conexión is a common filter search; hanjie is the genre's other name; tallar (to carve) catches sculpting searches.

### Spanish (Mexico)

```
rompecabezas,acertijos,puzzle,números,cubos,relajante,mente,sin conexión,sculpt,pixel,mindful
```

(95 / 100 bytes; 93 characters)

The Mexico field is also indexed in the **United States** store, alongside the English (U.S.) one. So it holds what Spanish speakers in both countries type (rompecabezas, acertijos, puzzle, números, cubos, relajante, mente) plus three English words the English field doesn't have (sculpt, pixel, mindful), so they add reach in the U.S. instead of repeating it. Griddlers, hanjie, zen and offline are already in the English field, so they are left out here; picross is a Nintendo trademark and is not used in either field.

## What's New (4000), version 1.1

The English What's New is still Kellan's to choose (`docs/handoff-2026-10-31-v1.1-full.md`); this is the proposed line, translated:

```
Hecho para iPhone Duo. Una piedra nueva cada día, para compartir. Diecinueve piedras nuevas. Texto más grande. Ahora en español, japonés y chino.
```

(145 / 4000 characters)

## Notes for the reviewer

- **Stars → gemas.** The English description says "stars"; the game calls them gems (◆), so this says gemas, the game's word, as the Japanese and Chinese pages do.
- **"A bonus stone"** is written "un santuario, una piedra extra" so the store word matches the map's.
- **Chapter names** are the in-game ones (Primera luz, Jardín de musgo, Noche de faroles, Mar profundo, Lluvia estelar).
- **"Pintar por números"** is how many Spanish speakers know the genre; it is said once, in quotes, as a description, not a claim about painting.
- **Screenshots** can reuse the English ones for now, as the Japanese and Chinese pages do.
