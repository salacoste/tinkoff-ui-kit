# Reconciliation: CLAUDE.md toolchain contracts vs PRD

- **Input (contract source):** `/Users/r2d2/Documents/Code_Projects/ui-kits/tinkoff-ui/CLAUDE.md`
- **Target (reconciled doc):** `prd.md` (this directory) — NOT modified; gaps below are extract-only
- **Date:** 2026-09-21
- **Method:** clause-by-clause comparison of CLAUDE.md toolchain/convention sections (Toolchain, Design reference workflow, Conventions) against PRD FRs, glossary, non-goals, and open questions.

## Gaps (numbered, ordered by materiality)

1. **inspo MCP design-reference toolchain dropped entirely.**
   CLAUDE.md: "inspo MCP — real-site design references … **Use before writing UI: `recommend(brief)`**", and design workflow step 1: "Analyze the reference site (tinkoff.ru) — **inspo MCP `recommend()` + direct inspection** for tokens."
   PRD grounds all design extraction in a single direct capture (§0 Reference note: `.playwright-cli/tbank-home-full.png`; FR-1 "trace to a Reference Site capture") and never mentions inspo MCP, `recommend()`, or the optional `TOGETHER_API_KEY` semantic-search unlock (with its "don't commit secrets" rule). Downstream UX/architecture phases reading only the PRD would skip a mandated pre-UI reference step.

2. **impeccable gate mechanics silently changed: local hooks → "CI pass".**
   CLAUDE.md defines the gate as **local hook mechanics**: "detector runs on **every Edit/Write of UI files and a deep pass on Stop** — read its findings, don't ignore" + convention "UI edits trigger impeccable hook feedback — treat findings as blockers".
   PRD FR-9 re-states it as "edit-time hooks **+ CI pass**; blocker findings block the change" and "CI fails on any blocker-level detector finding". The CI leg exists in no toolchain contract (hooks are editor-local; no CI integration is installed) — it is new, unwired scope presented as if established. Also, the glossary asserts "61 rules", a count CLAUDE.md never states — verify at implementation, don't inherit blindly.

3. **impeccable document flow and commands dropped.**
   CLAUDE.md: "`/impeccable init` → writes PRODUCT.md (product context)"; "Visual direction goes in **DESIGN.md via `/impeccable document`**"; commands `craft|audit|polish|critique`; "Config: `.impeccable/config.json` (committed)".
   PRD keeps only the audit gate (FR-9) and config-review consequence; PRODUCT.md and DESIGN.md — the impeccable context artifacts the kit's visual direction is supposed to live in — appear nowhere. FR-9's "Detector configuration (ignore rules)" alludes to config but never pins it to `.impeccable/config.json` as the committed source of truth.

4. **Browser automation policy dropped: playwright-cli-only mandate absent.**
   CLAUDE.md Conventions: "**Playwright (via `playwright-cli`) is the only browser automation tool**" (mirrors the global policy: Playwright is the only browser tool; Chrome-in-agent alternatives disabled).
   PRD presupposes browser tooling three times without binding it to the sanctioned tool: FR-10 "automated screenshot comparison", FR-6 "Automated a11y checks pass in story docs", FR-7 "verified via media emulation" — plus the baseline captures themselves. Architecture could spec a competing/forbidden browser stack from the PRD alone.

5. **pnpm/Node requirements dropped.**
   CLAUDE.md: "**Package manager is pnpm**. **Node >= 20**."
   PRD: `pnpm` appears once, as a *consumer* install example (FR-11 "install via `pnpm add <package>`"). The internal pnpm-only convention for repo tooling and the Node >= 20 minimum engine requirement appear nowhere (FR-11's consequences are silent on `engines`, and Open Question 5 covers SSR/tree-shaking but not runtime/engine floors).

6. **Trademark constraint narrowed from "published output" to "published naming".**
   CLAUDE.md: "no trademark use in **published output**" — a broad ban covering docs, story docs, marketing pages, assets.
   PRD Open Question 2 retains the constraint only for the package *name* ("no 'Tinkoff'/'Т-Банк' claims in **published naming** … neutral name with clear attribution in README"). Trademark usage in the rest of the published surface (docs site, story docs with Reference Site screenshots, README imagery) is left unconstrained.

7. **transitions.dev mechanics partially dropped (source kept, acquisition lost).**
   PRD FR-7 correctly preserves the source ("vetted recipes (transitions.dev, namespaced `t-*`)") and reduced-motion respect. Dropped: the acquisition mechanism ("Add transitions once src/ exists: `npx transitions-dev add --free`"), the 32-reference catalog + `transitions-polish` pass, and the class-namespace rule's enforcement origin. Minor: implementation detail, but stories/architecture should not re-invent motion sourcing.
   Note also an internal PRD tension (not a CLAUDE.md conflict): FR-7 body says "disabled **or simplified**" while its consequence demands "**Zero animations** run for reduced-motion users" — pick one before stories.

8. **BMAD runtime operational constraints dropped (acceptable for a PRD, listed for completeness).**
   CLAUDE.md: runtime at `_bmad/` ("never hand-edit `_bmad/scripts`"), requires `uv`, maintenance via `npx skills update` + "bmad doctor", and "bmad help" for skill routing. PRD §0 names the downstream BMad workflows only. Operational tooling is reasonably out of PRD scope; flagging so the architecture phase inherits the maintenance/uv constraints from CLAUDE.md, not from the PRD.

## Checked — not gaps

- **Stack deference:** CLAUDE.md "Stack: NOT chosen yet — decide via BMAD planning" ↔ PRD §5 Non-Goals + Open Question 4. Consistent.
- **impeccable-as-blocker:** CLAUDE.md "treat findings as blockers" ↔ FR-9 blocker semantics, SM-1. Consistent (only the CI leg is new — gap 2).
- **a11y / dark mode / token improvements over the original:** CLAUDE.md workflow step 3 ↔ PRD Phase 2 (FR-2, FR-6). Consistent.
- **Audit + transitions per component:** CLAUDE.md workflow step 4 ↔ FR-9 + FR-7. Consistent.
- **Reference site identity:** PRD updates tinkoff.ru → tbank.ru (301 rebrand) and flags it explicitly — a documented correction; CLAUDE.md is the stale side here.
- **Repo hygiene conventions** (`.claude/settings.local.json` not committed; `_bmad-output/` drafts committable once stable): repo-level, out of PRD scope — not a gap.

**Recommendation:** gaps 1–5 belong in the PRD's architecture-phase inputs (a "Toolchain Constraints" section would cost ~10 lines and close all five); gap 6 needs one sentence widened in Open Question 2; gaps 7–8 can ride along in story/architecture notes.
