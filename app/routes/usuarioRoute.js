'use strict';

const express = require('express');
const usuarioController = require('../controllers/usuarioController');
const auth = require('../middlewares/auth');

const apiRoutes = express.Router();

apiRoutes.post('/login', usuarioController.signIn);
apiRoutes.post('/signUp', usuarioController.createUser); // Ruta para registrar nuevos usuarios

module.exports = apiRoutes;