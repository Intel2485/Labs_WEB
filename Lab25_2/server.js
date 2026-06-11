const express = require('express');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/book', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'book.html'));
});


app.use((req, res) => {
    res.status(404).send(`
        <!DOCTYPE html>
        <html lang="uk">
        <head>
            <meta charset="UTF-8">
            <title>404 — Сторінку не знайдено</title>
            <style>
                body { font-family: Georgia, serif; background: #d6d0c4;
                       display: flex; justify-content: center; align-items: center;
                       height: 100vh; margin: 0; flex-direction: column; }
                h1   { font-size: 4rem; color: #3b1f05; }
                p    { font-size: 1.2rem; color: #6b3e1a; }
                a    { color: #1a3a6b; }
            </style>
        </head>
        <body>
            <h1>⚓ 404</h1>
            <p>Цю сторінку змило хвилею. <a href="/">Повернутися на берег</a></p>
        </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`\n⚓  Сервер запущено!`);
    console.log(`   http://localhost:${PORT}/`);
    console.log(`   http://localhost:${PORT}/book  — Моя улюблена книга`);
});
