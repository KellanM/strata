// Page 9 · ✦XI Clockwork Workshop: a landmark alternative to the Gear Train.
// The workshop's clock tower: brick, a clock face front and back, brass gears
// turning on both flanks, a bell in an open belfry, a verdigris roof.
// The sky runs dark wood to brass, so cream faces and teal roof carry it.
import { grid } from '../voxel.js';
import { quad, tint } from './kit.js';

const brick = 0xa8503a, brickDk = 0x84402e, face = 0xf6efe4, hand = 0x3a3442, brass = 0xe0b04a, brassDk = 0x9c7230,
  verd = 0x4fb3a9, verdDk = 0x3a8a86, wood = 0x6b4a3a, gold = 0xf2c14e;

export default [
  // the clock tower: a brick tower on a brass-trimmed plinth, a cream clock
  // face at three o'clock on front and back, a geared wheel on each side,
  // the bell hung in the belfry, a green copper roof with a gold spire
  (() => {
    const g = grid(7, 10, 7);
    g.box([0, 6], [0, 0], [0, 6], brassDk).box([1, 5], [1, 5], [1, 5], brick);
    tint(g, (x, y, z) => (x === 1 || x === 5) && (z === 1 || z === 5) && y % 2 === 1, brickDk);
    g.box([3, 3], [1, 2], [5, 5], wood);
    for (const z of [1, 5]) {
      g.box([2, 4], [4, 4], [z, z], face).box([3, 3], [3, 5], [z, z], face);
      g.set(3, 4, z, brassDk).set(3, 5, z, hand).set(z === 5 ? 4 : 2, 4, z, hand);
    }
    for (const x of [0, 6]) {
      g.box([x, x], [3, 5], [2, 4], brass).set(x, 4, 3, brassDk);
      g.set(x, 2, 3, brassDk).set(x, 6, 3, brassDk).set(x, 4, 1, brassDk).set(x, 4, 5, brassDk);
    }
    for (let y = 6; y <= 7; y++) quad(g, 1, y, 1, brickDk);
    g.box([2, 4], [6, 6], [3, 3], gold).box([3, 3], [6, 6], [2, 4], gold).set(3, 7, 3, gold);
    g.box([0, 6], [8, 8], [0, 6], verdDk).box([1, 5], [8, 8], [1, 5], verd);
    g.box([2, 4], [9, 9], [3, 3], verd).box([3, 3], [9, 9], [2, 4], verd).set(3, 9, 3, gold);
    return { ...g.entry({ id: 'cand-p9-clock-tower', name: 'Clock Tower' }), fraction: 1, seed: 8, story: 'Every clock in the workshop is set by this one.' };
  })(),
];
