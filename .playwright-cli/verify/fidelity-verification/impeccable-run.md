# Impeccable kit-wide detector run (Story 5.6, 2026-09-23)

**Standard (SM-1 / FR-9):** the headless design detector passes over ALL kit
component sources with **zero blockers**. CI contract (Story 1.8,
`.github/workflows/ci.yml`): `impeccable detect <files>` — **exit 0 clean /
1 target unscannable / 2 findings**; any non-zero fails the gate.

## The run (this story, post 5.6 in-change fixes)

- Engine: the committed launcher + platform binary
  `.claude/skills/impeccable/scripts/impeccable` (same engine the local
  PostToolUse/Stop hooks run; the Stop deep pass ran over every UI edit of
  this story and surfaced no blockers).
- Scope: the FULL UI source set — strictly larger than the CI diff-base scan
  (CI scans changed files; this run scans everything, the CI "no usable diff
  base" branch):
  `packages/tokens/src packages/components/src packages/react/src
  packages/docs/src packages/docs/.storybook` — **145 files**
  (`*.ts *.tsx *.css *.js *.mjs *.html`; list archived at `/tmp/ui-files.txt`
  generation below).
- Command (reproducible):

```sh
find packages/tokens/src packages/components/src packages/react/src \
      packages/docs/src packages/docs/.storybook -type f \
      \( -name '*.ts' -o -name '*.tsx' -o -name '*.css' -o -name '*.js' \
         -o -name '*.mjs' -o -name '*.html' \) | sort \
  | xargs .claude/skills/impeccable/scripts/impeccable detect
```

- **Result: exit 0, zero findings, zero warnings** (empty output; 2026-09-23,
  on the post-fix tree — includes this story's edits to article-card.css.ts,
  api-reference.ts, getting-started.stories.ts and the regenerated tokens).

  Harness note for reproducers: in **zsh**, an unquoted `$FILES` does NOT
  word-split — `detect $LIST` passes the whole newline-joined list as ONE
  path and the engine correctly answers **exit 1** («cannot access …», the
  unscannable contract). Use `xargs` (or bash) as above. That exit-1 was
  observed and diagnosed during this run — the exit contract works as
  documented.

## The audit can fail — self-check evidence (run this story)

| Probe | Input | Result |
|---|---|---|
| Violation injection | temp CSS with `cubic-bezier(0.68, -0.55, 0.265, 1.55)` + a `linear-gradient` | **exit 2**, blocker named: `line 2: [bounce-easing] …` «Bounce and elastic easing feel dated…» |
| Clean control | temp CSS `color: #333` | **exit 0** |

A detector that cannot emit a blocker is not evidence; this one can and does.

## The ONE sanctioned ignore — re-verified, VALUE-SCOPED

`.impeccable/config.json` → `detector.ignoreValues`:

```json
{
  "rule": "bounce-easing",
  "value": "cubic-bezier(0.35, 1.3, 0.25, 1)",
  "createdAt": "2026-09-22T02:51:28.063Z",
  "reason": "Phase-1 faithful recreation: this IS the reference site's extracted expressive-entrance motion curve (tokens layer, values trace to DESIGN.md motion notes); Phase 2 may revisit per PRODUCT.md"
}
```

Re-verification (this story):

1. **The value exists in the kit** — `packages/tokens/src/tokens.css:180`:
   `--tk-motion-curve-expressive-entrance: cubic-bezier(0.35,1.3,0.25,1);`
   (the DESIGN.md `motion` extraction, Story 1.2 — the reference site's own
   entrance curve).
2. **The ignore is value-scoped, not rule-scoped** — proven by the pair of
   probes above: the SANCTIONED value `cubic-bezier(0.35, 1.3, 0.25, 1)`
   (even whitespace-formatted) → **exit 0**; a DIFFERENT bounce curve →
   **exit 2**. A future bounce-easing regression elsewhere in the kit still
   fails the gate.
3. **Kit-wide exit 0 WITH the sanctioned value present** in the scanned
   sources — the ignore fired exactly once where intended.
4. `ignoreRules: []`, `ignoreFiles: []` — no rule-level or file-level ignores
   exist anywhere in the project config.

**Maintainer ratification queue (the 1.8 hand-off, restated):** the single
ignore above is the only sanctioned deviation. It stays in force until the
maintainer rules on it (ratify as the faithful-recreation exception, or
replace the entrance curve with a non-bouncy expressive curve and delete the
ignore). PRODUCT.md Phase-2 owns the revisit.

## Zero-blocker statement (SM-1)

- Kit-wide headless run: **exit 0** (above).
- The same engine's edit-time hook ran on every UI edit of Epics 1–5 (the
  `.claude/settings.json` PostToolUse/Stop wiring); the story-level records
  (1.8 CI verification, per-story review passes) report no suppressed
  blockers — every finding ever emitted by the hook pipeline was either fixed
  in-change or is the one ignore above.
