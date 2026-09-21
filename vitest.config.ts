import { defineConfig } from 'vitest/config';

// Root-level suite (tests/) — the root `test` script runs the workspace packages
// first (`pnpm -r test`) and then this config. Scoped to tests/ so the package
// suites are not re-run from the root invocation.
export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
  },
});
