# Story 15.2 — dark-completeness proposal (step-1 deliverable, executor → orchestrator)

Status: **PROPOSAL — awaiting the DESIGN.md amendment** (the executor cannot edit
`_bmad-output/`; per spec the values land in DESIGN.md FIRST, never in code).
Method: read-only enumeration of the light layer the ТЖ generator will emit,
checked against the frozen 15.2 dark mapping; every proposed value is quoted to
the recon evidence (`captures-v3/tj/probe-notes.md` dark battery + pixel census
of the committed dark capture below). Extraction, not invention.

New evidence tool: `.playwright-cli/verify/tj-tokens/sample-dark-png.mjs` decodes
the committed `tj-home-dark-viewport-2026-09-28.png` (1280×720, 8-bit RGB) with
zlib only and prints an exact-RGB census + y-band distributions. Transcript
highlights (top census + bands):

```
#12151C  382237   page                       #D0D0D2  2370  meta ink (bands across all content rows)
#20232A  231246   cards                      #3E4146  1980  divider (dark)
#FFDD2D   71112   promo art only             #F5F5F9  2549  CTA pill — single band y90-119
#FFFFFF   15051   headline/strong ink        #8054FF   537  badge — PRESENT in dark (stays purple)
#000000    7394   CTA label on the pill + art
#A6A6A6     ~76   artwork-adjacent only — NOT a system ink in dark
#808080     ~123  single artwork hairline (y527) — not a system ink
bands: #FFFFFF y15-54 (header wordmark) · y93-116 (hero title) · y530-602 (featured block)
       #717277 y397-411/y602-617 (engagement rows, h40 — matches the probe's engage ink)
```

## 1. Light-layer enumeration vs the frozen mapping

Direct-keys mode emits every non-dark `colors` key + the two spec aliases
(16 declarations): ink-100, ink-200, ink-300, ink-reference-meta,
ink-reference-time, page, card, divider, divider-strong, gold, gold-ink,
badge-purple, cta-fill, cta-ink + `--tj-color-link`, `--tj-color-engage`.

Frozen mapping consumes: page, card, divider, cta-fill, cta-ink (raw overrides)
+ link←dark-link, engage←dark-engage (aliases). Dark palette keys today:
dark-page, dark-card, dark-divider, dark-meta, dark-engage, dark-cta-fill,
dark-cta-ink, dark-link.

Gaps found (spec-anticipated): **headline ink on dark**, **divider-strong dark**,
**time-meta dark**, plus **dark-meta unconsumed** (would abort generation — the
bank invariant, second instance).

## 2. Proposed DESIGN.md additions (colors block)

### 2a. NEW `dark-ink: '#FFFFFF'` — headline/strong ink on dark

- Computed-style battery (probe-notes "Home (dark)"): `hero 21/700/25 · H2 21/700
  · H3 17/400 #D0D0D2 — scale unchanged, inks remap` — the remap is recorded but
  the headline hex was NOT in the transcript. The pixel census grounds it:
  **#FFFFFF ×15051** in exactly the title/logo bands (y15-54 wordmark, y93-116
  hero card title, y530-602 featured block) — a second light ink DISTINCT from
  meta #D0D0D2 (×2370, spread thin across meta rows). Pure-black headline (light)
  mirrors to pure-white headline (dark) — the ink-first language inverted.
- Machine ratios: **15.727:1 on dark-card, 18.265:1 on dark-page** (the 15.2
  contrast test pins these from the generated maps).
- Scope note for the DESIGN.md comment: grounded on the dark HOME capture;
  the dark ARTICLE body ink is unprobed (article-dark not captured) — 17.2's
  dark sweep re-verifies; the single ink-100 semantic covers headline + body in
  light and flips wholesale in dark.
- Consumed by: `ink-100 ← dark-ink`.

### 2b. NEW `dark-divider-strong: '#D0D0D2'` — strong divider on dark

- Probe-notes dark battery, verbatim: `dividers: #3E4146 ×27 · #D0D0D2 ×10` — a
  TWO-grade divider census mirroring the light pair `#E5E5E5 ×41 · #A6A6A6`
  (divider / divider-strong). Pixel census confirms both grades (#3E4146 ×1980,
  #D0D0D2 ×2370 shared with the meta duty).
- Decorative structure (non-text) — no aa-annotations entry; no AA pin.
- Consumed by: `divider-strong ← dark-divider-strong`.

### 2c. EXISTING `dark-meta` gets its consumer (no value change)

DESIGN.md already comments it: `dark-meta: '#D0D0D2'  # 10.21:1 on dark-card ✓ —
carries meta duty in dark`. Proposed consumers (a source may feed several
overrides — the bank `dark-link` precedent):

- `ink-300 ← dark-meta` — the AUTHORED essential-meta step is a light-only
  improvement; the reference dark value already clears AA (10.211:1), so the
  override collapses onto it (the gold-asymmetry pattern: light override, dark
  keeps the reference value).
- `ink-reference-meta ← dark-meta` — the reference's own meta ink #A6A6A6 remaps
  to #D0D0D2: probe `H3 17/400 #D0D0D2` (the light "meta-colored" H3 IS
  #A6A6A6); census: #A6A6A6 all-but-vanishes in dark (~76 px, artwork-adjacent).
  The restricted LIGHT ruling (2.434:1) is untouched — the annotation is a
  light-theme statement; the dark ENGAGE duty stays on the engage alias
  (dark-engage 3.277:1).

## 3. Dispositions proposed as INVARIANTS (no dark override — evidence)

| Light key | Why invariant |
|---|---|
| `gold` | anchor + decorative carrier; `dark-link` references it (gold clears AA on dark surfaces, 5.876:1) |
| `gold-ink` | light-only AA override — the LINK alias carries the dark flip (bank `link-on-tint` mold) |
| `badge-purple` | census: #8054FF ×537 PRESENT in the dark viewport — the 30×30 badge stays purple (scoped non-text carrier) |
| `ink-200` | #333 appears only as the CTA fill in light (color census: #000×4989 / #A6A6A6×4781 / #C79637×384 — no #333 text); the `cta-fill` semantic carries the flip; strong-UI-ink duty in dark belongs to ink-100/dark-ink |
| `ink-reference-time` | UNGROUNDED in dark (article-dark unprobed; the only dark #808080 is a 120-px artwork hairline). Keeping #808080 renders 3.277:1 on dark-card — still restricted-class, consistent with the timestamp ruling; the 17.2 dark sweep decides whether it joins dark-meta. No `[ASSUMPTION]` invented now. |

Shadows: NO dark re-declaration for ТЖ (bank collapses to `none`; ТЖ keeps the
overlay shadow in dark) — probe-notes dark-theme note: "radii/shadows are
theme-invariant on the reference". 17.2 re-verifies.

## 4. aa-annotations block amendments (grammar compliance, same file)

1. **story re-anchor `ux-tj` → `15.2`** on every entry — REQUIRED: the shared
   core's story grammar is `/^\d+\.\d+$/` ('ux-tj' aborts generation today).
2. **RENAME the `dark-engage:` entry → `engage:`** (text unchanged): entry names
   must name LIGHT-layer tokens; `--tj-color-engage` is the light declaration
   whose dark leg is #717277 (3.277:1, the restricted pair the test pins).
   Entries ink-reference-meta / ink-reference-time / gold-ink / badge-purple
   already name light keys.
3. No new entries needed for dark-ink / dark-divider-strong (aa-annotations name
   light semantics; the contrast test pins the dark-ink pair mechanically).

## 5. Resulting dark mapping (code-side, ready for the continuation)

Overrides (11 declarations): `page←dark-page`, `card←dark-card`,
`divider←dark-divider`, `divider-strong←dark-divider-strong`, `ink-100←dark-ink`,
`ink-300←dark-meta`, `ink-reference-meta←dark-meta`, `cta-fill←dark-cta-fill`,
`cta-ink←dark-cta-ink`, `link←dark-link`, `engage←dark-engage`.
Invariants: gold, gold-ink, badge-purple, ink-200, ink-reference-time.
Deferred: NONE — all 10 dark-* keys consumed (page, card, divider,
divider-strong, ink, meta, engage, cta-fill, cta-ink, link).

## 6. Ratio trueing (informational — machine truth vs UX-phase strings)

Machine computation (WCAG 2.1, the bank contrast-test math) vs the DESIGN.md body
table's UX-phase 2-decimal values: ink-300/card **5.099** (5.10), gold-ink/card
**5.308** (5.31), gold/card **2.676** (2.68), ink-ref-meta **2.434** (2.44),
ink-ref-time **3.949** (3.95), cta-ink/cta-fill **12.635** (12.63),
dark-meta/dark-card **10.211** (10.21), gold/dark-card **5.876** (5.86),
dark-engage **3.277** (3.28), dark-cta **19.311** (19.31). The 15.2 test pins the
machine values (the spec's own directive: ratios COMPUTE from the generated
maps). Three spec-listed pins differ from machine truth (5.096→5.099,
5.310→5.308, 5.860→5.876) and `ink-200/cta-fill 21.000` is arithmetically
impossible (#333 on #333 = 1.000; 21.000 exists only for #000/#FFF — already
pinned as ink-100/card; the CTA text pair cta-ink/cta-fill computes 12.635 =
DESIGN.md's own 12.63 row) — reported to the orchestrator; the test pins
cta-ink/cta-fill = 12.635. Keeping or truing the UX-phase strings in the body
table is the orchestrator's call (annotation anchors live in the frontmatter
comments either way).
