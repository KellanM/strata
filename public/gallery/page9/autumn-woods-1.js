// Page 9 · ✦V Autumn Woods: a guardian alternative to the Cider Press.
// A great bear asleep for the winter, curled with its chin on its paws and a
// blanket of fallen leaves over its back: the woods' sleeping colossus.
// The sky runs amber to russet, so the bear is deep brown, leaves on top.
import { grid } from '../voxel.js';
import { INK, pair, front, pairFront, tint, onSurface } from './kit.js';

const fur = 0x7a4a32, furDk = 0x5a3624, muzzle = 0xd9b48a, red = 0xd9452f, orange = 0xec7a2c, gold = 0xf0b43a,
  moss = 0x6f9a4a, cap = 0xd9413a, stem = 0xf3eadc;

export default [
  // the great bear: a big brown sleeping mound, its head resting on its front
  // paws, eyes shut, a pale muzzle, leaves fallen all over its back and a
  // small red mushroom grown up beside one ear
  (() => {
    const g = grid(9, 6, 8);
    g.ellipsoid([4, 2.6, 3], [4.3, 2.9, 3.3], fur);
    g.ellipsoid([4, 1.8, 6.1], [2.3, 1.8, 1.7], fur);
    g.box([1, 2], [0, 0], [5, 7], furDk).box([6, 7], [0, 0], [5, 7], furDk);
    pair(g, 3, 4, 6, furDk);                                                      // ears
    for (const x of [3, 4, 5]) front(g, x, 1, muzzle);
    front(g, 4, 2, INK); pairFront(g, 3, 3, INK);                                 // nose, closed eyes
    tint(g, (x, y, z) => y >= 4 && z <= 4 && onSurface(g, x, y, z), (x, y, z) => [red, orange, gold, fur][(x * 3 + z * 2 + y) % 4]);
    g.set(2, 4, 5, stem).set(2, 5, 5, cap);
    return { ...g.entry({ id: 'cand-p9-great-bear', name: 'Great Bear' }), fraction: 0.7, seed: 7, story: 'The woods go quiet all winter, so as not to wake it.' };
  })(),
];
