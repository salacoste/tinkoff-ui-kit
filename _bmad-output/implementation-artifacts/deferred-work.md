# Deferred Work

- source_spec: `_bmad-output/implementation-artifacts/spec-1-1-scaffold-multi-package-workspace.md`
  summary: Fold vendored transitions.dev literals (colors in `transitions/_root.css`, per-file literals in `t-error-state-shake.css`/`t-card-tilt.css`) into `--tk-*` tokens when recipes are consumed
  evidence: Story 1.2's AD-9 adaptation mandate names motion values; the color tunables (`--like-color`, `--tabs-*`, `--tt-*`, `--matrix-*`, `--shimmer-*`, `--think-*`) and per-file duration/easing/radius literals have no explicit owner and collide with the zero-hard-coded-values gate (1.2 AC / 1.8 CI)
- source_spec: `_bmad-output/implementation-artifacts/spec-1-1-scaffold-multi-package-workspace.md`
  summary: Add LICENSE (MIT) and provenance headers to the 32 vendored `transitions/t-*.css` files
  evidence: OSS-intent repo (PRD FR-11 MIT) with vendored third-party content carrying no per-file attribution; only `_root.css` credits transitions.dev; verify the transitions.dev free-pack license terms at that time — owner: Story 5.7 (publish)
- source_spec: `_bmad-output/implementation-artifacts/spec-1-1-scaffold-multi-package-workspace.md`
  summary: Single-source the AD-4 import matrix (eslint config, boundary test, docs) instead of three hand-maintained copies
  evidence: the two code copies already diverged once on file-type coverage (caught in review); structural fix (derive test matrix from config or shared data) fits Story 1.8 CI hardening
- source_spec: `_bmad-output/implementation-artifacts/spec-1-1-scaffold-multi-package-workspace.md`
  summary: Widen the `react` peer dependency from the exact `19.3.0` pin to a semver range before publishing
  evidence: exact peer pins reject all other React 19.x consumers at resolution time; spine pin is honored for dev, publish policy is Story 5.7's call
