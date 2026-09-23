// Story 5.6 — xxl/xl radii [ASSUMPTION] closure probe (2026-09-23).
//
// Measures the corner radius of ARCHIVED PNGs only (no live site): the Story
// 2.0 reference capture pack (cards) and the archived kit renders (Stories
// 3.6–3.9). Method: binary "not-background" mask (bg = the capture's own
// corner pixel), card bounds from long horizontal runs, then per-row arc
// insets at the top-left corner; each row yields a closed-form radius
// r = (Y + inset) + sqrt(2·Y·inset) for a circular corner of radius r
// (circle center (r, r): inset(Y) = r − sqrt(r² − (Y−r)²)). DPR 1 captures
// (INDEX.md: CSS px = image px), so readings are CSS px. Median across the
// arc rows; the interquartile spread is printed as the confidence band.
//
// Run: node .playwright-cli/verify/fidelity-verification/radii-probe.mjs

import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const dir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(dir, '../../..');
const magick = (args) => execFileSync('magick', args, { maxBuffer: 1 << 28 });

function loadImage(rel) {
  const abs = path.join(root, rel);
  const id = execFileSync('magick', ['identify', '-format', '%w %h', abs]).toString().split(/\s+/).map(Number);
  const [w, h] = id;
  const rgb = magick([abs, '-depth', '8', 'rgb:-']);
  return { w, h, px: (x, y) => [rgb[(y * w + x) * 3], rgb[(y * w + x) * 3 + 1], rgb[(y * w + x) * 3 + 2]] };
}

const dist = (a, b) => Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]), Math.abs(a[2] - b[2]));

function median(a) {
  const s = [...a].sort((x, y) => x - y);
  return s[Math.floor(s.length / 2)];
}

/**
 * Measure the top-left corner radius of the first (top-left-most) card.
 * Anchor: robust global mask bounds (P1 percentile, AA-noise immune) — the
 * captures are tightly cropped to the card grid, so the mask's min column is
 * the leftmost card's left edge and the min row its top edge. Tolerances are
 * per target: near-white fills (#F5F5F6 on white) need ~6, saturated fills 24.
 */
function measureCorner(img, { bgTolerance = 6, arcRows = 22 } = {}) {
  const bg = img.px(1, 1);
  const isCard = (x, y) => dist(img.px(x, y), bg) > bgTolerance;
  // Robust left edge: per-row leftmost mask pixel, 1st percentile.
  const rowStarts = [];
  for (let y = 0; y < img.h; y += 1) {
    for (let x = 0; x < Math.min(400, img.w); x += 1) {
      if (isCard(x, y)) {
        rowStarts.push(x);
        break;
      }
    }
  }
  // Robust top edge: per-column topmost mask pixel, 1st percentile.
  const colStarts = [];
  for (let x = 0; x < img.w; x += 1) {
    for (let y = 0; y < Math.min(400, img.h); y += 1) {
      if (isCard(x, y)) {
        colStarts.push(y);
        break;
      }
    }
  }
  if (!rowStarts.length || !colStarts.length) return { error: 'mask empty' };
  const pct = (a, p) => [...a].sort((m, n) => m - n)[Math.floor(a.length * p)];
  const x0 = pct(rowStarts, 0.01);
  const y0 = pct(colStarts, 0.01);
  // Per-row arc insets → closed-form radii.
  const radii = [];
  const rows = [];
  for (let Y = 2; Y < arcRows; Y += 1) {
    let left = -1;
    for (let x = x0; x < Math.min(x0 + 100, img.w); x += 1) {
      if (isCard(x, y0 + Y)) {
        left = x;
        break;
      }
    }
    if (left === -1) continue;
    const inset = left - x0;
    if (inset <= 1) continue; // past the arc — full-width rows
    const r = Y + inset + Math.sqrt(2 * Y * inset);
    radii.push(r);
    if (rows.length < 14) rows.push(`    row Y=${String(Y).padStart(2)} inset=${String(inset).padStart(3)} -> r=${r.toFixed(1)}`);
  }
  if (!radii.length) return { error: 'no arc rows measured' };
  const sorted = [...radii].sort((a, b) => a - b);
  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  return { r: median(radii), q1, q3, x0, y0, rows: rows.join('\n') };
}

const TARGETS = [
  ['REFERENCE service-card-grid.png (Story 2.0)', '.playwright-cli/captures/service-card-grid.png', 6],
  ['REFERENCE promo-card-grid.png (Story 2.0)', '.playwright-cli/captures/promo-card-grid.png', 24],
  ['REFERENCE feature-card-platinum.png (Story 2.0)', '.playwright-cli/captures/feature-card-platinum.png', 24],
  ['REFERENCE feature-card-tj-banner.png (Story 2.0)', '.playwright-cli/captures/feature-card-tj-banner.png', 24],
  ['REFERENCE article-card-grid.png (Story 2.0, context)', '.playwright-cli/captures/article-card-grid.png', 6],
  ['KIT kit-service-card-light.png (Story 3.8)', '.playwright-cli/verify/service-card/kit-service-card-light.png', 6],
  ['KIT kit-promo-card-light.png (Story 3.6)', '.playwright-cli/verify/promo-card/kit-promo-card-light.png', 6],
  ['KIT kit-feature-card-light.png (Story 3.7)', '.playwright-cli/verify/feature-card/kit-feature-card-light.png', 6],
  ['KIT kit-article-card-light.png (Story 3.9)', '.playwright-cli/verify/article-card/kit-article-card-light.png', 6],
];

console.log('xxl/xl radii closure probe — archived PNGs only (DPR 1 = CSS px)');
console.log('='.repeat(78));
for (const [label, rel, tol] of TARGETS) {
  const img = loadImage(rel);
  const m = measureCorner(img, { bgTolerance: tol });
  if (m.error) {
    console.log(`${label}\n    ERROR: ${m.error}`);
  } else {
    console.log(`${label}\n    top-left corner @ (${m.x0},${m.y0}) -> r = ${m.r.toFixed(1)}px  (IQR ${m.q1.toFixed(1)}–${m.q3.toFixed(1)})`);
    console.log(m.rows);
  }
  console.log('-'.repeat(78));
}
