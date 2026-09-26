"""Ground truth check B: segment baseline bento cards; does the stage art render?"""
import numpy as np
from PIL import Image

img = Image.open('tests/visual/visual.spec.ts-snapshots/visual-showcase-business-landing--business-landing-light-1-chromium.png').convert('RGB')
a = np.array(img)
H, W = a.shape[:2]
pagebg = np.array([241, 238, 232])
notbg = np.abs(a.astype(int) - pagebg.astype(int)).sum(axis=2) > 24

def runs_of(mask):
    out, start = [], None
    for i, v in enumerate(mask):
        if v and start is None:
            start = i
        elif not v and start is not None:
            out.append((start, i - 1))
            start = None
    if start is not None:
        out.append((start, len(mask) - 1))
    return out

rowbg = (~notbg).mean(axis=1)
bands = [r for r in runs_of(rowbg < 0.995) if r[1] - r[0] > 200 and 1000 < r[0] < 1700]
print('bands in bento range:', bands)
cards = []
for (by0, by1) in bands:
    sub = notbg[by0:by1 + 1]
    cols = [c for c in runs_of(sub.mean(axis=0) > 0.5) if c[1] - c[0] > 200]
    print(f'band {by0}-{by1}: cols {cols}')
    for c in cols:
        cards.append((by0, by1, c[0], c[1]))

fill = np.array([233, 224, 209])
for idx, (y0, y1, x0, x1) in enumerate(cards):
    card = a[y0:y1 + 1, x0:x1 + 1]
    ch, cw = card.shape[:2]
    d = np.abs(card.astype(int) - fill.astype(int)).sum(axis=2)
    ink = d > 30
    r, g, b = card[:, :, 0].astype(int), card[:, :, 1].astype(int), card[:, :, 2].astype(int)
    colorful = (np.abs(r - g) + np.abs(g - b) + np.abs(r - b)) > 60
    white = (card[:, :, 0] >= 244) & (card[:, :, 1] >= 244) & (card[:, :, 2] >= 244)
    anyink = ink | colorful | white
    rowink = anyink.sum(axis=1)
    inked = set(np.where(rowink > cw * 0.02)[0].tolist())
    # trailing band touching bottom
    ay1 = ch - 1
    while ay1 not in inked and ay1 > ch // 2:
        ay1 -= 1
    if ay1 <= ch // 2:
        print(f'card {idx}: {cw}x{ch} — NO trailing art band')
        continue
    ay0 = ay1
    while (ay0 - 1) in inked:
        ay0 -= 1
    zone = anyink[ay0:ay1 + 1]
    zs = np.where(zone.any(axis=0))[0]
    print(f'card {idx}: {cw}x{ch} | trailing band rows {ay0}-{ay1} h={ay1-ay0+1} | reach x[{zs.min()},{zs.max()}] '
          f'({100.0*(zs.max()-zs.min()+1)/cw:.1f} pct of card w)')
