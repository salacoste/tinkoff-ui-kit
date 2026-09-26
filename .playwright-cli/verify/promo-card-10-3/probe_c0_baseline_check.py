"""Ground truth check: does the CURRENT business-landing baseline render the stage art?"""
import numpy as np
from PIL import Image

img = Image.open('tests/visual/visual.spec.ts-snapshots/visual-showcase-business-landing--business-landing-light-1-chromium.png').convert('RGB')
a = np.array(img)
H, W = a.shape[:2]
print(f'baseline: {W}x{H}')

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
# Find bento band: rows with TWO fill-colored wide runs (~496 each) — scan all rows
fill = np.array([233, 224, 209])
fillmask = np.abs(a.astype(int) - fill.astype(int)).sum(axis=2) < 18
cand = [(y, runs_of(fillmask[y])) for y in range(H)]
two = [y for y, rr in cand if len([r for r in rr if r[1]-r[0] > 300]) == 2]
print('rows with 2 wide cream-raised runs:', two[:5], '...', two[-5:] if two else 'NONE')
