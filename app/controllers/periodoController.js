const db = require('../config/db');

const periodos = (req, res) => {
    const datos = req.body;
    let periodo = datos.periodo;
    let fecha_ini = datos.fecha_inicio;
    let fecha_fin = datos.fecha_final;
    let year = datos.year;

    let id_periodo = '';

    // Convertir id_period en el formato deseado
    if (periodo === 'Periodo I') {
        id_periodo = 'I' + year;
    } else if (periodo === 'Periodo II') {
        id_periodo = 'II' + year;
    } else if (periodo === 'Periodo III') {
        id_periodo = 'III' + year;
    } else {
        res.status(400).send('Período no válido');
        return;
    }

    let insert_periodo = 'INSERT INTO periodos (id_periodo, fecha_inicio, fecha_final) VALUES (?, ?, ?)';

    db.query(insert_periodo, [id_periodo, fecha_ini, fecha_fin], (err, results) => {
        if (err) {
            console.error('Error ejecutando la consulta:', err);
            res.status(500).send('Error en la consulta');
            return;
        }
        console.log('Periodo registrado con éxito');
        res.json({ message: 'Periodo registrado con éxito', results });
    });
};

module.exports = { periodos };