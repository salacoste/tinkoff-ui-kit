"""Probe B step 2: connected-component segmentation of the five cards + per-card art zone."""
import numpy as np
from PIL import Image
from scipy import ndimage

img = Image.open('.playwright-cli/captures-v2/business/pattern-products-grid.png').convert('RGB')
a = np.array(img)
H, W = a.shape[:2]

pagebg = np.array([241, 238, 232])
dist = np.abs(a.astype(int) - pagebg.astype(int)).sum(axis=2)
notbg = dist > 24

# Close small holes (text AA is fine — text is ink not bg), then label
lab, n = ndimage.label(notbg)
print(f'{n} raw components; keeping w>=200:')
cards = []
for i in range(1, n + 1):
    ys, xs = np.where(lab == i)
    if len(xs) < 5000:
        continue
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    cards.append((y0, y1, x0, x1, len(xs)))
    print(f'  comp: rows {y0}-{y1} (h={y1-y0+1}), cols {x0}-{x1} (w={x1-x0+1}), px={len(xs)}')

# Order: by top then left
cards.sort(key=lambda c: (c[0], c[2]))
print(f'\n{len(cards)} card-sized components')

# Per card: art zone = rows after the last TEXT row (dark ink on pure fill) that
# contain colorful or high-ink pixels; measure span + horizontal reach.
for idx, (y0, y1, x0, x1) in enumerate(c[:4] if False else cards):
    card = a[y0:y1 + 1, x0:x1 + 1]
    ch, cw = card.shape[:2]
    fill = np.array([233, 224, 209])
    d = np.abs(card.astype(int) - fill.astype(int)).sum(axis=2)
    ink = d > 30
    r, g, b = card[:, :, 0].astype(int), card[:, :, 1].astype(int), card[:, :, 2].astype(int)
    colorful = (np.abs(r - g) + np.abs(g - b) + np.abs(r - b)) > 60
    white = (card[:, :, 0] >= 244) & (card[:, :, 1] >= 244) & (card[:, :, 2] >= 244)
    # ink rows: fraction of ink+colorful+white px
    rowink = (ink | colorful | white).sum(axis=1)
    artrows = np.where(rowink > cw * 0.02)[0]
    # art zone = contiguous trailing band touching the card bottom
    if len(artrows) and artrows.max() >= ch - 3:
        ay1 = artrows.max()
        ay0 = ay1
        while ay0 - 1 in set(artrows.tolist()):
            ay0 -= 1
        zone = (ink | colorful | white)[ay0:ay1 + 1]
        zs = np.where(zone.any(axis=0))[0]
        ncol = int(colorful[ay0:ay1 + 1].sum())
        nwhite = int(white[ay0:ay1 + 1].sum())
        print(f'card {idx}: {cw}x{ch} | art rows {ay0}-{ay1} (h={ay1-ay0+1}, {100.0*(ay1-ay0+1)/ch:.1f}pct of card), '
              f'ink reach x [{zs.min()},{zs.max()}] of [0,{cw-1}], colorfulpx={ncol}, whitepx={nwhite}, '
              f'edgeL={zs.min()<=1}, edgeR={zs.max()>=cw-2}')
        # pill: contiguous white block with wide runs
        wr = white.sum(axis=1)
        pr = np.where(wr > 40)[0]
        if len(pr):
            py0 = int(pr.min())
            # contiguous run from bottom-most cluster
            run = [y for y in pr if y >= ay0]
            py1, py0 = int(max(run)), int(min(run))
            pxs = np.where(white[py0:py1 + 1].any(axis=0))[0]
            print(f'        white rows in/above art: {py0}-{py1}; widest cluster cols {pxs.min()}-{pxs.max()} (w={pxs.max()-pxs.min()+1})')
    else:
        print(f'card {idx}: {cw}x{ch} | no trailing art band (artrows max {artrows.max() if len(artrows) else None} vs {ch-1})')
