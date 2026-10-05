# 24T Terminal capture pack — NOTES (2026-10-05)

Source: live terminal tbank.ru/terminal, authenticated maintainer session,
playwright-cli window 1930×1160, both themes via `data-theme` on `<html>`.
Staging originals: `raw/` (LOCAL ONLY — contains 3 UNREDACTED portfolio
frames; git-ignored). This folder is the PII-gated final pack: 27 PNG + 6
sanitized DOM dumps. Checklist: `../TERMINAL-CAPTURE-CHECKLIST.md`.

## Inventory (measured px)

| Surface | File(s) | Size |
|---|---|---|
| Full terminal frame | frame-dark/light | 1930×1160 (ticker strip x1600–1840/y0–20 redacted) |
| Order ticket (8 states) | order-ticket-* | 344×500 each |
| Order book | orderbook-empty-dark, orderbook-sber-dark/light | 300×612 |
| Chart toolbar | chart-toolbar-dark/light | 898×41 |
| Instrument tabs | instrument-tabs-dark/light | 640×36 |
| Instrument catalog popover | instrument-catalog-popover-dark | 400×500 |
| Notes editor / list / textarea ×3 | notes-* | 400×700 |
| Notifications instrument list | notifications-instrumentlist-dark | 378×470 |
| Watchlist groups dropdown | watchlist-groups-dropdown-dark | 120×200 |
| Widgets drawer | widgets-drawer-dark | 410×1036 |

DOM dumps (sanitized, final sweep 0 findings): chart-toolbar,
instrument-tabs, notes-editor, order-ticket-delayed, order-ticket-limit,
orderbook-sber (`*-dom.txt`).

## Measured facts (pixel-probed, ImageMagick)

**Order ticket (23.3 re-open input):**
- Panel 344×500; CTA row at y455–486.
- **CTA is a PAIR**: Buy `x13–167` / Sell `x176–330`, each **155×32**,
  gap **8px**, corner radius **≈4px** (row-456 inset 3px vs mid-body).
- Colors **theme-invariant**: buy `rgb(11,162,100)` (#0BA264), sell
  `rgb(157,43,43)` (#9D2B2B), white label. NOT the bank yellow CTA and
  NOT existing invest tokens (#2E970A stock / #009E4D bond) — a new
  terminal register.
- OrderLimits inset strip y421–448 (h27): fill dark `rgb(36,52,66)` /
  light `rgb(243,245,248)`; label «Доступно» x21–77; value
  right-aligned x301–328 (dark) / x316–322 (light). (Values redacted —
  geometry preserved.)

**Notes textarea (Epic 26 goal 2 — GROUNDED):**
- Field 374×32 (empty state), font-size 13 / line-height 16; autosize
  grows 32→48 (step 16) with content; grown state captured
  (`notes-textarea-grown-dark.png`).

**Chrome:** toolbar 898×41 single row; instrument tabs 640×36; order
book 300×612 with depth rows both themes; empty-state order book
captured.

## Epic 26 HOLD-atom verdicts (checklist §1–5)

1. **Spinner — not captured.** No rotating/pulsing wait state observed;
   terminal loading surfaces use linear progress bars. HOLD stays.
2. **Textarea — GROUNDED** (notes editor). Kit tk-textarea leaves HOLD
   for the 24T mini-wave.
3. **Range slider — 0 occurrences** (ticket qty is numeric input +
   «на всю» checkbox-toggles). HOLD stays.
4. **Switch — 0 occurrences** (notification settings are chips). HOLD
   stays.
5. **OTP cells — 0 occurrences.** HOLD stays.

## PII protocol (mold captures-v3/admin, spec 13.1)

- Redacted: ticker strip on both full frames (quotes ≠ public —
  maintainer call), OrderLimits VALUES in 7 ticket frames (label kept,
  value box painted with the exact strip fill — column-scanned FLAT).
- Two-pass vision control: pass 1 caught a surviving lot count («287»
  in the value zone) → surgical re-paint by exact text columns → pass 2
  (composite of 4 riskiest crops ×2 zoom) — all zones clean, labels
  intact. Prompts did not transcribe values.
- `raw/` keeps UNREDACTED portfolio-events/orders/overview (3 frames)
  locally; they never enter git. Account-id PII in URLs never framed.

## Mini-wave 24T input

1. Re-open 23.3 ticket pattern: paired green/red CTA 155×32/гэп 8/
   radius 4 (vs kit yellow CTA), measured panel metrics above, DOM
   dumps for semantics (order type switcher, iceberg-disabled,
   validation/delayed states captured).
2. tk-textarea atom spec on the grounded notes measurements.
3. Terminal chrome capacity call (toolbar/tabs/orderbook/drawer) —
   decide adoption scope in the brief.
