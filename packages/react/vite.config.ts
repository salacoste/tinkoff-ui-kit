import { defineConfig } from 'vite';

// Lib-mode build with dependencies externalized. Workspace-linked deps are NOT
// auto-externalized by Vite lib mode, so they are listed explicitly:
// `@tk-kit/components` (workspace dep), `@lit/react` (dependency) and `react`
// (peer) stay external imports in the output — never bundled.
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
      external: [/^@tk-kit\//, /^@lit\//, /^react$/, /^react\//],
    },
  },
});
