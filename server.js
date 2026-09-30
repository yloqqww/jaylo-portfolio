const { createServer } = require('http');
const { parse } = require('url');
const net = require('net');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const startPort = parseInt(process.env.PORT, 10) || 3000;

function checkPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close(() => resolve(true));
    });
    server.listen(port);
  });
}

async function getAvailablePort(port) {
  let p = port;
  while (!(await checkPortAvailable(p))) {
    console.log(`> Port ${p} is in use, checking port ${p + 1}...`);
    p++;
  }
  return p;
}

async function main() {
  const port = await getAvailablePort(startPort);
  const app = next({ dev, hostname, port });
  const handle = app.getRequestHandler();

  console.log(`> Starting Next.js dev server on http://${hostname}:${port}...`);
  await app.prepare();

  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  server.listen(port, () => {
    console.log(`> READY: Portfolio is running on http://${hostname}:${port}`);
  });
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
