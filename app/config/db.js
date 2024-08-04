'use strict'

const mysql = require('mysql2');

// Configura la conexión a la base de datos
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'clases'
});

// Exporta el pool para usarlo en otros archivos
module.exports = pool.promise(); // Usa `.promise()` para trabajar con Promesas