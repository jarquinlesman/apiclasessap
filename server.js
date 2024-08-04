const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

//obtener los datos de la bd
app.get('/api/bloques', (req, res) => {
    db.query('SELECT * FROM bloque', (err, results) => {
        if (err) {
            console.error('Error ejecutando la consulta:', err);
            res.status(500).send('Error en la consulta');
            return;
        }
        res.json(results);
    });
});

//insertar datos a la bd

//actualizar datos a la bd
app.patch('/api/bloques/:codigo_bloque', (req, res) => {
    const { codigo_bloque } = req.params;
    const { nombre_bloque } = req.body;

    if (!nombre_bloque) {
        return res.status(400).json({ error: 'El campo nombre_bloque es requerido' });
    }

    // Consulta SQL para actualizar el nombre del bloque
    const update = 'update bloque set nombre_bloque = ? where codigo_bloque = ?';
    const values = [nombre_bloque, codigo_bloque];

    // Ejecutar la consulta en la base de datos
    db.query(update, values, (err, results) => {
        if (err) {
            console.error('Error ejecutando la consulta:', err);
            return res.status(500).send('Error en la consulta');
        }

        // verificación
        if (results.changedRows === 0) {
            return res.status(404).json({ error: `No se encontró ningún bloque con el código ${codigo_bloque}` });
        }

        res.json({
            message: `Se actualizó correctamente el bloque con código ${codigo_bloque}`,
            affectedRows: results.affectedRows
        });
    });
});

//eliminar datos a la bd
app.delete('/api/bloques/:codigo_bloque', (req, res) => {
    const { codigo_bloque } = req.params;

    // Consulta SQL para eliminar el registro
    const deletee = 'delete from bloque where codigo_bloque = ?';
    const values = [codigo_bloque];

    // Ejecutar la consulta en la base de datos
    db.query(deletee, values, (err, results) => {
        if (err) {
            console.error('Error ejecutando la consulta:', err);
            return res.status(500).send('Error en la consulta');
        }
    });
});