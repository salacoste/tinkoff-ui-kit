#!/usr/bin/perl
# rowprobe.pl <img> [x0 x1 y0 y1] — band-structured row profile of a PNG.
# Emits interleaved bands of CONTENT rows (ink/gray/yellow/blue pixels) and
# CARD rows (long white runs), compressed to ranges. Pixel classes:
#   white   r,g,b >= 248            (card surface / page white)
#   ink     r,g,b <  170            (near-black text)
#   gray    170..247 neutral        (gray text, hairlines — page bg sits here too)
#   yellow  r>200 g>160 b<130       (the CTA fill)
#   blue    b>150, b-r>40, g<b      (the link)
# Card-row detection: white-run >= 60% of the scan width (the sidebar page
# background ~#F5F6F7 falls below the white gate, the card surface clears it).
use strict; use warnings;
my ($img,$x0,$x1,$y0,$y1) = @ARGV;
$x0 //= 0; $x1 //= 459; $y0 //= 0; $y1 //= 999;
open(my $fh, "-|", "magick", $img, "txt:-") or die "magick: $!";
my %rows;
while (<$fh>) {
  next unless /^(\d+),(\d+): \((\d+),(\d+),(\d+),?/;
  my ($x,$y,$r,$g,$b) = ($1,$2,$3,$4,$5);
  next if $x<$x0 || $x>$x1 || $y<$y0 || $y>$y1;
  my $t = $rows{$y} //= { n=>0, white=>0, ink=>0, gray=>0, yellow=>0, blue=>0 };
  $t->{n}++;
  $t->{white}++  if $r>=248 && $g>=248 && $b>=248;
  $t->{ink}++    if $r<170 && $g<170 && $b<170;
  $t->{gray}++   if $r>=170 && $r<248 && abs($r-$g)<8 && abs($g-$b)<8;
  $t->{yellow}++ if $r>200 && $g>160 && $b<130 && ($r-$b)>90;
  $t->{blue}++   if $b>140 && ($b-$r)>40 && $g<$b;
}
my $w = $x1-$x0+1;
my $card_gate = int($w*0.6);
my @bands;
for my $y (sort {$a<=>$b} keys %rows) {
  my $t = $rows{$y};
  my $content = ($t->{ink}+$t->{gray}+$t->{yellow}+$t->{blue}) > 0;
  my $card = $t->{white} >= $card_gate;
  my $kind = $content ? 'C' : ($card ? 'W' : '');
  if ($kind eq '' ) { $bands[-1]{end}=$y if @bands; next; }
  if (@bands && $bands[-1]{kind} eq $kind && $y == $bands[-1]{end}+1) {
    my $b=$bands[-1]; $b->{end}=$y;
    $b->{$_} += $t->{$_} for qw(ink gray yellow blue white);
  } else {
    push @bands, { kind=>$kind, start=>$y, end=>$y, map { $_=>$t->{$_} } qw(ink gray yellow blue white) };
  }
}
printf "scan x=%d..%d w=%d card_gate=%d\n", $x0, $x1, $w, $card_gate;
for my $b (@bands) {
  printf "y=%d..%d (%2d) %s ink=%d gray=%d yellow=%d blue=%d white=%d\n",
    $b->{start}, $b->{end}, $b->{end}-$b->{start}+1,
    $b->{kind} eq 'C' ? 'CONTENT' : 'CARD  ',
    $b->{ink}, $b->{gray}, $b->{yellow}, $b->{blue}, $b->{white};
}
