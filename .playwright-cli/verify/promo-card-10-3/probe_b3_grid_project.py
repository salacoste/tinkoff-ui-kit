"""Probe B step 2 (projection-based): segment cards in the grid capture, per-card art geometry."""
import numpy as np
from PIL import Image

img = Image.open('.playwright-cli/captures-v2/business/pattern-products-grid.png').convert('RGB')
a = np.array(img)
H, W = a.shape[:2]

pagebg = np.array([241, 238, 232])
notbg = np.abs(a.astype(int) - pagebg.astype(int)).sum(axis=2) > 24

def runs_of(mask):
    """Contiguous runs of True in 1-D mask -> [(start, end)] inclusive."""
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

# Horizontal bands: rows that are near-pure page bg
rowbg = (~notbg).mean(axis=1)
bands = [r for r in runs_of(rowbg < 0.995) if r[1] - r[0] > 60]
print('vertical bands (card rows):', bands)

cards = []
for (by0, by1) in bands:
    sub = notbg[by0:by1 + 1]
    colbg = sub.mean(axis=0)
    cols = [c for c in runs_of(colbg > 0.5) if c[1] - c[0] > 100]
    print(f'  band rows {by0}-{by1}: card column runs {cols}')
    for (cx0, cx1) in cols:
        cards.append((by0, by1, cx0, cx1))

print(f'\n{len(cards)} cards; per-card analysis:')
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
    rowink = anyink.sum(axis=1)
    inked = set(np.where(rowink > cw * 0.02)[0].tolist())
    # trailing contiguous band touching the bottom
    ay1 = ch - 1
    while ay1 not in inked and ay1 > 0:
        ay1 -= 1
    ay0 = ay1
    while (ay0 - 1) in inked and ay0 > 1:
        ay0 -= 1
    zone = anyink[ay0:ay1 + 1]
    zs = np.where(zone.any(axis=0))[0]
    ncol = int(colorful[ay0:ay1 + 1].sum())
    nwhite = int(white[ay0:ay1 + 1].sum())
    print(f'card {idx}: {cw}x{ch} at ({x0},{y0}) | art rows {ay0}-{ay1} h={ay1-ay0+1} '
          f'({100.0*(ay1-ay0+1)/ch:.1f}pct) | reach x[{zs.min()},{zs.max()}] of [0,{cw-1}] '
          f'| edgeL={zs.min()<=1} edgeR={zs.max()>=cw-2} | colpx={ncol} whitepx={nwhite} '
          f'| colorful above art: {int(colorful[:ay0].sum())}')
    # Pill: contiguous white-run block near the bottom
    wr = white.sum(axis=1)
    pill_rows = [y for y in range(ch) if wr[y] > 40]
    if pill_rows:
        # bottom-most contiguous cluster
        py1 = max(pill_rows)
        py0 = py1
        while py0 - 1 in pill_rows:
            py0 -= 1
        pxs = np.where(white[py0:py1 + 1].any(axis=0))[0]
        print(f'          pill rows {py0}-{py1} (h={py1-py0+1}) cols {pxs.min()}-{pxs.max()} '
              f'(w={pxs.max()-pxs.min()+1}) centerx={(pxs.min()+pxs.max())/2:.1f} vs {(cw-1)/2:.1f} '
              f'| bottom offset {ch-1-py1} ({100.0*(ch-1-py1)/ch:.1f}pct)')
