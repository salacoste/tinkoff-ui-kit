// Ambient declarations for the root-level suite (tests/**).
// tests/docs-preview.test.ts imports packages/docs/.storybook/preview.ts, whose
// side-effect CSS import needs a module declaration outside the docs package's
// own globals.d.ts scope.
declare module '*.css';
