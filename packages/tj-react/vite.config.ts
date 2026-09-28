import { defineConfig } from 'vite';

// Lib-mode build with dependencies externalized. Workspace-linked deps are NOT
// auto-externalized by Vite lib mode, so they are listed explicitly:
// `pillkit-tj-components` (workspace dep), `@lit/react` (dependency) and
// `react` (peer) stay external imports in the output — never bundled. The
// /^pillkit-/ external spans BOTH families without ever resolving an edge:
// the ТЖ family has zero runtime dependency on the bank family (FR-17).
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
      external: [/^pillkit-/, /^@lit\//, /^react$/, /^react\//],
    },
  },
});
