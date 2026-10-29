# The splash card's chalk splotches (index.html #splash .slaps): the logo is put down in dabs of
# chalk slapped on one after another, each showing its patch of the logo through one of these
# shapes - an irregular blob, its edge grainy as chalk dragged on a board. White where the chalk
# is, clear elsewhere (used as a mask).
#   public/chalk-splotch-1.png .. -3.png        python tools/chalk-splotch.py
# Kellan, 2026-10-29: "splotches of chalk slapped down in a rolling fashion".
import math, random
from PIL import Image, ImageFilter

N = 128   # px; drawn at about 84 css px on the card


def splotch(seed):
    rnd = random.Random(seed)
    # a blob: a lumpy radius round the centre, a few low harmonics
    harm = [(k, rnd.uniform(0.05, 0.14) / k ** 0.4, rnd.uniform(0, 2 * math.pi)) for k in range(2, 7)]
    im = Image.new('L', (N, N), 0)
    px = im.load()
    c = N / 2
    for y in range(N):
        for x in range(N):
            dx, dy = (x - c) / c, (y - c) / c
            r, a = math.hypot(dx, dy), math.atan2(dy, dx)
            edge = 0.8 + sum(h * math.sin(k * a + p) for k, h, p in harm)
            d = (edge - r) / 0.16            # 1 inside, 0 at the edge
            if d <= 0:
                continue
            # chalk: solid inside, thinning to grains toward the edge
            keep = min(1, d) ** 0.7
            if rnd.random() < keep * (0.86 + 0.14 * min(1, d * 1.5)):
                px[x, y] = 255
    return im.filter(ImageFilter.GaussianBlur(0.45))


for i in range(3):
    splotch(11 + i * 7).save(f'public/chalk-splotch-{i + 1}.png', optimize=True)
print('ok')
