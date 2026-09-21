// Flat ESLint config — typescript-eslint recommended + the AD-4 import-boundary matrix.
//
// TypeScript arrangement (per the TS 7.0 side-by-side guidance): `tsc` is the pinned
// TypeScript 7.0.2 native compiler (via the `@typescript/native` devDep alias), while the
// `typescript` name resolves to `@typescript/typescript6` — the TS 6 API that
// typescript-eslint requires. Do not "fix" this by removing either alias.
//
// AD-4 allowed import directions (lint-enforced, anything else fails):
//   components → tokens
//   react      → components
//   docs       → { react, components, tokens }
// Both bare package imports (`@tk-kit/*`) and relative cross-package escapes
// (`../../<pkg>/...` at any depth) are restricted. The lint regex for relative escapes
// approximates by specifier shape; the precise path-resolution check lives in
// tests/import-boundaries.test.ts (runs in `pnpm test`).
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/coverage/**',
      '_bmad/**',
      '_bmad-output/**',
      '.claude/**',
      '.impeccable/**',
      '.omc/**',
      '.playwright-cli/**',
    ],
  },
  ...tseslint.configs.recommended,
  {
    files: ['packages/tokens/src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@tk-kit/*', '@tk-kit/**'],
              message:
                'AD-4 import boundary: tokens is the root of the dependency graph and may not import any workspace package (allowed directions: components→tokens, react→components, docs→{react, components, tokens}).',
            },
            {
              regex: '^\\.\\./',
              message:
                'AD-4 import boundary: tokens may not reach outside its own package via parent-relative imports (allowed directions: components→tokens, react→components, docs→{react, components, tokens}).',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['packages/components/src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '@tk-kit/react',
                '@tk-kit/react/**',
                '@tk-kit/docs',
                '@tk-kit/docs/**',
              ],
              message:
                'AD-4 import boundary: components may only import @tk-kit/tokens (allowed directions: components→tokens, react→components, docs→{react, components, tokens}).',
            },
            {
              regex: '^(\\.\\./)+(react|docs)(/|$)',
              message:
                'AD-4 import boundary: components may not reach react or docs via relative imports (allowed directions: components→tokens, react→components, docs→{react, components, tokens}).',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['packages/react/src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '@tk-kit/tokens',
                '@tk-kit/tokens/**',
                '@tk-kit/docs',
                '@tk-kit/docs/**',
              ],
              message:
                'AD-4 import boundary: react may only import @tk-kit/components (allowed directions: components→tokens, react→components, docs→{react, components, tokens}).',
            },
            {
              regex: '^(\\.\\./)+(tokens|docs)(/|$)',
              message:
                'AD-4 import boundary: react may not reach tokens or docs via relative imports (allowed directions: components→tokens, react→components, docs→{react, components, tokens}).',
            },
          ],
        },
      ],
    },
  },
);
