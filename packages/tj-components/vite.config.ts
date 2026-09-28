import { defineConfig } from 'vite';

// Lib-mode build with dependencies externalized. Workspace-linked deps are NOT
// auto-externalized by Vite lib mode, so the AD-4 edges are listed explicitly:
// `lit`/`lit-html` (dependencies) and the `pillkit-tj-tokens` workspace dep
// stay external imports in the output — never bundled. The /^pillkit-/
// external spans BOTH families without ever resolving an edge: the ТЖ family
// has zero runtime dependency on the bank family (FR-17).
export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: () => 'index.js',
    },
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      external: [/^(lit|lit-html)(\/|$)/, /^@lit(-labs)?\//, /^pillkit-/],
    },
  },
});
