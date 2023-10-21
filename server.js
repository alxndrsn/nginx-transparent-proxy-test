const express = require('express');
const app = express();

const port = 4444;

app.get('/', (req, res) => {
  res.redirect(307, 'http://example.com');
});

app.get('/download/*', (req, res) => {
  // use an example which actually exists :¬)
  res.redirect(307, 'http://example.com/index.html');
});


app.listen(port, () => {
  console.log(`Express server listening on port ${port}.`);
});
