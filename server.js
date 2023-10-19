const express = require('express');
const app = express();

const port = 4444;

app.get('/', (req, res) => {
  res.redirect('http://example.com');
});

app.listen(port, () => {
  console.log(`Express server listening on port ${port}.`);
});
