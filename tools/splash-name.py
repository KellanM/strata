# After tools/splash-name.mjs: crops the name out of shots/splash-name-full.png and
# rounds the letters' corners (blur, cut back past half, blur, cut below half -
# Kellan, 2026-10-29: the "rounded, more" look), writing public/splash-name.png
# and printing the <image> placement for index.html.   python tools/splash-name.py [radius] [out]
import sys
from PIL import Image, ImageFilter
R = float(sys.argv[1]) if len(sys.argv) > 1 else 2.5   # how round (px at 4x): 2.5 subtle (the card's), 4 more
OUT = sys.argv[2] if len(sys.argv) > 2 else 'public/splash-name.png'
im = Image.open('shots/splash-name-full.png').getchannel('A')
bb = im.getbbox(); pad = 12
box = (bb[0] - pad, bb[1] - pad, bb[2] + pad, bb[3] + pad)
a = im.crop(box).point(lambda v: 255 if v >= 128 else 0)
step = lambda a, r, cut: a.filter(ImageFilter.GaussianBlur(r)).point(lambda v: 255 if v >= cut else 0)
a = step(step(a, R, 200), R, 55).filter(ImageFilter.GaussianBlur(0.9))
Image.merge('LA', (Image.new('L', a.size, 0), a)).save(OUT, optimize=True)
x, y, w, h = box[0] / 4, box[1] / 4, (box[2] - box[0]) / 4, (box[3] - box[1]) / 4
print(f'<image href="splash-name.png" x="{x:g}" y="{y:g}" width="{w:g}" height="{h:g}"/>  (top of the letters at {bb[1] / 4:g})')
