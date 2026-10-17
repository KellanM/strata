# Strata — 3D nonograms

Peel-the-layers picross in three.js with Monument Valley–style lighting.

```
npm install
npm start          # prints a LAN URL to open on phones on the same Wi-Fi
npm test           # puzzle solver tests
```

**Play.** Tap to chisel away cubes that aren't part of the shape. Hold (or right-click) to mark a cube you know stays. Drag to rotate, pinch to zoom, and use the slider to peel layers along X / Y / Z (⇄ peels from the other side).

**Clues.** The number on a face is how many cubes in that row stay. Circled means they're split into 2 groups, squared means 3 or more. Every puzzle is checked so it can be solved by line logic alone, with as many clues hidden as possible.

**Keyboard.** `C` chisel · `M` mark · `Z` undo · `1/2/3` peel axis · `[` `]` peel.
