import math, random
random.seed(21)
FILE = 'public/index.html'
s = open(FILE, encoding='utf-8', newline='').read()
eol = '\r\n' if '\r\n' in s else '\n'
DX, DY, RIM = 195, 300, 131
c = math.radians(-50)
ix, iy = DX + math.cos(c) * RIM, DY + math.sin(c) * RIM
inward = c + math.pi
segs, paths = [], {}
def grow(x, y, a, length, w, depth, key):
    pts = [(x, y)]; run = 0
    while run < length:
        step = random.uniform(6, 11)
        a += math.radians(random.gauss(0, 3.2))
        nx, ny = x + math.cos(a) * step, y + math.sin(a) * step
        if math.hypot(nx - DX, ny - DY) > RIM + 2: break
        ww = max(0.45, w * (1 - run / length * 0.7))
        segs.append((x, y, nx, ny, ww)); x, y = nx, ny; run += step; pts.append((x, y))
        if depth < 2 and run > 14 and random.random() < 0.13:
            grow(x, y, a + math.radians(random.choice([-1, 1]) * random.uniform(14, 28)),
                 (length - run) * random.uniform(0.4, 0.75), ww * 0.75, depth + 1, None)
    if key is not None: paths[key] = pts
fan = [-74, -55, -36, -19, -5, 9, 24, 41, 60, 78]
for k, d in enumerate(fan):
    a = inward + math.radians(d + random.uniform(-4, 4))
    sa = c + math.radians(d * 0.06 + random.uniform(-1, 1))   # its own point on the rim
    grow(DX + math.cos(sa) * (RIM - 1), DY + math.sin(sa) * (RIM - 1), a, random.uniform(40, 110) * (1 - abs(d) / 160), 1.05, 0, k)
def at(pts, dist):
    best = None
    for q in pts:
        d = math.hypot(q[0] - ix, q[1] - iy)
        if best is None or abs(d - dist) < abs(best[1] - dist): best = (q, d)
    return best[0] if best and abs(best[1] - dist) < 7 else None
arcs = []
for ring, chance, w in [(10, 0.9, 1.0), (21, 0.75, 0.9), (36, 0.5, 0.75), (55, 0.3, 0.6)]:
    for k in range(len(fan) - 1):
        if random.random() > chance or k not in paths or k + 1 not in paths: continue
        a1, b1 = at(paths[k], ring + random.uniform(-3, 3)), at(paths[k + 1], ring + random.uniform(-3, 3))
        if not a1 or not b1: continue
        mx, my = (a1[0] + b1[0]) / 2, (a1[1] + b1[1]) / 2
        bx, by = mx + (mx - ix) * 0.08, my + (my - iy) * 0.08
        arcs.append('<path class="crack" style="stroke-width:%.2f" d="M%.1f %.1fQ%.1f %.1f %.1f %.1f"/>' % (w, a1[0], a1[1], bx, by, b1[0], b1[1]))
crush = []
for t in range(26):
    a = inward + math.radians(random.uniform(-95, 95)); r0 = random.uniform(0, 6); r1 = r0 + random.uniform(2, 7)
    crush.append('<line class="crack" style="stroke-width:.6" x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f"/>' % (ix + math.cos(a) * r0, iy + math.sin(a) * r0, ix + math.cos(a + .3) * r1, iy + math.sin(a + .3) * r1))
chips = []
for off, size in [(0, 6.5), (-5.5, 3.5), (4.8, 4), (-9, 2.2)]:
    a = c + math.radians(off); cxp, cyp = DX + math.cos(a) * (RIM + 2), DY + math.sin(a) * (RIM + 2)
    chips.append('<circle class="chip" cx="%.1f" cy="%.1f" r="%.1f"/>' % (cxp, cyp, size))
L = ['<line class="crack" style="stroke-width:%.2f" x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f"/>' % (w, x1, y1, x2, y2) for x1, y1, x2, y2, w in segs]
body = L + arcs
i = s.index('        <!-- the light cracked like glass where the rock is looking')
j = s.index('        </g>', s.index('<g clip-path="url(#sr-disc-clip)">')) + len('        </g>') + len(eol)
new = ('        <!-- the light cracked like glass where the rock is looking: an impact on\n'
       '             the rim, a crush of tiny fractures there and a few chips knocked out,\n'
       '             radial cracks running in (nearly straight, kinking, now and then\n'
       '             forking, thinning as they go), and short arcs joining them near the\n'
       '             impact, sparser further in (generated once by a script) -->\n'
       '        <g clip-path="url(#sr-disc-clip)">\n          ' + '\n          '.join(body) + '\n        </g>\n').replace('\n', eol)
s = s[:i] + new + s[j:]
s = s.replace('#splash .crack { fill: none; stroke: #2a2a2a !important; stroke-width: 1;', '#splash .crack { fill: none; stroke: #111 !important;')
open(FILE, 'w', encoding='utf-8', newline='').write(s)
print(len(segs), 'segments', len(arcs), 'arcs')
