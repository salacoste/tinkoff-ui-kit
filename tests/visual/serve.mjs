// Visual-harness static server (spec 1.6). Zero-dependency Node HTTP server that
// mounts, on one fixed port, everything the Playwright suite needs with NO
// network access:
//
//   /            -> packages/docs/dist        (the Storybook 10 static build)
//   /daytona/... -> packages/tokens/fonts    (the bundled licensed DaytonaSans files)
//   /inter/...   -> node_modules/@fontsource/inter  (the open-fallback test font files)
//   /jetbrains-mono/... -> node_modules/@fontsource/jetbrains-mono  (the pinned mono slot's test font)
//   /pt-serif/... -> node_modules/@fontsource/pt-serif  (the ТЖ reading-slot pin's test font, story 15.3)
//
// Started by playwright.config.ts `webServer` (never committed to long-running
// use); Playwright polls webServer.url (/index.json) until it answers 2xx, then
// runs the suite against it, then kills the process.
//
// Tree identity (the port-6007 machine-global contamination class, spec 6.3 /
// deferred-work): `reuseExistingServer` lets a second checkout silently ride
// the FIRST tree's already-listening server. This server therefore (a) answers
// `GET /__tree__` with its pid + repo root, which tests/visual/global-setup.ts
// compares against THIS checkout's root before any leg runs, and (b) keeps a
// lockfile (pid + root) so an EADDRINUSE boot names the tree holding the port.
import { createReadStream, existsSync, readFileSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, extname, join, normalize, resolve, sep } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const PORT = Number.parseInt(process.argv[2] ?? '6007', 10);
if (!Number.isInteger(PORT) || PORT <= 0 || PORT > 65535) {
  console.error(
    `visual harness server: invalid port "${process.argv[2] ?? ''}" — usage: node serve.mjs <port 1-65535> (default 6007)`,
  );
  process.exit(1);
}

// --- Port lockfile (diagnostics for the machine-global-port class) ----------
// The lock lives in the OS temp dir keyed by port; it names THIS server's pid
// + repo root so a blocked boot (EADDRINUSE) can say WHICH tree holds the
// port. Replaced when stale (holder dead) — acquisition ordering is: bind the
// port first, then write the lock (a lock without its port is meaningless, so
// it is always replaced by whoever actually holds the port).
const LOCK_PATH = join(tmpdir(), `pillkit-visual-${PORT}.lock`);
const isAlive = (pid) => {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
};
const writeLock = () => {
  try {
    writeFileSync(LOCK_PATH, `${JSON.stringify({ pid: process.pid, root: REPO_ROOT })}\n`, {
      flag: 'w',
    });
  } catch {
    // A missing lock only degrades the EADDRINUSE diagnostic, never the suite.
  }
};
const readLock = () => {
  try {
    return JSON.parse(readFileSync(LOCK_PATH, 'utf8'));
  } catch {
    return null;
  }
};
const releaseLock = () => {
  // Only unlink our own lock — a replacement holder may have rewritten it.
  const held = readLock();
  if (held?.pid === process.pid) unlinkSync(LOCK_PATH);
};

/** Mount table — most specific prefixes first, catch-all '/' last. */
const ROUTES = [
  { prefix: '/daytona', root: join(REPO_ROOT, 'packages', 'tokens', 'fonts') },
  { prefix: '/inter', root: join(REPO_ROOT, 'node_modules', '@fontsource', 'inter') },
  { prefix: '/jetbrains-mono', root: join(REPO_ROOT, 'node_modules', '@fontsource', 'jetbrains-mono') },
  { prefix: '/pt-serif', root: join(REPO_ROOT, 'node_modules', '@fontsource', 'pt-serif') },
  { prefix: '/', root: join(REPO_ROOT, 'packages', 'docs', 'dist') },
];

const MIME_TYPES = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.map', 'application/json; charset=utf-8'],
  ['.mjs', 'text/javascript; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
]);

const server = createServer((req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname);
  } catch {
    // Malformed percent-encoding must answer 400, never crash the webServer.
    res.writeHead(400, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('visual harness server: malformed percent-encoding in request path');
    return;
  }
  // Tree identity for tests/visual/global-setup.ts (see the file header):
  // answered from process state, before any filesystem mount is consulted.
  if (pathname === '/__tree__') {
    res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
    res.end(JSON.stringify({ pid: process.pid, root: REPO_ROOT, port: PORT }));
    return;
  }
  for (const { prefix, root } of ROUTES) {
    if (prefix !== '/' && pathname !== prefix && !pathname.startsWith(`${prefix}/`)) continue;
    let relative = normalize(prefix === '/' ? pathname : pathname.slice(prefix.length));
    if (relative === '.' || relative === '/') relative = '/index.html';
    const filePath = join(root, relative);
    // Path-traversal guard: the resolved file must stay inside its mount root.
    if (filePath !== root && !filePath.startsWith(root + sep)) continue;
    if (!existsSync(filePath) || !statSync(filePath).isFile()) continue;
    res.writeHead(200, {
      'content-type': MIME_TYPES.get(extname(filePath)) ?? 'application/octet-stream',
      'cache-control': 'no-store',
    });
    const stream = createReadStream(filePath);
    // A file vanishing mid-stream (ENOENT/EACCES) must not surface as an
    // unhandled 'error' event that kills the process mid-suite.
    stream.on('error', () => res.destroy());
    stream.pipe(res);
    return;
  }
  res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
  res.end(`visual harness server: not found: ${pathname}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    const held = readLock();
    const holder = held?.root
      ? ` — held by tree ${held.root} (pid ${held.pid}, ${isAlive(held.pid) ? 'alive' : 'dead'})`
      : '';
    console.error(
      `visual harness server: port ${PORT} is already in use${holder}. Free it (\`lsof -ti:${PORT} | xargs kill\`), or change the port in playwright.config.ts (PORT) AND the webServer command/url.`,
    );
  } else {
    console.error(`visual harness server: ${error.message}`);
  }
  process.exit(1);
});

server.listen(PORT, '127.0.0.1', () => {
  writeLock();
  for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
    process.on(signal, () => {
      server.close(() => process.exit(0));
      // If close hangs on an open keep-alive socket, still exit promptly.
      setTimeout(() => process.exit(0), 2_000).unref();
    });
  }
  process.on('exit', releaseLock);
  console.log(`visual harness server on http://127.0.0.1:${PORT} (docs dist + daytona fonts + @fontsource/inter + @fontsource/jetbrains-mono + @fontsource/pt-serif)`);
});
