# Kit-recon visual reference — decisions & honesty log (spec 25.3)

Written after the capture campaign; PLAN.md above holds the pre-mint
plan, PASSPORTS.md the per-PNG IM passports.

## Scope decisions

- **self excluded.** The kit's own visual suite (2572 baselines, both
  themes, per-component legs) already represents it; an external
  capture would duplicate it with worse fidelity.
- **radix has no Button page.** Primitives is headless — styling is the
  consumer's job, and `/primitives/docs/components/button` 404s. The
  honest substitute pair is accordion + dialog (interactive primitives,
  unstyled by design).
- **polaris standalone site is retired.** `polaris.shopify.com/*` now
  redirects into the shopify.dev reference hub; the per-component
  design pages no longer exist. Captured instead: the hub +
  `using-polaris-web-components`. Its darks are genuine — shopify.dev
  honors `prefers-color-scheme`.
- **spectrum paths discovered from anchors.** Storybook `?path=` routes
  do not render server-side (landing every time); an anchor dump of the
  landing page gave the real `/spectrum-web-components/components/<name>/`
  paths (`textfield` is one word there, not `text-field`).

## Theme honesty

- Dark = `page.emulateMedia({ colorScheme: 'dark' })` — a real media
  feature, never an injected filter — then VERIFIED: computed
  root/body background luminance must be ≤ 0.5. Fully transparent
  `rgba(…, 0)` carries no signal and returns null (it must not read as
  black; see the false-dark lesson below).
- **carbon, mantine, spectrum: light-only.** Their docs ignore
  `prefers-color-scheme` and gate dark behind their own UI toggles,
  which the plan (honestly) did not probe. The skip lines with measured
  luminance live in journal.json.
- **antd gallery dark is partial**: the page chrome darkens but the
  content canvas stays light. Kept with this note rather than deleted —
  the page itself renders that way under the media scheme.

## False-dark audits (post-mint passport checks)

- `antd-button-dark` and `taiga-gallery-dark` were identical to their
  light twins (identical mean/std to six decimals) → FALSE-DARK →
  removed with an explicit `rm` (no silent overwrite). The antd leg
  predates the luminance fix below; the taiga gallery is a fixed-hero
  page whose canvas never engages the scheme.
- Root cause fixed in `recon/visual.mjs`: `rgba(0, 0, 0, 0)` (a
  transparent root) parsed as black, so every dark leg "passed" the
  check. Alpha-0 colors now return null and the min-luminance probe
  uses only opaque colors.

## Process violations (honest record)

- **Mint law violated mechanically.** `--only` re-runs (the spectrum
  path fix and the luminance-fix verification passes) re-minted 12
  already-existing PNGs without an explicit prior `rm`. The law says:
  delete explicitly before re-minting. The replacements were the same
  surfaces under the same deterministic settings, but the rule was
  still broken — recorded here, not excused.
- **journal.json is per-run.** The script overwrites it on every run,
  so the committed journal holds only the final `--only spectrum` leg;
  the earlier runs' lines (carbon/mantine skip records, pre-fix false
  passes) were not preserved anywhere else. PASSPORTS.md + this file
  are the surviving campaign record.

## Review mold consumption (AC4)

- 10 per-kit composites (4×560px columns, full height) minted; vision
  reads used top-2500px crops of the panels instead — full-height
  composites shrink to unreadable ~110px slabs when downscaled for
  reading. The crops are kept as `vision-<kit>.png` (the actual read
  objects); `composite-<kit>.png` remain the full contact sheets.
- **1 vision read per kit = 10 reads total. Budget ≤2/kit: zero
  excess.** All 10 reads confirmed real docs surfaces with
  differentiated themes on the 7 kits holding genuine darks (taiga,
  shoelace, mui, antd partial, polaris, radix, shadcn).
