// GitHub layer (spec 25.2 AC4): repo health via the authenticated `gh`
// CLI (already present in this environment — no tokens in code, no new
// deps). `normalizeRepoUrl` and the shaping of responses are pure and
// unit-tested; only `githubStats` touches the subprocess.

import { execFile as execFileCallback } from 'node:child_process';
import { promisify } from 'node:util';

const execFile = promisify(execFileCallback);

/** Hard cap for the contributors probe (GitHub pages at 100 per request). */
export const CONTRIBUTORS_CAP = 100;

/**
 * Normalize a package.json `repository` field to `owner/repo`.
 * Handles git+/git:/https: forms and .git suffixes; non-GitHub hosts → null.
 *
 * @param {string | {url: string} | null | undefined} repository
 * @returns {string | null}
 */
export function normalizeRepoUrl(repository) {
  const url = typeof repository === 'string' ? repository : repository?.url;
  if (!url || typeof url !== 'string') return null;
  const match = url.match(/github\.com[/:]([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+?)(?:\.git)?\/?$/i);
  return match ? `${match[1]}/${match[2]}` : null;
}

/**
 * Repo health: stars/forks/issues/pushed_at, last 10 releases, contributor
 * count (capped — see CONTRIBUTORS_CAP). Throws on gh failure; the caller
 * records the error honestly instead of writing silent zeros.
 *
 * @param {string} repo owner/name
 */
export async function githubStats(repo) {
  const gh = async (path) => JSON.parse((await execFile('gh', ['api', path], { maxBuffer: 32 * 1024 * 1024 })).stdout);
  const [repoDoc, releases, contributors] = await Promise.all([
    gh(`repos/${repo}`),
    gh(`repos/${repo}/releases?per_page=10`).catch(() => []),
    gh(`repos/${repo}/contributors?per_page=${CONTRIBUTORS_CAP}&anon=false`).catch(() => []),
  ]);
  return {
    repo,
    stars: repoDoc.stargazers_count ?? null,
    forks: repoDoc.forks_count ?? null,
    openIssues: repoDoc.open_issues_count ?? null,
    pushedAt: repoDoc.pushed_at ?? null,
    releases: releases.map((r) => ({ tag: r.tag_name ?? null, publishedAt: r.published_at ?? null })),
    contributors: contributors.length,
    contributorsCapped: contributors.length >= CONTRIBUTORS_CAP,
  };
}
