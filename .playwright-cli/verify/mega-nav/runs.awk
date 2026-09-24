# runs.awk — collapse `magick img -crop Wx1+X+Y txt:-` scanline output to unique-color runs.
# Usage: magick IMG -crop ${W}x1+${X}+${Y} txt:- | grep -v '^#' | awk -f runs.awk
# Input fields:  x,y: (r,g,b) #HEX srgb(...)
# Output fields: $1 = run range "x0-x1", $2 = #HEX, $3 = (length)
{
  n = split($1, xy, ","); x = xy[1] + 0;
  hex = $2;
  if (hex == prevHex) { runEnd = x; runLen++; next; }
  if (prevHex != "") printf "%d-%d %s (%d)\n", runStart, runEnd, prevHex, runLen;
  prevHex = hex; runStart = x; runEnd = x; runLen = 1;
}
END { if (prevHex != "") printf "%d-%d %s (%d)\n", runStart, runEnd, prevHex, runLen; }
