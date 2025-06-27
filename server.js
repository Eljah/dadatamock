const http = require('http');

const PORT = process.env.PORT || 3000;

function parseBody(req, callback) {
  let body = '';
  req.on('data', chunk => {
    body += chunk;
  });
  req.on('end', () => {
    try {
      const data = JSON.parse(body || '{}');
      callback(null, data);
    } catch (err) {
      callback(err);
    }
  });
}

const server = http.createServer((req, res) => {
  const start = Date.now();

  const sendResponse = (statusCode, payload) => {
    const elapsed = Date.now() - start;
    const delay = Math.max(0, 200 - elapsed);
    setTimeout(() => {
      res.writeHead(statusCode, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(payload));
    }, delay);
  };

  if (req.method === 'POST' && req.url === '/suggestions/api/4_1/rs/suggest/address') {
    parseBody(req, (err, data) => {
      if (err) {
        sendResponse(400, { error: 'Invalid JSON' });
        return;
      }

      const query = data.query || '';
      const suggestions = [];
      for (let i = 1; i <= 5; i++) {
        suggestions.push({
          value: `${query} fake address ${i}`,
          unrestricted_value: `${query} fake address ${i}`,
          data: {
            from_bound: data.from_bound ? data.from_bound.value : null,
            to_bound: data.to_bound ? data.to_bound.value : null
          }
        });
      }

      sendResponse(200, { suggestions });
    });
  } else {
    sendResponse(404, { error: 'Not found' });
  }
});

server.listen(PORT, () => {
  console.log(`Fake Dadata server listening on port ${PORT}`);
});
