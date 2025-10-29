const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

let seguidores = [];

app.use(express.json());

// 🔧 Normaliza el username: @ al inicio, sin espacios, minúsculas, guiones bajos
function normalizarUsuario(username = '') {
  return '@' + username.trim().replace(/^@/, '').toLowerCase().replace(/\s+/g, '_');
}

// 🟢 POST: Guardar o actualizar seguidores por fecha + cuenta
app.post('/seguidores', (req, res) => {
  const { fecha, username, followers } = req.body;

  if (!fecha || !username || typeof followers !== 'number') {
    return res.status(400).json({ status: 'error', message: 'Datos incompletos' });
  }

  const usernameNormalizado = normalizarUsuario(username);

  // Idempotencia: si ya existe ese registro, actualízalo
  const idx = seguidores.findIndex(
    s => s.fecha === fecha && s.username === usernameNormalizado
  );

  const nuevoRegistro = { fecha, username: usernameNormalizado, followers };

  if (idx >= 0) {
    seguidores[idx] = nuevoRegistro;
    console.log('Actualizado:', nuevoRegistro);
  } else {
    seguidores.push(nuevoRegistro);
    console.log('Guardado:', nuevoRegistro);
  }

  res.json({ status: 'ok' });
});

// 🔎 GET: Consultar seguidores por fecha + cuenta
app.get('/seguidores', (req, res) => {
  const { username, fecha } = req.query;

  if (!fecha || !username) {
    return res.status(400).json({ status: 'error', message: 'Faltan parámetros username o fecha' });
  }

  const usernameNormalizado = normalizarUsuario(username);

  const resultado = seguidores.find(
    s => s.fecha === fecha && s.username === usernameNormalizado
  );

  console.log('Buscando:', usernameNormalizado, '=>', resultado || 'No encontrado');
  res.json(resultado || {});
});

// 🚀 Start
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
