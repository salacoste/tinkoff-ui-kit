// Ambient declarations for side-effect asset imports consumed by bundlers.
// TS 7's native checker cannot infer a type for `import './tokens.css'` on its own.
declare module '*.css';
