// One-time save migrations, run before anything reads the save.
//
// Gallery page 9 gave four chapters new shrines, and each old shrine object
// became a regular level in its chapter. A shrine's id comes from its chapter
// name (shapes.js bonus), so it stayed the same while the object changed: a
// save that solved the Frog shrine would show the Moss Tortoise solved. This
// moves each old shrine solve (time, mistakes, stars, score) to the level's
// new id, clears the shrine so the new one waits unsolved, and carries the
// map's per-object memory (seen objects, the companion's stone) along with it.
// It runs once (flag key) and is safe to run again.
export const SHRINE_MOVES = {
  'bonus-moss-garden': 'frog',
  'bonus-the-lagoon': 'whale',
  'bonus-ember-steps': 'paper-lantern',
  'bonus-clockwork-workshop': 'gear-train',
};
export const SHRINE_FLAG = 'strata.migrated.shrines-p9';

function read(store, key, fallback) {
  try { return JSON.parse(store.getItem(key) ?? 'null') ?? fallback; } catch { return fallback; }
}

// the better of two records for one object, field by field (as main.js keeps a best)
function best(a, b) {
  if (!a) return b;
  if (!b) return a;
  const min = (k) => Math.min(a[k] ?? Infinity, b[k] ?? Infinity);
  const max = (k) => Math.max(a[k] ?? 0, b[k] ?? 0);
  const out = { ...b, ...a, time: min('time'), mistakes: min('mistakes'), score: max('score') };
  if (a.stars != null || b.stars != null) out.stars = max('stars');
  return out;
}

export function migrateSaves(store = globalThis.localStorage) {
  if (!store) return false;
  try {
    if (store.getItem(SHRINE_FLAG)) return false;
    const solved = read(store, 'strata.solved', {});
    const seen = read(store, 'strata.map.objects', []);
    let solvedChanged = false, seenChanged = false;
    for (const [from, to] of Object.entries(SHRINE_MOVES)) {
      if (solved[from]) {
        solved[to] = best(solved[from], solved[to]);
        delete solved[from];
        solvedChanged = true;
      }
      const at = Array.isArray(seen) ? seen.indexOf(from) : -1;
      if (at >= 0) {
        seen.splice(at, 1);
        if (!seen.includes(to)) seen.push(to);
        seenChanged = true;
      }
      if (store.getItem('strata.map.companion') === from) store.setItem('strata.map.companion', to);
    }
    if (solvedChanged) store.setItem('strata.solved', JSON.stringify(solved));
    if (seenChanged) store.setItem('strata.map.objects', JSON.stringify(seen));
    store.setItem(SHRINE_FLAG, '1');
    return solvedChanged;
  } catch {
    return false;   // storage unavailable (private mode): nothing to carry over
  }
}
