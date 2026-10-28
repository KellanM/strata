# Icon candidates as iOS would show them: rounded mask, at 180 and 60 px, on light and dark ground
import sys
from PIL import Image, ImageDraw, ImageFont
files = sys.argv[2:]; out = sys.argv[1]
def mask(im, s):
    im = im.convert('RGB').resize((s, s), Image.LANCZOS)
    m = Image.new('L', (s * 4, s * 4), 0); ImageDraw.Draw(m).rounded_rectangle([0, 0, s * 4 - 1, s * 4 - 1], radius=int(s * 4 * 0.224), fill=255)
    o = Image.new('RGBA', (s, s)); o.paste(im, (0, 0), m.resize((s, s), Image.LANCZOS)); return o
font = ImageFont.truetype('C:/Windows/Fonts/arial.ttf', 22)
W = 420; sheet = Image.new('RGB', (W * len(files), 420), (242, 242, 247)); d = ImageDraw.Draw(sheet)
for k, f in enumerate(files):
    im = Image.open(f); x = k * W + 20
    sheet.paste(mask(im, 240), (x, 20), mask(im, 240))
    sheet.paste(mask(im, 60), (x + 260, 20), mask(im, 60))
    d.rectangle([x + 250, 100, x + 330, 180], fill=(20, 20, 24)); sheet.paste(mask(im, 60), (x + 260, 110), mask(im, 60))
    d.text((x, 280), f.split('/')[-1].replace('.png', ''), fill=(40, 40, 50), font=font)
sheet.save(out)
