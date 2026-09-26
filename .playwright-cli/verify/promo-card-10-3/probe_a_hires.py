"""Probe A: pill box + bottom offset from probe-beige-card-hires.png (528x408 hi-res card)."""
import numpy as np
from PIL import Image

img = Image.open('.playwright-cli/captures-v2/business/probe-beige-card-hires.png').convert('RGB')
a = np.array(img)
H, W = a.shape[:2]
print(f'image: {W}x{H}')

# Identify the card background (beige tint) vs art pixels vs white pill.
print('corners:', a[2, 2].tolist(), a[2, W - 3].tolist(), a[H - 3, 2].tolist(), a[H - 3, W - 3].tolist())

# White pill: rows where many pixels are near-pure-white
white = (a[:, :, 0] >= 244) & (a[:, :, 1] >= 244) & (a[:, :, 2] >= 244)
rows = np.where(white.sum(axis=1) > 30)[0]
print('white-ish rows span:', rows.min() if len(rows) else None, rows.max() if len(rows) else None)

# Concentrate on lower half where the pill lives
band_lo = int(H * 0.5)
sub = white[band_lo:, :]
rws = np.where(sub.sum(axis=1) > 20)[0]
print(f'white rows in [{band_lo},{H}):', (rws.min() + band_lo if len(rws) else None), (rws.max() + band_lo if len(rws) else None))

print('\nrow-by-row white extents (row, xmin, xmax, count) sampled:')
seen = []
for y in range(band_lo, H):
    xs = np.where(white[y])[0]
    if len(xs) > 40:
        seen.append((y, xs.min(), xs.max(), len(xs)))
for s in seen[:: max(1, len(seen) // 40)]:
    print(s)
print('total white rows:', len(seen))

# Contiguous white row runs
runs = []
if seen:
    start = seen[0][0]
    prev = seen[0][0]
    for y, *_ in seen[1:]:
        if y != prev + 1:
            runs.append((start, prev))
            start = y
        prev = y
    runs.append((start, prev))
print('\ncontiguous white row runs (y0,y1,height):', [(r[0], r[1], r[1] - r[0] + 1) for r in runs])
