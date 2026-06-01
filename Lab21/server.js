const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static(__dirname));

app.get('/api/square', (req, res) => {

    const num = parseFloat(req.query.number);

    if (isNaN(num)) {
        return res.status(400).json({ error: 'Будь ласка, передайте коректне число.' });
    }

    const square = num * num;

    res.json({
        original: num,
        square: square,
        message: `Ви ввели число ${num}. Його квадрат дорівнює ${square}.`
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend', 'HTML', 'index.html'));
});

app.listen(port, () => {
    console.log(`Сервер запущено: http://localhost:${port}`);
});