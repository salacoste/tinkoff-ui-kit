#!/usr/bin/env bash
# Story 9.1 — rounded.3xl decision-gate probe (2026-09-25). Re-runnable:
#   bash .playwright-cli/verify/tokens-9-1/probe-ref.sh | tee .playwright-cli/verify/tokens-9-1/probe-output.txt
#
# Targets: the ARCHIVED business form-card reference captures (no live site):
#   .playwright-cli/captures-v2/business/pattern-application-form.png          (580x430, top edge clipped)
#   .playwright-cli/captures-v2/business/pattern-application-form-detail.png   (1280x485, top corners in frame)
# Mold: scanline run lengths (verify/stepper/probe-ref.sh method) for the
# layout tables + the arc-staircase closed-form corner probe (verify/
# fidelity-verification/radii-probe.mjs) for the radii. DPR 1 = CSS px.
set -euo pipefail
cd "$(dirname "$0")/../../.."   # repo root

run () { echo; echo "\$ $1"; eval "$1"; }

echo "== identify =="
magick identify .playwright-cli/captures-v2/business/pattern-application-form.png \
                .playwright-cli/captures-v2/business/pattern-application-form-detail.png

echo
echo "== pattern-application-form-detail.png (1280x485) — layout scanlines =="
echo "-- row y=240 (crosses the grey #F2F4F7 segmented track inside the card) --"
run "magick .playwright-cli/captures-v2/business/pattern-application-form-detail.png -crop 1280x1+0+240 txt:- | awk -F: 'NR>1 {gsub(/^  */, \"\", \$2); print \$2}' | uniq -c"
echo "-- column x=200 (left third; card top edge + heading text) --"
run "magick .playwright-cli/captures-v2/business/pattern-application-form-detail.png -crop 1x485+200+0 txt:- | awk -F: 'NR>1 {gsub(/^  */, \"\", \$2); print \$2}' | uniq -c"
echo "-- column x=640 (center; tan art zone above, track, fields) --"
run "magick .playwright-cli/captures-v2/business/pattern-application-form-detail.png -crop 1x485+640+0 txt:- | awk -F: 'NR>1 {gsub(/^  */, \"\", \$2); print \$2}' | uniq -c | head -12"

echo
echo "== pattern-application-form.png (580x430) — layout scanlines =="
echo "-- row y=1 (pure white: card top edge is clipped ABOVE this capture) --"
run "magick .playwright-cli/captures-v2/business/pattern-application-form.png -crop 580x1+0+1 txt:- | awk -F: 'NR>1 {gsub(/^  */, \"\", \$2); print \$2}' | uniq -c"
echo "-- row y=100 (card body: white | grey 534 track | white) --"
run "magick .playwright-cli/captures-v2/business/pattern-application-form.png -crop 580x1+0+100 txt:- | awk -F: 'NR>1 {gsub(/^  */, \"\", \$2); print \$2}' | uniq -c"
echo "-- row y=331 (last white row: white EDGE-TO-EDGE — the card's left/right edges clip past the frame, so its bottom corners are out of frame) --"
run "magick .playwright-cli/captures-v2/business/pattern-application-form.png -crop 580x1+0+331 txt:- | awk -F: 'NR>1 {gsub(/^  */, \"\", \$2); print \$2}' | uniq -c"
echo "-- row y=333 (full-width shadow line = card bottom edge, no corner arcs visible in frame) --"
run "magick .playwright-cli/captures-v2/business/pattern-application-form.png -crop 580x1+0+333 txt:- | awk -F: 'NR>1 {gsub(/^  */, \"\", \$2); print \$2}' | uniq -c"
echo "-- row y=429 (pure cream below the shadow) --"
run "magick .playwright-cli/captures-v2/business/pattern-application-form.png -crop 580x1+0+429 txt:- | awk -F: 'NR>1 {gsub(/^  */, \"\", \$2); print \$2}' | uniq -c"
echo "-- column x=290 (center: track + card bottom fade to cream) --"
run "magick .playwright-cli/captures-v2/business/pattern-application-form.png -crop 1x430+290+0 txt:- | awk -F: 'NR>1 {gsub(/^  */, \"\", \$2); print \$2}' | uniq -c | head -12"

echo
echo "== arc-staircase corner probe (closed-form radii; median + IQR) =="
run "node .playwright-cli/verify/tokens-9-1/probe-radius.mjs"
