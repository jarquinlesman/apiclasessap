const express = require('express');
const router = express.Router();
const {seccion} = require('../controllers/secciones_claseController');

router.get('/secciones_clases/:id_clase/:id_periodo', seccion);

module.exports = router;