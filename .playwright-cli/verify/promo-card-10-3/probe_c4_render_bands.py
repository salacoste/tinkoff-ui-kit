"""Probe C step 4: list ALL ink bands per card; back-compute svg box from known shape extents.

Distinguishes 'art pinned to bottom with svg's empty bottom margin' (margin-top:auto works)
from 'art collapsed to zero height'. Known viewBox 200x120; ink unit extents per shape taken
verbatim from render_probe.html shapes{}.
"""
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

rowbg = (~notbg).mean(axis=1)
bands = [r for r in runs_of(rowbg < 0.99) if r[1] - r[0] > 150]
cards = []
for (by0, by1) in bands:
    sub = notbg[by0:by1 + 1]
    cols = [c for c in runs_of(sub.mean(axis=0) > 0.5) if c[1] - c[0] > 200]
    for (cx0, cx1) in cols:
        cards.append((by0, by1, cx0, cx1))

# ink unit extents (ymin,ymax,xmin,xmax) in the 200x120 viewBox, per card index
EXT = {
    0: (24, 104, 30, 182),   # account   (wide, svg w 400 cap; top rect x=62 w=120 -> xmax 182)
    1: (18, 106, 58, 142),   # registration (wide, svg w 400 cap)
    2: (26, 106, 36, 164),   # credit    (trio 304, svg 100%)
    3: (30, 90, 30, 170),    # payments  (trio-mid 336, svg 100%)
    4: (38, 100, 42, 172),   # accounting(trio 304, svg 100%)
}

fill = np.array([233, 224, 209])
print('\nAll ink bands per card (ink = dist-from-fill > 30):')
for idx, (y0, y1, x0, x1) in enumerate(cards):
    card = a[y0:y1 + 1, x0:x1 + 1]
    ch, cw = card.shape[:2]
    ink = np.abs(card.astype(int) - fill.astype(int)).sum(axis=2) > 30
    rowink = ink.sum(axis=1)
    inked = rowink > cw * 0.02
    brs = [r for r in runs_of(inked) if r[1] - r[0] >= 4]
    print(f'\ncard {idx}: {cw}x{ch} at page y[{y0},{y1}] x[{x0},{x1}]')
    for (b0, b1) in brs:
        band = ink[b0:b1 + 1]
        xs = np.where(band.any(axis=0))[0]
        print(f'  band rows {b0}-{b1} h={b1-b0+1} | x[{xs.min()},{xs.max()}] w={xs.max()-xs.min()+1}')

    # art band = tallest band starting below row 120 (past heading+desc zone)
    art = [r for r in brs if r[0] > 120 and r != brs[-1] or (r[0] > 120 and r is brs[-1] and r[1] < ch - 4)]
    cands = [r for r in brs if r[0] > 120]
    if not cands:
        print('  NO art band below text zone')
        continue
    ab0, ab1 = max(cands, key=lambda r: r[1] - r[0])
    band = ink[ab0:ab1 + 1]
    ysx = np.where(band.any(axis=1))[0]
    xs = np.where(band.any(axis=0))[0]
    ih, iw = ab1 - ab0 + 1, xs.max() - xs.min() + 1
    uy0, uy1, ux0, ux1 = EXT[idx]
    span_y, span_x = uy1 - uy0 + 1, ux1 - ux0 + 1
    svg_h = ih * 120.0 / span_y
    svg_w = iw * 200.0 / span_x
    center_off = abs((xs.min() + xs.max()) / 2 - (cw - 1) / 2)
    print(f'  ART band rows {ab0}-{ab1} ink {iw}x{ih} | ink bottom gap to card bottom: {ch-1-ab1}px')
    print(f'  back-computed svg box: {svg_w:.0f}x{svg_h:.0f} (expect 400x240 wide / 304x182,336x202 trio)')
    print(f'  svg_h/0.6*svg_w collapse check ratio: {svg_h/(0.6*svg_w):.3f} (1.000 = intact aspect)')
    print(f'  ink center offset from card center: {center_off:.1f}px')
