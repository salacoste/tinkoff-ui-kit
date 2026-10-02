#!/usr/bin/perl
# colprobe.pl <img> <y> <class> — horizontal extent of a pixel class at one row.
# classes: yellow|blue|ink|gray|border(gray 170..247)|notwhite(<248 any)
use strict; use warnings;
my ($img,$y,$class) = @ARGV;
my @x;
open(my $fh, "-|", "magick", $img, "txt:-") or die;
while (<$fh>) {
  next unless /^(\d+),(\d+): \((\d+),(\d+),(\d+),?/;
  my ($x,$yy,$r,$g,$b) = ($1,$2,$3,$4,$5);
  next unless $yy == $y;
  my $hit =
      $class eq 'yellow' ? ($r>200 && $g>160 && $b<130 && $r-$b>90)
    : $class eq 'blue'   ? ($b>140 && $b-$r>40 && $g<$b)
    : $class eq 'ink'    ? ($r<170 && $g<170 && $b<170)
    : $class eq 'gray'   ? ($r>=170 && $r<248 && abs($r-$g)<8 && abs($g-$b)<8)
    : $class eq 'notwhite'? ($r<248 || $g<248 || $b<248)
    : die "class?";
  push @x, $x if $hit;
}
if (!@x) { print "y=$y $class: none\n"; exit }
my ($min,$max) = ($x[0],$x[0]);
for (@x) { $min=$_ if $_<$min; $max=$_ if $_>$max }
# gap report: contiguous runs (text glyph clusters / separate blocks)
my @runs; my $start = my $prev = $x[0];
for my $v (@x[1..$#x]) {
  if ($v - $prev > 3) { push @runs, [$start,$prev]; $start = $v }
  $prev = $v;
}
push @runs, [$start,$prev];
my $runs_s = join " ", map { "$_->[0]-$_->[1]" } @runs;
printf "y=%d %s: x=%d..%d n=%d runs(%d): %s\n", $y, $class, $min, $max, scalar(@x), scalar(@runs), $runs_s;
