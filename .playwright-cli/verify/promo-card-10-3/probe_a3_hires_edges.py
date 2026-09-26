"""Probe A step 3: exact card rect, art zone geometry + horizontal reach, pill numbers."""
import numpy as np
from PIL import Image

img = Image.open('.playwright-cli/captures-v2/business/probe-beige-card-hires.png').convert('RGB')
a = np.array(img)
H, W = a.shape[:2]

# Exact card edges: the beige fill vs the page-bg strip / outside.
# Fill reference: median of a clean interior patch (rows 20-40, mid-width)
fill = np.median(a[20:40, 200:330].reshape(-1, 3), axis=0)
print('card fill (clean interior patch):', fill.tolist())
dist = np.abs(a.astype(int) - fill.astype(int)).sum(axis=2)
fillmask = dist < 18

# Card top edge: first row from top where the majority is fill
rowfrac = fillmask.mean(axis=1)
top = next(y for y in range(H) if rowfrac[y] > 0.5)
bot = next(y for y in range(H - 1, -1, -1) if rowfrac[y] > 0.5)
colfrac = fillmask.mean(axis=0)
left = next(x for x in range(W) if colfrac[x] > 0.5)
right = next(x for x in range(W - 1, -1, -1) if colfrac[x] > 0.5)
print(f'card rect: rows {top}-{bot} (h={bot-top+1}), cols {left}-{right} (w={right-left+1})')

# ART ZONE: rows below the last text band (123) that contain COLORFUL pixels
art = a[top:bot + 1, left:right + 1]
r, g, b = art[:, :, 0].astype(int), art[:, :, 1].astype(int), art[:, :, 2].astype(int)
colorful = (np.abs(r - g) + np.abs(g - b) + np.abs(r - b)) > 60
artrows = np.where(colorful.sum(axis=1) > 8)[0]
print('\nart zone (colorful rows, in-card coords):', artrows.min(), '-', artrows.max(),
      '(h=%d)' % (artrows.max() - artrows.min() + 1))
print('art zone in image rows:', artrows.min() + top, '-', artrows.max() + top)
print('art zone top as % of card height: %.1f%%' % (100 * artrows.min() / art.shape[0]))
print('art zone bottom vs card bottom: %d vs %d (flush=%s)' % (
    artrows.max(), art.shape[0] - 1, artrows.max() >= art.shape[0] - 3))

# Art horizontal reach per row: does colorful ink touch the card's left/right edges?
for yy in [artrows.min(), artrows.min() + 10, (artrows.min() + artrows.max()) // 2, artrows.max() - 5, artrows.max()]:
    xs = np.where(colorful[yy])[0]
    if len(xs):
        print(f'  art row {yy}: colorful x [{xs.min()},{xs.max()}] of [0,{art.shape[1]-1}] count={len(xs)}')

# Ink (any non-fill) horizontal reach in the art zone — includes ink-300 dark shapes
ink = dist[top:bot + 1, left:right + 1] > 30
zone = ink[artrows.min():artrows.max() + 1]
xs = np.where(zone.any(axis=0))[0]
print('\nart zone ANY-ink horizontal reach: [%d,%d] of card width %d' % (xs.min(), xs.max(), art.shape[1]))
print('reaches left edge:', xs.min() <= 1, '| reaches right edge:', xs.max() >= art.shape[1] - 2)

# Text rows: confirm ZERO colorful pixels above the art zone
textzone = colorful[:artrows.min()]
print('colorful px above art zone (text area):', int(textzone.sum()))

# PILL: white runs within the art zone, in-card coords
white = (art[:, :, 0] >= 244) & (art[:, :, 1] >= 244) & (art[:, :, 2] >= 244)
pw = white[artrows.min():artrows.max() + 1]
prow = np.where(pw.sum(axis=1) > 30)[0]
py0, py1 = prow.min() + artrows.min(), prow.max() + artrows.min()
pxs = np.where(pw.any(axis=0))[0]
print('\npill (in-card coords): rows %d-%d (h=%d), cols %d-%d (w=%d)' % (
    py0, py1, py1 - py0 + 1, pxs.min(), pxs.max(), pxs.max() - pxs.min() + 1))
print('pill center x: %.1f (card center %.1f)' % ((pxs.min() + pxs.max()) / 2, (art.shape[1] - 1) / 2))
print('pill bottom offset from card bottom: %d px' % (art.shape[0] - 1 - py1))
print('pill vertical center as %% of card: %.1f%%' % (100 * (py0 + py1) / 2 / art.shape[0]))

# Pill interior: two white-run bands (chrome around label glyphs)?
mid = (py0 + py1) // 2
runs = []
run = 0
for x in range(art.shape[1]):
    if white[mid, x]:
        run += 1
    elif run:
        runs.append(run)
        run = 0
if run:
    runs.append(run)
print('white runs across pill mid-row:', runs)
