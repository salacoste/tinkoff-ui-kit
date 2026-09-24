NR > 1 {
  split($0, p, /[:,]/)
  pos = p[1] + p[2] + 0
  line = $0
  sub(/^[^:]*:/, "", line)
  gsub(/[^0-9]+/, " ", line)
  split(line, t, " ")
  r = t[1] + 0; g = t[2] + 0; b = t[3] + 0
  c = r "," g "," b
  if (c != prev) {
    if (prev != "") { len = pos - startp
      if (len >= minlen) printf "%d-%d #%02X%02X%02X (%d)\n", startp, pos-1, pr, pg, pb, len }
    startp = pos; prev = c; pr = r; pg = g; pb = b } }
END { if (prev != "") printf "%d-end #%02X%02X%02X\n", startp, pr, pg, pb }
