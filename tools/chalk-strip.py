# The splash card's chalk (index.html #splash .art's mask): a strip five times the
# card's width - clear, an eraser's soft smudged edge, chalk, a drawn edge rough
# the way chalk drags, clear. Sliding it across the card draws the sticker on as
# if in chalk on a blackboard, holds, and wipes it off again (Kellan, 2026-10-29).
#   python tools/chalk-strip.py   -> public/chalk-strip.png
import random
from PIL import Image, ImageFilter
U, H = 160, 200                      # one card-width, and the strip's height
W = 5 * U
random.seed(7)
im = Image.new('L', (W, H), 0)
px = im.load()
for y in range(H):
    stroke = y // 6                                      # strokes about a letter tall (the sticker is a quarter of the card)
    draw_at = 3 * U + 0.15 * U * ((stroke * 37) % 5) / 4 + random.uniform(-3, 3)   # the drawn edge: each stroke ends at its own place
    erase_at = 1 * U + 0.5 * U + 6 * ((y // 4) % 3) + random.uniform(-2, 2)        # the eraser's edge: wide, swept in a few bands
    for x in range(W):
        if x < U: v = 0
        elif x < 2 * U:                                   # the eraser: soft, leaving a smudge that fades in
            d = (x - erase_at) / (0.45 * U)
            v = 255 * min(1, max(0, 0.5 + d)) * (0.75 + 0.25 * random.random())
        elif x < 3 * U: v = 255
        elif x < 4 * U:                                   # the chalk's edge: grainy, streaky along the stroke
            d = (x - draw_at) / (0.35 * U)
            p = min(1, max(0, 0.5 - d))
            v = 255 if random.random() < p ** 1.4 else 0
        else: v = 0
        px[x, y] = int(v)
im = im.filter(ImageFilter.GaussianBlur(0.5))
Image.merge('LA', (Image.new('L', (W, H), 0), im)).save('public/chalk-strip.png', optimize=True)
