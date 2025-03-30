const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Your on port 3000');
});
app.get('/jinglebell', (req, res) => {
  res.status(200).json({ message: 'Welcome to the server', status: '200' });
});
app.post('/', (req, res) => {
  res.send('You  can now post on server with port 3000');
});

const port = 3000;
app.listen(port, () => {
  console.log('listening for request......');
});
