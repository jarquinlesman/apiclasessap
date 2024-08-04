const express = require('express');
const router = express.Router();
const { clases_carrera } = require('../controllers/clasesController');

router.get('/carreras/:id_carrera/:id_periodo', clases_carrera);

module.exports = router;