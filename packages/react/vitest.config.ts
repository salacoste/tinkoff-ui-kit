import { defineConfig } from 'vitest/config';

// @lit/react resolution for tests (spec 1.7 review): the package's NODE
// builds apply element properties ONLY through the `_$litProps$` SSR bag
// (they drop them on the client path), while the BROWSER builds set them via
// useLayoutEffect. Node/vitest resolves the `node` condition, so the render
// smoke test would silently lose props (`variant` never landing) against a
// build no React consumer ships. Resolve the browser build — the one Vite/
// webpack React apps actually load — and inline it so the conditions apply:
// externalized deps bypass vite resolution entirely.
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
