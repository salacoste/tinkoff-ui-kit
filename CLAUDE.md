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

- **2026-09-29 STORIES 17.1+17.2 EXECUTED (code-head `ddd060e`; CI run
  36572315433 GREEN):** ТЖ a11y sweep
  (`tests/visual/tj-a11y-sweep.spec.ts`, 140 tests) + dark sweep
  (`tests/visual/tj-dark-sweep.spec.ts`, 45) — 45-id matrix (= the built
  docs index; spec prose said 46 — off-by-one ratified as spec's own
  miscount), scoped 185/185, 5 patch rounds 59→45→7→1→0 (+1 post-lens →0).
  **PSEUDO-COMPOSITE AA LAW (new family fact):** ТЖ pills paint via
  `::before` with inset geometry — effectiveBackground composites ABSOLUTE
  rendering pseudos between own bg and content (CTA label 1.15:1 vs page →
  ≈19.5:1 vs its real pill); bank molds never needed it (bank pills paint
  element bg). **3-digit hex law:** `--tj-color-chip-ink: #fff` — sheet
  readers normalize 3-/6-digit hex to `rgb()`. **Leftover legal set
  (dark):** transparent + purple field + gold + white-alpha VEILS on
  purple grounds (the /pro/ hero blobs — `color-mix(white 10%)` tints OF
  the invariant, fill-side Tier-B; surfaced by the `color(srgb r g b / a)`
  parseColor extension, Chromium's color-mix serialization). **FR-21 bank
  boundary:** bankScoped = tk- hosts + tjad page chrome above `.tjad-stage`
  (the story's own line); bank surfaces skip ТЖ leftover/invariant/shadow
  legs — spec 8.2 owns them (the `.tjad-toggle` #333 collision was value
  coincidence, not extraction drift). **LIFO focus restore:** drawer Esc
  returns focus to the PRE-TRAP element (demo button for programmatic
  open, not the display:none burger). **Story-side triage:** wordmark
  rings (`:focus-visible` 2px focus-ring offset 2px, 3 classes) + 44×44
  floors — wordmarks are FLEX ITEMS (blockified → §9 computed-inline
  exemption CANNOT apply); «Поиск» 40→44; header chip 36px KEPT (weakest
  recorded exemption, maintainer re-measure FLAG). Rings: NO underline
  exceptions (probe10 — the kit ring IS the improvement layer); purple-
  field stops ring chip-ink; exception array ships EMPTY. **SR pins ×5**
  (composer button-not-input + host-aria-label forward WINS; drawer
  dialog/aria-modal/trap/LIFO-Esc; header theme cycle dark→auto→light +
  RU live-region announcements + `theme-change` detail strings; anchor
  contracts inert-href/`_blank`-noopener/rel-verbatim ×5 stories;
  like-toggle scoped off backrail clones) — SR-RUNSHEET-v1.4.0.md (RU,
  7 surfaces × both themes, мех. ✓ prefilled; live VO maintainer-side).
  **Standing rulings:** ink-reference-time stays UNBOUND in dark (no
  dark-article capture; dark block = 13 declarations); ink-200 rides the
  cta-fill flip (deliberately OUTSIDE legal set); zero forced-invariant
  failures (no DESIGN.md re-open evidence); native-dark parity ×45 (the
  dual-emit mechanism proven per story). Lens-172 PATCH-NEEDED → fully
  integrated (3 MAJOR/2 MINOR/3 PATCH-NICE, closure condition met).
  Gates: lint+typecheck clean, 190/190 unit. Next: 17.3 docs completion →
  17.4 ledger + ad-language audit + impeccable + baseline package → 17.5
  release prep (TAG v1.4.0 = maintainer sanction ONLY).

- **2026-09-29 STORY 17.3 EXECUTED (code-head `58d979e` + CI rounds
  `202beb1`+`d02a483`; CI run 36623061743 GREEN):** ТЖ docs completion —
  token-reference (registers/typography/colors live from TOKENS.md
  single-source + drift test), theming-guide (dark-pairing/overrides/
  registers), patterns ×4 (article/community/pro/rubric page+demo), API
  tables via CEM, getting-started EXPANDED (ТЖ-ALONE install = Flow-A;
  ad-module cross-link one-directional), component-search +16 rows,
  68-row a11y/dark sweep registries (engine untouched, rows only). 50
  baseline movers (23 new ids ×2 + getting-started retakes ×2). Lens-173
  (1 MINOR + 2 PATCH-NICE) all fixed: mdInline `**bold**`→`<strong>`,
  dual-emit :host-symmetry, mdSection hoist. **Bank link contrast law
  (recorded in source comments, bit twice):** `--tk-color-link` #1771E6
  is tuned to surface-base (4.62 AA); on surface-muted #F5F5F6 = 4.24
  (light AA fail) — links NEVER sit on muted boxes. First bite:
  theming-guide overrides link (mint catch, fixed pre-push). Second:
  five pattern pages (`.tjpat-note > a`, CI 36617540273 RED) — fix
  d02a483 moves all five to page ground (rubric--demo keeps its box for
  the PII disclaimer only); exactly 10 PNGs delete+re-minted. **CI
  timeout law:** run 36593380779 cancelled ×3 at exactly ~30:20 with
  zero failed steps = `timeout-minutes: 30` ceiling, NOT manual cancels
  (timeout kills report as cancelled under the triggering actor; suite
  grew to 2123 legs vs prior green 27 min) — raised 30→60 (202beb1).
  **Verification lesson (standing practice now):** after any post-rebuild
  source fix, run the FULL suite, not scoped legs — the 17.3 close's
  scoped-only re-verification left the pattern legs unexamined and CI
  owned the catch; full local 2123/2123 (12.3m) before d02a483's push.
  **Leg count corrected:** 2123/23 files (`--list` + CI tail; the
  earlier «2118» was a partial mint tail). Gates: 1267 unit EXIT 0,
  full chain clean. Next: 17.4 → 17.5 (TAG = maintainer sanction ONLY).

- **2026-09-29 STORY 17.4 EXECUTED (orchestrator-run quartet; tree
  green by run 36623061743):** the 14.2-mold verification quartet,
  everything at the post-fix head — fidelity ledger
  `verify/fidelity-verification-v1-4-0/ledger.md` 11 rows (token layer →
  reading → feed → /pro/ → community → chrome incl. drawer+AD-12 →
  article → ad-slot recipe → dark → fonts → a11y; honest
  composition/pattern-consistency classifications; 17.2 dark verdicts
  cited not re-proven; scope note = 17.3 docs pages are NOT rows);
  **ad-language audit 0 values** (grep family FFDD2D|FCC521|FAB619|
  06101E over tj-tokens/tj-components/tj-react/docs-src-tj = 0; ads =
  bank tk-promo-card via `--tk-promo-card-*` hooks — FR-21 split;
  docs leg rides zero-hardcoded in CI); **impeccable BOTH trees 297
  files exit 0** (209 bank + 88 ТЖ; probe exit 2 reproduced; deep sweep
  all clean; +scoped re-run exit 0 over the 4 axe-fix files);
  **baseline package ЧАСТЬ v1.4.0** (544 suite PNG +136 ТЖ 0 deleted, 25
  per-component, 1267 unit, 2123 legs; register 14 commits / 204
  PNG-events with forensics; per-epic inventory; ~1h review order; GATE
  NOT EXECUTED — maintainer ratifies). CI chain recorded honestly in
  the spec (3× timeout-cancel → 202beb1 → 36617540273 RED axe ×5 →
  d02a483 → **36623061743 GREEN**). Lens-174 APPROVED + MINOR +
  PATCH-NICE (both folded pre-execution). Next: 17.5 release prep
  (versions ×6 → 1.4.0, CHANGELOG, RELEASE.md §11 Flow-A recipe,
  HANDOFF; TAG = maintainer sanction ONLY).

- **2026-09-30 STORY 17.5 EXECUTED — EPICS-v5 COMPLETE 12/12 (release
  head `d039d2d` GREEN by run 36631204306; bump head `7199619`
  covered):** orchestrator-executed (release files are
  orchestrator-owned). **Versions ×6 → 1.4.0** (bank 1.3.0→, ТЖ
  0.0.0→; OQ-10 join-train; root 0.1.0/docs 0.0.0 outside) + CHANGELOG
  `[1.4.0] - 2026-09-30` (Added ТЖ family + Internal incl. the
  Verification line; inter-window regroup note survived INTO Internal)
  — commit `7199619`, bump BEFORE the recipe that cites it.
  **Gen-clean at execution:** `pnpm gen` post-bump zero drift (CEM
  embeds no package version); version-reader greps empty (no
  story/test reads the fields). **RELEASE.md §11.1–11.7** (§10 mirror):
  honest CI chain by run id, §11.2 = bumps EXECUTED in-story (unlike
  prior windows — §11.7 proof narrows to the TAG ONLY), §11.4 Flow-A
  ТЖ-ALONE at release grade (clone `--branch v1.4.0`, tj-cta both
  themes, NO bank packages in node_modules = FR-17 consumer-side),
  §11.5 = the landed CHANGELOG text verbatim; two pre-close-out
  corrections folded and recorded honestly (§11.5 pointer→verbatim per
  the frozen AC; §11.4 gained --branch + tj-cta acceptance). HANDOFF
  closed: header 2026-09-30, epics-v5 §2 row (12/12; 1267 unit + 2123
  legs; 544+25 PNG; 37 components), **maintainer queue v1.4.0 opened
  (§4, 7 items: batch-confirm ЧАСТЬ v1.4.0 = the ONLY blocking
  predecessor of the tag; then tag §11.3 → Flow-A §11.4 →
  SR-RUNSHEET → Graphik/Charter → 36px FLAG → opportunistic iOS/admin
  carries)**. Gates: build/test **1267**/lint/typecheck EXIT 0; visual
  not re-run (docs-only diff since the 2123/2123 pass on d02a483 —
  served tree bit-identical, the 14.2 precedent). Lesson re-learned:
  writing a CI verdict line before the fact — caught in-story, fixed
  to placeholder, filled only at the fact (the IRON RULE held). **TAG
  v1.4.0 NOT created — maintainer explicit sanction ONLY. epics-v5 is
  DONE; the next window belongs to the maintainer's queue.**

- **2026-09-30 POST-17.5 — TAG v1.4.0 PLACED + Flow-A GATE PASSED (same
  window, by the maintainer's explicit three-part directive «1 confirm
  CI / 2 new tag ok / 3 continue»):** (1) CI validated by API verdicts
  ONLY — all four window heads GREEN (36623061743 `d02a483`,
  36626757077 `63bba27`, 36631204306 `d039d2d`, 36634633196 `6510262`),
  in-flight 0, local==remote; two historical non-greens explained
  (202beb1 RED axe round closed by d02a483; 58d979e timeout-cancel,
  cap now 60). (2) Annotated tag on `6510262`: tag object
  `0e620018f9844d03990f9eb88d0781757a389e7b`, deref verified locally
  AND by `git ls-remote --tags` post-push; tag push does NOT trigger CI
  (workflow: push branches [main] only); batch-confirm was NOT run as a
  separate sitting — the sanction came directly, item stays as a
  retrospective honesty point. (3) Flow-A §11.4 executed at release
  grade: fresh consumer `my-app` links the ТЖ trio @1.4.0 — node_modules
  census EXACTLY `pillkit-tj-{tokens,components,react}`, zero bank
  packages (FR-17 consumer-side); 3 dual-emit legs PASS (auto-light
  `#f0f0f0` / forced-dark `#12151c` / emulated-dark-OS + light-override
  `#f0f0f0` — the `:not([data-tj-theme="light"])` guard holds); 2 CTAs
  per leg incl. the React wrapper `Cta`; console clean; vite build 34
  modules / 4.43 kB token sheet. DEVIATION recorded honestly: clone was
  LOCAL by tag (network bulk transport degraded ~2.5 MB/min; tree
  identity guaranteed by the pushed tag object, remote deref-checked
  BEFORE cloning). Traps re-hit & solved: `pnpm init` (v12) writes a
  caret `devEngines.packageManager` spec that `pnpm add` itself rejects
  (fix by key, JSON-safe — README quick-start note candidate);
  `--prefer-offline` beats hung registry resolution (shared store).
  Proof pack `verify/v140-fresh-clone/` (NOTES.md + 6 PNG). Stamps:
  RELEASE §11.3 «ИСПОЛНЕНО», §11.4 «ГИТ ПРОЙДЕН», §11.7 superseded-in-
  place; HANDOFF header/§2/§4 — queue item (b) CLOSED, (a) de-blocked
  to retrospective; spec 17.5 addendum. **v1.4.0 IS RELEASED (git-tag
  train, `private: true` intact, npm commands never run).**

- **2026-09-30 POST-v1.4.0 QUEUE — (a) batch-confirm CLOSED + (e)
  remeasure/18.1 EXECUTED + (d) brief (same window, directive «давай
  продолжать согласно плана» + «продолжаем разработку»):**
  **(a) РЕТРО-ПРИСЕСТ ДЕЛЕГИРОВАН** (прецедент v1.3.0): fan-out шесть
  групп A–F по порядку v1.4.0-§3 + ImageMagick-пиксели ground truth +
  source/ledger-grounding + montage-композиты. Итог: **136 suite-ТЖ +
  3 per-component — все ✅, 0 флагов, 0 перезаписей** (A 30/30, B 28/28,
  C 18/18 — композер 88px/r20/770px пиксель-пруф, D 22/22, E 13/13,
  F 28/28); банковские касания механически (26×R100 + 2 cookie eyeball
  + монопины 20d3796 + цепочка getting-started 776→821→866 + 4
  контент-ретейка 58d979e + 10 axe-фикс рерайтов d02a483); **2 поправки
  реестра ратифицированы** (20d3796 = 22 ТЖ-события; 67b7fd9 = ТЖ
  getting-started — банковские ретейки легли в 58d979e; арифметика 204
  не меняется). ✅-блок — ЧАСТЬ v1.4.0 baseline-review-package.md.
  Уроки: группа B пала на автокомпакте от полноразмерных PNG — хвост
  перезапущен D/F-молдом «пиксели + ОДИН montage-комозит + ≤2
  full-size vision» (теперь дефолт присестов); vision-API 429
  аккаунт-лимит на пике fan-out — граница записана честно, дозорный
  проход по 4 кандидатам довыполнен. **(e) ПЕРЕМЕР (делегированный,
  стабильные капчи): чипы 40px** (7 × 2 капчи, ноль разброса; 30px
  иконки + 5+5 инфлекции = 40; метод самопроверен — авторские 36
  читались как 36) **/ CTA «Написать» 30px** (98×30 байт-в-байт на обеих
  капчах; probe-notes 16.5 уже знал h30 — авторские 36 были завышением)
  → **spec 18.1 EXECUTED** (нумерация 18.x открыта этим фиксом): css.ts
  ×4 блока + test pin 7px + проза ×4; `--tj-radius-chip: 20px` не тронут
  (уже 40/2); gen-дифф ровно 1 файл (CEM); юнит 247/247, build/lint/
  typecheck EXIT 0; **полный постфиксный прогон 2123/2123 GREEN
  (12.5 мин) — упавшее множество ПУСТО, реминт отменён законом 1.5%**
  (прецедент 5.4-F1: PNG стареет, computed-истина в пинах). CHANGELOG
  [Unreleased] Fixed. **(d)** бриф-меморандум Graphik/Charter
  (`briefs/brief-tj-fonts-graphik-charter-2026-09-30.md`; опции A/B/C;
  решение мейнтейнера, ничего не блокирует). **(f)** avatar-menu/kebab
  open-state БЛОКИРУЕТСЯ на доставке мейнтейнера (ранбук
  `captures-v3/admin/RUNBOOK-followup-captures.md`); **(c)** живой VO —
  мейнтейнер (механизуемая половина закрыта 17.2). Коммиты: присест-запись
  отдельным коммитом + фикс-коммит (18.1 + бриф + CHANGELOG + HANDOFF +
  этот штамп), один push; CI-вердикт головы — по run id ПОСЛЕ факта,
  в память окна (практика 17.5: рекурсивных штамп-коммитов не заводим).

- **2026-09-30 LATE — (18.2) README-freshness GREEN + (18.3)
  pillkit-tj-fonts EXECUTED (queue (d) закрыт живыми рулингами B /
  сплит / XCharter; то же окно, санкция «ok lets fix and continue»):**
  **(18.2)** тег-пин v1.4.0 (README + банковский getting-started, где
  застыл v1.0.0), ловушка devEngines (`pnpm init` v12 пишет caret-спеку),
  тип `--prefer-offline`; пара базлайнов переминтована (явное удаление →
  scoped), полный compare 2123/2123 (12.2 мин). Коммит `827f0c6`, **CI
  36709057024 = success**. **(18.3)** рулинги мейнтейнера (живые ответы):
  модель B (Daytona-молд, отдельный НЕ-MIT шрифтовой пакет) / сплит
  (Charter-идиом бандлим, Graphik слот+рецепт — EULA Commercial Type без
  редистрибуции) / XCharter (кириллица 1144 глифов; оригинал Bitstream
  Charter латинский 228, cmap-проверено). Пакет `packages/tj-fonts`:
  4 woff2 (CTAN xcharter 1.26 OTF → fonttools, без сабсеттинга;
  сессионный конвейер /tmp), fonts.css (+ЗАКОММЕНТИРОВАННЫЙ рецепт
  Graphik), LICENSE-FONTS.md (дословный Bitstream-грант + атрибуция
  Panov/Sharpe + «Graphik не поставляется»), mixed-payload LICENSE,
  README. Слот `--tj-font-reading` ведёт XCharter — правка ТОЛЬКО в
  DESIGN.md → gen:tokens:tj (дифф = 1 строка ×3 артефакта). Тесты:
  инвариант тройки нетронут + carrier-describe (7/7); **регистрация
  пакета в ad4-matrix** (гейты поймали: census 7→8 в zero-hardcoded,
  docs += pillkit-tj-fonts в ALLOWED_SPECIFIERS — display-text
  прецедент; тройка структурно НЕ МОЖЕТ импортировать носитель —
  forbiddenGroups выводится из PACKAGE_DIRS; README-пин канонической
  строки синхронно; CANONICAL_DIRECTIONS += tj-fonts). Fix-уроки раунда:
  (1) подсчёт активных @font-face — СНАЧАЛА стрип комментариев (наивный
  регэксп ловит рецептовый блок: 5≠4); (2) визуальный ран БЕЗ
  `pnpm --filter pillkit-docs build` сравнивает против СТЕЙЛ dist
  (поймано до траты 12 минут). Полный compare **2123/2123 (12.7 мин) —
  упавшее множество ПУСТО: оба текстовых дельта-набора (tj-getting-started
  абзац / tj-token-reference--typography +1 слово) суб-1.5%, реминт
  отменён законом** (второй случай подряд после 18.1). Гейты: root
  vitest 200/200 (было 198+2 до регистрации), lint/typecheck EXIT 0,
  check:gen + банковский tokens-drift zero-drift. Коммит `fccfe44` →
  **CI fail за 26 с**: pnpm 12.5.1 QUIRK — локальный install (и
  --lockfile-only) НЕ дописывает пустой importer для
  беззависимостного пакета («Already up to date»), а CIшный
  --frozen-lockfile строго требует `importers["packages/tj-fonts"]` →
  фикс `a485cab`: ручная запись `packages/tj-fonts: {}` (форма
  `packages/tj-tokens: {}`) + локальное frozen-GREEN доказательство.
  **УРОК: новый workspace-пакет ⇒ проверять importers-запись в
  pnpm-lock.yaml ДО пуша (локальный «up to date» лжёт).** **CI
  36715355750 = success** (голова `a485cab`, вердикт по API после
  факта). Спека 18.3 EXECUTED с fix-round секцией; CHANGELOG
  [Unreleased] Added. Очередь мейнтейнера: остались (c) живой VO и (f)
  open-state капчи + iOS momentum-scroll.

- **2026-09-30 LATE-2 — (18.4) DOCS ACTUALIZATION EXECUTED (запрос
  мейнтейнера «саммари + отвалидировать документацию»):** факт-чек
  потребительских поверхностей после 18.3, **10 устареваний** исправлено:
  README (таблица пакетов += pillkit-tj-fonts; питч называет оба семейства
  и оба шрифтовых носителя; семверинг «текущий v1.3.0»→v1.4.0 — ПРОПУСК
  раунда 18.2, который тронул только «Быстрый старт»; секция «Шрифты» +=
  ТЖ-сплит-абзац; «Лицензия» 2→3 категории; «Документация» 27→27+10),
  корневой LICENSE Scope (новый пункт 2 — packages/tj-fonts/fonts под
  Bitstream-условиями, transitions перенумерован в 3), README
  pillkit-tj-tokens (секция «Шрифты» переписана из до-18.3 мира),
  README pillkit-tokens + пример тега v1.4.0), local-fonts README (ТЖ:
  XCharter уже в ките, механизм теперь только под Graphik). HANDOFF.md НЕ
  трогали — исторический снапшот. **Ловушка раунда: zero-fonts-сканер
  читает и .md** — новые формулировки дважды несли литерал `@font-face`
  («ни одного `@font-face`», «`@font-face`-рецепт») и роняли сьют
  199/200; сканер прав по дизайну, текст переформулирован
  («face-объявление»/«face-рецепт»). Урок: в дереве тройки ТЖ литерал
  `@font-face` не пишем даже в прозе.** Гейты: test 200/200 + lint +
  typecheck EXIT 0; стори-тексты не менялись → базлайны не затронуты.
  Коммит `87538af`, **CI 36721958634 = success**.

- **2026-09-30 LATE-3 — (19.1) tk-menu-popover EXECUTED (Epic 19 «admin
  follow-up» открыт; санкция «ok lets continue»; материал = follow-up
  pack (f), 5 PNG captures-v3/admin, ПД-заливки проверены):** атом +
  `tk-menu-item` / `tk-menu-divider` в `src/menu-popover/`; APG-меню
  поверх overlay-контроллера (popover-API primary; happy-dom —
  container-fallback молда select). **Anchor-wiring редизайн по ходу
  раунда: happy-dom НЕ стреляет slotchange при ПЕРВИЧНОЙ раскладке слота**
  — биндинг якоря не кэшируется: pull-resolve `#anchorElement` из
  assignedElements + host-делегирование клика/клавиш (молд tk-tooltip),
  `#pathHitsAnchor` по composedPath; попутный факт: второй
  `slot="anchor"` НЕ замещает первый (проектируются оба, [0] выигрывает).
  Позиционирование: **`alignment: 'start' | 'end'` в
  `computeFloatingPosition`** (прецедент matchAnchorWidth — новая опция,
  не смена контракта; валидация броском + 6 тестов). Событийность §9:
  `open`/`open-change` + `select` (деталь = строка); молчание первого
  рендера — флаг `#hasRenderedOnce` в `updated()` БЕЗУСЛОВНО (old-value
  семантика Lit при апгрейде атрибутов даёт null → ложный выстрел).
  Токены: панель — нейтрали + хуки `--tk-menu-popover-*` (fill/border/
  radius/width/divider), ноль жёлтого; строки 44px поверх замера ≈40±2
  (пол A11y — закон); деструктив = красный текст без заливки; БЕЗ
  `aria-controls` (idref в shadow-дерево, прецедент select/axe).
  Стори: 9 (песочница с логом, открытое меню, варианты, паттерны
  avatar-menu c header-слотом / table-kebab / header-overflow, темизация,
  чек-лист, API); плитка-аватар = identity-пара primary (рулирование:
  плитка — ХРОМ ТРИГГЕРА, «ноль жёлтого» покрывает панель). Fix-раунд
  визуала: (1) axe `button-name` — иконочный кебаб-триггер без имени →
  `aria-label` обеим кнопкам (пикселей не меняет); (2) **Open-стори у
  ЛЕВОГО края клампила 280px панель к viewport и прятала контракт
  flush-правых-краёв** → фигура перенесена вправо (режим кадров консоли),
  базлайны переминчены явно; (3) getting-started--page легитимно вырос на
  ряд индекса (3916→3937px) — реминт явно. Гаранты: hidden-guard 33→37
  (28 листов, список дедуплирован Set — menu-popover даёт 4 листа),
  event-map, CEM + 3 обёртки, sweep VII строка (1 стоп / ≥5 поверхностей,
  measured). Покрытие: unit 29 (suite 200/200) · отфильтрованный visual
  36/36 · регион 2/2 (fixed / z-токен / ниже якоря / flush ≤1px / ≥270px
  пины; top-layer дрейф-защита вне body-capture) · **полный compare
  2182/2182 GREEN (двухпроходный)**. Уроки: `-g "menupopover"` НЕ матчит
  регион-спеку (grep по title — запускать файлом) и ран в `| tail` без
  `pipefail` глотает exit-код. Коммит `9bdd14d` (52 файла), **CI
  36749011384 = success** (вердикт по API после факта). CHANGELOG
  [Unreleased] Added. Спека EXECUTED с таблицей capture→токен и 10
  рулированиями.

- **2026-10-01 — (19.2) RELEASE PREP v1.5.0 EXECUTED (санкция «go» на
  решение «[Unreleased] держит 18.3 + 19.1 → следующий тег = v1.5.0»;
  молд 17.5, деление «prep в-story / тег мейнтейнер» дословно):**
  бамп-коммит `d760e44` — ровно 7 строк версий (банк ×3 + ТЖ ×3 +
  tj-fonts; v1.5.0 = ПЕРВЫЙ тег с бандленными шрифтами) + CHANGELOG
  `[1.5.0] - 2026-10-01` (Added 19.1+18.3 / Fixed 18.1 / Internal) +
  свежий `[Unreleased]`; `pnpm gen` zero-drift, версионных grep-пруфов
  ноль. Docs-коммит `8031691`: RELEASE.md §12 (7 подсекций, зеркало §11:
  цепочка окна ran-id-ами все GREEN, §12.4 Flow-B — свежий банк-потребитель
  рендерит tk-menu-popover + ТЖ-референсы + 4-пакетная install-строка с
  tj-fonts, §12.6 XCharter-в-дереве, §12.7 пруф неисполнения сужен НА
  ТЕГ), HANDOFF (шапка 2026-10-01, строка §2 окна, §4 очередь v1.5.0 =
  тег-санкция единственный блокер + VO + iOS + опциональный
  batch-confirm прироста), пины v1.4.0→v1.5.0 (README ×3 +
  getting-started стори — рендерится → 2 базлайна переминчены ЯВНО).
  Гейты: build/test 200/200/lint/typecheck EXIT 0; **полный compare
  2182/2182 GREEN (pipefail, 12.6 мин)**. **CI 36810098319 на `8031691`
  = success** (покрывает и голову бампа; вердикт по API после факта).
  ТЕГ v1.5.0 НЕ ПОСТАВЛЕН — ждёт явного «tag ok» мейнтейнера (§12.3);
  npm-команд не было. Урок раунда: в драфте Verification спеки едва не
  лёг выдуманный ran-id-заполнитель — правило «вердикт только после
  факта» удержано на ревью самого себя; заполнитель = честная фраза
  «будет записан после существования», НЕ число.

- **2026-10-01 — v1.5.0 RELEASED: «tag ok» → тег → Flow-B НАШЁЛ дефект →
  фикс → тег ПЕРЕМЕЩЁН → раунд-2 PASS → штампы.** Штамп-коммит `9e3c32b`
  (CI 36812781743 success) → по санкции «tag ok» аннотированный тег на
  `9e3c32b` (tag-объект `b828a98c`; теговый пуш CI не триггерит). Flow-B
  §12.4 раунд-1 (свежий потребитель по тегу, банковская тройка,
  tk-menu-popover raw + React) **нашёл продуктовый дефект: в
  React-композициях ряды без role**. Изоляция (/iso.html, dev+prod):
  **ЗАКОН REACT 19 — атрибуты, выставленные в конструкторе кастомного
  элемента, не доносят до закоммиченного узла** (элемент с отработавшим
  ctor ≠ закоммиченный узел). Фикс `c7fe548`: роли/roving-дефолт в
  `connectedCallback` (идемпотентно; перемещение рядов в панель =
  detach→reattach — покрыто юнит-пинами «re-asserts on every
  (re)connect»); gen → 200/200 → lint/typecheck EXIT 0 → docs build →
  **полный compare 2182/2182** (атрибутный фикс пиксельно нейтрален) →
  **CI 36820396725 = success**. Решение мейнтейнера «Перенести на
  c7fe548»: тег ПЕРЕМЕЩЁН по §7 (`git tag -f -a` + force-push; новый
  tag-объект `df4c3c8`, deref `c7fe548`, remote сверен; потребителей у
  часового тега нет; запись в CHANGELOG). Раунд-2 на `c7fe548`:
  **23/23 PASS** (роли обоих меню, Δright 0.00px / зазор 4.00px / ширина
  280px, реальный фокус через `shadowRoot.activeElement`, select +
  open-change c РАЗВЁРНУТЫМ detail.value CONVENTIONS §3, Esc +
  фокус-возврат, dark rgb(26,26,26), консоль 0; ценсус pillkit-*@1.5.0;
  prod 36 модулей). Пробы-уроки: getByRole СЛЕП к hidden-панелям
  (a11y-tree) — закрытые проверки атрибутным локатором;
  `document.activeElement` ретаргетится на host при фокусе в shadow —
  читать `host.shadowRoot.activeElement`. Отклонение записано честно:
  клон ЛОКАЛЬНЫЙ по тегу (транспорт ~2 МБ/мин, прецедент §11.4; remote
  deref сверен ДО клона). Штампы: RELEASE §12.3/§12.4/§12.7 + CHANGELOG
  + HANDOFF; пруфы `verify/v150-fresh-clone/` (probe.mjs, NOTES.md,
  2 PNG). Остаётся мейнтейнерским: живой VO, iOS momentum-scroll.

- **2026-10-01 — очередь v1.5.0-(d) закрыта + Release-страницы (санкция
  «— делаем оба»).** Batch-confirm прироста — ДЕЛЕГИРОВАННЫЙ присест
  D/F-молда (пиксели + ОДИН montage-комозит 9×dark|light + 1 full-size
  vision из ≤2 + source-grounding; НЕ человеческий просмотр — записано
  честно): **24 файла — все ✅, 0 флагов, 0 перезаписей** (18 новых
  story-PNG + 2 регион 280×263 + 2 переминта open-стори + 6 событий
  getting-started: AE 168/388,544/159, высоты 3916→3916→3937→3937 —
  каждый переход объяснён). Единственный vision-флаг (playground light
  «тёмно-синяя панель») ОТКЛОНЁН тройным обоснованием: источник
  (`open: false` — панель невозможна), пиксели (темнейший #343333 =
  глифы), полный кадр (белый канвас, жёлтый триггер, серый `.tkmp-log`
  с «—», меню закрыто). **Урок метода: `-colors N` репортит СРЕДНЕЕ
  бакета, не различимые цвета** — «канвас 94.6% #F5F5F6» было
  артефактом слияния белого с серым (полный кадр: белый); доля =
  count/(w×h), `srgb(%)` — каналы. ✅-блок — ЧАСТЬ v1.5.0; протокол —
  `verify/baseline-review-v150/` (NOTES + montage). Хоускипинг RELEASE
  §6: Release-страницы **v1.4.0** (задним числом — окно v1.4.0 её
  пропустило; заметки дословно из CHANGELOG [1.4.0]) + **v1.5.0**
  (--latest, из [1.5.0]); описание репозитория 27→40 компонентов,
  топики нетронуты; теги не двигались (v1.5.0 на `c7fe548`).
  Остаётся мейнтейнерским: живой VO, iOS momentum-scroll, Graphik-бриф.

- **2026-10-02 — RELEASE PREP v1.6.0 EXECUTED (Рулинг 1 сессии рулингов
  2026-10-02: «v1.6.0 полным циклом 19.2-молда ПЕРВЫМ»; «ok lets
  continue» = санкция старта; молд 19.2/§12 дословно):** бамп-коммит
  `3a9dd51` — ровно 7 строк версий (банк ×3 + ТЖ ×3 + tj-fonts,
  1.5.0 → 1.6.0) + CHANGELOG `[1.6.0] - 2026-10-02` (12 записей Added:
  21.1–21.6 + 22.1–22.6) + свежий пустой `[Unreleased]`; `pnpm gen`
  zero-drift, версионных grep-пруфов ноль. Docs-коммит `b404065`:
  RELEASE.md §13 (7 подсекций, зеркало §12: цепочка окна ran-id-ами все
  GREEN, §13.4 Flow-B — свежий банк-потребитель рендерит
  tk-instrument-hero 22.5 + promo-card ticket 22.6, §13.6 Graphik
  ФИНАЛИЗИРОВАН Рулингом 4, §13.7 пруф неисполнения сужен НА ТЕГ),
  HANDOFF (шапка 2026-10-02, строка §2 invest-волны, §4 Graphik закрыт +
  очередь v1.6.0 = тег + Flow-B + опциональный batch-confirm — очередь
  пустеет до нуля), README пины v1.5.0→v1.6.0 + СЧЁТЧИК 27→37 банк
  (застарел с v1.4.0 — честно пойман этим раундом; 47 всего с ТЖ),
  **Graphik-финализация** (deferred-work финальная запись + local-fonts
  README штамп рулинга; tj-fonts README уже нес финальную формулировку),
  пин getting-started стори — рендерится → 2 базлайна переминчены ЯВНО
  (rm → update; 20.2-урок повторился: `-g` у update-скрипта не
  применился, прогон прошёл всей сюитой 14.5 мин update-режимом —
  перезаписаны ровно 2 отсутствующих, git status подтверждает). Гейты:
  lint/typecheck/build EXIT 0, корневой сьют 200/200; **полный compare
  2386/2386 GREEN (14.4 мин, строгий режим)**. **CI 37047554498 на
  `b404065` = success** (покрывает и голову бампа; вердикт по API после
  факта, zero-in-flight на пуше). ТЕГ v1.6.0 НЕ ПОСТАВЛЕН — ждёт явного
  «tag ok» мейнтейнера (§13.3); npm-команд не было; после тега — Flow-B
  §13.4 (клон по тегу, tk-instrument-hero + ticket).

- **2026-10-02/03 — v1.6.0 RELEASED: «tag ok» → тег → Flow-B ПРОЙДЕН
  раунд-1 без дефектов.** По явной санкции «tag ok» аннотированный тег
  `v1.6.0` поставлен на `a283e3d` (tag-объект `64cbe75c`; remote сверен
  deref ДО клона; теговый пуш CI не триггернул; предусловия: HEAD CI
  GREEN 37050974098, дерево чисто; npm-команд не было; перемещений не
  было). **Flow-B §13.4 (2026-10-03):** свежий клон по тегу (локальный
  file-транспорт, честное отклонение по прецеденту §12.4), census =
  ровно семёрка @1.6.0; потребитель по README-рецепту (devEngines-ловушка
  снята, vite dedupe); прод-билд 638 мс exit 0. **Гейт 15/15 PASS —
  продуктовых дефектов НЕТ (раунд-1 = единственный):** hero-анатомия/
  tone-reflect/metric-блок с slot-presence/slotted-h2 override (AC3)/
  identity-градиент на `:host` (#2e970a→#257a08); ticket label/value/
  note + CTA `.button::before` rgb(255,221,45); React-обёртки — пропсы
  переживают создание элемента (закон v1.5.0-цикла живёт в атомах);
  консоль ноль; dark remap `--tk-color-surface-base` `#fff`→`#1a1a1a`.
  Probe-раунды честно 10→12→14→15: все промежуточные провалы —
  probe-баги (угаданные селекторы; `slot.textContent` слеп к assigned-
  узлам — читать `assignedNodes({flatten:true})`; краска на псевдо-слоях
  `.button::before`/`:host`). **Транспорт-урок: `pnpm add` БЕЗ флага
  висел >100 мин (0.74 CPU-сек, node_modules пуст) — `--prefer-offline`
  поставил за 318 мс; оффлайн-стор — первый ход при медленном реестре.**
  Пруфы `verify/v160-fresh-clone/` (NOTES + probe + consumer-файлы +
  скриншоты ×2 темы); штампы RELEASE §13.3/§13.4/§13.7 + HANDOFF §4(a)
  закрыт. Очередь §4 = только оппортунистический batch-confirm прироста.

- **2026-10-03/04 — EPIC 23 «invest remainder» + EPIC 24 «pattern wave»
  (24a+24b) ИСПОЛНЕНЫ ПОЛНОСТЬЮ, автономные окна; все CI GREEN с
  первого пуша у 23.2/23.3/23.4/24b-feat.** Epic 23 (4 истории, +2
  атома): 23.1 `tk-chart` feat `beb997d` RED 37116472407 (CEM-дрейф
  после svg-фикса) → `6996a2e` 37116770409 / штамп `0a7a74b`
  37118423243 — svg-namespace-урок (вложенный html`` внутри `<svg>`
  красит НИЧЕГО; тег svg`` + пин namespaceURI); 23.2
  `tk-publisher-header` `dd72bb7` 37121875386 / `6ca69f9` 37123841810 —
  4 измеренных invest-badge токена, первый `::slotted(h1..h6)`
  UA-chrome-reset; 23.3 торговый бланк ПАТТЕРН `c170daa` 37126104757 /
  `d4012fc` 37127883084 — AC4 отклонён (₽-суффикс на существующем
  badge-слоте tk-input), auth-gate честно записан; 23.4 сборка
  инструментальной страницы + sticky-сайдбар `35b12be` 37133167464 /
  `331a246` 37135465134 — метод-урок: СВЕТЛЫЙ-DOM слот-контент живёт до
  апгрейда кастомного элемента («в код-ревью ничего не пропало», видят
  только axe и DOM-проба) — 3 тихих дефекта (2 неимпортированных
  элементных модуля + неверное имя свойства) пойманы свипом регистрации.
  Epic 24 (бриф+спеки `1534f83` 37139042754): 24a 7/7 — feat `fde2bc5`
  RED 37142771921 (hidden-guard трипвайр 50→51) → `ad8e93e` 37143064533
  / штамп `977fa40` 37145399846; 24b 8/8 + `tk-breadcrumb` — спеки
  `45204ab` 37147844261, feat `9c936ef` 37182715344 GREEN с первого
  пуша / штамп `6d82cc7` 37184666709. Паттерн-находки волны: тоны
  tk-badge positive/negative НЕ держат axe AA ни на одном тинте
  feature-card → readout-чип на surface-base внутри карточки (24.12);
  litRender в SB-заполненный хост НЕ вычищает узлы → хост монтируется
  пустым + DriveFirstPaint-директива (24.13); неконтролируемый tk-input:
  значение в value-change.detail, host.value undefined (24.15);
  `&#8201;` парсится zero-hardcoded-сканером как hex #8201 → только
  NBSP-эскейпы (24.15); CD-кэш зрения: повторная загрузка PNG в
  vision-CDN отдаёт СТАРЫЕ байты — верифицировать локальным compare
  (24.6). Сюита 2386 → **2572** (+186). Спеки `spec-23-*`/`spec-24-*` с
  Execution records; терминальный чек-лист капчур — `captures-v5/
  TERMINAL-CAPTURE-CHECKLIST.md` (24T заблокирован на материале).

- **2026-10-04 — RELEASE PREP v1.7.0 EXECUTED (Решение 3 рулингового
  окна Epic 24: «3 - после 24 эпика» — эпик закрыт, санкция настала;
  автономная санкция «чекай регулярно и продолжай согласно плана»;
  молд 19.2/§13 дословно):** бамп-коммит `f4fd618` — ровно 7 строк
  версий (банк ×3 + ТЖ ×3 + tj-fonts, 1.6.0 → 1.7.0) + CHANGELOG
  `[1.7.0] - 2026-10-04` (19 записей Added: 23.1–23.4 + 24.1–24.15) +
  свежий пустой `[Unreleased]`; `pnpm gen` zero-drift. Docs-коммит
  `3427475`: RELEASE.md §14.1–14.7 (цепочка ran-id окон 23/24
  перепроверена `gh run list`; §14.4 Flow-B план = chart+breadcrumb+
  figure raw+React; §14.7 пруф неисполнения сужен НА ТЕГ), HANDOFF
  (шапка 2026-10-04, строка §2 Epic 23+24, очередь §4 v1.7.0 = тег по
  «tag ok» + Flow-B §14.4 + опц. batch-confirm + 24T по капчурам),
  README пины v1.6.0→v1.7.0 + СЧЁТЧИК 37→41 банк — **СВЕРЕН
  КАТАЛОГАМИ: `src/*` = 42 каталога − overlays = 41; «39-й атом» из
  close-out 24b был АРИФМЕТИЧЕСКОЙ ОШИБКОЙ (не посчитаны chart +
  publisher-header Эпика 23) — поймано этим счётчиковым свипом ДО
  коммита, README/память исправлены**; 51 всего с ТЖ; застарелое
  description «19 tk-*» (v1.0.0-эра) в package.json → 41. Пин тега в
  getting-started стори → 2 базлайна переминчены ЯВНО (rm → update;
  прямой `pnpm exec playwright test -g` на этот раз СКОПИРОВАН — 8 ног,
  git status = ровно 2 PNG; 20.2-ловушка жила в pnpm-скрипт-обёртке
  `test:visual:update`, не в -g). Гейты: build/test/lint/typecheck
  EXIT 0 (корневой 200/200); **полный compare 2572/2572 GREEN
  (15.7 мин, строгий)**. **CI 37187571150 на `3427475` = success**
  (покрывает и голову бампа `f4fd618`; вердикт по API после факта,
  zero-in-flight на пуше). ТЕГ v1.7.0 НЕ ПОСТАВЛЕН — ждёт явного
  «tag ok» мейнтейнера (§14.3); npm-команд не было; после тега — Flow-B
  §14.4.

- **2026-10-04 — v1.7.0 RELEASE COMPLETED («tag ok» + Flow-B + штампы;
  то же окно, что и prep):** мейнтейнер вернулся («im here lets
  continue» → «ok ask any questions and lets continue»), AskUserQuestion
  ×4 — все четыре решения получены явным выбором: (1) **«tag ok»** на
  постановку тега, (2) batch-confirm прироста — «Да, прогони присест»,
  (3) 24T — «Сниму, чек-лист в силе» (капчуры — сторона мейнтейнера),
  (4) направление после v1.7.0 — **НОВЫЙ РЕКОН** (домен будет назван
  отдельно). ТЕГ: предусловия сверены (HEAD `89a20da` CI GREEN
  37190043724, дерево чисто, zero-in-flight) → аннотированный `v1.7.0`
  на `89a20da`, tag-объект `ce427667f78edff7a35941064c52b945afc6351c`,
  remote deref сверен ДО клона, теговый пуш CI не триггернул.
  **Flow-B §14.4 РАУНД-1 = 26/26 PASS, дефектов НЕТ** (первый релиз без
  второго раунда с v1.6.0): клон file-транспорт по тегу
  (`CLONED_AT=89a20da` exact-match), install `--prefer-offline` 1.3 с /
  build 7.5 с, census = ровно тройка @1.7.0 (семёрка в клоне), прод-билд
  vite 335 мс (чанк 585 кБ). tk-chart: aria-label
  «График, 5 точек, последнее значение 20 235 500,5» (NBSP+RU-запятая),
  bond-стопы computed rgb(0,158,77)/rgb(0,129,62) = #009E4D/#00813E
  байт-в-байт, Y-ось «20,4 млн…», badge, quiet grid, reference;
  tk-breadcrumb nav>ol>li + терминал aria-current="page";
  tk-figure lazy-энфорсмент + аспект 1.778; React-обёртки — пропсы
  переживают создание; dark #1a1a1a; консоль 0; пиксельный паспорт
  (bond-интерьер #009548, stock-семейство #298809). Пруфы —
  `verify/v170-fresh-clone/` (NOTES + probe + 2 скриншота). Probe-уроки:
  **(1) `createRoot().render()` конкурентен — raw-присваивания данных на
  дне модуля исполняются ДО коммита React-дерева (getElementById=null,
  модуль умирает) → rAF-поллинг готовности; (2) `const URL = argv`
  затеняет глобал → «URL is not a constructor» в ESM; (3) custom
  property сериализуется hex (#1a1a1a), не rgb() — проба обязана
  принимать обе формы; (4) докстринговая опечатка bond-стопа в
  chart.ts/chart.css.ts («0,128,62» при каноне #00813E=(0,129,62)) —
  краска токен-точна, вычищается микро-коммитом `docs(components)` того
  же окна (своя запись).** Штампы: RELEASE §14.3 ИСПОЛНЕНО / §14.4 ГИТ
  ПРОЙДЕН / §14.7 сверх точки; HANDOFF шапка+§2+§4 (очередь v1.7.0:
  (a)(b) закрыты, (c) batch-confirm санкционирован и исполняется тем же
  окном — закрывается своей записью, (d) 24T подтверждён планом, (e)
  новый рекон).

## Epic 25 — kit-ecosystem recon (2026-10-04/05, 4/4 stories, все CI GREEN)

Домен назван мейнтейнером («нас интересуют именно библиотеки»); рулинги
Q&A: ростер Taiga-якорь + 6–10 эталонов; фокус все три класса данных;
носитель снапшоты в репо (НЕ CI-cron); внедрение BMAD-спека-история.

- **25.1 machine-harvest** — feat `10639cc` CI 37214077995; штамп
  `fb3875a` CI 37216602275. `recon/` ESM-конвейер (http/registry/
  tarball/extract/snapshot/capability; весь HTTP на curl-транспорте —
  node-undici падает ConnectTimeout на registry при живом curl);
  dogfood self 45/45 CEM; taiga 5.26.0 cem=false честно, 93
  dtsComponents (path-эвристика); capability-матрица: CEM публикуют
  только shoelace и self; roster frozen; eslint ignore `recon/.cache`.
- **25.2 roster-run** — feat `29994ae` CI 37219706642; штамп `2026215`
  CI 37222271943. `--all` 11/11; downloads point всем + 180d series
  якорю; gh api stars/releases/contributors (кап 100+ честно); 11
  отчётов + SUMMARY (сходимость юнитом); JSONL force =
  replace-in-place + коллапс дублей. radix 60.9M dl/30d; shoelace
  534K при 0 релизов 12+ мес; shadcn 125k звёзд repo-only.
- **25.3 visual-galleries** — feat `9a1011a` CI 37227729767; штамп
  `70a0797` CI 37230073338. `recon/visual.mjs` (PLAN.md yaml-fence →
  Playwright; dark = emulateMedia + люминация-верификация непрозрачных
  фонов ≤0.5, чужой кит не перекрашиваем) + `recon/composite.mjs`
  (Node-execFile IMv7). 51 PNG/10 китов (self исключён — своя сюита
  и есть референс); дарки настоящие у 7, light-only carbon/mantine/
  spectrum честно; 2 ложных дара пойманы паспортами (identical
  mean/std) и rm явно; баг `rgba(0,0,0,0)`→«чёрный» исправлен
  alpha-aware парсингом + тест; vision 10 чтений (1/кит, бюджет
  чист). Нарушения в NOTES.md честно: `--only`-перезапуски
  переминтовали 12 PNG без явного rm; journal per-run.
- **25.4 synthesis (закрыл эпик)** — feat `c93b5ea` CI **37232913092**;
  штамп — этот коммит. `BENCHMARK.md`: 48 категорий номенклатуры
  (инвентари из тех же кэш-тарболов + 2 vision-чтения shadcn/polaris),
  CEM-глубина machine (shoelace 6.2/1.9/1.8 vs self 3.3/0.4/1.6),
  токен-архитектуры, активность, визуальные регистры; 15 находок:
  **adopt ×5 (slider, switch, spinner, textarea, avatar — «form-control
  completeness wave» = корм следующего брифа)**, watch ×7, skip-by-laws
  ×2 (icons рулинг 23.2; shadcn registry vs npm-never), chart in-kit =
  дифференциатор беречь. Идемпотентность перепроверена (`--kit
  shoelace` → skipped, нулевой дифф). Ноль правок продукт-кода.

Датасет эпика: `_bmad-output/planning-artifacts/kit-recon-2026-10/`
(11 снапшотов JSONL + 11 отчётов + SUMMARY + BENCHMARK) +
`.playwright-cli/verify/kit-recon/` (~85 МБ). Новых историй без
брифа мейнтейнера не открывать; 24T ждёт терминальных капчур.

## Epic 26 — form-control completeness wave (brief 2026-10-05, adopt-находки 25.4)

Спеки 26.1 slider / 26.2 switch / 26.3 avatar / 26.4 OTP = `d8eb5b0` CI 37268604391;
spinner/textarea HOLD под 24T-капчуры.

- **26.1 tk-range-slider** — feat `e02825f` CI RED (api-стори рендерит
  таблицу из CEM — послекоммитная регенерация ariaLabel выросила её на
  строку; локальный compare слепой: аменд манифеста ПОСЛЕ прогона) →
  fix `3f92922` CI **37283157635 GREEN**; штамп `a194695` → docs-head CI
  **37287220117 GREEN** (вердикт-строка в спеке — следующим штампом
  волны, молд 11.1). Заземление iis.png ОПРОВЕРГНУТО на исполнении →
  рулинг «китовые регистры + HOLD→24T»: трек = молд progress-bar 4px,
  ручка = китовый круг 20px. Атом: strict §4 number-канал, step-grid
  display-clamp (prop не мутируется), PageUp/PageDown гвард,
  valueFormatter → readout/aria-valuetext; axe-раунд закрыт ОДНИМ
  фиксом — aria-labelledby-цепочка на header (имя + inactive-components
  contrast exemption). Suite 2572→2602; hidden-guard 53/42; React
  Slider 47-й. **Урок волны: любое изменение CEM-манифеста ⇒ docs
  rebuild + реминт api-стори + compare.**
- **26.2 tk-switch** — feat `04f19c4` CI **37297112761 GREEN** с
  первого пуша; штамп — этим коммитом. AC2-гейт: пиксельная проба
  admin-main-fullpage (1 vision-навигация + ASCII-карты) — «Запомнить»
  = chip-кнопка 78×18 (#F3F4F7, кольцевой глиф + текст внутри, ряд
  фильтр-чипов), НЕ тумблер/чекбокс; бизнес-hero — сегмент-контрол;
  обе ветки спеки мертвы → рулинг мейнтейнера «китовые регистры +
  HOLD→24T» (тумблерные поверхности → 24T-чеклист, пункт 4). Атом:
  нативный checkbox + role="switch" (aria-checked имплицитен — руками
  не выставляется), Enter-кейдаун-гвард (нативный пробел),
  ElementInternals form-зеркало, strict §4 boolean-канал
  (checkbox-зеркало). Капсула 36×20 (yellow-100/border-default, ручка
  16 surface-base), путь ручки w−h (хуки геометрически консистентны),
  reduced-motion гард, hit-area 44. Хуки
  `--tk-switch-{width,height,knob,track-on,track-off}`. React Switch
  48-й; hidden-guard 54/43; suite 2602→**2635** (+33 = 5 стори × 2
  темы × [visual+axe+reduced-motion] + 3 функциональных), нулевой дрейф
  существующих базлайнов. Мой functional Enter-тест упал на
  тест-трассировке (стори стартует default-checked) — фикс чтением
  живого состояния, scoped 3/3, прод не тронут.
