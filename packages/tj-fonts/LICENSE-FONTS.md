# LICENSE-FONTS — bundled font assets of `pillkit-tj-fonts`

The woff2 files in `fonts/` are **XCharter** — an extension of Bitstream
Charter. They are FREE fonts distributed under the terms of the original
Bitstream Charter license, reproduced **verbatim** below as that license
requires. This file travels with every copy of the fonts (package
manifest `files` includes it; the companion test in
`tests/tj-fonts-policy.test.ts` pins that it does).

## The original Bitstream Charter license (verbatim)

```
(c) Copyright 1989-1992, Bitstream Inc., Cambridge, MA.

You are hereby granted permission under all Bitstream propriety rights
to use, copy, modify, sublicense, sell, and redistribute the 4
Bitstream Charter (r) Type 1 outline fonts for any purpose and without
restriction; provided, that this notice is left intact on all copies
of such fonts and that Bitstream's trademark is acknowledged as shown
below on all unmodified copies of the 4 Charter Type 1 fonts.

BITSTREAM CHARTER is a registered trademark of Bitstream Inc.
```

## XCharter attribution (the modification chain)

XCharter extends Bitstream Charter with (among other things) Cyrillic,
small caps and oldstyle figures. The font modifications are
Copyright (c) 2009–2012 Andrey Panov; Copyright (c) 2013–2024
Michael Sharpe. Per the license clause above, the modified fonts carry
a NEW name — "XCharter" — and are distributed as Free fonts under the
same terms. Source of record: CTAN `fonts/xcharter`, version 1.26
(2024-06-18); the woff2 files here are format conversions of the
package's OpenType faces (glyph data unmodified; format conversion is
a permitted use/copy, not a glyph modification, so the family name
stays as the XCharter project ships it).

SPDXLicenseID of the original grant: `Bitstream-Charter`.

## What is NOT here

**Graphik is not and will not be bundled.** Graphik is published by
Commercial Type; its standard EULA licenses usage (desktop/web/app per
seat/traffic) and does NOT grant redistribution of the font files. A
public repository redistributes to every cloner, so no Graphik byte
may enter this package. Consumers holding their own Commercial Type
license use the commented `@font-face` recipe in `fonts.css`.
