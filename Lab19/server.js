const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('public'));

app.get('/game', (req, res) => res.sendFile(path.join(__dirname, 'public', 'HTML', 'Lab19.html')));

app.listen(3000, () => console.log('TJOC Lab Server: http://localhost:3000'));