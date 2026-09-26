"""Probe C step 2 (fixed pill detection): reference ART INK bbox per card, pill excluded."""
import numpy as np
from PIL import Image

img = Image.open('.playwright-cli/captures-v2/business/pattern-products-grid.png').convert('RGB')
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
bands = [r for r in runs_of(rowbg < 0.995) if r[1] - r[0] > 60]
cards = []
for (by0, by1) in bands:
    sub = notbg[by0:by1 + 1]
    cols = [c for c in runs_of(sub.mean(axis=0) > 0.5) if c[1] - c[0] > 100]
    for (cx0, cx1) in cols:
        cards.append((by0, by1, cx0, cx1))

print('Per-card reference ART INK bbox (pill rows excluded):')
for idx, (y0, y1, x0, x1) in enumerate(cards):
    card = a[y0:y1 + 1, x0:x1 + 1]
    ch, cw = card.shape[:2]
    fill = np.array([233, 224, 209])
    d = np.abs(card.astype(int) - fill.astype(int)).sum(axis=2)
    ink = d > 30
    r, g, b = card[:, :, 0].astype(int), card[:, :, 1].astype(int), card[:, :, 2].astype(int)
    colorful = (np.abs(r - g) + np.abs(g - b) + np.abs(r - b)) > 60
    white = (card[:, :, 0] >= 244) & (card[:, :, 1] >= 244) & (card[:, :, 2] >= 244)
    anyink = ink | colorful | white
    center = (cw - 1) / 2

    # Pill rows: bottom 28%, a white run of width 95..140 that CONTAINS the center.
    pill = []
    for y in range(int(ch * 0.72), ch):
        for s, e in runs_of(white[y]):
            if 95 <= e - s + 1 <= 140 and s <= center <= e:
                pill.append((y, s, e))
                break
    py0 = min(p[0] for p in pill) if pill else -1
    py1 = max(p[0] for p in pill) if pill else -1
    pl = min((p[1] for p in pill), default=-1)
    pr = max((p[2] for p in pill), default=-1)
    print(f'\ncard {idx}: {cw}x{ch}; pill rows {py0}-{py1} cols {pl}-{pr} (w={pr-pl+1})')

    # Art ink bbox over the trailing art band, pill ROW RANGE excluded
    rowink = anyink.sum(axis=1)
    inked = set(np.where(rowink > cw * 0.02)[0].tolist())
    ay1 = ch - 1
    while ay1 not in inked:
        ay1 -= 1
    ay0 = ay1
    while (ay0 - 1) in inked:
        ay0 -= 1
    art_rows = [y for y in range(ay0, ay1 + 1) if not (py0 <= y <= py1)]
    sel = np.zeros_like(anyink)
    sel[art_rows] = anyink[art_rows]
    ys, xs = np.where(sel)
    iw = xs.max() - xs.min() + 1
    ih = ys.max() - ys.min() + 1
    print(f'  art zone rows {ay0}-{ay1}; art ink bbox x[{xs.min()},{xs.max()}] y[{ys.min()},{ys.max()}] -> {iw}x{ih}')
    print(f'  ink w = {100.0*iw/cw:.1f} pct of card w | ink h = {100.0*ih/ch:.1f} pct of card h | ink aspect w/h = {iw/ih:.3f}')
    print(f'  ink center x {(xs.min()+xs.max())/2:.1f} vs card center {center:.1f} (offset {abs((xs.min()+xs.max())/2-center):.1f})')
    ext = {y: np.where(sel[y])[0] for y in art_rows if sel[y].any()}
    ymax = max(ext, key=lambda y: ext[y].max() - ext[y].min())
    print(f'  widest art row {ymax}: x[{ext[ymax].min()},{ext[ymax].max()}] w={ext[ymax].max()-ext[ymax].min()+1} ({100.0*(ext[ymax].max()-ext[ymax].min()+1)/cw:.1f} pct)')
