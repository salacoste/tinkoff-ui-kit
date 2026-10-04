// HTTP layer for the recon tool (spec 25.1 AC2/AC3).
//
// WHY curl and not native fetch: this repo's dev sandbox intercepts sockets
// in a way that times out node's bundled undici (ConnectTimeoutError against
// every resolved address) while plain curl to the same hosts succeeds. The
// harvest is a dev-side, read-only tool that already shells out to system
// `tar`; using system `curl` for transport keeps it dependency-free and
// deterministic across macOS/CI. Swap back to fetch only if that environment
// constraint disappears.

import { execFile as execFileCallback } from 'node:child_process';
import { promisify } from 'node:util';

const execFile = promisify(execFileCallback);

const USER_AGENT = 'pillkit-recon/25.1 (dev tooling; https://github.com/salacoste/tinkoff-ui-kit)';
const MAX_RETRIES = 3;

/** @typedef {{status: number, body: string}} TextResponse */

/**
 * GET a URL as text with bounded retries on 429/5xx/network errors.
 *
 * @param {string} url
 * @param {Record<string, string>} [headers]
 * @returns {Promise<TextResponse>}
 */
export async function httpText(url, headers = {}) {
  let lastError;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      const args = ['-sS', '--max-time', '90', '-w', '\n%{http_code}', '-A', USER_AGENT];
      for (const [key, value] of Object.entries(headers)) args.push('-H', `${key}: ${value}`);
      args.push(url);
      const { stdout } = await execFile('curl', args, { maxBuffer: 64 * 1024 * 1024 });
      const trimmed = stdout.replace(/\n$/, '');
      const newline = trimmed.lastIndexOf('\n');
      const status = Number(trimmed.slice(newline + 1));
      const body = newline === -1 ? '' : trimmed.slice(0, newline);
      if (status === 429 || status >= 500) {
        lastError = new Error(`HTTP ${status} for ${url}`);
      } else {
        return { status, body };
      }
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, attempt * 1500));
  }
  throw lastError;
}

/**
 * GET a URL as JSON (null on unparseable body — callers decide how honest to be).
 *
 * @param {string} url
 * @param {Record<string, string>} [headers]
 * @returns {Promise<{status: number, json: any}>}
 */
export async function httpJson(url, headers = {}) {
  const { status, body } = await httpText(url, headers);
  let json = null;
  try {
    json = JSON.parse(body);
  } catch {
    // caller sees null json + status and reports honestly
  }
  return { status, json };
}

/**
 * Download a URL to a file path.
 *
 * @param {string} url
 * @param {string} destPath
 * @returns {Promise<number>} HTTP status
 */
export async function httpToFile(url, destPath) {
  let lastError;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      const { stdout } = await execFile('curl', ['-sS', '--max-time', '300', '-o', destPath, '-w', '%{http_code}', '-A', USER_AGENT, url]);
      const status = Number(stdout.trim());
      if (status !== 429 && status < 500) return status;
      lastError = new Error(`HTTP ${status} for ${url}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, attempt * 1500));
  }
  throw lastError;
}
