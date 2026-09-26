"""Probe C step 3: measure RENDERED bentoArt ink bboxes and verify vs extraction + reference."""
import numpy as np
from PIL import Image

img = Image.open('.playwright-cli/verify/promo-card-10-3/render_probe_shot.png').convert('RGB')
a = np.array(img)
H, W = a.shape[:2]
print(f'render shot: {W}x{H}')

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

# Card components (5 cards, labels below each are page bg)
rowbg = (~notbg).mean(axis=1)
bands = [r for r in runs_of(rowbg < 0.99) if r[1] - r[0] > 150]
print('bands:', bands)
cards = []
for (by0, by1) in bands:
    sub = notbg[by0:by1 + 1]
    cols = [c for c in runs_of(sub.mean(axis=0) > 0.5) if c[1] - c[0] > 200]
    for (cx0, cx1) in cols:
        cards.append((by0, by1, cx0, cx1))
print('cards:', cards)

fill = np.array([233, 224, 209])
for idx, (y0, y1, x0, x1) in enumerate(cards):
    card = a[y0:y1 + 1, x0:x1 + 1]
    ch, cw = card.shape[:2]
    d = np.abs(card.astype(int) - fill.astype(int)).sum(axis=2)
    ink = d > 30
    # art zone = trailing band (below the desc text)
    rowink = ink.sum(axis=1)
    inked = set(np.where(rowink > cw * 0.02)[0].tolist())
    ay1 = ch - 1
    while ay1 not in inked:
        ay1 -= 1
    ay0 = ay1
    while (ay0 - 1) in inked:
        ay0 -= 1
    zone = ink[ay0:ay1 + 1]
    zs = np.where(zone.any(axis=0))[0]
    print(f'card {idx}: {cw}x{ch} | zone rows {ay0}-{ay1} h={ay1-ay0+1} | zone reach x[{zs.min()},{zs.max()}] of {cw}')
