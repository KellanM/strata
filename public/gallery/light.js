// Candidates are shown as the game will show them: every level takes the
// dithered light of shapes.js (lit(), the Heart's look, Kellan 2026-10-23)
// when it loads, so a candidate is judged lit, not flat. An entry may carry
// `lit: { span, swap, keep }` (the options lit() takes, which go into LIT in
// shapes.js when it becomes a level) or `lit: false` for a hand-made ramp
// (then the level goes in LIT_SKIP). ?flat=1 shows the flat colours.
import { lit } from '../js/shapes.js';

const FLAT = new URLSearchParams(location.search).has('flat');
// page 14's hand-ramped pieces (the ones that became levels are in LIT_SKIP)
const HAND = new Set(['cand-p14-amber', 'cand-p14-astrolabe', 'cand-p14-orrery']);

export const asInGame = (s) => (FLAT || s.lit === false || HAND.has(s.id) ? s : lit(s, s.lit || {}));
