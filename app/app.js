'use strict'

const express = require('express');
const cors = require('cors');
const App = express();
//const periodoController = require('./controllers/periodoController');

App.use(cors());
App.use(express.json());
App.use(express.urlencoded({ extended: false }));

//Declaro las rutas
const clases = require('./routes/clasesRoute');
const detalle_periodo = require('./routes/detalle_periodoRoute');
const periodo = require('./routes/periodoRoute');
const clase_docente = require('./routes/clases_docenteRoute');
const secciones_clase = require('./routes/secciones_claseRoute');

App.use('/api', clases);
App.use('/api', detalle_periodo);
App.use('/api', periodo);
App.use('/api', clase_docente);
App.use('/api', secciones_clase);

module.exports = App;