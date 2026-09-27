// Tree-identity gate for the visual harness (the port-6007 machine-global
// contamination class, spec 6.3 / deferred-work): `reuseExistingServer` lets a
// second checkout silently ride the FIRST tree's already-listening server —
// the 6.3 incident served a worktree's dist to the main tree's run (212
// contaminated legs, including 2 FALSE pixel diffs). Playwright runs this once
// before any worker starts: the server answers GET /__tree__ (serve.mjs) with
// its pid + repo root; a root mismatch — or a foreign server with no
// /__tree__ — aborts the WHOLE run with the remediation command, instead of
// capturing baselines against the wrong tree.
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

/** Structural slice of Playwright's FullConfig — the resolved baseURL(s). */
type GlobalConfig = {
  projects?: Array<{ use?: { baseURL?: string } }>;
  use?: { baseURL?: string };
};

const sleep = (ms: number) => new Promise((wake) => setTimeout(wake, ms));

/** Fetch /__tree__; null = network error (boot race), a status = it answered. */
async function probeTree(baseURL: string, signal: AbortSignal): Promise<number | null> {
  try {
    const response = await fetch(`${baseURL.replace(/\/$/, '')}/__tree__`, { signal });
    return response.status;
  } catch {
    return null;
  }
}

async function readIdentity(baseURL: string): Promise<{ pid?: number; root?: string }> {
  try {
    return (await (await fetch(`${baseURL.replace(/\/$/, '')}/__tree__`)).json()) as {
      pid?: number;
      root?: string;
    };
  } catch {
    return {};
  }
}

export default async function globalSetup(config: GlobalConfig): Promise<void> {
  const baseURL = config.use?.baseURL ?? config.projects?.[0]?.use?.baseURL;
  if (!baseURL) {
    // No baseURL means no shared server to mis-identify — nothing to gate.
    return;
  }
  // The webServer is normally up before global setup; poll briefly through
  // connection-level races only — an ANSWERING server is judged immediately
  // (404 on /__tree__ is a foreign server, not a boot to wait out).
  const deadline = Date.now() + 20_000;
  let status: number | null = null;
  while ((status = await probeTree(baseURL, AbortSignal.timeout(2_000))) === null) {
    if (Date.now() > deadline) break;
    await sleep(250);
  }
  if (status === null) {
    throw new Error(
      `visual harness: no server answered ${baseURL} within 20s — the webServer failed to boot (see its stderr)`,
    );
  }
  if (status !== 200) {
    throw new Error(
      `visual harness: the server on ${baseURL} answered ${status} on /__tree__ — it is NOT this ` +
        `harness's server (a foreign/pre-guard build serves the port). Kill it (\`lsof -ti:6007 | xargs kill\`) and re-run.`,
    );
  }
  const identity = await readIdentity(baseURL);
  if (typeof identity.root !== 'string' || resolve(identity.root) !== REPO_ROOT) {
    const holder = identity.root
      ? `a DIFFERENT tree (${identity.root}, pid ${identity.pid ?? '?'})`
      : 'an unidentified server';
    throw new Error(
      `visual harness: ${baseURL} is serving ${holder} — this run (${REPO_ROOT}) would capture baselines ` +
        `against the wrong dist. Kill the stale server (\`lsof -ti:6007 | xargs kill\`) and re-run.`,
    );
  }
}
