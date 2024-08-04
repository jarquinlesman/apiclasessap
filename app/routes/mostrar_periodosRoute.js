const express = require('express');
const router = express.Router();
const { mostrarPeriodos } = require('../controllers/mostrar_periodosController');

router.get('/periodos', mostrarPeriodos);

module.exports = router;