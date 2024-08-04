const express = require('express');
const router = express.Router();
const periodoController = require('../controllers/periodoController');

// Define la ruta que utiliza el controlador
router.post('/periodos', periodoController.periodos);

module.exports = router;