---
title: 'Story 2.0 — Reference capture pack for all remaining components'
type: 'feature'
created: '2026-09-22'
status: 'done'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'auto'
lenses_ran: [quick]
review_loop_iteration: 0
baseline_commit: 'e232007364857a80e4866c8b34cb6d84c6d55e9c'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Every Epic 2/3 component's fidelity gate needs a tbank.ru reference capture as its side-by-side input — only the homepage full capture exists today (hero CTA region used at 1.7).

**Approach:** Take one playwright-cli hi-res capture session over tbank.ru covering all 15 remaining reference-grounded components, write an index note mapping each capture to its component, and record vision-measured hex/radius observations into a working note for the baseline side-by-sides (Story 2.0 ACs).

## Boundaries & Constraints

**Always:**
- playwright-cli with `PLAYWRIGHT_CLI_SESSION=tinkoff-ui` (profile already holds tbank.ru); `screenshot --hires` for full fidelity.
- Coverage (from epics.md Story 2.0): application-form fields (Input) — the «Заявка на карту» form or equivalent; the «повышенный кэшбэк» select-like field (Select); consent line with checkbox (Checkbox); Да/Нет pill control (SegmentedRadio); card-design selector tiles (ThumbnailPicker); «Уже заполнено N%» progress strip (ProgressBar); debit/credit/deposit switcher (Tabs — likely on /cards or the deposits section); site header desktop AND mobile viewport (Navbar); site footer (Footer); 3-up product card grid (PromoCard); Платинум/Т-Ж large banners (FeatureCard); services grid (ServiceCard); «Актуально сейчас» items (ArticleCard); article «Читать» links (TextLink); «+30%»-style incentive badges (Badge/Chip). Some live on the homepage at various scroll depths; form fields/select/consent/citizenship/card-design/progress live where the application form renders (find it — the CTA «Оформить карту» leads there; if the form requires interaction to appear, capture the state).
- Captures land under `.playwright-cli/captures/` (new dir; gitignore-whitelist the DIRECTORY once like the verify/ precedent) with kebab-case names matching the component (e.g. `input-application-form.png`, `tabs-switcher.png`, `navbar-mobile.png`); write `.playwright-cli/captures/INDEX.md` mapping file → component → where on the page it was taken + the URL.
- Mint/beige tint surfaces: capture at native zoom (the homepage product grid tints) for the Story 3.6 assumption check — crop the two tint regions as separate files (`tint-mint.png`, `tint-beige.png`) with the source noted.
- Vision analysis: run zai-mcp-server `analyze_image` on each capture (the harness is text-only for images) extracting measured observations — hex fills/text where stable, radii estimates, control heights — and record into `_bmad-output/planning-artifacts/ux-designs/ux-tinkoff-ui-kit-2026-09-21/.working/captures-2026-09-22.md` (one section per component, terse table form).
- Sessions: close the browser at the end (`playwright-cli close-all`); do not leave servers running.

**Never:**
- No code/package changes (this story produces captures + notes only; the gitignore whitelist line is the single repo-config change).
- No DESIGN.md/EXPERIENCE.md edits (observations land in .working/; value corrections happen at 3.6/5.6 per the assumption-resolution protocol).
- No login/auth flows, no personal data in captures (if a form prefills anything, use dummy interactions only), nothing submitted — capture-only discipline.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Element not on homepage | e.g. Tabs switcher | navigate to the section/page where it renders (cards/deposits); record the URL in INDEX.md | if truly absent → note the gap in INDEX.md, skip |
| Form behind interaction | application form | open via the hero CTA; capture the visible form state | if it requires personal data to proceed, capture the empty initial state and note the limitation |
| Vision ambiguity | hex/radius estimates | record with ± ranges, flag uncertain values | never overwrite DESIGN.md values |

</frozen-after-approval>

## Code Map

- `.playwright-cli/tbank-home-full.png` -- the existing homepage capture (1280×9221) — some components may be croppable from it instead of re-navigation; prefer fresh targeted captures for forms (interaction states), crops for static sections
- `.playwright-cli/verify/` -- the whitelisted evidence dir precedent (gitignore pattern to mirror for captures/)
- `CLAUDE.md` -- playwright-cli-only policy + session env var
- `_bmad-output/planning-artifacts/ux-designs/ux-tinkoff-ui-kit-2026-09-21/.working/` -- existing working-notes dir (tokens-extract note lives there)

## Tasks & Acceptance

**Execution:**
- [x] `.playwright-cli/captures/` + gitignore whitelist -- the dir
- [x] capture session -- 15 component captures + navbar mobile + 2 tint crops (navigate/crop as needed per Coverage)
- [x] `.playwright-cli/captures/INDEX.md` -- file → component → URL/section map + any gaps noted
- [x] `.working/captures-2026-09-22.md` -- vision-measured observations per component (hex/radii/heights, ± ranges)
- [x] teardown -- browser closed, no stray processes

**Acceptance Criteria:**
- Given the captures dir, when Epic 2/3 stories need a side-by-side, then every reference-grounded component has a capture (or a documented gap in INDEX.md naming what was tried).
- Given the mint/beige crops, when Story 3.6 runs, then native-zoom tint evidence exists for the [ASSUMPTION] check.
- Given the observations note, when baselines are created, then measured values are recorded with provenance (capture file + method).

## Implementation Notes

- Approved autonomously (standing delegation per session pattern). Route: full (multi-step browser + vision work).
- Use `find` (snapshot search) on huge pages instead of full `snapshot` where possible (CLAUDE.md guidance); screenshots `--hires`.

## Spec Change Log

## Review Triage Log

Pass 1 (quick lens): low — INDEX.md declared «Gaps: None» while the observations note flagged the checkbox checked-state gap (dangling pointer) → patched: gap recorded in INDEX.md with the 2.4 capture plan. Everything else verified clean (21/21 dimension-checked, whitelist-only config change, teardown confirmed, vision spot-checks corroborate the note).

## Design Notes

Crops from tbank-home-full.png are acceptable for STATIC homepage sections (footer, banners, grids) — identical pixels to a fresh visit and cheaper; fresh captures for anything interaction-dependent (form states, open selects) and for mobile viewport (different layout).

## Verification

**Commands:**
- `ls .playwright-cli/captures/*.png | wc -l` -- expected: ≥ 17 (15 components + mobile header + 2 tints, minus documented gaps)
- `git check-ignore .playwright-cli/captures/input-application-form.png || echo TRACKED` -- expected: TRACKED (dir whitelisted)
- `grep -c '^## ' .working/captures-2026-09-22.md` -- expected: ≥ 15 (one section per component)
