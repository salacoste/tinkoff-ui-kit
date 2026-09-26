"""Probe A final: art zone (ink band after last text row) geometry + pill numbers, hires card."""
import numpy as np
from PIL import Image

img = Image.open('.playwright-cli/captures-v2/business/probe-beige-card-hires.png').convert('RGB')
a = np.array(img)
H, W = a.shape[:2]
print(f'card = full image: {W}x{H}, fill [233,224,209] (beige); corners show page bg (radius AA)')

fill = np.array([233, 224, 209])
dist = np.abs(a.astype(int) - fill.astype(int)).sum(axis=2)
ink = dist > 30

# Art zone: contiguous ink band starting after the last text row (123)
artrows = np.where(ink[130:].sum(axis=1) > 3)[0] + 130
ay0, ay1 = int(artrows.min()), int(artrows.max())
print(f'art zone rows {ay0}-{ay1} (h={ay1-ay0+1}), top at {100.0*ay0/H:.1f} percent of card height, height {100.0*(ay1-ay0+1)/H:.1f} percent')
print(f'art bottom = card bottom: {ay1} vs {H-1} flush={ay1 >= H-3}')

zone = ink[ay0:ay1 + 1]
xs = np.where(zone.any(axis=0))[0]
print(f'art zone ANY-ink horizontal reach: [{xs.min()},{xs.max()}] of [0,{W-1}]')
print('reaches left edge:', xs.min() <= 1, '| reaches right edge:', xs.max() >= W - 2)

# Per-row horizontal ink extents through the zone (left/right progression)
for frac in [0, 0.1, 0.25, 0.5, 0.75, 0.9, 0.99]:
    yy = int(ay0 + frac * (ay1 - ay0))
    rxs = np.where(ink[yy])[0]
    print(f'  row {yy} ({frac*100:.0f}pct): ink x [{rxs.min()},{rxs.max()}] n={len(rxs)}')

# Colorful (yellow) subrows — where the saturated shapes live
r, g, b = a[:, :, 0].astype(int), a[:, :, 1].astype(int), a[:, :, 2].astype(int)
colorful = (np.abs(r - g) + np.abs(g - b) + np.abs(r - b)) > 60
crows = np.where(colorful[130:].sum(axis=1) > 8)[0] + 130
print(f'colorful rows: {crows.min()}-{crows.max()}; colorful px above art zone (text area): {int(colorful[:ay0].sum())}')

# Pill (white) in image coords
white = (a[:, :, 0] >= 244) & (a[:, :, 1] >= 244) & (a[:, :, 2] >= 244)
prow = np.where(white.sum(axis=1) > 30)[0]
py0, py1 = int(prow.min()), int(prow.max())
pxs = np.where(white[py0:py1 + 1].any(axis=0))[0]
print(f'\nPILL: rows {py0}-{py1} (h={py1-py0+1}), cols {pxs.min()}-{pxs.max()} (w={pxs.max()-pxs.min()+1})')
print(f'pill center x {(pxs.min()+pxs.max())/2:.1f} vs card center {(W-1)/2:.1f}')
print(f'pill bottom offset from card bottom edge: {H-1-py1} px')
print(f'pill rows as pct of card height: {100.0*py0/H:.1f}-{100.0*py1/H:.1f}')

# Pill mid-row white runs (chrome bands around label glyphs)
mid = (py0 + py1) // 2
runs = []
run = 0
for x in range(W):
    if white[mid, x]:
        run += 1
    elif run:
        runs.append(run)
        run = 0
if run:
    runs.append(run)
print('white runs across pill mid-row (px):', runs)

# Pill top/bottom rows white runs (pure chrome rows?)
for label, yy in [('pill top row', py0 + 2), ('pill bottom row', py1 - 2)]:
    runs2 = []
    run = 0
    for x in range(W):
        if white[yy, x]:
            run += 1
        elif run:
            runs2.append(run)
            run = 0
    if run:
        runs2.append(run)
    print(f'{label} {yy} white runs:', runs2)
