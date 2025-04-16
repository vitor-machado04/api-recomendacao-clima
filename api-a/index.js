const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.get('/recommendation/:city', async (req, res) => {
  const city = req.params.city.toLowerCase();

  try {
    const response = await axios.get(`http://localhost:3001/weather/${city}`);
    const { city: nomeCidade, temp, unit } = response.data;

    let suggestion = '';
    if (temp > 30) {
      suggestion = 'Está muito quente! Hidrate-se e use protetor solar.';
    } 
    else if (temp > 15) {
      suggestion = 'O clima está agradável!';
    } 
    else {
      suggestion = 'Está frio! Use um casaco.';
    }

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
