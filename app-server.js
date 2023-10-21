const express = require('express');
const app = express();

const port = 4444;

app.get('/', (req, res) => {
  res.redirect(307, 'http://example.org');
});

app.get('/file/*', (req, res) => {
  console.log('req.path:', req.path);
  res.set('x-secret-token', 'top-secret-token');
  res.redirect(307, 'http://127.0.0.1:4445' + req.path.replace(/^\/file/, ''));
});

app.get('/some-path', (req, res) => {
  res.send('ok');
});

app.get('/example/upstream_exists', (req, res) => {
  // use an example which actually exists :¬)
  res.redirect(307, 'http://example.com/index.html');
});

app.get('/example/upstream_404', (req, res) => {
  // example.com returns 404 for random URLs WITHOUT trailing slashes
  res.redirect(307, 'http://example.com/missing');
});


app.listen(port, () => {
  console.log(`App server listening on port ${port}.`);
});
