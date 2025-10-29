const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

let seguidores = [];

app.use(express.json());

// 🔧 Función para normalizar el username
function normalizarUsuario(username = '') {
  return '@' + username.trim().replace(/^@/, '').toLowerCase().replace(/\s+/g, '_');
}

app.post('/seguidores', (req, res) => {
  const { fecha, username, followers } = req.body;
  if (!fecha || !username || followers == null) {
    return res.status(400).json({ status: 'error', message: 'Datos incompletos' });
  }

  const usernameNormalizado = normalizarUsuario(username);
  seguidores.push({ fecha, username: usernameNormalizado, followers });
  console.log('Guardado:', { fecha, username: usernameNormalizado, followers });
  res.json({ status: 'ok' });
});

app.get('/seguidores', (req, res) => {
  const { username, fecha } = req.query;
  if (!fecha || !username) {
    return res.status(400).json({ status: 'error', message: 'Faltan parámetros username o fecha' });
  }

  const usernameNormalizado = normalizarUsuario(username);
  const resultado = seguidores.find(
    s => s.username === usernameNormalizado && s.fecha === fecha
  );

  console.log('Buscando:', usernameNormalizado, '=>', resultado || 'No encontrado');
  res.json(resultado || {});
});

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
