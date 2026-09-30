# pillkit-tj-fonts

Bundled reading fonts for the ТЖ editorial family (`pillkit-tj-*`) — the
Carrier package of the maintainer's 18.3 «split» ruling: the Charter idiom
ships, Graphik stays a slot + recipe.

## What's inside

- **XCharter** ×4 faces (400 / 400 italic / 700 / 700 italic, woff2) — the
  free **Charter idiom with Cyrillic** (the original Bitstream Charter is
  Latin-only, 228 glyphs; XCharter carries 1144 including the full Cyrillic
  the ТЖ reading register needs). Free fonts under the **Bitstream Charter
  license terms** (use/copy/modify/sublicense/sell/redistribute; notice
  travels with every copy) — see `LICENSE-FONTS.md` for the verbatim grant
  and the Panov/Sharpe attribution. The name "XCharter" is itself license
  compliance: modified fonts must not carry the original name.
- **Graphik — deliberately absent.** Commercial Type's standard EULA grants
  usage licenses, not redistribution rights; a public repository
  redistributes to every cloner. Holders of a Commercial Type license use
  the commented `@font-face` recipe at the bottom of `fonts.css`.

## Usage

The ТЖ token sheet leads its reading slot with XCharter, so importing this
one stylesheet is all it takes:

```ts
import 'pillkit-tj-tokens/tokens.css';
import 'pillkit-tj-fonts/fonts.css';
```

Without this sheet the slot resolves through its open fallback chain
(Charter → Bitstream Charter → PT Serif → Georgia) — the kit's visual
test harness intentionally does exactly that (PT Serif pinned), so
baselines are independent of font installation.

## Scope guarantee

The ТЖ code triple (`pillkit-tj-tokens`, `pillkit-tj-components`,
`pillkit-tj-react`) remains **zero-fonts by test**
(`tests/tj-fonts-policy.test.ts`): no `@font-face`, no font byte under the
trio. This package — outside the trio — is the single deliberate,
license-carrying distribution point (the Daytona-mold pattern of the bank
family's `pillkit-tokens`).
