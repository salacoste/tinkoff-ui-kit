---
title: 'Story 15.3 — ТЖ fonts: OQ-8 closure (deterministic pins + local-fonts path + zero-fonts invariant)'
type: 'feature'
created: '2026-09-28'
status: 'approved'
baseline_commit: '61442c0'
review: 'quick'
review_source: 'qr-lens-15-3'
lenses_ran: ['qr-lens-15-3']
review_loop_iteration: 1
context:
  - '{project-root}/_bmad-output/planning-artifacts/epics-v5.md (Story 15.3)'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-tj-kit-2026-09-28/DESIGN.md (typography block — the stacks are FROZEN, this story ships the policy around them)'
  - '{project-root}/tests/visual/inject.ts + tests/visual/fonts.css + tests/visual/serve.mjs (the bank font-pin mold to extend)'
  - '{project-root}/packages/docs/src/local-fonts/ (README.md + local-fonts.example.css — the mechanism to extend)'
  - '{project-root}/CLAUDE.md (STORY 15.2 EXECUTED stamp — the layer this builds on)'
---

<frozen-after-approval reason="planning-sanctioned intent (maintainer «ok lets continue» 2026-09-28 + overnight autonomous delegation «ты оркестрируй… принимаешь конечные результаты»; epics-v5 story 15.3; OQ-8 already RULED in epics — stacks-first ships, no licenses delivered) — do not modify unless renegotiated">

## Intent

**Problem:** The ТЖ token layer carries the two-family font contract as STACKS
(`--tj-font-ui`: Graphik-first; `--tj-font-reading`: Charter-first — generated at
15.2), but nothing makes ТЖ docs renders deterministic: the visual harness pins only
the bank `--tk-font-*` slots, so a future `tj-*` story consuming `--tj-font-reading`
rasters Charter→PT Serif→Georgia→generic-serif depending on the machine, and the
docs local-fonts mechanism (the licensed self-host path) documents only bank
families.

**Approach:** Close OQ-8 on the ruled path — the maintainer has NOT delivered
Graphik/Charter licenses, so NOTHING is bundled (the Daytona mold stays a documented
conditional flip). Ship the policy around the frozen stacks: (1) harness determinism
— pin both `--tj-*` font slots to locally-served open faces (Inter for ui — already
served; PT Serif for reading — new `@fontsource/pt-serif` mount), asserted via
`fonts.check` exactly like the bank mold; (2) the local-fonts mechanism extended with
the ТЖ families (mode A canonical auto-pickup / mode B aliases + slot overrides);
(3) a ZERO-FONTS invariant test pinning that `packages/tj-tokens` ships no font
bytes, so a future Daytona-style bundling flip is a deliberate licensed act, never an
accident; (4) honest docs (tj-tokens README fonts section + the docs stub bullet).

## Boundaries & Constraints

**Always:**
- Harness pin extension follows the EXISTING mold byte-for-byte in shape:
  `tests/visual/fonts.css` gains `--tj-font-ui` (pinned to the locally-served Inter)
  and `--tj-font-reading` (pinned to the locally-served PT Serif) declarations AFTER
  the existing `--tk-*` rules — the bank declarations are NOT touched (their section
  of the file stays byte-identical); `tests/visual/inject.ts` gains PT Serif weights
  to the asserted-face set (Inter 400/500/700 already asserted); `tests/visual/
  serve.mjs` mounts `@fontsource/pt-serif` at `/pt-serif` mirroring `/inter`.
- Root devDep `@fontsource/pt-serif` (OFL-1.1; MUST ship cyrillic subsets — verify
  the package's unicode-range files cover Cyrillic; PT Serif's cyrillic is a
  first-class subset. Pin the same version style as `@fontsource/inter` 5.3.0).
  pnpm only; lockfile updated via pnpm install.
- The pin targets SERVED OPEN FACES, not the licensed names — a machine with a
  locally installed Graphik/Charter must still raster the pinned face in captures
  (determinism regardless of local installs — the bank mold's own rationale).
- Local-fonts extension: `packages/docs/src/local-fonts/local-fonts.example.css`
  gains the ТЖ mode A block (canonical `Graphik` / `Charter` @font-face stubs —
  tokens pick up by name, zero token edits) and mode B block (aliases + explicit
  `--tj-font-ui`/`--tj-font-reading` overrides at file end); `README.md` gains the
  ТЖ section: RU prose, honest license pointers (Graphik — Commercial Type,
  commercial license; Charter — Matthew Carter's Charter has free web-licensed
  distributions, e.g. the GNU GPL + font-exception releases — name the source,
  don't overclaim), the Daytona conditional-flip note, and the OQ-8 ruling summary.
- ZERO-FONTS invariant: a root test (new `tests/tj-fonts-policy.test.ts`) asserts
  (a) no `@font-face` and no font byte exists anywhere under `packages/tj-tokens/`
  (scan artifacts + sources), (b) the generated font slots carry the EXACT frozen
  stacks (Graphik first / Charter first / Inter / PT Serif present — string pins
  against the generated tokens.css), (c) `fonts.css` pins BOTH `--tj-*` slots
  (the determinism contract is mechanically present), (d) inject.ts asserts PT
  Serif faces (grep-level pin is fine — the live check runs in the harness).
- Docs: `packages/tj-tokens/README.md` gains a RU «Шрифты» section (стеки с
  лицензионными именами первыми → автоподхват у лицензированных потребителей;
  честные фолбэки Inter/PT Serif; файлы НЕ дистрибутируются — OQ-8); the docs stub
  `packages/docs/src/tj/getting-started.stories.ts` 15.3 bullet flips to исполнено
  (пины + local-fonts путь) — prose only, no new stories (17.3 owns the reference
  page).
- Gates: `pnpm install` (new dep) → `pnpm test` → `pnpm lint` → `pnpm typecheck` →
  `pnpm build`. NO local `test:visual` (orchestrator owns any baseline question;
  expected ZERO visual drift — the stub consumes no `--tj-font-*` slot, and CI
  compare proves it).

**Never:**
- No font FILES land in any `packages/` directory (devDeps + mounts only);
  `packages/tokens/fonts/` + `LICENSE-FONTS.md` untouched; no Daytona-style
  bundling (no licenses delivered — the conditional flip needs the maintainer's
  license files + LICENSE-FONTS entry as ONE deliberate act).
- No stack VALUE churn: the `--tj-font-ui`/`--tj-font-reading` stack strings in
  DESIGN.md/tokens.css are frozen from 15.2; this story ships policy AROUND them.
  If a stack feels wrong → stop and report, never edit.
- No `--tk-*` behavior change: fonts.css bank section byte-identical; inject.ts
  bank weight arrays untouched; serve.mjs `/daytona` + `/inter` mounts untouched.
- No `_bmad-output/` edits (read-only for the executor); no `.playwright-cli/
  captures-v3/` changes; no npm/publish/version changes; no CI workflow edit
  (the dep is install-time only; fonts.css is a test asset — both ride existing
  legs).
- No test:visual locally, in any mode.

## I/O & Edge-Cycle Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| ТЖ story consumes --tj-font-reading | harness run | PT Serif 400/700 raster from /pt-serif; fonts.check asserts the faces | check() false → loud failure naming the family/weight |
| Machine has licensed Graphik installed | harness run | capture STILL rasters pinned Inter (slot overridden post-load) | n/a — determinism by construction |
| Licensed consumer drops Graphik/Charter woff2 | local-fonts mode A | docs ТЖ renders pickup, zero token edits | gitignored path — documented, not tested |
| Alias-named licensed fonts | local-fonts mode B | slot overrides re-point --tj-font-* at the aliases | template comment walks it |
| Accidental font byte in tj-tokens | any | zero-fonts test RED naming the file | Test pins the invariant |
| Stack drift in a future gen run | tokens.css edit | policy test RED pinning the exact frozen strings | Test names the slot |
| Existing baselines | pin lands | ZERO drift (stub consumes no --tj-font-*) | CI compare proves; no re-take |

## Code Map

- `tests/visual/fonts.css` — append --tj-* pin section (bank section untouched)
- `tests/visual/inject.ts` — PT Serif weights join the asserted set
- `tests/visual/serve.mjs` — /pt-serif mount
- `package.json` + `pnpm-lock.yaml` — @fontsource/pt-serif root devDep
- `tests/tj-fonts-policy.test.ts` — NEW: zero-fonts + frozen-stack + pin-presence
- `packages/docs/src/local-fonts/{README.md,local-fonts.example.css}` — ТЖ blocks
- `packages/tj-tokens/README.md` — «Шрифты» section
- `packages/docs/src/tj/getting-started.stories.ts` — 15.3 bullet flip

## Tasks & Acceptance

**Execution:**
- [ ] devDep + mounts + fonts.css pin section + inject assertions (the mold,
      extended)
- [ ] tests/tj-fonts-policy.test.ts (four legs: no-font-bytes, frozen stacks,
      fonts.css pins, inject asserts)
- [ ] local-fonts ТЖ blocks + README section (honest license pointers)
- [ ] tj-tokens README fonts section + docs stub bullet flip
- [ ] Full gates ×7 packages (install → test → lint → typecheck → build); NO
      test:visual locally

**Acceptance Criteria:**
- Given the harness, when a page consumes a `--tj-font-*` slot, then the rendered
  face is the locally-served open pin (Inter / PT Serif), asserted loaded — on any
  machine, licensed fonts installed or not.
- Given `packages/tj-tokens`, when the zero-fonts test runs, then no @font-face and
  no font bytes exist anywhere in the package, and the slot stacks equal the frozen
  15.2 strings.
- Given the bank harness section, when the diff is reviewed, then the `--tk-*`
  declarations/mounts/weight arrays are byte-identical (the extension is purely
  additive).
- Given the story diff, when reviewed, then no font file, no LICENSE-FONTS change,
  no stack value change exists anywhere.

## Design Notes

The pin override lands in `fonts.css` which `inject.ts` injects AFTER page load —
last in the cascade — so it wins over the token sheet without touching it (the same
mechanism the bank used to move Inter→DaytonaSans without token edits). PT Serif is
the reading-register pin because it is the stack's own named open fallback (raster
class matches the licensed intent closer than Georgia); Inter for ui is already
served and asserted. The zero-fonts test is the OQ-8 mechanization: the Daytona flip
requires license files + LICENSE-FONTS.md + the invariant test update as one reviewable
act — it cannot happen silently.

## Verification

**Commands:**
- `pnpm install && pnpm test && pnpm lint && pnpm typecheck && pnpm build`
- `git diff --exit-code -- packages/tokens` (bank untouched — trivially true but run it)
- `git diff -- tests/visual/fonts.css` reviewed: bank section untouched, --tj-*
  section appended
</frozen-after-approval>

## Implementation Notes

- **All four spec tasks landed as specified; zero patch-round fixes needed**
  (lens verdict SHIP, 0 MAJOR/MINOR — first story with an empty patch round).
- Harness extension purely additive: fonts.css +69/-0 (bank section
  byte-identical), inject.ts −1 = destructure signature only, serve.mjs −1 =
  banner line only. PT Serif 400/700 latin+cyrillic served at /pt-serif;
  both `--tj-font-*` slots pinned to served open faces on `:root` +
  both `[data-tj-theme]` variants (specificity lens-verified: token sheet
  declares slots only at (0,1,0); dark blocks (0,2,0) re-declare colors
  only — pin wins in all three theme states).
- `@fontsource/pt-serif` 5.3.0 exact-pin devDep; OFL-1.1 with all four
  referenced woff2 present on disk (lens verified node_modules).
- Policy test ×4 legs all non-tautological (lens mutation-checked); frozen
  stacks pinned byte-exact.
- Executor deviation UPHELD: out-of-scope correction of the stale 15.1
  scaffold-status paragraph in tj-tokens README (15.2 never updated it — a
  genuine 15.2 doc miss caught here; lens recounted 96/11 from the artifacts
  and confirmed accuracy).
- Baseline shift handled in-commit (executor flag 1): 2 tj PNGs re-taken in
  the SAME commit as the prose flip — full update sweep 1444 passed, other
  baselines byte-stable; one CI run instead of the 15.2 red-then-fix dance.
- Gates (orchestrator, sequential): test root 16 files/179 + all packages,
  lint 0, typecheck 0, build 8/8. One transient root-test failure earlier
  was a race with the background docs build (dist read mid-rebuild) — green
  on immediate re-run; commit-time gates ran strictly sequentially.

## Spec Change Log

## Review Triage Log

**qr-lens-15-3 (quick review, iteration 1): verdict SHIP — 0 MAJOR, 0 MINOR,
3 NIT, no false claims.** Lens independently re-ran the full gate chain and
verified the package on disk (license field, woff2 files), the specificity
math, and zero font bytes under packages/ (grep + find). Notable lens work:
an adversarial subset-shadowing hunt (latin+cyrillic same-family faces
without unicode-range) refuted EMPIRICALLY with an ephemeral headless
Chromium probe (per-glyph advance widths match the respective files) —
no harness baselines touched, probe deleted.

| Finding | Severity | Disposition |
|---|---|---|
| Two constant-vs-constant assertions in tj-fonts-policy.test.ts:88-89 (dead, self-labeled failure-reader docs) | NIT | Accepted as-is — harmless; converting to comments is churn without risk change. |
| Leg 2 pins src/tokens.css but not the minified dist/index.css | NIT | Accepted as-is — spec-compliant ("against the generated tokens.css"); dist is a faithful minify. Hardening candidate for the 17.x packaging story. |
| Font-byte detection is extension-based (renamed file evades) | NIT | Accepted as-is — the accidental-bundling threat model preserves extensions; a deliberate smuggle is out of scope for this guard. |

Executor flags: (1) baseline shift from the bullet flip — RESOLVED by the
in-commit re-take (see Implementation Notes); (2) README status correction —
UPHELD (see above).
