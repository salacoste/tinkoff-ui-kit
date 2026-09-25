#!/bin/sh
# Story 7.4 — pixel probes of the kit renders (runs method, the standing
# 6.2/7.3 precedent). Usage: sh probe-kit.sh   (from repo root, after the
# capture recipe in NOTES.md). Reference-side probes live in
# .playwright-cli/verify/stepper/probe-ref.sh (steps) and the 6.1 tint table.
set -e
V=.playwright-cli/verify/business-landing

run() { # img x y -> pixel
  magick "$1" -format "%[pixel:p{$2,$3}]" info:
}
row() { # img y -> unique-color run lengths along the scanline
  magick "$1" -crop "$(magick identify -format '%wx1+0+' "$1")$2" txt:- \
    | awk -F: 'NR>1 {gsub(/^  */, "", $2); print $2}' | uniq -c
}

echo "=========== KIT HERO $V/kit-hero.png ==========="
echo "-- selector row scan y=660 (five cream seats):"
row "$V/kit-hero.png" 660
echo "-- page background sample p{10,700} = $(run "$V/kit-hero.png" 10 700)"
echo "-- selector card fill sample p{100,640} = $(run "$V/kit-hero.png" 100 640)"

echo ""
echo "=========== KIT BENTO $V/kit-bento.png ==========="
echo "-- row 1 scan y=330 (two wide seats):"
row "$V/kit-bento.png" 330
echo "-- row 2 scan y=880 (three seats, center wider):"
row "$V/kit-bento.png" 880
echo "-- card fill sample p{100,330} = $(run "$V/kit-bento.png" 100 330)"
echo "-- page sample p{10,330} = $(run "$V/kit-bento.png" 10 330)"
echo ""
echo "-- corner radius profile: first card top-left corner (card top y=268);"
echo "   insets of the fill start at dy=6/12/18/24 below the top:"
for dy in 6 12 18 24; do
  y=$((268 + dy))
  printf "  dy=%s y=%s first-fill-run: %s\n" "$dy" "$y" \
    "$(row "$V/kit-bento.png" "$y" | head -1)"
done
echo ""
echo "-- floating CTA: vertical scan x=340 (first card centerline), y=380..560:"
magick "$V/kit-bento.png" -crop 1x180+340+380 txt:- \
  | awk -F: 'NR>1 {gsub(/^  */, "", $2); print $2}' | uniq -c

echo ""
echo "=========== KIT STEPS $V/kit-steps.png ==========="
echo "-- card row scan y=300:"
row "$V/kit-steps.png" 300

echo ""
echo "=========== KIT FORM $V/kit-form.png ==========="
echo "-- card scan y=250:"
row "$V/kit-form.png" 250
echo "-- divider scan y=390 (1px hairline zone):"
row "$V/kit-form.png" 390
echo "-- card fill sample p{200,200} = $(run "$V/kit-form.png" 200 200)"
echo "-- page sample p{10,500} = $(run "$V/kit-form.png" 10 500)"
