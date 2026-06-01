const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use('/JS', express.static(path.join(__dirname, 'Calculator', 'JS')));

app.get('/calculator', (req, res) => {
    res.sendFile(path.join(__dirname, 'Calculator', 'HTML', 'index.html'));
});

app.get('/converter', (req, res) => {
    res.send('Тут буде сторінка конвертера одиниць виміру');
});

app.listen(port, () => {
    console.log(`Сервер запущено: http://localhost:${port}/calculator`);
});