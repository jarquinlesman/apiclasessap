const express = require('express');
const router = express.Router();
const { mostrarCatedraticos } = require('../controllers/catedraticosController');

router.get('/catedraticos', mostrarCatedraticos);

module.exports = router;