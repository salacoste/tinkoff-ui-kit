import { defineConfig } from 'vitest/config';

// @lit/react resolution for tests (the bank react package's spec-1.7-review
// mold, copied verbatim): the package's NODE builds apply element properties
// ONLY through the `_$litProps$` SSR bag (they drop them on the client
// path), while the BROWSER builds set them via useLayoutEffect. Node/vitest
// resolves the `node` condition, so render smoke tests would silently lose
// props against a build no React consumer ships. Resolve the browser build
// and inline it so the conditions apply; the config rides the scaffold so
// the first ТЖ wrapper test (epic 16) inherits the fix for free.
export default defineConfig({
  resolve: {
    conditions: ['browser', 'development', 'import', 'default'],
  },
  test: {
    environment: 'happy-dom',
    server: {
      deps: {
        inline: ['@lit/react'],
      },
    },
  },
});
