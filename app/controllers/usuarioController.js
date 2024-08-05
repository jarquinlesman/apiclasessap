const bcrypt = require('bcrypt');
const db = require('../config/db');
const service = require('../services/service');

module.exports = {
  signIn,
  createUser
};

async function createUser(req, res) {
  const { userId, pass } = req.body;

  if (!userId || !pass) {
    return res.status(400).send({ message: 'Parámetros faltantes' });
  }

  try {
    const hashedPassword = await bcrypt.hash(pass, 10);
    await db.query('INSERT INTO usuarios (usuario, pass) VALUES (?, ?)', [userId, hashedPassword]);
    res.status(201).send({ message: 'Usuario creado' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Error al crear el usuario' });
  }
}

async function signIn(req, res) {
  const { userId, pass } = req.body;

  if (!userId || !pass) {
    return res.status(400).send({ message: 'Parámetros faltantes' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE usuario = ?', [userId]);
    const user = rows[0];

    if (!user) {
      return res.status(404).send({ message: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(pass, user.pass);
    if (!isMatch) {
      return res.status(401).send({ message: 'Contraseña incorrecta' });
    }

    res.status(200).send({
      message: 'Logged in',
      userId: user.usuario,
      token: service.createToken(user.usuario)
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Sucedió un error inesperado' });
  }
}