# Two runs of tools/a11y-shots.mjs, picture by picture: how many pixels differ, and where.
#   python tools/pixel-diff.py <labelA> <labelB> [--out shots/a11y/diff-A-B]
# A pixel differs if any channel moves by more than 8 (of 255). Each pair gets a count, the box
# round what changed, and with --out a picture of it (the differing pixels in red over B, faded).
# The 3D scene moves between runs (motes, the light, the clock), so two runs of the same build
# differ a little anyway: compare against a second run of the baseline to know what that is.
import sys, os, json
from PIL import Image, ImageChops
import numpy as np

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
a, b = sys.argv[1], sys.argv[2]
out = sys.argv[sys.argv.index('--out') + 1] if '--out' in sys.argv else None
A, B = (os.path.join(ROOT, 'shots', 'a11y', x) for x in (a, b))
if out: os.makedirs(os.path.join(ROOT, out), exist_ok=True)
rows = []
for name in sorted(f for f in os.listdir(A) if f.endswith('.png')):
    pb = os.path.join(B, name)
    if not os.path.exists(pb): rows.append((name, None)); continue
    x, y = Image.open(os.path.join(A, name)).convert('RGB'), Image.open(pb).convert('RGB')
    if x.size != y.size: rows.append((name, 'size')); continue
    d = np.asarray(ImageChops.difference(x, y)).max(axis=2) > 8
    n = int(d.sum())
    box = None
    if n:
        ys, xs = np.nonzero(d)
        box = [int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())]
        if out:
            base = np.asarray(y).astype(np.float32) * 0.35 + 166
            base[d] = [230, 30, 40]
            Image.fromarray(base.clip(0, 255).astype(np.uint8)).save(os.path.join(ROOT, out, name))
    rows.append((name, (n, n / d.size, box)))
for name, r in rows:
    if r is None: print(f'{name}: missing in {b}')
    elif r == 'size': print(f'{name}: sizes differ')
    else: print(f'{name}: {r[0]} px differ ({100 * r[1]:.3f}%){" in " + str(r[2]) if r[2] else ""}')
print(json.dumps({'pairs': len(rows), 'identical': sum(1 for _, r in rows if r and r != 'size' and r[0] == 0)}))
