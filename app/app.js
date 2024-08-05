'use strict'

const express = require('express');
const cors = require('cors');
const App = express();
const bodyParser = require('body-parser');
//const periodoController = require('./controllers/periodoController');

App.use(cors());
App.use(express.json());
App.use(express.urlencoded({ extended: false }));

App.use(bodyParser.json())

//Declaro las rutas
const clases = require('./routes/clasesRoute');
const detalle_periodo = require('./routes/detalle_periodoRoute');
const periodo = require('./routes/periodoRoute');
const clase_docente = require('./routes/clases_docenteRoute');
const secciones_clase = require('./routes/secciones_claseRoute');
const ver_catedraticos = require('./routes/catedraticosRoute');
const ver_periodos = require('./routes/mostrar_periodosRoute');
const actualizar_detalle = require('./routes/actualizar_detalleRoute');
const login = require('./routes/usuarioRoute');

App.use('/api', clases);
App.use('/api', detalle_periodo);
App.use('/api', periodo);
App.use('/api', clase_docente);
App.use('/api', secciones_clase);
App.use('/api', ver_catedraticos);
App.use('/api', ver_periodos);
App.use('/api', actualizar_detalle);
App.use('/', login);

module.exports = App;