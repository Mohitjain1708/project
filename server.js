const http = require('http');
const fs   = require('fs');
const path = require('path');
const root = '/home/user/webapp';

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.ico':  'image/x-icon',
  '.svg':  'image/svg+xml',
  '.woff2':'font/woff2',
  '.md':   'text/plain',
};

const server = http.createServer((req, res) => {
  let url = req.url === '/' ? '/index.html' : req.url.split('?')[0];
  const filePath = path.join(root, url);
  const ext      = path.extname(filePath);
  try {
    const data = fs.readFileSync(filePath);
    res.writeHead(200, {
      'Content-Type': mime[ext] || 'text/plain',
      'Cache-Control': 'no-cache',
    });
    res.end(data);
  } catch(e) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

server.listen(3000, '0.0.0.0', () => {
  console.log('American Dream Sales Deck — http://0.0.0.0:3000');
});
