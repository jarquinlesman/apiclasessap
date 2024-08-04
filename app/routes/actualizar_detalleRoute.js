const express = require('express');
const router = express.Router();
const { actualizarDetallePeriodo } = require('../controllers/actualizar_detalleController');

router.put('/actualizar_seccion', actualizarDetallePeriodo);

module.exports = router;