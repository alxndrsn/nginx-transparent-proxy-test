const express = require('express');
const app = express();

const port = 4444;

app.get('/', (req, res) => {
  res.redirect(307, 'http://example.org');
});

app.get('/some-path', (req, res) => {
  res.send('ok');
});

app.get('/download/upstream_exists', (req, res) => {
  // use an example which actually exists :¬)
  res.redirect(307, 'http://example.com/index.html');
});

app.get('/download/upstream_404', (req, res) => {
  // example.com returns 404 for random URLs WITHOUT trailing slashes
  res.redirect(307, 'http://example.com/missing');
});


app.listen(port, () => {
  console.log(`Express server listening on port ${port}.`);
});
