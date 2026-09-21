---
title: 'Story 1.4 — Component API convention documented and enforced'
type: 'feature'
created: '2026-09-22'
status: 'done'
route: 'oneshot'
route_source: 'auto'
review: 'quick'
review_source: 'auto'
lenses_ran: [quick]
review_loop_iteration: 0
baseline_commit: '7661a1cf64797afa46b620f8e09625bf01522002'
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The 19 components start landing at Story 1.7 with no written API convention — every wrapper author would improvise prop/event/slot naming and controlled-mode semantics, and PR review would have no checklist to enforce uniformity (FR-3, AD-5).

**Approach:** Author `packages/components/CONVENTIONS.md` — the uniform component API convention (props, events, controlled/uncontrolled, slots, custom-property grammar, element naming) plus the review checklist and the freeze protocol (React-surface + overlay API frozen at the Input PR, 2.1), each rule traceable to the architecture spine.

## Boundaries & Constraints

**Always:**
- Content sources: ARCHITECTURE-SPINE AD-5 + Consistency Conventions table, EXPERIENCE.md Interaction Primitives, epics Story 1.4 ACs. Every rule cites its source (AD-x / EXPERIENCE section).
- Must cover: camelCase Lit reactive props; events `<prop>-change` (value updates, `detail: { value }`) and `<verb>` bare (occurrences); controlled (`value` + event) AND uncontrolled modes with identical semantics for every stateful component; slot/content patterns (named slots, default slot); `tk-` element prefix kebab-case (revisit OQ-3); `--tk-<component>-<slot>` custom-property grammar with the same-slot-same-role rule; TypeScript typing conventions for props/events; a11y floor hooks (roles/names/states by construction, keyboard matrix pointer); SSR-compat construction rule (no imperative DOM at construction — AD-10); motion consumption rule (durations/curves only via `--tk-motion-*`).
- Freeze protocol section: React-surface API (prop style, controlled-mode semantics, unwrapped-value handlers) and overlay usage API decided and FROZEN at Story 2.1 (Input PR); later components conform; deviations require a logged exception in this file's exception log.
- PR review checklist section: the API-consistency checklist items a reviewer runs on every component PR, including the AD-10 construction rule and "detector ignore-rule changes are reviewed and justified (FR-9)".
- Docs-linkable: the docs package will link this file from a stable relative path (`@tk-kit/components/CONVENTIONS.md`).

**Never:**
- No component code, no React wrapper code, no Storybook — this story is the document only.
- No new architectural decisions — restate the spine faithfully; where the spine is silent (e.g., boolean attribute reflection, default-slot vs named-slot choice heuristics), mark the item `[OPEN — decided at 1.7 pilot]` rather than inventing.
- No DESIGN.md/EXPERIENCE.md edits.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Component PR review | reviewer runs the checklist | every item pass/fail/NA with the cited rule | fail = logged exception or PR change |
| Spine-silent question | convention not derivable from the spine | item marked `[OPEN — decided at 1.7 pilot]` | never invented silently |

</frozen-after-approval>

## Code Map

- `packages/components/README.md` -- stub from 1.1; CONVENTIONS.md sits beside it
- `_bmad-output/planning-artifacts/architecture/architecture-tinkoff-ui-kit-2026-09-21/ARCHITECTURE-SPINE.md` -- AD-5, AD-10, Consistency Conventions table (content source, via epic-1-context)
- `_bmad-output/planning-artifacts/ux-designs/ux-tinkoff-ui-kit-2026-09-21/EXPERIENCE.md` -- Interaction Primitives, a11y floor (content source, via epic-1-context)

## Tasks & Acceptance

**Execution:**
- [x] `packages/components/CONVENTIONS.md` -- the convention document (sections: Element & file naming / Props / Events / Controlled & uncontrolled / Slots / Custom properties / Typing / A11y & keyboard / Motion / SSR-compat construction / Freeze protocol + exception log / PR review checklist) -- the deliverable
- [x] `packages/components/package.json` -- export `./CONVENTIONS.md` -- stable link target

**Acceptance Criteria:**
- Given a component author reading only CONVENTIONS.md, when designing a new stateful component, then props/events/controlled-mode/slot naming is fully determined (nothing left to improvise) except items explicitly marked `[OPEN — decided at 1.7 pilot]`.
- Given a PR reviewer, when running the checklist, then every item cites its spine/EXPERIENCE source.
- Given the docs package later, when linking, then `@tk-kit/components/CONVENTIONS.md` resolves.

## Implementation Notes

- Oneshot route: single markdown file, content fully determined by approved planning artifacts; written directly by the orchestrator. Approved autonomously (standing delegation); the only authored glue is section ordering and checklist phrasing.

## Spec Change Log

## Review Triage Log

Pass 1 (2026-09-22, quick lens; verdicts medium 5 / low 3 / false 0 — all patched by orchestrator):

- medium — §4 controlled-fallback rule ("falls back to internal state") invented; the spine's adversarial review explicitly left controlled semantics open until 2.1 → patched: marked `[OPEN — frozen at 2.1 (Input)]` with source note.
- medium — §4 initial-value shape ambiguous ("defaultValue-style or plain attribute") — AC-1 requires determination or an OPEN marker → patched: marked OPEN at 2.1.
- medium — §3 composed/bubbles rule invented under an AD-1 citation that doesn't contain it → patched: marked `[OPEN — decided at 1.7 pilot]`.
- medium — §3 "CI fails on unregistered events" misstates the gen check (it catches stale output, not missing registry entries; checklist item 3 inherited the false claim) → patched: reworded both.
- medium — package.json `files: ["dist"]` excludes CONVENTIONS.md from published tarballs, dangling the new export (FR-11) → patched: files += CONVENTIONS.md.
- low — §2 union-vs-boolean rule uncited (good rule, silent invention) → patched: OPEN-confirmed-at-1.7 marker.
- low — §2 boolean-reflection decision stated in body despite the spec's Never naming it verbatim → patched: whole reflection topic OPEN.
- low — §5 default-vs-named heuristic invented + same-slot-same-role citation mis-scoped (governs custom properties, not content slots) → patched: heuristic OPEN; citation re-scoped as analogy.
- low — §7 TkInputChangeEvent naming uncited → patched: OPEN-confirmed marker.

## Design Notes

## Verification

**Commands:**
- `node -e "console.log(require('fs').existsSync('packages/components/CONVENTIONS.md'))"` -- expected: true
- `pnpm test && pnpm lint` -- expected: exit 0 (doc-only change keeps gates green)
