import { defineConfig } from 'vite';

// Lib-mode build with dependencies externalized — workspace deps and runtime
// dependencies are never bundled into package output (AD-4 / build isolation).
// The ТЖ family is runtime-disjoint from the bank family (FR-17): the
// /^pillkit-/ external covers both families without ever resolving an edge.
// Harmless while tj-tokens has no deps; honest once story 15.2 adds them.
export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: () => 'index.js',
      cssFileName: 'index',
    },
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      external: [/^pillkit-/, /^lit($|\/)/, /^lit-html$/, /^@lit\//],
    },
  },
});
