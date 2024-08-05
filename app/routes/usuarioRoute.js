'use strict';

const express = require('express');
const usuarioController = require('../controllers/usuarioController');
const auth = require('../middlewares/auth');

const apiRoutes = express.Router();

apiRoutes.post('/login', usuarioController.signIn);

module.exports = apiRoutes;