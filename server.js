const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

let seguidores = [];

app.use(express.json());

// --- Helper: normaliza el username para comparaciones/almacenado
const normalizeUsername = (u = '') => {
  const trimmed = String(u).trim();
  if (!trimmed) return '';
  // quita @ repetidos y fuerza minúsculas; añade un único '@' delante
  const noAt = trimmed.replace(/^@+/, '');
  return '@' + noAt.toLowerCase();
};

// Guarda/actualiza por (fecha + username)
app.post('/seguidores', (req, res) => {
  const { fecha, username, followers } = req.body;

  const uname = normalizeUsername(username);
  if (!fecha || !uname || typeof followers !== 'number') {
    return res.status(400).json({ status: 'error', message: 'fecha, username y followers son obligatorios' });
  }

  const idx = seguidores.findIndex(s => s.username === uname && s.fecha === fecha);
  const registro = { fecha, username: uname, followers };

  if (idx >= 0) seguidores[idx] = registro;     // idempotente si repites misma fecha+cuenta
  else seguidores.push(registro);

  res.json({ status: 'ok' });
});

app.get('/seguidores', (req, res) => {
  const { username, fecha } = req.query;

  const uname = normalizeUsername(username);
  if (!fecha || !uname) return res.json({});

  // Búsqueda tolerante: intenta tanto el normalizado como el raw por compatibilidad histórica
  const raw = String(username || '').trim().toLowerCase();
  const candidatos = new Set([
    uname,                           // p.ej. '@smartcret'
    raw,                             // p.ej. 'smartcret' o '@smartcret'
    raw.replace(/^@+/, '@')          // asegura un solo '@' si venía con varios o ninguno
  ]);

  const resultado = seguidores.find(s =>
    s.fecha === fecha && candidatos.has(String(s.username).toLowerCase())
  );

  res.json(resultado || {});
});

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
