/**
 * Landing entry — bank-family tokens (+ bundled Daytona faces, same import
 * set as the showcase entries) + full component registration.
 *
 * Plain ESM only (no TypeScript-only syntax): the lint hook parses website
 * sources with the base parser and the root typecheck does not include them.
 * Component modules come prebuilt from the workspace packages.
 */
import 'pillkit-tokens/tokens.css';
import 'pillkit-tokens/daytona.css';
import 'pillkit-components';
import './styles/site.css';
