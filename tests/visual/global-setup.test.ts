// Tripwire for the visual-harness tree-identity gate (tests/visual/
// global-setup.ts — the port-6007 machine-global contamination class,
// spec 6.3 / deferred-work): a second checkout riding the first tree's
// already-listening server must abort the run BEFORE any leg. The three
// answerable shapes are pinned here: this tree (pass), a different tree
// (abort), a foreign server with no /__tree__ (abort).
import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterAll, describe, expect, it } from 'vitest';

import globalSetup from './global-setup';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

/** Minimal stand-in servers exercising the gate's three verdict paths. */
function boot(onTree: (req: IncomingMessage, res: ServerResponse) => void): Promise<{
  server: Server;
  url: string;
}> {
  const server = createServer((req, res) => onTree(req, res));
  return new Promise((ready) => {
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      ready({ server, url: `http://127.0.0.1:${typeof address === 'object' && address ? address.port : 0}` });
    });
  });
}

const live: Server[] = [];
afterAll(async () => {
  await Promise.all(live.map((server) => new Promise<void>((done) => server.close(() => done()))));
});

describe('visual-harness tree-identity gate', () => {
  it('passes when the answering server is THIS tree', async () => {
    const { server, url } = await boot((req, res) => {
      if (req.url === '/__tree__') {
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ pid: process.pid, root: REPO_ROOT }));
        return;
      }
      res.writeHead(404).end();
    });
    live.push(server);
    await expect(globalSetup({ use: { baseURL: url } })).resolves.toBeUndefined();
  });

  it('aborts when the server belongs to a different tree (the 6.3 incident shape)', async () => {
    const { server, url } = await boot((req, res) => {
      if (req.url === '/__tree__') {
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ pid: 1, root: '/some/other/worktree' }));
        return;
      }
      res.writeHead(404).end();
    });
    live.push(server);
    await expect(globalSetup({ use: { baseURL: url } })).rejects.toThrow(/DIFFERENT tree/);
  });

  it('aborts when the server has no tree identity (foreign or pre-guard build)', async () => {
    const { server, url } = await boot((req, res) => {
      res.writeHead(404).end();
    });
    live.push(server);
    await expect(globalSetup({ use: { baseURL: url } })).rejects.toThrow(/NOT this harness's server/);
  });
});
