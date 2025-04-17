const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;
const redis = require('redis');
let client;

app.get('/recommendation/:city', async (req, res) => {
  const city = req.params.city.toLowerCase();

  try {
    if (!client) {
      client = redis.createClient({
        host: 'localhost',
        port: 6379
      })

      client.connect();
    }

    const cacheKey = req.params.city;
    let data = await client.get(cacheKey);

    console.log('Cache:', data);

    data = data !== null ? JSON.parse(data) : null;

    const { city: nomeCidade, temp, unit } = data
      || await axios.get(`http://localhost:3001/weather/${city}`).then(response => response.data);

    if (!data) {
      client.set(
        cacheKey,
        JSON.stringify({ city: nomeCidade, temp, unit }),
        {
          ex: 60
        }
      );

      console.log('adicionou cache')
    }

    let suggestion = 'Está frio! Use um casaco.';

    if (temp > 30) suggestion = 'Está muito quente! Hidrate-se e use protetor solar.';
    else if (temp > 15) suggestion = 'O clima está agradável!';

    res.json({
      city: nomeCidade,
      temperature: temp,
      unit,
      recommendation: suggestion
    });
  }
  catch (error) {
    res.status(500).json({ error: 'Erro ao obter dados climáticos' });
  }
});

app.listen(PORT, () => {
  console.log(`API A rodando em http://localhost:${PORT}`);
});
