/**
 * T-Journal showcase entry. The editorial sub-kit is runtime-disjoint from
 * the bank family (FR-17) — its own tokens, components and reading face
 * (XCharter from pillkit-tj-fonts). As a CONSUMER of both families this page
 * also loads the bank token sheet for the shared site chrome (--tk-*).
 * Plain ESM only; see main.ts for the parser note.
 */
import 'pillkit-tokens/tokens.css';
import 'pillkit-tj-tokens/tokens.css';
import 'pillkit-tj-fonts/fonts.css';
import 'pillkit-tj-components';
import './styles/site.css';
