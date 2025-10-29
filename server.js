const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

let seguidores = [];

app.use(express.json());

app.post('/seguidores', (req, res) => {
  const { fecha, username, followers } = req.body;
  seguidores.push({ fecha, username, followers });
  res.json({ status: 'ok' });
});

app.get('/seguidores', (req, res) => {
  const { username, fecha } = req.query;
  const resultado = seguidores.find(s => s.username === username && s.fecha === fecha);
  res.json(resultado || {});
});

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
