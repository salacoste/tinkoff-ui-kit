# tinkoff-ui-kit

UI kit based on the Tinkoff (T-Bank) design language — **copy the existing site, systematize, and improve**.
Study project: the reference site (tinkoff.ru) is the design source of truth; we extract its design system
(colors, typography, spacing, components, motion) and rebuild it as a proper, improved UI kit.

**Stack: chosen by BMAD architecture (d1bfa05) — core-and-adapters.** Lit 3.3.3 core (shadow DOM,
`--tk-*` token pipeline) in `packages/components`; React 19 wrapper package generated from CEM
(`@lit/react`); pnpm workspace `pillkit-{tokens,components,react,docs}`; TS 7 strict, Vite 8, Vitest,
Playwright visual/axe harness. Planning artifacts (PRD/UX/architecture/epics) live in `_bmad-output/planning-artifacts/`.

## Project state (updated 2026-09-28 — v1.3.0 RELEASED; post-release POLISH ROUND landed; ТЖ = separate kit next)

- **v1.0.0 SHIPPED as git tag `v1.0.0`** (maintainer gate session 2026-09-23/24). All maintainer
  gates closed: 274/274 baselines CONFIRMED (F1 re-taken), VoiceOver SR walk 19/19 (tabs
  track→panel rhythm fixed in-session), §0 ratifications recorded in RELEASE.md
- **Distribution model: GitHub-only — NO npm, ever (maintainer decision 2026-09-23).** Consumers
  clone/checkout a tag and use the workspace-link recipe (README quickstart — SM-6-verified AND
  verified live from the tag; the quickstart html REQUIRES `<meta charset="utf-8">` — a real
  mojibake bug the release gate caught and fixed). `private: true` in all packages is PERMANENT.
  Releases = commit + `git tag vX.Y.Z` + push; the release gate = fresh consumer clones the tag
  and runs the README recipe end-to-end (RELEASE.md §4–§5)
- **v2 IN PROGRESS (designated 2026-09-24):** three new domains — tbank.ru/business,
  /invest/mobile-application, /invest/stocks. BMAD chain COMPLETE (brief/PRD §4.8 FR-12..16,
  UX spines, architecture delta = zero, **epics-v2.md: 3 epics / 13 stories**). Recon + UX-phase
  captures in `.playwright-cli/captures-v2/`. **Story 6.1 DONE (c999e12, spec-6-1 closed):**
  gen:tokens consumes `{colors.*}` references + rgba literals; delta/table/cream semantics live
  (6 dark first-pass [ASSUMPTION]s → 8.2); registers documented in TOKENS.md. CONSTRAINT for 6.4:
  delta text sits on surface-base cells only — green-300 fails muted/field/hover composites
  (4.210/4.039/4.163, pinned in contrast.test.ts). **Story 6.2 DONE (spec-6-2 closed):**
  tk-filter-chips (tablist pills + «Ещё» overlay menu, border-only selection) + tk-pagination
  (nav landmark, windowing, load-more bar) — geometry pixel-probed (bar 44 / gap 16; frozen
  radius-full chips kept vs ref r≈10–12, §9-recorded), verify evidence in
  `.playwright-cli/verify/{filter-chips,pagination}/`. **Story 6.3 DONE (spec-6-3 closed):**
  tk-combobox-search (borderless 52px search register + controller-mounted suggestion panel,
  aria-activedescendant, IME-composition-safe live-text re-sync, RU-pluralized announcements;
  icon-gap trued to the reference x52 arithmetic; §9 row for the internal panel state) —
  772 unit + visual 1041/1041, verify evidence in `.playwright-cli/verify/combobox-search/`.
  PARALLEL-TRACK RULE (paid for 2026-09-24, sharpened 2026-09-25): the visual harness's
  webServer port 6007 is machine-global — NEVER run two `pnpm test:visual` concurrently
  (worktrees/agents); kill stray 6007 servers before gate rounds (see deferred-work.md).
  SHARPENING (6.4 fix round): `reuseExistingServer` made a run silently test against a
  STALE orphan dist (foreign serve.mjs whose cwd matched the tree grabbed 6007 within
  ~40s twice) — ownership is necessary, CONTENT FRESHNESS is the real guarantee; for
  high-stakes gate rounds use a PRIVATE port via a temporary VISUAL_PORT-overridable
  playwright config (proven technique, delete before commit). **Story 7.1 DONE (736191e +
  truing b068bb8, merged 0ec0790, spec-7-1 closed):** tk-navbar extended in place with the
  optional 64px sub-nav row (subLinks/subActiveValue/subLabel; two named nav landmarks;
  sub-nav desktop-only; v1 byte-stability pinned) — TRUING corrected two frozen premises
  (row-2 active HAS a 2px underline + inter-row 1px divider; Spec Change Log), 784 unit +
  visual 1065/1065 ×2, verify evidence in `.playwright-cli/verify/mega-nav/`. **6.4 DONE (e06e844 → §9-fix 13bedc2 → lens fix round
  eb9fdd7, spec-6-4 closed): tk-data-table — typographic row-as-link catalog, APG keyboard
  layer, §9 delta-on-hover row (leg map corrected: light-pos 4.163 / dark-neg 3.382 are the
  dipping legs); lens B1 (dead `.cell__link` selector) fixed — empirically PIXEL-NEUTRAL in
  the pinned capture env (keyboard baselines md5-identical). 7.2 DONE (773f53d worktree →
  merge 0f1592d → gate-fix 9086551, spec-7-2 closed): tk-cookie-banner — non-modal consent
  dialog, consent-choice bare verb, 12 baselines (axe co-driver debt FIXED in the same
  window: tests/visual/axe-serialize.ts chain + busy-retry). 6.5 DONE (b1a1b9f, spec-6-5
  closed): stocks-catalog showcase composition — 5 surfaces wired live, 39-step recorded
  keyboard walkthrough, a11y-ledger group-IV, lens SHIP 0/0/2.** 7.3 DONE (d199a79 worktree → merge d6a9f2c → lens fix 6cb2234, spec-7-3 closed):
  tk-stepper + tk-store-badges + tk-qr-block — the marketing display trio (brown badge
  = deferred-work maintainer flag; qr tablist = v1 tk-tabs composed verbatim; note
  under the tile). Lens SHIP 0/2/7, both WARNs fixed in-window.** **7.4 DONE (bbbceef
  worktree → merge 5a6f5e5, spec-7-4 closed): business-landing showcase — bento 2+3 on the
  warm-cream family (radius 24 = radius-xxl EXACT), floating white CTA, form cluster with
  mode-derived imperative toast (element-screenshot evidence: page-clip breaks at
  scrollY≈2268); two premise corrections pixel-confirmed (capture pill reads «Все продукты»,
  token names = tint-cream family); lens SHIP 0/0/5, all three hygiene notes fixed in-window
  (hex-in-comment, stale jsdoc, NOTES path). 7.5 DONE (7df3097 worktree → merge 508bd7b +
  CEM regen 0df4593, spec-7-5 closed): invest-landing showcase — marketing register h1 =
  heading-2 mapping EXACT, install cluster qr→steps→badges (capture-refuted order,
  premise corrected), «Вариант 2» both headings verbatim; lens SHIP 0/0/0; kit gaps
  (qr-block page-copy slot, button href mode) reported to deferred-work. PROVISIONING
  LESSON: both showcase worktrees were born at d27773b (pre-trio HEAD) — executors
  self-recovered via reset to d6a9f2c; launch dependent executors strictly AFTER the base
  commit exists.** **8.1 DONE (8a2e5a9 + cd00449 worktree → merge 037699d + baseline
  re-take 256e5cf, spec-8-1 closed): the 5.1 method on the nine — 54/54 cells PASS, ledger
  group-V.md, 28 engine legs (ringAncestor topology; cookie walk rides variants — top-layer
  forward-walk limitation recorded in deferred-work); F1 sub-label/burger-label empty-name
  fallback at all 3 name sites; F2 kit-wide :host([hidden]) 33/33 sheets + tripwire pattern
  test that FOUND 5 real multi-sheet gaps (tk-modal rendered while hidden!); the guard
  removed a baked-in select stray-band defect → 14 baselines legitimately re-taken
  (exactly-14 verified). Lens SHIP 0/0/4, all notes fixed in-window. 8.3 DONE (e63639c
  worktree → FAST-FORWARD merge, spec-8-3 closed): 9 v2 docs pages (live CEM tables) +
  registers story on token-reference (single-source: TOKENS.md ?raw + throwing parser +
  drift test in pnpm test); canvas-bg debt CLOSED (keep per-story copies, preview.ts:52-70);
  docs-chrome axe fixes only (zero component changes). Lens SHIP 0/0/5.** **8.2 DONE
  (70d02a8 worktree = 8c0fdde tokens + 9231315 engine/F5 + 70d02a8 ledger; base 7e525c2 →
  FAST-FORWARD merge; spec-8-2 closed): ALL SIX 6.1 dark [ASSUMPTION]s HELD with computed
  evidence (zero value changes — DESIGN.md/tokens diffs comments-only, lens-verified
  byte-identical hex); TOKENS.md flag-free. Engine registry 19→28 + delta verdict legs
  (3.382/4.883 confirmed LIVE on rendered DOM, raster-precision composite); F5 real
  defect fixed (store-badges anchor had NO color channel — UA link-blue survived theme
  flips; token hookup, zero pixel change). Ledger 28/28. The worktree ×2 surfaced 2
  PRE-EXISTING baseline fails (mega-nav--page light+dark: 8.1's CEM growth +41px, same
  class 256e5cf adjudicated — the docs PAGE was missed); STOP obeyed by the executor,
  orchestrator adjudicated LEGITIMATE → re-taken exactly-2 (1280×3372→3413, prediction
  exact). Lens SHIP 0/0/5 (3 pointer/arithmetic notes fixed in-window); true unit count
  trued 876→881 (8.3's +5 had been missed).** **8.4 DONE (b05613d worktree = 83f2b7e
  verify-trio + batch package, b05613d RELEASE §8 + HANDOFF close; base aa9780f →
  FAST-FORWARD merge; spec-8-4 closed): fidelity ledger 25 rows (58 documented
  deviations, HYBRID/pattern-consistency honesty), yellow audit 13/13 PASS (0
  violations), impeccable kit-wide 207 files exit 0 (lens re-ran the detector + the
  can-fail probe itself), baseline package ЧАСТЬ v2 (414 PNG; re-takes R-14/R-2/R-2′ =
  16+2), RELEASE.md «Релиз v1.1.0» §8.1–8.7 (tag = MAINTAINER-only; PROOF nothing
  executed: tags = v1.0.0 only, versions 1.0.0, CHANGELOG clean), HANDOFF v2 ✅ 14/14.
  Lens SHIP 0/0/5 (4 citation fixes in-window). Visual proof INHERITED — the range is
  docs-only and `git diff --exit-code -- packages/ tests/` vs aa9780f is CLEAN (the
  8.2-close ×2 1368/1368 stands for the bit-identical served tree).** **v2 COMPLETE —
  14/14 stories (2026-09-25). The repo now waits on the MAINTAINER QUEUE only: (a)
  baseline batch-confirm (ЧАСТЬ v2 of baseline-review-package.md — 140 new + 18
  adjudicated re-takes) — **CONFIRMED 2026-09-25 (gate closed, see the ✅ block in ЧАСТЬ v2)**,
  (b) release v1.1.0 per RELEASE.md §8.1–8.5 (THE tag — never autonomous; **SHIPPED
  2026-09-25: annotated tag v1.1.0 on e09fd3c, pushed, Actions success run
  36110877833 — placed under the maintainer's explicit live instruction once
  green; §8.4 fresh-clone gate PASSED same day** — consumer renders DataTable
  via the React wrapper, full checklist green; TWO recipe amendments found:
  vite needs `resolve.dedupe:['react','react-dom']` (vite ^8.3 patch drift —
  SM-6 passed without it) and the dark-theme attribute goes on `<html>`;
  evidence `.playwright-cli/verify/v110-fresh-clone/`, deferred-work entry
  added), (c) SR spot-checks v2 — **DONE 2026-09-25: VoiceOver 18/18 ✓, zero
  deviations (run-sheet SR-RUNSHEET-v2.md + digest)**; iOS momentum-scroll stays
  maintainer-side debt (NOT release-gating), (d) the stepper brown-token
  decision — REFUSED 2026-09-25, then **ADOPTED at v1.2.0: story 9.1 (2026-09-25)
  landed `tint-brown` #8D6040 (theme-invariant, charcoal mold) and flipped the
  stepper default — brown fill + white numeral (AA 5.413:1); the radius ≈32
  sibling decision was REFUSED BY PROBE the same day (form card measures 23.8px —
  the ≈32 was a vision artifact of the stacked dark card); closed in
  deferred-work 7.3/7.4f**.
  Sequencing in
  epics-v2.md; the v1 component-story gate applies VERBATIM (FR-16). Key v2 decisions: delta
  semantics via AA-override (green-300/red-300); warm-cream family DISTINCT from beige (dark
  first-pass [ASSUMPTION] → 8.2); typography registers = mappings (h1 44→heading-2, 36→heading-3),
  zero new type tokens; keyboard defects of the reference (inert arrows, chip focus-drop) are
  IMPROVED per APG — the sanctioned a11y axis
  Sequencing in
  epics-v2.md; the v1 component-story gate applies VERBATIM (FR-16). Key v2 decisions: delta
  semantics via AA-override (green-300/red-300); warm-cream family DISTINCT from beige (dark
  first-pass [ASSUMPTION] → 8.2); typography registers = mappings (h1 44→heading-2, 36→heading-3),
  zero new type tokens; keyboard defects of the reference (inert arrows, chip focus-drop) are
  IMPROVED per APG — the sanctioned a11y axis
- **v1.2.0 cycle (epics-v3, 9 stories) OPEN 2026-09-25: story 9.1 DONE** (c13ba12+4184494 —
  tint-brown + font-mono tokens, tooltip 288px-cap content fix, THE single baseline round: 20
  PNGs; radius-3xl refused by probe 23.8px). **CI postscript same day: the tolerance
  retirement was REFUTED by Actions (run 36131832924, both placements legs red — the cap pins
  pill width, not wrap line count: ubuntu +1 line, 68→87px); entries restored light 0.13 /
  dark 0.08 — the CI-scoped tolerance is the STANDING fix for text-metric geometry**
  (ledger + spec-9-1 change log carry the record). **Story 9.2 DONE** (3354a2f+1c9a450 —
  generator truth: `aa-annotations:` frontmatter block = the 10 AA-bearing TOKEN_NOTES
  derive from DESIGN.md with both-direction aborts + body-anchor assert + firing canary;
  AD-4 matrix single-sourced in root `ad4-matrix.mjs` — eslint/boundary-test/README all
  derive, 7 direction-string copies died; debts 1.1+1.2 closed in the ledger).
  **Stories 10.1+10.2 DONE** (325631c+afb6089 — one batch round: `sr-only` label modes on
  input+segmented-radio, checkbox `error` channel (input mold), `subtitle` slot on stepper
  + `page-copy` slot on qr-block (presence molds; slot-oscillation convergence rule found:
  presence sync re-queries the live tree, never trusts event.target); both showcases
  adopted reference-verbatim copy — the business subheading needed a lens MAJOR correction
  (executor's first copy was INVENTED; render-verify 731px vs 729px capture ink — standing
  lesson: copy extraction without render-width verification is an unverified claim);
  ledger 7.4a–d + 7.5a closed. CI round: first push RED — the invest qr-tab interactive
  leg raced the lazy-QR decode at rect-measure time (macOS-light baselined pre-decode,
  dark already loaded, ubuntu loaded-in-both); orchestrator remediation = decode-wait
  before the rect + CI-only 0.03 tolerance for the clip leg + light baseline re-take —
  standing rule: interactive-baseline legs AWAIT LAZY-MEDIA DECODE before any rect (the
  «revalidate after await» iron rule's media case, in the ledger next to port-6007)).
  Next: 10.4 → 11.1–11.3. Sequencing in epics-v3.md. **Story 10.3 DONE** (9813a65 —
  promo-card `art-mode='bleed'`: CSS-only full-bleed bottom art zone + floating-pill
  actions overlay; pill offset probe-refuted the spec's 12–16 expectation → EXACT
  space-32 (Δ=0 in 6/6 cards); no scrim (0 text-over-art in reference); showcase
  adoption retired `.tkb-stage` (deviation 2 + ledger 7.4e closed); Lit reflect pins
  `attribute:'art-mode'` (default reflect plain-lowercases — pagination show-more mold);
  host mints `art-mode="top"` from first update — the variant="gray" reflect precedent,
  shadow render byte-identical (unit-pinned, honest deviation recorded in the spec
  Change Log); showcase sizing probe-gated to zone height, max-width 400px length
  literal flagged with provenance (zero-hardcoded guard covers colors/z-index only)).
  **Story 10.4 DONE** (de304e7 — tk-button `href`/`target`/`rel` anchor mode: shadow
  render swaps `<button>`→`<a class="button">` when href is set, ZERO CSS edits (the
  sheet already neutralizes anchor UA defaults); rel = noopener noreferrer iff
  target=_blank (deterministic, no URL parsing; consumer rel verbatim); disabled/
  loading inertia via the existing host interception; no-href DOM byte-identical —
  captured-literal pin, lens base-verified + mutation-proven; anchor branch duplicates
  the inner tree ON PURPOSE (a shared child expression would inject Lit `<!---->`
  markers); invest hero adopted href="#ios" (#fragment placeholder mold) and re-took
  BYTE-IDENTICAL both themes (blob-hash-equal — semantics, not pixels); 6 moved PNGs
  not 8; CHANGELOG Unreleased→Added; ledger 7.5b closed). **ZERO spec deviations —
  the cycle's first.**
  **Story 11.1 DONE** (7ee97e1 — a11y-sweep deltas on the 10.1–10.4 surfaces: 12 new
  engine legs — Group VI registry rows button variants (11 stops) + promo-card
  variants (10), five targeted mode-legs (input/segmented sr-only via `&args=`,
  checkbox error via property-API — the args channel silently drops multibyte,
  ASCII-only grammar pinned at the leg site; stepper/qr-block tree legs), cookie
  7.2(b) closed by a bounded Shift+Tab reverse-entry walk (one-press reading
  measured-and-refuted; consent-choice + consumer close); ledger group-VI 42/42;
  SR protocol rows in the seven stories + 3 approved demo figures +
  SR-RUNSHEET-v1.2.0 (14 EMPTY maintainer rows — execution §8.1.4-side);
  lens MAJOR: birth-stale «+20%» expectations fixed to the shipped +30% (4 sites +
  2 PNG re-takes); stale-dist incident caught by the byte-identity-impossibility
  alarm (6.3 class in miniature — no pipelines around gate commands); visual
  1368→1380). Next: 11.2 → 11.3.
  **Story 11.2 DONE** (a0fb95c — docs completion: `--tk-font-mono` first
  consumer = ALL docs code surfaces — 8 rules at 5 files incl. the lens-caught
  component-search tag chips (hyphen-blind sweep root cause: `\.tk\w+` can't
  match `.tkcs-grid`); stale «invest tables (11.2)» first-consumer claim
  corrected at 5 sites (DESIGN.md fonts comment + 2 generator literals +
  2 tests) with 9.1 provenance kept, regen comment/note-only; consumption pin
  (consumed-tokens names the 5 files, mutation-proven); getting-started gains
  the vite-dedupe recipe + README cross-link; adjudicated in-story fix:
  `tabindex="0"` on codeBlock pre (mono made the stepper sample actually
  scroll → axe scrollable-region-focusable; zero pixels, sweep untouched);
  sanctioned baselines MEASURED 36 legs + 2 fix-round re-takes, zero
  unsanctioned movement; unit 942→943, visual 1380 unchanged. CI round:
  system-first mono = platform-metric class — ubuntu reflows doc pages
  (+17…+28px full-page heights, exactly the 36 legs); tolerance CANNOT fix
  it (Playwright 1.63 compareImages hard-fails size mismatch before
  maxDiffPixelRatio) → structural fix: `--tk-font-mono` joins the harness
  font pin (JetBrains Mono via @fontsource, test-only dep — token layer
  stays system-first per 9.1), 36 baselines re-taken under the pin).
  **Story 11.3 DONE** (602262e — epics-v3 closed 8/8: fidelity ledger
  v1.2.0 (13 rows; both epics-named re-checks closed vs 9.1 probes —
  stepper brown ADOPTED, bento-radius ≈32 REFUTED confirmed) + yellow
  audit 0 violations + impeccable 0 blockers + batch package ЧАСТЬ v1.2.0
  (414 PNG flat, register 11 commits/163 events, byte-identical pairs
  blob-hash-proven) + RELEASE §9.1–9.7 (fresh-clone PromoCard artMode
  recipe, dedupe self-sufficient, §9.7 proofs executed ×2) + HANDOFF
  epics-v3 close + maintainer queue (a)–(d). Lens FIX-THEN-SHIP → fix
  602262e (4 token-level corrections); visual inherited at merge via
  bit-identical served tree (8.4 mold). **v1.2.0 prep COMPLETE — tag is
  MAINTAINER-ONLY: batch-confirm → RELEASE §9.1–9.5 (tag) →
  SR-RUNSHEET-v1.2.0 → opportunistic spot-checks.** Next: epics-v4 draft
  (admin/authorized-zone family post-v1.2.0) + port-6007 micro-story
  (deferred-work).
- **Kit totals: 943 unit + 1380 visual/axe tests, 27 components, 27 React wrappers, v1 design
  assumptions all closed (6 v2 dark first-pass [ASSUMPTION]s open BY DESIGN until 8.2), CI green —
  CORRECTED 2026-09-25: Actions had been RED since 5.5/6962326 (typecheck step ran before build;
  workspace dist types missing on a fresh checkout; local gates masked it on stale dist — last green
  run 6b07feb 09-23, the v1.0.0 tag commit has zero Actions runs). Fixed in ba0b622 (build →
  typecheck; full record in RELEASE.md §1). RULE: "CI green" = the Actions verdict via `gh run`,
  never inferred from local gates.**
- **2026-09-28 FINAL (v1.3.0 cycle closed):** epics-v4 executed 7/7 (12.1 → 14.2) —
  totals now **951 unit + 1438 visual/axe, 430 baseline PNG** (measured at 14.2);
  maintainer queue (a)→(b)→(c) closed under the explicit live sanction
  «a and then b and then c»: batch-confirm (delegated hybrid sitting, `0690981`),
  release §10.1–10.5 (release commit `b8a7b3a`, CI success run 36391431890,
  ANNOTATED tag `v1.3.0` → tag object `1dc18af0`, remote deref verified,
  fresh-clone §10.4 gate PASSED — `verify/v130-fresh-clone/`), SR spot-checks
  — BOTH runsheets executed as the MECHANIZABLE half (v1.3.0: 38/38, `ef22b75`;
  v1.2.0: 52/52, `9083180`): computed name/role/state vs expected RU
  announcements, both themes; live VoiceOver honestly NOT executed
  (METHOD.md §SR — no fabricated checkmarks); digest tables №№29–41 in
  `verify/sr-spot-check/PROTOCOL-DIGEST.md`. GitHub Release pages exist for
  ALL four tags (v1.2.0/v1.3.0 created 2026-09-28, notes verbatim from
  CHANGELOG). Remaining maintainer-side: opportunistic (d) only (iOS
  momentum-scroll — needs a real device; avatar-menu/kebab open-state
  capture — needs fresh maintainer-session material). CI verdicts of the
  close-out chain: `ef22b75` run 36400544143 success; `a1e7fcf` run
  36402884699 CANCELLED by the newer push (workflow concurrency — content
  subsumed); `9083180` run **36405053534 success** (the cumulative tree
  verdict, checked via `gh run view`).
- **2026-09-28 POLISH ROUND (post-release; sanction «lets continue to improve»):** maintainer
  picked three directions — (1) autonomous polish now, (2) admin-zone dose-close, (3) ТЖ as a
  SEPARATE exportable sub-kit (verbatim directive «отдельным под ui kit… отдельную сущность,
  а не целый большой проект» — shapes epics-v5; planning starts on the maintainer's word).
  Landed: **docs-nav regroup `43fb084`** (CI success run 36415613440) — the 11 `Components v2/*`
  overview pages became `Guides/*` (9) + `Patterns/*` (2: Console chrome, Data surfaces); 26
  baselines prefix-moved byte-identical, 2 cookie-banner page PNGs re-taken (exact suite casing),
  component-search ids follow; forensics in `.playwright-cli/verify/docs-regroup/NOTES.md`
  (incl. the pre-existing `--list` 1440 vs executed 1438 delta — runtime-skipped legs, NOT a
  rename artifact; stash-verified against HEAD). **OSS scaffolding `a1148f9`:** README freshness
  (27 components ×2, v1.3.0 pin ×2, «независимый учебный проект» — the repo is public),
  CONTRIBUTING.md (pnpm-only env, gen-before-test order, 1.5% baseline rule, port-6007
  serialization, a11y gate FR-16, legal boundaries), RU issue templates (bug report + component
  request) + PR checklist — all carry the PII-redaction gate. **Admin prep `0cbe955`:**
  follow-up capture RUNBOOK (3 open states: avatar-menu, row kebab, «…» overflow — read-only,
  PII redacted BEFORE delivery) + DRAFT menu-popover/avatar-menu gap-map in
  `_bmad-output/implementation-artifacts/` (NOT a spec; roster decision after captures). CI
  verdict of the round chain: `0cbe955` run **36417446515 success** (cumulative tree verdict).
- **2026-09-28 ТЖ RECON (the #3 direction opened):** `captures-v3/tj/` pack `38301a0`
  (CI success run **36434783152**, checked via `gh run view`) — 5 surfaces (home, article,
  /flows/news/, /pro/, /community/) × viewport+fullpage + native-dark home viewport, computed-style
  probe battery (read-only, session `tinkoff-ui`). Key finds: OWN token system disjoint from the
  bank kit (pages #F0F0F0/#12151C, pure-black headline ink, #333 CTA r5 h30, gold #C79637 links,
  meta #A6A6A6); **two-family type — Graphik UI + Charter SERIF article body (corrects the
  single-sans claim)**; h1 scale 21/32/38/45/55 per surface; accents tightly scoped (purple
  #8054FF = 30×30 badge only; yellow/navy = native-ad modules only) — the **editorial-vs-ad
  language split**: ad modules may reuse main-kit promo components, editorial chrome is the ТЖ
  kit proper. Package decision (pillkit-tj package vs separate repo) = epics-v5 ARCHITECTURE
  phase; BMAD chain starts on the maintainer's word.
- **2026-09-28 EPICS-v5 PLANNING CHAIN COMPLETE (sanction «ok lets continue»):** brief v5 scope
  block + PRD §4.9 FR-17..22 + OQ-8..10 (`fddb792`, CI 36453062964 success); UX phase — the ТЖ
  authority at `ux-designs/ux-tj-kit-2026-09-28/{DESIGN,EXPERIENCE}.md` (`8b700fa`): own token
  source in the generator grammar (ink-first palette, gold AA asymmetry light-override/dark-keep,
  restricted reference inks, native-dark = reference's own values, two-family Graphik+Charter,
  radii/shadows MANDATORY pixel-probe per the 9.1 lesson, motion inherited); architecture v5
  Delta (`d8fed03`): PARALLEL PACKAGE FAMILY `pillkit-tj-{tokens,components,react}` + shared
  docs consumer, AD-3 one-mechanism-two-inputs, AD-4 parallel lanes + FORBIDDEN tj→bank edge,
  AD-12 drawer ruling, OQ-9 resolved (`--tj-*`, `tj-`, `data-tj-theme`), OQ-10 same release
  train; **epics-v5.md (`daf3c6e`): 3 epics / 14 story-units, critic-reviewed in-file** — E15
  scaffold (15.1 boundary+CI, 15.2 tokens+probes+AA pins, 15.3 OQ-8 fonts), E16 roster (16.1
  reading primitives FREEZE, 16.2 rubric+news, 16.3 tag-chips+/pro/, 16.4 community, 16.5
  chrome+drawer, 16.6 composition+ad-slot+walkthrough), E17 verification+release (TAG =
  maintainer). Build loop OPENED: spec-15-1 written (parallel family scaffold, FR-17
  mechanized in both lint layers).
- **2026-09-28 STORY 15.1 EXECUTED (code-head `0b2cd8d`):** the ТЖ family stands —
  `pillkit-tj-{tokens,components,react}` on the bank molds (dual-alias inherited from
  tsconfig.base; `/^pillkit-/` vite externals cover both families without an edge);
  **FR-17 DERIVED, not hand-listed**: `ad4-matrix.mjs` FAMILY_DIRS → `fr17Groups()`/
  `FR17_MESSAGE`, consumed by eslint (group+escape messages) AND the boundary-test matcher
  (incl. relative escapes) — both directions trip-probed and reverted; docs = sole
  exemption (pinned negative-leg in the structure test). CONVENTIONS.md seeded (bank §4/§9
  grammar, `[OPEN—16.1]` marks, AD-12 drawer ruling verbatim); docs TJ shell + 2 baselines;
  zero-hardcoded/CI/README ride the single sources. Quick-review lens: SHIP, 4 MINOR all
  fixed in the orchestrator round (LICENSE per-package scope notes + MIT fields, README ×3
  with the install-ТЖ-alone recipe, eslint FR-17 message pin). Spec closed: Change Log 1
  corrects the stale `@tk-kit/*` spec strings to spine-OQ-9 `pillkit-tj-*`; 2 amends the
  shared-layer enumeration. Gates: orchestrator re-ran install/build/test/lint/typecheck —
  exit 0; bank src byte-untouched.
- Fonts: DaytonaSans/DaytonaPragma in `packages/tokens/fonts/` under LICENSE-FONTS.md (separately
  licensed, NOT MIT; consumer rights ONLY per that file)
- **Lit on this stack requires `experimentalDecorators: true`** — do not "fix" this
- **HANDOFF.md (root) is the full handoff document** — plan, debts, nuances, governance
- deferred-work.md: revisit-condition entries (axe re-entrancy serialization, mono slot, iOS
  scroll-lock, AD-4 single-source, AA-derivation, fold literals, preview.ts canvas bg)

## Toolchain (installed & configured)

### BMAD Method v6 — planning & delivery loop
- 30 skills in `.claude/skills/bmad*` (agents: Mary-analyst, John-PM, Sally-UX, Winston-architect, Amelia-dev)
- Runtime: `_bmad/` (config.toml, scripts) — never hand-edit `_bmad/scripts`
- Artifacts output: `_bmad-output/` (planning-artifacts/, implementation-artifacts/)
- Say **"bmad help"** when unsure which skill is next
- Maintenance: `npx skills update` (uses skills-lock.json), then "bmad doctor" to repair the runtime
- Requires `uv` (installed ✓)

### impeccable — design quality & anti-slop
- Skill at `.claude/skills/impeccable/` + 4 agents + detector hooks in `.claude/settings.json`
  (every Edit/Write of UI files gets immediate checks; deep pass on Stop — treat findings as blockers)
- **init done:** `PRODUCT.md` exists (schema 1); `buildPath: "code"` in `.impeccable/config.json`
  → build surfaces directly in code (the reference site is the visual bar), no comp images
- `DESIGN.md` does not exist yet — it appears via `/impeccable document` or new-work once real UI exists
- Key commands: `/impeccable craft|audit|polish|critique <target>`

### transitions.dev — UI motion
- Skill with 32 transition references at `.claude/skills/transitions-dev/` + `transitions-polish`
- Vendored at scaffold (Story 1.1); motion values fold into `--tk-motion-*` tokens per AD-9
  (the recipes' `:root`-level selectors never match inside shadow stylesheets)
- All transitions respect `prefers-reduced-motion`; classes namespaced `t-*`

### inspo MCP — real-site design references
- Project-scoped server in `.mcp.json` (hosted https://inspomcp.dev/api/mcp) — **verified operational**
  (live `get_filters` call, 2026-09-24; taxonomy: 19 macrostructures w/ coverage, 11 styles,
  10 component types)
- NOTE: `claude mcp list` may report "⏸ Pending approval" — that is a stale artifact of the non-interactive
  subprocess check. Judge availability by whether `mcp__inspo__*` tools are present in the session
- Use before writing UI: `recommend(brief)`, 1–2 `search_screens`, then `get_screen` on the 3–5 kept
  references; `find_by_color('#hex')` when a brand color is named. Budget: one recommend + a couple of
  searches per study; results are re-read every turn, extra searches cost more than they find
- Optional: `TOGETHER_API_KEY` env unlocks semantic search (never commit secrets)

## Browser automation — playwright-cli ONLY (no browser MCP)

- `playwright-cli` v0.1.21 installed globally + user-level skill; `@playwright/mcp` is deliberately
  **NOT registered** — the CLI covers everything (same snapshot/ref model) and two parallel browser
  stacks cause session/state conflicts. Do not add browser MCP servers
- Per-project session isolation (ALWAYS set before use):
  ```bash
  export PLAYWRIGHT_CLI_SESSION=tinkoff-ui
  playwright-cli open <url> --persistent   # first open persists the profile
  ```
- Reference capture from tinkoff.ru: `screenshot --hires` (full pixel ratio), `find <text|sel>` (grep-like
  snapshot search — keeps huge pages out of context; prefer over full `snapshot` on tinkoff.ru)
- Verification of our axes: `set-color-scheme dark`, `set-reduced-motion`, `set-contrast`, `set-forced-colors`
- Mobile: `open --mobile` or `--device="iPhone 15"`
- E2E (later, after scaffold): `pnpm add -D @playwright/test` → `playwright test`
- Screenshot analysis: this harness is text-only for images — use zai-mcp-server vision tools
  (`mcp__zai-mcp-server__analyze_image` etc.) on saved screenshot files, never describe images from memory

## Design reference workflow (this project)

1. Analyze the reference site (tinkoff.ru) — inspo MCP `recommend()` + playwright-cli capture for tokens
2. Extract design tokens → palette, type scale, spacing, radii, shadows, motion curves
3. Component inventory → rebuild as kit primitives, improve a11y / dark mode / tokens where the original is weak
4. Every component: impeccable `audit` + transitions for interaction states
5. Naming: unofficial study/recreation project — no T-Bank trademark use in published output, no official-status claims

## Conventions

- pnpm only (`pnpm add`, `pnpm dev`); Node >= 20
- Git: `origin` = github.com/salacoste/tinkoff-ui-kit.git, branch `main`; commit messages in English,
  conventional style (chore/docs/feat/fix)
- Don't commit `.claude/settings.local.json`; `.omc/`, `.claude/state/`, `.claude/sessions/` are gitignored runtime state
- `_bmad-output/` drafts are fine to commit once stable
- UI edits trigger impeccable hook feedback — findings are blockers for design work

- **2026-09-28 STORY 15.2 EXECUTED (code-head `67f42f9`):** ТЖ has a token table —
  ONE generator mechanism, TWO inputs (AD-3 v5): root `scripts/token-gen/core.mjs`
  (pure) + config'd CLIs per kit; **bank artifacts byte-identical** (only its CLI
  refactored). 96 light `--tj-*` + 11 dark overrides DUAL-EMITTED (attribute +
  `prefers-color-scheme` auto leg, `:not([data-tj-theme="light"])` no-flash) +
  reduced-motion collapse. dark-ink `#FFFFFF` / dark-divider-strong `#D0D0D2` authored
  from the dark-home pixel census. AA truth machine-pinned (contrast test: 14
  sanctioned 3-dec + 3 restricted FAIL-way + exact-set 16/11 + alias equality
  link=gold-ink/engage=ink-reference-meta); consumed-tokens ТЖ block + cross-family
  FR-17 `var()` isolation guard (lens MINOR fix, injection-probed). `gen:tokens:tj` +
  `check:tokens-drift:tj` root scripts. Quick-review lens: SHIP, 0 MAJOR (1 MINOR
  fixed, 2 NITs accepted). My spec's pin arithmetic was corrected pre-execution via
  Change Log (5.099/5.308/5.876; impossible ink-200/cta-fill 21.000 → cta-ink/cta-fill
  12.635; badge 4.536) — machine truth wins over spec prose.

- **2026-09-28 STORY 15.3 EXECUTED (code-head `61442c0`):** OQ-8 closed on the
  ruled path — NO font bytes bundled (no Graphik/Charter licenses delivered; the
  Daytona mold stays a documented conditional flip). Harness pins both
  `--tj-font-*` slots to served open faces (ui→Inter, reading→PT Serif 400/700
  at /pt-serif; @fontsource/pt-serif OFL-1.1) — determinism regardless of local
  installs; specificity lens-verified across all three theme states. Zero-fonts
  invariant mechanized (tests/tj-fonts-policy.test.ts ×4: no bytes, frozen stacks
  byte-exact, pins present, inject asserts). local-fonts extended (mode A canonical
  stubs / mode B aliases; honest license pointers). First story with an EMPTY patch
  round (lens SHIP, 3 NITs all accepted). 16.1 pre-work DONE on the live reference
  (probe9): article-H1 = Graphik 700/45/50 CONFIRMED; nav-label corrected to 17/700
  (vision 16/400 was a wrapper artifact); Charter lead/body exact — DESIGN.md
  amendment + regen land as the 16.1 pre-work commit.

- **2026-09-29 STORY 16.1 EXECUTED (code-head `0792d1f`, CI run 36483033096's
  successor 36496257421 GREEN after one harness round):** the ТЖ family has
  components — tj-prose (760px Charter reading column, 21/30 body + 27/35
  lead, Graphik H2 38/700/45 + pull-quote 35/50, 25px rhythm, RU hyphenation),
  tj-link (probe10 species: link-body ink, rest-transparent underline → 70%
  color-mix reveal on hover, 1px/0.1em/under, ink-stable hover, deterministic
  external-rel rule), tj-cta (anchor-only, 44×44 box / 30px pill inset 7px,
  dark inversion via tokens, zero invented states). FREEZE ritual landed in
  CONVENTIONS.md: NONE stateful in roster / EMPTY frozen event-map / unwrap
  bridge = documented FR-17 duplication / NO z tokens (16.5 mints); drawer
  stays [OPEN — 16.5]. AD-1 second instance PROVEN: scripts/wrapper-gen/
  core.mjs parameterized (bank byte-identical pre-wiring), tj CEM manifest +
  tj-react generated wrappers under root gen/check:gen +
  tests/tj-gen-drift.test.ts. Two review patch rounds (nested-anchor species
  → tj-link two-surface contract; gen-drift mechanization) + two axe
  color-surface rounds (ink-300; card-over-gray-page — the ТЖ AA-surface
  law: no bare-page meta ink in the palette by design). Provisional
  baselines: 24 tj PNGs; first CI compare caught the LAST unpinned font
  surface (raw `monospace` story-canvas code chrome — mac Menlo vs CI DejaVu
  reflowed +5..15px); harness pin `#storybook-root code/pre/kbd/samp` →
  JetBrains Mono (11.2 precedent), mint4 1516 passed, 22 PNGs re-minted,
  zero non-ТЖ baselines touched. Side-by-side vision review vs the live
  capture GREEN; H2 40/24 + pull-quote 32 stay flagged for the maintainer's
  baseline-review package (5.6 mold). Next: 16.2 rubric header + news card.

- **2026-09-29 STORY 16.2+16.3 EXECUTED (batch, code-head `e7a9233`, CI run
  36503716482 GREEN):** ТЖ feed surfaces — tj-rubric-header (cover/mark/
  default slots, ::slotted h1/p species, −50px half-overlap mark FLAG,
  top-corners-only cover clip capture-grounded, graceful-empty via slotchange
  + change-guarded updated() backstop — happy-dom doesn't fire slotchange on
  initial assignment), tj-news-card (whole-card single anchor, row-as-link
  mold; skeleton bones ink-300 12% alpha, NO shimmer; inert/external-rel =
  16.1 verbatim), tj-tag-chip (theme-invariant purple pill — authored
  chip-fill #6E48DB 5.813:1 vs the reference's 3.380 wash, decorative
  chevron, lift −2px, chip-ink ring per the AA-surface law), /pro/ hero
  PATTERN story (badge-purple field + chip row + r10×h50 CTA, chip-ink on
  badge-purple 4.536:1 spec-frozen pair; hero-top CTA is a bare TEXT link
  per the live capture — fidelity note in prose). Executor's CTA inversion
  (white fill) caught in triage → flipped to spec. Lens PATCH-NEEDED(5), all
  landed: twin innerHTML invariance pin (dark vs light ancestor
  serialization equality); card-title leading 24 — ONE species ONE leading;
  honest full-subtree accessible-name prose + aria-labelledby freeze-note
  (host-level labelledby is a11y-inert for the shadow anchor — forwarding
  ids = component change, OUT of batch); four-species ::slotted count pin
  (cssText KEEPS comments → non-empty-parens regex); cover lh-0 FLAG.
  PIPEFAIL GATE LAW: `pnpm test | tail` masked ERR_PNPM_RECURSIVE_FIRST_FAIL
  as TEST OK — full chain re-proven under `set -o pipefail` (tj 103/103,
  root 180/180). Baselines: 22 new PNGs (11 stories × both themes), zero
  existing touched, mint 1582/1582. Side-by-side vision GREEN ×3 (rubric
  overlap renders; news flat/r25/serif lead; hero purple CTA + darker
  chips). Maintainer package adds: mark white stroke + two-row byline
  observed-not-shipped; mark/heading optical inset; CTA fill == field fill
  boundary note. Next: 16.4 composer + post card (first stateful —
  event-map opens; the --tj-z-*/drawer/overlay marker corrected to 16.5).

- **2026-09-29 STORY 16.4 EXECUTED (code-head `26e11e0`, CI run 36513699070
  GREEN):** ТЖ community + the family's FIRST STATEFUL surface — tj-composer
  (fake-input card = real `<button type="button">`, name = ghost text
  card-title 17/400 ink-300, Enter/Space native, height DERIVED 24/40/24 = 88
  never declared, avatar 40 aria-hidden wrapper, structural r20 FLAG —
  `--tj-radius-composer` stays a maintainer ratification candidate, NOT
  minted) dispatching `open-compose` (composed+bubbling, TjOpenComposeEvent;
  editor is consumer-side by FR); tj-post-card (TRANSPARENT cell — the
  reference's cards are text cells on a shared white sheet; boxing breaks the
  composition — on the tj-news-card anchor mold verbatim: inert empty-href,
  noopener+noreferrer on bare _blank; slots avatar-20-FLAG/byline/date/
  title/count; clamp quartet pinned INSIDE the extracted ::slotted(h2,h3)
  rule; count = decorative bubble SVG + static text, never a live region).
  EVENT-MAP OPENS: first entry `'tj-composer': { onOpenCompose:
  'open-compose' }` + React smoke + NEW tests/tj-event-map-completeness.test.ts
  (scans BOTH dispatch idioms, no non-tj- skip — loud attribution, bank net
  mirrored). Lens MAJOR (real): `@property() override title` SHADOWS the
  native reflecting accessor — property writes never reflect (exactly how
  @lit/react sets known props) → documented consumer-wins contract was dead
  on the React path; fix = precedence chain ATTRIBUTE (verbatim, "" =
  deliberate suppression) → non-empty PROPERTY → slot mirror. Lit lesson:
  attribute REMOVAL maps to a NULL property write — null-guard required.
  Side-by-side round 1: ONE real pattern finding, SPEC-ORIGIN — frozen Intent
  put the composer INSIDE the white sheet (tone-on-tone, card stopped
  reading); the reference carries it on the GRAY PAGE above the sheet →
  fixed STORY-side (sibling + .tjcp-composer rule; component untouched),
  round 2 PASS. Ellipsis «defect» = FALSE POSITIVE (vision's own
  transcription ended three titles with «…»; round 2 transcribed it again).
  CONVENTIONS §4 ТЖ rows frozen; drawer/overlay/--tj-z-* markers corrected
  16.4 → 16.5 (final epics numbering — 16.4 owns NONE of them); README +2;
  consumed-tokens roster 6 → 8. Baselines: 14 new PNGs (3+4 stories × 2
  themes), all 1610 existing byte-stable (full-suite re-verify 1624/1624).
  pnpm `--` passthrough lesson: `pnpm test:visual:update -- -g "x"` loses
  the grep (post-`--` args = POSITIONAL filters for playwright) → full
  suite ran; scoped update = OMIT the `--`. Maintainer package adds:
  composer r20 FLAG, count-below-title micro-delta, meta-avatar 20,
  news-title-24-over-vision-pixels ruling, composer-on-page pattern ruling.
  Next: 16.5 chrome — tj-header + tj-rail + burger drawer + AD-12 ТЖ
  overlay helper + --tj-z-* mint + theme control menu.

- **2026-09-29 STORY 16.5 EXECUTED (code-head `e945221` — dad294f + CI fix;
  run 36532883418 GREEN, first run 36530021981 RED at the impeccable
  detector):** ТЖ chrome complete — tj-header (sticky z `--tj-z-nav`;
  WHITE CARD PILL chips on the page-gray bar; SEMANTIC-ONLY current
  (aria-current, zero visual delta — probe9 ×11/11 uniform 17/700 + the
  capture show NO reference marking; the spec's authored 700-delta was
  DELETED vision-evidenced); NO divider — the bar blends into the page;
  stateless theme cycle auto→light→dark on `documentElement
  data-tj-theme`, auto = REMOVE attribute, no matchMedia, `theme-change`
  detail = BARE STRING (state lives on the root, not a <prop>-change
  channel), RU polite announcements; CTA = fully-rounded 36px pill
  (`--tj-radius-full`, inset-block 4px — NOT the article r5) + tj-rail
  (w290 rows nav-label species, icon-{value} 40px tiles/30px visual,
  burger <1200px) + drawer (open REFLECTED + `open-change`
  {value:boolean}) + the AD-12 ТЖ overlays helper (mountSheet/lockScroll/
  trapFocus — the documented FR-17 duplication; popover-UA resets +
  post-await revalidation translated) + `--tj-z-*` mint (nav 100 /
  drawer 300; 200 spare) + event-map ×2. LESSONS: (1) Lit first-update
  change-map — EVERY first-update change entry carries old=undefined
  INCLUDING stamped attributes → guard DISPATCH ONLY, mount
  unconditionally (bank select.ts mold), guard unmount (burger
  focus-steal); a stamped `open` owes the sheet from first paint. (2) CEM
  event inference walks class METHODS only and cannot name CustomEvent
  subclasses → a nameless manifest entry rides next to @fires; fix =
  dispatch from a `#emitX` readonly FIELD initializer (the
  #handleThemeActivate shape). (3) Lit attribute REMOVAL = null property
  write (`burgerLabel: string | null` + trim-fallback). (4) SSR
  base-access: `document.createElement?.()` throws ReferenceError when
  document is undefined — ?. guards the CALL, not the base access;
  `typeof` ternary; found rewriting a vacuous happy-dom SSR test into
  `vi.stubGlobal('document', undefined)`. (5) **THE IMPECCABLE DETECTOR
  IS A CI GATE ON CHANGED UI FILES** — layout-property transitions
  (`transition: height`!) are BLOCKING; the sanctioned height-animation
  channel is `grid-template-rows` (px↔px interpolates evergreen) — .bar
  is a one-row grid, rest-state rendering identical so baselines stand;
  AND the detector scans TEST sources too: a negative pin's own literal
  trips the pattern → join the needle at RUNTIME. (6) Vision
  weight-estimation is unreliable at page scale: two independent passes
  "saw" mixed rail weights — impossible from uniform CSS, disproved by a
  3× zoom pass (all labels same stroke; the tiles' visual mass biases the
  read; the passes even disagreed on WHICH rows); trust computed styles
  for numbers, vision for structure. Fidelity round: per-chip icons =
  CONSUMER art (actions-slot norm); «dark hero light-leak» = synthetic
  story placeholder (slot content, identical in light). Gates: 247/247
  tj-components (+3), tj-react 19/19, build green. Baselines: 18 PNGs
  (4+5 stories × both themes), mint 1678/1678, 0 tracked modified;
  maintainer batch-confirm package = 78. Next: 16.6 article composition
  + ad-slot recipe + live walkthrough.

- **2026-09-29 STORY 16.6 EXECUTED (code-head `04d172e`; CI run 36550125641
  GREEN):** ТЖ article PATTERN story (zero new package API — roster stays
  closed at 16.5; `src/patterns/` = stories only) + Flow-C ad-slot recipe
  (docs-side, the sole both-families composition point) + imports guard +
  live walkthrough 22/22. **CANVAS-SCOPE LAW (the lens MAJOR, the
  load-bearing discovery):** an OUTER descendant selector (`.tjart-canvas p`,
  0,1,1) BEATS every `::slotted` rule — Chromium counts only the ::slotted()
  ARGUMENT's specificity — so story/page chrome NEVER descends into slotted
  flow: notes carry a class (`.tjart-note`), doc headings scope to OWN
  children (`.tjart-frame > h1/h2`, `.tjad-page > h1/h2` — the
  `.tjprose-canvas > p` 16.1 mold; a mold regression, fixed as such).
  **RESTRICTED-INK CONTRACT (the axe collision — a spec bug, ratified
  deviation):** the 15.2 RESTRICTED_PAIRS (reference-time 3.949:1, engage
  2.434:1 light / 3.277:1 dark) are sub-AA BY token-table design and had
  NEVER rendered before 16.6 — minting them into 15px/400 text failed the CI
  axe legs (color-contrast). The CI axe GATE owns the rendered truth:
  card-ground meta text rides the AUTHORED AA step ink-300 (5.099:1), page-
  ground text rides ink-100 (the tj-rail mold, both themes — ink-300 is
  card-only: 4.47:1 on light page gray misses); restricted inks stay
  documented table facts for opt-in reference-fidelity consumers, NEVER
  rendered by kit stories. Token layer untouched (RESTRICTED pins stand).
  **Skeleton census mold:** bones mirror the live flow's MEASURED line counts
  (calc(N × leading)); prose rhythm = the flagged 25px literal; walkthrough
  proves zero layout shift (1310=1310) — and the census is RETUNED on probe,
  not trusted: the walkthrough round caught a 30px drift (live 4/4/3/4 vs
  authored 4/4/3/3) that block-by-block probing localized to one bone.
  Walkthrough 22/22: 18-stop tab topology (hidden backrail = 0 stops), like
  toggle emit-only, theme cycle ×3 + native-dark auto leg (attribute absent +
  OS dark; the docs boot runtime writes `light` — the auto leg needs
  post-boot removal), scroll-back rail opt-in (shown = +4 stops exactly),
  Esc inert, axe 0 both themes. Baselines: 10 NEW (article ×3 stories +
  ad-slot ×2, light+dark), mint axe legs green, existing byte-stable.
  Gates: 190/190 root tests (guard + consumed-tokens `patterns/` flip).
  Next: 17.1+17.2 batch (ТЖ a11y sweep + dark sweep) → 17.3 docs → 17.4
  ledger/ad-language audit → 17.5 release prep (TAG = maintainer sanction).
