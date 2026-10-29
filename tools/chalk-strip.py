# The splash card's chalk (index.html #splash .chalk): two black covers over the
# sticker, each twice its width, that slide by transform (so they keep moving
# while the game loads behind the card - a mask, moved on the main thread, froze).
#   public/chalk-draw.png  rough edge then black: slides off to the right, the
#                          sticker appearing behind its edge as if drawn in chalk
#   (the erase is the same cover, mirrored: index.html @keyframes chalk-wipe)
# Kellan, 2026-10-29: "chalk on a blackboard ... then it is quickly erased again", the erase
# symmetrical to the drawing.
#   python tools/chalk-strip.py
import random
from PIL import Image, ImageFilter
U, H = 200, 172                      # one sticker-width; the sticker's height
random.seed(7)

def cover(name, edge):
    im = Image.new('L', (2 * U, H), 0)
    px = im.load()
    for y in range(H):
        for x in range(2 * U):
            px[x, y] = int(edge(x, y))
    im = im.filter(ImageFilter.GaussianBlur(0.5))
    Image.merge('LA', (Image.new('L', im.size, 0), im)).save(f'public/{name}', optimize=True)

# the drawn edge: strokes about a letter tall, each ending at its own place, grainy
ends = [0.25 * U + 0.12 * U * ((s * 37) % 5) / 4 for s in range(H // 6 + 1)]
def draw(x, y):
    d = (x - ends[y // 6] - random.uniform(-3, 3)) / (0.3 * U)
    p = min(1, max(0, 0.5 + d))                    # chance this grain is still covered
    return 255 if random.random() < p ** 1.4 else 0

cover('chalk-draw.png', draw)
