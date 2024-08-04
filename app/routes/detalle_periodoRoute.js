const express = require('express');
const router = express.Router();
const { insertarDetallePeriodo } = require('../controllers/detalle_periodoController');

router.post('/detalle_periodo', insertarDetallePeriodo);

module.exports = router;