/**
 * pillkit-tj-tokens — design token package for the ТЖ sub-kit (story 15.1
 * scaffold; the 1.1 mold, second instance).
 *
 * Programmatic access to the ТЖ token system lands at story 15.2: the
 * generator runs as ONE mechanism with the ТЖ DESIGN.md as its second input
 * (AD-3 v5) and emits `--tj-*` on `:root` + `[data-tj-theme="dark"]` + the
 * `auto` media layer. Until then the entry carries no exports — no
 * hand-authored token may precede the generator's table.
 *
 * Styles ship as the `pillkit-tj-tokens/tokens.css` export (the bank mold):
 * the side-effect import below pulls the placeholder sheet through bundlers
 * that consume this source, while the built library extracts the CSS to
 * dist/index.css and strips the import from dist JS.
 */
import './tokens.css';

export {};
