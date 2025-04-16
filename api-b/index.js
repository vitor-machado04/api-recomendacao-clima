const express = require('express');
const app = express();
const PORT = 3001;
const weatherMock = require('./mockApiB.js');

app.get('/weather/:city', (req, res) => {
    const city = req.params.city.toLowerCase();
    const data = weatherMock.weatherData[city];

    if (!data) {
        return res.status(404).json({ error: 'Cidade não encontrada' });
    }

    res.json(data);
});

app.listen(PORT, () => {
    console.log(`API B rodando em http://localhost:${PORT}`);
});
