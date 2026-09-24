#!/bin/sh
# Story 7.3 — pixel probes of the three reference captures (runs method, standing 6.2 precedent)
# Usage: sh probe-ref.sh   (from repo root)
set -e
C=.playwright-cli/captures-v2
S=$C/business/pattern-steps-open-account-detail.png
B=$C/invest-mobile/pattern-store-badges-loaded.png
Q=$C/invest-mobile/pattern-qr-loaded.png
QT=$C/invest-mobile/pattern-qr-tabs.png

run() { # img x y -> pixel
  magick "$1" -format "%[pixel:p{$2,$3}]" info:
}
row() { # img y -> unique-color run lengths along the scanline
  magick "$1" -crop "$(magick identify -format '%wx1+0+' "$1")$2" txt:- \
    | awk -F: 'NR>1 {gsub(/^  */, "", $2); print $2}' | uniq -c
}

echo "=========== STEPPER $S ==========="
echo "-- single pixels:"
for p in "10,10" "640,10" "200,106" "200,80" "640,60" "640,180"; do
  printf "  p{%s} = %s\n" "$p" "$(run "$S" "${p%,*}" "${p#*,}")"
done
echo "-- badge1 (first card) horizontal scan y=60:"
row "$S" 60
echo "-- scan y=106 (card top edge zone):"
row "$S" 106
echo "-- scan y=205 (bottom edge):"
row "$S" 205
echo "-- vertical scan x=200 (card interior col):"
magick "$S" -crop 1x212+200+0 txt:- | awk -F: 'NR>1 {gsub(/^  */, "", $2); print NR-2": "$2}' | uniq -c -f1 | head -20

echo
echo "=========== STORE BADGES $B ==========="
echo "-- single pixels:"
for p in "10,10" "200,64" "640,64" "1000,64" "640,5"; do
  printf "  p{%s} = %s\n" "$p" "$(run "$B" "${p%,*}" "${p#*,}")"
done
echo "-- horizontal scan y=64 (pill mid):"
row "$B" 64
echo "-- vertical scan x=640:"
magick "$B" -crop 1x128+640+0 txt:- | awk -F: 'NR>1 {gsub(/^  */, "", $2); print NR-2": "$2}' | uniq -c -f1 | head -20

echo
echo "=========== QR LOADED $Q ==========="
echo "-- horizontal scan y=30 (tabs zone):"
row "$Q" 30
echo "-- horizontal scan y=120 (QR tile zone):"
row "$Q" 120
echo "-- vertical scan x=640:"
magick "$Q" -crop 1x344+640+0 txt:- | awk -F: 'NR>1 {gsub(/^  */, "", $2); print NR-2": "$2}' | uniq -c -f1 | head -30

echo
echo "=========== QR TABS (314x44 crop) $QT ==========="
echo "-- horizontal scan y=22:"
row "$QT" 22
echo "-- vertical scan x=157:"
magick "$QT" -crop 1x44+157+0 txt:- | awk -F: 'NR>1 {gsub(/^  */, "", $2); print NR-2": "$2}' | uniq -c -f1 | head -10
