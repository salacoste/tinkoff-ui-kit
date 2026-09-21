import { defineConfig } from 'vite';

// Lib-mode build with dependencies externalized — workspace deps and runtime
// dependencies are never bundled into package output (AD-4 / build isolation).
// Harmless while tokens has no deps; honest once Story 1.2 adds them.
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
      external: [/^@tk-kit\//, /^lit($|\/)/, /^lit-html$/, /^@lit\//],
    },
  },
});
