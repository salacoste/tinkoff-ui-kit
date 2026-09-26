"""Probe B step 1: segment the five bento cards in pattern-products-grid.png."""
import numpy as np
from PIL import Image

img = Image.open('.playwright-cli/captures-v2/business/pattern-products-grid.png').convert('RGB')
a = np.array(img)
H, W = a.shape[:2]
print(f'grid capture: {W}x{H}')

# Page bg (cream) vs card fill (cream-raised): sample far-left column mid-height
print('left edge samples:', a[H//2, 0].tolist(), a[H//4, 0].tolist(), a[3*H//4, 0].tolist())
print('top-center sample:', a[5, W//2].tolist())

# Unique-ish colors histogram of edges to find the page bg
from collections import Counter
edge = np.concatenate([a[0:3, :].reshape(-1, 3), a[:, 0:3].reshape(-1, 3)])
print('common edge colors:', Counter(map(tuple, edge[::7])).most_common(5))
