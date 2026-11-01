// Strata's words, in English: the source every other table translates, and the fallback for any
// key a table is missing (public/js/i18n.js). Two kinds of string:
//   - the interface's, below, by key. `{name}` is filled in; an object picks by number
//     ({ zero, one, other }, Intl.PluralRules); a key ending `.html` may hold <b> and <br>, and
//     {g1}, {g2} stand for the element's own icons, kept as they are (index.html).
//   - the game's own, read from the data where they are written (shapes.js): every object's
//     name and story line by its id, the chapters' names, lines and blurbs, the lessons' names
//     and hints. data() lists them under the keys the other tables use.
// English is never rewritten on the page: index.html already holds it, and t() gives back these
// strings exactly (test/i18n.test.js checks the page against them).
import { SHAPES, BONUS, CHAPTERS, TUTORIAL, TUTORIAL_V2 } from '../js/shapes.js';

export const reviewed = true;

export const strings = {
  // ---- index.html, set at boot from data-i18n (only in a language other than English)
  'doc.title': 'Strata — 3D Nonograms',
  'hud.menu': 'Menu',
  'hud.mistakes': 'mistakes',
  'hud.rewind': 'Take back your last slip',
  'coach.skip': 'skip',
  'tool.group': 'Tool',
  'tool.chisel': 'Chisel',
  'tool.mark': 'Mark',
  'title.aria': 'Strata. Touch the glowing stone, then tap to begin',
  'title.sub': 'peel the stone · find the shape',
  'title.tap.html': '{g1}tap to begin',
  'map.aria': 'Puzzles',
  'map.menu': 'Menu',
  'map.finds': 'Finds',
  'map.today': 'Today',
  'map.todayAria': 'Today’s stone',
  'map.resume': 'Resume',
  'map.resumeAria': 'Back to the puzzle',
  'finds.title': 'Finds',
  'finds.close': 'Close your finds',
  'finds.drag': 'drag to turn',
  'finds.back': 'Back to your finds',
  'help.aria': 'Settings and how to play',
  'help.close': 'Close',
  'help.settings': 'Settings',
  'help.rules': 'Rules',
  'help.touch': 'Touch',
  'set.sound': 'Sound',
  'set.music': 'Music',
  'set.vibration': 'Vibration',
  'set.larger': 'Larger text',
  'set.on': 'on',
  'set.off': 'off',
  'ads.free': 'Strata is free. Remove ads and support it.',
  'ads.remove': 'Remove ads · $1.99',
  'ads.perk': 'then taking back a slip and opening shrines need no ad',
  'ads.restore': 'restore purchase',
  'ads.nothing': 'nothing to restore',
  'ads.thanks': 'Thank you for keeping Strata whole.',
  'ads.gone': 'every ad gone, for good',
  'home.best.html': '<b>Best on your Home Screen</b>: full screen, with sound, and it plays offline.',
  'home.how.html': '<b>iPhone:</b> Safari\'s {g1} then <b>Add to Home Screen</b>.<br> <b>Android:</b> Chrome\'s {g2} then <b>Add to Home screen</b> (or <b>Install app</b>); Samsung Internet\'s {g3} then <b>Add page to → Home screen</b>.',
  'glyph.share': 'Share',
  'glyph.menu': 'menu',
  'rules.lead.html': 'Every stone hides an object. <b>Chisel</b> away every cube that isn\'t part of it.',
  'rules.plain': '3 of the object\'s cubes are in this row, running across, down or back',
  'rules.circle': 'they\'re split into two groups',
  'rules.square': 'three groups or more',
  'rules.slip': 'a slip: you chiselled a cube that belongs. It\'s kept for you',
  'rules.gems': 'for no slips, two for a few, one for finishing. No rush',
  'rules.aside.html': 'Stuck? Wait a moment and a row with a move will glow. A slip can be taken back with <b>↺</b>, so a stone can still be finished clean.',
  'touch.tap': 'Tap',
  'touch.tapDo': 'chisel a cube',
  'touch.hold': 'Hold',
  'touch.holdMouse': 'Right-click',
  'touch.holdDo': 'mark it: a marked cube can\'t be chiselled',
  'touch.zero': 'Double-tap a 0',
  'touch.zeroMouse': 'Double-click a 0',
  'touch.zeroDo': 'clear its whole row',
  'touch.full': 'Double-tap a full row',
  'touch.fullMouse': 'Double-click a full row',
  'touch.fullDo': 'on Mark, mark it all',
  'touch.drag': 'Drag',
  'touch.dragDo': 'turn the block',
  'touch.pinch': 'Pinch',
  'touch.pinchMouse': 'Scroll',
  'touch.pinchDo': 'zoom',
  'touch.slide': 'Slide a ◆',
  'touch.slideDo': 'peel layers away to see inside',
  'touch.sky': 'Double-tap the sky',
  'touch.skyMouse': 'Double-click the sky',
  'touch.skyDo': 'reset the view',
  'touch.menu': 'Menu ≡',
  'touch.menuDo': 'resume, the map, or retry',
  'foot.privacy': 'Privacy',
  'foot.support': 'Support',
  'win.aria': 'Solved',
  'win.uncovered': 'you uncovered',
  'act.aria': 'Next steps',
  'act.map': 'Map',
  'act.next': 'Next',
  'act.replay': 'Replay',
  'act.share': 'Share',
  'act.challenge': 'Challenge',
  'install.aria': 'Add Strata to your Home Screen',
  'install.title': 'Strata is best on your Home Screen',
  'install.why': 'full screen · with sound · plays offline',
  'install.ios.html': 'Tap {g1} then <b>Add to Home Screen</b>',
  'install.android.html': 'Tap {g1} then <b>Add to Home screen</b> or <b>Install app</b>',
  'install.samsung.html': 'Tap {g1} then <b>Add page to</b> → <b>Home screen</b>',
  'install.go': 'Install',
  'install.later': 'Later',
  'offer.no': 'Not now',
  'pause.aria': 'Paused',
  'pause.resume': 'Resume',
  'pause.map': 'Map',
  'pause.rulesAria': 'Rules: what the numbers mean',
  'pause.rules': 'Rules',
  'pause.retry': 'Retry',

  // ---- main.js
  'hud.lesson': 'lesson {n} of {total}',
  'hud.daily': 'Daily #{n}',
  'hud.today': 'today’s stone',
  'hud.shrine': '✦ Shrine',
  'hud.number': 'No. {n}',
  'hud.drift': 'Drift',
  'hud.rewindCount': 'Take back your last slip ({n} so far)',
  'shrine.numeral': '✦ The Shrine of ✦',
  'shrine.line': 'Kept for those who earned its light.',
  'win.drift': 'carved from the drift',
  'win.dayOf': 'the stone of {date}',
  'share.copy': 'Copy your line',
  'share.copied': 'Copied',
  'today.aria': 'Today’s stone, Daily {n}',
  'today.ariaDone': 'Today’s stone, Daily {n}: solved',
  'today.done': 'Daily #{n} · done for today',
  'slips': { zero: 'no slips', one: '1 slip', other: '{n} slips' },
  'days.run': '{n} days in a row',
  'coach.first': 'Numbers now sit on three faces. Each counts the object’s cubes in its row: across, down or back.',
  'remind.circle': 'A circled number: two pieces with a gap between, like the cat’s two ears.',
  'remind.circle.old': 'A circled number: that row’s cubes are in two groups, with a gap between.',
  'remind.square': 'A squared number: three pieces or more, like the points of the crown.',
  'remind.square.old': 'A square: that row’s cubes are in three groups or more.',
  'remind.blank': 'One face shows no numbers at all. The other two are enough.',
  'remind.peel': 'Some cubes are inside. Slide a diamond along its line to lift layers off and see in.',
  'remind.mark': 'Sure a cube stays? Hold it to mark it, and it can’t be chiselled by mistake.',
  'pause.startOver': 'Start over?',
  'lessons.title': 'Lessons',
  'lessons.close': 'Close',
  'world.all': 'every stone opened',
  'map.waits': 'the day’s stone waits',
  'map.progress': '{done} of {total} uncovered',
  'map.toUncover': '{n} stones to uncover',
  'loading': 'carving',
  'ad.breath.html': 'a short ad,<br>then the map',
  'rewind.ask': 'Take back your last slip?',
  'rewind.clean': 'a clean stone keeps all three ◆',
  'rewind.cap': 'that’s all for today',
  'rewind.watch': 'Watch an ad',
  'shrine.opensAt': 'This shrine opens at {n} gems.',
  'shrine.gathered': '{n} gathered so far',
  'shrine.openIt': 'Open it',
  'shrine.watch': 'Watch to open',
  'version.checking': 'checking…',

  // ---- map.js
  'map.lockedWorld': 'Locked world',
  'map.drift': 'Drift',
  'map.driftSub': 'endless · carved at random',
  'map.learn': 'Learn',
  'map.completed': 'completed',
  'map.lessons': '{n} lessons',
  'map.lessonsFirst': '{n} lessons first',
  'map.learnAria': 'Learn: {n} short lessons',
  'map.learnAriaDone': 'Learn: {n} short lessons, completed',
  'map.driftMeta': 'drift',
  'map.driftAria': 'Drift: random {n} by {n} by {n} puzzle',
  'map.shrine': 'Shrine',
  'map.open': 'open',
  'map.shrineAria': '{chapter} shrine',
  'map.puzzleAria': 'Puzzle {n}',
  'map.solvedAria': ', {name}, solved',
  'map.opensAtAria': ', opens at {n} gems',
  'map.lockedAria': ', locked',
  'gems.aria': '{n} of 3 gems',

  // ---- journal.js (Finds)
  'finds.count': '{found} of {total} uncovered',
  'finds.complete': 'complete',
  'finds.have': '{have} of {total}',
  'finds.tileAria': '{name}, {n} of 3 gems',
  'finds.shrine': 'shrine',
  'finds.shrineAria': 'A shrine, not yet opened',
  'finds.notYet': 'Not yet uncovered',
  'finds.ahead': 'Still ahead',
  'finds.worlds': { one: '{n} world', other: '{n} worlds' },
  'finds.stones': '{n} stones',

  // ---- finale.js (the result's score, drawn in the scene)
  'result.best': 'BEST',

  // ---- daily.js (the share line: its first line, "Strata · Daily #N", is the same in every language)
  'share.invite': 'One 3D logic puzzle a day. One answer, no guessing.',
};

// The game's own words, from the data, by the keys every table uses:
//   name.<id>, story.<id>              every object (levels and shrines) and every lesson
//   chapter.<slug>.name|line|blurb     the fifteen worlds (slug: 'first-light')
//   hint.<lesson id>.<k>.text|mouse|mistake   a lesson's lines, in order
export const slug = (name) => name.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '');
export function data() {
  const out = {};
  for (const s of [...SHAPES, ...BONUS]) {
    out[`name.${s.id}`] = s.name;
    if (s.story) out[`story.${s.id}`] = s.story;
  }
  for (const c of CHAPTERS) for (const f of ['name', 'line', 'blurb']) out[`chapter.${slug(c.name)}.${f}`] = c[f];
  for (const l of [...TUTORIAL, ...TUTORIAL_V2]) {
    out[`name.${l.id}`] = l.name;
    l.hints.forEach((h, k) => { for (const f of ['text', 'mouse', 'mistake']) if (h[f]) out[`hint.${l.id}.${k}.${f}`] = h[f]; });
  }
  return out;
}
