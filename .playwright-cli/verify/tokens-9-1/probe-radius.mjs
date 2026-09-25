// Story 9.1 — rounded.3xl decision-gate probe (2026-09-25).
//
// Measures the corner radius of the ARCHIVED business form-card reference
// capture (`.playwright-cli/captures-v2/business/pattern-application-form{,
// -detail}.png`) — no live site. Method: the Story 5.6 arc-staircase mold
// (`.playwright-cli/verify/fidelity-verification/radii-probe.mjs`): binary
// card mask, per-row arc insets at the corner, each row yielding the
// closed-form radius r = (Y + inset) + sqrt(2·Y·inset) for a circular corner
// (circle center (r, r): inset(Y) = r − sqrt(r² − (Y−r)²)). Median across arc
// rows; IQR printed as the confidence band. DPR 1 captures (INDEX.md:
// CSS px = image px).
//
// Adaptations vs 5.6 (documented — the mold assumed tightly-cropped card
// grids; these are loose section frames):
//   1. Mask = NEAR-WHITE (dist ≤ 4 from #FFFFFF). Card fill is pure white;
//      page cream #F1EEE8 is 14+ away, the corner shadow tail ≤ (247,247,247)
//      is 8 away — both excluded. AA fringe (≥251) shifts insets ≤1px.
//   2. Corner-LOCAL robust edges instead of global P1 bounds (the frames
//      carry a page-level segmented toggle and a white band below the card):
//      left/right edges from leftmost/rightmost near-white per row over
//      card-body rows; top edge as P1 of per-column deep-white run starts
//      (contiguous >=40px, y>=100) over mid-card columns — see the note at
//      the detection site for the two contaminations it dodges.
//   3. The 580x430 capture clips the card's horizontal edges (rows through
//      the last white row y=332 are white edge-to-edge; y=333 is a full-width
//      shadow line) — its corners are OUT OF FRAME. It contributes the
//      layout tables only; the radius read is the 1280x485 detail capture,
//      whose top corners are fully in frame (white card on cream: top edge
//      y=113 EXACT under a 5px #333 stacked-card sliver at y=108-112, left
//      x=88, right x=1191 — both P1=median=max over body rows).
//
// Decision gate (spec 9.1): measured median ≥ 28px → `rounded.3xl: 32px`
// (or probed integer if 30–34) lands; < 28px → no token, scope reduces.

import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const dir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(dir, '../../..');
const magick = (args) => execFileSync('magick', args, { maxBuffer: 1 << 28 });

function loadImage(rel) {
  const abs = path.join(root, rel);
  const [w, h] = execFileSync('magick', ['identify', '-format', '%w %h', abs]).toString().split(/\s+/).map(Number);
  const rgb = magick([abs, '-depth', '8', 'rgb:-']);
  return { w, h, rel, px: (x, y) => [rgb[(y * w + x) * 3], rgb[(y * w + x) * 3 + 1], rgb[(y * w + x) * 3 + 2]] };
}

const WHITE = [255, 255, 255];
const dist = (a, b) => Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]), Math.abs(a[2] - b[2]));
const median = (a) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];
const pct = (a, p) => [...a].sort((m, n) => m - n)[Math.floor(a.length * p)];

/** Arc-staircase corner measurement (5.6 closed form). side: left|right, vedge: top|bottom. */
function measureCorner(img, { xEdge, yEdge, side = 'left', vedge = 'top', whiteTol = 4, arcRows = 44 }) {
  const isCard = (x, y) => dist(img.px(x, y), WHITE) <= whiteTol;
  const radii = [];
  const rows = [];
  for (let Y = 2; Y < arcRows; Y += 1) {
    const y = vedge === 'top' ? yEdge + Y : yEdge - 1 - Y;
    if (y < 0 || y >= img.h) continue;
    let hit = -1;
    const step = side === 'left' ? 1 : -1;
    for (let x = xEdge; side === 'left' ? x < Math.min(xEdge + 120, img.w) : x > Math.max(xEdge - 120, -1); x += step) {
      if (isCard(x, y)) { hit = x; break; }
    }
    if (hit === -1) continue;
    const inset = side === 'left' ? hit - xEdge : xEdge - hit;
    if (inset <= 1) continue; // past the arc — full-width row
    const r = Y + inset + Math.sqrt(2 * Y * inset);
    radii.push(r);
    if (rows.length < 22) rows.push(`    row Y=${String(Y).padStart(2)} inset=${String(inset).padStart(3)} -> r=${r.toFixed(1)}`);
  }
  if (!radii.length) return { error: 'no arc rows measured' };
  const sorted = [...radii].sort((a, b) => a - b);
  return { r: median(radii), q1: sorted[Math.floor(sorted.length * 0.25)], q3: sorted[Math.floor(sorted.length * 0.75)], rows: rows.join('\n') };
}

const DETAIL = '.playwright-cli/captures-v2/business/pattern-application-form-detail.png';
const SMALL = '.playwright-cli/captures-v2/business/pattern-application-form.png';

console.log('rounded.3xl decision-gate probe — archived business form-card captures');
console.log('='.repeat(78));

// --- Detail capture (1280x485): card top corners in frame; measure them ---
const d = loadImage(DETAIL);
const isCardD = (x, y) => dist(d.px(x, y), WHITE) <= 4;
// Left/right edges: leftmost/rightmost near-white per row over card-body rows
// (300..400 — below the toggle band, above the bottom edge ~430).
const rowStarts = [];
const rowEnds = [];
for (let y = 300; y <= 400; y += 1) {
  let first = -1;
  let last = -1;
  for (let x = 0; x < d.w; x += 1) {
    if (isCardD(x, y)) { if (first === -1) first = x; last = x; }
  }
  if (first !== -1) { rowStarts.push(first); rowEnds.push(last); }
}
// Top edge: P1 over mid-card columns (400..800) of the first near-white
// pixel starting a CONTIGUOUS >=40px near-white run AT OR BELOW y=100.
// Two contaminations dodge: (a) the page-level segmented toggle above the
// card carries solid white pills whose deep runs start at y~18; (b) the
// card's own top is a full-width 5px #333 sliver (a stacked dark card edge,
// see probe-output.txt row scans) — the sheet's white begins UNDER it at
// y~113 at every column, so filtering runs to y>=100 isolates the sheet.
const colStarts = [];
for (let x = 400; x <= 800; x += 1) {
  let runStart = -1;
  let runLen = 0;
  for (let y = 100; y < d.h; y += 1) {
    if (isCardD(x, y)) {
      if (runLen === 0) runStart = y;
      runLen += 1;
      if (runLen >= 40) { colStarts.push(runStart); break; }
    } else if (runLen > 0 && runLen < 40) {
      runLen = 0; // thin stroke (glyph row / divider) — not the card sheet
    }
  }
}
if (!colStarts.length) throw new Error('top-edge detection: no deep-white run found at or below y=100');
const x0 = pct(rowStarts, 0.01);
const x1 = pct(rowEnds, 0.99);
const y0 = pct(colStarts, 0.01);
console.log(`${DETAIL} (${d.w}x${d.h})`);
console.log(`  card edges (near-white, corner-local): left x=${x0}  right x=${x1}  top y=${y0}`);
console.log(`  (rowStarts over rows 300..400: min ${Math.min(...rowStarts)} / P1 ${x0} / median ${median(rowStarts)} / max ${Math.max(...rowStarts)}; colStarts P1 ${y0}, median ${median(colStarts)})`);
const detailResults = [];
for (const [label, opts] of [
  ['top-left', { xEdge: x0, yEdge: y0, side: 'left', vedge: 'top' }],
  ['top-right', { xEdge: x1, yEdge: y0, side: 'right', vedge: 'top' }],
]) {
  const m = measureCorner(d, opts);
  if (m.error) console.log(`  ${label}: ERROR ${m.error}`);
  else {
    detailResults.push(m.r);
    console.log(`  ${label} corner -> r = ${m.r.toFixed(1)}px  (IQR ${m.q1.toFixed(1)}–${m.q3.toFixed(1)})`);
    console.log(m.rows);
  }
}
console.log('-'.repeat(78));

// --- Small capture (580x430): corners out of frame (edges clipped) — layout only ---
const s = loadImage(SMALL);
let lastWhiteRow = -1;
for (let y = s.h - 1; y >= 0 && lastWhiteRow === -1; y -= 1) {
  if (dist(s.px(290, y), WHITE) <= 4) lastWhiteRow = y;
}
console.log(`${SMALL} (${s.w}x${s.h})`);
console.log(`  corners OUT OF FRAME: rows through y=${lastWhiteRow} are white edge-to-edge (card edges`);
console.log(`  clip past the frame); y=${lastWhiteRow + 1} is a full-width shadow line. No radius read;`);
console.log(`  this capture corroborates layout only (see scanline tables).`);
console.log('-'.repeat(78));

if (detailResults.length) {
  const overall = median(detailResults);
  console.log(`VERDICT input: median across ${detailResults.length} measured corner(s) = ${overall.toFixed(1)}px`);
  console.log('Gate: >= 28px -> rounded.3xl lands (32 or probed integer 30-34); < 28px -> no token, scope reduces to tokens 1+3.');
} else {
  console.log('VERDICT input: NO corner measured — investigate before deciding the gate.');
}
