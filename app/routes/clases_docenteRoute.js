
const express = require('express');
const router = express.Router();
const {filtro_docente} = require('../controllers/clases_docenteController');

router.get('/catedraticos/:id_catedratico/:id_periodo', filtro_docente);

module.exports = router;