"""Probe D: verify the RE-TAKEN business-landing baseline renders the bleed
adoption — art ink bands mid-card (not collapsed), flush bottom, pill present."""
import numpy as np
from PIL import Image

img = Image.open('tests/visual/visual.spec.ts-snapshots/visual-showcase-business-landing--business-landing-light-1-chromium.png').convert('RGB')
a = np.array(img)
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
bands = [r for r in runs_of(rowbg < 0.995) if r[1] - r[0] > 200 and 1000 < r[0] < 1900]
cards = []
for (by0, by1) in bands:
    sub = notbg[by0:by1 + 1]
    cols = [c for c in runs_of(sub.mean(axis=0) > 0.5) if c[1] - c[0] > 200]
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
    inked = rowink > cw * 0.02
    brs = [r for r in runs_of(inked) if r[1] - r[0] >= 4]
    # pill: white run 90-150 wide containing center, in bottom half
    center = (cw - 1) / 2
    pill = []
    for y in range(ch // 2, ch):
        for s, e in runs_of(white[y]):
            if 90 <= e - s + 1 <= 150 and s <= center <= e:
                pill.append(y)
                break
    desc = ', '.join(f'{b0}-{b1}(h{b1-b0+1})' for b0, b1 in brs)
    pilltxt = f'rows {min(pill)}-{max(pill)}' if pill else 'NONE'
    print(f'card {idx}: {cw}x{ch} | bands: {desc} | pill {pilltxt}')
