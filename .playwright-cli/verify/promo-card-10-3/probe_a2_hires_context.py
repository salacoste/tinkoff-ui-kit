"""Probe A step 2: card edges, art zone span, text rows, scale check on the hires card."""
import numpy as np
from PIL import Image

img = Image.open('.playwright-cli/captures-v2/business/probe-beige-card-hires.png').convert('RGB')
a = np.array(img)
H, W = a.shape[:2]

# Beige fill reference: median of the top-left area
fill = np.median(a[5:60, 5:60].reshape(-1, 3), axis=0)
print('card fill (median of top-left):', fill.tolist())

# Distance from fill
dist = np.abs(a.astype(int) - fill.astype(int)).sum(axis=2)
ink = dist > 30  # anything not the fill: text, art, pill, corners AA

# Row profile: fraction of ink pixels per row
rowfrac = ink.mean(axis=1)
print('\nrow ink fractions (row: frac) — bands:')
in_band = False
for y in range(H):
    f = rowfrac[y]
    if f > 0.01 and not in_band:
        start = y
        in_band = True
    elif f <= 0.01 and in_band:
        print(f'  ink band rows {start}-{y-1} (h={y-start}), peak frac {rowfrac[start:y].max():.3f}')
        in_band = False
if in_band:
    print(f'  ink band rows {start}-{H-1} (h={H-start}), peak frac {rowfrac[start:].max():.3f}')

# Column profile within the LAST ink band (the art zone) — horizontal reach
# and classify band content: text rows are dark-only, art rows are colorful.
def colorfulness(px):
    r, g, b = px[:, 0].astype(int), px[:, 1].astype(int), px[:, 2].astype(int)
    return (np.abs(r - g) + np.abs(g - b) + np.abs(r - b)) > 60

print('\nband analysis:')
in_band = False
for y in range(H):
    f = rowfrac[y]
    if f > 0.01 and not in_band:
        start = y
        in_band = True
    elif f <= 0.01 and in_band:
        end = y
        rows = ink[start:end]
        band = a[start:end]
        colorful = colorfulness(band.reshape(-1, 3)).reshape(rows.shape)
        xs = np.where(rows.any(axis=0))[0]
        xs_col = np.where((rows & colorful).any(axis=0))[0]
        dark = (band.sum(axis=2) < 300) & rows
        n_col = int((rows & colorful).sum())
        n_dark = int(dark.sum())
        white_ish = (band[:, :, 0] >= 244) & (band[:, :, 1] >= 244) & (band[:, :, 2] >= 244)
        n_white = int((white_ish & rows).sum())
        kind = 'COLORFUL' if n_col > 50 else ('WHITE' if n_white > n_dark else 'dark')
        print(f'  band {start}-{end-1} h={end-start}: inkx=[{xs.min()},{xs.max()}] colorfulpx={n_col} darkpx={n_dark} whitepx={n_white} -> {kind}'
              + (f' colorfulx=[{xs_col.min()},{xs_col.max()}]' if len(xs_col) else ''))
        in_band = False
