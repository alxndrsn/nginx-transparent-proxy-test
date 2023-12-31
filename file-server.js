const express = require('express');
const app = express();

const port = 4445;

app.get('/1', (req, res) => {
  if(req.headers.authorization !== 'top-secret-token') {
    res.status(403);
    res.send('denied');
    return;
  }
  if(req.headers['x-should-be-stripped']) {
    res.status(400);
    res.send('unexpected header');
    return;
  }
  res.send('one');
});


app.listen(port, () => {
  console.log(`File server listening on port ${port}.`);
});
